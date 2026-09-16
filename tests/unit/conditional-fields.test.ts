import { describe, it, expect } from 'vitest';
import { isFieldVisible, type FieldDef } from '@/components/public/DynamicFormField';

const baseField: FieldDef = {
  id: 'f2',
  label: 'Nombre d\'invités',
  type: 'NUMBER',
  required: false,
  options: null,
  placeholder: null,
  showIfFieldId: 'f1',
  showIfValue: 'Mariage',
};

describe('isFieldVisible', () => {
  it('is always visible when no condition is set', () => {
    expect(isFieldVisible({ ...baseField, showIfFieldId: null }, {})).toBe(true);
  });

  it('is hidden when the dependent field does not match', () => {
    expect(isFieldVisible(baseField, { f1: 'Portrait' })).toBe(false);
  });

  it('is visible when the dependent field matches', () => {
    expect(isFieldVisible(baseField, { f1: 'Mariage' })).toBe(true);
  });

  it('supports multiselect dependent values', () => {
    expect(isFieldVisible(baseField, { f1: ['Portrait', 'Mariage'] })).toBe(true);
    expect(isFieldVisible(baseField, { f1: ['Portrait'] })).toBe(false);
  });
});
