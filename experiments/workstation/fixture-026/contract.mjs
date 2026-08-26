import { createHash } from "node:crypto";

export const FIXTURE_026_EVENT_CONTRACT_VERSION = "fixture-026.rsd-t01-event.v2";
export const FIXTURE_026_EVENT_INTERPRETATION = "NO_RESULT: deterministic public-development RSD-T01 generator-family diagnostic and integrity plumbing only.";
export const FIXTURE_026_ARMS = Object.freeze([
  "full-trajectory-diagnostic",
  "peak-endpoint-lookalike",
]);
export const FIXTURE_026_GENERATOR_FAMILIES = Object.freeze([
  "exact-scale-symmetry",
  "approximate-scale-symmetry",
  "endpoint-return-lookalike",
  "equal-peak-delayed-trajectory",
  "static-ratio",
  "malformed-sentinel",
]);
export const FIXTURE_026_GENERATOR_FAMILY_PREDICTIONS = Object.freeze([
  ...FIXTURE_026_GENERATOR_FAMILIES,
]);
export const FIXTURE_026_SEMANTIC_PROPERTY_KEYS = Object.freeze([
  "paired_trajectory_match",
  "finite_horizon_endpoint_return",
  "peak_amplitude_equal",
  "causal_memory_status",
  "support_membership",
]);
export const FIXTURE_026_PARAMETER_KEYS = Object.freeze([
  "background_base_u",
  "scale_factor",
  "input_floor_u",
  "causal_reference_tau_s",
  "approximate_additive_amplitude_y",
  "endpoint_gain_increment",
  "endpoint_base_lag_s",
  "endpoint_scaled_lag_s",
  "equal_peak_common_gain",
  "equal_peak_memory_lag_s",
  "equal_peak_delay_s",
]);

const ZERO_HASH = "0".repeat(64);

export function canonical(value) {
  if (value === null || typeof value === "boolean" || typeof value === "string") return JSON.stringify(value);
  if (typeof value === "number" && Number.isFinite(value)) return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(canonical).join(",")}]`;
  if (value && typeof value === "object") {
    return `{${Object.keys(value).sort().map((key) => {
      if (value[key] === undefined) throw new TypeError(`Undefined canonical field ${key}.`);
      return `${JSON.stringify(key)}:${canonical(value[key])}`;
    }).join(",")}}`;
  }
  throw new TypeError(`Unsupported canonical value ${typeof value}.`);
}

export function sha256(value) {
  return createHash("sha256").update(value).digest("hex");
}

function exactKeys(value, keys) {
  return value
    && typeof value === "object"
    && !Array.isArray(value)
    && canonical(Object.keys(value).sort()) === canonical([...keys].sort());
}

function finite(value) {
  return typeof value === "number" && Number.isFinite(value);
}

function positive(value) {
  return finite(value) && value > 0;
}

function familyParametersValid(generatorFamily, parameters) {
  const nullFields = (fields) => fields.every((field) => parameters[field] === null);
  const tauOnly = [
    "approximate_additive_amplitude_y",
    "endpoint_gain_increment",
    "endpoint_base_lag_s",
    "endpoint_scaled_lag_s",
    "equal_peak_common_gain",
    "equal_peak_memory_lag_s",
    "equal_peak_delay_s",
  ];
  if (new Set(["exact-scale-symmetry", "malformed-sentinel"]).has(generatorFamily)) {
    return positive(parameters.causal_reference_tau_s) && nullFields(tauOnly);
  }
  if (generatorFamily === "approximate-scale-symmetry") {
    return positive(parameters.causal_reference_tau_s)
      && positive(parameters.approximate_additive_amplitude_y)
      && nullFields(tauOnly.slice(1));
  }
  if (generatorFamily === "endpoint-return-lookalike") {
    return parameters.causal_reference_tau_s === null
      && parameters.approximate_additive_amplitude_y === null
      && positive(parameters.endpoint_gain_increment)
      && parameters.endpoint_base_lag_s === 0.4
      && parameters.endpoint_scaled_lag_s === 0.8
      && nullFields([
        "equal_peak_common_gain", "equal_peak_memory_lag_s", "equal_peak_delay_s",
      ]);
  }
  if (generatorFamily === "equal-peak-delayed-trajectory") {
    return nullFields([
      "causal_reference_tau_s", "approximate_additive_amplitude_y",
      "endpoint_gain_increment", "endpoint_base_lag_s", "endpoint_scaled_lag_s",
    ])
      && positive(parameters.equal_peak_common_gain)
      && parameters.equal_peak_memory_lag_s === 0.6
      && parameters.equal_peak_delay_s === 0.3;
  }
  if (generatorFamily === "static-ratio") {
    return nullFields(FIXTURE_026_PARAMETER_KEYS.slice(3));
  }
  return false;
}

export function fixture026ScientificPayload(record) {
  const payload = { ...record };
  delete payload.integrity;
  return payload;
}

export function fixture026WorkKey(record) {
  return `${record.run_id}:${record.profile}:${record.seed}:${record.world_index}:${record.arm}`;
}

function canonicalUint64Seed(value) {
  return typeof value === "string"
    && /^(0|[1-9][0-9]{0,19})$/u.test(value)
    && BigInt(value) <= 0xffff_ffff_ffff_ffffn;
}

export function assertFixture026Record(record, {
  sequence = null,
  previousHash = null,
  runId = null,
  profile = null,
  inputSha256 = null,
} = {}) {
  const keys = [
    "schema", "contract_version", "artifact", "track", "run_id", "profile", "pack",
    "seed", "world_index", "world_id", "initialization_id", "scale_group", "interface",
    "arm", "attempt", "units", "input_sha256",
    "generator_family", "history_family", "corruption", "gate_decision", "trace_valid",
    "ordering_valid", "checksum_valid", "unit_valid", "interface_valid",
    "causal_reference_valid", "parameters", "predicted_generator_family",
    "generator_family_correct", "semantic_properties_evaluated", "semantic_properties",
    "trajectory_discrepancy", "estimated_trajectory_discrepancy",
    "trajectory_discrepancy_estimation_error", "peak_discrepancy", "endpoint_discrepancy",
    "tail_discrepancy", "latency_discrepancy_s", "static_fit_rmse", "policy_input_sha256",
    "policy_response_sha256", "policy_oracle_access", "evaluator_opened_after_response",
    "work_counter_scope", "accepted_trajectory_samples_read", "accepted_summary_values_read",
    "serialized_policy_view_utf8_bytes", "serialized_event_bytes_written",
    "modeled_diagnostic_scalar_operations", "retained_persistent_state_bytes",
    "temporary_memory_measured", "peak_memory_measured", "loss", "status",
    "result_label", "no_result", "measured_energy_present", "energy_conclusion_allowed",
    "claim_eligible", "comparison_inference_permitted", "scientific_result",
    "performance_result", "interpretation", "integrity",
  ];
  if (!exactKeys(record, keys)) throw new Error("Fixture 026 event has missing or unknown fields.");
  if (!exactKeys(record.units, ["input", "output", "time", "bytes"])) {
    throw new Error("Fixture 026 event units are incomplete.");
  }
  if (!exactKeys(record.input_sha256, [
    "audit", "fixture", "math", "contract", "generator", "runner", "analysis",
    "configuration", "schema", "seed_pack", "runtime",
  ])) {
    throw new Error("Fixture 026 immutable-input hashes are incomplete.");
  }
  if (!exactKeys(record.parameters, FIXTURE_026_PARAMETER_KEYS)) {
    throw new Error("Fixture 026 event parameters are incomplete.");
  }
  if (
    record.semantic_properties !== null
    && !exactKeys(record.semantic_properties, FIXTURE_026_SEMANTIC_PROPERTY_KEYS)
  ) throw new Error("Fixture 026 evaluator trace-fact vector is incomplete.");
  if (!exactKeys(record.integrity, ["sequence", "previous_sha256", "record_sha256"])) {
    throw new Error("Fixture 026 event integrity is incomplete.");
  }

  const expectedPrevious = previousHash ?? record.integrity.previous_sha256;
  const expectedSequence = sequence ?? record.integrity.sequence;
  const expectedHash = sha256(`${expectedPrevious}\n${canonical(fixture026ScientificPayload(record))}`);
  if (
    record.schema !== 2
    || record.contract_version !== FIXTURE_026_EVENT_CONTRACT_VERSION
    || record.artifact !== "fixture-026"
    || record.track !== "RSD-T01"
    || !/^[0-9a-f]{64}$/.test(record.run_id)
    || (runId !== null && record.run_id !== runId)
    || !new Set(["smoke", "development"]).has(record.profile)
    || (profile !== null && record.profile !== profile)
    || record.pack !== "public-development"
    || !canonicalUint64Seed(record.seed)
    || !Number.isSafeInteger(record.world_index)
    || record.world_index < 0
    || record.world_index > 23
    || !/^[0-9a-f]{64}$/.test(record.world_id)
    || !/^[0-9a-f]{64}$/.test(record.initialization_id)
    || !/^positive-multiplicative:[0-9]+(?:\.[0-9]+)?$/u.test(record.scale_group)
    || record.interface !== "paired-normalized-output"
    || !FIXTURE_026_ARMS.includes(record.arm)
    || record.attempt !== 0
    || record.units.input !== "U"
    || record.units.output !== "1"
    || record.units.time !== "s"
    || record.units.bytes !== "B"
    || Object.values(record.input_sha256).some((value) => !/^[0-9a-f]{64}$/.test(value))
    || (inputSha256 !== null && canonical(record.input_sha256) !== canonical(inputSha256))
    || !FIXTURE_026_GENERATOR_FAMILIES.includes(record.generator_family)
    || !new Set(["step", "pulse", "ramp", "band-limited-stochastic"]).has(record.history_family)
    || typeof record.corruption !== "string"
    || record.corruption.length === 0
    || !new Set(["accepted", "record-invalid"]).has(record.gate_decision)
    || [record.trace_valid, record.ordering_valid, record.checksum_valid, record.unit_valid,
      record.interface_valid, record.causal_reference_valid].some((value) => typeof value !== "boolean")
    || !positive(record.parameters.background_base_u)
    || !positive(record.parameters.scale_factor)
    || !positive(record.parameters.input_floor_u)
    || record.parameters.input_floor_u !== 0.05
    || record.parameters.background_base_u < record.parameters.input_floor_u
    || !familyParametersValid(record.generator_family, record.parameters)
    || !FIXTURE_026_GENERATOR_FAMILY_PREDICTIONS.includes(record.predicted_generator_family)
    || typeof record.generator_family_correct !== "boolean"
    || typeof record.semantic_properties_evaluated !== "boolean"
    || (record.semantic_properties !== null && (
      !new Set(["exact", "approximate", "absent"])
        .has(record.semantic_properties.paired_trajectory_match)
      || typeof record.semantic_properties.finite_horizon_endpoint_return !== "boolean"
      || typeof record.semantic_properties.peak_amplitude_equal !== "boolean"
      || record.semantic_properties.causal_memory_status !== "unassessed"
      || record.semantic_properties.support_membership !== "inside"
    ))
    || [record.trajectory_discrepancy, record.estimated_trajectory_discrepancy,
      record.trajectory_discrepancy_estimation_error, record.peak_discrepancy, record.endpoint_discrepancy,
      record.tail_discrepancy, record.latency_discrepancy_s, record.static_fit_rmse, record.loss]
      .some((value) => !finite(value) || value < 0)
    || record.loss > 100
    || !/^[0-9a-f]{64}$/.test(record.policy_input_sha256)
    || !/^[0-9a-f]{64}$/.test(record.policy_response_sha256)
    || record.policy_oracle_access !== false
    || record.evaluator_opened_after_response !== true
    || record.work_counter_scope !== "exact-serialized-policy-view-bytes-and-frozen-modeled-classifier-counter-only; generator-validator-evaluator-hash-runtime-temporary-memory-excluded"
    || !Number.isSafeInteger(record.accepted_trajectory_samples_read)
    || record.accepted_trajectory_samples_read < 0
    || !Number.isSafeInteger(record.accepted_summary_values_read)
    || record.accepted_summary_values_read < 0
    || !Number.isSafeInteger(record.serialized_policy_view_utf8_bytes)
    || record.serialized_policy_view_utf8_bytes < 0
    || !Number.isSafeInteger(record.serialized_event_bytes_written)
    || record.serialized_event_bytes_written < 1
    || !Number.isSafeInteger(record.modeled_diagnostic_scalar_operations)
    || record.modeled_diagnostic_scalar_operations < 0
    || !Number.isSafeInteger(record.retained_persistent_state_bytes)
    || record.retained_persistent_state_bytes !== 0
    || record.temporary_memory_measured !== false
    || record.peak_memory_measured !== false
    || record.status !== "development-smoke-only"
    || record.result_label !== "NO_RESULT"
    || record.no_result !== true
    || record.measured_energy_present !== false
    || record.energy_conclusion_allowed !== false
    || record.claim_eligible !== false
    || record.comparison_inference_permitted !== false
    || record.scientific_result !== false
    || record.performance_result !== false
    || record.interpretation !== FIXTURE_026_EVENT_INTERPRETATION
    || !Number.isSafeInteger(record.integrity.sequence)
    || record.integrity.sequence < 0
    || !/^[0-9a-f]{64}$/.test(record.integrity.previous_sha256)
    || !/^[0-9a-f]{64}$/.test(record.integrity.record_sha256)
    || record.integrity.sequence !== expectedSequence
    || record.integrity.previous_sha256 !== expectedPrevious
    || record.integrity.record_sha256 !== expectedHash
  ) throw new Error("Fixture 026 event violates its runtime contract.");

  if (sequence === 0 && record.integrity.previous_sha256 !== ZERO_HASH) {
    throw new Error("Fixture 026 first event must start at the zero hash.");
  }
  if (record.generator_family_correct !== (
    record.predicted_generator_family === record.generator_family
  )) {
    throw new Error("Fixture 026 evaluator score disagrees with the frozen response.");
  }
  if (record.trajectory_discrepancy_estimation_error !== Math.abs(
    record.estimated_trajectory_discrepancy - record.trajectory_discrepancy
  )) throw new Error("Fixture 026 trajectory estimate and evaluator discrepancy disagree.");
  if (!record.trace_valid) {
    if (
      record.generator_family !== "malformed-sentinel"
      || record.gate_decision !== "record-invalid"
      || record.predicted_generator_family !== "malformed-sentinel"
      || record.semantic_properties_evaluated !== false
      || record.semantic_properties !== null
      || record.accepted_trajectory_samples_read !== 0
      || record.accepted_summary_values_read !== 0
      || record.serialized_policy_view_utf8_bytes !== 0
      || record.modeled_diagnostic_scalar_operations !== 0
      || record.retained_persistent_state_bytes !== 0
      || record.trajectory_discrepancy !== 0
      || record.estimated_trajectory_discrepancy !== 0
      || record.trajectory_discrepancy_estimation_error !== 0
      || record.peak_discrepancy !== 0
      || record.endpoint_discrepancy !== 0
      || record.tail_discrepancy !== 0
      || record.latency_discrepancy_s !== 0
      || record.static_fit_rmse !== 0
      || record.loss !== 0
    ) throw new Error("Fixture 026 invalid observation must have zero accepted classifier, diagnostic-score, state, and serialized-policy-view charges.");
  } else {
    if (
      record.generator_family === "malformed-sentinel"
      || record.gate_decision !== "accepted"
      || record.semantic_properties_evaluated !== true
      || record.semantic_properties === null
    ) {
      throw new Error("Fixture 026 valid observation has an invalid generator family or gate.");
    }
    if (record.arm === "full-trajectory-diagnostic" && (
      record.accepted_trajectory_samples_read < 2
      || record.accepted_summary_values_read !== 0
      || record.modeled_diagnostic_scalar_operations !== (
        record.accepted_trajectory_samples_read * 18 + 4 * 26 + 18
      )
    )) throw new Error("Fixture 026 full-trajectory arm accounting is invalid.");
    if (record.arm === "peak-endpoint-lookalike" && (
      record.accepted_trajectory_samples_read !== 0
      || record.accepted_summary_values_read !== 2
      || record.modeled_diagnostic_scalar_operations !== 3
    )) throw new Error("Fixture 026 peak/endpoint arm accounting is invalid.");
  }
  return record;
}
