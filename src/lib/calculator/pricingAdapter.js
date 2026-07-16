/**
 * Compatibility adapter between UI calculator state and the pure pricing engine.
 * Prefer `calculateCleaningPrice` / `mapUiStateToPricingInput` for new code.
 */

import { isOfficeProperty } from "@/catalog/selectors";
import {
  getAvailableZoneIds,
  normalizeZoneList,
} from "@/lib/calculator/pricing/normalizeCalculatorInput";
import { mapUiStateToPricingInput } from "@/lib/calculator/pricing/mapUiStateToPricingInput";
import { pricingConfig } from "@/lib/calculator/pricing/pricingConfig";
import { calculateZonesPrice } from "@/lib/calculator/pricing/calculateZonesPrice";
import { calculateBathroomExtra } from "@/lib/calculator/pricing/calculateBathroomExtra";
import { validateAndNormalizeInput } from "@/lib/calculator/pricing/validateCalculatorInput";
import { normalizeCalculatorState } from "@/lib/calculator/normalize";
import { CLEANING_SCOPE } from "@/lib/calculator/constants";

/**
 * @param {string} bathrooms
 * @deprecated Use calculateBathroomExtra with numeric bathroomCount.
 */
export function getBathroomAdjustmentAmount(bathrooms) {
  const count =
    typeof bathrooms === "string" && bathrooms.endsWith("+")
      ? Number(bathrooms.slice(0, -1))
      : Number(bathrooms);

  if (!Number.isFinite(count) || count < 1) {
    return 0;
  }

  return (
    Math.min(Math.max(count - 1, 0), pricingConfig.bathroomExtraMaxSteps) *
    pricingConfig.bathroomExtraPerAdditional
  );
}

/**
 * @deprecated Office composition is represented via scaled zone line items.
 */
export function getOfficeCompositionSurcharge() {
  return 0;
}

/**
 * @param {string} zoneId
 * @param {number} basePrice
 * @param {import('./schema.js').OfficeDetails | null} officeDetails
 * @param {boolean} isOffice
 */
export function getScaledZonePrice(zoneId, basePrice, officeDetails, isOffice) {
  if (!isOffice || !officeDetails) {
    return basePrice;
  }

  const input = {
    propertyType: "office",
    cleaningFormat: "maintenance",
    cleaningScope: CLEANING_SCOPE.ZONES,
    area: 1,
    bathroomCount: 1,
    workplaceCount: Number.parseInt(String(officeDetails.workspaces), 10) || 0,
    meetingRoomCount:
      Number.parseInt(String(officeDetails.meetingRooms), 10) || 0,
    hasKitchen: Boolean(officeDetails.hasKitchen),
    selectedZones: [zoneId],
    frequency: "once",
    selectedExtras: [],
  };

  const validation = validateAndNormalizeInput(input, pricingConfig);
  if (!validation.valid) {
    return 0;
  }

  const zones = calculateZonesPrice(validation.value, pricingConfig);
  return zones.items.find((item) => item.id === zoneId)?.price ?? 0;
}

/**
 * @param {import('./schema.js').CalculatorState} normalized
 * @returns {string[]}
 */
export function getAvailableZoneIdsForPricing(normalized) {
  const isOffice = isOfficeProperty(normalized.propertyType);
  return getAvailableZoneIds(normalized.propertyType, {
    hasKitchen: isOffice
      ? Boolean(normalized.officeDetails?.hasKitchen)
      : true,
  });
}

/**
 * @param {import('./schema.js').CalculatorState} normalized
 */
export function areAllAvailableZonesSelected(normalized) {
  const available = getAvailableZoneIdsForPricing(normalized);
  if (available.length === 0) {
    return false;
  }

  const selected = new Set(normalized.selectedZones);
  return available.every((id) => selected.has(id));
}

/**
 * @param {Partial<import('./schema.js').CalculatorState>} state
 * @returns {import('./schema.js').PricingInput}
 */
export function toPricingInput(state) {
  const normalized = normalizeCalculatorState(state);
  const pricingRaw = mapUiStateToPricingInput(normalized);
  const validation = validateAndNormalizeInput(pricingRaw, pricingConfig);

  if (!validation.valid) {
    const availableZoneIds = getAvailableZoneIdsForPricing(normalized);
    const effectiveZones =
      normalized.cleaningScope === CLEANING_SCOPE.WHOLE
        ? availableZoneIds
        : normalizeZoneList(normalized.selectedZones, availableZoneIds);

    return {
      propertyType: normalized.propertyType,
      cleaningFormat: normalized.cleaningFormat,
      cleaningScope: normalized.cleaningScope,
      pricedAsWhole:
        normalized.cleaningScope === CLEANING_SCOPE.WHOLE ||
        areAllAvailableZonesSelected(normalized),
      area: normalized.area,
      rooms: isOfficeProperty(normalized.propertyType)
        ? null
        : normalized.rooms,
      bathrooms: normalized.bathrooms,
      officeDetails: normalized.officeDetails,
      selectedZones: normalized.selectedZones,
      effectiveZones,
      zoneLineItems: [],
      frequency: normalized.frequency,
      selectedExtras: normalized.selectedExtras,
      includeBathroomAdjustment: effectiveZones.includes("bathroom"),
      bathroomAdjustment: 0,
      officeComposition: 0,
      areaPriceFactor: 1,
      includeBasePrice: true,
    };
  }

  const input = validation.value;
  const zones = calculateZonesPrice(input, pricingConfig);
  const bathroomAdjustment = calculateBathroomExtra(input, pricingConfig);

  return {
    propertyType: input.propertyType,
    cleaningFormat: input.cleaningFormat,
    cleaningScope: input.cleaningScope,
    pricedAsWhole:
      input.cleaningScope === CLEANING_SCOPE.WHOLE ||
      areAllAvailableZonesSelected(normalized),
    area: input.area,
    rooms: isOfficeProperty(input.propertyType) ? null : normalized.rooms,
    bathrooms: normalized.bathrooms,
    officeDetails: normalized.officeDetails,
    selectedZones: input.selectedZones,
    effectiveZones: input.effectiveZones,
    zoneLineItems: zones.items.map((item) => ({
      id: item.id,
      label: item.title,
      price: item.price,
    })),
    frequency: input.frequency,
    selectedExtras: input.selectedExtras,
    includeBathroomAdjustment: input.bathroomIncluded,
    bathroomAdjustment,
    officeComposition: 0,
    areaPriceFactor: 1,
    includeBasePrice: true,
  };
}

/**
 * @param {Partial<import('./schema.js').CalculatorState>} state
 */
export function toLegacyPriceState(state) {
  const pricingInput = toPricingInput(state);

  return {
    propertyType: pricingInput.propertyType,
    serviceType: pricingInput.cleaningFormat,
    cleaningFormat: pricingInput.cleaningFormat,
    cleaningScope: pricingInput.cleaningScope,
    area: pricingInput.area,
    rooms: pricingInput.rooms ?? "1",
    bathrooms: pricingInput.bathrooms,
    selectedAreas: pricingInput.effectiveZones,
    selectedExtras: pricingInput.selectedExtras,
    frequency: pricingInput.frequency,
    includeBathroomAdjustment: pricingInput.includeBathroomAdjustment,
    bathroomAdjustment: pricingInput.bathroomAdjustment,
    officeComposition: pricingInput.officeComposition,
    areaPriceFactor: pricingInput.areaPriceFactor,
    includeBasePrice: pricingInput.includeBasePrice,
    zoneLineItems: pricingInput.zoneLineItems,
    pricedAsWhole: pricingInput.pricedAsWhole,
  };
}
