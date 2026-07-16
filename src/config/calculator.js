import {
  CLEANING_FORMAT_IDS,
  PROPERTY_TYPE_IDS,
} from "@/catalog/ids";
import {
  mapAllCalculatorExtras,
  mapCalculatorServiceTypes,
  mapPropertyTypeOptions,
} from "@/catalog/mappers";
import { t } from "@/catalog/i18n";
import { getAvailableCleaningFormats, getAvailableExtras } from "@/catalog/selectors";
import {
  CLEANING_SCOPE,
  createInitialCalculatorState,
  officeZoneCatalog,
  residentialZoneCatalog,
} from "@/lib/calculator";
import {
  discountRates,
  extrasCatalog,
  PRICING_CURRENCY,
} from "@/lib/calculator/pricing/pricingConfig";

export const cleaningScopeOptions = [
  {
    id: CLEANING_SCOPE.WHOLE,
    label: "Всё помещение",
    description: "Уборка всего объекта целиком — без ручного выбора комнат.",
  },
  {
    id: CLEANING_SCOPE.ZONES,
    label: "Отдельные зоны",
    description: "Выберите только те зоны, которые нужно включить в расчёт.",
  },
];

export const frequencyOptions = {
  once: {
    id: "once",
    label: "Разово",
    discount: discountRates.once,
  },
  weekly: {
    id: "weekly",
    label: "Еженедельно",
    discount: discountRates.weekly,
  },
  biweekly: {
    id: "biweekly",
    label: "Раз в 2 недели",
    discount: discountRates.biweekly,
  },
  monthly: {
    id: "monthly",
    label: "Ежемесячно",
    discount: discountRates.monthly,
  },
};

export const calculatorCurrency = PRICING_CURRENCY;

/** @deprecated Prefer createInitialCalculatorState() */
export const calculatorInitialState = createInitialCalculatorState();

/** @deprecated Removed fake wizard steps — use completion model instead. */
export const calculatorSteps = [];

/**
 * @param {string} [propertyTypeId]
 */
export function getCalculatorFormats(propertyTypeId = PROPERTY_TYPE_IDS.APARTMENT) {
  return getAvailableCleaningFormats(propertyTypeId).map((format) => ({
    id: format.id,
    label: t(format.label),
    description: t(format.shortDescription),
    icon: format.icon,
  }));
}

export function getCalculatorPropertyTypes() {
  return mapPropertyTypeOptions();
}

/**
 * @param {string} propertyTypeId
 * @param {string} cleaningFormatId
 */
export function getCalculatorExtras(propertyTypeId, cleaningFormatId) {
  return getAvailableExtras(propertyTypeId, cleaningFormatId).map((extra) => ({
    id: extra.id,
    label: t(extra.label),
    price: extra.pricing.price ?? 0,
  }));
}

/**
 * @param {string} propertyTypeId
 */
export function mapZonesForPricing(propertyTypeId) {
  return propertyTypeId === PROPERTY_TYPE_IDS.OFFICE
    ? [...officeZoneCatalog]
    : [...residentialZoneCatalog];
}

/** Transitional flat catalogs for summary labels */
export const cleaningAreas = [...residentialZoneCatalog];
export const extraServices = mapAllCalculatorExtras();
export const serviceTypes = mapCalculatorServiceTypes(
  "ru",
  PROPERTY_TYPE_IDS.APARTMENT
);

export const propertyDefaults = {
  minArea: 20,
  maxArea: 300,
  defaultArea: 65,
  rooms: ["1", "2", "3", "4", "5+"],
  bathrooms: ["1", "2", "3", "4+"],
};

export const calculatorCatalogIds = {
  propertyTypes: PROPERTY_TYPE_IDS,
  cleaningFormats: CLEANING_FORMAT_IDS,
  scopes: CLEANING_SCOPE,
};
