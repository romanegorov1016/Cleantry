import { pricingConfig } from "@/lib/calculator/pricing/pricingConfig";

/**
 * @param {import('./types.js').NormalizedCalculatorInput} input
 * @param {import('./types.js').PricingConfig} [config]
 * @returns {{ total: number, items: import('./types.js').PriceLineItem[] }}
 */
export function calculateExtrasPrice(input, config = pricingConfig) {
  /** @type {import('./types.js').PriceLineItem[]} */
  const items = [];

  for (const extraId of input.selectedExtras) {
    const extra = config.extrasCatalog[extraId];
    if (!extra) {
      continue;
    }

    items.push({
      id: extra.id,
      title: extra.title,
      price: extra.price,
    });
  }

  const total = items.reduce((sum, item) => sum + item.price, 0);

  return { total, items };
}
