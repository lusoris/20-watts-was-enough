import { createHash, randomBytes } from "node:crypto";
import { spawn } from "node:child_process";
import { lstat, mkdtemp, realpath, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import process from "node:process";
import { verifyExecutionCapsule } from "./execution-capsule.mjs";

export const CAPSULE_BOOTSTRAP_PROTOCOL = "candidate-010-capsule-bootstrap-v2";
export const CAPSULE_CHILD_RELATIVE_PATH = "experiments/workstation/candidate-010/capsule-child.mjs";
export const CAPSULE_CONFIRMATION_ENTRY_RELATIVE_PATH = "experiments/workstation/candidate-010/capsule-confirmation-entry.mjs";
export const CAPSULE_PROMOTION_ENTRY_RELATIVE_PATH = "experiments/workstation/candidate-010/promotion-evidence.mjs";
export const CAPSULE_LAUNCH_RECEIPT_VERSION = "candidate-010.capsule-launch-receipt.v1";
export const CAPSULE_LAUNCH_PRECOMMIT_VERSION = "candidate-010.capsule-launch-precommit.v1";
const ACTIONS = new Set([
  "verified-handshake",
  "candidate-010-confirmation",
  "candidate-010-promotion-evidence",
]);
export const CAPSULE_CHILD_DEADLINE_MS_BY_ACTION = Object.freeze({
  "verified-handshake": 10_000,
  "candidate-010-confirmation": 120_000,
  "candidate-010-promotion-evidence": 120_000,
});

function resolveChildDeadline(action, override) {
  const value = override ?? CAPSULE_CHILD_DEADLINE_MS_BY_ACTION[action];
  if (!Number.isSafeInteger(value) || value < 1 || value > 300000) {
    refuse("invalid child timeout");
  }
  return value;
}

const ENV = new Map([
  ["SYSTEMROOT", "SYSTEMROOT"],
  ["WINDIR", "WINDIR"],
  ["TEMP", "TEMP"],
  ["TMP", "TMP"],
  ["TMPDIR", "TMPDIR"],
  ["HOMEDRIVE", "HOMEDRIVE"],
  ["HOMEPATH", "HOMEPATH"],
  ["LOGONSERVER", "LOGONSERVER"],
  ["PATH", "PATH"],
  ["SYSTEMDRIVE", "SYSTEMDRIVE"],
  ["USERDOMAIN", "USERDOMAIN"],
  ["USERNAME", "USERNAME"],
  ["USERPROFILE", "USERPROFILE"],
]);

function refuse(reason) {
  throw new Error(`Refusing capsule bootstrap: ${reason}`);
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
  return refuse(`non-canonical value ${typeof value}`);
}
const digestObject = (value) => createHash("sha256").update(canonical(value)).digest("hex");

function stableActionRequest(action, confirmationRequest, promotionRequest) {
  if (action !== "candidate-010-confirmation" || !confirmationRequest) {
    return action === "candidate-010-promotion-evidence" ? promotionRequest : null;
  }
  const stable = { ...confirmationRequest };
  delete stable.resume;
  delete stable.stopAfterRecords;
  return stable;
}
export function sanitizeCapsuleEnvironment({ inherited = process.env, overrides = {} } = {}) {
    if (!inherited || !overrides || typeof inherited !== "object" || typeof overrides !== "object")
        refuse("environment inputs must be objects");
    const result = {};
    for (const [key, value] of Object.entries(inherited)) {
        const allowed = ENV.get(key.toUpperCase());
        if (allowed && value !== undefined)
            result[allowed] = String(value);
    }
    for (const [key, value] of Object.entries(overrides)) {
        const upper = key.toUpperCase();
        const allowed = ENV.get(upper);
        if (!allowed || upper === "PATH" || upper.startsWith("NODE_") || /IMPORT|PRELOAD|INSPECT/.test(upper))
            refuse(`environment override ${key} is not allowlisted`);
        if (typeof value !== "string" || value.includes("\0"))
            refuse(`invalid environment value for ${key}`);
        result[allowed] = value;
    }
    return Object.freeze(Object.fromEntries(Object.entries(result).sort(([a], [b]) => a.localeCompare(b))));
}
async function exactRuntime(descriptor) {
  const executable = path.resolve(process.execPath);
  const information = await lstat(executable);
  if (information.isSymbolicLink() || !information.isFile()) {
    refuse("runtime executable is linked or invalid");
  }
  const resolved = await realpath(executable);
  const runtime = descriptor.runtime_identity;
  if (
    runtime?.runtime?.version !== process.version
    || runtime.runtime.platform !== process.platform
    || runtime.runtime.arch !== process.arch
  ) refuse("runtime process fields differ from execution descriptor");
  if (
    path.resolve(runtime.runtime.exec_path) !== executable
    || path.resolve(runtime.runtime.exec_path_realpath) !== resolved
  ) refuse("runtime executable path differs from execution descriptor");
  return { exec_path: resolved, identity_sha256: runtime.identity_sha256 };
}

function launch(childPath, requestPath, executable, env, timeoutMs, maxOutputBytes) {
  return new Promise((resolve, reject) => {
    const child = spawn(executable, [childPath, requestPath], {
      shell: false,
      windowsHide: true,
      env,
      stdio: ["ignore", "pipe", "pipe"],
    });
    const out = [];
    const err = [];
    let outBytes = 0;
    let errBytes = 0;
    let overflow = false;
    let timedOut = false;
    const timer = setTimeout(() => {
      timedOut = true;
      child.kill();
    }, timeoutMs);
    child.on("error", reject);
    child.stdout.on("data", (chunk) => {
      outBytes += chunk.length;
      if (outBytes > maxOutputBytes) {
        overflow = true;
        child.kill();
      } else out.push(chunk);
    });
    child.stderr.on("data", (chunk) => {
      errBytes += chunk.length;
      if (errBytes > maxOutputBytes) {
        overflow = true;
        child.kill();
      } else err.push(chunk);
    });
    child.on("close", (code, signal) => {
      clearTimeout(timer);
      resolve({
        code,
        signal,
        timedOut,
        overflow,
        stdout: Buffer.concat(out).toString("utf8"),
        stderr: Buffer.concat(err).toString("utf8"),
      });
    });
  });
}
function validateReceipt(raw, expected) {
  if (!raw.endsWith("\n") || raw.slice(0, -1).includes("\n")) {
    refuse("child stdout is extra or truncated");
  }
  let receipt;
  try {
    receipt = JSON.parse(raw.slice(0, -1));
  } catch (error) {
    refuse(`child stdout is malformed JSON: ${error.message}`);
  }
  if (`${canonical(receipt)}\n` !== raw) {
    refuse("child stdout is not one canonical JSON receipt");
  }
  const { receipt_sha256: receiptSha256, ...body } = receipt;
  const hashes = [
    body.request_nonce_sha256,
    body.sanitized_environment_sha256,
    body.exec_argv_sha256,
    body.parent_pre_verification_sha256,
    body.source_inventory_sha256,
    body.dependency_inventory_sha256,
    body.runtime_executable_sha256,
    body.child_pre_verification_sha256,
    body.child_post_verification_sha256,
    body.result_sha256,
    body.validation_sha256,
  ];
  if (
    receiptSha256 !== digestObject(body)
    || body.protocol !== CAPSULE_BOOTSTRAP_PROTOCOL
    || body.status !== "verified"
    || body.action !== expected.action
    || body.request_id !== expected.request_id
    || body.launch_request_sha256 !== expected.launch_request_sha256
    || body.execution_descriptor_sha256 !== expected.execution_descriptor_sha256
    || body.runtime_identity_sha256 !== expected.runtime_identity_sha256
    || body.request_nonce_sha256 !== expected.request_nonce_sha256
    || body.sanitized_environment_sha256 !== expected.sanitized_environment_sha256
    || body.exec_argv_sha256 !== expected.exec_argv_sha256
    || body.parent_pre_verification_sha256 !== expected.parent_pre_verification_sha256
    || body.source_inventory_sha256 !== expected.source_inventory_sha256
    || body.dependency_inventory_sha256 !== expected.dependency_inventory_sha256
    || body.runtime_executable_sha256 !== expected.runtime_executable_sha256
    || body.action_entry_relative_path !== expected.action_entry_relative_path
    || body.request_bytes !== expected.request_bytes
    || ![
      body.child_pre_verification_ms,
      body.action_elapsed_ms,
      body.child_post_verification_ms,
    ].every((value) => Number.isFinite(value) && value >= 0)
    || body.result_sha256 !== digestObject(body.action_result)
    || body.validation_sha256 !== digestObject(body.action_validation)
    || !hashes.every((value) => /^[0-9a-f]{64}$/.test(value ?? ""))
  ) refuse("child receipt identity or digest is invalid");
  return receipt;
}

const LAUNCH_RECEIPT_FIELDS = Object.freeze([
  "schema",
  "contract_version",
  "protocol",
  "status",
  "action",
  "request_nonce_sha256",
  "launch_request_sha256",
  "sanitized_environment_sha256",
  "exec_argv_sha256",
  "execution_descriptor_sha256",
  "source_inventory_sha256",
  "dependency_inventory_sha256",
  "runtime_identity_sha256",
  "runtime_executable_sha256",
  "child_relative_path",
  "action_entry_relative_path",
  "parent_pre_verification_sha256",
  "parent_post_verification_sha256",
  "child_pre_verification_sha256",
  "child_post_verification_sha256",
  "child_receipt_sha256",
  "result_sha256",
  "validation_sha256",
  "request_bytes",
  "stdout_bytes",
  "stderr_bytes",
  "elapsed_ms",
  "elapsed_semantics",
  "parent_pre_verification_ms",
  "parent_request_setup_ms",
  "parent_child_process_elapsed_ms",
  "child_pre_verification_ms",
  "child_action_elapsed_ms",
  "child_post_verification_ms",
  "parent_post_verification_ms",
]);

const LAUNCH_PRECOMMIT_FIELDS = Object.freeze([
  "schema",
  "contract_version",
  "action",
  "request_nonce",
  "request_nonce_sha256",
  "launch_request_sha256",
  "sanitized_environment_sha256",
  "exec_argv_sha256",
  "parent_pre_verification_sha256",
]);

export function validateCapsuleLaunchPrecommit(precommit, expectations = {}) {
  if (!precommit || typeof precommit !== "object" || Array.isArray(precommit)) {
    refuse("launch precommit must be an object");
  }
  const { precommit_sha256: precommitSha256, ...body } = precommit;
  if (
    Object.keys(body).sort().join("\0") !== [...LAUNCH_PRECOMMIT_FIELDS].sort().join("\0")
    || precommitSha256 !== digestObject(body)
    || body.schema !== 1
    || body.contract_version !== CAPSULE_LAUNCH_PRECOMMIT_VERSION
    || !ACTIONS.has(body.action)
    || !/^[0-9a-f]{64}$/.test(body.request_nonce)
    || body.request_nonce_sha256 !== digestObject(body.request_nonce)
    || ![
      body.request_nonce_sha256,
      body.launch_request_sha256,
      body.sanitized_environment_sha256,
      body.exec_argv_sha256,
      body.parent_pre_verification_sha256,
    ].every((value) => /^[0-9a-f]{64}$/.test(value))
  ) refuse("launch precommit shape or canonical identity is invalid");
  const allowedExpectations = new Set([
    "action",
    "requestNonceSha256",
    "launchRequestSha256",
    "sanitizedEnvironmentSha256",
    "execArgvSha256",
    "parentPreVerificationSha256",
  ]);
  if (
    !expectations
    || typeof expectations !== "object"
    || Array.isArray(expectations)
    || Object.keys(expectations).some((key) => !allowedExpectations.has(key))
    || (expectations.action !== undefined && expectations.action !== body.action)
    || (expectations.requestNonceSha256 !== undefined
      && expectations.requestNonceSha256 !== body.request_nonce_sha256)
    || (expectations.launchRequestSha256 !== undefined
      && expectations.launchRequestSha256 !== body.launch_request_sha256)
    || (expectations.sanitizedEnvironmentSha256 !== undefined
      && expectations.sanitizedEnvironmentSha256 !== body.sanitized_environment_sha256)
    || (expectations.execArgvSha256 !== undefined
      && expectations.execArgvSha256 !== body.exec_argv_sha256)
    || (expectations.parentPreVerificationSha256 !== undefined
      && expectations.parentPreVerificationSha256 !== body.parent_pre_verification_sha256)
  ) refuse("launch precommit differs from its current launch identity");
  return Object.freeze({
    valid: true,
    contract_version: CAPSULE_LAUNCH_PRECOMMIT_VERSION,
    precommit_sha256: precommitSha256,
  });
}

export function validateCapsuleLaunchReceipt(receipt, expectations = {}) {
  if (!receipt || typeof receipt !== "object" || Array.isArray(receipt)) {
    refuse("launch receipt must be an object");
  }
  const { receipt_sha256: receiptSha256, ...body } = receipt;
  if (
    Object.keys(body).sort().join("\0") !== [...LAUNCH_RECEIPT_FIELDS].sort().join("\0")
    || receiptSha256 !== digestObject(body)
    || body.schema !== 1
    || body.contract_version !== CAPSULE_LAUNCH_RECEIPT_VERSION
    || body.protocol !== CAPSULE_BOOTSTRAP_PROTOCOL
    || body.status !== "verified"
  ) refuse("launch receipt shape or canonical digest is invalid");
  const hashes = LAUNCH_RECEIPT_FIELDS.filter((field) => field.endsWith("_sha256"));
  if (!hashes.every((field) => /^[0-9a-f]{64}$/.test(body[field]))) {
    refuse("launch receipt contains an invalid identity hash");
  }
  if (
    body.parent_pre_verification_sha256 !== body.parent_post_verification_sha256
    || body.child_pre_verification_sha256 !== body.child_post_verification_sha256
    || ![body.request_bytes, body.stdout_bytes, body.stderr_bytes].every(Number.isSafeInteger)
    || body.request_bytes < 1
    || body.stdout_bytes < 1
    || body.stderr_bytes < 0
    || body.elapsed_semantics !== "inclusive-parent-envelope; child phases are nested and non-additive"
    || ![
      body.elapsed_ms,
      body.parent_pre_verification_ms,
      body.parent_request_setup_ms,
      body.parent_child_process_elapsed_ms,
      body.child_pre_verification_ms,
      body.child_action_elapsed_ms,
      body.child_post_verification_ms,
      body.parent_post_verification_ms,
    ].every((value) => Number.isFinite(value) && value >= 0)
  ) refuse("launch receipt pre/post, byte, or timing evidence is invalid");
  const expectationFields = {
    action: "action",
    requestNonceSha256: "request_nonce_sha256",
    launchRequestSha256: "launch_request_sha256",
    sanitizedEnvironmentSha256: "sanitized_environment_sha256",
    execArgvSha256: "exec_argv_sha256",
    parentPreVerificationSha256: "parent_pre_verification_sha256",
    executionDescriptorSha256: "execution_descriptor_sha256",
    sourceInventorySha256: "source_inventory_sha256",
    dependencyInventorySha256: "dependency_inventory_sha256",
    runtimeIdentitySha256: "runtime_identity_sha256",
    runtimeExecutableSha256: "runtime_executable_sha256",
  };
  if (
    !expectations
    || typeof expectations !== "object"
    || Array.isArray(expectations)
    || Object.keys(expectations).some((key) => !Object.hasOwn(expectationFields, key))
  ) refuse("launch receipt expectations contain an unknown field");
  for (const [input, field] of Object.entries(expectationFields)) {
    if (expectations[input] !== undefined && expectations[input] !== body[field]) {
      refuse(`launch receipt ${field} differs from its expected identity`);
    }
  }
  return Object.freeze({
    valid: true,
    contract_version: CAPSULE_LAUNCH_RECEIPT_VERSION,
    receipt_sha256: receiptSha256,
  });
}

export async function launchVerifiedCapsuleAction({
  executionCapsule,
  action = "verified-handshake",
  confirmationRequest = null,
  promotionRequest = null,
  launchPrecommit = null,
  onLaunchPrecommit = null,
  expectedSourceBundle = null,
  requestParent = os.tmpdir(),
  environmentInherited = process.env,
  environmentOverrides = {},
  timeoutMs = null,
  maxOutputBytes = 64 * 1024,
} = {}) {
  if (!ACTIONS.has(action)) refuse("unknown action");
  if (onLaunchPrecommit !== null && typeof onLaunchPrecommit !== "function") {
    refuse("onLaunchPrecommit must be a function when supplied");
  }
  if (action === "candidate-010-confirmation" && (!confirmationRequest || !expectedSourceBundle)) {
    refuse("confirmation requires request and expected source bundle");
  }
  if (action === "candidate-010-promotion-evidence" && (!promotionRequest || !expectedSourceBundle)) {
    refuse("promotion evidence requires request and expected source bundle");
  }
  const childDeadlineMs = resolveChildDeadline(action, timeoutMs);
  if (
    !Number.isSafeInteger(maxOutputBytes)
    || maxOutputBytes < 1024
    || maxOutputBytes > 1024 * 1024
  ) refuse("invalid child output limit");
  const parentEnvelopeStarted = performance.now();
  const parentPreVerificationStarted = performance.now();
  const pre = await verifyExecutionCapsule(executionCapsule);
  const parentPreVerificationMs = performance.now() - parentPreVerificationStarted;
  const parentRequestSetupStarted = performance.now();
  const parentPreVerificationSha256 = digestObject(pre);
  const { descriptor, local } = executionCapsule;
  if (!descriptor.source.source_paths.includes(CAPSULE_CHILD_RELATIVE_PATH)) {
    refuse("capsule does not bind fixed child entrypoint");
  }
  if (
    action === "candidate-010-confirmation"
    && !descriptor.source.source_paths.includes(CAPSULE_CONFIRMATION_ENTRY_RELATIVE_PATH)
  ) refuse("capsule does not bind fixed confirmation entrypoint");
  if (
    action === "candidate-010-promotion-evidence"
    && !descriptor.source.source_paths.includes(CAPSULE_PROMOTION_ENTRY_RELATIVE_PATH)
  ) {
    refuse("capsule does not bind fixed promotion entrypoint");
  }
  const runtime = await exactRuntime(descriptor);
  const sanitizedEnvironment = sanitizeCapsuleEnvironment({
    inherited: environmentInherited,
    overrides: environmentOverrides,
  });
  const sanitizedEnvironmentSha256 = digestObject(sanitizedEnvironment);
  const execArgvSha256 = digestObject([]);
  if (launchPrecommit !== null) {
    validateCapsuleLaunchPrecommit(launchPrecommit, {
      action,
      sanitizedEnvironmentSha256,
      execArgvSha256,
      parentPreVerificationSha256,
    });
  }
  const requestNonce = launchPrecommit?.request_nonce ?? randomBytes(32).toString("hex");
  const requestNonceSha256 = digestObject(requestNonce);
  const actionEntryRelativePath = action === "candidate-010-confirmation"
    ? CAPSULE_CONFIRMATION_ENTRY_RELATIVE_PATH
    : action === "candidate-010-promotion-evidence"
      ? CAPSULE_PROMOTION_ENTRY_RELATIVE_PATH
      : CAPSULE_CHILD_RELATIVE_PATH;
  const binding = {
    schema: 1,
    protocol: CAPSULE_BOOTSTRAP_PROTOCOL,
    action,
    child_relative_path: CAPSULE_CHILD_RELATIVE_PATH,
    confirmation_entry_relative_path: CAPSULE_CONFIRMATION_ENTRY_RELATIVE_PATH,
    promotion_entry_relative_path: CAPSULE_PROMOTION_ENTRY_RELATIVE_PATH,
    action_entry_relative_path: actionEntryRelativePath,
    request_nonce_sha256: requestNonceSha256,
    sanitized_environment_sha256: sanitizedEnvironmentSha256,
    exec_argv_sha256: execArgvSha256,
    parent_pre_verification_sha256: parentPreVerificationSha256,
    execution_descriptor_sha256: descriptor.descriptor_sha256,
    runtime_identity_sha256: runtime.identity_sha256,
    action_request_sha256: digestObject(stableActionRequest(
      action,
      confirmationRequest,
      promotionRequest,
    )),
  };
  const launchRequestSha256 = digestObject(binding);
  if (launchPrecommit && launchPrecommit.launch_request_sha256 !== launchRequestSha256) {
    refuse("resume launch precommit differs from the stable action request");
  }
  const launchPrecommitBody = {
    schema: 1,
    contract_version: CAPSULE_LAUNCH_PRECOMMIT_VERSION,
    action,
    request_nonce: requestNonce,
    request_nonce_sha256: requestNonceSha256,
    launch_request_sha256: launchRequestSha256,
    sanitized_environment_sha256: sanitizedEnvironmentSha256,
    exec_argv_sha256: execArgvSha256,
    parent_pre_verification_sha256: parentPreVerificationSha256,
  };
  const effectiveLaunchPrecommit = Object.freeze({
    ...launchPrecommitBody,
    precommit_sha256: digestObject(launchPrecommitBody),
  });
  if (launchPrecommit && canonical(launchPrecommit) !== canonical(effectiveLaunchPrecommit)) {
    refuse("resume launch precommit is not the exact recomputed token");
  }
  if (onLaunchPrecommit) await onLaunchPrecommit(effectiveLaunchPrecommit);
  const requestId = `c010-capsule-request-${launchRequestSha256}`;
  const body = {
    ...binding,
    request_id: requestId,
    launch_request_sha256: launchRequestSha256,
    execution_capsule: executionCapsule,
    expected_source_bundle: expectedSourceBundle,
    confirmation_request: confirmationRequest,
    promotion_request: promotionRequest,
    request_nonce: requestNonce,
    sanitized_environment: sanitizedEnvironment,
    expected_exec_argv: [],
  };
  const request = { ...body, envelope_sha256: digestObject(body) };
  const parent = await realpath(requestParent);
  const dir = await mkdtemp(path.join(parent, "c010-capsule-request-"));
  const requestPath = path.join(dir, "request.json");
  const requestText = `${canonical(request)}\n`;
  const requestBytes = Buffer.byteLength(requestText);
  await writeFile(requestPath, requestText, { flag: "wx", mode: 0o600 });
  const childPath = path.join(local.source_root, ...CAPSULE_CHILD_RELATIVE_PATH.split("/"));
  let result, error;
  let parentChildProcessElapsedMs;
  const launchStarted = performance.now();
  const parentRequestSetupMs = launchStarted - parentRequestSetupStarted;
  try {
    result = await launch(
      childPath,
      requestPath,
      runtime.exec_path,
      sanitizedEnvironment,
      childDeadlineMs,
      maxOutputBytes,
    );
    parentChildProcessElapsedMs = performance.now() - launchStarted;
    if (result.timedOut) refuse("capsule child timed out");
    if (result.overflow) refuse("capsule child exceeded output limit");
    if (result.signal) refuse(`capsule child terminated by signal ${result.signal}`);
    if (result.code !== 0) {
      refuse(`capsule child exited nonzero (${result.code}): ${result.stderr.trim()}`);
    }
    if (result.stderr !== "") refuse("capsule child emitted diagnostics on success");
  } catch (launchError) {
    error = launchError;
  }
  let post;
  let parentPostVerificationMs;
  try {
    const parentPostVerificationStarted = performance.now();
    post = await verifyExecutionCapsule(executionCapsule);
    parentPostVerificationMs = performance.now() - parentPostVerificationStarted;
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
  if (digestObject(pre) !== digestObject(post)) {
    refuse("parent pre/post execution capsule verification differs");
  }
  if (error) throw error;
  const receipt = validateReceipt(result.stdout, {
    action,
    request_id: requestId,
    launch_request_sha256: launchRequestSha256,
    execution_descriptor_sha256: descriptor.descriptor_sha256,
    runtime_identity_sha256: runtime.identity_sha256,
    request_nonce_sha256: requestNonceSha256,
    sanitized_environment_sha256: sanitizedEnvironmentSha256,
    exec_argv_sha256: execArgvSha256,
    parent_pre_verification_sha256: parentPreVerificationSha256,
    source_inventory_sha256: descriptor.source.inventory_sha256,
    dependency_inventory_sha256: descriptor.dependencies.inventory.inventory_sha256,
    runtime_executable_sha256: descriptor.runtime_identity.runtime.executable_sha256,
    action_entry_relative_path: actionEntryRelativePath,
    request_bytes: requestBytes,
  });
  const launchReceiptBody = {
    schema: 1,
    contract_version: CAPSULE_LAUNCH_RECEIPT_VERSION,
    protocol: CAPSULE_BOOTSTRAP_PROTOCOL,
    status: "verified",
    action,
    request_nonce_sha256: requestNonceSha256,
    launch_request_sha256: launchRequestSha256,
    sanitized_environment_sha256: sanitizedEnvironmentSha256,
    exec_argv_sha256: execArgvSha256,
    execution_descriptor_sha256: descriptor.descriptor_sha256,
    source_inventory_sha256: descriptor.source.inventory_sha256,
    dependency_inventory_sha256: descriptor.dependencies.inventory.inventory_sha256,
    runtime_identity_sha256: runtime.identity_sha256,
    runtime_executable_sha256: descriptor.runtime_identity.runtime.executable_sha256,
    child_relative_path: CAPSULE_CHILD_RELATIVE_PATH,
    action_entry_relative_path: actionEntryRelativePath,
    parent_pre_verification_sha256: parentPreVerificationSha256,
    parent_post_verification_sha256: digestObject(post),
    child_pre_verification_sha256: receipt.child_pre_verification_sha256,
    child_post_verification_sha256: receipt.child_post_verification_sha256,
    child_receipt_sha256: receipt.receipt_sha256,
    result_sha256: receipt.result_sha256,
    validation_sha256: receipt.validation_sha256,
    request_bytes: requestBytes,
    stdout_bytes: Buffer.byteLength(result.stdout),
    stderr_bytes: Buffer.byteLength(result.stderr),
    elapsed_ms: performance.now() - parentEnvelopeStarted,
    elapsed_semantics: "inclusive-parent-envelope; child phases are nested and non-additive",
    parent_pre_verification_ms: parentPreVerificationMs,
    parent_request_setup_ms: parentRequestSetupMs,
    parent_child_process_elapsed_ms: parentChildProcessElapsedMs,
    child_pre_verification_ms: receipt.child_pre_verification_ms,
    child_action_elapsed_ms: receipt.action_elapsed_ms,
    child_post_verification_ms: receipt.child_post_verification_ms,
    parent_post_verification_ms: parentPostVerificationMs,
  };
  const launchReceipt = Object.freeze({
    ...launchReceiptBody,
    receipt_sha256: digestObject(launchReceiptBody),
  });
  validateCapsuleLaunchReceipt(launchReceipt, {
    action,
    executionDescriptorSha256: descriptor.descriptor_sha256,
    sourceInventorySha256: descriptor.source.inventory_sha256,
    dependencyInventorySha256: descriptor.dependencies.inventory.inventory_sha256,
    runtimeIdentitySha256: runtime.identity_sha256,
  });
  return Object.freeze({
    schema: 1,
    protocol: CAPSULE_BOOTSTRAP_PROTOCOL,
    status: "verified",
    action,
    receipt,
    launch_receipt: launchReceipt,
    launch_precommit: effectiveLaunchPrecommit,
    action_result: receipt.action_result,
    parent_pre_verification_sha256: digestObject(pre),
    parent_post_verification_sha256: digestObject(post),
    cleanup_owner: "caller",
    capsule_destroyed: false,
  });
}

export const launchVerifiedCapsuleDryRun = (options = {}) => launchVerifiedCapsuleAction({
  ...options,
  action: "verified-handshake",
});
