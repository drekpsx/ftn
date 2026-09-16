export type PricedService = {
  priceType: 'FIXED' | 'STARTING_AT' | 'RANGE' | 'ON_QUOTE';
  price: number | null;
  priceMin: number | null;
  priceMax: number | null;
  options: { id: string; name: string; priceDelta: number }[];
};

export function computeEstimate(service: PricedService | null, selectedOptionIds: string[]) {
  if (!service) return { display: null, value: null };
  if (service.priceType === 'ON_QUOTE') return { display: 'Sur devis', value: null };

  const optionsTotal = service.options
    .filter((o) => selectedOptionIds.includes(o.id))
    .reduce((sum, o) => sum + o.priceDelta, 0);

  if (service.priceType === 'FIXED') {
    const value = (service.price ?? 0) + optionsTotal;
    return { display: `${value} €`, value };
  }

  if (service.priceType === 'STARTING_AT') {
    const value = (service.price ?? 0) + optionsTotal;
    return { display: optionsTotal ? `Estimation : ${value} €` : `À partir de ${value} €`, value };
  }

  // RANGE
  const min = (service.priceMin ?? 0) + optionsTotal;
  const max = (service.priceMax ?? 0) + optionsTotal;
  return { display: `${min} € - ${max} €`, value: max };
}
