import assert from "node:assert/strict";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import {
  ChromeDevToolsProtocolError,
  PdfPrintRetryExhaustedError,
  connectCdp,
  printPageToPdf,
  settleCleanupSteps,
  waitForDevtoolsPort,
  waitForUrl,
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

test("local URL readiness stops at caller cancellation", async () => {
  const controller = new AbortController();
  const reason = new Error("cancel URL wait");
  const waiting = waitForUrl(
    "http://127.0.0.1:1/not-listening",
    null,
    60_000,
    controller.signal,
  );
  setTimeout(() => controller.abort(reason), 5);
  await assert.rejects(waiting, (error) => error === reason);
});

test("Chrome-assigned debugging port is read from one bounded profile file", async (t) => {
  const profile = await mkdtemp(path.join(os.tmpdir(), "20w-devtools-port-test-"));
  t.after(() => rm(profile, { recursive: true, force: true }));
  await writeFile(
    path.join(profile, "DevToolsActivePort"),
    "37587\n/devtools/browser/01234567-89ab-cdef-0123-456789abcdef\n",
  );
  const browserProcess = { exitCode: null, signalCode: null };
  assert.equal(await waitForDevtoolsPort(profile, browserProcess), 37_587);

  await writeFile(
    path.join(profile, "DevToolsActivePort"),
    Buffer.alloc(513, "x"),
  );
  await assert.rejects(
    waitForDevtoolsPort(profile, browserProcess),
    /invalid or oversized|exceeds its byte limit/u,
  );
});

test("caller cancellation closes DevTools and rejects pending commands", async () => {
  class FakeSocket extends EventTarget {
    readyState = 0;

    close() {
      this.readyState = 3;
      this.dispatchEvent(new Event("close"));
    }

    open() {
      this.readyState = 1;
      this.dispatchEvent(new Event("open"));
    }

    send() {}
  }

  const socket = new FakeSocket();
  const controller = new AbortController();
  const connected = connectCdp("ws://127.0.0.1/devtools/page/test", {
    commandTimeoutMs: 10_000,
    openTimeoutMs: 10_000,
    signal: controller.signal,
    webSocketFactory: () => socket,
  });
  queueMicrotask(() => socket.open());
  const cdp = await connected;
  const pending = cdp.send("Runtime.evaluate");
  const reason = new Error("cancel DevTools");
  controller.abort(reason);
  await assert.rejects(pending, (error) => error === reason);
  assert.equal(socket.readyState, 3);
});

test("DevTools commands reject immediately after closing or while closing", async () => {
  class FakeSocket extends EventTarget {
    readyState = 0;

    close() {
      this.readyState = 3;
      this.dispatchEvent(new Event("close"));
    }

    open() {
      this.readyState = 1;
      this.dispatchEvent(new Event("open"));
    }

    send() {}
  }

  for (const state of [2, 3]) {
    const socket = new FakeSocket();
    const connected = connectCdp("ws://127.0.0.1/devtools/page/test", {
      webSocketFactory: () => socket,
    });
    queueMicrotask(() => socket.open());
    const cdp = await connected;
    if (state === 3) socket.close();
    else socket.readyState = state;
    await assert.rejects(
      async () => cdp.send("Runtime.evaluate"),
      state === 3 ? /closed before a response/u : /is not open/u,
    );
  }
});

test("ordered browser cleanup settles every step before reporting failures", async () => {
  const order = [];
  await assert.rejects(
    settleCleanupSteps([
      async () => order.push("socket"),
      async () => {
        order.push("browser");
        throw new Error("browser stop failed");
      },
      async () => order.push("server"),
      async () => order.push("profile"),
    ]),
    AggregateError,
  );
  assert.deepEqual(order, ["socket", "browser", "server", "profile"]);
});
