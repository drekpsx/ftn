import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requireBusiness } from '@/lib/auth';
import { handleApiError } from '@/lib/api-utils';

const schema = z.object({ ids: z.array(z.string()) });

export async function POST(req: NextRequest) {
  try {
    const { business } = await requireBusiness();
    const { ids } = schema.parse(await req.json());

    const owned = await prisma.formField.findMany({
      where: { businessId: business.id, id: { in: ids } },
      select: { id: true },
    });
    const ownedIds = new Set(owned.map((f) => f.id));

    await prisma.$transaction(
      ids
        .filter((id) => ownedIds.has(id))
        .map((id, index) => prisma.formField.update({ where: { id }, data: { order: index } }))
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
}
