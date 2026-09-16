'use client';

import { useEffect, useState } from 'react';

type Stats = {
  totalUsers: number;
  totalBusinesses: number;
  totalRequests: number;
  newUsersLast30Days: number;
  planCounts: Record<string, number>;
  mrr: number;
};

export default function AdminOverviewPage() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch('/api/admin/stats')
      .then((r) => r.json())
      .then(setStats);
  }, []);

  if (!stats) return <p className="text-sm text-gray-400">Chargement...</p>;

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold text-gray-900">Vue d&apos;ensemble</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="card p-5">
          <p className="text-2xl font-semibold">{stats.totalUsers}</p>
          <p className="text-sm text-gray-500">Utilisateurs</p>
        </div>
        <div className="card p-5">
          <p className="text-2xl font-semibold">{stats.totalBusinesses}</p>
          <p className="text-sm text-gray-500">Entreprises actives</p>
        </div>
        <div className="card p-5">
          <p className="text-2xl font-semibold">{stats.newUsersLast30Days}</p>
          <p className="text-sm text-gray-500">Nouveaux (30 jours)</p>
        </div>
        <div className="card p-5">
          <p className="text-2xl font-semibold">{stats.mrr} €</p>
          <p className="text-sm text-gray-500">MRR estimé</p>
        </div>
      </div>

      <div className="card mt-6 p-6">
        <h2 className="mb-4 font-semibold">Répartition des abonnements</h2>
        <div className="grid grid-cols-3 gap-4 text-center">
          {Object.entries(stats.planCounts).map(([plan, count]) => (
            <div key={plan}>
              <p className="text-xl font-semibold">{count}</p>
              <p className="text-sm text-gray-500">{plan}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="card mt-6 p-6">
        <p className="text-sm text-gray-500">Total des demandes reçues sur la plateforme</p>
        <p className="mt-1 text-2xl font-semibold">{stats.totalRequests}</p>
      </div>
    </div>
  );
}
