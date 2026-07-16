import {
  CLEANING_FORMAT_IDS,
  EXTRA_OPTION_IDS,
  PROPERTY_TYPE_IDS,
} from "@/catalog/ids";

/** @typedef {import('@/catalog/types.js').PropertyTypeEntity} PropertyTypeEntity */

const ALL_FORMATS = Object.freeze([
  CLEANING_FORMAT_IDS.MAINTENANCE,
  CLEANING_FORMAT_IDS.DEEP,
  CLEANING_FORMAT_IDS.POST_RENOVATION,
]);

const RESIDENTIAL_EXTRAS = Object.freeze([
  EXTRA_OPTION_IDS.ECO_PRODUCTS,
  EXTRA_OPTION_IDS.WINDOW_CLEANING,
  EXTRA_OPTION_IDS.FRIDGE_INSIDE,
  EXTRA_OPTION_IDS.OVEN_INSIDE,
  EXTRA_OPTION_IDS.CABINETS_INSIDE,
  EXTRA_OPTION_IDS.MICROWAVE_INSIDE,
  EXTRA_OPTION_IDS.PET_HAIR,
  EXTRA_OPTION_IDS.HEAVY_DIRT,
  EXTRA_OPTION_IDS.URGENT_CLEANING,
]);

const OFFICE_EXTRAS = Object.freeze([
  EXTRA_OPTION_IDS.ECO_PRODUCTS,
  EXTRA_OPTION_IDS.WINDOW_CLEANING,
  EXTRA_OPTION_IDS.HEAVY_DIRT,
  EXTRA_OPTION_IDS.URGENT_CLEANING,
]);

/** @type {Record<string, PropertyTypeEntity>} */
export const propertyTypes = {
  [PROPERTY_TYPE_IDS.APARTMENT]: {
    id: PROPERTY_TYPE_IDS.APARTMENT,
    label: { ru: "Квартира", en: "Apartment" },
    shortDescription: {
      ru: "Уборка квартир под ваш формат и площадь.",
      en: "Apartment cleaning tailored to your format and size.",
    },
    fullDescription: {
      ru: "Поддерживающая уборка квартиры: кухня, санузел, комнаты, полы и поверхности — чтобы дома было чисто без постоянной рутины.",
      en: "Apartment maintenance cleaning for kitchen, bathroom, rooms, floors and surfaces.",
    },
    icon: "home",
    availability: { enabled: true, listed: true },
    compatibility: {
      allowedCleaningFormats: [...ALL_FORMATS],
      allowedExtras: [...RESIDENTIAL_EXTRAS],
    },
    pricing: {
      mode: "calculated",
      currency: "BYN",
      displayPriceLabel: { ru: "по расчёту", en: "on request" },
    },
    displayOrder: 1,
  },
  [PROPERTY_TYPE_IDS.HOUSE]: {
    id: PROPERTY_TYPE_IDS.HOUSE,
    label: { ru: "Дом", en: "House" },
    shortDescription: {
      ru: "Уборка частных домов и больших пространств.",
      en: "Cleaning for private houses and larger spaces.",
    },
    fullDescription: {
      ru: "Уборка частных домов и больших пространств: комнаты, санузлы, кухня, лестницы, холлы и общие зоны.",
      en: "House cleaning for rooms, bathrooms, kitchen, stairs, halls and shared areas.",
    },
    icon: "house",
    availability: { enabled: true, listed: true },
    compatibility: {
      allowedCleaningFormats: [...ALL_FORMATS],
      allowedExtras: [...RESIDENTIAL_EXTRAS],
    },
    pricing: {
      mode: "calculated",
      currency: "BYN",
      displayPriceLabel: { ru: "по расчёту", en: "on request" },
    },
    displayOrder: 2,
  },
  [PROPERTY_TYPE_IDS.OFFICE]: {
    id: PROPERTY_TYPE_IDS.OFFICE,
    label: { ru: "Офис", en: "Office" },
    shortDescription: {
      ru: "Уборка рабочих зон с графиком под бизнес.",
      en: "Workspace cleaning on a business-friendly schedule.",
    },
    fullDescription: {
      ru: "Уборка рабочих зон, переговорных, кухонь, санузлов и мест общего пользования.",
      en: "Cleaning of work areas, meeting rooms, kitchens, bathrooms and common spaces.",
    },
    icon: "building",
    availability: { enabled: true, listed: true },
    compatibility: {
      allowedCleaningFormats: [...ALL_FORMATS],
      allowedExtras: [...OFFICE_EXTRAS],
      forbiddenExtras: [
        EXTRA_OPTION_IDS.FRIDGE_INSIDE,
        EXTRA_OPTION_IDS.OVEN_INSIDE,
        EXTRA_OPTION_IDS.CABINETS_INSIDE,
        EXTRA_OPTION_IDS.MICROWAVE_INSIDE,
        EXTRA_OPTION_IDS.PET_HAIR,
      ],
    },
    pricing: {
      mode: "calculated",
      currency: "BYN",
      basePrice: 100,
      pricePerSquareMeter: 1.4,
      displayPriceLabel: { ru: "по расчёту", en: "on request" },
    },
    displayOrder: 3,
  },
};

/**
 * @returns {PropertyTypeEntity[]}
 */
export function getPropertyTypeList() {
  return Object.values(propertyTypes).sort(
    (left, right) => left.displayOrder - right.displayOrder
  );
}
