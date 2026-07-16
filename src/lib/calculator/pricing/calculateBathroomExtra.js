import { pricingConfig } from "@/lib/calculator/pricing/pricingConfig";

/**
 * Bathroom zone base price is part of zonesPrice.
 * This returns only the quantity surcharge.
 *
 * @param {import('./types.js').NormalizedCalculatorInput} input
 * @param {import('./types.js').PricingConfig} [config]
 * @returns {number}
 */
export function calculateBathroomExtra(input, config = pricingConfig) {
  if (!input.bathroomIncluded) {
    return 0;
  }

  const steps = Math.min(
    Math.max(input.bathroomCount - 1, 0),
    config.bathroomExtraMaxSteps
  );

  return steps * config.bathroomExtraPerAdditional;
}
