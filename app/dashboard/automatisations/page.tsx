'use client';

import { useEffect, useState } from 'react';
import { PageHeader } from '@/components/dashboard/PageHeader';

type Automation = { id: string; type: string; delayHours: number; enabled: boolean; templateKey: string };

const LABELS: Record<string, string> = {
  reminder_1: 'Première relance',
  reminder_2: 'Relance finale',
};

export default function AutomationsPage() {
  const [automations, setAutomations] = useState<Automation[] | null>(null);

  function load() {
    fetch('/api/automations')
      .then((r) => r.json())
      .then((d) => setAutomations(d.automations));
  }

  useEffect(load, []);

  async function update(id: string, patch: Partial<Automation>) {
    await fetch(`/api/automations/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patch),
    });
    load();
  }

  return (
    <div>
      <PageHeader title="Automatisations" subtitle="Automatisez vos relances pour ne plus jamais oublier un prospect." />

      <div className="card divide-y divide-gray-100">
        {automations === null ? (
          <p className="p-5 text-sm text-gray-400">Chargement...</p>
        ) : (
          automations.map((a) => (
            <div key={a.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
              <div>
                <p className="font-medium text-gray-900">{LABELS[a.templateKey] || 'Relance'}</p>
                <p className="text-sm text-gray-500">
                  Envoyée si le devis n&apos;a pas de réponse après{' '}
                  <input
                    type="number"
                    className="input inline-block w-20 px-2 py-1"
                    defaultValue={a.delayHours}
                    onBlur={(e) => update(a.id, { delayHours: Number(e.target.value) })}
                  />{' '}
                  heures
                </p>
              </div>
              <label className="relative inline-flex cursor-pointer items-center">
                <input
                  type="checkbox"
                  className="peer sr-only"
                  checked={a.enabled}
                  onChange={(e) => update(a.id, { enabled: e.target.checked })}
                />
                <div className="h-6 w-11 rounded-full bg-gray-200 transition-colors peer-checked:bg-brand-600 after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-transform after:content-[''] peer-checked:after:translate-x-5" />
              </label>
            </div>
          ))
        )}
      </div>

      <p className="mt-4 text-xs text-gray-400">
        Les relances ne sont jamais envoyées si le devis a déjà été accepté ou refusé.
      </p>
    </div>
  );
}
