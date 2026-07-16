import { pricingConfig } from "@/lib/calculator/pricing/pricingConfig";
import { roundCurrency } from "@/lib/calculator/pricing/roundCurrency";

/**
 * @param {number} corePrice
 * @param {import('./types.js').FrequencyId} frequency
 * @param {import('./types.js').PricingConfig} [config]
 * @returns {{ discountRate: number, discountAmount: number }}
 */
export function calculateDiscount(corePrice, frequency, config = pricingConfig) {
  const discountRate = config.discountRates[frequency] ?? 0;
  const discountAmount = roundCurrency(corePrice * discountRate);

  return { discountRate, discountAmount };
}
