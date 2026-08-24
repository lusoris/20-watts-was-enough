import assert from "node:assert/strict";
import { mkdir, mkdtemp, readFile, rm, symlink, unlink, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import {
  EnergyContractError,
  EXTERNAL_ENERGY_READING_SCHEMA,
  bindExternalEnergyObservation,
  evaluateExternalEnergyReading,
  EXTERNAL_ENERGY_CONTRACT_VERSION,
  hashNormalizedExternalEnergyObservation,
  hashProvenanceReviewRecord,
  MODELED_ENERGY_CONTRACT_VERSION,
  NORMALIZED_EXTERNAL_ENERGY_OBSERVATION,
  validateBoundExternalEnergyObservation,
} from "./energy-provider.mjs";
import {
  ENERGY_BLOCK_ACQUISITION_VERSION,
  EnergyAcquisitionError,
  buildCounterbalancedEnergyBlockSchedule,
  hashEnergyAcquisitionObservation,
  importEnergyBlockFiles,
  persistEnergyBlockSchedule,
} from "./energy-acquisition.mjs";

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

test("the machine-readable raw schema and runtime validator are both closed to extra fields", () => {
  assert.equal(EXTERNAL_ENERGY_READING_SCHEMA.additionalProperties, false);
  assert.deepEqual(
    [...EXTERNAL_ENERGY_READING_SCHEMA.required].sort(),
    ["calibration", "contract_version", "integrity", "interval", "measurement", "provider", "reading_id", "record_kind"],
  );
  const extraRoot = { ...counterFixture(), operator_guess: "not raw meter evidence" };
  expectCode(() => evaluateExternalEnergyReading(extraRoot), "INVALID_SHAPE");
  const extraMeasurement = counterFixture();
  extraMeasurement.measurement = { ...extraMeasurement.measurement, inferred_rollover: false };
  expectCode(() => evaluateExternalEnergyReading(extraMeasurement), "INVALID_SHAPE");
});

test("the operator template has the exact closed raw-reading field structure", async () => {
  const template = JSON.parse(await readFile(new URL("./energy-reading.template.json", import.meta.url), "utf8"));
  assert.deepEqual(Object.keys(template).sort(), [...EXTERNAL_ENERGY_READING_SCHEMA.required].sort());
  assert.deepEqual(
    Object.keys(template.provider).sort(),
    [...EXTERNAL_ENERGY_READING_SCHEMA.properties.provider.required].sort(),
  );
  assert.deepEqual(
    Object.keys(template.measurement).sort(),
    ["end", "method", "start"],
  );
  expectCode(() => evaluateExternalEnergyReading(template), "INVALID_CALIBRATION");
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

function rehearsalSchedule(overrides = {}) {
  const options = {
    run_id: "energy-rehearsal-run-001",
    scenarios: [{
      scenario_id: "confirmation-scenario-001",
      task_family: "signed-publication",
      backend_id: "synthetic-signed-publication-v1",
    }],
    seeds: [101],
    arms: ["threshold", "reset-coupled"],
    opportunities_per_block: 10_000,
    opportunity_repetitions: 1,
    measurement_repetitions: 1,
    warmup_opportunities: 1_000,
    meter_capability: {
      sample_interval_s: 1,
      energy_resolution_j: 1,
      minimum_block_duration_s: 10,
      minimum_energy_delta_j: 10,
      minimum_samples_per_block: 10,
      minimum_resolution_quanta: 10,
      maximum_clock_uncertainty_s: 0.1,
      minimum_signal_to_expanded_uncertainty: 10,
    },
    ...overrides,
  };
  options.ordered_input_manifests ??= options.scenarios.flatMap((scenario) => options.seeds.map((seed) => ({
    input_manifest_id: `inputs-${scenario.scenario_id}-${seed}`,
    scenario_id: scenario.scenario_id,
    seed,
    ordered_opportunity_ids: Array.from(
      { length: options.opportunities_per_block },
      (_, index) => `${scenario.scenario_id}:seed-${seed}:opportunity-${index}`,
    ),
  })));
  return buildCounterbalancedEnergyBlockSchedule(options);
}

function blockReading(block, index, recordKind = "test-fixture", overrides = {}) {
  const start = new Date(Date.UTC(2026, 7, 24, 10, 0, 0) + index * 20_000).toISOString();
  const end = new Date(Date.parse(start) + 10_000).toISOString();
  const reading = counterFixture({
    reading_id: `block-reading-${index}`,
    record_kind: recordKind,
    interval: {
      started_at: start,
      ended_at: end,
      clock_id: "operator-meter-clock-001",
      clock_uncertainty_s: 0.05,
      clock_discontinuity_observed: false,
    },
    measurement: {
      method: "counter-delta",
      start: { value: 100 + index, unit: "Wh", observed_at: start },
      end: { value: 100.01 + index, unit: "Wh", observed_at: end },
    },
    ...overrides,
  });
  const observation = evaluateExternalEnergyReading(reading).measured;
  const unsignedReview = {
    schema: 1,
    review_id: `block-review-${index}`,
    reviewer_id: "operator-reviewer-001",
    reviewed_at: "2026-08-24T12:00:00.000Z",
    decision: recordKind === "hardware-observation" ? "approved" : "rehearsal-only",
    observation_sha256: hashEnergyAcquisitionObservation(observation),
    notes: `reviewed schedule block ${block.block_id}; test data only`,
  };
  return {
    reading,
    review: { ...unsignedReview, review_sha256: hashProvenanceReviewRecord(unsignedReview) },
  };
}

async function writeBlockImports(directory, schedule, recordKind = "test-fixture", transform = (value) => value) {
  const imports = [];
  const observed = schedule.blocks.filter((block) => block.observed);
  for (const [index, block] of observed.entries()) {
    const value = transform(blockReading(block, index, recordKind), block, index);
    const raw = path.join(directory, `raw-${index}.json`);
    const review = path.join(directory, `review-${index}.json`);
    await writeFile(raw, `${JSON.stringify(value.reading, null, 2)}\n`);
    await writeFile(review, `${JSON.stringify(value.review, null, 2)}\n`);
    imports.push({
      block_id: block.block_id,
      raw_reading_path: raw,
      provenance_review_path: review,
    });
  }
  return imports;
}

test("counterbalanced block acquisition replaces unresolvable per-work-unit meter assignment", async () => {
  const temporary = await mkdtemp(path.join(os.tmpdir(), "20w-c010-energy-blocks-"));
  try {
    const schedule = rehearsalSchedule();
    const schedulePath = path.join(temporary, "energy-block-schedule.json");
    const frozenSchedule = await persistEnergyBlockSchedule({ schedule, outputPath: schedulePath });
    assert.equal(frozenSchedule.resumed, false);
    assert.equal((await persistEnergyBlockSchedule({ schedule, outputPath: schedulePath })).resumed, true);
    await assert.rejects(
      persistEnergyBlockSchedule({
        schedule: rehearsalSchedule({ run_id: "different-rehearsal-run" }),
        outputPath: schedulePath,
      }),
      (error) => error instanceof EnergyAcquisitionError && error.code === "SCHEDULE_RESUME_MISMATCH",
    );
    const observed = schedule.blocks.filter((block) => block.observed);
    assert.equal(schedule.claim_eligibility, "ineligible-until-aggregate-confirmatory-contract");
    assert.equal(schedule.analysis_contract_status, "not-implemented");
    assert.equal(observed.length, 4);
    assert.ok(observed.length < 10_000 * 2);
    assert.equal(schedule.blocks.filter((block) => block.phase === "warmup").length, 2);
    assert.equal(schedule.blocks.filter((block) => block.phase.startsWith("idle-")).length, 2);
    assert.deepEqual(
      schedule.blocks.filter((block) => block.phase === "measure").map((block) => block.arm).sort(),
      ["reset-coupled", "threshold"],
    );
    const measuredBlocks = schedule.blocks.filter((block) => block.phase === "measure");
    assert.equal(new Set(measuredBlocks.map((block) => block.block_pair_id)).size, 1);
    assert.equal(new Set(measuredBlocks.map((block) => block.paired_input_sha256)).size, 1);
    assert.match(schedule.aggregation_requirement, /gross joules per correct commit.*within seed/);

    const imports = await writeBlockImports(temporary, schedule);
    const outputPath = path.join(temporary, "energy-block-acquisition.json");
    const first = await importEnergyBlockFiles({ schedule, imports, outputPath });
    assert.equal(first.resumed, false);
    assert.equal(first.bundle.contract_version, ENERGY_BLOCK_ACQUISITION_VERSION);
    assert.equal(first.bundle.claim_eligible, false);
    assert.ok(first.bundle.observations.every((row) => (
      row.observation.claim_eligibility === "fixture-rehearsal-ineligible"
      && row.observation.allocation === "energy-measurement-block"
      && !("work_unit_id" in row.observation.block_ownership)
    )));
    const second = await importEnergyBlockFiles({ schedule, imports, outputPath });
    assert.equal(second.resumed, true);
    assert.equal(second.sha256, first.sha256);

    await writeFile(outputPath, `${await readFile(outputPath, "utf8")} `);
    await assert.rejects(
      importEnergyBlockFiles({ schedule, imports, outputPath }),
      (error) => error instanceof EnergyAcquisitionError && error.code === "RESUME_MISMATCH",
    );
  } finally {
    await rm(temporary, { recursive: true, force: true });
  }
});

test("the frozen block design is paired and bounded instead of pretending to meter millions of millisecond records", () => {
  const scenarios = Array.from({ length: 24 }, (_, index) => ({
    scenario_id: `confirmation-scenario-${index}`,
    task_family: index < 12 ? "signed-publication" : "actuator-command",
    backend_id: index < 12 ? "synthetic-signed-publication-v1" : "isolated-actuator-command-v1",
  }));
  const arms = [
    "threshold",
    "cascade",
    "conditioned-sprt",
    "selective-abstention",
    "retry-rollback",
    "independent-verifier",
    "reset-coupled",
  ];
  const schedule = rehearsalSchedule({
    scenarios,
    seeds: [101, 202],
    arms,
    measurement_repetitions: 2,
  });
  const measured = schedule.blocks.filter((block) => block.phase === "measure");
  const observed = schedule.blocks.filter((block) => block.observed);
  const perWorkUnitReadings = scenarios.length * 2 * 10_000 * arms.length;
  assert.equal(measured.length, scenarios.length * 2 * 2 * arms.length);
  assert.equal(observed.length, scenarios.length * 2 * 2 * (arms.length + 2));
  assert.ok(observed.length < perWorkUnitReadings / 1_000);
  assert.match(schedule.counterbalancing, /rotation with alternating reversal/);
  assert.deepEqual(schedule, rehearsalSchedule({
    scenarios,
    seeds: [101, 202],
    arms,
    measurement_repetitions: 2,
  }));
  for (const pairId of new Set(measured.map((block) => block.block_pair_id))) {
    const pair = measured.filter((block) => block.block_pair_id === pairId);
    assert.equal(pair.length, arms.length);
    assert.equal(new Set(pair.map((block) => block.paired_input_sha256)).size, 1);
    assert.deepEqual(pair.map((block) => block.arm).sort(), [...arms].sort());
  }
  assert.throws(
    () => rehearsalSchedule({
      meter_capability: {
        ...rehearsalSchedule().meter_capability,
        minimum_samples_per_block: 100,
      },
    }),
    (error) => error instanceof EnergyAcquisitionError && error.code === "UNRESOLVABLE_INTERVAL",
  );
});

test("paired block identity is sensitive to ordered opportunity substitution, order, and count", async () => {
  const original = rehearsalSchedule({ opportunities_per_block: 4 });
  const originalManifest = original.ordered_input_manifests[0];
  const reorderedIds = [...originalManifest.ordered_opportunity_ids];
  [reorderedIds[0], reorderedIds[1]] = [reorderedIds[1], reorderedIds[0]];
  const reordered = rehearsalSchedule({
    opportunities_per_block: 4,
    ordered_input_manifests: [{
      input_manifest_id: originalManifest.input_manifest_id,
      scenario_id: originalManifest.scenario_id,
      seed: originalManifest.seed,
      ordered_opportunity_ids: reorderedIds,
    }],
  });
  const substitutedIds = [...originalManifest.ordered_opportunity_ids];
  substitutedIds[0] = `${substitutedIds[0]}-substituted`;
  const substituted = rehearsalSchedule({
    opportunities_per_block: 4,
    ordered_input_manifests: [{
      input_manifest_id: originalManifest.input_manifest_id,
      scenario_id: originalManifest.scenario_id,
      seed: originalManifest.seed,
      ordered_opportunity_ids: substitutedIds,
    }],
  });
  const measuredHash = (schedule) => schedule.blocks.find((block) => block.phase === "measure").paired_input_sha256;
  assert.notEqual(measuredHash(original), measuredHash(reordered));
  assert.notEqual(measuredHash(original), measuredHash(substituted));
  assert.notEqual(original.schedule_sha256, reordered.schedule_sha256);
  assert.notEqual(original.schedule_sha256, substituted.schedule_sha256);
  assert.throws(
    () => rehearsalSchedule({
      opportunities_per_block: 4,
      ordered_input_manifests: [{
        input_manifest_id: originalManifest.input_manifest_id,
        scenario_id: originalManifest.scenario_id,
        seed: originalManifest.seed,
        ordered_opportunity_ids: originalManifest.ordered_opportunity_ids.slice(0, 3),
      }],
    }),
    (error) => error instanceof EnergyAcquisitionError && error.code === "INPUT_COUNT_MISMATCH",
  );

  const temporary = await mkdtemp(path.join(os.tmpdir(), "20w-c010-energy-input-tamper-"));
  try {
    const tampered = structuredClone(original);
    [
      tampered.ordered_input_manifests[0].ordered_opportunity_ids[0],
      tampered.ordered_input_manifests[0].ordered_opportunity_ids[1],
    ] = [
      tampered.ordered_input_manifests[0].ordered_opportunity_ids[1],
      tampered.ordered_input_manifests[0].ordered_opportunity_ids[0],
    ];
    await assert.rejects(
      persistEnergyBlockSchedule({ schedule: tampered, outputPath: path.join(temporary, "tampered.json") }),
      (error) => error instanceof EnergyAcquisitionError && error.code === "INVALID_SCHEDULE",
    );
  } finally {
    await rm(temporary, { recursive: true, force: true });
  }
});

test("block imports refuse missing, overlapping, duplicated, linked, and under-resolution readings", async (context) => {
  const temporary = await mkdtemp(path.join(os.tmpdir(), "20w-c010-energy-hostile-"));
  try {
    const schedule = rehearsalSchedule();
    const imports = await writeBlockImports(temporary, schedule);
    await assert.rejects(
      importEnergyBlockFiles({ schedule, imports: imports.slice(1), outputPath: path.join(temporary, "missing.json") }),
      (error) => error instanceof EnergyAcquisitionError && error.code === "INCOMPLETE_IMPORT",
    );
    await assert.rejects(
      importEnergyBlockFiles({
        schedule,
        imports: [{ ...imports[0] }, { ...imports[0] }, ...imports.slice(2)],
        outputPath: path.join(temporary, "duplicate.json"),
      }),
      (error) => error instanceof EnergyAcquisitionError
        && ["DUPLICATE_SOURCE_FILE", "DUPLICATE_OR_UNKNOWN_BLOCK"].includes(error.code),
    );

    const overlapDirectory = path.join(temporary, "overlap");
    await mkdir(overlapDirectory);
    const overlapImports = await writeBlockImports(overlapDirectory, schedule, "test-fixture", (value, block, index) => {
      if (index !== 1) return value;
      const first = blockReading(block, 0);
      first.reading.reading_id = "block-reading-overlap";
      const observation = evaluateExternalEnergyReading(first.reading).measured;
      const unsigned = {
        ...first.review,
        review_id: "block-review-overlap",
        observation_sha256: hashEnergyAcquisitionObservation(observation),
      };
      delete unsigned.review_sha256;
      first.review = { ...unsigned, review_sha256: hashProvenanceReviewRecord(unsigned) };
      return first;
    });
    await assert.rejects(
      importEnergyBlockFiles({ schedule, imports: overlapImports, outputPath: path.join(temporary, "overlap.json") }),
      (error) => error instanceof EnergyAcquisitionError && error.code === "OVERLAPPING_READING",
    );

    const shortDirectory = path.join(temporary, "short");
    await mkdir(shortDirectory);
    const shortImports = await writeBlockImports(shortDirectory, schedule, "test-fixture", (value, block, index) => {
      if (index !== 0) return value;
      const end = new Date(Date.parse(value.reading.interval.started_at) + 1_000).toISOString();
      value.reading.interval.ended_at = end;
      value.reading.measurement.end.observed_at = end;
      const observation = evaluateExternalEnergyReading(value.reading).measured;
      const unsigned = { ...value.review, observation_sha256: hashEnergyAcquisitionObservation(observation) };
      delete unsigned.review_sha256;
      value.review = { ...unsigned, review_sha256: hashProvenanceReviewRecord(unsigned) };
      return value;
    });
    await assert.rejects(
      importEnergyBlockFiles({ schedule, imports: shortImports, outputPath: path.join(temporary, "short.json") }),
      (error) => error instanceof EnergyAcquisitionError && error.code === "UNRESOLVABLE_INTERVAL",
    );

    const sparseSamplesDirectory = path.join(temporary, "sparse-samples");
    await mkdir(sparseSamplesDirectory);
    const sparseSampleImports = await writeBlockImports(
      sparseSamplesDirectory,
      schedule,
      "test-fixture",
      (value, block, index) => {
        if (index !== 0) return value;
        const { started_at: startedAt, ended_at: endedAt } = value.reading.interval;
        value.reading.measurement = {
          method: "sampled-power",
          integration: "trapezoidal",
          samples: [
            { value: 10, unit: "W", observed_at: startedAt },
            { value: 10, unit: "W", observed_at: endedAt },
          ],
        };
        const observation = evaluateExternalEnergyReading(value.reading).measured;
        const unsigned = { ...value.review, observation_sha256: hashEnergyAcquisitionObservation(observation) };
        delete unsigned.review_sha256;
        value.review = { ...unsigned, review_sha256: hashProvenanceReviewRecord(unsigned) };
        return value;
      },
    );
    await assert.rejects(
      importEnergyBlockFiles({
        schedule,
        imports: sparseSampleImports,
        outputPath: path.join(temporary, "sparse-samples.json"),
      }),
      (error) => error instanceof EnergyAcquisitionError && error.code === "UNRESOLVABLE_INTERVAL",
    );

    const outOfOrderDirectory = path.join(temporary, "out-of-order");
    await mkdir(outOfOrderDirectory);
    const outOfOrderImports = await writeBlockImports(
      outOfOrderDirectory,
      schedule,
      "test-fixture",
      (value, block, index) => index === 1 ? blockReading(block, -1) : value,
    );
    await assert.rejects(
      importEnergyBlockFiles({
        schedule,
        imports: outOfOrderImports,
        outputPath: path.join(temporary, "out-of-order.json"),
      }),
      (error) => error instanceof EnergyAcquisitionError && error.code === "ORDER_MISMATCH",
    );

    const linkedRaw = path.join(temporary, "linked-raw.json");
    try {
      await symlink(imports[0].raw_reading_path, linkedRaw, "file");
      await assert.rejects(
        importEnergyBlockFiles({
          schedule,
          imports: [{ ...imports[0], raw_reading_path: linkedRaw }, ...imports.slice(1)],
          outputPath: path.join(temporary, "linked.json"),
        }),
        (error) => error instanceof EnergyAcquisitionError && error.code === "INVALID_SOURCE_FILE",
      );
      await unlink(linkedRaw);
    } catch (error) {
      if (!["EPERM", "EACCES", "ENOTSUP", "UNKNOWN"].includes(error?.code)) throw error;
      context.diagnostic(`symlink hostile unavailable on this host: ${error.code}`);
    }
  } finally {
    await rm(temporary, { recursive: true, force: true });
  }
});

test("even reviewed hardware blocks remain pending until aggregate analysis is preregistered", async () => {
  const temporary = await mkdtemp(path.join(os.tmpdir(), "20w-c010-energy-hardware-contract-"));
  try {
    const schedule = rehearsalSchedule();
    const imports = await writeBlockImports(temporary, schedule, "hardware-observation");
    const result = await importEnergyBlockFiles({
      schedule,
      imports,
      outputPath: path.join(temporary, "hardware-blocks.json"),
    });
    assert.equal(result.bundle.claim_eligible, false);
    assert.ok(result.bundle.observations.every((row) => (
      row.observation.status === "measured-external"
      && row.observation.claim_eligibility === "hardware-block-pending-aggregate-analysis-contract"
    )));
  } finally {
    await rm(temporary, { recursive: true, force: true });
  }
});
