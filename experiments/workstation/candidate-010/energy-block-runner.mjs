import { createHash } from "node:crypto";
import {
  lstat,
  mkdir,
  open,
  readdir,
  realpath,
} from "node:fs/promises";
import path from "node:path";
import { ENERGY_BLOCK_SCHEDULE_VERSION } from "./energy-acquisition.mjs";
import { readStableOpenedFile } from "./opened-file.mjs";

export const ENERGY_BLOCK_RUNNER_VERSION = "candidate-010.energy-block-runner.v1";
export const ENERGY_BLOCK_ADAPTER_INPUT_VERSION = "candidate-010.energy-block-adapter-input.v1";
export const ENERGY_BLOCK_RECORD_VERSION = "candidate-010.energy-block-execution-record.v1";
export const ENERGY_BLOCK_BUNDLE_VERSION = "candidate-010.energy-block-execution-bundle.v1";
export const ENERGY_BLOCK_PLAN_VERSION = "candidate-010.energy-block-execution-plan.v1";

const ADAPTER_KEYS = Object.freeze([
  "adapter_id",
  "adapter_version",
  "fixture_only",
  "implementation_sha256",
  "execute_work_unit",
  "execute_idle_block",
]);
const ADAPTER_IDENTITY_KEYS = Object.freeze([
  "adapter_id",
  "adapter_version",
  "fixture_only",
  "implementation_sha256",
]);
const RESOURCE_KEYS = Object.freeze([
  "cpu_user_us",
  "cpu_system_us",
  "max_rss_bytes",
  "read_bytes",
  "written_bytes",
  "operation_count",
]);
const SUMMARY_KEYS = Object.freeze([
  "correct_commits",
  "incorrect_commits",
  "no_commits",
  "idle_blocks",
  ...RESOURCE_KEYS,
]);
const WORK_OUTPUT_KEYS = Object.freeze(["schema", "status", "result_sha256", "resources"]);
const IDLE_OUTPUT_KEYS = Object.freeze(["schema", "status", "result_sha256", "resources"]);
const OUTCOME_KEYS = Object.freeze([
  "schema",
  "contract_version",
  "invocation_index",
  "opportunity_index",
  "opportunity_repetition",
  "opportunity_id",
  "input_sha256",
  "started_at",
  "ended_at",
  "elapsed_ns",
  "status",
  "result_sha256",
  "resources",
  "outcome_sha256",
]);
const IDLE_OBSERVATION_KEYS = Object.freeze([
  "schema",
  "contract_version",
  "input_sha256",
  "started_at",
  "ended_at",
  "elapsed_ns",
  "status",
  "result_sha256",
  "resources",
  "observation_sha256",
]);
const RECORD_KEYS = Object.freeze([
  "schema",
  "contract_version",
  "runner_version",
  "schedule_sha256",
  "run_id",
  "claim_eligible",
  "claim_eligibility",
  "adapter",
  "block",
  "block_sha256",
  "started_at",
  "ended_at",
  "elapsed_ns",
  "invocation_count",
  "outcomes",
  "idle_observation",
  "summary",
  "external_meter_observation",
  "record_sha256",
]);

export class EnergyBlockRunnerError extends Error {
  constructor(code, message, cause = undefined) {
    super(`${code}: ${message}`, cause === undefined ? undefined : { cause });
    this.name = "EnergyBlockRunnerError";
    this.code = code;
  }
}

function fail(code, message, cause = undefined) {
  throw new EnergyBlockRunnerError(code, message, cause);
}

function canonical(value) {
  if (Array.isArray(value)) return `[${value.map(canonical).join(",")}]`;
  if (value && typeof value === "object") {
    return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${canonical(value[key])}`).join(",")}}`;
  }
  return JSON.stringify(value);
}

function sha256(value) {
  return createHash("sha256").update(value).digest("hex");
}

function digestBody(document, digestField) {
  const body = { ...document };
  delete body[digestField];
  return sha256(canonical(body));
}

function exactObject(value, keys, label, code = "INVALID_SHAPE") {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    fail(code, `${label} must be an object`);
  }
  if (canonical(Object.keys(value).sort()) !== canonical([...keys].sort())) {
    fail(code, `${label} has an inexact field set`);
  }
  return value;
}

function nonEmpty(value, label, code = "INVALID_IDENTITY") {
  if (typeof value !== "string" || value.trim().length === 0) fail(code, `${label} must be non-empty`);
  return value;
}

function sha256Identity(value, label, code = "INVALID_IDENTITY") {
  if (!/^[0-9a-f]{64}$/.test(value ?? "")) fail(code, `${label} must be a lowercase SHA-256 digest`);
  return value;
}

function nonNegativeInteger(value, label, code = "INVALID_RESOURCE") {
  if (!Number.isSafeInteger(value) || value < 0) fail(code, `${label} must be a non-negative safe integer`);
  return value;
}

function positiveInteger(value, label, code = "INVALID_COUNT") {
  if (!Number.isSafeInteger(value) || value < 1) fail(code, `${label} must be a positive safe integer`);
  return value;
}

function exactUtc(value, label, code = "INVALID_CLOCK") {
  const parsed = Date.parse(value);
  if (
    typeof value !== "string"
    || !value.endsWith("Z")
    || !Number.isFinite(parsed)
    || new Date(parsed).toISOString() !== value
  ) fail(code, `${label} must be an exact UTC instant`);
  return parsed;
}

function nanoseconds(value, label, code = "INVALID_CLOCK") {
  if (typeof value !== "string" || !/^(0|[1-9][0-9]*)$/.test(value)) {
    fail(code, `${label} must be a canonical non-negative integer string`);
  }
  return BigInt(value);
}

function addSafe(left, right, label) {
  const result = left + right;
  if (!Number.isSafeInteger(result)) fail("RESOURCE_OVERFLOW", `${label} exceeds safe integer range`);
  return result;
}

function deepFreeze(value) {
  if (!value || typeof value !== "object" || Object.isFrozen(value)) return value;
  for (const child of Object.values(value)) deepFreeze(child);
  return Object.freeze(value);
}

function samePath(left, right) {
  const normalize = (value) => process.platform === "win32"
    ? path.resolve(value).toLowerCase()
    : path.resolve(value);
  return normalize(left) === normalize(right);
}

function blockDigest(block) {
  return sha256(canonical(block));
}

function pairedInputDigest(manifest, opportunityRepetitions) {
  return sha256(canonical({
    input_manifest_sha256: manifest.input_manifest_sha256,
    ordered_opportunity_ids: manifest.ordered_opportunity_ids,
    opportunity_repetitions: opportunityRepetitions,
  }));
}

function pairedBlockId(pairedInputSha256, repetition) {
  return `energy-pair-${sha256(`${pairedInputSha256}\0${repetition}`).slice(0, 24)}`;
}

function expectedBlockId(clusterId, phase, repetition, sequence, arm = "none") {
  return `energy-${sha256(`${clusterId}\0${phase}\0${repetition}\0${sequence}\0${arm}`).slice(0, 24)}`;
}

function rotationFor(clusterId, repetition, armCount) {
  return Number.parseInt(sha256(`${clusterId}\0${repetition}`).slice(0, 8), 16) % armCount;
}

function counterbalancedArmOrder(arms, clusterId, repetition) {
  const offset = rotationFor(clusterId, repetition, arms.length);
  const rotated = [...arms.slice(offset), ...arms.slice(0, offset)];
  return repetition % 2 === 0 ? rotated : [...rotated].reverse();
}

function scheduleManifestKey(scenarioId, seed) {
  return `${scenarioId}\0${seed}`;
}

function assertManifest(manifest, index, expectedOpportunityCount) {
  exactObject(manifest, [
    "input_manifest_id",
    "scenario_id",
    "seed",
    "ordered_opportunity_ids",
    "input_manifest_sha256",
  ], `ordered_input_manifests[${index}]`, "INVALID_SCHEDULE");
  nonEmpty(manifest.input_manifest_id, `ordered_input_manifests[${index}].input_manifest_id`, "INVALID_SCHEDULE");
  nonEmpty(manifest.scenario_id, `ordered_input_manifests[${index}].scenario_id`, "INVALID_SCHEDULE");
  nonNegativeInteger(manifest.seed, `ordered_input_manifests[${index}].seed`, "INVALID_SCHEDULE");
  if (
    !Array.isArray(manifest.ordered_opportunity_ids)
    || manifest.ordered_opportunity_ids.length !== expectedOpportunityCount
  ) fail("INPUT_COUNT_MISMATCH", `ordered_input_manifests[${index}] has the wrong opportunity count`);
  for (const [opportunityIndex, opportunityId] of manifest.ordered_opportunity_ids.entries()) {
    nonEmpty(
      opportunityId,
      `ordered_input_manifests[${index}].ordered_opportunity_ids[${opportunityIndex}]`,
      "INVALID_SCHEDULE",
    );
  }
  if (new Set(manifest.ordered_opportunity_ids).size !== manifest.ordered_opportunity_ids.length) {
    fail("INPUT_SUBSTITUTION", `ordered_input_manifests[${index}] contains duplicate opportunity identities`);
  }
  const unsigned = {
    input_manifest_id: manifest.input_manifest_id,
    scenario_id: manifest.scenario_id,
    seed: manifest.seed,
    ordered_opportunity_ids: manifest.ordered_opportunity_ids,
  };
  if (manifest.input_manifest_sha256 !== sha256(canonical(unsigned))) {
    fail("INPUT_HASH_DRIFT", `ordered_input_manifests[${index}] digest differs from its exact ordered inputs`);
  }
  return manifest;
}

function blockKeys(phase) {
  const common = [
    "block_id",
    "sequence",
    "phase",
    "observed",
    "analysis_role",
    "cluster_id",
    "scenario_id",
    "task_family",
    "backend_id",
    "seed",
    "arm",
    "repetition",
    "opportunities",
    "opportunity_repetitions",
  ];
  return phase === "warmup" ? common : [
    ...common,
    "block_pair_id",
    "paired_input_sha256",
    "input_manifest_id",
    "input_manifest_sha256",
  ];
}

function assertBlock(block, index, schedule, manifests) {
  if (!block || typeof block !== "object" || Array.isArray(block)) {
    fail("INVALID_SCHEDULE", `blocks[${index}] must be an object`);
  }
  if (!["warmup", "measure", "idle-before", "idle-after"].includes(block.phase)) {
    fail("INVALID_SCHEDULE", `blocks[${index}] has an unsupported phase`);
  }
  exactObject(block, blockKeys(block.phase), `blocks[${index}]`, "INVALID_SCHEDULE");
  if (!/^energy-[0-9a-f]{24}$/.test(block.block_id ?? "")) {
    fail("INVALID_SCHEDULE", `blocks[${index}].block_id is invalid`);
  }
  if (block.sequence !== index) fail("ORDER_MISMATCH", `blocks[${index}] sequence is not contiguous`);
  nonEmpty(block.cluster_id, `blocks[${index}].cluster_id`, "INVALID_SCHEDULE");
  nonEmpty(block.scenario_id, `blocks[${index}].scenario_id`, "INVALID_SCHEDULE");
  nonEmpty(block.task_family, `blocks[${index}].task_family`, "INVALID_SCHEDULE");
  nonEmpty(block.backend_id, `blocks[${index}].backend_id`, "INVALID_SCHEDULE");
  nonNegativeInteger(block.seed, `blocks[${index}].seed`, "INVALID_SCHEDULE");
  nonNegativeInteger(block.repetition, `blocks[${index}].repetition`, "INVALID_SCHEDULE");
  if (block.cluster_id !== `${block.scenario_id}:${block.seed}`) {
    fail("INPUT_OWNERSHIP_MISMATCH", `blocks[${index}] cluster differs from scenario and seed ownership`);
  }
  const manifest = manifests.get(scheduleManifestKey(block.scenario_id, block.seed));
  if (!manifest) fail("INPUT_OWNERSHIP_MISMATCH", `blocks[${index}] has no ordered input manifest`);

  if (block.phase === "warmup") {
    if (
      block.observed !== false
      || block.analysis_role !== "excluded-warmup"
      || typeof block.arm !== "string"
      || block.arm.length === 0
      || block.opportunities !== schedule.fixed_work.warmup_opportunities
      || block.opportunity_repetitions !== 1
      || block.opportunities > manifest.ordered_opportunity_ids.length
    ) fail("INVALID_SCHEDULE", `blocks[${index}] violates the warmup contract`);
    return block;
  }

  if (block.phase === "measure") {
    const pairedInputSha256 = pairedInputDigest(manifest, block.opportunity_repetitions);
    if (
      block.observed !== true
      || block.analysis_role !== "gross-arm-energy-no-idle-subtraction"
      || typeof block.arm !== "string"
      || block.arm.length === 0
      || block.opportunities !== schedule.fixed_work.opportunities_per_block
      || block.opportunity_repetitions !== schedule.fixed_work.opportunity_repetitions
      || block.input_manifest_id !== manifest.input_manifest_id
      || block.input_manifest_sha256 !== manifest.input_manifest_sha256
      || block.paired_input_sha256 !== pairedInputSha256
      || block.block_pair_id !== pairedBlockId(pairedInputSha256, block.repetition)
    ) fail("INPUT_OWNERSHIP_MISMATCH", `blocks[${index}] differs from its exact paired input ownership`);
    return block;
  }

  if (
    block.observed !== true
    || block.analysis_role !== "background-observation-no-automatic-subtraction"
    || block.arm !== null
    || block.opportunities !== 0
    || block.opportunity_repetitions !== 0
    || block.block_pair_id !== null
    || block.paired_input_sha256 !== null
    || block.input_manifest_id !== null
    || block.input_manifest_sha256 !== null
  ) fail("INVALID_SCHEDULE", `blocks[${index}] violates the idle-block contract`);
  return block;
}

export function validateEnergyBlockRunnerSchedule(schedule) {
  exactObject(schedule, [
    "schema",
    "contract_version",
    "run_id",
    "purpose",
    "claim_eligibility",
    "analysis_contract_status",
    "meter_capability",
    "fixed_work",
    "ordered_input_manifests",
    "counterbalancing",
    "idle_policy",
    "stop_policy",
    "aggregation_requirement",
    "blocks",
    "schedule_sha256",
  ], "schedule", "INVALID_SCHEDULE");
  if (
    schedule.schema !== 1
    || schedule.contract_version !== ENERGY_BLOCK_SCHEDULE_VERSION
    || schedule.purpose !== "external-meter-block-acquisition"
    || schedule.claim_eligibility !== "ineligible-until-aggregate-confirmatory-contract"
    || schedule.analysis_contract_status !== "not-implemented"
    || schedule.counterbalancing !== "deterministic hash rotation with alternating reversal within scenario-seed cluster"
    || schedule.idle_policy !== "measure before/after background separately; never subtract automatically"
    || schedule.stop_policy !== "fixed opportunity count and repetitions; meter observations do not adapt stopping"
    || schedule.aggregation_requirement !== "compute gross joules per correct commit per arm block; aggregate blocks and scenarios within seed before confirmatory inference"
    || schedule.schedule_sha256 !== digestBody(schedule, "schedule_sha256")
  ) fail("INVALID_SCHEDULE", "schedule identity, status, or digest is invalid");
  nonEmpty(schedule.run_id, "schedule.run_id", "INVALID_SCHEDULE");
  exactObject(schedule.fixed_work, [
    "opportunities_per_block",
    "opportunity_repetitions",
    "measurement_repetitions",
    "warmup_opportunities",
  ], "schedule.fixed_work", "INVALID_SCHEDULE");
  positiveInteger(schedule.fixed_work.opportunities_per_block, "fixed_work.opportunities_per_block", "INVALID_SCHEDULE");
  positiveInteger(schedule.fixed_work.opportunity_repetitions, "fixed_work.opportunity_repetitions", "INVALID_SCHEDULE");
  positiveInteger(schedule.fixed_work.measurement_repetitions, "fixed_work.measurement_repetitions", "INVALID_SCHEDULE");
  positiveInteger(schedule.fixed_work.warmup_opportunities, "fixed_work.warmup_opportunities", "INVALID_SCHEDULE");
  if (!Array.isArray(schedule.ordered_input_manifests) || schedule.ordered_input_manifests.length === 0) {
    fail("INVALID_SCHEDULE", "schedule requires ordered input manifests");
  }
  const manifests = new Map();
  for (const [index, manifest] of schedule.ordered_input_manifests.entries()) {
    assertManifest(manifest, index, schedule.fixed_work.opportunities_per_block);
    const key = scheduleManifestKey(manifest.scenario_id, manifest.seed);
    if (manifests.has(key)) fail("INPUT_SUBSTITUTION", `duplicate ordered input ownership ${key}`);
    manifests.set(key, manifest);
  }
  const orderedManifests = [...schedule.ordered_input_manifests].sort((left, right) => (
    left.scenario_id.localeCompare(right.scenario_id) || left.seed - right.seed
  ));
  if (canonical(orderedManifests) !== canonical(schedule.ordered_input_manifests)) {
    fail("ORDER_MISMATCH", "ordered input manifests are not in canonical scenario-seed order");
  }
  if (!Array.isArray(schedule.blocks) || schedule.blocks.length === 0) {
    fail("INVALID_SCHEDULE", "schedule requires blocks");
  }
  const blockIds = new Set();
  for (const [index, block] of schedule.blocks.entries()) {
    assertBlock(block, index, schedule, manifests);
    if (blockIds.has(block.block_id)) fail("INVALID_SCHEDULE", `duplicate block ${block.block_id}`);
    blockIds.add(block.block_id);
  }
  const ownedManifestKeys = new Set(schedule.blocks.map((block) => (
    scheduleManifestKey(block.scenario_id, block.seed)
  )));
  if (
    ownedManifestKeys.size !== manifests.size
    || [...manifests.keys()].some((key) => !ownedManifestKeys.has(key))
  ) fail("INPUT_OWNERSHIP_MISMATCH", "ordered input manifests and scheduled clusters differ");

  const firstCluster = schedule.blocks[0].cluster_id;
  const arms = [];
  for (const block of schedule.blocks) {
    if (block.cluster_id !== firstCluster || block.phase !== "warmup") break;
    arms.push(block.arm);
  }
  if (arms.length < 2 || new Set(arms).size !== arms.length) {
    fail("INVALID_SCHEDULE", "the first cluster does not define at least two unique warmup arms");
  }
  let cursor = 0;
  for (const manifest of orderedManifests) {
    const clusterId = `${manifest.scenario_id}:${manifest.seed}`;
    let clusterTaskFamily = null;
    let clusterBackendId = null;
    for (const [armIndex, arm] of arms.entries()) {
      const block = schedule.blocks[cursor];
      if (
        !block
        || block.cluster_id !== clusterId
        || block.phase !== "warmup"
        || block.arm !== arm
        || block.repetition !== 0
        || block.block_id !== expectedBlockId(clusterId, "warmup", 0, armIndex, arm)
      ) fail("ORDER_MISMATCH", `cluster ${clusterId} has a missing, substituted, or reordered warmup block`);
      clusterTaskFamily ??= block.task_family;
      clusterBackendId ??= block.backend_id;
      if (block.task_family !== clusterTaskFamily || block.backend_id !== clusterBackendId) {
        fail("INPUT_OWNERSHIP_MISMATCH", `cluster ${clusterId} changes backend ownership within its warmups`);
      }
      cursor += 1;
    }
    for (let repetition = 0; repetition < schedule.fixed_work.measurement_repetitions; repetition += 1) {
      const idleBefore = schedule.blocks[cursor];
      if (
        !idleBefore
        || idleBefore.cluster_id !== clusterId
        || idleBefore.phase !== "idle-before"
        || idleBefore.repetition !== repetition
        || idleBefore.task_family !== clusterTaskFamily
        || idleBefore.backend_id !== clusterBackendId
        || idleBefore.block_id !== expectedBlockId(clusterId, "idle-before", repetition, cursor)
      ) fail("ORDER_MISMATCH", `cluster ${clusterId} repetition ${repetition} lacks its exact idle-before boundary`);
      cursor += 1;
      for (const [armIndex, arm] of counterbalancedArmOrder(arms, clusterId, repetition).entries()) {
        const block = schedule.blocks[cursor];
        if (
          !block
          || block.cluster_id !== clusterId
          || block.phase !== "measure"
          || block.arm !== arm
          || block.repetition !== repetition
          || block.task_family !== clusterTaskFamily
          || block.backend_id !== clusterBackendId
          || block.block_id !== expectedBlockId(clusterId, "measure", repetition, armIndex, arm)
        ) fail("ORDER_MISMATCH", `cluster ${clusterId} repetition ${repetition} has a missing, substituted, or reordered arm block`);
        cursor += 1;
      }
      const idleAfter = schedule.blocks[cursor];
      if (
        !idleAfter
        || idleAfter.cluster_id !== clusterId
        || idleAfter.phase !== "idle-after"
        || idleAfter.repetition !== repetition
        || idleAfter.task_family !== clusterTaskFamily
        || idleAfter.backend_id !== clusterBackendId
        || idleAfter.block_id !== expectedBlockId(clusterId, "idle-after", repetition, cursor)
      ) fail("ORDER_MISMATCH", `cluster ${clusterId} repetition ${repetition} lacks its exact idle-after boundary`);
      cursor += 1;
    }
  }
  if (cursor !== schedule.blocks.length) {
    fail("INPUT_COUNT_MISMATCH", "schedule contains missing or surplus blocks outside the exact cluster design");
  }
  return Object.freeze({ schedule, manifests });
}

function assertAdapter(adapter) {
  exactObject(adapter, ADAPTER_KEYS, "adapter", "INVALID_ADAPTER");
  nonEmpty(adapter.adapter_id, "adapter.adapter_id", "INVALID_ADAPTER");
  nonEmpty(adapter.adapter_version, "adapter.adapter_version", "INVALID_ADAPTER");
  sha256Identity(adapter.implementation_sha256, "adapter.implementation_sha256", "INVALID_ADAPTER");
  if (adapter.fixture_only !== true) {
    fail("NON_FIXTURE_ADAPTER_REFUSED", "the v1 block runner accepts injected fixture adapters only");
  }
  if (typeof adapter.execute_work_unit !== "function" || typeof adapter.execute_idle_block !== "function") {
    fail("INVALID_ADAPTER", "adapter execution entries must be functions");
  }
  const identity = Object.freeze(Object.fromEntries(
    ADAPTER_IDENTITY_KEYS.map((key) => [key, adapter[key]]),
  ));
  return Object.freeze({
    identity,
    executeWorkUnit: adapter.execute_work_unit.bind(adapter),
    executeIdleBlock: adapter.execute_idle_block.bind(adapter),
  });
}

function assertResourceUsage(resources, label, code = "INVALID_ADAPTER_OUTPUT") {
  exactObject(resources, RESOURCE_KEYS, label, code);
  for (const key of RESOURCE_KEYS) nonNegativeInteger(resources[key], `${label}.${key}`, code);
  return resources;
}

function assertWorkOutput(output) {
  exactObject(output, WORK_OUTPUT_KEYS, "work adapter output", "INVALID_ADAPTER_OUTPUT");
  if (output.schema !== 1 || !["correct-commit", "incorrect-commit", "no-commit"].includes(output.status)) {
    fail("INVALID_ADAPTER_OUTPUT", "work adapter output has an invalid schema or status");
  }
  sha256Identity(output.result_sha256, "work adapter output.result_sha256", "INVALID_ADAPTER_OUTPUT");
  assertResourceUsage(output.resources, "work adapter output.resources");
  return output;
}

function assertIdleOutput(output) {
  exactObject(output, IDLE_OUTPUT_KEYS, "idle adapter output", "INVALID_ADAPTER_OUTPUT");
  if (output.schema !== 1 || output.status !== "idle-complete") {
    fail("INVALID_ADAPTER_OUTPUT", "idle adapter output has an invalid schema or status");
  }
  sha256Identity(output.result_sha256, "idle adapter output.result_sha256", "INVALID_ADAPTER_OUTPUT");
  assertResourceUsage(output.resources, "idle adapter output.resources");
  return output;
}

function defaultClock() {
  return Object.freeze({
    now_utc: () => new Date().toISOString(),
    monotonic_ns: () => process.hrtime.bigint(),
  });
}

function assertClock(clock) {
  exactObject(clock, ["now_utc", "monotonic_ns"], "clock", "INVALID_CLOCK");
  if (typeof clock.now_utc !== "function" || typeof clock.monotonic_ns !== "function") {
    fail("INVALID_CLOCK", "clock entries must be functions");
  }
  return clock;
}

function readClock(clock, point) {
  const utc = clock.now_utc();
  exactUtc(utc, `${point}.utc`);
  const monotonic = clock.monotonic_ns();
  if (typeof monotonic !== "bigint" || monotonic < 0n) {
    fail("INVALID_CLOCK", `${point}.monotonic_ns must be a non-negative bigint`);
  }
  return { utc, monotonic };
}

async function timed(clock, operation) {
  const start = readClock(clock, "start");
  const value = await operation();
  const end = readClock(clock, "end");
  if (end.monotonic < start.monotonic || exactUtc(end.utc, "end.utc") < exactUtc(start.utc, "start.utc")) {
    fail("CLOCK_REGRESSION", "clock regressed during an adapter invocation");
  }
  return Object.freeze({
    value,
    started_at: start.utc,
    ended_at: end.utc,
    elapsed_ns: String(end.monotonic - start.monotonic),
  });
}

function manifestForBlock(block, manifests) {
  const manifest = manifests.get(scheduleManifestKey(block.scenario_id, block.seed));
  if (!manifest) fail("INPUT_OWNERSHIP_MISMATCH", `block ${block.block_id} has no input manifest`);
  return manifest;
}

function orderedInvocations(block, manifest) {
  if (block.phase === "idle-before" || block.phase === "idle-after") return [];
  const opportunities = block.phase === "warmup"
    ? manifest.ordered_opportunity_ids.slice(0, block.opportunities)
    : manifest.ordered_opportunity_ids;
  const invocations = [];
  for (let repetition = 0; repetition < block.opportunity_repetitions; repetition += 1) {
    for (const [opportunityIndex, opportunityId] of opportunities.entries()) {
      invocations.push(Object.freeze({
        invocation_index: invocations.length,
        opportunity_index: opportunityIndex,
        opportunity_repetition: repetition,
        opportunity_id: opportunityId,
      }));
    }
  }
  return Object.freeze(invocations);
}

function workAdapterInput(schedule, block, invocation) {
  return deepFreeze({
    schema: 1,
    contract_version: ENERGY_BLOCK_ADAPTER_INPUT_VERSION,
    schedule_sha256: schedule.schedule_sha256,
    run_id: schedule.run_id,
    block_id: block.block_id,
    block_sequence: block.sequence,
    phase: block.phase,
    cluster_id: block.cluster_id,
    scenario_id: block.scenario_id,
    task_family: block.task_family,
    backend_id: block.backend_id,
    seed: block.seed,
    arm: block.arm,
    repetition: block.repetition,
    input_manifest_id: block.phase === "measure" ? block.input_manifest_id : null,
    input_manifest_sha256: block.phase === "measure" ? block.input_manifest_sha256 : null,
    block_pair_id: block.phase === "measure" ? block.block_pair_id : null,
    paired_input_sha256: block.phase === "measure" ? block.paired_input_sha256 : null,
    invocation_index: invocation.invocation_index,
    opportunity_index: invocation.opportunity_index,
    opportunity_repetition: invocation.opportunity_repetition,
    opportunity_id: invocation.opportunity_id,
    claim_eligible: false,
  });
}

function idleAdapterInput(schedule, block) {
  return deepFreeze({
    schema: 1,
    contract_version: ENERGY_BLOCK_ADAPTER_INPUT_VERSION,
    schedule_sha256: schedule.schedule_sha256,
    run_id: schedule.run_id,
    block_id: block.block_id,
    block_sequence: block.sequence,
    phase: block.phase,
    cluster_id: block.cluster_id,
    scenario_id: block.scenario_id,
    task_family: block.task_family,
    backend_id: block.backend_id,
    seed: block.seed,
    arm: null,
    repetition: block.repetition,
    claim_eligible: false,
  });
}

function emptySummary() {
  return {
    correct_commits: 0,
    incorrect_commits: 0,
    no_commits: 0,
    idle_blocks: 0,
    cpu_user_us: 0,
    cpu_system_us: 0,
    max_rss_bytes: 0,
    read_bytes: 0,
    written_bytes: 0,
    operation_count: 0,
  };
}

function addResources(summary, resources) {
  for (const key of ["cpu_user_us", "cpu_system_us", "read_bytes", "written_bytes", "operation_count"]) {
    summary[key] = addSafe(summary[key], resources[key], `summary.${key}`);
  }
  summary.max_rss_bytes = Math.max(summary.max_rss_bytes, resources.max_rss_bytes);
}

function summarize(outcomes, idleObservation) {
  const summary = emptySummary();
  for (const outcome of outcomes) {
    if (outcome.status === "correct-commit") summary.correct_commits += 1;
    else if (outcome.status === "incorrect-commit") summary.incorrect_commits += 1;
    else summary.no_commits += 1;
    addResources(summary, outcome.resources);
  }
  if (idleObservation !== null) {
    summary.idle_blocks = 1;
    addResources(summary, idleObservation.resources);
  }
  return summary;
}

async function executeBlock({ schedule, block, manifests, adapter, clock }) {
  const blockStart = readClock(clock, `block ${block.sequence} start`);
  const outcomes = [];
  let idleObservation = null;
  if (block.phase === "idle-before" || block.phase === "idle-after") {
    const input = idleAdapterInput(schedule, block);
    const inputSha256 = sha256(canonical(input));
    const measured = await timed(clock, () => adapter.executeIdleBlock(input));
    const output = assertIdleOutput(measured.value);
    const body = {
      schema: 1,
      contract_version: ENERGY_BLOCK_RECORD_VERSION,
      input_sha256: inputSha256,
      started_at: measured.started_at,
      ended_at: measured.ended_at,
      elapsed_ns: measured.elapsed_ns,
      status: output.status,
      result_sha256: output.result_sha256,
      resources: { ...output.resources },
    };
    idleObservation = { ...body, observation_sha256: digestBody(body, "observation_sha256") };
  } else {
    const manifest = manifestForBlock(block, manifests);
    for (const invocation of orderedInvocations(block, manifest)) {
      const input = workAdapterInput(schedule, block, invocation);
      const inputSha256 = sha256(canonical(input));
      const measured = await timed(clock, () => adapter.executeWorkUnit(input));
      const output = assertWorkOutput(measured.value);
      const body = {
        schema: 1,
        contract_version: ENERGY_BLOCK_RECORD_VERSION,
        ...invocation,
        input_sha256: inputSha256,
        started_at: measured.started_at,
        ended_at: measured.ended_at,
        elapsed_ns: measured.elapsed_ns,
        status: output.status,
        result_sha256: output.result_sha256,
        resources: { ...output.resources },
      };
      outcomes.push({ ...body, outcome_sha256: digestBody(body, "outcome_sha256") });
    }
  }
  const blockEnd = readClock(clock, `block ${block.sequence} end`);
  if (
    blockEnd.monotonic < blockStart.monotonic
    || exactUtc(blockEnd.utc, "block end") < exactUtc(blockStart.utc, "block start")
  ) fail("CLOCK_REGRESSION", `clock regressed during block ${block.block_id}`);
  const body = {
    schema: 1,
    contract_version: ENERGY_BLOCK_RECORD_VERSION,
    runner_version: ENERGY_BLOCK_RUNNER_VERSION,
    schedule_sha256: schedule.schedule_sha256,
    run_id: schedule.run_id,
    claim_eligible: false,
    claim_eligibility: "fixture-rehearsal-only-no-external-meter-evidence",
    adapter: { ...adapter.identity },
    block: structuredClone(block),
    block_sha256: blockDigest(block),
    started_at: blockStart.utc,
    ended_at: blockEnd.utc,
    elapsed_ns: String(blockEnd.monotonic - blockStart.monotonic),
    invocation_count: outcomes.length,
    outcomes,
    idle_observation: idleObservation,
    summary: summarize(outcomes, idleObservation),
    external_meter_observation: null,
  };
  return { ...body, record_sha256: digestBody(body, "record_sha256") };
}

function assertOutcome(outcome, expected, input, record) {
  exactObject(outcome, OUTCOME_KEYS, "outcome", "INVALID_EXECUTION_RECORD");
  if (
    outcome.schema !== 1
    || outcome.contract_version !== ENERGY_BLOCK_RECORD_VERSION
    || outcome.invocation_index !== expected.invocation_index
    || outcome.opportunity_index !== expected.opportunity_index
    || outcome.opportunity_repetition !== expected.opportunity_repetition
    || outcome.opportunity_id !== expected.opportunity_id
    || outcome.input_sha256 !== sha256(canonical(input))
    || !["correct-commit", "incorrect-commit", "no-commit"].includes(outcome.status)
    || outcome.outcome_sha256 !== digestBody(outcome, "outcome_sha256")
  ) fail("OUTCOME_ORDER_MISMATCH", `block ${record.block.block_id} has a substituted or reordered outcome`);
  sha256Identity(outcome.result_sha256, "outcome.result_sha256", "INVALID_EXECUTION_RECORD");
  assertResourceUsage(outcome.resources, "outcome.resources", "INVALID_EXECUTION_RECORD");
  const started = exactUtc(outcome.started_at, "outcome.started_at", "INVALID_EXECUTION_RECORD");
  const ended = exactUtc(outcome.ended_at, "outcome.ended_at", "INVALID_EXECUTION_RECORD");
  nanoseconds(outcome.elapsed_ns, "outcome.elapsed_ns", "INVALID_EXECUTION_RECORD");
  if (
    ended < started
    || started < Date.parse(record.started_at)
    || ended > Date.parse(record.ended_at)
  ) fail("TIME_ORDER_MISMATCH", "outcome interval lies outside its block interval");
  return outcome;
}

function assertIdleObservation(observation, input, record) {
  exactObject(observation, IDLE_OBSERVATION_KEYS, "idle_observation", "INVALID_EXECUTION_RECORD");
  if (
    observation.schema !== 1
    || observation.contract_version !== ENERGY_BLOCK_RECORD_VERSION
    || observation.input_sha256 !== sha256(canonical(input))
    || observation.status !== "idle-complete"
    || observation.observation_sha256 !== digestBody(observation, "observation_sha256")
  ) fail("INVALID_EXECUTION_RECORD", `block ${record.block.block_id} has an invalid idle observation`);
  sha256Identity(observation.result_sha256, "idle_observation.result_sha256", "INVALID_EXECUTION_RECORD");
  assertResourceUsage(observation.resources, "idle_observation.resources", "INVALID_EXECUTION_RECORD");
  const started = exactUtc(observation.started_at, "idle_observation.started_at", "INVALID_EXECUTION_RECORD");
  const ended = exactUtc(observation.ended_at, "idle_observation.ended_at", "INVALID_EXECUTION_RECORD");
  nanoseconds(observation.elapsed_ns, "idle_observation.elapsed_ns", "INVALID_EXECUTION_RECORD");
  if (
    ended < started
    || started < Date.parse(record.started_at)
    || ended > Date.parse(record.ended_at)
  ) fail("TIME_ORDER_MISMATCH", "idle interval lies outside its block interval");
  return observation;
}

function validateRecord({ schedule, manifests, adapterIdentity, block, record }) {
  exactObject(record, RECORD_KEYS, "execution record", "INVALID_EXECUTION_RECORD");
  if (
    record.schema !== 1
    || record.contract_version !== ENERGY_BLOCK_RECORD_VERSION
    || record.runner_version !== ENERGY_BLOCK_RUNNER_VERSION
    || record.schedule_sha256 !== schedule.schedule_sha256
    || record.run_id !== schedule.run_id
    || record.claim_eligible !== false
    || record.claim_eligibility !== "fixture-rehearsal-only-no-external-meter-evidence"
    || canonical(record.adapter) !== canonical(adapterIdentity)
    || record.adapter.fixture_only !== true
    || canonical(record.block) !== canonical(block)
    || record.block_sha256 !== blockDigest(block)
    || record.external_meter_observation !== null
    || record.record_sha256 !== digestBody(record, "record_sha256")
  ) fail("INVALID_EXECUTION_RECORD", `execution record ${block.block_id} has invalid identity or digest`);
  const started = exactUtc(record.started_at, "record.started_at", "INVALID_EXECUTION_RECORD");
  const ended = exactUtc(record.ended_at, "record.ended_at", "INVALID_EXECUTION_RECORD");
  const elapsed = nanoseconds(record.elapsed_ns, "record.elapsed_ns", "INVALID_EXECUTION_RECORD");
  if (ended < started) fail("TIME_ORDER_MISMATCH", `record ${block.block_id} has reversed UTC bounds`);
  if (!Array.isArray(record.outcomes)) fail("INVALID_EXECUTION_RECORD", "record.outcomes must be an array");

  const idle = block.phase === "idle-before" || block.phase === "idle-after";
  if (idle) {
    if (record.invocation_count !== 0 || record.outcomes.length !== 0 || record.idle_observation === null) {
      fail("INPUT_COUNT_MISMATCH", `idle record ${block.block_id} has work outcomes or lacks its idle observation`);
    }
    assertIdleObservation(record.idle_observation, idleAdapterInput(schedule, block), record);
  } else {
    if (record.idle_observation !== null) {
      fail("INVALID_EXECUTION_RECORD", `work record ${block.block_id} contains an idle observation`);
    }
    const expectedInvocations = orderedInvocations(block, manifestForBlock(block, manifests));
    if (
      record.invocation_count !== expectedInvocations.length
      || record.outcomes.length !== expectedInvocations.length
    ) fail("INPUT_COUNT_MISMATCH", `record ${block.block_id} has an invalid invocation count`);
    for (const [index, expected] of expectedInvocations.entries()) {
      assertOutcome(record.outcomes[index], expected, workAdapterInput(schedule, block, expected), record);
    }
  }
  exactObject(record.summary, SUMMARY_KEYS, "record.summary", "INVALID_EXECUTION_RECORD");
  const expectedSummary = summarize(record.outcomes, record.idle_observation);
  if (canonical(record.summary) !== canonical(expectedSummary)) {
    fail("INVALID_EXECUTION_RECORD", `record ${block.block_id} summary differs from ordered outcomes`);
  }
  const outcomeElapsed = record.outcomes.reduce(
    (sum, outcome) => sum + nanoseconds(outcome.elapsed_ns, "outcome.elapsed_ns", "INVALID_EXECUTION_RECORD"),
    record.idle_observation === null
      ? 0n
      : nanoseconds(record.idle_observation.elapsed_ns, "idle_observation.elapsed_ns", "INVALID_EXECUTION_RECORD"),
  );
  if (elapsed < outcomeElapsed) {
    fail("INVALID_EXECUTION_RECORD", `record ${block.block_id} elapsed time is shorter than its serialized invocations`);
  }
  return record;
}

function combineSummaries(records) {
  const total = emptySummary();
  for (const record of records) {
    for (const key of [
      "correct_commits",
      "incorrect_commits",
      "no_commits",
      "idle_blocks",
      "cpu_user_us",
      "cpu_system_us",
      "read_bytes",
      "written_bytes",
      "operation_count",
    ]) total[key] = addSafe(total[key], record.summary[key], `totals.${key}`);
    total.max_rss_bytes = Math.max(total.max_rss_bytes, record.summary.max_rss_bytes);
  }
  return total;
}

function assertSource(source, label, code = "INVALID_EXECUTION_BUNDLE") {
  exactObject(source, ["file_name", "bytes", "sha256"], label, code);
  nonEmpty(source.file_name, `${label}.file_name`, code);
  nonNegativeInteger(source.bytes, `${label}.bytes`, code);
  sha256Identity(source.sha256, `${label}.sha256`, code);
  return source;
}

export function validateEnergyBlockExecutionBundle({ schedule, bundle }) {
  const { manifests } = validateEnergyBlockRunnerSchedule(schedule);
  exactObject(bundle, [
    "schema",
    "contract_version",
    "runner_version",
    "schedule_source",
    "schedule_sha256",
    "run_id",
    "complete",
    "claim_eligible",
    "claim_eligibility",
    "adapter",
    "block_count",
    "observed_block_count",
    "blocks",
    "totals",
    "external_meter_observations",
    "external_meter_status",
    "bundle_sha256",
  ], "execution bundle", "INVALID_EXECUTION_BUNDLE");
  assertSource(bundle.schedule_source, "bundle.schedule_source");
  exactObject(bundle.adapter, ADAPTER_IDENTITY_KEYS, "bundle.adapter", "INVALID_EXECUTION_BUNDLE");
  if (
    bundle.schema !== 1
    || bundle.contract_version !== ENERGY_BLOCK_BUNDLE_VERSION
    || bundle.runner_version !== ENERGY_BLOCK_RUNNER_VERSION
    || bundle.schedule_sha256 !== schedule.schedule_sha256
    || bundle.run_id !== schedule.run_id
    || bundle.complete !== true
    || bundle.claim_eligible !== false
    || bundle.claim_eligibility !== "fixture-rehearsal-only-no-external-meter-evidence"
    || bundle.adapter.fixture_only !== true
    || bundle.block_count !== schedule.blocks.length
    || bundle.observed_block_count !== schedule.blocks.filter((block) => block.observed).length
    || !Array.isArray(bundle.blocks)
    || bundle.blocks.length !== schedule.blocks.length
    || !Array.isArray(bundle.external_meter_observations)
    || bundle.external_meter_observations.length !== 0
    || bundle.external_meter_status !== "not-collected-by-this-runner"
    || bundle.bundle_sha256 !== digestBody(bundle, "bundle_sha256")
  ) fail("INVALID_EXECUTION_BUNDLE", "execution bundle identity, eligibility, or digest is invalid");
  let previousEnded = Number.NEGATIVE_INFINITY;
  for (const [index, block] of schedule.blocks.entries()) {
    const record = validateRecord({
      schedule,
      manifests,
      adapterIdentity: bundle.adapter,
      block,
      record: bundle.blocks[index],
    });
    const started = Date.parse(record.started_at);
    if (started < previousEnded) {
      fail("TIME_ORDER_MISMATCH", `block ${block.block_id} overlaps or precedes the prior block`);
    }
    previousEnded = Date.parse(record.ended_at);
  }
  exactObject(bundle.totals, SUMMARY_KEYS, "bundle.totals", "INVALID_EXECUTION_BUNDLE");
  if (canonical(bundle.totals) !== canonical(combineSummaries(bundle.blocks))) {
    fail("INVALID_EXECUTION_BUNDLE", "bundle totals differ from validated block records");
  }
  return bundle;
}

async function regularFile(file, label) {
  const absolute = path.resolve(file);
  let contents;
  try {
    contents = await readStableOpenedFile(absolute, {
      label,
      containedBy: path.dirname(absolute),
    });
  } catch (error) {
    fail("INVALID_SOURCE_FILE", `${label} cannot be consumed safely: ${error.message}`, error);
  }
  return Object.freeze({ absolute, contents, bytes: contents.length, sha256: sha256(contents) });
}

async function loadSchedule(schedulePath) {
  const source = await regularFile(schedulePath, "energy block schedule");
  let schedule;
  try {
    schedule = JSON.parse(source.contents.toString("utf8"));
  } catch (error) {
    fail("INVALID_SCHEDULE", `energy block schedule is not valid JSON: ${error.message}`, error);
  }
  const validated = validateEnergyBlockRunnerSchedule(schedule);
  return Object.freeze({
    ...validated,
    source,
    sourceIdentity: Object.freeze({
      file_name: path.basename(source.absolute),
      bytes: source.bytes,
      sha256: source.sha256,
    }),
  });
}

async function assertScheduleUnchanged(schedulePath, sourceSha256) {
  const current = await regularFile(schedulePath, "energy block schedule");
  if (current.sha256 !== sourceSha256) {
    fail("SCHEDULE_SOURCE_DRIFT", "persisted schedule bytes changed during or between execution attempts");
  }
}

async function ensureOutputDirectory(outputDirectory) {
  const absolute = path.resolve(outputDirectory);
  const parent = path.dirname(absolute);
  const parentInfo = await lstat(parent);
  if (!parentInfo.isDirectory() || parentInfo.isSymbolicLink() || !samePath(parent, await realpath(parent))) {
    fail("INVALID_OUTPUT", "output parent must be an existing regular directory");
  }
  let resumed = false;
  try {
    await mkdir(absolute, { recursive: false, mode: 0o700 });
  } catch (error) {
    if (error.code !== "EEXIST") throw error;
    resumed = true;
  }
  const information = await lstat(absolute);
  if (!information.isDirectory() || information.isSymbolicLink() || !samePath(absolute, await realpath(absolute))) {
    fail("INVALID_OUTPUT", "output path must be a regular unlinked directory");
  }
  const records = path.join(absolute, "blocks");
  try {
    await mkdir(records, { recursive: false, mode: 0o700 });
  } catch (error) {
    if (error.code !== "EEXIST") throw error;
  }
  const recordsInfo = await lstat(records);
  if (!recordsInfo.isDirectory() || recordsInfo.isSymbolicLink() || !samePath(records, await realpath(records))) {
    fail("INVALID_OUTPUT", "block record path must be a regular unlinked directory");
  }
  return Object.freeze({ absolute, records, resumed });
}

async function persistExact(document, outputPath, mismatchCode, label) {
  const bytes = Buffer.from(`${JSON.stringify(document, null, 2)}\n`);
  try {
    const handle = await open(outputPath, "wx", 0o600);
    try {
      await handle.writeFile(bytes);
      await handle.sync();
    } finally {
      await handle.close();
    }
    return Object.freeze({ resumed: false, bytes: bytes.length, sha256: sha256(bytes) });
  } catch (error) {
    if (error.code !== "EEXIST") throw error;
    let existing;
    try {
      existing = await readStableOpenedFile(outputPath, {
        label: `existing ${label}`,
        containedBy: path.dirname(outputPath),
      });
    } catch (readError) {
      fail("INVALID_OUTPUT", `existing ${label} cannot be resumed safely: ${readError.message}`, readError);
    }
    if (!existing.equals(bytes)) fail(mismatchCode, `existing ${label} differs from the exact recomputed document`);
    return Object.freeze({ resumed: true, bytes: bytes.length, sha256: sha256(bytes) });
  }
}

function executionPlan(schedule, sourceIdentity, adapterIdentity) {
  const body = {
    schema: 1,
    contract_version: ENERGY_BLOCK_PLAN_VERSION,
    runner_version: ENERGY_BLOCK_RUNNER_VERSION,
    schedule_source: { ...sourceIdentity },
    schedule_sha256: schedule.schedule_sha256,
    run_id: schedule.run_id,
    adapter: { ...adapterIdentity },
    fixture_only: true,
    claim_eligible: false,
    claim_eligibility: "fixture-rehearsal-only-no-external-meter-evidence",
    resume_boundary: "completed-immutable-block-records-only",
    external_meter_status: "not-collected-by-this-runner",
  };
  return { ...body, plan_sha256: digestBody(body, "plan_sha256") };
}

function recordFileName(block) {
  return `${String(block.sequence).padStart(6, "0")}-${block.block_id}.json`;
}

async function loadExistingRecords({ directory, schedule, manifests, adapterIdentity }) {
  const entries = await readdir(directory, { withFileTypes: true });
  const names = entries.map((entry) => entry.name).sort();
  for (const entry of entries) {
    if (!entry.isFile() || entry.isSymbolicLink()) {
      fail("INVALID_RESUME_STATE", `block record directory contains a non-regular entry: ${entry.name}`);
    }
  }
  const expectedNames = schedule.blocks.map(recordFileName);
  const expectedPrefix = expectedNames.slice(0, names.length).sort();
  if (canonical(names) !== canonical(expectedPrefix)) {
    fail("INVALID_RESUME_STATE", "persisted block records are not one exact contiguous schedule prefix");
  }
  const records = [];
  let previousEnded = Number.NEGATIVE_INFINITY;
  for (let index = 0; index < names.length; index += 1) {
    const file = path.join(directory, expectedNames[index]);
    const source = await regularFile(file, `block record ${index}`);
    let record;
    try {
      record = JSON.parse(source.contents.toString("utf8"));
    } catch (error) {
      fail("INVALID_RESUME_STATE", `block record ${index} is not valid JSON`, error);
    }
    validateRecord({ schedule, manifests, adapterIdentity, block: schedule.blocks[index], record });
    if (Date.parse(record.started_at) < previousEnded) {
      fail("TIME_ORDER_MISMATCH", `persisted block record ${index} overlaps the prior record`);
    }
    previousEnded = Date.parse(record.ended_at);
    records.push(record);
  }
  return records;
}

async function assertOutputInventory(output, complete) {
  const expected = complete
    ? ["blocks", "execution-bundle.json", "execution-plan.json"]
    : ["blocks", "execution-plan.json"];
  const actual = (await readdir(output, { withFileTypes: true })).map((entry) => {
    if (entry.isSymbolicLink()) fail("INVALID_RESUME_STATE", `output contains a link: ${entry.name}`);
    return entry.name;
  }).sort();
  if (canonical(actual) !== canonical(expected)) {
    fail("INVALID_RESUME_STATE", "execution output contains an unbound file or omits a required artifact");
  }
}

async function inspectOutputInventory(output) {
  const entries = await readdir(output, { withFileTypes: true });
  const names = [];
  for (const entry of entries) {
    if (entry.isSymbolicLink()) fail("INVALID_RESUME_STATE", `output contains a link: ${entry.name}`);
    names.push(entry.name);
  }
  names.sort();
  const partial = ["blocks", "execution-plan.json"];
  const complete = ["blocks", "execution-bundle.json", "execution-plan.json"];
  if (canonical(names) === canonical(partial)) return false;
  if (canonical(names) === canonical(complete)) return true;
  fail("INVALID_RESUME_STATE", "execution output contains an unbound file or omits a required artifact");
}

function assembleBundle({ schedule, sourceIdentity, adapterIdentity, records }) {
  const body = {
    schema: 1,
    contract_version: ENERGY_BLOCK_BUNDLE_VERSION,
    runner_version: ENERGY_BLOCK_RUNNER_VERSION,
    schedule_source: { ...sourceIdentity },
    schedule_sha256: schedule.schedule_sha256,
    run_id: schedule.run_id,
    complete: true,
    claim_eligible: false,
    claim_eligibility: "fixture-rehearsal-only-no-external-meter-evidence",
    adapter: { ...adapterIdentity },
    block_count: records.length,
    observed_block_count: schedule.blocks.filter((block) => block.observed).length,
    blocks: records,
    totals: combineSummaries(records),
    external_meter_observations: [],
    external_meter_status: "not-collected-by-this-runner",
  };
  return { ...body, bundle_sha256: digestBody(body, "bundle_sha256") };
}

function assertSignal(signal) {
  if (signal === undefined || signal === null) return null;
  if (typeof signal !== "object" || typeof signal.aborted !== "boolean") {
    fail("INVALID_ABORT_SIGNAL", "signal must be an AbortSignal-compatible object");
  }
  return signal;
}

/**
 * Execute a persisted energy-block schedule with an injected fixture adapter.
 *
 * Records are create-only and become resumable only at complete block
 * boundaries. An abort observed during a block is honored before the next
 * block, so a persisted record never represents a partial meter interval.
 */
export async function runEnergyBlockFixture({
  schedulePath,
  outputDirectory,
  adapter,
  signal = null,
  clock = defaultClock(),
}) {
  nonEmpty(schedulePath, "schedulePath", "INVALID_SOURCE_FILE");
  nonEmpty(outputDirectory, "outputDirectory", "INVALID_OUTPUT");
  const frozenSignal = assertSignal(signal);
  const frozenClock = assertClock(clock);
  const executableAdapter = assertAdapter(adapter);
  const loaded = await loadSchedule(schedulePath);
  const output = await ensureOutputDirectory(outputDirectory);
  const plan = executionPlan(loaded.schedule, loaded.sourceIdentity, executableAdapter.identity);
  const planResult = await persistExact(
    plan,
    path.join(output.absolute, "execution-plan.json"),
    "RESUME_PLAN_MISMATCH",
    "execution plan",
  );
  const hasExistingBundle = await inspectOutputInventory(output.absolute);
  const records = await loadExistingRecords({
    directory: output.records,
    schedule: loaded.schedule,
    manifests: loaded.manifests,
    adapterIdentity: executableAdapter.identity,
  });
  if (hasExistingBundle && records.length !== loaded.schedule.blocks.length) {
    fail("INVALID_RESUME_STATE", "an execution bundle exists before all exact block records are present");
  }
  const existingBundlePath = path.join(output.absolute, "execution-bundle.json");
  if (records.length === loaded.schedule.blocks.length) {
    const bundle = assembleBundle({
      schedule: loaded.schedule,
      sourceIdentity: loaded.sourceIdentity,
      adapterIdentity: executableAdapter.identity,
      records,
    });
    await persistExact(bundle, existingBundlePath, "RESUME_BUNDLE_MISMATCH", "execution bundle");
    validateEnergyBlockExecutionBundle({ schedule: loaded.schedule, bundle });
    await assertScheduleUnchanged(schedulePath, loaded.source.sha256);
    await assertOutputInventory(output.absolute, true);
    return Object.freeze({
      status: "complete",
      completed: true,
      resumed: output.resumed || planResult.resumed,
      completed_blocks: records.length,
      remaining_blocks: 0,
      output_directory: output.absolute,
      bundle,
    });
  }
  let previousEnded = records.length === 0
    ? Number.NEGATIVE_INFINITY
    : Date.parse(records.at(-1).ended_at);
  for (let index = records.length; index < loaded.schedule.blocks.length; index += 1) {
    if (frozenSignal?.aborted) {
      await assertScheduleUnchanged(schedulePath, loaded.source.sha256);
      await assertOutputInventory(output.absolute, false);
      return Object.freeze({
        status: "aborted-at-block-boundary",
        completed: false,
        resumed: output.resumed || planResult.resumed,
        completed_blocks: records.length,
        remaining_blocks: loaded.schedule.blocks.length - records.length,
        output_directory: output.absolute,
        bundle: null,
      });
    }
    await assertScheduleUnchanged(schedulePath, loaded.source.sha256);
    let record;
    try {
      record = await executeBlock({
        schedule: loaded.schedule,
        block: loaded.schedule.blocks[index],
        manifests: loaded.manifests,
        adapter: executableAdapter,
        clock: frozenClock,
      });
    } catch (error) {
      await assertScheduleUnchanged(schedulePath, loaded.source.sha256);
      if (error instanceof EnergyBlockRunnerError) throw error;
      fail("ADAPTER_FAILURE", `fixture adapter failed in block ${loaded.schedule.blocks[index].block_id}`, error);
    }
    await assertScheduleUnchanged(schedulePath, loaded.source.sha256);
    validateRecord({
      schedule: loaded.schedule,
      manifests: loaded.manifests,
      adapterIdentity: executableAdapter.identity,
      block: loaded.schedule.blocks[index],
      record,
    });
    if (Date.parse(record.started_at) < previousEnded) {
      fail("TIME_ORDER_MISMATCH", `block ${record.block.block_id} overlaps or precedes the prior block`);
    }
    await persistExact(
      record,
      path.join(output.records, recordFileName(loaded.schedule.blocks[index])),
      "RESUME_RECORD_MISMATCH",
      `block record ${index}`,
    );
    records.push(record);
    previousEnded = Date.parse(record.ended_at);
  }
  await assertScheduleUnchanged(schedulePath, loaded.source.sha256);
  const bundle = assembleBundle({
    schedule: loaded.schedule,
    sourceIdentity: loaded.sourceIdentity,
    adapterIdentity: executableAdapter.identity,
    records,
  });
  validateEnergyBlockExecutionBundle({ schedule: loaded.schedule, bundle });
  await persistExact(bundle, existingBundlePath, "RESUME_BUNDLE_MISMATCH", "execution bundle");
  await assertOutputInventory(output.absolute, true);
  return Object.freeze({
    status: "complete",
    completed: true,
    resumed: output.resumed || planResult.resumed,
    completed_blocks: records.length,
    remaining_blocks: 0,
    output_directory: output.absolute,
    bundle,
  });
}
