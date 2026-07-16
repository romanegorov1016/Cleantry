import { describe, expect, it } from "vitest";
import { mapServiceSelectionToPrefill } from "@/lib/calculatorPrefill";

describe("mapServiceSelectionToPrefill", () => {
  it("maps property type and cleaning format selections", () => {
    expect(
      mapServiceSelectionToPrefill({
        kind: "propertyType",
        id: "apartment",
        sourceId: "apartment",
      })
    ).toEqual({
      kind: "propertyType",
      id: "apartment",
      sourceId: "apartment",
    });

    expect(
      mapServiceSelectionToPrefill({
        source: "cleaningFormat",
        sourceId: "maintenance",
      })
    ).toEqual({
      kind: "cleaningFormat",
      id: "maintenance",
      sourceId: "maintenance",
    });
  });

  it("rejects unknown kinds", () => {
    expect(
      mapServiceSelectionToPrefill({
        kind: "extraOption",
        id: "ecoProducts",
      })
    ).toBeNull();
  });
});
