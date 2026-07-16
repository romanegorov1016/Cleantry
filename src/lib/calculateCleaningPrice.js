import { calculateCleaningPrice as calculateCleaningPriceCore } from "@/lib/calculator/pricing/calculateCleaningPrice";
import { mapUiStateToPricingInput } from "@/lib/calculator/pricing/mapUiStateToPricingInput";
import { pricingConfig } from "@/lib/calculator/pricing/pricingConfig";
import { validateAndNormalizeInput } from "@/lib/calculator/pricing/validateCalculatorInput";

/**
 * UI-facing calculator entry point.
 * Always recomputes from the full state (never incremental deltas).
 * Returns a legacy-compatible shape plus the structured `outcome`.
 *
 * @param {object} calculatorState
 * @param {import('./calculator/pricing/types.js').PricingConfig} [config]
 */
export function calculateCleaningPrice(
  calculatorState = {},
  config = pricingConfig
) {
  const pricingInput = mapUiStateToPricingInput(calculatorState);
  const validation = validateAndNormalizeInput(pricingInput, config);
  const outcome = calculateCleaningPriceCore(pricingInput, config);

  if (!outcome.success || !validation.valid) {
    return {
      success: false,
      errors: outcome.success ? validation.errors : outcome.errors,
      outcome,
      subtotal: 0,
      discount: 0,
      total: 0,
      currency: config.currency,
      breakdown: {
        basePrice: 0,
        areaPrice: 0,
        selectedAreasPrice: 0,
        extrasPrice: 0,
        bathroomAdjustment: 0,
        officeComposition: 0,
        frequencyDiscount: 0,
      },
      pricingInput: null,
      result: null,
    };
  }

  const { result } = outcome;

  return {
    success: true,
    errors: [],
    outcome,
    result,
    subtotal: result.corePrice + result.extrasPrice,
    discount: result.discountAmount,
    total: result.totalPrice,
    currency: result.currency,
    breakdown: {
      basePrice: result.basePrice,
      areaPrice: result.areaPrice,
      selectedAreasPrice: result.zonesPrice,
      extrasPrice: result.extrasPrice,
      bathroomAdjustment: result.bathroomExtra,
      officeComposition: 0,
      frequencyDiscount: result.discountAmount,
    },
    pricingInput: validation.value,
  };
}

export { calculateCleaningPriceCore, mapUiStateToPricingInput, pricingConfig };
