'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Inbox, FileText, CheckCircle2, TrendingUp, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { OnboardingChecklist } from '@/components/dashboard/OnboardingChecklist';

type Summary = {
  newRequests: number;
  pendingRequests: number;
  quotesSent: number;
  quotesAccepted: number;
  wonRevenue: number;
  pendingRevenue: number;
  conversionRate: number;
  upcoming: { id: string; clientName: string; desiredDate: string; service: { name: string } | null }[];
  activities: { id: string; message: string; createdAt: string }[];
};

function StatCard({ icon: Icon, label, value, sub }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string | number; sub?: string }) {
  return (
    <div className="card card-hover p-5">
      <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-brand-50 to-brand-100 text-brand-600">
        <Icon className="h-5 w-5" />
      </div>
      <p className="text-2xl font-semibold text-gray-900">{value}</p>
      <p className="text-sm text-gray-500">{label}</p>
      {sub && <p className="mt-1 text-xs text-gray-400">{sub}</p>}
    </div>
  );
}

export default function DashboardHome() {
  const [summary, setSummary] = useState<Summary | null>(null);

  useEffect(() => {
    fetch('/api/dashboard/summary')
      .then((r) => r.json())
      .then(setSummary);
  }, []);

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold text-gray-900">Tableau de bord</h1>

      <OnboardingChecklist />

      {summary && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard icon={Inbox} label="Nouvelles demandes" value={summary.newRequests} />
            <StatCard icon={FileText} label="Devis envoyés" value={summary.quotesSent} />
            <StatCard icon={CheckCircle2} label="Devis acceptés" value={summary.quotesAccepted} />
            <StatCard icon={TrendingUp} label="Taux de conversion" value={`${summary.conversionRate}%`} />
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-3">
            <div className="card p-6 lg:col-span-2">
              <h2 className="mb-4 font-semibold">Chiffre d&apos;affaires</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-2xl font-semibold text-emerald-600">{summary.wonRevenue.toFixed(0)} €</p>
                  <p className="text-sm text-gray-500">Gagné (devis acceptés)</p>
                </div>
                <div>
                  <p className="text-2xl font-semibold text-gray-700">{summary.pendingRevenue.toFixed(0)} €</p>
                  <p className="text-sm text-gray-500">Potentiel (devis en attente)</p>
                </div>
              </div>

              <h2 className="mb-3 mt-8 font-semibold">Activité récente</h2>
              {summary.activities.length === 0 ? (
                <p className="text-sm text-gray-400">Aucune activité pour le moment.</p>
              ) : (
                <div className="space-y-2">
                  {summary.activities.map((a) => (
                    <div key={a.id} className="flex justify-between text-sm">
                      <span className="text-gray-700">{a.message}</span>
                      <span className="text-gray-400">{format(new Date(a.createdAt), 'd MMM HH:mm', { locale: fr })}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="card p-6">
              <h2 className="mb-3 flex items-center gap-2 font-semibold">
                <Calendar className="h-4 w-4" /> Prochains rendez-vous
              </h2>
              {summary.upcoming.length === 0 ? (
                <p className="text-sm text-gray-400">Aucun rendez-vous à venir.</p>
              ) : (
                <div className="space-y-3">
                  {summary.upcoming.map((r) => (
                    <Link key={r.id} href={`/dashboard/demandes/${r.id}`} className="block rounded-lg px-3 py-2 hover:bg-gray-50">
                      <p className="text-sm font-medium text-gray-800">{r.clientName}</p>
                      <p className="text-xs text-gray-500">
                        {r.service?.name} · {format(new Date(r.desiredDate), 'd MMMM yyyy', { locale: fr })}
                      </p>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
