import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { logActivity, notify } from '@/lib/activities';
import { isRateLimited, getClientIp } from '@/lib/rate-limit';

const schema = z.object({ comment: z.string().max(2000).optional() });

export async function POST(req: NextRequest, { params }: { params: { token: string } }) {
  const ip = getClientIp(req.headers);
  if (isRateLimited(`quote-action:${ip}`, 20, 10 * 60 * 1000)) {
    return NextResponse.json({ error: 'Trop de tentatives. Réessayez plus tard.' }, { status: 429 });
  }

  try {
    const quote = await prisma.quote.findUnique({ where: { publicToken: params.token }, include: { customer: true } });
    if (!quote) return NextResponse.json({ error: 'Devis introuvable.' }, { status: 404 });
    if (quote.status === 'ACCEPTED' || quote.status === 'REFUSED') {
      return NextResponse.json({ error: 'Ce devis a déjà reçu une réponse.' }, { status: 400 });
    }

    const { comment } = schema.parse(await req.json());

    const updated = await prisma.quote.update({
      where: { id: quote.id },
      data: { status: 'REFUSED', respondedAt: new Date(), clientComment: comment },
    });

    if (quote.requestId) {
      await prisma.request.update({ where: { id: quote.requestId }, data: { status: 'REFUSED' } });
    }

    await logActivity({
      businessId: quote.businessId,
      quoteId: quote.id,
      requestId: quote.requestId ?? undefined,
      type: 'quote_refused',
      message: `Devis ${quote.number} refusé par ${quote.customer.name}`,
    });

    await notify({
      businessId: quote.businessId,
      type: 'quote_refused',
      message: `${quote.customer.name} a refusé le devis ${quote.number}`,
      link: `/dashboard/devis/${quote.id}`,
    });

    return NextResponse.json({ quote: updated });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Une erreur est survenue.' }, { status: 500 });
  }
}
