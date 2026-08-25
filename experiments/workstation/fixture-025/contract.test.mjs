import assert from "node:assert/strict";
import test from "node:test";

import {
  FIXTURE_025_EVENT_CONTRACT_VERSION,
  assertFixture025Record,
  canonical,
  fixture025ScientificPayload,
  sha256,
} from "./contract.mjs";
import {
  FIXTURE_025_CLASSES,
  Pcg64Dxsm,
  diagnosticBundle,
  generateFixture025Worlds,
  fixture025StreamPreimage,
  publicSeedHex,
  validateExposedSpectrum,
  validateFixture025Config,
} from "./generator.mjs";
import {
  FIXTURE_025_AUDIT_SHA256,
  FIXTURE_025_IMPLEMENTED_TRACKS,
  FIXTURE_025_TRACK_CLAIMS,
  FIXTURE_025_TRACK_IDS,
  assertFixture025Registry,
  enumerateFixture025Candidates,
  extractFixture025Registry,
} from "./registry.mjs";
import { readFile } from "node:fs/promises";

const smokeConfig = Object.freeze({
  schema: 1,
  artifact: "fixture-025",
  profile: "smoke",
  worlds_per_seed: 5,
  frequency_count: 61,
  minimum_frequency_hz: 0.001,
  maximum_frequency_hz: 10000,
  diagnostic_bundles_cap: 9,
  harmonic_ratio_threshold: 0.0075,
  repeat_residual_threshold: 0.05,
  noise_fraction: 0.0005,
  max_loss: 100,
});

test("normative registry extraction freezes all ten tracks and candidate grids", async () => {
  const markdown = await readFile("experiments/fixtures/025-electrochemistry-interface-memory-degradation.md", "utf8");
  const registry = assertFixture025Registry(extractFixture025Registry(markdown));
  assert.deepEqual(Object.keys(registry.tracks), FIXTURE_025_TRACK_IDS);
  assert.deepEqual(FIXTURE_025_IMPLEMENTED_TRACKS, ["ECM-T03"]);
  assert.equal(FIXTURE_025_TRACK_CLAIMS["ECM-T03"], "C-1532");
  assert.equal(FIXTURE_025_AUDIT_SHA256.length, 64);
  for (const track of FIXTURE_025_TRACK_IDS) {
    assert.equal(enumerateFixture025Candidates(registry, track, "A").length, 16);
    assert.equal(enumerateFixture025Candidates(registry, track, "B").length, 64);
    assert.equal(enumerateFixture025Candidates(registry, track, "C").length, 64);
  }
});

function fixture(previous = "0".repeat(64), sequence = 0) {
  const payload = {
    schema: 1,
    contract_version: FIXTURE_025_EVENT_CONTRACT_VERSION,
    artifact: "fixture-025",
    track: "ECM-T03",
    run_id: "a".repeat(64),
    profile: "smoke",
    pack: "public-development",
    seed: 1539001,
    world_index: 0,
    world_id: "1539001:0",
    arm: "ordered-validity-gate",
    attempt: 0,
    units: { impedance: "Ohm", frequency: "Hz", time: "s", amplitude: "V", bytes: "B" },
    input_sha256: {
      audit: "1".repeat(64),
      fixture: "2".repeat(64),
      runner: "3".repeat(64),
      generator: "4".repeat(64),
      configuration: "5".repeat(64),
      schema: "6".repeat(64),
    },
    oracle_class: "valid-identifying",
    corruption: "none",
    decision: "valid-candidate-set",
    schema_valid: true,
    ordering_valid: true,
    checksum_valid: true,
    unit_valid: true,
    calibration_valid: true,
    amplitude_linear: true,
    kk_consistent: true,
    identifying: true,
    candidate_set_size: 1,
    diagnostic_bundles: 9,
    mechanism_fits: 1,
    samples_read: 58,
    bytes_read: 6131,
    bytes_written: 576,
    multiply_add_equivalents: 5000,
    invalid_error: 0,
    false_reject_error: 0,
    overclaim_error: 0,
    candidate_error: 0,
    fit_error: 0.001,
    loss: 0.01,
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

test("PCG64-DXSM and little-endian public-stream grammar are frozen", () => {
  const random = new Pcg64Dxsm(1560001);
  assert.equal(random.nextUint64().toString(16), "db41bf843271d096");
  assert.equal(random.nextUint64().toString(16), "59825f71530d3798");
  assert.equal(publicSeedHex(1560001), "C1CD170000000000");
  assert.equal(fixture025StreamPreimage({
    phase: "development",
    protocol: "ECM-T03",
    seed: 1560001,
    scope: "dgp",
    canonicalId: 0,
  }), "F025-v1|development|ECM-T03|C1CD170000000000|dgp|0");
});

test("generator is deterministic and balances all five public smoke classes", () => {
  assert.equal(validateFixture025Config(smokeConfig), smokeConfig);
  const left = generateFixture025Worlds({ seed: 1560001, config: smokeConfig });
  const right = generateFixture025Worlds({ seed: 1560001, config: smokeConfig });
  assert.deepEqual(left, right);
  assert.equal(left.length, 5);
  assert.deepEqual(new Set(left.map((world) => world.world_class)), new Set(FIXTURE_025_CLASSES));
  assert.ok(left.every((world) => world.samples.length === 61));
});

test("public record validation catches every schema/provenance corruption family", () => {
  const worlds = [];
  for (let seed = 1560001; seed < 1560021; seed += 1) {
    worlds.push(...generateFixture025Worlds({ seed, config: smokeConfig }));
  }
  const corrupt = worlds.filter((world) => world.world_class === "schema-provenance-invalid");
  assert.deepEqual(new Set(corrupt.map((world) => world.corruption)), new Set([
    "timestamp-swap",
    "frequency-duplicate",
    "unit-token",
    "calibration-version",
  ]));
  assert.ok(corrupt.every((world) => validateExposedSpectrum(world.samples).schema_valid === false));
  assert.ok(worlds.filter((world) => world.world_class !== "schema-provenance-invalid").every((world) => validateExposedSpectrum(world.samples).schema_valid));
});

test("registered diagnostic bundles expose nonlinear and repeat-inconsistent paths", () => {
  const worlds = generateFixture025Worlds({ seed: 1560001, config: smokeConfig });
  const nonlinear = worlds.find((world) => world.world_class === "nonlinear-out-of-scope");
  const inconsistent = worlds.find((world) => world.world_class === "kk-inconsistent");
  assert.ok(diagnosticBundle(nonlinear, 30).harmonic_ratio > smokeConfig.harmonic_ratio_threshold);
  assert.ok(diagnosticBundle(inconsistent, 0).repeat_residual > smokeConfig.repeat_residual_threshold);
  assert.throws(() => diagnosticBundle(inconsistent, 1), /not registered/);
});

test("raw event contract binds gate outputs, authority, sequence, and hash chain", () => {
  const first = fixture();
  assert.equal(assertFixture025Record(first, { sequence: 0, previousHash: "0".repeat(64) }), first);
  const second = fixture(first.integrity.record_sha256, 1);
  assert.equal(assertFixture025Record(second, { sequence: 1, previousHash: first.integrity.record_sha256 }), second);
  const tampered = { ...second, loss: second.loss + 1 };
  assert.throws(() => assertFixture025Record(tampered, { sequence: 1, previousHash: first.integrity.record_sha256 }), /runtime contract/);
  const authorityClaim = fixture();
  authorityClaim.claim_eligible = true;
  authorityClaim.integrity.record_sha256 = sha256(`${"0".repeat(64)}\n${canonical(fixture025ScientificPayload(authorityClaim))}`);
  assert.throws(() => assertFixture025Record(authorityClaim), /runtime contract/);
});

test("ordered record-invalid events cannot charge physics probes", () => {
  const invalid = fixture();
  invalid.oracle_class = "schema-provenance-invalid";
  invalid.corruption = "unit-token";
  invalid.decision = "record-invalid";
  invalid.schema_valid = false;
  invalid.unit_valid = false;
  invalid.amplitude_linear = false;
  invalid.kk_consistent = false;
  invalid.identifying = false;
  invalid.candidate_set_size = 0;
  invalid.diagnostic_bundles = 1;
  invalid.mechanism_fits = 0;
  invalid.integrity.record_sha256 = sha256(`${"0".repeat(64)}\n${canonical(fixture025ScientificPayload(invalid))}`);
  assert.throws(() => assertFixture025Record(invalid), /stop before physics probes/);
});
