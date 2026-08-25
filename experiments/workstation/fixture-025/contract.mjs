import { createHash } from "node:crypto";

export const FIXTURE_025_EVENT_CONTRACT_VERSION = "fixture-025.ecm-t03-event.v1";
export const FIXTURE_025_ARMS = Object.freeze([
  "ungated-fit",
  "residual-screen",
  "ordered-validity-gate",
]);
export const FIXTURE_025_DECISIONS = Object.freeze([
  "record-invalid",
  "physics-invalid",
  "nonlinear-out-of-scope",
  "valid-nonidentifying",
  "valid-candidate-set",
]);
export const FIXTURE_025_WORLD_CLASSES = Object.freeze([
  "valid-identifying",
  "valid-equivalent",
  "schema-provenance-invalid",
  "kk-inconsistent",
  "nonlinear-out-of-scope",
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

export function fixture025ScientificPayload(record) {
  const payload = { ...record };
  delete payload.integrity;
  return payload;
}

export function fixture025WorkKey(record) {
  return `${record.seed}:${record.world_index}:${record.arm}`;
}

export function assertFixture025Record(record, { sequence = null, previousHash = null } = {}) {
  const keys = [
    "schema", "contract_version", "artifact", "track", "run_id", "profile", "pack",
    "seed", "world_index", "world_id", "arm", "attempt", "units", "input_sha256",
    "oracle_class", "corruption", "decision", "schema_valid", "ordering_valid",
    "checksum_valid", "unit_valid", "calibration_valid", "amplitude_linear",
    "kk_consistent", "identifying", "candidate_set_size", "diagnostic_bundles",
    "mechanism_fits", "samples_read", "bytes_read", "bytes_written",
    "multiply_add_equivalents", "invalid_error", "false_reject_error",
    "overclaim_error", "candidate_error", "fit_error", "loss", "status",
    "measured_energy_present", "energy_conclusion_allowed", "claim_eligible",
    "scientific_result", "performance_result", "integrity",
  ];
  if (!exactKeys(record, keys)) throw new Error("Fixture 025 event has missing or unknown fields.");
  if (!exactKeys(record.units, ["impedance", "frequency", "time", "amplitude", "bytes"])) {
    throw new Error("Fixture 025 event units are incomplete.");
  }
  if (!exactKeys(record.input_sha256, ["audit", "fixture", "runner", "generator", "configuration", "schema"])) {
    throw new Error("Fixture 025 event immutable-input hashes are incomplete.");
  }
  if (!exactKeys(record.integrity, ["sequence", "previous_sha256", "record_sha256"])) {
    throw new Error("Fixture 025 event integrity is incomplete.");
  }
  const expectedPrevious = previousHash ?? record.integrity.previous_sha256;
  const expectedSequence = sequence ?? record.integrity.sequence;
  const expectedHash = sha256(`${expectedPrevious}\n${canonical(fixture025ScientificPayload(record))}`);
  if (
    record.schema !== 1
    || record.contract_version !== FIXTURE_025_EVENT_CONTRACT_VERSION
    || record.artifact !== "fixture-025"
    || record.track !== "ECM-T03"
    || !/^[0-9a-f]{64}$/.test(record.run_id)
    || !new Set(["smoke", "development"]).has(record.profile)
    || record.pack !== "public-development"
    || !Number.isSafeInteger(record.seed)
    || record.seed < 0
    || !Number.isSafeInteger(record.world_index)
    || record.world_index < 0
    || record.world_id !== `${record.seed}:${record.world_index}`
    || !FIXTURE_025_ARMS.includes(record.arm)
    || record.attempt !== 0
    || record.units.impedance !== "Ohm"
    || record.units.frequency !== "Hz"
    || record.units.time !== "s"
    || record.units.amplitude !== "V"
    || record.units.bytes !== "B"
    || Object.values(record.input_sha256).some((value) => !/^[0-9a-f]{64}$/.test(value))
    || !FIXTURE_025_WORLD_CLASSES.includes(record.oracle_class)
    || typeof record.corruption !== "string"
    || !record.corruption
    || !FIXTURE_025_DECISIONS.includes(record.decision)
    || [record.schema_valid, record.ordering_valid, record.checksum_valid, record.unit_valid,
      record.calibration_valid, record.amplitude_linear, record.kk_consistent,
      record.identifying].some((value) => typeof value !== "boolean")
    || !Number.isSafeInteger(record.candidate_set_size)
    || record.candidate_set_size < 0
    || record.candidate_set_size > 8
    || !Number.isSafeInteger(record.diagnostic_bundles)
    || record.diagnostic_bundles < 0
    || record.diagnostic_bundles > 9
    || !Number.isSafeInteger(record.mechanism_fits)
    || record.mechanism_fits < 0
    || !Number.isSafeInteger(record.samples_read)
    || record.samples_read < 0
    || !Number.isSafeInteger(record.bytes_read)
    || record.bytes_read < 0
    || !Number.isSafeInteger(record.bytes_written)
    || record.bytes_written < 0
    || !Number.isSafeInteger(record.multiply_add_equivalents)
    || record.multiply_add_equivalents < 0
    || [record.invalid_error, record.false_reject_error, record.overclaim_error,
      record.candidate_error, record.fit_error, record.loss].some((value) => !finite(value))
    || [record.invalid_error, record.false_reject_error, record.overclaim_error,
      record.candidate_error, record.fit_error].some((value) => value < 0 || value > 1)
    || record.loss < 0
    || record.loss > 100
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
  ) throw new Error("Fixture 025 event violates its runtime contract.");
  if (sequence === 0 && record.integrity.previous_sha256 !== ZERO_HASH) {
    throw new Error("Fixture 025 first event must start at the zero hash.");
  }
  if (record.arm === "ungated-fit" && record.diagnostic_bundles !== 0) {
    throw new Error("Fixture 025 ungated arm cannot buy diagnostic bundles.");
  }
  if (record.arm === "ordered-validity-gate" && !record.schema_valid && record.diagnostic_bundles !== 0) {
    throw new Error("Fixture 025 ordered gate must stop before physics probes on invalid records.");
  }
  return record;
}
