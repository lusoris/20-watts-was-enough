import { createHash } from "node:crypto";

export const FIXTURE_022_EVENT_CONTRACT_VERSION = "fixture-022.dev-t01-event.v3";
export const FIXTURE_022_ARMS = Object.freeze([
  "open-write-majority",
  "robust-propagation-null",
  "gated-memory-with-null-fallback",
]);
export const FIXTURE_022_CORRUPTION_FAMILIES = Object.freeze([
  "valid",
  "independent-permutation",
  "local-patch-shift",
  "common-mode-shift",
]);
export const FIXTURE_022_FAILURE_REASONS = Object.freeze([
  "message-budget-exhausted",
  "memory-write-budget-exhausted",
  "solver-nonconvergence",
  "numerical-failure",
  "policy-exception",
  "evaluator-exception",
]);

const ZERO_HASH = "0".repeat(64);
const SHA256 = /^[0-9a-f]{64}$/;
const COMPLETE_FAILURE_SIGNALS = Object.freeze({
  "message-budget-exhausted": Object.freeze({
    stage: "policy",
    signal: "message-attempt-exceeds-cap",
    outcome_observation_complete: true,
    resource_observation_complete: true,
  }),
  "memory-write-budget-exhausted": Object.freeze({
    stage: "policy",
    signal: "memory-write-count-exceeds-cap",
    outcome_observation_complete: true,
    resource_observation_complete: true,
  }),
  "solver-nonconvergence": Object.freeze({
    stage: "policy",
    signal: "maximum-rounds-without-convergence",
    outcome_observation_complete: true,
    resource_observation_complete: true,
  }),
  "policy-exception": Object.freeze({
    stage: "policy",
    signal: "policy-threw",
    outcome_observation_complete: false,
    resource_observation_complete: false,
  }),
  "evaluator-exception": Object.freeze({
    stage: "evaluator",
    signal: "evaluator-threw",
    outcome_observation_complete: false,
    resource_observation_complete: true,
  }),
});
const SUCCESS_DETAIL = Object.freeze({
  stage: null,
  signal: null,
  outcome_observation_complete: true,
  resource_observation_complete: true,
});

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

function close(left, right) {
  return Math.abs(left - right) <= 1e-12 * Math.max(1, Math.abs(left), Math.abs(right));
}

function expectedObservedLoss(record) {
  const wrongRate = record.wrong_role_count / record.attempted_tasks;
  const unsafeRate = record.unsafe_write_count / Math.max(1, record.memory_writes);
  return Math.min(
    100,
    40 * record.role_error_rate
      + 30 * (1 - record.accepted_service_fraction)
      + 20 * wrongRate
      + 10 * unsafeRate,
  );
}

function maximumCharge(record) {
  const maximumMessages = Math.floor(
    record.budget.message_budget_bytes / record.budget.bytes_per_message,
  );
  return {
    messages_count: maximumMessages,
    message_bytes: maximumMessages * record.budget.bytes_per_message,
    memory_reads: record.nodes_total * (1 + 4 * record.budget.max_solver_rounds),
    memory_writes: record.budget.memory_write_budget,
    solver_rounds: record.budget.max_solver_rounds,
  };
}

export function fixture022ScientificPayload(record) {
  const payload = { ...record };
  delete payload.integrity;
  return payload;
}

export function fixture022WorkKey(record) {
  return `${record.seed}:${record.world_index}:${record.arm}`;
}

export function assertFixture022Record(record, {
  sequence = null,
  previousHash = null,
  context = null,
} = {}) {
  const keys = [
    "schema", "contract_version", "artifact", "track", "run_id", "profile", "pack",
    "seed", "world_index", "world_id", "corruption_family", "arm", "attempt", "units",
    "input_sha256", "observation_sha256", "budget", "budget_equal_by_contract",
    "hidden_truth_exposed", "nodes_total", "wounded_nodes", "attempted_tasks",
    "accepted_tasks", "wrong_role_count", "unsafe_write_count", "support_miss_count",
    "memory_abstention_count", "fallback_invoked", "corruption_detected", "role_error_rate",
    "accepted_service_fraction", "messages_count", "message_bytes", "memory_reads",
    "memory_writes", "rollback_count", "solver_rounds", "converged", "failure",
    "failure_reason", "failure_detail", "observed_loss", "loss", "charged_resources",
    "status", "measured_energy_present", "energy_conclusion_allowed", "claim_eligible",
    "scientific_result", "performance_result", "integrity",
  ];
  if (!exactKeys(record, keys)) throw new Error("Fixture 022 event has missing or unknown fields.");
  if (!exactKeys(record.units, ["node", "count", "message", "fraction"])) {
    throw new Error("Fixture 022 event units are incomplete.");
  }
  if (!exactKeys(record.input_sha256, [
    "audit", "fixture", "runner", "config_smoke", "config_development", "schema",
  ])) throw new Error("Fixture 022 immutable-input hashes are incomplete.");
  if (!exactKeys(record.budget, [
    "max_solver_rounds", "bytes_per_message", "message_budget_bytes", "memory_write_budget",
  ])) throw new Error("Fixture 022 budget fields are incomplete.");
  if (!exactKeys(record.failure_detail, [
    "stage", "signal", "outcome_observation_complete", "resource_observation_complete",
  ])) throw new Error("Fixture 022 failure detail is incomplete or not closed.");
  if (!exactKeys(record.charged_resources, [
    "messages_count", "message_bytes", "memory_reads", "memory_writes", "solver_rounds",
  ])) throw new Error("Fixture 022 charged-resource fields are incomplete.");
  if (!exactKeys(record.integrity, ["sequence", "previous_sha256", "record_sha256"])) {
    throw new Error("Fixture 022 event integrity is incomplete.");
  }
  const expectedPrevious = previousHash ?? record.integrity.previous_sha256;
  const expectedSequence = sequence ?? record.integrity.sequence;
  const expectedHash = sha256(`${expectedPrevious}\n${canonical(fixture022ScientificPayload(record))}`);
  const nonnegativeIntegers = [
    record.world_index, record.attempt, record.nodes_total, record.wounded_nodes,
    record.attempted_tasks, record.accepted_tasks, record.wrong_role_count,
    record.unsafe_write_count, record.support_miss_count, record.memory_abstention_count,
    record.messages_count, record.message_bytes, record.memory_reads, record.memory_writes,
    record.rollback_count, record.solver_rounds, record.charged_resources.messages_count,
    record.charged_resources.message_bytes, record.charged_resources.memory_reads,
    record.charged_resources.memory_writes, record.charged_resources.solver_rounds,
  ];
  if (
    record.schema !== 1
    || record.contract_version !== FIXTURE_022_EVENT_CONTRACT_VERSION
    || record.artifact !== "fixture-022"
    || record.track !== "DEV-T01"
    || !SHA256.test(record.run_id)
    || !new Set(["smoke", "development"]).has(record.profile)
    || record.pack !== "public-development"
    || !Number.isSafeInteger(record.seed)
    || record.seed < 1516001
    || record.seed > 1516064
    || nonnegativeIntegers.some((value) => !Number.isSafeInteger(value) || value < 0)
    || record.world_id !== `${record.seed}:${record.world_index}`
    || !FIXTURE_022_CORRUPTION_FAMILIES.includes(record.corruption_family)
    || !FIXTURE_022_ARMS.includes(record.arm)
    || record.attempt !== 0
    || record.units.node !== "node"
    || record.units.count !== "count"
    || record.units.message !== "B"
    || record.units.fraction !== "1"
    || Object.values(record.input_sha256).some((value) => !SHA256.test(value))
    || !SHA256.test(record.observation_sha256)
    || !Number.isSafeInteger(record.budget.max_solver_rounds)
    || record.budget.max_solver_rounds < 1
    || !Number.isSafeInteger(record.budget.bytes_per_message)
    || record.budget.bytes_per_message < 1
    || !Number.isSafeInteger(record.budget.message_budget_bytes)
    || record.budget.message_budget_bytes < 1
    || !Number.isSafeInteger(record.budget.memory_write_budget)
    || record.budget.memory_write_budget < 1
    || record.budget_equal_by_contract !== true
    || record.hidden_truth_exposed !== false
    || record.nodes_total < 4
    || record.wounded_nodes < 1
    || record.wounded_nodes >= record.nodes_total
    || record.attempted_tasks !== record.wounded_nodes
    || record.accepted_tasks > record.attempted_tasks
    || record.wrong_role_count > record.accepted_tasks
    || record.unsafe_write_count > record.memory_writes
    || record.support_miss_count > record.nodes_total - record.wounded_nodes
    || record.memory_abstention_count > record.nodes_total - record.wounded_nodes
    || typeof record.fallback_invoked !== "boolean"
    || typeof record.corruption_detected !== "boolean"
    || !finite(record.role_error_rate)
    || record.role_error_rate < 0
    || record.role_error_rate > 1
    || !finite(record.accepted_service_fraction)
    || record.accepted_service_fraction < 0
    || record.accepted_service_fraction > 1
    || !close(record.role_error_rate, (record.wrong_role_count + record.attempted_tasks - record.accepted_tasks) / record.attempted_tasks)
    || !close(record.accepted_service_fraction, record.accepted_tasks / record.attempted_tasks)
    || record.message_bytes !== record.messages_count * record.budget.bytes_per_message
    || typeof record.converged !== "boolean"
    || typeof record.failure !== "boolean"
    || (record.failure
      ? !FIXTURE_022_FAILURE_REASONS.includes(record.failure_reason)
      : record.failure_reason !== null)
    || typeof record.failure_detail.outcome_observation_complete !== "boolean"
    || typeof record.failure_detail.resource_observation_complete !== "boolean"
    || (record.observed_loss !== null && (
      !finite(record.observed_loss) || record.observed_loss < 0 || record.observed_loss > 100
    ))
    || !finite(record.loss)
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
    || !SHA256.test(record.integrity.previous_sha256)
    || !SHA256.test(record.integrity.record_sha256)
    || record.integrity.sequence !== expectedSequence
    || record.integrity.previous_sha256 !== expectedPrevious
    || record.integrity.record_sha256 !== expectedHash
  ) throw new Error("Fixture 022 event violates its runtime contract.");
  if (sequence === 0 && record.integrity.previous_sha256 !== ZERO_HASH) {
    throw new Error("Fixture 022 first event must start at the zero hash.");
  }
  if (context !== null) {
    const expectedBudget = context?.config && {
      max_solver_rounds: context.config.max_solver_rounds,
      bytes_per_message: context.config.bytes_per_message,
      message_budget_bytes: context.config.message_budget_per_arm_bytes,
      memory_write_budget: context.config.memory_write_budget_per_arm,
    };
    if (
      !context
      || typeof context !== "object"
      || record.run_id !== context.run_id
      || record.profile !== context.profile
      || canonical(record.input_sha256) !== canonical(context.input_sha256)
      || canonical(record.budget) !== canonical(expectedBudget)
    ) throw new Error("Fixture 022 event context differs from the fresh run identity.");
  }

  const derivedObservedLoss = expectedObservedLoss(record);
  if (record.failure_detail.outcome_observation_complete) {
    if (!finite(record.observed_loss) || !close(record.observed_loss, derivedObservedLoss)) {
      throw new Error("Fixture 022 observed loss does not derive from retained outcome counts.");
    }
  } else if (
    record.observed_loss !== null
    || record.accepted_tasks !== 0
    || record.wrong_role_count !== 0
    || record.unsafe_write_count !== 0
    || record.support_miss_count !== 0
  ) {
    throw new Error("Fixture 022 incomplete outcome observation must retain a typed null and no pseudo-observations.");
  }

  const maximum = maximumCharge(record);
  const maximumMessages = maximum.messages_count;
  if (record.failure) {
    if (record.loss !== 100 || canonical(record.charged_resources) !== canonical(maximum)) {
      throw new Error("Fixture 022 retained failure does not apply a separate maximum finite charge.");
    }
    if (record.failure_reason === "numerical-failure") {
      const numericalDetails = new Map([
        ["policy", new Set(["non-finite-policy-output", "invalid-policy-output"])],
        ["evaluator", new Set(["non-finite-evaluator-output", "invalid-evaluator-output"])],
      ]);
      if (
        !numericalDetails.get(record.failure_detail.stage)?.has(record.failure_detail.signal)
        || record.failure_detail.outcome_observation_complete
        || record.failure_detail.resource_observation_complete !== (record.failure_detail.stage === "evaluator")
      ) throw new Error("Fixture 022 numerical failure has no matching typed causal signal.");
    } else if (canonical(record.failure_detail) !== canonical(COMPLETE_FAILURE_SIGNALS[record.failure_reason])) {
      throw new Error("Fixture 022 failure reason and causal detail disagree.");
    }
    if (
      record.failure_reason === "message-budget-exhausted"
      && (record.messages_count <= maximumMessages || record.converged)
    ) throw new Error("Fixture 022 message-budget failure has no observed attempted overrun.");
    if (
      record.failure_reason === "memory-write-budget-exhausted"
      && (
        record.memory_writes <= record.budget.memory_write_budget
        || record.messages_count > maximumMessages
        || !record.converged
      )
    ) throw new Error("Fixture 022 memory-write failure has no isolated observed overrun.");
    if (
      record.failure_reason === "solver-nonconvergence"
      && (
        record.converged
        || record.solver_rounds !== record.budget.max_solver_rounds
        || record.messages_count > maximumMessages
        || record.memory_writes > record.budget.memory_write_budget
      )
    ) throw new Error("Fixture 022 solver failure has no observed maximum-round nonconvergence.");
    if (record.failure_reason === "policy-exception" && (
      record.converged
      || record.messages_count !== 0
      || record.memory_reads !== 0
      || record.memory_writes !== 0
      || record.solver_rounds !== 0
    )) throw new Error("Fixture 022 policy exception does not retain its zero-work causal boundary.");
  } else if (
    canonical(record.failure_detail) !== canonical(SUCCESS_DETAIL)
    || !record.converged
    || record.messages_count > maximumMessages
    || record.memory_writes > record.budget.memory_write_budget
    || record.solver_rounds > record.budget.max_solver_rounds
    || !close(record.loss, record.observed_loss)
    || canonical(record.charged_resources) !== canonical({
      messages_count: record.messages_count,
      message_bytes: record.message_bytes,
      memory_reads: record.memory_reads,
      memory_writes: record.memory_writes,
      solver_rounds: record.solver_rounds,
    })
  ) {
    throw new Error("Fixture 022 successful event charge or causal state differs from observed work.");
  }
  return record;
}
