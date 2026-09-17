'use client';

import { DatePickerField } from '@/components/calendar/DatePickerField';

export type FieldDef = {
  id: string;
  label: string;
  type:
    | 'TEXT'
    | 'TEXTAREA'
    | 'EMAIL'
    | 'PHONE'
    | 'NUMBER'
    | 'DATE'
    | 'TIME'
    | 'SELECT'
    | 'MULTISELECT'
    | 'BOOLEAN'
    | 'AMOUNT'
    | 'ADDRESS'
    | 'FILE';
  required: boolean;
  options: string[] | null;
  placeholder: string | null;
  showIfFieldId: string | null;
  showIfValue: string | null;
};

export function isFieldVisible(field: FieldDef, values: Record<string, unknown>): boolean {
  if (!field.showIfFieldId) return true;
  const dependentValue = values[field.showIfFieldId];
  if (Array.isArray(dependentValue)) return dependentValue.includes(field.showIfValue);
  return String(dependentValue ?? '') === String(field.showIfValue ?? '');
}

export function DynamicFormField({
  field,
  value,
  onChange,
  disabledDates,
}: {
  field: FieldDef;
  value: unknown;
  onChange: (value: unknown) => void;
  disabledDates?: Set<string>;
}) {
  const commonProps = {
    id: field.id,
    required: field.required,
    placeholder: field.placeholder || undefined,
  };

  return (
    <div>
      <label htmlFor={field.id} className="label">
        {field.label}
        {field.required && <span className="text-red-500"> *</span>}
      </label>

      {field.type === 'TEXT' && (
        <input {...commonProps} className="input" value={(value as string) || ''} onChange={(e) => onChange(e.target.value)} />
      )}
      {field.type === 'TEXTAREA' && (
        <textarea
          {...commonProps}
          className="input"
          rows={4}
          value={(value as string) || ''}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
      {field.type === 'EMAIL' && (
        <input
          {...commonProps}
          type="email"
          className="input"
          value={(value as string) || ''}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
      {field.type === 'PHONE' && (
        <input
          {...commonProps}
          type="tel"
          className="input"
          value={(value as string) || ''}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
      {field.type === 'NUMBER' && (
        <input
          {...commonProps}
          type="number"
          className="input"
          value={(value as string) ?? ''}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
      {field.type === 'AMOUNT' && (
        <div className="relative">
          <input
            {...commonProps}
            type="number"
            className="input pr-8"
            value={(value as string) ?? ''}
            onChange={(e) => onChange(e.target.value)}
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">€</span>
        </div>
      )}
      {field.type === 'DATE' && (
        <DatePickerField
          id={field.id}
          value={(value as string) || null}
          onChange={onChange}
          disabledDates={disabledDates || new Set()}
        />
      )}
      {field.type === 'TIME' && (
        <input
          {...commonProps}
          type="time"
          className="input"
          value={(value as string) || ''}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
      {field.type === 'ADDRESS' && (
        <input {...commonProps} className="input" value={(value as string) || ''} onChange={(e) => onChange(e.target.value)} />
      )}
      {field.type === 'SELECT' && (
        <select className="input" required={field.required} value={(value as string) || ''} onChange={(e) => onChange(e.target.value)}>
          <option value="">Sélectionner...</option>
          {(field.options || []).map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      )}
      {field.type === 'MULTISELECT' && (
        <div className="flex flex-wrap gap-2">
          {(field.options || []).map((opt) => {
            const selected = Array.isArray(value) && value.includes(opt);
            return (
              <button
                type="button"
                key={opt}
                onClick={() => {
                  const arr = Array.isArray(value) ? [...(value as string[])] : [];
                  onChange(selected ? arr.filter((v) => v !== opt) : [...arr, opt]);
                }}
                className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
                  selected ? 'border-brand-600 bg-brand-50 text-brand-700' : 'border-gray-200 text-gray-600'
                }`}
              >
                {opt}
              </button>
            );
          })}
        </div>
      )}
      {field.type === 'BOOLEAN' && (
        <div className="flex gap-3">
          {['Oui', 'Non'].map((opt) => (
            <button
              type="button"
              key={opt}
              onClick={() => onChange(opt)}
              className={`rounded-xl border px-4 py-2 text-sm transition-colors ${
                value === opt ? 'border-brand-600 bg-brand-50 text-brand-700' : 'border-gray-200 text-gray-600'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
      {field.type === 'FILE' && (
        <input
          type="file"
          required={field.required}
          accept="image/*,application/pdf"
          className="block w-full text-sm text-gray-500 file:mr-3 file:rounded-lg file:border-0 file:bg-brand-50 file:px-3 file:py-2 file:text-sm file:font-medium file:text-brand-700"
          onChange={(e) => onChange(e.target.files?.[0] || null)}
        />
      )}
    </div>
  );
}
