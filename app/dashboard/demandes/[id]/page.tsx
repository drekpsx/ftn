'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Mail, Phone, FileText, Send, User, Download, X } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { REQUEST_STATUS_COLORS, REQUEST_STATUS_LABELS } from '@/lib/status';
import { ErrorState } from '@/components/dashboard/ErrorState';

type Answer = { fieldId: string; label: string; value: unknown };

type RequestDetail = {
  id: string;
  status: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string | null;
  desiredDate: string | null;
  estimatedPrice: number | null;
  internalNotes: string | null;
  answers: Answer[];
  createdAt: string;
  customer: { id: string } | null;
  service: { id: string; name: string } | null;
  files: { id: string; filename: string; url: string }[];
  quotes: { id: string; number: string; status: string }[];
  activities: { id: string; message: string; createdAt: string }[];
};

function renderAnswerValue(value: unknown) {
  if (value === null || value === undefined || value === '') return '—';
  if (Array.isArray(value)) return value.join(', ');
  return String(value);
}

function isFileValue(value: unknown): value is string {
  return typeof value === 'string' && (value.startsWith('data:') || value.startsWith('/uploads') || value.startsWith('http'));
}

function isImageValue(value: string) {
  return value.startsWith('data:image/') || /\.(png|jpe?g|webp|gif)$/i.test(value);
}

export default function RequestDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [request, setRequest] = useState<RequestDetail | null>(null);
  const [notes, setNotes] = useState('');
  const [showMessage, setShowMessage] = useState(false);
  const [lightbox, setLightbox] = useState<string | null>(null);
  const [messageSubject, setMessageSubject] = useState('');
  const [messageBody, setMessageBody] = useState('');
  const [sending, setSending] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [messageError, setMessageError] = useState<string | null>(null);
  const [emailConfigured, setEmailConfigured] = useState(true);

  async function load() {
    setLoadError(null);
    const res = await fetch(`/api/requests/${params.id}`);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setLoadError(data.error || 'Impossible de charger cette demande.');
      return;
    }
    const data = await res.json();
    setRequest(data.request);
    setNotes(data.request.internalNotes || '');
    setMessageSubject(`À propos de votre demande`);
    setMessageBody(
      `Bonjour ${data.request.clientName.split(' ')[0]},\n\nMerci pour votre demande. Je viens de la recevoir et je reviens vers vous rapidement.\n\nÀ bientôt !`
    );
  }

  useEffect(() => {
    load();
    fetch('/api/system/status')
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => d && setEmailConfigured(d.emailConfigured))
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  async function updateStatus(status: string) {
    await fetch(`/api/requests/${params.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    load();
  }

  async function saveNotes() {
    await fetch(`/api/requests/${params.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ internalNotes: notes }),
    });
  }

  async function sendMessage() {
    setSending(true);
    setMessageError(null);
    try {
      const res = await fetch(`/api/requests/${params.id}/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject: messageSubject, body: messageBody }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setMessageError(data.error || "L'envoi a échoué. Réessayez.");
        return;
      }
      setShowMessage(false);
      load();
    } catch {
      setMessageError('Impossible de contacter le serveur. Vérifiez votre connexion et réessayez.');
    } finally {
      setSending(false);
    }
  }

  if (loadError) {
    return (
      <div>
        <Link href="/dashboard/demandes" className="mb-4 inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700">
          <ArrowLeft className="h-4 w-4" /> Retour aux demandes
        </Link>
        <ErrorState message={loadError} onRetry={load} />
      </div>
    );
  }

  if (!request) return <p className="text-sm text-gray-400">Chargement...</p>;

  return (
    <div>
      <Link href="/dashboard/demandes" className="mb-4 inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700">
        <ArrowLeft className="h-4 w-4" /> Retour aux demandes
      </Link>

      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">{request.clientName}</h1>
          <p className="text-sm text-gray-500">
            Reçue le {format(new Date(request.createdAt), 'd MMMM yyyy à HH:mm', { locale: fr })}
          </p>
        </div>
        <select
          className={`input w-56 font-medium ${REQUEST_STATUS_COLORS[request.status]}`}
          value={request.status}
          onChange={(e) => updateStatus(e.target.value)}
        >
          {Object.entries(REQUEST_STATUS_LABELS).map(([k, v]) => (
            <option key={k} value={k}>
              {v}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="card p-6">
            <h2 className="mb-4 font-semibold">Informations client</h2>
            <div className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
              <div className="flex items-center gap-2 text-gray-600">
                <Mail className="h-4 w-4 text-gray-400" /> {request.clientEmail}
              </div>
              {request.clientPhone && (
                <div className="flex items-center gap-2 text-gray-600">
                  <Phone className="h-4 w-4 text-gray-400" /> {request.clientPhone}
                </div>
              )}
              {request.customer && (
                <Link href={`/dashboard/clients/${request.customer.id}`} className="flex items-center gap-2 text-brand-700">
                  <User className="h-4 w-4" /> Voir la fiche client
                </Link>
              )}
            </div>
          </div>

          <div className="card p-6">
            <h2 className="mb-4 font-semibold">Détails de la demande</h2>
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between border-b border-gray-50 pb-2">
                <dt className="text-gray-500">Prestation</dt>
                <dd className="font-medium text-gray-800">{request.service?.name || '—'}</dd>
              </div>
              {request.desiredDate && (
                <div className="flex justify-between border-b border-gray-50 pb-2">
                  <dt className="text-gray-500">Date souhaitée</dt>
                  <dd className="font-medium text-gray-800">{format(new Date(request.desiredDate), 'd MMMM yyyy', { locale: fr })}</dd>
                </div>
              )}
              {request.estimatedPrice != null && (
                <div className="flex justify-between border-b border-gray-50 pb-2">
                  <dt className="text-gray-500">Estimation</dt>
                  <dd className="font-medium text-gray-800">{request.estimatedPrice} €</dd>
                </div>
              )}
              {request.answers.map((a) => (
                <div key={a.fieldId} className="flex items-center justify-between gap-4 border-b border-gray-50 pb-2 last:border-0">
                  <dt className="text-gray-500">{a.label}</dt>
                  <dd className="text-right font-medium text-gray-800">
                    {isFileValue(a.value) ? (
                      isImageValue(a.value) ? (
                        <button onClick={() => setLightbox(a.value as string)} className="block">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={a.value}
                            alt={a.label}
                            className="h-14 w-14 rounded-lg border border-gray-200 object-cover transition hover:opacity-80"
                          />
                        </button>
                      ) : (
                        <a href={a.value} download className="inline-flex items-center gap-1.5 text-brand-700 underline">
                          <Download className="h-4 w-4" /> Télécharger le fichier
                        </a>
                      )
                    ) : (
                      renderAnswerValue(a.value)
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="card p-6">
            <h2 className="mb-3 font-semibold">Note interne</h2>
            <textarea
              className="input"
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              onBlur={saveNotes}
              placeholder="Notes visibles uniquement par vous..."
            />
          </div>

          <div className="card p-6">
            <h2 className="mb-3 font-semibold">Historique</h2>
            <div className="space-y-3">
              {request.activities.map((a) => (
                <div key={a.id} className="flex justify-between text-sm">
                  <span className="text-gray-700">{a.message}</span>
                  <span className="text-gray-400">{format(new Date(a.createdAt), 'd MMM HH:mm', { locale: fr })}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="card p-5">
            <h2 className="mb-3 font-semibold">Actions</h2>
            <div className="space-y-2">
              <button
                onClick={() => router.push(`/dashboard/devis/nouveau?requestId=${request.id}`)}
                className="btn-primary w-full"
              >
                <FileText className="h-4 w-4" /> Créer un devis
              </button>
              <button onClick={() => setShowMessage(true)} className="btn-secondary w-full">
                <Send className="h-4 w-4" /> Envoyer un message
              </button>
            </div>
          </div>

          {request.quotes.length > 0 && (
            <div className="card p-5">
              <h2 className="mb-3 font-semibold">Devis liés</h2>
              <div className="space-y-2">
                {request.quotes.map((q) => (
                  <Link
                    key={q.id}
                    href={`/dashboard/devis/${q.id}`}
                    className="flex items-center justify-between rounded-lg px-3 py-2 text-sm hover:bg-gray-50"
                  >
                    <span>{q.number}</span>
                    <span className="text-gray-400">{q.status}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {request.files.length > 0 && (
            <div className="card p-5">
              <h2 className="mb-3 font-semibold">Fichiers</h2>
              <div className="space-y-1">
                {request.files.map((f) => (
                  <a key={f.id} href={f.url} download={f.filename} className="block truncate text-sm text-brand-700 underline">
                    {f.filename}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {showMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
          <div className="card w-full max-w-lg p-6">
            <h2 className="mb-4 font-semibold">Envoyer un message à {request.clientName}</h2>
            {!emailConfigured && (
              <p className="mb-3 rounded-xl bg-amber-50 px-3.5 py-2.5 text-xs text-amber-700">
                ⚠️ L&apos;envoi d&apos;emails n&apos;est pas configuré : ce message ne sera pas réellement reçu par
                votre client.
              </p>
            )}
            {messageError && (
              <div className="mb-3 rounded-xl bg-red-50 px-3.5 py-2.5 text-sm text-red-700">{messageError}</div>
            )}
            <div className="space-y-3">
              <input className="input" value={messageSubject} onChange={(e) => setMessageSubject(e.target.value)} />
              <textarea className="input" rows={6} value={messageBody} onChange={(e) => setMessageBody(e.target.value)} />
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={() => setShowMessage(false)} className="btn-secondary">
                Annuler
              </button>
              <button onClick={sendMessage} disabled={sending} className="btn-primary">
                {sending ? 'Envoi...' : 'Envoyer'}
              </button>
            </div>
          </div>
        </div>
      )}

      {lightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setLightbox(null)}
        >
          <button
            onClick={() => setLightbox(null)}
            className="absolute right-5 top-5 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
            aria-label="Fermer"
          >
            <X className="h-5 w-5" />
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={lightbox} alt="Aperçu" className="max-h-[85vh] max-w-full rounded-lg object-contain" />
        </div>
      )}
    </div>
  );
}
