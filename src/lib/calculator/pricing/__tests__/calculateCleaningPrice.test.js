import { describe, expect, it } from "vitest";
import {
  CLEANING_FORMAT_IDS,
  EXTRA_OPTION_IDS,
  PROPERTY_TYPE_IDS,
} from "@/catalog/ids";
import { calculateCleaningPrice } from "@/lib/calculator/pricing/calculateCleaningPrice";
import { pricingConfig } from "@/lib/calculator/pricing/pricingConfig";
import { CLEANING_SCOPE } from "@/lib/calculator/pricing/pricingConfig";

/**
 * @param {Partial<import('../types.js').CalculatorPricingInput>} overrides
 */
function input(overrides = {}) {
  return {
    propertyType: PROPERTY_TYPE_IDS.APARTMENT,
    cleaningFormat: CLEANING_FORMAT_IDS.MAINTENANCE,
    cleaningScope: CLEANING_SCOPE.WHOLE,
    area: 65,
    bathroomCount: 1,
    workplaceCount: 0,
    meetingRoomCount: 0,
    hasKitchen: true,
    selectedZones: [],
    frequency: "once",
    selectedExtras: [],
    ...overrides,
  };
}

function expectSuccess(raw) {
  const outcome = calculateCleaningPrice(raw, pricingConfig);
  expect(outcome.success).toBe(true);
  if (!outcome.success) {
    throw new Error("expected success");
  }
  return outcome.result;
}

describe("calculateCleaningPrice table-driven", () => {
  it("A: apartment maintenance whole 65m²", () => {
    const result = expectSuccess(input());

    expect(result).toMatchObject({
      basePrice: 70,
      areaPrice: 78,
      zonesPrice: 110,
      bathroomExtra: 0,
      corePrice: 258,
      discountAmount: 0,
      extrasPrice: 0,
      totalPrice: 258,
      minimumOrderAdjustment: 0,
    });
  });

  it("B: apartment kitchen + hallway", () => {
    const result = expectSuccess(
      input({
        cleaningScope: CLEANING_SCOPE.ZONES,
        selectedZones: ["kitchen", "hallway"],
      })
    );

    expect(result).toMatchObject({
      basePrice: 70,
      areaPrice: 78,
      zonesPrice: 35,
      bathroomExtra: 0,
      totalPrice: 183,
    });
  });

  it("C: B + balcony delta is exactly 20", () => {
    const without = expectSuccess(
      input({
        cleaningScope: CLEANING_SCOPE.ZONES,
        selectedZones: ["kitchen", "hallway"],
      })
    );
    const withBalcony = expectSuccess(
      input({
        cleaningScope: CLEANING_SCOPE.ZONES,
        selectedZones: ["kitchen", "hallway", "balcony"],
      })
    );

    expect(withBalcony.zonesPrice).toBe(55);
    expect(withBalcony.totalPrice).toBe(203);
    expect(withBalcony.totalPrice - without.totalPrice).toBe(20);
  });

  it("D: all zones manually equals whole property", () => {
    const whole = expectSuccess(input());
    const allZones = expectSuccess(
      input({
        cleaningScope: CLEANING_SCOPE.ZONES,
        selectedZones: [
          "kitchen",
          "bathroom",
          "livingRoom",
          "bedroom",
          "hallway",
          "balcony",
        ],
      })
    );

    expect(allZones.totalPrice).toBe(258);
    expect(allZones.basePrice).toBe(whole.basePrice);
    expect(allZones.areaPrice).toBe(whole.areaPrice);
    expect(allZones.zonesPrice).toBe(whole.zonesPrice);
    expect(allZones.bathroomExtra).toBe(whole.bathroomExtra);
    expect(allZones.corePrice).toBe(whole.corePrice);
    expect(allZones.zoneBreakdown).toEqual(whole.zoneBreakdown);
  });

  it("E: house deep weekly + urgent", () => {
    const result = expectSuccess(
      input({
        propertyType: PROPERTY_TYPE_IDS.HOUSE,
        cleaningFormat: CLEANING_FORMAT_IDS.DEEP,
        area: 100,
        bathroomCount: 2,
        frequency: "weekly",
        selectedExtras: [EXTRA_OPTION_IDS.URGENT_CLEANING],
      })
    );

    expect(result).toMatchObject({
      basePrice: 138,
      areaPrice: 207,
      zonesPrice: 110,
      bathroomExtra: 20,
      corePrice: 475,
      discountAmount: 71,
      extrasPrice: 45,
      totalPrice: 449,
    });
  });

  it("F: office maintenance whole", () => {
    const result = expectSuccess(
      input({
        propertyType: PROPERTY_TYPE_IDS.OFFICE,
        area: 80,
        workplaceCount: 4,
        meetingRoomCount: 1,
        hasKitchen: true,
        bathroomCount: 1,
      })
    );

    const byId = Object.fromEntries(
      result.zoneBreakdown.map((item) => [item.id, item.price])
    );

    expect(byId.workspace).toBe(35);
    expect(byId.meetingRoom).toBe(15);
    expect(byId.kitchen).toBe(25);
    expect(byId.bathroom).toBe(25);
    expect(byId.commonArea).toBe(15);
    expect(result).toMatchObject({
      zonesPrice: 115,
      basePrice: 100,
      areaPrice: 112,
      bathroomExtra: 0,
      totalPrice: 327,
    });
  });

  it("G: office without kitchen", () => {
    const result = expectSuccess(
      input({
        propertyType: PROPERTY_TYPE_IDS.OFFICE,
        area: 80,
        workplaceCount: 4,
        meetingRoomCount: 1,
        hasKitchen: false,
        bathroomCount: 1,
      })
    );

    expect(result.zonesPrice).toBe(90);
    expect(result.totalPrice).toBe(302);
    expect(result.zoneBreakdown.some((item) => item.id === "kitchen")).toBe(
      false
    );
  });

  it("H: two meeting rooms round to 23", () => {
    const result = expectSuccess(
      input({
        propertyType: PROPERTY_TYPE_IDS.OFFICE,
        area: 80,
        workplaceCount: 1,
        meetingRoomCount: 2,
        hasKitchen: true,
        cleaningScope: CLEANING_SCOPE.ZONES,
        selectedZones: ["meetingRoom"],
      })
    );

    expect(result.zoneBreakdown[0]?.price).toBe(23);
    expect(Math.round(15 * 1.5)).toBe(23);
  });

  it("I: bathroom extra only when bathroom zone included", () => {
    const without = expectSuccess(
      input({
        cleaningScope: CLEANING_SCOPE.ZONES,
        selectedZones: ["kitchen", "hallway"],
        bathroomCount: 4,
      })
    );
    const withBath = expectSuccess(
      input({
        cleaningScope: CLEANING_SCOPE.ZONES,
        selectedZones: ["kitchen", "hallway", "bathroom"],
        bathroomCount: 4,
      })
    );

    expect(without.bathroomExtra).toBe(0);
    expect(withBath.bathroomExtra).toBe(60);
    expect(withBath.totalPrice - without.totalPrice).toBe(85);
  });

  it.each(["once", "weekly", "biweekly", "monthly"])(
    "J: urgent extra is +45 and outside discount (%s)",
    (frequency) => {
      const base = {
        cleaningScope: CLEANING_SCOPE.WHOLE,
        area: 65,
        bathroomCount: 1,
        frequency,
      };
      const without = expectSuccess(input(base));
      const withUrgent = expectSuccess(
        input({
          ...base,
          selectedExtras: [EXTRA_OPTION_IDS.URGENT_CLEANING],
        })
      );

      expect(withUrgent.totalPrice - without.totalPrice).toBe(45);
      expect(withUrgent.discountAmount).toBe(without.discountAmount);
      expect(withUrgent.extrasPrice).toBe(45);
    }
  );

  it("K: duplicate zones are deduplicated", () => {
    const result = expectSuccess(
      input({
        cleaningScope: CLEANING_SCOPE.ZONES,
        selectedZones: ["kitchen", "kitchen", "hallway"],
      })
    );

    expect(result.zonesPrice).toBe(35);
    expect(result.zoneBreakdown.map((item) => item.id)).toEqual([
      "kitchen",
      "hallway",
    ]);
  });

  it("L: zone order does not affect result", () => {
    const a = expectSuccess(
      input({
        cleaningScope: CLEANING_SCOPE.ZONES,
        selectedZones: ["kitchen", "hallway", "balcony"],
      })
    );
    const b = expectSuccess(
      input({
        cleaningScope: CLEANING_SCOPE.ZONES,
        selectedZones: ["balcony", "kitchen", "hallway"],
      })
    );

    expect(a.totalPrice).toBe(b.totalPrice);
    expect(a.zoneBreakdown).toEqual(b.zoneBreakdown);
  });

  it("M: house post-renovation rounds area without pre-rounding rate", () => {
    const result = expectSuccess(
      input({
        propertyType: PROPERTY_TYPE_IDS.HOUSE,
        cleaningFormat: CLEANING_FORMAT_IDS.POST_RENOVATION,
        area: 100,
      })
    );

    expect(result.basePrice).toBe(184);
    expect(result.areaPrice).toBe(265);
    // Document float trap: raw Math.round(100 * 2.3 * 1.15) === 264 in JS.
    expect(Math.round(100 * 2.3 * 1.15)).toBe(264);
  });

  it.each([
    { area: 0 },
    { area: -50 },
    { area: Number.NaN },
    { area: Number.POSITIVE_INFINITY },
    { bathroomCount: -1 },
    { workplaceCount: 2.5, propertyType: PROPERTY_TYPE_IDS.OFFICE },
  ])("N: rejects invalid input %#", (overrides) => {
    const outcome = calculateCleaningPrice(
      input({
        propertyType: PROPERTY_TYPE_IDS.OFFICE,
        workplaceCount: 1,
        meetingRoomCount: 0,
        hasKitchen: true,
        ...overrides,
      }),
      pricingConfig
    );

    expect(outcome.success).toBe(false);
    if (outcome.success) {
      throw new Error("expected failure");
    }
    expect(outcome.errors.length).toBeGreaterThan(0);
  });

  it("O: does not mutate input", () => {
    const raw = input({
      cleaningScope: CLEANING_SCOPE.ZONES,
      selectedZones: ["kitchen", "hallway"],
      selectedExtras: [EXTRA_OPTION_IDS.ECO_PRODUCTS],
    });
    Object.freeze(raw);
    Object.freeze(raw.selectedZones);
    Object.freeze(raw.selectedExtras);

    const snapshot = structuredClone(raw);
    expectSuccess(raw);
    expect(raw).toEqual(snapshot);
  });

  it("minimumOrderPrice=0 keeps current totals", () => {
    const result = expectSuccess(input());
    expect(result.minimumOrderPrice).toBe(0);
    expect(result.minimumOrderAdjustment).toBe(0);
    expect(result.totalPrice).toBe(258);
  });

  it("discount uses round(core * rate), not core - round(core * (1 - rate))", () => {
    // 10 * 0.15 = 1.5 → 2; 10 * 0.85 = 8.5 → 9; 10 - 9 = 1 (different formulas)
    const corePrice = 10;
    const discountRate = 0.15;
    const discountAmount = Math.round(corePrice * discountRate);
    const wrongAlternate = corePrice - Math.round(corePrice * (1 - discountRate));

    expect(discountAmount).toBe(2);
    expect(wrongAlternate).toBe(1);
    expect(discountAmount).not.toBe(wrongAlternate);

    const result = expectSuccess(
      input({
        propertyType: PROPERTY_TYPE_IDS.HOUSE,
        cleaningFormat: CLEANING_FORMAT_IDS.DEEP,
        area: 100,
        bathroomCount: 2,
        frequency: "weekly",
      })
    );

    expect(result.discountAmount).toBe(Math.round(result.corePrice * 0.15));
  });
});