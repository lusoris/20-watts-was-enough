import {
  lstat,
  realpath,
} from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import { canonicalize } from "./checkpoint.mjs";
import { verifyExecutionCapsule } from "./execution-capsule.mjs";
import { verifyCandidate010SourceBundleAtRoot } from "./source-bundle.mjs";

export const CAPSULE_EXECUTION_AUTHORITY_VERSION = "candidate-010.capsule-execution-authority.v1";
export const CAPSULE_EXECUTION_AUTHORITY_LIMITS = Object.freeze({
  confirmation_claim_eligible: false,
  release_authority: false,
  operating_system_isolation: false,
  malicious_host_toctou_closed: false,
  scope: "Ephemeral in-process eligibility to enter a later execution path after exact capsule and source verification.",
});

const MODULE_RELATIVE_PATH = "experiments/workstation/candidate-010/capsule-execution-authority.mjs";
const SOURCE_CAPSULE_PREFIX = "candidate-010-capsule-";
const OUTER_CAPSULE_PREFIX = "candidate-010-execution-capsule-";
const OWNER_FILE = ".candidate-010-execution-capsule-owner.json";
const activeCapabilities = new WeakSet();
const capabilityBindings = new WeakMap();

export class CapsuleExecutionAuthorityError extends Error {
  constructor(code, message, options = {}) {
    super(message, options);
    this.name = "CapsuleExecutionAuthorityError";
    this.code = `CANDIDATE_010_CAPSULE_EXECUTION_AUTHORITY_${code}`;
  }
}

function refuse(code, message, cause = undefined) {
  throw new CapsuleExecutionAuthorityError(code, message, cause ? { cause } : {});
}

function normalizedAbsolute(value) {
  const absolute = path.resolve(value);
  return process.platform === "win32" ? absolute.toLowerCase() : absolute;
}

function samePath(left, right) {
  return normalizedAbsolute(left) === normalizedAbsolute(right);
}

async function regularRealFile(value, label) {
  const absolute = path.resolve(value);
  let information;
  try {
    information = await lstat(absolute);
  } catch (error) {
    refuse("MODULE_LOCATION", `${label} is unavailable: ${error.message}`, error);
  }
  if (information.isSymbolicLink() || !information.isFile()) {
    refuse("MODULE_LOCATION", `${label} must be a real regular file, not a symlink or reparse point.`);
  }
  const resolved = await realpath(absolute);
  if (!samePath(absolute, resolved)) {
    refuse("MODULE_LOCATION", `${label} resolves through a symlink or reparse point.`);
  }
  return resolved;
}

async function regularRealDirectory(value, label) {
  const absolute = path.resolve(value);
  let information;
  try {
    information = await lstat(absolute);
  } catch (error) {
    refuse("MODULE_LOCATION", `${label} is unavailable: ${error.message}`, error);
  }
  if (information.isSymbolicLink() || !information.isDirectory()) {
    refuse("MODULE_LOCATION", `${label} must be a real directory, not a symlink or reparse point.`);
  }
  const resolved = await realpath(absolute);
  if (!samePath(absolute, resolved)) {
    refuse("MODULE_LOCATION", `${label} resolves through a symlink or reparse point.`);
  }
  return resolved;
}

async function locateMaterializedModule() {
  const moduleFile = await regularRealFile(fileURLToPath(import.meta.url), "authority module");
  const suffix = MODULE_RELATIVE_PATH.split("/");
  const expectedSuffix = path.join(...suffix);
  if (!normalizedAbsolute(moduleFile).endsWith(normalizedAbsolute(path.join(path.parse(moduleFile).root, expectedSuffix)).slice(
    normalizedAbsolute(path.parse(moduleFile).root).length,
  ))) {
    refuse("MODULE_LOCATION", "Authority module is not at its fixed Candidate 010 repository-relative path.");
  }
  const sourceRoot = path.resolve(path.dirname(moduleFile), "..", "..", "..");
  const canonicalSourceRoot = await regularRealDirectory(sourceRoot, "materialized source root");
  if (!samePath(moduleFile, path.join(canonicalSourceRoot, ...suffix))) {
    refuse("MODULE_LOCATION", "Authority module path does not resolve exactly inside its inferred source root.");
  }
  if (!path.basename(canonicalSourceRoot).startsWith(SOURCE_CAPSULE_PREFIX)) {
    refuse("WORKTREE_IMPORT", "Authority module refuses import from a worktree or non-generated source root.");
  }
  const sourceParent = await regularRealDirectory(path.dirname(canonicalSourceRoot), "source capsule parent");
  if (path.basename(sourceParent) !== "source") {
    refuse("WORKTREE_IMPORT", "Authority module is not nested in an execution capsule source role.");
  }
  const outerRoot = await regularRealDirectory(path.dirname(sourceParent), "outer execution capsule root");
  if (!path.basename(outerRoot).startsWith(OUTER_CAPSULE_PREFIX)) {
    refuse("WORKTREE_IMPORT", "Authority module is not nested in a generated outer execution capsule.");
  }
  await regularRealFile(path.join(outerRoot, OWNER_FILE), "execution capsule ownership marker");
  await regularRealDirectory(path.join(outerRoot, "node_modules"), "capsule-local node_modules");
  return Object.freeze({ module_file: moduleFile, source_root: canonicalSourceRoot, outer_root: outerRoot });
}

// Evaluation itself fails closed outside the generated execution-capsule layout.
const MODULE_LOCATION = await locateMaterializedModule();

function assertExactInput(input) {
  if (
    !input
    || typeof input !== "object"
    || Array.isArray(input)
    || canonicalize(Object.keys(input).sort()) !== canonicalize(["executionCapsule", "expectedSourceBundle"].sort())
    || !input.executionCapsule
    || !input.expectedSourceBundle
  ) refuse("INPUT", "Authority input must contain exactly executionCapsule and expectedSourceBundle.");
  return input;
}

function flattenedRuntimeDependencyFiles(runtimeIdentity) {
  const rows = [];
  for (const dependency of runtimeIdentity?.external_production_dependencies ?? []) {
    for (const file of dependency.files ?? []) {
      rows.push({
        path: `${dependency.package_root}/${file.path}`,
        bytes: file.bytes,
        sha256: file.sha256,
      });
    }
  }
  return rows.sort((left, right) => left.path.localeCompare(right.path));
}

function deriveBinding({ executionCapsule, expectedSourceBundle }, executionVerification, verifiedSourceRoot) {
  const descriptor = executionCapsule.descriptor;
  const sourceRoot = executionCapsule.local?.source_root;
  if (!samePath(sourceRoot, MODULE_LOCATION.source_root)) {
    refuse("MODULE_INSTANCE", "Authority module instance does not belong to the supplied capsule source root.");
  }
  if (!samePath(verifiedSourceRoot, MODULE_LOCATION.source_root)) {
    refuse("MODULE_INSTANCE", "Verified source root differs from this authority module instance.");
  }
  if (
    descriptor?.source?.head_commit !== expectedSourceBundle.vcs?.source_commit
    || canonicalize(descriptor.source?.source_paths) !== canonicalize(expectedSourceBundle.files?.map((row) => row.path))
    || canonicalize(descriptor.source?.inventory?.files) !== canonicalize(expectedSourceBundle.files)
    || descriptor.source?.inventory_sha256 !== executionVerification.source_inventory_sha256
  ) refuse("SOURCE_IDENTITY", "Execution descriptor source identity disagrees with the verified source bundle.");

  const runtimeIdentity = descriptor.runtime_identity;
  const dependencyInventory = descriptor.dependencies?.inventory;
  if (
    !/^[0-9a-f]{64}$/.test(runtimeIdentity?.identity_sha256 ?? "")
    || !/^[0-9a-f]{64}$/.test(dependencyInventory?.inventory_sha256 ?? "")
    || dependencyInventory.inventory_sha256 !== executionVerification.dependency_inventory_sha256
    || canonicalize(flattenedRuntimeDependencyFiles(runtimeIdentity)) !== canonicalize(dependencyInventory.files)
    || canonicalize(runtimeIdentity.external_production_dependency_names) !== canonicalize(descriptor.dependencies?.names)
  ) refuse("DEPENDENCY_IDENTITY", "Runtime dependency identity disagrees with the execution descriptor inventory.");

  return Object.freeze({
    authority_version: CAPSULE_EXECUTION_AUTHORITY_VERSION,
    execution_descriptor_sha256: descriptor.descriptor_sha256,
    source_bundle_sha256: expectedSourceBundle.source_sha256,
    source_inventory_sha256: descriptor.source.inventory_sha256,
    runtime_identity_sha256: runtimeIdentity.identity_sha256,
    dependency_inventory_sha256: dependencyInventory.inventory_sha256,
    source_root: MODULE_LOCATION.source_root,
    head_commit: descriptor.source.head_commit,
  });
}

async function verifyAndBind(input) {
  const validated = assertExactInput(input);
  const sourceRoot = path.resolve(validated.executionCapsule.local?.source_root ?? "");
  if (!samePath(sourceRoot, MODULE_LOCATION.source_root)) {
    refuse("MODULE_INSTANCE", "Supplied execution capsule belongs to a different source root.");
  }
  let executionVerification;
  let verifiedSourceBundle;
  try {
    executionVerification = await verifyExecutionCapsule(validated.executionCapsule);
    verifiedSourceBundle = await verifyCandidate010SourceBundleAtRoot({
      sourceRoot,
      expectedBundle: validated.expectedSourceBundle,
    });
  } catch (error) {
    refuse("VALIDATION", `Execution capsule or frozen source validation failed: ${error.message}`, error);
  }
  if (canonicalize(verifiedSourceBundle) !== canonicalize(validated.expectedSourceBundle)) {
    refuse("SOURCE_IDENTITY", "Verified source bundle differs from the expected source bundle.");
  }
  return deriveBinding(validated, executionVerification, sourceRoot);
}

function sameBinding(left, right) {
  return canonicalize(left) === canonicalize(right);
}

function newOpaqueCapability(binding) {
  const capability = Object.freeze(function candidate010CapsuleExecutionAuthority() {
    refuse("INVOCATION", "Execution authority is an opaque capability and is not callable.");
  });
  activeCapabilities.add(capability);
  capabilityBindings.set(capability, binding);
  return capability;
}

/**
 * Creates one callback-scoped authority only after full source/capsule checks.
 * The capability is revoked before this function settles.
 */
export async function withVerifiedCapsuleExecutionAuthority(input, callback) {
  if (typeof callback !== "function") refuse("CALLBACK", "Authority callback must be a function.");
  const initialBinding = await verifyAndBind(input);
  const capability = newOpaqueCapability(initialBinding);
  try {
    const result = await callback(capability);
    const finalBinding = await verifyAndBind(input);
    if (!sameBinding(initialBinding, finalBinding)) {
      refuse("MUTATION", "Execution authority binding changed during its callback scope.");
    }
    return result;
  } finally {
    activeCapabilities.delete(capability);
    capabilityBindings.delete(capability);
  }
}

/** Revalidates the complete capsule and returns the immutable bound identity. */
export async function assertCapsuleExecutionAuthority(capability, input) {
  if (
    typeof capability !== "function"
    || !activeCapabilities.has(capability)
    || !capabilityBindings.has(capability)
  ) refuse("CAPABILITY", "Execution authority capability is forged, cloned, foreign, or revoked.");
  const storedBinding = capabilityBindings.get(capability);
  const currentBinding = await verifyAndBind(input);
  if (!sameBinding(storedBinding, currentBinding)) {
    refuse("BINDING", "Execution authority capability does not match the supplied capsule identities.");
  }
  return storedBinding;
}
