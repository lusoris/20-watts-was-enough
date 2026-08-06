import assert from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { generateOpportunities } from "./generator.mjs";
import { executeFilesystemDecision } from "./filesystem-track.mjs";
import { decide } from "./policies.mjs";
import { analyzeRun, runExperiment, validateRun } from "./runner.mjs";

const benchmarkRoot = path.dirname(new URL(import.meta.url).pathname.replace(/^\/(.:)/, "$1"));
const config = JSON.parse(await readFile(path.join(benchmarkRoot, "configs", "smoke.json"), "utf8"));
const golden = JSON.parse(await readFile(path.join(benchmarkRoot, "golden-smoke.json"), "utf8"));

test("generator is deterministic and does not use scheduling state", () => {
  assert.deepEqual(generateOpportunities(config, 101), generateOpportunities(config, 101));
  assert.notDeepEqual(generateOpportunities(config, 101), generateOpportunities(config, 202));
});

test("conditioned SPRT uses the declared evidence correlation", () => {
  const opportunity = generateOpportunities(config, 101)[0];
  const lowCorrelation = decide("conditioned-sprt", opportunity, { ...config, cheap_evidence_correlation: 0.1 });
  const highCorrelation = decide("conditioned-sprt", opportunity, { ...config, cheap_evidence_correlation: 0.9 });
  assert.notEqual(lowCorrelation.score, highCorrelation.score);
  assert.ok([1, 2].includes(lowCorrelation.observations));
});

test("filesystem reset removes the staged trace and commit crosses the boundary", async () => {
  const temporary = await mkdtemp(path.join(os.tmpdir(), "20w-c010-fs-"));
  try {
    const [resetOpportunity, commitOpportunity] = generateOpportunities(config, 303);
    const reset = await executeFilesystemDecision(temporary, resetOpportunity, { stage: true, commit: false, reset: true });
    assert.equal(reset.rollbackComplete, true);
    assert.equal(reset.stageExists, false);
    assert.equal(reset.durableExists, false);
    const commit = await executeFilesystemDecision(temporary, commitOpportunity, { stage: true, commit: true, reset: false });
    assert.equal(commit.commitComplete, true);
    assert.equal(commit.stageExists, false);
    assert.equal(commit.durableExists, true);
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
    assert.equal(first.run.records, golden.records);
    const firstSummary = await analyzeRun(path.join(temporary, "a"));
    const secondSummary = await analyzeRun(path.join(temporary, "b"));
    assert.deepEqual(firstSummary, secondSummary);
    assert.equal(firstSummary.measured_energy_j, null);
    assert.equal(firstSummary.interpretation.includes("no superiority"), true);
    assert.deepEqual(await analyzeRun(path.join(temporary, "a")), firstSummary);
    const validation = await validateRun(path.join(temporary, "a"));
    assert.equal(validation.valid, true);
    assert.equal(validation.records, golden.records);
  } finally {
    assert.ok(temporary.startsWith(os.tmpdir()));
    await rm(temporary, { recursive: true, force: true });
  }
});
