import assert from "node:assert/strict";
import test from "node:test";
import {
  EnergyContractError,
  bindExternalEnergyObservation,
  evaluateExternalEnergyReading,
  EXTERNAL_ENERGY_CONTRACT_VERSION,
  hashNormalizedExternalEnergyObservation,
  hashProvenanceReviewRecord,
  MODELED_ENERGY_CONTRACT_VERSION,
  NORMALIZED_EXTERNAL_ENERGY_OBSERVATION,
  validateBoundExternalEnergyObservation,
} from "./energy-provider.mjs";

function counterFixture(overrides = {}) {
  const fixture = {
    contract_version: EXTERNAL_ENERGY_CONTRACT_VERSION,
    reading_id: "fixture-counter-001",
    record_kind: "test-fixture",
    provider: {
      type: "external-meter",
      medium: "wall",
      provider_id: "fixture-provider",
      meter_id: "fixture-meter-not-hardware",
      boundary: "fixture workload host at AC inlet",
      hardware_configuration: "fixture only; no physical workstation represented",
      software_telemetry: false,
    },
    calibration: {
      calibration_id: "fixture-calibration-not-a-certificate",
      calibrated_at: "2026-01-01T00:00:00.000Z",
      valid_until: "2027-01-01T00:00:00.000Z",
      relative_standard_uncertainty: 0.01,
      coverage_factor: 2,
      traceability_reference: "test fixture; not metrological traceability",
    },
    interval: {
      started_at: "2026-08-21T10:00:00.000Z",
      ended_at: "2026-08-21T10:00:10.000Z",
      clock_id: "fixture-clock",
      clock_uncertainty_s: 0.001,
      clock_discontinuity_observed: false,
    },
    integrity: { meter_reset_observed: false, negative_reading_observed: false },
    measurement: {
      method: "counter-delta",
      start: { value: 1, unit: "Wh", observed_at: "2026-08-21T10:00:00.000Z" },
      end: { value: 1.1, unit: "Wh", observed_at: "2026-08-21T10:00:10.000Z" },
    },
  };
  return { ...fixture, ...overrides };
}

function expectCode(action, code) {
  assert.throws(action, (error) => error instanceof EnergyContractError && error.code === code);
}

function ownership(overrides = {}) {
  return {
    run_id: "run-001",
    pair_id: "pair-001",
    work_unit_id: "work-001-reset-coupled",
    scenario_id: "scenario-001",
    task_family: "signed-publication",
    backend_id: "signed-publication-backend-0",
    cluster_id: "cluster-001",
    opportunity_id: "opportunity-001",
    arm: "reset-coupled",
    interval_started_at: "2026-08-21T10:00:00.000Z",
    interval_ended_at: "2026-08-21T10:00:10.000Z",
    ...overrides,
  };
}

function approvedReview(observation, overrides = {}) {
  const review = {
    schema: 1,
    review_id: "review-001",
    reviewer_id: "metrology-reviewer-001",
    reviewed_at: "2026-08-21T11:00:00.000Z",
    decision: "approved",
    observation_sha256: hashNormalizedExternalEnergyObservation(observation),
    ...overrides,
  };
  return { ...review, review_sha256: hashProvenanceReviewRecord(review) };
}

test("counter fixtures exercise conversion but can never support a hardware-energy claim", () => {
  const result = evaluateExternalEnergyReading(counterFixture(), {
    modeledEnergy: {
      contract_version: MODELED_ENERGY_CONTRACT_VERSION,
      model_id: "fixture-resource-model-v1",
      value_j: 330,
      basis: "software-telemetry",
      calibrated: false,
    },
  });
  assert.ok(Math.abs(result.measured.value_j - 360) < 1e-9);
  assert.ok(Math.abs(result.measured.calibration_standard_uncertainty_j - 3.6) < 1e-9);
  assert.equal(result.measured.status, "fixture-only");
  assert.equal(result.measured.claim_eligibility, "fixture-ineligible");
  assert.equal(result.measured.kind, NORMALIZED_EXTERNAL_ENERGY_OBSERVATION);
  assert.equal(result.measured.binding, null);
  assert.deepEqual(
    { value: result.modeled.value_j, status: result.modeled.status, eligible: result.modeled.claim_eligible_as_measured_energy },
    { value: 330, status: "modeled-only", eligible: false },
  );
});

test("sampled power uses trapezoidal integration and preserves the fixture barrier", () => {
  const input = counterFixture({
    reading_id: "fixture-power-001",
    measurement: {
      method: "sampled-power",
      integration: "trapezoidal",
      samples: [
        { value: 10, unit: "W", observed_at: "2026-08-21T10:00:00.000Z" },
        { value: 20, unit: "W", observed_at: "2026-08-21T10:00:05.000Z" },
        { value: 10, unit: "W", observed_at: "2026-08-21T10:00:10.000Z" },
      ],
    },
  });
  const result = evaluateExternalEnergyReading(input);
  assert.equal(result.measured.value_j, 150);
  assert.equal(result.measured.sample_count, 3);
  assert.equal(result.modeled, null);
  assert.equal(result.measured.claim_eligibility, "fixture-ineligible");
});

test("software telemetry cannot enter through the measured provider", () => {
  const input = counterFixture();
  input.provider = { ...input.provider, type: "software-telemetry", software_telemetry: true };
  expectCode(() => evaluateExternalEnergyReading(input), "NON_EXTERNAL_PROVIDER");
});

test("modeled energy cannot be mislabeled as calibrated", () => {
  expectCode(() => evaluateExternalEnergyReading(counterFixture(), {
    modeledEnergy: {
      contract_version: MODELED_ENERGY_CONTRACT_VERSION,
      model_id: "bad-model",
      value_j: 330,
      basis: "software-telemetry",
      calibrated: true,
    },
  }), "INTEGRITY_FLAG");
});

test("counter decreases are rejected rather than guessed as rollover", () => {
  const input = counterFixture();
  input.measurement = { ...input.measurement, end: { ...input.measurement.end, value: 0.9 } };
  expectCode(() => evaluateExternalEnergyReading(input), "COUNTER_RESET_OR_ROLLOVER");
});

test("declared meter resets and negative conditions fail closed", () => {
  const reset = counterFixture();
  reset.integrity = { ...reset.integrity, meter_reset_observed: true };
  expectCode(() => evaluateExternalEnergyReading(reset), "INTEGRITY_FLAG");
  const negative = counterFixture();
  negative.measurement = { ...negative.measurement, start: { ...negative.measurement.start, value: -1 } };
  expectCode(() => evaluateExternalEnergyReading(negative), "OUT_OF_RANGE");
});

test("clock discontinuities, reversed samples, and boundary gaps fail closed", () => {
  const discontinuity = counterFixture();
  discontinuity.interval = { ...discontinuity.interval, clock_discontinuity_observed: true };
  expectCode(() => evaluateExternalEnergyReading(discontinuity), "INTEGRITY_FLAG");

  const reversed = counterFixture({
    measurement: {
      method: "sampled-power",
      integration: "trapezoidal",
      samples: [
        { value: 10, unit: "W", observed_at: "2026-08-21T10:00:00.000Z" },
        { value: 10, unit: "W", observed_at: "2026-08-21T10:00:08.000Z" },
        { value: 10, unit: "W", observed_at: "2026-08-21T10:00:07.000Z" },
        { value: 10, unit: "W", observed_at: "2026-08-21T10:00:10.000Z" },
      ],
    },
  });
  expectCode(() => evaluateExternalEnergyReading(reversed), "NON_MONOTONIC_CLOCK");

  const gap = counterFixture();
  gap.measurement = {
    ...gap.measurement,
    start: { ...gap.measurement.start, observed_at: "2026-08-21T10:00:01.000Z" },
  };
  expectCode(() => evaluateExternalEnergyReading(gap), "BOUNDARY_CLOCK_MISMATCH");
});

test("expired, future, or zero-uncertainty calibration is rejected", () => {
  const expired = counterFixture();
  expired.calibration = { ...expired.calibration, valid_until: "2026-08-21T10:00:09.000Z" };
  expectCode(() => evaluateExternalEnergyReading(expired), "EXPIRED_CALIBRATION");

  const future = counterFixture();
  future.calibration = { ...future.calibration, calibrated_at: "2026-08-21T10:00:01.000Z" };
  expectCode(() => evaluateExternalEnergyReading(future), "INVALID_CALIBRATION");

  const exact = counterFixture();
  exact.calibration = { ...exact.calibration, relative_standard_uncertainty: 0 };
  expectCode(() => evaluateExternalEnergyReading(exact), "OUT_OF_RANGE");
});

test("unknown versions, methods, and physical units are rejected", () => {
  expectCode(
    () => evaluateExternalEnergyReading(counterFixture({ contract_version: "candidate-010.external-energy-reading.v2" })),
    "UNSUPPORTED_VERSION",
  );
  const method = counterFixture();
  method.measurement = { ...method.measurement, method: "cpu-time-estimate" };
  expectCode(() => evaluateExternalEnergyReading(method), "INVALID_METHOD");
  const units = counterFixture();
  units.measurement = { ...units.measurement, start: { ...units.measurement.start, unit: "CPU-seconds" } };
  expectCode(() => evaluateExternalEnergyReading(units), "INVALID_UNIT");
});

test("a reviewed hardware observation binds to one exact paired work unit", () => {
  const evaluated = evaluateExternalEnergyReading(counterFixture({
    reading_id: "hardware-reading-001",
    record_kind: "hardware-observation",
  }));
  const assigned = ownership();
  const bound = bindExternalEnergyObservation(evaluated.measured, {
    ownership: assigned,
    provenanceReview: approvedReview(evaluated.measured),
  });
  assert.equal(bound.kind, NORMALIZED_EXTERNAL_ENERGY_OBSERVATION);
  assert.equal(bound.claim_eligibility, "claim-eligible-per-work-unit");
  assert.equal(bound.allocation, "paired-work-unit");
  assert.deepEqual(bound.binding.ownership, assigned);
  assert.equal(validateBoundExternalEnergyObservation(bound, assigned), bound);
});

test("fixture, modeled, whole-run envelope, and incomplete ownership cannot be promoted", () => {
  const fixture = evaluateExternalEnergyReading(counterFixture());
  expectCode(() => bindExternalEnergyObservation(fixture.measured, {
    ownership: ownership(),
    provenanceReview: approvedReview(fixture.measured),
  }), "INELIGIBLE_ENERGY_SOURCE");

  const evaluated = evaluateExternalEnergyReading(counterFixture({
    reading_id: "hardware-reading-002",
    record_kind: "hardware-observation",
  }), {
    modeledEnergy: {
      contract_version: MODELED_ENERGY_CONTRACT_VERSION,
      model_id: "model-only",
      value_j: 1,
      basis: "software telemetry",
      calibrated: false,
    },
  });
  expectCode(() => bindExternalEnergyObservation(evaluated.modeled, {
    ownership: ownership(),
    provenanceReview: {},
  }), "INVALID_NORMALIZED_OBSERVATION");
  expectCode(() => bindExternalEnergyObservation({ ...evaluated, allocation: "whole-run-only" }, {
    ownership: ownership(),
    provenanceReview: {},
  }), "INVALID_NORMALIZED_OBSERVATION");
  const incomplete = ownership();
  delete incomplete.pair_id;
  expectCode(() => bindExternalEnergyObservation(evaluated.measured, {
    ownership: incomplete,
    provenanceReview: approvedReview(evaluated.measured),
  }), "MISSING_IDENTITY");
});

test("binding fails on interval mismatch, unhashed review, and post-binding tampering", () => {
  const observation = evaluateExternalEnergyReading(counterFixture({
    reading_id: "hardware-reading-003",
    record_kind: "hardware-observation",
  })).measured;
  expectCode(() => bindExternalEnergyObservation(observation, {
    ownership: ownership({ interval_ended_at: "2026-08-21T10:00:11.000Z" }),
    provenanceReview: approvedReview(observation),
  }), "OWNERSHIP_INTERVAL_MISMATCH");

  const badReview = approvedReview(observation);
  badReview.reviewer_id = "attacker";
  expectCode(() => bindExternalEnergyObservation(observation, {
    ownership: ownership(),
    provenanceReview: badReview,
  }), "INVALID_REVIEW_HASH");

  const bound = bindExternalEnergyObservation(observation, {
    ownership: ownership(),
    provenanceReview: approvedReview(observation),
  });
  const tampered = structuredClone(bound);
  tampered.value_j += 1;
  expectCode(() => validateBoundExternalEnergyObservation(tampered, ownership()), "BOUND_OBSERVATION_TAMPER");
});
