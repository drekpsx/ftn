import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { hashPassword, isPasswordStrongEnough, PASSWORD_REQUIREMENTS_MESSAGE } from '@/lib/passwords';
import { handleApiError } from '@/lib/api-utils';

const schema = z.object({
  token: z.string().min(1),
  password: z.string().max(200).refine(isPasswordStrongEnough, PASSWORD_REQUIREMENTS_MESSAGE),
});

export async function POST(req: NextRequest) {
  try {
    const { token, password } = schema.parse(await req.json());

    const record = await prisma.passwordResetToken.findUnique({ where: { token } });
    if (!record || record.usedAt || record.expiresAt < new Date()) {
      return NextResponse.json({ error: 'Ce lien de réinitialisation est invalide ou a expiré.' }, { status: 400 });
    }

    const passwordHash = await hashPassword(password);
    await prisma.$transaction([
      prisma.user.update({
        where: { id: record.userId },
        data: { passwordHash, failedLoginAttempts: 0, lockedUntil: null },
      }),
      prisma.passwordResetToken.update({ where: { token }, data: { usedAt: new Date() } }),
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
}
