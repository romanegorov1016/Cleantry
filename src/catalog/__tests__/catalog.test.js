import { describe, expect, it } from "vitest";
import {
  CLEANING_FORMAT_IDS,
  EXTRA_OPTION_IDS,
  PROPERTY_TYPE_IDS,
  assertCatalogIdentityIntegrity,
  findDuplicateIds,
  getAvailableCleaningFormats,
  getAvailableExtras,
  inspectCatalogIds,
  isExtraCompatible,
  isPropertyFormatCompatible,
  validateSelection,
} from "@/catalog";

describe("catalog identifiers", () => {
  it("uses the expected property type, format and extra ids", () => {
    const report = inspectCatalogIds();

    expect(report.propertyTypeIds.sort()).toEqual(
      Object.values(PROPERTY_TYPE_IDS).sort()
    );
    expect(report.cleaningFormatIds.sort()).toEqual(
      Object.values(CLEANING_FORMAT_IDS).sort()
    );
    expect(report.extraOptionIds.sort()).toEqual(
      Object.values(EXTRA_OPTION_IDS).sort()
    );
    expect(report.missingExpectedIds).toEqual([]);
    expect(report.unexpectedIds).toEqual([]);
    expect(assertCatalogIdentityIntegrity()).toBe(true);
  });

  it("does not allow duplicate ids across the catalog", () => {
    const report = inspectCatalogIds();

    expect(report.duplicateIds).toEqual([]);
    expect(
      findDuplicateIds([
        ...report.propertyTypeIds,
        ...report.cleaningFormatIds,
        ...report.extraOptionIds,
      ])
    ).toEqual([]);
  });
});

describe("compatibility rules", () => {
  it("marks residential appliance extras incompatible with office", () => {
    expect(
      isExtraCompatible(
        PROPERTY_TYPE_IDS.OFFICE,
        CLEANING_FORMAT_IDS.MAINTENANCE,
        EXTRA_OPTION_IDS.FRIDGE_INSIDE
      )
    ).toBe(false);

    expect(
      isExtraCompatible(
        PROPERTY_TYPE_IDS.OFFICE,
        CLEANING_FORMAT_IDS.DEEP,
        EXTRA_OPTION_IDS.PET_HAIR
      )
    ).toBe(false);

    expect(
      isExtraCompatible(
        PROPERTY_TYPE_IDS.APARTMENT,
        CLEANING_FORMAT_IDS.MAINTENANCE,
        EXTRA_OPTION_IDS.FRIDGE_INSIDE
      )
    ).toBe(true);
  });

  it("keeps eco products as a compatible extra for all property types", () => {
    for (const propertyTypeId of Object.values(PROPERTY_TYPE_IDS)) {
      expect(
        isExtraCompatible(
          propertyTypeId,
          CLEANING_FORMAT_IDS.MAINTENANCE,
          EXTRA_OPTION_IDS.ECO_PRODUCTS
        )
      ).toBe(true);
    }
  });

  it("validates full selections and reports invalid extras", () => {
    const valid = validateSelection({
      propertyTypeId: PROPERTY_TYPE_IDS.HOUSE,
      cleaningFormatId: CLEANING_FORMAT_IDS.POST_RENOVATION,
      extraOptionIds: [
        EXTRA_OPTION_IDS.ECO_PRODUCTS,
        EXTRA_OPTION_IDS.HEAVY_DIRT,
      ],
    });

    expect(valid.valid).toBe(true);
    expect(valid.invalidExtras).toEqual([]);

    const invalid = validateSelection({
      propertyTypeId: PROPERTY_TYPE_IDS.OFFICE,
      cleaningFormatId: CLEANING_FORMAT_IDS.MAINTENANCE,
      extraOptionIds: [
        EXTRA_OPTION_IDS.ECO_PRODUCTS,
        EXTRA_OPTION_IDS.OVEN_INSIDE,
      ],
    });

    expect(invalid.valid).toBe(false);
    expect(invalid.invalidExtras).toContain(EXTRA_OPTION_IDS.OVEN_INSIDE);
  });

  it("treats property/format pairs as compatible when both sides allow them", () => {
    expect(
      isPropertyFormatCompatible(
        PROPERTY_TYPE_IDS.APARTMENT,
        CLEANING_FORMAT_IDS.DEEP
      )
    ).toBe(true);

    expect(
      isPropertyFormatCompatible(
        PROPERTY_TYPE_IDS.OFFICE,
        CLEANING_FORMAT_IDS.POST_RENOVATION
      )
    ).toBe(true);
  });
});

describe("getAvailableCleaningFormats", () => {
  it("returns all enabled formats for apartments and houses", () => {
    const apartmentFormats = getAvailableCleaningFormats(
      PROPERTY_TYPE_IDS.APARTMENT
    ).map((format) => format.id);

    const houseFormats = getAvailableCleaningFormats(
      PROPERTY_TYPE_IDS.HOUSE
    ).map((format) => format.id);

    expect(apartmentFormats).toEqual([
      CLEANING_FORMAT_IDS.MAINTENANCE,
      CLEANING_FORMAT_IDS.DEEP,
      CLEANING_FORMAT_IDS.POST_RENOVATION,
    ]);
    expect(houseFormats).toEqual(apartmentFormats);
  });

  it("returns office formats from office settings", () => {
    const officeFormats = getAvailableCleaningFormats(
      PROPERTY_TYPE_IDS.OFFICE
    ).map((format) => format.id);

    expect(officeFormats).toEqual([
      CLEANING_FORMAT_IDS.MAINTENANCE,
      CLEANING_FORMAT_IDS.DEEP,
      CLEANING_FORMAT_IDS.POST_RENOVATION,
    ]);
  });

  it("returns an empty list for unknown property types", () => {
    expect(getAvailableCleaningFormats("warehouse")).toEqual([]);
  });

  it("returns only office-safe extras for office + maintenance", () => {
    const extras = getAvailableExtras(
      PROPERTY_TYPE_IDS.OFFICE,
      CLEANING_FORMAT_IDS.MAINTENANCE
    ).map((extra) => extra.id);

    expect(extras).toEqual([
      EXTRA_OPTION_IDS.ECO_PRODUCTS,
      EXTRA_OPTION_IDS.WINDOW_CLEANING,
      EXTRA_OPTION_IDS.HEAVY_DIRT,
      EXTRA_OPTION_IDS.URGENT_CLEANING,
    ]);
    expect(extras).not.toContain(EXTRA_OPTION_IDS.FRIDGE_INSIDE);
  });
});
