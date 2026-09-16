import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { requireBusiness } from '@/lib/auth';
import { handleApiError, notFound } from '@/lib/api-utils';
import { FIELD_TYPES } from '@/lib/field-types';

const updateSchema = z.object({
  label: z.string().trim().min(1).max(150).optional(),
  type: z.enum(FIELD_TYPES).optional(),
  required: z.boolean().optional(),
  options: z.array(z.string()).optional().nullable(),
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
        label: body.label,
        type: body.type,
        required: body.required,
        options: body.options === null ? Prisma.JsonNull : body.options,
        placeholder: body.placeholder,
        order: body.order,
        showIfFieldId: body.showIfFieldId === '' ? null : body.showIfFieldId,
        showIfValue: body.showIfValue,
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
