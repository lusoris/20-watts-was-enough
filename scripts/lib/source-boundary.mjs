import { createHash } from "node:crypto";
import { lstat, readdir, readFile } from "node:fs/promises";
import path from "node:path";

const MAX_PROVENANCE_RECORD_BYTES = 16 * 1024;

// This is deliberately a closed, byte-exact publication manifest. Exact
// identity is stricter than accepting open-ended Markdown: a familiar record
// path cannot acquire an appended body, and a reviewed taxonomy path cannot be
// replaced with different bytes. Updating an entry is therefore a reviewable
// source-publication decision rather than an ordinary prose edit.
const PINNED_SOURCE_FILES = Object.freeze({
  "README.md": Object.freeze({
    bytes: 5740,
    sha256: "8766bc76b4ffe5a43b69352e50d17ae8f12efc3ccf8c6ca3efb9d57e65799560",
    role: "index",
  }),
  "2026-08-05-gemini-energy-comparison.md": Object.freeze({
    bytes: 849,
    sha256: "00afc01e6c3c4a5e8e3821c6701ae7775f35f4eb43ca16035b558acaf6adef10",
    role: "record",
  }),
  "2026-08-05-gemini-training-pipeline.md": Object.freeze({
    bytes: 815,
    sha256: "d17140b09fe04fd43cfb264d0a94556cde6bcb30e964171506ab3958605b1401",
    role: "record",
  }),
  "2026-08-05-google-doc.md": Object.freeze({
    bytes: 1080,
    sha256: "612925deec7337050f86339c7337b4b9315ea9a483ad5c89b5af5da93d19aa73",
    role: "record",
  }),
  "2026-08-06-biomimicry-links.md": Object.freeze({
    bytes: 2053,
    sha256: "f11137e45dd6c8d3328b9f36b90c91a7206c0525e7c946dcaea068ab6cade776",
    role: "record",
  }),
  "2026-08-06/google-doc-10uFJaJN.md": Object.freeze({
    bytes: 682,
    sha256: "5f981a46a72835b5b719257d592d5bffb5d25059f35beb2c5cfcef0a8fdfad22",
    role: "record",
  }),
  "2026-08-06/google-doc-1BXU7cVe.md": Object.freeze({
    bytes: 690,
    sha256: "dc99da7fb336ed616b1ad37700e116ea664b1a4c88b3b3dc3cf3a969162b3755",
    role: "record",
  }),
  "2026-08-06/google-doc-1JvM_XQy.md": Object.freeze({
    bytes: 686,
    sha256: "df35f278e1845c164d76786b6d5a46d0514c17b957b4133dee44d9f168b402fc",
    role: "record",
  }),
  "2026-08-06/google-doc-1Lo_tgeg.md": Object.freeze({
    bytes: 686,
    sha256: "6b5a495b48d20694b4785d3e5f3cbc57eb14bf1be1ab49ad7221316f5760890a",
    role: "record",
  }),
  "2026-08-06/google-doc-1q3PvYWS.md": Object.freeze({
    bytes: 678,
    sha256: "930ba135eacfe471959cda8a81e60da0cd7d0129965a7ca16b81a96af123ffc4",
    role: "record",
  }),
  "2026-08-06/google-doc-1tQnOxql.md": Object.freeze({
    bytes: 685,
    sha256: "e253a769d44fa46e5884e604b6872d3a463805119a581b4febd431cf15e57ae2",
    role: "record",
  }),
  "taxonomies/2026-08-25/README.md": Object.freeze({
    bytes: 5972,
    sha256: "106eca984ff66b3ce1484a399a4f8de3b9d3d275ad6b9f39b5482763811ef745",
    role: "taxonomy",
  }),
  "taxonomies/2026-08-25/anzsrc2020_for.csv": Object.freeze({
    bytes: 134487,
    sha256: "fdd2e5fe4249dfce9de9c451febbdd55a6d2641ea9aae7994f0517e361465af0",
    role: "taxonomy",
  }),
  "taxonomies/2026-08-25/dfg-fachsystematik-2024-2028.csv": Object.freeze({
    bytes: 18530,
    sha256: "8fb17138df31c8032433ffe4530c92b4bfaafa64fb9e3b9fe0f64b3aa6951c6b",
    role: "taxonomy",
  }),
  "taxonomies/2026-08-25/euroscivoc-concepts.rq": Object.freeze({
    bytes: 729,
    sha256: "3a65ac19720c48e1b95b4310ead15caf078b33bb746a025041de12d6def09fc3",
    role: "taxonomy",
  }),
  "taxonomies/2026-08-25/euroscivoc-v1.6-concepts.csv": Object.freeze({
    bytes: 202060,
    sha256: "726511759843412444377f962099cd310adb7d6ae4dd71285189e6cdc6de7414",
    role: "taxonomy",
  }),
  "taxonomies/2026-08-25/euroscivoc-v1.6.rdf": Object.freeze({
    bytes: 255987,
    sha256: "3cec494b498dc75969bbfeebb089e1b1fd94a9409172f8b70c214ddc29d772cd",
    role: "taxonomy",
  }),
});

const toPosix = (value) => value.split(path.sep).join("/");

async function walkFiles(root, current = root) {
  const entries = await readdir(current, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const absolute = path.join(current, entry.name);
    const relative = toPosix(path.relative(root, absolute));
    if (entry.isDirectory()) files.push(...await walkFiles(root, absolute));
    else if (entry.isFile()) files.push(relative);
    else throw new Error(`Unsupported source-tree entry: ${relative}`);
  }
  return files.sort();
}

function assertExactPathSet(actualPaths) {
  const expectedPaths = Object.keys(PINNED_SOURCE_FILES).sort();
  const actual = new Set(actualPaths);
  const expected = new Set(expectedPaths);
  const unexpected = actualPaths.filter((relativePath) => !expected.has(relativePath));
  const missing = expectedPaths.filter((relativePath) => !actual.has(relativePath));
  if (unexpected.length > 0 || missing.length > 0) {
    throw new Error(
      "Source publication allowlist mismatch: "
      + `unexpected=[${unexpected.join(", ")}], missing=[${missing.join(", ")}]`,
    );
  }
}

async function readPinnedFile(sourceRoot, relativePath, expected) {
  const absolute = path.join(sourceRoot, ...relativePath.split("/"));
  const metadata = await lstat(absolute);
  if (!metadata.isFile() || metadata.isSymbolicLink()) {
    throw new Error(`${relativePath} must be a regular file, not a replacement path`);
  }
  if (metadata.size !== expected.bytes) {
    throw new Error(
      `${relativePath} integrity mismatch: expected ${expected.bytes} bytes, found ${metadata.size}`,
    );
  }
  const bytes = await readFile(absolute);
  const actualDigest = createHash("sha256").update(bytes).digest("hex");
  if (actualDigest !== expected.sha256) {
    throw new Error(
      `${relativePath} integrity mismatch: expected SHA-256 ${expected.sha256}, found ${actualDigest}`,
    );
  }
  return bytes;
}

function assertProjectIndexBoundary(index) {
  const required = [
    "excluded wholesale",
    "does not relicense",
    "not scientific evidence",
    "do not infer an open licence",
    "byte-exact",
  ];
  for (const phrase of required) {
    if (!index.toLowerCase().includes(phrase)) {
      throw new Error(`sources/README.md is missing publication-boundary phrase: ${phrase}`);
    }
  }
}

function assertNoEmbeddedPayload(relativePath, text) {
  const forbidden = [
    [/\0/u, "NUL byte"],
    [/\bdata:[^\s)>]+/iu, "data URI"],
    [/!\[[^\]]*\]\([^)]*\)/u, "embedded Markdown image"],
    [/<img\b/iu, "embedded HTML image"],
    [/^```/mu, "fenced payload"],
  ];
  for (const [pattern, label] of forbidden) {
    if (pattern.test(text)) throw new Error(`${relativePath} contains a forbidden ${label}`);
  }
}

function assertProvenanceRecord(relativePath, text, byteLength, index) {
  if (byteLength > MAX_PROVENANCE_RECORD_BYTES) {
    throw new Error(
      `${relativePath} is ${byteLength} bytes; provenance records are capped at ${MAX_PROVENANCE_RECORD_BYTES}`,
    );
  }
  assertNoEmbeddedPayload(relativePath, text);
  if (!/^# .*source/imu.test(text)) {
    throw new Error(`${relativePath} must identify itself as a source record or source lead`);
  }
  if (!/\*\*Authority:\*\*/u.test(text)) {
    throw new Error(`${relativePath} must declare its authority boundary`);
  }
  if (!/https?:\/\//u.test(text)) {
    throw new Error(`${relativePath} must retain at least one origin URL`);
  }
  if (!index.includes(`(${relativePath})`)) {
    throw new Error(`${relativePath} is missing from sources/README.md`);
  }

  const isGoogleOrGemini = /(?:docs\.google\.com|gemini\.google\.com)/iu.test(text);
  if (!isGoogleOrGemini) return;
  if (!/^# Link-only source record:/mu.test(text)) {
    throw new Error(`${relativePath} must remain explicitly link-only`);
  }
  if (!/not scientific evidence/iu.test(text)) {
    throw new Error(`${relativePath} must state that it is not scientific evidence`);
  }
  if (!/(?:body|transcript).{0,240}(?:omitted|not\s+reproduced|not\s+present)/isu.test(text)) {
    throw new Error(`${relativePath} must state that the document or transcript body is absent`);
  }
}

export async function validateSourceBoundary({ repositoryRoot }) {
  const sourceRoot = path.join(repositoryRoot, "sources");
  const sourceRootMetadata = await lstat(sourceRoot);
  if (!sourceRootMetadata.isDirectory() || sourceRootMetadata.isSymbolicLink()) {
    throw new Error("sources must be a regular directory, not a replacement path");
  }
  const files = await walkFiles(sourceRoot);
  assertExactPathSet(files);

  const verified = new Map();
  for (const [relativePath, expected] of Object.entries(PINNED_SOURCE_FILES)) {
    verified.set(relativePath, await readPinnedFile(sourceRoot, relativePath, expected));
  }

  const index = verified.get("README.md").toString("utf8");
  assertProjectIndexBoundary(index);

  const records = [];
  const taxonomyFiles = [];
  for (const [relativePath, expected] of Object.entries(PINNED_SOURCE_FILES)) {
    if (expected.role === "index") continue;
    if (expected.role === "taxonomy") {
      taxonomyFiles.push(relativePath);
      continue;
    }
    const bytes = verified.get(relativePath);
    assertProvenanceRecord(relativePath, bytes.toString("utf8"), bytes.length, index);
    records.push(relativePath);
  }

  return Object.freeze({
    records: Object.freeze(records.sort()),
    taxonomyFiles: Object.freeze(taxonomyFiles.sort()),
    maximumRecordBytes: MAX_PROVENANCE_RECORD_BYTES,
    pinnedFiles: Object.keys(PINNED_SOURCE_FILES).length,
  });
}
