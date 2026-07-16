/**
 * Soft phone validation for BY / international numbers.
 * Accepts spaces, dashes, parentheses; requires enough digits.
 *
 * @param {unknown} value
 * @returns {{ valid: true, normalized: string } | { valid: false, message: string }}
 */
export function validatePhone(value) {
  const raw = typeof value === "string" ? value.trim() : "";

  if (!raw) {
    return {
      valid: false,
      message: "Укажите номер телефона",
    };
  }

  const digits = raw.replace(/\D/g, "");

  if (digits.length < 9) {
    return {
      valid: false,
      message: "Кажется, в номере не хватает цифр",
    };
  }

  if (digits.length > 15) {
    return {
      valid: false,
      message: "Номер слишком длинный — проверьте ввод",
    };
  }

  // Reject obviously fake sequences used in demos / typos.
  if (/^(\d)\1+$/.test(digits)) {
    return {
      valid: false,
      message: "Проверьте номер телефона",
    };
  }

  return {
    valid: true,
    normalized: raw,
  };
}
