/**
 * Shared JSDoc types for the Cleantry service catalog.
 * Runtime exports are empty — this file is documentation for editors and check.js.
 */

/**
 * @typedef {'ru' | 'en'} LocaleCode
 */

/**
 * @typedef {Object} LocalizedText
 * @property {string} ru
 * @property {string} [en]
 */

/**
 * @typedef {Object} EntityAvailability
 * @property {boolean} enabled - Whether the entity can be selected in product flows.
 * @property {boolean} listed - Whether the entity appears in public marketing lists.
 */

/**
 * @typedef {Object} PricingMetadata
 * @property {'calculated' | 'fixed' | 'quote'} mode
 * @property {number} [basePrice]
 * @property {number} [pricePerSquareMeter]
 * @property {number} [price]
 * @property {LocalizedText} [displayPriceLabel]
 * @property {string} [currency]
 */

/**
 * @typedef {Object} PropertyTypeCompatibility
 * @property {import('./ids.js').CleaningFormatId[]} allowedCleaningFormats
 * @property {import('./ids.js').ExtraOptionId[] | null} allowedExtras - null means “all extras that allow this property”.
 * @property {import('./ids.js').ExtraOptionId[]} [forbiddenExtras]
 */

/**
 * @typedef {Object} CleaningFormatCompatibility
 * @property {import('./ids.js').PropertyTypeId[]} allowedPropertyTypes
 * @property {import('./ids.js').ExtraOptionId[] | null} [allowedExtras]
 * @property {import('./ids.js').ExtraOptionId[]} [forbiddenExtras]
 * @property {import('./ids.js').ExtraOptionId[]} [incompatibleExtras]
 */

/**
 * @typedef {Object} ExtraOptionCompatibility
 * @property {import('./ids.js').PropertyTypeId[]} allowedPropertyTypes
 * @property {import('./ids.js').CleaningFormatId[]} allowedCleaningFormats
 * @property {import('./ids.js').ExtraOptionId[]} [incompatibleExtras]
 */

/**
 * @typedef {Object} CatalogEntityBase
 * @property {string} id
 * @property {LocalizedText} label
 * @property {LocalizedText} shortDescription
 * @property {LocalizedText} fullDescription
 * @property {string} icon
 * @property {EntityAvailability} availability
 * @property {PricingMetadata} pricing
 * @property {number} displayOrder
 */

/**
 * @typedef {CatalogEntityBase & {
 *   id: import('./ids.js').PropertyTypeId,
 *   compatibility: PropertyTypeCompatibility,
 * }} PropertyTypeEntity
 */

/**
 * @typedef {CatalogEntityBase & {
 *   id: import('./ids.js').CleaningFormatId,
 *   compatibility: CleaningFormatCompatibility,
 *   featureLabels?: LocalizedText[],
 *   highlighted?: boolean,
 *   popularLabel?: LocalizedText,
 * }} CleaningFormatEntity
 */

/**
 * @typedef {CatalogEntityBase & {
 *   id: import('./ids.js').ExtraOptionId,
 *   compatibility: ExtraOptionCompatibility,
 * }} ExtraOptionEntity
 */

/**
 * @typedef {Object} OfficeCatalogSettings
 * @property {import('./ids.js').PropertyTypeId} propertyTypeId
 * @property {import('./ids.js').CleaningFormatId[]} availableCleaningFormatIds
 * @property {import('./ids.js').ExtraOptionId[]} availableExtraIds
 * @property {{
 *   minArea: number,
 *   maxArea: number,
 *   defaultArea: number,
 * }} areaDefaults
 * @property {Partial<Record<import('./ids.js').CleaningFormatId, {
 *   basePrice?: number,
 *   pricePerSquareMeter?: number,
 * }>>} pricingOverrides
 */

/**
 * @typedef {Object} IncompatibilityRule
 * @property {string} id
 * @property {string} reasonKey
 * @property {import('./ids.js').PropertyTypeId[]} [propertyTypes]
 * @property {import('./ids.js').CleaningFormatId[]} [cleaningFormats]
 * @property {import('./ids.js').ExtraOptionId[]} [extras]
 */

export {};
