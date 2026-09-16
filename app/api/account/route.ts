import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { handleApiError } from '@/lib/api-utils';

export async function DELETE() {
  try {
    const sessionUser = await getSessionUser();
    if (!sessionUser) {
      const err = new Error('UNAUTHORIZED');
      err.name = 'UNAUTHORIZED';
      throw err;
    }

    // La suppression cascade sur Business et toutes ses données liées (RGPD).
    await prisma.user.delete({ where: { id: sessionUser.id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
}
