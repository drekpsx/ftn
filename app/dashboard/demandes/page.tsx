'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Inbox, Search } from 'lucide-react';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { EmptyState } from '@/components/dashboard/EmptyState';
import { REQUEST_STATUS_COLORS, REQUEST_STATUS_LABELS } from '@/lib/status';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

type RequestRow = {
  id: string;
  clientName: string;
  clientEmail: string;
  status: string;
  createdAt: string;
  desiredDate: string | null;
  estimatedPrice: number | null;
  service: { name: string } | null;
};

export default function RequestsPage() {
  const [requests, setRequests] = useState<RequestRow[] | null>(null);
  const [status, setStatus] = useState('');
  const [q, setQ] = useState('');

  useEffect(() => {
    const params = new URLSearchParams();
    if (status) params.set('status', status);
    if (q) params.set('q', q);
    const timeout = setTimeout(() => {
      fetch(`/api/requests?${params.toString()}`)
        .then((r) => r.json())
        .then((d) => setRequests(d.requests));
    }, 250);
    return () => clearTimeout(timeout);
  }, [status, q]);

  return (
    <div>
      <PageHeader title="Demandes" subtitle="Toutes les demandes reçues depuis votre page publique." />

      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            className="input pl-9"
            placeholder="Rechercher un nom, email, téléphone..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
        <select className="input sm:w-56" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">Tous les statuts</option>
          {Object.entries(REQUEST_STATUS_LABELS).map(([k, v]) => (
            <option key={k} value={k}>
              {v}
            </option>
          ))}
        </select>
      </div>

      {requests === null ? (
        <p className="text-sm text-gray-400">Chargement...</p>
      ) : requests.length === 0 ? (
        <EmptyState
          icon={Inbox}
          title="Vous n'avez encore reçu aucune demande"
          description="Ajoutez votre lien dans votre bio Instagram pour commencer à recevoir des demandes."
          action={
            <Link href="/dashboard/page-publique" className="btn-primary">
              Copier mon lien
            </Link>
          }
        />
      ) : (
        <div className="card divide-y divide-gray-100">
          {requests.map((r) => (
            <Link
              key={r.id}
              href={`/dashboard/demandes/${r.id}`}
              className="flex flex-col gap-2 px-5 py-4 hover:bg-gray-50 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0">
                <p className="truncate font-medium text-gray-900">{r.clientName}</p>
                <p className="truncate text-sm text-gray-500">
                  {r.service?.name || 'Prestation non précisée'} · {r.clientEmail}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-xs text-gray-400">{format(new Date(r.createdAt), 'd MMM yyyy', { locale: fr })}</span>
                {r.estimatedPrice != null && <span className="text-sm font-medium text-gray-700">{r.estimatedPrice} €</span>}
                <span className={`badge ${REQUEST_STATUS_COLORS[r.status]}`}>{REQUEST_STATUS_LABELS[r.status]}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
