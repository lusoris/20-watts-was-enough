import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import path from "node:path";

import { isOfficialEuLanguageCode } from "../../app/lib/eu-languages.mjs";
import { publication } from "../../app/lib/publication.mjs";
import { readStableOpenedFileSync } from "./opened-file.mjs";
import { parseStrictJson } from "./strict-json.mjs";

const SOURCE = /^(?:concept|math)\/(?:[a-z0-9][a-z0-9-]*\/)*[a-z0-9][a-z0-9-]*\.md$/u;
const SHA256 = /^[a-f0-9]{64}$/u;
const SOURCE_REVISION = /^(?!0{40}$)[a-f0-9]{40}$/u;
const REVIEWED_AT = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/u;
const topLevelFields = Object.freeze(["documents", "schema", "sourceLanguage"]);
const documentFields = Object.freeze([
  "language",
  "reviewedAt",
  "reviewers",
  "route",
  "source",
  "sourceRevision",
  "sourceRoute",
  "sourceSha256",
  "target",
  "targetSha256",
]);

export const translationManifestLimits = Object.freeze({
  manifestBytes: 1024 * 1024,
  documentBytes: 4 * 1024 * 1024,
  documents: 4096,
  reviewersPerDocument: 16,
  reviewerCharacters: 160,
});

const gitValidationLimits = Object.freeze({
  outputBytes: 2 * translationManifestLimits.manifestBytes,
  timeoutMilliseconds: 10_000,
});

function inside(root, candidate) {
  const relative = path.relative(root, candidate);
  return relative !== "" && !relative.startsWith("..") && !path.isAbsolute(relative);
}

function exactObject(value, expectedFields, label) {
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    throw new Error(`${label} must be an object.`);
  }
  const actualFields = Object.keys(value);
  const expected = new Set(expectedFields);
  const actual = new Set(actualFields);
  const unknown = actualFields.filter((field) => !expected.has(field));
  const missing = expectedFields.filter((field) => !actual.has(field));
  if (unknown.length > 0 || missing.length > 0) {
    throw new Error(
      `${label} fields are not closed: unknown=[${unknown.join(", ")}], missing=[${missing.join(", ")}].`,
    );
  }
}

function readTranslationFile(root, file, label, maximumBytes) {
  const absolute = path.resolve(file);
  if (!inside(root, absolute)) throw new Error(`${label} escapes the repository.`);
  return readStableOpenedFileSync(absolute, {
    label,
    containedBy: path.dirname(absolute),
    maximumBytes,
  });
}

function gitCommand(root, arguments_, input, label) {
  const result = spawnSync("git", ["-C", root, ...arguments_], {
    encoding: null,
    env: {
      GIT_NO_REPLACE_OBJECTS: "1",
      GIT_OPTIONAL_LOCKS: "0",
      LANG: "C",
      LC_ALL: "C",
      PATH: process.env.PATH ?? "",
    },
    input,
    killSignal: "SIGKILL",
    maxBuffer: gitValidationLimits.outputBytes,
    timeout: gitValidationLimits.timeoutMilliseconds,
    windowsHide: true,
  });
  if (result.error || result.signal !== null || result.status !== 0) {
    throw new Error(`${label} could not be verified in the local Git history.`);
  }
  return Buffer.from(result.stdout ?? []);
}

function gitObjectRecords(root, specifications) {
  const output = gitCommand(
    root,
    ["cat-file", "--batch-check=%(objectname)|%(objecttype)|%(objectsize)|%(objectmode)"],
    Buffer.from(`${specifications.join("\n")}\n`),
    "Translation source revisions",
  ).toString("utf8");
  const lines = output.endsWith("\n") ? output.slice(0, -1).split("\n") : [];
  if (lines.length !== specifications.length) {
    throw new Error("Translation source revision object inventory is incomplete.");
  }
  return lines.map((line) => {
    const match = /^([a-f0-9]{40})\|([a-z]+)\|([0-9]+)\|([0-9]{6})?$/u.exec(line);
    return match === null ? null : Object.freeze({
      mode: match[4] ?? null,
      oid: match[1],
      type: match[2],
    });
  });
}

function validateSourceRevisionBindings(root, bindings) {
  if (bindings.length === 0) return;
  const sourceObjectOutput = gitCommand(
    root,
    ["hash-object", "--no-filters", "--stdin-paths"],
    Buffer.from(`${bindings.map(({ source }) => source).join("\n")}\n`),
    "Current translation sources",
  ).toString("utf8");
  const sourceObjectIds = sourceObjectOutput.endsWith("\n")
    ? sourceObjectOutput.slice(0, -1).split("\n")
    : [];
  if (
    sourceObjectIds.length !== bindings.length
    || sourceObjectIds.some((oid) => !/^[a-f0-9]{40}$/u.test(oid))
  ) {
    throw new Error("Current translation source object inventory is incomplete.");
  }
  const specifications = bindings.flatMap(({ source, sourceRevision }) => [
    sourceRevision,
    `${sourceRevision}:${source}`,
  ]);
  const objects = gitObjectRecords(root, specifications);
  for (const [index, binding] of bindings.entries()) {
    const commit = objects[index * 2];
    const source = objects[(index * 2) + 1];
    if (
      commit?.oid !== binding.sourceRevision
      || commit.type !== "commit"
    ) {
      throw new Error(
        `Translation source revision is not an available exact commit: ${binding.target}`,
      );
    }
    if (source?.type !== "blob") {
      throw new Error(
        `Translation source does not exist at its reviewed commit: ${binding.source}`,
      );
    }
    if (source.mode !== "100644" && source.mode !== "100755") {
      throw new Error(
        `Translation source at its reviewed commit is not a regular file: ${binding.source}`,
      );
    }
    if (source.oid !== sourceObjectIds[index]) {
      throw new Error(
        `Translation source revision does not bind its recorded source: ${binding.source}`,
      );
    }
  }
  const revisions = [...new Set(bindings.map(({ sourceRevision }) => sourceRevision))];
  const unreachable = gitCommand(
    root,
    ["rev-list", "--max-count=1", "--stdin"],
    Buffer.from(`${revisions.join("\n")}\n^HEAD\n`),
    "Translation source revision ancestry",
  );
  if (unreachable.length !== 0) {
    throw new Error("Translation source revision is not an ancestor of the publication checkout.");
  }
}

function validatedReviewers(reviewers, target) {
  if (
    !Array.isArray(reviewers)
    || reviewers.length === 0
    || reviewers.length > translationManifestLimits.reviewersPerDocument
  ) {
    throw new Error(
      `Translation requires 1-${translationManifestLimits.reviewersPerDocument} named reviewers: ${target}`,
    );
  }
  const names = new Set();
  for (const reviewer of reviewers) {
    if (
      typeof reviewer !== "string"
      || reviewer !== reviewer.trim()
      || reviewer.length === 0
      || reviewer.length > translationManifestLimits.reviewerCharacters
    ) {
      throw new Error(`Translation has an invalid reviewer identity: ${target}`);
    }
    if (names.has(reviewer)) {
      throw new Error(`Translation repeats reviewer ${JSON.stringify(reviewer)}: ${target}`);
    }
    names.add(reviewer);
  }
  return Object.freeze([...reviewers]);
}

export function validateTranslationReviewMetadata(entry, target) {
  if (
    typeof entry.sourceRevision !== "string"
    || !SOURCE_REVISION.test(entry.sourceRevision)
  ) {
    throw new Error(`Translation source revision is not an exact Git commit: ${target}`);
  }
  const reviewInstant = typeof entry.reviewedAt === "string"
    ? Date.parse(entry.reviewedAt)
    : Number.NaN;
  if (
    typeof entry.reviewedAt !== "string"
    || !REVIEWED_AT.test(entry.reviewedAt)
    || !Number.isFinite(reviewInstant)
    || new Date(reviewInstant).toISOString() !== `${entry.reviewedAt.slice(0, -1)}.000Z`
  ) {
    throw new Error(`Translation review time is not canonical UTC: ${target}`);
  }
  return Object.freeze({
    sourceRevision: entry.sourceRevision,
    reviewedAt: entry.reviewedAt,
  });
}

function validateEntryShape(entry, index) {
  exactObject(entry, documentFields, `Translation manifest document ${index}`);
  if (
    typeof entry.language !== "string"
    || entry.language === "en"
    || !isOfficialEuLanguageCode(entry.language)
  ) {
    throw new Error("Translation language must be a non-English official EU language code.");
  }
  if (
    typeof entry.source !== "string"
    || !SOURCE.test(entry.source)
    || path.posix.normalize(entry.source) !== entry.source
  ) {
    throw new Error(`Unsafe translation source path: ${entry.source}`);
  }
  const expectedTarget = `translations/${entry.language}/${entry.source}`;
  if (entry.target !== expectedTarget) {
    throw new Error(`Translation target must mirror its source: ${expectedTarget}`);
  }
  const sourceRoute = `/${entry.source.replace(/\.md$/u, "/")}`;
  const route = `/${entry.language}/${entry.source.replace(/\.md$/u, "/")}`;
  if (entry.sourceRoute !== sourceRoute || entry.route !== route) {
    throw new Error(`Translation routes do not match the mirrored source: ${entry.target}`);
  }
  if (typeof entry.sourceSha256 !== "string" || !SHA256.test(entry.sourceSha256)) {
    throw new Error(`Translation source digest is not SHA-256: ${entry.target}`);
  }
  if (typeof entry.targetSha256 !== "string" || !SHA256.test(entry.targetSha256)) {
    throw new Error(`Translation target digest is not SHA-256: ${entry.target}`);
  }
  return Object.freeze({
    ...validateTranslationReviewMetadata(entry, entry.target),
    reviewers: validatedReviewers(entry.reviewers, entry.target),
  });
}

function validateEntryFiles(root, entry) {
  const sourcePath = path.resolve(root, entry.source);
  const targetPath = path.resolve(root, entry.target);
  const source = readTranslationFile(
    root,
    sourcePath,
    `translation source ${entry.source}`,
    translationManifestLimits.documentBytes,
  );
  const target = readTranslationFile(
    root,
    targetPath,
    `translation target ${entry.target}`,
    translationManifestLimits.documentBytes,
  );
  const sourceDigest = createHash("sha256").update(source).digest("hex");
  if (sourceDigest !== entry.sourceSha256) {
    throw new Error(`Translation is stale for canonical source: ${entry.source}`);
  }
  const targetDigest = createHash("sha256").update(target).digest("hex");
  if (targetDigest !== entry.targetSha256) {
    throw new Error(`Translation changed after review: ${entry.target}`);
  }
}

function validatedDocuments(root, documents) {
  if (!Array.isArray(documents) || documents.length > translationManifestLimits.documents) {
    throw new Error(
      `Translation manifest documents must be an array of at most ${translationManifestLimits.documents} entries.`,
    );
  }
  const identities = new Set();
  const routes = new Set();
  const bindings = [];
  const validated = documents.map((entry, index) => {
    const review = validateEntryShape(entry, index);
    const identity = `${entry.language}:${entry.source}`;
    if (identities.has(identity) || routes.has(entry.route)) {
      throw new Error(`Duplicate translation identity or route: ${identity}`);
    }
    identities.add(identity);
    routes.add(entry.route);
    validateEntryFiles(root, entry);
    bindings.push({
      source: entry.source,
      sourceRevision: review.sourceRevision,
      target: entry.target,
    });
    return Object.freeze({
      language: entry.language,
      source: entry.source,
      target: entry.target,
      sourceRoute: entry.sourceRoute,
      route: entry.route,
      sourceSha256: entry.sourceSha256,
      targetSha256: entry.targetSha256,
      sourceRevision: review.sourceRevision,
      reviewedAt: review.reviewedAt,
      reviewers: review.reviewers,
    });
  });
  validateSourceRevisionBindings(root, bindings);
  return Object.freeze(validated);
}

export function validateTranslationManifest(repositoryRoot) {
  const root = path.resolve(repositoryRoot);
  const manifestPath = path.join(root, "translations", "manifest.json");
  const manifestBytes = readTranslationFile(
    root,
    manifestPath,
    "translation manifest",
    translationManifestLimits.manifestBytes,
  );
  const manifest = parseStrictJson(manifestBytes, {
    label: "translation manifest JSON",
    maximumDepth: 4,
    maximumContainerEntries: translationManifestLimits.documents,
  });
  exactObject(manifest, topLevelFields, "Translation manifest");
  if (manifest.schema !== 2 || manifest.sourceLanguage !== publication.locale) {
    throw new Error("Translation manifest has an unsupported schema or source language.");
  }
  return Object.freeze({
    schema: 2,
    sourceLanguage: publication.locale,
    documents: validatedDocuments(root, manifest.documents),
  });
}
