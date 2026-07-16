import { createInitialCalculatorState } from "@/lib/calculator/constants";
import { normalizeCalculatorState } from "@/lib/calculator/normalize";

/**
 * @param {import('./schema.js').CalculatorState} state
 * @returns {string}
 */
export function serializeCalculatorState(state) {
  return JSON.stringify(normalizeCalculatorState(state));
}

/**
 * @param {string} payload
 * @returns {import('./schema.js').CalculatorState}
 */
export function deserializeCalculatorState(payload) {
  if (!payload || typeof payload !== "string") {
    return createInitialCalculatorState();
  }

  try {
    const parsed = JSON.parse(payload);
    return normalizeCalculatorState(parsed);
  } catch {
    return createInitialCalculatorState();
  }
}
