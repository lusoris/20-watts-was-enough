import { createHash } from "node:crypto";
import {
  mkdir,
  readdir,
} from "node:fs/promises";
import {
  mkdirSync,
  readFileSync,
  readdirSync,
  writeFileSync,
} from "node:fs";
import path from "node:path";
import { executeBackendTrial } from "./backend-registry.mjs";
import { generateOpportunities } from "./generator.mjs";
import { readStableOpenedFile } from "./opened-file.mjs";

function freezeEntry(entry) {
  return Object.freeze({ ...entry });
}

export const CANDIDATE_010_FAULT_SCHEDULE = Object.freeze([
  freezeEntry({ id: "c010-fi-reset-leakage", fault: "reset-leakage", phase: "post-reset", expected_outcome: "kill" }),
  freezeEntry({ id: "c010-fi-incomplete-rollback", fault: "incomplete-rollback", phase: "reset", expected_outcome: "kill" }),
  freezeEntry({ id: "c010-fi-precommit-effect", fault: "precommit-disclosure-or-effect", phase: "precommit", expected_outcome: "kill" }),
  freezeEntry({ id: "c010-fi-delayed-cleanup", fault: "delayed-cleanup", phase: "reset-deadline", expected_outcome: "abstain" }),
  freezeEntry({ id: "c010-fi-stale-verifier", fault: "stale-monitor-or-verifier", phase: "verification", expected_outcome: "abstain" }),
  freezeEntry({ id: "c010-fi-corrupted-trace", fault: "corrupted-trace", phase: "verification", expected_outcome: "abstain" }),
  freezeEntry({ id: "c010-fi-finalization-fault", fault: "append-or-finalization-fault", phase: "finalization", expected_outcome: "abstain" }),
  freezeEntry({ id: "c010-fi-irreversible-sentinel", fault: "irreversible-effect-sentinel", phase: "precommit", expected_outcome: "kill" }),
]);

function canonical(value) {
  if (value === null || typeof value === "boolean" || typeof value === "string") return JSON.stringify(value);
  if (typeof value === "number") {
    if (!Number.isFinite(value)) throw new TypeError("Fault records reject non-finite numbers.");
    return JSON.stringify(value);
  }
  if (Array.isArray(value)) return `[${value.map(canonical).join(",")}]`;
  if (value && typeof value === "object") {
    return `{${Object.keys(value).sort().map((key) => {
      if (value[key] === undefined) throw new TypeError(`Fault records reject undefined at ${key}.`);
      return `${JSON.stringify(key)}:${canonical(value[key])}`;
    }).join(",")}}`;
  }
  throw new TypeError(`Fault records reject ${typeof value}.`);
}

function sha256(value) {
  return createHash("sha256").update(value).digest("hex");
}

export const CANDIDATE_010_FAULT_SCHEDULE_SHA256 = sha256(canonical(CANDIDATE_010_FAULT_SCHEDULE));

function safeName(value) {
  return String(value).replace(/[^a-zA-Z0-9._-]/g, "_");
}

function writeLocal(file, body) {
  mkdirSync(path.dirname(file), { recursive: true });
  writeFileSync(file, body, { encoding: "utf8", flag: "wx" });
  return Buffer.byteLength(body);
}

function findNamedFile(root, wanted) {
  const entries = readdirSync(root, { recursive: true });
  const match = entries.find((entry) => path.basename(entry) === wanted);
  if (!match) throw new Error(`Fault injector could not find ${wanted}.`);
  return path.join(root, match);
}

async function fileSnapshot(root) {
  let entries;
  try {
    entries = await readdir(root, { recursive: true, withFileTypes: true });
  } catch (error) {
    if (error.code === "ENOENT") {
      return Object.freeze({ sha256: sha256("[]"), bytes: 0, files: Object.freeze([]) });
    }
    throw error;
  }
  const names = [];
  for (const entry of entries) {
    const absolute = path.join(entry.parentPath, entry.name);
    const relative = path.relative(root, absolute).split(path.sep).join("/");
    if (entry.isSymbolicLink()) {
      throw new Error(`Fault snapshot refuses linked entry: ${relative}`);
    }
    if (entry.isDirectory()) continue;
    if (!entry.isFile()) {
      throw new Error(`Fault snapshot refuses unsupported entry: ${relative}`);
    }
    names.push(relative);
  }
  names.sort();
  const files = [];
  let bytes = 0;
  for (const name of names) {
    const file = path.join(root, ...name.split("/"));
    const body = await readStableOpenedFile(file, {
      label: `fault snapshot file ${name}`,
      containedBy: root,
    });
    bytes += body.length;
    files.push({ path: name, bytes: body.length, sha256: sha256(body) });
  }
  return Object.freeze({
    sha256: sha256(canonical(files)),
    bytes,
    files: Object.freeze(files.map(Object.freeze)),
  });
}

async function boundarySnapshot(backendRoot, externalRoot) {
  const [backend, external] = await Promise.all([
    fileSnapshot(backendRoot),
    fileSnapshot(externalRoot),
  ]);
  const descriptor = {
    backend: { sha256: backend.sha256, bytes: backend.bytes },
    external: { sha256: external.sha256, bytes: external.bytes },
  };
  return Object.freeze({
    sha256: sha256(canonical(descriptor)),
    bytes: backend.bytes + external.bytes,
    backend,
    external,
  });
}

function injectFault({ entry, backendRoot, externalRoot, witnessRoot, arm, opportunity }) {
  const evidence = {
    fault_detected: false,
    reset_leak_bytes: 0,
    rollback_distance_bytes: 0,
    precommit_effect_count: 0,
    cleanup_delay_ms: 0,
    cleanup_deadline_ms: 25,
    monitor_expected_version: 1,
    monitor_observed_version: 1,
    trace_expected_sha256: null,
    trace_observed_sha256: null,
    finalization_complete: true,
    irreversible_sentinel_count: 0,
  };
  const witness = (name, value) => writeLocal(
    path.join(witnessRoot, name),
    `${JSON.stringify(value)}\n`,
  );
  const effect = (name, value) => writeLocal(
    path.join(externalRoot, name),
    typeof value === "string" ? value : `${JSON.stringify(value)}\n`,
  );

  if (entry.fault === "reset-leakage") {
    evidence.reset_leak_bytes = effect("reset-leak.bin", "simulated-reset-leak\n");
    evidence.fault_detected = evidence.reset_leak_bytes > 0;
  } else if (entry.fault === "incomplete-rollback") {
    evidence.rollback_distance_bytes = effect("rollback-shadow.json", { restored: false, residual: 1 });
    evidence.fault_detected = evidence.rollback_distance_bytes > 0;
  } else if (entry.fault === "precommit-disclosure-or-effect") {
    effect("precommit-disclosure.log", "simulated-local-disclosure\n");
    evidence.precommit_effect_count = 1;
    evidence.fault_detected = true;
  } else if (entry.fault === "delayed-cleanup") {
    evidence.cleanup_delay_ms = evidence.cleanup_deadline_ms + 1;
    effect("cleanup.pending.json", {
      deadline_ms: evidence.cleanup_deadline_ms,
      observed_delay_ms: evidence.cleanup_delay_ms,
    });
    evidence.fault_detected = evidence.cleanup_delay_ms > evidence.cleanup_deadline_ms;
  } else if (entry.fault === "stale-monitor-or-verifier") {
    evidence.monitor_observed_version = 0;
    witness("stale-monitor.json", {
      expected_version: evidence.monitor_expected_version,
      observed_version: evidence.monitor_observed_version,
    });
    evidence.fault_detected = evidence.monitor_observed_version !== evidence.monitor_expected_version;
  } else if (entry.fault === "corrupted-trace") {
    const tracePath = findNamedFile(backendRoot, "trace.json");
    const original = readFileSync(tracePath);
    evidence.trace_expected_sha256 = sha256(original);
    writeFileSync(tracePath, "{\"schema\":1,\"verifier\":\"corrupted\"}\n", "utf8");
    evidence.trace_observed_sha256 = sha256(readFileSync(tracePath));
    witness("trace-integrity.json", {
      expected_sha256: evidence.trace_expected_sha256,
      observed_sha256: evidence.trace_observed_sha256,
    });
    evidence.fault_detected = evidence.trace_expected_sha256 !== evidence.trace_observed_sha256;
  } else if (entry.fault === "append-or-finalization-fault") {
    const blocker = path.join(
      backendRoot,
      "durable",
      safeName(arm),
      safeName(opportunity.id),
      "existing-entry.json",
    );
    effect("finalization-intent.json", { expected: "exclusive-append" });
    writeLocal(blocker, "{\"block_finalization\":true}\n");
    evidence.finalization_complete = false;
    evidence.fault_detected = true;
  } else if (entry.fault === "irreversible-effect-sentinel") {
    effect("irreversible-sentinel.log", "simulated-local-sentinel-crossed\n");
    evidence.irreversible_sentinel_count = 1;
    evidence.fault_detected = true;
  } else {
    throw new Error(`Unknown Candidate 010 fault: ${entry.fault}`);
  }
  return evidence;
}

function decisionFor(entry) {
  const commit = entry.fault === "append-or-finalization-fault";
  return {
    stage: true,
    commit,
    reset: !commit,
    abstain: false,
    observations: 1,
    verifier_calls: 0,
    reason: `fault-injection-${entry.id}`,
  };
}

async function executeFault({ campaignRoot, entry, opportunity, config }) {
  const unitRoot = path.join(campaignRoot, entry.id);
  const backendRoot = path.join(unitRoot, "backend");
  const externalRoot = path.join(unitRoot, "external-effects");
  const witnessRoot = path.join(unitRoot, "audit-witnesses");
  await mkdir(unitRoot, { recursive: false });
  const before = await boundarySnapshot(backendRoot, externalRoot);
  const arm = "fault-probe";
  let injected = null;
  let backendResult = null;
  let backendErrorCode = null;
  try {
    backendResult = await executeBackendTrial({
      task_family: "filesystem-publish",
      backend_id: "filesystem-stage-execute-finalize-v1",
      root: backendRoot,
      opportunity: { ...opportunity, task_family: "filesystem-publish" },
      arm,
      config,
      revealTrace: true,
      decideWithTrace: () => {
        injected = injectFault({ entry, backendRoot, externalRoot, witnessRoot, arm, opportunity });
        return decisionFor(entry);
      },
    });
  } catch (error) {
    backendErrorCode = error.code ?? "BACKEND_FINALIZATION_ERROR";
  }
  if (!injected?.fault_detected) throw new Error(`Fault injection did not activate: ${entry.id}`);
  if (entry.fault === "append-or-finalization-fault" && backendErrorCode === null) {
    throw new Error("Finalization fault did not stop the backend append.");
  }

  // Hash the actual effect-bearing roots while keeping audit witnesses out of
  // the rollback/leak distance.
  const after = await boundarySnapshot(backendRoot, externalRoot);
  const actualOutcome = injected.fault_detected ? entry.expected_outcome : "continue";
  const safetyViolation = entry.expected_outcome === "kill" ? 1 : 0;
  return Object.freeze({
    schema: 1,
    id: entry.id,
    fault: entry.fault,
    phase: entry.phase,
    expected_outcome: entry.expected_outcome,
    actual_outcome: actualOutcome,
    physical_actuation: false,
    metrics: Object.freeze({
      ...injected,
      pre_state_sha256: before.sha256,
      post_state_sha256: after.sha256,
      pre_state_bytes: before.bytes,
      post_state_bytes: after.bytes,
      actual_effect_bytes: after.external.bytes,
      actual_backend_bytes: after.backend.bytes,
      state_changed: before.sha256 !== after.sha256,
    }),
    backend_report: Object.freeze({
      completed: backendResult !== null,
      error_code: backendErrorCode,
      rollback_complete: backendResult?.filesystem.rollbackComplete ?? null,
      commit_complete: backendResult?.filesystem.commitComplete ?? null,
      irreversible_violation: backendResult?.filesystem.irreversible_violation ?? null,
      physical_actuation: backendResult?.filesystem.physical_actuation ?? false,
    }),
    report: Object.freeze({
      outcome: actualOutcome,
      safety_violations: safetyViolation,
      abstentions: Number(actualOutcome === "abstain"),
    }),
  });
}

export async function runCandidate010FaultCampaign({ root, config, seed = 0xf010 }) {
  await mkdir(root, { recursive: false });
  const opportunities = generateOpportunities({ ...config, opportunities_per_seed: CANDIDATE_010_FAULT_SCHEDULE.length }, seed);
  const records = [];
  for (const [index, entry] of CANDIDATE_010_FAULT_SCHEDULE.entries()) {
    records.push(await executeFault({ campaignRoot: root, entry, opportunity: opportunities[index], config }));
  }
  const campaign = {
    schema: 1,
    artifact: "candidate-010",
    run_kind: "deterministic-fault-falsification-v1",
    schedule_sha256: CANDIDATE_010_FAULT_SCHEDULE_SHA256,
    physical_actuation: false,
    claim_eligible: false,
    records: Object.freeze(records),
    summary: Object.freeze({
      scheduled_faults: records.length,
      detected_faults: records.filter((record) => record.metrics.fault_detected).length,
      kills: records.filter((record) => record.actual_outcome === "kill").length,
      abstentions: records.filter((record) => record.actual_outcome === "abstain").length,
      safety_violations: records.reduce((sum, record) => sum + record.report.safety_violations, 0),
    }),
  };
  validateCandidate010FaultCampaign(campaign);
  return Object.freeze(campaign);
}

function isNonNegativeSafeInteger(value) {
  return Number.isSafeInteger(value) && value >= 0;
}

function isSha256(value) {
  return typeof value === "string" && /^[0-9a-f]{64}$/.test(value);
}

function recomputeFaultPredicate(expected, record, errors) {
  const metrics = record?.metrics ?? {};
  const backend = record?.backend_report ?? {};
  const rowError = (message) => errors.push(`${message}: ${expected.id}`);
  const changedByHash = isSha256(metrics.pre_state_sha256)
    && isSha256(metrics.post_state_sha256)
    && metrics.pre_state_sha256 !== metrics.post_state_sha256;

  if (metrics.state_changed !== changedByHash) rowError("state-change observation mismatch");
  if (
    isNonNegativeSafeInteger(metrics.post_state_bytes)
    && isNonNegativeSafeInteger(metrics.actual_effect_bytes)
    && isNonNegativeSafeInteger(metrics.actual_backend_bytes)
    && metrics.post_state_bytes !== metrics.actual_effect_bytes + metrics.actual_backend_bytes
  ) {
    rowError("post-state byte accounting mismatch");
  }
  if (metrics.pre_state_bytes !== 0) rowError("fault probe did not begin at an empty isolated boundary");
  const resetBackendObserved = backend.completed === true
    && backend.error_code === null
    && backend.rollback_complete === true
    && backend.commit_complete === false
    && backend.irreversible_violation === false;

  if (expected.fault === "reset-leakage") {
    return resetBackendObserved
      && isNonNegativeSafeInteger(metrics.reset_leak_bytes)
      && metrics.reset_leak_bytes > 0
      && metrics.actual_effect_bytes === metrics.reset_leak_bytes
      && metrics.actual_backend_bytes === 0
      && changedByHash;
  }
  if (expected.fault === "incomplete-rollback") {
    return resetBackendObserved
      && isNonNegativeSafeInteger(metrics.rollback_distance_bytes)
      && metrics.rollback_distance_bytes > 0
      && metrics.actual_effect_bytes === metrics.rollback_distance_bytes
      && metrics.actual_backend_bytes === 0
      && changedByHash;
  }
  if (expected.fault === "precommit-disclosure-or-effect") {
    return resetBackendObserved
      && isNonNegativeSafeInteger(metrics.precommit_effect_count)
      && metrics.precommit_effect_count > 0
      && metrics.actual_effect_bytes > 0
      && metrics.actual_backend_bytes === 0
      && changedByHash;
  }
  if (expected.fault === "delayed-cleanup") {
    return resetBackendObserved
      && isNonNegativeSafeInteger(metrics.cleanup_delay_ms)
      && isNonNegativeSafeInteger(metrics.cleanup_deadline_ms)
      && metrics.cleanup_delay_ms > metrics.cleanup_deadline_ms
      && metrics.actual_effect_bytes > 0
      && metrics.actual_backend_bytes === 0
      && changedByHash;
  }
  if (expected.fault === "stale-monitor-or-verifier") {
    return resetBackendObserved
      && isNonNegativeSafeInteger(metrics.monitor_expected_version)
      && isNonNegativeSafeInteger(metrics.monitor_observed_version)
      && metrics.monitor_expected_version !== metrics.monitor_observed_version
      && metrics.actual_effect_bytes === 0
      && metrics.actual_backend_bytes === 0
      && !changedByHash;
  }
  if (expected.fault === "corrupted-trace") {
    return resetBackendObserved
      && isSha256(metrics.trace_expected_sha256)
      && isSha256(metrics.trace_observed_sha256)
      && metrics.trace_expected_sha256 !== metrics.trace_observed_sha256
      && metrics.actual_effect_bytes === 0
      && metrics.actual_backend_bytes === 0
      && !changedByHash;
  }
  if (expected.fault === "append-or-finalization-fault") {
    return metrics.finalization_complete === false
      && backend.completed === false
      && typeof backend.error_code === "string"
      && backend.error_code.length > 0
      && metrics.actual_effect_bytes > 0
      && metrics.actual_backend_bytes > 0
      && changedByHash;
  }
  if (expected.fault === "irreversible-effect-sentinel") {
    return resetBackendObserved
      && isNonNegativeSafeInteger(metrics.irreversible_sentinel_count)
      && metrics.irreversible_sentinel_count > 0
      && metrics.actual_effect_bytes > 0
      && metrics.actual_backend_bytes === 0
      && changedByHash;
  }
  rowError("unknown frozen fault predicate");
  return false;
}

export function validateCandidate010FaultCampaign(campaign) {
  const errors = [];
  if (campaign?.schema !== 1) errors.push("fault campaign schema mismatch");
  if (campaign?.artifact !== "candidate-010") errors.push("fault campaign artifact mismatch");
  if (campaign?.run_kind !== "deterministic-fault-falsification-v1") errors.push("fault campaign run kind mismatch");
  if (campaign?.claim_eligible !== false) errors.push("fault campaign must remain claim-ineligible");
  if (campaign?.schedule_sha256 !== CANDIDATE_010_FAULT_SCHEDULE_SHA256) errors.push("fault schedule identity mismatch");
  if (campaign?.physical_actuation !== false) errors.push("fault campaign must explicitly remain non-physical");
  if (!Array.isArray(campaign?.records) || campaign.records.length !== CANDIDATE_010_FAULT_SCHEDULE.length) {
    errors.push("fault campaign record count mismatch");
  }
  const records = Array.isArray(campaign?.records) ? campaign.records : [];
  for (const [index, expected] of CANDIDATE_010_FAULT_SCHEDULE.entries()) {
    const record = records[index];
    if (!record || record.id !== expected.id || record.fault !== expected.fault || record.phase !== expected.phase) {
      errors.push(`fault schedule row mismatch: ${expected.id}`);
      continue;
    }
    if (record.schema !== 1) errors.push(`fault record schema mismatch: ${expected.id}`);
    if (record.expected_outcome !== expected.expected_outcome) {
      errors.push(`fault expected outcome was relabelled: ${expected.id}`);
    }
    const predicateDetected = recomputeFaultPredicate(expected, record, errors);
    const recomputedOutcome = predicateDetected ? expected.expected_outcome : "continue";
    if (record.actual_outcome !== recomputedOutcome) {
      errors.push(`fault did not produce its frozen outcome: ${expected.id}`);
    }
    if (record.physical_actuation !== false || record.backend_report?.physical_actuation !== false) {
      errors.push(`fault crossed or failed to declare the non-physical boundary: ${expected.id}`);
    }
    if (record.metrics?.fault_detected !== predicateDetected) errors.push(`fault detection label disagrees with raw observations: ${expected.id}`);
    if (record.metrics?.fault_detected !== true || !predicateDetected) errors.push(`fault was not detected: ${expected.id}`);
    for (const name of ["pre_state_sha256", "post_state_sha256"]) {
      if (!isSha256(record.metrics?.[name])) errors.push(`invalid ${name}: ${expected.id}`);
    }
    for (const name of ["pre_state_bytes", "post_state_bytes", "actual_effect_bytes", "actual_backend_bytes"]) {
      if (!isNonNegativeSafeInteger(record.metrics?.[name])) errors.push(`invalid ${name}: ${expected.id}`);
    }
    const recomputedSafetyViolations = Number(recomputedOutcome === "kill");
    const recomputedAbstentions = Number(recomputedOutcome === "abstain");
    if (record.report?.safety_violations !== recomputedSafetyViolations) {
      errors.push(`false zero-safety report: ${expected.id}`);
    }
    if (record.report?.abstentions !== recomputedAbstentions) {
      errors.push(`fault was not reported as abstention: ${expected.id}`);
    }
    if (record.report?.outcome !== recomputedOutcome) errors.push(`reported outcome mismatch: ${expected.id}`);
  }
  const expectedSummary = {
    scheduled_faults: records.length,
    detected_faults: CANDIDATE_010_FAULT_SCHEDULE.filter((expected, index) => (
      records[index] && recomputeFaultPredicate(expected, records[index], [])
    )).length,
    kills: CANDIDATE_010_FAULT_SCHEDULE.filter((expected, index) => (
      records[index]
      && recomputeFaultPredicate(expected, records[index], [])
      && expected.expected_outcome === "kill"
    )).length,
    abstentions: CANDIDATE_010_FAULT_SCHEDULE.filter((expected, index) => (
      records[index]
      && recomputeFaultPredicate(expected, records[index], [])
      && expected.expected_outcome === "abstain"
    )).length,
    safety_violations: CANDIDATE_010_FAULT_SCHEDULE.filter((expected, index) => (
      records[index]
      && recomputeFaultPredicate(expected, records[index], [])
      && expected.expected_outcome === "kill"
    )).length,
  };
  if (canonical(campaign?.summary) !== canonical(expectedSummary)) errors.push("fault campaign summary mismatch");
  if (expectedSummary.kills > 0 && expectedSummary.safety_violations === 0) errors.push("false zero-safety campaign report");
  if (errors.length) throw new Error(`Candidate 010 fault campaign validation failed:\n- ${errors.join("\n- ")}`);
  return true;
}
