import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { portalSeoDescriptor } from "../app/lib/portal-seo.ts";
import { publication } from "../app/lib/publication.mjs";
import {
  repositoryDocumentHref,
  repositoryTreeHref,
} from "../app/lib/book-release-identity.mjs";
import { portalSourceDocuments } from "./lib/portal-documents.mjs";
import { renderSeoHead } from "./lib/pages-seo.mjs";
import { decodeBasicHtmlEntitiesOnce } from "./lib/plain-text.mjs";
import { portalSourceMetrics } from "./lib/portal-metrics.mjs";

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function staticDescriptor(kind, document) {
  const head = renderSeoHead(kind, document, "/");
  const value = (pattern) => decodeBasicHtmlEntitiesOnce(head.match(pattern)?.[1] ?? "");
  return {
    canonical: value(/<link rel="canonical" href="([^"]+)" \/>/u),
    title: value(/<title>([^<]+)<\/title>/u),
    description: value(/<meta name="description" content="([^"]+)" \/>/u),
    ogType: value(/<meta property="og:type" content="([^"]+)" \/>/u),
    structuredData: JSON.parse(value(
      /<script type="application\/ld\+json">([^<]+)<\/script>/u,
    )),
  };
}

function templateDescriptor(html) {
  const value = (pattern) => decodeBasicHtmlEntitiesOnce(html.match(pattern)?.[1] ?? "");
  return {
    canonical: value(/<link rel="canonical" href="([^"]+)" \/>/u),
    title: value(/<title>([^<]+)<\/title>/u),
    description: value(/<meta name="description" content="([^"]+)" \/>/u),
  };
}

test("dynamic portal SEO stays equal to the generated static descriptor", () => {
  const document = portalSourceDocuments(repositoryRoot)[0];
  assert.deepEqual(portalSeoDescriptor(null), staticDescriptor("portal", null));
  assert.deepEqual(portalSeoDescriptor(document), staticDescriptor("document", document));
});

test("source HTML identity placeholders stay equal to the shared publication authority", async () => {
  for (const [kind, relative] of [
    ["portal", "github-pages/index.html"],
    ["book", "github-pages/book/index.html"],
    ["help", "github-pages/help/index.html"],
  ]) {
    const html = await readFile(path.join(repositoryRoot, relative), "utf8");
    const generated = staticDescriptor(kind, null);
    assert.deepEqual(templateDescriptor(html), {
      canonical: generated.canonical,
      title: generated.title,
      description: generated.description,
    }, relative);
  }
});

test("reader and book links consume the shared publication repository", () => {
  assert.equal(repositoryTreeHref("main"), `${publication.repository}/tree/main`);
  assert.equal(
    repositoryDocumentHref("main", "concept/00-thesis-and-principles.md"),
    `${publication.repository}/blob/main/concept/00-thesis-and-principles.md`,
  );
});

test("portal headline metrics are derived from their canonical registries", async () => {
  const [metrics, portal] = await Promise.all([
    portalSourceMetrics(repositoryRoot),
    readFile(path.join(repositoryRoot, "app", "components", "public-research-portal.tsx"), "utf8"),
  ]);
  assert.ok(metrics.provenanceFiles > 0);
  assert.ok(metrics.principles > 0);
  assert.match(portal, /portalMetrics\.provenanceFiles/u);
  assert.match(portal, /portalMetrics\.principles/u);
  assert.doesNotMatch(portal, /const (?:provenanceFileCount|principleCount) = \d+/u);
});

test("v0.3.0 publication surfaces describe admitted releases without stale prospective wording", async () => {
  const releaseSurfaces = [
    "CHANGELOG.md",
    "README.md",
    "docs/publication-workflow.md",
    "docs/how-to-help.md",
    "experiments/workstation/README.md",
    "experiments/workstation/fixture-007/README.md",
    "experiments/workstation/fixture-019/README.md",
    "experiments/workstation/manifests/fixture-007.json",
    "experiments/workstation/manifests/fixture-019.json",
  ];
  const staleProspectiveLanguage = /(?:first future tag|first qualifying tag|same qualifying tag|no current release contains|future release-image testing|after that release)/iu;
  const entries = await Promise.all(releaseSurfaces.map(async (relativePath) => [
    relativePath,
    await readFile(path.join(repositoryRoot, relativePath), "utf8"),
  ]));

  for (const [relativePath, content] of entries) {
    assert.doesNotMatch(content, staleProspectiveLanguage, relativePath);
  }
  const changelog = entries.find(([relativePath]) => relativePath === "CHANGELOG.md")?.[1] ?? "";
  assert.match(changelog, /## \[0\.3\.0\][\s\S]*The\s+v0\.3\.0 release publishes/u);
  assert.match(changelog, /## \[0\.3\.0\][\s\S]*The\s+passing v0\.3\.0 release publishes/u);
});
