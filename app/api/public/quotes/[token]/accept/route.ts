import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { logActivity, notify } from '@/lib/activities';
import { sendEmail } from '@/lib/email';
import { quoteAcceptedOwnerEmail } from '@/emails/templates';
import { isRateLimited, getClientIp } from '@/lib/rate-limit';

const schema = z.object({
  signatureName: z.string().trim().min(1, 'Merci de saisir votre nom pour confirmer.'),
  comment: z.string().max(2000).optional(),
});

export async function POST(req: NextRequest, { params }: { params: { token: string } }) {
  const ip = getClientIp(req.headers);
  if (isRateLimited(`quote-action:${ip}`, 20, 10 * 60 * 1000)) {
    return NextResponse.json({ error: 'Trop de tentatives. Réessayez plus tard.' }, { status: 429 });
  }

  try {
    const quote = await prisma.quote.findUnique({
      where: { publicToken: params.token },
      include: { customer: true, business: true },
    });
    if (!quote) return NextResponse.json({ error: 'Devis introuvable.' }, { status: 404 });
    if (quote.status === 'ACCEPTED' || quote.status === 'REFUSED') {
      return NextResponse.json({ error: 'Ce devis a déjà reçu une réponse.' }, { status: 400 });
    }
    if (quote.validUntil && quote.validUntil < new Date()) {
      return NextResponse.json({ error: 'Ce devis a expiré.' }, { status: 400 });
    }

    const { signatureName, comment } = schema.parse(await req.json());

    const updated = await prisma.quote.update({
      where: { id: quote.id },
      data: {
        status: 'ACCEPTED',
        respondedAt: new Date(),
        signatureName,
        clientComment: comment,
      },
    });

    if (quote.requestId) {
      await prisma.request.update({ where: { id: quote.requestId }, data: { status: 'ACCEPTED' } });
    }

    await logActivity({
      businessId: quote.businessId,
      quoteId: quote.id,
      requestId: quote.requestId ?? undefined,
      type: 'quote_accepted',
      message: `Devis ${quote.number} accepté par ${quote.customer.name}`,
    });

    if (quote.business.notifyOnQuote) {
      await notify({
        businessId: quote.businessId,
        type: 'quote_accepted',
        message: `${quote.customer.name} a accepté le devis ${quote.number}`,
        link: `/dashboard/devis/${quote.id}`,
      });
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    if (quote.business.publicEmail) {
      await sendEmail({
        to: quote.business.publicEmail,
        subject: 'Devis accepté',
        html: quoteAcceptedOwnerEmail({
          clientName: quote.customer.name,
          quoteNumber: quote.number,
          link: `${appUrl}/dashboard/devis/${quote.id}`,
        }),
      });
    }

    const requiresDeposit = Boolean(updated.depositAmount && updated.depositAmount > 0);

    return NextResponse.json({ quote: updated, requiresDeposit });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Merci de compléter le formulaire.' }, { status: 400 });
    }
    console.error(error);
    return NextResponse.json({ error: 'Une erreur est survenue.' }, { status: 500 });
  }
}
