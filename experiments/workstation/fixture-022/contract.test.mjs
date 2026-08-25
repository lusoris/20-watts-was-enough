import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import {
  FIXTURE_022_EVENT_CONTRACT_VERSION,
  assertFixture022Record,
  canonical,
  fixture022ScientificPayload,
  sha256,
} from "./contract.mjs";
import {
  Pcg64Dxsm,
  generateFixture022Worlds,
  validateFixture022Config,
  visibleFixture022Observation,
} from "./generator.mjs";
import { buildFixture022CanonicalWorkUnits } from "./runner.mjs";

const smokeConfig = Object.freeze({
  schema: 1,
  artifact: "fixture-022",
  profile: "smoke",
  grid_width_nodes: 12,
  grid_height_nodes: 12,
  worlds_per_corruption_family: 1,
  wound_radius_min_nodes: 2,
  wound_radius_max_nodes: 3,
  max_solver_rounds: 24,
  bytes_per_message: 8,
  message_budget_per_arm_bytes: 200000,
  memory_write_budget_per_arm: 144,
  common_mode_mismatch_threshold: 0.5,
  max_loss: 100,
});

function fixture(previous = "0".repeat(64), sequence = 0) {
  const payload = {
    schema: 1,
    contract_version: FIXTURE_022_EVENT_CONTRACT_VERSION,
    artifact: "fixture-022",
    track: "DEV-T01",
    run_id: "a".repeat(64),
    profile: "smoke",
    pack: "public-development",
    seed: 1516001,
    world_index: 0,
    world_id: "1516001:0",
    corruption_family: "valid",
    arm: "gated-memory-with-null-fallback",
    attempt: 0,
    units: { node: "node", count: "count", message: "B", fraction: "1" },
    input_sha256: {
      audit: "1".repeat(64),
      fixture: "2".repeat(64),
      runner: "3".repeat(64),
      config_smoke: "4".repeat(64),
      config_development: "5".repeat(64),
      schema: "6".repeat(64),
    },
    observation_sha256: "7".repeat(64),
    budget: {
      max_solver_rounds: 24,
      bytes_per_message: 8,
      message_budget_bytes: 200000,
      memory_write_budget: 144,
    },
    budget_equal_by_contract: true,
    hidden_truth_exposed: false,
    nodes_total: 144,
    wounded_nodes: 13,
    attempted_tasks: 13,
    accepted_tasks: 13,
    wrong_role_count: 1,
    unsafe_write_count: 1,
    support_miss_count: 0,
    memory_abstention_count: 0,
    fallback_invoked: false,
    corruption_detected: false,
    role_error_rate: 1 / 13,
    accepted_service_fraction: 1,
    messages_count: 120,
    message_bytes: 960,
    memory_reads: 500,
    memory_writes: 10,
    rollback_count: 3,
    solver_rounds: 4,
    converged: true,
    failure: false,
    failure_reason: null,
    failure_detail: {
      stage: null,
      signal: null,
      outcome_observation_complete: true,
      resource_observation_complete: true,
    },
    observed_loss: 73 / 13,
    loss: 73 / 13,
    charged_resources: {
      messages_count: 120,
      message_bytes: 960,
      memory_reads: 500,
      memory_writes: 10,
      solver_rounds: 4,
    },
    status: "development-smoke-only",
    measured_energy_present: false,
    energy_conclusion_allowed: false,
    claim_eligible: false,
    scientific_result: false,
    performance_result: false,
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

function rehash(record, previous = "0".repeat(64)) {
  record.integrity.record_sha256 = sha256(
    `${previous}\n${canonical(fixture022ScientificPayload(record))}`,
  );
  return record;
}

test("PCG64-DXSM has a frozen DEV-T01 public-seed sequence", () => {
  const random = new Pcg64Dxsm(1516001);
  assert.equal(random.nextUint64().toString(16), "60b9ed21511058c1");
  assert.equal(random.nextUint64().toString(16), "682911cad8f7ff9d");
});

test("grid generator is deterministic, balanced, and keeps evaluator truth outside observations", () => {
  assert.equal(validateFixture022Config(smokeConfig), smokeConfig);
  const left = generateFixture022Worlds({ seed: 1516001, config: smokeConfig });
  const right = generateFixture022Worlds({ seed: 1516001, config: smokeConfig });
  assert.deepEqual(left, right);
  assert.deepEqual(left.map((world) => world.corruption_family), [
    "valid",
    "independent-permutation",
    "local-patch-shift",
    "common-mode-shift",
  ]);
  assert.ok(left.every((world) => world.nodes.some((node) => node.wounded)));
  const validSurvivors = left[0].nodes.filter((node) => !node.wounded);
  assert.ok(validSurvivors.every((node) => node.memory_role === node.observed_role));
  const commonSurvivors = left[3].nodes.filter((node) => !node.wounded);
  assert.ok(commonSurvivors.every((node) => node.memory_role !== node.observed_role));
  const observation = visibleFixture022Observation(left[0]);
  assert.equal(Object.hasOwn(observation, "target_roles"), false);
  assert.equal(Object.hasOwn(observation, "corruption_family"), false);
  assert.ok(observation.nodes.every((node) => !Object.hasOwn(node, "target_role")));
});

test("generator exceptions and malformed packs are invalid before canonical work-set closure", () => {
  const inputs = { config: smokeConfig, seeds: [1516001] };
  assert.throws(() => buildFixture022CanonicalWorkUnits(inputs, {
    generateFixture022Worlds: () => { throw new Error("test generator exception"); },
  }), /pack INVALID: generator failed before canonical work-set closure/);
  assert.throws(() => buildFixture022CanonicalWorkUnits(inputs, {
    generateFixture022Worlds: ({ seed, config }) => (
      generateFixture022Worlds({ seed, config }).slice(0, -1)
    ),
  }), /pack INVALID: generator failed before canonical work-set closure/);
  assert.throws(() => buildFixture022CanonicalWorkUnits(inputs, {
    generateFixture022Worlds: ({ seed, config }) => {
      const worlds = [...generateFixture022Worlds({ seed, config })];
      worlds[1] = { ...worlds[1], world_index: 0 };
      return worlds;
    },
  }), /pack INVALID: generator failed before canonical work-set closure/);
  assert.throws(() => buildFixture022CanonicalWorkUnits(inputs, {
    generateFixture022Worlds: ({ seed, config }) => {
      const worlds = [...generateFixture022Worlds({ seed, config })];
      worlds[1] = {
        ...worlds[1],
        nodes: worlds[1].nodes.slice(0, -1),
      };
      return worlds;
    },
  }), /pack INVALID: generator failed before canonical work-set closure/);
});

test("closed event contract binds units, immutable inputs, authority, sequence, and hash chain", async () => {
  const first = fixture();
  assert.equal(assertFixture022Record(first, { sequence: 0, previousHash: "0".repeat(64) }), first);
  const second = fixture(first.integrity.record_sha256, 1);
  assert.equal(assertFixture022Record(second, {
    sequence: 1,
    previousHash: first.integrity.record_sha256,
  }), second);
  assert.throws(
    () => assertFixture022Record({ ...second, message_bytes: 961 }, {
      sequence: 1,
      previousHash: first.integrity.record_sha256,
    }),
    /runtime contract/,
  );
  const authorityClaim = fixture();
  authorityClaim.claim_eligible = true;
  authorityClaim.integrity.record_sha256 = sha256(
    `${"0".repeat(64)}\n${canonical(fixture022ScientificPayload(authorityClaim))}`,
  );
  assert.throws(() => assertFixture022Record(authorityClaim), /runtime contract/);
  const context = {
    run_id: first.run_id,
    profile: first.profile,
    input_sha256: first.input_sha256,
    config: smokeConfig,
  };
  assert.equal(assertFixture022Record(first, {
    sequence: 0,
    previousHash: "0".repeat(64),
    context,
  }), first);
  const forgedContext = fixture();
  forgedContext.run_id = "b".repeat(64);
  forgedContext.input_sha256.audit = "9".repeat(64);
  forgedContext.integrity.record_sha256 = sha256(
    `${"0".repeat(64)}\n${canonical(fixture022ScientificPayload(forgedContext))}`,
  );
  assert.throws(() => assertFixture022Record(forgedContext, {
    sequence: 0,
    previousHash: "0".repeat(64),
    context,
  }), /fresh run identity/);
  const alteredBudget = fixture();
  alteredBudget.budget.max_solver_rounds += 1;
  alteredBudget.integrity.record_sha256 = sha256(
    `${"0".repeat(64)}\n${canonical(fixture022ScientificPayload(alteredBudget))}`,
  );
  assert.throws(() => assertFixture022Record(alteredBudget, {
    sequence: 0,
    previousHash: "0".repeat(64),
    context,
  }), /fresh run identity/);
  const schema = JSON.parse(await readFile(new URL("./output.schema.json", import.meta.url), "utf8"));
  assert.equal(schema.additionalProperties, false);
  assert.deepEqual([...schema.required].sort(), Object.keys(fixture()).sort());
});

test("typed failures retain the denominator with finite maximum charges", () => {
  const retained = fixture();
  retained.converged = false;
  retained.failure = true;
  retained.failure_reason = "solver-nonconvergence";
  retained.failure_detail = {
    stage: "policy",
    signal: "maximum-rounds-without-convergence",
    outcome_observation_complete: true,
    resource_observation_complete: true,
  };
  retained.solver_rounds = retained.budget.max_solver_rounds;
  retained.loss = 100;
  retained.charged_resources = {
    messages_count: Math.floor(
      retained.budget.message_budget_bytes / retained.budget.bytes_per_message,
    ),
    message_bytes: Math.floor(
      retained.budget.message_budget_bytes / retained.budget.bytes_per_message,
    ) * retained.budget.bytes_per_message,
    memory_reads: retained.nodes_total * (1 + 4 * retained.budget.max_solver_rounds),
    memory_writes: retained.budget.memory_write_budget,
    solver_rounds: retained.budget.max_solver_rounds,
  };
  retained.integrity.record_sha256 = sha256(
    `${"0".repeat(64)}\n${canonical(fixture022ScientificPayload(retained))}`,
  );
  assert.equal(assertFixture022Record(retained, {
    sequence: 0,
    previousHash: "0".repeat(64),
  }), retained);
  retained.charged_resources.memory_writes -= 1;
  retained.integrity.record_sha256 = sha256(
    `${"0".repeat(64)}\n${canonical(fixture022ScientificPayload(retained))}`,
  );
  assert.throws(
    () => assertFixture022Record(retained),
    /runtime contract|maximum finite charge/,
  );
});

test("observed loss is independently derived from retained protected counts", () => {
  const forged = fixture();
  forged.observed_loss = 99;
  forged.loss = 99;
  rehash(forged);
  assert.throws(
    () => assertFixture022Record(forged),
    /observed loss does not derive/,
  );
});

test("typed failure reasons require matching causal state and cannot relabel a finite success", () => {
  const forgedNumerical = fixture();
  forgedNumerical.failure = true;
  forgedNumerical.failure_reason = "numerical-failure";
  forgedNumerical.failure_detail = {
    stage: "evaluator",
    signal: "non-finite-evaluator-output",
    outcome_observation_complete: false,
    resource_observation_complete: true,
  };
  forgedNumerical.loss = 100;
  forgedNumerical.charged_resources = {
    messages_count: 25000,
    message_bytes: 200000,
    memory_reads: 13968,
    memory_writes: 144,
    solver_rounds: 24,
  };
  rehash(forgedNumerical);
  assert.throws(
    () => assertFixture022Record(forgedNumerical),
    /typed null/,
  );

  const forgedSolver = fixture();
  forgedSolver.failure = true;
  forgedSolver.failure_reason = "solver-nonconvergence";
  forgedSolver.failure_detail = {
    stage: "policy",
    signal: "maximum-rounds-without-convergence",
    outcome_observation_complete: true,
    resource_observation_complete: true,
  };
  forgedSolver.loss = 100;
  forgedSolver.charged_resources = { ...forgedNumerical.charged_resources };
  rehash(forgedSolver);
  assert.throws(
    () => assertFixture022Record(forgedSolver),
    /solver failure has no observed maximum-round nonconvergence/,
  );
});
