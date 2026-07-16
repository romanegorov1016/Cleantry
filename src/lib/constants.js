import {
  CALCULATOR_PREFILL_EVENT,
  CALCULATOR_PREFILL_STORAGE_KEY,
} from "./prefillKeys";

export const SECTION_IDS = {
  hero: "hero",
  trust: "trust",
  services: "services",
  results: "results",
  process: "process",
  pricing: "pricing",
  calculator: "calculator",
  testimonials: "testimonials",
  why: "why",
  /** @deprecated Prefer SECTION_IDS.why — kept for old #about links. */
  about: "why",
  faq: "faq",
  contact: "contact",
};

export { CALCULATOR_PREFILL_STORAGE_KEY, CALCULATOR_PREFILL_EVENT };

export const BUTTON_VARIANTS = {
  primary: "primary",
  secondary: "secondary",
  outline: "outline",
};

export const SECTION_PADDING = "py-20 sm:py-28";

/** Sticky header offset for in-page anchors. */
export const SECTION_SCROLL_MARGIN = "scroll-mt-24";
