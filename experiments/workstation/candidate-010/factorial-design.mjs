import { createHash } from "node:crypto";

/**
 * Candidate 010's design matrix is deliberately data-only.  The workstation
 * runner can consume each scenario's config_overlay and execution_contract
 * without the design code learning anything from outcomes.
 */

export const COMPARATOR_IMPLEMENTATION = Object.freeze([
  Object.freeze({ id: "threshold", status: "implemented-policy" }),
  Object.freeze({ id: "cascade", status: "implemented-policy" }),
  Object.freeze({ id: "conditioned-sprt", status: "implemented-policy" }),
  Object.freeze({ id: "selective-abstention", status: "implemented-policy" }),
  Object.freeze({
    id: "retry-rollback",
    status: "evidence-policy-proxy",
    limit: "does not yet execute a second staged effect lifecycle",
  }),
  Object.freeze({
    id: "independent-verifier",
    status: "shared-trace-generator-control",
    limit: "does not yet provide implementation-failure independence",
  }),
]);

export const COMPARATOR_ARMS = Object.freeze(COMPARATOR_IMPLEMENTATION.map((row) => row.id));

export const TASK_FAMILIES = Object.freeze([
  Object.freeze({ id: "filesystem-publish", split: "development", backend: "filesystem-stage-execute-finalize-v1", implemented: true, adapter: "filesystem-track.mjs" }),
  Object.freeze({ id: "transactional-kv", split: "validation", backend: "local-versioned-transactional-kv-v1", implemented: true, adapter: "transactional-kv-track.mjs" }),
  Object.freeze({ id: "signed-publication", split: "confirmation", backend: "synthetic-signed-publication-v1", implemented: true, adapter: "signed-publication-track.mjs" }),
  Object.freeze({ id: "actuator-command", split: "confirmation", backend: "isolated-actuator-command-v1", implemented: true, adapter: "actuator-command-track.mjs" }),
]);

const FACTORS = Object.freeze({
  trace: Object.freeze([
    Object.freeze({ id: "revealed", reveal: true }),
    Object.freeze({ id: "withheld", reveal: false }),
  ]),
  coupling: Object.freeze([
    Object.freeze({ id: "coupled", coupled: true }),
    Object.freeze({ id: "decoupled", coupled: false }),
  ]),
  correlation: Object.freeze([
    Object.freeze({ id: "rho-010", value: 0.1 }),
    Object.freeze({ id: "rho-060", value: 0.6 }),
    Object.freeze({ id: "rho-090", value: 0.9 }),
  ]),
  verifier: Object.freeze([
    Object.freeze({ id: "null", signal: 0, common_mode_weight: 1 }),
    Object.freeze({ id: "moderate", signal: 0.8, common_mode_weight: 0.4 }),
    Object.freeze({ id: "informative", signal: 1.4, common_mode_weight: 0.1 }),
  ]),
  cost: Object.freeze([
    Object.freeze({ id: "reset-cheap", reset_j: 0.000006, commit_j: 0.00003 }),
    Object.freeze({ id: "cost-parity", reset_j: 0.000012, commit_j: 0.000012 }),
    Object.freeze({ id: "reset-expensive", reset_j: 0.00003, commit_j: 0.000006 }),
  ]),
});

export const EQUAL_BUDGET_CONTRACT = Object.freeze({
  schema: 1,
  accounting: "assigned allowance parity plus observed policy, evidence, byte, and wall-time fields; rejected, reset, abstained, and timed-out attempts included",
  limit: "This contract does not equate backend instruction counts, cryptographic work, storage history, or hardware energy.",
  maxima_per_opportunity: Object.freeze({
    observations: 3,
    verifier_calls: 1,
    policy_evaluations: 1,
    staged_bytes: 4096,
    durable_bytes: 4096,
    wall_time_ms: 5_000,
  }),
  shared_allowances: Object.freeze([
    "candidate stream and consequence schedule",
    "evidence channels and observation timing",
    "proposer and verifier model classes",
    "rollback backend and storage allowance",
    "wall-time deadline and energy boundary",
  ]),
  unused_budget_rule: "Unused allowance is not a benefit; only observed wall resources may be lower.",
});

function canonical(value) {
  if (Array.isArray(value)) return `[${value.map(canonical).join(",")}]`;
  if (value && typeof value === "object") {
    return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${canonical(value[key])}`).join(",")}}`;
  }
  return JSON.stringify(value);
}

function shortDigest(value) {
  return createHash("sha256").update(canonical(value)).digest("hex").slice(0, 16);
}

function coveringRows() {
  const rows = [];
  // Twelve runs cross the two binary factors completely three times while
  // balancing every three-level factor four times.  This bounds the first
  // workstation package while retaining deterministic main-effect coverage.
  for (let index = 0; index < 12; index += 1) {
    rows.push([
      FACTORS.trace[index % 2],
      FACTORS.coupling[Math.floor(index / 2) % 2],
      FACTORS.correlation[index % 3],
      FACTORS.verifier[Math.floor(index / 3) % 3],
      FACTORS.cost[(index + Math.floor(index / 3)) % 3],
    ]);
  }
  return rows;
}

/** Build the frozen, deterministic scenario matrix for one or more data splits. */
export function buildFactorialDesign({ splits = ["development", "validation", "confirmation"] } = {}) {
  const requested = new Set(splits);
  const unknown = [...requested].filter((split) => !["development", "validation", "confirmation"].includes(split));
  if (unknown.length) throw new Error(`Unknown design split: ${unknown.join(", ")}`);

  const scenarios = [];
  const families = TASK_FAMILIES.filter((family) => requested.has(family.split));
  for (const family of families) {
    for (const [trace, coupling, correlation, verifier, cost] of coveringRows()) {
      const factors = {
        task_family: family.id,
        trace_revelation: trace.id,
        verifier_decision_coupling: coupling.id,
        evidence_correlation: correlation.id,
        verifier_informativeness: verifier.id,
        reset_commit_cost: cost.id,
      };
      const id = `c010-${family.split}-${shortDigest(factors)}`;
      scenarios.push(Object.freeze({
        schema: 1,
        id,
        split: family.split,
        task_family: family.id,
        backend: family.backend,
        backend_implemented: family.implemented,
        required_adapter: family.adapter,
        design: "balanced-covering-array-v2",
        factors: Object.freeze(factors),
        config_overlay: Object.freeze({
          cheap_evidence_correlation: correlation.value,
          verifier_signal: verifier.signal,
          verifier_common_mode_weight: verifier.common_mode_weight,
          modeled_energy_j: Object.freeze({ reset: cost.reset_j, commit: cost.commit_j }),
        }),
        execution_contract: Object.freeze({
          reveal_trace_to_candidate: trace.reveal,
          verifier_coupled_to_finalization: coupling.coupled,
          trace_is_constructed_for_all_arms: true,
          trace_bytes_charged_to_all_arms: true,
          rollback_mechanism_ablated: false,
          rejection_always_resets: true,
          backend_implemented: family.implemented,
        }),
        eligible_arms: Object.freeze([...COMPARATOR_ARMS, "reset-coupled"]),
        ineligible_ceiling: "oracle-ceiling",
        budget: EQUAL_BUDGET_CONTRACT,
      }));
    }
  }

  scenarios.sort((left, right) => left.id.localeCompare(right.id));
  assertTaskFamilyHoldout(scenarios);
  return Object.freeze(scenarios);
}

/** Confirmation task families may not occur in either tuning split. */
export function assertTaskFamilyHoldout(scenarios) {
  const tuning = new Set(scenarios
    .filter((scenario) => scenario.split !== "confirmation")
    .map((scenario) => scenario.task_family));
  const confirmation = new Set(scenarios
    .filter((scenario) => scenario.split === "confirmation")
    .map((scenario) => scenario.task_family));
  const overlap = [...confirmation].filter((family) => tuning.has(family));
  if (overlap.length) throw new Error(`Confirmation task-family leakage: ${overlap.join(", ")}`);
  return { tuning: [...tuning].sort(), confirmation: [...confirmation].sort() };
}

/**
 * Produce arm-level accounting without redistributing unused allowance.  The
 * result is suitable for the raw provenance record; it is not a utility score.
 */
export function accountEqualBudget({ scenario, arm, usage }) {
  if (!scenario?.eligible_arms?.includes(arm)) throw new Error(`Arm is not eligible in scenario: ${arm}`);
  const maxima = scenario.budget.maxima_per_opportunity;
  const normalized = {
    observations: usage.observations,
    verifier_calls: usage.verifier_calls,
    policy_evaluations: usage.policy_evaluations,
    staged_bytes: usage.staged_bytes,
    durable_bytes: usage.durable_bytes,
    wall_time_ms: usage.wall_time_ms,
  };
  for (const [name, maximum] of Object.entries(maxima)) {
    const observed = normalized[name];
    if (!Number.isFinite(observed) || observed < 0) throw new Error(`Invalid budget usage ${name}: ${observed}`);
    if (observed > maximum) throw new Error(`Budget exceeded for ${name}: ${observed} > ${maximum}`);
  }
  return Object.freeze({
    scenario_id: scenario.id,
    arm,
    assigned_allowance: maxima,
    observed: Object.freeze(normalized),
    unused_is_not_credit: true,
    within_budget: true,
  });
}

export function validateEqualBudgetAssignments(scenario, assignments) {
  if (!Array.isArray(assignments) || assignments.length !== scenario.eligible_arms.length) {
    throw new Error(`Expected exactly ${scenario.eligible_arms.length} budget assignments.`);
  }
  const byArm = new Map();
  for (const assignment of assignments) {
    if (!scenario.eligible_arms.includes(assignment?.arm)) {
      throw new Error(`Unknown budget assignment arm: ${assignment?.arm}`);
    }
    if (byArm.has(assignment.arm)) throw new Error(`Duplicate budget assignment for arm: ${assignment.arm}`);
    if (assignment.scenario_id !== scenario.id) throw new Error(`Budget scenario mismatch for arm: ${assignment.arm}`);
    if (assignment.within_budget !== true || assignment.unused_is_not_credit !== true) {
      throw new Error(`Budget status is not valid for arm: ${assignment.arm}`);
    }
    byArm.set(assignment.arm, assignment);
  }
  const missing = scenario.eligible_arms.filter((arm) => !byArm.has(arm));
  if (missing.length) throw new Error(`Missing budget assignment for: ${missing.join(", ")}`);
  const expected = canonical(scenario.budget.maxima_per_opportunity);
  for (const arm of scenario.eligible_arms) {
    const assignment = byArm.get(arm);
    if (canonical(assignment.assigned_allowance) !== expected) {
      throw new Error(`Unequal assigned budget for arm: ${arm}`);
    }
    for (const [name, maximum] of Object.entries(scenario.budget.maxima_per_opportunity)) {
      const observed = assignment.observed?.[name];
      if (!Number.isFinite(observed) || observed < 0 || observed > maximum) {
        throw new Error(`Invalid observed budget ${name} for arm: ${arm}`);
      }
    }
  }
  return true;
}
