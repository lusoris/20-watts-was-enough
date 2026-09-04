import assert from "node:assert/strict";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";

import {
  normalizeResearchObjectFragment,
  normalizeResearchObjectEvidenceRecords,
  normalizePublicationSourceRevision,
  researchObjectIdentity,
} from "../app/lib/research-object.mjs";
import {
  issueFormLocator,
  maximumIssueFormLocatorLength,
} from "../app/lib/publication.mjs";
import { publicationSourceRevisionQuery } from "../app/lib/publication-revision.mjs";
import { portalSourceDocuments } from "./lib/portal-documents.mjs";
import {
  attachResearchObjectEvidence,
  researchObjectEvidenceByDocument,
} from "./lib/research-object-evidence.mjs";
import { renderBookFallback, renderDocumentFallback } from "./lib/pages-seo.mjs";
import {
  assertStaticBookIdentity,
  assertStaticResearchObjectHeader,
} from "./lib/research-object-header-validation.mjs";

const sourceRevision = "0123456789abcdef0123456789abcdef01234567";
const projectVersion = JSON.parse(await readFile("package.json", "utf8")).version;
const documents = attachResearchObjectEvidence(
  process.cwd(),
  portalSourceDocuments(process.cwd()),
);
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
    evidenceRecords: document.evidenceRecords,
    basePath: "/research/",
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
  for (const href of [identity.citationHref, identity.licenceHref]) {
    assert.ok(href.includes(`/blob/${sourceRevision}/`));
  }
  assert.match(identity.citationHref, /\/CITATION\.cff$/u);
  assert.equal(identity.disclosureHref, null);
  assert.match(identity.licenceHref, /\/LICENSING\.md$/u);
  assert.equal(identity.bookHref, "/research/book/");
  assert.equal(
    identity.pdfHref,
    "/research/downloads/20-watts-was-enough-full-concept-book.pdf",
  );
  assert.ok(identity.evidenceRoutes.length > 0);
  assert.ok(identity.evidenceRoutes.every((route) => route.href.includes(`/blob/${sourceRevision}/`)));

  const clarity = new URL(identity.clarityReportHref);
  const correction = new URL(identity.evidenceCorrectionHref);
  assert.equal(clarity.searchParams.get("template"), "site-documentation-problem.yml");
  assert.equal(correction.searchParams.get("template"), "evidence-correction.yml");
  const expectedLocator = [
    `Canonical path: ${document.path}`,
    `Public route: https://www.cordana.dev/${document.route}`,
    `Edition: Site v${projectVersion} · continuous main snapshot`,
    `Source revision: ${sourceRevision}`,
    "Current fragment: #scope-and-boundary",
  ].join("; ");
  for (const locator of [
    clarity.searchParams.get("location") ?? "",
    correction.searchParams.get("claims") ?? "",
  ]) {
    assert.equal(locator, expectedLocator);
    assert.doesNotMatch(locator, /[\r\n]/u);
  }
  assert.ok(
    identity.clarityReportHref.includes(
      new URLSearchParams({ location: expectedLocator }).toString(),
    ),
  );
});

test("issue-form locators are one bounded line and fail instead of truncating", () => {
  assert.equal(
    issueFormLocator(["Canonical path: concept/example.md", "Edition: Site v0.2.0"]),
    "Canonical path: concept/example.md; Edition: Site v0.2.0",
  );
  for (const hostile of [
    "Canonical path: concept/a.md\rInjected: yes",
    "A: one\nB: two",
    "A: one\u2028B: two",
    "Fragment: \ud800",
  ]) {
    assert.throws(
      () => issueFormLocator([hostile]),
      /URI-safe single-line text without control characters/u,
    );
  }

  const atBound = `Field: ${"x".repeat(maximumIssueFormLocatorLength - "Field: ".length)}`;
  assert.equal(atBound.length, maximumIssueFormLocatorLength);
  assert.equal(issueFormLocator([atBound]), atBound);
  assert.ok(issueFormLocator([atBound]).endsWith("x"));
  assert.throws(
    () => issueFormLocator([`${atBound}x`]),
    new RegExp(`exceeds the ${maximumIssueFormLocatorLength}-character field bound`, "u"),
  );
});

test("issue-form query encoding round-trips reserved fragment characters exactly", () => {
  const fragment = "scope & 50% + evidence";
  const identity = researchObjectIdentity({
    title: document.title,
    path: document.path,
    route: document.route,
    group: document.group,
    editionVersion: projectVersion,
    sourceRevision,
    fragment,
  });
  const clarity = new URL(identity.clarityReportHref);
  const locator = clarity.searchParams.get("location") ?? "";

  assert.ok(locator.endsWith(`Current fragment: #${fragment}`));
  assert.doesNotMatch(locator, /[\r\n]/u);
  assert.match(
    clarity.search,
    /Current\+fragment%3A\+%23scope\+%26\+50%25\+%2B\+evidence/u,
  );
  assert.equal(clarity.searchParams.get("50% + evidence"), null);
});

test("claim Used by backlinks preserve exact maintained mappings without inference", () => {
  const launchpad = documents.find(
    (candidate) => candidate.path === "concept/05-biology-is-a-launchpad.md",
  );
  assert.ok(launchpad);
  const c018 = launchpad.evidenceRecords.find((record) => record.label === "C-018");
  assert.deepEqual(c018, {
    kind: "claim",
    label: "C-018",
    sourcePath: "research/claims.md",
    fragment: "c-018",
  });
  assert.doesNotMatch(launchpad.body, /C-018/u);

  assert.throws(
    () => researchObjectIdentity({
      title: launchpad.title,
      path: launchpad.path,
      route: launchpad.route,
      group: launchpad.group,
      editionVersion: projectVersion,
      sourceRevision,
      evidenceRecords: [c018, c018],
    }),
    /evidence route is duplicated/u,
  );
});

test("evidence projection rejects a route whose exact target no longer exists", async () => {
  const repositoryRoot = await mkdtemp(path.join(tmpdir(), "20w-object-evidence-"));
  try {
    await mkdir(path.join(repositoryRoot, "research", "audits"), { recursive: true });
    await writeFile(
      path.join(repositoryRoot, "research", "claims.md"),
      "### C-001\n\n- **Used by:** none\n",
    );
    await writeFile(
      path.join(repositoryRoot, "research", "audits", "exact-audit.md"),
      "# Existing section\n",
    );
    const projectedDocument = {
      path: "concept/projected.md",
      body: "[audit](../research/audits/exact-audit.md#missing-section)\n",
    };
    assert.throws(
      () => researchObjectEvidenceByDocument(repositoryRoot, [projectedDocument]),
      /has no exact target: research\/audits\/exact-audit\.md#missing-section/u,
    );
  } finally {
    await rm(repositoryRoot, { recursive: true, force: true });
  }
});

test("evidence projection does not infer records from identifiers, filenames, or status words", async () => {
  const repositoryRoot = await mkdtemp(path.join(tmpdir(), "20w-object-no-inference-"));
  try {
    await mkdir(path.join(repositoryRoot, "research"), { recursive: true });
    await writeFile(
      path.join(repositoryRoot, "research", "claims.md"),
      "### C-001\n\n- **Status:** established\n- **Used by:** none\n",
    );
    const projectedDocument = {
      path: "concept/projected.md",
      body: "C-001 is established. See `research/claims.md` and P-001.\n",
    };
    assert.deepEqual(
      researchObjectEvidenceByDocument(repositoryRoot, [projectedDocument]).get(
        projectedDocument.path,
      ),
      [],
    );
  } finally {
    await rm(repositoryRoot, { recursive: true, force: true });
  }
});

test("evidence projection bounds hostile Markdown AST traversal", async () => {
  const repositoryRoot = await mkdtemp(path.join(tmpdir(), "20w-object-ast-bound-"));
  try {
    await mkdir(path.join(repositoryRoot, "research"), { recursive: true });
    await writeFile(
      path.join(repositoryRoot, "research", "claims.md"),
      "### C-001\n\n- **Used by:** none\n",
    );
    const projectedDocument = {
      path: "concept/projected.md",
      body: `${"> ".repeat(130)}nested\n`,
    };
    assert.throws(
      () => researchObjectEvidenceByDocument(repositoryRoot, [projectedDocument]),
      /concept\/projected\.md exceeds the maximum depth of 128/u,
    );

    projectedDocument.body = `${"[route](../research/claims.md#c-001) ".repeat(65_536)}\n`;
    assert.throws(
      () => researchObjectEvidenceByDocument(repositoryRoot, [projectedDocument]),
      /concept\/projected\.md exceeds the maximum of 131072 nodes/u,
    );
  } finally {
    await rm(repositoryRoot, { recursive: true, force: true });
  }
});

test("fetched evidence records reject unknown, missing, and hostile fields", () => {
  const exact = {
    kind: "claim",
    label: "C-018",
    sourcePath: "research/claims.md",
    fragment: "c-018",
  };
  assert.deepEqual(normalizeResearchObjectEvidenceRecords([exact]), [exact]);
  for (const record of [
    { ...exact, status: "established" },
    { kind: exact.kind, label: exact.label, sourcePath: exact.sourcePath },
    { ...exact, fragment: null },
    { ...exact, label: " C-018" },
    { ...exact, label: "C-018\ud800" },
    {
      kind: "audit",
      label: "Audit",
      sourcePath: `research/audits/${"a".repeat(513)}.md`,
      fragment: "",
    },
  ]) {
    assert.throws(
      () => normalizeResearchObjectEvidenceRecords([record]),
      /Research-object (?:evidence|audit)/u,
    );
  }
});

test("untrusted fragments cannot corrupt or crash the generated locator", () => {
  assert.equal(normalizeResearchObjectFragment("#scope-and-boundary"), "scope-and-boundary");
  assert.equal(normalizeResearchObjectFragment(`scope-${"x".repeat(260)}`), "");
  assert.equal(normalizeResearchObjectFragment("scope\u0000boundary"), "");
  assert.equal(normalizeResearchObjectFragment("scope-\ud800"), "");
  assert.equal(normalizeResearchObjectFragment("scope\u2028boundary"), "");
  assert.equal(normalizeResearchObjectFragment("scope "), "");

  for (const hostileFragment of [
    "scope\u0000boundary",
    "scope-\ud800",
    "scope\u2028boundary",
    "scope ",
  ]) {
    const identity = researchObjectIdentity({
      title: document.title,
      path: document.path,
      route: document.route,
      group: document.group,
      editionVersion: projectVersion,
      sourceRevision,
      fragment: hostileFragment,
    });
    assert.equal(identity.publicUrl, `https://www.cordana.dev/${document.route}`);
    assert.doesNotMatch(identity.sourceHref, /#/u);
    assert.doesNotMatch(
      new URL(identity.clarityReportHref).searchParams.get("location") ?? "",
      /Current fragment:/u,
    );
  }
});

test("research-object publication paths reject traversal and ambiguous segments", () => {
  for (const basePath of ["/../", "/./", "//", "/research//", "research/"]) {
    assert.throws(
      () => researchObjectIdentity({
        title: document.title,
        path: document.path,
        route: document.route,
        group: document.group,
        editionVersion: projectVersion,
        sourceRevision,
        basePath,
      }),
      /base path is not canonical/u,
    );
  }
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

test("publication asset cache keys use only a validated exact source revision", () => {
  assert.equal(publicationSourceRevisionQuery(sourceRevision), `?revision=${sourceRevision}`);
  assert.equal(publicationSourceRevisionQuery(null), "");
  assert.throws(
    () => publicationSourceRevisionQuery(`${sourceRevision}/../stale`),
    /exact lowercase 40-character Git commit SHA/u,
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
  assert.doesNotMatch(fallback, /research\/disclosures\//u);
  assert.match(fallback, /href="\/research\/book\/">Book<\/a>/u);
  assert.match(
    fallback,
    /href="\/research\/downloads\/20-watts-was-enough-full-concept-book\.pdf">PDF<\/a>/u,
  );
  for (const record of document.evidenceRecords) {
    const locator = `${record.sourcePath}${record.fragment ? `#${record.fragment}` : ""}`;
    assert.ok(fallback.includes(`title="${locator}"`));
    assert.ok(fallback.includes(`aria-label="Mapped ${record.kind}: ${locator}"`));
  }
});

test("the no-JavaScript research header owns visible color and focus tokens", async () => {
  const stylesheet = await readFile("app/globals.css", "utf8");
  const headerRuleStart = stylesheet.indexOf("  .research-object-header {");
  const headerRuleEnd = stylesheet.indexOf("\n  }", headerRuleStart);
  assert.ok(headerRuleStart >= 0 && headerRuleEnd > headerRuleStart);
  const headerRule = stylesheet.slice(headerRuleStart, headerRuleEnd);

  assert.match(headerRule, /--research-object-kicker-color: #00663c;/u);
  assert.match(headerRule, /--research-object-link-color: #17633f;/u);
  assert.match(headerRule, /--research-object-focus-color: #2f7df4;/u);
  assert.match(
    stylesheet,
    /\.research-object-header a:focus-visible,\s*\.research-object-header summary:focus-visible \{\s*outline: 3px solid var\(--research-object-focus-color\);\s*outline-offset: 3px;/u,
  );
  assert.match(
    stylesheet,
    /\.research-object-header a \{\s*color: var\(--research-object-link-color\);/u,
  );
});

test("static identity validation rejects stale, duplicate, and locator-loss mutations", () => {
  const options = {
    document,
    editionVersion: projectVersion,
    sourceRevision,
    basePath: "/research/",
  };
  const fallback = renderDocumentFallback(document, documents, "/research/", {
    editionVersion: projectVersion,
    sourceRevision,
  });
  assertStaticResearchObjectHeader(fallback, options);

  assert.throws(
    () => assertStaticResearchObjectHeader(
      fallback.replaceAll(sourceRevision, "f".repeat(40)),
      options,
    ),
    /exact source revision/u,
  );
  assert.throws(
    () => assertStaticResearchObjectHeader(
      fallback.replace("<dt>Edition</dt>", "<dt>Edition</dt><dt>Edition</dt>"),
      options,
    ),
    /edition field must occur exactly once/u,
  );
  assert.throws(
    () => assertStaticResearchObjectHeader(
      fallback.replace(
        `<p class="research-object-path"><code>${document.path}</code></p>`,
        `<p class="research-object-path"><code>${document.path}</code></p><p class="research-object-path"><code>${document.path}</code></p>`,
      ),
      options,
    ),
    /exact canonical source path must occur exactly once/u,
  );
  assert.throws(
    () => assertStaticResearchObjectHeader(
      fallback.replace(
        `Source+revision%3A+${sourceRevision}`,
        "Source+revision%3A+lost",
      ),
      options,
    ),
    /location locator differs from the exact research-object identity/u,
  );
  assert.throws(
    () => assertStaticResearchObjectHeader(
      fallback.replace(
        `Source+revision%3A+${sourceRevision}`,
        `Source+revision%3A+${sourceRevision}%0AInjected%3A+yes`,
      ),
      options,
    ),
    /location locator is not one line/u,
  );

  const book = renderBookFallback([document], "/research/", {
    editionVersion: projectVersion,
    sourceRevision,
  });
  assertStaticBookIdentity(book, {
    editionVersion: projectVersion,
    sourceRevision,
    basePath: "/research/",
  });
  assert.throws(
    () => assertStaticBookIdentity(
      book.replace("<dt>Edition</dt>", "<dt>Edition</dt><dt>Edition</dt>"),
      { editionVersion: projectVersion, sourceRevision, basePath: "/research/" },
    ),
    /book edition field must occur exactly once/u,
  );
  assert.throws(
    () => assertStaticBookIdentity(
      book.replace(
        "<dt>Source revision</dt>",
        "<dt>Source revision</dt><dt>Source revision</dt>",
      ),
      { editionVersion: projectVersion, sourceRevision, basePath: "/research/" },
    ),
    /book source-revision field must occur exactly once/u,
  );
  assert.throws(
    () => assertStaticBookIdentity(
      book.replace(
        `Source+revision%3A+${sourceRevision}`,
        `Source+revision%3A+${sourceRevision}%0DInjected%3A+yes`,
      ),
      { editionVersion: projectVersion, sourceRevision, basePath: "/research/" },
    ),
    /book locator is not one line/u,
  );
  assert.throws(
    () => assertStaticBookIdentity(
      book.replace(
        `Source+revision%3A+${sourceRevision}`,
        `Source+revision%3A+${sourceRevision.slice(0, -1)}`,
      ),
      { editionVersion: projectVersion, sourceRevision, basePath: "/research/" },
    ),
    /book locator differs from the exact book identity/u,
  );
  assert.throws(
    () => assertStaticBookIdentity(
      book
        .replace(
          `Site v${projectVersion} · continuous main snapshot`,
          `Release v${projectVersion} · immutable snapshot`,
        )
        .replaceAll(sourceRevision, "f".repeat(40)),
      { editionVersion: projectVersion, sourceRevision, basePath: "/research/" },
    ),
    /exact book edition identity/u,
  );
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
