export type PlanId = 'FREE' | 'STARTER' | 'PRO';

export const PLANS: Record<
  PlanId,
  {
    name: string;
    price: number;
    maxRequestsPerMonth: number | null;
    maxServices: number | null;
    features: string[];
  }
> = {
  FREE: {
    name: 'Gratuit',
    price: 0,
    maxRequestsPerMonth: 5,
    maxServices: 3,
    features: ['5 demandes par mois', '3 prestations', 'Page publique', 'Formulaire', 'Devis'],
  },
  STARTER: {
    name: 'Starter',
    price: 9,
    maxRequestsPerMonth: null,
    maxServices: null,
    features: [
      'Demandes illimitées',
      'Prestations illimitées',
      'Devis illimités',
      'CRM',
      'Automatisations',
      'Statistiques',
    ],
  },
  PRO: {
    name: 'Pro',
    price: 19,
    maxRequestsPerMonth: null,
    maxServices: null,
    features: [
      'Tout Starter',
      'Paiements et acomptes',
      'Relances avancées',
      'Branding avancé',
      'Statistiques avancées',
      'Sans logo FlowDevis',
    ],
  },
};

export function planAllowsMoreRequests(plan: PlanId, currentCountThisMonth: number): boolean {
  const max = PLANS[plan].maxRequestsPerMonth;
  if (max === null) return true;
  return currentCountThisMonth < max;
}

export function planAllowsMoreServices(plan: PlanId, currentCount: number): boolean {
  const max = PLANS[plan].maxServices;
  if (max === null) return true;
  return currentCount < max;
}
