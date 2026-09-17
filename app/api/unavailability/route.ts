import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requireBusiness } from '@/lib/auth';
import { handleApiError } from '@/lib/api-utils';

function toDateOnly(iso: string) {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}

export async function GET(req: NextRequest) {
  try {
    const { business } = await requireBusiness();
    const month = req.nextUrl.searchParams.get('month');

    const where: { businessId: string; date?: { gte: Date; lt: Date } } = { businessId: business.id };
    if (month) {
      const [y, m] = month.split('-').map(Number);
      where.date = { gte: new Date(Date.UTC(y, m - 1, 1)), lt: new Date(Date.UTC(y, m, 1)) };
    }

    const dates = await prisma.unavailability.findMany({ where, orderBy: { date: 'asc' } });
    return NextResponse.json({ dates });
  } catch (error) {
    return handleApiError(error);
  }
}

const toggleSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date invalide.'),
  reason: z.string().max(200).optional().nullable(),
});

export async function POST(req: NextRequest) {
  try {
    const { business } = await requireBusiness();
    const body = toggleSchema.parse(await req.json());
    const date = toDateOnly(body.date);

    const existing = await prisma.unavailability.findUnique({
      where: { businessId_date: { businessId: business.id, date } },
    });

    if (existing) {
      await prisma.unavailability.delete({ where: { id: existing.id } });
      return NextResponse.json({ blocked: false });
    }

    await prisma.unavailability.create({
      data: { businessId: business.id, date, reason: body.reason || null },
    });
    return NextResponse.json({ blocked: true });
  } catch (error) {
    return handleApiError(error);
  }
}
