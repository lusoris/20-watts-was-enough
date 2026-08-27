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

test("the book route keeps the complete corpus out of the Worker render", () => {
  assert.match(page, /import \{ BookLoader \}/);
  assert.doesNotMatch(page, /from "\.\.\/content"/);
  assert.doesNotMatch(page, /BookEdition/);

  assert.match(loader, /lazy\(\(\) =>\s*import\("\.\/book-edition"\)/);
  assert.match(loader, /useSyncExternalStore/);
  assert.match(loader, /\(\) => false/);
  assert.match(loader, /<BookLoadBoundary>/);

  assert.match(edition, /import \{ bookDocuments as documents \}/);
  assert.match(edition, /import type \{ ResearchDocument \}/);
  assert.doesNotMatch(edition, /import \{ documents[^}]*\} from "\.\.\/content"/);
  assert.match(edition, /export function BookEdition\(/);
});

test("the private reader distinguishes JSON contracts and exposes linked source artifacts", () => {
  assert.match(content, /path\.startsWith\("assets\/plots\/"\)/);
  assert.match(content, /checked-in machine-readable JSON Schema/);
  assert.match(content, /checked-in machine-readable experiment contract or artifact/);
  assert.match(markdownDocument, /repositoryArtifactHref\(internal\.path\)/);
  assert.match(markdownDocument, /data-repository-artifact/);
});

test("the full-book source identity includes the locked renderer dependency graph", async () => {
  const sources = (await bookSourceFiles(repositoryRoot)).map((file) => (
    path.relative(repositoryRoot, file).replaceAll("\\", "/")
  ));
  assert.equal(sources.includes("package-lock.json"), true);
  assert.equal(sources.includes("scripts/lib/book-pdf-integrity.mjs"), true);
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
