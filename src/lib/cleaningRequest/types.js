/**
 * Cleaning request form & submit flow.
 */

/** @typedef {'idle' | 'submitting' | 'success' | 'error'} RequestSubmitStatus */

/** @typedef {'phone' | 'telegram' | 'whatsapp'} PreferredContactMethod */

/**
 * @typedef {{
 *   name: string,
 *   phone: string,
 *   preferredContactMethod: PreferredContactMethod | '',
 *   preferredDate: string,
 *   preferredTime: string,
 *   comment: string,
 *   consentAccepted: boolean,
 * }} CleaningRequestFormValues
 */

/**
 * @typedef {{
 *   propertyType: string,
 *   cleaningFormat: string,
 *   area: number,
 *   rooms: string | null,
 *   bathrooms: string,
 *   cleaningScope: string,
 *   selectedZones: string[],
 *   frequency: string,
 *   selectedExtras: string[],
 *   officeDetails: object | null,
 *   price: {
 *     currency: string,
 *     estimatedTotal: number | null,
 *     rangeLabel: string,
 *     success: boolean,
 *   },
 *   pricingWarnings: Array<{ code: string, message: string, field?: string }>,
 *   sourceUrl: string,
 *   preset: object | null,
 * }} CleaningRequestSnapshot
 */

/**
 * @typedef {{
 *   contact: {
 *     name: string,
 *     phone: string,
 *     preferredContactMethod: PreferredContactMethod,
 *     preferredDate: string,
 *     preferredTime: string,
 *     comment: string,
 *   },
 *   consentAccepted: true,
 *   snapshot: CleaningRequestSnapshot,
 *   submittedAt: string,
 * }} CleaningRequestPayload
 */

/**
 * @typedef {{
 *   ok: true,
 *   requestId: string,
 * } | {
 *   ok: false,
 *   error: { code: string, message: string },
 * }} CleaningRequestSubmitResult
 */

export const PREFERRED_CONTACT_METHODS = Object.freeze([
  Object.freeze({ id: "phone", label: "Звонок" }),
  Object.freeze({ id: "telegram", label: "Telegram" }),
  Object.freeze({ id: "whatsapp", label: "WhatsApp" }),
]);

export const REQUEST_SUBMIT_STATUS = Object.freeze({
  IDLE: "idle",
  SUBMITTING: "submitting",
  SUCCESS: "success",
  ERROR: "error",
});

/**
 * @returns {CleaningRequestFormValues}
 */
export function createEmptyRequestFormValues() {
  return {
    name: "",
    phone: "",
    preferredContactMethod: "",
    preferredDate: "",
    preferredTime: "",
    comment: "",
    consentAccepted: false,
  };
}
