import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requireBusiness } from '@/lib/auth';
import { handleApiError, notFound } from '@/lib/api-utils';
import { computeQuoteTotals, computeDepositAmount } from '@/lib/quote-calc';

const itemSchema = z.object({
  label: z.string().trim().min(1),
  description: z.string().optional().nullable(),
  quantity: z.number().min(0),
  unitPrice: z.number(),
});

const updateSchema = z.object({
  items: z.array(itemSchema).optional(),
  discount: z.number().min(0).optional(),
  taxRate: z.number().min(0).max(100).optional(),
  terms: z.string().max(5000).optional().nullable(),
  validUntil: z.string().optional().nullable(),
  depositType: z.enum(['NONE', 'PERCENT_10', 'PERCENT_20', 'PERCENT_30', 'PERCENT_50', 'FIXED']).optional(),
  depositAmount: z.number().min(0).optional().nullable(),
});

async function getOwned(businessId: string, id: string) {
  const quote = await prisma.quote.findFirst({
    where: { id, businessId },
    include: { items: { orderBy: { order: 'asc' } }, customer: true, request: true },
  });
  if (!quote) throw notFound('Devis introuvable.');
  return quote;
}

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { business } = await requireBusiness();
    const quote = await getOwned(business.id, params.id);
    return NextResponse.json({ quote });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { business } = await requireBusiness();
    const existing = await getOwned(business.id, params.id);
    if (existing.status === 'ACCEPTED' || existing.status === 'REFUSED') {
      return NextResponse.json({ error: 'Ce devis ne peut plus être modifié.' }, { status: 400 });
    }
    const body = updateSchema.parse(await req.json());

    const items = body.items ?? existing.items;
    const discount = body.discount ?? existing.discount;
    const taxRate = body.taxRate ?? existing.taxRate;
    const { subtotal, taxAmount, total } = computeQuoteTotals(items, discount, taxRate);
    const depositType = body.depositType ?? existing.depositType;
    const depositAmount =
      body.depositAmount !== undefined ? body.depositAmount : computeDepositAmount(total, depositType, existing.depositAmount);

    const quote = await prisma.$transaction(async (tx) => {
      if (body.items) {
        await tx.quoteItem.deleteMany({ where: { quoteId: params.id } });
        await tx.quoteItem.createMany({
          data: body.items.map((it, i) => ({
            quoteId: params.id,
            label: it.label,
            description: it.description,
            quantity: it.quantity,
            unitPrice: it.unitPrice,
            total: it.quantity * it.unitPrice,
            order: i,
          })),
        });
      }
      return tx.quote.update({
        where: { id: params.id },
        data: {
          discount,
          taxRate,
          subtotal,
          taxAmount,
          total,
          terms: body.terms,
          validUntil: body.validUntil ? new Date(body.validUntil) : undefined,
          depositType,
          depositAmount,
        },
        include: { items: { orderBy: { order: 'asc' } }, customer: true },
      });
    });

    return NextResponse.json({ quote });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { business } = await requireBusiness();
    const existing = await getOwned(business.id, params.id);
    if (existing.status !== 'DRAFT') {
      return NextResponse.json({ error: 'Seuls les brouillons peuvent être supprimés.' }, { status: 400 });
    }
    await prisma.quote.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
}
