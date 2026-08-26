import assert from "node:assert/strict";
import test from "node:test";

import {
  FIXTURE_026_RSD_T02_ACTIONABLE_ARM_IDS,
  FIXTURE_026_RSD_T02_ARMS,
  FIXTURE_026_RSD_T02_COST_VECTOR_KEYS,
  FIXTURE_026_RSD_T02_EPISODES,
  FIXTURE_026_RSD_T02_EVALUATOR_ONLY_ARM_ID,
  FIXTURE_026_RSD_T02_OBSERVATION_REGIMES,
  FIXTURE_026_RSD_T02_PAIR_CERTIFICATES,
  FIXTURE_026_RSD_T02_PROPERTY_KEYS,
  FIXTURE_026_RSD_T02_RECIPES,
  FIXTURE_026_RSD_T02_REGISTRY,
  FIXTURE_026_RSD_T02_SUPPORT_AXES,
  assertFixture026RsdT02Registry,
  classifyFixture026RsdT02Pair,
  scoreFixture026RsdT02Decision,
} from "./rsd-t02-contract.mjs";

test("RSD-T02 v1 is a closed public NO_RESULT contract with two separate strata", () => {
  assert.equal(
    assertFixture026RsdT02Registry(FIXTURE_026_RSD_T02_REGISTRY),
    FIXTURE_026_RSD_T02_REGISTRY,
  );
  assert.deepEqual(FIXTURE_026_RSD_T02_REGISTRY.strata, ["T02-MECH", "T02-FLOOR"]);
  assert.equal(FIXTURE_026_RSD_T02_REGISTRY.authority, "contract-foundation-only");
  assert.equal(FIXTURE_026_RSD_T02_REGISTRY.partition, "public-development");
  assert.equal(
    FIXTURE_026_RSD_T02_REGISTRY.information_cut_status,
    "registered-projection-no-secret-custody",
  );
  assert.equal(FIXTURE_026_RSD_T02_REGISTRY.comparison_authority, false);
  assert.equal(FIXTURE_026_RSD_T02_REGISTRY.result_authority, "NO_RESULT");
  assert.throws(() => assertFixture026RsdT02Registry({
    ...FIXTURE_026_RSD_T02_REGISTRY,
    future_field: true,
  }), /unknown fields/u);
  for (const mutation of [
    { strata: ["OTHER"] },
    { thresholds: { ...FIXTURE_026_RSD_T02_REGISTRY.thresholds, matched_step_supremum_ceiling: 99 } },
    { recipes: Array(5).fill(FIXTURE_026_RSD_T02_REGISTRY.recipes[0]) },
    { arms: Array(10).fill(FIXTURE_026_RSD_T02_REGISTRY.arms[0]) },
    { floor: { ...FIXTURE_026_RSD_T02_REGISTRY.floor, models: [{ model_id: "x" }] } },
  ]) {
    assert.throws(() => assertFixture026RsdT02Registry({
      ...FIXTURE_026_RSD_T02_REGISTRY,
      ...mutation,
    }), /unknown fields, values, or authority/u);
  }
});

test("five recipes share the canonical step but property vectors are equation-qualified", () => {
  assert.equal(FIXTURE_026_RSD_T02_RECIPES.length, 5);
  assert.ok(FIXTURE_026_RSD_T02_RECIPES.every((recipe) => (
    recipe.provenance_role === "evaluator-only"
    && recipe.matched_step_equivalence_class === "E-STEP-ALL"
    && Object.keys(recipe.property_vector).length === FIXTURE_026_RSD_T02_PROPERTY_KEYS.length
    && FIXTURE_026_RSD_T02_PROPERTY_KEYS.every((key) => (
      Object.hasOwn(recipe.property_vector, key)
    ))
  )));
  const iffl = FIXTURE_026_RSD_T02_RECIPES.find(({ recipe_id: id }) => id === "M-I1-FFL");
  const staticHighpass = FIXTURE_026_RSD_T02_RECIPES.find(
    ({ recipe_id: id }) => id === "M-STATIC-HIGHPASS",
  );
  assert.deepEqual(iffl.property_vector, staticHighpass.property_vector);
  assert.equal(iffl.full_panel_equivalence_class, staticHighpass.full_panel_equivalence_class);
});

test("arm registry contains nine ineligible actionable arms and one excluded oracle", () => {
  assert.equal(FIXTURE_026_RSD_T02_ACTIONABLE_ARM_IDS.length, 9);
  assert.deepEqual(FIXTURE_026_RSD_T02_ACTIONABLE_ARM_IDS, [
    "A-RAW",
    "B-STATIC-DIV",
    "B-STREAM",
    "B-LOG-RATIO",
    "B-DIFFERENCE",
    "B-STATE-SPACE",
    "B-RECURRENT",
    "C-MECHANISM-BANK",
    "C-DUAL",
  ]);
  assert.equal(FIXTURE_026_RSD_T02_EVALUATOR_ONLY_ARM_ID, "O-GRAPH");
  assert.equal(FIXTURE_026_RSD_T02_ARMS.length, 10);
  assert.ok(FIXTURE_026_RSD_T02_ARMS.every((arm) => (
    arm.current_parity_eligible === false && arm.current_ranking_eligible === false
  )));
  assert.equal(FIXTURE_026_RSD_T02_ARMS.at(-1).role, "evaluator-only");
});

test("full intervention panel has the frozen 3+6+8+2+2+1+2+2 construction", () => {
  assert.equal(FIXTURE_026_RSD_T02_EPISODES.length, 26);
  const counts = Object.groupBy(
    FIXTURE_026_RSD_T02_EPISODES,
    ({ intervention_family: family }) => family,
  );
  assert.equal(counts["canonical-step"].length, 3);
  assert.equal(counts["repeated-pulse"].length, 6);
  assert.equal(counts.ramp.length, 8);
  assert.equal(counts["opaque-state-reset"].length, 2);
  assert.equal(counts["opaque-state-freeze"].length, 2);
  assert.equal(counts["reported-output-clamp"].length, 1);
  assert.equal(counts["interrupted-ramp-hold"].length, 2);
  assert.equal(counts.restimulation.length, 2);
  assert.ok(counts["repeated-pulse"].every((row) => row.pulse_width_s < row.period_s));
  assert.equal(new Set(FIXTURE_026_RSD_T02_EPISODES.map((row) => row.episode_id)).size, 26);
  assert.ok(FIXTURE_026_RSD_T02_EPISODES.every((row) => (
    Number.isFinite(row.background_u)
    && row.background_u > 0
    && row.schedule
    && typeof row.schedule.kind === "string"
  )));
  assert.deepEqual(
    FIXTURE_026_RSD_T02_EPISODES.find(({ episode_id: id }) => id === "CLAMP-OUTPUT-01").schedule,
    {
      kind: "step-with-output-clamp",
      change_time_s: 0,
      from_fold: 1,
      to_fold: 2,
      intervention_start_s: 0.5,
      intervention_end_s: 1,
      forced_reported_output: 0,
    },
  );
});

test("observation regimes and typed costs retain privileged acquisition dimensions", () => {
  assert.deepEqual(FIXTURE_026_RSD_T02_OBSERVATION_REGIMES.map((regime) => [
    regime.observation_regime_id,
    regime.episode_count,
    regime.sample_rows_ceiling,
    regime.maximum_additional_queries,
    regime.maximum_internal_queries,
  ]), [
    ["O0-MATCHED-STEP", 3, 4611, 0, 0],
    ["O1-FULL-PANEL", 26, 39962, 23, 5],
    ["O2-SELECT6", 9, 13833, 6, 2],
  ]);
  assert.ok(FIXTURE_026_RSD_T02_COST_VECTOR_KEYS.includes("internal_resets"));
  assert.ok(FIXTURE_026_RSD_T02_COST_VECTOR_KEYS.includes("internal_freezes"));
  assert.ok(FIXTURE_026_RSD_T02_COST_VECTOR_KEYS.includes("output_clamps"));
  assert.ok(FIXTURE_026_RSD_T02_COST_VECTOR_KEYS.includes("later_joules"));
  assert.deepEqual(FIXTURE_026_RSD_T02_SUPPORT_AXES, [
    "input_domain",
    "transformation",
    "instrument",
    "initialization",
    "causal_observation",
    "evaluation_window",
  ]);
});

test("pair matrix covers every recipe pair and retains one exact operational equivalence", () => {
  assert.equal(FIXTURE_026_RSD_T02_PAIR_CERTIFICATES.length, 10);
  assert.equal(new Set(FIXTURE_026_RSD_T02_PAIR_CERTIFICATES.map((row) => row.pair_id)).size, 10);
  assert.ok(FIXTURE_026_RSD_T02_PAIR_CERTIFICATES.every((row) => (
    row.matched_step_status === "equivalent"
  )));
  const equivalent = FIXTURE_026_RSD_T02_PAIR_CERTIFICATES.filter(
    ({ full_panel_status: status }) => status === "equivalent",
  );
  assert.equal(equivalent.length, 1);
  assert.equal(equivalent[0].property_scope, "shared-operational-property-vector");
  assert.equal(equivalent[0].separating_episode_id, null);
});

test("pair classification is thresholded and fails to invent resolution", () => {
  assert.equal(classifyFixture026RsdT02Pair({
    distance_infinity: 0,
    numerical_refinement_error: 0,
    analytic_equivalence: true,
  }), "equivalent");
  assert.equal(classifyFixture026RsdT02Pair({
    distance_infinity: 0.01,
    numerical_refinement_error: 1e-9,
  }), "separated");
  assert.equal(classifyFixture026RsdT02Pair({
    distance_infinity: 1e-3,
    numerical_refinement_error: 1e-8,
  }), "unresolved");
  assert.equal(classifyFixture026RsdT02Pair({
    distance_infinity: 0.01,
    numerical_refinement_error: 1e-6,
  }), "unresolved");
  assert.equal(classifyFixture026RsdT02Pair({
    distance_infinity: 1e-5,
    numerical_refinement_error: 1e-9,
  }), "unresolved");
  assert.throws(() => classifyFixture026RsdT02Pair({
    distance_infinity: Number.NaN,
    numerical_refinement_error: 0,
  }), /invalid/u);
  assert.throws(() => classifyFixture026RsdT02Pair({
    distance_infinity: 1e-4,
    numerical_refinement_error: 0,
    analytic_equivalence: true,
  }), /conflicts/u);
});

test("decision score rewards abstention only on a certified non-singleton set", () => {
  const correct = scoreFixture026RsdT02Decision({
    identifiable: true,
    identifiability_probability: 0.9,
    true_value: "affine-fold",
    posterior_probability_true_value: 0.8,
    action: "decide",
    predicted_value: "affine-fold",
  });
  assert.equal(correct.decision_loss, 0);
  assert.ok(correct.calibration_loss_nats > 0);

  const cautious = scoreFixture026RsdT02Decision({
    identifiable: true,
    identifiability_probability: 0.5,
    true_value: true,
    posterior_probability_true_value: 0.5,
    action: "abstain",
  });
  assert.equal(cautious.decision_loss, 0.25);

  const requiredAbstention = scoreFixture026RsdT02Decision({
    identifiable: false,
    identifiability_probability: 0.1,
    true_value: null,
    posterior_probability_true_value: 0.5,
    action: "abstain",
  });
  assert.equal(requiredAbstention.decision_loss, 0);
  assert.equal(requiredAbstention.correct_abstention, true);

  const guessedHiddenLabel = scoreFixture026RsdT02Decision({
    identifiable: false,
    identifiability_probability: 0.9,
    true_value: null,
    posterior_probability_true_value: 0.5,
    action: "decide",
    predicted_value: "M-I1-FFL",
  });
  assert.equal(guessedHiddenLabel.decision_loss, 1);
});
