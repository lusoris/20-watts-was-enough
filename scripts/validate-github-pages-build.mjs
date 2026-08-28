import { lstat, readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { assertBookPdfIntegrity } from "./lib/book-pdf-integrity.mjs";

const repositoryRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
const outputRoot = path.join(repositoryRoot, "dist-github-pages");
const pagesBase = "/20-watts-was-enough/";

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
    const withoutFragment = reference.slice(pagesBase.length).split(/[?#]/, 1)[0];
    const relative = withoutFragment === "" || withoutFragment.endsWith("/")
      ? `${withoutFragment}index.html`
      : withoutFragment;
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
  bookPage.html.includes("https://lusoris.github.io/20-watts-was-enough/book/"),
  "book/index.html must declare the canonical public book route",
);

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

console.log(
  `GitHub Pages build validation passed: ${inventory.length} files, ${repositoryManifest.artifacts.length} repository artifacts, ${plotEntries.length} plot-directory entries.`,
);
