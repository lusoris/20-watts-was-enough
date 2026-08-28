import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import {
  FIXTURE_029_EVENT_CONTRACT_VERSION, FIXTURE_029_INTERPRETATION,
  assertFixture029Record, canonical, fixture029ScientificPayload, sha256,
} from "./contract.mjs";
import {
  FIXTURE_029_ACTIONABLE_KEYS, FIXTURE_029_ARMS, buildFixture029ActionableObservation,
  decideFixture029Action, generateFixture029Worlds, simulateFixture029Arm,
  validateFixture029Config,
} from "./generator.mjs";

const config = validateFixture029Config(JSON.parse(
  await readFile(new URL("./configs/smoke.json", import.meta.url), "utf8"),
));

function event(arm = "X04-PHASE", worldIndex = 0, previous = "0".repeat(64), sequence = 0) {
  const seed = 1580001;
  const world = generateFixture029Worlds({ seed, config })[worldIndex];
  const simulation = simulateFixture029Arm({ seed, world, arm, config });
  const p = world.evaluator_parameters;
  const payload = {
    schema: 1,
    contract_version: FIXTURE_029_EVENT_CONTRACT_VERSION,
    artifact: "fixture-029",
    track: "CMB-X04",
    claim_scope: ["C-1580"],
    run_id: "a".repeat(64),
    profile: "smoke",
    pack: "public-development",
    seed,
    world_index: world.world_index,
    world_id: world.world_id,
    arm,
    attempt: 0,
    units: { artifact: "artifact", service: "NSU", time: "step", bytes: "B", energy: "not-measured" },
    input_sha256: Object.fromEntries([
      "audit", "fixture", "contract", "generator", "runner", "schema", "configuration", "seed_pack",
    ].map((key, index) => [key, String(index + 1).repeat(64).slice(0, 64)])),
    generator_family: world.generator_family,
    public_contract: world.public_contract,
    policy_input_sha256: simulation.policy_input_sha256,
    policy_action_sha256: simulation.policy_action_sha256,
    policy_oracle_access: simulation.policy_oracle_access,
    evaluator_opened_after_action: true,
    action_authority: "validate-retry-replicate-reload-rebuild-wrap-release-with-declared-limits",
    evaluator_parameters: p,
    counterfactual_draw_domain: "F029/seed/world/artifact/stream/attempt; arm-excluded",
    mechanism: {
      transit_hazard_present: p.transit_hazard_per_stage > 0,
      release_enabled: p.release_probability > 0,
      wrapper_compatible: p.latent_compatible,
      release_cue_valid: p.release_cue_valid,
      short_lifetime: p.useful_lifetime_steps <= p.transit_stages + 1,
    },
    outcomes: simulation.outcomes,
    resources: simulation.resources,
    gates: simulation.gates,
    process_metadata: simulation.process_metadata,
    maximum_simultaneous_copies_observed: simulation.maximum_simultaneous_copies_observed,
    maximum_lifetime_copies_observed: simulation.maximum_lifetime_copies_observed,
    status: "development-smoke-only",
    result_label: "NO_RESULT",
    no_result: true,
    measured_energy_present: false,
    energy_conclusion_allowed: false,
    claim_eligible: false,
    comparison_inference_permitted: false,
    scientific_result: false,
    performance_result: false,
    interpretation: FIXTURE_029_INTERPRETATION,
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

test("actionable policy view excludes evaluator truth and rejects added fields", () => {
  const world = generateFixture029Worlds({ seed: 1580001, config })[4];
  const view = buildFixture029ActionableObservation({ seed: 1580001, world, artifactIndex: 0 });
  assert.deepEqual(Object.keys(view).sort(), [...FIXTURE_029_ACTIONABLE_KEYS].sort());
  assert.equal("latent_compatible" in view, false);
  assert.equal(decideFixture029Action("X04-PHASE", view).wrap, true);
  assert.throws(() => decideFixture029Action("X04-PHASE", { ...view, latent_compatible: false }), /hidden or missing/);
});

test("all eight arms are deterministic, bounded, conserved, and non-energy", () => {
  const world = generateFixture029Worlds({ seed: 1580001, config })[0];
  assert.equal(FIXTURE_029_ARMS.length, 8);
  for (const arm of FIXTURE_029_ARMS) {
    const left = simulateFixture029Arm({ seed: 1580001, world, arm, config });
    const right = simulateFixture029Arm({ seed: 1580001, world, arm, config });
    assert.deepEqual(left, right);
    assert.equal(left.gates.copy_conservation_pass, true);
    assert.equal(left.gates.artifact_conservation_pass, true);
    assert.equal(left.gates.resource_gate_pass, true);
    assert.ok(left.maximum_simultaneous_copies_observed <= config.maximum_simultaneous_copies);
    assert.ok(left.maximum_lifetime_copies_observed <= config.maximum_lifetime_copies);
  }
});

test("sequential recovery charges failed transit and reload or rebuild preparation time", () => {
  const seed = 1580001;
  const world = generateFixture029Worlds({ seed, config })[0];
  const retry = simulateFixture029Arm({ seed, world, arm: "X04-RETRY", config });
  const reload = simulateFixture029Arm({ seed, world, arm: "X04-RELOAD", config });
  const rebuild = simulateFixture029Arm({ seed, world, arm: "X04-REBUILD", config });
  const oracle = simulateFixture029Arm({ seed, world, arm: "X04-ORACLE", config });

  assert.deepEqual(
    [retry.outcomes.copies_transported, reload.outcomes.copies_transported, rebuild.outcomes.copies_transported],
    [42, 42, 42],
  );
  assert.deepEqual(
    [retry.outcomes.retried, reload.outcomes.reloaded, rebuild.outcomes.rebuilt],
    [18, 18, 18],
  );
  assert.deepEqual(
    [retry.outcomes.activation_latency_p95_steps, reload.outcomes.activation_latency_p95_steps,
      rebuild.outcomes.activation_latency_p95_steps],
    [15, 19, 25],
  );
  assert.deepEqual(
    [retry.outcomes.accepted_service_nsu, reload.outcomes.accepted_service_nsu,
      rebuild.outcomes.accepted_service_nsu],
    [210, 192, 174],
  );
  assert.deepEqual(
    [retry.outcomes.missed_release_deadlines, reload.outcomes.missed_release_deadlines,
      rebuild.outcomes.missed_release_deadlines],
    [8, 8, 8],
  );
  assert.equal(oracle.outcomes.retried, 9);
  assert.equal(oracle.outcomes.activation_latency_p95_steps, 16);
  assert.equal(oracle.outcomes.accepted_service_nsu, 241);
  assert.equal(oracle.outcomes.missed_release_deadlines, 5);
});

test("transport and reconstructed-artifact writes are distinct and complete", () => {
  const seed = 1580001;
  const worlds = generateFixture029Worlds({ seed, config });
  for (const world of worlds) {
    for (const arm of FIXTURE_029_ARMS) {
      const simulation = simulateFixture029Arm({ seed, world, arm, config });
      const { outcomes, resources } = simulation;
      assert.equal(
        resources.transported_bytes,
        outcomes.copies_transported * world.evaluator_parameters.artifact_bytes
          + resources.wrapper_state_bytes_created,
        `${world.generator_family}/${arm} transport bytes`,
      );
      assert.equal(resources.transport_bytes_written, resources.transported_bytes);
      assert.equal(
        resources.reconstruction_bytes_written,
        outcomes.rebuilt * world.evaluator_parameters.artifact_bytes,
      );
      assert.equal(
        resources.bytes_written,
        resources.transport_bytes_written + resources.reconstruction_bytes_written,
      );
      assert.equal(
        resources.wrapper_construction_operations,
        resources.wrapper_state_bytes_created / world.evaluator_parameters.wrapper_state_bytes,
      );
      assert.equal(resources.compatibility_check_operations, resources.wrapper_construction_operations);
    }
  }
  const phase = simulateFixture029Arm({ seed, world: worlds[0], arm: "X04-PHASE", config });
  assert.equal(phase.outcomes.copies_transported, 24);
  assert.equal(phase.resources.wrapper_state_bytes_created, 3072);
  assert.equal(phase.resources.transported_bytes, 101376);
  assert.equal(phase.resources.reconstruction_bytes_written, 0);

  const rebuild = simulateFixture029Arm({ seed, world: worlds[0], arm: "X04-REBUILD", config });
  assert.ok(rebuild.outcomes.rebuilt > 0);
  assert.equal(
    rebuild.resources.reconstruction_bytes_written,
    rebuild.outcomes.rebuilt * worlds[0].evaluator_parameters.artifact_bytes,
  );
  assert.ok(rebuild.resources.bytes_written > rebuild.resources.transport_bytes_written);
});

test("arm order and extra PHASE policy calls cannot perturb paired null outcomes", () => {
  const world = generateFixture029Worlds({ seed: 1580001, config })[1];
  const forward = Object.fromEntries(FIXTURE_029_ARMS.map((arm) => [
    arm, simulateFixture029Arm({ seed: 1580001, world, arm, config }),
  ]));
  const view = buildFixture029ActionableObservation({ seed: 1580001, world, artifactIndex: 0 });
  for (let index = 0; index < 25; index += 1) decideFixture029Action("X04-PHASE", view);
  const reverse = Object.fromEntries([...FIXTURE_029_ARMS].reverse().map((arm) => [
    arm, simulateFixture029Arm({ seed: 1580001, world, arm, config }),
  ]));
  assert.deepEqual(reverse["X04-NONE"], forward["X04-NONE"]);
  assert.deepEqual(reverse["X04-RETRY"], forward["X04-RETRY"]);
  assert.deepEqual(reverse["X04-REPLICA"], forward["X04-REPLICA"]);
});

test("first diagnostic cell has perfect compatibility and guaranteed physical release", () => {
  const world = generateFixture029Worlds({ seed: 1580001, config })[0];
  assert.equal(world.generator_family, "guaranteed-release-compatible");
  assert.equal(world.evaluator_parameters.latent_compatible, true);
  assert.equal(world.evaluator_parameters.release_probability, 1);
  assert.equal(world.evaluator_parameters.release_cue_valid, true);
  for (let artifactIndex = 0; artifactIndex < config.artifacts_per_world; artifactIndex += 1) {
    assert.equal(buildFixture029ActionableObservation({ seed: 1580001, world, artifactIndex }).release_cue_observed, true);
  }
});

test("incompatibility, release block, and short lifetime activate their kill diagnostics", () => {
  const worlds = generateFixture029Worlds({ seed: 1580001, config });
  const incompatible = simulateFixture029Arm({ seed: 1580001, world: worlds[4], arm: "X04-PERSIST", config });
  assert.ok(incompatible.outcomes.artifacts_invalid > 0);
  assert.equal(incompatible.outcomes.artifacts_bound, 0);
  const blocked = simulateFixture029Arm({ seed: 1580001, world: worlds[3], arm: "X04-PHASE", config });
  assert.equal(blocked.outcomes.artifacts_active, 0);
  const short = simulateFixture029Arm({ seed: 1580001, world: worlds[6], arm: "X04-PHASE", config });
  assert.equal(short.outcomes.accepted_service_nsu, 0);
  assert.equal(short.gates.task_gate_pass, false);
});

test("runtime event contract binds authority, gates, and chained payload", () => {
  const first = event();
  assert.equal(assertFixture029Record(first, { sequence: 0, previousHash: "0".repeat(64) }), first);
  const second = event("X04-RETRY", 1, first.integrity.record_sha256, 1);
  assert.equal(assertFixture029Record(second, { sequence: 1, previousHash: first.integrity.record_sha256 }), second);
  const altered = structuredClone(first);
  altered.outcomes.copies_destroyed += 1;
  altered.integrity.record_sha256 = sha256(
    `${"0".repeat(64)}\n${canonical(fixture029ScientificPayload(altered))}`,
  );
  assert.throws(() => assertFixture029Record(altered), /runtime contract/);
  const authorityClaim = structuredClone(first);
  authorityClaim.claim_eligible = true;
  authorityClaim.integrity.record_sha256 = sha256(
    `${"0".repeat(64)}\n${canonical(fixture029ScientificPayload(authorityClaim))}`,
  );
  assert.throws(() => assertFixture029Record(authorityClaim), /runtime contract/);
});

test("runtime contract rejects recomputed negative, unknown, and oracle-parity records", () => {
  const negative = structuredClone(event());
  negative.resources.logical_operations = -1;
  negative.integrity.record_sha256 = sha256(
    `${"0".repeat(64)}\n${canonical(fixture029ScientificPayload(negative))}`,
  );
  assert.throws(() => assertFixture029Record(negative), /runtime contract/);

  const unknown = structuredClone(event());
  unknown.unregistered_result = "pass";
  unknown.integrity.record_sha256 = sha256(
    `${"0".repeat(64)}\n${canonical(fixture029ScientificPayload(unknown))}`,
  );
  assert.throws(() => assertFixture029Record(unknown), /runtime contract/);

  const oracle = structuredClone(event("X04-ORACLE"));
  oracle.gates.information_parity = true;
  oracle.integrity.record_sha256 = sha256(
    `${"0".repeat(64)}\n${canonical(fixture029ScientificPayload(oracle))}`,
  );
  assert.throws(() => assertFixture029Record(oracle), /runtime contract/);

  const nonfinite = structuredClone(event());
  nonfinite.resources.logical_operations = Number.POSITIVE_INFINITY;
  assert.throws(() => assertFixture029Record(nonfinite), /Unsupported canonical value/);
});

test("runtime contract rejects payload-only transport accounting for wrapped copies", () => {
  const payloadOnly = structuredClone(event("X04-PHASE"));
  payloadOnly.resources.transported_bytes = payloadOnly.outcomes.copies_transported
    * payloadOnly.public_contract.artifact_bytes;
  payloadOnly.resources.bytes_written = payloadOnly.resources.transported_bytes;
  payloadOnly.gates.resource_ledger_complete = false;
  payloadOnly.gates.resource_gate_pass = false;
  payloadOnly.integrity.record_sha256 = sha256(
    `${"0".repeat(64)}\n${canonical(fixture029ScientificPayload(payloadOnly))}`,
  );
  assert.throws(() => assertFixture029Record(payloadOnly), /runtime contract/);
});

test("runtime contract rejects an omitted reconstructed-artifact materialization write", () => {
  const missingMaterialization = structuredClone(event("X04-REBUILD"));
  assert.ok(missingMaterialization.resources.reconstruction_bytes_written > 0);
  missingMaterialization.resources.bytes_written -=
    missingMaterialization.resources.reconstruction_bytes_written;
  missingMaterialization.resources.reconstruction_bytes_written = 0;
  missingMaterialization.integrity.record_sha256 = sha256(
    `${"0".repeat(64)}\n${canonical(fixture029ScientificPayload(missingMaterialization))}`,
  );
  assert.throws(() => assertFixture029Record(missingMaterialization), /runtime contract/);
});
