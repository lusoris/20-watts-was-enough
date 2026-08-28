import assert from "node:assert/strict";
import test from "node:test";

import {
  FIXTURE_026_RSD_T02_PAIR_CERTIFICATES,
  FIXTURE_026_RSD_T02_PROPERTY_KEYS,
  FIXTURE_026_RSD_T02_RECIPES,
} from "./rsd-t02-contract.mjs";
import {
  aggregateFixture026RsdT02System,
  assertFixture026RsdT02Evaluation,
  evaluateFixture026RsdT02MatchedStepPair,
  evaluateFixture026RsdT02Pair,
  evaluateFixture026RsdT02Transcript,
} from "./rsd-t02-evaluator.mjs";
import { buildFixture026RsdT02FrozenResponse } from "./rsd-t02-event.mjs";
import {
  buildFixture026RsdT02EpisodeCommand,
  buildFixture026RsdT02WorkUnits,
  generateFixture026RsdT02Transcript,
} from "./rsd-t02-generator.mjs";

const SEED = "1561001";
const UNITS = buildFixture026RsdT02WorkUnits({ profile: "smoke", seeds: [SEED] });
const TRANSCRIPTS = new Map();

function transcriptFor(recipeId, executionId) {
  const key = `${recipeId}:${executionId}`;
  if (!TRANSCRIPTS.has(key)) {
    const unit = UNITS.find((candidate) => (
      candidate.recipe_id === recipeId && candidate.execution_id === executionId
    ));
    assert.ok(unit, key);
    TRANSCRIPTS.set(
      key,
      generateFixture026RsdT02Transcript(buildFixture026RsdT02EpisodeCommand(unit)),
    );
  }
  return TRANSCRIPTS.get(key);
}

function commitmentFor(transcript) {
  return buildFixture026RsdT02FrozenResponse({
    executionId: transcript.execution_id,
    projectionSha256: transcript.projection_sha256,
  });
}

test("O-GRAPH opens only after the exact actionable response commitment", () => {
  const transcript = transcriptFor("M-NONLINEAR-FEEDBACK", "O1-CLAMP-OUTPUT-01");
  assert.throws(
    () => evaluateFixture026RsdT02Transcript(transcript, null),
    /frozen response commitment/u,
  );
  const evaluation = assertFixture026RsdT02Evaluation(
    evaluateFixture026RsdT02Transcript(transcript, commitmentFor(transcript)),
  );
  assert.equal(evaluation.evaluator_id, "O-GRAPH");
  assert.equal(evaluation.evaluator_opened_after_response, true);
  assert.equal(evaluation.canonical_step_residual, null);
  assert.ok(evaluation.initialization_residual <= 1e-12);

  const wrongTranscript = transcriptFor("M-NONLINEAR-FEEDBACK", "O1-RAMP-LIN-UP-0P5");
  assert.throws(
    () => evaluateFixture026RsdT02Transcript(wrongTranscript, commitmentFor(transcript)),
    /frozen response commitment/u,
  );
  const forged = structuredClone(commitmentFor(transcript));
  forged.response.evaluator_oracle_access = true;
  assert.throws(
    () => evaluateFixture026RsdT02Transcript(transcript, forged),
    /frozen response commitment/u,
  );
});

test("canonical trace and initialization residuals are independent endpoints", () => {
  const transcript = transcriptFor("M-LOG-HIGHPASS", "O0-STEP-B8-TAU2");
  const evaluation = evaluateFixture026RsdT02Transcript(transcript, commitmentFor(transcript));
  assert.equal(evaluation.sample_count, 1537);
  assert.ok(evaluation.initialization_residual <= 1e-12);
  assert.ok(evaluation.canonical_step_residual <= 1e-10);
  assert.notEqual(evaluation.initialization_residual, evaluation.canonical_step_residual);
  assert.equal(evaluation.schedule_semantics_valid, true);
  assert.equal(evaluation.maximum_input_schedule_residual_u, 0);
});

test("the standalone evaluation validator closes recipe, equation, property, and class identity", () => {
  for (const recipe of FIXTURE_026_RSD_T02_RECIPES) {
    const transcript = transcriptFor(recipe.recipe_id, "O1-RAMP-LIN-UP-0P5");
    const evaluation = evaluateFixture026RsdT02Transcript(transcript, commitmentFor(transcript));
    assert.equal(assertFixture026RsdT02Evaluation(evaluation), evaluation);
    assert.equal(evaluation.equation_id, recipe.equation_id);
    assert.deepEqual(evaluation.property_vector, recipe.property_vector);
    assert.equal(evaluation.full_panel_equivalence_class, recipe.full_panel_equivalence_class);
  }

  const transcript = transcriptFor("M-I1-FFL", "O1-RAMP-LIN-UP-0P5");
  const evaluation = evaluateFixture026RsdT02Transcript(transcript, commitmentFor(transcript));
  for (const mutate of [
    (value) => { value.recipe_id = "FORGED"; },
    (value) => { value.equation_id = "FORGED"; },
    (value) => { value.property_vector.drive_transform = "FORGED"; },
    (value) => { value.full_panel_equivalence_class = "FORGED"; },
    (value) => {
      value.equation_id = "t02-log-difference-highpass";
      value.property_vector = structuredClone(
        FIXTURE_026_RSD_T02_RECIPES.find(({ recipe_id: id }) => id === "M-LOG-HIGHPASS")
          .property_vector,
      );
      value.full_panel_equivalence_class = "E-LOG-INPUT-MEMORY";
    },
    (value) => { value.sample_count = 1; },
  ]) {
    const mutant = structuredClone(evaluation);
    mutate(mutant);
    assert.throws(
      () => assertFixture026RsdT02Evaluation(mutant),
      /evaluation violates its closed contract/u,
    );
  }
});

test("the evaluator derives every registered pair result from its exact certificate episode", () => {
  for (const certificate of FIXTURE_026_RSD_T02_PAIR_CERTIFICATES) {
    const episodeId = certificate.separating_episode_id ?? "RAMP-LIN-UP-0P5";
    const executionId = `O1-${episodeId}`;
    const left = transcriptFor(certificate.left_recipe_id, executionId);
    const right = transcriptFor(certificate.right_recipe_id, executionId);
    const result = evaluateFixture026RsdT02Pair(left, right);
    assert.equal(result.pair_id, certificate.pair_id);
    assert.equal(result.status, certificate.full_panel_status);
    if (certificate.full_panel_status === "separated") {
      assert.ok(result.certified_lower_bound >= certificate.construction_distance_lower_bound);
      assert.ok(result.numerical_refinement_error <= certificate.construction_refinement_error_ceiling);
    } else {
      assert.ok(result.distance_infinity <= 1e-10);
      assert.equal(result.certified_lower_bound, 0);
    }
  }

  const same = transcriptFor("M-I1-FFL", "O1-RAMP-LIN-UP-0P5");
  assert.throws(() => evaluateFixture026RsdT02Pair(same, same), /distinct recipes/u);
  assert.throws(
    () => evaluateFixture026RsdT02Pair(
      transcriptFor("M-I1-FFL", "O1-RAMP-LIN-UP-0P5"),
      transcriptFor("M-NONLINEAR-FEEDBACK", "O1-RAMP-LIN-UP-0P5"),
    ),
    /frozen separator/u,
  );
});

test("matched-step equivalence has a separate conditioned-pair certificate", () => {
  for (let leftIndex = 0; leftIndex < FIXTURE_026_RSD_T02_RECIPES.length; leftIndex += 1) {
    for (let rightIndex = leftIndex + 1; rightIndex < FIXTURE_026_RSD_T02_RECIPES.length; rightIndex += 1) {
      const result = evaluateFixture026RsdT02MatchedStepPair(
        transcriptFor(FIXTURE_026_RSD_T02_RECIPES[leftIndex].recipe_id, "O0-STEP-B2-TAU1"),
        transcriptFor(FIXTURE_026_RSD_T02_RECIPES[rightIndex].recipe_id, "O0-STEP-B2-TAU1"),
      );
      assert.equal(result.matched_step_status, "equivalent");
      assert.ok(result.distance_infinity <= 1e-10);
    }
  }
  assert.throws(
    () => evaluateFixture026RsdT02MatchedStepPair(
      transcriptFor("M-I1-FFL", "O1-STEP-B2"),
      transcriptFor("M-LOG-HIGHPASS", "O1-STEP-B2"),
    ),
    /conditioned O0 pair/u,
  );
});

function completeCells(count = 3) {
  const expected = Array.from({ length: count }, (_, index) => ({
    work_key: `work-${index}`,
    initialization_id: "a".repeat(64),
  }));
  const records = expected.map((cell) => ({
    work_key: cell.work_key,
    initialization_id: cell.initialization_id,
    gate_decision: "accepted",
  }));
  return { expected, records };
}

test("system aggregation projects frozen rival sets without consulting record truth", () => {
  const { expected, records } = completeCells();
  const o0 = aggregateFixture026RsdT02System({
    expected_cells: expected,
    records,
    observation_regime_id: "O0-MATCHED-STEP",
    true_recipe_id: "M-NONLINEAR-FEEDBACK",
  });
  assert.deepEqual(o0.compatible_recipe_ids, FIXTURE_026_RSD_T02_RECIPES.map(({ recipe_id: id }) => id));
  assert.deepEqual(o0.compatible_property_values.drive_transform, ["affine-fold", "log-fold"]);
  assert.equal(o0.identifiable.drive_transform, false);
  assert.equal(o0.identifiable.causal_memory, true);

  const paired = aggregateFixture026RsdT02System({
    expected_cells: expected,
    records: records.map((record) => ({ ...record, evaluator_truth: "ignored" })),
    observation_regime_id: "O1-FULL-PANEL",
    true_recipe_id: "M-I1-FFL",
  });
  assert.deepEqual(paired.compatible_recipe_ids, ["M-I1-FFL", "M-STATIC-HIGHPASS"]);
  assert.ok(FIXTURE_026_RSD_T02_PROPERTY_KEYS.every((key) => paired.identifiable[key]));

  const singleton = aggregateFixture026RsdT02System({
    expected_cells: expected,
    records,
    observation_regime_id: "O1-FULL-PANEL",
    true_recipe_id: "M-LOG-HIGHPASS",
  });
  assert.deepEqual(singleton.compatible_recipe_ids, ["M-LOG-HIGHPASS"]);
});

test("missing, rejected, duplicate, mixed, and unexpected cells force complete abstention", () => {
  const { expected, records } = completeCells();
  const cases = [
    records.slice(1),
    records.map((record, index) => index === 0 ? { ...record, gate_decision: "rejected" } : record),
    [...records, { ...records[0] }],
    records.map((record, index) => index === 0 ? { ...record, initialization_id: "b".repeat(64) } : record),
    [...records, { work_key: "unexpected", initialization_id: "a".repeat(64), gate_decision: "accepted" }],
  ];
  for (const invalidRecords of cases) {
    const aggregate = aggregateFixture026RsdT02System({
      expected_cells: expected,
      records: invalidRecords,
      observation_regime_id: "O1-FULL-PANEL",
      true_recipe_id: "M-LOG-HIGHPASS",
    });
    assert.equal(aggregate.decision, "abstain");
    assert.ok(aggregate.reason_codes.length > 0);
    assert.ok(Object.values(aggregate.identifiable).every((value) => value === false));
  }
  assert.throws(
    () => aggregateFixture026RsdT02System({
      expected_cells: [expected[0], expected[0]],
      records,
      observation_regime_id: "O0-MATCHED-STEP",
      true_recipe_id: "M-I1-FFL",
    }),
    /duplicate key/u,
  );
});
