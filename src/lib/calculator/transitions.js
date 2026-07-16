import { CLEANING_SCOPE } from "@/lib/calculator/constants";
import {
  getDefaultZonesForProperty,
  getZoneCatalogForProperty,
  normalizeCalculatorState,
} from "@/lib/calculator/normalize";

/**
 * @param {import('./schema.js').CalculatorState} state
 * @param {Partial<import('./schema.js').CalculatorState>} patch
 * @param {{ seedZonesIfEmpty?: boolean }} [options]
 */
export function applyCalculatorPatch(state, patch, options = {}) {
  return normalizeCalculatorState(
    {
      ...state,
      ...patch,
      contact: {
        ...state.contact,
        ...(patch.contact ?? {}),
      },
      officeDetails:
        patch.officeDetails === undefined
          ? state.officeDetails
          : patch.officeDetails === null
            ? null
            : {
                ...(state.officeDetails ?? {}),
                ...patch.officeDetails,
              },
    },
    options
  );
}

/**
 * @param {import('./schema.js').CalculatorState} state
 * @param {string} propertyType
 */
export function setPropertyType(state, propertyType) {
  if (state.propertyType === propertyType) {
    return state;
  }

  const allowed = new Set(
    getZoneCatalogForProperty(propertyType).map((zone) => zone.id)
  );
  const preservedZones = state.selectedZones.filter((id) => allowed.has(id));
  const selectedZones =
    preservedZones.length > 0
      ? preservedZones
      : getDefaultZonesForProperty(propertyType);

  return applyCalculatorPatch(state, {
    propertyType,
    selectedZones,
  });
}

/**
 * @param {import('./schema.js').CalculatorState} state
 * @param {string} cleaningFormat
 */
export function setCleaningFormat(state, cleaningFormat) {
  return applyCalculatorPatch(state, { cleaningFormat });
}

/**
 * @param {import('./schema.js').CalculatorState} state
 * @param {import('./constants.js').CleaningScope} cleaningScope
 */
export function setCleaningScope(state, cleaningScope) {
  if (
    cleaningScope === CLEANING_SCOPE.ZONES &&
    state.selectedZones.length === 0
  ) {
    return applyCalculatorPatch(
      state,
      {
        cleaningScope,
        selectedZones: getDefaultZonesForProperty(state.propertyType),
      },
      { seedZonesIfEmpty: true }
    );
  }

  return applyCalculatorPatch(state, { cleaningScope });
}

/**
 * @param {import('./schema.js').CalculatorState} state
 * @param {string} zoneId
 */
export function toggleZone(state, zoneId) {
  const selected = new Set(state.selectedZones);
  if (selected.has(zoneId)) {
    selected.delete(zoneId);
  } else {
    selected.add(zoneId);
  }

  /** @type {Partial<import('./schema.js').CalculatorState>} */
  const patch = {
    cleaningScope: CLEANING_SCOPE.ZONES,
    selectedZones: [...selected],
  };

  // Selecting kitchen zone implies the office has a kitchen.
  if (
    zoneId === "kitchen" &&
    selected.has("kitchen") &&
    state.officeDetails
  ) {
    patch.officeDetails = { hasKitchen: true };
  }

  return applyCalculatorPatch(state, patch);
}

/**
 * @param {import('./schema.js').CalculatorState} state
 * @param {string} extraId
 */
export function toggleExtra(state, extraId) {
  const selected = new Set(state.selectedExtras);
  if (selected.has(extraId)) {
    selected.delete(extraId);
  } else {
    selected.add(extraId);
  }

  return applyCalculatorPatch(state, {
    selectedExtras: [...selected],
  });
}

/**
 * Apply prefill from services section without wiping unrelated fields.
 *
 * @param {import('./schema.js').CalculatorState} state
 * @param {{ kind: string, id: string } | null | undefined} payload
 */
export function applyCalculatorPrefill(state, payload) {
  if (!payload?.kind || !payload?.id) {
    return state;
  }

  if (payload.kind === "propertyType") {
    return setPropertyType(state, payload.id);
  }

  if (payload.kind === "cleaningFormat") {
    return setCleaningFormat(state, payload.id);
  }

  return state;
}
