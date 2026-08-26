import { createHash } from "node:crypto";

export const FIXTURE_026_EVENT_CONTRACT_VERSION = "fixture-026.rsd-t01-event.v1";
export const FIXTURE_026_ARMS = Object.freeze([
  "full-trajectory-diagnostic",
  "peak-endpoint-lookalike",
]);
export const FIXTURE_026_WORLD_CLASSES = Object.freeze([
  "exact-scale-symmetry",
  "approximate-scale-symmetry",
  "exact-adaptation-only",
  "equal-peak-different-shape",
  "static-ratio",
  "invalid-record",
]);
export const FIXTURE_026_PREDICTIONS = Object.freeze([...FIXTURE_026_WORLD_CLASSES]);

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

export function fixture026ScientificPayload(record) {
  const payload = { ...record };
  delete payload.integrity;
  return payload;
}

export function fixture026WorkKey(record) {
  return `${record.run_id}:${record.profile}:${record.seed}:${record.world_index}:${record.arm}`;
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
    "oracle_class", "history_family", "corruption", "gate_decision", "trace_valid",
    "ordering_valid", "checksum_valid", "unit_valid", "interface_valid",
    "causal_reference_valid", "parameters", "prediction", "class_correct",
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
  if (!exactKeys(record.parameters, [
    "background_base_u", "scale_factor", "reference_time_constant_s", "perturbation_amplitude_y",
    "input_floor_u",
  ])) throw new Error("Fixture 026 event parameters are incomplete.");
  if (!exactKeys(record.integrity, ["sequence", "previous_sha256", "record_sha256"])) {
    throw new Error("Fixture 026 event integrity is incomplete.");
  }

  const expectedPrevious = previousHash ?? record.integrity.previous_sha256;
  const expectedSequence = sequence ?? record.integrity.sequence;
  const expectedHash = sha256(`${expectedPrevious}\n${canonical(fixture026ScientificPayload(record))}`);
  if (
    record.schema !== 1
    || record.contract_version !== FIXTURE_026_EVENT_CONTRACT_VERSION
    || record.artifact !== "fixture-026"
    || record.track !== "RSD-T01"
    || !/^[0-9a-f]{64}$/.test(record.run_id)
    || (runId !== null && record.run_id !== runId)
    || !new Set(["smoke", "development"]).has(record.profile)
    || (profile !== null && record.profile !== profile)
    || record.pack !== "public-development"
    || !Number.isSafeInteger(record.seed)
    || record.seed < 0
    || !Number.isSafeInteger(record.world_index)
    || record.world_index < 0
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
    || !FIXTURE_026_WORLD_CLASSES.includes(record.oracle_class)
    || !new Set(["step", "pulse", "ramp", "band-limited-multisine"]).has(record.history_family)
    || typeof record.corruption !== "string"
    || record.corruption.length === 0
    || !new Set(["accepted", "record-invalid"]).has(record.gate_decision)
    || [record.trace_valid, record.ordering_valid, record.checksum_valid, record.unit_valid,
      record.interface_valid, record.causal_reference_valid].some((value) => typeof value !== "boolean")
    || Object.values(record.parameters).some((value) => !finite(value) || value <= 0)
    || record.parameters.input_floor_u !== 0.05
    || record.parameters.background_base_u < record.parameters.input_floor_u
    || !FIXTURE_026_PREDICTIONS.includes(record.prediction)
    || typeof record.class_correct !== "boolean"
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
    || typeof record.interpretation !== "string"
    || !record.interpretation.startsWith("NO_RESULT:")
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
  if (record.class_correct !== (record.prediction === record.oracle_class)) {
    throw new Error("Fixture 026 evaluator score disagrees with the frozen response.");
  }
  if (record.trajectory_discrepancy_estimation_error !== Math.abs(
    record.estimated_trajectory_discrepancy - record.trajectory_discrepancy
  )) throw new Error("Fixture 026 trajectory estimate and evaluator discrepancy disagree.");
  if (!record.trace_valid) {
    if (
      record.oracle_class !== "invalid-record"
      || record.gate_decision !== "record-invalid"
      || record.prediction !== "invalid-record"
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
    if (record.oracle_class === "invalid-record" || record.gate_decision !== "accepted") {
      throw new Error("Fixture 026 valid observation has an invalid evaluator class or gate.");
    }
    if (record.arm === "full-trajectory-diagnostic" && (
      record.accepted_trajectory_samples_read < 2
      || record.accepted_summary_values_read !== 0
      || record.modeled_diagnostic_scalar_operations !== (
        record.accepted_trajectory_samples_read * 14 + 4 * 26 + 18
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
