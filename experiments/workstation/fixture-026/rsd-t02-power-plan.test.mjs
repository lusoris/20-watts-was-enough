import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import test from "node:test";

import {
  deriveFixture026RsdT02ProspectivePowerPlan,
  FIXTURE_026_RSD_T02_POWER_PLAN_VERSION,
  fixture026RsdT02BinomialLowerTail,
  fixture026RsdT02InverseNormal,
} from "./rsd-t02-power-plan.mjs";
import { FIXTURE_026_RSD_T02_REGISTERED_HYPOTHESES } from "./rsd-t02-holm4.mjs";
import { FIXTURE_026_RSD_T02_POPULATION_DESIGN_SHA256 } from "./rsd-t02-population-contract.mjs";

function sha(value) {
  return createHash("sha256").update(value).digest("hex");
}

function input(overrides = {}) {
  const familyIds = ["family-a", "family-b", "family-c"];
  return {
    schema: 1,
    contract_version: FIXTURE_026_RSD_T02_POWER_PLAN_VERSION,
    authority: "prospective-development-evaluation-variance-input-only",
    pilot_input_role: "development-evaluation-only",
    private_response_power_recalculation_permitted: false,
    pilot_variance_artifact_sha256: sha("public development-evaluation variance fixture"),
    analysis_implementation_sha256: sha("frozen four-hypothesis analyzer fixture"),
    population_design_sha256: FIXTURE_026_RSD_T02_POPULATION_DESIGN_SHA256,
    independent_unit: "system-instance",
    family_mode: "fixed-family-stratified-equal-family-weight",
    multiplicity_rule: "holm-worst-case-first-step-alpha-over-4",
    runtime_failure_disposition: "in-denominator-registered-penalty",
    familywise_alpha: 0.05,
    target_power: 0.9,
    pre_response_attrition_rate: 0.1,
    retention_assurance: 0.95,
    bootstrap_resamples: 10000,
    support_coverage_floor: 0.8,
    max_planned_instances_per_family: 10000,
    family_ids: familyIds,
    hypotheses: FIXTURE_026_RSD_T02_REGISTERED_HYPOTHESES.map((row, index) => ({
      hypothesis_id: row.hypothesis_id,
      minimum_relevant_improvement: index < 2 ? 0.1 : 0.05,
      effect_unit: index < 2 ? "nat" : "1",
      variance_unit: index < 2 ? "nat^2" : "1^2",
      variance_by_family: Object.fromEntries(familyIds.map((familyId, familyIndex) => [
        familyId,
        (index < 2 ? 0.04 : 0.01) * (1 + familyIndex * 0.1),
      ])),
    })),
    ...overrides,
  };
}

test("prospective planner exposes assumptions, units, Holm threshold and deterministic counts", () => {
  const first = deriveFixture026RsdT02ProspectivePowerPlan(input());
  const second = deriveFixture026RsdT02ProspectivePowerPlan(input());
  assert.deepEqual(first, second);
  assert.equal(first.planning_alpha_per_hypothesis, 0.0125);
  assert.equal(first.independent_unit, "system-instance");
  assert.equal(first.hypotheses.length, 4);
  assert.equal(first.planned_instances_per_family, Math.max(...first.hypotheses.map((row) => row.planned_instances_per_family)));
  assert.equal(first.planned_total_instances, first.planned_instances_per_family * 3);
  assert.deepEqual(first.planned_instance_counts_by_family, {
    "family-a": first.planned_instances_per_family,
    "family-b": first.planned_instances_per_family,
    "family-c": first.planned_instances_per_family,
  });
  assert.ok(first.hypotheses.every((row) => row.normal_approximation_power_diagnostic >= 0.89));
  assert.ok(first.hypotheses.every((row) => row.bootstrap_power_calibrated === false));
  assert.match(first.formula, /max\{2,ceil/);
  assert.match(first.bootstrap_power_alignment_status, /requires-pilot-transcript-simulation/);
  assert.ok(first.hypotheses.every((row) => row.experiment_retention_shortfall_upper_bound <= 0.05 + 1e-12));
  assert.equal(first.calculation_internal_checks_pass, true);
  assert.equal(first.prospective_power_plan_passes, false);
  assert.equal(first.plan_freeze_permitted, false);
  assert.equal(first.design_gate_satisfied, false);
  assert.equal(first.authority_blockers.length, 4);
  assert.equal(first.claim_eligible, false);
  assert.equal(first.result_label, "NO_RESULT");
});

test("smaller effects require approximately quadratic growth", () => {
  const baselineInput = input();
  const baseline = deriveFixture026RsdT02ProspectivePowerPlan(baselineInput);
  const smaller = deriveFixture026RsdT02ProspectivePowerPlan({
    ...baselineInput,
    hypotheses: baselineInput.hypotheses.map((row) => ({
      ...row,
      minimum_relevant_improvement: row.minimum_relevant_improvement / 2,
    })),
  });
  // Integer ceilings and the separate attrition ceiling keep this near, rather
  // than exactly at, the continuous 4x relationship.
  const baselineEffective = Math.max(...baseline.hypotheses.map((row) => row.effective_instances_per_family));
  const smallerEffective = Math.max(...smaller.hypotheses.map((row) => row.effective_instances_per_family));
  assert.ok(smallerEffective >= baselineEffective * 3.8);
});

test("pre-response attrition inflates counts while support coverage stays a separate gate", () => {
  const noAttrition = deriveFixture026RsdT02ProspectivePowerPlan(input({ pre_response_attrition_rate: 0 }));
  const attrition = deriveFixture026RsdT02ProspectivePowerPlan(input({ pre_response_attrition_rate: 0.2 }));
  const coverageChanged = deriveFixture026RsdT02ProspectivePowerPlan(input({ support_coverage_floor: 0.95 }));
  assert.ok(attrition.planned_instances_per_family > noAttrition.planned_instances_per_family);
  assert.equal(coverageChanged.planned_instances_per_family, deriveFixture026RsdT02ProspectivePowerPlan(input()).planned_instances_per_family);
  assert.match(coverageChanged.coverage_role, /separate mandatory gate/);
});

test("registered maximum blocks freezing without silently shrinking the design", () => {
  const report = deriveFixture026RsdT02ProspectivePowerPlan(input({ max_planned_instances_per_family: 2 }));
  assert.equal(report.prospective_power_plan_passes, false);
  assert.equal(report.plan_freeze_permitted, false);
  assert.equal(report.calculation_internal_checks_pass, false);
  assert.deepEqual(report.calculation_blockers, ["derived-count-exceeds-registered-maximum-per-family"]);
  assert.ok(report.planned_instances_per_family > 2);
});

test("planner rejects pseudo-replication, private adaptation, dropout and malformed variance inputs", () => {
  assert.throws(() => deriveFixture026RsdT02ProspectivePowerPlan(input({ independent_unit: "row" })), /system-instance/);
  assert.throws(() => deriveFixture026RsdT02ProspectivePowerPlan(input({ private_response_power_recalculation_permitted: true })), /private-response/);
  assert.throws(() => deriveFixture026RsdT02ProspectivePowerPlan(input({ runtime_failure_disposition: "drop" })), /cannot be dropped/);
  assert.throws(() => deriveFixture026RsdT02ProspectivePowerPlan(input({ pilot_variance_artifact_sha256: "not-a-hash" })), /artifact hash/);
  assert.throws(() => deriveFixture026RsdT02ProspectivePowerPlan(input({ analysis_implementation_sha256: "not-a-hash" })), /implementation hash/);
  assert.throws(() => deriveFixture026RsdT02ProspectivePowerPlan(input({ population_design_sha256: sha("wrong design") })), /population design hash/);
  assert.throws(() => deriveFixture026RsdT02ProspectivePowerPlan(input({ familywise_alpha: 0.01 })), /frozen 0.05/);
  const hostile = input();
  hostile.hypotheses[0].variance_by_family["family-a"] = Number.NaN;
  assert.throws(() => deriveFixture026RsdT02ProspectivePowerPlan(hostile), /invalid variance/);
});

test("normal quantile approximation has the required planning accuracy", () => {
  assert.ok(Math.abs(fixture026RsdT02InverseNormal(0.975) - 1.95996398454) < 1e-7);
  assert.ok(Math.abs(fixture026RsdT02InverseNormal(0.9) - 1.28155156554) < 1e-7);
  assert.equal(fixture026RsdT02InverseNormal(0.5), 0);
});

test("binomial retention assurance is stochastic rather than expected-count substitution", () => {
  const report = deriveFixture026RsdT02ProspectivePowerPlan(input({
    pre_response_attrition_rate: 0.2,
    retention_assurance: 0.99,
  }));
  for (const row of report.hypotheses) {
    const tail = fixture026RsdT02BinomialLowerTail({
      trials: row.planned_instances_per_family,
      success_probability: 0.8,
      minimum_successes: row.effective_instances_per_family,
    });
    assert.equal(tail, row.per_family_retention_shortfall_probability);
    assert.ok(tail <= (1 - 0.99) / 3 + 1e-15);
    if (row.planned_instances_per_family > row.effective_instances_per_family) {
      const previousTail = fixture026RsdT02BinomialLowerTail({
        trials: row.planned_instances_per_family - 1,
        success_probability: 0.8,
        minimum_successes: row.effective_instances_per_family,
      });
      assert.ok(previousTail > (1 - 0.99) / 3 - 1e-15);
    }
  }
});
