import { Button } from "@/components/common/Button";
import {
  cleaningAreas,
  extraServices,
  frequencyOptions,
  serviceTypes,
} from "@/config/calculator";
import { calculateCleaningPrice } from "@/lib/calculateCleaningPrice";
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

export function CalculatorSummary({
  calculatorState,
  onRequestQuote,
  submitNotice,
}) {
  const price = calculateCleaningPrice(calculatorState);
  const { currency, total, breakdown } = price;

  const selectedService =
    serviceTypes[calculatorState.serviceType] ?? serviceTypes.regular;
  const selectedFrequency =
    frequencyOptions[calculatorState.frequency] ?? frequencyOptions.once;

  const selectedAreaLabels = cleaningAreas
    .filter((area) => calculatorState.selectedAreas?.includes(area.id))
    .map((area) => area.label);

  const selectedExtraItems = extraServices.filter((extra) =>
    calculatorState.selectedExtras?.includes(extra.id)
  );

  return (
    <aside className="lg:sticky lg:top-24 lg:self-start">
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
          <SummaryItem label="Тип уборки" value={selectedService.label} />
          <SummaryItem label="Регулярность" value={selectedFrequency.label} />
          <SummaryItem
            label="Площадь"
            value={`${calculatorState.area} м²`}
          />
          <SummaryItem label="Комнаты" value={calculatorState.rooms} />
          <SummaryItem label="Санузлы" value={calculatorState.bathrooms} />

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
              <span className="text-slate-500">Зоны не выбраны</span>
            )}
          </SummaryItem>

          <SummaryItem label="Дополнительно">
            {selectedExtraItems.length > 0 ? (
              <ul className="mt-1 space-y-1.5">
                {selectedExtraItems.map((extra) => (
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
          />
          <BreakdownRow
            label="Площадь"
            amount={breakdown.areaPrice}
            currency={currency}
          />
          <BreakdownRow
            label="Выбранные зоны"
            amount={breakdown.selectedAreasPrice}
            currency={currency}
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
          className="mt-8 w-full"
        >
          Получить точный расчёт
        </Button>

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
