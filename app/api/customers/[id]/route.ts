import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requireBusiness } from '@/lib/auth';
import { handleApiError, notFound } from '@/lib/api-utils';

async function getOwned(businessId: string, id: string) {
  const customer = await prisma.customer.findFirst({
    where: { id, businessId },
    include: {
      requests: { orderBy: { createdAt: 'desc' }, include: { service: true } },
      quotes: { orderBy: { createdAt: 'desc' } },
      payments: { orderBy: { createdAt: 'desc' } },
    },
  });
  if (!customer) throw notFound('Client introuvable.');
  return customer;
}

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { business } = await requireBusiness();
    const customer = await getOwned(business.id, params.id);
    return NextResponse.json({ customer });
  } catch (error) {
    return handleApiError(error);
  }
}

const updateSchema = z.object({
  name: z.string().trim().min(1).max(150).optional(),
  phone: z.string().max(30).optional().nullable(),
  company: z.string().max(150).optional().nullable(),
  address: z.string().max(300).optional().nullable(),
  notes: z.string().max(5000).optional().nullable(),
  tags: z.array(z.string()).optional(),
});

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { business } = await requireBusiness();
    await getOwned(business.id, params.id);
    const body = updateSchema.parse(await req.json());

    const customer = await prisma.customer.update({ where: { id: params.id }, data: body });
    return NextResponse.json({ customer });
  } catch (error) {
    return handleApiError(error);
  }
}
