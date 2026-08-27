import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import Ajv from "ajv";

import { canonicalize, sha256Hex } from "../lib/checkpoint-ledger.mjs";
import {
  FIXTURE_026_RSD_T02_NULL_MATURATION_DESIGN_SHA256,
  assertFixture026RsdT02MatureNullAuthority,
  assertFixture026RsdT02NullMaturationDesign,
  assertFixture026RsdT02NullMaturationParents,
  deriveFixture026RsdT02NullAuthority,
  summarizeFixture026RsdT02NullMaturity,
} from "./rsd-t02-null-maturation-contract.mjs";

const fixtureRoot = path.dirname(fileURLToPath(import.meta.url));

async function loadDesign() {
  const [designBytes, schemaBytes] = await Promise.all([
    readFile(path.join(fixtureRoot, "configs", "rsd-t02-null-maturation-design.json")),
    readFile(path.join(fixtureRoot, "rsd-t02-null-maturation-design.schema.json")),
  ]);
  return {
    design: JSON.parse(designBytes.toString("utf8")),
    schema: JSON.parse(schemaBytes.toString("utf8")),
  };
}

test("null maturation design is schema-valid, hash-bound, prospective and NO_RESULT", async () => {
  const { design, schema } = await loadDesign();
  const validate = new Ajv({ allErrors: true, jsonPointers: true }).compile(schema);
  assert.equal(validate(design), true, JSON.stringify(validate.errors));
  assert.equal(assertFixture026RsdT02NullMaturationDesign(design), design);
  assert.equal(
    sha256Hex(canonicalize(design)),
    FIXTURE_026_RSD_T02_NULL_MATURATION_DESIGN_SHA256,
  );
  assert.equal(
    schema["x-runtime-validator"].canonical_design_sha256,
    FIXTURE_026_RSD_T02_NULL_MATURATION_DESIGN_SHA256,
  );
  assert.equal(design.affected_fitting_permitted, false);
  assert.equal(design.comparison_inference_permitted, false);
  assert.equal(design.result_label, "NO_RESULT");
});

test("all ten exact parent artifacts are verified byte-for-byte", async () => {
  const { design } = await loadDesign();
  const entries = await Promise.all(design.parent_artifacts.map(async ({ path: relativePath }) => (
    [relativePath, await readFile(path.join(fixtureRoot, relativePath))]
  )));
  assert.equal(assertFixture026RsdT02NullMaturationParents({
    design,
    sourceBytesByPath: new Map(entries),
  }), true);

  const drifted = new Map(entries);
  drifted.set(design.parent_artifacts[0].path, Buffer.from("drift"));
  assert.throws(
    () => assertFixture026RsdT02NullMaturationParents({
      design,
      sourceBytesByPath: drifted,
    }),
    /parent bytes drifted/u,
  );
});

test("current state separates null maturity from comparison and conditional-energy gates", async () => {
  const { design } = await loadDesign();
  const summary = summarizeFixture026RsdT02NullMaturity(design);
  assert.equal(summary.highest_common_level, 1);
  assert.equal(summary.highest_common_status, "fixed-conformance-reference");
  assert.equal(summary.satisfied_gate_count, 2);
  assert.equal(summary.registered_gate_count, 21);
  assert.equal(summary.total_gate_count, 20);
  assert.equal(summary.unsatisfied_gate_count, 18);
  assert.equal(summary.unsatisfied_gates.length, 18);
  assert.equal(summary.null_maturity_gate_count, 10);
  assert.equal(summary.unsatisfied_null_maturity_gate_count, 10);
  assert.equal(summary.active_fitting_blocker_count, 4);
  assert.equal(summary.energy_comparison_gate_applicable, false);
  assert.equal(summary.energy_comparison_gate_satisfied, null);
  assert.deepEqual(summary.arms.map(({ arm_id: armId }) => armId), [
    "B-STATE-SPACE",
    "B-RECURRENT",
  ]);
  assert.equal(summary.arms.every(({ calibrated_probability_output_exists: value }) => (
    value === false
  )), true);
  assert.equal(summary.affected_fitting_permitted, false);
  assert.equal(summary.claim_eligible, false);
});

test("authority cannot be promoted by flipping a flag or relabelling a fixed reference", async () => {
  const { design } = await loadDesign();
  for (const mutate of [
    (value) => { value.mature_null_gate_satisfied = true; },
    (value) => { value.affected_fitting_permitted = true; },
    (value) => { value.comparison_inference_permitted = true; },
    (value) => { value.current_implementations[0].current_level = 5; },
    (value) => { value.promotion_gates.null_maturity[2].satisfied = true; },
    (value) => { value.fit_contract.objective_coefficient_domains.lambda_E.lower_bound_inclusive = true; },
    (value) => { value.target_null_contract.primary_property_keys.pop(); },
  ]) {
    const hostile = structuredClone(design);
    mutate(hostile);
    assert.throws(
      () => assertFixture026RsdT02NullMaturationDesign(hostile),
      /closed prospective NO_RESULT contract/u,
    );
  }
  assert.throws(
    () => assertFixture026RsdT02MatureNullAuthority(design),
    /10 null-maturity gates and 4 fitting blockers remain/u,
  );
});

test("gate authority is derived from blockers, intrinsic gates, release gates, and claim scope", () => {
  const gateState = {
    promotion_gates: {
      null_maturity: [{ gate: "intrinsic-null", satisfied: true }],
      comparison_release: [{ gate: "comparison-release", satisfied: true }],
      energy_comparison_conditional: [{ gate: "energy-meter", satisfied: false }],
    },
    active_fitting_blockers: [],
    measured_energy_claim: false,
  };
  const nonEnergy = deriveFixture026RsdT02NullAuthority(gateState);
  assert.equal(nonEnergy.affected_fitting_permitted, true);
  assert.equal(nonEnergy.mature_null_gate_satisfied, true);
  assert.equal(nonEnergy.comparison_release_gate_satisfied, true);
  assert.equal(nonEnergy.energy_comparison_gate_applicable, false);
  assert.equal(nonEnergy.energy_comparison_gate_satisfied, null);
  assert.equal(nonEnergy.claim_release_gate_satisfied, true);
  assert.equal(nonEnergy.registered_gate_count, 3);
  assert.equal(nonEnergy.applicable_gate_count, 2);

  const requestedEnergy = deriveFixture026RsdT02NullAuthority({
    ...gateState,
    measured_energy_claim: true,
  });
  assert.equal(requestedEnergy.energy_comparison_gate_applicable, true);
  assert.equal(requestedEnergy.energy_comparison_gate_satisfied, false);
  assert.equal(requestedEnergy.claim_release_gate_satisfied, false);
  assert.equal(requestedEnergy.applicable_gate_count, 3);
  assert.equal(requestedEnergy.unsatisfied_gate_count, 1);

  const passedEnergyGates = structuredClone(gateState.promotion_gates);
  passedEnergyGates.energy_comparison_conditional[0].satisfied = true;
  assert.equal(deriveFixture026RsdT02NullAuthority({
    promotion_gates: passedEnergyGates,
    active_fitting_blockers: [],
    measured_energy_claim: true,
  }).claim_release_gate_satisfied, true);

  assert.equal(deriveFixture026RsdT02NullAuthority({
    ...gateState,
    active_fitting_blockers: ["lineage-coverage-incomplete"],
  }).mature_null_gate_satisfied, false);
  const openIntrinsic = structuredClone(gateState.promotion_gates);
  openIntrinsic.null_maturity[0].satisfied = false;
  assert.equal(deriveFixture026RsdT02NullAuthority({
    promotion_gates: openIntrinsic,
    active_fitting_blockers: [],
    measured_energy_claim: false,
  }).mature_null_gate_satisfied, false);
  const openRelease = structuredClone(gateState.promotion_gates);
  openRelease.comparison_release[0].satisfied = false;
  assert.equal(deriveFixture026RsdT02NullAuthority({
    promotion_gates: openRelease,
    active_fitting_blockers: [],
    measured_energy_claim: false,
  }).comparison_release_gate_satisfied, false);
});

test("gate derivation fails closed on ambiguous claim scope or duplicate gates", () => {
  const promotionGates = {
    null_maturity: [{ gate: "same-gate", satisfied: false }],
    comparison_release: [{ gate: "same-gate", satisfied: false }],
    energy_comparison_conditional: [{ gate: "energy-meter", satisfied: false }],
  };
  assert.throws(
    () => deriveFixture026RsdT02NullAuthority({
      promotion_gates: promotionGates,
      active_fitting_blockers: [],
      measured_energy_claim: false,
    }),
    /duplicate gate/u,
  );
  const uniqueGates = structuredClone(promotionGates);
  uniqueGates.comparison_release[0].gate = "release-gate";
  assert.throws(
    () => deriveFixture026RsdT02NullAuthority({
      promotion_gates: uniqueGates,
      active_fitting_blockers: [],
      measured_energy_claim: "no",
    }),
    /explicit energy-claim boolean/u,
  );
});

test("both targets must cover every primary property through the common output interface", async () => {
  const { design } = await loadDesign();
  assert.deepEqual(design.target_null_contract.primary_property_keys, [
    "drive_transform",
    "reported_output_feedback_edge",
    "channel_local_state",
  ]);
  assert.deepEqual(design.target_null_contract.required_outputs, [
    "normalized-per-property-value-posteriors",
    "per-property-identifiability-posterior",
    "normalized-joint-property-vector-posterior-over-active-domain",
    "joint-marginals-equal-coordinate-posteriors",
    "support-status",
    "deterministic-decide-or-abstain-action",
    "complete-reason-codes",
    "complete-work-ledger",
  ]);
  assert.equal(design.target_null_contract.same_architecture_neutral_property_head, true);
  assert.deepEqual(
    design.target_null_contract.joint_property_vector_domain_before_causal_memory_activation,
    ["drive_transform", "reported_output_feedback_edge", "channel_local_state"],
  );
  assert.deepEqual(
    design.target_null_contract.joint_property_vector_domain_after_causal_memory_activation,
    ["drive_transform", "reported_output_feedback_edge", "channel_local_state", "causal_memory"],
  );
  assert.equal(design.calibration_and_abstention_contract.calibration_may_change_model_weights, false);
  assert.equal(
    design.calibration_and_abstention_contract.support_threshold_tie_rule,
    "equal-to-threshold-abstains",
  );
  assert.equal(
    design.calibration_and_abstention_contract.non_abstention_action_tie_rule,
    "equal-minimum-expected-loss-across-actions-abstains",
  );
  assert.deepEqual(design.fit_contract.objective_coefficient_domains, {
    lambda_E: {
      lower_bound: 0,
      lower_bound_inclusive: false,
      unit: "1",
      selection_role: "fit-only",
    },
    lambda_P: {
      lower_bound: 0,
      lower_bound_inclusive: true,
      unit: "1",
      selection_role: "fit-only",
    },
    lambda_R: {
      lower_bound: 0,
      lower_bound_inclusive: true,
      unit: "1",
      selection_role: "fit-only",
    },
  });
  const floorIndex = design.freeze_order.indexOf(
    "precalibration-support-coverage-floor-frozen-from-fit-only-data",
  );
  assert.equal(floorIndex + 1, design.freeze_order.indexOf("calibrator-support-and-abstention"));
  assert.equal(
    design.freeze_order.indexOf("one-pass-development-evaluation-and-pilot-variance") + 1,
    design.freeze_order.indexOf("null-work-ledger-and-resource-accounting-audited"),
  );
  assert.equal(
    design.promotion_gates.null_maturity.some(({ gate }) => (
      gate === "null-work-ledger-and-resource-accounting-audited"
    )),
    true,
  );
});
