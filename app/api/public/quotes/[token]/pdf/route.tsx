import { NextRequest, NextResponse } from 'next/server';
import { renderToBuffer } from '@react-pdf/renderer';
import { prisma } from '@/lib/prisma';
import { QuotePdf } from '@/components/pdf/QuotePdf';

export const runtime = 'nodejs';

export async function GET(_req: NextRequest, { params }: { params: { token: string } }) {
  const quote = await prisma.quote.findUnique({
    where: { publicToken: params.token },
    include: { items: { orderBy: { order: 'asc' } }, customer: true, business: true },
  });
  if (!quote) {
    return NextResponse.json({ error: 'Devis introuvable.' }, { status: 404 });
  }

  const buffer = await renderToBuffer(
    <QuotePdf
      business={{
        name: quote.business.name,
        address: quote.business.address,
        phone: quote.business.phone,
        publicEmail: quote.business.publicEmail,
      }}
      quote={quote}
    />
  );

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="${quote.number}.pdf"`,
    },
  });
}
