import { describe, expect, it } from "vitest";
import {
  CLEANING_FORMAT_IDS,
  EXTRA_OPTION_IDS,
  PROPERTY_TYPE_IDS,
} from "@/catalog/ids";
import { createInitialCalculatorState } from "@/lib/calculator";
import {
  buildCleaningRequestPayload,
  buildCleaningRequestSnapshot,
  validatePhone,
  validateRequestForm,
} from "@/lib/cleaningRequest";

describe("validatePhone", () => {
  it("accepts common BY formats", () => {
    expect(validatePhone("+375 29 123-45-67").valid).toBe(true);
    expect(validatePhone("80291234567").valid).toBe(true);
    expect(validatePhone("(029) 123 45 67").valid).toBe(true);
  });

  it("rejects empty and too short numbers", () => {
    expect(validatePhone("").valid).toBe(false);
    expect(validatePhone("12345").valid).toBe(false);
    expect(validatePhone("12345").message).toMatch(/цифр/i);
  });
});

describe("validateRequestForm", () => {
  it("requires name, phone, contact method and consent", () => {
    const result = validateRequestForm({
      name: "",
      phone: "",
      preferredContactMethod: "",
      preferredDate: "",
      preferredTime: "",
      comment: "",
      consentAccepted: false,
    });

    expect(result.valid).toBe(false);
    expect(result.errors.name).toBeTruthy();
    expect(result.errors.phone).toBeTruthy();
    expect(result.errors.preferredContactMethod).toBeTruthy();
    expect(result.errors.consentAccepted).toBeTruthy();
  });

  it("passes when required fields are valid", () => {
    const result = validateRequestForm({
      name: "Анна",
      phone: "+375291234567",
      preferredContactMethod: "telegram",
      preferredDate: "2026-08-01",
      preferredTime: "14:00",
      comment: "Домофон 12",
      consentAccepted: true,
    });

    expect(result.valid).toBe(true);
    expect(result.errors).toEqual({});
  });
});

describe("buildCleaningRequestPayload", () => {
  it("includes calculator snapshot and contact fields", () => {
    const state = {
      ...createInitialCalculatorState(),
      propertyType: PROPERTY_TYPE_IDS.APARTMENT,
      cleaningFormat: CLEANING_FORMAT_IDS.MAINTENANCE,
      cleaningScope: "whole",
      area: 65,
      rooms: "2",
      bathrooms: "1",
      frequency: "weekly",
      selectedExtras: [EXTRA_OPTION_IDS.URGENT_CLEANING],
      comment: "из калькулятора",
    };

    const snapshot = buildCleaningRequestSnapshot({
      calculatorState: state,
      sourceUrl: "https://cleantry.local/#calculator",
      preset: { kind: "propertyType", id: "apartment" },
    });

    const payload = buildCleaningRequestPayload({
      formValues: {
        name: "Роман",
        phone: "+375 29 111-22-33",
        preferredContactMethod: "phone",
        preferredDate: "2026-08-10",
        preferredTime: "11:30",
        comment: "Позвонить заранее",
        consentAccepted: true,
      },
      snapshot,
      submittedAt: "2026-07-16T12:00:00.000Z",
    });

    expect(payload.contact.name).toBe("Роман");
    expect(payload.contact.preferredContactMethod).toBe("phone");
    expect(payload.snapshot.propertyType).toBe("apartment");
    expect(payload.snapshot.cleaningFormat).toBe("maintenance");
    expect(payload.snapshot.area).toBe(65);
    expect(payload.snapshot.rooms).toBe("2");
    expect(payload.snapshot.bathrooms).toBe("1");
    expect(payload.snapshot.cleaningScope).toBe("whole");
    expect(payload.snapshot.frequency).toBe("weekly");
    expect(payload.snapshot.selectedExtras).toEqual([
      EXTRA_OPTION_IDS.URGENT_CLEANING,
    ]);
    expect(payload.snapshot.price.estimatedTotal).toBeTypeOf("number");
    expect(payload.snapshot.price.rangeLabel).toMatch(/^от /);
    expect(payload.snapshot.sourceUrl).toContain("#calculator");
    expect(payload.snapshot.preset).toEqual({
      kind: "propertyType",
      id: "apartment",
    });
    expect(payload.consentAccepted).toBe(true);
  });
});
