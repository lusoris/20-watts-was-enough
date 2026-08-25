import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import {
  FIXTURE_023_EVENT_CONTRACT_VERSION,
  assertFixture023Record,
  canonical,
  fixture023ScientificPayload,
  sha256,
} from "./contract.mjs";
import {
  Pcg64Dxsm,
  assertT01PolicyInput,
  assertT02PolicyInput,
  generateT01Episodes,
  generateT02Lifecycles,
  projectT01PolicyInput,
  projectT02PolicyInput,
  validateFixture023Config,
} from "./generator.mjs";
import {
  validateDevelopmentSeeds,
  validateUnavailablePartition,
  buildFixture023CanonicalWorkUnits,
  simulateFixture023WorkUnit,
} from "./runner.mjs";

const smokeConfig = Object.freeze({
  schema: 1,
  artifact: "fixture-023",
  profile: "smoke",
  tracks: ["PLM-T01", "PLM-T02"],
  t01_episodes_per_seed: 6,
  t01_steps_per_episode: 96,
  t01_decision_center_s: 48,
  t01_decision_scale_s: 8,
  t01_flip_probability: 0.1,
  t01_missing_probability: 0.08,
  t01_latches: 32,
  t01_latch_hazard: 0.08,
  t02_lifecycles_per_seed: 8,
  t02_tasks_per_lifecycle: 24,
  t02_feature_dimensions: 8,
  state_budget_bytes: 256,
  operation_budget_per_world: 200000,
  max_loss: 100,
});

function event({ track = "PLM-T01", arm = null, previous = "0".repeat(64), sequence = 0 } = {}) {
  const t01 = track === "PLM-T01";
  const selectedArm = arm ?? (t01 ? "duration-filter-null" : "evidence-gated-reset");
  const evaluationPredictions = Array(12).fill(0.55);
  const evaluationLabels = Array.from({ length: 12 }, (_, index) => index % 2);
  const logLossSum = evaluationPredictions.reduce((sum, prediction, index) => {
    const label = evaluationLabels[index];
    return sum - label * Math.log(prediction) - (1 - label) * Math.log(1 - prediction);
  }, 0);
  const payload = {
    schema: 1,
    contract_version: FIXTURE_023_EVENT_CONTRACT_VERSION,
    artifact: "fixture-023",
    track,
    claim_id: t01 ? "C-1516" : "C-1517",
    run_id: "a".repeat(64),
    profile: "smoke",
    pack: "public-development",
    seed: t01 ? 1526001 : 1536001,
    world_index: 0,
    world_id: `w23_${(t01 ? "a" : "b").repeat(32)}`,
    arm: selectedArm,
    intervention_cell: t01 ? "interrupted-low-noise" : "rho-0.30|boundary-missing",
    input_sha256: {
      audit: "1".repeat(64),
      fixture: "2".repeat(64),
      runner: "3".repeat(64),
      configuration: "4".repeat(64),
      schema: "5".repeat(64),
      public_seeds: "7".repeat(64),
      confirmation_partition: "8".repeat(64),
      transfer_partition: "9".repeat(64),
    },
    observation_sha256: "6".repeat(64),
    units: { time: "s", state: "B", loss: "dimensionless" },
    outcome: t01 ? {
      prediction_probability: 0.6,
      target_probability: 0.7,
      target_label: 1,
      brier_loss: 0.16,
      log_loss: null,
      log_loss_sum: null,
      evaluation_count: 1,
      evaluation_predictions: null,
      evaluation_labels: null,
      premature_commitment: false,
      boundary_authenticated: null,
      boundary_state: null,
      reset_fraction: 1,
      reset_performed: true,
      abstained: false,
      unauthorized_reset: false,
      observed_loss: 16,
      finite_loss: 16,
    } : {
      prediction_probability: 0.55,
      target_probability: 0.52,
      target_label: null,
      brier_loss: null,
      log_loss: logLossSum / 12,
      log_loss_sum: logLossSum,
      evaluation_count: 12,
      evaluation_predictions: evaluationPredictions,
      evaluation_labels: evaluationLabels,
      premature_commitment: null,
      boundary_authenticated: false,
      boundary_state: "missing",
      reset_fraction: 0,
      reset_performed: false,
      abstained: true,
      unauthorized_reset: false,
      observed_loss: 100 * logLossSum / 12,
      finite_loss: 100 * logLossSum / 12,
    },
    accounting: {
      observations: t01 ? 96 : 48,
      state_budget_bytes: 256,
      state_bytes_charged: 256,
      operation_budget: 200000,
      operation_count: 1000,
      operation_count_charged: 1000,
      persistent_writes: 100,
      persistent_writes_charged: 100,
      reset_operations: t01 ? 1 : 0,
      reset_operations_charged: t01 ? 1 : 0,
      cleared_bytes: t01 ? 256 : 0,
      cleared_bytes_charged: t01 ? 256 : 0,
      rng_updates: 0,
      rng_updates_charged: 0,
    },
    failure: { failed: false, reason: null },
    authority: {
      status: "NO_RESULT",
      comparison_inference_permitted: false,
      measured_energy_present: false,
      energy_conclusion_allowed: false,
      claim_eligible: false,
      scientific_result: false,
      performance_result: false,
    },
  };
  return {
    ...payload,
    integrity: {
      sequence,
      previous_sha256: previous,
      record_sha256: sha256(`${previous}\n${canonical(payload)}`),
    },
  };
}

test("PCG64-DXSM and both public development generators are deterministic", () => {
  const leftRandom = new Pcg64Dxsm("PLM-T01|1526001");
  const rightRandom = new Pcg64Dxsm("PLM-T01|1526001");
  assert.equal(leftRandom.nextUint64(), rightRandom.nextUint64());
  assert.equal(validateFixture023Config(smokeConfig), smokeConfig);
  assert.deepEqual(
    generateT01Episodes({ seed: 1526001, config: smokeConfig }),
    generateT01Episodes({ seed: 1526001, config: smokeConfig }),
  );
  assert.deepEqual(
    generateT02Lifecycles({ seed: 1536001, config: smokeConfig }),
    generateT02Lifecycles({ seed: 1536001, config: smokeConfig }),
  );
});

test("generators exercise interruption and corrupt-boundary cells without leaking them into policy fields", () => {
  const episodes = generateT01Episodes({ seed: 1526001, config: smokeConfig });
  const lifecycles = generateT02Lifecycles({ seed: 1536001, config: smokeConfig });
  assert.equal(episodes.length, 6);
  assert.ok(episodes.some((episode) => episode.intervention_cell.includes("interrupted")));
  assert.ok(episodes.every((episode) => episode.observations.length === 96));
  assert.equal(lifecycles.length, 8);
  assert.ok(lifecycles.some((lifecycle) => !lifecycle.boundary_authenticated));
  assert.ok(lifecycles.every((lifecycle) => lifecycle.previous_tasks.length === 24));
  const t01Visible = projectT01PolicyInput(episodes[0]);
  const t02Visible = projectT02PolicyInput(lifecycles[0]);
  assert.equal(assertT01PolicyInput(t01Visible), t01Visible);
  assert.equal(assertT02PolicyInput(t02Visible), t02Visible);
  assert.match(t01Visible.world_id, /^w23_[0-9a-f]{32}$/);
  assert.match(t02Visible.world_id, /^w23_[0-9a-f]{32}$/);
  assert.equal(t01Visible.world_id.includes("1526001"), false);
  assert.equal(t02Visible.world_id.includes("1536001"), false);
  assert.equal(Object.hasOwn(t01Visible, "target_label"), false);
  assert.equal(Object.hasOwn(t01Visible, "hidden_duration_s"), false);
  assert.ok(t02Visible.evaluation_features.every((features) => Array.isArray(features)));
  assert.ok(t02Visible.previous_tasks.every((task) => !Object.hasOwn(task, "evaluator_probability")));
  const leaked = structuredClone(t02Visible);
  leaked.previous_tasks[0].evaluator_probability = 0.5;
  assert.throws(() => assertT02PolicyInput(leaked), /evaluator-only field/);
});

test("policy module has no generator/evaluator import path", async () => {
  const policySource = await readFile(new URL("./policy.mjs", import.meta.url), "utf8");
  assert.doesNotMatch(policySource, /from\s+["']\.\/generator\.mjs["']/u);
  assert.doesNotMatch(policySource, /target_label|target_probability|evaluator_probability/u);
});

test("public and unavailable seed documents have exact closed semantics", async () => {
  const root = new URL("./seeds/", import.meta.url);
  const development = JSON.parse(await readFile(new URL("development.reveal.json", root), "utf8"));
  const confirmation = JSON.parse(await readFile(new URL("confirmation.unavailable.json", root), "utf8"));
  const transfer = JSON.parse(await readFile(new URL("transfer.unavailable.json", root), "utf8"));
  assert.equal(validateDevelopmentSeeds(development), development);
  assert.equal(development.tracks["PLM-T01"].length, 64);
  assert.equal(development.tracks["PLM-T01"].at(-1), 1526064);
  assert.equal(development.tracks["PLM-T02"].length, 64);
  assert.equal(development.tracks["PLM-T02"].at(-1), 1536064);
  assert.equal(validateUnavailablePartition(confirmation, "confirmation"), confirmation);
  assert.equal(validateUnavailablePartition(transfer, "transfer"), transfer);
  const shortened = structuredClone(development);
  shortened.tracks["PLM-T01"].pop();
  assert.throws(() => validateDevelopmentSeeds(shortened), /exact derivation/);
  assert.throws(
    () => validateUnavailablePartition({ ...confirmation, seeds: [] }, "confirmation"),
    /invalid/,
  );
});

test("raw contract binds typed nulls, immutable hashes, reset closure, authority, and chain", () => {
  const first = event();
  assert.equal(assertFixture023Record(first, { sequence: 0, previousHash: "0".repeat(64) }), first);
  assert.equal(assertFixture023Record(first, {
    sequence: 0,
    previousHash: "0".repeat(64),
    expectedIdentity: {
      run_id: first.run_id,
      profile: first.profile,
      input_sha256: first.input_sha256,
    },
  }), first);
  const second = event({
    track: "PLM-T02",
    previous: first.integrity.record_sha256,
    sequence: 1,
  });
  assert.equal(assertFixture023Record(second, {
    sequence: 1,
    previousHash: first.integrity.record_sha256,
  }), second);
  const altered = structuredClone(second);
  altered.outcome.abstained = false;
  altered.integrity.record_sha256 = sha256(
    `${first.integrity.record_sha256}\n${canonical(fixture023ScientificPayload(altered))}`,
  );
  assert.throws(
    () => assertFixture023Record(altered, { sequence: 1, previousHash: first.integrity.record_sha256 }),
    /abstain|runtime contract/i,
  );
  assert.throws(() => assertFixture023Record(first, {
    expectedIdentity: {
      run_id: "b".repeat(64),
      profile: first.profile,
      input_sha256: first.input_sha256,
    },
  }), /canonical run identity/);
});

test("unknown output fields and authority escalation are rejected", () => {
  const unknown = event();
  unknown.outcome.unregistered_metric = 1;
  assert.throws(() => assertFixture023Record(unknown), /schema is not closed/);
  const authority = event();
  authority.authority.claim_eligible = true;
  authority.integrity.record_sha256 = sha256(
    `${"0".repeat(64)}\n${canonical(fixture023ScientificPayload(authority))}`,
  );
  assert.throws(() => assertFixture023Record(authority), /runtime contract/);
  const falseReset = event({ track: "PLM-T02" });
  falseReset.outcome.reset_performed = true;
  falseReset.accounting.reset_operations = 1;
  falseReset.integrity.record_sha256 = sha256(
    `${"0".repeat(64)}\n${canonical(fixture023ScientificPayload(falseReset))}`,
  );
  assert.throws(() => assertFixture023Record(falseReset), /reset flag and reset fraction/);
  const wrongLoss = event();
  wrongLoss.outcome.observed_loss = 15;
  wrongLoss.outcome.finite_loss = 15;
  wrongLoss.integrity.record_sha256 = sha256(
    `${"0".repeat(64)}\n${canonical(fixture023ScientificPayload(wrongLoss))}`,
  );
  assert.throws(() => assertFixture023Record(wrongLoss), /null\/reset contract/);
});

test("T02 NLL is independently derived from retained prediction-label pairs", () => {
  const altered = event({ track: "PLM-T02" });
  altered.outcome.evaluation_predictions[0] = 0.9;
  altered.integrity.record_sha256 = sha256(
    `${"0".repeat(64)}\n${canonical(fixture023ScientificPayload(altered))}`,
  );
  assert.throws(() => assertFixture023Record(altered), /NLL does not derive/);
});

test("typed operation failure retains labels and denominators with separate finite charges", () => {
  const retained = event({ track: "PLM-T02" });
  retained.failure = { failed: true, reason: "operation-budget-exhausted" };
  retained.outcome.abstained = false;
  retained.outcome.finite_loss = 100;
  retained.accounting.operation_count = retained.accounting.operation_budget + 1;
  retained.accounting.operation_count_charged = retained.accounting.operation_budget;
  retained.accounting.persistent_writes_charged = retained.accounting.operation_budget;
  retained.accounting.reset_operations_charged = 1;
  retained.accounting.cleared_bytes_charged = retained.accounting.state_budget_bytes;
  retained.accounting.rng_updates_charged = retained.accounting.operation_budget;
  retained.integrity.record_sha256 = sha256(
    `${"0".repeat(64)}\n${canonical(fixture023ScientificPayload(retained))}`,
  );
  assert.equal(assertFixture023Record(retained), retained);
  assert.equal(retained.outcome.evaluation_labels.length, retained.outcome.evaluation_count);
});

test("runner emits the typed failure path when a valid operation cap is exceeded", () => {
  const cappedConfig = Object.freeze({ ...smokeConfig, operation_budget_per_world: 10000 });
  const world = generateT02Lifecycles({ seed: 1536001, config: cappedConfig })[0];
  const inputSha256 = {
    audit: "1".repeat(64),
    fixture: "2".repeat(64),
    runner: "3".repeat(64),
    configuration: "4".repeat(64),
    schema: "5".repeat(64),
    public_seeds: "6".repeat(64),
    confirmation_partition: "7".repeat(64),
    transfer_partition: "8".repeat(64),
  };
  const payload = simulateFixture023WorkUnit(
    { track: "PLM-T02", seed: 1536001, world, arm: "carry-prior" },
    { profile: "smoke", config: cappedConfig },
    { run_id: "a".repeat(64), input_sha256: inputSha256 },
  );
  const record = {
    ...payload,
    integrity: {
      sequence: 0,
      previous_sha256: "0".repeat(64),
      record_sha256: sha256(`${"0".repeat(64)}\n${canonical(payload)}`),
    },
  };
  assert.equal(record.failure.reason, "operation-budget-exhausted");
  assert.equal(record.accounting.operation_count > record.accounting.operation_budget, true);
  assert.ok(record.outcome.evaluation_predictions.every(Number.isFinite));
  assert.equal(record.outcome.evaluation_labels.length, record.outcome.evaluation_count);
  assert.equal(assertFixture023Record(record), record);
});

test("operation-cap failure preserves an actually performed T02 reset", () => {
  const cappedConfig = Object.freeze({ ...smokeConfig, operation_budget_per_world: 10000 });
  const world = generateT02Lifecycles({ seed: 1536002, config: cappedConfig })[4];
  const inputSha256 = {
    audit: "1".repeat(64),
    fixture: "2".repeat(64),
    runner: "3".repeat(64),
    configuration: "4".repeat(64),
    schema: "5".repeat(64),
    public_seeds: "6".repeat(64),
    confirmation_partition: "7".repeat(64),
    transfer_partition: "8".repeat(64),
  };
  const payload = simulateFixture023WorkUnit(
    { track: "PLM-T02", seed: 1536002, world, arm: "change-point-null" },
    { profile: "smoke", config: cappedConfig },
    { run_id: "a".repeat(64), input_sha256: inputSha256 },
  );
  assert.equal(payload.failure.reason, "operation-budget-exhausted");
  assert.equal(payload.outcome.reset_fraction, 1);
  assert.equal(payload.outcome.reset_performed, true);
  assert.equal(payload.accounting.reset_operations, 1);
  assert.equal(payload.accounting.cleared_bytes, 256);
  assert.ok(Number.isFinite(payload.outcome.observed_loss));
  assert.equal(payload.outcome.finite_loss, 100);
});

test("policy and evaluator exceptions retain one typed work-unit denominator", () => {
  const world = generateT02Lifecycles({ seed: 1536001, config: smokeConfig })[0];
  const unit = { track: "PLM-T02", seed: 1536001, world, arm: "carry-prior" };
  const inputs = { profile: "smoke", config: smokeConfig };
  const identity = {
    run_id: "a".repeat(64),
    input_sha256: {
      audit: "1".repeat(64), fixture: "2".repeat(64), runner: "3".repeat(64),
      configuration: "4".repeat(64), schema: "5".repeat(64), public_seeds: "6".repeat(64),
      confirmation_partition: "7".repeat(64), transfer_partition: "8".repeat(64),
    },
  };
  const policyFailure = simulateFixture023WorkUnit(unit, inputs, identity, {
    runT02Policy: () => { throw new Error("test policy exception"); },
  });
  assert.equal(policyFailure.failure.reason, "policy-exception");
  assert.equal(policyFailure.outcome.evaluation_count, 12);
  assert.equal(policyFailure.outcome.evaluation_labels.length, 12);
  assert.equal(policyFailure.outcome.observed_loss, null);
  assert.equal(policyFailure.outcome.finite_loss, 100);
  assert.equal(policyFailure.accounting.operation_count_charged, smokeConfig.operation_budget_per_world);
  const policyRecord = {
    ...policyFailure,
    integrity: {
      sequence: 0,
      previous_sha256: "0".repeat(64),
      record_sha256: sha256(`${"0".repeat(64)}\n${canonical(policyFailure)}`),
    },
  };
  assert.equal(assertFixture023Record(policyRecord), policyRecord);

  const evaluatorFailure = simulateFixture023WorkUnit(unit, inputs, identity, {
    evaluateT02: () => { throw new Error("test evaluator exception"); },
  });
  assert.equal(evaluatorFailure.failure.reason, "evaluator-exception");
  assert.equal(evaluatorFailure.outcome.evaluation_predictions.length, 12);
  assert.ok(evaluatorFailure.outcome.evaluation_predictions.every(Number.isFinite));
  assert.equal(evaluatorFailure.outcome.evaluation_labels.length, 12);
  assert.equal(evaluatorFailure.outcome.observed_loss, null);
  assert.equal(evaluatorFailure.outcome.finite_loss, 100);
  const evaluatorRecord = {
    ...evaluatorFailure,
    integrity: {
      sequence: 0,
      previous_sha256: "0".repeat(64),
      record_sha256: sha256(`${"0".repeat(64)}\n${canonical(evaluatorFailure)}`),
    },
  };
  assert.equal(assertFixture023Record(evaluatorRecord), evaluatorRecord);
});

test("generator exceptions invalidate the pack before work-set closure", () => {
  const inputs = {
    config: smokeConfig,
    trackSeeds: { "PLM-T01": [1526001], "PLM-T02": [1536001] },
  };
  assert.throws(() => buildFixture023CanonicalWorkUnits(inputs, {
    generateT01Episodes: () => { throw new Error("test generator exception"); },
  }), /pack INVALID: generator failed before canonical work-set closure/);
  assert.throws(() => buildFixture023CanonicalWorkUnits(inputs, {
    generateT01Episodes: ({ seed, config }) => (
      generateT01Episodes({ seed, config }).slice(0, -1)
    ),
  }), /pack INVALID: generator failed before canonical work-set closure/);
  assert.throws(() => buildFixture023CanonicalWorkUnits(inputs, {
    generateT02Lifecycles: ({ seed, config }) => {
      const worlds = [...generateT02Lifecycles({ seed, config })];
      worlds[1] = { ...worlds[1], world_index: 0 };
      return worlds;
    },
  }), /pack INVALID: generator failed before canonical work-set closure/);
});
