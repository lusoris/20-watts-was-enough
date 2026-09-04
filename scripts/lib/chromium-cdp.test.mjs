import assert from "node:assert/strict";
import test from "node:test";

import {
  ChromeDevToolsProtocolError,
  PdfPrintRetryExhaustedError,
  printPageToPdf,
} from "./chromium-cdp.mjs";

function controlledClock() {
  let milliseconds = 0;
  return {
    advance(value) {
      milliseconds += value;
    },
    now() {
      return milliseconds;
    },
    async wait(value) {
      milliseconds += value;
    },
  };
}

function printingFailed() {
  return new ChromeDevToolsProtocolError(
    "Page.printToPDF",
    { code: -32_000, message: "Printing failed", data: "not exposed" },
  );
}

test("Chrome DevTools protocol errors retain bounded method, code, and message diagnostics", () => {
  const error = new ChromeDevToolsProtocolError(
    "Page.printToPDF",
    { code: -32_000, message: "Printing failed", data: "not exposed" },
  );

  assert.equal(error.name, "ChromeDevToolsProtocolError");
  assert.equal(error.method, "Page.printToPDF");
  assert.equal(error.code, -32_000);
  assert.equal(error.protocolMessage, "Printing failed");
  assert.match(error.message, /Page\.printToPDF failed \(-32000\): Printing failed/u);
  assert.doesNotMatch(error.message, /not exposed/u);
});

test("PDF printing retries the exact terminal Chrome failure once inside the original budget", async () => {
  const clock = controlledClock();
  const calls = [];
  const retries = [];
  const cdp = {
    async send(method, params, timeoutMs) {
      calls.push({ method, params, timeoutMs });
      if (calls.length === 1) {
        clock.advance(20);
        throw printingFailed();
      }
      return { data: "JVBERi0=" };
    },
  };
  const params = { printBackground: true };

  const result = await printPageToPdf(cdp, params, {
    clock,
    onRetry: (retry) => retries.push(retry),
    retryDelayMs: 10,
    totalTimeoutMs: 100,
  });

  assert.deepEqual(result, { data: "JVBERi0=" });
  assert.deepEqual(calls, [
    { method: "Page.printToPDF", params, timeoutMs: 100 },
    { method: "Page.printToPDF", params, timeoutMs: 70 },
  ]);
  assert.deepEqual(retries, [{
    attempt: 1,
    delayMs: 10,
    nextAttempt: 2,
    remainingMs: 80,
  }]);
});

test("PDF printing does not retry a different protocol failure", async () => {
  const failure = new ChromeDevToolsProtocolError(
    "Page.printToPDF",
    { code: -32_000, message: "Invalid print parameters" },
  );
  let calls = 0;
  const cdp = {
    async send() {
      calls += 1;
      throw failure;
    },
  };

  await assert.rejects(
    printPageToPdf(cdp, {}, { retryDelayMs: 1, totalTimeoutMs: 10 }),
    (error) => error === failure,
  );
  assert.equal(calls, 1);
});

test("PDF printing reports typed exhaustion after the sole retry also fails", async () => {
  let calls = 0;
  const cdp = {
    async send() {
      calls += 1;
      throw printingFailed();
    },
  };

  await assert.rejects(
    printPageToPdf(cdp, {}, { retryDelayMs: 1, totalTimeoutMs: 10 }),
    (error) => {
      assert.ok(error instanceof PdfPrintRetryExhaustedError);
      assert.equal(error.attempts, 2);
      assert.equal(error.totalTimeoutMs, 10);
      assert.ok(error.cause instanceof ChromeDevToolsProtocolError);
      return true;
    },
  );
  assert.equal(calls, 2);
});

test("PDF printing does not begin a retry that cannot fit inside the total budget", async () => {
  const clock = controlledClock();
  let calls = 0;
  let waited = false;
  clock.wait = async () => {
    waited = true;
  };
  const cdp = {
    async send() {
      calls += 1;
      clock.advance(95);
      throw printingFailed();
    },
  };

  await assert.rejects(
    printPageToPdf(cdp, {}, { clock, retryDelayMs: 10, totalTimeoutMs: 100 }),
    (error) => {
      assert.ok(error instanceof PdfPrintRetryExhaustedError);
      assert.equal(error.attempts, 1);
      return true;
    },
  );
  assert.equal(calls, 1);
  assert.equal(waited, false);
});

test("PDF printing rejects an empty success response without retrying", async () => {
  let calls = 0;
  const cdp = {
    async send() {
      calls += 1;
      return {};
    },
  };

  await assert.rejects(
    printPageToPdf(cdp, {}, { retryDelayMs: 1, totalTimeoutMs: 10 }),
    /returned no PDF data/u,
  );
  assert.equal(calls, 1);
});
