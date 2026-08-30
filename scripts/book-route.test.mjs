import assert from "node:assert/strict";
import { mkdir, mkdtemp, readFile, rm, symlink, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { bookSourceFiles } from "./book-source.mjs";
import { publication } from "../app/lib/publication.mjs";
import { resolveViteCacheDirectory } from "./lib/vite-cache-directory.mjs";
import {
  assertBookPdfIntegrity,
  inspectBookPdf,
} from "./lib/book-pdf-integrity.mjs";

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const page = await readFile(new URL("../github-pages/book.tsx", import.meta.url), "utf8");
const edition = await readFile(
  new URL("../app/components/book-edition.tsx", import.meta.url),
  "utf8",
);
const content = await readFile(new URL("../app/portal-content.ts", import.meta.url), "utf8");
const markdownDocument = await readFile(
  new URL("../app/components/markdown-document.tsx", import.meta.url),
  "utf8",
);
const readiness = await readFile(
  new URL("../app/components/readiness-overview.tsx", import.meta.url),
  "utf8",
);
const mermaidDiagram = await readFile(
  new URL("../app/components/mermaid-diagram.tsx", import.meta.url),
  "utf8",
);
const globalStyles = await readFile(
  new URL("../app/globals.css", import.meta.url),
  "utf8",
);
const viteConfig = await readFile(new URL("../vite.pages.config.ts", import.meta.url), "utf8");
const generator = await readFile(
  new URL("./generate-book-pdf.mjs", import.meta.url),
  "utf8",
);

test("the Pages book route selects web and PDF identities without a server runtime", () => {
  assert.match(page, /import \{ BookEdition \}/);
  assert.match(page, /const parameters = new URLSearchParams\(window\.location\.search\)/);
  assert.match(page, /parameters\.get\("pdf"\) === "1" \? "public-pdf" : "github-pages"/);
  assert.match(page, /parameters\.get\("ref"\) \?\? "main"/);
  assert.match(page, /<BookEdition/);
  assert.match(page, /surface=\{surface\}/);
  assert.match(page, /sourceRef=\{sourceRef\}/);
  assert.match(edition, /import \{ bookDocuments as documents \}/);
  assert.match(edition, /import type \{ ResearchDocument \}/);
  assert.match(edition, /export function BookEdition\(/);
});

test("the book renderer is one explicit entry in the static Pages build", () => {
  assert.match(viteConfig, /const portalIndexModuleId = "virtual:portal-document-index"/);
  assert.match(viteConfig, /book:\s*path\.join\(repositoryRoot, "github-pages", "book", "index\.html"\)/);
  assert.doesNotMatch(viteConfig, /vinext|cloudflare|sites\(\)/);
});

test("the renderer Vite cache accepts only its canonical temporary directory", async (t) => {
  const temporaryRoot = await mkdtemp(path.join(os.tmpdir(), "20w-vite-cache-test-"));
  t.after(() => rm(temporaryRoot, { recursive: true, force: true }));
  const expected = path.join(temporaryRoot, "vite-cache");
  assert.equal(resolveViteCacheDirectory({
    override: expected,
    repositoryRoot,
    systemTemporaryDirectory: temporaryRoot,
  }), expected);
  assert.throws(() => resolveViteCacheDirectory({
    override: path.join(temporaryRoot, "..", "escaped"),
    repositoryRoot,
    systemTemporaryDirectory: temporaryRoot,
  }), /must be exactly/u);
  await mkdir(path.join(temporaryRoot, "target"));
  await symlink(path.join(temporaryRoot, "target"), expected);
  assert.throws(() => resolveViteCacheDirectory({
    override: expected,
    repositoryRoot,
    systemTemporaryDirectory: temporaryRoot,
  }), /non-symlink directory/u);
});

test("the generated PDF uses public links and zero-state readiness copy", () => {
  assert.match(edition, /"github-pages" \| "public-pdf"/);
  assert.match(edition, /const repositoryRef = repositoryRefForSurface\(surface, sourceRef, editionVersion\)/);
  assert.match(edition, /const surfaceDocumentHref = repositoryDocumentHrefFor\(repositoryRef\)/);
  assert.equal(publication.canonicalSite, "https://www.cordana.dev/");
  assert.match(edition, /const canonicalPublicBook = publication\.canonicalSite/);
  assert.match(edition, /isPublicPdf \? canonicalPublicBook : assetBasePath/);
  assert.match(edition, />View source on GitHub<\/a>/);
  assert.match(edition, /const helpHref = joinBasePath\(supportBasePath, "help\/"\)/);
  assert.match(edition, /`\[Site\/Docs\] book\/ @ \$\{repositoryRef\}`/);
  assert.match(edition, /className="book-cover-support" aria-label="Edition support"/);
  assert.match(edition, /<a href=\{helpHref\}>How to help<\/a>/);
  assert.match(edition, /<a href=\{bookIssueHref\}>Report this edition<\/a>/);
  assert.doesNotMatch(edition, /issues\/new\/choose/);
  assert.match(readiness, /ledgerOnly\.proposedArtifactFamilies === 0/);
  assert.match(readiness, /No ledger-only record currently requires a new experiment family/);
  assert.match(readiness, /The public Git repository contains the complete artifact table/);
  assert.match(generator, /parseBookPdfGenerationOptions\(process\.argv\.slice\(2\)\)/);
  assert.match(generator, /ref=\$\{encodeURIComponent\(sourceRef\)\}/);
  assert.match(generator, /source_ref: sourceRef/);
  assert.match(generator, /schema_version: 3/);
  assert.match(generator, /renderer: rendererIdentity/);
  assert.match(generator, /"--configLoader",\s*"runner"/s);
  assert.match(viteConfig, /cacheDir: pagesCacheDirectory/);
  assert.match(mermaidDiagram, /diagramRenderId\(reactId, \+\+renderAttemptRef\.current\)/);
  assert.match(mermaidDiagram, /-\$\{attempt\}`/);
  assert.match(generator, /\.diagram-canvas > svg/);
  assert.match(generator, /rendered_diagrams: observedRenderedDiagrams/);
  assert.match(generator, /invalidDiagrams: invalid/);
  assert.match(generator, /replaceFilePair/);
  assert.match(edition, /renderExternalImages=\{!isPublicPdf\}/);
  assert.match(markdownDocument, /!renderExternalImages && isExternalImageSource\(source\)/);
  assert.match(markdownDocument, /className="external-image-reference"/);
});

test("the public reader loads canonical Markdown and exposes linked source artifacts", () => {
  assert.match(content, /loadPortalDocument/);
  assert.match(content, /Document request returned HTML instead of Markdown/);
  assert.match(markdownDocument, /repositoryArtifactHref\(internal\.path\)/);
  assert.match(markdownDocument, /data-repository-artifact/);
});

test("the book constrains readiness grids and keeps wide diagrams readable on narrow screens", () => {
  assert.match(
    globalStyles,
    /\.readiness-overview\s*\{[^}]*grid-template-columns:\s*minmax\(0,\s*1fr\)/s,
  );
  assert.match(globalStyles, /\.readiness-overview\s*>\s*\*\s*\{[^}]*min-width:\s*0/s);
  assert.match(
    globalStyles,
    /\.readiness-table-wrap\s*\{[^}]*width:\s*100%[^}]*min-width:\s*0/s,
  );
  assert.match(
    globalStyles,
    /@media\s*\(max-width:\s*760px\)[\s\S]*\.diagram-wide\s+\.diagram-canvas\s*\{[^}]*min-width:\s*min\(var\(--diagram-width\),\s*760px\)/,
  );
  assert.match(
    globalStyles,
    /\.diagram-wide\s+\.diagram-canvas\s+svg\s*\{[^}]*width:\s*min\(var\(--diagram-width\),\s*760px\)[^}]*max-width:\s*none/s,
  );
  assert.match(mermaidDiagram, /Wide diagram · scroll horizontally on narrow screens/);
});

test("the full-book source identity includes the locked renderer dependency graph", async () => {
  const sources = (await bookSourceFiles(repositoryRoot)).map((file) => (
    path.relative(repositoryRoot, file).replaceAll("\\", "/")
  ));
  const requiredClosure = [
    "CITATION.cff",
    "app/components/language-access.tsx",
    "app/lib/book-release-identity.mjs",
    "app/lib/eu-languages.mjs",
    "app/lib/language-access.mjs",
    "app/lib/publication.mjs",
    "app/project-metadata.ts",
    "package-lock.json",
    "public/og-v2.jpg",
    "scripts/lib/book-pdf-generation-options.mjs",
    "scripts/lib/book-pdf-integrity.mjs",
    "scripts/lib/book-renderer-identity.mjs",
    "scripts/lib/pages-base.mjs",
    "scripts/lib/pages-seo.mjs",
    "scripts/lib/pdf-metadata.mjs",
    "scripts/lib/plain-text.mjs",
    "scripts/lib/portal-documents.mjs",
    "scripts/lib/portal-metrics.mjs",
    "scripts/lib/source-boundary.mjs",
    "scripts/lib/strict-json.mjs",
    "scripts/lib/translation-manifest.mjs",
    "scripts/lib/translation-pages.mjs",
    "scripts/lib/vite-cache-directory.mjs",
    "scripts/install-locked-npm.mjs",
    "scripts/npm-runtime-lock.json",
    "tooling/cmd/20w/main.go",
    "tooling/cmd/20w/translation.go",
    "tooling/go.mod",
    "tooling/internal/buildinfo/buildinfo.go",
    "tooling/internal/docscheck/check.go",
    "tooling/internal/experiment/catalog.go",
    "tooling/internal/githublabels/labels.go",
    "tooling/internal/nodeimage/package.go",
    "tooling/internal/ocimanifest/manifest.go",
    "tooling/internal/pdfrender/dockerfile.go",
    "tooling/internal/pdfrender/publication.go",
    "tooling/internal/pdfrender/render.go",
    "tooling/internal/releasecheck/inventory.go",
    "tooling/internal/releasecheck/release_state.go",
    "tooling/internal/releasecheck/remote_assets.go",
    "tooling/internal/releasecheck/tag.go",
    "tooling/internal/releaseimage/inspect.go",
    "tooling/internal/strictjson/validate.go",
    "tooling/internal/translationbundle/bundle.go",
    "tooling/internal/translationbundle/files.go",
    "tooling/internal/translationbundle/languages.go",
    "tooling/internal/translationbundle/shape.go",
    "tooling/pdf-renderer/lock.json",
    "translations/eu-languages.json",
    "translations/manifest.json",
  ];
  for (const source of requiredClosure) assert.equal(sources.includes(source), true, source);
});

test("the book manifest rejects a same-size PDF byte replacement", async () => {
  const directory = await mkdtemp(path.join(os.tmpdir(), "20w-book-integrity-"));
  const pdf = path.join(directory, "book.pdf");
  try {
    const bytes = Buffer.alloc(100_000, 0x20);
    bytes.write("%PDF-1.7\n", 0, "ascii");
    await writeFile(pdf, bytes);
    const manifest = await inspectBookPdf(pdf);
    await assertBookPdfIntegrity(pdf, manifest);

    bytes[bytes.length - 1] = 0x21;
    await writeFile(pdf, bytes);
    await assert.rejects(
      assertBookPdfIntegrity(pdf, manifest),
      /PDF SHA-256 does not match/u,
    );
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});
