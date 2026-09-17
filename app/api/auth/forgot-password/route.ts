import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { v4 as uuid } from 'uuid';
import { prisma } from '@/lib/prisma';
import { handleApiError } from '@/lib/api-utils';
import { sendEmail } from '@/lib/email';
import { resetPasswordEmail } from '@/emails/templates';
import { isRateLimited, getClientIp } from '@/lib/rate-limit';

const schema = z.object({ email: z.string().email() });

export async function POST(req: NextRequest) {
  try {
    if (isRateLimited(`forgot-password:${getClientIp(req.headers)}`, 5, 10 * 60 * 1000)) {
      return NextResponse.json({ error: 'Trop de tentatives. Réessayez dans quelques minutes.' }, { status: 429 });
    }

    const { email } = schema.parse(await req.json());
    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });

    // On répond toujours avec succès pour ne pas révéler si l'email existe.
    if (user) {
      const token = uuid();
      await prisma.passwordResetToken.create({
        data: { token, userId: user.id, expiresAt: new Date(Date.now() + 1000 * 60 * 60) },
      });
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
      await sendEmail({
        to: user.email,
        subject: 'Réinitialisation de votre mot de passe',
        html: resetPasswordEmail(`${appUrl}/reinitialiser-mot-de-passe?token=${token}`),
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
}
