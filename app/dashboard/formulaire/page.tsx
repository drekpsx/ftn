'use client';

import { useEffect, useState } from 'react';
import { ListChecks, Plus, Trash2, GripVertical, ChevronUp, ChevronDown, X } from 'lucide-react';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { HelpBanner } from '@/components/dashboard/HelpBanner';
import { RequestForm, type PublicService } from '@/components/public/RequestForm';
import type { FieldDef } from '@/components/public/DynamicFormField';

const TYPE_LABELS: Record<FieldDef['type'], string> = {
  TEXT: 'Texte',
  TEXTAREA: 'Texte long',
  EMAIL: 'Email',
  PHONE: 'Téléphone',
  NUMBER: 'Nombre',
  DATE: 'Date',
  TIME: 'Heure',
  SELECT: 'Sélection unique',
  MULTISELECT: 'Sélection multiple',
  BOOLEAN: 'Oui / Non',
  AMOUNT: 'Montant',
  ADDRESS: 'Adresse',
  FILE: 'Fichier / image',
};

export default function FormBuilderPage() {
  const [fields, setFields] = useState<FieldDef[] | null>(null);
  const [services, setServices] = useState<PublicService[]>([]);
  const [showPricing, setShowPricing] = useState(true);
  const [editing, setEditing] = useState<FieldDef | null>(null);
  const [showForm, setShowForm] = useState(false);

  async function load() {
    const [fieldsRes, servicesRes, businessRes] = await Promise.all([
      fetch('/api/form-fields'),
      fetch('/api/services'),
      fetch('/api/business'),
    ]);
    const fieldsData = await fieldsRes.json();
    const servicesData = await servicesRes.json();
    const businessData = await businessRes.json();
    setFields(fieldsData.fields.map((f: any) => ({ ...f, options: f.options ?? null })));
    setServices(servicesData.services.filter((s: any) => s.active));
    setShowPricing(businessData.business.showPricingPublicly);
  }

  useEffect(() => {
    load();
  }, []);

  function openCreate() {
    setEditing({
      id: '',
      label: '',
      type: 'TEXT',
      required: false,
      options: null,
      placeholder: null,
      showIfFieldId: null,
      showIfValue: null,
    });
    setShowForm(true);
  }

  function openEdit(f: FieldDef) {
    setEditing(f);
    setShowForm(true);
  }

  async function save() {
    if (!editing) return;
    const payload = {
      label: editing.label,
      type: editing.type,
      required: editing.required,
      options: editing.options,
      placeholder: editing.placeholder,
      showIfFieldId: editing.showIfFieldId,
      showIfValue: editing.showIfValue,
    };
    if (editing.id) {
      await fetch(`/api/form-fields/${editing.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    } else {
      await fetch('/api/form-fields', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    }
    setShowForm(false);
    await load();
  }

  async function remove(id: string) {
    if (!confirm('Supprimer ce champ ?')) return;
    await fetch(`/api/form-fields/${id}`, { method: 'DELETE' });
    await load();
  }

  async function move(index: number, direction: -1 | 1) {
    if (!fields) return;
    const newFields = [...fields];
    const target = index + direction;
    if (target < 0 || target >= newFields.length) return;
    [newFields[index], newFields[target]] = [newFields[target], newFields[index]];
    setFields(newFields);
    await fetch('/api/form-fields/reorder', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids: newFields.map((f) => f.id) }),
    });
  }

  const needsOptions = editing?.type === 'SELECT' || editing?.type === 'MULTISELECT';

  return (
    <div>
      <PageHeader
        title="Formulaire"
        subtitle="Choisissez les informations à demander à vos prospects."
        action={
          <button onClick={openCreate} className="btn-primary">
            <Plus className="h-4 w-4" /> Ajouter une question
          </button>
        }
      />

      <HelpBanner title="À quoi sert cette page ?">
        C'est le questionnaire que vos prospects remplissent sur votre page publique. Ajoutez seulement les
        questions utiles à vos yeux — chaque question peut aussi n'apparaître que si une réponse précédente
        correspond à une valeur précise (« Afficher uniquement si »), pour ne jamais poser une question hors sujet.
      </HelpBanner>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card divide-y divide-gray-100">
          {fields === null ? (
            <p className="p-5 text-sm text-gray-400">Chargement...</p>
          ) : fields.length === 0 ? (
            <div className="p-5 text-sm text-gray-400">Aucune question. Ajoutez-en une pour commencer.</div>
          ) : (
            fields.map((f, i) => (
              <div key={f.id} className="flex items-center gap-3 px-4 py-3">
                <GripVertical className="h-4 w-4 flex-shrink-0 text-gray-300" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-gray-900">{f.label}</p>
                  <p className="text-xs text-gray-400">
                    {TYPE_LABELS[f.type]} {f.required ? '· Obligatoire' : '· Facultatif'}
                    {f.showIfFieldId ? ' · Conditionnel' : ''}
                  </p>
                </div>
                <button onClick={() => move(i, -1)} className="btn-ghost px-1.5" aria-label="Monter">
                  <ChevronUp className="h-4 w-4" />
                </button>
                <button onClick={() => move(i, 1)} className="btn-ghost px-1.5" aria-label="Descendre">
                  <ChevronDown className="h-4 w-4" />
                </button>
                <button onClick={() => openEdit(f)} className="btn-ghost text-xs">
                  Modifier
                </button>
                <button onClick={() => remove(f.id)} className="btn-ghost px-1.5 text-red-500">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))
          )}
        </div>

        <div>
          <p className="mb-2 text-sm font-medium text-gray-500">Aperçu en temps réel</p>
          <div className="card p-6">
            <RequestForm
              slug="preview"
              mode="preview"
              services={services}
              fields={(fields || []).map((f) => ({ ...f, options: f.options as string[] | null }))}
              showPricing={showPricing}
            />
          </div>
        </div>
      </div>

      {showForm && editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
          <div className="card w-full max-w-md p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-semibold">{editing.id ? 'Modifier la question' : 'Nouvelle question'}</h2>
              <button onClick={() => setShowForm(false)} aria-label="Fermer">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="label">Question</label>
                <input
                  className="input"
                  value={editing.label}
                  onChange={(e) => setEditing({ ...editing, label: e.target.value })}
                />
              </div>
              <div>
                <label className="label">Type de champ</label>
                <select
                  className="input"
                  value={editing.type}
                  onChange={(e) => setEditing({ ...editing, type: e.target.value as FieldDef['type'] })}
                >
                  {Object.entries(TYPE_LABELS).map(([k, v]) => (
                    <option key={k} value={k}>
                      {v}
                    </option>
                  ))}
                </select>
              </div>
              {needsOptions && (
                <div>
                  <label className="label">Options (une par ligne)</label>
                  <textarea
                    className="input"
                    rows={3}
                    value={(editing.options || []).join('\n')}
                    onChange={(e) => setEditing({ ...editing, options: e.target.value.split('\n').filter(Boolean) })}
                  />
                </div>
              )}
              <label className="flex items-center gap-2 text-sm text-gray-600">
                <input
                  type="checkbox"
                  checked={editing.required}
                  onChange={(e) => setEditing({ ...editing, required: e.target.checked })}
                />
                Champ obligatoire
              </label>

              <div className="border-t border-gray-100 pt-4">
                <p className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-400">
                  Afficher uniquement si (facultatif)
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <select
                    className="input"
                    value={editing.showIfFieldId || ''}
                    onChange={(e) => setEditing({ ...editing, showIfFieldId: e.target.value || null })}
                  >
                    <option value="">Toujours affiché</option>
                    {(fields || [])
                      .filter((f) => f.id !== editing.id)
                      .map((f) => (
                        <option key={f.id} value={f.id}>
                          {f.label}
                        </option>
                      ))}
                  </select>
                  <input
                    className="input"
                    placeholder="Valeur attendue"
                    disabled={!editing.showIfFieldId}
                    value={editing.showIfValue || ''}
                    onChange={(e) => setEditing({ ...editing, showIfValue: e.target.value })}
                  />
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button onClick={() => setShowForm(false)} className="btn-secondary">
                Annuler
              </button>
              <button onClick={save} disabled={!editing.label} className="btn-primary">
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
