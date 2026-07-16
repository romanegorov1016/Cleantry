import { DEFAULT_LOCALE, t } from "@/catalog/i18n";
import { mapPricingPlans } from "@/catalog/mappers";

/** @typedef {import('@/catalog/types.js').LocaleCode} LocaleCode */
/** @typedef {import('@/catalog/types.js').LocalizedText} LocalizedText */

/** @type {{ eyebrow: LocalizedText, title: LocalizedText, description: LocalizedText }} */
export const pricingSectionCopy = {
  eyebrow: { ru: "Цены", en: "Pricing" },
  title: {
    ru: "Понятная стоимость без неприятных сюрпризов",
    en: "Clear pricing without surprises",
  },
  description: {
    ru: "Итоговая цена зависит от площади, состояния помещения, формата уборки и дополнительных задач — мы всё уточняем заранее.",
    en: "The final price depends on area, condition, cleaning format and extras — we confirm everything in advance.",
  },
};

/**
 * @param {LocaleCode} [locale]
 */
export function getPricingSectionContent(locale = DEFAULT_LOCALE) {
  return {
    eyebrow: t(pricingSectionCopy.eyebrow, locale),
    title: t(pricingSectionCopy.title, locale),
    description: t(pricingSectionCopy.description, locale),
    plans: mapPricingPlans(locale),
  };
}

/** @deprecated Prefer getPricingSectionContent().plans — kept for gradual migration. */
export const pricingPlans = mapPricingPlans();
