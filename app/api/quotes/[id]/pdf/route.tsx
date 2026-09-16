import { NextRequest, NextResponse } from 'next/server';
import { renderToBuffer } from '@react-pdf/renderer';
import { prisma } from '@/lib/prisma';
import { requireBusiness } from '@/lib/auth';
import { handleApiError, notFound } from '@/lib/api-utils';
import { QuotePdf } from '@/components/pdf/QuotePdf';

export const runtime = 'nodejs';

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { business } = await requireBusiness();
    const quote = await prisma.quote.findFirst({
      where: { id: params.id, businessId: business.id },
      include: { items: { orderBy: { order: 'asc' } }, customer: true },
    });
    if (!quote) throw notFound('Devis introuvable.');

    const buffer = await renderToBuffer(
      <QuotePdf
        business={{ name: business.name, address: business.address, phone: business.phone, publicEmail: business.publicEmail }}
        quote={quote}
      />
    );

    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="${quote.number}.pdf"`,
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}
