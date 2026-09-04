import { publication, repositoryIssueUrl } from "./publication.mjs";

const sourceRevisionPattern = /^[0-9a-f]{40}$/u;
const semanticVersionPattern = /^(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)$/u;
const documentTypes = Object.freeze({
  Concept: "Concept document",
  Mathematics: "Mathematical note",
});

/** @param {unknown} value */
export function normalizePublicationSourceRevision(value) {
  if (value === undefined || value === null || value === "") return null;
  if (typeof value !== "string" || !sourceRevisionPattern.test(value)) {
    throw new Error("Publication source revision must be an exact lowercase 40-character Git commit SHA.");
  }
  return value;
}

function encodedRepositoryPath(value) {
  return value.split("/").map(encodeURIComponent).join("/");
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

/** @param {unknown} value */
export function normalizeResearchObjectFragment(value) {
  const hasControl = typeof value === "string"
    && [...value].some((character) => {
      const codePoint = character.codePointAt(0) ?? 0;
      return codePoint < 32 || codePoint === 127;
    });
  if (typeof value !== "string" || value.length > 256 || hasControl) {
    return "";
  }
  return value.replace(/^#+/u, "");
}

function repositoryDocumentHref(ref, path, fragment = "") {
  const hash = fragment ? `#${encodeURIComponent(fragment)}` : "";
  return `${publication.repository}/blob/${encodeURIComponent(ref)}/${encodedRepositoryPath(path)}${hash}`;
}

function repositoryHistoryHref(ref, path) {
  return `${publication.repository}/commits/${encodeURIComponent(ref)}/${encodedRepositoryPath(path)}`;
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
  const repositoryRef = sourceRevision ?? "main";
  const publicUrl = new URL(route, publication.canonicalSite);
  const edition = `Site v${input.editionVersion} · continuous main snapshot`;
  const locatorLines = [
    `Canonical path: ${sourcePath}`,
    `Public route: ${publicUrl.toString()}`,
    `Edition: ${edition}`,
    ...(sourceRevision ? [`Source revision: ${sourceRevision}`] : []),
    ...(fragment ? [`Current fragment: #${fragment}`] : []),
  ];
  const locator = locatorLines.join("\n");

  return Object.freeze({
    type,
    title: input.title,
    sourcePath,
    publicUrl: publicUrl.toString(),
    edition,
    sourceRevision,
    sourceHref: repositoryDocumentHref(repositoryRef, sourcePath, fragment),
    historyHref: repositoryHistoryHref(repositoryRef, sourcePath),
    citationHref: repositoryDocumentHref(repositoryRef, publication.citationPath),
    disclosureHref: repositoryDocumentHref(
      repositoryRef,
      `${publication.disclosureDirectory}/v${input.editionVersion}.md`,
    ),
    licenceHref: repositoryDocumentHref(repositoryRef, publication.licensingPath),
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
