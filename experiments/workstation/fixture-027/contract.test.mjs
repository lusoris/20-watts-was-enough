import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import {
  FIXTURE_027_EVENT_CONTRACT_VERSION,
  assertFixture027Record,
  canonical,
  fixture027ScientificPayload,
  sha256,
} from "./contract.mjs";
import {
  FIXTURE_027_CLASSES,
  Pcg64Dxsm,
  fixture027StreamPreimage,
  generateFixture027Worlds,
  interfaceTraceChecksum,
  publicSeedHex,
  validateFixture027Config,
  validateInterfaceTrace,
} from "./generator.mjs";
import {
  FIXTURE_027_IMPLEMENTED_TRACKS,
  FIXTURE_027_TRACK_CLAIMS,
  FIXTURE_027_TRACK_IDS,
  assertFixture027Registry,
  extractFixture027Registry,
} from "./registry.mjs";

const smokeConfig = Object.freeze({
  schema: 1,
  artifact: "fixture-027",
  profile: "smoke",
  worlds_per_seed: 6,
  time_step_s: 0.01,
  horizon_s: 4,
  back_action_threshold_u: 0.02,
  minimum_restoration_fraction: 0.5,
  saturation_fraction_threshold: 0.2,
  state_scale_u: 2,
  max_loss: 100,
});

function fixture(previous = "0".repeat(64), sequence = 0) {
  const payload = {
    schema: 1,
    contract_version: FIXTURE_027_EVENT_CONTRACT_VERSION,
    artifact: "fixture-027",
    track: "RIN-T01",
    run_id: "a".repeat(64),
    profile: "smoke",
    pack: "public-development",
    seed: 1560001,
    world_index: 0,
    world_id: "1560001:0",
    arm: "load-aware-interface",
    attempt: 0,
    units: { signal: "U", time: "s", rate: "U s^-1", bytes: "B" },
    input_sha256: {
      contract: "1".repeat(64),
      generator: "2".repeat(64),
      runner: "3".repeat(64),
      configuration: "4".repeat(64),
      schema: "5".repeat(64),
      seed_pack: "6".repeat(64),
    },
    oracle_class: "strong-load-retroactive",
    corruption: "none",
    decision: "back-action-detected",
    trace_valid: true,
    ordering_valid: true,
    checksum_valid: true,
    unit_valid: true,
    interface_valid: true,
    parameters: {
      production_rate_u_per_s: 1,
      decay_per_s: 0.7,
      binding_on_per_u_s: 1.5,
      binding_off_per_s: 0.2,
      load_total_u: 0.8,
      driver_gain_per_s: 0,
      driver_capacity_u_per_s: 0,
    },
    mass_closure_residual_u: 1e-16,
    no_affinity_rmse_u: 0,
    back_action_rmse_u: 0.2,
    prediction_rmse_u: 0,
    insulation_rmse_u: 0,
    restoration_fraction: 0,
    driver_saturation_fraction: 0,
    insulation_action_u: 0,
    work_counter_scope: "accepted-interface-and-declared-arm-model-only; generator-and-validator-work-excluded",
    accepted_model_steps: 400,
    accepted_interface_samples_read: 401,
    accepted_interface_bytes_read: 50000,
    serialized_event_bytes_written: 768,
    declared_arm_scalar_operations: 5600,
    loss: 0,
    status: "development-smoke-only",
    result_label: "NO_RESULT",
    no_result: true,
    measured_energy_present: false,
    energy_conclusion_allowed: false,
    claim_eligible: false,
    comparison_inference_permitted: false,
    scientific_result: false,
    performance_result: false,
    interpretation: "NO_RESULT: contract fixture.",
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

test("machine registry freezes ten NO_RESULT tracks and only implements RIN-T01", async () => {
  const markdown = await readFile("experiments/fixtures/027-interface-qualified-retroactivity-insulation.md", "utf8");
  const registry = assertFixture027Registry(extractFixture027Registry(markdown));
  assert.deepEqual(registry.rows.map((row) => row.track), FIXTURE_027_TRACK_IDS);
  assert.deepEqual(FIXTURE_027_IMPLEMENTED_TRACKS, ["RIN-T01"]);
  assert.deepEqual(
    registry.rows.map((row) => row.claim),
    FIXTURE_027_TRACK_IDS.map((track) => FIXTURE_027_TRACK_CLAIMS[track]),
  );
  assert.ok(registry.rows.every((row) => row.result === "NO_RESULT"));
});

test("PCG64-DXSM and little-endian RIN-T01 stream grammar are frozen", () => {
  const random = new Pcg64Dxsm(1560001);
  assert.equal(random.nextUint64().toString(16), "db41bf843271d096");
  assert.equal(random.nextUint64().toString(16), "59825f71530d3798");
  assert.equal(publicSeedHex(1560001), "C1CD170000000000");
  assert.equal(fixture027StreamPreimage({
    phase: "development",
    protocol: "RIN-T01",
    seed: 1560001,
    scope: "dgp",
    canonicalId: 0,
  }), "F027-v1|development|RIN-T01|C1CD170000000000|dgp|0");
});

test("generator is deterministic and balances all six interface worlds", () => {
  assert.equal(validateFixture027Config(smokeConfig), smokeConfig);
  const left = generateFixture027Worlds({ seed: 1560001, config: smokeConfig });
  const right = generateFixture027Worlds({ seed: 1560001, config: smokeConfig });
  assert.deepEqual(left, right);
  assert.equal(left.length, 6);
  assert.deepEqual(new Set(left.map((world) => world.world_class)), new Set(FIXTURE_027_CLASSES));
  assert.ok(left.every((world) => world.trace.length === 401));
});

test("registered synthetic worlds separate support, retroactivity, restoration, and saturation", () => {
  const worlds = [];
  for (let seed = 1560001; seed < 1560025; seed += 1) {
    worlds.push(...generateFixture027Worlds({ seed, config: smokeConfig }));
  }
  const classes = Object.fromEntries(FIXTURE_027_CLASSES.map((label) => [
    label,
    worlds.filter((world) => world.world_class === label),
  ]));
  assert.ok(classes["zero-load-control"].every((world) => world.back_action_rmse_u === 0));
  assert.ok(worlds.every((world) => world.mass_closure_residual_u <= 1e-12));
  assert.ok(worlds.every((world) => world.no_affinity_rmse_u <= 1e-12));
  assert.ok(classes["weak-load-supported"].every((world) => world.back_action_rmse_u <= smokeConfig.back_action_threshold_u));
  assert.ok(classes["strong-load-retroactive"].every((world) => world.back_action_rmse_u > smokeConfig.back_action_threshold_u));
  assert.ok(classes["finite-insulation-effective"].every((world) => (
    world.back_action_rmse_u > smokeConfig.back_action_threshold_u
    && world.restoration_fraction >= smokeConfig.minimum_restoration_fraction
    && world.driver_saturation_fraction < smokeConfig.saturation_fraction_threshold
    && world.insulation_action_u > 0
  )));
  assert.ok(classes["insulation-saturated"].every((world) => (
    world.back_action_rmse_u > smokeConfig.back_action_threshold_u
    && world.driver_saturation_fraction >= smokeConfig.saturation_fraction_threshold
  )));
});

test("all four public interface corruptions fail before synthetic simulation authority", () => {
  const worlds = [];
  for (let seed = 1560001; seed < 1560049; seed += 1) {
    worlds.push(...generateFixture027Worlds({ seed, config: smokeConfig }));
  }
  const corrupt = worlds.filter((world) => world.world_class === "interface-schema-invalid");
  assert.deepEqual(new Set(corrupt.map((world) => world.corruption)), new Set([
    "time-order",
    "unit-token",
    "interface-version",
    "checksum",
  ]));
  assert.ok(corrupt.every((world) => validateInterfaceTrace(world.trace, smokeConfig).trace_valid === false));
  assert.ok(corrupt.every((world) => world.simulation_performed === false && world.trajectory === null));
  assert.ok(worlds.filter((world) => world.world_class !== "interface-schema-invalid")
    .every((world) => world.simulation_performed && validateInterfaceTrace(world.trace, smokeConfig).trace_valid));

  const valid = worlds.find((world) => world.world_class !== "interface-schema-invalid");
  const missingPhysics = valid.trace.map((sample) => ({ ...sample }));
  delete missingPhysics[5].source_free_u;
  missingPhysics[5].checksum = interfaceTraceChecksum(missingPhysics[5]);
  assert.equal(validateInterfaceTrace(missingPhysics, smokeConfig).trace_valid, false);
});

test("declared JSON Schema covers every closed runtime field", async () => {
  const schema = JSON.parse(await readFile("experiments/workstation/fixture-027/output.schema.json", "utf8"));
  assert.equal(schema.additionalProperties, false);
  assert.equal(schema["x-runtime-validator"].contract_version, FIXTURE_027_EVENT_CONTRACT_VERSION);
  assert.deepEqual(Object.keys(schema.properties).sort(), [...schema.required].sort());
});

test("raw event contract binds interface outputs, NO_RESULT authority, and hash chain", () => {
  const first = fixture();
  assert.equal(assertFixture027Record(first, { sequence: 0, previousHash: "0".repeat(64) }), first);
  const second = fixture(first.integrity.record_sha256, 1);
  assert.equal(assertFixture027Record(second, { sequence: 1, previousHash: first.integrity.record_sha256 }), second);
  assert.throws(() => assertFixture027Record(first, { runId: "b".repeat(64) }), /runtime contract/);
  assert.throws(() => assertFixture027Record(first, { profile: "development" }), /runtime contract/);
  const tampered = { ...second, loss: second.loss + 1 };
  assert.throws(() => assertFixture027Record(tampered, { sequence: 1, previousHash: first.integrity.record_sha256 }), /runtime contract/);
  const authorityClaim = fixture();
  authorityClaim.result_label = "RESULT";
  authorityClaim.no_result = false;
  authorityClaim.claim_eligible = true;
  authorityClaim.integrity.record_sha256 = sha256(`${"0".repeat(64)}\n${canonical(fixture027ScientificPayload(authorityClaim))}`);
  assert.throws(() => assertFixture027Record(authorityClaim), /runtime contract/);
});

test("record-invalid interface events cannot charge simulation or insulation work", () => {
  const invalid = fixture();
  invalid.oracle_class = "interface-schema-invalid";
  invalid.corruption = "unit-token";
  invalid.decision = "record-invalid";
  invalid.trace_valid = false;
  invalid.unit_valid = false;
  invalid.back_action_rmse_u = 0;
  invalid.mass_closure_residual_u = 0;
  invalid.no_affinity_rmse_u = 0;
  invalid.accepted_model_steps = 0;
  invalid.accepted_interface_samples_read = 0;
  invalid.accepted_interface_bytes_read = 0;
  invalid.declared_arm_scalar_operations = 0;
  invalid.integrity.record_sha256 = sha256(`${"0".repeat(64)}\n${canonical(fixture027ScientificPayload(invalid))}`);
  assert.equal(assertFixture027Record(invalid), invalid);
  invalid.accepted_model_steps = 1;
  invalid.integrity.record_sha256 = sha256(`${"0".repeat(64)}\n${canonical(fixture027ScientificPayload(invalid))}`);
  assert.throws(() => assertFixture027Record(invalid), /stop before simulation/);
});
