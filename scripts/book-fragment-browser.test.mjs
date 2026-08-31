import assert from "node:assert/strict";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { createServer as createTcpServer } from "node:net";
import os from "node:os";
import path from "node:path";
import { spawn } from "node:child_process";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { createServer as createViteServer } from "vite";
import {
  connectCdp,
  devtoolsPage,
  firstExistingChromium,
  stopProcess,
} from "./lib/chromium-cdp.mjs";

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const coldTarget =
  "book-concept-07-cross-domain-convergence-md--candidate-production-is-not-acceptance";
const navigationSource =
  "book-math-visual-models-md--sparselocality-break-even-plane";
const hashTarget = "book-concept-80-energy-model-md--data-movement-ledger";
const pagesBasePath = "/20-watts-was-enough/";
const viewports = Object.freeze([
  { label: "desktop", width: 1440, height: 900, minimumClearance: 8 },
  { label: "mobile", width: 375, height: 844, minimumClearance: 20 },
]);

async function reserveLocalPort() {
  const server = createTcpServer();
  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", resolve);
  });
  const address = server.address();
  assert.equal(typeof address, "object");
  const port = address.port;
  await new Promise((resolve, reject) => server.close((error) => (
    error ? reject(error) : resolve()
  )));
  return port;
}

async function fragmentSnapshot(cdp, targetId) {
  return (await cdp.send("Runtime.evaluate", {
    expression: `(() => {
      const target = document.getElementById(${JSON.stringify(targetId)});
      const actions = document.querySelector(".book-actions");
      const targetRect = target?.getBoundingClientRect();
      const actionsRect = actions?.getBoundingClientRect();
      const actionsPosition = actions ? getComputedStyle(actions).position : null;
      const obstructionBottom = actionsPosition === "sticky"
        ? Math.max(0, actionsRect?.bottom ?? 0)
        : 0;
      return {
        actionsBottom: actionsRect?.bottom ?? null,
        actionsPosition,
        hash: location.hash,
        readyState: document.readyState,
        scrollMarginTop: target ? parseFloat(getComputedStyle(target).scrollMarginTop) : null,
        scrollY,
        tagName: target?.tagName ?? null,
        targetBottom: targetRect?.bottom ?? null,
        targetText: target?.textContent?.trim() ?? null,
        targetTop: targetRect?.top ?? null,
        obstructionBottom,
        pathname: location.pathname,
        search: location.search,
        viewportHeight: innerHeight,
        viewportWidth: innerWidth,
      };
    })()`,
    returnByValue: true,
  })).result?.value;
}

async function waitForVisibleFragment(cdp, targetId, timeoutMs = 30_000) {
  const deadline = Date.now() + timeoutMs;
  let previous;
  let stableSamples = 0;
  let snapshot;

  while (Date.now() < deadline) {
    snapshot = await fragmentSnapshot(cdp, targetId);
    const visible =
      snapshot?.readyState === "complete"
      && snapshot.hash === `#${targetId}`
      && /^H[1-6]$/u.test(snapshot.tagName ?? "")
      && snapshot.targetBottom > 0
      && snapshot.targetTop >= snapshot.obstructionBottom
      && snapshot.targetTop < snapshot.viewportHeight;
    const stable = visible
      && previous
      && Math.abs(snapshot.targetTop - previous.targetTop) < 0.5
      && Math.abs(snapshot.scrollY - previous.scrollY) < 0.5;
    stableSamples = stable ? stableSamples + 1 : 0;
    if (stableSamples >= 5) return snapshot;
    previous = snapshot;
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  assert.fail(`Fragment did not become stably visible: ${JSON.stringify(snapshot)}`);
}

function assertFragmentClearance(snapshot, viewport, mode) {
  assert.equal(snapshot.viewportWidth, viewport.width, JSON.stringify(snapshot));
  assert.ok(snapshot.targetText, `${mode}: missing target text`);
  assert.ok(
    snapshot.targetTop >= snapshot.obstructionBottom + viewport.minimumClearance,
    `${mode}: heading is not clear of the action bar: ${JSON.stringify(snapshot)}`,
  );
  assert.ok(
    snapshot.targetBottom > 0 && snapshot.targetTop < snapshot.viewportHeight,
    `${mode}: heading is outside the viewport: ${JSON.stringify(snapshot)}`,
  );
  assert.ok(
    snapshot.scrollMarginTop >= viewport.minimumClearance,
    `${mode}: heading lacks fragment clearance: ${JSON.stringify(snapshot)}`,
  );
}

function assertFragmentLocation(snapshot, viewport) {
  assert.equal(snapshot.pathname, `${pagesBasePath}book/`, JSON.stringify(snapshot));
  assert.equal(snapshot.search, `?fragment-test=${viewport.label}`, JSON.stringify(snapshot));
}

async function retainFragmentEvidence(cdp, label, snapshot) {
  const outputRoot = process.env.BOOK_FRAGMENT_EVIDENCE_DIR?.trim();
  if (!outputRoot) return;
  await mkdir(outputRoot, { recursive: true });
  const screenshot = await cdp.send("Page.captureScreenshot", {
    captureBeyondViewport: false,
    format: "png",
    fromSurface: true,
  });
  await Promise.all([
    writeFile(
      path.join(outputRoot, `${label}.png`),
      Buffer.from(screenshot.data, "base64"),
      { flag: "wx" },
    ),
    writeFile(
      path.join(outputRoot, `${label}.json`),
      `${JSON.stringify(snapshot, null, 2)}\n`,
      { flag: "wx" },
    ),
  ]);
}

async function navigate(cdp, url) {
  const navigation = await cdp.send("Page.navigate", { url });
  assert.equal(navigation.errorText, undefined);
}

test("book fragments restore below the action bar on cold load and hash navigation", {
  timeout: 120_000,
}, async () => {
  const browser = await firstExistingChromium();
  const debugPort = await reserveLocalPort();
  const profile = await mkdtemp(path.join(os.tmpdir(), "20w-book-fragment-"));
  const previousPagesBasePath = process.env.PAGES_BASE_PATH;
  process.env.PAGES_BASE_PATH = pagesBasePath;
  let vite;
  let browserProcess;
  let cdp;

  try {
    vite = await createViteServer({
      configFile: path.join(repositoryRoot, "vite.pages.config.ts"),
      logLevel: "silent",
      server: { host: "127.0.0.1", port: 0 },
    });
    await vite.listen();
    const address = vite.httpServer?.address();
    assert.equal(typeof address, "object");
    browserProcess = spawn(browser, [
      "--headless=new",
      "--disable-gpu",
      "--disable-extensions",
      "--disable-background-networking",
      "--disable-dev-shm-usage",
      "--disable-features=NetworkServiceSandbox",
      "--no-sandbox",
      "--no-proxy-server",
      "--allow-insecure-localhost",
      "--no-first-run",
      "--no-default-browser-check",
      "--hide-scrollbars",
      "--window-size=1440,900",
      `--remote-debugging-port=${debugPort}`,
      `--user-data-dir=${profile}`,
      "about:blank",
    ], { stdio: "ignore", windowsHide: true });

    cdp = await connectCdp(await devtoolsPage(browserProcess, debugPort));
    await cdp.send("Page.enable");
    await cdp.send("Runtime.enable");

    for (const viewport of viewports) {
      await cdp.send("Emulation.setDeviceMetricsOverride", {
        width: viewport.width,
        height: viewport.height,
        deviceScaleFactor: 1,
        mobile: viewport.width <= 760,
      });

      const bookUrl = `http://127.0.0.1:${address.port}${pagesBasePath}book/?fragment-test=${viewport.label}`;
      await navigate(cdp, "about:blank");
      await navigate(cdp, `${bookUrl}#${coldTarget}`);
      const coldSnapshot = await waitForVisibleFragment(cdp, coldTarget);
      assertFragmentClearance(coldSnapshot, viewport, `${viewport.label} cold load`);
      assertFragmentLocation(coldSnapshot, viewport);
      await retainFragmentEvidence(cdp, `${viewport.label}-cold`, coldSnapshot);

      await navigate(cdp, `${bookUrl}#${navigationSource}`);
      await waitForVisibleFragment(cdp, navigationSource);
      const click = (await cdp.send("Runtime.evaluate", {
        expression: `(() => {
          const link = document.querySelector('a[href="#${hashTarget}"]');
          const href = link?.getAttribute("href") ?? null;
          link?.click();
          return { found: Boolean(link), href };
        })()`,
        returnByValue: true,
      })).result?.value;
      assert.deepEqual(click, { found: true, href: `#${hashTarget}` });
      const hashSnapshot = await waitForVisibleFragment(cdp, hashTarget);
      assertFragmentClearance(hashSnapshot, viewport, `${viewport.label} hash navigation`);
      assertFragmentLocation(hashSnapshot, viewport);
      await retainFragmentEvidence(cdp, `${viewport.label}-hash`, hashSnapshot);
    }
  } finally {
    cdp?.socket.close();
    await stopProcess(browserProcess);
    await vite?.close();
    await rm(profile, { recursive: true, force: true, maxRetries: 3, retryDelay: 100 });
    if (previousPagesBasePath === undefined) delete process.env.PAGES_BASE_PATH;
    else process.env.PAGES_BASE_PATH = previousPagesBasePath;
  }
});
