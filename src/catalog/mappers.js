import { getCleaningFormatList } from "@/catalog/cleaningFormats";
import { getExtraOptionList } from "@/catalog/extras";
import { DEFAULT_LOCALE, t } from "@/catalog/i18n";
import { getPropertyTypeList } from "@/catalog/propertyTypes";
import {
  getAvailableExtras,
  getCleaningFormat,
  getEffectivePricing,
  getExtraOption,
  getPropertyType,
} from "@/catalog/selectors";
import { pricingConfig } from "@/lib/calculator/pricing/pricingConfig";

/** @typedef {import('@/catalog/types.js').LocaleCode} LocaleCode */

/**
 * Showcase composition for the services section.
 * Labels and descriptions come from the catalog — no duplicated copy here.
 *
 * @type {Array<{
 *   id: string,
 *   source: 'propertyType' | 'cleaningFormat',
 *   sourceId: string,
 *   href: string,
 * }>}
 */
export const propertyTypeShowcaseItems = Object.freeze([
  {
    id: "apartment",
    source: "propertyType",
    sourceId: "apartment",
    href: "#calculator",
  },
  {
    id: "house",
    source: "propertyType",
    sourceId: "house",
    href: "#calculator",
  },
  {
    id: "office",
    source: "propertyType",
    sourceId: "office",
    href: "#calculator",
  },
]);

/**
 * @type {Array<{
 *   id: string,
 *   source: 'propertyType' | 'cleaningFormat',
 *   sourceId: string,
 *   href: string,
 * }>}
 */
export const cleaningFormatShowcaseItems = Object.freeze([
  {
    id: "maintenance",
    source: "cleaningFormat",
    sourceId: "maintenance",
    href: "#calculator",
  },
  {
    id: "deep",
    source: "cleaningFormat",
    sourceId: "deep",
    href: "#calculator",
  },
  {
    id: "postRenovation",
    source: "cleaningFormat",
    sourceId: "postRenovation",
    href: "#calculator",
  },
]);

/** @deprecated Prefer propertyTypeShowcaseItems + cleaningFormatShowcaseItems. */
export const serviceShowcaseItems = Object.freeze([
  ...propertyTypeShowcaseItems,
  ...cleaningFormatShowcaseItems,
]);

/**
 * @param {'propertyType' | 'cleaningFormat' | 'extraOption'} source
 * @param {string} sourceId
 */
function resolveShowcaseEntity(source, sourceId) {
  if (source === "propertyType") {
    return getPropertyType(sourceId);
  }

  if (source === "cleaningFormat") {
    return getCleaningFormat(sourceId);
  }

  return getExtraOption(sourceId);
}

/**
 * @param {Array<{
 *   id: string,
 *   source: 'propertyType' | 'cleaningFormat',
 *   sourceId: string,
 *   href: string,
 * }>} showcaseItems
 * @param {LocaleCode} [locale]
 * @returns {Array<{
 *   id: string,
 *   title: string,
 *   description: string,
 *   icon: string,
 *   href: string,
 *   source: 'propertyType' | 'cleaningFormat',
 *   sourceId: string,
 *   kind: 'propertyType' | 'cleaningFormat',
 * }>}
 */
function mapShowcaseCards(showcaseItems, locale = DEFAULT_LOCALE) {
  return showcaseItems
    .map((item) => {
      const entity = resolveShowcaseEntity(item.source, item.sourceId);
      if (!entity?.availability.listed || !entity.availability.enabled) {
        return null;
      }

      return {
        id: item.id,
        title: t(entity.label, locale),
        description: t(entity.fullDescription, locale),
        icon: entity.icon,
        href: item.href,
        source: item.source,
        sourceId: item.sourceId,
        kind: item.source,
      };
    })
    .filter(Boolean);
}

/**
 * Property-type cards for the services section.
 *
 * @param {LocaleCode} [locale]
 */
export function mapPropertyTypeServiceCards(locale = DEFAULT_LOCALE) {
  return mapShowcaseCards(propertyTypeShowcaseItems, locale);
}

/**
 * Cleaning-format cards for the services section.
 *
 * @param {LocaleCode} [locale]
 */
export function mapCleaningFormatServiceCards(locale = DEFAULT_LOCALE) {
  return mapShowcaseCards(cleaningFormatShowcaseItems, locale);
}

/**
 * Flat marketing cards for the services section (legacy helper).
 *
 * @param {LocaleCode} [locale]
 */
export function mapServiceCards(locale = DEFAULT_LOCALE) {
  return [
    ...mapPropertyTypeServiceCards(locale),
    ...mapCleaningFormatServiceCards(locale),
  ];
}

/**
 * Optional extras note for the services section (eco is not a primary service).
 *
 * @param {LocaleCode} [locale]
 * @returns {{ id: string, label: string, description: string } | null}
 */
export function mapServicesExtrasNote(locale = DEFAULT_LOCALE) {
  const eco = getExtraOption("ecoProducts");
  if (!eco?.availability.enabled || !eco.availability.listed) {
    return null;
  }

  return {
    id: eco.id,
    label: t(eco.label, locale),
    description: t(eco.shortDescription, locale),
  };
}

/**
 * Pricing plans derived from cleaning formats.
 *
 * @param {LocaleCode} [locale]
 * @returns {Array<{
 *   id: string,
 *   name: string,
 *   price: string,
 *   period: string,
 *   description: string,
 *   features: string[],
 *   highlighted: boolean,
 *   popularLabel?: string,
 * }>}
 */
export function mapPricingPlans(locale = DEFAULT_LOCALE) {
  return getCleaningFormatList()
    .filter((format) => format.availability.listed && format.availability.enabled)
    .map((format) => ({
      id: format.id,
      name: t(format.label, locale),
      price: t(
        format.pricing.displayPriceLabel ?? { ru: "по расчёту", en: "on request" },
        locale
      ),
      period: "",
      description: t(format.fullDescription, locale),
      features: (format.featureLabels ?? []).map((label) => t(label, locale)),
      highlighted: Boolean(format.highlighted),
      popularLabel: format.popularLabel
        ? t(format.popularLabel, locale)
        : undefined,
    }));
}

/**
 * Calculator-facing cleaning formats (transitional flat list).
 *
 * @param {LocaleCode} [locale]
 * @param {string} [propertyTypeId]
 */
export function mapCalculatorServiceTypes(
  locale = DEFAULT_LOCALE,
  propertyTypeId = "apartment"
) {
  const formats = getCleaningFormatList().filter((format) => {
    if (!format.availability.enabled) {
      return false;
    }

    const pricing = getEffectivePricing(propertyTypeId, format.id);
    return pricing != null;
  });

  /** @type {Record<string, {
   *   id: string,
   *   label: string,
   *   description: string,
   *   basePrice: number,
   *   pricePerSquareMeter: number,
   * }>} */
  const result = {};

  for (const format of formats) {
    const pricing = getEffectivePricing(propertyTypeId, format.id);
    if (!pricing) {
      continue;
    }

    result[format.id] = {
      id: format.id,
      label: t(format.label, locale),
      description: t(format.shortDescription, locale),
      basePrice: pricing.basePrice ?? 0,
      pricePerSquareMeter: pricing.pricePerSquareMeter ?? 0,
    };
  }

  return result;
}

/**
 * Calculator-facing extras for a property + format pair.
 *
 * @param {string} [propertyTypeId]
 * @param {string} [cleaningFormatId]
 * @param {LocaleCode} [locale]
 */
export function mapCalculatorExtras(
  propertyTypeId = "apartment",
  cleaningFormatId = "maintenance",
  locale = DEFAULT_LOCALE
) {
  return getAvailableExtras(propertyTypeId, cleaningFormatId).map((extra) => ({
    id: extra.id,
    label: t(extra.label, locale),
    price:
      pricingConfig.extrasCatalog[extra.id]?.price ?? extra.pricing.price ?? 0,
  }));
}

/**
 * Full extras catalog for transitional calculator (filters applied later by UI).
 *
 * @param {LocaleCode} [locale]
 */
export function mapAllCalculatorExtras(locale = DEFAULT_LOCALE) {
  return getExtraOptionList()
    .filter((extra) => extra.availability.enabled)
    .map((extra) => ({
      id: extra.id,
      label: t(extra.label, locale),
      price:
        pricingConfig.extrasCatalog[extra.id]?.price ??
        extra.pricing.price ??
        0,
    }));
}

/**
 * Localized property type options for future calculator steps.
 *
 * @param {LocaleCode} [locale]
 */
export function mapPropertyTypeOptions(locale = DEFAULT_LOCALE) {
  return getPropertyTypeList()
    .filter((item) => item.availability.enabled)
    .map((item) => ({
      id: item.id,
      label: t(item.label, locale),
      description: t(item.shortDescription, locale),
      icon: item.icon,
    }));
}
