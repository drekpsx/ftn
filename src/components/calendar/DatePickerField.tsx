'use client';

import { useEffect, useRef, useState } from 'react';
import { format, isBefore, isSameDay, parseISO, startOfDay } from 'date-fns';
import { fr } from 'date-fns/locale';
import { CalendarDays } from 'lucide-react';
import { MonthCalendar } from './MonthCalendar';

/**
 * Sélecteur de date personnalisé : impossible de choisir une date passée ou
 * un jour marqué indisponible par le professionnel (contrairement à un
 * <input type="date"> natif, qui ne peut bloquer que des dates passées).
 */
export function DatePickerField({
  id,
  value,
  onChange,
  disabledDates,
}: {
  id?: string;
  value: string | null;
  onChange: (value: string) => void;
  disabledDates: Set<string>;
}) {
  const [open, setOpen] = useState(false);
  const today = startOfDay(new Date());
  const [month, setMonth] = useState(value ? startOfDay(parseISO(value)) : today);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  function isDisabled(day: Date) {
    return isBefore(day, today) || disabledDates.has(format(day, 'yyyy-MM-dd'));
  }

  const selectedDate = value ? parseISO(value) : null;

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        id={id}
        onClick={() => setOpen((o) => !o)}
        className="input flex items-center justify-between text-left"
      >
        <span className={selectedDate ? 'text-gray-900' : 'text-gray-400'}>
          {selectedDate ? format(selectedDate, 'EEEE d MMMM yyyy', { locale: fr }) : 'Choisir une date'}
        </span>
        <CalendarDays className="h-4 w-4 flex-shrink-0 text-gray-400" />
      </button>

      {open && (
        <div className="absolute z-30 mt-2 w-[280px] rounded-xl border border-gray-200 bg-white p-3 shadow-lg">
          <MonthCalendar
            month={month}
            onMonthChange={setMonth}
            minMonth={today}
            renderDay={(day, inMonth) => {
              const disabled = isDisabled(day);
              const selected = selectedDate ? isSameDay(day, selectedDate) : false;
              return (
                <button
                  type="button"
                  disabled={disabled || !inMonth}
                  onClick={() => {
                    onChange(format(day, 'yyyy-MM-dd'));
                    setOpen(false);
                  }}
                  className={`h-8 w-8 rounded-full text-xs transition-colors ${!inMonth ? 'invisible' : ''} ${
                    disabled
                      ? 'cursor-not-allowed text-gray-300 line-through'
                      : selected
                        ? 'bg-brand-600 font-semibold text-white'
                        : 'text-gray-700 hover:bg-brand-50'
                  }`}
                >
                  {day.getDate()}
                </button>
              );
            }}
          />
          <p className="mt-2 text-[11px] text-gray-400">Les jours indisponibles ou déjà passés sont grisés.</p>
        </div>
      )}
    </div>
  );
}
