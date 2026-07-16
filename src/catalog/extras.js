import {
  CLEANING_FORMAT_IDS,
  EXTRA_OPTION_IDS,
  PROPERTY_TYPE_IDS,
} from "@/catalog/ids";

/** @typedef {import('@/catalog/types.js').ExtraOptionEntity} ExtraOptionEntity */

const ALL_FORMATS = Object.freeze([
  CLEANING_FORMAT_IDS.MAINTENANCE,
  CLEANING_FORMAT_IDS.DEEP,
  CLEANING_FORMAT_IDS.POST_RENOVATION,
]);

const RESIDENTIAL_PROPERTIES = Object.freeze([
  PROPERTY_TYPE_IDS.APARTMENT,
  PROPERTY_TYPE_IDS.HOUSE,
]);

const ALL_PROPERTIES = Object.freeze([
  PROPERTY_TYPE_IDS.APARTMENT,
  PROPERTY_TYPE_IDS.HOUSE,
  PROPERTY_TYPE_IDS.OFFICE,
]);

/** @type {Record<string, ExtraOptionEntity>} */
export const extraOptions = {
  [EXTRA_OPTION_IDS.ECO_PRODUCTS]: {
    id: EXTRA_OPTION_IDS.ECO_PRODUCTS,
    label: { ru: "Эко-средства", en: "Eco-friendly products" },
    shortDescription: {
      ru: "Более щадящие средства по запросу.",
      en: "Gentler products on request.",
    },
    fullDescription: {
      ru: "Уборка с использованием более щадящих средств по запросу — для семей с детьми, домашними животными и людей, чувствительных к резким запахам.",
      en: "Cleaning with gentler products for families with children, pets, or scent sensitivity.",
    },
    icon: "leaf",
    availability: { enabled: true, listed: true },
    compatibility: {
      allowedPropertyTypes: [...ALL_PROPERTIES],
      allowedCleaningFormats: [...ALL_FORMATS],
      incompatibleExtras: [],
    },
    pricing: {
      mode: "fixed",
      currency: "BYN",
      price: 15,
      displayPriceLabel: { ru: "+15 BYN", en: "+15 BYN" },
    },
    displayOrder: 1,
  },
  [EXTRA_OPTION_IDS.WINDOW_CLEANING]: {
    id: EXTRA_OPTION_IDS.WINDOW_CLEANING,
    label: { ru: "Мытьё окон", en: "Window cleaning" },
    shortDescription: {
      ru: "Окна и доступные стеклянные поверхности.",
      en: "Windows and reachable glass surfaces.",
    },
    fullDescription: {
      ru: "Мытьё окон и доступных стеклянных поверхностей в рамках согласованного объёма работ.",
      en: "Cleaning of windows and reachable glass surfaces within the agreed scope.",
    },
    icon: "droplets",
    availability: { enabled: true, listed: true },
    compatibility: {
      allowedPropertyTypes: [...ALL_PROPERTIES],
      allowedCleaningFormats: [...ALL_FORMATS],
      incompatibleExtras: [],
    },
    pricing: {
      mode: "fixed",
      currency: "BYN",
      price: 25,
    },
    displayOrder: 2,
  },
  [EXTRA_OPTION_IDS.FRIDGE_INSIDE]: {
    id: EXTRA_OPTION_IDS.FRIDGE_INSIDE,
    label: { ru: "Холодильник внутри", en: "Fridge interior" },
    shortDescription: {
      ru: "Чистка холодильника изнутри.",
      en: "Interior fridge cleaning.",
    },
    fullDescription: {
      ru: "Мойка внутренних поверхностей холодильника. Недоступно для офисных заказов.",
      en: "Interior fridge cleaning. Not available for office bookings.",
    },
    icon: "refrigerator",
    availability: { enabled: true, listed: true },
    compatibility: {
      allowedPropertyTypes: [...RESIDENTIAL_PROPERTIES],
      allowedCleaningFormats: [...ALL_FORMATS],
      incompatibleExtras: [],
    },
    pricing: {
      mode: "fixed",
      currency: "BYN",
      price: 20,
    },
    displayOrder: 3,
  },
  [EXTRA_OPTION_IDS.OVEN_INSIDE]: {
    id: EXTRA_OPTION_IDS.OVEN_INSIDE,
    label: { ru: "Духовка внутри", en: "Oven interior" },
    shortDescription: {
      ru: "Чистка духовки изнутри.",
      en: "Interior oven cleaning.",
    },
    fullDescription: {
      ru: "Мойка внутренних поверхностей духовки. Недоступно для офисных заказов.",
      en: "Interior oven cleaning. Not available for office bookings.",
    },
    icon: "flame",
    availability: { enabled: true, listed: true },
    compatibility: {
      allowedPropertyTypes: [...RESIDENTIAL_PROPERTIES],
      allowedCleaningFormats: [...ALL_FORMATS],
      incompatibleExtras: [],
    },
    pricing: {
      mode: "fixed",
      currency: "BYN",
      price: 20,
    },
    displayOrder: 4,
  },
  [EXTRA_OPTION_IDS.CABINETS_INSIDE]: {
    id: EXTRA_OPTION_IDS.CABINETS_INSIDE,
    label: { ru: "Шкафы внутри", en: "Cabinets interior" },
    shortDescription: {
      ru: "Чистка шкафов изнутри.",
      en: "Interior cabinet cleaning.",
    },
    fullDescription: {
      ru: "Протирка внутренних поверхностей шкафов в согласованном объёме. Недоступно для офисных заказов.",
      en: "Interior cabinet wipe-down within the agreed scope. Not available for office bookings.",
    },
    icon: "cabinet",
    availability: { enabled: true, listed: true },
    compatibility: {
      allowedPropertyTypes: [...RESIDENTIAL_PROPERTIES],
      allowedCleaningFormats: [...ALL_FORMATS],
      incompatibleExtras: [],
    },
    pricing: {
      mode: "fixed",
      currency: "BYN",
      price: 25,
    },
    displayOrder: 5,
  },
  [EXTRA_OPTION_IDS.MICROWAVE_INSIDE]: {
    id: EXTRA_OPTION_IDS.MICROWAVE_INSIDE,
    label: { ru: "Микроволновка внутри", en: "Microwave interior" },
    shortDescription: {
      ru: "Чистка микроволновки изнутри.",
      en: "Interior microwave cleaning.",
    },
    fullDescription: {
      ru: "Мойка внутренних поверхностей микроволновки. Недоступно для офисных заказов.",
      en: "Interior microwave cleaning. Not available for office bookings.",
    },
    icon: "microwave",
    availability: { enabled: true, listed: true },
    compatibility: {
      allowedPropertyTypes: [...RESIDENTIAL_PROPERTIES],
      allowedCleaningFormats: [...ALL_FORMATS],
      incompatibleExtras: [],
    },
    pricing: {
      mode: "fixed",
      currency: "BYN",
      price: 10,
    },
    displayOrder: 6,
  },
  [EXTRA_OPTION_IDS.PET_HAIR]: {
    id: EXTRA_OPTION_IDS.PET_HAIR,
    label: { ru: "Шерсть животных", en: "Pet hair" },
    shortDescription: {
      ru: "Дополнительная работа с шерстью.",
      en: "Extra attention to pet hair.",
    },
    fullDescription: {
      ru: "Усиленная уборка поверхностей и текстиля при наличии шерсти животных. Недоступно для офисных заказов.",
      en: "Extra cleaning of surfaces and textiles with pet hair. Not available for office bookings.",
    },
    icon: "paw",
    availability: { enabled: true, listed: true },
    compatibility: {
      allowedPropertyTypes: [...RESIDENTIAL_PROPERTIES],
      allowedCleaningFormats: [...ALL_FORMATS],
      incompatibleExtras: [],
    },
    pricing: {
      mode: "fixed",
      currency: "BYN",
      price: 25,
    },
    displayOrder: 7,
  },
  [EXTRA_OPTION_IDS.HEAVY_DIRT]: {
    id: EXTRA_OPTION_IDS.HEAVY_DIRT,
    label: { ru: "Сильные загрязнения", en: "Heavy dirt" },
    shortDescription: {
      ru: "Доплата за сложные загрязнения.",
      en: "Surcharge for heavy soiling.",
    },
    fullDescription: {
      ru: "Дополнительная обработка при сильных или въевшихся загрязнениях.",
      en: "Extra treatment for heavy or stubborn dirt.",
    },
    icon: "alert",
    availability: { enabled: true, listed: true },
    compatibility: {
      allowedPropertyTypes: [...ALL_PROPERTIES],
      allowedCleaningFormats: [...ALL_FORMATS],
      incompatibleExtras: [],
    },
    pricing: {
      mode: "fixed",
      currency: "BYN",
      price: 40,
    },
    displayOrder: 8,
  },
  [EXTRA_OPTION_IDS.URGENT_CLEANING]: {
    id: EXTRA_OPTION_IDS.URGENT_CLEANING,
    label: { ru: "Срочная уборка", en: "Urgent cleaning" },
    shortDescription: {
      ru: "Приоритетный выезд по возможности.",
      en: "Priority visit when available.",
    },
    fullDescription: {
      ru: "Срочный выезд в ближайшее доступное окно. Может быть недоступен при высокой загрузке.",
      en: "Priority visit in the nearest available slot. May be unavailable during peak demand.",
    },
    icon: "zap",
    availability: { enabled: true, listed: true },
    compatibility: {
      allowedPropertyTypes: [...ALL_PROPERTIES],
      allowedCleaningFormats: [...ALL_FORMATS],
      incompatibleExtras: [],
    },
    pricing: {
      mode: "fixed",
      currency: "BYN",
      price: 45,
    },
    displayOrder: 9,
  },
};

/**
 * @returns {ExtraOptionEntity[]}
 */
export function getExtraOptionList() {
  return Object.values(extraOptions).sort(
    (left, right) => left.displayOrder - right.displayOrder
  );
}
