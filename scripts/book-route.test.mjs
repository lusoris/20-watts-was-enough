import assert from "node:assert/strict";
import { copyFile, mkdir, mkdtemp, readFile, rm, symlink, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { bookSourceDigest, bookSourceFiles } from "./book-source.mjs";
import { publication } from "../app/lib/publication.mjs";
import {
  isPublicRepositoryArtifact,
  repositoryArtifactHref,
} from "../app/lib/repository-artifacts.ts";
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
const editionIdentity = await readFile(
  new URL("../app/lib/book-release-identity.mjs", import.meta.url),
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
  assert.match(page, /const surface = bookSurfaceFromLocation\(window\.location\)/);
  assert.match(
    editionIdentity,
    /pdfRendererHostnames = new Set\(\["127\.0\.0\.1", "\[::1\]", "localhost"\]\)/,
  );
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
  assert.match(edition, /const identity = currentBookIdentity\(surface, sourceRef, editionVersion, sourceRevision\)/);
  assert.match(editionIdentity, /export function bookEditionIdentity\(input\)/);
  assert.match(edition, /const surfaceDocumentHref = repositoryDocumentHrefFor\(identity\.repositoryLinkRef\)/);
  assert.equal(publication.canonicalSite, "https://www.cordana.dev/");
  assert.match(edition, /const canonicalPublicSite = publication\.canonicalSite/);
  assert.match(edition, /publication\.bookPath,[\s\S]*publication\.canonicalSite/u);
  assert.match(edition, /isPublicPdf \? canonicalPublicSite : assetBasePath/);
  assert.match(edition, /publication\.bookPdfPath/u);
  assert.match(edition, />View source on GitHub<\/a>/);
  assert.match(edition, /helpHref: joinBasePath\(supportBasePath, "help\/"\)/);
  assert.match(
    edition,
    /`\[Site\/Docs\] book\/ @ \$\{identity\.sourceRevision\?\.slice\(0, 12\) \?\? identity\.repositoryRef\}`/,
  );
  assert.match(edition, /className="book-cover-support" aria-label="Edition support"/);
  assert.match(edition, /<a href=\{support\.helpHref\}>How to help<\/a>/);
  assert.match(edition, /<a href=\{support\.issueHref\}>Report this edition<\/a>/);
  assert.doesNotMatch(edition, /issues\/new\/choose/);
  assert.match(readiness, /ledgerOnly\.proposedArtifactFamilies === 0/);
  assert.match(readiness, /No ledger-only record currently requires a new experiment family/);
  assert.match(readiness, /The public Git repository contains the complete artifact table/);
  assert.match(generator, /parseBookPdfGenerationOptions\(process\.argv\.slice\(2\)\)/);
  assert.match(generator, /ref=\$\{encodeURIComponent\(sourceRef\)\}/);
  assert.match(generator, /revision=\$\{encodeURIComponent\(sourceRevision\)\}/);
  assert.match(generator, /source_ref: sourceRef/);
  assert.match(generator, /source_revision: sourceRevision/);
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
  assert.match(markdownDocument, /isPublicRepositoryArtifact\(internal\.path\)/);
  assert.match(markdownDocument, /data-repository-artifact/);
});

test("only explicitly public repository artifacts receive static reader copies", () => {
  assert.equal(isPublicRepositoryArtifact("assets/plots/core-models.json"), true);
  assert.equal(isPublicRepositoryArtifact(".github/milestones.json"), false);
  assert.equal(
    repositoryArtifactHref("assets/plots/core-models.json"),
    "/repository-files/assets/plots/core-models.json.txt",
  );
  assert.match(edition, /!isPublicRepositoryArtifact\(path\)/);
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
    "tooling/cmd/20w/clrs_compare.go",
    "tooling/internal/clrsfixture/compare.go",
    "tooling/internal/clrsfixture/compare_files.go",
    "tooling/cmd/20w/clrs_sbom.go",
    "tooling/internal/clrsfixture/sbom.go",
    "tooling/internal/clrsfixture/sbom_execution.go",
    "tooling/internal/clrsfixture/sbom_files.go",
    "tooling/internal/clrsfixture/sbom_inventory.go",
    "tooling/internal/clrsfixture/sbom_receipt.go",
    "tooling/cmd/20w/clrs_invocation.go",
    "tooling/internal/clrsfixture/invocation.go",
    "tooling/internal/clrsfixture/invocation_payload.go",
    "tooling/cmd/20w/clrs_context.go",
    "tooling/internal/clrscontext/context.go",
    "tooling/internal/clrscontext/dockerfile.go",
    "tooling/internal/clrscontext/files.go",
    "tooling/internal/clrscontext/publish.go",
    "tooling/internal/clrscontext/source.go",
    "tooling/internal/clrscontext/tar.go",
    "CITATION.cff",
    "app/components/language-access.tsx",
    "app/components/overflow-region.tsx",
    "app/lib/book-release-identity.mjs",
    "app/lib/eu-languages.mjs",
    "app/lib/language-access.mjs",
    "app/lib/publication.mjs",
    "experiments/candidates/001-adaptive-topology.md",
    "experiments/fixtures/001-shared-clock-free-coadaptation.md",
    "github-pages/public-artifacts.json",
    "app/project-metadata.ts",
    "package-lock.json",
    "public/og-v2.jpg",
    "research/audits/2026-08-06-biomimetics-transfer-methodology.md",
    "research/claims.md",
    "research/principle-registry.md",
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
    "tooling/cmd/20w/pdf_reproducibility.go",
    "tooling/cmd/20w/translation.go",
    "tooling/go.mod",
    "tooling/internal/buildinfo/buildinfo.go",
    "tooling/internal/docscheck/check.go",
    "tooling/internal/docscheck/mermaid-duplicate-baseline.json",
    "tooling/internal/docscheck/mermaid.go",
    "tooling/internal/experiment/catalog.go",
    "tooling/internal/githubapi/client.go",
    "tooling/internal/githublabels/labels.go",
    "tooling/internal/nodeimage/package.go",
    "tooling/internal/ocimanifest/manifest.go",
    "tooling/internal/pdfrender/dockerfile.go",
    "tooling/internal/pdfrender/image_proof.go",
    "tooling/internal/pdfrender/image_proof_command.go",
    "tooling/internal/pdfrender/image_proof_process_linux.go",
    "tooling/internal/pdfrender/image_proof_process_unsupported.go",
    "tooling/internal/pdfrender/image_proof_tar.go",
    "tooling/internal/pdfrender/installed_dependencies.go",
    "tooling/internal/pdfrender/installed_inventory.go",
    "tooling/internal/pdfrender/publication.go",
    "tooling/internal/pdfrender/render.go",
    "tooling/internal/pdfrender/reproducibility.go",
    "tooling/internal/pdfrender/reproducibility_receipt.go",
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

test("the PDF source digest changes with portal evidence authority", async (t) => {
  const temporaryRoot = await mkdtemp(path.join(os.tmpdir(), "20w-book-source-closure-"));
  t.after(() => rm(temporaryRoot, { recursive: true, force: true }));
  const sources = await bookSourceFiles(repositoryRoot);
  for (const source of sources) {
    const relative = path.relative(repositoryRoot, source);
    const destination = path.join(temporaryRoot, relative);
    await mkdir(path.dirname(destination), { recursive: true });
    await copyFile(source, destination);
  }

  const before = await bookSourceDigest(temporaryRoot);
  const claimsPath = path.join(temporaryRoot, "research", "claims.md");
  await writeFile(claimsPath, `${await readFile(claimsPath, "utf8")}\n`);
  const after = await bookSourceDigest(temporaryRoot);

  assert.notEqual(after.digest, before.digest);
  assert.deepEqual(after.files, before.files);
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
