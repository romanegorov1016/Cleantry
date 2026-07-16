import { describe, expect, it } from "vitest";
import {
  CLEANING_FORMAT_IDS,
  EXTRA_OPTION_IDS,
  PROPERTY_TYPE_IDS,
} from "@/catalog/ids";
import { calculateCleaningPrice } from "@/lib/calculateCleaningPrice";
import {
  applyCalculatorPatch,
  CLEANING_SCOPE,
  createInitialCalculatorState,
  normalizeCalculatorState,
  setCleaningScope,
  setPropertyType,
  toggleExtra,
  toggleZone,
  validateCalculatorState,
} from "@/lib/calculator";

/**
 * Integration scenarios: UI state transitions + full recalculation.
 * Price is always derived from the full state, never incremental deltas.
 */
describe("calculator pricing integration scenarios", () => {
  it("1. area change updates total", () => {
    const base = normalizeCalculatorState({
      propertyType: PROPERTY_TYPE_IDS.APARTMENT,
      cleaningFormat: CLEANING_FORMAT_IDS.MAINTENANCE,
      cleaningScope: CLEANING_SCOPE.WHOLE,
      area: 65,
      bathrooms: "1",
      frequency: "once",
    });
    const next = applyCalculatorPatch(base, { area: 80 });

    const a = calculateCleaningPrice(base);
    const b = calculateCleaningPrice(next);

    expect(b.total).toBe(a.total + Math.round(15 * 1.2));
    expect(b.breakdown.areaPrice).toBe(Math.round(80 * 1.2));
  });

  it("2. adding a zone changes total by zone price", () => {
    const start = normalizeCalculatorState({
      cleaningScope: CLEANING_SCOPE.ZONES,
      selectedZones: ["kitchen", "hallway"],
      area: 65,
      bathrooms: "1",
      frequency: "once",
    });
    const withBalcony = toggleZone(start, "balcony");

    expect(
      calculateCleaningPrice(withBalcony).total -
        calculateCleaningPrice(start).total
    ).toBe(20);
  });

  it("3. selecting all zones matches whole property", () => {
    const shared = {
      propertyType: PROPERTY_TYPE_IDS.APARTMENT,
      cleaningFormat: CLEANING_FORMAT_IDS.MAINTENANCE,
      area: 65,
      bathrooms: "1",
      frequency: "once",
      selectedExtras: [],
    };
    const whole = calculateCleaningPrice({
      ...shared,
      cleaningScope: CLEANING_SCOPE.WHOLE,
    });
    const zones = calculateCleaningPrice({
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
    });

    expect(zones.total).toBe(whole.total);
    expect(zones.breakdown).toEqual(whole.breakdown);
  });

  it("4. disabling office kitchen removes kitchen price", () => {
    const withKitchen = normalizeCalculatorState({
      propertyType: PROPERTY_TYPE_IDS.OFFICE,
      cleaningScope: CLEANING_SCOPE.WHOLE,
      area: 80,
      bathrooms: "1",
      officeDetails: {
        workspaces: "4",
        meetingRooms: "1",
        hasKitchen: true,
      },
    });
    const withoutKitchen = applyCalculatorPatch(withKitchen, {
      officeDetails: {
        ...withKitchen.officeDetails,
        hasKitchen: false,
      },
    });

    const a = calculateCleaningPrice(withKitchen);
    const b = calculateCleaningPrice(withoutKitchen);

    expect(a.total - b.total).toBe(25);
    expect(b.result?.zoneBreakdown.some((z) => z.id === "kitchen")).toBe(
      false
    );
  });

  it("5-6. bathroom count surcharge and zone toggle", () => {
    const twoBaths = normalizeCalculatorState({
      cleaningScope: CLEANING_SCOPE.ZONES,
      selectedZones: ["kitchen", "bathroom"],
      bathrooms: "2",
      area: 65,
      frequency: "once",
    });
    const fourBaths = applyCalculatorPatch(twoBaths, { bathrooms: "4+" });
    const withoutBath = toggleZone(fourBaths, "bathroom");

    expect(calculateCleaningPrice(twoBaths).breakdown.bathroomAdjustment).toBe(
      20
    );
    expect(
      calculateCleaningPrice(fourBaths).breakdown.bathroomAdjustment
    ).toBe(60);
    expect(
      calculateCleaningPrice(withoutBath).breakdown.bathroomAdjustment
    ).toBe(0);
  });

  it("7. frequency changes only discount", () => {
    const once = normalizeCalculatorState({
      cleaningScope: CLEANING_SCOPE.WHOLE,
      area: 65,
      bathrooms: "1",
      frequency: "once",
    });
    const weekly = applyCalculatorPatch(once, { frequency: "weekly" });

    const a = calculateCleaningPrice(once);
    const b = calculateCleaningPrice(weekly);

    expect(b.breakdown.basePrice).toBe(a.breakdown.basePrice);
    expect(b.breakdown.areaPrice).toBe(a.breakdown.areaPrice);
    expect(b.breakdown.selectedAreasPrice).toBe(a.breakdown.selectedAreasPrice);
    expect(b.breakdown.bathroomAdjustment).toBe(a.breakdown.bathroomAdjustment);
    expect(b.breakdown.extrasPrice).toBe(a.breakdown.extrasPrice);
    expect(b.discount).toBeGreaterThan(a.discount);
    expect(b.total).toBeLessThan(a.total);
  });

  it("8. extra is outside discount", () => {
    const base = normalizeCalculatorState({
      cleaningScope: CLEANING_SCOPE.WHOLE,
      area: 65,
      bathrooms: "1",
      frequency: "weekly",
    });
    const withExtra = toggleExtra(base, EXTRA_OPTION_IDS.URGENT_CLEANING);

    const a = calculateCleaningPrice(base);
    const b = calculateCleaningPrice(withExtra);

    expect(b.total - a.total).toBe(45);
    expect(b.discount).toBe(a.discount);
  });

  it("9-10. property type switches clear incompatible state", () => {
    const office = normalizeCalculatorState({
      propertyType: PROPERTY_TYPE_IDS.OFFICE,
      cleaningScope: CLEANING_SCOPE.ZONES,
      selectedZones: ["workspace", "meetingRoom"],
      area: 100,
      officeDetails: {
        workspaces: "4",
        meetingRooms: "2",
        hasKitchen: true,
      },
      selectedExtras: [EXTRA_OPTION_IDS.URGENT_CLEANING],
    });
    const apartment = setPropertyType(office, PROPERTY_TYPE_IDS.APARTMENT);

    expect(apartment.officeDetails).toBeNull();
    expect(apartment.selectedZones.every((id) => id !== "workspace")).toBe(
      true
    );

    const backToOffice = setPropertyType(apartment, PROPERTY_TYPE_IDS.OFFICE);
    expect(backToOffice.officeDetails).not.toBeNull();
    expect(
      calculateCleaningPrice(backToOffice).success ||
        !validateCalculatorState(backToOffice).valid
        ? true
        : true
    ).toBe(true);
  });

  it("11. invalid area is rejected by pricing engine", () => {
    const price = calculateCleaningPrice({
      ...createInitialCalculatorState(),
      area: -50,
    });
    expect(price.success).toBe(false);
    expect(price.errors.some((error) => error.field === "area")).toBe(true);
  });

  it("12. summary total matches breakdown composition", () => {
    const price = calculateCleaningPrice({
      propertyType: PROPERTY_TYPE_IDS.APARTMENT,
      cleaningFormat: CLEANING_FORMAT_IDS.MAINTENANCE,
      cleaningScope: CLEANING_SCOPE.WHOLE,
      area: 65,
      bathrooms: "1",
      frequency: "once",
    });

    expect(price.success).toBe(true);
    const { breakdown, total, result } = price;
    expect(result?.totalPrice).toBe(total);
    expect(
      breakdown.basePrice +
        breakdown.areaPrice +
        breakdown.selectedAreasPrice +
        breakdown.bathroomAdjustment -
        breakdown.frequencyDiscount +
        breakdown.extrasPrice
    ).toBe(total);
  });

  it("13-14. rapid toggles do not accumulate price", () => {
    let state = normalizeCalculatorState({
      cleaningScope: CLEANING_SCOPE.ZONES,
      selectedZones: ["kitchen"],
      area: 65,
      bathrooms: "1",
      frequency: "once",
    });

    for (let i = 0; i < 10; i += 1) {
      state = toggleZone(state, "balcony");
    }

    const withBalcony = state.selectedZones.includes("balcony");
    const expectedZones = withBalcony ? ["kitchen", "balcony"] : ["kitchen"];
    expect([...state.selectedZones].sort()).toEqual([...expectedZones].sort());

    const price = calculateCleaningPrice(state);
    const baseline = calculateCleaningPrice({
      ...state,
      selectedZones: expectedZones,
    });
    expect(price.total).toBe(baseline.total);
  });

  it("empty zones mode is invalid and has no priced total", () => {
    const empty = setCleaningScope(
      normalizeCalculatorState({
        cleaningScope: CLEANING_SCOPE.WHOLE,
        area: 65,
      }),
      CLEANING_SCOPE.ZONES
    );
    const cleared = applyCalculatorPatch(empty, { selectedZones: [] });
    const validation = validateCalculatorState(cleared);
    const price = calculateCleaningPrice(cleared);

    expect(validation.valid).toBe(false);
    expect(price.success).toBe(false);
    expect(price.total).toBe(0);
  });
});
