import { PREFERRED_CONTACT_METHODS } from "@/lib/cleaningRequest/types";
import { validatePhone } from "@/lib/cleaningRequest/validatePhone";

/**
 * @param {import('./types.js').CleaningRequestFormValues} values
 * @returns {{
 *   valid: boolean,
 *   errors: Record<string, string>,
 * }}
 */
export function validateRequestForm(values) {
  /** @type {Record<string, string>} */
  const errors = {};

  const name = typeof values.name === "string" ? values.name.trim() : "";
  if (!name) {
    errors.name = "Укажите имя";
  } else if (name.length < 2) {
    errors.name = "Имя слишком короткое";
  }

  const phoneResult = validatePhone(values.phone);
  if (!phoneResult.valid) {
    errors.phone = phoneResult.message;
  }

  const method = values.preferredContactMethod;
  const allowed = new Set(PREFERRED_CONTACT_METHODS.map((item) => item.id));
  if (!method || !allowed.has(method)) {
    errors.preferredContactMethod = "Выберите способ связи";
  }

  if (!values.consentAccepted) {
    errors.consentAccepted = "Нужно согласие на обработку данных";
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}
