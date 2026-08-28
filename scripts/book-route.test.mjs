import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { bookSourceFiles } from "./book-source.mjs";
import {
  assertBookPdfIntegrity,
  inspectBookPdf,
} from "./lib/book-pdf-integrity.mjs";

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const page = await readFile(new URL("../app/book/page.tsx", import.meta.url), "utf8");
const loader = await readFile(
  new URL("../app/components/book-loader.tsx", import.meta.url),
  "utf8",
);
const edition = await readFile(
  new URL("../app/components/book-edition.tsx", import.meta.url),
  "utf8",
);
const content = await readFile(new URL("../app/content.ts", import.meta.url), "utf8");
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
const viteConfig = await readFile(new URL("../vite.config.ts", import.meta.url), "utf8");
const generator = await readFile(
  new URL("./generate-book-pdf.mjs", import.meta.url),
  "utf8",
);

test("the book route keeps the complete corpus out of the Worker render", () => {
  assert.match(page, /import \{ BookLoader \}/);
  assert.doesNotMatch(page, /from "\.\.\/content"/);
  assert.doesNotMatch(page, /BookEdition/);

  assert.match(loader, /lazy\(\(\) =>\s*import\("\.\/book-edition"\)/);
  assert.match(loader, /useSyncExternalStore/);
  assert.match(loader, /\(\) => false/);
  assert.match(loader, /<BookLoadBoundary>/);
  assert.match(loader, /const parameters = new URLSearchParams\(window\.location\.search\)/);
  assert.match(loader, /parameters\.get\("pdf"\) === "1"/);
  assert.match(loader, /parameters\.get\("ref"\) \?\? "main"/);
  assert.match(loader, /<BookEdition\s+surface=\{surface\}/);
  assert.match(loader, /sourceRef=\{sourceRef\}/);

  assert.match(edition, /import \{ bookDocuments as documents \}/);
  assert.match(edition, /import type \{ ResearchDocument \}/);
  assert.doesNotMatch(edition, /import \{ documents[^}]*\} from "\.\.\/content"/);
  assert.match(edition, /export function BookEdition\(/);
});

test("the book renderer closes the Pages-only portal index during Vinext scans", () => {
  assert.match(viteConfig, /const portalIndexModuleId = "virtual:portal-document-index"/);
  assert.match(viteConfig, /name: "portal-index-fallback"/);
  assert.match(viteConfig, /id === resolvedPortalIndexModuleId \? "export default \[\];" : null/);
  assert.match(viteConfig, /portalIndexFallback\(\),\s*\n\s*vinext\(\)/);
});

test("the generated PDF uses public links and zero-state readiness copy", () => {
  assert.match(edition, /"owner-only-site" \| "github-pages" \| "public-pdf"/);
  assert.match(edition, /const usesPublicLinks = isGitHubPages \|\| isPublicPdf/);
  assert.match(edition, /const repositoryRef = repositoryRefForSurface\(surface, sourceRef, editionVersion\)/);
  assert.match(edition, /const surfaceDocumentHref = repositoryDocumentHrefFor\(repositoryRef\)/);
  assert.match(edition, /const canonicalPublicBook = "https:\/\/www\.cordana\.dev\/"/);
  assert.match(edition, /isPublicPdf \? canonicalPublicBook : assetBasePath/);
  assert.match(edition, /usesPublicLinks \? "View source on GitHub" : "← Owner-only research site"/);
  assert.match(edition, /publicSurface=\{usesPublicLinks\}/);
  assert.match(readiness, /ledgerOnly\.proposedArtifactFamilies === 0/);
  assert.match(readiness, /No ledger-only record currently requires a new experiment family/);
  assert.match(readiness, /The public Git repository contains the complete artifact table/);
  assert.match(generator, /parseBookPdfGenerationOptions\(process\.argv\.slice\(2\)\)/);
  assert.match(generator, /ref=\$\{encodeURIComponent\(sourceRef\)\}/);
  assert.match(generator, /source_ref: sourceRef/);
});

test("the private reader distinguishes JSON contracts and exposes linked source artifacts", () => {
  assert.match(content, /path\.startsWith\("assets\/plots\/"\)/);
  assert.match(content, /checked-in machine-readable JSON Schema/);
  assert.match(content, /checked-in machine-readable experiment contract or artifact/);
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
  assert.equal(sources.includes("package-lock.json"), true);
  assert.equal(sources.includes("CITATION.cff"), true);
  assert.equal(sources.includes("app/lib/book-release-identity.mjs"), true);
  assert.equal(sources.includes("app/project-metadata.ts"), true);
  assert.equal(sources.includes("scripts/lib/book-pdf-generation-options.mjs"), true);
  assert.equal(sources.includes("scripts/lib/book-pdf-integrity.mjs"), true);
  assert.equal(sources.includes("scripts/lib/pages-base.mjs"), true);
  assert.equal(sources.includes("scripts/lib/pdf-metadata.mjs"), true);
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
