import { createHash } from "node:crypto";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

export const bookPdfName = "20-watts-was-enough-full-concept-book.pdf";

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
  const supportFiles = [
    "README.md",
    "app/book/page.tsx",
    "app/components/book-edition.tsx",
    "app/components/markdown-document.tsx",
    "app/components/mermaid-diagram.tsx",
    "app/components/readiness-overview.tsx",
    "app/content.ts",
    "app/globals.css",
    "app/layout.tsx",
    "app/lib/readiness.ts",
    "experiments/test-readiness-summary.json",
    "package.json",
    "research/field-coverage.md",
    "scripts/book-source.mjs",
    "scripts/generate-book-pdf.mjs",
  ].map((file) => path.join(projectRoot, file));
  const plotFiles = await readdir(path.join(projectRoot, "public", "plots"), {
    withFileTypes: true,
  });
  return [...supportFiles, ...conceptFiles, ...plotFiles
    .filter((entry) => entry.isFile())
    .map((entry) => path.join(projectRoot, "public", "plots", entry.name))]
    .sort((left, right) => left.localeCompare(right));
}

export async function bookSourceDigest(projectRoot) {
  const files = await bookSourceFiles(projectRoot);
  const hash = createHash("sha256");
  for (const file of files) {
    const relative = path.relative(projectRoot, file).replaceAll("\\", "/");
    hash.update(relative);
    hash.update("\0");
    hash.update(await readFile(file));
    hash.update("\0");
  }
  return {
    digest: hash.digest("hex"),
    files: files.map((file) =>
      path.relative(projectRoot, file).replaceAll("\\", "/"),
    ),
  };
}
