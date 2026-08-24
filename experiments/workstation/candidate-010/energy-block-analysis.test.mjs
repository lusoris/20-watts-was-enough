import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test, { after, before } from "node:test";

import {
  EnergyBlockAnalysisError,
  analyzeEnergyBlocks,
  createEnergyBlockAnalysisPlan,
  createEnergyBlockOutcomeSummary,
} from "./energy-block-analysis.mjs";
import {
  buildCounterbalancedEnergyBlockSchedule,
  hashEnergyAcquisitionObservation,
  importEnergyBlockFiles,
} from "./energy-acquisition.mjs";
import {
  EXTERNAL_ENERGY_CONTRACT_VERSION,
  evaluateExternalEnergyReading,
  hashProvenanceReviewRecord,
} from "./energy-provider.mjs";
import { runEnergyBlockFixture } from "./energy-block-runner.mjs";

function canonical(value) {
  if (Array.isArray(value)) return `[${value.map(canonical).join(",")}]`;
  if (value && typeof value === "object") {
    return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${canonical(value[key])}`).join(",")}}`;
  }
  return JSON.stringify(value);
}

function rehash(document, digestField) {
  delete document[digestField];
  document[digestField] = createHash("sha256").update(canonical(document)).digest("hex");
  return document;
}

function hash(value) {
  return createHash("sha256").update(value).digest("hex");
}

function scheduleFixture() {
  const scenarios = [
    { scenario_id: "scenario-a", task_family: "signed-publication", backend_id: "publication-fixture-v1" },
    { scenario_id: "scenario-b", task_family: "actuator-command", backend_id: "actuator-fixture-v1" },
  ];
  const seeds = [101, 202, 303];
  const opportunitiesPerBlock = 5;
  return buildCounterbalancedEnergyBlockSchedule({
    run_id: "energy-analysis-fixture-run",
    scenarios,
    seeds,
    arms: ["threshold", "reset-coupled"],
    ordered_input_manifests: scenarios.flatMap((scenario) => seeds.map((seed) => ({
      input_manifest_id: `inputs-${scenario.scenario_id}-${seed}`,
      scenario_id: scenario.scenario_id,
      seed,
      ordered_opportunity_ids: Array.from(
        { length: opportunitiesPerBlock },
        (_, index) => `${scenario.scenario_id}:${seed}:opportunity-${index}`,
      ),
    }))),
    opportunities_per_block: opportunitiesPerBlock,
    opportunity_repetitions: 1,
    measurement_repetitions: 2,
    warmup_opportunities: 2,
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
  });
}

function energyFor(block) {
  if (block.phase.startsWith("idle-")) return 30 + block.repetition;
  const seedOffset = new Map([[101, -15], [202, 0], [303, 20]]).get(block.seed);
  const scenarioOffset = block.scenario_id === "scenario-a" ? 0 : 7;
  const repetitionOffset = block.repetition * 3;
  return (block.arm === "reset-coupled" ? 75 : 100) + seedOffset + scenarioOffset + repetitionOffset;
}

function rawReading(block, index) {
  const startedAt = new Date(Date.UTC(2026, 7, 24, 10, 0, 0) + index * 20_000).toISOString();
  const endedAt = new Date(Date.parse(startedAt) + 10_000).toISOString();
  const startWh = 100 + index;
  return {
    contract_version: EXTERNAL_ENERGY_CONTRACT_VERSION,
    reading_id: `synthetic-hardware-contract-reading-${index}`,
    record_kind: "hardware-observation",
    provider: {
      type: "external-meter",
      medium: "wall",
      provider_id: "synthetic-provider-for-contract-test",
      meter_id: "synthetic-meter-for-contract-test",
      boundary: "synthetic workload host at AC inlet",
      hardware_configuration: "contract test only; no physical reading represented",
      software_telemetry: false,
    },
    calibration: {
      calibration_id: "synthetic-calibration-for-contract-test",
      calibrated_at: "2026-01-01T00:00:00.000Z",
      valid_until: "2027-01-01T00:00:00.000Z",
      relative_standard_uncertainty: 0.01,
      coverage_factor: 2,
      traceability_reference: "synthetic contract test; not metrological evidence",
    },
    interval: {
      started_at: startedAt,
      ended_at: endedAt,
      clock_id: "synthetic-meter-clock",
      clock_uncertainty_s: 0.05,
      clock_discontinuity_observed: false,
    },
    integrity: { meter_reset_observed: false, negative_reading_observed: false },
    measurement: {
      method: "counter-delta",
      start: { value: startWh, unit: "Wh", observed_at: startedAt },
      end: { value: startWh + energyFor(block) / 3600, unit: "Wh", observed_at: endedAt },
    },
  };
}

function reviewFor(reading, index) {
  const measured = evaluateExternalEnergyReading(reading).measured;
  const unsigned = {
    schema: 1,
    review_id: `synthetic-contract-review-${index}`,
    reviewer_id: "synthetic-reviewer",
    reviewed_at: "2026-08-24T12:00:00.000Z",
    decision: "approved",
    observation_sha256: hashEnergyAcquisitionObservation(measured),
    notes: "synthetic hardware-shaped contract test; not physical evidence",
  };
  return { ...unsigned, review_sha256: hashProvenanceReviewRecord(unsigned) };
}

function outcomesFor(schedule, transform = (value) => value) {
  return schedule.blocks.filter((block) => block.phase === "measure").map((block) => {
    const correctCommits = block.arm === "reset-coupled" ? 3 : 4;
    return transform(createEnergyBlockOutcomeSummary({
      schedule,
      block_id: block.block_id,
      correct_commits: correctCommits,
    }), block);
  });
}

function planFor(overrides = {}) {
  return createEnergyBlockAnalysisPlan({
    plan_id: "energy-block-plan-contract-test",
    candidate_arm: "reset-coupled",
    baseline_arm: "threshold",
    minimum_independent_seeds: 3,
    confidence_level: 0.95,
    ...overrides,
  });
}

function expectCode(action, code) {
  assert.throws(
    action,
    (error) => error instanceof EnergyBlockAnalysisError && error.code === code,
  );
}

let temporary;
let schedule;
let acquisition;
let outcomes;
let executionBundle;

function deterministicClock() {
  let utcStep = 0;
  let monotonic = 0n;
  return {
    now_utc() {
      const value = new Date(Date.UTC(2026, 7, 24, 9, 0, 0, utcStep)).toISOString();
      utcStep += 1;
      return value;
    },
    monotonic_ns() {
      const value = monotonic;
      monotonic += 1_000_000n;
      return value;
    },
  };
}

function fixtureAdapter() {
  const resources = () => ({
    cpu_user_us: 10,
    cpu_system_us: 2,
    max_rss_bytes: 4096,
    read_bytes: 12,
    written_bytes: 8,
    operation_count: 1,
  });
  return {
    adapter_id: "energy-analysis-contract-adapter",
    adapter_version: "1.0.0",
    fixture_only: true,
    implementation_sha256: hash("energy analysis contract adapter v1"),
    async execute_work_unit(input) {
      const correctFloor = input.arm === "reset-coupled" ? 3 : 4;
      return {
        schema: 1,
        status: input.opportunity_index < correctFloor ? "correct-commit" : "no-commit",
        result_sha256: hash(canonical(input)),
        resources: resources(),
      };
    },
    async execute_idle_block(input) {
      return {
        schema: 1,
        status: "idle-complete",
        result_sha256: hash(canonical(input)),
        resources: { ...resources(), operation_count: 0 },
      };
    },
  };
}

before(async () => {
  temporary = await mkdtemp(path.join(os.tmpdir(), "20w-c010-energy-analysis-"));
  schedule = scheduleFixture();
  const schedulePath = path.join(temporary, "schedule.json");
  await writeFile(schedulePath, `${JSON.stringify(schedule, null, 2)}\n`, { flag: "wx" });
  const imports = [];
  for (const [index, block] of schedule.blocks.filter((row) => row.observed).entries()) {
    const reading = rawReading(block, index);
    const review = reviewFor(reading, index);
    const rawPath = path.join(temporary, `raw-${index}.json`);
    const reviewPath = path.join(temporary, `review-${index}.json`);
    await writeFile(rawPath, `${JSON.stringify(reading, null, 2)}\n`);
    await writeFile(reviewPath, `${JSON.stringify(review, null, 2)}\n`);
    imports.push({
      block_id: block.block_id,
      raw_reading_path: rawPath,
      provenance_review_path: reviewPath,
    });
  }
  acquisition = (await importEnergyBlockFiles({
    schedule,
    imports,
    outputPath: path.join(temporary, "acquisition.json"),
  })).bundle;
  outcomes = outcomesFor(schedule);
  executionBundle = (await runEnergyBlockFixture({
    schedulePath,
    outputDirectory: path.join(temporary, "execution"),
    adapter: fixtureAdapter(),
    clock: deterministicClock(),
  })).bundle;
});

after(async () => {
  await rm(temporary, { recursive: true, force: true });
});

test("current acquisition output composes directly and inference counts seeds, never blocks or scenarios", () => {
  const report = analyzeEnergyBlocks({
    schedule,
    acquisition,
    block_outcomes: outcomes,
    analysis_plan: planFor(),
  });
  assert.equal(report.descriptive_units.independent_seed_count, 3);
  assert.equal(report.descriptive_units.scenario_count, 2);
  assert.equal(report.descriptive_units.measurement_block_count, 24);
  assert.equal(report.descriptive_units.block_pair_count, 12);
  assert.equal(report.descriptive_units.block_and_scenario_units_counted_as_independent_n, 0);
  assert.equal(report.aggregate.degrees_of_freedom, 2);
  assert.ok(Math.abs(report.aggregate.student_t_critical - 4.3026527297) < 1e-8);
  assert.equal(report.seed_estimates.length, 3);
  assert.ok(report.seed_estimates.every((row) => (
    row.candidate.measurement_block_count === 4
    && row.baseline.measurement_block_count === 4
    && row.candidate.scenario_count === 2
    && row.baseline.scenario_count === 2
  )));
  assert.equal(report.claim_eligible, false);
  assert.match(report.claim_eligibility, /release authority.*gatekeeping.*promotion/u);
  assert.match(report.uncertainty.clock_treatment, /not converted to joules/u);
  assert.match(report.uncertainty.idle_treatment, /no-subtraction/u);
});

test("the current energy-block runner bundle is accepted directly without a central shape adapter", () => {
  const report = analyzeEnergyBlocks({
    schedule,
    acquisition,
    execution_bundle: executionBundle,
    analysis_plan: planFor(),
  });
  assert.equal(report.outcome_source, "validated-fixture-energy-block-execution-bundle");
  assert.equal(report.descriptive_units.independent_seed_count, 3);
  assert.ok(report.seed_estimates.every((row) => (
    row.candidate.correct_commits === 12 && row.baseline.correct_commits === 16
  )));
  assert.equal(report.claim_eligible, false);
});

test("the ratio of sums is formed only after every repeated block and scenario is aggregated inside a seed", () => {
  const report = analyzeEnergyBlocks({ schedule, acquisition, block_outcomes: outcomes, analysis_plan: planFor() });
  for (const row of report.seed_estimates) {
    const candidateBlocks = schedule.blocks.filter((block) => (
      block.phase === "measure" && block.seed === row.seed && block.arm === "reset-coupled"
    ));
    const expectedEnergy = candidateBlocks.reduce((sum, block) => {
      const observation = acquisition.observations.find((entry) => entry.block.block_id === block.block_id).observation;
      return sum + observation.value_j;
    }, 0);
    assert.equal(row.candidate.correct_commits, 12);
    assert.ok(Math.abs(row.candidate.gross_energy_j - expectedEnergy) < 1e-9);
    assert.ok(Math.abs(row.candidate.joules_per_correct_commit - expectedEnergy / 12) < 1e-9);
  }
});

test("a zero seed-arm correct-commit denominator is a typed refusal and is never silently dropped", () => {
  const hostile = outcomesFor(schedule, (summary, block) => (
    block.seed === 202 && block.arm === "reset-coupled"
      ? createEnergyBlockOutcomeSummary({ schedule, block_id: block.block_id, correct_commits: 0 })
      : summary
  ));
  expectCode(
    () => analyzeEnergyBlocks({ schedule, acquisition, block_outcomes: hostile, analysis_plan: planFor() }),
    "ZERO_CORRECT_COMMITS",
  );
});

test("missing and schedule-inconsistent block summaries refuse with distinct typed failures", () => {
  expectCode(
    () => analyzeEnergyBlocks({
      schedule,
      acquisition,
      block_outcomes: outcomes.slice(1),
      analysis_plan: planFor(),
    }),
    "INCOMPLETE_BLOCKS",
  );
  const hostile = structuredClone(outcomes);
  hostile[0].arm = "reset-coupled";
  rehash(hostile[0], "summary_sha256");
  expectCode(
    () => analyzeEnergyBlocks({ schedule, acquisition, block_outcomes: hostile, analysis_plan: planFor() }),
    "INCONSISTENT_BLOCK",
  );
});

test("a powered minimum is enforced against unique seeds rather than the much larger block count", () => {
  expectCode(
    () => analyzeEnergyBlocks({
      schedule,
      acquisition,
      block_outcomes: outcomes,
      analysis_plan: planFor({ minimum_independent_seeds: 4 }),
    }),
    "INSUFFICIENT_INDEPENDENT_SEEDS",
  );
});

test("review approval and its self-digest are independently revalidated", () => {
  const hostile = structuredClone(acquisition);
  hostile.observations[0].review.decision = "rehearsal-only";
  rehash(hostile, "acquisition_sha256");
  expectCode(
    () => analyzeEnergyBlocks({ schedule, acquisition: hostile, block_outcomes: outcomes, analysis_plan: planFor() }),
    "INVALID_REVIEW_ELIGIBILITY",
  );
});

test("expired calibration is a typed analysis refusal even when an acquisition digest is recomputed", () => {
  const hostile = structuredClone(acquisition);
  hostile.observations[0].raw_reading.calibration.valid_until = "2026-02-01T00:00:00.000Z";
  rehash(hostile, "acquisition_sha256");
  expectCode(
    () => analyzeEnergyBlocks({ schedule, acquisition: hostile, block_outcomes: outcomes, analysis_plan: planFor() }),
    "INVALID_CALIBRATION_ELIGIBILITY",
  );
});

test("clock evidence above the frozen ceiling is refused before estimation", () => {
  const hostile = structuredClone(acquisition);
  const row = hostile.observations[0];
  row.raw_reading.interval.clock_uncertainty_s = 0.2;
  const measured = evaluateExternalEnergyReading(row.raw_reading).measured;
  row.observation = {
    ...measured,
    allocation: "energy-measurement-block",
    block_ownership: row.observation.block_ownership,
    claim_eligibility: "hardware-block-pending-aggregate-analysis-contract",
  };
  row.review.observation_sha256 = hashEnergyAcquisitionObservation(measured);
  row.review.review_sha256 = hashProvenanceReviewRecord(row.review);
  rehash(hostile, "acquisition_sha256");
  expectCode(
    () => analyzeEnergyBlocks({ schedule, acquisition: hostile, block_outcomes: outcomes, analysis_plan: planFor() }),
    "INVALID_CLOCK_ELIGIBILITY",
  );
});

test("hardware-shaped test fixtures cannot enter by changing only the record-kind label", () => {
  const hostile = structuredClone(acquisition);
  hostile.observations[0].raw_reading.record_kind = "test-fixture";
  rehash(hostile, "acquisition_sha256");
  expectCode(
    () => analyzeEnergyBlocks({ schedule, acquisition: hostile, block_outcomes: outcomes, analysis_plan: planFor() }),
    "INVALID_METER_ELIGIBILITY",
  );
});
