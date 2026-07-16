import { PROPERTY_TYPE_IDS } from "@/catalog/ids";
import {
  CLEANING_SCOPE,
  pricingConfig,
} from "@/lib/calculator/pricing/pricingConfig";
import { normalizeCalculatorInput } from "@/lib/calculator/pricing/normalizeCalculatorInput";

/**
 * @param {unknown} value
 * @returns {boolean}
 */
function isNonNegativeInteger(value) {
  return Number.isInteger(value) && value >= 0 && Number.isFinite(value);
}

/**
 * @param {unknown} value
 * @returns {boolean}
 */
function isPositiveFiniteNumber(value) {
  return typeof value === "number" && Number.isFinite(value) && value > 0;
}

/**
 * Validate + normalize. Does not silently repair invalid numbers.
 *
 * @param {Partial<import('./types.js').CalculatorPricingInput> | null | undefined} rawInput
 * @param {import('./types.js').PricingConfig} [config]
 * @returns {import('./types.js').CalculatorValidationResult}
 */
export function validateAndNormalizeInput(rawInput, config = pricingConfig) {
  /** @type {import('./types.js').CalculatorValidationError[]} */
  const errors = [];

  if (!rawInput || typeof rawInput !== "object") {
    return {
      valid: false,
      errors: [
        {
          code: "invalid_input",
          message: "Входные данные калькулятора отсутствуют",
        },
      ],
    };
  }

  const propertyType = rawInput.propertyType;
  if (
    typeof propertyType !== "string" ||
    !config.propertyTypes.includes(propertyType)
  ) {
    errors.push({
      code: "invalid_property_type",
      field: "propertyType",
      message: "Некорректный тип помещения",
    });
  }

  const cleaningFormat = rawInput.cleaningFormat;
  if (
    typeof cleaningFormat !== "string" ||
    !config.cleaningFormats.includes(cleaningFormat)
  ) {
    errors.push({
      code: "invalid_cleaning_format",
      field: "cleaningFormat",
      message: "Некорректный формат уборки",
    });
  }

  const cleaningScope = rawInput.cleaningScope;
  if (
    cleaningScope !== CLEANING_SCOPE.WHOLE &&
    cleaningScope !== CLEANING_SCOPE.ZONES
  ) {
    errors.push({
      code: "invalid_cleaning_scope",
      field: "cleaningScope",
      message: "Некорректный объём уборки",
    });
  }

  const frequency = rawInput.frequency;
  if (typeof frequency !== "string" || !(frequency in config.discountRates)) {
    errors.push({
      code: "invalid_frequency",
      field: "frequency",
      message: "Некорректная частота уборки",
    });
  }

  if (!isPositiveFiniteNumber(rawInput.area)) {
    errors.push({
      code: "invalid_area",
      field: "area",
      message: "Площадь должна быть конечным положительным числом",
    });
  }

  if (!isNonNegativeInteger(rawInput.bathroomCount)) {
    errors.push({
      code: "invalid_bathroom_count",
      field: "bathroomCount",
      message: "Количество санузлов должно быть целым неотрицательным числом",
    });
  }

  const isOffice = propertyType === PROPERTY_TYPE_IDS.OFFICE;

  if (isOffice && !isNonNegativeInteger(rawInput.workplaceCount)) {
    errors.push({
      code: "invalid_workplace_count",
      field: "workplaceCount",
      message: "Количество рабочих мест должно быть целым неотрицательным числом",
    });
  }

  if (isOffice && !isNonNegativeInteger(rawInput.meetingRoomCount)) {
    errors.push({
      code: "invalid_meeting_room_count",
      field: "meetingRoomCount",
      message:
        "Количество переговорных должно быть целым неотрицательным числом",
    });
  }

  if (Array.isArray(rawInput.selectedExtras)) {
    for (const extraId of rawInput.selectedExtras) {
      if (!(extraId in config.extrasCatalog)) {
        errors.push({
          code: "unknown_extra",
          field: "selectedExtras",
          message: `Неизвестная дополнительная услуга: ${String(extraId)}`,
        });
      }
    }
  } else if (rawInput.selectedExtras != null) {
    errors.push({
      code: "invalid_extras",
      field: "selectedExtras",
      message: "Список дополнительных услуг должен быть массивом",
    });
  }

  if (
    cleaningScope === CLEANING_SCOPE.ZONES &&
    propertyType &&
    config.propertyTypes.includes(propertyType)
  ) {
    const hasKitchen =
      propertyType === PROPERTY_TYPE_IDS.OFFICE
        ? Boolean(rawInput.hasKitchen)
        : true;
    const available =
      propertyType === PROPERTY_TYPE_IDS.OFFICE
        ? Object.keys(config.officeZones).filter(
            (id) => hasKitchen || id !== "kitchen"
          )
        : Object.keys(config.residentialZones);
    const availableSet = new Set(available);
    const selected = [
      ...new Set(
        (Array.isArray(rawInput.selectedZones)
          ? rawInput.selectedZones
          : []
        ).filter((id) => availableSet.has(id))
      ),
    ];

    if (selected.length === 0) {
      errors.push({
        code: "empty_zones",
        field: "selectedZones",
        message: "Выберите хотя бы одну зону",
      });
    }
  }

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  /** @type {import('./types.js').CalculatorPricingInput} */
  const typedInput = {
    propertyType: /** @type {import('./types.js').PropertyType} */ (
      propertyType
    ),
    cleaningFormat: /** @type {import('./types.js').CleaningFormat} */ (
      cleaningFormat
    ),
    cleaningScope: /** @type {import('./types.js').CleaningScope} */ (
      cleaningScope
    ),
    area: /** @type {number} */ (rawInput.area),
    bathroomCount: /** @type {number} */ (rawInput.bathroomCount),
    workplaceCount: isOffice
      ? /** @type {number} */ (rawInput.workplaceCount)
      : 0,
    meetingRoomCount: isOffice
      ? /** @type {number} */ (rawInput.meetingRoomCount)
      : 0,
    hasKitchen: isOffice ? Boolean(rawInput.hasKitchen) : true,
    selectedZones: Array.isArray(rawInput.selectedZones)
      ? rawInput.selectedZones
      : [],
    frequency: /** @type {import('./types.js').FrequencyId} */ (frequency),
    selectedExtras: Array.isArray(rawInput.selectedExtras)
      ? rawInput.selectedExtras
      : [],
  };

  return {
    valid: true,
    value: normalizeCalculatorInput(typedInput, config),
  };
}
