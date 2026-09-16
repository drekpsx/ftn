'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FileText, Plus } from 'lucide-react';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { EmptyState } from '@/components/dashboard/EmptyState';
import { QUOTE_STATUS_COLORS, QUOTE_STATUS_LABELS } from '@/lib/status';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

type QuoteRow = {
  id: string;
  number: string;
  status: string;
  total: number;
  createdAt: string;
  customer: { name: string };
};

export default function QuotesPage() {
  const [quotes, setQuotes] = useState<QuoteRow[] | null>(null);
  const [status, setStatus] = useState('');

  useEffect(() => {
    const params = new URLSearchParams();
    if (status) params.set('status', status);
    fetch(`/api/quotes?${params.toString()}`)
      .then((r) => r.json())
      .then((d) => setQuotes(d.quotes));
  }, [status]);

  return (
    <div>
      <PageHeader
        title="Devis"
        subtitle="Créez et suivez vos devis."
        action={
          <Link href="/dashboard/devis/nouveau" className="btn-primary">
            <Plus className="h-4 w-4" /> Nouveau devis
          </Link>
        }
      />

      <div className="mb-4">
        <select className="input sm:w-56" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">Tous les statuts</option>
          {Object.entries(QUOTE_STATUS_LABELS).map(([k, v]) => (
            <option key={k} value={k}>
              {v}
            </option>
          ))}
        </select>
      </div>

      {quotes === null ? (
        <p className="text-sm text-gray-400">Chargement...</p>
      ) : quotes.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="Aucun devis"
          description="Créez votre premier devis depuis une demande ou directement."
          action={
            <Link href="/dashboard/devis/nouveau" className="btn-primary">
              <Plus className="h-4 w-4" /> Nouveau devis
            </Link>
          }
        />
      ) : (
        <div className="card divide-y divide-gray-100">
          {quotes.map((q) => (
            <Link key={q.id} href={`/dashboard/devis/${q.id}`} className="flex items-center justify-between px-5 py-4 hover:bg-gray-50">
              <div>
                <p className="font-medium text-gray-900">{q.number}</p>
                <p className="text-sm text-gray-500">{q.customer.name}</p>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-xs text-gray-400">{format(new Date(q.createdAt), 'd MMM yyyy', { locale: fr })}</span>
                <span className="text-sm font-medium text-gray-700">{q.total} €</span>
                <span className={`badge ${QUOTE_STATUS_COLORS[q.status]}`}>{QUOTE_STATUS_LABELS[q.status]}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
