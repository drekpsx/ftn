import { describe, it, expect } from 'vitest';
import { computeQuoteTotals, computeDepositAmount } from '@/lib/quote-calc';

describe('computeQuoteTotals', () => {
  it('computes subtotal, tax and total with no discount', () => {
    const result = computeQuoteTotals([{ quantity: 2, unitPrice: 100 }], 0, 20);
    expect(result.subtotal).toBe(200);
    expect(result.taxAmount).toBe(40);
    expect(result.total).toBe(240);
  });

  it('applies discount before tax', () => {
    const result = computeQuoteTotals([{ quantity: 1, unitPrice: 100 }], 20, 10);
    expect(result.subtotal).toBe(100);
    expect(result.taxAmount).toBe(8); // (100-20)*0.10
    expect(result.total).toBe(88);
  });

  it('never goes below zero when discount exceeds subtotal', () => {
    const result = computeQuoteTotals([{ quantity: 1, unitPrice: 50 }], 100, 0);
    expect(result.total).toBe(0);
  });

  it('handles multiple items', () => {
    const result = computeQuoteTotals(
      [
        { quantity: 1, unitPrice: 150 },
        { quantity: 2, unitPrice: 30 },
      ],
      0,
      0
    );
    expect(result.subtotal).toBe(210);
    expect(result.total).toBe(210);
  });
});

describe('computeDepositAmount', () => {
  it('returns null when no deposit configured', () => {
    expect(computeDepositAmount(200, 'NONE')).toBeNull();
  });

  it('computes percentage deposits', () => {
    expect(computeDepositAmount(200, 'PERCENT_10')).toBe(20);
    expect(computeDepositAmount(200, 'PERCENT_50')).toBe(100);
  });

  it('returns the fixed amount when configured', () => {
    expect(computeDepositAmount(200, 'FIXED', 75)).toBe(75);
  });

  it('returns null for a fixed deposit with no amount set', () => {
    expect(computeDepositAmount(200, 'FIXED', null)).toBeNull();
  });
});
