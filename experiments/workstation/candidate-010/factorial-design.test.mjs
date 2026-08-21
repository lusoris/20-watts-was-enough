import assert from "node:assert/strict";
import test from "node:test";
import {
  COMPARATOR_ARMS,
  COMPARATOR_IMPLEMENTATION,
  EQUAL_BUDGET_CONTRACT,
  accountEqualBudget,
  assertTaskFamilyHoldout,
  buildFactorialDesign,
  validateEqualBudgetAssignments,
} from "./factorial-design.mjs";

test("factorial matrix is deterministic, complete, and uses held-out task families", () => {
  const first = buildFactorialDesign();
  const second = buildFactorialDesign();
  assert.deepEqual(first, second);
  assert.equal(first.length, 4 * 12);
  assert.equal(new Set(first.map((scenario) => scenario.id)).size, first.length);

  for (const dimension of [
    "trace_revelation",
    "verifier_decision_coupling",
    "evidence_correlation",
    "verifier_informativeness",
    "reset_commit_cost",
  ]) {
    assert.ok(new Set(first.map((scenario) => scenario.factors[dimension])).size >= 2, dimension);
  }

  const holdout = assertTaskFamilyHoldout(first);
  assert.deepEqual(holdout.tuning, ["filesystem-publish", "transactional-kv"]);
  assert.deepEqual(holdout.confirmation, ["actuator-command", "signed-publication"]);
  assert.ok(first.every((scenario) => scenario.backend_implemented));
  assert.equal(new Set(first.map((scenario) => scenario.required_adapter)).size, 4);
});

test("each scenario includes registered comparators, an excluded oracle, and an equal budget", () => {
  for (const scenario of buildFactorialDesign({ splits: ["development"] })) {
    assert.deepEqual(scenario.eligible_arms.slice(0, COMPARATOR_ARMS.length), COMPARATOR_ARMS);
    assert.equal(scenario.eligible_arms.at(-1), "reset-coupled");
    assert.equal(scenario.ineligible_ceiling, "oracle-ceiling");
    assert.equal(scenario.budget, EQUAL_BUDGET_CONTRACT);
    assert.equal(scenario.execution_contract.trace_is_constructed_for_all_arms, true);
    assert.equal(scenario.execution_contract.trace_bytes_charged_to_all_arms, true);
    assert.equal(scenario.execution_contract.rollback_mechanism_ablated, false);
    assert.equal(scenario.execution_contract.rejection_always_resets, true);
  }
  assert.equal(COMPARATOR_IMPLEMENTATION.filter((row) => row.status === "implemented-policy").length, 4);
  assert.deepEqual(
    COMPARATOR_IMPLEMENTATION.filter((row) => row.status !== "implemented-policy").map((row) => ({
      id: row.id,
      status: row.status,
      implementation_id: row.implementation_id,
    })),
    [
      {
        id: "retry-rollback",
        status: "implemented-two-lifecycle-comparator",
        implementation_id: "candidate-010-two-lifecycle-retry-rollback-v1",
      },
      {
        id: "independent-verifier",
        status: "implemented-independent-verifier",
        implementation_id: "candidate-010-independent-sha512-verifier-v1",
      },
    ],
  );
});

test("equal-budget accounting refuses excess and unequal assignments", () => {
  const scenario = buildFactorialDesign({ splits: ["development"] })[0];
  const usage = {
    observations: 2,
    verifier_calls: 0,
    policy_evaluations: 1,
    staged_bytes: 512,
    durable_bytes: 0,
    wall_time_ms: 10,
  };
  const assignments = scenario.eligible_arms.map((arm) => accountEqualBudget({ scenario, arm, usage }));
  assert.equal(validateEqualBudgetAssignments(scenario, assignments), true);
  assert.ok(assignments.every((row) => row.unused_is_not_credit));

  assert.throws(
    () => accountEqualBudget({ scenario, arm: "threshold", usage: { ...usage, verifier_calls: 2 } }),
    /Budget exceeded/,
  );
  const unequal = assignments.map((assignment) => ({ ...assignment }));
  unequal[0].assigned_allowance = { ...unequal[0].assigned_allowance, observations: 99 };
  assert.throws(() => validateEqualBudgetAssignments(scenario, unequal), /Unequal assigned budget/);
  assert.throws(
    () => validateEqualBudgetAssignments(scenario, [...assignments.slice(0, -1), assignments[0]]),
    /Duplicate budget assignment/,
  );
});

test("holdout validator detects task-family leakage", () => {
  assert.throws(() => assertTaskFamilyHoldout([
    { split: "development", task_family: "leaked" },
    { split: "confirmation", task_family: "leaked" },
  ]), /leakage/);
});
