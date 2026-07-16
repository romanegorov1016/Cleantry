/**
 * @typedef {'apartment' | 'house' | 'office'} PropertyType
 * @typedef {'maintenance' | 'deep' | 'postRenovation'} CleaningFormat
 * @typedef {'whole' | 'zones'} CleaningScope
 * @typedef {'once' | 'weekly' | 'biweekly' | 'monthly'} FrequencyId
 *
 * @typedef {{
 *   id: string,
 *   title: string,
 *   price: number,
 * }} PriceLineItem
 *
 * @typedef {{
 *   propertyType: PropertyType,
 *   cleaningFormat: CleaningFormat,
 *   cleaningScope: CleaningScope,
 *   area: number,
 *   bathroomCount: number,
 *   workplaceCount: number,
 *   meetingRoomCount: number,
 *   hasKitchen: boolean,
 *   selectedZones: string[],
 *   frequency: FrequencyId,
 *   selectedExtras: string[],
 * }} CalculatorPricingInput
 *
 * @typedef {{
 *   propertyType: PropertyType,
 *   cleaningFormat: CleaningFormat,
 *   cleaningScope: CleaningScope,
 *   area: number,
 *   bathroomCount: number,
 *   workplaceCount: number,
 *   meetingRoomCount: number,
 *   hasKitchen: boolean,
 *   selectedZones: string[],
 *   effectiveZones: string[],
 *   frequency: FrequencyId,
 *   selectedExtras: string[],
 *   bathroomIncluded: boolean,
 * }} NormalizedCalculatorInput
 *
 * @typedef {{
 *   code: string,
 *   message: string,
 *   field?: string,
 * }} CalculatorValidationError
 *
 * @typedef {{
 *   valid: true,
 *   value: NormalizedCalculatorInput,
 * } | {
 *   valid: false,
 *   errors: CalculatorValidationError[],
 * }} CalculatorValidationResult
 *
 * @typedef {{
 *   currency: 'BYN',
 *   basePrice: number,
 *   areaPrice: number,
 *   zonesPrice: number,
 *   zoneBreakdown: PriceLineItem[],
 *   bathroomExtra: number,
 *   corePrice: number,
 *   discountRate: number,
 *   discountAmount: number,
 *   minimumOrderPrice: number,
 *   minimumOrderAdjustment: number,
 *   extrasPrice: number,
 *   extrasBreakdown: PriceLineItem[],
 *   totalPrice: number,
 * }} CleaningPriceResult
 *
 * @typedef {{
 *   success: true,
 *   result: CleaningPriceResult,
 * } | {
 *   success: false,
 *   errors: CalculatorValidationError[],
 * }} CalculateCleaningPriceOutcome
 *
 * @typedef {typeof import('./pricingConfig.js').pricingConfig} PricingConfig
 */

export {};
