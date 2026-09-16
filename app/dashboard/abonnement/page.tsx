'use client';

import { useEffect, useState } from 'react';
import { Check } from 'lucide-react';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { PLANS, type PlanId } from '@/lib/plans';

type Subscription = { plan: PlanId; status: string; cancelAtPeriodEnd: boolean; currentPeriodEnd: string | null };

export default function SubscriptionPage() {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loadingPlan, setLoadingPlan] = useState<PlanId | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/business')
      .then((r) => r.json())
      .then((d) => setSubscription(d.business.subscription));
  }, []);

  async function upgrade(plan: PlanId) {
    if (plan === 'FREE') return;
    setLoadingPlan(plan);
    setError(null);
    try {
      const res = await fetch('/api/billing/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else setError(data.error || 'Paiement indisponible pour le moment.');
    } finally {
      setLoadingPlan(null);
    }
  }

  async function manageBilling() {
    const res = await fetch('/api/billing/portal', { method: 'POST' });
    const data = await res.json();
    if (data.url) window.location.href = data.url;
    else setError(data.error || 'Portail de facturation indisponible.');
  }

  const currentPlan = subscription?.plan ?? 'FREE';

  return (
    <div>
      <PageHeader title="Abonnement" subtitle="Choisissez le forfait adapté à votre activité." />

      {error && <div className="mb-4 rounded-xl bg-red-50 px-3.5 py-2.5 text-sm text-red-700">{error}</div>}

      <div className="grid gap-6 sm:grid-cols-3">
        {(Object.keys(PLANS) as PlanId[]).map((planId) => {
          const plan = PLANS[planId];
          const isCurrent = currentPlan === planId;
          return (
            <div key={planId} className={`card p-6 ${isCurrent ? 'ring-2 ring-brand-500' : ''}`}>
              <h2 className="text-lg font-semibold text-gray-900">{plan.name}</h2>
              <p className="mt-1 text-3xl font-bold text-gray-900">
                {plan.price}€<span className="text-sm font-normal text-gray-400">/mois</span>
              </p>
              <ul className="mt-4 space-y-2 text-sm text-gray-600">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-500" /> {f}
                  </li>
                ))}
              </ul>
              <button
                disabled={isCurrent || loadingPlan === planId || planId === 'FREE'}
                onClick={() => upgrade(planId)}
                className={`mt-6 w-full ${isCurrent ? 'btn-secondary' : 'btn-primary'}`}
              >
                {isCurrent ? 'Forfait actuel' : loadingPlan === planId ? 'Redirection...' : `Passer à ${plan.name}`}
              </button>
            </div>
          );
        })}
      </div>

      {subscription?.plan !== 'FREE' && (
        <div className="mt-6">
          <button onClick={manageBilling} className="btn-secondary">
            Gérer ma facturation
          </button>
          {subscription?.cancelAtPeriodEnd && (
            <p className="mt-2 text-sm text-amber-600">
              Votre abonnement sera annulé le {subscription.currentPeriodEnd && new Date(subscription.currentPeriodEnd).toLocaleDateString('fr-FR')}.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
