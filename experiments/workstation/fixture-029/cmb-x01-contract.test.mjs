import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { createAjv } from "../lib/ajv.mjs";

import {
  CMB_X01_CONSTRUCTION_CONTRACT_VERSION,
  CMB_X01_INTERPRETATION,
  CMB_X01_RECORD_KIND,
  assertCmbX01ConstructionRecord,
  buildCmbX01ConstructionRecord,
  canonicalCmbX01,
  cmbX01ConstructionPayload,
  sha256CmbX01,
} from "./cmb-x01-contract.mjs";
import {
  CMB_X01_ACTIONABLE_KEYS,
  CMB_X01_ARMS,
  CMB_X01_COUNTERFACTUAL_DRAW_DOMAIN,
  CMB_X01_DESTRUCTIVE_ARMS,
  CMB_X01_FAMILIES,
  CMB_X01_OUTCOME_KEYS,
  CMB_X01_RESOURCE_KEYS,
  CMB_X01_SMOKE_CONFIG,
  buildCmbX01ActionableObservation,
  decideCmbX01Action,
  generateCmbX01Worlds,
  simulateCmbX01Arm,
  validateCmbX01Config,
} from "./cmb-x01-generator.mjs";

const seed = 1_574_001;
const config = validateCmbX01Config(CMB_X01_SMOKE_CONFIG);
const worlds = generateCmbX01Worlds({ seed, config });

function simulation(arm, worldIndex = 0) {
  return simulateCmbX01Arm({ seed, world: worlds[worldIndex], arm, config });
}

function record(arm = "X01-RECRUIT", worldIndex = 0) {
  return buildCmbX01ConstructionRecord({ seed, world: worlds[worldIndex], arm, config });
}

function rehash(value) {
  value.integrity.payload_sha256 = sha256CmbX01(canonicalCmbX01(cmbX01ConstructionPayload(value)));
  return value;
}

test("configuration freezes exactly seven arms and all eight registered mechanism families", () => {
  assert.deepEqual(CMB_X01_ARMS, [
    "X01-NONE", "X01-OCCUPY", "X01-DIRECT", "X01-GC", "X01-QUEUE",
    "X01-RECRUIT", "X01-ORACLE",
  ]);
  assert.deepEqual(CMB_X01_FAMILIES, [
    "reference-pressure", "perfect-evidence", "no-harmful-targets", "no-engine",
    "zero-productive-geometry", "binary-saturation", "no-resynthesis-or-replacement",
    "cross-compartment-leakage",
  ]);
  assert.equal(worlds.length, CMB_X01_FAMILIES.length);
  assert.deepEqual(worlds.map((world) => world.generator_family), CMB_X01_FAMILIES);
  assert.throws(
    () => validateCmbX01Config({ ...CMB_X01_SMOKE_CONFIG, undeclared_budget: 1 }),
    /configuration is invalid/,
  );
  assert.throws(
    () => validateCmbX01Config({ ...CMB_X01_SMOKE_CONFIG, worlds_per_seed: 9 }),
    /configuration is invalid/,
  );
  for (const threshold of [
    "maximum_harmful_target_fraction_ppm",
    "maximum_harmful_miss_fraction_ppm",
    "maximum_queue_pending_fraction_ppm",
  ]) {
    assert.throws(
      () => validateCmbX01Config({ ...CMB_X01_SMOKE_CONFIG, [threshold]: 0 }),
      /configuration is invalid/,
      threshold,
    );
  }
});

test("actionable observations exclude evaluator truth and fail closed on added fields", () => {
  const observation = buildCmbX01ActionableObservation({
    seed, world: worlds[0], slotIndex: 0, step: 0, latentState: "harmful",
  });
  assert.deepEqual(Object.keys(observation).sort(), [...CMB_X01_ACTIONABLE_KEYS].sort());
  for (const hidden of [
    "latent_state", "productive_geometry_ppm", "mediator_leakage_ppm", "resynthesis_ppm",
  ]) assert.equal(hidden in observation, false);
  assert.equal(decideCmbX01Action("X01-RECRUIT", observation).nominate, true);
  assert.throws(
    () => decideCmbX01Action("X01-RECRUIT", { ...observation, latent_state: "harmful" }),
    /hidden or missing/,
  );
  assert.throws(
    () => decideCmbX01Action("X01-DIRECT", observation, {
      latent_state: "harmful", productive_geometry_available: true,
    }),
    /non-oracle policy/,
  );
  assert.equal(decideCmbX01Action("X01-ORACLE", observation, {
    latent_state: "harmful", productive_geometry_available: true,
  }).nominate, true);
});

test("all arms are deterministic over one arm-independent exogenous world", () => {
  const forward = Object.fromEntries(CMB_X01_ARMS.map((arm) => [arm, simulation(arm)]));
  const reverse = Object.fromEntries([...CMB_X01_ARMS].reverse().map((arm) => [arm, simulation(arm)]));
  const pairedHashes = new Set();
  const authorityHashes = new Set();
  for (const arm of CMB_X01_ARMS) {
    assert.deepEqual(reverse[arm], forward[arm]);
    pairedHashes.add(forward[arm].paired_exogenous_sha256);
    authorityHashes.add(forward[arm].action_authority_sha256);
    assert.equal(forward[arm].counterfactual_draw_domain, CMB_X01_COUNTERFACTUAL_DRAW_DOMAIN);
    assert.equal(forward[arm].counterfactual_draw_domain.includes(arm), false);
    assert.equal(forward[arm].gates.target_conservation_pass, true);
    assert.equal(forward[arm].gates.engine_conservation_pass, true);
    assert.equal(forward[arm].gates.mediator_conservation_pass, true);
    assert.equal(forward[arm].gates.resource_ledger_complete, true);
    assert.equal(forward[arm].gates.verified_mediator_reuse_pass, true);
  }
  assert.equal(pairedHashes.size, 1);
  assert.equal(authorityHashes.size, 1);
  const observation = buildCmbX01ActionableObservation({
    seed, world: worlds[0], slotIndex: 0, step: 0, latentState: "harmful",
  });
  for (let index = 0; index < 50; index += 1) decideCmbX01Action("X01-QUEUE", observation);
  assert.deepEqual(simulation("X01-RECRUIT"), forward["X01-RECRUIT"]);
});

test("counterfactual service and every reachable retry draw stay arm-independent", () => {
  for (let worldIndex = 0; worldIndex < worlds.length; worldIndex += 1) {
    const results = CMB_X01_ARMS.map((arm) => simulation(arm, worldIndex));
    assert.equal(new Set(results.map((value) => value.outcomes.potential_service_nsu)).size, 1);
    assert.equal(new Set(results.map((value) => value.paired_exogenous_sha256)).size, 1);
  }
  assert.equal(
    simulation("X01-NONE").paired_exogenous_sha256,
    "4d2d3ec08d7739a08e3db90beb85033bc57829d945023554c772df0fce6ec727",
  );
});

test("oracle productive geometry is reopened at engine service time", () => {
  const oracle = simulation("X01-ORACLE");
  assert.ok(oracle.outcomes.failed_geometry_events > 0);
  assert.equal(
    oracle.outcomes.productive_recruitment_events + oracle.outcomes.failed_geometry_events,
    oracle.outcomes.queue_service_attempts,
  );
});

test("every destructive arm uses the same bounded engine and verified-removal authority", () => {
  const authority = worlds[0].public_contract.action_authority;
  assert.equal(authority.destructive_verification_required, true);
  assert.equal(authority.permitted_destructive_action, "verified-remove-v1");
  const authorityHashes = new Set();
  for (const arm of CMB_X01_DESTRUCTIVE_ARMS) {
    const result = simulation(arm);
    authorityHashes.add(result.action_authority_sha256);
    assert.ok(result.inventories.engine.service_used <= result.inventories.engine.service_capacity);
    assert.equal(result.inventories.engine.service_used, result.outcomes.queue_service_attempts);
    assert.equal(result.inventories.engine.service_used, result.resources.engine_service_operations);
    assert.equal(result.gates.destructive_action_authority_parity, true);
  }
  assert.equal(authorityHashes.size, 1);
});

test("occupancy suppresses current harm while direct action has no durable tagged queue", () => {
  const none = simulation("X01-NONE");
  const occupy = simulation("X01-OCCUPY");
  const direct = simulation("X01-DIRECT");
  const queued = simulation("X01-QUEUE");

  assert.ok(occupy.outcomes.harmful_suppression_steps > 0);
  assert.ok(occupy.outcomes.harmful_target_steps < none.outcomes.harmful_target_steps);
  assert.ok(occupy.outcomes.useful_suppression_steps > 0);
  assert.equal(direct.outcomes.queue_pending_end, 0);
  assert.ok(direct.outcomes.direct_capacity_misses > 0);
  assert.ok(queued.outcomes.queue_pending_end > 0);
  assert.equal(queued.outcomes.direct_capacity_misses, 0);
  assert.notEqual(direct.policy_action_sha256, queued.policy_action_sha256);
});

test("diagnostic families activate perfect evidence, safe floor, absent engine, and geometry kill", () => {
  const perfect = simulation("X01-RECRUIT", 1);
  assert.equal(perfect.mechanism.perfect_evidence, true);
  assert.equal(perfect.outcomes.evidence_false_positives, 0);
  assert.equal(perfect.outcomes.evidence_false_negatives, 0);

  const noHarm = simulation("X01-RECRUIT", 2);
  assert.equal(noHarm.mechanism.harmful_targets_possible, false);
  assert.equal(noHarm.outcomes.harmful_target_steps, 0);
  assert.equal(noHarm.outcomes.harmful_removals, 0);
  assert.ok(noHarm.outcomes.useful_target_deletions > 0, "negative control must expose false action");

  const noEngine = simulation("X01-RECRUIT", 3);
  assert.equal(noEngine.mechanism.engine_available, false);
  assert.equal(noEngine.inventories.engine.service_capacity, 0);
  assert.equal(noEngine.inventories.engine.service_used, 0);
  assert.equal(noEngine.outcomes.completed_removals, 0);
  assert.equal(noEngine.outcomes.queue_wait_p95_steps, null);
  assert.equal(noEngine.outcomes.queue_wait_p99_steps, null);

  const noGeometry = simulation("X01-RECRUIT", 4);
  assert.equal(noGeometry.mechanism.productive_geometry_possible, false);
  assert.equal(noGeometry.outcomes.productive_recruitment_events, 0);
  assert.equal(noGeometry.outcomes.completed_removals, 0);
  assert.ok(noGeometry.outcomes.failed_geometry_events > 0);
});

test("nonzero harm ceilings and censored pending queues fail protected gates honestly", () => {
  const none = simulation("X01-NONE", 3);
  assert.ok(none.outcomes.harmful_target_steps > 0);
  assert.equal(none.gates.harm_gate_pass, false);
  assert.equal(none.gates.protected_gate_pass, false);

  const occupy = simulation("X01-OCCUPY", 3);
  assert.equal(occupy.gates.harm_gate_pass, true);
  assert.equal(occupy.gates.queue_tail_gate_pass, true);

  for (const arm of ["X01-GC", "X01-QUEUE", "X01-RECRUIT", "X01-ORACLE"]) {
    const pending = simulation(arm, 3);
    assert.ok(pending.outcomes.queue_pending_end > 0, arm);
    assert.equal(pending.outcomes.queue_wait_p99_steps, null, arm);
    assert.equal(pending.gates.queue_tail_gate_pass, false, arm);
    assert.equal(pending.gates.protected_gate_pass, false, arm);
  }
});

test("saturation, no-resynthesis/replacement, and leakage mechanism cells remain conserved", () => {
  const reference = simulation("X01-RECRUIT", 0);
  const saturated = simulation("X01-RECRUIT", 5);
  assert.equal(saturated.mechanism.mediator_saturation, true);
  assert.ok(saturated.inventories.mediator.created > reference.inventories.mediator.created);
  assert.ok(worlds[5].evaluator_parameters.productive_geometry_ppm
    < worlds[0].evaluator_parameters.productive_geometry_ppm);

  const noRenewal = simulation("X01-RECRUIT", 6);
  assert.equal(noRenewal.mechanism.resynthesis_enabled, false);
  assert.equal(noRenewal.mechanism.replacement_enabled, false);
  assert.equal(noRenewal.outcomes.target_resyntheses, 0);
  assert.equal(noRenewal.outcomes.target_replacements, 0);
  assert.equal(noRenewal.resources.resynthesis_operations, 0);
  assert.equal(noRenewal.resources.replacement_operations, 0);

  const leakage = simulation("X01-RECRUIT", 7);
  assert.equal(leakage.mechanism.mediator_leakage_possible, true);
  assert.ok(leakage.inventories.mediator.leaked > 0);
  assert.equal(leakage.inventories.mediator.created,
    leakage.inventories.mediator.free_end + leakage.inventories.mediator.bound_end
      + leakage.inventories.mediator.consumed + leakage.inventories.mediator.leaked);
});

test("queue p95/p99 are explicit and mediator reuse requires repeated verified completions", () => {
  for (const arm of ["X01-QUEUE", "X01-RECRUIT"]) {
    const result = simulation(arm);
    assert.notEqual(result.outcomes.queue_wait_p95_steps, null);
    assert.notEqual(result.outcomes.queue_wait_p99_steps, null);
    assert.ok(result.outcomes.queue_wait_p99_steps >= result.outcomes.queue_wait_p95_steps);
  }
  const recruited = simulation("X01-RECRUIT");
  const completions = recruited.inventories.mediator.verified_completion_counts;
  assert.equal(completions.reduce((total, value) => total + value, 0),
    recruited.outcomes.completed_removals);
  assert.equal(completions.reduce((total, value) => total + Math.max(0, value - 1), 0),
    recruited.outcomes.verified_mediator_reuses);
  assert.equal(completions.filter((value) => value > 1).length,
    recruited.outcomes.mediators_with_verified_reuse);
  assert.ok(recruited.outcomes.maximum_verified_completions_per_mediator > 1);
  assert.ok(recruited.outcomes.verified_mediator_reuses > 0);
  const noGeometry = simulation("X01-RECRUIT", 4);
  assert.equal(noGeometry.outcomes.verified_mediator_reuses, 0);
  assert.ok(noGeometry.inventories.mediator.verified_completion_counts.every((value) => value === 0));
});

test("synthetic resource and inventory ledgers are closed and contain only declared counters", () => {
  let exercisedReinsert = false;
  for (let worldIndex = 0; worldIndex < worlds.length; worldIndex += 1) {
    for (const arm of CMB_X01_ARMS) {
      const result = simulation(arm, worldIndex);
      const { outcomes, resources } = result;
      assert.deepEqual(Object.keys(resources).sort(), [...CMB_X01_RESOURCE_KEYS].sort());
      assert.deepEqual(Object.keys(outcomes).sort(), [...CMB_X01_OUTCOME_KEYS].sort());
      assert.ok(Object.values(resources).every((value) => Number.isSafeInteger(value) && value >= 0));
      assert.equal(result.inventories.target.created,
        result.inventories.target.removed + result.inventories.target.present_end);
      assert.equal(result.inventories.engine.service_capacity,
        result.inventories.engine.service_used + result.inventories.engine.service_idle);
      assert.equal(result.inventories.mediator.created,
        result.inventories.mediator.free_end + result.inventories.mediator.bound_end
          + result.inventories.mediator.consumed + result.inventories.mediator.leaked);
      assert.equal(
        resources.queue_insert_operations,
        resources.queue_pop_operations + outcomes.queue_pending_end + outcomes.direct_capacity_misses,
        `${worldIndex}/${arm} queue conservation`,
      );
      assert.equal(
        resources.bytes_read,
        (resources.evidence_reads + resources.verification_operations)
          * config.target_metadata_bytes
          + resources.queue_pop_operations * config.queue_entry_bytes,
      );
      assert.equal(
        resources.bytes_written,
        resources.queue_insert_operations * config.queue_entry_bytes
          + (outcomes.target_arrivals + outcomes.target_resyntheses + outcomes.target_replacements)
            * config.target_metadata_bytes,
      );
      assert.equal(result.gates.resource_ledger_complete, true);
      exercisedReinsert ||= resources.queue_insert_operations > outcomes.queue_entries;
    }
  }
  assert.equal(exercisedReinsert, true);
});

test("declared JSON Schema is closed and standard-validator compatible", async () => {
  const schema = JSON.parse(await readFile(
    new URL("./cmb-x01-output.schema.json", import.meta.url),
    "utf8",
  ));
  assert.equal(schema.additionalProperties, false);
  assert.equal(schema.definitions.construction.additionalProperties, false);
  assert.equal(schema.definitions.resources.additionalProperties, false);
  assert.equal(schema["x-runtime-validator"].contract_version,
    "fixture-029.cmb-x01-public-development-ledger-event.v3");
  assert.doesNotThrow(() => createAjv({ allErrors: true }).compile(schema));
});

test("construction records are honestly aggregate, non-integrated, and strictly NO_RESULT", () => {
  for (const arm of CMB_X01_ARMS) {
    const value = record(arm);
    assert.equal(value.contract_version, CMB_X01_CONSTRUCTION_CONTRACT_VERSION);
    assert.equal(value.record_kind, CMB_X01_RECORD_KIND);
    assert.equal(value.process_metadata.aggregate_record_only, true);
    assert.equal(value.process_metadata.protocol_native_action_events_present, false);
    assert.equal(value.status, "non-integrated-development-construction-only");
    assert.equal(value.result_label, "NO_RESULT");
    assert.equal(value.no_result, true);
    assert.equal(value.measured_energy_present, false);
    assert.equal(value.energy_conclusion_allowed, false);
    assert.equal(value.comparison_inference_permitted, false);
    assert.equal(value.claim_eligible, false);
    assert.equal(value.scientific_result, false);
    assert.equal(value.performance_result, false);
    assert.equal(value.interpretation, CMB_X01_INTERPRETATION);
    assert.equal(assertCmbX01ConstructionRecord(value, { config }), value);
  }
});

test("contract rejects recomputed authority, comparison, energy, conservation, and reuse lies", () => {
  const cases = [];

  const comparison = structuredClone(record());
  comparison.comparison_inference_permitted = true;
  cases.push(rehash(comparison));

  const energy = structuredClone(record());
  energy.measured_energy_present = true;
  cases.push(rehash(energy));

  const resource = structuredClone(record());
  resource.resources.logical_operations += 1;
  cases.push(rehash(resource));

  const plausibleResourceSwap = structuredClone(record());
  plausibleResourceSwap.resources.bytes_read += 1;
  plausibleResourceSwap.resources.bytes_written -= 1;
  cases.push(rehash(plausibleResourceSwap));

  const regeneratedWorldMismatch = structuredClone(record());
  regeneratedWorldMismatch.evaluator_parameters.arrival_ppm += 1;
  cases.push(rehash(regeneratedWorldMismatch));

  const target = structuredClone(record());
  target.inventories.target.present_end += 1;
  cases.push(rehash(target));

  const reuse = structuredClone(record());
  reuse.outcomes.verified_mediator_reuses += 1;
  cases.push(rehash(reuse));

  const authority = structuredClone(record("X01-DIRECT"));
  authority.public_contract.action_authority.engine_capacity_per_step += 1;
  authority.action_authority_sha256 = sha256CmbX01(
    canonicalCmbX01(authority.public_contract.action_authority),
  );
  cases.push(rehash(authority));

  const unknown = structuredClone(record());
  unknown.best_arm = "X01-RECRUIT";
  cases.push(rehash(unknown));

  for (const hostile of cases) {
    assert.throws(
      () => assertCmbX01ConstructionRecord(hostile, { config }),
      /violates its frozen contract/,
    );
  }
});
