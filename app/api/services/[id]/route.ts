import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requireBusiness } from '@/lib/auth';
import { handleApiError, notFound } from '@/lib/api-utils';

const optionSchema = z.object({
  id: z.string().optional(),
  name: z.string().trim().min(1),
  priceDelta: z.number(),
});

const updateSchema = z.object({
  name: z.string().trim().min(1).max(150).optional(),
  description: z.string().max(2000).optional().nullable(),
  priceType: z.enum(['FIXED', 'STARTING_AT', 'RANGE', 'ON_QUOTE']).optional(),
  price: z.number().min(0).optional().nullable(),
  priceMin: z.number().min(0).optional().nullable(),
  priceMax: z.number().min(0).optional().nullable(),
  durationMinutes: z.number().int().min(0).optional().nullable(),
  active: z.boolean().optional(),
  order: z.number().int().optional(),
  options: z.array(optionSchema).optional(),
});

async function getOwnedService(businessId: string, id: string) {
  const service = await prisma.service.findFirst({ where: { id, businessId } });
  if (!service) throw notFound('Prestation introuvable.');
  return service;
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { business } = await requireBusiness();
    await getOwnedService(business.id, params.id);
    const body = updateSchema.parse(await req.json());

    const { options, ...rest } = body;

    const service = await prisma.$transaction(async (tx) => {
      if (options) {
        await tx.serviceOption.deleteMany({ where: { serviceId: params.id } });
        await tx.serviceOption.createMany({
          data: options.map((o, i) => ({ serviceId: params.id, name: o.name, priceDelta: o.priceDelta, order: i })),
        });
      }
      return tx.service.update({
        where: { id: params.id },
        data: rest,
        include: { options: { orderBy: { order: 'asc' } } },
      });
    });

    return NextResponse.json({ service });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { business } = await requireBusiness();
    await getOwnedService(business.id, params.id);
    await prisma.service.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
}
