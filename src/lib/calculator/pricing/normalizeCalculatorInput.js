import { PROPERTY_TYPE_IDS } from "@/catalog/ids";
import { CLEANING_SCOPE, pricingConfig } from "@/lib/calculator/pricing/pricingConfig";

/**
 * @param {import('./types.js').PricingConfig} [config]
 * @param {string} propertyType
 * @param {{ hasKitchen?: boolean }} [office]
 * @returns {string[]}
 */
export function getAvailableZoneIds(
  propertyType,
  office = {},
  config = pricingConfig
) {
  if (propertyType === PROPERTY_TYPE_IDS.OFFICE) {
    const ids = Object.keys(config.officeZones);
    if (office.hasKitchen === false) {
      return ids.filter((id) => id !== "kitchen");
    }
    return ids;
  }

  return Object.keys(config.residentialZones);
}

/**
 * Deduplicate while preserving first-seen order from the catalog order.
 *
 * @param {string[]} zoneIds
 * @param {string[]} availableIds
 * @returns {string[]}
 */
export function normalizeZoneList(zoneIds, availableIds) {
  const available = new Set(availableIds);
  const selected = new Set();

  for (const id of zoneIds) {
    if (available.has(id)) {
      selected.add(id);
    }
  }

  return availableIds.filter((id) => selected.has(id));
}

/**
 * Pure normalize for pricing — does not mutate input, does not invent values.
 * Call after validation of numeric fields.
 *
 * @param {import('./types.js').CalculatorPricingInput} input
 * @param {import('./types.js').PricingConfig} [config]
 * @returns {import('./types.js').NormalizedCalculatorInput}
 */
export function normalizeCalculatorInput(input, config = pricingConfig) {
  const hasKitchen =
    input.propertyType === PROPERTY_TYPE_IDS.OFFICE
      ? Boolean(input.hasKitchen)
      : true;

  const availableZoneIds = getAvailableZoneIds(
    input.propertyType,
    { hasKitchen },
    config
  );

  const selectedZones = normalizeZoneList(
    Array.isArray(input.selectedZones) ? input.selectedZones : [],
    availableZoneIds
  );

  const effectiveZones =
    input.cleaningScope === CLEANING_SCOPE.WHOLE
      ? [...availableZoneIds]
      : selectedZones;

  const selectedExtras = [
    ...new Set(
      (Array.isArray(input.selectedExtras) ? input.selectedExtras : []).filter(
        (id) => id in config.extrasCatalog
      )
    ),
  ].sort();

  return {
    propertyType: input.propertyType,
    cleaningFormat: input.cleaningFormat,
    cleaningScope: input.cleaningScope,
    area: input.area,
    bathroomCount: input.bathroomCount,
    workplaceCount: input.workplaceCount,
    meetingRoomCount: input.meetingRoomCount,
    hasKitchen,
    selectedZones:
      input.cleaningScope === CLEANING_SCOPE.WHOLE
        ? [...availableZoneIds]
        : selectedZones,
    effectiveZones,
    frequency: input.frequency,
    selectedExtras,
    bathroomIncluded: effectiveZones.includes("bathroom"),
  };
}
