import { createHash } from "node:crypto";

export const FIXTURE_024_EVENT_CONTRACT_VERSION = "fixture-024.amr-t01-event.v1";
export const FIXTURE_024_ARMS = Object.freeze([
  "markov-only",
  "finite-memory",
  "exact-augmented-state",
]);

const ZERO_HASH = "0".repeat(64);

export function canonical(value) {
  if (value === null || typeof value === "boolean" || typeof value === "string") {
    return JSON.stringify(value);
  }
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

export function fixture024ScientificPayload(record) {
  const payload = { ...record };
  delete payload.integrity;
  return payload;
}

export function fixture024WorkKey(record) {
  return `${record.seed}:${record.system_index}:${record.arm}`;
}

export function assertFixture024Record(record, { sequence = null, previousHash = null } = {}) {
  const keys = [
    "schema",
    "contract_version",
    "artifact",
    "track",
    "run_id",
    "profile",
    "pack",
    "seed",
    "system_index",
    "world_id",
    "arm",
    "attempt",
    "units",
    "input_sha256",
    "parameters",
    "prefix_end_s",
    "horizon_s",
    "memory_window_s",
    "final_x_u",
    "rmse_u",
    "max_abs_error_u",
    "loss",
    "steps",
    "history_terms",
    "multiply_add_equivalents",
    "bytes_read",
    "bytes_written",
    "status",
    "measured_energy_present",
    "energy_conclusion_allowed",
    "claim_eligible",
    "scientific_result",
    "performance_result",
    "integrity",
  ];
  if (!exactKeys(record, keys)) throw new Error("Fixture 024 event has missing or unknown fields.");
  if (!exactKeys(record.units, ["state", "time", "rate", "kernel"])) {
    throw new Error("Fixture 024 event units are incomplete.");
  }
  if (!exactKeys(record.input_sha256, ["audit", "fixture", "math_contract", "runner", "configuration", "schema"])) {
    throw new Error("Fixture 024 event immutable-input hashes are incomplete.");
  }
  if (!exactKeys(record.parameters, ["alpha_per_s", "beta_per_s", "gamma_per_s", "lambda_per_s", "determinant_per_s2"])) {
    throw new Error("Fixture 024 event parameters are incomplete.");
  }
  if (!exactKeys(record.integrity, ["sequence", "previous_sha256", "record_sha256"])) {
    throw new Error("Fixture 024 event integrity is incomplete.");
  }
  const expectedPrevious = previousHash ?? record.integrity.previous_sha256;
  const expectedSequence = sequence ?? record.integrity.sequence;
  const expectedHash = sha256(`${expectedPrevious}\n${canonical(fixture024ScientificPayload(record))}`);
  if (
    record.schema !== 1
    || record.contract_version !== FIXTURE_024_EVENT_CONTRACT_VERSION
    || record.artifact !== "fixture-024"
    || record.track !== "AMR-T01"
    || !/^[0-9a-f]{64}$/.test(record.run_id)
    || !new Set(["smoke", "development"]).has(record.profile)
    || record.pack !== "public-development"
    || !Number.isSafeInteger(record.seed)
    || record.seed < 0
    || !Number.isSafeInteger(record.system_index)
    || record.system_index < 0
    || record.world_id !== `${record.seed}:${record.system_index}`
    || !FIXTURE_024_ARMS.includes(record.arm)
    || record.attempt !== 0
    || record.units.state !== "U"
    || record.units.time !== "s"
    || record.units.rate !== "s^-1"
    || record.units.kernel !== "s^-2"
    || Object.values(record.input_sha256).some((value) => !/^[0-9a-f]{64}$/.test(value))
    || Object.values(record.parameters).some((value) => !finite(value))
    || record.parameters.alpha_per_s <= 0
    || record.parameters.lambda_per_s <= 0
    || record.parameters.determinant_per_s2 < 0.15
    || !finite(record.prefix_end_s)
    || record.prefix_end_s <= 0
    || !finite(record.horizon_s)
    || record.horizon_s <= record.prefix_end_s
    || !finite(record.memory_window_s)
    || record.memory_window_s < 0
    || !finite(record.final_x_u)
    || !finite(record.rmse_u)
    || record.rmse_u < 0
    || !finite(record.max_abs_error_u)
    || record.max_abs_error_u < 0
    || !finite(record.loss)
    || record.loss < 0
    || record.loss > 100
    || !Number.isSafeInteger(record.steps)
    || record.steps < 1
    || !Number.isSafeInteger(record.history_terms)
    || record.history_terms < 0
    || !Number.isSafeInteger(record.multiply_add_equivalents)
    || record.multiply_add_equivalents < 0
    || !Number.isSafeInteger(record.bytes_read)
    || record.bytes_read < 0
    || !Number.isSafeInteger(record.bytes_written)
    || record.bytes_written < 0
    || record.status !== "development-smoke-only"
    || record.measured_energy_present !== false
    || record.energy_conclusion_allowed !== false
    || record.claim_eligible !== false
    || record.scientific_result !== false
    || record.performance_result !== false
    || !Number.isSafeInteger(record.integrity.sequence)
    || record.integrity.sequence < 0
    || !/^[0-9a-f]{64}$/.test(record.integrity.previous_sha256)
    || !/^[0-9a-f]{64}$/.test(record.integrity.record_sha256)
    || record.integrity.sequence !== expectedSequence
    || record.integrity.previous_sha256 !== expectedPrevious
    || record.integrity.record_sha256 !== expectedHash
  ) throw new Error("Fixture 024 event violates its runtime contract.");
  if (sequence === 0 && record.integrity.previous_sha256 !== ZERO_HASH) {
    throw new Error("Fixture 024 first event must start at the zero hash.");
  }
  if (record.arm !== "finite-memory" && record.history_terms !== 0) {
    throw new Error("Only the finite-memory arm may charge history terms.");
  }
  return record;
}
