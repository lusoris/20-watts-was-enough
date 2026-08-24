import assert from "node:assert/strict";
import test from "node:test";

import {
  CONFIRMATION_PREFLIGHT_VERSION,
  ConfirmationPreflightError,
  evaluateConfirmationPreflight,
} from "./confirmation-preflight.mjs";

const hash = (character) => character.repeat(64);

function validInput() {
  return {
    statistical_plan: {
      independent_unit: "seed",
      alpha_familywise: 0.05,
      power_target: 0.8,
      multiplicity_family_size: 3,
      planned_seed_count: 40,
      endpoints: [
        {
          id: "energy",
          test: "superiority",
          pilot_variance: 1,
          pilot_input_sha256: hash("a"),
          variance_unit: "paired-seed-contrast",
          minimum_relevant_effect: 0.6,
          noninferiority_margin: null,
        },
        {
          id: "false-commit",
          test: "noninferiority",
          pilot_variance: 0.04,
          pilot_input_sha256: hash("b"),
          variance_unit: "paired-seed-contrast",
          minimum_relevant_effect: null,
          noninferiority_margin: 0.1,
        },
      ],
    },
    design: {
      scenario_count: 24,
      arm_count: 7,
      opportunities_per_seed_scenario: 100,
      blocks_per_seed_scenario: 4,
    },
    pilot_projection: {
      projection_basis_sha256: hash("c"),
      p99_work_unit_time_ms: 2,
      p99_work_unit_bytes: 100,
      p99_meter_boundary_time_ms: 50,
      p99_block_index_bytes: 200,
      measurement_session_count: 24,
      p99_files_per_measurement_session: 3,
      fixed_artifact_files: 20,
      fixed_artifact_bytes: 1_000,
      meter_sample_rate_hz: 10,
      meter_bytes_per_sample: 16,
      setup_time_ms: 5_000,
    },
    resource_caps: {
      max_records: 1_000_000,
      max_measurement_blocks: 100_000,
      max_raw_bytes: 1_000_000_000,
      max_meter_log_bytes: 1_000_000_000,
      max_files: 1_000,
      max_wall_time_s: 100_000,
      minimum_free_disk_reserve_bytes: 1_000_000,
      available_free_disk_bytes: 10_000_000_000,
    },
    meter_block: {
      measurement_semantics: "block",
      minimum_actual_samples: 10,
      maximum_clock_uncertainty_ms: 2,
      minimum_block_duration_ms: 1_000,
      minimum_duration_to_clock_uncertainty_ratio: 100,
      meter_resolution_j: 0.01,
      expanded_measurement_uncertainty_j: 0.02,
      minimum_expected_block_energy_j: 0.2,
      minimum_energy_to_resolution_uncertainty_ratio: 10,
    },
    identities: Object.fromEntries([
      "hardware",
      "meter",
      "calibration",
      "clock",
      "thermal_protocol",
      "power_plan",
    ].map((name, index) => [name, {
      id: `${name}-fixture`,
      identity_sha256: String(index + 1).repeat(64),
    }])),
  };
}

function expectRefusal(input, code) {
  assert.throws(
    () => evaluateConfirmationPreflight(input),
    (error) => error instanceof ConfirmationPreflightError && error.code === code,
  );
}

test("produces a deterministic, claim-ineligible block preflight", () => {
  const input = validInput();
  const first = evaluateConfirmationPreflight(input);
  const second = evaluateConfirmationPreflight(structuredClone(input));

  assert.deepEqual(first, second);
  assert.equal(first.kind, CONFIRMATION_PREFLIGHT_VERSION);
  assert.equal(first.claim_eligible, false);
  assert.equal(first.seeds_generated, false);
  assert.equal(first.seeds_revealed, false);
  assert.equal(first.statistical_plan.independent_unit, "seed");
  assert.equal(first.projected_resources.records, 24 * 7 * 40 * 100);
  assert.equal(first.projected_resources.measurement_blocks, 24 * 7 * 40 * 4);
  assert.equal(Object.isFrozen(first), true);
  assert.match(first.preflight_sha256, /^[0-9a-f]{64}$/u);
});

test("rejects non-seed independence, generic N=2, and underpowered plans", () => {
  const wrongUnit = validInput();
  wrongUnit.statistical_plan.independent_unit = "scenario-seed";
  expectRefusal(wrongUnit, "INDEPENDENT_UNIT_REFUSED");

  const twoSeeds = validInput();
  twoSeeds.statistical_plan.planned_seed_count = 2;
  expectRefusal(twoSeeds, "GENERIC_TWO_SEEDS_REFUSED");

  const underpowered = validInput();
  underpowered.statistical_plan.planned_seed_count = 3;
  expectRefusal(underpowered, "UNDERPOWERED_PLAN");

  const meaninglessPower = validInput();
  meaninglessPower.statistical_plan.power_target = 0.5;
  expectRefusal(meaninglessPower, "INVALID_NUMBER");

  const multiplicityUndercount = validInput();
  multiplicityUndercount.statistical_plan.multiplicity_family_size = 1;
  expectRefusal(multiplicityUndercount, "MULTIPLICITY_UNDERCOUNT");
});

test("requires explicit effects, pilot variance, and hashed pilot inputs", () => {
  const absentEffect = validInput();
  absentEffect.statistical_plan.endpoints[0].minimum_relevant_effect = null;
  expectRefusal(absentEffect, "INVALID_NUMBER");

  const absentVariance = validInput();
  absentVariance.statistical_plan.endpoints[0].pilot_variance = 0;
  expectRefusal(absentVariance, "INVALID_NUMBER");

  const invalidPilotHash = validInput();
  invalidPilotHash.statistical_plan.endpoints[0].pilot_input_sha256 = "unhashed-pilot";
  expectRefusal(invalidPilotHash, "INVALID_HASH");

  const pseudoReplicatedVariance = validInput();
  pseudoReplicatedVariance.statistical_plan.endpoints[0].variance_unit = "scenario-seed";
  expectRefusal(pseudoReplicatedVariance, "INVALID_VARIANCE_UNIT");

  const noCalculation = validInput();
  noCalculation.statistical_plan.endpoints = [];
  expectRefusal(noCalculation, "MISSING_POWER_CALCULATION");
});

test("refuses per-event meter semantics and inadequate block thresholds", () => {
  const perEvent = validInput();
  perEvent.meter_block.measurement_semantics = "per-event";
  expectRefusal(perEvent, "PER_EVENT_ENERGY_REFUSED");

  const tooShort = validInput();
  tooShort.meter_block.minimum_block_duration_ms = 199;
  expectRefusal(tooShort, "METER_DURATION_TOO_SHORT");

  const tooLittleEnergy = validInput();
  tooLittleEnergy.meter_block.minimum_expected_block_energy_j = 0.19;
  expectRefusal(tooLittleEnergy, "METER_ENERGY_TOO_SMALL");

  const impossibleSamples = validInput();
  impossibleSamples.meter_block.minimum_actual_samples = 11;
  impossibleSamples.meter_block.minimum_block_duration_ms = 1_000;
  impossibleSamples.meter_block.minimum_duration_to_clock_uncertainty_ratio = 1;
  expectRefusal(impossibleSamples, "METER_SAMPLE_COUNT_UNREACHABLE");
});

test("enforces every resource cap and the doubled disk projection plus reserve", () => {
  const baseline = evaluateConfirmationPreflight(validInput());

  for (const [cap, projectedKey] of [
    ["max_records", "records"],
    ["max_measurement_blocks", "measurement_blocks"],
    ["max_raw_bytes", "raw_bytes"],
    ["max_meter_log_bytes", "meter_log_bytes"],
    ["max_files", "files"],
    ["max_wall_time_s", "wall_time_s"],
  ]) {
    const input = validInput();
    input.resource_caps[cap] = baseline.projected_resources[projectedKey] - 1;
    expectRefusal(input, "RESOURCE_CAP_EXCEEDED");
  }

  const lowDisk = validInput();
  lowDisk.resource_caps.available_free_disk_bytes = baseline.projected_resources.required_free_disk_bytes - 1;
  expectRefusal(lowDisk, "INSUFFICIENT_FREE_DISK");
});

test("requires exact hardware, meter, calibration, clock, thermal, and power identities", () => {
  const missingIdentity = validInput();
  delete missingIdentity.identities.clock;
  expectRefusal(missingIdentity, "INVALID_SHAPE");

  const unboundIdentity = validInput();
  unboundIdentity.identities.meter.identity_sha256 = "meter";
  expectRefusal(unboundIdentity, "INVALID_HASH");
});

test("rejects seed material and other undeclared fields rather than ignoring them", () => {
  const input = validInput();
  input.confirmation_seeds = [1, 2, 3];
  expectRefusal(input, "INVALID_SHAPE");
});

test("rejects projections that exceed safe integer precision", () => {
  const input = validInput();
  input.design.opportunities_per_seed_scenario = Number.MAX_SAFE_INTEGER;
  expectRefusal(input, "PROJECTION_OVERFLOW");
});
