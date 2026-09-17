'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Copy, Download, Send, Copy as Duplicate, Trash2, Check } from 'lucide-react';
import { QUOTE_STATUS_COLORS, QUOTE_STATUS_LABELS } from '@/lib/status';
import { ErrorState } from '@/components/dashboard/ErrorState';

type Item = { id?: string; label: string; description: string | null; quantity: number; unitPrice: number; total: number };
type Quote = {
  id: string;
  number: string;
  status: string;
  subtotal: number;
  discount: number;
  taxRate: number;
  taxAmount: number;
  total: number;
  terms: string | null;
  validUntil: string | null;
  depositType: string;
  depositAmount: number | null;
  publicToken: string;
  items: Item[];
  customer: { id: string; name: string; email: string };
};

const DEPOSIT_LABELS: Record<string, string> = {
  NONE: 'Aucun acompte',
  PERCENT_10: '10%',
  PERCENT_20: '20%',
  PERCENT_30: '30%',
  PERCENT_50: '50%',
  FIXED: 'Montant fixe',
};

export default function QuoteDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [quote, setQuote] = useState<Quote | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [discount, setDiscount] = useState(0);
  const [taxRate, setTaxRate] = useState(0);
  const [terms, setTerms] = useState('');
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);
  const [sending, setSending] = useState(false);
  const [appUrl, setAppUrl] = useState('');
  const [loadError, setLoadError] = useState<string | null>(null);
  const [sendError, setSendError] = useState<string | null>(null);
  const [emailConfigured, setEmailConfigured] = useState(true);

  async function load() {
    setLoadError(null);
    const res = await fetch(`/api/quotes/${params.id}`);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setLoadError(data.error || 'Impossible de charger ce devis.');
      return;
    }
    const data = await res.json();
    setQuote(data.quote);
    setItems(data.quote.items);
    setDiscount(data.quote.discount);
    setTaxRate(data.quote.taxRate);
    setTerms(data.quote.terms || '');
  }

  useEffect(() => {
    setAppUrl(window.location.origin);
    load();
    fetch('/api/system/status')
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => d && setEmailConfigured(d.emailConfigured))
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  const editable = quote?.status === 'DRAFT';
  const subtotal = items.reduce((sum, it) => sum + it.quantity * it.unitPrice, 0);

  async function save() {
    setSaving(true);
    try {
      const res = await fetch(`/api/quotes/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items, discount, taxRate, terms }),
      });
      const data = await res.json();
      if (res.ok) setQuote(data.quote);
    } finally {
      setSaving(false);
    }
  }

  async function send() {
    if (!confirm('Envoyer ce devis par email au client ?')) return;
    setSending(true);
    setSendError(null);
    try {
      const res = await fetch(`/api/quotes/${params.id}/send`, { method: 'POST' });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setSendError(data.error || "L'envoi a échoué. Réessayez.");
        return;
      }
      await load();
    } catch {
      setSendError('Impossible de contacter le serveur. Vérifiez votre connexion et réessayez.');
    } finally {
      setSending(false);
    }
  }

  async function duplicate() {
    const res = await fetch(`/api/quotes/${params.id}/duplicate`, { method: 'POST' });
    const data = await res.json();
    if (res.ok) router.push(`/dashboard/devis/${data.quote.id}`);
  }

  async function remove() {
    if (!confirm('Supprimer ce brouillon ?')) return;
    await fetch(`/api/quotes/${params.id}`, { method: 'DELETE' });
    router.push('/dashboard/devis');
  }

  if (loadError) {
    return (
      <div>
        <Link href="/dashboard/devis" className="mb-4 inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700">
          <ArrowLeft className="h-4 w-4" /> Retour aux devis
        </Link>
        <ErrorState message={loadError} onRetry={load} />
      </div>
    );
  }

  if (!quote) return <p className="text-sm text-gray-400">Chargement...</p>;

  const publicLink = `${appUrl}/devis/${quote.publicToken}`;

  return (
    <div>
      <Link href="/dashboard/devis" className="mb-4 inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700">
        <ArrowLeft className="h-4 w-4" /> Retour aux devis
      </Link>

      {sendError && <div className="mb-4 rounded-xl bg-red-50 px-3.5 py-2.5 text-sm text-red-700">{sendError}</div>}

      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">{quote.number}</h1>
          <p className="text-sm text-gray-500">{quote.customer.name} · {quote.customer.email}</p>
        </div>
        <span className={`badge ${QUOTE_STATUS_COLORS[quote.status]}`}>{QUOTE_STATUS_LABELS[quote.status]}</span>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {editable && (
          <button onClick={send} disabled={sending} className="btn-primary">
            <Send className="h-4 w-4" /> {sending ? 'Envoi...' : 'Envoyer au client'}
          </button>
        )}
        <a href={`/api/quotes/${quote.id}/pdf`} target="_blank" rel="noreferrer" className="btn-secondary">
          <Download className="h-4 w-4" /> Télécharger le PDF
        </a>
        <button
          onClick={() => {
            navigator.clipboard.writeText(publicLink);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
          }}
          className="btn-secondary"
        >
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />} Copier le lien
        </button>
        <button onClick={duplicate} className="btn-secondary">
          <Duplicate className="h-4 w-4" /> Dupliquer
        </button>
        {quote.status === 'DRAFT' && (
          <button onClick={remove} className="btn-ghost text-red-500">
            <Trash2 className="h-4 w-4" /> Supprimer
          </button>
        )}
      </div>

      {editable && !emailConfigured && (
        <p className="mb-6 -mt-4 text-xs text-amber-600">
          ⚠️ L&apos;envoi d&apos;emails n&apos;est pas configuré : ce devis passera au statut « Envoyé » mais votre
          client ne recevra rien tant que ce n&apos;est pas fait.
        </p>
      )}

      <div className="card p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-semibold">Prestations</h2>
          {editable && (
            <button
              className="text-sm font-medium text-brand-700"
              onClick={() => setItems([...items, { label: '', description: '', quantity: 1, unitPrice: 0, total: 0 }])}
            >
              + Ajouter une ligne
            </button>
          )}
        </div>
        <div className="space-y-3">
          {items.map((it, i) => (
            <div key={i} className="grid grid-cols-12 gap-2">
              <input
                disabled={!editable}
                className="input col-span-5"
                value={it.label}
                onChange={(e) => setItems(items.map((x, idx) => (idx === i ? { ...x, label: e.target.value } : x)))}
              />
              <input
                disabled={!editable}
                className="input col-span-3"
                placeholder="Description"
                value={it.description ?? ''}
                onChange={(e) => setItems(items.map((x, idx) => (idx === i ? { ...x, description: e.target.value } : x)))}
              />
              <input
                disabled={!editable}
                type="number"
                className="input col-span-1"
                value={it.quantity}
                onChange={(e) => setItems(items.map((x, idx) => (idx === i ? { ...x, quantity: Number(e.target.value) } : x)))}
              />
              <input
                disabled={!editable}
                type="number"
                className="input col-span-2"
                value={it.unitPrice}
                onChange={(e) => setItems(items.map((x, idx) => (idx === i ? { ...x, unitPrice: Number(e.target.value) } : x)))}
              />
              {editable && (
                <button onClick={() => setItems(items.filter((_, idx) => idx !== i))} className="col-span-1">
                  <Trash2 className="h-4 w-4 text-gray-400" />
                </button>
              )}
            </div>
          ))}
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label">Conditions</label>
            <textarea disabled={!editable} className="input" rows={4} value={terms} onChange={(e) => setTerms(e.target.value)} />
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="label mb-0">Réduction (€)</label>
              <input
                disabled={!editable}
                type="number"
                className="input w-32"
                value={discount}
                onChange={(e) => setDiscount(Number(e.target.value))}
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="label mb-0">TVA (%)</label>
              <input
                disabled={!editable}
                type="number"
                className="input w-32"
                value={taxRate}
                onChange={(e) => setTaxRate(Number(e.target.value))}
              />
            </div>
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>Sous-total</span>
              <span>{subtotal.toFixed(2)} €</span>
            </div>
            <div className="flex items-center justify-between text-lg font-semibold text-gray-900">
              <span>Total TTC</span>
              <span>{quote.total.toFixed(2)} €</span>
            </div>
            {quote.depositAmount != null && quote.depositAmount > 0 && (
              <div className="flex items-center justify-between text-sm text-brand-700">
                <span>Acompte ({DEPOSIT_LABELS[quote.depositType]})</span>
                <span>{quote.depositAmount.toFixed(2)} €</span>
              </div>
            )}
          </div>
        </div>

        {editable && (
          <div className="mt-6 flex justify-end">
            <button onClick={save} disabled={saving} className="btn-primary">
              {saving ? 'Enregistrement...' : 'Enregistrer les modifications'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
