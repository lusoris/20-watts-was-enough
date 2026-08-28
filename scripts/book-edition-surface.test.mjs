import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

async function source(relative) {
  return readFile(path.join(repositoryRoot, relative), "utf8");
}

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
});

test("portal utility text and card accents retain readable contrast", async () => {
  const stylesheet = await source("app/globals.css");
  const portalStart = stylesheet.indexOf("/* Public research portal");
  const portalEnd = stylesheet.indexOf("/* Research readiness", portalStart);
  assert.ok(portalStart >= 0 && portalEnd > portalStart);
  const portal = stylesheet.slice(portalStart, portalEnd);

  assert.doesNotMatch(portal, /font-size:\s*(?:8|9|10)px/);
  for (const contrastToken of [
    "--card-accent-text: #1459b8",
    "--card-accent-text: #a92d31",
    "--card-accent-text: #6240b8",
    "--card-accent-text: #805000",
    "--card-accent-text: #006971",
  ]) assert.ok(portal.includes(contrastToken), contrastToken);
  assert.match(portal, /\.portal-map-card:hover strong[\s\S]*color:\s*var\(--card-accent-on-dark\)/);
  assert.match(portal, /\.portal-document-state\s*\{[^}]*font-size:\s*14px/s);
  assert.match(portal, /\.portal-document-state\[role="alert"\]\s*\{[^}]*border-left-color:\s*#a92d31/s);
});
