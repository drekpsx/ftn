'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check, Copy, ExternalLink, Plus, Trash2 } from 'lucide-react';
import { ACTIVITIES, getActivity, type DefaultField, type DefaultService } from '@/lib/business-types';
import { Logo } from '@/components/Logo';
import type { Business } from '@prisma/client';

type ServiceDraft = DefaultService & { id: string };
type FieldDraft = DefaultField & { id: string };

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

const STEP_LABELS = ['Métier', 'Entreprise', 'Prestations', 'Formulaire', 'Personnalisation', 'Terminé'];

export function OnboardingWizard({ existingBusiness }: { existingBusiness: Business | null }) {
  const router = useRouter();
  const [step, setStep] = useState(existingBusiness ? 2 : 0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [activityId, setActivityId] = useState('photographe');
  const [customActivity, setCustomActivity] = useState('');
  const [businessName, setBusinessName] = useState(existingBusiness?.name ?? '');
  const [slug, setSlug] = useState(existingBusiness?.slug ?? '');

  const [services, setServices] = useState<ServiceDraft[]>(
    getActivity(activityId).defaultServices.map((s) => ({ ...s, id: uid() }))
  );
  const [fields, setFields] = useState<FieldDraft[]>(
    getActivity(activityId).defaultFields.map((f) => ({ ...f, id: uid() }))
  );

  const [description, setDescription] = useState('');
  const [primaryColor, setPrimaryColor] = useState('#16A87F');
  const [instagram, setInstagram] = useState('');
  const [tiktok, setTiktok] = useState('');
  const [website, setWebsite] = useState('');
  const [phone, setPhone] = useState('');
  const [publicEmail, setPublicEmail] = useState('');

  const appUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const publicLink = `${appUrl}/p/${slug}`;

  function selectActivity(id: string) {
    setActivityId(id);
    const activity = getActivity(id);
    setServices(activity.defaultServices.map((s) => ({ ...s, id: uid() })));
    setFields(activity.defaultFields.map((f) => ({ ...f, id: uid() })));
  }

  async function createBusiness() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/business', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ activity: activityId, customActivity, name: businessName }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Une erreur est survenue.');
        return false;
      }
      setSlug(data.business.slug);
      return true;
    } catch {
      setError('Impossible de contacter le serveur.');
      return false;
    } finally {
      setLoading(false);
    }
  }

  const GENERIC_SAVE_ERROR =
    "Une information n'a pas pu être enregistrée. Vérifiez votre connexion et réessayez — n'avancez pas tant que ce message est affiché.";

  async function saveServices() {
    setLoading(true);
    setError(null);
    try {
      for (const s of services) {
        if (!s.name.trim()) continue;
        const res = await fetch('/api/services', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: s.name,
            priceType: s.priceType,
            price: s.price ?? null,
            priceMin: s.priceMin ?? null,
            priceMax: s.priceMax ?? null,
          }),
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          setError(data.error || GENERIC_SAVE_ERROR);
          return false;
        }
      }
      return true;
    } catch {
      setError(GENERIC_SAVE_ERROR);
      return false;
    } finally {
      setLoading(false);
    }
  }

  async function saveFields() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/form-fields', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fields: fields.filter((f) => f.label.trim()) }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || GENERIC_SAVE_ERROR);
        return false;
      }
      return true;
    } catch {
      setError(GENERIC_SAVE_ERROR);
      return false;
    } finally {
      setLoading(false);
    }
  }

  async function saveBranding() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/business', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          description,
          primaryColor,
          instagram,
          tiktok,
          website,
          phone,
          publicEmail: publicEmail || null,
          onboardingStep: 5,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || GENERIC_SAVE_ERROR);
        return false;
      }
      return true;
    } catch {
      setError(GENERIC_SAVE_ERROR);
      return false;
    } finally {
      setLoading(false);
    }
  }

  async function finish() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/business', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ onboardingCompleted: true, onboardingStep: 6 }),
      });
      if (!res.ok) {
        setError(GENERIC_SAVE_ERROR);
        return;
      }
      router.push('/dashboard');
    } catch {
      setError(GENERIC_SAVE_ERROR);
    } finally {
      setLoading(false);
    }
  }

  async function next() {
    if (step === 0) {
      setStep(1);
      return;
    }
    if (step === 1) {
      if (!businessName.trim()) {
        setError("Le nom de l'entreprise est requis.");
        return;
      }
      const ok = await createBusiness();
      if (ok) setStep(2);
      return;
    }
    if (step === 2) {
      const ok = await saveServices();
      if (ok) setStep(3);
      return;
    }
    if (step === 3) {
      const ok = await saveFields();
      if (ok) setStep(4);
      return;
    }
    if (step === 4) {
      const ok = await saveBranding();
      if (ok) setStep(5);
      return;
    }
  }

  function back() {
    setError(null);
    setStep((s) => Math.max(0, s - 1));
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="mx-auto max-w-2xl px-4">
        <div className="mb-8 flex justify-center">
          <Logo />
        </div>
        <div className="mb-8">
          <div className="mb-2 flex justify-between text-xs font-medium text-gray-500">
            {STEP_LABELS.map((label, i) => (
              <span key={label} className={i <= step ? 'text-brand-700' : ''}>
                {label}
              </span>
            ))}
          </div>
          <div className="h-1.5 w-full rounded-full bg-gray-200">
            <div
              className="h-1.5 rounded-full bg-brand-600 transition-all"
              style={{ width: `${(step / (STEP_LABELS.length - 1)) * 100}%` }}
            />
          </div>
        </div>

        <div className="card p-8">
          {error && (
            <div className="mb-4 rounded-xl bg-red-50 px-3.5 py-2.5 text-sm text-red-700">{error}</div>
          )}

          {step === 0 && (
            <div>
              <h1 className="text-xl font-semibold">Quel est votre métier ?</h1>
              <p className="mt-1 text-sm text-gray-500">Nous adaptons votre page et votre formulaire à votre activité.</p>
              <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {ACTIVITIES.map((a) => (
                  <button
                    key={a.id}
                    onClick={() => selectActivity(a.id)}
                    className={`rounded-xl border px-3 py-3 text-sm font-medium transition-colors ${
                      activityId === a.id
                        ? 'border-brand-600 bg-brand-50 text-brand-700'
                        : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {a.label}
                  </button>
                ))}
              </div>
              {activityId === 'autre' && (
                <input
                  className="input mt-4"
                  placeholder="Précisez votre métier"
                  value={customActivity}
                  onChange={(e) => setCustomActivity(e.target.value)}
                />
              )}
            </div>
          )}

          {step === 1 && (
            <div>
              <h1 className="text-xl font-semibold">Comment s'appelle votre entreprise ?</h1>
              <p className="mt-1 text-sm text-gray-500">Ce nom apparaîtra sur votre page publique et vos devis.</p>
              <input
                className="input mt-6"
                placeholder="Ex : Studio Nova"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
              />
            </div>
          )}

          {step === 2 && (
            <div>
              <h1 className="text-xl font-semibold">Que proposez-vous ?</h1>
              <p className="mt-1 text-sm text-gray-500">Créez vos premières prestations. Vous pourrez tout modifier plus tard.</p>
              <div className="mt-6 space-y-3">
                {services.map((s) => (
                  <div key={s.id} className="flex items-center gap-2 rounded-xl border border-gray-200 p-3">
                    <input
                      className="input"
                      value={s.name}
                      onChange={(e) =>
                        setServices(services.map((x) => (x.id === s.id ? { ...x, name: e.target.value } : x)))
                      }
                    />
                    <select
                      className="input w-40"
                      value={s.priceType}
                      onChange={(e) =>
                        setServices(
                          services.map((x) => (x.id === s.id ? { ...x, priceType: e.target.value as DefaultService['priceType'] } : x))
                        )
                      }
                    >
                      <option value="FIXED">Prix fixe</option>
                      <option value="STARTING_AT">À partir de</option>
                      <option value="RANGE">Fourchette</option>
                      <option value="ON_QUOTE">Sur devis</option>
                    </select>
                    {s.priceType !== 'ON_QUOTE' && (
                      <input
                        type="number"
                        className="input w-28"
                        placeholder="Prix €"
                        value={s.price ?? ''}
                        onChange={(e) =>
                          setServices(services.map((x) => (x.id === s.id ? { ...x, price: Number(e.target.value) } : x)))
                        }
                      />
                    )}
                    <button
                      onClick={() => setServices(services.filter((x) => x.id !== s.id))}
                      className="btn-ghost px-2"
                      aria-label="Supprimer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => setServices([...services, { id: uid(), name: '', priceType: 'ON_QUOTE' }])}
                  className="btn-secondary"
                >
                  <Plus className="h-4 w-4" /> Ajouter une prestation
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h1 className="text-xl font-semibold">Quelles informations souhaitez-vous demander ?</h1>
              <p className="mt-1 text-sm text-gray-500">Ce formulaire sera affiché à vos prospects.</p>
              <div className="mt-6 space-y-3">
                {fields.map((f) => (
                  <div key={f.id} className="flex items-center gap-2 rounded-xl border border-gray-200 p-3">
                    <input
                      className="input"
                      value={f.label}
                      onChange={(e) => setFields(fields.map((x) => (x.id === f.id ? { ...x, label: e.target.value } : x)))}
                    />
                    <label className="flex items-center gap-1.5 text-xs text-gray-500">
                      <input
                        type="checkbox"
                        checked={f.required}
                        onChange={(e) => setFields(fields.map((x) => (x.id === f.id ? { ...x, required: e.target.checked } : x)))}
                      />
                      Obligatoire
                    </label>
                    <button onClick={() => setFields(fields.filter((x) => x.id !== f.id))} className="btn-ghost px-2">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => setFields([...fields, { id: uid(), label: '', type: 'TEXT', required: false }])}
                  className="btn-secondary"
                >
                  <Plus className="h-4 w-4" /> Ajouter une question
                </button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div>
              <h1 className="text-xl font-semibold">Personnalisez votre page</h1>
              <div className="mt-6 space-y-4">
                <div>
                  <label className="label">Description</label>
                  <textarea className="input" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
                </div>
                <div>
                  <label className="label">Couleur principale</label>
                  <input
                    type="color"
                    className="h-10 w-20 rounded-lg border border-gray-200"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="label">Téléphone</label>
                    <input className="input" value={phone} onChange={(e) => setPhone(e.target.value)} />
                  </div>
                  <div>
                    <label className="label">Email public</label>
                    <input className="input" value={publicEmail} onChange={(e) => setPublicEmail(e.target.value)} />
                  </div>
                  <div>
                    <label className="label">Instagram</label>
                    <input className="input" placeholder="@monentreprise" value={instagram} onChange={(e) => setInstagram(e.target.value)} />
                  </div>
                  <div>
                    <label className="label">TikTok</label>
                    <input className="input" value={tiktok} onChange={(e) => setTiktok(e.target.value)} />
                  </div>
                  <div className="col-span-2">
                    <label className="label">Site internet</label>
                    <input className="input" value={website} onChange={(e) => setWebsite(e.target.value)} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                <Check className="h-7 w-7" />
              </div>
              <h1 className="text-xl font-semibold">Votre page est prête !</h1>
              <p className="mt-1 text-sm text-gray-500">Partagez ce lien dans votre bio Instagram, TikTok ou sur votre site.</p>
              <div className="mt-6 flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700">
                <span className="flex-1 truncate text-left">{publicLink}</span>
                <button
                  className="btn-ghost px-2"
                  onClick={() => navigator.clipboard.writeText(publicLink)}
                  aria-label="Copier le lien"
                >
                  <Copy className="h-4 w-4" />
                </button>
              </div>
              <div className="mt-6 flex justify-center gap-3">
                <a href={`/p/${slug}`} target="_blank" rel="noreferrer" className="btn-secondary">
                  <ExternalLink className="h-4 w-4" /> Voir ma page
                </a>
                <button onClick={finish} disabled={loading} className="btn-primary">
                  Aller à mon tableau de bord
                </button>
              </div>
            </div>
          )}

          {step < 5 && (
            <div className="mt-8 flex justify-between">
              <button onClick={back} disabled={step === 0} className="btn-ghost disabled:opacity-0">
                Retour
              </button>
              <button onClick={next} disabled={loading} className="btn-primary">
                {loading ? 'Chargement...' : 'Continuer'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
