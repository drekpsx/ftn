import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { saveUploadedFile } from '@/lib/storage';
import { isRateLimited, getClientIp } from '@/lib/rate-limit';
import { logActivity, notify } from '@/lib/activities';
import { sendEmail } from '@/lib/email';
import { newRequestOwnerEmail, requestReceivedClientEmail } from '@/emails/templates';
import { planAllowsMoreRequests, type PlanId } from '@/lib/plans';
import type { Prisma } from '@prisma/client';

const answerSchema = z.object({
  fieldId: z.string(),
  label: z.string(),
  value: z.unknown(),
});

const bodySchema = z.object({
  name: z.string().trim().min(1, 'Le nom est requis.').max(150),
  email: z.string().trim().email('Adresse email invalide.'),
  phone: z.string().max(30).optional(),
  serviceId: z.string().optional(),
  source: z.string().max(30).optional(),
  selectedOptions: z.array(z.string()).optional(),
  answers: z.array(answerSchema),
});

export async function POST(req: NextRequest, { params }: { params: { slug: string } }) {
  const ip = getClientIp(req.headers);
  if (isRateLimited(`submit:${ip}`, 10, 10 * 60 * 1000)) {
    return NextResponse.json(
      { error: 'Trop de demandes envoyées. Merci de réessayer dans quelques minutes.' },
      { status: 429 }
    );
  }

  try {
    const business = await prisma.business.findUnique({
      where: { slug: params.slug },
      include: { subscription: true },
    });
    if (!business) {
      return NextResponse.json({ error: 'Page introuvable.' }, { status: 404 });
    }

    const plan = (business.subscription?.plan ?? 'FREE') as PlanId;
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    const requestsThisMonth = await prisma.request.count({
      where: { businessId: business.id, createdAt: { gte: startOfMonth } },
    });
    if (!planAllowsMoreRequests(plan, requestsThisMonth)) {
      return NextResponse.json(
        { error: "Ce professionnel a atteint sa limite de demandes pour ce mois. Merci de le contacter directement." },
        { status: 403 }
      );
    }

    const formData = await req.formData();
    const rawAnswers = formData.get('answers');
    const rawSelectedOptions = formData.get('selectedOptions');

    const parsed = bodySchema.parse({
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone') || undefined,
      serviceId: formData.get('serviceId') || undefined,
      source: formData.get('source') || undefined,
      selectedOptions: rawSelectedOptions ? JSON.parse(rawSelectedOptions as string) : [],
      answers: rawAnswers ? JSON.parse(rawAnswers as string) : [],
    });

    const fields = await prisma.formField.findMany({ where: { businessId: business.id } });
    const fieldsById = new Map(fields.map((f) => [f.id, f]));

    let service = null;
    if (parsed.serviceId) {
      service = await prisma.service.findFirst({
        where: { id: parsed.serviceId, businessId: business.id },
        include: { options: true },
      });
    }

    let desiredDate: Date | null = null;
    const finalAnswers: { fieldId: string; label: string; value: unknown }[] = [];

    for (const answer of parsed.answers) {
      const field = fieldsById.get(answer.fieldId);
      if (!field) continue;

      if (field.type === 'FILE' && typeof answer.value === 'string' && answer.value.startsWith('__FILE__')) {
        const file = formData.get(`file_${field.id}`);
        if (file instanceof File) {
          const saved = await saveUploadedFile(file, business.id);
          finalAnswers.push({ fieldId: field.id, label: field.label, value: saved.url });
          continue;
        }
        finalAnswers.push({ fieldId: field.id, label: field.label, value: null });
        continue;
      }

      if (field.type === 'DATE' && typeof answer.value === 'string' && answer.value && !desiredDate) {
        const d = new Date(answer.value);
        if (!Number.isNaN(d.getTime())) desiredDate = d;
      }

      finalAnswers.push({ fieldId: field.id, label: field.label, value: answer.value });
    }

    if (desiredDate) {
      // desiredDate vient d'une chaîne "yyyy-MM-dd", donc interprétée en UTC minuit :
      // on compare tout en UTC pour rester cohérent avec le stockage des jours bloqués.
      const desiredDayStart = new Date(
        Date.UTC(desiredDate.getUTCFullYear(), desiredDate.getUTCMonth(), desiredDate.getUTCDate())
      );
      const now = new Date();
      const todayStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));

      if (desiredDayStart < todayStart) {
        return NextResponse.json({ error: "La date choisie est déjà passée." }, { status: 400 });
      }

      const blocked = await prisma.unavailability.findUnique({
        where: { businessId_date: { businessId: business.id, date: desiredDayStart } },
      });
      if (blocked) {
        return NextResponse.json(
          { error: "Cette date n'est plus disponible. Merci d'en choisir une autre." },
          { status: 400 }
        );
      }
    }

    let estimatedPrice: number | null = null;
    if (service) {
      const optionsTotal = service.options
        .filter((o) => parsed.selectedOptions?.includes(o.id))
        .reduce((sum, o) => sum + o.priceDelta, 0);
      if (service.priceType === 'FIXED' || service.priceType === 'STARTING_AT') {
        estimatedPrice = (service.price ?? 0) + optionsTotal;
      } else if (service.priceType === 'RANGE') {
        estimatedPrice = (service.priceMax ?? 0) + optionsTotal;
      }
    }

    const customer = await prisma.customer.upsert({
      where: { businessId_email: { businessId: business.id, email: parsed.email.toLowerCase() } },
      update: { name: parsed.name, phone: parsed.phone || undefined },
      create: {
        businessId: business.id,
        name: parsed.name,
        email: parsed.email.toLowerCase(),
        phone: parsed.phone,
      },
    });

    const request = await prisma.request.create({
      data: {
        businessId: business.id,
        customerId: customer.id,
        serviceId: service?.id,
        clientName: parsed.name,
        clientEmail: parsed.email.toLowerCase(),
        clientPhone: parsed.phone,
        desiredDate,
        answers: finalAnswers as unknown as Prisma.InputJsonValue,
        estimatedPrice,
        source: parsed.source,
      },
    });

    await prisma.analyticsEvent.create({
      data: { businessId: business.id, type: 'form_submit', source: parsed.source },
    });

    await logActivity({
      businessId: business.id,
      requestId: request.id,
      type: 'request_received',
      message: `Demande reçue de ${parsed.name}${service ? ` pour ${service.name}` : ''}`,
    });

    if (business.notifyOnRequest) {
      await notify({
        businessId: business.id,
        type: 'new_request',
        message: `Nouvelle demande de ${parsed.name}`,
        link: `/dashboard/demandes/${request.id}`,
      });
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const ownerEmail = business.publicEmail;
    if (ownerEmail && business.notifyOnRequest) {
      await sendEmail({
        to: ownerEmail,
        subject: 'Nouvelle demande reçue',
        html: newRequestOwnerEmail({
          businessName: business.name,
          clientName: parsed.name,
          serviceName: service?.name,
          dashboardLink: `${appUrl}/dashboard/demandes/${request.id}`,
        }),
      });
    }
    await sendEmail({
      to: parsed.email,
      subject: 'Votre demande a bien été envoyée',
      html: requestReceivedClientEmail({ businessName: business.name, clientFirstName: parsed.name.split(' ')[0] }),
    });

    return NextResponse.json({ success: true, requestId: request.id });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Formulaire incomplet ou invalide.' }, { status: 400 });
    }
    console.error(error);
    return NextResponse.json({ error: "Une erreur est survenue. Merci de réessayer." }, { status: 500 });
  }
}
