'use client';

import { ReactNode } from 'react';
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameMonth,
  startOfMonth,
  startOfWeek,
  subMonths,
} from 'date-fns';
import { fr } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const WEEKDAYS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

/**
 * Grille mensuelle réutilisable (planning interne + sélecteur de date public).
 * Le contenu de chaque case est entièrement délégué à `renderDay`.
 */
export function MonthCalendar({
  month,
  onMonthChange,
  renderDay,
  minMonth,
}: {
  month: Date;
  onMonthChange: (next: Date) => void;
  renderDay: (date: Date, isCurrentMonth: boolean) => ReactNode;
  minMonth?: Date;
}) {
  const gridStart = startOfWeek(startOfMonth(month), { weekStartsOn: 1 });
  const gridEnd = endOfWeek(endOfMonth(month), { weekStartsOn: 1 });
  const days = eachDayOfInterval({ start: gridStart, end: gridEnd });
  const canGoBack = !minMonth || startOfMonth(month) > startOfMonth(minMonth);

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <button
          type="button"
          onClick={() => onMonthChange(subMonths(month, 1))}
          disabled={!canGoBack}
          className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-30"
          aria-label="Mois précédent"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <p className="text-sm font-semibold capitalize text-gray-800">{format(month, 'MMMM yyyy', { locale: fr })}</p>
        <button
          type="button"
          onClick={() => onMonthChange(addMonths(month, 1))}
          className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100"
          aria-label="Mois suivant"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-medium uppercase tracking-wide text-gray-400">
        {WEEKDAYS.map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>
      <div className="mt-1 grid grid-cols-7 gap-1">
        {days.map((d) => (
          <div key={d.toISOString()}>{renderDay(d, isSameMonth(d, month))}</div>
        ))}
      </div>
    </div>
  );
}
