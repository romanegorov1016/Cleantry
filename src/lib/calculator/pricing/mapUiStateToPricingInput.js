/**
 * Maps UI calculator state (string option ids) to the pure pricing input.
 * Does not clamp or invent values — pricing validation owns reject/accept.
 */

import { PROPERTY_TYPE_IDS } from "@/catalog/ids";
import { CLEANING_SCOPE } from "@/lib/calculator/pricing/pricingConfig";

/**
 * @param {unknown} value
 * @returns {number}
 */
function parseCountOption(value) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value !== "string") {
    return Number.NaN;
  }

  if (value.endsWith("+")) {
    const base = Number(value.slice(0, -1));
    return Number.isFinite(base) ? base : Number.NaN;
  }

  return Number(value);
}

/**
 * @param {Partial<import('../schema.js').CalculatorState> | Record<string, unknown>} state
 * @returns {import('./types.js').CalculatorPricingInput}
 */
export function mapUiStateToPricingInput(state = {}) {
  const propertyType =
    /** @type {import('./types.js').PropertyType} */ (
      state.propertyType ?? PROPERTY_TYPE_IDS.APARTMENT
    );
  const isOffice = propertyType === PROPERTY_TYPE_IDS.OFFICE;
  const officeDetails =
    state.officeDetails && typeof state.officeDetails === "object"
      ? state.officeDetails
      : null;

  return {
    propertyType,
    cleaningFormat: /** @type {import('./types.js').CleaningFormat} */ (
      state.cleaningFormat ?? "maintenance"
    ),
    cleaningScope:
      state.cleaningScope === CLEANING_SCOPE.ZONES
        ? CLEANING_SCOPE.ZONES
        : CLEANING_SCOPE.WHOLE,
    area: Number(state.area),
    bathroomCount: parseCountOption(state.bathrooms ?? 1),
    workplaceCount: isOffice
      ? parseCountOption(officeDetails?.workspaces ?? 0)
      : 0,
    meetingRoomCount: isOffice
      ? parseCountOption(officeDetails?.meetingRooms ?? 0)
      : 0,
    hasKitchen: isOffice ? Boolean(officeDetails?.hasKitchen) : true,
    selectedZones: Array.isArray(state.selectedZones)
      ? [...state.selectedZones]
      : [],
    frequency: /** @type {import('./types.js').FrequencyId} */ (
      state.frequency ?? "once"
    ),
    selectedExtras: Array.isArray(state.selectedExtras)
      ? [...state.selectedExtras]
      : [],
  };
}
