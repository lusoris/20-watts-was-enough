import { createHash } from "node:crypto";

export const FIXTURE_012_EVENT_CONTRACT_VERSION = "fixture-012.raw-event.v1";

const arms = new Set([
  "fixed-layout-negative-control",
  "mature-randomized-counterbalanced",
  "operator-qualified-randomized",
]);
const variants = new Set(["baseline", "candidate"]);
const estimand = "candidate-minus-baseline-layout-population-mean-v1";

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

export function buildFixture012Event(body) {
  const event = { ...body };
  return Object.freeze({ ...event, record_sha256: sha256(canonical(event)) });
}

export function assertFixture012Event(record, { previousHash = undefined, sequence = null } = {}) {
  const keys = [
    "schema",
    "contract_version",
    "artifact",
    "run_id",
    "sequence",
    "seed",
    "study",
    "arm",
    "estimand",
    "setup_policy",
    "observation_id",
    "layout_slot",
    "layout_id",
    "invocation",
    "repeat",
    "variant",
    "run_position",
    "latency_ns",
    "true_population_effect_fraction",
    "modeled_work_units",
    "modeled_energy_j",
    "previous_hash",
    "record_sha256",
  ];
  if (!exactKeys(record, keys)) {
    throw new Error("Fixture 012 event has missing or unknown fields.");
  }
  const { record_sha256: digest, ...body } = record;
  const fixed = record.arm === "fixed-layout-negative-control";
  const expectedPolicy = fixed
    ? "fixed-single-pair-repeated"
    : "randomized-counterbalanced-layout-population";
  const expectedPrefix = fixed ? "fixed" : "randomized";
  if (
    record.schema !== 1
    || record.contract_version !== FIXTURE_012_EVENT_CONTRACT_VERSION
    || record.artifact !== "fixture-012"
    || !/^[0-9a-f]{64}$/.test(record.run_id)
    || !Number.isSafeInteger(record.sequence)
    || record.sequence < 0
    || !Number.isInteger(record.seed)
    || record.seed < 0
    || record.seed > 0xffff_ffff
    || !Number.isSafeInteger(record.study)
    || record.study < 0
    || !arms.has(record.arm)
    || record.estimand !== estimand
    || record.setup_policy !== expectedPolicy
    || typeof record.observation_id !== "string"
    || !new RegExp(`^${expectedPrefix}-s\\d+-l\\d+-i\\d+-r\\d+-(baseline|candidate)$`).test(record.observation_id)
    || !Number.isSafeInteger(record.layout_slot)
    || record.layout_slot < 0
    || !Number.isSafeInteger(record.layout_id)
    || record.layout_id < 0
    || (fixed ? record.layout_id !== 0 : record.layout_id !== record.layout_slot)
    || !Number.isSafeInteger(record.invocation)
    || record.invocation < 0
    || !Number.isSafeInteger(record.repeat)
    || record.repeat < 0
    || !variants.has(record.variant)
    || !record.observation_id.endsWith(`-${record.variant}`)
    || !new Set([0, 1]).has(record.run_position)
    || (fixed && ((record.variant === "candidate") !== (record.run_position === 0)))
    || !Number.isSafeInteger(record.latency_ns)
    || record.latency_ns < 1
    || record.true_population_effect_fraction !== 0
    || !Number.isSafeInteger(record.modeled_work_units)
    || record.modeled_work_units < 1
    || !Number.isFinite(record.modeled_energy_j)
    || record.modeled_energy_j <= 0
    || !(record.previous_hash === null || /^[0-9a-f]{64}$/.test(record.previous_hash))
    || !/^[0-9a-f]{64}$/.test(digest)
    || digest !== sha256(canonical(body))
  ) throw new Error("Fixture 012 event violates its runtime contract.");
  if (sequence !== null && record.sequence !== sequence) {
    throw new Error("Fixture 012 event sequence is not contiguous.");
  }
  if (previousHash !== undefined && record.previous_hash !== previousHash) {
    throw new Error("Fixture 012 hash chain is broken.");
  }
  return record;
}

export function assertFixture012Record(record, context = {}) {
  return assertFixture012Event(record, context);
}
