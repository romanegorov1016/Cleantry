"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Button } from "@/components/common/Button";
import { legalConfig } from "@/config/legal";
import {
  getCleaningFormat,
  getPropertyType,
  isOfficeProperty,
} from "@/catalog/selectors";
import { t } from "@/catalog/i18n";
import {
  cleaningScopeOptions,
  frequencyOptions,
  getCalculatorExtras,
  mapZonesForPricing,
} from "@/config/calculator";
import { CLEANING_SCOPE } from "@/lib/calculator";
import {
  buildCleaningRequestPayload,
  buildCleaningRequestSnapshot,
  createEmptyRequestFormValues,
  PREFERRED_CONTACT_METHODS,
  REQUEST_SUBMIT_STATUS,
  submitCleaningRequest,
  validateRequestForm,
} from "@/lib/cleaningRequest";
import { cn } from "@/lib/utils";

/**
 * @param {{
 *   onClose: () => void,
 *   calculatorState: import('@/lib/calculator/schema.js').CalculatorState,
 *   price: object,
 *   sourceUrl?: string,
 *   preset?: object | null,
 *   submitFn?: typeof submitCleaningRequest,
 *   onSubmitted?: (payload: import('@/lib/cleaningRequest/types.js').CleaningRequestPayload) => void,
 * }} props
 */
export function RequestQuoteDialog({
  onClose,
  calculatorState,
  price,
  sourceUrl = "",
  preset = null,
  submitFn = submitCleaningRequest,
  onSubmitted,
}) {
  const titleId = useId();
  const descriptionId = useId();
  const dialogRef = useRef(/** @type {HTMLDivElement | null} */ (null));
  const previouslyFocused = useRef(/** @type {Element | null} */ (null));

  const [status, setStatus] = useState(
    /** @type {import('@/lib/cleaningRequest/types.js').RequestSubmitStatus} */ (
      REQUEST_SUBMIT_STATUS.IDLE
    )
  );
  const [formValues, setFormValues] = useState(() => ({
    ...createEmptyRequestFormValues(),
    name: calculatorState.contact?.name ?? "",
    phone: calculatorState.contact?.phone ?? "",
    preferredContactMethod:
      calculatorState.contact?.preferredContactMethod ?? "",
    preferredDate: calculatorState.contact?.preferredDate ?? "",
    preferredTime: calculatorState.contact?.preferredTime ?? "",
    comment: calculatorState.comment ?? "",
    consentAccepted: false,
  }));
  const [fieldErrors, setFieldErrors] = useState(
    /** @type {Record<string, string>} */ ({})
  );
  const [submitError, setSubmitError] = useState("");
  const [lastPayload, setLastPayload] = useState(
    /** @type {import('@/lib/cleaningRequest/types.js').CleaningRequestPayload | null} */ (
      null
    )
  );
  const [requestId, setRequestId] = useState("");
  const [showValidation, setShowValidation] = useState(false);

  useEffect(() => {
    previouslyFocused.current = document.activeElement;

    const frame = window.requestAnimationFrame(() => {
      const root = dialogRef.current;
      const focusable = root?.querySelector(
        'input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])'
      );
      if (focusable instanceof HTMLElement) {
        focusable.focus();
      } else {
        root?.focus();
      }
    });

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.cancelAnimationFrame(frame);
      document.body.style.overflow = previousOverflow;
      if (previouslyFocused.current instanceof HTMLElement) {
        previouslyFocused.current.focus();
      }
    };
  }, []);

  useEffect(() => {
    /**
     * @param {KeyboardEvent} event
     */
    const onKeyDown = (event) => {
      if (event.key === "Escape" && status !== REQUEST_SUBMIT_STATUS.SUBMITTING) {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== "Tab" || !dialogRef.current) {
        return;
      }

      const focusable = [
        ...dialogRef.current.querySelectorAll(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        ),
      ].filter(
        (node) =>
          node instanceof HTMLElement &&
          !node.hasAttribute("disabled") &&
          node.getAttribute("aria-hidden") !== "true"
      );

      if (focusable.length === 0) {
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;

      if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose, status]);

  const snapshot = buildCleaningRequestSnapshot({
    calculatorState,
    price,
    sourceUrl,
    preset,
  });

  const isSubmitting = status === REQUEST_SUBMIT_STATUS.SUBMITTING;
  const isSuccess = status === REQUEST_SUBMIT_STATUS.SUCCESS;

  /**
   * @param {keyof import('@/lib/cleaningRequest/types.js').CleaningRequestFormValues} field
   * @param {string | boolean} value
   */
  const updateField = (field, value) => {
    setFormValues((prev) => ({ ...prev, [field]: value }));
    if (showValidation) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleEditAgain = () => {
    setStatus(REQUEST_SUBMIT_STATUS.IDLE);
    setSubmitError("");
    setRequestId("");
  };

  /**
   * @param {SubmitEvent | Event} event
   */
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isSubmitting) {
      return;
    }

    setShowValidation(true);
    const validation = validateRequestForm(formValues);
    setFieldErrors(validation.errors);

    if (!validation.valid) {
      setStatus(REQUEST_SUBMIT_STATUS.IDLE);
      const firstErrorField = Object.keys(validation.errors)[0];
      const node = dialogRef.current?.querySelector(
        `[name="${firstErrorField}"]`
      );
      if (node instanceof HTMLElement) {
        node.focus();
      }
      return;
    }

    const payload = buildCleaningRequestPayload({
      formValues,
      snapshot,
    });
    setLastPayload(payload);
    setStatus(REQUEST_SUBMIT_STATUS.SUBMITTING);
    setSubmitError("");

    try {
      const result = await submitFn(payload, { delayMs: 400 });
      if (!result.ok) {
        setStatus(REQUEST_SUBMIT_STATUS.ERROR);
        setSubmitError(result.error.message);
        return;
      }

      setRequestId(result.requestId);
      setStatus(REQUEST_SUBMIT_STATUS.SUCCESS);
      onSubmitted?.(payload);
    } catch {
      setStatus(REQUEST_SUBMIT_STATUS.ERROR);
      setSubmitError(
        "Не удалось отправить заявку. Проверьте соединение и попробуйте снова."
      );
    }
  };

  return (
    <div
      className="fixed inset-0 z-[80] flex items-end justify-center p-0 sm:items-center sm:p-4"
      data-testid="request-quote-dialog"
    >
      <button
        type="button"
        aria-label="Закрыть"
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-[1px]"
        disabled={isSubmitting}
        onClick={() => {
          if (!isSubmitting) {
            onClose();
          }
        }}
      />

      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        tabIndex={-1}
        className="relative z-[81] flex max-h-[92vh] w-full max-w-lg flex-col overflow-hidden rounded-t-3xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/20 sm:rounded-3xl"
      >
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-5 py-4 sm:px-6">
          <div>
            <h2
              id={titleId}
              className="text-lg font-semibold text-slate-900"
            >
              {isSuccess ? "Заявка отправлена" : "Оставить заявку"}
            </h2>
            <p id={descriptionId} className="mt-1 text-sm text-slate-500">
              {isSuccess
                ? "Мы свяжемся с вами выбранным способом."
                : "Данные расчёта уже включены — укажите, как с вами связаться."}
            </p>
          </div>
          <button
            type="button"
            className="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 disabled:opacity-40"
            aria-label="Закрыть окно"
            disabled={isSubmitting}
            onClick={onClose}
          >
            <span aria-hidden="true" className="text-xl leading-none">
              ×
            </span>
          </button>
        </div>

        <div className="overflow-y-auto px-5 py-5 sm:px-6">
          {isSuccess ? (
            <SuccessPanel
              requestId={requestId}
              payload={lastPayload}
              calculatorState={calculatorState}
              onClose={onClose}
              onEditAgain={handleEditAgain}
            />
          ) : (
            <form
              noValidate
              onSubmit={handleSubmit}
              className="space-y-5"
              data-testid="request-quote-form"
            >
              <SnapshotPreview
                calculatorState={calculatorState}
                snapshot={snapshot}
              />

              <Field
                label="Имя"
                htmlFor="request-name"
                error={showValidation ? fieldErrors.name : undefined}
                required
              >
                <input
                  id="request-name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  value={formValues.name}
                  disabled={isSubmitting}
                  aria-invalid={Boolean(showValidation && fieldErrors.name)}
                  aria-required="true"
                  onChange={(event) => updateField("name", event.target.value)}
                  className={inputClassName(
                    Boolean(showValidation && fieldErrors.name)
                  )}
                />
              </Field>

              <Field
                label="Телефон"
                htmlFor="request-phone"
                error={showValidation ? fieldErrors.phone : undefined}
                required
                hint="Можно с пробелами и скобками, например +375 29 123-45-67"
              >
                <input
                  id="request-phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  inputMode="tel"
                  value={formValues.phone}
                  disabled={isSubmitting}
                  aria-invalid={Boolean(showValidation && fieldErrors.phone)}
                  aria-required="true"
                  onChange={(event) => updateField("phone", event.target.value)}
                  className={inputClassName(
                    Boolean(showValidation && fieldErrors.phone)
                  )}
                />
              </Field>

              <fieldset>
                <legend className="text-sm font-medium text-slate-700">
                  Предпочитаемый способ связи{" "}
                  <span className="text-emerald-700">*</span>
                </legend>
                <div
                  className="mt-2 grid grid-cols-3 gap-2"
                  role="radiogroup"
                  aria-required="true"
                  aria-invalid={Boolean(
                    showValidation && fieldErrors.preferredContactMethod
                  )}
                >
                  {PREFERRED_CONTACT_METHODS.map((method) => {
                    const selected =
                      formValues.preferredContactMethod === method.id;
                    return (
                      <label
                        key={method.id}
                        className={cn(
                          "cursor-pointer rounded-xl border px-3 py-2.5 text-center text-sm font-medium transition",
                          selected
                            ? "border-emerald-500 bg-emerald-50 text-emerald-800"
                            : "border-slate-200 bg-white text-slate-700 hover:border-emerald-300",
                          isSubmitting && "pointer-events-none opacity-60"
                        )}
                      >
                        <input
                          type="radio"
                          className="sr-only"
                          name="preferredContactMethod"
                          value={method.id}
                          checked={selected}
                          disabled={isSubmitting}
                          onChange={() =>
                            updateField("preferredContactMethod", method.id)
                          }
                        />
                        {method.label}
                      </label>
                    );
                  })}
                </div>
                {showValidation && fieldErrors.preferredContactMethod ? (
                  <p className="mt-1.5 text-xs text-amber-700" role="alert">
                    {fieldErrors.preferredContactMethod}
                  </p>
                ) : null}
              </fieldset>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Желаемая дата" htmlFor="request-date">
                  <input
                    id="request-date"
                    name="preferredDate"
                    type="date"
                    value={formValues.preferredDate}
                    disabled={isSubmitting}
                    onChange={(event) =>
                      updateField("preferredDate", event.target.value)
                    }
                    className={inputClassName(false)}
                  />
                </Field>
                <Field label="Желаемое время" htmlFor="request-time">
                  <input
                    id="request-time"
                    name="preferredTime"
                    type="time"
                    value={formValues.preferredTime}
                    disabled={isSubmitting}
                    onChange={(event) =>
                      updateField("preferredTime", event.target.value)
                    }
                    className={inputClassName(false)}
                  />
                </Field>
              </div>

              <Field
                label="Комментарий"
                htmlFor="request-comment"
                hint="Необязательно — пожелания к уборке или доступу"
              >
                <textarea
                  id="request-comment"
                  name="comment"
                  rows={3}
                  value={formValues.comment}
                  disabled={isSubmitting}
                  onChange={(event) =>
                    updateField("comment", event.target.value)
                  }
                  className={cn(inputClassName(false), "resize-y")}
                />
              </Field>

              <div>
                <label className="flex cursor-pointer items-start gap-3 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    name="consentAccepted"
                    checked={formValues.consentAccepted}
                    disabled={isSubmitting}
                    aria-invalid={Boolean(
                      showValidation && fieldErrors.consentAccepted
                    )}
                    aria-required="true"
                    onChange={(event) =>
                      updateField("consentAccepted", event.target.checked)
                    }
                    className="mt-1 h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>{legalConfig.consentRequiredLabel}</span>
                </label>
                <p className="mt-1.5 pl-7 text-xs text-slate-500">
                  Подробнее в{" "}
                  <a
                    href={legalConfig.privacyPolicyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-emerald-700 underline-offset-2 hover:underline"
                  >
                    {legalConfig.privacyPolicyLabel}
                  </a>
                  .
                </p>
                {showValidation && fieldErrors.consentAccepted ? (
                  <p className="mt-1.5 text-xs text-amber-700" role="alert">
                    {fieldErrors.consentAccepted}
                  </p>
                ) : null}
              </div>

              {status === REQUEST_SUBMIT_STATUS.ERROR && submitError ? (
                <p
                  className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-800"
                  role="alert"
                  data-testid="request-submit-error"
                >
                  {submitError}
                </p>
              ) : null}

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full disabled:cursor-not-allowed disabled:opacity-60"
                data-testid="request-submit-button"
              >
                {isSubmitting ? "Отправляем…" : "Отправить заявку"}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

function inputClassName(hasError) {
  return cn(
    "w-full rounded-xl border bg-white px-4 py-3 text-sm text-slate-900 transition placeholder:text-slate-400 focus:outline-none focus:ring-2",
    hasError
      ? "border-amber-400 focus:border-amber-400 focus:ring-amber-100"
      : "border-slate-200 focus:border-emerald-400 focus:ring-emerald-100",
    "disabled:cursor-not-allowed disabled:bg-slate-50 disabled:opacity-70"
  );
}

function Field({ label, htmlFor, error, hint, required, children }) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={htmlFor} className="block text-sm font-medium text-slate-700">
        {label}
        {required ? <span className="text-emerald-700"> *</span> : null}
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

function SnapshotPreview({ calculatorState, snapshot }) {
  const property = getPropertyType(calculatorState.propertyType);
  const format = getCleaningFormat(calculatorState.cleaningFormat);
  const scope = cleaningScopeOptions.find(
    (item) => item.id === calculatorState.cleaningScope
  );
  const frequency =
    frequencyOptions[calculatorState.frequency] ?? frequencyOptions.once;

  return (
    <div
      className="rounded-2xl border border-emerald-100 bg-emerald-50/60 px-4 py-3 text-sm text-slate-700"
      data-testid="request-snapshot-preview"
    >
      <p className="font-medium text-slate-900">Из расчёта</p>
      <ul className="mt-2 space-y-1 text-slate-600">
        <li>
          {property ? t(property.label) : "—"} ·{" "}
          {format ? t(format.label) : "—"}
        </li>
        <li>
          {snapshot.area} м² · {scope?.label ?? "—"} · {frequency.label}
        </li>
        <li className="font-semibold text-emerald-800">
          {snapshot.price.rangeLabel}
        </li>
      </ul>
      {snapshot.pricingWarnings.length > 0 ? (
        <p className="mt-2 text-xs text-amber-800">
          Расчёт ориентировочный — детали уточним при связи.
        </p>
      ) : null}
    </div>
  );
}

function SuccessPanel({
  requestId,
  payload,
  calculatorState,
  onClose,
  onEditAgain,
}) {
  const property = getPropertyType(calculatorState.propertyType);
  const format = getCleaningFormat(calculatorState.cleaningFormat);
  const methodLabel =
    PREFERRED_CONTACT_METHODS.find(
      (item) => item.id === payload?.contact.preferredContactMethod
    )?.label ?? "—";

  const zoneCatalog = mapZonesForPricing(calculatorState.propertyType);
  const zoneLabels =
    calculatorState.cleaningScope === CLEANING_SCOPE.WHOLE
      ? ["Всё помещение"]
      : zoneCatalog
          .filter((zone) => calculatorState.selectedZones.includes(zone.id))
          .map((zone) => zone.label);

  const extras = getCalculatorExtras(
    calculatorState.propertyType,
    calculatorState.cleaningFormat
  ).filter((extra) => calculatorState.selectedExtras.includes(extra.id));

  return (
    <div className="space-y-5" data-testid="request-success-panel" role="status">
      <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-4">
        <p className="text-base font-semibold text-emerald-900">
          Спасибо! Заявка принята
        </p>
        <p className="mt-1 text-sm text-emerald-800">
          Номер обращения:{" "}
          <span className="font-mono text-emerald-950">{requestId}</span>
        </p>
      </div>

      <div className="space-y-2 text-sm text-slate-700">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          Кратко по заявке
        </p>
        <p>
          <span className="text-slate-500">Контакт:</span>{" "}
          {payload?.contact.name}, {payload?.contact.phone} ({methodLabel})
        </p>
        <p>
          <span className="text-slate-500">Объект:</span>{" "}
          {property ? t(property.label) : "—"},{" "}
          {format ? t(format.label) : "—"}, {calculatorState.area} м²
        </p>
        {!isOfficeProperty(calculatorState.propertyType) ? (
          <p>
            <span className="text-slate-500">Комнаты / санузлы:</span>{" "}
            {calculatorState.rooms} / {calculatorState.bathrooms}
          </p>
        ) : null}
        <p>
          <span className="text-slate-500">Зоны:</span> {zoneLabels.join(", ")}
        </p>
        {extras.length > 0 ? (
          <p>
            <span className="text-slate-500">Дополнительно:</span>{" "}
            {extras.map((extra) => extra.label).join(", ")}
          </p>
        ) : null}
        <p>
          <span className="text-slate-500">Ориентир:</span>{" "}
          {payload?.snapshot.price.rangeLabel}
        </p>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row">
        <Button type="button" onClick={onClose} className="flex-1">
          Закрыть
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onEditAgain}
          className="flex-1"
          data-testid="request-edit-again"
        >
          Изменить и отправить снова
        </Button>
      </div>
    </div>
  );
}
