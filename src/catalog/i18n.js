/** @typedef {import('./types.js').LocaleCode} LocaleCode */
/** @typedef {import('./types.js').LocalizedText} LocalizedText */

export const DEFAULT_LOCALE = /** @type {LocaleCode} */ ("ru");

export const SUPPORTED_LOCALES = Object.freeze(
  /** @type {const} */ (["ru", "en"])
);

/**
 * Resolve a localized catalog string.
 * Falls back to Russian, then to the first available value.
 *
 * @param {LocalizedText | string | null | undefined} value
 * @param {LocaleCode} [locale]
 * @returns {string}
 */
export function t(value, locale = DEFAULT_LOCALE) {
  if (value == null) {
    return "";
  }

  if (typeof value === "string") {
    return value;
  }

  const preferred = value[locale];
  if (typeof preferred === "string" && preferred.length > 0) {
    return preferred;
  }

  if (typeof value.ru === "string" && value.ru.length > 0) {
    return value.ru;
  }

  const firstAvailable = Object.values(value).find(
    (entry) => typeof entry === "string" && entry.length > 0
  );

  return firstAvailable ?? "";
}
