import {
  CLEANING_FORMAT_IDS,
  PROPERTY_TYPE_IDS,
} from "@/catalog/ids";
import {
  CLEANING_SCOPE as PRICING_SCOPE,
  officeZones,
  residentialZones,
  bathroomExtraPerAdditional,
  bathroomExtraMaxSteps,
  officeMeetingRoomMultipliers,
  officeWorkspaceMultipliers,
} from "@/lib/calculator/pricing/pricingConfig";

/** @typedef {'whole' | 'zones'} CleaningScope */

export const CLEANING_SCOPE = Object.freeze({
  WHOLE: PRICING_SCOPE.WHOLE,
  ZONES: PRICING_SCOPE.ZONES,
});

export const COMMENT_MAX_LENGTH = 300;

export const FREQUENCY_IDS = Object.freeze({
  ONCE: "once",
  WEEKLY: "weekly",
  BIWEEKLY: "biweekly",
  MONTHLY: "monthly",
});

const residentialZoneDescriptions = Object.freeze({
  kitchen: "Поверхности, пол, фасады снаружи, раковина",
  bathroom: "Сантехника, зеркала, поверхности, пол",
  livingRoom: "Пыль, поверхности, пол, порядок в зоне отдыха",
  bedroom: "Пыль, поверхности, пол, аккуратный порядок",
  hallway: "Пол, пыль, входная зона",
  balcony: "Пол, поверхности, базовая уборка зоны",
});

const officeZoneDescriptions = Object.freeze({
  workspace: "Столы, техника снаружи, пол в рабочей зоне",
  meetingRoom: "Стол, поверхности, пол",
  kitchen: "Поверхности, пол, раковина",
  bathroom: "Сантехника, зеркала, поверхности, пол",
  commonArea: "Коридоры, входная зона, места общего пользования",
});

/** Zone card catalog — prices sourced from pricingConfig (single source of truth). */
export const residentialZoneCatalog = Object.freeze(
  Object.values(residentialZones).map((zone) =>
    Object.freeze({
      id: zone.id,
      label: zone.title,
      description: residentialZoneDescriptions[zone.id] ?? "",
      price: zone.price,
    })
  )
);

export const officeZoneCatalog = Object.freeze(
  Object.values(officeZones).map((zone) =>
    Object.freeze({
      id: zone.id,
      label: zone.title,
      description: officeZoneDescriptions[zone.id] ?? "",
      price: zone.basePrice ?? zone.price,
    })
  )
);

export const residentialRoomOptions = Object.freeze(["1", "2", "3", "4", "5+"]);
export const bathroomOptions = Object.freeze(["1", "2", "3", "4+"]);
export const officeWorkspaceOptions = Object.freeze(["1", "2", "3", "4", "5+"]);
export const officeMeetingRoomOptions = Object.freeze(["0", "1", "2", "3+"]);

export const residentialAreaDefaults = Object.freeze({
  minArea: 20,
  maxArea: 300,
  defaultArea: 65,
});

/** House area limits — larger than apartment. */
export const houseAreaDefaults = Object.freeze({
  minArea: 20,
  maxArea: 700,
  defaultArea: 65,
});

export const defaultOfficeDetails = Object.freeze({
  workspaces: "4",
  meetingRooms: "1",
  hasKitchen: true,
});

/**
 * @deprecated Legacy whole-office composition table. Pricing uses scaled zone
 * line items from pricingConfig instead.
 */
export const officeCompositionSurcharges = Object.freeze({
  workspaces: {
    1: 0,
    2: 15,
    3: 30,
    4: 45,
    "5+": 60,
  },
  meetingRooms: {
    0: 0,
    1: 10,
    2: 20,
    "3+": 30,
  },
  kitchen: 25,
});

/** UI option-key multipliers — numeric pricing uses pricingConfig maps. */
export const officeZoneCountMultipliers = Object.freeze({
  workspaces: {
    1: officeWorkspaceMultipliers[1],
    2: officeWorkspaceMultipliers[2],
    3: officeWorkspaceMultipliers[3],
    4: officeWorkspaceMultipliers[4],
    "5+": officeWorkspaceMultipliers[5],
  },
  meetingRooms: {
    0: officeMeetingRoomMultipliers[0],
    1: officeMeetingRoomMultipliers[1],
    2: officeMeetingRoomMultipliers[2],
    "3+": officeMeetingRoomMultipliers[3],
  },
});

/**
 * @deprecated Area is never scaled by zone mode. Kept only for legacy imports.
 * See pricingConfig domain rule: areaPriceFactor is always 1.
 */
export const ZONES_AREA_PRICE_FACTOR = 1;

export const DEFAULT_RESIDENTIAL_ZONES = Object.freeze([
  "kitchen",
  "bathroom",
  "livingRoom",
  "bedroom",
  "hallway",
]);

export const DEFAULT_OFFICE_ZONES = Object.freeze([
  "workspace",
  "meetingRoom",
  "kitchen",
  "bathroom",
  "commonArea",
]);

export const bathroomAdjustments = Object.freeze({
  1: 0,
  2: bathroomExtraPerAdditional,
  3: bathroomExtraPerAdditional * 2,
  "4+": bathroomExtraPerAdditional * bathroomExtraMaxSteps,
});

/**
 * @returns {import('./schema.js').CalculatorState}
 */
export function createInitialCalculatorState() {
  return {
    propertyType: PROPERTY_TYPE_IDS.APARTMENT,
    cleaningFormat: CLEANING_FORMAT_IDS.MAINTENANCE,
    cleaningScope: CLEANING_SCOPE.WHOLE,
    area: residentialAreaDefaults.defaultArea,
    rooms: "2",
    bathrooms: "1",
    officeDetails: null,
    selectedZones: [...DEFAULT_RESIDENTIAL_ZONES],
    frequency: FREQUENCY_IDS.ONCE,
    selectedExtras: [],
    comment: "",
    contact: {
      name: "",
      phone: "",
      preferredContactMethod: "",
      preferredDate: "",
      preferredTime: "",
    },
  };
}
