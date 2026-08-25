import { createHash } from "node:crypto";

export const FIXTURE_027_EVENT_CONTRACT_VERSION = "fixture-027.rin-t01-event.v3";
export const FIXTURE_027_ARMS = Object.freeze([
  "isolated-assumption",
  "load-aware-interface",
  "bounded-insulation-diagnostic",
]);
export const FIXTURE_027_DECISIONS = Object.freeze([
  "record-invalid",
  "isolated-assumption",
  "within-support",
  "back-action-detected",
  "insulation-not-required",
  "bounded-insulation",
  "support-exceeded",
]);
export const FIXTURE_027_WORLD_CLASSES = Object.freeze([
  "zero-load-control",
  "weak-load-supported",
  "strong-load-retroactive",
  "finite-insulation-effective",
  "insulation-saturated",
  "interface-schema-invalid",
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

export function fixture027ScientificPayload(record) {
  const payload = { ...record };
  delete payload.integrity;
  return payload;
}

export function fixture027WorkKey(record) {
  return `${record.run_id}:${record.profile}:${record.seed}:${record.world_index}:${record.arm}`;
}

export function assertFixture027Record(record, {
  sequence = null,
  previousHash = null,
  runId = null,
  profile = null,
  inputSha256 = null,
} = {}) {
  const keys = [
    "schema", "contract_version", "artifact", "track", "run_id", "profile", "pack",
    "seed", "world_index", "world_id", "arm", "attempt", "units", "input_sha256",
    "oracle_class", "corruption", "decision", "trace_valid", "ordering_valid",
    "checksum_valid", "unit_valid", "interface_valid", "parameters",
    "mass_closure_residual_u", "no_affinity_rmse_u",
    "back_action_rmse_u", "prediction_rmse_u", "insulation_rmse_u",
    "restoration_fraction", "driver_saturation_fraction", "insulation_action_u",
    "work_counter_scope", "accepted_model_steps", "accepted_interface_samples_read",
    "accepted_interface_bytes_read", "serialized_event_bytes_written",
    "declared_arm_scalar_operations", "loss", "status", "result_label", "no_result",
    "measured_energy_present", "energy_conclusion_allowed", "claim_eligible",
    "comparison_inference_permitted", "scientific_result", "performance_result",
    "interpretation", "integrity",
  ];
  if (!exactKeys(record, keys)) throw new Error("Fixture 027 event has missing or unknown fields.");
  if (!exactKeys(record.units, ["signal", "time", "rate", "bytes"])) {
    throw new Error("Fixture 027 event units are incomplete.");
  }
  if (!exactKeys(record.input_sha256, ["contract", "generator", "runner", "configuration", "schema", "seed_pack"])) {
    throw new Error("Fixture 027 event immutable-input hashes are incomplete.");
  }
  if (!exactKeys(record.parameters, [
    "production_rate_u_per_s", "decay_per_s", "binding_on_per_u_s", "binding_off_per_s",
    "load_total_u", "driver_gain_per_s", "driver_capacity_u_per_s",
  ])) throw new Error("Fixture 027 event parameters are incomplete.");
  if (!exactKeys(record.integrity, ["sequence", "previous_sha256", "record_sha256"])) {
    throw new Error("Fixture 027 event integrity is incomplete.");
  }

  const expectedPrevious = previousHash ?? record.integrity.previous_sha256;
  const expectedSequence = sequence ?? record.integrity.sequence;
  const expectedHash = sha256(`${expectedPrevious}\n${canonical(fixture027ScientificPayload(record))}`);
  const boundedFractions = [record.restoration_fraction, record.driver_saturation_fraction];
  if (
    record.schema !== 1
    || record.contract_version !== FIXTURE_027_EVENT_CONTRACT_VERSION
    || record.artifact !== "fixture-027"
    || record.track !== "RIN-T01"
    || !/^[0-9a-f]{64}$/.test(record.run_id)
    || (runId !== null && record.run_id !== runId)
    || !new Set(["smoke", "development"]).has(record.profile)
    || (profile !== null && record.profile !== profile)
    || record.pack !== "public-development"
    || !Number.isSafeInteger(record.seed)
    || record.seed < 0
    || !Number.isSafeInteger(record.world_index)
    || record.world_index < 0
    || record.world_id !== `${record.seed}:${record.world_index}`
    || !FIXTURE_027_ARMS.includes(record.arm)
    || record.attempt !== 0
    || record.units.signal !== "U"
    || record.units.time !== "s"
    || record.units.rate !== "U s^-1"
    || record.units.bytes !== "B"
    || Object.values(record.input_sha256).some((value) => !/^[0-9a-f]{64}$/.test(value))
    || (inputSha256 !== null && canonical(record.input_sha256) !== canonical(inputSha256))
    || !FIXTURE_027_WORLD_CLASSES.includes(record.oracle_class)
    || typeof record.corruption !== "string"
    || record.corruption.length === 0
    || !FIXTURE_027_DECISIONS.includes(record.decision)
    || [record.trace_valid, record.ordering_valid, record.checksum_valid,
      record.unit_valid, record.interface_valid].some((value) => typeof value !== "boolean")
    || Object.values(record.parameters).some((value) => !finite(value) || value < 0)
    || [record.mass_closure_residual_u, record.no_affinity_rmse_u,
      record.back_action_rmse_u, record.prediction_rmse_u, record.insulation_rmse_u,
      record.insulation_action_u, record.loss].some((value) => !finite(value) || value < 0)
    || boundedFractions.some((value) => !finite(value) || value < 0 || value > 1)
    || record.loss > 100
    || record.work_counter_scope !== "accepted-interface-and-declared-arm-model-only; generator-and-validator-work-excluded"
    || !Number.isSafeInteger(record.accepted_model_steps)
    || record.accepted_model_steps < 0
    || !Number.isSafeInteger(record.accepted_interface_samples_read)
    || record.accepted_interface_samples_read < 0
    || !Number.isSafeInteger(record.accepted_interface_bytes_read)
    || record.accepted_interface_bytes_read < 0
    || !Number.isSafeInteger(record.serialized_event_bytes_written)
    || record.serialized_event_bytes_written < 1
    || !Number.isSafeInteger(record.declared_arm_scalar_operations)
    || record.declared_arm_scalar_operations < 0
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
  ) throw new Error("Fixture 027 event violates its runtime contract.");

  if (sequence === 0 && record.integrity.previous_sha256 !== ZERO_HASH) {
    throw new Error("Fixture 027 first event must start at the zero hash.");
  }
  if (record.decision === "record-invalid" && (
    record.accepted_model_steps !== 0
    || record.accepted_interface_samples_read !== 0
    || record.accepted_interface_bytes_read !== 0
    || record.declared_arm_scalar_operations !== 0
    || record.mass_closure_residual_u !== 0
    || record.no_affinity_rmse_u !== 0
    || record.insulation_action_u !== 0
  )) throw new Error("Fixture 027 invalid interface must stop before simulation or insulation.");
  if (record.arm !== "bounded-insulation-diagnostic" && (
    record.insulation_action_u !== 0
    || record.insulation_rmse_u !== 0
    || record.restoration_fraction !== 0
    || record.driver_saturation_fraction !== 0
  )) throw new Error("Only the bounded-insulation diagnostic may report insulation state or cost.");
  if (record.arm === "bounded-insulation-diagnostic" && record.decision === "bounded-insulation" && record.insulation_action_u <= 0) {
    throw new Error("Fixture 027 bounded insulation must charge its synthetic action.");
  }
  return record;
}
