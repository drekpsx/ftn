import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(_req: NextRequest, { params }: { params: { token: string } }) {
  const quote = await prisma.quote.findUnique({
    where: { publicToken: params.token },
    include: {
      items: { orderBy: { order: 'asc' } },
      customer: true,
      business: {
        select: { name: true, logoUrl: true, primaryColor: true, phone: true, publicEmail: true, address: true },
      },
      payments: { where: { status: 'SUCCEEDED' } },
    },
  });

  if (!quote) {
    return NextResponse.json({ error: 'Devis introuvable.' }, { status: 404 });
  }

  if (quote.status === 'SENT' && !quote.viewedAt) {
    await prisma.quote.update({ where: { id: quote.id }, data: { status: 'VIEWED', viewedAt: new Date() } });
    quote.status = 'VIEWED';
  }

  return NextResponse.json({ quote });
}
