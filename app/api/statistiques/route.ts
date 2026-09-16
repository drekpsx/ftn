import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireBusiness } from '@/lib/auth';
import { handleApiError } from '@/lib/api-utils';
import { format, subDays } from 'date-fns';

export async function GET() {
  try {
    const { business } = await requireBusiness();

    const [visits, requestsTotal, quotesTotal, quotesAccepted, wonAgg, pendingAgg, requests, sourceEvents] = await Promise.all([
      prisma.analyticsEvent.count({ where: { businessId: business.id, type: 'page_view' } }),
      prisma.request.count({ where: { businessId: business.id } }),
      prisma.quote.count({ where: { businessId: business.id } }),
      prisma.quote.count({ where: { businessId: business.id, status: 'ACCEPTED' } }),
      prisma.quote.aggregate({ where: { businessId: business.id, status: 'ACCEPTED' }, _sum: { total: true } }),
      prisma.quote.aggregate({
        where: { businessId: business.id, status: { in: ['SENT', 'VIEWED'] } },
        _sum: { total: true },
      }),
      prisma.request.findMany({
        where: { businessId: business.id, createdAt: { gte: subDays(new Date(), 30) } },
        select: { createdAt: true, serviceId: true, service: { select: { name: true } } },
      }),
      prisma.analyticsEvent.groupBy({
        by: ['source'],
        where: { businessId: business.id, source: { not: null } },
        _count: { source: true },
      }),
    ]);

    const days: Record<string, number> = {};
    for (let i = 29; i >= 0; i--) {
      days[format(subDays(new Date(), i), 'yyyy-MM-dd')] = 0;
    }
    for (const r of requests) {
      const key = format(r.createdAt, 'yyyy-MM-dd');
      if (key in days) days[key] += 1;
    }
    const timeSeries = Object.entries(days).map(([date, count]) => ({ date, count }));

    const serviceCounts: Record<string, number> = {};
    for (const r of requests) {
      const name = r.service?.name || 'Non précisé';
      serviceCounts[name] = (serviceCounts[name] || 0) + 1;
    }
    const topService = Object.entries(serviceCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;

    const sourceBreakdown = sourceEvents.map((s) => ({ source: s.source, count: s._count.source }));

    return NextResponse.json({
      visits,
      requestsTotal,
      quotesTotal,
      quotesAccepted,
      conversionRate: requestsTotal > 0 ? Math.round((quotesAccepted / requestsTotal) * 100) : 0,
      wonRevenue: wonAgg._sum.total ?? 0,
      pendingRevenue: pendingAgg._sum.total ?? 0,
      topService,
      timeSeries,
      sourceBreakdown,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
