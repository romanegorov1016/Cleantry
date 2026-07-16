import { PROPERTY_TYPE_IDS } from "@/catalog/ids";
import { pricingConfig } from "@/lib/calculator/pricing/pricingConfig";
import { roundCurrencyProduct } from "@/lib/calculator/pricing/roundCurrency";

/**
 * @param {import('./types.js').NormalizedCalculatorInput} input
 * @param {import('./types.js').PricingConfig} [config]
 * @returns {number}
 */
export function calculateBasePrice(input, config = pricingConfig) {
  if (input.propertyType === PROPERTY_TYPE_IDS.OFFICE) {
    return config.officeTariffs[input.cleaningFormat]?.basePrice ?? 0;
  }

  const apartmentBase =
    config.apartmentTariffs[input.cleaningFormat]?.basePrice ?? 0;

  if (input.propertyType === PROPERTY_TYPE_IDS.HOUSE) {
    return roundCurrencyProduct(apartmentBase, config.houseMultiplier);
  }

  return apartmentBase;
}
