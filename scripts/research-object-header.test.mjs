import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import {
  normalizeResearchObjectFragment,
  normalizePublicationSourceRevision,
  researchObjectIdentity,
} from "../app/lib/research-object.mjs";
import { portalSourceDocuments } from "./lib/portal-documents.mjs";
import { renderDocumentFallback } from "./lib/pages-seo.mjs";

const sourceRevision = "0123456789abcdef0123456789abcdef01234567";
const projectVersion = JSON.parse(await readFile("package.json", "utf8")).version;
const documents = portalSourceDocuments(process.cwd());
const document = documents[0];

test("research-object identity binds one exact source revision to every route", () => {
  const identity = researchObjectIdentity({
    title: document.title,
    path: document.path,
    route: document.route,
    group: document.group,
    editionVersion: projectVersion,
    sourceRevision,
    fragment: "scope-and-boundary",
  });

  assert.equal(identity.type, "Concept document");
  assert.equal(identity.sourceRevision, sourceRevision);
  assert.equal(
    identity.publicUrl,
    `https://www.cordana.dev/${document.route}`,
  );
  assert.equal(
    identity.sourceHref,
    `https://github.com/lusoris/20-watts-was-enough/blob/${sourceRevision}/${document.path}#scope-and-boundary`,
  );
  assert.equal(
    identity.historyHref,
    `https://github.com/lusoris/20-watts-was-enough/commits/${sourceRevision}/${document.path}`,
  );
  for (const href of [identity.citationHref, identity.disclosureHref, identity.licenceHref]) {
    assert.ok(href.includes(`/blob/${sourceRevision}/`));
  }
  assert.match(identity.citationHref, /\/CITATION\.cff$/u);
  assert.match(identity.disclosureHref, new RegExp(`/research/disclosures/v${projectVersion}\\.md$`, "u"));
  assert.match(identity.licenceHref, /\/LICENSING\.md$/u);

  const clarity = new URL(identity.clarityReportHref);
  const correction = new URL(identity.evidenceCorrectionHref);
  assert.equal(clarity.searchParams.get("template"), "site-documentation-problem.yml");
  assert.equal(correction.searchParams.get("template"), "evidence-correction.yml");
  for (const locator of [
    clarity.searchParams.get("location") ?? "",
    correction.searchParams.get("claims") ?? "",
  ]) {
    assert.match(locator, new RegExp(document.path.replace(".", "\\."), "u"));
    assert.match(locator, new RegExp(sourceRevision, "u"));
    assert.match(locator, /Current fragment: #scope-and-boundary/u);
    assert.match(
      locator,
      new RegExp(`Site v${projectVersion.replaceAll(".", "\\.")} · continuous main snapshot`, "u"),
    );
  }
});

test("untrusted fragments cannot corrupt or crash the generated locator", () => {
  assert.equal(normalizeResearchObjectFragment("#scope-and-boundary"), "scope-and-boundary");
  assert.equal(normalizeResearchObjectFragment(`scope-${"x".repeat(260)}`), "");
  assert.equal(normalizeResearchObjectFragment("scope\u0000boundary"), "");

  const identity = researchObjectIdentity({
    title: document.title,
    path: document.path,
    route: document.route,
    group: document.group,
    editionVersion: projectVersion,
    sourceRevision,
    fragment: "scope\u0000boundary",
  });
  assert.equal(identity.publicUrl, `https://www.cordana.dev/${document.route}`);
  assert.doesNotMatch(identity.sourceHref, /#/u);
  assert.doesNotMatch(
    new URL(identity.clarityReportHref).searchParams.get("location") ?? "",
    /Current fragment:/u,
  );
});

test("an unavailable revision stays absent instead of being inferred", () => {
  assert.equal(normalizePublicationSourceRevision(undefined), null);
  assert.equal(normalizePublicationSourceRevision(""), null);
  assert.throws(
    () => normalizePublicationSourceRevision("main"),
    /exact lowercase 40-character Git commit SHA/u,
  );
  assert.throws(
    () => normalizePublicationSourceRevision(sourceRevision.toUpperCase()),
    /exact lowercase 40-character Git commit SHA/u,
  );

  const identity = researchObjectIdentity({
    title: document.title,
    path: document.path,
    route: document.route,
    group: document.group,
    editionVersion: projectVersion,
  });
  assert.equal(identity.sourceRevision, null);
  assert.match(identity.sourceHref, /\/blob\/main\//u);
  assert.doesNotMatch(
    new URL(identity.clarityReportHref).searchParams.get("location") ?? "",
    /Source revision:/u,
  );
  assert.throws(
    () => researchObjectIdentity({
      title: document.title,
      path: document.path,
      route: "concept/wrong-route/",
      group: document.group,
      editionVersion: projectVersion,
    }),
    /does not match/u,
  );
  assert.throws(
    () => researchObjectIdentity({
      title: document.title,
      path: document.path,
      route: document.route,
      group: "Mathematics",
      editionVersion: projectVersion,
    }),
    /group .* does not match/u,
  );
});

test("the no-JavaScript document uses the generated research-object projection", () => {
  const fallback = renderDocumentFallback(document, documents, "/research/", {
    editionVersion: projectVersion,
    sourceRevision,
  });

  assert.equal([...fallback.matchAll(/<h1>/gu)].length, 1);
  assert.match(fallback, /data-research-object="focused-document"/u);
  assert.match(fallback, /aria-label="Research object identity"/u);
  assert.match(fallback, /aria-label="Research object records"/u);
  assert.match(fallback, /aria-label="Research object feedback"/u);
  assert.match(fallback, /template=site-documentation-problem\.yml/u);
  assert.match(fallback, /template=evidence-correction\.yml/u);
  assert.match(fallback, new RegExp(`/blob/${sourceRevision}/CITATION\\.cff`, "u"));
  assert.match(fallback, new RegExp(`/blob/${sourceRevision}/LICENSING\\.md`, "u"));
  assert.match(fallback, new RegExp(`/blob/${sourceRevision}/research/disclosures/v${projectVersion}\\.md`, "u"));
});

test("the interactive and static headers share the same identity generator", async () => {
  const [component, staticRenderer, viteConfig] = await Promise.all([
    readFile("app/components/research-object-header.tsx", "utf8"),
    readFile("scripts/lib/pages-seo.mjs", "utf8"),
    readFile("vite.pages.config.ts", "utf8"),
  ]);
  assert.match(component, /researchObjectIdentity\(\{/u);
  assert.match(staticRenderer, /researchObjectIdentity\(\{/u);
  assert.match(viteConfig, /normalizePublicationSourceRevision\(process\.env\.GITHUB_SHA\)/u);
  assert.match(viteConfig, /editionVersion: projectVersion/u);
  assert.doesNotMatch(viteConfig, /git rev-parse|SOURCE_DATE_EPOCH/u);
});
