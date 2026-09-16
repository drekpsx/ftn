'use client';

import { useEffect, useState } from 'react';
import { signOut } from 'next-auth/react';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { FormError, FormSuccess } from '@/components/FormError';

type Business = {
  name: string;
  activity: string;
  quotePrefix: string;
  defaultTaxRate: number;
  quoteValidityDays: number;
  defaultTerms: string | null;
  notifyOnRequest: boolean;
  notifyOnQuote: boolean;
  notifyOnPayment: boolean;
  depositType: string;
  depositFixedAmount: number | null;
};

export default function SettingsPage() {
  const [business, setBusiness] = useState<Business | null>(null);
  const [saved, setSaved] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [pwError, setPwError] = useState<string | null>(null);
  const [pwSuccess, setPwSuccess] = useState(false);

  useEffect(() => {
    fetch('/api/business')
      .then((r) => r.json())
      .then((d) => setBusiness(d.business));
  }, []);

  async function save(patch: Partial<Business>) {
    const res = await fetch('/api/business', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patch),
    });
    const data = await res.json();
    if (res.ok) {
      setBusiness(data.business);
      setSaved(true);
      setTimeout(() => setSaved(false), 1500);
    }
  }

  async function changePassword(e: React.FormEvent) {
    e.preventDefault();
    setPwError(null);
    setPwSuccess(false);
    const res = await fetch('/api/account/password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    const data = await res.json();
    if (!res.ok) {
      setPwError(data.error || 'Une erreur est survenue.');
      return;
    }
    setPwSuccess(true);
    setCurrentPassword('');
    setNewPassword('');
  }

  async function deleteAccount() {
    if (!confirm('Cette action supprimera définitivement votre compte et toutes vos données. Continuer ?')) return;
    await fetch('/api/account', { method: 'DELETE' });
    signOut({ callbackUrl: '/' });
  }

  if (!business) return <p className="text-sm text-gray-400">Chargement...</p>;

  return (
    <div>
      <PageHeader title="Paramètres" subtitle="Gérez votre entreprise, vos devis et votre compte." />

      <div className="space-y-6">
        <div className="card p-6">
          <h2 className="mb-4 font-semibold">Entreprise</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label">Nom de l&apos;entreprise</label>
              <input className="input" defaultValue={business.name} onBlur={(e) => save({ name: e.target.value })} />
            </div>
            <div>
              <label className="label">Activité</label>
              <input className="input" defaultValue={business.activity} onBlur={(e) => save({ activity: e.target.value })} />
            </div>
          </div>
        </div>

        <div className="card p-6">
          <h2 className="mb-4 font-semibold">Devis</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="label">Préfixe</label>
              <input className="input" defaultValue={business.quotePrefix} onBlur={(e) => save({ quotePrefix: e.target.value })} />
            </div>
            <div>
              <label className="label">TVA par défaut (%)</label>
              <input
                type="number"
                className="input"
                defaultValue={business.defaultTaxRate}
                onBlur={(e) => save({ defaultTaxRate: Number(e.target.value) })}
              />
            </div>
            <div>
              <label className="label">Durée de validité (jours)</label>
              <input
                type="number"
                className="input"
                defaultValue={business.quoteValidityDays}
                onBlur={(e) => save({ quoteValidityDays: Number(e.target.value) })}
              />
            </div>
            <div className="sm:col-span-3">
              <label className="label">Conditions par défaut</label>
              <textarea
                className="input"
                rows={3}
                defaultValue={business.defaultTerms ?? ''}
                onBlur={(e) => save({ defaultTerms: e.target.value })}
              />
            </div>
          </div>

          <h3 className="mb-2 mt-6 text-sm font-semibold text-gray-700">Acompte par défaut</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <select
              className="input"
              defaultValue={business.depositType}
              onChange={(e) => save({ depositType: e.target.value as Business['depositType'] })}
            >
              <option value="NONE">Aucun acompte</option>
              <option value="PERCENT_10">10%</option>
              <option value="PERCENT_20">20%</option>
              <option value="PERCENT_30">30%</option>
              <option value="PERCENT_50">50%</option>
              <option value="FIXED">Montant fixe</option>
            </select>
            {business.depositType === 'FIXED' && (
              <input
                type="number"
                className="input"
                placeholder="Montant (€)"
                defaultValue={business.depositFixedAmount ?? ''}
                onBlur={(e) => save({ depositFixedAmount: Number(e.target.value) })}
              />
            )}
          </div>
        </div>

        <div className="card p-6">
          <h2 className="mb-4 font-semibold">Notifications</h2>
          {[
            { key: 'notifyOnRequest', label: 'Nouvelles demandes' },
            { key: 'notifyOnQuote', label: 'Devis acceptés / refusés' },
            { key: 'notifyOnPayment', label: 'Paiements reçus' },
          ].map((n) => (
            <label key={n.key} className="mb-2 flex items-center justify-between text-sm last:mb-0">
              <span>{n.label}</span>
              <input
                type="checkbox"
                checked={(business as never)[n.key]}
                onChange={(e) => save({ [n.key]: e.target.checked } as Partial<Business>)}
              />
            </label>
          ))}
        </div>

        <div className="card p-6">
          <h2 className="mb-4 font-semibold">Compte</h2>
          <form onSubmit={changePassword} className="max-w-sm space-y-3">
            <FormError message={pwError} />
            {pwSuccess && <FormSuccess message="Mot de passe mis à jour." />}
            <div>
              <label className="label">Mot de passe actuel</label>
              <input
                type="password"
                className="input"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="label">Nouveau mot de passe</label>
              <input
                type="password"
                className="input"
                minLength={8}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn-secondary">
              Changer le mot de passe
            </button>
          </form>

          <div className="mt-6 border-t border-gray-100 pt-6">
            <h3 className="text-sm font-semibold text-red-600">Zone dangereuse</h3>
            <p className="mt-1 text-sm text-gray-500">
              Supprimer votre compte effacera définitivement votre entreprise, vos demandes, devis et clients.
            </p>
            <button onClick={deleteAccount} className="btn-danger mt-3">
              Supprimer mon compte
            </button>
          </div>
        </div>
      </div>
      {saved && <p className="mt-4 text-xs text-gray-400">Enregistré.</p>}
    </div>
  );
}
