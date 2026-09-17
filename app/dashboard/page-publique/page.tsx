'use client';

import { useEffect, useState } from 'react';
import { Copy, ExternalLink, Upload, Check, ImagePlus, Loader2 } from 'lucide-react';
import QRCode from 'qrcode';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { HelpBanner } from '@/components/dashboard/HelpBanner';
import { ErrorState } from '@/components/dashboard/ErrorState';

type Business = {
  slug: string;
  name: string;
  description: string | null;
  logoUrl: string | null;
  avatarUrl: string | null;
  coverUrl: string | null;
  primaryColor: string;
  phone: string | null;
  publicEmail: string | null;
  instagram: string | null;
  tiktok: string | null;
  website: string | null;
  showPricingPublicly: boolean;
  allowIndexing: boolean;
};

const SOURCES = [
  { key: 'instagram', label: 'Instagram' },
  { key: 'tiktok', label: 'TikTok' },
  { key: 'website', label: 'Site internet' },
  { key: 'qr', label: 'QR code' },
];

export default function PublicPageSettings() {
  const [business, setBusiness] = useState<Business | null>(null);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [appUrl, setAppUrl] = useState('');
  const [uploadingKey, setUploadingKey] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  function loadBusiness() {
    setLoadError(null);
    fetch('/api/business')
      .then(async (r) => {
        const data = await r.json().catch(() => ({}));
        if (!r.ok) throw new Error(data.error || 'Une erreur est survenue.');
        return data;
      })
      .then((d) => setBusiness(d.business))
      .catch((e) => setLoadError(e.message || 'Impossible de charger votre page. Vérifiez votre connexion et réessayez.'));
  }

  useEffect(() => {
    setAppUrl(window.location.origin);
    loadBusiness();
  }, []);

  useEffect(() => {
    if (business && appUrl) {
      QRCode.toDataURL(`${appUrl}/p/${business.slug}?source=qr`, { width: 240, margin: 1 }).then(setQrDataUrl);
    }
  }, [business, appUrl]);

  async function save(patch: Partial<Business>) {
    setSaving(true);
    try {
      const res = await fetch('/api/business', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patch),
      });
      const data = await res.json();
      if (!res.ok) {
        setUploadError(data.error || "L'enregistrement a échoué. Réessayez.");
        return;
      }
      setBusiness(data.business);
    } catch {
      setUploadError('Impossible de contacter le serveur. Vérifiez votre connexion et réessayez.');
    } finally {
      setSaving(false);
    }
  }

  async function upload(file: File, key: 'logoUrl' | 'avatarUrl' | 'coverUrl') {
    setUploadingKey(key);
    setUploadError(null);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (!res.ok) {
        setUploadError(data.error || "Impossible d'importer cette image. Réessayez.");
        return;
      }
      await save({ [key]: data.url } as Partial<Business>);
    } catch {
      setUploadError("Impossible d'importer cette image. Vérifiez votre connexion et réessayez.");
    } finally {
      setUploadingKey(null);
    }
  }

  function copy(text: string, key: string) {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 1500);
  }

  if (loadError) {
    return (
      <div>
        <PageHeader title="Page publique" subtitle="Personnalisez la page que vos prospects verront." />
        <ErrorState message={loadError} onRetry={loadBusiness} />
      </div>
    );
  }

  if (!business) return <p className="text-sm text-gray-400">Chargement...</p>;

  const baseLink = `${appUrl}/p/${business.slug}`;

  return (
    <div>
      <PageHeader title="Page publique" subtitle="Personnalisez la page que vos prospects verront." />

      <HelpBanner title="C'est votre vitrine">
        Cette page est celle que vos prospects découvrent en cliquant sur le lien dans votre bio Instagram, TikTok
        ou votre site. Remplissez-la comme une carte de visite : description, photo, réseaux sociaux — puis copiez
        le lien ci-dessous pour le partager partout.
      </HelpBanner>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="card p-6">
            <h2 className="mb-4 font-semibold">Votre lien public</h2>
            <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm">
              <span className="flex-1 truncate">{baseLink}</span>
              <button onClick={() => copy(baseLink, 'main')} className="btn-ghost px-2">
                {copied === 'main' ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
              </button>
              <a href={baseLink} target="_blank" rel="noreferrer" className="btn-ghost px-2">
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
            <p className="mt-4 mb-2 text-xs font-medium uppercase tracking-wide text-gray-400">
              Liens avec suivi de source
            </p>
            <div className="space-y-2">
              {SOURCES.filter((s) => s.key !== 'qr').map((s) => {
                const link = `${baseLink}?source=${s.key}`;
                return (
                  <div key={s.key} className="flex items-center gap-2 text-sm">
                    <span className="w-24 text-gray-500">{s.label}</span>
                    <span className="flex-1 truncate rounded-lg bg-gray-50 px-3 py-1.5 text-gray-600">{link}</span>
                    <button onClick={() => copy(link, s.key)} className="btn-ghost px-2">
                      {copied === s.key ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="card p-6">
            <h2 className="mb-4 font-semibold">Branding</h2>
            <div className="space-y-4">
              <div>
                <label className="label">Description</label>
                <textarea
                  className="input"
                  rows={3}
                  defaultValue={business.description ?? ''}
                  onBlur={(e) => save({ description: e.target.value })}
                />
              </div>
              {uploadError && (
                <div className="rounded-xl bg-red-50 px-3.5 py-2.5 text-sm text-red-700">{uploadError}</div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Photo de profil</label>
                  <label className="group relative flex h-24 w-24 cursor-pointer items-center justify-center overflow-hidden rounded-full border border-dashed border-gray-300 bg-gray-50 hover:border-brand-400">
                    {uploadingKey === 'avatarUrl' ? (
                      <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
                    ) : business.avatarUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={business.avatarUrl} alt="Photo de profil" className="h-full w-full object-cover" />
                    ) : (
                      <ImagePlus className="h-5 w-5 text-gray-400" />
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      className="absolute inset-0 cursor-pointer opacity-0"
                      onChange={(e) => e.target.files?.[0] && upload(e.target.files[0], 'avatarUrl')}
                    />
                  </label>
                </div>
                <div>
                  <label className="label">Image de couverture</label>
                  <label className="group relative flex h-24 w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl border border-dashed border-gray-300 bg-gray-50 hover:border-brand-400">
                    {uploadingKey === 'coverUrl' ? (
                      <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
                    ) : business.coverUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={business.coverUrl} alt="Image de couverture" className="h-full w-full object-cover" />
                    ) : (
                      <ImagePlus className="h-5 w-5 text-gray-400" />
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      className="absolute inset-0 cursor-pointer opacity-0"
                      onChange={(e) => e.target.files?.[0] && upload(e.target.files[0], 'coverUrl')}
                    />
                  </label>
                </div>
              </div>
              <p className="text-xs text-gray-400">Formats acceptés : JPG, PNG, WEBP, GIF. 4 Mo maximum.</p>
              <div>
                <label className="label">Couleur principale</label>
                <input
                  type="color"
                  className="h-10 w-20 rounded-lg border border-gray-200"
                  defaultValue={business.primaryColor}
                  onBlur={(e) => save({ primaryColor: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="card p-6">
            <h2 className="mb-4 font-semibold">Contact & réseaux</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Téléphone</label>
                <input className="input" defaultValue={business.phone ?? ''} onBlur={(e) => save({ phone: e.target.value })} />
              </div>
              <div>
                <label className="label">Email public</label>
                <input className="input" defaultValue={business.publicEmail ?? ''} onBlur={(e) => save({ publicEmail: e.target.value })} />
              </div>
              <div>
                <label className="label">Instagram</label>
                <input className="input" defaultValue={business.instagram ?? ''} onBlur={(e) => save({ instagram: e.target.value })} />
              </div>
              <div>
                <label className="label">TikTok</label>
                <input className="input" defaultValue={business.tiktok ?? ''} onBlur={(e) => save({ tiktok: e.target.value })} />
              </div>
              <div className="col-span-2">
                <label className="label">Site internet</label>
                <input className="input" defaultValue={business.website ?? ''} onBlur={(e) => save({ website: e.target.value })} />
              </div>
            </div>
          </div>

          <div className="card p-6">
            <h2 className="mb-4 font-semibold">Visibilité</h2>
            <label className="mb-3 flex items-center justify-between text-sm">
              <span>Afficher les tarifs sur la page publique</span>
              <input
                type="checkbox"
                checked={business.showPricingPublicly}
                onChange={(e) => save({ showPricingPublicly: e.target.checked })}
              />
            </label>
            <label className="flex items-center justify-between text-sm">
              <span>Autoriser les moteurs de recherche à indexer ma page</span>
              <input
                type="checkbox"
                checked={business.allowIndexing}
                onChange={(e) => save({ allowIndexing: e.target.checked })}
              />
            </label>
          </div>
        </div>

        <div className="card h-fit p-6 text-center">
          <h2 className="mb-4 font-semibold">QR code</h2>
          {qrDataUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={qrDataUrl} alt="QR code" className="mx-auto rounded-xl border border-gray-100" />
          )}
          <a
            href={qrDataUrl ?? '#'}
            download={`qr-${business.slug}.png`}
            className="btn-secondary mt-4 w-full justify-center"
          >
            <Upload className="h-4 w-4 rotate-180" /> Télécharger le PNG
          </a>
          <p className="mt-3 text-xs text-gray-400">Idéal à imprimer sur vos cartes de visite ou en boutique.</p>
        </div>
      </div>
      {saving && <p className="mt-4 text-xs text-gray-400">Enregistrement...</p>}
    </div>
  );
}
