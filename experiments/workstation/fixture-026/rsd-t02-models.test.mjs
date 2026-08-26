import assert from "node:assert/strict";
import test from "node:test";

import {
  FIXTURE_026_RSD_T02_PAIR_CERTIFICATES,
  FIXTURE_026_RSD_T02_RECIPES,
} from "./rsd-t02-contract.mjs";
import {
  deriveFixture026RsdT02PropertiesFromEquation,
  fixture026RsdT02CanonicalStep,
  fixture026RsdT02OpaqueStatePermutation,
  initialFixture026RsdT02State,
  simulateFixture026RsdT02CertificateEpisode,
  simulateFixture026RsdT02Episode,
} from "./rsd-t02-models.mjs";

function maximumResidual(samples, expected) {
  return Math.max(...samples.map((sample) => Math.abs(sample.output - expected(sample.time_s))));
}

test("all five initialized recipes match the exact canonical step", () => {
  for (const timeConstantS of [0.5, 1, 2]) {
    const traces = FIXTURE_026_RSD_T02_RECIPES.map(({ recipe_id: recipeId }) => (
      simulateFixture026RsdT02Episode({
        recipe_id: recipeId,
        horizon_s: 4,
        time_constant_s: timeConstantS,
        input_at: () => 2,
      })
    ));
    for (const trace of traces) {
      assert.equal(trace.result, "NO_RESULT");
      assert.ok(maximumResidual(
        trace.samples,
        (timeS) => fixture026RsdT02CanonicalStep(timeS, timeConstantS),
      ) < 1e-12);
    }
    const reference = traces[0].samples;
    for (const trace of traces.slice(1)) {
      assert.ok(Math.max(...trace.samples.map((sample, index) => (
        Math.abs(sample.output - reference[index].output)
      ))) < 1e-12);
    }
  }
});

test("I1-FFL and static affine high-pass are operationally isomorphic", () => {
  const inputAt = (timeS) => 1.6 + 0.25 * Math.sin(1.7 * timeS) + 0.1 * Math.sin(4.3 * timeS);
  const iffl = simulateFixture026RsdT02Episode({
    recipe_id: "M-I1-FFL",
    horizon_s: 4,
    input_at: inputAt,
  });
  const staticHighpass = simulateFixture026RsdT02Episode({
    recipe_id: "M-STATIC-HIGHPASS",
    horizon_s: 4,
    input_at: inputAt,
  });
  assert.ok(Math.max(...iffl.samples.map((sample, index) => (
    Math.abs(sample.output - staticHighpass.samples[index].output)
  ))) < 1e-12);
  assert.deepEqual(
    deriveFixture026RsdT02PropertiesFromEquation("t02-iffl-affine-reference"),
    deriveFixture026RsdT02PropertiesFromEquation("t02-static-affine-highpass"),
  );
});

test("reported-output clamp separates output feedback from input-driven memory", () => {
  const outputClampedAt = (timeS) => timeS >= 0.5 && timeS < 1;
  const feedback = simulateFixture026RsdT02Episode({
    recipe_id: "M-NONLINEAR-FEEDBACK",
    horizon_s: 2,
    input_at: () => 2,
    output_clamped_at: outputClampedAt,
  });
  const iffl = simulateFixture026RsdT02Episode({
    recipe_id: "M-I1-FFL",
    horizon_s: 2,
    input_at: () => 2,
    output_clamped_at: outputClampedAt,
  });
  const releaseIndex = feedback.samples.findIndex(({ time_s: timeS }) => timeS > 1);
  assert.ok(releaseIndex > 0);
  assert.ok(feedback.samples[releaseIndex].output - iffl.samples[releaseIndex].output > 0.2);
});

test("cross-channel restimulation separates local from shared reference state", () => {
  const activeChannelAt = (timeS) => (timeS < 1 ? "A" : "B");
  const inputAt = () => ({ A: 2, B: 2 });
  const receptor = simulateFixture026RsdT02Episode({
    recipe_id: "M-RECEPTOR-MEMORY",
    horizon_s: 2,
    input_at: inputAt,
    active_channel_at: activeChannelAt,
  });
  const shared = simulateFixture026RsdT02Episode({
    recipe_id: "M-I1-FFL",
    horizon_s: 2,
    input_at: inputAt,
    active_channel_at: activeChannelAt,
  });
  const switchIndex = receptor.samples.findIndex(({ time_s: timeS }) => timeS === 1);
  assert.ok(switchIndex > 0);
  assert.ok(receptor.samples[switchIndex].output - shared.samples[switchIndex].output > 0.6);
});

test("a noncanonical fold separates log and affine drive transforms", () => {
  const affine = simulateFixture026RsdT02Episode({
    recipe_id: "M-STATIC-HIGHPASS",
    horizon_s: 1,
    input_at: () => 4,
  });
  const logarithmic = simulateFixture026RsdT02Episode({
    recipe_id: "M-LOG-HIGHPASS",
    horizon_s: 1,
    input_at: () => 4,
  });
  assert.equal(affine.samples[0].output, 3);
  assert.equal(logarithmic.samples[0].output, 2);
});

test("every declared separating episode reproduces its pair margin", () => {
  const cache = new Map();
  const traceFor = (recipeId, episodeId, internalStepS) => {
    const key = `${recipeId}::${episodeId}::${internalStepS}`;
    if (!cache.has(key)) {
      cache.set(key, simulateFixture026RsdT02CertificateEpisode({
        recipe_id: recipeId,
        episode_id: episodeId,
        internal_step_s: internalStepS,
      }));
    }
    return cache.get(key);
  };
  const distance = (left, right) => Math.max(...left.samples.map((sample, index) => (
    Math.abs(sample.output - right.samples[index].output)
  )));
  for (const certificate of FIXTURE_026_RSD_T02_PAIR_CERTIFICATES) {
    if (certificate.full_panel_status !== "separated") continue;
    const coarseDistance = distance(
      traceFor(certificate.left_recipe_id, certificate.separating_episode_id, 1 / 1024),
      traceFor(certificate.right_recipe_id, certificate.separating_episode_id, 1 / 1024),
    );
    const refinedDistance = distance(
      traceFor(certificate.left_recipe_id, certificate.separating_episode_id, 1 / 2048),
      traceFor(certificate.right_recipe_id, certificate.separating_episode_id, 1 / 2048),
    );
    assert.ok(
      coarseDistance >= certificate.construction_distance_lower_bound,
      `${certificate.pair_id} missed its construction bound: ${coarseDistance}`,
    );
    assert.ok(
      Math.abs(coarseDistance - refinedDistance)
        <= certificate.construction_refinement_error_ceiling,
      `${certificate.pair_id} missed its refinement ceiling`,
    );
  }
});

test("every recipe has two states and opaque handles reveal no state count", () => {
  for (const { recipe_id: recipeId } of FIXTURE_026_RSD_T02_RECIPES) {
    assert.equal(initialFixture026RsdT02State(recipeId).length, 2);
  }
  assert.deepEqual(fixture026RsdT02OpaqueStatePermutation("00".repeat(32)), [0, 1]);
  assert.deepEqual(fixture026RsdT02OpaqueStatePermutation(`${"00".repeat(31)}01`), [1, 0]);
  assert.throws(() => fixture026RsdT02OpaqueStatePermutation("recipe-name"), /SHA-256/u);
});
