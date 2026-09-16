'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Mail, Phone, MapPin, Building2 } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { REQUEST_STATUS_COLORS, REQUEST_STATUS_LABELS, QUOTE_STATUS_COLORS, QUOTE_STATUS_LABELS } from '@/lib/status';

type CustomerDetail = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  address: string | null;
  notes: string | null;
  tags: string[] | null;
  createdAt: string;
  requests: { id: string; status: string; createdAt: string; service: { name: string } | null }[];
  quotes: { id: string; number: string; status: string; total: number; createdAt: string }[];
  payments: { id: string; amount: number; status: string; createdAt: string }[];
};

export default function ClientDetailPage() {
  const params = useParams<{ id: string }>();
  const [customer, setCustomer] = useState<CustomerDetail | null>(null);
  const [notes, setNotes] = useState('');

  async function load() {
    const res = await fetch(`/api/customers/${params.id}`);
    if (!res.ok) return;
    const data = await res.json();
    setCustomer(data.customer);
    setNotes(data.customer.notes || '');
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  async function saveNotes() {
    await fetch(`/api/customers/${params.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ notes }),
    });
  }

  if (!customer) return <p className="text-sm text-gray-400">Chargement...</p>;

  return (
    <div>
      <Link href="/dashboard/clients" className="mb-4 inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700">
        <ArrowLeft className="h-4 w-4" /> Retour aux clients
      </Link>

      <h1 className="mb-6 text-2xl font-semibold text-gray-900">{customer.name}</h1>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="card p-6">
            <h2 className="mb-3 font-semibold">Demandes</h2>
            {customer.requests.length === 0 ? (
              <p className="text-sm text-gray-400">Aucune demande.</p>
            ) : (
              <div className="space-y-2">
                {customer.requests.map((r) => (
                  <Link key={r.id} href={`/dashboard/demandes/${r.id}`} className="flex items-center justify-between rounded-lg px-3 py-2 text-sm hover:bg-gray-50">
                    <span>{r.service?.name || 'Prestation'} · {format(new Date(r.createdAt), 'd MMM yyyy', { locale: fr })}</span>
                    <span className={`badge ${REQUEST_STATUS_COLORS[r.status]}`}>{REQUEST_STATUS_LABELS[r.status]}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className="card p-6">
            <h2 className="mb-3 font-semibold">Devis</h2>
            {customer.quotes.length === 0 ? (
              <p className="text-sm text-gray-400">Aucun devis.</p>
            ) : (
              <div className="space-y-2">
                {customer.quotes.map((q) => (
                  <Link key={q.id} href={`/dashboard/devis/${q.id}`} className="flex items-center justify-between rounded-lg px-3 py-2 text-sm hover:bg-gray-50">
                    <span>{q.number}</span>
                    <span className="text-gray-500">{q.total} €</span>
                    <span className={`badge ${QUOTE_STATUS_COLORS[q.status]}`}>{QUOTE_STATUS_LABELS[q.status]}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {customer.payments.length > 0 && (
            <div className="card p-6">
              <h2 className="mb-3 font-semibold">Paiements</h2>
              <div className="space-y-2">
                {customer.payments.map((p) => (
                  <div key={p.id} className="flex items-center justify-between text-sm">
                    <span>{format(new Date(p.createdAt), 'd MMM yyyy', { locale: fr })}</span>
                    <span className="font-medium">{p.amount} €</span>
                    <span className="text-gray-400">{p.status}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="card p-5 text-sm">
            <div className="mb-2 flex items-center gap-2 text-gray-600">
              <Mail className="h-4 w-4 text-gray-400" /> {customer.email}
            </div>
            {customer.phone && (
              <div className="mb-2 flex items-center gap-2 text-gray-600">
                <Phone className="h-4 w-4 text-gray-400" /> {customer.phone}
              </div>
            )}
            {customer.company && (
              <div className="mb-2 flex items-center gap-2 text-gray-600">
                <Building2 className="h-4 w-4 text-gray-400" /> {customer.company}
              </div>
            )}
            {customer.address && (
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin className="h-4 w-4 text-gray-400" /> {customer.address}
              </div>
            )}
            <p className="mt-3 text-xs text-gray-400">
              Client depuis le {format(new Date(customer.createdAt), 'd MMMM yyyy', { locale: fr })}
            </p>
          </div>

          <div className="card p-5">
            <h2 className="mb-2 font-semibold">Notes internes</h2>
            <textarea className="input" rows={5} value={notes} onChange={(e) => setNotes(e.target.value)} onBlur={saveNotes} />
          </div>
        </div>
      </div>
    </div>
  );
}
