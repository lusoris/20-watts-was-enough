import { createHash } from "node:crypto";

export const FIXTURE_007_EVENT_CONTRACT_VERSION = "fixture-007.raw-event.v1";

export function canonical(value) {
  if (value === null || typeof value === "boolean" || typeof value === "string") {
    return JSON.stringify(value);
  }
  if (typeof value === "number" && Number.isFinite(value)) return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(canonical).join(",")}]`;
  if (value && typeof value === "object") {
    return `{${Object.keys(value).sort().map((key) => {
      if (value[key] === undefined) throw new Error(`Undefined value at ${key}.`);
      return `${JSON.stringify(key)}:${canonical(value[key])}`;
    }).join(",")}}`;
  }
  throw new Error(`Non-JSON value of type ${typeof value}.`);
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

export function buildFixture007Event(body) {
  const event = { ...body };
  return Object.freeze({ ...event, record_sha256: sha256(canonical(event)) });
}

export function assertFixture007Event(record, { previousHash = null, sequence = null } = {}) {
  const keys = [
    "schema",
    "contract_version",
    "artifact",
    "run_id",
    "sequence",
    "seed",
    "episode",
    "arm",
    "operator_version",
    "base_observation",
    "active_observation",
    "true_label",
    "decision",
    "abstained",
    "active_measurement",
    "photons",
    "modeled_energy_j",
    "previous_hash",
    "record_sha256",
  ];
  if (!exactKeys(record, keys)) throw new Error("Fixture 007 event has missing or unknown fields.");
  const { record_sha256: digest, ...body } = record;
  if (
    record.schema !== 1
    || record.contract_version !== FIXTURE_007_EVENT_CONTRACT_VERSION
    || record.artifact !== "fixture-007"
    || !/^[0-9a-f]{64}$/.test(record.run_id)
    || !Number.isSafeInteger(record.sequence)
    || record.sequence < 0
    || !Number.isInteger(record.seed)
    || record.seed < 0
    || !Number.isSafeInteger(record.episode)
    || record.episode < 0
    || !new Set([
      "unqualified-point",
      "mature-selective",
      "mature-active",
      "operator-qualified-active",
    ]).has(record.arm)
    || record.operator_version !== "rank-deficient-base-plus-hidden-axis-v1"
    || !Number.isFinite(record.base_observation)
    || !(record.active_observation === null || Number.isFinite(record.active_observation))
    || !new Set([-1, 1]).has(record.true_label)
    || !(record.decision === null || new Set([-1, 1]).has(record.decision))
    || typeof record.abstained !== "boolean"
    || typeof record.active_measurement !== "boolean"
    || !Number.isSafeInteger(record.photons)
    || record.photons < 0
    || !Number.isFinite(record.modeled_energy_j)
    || record.modeled_energy_j < 0
    || !(record.previous_hash === null || /^[0-9a-f]{64}$/.test(record.previous_hash))
    || !/^[0-9a-f]{64}$/.test(digest)
    || digest !== sha256(canonical(body))
  ) throw new Error("Fixture 007 event violates its runtime contract.");
  if (sequence !== null && record.sequence !== sequence) {
    throw new Error("Fixture 007 event sequence is not contiguous.");
  }
  if (previousHash !== null && record.previous_hash !== previousHash) {
    throw new Error("Fixture 007 hash chain is broken.");
  }
  if ((record.decision === null) !== record.abstained) {
    throw new Error("Fixture 007 decision and abstention disagree.");
  }
  if (record.active_measurement !== (record.active_observation !== null)) {
    throw new Error("Fixture 007 active-measurement flag disagrees with the observation.");
  }
  if (record.active_measurement !== (record.photons > 0 && record.modeled_energy_j > 0)) {
    throw new Error("Fixture 007 active resources are not joined to the active observation.");
  }
  return record;
}

export function assertFixture007Record(record, context = {}) {
  return assertFixture007Event(record, context);
}
