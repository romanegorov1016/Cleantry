import { PROPERTY_TYPE_IDS } from "@/catalog/ids";
import {
  getAvailableCleaningFormats,
  getAvailableExtras,
  isOfficeProperty,
} from "@/catalog/selectors";
import { officeSettings } from "@/catalog/officeSettings";
import {
  bathroomOptions,
  CLEANING_SCOPE,
  COMMENT_MAX_LENGTH,
  createInitialCalculatorState,
  DEFAULT_OFFICE_ZONES,
  DEFAULT_RESIDENTIAL_ZONES,
  defaultOfficeDetails,
  houseAreaDefaults,
  officeMeetingRoomOptions,
  officeWorkspaceOptions,
  officeZoneCatalog,
  residentialAreaDefaults,
  residentialRoomOptions,
  residentialZoneCatalog,
} from "@/lib/calculator/constants";

/**
 * @param {string} propertyType
 */
export function getZoneCatalogForProperty(propertyType) {
  return isOfficeProperty(propertyType)
    ? officeZoneCatalog
    : residentialZoneCatalog;
}

/**
 * @param {string} propertyType
 */
export function getAreaDefaultsForProperty(propertyType) {
  if (isOfficeProperty(propertyType)) {
    return officeSettings.areaDefaults;
  }

  if (propertyType === PROPERTY_TYPE_IDS.HOUSE) {
    return houseAreaDefaults;
  }

  return residentialAreaDefaults;
}

/**
 * @param {string} propertyType
 */
export function getDefaultZonesForProperty(propertyType) {
  return isOfficeProperty(propertyType)
    ? [...DEFAULT_OFFICE_ZONES]
    : [...DEFAULT_RESIDENTIAL_ZONES];
}

/**
 * @param {unknown} value
 * @param {readonly string[]} options
 * @param {string} fallback
 */
function pickOption(value, options, fallback) {
  if (typeof value === "string" && options.includes(value)) {
    return value;
  }

  return fallback;
}

/**
 * Clamp area for pricing / committed state. Does not run on every keystroke —
 * the UI keeps a local draft string until blur.
 *
 * @param {unknown} area
 * @param {{ minArea: number, maxArea: number, defaultArea: number }} defaults
 */
export function clampArea(area, defaults) {
  const parsed = Number(area);

  if (!Number.isFinite(parsed) || parsed <= 0) {
    return defaults.defaultArea;
  }

  return Math.min(defaults.maxArea, Math.max(defaults.minArea, parsed));
}

/**
 * @param {unknown} area
 * @param {{ minArea: number, maxArea: number }} defaults
 * @returns {string | null}
 */
export function getAreaValidationError(area, defaults) {
  const parsed = Number(area);

  if (!Number.isFinite(parsed) || parsed <= 0) {
    return "Укажите площадь помещения";
  }

  if (parsed < defaults.minArea || parsed > defaults.maxArea) {
    return `Площадь должна быть от ${defaults.minArea} до ${defaults.maxArea} м²`;
  }

  return null;
}

/**
 * @param {unknown} value
 * @returns {string[]}
 */
function asIdList(value) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((item) => typeof item === "string" && item.length > 0);
}

/**
 * Sync kitchen zone with office hasKitchen flag.
 * - hasKitchen=false → remove kitchen zone
 * - kitchen zone selected → force hasKitchen=true
 *
 * @param {string[]} selectedZones
 * @param {import('./schema.js').OfficeDetails | null} officeDetails
 * @param {boolean} isOffice
 */
export function syncKitchenZoneWithOfficeDetails(
  selectedZones,
  officeDetails,
  isOffice
) {
  if (!isOffice || !officeDetails) {
    return { selectedZones, officeDetails };
  }

  let nextZones = [...selectedZones];
  let nextOffice = { ...officeDetails };

  if (!nextOffice.hasKitchen) {
    nextZones = nextZones.filter((id) => id !== "kitchen");
  }

  if (nextZones.includes("kitchen") && !nextOffice.hasKitchen) {
    nextOffice = { ...nextOffice, hasKitchen: true };
  }

  return { selectedZones: nextZones, officeDetails: nextOffice };
}

/**
 * Normalize calculator state after any meaningful change.
 * Empty selectedZones are preserved (validated on submit).
 * Rooms are preserved across office round-trips.
 *
 * @param {Partial<import('./schema.js').CalculatorState> | null | undefined} input
 * @param {{ seedZonesIfEmpty?: boolean }} [options]
 * @returns {import('./schema.js').CalculatorState}
 */
export function normalizeCalculatorState(input = {}, options = {}) {
  const { seedZonesIfEmpty = false } = options;
  const defaults = createInitialCalculatorState();
  const merged = {
    ...defaults,
    ...input,
    contact: {
      ...defaults.contact,
      ...(input?.contact ?? {}),
    },
  };

  const propertyType = ["apartment", "house", "office"].includes(
    merged.propertyType
  )
    ? merged.propertyType
    : defaults.propertyType;

  const isOffice = isOfficeProperty(propertyType);
  const areaDefaults = getAreaDefaultsForProperty(propertyType);
  const availableFormats = getAvailableCleaningFormats(propertyType);
  const availableFormatIds = availableFormats.map((format) => format.id);

  let cleaningFormat = merged.cleaningFormat;
  if (!availableFormatIds.includes(cleaningFormat)) {
    cleaningFormat = availableFormatIds[0] ?? defaults.cleaningFormat;
  }

  const cleaningScope =
    merged.cleaningScope === CLEANING_SCOPE.ZONES
      ? CLEANING_SCOPE.ZONES
      : CLEANING_SCOPE.WHOLE;

  const zoneCatalog = getZoneCatalogForProperty(propertyType);
  const allowedZoneIds = new Set(zoneCatalog.map((zone) => zone.id));
  let selectedZones = asIdList(merged.selectedZones).filter((id) =>
    allowedZoneIds.has(id)
  );

  if (selectedZones.length === 0 && seedZonesIfEmpty) {
    selectedZones = getDefaultZonesForProperty(propertyType).filter((id) =>
      allowedZoneIds.has(id)
    );
  }

  const availableExtras = getAvailableExtras(propertyType, cleaningFormat);
  const allowedExtraIds = new Set(availableExtras.map((extra) => extra.id));
  const selectedExtras = asIdList(merged.selectedExtras).filter((id) =>
    allowedExtraIds.has(id)
  );

  // Always preserve rooms (hidden in office UI, restored on return to residential).
  const rooms = pickOption(
    merged.rooms,
    residentialRoomOptions,
    defaults.rooms
  );

  const bathrooms = pickOption(
    merged.bathrooms,
    bathroomOptions,
    defaults.bathrooms
  );

  /** @type {import('./schema.js').OfficeDetails | null} */
  let officeDetails = null;
  if (isOffice) {
    const incoming = merged.officeDetails ?? defaultOfficeDetails;
    officeDetails = {
      workspaces: pickOption(
        incoming.workspaces,
        officeWorkspaceOptions,
        defaultOfficeDetails.workspaces
      ),
      meetingRooms: pickOption(
        incoming.meetingRooms,
        officeMeetingRoomOptions,
        defaultOfficeDetails.meetingRooms
      ),
      hasKitchen: Boolean(incoming.hasKitchen),
    };
  }

  const synced = syncKitchenZoneWithOfficeDetails(
    selectedZones,
    officeDetails,
    isOffice
  );
  selectedZones = synced.selectedZones;
  officeDetails = synced.officeDetails;

  const frequencyOptions = ["once", "weekly", "biweekly", "monthly"];
  const frequency = pickOption(
    merged.frequency,
    frequencyOptions,
    defaults.frequency
  );

  const comment =
    typeof merged.comment === "string"
      ? merged.comment.slice(0, COMMENT_MAX_LENGTH)
      : "";

  return {
    propertyType,
    cleaningFormat,
    cleaningScope,
    area: clampArea(merged.area, areaDefaults),
    rooms,
    bathrooms,
    officeDetails,
    selectedZones,
    frequency,
    selectedExtras,
    comment,
    contact: {
      name: String(merged.contact?.name ?? ""),
      phone: String(merged.contact?.phone ?? ""),
      preferredContactMethod: String(
        merged.contact?.preferredContactMethod ?? ""
      ),
      preferredDate: String(merged.contact?.preferredDate ?? ""),
      preferredTime: String(merged.contact?.preferredTime ?? ""),
    },
  };
}
