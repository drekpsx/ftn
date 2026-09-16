import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requireBusiness } from '@/lib/auth';
import { handleApiError } from '@/lib/api-utils';
import { computeQuoteTotals, computeDepositAmount } from '@/lib/quote-calc';
import { logActivity } from '@/lib/activities';
import type { Prisma } from '@prisma/client';

const itemSchema = z.object({
  label: z.string().trim().min(1),
  description: z.string().optional().nullable(),
  quantity: z.number().min(0),
  unitPrice: z.number(),
});

const createSchema = z.object({
  requestId: z.string().optional(),
  customerId: z.string().optional(),
  items: z.array(itemSchema).min(1),
  discount: z.number().min(0).default(0),
  taxRate: z.number().min(0).max(100).optional(),
  terms: z.string().max(5000).optional().nullable(),
  validUntil: z.string().optional().nullable(),
  depositType: z.enum(['NONE', 'PERCENT_10', 'PERCENT_20', 'PERCENT_30', 'PERCENT_50', 'FIXED']).optional(),
  depositAmount: z.number().min(0).optional().nullable(),
});

export async function GET(req: NextRequest) {
  try {
    const { business } = await requireBusiness();
    const status = req.nextUrl.searchParams.get('status');

    const where: Prisma.QuoteWhereInput = { businessId: business.id };
    if (status) where.status = status as Prisma.QuoteWhereInput['status'];

    const quotes = await prisma.quote.findMany({
      where,
      include: { customer: true },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ quotes });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const { business } = await requireBusiness();
    const body = createSchema.parse(await req.json());

    let customerId = body.customerId;
    let requestRecord = null;
    if (body.requestId) {
      requestRecord = await prisma.request.findFirst({ where: { id: body.requestId, businessId: business.id } });
      if (!requestRecord) {
        return NextResponse.json({ error: 'Demande introuvable.' }, { status: 404 });
      }
      customerId = requestRecord.customerId ?? undefined;
    }
    if (!customerId) {
      return NextResponse.json({ error: 'Un client est requis pour créer un devis.' }, { status: 400 });
    }
    const customer = await prisma.customer.findFirst({ where: { id: customerId, businessId: business.id } });
    if (!customer) {
      return NextResponse.json({ error: 'Client introuvable.' }, { status: 404 });
    }

    const taxRate = body.taxRate ?? business.defaultTaxRate;
    const { subtotal, taxAmount, total } = computeQuoteTotals(body.items, body.discount, taxRate);
    const depositType = body.depositType ?? business.depositType;
    const depositAmount =
      body.depositAmount ?? computeDepositAmount(total, depositType, business.depositFixedAmount);

    const validUntil = body.validUntil
      ? new Date(body.validUntil)
      : new Date(Date.now() + business.quoteValidityDays * 24 * 60 * 60 * 1000);

    const quote = await prisma.$transaction(async (tx) => {
      const biz = await tx.business.update({
        where: { id: business.id },
        data: { nextQuoteNumber: { increment: 1 } },
      });
      const number = `${business.quotePrefix}-${String(biz.nextQuoteNumber - 1).padStart(4, '0')}`;

      return tx.quote.create({
        data: {
          businessId: business.id,
          requestId: body.requestId,
          customerId: customer.id,
          number,
          status: 'DRAFT',
          subtotal,
          discount: body.discount,
          taxRate,
          taxAmount,
          total,
          terms: body.terms ?? business.defaultTerms,
          validUntil,
          depositType,
          depositAmount,
          items: { create: body.items.map((it, i) => ({ ...it, total: it.quantity * it.unitPrice, order: i })) },
        },
        include: { items: true, customer: true },
      });
    });

    if (body.requestId) {
      await prisma.request.update({ where: { id: body.requestId }, data: { status: 'QUOTE_TO_PREPARE' } });
      await logActivity({
        businessId: business.id,
        requestId: body.requestId,
        quoteId: quote.id,
        type: 'quote_created',
        message: `Devis ${quote.number} créé`,
      });
    }

    return NextResponse.json({ quote });
  } catch (error) {
    return handleApiError(error);
  }
}
