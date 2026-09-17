import { type NextAuthOptions, getServerSession } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';

const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000;

export const authOptions: NextAuthOptions = {
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/connexion',
  },
  providers: [
    CredentialsProvider({
      name: 'Identifiants',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Mot de passe', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email.toLowerCase().trim() },
        });
        if (!user) return null;
        if (user.suspended) throw new Error('Ce compte a été suspendu.');

        if (user.lockedUntil && user.lockedUntil > new Date()) {
          const minutes = Math.ceil((user.lockedUntil.getTime() - Date.now()) / 60000);
          throw new Error(
            `Trop de tentatives échouées. Réessayez dans ${minutes} minute${minutes > 1 ? 's' : ''}.`
          );
        }

        const valid = await bcrypt.compare(credentials.password, user.passwordHash);
        if (!valid) {
          const attempts = user.failedLoginAttempts + 1;
          await prisma.user.update({
            where: { id: user.id },
            data: {
              failedLoginAttempts: attempts >= MAX_FAILED_ATTEMPTS ? 0 : attempts,
              lockedUntil: attempts >= MAX_FAILED_ATTEMPTS ? new Date(Date.now() + LOCKOUT_DURATION_MS) : null,
            },
          });
          return null;
        }

        // Vérification d'email : n'est exigée que si l'envoi automatique est
        // configuré (RESEND_API_KEY), pour ne jamais bloquer les comptes tant
        // que ce service optionnel et gratuit n'a pas été activé.
        if (process.env.RESEND_API_KEY && !user.emailVerified) {
          throw new Error('Confirmez votre adresse email avant de vous connecter (lien envoyé lors de votre inscription).');
        }

        if (user.failedLoginAttempts > 0 || user.lockedUntil) {
          await prisma.user.update({ where: { id: user.id }, data: { failedLoginAttempts: 0, lockedUntil: null } });
        }

        return {
          id: user.id,
          email: user.email,
          name: `${user.firstName} ${user.lastName}`,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.uid = user.id;
        token.role = (user as { role?: string }).role ?? 'USER';
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { id?: string }).id = token.uid as string;
        (session.user as { role?: string }).role = token.role as string;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export async function getSessionUser() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return null;
  return session.user as { id: string; email: string; name?: string; role: string };
}

/**
 * Charge l'utilisateur courant et son entreprise. Lève une erreur si non authentifié.
 * Toutes les routes de l'API doivent passer par ici pour garantir l'isolation des données.
 */
export async function requireBusiness() {
  const sessionUser = await getSessionUser();
  if (!sessionUser) {
    const err = new Error('UNAUTHORIZED');
    err.name = 'UNAUTHORIZED';
    throw err;
  }

  const business = await prisma.business.findUnique({
    where: { ownerId: sessionUser.id },
    include: { subscription: true },
  });

  if (!business) {
    const err = new Error('NO_BUSINESS');
    err.name = 'NO_BUSINESS';
    throw err;
  }

  return { sessionUser, business };
}

export async function requireAdmin() {
  const sessionUser = await getSessionUser();
  if (!sessionUser || sessionUser.role !== 'ADMIN') {
    const err = new Error('FORBIDDEN');
    err.name = 'FORBIDDEN';
    throw err;
  }
  return sessionUser;
}
