import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requireBusiness } from '@/lib/auth';
import { handleApiError, notFound } from '@/lib/api-utils';

const updateSchema = z.object({
  enabled: z.boolean().optional(),
  delayHours: z.number().int().min(1).max(720).optional(),
});

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { business } = await requireBusiness();
    const existing = await prisma.automation.findFirst({ where: { id: params.id, businessId: business.id } });
    if (!existing) throw notFound('Automatisation introuvable.');

    const body = updateSchema.parse(await req.json());
    const automation = await prisma.automation.update({ where: { id: params.id }, data: body });
    return NextResponse.json({ automation });
  } catch (error) {
    return handleApiError(error);
  }
}
