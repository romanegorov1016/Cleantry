import {
  CLEANING_FORMAT_IDS,
  EXTRA_OPTION_IDS,
  PROPERTY_TYPE_IDS,
} from "@/catalog/ids";

/** @typedef {import('@/catalog/types.js').CleaningFormatEntity} CleaningFormatEntity */

const ALL_PROPERTIES = Object.freeze([
  PROPERTY_TYPE_IDS.APARTMENT,
  PROPERTY_TYPE_IDS.HOUSE,
  PROPERTY_TYPE_IDS.OFFICE,
]);

/** @type {Record<string, CleaningFormatEntity>} */
export const cleaningFormats = {
  [CLEANING_FORMAT_IDS.MAINTENANCE]: {
    id: CLEANING_FORMAT_IDS.MAINTENANCE,
    label: { ru: "Поддерживающая уборка", en: "Maintenance cleaning" },
    shortDescription: {
      ru: "Для регулярного поддержания чистоты.",
      en: "For keeping spaces consistently clean.",
    },
    fullDescription: {
      ru: "Для квартир, домов и офисов, где нужно регулярно поддерживать чистоту без постоянной организации процесса.",
      en: "Regular upkeep for apartments, houses and offices without constant self-organization.",
    },
    icon: "sparkles",
    availability: { enabled: true, listed: true },
    compatibility: {
      allowedPropertyTypes: [...ALL_PROPERTIES],
      allowedExtras: null,
      incompatibleExtras: [],
    },
    pricing: {
      mode: "calculated",
      currency: "BYN",
      basePrice: 70,
      pricePerSquareMeter: 1.2,
      displayPriceLabel: { ru: "по расчёту", en: "on request" },
    },
    featureLabels: [
      { ru: "Кухня и санузел", en: "Kitchen and bathroom" },
      { ru: "Пыль и поверхности", en: "Dust and surfaces" },
      { ru: "Мытьё полов", en: "Floor washing" },
      { ru: "Вынос мусора", en: "Trash removal" },
      { ru: "Регулярный график по запросу", en: "Recurring schedule on request" },
    ],
    highlighted: false,
    displayOrder: 1,
  },
  [CLEANING_FORMAT_IDS.DEEP]: {
    id: CLEANING_FORMAT_IDS.DEEP,
    label: { ru: "Генеральная уборка", en: "Deep cleaning" },
    shortDescription: {
      ru: "Глубокая уборка с вниманием к деталям.",
      en: "Thorough cleaning with attention to detail.",
    },
    fullDescription: {
      ru: "Глубокая уборка, когда обычной недостаточно: труднодоступные места, детальная обработка поверхностей и накопившиеся загрязнения.",
      en: "Deep cleaning for hard-to-reach areas, detailed surfaces and accumulated dirt.",
    },
    icon: "layers",
    availability: { enabled: true, listed: true },
    compatibility: {
      allowedPropertyTypes: [...ALL_PROPERTIES],
      allowedExtras: null,
      incompatibleExtras: [],
    },
    pricing: {
      mode: "calculated",
      currency: "BYN",
      basePrice: 120,
      pricePerSquareMeter: 1.8,
      displayPriceLabel: { ru: "по расчёту", en: "on request" },
    },
    featureLabels: [
      { ru: "Всё из поддерживающей уборки", en: "Everything from maintenance cleaning" },
      { ru: "Труднодоступные места", en: "Hard-to-reach areas" },
      { ru: "Детальная уборка кухни и санузла", en: "Detailed kitchen and bathroom cleaning" },
      { ru: "Двери, плинтусы, фасады", en: "Doors, baseboards, fronts" },
      {
        ru: "Дополнительные задачи по согласованию",
        en: "Extra tasks by agreement",
      },
    ],
    highlighted: true,
    popularLabel: { ru: "Популярно", en: "Popular" },
    displayOrder: 2,
  },
  [CLEANING_FORMAT_IDS.POST_RENOVATION]: {
    id: CLEANING_FORMAT_IDS.POST_RENOVATION,
    label: { ru: "Уборка после ремонта", en: "Post-renovation cleaning" },
    shortDescription: {
      ru: "После строительных и отделочных работ.",
      en: "After construction and finishing works.",
    },
    fullDescription: {
      ru: "Строительная пыль, следы работ, поверхности, полы и окна по согласованию — всё, чтобы подготовить пространство к жизни, сдаче или продаже.",
      en: "Construction dust, work traces, surfaces, floors and windows by agreement — ready for living, handover or sale.",
    },
    icon: "hammer",
    availability: { enabled: true, listed: true },
    compatibility: {
      allowedPropertyTypes: [...ALL_PROPERTIES],
      allowedExtras: null,
      // Eco products remain available; heavy dirt is typical for this format.
      incompatibleExtras: [],
      forbiddenExtras: [],
    },
    pricing: {
      mode: "calculated",
      currency: "BYN",
      basePrice: 160,
      pricePerSquareMeter: 2.3,
      displayPriceLabel: { ru: "по расчёту", en: "on request" },
    },
    featureLabels: [
      { ru: "Удаление строительной пыли", en: "Construction dust removal" },
      { ru: "Очистка поверхностей после работ", en: "Post-work surface cleaning" },
      { ru: "Полы и труднодоступные зоны", en: "Floors and hard-to-reach zones" },
      { ru: "Окна по согласованию", en: "Windows by agreement" },
      { ru: "Подготовка к заселению или сдаче", en: "Ready for move-in or handover" },
    ],
    highlighted: false,
    displayOrder: 3,
  },
};

/**
 * @returns {CleaningFormatEntity[]}
 */
export function getCleaningFormatList() {
  return Object.values(cleaningFormats).sort(
    (left, right) => left.displayOrder - right.displayOrder
  );
}
