import {
  canonicalize,
  sha256Hex,
} from "../lib/checkpoint-ledger.mjs";
import {
  FIXTURE_026_RSD_T02_ACTIONABLE_ARM_IDS,
  FIXTURE_026_RSD_T02_COST_VECTOR_KEYS,
  FIXTURE_026_RSD_T02_EVALUATOR_ONLY_ARM_ID,
} from "./rsd-t02-contract.mjs";
import {
  FIXTURE_026_RSD_T02_EVALUATOR_VERSION,
  assertFixture026RsdT02Evaluation,
  evaluateFixture026RsdT02Transcript,
} from "./rsd-t02-evaluator.mjs";
import {
  buildFixture026RsdT02EpisodeCommand,
  fixture026RsdT02InputCommandCount,
  fixture026RsdT02ScheduleSha256,
  generateFixture026RsdT02Transcript,
} from "./rsd-t02-generator.mjs";

export const FIXTURE_026_RSD_T02_EVENT_VERSION = "fixture-026.rsd-t02-event.v1";
export const FIXTURE_026_RSD_T02_EVENT_INTERPRETATION = "NO_RESULT: deterministic public-development RSD-T02 mechanism-construction, firewall, schedule, equivalence, and resume conformance only; no actionable estimator, comparison, scientific result, performance result, or energy result.";

const ZERO_HASH = "0".repeat(64);
const EVENT_KEYS = Object.freeze([
  "schema", "contract_version", "artifact", "track", "run_id", "profile", "partition",
  "seed", "execution_id", "work_key", "command_id", "recipe_id", "equation_id",
  "initialization_id", "episode_id", "intervention_family", "regime_membership",
  "background_u", "time_constant_s", "schedule_sha256", "transcript_sha256",
  "reported_output_sha256", "internal_output_sha256", "projection_sha256",
  "projection_hashes_by_actionable_arm", "projection_utf8_bytes", "response",
  "response_sha256", "evaluator", "gate_decision", "cost_vector",
  "serialized_event_bytes_written", "execution_claims", "excluded_claims", "status",
  "result_label", "no_result", "claim_eligible", "comparison_inference_permitted",
  "scientific_result", "performance_result", "measured_energy_present",
  "energy_conclusion_allowed", "interpretation", "integrity",
]);
const RESPONSE_KEYS = Object.freeze([
  "schema", "artifact", "track", "execution_id", "actionable_arm_responses",
  "evaluator_oracle_access", "response_role", "result_label", "no_result",
]);
const ARM_RESPONSE_KEYS = Object.freeze([
  "arm_id", "projection_sha256", "action", "reason",
]);

function exactKeys(value, keys) {
  return value
    && typeof value === "object"
    && !Array.isArray(value)
    && Object.keys(value).length === keys.length
    && keys.every((key) => Object.hasOwn(value, key));
}

function canonicalUint64Seed(value) {
  return typeof value === "string"
    && /^(0|[1-9][0-9]{0,19})$/u.test(value)
    && BigInt(value) <= 0xffff_ffff_ffff_ffffn;
}

export function fixture026RsdT02EventPayload(record) {
  const payload = { ...record };
  delete payload.integrity;
  return payload;
}

export function fixture026RsdT02WorkKey(record) {
  return `${record.run_id}:${record.profile}:${record.seed}:${record.recipe_id}:${record.execution_id}`;
}

export function buildFixture026RsdT02FrozenResponse({ executionId, projectionSha256 }) {
  if (typeof executionId !== "string" || !executionId || !/^[0-9a-f]{64}$/u.test(projectionSha256)) {
    throw new TypeError("Fixture 026 RSD-T02 response commitment input is invalid.");
  }
  const response = Object.freeze({
    schema: 1,
    artifact: "fixture-026",
    track: "RSD-T02",
    execution_id: executionId,
    actionable_arm_responses: Object.freeze(FIXTURE_026_RSD_T02_ACTIONABLE_ARM_IDS.map((armId) => Object.freeze({
      arm_id: armId,
      projection_sha256: projectionSha256,
      action: "abstain",
      reason: "actionable-arm-not-implemented-or-eligible",
    }))),
    evaluator_oracle_access: false,
    response_role: "system-abstention-before-evaluator-open",
    result_label: "NO_RESULT",
    no_result: true,
  });
  return Object.freeze({
    response,
    response_sha256: sha256Hex(canonicalize(response)),
  });
}

export function assertFixture026RsdT02FrozenResponse(response, projectionSha256) {
  if (
    !exactKeys(response, RESPONSE_KEYS)
    || response.schema !== 1
    || response.artifact !== "fixture-026"
    || response.track !== "RSD-T02"
    || typeof response.execution_id !== "string"
    || !Array.isArray(response.actionable_arm_responses)
    || response.actionable_arm_responses.length !== FIXTURE_026_RSD_T02_ACTIONABLE_ARM_IDS.length
    || response.actionable_arm_responses.some((armResponse, index) => (
      !exactKeys(armResponse, ARM_RESPONSE_KEYS)
      || armResponse.arm_id !== FIXTURE_026_RSD_T02_ACTIONABLE_ARM_IDS[index]
      || armResponse.projection_sha256 !== projectionSha256
      || armResponse.action !== "abstain"
      || armResponse.reason !== "actionable-arm-not-implemented-or-eligible"
    ))
    || response.evaluator_oracle_access !== false
    || response.response_role !== "system-abstention-before-evaluator-open"
    || response.result_label !== "NO_RESULT"
    || response.no_result !== true
  ) throw new Error("Fixture 026 RSD-T02 response violates its closed abstention contract.");
  return response;
}

function assertCostVector(cost) {
  if (!exactKeys(cost, FIXTURE_026_RSD_T02_COST_VECTOR_KEYS)) {
    throw new Error("Fixture 026 RSD-T02 cost vector has missing or unknown fields.");
  }
  const nonnegativeIntegerKeys = [
    "episodes", "sample_rows", "serialized_observation_bytes", "input_commands",
    "internal_resets", "internal_freezes", "output_clamps", "channel_switches",
    "state_writes", "retained_state_bytes", "tuning_trials",
  ];
  if (
    nonnegativeIntegerKeys.some((key) => !Number.isSafeInteger(cost[key]) || cost[key] < 0)
    || cost.episodes !== 1
    || cost.sample_rows !== 1537
    || cost.serialized_observation_bytes < 1
    || cost.retained_state_bytes !== 16
    || cost.tuning_trials !== 0
    || cost.scalar_operations !== null
    || cost.transcendental_evaluations !== null
    || cost.parameter_bytes !== null
    || cost.wall_seconds !== null
    || cost.later_joules !== null
  ) throw new Error("Fixture 026 RSD-T02 cost vector violates its typed measured/unmeasured boundary.");
  return cost;
}

function expectedCostVector(command, transcript) {
  const family = command.intervention_family;
  return {
    episodes: 1,
    sample_rows: transcript.samples.length,
    serialized_observation_bytes: transcript.projection_utf8_bytes,
    input_commands: fixture026RsdT02InputCommandCount(command),
    internal_resets: family === "opaque-state-reset" ? 1 : 0,
    internal_freezes: family === "opaque-state-freeze" ? 1 : 0,
    output_clamps: family === "reported-output-clamp" ? 1 : 0,
    channel_switches: command.schedule.kind === "two-pulse-channel-restimulation"
      && command.schedule.first_channel !== command.schedule.second_channel ? 1 : 0,
    state_writes: family === "opaque-state-reset" ? 1 : 0,
    scalar_operations: null,
    transcendental_evaluations: null,
    retained_state_bytes: 16,
    parameter_bytes: null,
    tuning_trials: 0,
    wall_seconds: null,
    later_joules: null,
  };
}

export function assertFixture026RsdT02Event(record, {
  sequence = null,
  previousHash = null,
  runId = null,
  profile = null,
} = {}) {
  if (!exactKeys(record, EVENT_KEYS)) {
    throw new Error("Fixture 026 RSD-T02 event has missing or unknown fields.");
  }
  const expectedSequence = sequence ?? record.integrity?.sequence;
  const expectedPreviousHash = previousHash ?? record.integrity?.previous_sha256;
  assertFixture026RsdT02FrozenResponse(record.response, record.projection_sha256);
  assertFixture026RsdT02Evaluation(record.evaluator);
  assertCostVector(record.cost_vector);
  const expectedCommand = buildFixture026RsdT02EpisodeCommand({
    profile: record.profile,
    seed: record.seed,
    recipe_id: record.recipe_id,
    execution_id: record.execution_id,
    episode_id: record.episode_id,
    background_u: record.background_u,
    time_constant_s: record.time_constant_s,
    regime_membership: record.regime_membership,
  });
  const expectedTranscript = generateFixture026RsdT02Transcript(expectedCommand);
  const expectedTranscriptSha256 = sha256Hex(canonicalize(expectedTranscript));
  const expectedEvaluation = evaluateFixture026RsdT02Transcript(expectedTranscript, {
    response: record.response,
    response_sha256: record.response_sha256,
  });
  const expectedCost = expectedCostVector(expectedCommand, expectedTranscript);
  const projectionHashValues = Object.values(record.projection_hashes_by_actionable_arm ?? {});
  if (
    record.schema !== 1
    || record.contract_version !== FIXTURE_026_RSD_T02_EVENT_VERSION
    || record.artifact !== "fixture-026"
    || record.track !== "RSD-T02"
    || !/^[0-9a-f]{64}$/u.test(record.run_id)
    || (runId !== null && record.run_id !== runId)
    || !new Set(["smoke", "development"]).has(record.profile)
    || (profile !== null && record.profile !== profile)
    || record.partition !== "public-development"
    || !canonicalUint64Seed(record.seed)
    || typeof record.execution_id !== "string"
    || record.work_key !== fixture026RsdT02WorkKey(record)
    || record.command_id !== expectedCommand.command_id
    || typeof record.recipe_id !== "string"
    || record.equation_id !== expectedCommand.equation_id
    || record.initialization_id !== expectedCommand.initialization_id
    || record.episode_id !== expectedCommand.episode_id
    || record.intervention_family !== expectedCommand.intervention_family
    || canonicalize(record.regime_membership) !== canonicalize(expectedCommand.regime_membership)
    || record.background_u !== expectedCommand.background_u
    || record.time_constant_s !== expectedCommand.time_constant_s
    || record.schedule_sha256 !== fixture026RsdT02ScheduleSha256(expectedCommand)
    || record.transcript_sha256 !== expectedTranscriptSha256
    || record.reported_output_sha256 !== expectedTranscript.reported_output_sha256
    || record.internal_output_sha256 !== expectedTranscript.internal_output_sha256
    || record.projection_sha256 !== expectedTranscript.projection_sha256
    || !exactKeys(record.projection_hashes_by_actionable_arm, FIXTURE_026_RSD_T02_ACTIONABLE_ARM_IDS)
    || projectionHashValues.length !== FIXTURE_026_RSD_T02_ACTIONABLE_ARM_IDS.length
    || projectionHashValues.some((value) => value !== record.projection_sha256)
    || !Number.isSafeInteger(record.projection_utf8_bytes)
    || record.projection_utf8_bytes !== record.cost_vector.serialized_observation_bytes
    || record.projection_utf8_bytes !== expectedTranscript.projection_utf8_bytes
    || record.response.execution_id !== record.execution_id
    || record.response_sha256 !== sha256Hex(canonicalize(record.response))
    || record.evaluator.contract_version !== FIXTURE_026_RSD_T02_EVALUATOR_VERSION
    || record.evaluator.transcript_sha256 !== record.transcript_sha256
    || record.evaluator.response_commitment_sha256 !== record.response_sha256
    || record.evaluator.recipe_id !== record.recipe_id
    || record.evaluator.equation_id !== record.equation_id
    || record.evaluator.evaluator_id !== FIXTURE_026_RSD_T02_EVALUATOR_ONLY_ARM_ID
    || canonicalize(record.evaluator) !== canonicalize(expectedEvaluation)
    || record.gate_decision !== "accepted"
    || canonicalize(record.cost_vector) !== canonicalize(expectedCost)
    || !Number.isSafeInteger(record.serialized_event_bytes_written)
    || record.serialized_event_bytes_written < 1
    || !Array.isArray(record.execution_claims)
    || record.execution_claims.length !== 0
    || canonicalize(record.excluded_claims) !== canonicalize(["C-1561", "C-1564"])
    || record.status !== "public-development-conformance-only"
    || record.result_label !== "NO_RESULT"
    || record.no_result !== true
    || record.claim_eligible !== false
    || record.comparison_inference_permitted !== false
    || record.scientific_result !== false
    || record.performance_result !== false
    || record.measured_energy_present !== false
    || record.energy_conclusion_allowed !== false
    || record.interpretation !== FIXTURE_026_RSD_T02_EVENT_INTERPRETATION
    || !exactKeys(record.integrity, ["sequence", "previous_sha256", "record_sha256"])
    || !Number.isSafeInteger(record.integrity.sequence)
    || record.integrity.sequence < 0
    || record.integrity.sequence !== expectedSequence
    || !/^[0-9a-f]{64}$/u.test(record.integrity.previous_sha256)
    || record.integrity.previous_sha256 !== expectedPreviousHash
    || !/^[0-9a-f]{64}$/u.test(record.integrity.record_sha256)
    || record.integrity.record_sha256 !== sha256Hex(
      `${expectedPreviousHash}\n${canonicalize(fixture026RsdT02EventPayload(record))}`,
    )
    || record.serialized_event_bytes_written
      !== Buffer.byteLength(`${JSON.stringify(record)}\n`, "utf8")
  ) throw new Error("Fixture 026 RSD-T02 event violates its closed cross-field or authority contract.");
  if (expectedSequence === 0 && expectedPreviousHash !== ZERO_HASH) {
    throw new Error("Fixture 026 RSD-T02 first event must begin at the zero hash.");
  }
  return record;
}
