import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireBusiness } from '@/lib/auth';
import { handleApiError } from '@/lib/api-utils';

export async function GET() {
  try {
    const { business } = await requireBusiness();

    const [newRequests, pendingRequests, quotesSent, quotesAccepted, totalRequests, acceptedQuotesAgg, pendingQuotesAgg, upcoming, activities] =
      await Promise.all([
        prisma.request.count({ where: { businessId: business.id, status: 'NEW' } }),
        prisma.request.count({
          where: { businessId: business.id, status: { in: ['NEW', 'TO_PROCESS', 'QUOTE_TO_PREPARE'] } },
        }),
        prisma.quote.count({ where: { businessId: business.id, status: { in: ['SENT', 'VIEWED'] } } }),
        prisma.quote.count({ where: { businessId: business.id, status: 'ACCEPTED' } }),
        prisma.request.count({ where: { businessId: business.id } }),
        prisma.quote.aggregate({ where: { businessId: business.id, status: 'ACCEPTED' }, _sum: { total: true } }),
        prisma.quote.aggregate({
          where: { businessId: business.id, status: { in: ['SENT', 'VIEWED'] } },
          _sum: { total: true },
        }),
        prisma.request.findMany({
          where: { businessId: business.id, desiredDate: { gte: new Date() } },
          orderBy: { desiredDate: 'asc' },
          take: 5,
          select: { id: true, clientName: true, desiredDate: true, service: { select: { name: true } } },
        }),
        prisma.activity.findMany({
          where: { businessId: business.id },
          orderBy: { createdAt: 'desc' },
          take: 10,
        }),
      ]);

    const conversionRate = totalRequests > 0 ? Math.round((quotesAccepted / totalRequests) * 100) : 0;

    return NextResponse.json({
      newRequests,
      pendingRequests,
      quotesSent,
      quotesAccepted,
      wonRevenue: acceptedQuotesAgg._sum.total ?? 0,
      pendingRevenue: pendingQuotesAgg._sum.total ?? 0,
      conversionRate,
      upcoming,
      activities,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
