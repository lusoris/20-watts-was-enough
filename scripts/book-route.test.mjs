import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

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
