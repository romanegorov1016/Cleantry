import {
  CALCULATOR_PREFILL_EVENT,
  CALCULATOR_PREFILL_STORAGE_KEY,
  SECTION_IDS,
} from "@/lib/constants";

/**
 * @typedef {'propertyType' | 'cleaningFormat'} CalculatorPrefillKind
 */

/**
 * @typedef {{
 *   kind: CalculatorPrefillKind,
 *   id: string,
 *   sourceId?: string,
 * }} CalculatorPrefillPayload
 */

/**
 * Normalize a services-card selection into a calculator prefill payload.
 *
 * @param {{
 *   kind?: string,
 *   source?: string,
 *   id?: string,
 *   sourceId?: string,
 * }} selection
 * @returns {CalculatorPrefillPayload | null}
 */
export function mapServiceSelectionToPrefill(selection) {
  if (!selection) {
    return null;
  }

  const kind = selection.kind ?? selection.source;
  const id = selection.sourceId ?? selection.id;

  if (
    (kind !== "propertyType" && kind !== "cleaningFormat") ||
    typeof id !== "string" ||
    id.length === 0
  ) {
    return null;
  }

  return {
    kind,
    id,
    sourceId: id,
  };
}

/**
 * Temporary bridge: remember selection and scroll to the calculator.
 * Full calculator sync lands in a later stage.
 *
 * @param {Parameters<typeof mapServiceSelectionToPrefill>[0]} selection
 */
export function navigateToCalculatorWithSelection(selection) {
  const payload = mapServiceSelectionToPrefill(selection);
  if (!payload || typeof window === "undefined") {
    return payload;
  }

  try {
    window.sessionStorage.setItem(
      CALCULATOR_PREFILL_STORAGE_KEY,
      JSON.stringify(payload)
    );
  } catch {
    // Ignore storage failures in private mode / restricted contexts.
  }

  window.dispatchEvent(
    new CustomEvent(CALCULATOR_PREFILL_EVENT, { detail: payload })
  );

  const calculator = document.getElementById(SECTION_IDS.calculator);
  if (calculator) {
    calculator.scrollIntoView({ behavior: "smooth", block: "start" });
  } else {
    window.location.hash = SECTION_IDS.calculator;
  }

  return payload;
}
