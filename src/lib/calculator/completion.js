import { isOfficeProperty } from "@/catalog/selectors";
import { CLEANING_SCOPE } from "@/lib/calculator/constants";
import { normalizeCalculatorState } from "@/lib/calculator/normalize";
import { validateCalculatorState } from "@/lib/calculator/validation";

/**
 * Required / optional block completion for the single-page calculator.
 *
 * @param {import('./schema.js').CalculatorState} state
 */
export function getCalculatorCompletion(state) {
  const normalized = normalizeCalculatorState(state);
  const validation = validateCalculatorState(state);
  const isOffice = isOfficeProperty(normalized.propertyType);
  const zonesRequired = normalized.cleaningScope === CLEANING_SCOPE.ZONES;

  const blocks = [
    {
      id: "propertyType",
      label: "Помещение",
      required: true,
      complete: Boolean(normalized.propertyType),
    },
    {
      id: "cleaningFormat",
      label: "Формат",
      required: true,
      complete: Boolean(normalized.cleaningFormat),
    },
    {
      id: "cleaningScope",
      label: "Объём",
      required: true,
      complete: Boolean(normalized.cleaningScope),
    },
    {
      id: "details",
      label: "Детали",
      required: true,
      complete:
        !validation.errors.area &&
        Boolean(normalized.bathrooms) &&
        (isOffice
          ? Boolean(normalized.officeDetails?.workspaces)
          : Boolean(normalized.rooms)),
    },
    {
      id: "zones",
      label: "Зоны",
      required: zonesRequired,
      complete: zonesRequired
        ? normalized.selectedZones.length > 0
        : true,
      visible: zonesRequired,
    },
    {
      id: "frequency",
      label: "Регулярность",
      required: true,
      complete: Boolean(normalized.frequency),
    },
    {
      id: "extras",
      label: "Опции",
      required: false,
      complete: true,
    },
    {
      id: "comment",
      label: "Комментарий",
      required: false,
      complete: true,
    },
  ];

  const visibleBlocks = blocks.filter((block) => block.visible !== false);
  const requiredBlocks = visibleBlocks.filter((block) => block.required);
  const completedRequired = requiredBlocks.filter((block) => block.complete);
  const progress =
    requiredBlocks.length === 0
      ? 1
      : completedRequired.length / requiredBlocks.length;

  return {
    blocks: visibleBlocks,
    requiredCount: requiredBlocks.length,
    completedRequiredCount: completedRequired.length,
    progress,
    isReady: validation.valid && completedRequired.length === requiredBlocks.length,
    errors: validation.errors,
  };
}

/**
 * Mobile sticky bar view-model.
 *
 * @param {{
 *   total: number,
 *   currency: string,
 *   isReady: boolean,
 * }} input
 */
export function getMobileSummaryModel(input) {
  return {
    totalLabel: `от ${input.total} ${input.currency}`,
    ctaLabel: input.isReady
      ? "Получить точный расчёт"
      : "Заполните обязательные поля",
    ctaDisabled: !input.isReady,
    action: input.isReady ? "submit" : "scroll",
    showBreakdownHint: true,
  };
}
