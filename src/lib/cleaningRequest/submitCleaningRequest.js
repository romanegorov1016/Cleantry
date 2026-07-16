/**
 * Service adapter for cleaning request submission.
 * Mock only — no real network / CRM / email.
 *
 * @param {import('./types.js').CleaningRequestPayload} payload
 * @param {{
 *   delayMs?: number,
 *   forceError?: boolean,
 *   shouldFail?: (payload: import('./types.js').CleaningRequestPayload) => boolean,
 * }} [options]
 * @returns {Promise<import('./types.js').CleaningRequestSubmitResult>}
 */
export async function submitCleaningRequest(payload, options = {}) {
  const delayMs = options.delayMs ?? 450;

  if (delayMs > 0) {
    await new Promise((resolve) => {
      setTimeout(resolve, delayMs);
    });
  }

  const fail =
    options.forceError === true ||
    (typeof options.shouldFail === "function" && options.shouldFail(payload));

  if (fail) {
    return {
      ok: false,
      error: {
        code: "server_error",
        message:
          "Не удалось отправить заявку. Попробуйте ещё раз через минуту.",
      },
    };
  }

  const requestId = `mock-${Date.now().toString(36)}-${Math.random()
    .toString(36)
    .slice(2, 8)}`;

  if (typeof process !== "undefined" && process.env.NODE_ENV !== "production") {
    // Helpful during local UI work; never hits external services.
    console.info("[submitCleaningRequest:mock]", {
      requestId,
      phone: payload.contact.phone,
      total: payload.snapshot.price.rangeLabel,
    });
  }

  return {
    ok: true,
    requestId,
  };
}
