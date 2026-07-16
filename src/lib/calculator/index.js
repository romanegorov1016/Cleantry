export {
  CLEANING_SCOPE,
  COMMENT_MAX_LENGTH,
  createInitialCalculatorState,
  residentialZoneCatalog,
  officeZoneCatalog,
  residentialRoomOptions,
  bathroomOptions,
  officeWorkspaceOptions,
  officeMeetingRoomOptions,
  bathroomAdjustments,
  ZONES_AREA_PRICE_FACTOR,
} from "@/lib/calculator/constants";

export {
  getZoneCatalogForProperty,
  getAreaDefaultsForProperty,
  getDefaultZonesForProperty,
  normalizeCalculatorState,
  clampArea,
  getAreaValidationError,
  syncKitchenZoneWithOfficeDetails,
} from "@/lib/calculator/normalize";

export {
  applyCalculatorPatch,
  setPropertyType,
  setCleaningFormat,
  setCleaningScope,
  toggleZone,
  toggleExtra,
  applyCalculatorPrefill,
} from "@/lib/calculator/transitions";

export { validateCalculatorState } from "@/lib/calculator/validation";

export {
  getCalculatorCompletion,
  getMobileSummaryModel,
} from "@/lib/calculator/completion";

export {
  toPricingInput,
  toLegacyPriceState,
  getBathroomAdjustmentAmount,
  getOfficeCompositionSurcharge,
  getScaledZonePrice,
  areAllAvailableZonesSelected,
  getAvailableZoneIdsForPricing,
} from "@/lib/calculator/pricingAdapter";

export {
  serializeCalculatorState,
  deserializeCalculatorState,
} from "@/lib/calculator/serialize";

export {
  pricingConfig,
  calculateCleaningPrice as calculateCleaningPriceCore,
  validateAndNormalizeInput,
  mapUiStateToPricingInput,
} from "@/lib/calculator/pricing";
