import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import {
  repositoryDocumentHref,
  repositoryRefForSurface,
  repositoryTreeHref,
} from "../app/lib/book-release-identity.mjs";
import { assertBookManifestContract } from "./lib/book-manifest-contract.mjs";
import { parseBookPdfGenerationOptions } from "./lib/book-pdf-generation-options.mjs";

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

async function source(relative) {
  return readFile(path.join(repositoryRoot, relative), "utf8");
}

test("PDF source links use their explicit ref while Pages follows main", () => {
  const releasePdfRef = repositoryRefForSurface("public-pdf", "v0.2.0", "0.2.0");
  const currentPdfRef = repositoryRefForSurface("public-pdf", "main", "0.2.0");
  const pagesRef = repositoryRefForSurface("github-pages", "main", "0.2.0");

  assert.equal(releasePdfRef, "v0.2.0");
  assert.equal(currentPdfRef, "main");
  assert.equal(pagesRef, "main");
  assert.equal(
    repositoryDocumentHref(releasePdfRef, "concept/01-core-thesis.md", "efficiency model"),
    "https://github.com/lusoris/20-watts-was-enough/blob/v0.2.0/concept/01-core-thesis.md#efficiency%20model",
  );
  assert.equal(
    repositoryDocumentHref(pagesRef, "concept/01-core-thesis.md"),
    "https://github.com/lusoris/20-watts-was-enough/blob/main/concept/01-core-thesis.md",
  );
  assert.equal(
    repositoryTreeHref(releasePdfRef),
    "https://github.com/lusoris/20-watts-was-enough/tree/v0.2.0",
  );
  assert.throws(
    () => repositoryRefForSurface("public-pdf", "v0.3.0", "0.2.0"),
    /does not match edition version/u,
  );
});

test("PDF generation accepts only one bounded source-ref option", () => {
  assert.deepEqual(parseBookPdfGenerationOptions([]), { sourceRef: "main" });
  assert.deepEqual(
    parseBookPdfGenerationOptions(["--ref", "v0.2.0"]),
    { sourceRef: "v0.2.0" },
  );
  assert.throws(() => parseBookPdfGenerationOptions(["--ref"]), /Usage:/u);
  assert.throws(() => parseBookPdfGenerationOptions(["--other", "main"]), /Usage:/u);
  assert.throws(
    () => parseBookPdfGenerationOptions(["--ref", "release/latest"]),
    /main or vMAJOR\.MINOR\.PATCH/u,
  );
});

test("the book manifest must carry the package version and explicit source ref", () => {
  const manifest = {
    schema_version: 2,
    version: "0.2.0",
    source_ref: "main",
    pdf: "public/downloads/20-watts-was-enough-full-concept-book.pdf",
  };
  const contract = {
    expectedVersion: "0.2.0",
    expectedPdf: manifest.pdf,
    expectedSourceRef: "main",
  };

  assert.equal(assertBookManifestContract({ manifest, ...contract }), manifest);
  assert.throws(
    () => assertBookManifestContract({
      manifest: { ...manifest, version: "0.1.0" },
      ...contract,
    }),
    /does not match package version "0\.2\.0"/u,
  );
  assert.throws(
    () => assertBookManifestContract({
      manifest,
      ...contract,
      expectedSourceRef: "v0.2.0",
    }),
    /does not match expected ref "v0\.2\.0"/u,
  );
});

test("the book namespaces heading fragments while retaining document anchors", async () => {
  const edition = await source("app/components/book-edition.tsx");

  assert.match(edition, /function documentHeadingId\(path: string, headingId: string\)/);
  assert.match(edition, /heading\.dataset\.bookLegacyHeadingId \?\? heading\.id/);
  assert.match(edition, /heading\.id = documentHeadingId\(researchDocument\.path, legacyId\)/);
  assert.match(edition, /return hash \? `#\$\{documentHeadingId\(path, hash\)\}` : `#\$\{bookId\(path\)\}`/);
  assert.match(edition, /id=\{bookId\(document\.path\)\}/);
});

test("the web book defers media work while PDF rendering stays eager", async () => {
  const [edition, stylesheet] = await Promise.all([
    source("app/components/book-edition.tsx"),
    source("app/globals.css"),
  ]);

  assert.match(edition, /imageLoading=\{isPublicPdf \? "eager" : "lazy"\}/);
  assert.match(edition, /isGitHubPages \? "book-shell-web" : "book-shell-print"/);
  assert.match(stylesheet, /\.book-shell-web \.book-document\s*\{[^}]*content-visibility:\s*auto;/s);
  assert.match(stylesheet, /contain-intrinsic-size:\s*auto 900px/);
  assert.match(stylesheet, /\.book-cover-support\s*\{[^}]*display:\s*flex;/s);
  assert.match(
    stylesheet,
    /@media print[\s\S]*\.book-cover-support\s*\{[^}]*break-inside:\s*avoid;/s,
  );
});

test("portal utility text and card accents retain readable contrast", async () => {
  const stylesheet = await source("app/globals.css");
  const portalStart = stylesheet.indexOf("/* Public research portal");
  const portalEnd = stylesheet.indexOf("/* Research readiness", portalStart);
  assert.ok(portalStart >= 0 && portalEnd > portalStart);
  const portal = stylesheet.slice(portalStart, portalEnd);

  assert.doesNotMatch(portal, /font-size:\s*(?:8|9|10)px/);
  for (const contrastToken of [
    "--card-accent-text: #1459b8",
    "--card-accent-text: #a92d31",
    "--card-accent-text: #6240b8",
    "--card-accent-text: #805000",
    "--card-accent-text: #006971",
  ]) assert.ok(portal.includes(contrastToken), contrastToken);
  assert.match(stylesheet, /\.portal-start-card:hover\s*\{[^}]*background:\s*#0d2118/s);
  assert.match(stylesheet, /\.portal-status-outcome\s*\{[^}]*border:\s*2px solid #ff827b/s);
  assert.match(stylesheet, /\.portal-dashboard-funnel\s*\{[^}]*grid-column:\s*1 \/ -1/s);
  assert.match(portal, /\.portal-document-state\s*\{[^}]*font-size:\s*14px/s);
  assert.match(portal, /\.portal-document-state\[role="alert"\]\s*\{[^}]*border-left-color:\s*#a92d31/s);
  assert.match(portal, /\.portal-shell\s*\{[^}]*overflow-x:\s*clip/s);
  assert.match(stylesheet, /\.prose table\s*\{[^}]*font-size:\s*14px/s);
  assert.match(stylesheet, /\.diagram-scroll-region\s*\{[^}]*overflow-x:\s*auto/s);
  assert.match(stylesheet, /\.portal-reader-page \.portal-library\s*\{[^}]*display:\s*none/s);
  assert.match(stylesheet, /\.portal-mobile-outline\s*\{[^}]*position:\s*sticky/s);
  assert.match(stylesheet, /\.portal-mobile-menu nav a\s*\{[^}]*min-height:\s*44px/s);
  assert.match(stylesheet, /\.portal-library \.portal-document-list\s*\{[^}]*flex:\s*1;[^}]*min-height:\s*0;[^}]*max-height:\s*none/s);
  assert.match(stylesheet, /\.portal-prose h4\s*\{[^}]*font-size:\s*17px;[^}]*font-weight:\s*750/s);
  assert.match(stylesheet, /\.prose th\s*\{[^}]*font-size:\s*14px;[^}]*line-height:\s*1\.35/s);
  assert.match(stylesheet, /\.portal-reader-toolbar\s*\{[^}]*background:\s*#fff/s);
  assert.match(stylesheet, /\.portal-reader \.portal-prose > h2:first-child\s*\{[^}]*display:\s*none/s);
  assert.match(stylesheet, /top:\s*var\(--portal-reader-stack-top, 142px\)/);
  assert.match(stylesheet, /scroll-margin-top:\s*calc\(var\(--portal-reader-stack-top, 142px\) \+ 8px\)/);
  assert.match(stylesheet, /@media screen and \(max-width: 760px\)[\s\S]*\.portal-funnel-step a\s*\{[^}]*min-height:\s*44px/s);
  assert.doesNotMatch(stylesheet, /\.portal-header nav a:(?:first-child|nth-child\()/);
});
