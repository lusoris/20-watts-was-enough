const canonicalRepository = "https://github.com/lusoris/20-watts-was-enough";
const semanticVersionPattern = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/u;
const sourceRefPattern = /^(?:main|v(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)\.(?:0|[1-9]\d*))$/u;

/** @typedef {"owner-only-site" | "github-pages" | "public-pdf"} BookSurface */

/**
 * @param {string} sourceRef
 */
export function assertBookSourceRef(sourceRef) {
  if (typeof sourceRef !== "string" || sourceRef.length > 32 || !sourceRefPattern.test(sourceRef)) {
    throw new Error(`Book source ref must be main or vMAJOR.MINOR.PATCH: ${JSON.stringify(sourceRef)}`);
  }
  return sourceRef;
}

/**
 * @param {string} sourceRef
 * @param {string} editionVersion
 */
export function assertBookSourceRefForVersion(sourceRef, editionVersion) {
  if (typeof editionVersion !== "string" || editionVersion.length > 31 || !semanticVersionPattern.test(editionVersion)) {
    throw new Error(`Book edition version must be SemVer: ${JSON.stringify(editionVersion)}`);
  }
  const validRef = assertBookSourceRef(sourceRef);
  if (validRef !== "main" && validRef !== `v${editionVersion}`) {
    throw new Error(`Book source ref ${JSON.stringify(validRef)} does not match edition version ${JSON.stringify(editionVersion)}.`);
  }
  return validRef;
}

/**
 * @param {BookSurface} surface
 * @param {string} sourceRef
 * @param {string} editionVersion
 */
export function repositoryRefForSurface(surface, sourceRef, editionVersion) {
  const validRef = assertBookSourceRefForVersion(sourceRef, editionVersion);
  return surface === "public-pdf" ? validRef : "main";
}

/** @param {string} ref */
export function repositoryTreeHref(ref) {
  return `${canonicalRepository}/tree/${encodeURIComponent(ref)}`;
}

/**
 * @param {string} ref
 * @param {string} path
 * @param {string} [hash]
 */
export function repositoryDocumentHref(ref, path, hash = "") {
  const encodedPath = path
    .replaceAll("\\", "/")
    .split("/")
    .filter(Boolean)
    .map(encodeURIComponent)
    .join("/");
  return `${canonicalRepository}/blob/${encodeURIComponent(ref)}/${encodedPath}${hash ? `#${encodeURIComponent(hash)}` : ""}`;
}

/** @param {string} ref */
export const repositoryDocumentHrefFor = (ref) => (path, hash = "") =>
  repositoryDocumentHref(ref, path, hash);
