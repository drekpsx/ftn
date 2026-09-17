'use client';

import { useEffect, useState } from 'react';
import { LineChart, Line, ResponsiveContainer, XAxis, Tooltip } from 'recharts';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { ErrorState } from '@/components/dashboard/ErrorState';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

type Stats = {
  visits: number;
  requestsTotal: number;
  quotesTotal: number;
  quotesAccepted: number;
  conversionRate: number;
  wonRevenue: number;
  pendingRevenue: number;
  topService: string | null;
  timeSeries: { date: string; count: number }[];
  sourceBreakdown: { source: string | null; count: number }[];
};

const SOURCE_LABELS: Record<string, string> = {
  instagram: 'Instagram',
  tiktok: 'TikTok',
  website: 'Site internet',
  qr: 'QR code',
  direct: 'Lien direct',
};

export default function StatisticsPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  function loadStats() {
    setLoadError(null);
    fetch('/api/statistiques')
      .then(async (r) => {
        const data = await r.json().catch(() => ({}));
        if (!r.ok) throw new Error(data.error || 'Une erreur est survenue.');
        return data;
      })
      .then(setStats)
      .catch((e) => setLoadError(e.message || 'Impossible de charger les statistiques.'));
  }

  useEffect(() => {
    loadStats();
  }, []);

  if (loadError) {
    return (
      <div>
        <PageHeader title="Statistiques" subtitle="Suivez la performance de votre page publique et de vos devis." />
        <ErrorState message={loadError} onRetry={loadStats} />
      </div>
    );
  }

  if (!stats) return <p className="text-sm text-gray-400">Chargement...</p>;

  const totalSourceCount = stats.sourceBreakdown.reduce((s, x) => s + x.count, 0);

  return (
    <div>
      <PageHeader title="Statistiques" subtitle="Suivez la performance de votre page publique et de vos devis." />

      <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {[
          { label: 'Visiteurs', value: stats.visits },
          { label: 'Demandes', value: stats.requestsTotal },
          { label: 'Devis créés', value: stats.quotesTotal },
          { label: 'Devis acceptés', value: stats.quotesAccepted },
          { label: 'Taux de conversion', value: `${stats.conversionRate}%` },
        ].map((s) => (
          <div key={s.label} className="card p-4">
            <p className="text-xl font-semibold text-gray-900">{s.value}</p>
            <p className="text-xs text-gray-500">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="card p-6 lg:col-span-2">
          <h2 className="mb-4 font-semibold">Demandes (30 derniers jours)</h2>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={stats.timeSeries}>
              <XAxis
                dataKey="date"
                tickFormatter={(d) => format(new Date(d), 'd MMM', { locale: fr })}
                interval={4}
                tick={{ fontSize: 11, fill: '#9ca3af' }}
              />
              <Tooltip labelFormatter={(d) => format(new Date(d as string), 'd MMMM yyyy', { locale: fr })} />
              <Line type="monotone" dataKey="count" stroke="#0d8a68" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-6">
          <h2 className="mb-4 font-semibold">Sources des demandes</h2>
          {stats.sourceBreakdown.length === 0 ? (
            <p className="text-sm text-gray-400">Pas encore de données.</p>
          ) : (
            <div className="space-y-3">
              {stats.sourceBreakdown.map((s) => (
                <div key={s.source}>
                  <div className="mb-1 flex justify-between text-sm">
                    <span className="text-gray-600">{SOURCE_LABELS[s.source || ''] || s.source}</span>
                    <span className="font-medium text-gray-800">{s.count}</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-gray-100">
                    <div
                      className="h-1.5 rounded-full bg-brand-500"
                      style={{ width: `${totalSourceCount ? (s.count / totalSourceCount) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 grid gap-6 sm:grid-cols-3">
        <div className="card p-6">
          <p className="text-sm text-gray-500">Chiffre d&apos;affaires gagné</p>
          <p className="mt-1 text-2xl font-semibold text-emerald-600">{stats.wonRevenue.toFixed(0)} €</p>
        </div>
        <div className="card p-6">
          <p className="text-sm text-gray-500">Chiffre d&apos;affaires potentiel</p>
          <p className="mt-1 text-2xl font-semibold text-gray-700">{stats.pendingRevenue.toFixed(0)} €</p>
        </div>
        <div className="card p-6">
          <p className="text-sm text-gray-500">Prestation la plus demandée</p>
          <p className="mt-1 text-2xl font-semibold text-gray-700">{stats.topService || '—'}</p>
        </div>
      </div>
    </div>
  );
}
