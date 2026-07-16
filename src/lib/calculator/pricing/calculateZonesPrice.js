import { PROPERTY_TYPE_IDS } from "@/catalog/ids";
import { pricingConfig } from "@/lib/calculator/pricing/pricingConfig";
import { roundCurrencyProduct } from "@/lib/calculator/pricing/roundCurrency";

/**
 * @param {number} count
 * @param {Record<number, number>} multipliers
 * @returns {number}
 */
function resolveCountMultiplier(count, multipliers) {
  if (count <= 0) {
    return multipliers[0] ?? 0;
  }

  const keys = Object.keys(multipliers)
    .map(Number)
    .filter((key) => Number.isFinite(key))
    .sort((a, b) => a - b);

  const maxKey = keys[keys.length - 1] ?? 0;
  if (count >= maxKey) {
    return multipliers[maxKey] ?? 0;
  }

  return multipliers[count] ?? 0;
}

/**
 * @param {import('./types.js').NormalizedCalculatorInput} input
 * @param {string} zoneId
 * @param {import('./types.js').PricingConfig} config
 * @returns {import('./types.js').PriceLineItem | null}
 */
function priceOfficeZone(input, zoneId, config) {
  const zone = config.officeZones[zoneId];
  if (!zone) {
    return null;
  }

  if (zoneId === "workspace") {
    const multiplier = resolveCountMultiplier(
      input.workplaceCount,
      config.officeWorkspaceMultipliers
    );
    return {
      id: zone.id,
      title: zone.title,
      price: roundCurrencyProduct(zone.basePrice, multiplier),
    };
  }

  if (zoneId === "meetingRoom") {
    const multiplier = resolveCountMultiplier(
      input.meetingRoomCount,
      config.officeMeetingRoomMultipliers
    );
    return {
      id: zone.id,
      title: zone.title,
      price: roundCurrencyProduct(zone.basePrice, multiplier),
    };
  }

  return {
    id: zone.id,
    title: zone.title,
    price: zone.price ?? 0,
  };
}

/**
 * @param {import('./types.js').NormalizedCalculatorInput} input
 * @param {import('./types.js').PricingConfig} [config]
 * @returns {{ total: number, items: import('./types.js').PriceLineItem[] }}
 */
export function calculateZonesPrice(input, config = pricingConfig) {
  /** @type {import('./types.js').PriceLineItem[]} */
  const items = [];

  for (const zoneId of input.effectiveZones) {
    if (input.propertyType === PROPERTY_TYPE_IDS.OFFICE) {
      const item = priceOfficeZone(input, zoneId, config);
      if (item) {
        items.push(item);
      }
      continue;
    }

    const zone = config.residentialZones[zoneId];
    if (!zone) {
      continue;
    }

    items.push({
      id: zone.id,
      title: zone.title,
      price: zone.price,
    });
  }

  const total = items.reduce((sum, item) => sum + item.price, 0);

  return { total, items };
}
