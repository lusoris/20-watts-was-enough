import assert from "node:assert/strict";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";

import {
  analyzeFixture007,
  executeFixture007,
  main,
  prepareFixture007,
  validateFixture007Output,
} from "./runner.mjs";

const root = process.cwd();
const temporaryRoot = path.join(root, "tmp");

async function temporaryOutput(prefix) {
  await mkdir(temporaryRoot, { recursive: true });
  const parent = await mkdtemp(path.join(temporaryRoot, prefix));
  return { parent, output: path.join(parent, "run") };
}

test("smoke preparation declares its exact bounded event count", async () => {
  const prepared = await prepareFixture007("smoke");
  assert.deepEqual(prepared, {
    valid: true,
    artifact: "fixture-007",
    profile: "smoke",
    seeds: 2,
    opportunities_per_seed: 64,
    events: 512,
    measured_energy_required: false,
    claim_eligible: false,
  });
});

test("null-space smoke run exposes false specificity without beating the mature active null", async () => {
  const fixture = await temporaryOutput("fixture-007-run-");
  try {
    await executeFixture007({ profile: "smoke", output: fixture.output });
    const summary = await analyzeFixture007(fixture.output);
    const validation = await validateFixture007Output(fixture.output);
    assert.equal(summary.decision, "diagnostic-pass");
    assert.equal(summary.claim_eligible, false);
    assert.equal(summary.scientific_result, false);
    assert.equal(summary.metrics["mature-selective"].abstention_rate, 1);
    assert.deepEqual(
      summary.metrics["mature-active"],
      summary.metrics["operator-qualified-active"],
    );
    assert.ok(summary.metrics["unqualified-point"].false_specificity_rate >= 0.25);
    assert.deepEqual(validation, {
      valid: true,
      run_id: summary.run_id,
      decision: "diagnostic-pass",
    });
  } finally {
    assert.ok(fixture.parent.startsWith(temporaryRoot));
    await rm(fixture.parent, { recursive: true, force: true });
  }
});

test("identical profile and seeds reproduce byte-identical raw ledgers", async () => {
  const left = await temporaryOutput("fixture-007-left-");
  const right = await temporaryOutput("fixture-007-right-");
  try {
    await executeFixture007({ profile: "smoke", output: left.output });
    await executeFixture007({ profile: "smoke", output: right.output });
    assert.equal(
      await readFile(path.join(left.output, "raw-events.jsonl"), "utf8"),
      await readFile(path.join(right.output, "raw-events.jsonl"), "utf8"),
    );
  } finally {
    await rm(left.parent, { recursive: true, force: true });
    await rm(right.parent, { recursive: true, force: true });
  }
});

test("full development profile executes every frozen seed and acceptance check", async () => {
  const fixture = await temporaryOutput("fixture-007-development-");
  try {
    const execution = await executeFixture007({
      profile: "development",
      output: fixture.output,
    });
    assert.equal(execution.run.seeds.length, 4);
    assert.equal(execution.run.total_events, 4 * 512 * 4);
    const summary = await analyzeFixture007(fixture.output);
    assert.equal(summary.profile, "development");
    assert.equal(summary.decision, "diagnostic-pass");
    assert.ok(Object.values(summary.checks).every(Boolean));
    assert.equal((await validateFixture007Output(fixture.output)).valid, true);
  } finally {
    await rm(fixture.parent, { recursive: true, force: true });
  }
});

test("analysis refuses a corrupted append-only event", async () => {
  const fixture = await temporaryOutput("fixture-007-corrupt-");
  try {
    await executeFixture007({ profile: "smoke", output: fixture.output });
    const rawPath = path.join(fixture.output, "raw-events.jsonl");
    const rows = (await readFile(rawPath, "utf8")).trimEnd().split("\n");
    const first = JSON.parse(rows[0]);
    first.base_observation += 1;
    rows[0] = JSON.stringify(first);
    await writeFile(rawPath, `${rows.join("\n")}\n`);
    await assert.rejects(() => analyzeFixture007(fixture.output), /runtime contract/);
  } finally {
    await rm(fixture.parent, { recursive: true, force: true });
  }
});

test("CLI parsing refuses implicit outputs and unknown options", async () => {
  await assert.rejects(
    () => main(["node", "runner.mjs", "smoke", "--profile", "smoke"]),
    /requires --output/,
  );
  await assert.rejects(
    () => main(["node", "runner.mjs", "prepare", "--profile", "smoke", "--oracle", "yes"]),
    /Unknown or duplicate/,
  );
});
