import { calculateAreaPrice } from "@/lib/calculator/pricing/calculateAreaPrice";
import { calculateBasePrice } from "@/lib/calculator/pricing/calculateBasePrice";
import { calculateBathroomExtra } from "@/lib/calculator/pricing/calculateBathroomExtra";
import { calculateDiscount } from "@/lib/calculator/pricing/calculateDiscount";
import { calculateExtrasPrice } from "@/lib/calculator/pricing/calculateExtrasPrice";
import { calculateZonesPrice } from "@/lib/calculator/pricing/calculateZonesPrice";
import { pricingConfig } from "@/lib/calculator/pricing/pricingConfig";
import { validateAndNormalizeInput } from "@/lib/calculator/pricing/validateCalculatorInput";

/**
 * Pure cleaning price calculator.
 * Does not mutate `rawInput`. Result depends only on input values, not UI order.
 *
 * @param {Partial<import('./types.js').CalculatorPricingInput> | null | undefined} rawInput
 * @param {import('./types.js').PricingConfig} [config]
 * @returns {import('./types.js').CalculateCleaningPriceOutcome}
 */
export function calculateCleaningPrice(rawInput, config = pricingConfig) {
  const validationResult = validateAndNormalizeInput(rawInput, config);

  if (!validationResult.valid) {
    return {
      success: false,
      errors: validationResult.errors,
    };
  }

  const input = validationResult.value;

  const basePrice = calculateBasePrice(input, config);
  const areaPrice = calculateAreaPrice(input, config);
  const zonesResult = calculateZonesPrice(input, config);
  const bathroomExtra = calculateBathroomExtra(input, config);

  const corePrice =
    basePrice + areaPrice + zonesResult.total + bathroomExtra;

  const { discountRate, discountAmount } = calculateDiscount(
    corePrice,
    input.frequency,
    config
  );

  const extrasResult = calculateExtrasPrice(input, config);

  const minimumOrderPrice = config.minimumOrderPrice ?? 0;
  const discountedCore = corePrice - discountAmount;
  const servicePrice = Math.max(discountedCore, minimumOrderPrice);
  const minimumOrderAdjustment = servicePrice - discountedCore;
  const totalPrice = Math.max(0, servicePrice + extrasResult.total);

  return {
    success: true,
    result: {
      currency: "BYN",
      basePrice,
      areaPrice,
      zonesPrice: zonesResult.total,
      zoneBreakdown: zonesResult.items,
      bathroomExtra,
      corePrice,
      discountRate,
      discountAmount,
      minimumOrderPrice,
      minimumOrderAdjustment,
      extrasPrice: extrasResult.total,
      extrasBreakdown: extrasResult.items,
      totalPrice,
    },
  };
}
