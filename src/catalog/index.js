export {
  PROPERTY_TYPE_IDS,
  CLEANING_FORMAT_IDS,
  EXTRA_OPTION_IDS,
  PROPERTY_TYPE_ID_LIST,
  CLEANING_FORMAT_ID_LIST,
  EXTRA_OPTION_ID_LIST,
  LEGACY_SERVICE_TYPE_ALIASES,
} from "@/catalog/ids";

export { DEFAULT_LOCALE, SUPPORTED_LOCALES, t } from "@/catalog/i18n";

export {
  propertyTypes,
  getPropertyTypeList,
} from "@/catalog/propertyTypes";

export {
  cleaningFormats,
  getCleaningFormatList,
} from "@/catalog/cleaningFormats";

export {
  extraOptions,
  getExtraOptionList,
} from "@/catalog/extras";

export {
  officeSettings,
  incompatibilityRules,
} from "@/catalog/officeSettings";

export {
  resolveLegacyId,
  getPropertyType,
  getCleaningFormat,
  getExtraOption,
  isOfficeProperty,
  isPropertyFormatCompatible,
  isExtraCompatible,
  getAvailableCleaningFormats,
  getAvailableExtras,
  validateSelection,
  getEffectivePricing,
} from "@/catalog/selectors";

export {
  propertyTypeShowcaseItems,
  cleaningFormatShowcaseItems,
  serviceShowcaseItems,
  mapPropertyTypeServiceCards,
  mapCleaningFormatServiceCards,
  mapServiceCards,
  mapServicesExtrasNote,
  mapPricingPlans,
  mapCalculatorServiceTypes,
  mapCalculatorExtras,
  mapAllCalculatorExtras,
  mapPropertyTypeOptions,
} from "@/catalog/mappers";

export {
  findDuplicateIds,
  inspectCatalogIds,
  assertCatalogIdentityIntegrity,
  EXPECTED_PROPERTY_TYPE_IDS,
  EXPECTED_CLEANING_FORMAT_IDS,
  EXPECTED_EXTRA_OPTION_IDS,
} from "@/catalog/validate";
