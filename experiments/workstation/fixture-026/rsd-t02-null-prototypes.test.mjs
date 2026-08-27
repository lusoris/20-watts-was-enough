import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import {
  FIXTURE_026_RSD_T02_CAUSAL_TRANSCRIPT_VERSION,
  FIXTURE_026_RSD_T02_NULL_PROTOTYPE_LIMITS,
  FIXTURE_026_RSD_T02_NULL_PROTOTYPE_SPECS,
  FIXTURE_026_RSD_T02_NULL_PROTOTYPE_TIE_RULES,
  assertFixture026RsdT02CausalTranscript,
  assertFixture026RsdT02NullPrototypeModel,
  decideFixture026RsdT02NullPrototype,
  runFixture026RsdT02NullPrototype,
  trainFixture026RsdT02NullPrototype,
} from "./rsd-t02-null-prototypes.mjs";

const ARMS = Object.freeze(["B-STATE-SPACE", "B-RECURRENT"]);
const PROPERTY_KEYS = Object.freeze([
  "drive_transform",
  "reported_output_feedback_edge",
  "channel_local_state",
]);

function syntheticTranscript({ driveLog, feedback, channelLocal, variant = 0 }) {
  const samples = Array.from({ length: 6 }, (_, ordinal) => {
    const wobble = 0.015 * variant + 0.01 * (ordinal % 2);
    return {
      ordinal,
      time_s: ordinal * 0.25,
      input_a_u: (driveLog ? 2 : 1) + wobble,
      input_b_u: (feedback ? 2 : 1) - wobble,
      active_channel: ordinal % 2 === 0 ? "A" : "B",
      reported_output: (channelLocal ? 1 : -1) + 0.02 * ordinal + 0.01 * variant,
      output_clamped: false,
      state_reset_applied: false,
      state_freeze_active: false,
    };
  });
  return {
    schema: 1,
    contract_version: FIXTURE_026_RSD_T02_CAUSAL_TRANSCRIPT_VERSION,
    artifact: "fixture-026",
    track: "RSD-T02",
    partition: "public-development",
    units: { input: "U", output: "1", time: "s" },
    episodes: [{ episode_ordinal: 0, samples }],
  };
}

function fitExamples() {
  const examples = [];
  for (const driveLog of [false, true]) {
    for (const feedback of [false, true]) {
      for (const channelLocal of [false, true]) {
        examples.push({
          transcript: syntheticTranscript({ driveLog, feedback, channelLocal }),
          targets: {
            drive_transform: {
              identifiable: true,
              value: driveLog ? "log-fold" : "affine-fold",
            },
            reported_output_feedback_edge: { identifiable: true, value: feedback },
            channel_local_state: { identifiable: true, value: channelLocal },
          },
        });
      }
    }
  }
  return examples;
}

const EXAMPLES = fitExamples();
let cachedModels = null;

function models() {
  cachedModels ??= Object.fromEntries(ARMS.map((armId) => [
    armId,
    trainFixture026RsdT02NullPrototype({ arm_id: armId, examples: EXAMPLES }),
  ]));
  return cachedModels;
}

function maximumPosteriorValue(response, propertyKey) {
  const posterior = response.properties[propertyKey].value_posterior;
  return Object.entries(posterior).sort((left, right) => right[1] - left[1])[0][0];
}

test("prototype arms and outputs stay subordinate to the null-maturation contract", async () => {
  const design = JSON.parse(await readFile(new URL(
    "./configs/rsd-t02-null-maturation-design.json",
    import.meta.url,
  )));
  assert.deepEqual(Object.keys(models()["B-STATE-SPACE"].property_domains), [
    ...design.target_null_contract.primary_property_keys,
  ]);
  assert.deepEqual(Object.keys(models()), design.target_null_contract.required_arm_ids);
  const response = runFixture026RsdT02NullPrototype({
    model: models()["B-STATE-SPACE"],
    transcript: EXAMPLES[0].transcript,
  });
  assert.deepEqual(Object.keys(response.properties), design.target_null_contract.primary_property_keys);
  assert.equal(response.maturity_level, 2);
  assert.equal(response.calibration_status, "uncalibrated");
  assert.equal(response.no_result, true);
});

test("both deterministic learned cores remain honest level-two NO_RESULT prototypes", () => {
  const fitted = models();
  assert.notEqual(fitted[ARMS[0]].core_kind, fitted[ARMS[1]].core_kind);
  for (const armId of ARMS) {
    const model = fitted[armId];
    assert.equal(assertFixture026RsdT02NullPrototypeModel(model), model);
    assert.equal(model.maturity_level, 2);
    assert.equal(model.maturity_status, "trainable-public-prototype");
    assert.equal(model.calibration_status, "uncalibrated");
    assert.equal(model.result_label, "NO_RESULT");
    assert.equal(model.no_result, true);
    assert.match(model.authority, /no-comparison-or-claim-authority/u);
    assert.equal(model.seed, FIXTURE_026_RSD_T02_NULL_PROTOTYPE_SPECS[armId].seed);
    assert.deepEqual(model.tie_rules, FIXTURE_026_RSD_T02_NULL_PROTOTYPE_TIE_RULES);
    assert.ok(
      model.training_work_ledger.final_objective_loss
        < model.training_work_ledger.initial_objective_loss,
    );
    assert.equal(model.training_work_ledger.measured_wall_time_ms, null);
    assert.equal(model.training_work_ledger.measured_peak_memory_bytes, null);
    assert.equal(model.training_work_ledger.measured_energy_joules, null);
  }
});

test("frozen seeds, parameter order and finite-difference fitting replay byte-identically", () => {
  for (const armId of ARMS) {
    const replay = trainFixture026RsdT02NullPrototype({ arm_id: armId, examples: EXAMPLES });
    assert.deepEqual(replay, models()[armId]);
    const left = runFixture026RsdT02NullPrototype({
      model: replay,
      transcript: EXAMPLES[7].transcript,
    });
    const right = runFixture026RsdT02NullPrototype({
      model: models()[armId],
      transcript: EXAMPLES[7].transcript,
    });
    assert.deepEqual(left, right);
  }
});

test("both prototypes learn nontrivial property signal on tiny synthetic causal packets", () => {
  for (const armId of ARMS) {
    let correct = 0;
    let total = 0;
    for (const example of EXAMPLES) {
      const response = runFixture026RsdT02NullPrototype({
        model: models()[armId],
        transcript: example.transcript,
      });
      for (const propertyKey of PROPERTY_KEYS) {
        const predicted = maximumPosteriorValue(response, propertyKey);
        const truth = String(example.targets[propertyKey].value);
        if (predicted === truth) correct += 1;
        total += 1;
      }
    }
    assert.ok(correct / total >= 2 / 3, `${armId} learned only ${correct}/${total} targets`);
    assert.ok(
      models()[armId].training_work_ledger.final_objective_loss
        <= 0.9 * models()[armId].training_work_ledger.initial_objective_loss,
    );
  }
});

test("property, joint and marginal posteriors are normalized and mutually coherent", () => {
  for (const armId of ARMS) {
    const response = runFixture026RsdT02NullPrototype({
      model: models()[armId],
      transcript: EXAMPLES[3].transcript,
    });
    assert.equal(response.maturity_level, 2);
    assert.equal(response.result_label, "NO_RESULT");
    assert.equal(response.joint_property_posterior.length, 8);
    const jointTotal = response.joint_property_posterior.reduce(
      (sum, entry) => sum + entry.probability,
      0,
    );
    assert.ok(Math.abs(jointTotal - 1) < 1e-12);
    for (const propertyKey of PROPERTY_KEYS) {
      const posterior = response.properties[propertyKey].value_posterior;
      const marginal = response.joint_marginals[propertyKey];
      assert.deepEqual(posterior, marginal);
      assert.ok(Math.abs(Object.values(posterior).reduce((sum, value) => sum + value, 0) - 1) < 1e-12);
      for (const [value, probability] of Object.entries(posterior)) {
        const recomputed = response.joint_property_posterior
          .filter((entry) => String(entry.values[propertyKey]) === value)
          .reduce((sum, entry) => sum + entry.probability, 0);
        assert.ok(Math.abs(recomputed - probability) < 1e-12);
      }
      assert.ok(response.properties[propertyKey].identifiability_probability > 0);
      assert.ok(response.properties[propertyKey].identifiability_probability < 1);
    }
    assert.equal(response.work_ledger.causal_state_updates, 6);
    assert.equal(response.work_ledger.fallback_invocations, 0);
    assert.equal(response.work_ledger.measured_energy_joules, null);
  }
});

test("the causal input is a recursive allowlist and rejects evaluator leakage", () => {
  const valid = EXAMPLES[0].transcript;
  assert.equal(assertFixture026RsdT02CausalTranscript(valid).sample_rows, 6);
  for (const mutate of [
    (value) => { value.equation_id = "leak"; },
    (value) => { value.episodes[0].samples[0].property_certificate = { truth: true }; },
    (value) => { value.episodes[0].samples[0].unknown_causal_field = 1; },
  ]) {
    const hostile = structuredClone(valid);
    mutate(hostile);
    assert.throws(
      () => assertFixture026RsdT02CausalTranscript(hostile),
      /forbidden pre-evaluator field|causal allowlist|closed public-development interface/u,
    );
  }
});

test("resource bounds and artifact integrity fail closed before unbounded work", () => {
  assert.throws(
    () => trainFixture026RsdT02NullPrototype({
      arm_id: "B-STATE-SPACE",
      examples: Array.from(
        { length: FIXTURE_026_RSD_T02_NULL_PROTOTYPE_LIMITS.maximum_training_examples + 1 },
        () => EXAMPLES[0],
      ),
    }),
    /bounded fit-only count/u,
  );
  const workHeavyTranscript = structuredClone(EXAMPLES[0].transcript);
  workHeavyTranscript.episodes[0].samples = Array.from({ length: 128 }, (_, ordinal) => ({
    ...workHeavyTranscript.episodes[0].samples[ordinal % 6],
    ordinal,
    time_s: ordinal * 0.25,
  }));
  const workHeavyExamples = Array.from({ length: 8 }, () => ({
    transcript: workHeavyTranscript,
    targets: EXAMPLES[0].targets,
  }));
  assert.throws(
    () => trainFixture026RsdT02NullPrototype({
      arm_id: "B-RECURRENT",
      examples: workHeavyExamples,
    }),
    /prospective finite-difference work exceeds/u,
  );
  const tampered = structuredClone(models()["B-STATE-SPACE"]);
  tampered.parameters[0] = Number.POSITIVE_INFINITY;
  assert.throws(
    () => runFixture026RsdT02NullPrototype({
      model: tampered,
      transcript: EXAMPLES[0].transcript,
    }),
    /level-two closed contract/u,
  );
  const outside = structuredClone(EXAMPLES[0].transcript);
  const stateSpace = models()["B-STATE-SPACE"];
  outside.episodes[0].samples[0].reported_output =
    stateSpace.support_envelope.maximum[4] + stateSpace.support_envelope.margin[4];
  const response = runFixture026RsdT02NullPrototype({
    model: stateSpace,
    transcript: outside,
  });
  assert.equal(response.support.status, "outside-fit-envelope");
  assert.equal(response.action.kind, "abstain");
  assert.ok(response.action.reason_codes.includes("OUTSIDE_FIT_ENVELOPE"));
});

test("equal non-abstention actions and exact thresholds deterministically abstain", () => {
  const tied = decideFixture026RsdT02NullPrototype({
    property_posteriors: {
      drive_transform: { "affine-fold": 0.5, "log-fold": 0.5 },
      reported_output_feedback_edge: { false: 0.5, true: 0.5 },
      channel_local_state: { false: 0.5, true: 0.5 },
    },
    identifiability_probabilities: {
      drive_transform: 1,
      reported_output_feedback_edge: 1,
      channel_local_state: 1,
    },
    support_status: "inside-fit-envelope",
  });
  assert.equal(tied.kind, "abstain");
  assert.ok(tied.reason_codes.includes("NON_ABSTENTION_ACTION_TIE"));

  const threshold = decideFixture026RsdT02NullPrototype({
    property_posteriors: {
      drive_transform: { "affine-fold": 0.75, "log-fold": 0.25 },
      reported_output_feedback_edge: { false: 0.8, true: 0.2 },
      channel_local_state: { false: 0.8, true: 0.2 },
    },
    identifiability_probabilities: {
      drive_transform: 1,
      reported_output_feedback_edge: 1,
      channel_local_state: 1,
    },
    support_status: "inside-fit-envelope",
  });
  assert.equal(threshold.kind, "abstain");
  assert.ok(threshold.reason_codes.includes("RAW_POSTERIOR_AT_OR_BELOW_THRESHOLD"));
});
