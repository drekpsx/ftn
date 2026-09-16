import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
import { handleApiError, notFound } from '@/lib/api-utils';

export async function POST(_req: Request, { params }: { params: { id: string } }) {
  try {
    await requireAdmin();
    const user = await prisma.user.findUnique({ where: { id: params.id } });
    if (!user) throw notFound('Utilisateur introuvable.');

    const updated = await prisma.user.update({
      where: { id: params.id },
      data: { suspended: !user.suspended },
    });

    return NextResponse.json({ user: updated });
  } catch (error) {
    return handleApiError(error);
  }
}
