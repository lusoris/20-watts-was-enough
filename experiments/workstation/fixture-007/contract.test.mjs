import assert from "node:assert/strict";
import test from "node:test";

import {
  FIXTURE_007_EVENT_CONTRACT_VERSION,
  assertFixture007Event,
  buildFixture007Event,
} from "./contract.mjs";

function fixture(previousHash = null, sequence = 0) {
  return buildFixture007Event({
    schema: 1,
    contract_version: FIXTURE_007_EVENT_CONTRACT_VERSION,
    artifact: "fixture-007",
    run_id: "a".repeat(64),
    sequence,
    seed: 7,
    episode: 3,
    arm: "mature-active",
    operator_version: "rank-deficient-base-plus-hidden-axis-v1",
    base_observation: 0.125,
    active_observation: 1.125,
    true_label: 1,
    decision: 1,
    abstained: false,
    active_measurement: true,
    photons: 32,
    modeled_energy_j: 0.002,
    previous_hash: previousHash,
  });
}

test("raw events bind exact content, sequence, and previous hash", () => {
  const first = fixture();
  assert.equal(assertFixture007Event(first, { previousHash: null, sequence: 0 }), first);
  const second = fixture(first.record_sha256, 1);
  assert.equal(assertFixture007Event(second, {
    previousHash: first.record_sha256,
    sequence: 1,
  }), second);
  assert.throws(
    () => assertFixture007Event({ ...second, photons: 31 }, {
      previousHash: first.record_sha256,
      sequence: 1,
    }),
    /runtime contract/,
  );
  assert.throws(
    () => assertFixture007Event(second, { previousHash: "b".repeat(64), sequence: 1 }),
    /hash chain/,
  );
});

test("active observations, resources, decisions, and abstention cannot disagree", () => {
  const active = fixture();
  const invalidActive = buildFixture007Event({
    ...Object.fromEntries(Object.entries(active).filter(([key]) => key !== "record_sha256")),
    photons: 0,
  });
  assert.throws(() => assertFixture007Event(invalidActive), /active resources/);

  const invalidAbstention = buildFixture007Event({
    ...Object.fromEntries(Object.entries(active).filter(([key]) => key !== "record_sha256")),
    abstained: true,
  });
  assert.throws(() => assertFixture007Event(invalidAbstention), /decision and abstention/);
});
