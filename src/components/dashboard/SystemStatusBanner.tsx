'use client';

import { useEffect, useState } from 'react';
import { MailWarning, X } from 'lucide-react';

export function SystemStatusBanner() {
  const [emailConfigured, setEmailConfigured] = useState<boolean | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    fetch('/api/system/status')
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => d && setEmailConfigured(d.emailConfigured))
      .catch(() => {});
  }, []);

  if (dismissed || emailConfigured !== false) return null;

  return (
    <div className="flex items-start gap-3 border-b border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 lg:px-8">
      <MailWarning className="mt-0.5 h-[18px] w-[18px] flex-shrink-0 text-amber-600" />
      <p className="flex-1">
        <strong>Vos emails ne sont pas encore configurés.</strong> Vos devis, messages et notifications s'affichent
        comme envoyés dans votre tableau de bord, mais vos clients ne reçoivent rien tant qu'un service d'envoi
        d'email n'est pas branché.{' '}
        <a
          href="https://resend.com/signup"
          target="_blank"
          rel="noreferrer"
          className="font-medium underline underline-offset-2"
        >
          Configurer l&apos;envoi d&apos;emails (gratuit)
        </a>
      </p>
      <button onClick={() => setDismissed(true)} aria-label="Masquer" className="text-amber-500 hover:text-amber-700">
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
