import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ServiceOptionCard } from "@/components/services/ServiceOptionCard";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { getServicesSectionContent } from "@/config/services";
import { mapServiceSelectionToPrefill } from "@/lib/calculatorPrefill";

afterEach(() => {
  cleanup();
});

describe("ServicesSection", () => {
  it("renders available property types and cleaning formats", () => {
    const content = getServicesSectionContent();
    render(<ServicesSection content={content} onSelect={vi.fn()} />);

    expect(
      screen.getByRole("heading", { name: content.propertyTypes.title, level: 3 })
    ).toBeTruthy();
    expect(
      screen.getByRole("heading", {
        name: content.cleaningFormats.title,
        level: 3,
      })
    ).toBeTruthy();

    for (const item of content.propertyTypes.items) {
      expect(screen.getByTestId(`service-card-${item.id}`)).toBeTruthy();
      expect(screen.getByRole("heading", { name: item.title, level: 4 })).toBeTruthy();
    }

    for (const item of content.cleaningFormats.items) {
      expect(screen.getByTestId(`service-card-${item.id}`)).toBeTruthy();
      expect(screen.getByRole("heading", { name: item.title, level: 4 })).toBeTruthy();
    }

    expect(content.propertyTypes.items.map((item) => item.id)).toEqual([
      "apartment",
      "house",
      "office",
    ]);
    expect(content.cleaningFormats.items.map((item) => item.id)).toEqual([
      "maintenance",
      "deep",
      "postRenovation",
    ]);
  });

  it("mentions eco products as an extras note, not a primary card", () => {
    render(<ServicesSection onSelect={vi.fn()} />);

    expect(screen.getByTestId("services-extras-note")).toBeTruthy();
    expect(screen.queryByTestId("service-card-ecoProducts")).toBeNull();
  });

  it("calls onSelect with mapped ids when a card is clicked", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    const content = getServicesSectionContent();

    render(<ServicesSection content={content} onSelect={onSelect} />);

    await user.click(screen.getByTestId("service-card-apartment"));
    expect(onSelect).toHaveBeenCalledWith({
      kind: "propertyType",
      id: "apartment",
      sourceId: "apartment",
    });

    await user.click(screen.getByTestId("service-card-deep"));
    expect(onSelect).toHaveBeenCalledWith({
      kind: "cleaningFormat",
      id: "deep",
      sourceId: "deep",
    });
  });

  it("activates a card with keyboard Enter and Space", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();

    render(<ServicesSection onSelect={onSelect} />);

    const houseCard = screen.getByTestId("service-card-house");
    houseCard.focus();
    expect(houseCard).toBe(document.activeElement);

    await user.keyboard("{Enter}");
    expect(onSelect).toHaveBeenCalledWith({
      kind: "propertyType",
      id: "house",
      sourceId: "house",
    });

    onSelect.mockClear();
    const formatCard = screen.getByTestId("service-card-postRenovation");
    formatCard.focus();
    await user.keyboard(" ");
    expect(onSelect).toHaveBeenCalledWith({
      kind: "cleaningFormat",
      id: "postRenovation",
      sourceId: "postRenovation",
    });
  });
});

describe("ServiceOptionCard mapping", () => {
  it("maps card identity into the select callback payload", () => {
    const onSelect = vi.fn();

    render(
      <ServiceOptionCard
        ctaLabel="Подробнее"
        onSelect={onSelect}
        item={{
          id: "office",
          title: "Офис",
          description: "Описание",
          icon: "building",
          kind: "propertyType",
          sourceId: "office",
        }}
      />
    );

    fireEvent.click(screen.getByTestId("service-card-office"));

    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(onSelect).toHaveBeenCalledWith({
      kind: "propertyType",
      id: "office",
      sourceId: "office",
    });

    expect(
      mapServiceSelectionToPrefill(onSelect.mock.calls[0][0])
    ).toEqual({
      kind: "propertyType",
      id: "office",
      sourceId: "office",
    });
  });
});
