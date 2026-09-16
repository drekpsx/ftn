import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requireBusiness } from '@/lib/auth';
import { handleApiError } from '@/lib/api-utils';
import type { Prisma } from '@prisma/client';

export async function GET(req: NextRequest) {
  try {
    const { business } = await requireBusiness();
    const q = req.nextUrl.searchParams.get('q');

    const where: Prisma.CustomerWhereInput = { businessId: business.id };
    if (q) {
      where.OR = [
        { name: { contains: q, mode: 'insensitive' } },
        { email: { contains: q, mode: 'insensitive' } },
        { phone: { contains: q, mode: 'insensitive' } },
      ];
    }

    const customers = await prisma.customer.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: { _count: { select: { requests: true, quotes: true } } },
    });

    return NextResponse.json({ customers });
  } catch (error) {
    return handleApiError(error);
  }
}

const createSchema = z.object({
  name: z.string().trim().min(1, 'Le nom est requis.').max(150),
  email: z.string().trim().email('Adresse email invalide.'),
  phone: z.string().max(30).optional().nullable(),
  company: z.string().max(150).optional().nullable(),
  address: z.string().max(300).optional().nullable(),
});

export async function POST(req: NextRequest) {
  try {
    const { business } = await requireBusiness();
    const body = createSchema.parse(await req.json());

    const customer = await prisma.customer.upsert({
      where: { businessId_email: { businessId: business.id, email: body.email.toLowerCase() } },
      update: { name: body.name, phone: body.phone, company: body.company, address: body.address },
      create: {
        businessId: business.id,
        name: body.name,
        email: body.email.toLowerCase(),
        phone: body.phone,
        company: body.company,
        address: body.address,
      },
    });

    return NextResponse.json({ customer });
  } catch (error) {
    return handleApiError(error);
  }
}
