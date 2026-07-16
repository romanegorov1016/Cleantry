/**
 * Currency rounding helpers.
 *
 * IEEE754 can turn exact decimals (e.g. 2.3 × 1.15 = 2.645) into
 * 2.644999…, so `Math.round(100 * 2.3 * 1.15)` becomes 264 instead of 265.
 * Normalize the product to a stable decimal before `Math.round`.
 *
 * @param {number} value
 * @returns {number}
 */
export function roundCurrency(value) {
  if (!Number.isFinite(value)) {
    return 0;
  }

  return Math.round(Number(value.toFixed(8)));
}

/**
 * @param {...number} factors
 * @returns {number}
 */
export function roundCurrencyProduct(...factors) {
  const product = factors.reduce((acc, factor) => acc * factor, 1);
  return roundCurrency(product);
}
