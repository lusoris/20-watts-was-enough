import { createHash } from "node:crypto";
import {
  link,
  mkdir,
  open,
  readFile,
  rm,
} from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const FIXTURE_DIRECTORY = path.dirname(fileURLToPath(import.meta.url));
const SOURCE_PATH = path.join(FIXTURE_DIRECTORY, "rsd-t02-policy-bundle.source.js");
const DEFAULT_OUTPUT_DIRECTORY = path.join(FIXTURE_DIRECTORY, "policy-bundles");
const MAX_BUNDLE_BYTES = 262144;

function sha256(bytes) {
  return createHash("sha256").update(bytes).digest("hex");
}

function canonical(value) {
  if (value === null || typeof value === "boolean" || typeof value === "string") {
    return JSON.stringify(value);
  }
  if (typeof value === "number" && Number.isFinite(value)) return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(canonical).join(",")}]`;
  if (value && typeof value === "object") {
    return `{${Object.keys(value).sort().map((key) => (
      `${JSON.stringify(key)}:${canonical(value[key])}`
    )).join(",")}}`;
  }
  throw new TypeError(`Cannot canonically encode ${typeof value}.`);
}

function assertCanonicalSource(sourceBytes) {
  if (sourceBytes.length < 1 || sourceBytes.length > MAX_BUNDLE_BYTES) {
    throw new RangeError("RSD-T02 policy bundle source exceeds its closed byte bound.");
  }
  const source = new TextDecoder("utf-8", { fatal: true }).decode(sourceBytes);
  if (
    source.charCodeAt(0) === 0xfeff
    || source.includes("\r")
    || !source.endsWith("\n")
    || /^\s*(?:import|export)(?:\s|\{)/mu.test(source)
    || /\bimport\s*\(/u.test(source)
  ) throw new Error("RSD-T02 policy bundle source is not canonical self-contained JavaScript.");
  return source;
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
  ) throw new Error("RSD-T02 policy bundle artifact does not exactly match its source hash.");
}

async function syncDirectory(directory) {
  let handle;
  try {
    handle = await open(directory, "r");
    await handle.sync();
  } catch (error) {
    if (process.platform !== "win32") throw error;
  } finally {
    await handle?.close();
  }
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
    await syncDirectory(outputDirectory);
    await assertExactArtifact(artifactPath, identity);
    return "written";
  } finally {
    await temporaryHandle?.close();
    await rm(temporaryPath, { force: true });
  }
}

export async function readFixture026RsdT02PolicyBundleIdentity() {
  const identity = await sourceIdentity();
  return Object.freeze({
    source_path: SOURCE_PATH,
    source_sha256: identity.sourceSha256,
    source_utf8_bytes: identity.sourceUtf8Bytes,
    artifact_filename: identity.artifactFilename,
  });
}

export async function buildFixture026RsdT02PolicyBundle({
  mode,
  outputDirectory = DEFAULT_OUTPUT_DIRECTORY,
} = {}) {
  if (!new Set(["check", "write"]).has(mode)) {
    throw new Error("RSD-T02 policy bundle construction requires explicit check or write mode.");
  }
  if (typeof outputDirectory !== "string" || outputDirectory.length < 1) {
    throw new TypeError("RSD-T02 policy bundle output directory is invalid.");
  }
  const resolvedOutputDirectory = path.resolve(outputDirectory);
  const identity = await sourceIdentity();
  const artifactPath = path.join(resolvedOutputDirectory, identity.artifactFilename);
  let status;
  if (mode === "check") {
    await assertExactArtifact(artifactPath, identity);
    status = "verified";
  } else {
    status = await installExactArtifact(
      artifactPath,
      resolvedOutputDirectory,
      identity,
    );
  }
  return Object.freeze({
    schema: 1,
    contract_version: "fixture-026.rsd-t02-policy-bundle-build.v1",
    mode,
    status,
    source_sha256: identity.sourceSha256,
    source_utf8_bytes: identity.sourceUtf8Bytes,
    artifact_filename: identity.artifactFilename,
    artifact_path: artifactPath,
  });
}

function parseArguments(argv) {
  if (
    !["--check", "--write"].includes(argv[0])
    || ![1, 3].includes(argv.length)
    || (argv.length === 3 && argv[1] !== "--output-directory")
  ) {
    throw new Error(
      "Usage: node build-rsd-t02-policy-bundle.mjs (--check|--write) "
      + "[--output-directory PATH]",
    );
  }
  return {
    mode: argv[0].slice(2),
    outputDirectory: argv.length === 3 ? argv[2] : DEFAULT_OUTPUT_DIRECTORY,
  };
}

const isMain = process.argv[1]
  && pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url;
if (isMain) {
  try {
    const result = await buildFixture026RsdT02PolicyBundle(parseArguments(process.argv.slice(2)));
    process.stdout.write(`${canonical(result)}\n`);
  } catch (error) {
    process.stderr.write(`${error.message}\n`);
    process.exitCode = 1;
  }
}
