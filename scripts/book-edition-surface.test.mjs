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
import {
  assertBookRendererLockIdentity,
  bookRendererIdentityFromEnvironment,
  bookRendererLockSHA256,
} from "./lib/book-renderer-identity.mjs";

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

test("PDF renderer identity is exact and source-lock-bound", () => {
  const lockSHA256 = bookRendererLockSHA256(Buffer.from("locked renderer\n"));
  const identity = bookRendererIdentityFromEnvironment({
    BOOK_RENDERER_LOCK_SHA256: lockSHA256,
    BOOK_RENDERER_IMAGE_ID: `sha256:${"d".repeat(64)}`,
    BOOK_RENDERER_PLATFORM: "linux/amd64",
  });
  assert.deepEqual(identity, {
    lock: "tooling/pdf-renderer/lock.json",
    lock_sha256: lockSHA256,
    image_id: `sha256:${"d".repeat(64)}`,
    platform: "linux/amd64",
  });
  assert.equal(assertBookRendererLockIdentity(identity, Buffer.from("locked renderer\n")), identity);
  assert.throws(
    () => assertBookRendererLockIdentity(identity, Buffer.from("changed renderer\n")),
    /does not match the checked-in lock bytes/u,
  );
  assert.throws(() => bookRendererIdentityFromEnvironment({}), /lock SHA-256 is missing/u);
  assert.throws(
    () => bookRendererIdentityFromEnvironment({
      BOOK_RENDERER_LOCK_SHA256: lockSHA256,
      BOOK_RENDERER_IMAGE_ID: "renderer:latest",
      BOOK_RENDERER_PLATFORM: "linux/amd64",
    }),
    /image ID is missing or invalid/u,
  );
});

test("the book manifest must carry the package version and explicit source ref", () => {
  const rendererLockSHA256 = "a".repeat(64);
  const manifest = {
    schema_version: 3,
    version: "0.2.0",
    source_ref: "main",
    pdf: "public/downloads/20-watts-was-enough-full-concept-book.pdf",
    renderer: {
      lock: "tooling/pdf-renderer/lock.json",
      lock_sha256: rendererLockSHA256,
      image_id: `sha256:${"b".repeat(64)}`,
      platform: "linux/amd64",
    },
  };
  const contract = {
    expectedVersion: "0.2.0",
    expectedPdf: manifest.pdf,
    expectedSourceRef: "main",
    expectedRendererLockSHA256: rendererLockSHA256,
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
  assert.throws(
    () => assertBookManifestContract({
      manifest,
      ...contract,
      expectedRendererLockSHA256: "c".repeat(64),
    }),
    /renderer lock SHA-256 does not match/u,
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

test("the biomimetic transfer figure uses a print-safe flow and caption", async () => {
  const [chapter, stylesheet] = await Promise.all([
    source("concept/07-cross-domain-convergence.md"),
    source("app/globals.css"),
  ]);
  const sectionStart = chapter.indexOf(
    "### Biomimetic transfer is a search method, not an evidence grade",
  );
  const sectionEnd = chapter.indexOf("### Five solution families", sectionStart);
  assert.ok(sectionStart >= 0 && sectionEnd > sectionStart);
  const section = chapter.slice(sectionStart, sectionEnd);

  assert.match(section, /```mermaid\s+flowchart TB/u);
  assert.doesNotMatch(section, /```mermaid\s+flowchart LR/u);

  const printStart = stylesheet.lastIndexOf("@media print");
  assert.ok(printStart >= 0);
  const print = stylesheet.slice(printStart);
  assert.match(
    print,
    /\.book-prose \.diagram-layout-note\s*\{[^}]*display:\s*none;/s,
  );
  assert.match(
    print,
    /\.book-prose \.diagram\.semantic-figure > figcaption\s*\{[^}]*position:\s*static;[^}]*left:\s*auto;[^}]*width:\s*auto;/s,
  );
});

test("portal utility text and card accents retain readable contrast", async () => {
  const stylesheet = await source("app/globals.css");
  const portalStart = stylesheet.indexOf("/* Public research portal");
  const portalEnd = stylesheet.indexOf("/* Research readiness", portalStart);
  assert.ok(portalStart >= 0 && portalEnd > portalStart);
  const portal = stylesheet.slice(portalStart, portalEnd);

  assert.doesNotMatch(portal, /font-size:\s*(?:8|9|10)px/);
  assert.match(stylesheet, /\.portal-dashboard-funnel\s*\{[^}]*grid-column:\s*1 \/ -1/s);
  assert.match(portal, /\.portal-shell\s*\{[^}]*overflow-x:\s*clip/s);
  assert.match(stylesheet, /\.prose table\s*\{[^}]*font-size:\s*14px/s);
  assert.match(stylesheet, /\.diagram-scroll-region\s*\{[^}]*overflow-x:\s*auto/s);
  assert.match(stylesheet, /\.portal-mobile-menu nav a\s*\{[^}]*min-height:\s*44px/s);
  assert.match(stylesheet, /\.prose th\s*\{[^}]*font-size:\s*14px;[^}]*line-height:\s*1\.35/s);
  assert.doesNotMatch(stylesheet, /\.portal-header nav a:(?:first-child|nth-child\()/);

  const publicationPass = stylesheet.slice(stylesheet.indexOf(
    "/* Research-publication pass: manuscript first, evidence chrome second. */",
  ));
  const mobilePublicationStart = publicationPass.indexOf(
    "@media screen and (max-width: 700px)",
  );
  assert.ok(mobilePublicationStart >= 0);
  const mobilePublicationPass = publicationPass.slice(mobilePublicationStart);
  assert.match(
    mobilePublicationPass,
    /\.portal-funnel-step a\s*\{[^}]*min-height:\s*44px/s,
  );
  assert.doesNotMatch(
    mobilePublicationPass,
    /\.portal-funnel-step a\s*\{[^}]*min-height:\s*(?:[0-9]|[1-3][0-9]|4[0-3])px/s,
  );
  assert.match(
    mobilePublicationPass,
    /\.portal-dashboard \.portal-action-tertiary\s*\{[^}]*min-height:\s*44px/s,
  );
  assert.doesNotMatch(
    mobilePublicationPass,
    /\.portal-dashboard \.portal-action-tertiary\s*\{[^}]*min-height:\s*(?:[0-9]|[1-3][0-9]|4[0-3])px/s,
  );
  assert.match(publicationPass, /\.portal-funnel-step strong\s*\{[^}]*color:\s*#285d41/s);
  assert.match(publicationPass, /\.portal-start-card > span\s*\{[^}]*color:\s*#596c61/s);
  assert.match(publicationPass, /\.portal-start-card:hover\s*\{[^}]*background:\s*transparent;[^}]*color:\s*#0f5534/s);
  assert.match(publicationPass, /\.portal-dashboard\s*\{[^}]*grid-template-columns:\s*minmax\(0, 650px\) minmax\(380px, 520px\)[^}]*background:\s*var\(--portal-cream\)/s);
  assert.match(publicationPass, /\.portal-status-outcome\s*\{[^}]*border-left:\s*3px solid #b37b1c[^}]*background:\s*transparent/s);
  assert.match(publicationPass, /\.portal-funnel\s*\{[^}]*grid-template-columns:\s*1fr[^}]*border:\s*0/s);
  assert.match(publicationPass, /\.portal-reader-grid\s*\{[^}]*grid-template-columns:\s*235px minmax\(0, 900px\) 195px[^}]*border:\s*0/s);
  assert.match(publicationPass, /\.portal-prose\s*\{[^}]*font-size:\s*18px[^}]*line-height:\s*1\.66/s);
  assert.match(publicationPass, /@media screen and \(max-width: 460px\)[\s\S]*\.portal-wordmark strong\s*\{[^}]*display:\s*block/s);
});

test("the focused reader has one publication owner and a non-clipping rail", async () => {
  const [portalComponent, stylesheet] = await Promise.all([
    source("app/components/public-research-portal.tsx"),
    source("app/globals.css"),
  ]);
  const ownerMarker = "/* Focused research reader: one publication layout owns every viewport. */";
  const ownerStart = stylesheet.indexOf(ownerMarker);
  assert.ok(ownerStart >= 0);
  assert.equal(stylesheet.split(ownerMarker).length - 1, 1);
  assert.doesNotMatch(stylesheet, /Screen reading pass/u);

  const beforeOwner = stylesheet.slice(0, ownerStart);
  for (const selector of [
    "portal-reader-page",
    "portal-reader-toolbar",
    "portal-reader-workspace",
    "portal-reader-grid",
    "portal-library",
    "portal-document-list",
    "portal-reader",
    "portal-reader-header",
    "portal-reader-meta",
    "portal-prose",
    "portal-document-state",
    "portal-outline",
    "portal-mobile-outline",
  ]) {
    assert.doesNotMatch(
      beforeOwner,
      new RegExp(`^\\s*\\.${selector}\\s*\\{`, "mu"),
      `${selector} must be owned by the focused reader section`,
    );
  }

  assert.doesNotMatch(
    stylesheet,
    /^\.(?:research-shell|topbar|sidebar|reader-main|document-wrap|document-pager|outline)\s*\{/mu,
  );
  assert.doesNotMatch(portalComponent, /portal-reader-stack-top|readerToolbarRef|ResizeObserver/u);

  const reader = stylesheet.slice(ownerStart);
  assert.match(reader, /\.portal-reader\s*\{[^}]*--reading-measure:\s*68ch/s);
  assert.match(reader, /\.portal-prose\s*\{[^}]*font-size:\s*18px;[^}]*line-height:\s*1\.66/s);
  assert.match(reader, /\.portal-prose > :is\([^)]*\)\s*\{[^}]*max-width:\s*var\(--reading-measure\)/s);
  assert.match(reader, /\.portal-library \.portal-filter-tabs\s*\{[^}]*grid-template-columns:\s*repeat\(2, minmax\(0, 1fr\)\)/s);
  assert.match(reader, /\.portal-library \.portal-filter-tabs button:last-child\s*\{[^}]*grid-column:\s*1 \/ -1/s);
  assert.match(reader, /@media screen and \(max-width: 1080px\)[\s\S]*\.portal-reader-grid\s*\{[^}]*grid-template-columns:\s*225px minmax\(0, 820px\)/s);
  assert.match(reader, /@media screen and \(max-width: 880px\)[\s\S]*\.portal-reader-page \.portal-library\s*\{[^}]*display:\s*none/s);
  assert.match(reader, /\.portal-mobile-outline summary\s*\{[^}]*min-height:\s*44px/s);
  assert.match(reader, /\.portal-document-state\s*\{[^}]*font-size:\s*14px/s);
  assert.match(reader, /\.portal-document-state\[role="alert"\]\s*\{[^}]*border-left-color:\s*#a92d31/s);
});
