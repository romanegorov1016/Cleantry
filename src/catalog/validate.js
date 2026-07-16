import { cleaningFormats } from "@/catalog/cleaningFormats";
import { extraOptions } from "@/catalog/extras";
import {
  CLEANING_FORMAT_ID_LIST,
  CLEANING_FORMAT_IDS,
  EXTRA_OPTION_ID_LIST,
  EXTRA_OPTION_IDS,
  PROPERTY_TYPE_ID_LIST,
  PROPERTY_TYPE_IDS,
} from "@/catalog/ids";
import { officeSettings } from "@/catalog/officeSettings";
import { propertyTypes } from "@/catalog/propertyTypes";

/**
 * Collect duplicate ids from a list.
 *
 * @param {string[]} ids
 * @returns {string[]}
 */
export function findDuplicateIds(ids) {
  const seen = new Set();
  /** @type {string[]} */
  const duplicates = [];

  for (const id of ids) {
    if (seen.has(id)) {
      duplicates.push(id);
    } else {
      seen.add(id);
    }
  }

  return duplicates;
}

/**
 * @returns {{
 *   propertyTypeIds: string[],
 *   cleaningFormatIds: string[],
 *   extraOptionIds: string[],
 *   allIds: string[],
 *   duplicateIds: string[],
 *   missingExpectedIds: string[],
 *   unexpectedIds: string[],
 * }}
 */
export function inspectCatalogIds() {
  const propertyTypeIds = Object.keys(propertyTypes);
  const cleaningFormatIds = Object.keys(cleaningFormats);
  const extraOptionIds = Object.keys(extraOptions);
  const allIds = [
    ...propertyTypeIds,
    ...cleaningFormatIds,
    ...extraOptionIds,
  ];

  const expectedIds = [
    ...PROPERTY_TYPE_ID_LIST,
    ...CLEANING_FORMAT_ID_LIST,
    ...EXTRA_OPTION_ID_LIST,
  ];

  const actualSet = new Set(allIds);
  const expectedSet = new Set(expectedIds);

  return {
    propertyTypeIds,
    cleaningFormatIds,
    extraOptionIds,
    allIds,
    duplicateIds: findDuplicateIds(allIds),
    missingExpectedIds: expectedIds.filter((id) => !actualSet.has(id)),
    unexpectedIds: allIds.filter((id) => !expectedSet.has(id)),
  };
}

/**
 * @returns {boolean}
 */
export function assertCatalogIdentityIntegrity() {
  const report = inspectCatalogIds();

  const entityIdMatchesKey =
    Object.entries(propertyTypes).every(([key, entity]) => entity.id === key) &&
    Object.entries(cleaningFormats).every(([key, entity]) => entity.id === key) &&
    Object.entries(extraOptions).every(([key, entity]) => entity.id === key);

  return (
    report.duplicateIds.length === 0 &&
    report.missingExpectedIds.length === 0 &&
    report.unexpectedIds.length === 0 &&
    entityIdMatchesKey &&
    officeSettings.propertyTypeId === PROPERTY_TYPE_IDS.OFFICE
  );
}

export const EXPECTED_PROPERTY_TYPE_IDS = PROPERTY_TYPE_ID_LIST;
export const EXPECTED_CLEANING_FORMAT_IDS = CLEANING_FORMAT_ID_LIST;
export const EXPECTED_EXTRA_OPTION_IDS = EXTRA_OPTION_ID_LIST;

export {
  PROPERTY_TYPE_IDS,
  CLEANING_FORMAT_IDS,
  EXTRA_OPTION_IDS,
};
