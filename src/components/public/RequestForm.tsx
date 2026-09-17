'use client';

import { useEffect, useMemo, useState } from 'react';
import { Check, Loader2 } from 'lucide-react';
import { DynamicFormField, isFieldVisible, type FieldDef } from './DynamicFormField';
import { computeEstimate } from '@/lib/pricing';

export type PublicService = {
  id: string;
  name: string;
  description: string | null;
  priceType: 'FIXED' | 'STARTING_AT' | 'RANGE' | 'ON_QUOTE';
  price: number | null;
  priceMin: number | null;
  priceMax: number | null;
  options: { id: string; name: string; priceDelta: number }[];
};

export function RequestForm({
  slug,
  services,
  fields,
  showPricing,
  mode = 'live',
  source,
}: {
  slug: string;
  services: PublicService[];
  fields: FieldDef[];
  showPricing: boolean;
  mode?: 'live' | 'preview';
  source?: string | null;
}) {
  const [serviceId, setServiceId] = useState<string | null>(services[0]?.id ?? null);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [values, setValues] = useState<Record<string, unknown>>({});
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [disabledDates, setDisabledDates] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (mode === 'preview') return;
    fetch(`/api/public/${slug}/unavailability`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d?.dates) setDisabledDates(new Set<string>(d.dates));
      })
      .catch(() => {});
  }, [slug, mode]);

  const service = services.find((s) => s.id === serviceId) ?? null;
  const estimate = useMemo(() => computeEstimate(service, selectedOptions), [service, selectedOptions]);
  const visibleFields = fields.filter((f) => isFieldVisible(f, values));

  function toggleOption(id: string) {
    setSelectedOptions((prev) => (prev.includes(id) ? prev.filter((o) => o !== id) : [...prev, id]));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (mode === 'preview') return;
    setError(null);

    for (const field of visibleFields) {
      if (field.required && !values[field.id]) {
        setError(`Merci de renseigner : ${field.label}`);
        return;
      }
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('email', email);
      formData.append('phone', phone);
      if (serviceId) formData.append('serviceId', serviceId);
      if (source) formData.append('source', source);
      formData.append('selectedOptions', JSON.stringify(selectedOptions));

      const answers: { fieldId: string; label: string; value: unknown }[] = [];
      for (const field of visibleFields) {
        if (field.type === 'FILE') {
          const file = values[field.id] as File | null;
          if (file) {
            formData.append(`file_${field.id}`, file);
            answers.push({ fieldId: field.id, label: field.label, value: `__FILE__${field.id}` });
          }
        } else {
          answers.push({ fieldId: field.id, label: field.label, value: values[field.id] ?? null });
        }
      }
      formData.append('answers', JSON.stringify(answers));

      const res = await fetch(`/api/public/${slug}/submit`, { method: 'POST', body: formData });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Impossible d'envoyer votre demande. Réessayez.");
        return;
      }
      setSuccess(true);
    } catch {
      setError('Impossible de contacter le serveur. Vérifiez votre connexion et réessayez.');
    } finally {
      setSubmitting(false);
    }
  }

  if (success) {
    return (
      <div className="card p-8 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
          <Check className="h-7 w-7" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">Demande envoyée 🎉</h3>
        <p className="mt-1 text-sm text-gray-500">Votre demande a bien été reçue. Vous recevrez une réponse rapidement.</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {error && <div className="rounded-xl bg-red-50 px-3.5 py-2.5 text-sm text-red-700">{error}</div>}

      {services.length > 0 && (
        <div>
          <p className="label">Prestation souhaitée</p>
          <div className="grid gap-3 sm:grid-cols-2">
            {services.map((s) => (
              <button
                type="button"
                key={s.id}
                onClick={() => {
                  setServiceId(s.id);
                  setSelectedOptions([]);
                }}
                className={`rounded-xl border p-4 text-left transition-colors ${
                  serviceId === s.id ? 'border-brand-600 bg-brand-50' : 'border-gray-200 bg-white hover:bg-gray-50'
                }`}
              >
                <p className="font-medium text-gray-900">{s.name}</p>
                {s.description && <p className="mt-0.5 text-xs text-gray-500">{s.description}</p>}
              </button>
            ))}
          </div>
        </div>
      )}

      {service && service.options.length > 0 && (
        <div>
          <p className="label">Options</p>
          <div className="flex flex-wrap gap-2">
            {service.options.map((o) => (
              <button
                type="button"
                key={o.id}
                onClick={() => toggleOption(o.id)}
                className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
                  selectedOptions.includes(o.id) ? 'border-brand-600 bg-brand-50 text-brand-700' : 'border-gray-200 text-gray-600'
                }`}
              >
                {o.name} {o.priceDelta > 0 ? `(+${o.priceDelta} €)` : ''}
              </button>
            ))}
          </div>
        </div>
      )}

      {showPricing && estimate.display && (
        <div className="rounded-xl bg-brand-50 px-4 py-3 text-sm font-medium text-brand-700">{estimate.display}</div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label">Nom complet *</label>
          <input required className="input" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <label className="label">Email *</label>
          <input type="email" required className="input" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="sm:col-span-2">
          <label className="label">Téléphone</label>
          <input type="tel" className="input" value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>
      </div>

      {visibleFields.map((field) => (
        <DynamicFormField
          key={field.id}
          field={field}
          value={values[field.id]}
          onChange={(v) => setValues((prev) => ({ ...prev, [field.id]: v }))}
          disabledDates={disabledDates}
        />
      ))}

      <button type="submit" disabled={submitting || mode === 'preview'} className="btn-primary w-full">
        {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
        {mode === 'preview' ? 'Aperçu — envoi désactivé' : submitting ? 'Envoi...' : 'Envoyer ma demande'}
      </button>
    </form>
  );
}
