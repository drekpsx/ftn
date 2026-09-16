export type QuoteItemInput = { quantity: number; unitPrice: number };

export function computeQuoteTotals(items: QuoteItemInput[], discount: number, taxRate: number) {
  const subtotal = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  const afterDiscount = Math.max(0, subtotal - discount);
  const taxAmount = afterDiscount * (taxRate / 100);
  const total = afterDiscount + taxAmount;
  return {
    subtotal: round(subtotal),
    taxAmount: round(taxAmount),
    total: round(total),
  };
}

export function computeDepositAmount(
  total: number,
  depositType: string,
  depositFixedAmount?: number | null
): number | null {
  switch (depositType) {
    case 'PERCENT_10':
      return round(total * 0.1);
    case 'PERCENT_20':
      return round(total * 0.2);
    case 'PERCENT_30':
      return round(total * 0.3);
    case 'PERCENT_50':
      return round(total * 0.5);
    case 'FIXED':
      return depositFixedAmount ?? null;
    default:
      return null;
  }
}

function round(n: number) {
  return Math.round(n * 100) / 100;
}
