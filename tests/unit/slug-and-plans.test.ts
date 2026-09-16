import { describe, it, expect } from 'vitest';
import { slugify } from '@/lib/slug';
import { planAllowsMoreRequests, planAllowsMoreServices } from '@/lib/plans';

describe('slugify', () => {
  it('lowercases and strips accents', () => {
    expect(slugify('Studio Nova Été')).toBe('studio-nova-ete');
  });

  it('replaces special characters with dashes', () => {
    expect(slugify("L'Atelier de Marie !")).toBe('latelier-de-marie');
  });

  it('collapses repeated dashes and trims edges', () => {
    expect(slugify('  --Mon   Entreprise--  ')).toBe('mon-entreprise');
  });
});

describe('plan limits', () => {
  it('blocks more requests on FREE plan once the monthly cap is hit', () => {
    expect(planAllowsMoreRequests('FREE', 4)).toBe(true);
    expect(planAllowsMoreRequests('FREE', 5)).toBe(false);
  });

  it('never blocks STARTER or PRO plans', () => {
    expect(planAllowsMoreRequests('STARTER', 10000)).toBe(true);
    expect(planAllowsMoreRequests('PRO', 10000)).toBe(true);
  });

  it('blocks more services on FREE plan past the cap', () => {
    expect(planAllowsMoreServices('FREE', 2)).toBe(true);
    expect(planAllowsMoreServices('FREE', 3)).toBe(false);
  });
});
