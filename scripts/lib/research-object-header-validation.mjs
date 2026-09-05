import { bookEditionIdentity, repositoryTreeHref } from "../../app/lib/book-release-identity.mjs";
import { publication } from "../../app/lib/publication.mjs";
import { researchObjectIdentity } from "../../app/lib/research-object.mjs";

function fail(message) {
  throw new Error(`Invalid research-object header: ${message}`);
}

function count(source, needle) {
  if (!needle) return 0;
  return source.split(needle).length - 1;
}

function requireOnce(source, needle, label) {
  const observed = count(source, needle);
  if (observed !== 1) fail(`${label} must occur exactly once; found ${observed}`);
}

function escapeAttribute(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#x27;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function decodedAttribute(value) {
  return value
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", '"')
    .replaceAll("&#x27;", "'")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">");
}

function feedbackUrl(header, label) {
  const escapedLabel = label.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&");
  const match = header.match(new RegExp(`<a href="([^"]+)">${escapedLabel}</a>`, "u"));
  if (!match) fail(`${label} route is absent`);
  return new URL(decodedAttribute(match[1]));
}

function requireLocator(url, parameter, identity) {
  const locator = url.searchParams.get(parameter);
  if (!locator) fail(`${parameter} locator is absent`);
  const expected = [
    `Canonical path: ${identity.sourcePath}`,
    `Public route: ${identity.publicUrl}`,
    `Edition: ${identity.edition}`,
    ...(identity.sourceRevision ? [`Source revision: ${identity.sourceRevision}`] : []),
  ].join("; ");
  if (/[\r\n]/u.test(locator)) fail(`${parameter} locator is not one line`);
  if (locator !== expected) {
    fail(`${parameter} locator differs from the exact research-object identity`);
  }
}

function requireExactLinkInventory(header, expectedHrefs) {
  const observed = [...header.matchAll(/<a\b[^>]*>/gu)].map((anchor) => {
    const hrefs = [...anchor[0].matchAll(/\shref="([^"]+)"/gu)];
    if (hrefs.length !== 1) {
      fail("each link must carry exactly one quoted href");
    }
    return decodedAttribute(hrefs[0][1]);
  }).sort();
  const expected = [...expectedHrefs].sort();
  if (JSON.stringify(observed) !== JSON.stringify(expected)) {
    fail("link inventory differs from the exact research-object identity");
  }
}

function requireExactIdentityFields(header, identity) {
  const expected = [
    "Edition",
    ...(identity.sourceRevision ? ["Source revision"] : []),
    "Extent",
    "Public route",
  ];
  const observed = [...header.matchAll(/<dt>([^<]+)<\/dt>/gu)]
    .map((match) => decodedAttribute(match[1]));
  if (JSON.stringify(observed) !== JSON.stringify(expected)) {
    fail("identity field inventory is stale or contains an unknown field");
  }
}

function requireExactEvidenceProjection(header, identity) {
  if (identity.evidenceRoutes.length === 0) {
    if (header.includes('class="research-object-evidence"')) {
      fail("mapped-record disclosure is present without maintained routes");
    }
    return;
  }
  requireOnce(
    header,
    `<summary><span>Mapped records</span><b>${escapeAttribute(identity.evidenceSummary)}</b></summary>`,
    "mapped-record summary",
  );
  requireOnce(
    header,
    `<p>${escapeAttribute(identity.evidenceCaveat)}</p>`,
    "mapped-record caveat",
  );
  for (const route of identity.evidenceRoutes) {
    const locator = `${route.sourcePath}${route.fragment ? `#${route.fragment}` : ""}`;
    requireOnce(
      header,
      `<a href="${escapeAttribute(route.href)}" aria-label="Mapped ${route.kind}: ${escapeAttribute(locator)}" title="${escapeAttribute(locator)}">${escapeAttribute(route.label)}</a>`,
      `exact mapped ${route.label}`,
    );
  }
}

function focusedHeader(html) {
  const marker = 'data-research-object="focused-document"';
  requireOnce(html, marker, "focused-document marker");
  const match = html.match(
    /<header class="research-object-header" data-research-object="focused-document">[\s\S]*?<\/header>/u,
  );
  if (!match) fail("focused-document header is malformed");
  return match[0];
}

/**
 * Validate the generated no-JavaScript projection against the same canonical
 * identity used by the hydrated component.
 */
export function assertStaticResearchObjectHeader(html, {
  document,
  editionVersion,
  sourceRevision = null,
  basePath = "/",
}) {
  const identity = researchObjectIdentity({
    title: document.title,
    path: document.path,
    route: document.route,
    group: document.group,
    editionVersion,
    sourceRevision,
    evidenceRecords: document.evidenceRecords,
    basePath,
  });
  const header = focusedHeader(html);

  requireOnce(
    header,
    `<p class="research-object-kicker">${escapeAttribute(identity.type)}</p>`,
    "exact object type",
  );
  requireOnce(header, `<h1>${escapeAttribute(identity.title)}</h1>`, "exact object title");
  requireOnce(
    header,
    `<p class="research-object-path"><code>${escapeAttribute(identity.sourcePath)}</code></p>`,
    "exact canonical source path",
  );
  requireOnce(header, 'aria-label="Research object identity"', "identity ledger");
  requireOnce(header, "<dt>Edition</dt>", "edition field");
  requireOnce(
    header,
    `<dt>Edition</dt><dd>${escapeAttribute(identity.edition)}</dd>`,
    "exact edition identity",
  );
  if (identity.sourceRevision) {
    requireOnce(header, "<dt>Source revision</dt>", "source-revision field");
    requireOnce(
      header,
      `<dt>Source revision</dt><dd><code>${identity.sourceRevision}</code></dd>`,
      "exact source revision",
    );
  } else if (header.includes("<dt>Source revision</dt>")) {
    fail("source revision is present without supplied authority");
  }
  requireOnce(
    header,
    `<dt>Extent</dt><dd>${document.words.toLocaleString(publication.locale)} words</dd>`,
    "exact extent",
  );
  requireOnce(
    header,
    `<dt>Public route</dt><dd><a href="${escapeAttribute(identity.publicUrl)}">${escapeAttribute(identity.publicUrl)}</a></dd>`,
    "exact public route",
  );
  requireExactIdentityFields(header, identity);

  for (const [label, href] of [
    ["source route", identity.sourceHref],
    ["history route", identity.historyHref],
    ["book route", identity.bookHref],
    ["PDF route", identity.pdfHref],
    ["citation route", identity.citationHref],
    ["licence route", identity.licenceHref],
    ...identity.evidenceRoutes.map((route) => [`mapped ${route.label}`, route.href]),
  ]) {
    requireOnce(header, `href="${escapeAttribute(href)}"`, label);
  }
  requireExactEvidenceProjection(header, identity);
  if (identity.disclosureHref) {
    requireOnce(header, `href="${escapeAttribute(identity.disclosureHref)}"`, "disclosure route");
  } else if (header.includes(">Disclosure</a>")) {
    fail("unavailable disclosure route is present");
  }

  const clarity = feedbackUrl(header, "Report clarity");
  const evidence = feedbackUrl(header, "Correct evidence");
  if (clarity.searchParams.get("template") !== "site-documentation-problem.yml") {
    fail("clarity route uses the wrong issue template");
  }
  if (evidence.searchParams.get("template") !== "evidence-correction.yml") {
    fail("evidence route uses the wrong issue template");
  }
  requireLocator(clarity, "location", identity);
  requireLocator(evidence, "claims", identity);
  requireExactLinkInventory(header, [
    identity.publicUrl,
    ...identity.evidenceRoutes.map((route) => route.href),
    identity.sourceHref,
    identity.historyHref,
    identity.bookHref,
    identity.pdfHref,
    identity.citationHref,
    identity.licenceHref,
    ...(identity.disclosureHref ? [identity.disclosureHref] : []),
    identity.clarityReportHref,
    identity.evidenceCorrectionHref,
  ]);
  return identity;
}

export function assertStaticBookIdentity(html, {
  editionVersion,
  sourceRevision = null,
  basePath = "/",
}) {
  const identity = bookEditionIdentity({
    surface: "github-pages",
    sourceRef: "main",
    editionVersion,
    sourceRevision,
  });
  requireOnce(html, 'aria-label="Book edition identity"', "book identity ledger");
  requireOnce(html, "<dt>Edition</dt>", "book edition field");
  requireOnce(
    html,
    `<dt>Edition</dt><dd>${escapeAttribute(identity.edition)}</dd>`,
    "exact book edition identity",
  );
  if (identity.sourceRevision) {
    requireOnce(html, "<dt>Source revision</dt>", "book source-revision field");
    requireOnce(
      html,
      `<dt>Source revision</dt><dd><code>${identity.sourceRevision}</code></dd>`,
      "exact book source revision",
    );
  } else if (html.includes("<dt>Source revision</dt>")) {
    fail("book invents a source revision");
  }
  requireOnce(html, "<dt>Source</dt>", "book source field");
  requireOnce(
    html,
    `<dt>Source</dt><dd><a href="${escapeAttribute(repositoryTreeHref(identity.repositoryLinkRef))}">${escapeAttribute(identity.sourceLabel)}</a></dd>`,
    "exact book source identity",
  );
  for (const [label, href] of [
    ["book route", `${basePath}${publication.bookPath}`],
    ["book PDF route", `${basePath}${publication.bookPdfPath}`],
  ]) {
    requireOnce(html, `href="${escapeAttribute(href)}"`, label);
  }
  const report = feedbackUrl(html, "Report a book problem");
  if (report.searchParams.get("template") !== "site-documentation-problem.yml") {
    fail("book report route uses the wrong issue template");
  }
  const locator = report.searchParams.get("location") ?? "";
  const expectedLocator = [
    `Public route: ${new URL(publication.bookPath, publication.canonicalSite).toString()}`,
    `Edition: ${identity.edition}`,
    ...(identity.sourceRevision ? [`Source revision: ${identity.sourceRevision}`] : []),
  ].join("; ");
  if (/[\r\n]/u.test(locator)) fail("book locator is not one line");
  if (locator !== expectedLocator) {
    fail("book locator differs from the exact book identity");
  }
  return identity;
}
