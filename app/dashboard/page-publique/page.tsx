'use client';

import { useEffect, useState } from 'react';
import { Copy, ExternalLink, Upload, Check } from 'lucide-react';
import QRCode from 'qrcode';
import { PageHeader } from '@/components/dashboard/PageHeader';

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

  useEffect(() => {
    setAppUrl(window.location.origin);
    fetch('/api/business')
      .then((r) => r.json())
      .then((d) => setBusiness(d.business));
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
      if (res.ok) setBusiness(data.business);
    } finally {
      setSaving(false);
    }
  }

  async function upload(file: File, key: 'logoUrl' | 'avatarUrl' | 'coverUrl') {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch('/api/upload', { method: 'POST', body: formData });
    const data = await res.json();
    if (res.ok) save({ [key]: data.url } as Partial<Business>);
  }

  function copy(text: string, key: string) {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 1500);
  }

  if (!business) return <p className="text-sm text-gray-400">Chargement...</p>;

  const baseLink = `${appUrl}/p/${business.slug}`;

  return (
    <div>
      <PageHeader title="Page publique" subtitle="Personnalisez la page que vos prospects verront." />

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
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Photo de profil</label>
                  <input type="file" accept="image/*" onChange={(e) => e.target.files && upload(e.target.files[0], 'avatarUrl')} />
                </div>
                <div>
                  <label className="label">Image de couverture</label>
                  <input type="file" accept="image/*" onChange={(e) => e.target.files && upload(e.target.files[0], 'coverUrl')} />
                </div>
              </div>
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
