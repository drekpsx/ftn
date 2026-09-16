import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireBusiness } from '@/lib/auth';
import { handleApiError, notFound } from '@/lib/api-utils';

export async function POST(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { business } = await requireBusiness();
    const original = await prisma.quote.findFirst({
      where: { id: params.id, businessId: business.id },
      include: { items: true },
    });
    if (!original) throw notFound('Devis introuvable.');

    const quote = await prisma.$transaction(async (tx) => {
      const biz = await tx.business.update({
        where: { id: business.id },
        data: { nextQuoteNumber: { increment: 1 } },
      });
      const number = `${business.quotePrefix}-${String(biz.nextQuoteNumber - 1).padStart(4, '0')}`;

      return tx.quote.create({
        data: {
          businessId: business.id,
          customerId: original.customerId,
          number,
          status: 'DRAFT',
          subtotal: original.subtotal,
          discount: original.discount,
          taxRate: original.taxRate,
          taxAmount: original.taxAmount,
          total: original.total,
          terms: original.terms,
          validUntil: original.validUntil,
          depositType: original.depositType,
          depositAmount: original.depositAmount,
          items: {
            create: original.items.map((it) => ({
              label: it.label,
              description: it.description,
              quantity: it.quantity,
              unitPrice: it.unitPrice,
              total: it.total,
              order: it.order,
            })),
          },
        },
        include: { items: true, customer: true },
      });
    });

    return NextResponse.json({ quote });
  } catch (error) {
    return handleApiError(error);
  }
}
