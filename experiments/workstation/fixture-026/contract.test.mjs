import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { createAjv } from "../lib/ajv.mjs";

import {
  FIXTURE_026_EVENT_CONTRACT_VERSION,
  FIXTURE_026_EVENT_INTERPRETATION,
  FIXTURE_026_PARAMETER_KEYS,
  assertFixture026Record,
  canonical,
  fixture026ScientificPayload,
  sha256,
} from "./contract.mjs";
import {
  FIXTURE_026_HISTORY_FAMILIES,
  FIXTURE_026_MALFORMED_SENTINELS,
  FIXTURE_026_RNG_CONTRACT,
  FIXTURE_026_VALID_FAMILIES,
  FIXTURE_026_VALID_CELLS_PER_SEED,
  PcgCmDxsm12864,
  assertPolicyViewFirewall,
  buildPolicyView,
  computeTrajectoryDiagnostics,
  computeFixture026SemanticProperties,
  fixture026StreamPreimage,
  generateFixture026CausalLookalikePair,
  generateFixture026Worlds,
  observationChecksum,
  parseFixture026PublicSeed,
  publicSeedHex,
  validateFixture026Config,
  validateObservationTrace,
} from "./generator.mjs";
import {
  FIXTURE_026_CONTRACT_FROZEN_TRACKS,
  FIXTURE_026_IMPLEMENTED_TRACKS,
  FIXTURE_026_TRACK_CLAIMS,
  FIXTURE_026_TRACK_IDS,
  assertFixture026Registry,
  extractFixture026Registry,
} from "./registry.mjs";

const smokeConfig = Object.freeze({
  schema: 2,
  artifact: "fixture-026",
  profile: "smoke",
  worlds_per_seed: 24,
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
    schema: 2,
    contract_version: FIXTURE_026_EVENT_CONTRACT_VERSION,
    artifact: "fixture-026",
    track: "RSD-T01",
    run_id: "a".repeat(64),
    profile: "smoke",
    pack: "public-development",
    seed: "1540001",
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
    generator_family: "exact-scale-symmetry",
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
      input_floor_u: 0.05,
      causal_reference_tau_s: 0.8,
      approximate_additive_amplitude_y: null,
      endpoint_gain_increment: null,
      endpoint_base_lag_s: null,
      endpoint_scaled_lag_s: null,
      equal_peak_common_gain: null,
      equal_peak_memory_lag_s: null,
      equal_peak_delay_s: null,
    },
    predicted_generator_family: "exact-scale-symmetry",
    generator_family_correct: true,
    semantic_properties_evaluated: true,
    semantic_properties: {
      paired_trajectory_match: "exact",
      finite_horizon_endpoint_return: false,
      peak_amplitude_equal: true,
      causal_memory_status: "unassessed",
      support_membership: "inside",
    },
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
    modeled_diagnostic_scalar_operations: 3740,
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
    interpretation: FIXTURE_026_EVENT_INTERPRETATION,
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

test("machine registry freezes ten NO_RESULT tracks, two contracts, and only one implementation", async () => {
  const markdown = await readFile("experiments/fixtures/026-interface-qualified-relative-sensing.md", "utf8");
  const registry = assertFixture026Registry(extractFixture026Registry(markdown));
  assert.deepEqual(registry.rows.map((row) => row.track), FIXTURE_026_TRACK_IDS);
  assert.deepEqual(FIXTURE_026_CONTRACT_FROZEN_TRACKS, ["RSD-T01", "RSD-T02"]);
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
    public_seed_grammar: "canonical decimal-string uint64 encoded as eight little-endian bytes",
    numpy_seedsequence_compatible: false,
  });
  const random = new PcgCmDxsm12864("1540001");
  assert.equal(random.nextUint64().toString(16), "30e586cd03dd9f0e");
  assert.equal(random.nextUint64().toString(16), "8c3513142e3612b2");
  assert.equal(random.nextUint64().toString(16), "2aadf2f542b4707b");
  assert.equal(random.nextUint64().toString(16), "f34841f1315e00ce");
  assert.equal(publicSeedHex("1540001"), "A17F170000000000");
  assert.equal(publicSeedHex("0"), "0000000000000000");
  assert.equal(publicSeedHex("18446744073709551615"), "FFFFFFFFFFFFFFFF");
  assert.equal(parseFixture026PublicSeed("18446744073709551615"), 0xffff_ffff_ffff_ffffn);
  for (const invalid of [
    1540001, "01", "-1", "1.0", "18446744073709551616", "9".repeat(10_000), "",
  ]) {
    assert.throws(() => parseFixture026PublicSeed(invalid), /canonical|exceeds/);
  }
  assert.equal(fixture026StreamPreimage({
    phase: "development",
    protocol: "RSD-T01",
    seed: "1540001",
    scope: "dgp",
    canonicalId: 0,
  }), "F026-v2|development|RSD-T01|A17F170000000000|dgp|0");
});

test("configuration is exact-keyed and freezes numerical support and quadrature", () => {
  assert.equal(validateFixture026Config(smokeConfig), smokeConfig);
  assert.throws(() => validateFixture026Config({ ...smokeConfig, hidden_epsilon: 1e-9 }), /invalid/);
  assert.throws(() => validateFixture026Config({ ...smokeConfig, input_floor_u: 0 }), /invalid/);
  assert.throws(() => validateFixture026Config({ ...smokeConfig, worlds_per_seed: 23 }), /invalid/);
  assert.throws(() => validateFixture026Config({ ...smokeConfig, trajectory_quadrature: "rectangle" }), /invalid/);
});

test("generator is deterministic and emits the exact 5-family by 4-history grid plus four sentinels", () => {
  const left = generateFixture026Worlds({ seed: "1540001", config: smokeConfig });
  const right = generateFixture026Worlds({ seed: "1540001", config: smokeConfig });
  assert.deepEqual(left, right);
  assert.equal(left.length, 24);
  const valid = left.filter((world) => world.validation.trace_valid);
  const sentinels = left.filter((world) => world.generator_family === "malformed-sentinel");
  assert.equal(valid.length, FIXTURE_026_VALID_CELLS_PER_SEED);
  assert.equal(sentinels.length, FIXTURE_026_MALFORMED_SENTINELS.length);
  assert.deepEqual(new Set(sentinels.map((world) => world.corruption)), new Set(FIXTURE_026_MALFORMED_SENTINELS));
  assert.deepEqual(
    new Set(valid.map((world) => `${world.generator_family}|${world.history_family}`)),
    new Set(FIXTURE_026_VALID_FAMILIES.flatMap((family) => (
      FIXTURE_026_HISTORY_FAMILIES.map((history) => `${family}|${history}`)
    ))),
  );
  for (const family of FIXTURE_026_VALID_FAMILIES) {
    const familyWorlds = valid.filter((world) => world.generator_family === family);
    assert.equal(new Set(familyWorlds.map((world) => world.initialization_id)).size, 1);
    assert.equal(new Set(familyWorlds.map((world) => world.world_id)).size, 4);
    assert.equal(new Set(familyWorlds.map((world) => JSON.stringify(world.parameters))).size, 1);
  }
  assert.ok(left.every((world) => /^[0-9a-f]{64}$/.test(world.world_id)));
  assert.ok(left.every((world) => !world.world_id.includes(String(world.seed))));
});

test("generator parameters are closed and family-qualified with explicit nulls", () => {
  const worlds = generateFixture026Worlds({ seed: "1540001", config: smokeConfig });
  const familyFields = FIXTURE_026_PARAMETER_KEYS.slice(3);
  for (const world of worlds) {
    const parameters = world.parameters;
    assert.deepEqual(Object.keys(parameters).sort(), [...FIXTURE_026_PARAMETER_KEYS].sort());
    assert.ok(parameters.background_base_u >= parameters.input_floor_u);
    assert.ok(parameters.scale_factor > 0);
    assert.equal(parameters.input_floor_u, 0.05);
    if (new Set(["exact-scale-symmetry", "malformed-sentinel"]).has(world.generator_family)) {
      assert.ok(parameters.causal_reference_tau_s > 0);
      assert.ok(familyFields.slice(1).every((field) => parameters[field] === null));
    } else if (world.generator_family === "approximate-scale-symmetry") {
      assert.ok(parameters.causal_reference_tau_s > 0);
      assert.ok(parameters.approximate_additive_amplitude_y > 0);
      assert.ok(familyFields.slice(2).every((field) => parameters[field] === null));
    } else if (world.generator_family === "endpoint-return-lookalike") {
      assert.ok(parameters.endpoint_gain_increment > 0);
      assert.equal(parameters.endpoint_base_lag_s, 0.4);
      assert.equal(parameters.endpoint_scaled_lag_s, 0.8);
      assert.equal(parameters.causal_reference_tau_s, null);
      assert.equal(parameters.approximate_additive_amplitude_y, null);
      assert.ok([
        parameters.equal_peak_common_gain,
        parameters.equal_peak_memory_lag_s,
        parameters.equal_peak_delay_s,
      ].every((value) => value === null));
    } else if (world.generator_family === "equal-peak-delayed-trajectory") {
      assert.ok(parameters.equal_peak_common_gain > 0);
      assert.equal(parameters.equal_peak_memory_lag_s, 0.6);
      assert.equal(parameters.equal_peak_delay_s, 0.3);
      assert.ok(familyFields.slice(0, 5).every((field) => parameters[field] === null));
    } else {
      assert.equal(world.generator_family, "static-ratio");
      assert.ok(familyFields.every((field) => parameters[field] === null));
    }
  }
});

test("seeded band-limited stochastic histories are deterministic within seed and sensitive across seeds", () => {
  const left = generateFixture026Worlds({ seed: "1540001", config: smokeConfig })
    .find((world) => world.generator_family === "exact-scale-symmetry"
      && world.history_family === "band-limited-stochastic");
  const repeat = generateFixture026Worlds({ seed: "1540001", config: smokeConfig })
    .find((world) => world.generator_family === "exact-scale-symmetry"
      && world.history_family === "band-limited-stochastic");
  const different = generateFixture026Worlds({ seed: "1540002", config: smokeConfig })
    .find((world) => world.generator_family === "exact-scale-symmetry"
      && world.history_family === "band-limited-stochastic");
  const ratios = (world) => world.trace.map((sample) => sample.input_base_u / sample.background_base_u);
  assert.deepEqual(ratios(left), ratios(repeat));
  assert.notDeepEqual(ratios(left), ratios(different));
  assert.ok(ratios(left).every((ratio) => ratio > 0));
  assert.ok(ratios(left).slice(-71).every((ratio) => ratio === 1));
});

test("lookalike responses are causal, finite-memory, and history-responsive", () => {
  const commonPrefix = Array.from({ length: 100 }, (_, index) => (
    index < 25 ? 1 : 1 + 0.5 * Math.sin(index / 11) ** 2
  ));
  const leftRatios = [...commonPrefix, ...Array.from({ length: 101 }, () => 2)];
  const rightRatios = [...commonPrefix, ...Array.from({ length: 101 }, () => 0.75)];
  for (const generatorFamily of ["endpoint-return-lookalike", "equal-peak-delayed-trajectory"]) {
    const left = generateFixture026CausalLookalikePair({
      generatorFamily,
      ratios: leftRatios,
      timeStepS: 0.02,
      endpointGainIncrement: generatorFamily === "endpoint-return-lookalike" ? 0.4 : null,
      endpointBaseLagS: generatorFamily === "endpoint-return-lookalike" ? 0.4 : null,
      endpointScaledLagS: generatorFamily === "endpoint-return-lookalike" ? 0.8 : null,
      equalPeakCommonGain: generatorFamily === "equal-peak-delayed-trajectory" ? 1.3 : null,
      equalPeakMemoryLagS: generatorFamily === "equal-peak-delayed-trajectory" ? 0.6 : null,
      equalPeakDelayS: generatorFamily === "equal-peak-delayed-trajectory" ? 0.3 : null,
    });
    const right = generateFixture026CausalLookalikePair({
      generatorFamily,
      ratios: rightRatios,
      timeStepS: 0.02,
      endpointGainIncrement: generatorFamily === "endpoint-return-lookalike" ? 0.4 : null,
      endpointBaseLagS: generatorFamily === "endpoint-return-lookalike" ? 0.4 : null,
      endpointScaledLagS: generatorFamily === "endpoint-return-lookalike" ? 0.8 : null,
      equalPeakCommonGain: generatorFamily === "equal-peak-delayed-trajectory" ? 1.3 : null,
      equalPeakMemoryLagS: generatorFamily === "equal-peak-delayed-trajectory" ? 0.6 : null,
      equalPeakDelayS: generatorFamily === "equal-peak-delayed-trajectory" ? 0.3 : null,
    });
    assert.deepEqual(left.base.slice(0, commonPrefix.length), right.base.slice(0, commonPrefix.length));
    assert.deepEqual(left.scaled.slice(0, commonPrefix.length), right.scaled.slice(0, commonPrefix.length));
  }

  const equalPeakWorlds = generateFixture026Worlds({ seed: "1540001", config: smokeConfig })
    .filter((world) => world.generator_family === "equal-peak-delayed-trajectory");
  assert.equal(equalPeakWorlds.length, FIXTURE_026_HISTORY_FAMILIES.length);
  assert.ok(new Set(equalPeakWorlds.map((world) => (
    JSON.stringify(world.trace.map((sample) => sample.output_base_y))
  ))).size > 1);
});

test("all public seeds satisfy the frozen response-shape and multilabel semantic invariants", () => {
  const worlds = [];
  for (let seed = 1540001; seed <= 1540064; seed += 1) {
    const generated = generateFixture026Worlds({ seed: String(seed), config: smokeConfig });
    const cells = generated.filter((world) => world.validation.trace_valid)
      .map((world) => `${world.generator_family}|${world.history_family}`);
    assert.equal(cells.length, FIXTURE_026_VALID_CELLS_PER_SEED);
    assert.equal(new Set(cells).size, FIXTURE_026_VALID_CELLS_PER_SEED);
    worlds.push(...generated);
  }
  assert.deepEqual(new Set(worlds.map((world) => world.history_family)), new Set(FIXTURE_026_HISTORY_FAMILIES));
  const valid = worlds.filter((world) => world.validation.trace_valid);
  assert.ok(valid.every((world) => world.trace.every((sample) => (
    sample.input_base_u >= smokeConfig.input_floor_u
    && sample.input_scaled_u >= smokeConfig.input_floor_u
  ))));
  const byFamily = Object.fromEntries(FIXTURE_026_VALID_FAMILIES.map((label) => [
    label,
    valid.filter((world) => world.generator_family === label),
  ]));
  assert.ok(byFamily["exact-scale-symmetry"].every((world) => (
    computeTrajectoryDiagnostics(world.trace, smokeConfig).trajectory_discrepancy
      <= smokeConfig.exact_discrepancy_tolerance
  )));
  assert.ok(byFamily["approximate-scale-symmetry"].every((world) => {
    const score = computeTrajectoryDiagnostics(world.trace, smokeConfig).trajectory_discrepancy;
    return score >= smokeConfig.approximate_discrepancy_floor
      && score <= smokeConfig.approximate_discrepancy_ceiling;
  }));
  assert.ok(byFamily["endpoint-return-lookalike"].every((world) => {
    const score = computeTrajectoryDiagnostics(world.trace, smokeConfig);
    const properties = computeFixture026SemanticProperties(world.trace, smokeConfig);
    return properties.finite_horizon_endpoint_return === true
      && score.trajectory_discrepancy > smokeConfig.approximate_discrepancy_ceiling;
  }));
  assert.ok(byFamily["equal-peak-delayed-trajectory"].every((world) => {
    const score = computeTrajectoryDiagnostics(world.trace, smokeConfig);
    return score.peak_discrepancy <= smokeConfig.peak_tolerance
      && score.latency_discrepancy_s > 0
      && score.trajectory_discrepancy > smokeConfig.approximate_discrepancy_ceiling;
  }));
  assert.ok(byFamily["static-ratio"].every((world) => {
    const score = computeTrajectoryDiagnostics(world.trace, smokeConfig);
    return score.static_fit_rmse <= smokeConfig.exact_discrepancy_tolerance
      && world.trace.every((sample) => sample.reference_origin === "frozen-initial-background");
  }));
  assert.ok(valid.every((world) => world.semantic_properties !== null));
  assert.ok(byFamily["static-ratio"].every((world) => (
    world.semantic_properties.paired_trajectory_match === "exact"
    && world.semantic_properties.causal_memory_status === "unassessed"
  )));
  assert.ok(byFamily["equal-peak-delayed-trajectory"].every((world) => (
    world.semantic_properties.peak_amplitude_equal === true
    && world.semantic_properties.finite_horizon_endpoint_return === true
    && world.semantic_properties.causal_memory_status === "unassessed"
    && computeTrajectoryDiagnostics(world.trace, smokeConfig).latency_discrepancy_s > 0
  )));
});

test("all corruption sentinels fail the interface before diagnostic classification including future normalization", () => {
  const invalid = [];
  for (let seed = 1540001; seed <= 1540064; seed += 1) {
    invalid.push(...generateFixture026Worlds({ seed: String(seed), config: smokeConfig })
      .filter((world) => world.generator_family === "malformed-sentinel"));
  }
  assert.deepEqual(new Set(invalid.map((world) => world.corruption)), new Set([
    "time-order", "checksum", "unit-token", "future-normalization",
  ]));
  assert.ok(invalid.every((world) => !world.validation.trace_valid));

  const valid = generateFixture026Worlds({ seed: "1540001", config: smokeConfig })
    .find((world) => world.validation.trace_valid);
  const altered = valid.trace.map((sample) => ({ ...sample }));
  altered[10].reference_origin = "full-trajectory-mean";
  altered[10].checksum = observationChecksum(altered[10]);
  const checked = validateObservationTrace(altered, smokeConfig);
  assert.equal(checked.checksum_valid, true);
  assert.equal(checked.causal_reference_valid, false);
  assert.equal(checked.trace_valid, false);
});

test("policy projections expose no evaluator fields and keep full trajectories separate from summaries", () => {
  const world = generateFixture026Worlds({ seed: "1540001", config: smokeConfig })
    .find((candidate) => candidate.generator_family === "equal-peak-delayed-trajectory");
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
  assert.equal(JSON.stringify(full).includes("equal-peak-delayed-trajectory"), false);
  assert.equal(JSON.stringify(summary).includes("equal-peak-delayed-trajectory"), false);
  assert.equal(Object.hasOwn(full.observation[0], "reference_origin"), false);
  assert.equal(Object.hasOwn(full.observation[0], "checksum"), false);
  assert.throws(() => assertPolicyViewFirewall({
    ...summary,
    generator_family: world.generator_family,
  }), /leaked evaluator/);
  assert.throws(() => assertPolicyViewFirewall({ ...summary, reference_origin: "frozen-initial-background" }), /leaked evaluator/);
});

test("policy field projection exposes no public identity-dictionary key or value", () => {
  const worlds = [];
  for (let seed = 1540001; seed <= 1540064; seed += 1) {
    worlds.push(...generateFixture026Worlds({ seed: String(seed), config: smokeConfig }));
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
  assert.deepEqual(
    Object.keys(schema.properties.parameters.properties).sort(),
    [...FIXTURE_026_PARAMETER_KEYS].sort(),
  );
});

test("standard JSON Schema and runtime agree on uint64 seeds and the 24-world grid", async () => {
  const declared = JSON.parse(await readFile(
    "experiments/workstation/fixture-026/output.schema.json",
    "utf8",
  ));
  const schema = { ...declared };
  delete schema.$schema;
  const validateSchema = createAjv({ allErrors: true }).compile(schema);

  const accepted = fixture();
  accepted.seed = "18446744073709551615";
  accepted.world_index = 23;
  rehash(accepted);
  assert.equal(validateSchema(accepted), true, JSON.stringify(validateSchema.errors));
  assert.equal(assertFixture026Record(accepted), accepted);

  const familyParameters = {
    "exact-scale-symmetry": {
      causal_reference_tau_s: 0.8,
    },
    "approximate-scale-symmetry": {
      causal_reference_tau_s: 0.8,
      approximate_additive_amplitude_y: 0.04,
    },
    "endpoint-return-lookalike": {
      endpoint_gain_increment: 0.4,
      endpoint_base_lag_s: 0.4,
      endpoint_scaled_lag_s: 0.8,
    },
    "equal-peak-delayed-trajectory": {
      equal_peak_common_gain: 1.3,
      equal_peak_memory_lag_s: 0.6,
      equal_peak_delay_s: 0.3,
    },
    "static-ratio": {},
  };
  for (const [generatorFamily, nonNullParameters] of Object.entries(familyParameters)) {
    const record = fixture();
    record.generator_family = generatorFamily;
    record.predicted_generator_family = generatorFamily;
    for (const field of FIXTURE_026_PARAMETER_KEYS.slice(3)) record.parameters[field] = null;
    Object.assign(record.parameters, nonNullParameters);
    rehash(record);
    assert.equal(validateSchema(record), true, JSON.stringify(validateSchema.errors));
    assert.equal(assertFixture026Record(record), record);
  }

  for (const mutation of [
    { seed: "18446744073709551616" },
    { seed: "01" },
    { world_index: 24 },
  ]) {
    const rejected = { ...fixture(), ...mutation };
    rehash(rejected);
    assert.equal(validateSchema(rejected), false, JSON.stringify(mutation));
    assert.throws(() => assertFixture026Record(rejected), /runtime contract/);
  }

  for (const mutate of [
    (record) => { record.parameters.causal_reference_tau_s = null; },
    (record) => { record.parameters.approximate_additive_amplitude_y = 0.04; },
    (record) => { record.parameters.endpoint_base_lag_s = 0.4; },
  ]) {
    const rejected = fixture();
    mutate(rejected);
    rehash(rejected);
    assert.equal(validateSchema(rejected), false, JSON.stringify(rejected.parameters));
    assert.throws(() => assertFixture026Record(rejected), /runtime contract/);
  }
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

test("raw event contract accepts uint64 maximum and rejects noncanonical or overflowing seeds", () => {
  const maximum = fixture();
  maximum.seed = "18446744073709551615";
  rehash(maximum);
  assert.equal(assertFixture026Record(maximum), maximum);
  for (const seed of ["01", "18446744073709551616", "9".repeat(10_000)]) {
    const invalid = fixture();
    invalid.seed = seed;
    rehash(invalid);
    assert.throws(() => assertFixture026Record(invalid), /runtime contract/);
  }
});

test("invalid observations cannot charge accepted classification, diagnostic scoring, state, or serialized policy-view bytes", () => {
  const invalid = fixture();
  invalid.generator_family = "malformed-sentinel";
  invalid.corruption = "future-normalization";
  invalid.gate_decision = "record-invalid";
  invalid.trace_valid = false;
  invalid.causal_reference_valid = false;
  invalid.predicted_generator_family = "malformed-sentinel";
  invalid.semantic_properties_evaluated = false;
  invalid.semantic_properties = null;
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
