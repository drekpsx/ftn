'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Users, Search, Plus, X } from 'lucide-react';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { EmptyState } from '@/components/dashboard/EmptyState';

type CustomerRow = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  createdAt: string;
  _count: { requests: number; quotes: number };
};

export default function ClientsPage() {
  const [customers, setCustomers] = useState<CustomerRow[] | null>(null);
  const [q, setQ] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const [saving, setSaving] = useState(false);

  function load() {
    fetch(`/api/customers?q=${encodeURIComponent(q)}`)
      .then((r) => r.json())
      .then((d) => setCustomers(d.customers));
  }

  useEffect(() => {
    const timeout = setTimeout(load, 250);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  async function createCustomer() {
    setSaving(true);
    try {
      await fetch('/api/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      setShowForm(false);
      setForm({ name: '', email: '', phone: '' });
      load();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <PageHeader
        title="Clients"
        subtitle="Retrouvez tous vos prospects et clients au même endroit."
        action={
          <button onClick={() => setShowForm(true)} className="btn-primary">
            <Plus className="h-4 w-4" /> Nouveau client
          </button>
        }
      />

      {showForm && (
        <div className="card mb-6 p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold">Nouveau client</h2>
            <button onClick={() => setShowForm(false)} aria-label="Fermer">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <input className="input" placeholder="Nom" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <input
              className="input"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <input
              className="input"
              placeholder="Téléphone"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </div>
          <div className="mt-4 flex justify-end">
            <button onClick={createCustomer} disabled={saving || !form.name || !form.email} className="btn-primary">
              {saving ? 'Enregistrement...' : 'Créer le client'}
            </button>
          </div>
        </div>
      )}

      <div className="relative mb-4">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input className="input pl-9" placeholder="Rechercher un client..." value={q} onChange={(e) => setQ(e.target.value)} />
      </div>

      {customers === null ? (
        <p className="text-sm text-gray-400">Chargement...</p>
      ) : customers.length === 0 ? (
        <EmptyState icon={Users} title="Aucun client pour le moment" description="Vos clients apparaîtront ici automatiquement dès leur première demande." />
      ) : (
        <div className="card divide-y divide-gray-100">
          {customers.map((c) => (
            <Link key={c.id} href={`/dashboard/clients/${c.id}`} className="flex items-center justify-between px-5 py-4 hover:bg-gray-50">
              <div className="min-w-0">
                <p className="truncate font-medium text-gray-900">{c.name}</p>
                <p className="truncate text-sm text-gray-500">{c.email}{c.phone ? ` · ${c.phone}` : ''}</p>
              </div>
              <div className="flex gap-4 text-sm text-gray-400">
                <span>{c._count.requests} demande(s)</span>
                <span>{c._count.quotes} devis</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
