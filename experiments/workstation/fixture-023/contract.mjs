import { createHash } from "node:crypto";

export const FIXTURE_023_EVENT_CONTRACT_VERSION = "fixture-023.plm-development-event.v4";
export const FIXTURE_023_TRACK_ARMS = Object.freeze({
  "PLM-T01": Object.freeze([
    "quantized-accumulator",
    "duration-filter-null",
    "independent-latches",
  ]),
  "PLM-T02": Object.freeze([
    "carry-prior",
    "change-point-null",
    "evidence-gated-reset",
  ]),
});
export const FIXTURE_023_FAILURE_REASONS = Object.freeze([
  "operation-budget-exhausted",
  "numerical-failure",
  "policy-exception",
  "evaluator-exception",
]);

const ZERO_HASH = "0".repeat(64);
const SHA256 = /^[0-9a-f]{64}$/;

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

function probability(value) {
  return finite(value) && value >= 0 && value <= 1;
}

function close(left, right) {
  return Math.abs(left - right) <= 1e-12 * Math.max(1, Math.abs(left), Math.abs(right));
}

function binaryNll(predictions, labels) {
  return predictions.reduce((sum, prediction, index) => (
    sum - labels[index] * Math.log(prediction) - (1 - labels[index]) * Math.log(1 - prediction)
  ), 0);
}

export function fixture023ScientificPayload(record) {
  const payload = { ...record };
  delete payload.integrity;
  return payload;
}

export function fixture023WorkKey(record) {
  return `${record.track}:${record.seed}:${record.world_index}:${record.arm}`;
}

export function assertFixture023Record(
  record,
  { sequence = null, previousHash = null, expectedIdentity = null } = {},
) {
  const topKeys = [
    "schema",
    "contract_version",
    "artifact",
    "track",
    "claim_id",
    "run_id",
    "profile",
    "pack",
    "seed",
    "world_index",
    "world_id",
    "arm",
    "intervention_cell",
    "input_sha256",
    "observation_sha256",
    "units",
    "outcome",
    "accounting",
    "failure",
    "authority",
    "integrity",
  ];
  if (!exactKeys(record, topKeys)) throw new Error("Fixture 023 event has missing or unknown fields.");
  if (!exactKeys(record.input_sha256, [
    "audit",
    "fixture",
    "runner",
    "configuration",
    "schema",
    "public_seeds",
    "confirmation_partition",
    "transfer_partition",
  ])) {
    throw new Error("Fixture 023 immutable-input hashes are incomplete.");
  }
  if (!exactKeys(record.units, ["time", "state", "loss"])) {
    throw new Error("Fixture 023 event units are incomplete.");
  }
  if (!exactKeys(record.outcome, [
    "prediction_probability",
    "target_probability",
    "target_label",
    "brier_loss",
    "log_loss",
    "log_loss_sum",
    "evaluation_count",
    "evaluation_predictions",
    "evaluation_labels",
    "premature_commitment",
    "boundary_authenticated",
    "boundary_state",
    "reset_fraction",
    "reset_performed",
    "abstained",
    "unauthorized_reset",
    "observed_loss",
    "finite_loss",
  ])) throw new Error("Fixture 023 outcome schema is not closed.");
  if (!exactKeys(record.accounting, [
    "observations",
    "state_budget_bytes",
    "state_bytes_charged",
    "operation_budget",
    "operation_count",
    "operation_count_charged",
    "persistent_writes",
    "persistent_writes_charged",
    "reset_operations",
    "reset_operations_charged",
    "cleared_bytes",
    "cleared_bytes_charged",
    "rng_updates",
    "rng_updates_charged",
  ])) throw new Error("Fixture 023 accounting schema is not closed.");
  if (!exactKeys(record.failure, ["failed", "reason"])) {
    throw new Error("Fixture 023 failure schema is not closed.");
  }
  if (!exactKeys(record.authority, [
    "status",
    "comparison_inference_permitted",
    "measured_energy_present",
    "energy_conclusion_allowed",
    "claim_eligible",
    "scientific_result",
    "performance_result",
  ])) throw new Error("Fixture 023 authority schema is not closed.");
  if (!exactKeys(record.integrity, ["sequence", "previous_sha256", "record_sha256"])) {
    throw new Error("Fixture 023 integrity schema is not closed.");
  }

  const expectedPrevious = previousHash ?? record.integrity.previous_sha256;
  const expectedSequence = sequence ?? record.integrity.sequence;
  const expectedHash = sha256(`${expectedPrevious}\n${canonical(fixture023ScientificPayload(record))}`);
  const arms = FIXTURE_023_TRACK_ARMS[record.track];
  const expectedClaim = record.track === "PLM-T01" ? "C-1516" : "C-1517";
  const outcome = record.outcome;
  const accounting = record.accounting;
  const failure = record.failure;
  const unscoredFailure = failure.failed && new Set([
    "numerical-failure",
    "policy-exception",
    "evaluator-exception",
  ]).has(failure.reason);
  const authority = record.authority;
  if (
    record.schema !== 1
    || record.contract_version !== FIXTURE_023_EVENT_CONTRACT_VERSION
    || record.artifact !== "fixture-023"
    || !arms
    || record.claim_id !== expectedClaim
    || !SHA256.test(record.run_id)
    || !new Set(["smoke", "development"]).has(record.profile)
    || record.pack !== "public-development"
    || !Number.isSafeInteger(record.seed)
    || record.seed < 0
    || !Number.isSafeInteger(record.world_index)
    || record.world_index < 0
    || !/^w23_[0-9a-f]{32}$/.test(record.world_id)
    || !arms.includes(record.arm)
    || typeof record.intervention_cell !== "string"
    || record.intervention_cell.length < 3
    || Object.values(record.input_sha256).some((value) => !SHA256.test(value))
    || !SHA256.test(record.observation_sha256)
    || record.units.time !== "s"
    || record.units.state !== "B"
    || record.units.loss !== "dimensionless"
    || (unscoredFailure
      ? outcome.prediction_probability !== null
        && !probability(outcome.prediction_probability)
      : !probability(outcome.prediction_probability))
    || !probability(outcome.target_probability)
    || !finite(outcome.reset_fraction)
    || outcome.reset_fraction < 0
    || outcome.reset_fraction > 1
    || typeof outcome.reset_performed !== "boolean"
    || typeof outcome.abstained !== "boolean"
    || typeof outcome.unauthorized_reset !== "boolean"
    || outcome.unauthorized_reset !== false
    || (unscoredFailure
      ? outcome.observed_loss !== null
      : !finite(outcome.observed_loss)
        || outcome.observed_loss < 0
        || outcome.observed_loss > 100)
    || !finite(outcome.finite_loss)
    || outcome.finite_loss < 0
    || outcome.finite_loss > 100
    || !Number.isSafeInteger(accounting.observations)
    || accounting.observations < 1
    || accounting.state_budget_bytes !== 256
    || accounting.state_bytes_charged !== accounting.state_budget_bytes
    || !Number.isSafeInteger(accounting.operation_budget)
    || accounting.operation_budget < 1
    || !Number.isSafeInteger(accounting.operation_count)
    || accounting.operation_count < 0
    || !Number.isSafeInteger(accounting.operation_count_charged)
    || accounting.operation_count_charged < 0
    || accounting.operation_count_charged > accounting.operation_budget
    || !Number.isSafeInteger(accounting.persistent_writes)
    || accounting.persistent_writes < 0
    || !Number.isSafeInteger(accounting.persistent_writes_charged)
    || accounting.persistent_writes_charged < 0
    || accounting.persistent_writes_charged > accounting.operation_budget
    || !Number.isSafeInteger(accounting.reset_operations)
    || accounting.reset_operations < 0
    || accounting.reset_operations > 1
    || !Number.isSafeInteger(accounting.reset_operations_charged)
    || accounting.reset_operations_charged < 0
    || accounting.reset_operations_charged > 1
    || !Number.isSafeInteger(accounting.cleared_bytes)
    || accounting.cleared_bytes < 0
    || accounting.cleared_bytes > accounting.state_budget_bytes
    || !Number.isSafeInteger(accounting.cleared_bytes_charged)
    || accounting.cleared_bytes_charged < 0
    || accounting.cleared_bytes_charged > accounting.state_budget_bytes
    || !Number.isSafeInteger(accounting.rng_updates)
    || accounting.rng_updates < 0
    || !Number.isSafeInteger(accounting.rng_updates_charged)
    || accounting.rng_updates_charged < 0
    || accounting.rng_updates_charged > accounting.operation_budget
    || typeof failure.failed !== "boolean"
    || (failure.failed
      ? !FIXTURE_023_FAILURE_REASONS.includes(failure.reason)
      : failure.reason !== null)
    || authority.status !== "NO_RESULT"
    || authority.comparison_inference_permitted !== false
    || authority.measured_energy_present !== false
    || authority.energy_conclusion_allowed !== false
    || authority.claim_eligible !== false
    || authority.scientific_result !== false
    || authority.performance_result !== false
    || !Number.isSafeInteger(record.integrity.sequence)
    || record.integrity.sequence < 0
    || !SHA256.test(record.integrity.previous_sha256)
    || !SHA256.test(record.integrity.record_sha256)
    || record.integrity.sequence !== expectedSequence
    || record.integrity.previous_sha256 !== expectedPrevious
    || record.integrity.record_sha256 !== expectedHash
  ) throw new Error("Fixture 023 event violates its runtime contract.");

  if (expectedIdentity && (
    record.run_id !== expectedIdentity.run_id
    || record.profile !== expectedIdentity.profile
    || canonical(record.input_sha256) !== canonical(expectedIdentity.input_sha256)
  )) throw new Error("Fixture 023 event identity differs from its canonical run identity.");

  if (sequence === 0 && record.integrity.previous_sha256 !== ZERO_HASH) {
    throw new Error("Fixture 023 first event must start at the zero hash.");
  }
  if (outcome.reset_performed !== (accounting.reset_operations === 1)) {
    throw new Error("Fixture 023 reset action and accounting disagree.");
  }
  if (outcome.reset_performed !== (outcome.reset_fraction > 0)) {
    throw new Error("Fixture 023 reset flag and reset fraction disagree.");
  }
  if (accounting.cleared_bytes !== Math.round(accounting.state_budget_bytes * outcome.reset_fraction)) {
    throw new Error("Fixture 023 cleared-byte ledger does not close.");
  }
  if (failure.failed) {
    if (
      outcome.finite_loss !== 100
      || accounting.operation_count_charged !== accounting.operation_budget
      || accounting.persistent_writes_charged !== accounting.operation_budget
      || accounting.reset_operations_charged !== 1
      || accounting.cleared_bytes_charged !== accounting.state_budget_bytes
      || accounting.rng_updates_charged !== accounting.operation_budget
    ) throw new Error("Fixture 023 retained failure does not apply finite maximum charges.");
    if (
      failure.reason === "operation-budget-exhausted"
      && accounting.operation_count <= accounting.operation_budget
      && accounting.persistent_writes <= accounting.operation_budget
      && accounting.rng_updates <= accounting.operation_budget
    ) throw new Error("Fixture 023 operation-budget failure has no observed cap exceedance.");
  } else if (
    accounting.operation_count > accounting.operation_budget
    || accounting.persistent_writes > accounting.operation_budget
    || accounting.rng_updates > accounting.operation_budget
    || accounting.operation_count_charged !== accounting.operation_count
    || accounting.persistent_writes_charged !== accounting.persistent_writes
    || accounting.reset_operations_charged !== accounting.reset_operations
    || accounting.cleared_bytes_charged !== accounting.cleared_bytes
    || accounting.rng_updates_charged !== accounting.rng_updates
  ) throw new Error("Fixture 023 successful accounting exceeds or misstates its frozen budget.");

  if (!failure.failed && !close(outcome.finite_loss, outcome.observed_loss)) {
    throw new Error("Fixture 023 successful charged and observed loss disagree.");
  }

  if (record.track === "PLM-T01") {
    if (
      !new Set([0, 1]).has(outcome.target_label)
      || outcome.evaluation_predictions !== null
      || outcome.evaluation_labels !== null
      || outcome.log_loss !== null
      || outcome.log_loss_sum !== null
      || outcome.evaluation_count !== 1
      || (unscoredFailure
        ? outcome.premature_commitment !== null || outcome.brier_loss !== null
        : typeof outcome.premature_commitment !== "boolean" || !probability(outcome.brier_loss))
      || outcome.boundary_authenticated !== null
      || outcome.boundary_state !== null
      || outcome.reset_fraction !== 1
      || outcome.reset_performed !== true
      || outcome.abstained !== false
      || accounting.reset_operations !== 1
      || accounting.cleared_bytes !== 256
      || (!unscoredFailure
        && !close(outcome.brier_loss, (outcome.prediction_probability - outcome.target_label) ** 2))
      || (!unscoredFailure && !close(outcome.observed_loss, Math.min(100, 100 * outcome.brier_loss)))
      || (!failure.failed
        && !close(outcome.finite_loss, Math.min(100, 100 * outcome.brier_loss)))
    ) throw new Error("Fixture 023 PLM-T01 null/reset contract is invalid.");
  } else if (
    outcome.target_label !== null
    || outcome.brier_loss !== null
    || !Number.isSafeInteger(outcome.evaluation_count)
    || outcome.evaluation_count < 1
    || !Array.isArray(outcome.evaluation_predictions)
    || outcome.evaluation_predictions.length !== outcome.evaluation_count
    || !Array.isArray(outcome.evaluation_labels)
    || outcome.evaluation_labels.length !== outcome.evaluation_count
    || outcome.evaluation_labels.some((label) => !new Set([0, 1]).has(label))
    || (unscoredFailure
      ? (!outcome.evaluation_predictions.every((prediction) => prediction === null)
          && outcome.evaluation_predictions.some((prediction) => !probability(prediction)
            || prediction === 0 || prediction === 1))
        || outcome.log_loss !== null
        || outcome.log_loss_sum !== null
      : outcome.evaluation_predictions.some((prediction) => !probability(prediction)
          || prediction === 0 || prediction === 1)
        || !finite(outcome.log_loss)
        || outcome.log_loss < 0
        || !finite(outcome.log_loss_sum)
        || outcome.log_loss_sum < 0)
    || outcome.premature_commitment !== null
    || typeof outcome.boundary_authenticated !== "boolean"
    || !new Set(["authentic", "duplicate", "delayed", "missing"]).has(outcome.boundary_state)
    || outcome.boundary_authenticated !== (outcome.boundary_state === "authentic")
  ) throw new Error("Fixture 023 PLM-T02 typed-null contract is invalid.");

  if (record.track === "PLM-T02" && unscoredFailure) {
    const retained = outcome.evaluation_predictions.every((prediction) => prediction !== null);
    if (
      retained !== (outcome.prediction_probability !== null)
      || (retained && !close(
        outcome.prediction_probability,
        outcome.evaluation_predictions.reduce((sum, value) => sum + value, 0)
          / outcome.evaluation_count,
      ))
    ) throw new Error("Fixture 023 unscored T02 prediction retention is inconsistent.");
  }

  if (record.track === "PLM-T02" && !unscoredFailure) {
    const independentlyDerivedNll = binaryNll(
      outcome.evaluation_predictions,
      outcome.evaluation_labels,
    );
    const predictionMean = outcome.evaluation_predictions.reduce((sum, value) => sum + value, 0)
      / outcome.evaluation_count;
    if (
      !close(outcome.log_loss_sum, independentlyDerivedNll)
      || !close(outcome.log_loss, independentlyDerivedNll / outcome.evaluation_count)
      || !close(outcome.prediction_probability, predictionMean)
      || !close(outcome.observed_loss, Math.min(100, 100 * outcome.log_loss))
      || (!failure.failed
        && !close(outcome.finite_loss, Math.min(100, 100 * outcome.log_loss)))
    ) throw new Error("Fixture 023 PLM-T02 NLL does not derive from retained examples.");
  }

  if (record.track === "PLM-T02" && !failure.failed && !outcome.boundary_authenticated) {
    if (record.arm === "carry-prior") {
      if (outcome.reset_performed || outcome.reset_fraction !== 0 || outcome.abstained) {
        throw new Error("Fixture 023 carry arm cannot claim boundary abstention or reset.");
      }
    } else if (!outcome.abstained || outcome.reset_performed || outcome.reset_fraction !== 0) {
      throw new Error("Fixture 023 reset-capable arms must abstain on unauthenticated boundaries.");
    }
  }
  if (record.track === "PLM-T02" && !failure.failed && record.arm === "carry-prior" && (
    outcome.reset_performed
    || outcome.reset_fraction !== 0
    || outcome.abstained
  )) throw new Error("Fixture 023 carry arm cannot reset or claim reset abstention.");
  return record;
}
