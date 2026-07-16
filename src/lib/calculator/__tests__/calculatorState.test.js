import { describe, expect, it } from "vitest";
import {
  CLEANING_FORMAT_IDS,
  EXTRA_OPTION_IDS,
  PROPERTY_TYPE_IDS,
} from "@/catalog/ids";
import {
  applyCalculatorPatch,
  CLEANING_SCOPE,
  createInitialCalculatorState,
  getAreaDefaultsForProperty,
  getCalculatorCompletion,
  getMobileSummaryModel,
  normalizeCalculatorState,
  serializeCalculatorState,
  deserializeCalculatorState,
  setCleaningFormat,
  setCleaningScope,
  setPropertyType,
  toPricingInput,
  toggleExtra,
  toggleZone,
  validateCalculatorState,
} from "@/lib/calculator";
import { calculateCleaningPrice } from "@/lib/calculateCleaningPrice";

describe("calculator state transitions", () => {
  it("allows house area up to 700 m²", () => {
    expect(getAreaDefaultsForProperty(PROPERTY_TYPE_IDS.HOUSE).maxArea).toBe(
      700
    );
    expect(
      getAreaDefaultsForProperty(PROPERTY_TYPE_IDS.APARTMENT).maxArea
    ).toBe(300);

    const house = normalizeCalculatorState({
      propertyType: PROPERTY_TYPE_IDS.HOUSE,
      area: 700,
    });
    expect(house.area).toBe(700);
    expect(validateCalculatorState(house).valid).toBe(true);

    const overLimit = normalizeCalculatorState({
      propertyType: PROPERTY_TYPE_IDS.HOUSE,
      area: 701,
    });
    expect(overLimit.area).toBe(700);
  });

  it("keeps compatible values when switching apartment → house", () => {
    const start = normalizeCalculatorState({
      propertyType: PROPERTY_TYPE_IDS.APARTMENT,
      cleaningFormat: CLEANING_FORMAT_IDS.DEEP,
      cleaningScope: CLEANING_SCOPE.ZONES,
      area: 80,
      rooms: "3",
      bathrooms: "2",
      selectedZones: ["kitchen", "bathroom", "balcony"],
      selectedExtras: [EXTRA_OPTION_IDS.ECO_PRODUCTS, EXTRA_OPTION_IDS.PET_HAIR],
      frequency: "weekly",
      comment: "акцент на кухне",
    });

    const next = setPropertyType(start, PROPERTY_TYPE_IDS.HOUSE);

    expect(next.propertyType).toBe(PROPERTY_TYPE_IDS.HOUSE);
    expect(next.cleaningFormat).toBe(CLEANING_FORMAT_IDS.DEEP);
    expect(next.cleaningScope).toBe(CLEANING_SCOPE.ZONES);
    expect(next.area).toBe(80);
    expect(next.rooms).toBe("3");
    expect(next.bathrooms).toBe("2");
    expect(next.selectedZones).toEqual(["kitchen", "bathroom", "balcony"]);
    expect(next.selectedExtras).toEqual([
      EXTRA_OPTION_IDS.ECO_PRODUCTS,
      EXTRA_OPTION_IDS.PET_HAIR,
    ]);
    expect(next.frequency).toBe("weekly");
    expect(next.comment).toBe("акцент на кухне");
    expect(next.officeDetails).toBeNull();
  });

  it("clears incompatible extras/zones and preserves rooms through office round-trip", () => {
    const start = normalizeCalculatorState({
      propertyType: PROPERTY_TYPE_IDS.APARTMENT,
      cleaningFormat: CLEANING_FORMAT_IDS.MAINTENANCE,
      cleaningScope: CLEANING_SCOPE.ZONES,
      area: 65,
      rooms: "4",
      selectedZones: ["kitchen", "bedroom", "balcony"],
      selectedExtras: [
        EXTRA_OPTION_IDS.ECO_PRODUCTS,
        EXTRA_OPTION_IDS.FRIDGE_INSIDE,
        EXTRA_OPTION_IDS.PET_HAIR,
      ],
    });

    const office = setPropertyType(start, PROPERTY_TYPE_IDS.OFFICE);

    expect(office.propertyType).toBe(PROPERTY_TYPE_IDS.OFFICE);
    expect(office.selectedExtras).toEqual([EXTRA_OPTION_IDS.ECO_PRODUCTS]);
    expect(office.selectedZones).toEqual(["kitchen"]);
    expect(office.officeDetails).not.toBeNull();
    expect(office.rooms).toBe("4");

    const back = setPropertyType(office, PROPERTY_TYPE_IDS.APARTMENT);
    expect(back.rooms).toBe("4");
    expect(back.officeDetails).toBeNull();
  });

  it("allows emptying all zones and validates on submit", () => {
    const start = normalizeCalculatorState({
      cleaningScope: CLEANING_SCOPE.ZONES,
      selectedZones: ["kitchen"],
    });

    const emptied = toggleZone(start, "kitchen");
    expect(emptied.selectedZones).toEqual([]);

    const validation = validateCalculatorState(emptied);
    expect(validation.valid).toBe(false);
    expect(validation.errors.selectedZones).toBeTruthy();
  });

  it("switches whole property → selected zones without wiping details", () => {
    const start = normalizeCalculatorState({
      propertyType: PROPERTY_TYPE_IDS.APARTMENT,
      cleaningScope: CLEANING_SCOPE.WHOLE,
      area: 72,
      rooms: "3",
      bathrooms: "2",
      selectedZones: ["kitchen", "bathroom"],
    });

    const next = setCleaningScope(start, CLEANING_SCOPE.ZONES);

    expect(next.cleaningScope).toBe(CLEANING_SCOPE.ZONES);
    expect(next.area).toBe(72);
    expect(next.rooms).toBe("3");
    expect(next.bathrooms).toBe("2");
    expect(next.selectedZones).toEqual(["kitchen", "bathroom"]);
  });

  it("keeps property type and filters extras when cleaning format changes", () => {
    const start = normalizeCalculatorState({
      propertyType: PROPERTY_TYPE_IDS.APARTMENT,
      cleaningFormat: CLEANING_FORMAT_IDS.MAINTENANCE,
      selectedExtras: [
        EXTRA_OPTION_IDS.ECO_PRODUCTS,
        EXTRA_OPTION_IDS.WINDOW_CLEANING,
      ],
    });

    const next = setCleaningFormat(start, CLEANING_FORMAT_IDS.POST_RENOVATION);

    expect(next.propertyType).toBe(PROPERTY_TYPE_IDS.APARTMENT);
    expect(next.cleaningFormat).toBe(CLEANING_FORMAT_IDS.POST_RENOVATION);
    expect(next.selectedExtras).toEqual([
      EXTRA_OPTION_IDS.ECO_PRODUCTS,
      EXTRA_OPTION_IDS.WINDOW_CLEANING,
    ]);
  });

  it("clears incompatible addons and keeps compatible ones", () => {
    const start = normalizeCalculatorState({
      propertyType: PROPERTY_TYPE_IDS.OFFICE,
      cleaningFormat: CLEANING_FORMAT_IDS.MAINTENANCE,
      selectedExtras: [EXTRA_OPTION_IDS.ECO_PRODUCTS],
    });

    const withInvalid = normalizeCalculatorState({
      ...start,
      selectedExtras: [
        EXTRA_OPTION_IDS.ECO_PRODUCTS,
        EXTRA_OPTION_IDS.OVEN_INSIDE,
      ],
    });

    expect(withInvalid.selectedExtras).toEqual([EXTRA_OPTION_IDS.ECO_PRODUCTS]);

    const toggled = toggleExtra(start, EXTRA_OPTION_IDS.URGENT_CLEANING);
    expect(toggled.selectedExtras).toEqual([
      EXTRA_OPTION_IDS.ECO_PRODUCTS,
      EXTRA_OPTION_IDS.URGENT_CLEANING,
    ]);
  });

  it("syncs kitchen zone with office hasKitchen flag", () => {
    const start = normalizeCalculatorState({
      propertyType: PROPERTY_TYPE_IDS.OFFICE,
      cleaningScope: CLEANING_SCOPE.ZONES,
      selectedZones: ["workspace", "kitchen"],
      officeDetails: {
        workspaces: "3",
        meetingRooms: "1",
        hasKitchen: true,
      },
    });

    const withoutKitchen = applyCalculatorPatch(start, {
      officeDetails: { hasKitchen: false },
    });

    expect(withoutKitchen.selectedZones).not.toContain("kitchen");
    expect(withoutKitchen.officeDetails?.hasKitchen).toBe(false);

    const withZone = toggleZone(withoutKitchen, "kitchen");
    expect(withZone.selectedZones).toContain("kitchen");
    expect(withZone.officeDetails?.hasKitchen).toBe(true);
  });

  it("preserves serializable state round-trip", () => {
    const state = normalizeCalculatorState({
      propertyType: PROPERTY_TYPE_IDS.HOUSE,
      cleaningFormat: CLEANING_FORMAT_IDS.DEEP,
      cleaningScope: CLEANING_SCOPE.ZONES,
      selectedZones: ["kitchen", "hallway"],
    });

    const restored = deserializeCalculatorState(serializeCalculatorState(state));
    expect(restored).toEqual(state);
  });
});

describe("pricing model", () => {
  it("includes all available zones for whole-property scope", () => {
    const pricing = toPricingInput({
      cleaningScope: CLEANING_SCOPE.WHOLE,
      propertyType: PROPERTY_TYPE_IDS.APARTMENT,
    });

    expect(pricing.effectiveZones.length).toBeGreaterThan(0);
    expect(pricing.includeBasePrice).toBe(true);
    expect(pricing.areaPriceFactor).toBe(1);
    expect(pricing.includeBathroomAdjustment).toBe(true);
    expect(pricing.pricedAsWhole).toBe(true);
  });

  it("uses only selected zones in zones scope", () => {
    const pricing = toPricingInput({
      cleaningScope: CLEANING_SCOPE.ZONES,
      selectedZones: ["kitchen", "hallway"],
    });

    expect(pricing.effectiveZones).toEqual(["kitchen", "hallway"]);
    expect(pricing.includeBasePrice).toBe(true);
    expect(pricing.areaPriceFactor).toBe(1);
    expect(pricing.includeBathroomAdjustment).toBe(false);
    expect(pricing.pricedAsWhole).toBe(false);
  });

  it("prices all selected zones the same as whole property", () => {
    const shared = {
      propertyType: PROPERTY_TYPE_IDS.APARTMENT,
      cleaningFormat: CLEANING_FORMAT_IDS.MAINTENANCE,
      area: 75,
      bathrooms: "1",
      frequency: "once",
      selectedExtras: [],
    };

    const whole = calculateCleaningPrice({
      ...shared,
      cleaningScope: CLEANING_SCOPE.WHOLE,
    });

    const allZonesState = {
      ...shared,
      cleaningScope: CLEANING_SCOPE.ZONES,
      selectedZones: [
        "kitchen",
        "bathroom",
        "livingRoom",
        "bedroom",
        "hallway",
        "balcony",
      ],
    };

    const allZones = calculateCleaningPrice(allZonesState);

    expect(toPricingInput(allZonesState).pricedAsWhole).toBe(true);
    expect(allZones.total).toBe(whole.total);
  });

  it("changes total by exactly the zone card price when toggling a zone", () => {
    const baseState = normalizeCalculatorState({
      propertyType: PROPERTY_TYPE_IDS.APARTMENT,
      cleaningFormat: CLEANING_FORMAT_IDS.MAINTENANCE,
      cleaningScope: CLEANING_SCOPE.ZONES,
      area: 75,
      bathrooms: "1",
      frequency: "once",
      selectedExtras: [],
      selectedZones: ["kitchen", "hallway"],
    });

    const withoutBalcony = calculateCleaningPrice(baseState);
    const withBalcony = calculateCleaningPrice({
      ...baseState,
      selectedZones: [...baseState.selectedZones, "balcony"],
    });

    expect(withBalcony.total - withoutBalcony.total).toBe(20);
  });

  it("applies frequency discount to cleaning core only, not extras", () => {
    const state = normalizeCalculatorState({
      cleaningScope: CLEANING_SCOPE.WHOLE,
      frequency: "weekly",
      selectedExtras: [EXTRA_OPTION_IDS.URGENT_CLEANING],
    });

    const price = calculateCleaningPrice(state);
    const withoutExtra = calculateCleaningPrice({
      ...state,
      selectedExtras: [],
    });

    expect(price.breakdown.extrasPrice).toBe(45);
    expect(price.total).toBe(withoutExtra.total + 45);
    expect(price.discount).toBe(withoutExtra.discount);
  });

  it("uses scaled office zones for whole office cleaning", () => {
    const pricing = toPricingInput({
      propertyType: PROPERTY_TYPE_IDS.OFFICE,
      cleaningScope: CLEANING_SCOPE.WHOLE,
      officeDetails: {
        workspaces: "4",
        meetingRooms: "1",
        hasKitchen: true,
      },
    });

    expect(pricing.effectiveZones).toContain("workspace");
    expect(pricing.zoneLineItems.some((item) => item.price > 0)).toBe(true);
    expect(pricing.officeComposition).toBe(0);
  });
});

describe("validation and mobile summary model", () => {
  it("marks empty zones invalid in zones mode", () => {
    const result = validateCalculatorState({
      cleaningScope: CLEANING_SCOPE.ZONES,
      selectedZones: [],
    });

    expect(result.normalized.selectedZones).toEqual([]);
    expect(result.valid).toBe(false);
    expect(result.errors.selectedZones).toBeTruthy();
  });

  it("builds mobile summary model from readiness and price", () => {
    const completion = getCalculatorCompletion(createInitialCalculatorState());
    const model = getMobileSummaryModel({
      total: 150,
      currency: "BYN",
      isReady: completion.isReady,
    });

    expect(model.totalLabel).toBe("от 150 BYN");
    expect(model.ctaDisabled).toBe(false);
    expect(model.action).toBe("submit");
    expect(model.ctaLabel).toBe("Получить точный расчёт");
  });

  it("marks zones block incomplete when empty", () => {
    const zones = getCalculatorCompletion({
      cleaningScope: CLEANING_SCOPE.ZONES,
      selectedZones: [],
    });

    expect(zones.blocks.find((block) => block.id === "zones")?.complete).toBe(
      false
    );
    expect(zones.isReady).toBe(false);
  });
});
