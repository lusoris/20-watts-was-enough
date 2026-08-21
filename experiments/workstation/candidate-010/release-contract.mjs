import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";
import {
  assertDisjointSeedPacks,
  inspectSeedCommitment,
  revealSeedPack,
} from "./seeds/seed-pack.mjs";
import { computeSourceBundle } from "./source-bundle.mjs";

export const RELEASE_CONTRACT_VERSION = "candidate-010.frozen-seed-release.v1";

const BINDING_NAMES = Object.freeze([
  "source_bundle",
  "config",
  "design",
  "backend_registry",
  "preregistration",
  "commitment",
  "reveal",
]);

function sha256(value) {
  return createHash("sha256").update(value).digest("hex");
}

function canonical(value) {
  if (value === null || typeof value === "boolean" || typeof value === "string") {
    return JSON.stringify(value);
  }
  if (typeof value === "number") {
    if (!Number.isFinite(value)) throw new TypeError("Release canonicalization rejects non-finite numbers.");
    return JSON.stringify(value);
  }
  if (Array.isArray(value)) return `[${value.map(canonical).join(",")}]`;
  if (value && typeof value === "object") {
    return `{${Object.keys(value).sort().map((key) => {
      if (value[key] === undefined) throw new TypeError(`Release canonicalization rejects undefined at ${key}.`);
      return `${JSON.stringify(key)}:${canonical(value[key])}`;
    }).join(",")}}`;
  }
  throw new TypeError(`Release canonicalization rejects ${typeof value}.`);
}

function normalizeRelativePath(value) {
  if (typeof value !== "string" || value.length === 0) throw new Error("Release binding paths must be non-empty strings.");
  const normalized = value.replaceAll("\\", "/");
  if (
    path.isAbsolute(value)
    || normalized === ".."
    || normalized.startsWith("../")
    || normalized.includes("/../")
  ) {
    throw new Error(`Release binding path escapes its root: ${value}`);
  }
  return normalized;
}

function boundPath(root, relative) {
  const resolvedRoot = path.resolve(root);
  const resolved = path.resolve(resolvedRoot, ...normalizeRelativePath(relative).split("/"));
  const relation = path.relative(resolvedRoot, resolved);
  if (relation === "" || relation === ".." || relation.startsWith(`..${path.sep}`) || path.isAbsolute(relation)) {
    throw new Error(`Release binding path escapes its root: ${relative}`);
  }
  return resolved;
}

async function readBinding(root, binding, name) {
  if (
    !binding
    || typeof binding.path !== "string"
    || !/^[0-9a-f]{64}$/.test(binding.sha256 ?? "")
  ) {
    throw new Error(`Invalid ${name} release binding.`);
  }
  const file = boundPath(root, binding.path);
  const body = await readFile(file);
  if (sha256(body) !== binding.sha256) throw new Error(`Bound ${name} file hash mismatch.`);
  return { file, body };
}

async function createBinding(root, relative) {
  const normalized = normalizeRelativePath(relative);
  const body = await readFile(boundPath(root, normalized));
  return Object.freeze({ path: normalized, sha256: sha256(body) });
}

function validatePartition(partition, phase) {
  if (!new Set(["confirmation", "held-out"]).has(partition)) {
    throw new Error(`Unsupported frozen release partition: ${partition}`);
  }
  if (phase !== partition) {
    throw new Error(`Frozen release partition ${partition} requires phase ${partition}.`);
  }
}

async function validateFullSourceBundle(root, sourceBinding) {
  const { body } = await readBinding(root, sourceBinding, "source_bundle");
  let document;
  try {
    document = JSON.parse(body);
  } catch (error) {
    throw new Error(`Bound source bundle is invalid JSON: ${error.message}`);
  }
  if (
    document?.schema !== 1
    || !/^[0-9a-f]{64}$/.test(document.source_sha256 ?? "")
    || !/^[0-9a-f]{40}$/.test(document.vcs?.source_commit ?? "")
    || !Array.isArray(document.files)
    || document.files.length === 0
  ) {
    throw new Error("Bound source bundle has an invalid identity.");
  }
  const recomputed = await computeSourceBundle({
    root,
    sourceFiles: document.files.map((entry) => entry.path),
    vcs: document.vcs,
  });
  if (
    recomputed.source_sha256 !== document.source_sha256
    || canonical(recomputed.files) !== canonical(document.files)
  ) {
    throw new Error("Full source bundle does not match the bound executable sources.");
  }
  return document;
}

function releaseDigest(document) {
  const { release_sha256: ignored, ...body } = document;
  void ignored;
  return sha256(canonical(body));
}

function validateReleaseDocument(document) {
  if (
    document?.schema !== 1
    || document.contract_version !== RELEASE_CONTRACT_VERSION
    || document.state !== "sealed-release"
    || !Number.isSafeInteger(document.release_version)
    || document.release_version < 1
    || !/^[0-9a-f]{64}$/.test(document.release_sha256 ?? "")
    || document.release_sha256 !== releaseDigest(document)
  ) {
    throw new Error("Invalid or corrupted frozen release contract.");
  }
  validatePartition(document.partition, document.phase);
  for (const name of BINDING_NAMES) {
    if (!document.bindings?.[name]) throw new Error(`Frozen release is missing binding ${name}.`);
  }
  if (
    !/^[0-9a-f]{64}$/.test(document.source_identity?.source_sha256 ?? "")
    || !/^[0-9a-f]{40}$/.test(document.source_identity?.source_commit ?? "")
    || document.seed_pack?.algorithm !== "sha256-json-array-v1"
    || !Number.isSafeInteger(document.seed_pack?.seed_count)
    || document.seed_pack.seed_count < 1
    || !/^[0-9a-f]{64}$/.test(document.seed_pack?.commitment ?? "")
  ) {
    throw new Error("Frozen release identity metadata are invalid.");
  }
  return document;
}

/**
 * Build the sealed metadata document. Building validates the reveal, but does
 * not mark it frozen for execution; only openFrozenSeedRelease may do that.
 */
export async function createFrozenSeedReleaseContract({
  root,
  releaseVersion,
  partition,
  phase,
  sourceBundlePath,
  configPath,
  designPath,
  backendRegistryPath,
  preregistrationPath,
  commitmentPath,
  revealPath,
}) {
  if (!Number.isSafeInteger(releaseVersion) || releaseVersion < 1) {
    throw new Error("Frozen release version must be a positive integer.");
  }
  validatePartition(partition, phase);
  const paths = {
    source_bundle: sourceBundlePath,
    config: configPath,
    design: designPath,
    backend_registry: backendRegistryPath,
    preregistration: preregistrationPath,
    commitment: commitmentPath,
    reveal: revealPath,
  };
  const bindings = Object.fromEntries(await Promise.all(BINDING_NAMES.map(async (name) => (
    [name, await createBinding(root, paths[name])]
  ))));
  const sourceBundle = await validateFullSourceBundle(root, bindings.source_bundle);
  const commitment = await inspectSeedCommitment(boundPath(root, bindings.commitment.path));
  const reveal = await revealSeedPack({
    commitmentPath: boundPath(root, bindings.commitment.path),
    revealPath: boundPath(root, bindings.reveal.path),
    phase,
  });
  if (commitment.partition !== partition || reveal.partition !== partition) {
    throw new Error("Release partition does not match its seed pack.");
  }
  const body = {
    schema: 1,
    contract_version: RELEASE_CONTRACT_VERSION,
    state: "sealed-release",
    release_version: releaseVersion,
    partition,
    phase,
    source_identity: {
      source_sha256: sourceBundle.source_sha256,
      source_commit: sourceBundle.vcs.source_commit,
    },
    seed_pack: {
      algorithm: commitment.algorithm,
      seed_count: commitment.seed_count,
      commitment: commitment.commitment,
    },
    bindings,
  };
  return Object.freeze({ ...body, release_sha256: sha256(canonical(body)) });
}

/**
 * Open a release for execution. The `frozen_release` capability is created only
 * after every bound byte, source file, seed commitment, phase and disjointness
 * check succeeds.
 */
export async function openFrozenSeedRelease({
  root,
  releasePath,
  expectedPartition,
  phase,
  disjointWith,
}) {
  if (!Array.isArray(disjointWith)) {
    throw new Error("Opening a frozen release requires an explicit disjointWith seed-pack array.");
  }
  const release = validateReleaseDocument(JSON.parse(await readFile(releasePath, "utf8")));
  if (release.partition !== expectedPartition || release.phase !== phase || expectedPartition !== phase) {
    throw new Error(`Frozen release may only open for exact partition and phase ${release.partition}.`);
  }
  const resolvedBindings = {};
  for (const name of BINDING_NAMES) {
    resolvedBindings[name] = await readBinding(root, release.bindings[name], name);
  }
  const sourceBundle = await validateFullSourceBundle(root, release.bindings.source_bundle);
  if (
    sourceBundle.source_sha256 !== release.source_identity.source_sha256
    || sourceBundle.vcs.source_commit !== release.source_identity.source_commit
  ) {
    throw new Error("Release source identity does not match its full source bundle.");
  }
  const commitment = await inspectSeedCommitment(resolvedBindings.commitment.file);
  const reveal = await revealSeedPack({
    commitmentPath: resolvedBindings.commitment.file,
    revealPath: resolvedBindings.reveal.file,
    phase,
  });
  if (
    commitment.partition !== release.partition
    || reveal.partition !== release.partition
    || commitment.algorithm !== release.seed_pack.algorithm
    || commitment.seed_count !== release.seed_pack.seed_count
    || commitment.commitment !== release.seed_pack.commitment
    || reveal.commitment !== release.seed_pack.commitment
  ) {
    throw new Error("Opened seed pack does not match the frozen release metadata.");
  }
  const partitions = new Set([release.partition]);
  for (const pack of disjointWith) {
    if (!pack || typeof pack.partition !== "string" || partitions.has(pack.partition)) {
      throw new Error("Disjointness inputs require distinct named seed partitions.");
    }
    partitions.add(pack.partition);
  }
  assertDisjointSeedPacks([reveal, ...disjointWith]);
  return Object.freeze({
    schema: 1,
    contract_version: release.contract_version,
    release_version: release.release_version,
    release_sha256: release.release_sha256,
    partition: release.partition,
    phase: release.phase,
    source_identity: Object.freeze({ ...release.source_identity }),
    seed_pack: Object.freeze({ ...release.seed_pack }),
    seeds: reveal.seeds,
    frozen_release: true,
  });
}
