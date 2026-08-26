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
  assert.match(edition, /export function BookEdition\(\)/);
});
