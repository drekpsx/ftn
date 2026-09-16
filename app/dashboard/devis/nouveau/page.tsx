'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';

type Item = { label: string; description: string; quantity: number; unitPrice: number };
type Customer = { id: string; name: string; email: string };

function NewQuoteForm() {
  const router = useRouter();
  const params = useSearchParams();
  const requestId = params.get('requestId');

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [customerId, setCustomerId] = useState('');
  const [items, setItems] = useState<Item[]>([{ label: '', description: '', quantity: 1, unitPrice: 0 }]);
  const [discount, setDiscount] = useState(0);
  const [taxRate, setTaxRate] = useState<number | ''>('');
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/customers')
      .then((r) => r.json())
      .then((d) => setCustomers(d.customers));

    if (requestId) {
      fetch(`/api/requests/${requestId}`)
        .then((r) => r.json())
        .then((d) => {
          if (d.request?.customer) setCustomerId(d.request.customer.id);
          if (d.request?.service) {
            setItems([
              {
                label: d.request.service.name,
                description: '',
                quantity: 1,
                unitPrice: d.request.estimatedPrice ?? 0,
              },
            ]);
          }
        });
    }
  }, [requestId]);

  const subtotal = items.reduce((sum, it) => sum + it.quantity * it.unitPrice, 0);

  function updateItem(i: number, patch: Partial<Item>) {
    setItems(items.map((it, idx) => (idx === i ? { ...it, ...patch } : it)));
  }

  async function submit() {
    setError(null);
    if (!customerId) {
      setError('Sélectionnez un client.');
      return;
    }
    if (items.some((it) => !it.label)) {
      setError('Chaque ligne doit avoir un nom.');
      return;
    }
    setSaving(true);
    try {
      const res = await fetch('/api/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requestId: requestId || undefined,
          customerId,
          items,
          discount,
          taxRate: taxRate === '' ? undefined : Number(taxRate),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Une erreur est survenue.');
        return;
      }
      router.push(`/dashboard/devis/${data.quote.id}`);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <Link href="/dashboard/devis" className="mb-4 inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700">
        <ArrowLeft className="h-4 w-4" /> Retour aux devis
      </Link>

      <h1 className="mb-6 text-2xl font-semibold text-gray-900">Nouveau devis</h1>

      {error && <div className="mb-4 rounded-xl bg-red-50 px-3.5 py-2.5 text-sm text-red-700">{error}</div>}

      <div className="card space-y-6 p-6">
        <div>
          <label className="label">Client</label>
          <select className="input" value={customerId} onChange={(e) => setCustomerId(e.target.value)}>
            <option value="">Sélectionner un client...</option>
            {customers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.email})
              </option>
            ))}
          </select>
          {customers.length === 0 && (
            <p className="mt-1 text-xs text-gray-400">
              Aucun client. <Link href="/dashboard/clients" className="text-brand-700 underline">Créez-en un</Link> d&apos;abord.
            </p>
          )}
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className="label mb-0">Prestations</label>
            <button
              className="text-sm font-medium text-brand-700"
              onClick={() => setItems([...items, { label: '', description: '', quantity: 1, unitPrice: 0 }])}
            >
              <Plus className="mr-1 inline h-3.5 w-3.5" /> Ajouter une ligne
            </button>
          </div>
          <div className="space-y-3">
            {items.map((it, i) => (
              <div key={i} className="grid grid-cols-12 gap-2">
                <input
                  className="input col-span-5"
                  placeholder="Nom de la prestation"
                  value={it.label}
                  onChange={(e) => updateItem(i, { label: e.target.value })}
                />
                <input
                  className="input col-span-3"
                  placeholder="Description"
                  value={it.description}
                  onChange={(e) => updateItem(i, { description: e.target.value })}
                />
                <input
                  type="number"
                  className="input col-span-1"
                  value={it.quantity}
                  onChange={(e) => updateItem(i, { quantity: Number(e.target.value) })}
                />
                <input
                  type="number"
                  className="input col-span-2"
                  placeholder="Prix"
                  value={it.unitPrice}
                  onChange={(e) => updateItem(i, { unitPrice: Number(e.target.value) })}
                />
                <button onClick={() => setItems(items.filter((_, idx) => idx !== i))} className="col-span-1">
                  <Trash2 className="h-4 w-4 text-gray-400" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          <div>
            <label className="label">Réduction (€)</label>
            <input type="number" className="input" value={discount} onChange={(e) => setDiscount(Number(e.target.value))} />
          </div>
          <div>
            <label className="label">TVA (%)</label>
            <input
              type="number"
              className="input"
              placeholder="Par défaut"
              value={taxRate}
              onChange={(e) => setTaxRate(e.target.value === '' ? '' : Number(e.target.value))}
            />
          </div>
          <div className="flex items-end justify-end">
            <p className="text-sm text-gray-500">
              Sous-total : <span className="font-semibold text-gray-800">{subtotal.toFixed(2)} €</span>
            </p>
          </div>
        </div>

        <div className="flex justify-end">
          <button onClick={submit} disabled={saving} className="btn-primary">
            {saving ? 'Création...' : 'Créer le devis'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function NewQuotePage() {
  return (
    <Suspense>
      <NewQuoteForm />
    </Suspense>
  );
}
