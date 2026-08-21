import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { generateOpportunities } from "./generator.mjs";
import { executeFilesystemTrial } from "./filesystem-track.mjs";
import { armNames, decide } from "./policies.mjs";
import { analyzeRun, attachEnergyReading, runExperiment, validateRun } from "./runner.mjs";

const benchmarkRoot = path.dirname(new URL(import.meta.url).pathname.replace(/^\/(.:)/, "$1"));
const config = JSON.parse(await readFile(path.join(benchmarkRoot, "configs", "smoke.json"), "utf8"));
const golden = JSON.parse(await readFile(path.join(benchmarkRoot, "golden-smoke.json"), "utf8"));

function deterministicSummary(summary) {
  return {
    ...summary,
    arms: Object.fromEntries(Object.entries(summary.arms).map(([arm, row]) => {
      const deterministic = { ...row };
      delete deterministic.filesystem_boundary_ms;
      delete deterministic.mean_filesystem_boundary_ms;
      return [arm, deterministic];
    })),
  };
}

test("generator is deterministic and does not use scheduling state", () => {
  assert.deepEqual(generateOpportunities(config, 101), generateOpportunities(config, 101));
  assert.notDeepEqual(generateOpportunities(config, 101), generateOpportunities(config, 202));
  assert.equal("verifier" in generateOpportunities(config, 101)[0], false);
});

test("conditioned SPRT uses the declared evidence correlation", () => {
  const opportunity = generateOpportunities(config, 101)[0];
  const lowCorrelation = decide("conditioned-sprt", opportunity, { ...config, cheap_evidence_correlation: 0.1 });
  const highCorrelation = decide("conditioned-sprt", opportunity, { ...config, cheap_evidence_correlation: 0.9 });
  assert.notEqual(lowCorrelation.score, highCorrelation.score);
  assert.ok([1, 2].includes(lowCorrelation.observations));
});

test("temporary execution reveals a constructed trace only to eligible policies", async () => {
  const temporary = await mkdtemp(path.join(os.tmpdir(), "20w-c010-fs-"));
  try {
    const opportunity = generateOpportunities(config, 303)[0];
    const revealed = await executeFilesystemTrial({
      root: path.join(temporary, "revealed"),
      opportunity,
      arm: "reset-coupled",
      config,
      revealTrace: true,
      decideWithTrace: (trace) => ({ stage: true, commit: trace < 0, reset: !(trace < 0) }),
    });
    const withheld = await executeFilesystemTrial({
      root: path.join(temporary, "withheld"),
      opportunity,
      arm: "reset-coupled-no-trace",
      config,
      revealTrace: false,
      decideWithTrace: (trace) => {
        assert.equal(trace, null);
        return { stage: true, commit: false, reset: true };
      },
    });
    assert.equal(Number.isFinite(revealed.revealedVerifier), true);
    assert.equal(withheld.revealedVerifier, null);
    assert.equal(revealed.filesystem.trace_output_sha256, withheld.filesystem.trace_output_sha256);
    assert.equal(revealed.filesystem.staged_bytes_written, withheld.filesystem.staged_bytes_written);
    assert.equal(revealed.decision.commit ? revealed.filesystem.commitComplete : revealed.filesystem.rollbackComplete, true);
    assert.equal(withheld.filesystem.rollbackComplete, true);
  } finally {
    assert.ok(temporary.startsWith(os.tmpdir()));
    await rm(temporary, { recursive: true, force: true });
  }
});

test("smoke scientific payload and analysis are reproducible", async () => {
  const temporary = await mkdtemp(path.join(os.tmpdir(), "20w-c010-run-"));
  try {
    const first = await runExperiment({ config, seeds: [101, 202], outputDirectory: path.join(temporary, "a") });
    const second = await runExperiment({ config, seeds: [101, 202], outputDirectory: path.join(temporary, "b") });
    assert.equal(first.run.scientific_payload_sha256, second.run.scientific_payload_sha256);
    assert.equal(first.run.config_sha256, golden.config_sha256);
    assert.equal(first.run.scientific_payload_sha256, golden.scientific_payload_sha256);
    assert.equal(first.run.hash_chain_sha256, golden.hash_chain_sha256);
    assert.equal(first.run.ordered_seed_pack_sha256, golden.ordered_seed_pack_sha256);
    assert.equal(first.run.records, golden.records);
    const checkpoint = JSON.parse(await readFile(path.join(temporary, "a", "provenance", "checkpoint.json"), "utf8"));
    assert.equal(checkpoint.completed_work_units_sha256, golden.completed_work_units_sha256);
    assert.equal(checkpoint.checkpoint_sha256, golden.checkpoint_sha256);
    const firstSummary = await analyzeRun(path.join(temporary, "a"));
    const secondSummary = await analyzeRun(path.join(temporary, "b"));
    assert.deepEqual(deterministicSummary(firstSummary), deterministicSummary(secondSummary));
    assert.equal(firstSummary.measured_energy_j, null);
    assert.equal(firstSummary.interpretation.includes("no superiority"), true);
    assert.deepEqual(await analyzeRun(path.join(temporary, "a")), firstSummary);
    const validation = await validateRun(path.join(temporary, "a"));
    assert.equal(validation.valid, true);
    assert.equal(validation.records, golden.records);
    const events = (await readFile(path.join(temporary, "a", "raw", "events.ndjson"), "utf8"))
      .trim().split(/\r?\n/).map(JSON.parse);
    assert.deepEqual(new Set(events.map((event) => event.arm)), new Set(armNames));
    assert.ok(events.every((event) => event.filesystem?.boundary === "filesystem-stage-execute-finalize-v1"));
    assert.ok(events.every((event) => event.decision.stage && event.decision.commit !== event.decision.reset));
    assert.ok(events.some((event) => event.arm === "reset-coupled" && event.trace.revealed));
    assert.ok(events.every((event) => event.arm !== "reset-coupled-no-trace" || !event.trace.revealed));
  } finally {
    assert.ok(temporary.startsWith(os.tmpdir()));
    await rm(temporary, { recursive: true, force: true });
  }
});

test("runner resumes from its raw ledger without changing scientific results", async () => {
  const temporary = await mkdtemp(path.join(os.tmpdir(), "20w-c010-resume-runner-"));
  const resumable = path.join(temporary, "resumable");
  const uninterrupted = path.join(temporary, "uninterrupted");
  const smallConfig = { ...config, opportunities_per_seed: 2, checkpoint_interval_records: 3 };
  try {
    const partial = await runExperiment({
      config: smallConfig,
      seeds: [101],
      outputDirectory: resumable,
      stopAfterRecords: 7,
    });
    assert.equal(partial.complete, false);
    assert.equal(partial.run.records, 7);

    const resumed = await runExperiment({
      config: smallConfig,
      seeds: [101],
      outputDirectory: resumable,
      resume: true,
    });
    const baseline = await runExperiment({
      config: smallConfig,
      seeds: [101],
      outputDirectory: uninterrupted,
    });
    assert.equal(resumed.complete, true);
    assert.equal(resumed.resumed, true);
    assert.equal(resumed.run.scientific_payload_sha256, baseline.run.scientific_payload_sha256);
    assert.equal(resumed.run.hash_chain_sha256, baseline.run.hash_chain_sha256);
    assert.equal((await validateRun(resumable)).valid, true);

    await assert.rejects(
      runExperiment({
        config: { ...smallConfig, threshold: 99 },
        seeds: [101],
        outputDirectory: resumable,
        resume: true,
      }),
      /Resume config differs/,
    );
    await assert.rejects(
      runExperiment({
        config: smallConfig,
        seeds: [202],
        outputDirectory: resumable,
        resume: true,
      }),
      /Resume seed order differs/,
    );
  } finally {
    assert.ok(temporary.startsWith(os.tmpdir()));
    await rm(temporary, { recursive: true, force: true });
  }
});

test("runner binds external energy provenance without allocating it to arms", async () => {
  const temporary = await mkdtemp(path.join(os.tmpdir(), "20w-c010-energy-runner-"));
  const output = path.join(temporary, "run");
  const readingPath = path.join(temporary, "reading.json");
  try {
    const result = await runExperiment({
      config: { ...config, opportunities_per_seed: 1 },
      seeds: [101],
      outputDirectory: output,
    });
    const reading = {
      contract_version: "candidate-010.external-energy-reading.v1",
      reading_id: "runner-fixture-only",
      record_kind: "test-fixture",
      provider: {
        type: "external-meter",
        medium: "wall",
        provider_id: "fixture-provider",
        meter_id: "fixture-not-hardware",
        boundary: "fixture whole-run boundary",
        hardware_configuration: "fixture only",
        software_telemetry: false,
      },
      calibration: {
        calibration_id: "fixture-not-a-certificate",
        calibrated_at: "2026-01-01T00:00:00.000Z",
        valid_until: "2027-01-01T00:00:00.000Z",
        relative_standard_uncertainty: 0.01,
        coverage_factor: 2,
        traceability_reference: "test fixture only",
      },
      interval: {
        started_at: result.run.started_utc,
        ended_at: result.run.completed_utc,
        clock_id: "fixture-clock",
        clock_uncertainty_s: 0.001,
        clock_discontinuity_observed: false,
      },
      integrity: { meter_reset_observed: false, negative_reading_observed: false },
      measurement: {
        method: "counter-delta",
        start: { value: 1, unit: "Wh", observed_at: result.run.started_utc },
        end: { value: 1.1, unit: "Wh", observed_at: result.run.completed_utc },
      },
    };
    await writeFile(readingPath, `${JSON.stringify(reading, null, 2)}\n`, "utf8");
    const energy = await attachEnergyReading(output, readingPath);
    assert.equal(energy.measured.claim_eligibility, "fixture-ineligible");
    assert.equal(energy.arm_level_energy_claim_eligible, false);
    const summary = await analyzeRun(output);
    assert.ok(Math.abs(summary.measured_energy_j - 360) < 1e-9);
    assert.equal(summary.external_energy.allocation, "whole-run-only");
    const validation = await validateRun(output);
    assert.equal(validation.valid, true);
    assert.equal(validation.external_energy_bound, true);
    assert.equal(validation.arm_level_energy_claim_eligible, false);
  } finally {
    assert.ok(temporary.startsWith(os.tmpdir()));
    await rm(temporary, { recursive: true, force: true });
  }
});

test("hash chain rejects raw-ledger corruption", async () => {
  const temporary = await mkdtemp(path.join(os.tmpdir(), "20w-c010-corrupt-"));
  const output = path.join(temporary, "run");
  try {
    await runExperiment({
      config: { ...config, opportunities_per_seed: 1 },
      seeds: [101],
      outputDirectory: output,
    });
    const rawPath = path.join(output, "raw", "events.ndjson");
    const lines = (await readFile(rawPath, "utf8")).trim().split(/\r?\n/);
    const first = JSON.parse(lines[0]);
    first.outcome.consequence_weighted_loss += 1;
    lines[0] = JSON.stringify(first);
    await writeFile(rawPath, `${lines.join("\n")}\n`, "utf8");
    await assert.rejects(validateRun(output), /hash-chain mismatch|scientific payload digest/);
  } finally {
    assert.ok(temporary.startsWith(os.tmpdir()));
    await rm(temporary, { recursive: true, force: true });
  }
});
