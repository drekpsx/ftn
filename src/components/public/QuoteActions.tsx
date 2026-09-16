'use client';

import { useState } from 'react';
import { Check, Download, X, CreditCard } from 'lucide-react';

export function QuoteActions({
  token,
  status,
  clientComment,
  signatureName,
  depositAmount,
  depositPaid,
  pdfHref,
}: {
  token: string;
  status: string;
  clientComment: string | null;
  signatureName: string | null;
  depositAmount: number | null;
  depositPaid: boolean;
  pdfHref: string;
}) {
  const [mode, setMode] = useState<'idle' | 'accepting' | 'refusing'>('idle');
  const [name, setName] = useState('');
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentStatus, setCurrentStatus] = useState(status);
  const [showPay, setShowPay] = useState(false);
  const [payLoading, setPayLoading] = useState(false);

  async function accept() {
    if (!name.trim()) {
      setError('Merci de saisir votre nom pour confirmer.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/public/quotes/${token}/accept`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ signatureName: name, comment }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Une erreur est survenue.');
        return;
      }
      setCurrentStatus('ACCEPTED');
      if (data.requiresDeposit) setShowPay(true);
    } finally {
      setLoading(false);
    }
  }

  async function refuse() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/public/quotes/${token}/refuse`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ comment }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Une erreur est survenue.');
        return;
      }
      setCurrentStatus('REFUSED');
    } finally {
      setLoading(false);
    }
  }

  async function payDeposit() {
    setPayLoading(true);
    try {
      const res = await fetch(`/api/public/quotes/${token}/checkout`, { method: 'POST' });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError(data.error || 'Le paiement en ligne n\'est pas disponible pour le moment.');
      }
    } finally {
      setPayLoading(false);
    }
  }

  if (currentStatus === 'ACCEPTED') {
    return (
      <div className="rounded-xl bg-emerald-50 p-5 text-center">
        <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
          <Check className="h-5 w-5" />
        </div>
        <p className="font-medium text-emerald-800">Merci ! Votre demande a été confirmée.</p>
        {signatureName && <p className="mt-1 text-xs text-emerald-600">Signé par {signatureName}</p>}
        {depositAmount && depositAmount > 0 && !depositPaid && (
          <button onClick={payDeposit} disabled={payLoading} className="btn-primary mt-4">
            <CreditCard className="h-4 w-4" /> Payer l&apos;acompte de {depositAmount.toFixed(2)} €
          </button>
        )}
        {depositPaid && <p className="mt-3 text-sm text-emerald-700">Acompte réglé ✅</p>}
        <a href={pdfHref} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-1.5 text-sm text-emerald-700 underline">
          <Download className="h-4 w-4" /> Télécharger le PDF
        </a>
      </div>
    );
  }

  if (currentStatus === 'REFUSED') {
    return (
      <div className="rounded-xl bg-gray-100 p-5 text-center text-gray-600">
        <p>Vous avez refusé ce devis.{clientComment ? ` — « ${clientComment} »` : ''}</p>
      </div>
    );
  }

  if (currentStatus === 'EXPIRED') {
    return <div className="rounded-xl bg-amber-50 p-5 text-center text-amber-700">Ce devis a expiré.</div>;
  }

  return (
    <div>
      {error && <div className="mb-4 rounded-xl bg-red-50 px-3.5 py-2.5 text-sm text-red-700">{error}</div>}

      {mode === 'idle' && (
        <div className="flex flex-col gap-3 sm:flex-row">
          <button onClick={() => setMode('accepting')} className="btn-primary flex-1">
            <Check className="h-4 w-4" /> Accepter le devis
          </button>
          <button onClick={() => setMode('refusing')} className="btn-secondary flex-1">
            <X className="h-4 w-4" /> Refuser
          </button>
          <a href={pdfHref} target="_blank" rel="noreferrer" className="btn-ghost">
            <Download className="h-4 w-4" /> PDF
          </a>
        </div>
      )}

      {mode === 'accepting' && (
        <div className="space-y-3 rounded-xl border border-gray-100 p-4">
          <p className="text-sm font-medium text-gray-700">Confirmez votre acceptation</p>
          <label className="flex items-center gap-2 text-sm text-gray-600">
            <input type="checkbox" required /> J&apos;ai lu et j&apos;accepte ce devis et ses conditions.
          </label>
          <input className="input" placeholder="Votre nom complet (signature)" value={name} onChange={(e) => setName(e.target.value)} />
          <textarea
            className="input"
            rows={2}
            placeholder="Commentaire (facultatif)"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <div className="flex justify-end gap-2">
            <button onClick={() => setMode('idle')} className="btn-secondary">
              Annuler
            </button>
            <button onClick={accept} disabled={loading} className="btn-primary">
              {loading ? 'Confirmation...' : "Confirmer l'acceptation"}
            </button>
          </div>
        </div>
      )}

      {mode === 'refusing' && (
        <div className="space-y-3 rounded-xl border border-gray-100 p-4">
          <p className="text-sm font-medium text-gray-700">Pourquoi refusez-vous ce devis ? (facultatif)</p>
          <textarea className="input" rows={2} value={comment} onChange={(e) => setComment(e.target.value)} />
          <div className="flex justify-end gap-2">
            <button onClick={() => setMode('idle')} className="btn-secondary">
              Annuler
            </button>
            <button onClick={refuse} disabled={loading} className="btn-danger">
              {loading ? 'Envoi...' : 'Confirmer le refus'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
