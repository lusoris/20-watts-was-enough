import assert from "node:assert/strict";
import test from "node:test";

import {
  FIXTURE_012_EVENT_CONTRACT_VERSION,
  assertFixture012Event,
  buildFixture012Event,
} from "./contract.mjs";

function event(overrides = {}) {
  return buildFixture012Event({
    schema: 1,
    contract_version: FIXTURE_012_EVENT_CONTRACT_VERSION,
    artifact: "fixture-012",
    run_id: "a".repeat(64),
    sequence: 0,
    seed: 1217,
    study: 0,
    arm: "mature-randomized-counterbalanced",
    estimand: "candidate-minus-baseline-layout-population-mean-v1",
    setup_policy: "randomized-counterbalanced-layout-population",
    observation_id: "randomized-s0-l0-i0-r0-candidate",
    layout_slot: 0,
    layout_id: 0,
    invocation: 0,
    repeat: 0,
    variant: "candidate",
    run_position: 0,
    latency_ns: 940000,
    true_population_effect_fraction: 0,
    modeled_work_units: 1000,
    modeled_energy_j: 0.000002,
    previous_hash: null,
    ...overrides,
  });
}

function rebuild(record, overrides) {
  const { record_sha256: ignored, ...body } = record;
  void ignored;
  return buildFixture012Event({ ...body, ...overrides });
}

test("raw events bind exact content, sequence, and the null chain origin", () => {
  const first = event();
  assert.equal(assertFixture012Event(first, { previousHash: null, sequence: 0 }), first);
  const second = event({
    sequence: 1,
    observation_id: "randomized-s0-l0-i0-r0-baseline",
    variant: "baseline",
    run_position: 1,
    previous_hash: first.record_sha256,
  });
  assert.equal(assertFixture012Event(second, {
    previousHash: first.record_sha256,
    sequence: 1,
  }), second);
  assert.throws(
    () => assertFixture012Event({ ...second, latency_ns: second.latency_ns + 1 }, {
      previousHash: first.record_sha256,
      sequence: 1,
    }),
    /runtime contract/,
  );
  assert.throws(
    () => assertFixture012Event(second, { previousHash: "b".repeat(64), sequence: 1 }),
    /hash chain/,
  );
  assert.throws(
    () => assertFixture012Event(rebuild(first, { previous_hash: "b".repeat(64) }), {
      previousHash: null,
      sequence: 0,
    }),
    /hash chain/,
  );
});

test("the runtime contract refuses unknown fields and arm-policy-layout mismatches", () => {
  const valid = event();
  assert.throws(() => assertFixture012Event({ ...valid, undeclared: true }), /unknown fields/);
  assert.throws(
    () => assertFixture012Event(rebuild(valid, { setup_policy: "fixed-single-pair-repeated" })),
    /runtime contract/,
  );
  assert.throws(
    () => assertFixture012Event(rebuild(valid, { layout_id: 1 })),
    /runtime contract/,
  );
});

test("truth, fixed-order semantics, and modeled resources fail closed", () => {
  const valid = event();
  assert.throws(
    () => assertFixture012Event(rebuild(valid, { true_population_effect_fraction: -0.06 })),
    /runtime contract/,
  );
  const fixed = event({
    arm: "fixed-layout-negative-control",
    setup_policy: "fixed-single-pair-repeated",
    observation_id: "fixed-s0-l0-i0-r0-baseline",
    variant: "baseline",
    run_position: 0,
  });
  assert.throws(() => assertFixture012Event(fixed), /runtime contract/);
  assert.throws(
    () => assertFixture012Event(rebuild(valid, { modeled_work_units: 0 })),
    /runtime contract/,
  );
  assert.throws(
    () => assertFixture012Event(rebuild(valid, { modeled_energy_j: 0 })),
    /runtime contract/,
  );
});
