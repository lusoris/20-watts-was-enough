import assert from "node:assert/strict";
import test from "node:test";

import { canonicalize, sha256Hex } from "../lib/checkpoint-ledger.mjs";
import {
  FIXTURE_026_RSD_T02_EPISODES,
  FIXTURE_026_RSD_T02_RECIPES,
} from "./rsd-t02-contract.mjs";
import {
  assertFixture026RsdT02EpisodeCommand,
  assertFixture026RsdT02Transcript,
  buildFixture026RsdT02EpisodeCommand,
  buildFixture026RsdT02ExecutionDescriptors,
  buildFixture026RsdT02WorkUnits,
  fixture026RsdT02InitializationId,
  fixture026RsdT02Projection,
  generateFixture026RsdT02Transcript,
} from "./rsd-t02-generator.mjs";

const SEED = "1561001";

function rehashCommand(command) {
  const body = { ...command };
  delete body.command_id;
  command.command_id = sha256Hex(canonicalize(body));
  return command;
}

function sampleAt(transcript, timeS) {
  const sample = transcript.samples[timeS * transcript.output_rate_hz];
  assert.equal(sample?.time_s, timeS);
  return sample;
}

function transcriptFor(executionId, recipeId = "M-I1-FFL") {
  const unit = buildFixture026RsdT02WorkUnits({ profile: "smoke", seeds: [SEED] }).find(
    (candidate) => candidate.execution_id === executionId && candidate.recipe_id === recipeId,
  );
  assert.ok(unit, executionId);
  return generateFixture026RsdT02Transcript(buildFixture026RsdT02EpisodeCommand(unit));
}

test("the executable grid is exactly 45 O0 plus 130 O1 transcripts per seed", () => {
  const descriptors = buildFixture026RsdT02ExecutionDescriptors();
  const o0 = descriptors.filter(({ regime_membership: membership }) => membership[0] === "O0-MATCHED-STEP");
  const o1 = descriptors.filter(({ regime_membership: membership }) => membership[0] === "O1-FULL-PANEL");
  assert.equal(descriptors.length, 35);
  assert.equal(o0.length, 9);
  assert.equal(o1.length, 26);
  assert.deepEqual(
    new Set(o0.map(({ background_u: background, time_constant_s: tau }) => `${background}:${tau}`)),
    new Set(["0.5:0.5", "2:0.5", "8:0.5", "0.5:1", "2:1", "8:1", "0.5:2", "2:2", "8:2"]),
  );
  assert.deepEqual(
    o1.filter(({ episode_id: id }) => id.startsWith("STEP-"))
      .map(({ background_u: background }) => background),
    [0.5, 2, 8],
  );
  assert.ok(o1.filter(({ episode_id: id }) => !id.startsWith("STEP-"))
    .every(({ background_u: background, time_constant_s: tau }) => background === 2 && tau === 1));

  const units = buildFixture026RsdT02WorkUnits({ profile: "smoke", seeds: [SEED] });
  assert.equal(units.length, 175);
  assert.equal(units.filter(({ regime_membership: membership }) => membership[0] === "O0-MATCHED-STEP").length, 45);
  assert.equal(units.filter(({ regime_membership: membership }) => membership[0] === "O1-FULL-PANEL").length, 130);
  assert.equal(new Set(units.map(({ recipe_id: id }) => id)).size, FIXTURE_026_RSD_T02_RECIPES.length);
  assert.throws(
    () => buildFixture026RsdT02WorkUnits({ profile: "smoke", seeds: [SEED, SEED] }),
    /seeds are invalid/u,
  );
});

test("initialization streams use canonical uint64 little-endian seed bytes", () => {
  assert.equal(
    fixture026RsdT02InitializationId("0", 0.5, 0.5),
    "8606038a8c589cd76e2d32be52a5314fc6a7dbd699500f3235c85772e93b3d83",
  );
  assert.equal(
    fixture026RsdT02InitializationId("18446744073709551615", 8, 2),
    "00f6b8e4453c9aad2c24cc6203ef88c51d5cae0c6f94eb5d6c1fcbdcd608e310",
  );
  for (const invalid of ["00", "01", "+1", " 1", "18446744073709551616"]) {
    assert.throws(
      () => fixture026RsdT02InitializationId(invalid, 2, 1),
      /initialization coordinates/u,
    );
  }
});

test("rehashing cannot authorize an invented descriptor tuple", () => {
  const unit = buildFixture026RsdT02WorkUnits({ profile: "smoke", seeds: [SEED] })[0];
  const original = buildFixture026RsdT02EpisodeCommand(unit);
  for (const mutate of [
    (command) => { command.execution_id = "O0-invented"; },
    (command) => { command.background_u = 3; },
    (command) => { command.time_constant_s = 1.5; },
    (command) => { command.regime_membership = ["O0-MATCHED-STEP", "O0-MATCHED-STEP"]; },
    (command) => { command.regime_membership = ["O1-FULL-PANEL"]; },
  ]) {
    const mutant = structuredClone(original);
    mutate(mutant);
    rehashCommand(mutant);
    assert.throws(
      () => assertFixture026RsdT02EpisodeCommand(mutant),
      /frozen generator contract/u,
    );
  }
});

test("all 26 full-panel schedules generate 1537 closed rows with exact half-open masks", () => {
  const units = buildFixture026RsdT02WorkUnits({ profile: "smoke", seeds: [SEED] }).filter(
    ({ recipe_id: recipeId, regime_membership: membership }) => (
      recipeId === "M-I1-FFL" && membership[0] === "O1-FULL-PANEL"
    ),
  );
  assert.equal(units.length, FIXTURE_026_RSD_T02_EPISODES.length);
  for (const unit of units) {
    const transcript = assertFixture026RsdT02Transcript(
      generateFixture026RsdT02Transcript(buildFixture026RsdT02EpisodeCommand(unit)),
    );
    assert.equal(transcript.samples.length, 1537);
    assert.equal(transcript.samples.at(-1).time_s, 24);
  }

  const pulse = transcriptFor("O1-PULSE-W0P125-P0P5");
  assert.equal(sampleAt(pulse, 0).input_a_u, 4);
  assert.equal(sampleAt(pulse, 0.125).input_a_u, 2);
  assert.equal(sampleAt(pulse, 0.5).input_a_u, 4);

  const reset = transcriptFor("O1-RESET-H0");
  assert.equal(reset.schedule.opaque_state_handle, "H0");
  assert.equal(reset.samples.filter(({ state_reset_applied: applied }) => applied).length, 1);
  assert.equal(sampleAt(reset, 0.75).state_reset_applied, true);

  const freeze = transcriptFor("O1-FREEZE-H1");
  assert.equal(freeze.schedule.opaque_state_handle, "H1");
  assert.equal(sampleAt(freeze, 0.5).state_freeze_active, true);
  assert.equal(sampleAt(freeze, 1).state_freeze_active, false);

  const clamp = transcriptFor("O1-CLAMP-OUTPUT-01");
  assert.equal(sampleAt(clamp, 0.5).output_clamped, true);
  assert.equal(sampleAt(clamp, 1).output_clamped, false);

  const cross = transcriptFor("O1-RESTIM-CROSS-01");
  assert.deepEqual(
    [0, 1, 2, 3].map((timeS) => {
      const sample = sampleAt(cross, timeS);
      return [sample.input_a_u, sample.input_b_u, sample.active_channel];
    }),
    [[4, 2, "A"], [2, 2, "A"], [2, 4, "B"], [2, 2, "B"]],
  );
});

test("the actionable projection is an exact causal-view allowlist", () => {
  const transcript = transcriptFor("O1-RESET-H0", "M-NONLINEAR-FEEDBACK");
  const projection = fixture026RsdT02Projection(transcript);
  assert.deepEqual(Object.keys(projection), [
    "schema", "artifact", "track", "partition", "units", "schedule", "samples",
  ]);
  assert.deepEqual(Object.keys(projection.samples[0]), [
    "ordinal", "time_s", "input_a_u", "input_b_u", "active_channel",
    "reported_output", "output_clamped", "state_reset_applied", "state_freeze_active",
  ]);
  const body = canonicalize(projection);
  for (const forbiddenKey of [
    "seed", "profile", "run_id", "recipe_id", "equation_id", "initialization_id",
    "regime_membership", "execution_id", "episode_id", "internal_output",
    "property_vector", "equivalence_class", "certificate",
  ]) assert.ok(!body.includes(`"${forbiddenKey}"`), forbiddenKey);
  for (const forbiddenValue of [
    transcript.seed, transcript.profile, transcript.recipe_id, transcript.equation_id,
    transcript.initialization_id, transcript.execution_id, transcript.episode_id,
    ...transcript.regime_membership,
  ]) assert.ok(!body.includes(JSON.stringify(forbiddenValue)), forbiddenValue);
  assert.equal(projection.schedule.opaque_state_handle, "H0");
});
