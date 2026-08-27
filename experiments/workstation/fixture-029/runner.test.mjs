import assert from "node:assert/strict";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";

import {
  analyzeFixture029, executeFixture029, main, prepareFixture029, validateFixture029Output,
} from "./runner.mjs";

const temporaryRoot = path.join(process.cwd(), "tmp");

async function temporaryOutput(prefix) {
  await mkdir(temporaryRoot, { recursive: true });
  const parent = await mkdtemp(path.join(temporaryRoot, prefix));
  return { parent, output: path.join(parent, "run") };
}

async function cleanup(...fixtures) {
  for (const fixture of fixtures) {
    assert.ok(fixture.parent.startsWith(temporaryRoot));
    await rm(fixture.parent, { recursive: true, force: true });
  }
}

test("prepare fixes CMB-X04 to C-1580 and bounded public work", async () => {
  assert.deepEqual(await prepareFixture029("smoke"), {
    valid: true,
    artifact: "fixture-029",
    track: "CMB-X04",
    execution_claims: ["C-1580"],
    profile: "smoke",
    partition: "public-development-only",
    seeds: 2,
    worlds_per_seed: 8,
    artifacts_per_world: 24,
    arms: 8,
    work_units: 128,
    confirmation_seeds_created: false,
    held_out_seeds_created: false,
    measured_energy_required: false,
    energy_conclusion_allowed: false,
    claim_eligible: false,
    no_result: true,
  });
});

test("smoke run exercises gates, strong nulls, and mechanism controls without authority", async () => {
  const fixture = await temporaryOutput("fixture-029-smoke-");
  try {
    const execution = await executeFixture029({ profile: "smoke", output: fixture.output });
    assert.equal(execution.complete, true);
    const analysis = await analyzeFixture029(fixture.output);
    assert.equal(analysis.decision, "diagnostic-pass");
    assert.ok(Object.values(analysis.checks).every(Boolean));
    assert.equal(analysis.metrics["X04-PERSIST"].accepted_service_nsu, 0);
    assert.ok(analysis.metrics["X04-RETRY"].logical_operations > 0);
    assert.ok(analysis.metrics["X04-REPLICA"].transported_bytes > 0);
    assert.equal(analysis.claim_eligible, false);
    assert.equal(analysis.energy_conclusion_allowed, false);
    assert.deepEqual(await validateFixture029Output(fixture.output), {
      valid: true, run_id: analysis.run_id, decision: "diagnostic-pass", no_result: true,
    });
  } finally {
    await cleanup(fixture);
  }
});

test("same public inputs produce byte-identical append-only ledgers", async () => {
  const left = await temporaryOutput("fixture-029-left-");
  const right = await temporaryOutput("fixture-029-right-");
  try {
    await executeFixture029({ profile: "smoke", output: left.output });
    await executeFixture029({ profile: "smoke", output: right.output });
    assert.equal(
      await readFile(path.join(left.output, "raw-events.jsonl"), "utf8"),
      await readFile(path.join(right.output, "raw-events.jsonl"), "utf8"),
    );
  } finally {
    await cleanup(left, right);
  }
});

test("resume reconstructs authority from raw events and reproduces uninterrupted output", async () => {
  const resumed = await temporaryOutput("fixture-029-resume-");
  const complete = await temporaryOutput("fixture-029-complete-");
  try {
    const partial = await executeFixture029({ profile: "smoke", output: resumed.output, maxWorkUnits: 11 });
    assert.equal(partial.complete, false);
    const finished = await executeFixture029({ profile: "smoke", output: resumed.output, resume: true });
    assert.equal(finished.complete, true);
    await executeFixture029({ profile: "smoke", output: complete.output });
    assert.equal(
      await readFile(path.join(resumed.output, "raw-events.jsonl"), "utf8"),
      await readFile(path.join(complete.output, "raw-events.jsonl"), "utf8"),
    );
  } finally {
    await cleanup(resumed, complete);
  }
});

test("analysis rejects a modified event in the hash-bound ledger", async () => {
  const fixture = await temporaryOutput("fixture-029-corrupt-");
  try {
    await executeFixture029({ profile: "smoke", output: fixture.output });
    const rawPath = path.join(fixture.output, "raw-events.jsonl");
    const rows = (await readFile(rawPath, "utf8")).trimEnd().split("\n");
    const first = JSON.parse(rows[0]);
    first.resources.logical_operations += 1;
    rows[0] = JSON.stringify(first);
    await writeFile(rawPath, `${rows.join("\n")}\n`);
    await assert.rejects(() => analyzeFixture029(fixture.output), /runtime contract|hash/i);
  } finally {
    await cleanup(fixture);
  }
});

test("ledger rejects reordered, duplicated, and torn construction records", async () => {
  const reordered = await temporaryOutput("fixture-029-reorder-");
  const duplicated = await temporaryOutput("fixture-029-duplicate-");
  const torn = await temporaryOutput("fixture-029-torn-");
  try {
    await Promise.all([
      executeFixture029({ profile: "smoke", output: reordered.output }),
      executeFixture029({ profile: "smoke", output: duplicated.output }),
      executeFixture029({ profile: "smoke", output: torn.output }),
    ]);
    const reorderPath = path.join(reordered.output, "raw-events.jsonl");
    const reorderRows = (await readFile(reorderPath, "utf8")).trimEnd().split("\n");
    [reorderRows[0], reorderRows[1]] = [reorderRows[1], reorderRows[0]];
    await writeFile(reorderPath, `${reorderRows.join("\n")}\n`);
    await assert.rejects(() => analyzeFixture029(reordered.output), /runtime contract|hash/i);

    const duplicatePath = path.join(duplicated.output, "raw-events.jsonl");
    const duplicateRaw = await readFile(duplicatePath, "utf8");
    await writeFile(duplicatePath, `${duplicateRaw}${duplicateRaw.split("\n")[0]}\n`);
    await assert.rejects(() => analyzeFixture029(duplicated.output), /duplicate|runtime contract|hash/i);

    const tornPath = path.join(torn.output, "raw-events.jsonl");
    const tornRaw = await readFile(tornPath, "utf8");
    await writeFile(tornPath, tornRaw.slice(0, -1));
    await assert.rejects(() => analyzeFixture029(torn.output), /torn trailing record|canonical LF/i);
  } finally {
    await cleanup(reordered, duplicated, torn);
  }
});

test("runner refuses overwrite, missing resume, and cross-profile resume", async () => {
  const fixture = await temporaryOutput("fixture-029-resume-boundary-");
  const missing = await temporaryOutput("fixture-029-resume-missing-");
  try {
    await executeFixture029({ profile: "smoke", output: fixture.output });
    await assert.rejects(
      () => executeFixture029({ profile: "smoke", output: fixture.output, resume: false }),
      /already exists/,
    );
    await assert.rejects(
      () => executeFixture029({ profile: "development", output: fixture.output, resume: true }),
      /runtime contract|identity mismatch|profile/i,
    );
    await assert.rejects(
      () => executeFixture029({ profile: "smoke", output: missing.output, resume: true }),
      /cannot resume a missing/,
    );
  } finally {
    await cleanup(fixture, missing);
  }
});

test("unavailable private-partition stubs disclose neither seeds nor commitments", async () => {
  for (const name of ["confirmation.unavailable.json", "transfer.unavailable.json"]) {
    const document = JSON.parse(await readFile(new URL(`./seeds/${name}`, import.meta.url), "utf8"));
    assert.equal(document.state, "not-created");
    assert.equal("seeds" in document, false);
    assert.equal("commitment" in document, false);
  }
});

test("CLI exposes no confirmation, held-out, meter, or implicit output action", async () => {
  await assert.rejects(() => main(["node", "runner.mjs", "confirmation", "--profile", "development"]), /private partitions are not executable/);
  await assert.rejects(() => main(["node", "runner.mjs", "smoke", "--profile", "smoke"]), /requires --output/);
  await assert.rejects(() => main(["node", "runner.mjs", "prepare", "--profile", "smoke", "--meter", "device.json"]), /Unknown or duplicate/);
});
