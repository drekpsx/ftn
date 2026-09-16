import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { v4 as uuid } from 'uuid';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/passwords';
import { handleApiError } from '@/lib/api-utils';
import { sendEmail } from '@/lib/email';
import { verifyEmail, welcomeEmail } from '@/emails/templates';

const schema = z.object({
  firstName: z.string().trim().min(1, 'Le prénom est requis.').max(100),
  lastName: z.string().trim().min(1, 'Le nom est requis.').max(100),
  email: z.string().trim().email('Adresse email invalide.').max(255),
  password: z.string().min(8, 'Le mot de passe doit contenir au moins 8 caractères.').max(200),
});

export async function POST(req: NextRequest) {
  try {
    const body = schema.parse(await req.json());
    const email = body.email.toLowerCase();

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { error: 'Un compte existe déjà avec cette adresse email.' },
        { status: 409 }
      );
    }

    const passwordHash = await hashPassword(body.password);

    const user = await prisma.user.create({
      data: {
        firstName: body.firstName,
        lastName: body.lastName,
        email,
        passwordHash,
      },
    });

    const token = uuid();
    await prisma.verificationToken.create({
      data: {
        token,
        userId: user.id,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
      },
    });

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    await sendEmail({
      to: email,
      subject: 'Bienvenue sur Flotik',
      html: welcomeEmail(user.firstName),
    });
    await sendEmail({
      to: email,
      subject: 'Confirmez votre adresse email',
      html: verifyEmail(`${appUrl}/api/auth/verify-email?token=${token}`),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
}
