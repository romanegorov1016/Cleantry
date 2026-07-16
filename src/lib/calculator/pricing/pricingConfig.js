/**
 * Central pricing configuration for the cleaning calculator.
 *
 * Domain rule (area vs zones):
 * `area` is always the full property area. Zone selection does NOT reduce
 * the area component — it only adds discrete zone line items that describe
 * which parts of the property are cleaned. `areaPriceFactor` is always 1.
 * This is intentional for the current product version, not a bug.
 */

import {
  CLEANING_FORMAT_IDS,
  EXTRA_OPTION_IDS,
  PROPERTY_TYPE_IDS,
} from "@/catalog/ids";

/** @typedef {'whole' | 'zones'} CleaningScope */

export const PRICING_CURRENCY = "BYN";

export const HOUSE_MULTIPLIER = 1.15;

/**
 * Optional minimum order for the discounted cleaning core (before extras).
 * Keep at 0 until business confirms a real threshold — results stay unchanged.
 *
 * @type {number}
 */
export const DEFAULT_MINIMUM_ORDER_PRICE = 0;

/** Apartment base tariffs (house derives via HOUSE_MULTIPLIER). */
export const apartmentTariffs = Object.freeze({
  [CLEANING_FORMAT_IDS.MAINTENANCE]: Object.freeze({
    basePrice: 70,
    areaRate: 1.2,
  }),
  [CLEANING_FORMAT_IDS.DEEP]: Object.freeze({
    basePrice: 120,
    areaRate: 1.8,
  }),
  [CLEANING_FORMAT_IDS.POST_RENOVATION]: Object.freeze({
    basePrice: 160,
    areaRate: 2.3,
  }),
});

/** Office base tariffs (absolute, not derived from apartment). */
export const officeTariffs = Object.freeze({
  [CLEANING_FORMAT_IDS.MAINTENANCE]: Object.freeze({
    basePrice: 100,
    areaRate: 1.4,
  }),
  [CLEANING_FORMAT_IDS.DEEP]: Object.freeze({
    basePrice: 140,
    areaRate: 1.7,
  }),
  [CLEANING_FORMAT_IDS.POST_RENOVATION]: Object.freeze({
    basePrice: 180,
    areaRate: 2.2,
  }),
});

export const residentialZones = Object.freeze({
  kitchen: Object.freeze({ id: "kitchen", title: "Кухня", price: 25 }),
  bathroom: Object.freeze({ id: "bathroom", title: "Санузел", price: 25 }),
  livingRoom: Object.freeze({
    id: "livingRoom",
    title: "Гостиная",
    price: 15,
  }),
  bedroom: Object.freeze({ id: "bedroom", title: "Спальня", price: 15 }),
  hallway: Object.freeze({ id: "hallway", title: "Коридор", price: 10 }),
  balcony: Object.freeze({ id: "balcony", title: "Балкон", price: 20 }),
});

export const officeZones = Object.freeze({
  workspace: Object.freeze({
    id: "workspace",
    title: "Рабочие места",
    basePrice: 20,
  }),
  meetingRoom: Object.freeze({
    id: "meetingRoom",
    title: "Переговорные",
    basePrice: 15,
  }),
  kitchen: Object.freeze({ id: "kitchen", title: "Кухня", price: 25 }),
  bathroom: Object.freeze({ id: "bathroom", title: "Санузлы", price: 25 }),
  commonArea: Object.freeze({
    id: "commonArea",
    title: "Общие пространства",
    price: 15,
  }),
});

/** Multipliers for countable office zones. Keys are numeric counts. */
export const officeWorkspaceMultipliers = Object.freeze({
  0: 0,
  1: 1,
  2: 1.25,
  3: 1.5,
  4: 1.75,
  5: 2,
});

export const officeMeetingRoomMultipliers = Object.freeze({
  0: 0,
  1: 1,
  2: 1.5,
  3: 2,
});

/**
 * Bathroom quantity surcharge (zone base price is separate).
 * Equivalent to: min(max(count - 1, 0), 3) * 20
 */
export const bathroomExtraPerAdditional = 20;
export const bathroomExtraMaxSteps = 3;

export const discountRates = Object.freeze({
  once: 0,
  weekly: 0.15,
  biweekly: 0.1,
  monthly: 0.05,
});

export const extrasCatalog = Object.freeze({
  [EXTRA_OPTION_IDS.ECO_PRODUCTS]: Object.freeze({
    id: EXTRA_OPTION_IDS.ECO_PRODUCTS,
    title: "Эко-средства",
    price: 15,
  }),
  [EXTRA_OPTION_IDS.WINDOW_CLEANING]: Object.freeze({
    id: EXTRA_OPTION_IDS.WINDOW_CLEANING,
    title: "Мытьё окон",
    price: 25,
  }),
  [EXTRA_OPTION_IDS.FRIDGE_INSIDE]: Object.freeze({
    id: EXTRA_OPTION_IDS.FRIDGE_INSIDE,
    title: "Холодильник внутри",
    price: 20,
  }),
  [EXTRA_OPTION_IDS.OVEN_INSIDE]: Object.freeze({
    id: EXTRA_OPTION_IDS.OVEN_INSIDE,
    title: "Духовка внутри",
    price: 20,
  }),
  [EXTRA_OPTION_IDS.CABINETS_INSIDE]: Object.freeze({
    id: EXTRA_OPTION_IDS.CABINETS_INSIDE,
    title: "Шкафы внутри",
    price: 25,
  }),
  [EXTRA_OPTION_IDS.MICROWAVE_INSIDE]: Object.freeze({
    id: EXTRA_OPTION_IDS.MICROWAVE_INSIDE,
    title: "Микроволновка внутри",
    price: 10,
  }),
  [EXTRA_OPTION_IDS.PET_HAIR]: Object.freeze({
    id: EXTRA_OPTION_IDS.PET_HAIR,
    title: "Шерсть животных",
    price: 25,
  }),
  [EXTRA_OPTION_IDS.HEAVY_DIRT]: Object.freeze({
    id: EXTRA_OPTION_IDS.HEAVY_DIRT,
    title: "Сильные загрязнения",
    price: 40,
  }),
  [EXTRA_OPTION_IDS.URGENT_CLEANING]: Object.freeze({
    id: EXTRA_OPTION_IDS.URGENT_CLEANING,
    title: "Срочная уборка",
    price: 45,
  }),
});

export const PROPERTY_TYPES = Object.freeze([
  PROPERTY_TYPE_IDS.APARTMENT,
  PROPERTY_TYPE_IDS.HOUSE,
  PROPERTY_TYPE_IDS.OFFICE,
]);

export const CLEANING_FORMATS = Object.freeze([
  CLEANING_FORMAT_IDS.MAINTENANCE,
  CLEANING_FORMAT_IDS.DEEP,
  CLEANING_FORMAT_IDS.POST_RENOVATION,
]);

export const FREQUENCY_IDS = Object.freeze([
  "once",
  "weekly",
  "biweekly",
  "monthly",
]);

export const CLEANING_SCOPE = Object.freeze({
  WHOLE: "whole",
  ZONES: "zones",
});

/**
 * @type {import('./types.js').PricingConfig}
 */
export const pricingConfig = Object.freeze({
  currency: PRICING_CURRENCY,
  houseMultiplier: HOUSE_MULTIPLIER,
  minimumOrderPrice: DEFAULT_MINIMUM_ORDER_PRICE,
  apartmentTariffs,
  officeTariffs,
  residentialZones,
  officeZones,
  officeWorkspaceMultipliers,
  officeMeetingRoomMultipliers,
  bathroomExtraPerAdditional,
  bathroomExtraMaxSteps,
  discountRates,
  extrasCatalog,
  propertyTypes: PROPERTY_TYPES,
  cleaningFormats: CLEANING_FORMATS,
  frequencies: FREQUENCY_IDS,
  scopes: CLEANING_SCOPE,
});

export default pricingConfig;
