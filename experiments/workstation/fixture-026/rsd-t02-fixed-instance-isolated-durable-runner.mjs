import { spawn } from "node:child_process";
import { createHash } from "node:crypto";
import { lstat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  canonicalize,
  sha256Hex,
} from "../lib/checkpoint-ledger.mjs";
import {
  openFixture026RsdT02BoundedCheckpointLedger,
  prepareFixture026RsdT02SafeOutputDirectory,
} from "./rsd-t02-fixed-instance-durable-store.mjs";
import {
  FIXTURE_026_RSD_T02_FIXED_INSTANCE_RUNNER_CONFIG_SHA256,
  assertFixture026RsdT02FixedInstanceRunnerConfig,
  runFixture026RsdT02FixedInstance,
} from "./rsd-t02-fixed-instance-runner.mjs";
import { acquireFixture026RsdT02RunLock } from "./rsd-t02-run-lock.mjs";
import { readStableOpenedFile } from "./opened-file.mjs";

export const FIXTURE_026_RSD_T02_FIXED_INSTANCE_ISOLATED_DURABLE_CONFIG_VERSION =
  "fixture-026.rsd-t02-fixed-instance-isolated-durable-config.v1";
export const FIXTURE_026_RSD_T02_FIXED_INSTANCE_ISOLATED_DURABLE_CONFIG_SHA256 =
  "00fe1eab4c228ab1aca1d7d0760363f17bc9dbb2ff93942c06a9b8e36d42b198";
export const FIXTURE_026_RSD_T02_FIXED_INSTANCE_DISK_LEDGER_VERSION =
  "fixture-026.rsd-t02-fixed-instance-disk-ledger.v1";
export const FIXTURE_026_RSD_T02_FIXED_INSTANCE_DURABLE_SUMMARY_VERSION =
  "fixture-026.rsd-t02-fixed-instance-durable-summary.v1";

const fixtureRoot = path.dirname(fileURLToPath(import.meta.url));
const HASH_PATTERN = /^[0-9a-f]{64}$/u;
const MAX_OWNER_ID_BYTES = 1024;
const CONFIG_KEYS = Object.freeze([
  "schema", "contract_version", "artifact", "track", "partition", "authority",
  "fixed_instance_runner_config_sha256", "policy_bundle", "worker", "isolation",
  "durability", "foundation_gates", "comparison_inference_permitted", "claim_eligible",
  "result_label",
]);
const BUNDLE_KEYS = Object.freeze([
  "relative_path", "sha256", "utf8_bytes", "content_address",
]);
const WORKER_KEYS = Object.freeze(["relative_path", "sha256", "utf8_bytes"]);
const ISOLATION_KEYS = Object.freeze([
  "execution_mode", "fresh_process", "filesystem_read_allowlist",
  "filesystem_write_exposed_to_policy", "network_exposed_to_policy",
  "environment_exposed_to_policy", "clock_exposed_to_policy",
  "random_exposed_to_policy", "evaluator_exposed_to_policy",
  "dynamic_code_generation_exposed_to_policy", "timeout_ms", "max_request_bytes",
  "max_response_bytes",
]);
const DURABILITY_KEYS = Object.freeze([
  "ledger_format", "raw_path", "checkpoint_path", "exclusive_writer_lock",
  "foreign_lock_auto_break", "owner_identity_bound_to_records", "append_sync",
  "checkpoint_sync", "resume_authority", "torn_tail_policy", "power_loss_guarantee",
  "owner_authentication", "abandoned_lock_recovery", "max_records", "max_raw_bytes",
  "max_checkpoint_bytes",
]);
const GATE_KEYS = Object.freeze([
  "content_addressed_26_projection_policy_bundle",
  "fresh_restricted_child_per_fixed_packet",
  "deterministic_full_view_semantic_replay_equivalence",
  "ownership_safe_append_only_disk_resume",
  "comparison_policy_execution",
  "claim_eligible_execution",
]);
const CHILD_RESPONSE_KEYS = Object.freeze([
  "schema", "contract_version", "status", "responses", "reason_codes",
  "request_sha256", "request_bytes", "policy_view_sha256", "policy_view_utf8_bytes",
  "bundle_sha256", "runtime", "authority", "comparison_inference_permitted",
  "claim_eligible", "result_label", "no_result",
]);
const CHILD_RUNTIME_KEYS = Object.freeze([
  "node_version", "v8_version", "platform", "architecture", "numeric_model",
]);
const RECEIPT_KEYS = Object.freeze([
  "boundary_version", "execution_mode", "fresh_process",
  "filesystem_read_exposed_to_policy", "filesystem_write_exposed_to_policy",
  "network_exposed_to_policy", "environment_exposed_to_policy",
  "clock_exposed_to_policy", "random_exposed_to_policy", "evaluator_exposed_to_policy",
  "dynamic_code_generation_exposed_to_policy", "worker_sha256", "bundle_sha256",
  "canonical_request_sha256", "canonical_request_bytes", "canonical_response_sha256",
  "canonical_response_bytes", "policy_view_sha256", "policy_view_utf8_bytes",
  "response_bank_sha256", "runtime", "authority", "comparison_inference_permitted",
  "claim_eligible", "result_label", "no_result",
]);
const DISK_RECORD_KEYS = Object.freeze([
  "schema", "contract_version", "run_id", "owner_identity_sha256", "arm_index",
  "arm_id", "fixed_runner_record", "isolated_response_sha256",
  "isolated_execution_receipt", "authority", "comparison_inference_permitted",
  "claim_eligible", "result_label", "no_result", "integrity",
]);

function exactKeys(value, keys) {
  return value !== null
    && typeof value === "object"
    && !Array.isArray(value)
    && Object.keys(value).length === keys.length
    && keys.every((key) => Object.hasOwn(value, key));
}

function refuse(message) {
  throw new Error(`Fixture 026 RSD-T02 isolated durable runner refused: ${message}`);
}

function sha256(value) {
  return createHash("sha256").update(value).digest("hex");
}

function deepFreeze(value) {
  if (value && typeof value === "object" && !Object.isFrozen(value)) {
    Object.freeze(value);
    for (const child of Object.values(value)) deepFreeze(child);
  }
  return value;
}

function immutableCopy(value, label = "value") {
  try {
    return deepFreeze(JSON.parse(canonicalize(value)));
  } catch {
    refuse(`${label} is not a closed canonical JSON value`);
  }
}

function isInside(root, target) {
  const relative = path.relative(root, target);
  return relative === "" || (!relative.startsWith("..") && !path.isAbsolute(relative));
}

function assertRelativePath(relativePath) {
  return typeof relativePath === "string"
    && relativePath.length > 0
    && !relativePath.includes("\\")
    && !path.posix.isAbsolute(relativePath)
    && relativePath.split("/").every((part) => part !== "" && part !== "." && part !== "..");
}

async function loadExactFixtureFile(descriptor, label) {
  if (
    !assertRelativePath(descriptor.relative_path)
    || !HASH_PATTERN.test(descriptor.sha256)
    || !Number.isSafeInteger(descriptor.utf8_bytes)
    || descriptor.utf8_bytes < 1
  ) refuse(`${label} descriptor is invalid`);
  const absolute = path.resolve(fixtureRoot, ...descriptor.relative_path.split("/"));
  if (!isInside(fixtureRoot, absolute)) refuse(`${label} path escapes fixture root`);
  let cursor = fixtureRoot;
  for (const component of descriptor.relative_path.split("/")) {
    cursor = path.join(cursor, component);
    const information = await lstat(cursor);
    if (information.isSymbolicLink()) refuse(`${label} path traverses a symbolic link or junction`);
  }
  const bytes = await readStableOpenedFile(absolute, {
    label,
    containedBy: fixtureRoot,
  });
  if (bytes.length !== descriptor.utf8_bytes || sha256(bytes) !== descriptor.sha256) {
    refuse(`${label} content identity mismatch`);
  }
  const text = new TextDecoder("utf-8", { fatal: true }).decode(bytes);
  if (text.includes("\r") || !text.endsWith("\n")) refuse(`${label} is not canonical LF UTF-8`);
  return Object.freeze({ path: absolute, bytes, text });
}

export function assertFixture026RsdT02FixedInstanceIsolatedDurableConfig(config) {
  if (
    !exactKeys(config, CONFIG_KEYS)
    || sha256Hex(canonicalize(config))
      !== FIXTURE_026_RSD_T02_FIXED_INSTANCE_ISOLATED_DURABLE_CONFIG_SHA256
    || config.schema !== 1
    || config.contract_version
      !== FIXTURE_026_RSD_T02_FIXED_INSTANCE_ISOLATED_DURABLE_CONFIG_VERSION
    || config.artifact !== "fixture-026"
    || config.track !== "RSD-T02"
    || config.partition !== "development"
    || config.authority
      !== "public-development-fixed-instance-isolated-durable-conformance-only"
    || config.fixed_instance_runner_config_sha256
      !== FIXTURE_026_RSD_T02_FIXED_INSTANCE_RUNNER_CONFIG_SHA256
    || !exactKeys(config.policy_bundle, BUNDLE_KEYS)
    || config.policy_bundle.content_address !== `sha256:${config.policy_bundle.sha256}`
    || path.posix.basename(config.policy_bundle.relative_path)
      !== `${config.policy_bundle.sha256}.js`
    || !exactKeys(config.worker, WORKER_KEYS)
    || !exactKeys(config.isolation, ISOLATION_KEYS)
    || config.isolation.execution_mode !== "fresh-node-child-hardened-vm-per-fixed-packet"
    || config.isolation.fresh_process !== true
    || config.isolation.filesystem_read_allowlist
      !== "exact-content-addressed-policy-bundle-only"
    || [
      "filesystem_write_exposed_to_policy", "network_exposed_to_policy",
      "environment_exposed_to_policy", "clock_exposed_to_policy",
      "random_exposed_to_policy", "evaluator_exposed_to_policy",
      "dynamic_code_generation_exposed_to_policy",
    ].some((key) => config.isolation[key] !== false)
    || !Number.isSafeInteger(config.isolation.timeout_ms)
    || config.isolation.timeout_ms < 1
    || config.isolation.max_request_bytes !== 24 * 1024 * 1024
    || config.isolation.max_response_bytes !== 256 * 1024
    || !exactKeys(config.durability, DURABILITY_KEYS)
    || config.durability.ledger_format
      !== FIXTURE_026_RSD_T02_FIXED_INSTANCE_DISK_LEDGER_VERSION
    || config.durability.raw_path !== "fixed-instance-run.jsonl"
    || config.durability.checkpoint_path !== "fixed-instance-checkpoint.json"
    || config.durability.exclusive_writer_lock !== true
    || config.durability.foreign_lock_auto_break !== false
    || config.durability.owner_identity_bound_to_records !== true
    || config.durability.append_sync !== "complete-lf-json-record-then-filehandle-sync"
    || config.durability.checkpoint_sync !== "temporary-sync-rename-destination-sync"
    || config.durability.resume_authority !== "raw-ledger-reconstruction"
    || config.durability.torn_tail_policy !== "refuse-without-repair"
    || config.durability.power_loss_guarantee !== "not-claimed-beyond-requested-file-sync"
    || config.durability.owner_authentication
      !== "not-provided-caller-custodies-owner-id"
    || config.durability.abandoned_lock_recovery !== "manual-only-no-auto-break"
    || config.durability.max_records !== 9
    || config.durability.max_raw_bytes !== 8 * 1024 * 1024
    || config.durability.max_checkpoint_bytes !== 64 * 1024
    || !exactKeys(config.foundation_gates, GATE_KEYS)
    || config.foundation_gates.content_addressed_26_projection_policy_bundle !== true
    || config.foundation_gates.fresh_restricted_child_per_fixed_packet !== true
    || config.foundation_gates.deterministic_full_view_semantic_replay_equivalence !== true
    || config.foundation_gates.ownership_safe_append_only_disk_resume !== true
    || config.foundation_gates.comparison_policy_execution !== false
    || config.foundation_gates.claim_eligible_execution !== false
    || config.comparison_inference_permitted !== false
    || config.claim_eligible !== false
    || config.result_label !== "NO_RESULT"
  ) refuse("overlay config differs from its closed NO_RESULT contract");
  return config;
}

function sanitizedChildEnvironment() {
  if (process.platform !== "win32") return Object.freeze({});
  return Object.freeze(Object.fromEntries([
    "SYSTEMROOT", "WINDIR", "SYSTEMDRIVE", "COMSPEC",
  ].filter((key) => typeof process.env[key] === "string").map(
    (key) => [key, process.env[key]],
  )));
}

function launchRestrictedChild({ workerSource, bundlePath, bundleSha256, requestBytes, config }) {
  return new Promise((resolve) => {
    const stdout = [];
    const stderr = [];
    let stdoutBytes = 0;
    let stderrBytes = 0;
    let timedOut = false;
    let protocolExceeded = false;
    let spawnError = null;
    const child = spawn(process.execPath, [
      "--permission",
      `--allow-fs-read=${bundlePath}`,
      "--disable-proto=throw",
      "--no-addons",
      "--max-old-space-size=256",
      "--input-type=module",
      "--eval",
      workerSource,
      "--",
      bundlePath,
      bundleSha256,
    ], {
      cwd: fixtureRoot,
      env: sanitizedChildEnvironment(),
      shell: false,
      windowsHide: true,
      stdio: ["pipe", "pipe", "pipe"],
    });
    const terminate = () => {
      if (child.exitCode === null && child.signalCode === null) child.kill("SIGKILL");
    };
    const timer = setTimeout(() => {
      timedOut = true;
      terminate();
    }, config.isolation.timeout_ms);
    timer.unref();
    child.stdout.on("data", (chunk) => {
      stdoutBytes += chunk.length;
      if (stdoutBytes > config.isolation.max_response_bytes) {
        protocolExceeded = true;
        terminate();
      } else stdout.push(chunk);
    });
    child.stderr.on("data", (chunk) => {
      stderrBytes += chunk.length;
      if (stderrBytes > config.isolation.max_response_bytes) {
        protocolExceeded = true;
        terminate();
      } else stderr.push(chunk);
    });
    child.once("error", (error) => { spawnError = error; });
    child.stdin.once("error", (error) => {
      if (!["EPIPE", "EOF"].includes(error.code)) spawnError = error;
    });
    child.once("close", (exitCode, signal) => {
      clearTimeout(timer);
      resolve(Object.freeze({
        exitCode,
        signal,
        timedOut,
        protocolExceeded,
        spawnError,
        stdout: Buffer.concat(stdout),
        stderr: Buffer.concat(stderr),
      }));
    });
    child.stdin.end(requestBytes);
  });
}

function parseChildResponse({ childResult, requestBytes, policyViewBytes, config }) {
  if (
    childResult.timedOut
    || childResult.protocolExceeded
    || childResult.spawnError !== null
    || childResult.exitCode !== 0
    || childResult.signal !== null
    || childResult.stderr.length !== 0
  ) refuse(
    "restricted child failed closed before a valid response "
    + `(exit=${childResult.exitCode},signal=${childResult.signal ?? "none"},`
    + `timeout=${childResult.timedOut},protocol_exceeded=${childResult.protocolExceeded},`
    + `spawn_error=${childResult.spawnError?.code ?? "none"},`
    + `stderr_bytes=${childResult.stderr.length},stderr_sha256=${sha256(childResult.stderr)})`,
  );
  let text;
  let response;
  try {
    text = new TextDecoder("utf-8", { fatal: true }).decode(childResult.stdout);
    if (text.includes("\r") || !text.endsWith("\n") || text.slice(0, -1).includes("\n")) {
      refuse("restricted child response is not one canonical LF record");
    }
    response = JSON.parse(text.slice(0, -1));
    if (`${canonicalize(response)}\n` !== text) refuse("restricted child response is not canonical");
  } catch (error) {
    if (String(error?.message).startsWith("Fixture 026")) throw error;
    refuse("restricted child response is malformed JSON");
  }
  if (
    !exactKeys(response, CHILD_RESPONSE_KEYS)
    || response.schema !== 1
    || response.contract_version
      !== "fixture-026.rsd-t02-fixed-instance-isolated-response.v1"
    || response.status !== "completed"
    || !Array.isArray(response.responses)
    || response.responses.length !== 9
    || !Array.isArray(response.reason_codes)
    || response.reason_codes.length !== 0
    || response.request_sha256 !== sha256(requestBytes)
    || response.request_bytes !== requestBytes.length
    || response.policy_view_sha256 !== sha256(policyViewBytes)
    || response.policy_view_utf8_bytes !== policyViewBytes.length
    || response.bundle_sha256 !== config.policy_bundle.sha256
    || !exactKeys(response.runtime, CHILD_RUNTIME_KEYS)
    || response.runtime.node_version !== process.versions.node
    || response.runtime.v8_version !== process.versions.v8
    || response.runtime.platform !== process.platform
    || response.runtime.architecture !== process.arch
    || response.runtime.numeric_model !== "IEEE-754-binary64"
    || response.authority !== "public-development-fixed-instance-isolated-conformance-only"
    || response.comparison_inference_permitted !== false
    || response.claim_eligible !== false
    || response.result_label !== "NO_RESULT"
    || response.no_result !== true
  ) refuse("restricted child response violates its closed binding");
  return Object.freeze({ response, responseBytes: childResult.stdout });
}

async function executeIsolatedPolicy({ config, fullArtifact, loadedBundle, loadedWorker }) {
  const policyViewBytes = Buffer.from(canonicalize(fullArtifact.policy_view), "utf8");
  if (
    policyViewBytes.length !== fullArtifact.policy_view_utf8_bytes
    || sha256(policyViewBytes) !== fullArtifact.policy_view_sha256
  ) refuse("fixed runner policy view byte identity is false");
  const request = {
    schema: 1,
    contract_version: "fixture-026.rsd-t02-fixed-instance-isolated-request.v1",
    active_arm_ids: fullArtifact.ledger.map((record) => record.arm_id),
    policy_view_encoding: "canonical-json-utf8-base64",
    policy_view_utf8_bytes: policyViewBytes.length,
    policy_view_sha256: sha256(policyViewBytes),
    policy_view_base64: policyViewBytes.toString("base64"),
  };
  const requestBytes = Buffer.from(`${canonicalize(request)}\n`, "utf8");
  if (requestBytes.length > config.isolation.max_request_bytes) {
    refuse("isolated request exceeds its frozen byte cap");
  }
  const childResult = await launchRestrictedChild({
    workerSource: loadedWorker.text,
    bundlePath: loadedBundle.path,
    bundleSha256: config.policy_bundle.sha256,
    requestBytes,
    config,
  });
  const parsed = parseChildResponse({ childResult, requestBytes, policyViewBytes, config });
  for (const [index, response] of parsed.response.responses.entries()) {
    if (canonicalize(response) !== canonicalize(fullArtifact.ledger[index]?.response)) {
      refuse(`isolated semantic replay differs at registered arm ${index}`);
    }
  }
  const receipt = immutableCopy({
    boundary_version: "fixture-026.rsd-t02-fixed-instance-isolation-boundary.v1",
    execution_mode: config.isolation.execution_mode,
    fresh_process: true,
    filesystem_read_exposed_to_policy: false,
    filesystem_write_exposed_to_policy: false,
    network_exposed_to_policy: false,
    environment_exposed_to_policy: false,
    clock_exposed_to_policy: false,
    random_exposed_to_policy: false,
    evaluator_exposed_to_policy: false,
    dynamic_code_generation_exposed_to_policy: false,
    worker_sha256: config.worker.sha256,
    bundle_sha256: config.policy_bundle.sha256,
    canonical_request_sha256: sha256(requestBytes),
    canonical_request_bytes: requestBytes.length,
    canonical_response_sha256: sha256(parsed.responseBytes),
    canonical_response_bytes: parsed.responseBytes.length,
    policy_view_sha256: fullArtifact.policy_view_sha256,
    policy_view_utf8_bytes: policyViewBytes.length,
    response_bank_sha256: sha256Hex(canonicalize(parsed.response.responses)),
    runtime: parsed.response.runtime,
    authority: "public-development-fixed-instance-isolated-conformance-only",
    comparison_inference_permitted: false,
    claim_eligible: false,
    result_label: "NO_RESULT",
    no_result: true,
  });
  return deepFreeze({
    responses: immutableCopy(parsed.response.responses, "isolated response bank"),
    receipt,
  });
}

function ownerIdentity(ownerId) {
  if (typeof ownerId !== "string") refuse("owner ID must be a string");
  const bytes = Buffer.from(ownerId, "utf8");
  if (bytes.length < 16 || bytes.length > MAX_OWNER_ID_BYTES || ownerId.trim() !== ownerId) {
    refuse("owner ID must be trimmed UTF-8 between 16 and 1024 bytes");
  }
  return sha256(bytes);
}

function scientificPayload(record) {
  const payload = { ...record };
  delete payload.integrity;
  return payload;
}

function publicSummary({
  fullArtifact,
  config,
  ownerIdentitySha256,
  receipt,
  ledger,
  checkpointStatus,
}) {
  const ledgerSummary = ledger.summary();
  const records = ledgerSummary.records;
  return immutableCopy({
    schema: 1,
    contract_version: FIXTURE_026_RSD_T02_FIXED_INSTANCE_DURABLE_SUMMARY_VERSION,
    status: records === fullArtifact.ledger.length ? "complete" : "partial",
    run_id: fullArtifact.run_id,
    owner_identity_sha256: ownerIdentitySha256,
    fixed_instance_runner_config_sha256:
      FIXTURE_026_RSD_T02_FIXED_INSTANCE_RUNNER_CONFIG_SHA256,
    isolated_durable_config_sha256:
      FIXTURE_026_RSD_T02_FIXED_INSTANCE_ISOLATED_DURABLE_CONFIG_SHA256,
    policy_bundle_sha256: config.policy_bundle.sha256,
    worker_sha256: config.worker.sha256,
    policy_view_sha256: fullArtifact.policy_view_sha256,
    isolated_execution_receipt_sha256: sha256Hex(canonicalize(receipt)),
    records,
    registered_arms: fullArtifact.ledger.length,
    next_arm_index: records,
    scientific_payload_sha256: ledgerSummary.scientific_payload_sha256,
    hash_chain_sha256: ledgerSummary.hash_chain_sha256,
    checkpoint_status: checkpointStatus,
    foundation_gates: config.foundation_gates,
    authority: "public-development-fixed-instance-isolated-durable-conformance-only",
    comparison_inference_permitted: false,
    claim_eligible: false,
    result_label: "NO_RESULT",
    no_result: true,
  }, "durable run summary");
}

export async function openFixture026RsdT02FixedInstanceIsolatedDurableRun({
  config,
  runner_config: runnerConfig,
  registry,
  instance,
  output_directory: outputDirectory,
  owner_id: ownerId,
}) {
  const frozenConfig = immutableCopy(config, "isolated durable config");
  const frozenRunnerConfig = immutableCopy(runnerConfig, "fixed-instance runner config");
  const frozenRegistry = immutableCopy(registry, "system-family registry");
  const frozenInstance = immutableCopy(instance, "fixed instance");
  assertFixture026RsdT02FixedInstanceIsolatedDurableConfig(frozenConfig);
  assertFixture026RsdT02FixedInstanceRunnerConfig(frozenRunnerConfig);
  if (typeof outputDirectory !== "string" || outputDirectory.trim() === "") {
    refuse("output directory is required");
  }
  const resolvedOutputDirectory = path.resolve(outputDirectory);
  const ownerIdentitySha256 = ownerIdentity(ownerId);
  const fullArtifact = runFixture026RsdT02FixedInstance({
    config: frozenRunnerConfig,
    registry: frozenRegistry,
    instance: frozenInstance,
  });
  if (fullArtifact.status !== "complete" || fullArtifact.result_label !== "NO_RESULT") {
    refuse("fixed runner did not produce its complete NO_RESULT conformance artifact");
  }
  const outputIdentity = await prepareFixture026RsdT02SafeOutputDirectory(
    resolvedOutputDirectory,
  );
  const [loadedBundle, loadedWorker] = await Promise.all([
    loadExactFixtureFile(frozenConfig.policy_bundle, "content-addressed policy bundle"),
    loadExactFixtureFile(frozenConfig.worker, "isolated policy worker"),
  ]);
  const lease = await acquireFixture026RsdT02RunLock({
    outputDirectory: outputIdentity.realpath,
    runnerId: `${FIXTURE_026_RSD_T02_FIXED_INSTANCE_DISK_LEDGER_VERSION}:${ownerIdentitySha256}`,
  });
  try {
    const isolated = await executeIsolatedPolicy({
      config: frozenConfig,
      fullArtifact,
      loadedBundle,
      loadedWorker,
    });
    const runIdentity = immutableCopy({
      contract_version: FIXTURE_026_RSD_T02_FIXED_INSTANCE_DISK_LEDGER_VERSION,
      run_id: fullArtifact.run_id,
      owner_identity_sha256: ownerIdentitySha256,
      fixed_instance_runner_config_sha256:
        FIXTURE_026_RSD_T02_FIXED_INSTANCE_RUNNER_CONFIG_SHA256,
      isolated_durable_config_sha256:
        FIXTURE_026_RSD_T02_FIXED_INSTANCE_ISOLATED_DURABLE_CONFIG_SHA256,
      policy_bundle_sha256: frozenConfig.policy_bundle.sha256,
      worker_sha256: frozenConfig.worker.sha256,
      policy_view_sha256: fullArtifact.policy_view_sha256,
      isolated_execution_receipt_sha256: sha256Hex(canonicalize(isolated.receipt)),
      result_label: "NO_RESULT",
    }, "durable run identity");
    const assertDiskRecord = (record, { sequence }) => {
      const expectedFixedRecord = fullArtifact.ledger[sequence];
      const expectedIsolatedResponse = isolated.responses[sequence];
      if (
        !exactKeys(record, DISK_RECORD_KEYS)
        || record.schema !== 1
        || record.contract_version !== FIXTURE_026_RSD_T02_FIXED_INSTANCE_DISK_LEDGER_VERSION
        || record.run_id !== fullArtifact.run_id
        || record.owner_identity_sha256 !== ownerIdentitySha256
        || record.arm_index !== sequence
        || record.arm_id !== expectedFixedRecord?.arm_id
        || canonicalize(record.fixed_runner_record) !== canonicalize(expectedFixedRecord)
        || record.isolated_response_sha256
          !== sha256Hex(canonicalize(expectedIsolatedResponse))
        || !exactKeys(record.isolated_execution_receipt, RECEIPT_KEYS)
        || canonicalize(record.isolated_execution_receipt) !== canonicalize(isolated.receipt)
        || record.authority
          !== "append-only-public-development-fixed-instance-isolated-conformance-ledger"
        || record.comparison_inference_permitted !== false
        || record.claim_eligible !== false
        || record.result_label !== "NO_RESULT"
        || record.no_result !== true
      ) refuse(`disk ledger record ${sequence} differs from deterministic isolated replay`);
    };
    const ledger = await openFixture026RsdT02BoundedCheckpointLedger({
      artifact: "fixture-026",
      ledgerFormat: FIXTURE_026_RSD_T02_FIXED_INSTANCE_DISK_LEDGER_VERSION,
      outputIdentity,
      rawFilename: frozenConfig.durability.raw_path,
      checkpointFilename: frozenConfig.durability.checkpoint_path,
      maximumRecords: frozenConfig.durability.max_records,
      maximumRawBytes: frozenConfig.durability.max_raw_bytes,
      maximumCheckpointBytes: frozenConfig.durability.max_checkpoint_bytes,
      runIdentity,
      scientificPayload,
      workKey: (record) => record.arm_id,
      assertRecord: assertDiskRecord,
    });
    let checkpointStatus = ledger.summary().checkpoint_status;
    let sessionState = "open";
    let operationTail = Promise.resolve();
    let closePromise = null;
    const assertOpen = () => {
      if (sessionState !== "open") refuse(`session is ${sessionState}`);
    };
    const summary = () => publicSummary({
      fullArtifact,
      config: frozenConfig,
      ownerIdentitySha256,
      receipt: isolated.receipt,
      ledger,
      checkpointStatus,
    });
    const queueOperation = (operation) => {
      assertOpen();
      const scheduled = operationTail.then(operation);
      operationTail = scheduled.then(() => undefined, () => undefined);
      return scheduled;
    };
    const appendNextInternal = async () => {
      const index = ledger.summary().records;
      if (index >= fullArtifact.ledger.length) return summary();
      const fixedRecord = fullArtifact.ledger[index];
      const isolatedResponse = isolated.responses[index];
      await ledger.append({
        schema: 1,
        contract_version: FIXTURE_026_RSD_T02_FIXED_INSTANCE_DISK_LEDGER_VERSION,
        run_id: fullArtifact.run_id,
        owner_identity_sha256: ownerIdentitySha256,
        arm_index: index,
        arm_id: fixedRecord.arm_id,
        fixed_runner_record: fixedRecord,
        isolated_response_sha256: sha256Hex(canonicalize(isolatedResponse)),
        isolated_execution_receipt: isolated.receipt,
        authority: "append-only-public-development-fixed-instance-isolated-conformance-ledger",
        comparison_inference_permitted: false,
        claim_eligible: false,
        result_label: "NO_RESULT",
        no_result: true,
      });
      checkpointStatus = "stale";
      return summary();
    };
    const saveCheckpointInternal = async () => {
      await ledger.saveCheckpoint();
      checkpointStatus = "current";
      return summary();
    };
    return Object.freeze({
      paths: immutableCopy({
        raw_path: ledger.paths.rawPath,
        checkpoint_path: ledger.paths.checkpointPath,
      }, "durable paths"),
      isolated_execution_receipt: immutableCopy(
        isolated.receipt,
        "public isolated execution receipt",
      ),
      summary() {
        assertOpen();
        return summary();
      },
      appendNext() {
        return queueOperation(appendNextInternal);
      },
      appendRemaining({ checkpoint_each: checkpointEach = true } = {}) {
        if (typeof checkpointEach !== "boolean") refuse("checkpoint_each must be boolean");
        return queueOperation(async () => {
          while (ledger.summary().records < fullArtifact.ledger.length) {
            await appendNextInternal();
            if (checkpointEach) await saveCheckpointInternal();
          }
          return summary();
        });
      },
      saveCheckpoint() {
        return queueOperation(saveCheckpointInternal);
      },
      close() {
        if (closePromise !== null) return closePromise;
        assertOpen();
        sessionState = "closing";
        closePromise = (async () => {
          await operationTail;
          const finalSummary = summary();
          try {
            await ledger.close();
          } finally {
            try {
              await lease.release();
            } finally {
              sessionState = "closed";
            }
          }
          return finalSummary;
        })();
        return closePromise;
      },
    });
  } catch (error) {
    await lease.release().catch(() => {});
    throw error;
  }
}
