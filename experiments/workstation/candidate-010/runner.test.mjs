import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { generateOpportunities } from "./generator.mjs";
import { executeFilesystemTrial } from "./filesystem-track.mjs";
import { armNames, decide } from "./policies.mjs";
import { analyzeRun, runExperiment, validateRun } from "./runner.mjs";

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
    assert.equal(first.run.records, golden.records);
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
