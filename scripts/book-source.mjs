import { createHash } from "node:crypto";
import { readdir } from "node:fs/promises";
import path from "node:path";

import { readStableOpenedFile } from "./lib/opened-file.mjs";

export const bookPdfName = "20-watts-was-enough-full-concept-book.pdf";
const maximumBookSourceBytes = 256 * 1024 * 1024;

function relativeSourcePaths(projectRoot, files) {
  return files.map((file) => path.relative(projectRoot, file).replaceAll("\\", "/"));
}

async function markdownFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await markdownFiles(entryPath)));
    else if (entry.isFile() && entry.name.endsWith(".md")) files.push(entryPath);
  }
  return files;
}

export async function bookSourceFiles(projectRoot) {
  const conceptFiles = (await markdownFiles(path.join(projectRoot, "concept")))
    .filter((file) => path.basename(file) !== "README.md");
  const mathFiles = (await markdownFiles(path.join(projectRoot, "math")))
    .filter((file) => path.basename(file) !== "README.md");
  const supportFiles = [
    "LICENSE",
    "LICENSING.md",
    "LICENSES/CC-BY-SA-4.0.txt",
    "LICENSES/OFL-1.1.txt",
    "LICENSES/remark-math-MIT.txt",
    "CITATION.cff",
    "README.md",
    "THIRD_PARTY_NOTICES.txt",
    "app/book-content.ts",
    "app/components/book-edition.tsx",
    "app/components/language-access.tsx",
    "app/components/markdown-document.tsx",
    "app/components/mermaid-diagram.tsx",
    "app/components/readiness-overview.tsx",
    "app/globals.css",
    "app/lib/book-release-identity.mjs",
    "app/lib/book-document-id.mjs",
    "app/lib/eu-languages.mjs",
    "app/lib/language-access.mjs",
    "app/lib/publication.mjs",
    "app/lib/readiness.ts",
    "app/lib/repository-artifacts.ts",
    "app/project-metadata.ts",
    "app/research-document.ts",
    "experiments/test-readiness-summary.json",
    "github-pages/book.tsx",
    "github-pages/public-artifacts.json",
    "github-pages/book/index.html",
    "package-lock.json",
    "package.json",
    "public/og-v2.jpg",
    "research/field-coverage.md",
    "scripts/book-source.mjs",
    "scripts/generate-book-pdf.mjs",
    "scripts/install-locked-npm.mjs",
    "scripts/lib/atomic-file-pair.mjs",
    "scripts/lib/chromium-cdp.mjs",
    "scripts/lib/book-pdf-generation-options.mjs",
    "scripts/lib/book-pdf-integrity.mjs",
    "scripts/lib/book-renderer-identity.mjs",
    "scripts/lib/opened-file.mjs",
    "scripts/lib/pages-base.mjs",
    "scripts/lib/pages-seo.mjs",
    "scripts/lib/pdf-metadata.mjs",
    "scripts/lib/plain-text.mjs",
    "scripts/lib/portal-documents.mjs",
    "scripts/lib/portal-metrics.mjs",
    "scripts/lib/source-boundary.mjs",
    "scripts/lib/strict-json.mjs",
    "scripts/lib/third-party-notices.mjs",
    "scripts/lib/translation-manifest.mjs",
    "scripts/lib/translation-pages.mjs",
    "scripts/lib/vite-cache-directory.mjs",
    "scripts/npm-runtime-lock.json",
    "sources/taxonomies/2026-08-25/README.md",
    "tooling/cmd/20w/main.go",
    "tooling/cmd/20w/pdf_reproducibility.go",
    "tooling/cmd/20w/translation.go",
    "tooling/go.mod",
    "tooling/go.sum",
    "tooling/internal/buildinfo/buildinfo.go",
    "tooling/internal/docscheck/check.go",
    "tooling/internal/docscheck/mermaid-duplicate-baseline.json",
    "tooling/internal/docscheck/mermaid.go",
    "tooling/internal/experiment/catalog.go",
    "tooling/internal/githublabels/labels.go",
    "tooling/internal/nodeimage/package.go",
    "tooling/internal/ocimanifest/manifest.go",
    "tooling/internal/pdfrender/archive.go",
    "tooling/internal/pdfrender/command.go",
    "tooling/internal/pdfrender/dockerfile.go",
    "tooling/internal/pdfrender/lock.go",
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
    "translations/manifest.json",
    "translations/eu-languages.json",
    "vite.pages.config.ts",
  ].map((file) => path.join(projectRoot, file));
  const plotFiles = await readdir(path.join(projectRoot, "public", "plots"), {
    withFileTypes: true,
  });
  return [...supportFiles, ...conceptFiles, ...mathFiles, ...plotFiles
    .filter((entry) => entry.isFile())
    .map((entry) => path.join(projectRoot, "public", "plots", entry.name))]
    .sort((left, right) => left.localeCompare(right));
}

export async function bookSourceDigest(projectRoot) {
  const files = await bookSourceFiles(projectRoot);
  const relativeFiles = relativeSourcePaths(projectRoot, files);
  const hash = createHash("sha256");
  for (const [index, file] of files.entries()) {
    const relative = relativeFiles[index];
    hash.update(relative);
    hash.update("\0");
    hash.update(await readStableOpenedFile(file, {
      label: `book source ${relative}`,
      containedBy: projectRoot,
      maximumBytes: maximumBookSourceBytes,
    }));
    hash.update("\0");
  }
  const finalFiles = relativeSourcePaths(projectRoot, await bookSourceFiles(projectRoot));
  if (JSON.stringify(finalFiles) !== JSON.stringify(relativeFiles)) {
    throw new Error("Book source inventory changed while its digest was computed.");
  }
  return {
    digest: hash.digest("hex"),
    files: relativeFiles,
  };
}
