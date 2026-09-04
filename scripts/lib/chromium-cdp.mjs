import { access } from "node:fs/promises";
import { performance } from "node:perf_hooks";

const maximumPdfPrintTimeoutMs = 300_000;
const maximumPdfPrintRetryDelayMs = 10_000;
const pdfPrintAttemptLimit = 2;

const defaultClock = Object.freeze({
  now: () => performance.now(),
  wait: (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds)),
});

export class ChromeDevToolsProtocolError extends Error {
  constructor(method, protocolError) {
    const code = Number.isSafeInteger(protocolError?.code) ? protocolError.code : null;
    const protocolMessage = typeof protocolError?.message === "string"
      ? protocolError.message.slice(0, 512)
      : "unknown protocol error";
    const codeSuffix = code === null ? "" : ` (${code})`;
    super(`Chrome DevTools ${method} failed${codeSuffix}: ${protocolMessage}`);
    this.name = "ChromeDevToolsProtocolError";
    this.method = method;
    this.code = code;
    this.protocolMessage = protocolMessage;
  }
}

export class PdfPrintRetryExhaustedError extends Error {
  constructor({ attempts, cause, totalTimeoutMs }) {
    super(
      `Chrome DevTools Page.printToPDF returned "Printing failed" after ${attempts} `
        + `${attempts === 1 ? "attempt" : "attempts"} within its ${totalTimeoutMs} ms budget.`,
      { cause },
    );
    this.name = "PdfPrintRetryExhaustedError";
    this.attempts = attempts;
    this.totalTimeoutMs = totalTimeoutMs;
  }
}

function boundedMilliseconds(value, label, maximum) {
  if (!Number.isSafeInteger(value) || value < 1 || value > maximum) {
    throw new Error(`${label} must be an integer from 1 through ${maximum} milliseconds.`);
  }
  return value;
}

function retryablePdfPrintFailure(error) {
  return error instanceof ChromeDevToolsProtocolError
    && error.method === "Page.printToPDF"
    && error.protocolMessage === "Printing failed";
}

export async function printPageToPdf(cdp, params, {
  clock = defaultClock,
  onRetry,
  retryDelayMs = 1_000,
  totalTimeoutMs = maximumPdfPrintTimeoutMs,
} = {}) {
  if (!cdp || typeof cdp.send !== "function") {
    throw new Error("A Chrome DevTools client is required for PDF printing.");
  }
  if (!clock || typeof clock.now !== "function" || typeof clock.wait !== "function") {
    throw new Error("The PDF print clock must provide now and wait functions.");
  }
  if (onRetry !== undefined && typeof onRetry !== "function") {
    throw new Error("The PDF print retry observer must be a function.");
  }
  const timeout = boundedMilliseconds(
    totalTimeoutMs, "PDF print timeout", maximumPdfPrintTimeoutMs,
  );
  const retryDelay = boundedMilliseconds(
    retryDelayMs, "PDF print retry delay", maximumPdfPrintRetryDelayMs,
  );
  const deadline = clock.now() + timeout;
  let attempts = 0;

  while (attempts < pdfPrintAttemptLimit) {
    const remainingMs = Math.floor(deadline - clock.now());
    if (remainingMs < 1) {
      throw new PdfPrintRetryExhaustedError({ attempts, cause: undefined, totalTimeoutMs: timeout });
    }
    attempts += 1;
    try {
      const result = await cdp.send("Page.printToPDF", params, remainingMs);
      if (typeof result?.data !== "string" || result.data.length === 0) {
        throw new Error("Chrome DevTools Page.printToPDF returned no PDF data.");
      }
      return result;
    } catch (error) {
      if (!retryablePdfPrintFailure(error)) throw error;
      if (attempts === pdfPrintAttemptLimit) {
        throw new PdfPrintRetryExhaustedError({ attempts, cause: error, totalTimeoutMs: timeout });
      }
      const remainingBeforeDelay = Math.floor(deadline - clock.now());
      if (remainingBeforeDelay <= retryDelay) {
        throw new PdfPrintRetryExhaustedError({ attempts, cause: error, totalTimeoutMs: timeout });
      }
      onRetry?.({
        attempt: attempts,
        delayMs: retryDelay,
        nextAttempt: attempts + 1,
        remainingMs: remainingBeforeDelay,
      });
      await clock.wait(retryDelay);
    }
  }
  throw new Error("PDF print attempt bound was exhausted unexpectedly.");
}

export const chromiumCandidates = Object.freeze([
  process.env.CHROME_PATH,
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
  "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
  "/usr/bin/google-chrome",
  "/usr/bin/google-chrome-stable",
  "/usr/bin/chromium",
  "/usr/bin/chromium-browser",
].filter((candidate) => typeof candidate === "string" && candidate.length > 0));

export async function firstExistingChromium(paths = chromiumCandidates) {
  for (const candidate of paths) {
    try {
      await access(candidate);
      return candidate;
    } catch {
      // Continue to the next installed browser candidate.
    }
  }
  throw new Error("Chrome, Chromium, or Edge is required for rendered browser verification.");
}

export async function waitForUrl(url, process, timeoutMs = 60_000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    if (process?.exitCode !== null && process?.exitCode !== undefined) {
      throw new Error(`Required process exited with code ${process.exitCode}.`);
    }
    try {
      const response = await fetch(url);
      if (response.ok) return response;
    } catch {
      // The process or HTTP listener is still starting.
    }
    await new Promise((resolve) => setTimeout(resolve, 350));
  }
  throw new Error(`Timed out waiting for ${url}.`);
}

export async function devtoolsPage(browserProcess, debugPort) {
  const endpoint = `http://127.0.0.1:${debugPort}/json/list`;
  const response = await waitForUrl(endpoint, browserProcess);
  const targets = await response.json();
  const page = targets.find((target) => target.type === "page");
  if (!page?.webSocketDebuggerUrl) {
    throw new Error("The headless browser did not expose a page target.");
  }
  return page.webSocketDebuggerUrl;
}

export async function connectCdp(webSocketUrl) {
  const socket = new WebSocket(webSocketUrl);
  await new Promise((resolve, reject) => {
    socket.addEventListener("open", resolve, { once: true });
    socket.addEventListener("error", reject, { once: true });
  });

  let nextId = 0;
  const pending = new Map();
  socket.addEventListener("message", (event) => {
    const message = JSON.parse(String(event.data));
    if (!message.id || !pending.has(message.id)) return;
    const { method, resolve, reject, timeout } = pending.get(message.id);
    clearTimeout(timeout);
    pending.delete(message.id);
    if (message.error) reject(new ChromeDevToolsProtocolError(method, message.error));
    else resolve(message.result);
  });

  function send(method, params = {}, timeoutMs = 240_000) {
    return new Promise((resolve, reject) => {
      const id = ++nextId;
      const timeout = setTimeout(() => {
        pending.delete(id);
        reject(new Error(`Chrome DevTools command timed out: ${method}`));
      }, timeoutMs);
      pending.set(id, { method, resolve, reject, timeout });
      socket.send(JSON.stringify({ id, method, params }));
    });
  }

  return { socket, send };
}

function processStopped(process) {
  return process.exitCode !== null || process.signalCode !== null;
}

function stopTimeout(value, label) {
  if (!Number.isSafeInteger(value) || value < 1 || value > 60_000) {
    throw new Error(`${label} must be an integer from 1 through 60000 milliseconds.`);
  }
  return value;
}

function waitForProcessExit(process, timeoutMs) {
  if (processStopped(process)) return Promise.resolve(true);
  return new Promise((resolve, reject) => {
    const finish = (callback, value) => {
      clearTimeout(timeout);
      process.off("exit", onExit);
      process.off("error", onError);
      callback(value);
    };
    const onExit = () => finish(resolve, true);
    const onError = (error) => finish(reject, error);
    const timeout = setTimeout(() => finish(resolve, processStopped(process)), timeoutMs);
    process.once("exit", onExit);
    process.once("error", onError);
  });
}

export async function stopProcess(process, {
  terminationGraceMs = 5_000,
  forcedExitWaitMs = 5_000,
} = {}) {
  if (!process || processStopped(process)) return;
  const grace = stopTimeout(terminationGraceMs, "Termination grace");
  const forcedWait = stopTimeout(forcedExitWaitMs, "Forced-exit wait");
  const gracefulExit = waitForProcessExit(process, grace);
  process.kill("SIGTERM");
  if (await gracefulExit) return;
  const forcedExit = waitForProcessExit(process, forcedWait);
  if (!processStopped(process)) process.kill("SIGKILL");
  if (!await forcedExit) {
    throw new Error(`Process ${process.pid ?? "unknown"} did not exit after SIGKILL.`);
  }
}
