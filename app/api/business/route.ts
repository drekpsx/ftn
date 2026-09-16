import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { getSessionUser, requireBusiness } from '@/lib/auth';
import { handleApiError } from '@/lib/api-utils';
import { slugify } from '@/lib/slug';
import { getActivity } from '@/lib/business-types';

const createSchema = z.object({
  activity: z.string().min(1),
  customActivity: z.string().optional(),
  name: z.string().trim().min(1, "Le nom de l'entreprise est requis.").max(150),
});

async function uniqueSlug(base: string) {
  const baseSlug = slugify(base) || 'entreprise';
  let slug = baseSlug;
  let i = 1;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const existing = await prisma.business.findUnique({ where: { slug } });
    if (!existing) return slug;
    i += 1;
    slug = `${baseSlug}-${i}`;
  }
}

export async function POST(req: NextRequest) {
  try {
    const sessionUser = await getSessionUser();
    if (!sessionUser) {
      const err = new Error('UNAUTHORIZED');
      err.name = 'UNAUTHORIZED';
      throw err;
    }

    const existing = await prisma.business.findUnique({ where: { ownerId: sessionUser.id } });
    if (existing) {
      return NextResponse.json({ error: 'Une entreprise existe déjà pour ce compte.' }, { status: 409 });
    }

    const body = createSchema.parse(await req.json());
    const activityLabel = body.activity === 'autre' && body.customActivity ? body.customActivity : getActivity(body.activity).label;
    const slug = await uniqueSlug(body.name);

    const business = await prisma.business.create({
      data: {
        ownerId: sessionUser.id,
        name: body.name,
        slug,
        activity: activityLabel,
        onboardingStep: 1,
        subscription: { create: { plan: 'FREE' } },
        automations: {
          create: [
            { type: 'quote_reminder', delayHours: 24, enabled: true, templateKey: 'reminder_1' },
            { type: 'quote_reminder', delayHours: 72, enabled: true, templateKey: 'reminder_2' },
          ],
        },
      },
    });

    return NextResponse.json({ business });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function GET() {
  try {
    const { business } = await requireBusiness();
    return NextResponse.json({ business });
  } catch (error) {
    return handleApiError(error);
  }
}

const updateSchema = z.object({
  name: z.string().trim().min(1).max(150).optional(),
  activity: z.string().optional(),
  description: z.string().max(2000).optional().nullable(),
  logoUrl: z.string().url().optional().nullable(),
  avatarUrl: z.string().url().optional().nullable(),
  coverUrl: z.string().url().optional().nullable(),
  primaryColor: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional(),
  phone: z.string().max(30).optional().nullable(),
  publicEmail: z.string().email().optional().nullable().or(z.literal('')),
  instagram: z.string().max(150).optional().nullable(),
  tiktok: z.string().max(150).optional().nullable(),
  website: z.string().max(200).optional().nullable(),
  address: z.string().max(300).optional().nullable(),
  quotePrefix: z.string().max(10).optional(),
  defaultTaxRate: z.number().min(0).max(100).optional(),
  quoteValidityDays: z.number().int().min(1).max(365).optional(),
  defaultTerms: z.string().max(5000).optional().nullable(),
  showPricingPublicly: z.boolean().optional(),
  allowIndexing: z.boolean().optional(),
  onboardingStep: z.number().int().min(0).max(10).optional(),
  onboardingCompleted: z.boolean().optional(),
  notifyOnRequest: z.boolean().optional(),
  notifyOnQuote: z.boolean().optional(),
  notifyOnPayment: z.boolean().optional(),
  depositType: z.enum(['NONE', 'PERCENT_10', 'PERCENT_20', 'PERCENT_30', 'PERCENT_50', 'FIXED']).optional(),
  depositFixedAmount: z.number().min(0).optional().nullable(),
});

export async function PATCH(req: NextRequest) {
  try {
    const { business } = await requireBusiness();
    const body = updateSchema.parse(await req.json());

    const updated = await prisma.business.update({
      where: { id: business.id },
      data: body,
    });

    return NextResponse.json({ business: updated });
  } catch (error) {
    return handleApiError(error);
  }
}
