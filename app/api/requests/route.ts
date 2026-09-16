import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireBusiness } from '@/lib/auth';
import { handleApiError } from '@/lib/api-utils';
import type { Prisma } from '@prisma/client';

const PAGE_SIZE = 20;

export async function GET(req: NextRequest) {
  try {
    const { business } = await requireBusiness();
    const { searchParams } = req.nextUrl;

    const status = searchParams.get('status');
    const serviceId = searchParams.get('serviceId');
    const q = searchParams.get('q');
    const page = Math.max(1, Number(searchParams.get('page') || 1));

    const where: Prisma.RequestWhereInput = { businessId: business.id };
    if (status) where.status = status as Prisma.RequestWhereInput['status'];
    if (serviceId) where.serviceId = serviceId;
    if (q) {
      where.OR = [
        { clientName: { contains: q, mode: 'insensitive' } },
        { clientEmail: { contains: q, mode: 'insensitive' } },
        { clientPhone: { contains: q, mode: 'insensitive' } },
      ];
    }

    const [requests, total] = await Promise.all([
      prisma.request.findMany({
        where,
        include: { service: true },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * PAGE_SIZE,
        take: PAGE_SIZE,
      }),
      prisma.request.count({ where }),
    ]);

    return NextResponse.json({ requests, total, page, pageSize: PAGE_SIZE });
  } catch (error) {
    return handleApiError(error);
  }
}
