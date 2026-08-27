import { createHash } from "node:crypto";
import { link, mkdir, open, readFile, rm } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const FIXTURE_ROOT = path.dirname(fileURLToPath(import.meta.url));
const SOURCE_PATH = path.join(
  FIXTURE_ROOT,
  "rsd-t02-fixed-instance-conformance-policy.source.js",
);
const DEFAULT_OUTPUT_DIRECTORY = path.join(FIXTURE_ROOT, "policy-bundles");
const MAX_BUNDLE_BYTES = 262144;

function sha256(bytes) {
  return createHash("sha256").update(bytes).digest("hex");
}

function assertCanonicalSource(sourceBytes) {
  const source = new TextDecoder("utf-8", { fatal: true }).decode(sourceBytes);
  if (
    sourceBytes.length < 1
    || sourceBytes.length > MAX_BUNDLE_BYTES
    || source.charCodeAt(0) === 0xfeff
    || source.includes("\r")
    || !source.endsWith("\n")
    || /^\s*(?:import|export)(?:\s|\{)/mu.test(source)
    || /\bimport\s*\(/u.test(source)
  ) throw new Error("Fixed-instance policy source is not canonical self-contained JavaScript.");
}

async function sourceIdentity() {
  const sourceBytes = await readFile(SOURCE_PATH);
  assertCanonicalSource(sourceBytes);
  const sourceSha256 = sha256(sourceBytes);
  return Object.freeze({
    sourceBytes,
    sourceSha256,
    sourceUtf8Bytes: sourceBytes.length,
    artifactFilename: `${sourceSha256}.js`,
  });
}

async function assertExactArtifact(artifactPath, identity) {
  const artifactBytes = await readFile(artifactPath);
  if (
    artifactBytes.length !== identity.sourceBytes.length
    || sha256(artifactBytes) !== identity.sourceSha256
    || !artifactBytes.equals(identity.sourceBytes)
  ) throw new Error("Fixed-instance policy artifact differs from its content address.");
}

async function installExactArtifact(artifactPath, outputDirectory, identity) {
  await mkdir(outputDirectory, { recursive: true });
  try {
    await assertExactArtifact(artifactPath, identity);
    return "present";
  } catch (error) {
    if (error?.code !== "ENOENT") throw error;
  }
  const temporaryPath = path.join(
    outputDirectory,
    `.${identity.sourceSha256}.${process.pid}.tmp`,
  );
  let temporaryHandle;
  try {
    temporaryHandle = await open(temporaryPath, "wx", 0o444);
    await temporaryHandle.writeFile(identity.sourceBytes);
    await temporaryHandle.sync();
    await temporaryHandle.close();
    temporaryHandle = undefined;
    try {
      await link(temporaryPath, artifactPath);
    } catch (error) {
      if (error?.code !== "EEXIST") throw error;
      await assertExactArtifact(artifactPath, identity);
      return "present";
    }
    await assertExactArtifact(artifactPath, identity);
    return "written";
  } finally {
    await temporaryHandle?.close();
    await rm(temporaryPath, { force: true });
  }
}

export async function readFixture026RsdT02FixedInstancePolicyIdentity() {
  const identity = await sourceIdentity();
  return Object.freeze({
    source_path: SOURCE_PATH,
    source_sha256: identity.sourceSha256,
    source_utf8_bytes: identity.sourceUtf8Bytes,
    artifact_filename: identity.artifactFilename,
  });
}

export async function buildFixture026RsdT02FixedInstancePolicy({
  mode,
  outputDirectory = DEFAULT_OUTPUT_DIRECTORY,
} = {}) {
  if (!new Set(["check", "write"]).has(mode)) {
    throw new Error("Fixed-instance policy build requires explicit check or write mode.");
  }
  if (typeof outputDirectory !== "string" || outputDirectory.length < 1) {
    throw new TypeError("Fixed-instance policy output directory is invalid.");
  }
  const identity = await sourceIdentity();
  const resolvedOutputDirectory = path.resolve(outputDirectory);
  const artifactPath = path.join(resolvedOutputDirectory, identity.artifactFilename);
  let status;
  if (mode === "check") {
    await assertExactArtifact(artifactPath, identity);
    status = "verified";
  } else {
    status = await installExactArtifact(artifactPath, resolvedOutputDirectory, identity);
  }
  return Object.freeze({
    schema: 1,
    contract_version: "fixture-026.rsd-t02-fixed-instance-policy-build.v1",
    mode,
    status,
    source_sha256: identity.sourceSha256,
    source_utf8_bytes: identity.sourceUtf8Bytes,
    artifact_filename: identity.artifactFilename,
    artifact_path: artifactPath,
    authority: "public-development-fixed-instance-conformance-only",
    comparison_inference_permitted: false,
    claim_eligible: false,
    result_label: "NO_RESULT",
    no_result: true,
  });
}

const isMain = process.argv[1]
  && pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url;
if (isMain) {
  try {
    const mode = process.argv[2] === "--write"
      ? "write"
      : process.argv[2] === "--check" ? "check" : null;
    if (mode === null || process.argv.length !== 3) {
      throw new Error(
        "Usage: node build-rsd-t02-fixed-instance-conformance-policy.mjs (--check|--write)",
      );
    }
    const result = await buildFixture026RsdT02FixedInstancePolicy({ mode });
    process.stdout.write(`${JSON.stringify(result)}\n`);
  } catch (error) {
    process.stderr.write(`${error.message}\n`);
    process.exitCode = 1;
  }
}
