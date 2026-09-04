import { lstat, readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { bookDocumentId } from "../app/lib/book-document-id.mjs";
import { assertBookPdfIntegrity } from "./lib/book-pdf-integrity.mjs";
import { assertBookManifestContract } from "./lib/book-manifest-contract.mjs";
import {
  bookRendererLockPath,
  bookRendererLockSHA256,
} from "./lib/book-renderer-identity.mjs";
import { resolvePagesBase } from "./lib/pages-base.mjs";
import {
  bookSourceDocuments,
  portalSourceDocuments,
} from "./lib/portal-documents.mjs";
import { assertExactPublicationCopy } from "./lib/publication-copy-integrity.mjs";
import {
  canonicalSite,
  renderBookFallback,
  renderRobots,
  renderSitemap,
} from "./lib/pages-seo.mjs";
import { translatedSourceDocuments } from "./lib/translation-pages.mjs";

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
await regularFile("help/index.html");
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
  const expectedClientEntries = expectedEntryPrefix ? 1 : 0;
  invariant(
    clientEntries.length === expectedClientEntries,
    `${relativeHtml} must load exactly ${expectedClientEntries} client entries`,
  );
  if (expectedEntryPrefix) {
    invariant(
      path.basename(clientEntries[0]).startsWith(`${expectedEntryPrefix}-`),
      `${relativeHtml} does not load its ${expectedEntryPrefix} entry chunk`,
    );
  }
  invariant(!html.includes("/_next/"), `${relativeHtml} contains a server-framework asset path`);
  return { html, clientEntry: clientEntries[0] ?? null };
}

function oneMatch(source, pattern, label) {
  const matches = [...source.matchAll(pattern)];
  invariant(matches.length === 1, `${label} must occur exactly once`);
  return matches[0][1];
}

function validateSeoDocument(html, document) {
  const canonical = `${canonicalSite}${document.route}`;
  const language = document.language ?? "en";
  const title = oneMatch(html, /<title>([^<]+)<\/title>/g, `${document.route} title`);
  const description = oneMatch(
    html,
    /<meta\s+name="description"\s+content="([^"]+)"\s*\/>/g,
    `${document.route} description`,
  );
  const declaredCanonical = oneMatch(
    html,
    /<link\s+rel="canonical"\s+href="([^"]+)"\s*\/>/g,
    `${document.route} canonical`,
  );
  const robots = oneMatch(
    html,
    /<meta\s+name="robots"\s+content="([^"]+)"\s*\/>/g,
    `${document.route} robots`,
  );
  const jsonLd = JSON.parse(oneMatch(
    html,
    /<script\s+type="application\/ld\+json">([^<]+)<\/script>/g,
    `${document.route} JSON-LD`,
  ));
  const citationLanguage = oneMatch(
    html,
    /<meta\s+name="citation_language"\s+content="([^"]+)"\s*\/>/g,
    `${document.route} citation language`,
  );
  const htmlLanguage = oneMatch(
    html,
    /<html\s+lang="([^"]+)">/g,
    `${document.route} HTML language`,
  );
  invariant(declaredCanonical === canonical, `${document.route} canonical is not self-referential`);
  invariant(title === `${document.title} — 20 Watts Was Enough`, `${document.route} title is stale`);
  invariant(description === document.description.replaceAll("&", "&amp;").replaceAll('"', "&quot;"), `${document.route} description is stale`);
  invariant(robots.includes("index") && robots.includes("follow") && !robots.includes("noindex"), `${document.route} is not indexable`);
  invariant(jsonLd["@type"] === "TechArticle", `${document.route} JSON-LD type is not TechArticle`);
  invariant(jsonLd.url === canonical && jsonLd.mainEntityOfPage === canonical, `${document.route} JSON-LD URL is stale`);
  invariant(jsonLd.headline === document.title, `${document.route} JSON-LD headline is stale`);
  invariant(jsonLd.wordCount === document.words, `${document.route} JSON-LD word count is stale`);
  invariant(jsonLd.inLanguage === language, `${document.route} JSON-LD language is stale`);
  invariant(citationLanguage === language, `${document.route} citation language is stale`);
  invariant(htmlLanguage === language, `${document.route} HTML language is stale`);
  invariant(html.includes('<main class="seo-static-page">'), `${document.route} lacks static fallback content`);
  invariant(html.includes(`<h1>${document.title.replaceAll("&", "&amp;")}</h1>`), `${document.route} static H1 is stale`);
  invariant(!html.includes("?doc="), `${document.route} contains a query-parameter document link`);
  return { title, description };
}

const portalPage = await validatePage("index.html", "portal");
const bookPage = await validatePage("book/index.html", "book");
const helpPage = await validatePage("help/index.html", null);
invariant(
  portalPage.clientEntry !== bookPage.clientEntry,
  "portal and book must have distinct client entries",
);
invariant(helpPage.clientEntry === null, "the static help page must not load client JavaScript");
invariant(
  oneMatch(
    bookPage.html,
    /<link\s+rel="canonical"\s+href="([^"]+)"\s*\/>/g,
    "book/index.html canonical",
  ) === `${canonicalSite}book/`,
  "book/index.html must declare the canonical public book route",
);
const bookDocuments = bookSourceDocuments(repositoryRoot);
const expectedBookFallback = renderBookFallback(bookDocuments, pagesBase);
invariant(
  bookPage.html.includes(expectedBookFallback),
  "book/index.html fallback does not exactly match the canonical book corpus",
);
const expectedBookIds = bookDocuments.map((document) => bookDocumentId(document.path));
const renderedBookIds = [...bookPage.html.matchAll(
  /<section id="(book-[^"]+)"><header>/gu,
)].map((match) => match[1]);
invariant(
  JSON.stringify(renderedBookIds) === JSON.stringify(expectedBookIds),
  "book/index.html chapter order or fragment inventory differs from the canonical book corpus",
);
invariant(
  [...bookPage.html.matchAll(/<h1(?:\s[^>]*)?>/gu)].length === 1,
  "book/index.html fallback must contain exactly one H1",
);
invariant(
  [...bookPage.html.matchAll(/<h2(?:\s[^>]*)?>/gu)].length === bookDocuments.length,
  "book/index.html fallback must contain exactly one H2 chapter title per canonical document",
);
const bookIds = [...bookPage.html.matchAll(/\sid="([^"]+)"/gu)]
  .map((match) => match[1]);
invariant(
  new Set(bookIds).size === bookIds.length,
  "book/index.html fallback contains duplicate fragment identifiers",
);
const bookIdSet = new Set(bookIds);
for (const match of bookPage.html.matchAll(/\shref="#([^"]+)"/gu)) {
  invariant(
    bookIdSet.has(match[1]),
    `book/index.html fallback points to a missing fragment: #${match[1]}`,
  );
}
invariant(
  oneMatch(
    helpPage.html,
    /<link\s+rel="canonical"\s+href="([^"]+)"\s*\/>/g,
    "help/index.html canonical",
  ) === `${canonicalSite}help/`,
  "help/index.html must declare the canonical contribution-map route",
);
invariant(
  helpPage.html.includes("Current workstreams"),
  "help/index.html must render the canonical contribution map without JavaScript",
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
const portalDocuments = portalSourceDocuments(repositoryRoot);
const translatedDocuments = translatedSourceDocuments(repositoryRoot);
invariant(portalDocuments.length === sourceDocuments.length, "SEO route registry does not cover the canonical portal corpus");
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

const seoTitles = new Set();
const seoDescriptions = new Set();
for (const document of portalDocuments) {
  const relativeHtml = `${document.route}index.html`;
  const page = await validatePage(relativeHtml, "portal");
  const metadata = validateSeoDocument(page.html, document);
  invariant(!seoTitles.has(metadata.title), `duplicate SEO title: ${metadata.title}`);
  invariant(!seoDescriptions.has(metadata.description), `duplicate SEO description: ${metadata.description}`);
  seoTitles.add(metadata.title);
  seoDescriptions.add(metadata.description);
  invariant(
    portalPage.html.includes(`href="${pagesBase}${document.route}"`),
    `portal fallback does not link ${document.route}`,
  );
}

for (const document of translatedDocuments) {
  const relativeHtml = `${document.route}index.html`;
  const page = await validatePage(relativeHtml, null);
  validateSeoDocument(page.html, document);
}

const sitemap = await readFile(path.join(outputRoot, "sitemap.xml"), "utf8");
invariant(
  sitemap === renderSitemap([...portalDocuments, ...translatedDocuments]),
  "sitemap.xml is stale or malformed",
);
for (const match of sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)) {
  invariant(!/[?#]/u.test(match[1]), `sitemap.xml contains a parameter or fragment URL: ${match[1]}`);
}
const robots = await readFile(path.join(outputRoot, "robots.txt"), "utf8");
invariant(robots === renderRobots(), "robots.txt is stale or malformed");
invariant(robots.includes(`Sitemap: ${canonicalSite}sitemap.xml`), "robots.txt lacks the canonical sitemap directive");
for (const [relative, page, expectedType] of [
  ["index.html", portalPage, "WebSite"],
  ["book/index.html", bookPage, "Book"],
  ["help/index.html", helpPage, "WebPage"],
]) {
  invariant(page.html.includes('<meta name="robots" content="index,follow,max-image-preview:large"'), `${relative} is not explicitly indexable`);
  const fallbackMarker = relative === "help/index.html"
    ? '<main id="help-content" class="help-main">'
    : '<main class="seo-static-page">';
  invariant(page.html.includes(fallbackMarker), `${relative} lacks static fallback content`);
  const jsonLd = JSON.parse(oneMatch(
    page.html,
    /<script\s+type="application\/ld\+json">([^<]+)<\/script>/g,
    `${relative} JSON-LD`,
  ));
  const types = jsonLd["@graph"]?.map((entry) => entry["@type"]) ?? [jsonLd["@type"]];
  invariant(types.includes(expectedType), `${relative} lacks ${expectedType} JSON-LD`);
}

const assetEntries = await entries("assets");
invariant(assetEntries.some((entry) => entry.isFile() && entry.name.endsWith(".js")), "client JavaScript is missing");
invariant(assetEntries.some((entry) => entry.isFile() && entry.name.endsWith(".css")), "compiled Pages stylesheets are missing");

const pdfPath = "downloads/20-watts-was-enough-full-concept-book.pdf";
const pdfInformation = await regularFile(pdfPath);
invariant(pdfInformation.size >= 100_000, "book PDF is unexpectedly small");
const builtPdfPath = path.join(outputRoot, ...pdfPath.split("/"));
const [publicPdf, pdfHeader] = await Promise.all([
  readFile(path.join(repositoryRoot, "public", ...pdfPath.split("/"))),
  readFile(builtPdfPath),
]);
assertExactPublicationCopy(publicPdf, pdfHeader, pdfPath);
invariant(pdfHeader.subarray(0, 5).toString("ascii") === "%PDF-", "book download is not a PDF");
const bookManifestPath = "downloads/book-manifest.json";
await regularFile(bookManifestPath);
const [publicBookManifest, builtBookManifest] = await Promise.all([
  readFile(path.join(repositoryRoot, "public", ...bookManifestPath.split("/"))),
  readFile(path.join(outputRoot, ...bookManifestPath.split("/"))),
]);
assertExactPublicationCopy(publicBookManifest, builtBookManifest, bookManifestPath);
const bookManifest = JSON.parse(builtBookManifest.toString("utf8"));
const packageManifest = JSON.parse(await readFile(path.join(repositoryRoot, "package.json"), "utf8"));
assertBookManifestContract({
  manifest: bookManifest,
  expectedVersion: packageManifest.version,
  expectedPdf: "public/downloads/20-watts-was-enough-full-concept-book.pdf",
  expectedSourceRef: "main",
  expectedRendererLockSHA256: bookRendererLockSHA256(
    await readFile(path.join(repositoryRoot, bookRendererLockPath)),
  ),
});
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
  `GitHub Pages build validation passed: ${inventory.length} files, ${builtDocuments.length} portal documents, ${translatedDocuments.length} reviewed translations and canonical SEO routes, ${portalInitialJavaScriptBytes} initial portal JS bytes, ${repositoryManifest.artifacts.length} repository artifacts, ${plotEntries.length} plot-directory entries.`,
);
