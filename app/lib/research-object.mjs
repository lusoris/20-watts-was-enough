import {
  continuousSiteEdition,
  issueFormLocator,
  publication,
  repositoryIssueUrl,
} from "./publication.mjs";
import { normalizePublicationSourceRevision } from "./publication-revision.mjs";

const semanticVersionPattern = /^(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)$/u;
const publicBasePathSegmentPattern = /^[A-Za-z0-9._~-]+$/u;
const maximumEvidenceRecords = 512;
const evidenceRecordFields = Object.freeze(["fragment", "kind", "label", "sourcePath"]);
const documentTypes = Object.freeze({
  Concept: "Concept document",
  Mathematics: "Mathematical note",
});
const evidenceKinds = new Set(["claim", "principle", "audit", "experiment"]);

export { normalizePublicationSourceRevision } from "./publication-revision.mjs";

function encodedRepositoryPath(value) {
  return value.split("/").map(encodeURIComponent).join("/");
}

function hasControlCharacters(value) {
  return [...value].some((character) => {
    const codePoint = character.codePointAt(0) ?? 0;
    return codePoint < 32
      || (codePoint >= 127 && codePoint <= 159)
      || codePoint === 0x2028
      || codePoint === 0x2029;
  });
}

function assertDocumentPath(value) {
  if (
    typeof value !== "string"
    || !/^(?:concept|math)\/[a-z0-9]+(?:-[a-z0-9]+)*\.md$/u.test(value)
  ) {
    throw new Error(`Research-object source path is not canonical: ${JSON.stringify(value)}`);
  }
  return value;
}

function assertDocumentRoute(value) {
  if (
    typeof value !== "string"
    || !/^(?:concept|math)\/[a-z0-9]+(?:-[a-z0-9]+)*\/$/u.test(value)
  ) {
    throw new Error(`Research-object public route is not canonical: ${JSON.stringify(value)}`);
  }
  return value;
}

function assertPublicBasePath(value) {
  const segments = typeof value === "string" && value !== "/"
    ? value.slice(1, -1).split("/")
    : [];
  if (
    typeof value !== "string"
    || !value.startsWith("/")
    || !value.endsWith("/")
    || segments.some((segment) => (
      segment === ""
      || segment === "."
      || segment === ".."
      || !publicBasePathSegmentPattern.test(segment)
    ))
  ) {
    throw new Error(`Research-object base path is not canonical: ${JSON.stringify(value)}`);
  }
  return value;
}

function publicArtifactHref(basePath, relativePath) {
  return `${basePath}${relativePath}`;
}

/** @param {unknown} value */
export function normalizeResearchObjectFragment(value) {
  const hasControl = typeof value === "string" && hasControlCharacters(value);
  let uriSafe = true;
  if (typeof value === "string") {
    try {
      encodeURIComponent(value);
    } catch {
      uriSafe = false;
    }
  }
  if (typeof value !== "string" || value.length > 256 || hasControl || !uriSafe) {
    return "";
  }
  const fragment = value.replace(/^#+/u, "");
  return fragment.trim() === fragment ? fragment : "";
}

function repositoryDocumentHref(ref, path, fragment = "") {
  const hash = fragment ? `#${encodeURIComponent(fragment)}` : "";
  return `${publication.repository}/blob/${encodeURIComponent(ref)}/${encodedRepositoryPath(path)}${hash}`;
}

function repositoryHistoryHref(ref, path) {
  return `${publication.repository}/commits/${encodeURIComponent(ref)}/${encodedRepositoryPath(path)}`;
}

function assertEvidenceSourcePath(kind, value) {
  if (typeof value !== "string") {
    throw new Error(`Research-object ${kind} path is not canonical: ${JSON.stringify(value)}`);
  }
  let valid = /^experiments\/(?:candidates|fixtures)\/[a-z0-9]+(?:-[a-z0-9]+)*\.md$/u.test(value);
  if (kind === "claim") valid = value === "research/claims.md";
  else if (kind === "principle") valid = value === "research/principle-registry.md";
  else if (kind === "audit") {
    valid = /^research\/audits\/[a-z0-9]+(?:-[a-z0-9]+)*\.md$/u.test(value);
  }
  if (!valid || value.length > 512) {
    throw new Error(`Research-object ${kind} path is not canonical: ${JSON.stringify(value)}`);
  }
  return value;
}

/** @param {unknown} value */
export function normalizeResearchObjectEvidenceRecords(value) {
  if (value === undefined || value === null) return Object.freeze([]);
  if (!Array.isArray(value) || value.length > maximumEvidenceRecords) {
    throw new Error(`Research-object evidence records must be an array of at most ${maximumEvidenceRecords} entries.`);
  }
  const keys = new Set();
  const records = value.map((record) => {
    if (
      !record
      || typeof record !== "object"
      || Array.isArray(record)
      || JSON.stringify(Object.keys(record).sort()) !== JSON.stringify(evidenceRecordFields)
      || !evidenceKinds.has(record.kind)
    ) {
      throw new Error("Research-object evidence record has an unsupported kind.");
    }
    let labelIsWellFormed = true;
    try {
      encodeURIComponent(record.label);
    } catch {
      labelIsWellFormed = false;
    }
    if (
      typeof record.label !== "string"
      || record.label.trim() === ""
      || record.label.trim() !== record.label
      || record.label.length > 120
      || hasControlCharacters(record.label)
      || !labelIsWellFormed
    ) {
      throw new Error("Research-object evidence label must be a bounded non-empty string.");
    }
    const sourcePath = assertEvidenceSourcePath(record.kind, record.sourcePath);
    if (typeof record.fragment !== "string") {
      throw new Error("Research-object evidence fragment is not canonical.");
    }
    const fragment = normalizeResearchObjectFragment(record.fragment);
    if (fragment !== record.fragment) {
      throw new Error("Research-object evidence fragment is not canonical.");
    }
    if (record.kind === "claim" && !/^c-\d+$/u.test(fragment)) {
      throw new Error("Research-object claim route must name one exact C- identifier.");
    }
    if (record.kind === "principle" && !/^p-\d+(?:--[a-z0-9-]+)?$/u.test(fragment)) {
      throw new Error("Research-object principle route must name one exact P- identifier.");
    }
    const key = `${record.kind}\0${sourcePath}\0${fragment}`;
    if (keys.has(key)) throw new Error(`Research-object evidence route is duplicated: ${sourcePath}#${fragment}`);
    keys.add(key);
    return Object.freeze({
      kind: record.kind,
      label: record.label,
      sourcePath,
      fragment,
    });
  });
  return Object.freeze(records);
}

function normalizeEvidenceRecords(value, repositoryRef) {
  return Object.freeze(normalizeResearchObjectEvidenceRecords(value).map((record) => Object.freeze({
    ...record,
    href: repositoryDocumentHref(repositoryRef, record.sourcePath, record.fragment),
  })));
}

function normalizeDisclosurePath(value) {
  if (value === undefined || value === null || value === "") return null;
  if (
    typeof value !== "string"
    || !/^research\/disclosures\/[a-z0-9]+(?:[.-][a-z0-9]+)*\.md$/u.test(value)
  ) {
    throw new Error(`Research-object disclosure path is not canonical: ${JSON.stringify(value)}`);
  }
  return value;
}

/**
 * @param {{
 *   title: string,
 *   path: string,
 *   route: string,
 *   group: keyof typeof documentTypes,
 *   editionVersion: string,
 *   sourceRevision?: string | null,
 *   fragment?: string,
 *   basePath?: string,
 *   disclosurePath?: string | null,
 *   evidenceRecords?: Array<{
 *     kind: "claim" | "principle" | "audit" | "experiment",
 *     label: string,
 *     sourcePath: string,
 *     fragment: string,
 *   }>,
 * }} input
 */
export function researchObjectIdentity(input) {
  if (typeof input.title !== "string" || input.title.trim() === "" || input.title.length > 240) {
    throw new Error("Research-object title must be a bounded non-empty string.");
  }
  if (!semanticVersionPattern.test(input.editionVersion)) {
    throw new Error("Research-object edition must be a semantic version.");
  }
  const type = documentTypes[input.group];
  if (!type) throw new Error(`Research-object group is not supported: ${JSON.stringify(input.group)}`);

  const sourcePath = assertDocumentPath(input.path);
  const route = assertDocumentRoute(input.route);
  const expectedRoute = sourcePath.replace(/\.md$/u, "/");
  if (route !== expectedRoute) {
    throw new Error(`Research-object route ${JSON.stringify(route)} does not match ${JSON.stringify(sourcePath)}.`);
  }
  const expectedGroup = sourcePath.startsWith("math/") ? "Mathematics" : "Concept";
  if (input.group !== expectedGroup) {
    throw new Error(`Research-object group ${JSON.stringify(input.group)} does not match ${JSON.stringify(sourcePath)}.`);
  }
  const sourceRevision = normalizePublicationSourceRevision(input.sourceRevision);
  const fragment = normalizeResearchObjectFragment(input.fragment ?? "");
  const basePath = assertPublicBasePath(input.basePath ?? "/");
  const repositoryRef = sourceRevision ?? "main";
  const evidenceRoutes = normalizeEvidenceRecords(input.evidenceRecords, repositoryRef);
  const disclosurePath = normalizeDisclosurePath(input.disclosurePath);
  const publicUrl = new URL(route, publication.canonicalSite);
  const edition = continuousSiteEdition(input.editionVersion);
  const locator = issueFormLocator([
    `Canonical path: ${sourcePath}`,
    `Public route: ${publicUrl.toString()}`,
    `Edition: ${edition}`,
    ...(sourceRevision ? [`Source revision: ${sourceRevision}`] : []),
    ...(fragment ? [`Current fragment: #${fragment}`] : []),
  ]);

  return Object.freeze({
    type,
    title: input.title,
    sourcePath,
    publicUrl: publicUrl.toString(),
    edition,
    sourceRevision,
    sourceHref: repositoryDocumentHref(repositoryRef, sourcePath, fragment),
    historyHref: repositoryHistoryHref(repositoryRef, sourcePath),
    bookHref: publicArtifactHref(basePath, publication.bookPath),
    pdfHref: publicArtifactHref(basePath, publication.bookPdfPath),
    citationHref: repositoryDocumentHref(repositoryRef, publication.citationPath),
    disclosureHref: disclosurePath
      ? repositoryDocumentHref(repositoryRef, disclosurePath)
      : null,
    licenceHref: repositoryDocumentHref(repositoryRef, publication.licensingPath),
    evidenceRoutes,
    evidenceSummary: `${evidenceRoutes.length} mapped record${evidenceRoutes.length === 1 ? "" : "s"}`,
    evidenceCaveat: "Direct repository links only; no document-level evidence status is implied.",
    clarityReportHref: repositoryIssueUrl(
      "site-documentation-problem.yml",
      `[Site/Docs] ${sourcePath} @ ${sourceRevision?.slice(0, 12) ?? `site-v${input.editionVersion}`}`,
      { location: locator },
    ),
    evidenceCorrectionHref: repositoryIssueUrl(
      "evidence-correction.yml",
      `[Evidence] ${sourcePath} @ ${sourceRevision?.slice(0, 12) ?? `site-v${input.editionVersion}`}`,
      { claims: locator },
    ),
  });
}
