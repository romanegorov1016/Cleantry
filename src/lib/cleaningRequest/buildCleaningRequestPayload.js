import { isOfficeProperty } from "@/catalog/selectors";
import { calculateCleaningPrice } from "@/lib/calculateCleaningPrice";
import { CLEANING_SCOPE } from "@/lib/calculator/constants";

/**
 * @param {{
 *   calculatorState: import('@/lib/calculator/schema.js').CalculatorState,
 *   price?: ReturnType<typeof calculateCleaningPrice> | null,
 *   sourceUrl?: string,
 *   preset?: object | null,
 * }} args
 * @returns {import('./types.js').CleaningRequestSnapshot}
 */
export function buildCleaningRequestSnapshot({
  calculatorState,
  price = null,
  sourceUrl = "",
  preset = null,
}) {
  const computed = price ?? calculateCleaningPrice(calculatorState);
  const isOffice = isOfficeProperty(calculatorState.propertyType);

  const estimatedTotal = computed.success ? computed.total : null;
  const currency = computed.currency ?? "BYN";
  const rangeLabel =
    estimatedTotal == null
      ? "стоимость уточняется"
      : `от ${estimatedTotal} ${currency}`;

  const pricingWarnings = computed.success
    ? []
    : (computed.errors ?? []).map((error) => ({
        code: error.code ?? "pricing_error",
        message: error.message ?? "Ошибка расчёта",
        field: error.field,
      }));

  const selectedZones =
    calculatorState.cleaningScope === CLEANING_SCOPE.WHOLE
      ? ["__whole__"]
      : [...(calculatorState.selectedZones ?? [])];

  return {
    propertyType: calculatorState.propertyType,
    cleaningFormat: calculatorState.cleaningFormat,
    area: calculatorState.area,
    rooms: isOffice ? null : calculatorState.rooms,
    bathrooms: calculatorState.bathrooms,
    cleaningScope: calculatorState.cleaningScope,
    selectedZones,
    frequency: calculatorState.frequency,
    selectedExtras: [...(calculatorState.selectedExtras ?? [])],
    officeDetails: calculatorState.officeDetails
      ? { ...calculatorState.officeDetails }
      : null,
    price: {
      currency,
      estimatedTotal,
      rangeLabel,
      success: Boolean(computed.success),
    },
    pricingWarnings,
    sourceUrl: sourceUrl || "",
    preset: preset ?? null,
  };
}

/**
 * @param {{
 *   formValues: import('./types.js').CleaningRequestFormValues,
 *   snapshot: import('./types.js').CleaningRequestSnapshot,
 *   submittedAt?: string,
 * }} args
 * @returns {import('./types.js').CleaningRequestPayload}
 */
export function buildCleaningRequestPayload({
  formValues,
  snapshot,
  submittedAt = new Date().toISOString(),
}) {
  return {
    contact: {
      name: formValues.name.trim(),
      phone: formValues.phone.trim(),
      preferredContactMethod:
        /** @type {import('./types.js').PreferredContactMethod} */ (
          formValues.preferredContactMethod
        ),
      preferredDate: formValues.preferredDate.trim(),
      preferredTime: formValues.preferredTime.trim(),
      comment: formValues.comment.trim(),
    },
    consentAccepted: true,
    snapshot,
    submittedAt,
  };
}
