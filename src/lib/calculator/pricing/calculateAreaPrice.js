import { PROPERTY_TYPE_IDS } from "@/catalog/ids";
import { pricingConfig } from "@/lib/calculator/pricing/pricingConfig";
import { roundCurrencyProduct } from "@/lib/calculator/pricing/roundCurrency";

/**
 * Area is always the full property area. Zone selection does not scale this
 * component — see pricingConfig domain comment.
 *
 * House: round(area × apartmentAreaRate × houseMultiplier) — do NOT pre-round
 * the per-m² rate (but stabilize IEEE754 before Math.round).
 *
 * @param {import('./types.js').NormalizedCalculatorInput} input
 * @param {import('./types.js').PricingConfig} [config]
 * @returns {number}
 */
export function calculateAreaPrice(input, config = pricingConfig) {
  if (input.propertyType === PROPERTY_TYPE_IDS.OFFICE) {
    const areaRate = config.officeTariffs[input.cleaningFormat]?.areaRate ?? 0;
    return roundCurrencyProduct(input.area, areaRate);
  }

  const apartmentRate =
    config.apartmentTariffs[input.cleaningFormat]?.areaRate ?? 0;

  if (input.propertyType === PROPERTY_TYPE_IDS.HOUSE) {
    return roundCurrencyProduct(
      input.area,
      apartmentRate,
      config.houseMultiplier
    );
  }

  return roundCurrencyProduct(input.area, apartmentRate);
}
