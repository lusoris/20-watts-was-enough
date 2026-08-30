import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { access, mkdtemp, rm } from "node:fs/promises";
import { createServer as createTcpServer } from "node:net";
import os from "node:os";
import path from "node:path";
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

test("browser process shutdown waits for a stubborn child before profile cleanup", async () => {
  const profile = await mkdtemp(path.join(os.tmpdir(), "20w-browser-stop-"));
  const browserProcess = spawn(process.execPath, [
    "-e",
    `const fs = require("node:fs");
const path = require("node:path");
const profile = process.argv[1];
const active = path.join(profile, "Default");
fs.mkdirSync(active, { recursive: true });
process.on("SIGTERM", () => {});
let sequence = 0;
setInterval(() => fs.writeFileSync(path.join(active, String(sequence++)), "active"), 5);
process.stdout.write("ready\\n");`,
    profile,
  ], { stdio: ["ignore", "pipe", "ignore"], windowsHide: true });
  let exited = false;
  browserProcess.once("exit", () => {
    exited = true;
  });
  try {
    const [ready] = await once(browserProcess.stdout, "data");
    assert.equal(String(ready), "ready\n");
    await stopProcess(browserProcess, { terminationGraceMs: 50, forcedExitWaitMs: 2_000 });
    assert.equal(exited, true, "stopProcess returned before the child exit event");
    if (process.platform !== "win32") assert.equal(browserProcess.signalCode, "SIGKILL");
    await rm(profile, { recursive: true, force: true });
    await assert.rejects(access(profile), (error) => error.code === "ENOENT");
  } finally {
    if (!exited) {
      await stopProcess(browserProcess, { terminationGraceMs: 50, forcedExitWaitMs: 2_000 });
    }
    await rm(profile, { recursive: true, force: true });
  }
});

test("browser process shutdown is a no-op after exit", async () => {
  const child = spawn(process.execPath, ["-e", ""], { stdio: "ignore", windowsHide: true });
  await once(child, "exit");
  const state = { exitCode: child.exitCode, signalCode: child.signalCode };
  await stopProcess(child, { terminationGraceMs: 1, forcedExitWaitMs: 1 });
  assert.deepEqual({ exitCode: child.exitCode, signalCode: child.signalCode }, state);
});

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

const diagramSnapshotExpression = `(() => {
  const nodes = [...document.querySelectorAll('.diagram')];
  return {
    href: location.href,
    state: document.readyState,
    loading: document.querySelectorAll('.diagram-loading').length,
    errors: [...document.querySelectorAll('.diagram-error')]
      .map((node) => node.textContent?.slice(0, 500) ?? 'unknown diagram error'),
    diagrams: nodes.length,
    rendered: nodes.filter((node) => node.querySelectorAll('.diagram-canvas > svg').length === 1).length,
    invalid: nodes.flatMap((node, index) => {
      const svgs = node.querySelectorAll('.diagram-canvas > svg');
      const svg = svgs[0];
      const bounds = svg?.getBoundingClientRect();
      if (
        svgs.length === 1 &&
        svg.childElementCount > 0 &&
        bounds.width > 0 &&
        bounds.height > 0
      ) return [];
      return [{
        index,
        caption: node.querySelector('figcaption')?.textContent?.slice(0, 240) ?? '',
        svgCount: svgs.length,
        svgChildren: svg?.childElementCount ?? 0,
        width: bounds?.width ?? 0,
        height: bounds?.height ?? 0,
      }];
    }),
    svgIds: nodes.map((node) => node.querySelector('.diagram-canvas > svg')?.id ?? ''),
  };
})()`;

async function assertMobilePortalSurface(cdp, address) {
  await cdp.send("Emulation.setDeviceMetricsOverride", {
    width: 375,
    height: 844,
    deviceScaleFactor: 1,
    mobile: true,
  });
  const portalUrl = `http://127.0.0.1:${address.port}/`;
  const navigation = await cdp.send("Page.navigate", { url: portalUrl });
  assert.equal(navigation.errorText, undefined);
  const deadline = Date.now() + 20_000;
  let ready = false;
  while (Date.now() < deadline) {
    const result = await cdp.send("Runtime.evaluate", {
      expression: `document.readyState === "complete" && Boolean(document.querySelector(".language-access > summary"))`,
      returnByValue: true,
    });
    ready = result.result?.value === true;
    if (ready) break;
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  assert.equal(ready, true, "Portal language control did not render");
  const snapshot = (await cdp.send("Runtime.evaluate", {
    expression: `(() => {
      document.querySelector(".language-access > summary").click();
      const panel = document.querySelector(".language-access-panel");
      const select = panel?.querySelector("select");
      const panelRect = panel?.getBoundingClientRect();
      const selectRect = select?.getBoundingClientRect();
      const parseColour = (value) => {
        const channels = value.match(/[0-9.]+/g)?.map(Number) ?? [];
        return [channels[0] ?? 0, channels[1] ?? 0, channels[2] ?? 0, channels[3] ?? 1];
      };
      const composite = (foreground, background) => {
        const alpha = foreground[3];
        return [
          foreground[0] * alpha + background[0] * (1 - alpha),
          foreground[1] * alpha + background[1] * (1 - alpha),
          foreground[2] * alpha + background[2] * (1 - alpha),
          1,
        ];
      };
      const backgroundFor = (node) => {
        const chain = [];
        for (let current = node; current; current = current.parentElement) chain.push(current);
        return chain.reverse().reduce((background, current) => (
          composite(parseColour(getComputedStyle(current).backgroundColor), background)
        ), [255, 255, 255, 1]);
      };
      const luminance = (colour) => {
        const values = colour.slice(0, 3).map((channel) => {
          const value = channel / 255;
          return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
        });
        return 0.2126 * values[0] + 0.7152 * values[1] + 0.0722 * values[2];
      };
      const contrastFor = (selector) => {
        const node = document.querySelector(selector);
        const background = backgroundFor(node);
        const foreground = composite(parseColour(getComputedStyle(node).color), background);
        const light = Math.max(luminance(foreground), luminance(background));
        const dark = Math.min(luminance(foreground), luminance(background));
        return (light + 0.05) / (dark + 0.05);
      };
      return {
        clientWidth: document.documentElement.clientWidth,
        contrast: {
          funnelIndex: contrastFor(".portal-funnel-index"),
          statusLabel: contrastFor(".portal-overview-metrics dt"),
        },
        scrollWidth: document.documentElement.scrollWidth,
        panel: panelRect && { left: panelRect.left, right: panelRect.right, width: panelRect.width },
        select: selectRect && { left: selectRect.left, right: selectRect.right, width: selectRect.width },
      };
    })()`,
    returnByValue: true,
  })).result?.value;
  assert.ok(snapshot.panel, JSON.stringify(snapshot));
  assert.ok(snapshot.select, JSON.stringify(snapshot));
  assert.ok(snapshot.panel.left >= 0, JSON.stringify(snapshot));
  assert.ok(snapshot.panel.right <= snapshot.clientWidth, JSON.stringify(snapshot));
  assert.ok(snapshot.select.left >= 0, JSON.stringify(snapshot));
  assert.ok(snapshot.select.right <= snapshot.clientWidth, JSON.stringify(snapshot));
  assert.ok(snapshot.scrollWidth <= snapshot.clientWidth, JSON.stringify(snapshot));
  assert.ok(snapshot.contrast.statusLabel >= 4.5, JSON.stringify(snapshot));
  assert.ok(snapshot.contrast.funnelIndex >= 4.5, JSON.stringify(snapshot));
}

test("browser rendering keeps Mermaid stable and mobile language access viewport-bound", {
  timeout: 120_000,
}, async () => {
  const browser = await firstExistingChromium();
  const debugPort = await reserveLocalPort();
  const profile = await mkdtemp(path.join(os.tmpdir(), "20w-mermaid-browser-"));
  const vite = await createViteServer({
    configFile: path.join(repositoryRoot, "vite.pages.config.ts"),
    logLevel: "silent",
    server: { host: "127.0.0.1", port: 0 },
  });
  let browserProcess;
  let cdp;

  try {
    await vite.listen();
    const address = vite.httpServer?.address();
    assert.equal(typeof address, "object");
    const bookUrl = `http://127.0.0.1:${address.port}/book/?pdf=1&ref=main`;
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
      "--window-size=1440,1200",
      `--remote-debugging-port=${debugPort}`,
      `--user-data-dir=${profile}`,
      "about:blank",
    ], { stdio: "ignore", windowsHide: true });

    cdp = await connectCdp(await devtoolsPage(browserProcess, debugPort));
    await cdp.send("Page.enable");
    await cdp.send("Runtime.enable");
    const navigation = await cdp.send("Page.navigate", { url: bookUrl });
    assert.equal(navigation.errorText, undefined);

    const deadline = Date.now() + 90_000;
    let snapshot;
    while (Date.now() < deadline) {
      const result = await cdp.send("Runtime.evaluate", {
        expression: diagramSnapshotExpression,
        returnByValue: true,
      });
      snapshot = result.result?.value;
      if (snapshot?.errors?.length) break;
      if (
        snapshot?.href === bookUrl &&
        snapshot.state === "complete" &&
        snapshot.diagrams >= 2 &&
        snapshot.loading === 0
      ) break;
      await new Promise((resolve) => setTimeout(resolve, 250));
    }

    assert.ok(snapshot?.diagrams >= 2, `Book diagrams did not render: ${JSON.stringify(snapshot)}`);
    assert.deepEqual(snapshot.errors, []);
    await new Promise((resolve) => setTimeout(resolve, 1_250));

    const first = (await cdp.send("Runtime.evaluate", {
      expression: diagramSnapshotExpression,
      returnByValue: true,
    })).result?.value;
    assert.equal(first.rendered, first.diagrams, JSON.stringify(first.invalid));
    assert.deepEqual(first.invalid, []);
    assert.equal(new Set(first.svgIds).size, first.diagrams, "Mermaid SVG IDs must be unique");
    assert.equal(first.svgIds.every(Boolean), true, "Every Mermaid SVG must retain an ID");

    await new Promise((resolve) => setTimeout(resolve, 750));
    const stable = (await cdp.send("Runtime.evaluate", {
      expression: diagramSnapshotExpression,
      returnByValue: true,
    })).result?.value;
    assert.deepEqual(stable.invalid, []);
    assert.equal(stable.rendered, stable.diagrams);
    assert.deepEqual(stable.svgIds, first.svgIds, "Mermaid SVG identity changed after readiness");

    await assertMobilePortalSurface(cdp, address);
  } finally {
    cdp?.socket.close();
    await stopProcess(browserProcess);
    await vite.close();
    await rm(profile, { recursive: true, force: true });
  }
});
