const sourceRevisionPattern = /^[0-9a-f]{40}$/u;

/** @param {unknown} value */
export function normalizePublicationSourceRevision(value) {
  if (value === undefined || value === null || value === "") return null;
  if (typeof value !== "string" || !sourceRevisionPattern.test(value)) {
    throw new Error("Publication source revision must be an exact lowercase 40-character Git commit SHA.");
  }
  return value;
}

/** @param {unknown} value */
export function publicationSourceRevisionQuery(value) {
  const revision = normalizePublicationSourceRevision(value);
  return revision ? `?revision=${encodeURIComponent(revision)}` : "";
}
