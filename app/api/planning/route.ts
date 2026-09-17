import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireBusiness } from '@/lib/auth';
import { handleApiError } from '@/lib/api-utils';

export async function GET(req: NextRequest) {
  try {
    const { business } = await requireBusiness();
    const month = req.nextUrl.searchParams.get('month');
    const now = new Date();
    const [y, m] = month ? month.split('-').map(Number) : [now.getUTCFullYear(), now.getUTCMonth() + 1];

    // On élargit d'une semaine de chaque côté pour couvrir les jours du mois
    // précédent/suivant visibles dans la grille du calendrier.
    const rangeStart = new Date(Date.UTC(y, m - 1, 1));
    rangeStart.setUTCDate(rangeStart.getUTCDate() - 7);
    const rangeEnd = new Date(Date.UTC(y, m, 1));
    rangeEnd.setUTCDate(rangeEnd.getUTCDate() + 7);

    const [requests, unavailability] = await Promise.all([
      prisma.request.findMany({
        where: { businessId: business.id, desiredDate: { gte: rangeStart, lt: rangeEnd } },
        select: {
          id: true,
          clientName: true,
          status: true,
          desiredDate: true,
          service: { select: { name: true } },
        },
        orderBy: { desiredDate: 'asc' },
      }),
      prisma.unavailability.findMany({
        where: { businessId: business.id, date: { gte: rangeStart, lt: rangeEnd } },
      }),
    ]);

    return NextResponse.json({ requests, unavailability });
  } catch (error) {
    return handleApiError(error);
  }
}
