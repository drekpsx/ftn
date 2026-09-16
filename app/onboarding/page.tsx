import { redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { OnboardingWizard } from '@/components/onboarding/OnboardingWizard';

export default async function OnboardingPage() {
  const sessionUser = await getSessionUser();
  if (!sessionUser) redirect('/connexion');

  const business = await prisma.business.findUnique({ where: { ownerId: sessionUser.id } });
  if (business?.onboardingCompleted) redirect('/dashboard');

  return <OnboardingWizard existingBusiness={business} />;
}
