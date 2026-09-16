import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requireBusiness } from '@/lib/auth';
import { handleApiError } from '@/lib/api-utils';
import { planAllowsMoreServices } from '@/lib/plans';

const optionSchema = z.object({
  name: z.string().trim().min(1),
  priceDelta: z.number(),
});

const serviceSchema = z.object({
  name: z.string().trim().min(1, 'Le nom est requis.').max(150),
  description: z.string().max(2000).optional().nullable(),
  priceType: z.enum(['FIXED', 'STARTING_AT', 'RANGE', 'ON_QUOTE']),
  price: z.number().min(0).optional().nullable(),
  priceMin: z.number().min(0).optional().nullable(),
  priceMax: z.number().min(0).optional().nullable(),
  durationMinutes: z.number().int().min(0).optional().nullable(),
  active: z.boolean().optional(),
  options: z.array(optionSchema).optional(),
});

export async function GET() {
  try {
    const { business } = await requireBusiness();
    const services = await prisma.service.findMany({
      where: { businessId: business.id },
      include: { options: { orderBy: { order: 'asc' } } },
      orderBy: { order: 'asc' },
    });
    return NextResponse.json({ services });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const { business } = await requireBusiness();
    const plan = business.subscription?.plan ?? 'FREE';

    const count = await prisma.service.count({ where: { businessId: business.id } });
    if (!planAllowsMoreServices(plan, count)) {
      return NextResponse.json(
        { error: 'Limite de prestations atteinte pour votre offre. Passez à un forfait supérieur.' },
        { status: 403 }
      );
    }

    const body = serviceSchema.parse(await req.json());
    const maxOrder = await prisma.service.aggregate({
      where: { businessId: business.id },
      _max: { order: true },
    });

    const service = await prisma.service.create({
      data: {
        businessId: business.id,
        name: body.name,
        description: body.description,
        priceType: body.priceType,
        price: body.price,
        priceMin: body.priceMin,
        priceMax: body.priceMax,
        durationMinutes: body.durationMinutes,
        active: body.active ?? true,
        order: (maxOrder._max.order ?? 0) + 1,
        options: body.options
          ? { create: body.options.map((o, i) => ({ name: o.name, priceDelta: o.priceDelta, order: i })) }
          : undefined,
      },
      include: { options: true },
    });

    return NextResponse.json({ service });
  } catch (error) {
    return handleApiError(error);
  }
}
