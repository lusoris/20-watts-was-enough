import { createHash } from "node:crypto";
import { spawnSync } from "node:child_process";
import { chmodSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import {
  lstat,
  mkdir,
  mkdtemp,
  realpath,
  rename,
  rm,
  writeFile,
} from "node:fs/promises";
import os from "node:os";
import path from "node:path";

import { assertBookPdfBytesIntegrity } from "./book-pdf-integrity.mjs";
import { parseStrictJson } from "./strict-json.mjs";

export const BOOK_PDF_SEMANTIC_BASELINE_SCHEMA_VERSION = 1;
export const BOOK_PDF_SEMANTIC_CLAIM_BOUNDARY =
  "Engineering regression sentinel only; this audit does not establish PDF/UA or WCAG conformance.";

const SHA256_PATTERN = /^[0-9a-f]{64}$/u;
const SEMANTIC_AUTHORITY = "engineering-regression-sentinel";
const OUTCOMES = new Set(["clean", "known-debt"]);
const SENTINEL_CLASSES = new Set([
  "dashboard-status",
  "diagram-figure",
  "table-displayed-equation",
]);
const CAPTURE_NAMES = Object.freeze([
  "metadata",
  "structure",
  "structure_text",
  "default_text",
  "raw_text",
]);
const MAXIMUM_CAPTURE_BYTES = 16 * 1024 * 1024;
const MAXIMUM_PDF_BYTES = 256 * 1024 * 1024;
const CAPTURE_TIMEOUT_MS = 120_000;
const EMPTY_SHA256 = createHash("sha256").digest("hex");

const EVIDENCE_FILE_NAMES = Object.freeze({
  metadata: Object.freeze({
    stdout: "pdfinfo.stdout.txt",
    stderr: "pdfinfo.stderr.txt",
  }),
  structure: Object.freeze({
    stdout: "pdfinfo-struct.stdout.txt",
    stderr: "pdfinfo-struct.stderr.txt",
  }),
  structure_text: Object.freeze({
    stdout: "pdfinfo-struct-text.stdout.txt",
    stderr: "pdfinfo-struct-text.stderr.txt",
  }),
  default_text: Object.freeze({
    stdout: "pdftotext-default.stdout.txt",
    stderr: "pdftotext-default.stderr.txt",
  }),
  raw_text: Object.freeze({
    stdout: "pdftotext-raw.stdout.txt",
    stderr: "pdftotext-raw.stderr.txt",
  }),
});

function fail(message) {
  throw new Error(message);
}

function assertClosedObject(value, expectedFields, label) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    fail(`${label} must be an object`);
  }
  const actual = Object.keys(value).sort();
  const expected = [...expectedFields].sort();
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    fail(`${label} fields are not closed: expected [${expected.join(", ")}], received [${actual.join(", ")}]`);
  }
}

function assertString(value, label) {
  if (typeof value !== "string" || value.length === 0) {
    fail(`${label} must be a non-empty string`);
  }
}

function assertPositiveInteger(value, label) {
  if (!Number.isSafeInteger(value) || value < 1) {
    fail(`${label} must be a positive integer`);
  }
}

function assertPositiveNumber(value, label) {
  if (typeof value !== "number" || !Number.isFinite(value) || value <= 0) {
    fail(`${label} must be a positive finite number`);
  }
}

function assertSha256(value, label) {
  if (!SHA256_PATTERN.test(value ?? "")) fail(`${label} must be a lowercase SHA-256 digest`);
}

function assertCanonicalRelativePath(value, label) {
  assertString(value, label);
  if (
    value.includes("\0")
    || value.includes("\\")
    || value.startsWith("/")
    || value === ".."
    || value.startsWith("../")
    || path.posix.normalize(value) !== value
    || value === "."
  ) fail(`${label} must be a canonical repository-relative path`);
}

function sha256(value) {
  return createHash("sha256").update(value).digest("hex");
}

function validateStreamExpectation(value, label) {
  assertClosedObject(value, ["bytes", "sha256"], label);
  if (!Number.isSafeInteger(value.bytes) || value.bytes < 0) {
    fail(`${label}.bytes must be a non-negative integer`);
  }
  assertSha256(value.sha256, `${label}.sha256`);
}

function validateCaptureExpectation(value, label) {
  assertClosedObject(value, ["exit_status", "stderr", "stdout"], label);
  if (value.exit_status !== 0) fail(`${label}.exit_status must be zero`);
  validateStreamExpectation(value.stdout, `${label}.stdout`);
  validateStreamExpectation(value.stderr, `${label}.stderr`);
}

function validateDiagnosticList(value, label) {
  if (!Array.isArray(value)) fail(`${label} must be an array`);
  const messages = [];
  for (const [index, entry] of value.entries()) {
    assertClosedObject(entry, ["count", "message"], `${label}[${index}]`);
    assertString(entry.message, `${label}[${index}].message`);
    assertPositiveInteger(entry.count, `${label}[${index}].count`);
    messages.push(entry.message);
  }
  if (new Set(messages).size !== messages.length) fail(`${label} repeats a diagnostic message`);
  if (JSON.stringify(messages) !== JSON.stringify([...messages].sort())) {
    fail(`${label} must use canonical message order`);
  }
}

function validateFragmentList(value, label) {
  if (!Array.isArray(value) || value.length < 2) {
    fail(`${label} must contain at least two ordered fragments`);
  }
  value.forEach((fragment, index) => assertString(fragment, `${label}[${index}]`));
}

function validateSentinel(value, index, artifact, identities) {
  const label = `semantic baseline sentinels[${index}]`;
  assertClosedObject(value, [
    "class",
    "default_anchor",
    "default_fragments",
    "defect",
    "id",
    "raw_fragments",
    "recorded_page",
    "state",
    "struct_text_fragments",
  ], label);
  assertString(value.id, `${label}.id`);
  if (identities.has(value.id)) fail(`semantic baseline repeats sentinel ${value.id}`);
  identities.add(value.id);
  if (!SENTINEL_CLASSES.has(value.class)) fail(`${label}.class is unknown`);
  assertPositiveInteger(value.recorded_page, `${label}.recorded_page`);
  if (value.recorded_page > artifact.pages) fail(`${label}.recorded_page exceeds the PDF page count`);
  assertString(value.default_anchor, `${label}.default_anchor`);
  validateFragmentList(value.default_fragments, `${label}.default_fragments`);
  validateFragmentList(value.struct_text_fragments, `${label}.struct_text_fragments`);
  validateFragmentList(value.raw_fragments, `${label}.raw_fragments`);
  if (value.default_fragments[0] !== value.default_anchor) {
    fail(`${label}.default_fragments must begin with default_anchor`);
  }
  if (!OUTCOMES.has(value.state)) fail(`${label}.state is unknown`);
  assertString(value.defect, `${label}.defect`);
}

function validateArtifact(value) {
  assertClosedObject(value, [
    "manifest",
    "manifest_sha256",
    "pages",
    "page_size_name",
    "page_size_points",
    "pdf",
    "pdf_sha256",
    "pdf_version",
    "size_bytes",
    "source_digest",
    "source_ref",
    "tagged",
    "version",
  ], "semantic baseline artifact");
  assertCanonicalRelativePath(value.pdf, "semantic baseline artifact.pdf");
  assertCanonicalRelativePath(value.manifest, "semantic baseline artifact.manifest");
  assertSha256(value.pdf_sha256, "semantic baseline artifact.pdf_sha256");
  assertSha256(value.manifest_sha256, "semantic baseline artifact.manifest_sha256");
  assertSha256(value.source_digest, "semantic baseline artifact.source_digest");
  assertPositiveInteger(value.size_bytes, "semantic baseline artifact.size_bytes");
  assertPositiveInteger(value.pages, "semantic baseline artifact.pages");
  assertClosedObject(
    value.page_size_points,
    ["height", "width"],
    "semantic baseline artifact.page_size_points",
  );
  assertPositiveNumber(
    value.page_size_points.width,
    "semantic baseline artifact.page_size_points.width",
  );
  assertPositiveNumber(
    value.page_size_points.height,
    "semantic baseline artifact.page_size_points.height",
  );
  assertString(value.page_size_name, "semantic baseline artifact.page_size_name");
  assertString(value.pdf_version, "semantic baseline artifact.pdf_version");
  if (value.tagged !== true) fail("semantic baseline artifact.tagged must be true");
  assertString(value.source_ref, "semantic baseline artifact.source_ref");
  assertString(value.version, "semantic baseline artifact.version");
}

function validateTools(value) {
  assertClosedObject(value, ["pdfinfo", "pdftotext"], "semantic baseline tools");
  for (const name of ["pdfinfo", "pdftotext"]) {
    assertClosedObject(value[name], ["command", "version"], `semantic baseline tools.${name}`);
    if (value[name].command !== name) fail(`semantic baseline tools.${name}.command must be ${name}`);
    assertString(value[name].version, `semantic baseline tools.${name}.version`);
  }
}

export function validateBookPdfSemanticBaseline(value) {
  assertClosedObject(value, [
    "artifact",
    "authority",
    "claim_boundary",
    "diagnostics",
    "expected_outcome",
    "outputs",
    "schema_version",
    "sentinels",
    "tools",
  ], "semantic baseline");
  if (value.schema_version !== BOOK_PDF_SEMANTIC_BASELINE_SCHEMA_VERSION) {
    fail(`unsupported semantic baseline schema version: ${value.schema_version}`);
  }
  if (value.authority !== SEMANTIC_AUTHORITY) fail("semantic baseline authority is invalid");
  if (value.claim_boundary !== BOOK_PDF_SEMANTIC_CLAIM_BOUNDARY) {
    fail("semantic baseline claim boundary is invalid");
  }
  if (!OUTCOMES.has(value.expected_outcome)) fail("semantic baseline expected_outcome is unknown");
  validateArtifact(value.artifact);
  validateTools(value.tools);
  assertClosedObject(value.outputs, CAPTURE_NAMES, "semantic baseline outputs");
  CAPTURE_NAMES.forEach((name) => validateCaptureExpectation(
    value.outputs[name],
    `semantic baseline outputs.${name}`,
  ));
  assertClosedObject(value.diagnostics, ["structure", "structure_text"], "semantic baseline diagnostics");
  validateDiagnosticList(value.diagnostics.structure, "semantic baseline diagnostics.structure");
  validateDiagnosticList(value.diagnostics.structure_text, "semantic baseline diagnostics.structure_text");
  if (!Array.isArray(value.sentinels) || value.sentinels.length < 3) {
    fail("semantic baseline requires at least three nonlinear sentinels");
  }
  const identities = new Set();
  value.sentinels.forEach((entry, index) => validateSentinel(entry, index, value.artifact, identities));
  const representedClasses = new Set(value.sentinels.map((entry) => entry.class));
  const missingClasses = [...SENTINEL_CLASSES].filter((className) => !representedClasses.has(className));
  if (missingClasses.length > 0) {
    fail(`semantic baseline is missing sentinel classes: ${missingClasses.join(", ")}`);
  }
  const observedOutcome = value.sentinels.some((entry) => entry.state === "known-debt")
    || value.diagnostics.structure.length > 0
    || value.diagnostics.structure_text.length > 0
    ? "known-debt"
    : "clean";
  if (observedOutcome !== value.expected_outcome) {
    fail(`semantic baseline expected_outcome must be ${observedOutcome}`);
  }
  if (value.outputs.default_text.stderr.bytes !== 0 || value.outputs.raw_text.stderr.bytes !== 0) {
    fail("pdftotext stderr cannot be accepted as semantic baseline debt");
  }
  if (
    value.outputs.default_text.stderr.sha256 !== EMPTY_SHA256
    || value.outputs.raw_text.stderr.sha256 !== EMPTY_SHA256
  ) fail("empty pdftotext stderr must use the empty SHA-256 digest");
  return value;
}

export function parseBookPdfSemanticBaseline(bytes) {
  return validateBookPdfSemanticBaseline(parseStrictJson(bytes, {
    label: "book PDF semantic baseline",
    maximumDepth: 12,
    maximumContainerEntries: 256,
  }));
}

function commandResult(command, arguments_, options = {}) {
  const maximumBytes = options.maxBuffer ?? MAXIMUM_CAPTURE_BYTES;
  const result = spawnSync(command, arguments_, {
    cwd: options.cwd,
    encoding: null,
    env: { LANG: "C", LC_ALL: "C", PATH: process.env.PATH ?? "", TZ: "UTC" },
    killSignal: "SIGKILL",
    maxBuffer: maximumBytes,
    timeout: options.timeout ?? CAPTURE_TIMEOUT_MS,
    windowsHide: true,
  });
  if (result.error) fail(`${command} failed before exit: ${result.error.message}`);
  const stdout = Buffer.from(result.stdout ?? []);
  const stderr = Buffer.from(result.stderr ?? []);
  if (stdout.length > maximumBytes || stderr.length > maximumBytes) {
    fail(`${command} exceeded the ${maximumBytes}-byte capture bound`);
  }
  return Object.freeze({
    signal: result.signal ?? null,
    status: result.status,
    stderr,
    stdout,
  });
}

function toolVersion(command, name) {
  const result = commandResult(command, ["-v"], { maxBuffer: 64 * 1024, timeout: 10_000 });
  if (result.status !== 0 || result.signal !== null) fail(`${name} -v did not exit cleanly`);
  const output = Buffer.concat([result.stdout, result.stderr]).toString("utf8");
  const match = new RegExp(`^${name} version ([^\\s]+)$`, "mu").exec(output);
  if (!match) fail(`${name} -v did not expose a parseable version`);
  return match[1];
}

export function captureBookPdfSemanticOutputs({
  captureLimits = {
    maximum_bytes: MAXIMUM_CAPTURE_BYTES,
    timeout_ms: CAPTURE_TIMEOUT_MS,
  },
  expectedToolVersions,
  pdfBytes,
  pdfinfoCommand = "pdfinfo",
  pdftotextCommand = "pdftotext",
  temporaryRoot = os.tmpdir(),
} = {}) {
  if (!Buffer.isBuffer(pdfBytes) || pdfBytes.length === 0) {
    fail("semantic audit pdfBytes must be a non-empty Buffer");
  }
  if (pdfBytes.length > MAXIMUM_PDF_BYTES) {
    fail(`semantic audit PDF exceeds the ${MAXIMUM_PDF_BYTES}-byte input bound`);
  }
  assertClosedObject(captureLimits, ["maximum_bytes", "timeout_ms"], "semantic capture limits");
  const maximumBytes = captureLimits.maximum_bytes ?? MAXIMUM_CAPTURE_BYTES;
  const timeout = captureLimits.timeout_ms ?? CAPTURE_TIMEOUT_MS;
  if (!Number.isSafeInteger(maximumBytes) || maximumBytes < 1 || maximumBytes > MAXIMUM_CAPTURE_BYTES) {
    fail(`semantic capture maximum_bytes must be between 1 and ${MAXIMUM_CAPTURE_BYTES}`);
  }
  if (!Number.isSafeInteger(timeout) || timeout < 1 || timeout > CAPTURE_TIMEOUT_MS) {
    fail(`semantic capture timeout_ms must be between 1 and ${CAPTURE_TIMEOUT_MS}`);
  }
  assertString(temporaryRoot, "semantic capture temporaryRoot");
  const toolIdentities = Object.freeze({
    pdfinfo: toolVersion(pdfinfoCommand, "pdfinfo"),
    pdftotext: toolVersion(pdftotextCommand, "pdftotext"),
  });
  if (expectedToolVersions) {
    assertClosedObject(expectedToolVersions, ["pdfinfo", "pdftotext"], "expected semantic tool versions");
    for (const name of ["pdfinfo", "pdftotext"]) {
      if (toolIdentities[name] !== expectedToolVersions[name]) {
        fail(`${name} version changed: expected ${expectedToolVersions[name]}, received ${toolIdentities[name]}`);
      }
    }
  }
  const snapshotDirectory = mkdtempSync(path.join(path.resolve(temporaryRoot), "20w-book-pdf-semantic-"));
  const snapshotPath = path.join(snapshotDirectory, "book.pdf");
  try {
    chmodSync(snapshotDirectory, 0o700);
    writeFileSync(snapshotPath, pdfBytes, { flag: "wx", mode: 0o600 });
    const options = { cwd: snapshotDirectory, maxBuffer: maximumBytes, timeout };
    const captures = Object.freeze({
      metadata: commandResult(pdfinfoCommand, ["book.pdf"], options),
      structure: commandResult(pdfinfoCommand, ["-struct", "book.pdf"], options),
      structure_text: commandResult(pdfinfoCommand, ["-struct-text", "book.pdf"], options),
      default_text: commandResult(pdftotextCommand, ["book.pdf", "-"], options),
      raw_text: commandResult(pdftotextCommand, ["-raw", "book.pdf", "-"], options),
    });
    return Object.freeze({
      captures,
      toolIdentities,
    });
  } finally {
    rmSync(snapshotDirectory, { recursive: true, force: true });
  }
}

export function summarizeBookPdfSemanticCapture(capture) {
  if (!capture || !Buffer.isBuffer(capture.stdout) || !Buffer.isBuffer(capture.stderr)) {
    fail("semantic capture must contain Buffer stdout and stderr streams");
  }
  return Object.freeze({
    exit_status: capture.status,
    stderr: Object.freeze({ bytes: capture.stderr.length, sha256: sha256(capture.stderr) }),
    stdout: Object.freeze({ bytes: capture.stdout.length, sha256: sha256(capture.stdout) }),
  });
}

function diagnosticCounts(bytes) {
  const counts = new Map();
  const lines = bytes.toString("utf8").replaceAll("\r\n", "\n").split("\n");
  for (const line of lines) {
    if (line.length === 0) continue;
    counts.set(line, (counts.get(line) ?? 0) + 1);
  }
  return counts;
}

function assertDiagnosticCounts(bytes, expected, label) {
  const actual = diagnosticCounts(bytes);
  const expectedByMessage = new Map(expected.map((entry) => [entry.message, entry.count]));
  for (const [message, count] of actual) {
    if (!expectedByMessage.has(message)) fail(`${label} emitted unknown diagnostic: ${message}`);
    if (expectedByMessage.get(message) !== count) {
      fail(`${label} diagnostic count changed for ${message}: expected ${expectedByMessage.get(message)}, received ${count}`);
    }
  }
  for (const [message, count] of expectedByMessage) {
    if (!actual.has(message)) fail(`${label} lost known diagnostic ${message} (expected ${count})`);
  }
}

function normalizeText(value) {
  return value.normalize("NFC").replace(/\s+/gu, " ").trim();
}

function parsePdfInfoMetadata(bytes) {
  const text = bytes.toString("utf8").replaceAll("\r\n", "\n");
  function exactMatch(pattern, label) {
    const matches = [...text.matchAll(pattern)];
    if (matches.length !== 1) fail(`pdfinfo metadata must contain exactly one ${label}`);
    return matches[0];
  }
  const pages = Number(exactMatch(/^Pages:\s+(\d+)\s*$/gmu, "page count")[1]);
  const pageSize = exactMatch(
    /^Page size:\s+([0-9]+(?:\.[0-9]+)?) x ([0-9]+(?:\.[0-9]+)?) pts \(([^)]+)\)\s*$/gmu,
    "page size",
  );
  const tagged = exactMatch(/^Tagged:\s+(yes|no)\s*$/gmu, "tag state")[1] === "yes";
  const pdfVersion = exactMatch(/^PDF version:\s+(\S+)\s*$/gmu, "PDF version")[1];
  return Object.freeze({
    page_size_name: pageSize[3],
    page_size_points: Object.freeze({
      height: Number(pageSize[2]),
      width: Number(pageSize[1]),
    }),
    pages,
    pdf_version: pdfVersion,
    tagged,
  });
}

function splitExtractedPages(bytes, label) {
  const text = bytes.toString("utf8");
  if (!text.endsWith("\f")) fail(`${label} lost its final page delimiter`);
  return text.slice(0, -1).split("\f").map((page) => (
    page.normalize("NFC").replaceAll("\r\n", "\n")
  ));
}

function locateAnchor(pages, anchor, label) {
  const matches = [];
  for (const [index, page] of pages.entries()) {
    let cursor = 0;
    for (;;) {
      const match = page.indexOf(anchor, cursor);
      if (match < 0) break;
      matches.push(index + 1);
      cursor = match + anchor.length;
    }
  }
  if (matches.length !== 1) {
    fail(`${label} anchor must locate exactly one page; received [${matches.join(", ")}]`);
  }
  return matches[0];
}

function assertOrderedFragments(text, fragments, label) {
  let cursor = 0;
  for (const fragment of fragments) {
    const index = text.indexOf(fragment, cursor);
    if (index < 0) fail(`${label} lost or reordered fragment: ${fragment}`);
    cursor = index + fragment.length;
  }
}

function evaluateSentinels(baseline, captures) {
  const defaultPages = splitExtractedPages(captures.default_text.stdout, "pdftotext default output");
  const rawPages = splitExtractedPages(captures.raw_text.stdout, "pdftotext raw output");
  if (defaultPages.length !== baseline.artifact.pages || rawPages.length !== baseline.artifact.pages) {
    fail(`semantic extraction page count changed: expected ${baseline.artifact.pages}, received default=${defaultPages.length}, raw=${rawPages.length}`);
  }
  const structureText = normalizeText(captures.structure_text.stdout.toString("utf8"));
  return baseline.sentinels.map((sentinel) => {
    const page = locateAnchor(defaultPages, sentinel.default_anchor, sentinel.id);
    if (page !== sentinel.recorded_page) {
      fail(`${sentinel.id} moved from recorded page ${sentinel.recorded_page} to ${page}`);
    }
    assertOrderedFragments(
      normalizeText(defaultPages[page - 1]),
      sentinel.default_fragments,
      `${sentinel.id} default extraction`,
    );
    assertOrderedFragments(structureText, sentinel.struct_text_fragments, `${sentinel.id} structure-text extraction`);
    assertOrderedFragments(rawPages[page - 1], sentinel.raw_fragments, `${sentinel.id} raw extraction`);
    return Object.freeze({
      class: sentinel.class,
      defect: sentinel.defect,
      id: sentinel.id,
      page,
      state: sentinel.state,
    });
  });
}

function assertArtifactIdentity(baseline, pdfBytes, manifestBytes) {
  const manifest = parseStrictJson(manifestBytes, {
    label: "book PDF manifest",
    maximumDepth: 10,
    maximumContainerEntries: 512,
  });
  const inspected = assertBookPdfBytesIntegrity(pdfBytes, manifest);
  const expected = baseline.artifact;
  const comparisons = [
    [inspected.pdf_sha256, expected.pdf_sha256, "PDF SHA-256"],
    [inspected.size_bytes, expected.size_bytes, "PDF byte size"],
    [sha256(manifestBytes), expected.manifest_sha256, "manifest SHA-256"],
    [manifest.pdf, expected.pdf, "manifest PDF path"],
    [manifest.source_ref, expected.source_ref, "manifest source ref"],
    [manifest.source_digest, expected.source_digest, "manifest source digest"],
    [manifest.version, expected.version, "manifest version"],
  ];
  for (const [actual, wanted, label] of comparisons) {
    if (actual !== wanted) fail(`${label} changed: expected ${wanted}, received ${actual}`);
  }
  return inspected;
}

export function assertBookPdfSemanticArtifactIdentity({
  baseline,
  manifestBytes,
  pdfBytes,
} = {}) {
  validateBookPdfSemanticBaseline(baseline);
  if (!Buffer.isBuffer(pdfBytes) || !Buffer.isBuffer(manifestBytes)) {
    fail("semantic audit requires PDF and manifest Buffer inputs");
  }
  return assertArtifactIdentity(baseline, pdfBytes, manifestBytes);
}

function assertToolIdentities(baseline, toolIdentities) {
  assertClosedObject(toolIdentities, ["pdfinfo", "pdftotext"], "semantic tool identities");
  for (const name of ["pdfinfo", "pdftotext"]) {
    if (toolIdentities[name] !== baseline.tools[name].version) {
      fail(`${name} version changed: expected ${baseline.tools[name].version}, received ${toolIdentities[name]}`);
    }
  }
}

function assertCaptureStatusAndDiagnostics(baseline, captures) {
  assertClosedObject(captures, CAPTURE_NAMES, "semantic captures");
  for (const name of CAPTURE_NAMES) {
    const capture = captures[name];
    summarizeBookPdfSemanticCapture(capture);
    if (capture.signal !== null) fail(`${name} ended with signal ${capture.signal}`);
    if (capture.status !== baseline.outputs[name].exit_status) {
      fail(`${name} exit status changed: expected ${baseline.outputs[name].exit_status}, received ${capture.status}`);
    }
  }
  assertDiagnosticCounts(captures.structure.stderr, baseline.diagnostics.structure, "pdfinfo -struct");
  assertDiagnosticCounts(
    captures.structure_text.stderr,
    baseline.diagnostics.structure_text,
    "pdfinfo -struct-text",
  );
  if (captures.default_text.stderr.length > 0) fail("pdftotext default emitted an unexplained diagnostic");
  if (captures.raw_text.stderr.length > 0) fail("pdftotext raw emitted an unexplained diagnostic");
  if (captures.metadata.stderr.length > 0) fail("pdfinfo metadata emitted an unexplained diagnostic");
}

function assertExactCaptureIdentities(baseline, captures) {
  for (const name of CAPTURE_NAMES) {
    const actual = summarizeBookPdfSemanticCapture(captures[name]);
    const expected = baseline.outputs[name];
    for (const stream of ["stdout", "stderr"]) {
      if (
        actual[stream].bytes !== expected[stream].bytes
        || actual[stream].sha256 !== expected[stream].sha256
      ) fail(`${name} ${stream} identity changed`);
    }
  }
}

export function auditBookPdfSemanticCaptures({
  baseline,
  captures,
  manifestBytes,
  pdfBytes,
  toolIdentities,
} = {}) {
  const artifact = assertBookPdfSemanticArtifactIdentity({ baseline, manifestBytes, pdfBytes });
  assertToolIdentities(baseline, toolIdentities);
  assertCaptureStatusAndDiagnostics(baseline, captures);
  const metadata = parsePdfInfoMetadata(captures.metadata.stdout);
  const metadataComparisons = [
    [metadata.pages, baseline.artifact.pages, "pdfinfo page count"],
    [metadata.page_size_name, baseline.artifact.page_size_name, "pdfinfo page size name"],
    [metadata.page_size_points.width, baseline.artifact.page_size_points.width, "pdfinfo page width"],
    [metadata.page_size_points.height, baseline.artifact.page_size_points.height, "pdfinfo page height"],
    [metadata.pdf_version, baseline.artifact.pdf_version, "pdfinfo PDF version"],
    [metadata.tagged, baseline.artifact.tagged, "pdfinfo tag state"],
  ];
  for (const [actual, wanted, label] of metadataComparisons) {
    if (actual !== wanted) fail(`${label} changed: expected ${wanted}, received ${actual}`);
  }
  const sentinels = evaluateSentinels(baseline, captures);
  assertExactCaptureIdentities(baseline, captures);
  const outputIdentities = Object.fromEntries(CAPTURE_NAMES.map((name) => [
    name,
    summarizeBookPdfSemanticCapture(captures[name]),
  ]));
  const passed = baseline.expected_outcome === "clean";
  return Object.freeze({
    artifact: Object.freeze({
      manifest_sha256: baseline.artifact.manifest_sha256,
      page_size_name: metadata.page_size_name,
      page_size_points: metadata.page_size_points,
      pages: baseline.artifact.pages,
      pdf_sha256: artifact.pdf_sha256,
      pdf_version: metadata.pdf_version,
      size_bytes: artifact.size_bytes,
      source_digest: baseline.artifact.source_digest,
      source_ref: baseline.artifact.source_ref,
      tagged: metadata.tagged,
    }),
    claim_boundary: BOOK_PDF_SEMANTIC_CLAIM_BOUNDARY,
    commands: Object.freeze({
      default_text: Object.freeze(["pdftotext", baseline.artifact.pdf, "-"]),
      metadata: Object.freeze(["pdfinfo", baseline.artifact.pdf]),
      raw_text: Object.freeze(["pdftotext", "-raw", baseline.artifact.pdf, "-"]),
      structure: Object.freeze(["pdfinfo", "-struct", baseline.artifact.pdf]),
      structure_text: Object.freeze(["pdfinfo", "-struct-text", baseline.artifact.pdf]),
    }),
    diagnostics: Object.freeze({
      structure: Object.freeze(baseline.diagnostics.structure.map((entry) => Object.freeze({ ...entry }))),
      structure_text: Object.freeze(
        baseline.diagnostics.structure_text.map((entry) => Object.freeze({ ...entry })),
      ),
    }),
    expected_outcome: baseline.expected_outcome,
    outputs: Object.freeze(outputIdentities),
    passed,
    sentinels: Object.freeze(sentinels),
    tools: Object.freeze({ ...toolIdentities }),
  });
}

function sameFileIdentity(left, right) {
  return left.dev === right.dev && left.ino === right.ino;
}

async function inspectEvidenceRoot(root) {
  const absolute = path.resolve(root);
  const missing = [];
  let existing = absolute;
  for (;;) {
    try {
      await lstat(existing);
      break;
    } catch (error) {
      if (error?.code !== "ENOENT") throw error;
      const parent = path.dirname(existing);
      if (parent === existing) throw error;
      missing.unshift(existing);
      existing = parent;
    }
  }
  let parentInformation = await lstat(existing, { bigint: true });
  if (
    parentInformation.isSymbolicLink()
    || !parentInformation.isDirectory()
    || path.resolve(await realpath(existing)) !== path.resolve(existing)
  ) fail("semantic evidence root has a linked or non-canonical ancestor");
  for (const directory of missing) {
    const currentParent = await lstat(existing, { bigint: true });
    if (!sameFileIdentity(parentInformation, currentParent)) {
      fail("semantic evidence root ancestor changed identity during creation");
    }
    await mkdir(directory, { mode: 0o700 });
    const information = await lstat(directory, { bigint: true });
    if (
      information.isSymbolicLink()
      || !information.isDirectory()
      || path.resolve(await realpath(directory)) !== path.resolve(directory)
    ) fail("semantic evidence root creation produced a linked or non-canonical directory");
    existing = directory;
    parentInformation = information;
  }
  const information = await lstat(absolute, { bigint: true });
  const resolved = await realpath(absolute);
  if (
    information.isSymbolicLink()
    || !information.isDirectory()
    || path.resolve(resolved) !== absolute
  ) fail("semantic evidence root is linked or not canonical");
  return Object.freeze({ absolute, information });
}

async function assertEvidenceRootUnchanged(root) {
  const information = await lstat(root.absolute, { bigint: true });
  const resolved = await realpath(root.absolute);
  if (
    information.isSymbolicLink()
    || !information.isDirectory()
    || !sameFileIdentity(root.information, information)
    || path.resolve(resolved) !== root.absolute
  ) fail("semantic evidence root changed identity during publication");
}

async function assertDestinationAbsent(directory) {
  try {
    await lstat(directory);
  } catch (error) {
    if (error?.code === "ENOENT") return;
    throw error;
  }
  fail("semantic evidence directory already exists");
}

export async function writeBookPdfSemanticEvidence({
  captures,
  directory,
  evidenceRoot,
  failure,
  report,
} = {}) {
  assertString(directory, "semantic evidence directory");
  assertString(evidenceRoot, "semantic evidence root");
  assertClosedObject(captures, CAPTURE_NAMES, "semantic captures");
  CAPTURE_NAMES.forEach((name) => summarizeBookPdfSemanticCapture(captures[name]));
  if ((report === undefined) === (failure === undefined)) {
    fail("semantic evidence requires exactly one validated report or failure envelope");
  }
  const root = await inspectEvidenceRoot(evidenceRoot);
  const destination = path.resolve(directory);
  if (path.dirname(destination) !== root.absolute) {
    fail("semantic evidence directory must be a direct child of its evidence root");
  }
  if (path.basename(destination).startsWith(".semantic-stage-")) {
    fail("semantic evidence directory uses a reserved staging prefix");
  }
  await assertDestinationAbsent(destination);
  const staging = await mkdtemp(path.join(root.absolute, ".semantic-stage-"));
  try {
    for (const name of CAPTURE_NAMES) {
      const files = EVIDENCE_FILE_NAMES[name];
      await writeFile(path.join(staging, files.stdout), captures[name].stdout, { flag: "wx" });
      await writeFile(path.join(staging, files.stderr), captures[name].stderr, { flag: "wx" });
    }
    const document = report ?? failure;
    const documentName = report === undefined
      ? "semantic-audit-error.json"
      : "semantic-audit-report.json";
    await writeFile(
      path.join(staging, documentName),
      `${JSON.stringify(document, null, 2)}\n`,
      { encoding: "utf8", flag: "wx" },
    );
    await assertEvidenceRootUnchanged(root);
    await assertDestinationAbsent(destination);
    await rename(staging, destination);
  } finally {
    await rm(staging, { recursive: true, force: true });
  }
}
