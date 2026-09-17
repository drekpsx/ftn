import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireBusiness } from '@/lib/auth';
import { handleApiError, notFound } from '@/lib/api-utils';
import { logActivity } from '@/lib/activities';

export async function POST(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { business } = await requireBusiness();
    const quote = await prisma.quote.findFirst({
      where: { id: params.id, businessId: business.id },
      include: { customer: true },
    });
    if (!quote) throw notFound('Devis introuvable.');

    const updated = await prisma.quote.update({
      where: { id: params.id },
      data: { status: 'SENT', sentAt: new Date() },
    });

    if (quote.requestId) {
      await prisma.request.update({ where: { id: quote.requestId }, data: { status: 'QUOTE_SENT' } });
    }

    await logActivity({
      businessId: business.id,
      quoteId: quote.id,
      requestId: quote.requestId ?? undefined,
      type: 'quote_sent',
      message: `Devis ${quote.number} envoyé à ${quote.customer.name}`,
    });

    return NextResponse.json({ quote: updated });
  } catch (error) {
    return handleApiError(error);
  }
}
