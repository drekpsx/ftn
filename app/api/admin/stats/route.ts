import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
import { handleApiError } from '@/lib/api-utils';
import { PLANS } from '@/lib/plans';

export async function GET() {
  try {
    await requireAdmin();

    const [totalUsers, totalBusinesses, subscriptions, totalRequests, thirtyDaysAgoUsers] = await Promise.all([
      prisma.user.count(),
      prisma.business.count(),
      prisma.subscription.groupBy({ by: ['plan'], _count: { plan: true } }),
      prisma.request.count(),
      prisma.user.count({ where: { createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } } }),
    ]);

    const planCounts: Record<string, number> = { FREE: 0, STARTER: 0, PRO: 0 };
    for (const s of subscriptions) planCounts[s.plan] = s._count.plan;

    const mrr = planCounts.STARTER * PLANS.STARTER.price + planCounts.PRO * PLANS.PRO.price;

    return NextResponse.json({
      totalUsers,
      totalBusinesses,
      totalRequests,
      newUsersLast30Days: thirtyDaysAgoUsers,
      planCounts,
      mrr,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
