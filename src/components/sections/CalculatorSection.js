"use client";

import { useEffect, useState } from "react";
import {
  Building2,
  Hammer,
  Home,
  Layers,
  Sparkles,
  Warehouse,
} from "lucide-react";
import { CalculatorCompletionBar } from "@/components/calculator/CalculatorCompletionBar";
import { CalculatorMobileBar } from "@/components/calculator/CalculatorMobileBar";
import { CalculatorOptionCard } from "@/components/calculator/CalculatorOptionCard";
import { CalculatorSummary } from "@/components/calculator/CalculatorSummary";
import { RequestQuoteDialog } from "@/components/calculator/RequestQuoteDialog";
import { SegmentedControl } from "@/components/calculator/SegmentedControl";
import { Container } from "@/components/common/Container";
import { SectionHeader } from "@/components/common/SectionHeader";
import {
  cleaningScopeOptions,
  frequencyOptions,
  getCalculatorExtras,
  getCalculatorFormats,
  getCalculatorPropertyTypes,
} from "@/config/calculator";
import { calculateCleaningPrice } from "@/lib/calculateCleaningPrice";
import {
  applyCalculatorPatch,
  applyCalculatorPrefill,
  bathroomOptions,
  CLEANING_SCOPE,
  COMMENT_MAX_LENGTH,
  createInitialCalculatorState,
  getAreaDefaultsForProperty,
  getAreaValidationError,
  getCalculatorCompletion,
  getMobileSummaryModel,
  getZoneCatalogForProperty,
  officeMeetingRoomOptions,
  officeWorkspaceOptions,
  residentialRoomOptions,
  setCleaningFormat,
  setCleaningScope,
  setPropertyType,
  toggleExtra,
  toggleZone,
  validateCalculatorState,
} from "@/lib/calculator";
import {
  CALCULATOR_PREFILL_EVENT,
  CALCULATOR_PREFILL_STORAGE_KEY,
  SECTION_IDS,
  SECTION_PADDING,
  SECTION_SCROLL_MARGIN,
} from "@/lib/constants";
import { isOfficeProperty } from "@/catalog/selectors";
import { cn } from "@/lib/utils";

const propertyIcons = {
  apartment: Home,
  house: Warehouse,
  office: Building2,
};

const formatIcons = {
  maintenance: Sparkles,
  deep: Layers,
  postRenovation: Hammer,
};

const frequencyList = Object.values(frequencyOptions);

function CalculatorField({ label, children, htmlFor, hint, error }) {
  return (
    <div className="space-y-2">
      <label
        htmlFor={htmlFor}
        className="block text-sm font-medium text-slate-700"
      >
        {label}
      </label>
      {children}
      {error ? (
        <p className="text-xs text-amber-700" role="alert">
          {error}
        </p>
      ) : hint ? (
        <p className="text-xs text-slate-500">{hint}</p>
      ) : null}
    </div>
  );
}

function CalculatorBlock({ id, title, description, hint, children }) {
  return (
    <section
      id={id}
      className="space-y-5 border-t border-slate-100 pt-8 first:border-t-0 first:pt-0"
    >
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

function readPrefillPayload() {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = window.sessionStorage.getItem(CALCULATOR_PREFILL_STORAGE_KEY);
    if (!raw) {
      return null;
    }
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function clearPrefillPayload() {
  try {
    window.sessionStorage.removeItem(CALCULATOR_PREFILL_STORAGE_KEY);
  } catch {
    // ignore
  }
}

export function CalculatorSection() {
  const [calculatorState, setCalculatorState] = useState(
    createInitialCalculatorState
  );
  const [areaDraft, setAreaDraft] = useState(() =>
    String(createInitialCalculatorState().area)
  );
  const [areaTouched, setAreaTouched] = useState(false);
  const [showValidation, setShowValidation] = useState(false);
  const [requestOpen, setRequestOpen] = useState(false);
  const [requestSourceUrl, setRequestSourceUrl] = useState("");
  const [requestPreset, setRequestPreset] = useState(null);

  const propertyTypes = getCalculatorPropertyTypes();
  const formats = getCalculatorFormats(calculatorState.propertyType);
  const extras = getCalculatorExtras(
    calculatorState.propertyType,
    calculatorState.cleaningFormat
  );
  const areaDefaults = getAreaDefaultsForProperty(calculatorState.propertyType);
  const isOffice = isOfficeProperty(calculatorState.propertyType);
  const showZones = calculatorState.cleaningScope === CLEANING_SCOPE.ZONES;
  const showBathrooms =
    calculatorState.cleaningScope === CLEANING_SCOPE.WHOLE ||
    calculatorState.selectedZones.includes("bathroom");

  const zones = getZoneCatalogForProperty(calculatorState.propertyType).filter(
    (zone) => {
      if (
        isOffice &&
        zone.id === "kitchen" &&
        calculatorState.officeDetails &&
        !calculatorState.officeDetails.hasKitchen
      ) {
        return false;
      }
      return true;
    }
  );

  const completion = getCalculatorCompletion(calculatorState);
  const validation = validateCalculatorState(calculatorState);

  // Live price follows the area draft immediately (without waiting for blur).
  const liveArea = (() => {
    const parsed = Number(areaDraft);
    if (Number.isFinite(parsed) && parsed > 0) {
      return parsed;
    }
    return calculatorState.area;
  })();
  const pricingState = {
    ...calculatorState,
    area: liveArea,
  };
  const price = calculateCleaningPrice(pricingState);
  const mobileSummary = getMobileSummaryModel({
    total: price.total,
    currency: price.currency,
    isReady: completion.isReady,
  });

  const areaError =
    areaTouched || showValidation
      ? getAreaValidationError(areaDraft, areaDefaults)
      : null;

  const visibleErrors = {
    ...(showValidation ? validation.errors : {}),
    ...(areaError ? { area: areaError } : {}),
  };

  useEffect(() => {
    const applyPayload = (payload) => {
      if (!payload) {
        return;
      }
      setCalculatorState((prev) => {
        const next = applyCalculatorPrefill(prev, payload);
        setAreaDraft(String(next.area));
        return next;
      });
      clearPrefillPayload();
    };

    applyPayload(readPrefillPayload());

    const onPrefill = (event) => {
      applyPayload(event.detail);
    };

    window.addEventListener(CALCULATOR_PREFILL_EVENT, onPrefill);
    return () => window.removeEventListener(CALCULATOR_PREFILL_EVENT, onPrefill);
  }, []);

  const update = (nextState) => {
    setCalculatorState(nextState);
  };

  const handleAreaInputChange = (event) => {
    setAreaDraft(event.target.value);
    setAreaTouched(true);
  };

  const handleAreaInputBlur = () => {
    setAreaTouched(true);
    const error = getAreaValidationError(areaDraft, areaDefaults);
    if (error) {
      return;
    }

    const next = applyCalculatorPatch(calculatorState, {
      area: Number(areaDraft),
    });
    update(next);
    setAreaDraft(String(next.area));
  };

  const handleCommentChange = (event) => {
    update(
      applyCalculatorPatch(calculatorState, {
        comment: event.target.value.slice(0, COMMENT_MAX_LENGTH),
      })
    );
  };

  const handleRequestQuote = () => {
    setShowValidation(true);
    const result = validateCalculatorState(calculatorState);
    const draftAreaError = getAreaValidationError(areaDraft, areaDefaults);

    if (!result.valid || draftAreaError) {
      if (draftAreaError || result.errors.selectedZones) {
        const target = draftAreaError
          ? document.getElementById("calculator-area")
          : document.getElementById("calculator-zones");
        target?.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    const committed = applyCalculatorPatch(result.normalized, {
      area: Number(areaDraft),
    });
    update(committed);
    setAreaDraft(String(committed.area));

    if (typeof window !== "undefined") {
      setRequestSourceUrl(window.location.href);
      try {
        const raw = window.sessionStorage.getItem(
          CALCULATOR_PREFILL_STORAGE_KEY
        );
        setRequestPreset(raw ? JSON.parse(raw) : null);
      } catch {
        setRequestPreset(null);
      }
    }

    setRequestOpen(true);
  };

  const scrollToSummary = () => {
    const panel = document.getElementById("calculator-summary-mobile");
    panel?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleMobileCta = () => {
    if (mobileSummary.action === "submit") {
      handleRequestQuote();
      return;
    }
    setShowValidation(true);
    scrollToSummary();
  };

  return (
    <section
      id={SECTION_IDS.calculator}
      className={`bg-gradient-to-b from-cleantry-mint/30 via-white to-slate-50/80 ${SECTION_PADDING} ${SECTION_SCROLL_MARGIN}`}
    >
      <Container>
        <SectionHeader
          eyebrow="Калькулятор стоимости"
          title="Рассчитайте уборку за пару минут"
          description="Сначала выберите помещение и формат, затем уточните объём работ — ориентировочная стоимость обновится сразу."
        />

        <CalculatorCompletionBar completion={completion} />

        <div className="mt-10 grid gap-8 pb-24 lg:grid-cols-[1.7fr_0.9fr] lg:items-start lg:pb-0">
          <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm sm:p-8">
            <CalculatorBlock
              id="calculator-property-type"
              title="Тип помещения"
              description="От типа помещения зависят доступные форматы, зоны и дополнительные опции."
            >
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {propertyTypes.map((item) => (
                  <CalculatorOptionCard
                    key={item.id}
                    className="h-full"
                    selected={calculatorState.propertyType === item.id}
                    onSelect={() => {
                      const next = setPropertyType(calculatorState, item.id);
                      update(next);
                      setAreaDraft(String(next.area));
                      setAreaTouched(false);
                    }}
                    label={item.label}
                    description={item.description}
                    icon={propertyIcons[item.id]}
                  />
                ))}
              </div>
            </CalculatorBlock>

            <CalculatorBlock
              id="calculator-cleaning-format"
              title="Формат уборки"
              description="Показываем только форматы, доступные для выбранного помещения."
            >
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {formats.map((format) => (
                  <CalculatorOptionCard
                    key={format.id}
                    className="h-full"
                    selected={calculatorState.cleaningFormat === format.id}
                    onSelect={() =>
                      update(setCleaningFormat(calculatorState, format.id))
                    }
                    label={format.label}
                    description={format.description}
                    icon={formatIcons[format.id]}
                  />
                ))}
              </div>
            </CalculatorBlock>

            <CalculatorBlock
              id="calculator-scope"
              title="Объём уборки"
              description="Выберите, убираем ли всё помещение целиком или только отдельные зоны."
            >
              <div className="grid gap-3 sm:grid-cols-2">
                {cleaningScopeOptions.map((scope) => (
                  <CalculatorOptionCard
                    key={scope.id}
                    selected={calculatorState.cleaningScope === scope.id}
                    onSelect={() =>
                      update(setCleaningScope(calculatorState, scope.id))
                    }
                    label={scope.label}
                    description={scope.description}
                  />
                ))}
              </div>
            </CalculatorBlock>

            <CalculatorBlock
              id="calculator-details"
              title="Детали помещения"
              description={
                isOffice
                  ? "Площадь и состав офиса входят в расчёт при уборке всего помещения."
                  : "Площадь влияет на расчёт. Количество комнат уточняет планировку и не заменяет выбор зон."
              }
            >
              <div className="grid gap-6 sm:grid-cols-2">
                <CalculatorField
                  label="Площадь"
                  htmlFor="calculator-area"
                  error={areaError}
                  hint={
                    areaError
                      ? undefined
                      : `От ${areaDefaults.minArea} до ${areaDefaults.maxArea} м²`
                  }
                >
                  <div className="relative">
                    <input
                      id="calculator-area"
                      type="number"
                      min={areaDefaults.minArea}
                      max={areaDefaults.maxArea}
                      value={areaDraft}
                      onChange={handleAreaInputChange}
                      onBlur={handleAreaInputBlur}
                      suppressHydrationWarning
                      aria-invalid={Boolean(areaError)}
                      className={cn(
                        "w-full rounded-xl border bg-white px-4 py-3 pr-12 text-slate-900 transition-colors focus:outline-none focus:ring-2",
                        areaError
                          ? "border-amber-400 focus:border-amber-400 focus:ring-amber-100"
                          : "border-slate-200 focus:border-emerald-400 focus:ring-emerald-100"
                      )}
                    />
                    <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate-400">
                      м²
                    </span>
                  </div>
                </CalculatorField>

                {showBathrooms && (
                  <CalculatorField
                    label="Санузлы"
                    hint={
                      showZones
                        ? "Укажите, сколько санузлов нужно убрать в выбранной зоне."
                        : "При уборке всего помещения доплата зависит от числа санузлов."
                    }
                  >
                    <SegmentedControl
                      options={[...bathroomOptions]}
                      value={calculatorState.bathrooms}
                      onChange={(value) =>
                        update(
                          applyCalculatorPatch(calculatorState, {
                            bathrooms: value,
                          })
                        )
                      }
                      ariaLabel="Количество санузлов"
                    />
                  </CalculatorField>
                )}

                {!isOffice && (
                  <CalculatorField
                    label="Комнаты"
                    hint="Для понимания планировки. Не заменяет выбор отдельных зон."
                  >
                    <SegmentedControl
                      options={[...residentialRoomOptions]}
                      value={calculatorState.rooms}
                      onChange={(value) =>
                        update(
                          applyCalculatorPatch(calculatorState, {
                            rooms: value,
                          })
                        )
                      }
                      ariaLabel="Количество комнат"
                    />
                  </CalculatorField>
                )}

                {isOffice && calculatorState.officeDetails && (
                  <>
                    <CalculatorField
                      label="Кол-во рабочих мест"
                      hint="Влияет на стоимость при уборке всего офиса и на множитель зоны «Рабочие места»."
                    >
                      <SegmentedControl
                        options={[...officeWorkspaceOptions]}
                        value={calculatorState.officeDetails.workspaces}
                        onChange={(value) =>
                          update(
                            applyCalculatorPatch(calculatorState, {
                              officeDetails: { workspaces: value },
                            })
                          )
                        }
                        ariaLabel="Количество рабочих мест"
                      />
                    </CalculatorField>
                    <CalculatorField
                      label="Переговорные"
                      hint="Учитывается в составе офиса или как множитель зоны «Переговорные»."
                    >
                      <SegmentedControl
                        options={[...officeMeetingRoomOptions]}
                        value={calculatorState.officeDetails.meetingRooms}
                        onChange={(value) =>
                          update(
                            applyCalculatorPatch(calculatorState, {
                              officeDetails: { meetingRooms: value },
                            })
                          )
                        }
                        ariaLabel="Количество переговорных"
                      />
                    </CalculatorField>
                    <CalculatorField
                      label="Кухня в офисе"
                      hint="Если кухни нет, зона «Кухня» скрывается и не входит в расчёт."
                    >
                      <SegmentedControl
                        options={[
                          { id: "yes", label: "Есть" },
                          { id: "no", label: "Нет" },
                        ]}
                        value={
                          calculatorState.officeDetails.hasKitchen
                            ? "yes"
                            : "no"
                        }
                        onChange={(value) =>
                          update(
                            applyCalculatorPatch(calculatorState, {
                              officeDetails: { hasKitchen: value === "yes" },
                            })
                          )
                        }
                        ariaLabel="Наличие кухни"
                      />
                    </CalculatorField>
                  </>
                )}
              </div>
            </CalculatorBlock>

            {showZones && (
              <CalculatorBlock
                id="calculator-zones"
                title="Выбор зон"
                description="Отметьте зоны, которые нужно включить в расчёт."
                hint="Количество комнат и санузлов выше описывает объект; здесь — только то, что убираем сейчас."
              >
                {visibleErrors.selectedZones && (
                  <p className="text-sm text-amber-700" role="alert">
                    {visibleErrors.selectedZones}
                  </p>
                )}
                <div className="grid gap-3 sm:grid-cols-2">
                  {zones.map((zone) => (
                    <CalculatorOptionCard
                      key={zone.id}
                      selected={calculatorState.selectedZones.includes(zone.id)}
                      onSelect={() =>
                        update(toggleZone(calculatorState, zone.id))
                      }
                      label={zone.label}
                      description={zone.description}
                      priceLabel={`+${zone.price} BYN`}
                    />
                  ))}
                </div>
              </CalculatorBlock>
            )}

            <CalculatorBlock
              id="calculator-frequency"
              title="Регулярность"
              description="Скидка применяется к стоимости уборки, но не к дополнительным услугам."
            >
              <SegmentedControl
                options={frequencyList}
                value={calculatorState.frequency}
                onChange={(value) =>
                  update(
                    applyCalculatorPatch(calculatorState, { frequency: value })
                  )
                }
                ariaLabel="Регулярность уборки"
              />
            </CalculatorBlock>

            <CalculatorBlock
              id="calculator-extras"
              title="Дополнительные услуги"
              description="Показываем только опции, совместимые с выбранным помещением и форматом."
            >
              {extras.length === 0 ? (
                <p className="text-sm text-slate-500">
                  Для этой комбинации дополнительные услуги недоступны.
                </p>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2">
                  {extras.map((extra) => (
                    <CalculatorOptionCard
                      key={extra.id}
                      compact
                      selected={calculatorState.selectedExtras.includes(
                        extra.id
                      )}
                      onSelect={() =>
                        update(toggleExtra(calculatorState, extra.id))
                      }
                      label={extra.label}
                      priceLabel={`+${extra.price} BYN`}
                    />
                  ))}
                </div>
              )}
            </CalculatorBlock>

            <CalculatorBlock id="calculator-comment" title="Комментарий">
              <CalculatorField
                label="Комментарий"
                htmlFor="calculator-comment-field"
              >
                <textarea
                  id="calculator-comment-field"
                  rows={4}
                  value={calculatorState.comment}
                  onChange={handleCommentChange}
                  placeholder="Например, есть животные, нужен акцент на кухне и санузле, удобное время — после 14:00"
                  suppressHydrationWarning
                  className="w-full resize-y rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm leading-relaxed text-slate-900 transition-colors placeholder:text-slate-400 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                />
                <p className="text-right text-xs text-slate-400">
                  {calculatorState.comment.length} / {COMMENT_MAX_LENGTH}
                </p>
              </CalculatorField>
            </CalculatorBlock>
          </div>

          <CalculatorSummary
            calculatorState={pricingState}
            price={price}
            onRequestQuote={handleRequestQuote}
            variant="desktop"
            errors={visibleErrors}
          />

          <div className="lg:hidden">
            <CalculatorSummary
              id="calculator-summary-mobile"
              calculatorState={pricingState}
              price={price}
              onRequestQuote={handleRequestQuote}
              variant="panel"
              errors={visibleErrors}
            />
          </div>
        </div>
      </Container>

      <CalculatorMobileBar
        totalLabel={mobileSummary.totalLabel}
        ctaLabel={mobileSummary.ctaLabel}
        ctaDisabled={false}
        onCta={handleMobileCta}
      />

      {requestOpen ? (
        <RequestQuoteDialog
          onClose={() => setRequestOpen(false)}
          calculatorState={calculatorState}
          price={price}
          sourceUrl={requestSourceUrl}
          preset={requestPreset}
          onSubmitted={(payload) => {
            update(
              applyCalculatorPatch(calculatorState, {
                comment: payload.contact.comment,
                contact: {
                  name: payload.contact.name,
                  phone: payload.contact.phone,
                  preferredContactMethod: payload.contact.preferredContactMethod,
                  preferredDate: payload.contact.preferredDate,
                  preferredTime: payload.contact.preferredTime,
                },
              })
            );
          }}
        />
      ) : null}
    </section>
  );
}
