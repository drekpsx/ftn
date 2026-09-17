'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { format, isSameDay, isToday, startOfDay } from 'date-fns';
import { fr } from 'date-fns/locale';
import { CalendarOff, Loader2, X } from 'lucide-react';
import { MonthCalendar } from '@/components/calendar/MonthCalendar';
import { ErrorState } from '@/components/dashboard/ErrorState';
import { HelpBanner } from '@/components/dashboard/HelpBanner';
import { REQUEST_STATUS_COLORS, REQUEST_STATUS_DOT, REQUEST_STATUS_LABELS } from '@/lib/status';

type PlanningRequest = {
  id: string;
  clientName: string;
  status: string;
  desiredDate: string;
  service: { name: string } | null;
};

type Unavailability = { id: string; date: string; reason: string | null };

export default function PlanningPage() {
  const [month, setMonth] = useState(() => startOfDay(new Date()));
  const [requests, setRequests] = useState<PlanningRequest[]>([]);
  const [unavailability, setUnavailability] = useState<Unavailability[]>([]);
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [toggling, setToggling] = useState(false);

  async function load() {
    setLoadError(null);
    const monthParam = format(month, 'yyyy-MM');
    const res = await fetch(`/api/planning?month=${monthParam}`);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setLoadError(data.error || 'Impossible de charger le planning.');
      return;
    }
    const data = await res.json();
    setRequests(data.requests);
    setUnavailability(data.unavailability);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [month]);

  const requestsByDay = useMemo(() => {
    const map = new Map<string, PlanningRequest[]>();
    for (const r of requests) {
      if (!r.desiredDate) continue;
      const key = r.desiredDate.slice(0, 10);
      map.set(key, [...(map.get(key) || []), r]);
    }
    return map;
  }, [requests]);

  const blockedDays = useMemo(() => new Set(unavailability.map((u) => u.date.slice(0, 10))), [unavailability]);

  async function toggleDayOff(day: Date) {
    setToggling(true);
    try {
      const res = await fetch('/api/unavailability', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: format(day, 'yyyy-MM-dd') }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setLoadError(data.error || "Impossible de mettre à jour ce jour.");
        return;
      }
      await load();
    } finally {
      setToggling(false);
    }
  }

  if (loadError) {
    return (
      <div>
        <h1 className="mb-6 text-2xl font-semibold text-gray-900">Planning</h1>
        <ErrorState message={loadError} onRetry={load} />
      </div>
    );
  }

  const dayKey = (d: Date) => format(d, 'yyyy-MM-dd');
  const selectedDayRequests = selectedDay ? requestsByDay.get(dayKey(selectedDay)) || [] : [];
  const selectedDayBlocked = selectedDay ? blockedDays.has(dayKey(selectedDay)) : false;

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold text-gray-900">Planning</h1>

      <HelpBanner title="Vos disponibilités">
        Cliquez sur un jour pour voir les demandes prévues à cette date, ou pour le marquer comme{' '}
        <strong>jour de congé</strong>. Un jour fermé (grisé) ne pourra plus être choisi par vos prospects sur votre page publique.
      </HelpBanner>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="card p-6 lg:col-span-2">
          <MonthCalendar
            month={month}
            onMonthChange={setMonth}
            renderDay={(day, inMonth) => {
              const key = dayKey(day);
              const dayRequests = requestsByDay.get(key) || [];
              const blocked = blockedDays.has(key);
              const selected = selectedDay ? isSameDay(day, selectedDay) : false;

              return (
                <button
                  type="button"
                  onClick={() => setSelectedDay(day)}
                  className={`flex h-16 w-full flex-col items-center justify-start gap-1 rounded-xl border p-1.5 text-xs transition-colors sm:h-20 ${
                    !inMonth ? 'border-transparent text-gray-300' : 'border-gray-100 hover:border-brand-200 hover:bg-brand-50/40'
                  } ${selected ? 'border-brand-500 bg-brand-50' : ''} ${blocked && inMonth ? 'bg-gray-50' : ''}`}
                >
                  <span
                    className={`flex h-5 w-5 items-center justify-center rounded-full font-medium ${
                      isToday(day) ? 'bg-brand-600 text-white' : inMonth ? 'text-gray-700' : 'text-gray-300'
                    }`}
                  >
                    {day.getDate()}
                  </span>
                  {blocked && inMonth && <CalendarOff className="h-3 w-3 text-gray-400" />}
                  {!blocked && dayRequests.length > 0 && (
                    <div className="flex flex-wrap items-center justify-center gap-0.5">
                      {dayRequests.slice(0, 4).map((r) => (
                        <span key={r.id} className={`h-1.5 w-1.5 rounded-full ${REQUEST_STATUS_DOT[r.status] || 'bg-gray-400'}`} />
                      ))}
                      {dayRequests.length > 4 && <span className="text-[9px] text-gray-400">+{dayRequests.length - 4}</span>}
                    </div>
                  )}
                </button>
              );
            }}
          />

          <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2 border-t border-gray-100 pt-4 text-xs text-gray-500">
            {Object.entries(REQUEST_STATUS_LABELS).map(([key, label]) => (
              <span key={key} className="flex items-center gap-1.5">
                <span className={`h-2 w-2 rounded-full ${REQUEST_STATUS_DOT[key]}`} /> {label}
              </span>
            ))}
          </div>
        </div>

        <div className="card p-6">
          {!selectedDay ? (
            <p className="text-sm text-gray-400">Sélectionnez un jour dans le calendrier pour voir le détail.</p>
          ) : (
            <div>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-semibold capitalize text-gray-900">{format(selectedDay, 'EEEE d MMMM', { locale: fr })}</h2>
                <button onClick={() => setSelectedDay(null)} className="text-gray-400 hover:text-gray-600" aria-label="Fermer">
                  <X className="h-4 w-4" />
                </button>
              </div>

              <button
                onClick={() => toggleDayOff(selectedDay)}
                disabled={toggling}
                className={selectedDayBlocked ? 'btn-secondary w-full' : 'btn-ghost w-full border border-gray-200 text-red-600'}
              >
                {toggling ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <CalendarOff className="h-4 w-4" />
                )}
                {selectedDayBlocked ? 'Réouvrir ce jour' : 'Marquer comme jour de congé'}
              </button>

              <h3 className="mb-2 mt-6 text-xs font-semibold uppercase tracking-wide text-gray-400">
                Demandes ({selectedDayRequests.length})
              </h3>
              {selectedDayRequests.length === 0 ? (
                <p className="text-sm text-gray-400">Aucune demande prévue ce jour-là.</p>
              ) : (
                <div className="space-y-2">
                  {selectedDayRequests.map((r) => (
                    <Link
                      key={r.id}
                      href={`/dashboard/demandes/${r.id}`}
                      className="block rounded-xl border border-gray-100 p-3 hover:border-brand-200 hover:bg-brand-50/40"
                    >
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-800">{r.clientName}</p>
                        <span className={`badge ${REQUEST_STATUS_COLORS[r.status]}`}>{REQUEST_STATUS_LABELS[r.status]}</span>
                      </div>
                      {r.service && <p className="mt-0.5 text-xs text-gray-500">{r.service.name}</p>}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
