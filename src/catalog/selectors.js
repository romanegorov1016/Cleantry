import { cleaningFormats } from "@/catalog/cleaningFormats";
import { extraOptions } from "@/catalog/extras";
import {
  CLEANING_FORMAT_ID_LIST,
  EXTRA_OPTION_ID_LIST,
  LEGACY_SERVICE_TYPE_ALIASES,
  PROPERTY_TYPE_ID_LIST,
} from "@/catalog/ids";
import {
  incompatibilityRules,
  officeSettings,
} from "@/catalog/officeSettings";
import { propertyTypes } from "@/catalog/propertyTypes";
import { HOUSE_MULTIPLIER } from "@/lib/calculator/pricing/pricingConfig";

/** @typedef {import('@/catalog/ids.js').CleaningFormatId} CleaningFormatId */
/** @typedef {import('@/catalog/ids.js').ExtraOptionId} ExtraOptionId */
/** @typedef {import('@/catalog/ids.js').PropertyTypeId} PropertyTypeId */
/** @typedef {import('@/catalog/types.js').CleaningFormatEntity} CleaningFormatEntity */
/** @typedef {import('@/catalog/types.js').ExtraOptionEntity} ExtraOptionEntity */
/** @typedef {import('@/catalog/types.js').PropertyTypeEntity} PropertyTypeEntity */

/**
 * @param {string | null | undefined} id
 * @returns {string | null}
 */
export function resolveLegacyId(id) {
  if (!id) {
    return null;
  }

  return LEGACY_SERVICE_TYPE_ALIASES[id] ?? id;
}

/**
 * @param {string | null | undefined} propertyTypeId
 * @returns {PropertyTypeEntity | null}
 */
export function getPropertyType(propertyTypeId) {
  const resolvedId = resolveLegacyId(propertyTypeId);
  if (!resolvedId || !(resolvedId in propertyTypes)) {
    return null;
  }

  return propertyTypes[resolvedId];
}

/**
 * @param {string | null | undefined} cleaningFormatId
 * @returns {CleaningFormatEntity | null}
 */
export function getCleaningFormat(cleaningFormatId) {
  const resolvedId = resolveLegacyId(cleaningFormatId);
  if (!resolvedId || !(resolvedId in cleaningFormats)) {
    return null;
  }

  return cleaningFormats[resolvedId];
}

/**
 * @param {string | null | undefined} extraOptionId
 * @returns {ExtraOptionEntity | null}
 */
export function getExtraOption(extraOptionId) {
  const resolvedId = resolveLegacyId(extraOptionId);
  if (!resolvedId || !(resolvedId in extraOptions)) {
    return null;
  }

  return extraOptions[resolvedId];
}

/**
 * @param {string | null | undefined} propertyTypeId
 * @returns {boolean}
 */
export function isOfficeProperty(propertyTypeId) {
  return (
    resolveLegacyId(propertyTypeId) === officeSettings.propertyTypeId
  );
}

/**
 * @param {PropertyTypeId | string} propertyTypeId
 * @param {CleaningFormatId | string} cleaningFormatId
 * @returns {boolean}
 */
export function isPropertyFormatCompatible(propertyTypeId, cleaningFormatId) {
  const property = getPropertyType(propertyTypeId);
  const format = getCleaningFormat(cleaningFormatId);

  if (!property?.availability.enabled || !format?.availability.enabled) {
    return false;
  }

  const resolvedPropertyId = property.id;
  const resolvedFormatId = format.id;

  if (!property.compatibility.allowedCleaningFormats.includes(resolvedFormatId)) {
    return false;
  }

  if (!format.compatibility.allowedPropertyTypes.includes(resolvedPropertyId)) {
    return false;
  }

  if (
    isOfficeProperty(resolvedPropertyId) &&
    !officeSettings.availableCleaningFormatIds.includes(resolvedFormatId)
  ) {
    return false;
  }

  return !incompatibilityRules.some(
    (rule) =>
      rule.propertyTypes?.includes(resolvedPropertyId) &&
      rule.cleaningFormats?.includes(resolvedFormatId)
  );
}

/**
 * @param {PropertyTypeId | string} propertyTypeId
 * @param {CleaningFormatId | string} cleaningFormatId
 * @param {ExtraOptionId | string} extraOptionId
 * @returns {boolean}
 */
export function isExtraCompatible(
  propertyTypeId,
  cleaningFormatId,
  extraOptionId
) {
  const property = getPropertyType(propertyTypeId);
  const format = getCleaningFormat(cleaningFormatId);
  const extra = getExtraOption(extraOptionId);

  if (
    !property?.availability.enabled ||
    !format?.availability.enabled ||
    !extra?.availability.enabled
  ) {
    return false;
  }

  if (!isPropertyFormatCompatible(property.id, format.id)) {
    return false;
  }

  if (!extra.compatibility.allowedPropertyTypes.includes(property.id)) {
    return false;
  }

  if (!extra.compatibility.allowedCleaningFormats.includes(format.id)) {
    return false;
  }

  if (property.compatibility.forbiddenExtras?.includes(extra.id)) {
    return false;
  }

  if (
    property.compatibility.allowedExtras &&
    !property.compatibility.allowedExtras.includes(extra.id)
  ) {
    return false;
  }

  if (format.compatibility.forbiddenExtras?.includes(extra.id)) {
    return false;
  }

  if (format.compatibility.incompatibleExtras?.includes(extra.id)) {
    return false;
  }

  if (
    format.compatibility.allowedExtras &&
    !format.compatibility.allowedExtras.includes(extra.id)
  ) {
    return false;
  }

  if (
    isOfficeProperty(property.id) &&
    !officeSettings.availableExtraIds.includes(extra.id)
  ) {
    return false;
  }

  return !incompatibilityRules.some(
    (rule) =>
      rule.propertyTypes?.includes(property.id) &&
      rule.extras?.includes(extra.id)
  );
}

/**
 * Available cleaning formats for a property type, sorted by displayOrder.
 *
 * @param {PropertyTypeId | string} propertyTypeId
 * @returns {CleaningFormatEntity[]}
 */
export function getAvailableCleaningFormats(propertyTypeId) {
  const property = getPropertyType(propertyTypeId);
  if (!property?.availability.enabled) {
    return [];
  }

  return property.compatibility.allowedCleaningFormats
    .map((formatId) => getCleaningFormat(formatId))
    .filter(
      (format) =>
        format != null &&
        format.availability.enabled &&
        isPropertyFormatCompatible(property.id, format.id)
    )
    .sort((left, right) => left.displayOrder - right.displayOrder);
}

/**
 * Available extras for a property type + cleaning format pair.
 *
 * @param {PropertyTypeId | string} propertyTypeId
 * @param {CleaningFormatId | string} cleaningFormatId
 * @returns {ExtraOptionEntity[]}
 */
export function getAvailableExtras(propertyTypeId, cleaningFormatId) {
  if (!isPropertyFormatCompatible(propertyTypeId, cleaningFormatId)) {
    return [];
  }

  return EXTRA_OPTION_ID_LIST.map((extraId) => getExtraOption(extraId))
    .filter(
      (extra) =>
        extra != null &&
        extra.availability.enabled &&
        isExtraCompatible(propertyTypeId, cleaningFormatId, extra.id)
    )
    .sort((left, right) => left.displayOrder - right.displayOrder);
}

/**
 * @param {{
 *   propertyTypeId: PropertyTypeId | string,
 *   cleaningFormatId: CleaningFormatId | string,
 *   extraOptionIds?: Array<ExtraOptionId | string>,
 * }} selection
 * @returns {{ valid: boolean, invalidExtras: string[], reasonIds: string[] }}
 */
export function validateSelection(selection) {
  const propertyTypeId = resolveLegacyId(selection.propertyTypeId);
  const cleaningFormatId = resolveLegacyId(selection.cleaningFormatId);
  const extraOptionIds = (selection.extraOptionIds ?? []).map((id) =>
    resolveLegacyId(id)
  );

  /** @type {string[]} */
  const reasonIds = [];
  /** @type {string[]} */
  const invalidExtras = [];

  if (!propertyTypeId || !PROPERTY_TYPE_ID_LIST.includes(propertyTypeId)) {
    reasonIds.push("invalid-property-type");
  }

  if (
    !cleaningFormatId ||
    !CLEANING_FORMAT_ID_LIST.includes(cleaningFormatId)
  ) {
    reasonIds.push("invalid-cleaning-format");
  }

  if (
    propertyTypeId &&
    cleaningFormatId &&
    !isPropertyFormatCompatible(propertyTypeId, cleaningFormatId)
  ) {
    reasonIds.push("incompatible-property-format");
  }

  for (const extraId of extraOptionIds) {
    if (!extraId || !EXTRA_OPTION_ID_LIST.includes(extraId)) {
      invalidExtras.push(String(extraId));
      reasonIds.push("invalid-extra");
      continue;
    }

    if (
      !propertyTypeId ||
      !cleaningFormatId ||
      !isExtraCompatible(propertyTypeId, cleaningFormatId, extraId)
    ) {
      invalidExtras.push(extraId);
      reasonIds.push("incompatible-extra");
    }
  }

  return {
    valid: reasonIds.length === 0,
    invalidExtras,
    reasonIds: [...new Set(reasonIds)],
  };
}

/**
 * Effective pricing for a property + format pair (includes office overrides).
 *
 * @param {PropertyTypeId | string} propertyTypeId
 * @param {CleaningFormatId | string} cleaningFormatId
 * @returns {{
 *   mode: string,
 *   currency?: string,
 *   basePrice?: number,
 *   pricePerSquareMeter?: number,
 *   displayPriceLabel?: import('@/catalog/types.js').LocalizedText,
 * } | null}
 */
export function getEffectivePricing(propertyTypeId, cleaningFormatId) {
  const property = getPropertyType(propertyTypeId);
  const format = getCleaningFormat(cleaningFormatId);

  if (!property || !format || !isPropertyFormatCompatible(property.id, format.id)) {
    return null;
  }

  const officeOverride = isOfficeProperty(property.id)
    ? officeSettings.pricingOverrides[format.id]
    : null;

  const basePrice = officeOverride?.basePrice ?? format.pricing.basePrice ?? 0;
  const pricePerSquareMeter =
    officeOverride?.pricePerSquareMeter ??
    format.pricing.pricePerSquareMeter ??
    0;

  // Keep the per-m² rate unrounded. House area price must use
  // round(area × apartmentRate × houseMultiplier), not round(area × roundedRate).
  const houseMultiplier =
    property.id === "house" ? HOUSE_MULTIPLIER : 1;

  return {
    mode: format.pricing.mode,
    currency: format.pricing.currency ?? property.pricing.currency,
    basePrice: Math.round(basePrice * houseMultiplier),
    pricePerSquareMeter: pricePerSquareMeter * houseMultiplier,
    displayPriceLabel:
      format.pricing.displayPriceLabel ?? property.pricing.displayPriceLabel,
  };
}
