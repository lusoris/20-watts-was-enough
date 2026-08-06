import { spawn } from "node:child_process";
import { access, mkdir, mkdtemp, readFile, rm, stat, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { bookPdfName, bookSourceDigest } from "./book-source.mjs";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outputDirectory = path.join(projectRoot, "public", "downloads");
const outputPdf = path.join(outputDirectory, bookPdfName);
const manifestPath = path.join(outputDirectory, "book-manifest.json");
const tempRoot = path.join(projectRoot, "tmp", "pdfs");
const sitePort = 3137;
const debugPort = 3138;
const bookUrl = `http://127.0.0.1:${sitePort}/book?pdf=1`;
const cli = path.join(projectRoot, "node_modules", "vinext", "dist", "cli.js");
const browserCandidates = [
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
  "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
];

async function firstExisting(paths) {
  for (const candidate of paths) {
    try {
      await access(candidate);
      return candidate;
    } catch {
      // Continue to the next installed browser candidate.
    }
  }
  throw new Error("Chrome or Edge is required to generate the full-book PDF.");
}

async function waitForUrl(url, process, timeoutMs = 60_000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    if (process.exitCode !== null) {
      throw new Error(`Required process exited with code ${process.exitCode}.`);
    }
    try {
      const response = await fetch(url);
      if (response.ok) return response;
    } catch {
      // The process is still starting.
    }
    await new Promise((resolve) => setTimeout(resolve, 350));
  }
  throw new Error(`Timed out waiting for ${url}.`);
}

async function devtoolsPage(browserProcess) {
  const endpoint = `http://127.0.0.1:${debugPort}/json/list`;
  const response = await waitForUrl(endpoint, browserProcess);
  const targets = await response.json();
  const page = targets.find((target) => target.type === "page");
  if (!page?.webSocketDebuggerUrl) {
    throw new Error("The headless browser did not expose a page target.");
  }
  return page.webSocketDebuggerUrl;
}

async function connectCdp(webSocketUrl) {
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

async function stopProcess(process) {
  if (process.exitCode !== null) return;
  const exited = new Promise((resolve) => process.once("exit", resolve));
  process.kill();
  await Promise.race([
    exited,
    new Promise((resolve) => setTimeout(resolve, 5_000)),
  ]);
}

await mkdir(outputDirectory, { recursive: true });
await mkdir(tempRoot, { recursive: true });
const resolvedSystemTemp = path.resolve(tmpdir()) + path.sep;
const resolvedProfile = path.resolve(
  await mkdtemp(path.join(resolvedSystemTemp, "20w-book-chrome-")),
);
if (!resolvedProfile.startsWith(resolvedSystemTemp)) {
  throw new Error("Temporary browser profile escaped the operating-system temp directory.");
}

const sourceSnapshot = await bookSourceDigest(projectRoot);
const bookMarkdown = sourceSnapshot.files.filter(
  (file) => file === "README.md" || file.startsWith("concept/"),
);
let expectedDiagrams = 0;
for (const relative of bookMarkdown) {
  const body = await readFile(path.join(projectRoot, relative), "utf8");
  expectedDiagrams += [...body.matchAll(/^```mermaid\s*$/gm)].length;
}

const browser = await firstExisting(browserCandidates);
const server = spawn(
  process.execPath,
  [cli, "dev", "--port", String(sitePort), "--hostname", "127.0.0.1"],
  {
    cwd: projectRoot,
    env: { ...process.env, BROWSER: "none" },
    // Keep stdin open: Vite treats an immediate EOF as a request to stop the
    // development server, which races the headless browser navigation.
    stdio: ["pipe", "inherit", "inherit"],
    windowsHide: true,
  },
);
let browserProcess;
let cdp;

try {
  await waitForUrl(bookUrl, server);
  browserProcess = spawn(
    browser,
    [
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
      `--user-data-dir=${resolvedProfile}`,
      "about:blank",
    ],
    { stdio: "ignore", windowsHide: true },
  );

  const webSocketUrl = await devtoolsPage(browserProcess);
  cdp = await connectCdp(webSocketUrl);
  await cdp.send("Page.enable");
  await cdp.send("Runtime.enable");
  const navigation = await cdp.send("Page.navigate", { url: bookUrl });
  if (navigation.errorText) {
    throw new Error(
      `Headless Chrome navigation failed: ${navigation.errorText}; preview exit=${server.exitCode}`,
    );
  }

  const navigationDeadline = Date.now() + 60_000;
  let navigated = false;
  let lastNavigationValue;
  while (Date.now() < navigationDeadline) {
    const location = await cdp.send("Runtime.evaluate", {
      expression:
        "({ href: location.href, state: document.readyState, documents: document.querySelectorAll('.book-document').length })",
      returnByValue: true,
    });
    const value = location.result?.value;
    lastNavigationValue = value;
    if (value?.href === bookUrl && value.documents > 0) {
      navigated = true;
      break;
    }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  if (!navigated) {
    throw new Error(
      `Headless Chrome did not navigate to the rendered book page: ${JSON.stringify(lastNavigationValue)}`,
    );
  }

  const readinessExpression = `
    (async () => {
      const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
      const deadline = Date.now() + 180000;
      while (Date.now() < deadline) {
        const documents = document.querySelectorAll('.book-document').length;
        const diagrams = document.querySelectorAll('.diagram').length;
        const loading = document.querySelectorAll('.diagram-loading').length;
        const errors = [...document.querySelectorAll('.diagram-error')]
          .map((node) => node.textContent?.slice(0, 500) ?? 'unknown diagram error');
        const images = [...document.images];
        const imagesReady = images.every((image) => image.complete && image.naturalWidth > 0);
        if (errors.length) return { ready: false, errors, documents, diagrams, loading };
        if (
          document.readyState === 'complete' &&
          documents === ${bookMarkdown.length} &&
          diagrams === ${expectedDiagrams} &&
          loading === 0 &&
          imagesReady
        ) {
          await document.fonts.ready;
          await Promise.all(images.map((image) => image.decode?.().catch(() => undefined)));
          await wait(750);
          return { ready: true, documents, diagrams, images: images.length };
        }
        await wait(250);
      }
      return {
        ready: false,
        timeout: true,
        documents: document.querySelectorAll('.book-document').length,
        diagrams: document.querySelectorAll('.diagram').length,
        loading: document.querySelectorAll('.diagram-loading').length,
        errors: [...document.querySelectorAll('.diagram-error')]
          .map((node) => node.textContent?.slice(0, 500) ?? 'unknown diagram error'),
      };
    })()
  `;
  const readiness = await cdp.send("Runtime.evaluate", {
    expression: readinessExpression,
    awaitPromise: true,
    returnByValue: true,
  });
  const readinessValue = readiness.result?.value;
  if (!readinessValue?.ready) {
    throw new Error(`Book page did not become print-ready: ${JSON.stringify(readinessValue)}`);
  }

  const printed = await cdp.send(
    "Page.printToPDF",
    {
      printBackground: true,
      preferCSSPageSize: true,
      displayHeaderFooter: false,
    },
    300_000,
  );
  await writeFile(outputPdf, Buffer.from(printed.data, "base64"));
} finally {
  cdp?.socket.close();
  if (browserProcess) await stopProcess(browserProcess);
  await stopProcess(server);
  await rm(resolvedProfile, { recursive: true, force: true });
}

const pdfStats = await stat(outputPdf);
if (pdfStats.size < 100_000) {
  throw new Error(`Generated PDF is unexpectedly small: ${pdfStats.size} bytes.`);
}

const manifest = {
  schema_version: 1,
  title: "20 Watts Was Enough — Full Concept Book",
  pdf: `public/downloads/${bookPdfName}`,
  source_digest: sourceSnapshot.digest,
  source_files: sourceSnapshot.files,
  book_documents: bookMarkdown.length,
  rendered_diagrams: expectedDiagrams,
  generated_at: new Date().toISOString(),
  size_bytes: pdfStats.size,
};
await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");

const header = await readFile(outputPdf);
if (header.subarray(0, 5).toString("ascii") !== "%PDF-") {
  throw new Error("Generated book does not have a PDF header.");
}

console.log(
  `Generated ${path.relative(projectRoot, outputPdf)} (${pdfStats.size} bytes, ${bookMarkdown.length} documents, ${expectedDiagrams} diagrams).`,
);
