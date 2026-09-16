import { describe, it, expect } from 'vitest';
import { computeEstimate, type PricedService } from '@/lib/pricing';

const baseService: PricedService = {
  priceType: 'FIXED',
  price: 150,
  priceMin: null,
  priceMax: null,
  options: [
    { id: 'opt1', name: 'Retouche premium', priceDelta: 50 },
    { id: 'opt2', name: 'Personne supplémentaire', priceDelta: 30 },
  ],
};

describe('computeEstimate', () => {
  it('returns null display for no service', () => {
    expect(computeEstimate(null, [])).toEqual({ display: null, value: null });
  });

  it('hides price for ON_QUOTE services', () => {
    const result = computeEstimate({ ...baseService, priceType: 'ON_QUOTE' }, []);
    expect(result.display).toBe('Sur devis');
    expect(result.value).toBeNull();
  });

  it('computes fixed price with no options', () => {
    const result = computeEstimate(baseService, []);
    expect(result.value).toBe(150);
  });

  it('adds selected option deltas to fixed price', () => {
    const result = computeEstimate(baseService, ['opt1', 'opt2']);
    expect(result.value).toBe(230);
    expect(result.display).toBe('230 €');
  });

  it('shows "à partir de" for STARTING_AT with no options selected', () => {
    const result = computeEstimate({ ...baseService, priceType: 'STARTING_AT' }, []);
    expect(result.display).toBe('À partir de 150 €');
  });

  it('shows an estimate for STARTING_AT once options are added', () => {
    const result = computeEstimate({ ...baseService, priceType: 'STARTING_AT' }, ['opt1']);
    expect(result.display).toBe('Estimation : 200 €');
  });

  it('computes a range for RANGE price type', () => {
    const result = computeEstimate(
      { ...baseService, priceType: 'RANGE', priceMin: 100, priceMax: 200, price: null },
      ['opt2']
    );
    expect(result.display).toBe('130 € - 230 €');
  });
});
