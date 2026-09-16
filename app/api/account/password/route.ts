import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';
import { hashPassword, verifyPassword } from '@/lib/passwords';
import { handleApiError } from '@/lib/api-utils';

const schema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8, 'Le mot de passe doit contenir au moins 8 caractères.'),
});

export async function POST(req: NextRequest) {
  try {
    const sessionUser = await getSessionUser();
    if (!sessionUser) {
      const err = new Error('UNAUTHORIZED');
      err.name = 'UNAUTHORIZED';
      throw err;
    }

    const { currentPassword, newPassword } = schema.parse(await req.json());
    const user = await prisma.user.findUnique({ where: { id: sessionUser.id } });
    if (!user) {
      const err = new Error('UNAUTHORIZED');
      err.name = 'UNAUTHORIZED';
      throw err;
    }

    const valid = await verifyPassword(currentPassword, user.passwordHash);
    if (!valid) {
      return NextResponse.json({ error: 'Mot de passe actuel incorrect.' }, { status: 400 });
    }

    const passwordHash = await hashPassword(newPassword);
    await prisma.user.update({ where: { id: user.id }, data: { passwordHash } });

    return NextResponse.json({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
}
