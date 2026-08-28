import { lstat, readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { assertBookPdfIntegrity } from "./lib/book-pdf-integrity.mjs";
import { resolvePagesBase } from "./lib/pages-base.mjs";

const repositoryRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
const outputRoot = path.join(repositoryRoot, "dist-github-pages");
const pagesBase = resolvePagesBase(process.env.PAGES_BASE_PATH);
const maximumPortalInitialJavaScriptBytes = 400_000;
const legacyDeploymentReference = /\/20-watts-was-enough\/(?:assets|book|documents|downloads|plots|repository-files)(?:\/|["'?#)]|$)/u;

function invariant(condition, message) {
  if (!condition) throw new Error(`Invalid GitHub Pages build: ${message}`);
}

async function regularFile(relative) {
  const information = await lstat(path.join(outputRoot, ...relative.split("/")));
  invariant(information.isFile() && !information.isSymbolicLink(), `${relative} must be a regular file`);
  return information;
}

async function entries(relative) {
  return readdir(path.join(outputRoot, relative), { withFileTypes: true });
}

async function recursiveInventory(relative = "") {
  const found = [];
  for (const entry of await readdir(path.join(outputRoot, relative), { withFileTypes: true })) {
    const child = relative ? `${relative}/${entry.name}` : entry.name;
    invariant(!entry.isSymbolicLink(), `${child} must not be a symbolic link`);
    if (entry.isDirectory()) found.push(...await recursiveInventory(child));
    else if (entry.isFile()) found.push(child);
    else invariant(false, `${child} has an unsupported filesystem type`);
  }
  return found;
}

async function sourceMarkdownInventory(relative) {
  const found = [];
  for (const entry of await readdir(path.join(repositoryRoot, relative), { withFileTypes: true })) {
    const child = `${relative}/${entry.name}`;
    if (entry.isDirectory()) found.push(...await sourceMarkdownInventory(child));
    else if (entry.isFile() && entry.name.endsWith(".md") && entry.name.toLowerCase() !== "readme.md") {
      found.push(child);
    }
  }
  return found;
}

function pagesRelative(reference) {
  invariant(reference.startsWith(pagesBase), `unprefixed root-relative reference: ${reference}`);
  const withoutFragment = reference.slice(pagesBase.length).split(/[?#]/, 1)[0];
  return withoutFragment === "" || withoutFragment.endsWith("/")
    ? `${withoutFragment}index.html`
    : withoutFragment;
}

await regularFile("index.html");
await regularFile("book/index.html");
await regularFile(".nojekyll");

async function validatePage(relativeHtml, expectedEntryPrefix) {
  const html = await readFile(path.join(outputRoot, ...relativeHtml.split("/")), "utf8");
  const references = [...html.matchAll(/(?:href|src)=["']([^"']+)["']/g)]
    .map((match) => match[1]);
  const localReferences = references.filter((reference) => reference.startsWith("/"));
  invariant(localReferences.length >= 3, `${relativeHtml} must reference local navigation or assets`);

  for (const reference of localReferences) {
    invariant(reference.startsWith(pagesBase), `${relativeHtml} has an unprefixed root-relative reference: ${reference}`);
    const relative = pagesRelative(reference);
    await regularFile(relative);
  }

  const clientEntries = [...html.matchAll(/<script\b[^>]*\bsrc=["']([^"']+\.js(?:\?[^"']*)?)["'][^>]*>/g)]
    .map((match) => match[1]);
  invariant(clientEntries.length === 1, `${relativeHtml} must load exactly one client entry`);
  invariant(
    path.basename(clientEntries[0]).startsWith(`${expectedEntryPrefix}-`),
    `${relativeHtml} does not load its ${expectedEntryPrefix} entry chunk`,
  );
  invariant(!html.includes("/_next/"), `${relativeHtml} contains a server-framework asset path`);
  return { html, clientEntry: clientEntries[0] };
}

const portalPage = await validatePage("index.html", "portal");
const bookPage = await validatePage("book/index.html", "book");
invariant(portalPage.clientEntry !== bookPage.clientEntry, "portal and book must have distinct client entries");
invariant(
  bookPage.html.includes("https://www.cordana.dev/book/"),
  "book/index.html must declare the canonical public book route",
);
const portalModulePreloads = [...portalPage.html.matchAll(
  /<link\b(?=[^>]*\brel=["']modulepreload["'])[^>]*\bhref=["']([^"']+)["'][^>]*>/g,
)].map((match) => match[1]);
const portalInitialJavaScript = [portalPage.clientEntry, ...portalModulePreloads]
  .filter((reference) => reference.endsWith(".js"));
let portalInitialJavaScriptBytes = 0;
for (const reference of portalInitialJavaScript) {
  const relative = pagesRelative(reference);
  invariant(
    !/^assets\/(?:book|markdown-document)-/u.test(relative),
    `portal eagerly loads book-only JavaScript: ${relative}`,
  );
  portalInitialJavaScriptBytes += (await regularFile(relative)).size;
}
invariant(
  portalInitialJavaScriptBytes <= maximumPortalInitialJavaScriptBytes,
  `portal initial JavaScript is ${portalInitialJavaScriptBytes} bytes; limit is ${maximumPortalInitialJavaScriptBytes}`,
);

const sourceDocuments = [
  ...await sourceMarkdownInventory("concept"),
  ...await sourceMarkdownInventory("math"),
].sort();
const builtDocuments = (await recursiveInventory("documents"))
  .filter((relative) => relative.endsWith(".md"))
  .map((relative) => relative.slice("documents/".length))
  .sort();
invariant(
  JSON.stringify(builtDocuments) === JSON.stringify(sourceDocuments),
  "portal document assets do not exactly match the canonical concept/math corpus",
);
for (const relative of sourceDocuments) {
  const [source, built] = await Promise.all([
    readFile(path.join(repositoryRoot, ...relative.split("/"))),
    readFile(path.join(outputRoot, "documents", ...relative.split("/"))),
  ]);
  invariant(source.equals(built), `portal document asset differs from canonical source: ${relative}`);
}

const assetEntries = await entries("assets");
invariant(assetEntries.some((entry) => entry.isFile() && entry.name.endsWith(".js")), "client JavaScript is missing");
invariant(assetEntries.some((entry) => entry.isFile() && entry.name.endsWith(".css")), "compiled Pages stylesheets are missing");

const pdfPath = "downloads/20-watts-was-enough-full-concept-book.pdf";
const pdfInformation = await regularFile(pdfPath);
invariant(pdfInformation.size >= 100_000, "book PDF is unexpectedly small");
const builtPdfPath = path.join(outputRoot, ...pdfPath.split("/"));
const pdfHeader = await readFile(builtPdfPath);
invariant(pdfHeader.subarray(0, 5).toString("ascii") === "%PDF-", "book download is not a PDF");
const bookManifestPath = "downloads/book-manifest.json";
await regularFile(bookManifestPath);
const bookManifest = JSON.parse(
  await readFile(path.join(outputRoot, ...bookManifestPath.split("/")), "utf8"),
);
invariant(bookManifest.schema_version === 2, "book manifest schema is invalid");
await assertBookPdfIntegrity(builtPdfPath, bookManifest);
for (const legalFile of [
  "LICENSE",
  "LICENSING.md",
  "LICENSES/CC-BY-SA-4.0.txt",
  "LICENSES/OFL-1.1.txt",
  "THIRD_PARTY_NOTICES.txt",
]) {
  const information = await regularFile(legalFile);
  invariant(information.size > 500, `${legalFile} is unexpectedly small`);
}
const notices = await readFile(path.join(outputRoot, "THIRD_PARTY_NOTICES.txt"), "utf8");
invariant(notices.includes("SIL OPEN FONT LICENSE Version 1.1"), "font licence notice is missing");
invariant(notices.includes("Bundled package inventory"), "package licence inventory is missing");

const plotEntries = await entries("plots");
invariant(plotEntries.filter((entry) => entry.isFile() && entry.name.endsWith(".svg")).length >= 1, "plot assets are missing");
await regularFile("plots/rsd-t02-bootstrap-calibration.svg");

const repositoryManifest = JSON.parse(
  await readFile(path.join(outputRoot, "repository-files", "manifest.json"), "utf8"),
);
invariant(repositoryManifest.schema === 1, "repository-file manifest schema is invalid");
invariant(Array.isArray(repositoryManifest.artifacts) && repositoryManifest.artifacts.length > 0, "repository-file manifest is empty");
for (const artifact of repositoryManifest.artifacts) {
  invariant(
    typeof artifact === "string"
      && !artifact.includes("..")
      && !artifact.includes("\\")
      && !artifact.startsWith("/")
      && ![".git/", ".openai/", "node_modules/", "public/", "sources/"].some(
        (prefix) => artifact.startsWith(prefix),
      ),
    "repository-file manifest contains an unsafe path",
  );
  await regularFile(`repository-files/${artifact}.txt`);
}

for (const forbidden of ["server", ".openai", "_worker.js"]) {
  let exists = true;
  try {
    await lstat(path.join(outputRoot, forbidden));
  } catch (error) {
    if (error?.code === "ENOENT") exists = false;
    else throw error;
  }
  invariant(!exists, `${forbidden} must not be part of the static Pages artifact`);
}

const inventory = await recursiveInventory();
for (const relative of inventory) {
  const segments = relative.split("/");
  const basename = segments.at(-1).toLowerCase();
  invariant(
    relative === ".nojekyll" || segments.every((segment) => !segment.startsWith(".")),
    `unexpected hidden path in static artifact: ${relative}`,
  );
  invariant(!basename.endsWith(".map"), `source map must not be public: ${relative}`);
  invariant(
    ![".env", ".dev.vars", "credentials", "credentials.json", "hosting.json", "secrets", "secrets.json", "wrangler.toml"].includes(basename),
    `secret-bearing configuration name must not be public: ${relative}`,
  );
  invariant(
    !segments.some((segment) => [".git", ".openai", "server"].includes(segment.toLowerCase()))
      && !["_worker.js", "worker.js"].includes(basename),
    `server-only path must not be public: ${relative}`,
  );
}

if (pagesBase === "/") {
  const runtimeFiles = inventory.filter((relative) => (
    relative.endsWith(".html")
    || relative.endsWith(".js")
    || relative.endsWith(".css")
  ));
  for (const relative of runtimeFiles) {
    const source = await readFile(path.join(outputRoot, ...relative.split("/")), "utf8");
    invariant(
      !legacyDeploymentReference.test(source),
      `${relative} contains a legacy repository-subpath deployment reference`,
    );
  }
}

console.log(
  `GitHub Pages build validation passed: ${inventory.length} files, ${builtDocuments.length} portal documents, ${portalInitialJavaScriptBytes} initial portal JS bytes, ${repositoryManifest.artifacts.length} repository artifacts, ${plotEntries.length} plot-directory entries.`,
);
