import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import {
  FIXTURE_026_EVENT_CONTRACT_VERSION,
  assertFixture026Record,
  canonical,
  fixture026ScientificPayload,
  sha256,
} from "./contract.mjs";
import {
  FIXTURE_026_CLASSES,
  FIXTURE_026_HISTORY_FAMILIES,
  FIXTURE_026_RNG_CONTRACT,
  FIXTURE_026_VALID_CLASSES,
  PcgCmDxsm12864,
  assertPolicyViewFirewall,
  buildPolicyView,
  computeTrajectoryDiagnostics,
  fixture026StreamPreimage,
  generateFixture026Worlds,
  observationChecksum,
  publicSeedHex,
  validateFixture026Config,
  validateObservationTrace,
} from "./generator.mjs";
import {
  FIXTURE_026_IMPLEMENTED_TRACKS,
  FIXTURE_026_TRACK_CLAIMS,
  FIXTURE_026_TRACK_IDS,
  assertFixture026Registry,
  extractFixture026Registry,
} from "./registry.mjs";

const smokeConfig = Object.freeze({
  schema: 1,
  artifact: "fixture-026",
  profile: "smoke",
  worlds_per_seed: 6,
  time_step_s: 0.02,
  horizon_s: 4,
  trajectory_quadrature: "trapezoid",
  exact_discrepancy_tolerance: 1e-12,
  approximate_discrepancy_floor: 0.01,
  approximate_discrepancy_ceiling: 0.06,
  endpoint_tolerance: 1e-12,
  peak_tolerance: 1e-12,
  tail_window_s: 0.5,
  input_floor_u: 0.05,
  output_scale_y: 1,
  max_loss: 100,
});

function fixture(previous = "0".repeat(64), sequence = 0) {
  const payload = {
    schema: 1,
    contract_version: FIXTURE_026_EVENT_CONTRACT_VERSION,
    artifact: "fixture-026",
    track: "RSD-T01",
    run_id: "a".repeat(64),
    profile: "smoke",
    pack: "public-development",
    seed: 1540001,
    world_index: 0,
    world_id: "b".repeat(64),
    initialization_id: "c".repeat(64),
    scale_group: "positive-multiplicative:4",
    interface: "paired-normalized-output",
    arm: "full-trajectory-diagnostic",
    attempt: 0,
    units: { input: "U", output: "1", time: "s", bytes: "B" },
    input_sha256: {
      audit: "0".repeat(64),
      fixture: "1".repeat(64),
      math: "2".repeat(64),
      contract: "3".repeat(64),
      generator: "4".repeat(64),
      runner: "5".repeat(64),
      analysis: "5".repeat(64),
      configuration: "6".repeat(64),
      schema: "7".repeat(64),
      seed_pack: "8".repeat(64),
      runtime: "d".repeat(64),
    },
    oracle_class: "exact-scale-symmetry",
    history_family: "step",
    corruption: "none",
    gate_decision: "accepted",
    trace_valid: true,
    ordering_valid: true,
    checksum_valid: true,
    unit_valid: true,
    interface_valid: true,
    causal_reference_valid: true,
    parameters: {
      background_base_u: 1,
      scale_factor: 4,
      reference_time_constant_s: 0.8,
      perturbation_amplitude_y: 0.9,
      input_floor_u: 0.05,
    },
    prediction: "exact-scale-symmetry",
    class_correct: true,
    trajectory_discrepancy: 0,
    estimated_trajectory_discrepancy: 0,
    trajectory_discrepancy_estimation_error: 0,
    peak_discrepancy: 0,
    endpoint_discrepancy: 0,
    tail_discrepancy: 0,
    latency_discrepancy_s: 0,
    static_fit_rmse: 0.4,
    policy_input_sha256: "9".repeat(64),
    policy_response_sha256: "a".repeat(64),
    policy_oracle_access: false,
    evaluator_opened_after_response: true,
    work_counter_scope: "exact-serialized-policy-view-bytes-and-frozen-modeled-classifier-counter-only; generator-validator-evaluator-hash-runtime-temporary-memory-excluded",
    accepted_trajectory_samples_read: 201,
    accepted_summary_values_read: 0,
    serialized_policy_view_utf8_bytes: 12000,
    serialized_event_bytes_written: 1800,
    modeled_diagnostic_scalar_operations: 2936,
    retained_persistent_state_bytes: 0,
    temporary_memory_measured: false,
    peak_memory_measured: false,
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

function rehash(record) {
  record.integrity.record_sha256 = sha256(
    `${record.integrity.previous_sha256}\n${canonical(fixture026ScientificPayload(record))}`,
  );
  return record;
}

test("machine registry freezes ten NO_RESULT tracks and implements only RSD-T01", async () => {
  const markdown = await readFile("experiments/fixtures/026-interface-qualified-relative-sensing.md", "utf8");
  const registry = assertFixture026Registry(extractFixture026Registry(markdown));
  assert.deepEqual(registry.rows.map((row) => row.track), FIXTURE_026_TRACK_IDS);
  assert.deepEqual(FIXTURE_026_IMPLEMENTED_TRACKS, ["RSD-T01"]);
  assert.deepEqual(
    registry.rows.map((row) => row.claim),
    FIXTURE_026_TRACK_IDS.map((track) => FIXTURE_026_TRACK_CLAIMS[track]),
  );
  assert.ok(registry.rows.every((row) => row.result === "NO_RESULT"));
});

test("PCG-CM-DXSM 128/64 with custom SHA-256 seeding and little-endian stream grammar is frozen", () => {
  assert.deepEqual(FIXTURE_026_RNG_CONTRACT, {
    family: "PCG-CM-DXSM 128/64",
    state_bits: 128,
    output_bits: 64,
    transition_multiplier_hex: "0xda942042e4dd58b5",
    output_permutation: "DXSM applied to the pre-transition 128-bit state",
    seeding: "custom SHA-256-derived 128-bit state and odd 128-bit increment",
    numpy_seedsequence_compatible: false,
  });
  const random = new PcgCmDxsm12864(1540001);
  assert.equal(random.nextUint64().toString(16), "30e586cd03dd9f0e");
  assert.equal(random.nextUint64().toString(16), "8c3513142e3612b2");
  assert.equal(random.nextUint64().toString(16), "2aadf2f542b4707b");
  assert.equal(random.nextUint64().toString(16), "f34841f1315e00ce");
  assert.equal(publicSeedHex(1540001), "A17F170000000000");
  assert.equal(fixture026StreamPreimage({
    phase: "development",
    protocol: "RSD-T01",
    seed: 1540001,
    scope: "dgp",
    canonicalId: 0,
  }), "F026-v1|development|RSD-T01|A17F170000000000|dgp|0");
});

test("configuration is exact-keyed and freezes numerical support and quadrature", () => {
  assert.equal(validateFixture026Config(smokeConfig), smokeConfig);
  assert.throws(() => validateFixture026Config({ ...smokeConfig, hidden_epsilon: 1e-9 }), /invalid/);
  assert.throws(() => validateFixture026Config({ ...smokeConfig, input_floor_u: 0 }), /invalid/);
  assert.throws(() => validateFixture026Config({ ...smokeConfig, trajectory_quadrature: "rectangle" }), /invalid/);
});

test("generator is deterministic, uses hashed bookkeeping IDs, and separates valid classes from the sentinel", () => {
  const left = generateFixture026Worlds({ seed: 1540001, config: smokeConfig });
  const right = generateFixture026Worlds({ seed: 1540001, config: smokeConfig });
  assert.deepEqual(left, right);
  assert.equal(left.length, 6);
  assert.deepEqual(new Set(left.map((world) => world.oracle_class)), new Set(FIXTURE_026_CLASSES));
  assert.deepEqual(
    new Set(left.filter((world) => world.validation.trace_valid).map((world) => world.oracle_class)),
    new Set(FIXTURE_026_VALID_CLASSES),
  );
  assert.ok(left.every((world) => /^[0-9a-f]{64}$/.test(world.world_id)));
  assert.ok(left.every((world) => !world.world_id.includes(String(world.seed))));
});

test("all public seeds satisfy the frozen response-shape semantic invariants", () => {
  const worlds = [];
  for (let seed = 1540001; seed <= 1540064; seed += 1) {
    worlds.push(...generateFixture026Worlds({ seed, config: smokeConfig }));
  }
  assert.deepEqual(new Set(worlds.map((world) => world.history_family)), new Set(FIXTURE_026_HISTORY_FAMILIES));
  const valid = worlds.filter((world) => world.validation.trace_valid);
  assert.ok(valid.every((world) => world.trace.every((sample) => (
    sample.input_base_u >= smokeConfig.input_floor_u
    && sample.input_scaled_u >= smokeConfig.input_floor_u
  ))));
  const byClass = Object.fromEntries(FIXTURE_026_VALID_CLASSES.map((label) => [
    label,
    valid.filter((world) => world.oracle_class === label),
  ]));
  assert.ok(byClass["exact-scale-symmetry"].every((world) => (
    computeTrajectoryDiagnostics(world.trace, smokeConfig).trajectory_discrepancy
      <= smokeConfig.exact_discrepancy_tolerance
  )));
  assert.ok(byClass["approximate-scale-symmetry"].every((world) => {
    const score = computeTrajectoryDiagnostics(world.trace, smokeConfig).trajectory_discrepancy;
    return score >= smokeConfig.approximate_discrepancy_floor
      && score <= smokeConfig.approximate_discrepancy_ceiling;
  }));
  assert.ok(byClass["exact-adaptation-only"].every((world) => {
    const score = computeTrajectoryDiagnostics(world.trace, smokeConfig);
    return score.endpoint_discrepancy <= smokeConfig.endpoint_tolerance
      && score.trajectory_discrepancy > smokeConfig.approximate_discrepancy_ceiling;
  }));
  assert.ok(byClass["equal-peak-different-shape"].every((world) => {
    const score = computeTrajectoryDiagnostics(world.trace, smokeConfig);
    return score.peak_discrepancy <= smokeConfig.peak_tolerance
      && score.endpoint_discrepancy <= smokeConfig.endpoint_tolerance
      && score.latency_discrepancy_s > 0
      && score.trajectory_discrepancy > smokeConfig.approximate_discrepancy_ceiling;
  }));
  assert.ok(byClass["static-ratio"].every((world) => {
    const score = computeTrajectoryDiagnostics(world.trace, smokeConfig);
    return score.static_fit_rmse <= smokeConfig.exact_discrepancy_tolerance
      && world.trace.every((sample) => sample.reference_origin === "frozen-initial-background");
  }));
  assert.ok(valid.filter((world) => world.oracle_class !== "static-ratio")
    .every((world) => world.trace.every((sample) => sample.reference_origin === "initialized-causal")));
});

test("all corruption sentinels fail the interface before diagnostic classification including future normalization", () => {
  const invalid = [];
  for (let seed = 1540001; seed <= 1540064; seed += 1) {
    invalid.push(...generateFixture026Worlds({ seed, config: smokeConfig })
      .filter((world) => world.oracle_class === "invalid-record"));
  }
  assert.deepEqual(new Set(invalid.map((world) => world.corruption)), new Set([
    "time-order", "checksum", "unit-token", "future-normalization",
  ]));
  assert.ok(invalid.every((world) => !world.validation.trace_valid));

  const valid = generateFixture026Worlds({ seed: 1540001, config: smokeConfig })
    .find((world) => world.validation.trace_valid);
  const altered = valid.trace.map((sample) => ({ ...sample }));
  altered[10].reference_origin = "full-trajectory-mean";
  altered[10].checksum = observationChecksum(altered[10]);
  const checked = validateObservationTrace(altered, smokeConfig);
  assert.equal(checked.checksum_valid, true);
  assert.equal(checked.causal_reference_valid, false);
  assert.equal(checked.trace_valid, false);
});

test("policy projections expose no oracle fields and keep full trajectories separate from summaries", () => {
  const world = generateFixture026Worlds({ seed: 1540001, config: smokeConfig })
    .find((candidate) => candidate.oracle_class === "equal-peak-different-shape");
  const full = assertPolicyViewFirewall(buildPolicyView(world, "full-trajectory-diagnostic"));
  const summary = assertPolicyViewFirewall(buildPolicyView(world, "peak-endpoint-lookalike"));
  assert.ok(Array.isArray(full.observation));
  assert.deepEqual(Object.keys(summary.observation).sort(), [
    "endpoint_discrepancy", "peak_discrepancy",
  ]);
  assert.deepEqual(Object.keys(full).sort(), ["observation", "trace_valid"]);
  assert.deepEqual(Object.keys(full.observation[0]).sort(), [
    "input_ratio", "ordinal", "output_base_y", "output_scaled_y", "time_s",
  ]);
  assert.equal(JSON.stringify(full).includes("equal-peak-different-shape"), false);
  assert.equal(JSON.stringify(summary).includes("equal-peak-different-shape"), false);
  assert.equal(Object.hasOwn(full.observation[0], "reference_origin"), false);
  assert.equal(Object.hasOwn(full.observation[0], "checksum"), false);
  assert.throws(() => assertPolicyViewFirewall({ ...summary, oracle_class: world.oracle_class }), /leaked evaluator/);
  assert.throws(() => assertPolicyViewFirewall({ ...summary, reference_origin: "frozen-initial-background" }), /leaked evaluator/);
});

test("policy field projection exposes no public identity-dictionary key or value", () => {
  const worlds = [];
  for (let seed = 1540001; seed <= 1540064; seed += 1) {
    worlds.push(...generateFixture026Worlds({ seed, config: smokeConfig }));
  }
  const dictionaryValues = new Set(worlds.flatMap((world) => [
    world.world_id,
    world.initialization_id,
    world.scale_group,
  ]));
  for (const world of worlds) {
    for (const arm of ["full-trajectory-diagnostic", "peak-endpoint-lookalike"]) {
      const view = assertPolicyViewFirewall(buildPolicyView(world, arm));
      const serialized = JSON.stringify(view);
      assert.deepEqual(Object.keys(view).sort(), ["observation", "trace_valid"]);
      assert.ok([...dictionaryValues].every((value) => !serialized.includes(value)));
      assert.ok(!/(world_id|initialization_id|scale_group|seed|world_index|checksum|reference_origin)/u.test(serialized));
    }
  }
});

test("declared JSON Schema covers every closed runtime field", async () => {
  const schema = JSON.parse(await readFile("experiments/workstation/fixture-026/output.schema.json", "utf8"));
  assert.equal(schema.additionalProperties, false);
  assert.equal(schema["x-runtime-validator"].contract_version, FIXTURE_026_EVENT_CONTRACT_VERSION);
  assert.deepEqual(Object.keys(schema.properties).sort(), [...schema.required].sort());
  assert.deepEqual(Object.keys(schema.properties.input_sha256.properties).sort(), [
    "analysis", "audit", "configuration", "contract", "fixture", "generator",
    "math", "runner", "runtime", "schema", "seed_pack",
  ]);
});

test("raw event contract binds scores, NO_RESULT authority, and hash chain", () => {
  const first = fixture();
  assert.equal(assertFixture026Record(first, { sequence: 0, previousHash: "0".repeat(64) }), first);
  const second = fixture(first.integrity.record_sha256, 1);
  assert.equal(assertFixture026Record(second, { sequence: 1, previousHash: first.integrity.record_sha256 }), second);
  assert.throws(() => assertFixture026Record(first, { runId: "f".repeat(64) }), /runtime contract/);
  const tampered = { ...second, tail_discrepancy: 0.1 };
  assert.throws(() => assertFixture026Record(tampered, { sequence: 1, previousHash: first.integrity.record_sha256 }), /runtime contract/);
  const authorityClaim = fixture();
  authorityClaim.result_label = "RESULT";
  authorityClaim.claim_eligible = true;
  rehash(authorityClaim);
  assert.throws(() => assertFixture026Record(authorityClaim), /runtime contract/);
});

test("invalid observations cannot charge accepted classification, diagnostic scoring, state, or serialized policy-view bytes", () => {
  const invalid = fixture();
  invalid.oracle_class = "invalid-record";
  invalid.corruption = "future-normalization";
  invalid.gate_decision = "record-invalid";
  invalid.trace_valid = false;
  invalid.causal_reference_valid = false;
  invalid.prediction = "invalid-record";
  invalid.static_fit_rmse = 0;
  invalid.accepted_trajectory_samples_read = 0;
  invalid.serialized_policy_view_utf8_bytes = 0;
  invalid.modeled_diagnostic_scalar_operations = 0;
  invalid.retained_persistent_state_bytes = 0;
  rehash(invalid);
  assert.equal(assertFixture026Record(invalid), invalid);
  invalid.serialized_policy_view_utf8_bytes = 1;
  rehash(invalid);
  assert.throws(() => assertFixture026Record(invalid), /zero accepted classifier/);
});

test("modeled operation and persistent-memory counters fail closed", () => {
  const full = fixture();
  assert.equal(assertFixture026Record(full), full);

  const wrongModel = fixture();
  wrongModel.modeled_diagnostic_scalar_operations += 1;
  rehash(wrongModel);
  assert.throws(() => assertFixture026Record(wrongModel), /accounting is invalid/);

  const persistent = fixture();
  persistent.retained_persistent_state_bytes = 1;
  rehash(persistent);
  assert.throws(() => assertFixture026Record(persistent), /runtime contract/);

  const unmeasuredClaim = fixture();
  unmeasuredClaim.peak_memory_measured = true;
  rehash(unmeasuredClaim);
  assert.throws(() => assertFixture026Record(unmeasuredClaim), /runtime contract/);

  const summary = fixture();
  summary.arm = "peak-endpoint-lookalike";
  summary.accepted_trajectory_samples_read = 0;
  summary.accepted_summary_values_read = 2;
  summary.modeled_diagnostic_scalar_operations = 3;
  rehash(summary);
  assert.equal(assertFixture026Record(summary), summary);
});

test("trajectory estimate error is bound to the frozen policy response", () => {
  const record = fixture();
  record.estimated_trajectory_discrepancy = 0.2;
  record.trajectory_discrepancy_estimation_error = 0.1;
  rehash(record);
  assert.throws(() => assertFixture026Record(record), /estimate and evaluator discrepancy/);
});
