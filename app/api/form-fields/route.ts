import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { requireBusiness } from '@/lib/auth';
import { handleApiError } from '@/lib/api-utils';
import { FIELD_TYPES } from '@/lib/field-types';

function toJsonInput(options: string[] | null | undefined) {
  if (options === null) return Prisma.JsonNull;
  return options;
}

const fieldSchema = z.object({
  label: z.string().trim().min(1, 'Le libellé est requis.').max(150),
  type: z.enum(FIELD_TYPES),
  required: z.boolean().optional(),
  options: z.array(z.string()).optional().nullable(),
  placeholder: z.string().max(200).optional().nullable(),
  showIfFieldId: z.string().optional().nullable(),
  showIfValue: z.string().optional().nullable(),
});

const bulkSchema = z.object({ fields: z.array(fieldSchema) });

export async function GET() {
  try {
    const { business } = await requireBusiness();
    const fields = await prisma.formField.findMany({
      where: { businessId: business.id },
      orderBy: { order: 'asc' },
    });
    return NextResponse.json({ fields });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const { business } = await requireBusiness();
    const json = await req.json();

    if (Array.isArray(json.fields)) {
      const body = bulkSchema.parse(json);
      const created = await prisma.$transaction(
        body.fields.map((f, i) =>
          prisma.formField.create({
            data: {
              businessId: business.id,
              label: f.label,
              type: f.type,
              required: f.required ?? false,
              options: toJsonInput(f.options),
              placeholder: f.placeholder,
              order: i,
            },
          })
        )
      );
      return NextResponse.json({ fields: created });
    }

    const body = fieldSchema.parse(json);
    const maxOrder = await prisma.formField.aggregate({
      where: { businessId: business.id },
      _max: { order: true },
    });

    const field = await prisma.formField.create({
      data: {
        businessId: business.id,
        label: body.label,
        type: body.type,
        required: body.required ?? false,
        options: toJsonInput(body.options),
        placeholder: body.placeholder,
        showIfFieldId: body.showIfFieldId || null,
        showIfValue: body.showIfValue || null,
        order: (maxOrder._max.order ?? 0) + 1,
      },
    });

    return NextResponse.json({ field });
  } catch (error) {
    return handleApiError(error);
  }
}
