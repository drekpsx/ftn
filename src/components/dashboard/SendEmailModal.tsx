'use client';

import { useEffect, useState } from 'react';
import { Mail, Copy, Check, X } from 'lucide-react';
import { openMailto } from '@/lib/mailto';

export function SendEmailModal({
  open,
  onClose,
  to,
  defaultSubject,
  defaultBody,
  onSent,
  title,
}: {
  open: boolean;
  onClose: () => void;
  to: string;
  defaultSubject: string;
  defaultBody: string;
  onSent?: (subject: string, body: string) => Promise<void> | void;
  title: string;
}) {
  const [subject, setSubject] = useState(defaultSubject);
  const [body, setBody] = useState(defaultBody);
  const [copied, setCopied] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setSubject(defaultSubject);
      setBody(defaultBody);
      setError(null);
      setCopied(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, defaultSubject, defaultBody]);

  if (!open) return null;

  async function handleSend() {
    setSending(true);
    setError(null);
    try {
      if (onSent) await onSent(subject, body);
      openMailto(to, subject, body);
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : "L'envoi a échoué. Réessayez.");
    } finally {
      setSending(false);
    }
  }

  function copyMessage() {
    navigator.clipboard.writeText(`À : ${to}\nObjet : ${subject}\n\n${body}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div className="card w-full max-w-lg p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">{title}</h2>
          <button onClick={onClose} aria-label="Fermer" className="text-gray-400 hover:text-gray-600">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mb-3 rounded-xl bg-brand-50 px-3.5 py-2.5 text-xs text-brand-800">
          En cliquant sur « Envoyer », votre messagerie habituelle (Gmail, Outlook...) s&apos;ouvre avec ce message
          déjà prêt — c&apos;est elle qui envoie réellement l&apos;email, gratuitement, avec votre propre adresse.
        </div>

        {error && <div className="mb-3 rounded-xl bg-red-50 px-3.5 py-2.5 text-sm text-red-700">{error}</div>}

        <div className="space-y-3">
          <div>
            <label className="label">À</label>
            <input className="input bg-gray-50 text-gray-500" value={to} disabled />
          </div>
          <div>
            <label className="label">Objet</label>
            <input className="input" value={subject} onChange={(e) => setSubject(e.target.value)} />
          </div>
          <div>
            <label className="label">Message</label>
            <textarea className="input" rows={7} value={body} onChange={(e) => setBody(e.target.value)} />
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-2">
          <button onClick={copyMessage} className="btn-ghost text-sm">
            {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
            {copied ? 'Copié !' : 'Copier le message'}
          </button>
          <div className="flex gap-2">
            <button onClick={onClose} className="btn-secondary">
              Annuler
            </button>
            <button onClick={handleSend} disabled={sending} className="btn-primary">
              <Mail className="h-4 w-4" /> {sending ? 'Préparation...' : 'Envoyer'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
