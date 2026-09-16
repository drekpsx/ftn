'use client';

import { useEffect, useState } from 'react';
import { Package, Plus, Trash2, Pencil, X } from 'lucide-react';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { EmptyState } from '@/components/dashboard/EmptyState';

type ServiceOption = { id?: string; name: string; priceDelta: number };
type Service = {
  id: string;
  name: string;
  description: string | null;
  priceType: 'FIXED' | 'STARTING_AT' | 'RANGE' | 'ON_QUOTE';
  price: number | null;
  priceMin: number | null;
  priceMax: number | null;
  durationMinutes: number | null;
  active: boolean;
  options: ServiceOption[];
};

const PRICE_LABELS: Record<Service['priceType'], string> = {
  FIXED: 'Prix fixe',
  STARTING_AT: 'À partir de',
  RANGE: 'Fourchette',
  ON_QUOTE: 'Sur devis',
};

function priceLabel(s: Service) {
  if (s.priceType === 'ON_QUOTE') return 'Sur devis';
  if (s.priceType === 'FIXED') return `${s.price ?? 0} €`;
  if (s.priceType === 'STARTING_AT') return `À partir de ${s.price ?? 0} €`;
  return `${s.priceMin ?? 0} € - ${s.priceMax ?? 0} €`;
}

const emptyDraft = (): Omit<Service, 'id'> => ({
  name: '',
  description: '',
  priceType: 'FIXED',
  price: null,
  priceMin: null,
  priceMax: null,
  durationMinutes: null,
  active: true,
  options: [],
});

export default function ServicesPage() {
  const [services, setServices] = useState<Service[] | null>(null);
  const [editing, setEditing] = useState<Service | null>(null);
  const [draft, setDraft] = useState<Omit<Service, 'id'>>(emptyDraft());
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function load() {
    const res = await fetch('/api/services');
    const data = await res.json();
    setServices(data.services);
  }

  useEffect(() => {
    load();
  }, []);

  function openCreate() {
    setEditing(null);
    setDraft(emptyDraft());
    setError(null);
    setShowForm(true);
  }

  function openEdit(s: Service) {
    setEditing(s);
    setDraft(s);
    setError(null);
    setShowForm(true);
  }

  async function save() {
    setSaving(true);
    setError(null);
    try {
      const url = editing ? `/api/services/${editing.id}` : '/api/services';
      const res = await fetch(url, {
        method: editing ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(draft),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Une erreur est survenue.');
        return;
      }
      setShowForm(false);
      await load();
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: string) {
    if (!confirm('Supprimer cette prestation ?')) return;
    await fetch(`/api/services/${id}`, { method: 'DELETE' });
    await load();
  }

  async function toggleActive(s: Service) {
    await fetch(`/api/services/${s.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active: !s.active }),
    });
    await load();
  }

  return (
    <div>
      <PageHeader
        title="Prestations"
        subtitle="Gérez vos services, produits et tarifs."
        action={
          <button onClick={openCreate} className="btn-primary">
            <Plus className="h-4 w-4" /> Nouvelle prestation
          </button>
        }
      />

      {showForm && (
        <div className="card mb-6 p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold">{editing ? 'Modifier la prestation' : 'Nouvelle prestation'}</h2>
            <button onClick={() => setShowForm(false)} aria-label="Fermer">
              <X className="h-4 w-4" />
            </button>
          </div>
          {error && <div className="mb-4 rounded-xl bg-red-50 px-3.5 py-2.5 text-sm text-red-700">{error}</div>}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="label">Nom</label>
              <input className="input" value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} />
            </div>
            <div className="sm:col-span-2">
              <label className="label">Description</label>
              <textarea
                className="input"
                rows={2}
                value={draft.description ?? ''}
                onChange={(e) => setDraft({ ...draft, description: e.target.value })}
              />
            </div>
            <div>
              <label className="label">Type de prix</label>
              <select
                className="input"
                value={draft.priceType}
                onChange={(e) => setDraft({ ...draft, priceType: e.target.value as Service['priceType'] })}
              >
                {Object.entries(PRICE_LABELS).map(([k, v]) => (
                  <option key={k} value={k}>
                    {v}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Durée (minutes)</label>
              <input
                type="number"
                className="input"
                value={draft.durationMinutes ?? ''}
                onChange={(e) => setDraft({ ...draft, durationMinutes: e.target.value ? Number(e.target.value) : null })}
              />
            </div>
            {(draft.priceType === 'FIXED' || draft.priceType === 'STARTING_AT') && (
              <div>
                <label className="label">Prix (€)</label>
                <input
                  type="number"
                  className="input"
                  value={draft.price ?? ''}
                  onChange={(e) => setDraft({ ...draft, price: e.target.value ? Number(e.target.value) : null })}
                />
              </div>
            )}
            {draft.priceType === 'RANGE' && (
              <>
                <div>
                  <label className="label">Prix minimum (€)</label>
                  <input
                    type="number"
                    className="input"
                    value={draft.priceMin ?? ''}
                    onChange={(e) => setDraft({ ...draft, priceMin: e.target.value ? Number(e.target.value) : null })}
                  />
                </div>
                <div>
                  <label className="label">Prix maximum (€)</label>
                  <input
                    type="number"
                    className="input"
                    value={draft.priceMax ?? ''}
                    onChange={(e) => setDraft({ ...draft, priceMax: e.target.value ? Number(e.target.value) : null })}
                  />
                </div>
              </>
            )}
          </div>

          <div className="mt-5">
            <div className="mb-2 flex items-center justify-between">
              <label className="label mb-0">Options (suppléments)</label>
              <button
                className="text-sm font-medium text-brand-700"
                onClick={() => setDraft({ ...draft, options: [...draft.options, { name: '', priceDelta: 0 }] })}
              >
                + Ajouter une option
              </button>
            </div>
            <div className="space-y-2">
              {draft.options.map((o, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    className="input"
                    placeholder="Nom de l'option"
                    value={o.name}
                    onChange={(e) => {
                      const options = [...draft.options];
                      options[i] = { ...o, name: e.target.value };
                      setDraft({ ...draft, options });
                    }}
                  />
                  <input
                    type="number"
                    className="input w-32"
                    placeholder="+ €"
                    value={o.priceDelta}
                    onChange={(e) => {
                      const options = [...draft.options];
                      options[i] = { ...o, priceDelta: Number(e.target.value) };
                      setDraft({ ...draft, options });
                    }}
                  />
                  <button onClick={() => setDraft({ ...draft, options: draft.options.filter((_, idx) => idx !== i) })}>
                    <Trash2 className="h-4 w-4 text-gray-400" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-2">
            <button onClick={() => setShowForm(false)} className="btn-secondary">
              Annuler
            </button>
            <button onClick={save} disabled={saving || !draft.name} className="btn-primary">
              {saving ? 'Enregistrement...' : 'Enregistrer'}
            </button>
          </div>
        </div>
      )}

      {services === null ? (
        <p className="text-sm text-gray-400">Chargement...</p>
      ) : services.length === 0 ? (
        <EmptyState
          icon={Package}
          title="Aucune prestation"
          description="Ajoutez votre première prestation pour commencer à recevoir des demandes."
          action={
            <button onClick={openCreate} className="btn-primary">
              <Plus className="h-4 w-4" /> Nouvelle prestation
            </button>
          }
        />
      ) : (
        <div className="card divide-y divide-gray-100">
          {services.map((s) => (
            <div key={s.id} className="flex items-center justify-between gap-4 px-5 py-4">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="truncate font-medium text-gray-900">{s.name}</p>
                  {!s.active && <span className="badge bg-gray-100 text-gray-500">Inactive</span>}
                </div>
                <p className="text-sm text-gray-500">{priceLabel(s)}</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => toggleActive(s)} className="btn-ghost text-xs">
                  {s.active ? 'Désactiver' : 'Activer'}
                </button>
                <button onClick={() => openEdit(s)} className="btn-ghost px-2">
                  <Pencil className="h-4 w-4" />
                </button>
                <button onClick={() => remove(s.id)} className="btn-ghost px-2 text-red-500">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
