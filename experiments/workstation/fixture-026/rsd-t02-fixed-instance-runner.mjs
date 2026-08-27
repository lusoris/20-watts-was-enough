import { canonicalize, sha256Hex } from "../lib/checkpoint-ledger.mjs";
import {
  FIXTURE_026_RSD_T02_ACTIONABLE_ARM_IDS,
  FIXTURE_026_RSD_T02_EPISODES,
  FIXTURE_026_RSD_T02_EPISODE_PROTOCOL_VERSION,
  FIXTURE_026_RSD_T02_MODEL_CONSTANTS,
} from "./rsd-t02-contract.mjs";
import { simulateFixture026RsdT02Episode } from "./rsd-t02-models.mjs";
import {
  FIXTURE_026_RSD_T02_FAMILY_REGISTRY_VERSION,
  FIXTURE_026_RSD_T02_EPISODE_PROTOCOL_SHA256,
  assertFixture026RsdT02DevelopmentInstance,
  assertFixture026RsdT02SystemFamilyRegistry,
} from "./rsd-t02-system-family-generator.mjs";
import {
  FIXTURE_026_RSD_T02_FIXED_PACKET_VERSION,
  FIXTURE_026_RSD_T02_POPULATION_DESIGN_VERSION,
} from "./rsd-t02-population-contract.mjs";

export const FIXTURE_026_RSD_T02_FIXED_INSTANCE_RUNNER_CONFIG_VERSION =
  "fixture-026.rsd-t02-fixed-instance-runner-config.v1";
export const FIXTURE_026_RSD_T02_FIXED_INSTANCE_RUNNER_VERSION =
  "fixture-026.rsd-t02-fixed-instance-runner.v1";
export const FIXTURE_026_RSD_T02_FIXED_INSTANCE_TRANSCRIPT_VERSION =
  "fixture-026.rsd-t02-fixed-instance-transcript.v1";
export const FIXTURE_026_RSD_T02_FIXED_INSTANCE_POLICY_VIEW_VERSION =
  "fixture-026.rsd-t02-fixed-instance-policy-view.v1";
export const FIXTURE_026_RSD_T02_FIXED_INSTANCE_POLICY_RESPONSE_VERSION =
  "fixture-026.rsd-t02-fixed-instance-policy-response.v1";
export const FIXTURE_026_RSD_T02_FIXED_INSTANCE_LEDGER_RECORD_VERSION =
  "fixture-026.rsd-t02-fixed-instance-ledger-record.v1";
export const FIXTURE_026_RSD_T02_FIXED_INSTANCE_RUNNER_CONFIG_SHA256 =
  "493b188025fa77e1c178f7c869d961f09a268f26cdcefdc1dba0bf6758263db2";

const ZERO_HASH = "0".repeat(64);
const HASH_PATTERN = /^[0-9a-f]{64}$/u;
const RUNNER_CONFIG_KEYS = Object.freeze([
  "schema", "contract_version", "artifact", "track", "authority", "partition",
  "family_registry_contract_version", "population_contract_version",
  "fixed_packet_version", "episode_protocol_version", "episode_protocol_sha256",
  "arm_ids", "transcript_contract", "policy_view_contract", "policy_execution_contract",
  "resource_caps", "resume_contract", "policy_mode", "comparison_inference_permitted",
  "claim_eligible", "result_label",
]);
const TRANSCRIPT_CONTRACT_KEYS = Object.freeze([
  "episode_count", "samples_per_episode", "sample_rows_per_packet", "episode_order",
  "numeric_model", "trajectories_generated", "internal_output_visible_to_policy",
]);
const POLICY_VIEW_CONTRACT_KEYS = Object.freeze([
  "root_fields", "projection_fields", "sample_fields", "forbidden_recursive_fields",
  "future_samples_outside_packet_visible", "evaluator_truth_visible", "provenance_visible",
]);
const POLICY_EXECUTION_CONTRACT_KEYS = Object.freeze([
  "execution_mode", "content_addressed_policy_bundle", "fresh_isolated_child_per_packet",
  "custom_success_executor_permitted", "comparison_policy_execution", "design_gate",
  "design_gate_satisfied", "remaining_blocker",
]);
const RESOURCE_CAP_KEYS = Object.freeze([
  "thread_cap", "arm_invocations_per_packet", "episodes_per_packet",
  "sample_rows_per_arm", "policy_view_utf8_bytes", "scalar_operations_per_arm",
  "retained_state_bytes_per_arm", "runtime_failures_per_arm",
  "malformed_responses_per_arm", "fallback_invocations_per_arm", "wall_seconds",
  "later_joules",
]);
const RESUME_CONTRACT_KEYS = Object.freeze([
  "ledger_order", "record_chain", "existing_records_mutable",
  "retry_failed_arm_permitted", "foreign_packet_resume_permitted",
]);
const POLICY_VIEW_KEYS = Object.freeze([
  "schema", "contract_version", "units", "order", "projections",
]);
const POLICY_PROJECTION_KEYS = Object.freeze(["ordinal", "schedule", "samples"]);
const POLICY_SAMPLE_KEYS = Object.freeze([
  "ordinal", "time_s", "input_a_u", "input_b_u", "active_channel",
  "reported_output", "output_clamped", "state_reset_applied", "state_freeze_active",
]);
const RECEIPT_KEYS = Object.freeze([
  "episode_ordinal", "episode_id", "realization_id", "initialization_id",
  "parameter_vector_sha256", "nuisance_vector_sha256", "time_constant",
  "schedule_sha256",
  "transcript_sha256", "policy_projection_sha256", "reported_output_sha256",
  "internal_output_sha256", "final_state_sha256", "sample_rows", "input_commands",
]);
const ACQUISITION_KEYS = Object.freeze([
  "episode_count", "sample_rows", "input_commands", "internal_resets",
  "internal_freezes", "output_clamps", "channel_switches", "state_writes",
  "simulation_internal_steps",
  "rk4_derivative_evaluations", "policy_view_utf8_bytes",
  "transcript_generation_scalar_operations", "wall_seconds", "later_joules", "charged",
]);
const RUN_ARTIFACT_KEYS = Object.freeze([
  "schema", "contract_version", "status", "run_id", "config_sha256",
  "input_artifact_sha256", "instance_id", "fixed_packet_id", "episode_protocol_version",
  "episode_protocol_sha256", "transcript_set_sha256", "transcript_receipts",
  "policy_view_sha256", "policy_view_utf8_bytes", "policy_view", "acquisition_resource",
  "ledger", "next_arm_index", "failure_record", "authority",
  "comparison_inference_permitted", "claim_eligible", "result_label", "no_result",
]);
const RESPONSE_KEYS = Object.freeze([
  "schema", "contract_version", "arm_id", "action", "decision", "reason_codes",
  "work_digest_sha256", "work", "authority", "comparison_inference_permitted",
  "claim_eligible", "result_label", "no_result",
]);
const RESPONSE_WORK_KEYS = Object.freeze([
  "sample_rows_read", "scalar_operations", "retained_state_bytes",
]);
const LEDGER_KEYS = Object.freeze([
  "schema", "contract_version", "sequence", "previous_record_sha256", "run_id",
  "arm_id", "fixed_packet_id", "policy_view_sha256", "status", "response",
  "response_sha256", "resource_ledger", "failure_record", "authority",
  "comparison_inference_permitted", "claim_eligible", "result_label", "no_result",
  "record_sha256",
]);
const RESOURCE_LEDGER_KEYS = Object.freeze([
  "shared_acquisition", "actual", "caps", "within_caps", "charged",
]);
const SHARED_RESOURCE_KEYS = Object.freeze([
  "fixed_packet_id", "policy_view_sha256", "episodes_available",
  "sample_rows_available", "canonical_policy_view_bytes", "charged_once_at_run",
]);
const ACTUAL_RESOURCE_KEYS = Object.freeze([
  "arm_invocations", "sample_rows_read", "scalar_operations", "retained_state_bytes",
  "runtime_failures", "malformed_responses", "fallback_invocations", "wall_seconds",
  "later_joules",
]);
const FAILURE_KEYS = Object.freeze(["category", "stage", "reason_code", "detail_sha256"]);
const SUCCESS_REASON = "view-digest-conformance-only-no-policy-or-comparison-authority";

function exactKeys(value, keys) {
  return value !== null
    && typeof value === "object"
    && !Array.isArray(value)
    && Object.keys(value).length === keys.length
    && keys.every((key) => Object.hasOwn(value, key));
}

function refuse(message) {
  throw new Error(`Fixture 026 RSD-T02 fixed-instance runner refused: ${message}`);
}

function digest(value) {
  try {
    return sha256Hex(canonicalize(value));
  } catch {
    refuse("value is not canonically serializable");
  }
}

function canonicalBytes(value) {
  return Buffer.byteLength(canonicalize(value), "utf8");
}

function deepFreeze(value) {
  if (value && typeof value === "object" && !Object.isFrozen(value)) {
    Object.freeze(value);
    for (const child of Object.values(value)) deepFreeze(child);
  }
  return value;
}

function publicSchedule(episode) {
  return episode.state_handle === null
    ? { ...episode.schedule }
    : { ...episode.schedule, opaque_state_handle: episode.state_handle };
}

function rampValue(schedule, timeS) {
  const phase = Math.max(0, Math.min(1, (timeS - schedule.start_time_s) / schedule.duration_s));
  if (schedule.interpolation === "linear-in-fold") {
    return schedule.from_fold + phase * (schedule.to_fold - schedule.from_fold);
  }
  return Math.exp(
    Math.log(schedule.from_fold)
      + phase * (Math.log(schedule.to_fold) - Math.log(schedule.from_fold)),
  );
}

function pausedRampValue(schedule, timeS) {
  const holdStartS = schedule.hold_after_active_ramp_s;
  const holdEndS = holdStartS + schedule.hold_duration_s;
  let activeElapsedS;
  if (timeS <= holdStartS) activeElapsedS = timeS;
  else if (timeS < holdEndS) activeElapsedS = holdStartS;
  else activeElapsedS = timeS - schedule.hold_duration_s;
  const phase = Math.max(0, Math.min(1, activeElapsedS / schedule.active_ramp_duration_s));
  return schedule.from_fold + phase * (schedule.to_fold - schedule.from_fold);
}

function scheduleFunctions(schedule) {
  let inputAt;
  let activeChannelAt = () => "A";
  let outputClampedAt = () => false;
  let stateReset = null;
  let stateFreeze = null;
  if (schedule.kind === "step") inputAt = () => schedule.to_fold;
  else if (schedule.kind === "periodic-square-pulse") {
    inputAt = (timeS) => {
      if (timeS < schedule.start_time_s || timeS >= schedule.stop_time_s) {
        return schedule.low_fold;
      }
      const phase = (timeS - schedule.start_time_s) % schedule.period_s;
      return phase < schedule.pulse_width_s ? schedule.high_fold : schedule.low_fold;
    };
  } else if (schedule.kind === "ramp-then-hold") inputAt = (timeS) => rampValue(schedule, timeS);
  else if (schedule.kind === "step-with-state-reset") {
    inputAt = () => schedule.to_fold;
    stateReset = {
      time_s: schedule.intervention_time_s,
      state_handle: schedule.opaque_state_handle,
    };
  } else if (schedule.kind === "step-with-state-freeze") {
    inputAt = () => schedule.to_fold;
    stateFreeze = {
      start_time_s: schedule.intervention_start_s,
      end_time_s: schedule.intervention_end_s,
      state_handle: schedule.opaque_state_handle,
    };
  } else if (schedule.kind === "step-with-output-clamp") {
    inputAt = () => schedule.to_fold;
    outputClampedAt = (timeS) => (
      timeS >= schedule.intervention_start_s && timeS < schedule.intervention_end_s
    );
  } else if (schedule.kind === "paused-linear-ramp") {
    inputAt = (timeS) => pausedRampValue(schedule, timeS);
  } else if (schedule.kind === "two-pulse-channel-restimulation") {
    inputAt = (timeS) => {
      const input = { A: schedule.low_fold, B: schedule.low_fold };
      if (timeS >= schedule.first_pulse_start_s && timeS < schedule.first_pulse_end_s) {
        input[schedule.first_channel] = schedule.high_fold;
      }
      if (timeS >= schedule.second_pulse_start_s && timeS < schedule.second_pulse_end_s) {
        input[schedule.second_channel] = schedule.high_fold;
      }
      return input;
    };
    activeChannelAt = (timeS) => (
      timeS < schedule.second_pulse_start_s
        ? schedule.first_channel
        : schedule.second_channel
    );
  } else refuse(`unsupported registered schedule kind ${schedule.kind}`);
  return { inputAt, activeChannelAt, outputClampedAt, stateReset, stateFreeze };
}

function inputCommandCount(schedule) {
  if (schedule.kind === "periodic-square-pulse") return schedule.pulse_count * 2;
  if (schedule.kind === "two-pulse-channel-restimulation") return 4;
  return 1;
}

function recursiveKeys(value, target = []) {
  if (Array.isArray(value)) {
    value.forEach((child) => recursiveKeys(child, target));
  } else if (value && typeof value === "object") {
    for (const [key, child] of Object.entries(value)) {
      target.push(key);
      recursiveKeys(child, target);
    }
  }
  return target;
}

function assertNoEvaluatorValueLeak(instance, view) {
  const serialized = canonicalize(view);
  const forbiddenValues = [
    instance.family_id,
    instance.recipe_id,
    instance.equation_id,
    instance.manifest.instance_id,
    instance.manifest.family_id,
    instance.manifest.structural_lineage_id,
    instance.manifest.parameter_vector_sha256,
    instance.manifest.nuisance_vector_sha256,
    instance.manifest.property_certificate_set_sha256,
    instance.packet.packet_id,
    instance.provenance.registry_sha256,
    instance.provenance.family_registry_identity_sha256,
    instance.provenance.implementation_provenance.model_source_sha256_exact_bytes,
  ];
  if (forbiddenValues.some((value) => (
    typeof value === "string" && value.length >= 3 && serialized.includes(JSON.stringify(value))
  ))) refuse("policy view leaks an evaluator identity or provenance value");
}

export function assertFixture026RsdT02FixedInstanceRunnerConfig(config) {
  if (
    !exactKeys(config, RUNNER_CONFIG_KEYS)
    || digest(config) !== FIXTURE_026_RSD_T02_FIXED_INSTANCE_RUNNER_CONFIG_SHA256
    || config.schema !== 1
    || config.contract_version !== FIXTURE_026_RSD_T02_FIXED_INSTANCE_RUNNER_CONFIG_VERSION
    || config.artifact !== "fixture-026"
    || config.track !== "RSD-T02"
    || config.authority !== "public-development-transcript-resource-conformance-only"
    || config.partition !== "development"
    || config.family_registry_contract_version !== FIXTURE_026_RSD_T02_FAMILY_REGISTRY_VERSION
    || config.population_contract_version !== FIXTURE_026_RSD_T02_POPULATION_DESIGN_VERSION
    || config.fixed_packet_version !== FIXTURE_026_RSD_T02_FIXED_PACKET_VERSION
    || config.episode_protocol_version !== FIXTURE_026_RSD_T02_EPISODE_PROTOCOL_VERSION
    || config.episode_protocol_sha256 !== FIXTURE_026_RSD_T02_EPISODE_PROTOCOL_SHA256
    || canonicalize(config.arm_ids) !== canonicalize(FIXTURE_026_RSD_T02_ACTIONABLE_ARM_IDS)
    || !exactKeys(config.transcript_contract, TRANSCRIPT_CONTRACT_KEYS)
    || config.transcript_contract.episode_count !== FIXTURE_026_RSD_T02_EPISODES.length
    || config.transcript_contract.samples_per_episode
      !== FIXTURE_026_RSD_T02_MODEL_CONSTANTS.samples_per_episode
    || config.transcript_contract.sample_rows_per_packet
      !== FIXTURE_026_RSD_T02_EPISODES.length
        * FIXTURE_026_RSD_T02_MODEL_CONSTANTS.samples_per_episode
    || config.transcript_contract.episode_order !== "fixed-instance-packet-order-v1"
    || config.transcript_contract.numeric_model !== "IEEE-754-binary64"
    || config.transcript_contract.trajectories_generated !== true
    || config.transcript_contract.internal_output_visible_to_policy !== false
    || !exactKeys(config.policy_view_contract, POLICY_VIEW_CONTRACT_KEYS)
    || canonicalize(config.policy_view_contract.root_fields) !== canonicalize(POLICY_VIEW_KEYS)
    || canonicalize(config.policy_view_contract.projection_fields)
      !== canonicalize(POLICY_PROJECTION_KEYS)
    || canonicalize(config.policy_view_contract.sample_fields) !== canonicalize(POLICY_SAMPLE_KEYS)
    || !Array.isArray(config.policy_view_contract.forbidden_recursive_fields)
    || new Set(config.policy_view_contract.forbidden_recursive_fields).size
      !== config.policy_view_contract.forbidden_recursive_fields.length
    || config.policy_view_contract.future_samples_outside_packet_visible !== false
    || config.policy_view_contract.evaluator_truth_visible !== false
    || config.policy_view_contract.provenance_visible !== false
    || !exactKeys(config.policy_execution_contract, POLICY_EXECUTION_CONTRACT_KEYS)
    || config.policy_execution_contract.execution_mode
      !== "in-process-built-in-view-digest-abstention-conformance"
    || config.policy_execution_contract.content_addressed_policy_bundle !== false
    || config.policy_execution_contract.fresh_isolated_child_per_packet !== false
    || config.policy_execution_contract.custom_success_executor_permitted !== false
    || config.policy_execution_contract.comparison_policy_execution !== false
    || config.policy_execution_contract.design_gate
      !== "validated-parameterized-transcript-policy-resource-runner"
    || config.policy_execution_contract.design_gate_satisfied !== false
    || config.policy_execution_contract.remaining_blocker
      !== "content-addressed-26-projection-policy-bundle-fresh-isolated-child-and-semantic-replay"
    || !exactKeys(config.resource_caps, RESOURCE_CAP_KEYS)
    || config.resource_caps.thread_cap !== 1
    || config.resource_caps.arm_invocations_per_packet !== config.arm_ids.length
    || config.resource_caps.episodes_per_packet !== config.transcript_contract.episode_count
    || config.resource_caps.sample_rows_per_arm !== config.transcript_contract.sample_rows_per_packet
    || !Number.isSafeInteger(config.resource_caps.policy_view_utf8_bytes)
    || config.resource_caps.policy_view_utf8_bytes < 1
    || !Number.isSafeInteger(config.resource_caps.scalar_operations_per_arm)
    || config.resource_caps.scalar_operations_per_arm < 1
    || !Number.isSafeInteger(config.resource_caps.retained_state_bytes_per_arm)
    || config.resource_caps.retained_state_bytes_per_arm < 1
    || config.resource_caps.runtime_failures_per_arm !== 1
    || config.resource_caps.malformed_responses_per_arm !== 1
    || config.resource_caps.fallback_invocations_per_arm !== 0
    || config.resource_caps.wall_seconds !== null
    || config.resource_caps.later_joules !== null
    || !exactKeys(config.resume_contract, RESUME_CONTRACT_KEYS)
    || config.resume_contract.ledger_order !== "registered-arm-order-v1"
    || config.resume_contract.record_chain !== "sha256-canonical-json-previous-record-v1"
    || config.resume_contract.existing_records_mutable !== false
    || config.resume_contract.retry_failed_arm_permitted !== false
    || config.resume_contract.foreign_packet_resume_permitted !== false
    || config.policy_mode !== "deterministic-causal-view-digest-abstention-conformance-v1"
    || config.comparison_inference_permitted !== false
    || config.claim_eligible !== false
    || config.result_label !== "NO_RESULT"
  ) refuse("runner config differs from the closed NO_RESULT contract");
  return config;
}

function assertPolicyView(config, view) {
  if (
    !exactKeys(view, POLICY_VIEW_KEYS)
    || view.schema !== 1
    || view.contract_version !== FIXTURE_026_RSD_T02_FIXED_INSTANCE_POLICY_VIEW_VERSION
    || canonicalize(view.units) !== canonicalize({ input: "U", output: "1", time: "s" })
    || view.order !== config.transcript_contract.episode_order
    || !Array.isArray(view.projections)
    || view.projections.length !== config.transcript_contract.episode_count
  ) refuse("policy view violates its closed root allowlist");
  const forbidden = new Set(config.policy_view_contract.forbidden_recursive_fields);
  if (recursiveKeys(view).some((key) => forbidden.has(key))) {
    refuse("policy view leaks evaluator truth, identity, or provenance");
  }
  let rows = 0;
  for (const [episodeOrdinal, projection] of view.projections.entries()) {
    const registered = FIXTURE_026_RSD_T02_EPISODES[episodeOrdinal];
    if (
      !exactKeys(projection, POLICY_PROJECTION_KEYS)
      || projection.ordinal !== episodeOrdinal
      || canonicalize(projection.schedule) !== canonicalize(publicSchedule(registered))
      || !Array.isArray(projection.samples)
      || projection.samples.length !== config.transcript_contract.samples_per_episode
    ) refuse(`policy projection ${episodeOrdinal} violates its allowlist`);
    for (const [sampleOrdinal, sample] of projection.samples.entries()) {
      if (
        !exactKeys(sample, POLICY_SAMPLE_KEYS)
        || sample.ordinal !== sampleOrdinal
        || sample.time_s !== sampleOrdinal / FIXTURE_026_RSD_T02_MODEL_CONSTANTS.output_rate_hz
        || !Number.isFinite(sample.input_a_u)
        || !Number.isFinite(sample.input_b_u)
        || !["A", "B"].includes(sample.active_channel)
        || !Number.isFinite(sample.reported_output)
        || typeof sample.output_clamped !== "boolean"
        || typeof sample.state_reset_applied !== "boolean"
        || typeof sample.state_freeze_active !== "boolean"
      ) refuse(`policy sample ${episodeOrdinal}:${sampleOrdinal} is malformed`);
      rows += 1;
    }
  }
  if (rows !== config.transcript_contract.sample_rows_per_packet) {
    refuse("policy view row count differs from the fixed packet");
  }
  const bytes = canonicalBytes(view);
  if (bytes > config.resource_caps.policy_view_utf8_bytes) {
    refuse("policy view exceeds its frozen byte cap");
  }
  return view;
}

function buildTranscriptBundle({ config, registry, instance }) {
  assertFixture026RsdT02FixedInstanceRunnerConfig(config);
  assertFixture026RsdT02SystemFamilyRegistry(registry);
  assertFixture026RsdT02DevelopmentInstance({ registry, artifact: instance });
  if (
    instance.packet.packet_version !== config.fixed_packet_version
    || instance.packet.episodes.length !== config.transcript_contract.episode_count
    || instance.provenance.episode_protocol_version !== config.episode_protocol_version
    || instance.provenance.episode_protocol_sha256 !== config.episode_protocol_sha256
  ) refuse("generated instance does not bind the runner packet and protocol");

  const projections = [];
  const receipts = [];
  const initializationId = digest({
    domain: "fixture-026.rsd-t02-fixed-instance-opaque-state-permutation.v1",
    instance_id: instance.manifest.instance_id,
    nuisance_vector_sha256: instance.manifest.nuisance_vector_sha256,
  });
  for (const [episodeOrdinal, packetEpisode] of instance.packet.episodes.entries()) {
    const registered = FIXTURE_026_RSD_T02_EPISODES[episodeOrdinal];
    if (
      registered?.episode_id !== packetEpisode.episode_id
      || packetEpisode.parameter_vector_sha256 !== instance.manifest.parameter_vector_sha256
      || packetEpisode.time_constant_s !== instance.manifest.fixed_time_constant_s
      || packetEpisode.realization_ids.length !== 1
    ) refuse(`fixed packet episode ${episodeOrdinal} changes its system or order`);
    const schedule = publicSchedule(registered);
    const functions = scheduleFunctions(schedule);
    const realizationId = packetEpisode.realization_ids[0];
    if (!/^R-[0-9a-f]{64}$/u.test(realizationId)) {
      refuse("realization ID is not a canonical replay key");
    }
    const simulation = simulateFixture026RsdT02Episode({
      recipe_id: instance.recipe_id,
      horizon_s: FIXTURE_026_RSD_T02_MODEL_CONSTANTS.episode_horizon_s,
      internal_step_s: FIXTURE_026_RSD_T02_MODEL_CONSTANTS.internal_step_s,
      output_rate_hz: FIXTURE_026_RSD_T02_MODEL_CONSTANTS.output_rate_hz,
      time_constant_s: packetEpisode.time_constant_s,
      input_at: functions.inputAt,
      active_channel_at: functions.activeChannelAt,
      output_clamped_at: functions.outputClampedAt,
      initialization_id: initializationId,
      state_reset: functions.stateReset,
      state_freeze: functions.stateFreeze,
    });
    if (simulation.samples.length !== config.transcript_contract.samples_per_episode) {
      refuse(`simulation ${episodeOrdinal} produced the wrong row count`);
    }
    const fullSamples = simulation.samples.map((sample, sampleOrdinal) => {
      const normalized = functions.inputAt(sample.time_s);
      const byChannel = typeof normalized === "number"
        ? { A: normalized, B: normalized }
        : normalized;
      return {
        ordinal: sampleOrdinal,
        time_s: sample.time_s,
        input_a_u: registered.background_u * byChannel.A,
        input_b_u: registered.background_u * byChannel.B,
        active_channel: functions.activeChannelAt(sample.time_s),
        reported_output: sample.output,
        internal_output: sample.internal_output,
        output_clamped: functions.outputClampedAt(sample.time_s),
        state_reset_applied: functions.stateReset !== null
          && sample.time_s === functions.stateReset.time_s,
        state_freeze_active: functions.stateFreeze !== null
          && sample.time_s >= functions.stateFreeze.start_time_s
          && sample.time_s < functions.stateFreeze.end_time_s,
      };
    });
    const policySamples = fullSamples.map(({ internal_output: ignored, ...sample }) => {
      void ignored;
      return sample;
    });
    const projection = {
      ordinal: episodeOrdinal,
      schedule,
      samples: policySamples,
    };
    const transcriptBody = {
      schema: 1,
      contract_version: FIXTURE_026_RSD_T02_FIXED_INSTANCE_TRANSCRIPT_VERSION,
      fixed_packet_id: instance.packet.packet_id,
      instance_id: instance.manifest.instance_id,
      family_id: instance.manifest.family_id,
      family_version: instance.manifest.family_version,
      structural_lineage_id: instance.manifest.structural_lineage_id,
      recipe_id: instance.recipe_id,
      equation_id: instance.equation_id,
      parameter_vector_sha256: instance.manifest.parameter_vector_sha256,
      nuisance_vector_sha256: instance.manifest.nuisance_vector_sha256,
      property_certificate_set_sha256: instance.manifest.property_certificate_set_sha256,
      episode_protocol_version: instance.provenance.episode_protocol_version,
      episode_protocol_sha256: instance.provenance.episode_protocol_sha256,
      model_source_sha256_exact_bytes:
        instance.provenance.implementation_provenance.model_source_sha256_exact_bytes,
      episode_ordinal: episodeOrdinal,
      episode_id: packetEpisode.episode_id,
      realization_id: realizationId,
      initialization_id: initializationId,
      schedule,
      time_constant: instance.parameter_vector.values.time_constant,
      samples: fullSamples,
      final_state: simulation.final_state,
      authority: "public-development-transcript-conformance-only",
      comparison_inference_permitted: false,
      claim_eligible: false,
      result_label: "NO_RESULT",
    };
    projections.push(projection);
    receipts.push({
      episode_ordinal: episodeOrdinal,
      episode_id: packetEpisode.episode_id,
      realization_id: realizationId,
      initialization_id: initializationId,
      parameter_vector_sha256: instance.manifest.parameter_vector_sha256,
      nuisance_vector_sha256: instance.manifest.nuisance_vector_sha256,
      time_constant: instance.parameter_vector.values.time_constant,
      schedule_sha256: digest(schedule),
      transcript_sha256: digest(transcriptBody),
      policy_projection_sha256: digest(projection),
      reported_output_sha256: digest(fullSamples.map(({ reported_output: value }) => value)),
      internal_output_sha256: digest(fullSamples.map(({ internal_output: value }) => value)),
      final_state_sha256: digest(simulation.final_state),
      sample_rows: fullSamples.length,
      input_commands: inputCommandCount(schedule),
    });
  }
  const policyView = deepFreeze({
    schema: 1,
    contract_version: FIXTURE_026_RSD_T02_FIXED_INSTANCE_POLICY_VIEW_VERSION,
    units: { input: "U", output: "1", time: "s" },
    order: config.transcript_contract.episode_order,
    projections,
  });
  assertPolicyView(config, policyView);
  assertNoEvaluatorValueLeak(instance, policyView);
  const frozenReceipts = deepFreeze(receipts);
  const policyViewUtf8Bytes = canonicalBytes(policyView);
  const internalSteps = FIXTURE_026_RSD_T02_MODEL_CONSTANTS.episode_horizon_s
    / FIXTURE_026_RSD_T02_MODEL_CONSTANTS.internal_step_s;
  return deepFreeze({
    input_artifact_sha256: digest(instance),
    instance_id: instance.manifest.instance_id,
    fixed_packet_id: instance.packet.packet_id,
    transcript_set_sha256: digest(frozenReceipts),
    transcript_receipts: frozenReceipts,
    policy_view_sha256: digest(policyView),
    policy_view_utf8_bytes: policyViewUtf8Bytes,
    policy_view: policyView,
    acquisition_resource: {
      episode_count: receipts.length,
      sample_rows: receipts.reduce((sum, receipt) => sum + receipt.sample_rows, 0),
      input_commands: receipts.reduce((sum, receipt) => sum + receipt.input_commands, 0),
      internal_resets: FIXTURE_026_RSD_T02_EPISODES.filter(
        ({ intervention_family: family }) => family === "opaque-state-reset",
      ).length,
      internal_freezes: FIXTURE_026_RSD_T02_EPISODES.filter(
        ({ intervention_family: family }) => family === "opaque-state-freeze",
      ).length,
      output_clamps: FIXTURE_026_RSD_T02_EPISODES.filter(
        ({ intervention_family: family }) => family === "reported-output-clamp",
      ).length,
      channel_switches: FIXTURE_026_RSD_T02_EPISODES.filter(({ schedule }) => (
        schedule.kind === "two-pulse-channel-restimulation"
          && schedule.first_channel !== schedule.second_channel
      )).length,
      state_writes: FIXTURE_026_RSD_T02_EPISODES.filter(
        ({ intervention_family: family }) => family === "opaque-state-reset",
      ).length,
      simulation_internal_steps: receipts.length * internalSteps,
      rk4_derivative_evaluations: receipts.length * internalSteps * 4,
      policy_view_utf8_bytes: policyViewUtf8Bytes,
      transcript_generation_scalar_operations: null,
      wall_seconds: null,
      later_joules: null,
      charged: true,
    },
  });
}

export function buildFixture026RsdT02FixedInstanceTranscriptBundle(options) {
  return buildTranscriptBundle(options);
}

function defaultPolicyExecutor({ armId, policyView }) {
  let signedSum = 0;
  let absoluteSum = 0;
  let lastOutput = 0;
  let rows = 0;
  for (const projection of policyView.projections) {
    for (const sample of projection.samples) {
      signedSum += sample.reported_output;
      absoluteSum += Math.abs(sample.reported_output);
      lastOutput = sample.reported_output;
      rows += 1;
    }
  }
  const work = {
    sample_rows_read: rows,
    scalar_operations: rows * 3,
    retained_state_bytes: 32,
  };
  return {
    schema: 1,
    contract_version: FIXTURE_026_RSD_T02_FIXED_INSTANCE_POLICY_RESPONSE_VERSION,
    arm_id: armId,
    action: "abstain",
    decision: null,
    reason_codes: [SUCCESS_REASON],
    work_digest_sha256: digest({ arm_id: armId, signedSum, absoluteSum, lastOutput, work }),
    work,
    authority: "public-development-view-digest-conformance-only",
    comparison_inference_permitted: false,
    claim_eligible: false,
    result_label: "NO_RESULT",
    no_result: true,
  };
}

function validPolicyResponse(response, armId) {
  return exactKeys(response, RESPONSE_KEYS)
    && response.schema === 1
    && response.contract_version === FIXTURE_026_RSD_T02_FIXED_INSTANCE_POLICY_RESPONSE_VERSION
    && response.arm_id === armId
    && response.action === "abstain"
    && response.decision === null
    && Array.isArray(response.reason_codes)
    && response.reason_codes.length >= 1
    && response.reason_codes.every((reason) => typeof reason === "string" && reason.length >= 3)
    && HASH_PATTERN.test(response.work_digest_sha256)
    && exactKeys(response.work, RESPONSE_WORK_KEYS)
    && Object.values(response.work).every((value) => Number.isSafeInteger(value) && value >= 0)
    && response.authority === "public-development-view-digest-conformance-only"
    && response.comparison_inference_permitted === false
    && response.claim_eligible === false
    && response.result_label === "NO_RESULT"
    && response.no_result === true;
}

function failureRecord(category, stage, reasonCode, detail) {
  return deepFreeze({
    category,
    stage,
    reason_code: reasonCode,
    detail_sha256: digest(detail),
  });
}

function failureResponse(armId, reasonCode) {
  const work = { sample_rows_read: 0, scalar_operations: 0, retained_state_bytes: 0 };
  return deepFreeze({
    schema: 1,
    contract_version: FIXTURE_026_RSD_T02_FIXED_INSTANCE_POLICY_RESPONSE_VERSION,
    arm_id: armId,
    action: "abstain",
    decision: null,
    reason_codes: [reasonCode],
    work_digest_sha256: digest({ arm_id: armId, reason_code: reasonCode, work }),
    work,
    authority: "public-development-view-digest-conformance-only",
    comparison_inference_permitted: false,
    claim_eligible: false,
    result_label: "NO_RESULT",
    no_result: true,
  });
}

function resourceLedger({ config, bundle, response, status }) {
  const actual = {
    arm_invocations: 1,
    sample_rows_read: response.work.sample_rows_read,
    scalar_operations: response.work.scalar_operations,
    retained_state_bytes: response.work.retained_state_bytes,
    runtime_failures: status === "runtime-failure" ? 1 : 0,
    malformed_responses: status === "malformed-response" ? 1 : 0,
    fallback_invocations: 0,
    wall_seconds: null,
    later_joules: null,
  };
  const caps = config.resource_caps;
  const withinCaps = actual.arm_invocations <= 1
    && actual.sample_rows_read <= caps.sample_rows_per_arm
    && actual.scalar_operations <= caps.scalar_operations_per_arm
    && actual.retained_state_bytes <= caps.retained_state_bytes_per_arm
    && actual.runtime_failures <= caps.runtime_failures_per_arm
    && actual.malformed_responses <= caps.malformed_responses_per_arm
    && actual.fallback_invocations <= caps.fallback_invocations_per_arm;
  return deepFreeze({
    shared_acquisition: {
      fixed_packet_id: bundle.fixed_packet_id,
      policy_view_sha256: bundle.policy_view_sha256,
      episodes_available: bundle.acquisition_resource.episode_count,
      sample_rows_available: bundle.acquisition_resource.sample_rows,
      canonical_policy_view_bytes: bundle.policy_view_utf8_bytes,
      charged_once_at_run: true,
    },
    actual,
    caps,
    within_caps: withinCaps,
    charged: true,
  });
}

function invokeArm({ config, bundle, armId, armExecutor }) {
  let response;
  let status = "succeeded";
  let failure = null;
  try {
    response = armExecutor({ armId, policyView: bundle.policy_view });
  } catch (error) {
    status = "runtime-failure";
    failure = failureRecord(
      "runtime-failure",
      "policy-execution",
      "policy-executor-threw",
      { name: error?.name ?? "Error", message: String(error?.message ?? "runtime failure") },
    );
    response = failureResponse(armId, "policy-runtime-failure-visible-and-charged");
  }
  if (status === "succeeded" && !validPolicyResponse(response, armId)) {
    status = "malformed-response";
    failure = failureRecord(
      "malformed-response",
      "policy-response-validation",
      "policy-response-failed-closed-validation",
      { arm_id: armId, response_sha256: (() => {
        try { return digest(response); } catch { return null; }
      })() },
    );
    response = failureResponse(armId, "malformed-policy-response-visible-and-charged");
  }
  let resources = resourceLedger({ config, bundle, response, status });
  if (!resources.within_caps) {
    status = "resource-cap-exceeded";
    failure = failureRecord(
      "resource-cap-exceeded",
      "resource-validation",
      "policy-work-exceeded-frozen-cap",
      { arm_id: armId, actual: resources.actual, caps: resources.caps },
    );
  }
  return { status, response: deepFreeze(response), resource_ledger: resources, failure_record: failure };
}

function runId(config, bundle) {
  return digest({
    domain: FIXTURE_026_RSD_T02_FIXED_INSTANCE_RUNNER_VERSION,
    config_sha256: FIXTURE_026_RSD_T02_FIXED_INSTANCE_RUNNER_CONFIG_SHA256,
    input_artifact_sha256: bundle.input_artifact_sha256,
    instance_id: bundle.instance_id,
    fixed_packet_id: bundle.fixed_packet_id,
    transcript_set_sha256: bundle.transcript_set_sha256,
    policy_view_sha256: bundle.policy_view_sha256,
  });
}

function appendRecord({ config, bundle, run, armId, armExecutor }) {
  const invoked = invokeArm({ config, bundle, armId, armExecutor });
  const body = {
    schema: 1,
    contract_version: FIXTURE_026_RSD_T02_FIXED_INSTANCE_LEDGER_RECORD_VERSION,
    sequence: run.ledger.length,
    previous_record_sha256: run.ledger.at(-1)?.record_sha256 ?? ZERO_HASH,
    run_id: run.run_id,
    arm_id: armId,
    fixed_packet_id: bundle.fixed_packet_id,
    policy_view_sha256: bundle.policy_view_sha256,
    status: invoked.status,
    response: invoked.response,
    response_sha256: digest(invoked.response),
    resource_ledger: invoked.resource_ledger,
    failure_record: invoked.failure_record,
    authority: "append-only-public-development-policy-resource-ledger",
    comparison_inference_permitted: false,
    claim_eligible: false,
    result_label: "NO_RESULT",
    no_result: true,
  };
  return deepFreeze({ ...body, record_sha256: digest(body) });
}

function successfulRunArtifact(config, bundle, ledger) {
  const id = runId(config, bundle);
  const nextArmIndex = ledger.length;
  return deepFreeze({
    schema: 1,
    contract_version: FIXTURE_026_RSD_T02_FIXED_INSTANCE_RUNNER_VERSION,
    status: nextArmIndex === config.arm_ids.length ? "complete" : "partial",
    run_id: id,
    config_sha256: FIXTURE_026_RSD_T02_FIXED_INSTANCE_RUNNER_CONFIG_SHA256,
    input_artifact_sha256: bundle.input_artifact_sha256,
    instance_id: bundle.instance_id,
    fixed_packet_id: bundle.fixed_packet_id,
    episode_protocol_version: config.episode_protocol_version,
    episode_protocol_sha256: config.episode_protocol_sha256,
    transcript_set_sha256: bundle.transcript_set_sha256,
    transcript_receipts: bundle.transcript_receipts,
    policy_view_sha256: bundle.policy_view_sha256,
    policy_view_utf8_bytes: bundle.policy_view_utf8_bytes,
    policy_view: bundle.policy_view,
    acquisition_resource: bundle.acquisition_resource,
    ledger,
    next_arm_index: nextArmIndex,
    failure_record: null,
    authority: "public-development-transcript-resource-conformance-only",
    comparison_inference_permitted: false,
    claim_eligible: false,
    result_label: "NO_RESULT",
    no_result: true,
  });
}

function malformedRunArtifact(config, instance, error) {
  void error;
  let inputArtifactSha256 = null;
  try { inputArtifactSha256 = digest(instance); } catch { /* explicit null below */ }
  const failure = failureRecord(
    "malformed-input",
    "fixed-instance-validation",
    "generated-fixed-instance-failed-closed-validation",
    { input_artifact_sha256: inputArtifactSha256 },
  );
  const id = digest({
    domain: FIXTURE_026_RSD_T02_FIXED_INSTANCE_RUNNER_VERSION,
    config_sha256: FIXTURE_026_RSD_T02_FIXED_INSTANCE_RUNNER_CONFIG_SHA256,
    input_artifact_sha256: inputArtifactSha256,
    failure_record: failure,
  });
  return deepFreeze({
    schema: 1,
    contract_version: FIXTURE_026_RSD_T02_FIXED_INSTANCE_RUNNER_VERSION,
    status: "malformed-input",
    run_id: id,
    config_sha256: FIXTURE_026_RSD_T02_FIXED_INSTANCE_RUNNER_CONFIG_SHA256,
    input_artifact_sha256: inputArtifactSha256,
    instance_id: null,
    fixed_packet_id: null,
    episode_protocol_version: config.episode_protocol_version,
    episode_protocol_sha256: config.episode_protocol_sha256,
    transcript_set_sha256: null,
    transcript_receipts: [],
    policy_view_sha256: null,
    policy_view_utf8_bytes: null,
    policy_view: null,
    acquisition_resource: null,
    ledger: [],
    next_arm_index: 0,
    failure_record: failure,
    authority: "public-development-transcript-resource-conformance-only",
    comparison_inference_permitted: false,
    claim_eligible: false,
    result_label: "NO_RESULT",
    no_result: true,
  });
}

function assertFailureRecord(record, categories) {
  if (
    !exactKeys(record, FAILURE_KEYS)
    || !categories.includes(record.category)
    || typeof record.stage !== "string"
    || record.stage.length < 3
    || typeof record.reason_code !== "string"
    || record.reason_code.length < 3
    || !HASH_PATTERN.test(record.detail_sha256)
  ) refuse("failure record violates its closed contract");
  return record;
}

function assertReceipt(receipt, index) {
  if (
    !exactKeys(receipt, RECEIPT_KEYS)
    || receipt.episode_ordinal !== index
    || receipt.episode_id !== FIXTURE_026_RSD_T02_EPISODES[index]?.episode_id
    || !/^R-[0-9a-f]{64}$/u.test(receipt.realization_id)
    || !HASH_PATTERN.test(receipt.initialization_id)
    || !HASH_PATTERN.test(receipt.parameter_vector_sha256)
    || !HASH_PATTERN.test(receipt.nuisance_vector_sha256)
    || !exactKeys(receipt.time_constant, ["numerator", "denominator", "unit"])
    || !Number.isSafeInteger(receipt.time_constant.numerator)
    || !Number.isSafeInteger(receipt.time_constant.denominator)
    || receipt.time_constant.denominator < 1
    || receipt.time_constant.unit !== "s"
    || [
      receipt.schedule_sha256, receipt.transcript_sha256, receipt.policy_projection_sha256,
      receipt.reported_output_sha256, receipt.internal_output_sha256,
      receipt.final_state_sha256,
    ].some((value) => !HASH_PATTERN.test(value))
    || receipt.sample_rows !== FIXTURE_026_RSD_T02_MODEL_CONSTANTS.samples_per_episode
    || !Number.isSafeInteger(receipt.input_commands)
    || receipt.input_commands < 1
  ) refuse(`transcript receipt ${index} is malformed`);
}

function assertAcquisition(config, acquisition, policyViewUtf8Bytes) {
  const internalSteps = FIXTURE_026_RSD_T02_MODEL_CONSTANTS.episode_horizon_s
    / FIXTURE_026_RSD_T02_MODEL_CONSTANTS.internal_step_s;
  if (
    !exactKeys(acquisition, ACQUISITION_KEYS)
    || acquisition.episode_count !== config.transcript_contract.episode_count
    || acquisition.sample_rows !== config.transcript_contract.sample_rows_per_packet
    || acquisition.input_commands !== 188
    || acquisition.internal_resets !== 2
    || acquisition.internal_freezes !== 2
    || acquisition.output_clamps !== 1
    || acquisition.channel_switches !== 1
    || acquisition.state_writes !== 2
    || acquisition.simulation_internal_steps !== acquisition.episode_count * internalSteps
    || acquisition.rk4_derivative_evaluations !== acquisition.simulation_internal_steps * 4
    || acquisition.policy_view_utf8_bytes !== policyViewUtf8Bytes
    || acquisition.transcript_generation_scalar_operations !== null
    || acquisition.wall_seconds !== null
    || acquisition.later_joules !== null
    || acquisition.charged !== true
  ) refuse("acquisition resource record is malformed");
}

function assertResponse(response, armId) {
  if (!validPolicyResponse(response, armId)) refuse(`arm ${armId} response is malformed`);
}

function assertResourceLedger(config, bundle, resource, status) {
  if (
    !exactKeys(resource, RESOURCE_LEDGER_KEYS)
    || !exactKeys(resource.shared_acquisition, SHARED_RESOURCE_KEYS)
    || !exactKeys(resource.actual, ACTUAL_RESOURCE_KEYS)
    || !exactKeys(resource.caps, RESOURCE_CAP_KEYS)
    || canonicalize(resource.caps) !== canonicalize(config.resource_caps)
    || resource.shared_acquisition.fixed_packet_id !== bundle.fixed_packet_id
    || resource.shared_acquisition.policy_view_sha256 !== bundle.policy_view_sha256
    || resource.shared_acquisition.episodes_available !== bundle.acquisition_resource.episode_count
    || resource.shared_acquisition.sample_rows_available !== bundle.acquisition_resource.sample_rows
    || resource.shared_acquisition.canonical_policy_view_bytes !== bundle.policy_view_utf8_bytes
    || resource.shared_acquisition.charged_once_at_run !== true
    || resource.actual.arm_invocations !== 1
    || Object.entries(resource.actual).some(([key, value]) => (
      !["wall_seconds", "later_joules"].includes(key)
        && (!Number.isSafeInteger(value) || value < 0)
    ))
    || resource.actual.wall_seconds !== null
    || resource.actual.later_joules !== null
    || resource.actual.runtime_failures !== (status === "runtime-failure" ? 1 : 0)
    || resource.actual.malformed_responses !== (status === "malformed-response" ? 1 : 0)
    || resource.actual.fallback_invocations !== 0
    || typeof resource.within_caps !== "boolean"
    || resource.charged !== true
  ) refuse("arm resource ledger is malformed");
}

function assertLedger(config, bundle, run) {
  let previous = ZERO_HASH;
  for (const [sequence, record] of run.ledger.entries()) {
    const expectedArmId = config.arm_ids[sequence];
    if (
      !exactKeys(record, LEDGER_KEYS)
      || record.schema !== 1
      || record.contract_version !== FIXTURE_026_RSD_T02_FIXED_INSTANCE_LEDGER_RECORD_VERSION
      || record.sequence !== sequence
      || record.previous_record_sha256 !== previous
      || record.run_id !== run.run_id
      || record.arm_id !== expectedArmId
      || record.fixed_packet_id !== bundle.fixed_packet_id
      || record.policy_view_sha256 !== bundle.policy_view_sha256
      || !["succeeded", "runtime-failure", "malformed-response", "resource-cap-exceeded"]
        .includes(record.status)
      || record.response_sha256 !== digest(record.response)
      || record.authority !== "append-only-public-development-policy-resource-ledger"
      || record.comparison_inference_permitted !== false
      || record.claim_eligible !== false
      || record.result_label !== "NO_RESULT"
      || record.no_result !== true
    ) refuse(`ledger record ${sequence} violates its append-only contract`);
    assertResponse(record.response, expectedArmId);
    assertResourceLedger(config, bundle, record.resource_ledger, record.status);
    if (record.status === "succeeded") {
      const expectedResponse = defaultPolicyExecutor({
        armId: expectedArmId,
        policyView: bundle.policy_view,
      });
      if (
        record.failure_record !== null
        || record.resource_ledger.within_caps !== true
        || canonicalize(record.response) !== canonicalize(expectedResponse)
      ) {
        refuse(`successful ledger record ${sequence} carries a failure`);
      }
    } else {
      assertFailureRecord(record.failure_record, [record.status]);
      if (record.status === "runtime-failure" && (
        canonicalize(record.response)
          !== canonicalize(failureResponse(expectedArmId, "policy-runtime-failure-visible-and-charged"))
        || record.resource_ledger.within_caps !== true
      )) refuse(`runtime-failure ledger record ${sequence} is not the closed abstention`);
      if (record.status === "malformed-response" && (
        canonicalize(record.response)
          !== canonicalize(failureResponse(expectedArmId, "malformed-policy-response-visible-and-charged"))
        || record.resource_ledger.within_caps !== true
      )) refuse(`malformed-response ledger record ${sequence} is not the closed abstention`);
      if (
        record.status === "resource-cap-exceeded"
        && record.resource_ledger.within_caps !== false
      ) refuse(`resource-cap ledger record ${sequence} does not preserve over-cap work`);
    }
    const payload = { ...record };
    delete payload.record_sha256;
    if (record.record_sha256 !== digest(payload)) refuse(`ledger record ${sequence} hash is false`);
    previous = record.record_sha256;
  }
}

export function assertFixture026RsdT02FixedInstanceRunArtifact({
  config,
  registry,
  instance,
  artifact,
}) {
  assertFixture026RsdT02FixedInstanceRunnerConfig(config);
  if (
    !exactKeys(artifact, RUN_ARTIFACT_KEYS)
    || artifact.schema !== 1
    || artifact.contract_version !== FIXTURE_026_RSD_T02_FIXED_INSTANCE_RUNNER_VERSION
    || !["malformed-input", "partial", "complete"].includes(artifact.status)
    || !HASH_PATTERN.test(artifact.run_id)
    || artifact.config_sha256 !== FIXTURE_026_RSD_T02_FIXED_INSTANCE_RUNNER_CONFIG_SHA256
    || artifact.episode_protocol_version !== config.episode_protocol_version
    || artifact.episode_protocol_sha256 !== config.episode_protocol_sha256
    || !Array.isArray(artifact.transcript_receipts)
    || !Array.isArray(artifact.ledger)
    || artifact.authority !== "public-development-transcript-resource-conformance-only"
    || artifact.comparison_inference_permitted !== false
    || artifact.claim_eligible !== false
    || artifact.result_label !== "NO_RESULT"
    || artifact.no_result !== true
  ) refuse("run artifact violates its closed root contract");
  if (artifact.status === "malformed-input") {
    assertFailureRecord(artifact.failure_record, ["malformed-input"]);
    if (
      artifact.instance_id !== null
      || artifact.fixed_packet_id !== null
      || artifact.transcript_set_sha256 !== null
      || artifact.transcript_receipts.length !== 0
      || artifact.policy_view_sha256 !== null
      || artifact.policy_view_utf8_bytes !== null
      || artifact.policy_view !== null
      || artifact.acquisition_resource !== null
      || artifact.ledger.length !== 0
      || artifact.next_arm_index !== 0
    ) refuse("malformed-input artifact smuggles execution output");
    const expected = malformedRunArtifact(config, instance, new Error("validation"));
    if (
      artifact.input_artifact_sha256 !== expected.input_artifact_sha256
      || artifact.run_id !== expected.run_id
    ) refuse("malformed-input artifact identity is false");
    return artifact;
  }
  const bundle = buildTranscriptBundle({ config, registry, instance });
  if (
    artifact.run_id !== runId(config, bundle)
    || artifact.input_artifact_sha256 !== bundle.input_artifact_sha256
    || artifact.instance_id !== bundle.instance_id
    || artifact.fixed_packet_id !== bundle.fixed_packet_id
    || artifact.transcript_set_sha256 !== bundle.transcript_set_sha256
    || canonicalize(artifact.transcript_receipts) !== canonicalize(bundle.transcript_receipts)
    || artifact.policy_view_sha256 !== bundle.policy_view_sha256
    || artifact.policy_view_utf8_bytes !== bundle.policy_view_utf8_bytes
    || canonicalize(artifact.policy_view) !== canonicalize(bundle.policy_view)
    || artifact.failure_record !== null
    || artifact.next_arm_index !== artifact.ledger.length
    || artifact.next_arm_index > config.arm_ids.length
    || artifact.status !== (artifact.ledger.length === config.arm_ids.length ? "complete" : "partial")
  ) refuse("run artifact is not bound to its exact fixed instance and transcript");
  artifact.transcript_receipts.forEach(assertReceipt);
  assertPolicyView(config, artifact.policy_view);
  assertAcquisition(config, artifact.acquisition_resource, artifact.policy_view_utf8_bytes);
  assertLedger(config, bundle, artifact);
  return artifact;
}

function runFixedInstanceWithExecutor({
  config,
  registry,
  instance,
  prior_artifact: priorArtifact = null,
  max_new_arm_records: maxNewArmRecords = null,
  armExecutor,
}) {
  assertFixture026RsdT02FixedInstanceRunnerConfig(config);
  let bundle;
  try {
    bundle = buildTranscriptBundle({ config, registry, instance });
  } catch (error) {
    if (priorArtifact !== null) refuse("cannot resume from a malformed fixed instance");
    return malformedRunArtifact(config, instance, error);
  }
  let ledger = [];
  if (priorArtifact !== null) {
    assertFixture026RsdT02FixedInstanceRunArtifact({
      config, registry, instance, artifact: priorArtifact,
    });
    if (priorArtifact.status === "malformed-input") refuse("malformed-input run cannot resume");
    ledger = [...priorArtifact.ledger];
  }
  const remaining = config.arm_ids.length - ledger.length;
  if (remaining === 0) return priorArtifact;
  const appendCount = maxNewArmRecords === null ? remaining : maxNewArmRecords;
  if (!Number.isSafeInteger(appendCount) || appendCount < 1 || appendCount > remaining) {
    refuse("resume append count is outside the remaining registered arms");
  }
  let run = successfulRunArtifact(config, bundle, ledger);
  for (let offset = 0; offset < appendCount; offset += 1) {
    const armId = config.arm_ids[ledger.length];
    ledger = [...ledger, appendRecord({ config, bundle, run, armId, armExecutor })];
    run = successfulRunArtifact(config, bundle, ledger);
  }
  assertFixture026RsdT02FixedInstanceRunArtifact({ config, registry, instance, artifact: run });
  return run;
}

export function runFixture026RsdT02FixedInstance(options) {
  if (!options || Object.hasOwn(options, "arm_executor")) {
    refuse("custom success executors are outside this conformance runner");
  }
  return runFixedInstanceWithExecutor({ ...options, armExecutor: defaultPolicyExecutor });
}

export function runFixture026RsdT02FixedInstanceFailureConformanceForTest({
  failure_modes_by_arm: failureModesByArm,
  ...options
}) {
  if (
    !failureModesByArm
    || typeof failureModesByArm !== "object"
    || Array.isArray(failureModesByArm)
    || Object.keys(failureModesByArm).length < 1
    || Object.entries(failureModesByArm).some(([armId, mode]) => (
      !FIXTURE_026_RSD_T02_ACTIONABLE_ARM_IDS.includes(armId)
      || !["runtime-failure", "malformed-response"].includes(mode)
    ))
  ) refuse("test failure modes must name registered arms and closed failure categories");
  const armExecutor = ({ armId, policyView }) => {
    const mode = failureModesByArm[armId];
    if (mode === "runtime-failure") throw new Error("injected closed runtime failure");
    if (mode === "malformed-response") return {};
    return defaultPolicyExecutor({ armId, policyView });
  };
  return runFixedInstanceWithExecutor({ ...options, armExecutor });
}
