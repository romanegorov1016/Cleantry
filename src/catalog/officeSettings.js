import {
  CLEANING_FORMAT_IDS,
  EXTRA_OPTION_IDS,
  PROPERTY_TYPE_IDS,
} from "@/catalog/ids";

/** @typedef {import('@/catalog/types.js').OfficeCatalogSettings} OfficeCatalogSettings */
/** @typedef {import('@/catalog/types.js').IncompatibilityRule} IncompatibilityRule */

/**
 * Office-specific catalog settings.
 * These override generic residential defaults without branching in UI components.
 *
 * @type {OfficeCatalogSettings}
 */
export const officeSettings = {
  propertyTypeId: PROPERTY_TYPE_IDS.OFFICE,
  availableCleaningFormatIds: [
    CLEANING_FORMAT_IDS.MAINTENANCE,
    CLEANING_FORMAT_IDS.DEEP,
    CLEANING_FORMAT_IDS.POST_RENOVATION,
  ],
  availableExtraIds: [
    EXTRA_OPTION_IDS.ECO_PRODUCTS,
    EXTRA_OPTION_IDS.WINDOW_CLEANING,
    EXTRA_OPTION_IDS.HEAVY_DIRT,
    EXTRA_OPTION_IDS.URGENT_CLEANING,
  ],
  areaDefaults: {
    minArea: 30,
    maxArea: 5000,
    defaultArea: 100,
  },
  pricingOverrides: {
    [CLEANING_FORMAT_IDS.MAINTENANCE]: {
      basePrice: 100,
      pricePerSquareMeter: 1.4,
    },
    [CLEANING_FORMAT_IDS.DEEP]: {
      basePrice: 140,
      pricePerSquareMeter: 1.7,
    },
    [CLEANING_FORMAT_IDS.POST_RENOVATION]: {
      basePrice: 180,
      pricePerSquareMeter: 2.2,
    },
  },
};

/**
 * Explicit cross-entity incompatibility rules.
 * Used by selectors in addition to per-entity compatibility fields.
 *
 * @type {IncompatibilityRule[]}
 */
export const incompatibilityRules = [
  {
    id: "office-no-residential-appliances",
    reasonKey: "catalog.incompatibility.officeNoResidentialAppliances",
    propertyTypes: [PROPERTY_TYPE_IDS.OFFICE],
    extras: [
      EXTRA_OPTION_IDS.FRIDGE_INSIDE,
      EXTRA_OPTION_IDS.OVEN_INSIDE,
      EXTRA_OPTION_IDS.CABINETS_INSIDE,
      EXTRA_OPTION_IDS.MICROWAVE_INSIDE,
      EXTRA_OPTION_IDS.PET_HAIR,
    ],
  },
];
