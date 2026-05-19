"use client";

import { useState } from "react";
import {
  Building2,
  Hammer,
  Home,
  Layers,
  Sparkles,
} from "lucide-react";
import { CalculatorOptionCard } from "@/components/calculator/CalculatorOptionCard";
import { CalculatorProgress } from "@/components/calculator/CalculatorProgress";
import { CalculatorSummary } from "@/components/calculator/CalculatorSummary";
import { SegmentedControl } from "@/components/calculator/SegmentedControl";
import { Container } from "@/components/common/Container";
import { SectionHeader } from "@/components/common/SectionHeader";
import {
  calculatorInitialState,
  calculatorSteps,
  cleaningAreas,
  extraServices,
  frequencyOptions,
  propertyDefaults,
  serviceTypes,
} from "@/config/calculator";
import { calculateCleaningPrice } from "@/lib/calculateCleaningPrice";
import { SECTION_PADDING } from "@/lib/constants";

const COMMENT_MAX_LENGTH = 300;
const CURRENT_STEP = "type";

const serviceIcons = {
  regular: Sparkles,
  deep: Layers,
  renovation: Hammer,
  office: Building2,
  house: Home,
};

const serviceTypeList = Object.values(serviceTypes);
const frequencyList = Object.values(frequencyOptions);

function CalculatorField({ label, children, htmlFor }) {
  return (
    <div className="space-y-2">
      <label
        htmlFor={htmlFor}
        className="block text-sm font-medium text-slate-700"
      >
        {label}
      </label>
      {children}
    </div>
  );
}

function CalculatorBlock({ title, description, hint, children }) {
  return (
    <section className="space-y-5 border-t border-slate-100 pt-8 first:border-t-0 first:pt-0">
      <div>
        <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
        {description && (
          <p className="mt-1 text-sm text-slate-600">{description}</p>
        )}
        {hint && (
          <p className="mt-2 text-xs leading-relaxed text-slate-500">{hint}</p>
        )}
      </div>
      {children}
    </section>
  );
}

export function CalculatorSection() {
  const [calculatorState, setCalculatorState] = useState(
    calculatorInitialState
  );
  const [submitNotice, setSubmitNotice] = useState("");

  const handleServiceTypeChange = (serviceType) => {
    setCalculatorState((prev) => ({ ...prev, serviceType }));
  };

  const handleAreaToggle = (areaId) => {
    setCalculatorState((prev) => {
      const isSelected = prev.selectedAreas.includes(areaId);
      const selectedAreas = isSelected
        ? prev.selectedAreas.filter((id) => id !== areaId)
        : [...prev.selectedAreas, areaId];

      return { ...prev, selectedAreas };
    });
  };

  const handleExtraToggle = (extraId) => {
    setCalculatorState((prev) => {
      const isSelected = prev.selectedExtras.includes(extraId);
      const selectedExtras = isSelected
        ? prev.selectedExtras.filter((id) => id !== extraId)
        : [...prev.selectedExtras, extraId];

      return { ...prev, selectedExtras };
    });
  };

  const handleFieldChange = (field, value) => {
    setCalculatorState((prev) => ({ ...prev, [field]: value }));
  };

  const handleAreaInputChange = (event) => {
    const nextValue = Number(event.target.value);

    setCalculatorState((prev) => ({
      ...prev,
      area: Number.isFinite(nextValue) ? nextValue : prev.area,
    }));
  };

  const handleAreaInputBlur = () => {
    setCalculatorState((prev) => {
      const clampedArea = Math.min(
        propertyDefaults.maxArea,
        Math.max(propertyDefaults.minArea, prev.area)
      );

      return { ...prev, area: clampedArea };
    });
  };

  const handleCommentChange = (event) => {
    const comment = event.target.value.slice(0, COMMENT_MAX_LENGTH);
    setCalculatorState((prev) => ({ ...prev, comment }));
  };

  const handleRequestQuote = () => {
    const price = calculateCleaningPrice(calculatorState);

    console.log({ calculatorState, price });

    setSubmitNotice(
      "Заявка пока не отправляется — подключим отправку на следующем этапе."
    );
  };

  return (
    <section
      id="calculator"
      className={`bg-gradient-to-b from-cleantry-mint/30 via-white to-slate-50/80 ${SECTION_PADDING}`}
    >
      <Container>
        <SectionHeader
          eyebrow="Калькулятор стоимости"
          title="Рассчитайте уборку за пару минут"
          description="Выберите тип уборки, зоны, площадь и дополнительные услуги — мы покажем ориентировочную стоимость и подготовим заявку."
        />

        <p className="mt-10 text-sm text-slate-500">
          Разделы калькулятора — заполните блоки в удобном порядке на одной
          странице.
        </p>

        <CalculatorProgress
          steps={calculatorSteps}
          currentStep={CURRENT_STEP}
        />

        <div className="mt-10 grid gap-8 lg:grid-cols-[1.7fr_0.9fr] lg:items-start">
          <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm sm:p-8">
            <p className="mb-8 rounded-2xl border border-emerald-100 bg-emerald-50/60 px-4 py-3 text-sm leading-relaxed text-slate-600">
              Площадь задаёт общий масштаб уборки, выбранные зоны показывают, что
              именно нужно включить в работу, а дополнительные услуги помогают
              точнее рассчитать задачу.
            </p>

            <CalculatorBlock
              title="Тип уборки"
              description="Тип уборки задаёт базовую стоимость и цену за м². Конкретные зоны выбираются отдельно."
            >
              <div className="grid gap-3 sm:grid-cols-2">
                {serviceTypeList.map((service) => (
                  <CalculatorOptionCard
                    key={service.id}
                    selected={calculatorState.serviceType === service.id}
                    onSelect={() => handleServiceTypeChange(service.id)}
                    label={service.label}
                    description={service.description}
                    icon={serviceIcons[service.id]}
                  />
                ))}
              </div>
            </CalculatorBlock>

            <CalculatorBlock
              title="Зоны уборки"
              description="Выберите зоны, которые нужно включить в расчёт. Если зона не выбрана, она не входит в предварительную стоимость."
              hint="По умолчанию выбран базовый набор зон для квартиры. Вы можете убрать лишнее или добавить нужное."
            >
              <div className="grid gap-3 sm:grid-cols-2">
                {cleaningAreas.map((area) => (
                  <CalculatorOptionCard
                    key={area.id}
                    selected={calculatorState.selectedAreas.includes(area.id)}
                    onSelect={() => handleAreaToggle(area.id)}
                    label={area.label}
                    description={area.description}
                    priceLabel={`+${area.price} BYN`}
                  />
                ))}
              </div>
            </CalculatorBlock>

            <CalculatorBlock
              title="Детали помещения"
              description="Площадь влияет на расчёт. Комнаты помогают понять планировку. Санузлы учитываются в цене только при выбранной зоне «Санузел»."
            >
              <div className="grid gap-6 sm:grid-cols-2">
                <CalculatorField label="Площадь" htmlFor="calculator-area">
                  <div className="relative">
                    <input
                      id="calculator-area"
                      type="number"
                      min={propertyDefaults.minArea}
                      max={propertyDefaults.maxArea}
                      value={calculatorState.area}
                      onChange={handleAreaInputChange}
                      onBlur={handleAreaInputBlur}
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 pr-12 text-slate-900 transition-colors focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                    />
                    <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate-400">
                      м²
                    </span>
                  </div>
                </CalculatorField>

                <CalculatorField label="Комнаты">
                  <SegmentedControl
                    options={propertyDefaults.rooms}
                    value={calculatorState.rooms}
                    onChange={(value) => handleFieldChange("rooms", value)}
                    ariaLabel="Количество комнат"
                  />
                  <p className="text-xs text-slate-500">
                    Не влияет на стоимость — только для уточнения заявки.
                  </p>
                </CalculatorField>

                <CalculatorField label="Санузлы">
                  <SegmentedControl
                    options={propertyDefaults.bathrooms}
                    value={calculatorState.bathrooms}
                    onChange={(value) => handleFieldChange("bathrooms", value)}
                    ariaLabel="Количество санузлов"
                  />
                  <p className="text-xs text-slate-500">
                    Доплата применяется только если выбрана зона «Санузел» — за
                    каждый дополнительный санузел сверх первого.
                  </p>
                </CalculatorField>

                <CalculatorField label="Регулярность">
                  <SegmentedControl
                    options={frequencyList}
                    value={calculatorState.frequency}
                    onChange={(value) => handleFieldChange("frequency", value)}
                    ariaLabel="Регулярность уборки"
                  />
                  <p className="text-xs text-slate-500">
                    Регулярная уборка может снизить стоимость одного визита.
                  </p>
                </CalculatorField>
              </div>
            </CalculatorBlock>

            <CalculatorBlock
              title="Дополнительные услуги"
              description="Отдельные задачи вне стандартной уборки выбранных зон — например, мытьё окон или уборка внутри техники."
            >
              <div className="grid gap-3 sm:grid-cols-2">
                {extraServices.map((extra) => (
                  <CalculatorOptionCard
                    key={extra.id}
                    compact
                    selected={calculatorState.selectedExtras.includes(extra.id)}
                    onSelect={() => handleExtraToggle(extra.id)}
                    label={extra.label}
                    priceLabel={`+${extra.price} BYN`}
                  />
                ))}
              </div>
            </CalculatorBlock>

            <CalculatorBlock title="Комментарий">
              <CalculatorField label="Комментарий" htmlFor="calculator-comment">
                <textarea
                  id="calculator-comment"
                  rows={4}
                  value={calculatorState.comment}
                  onChange={handleCommentChange}
                  placeholder="Например, есть животные, нужен акцент на кухне и санузле, удобное время — после 14:00"
                  className="w-full resize-y rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm leading-relaxed text-slate-900 transition-colors placeholder:text-slate-400 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                />
                <p className="text-right text-xs text-slate-400">
                  {calculatorState.comment.length} / {COMMENT_MAX_LENGTH}
                </p>
              </CalculatorField>
            </CalculatorBlock>
          </div>

          <CalculatorSummary
            calculatorState={calculatorState}
            onRequestQuote={handleRequestQuote}
            submitNotice={submitNotice}
          />
        </div>
      </Container>
    </section>
  );
}
