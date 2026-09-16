import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requireBusiness } from '@/lib/auth';
import { handleApiError, notFound } from '@/lib/api-utils';

const updateSchema = z.object({
  label: z.string().trim().min(1).max(150).optional(),
  required: z.boolean().optional(),
  options: z.array(z.string()).optional(),
  placeholder: z.string().max(200).optional().nullable(),
  order: z.number().int().optional(),
  showIfFieldId: z.string().optional().nullable(),
  showIfValue: z.string().optional().nullable(),
});

async function getOwned(businessId: string, id: string) {
  const field = await prisma.formField.findFirst({ where: { id, businessId } });
  if (!field) throw notFound('Champ introuvable.');
  return field;
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { business } = await requireBusiness();
    await getOwned(business.id, params.id);
    const body = updateSchema.parse(await req.json());

    const field = await prisma.formField.update({
      where: { id: params.id },
      data: {
        ...body,
        showIfFieldId: body.showIfFieldId === '' ? null : body.showIfFieldId,
      },
    });

    return NextResponse.json({ field });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { business } = await requireBusiness();
    await getOwned(business.id, params.id);
    await prisma.formField.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
}
