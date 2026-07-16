/** @typedef {typeof PROPERTY_TYPE_IDS[keyof typeof PROPERTY_TYPE_IDS]} PropertyTypeId */
/** @typedef {typeof CLEANING_FORMAT_IDS[keyof typeof CLEANING_FORMAT_IDS]} CleaningFormatId */
/** @typedef {typeof EXTRA_OPTION_IDS[keyof typeof EXTRA_OPTION_IDS]} ExtraOptionId */

export const PROPERTY_TYPE_IDS = Object.freeze({
  APARTMENT: "apartment",
  HOUSE: "house",
  OFFICE: "office",
});

export const CLEANING_FORMAT_IDS = Object.freeze({
  MAINTENANCE: "maintenance",
  DEEP: "deep",
  POST_RENOVATION: "postRenovation",
});

export const EXTRA_OPTION_IDS = Object.freeze({
  ECO_PRODUCTS: "ecoProducts",
  WINDOW_CLEANING: "windowCleaning",
  FRIDGE_INSIDE: "fridgeInside",
  OVEN_INSIDE: "ovenInside",
  CABINETS_INSIDE: "cabinetsInside",
  MICROWAVE_INSIDE: "microwaveInside",
  PET_HAIR: "petHair",
  HEAVY_DIRT: "heavyDirt",
  URGENT_CLEANING: "urgentCleaning",
});

export const PROPERTY_TYPE_ID_LIST = Object.freeze(
  Object.values(PROPERTY_TYPE_IDS)
);

export const CLEANING_FORMAT_ID_LIST = Object.freeze(
  Object.values(CLEANING_FORMAT_IDS)
);

export const EXTRA_OPTION_ID_LIST = Object.freeze(
  Object.values(EXTRA_OPTION_IDS)
);

/**
 * Aliases from the previous flat service-type model.
 * Used by calculator adapters until the UI is fully migrated.
 */
export const LEGACY_SERVICE_TYPE_ALIASES = Object.freeze({
  regular: CLEANING_FORMAT_IDS.MAINTENANCE,
  renovation: CLEANING_FORMAT_IDS.POST_RENOVATION,
  insideFridge: EXTRA_OPTION_IDS.FRIDGE_INSIDE,
  insideOven: EXTRA_OPTION_IDS.OVEN_INSIDE,
  insideCabinets: EXTRA_OPTION_IDS.CABINETS_INSIDE,
  microwave: EXTRA_OPTION_IDS.MICROWAVE_INSIDE,
  strongDirt: EXTRA_OPTION_IDS.HEAVY_DIRT,
});
