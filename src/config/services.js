import { DEFAULT_LOCALE, t } from "@/catalog/i18n";
import {
  mapCleaningFormatServiceCards,
  mapPropertyTypeServiceCards,
  mapServiceCards,
  mapServicesExtrasNote,
} from "@/catalog/mappers";

/** @typedef {import('@/catalog/types.js').LocaleCode} LocaleCode */
/** @typedef {import('@/catalog/types.js').LocalizedText} LocalizedText */

/** @type {{ eyebrow: LocalizedText, title: LocalizedText, description: LocalizedText }} */
export const servicesSectionCopy = {
  eyebrow: { ru: "Наши услуги", en: "Our services" },
  title: { ru: "Уборка под вашу задачу", en: "Cleaning for your needs" },
  description: {
    ru: "Выберите тип помещения и формат уборки. Эко-средства и другие задачи подключаются как дополнительные опции в расчёте.",
    en: "Choose a property type and cleaning format. Eco products and other tasks are available as extras in the quote.",
  },
};

/** @type {{ propertyTypes: LocalizedText, cleaningFormats: LocalizedText, cta: LocalizedText }} */
export const servicesSectionBlocks = {
  propertyTypes: {
    ru: "Что нужно убрать",
    en: "What needs cleaning",
  },
  cleaningFormats: {
    ru: "Какой формат уборки нужен",
    en: "Which cleaning format do you need",
  },
  cta: {
    ru: "Подробнее",
    en: "Learn more",
  },
};

/**
 * @param {LocaleCode} [locale]
 */
export function getServicesSectionContent(locale = DEFAULT_LOCALE) {
  const extrasNote = mapServicesExtrasNote(locale);

  return {
    eyebrow: t(servicesSectionCopy.eyebrow, locale),
    title: t(servicesSectionCopy.title, locale),
    description: t(servicesSectionCopy.description, locale),
    ctaLabel: t(servicesSectionBlocks.cta, locale),
    propertyTypes: {
      id: "property-types",
      title: t(servicesSectionBlocks.propertyTypes, locale),
      items: mapPropertyTypeServiceCards(locale),
    },
    cleaningFormats: {
      id: "cleaning-formats",
      title: t(servicesSectionBlocks.cleaningFormats, locale),
      items: mapCleaningFormatServiceCards(locale),
    },
    extrasNote,
    /** @deprecated Prefer propertyTypes.items + cleaningFormats.items */
    items: mapServiceCards(locale),
  };
}

/** @deprecated Prefer getServicesSectionContent().items — kept for gradual migration. */
export const services = mapServiceCards();
