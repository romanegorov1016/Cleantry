import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { RequestQuoteDialog } from "@/components/calculator/RequestQuoteDialog";
import { createInitialCalculatorState } from "@/lib/calculator";
import { calculateCleaningPrice } from "@/lib/calculateCleaningPrice";
import { REQUEST_SUBMIT_STATUS } from "@/lib/cleaningRequest";

afterEach(() => {
  cleanup();
  document.body.style.overflow = "";
});

function setup(overrides = {}) {
  const calculatorState = createInitialCalculatorState();
  const price = calculateCleaningPrice(calculatorState);
  const onClose = vi.fn();
  const submitFn = vi.fn(async () => ({
    ok: true,
    requestId: "mock-test-1",
  }));
  const onSubmitted = vi.fn();

  const user = userEvent.setup();
  render(
    <RequestQuoteDialog
      onClose={onClose}
      calculatorState={calculatorState}
      price={price}
      sourceUrl="https://example.test/calc"
      preset={{ kind: "cleaningFormat", id: "deep" }}
      submitFn={submitFn}
      onSubmitted={onSubmitted}
      {...overrides}
    />
  );

  return { user, onClose, submitFn, onSubmitted, calculatorState, price };
}

async function fillRequired(user, options = {}) {
  await screen.findByTestId("request-quote-form");

  fireEvent.change(screen.getByLabelText(/^Имя/i), {
    target: { value: options.name ?? "Анна" },
  });
  fireEvent.change(screen.getByLabelText(/^Телефон/i), {
    target: { value: options.phone ?? "+375291234567" },
  });
  fireEvent.click(screen.getByRole("radio", { name: "Telegram" }));
  fireEvent.click(screen.getByRole("checkbox"));
}

describe("RequestQuoteDialog", () => {
  it("shows field errors for required fields", async () => {
    const { user } = setup();

    await user.click(screen.getByTestId("request-submit-button"));

    expect(screen.getByText("Укажите имя")).toBeTruthy();
    expect(screen.getByText(/номер телефона/i)).toBeTruthy();
    expect(screen.getByText("Выберите способ связи")).toBeTruthy();
    expect(screen.getByText(/согласие на обработку/i)).toBeTruthy();
  });

  it("shows invalid phone error near the phone field", async () => {
    const { user } = setup();
    await screen.findByTestId("request-quote-form");

    fireEvent.change(screen.getByLabelText(/^Имя/i), {
      target: { value: "Анна" },
    });
    fireEvent.change(screen.getByLabelText(/^Телефон/i), {
      target: { value: "123" },
    });
    await user.click(screen.getByRole("radio", { name: "Звонок" }));
    await user.click(screen.getByRole("checkbox"));
    await user.click(screen.getByTestId("request-submit-button"));

    const phoneInput = screen.getByLabelText(/^Телефон/i);
    expect(phoneInput.getAttribute("aria-invalid")).toBe("true");
    expect(screen.getByText(/не хватает цифр/i)).toBeTruthy();
  });

  it("submits payload with calculator snapshot", async () => {
    const { user, submitFn, onSubmitted } = setup();
    await fillRequired(user);
    fireEvent.change(screen.getByLabelText(/Комментарий/i), {
      target: { value: "Домофон 5" },
    });

    await user.click(screen.getByTestId("request-submit-button"));

    await waitFor(() => expect(submitFn).toHaveBeenCalledTimes(1));
    const payload = submitFn.mock.calls[0][0];

    expect(payload.contact.name).toBe("Анна");
    expect(payload.contact.phone).toContain("375");
    expect(payload.contact.preferredContactMethod).toBe("telegram");
    expect(payload.contact.comment).toBe("Домофон 5");
    expect(payload.snapshot.propertyType).toBe("apartment");
    expect(payload.snapshot.area).toBeTypeOf("number");
    expect(payload.snapshot.sourceUrl).toBe("https://example.test/calc");
    expect(payload.snapshot.preset).toEqual({
      kind: "cleaningFormat",
      id: "deep",
    });
    expect(payload.consentAccepted).toBe(true);

    await waitFor(() => expect(onSubmitted).toHaveBeenCalled());
    expect(screen.getByTestId("request-success-panel")).toBeTruthy();
  });

  it("shows loading state and blocks double submit", async () => {
    let resolveSubmit;
    const submitFn = vi.fn(
      () =>
        new Promise((resolve) => {
          resolveSubmit = resolve;
        })
    );
    const { user } = setup({ submitFn });
    await fillRequired(user);

    await user.click(screen.getByTestId("request-submit-button"));
    expect(screen.getByTestId("request-submit-button").textContent).toMatch(
      /Отправляем/
    );
    expect(screen.getByTestId("request-submit-button").disabled).toBe(true);

    await user.click(screen.getByTestId("request-submit-button"));
    expect(submitFn).toHaveBeenCalledTimes(1);

    resolveSubmit({ ok: true, requestId: "mock-slow" });
    await waitFor(() =>
      expect(screen.getByTestId("request-success-panel")).toBeTruthy()
    );
  });

  it("keeps form data after server error", async () => {
    const submitFn = vi.fn(async () => ({
      ok: false,
      error: {
        code: "server_error",
        message: "Сервер недоступен",
      },
    }));
    const { user } = setup({ submitFn });
    await fillRequired(user, { name: "Мария", phone: "+375291112233" });

    await user.click(screen.getByTestId("request-submit-button"));

    await waitFor(() =>
      expect(screen.getByTestId("request-submit-error")).toBeTruthy()
    );
    expect(screen.getByText("Сервер недоступен")).toBeTruthy();
    expect(screen.getByLabelText(/^Имя/i).value).toBe("Мария");
    expect(screen.getByLabelText(/^Телефон/i).value).toBe("+375291112233");
    expect(screen.getByRole("radio", { name: "Telegram" }).checked).toBe(true);
  });

  it("shows success summary and allows intentional resubmit", async () => {
    const { user } = setup();
    await fillRequired(user);
    await user.click(screen.getByTestId("request-submit-button"));

    await waitFor(() =>
      expect(screen.getByTestId("request-success-panel")).toBeTruthy()
    );
    expect(screen.getByText(/Заявка принята/i)).toBeTruthy();
    expect(screen.getByText(/mock-test-1/)).toBeTruthy();

    await user.click(screen.getByTestId("request-edit-again"));
    expect(screen.getByTestId("request-quote-form")).toBeTruthy();
    expect(screen.getByLabelText(/^Имя/i).value).toBe("Анна");
  });

  it("manages focus when opened and restores on close", async () => {
    const trigger = document.createElement("button");
    trigger.textContent = "open";
    document.body.appendChild(trigger);
    trigger.focus();
    expect(document.activeElement).toBe(trigger);

    const onClose = vi.fn();
    const calculatorState = createInitialCalculatorState();
    const price = calculateCleaningPrice(calculatorState);
    const { unmount } = render(
      <RequestQuoteDialog
        onClose={onClose}
        calculatorState={calculatorState}
        price={price}
        submitFn={async () => ({ ok: true, requestId: "x" })}
      />
    );

    await waitFor(() => {
      const dialog = screen.getByTestId("request-quote-dialog");
      expect(dialog.contains(document.activeElement)).toBe(true);
    });

    const dialogRoot = screen.getByRole("dialog");
    expect(dialogRoot.getAttribute("aria-modal")).toBe("true");

    unmount();
    expect(document.activeElement).toBe(trigger);
    trigger.remove();
  });

  it("closes on Escape when not submitting", async () => {
    const { user, onClose } = setup();
    await user.keyboard("{Escape}");
    expect(onClose).toHaveBeenCalled();
  });
});

describe("submit status constants", () => {
  it("exposes expected states", () => {
    expect(REQUEST_SUBMIT_STATUS).toEqual({
      IDLE: "idle",
      SUBMITTING: "submitting",
      SUCCESS: "success",
      ERROR: "error",
    });
  });
});
