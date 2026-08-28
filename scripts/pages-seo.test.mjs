import assert from "node:assert/strict";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { portalSourceDocuments } from "./lib/portal-documents.mjs";
import {
  canonicalSite,
  populateSeoTemplate,
  renderDocumentFallback,
  renderRobots,
  renderSeoHead,
  renderSitemap,
} from "./lib/pages-seo.mjs";

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const documents = portalSourceDocuments(repositoryRoot);

test("portal documents have unique descriptive routes and search metadata", () => {
  assert.equal(documents.length, 49);
  assert.equal(new Set(documents.map((document) => document.path)).size, documents.length);
  assert.equal(new Set(documents.map((document) => document.route)).size, documents.length);
  assert.equal(new Set(documents.map((document) => document.title)).size, documents.length);
  assert.equal(new Set(documents.map((document) => document.description)).size, documents.length);
  for (const document of documents) {
    assert.match(document.route, /^(?:concept|math)\/[a-z0-9-]+\/$/);
    assert.ok(document.description.length >= 45 && document.description.length <= 221);
  }
});

test("sitemap contains exactly the canonical public HTML routes", () => {
  const sitemap = renderSitemap(documents);
  const locations = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
  assert.deepEqual(locations, [
    canonicalSite,
    `${canonicalSite}book/`,
    ...documents.map((document) => `${canonicalSite}${document.route}`),
  ]);
  assert.doesNotMatch(sitemap, /<(?:priority|changefreq|lastmod)>/);
  assert.doesNotMatch(locations.join("\n"), /[?#]/);
});

test("robots allows rendering and identifies the canonical sitemap", () => {
  assert.equal(
    renderRobots(),
    "User-agent: *\nAllow: /\n\nSitemap: https://www.cordana.dev/sitemap.xml\n",
  );
  assert.doesNotMatch(renderRobots(), /Disallow:/);
});

test("document metadata and fallback are self-canonical, truthful, and subpath-safe", () => {
  const document = documents[0];
  const head = renderSeoHead("document", document, "/research/");
  const jsonLd = JSON.parse(head.match(/<script type="application\/ld\+json">([^<]+)<\/script>/)?.[1] ?? "");
  assert.equal(jsonLd["@type"], "TechArticle");
  assert.equal(jsonLd.url, `${canonicalSite}${document.route}`);
  assert.equal(jsonLd.headline, document.title);
  assert.equal(jsonLd.wordCount, document.words);
  assert.match(head, new RegExp(`rel="canonical" href="${canonicalSite}${document.route}"`));
  assert.match(head, /href="\/research\/favicon\.svg"/);
  assert.match(head, /name="robots" content="index,follow,max-image-preview:large"/);

  const fallback = renderDocumentFallback(document, documents, "/research/");
  assert.match(fallback, /<main class="seo-static-page">/);
  assert.match(fallback, /href="\/research\/concept\//);
  assert.match(fallback, /<article class="prose markdown-body">/);
  assert.doesNotMatch(fallback, /\?doc=|node="\[object Object\]"/);
});

test("SEO template population fails closed when a marker is absent", () => {
  const template = "<!-- pages-seo:head -->old<!-- /pages-seo:head --><div><!-- pages-seo:fallback -->old<!-- /pages-seo:fallback --></div>";
  assert.equal(
    populateSeoTemplate(template, "new-head", "new-body"),
    "<!-- pages-seo:head -->\n    new-head\n    <!-- /pages-seo:head --><div><!-- pages-seo:fallback -->new-body<!-- /pages-seo:fallback --></div>",
  );
  assert.throws(
    () => populateSeoTemplate("<!-- pages-seo:head --><!-- /pages-seo:head -->", "head", "body"),
    /missing an SEO generation marker/,
  );
});
