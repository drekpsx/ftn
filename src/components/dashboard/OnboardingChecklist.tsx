'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Check, Circle } from 'lucide-react';

type ChecklistItem = { key: string; label: string; done: boolean; href: string };

export function OnboardingChecklist() {
  const [items, setItems] = useState<ChecklistItem[] | null>(null);
  const [progress, setProgress] = useState(0);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    fetch('/api/dashboard/checklist')
      .then((r) => r.json())
      .then((d) => {
        setItems(d.items);
        setProgress(d.progress);
      });
  }, []);

  if (!items || dismissed || progress === 100) return null;

  return (
    <div className="card mb-6 p-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="font-semibold text-gray-900">Bienvenue sur Flotik 👋</h2>
          <p className="text-sm text-gray-500">{progress}% terminé</p>
        </div>
        <button onClick={() => setDismissed(true)} className="text-xs text-gray-400 hover:text-gray-600">
          Masquer
        </button>
      </div>
      <div className="mb-4 h-1.5 w-full rounded-full bg-gray-100">
        <div className="h-1.5 rounded-full bg-brand-600 transition-all" style={{ width: `${progress}%` }} />
      </div>
      <div className="space-y-2">
        {items.map((item) => (
          <Link
            key={item.key}
            href={item.href}
            className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 text-sm hover:bg-gray-50"
          >
            {item.done ? (
              <Check className="h-4 w-4 flex-shrink-0 text-emerald-500" />
            ) : (
              <Circle className="h-4 w-4 flex-shrink-0 text-gray-300" />
            )}
            <span className={item.done ? 'text-gray-400 line-through' : 'text-gray-700'}>{item.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
