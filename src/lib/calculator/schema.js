/**
 * @typedef {import('@/catalog/ids.js').PropertyTypeId} PropertyTypeId
 * @typedef {import('@/catalog/ids.js').CleaningFormatId} CleaningFormatId
 * @typedef {import('./constants.js').CleaningScope} CleaningScope
 */

/**
 * @typedef {{
 *   workspaces: string,
 *   meetingRooms: string,
 *   hasKitchen: boolean,
 * }} OfficeDetails
 */

/**
 * @typedef {{
 *   propertyType: PropertyTypeId,
 *   cleaningFormat: CleaningFormatId,
 *   cleaningScope: CleaningScope,
 *   area: number,
 *   rooms: string,
 *   bathrooms: string,
 *   officeDetails: OfficeDetails | null,
 *   selectedZones: string[],
 *   frequency: string,
 *   selectedExtras: string[],
 *   comment: string,
 *   contact: {
 *     name: string,
 *     phone: string,
 *     preferredContactMethod: string,
 *     preferredDate: string,
 *     preferredTime: string,
 *   },
 * }} CalculatorState
 */

/**
 * @typedef {{
 *   id: string,
 *   label: string,
 *   price: number,
 * }} ZoneLineItem
 */

/**
 * @typedef {{
 *   propertyType: PropertyTypeId,
 *   cleaningFormat: CleaningFormatId,
 *   cleaningScope: CleaningScope,
 *   area: number,
 *   rooms: string | null,
 *   bathrooms: string,
 *   officeDetails: OfficeDetails | null,
 *   selectedZones: string[],
 *   effectiveZones: string[],
 *   zoneLineItems: ZoneLineItem[],
 *   frequency: string,
 *   selectedExtras: string[],
 *   includeBathroomAdjustment: boolean,
 *   bathroomAdjustment: number,
 *   officeComposition: number,
 *   areaPriceFactor: number,
 *   includeBasePrice: boolean,
 *   pricedAsWhole: boolean,
 * }} PricingInput
 */

export {};
