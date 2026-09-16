import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireBusiness } from '@/lib/auth';
import { handleApiError, notFound } from '@/lib/api-utils';
import { logActivity, notify } from '@/lib/activities';
import { sendEmail } from '@/lib/email';
import { quoteSentEmail } from '@/emails/templates';

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

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    await sendEmail({
      to: quote.customer.email,
      subject: `Votre devis ${quote.number}`,
      html: quoteSentEmail({
        businessName: business.name,
        clientFirstName: quote.customer.name.split(' ')[0],
        quoteNumber: quote.number,
        link: `${appUrl}/devis/${quote.publicToken}`,
      }),
    });

    return NextResponse.json({ quote: updated });
  } catch (error) {
    return handleApiError(error);
  }
}
