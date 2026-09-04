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
const profileRemovalOptions = Object.freeze({
  force: true,
  maxRetries: 5,
  recursive: true,
  retryDelay: 100,
});

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
    await rm(profile, profileRemovalOptions);
    await assert.rejects(access(profile), (error) => error.code === "ENOENT");
  } finally {
    if (!exited) {
      await stopProcess(browserProcess, { terminationGraceMs: 50, forcedExitWaitMs: 2_000 });
    }
    await rm(profile, profileRemovalOptions);
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

async function overflowRegionSnapshot(cdp) {
  return (await cdp.send("Runtime.evaluate", {
    expression: `(() => ({
      clientWidth: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
      regions: [...document.querySelectorAll('.book-prose [data-overflow-kind]')].map((region) => {
        const kind = region.getAttribute('data-overflow-kind');
        const cue = region.parentElement?.querySelector(
          kind === 'diagram'
            ? ':scope > .diagram-layout-note'
            : ':scope > .overflow-region-cue',
        );
        return {
          kind,
          overflows: region.scrollWidth > region.clientWidth + 1,
          role: region.getAttribute('role'),
          label: region.getAttribute('aria-label'),
          describedBy: region.getAttribute('aria-describedby'),
          tabIndex: region.getAttribute('tabindex'),
          tabIndexProperty: region.tabIndex,
          cue: cue
            ? (cue.matches('.overflow-region-cue')
                ? [...cue.children].map((part) => part.textContent?.trim() ?? '').join(' ')
                : cue.textContent?.replace(/\\s+/gu, ' ').trim())
            : null,
          cueHidden: cue?.getAttribute('aria-hidden') ?? null,
        };
      }),
    }))()`,
    returnByValue: true,
  })).result?.value;
}

function assertConditionalOverflowSemantics(snapshot) {
  assert.ok(snapshot.regions.length > 0, JSON.stringify(snapshot));
  for (const region of snapshot.regions) {
    if (region.overflows) {
      const expectedRole = ["code", "equation"].includes(region.kind)
        ? "group"
        : "region";
      assert.equal(region.role, expectedRole, JSON.stringify(region));
      assert.equal(region.tabIndex, "0", JSON.stringify(region));
      assert.equal(region.tabIndexProperty, 0, JSON.stringify(region));
      if (region.kind === "code") {
        assert.match(region.label, /^Scrollable (?:\S+ )?code \d+ in /u);
        assert.equal(region.cue, "Wide code Scroll horizontally ↔");
      } else if (region.kind === "equation") {
        assert.match(region.label, /^Scrollable equation \d+ in /u);
        assert.equal(region.cue, "Wide equation Scroll horizontally ↔");
      } else if (region.kind === "table") {
        assert.match(region.label, /^Scrollable table \d+ in /u);
        assert.equal(region.cue, "Wide table Scroll horizontally ↔");
      } else {
        assert.equal(region.kind, "diagram", JSON.stringify(region));
        assert.match(region.label, /^Scrollable diagram \d+ in /u);
        assert.ok(region.describedBy, JSON.stringify(region));
        assert.equal(
          region.cue,
          "Wide diagram · scroll horizontally on narrow screens",
        );
      }
      if (region.kind !== "diagram") {
        assert.equal(region.describedBy, null, JSON.stringify(region));
      }
      assert.equal(
        region.cueHidden,
        region.kind === "diagram" ? null : "true",
        JSON.stringify(region),
      );
    } else {
      assert.equal(region.role, null, JSON.stringify(region));
      assert.equal(region.label, null, JSON.stringify(region));
      assert.equal(region.describedBy, null, JSON.stringify(region));
      assert.equal(region.tabIndex, null, JSON.stringify(region));
      assert.equal(region.tabIndexProperty, -1, JSON.stringify(region));
      assert.equal(region.cue, null, JSON.stringify(region));
    }
  }
  const labels = snapshot.regions
    .filter((region) => region.overflows)
    .map((region) => region.label);
  assert.equal(new Set(labels).size, labels.length, "Overflow-region labels must be unique");
}

async function assertArrowKeyScrollsRegion(cdp, kind) {
  const selector = `.book-prose [data-overflow-kind="${kind}"][tabindex="0"]`;
  const prepared = (await cdp.send("Runtime.evaluate", {
    expression: `(() => {
      const region = document.querySelector(${JSON.stringify(selector)});
      if (!region) return null;
      region.scrollLeft = 0;
      const sentinel = document.createElement('button');
      sentinel.id = 'overflow-focus-sentinel';
      sentinel.style.cssText = 'position:fixed;width:1px;height:1px;opacity:0';
      region.before(sentinel);
      sentinel.focus();
      return document.activeElement === sentinel;
    })()`,
    returnByValue: true,
  })).result?.value;
  assert.equal(prepared, true, `${kind} focus sentinel was not ready`);
  await cdp.send("Input.dispatchKeyEvent", {
    type: "rawKeyDown",
    key: "Tab",
    code: "Tab",
    windowsVirtualKeyCode: 9,
    nativeVirtualKeyCode: 9,
  });
  await cdp.send("Input.dispatchKeyEvent", {
    type: "keyUp",
    key: "Tab",
    code: "Tab",
    windowsVirtualKeyCode: 9,
    nativeVirtualKeyCode: 9,
  });
  const focused = (await cdp.send("Runtime.evaluate", {
    expression: `(() => {
      const region = document.activeElement;
      const style = getComputedStyle(region);
      document.querySelector('#overflow-focus-sentinel')?.remove();
      return {
        active: region?.getAttribute('data-overflow-kind') === ${JSON.stringify(kind)},
        outlineStyle: style.outlineStyle,
        outlineWidth: style.outlineWidth,
      };
    })()`,
    returnByValue: true,
  })).result?.value;
  assert.ok(focused?.active, `${kind} overflow region was not focusable`);
  assert.notEqual(focused.outlineStyle, "none", JSON.stringify(focused));
  assert.ok(Number.parseFloat(focused.outlineWidth) > 0, JSON.stringify(focused));

  await cdp.send("Input.dispatchKeyEvent", {
    type: "rawKeyDown",
    key: "ArrowRight",
    code: "ArrowRight",
    windowsVirtualKeyCode: 39,
    nativeVirtualKeyCode: 39,
  });
  await cdp.send("Input.dispatchKeyEvent", {
    type: "keyUp",
    key: "ArrowRight",
    code: "ArrowRight",
    windowsVirtualKeyCode: 39,
    nativeVirtualKeyCode: 39,
  });
  await new Promise((resolve) => setTimeout(resolve, 150));
  const scrollLeft = (await cdp.send("Runtime.evaluate", {
    expression: `document.querySelector(${JSON.stringify(selector)})?.scrollLeft ?? 0`,
    returnByValue: true,
  })).result?.value;
  assert.ok(scrollLeft > 0, `${kind} overflow region did not respond to ArrowRight`);
}

async function assertPrintRetiresOverflowSemantics(cdp, expectedRegionCount) {
  await cdp.send("Runtime.evaluate", {
    expression: `(() => {
      window.__overflowPrintBoundary = null;
      window.addEventListener('beforeprint', () => {
        const regions = [...document.querySelectorAll('.book-prose [data-overflow-kind]')];
        window.__overflowPrintBoundary = {
          count: regions.length,
          labels: regions.filter((region) => region.hasAttribute('aria-label')).length,
          descriptions: regions.filter((region) => region.hasAttribute('aria-describedby')).length,
          roles: regions.filter((region) => region.hasAttribute('role')).length,
          tabStops: regions.filter((region) => region.getAttribute('tabindex') === '0').length,
        };
      }, { once: true });
    })()`,
  });
  // One page triggers the lifecycle boundary without rendering the 400-page book.
  const printed = await cdp.send("Page.printToPDF", {
    pageRanges: "1",
    preferCSSPageSize: true,
    printBackground: true,
  });
  assert.ok(printed.data?.length > 1_000, "Chrome did not return PDF bytes");
  const printBoundary = (await cdp.send("Runtime.evaluate", {
    expression: "window.__overflowPrintBoundary",
    returnByValue: true,
  })).result?.value;
  assert.deepEqual(printBoundary, {
    count: expectedRegionCount,
    labels: 0,
    descriptions: 0,
    roles: 0,
    tabStops: 0,
  });

  const restoreDeadline = Date.now() + 5_000;
  let restored;
  while (Date.now() < restoreDeadline) {
    restored = await overflowRegionSnapshot(cdp);
    if (
      restored.regions.some((region) => region.role === "group")
      && restored.regions.every((region) => region.overflows === (region.role !== null))
    ) break;
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  assertConditionalOverflowSemantics(restored);

  await cdp.send("Emulation.setEmulatedMedia", { media: "print" });
  let print;
  const printDeadline = Date.now() + 5_000;
  while (Date.now() < printDeadline) {
    print = await overflowRegionSnapshot(cdp);
    if (
      print.regions.length === expectedRegionCount
      && print.regions.every((region) => !region.overflows && region.role === null)
    ) break;
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  assertConditionalOverflowSemantics(print);
  assert.equal(
    print.regions.every((region) => !region.overflows),
    true,
    `Print content retained horizontal overflow: ${JSON.stringify(print)}`,
  );
  await cdp.send("Emulation.setEmulatedMedia", { media: "screen" });
}

async function assertBookOverflowRegions(cdp) {
  const requiredKinds = ["code", "equation", "table", "diagram"];
  let narrow;
  const narrowDeadline = Date.now() + 5_000;
  while (Date.now() < narrowDeadline) {
    narrow = await overflowRegionSnapshot(cdp);
    if (
      requiredKinds.every((kind) => (
        narrow.regions.some((region) => region.kind === kind && region.overflows)
      ))
      && narrow.regions.every((region) => region.overflows === (region.role !== null))
    ) break;
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  assertConditionalOverflowSemantics(narrow);
  for (const kind of requiredKinds) {
    assert.equal(
      narrow.regions.some((region) => region.kind === kind && region.overflows),
      true,
      `No overflowing ${kind} region was exercised: ${JSON.stringify(narrow)}`,
    );
  }
  const accessibilityTree = await cdp.send("Accessibility.getFullAXTree");
  for (const kind of requiredKinds) {
    const label = narrow.regions.find(
      (region) => region.kind === kind && region.overflows,
    )?.label;
    assert.ok(label, `No overflowing ${kind} label was available`);
    const role = ["code", "equation"].includes(kind) ? "group" : "region";
    assert.equal(
      accessibilityTree.nodes.some((node) => (
        !node.ignored && node.role?.value === role && node.name?.value === label
      )),
      true,
      `${kind} overflow ${role} was absent from the accessibility tree`,
    );
  }
  assert.ok(narrow.scrollWidth <= narrow.clientWidth, JSON.stringify(narrow));
  for (const kind of requiredKinds) await assertArrowKeyScrollsRegion(cdp, kind);

  const narrowOverflowCount = narrow.regions.filter((region) => region.overflows).length;
  await cdp.send("Emulation.setDeviceMetricsOverride", {
    width: 1440,
    height: 1200,
    deviceScaleFactor: 1,
    mobile: false,
  });
  let wide;
  const wideDeadline = Date.now() + 5_000;
  while (Date.now() < wideDeadline) {
    wide = await overflowRegionSnapshot(cdp);
    const wideOverflowCount = wide.regions.filter((region) => region.overflows).length;
    if (
      wide.regions.length === narrow.regions.length
      && wide.regions.every((region) => region.overflows === (region.role !== null))
      && wideOverflowCount < narrowOverflowCount
    ) break;
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  assertConditionalOverflowSemantics(wide);
  assert.ok(
    wide.regions.filter((region) => region.overflows).length < narrowOverflowCount,
    `Resize did not retire any overflow regions: ${JSON.stringify({ narrow, wide })}`,
  );
  assert.ok(wide.scrollWidth <= wide.clientWidth, JSON.stringify(wide));
  await assertPrintRetiresOverflowSemantics(cdp, wide.regions.length);
}

async function assertBookReflowSurface(cdp, address) {
  await cdp.send("Emulation.setDeviceMetricsOverride", {
    width: 320,
    height: 1200,
    deviceScaleFactor: 1,
    mobile: true,
  });
  await new Promise((resolve) => setTimeout(resolve, 250));
  const reflow = (await cdp.send("Runtime.evaluate", {
    expression: `(() => {
      const root = document.documentElement;
      const fieldCoverage = document.querySelector('#book-research-field-coverage-md .book-prose');
      const wideRegions = [...document.querySelectorAll('.diagram-wide .diagram-scroll-region')];
      return {
        clientWidth: root.clientWidth,
        scrollWidth: root.scrollWidth,
        fieldCoverage: fieldCoverage && {
          clientWidth: fieldCoverage.clientWidth,
          scrollWidth: fieldCoverage.scrollWidth,
        },
        wideRegions: wideRegions.length,
        locallyOverflowing: wideRegions.filter(
          (region) => region.scrollWidth > region.clientWidth + 1,
        ).length,
      };
    })()`,
    returnByValue: true,
  })).result?.value;
  assert.ok(reflow.fieldCoverage, JSON.stringify(reflow));
  assert.ok(reflow.wideRegions > 0, JSON.stringify(reflow));
  assert.equal(reflow.locallyOverflowing, reflow.wideRegions, JSON.stringify(reflow));
  assert.ok(reflow.fieldCoverage.scrollWidth <= reflow.fieldCoverage.clientWidth, JSON.stringify(reflow));
  assert.ok(reflow.scrollWidth <= reflow.clientWidth, JSON.stringify(reflow));
  await assertBookOverflowRegions(cdp);

  // This layout models a 1,440-device-pixel surface at DPR 2.
  // DPR emulation alone is not a browser-zoom or text-zoom assertion.
  await cdp.send("Emulation.setDeviceMetricsOverride", {
    width: 720,
    height: 600,
    deviceScaleFactor: 2,
    mobile: false,
  });
  const bookUrl = `http://127.0.0.1:${address.port}/book/`;
  const navigation = await cdp.send("Page.navigate", { url: bookUrl });
  assert.equal(navigation.errorText, undefined);
  const deadline = Date.now() + 20_000;
  let ready = false;
  while (Date.now() < deadline) {
    const result = await cdp.send("Runtime.evaluate", {
      expression: `document.readyState === "complete" && document.querySelectorAll(".book-actions > *").length === 4`,
      returnByValue: true,
    });
    ready = result.result?.value === true;
    if (ready) break;
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  assert.equal(ready, true, "Web-book actions did not render in the 720 CSS pixel lane");
  const denseViewport = (await cdp.send("Runtime.evaluate", {
    expression: `(() => {
      const root = document.documentElement;
      const actions = document.querySelector('.book-actions');
      const bounds = actions?.getBoundingClientRect();
      const controls = [...(actions?.children ?? [])].map((control) => {
        const rect = control.getBoundingClientRect();
        return { left: rect.left, right: rect.right };
      });
      return {
        clientWidth: root.clientWidth,
        scrollWidth: root.scrollWidth,
        devicePixelRatio,
        actions: bounds && { left: bounds.left, right: bounds.right },
        controls,
      };
    })()`,
    returnByValue: true,
  })).result?.value;
  assert.equal(denseViewport.devicePixelRatio, 2, JSON.stringify(denseViewport));
  assert.ok(denseViewport.actions, JSON.stringify(denseViewport));
  assert.ok(
    denseViewport.actions.left >= 0 && denseViewport.actions.right <= denseViewport.clientWidth,
    JSON.stringify(denseViewport),
  );
  assert.equal(
    denseViewport.controls.every(
      (control) => control.left >= 0 && control.right <= denseViewport.clientWidth,
    ),
    true,
    JSON.stringify(denseViewport),
  );
  assert.ok(
    denseViewport.scrollWidth <= denseViewport.clientWidth,
    JSON.stringify(denseViewport),
  );
}

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

test("browser rendering keeps Mermaid stable and wide publication content keyboard operable", {
  timeout: 150_000,
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

    await assertBookReflowSurface(cdp, address);
    await assertMobilePortalSurface(cdp, address);
  } finally {
    cdp?.socket.close();
    await stopProcess(browserProcess);
    await vite.close();
    await rm(profile, profileRemovalOptions);
  }
});
