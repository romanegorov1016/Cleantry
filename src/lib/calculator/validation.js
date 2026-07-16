import {
  getAvailableCleaningFormats,
  getAvailableExtras,
  isOfficeProperty,
} from "@/catalog/selectors";
import {
  CLEANING_SCOPE,
  COMMENT_MAX_LENGTH,
} from "@/lib/calculator/constants";
import {
  getAreaDefaultsForProperty,
  getAreaValidationError,
  normalizeCalculatorState,
} from "@/lib/calculator/normalize";

/**
 * Validate calculator state for submit / readiness.
 * Empty zones in zones-mode are an error (not auto-filled).
 *
 * @param {unknown} input
 */
export function validateCalculatorState(input) {
  /** @type {Record<string, string>} */
  const errors = {};
  const normalized = normalizeCalculatorState(
    /** @type {Partial<import('./schema.js').CalculatorState>} */ (input ?? {})
  );

  if (!["apartment", "house", "office"].includes(normalized.propertyType)) {
    errors.propertyType = "Выберите тип помещения";
  }

  const formats = getAvailableCleaningFormats(normalized.propertyType).map(
    (item) => item.id
  );
  if (!formats.includes(normalized.cleaningFormat)) {
    errors.cleaningFormat = "Выберите доступный формат уборки";
  }

  if (
    normalized.cleaningScope !== CLEANING_SCOPE.WHOLE &&
    normalized.cleaningScope !== CLEANING_SCOPE.ZONES
  ) {
    errors.cleaningScope = "Выберите объём уборки";
  }

  const areaDefaults = getAreaDefaultsForProperty(normalized.propertyType);
  const areaError = getAreaValidationError(normalized.area, areaDefaults);
  if (areaError) {
    errors.area = areaError;
  }

  if (
    normalized.cleaningScope === CLEANING_SCOPE.ZONES &&
    normalized.selectedZones.length === 0
  ) {
    errors.selectedZones = "Выберите хотя бы одну зону";
  }

  if (isOfficeProperty(normalized.propertyType) && !normalized.officeDetails) {
    errors.officeDetails = "Заполните детали офиса";
  }

  const allowedExtras = new Set(
    getAvailableExtras(
      normalized.propertyType,
      normalized.cleaningFormat
    ).map((extra) => extra.id)
  );
  if (normalized.selectedExtras.some((id) => !allowedExtras.has(id))) {
    errors.selectedExtras = "Выбраны недоступные дополнительные услуги";
  }

  if (normalized.comment.length > COMMENT_MAX_LENGTH) {
    errors.comment = `Комментарий не длиннее ${COMMENT_MAX_LENGTH} символов`;
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
    normalized,
  };
}
