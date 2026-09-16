import { redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { DashboardShell } from '@/components/dashboard/DashboardShell';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const sessionUser = await getSessionUser();
  if (!sessionUser) redirect('/connexion');

  const business = await prisma.business.findUnique({ where: { ownerId: sessionUser.id } });
  if (!business) redirect('/onboarding');
  if (!business.onboardingCompleted) redirect('/onboarding');

  return (
    <DashboardShell businessName={business.name} slug={business.slug}>
      {children}
    </DashboardShell>
  );
}
