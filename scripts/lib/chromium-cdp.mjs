import { access } from "node:fs/promises";

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
    const { resolve, reject, timeout } = pending.get(message.id);
    clearTimeout(timeout);
    pending.delete(message.id);
    if (message.error) reject(new Error(message.error.message));
    else resolve(message.result);
  });

  function send(method, params = {}, timeoutMs = 240_000) {
    return new Promise((resolve, reject) => {
      const id = ++nextId;
      const timeout = setTimeout(() => {
        pending.delete(id);
        reject(new Error(`Chrome DevTools command timed out: ${method}`));
      }, timeoutMs);
      pending.set(id, { resolve, reject, timeout });
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
