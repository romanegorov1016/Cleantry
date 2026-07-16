import { Button } from "@/components/common/Button";
import {
  cleaningScopeOptions,
  frequencyOptions,
  getCalculatorExtras,
  mapZonesForPricing,
} from "@/config/calculator";
import { calculateCleaningPrice } from "@/lib/calculateCleaningPrice";
import { CLEANING_SCOPE } from "@/lib/calculator";
import {
  getCleaningFormat,
  getPropertyType,
  isOfficeProperty,
} from "@/catalog/selectors";
import { t } from "@/catalog/i18n";
import { cn } from "@/lib/utils";

function BreakdownRow({
  label,
  amount,
  currency,
  highlight = false,
  discount = false,
  hideIfZero = false,
}) {
  if ((hideIfZero || discount) && (!amount || amount <= 0)) {
    return null;
  }

  const displayValue = discount
    ? `−${amount} ${currency}`
    : `${amount} ${currency}`;

  return (
    <div
      className={cn(
        "flex items-center justify-between gap-3 text-sm",
        highlight && "border-t border-slate-200 pt-3 font-semibold text-slate-900"
      )}
    >
      <span className={highlight ? "text-slate-900" : "text-slate-600"}>
        {label}
      </span>
      <span
        className={cn(
          "shrink-0 tabular-nums",
          discount && "text-emerald-600",
          highlight && "text-emerald-700"
        )}
      >
        {displayValue}
      </span>
    </div>
  );
}

/**
 * @param {{
 *   calculatorState: import('@/lib/calculator/schema.js').CalculatorState,
 *   price?: ReturnType<typeof calculateCleaningPrice>,
 *   onRequestQuote: () => void,
 *   submitNotice?: string,
 *   variant?: 'desktop' | 'panel',
 *   id?: string,
 *   errors?: Record<string, string>,
 * }} props
 */
export function CalculatorSummary({
  calculatorState,
  price: priceProp,
  onRequestQuote,
  submitNotice,
  variant = "desktop",
  id,
  errors = {},
}) {
  const price = priceProp ?? calculateCleaningPrice(calculatorState);
  const { currency, total, breakdown } = price;

  const property = getPropertyType(calculatorState.propertyType);
  const format = getCleaningFormat(calculatorState.cleaningFormat);
  const scope = cleaningScopeOptions.find(
    (item) => item.id === calculatorState.cleaningScope
  );
  const selectedFrequency =
    frequencyOptions[calculatorState.frequency] ?? frequencyOptions.once;

  const zoneCatalog = mapZonesForPricing(calculatorState.propertyType);
  const selectedAreaLabels =
    calculatorState.cleaningScope === CLEANING_SCOPE.WHOLE
      ? ["Всё помещение"]
      : zoneCatalog
          .filter((area) => calculatorState.selectedZones.includes(area.id))
          .map((area) => area.label);

  const extras = getCalculatorExtras(
    calculatorState.propertyType,
    calculatorState.cleaningFormat
  ).filter((extra) => calculatorState.selectedExtras.includes(extra.id));

  const hasBlockingErrors = Boolean(
    errors.selectedZones || errors.area || errors.propertyType
  );

  return (
    <aside
      id={id}
      className={cn(
        variant === "desktop" &&
          "hidden lg:sticky lg:top-24 lg:block lg:self-start"
      )}
    >
      <div className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-lg shadow-emerald-900/5 sm:p-7">
        <h3 className="text-lg font-semibold text-slate-900">
          Ориентировочная стоимость
        </h3>
        <p className="mt-3 text-4xl font-bold tracking-tight text-emerald-700">
          от {total} {currency}
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate-500">
          Это предварительный расчёт. Финальная стоимость зависит от состояния
          помещения, объёма работ и подтверждается после уточнения деталей.
        </p>

        <div className="mt-8 space-y-4 border-t border-slate-100 pt-6">
          <SummaryItem
            label="Помещение"
            value={property ? t(property.label) : "—"}
          />
          <SummaryItem
            label="Формат"
            value={format ? t(format.label) : "—"}
          />
          <SummaryItem label="Объём" value={scope?.label ?? "—"} />
          <SummaryItem label="Регулярность" value={selectedFrequency.label} />
          <SummaryItem label="Площадь" value={`${calculatorState.area} м²`} />
          {!isOfficeProperty(calculatorState.propertyType) && (
            <SummaryItem label="Комнаты" value={calculatorState.rooms} />
          )}
          {(calculatorState.cleaningScope === CLEANING_SCOPE.WHOLE ||
            calculatorState.selectedZones.includes("bathroom")) && (
            <SummaryItem label="Санузлы" value={calculatorState.bathrooms} />
          )}
          {isOfficeProperty(calculatorState.propertyType) &&
            calculatorState.officeDetails && (
              <>
                <SummaryItem
                  label="Кол-во рабочих мест"
                  value={calculatorState.officeDetails.workspaces}
                />
                <SummaryItem
                  label="Переговорные"
                  value={calculatorState.officeDetails.meetingRooms}
                />
                <SummaryItem
                  label="Кухня"
                  value={
                    calculatorState.officeDetails.hasKitchen ? "Да" : "Нет"
                  }
                />
              </>
            )}

          <SummaryItem label="Зоны">
            {selectedAreaLabels.length > 0 ? (
              <ul className="mt-1 space-y-1">
                {selectedAreaLabels.map((label) => (
                  <li key={label} className="text-slate-700">
                    {label}
                  </li>
                ))}
              </ul>
            ) : (
              <span className="text-amber-700">Зоны не выбраны</span>
            )}
          </SummaryItem>

          <SummaryItem label="Дополнительно">
            {extras.length > 0 ? (
              <ul className="mt-1 space-y-1.5">
                {extras.map((extra) => (
                  <li
                    key={extra.id}
                    className="flex justify-between gap-2 text-slate-700"
                  >
                    <span>{extra.label}</span>
                    <span className="shrink-0 tabular-nums text-emerald-700">
                      +{extra.price} {currency}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <span className="text-slate-500">
                Дополнительные услуги не выбраны
              </span>
            )}
          </SummaryItem>
        </div>

        <div className="mt-8 space-y-2.5 border-t border-slate-100 pt-6">
          <BreakdownRow
            label="Базовая стоимость"
            amount={breakdown.basePrice}
            currency={currency}
            hideIfZero
          />
          <BreakdownRow
            label="Площадь"
            amount={breakdown.areaPrice}
            currency={currency}
          />
          <BreakdownRow
            label="Зоны"
            amount={breakdown.selectedAreasPrice}
            currency={currency}
            hideIfZero
          />
          <BreakdownRow
            label="Дополнительные услуги"
            amount={breakdown.extrasPrice}
            currency={currency}
            hideIfZero
          />
          <BreakdownRow
            label="Доплата за санузлы"
            amount={breakdown.bathroomAdjustment}
            currency={currency}
            hideIfZero
          />
          <BreakdownRow
            label="Скидка за регулярность"
            amount={breakdown.frequencyDiscount}
            currency={currency}
            discount
          />
          <BreakdownRow
            label="Итого"
            amount={total}
            currency={currency}
            highlight
          />
        </div>

        <Button
          type="button"
          onClick={onRequestQuote}
          disabled={hasBlockingErrors}
          className="mt-8 w-full disabled:cursor-not-allowed disabled:opacity-50"
        >
          Получить точный расчёт
        </Button>

        {errors.selectedZones && (
          <p className="mt-3 text-sm text-amber-700" role="alert">
            {errors.selectedZones}
          </p>
        )}

        {submitNotice && (
          <p
            className="mt-4 rounded-2xl bg-emerald-50 px-4 py-3 text-sm leading-relaxed text-emerald-800"
            role="status"
          >
            {submitNotice}
          </p>
        )}
      </div>
    </aside>
  );
}

function SummaryItem({ label, value, children }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </p>
      <div className="mt-1 text-sm text-slate-800">{children ?? value}</div>
    </div>
  );
}
