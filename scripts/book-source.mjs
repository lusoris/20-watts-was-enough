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
    "app/book/page.tsx",
    "app/book-content.ts",
    "app/components/book-loader.tsx",
    "app/components/book-edition.tsx",
    "app/components/markdown-document.tsx",
    "app/components/mermaid-diagram.tsx",
    "app/components/readiness-overview.tsx",
    "app/content.ts",
    "app/globals.css",
    "app/layout.tsx",
    "app/lib/book-release-identity.mjs",
    "app/lib/readiness.ts",
    "app/lib/repository-artifacts.ts",
    "app/project-metadata.ts",
    "experiments/test-readiness-summary.json",
    "package-lock.json",
    "package.json",
    "research/field-coverage.md",
    "scripts/book-source.mjs",
    "scripts/generate-book-pdf.mjs",
    "scripts/lib/book-pdf-generation-options.mjs",
    "scripts/lib/book-pdf-integrity.mjs",
    "scripts/lib/opened-file.mjs",
    "scripts/lib/pages-base.mjs",
    "scripts/lib/pdf-metadata.mjs",
    "scripts/lib/third-party-notices.mjs",
    "sources/taxonomies/2026-08-25/README.md",
    "vite.config.ts",
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
