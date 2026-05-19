import {
  calculatorCurrency,
  cleaningAreas,
  extraServices,
  frequencyOptions,
  propertyDefaults,
  serviceTypes,
} from "@/config/calculator";

const DEFAULT_SERVICE_TYPE = "regular";
const DEFAULT_FREQUENCY = "once";
const BATHROOM_AREA_ID = "bathroom";

const bathroomAdjustments = {
  1: 0,
  2: 20,
  3: 40,
  "4+": 60,
};

function getServiceType(serviceTypeId) {
  return serviceTypes[serviceTypeId] ?? serviceTypes[DEFAULT_SERVICE_TYPE];
}

function getFrequency(frequencyId) {
  return frequencyOptions[frequencyId] ?? frequencyOptions[DEFAULT_FREQUENCY];
}

function normalizeArea(area) {
  const parsedArea = Number(area);

  if (!Number.isFinite(parsedArea) || parsedArea <= 0) {
    return propertyDefaults.defaultArea;
  }

  return Math.min(
    propertyDefaults.maxArea,
    Math.max(propertyDefaults.minArea, parsedArea)
  );
}

function getSelectedIds(selectedIds) {
  return Array.isArray(selectedIds) ? selectedIds : [];
}

function sumSelectedPrices(selectedIds, catalog) {
  if (selectedIds.length === 0) {
    return 0;
  }

  const priceById = new Map(catalog.map((item) => [item.id, item.price]));

  return selectedIds.reduce((total, id) => total + (priceById.get(id) ?? 0), 0);
}

function getBathroomAdjustment(bathrooms) {
  return bathroomAdjustments[bathrooms] ?? 0;
}

function roundPrice(value) {
  return Math.round(value);
}

export function calculateCleaningPrice(calculatorState = {}) {
  const serviceType = getServiceType(calculatorState.serviceType);
  const frequency = getFrequency(calculatorState.frequency);
  const area = normalizeArea(calculatorState.area);
  const selectedAreas = getSelectedIds(calculatorState.selectedAreas);
  const selectedExtras = getSelectedIds(calculatorState.selectedExtras);

  const basePrice = serviceType.basePrice;
  const areaPrice = roundPrice(area * serviceType.pricePerSquareMeter);
  const selectedAreasPrice = roundPrice(
    sumSelectedPrices(selectedAreas, cleaningAreas)
  );
  const extrasPrice = roundPrice(
    sumSelectedPrices(selectedExtras, extraServices)
  );

  const isBathroomAreaSelected = selectedAreas.includes(BATHROOM_AREA_ID);
  const bathroomAdjustment = isBathroomAreaSelected
    ? getBathroomAdjustment(calculatorState.bathrooms)
    : 0;

  const subtotal = roundPrice(
    basePrice +
      areaPrice +
      selectedAreasPrice +
      extrasPrice +
      bathroomAdjustment
  );
  const frequencyDiscount = roundPrice(subtotal * frequency.discount);
  const total = Math.max(0, subtotal - frequencyDiscount);

  return {
    subtotal,
    discount: frequencyDiscount,
    total,
    currency: calculatorCurrency,
    breakdown: {
      basePrice,
      areaPrice,
      selectedAreasPrice,
      extrasPrice,
      bathroomAdjustment,
      frequencyDiscount,
    },
  };
}
