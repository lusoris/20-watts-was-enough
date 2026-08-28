import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import {
  cp, mkdir, mkdtemp, readFile, rm, writeFile,
} from "node:fs/promises";
import path from "node:path";
import test from "node:test";

import {
  assertFixture029SuiteAnalysis, assertFixture029SuiteConfig,
} from "./suite-contract.mjs";
import { executeFixture029 } from "./runner.mjs";
import {
  analyzeFixture029Suite, computeFixture029SuiteAnalysis, executeFixture029Suite,
  prepareFixture029Suite, validateFixture029SuiteOutput,
} from "./suite-runner.mjs";

const temporaryRoot = path.join(process.cwd(), "tmp");
const fixtures = [];
let base;

async function temporaryOutput(prefix) {
  await mkdir(temporaryRoot, { recursive: true });
  const parent = await mkdtemp(path.join(temporaryRoot, prefix));
  const fixture = { parent, output: path.join(parent, "suite") };
  fixtures.push(fixture);
  return fixture;
}

async function clonedBase(prefix) {
  const fixture = await temporaryOutput(prefix);
  await cp(base.output, fixture.output, { recursive: true, errorOnExist: true });
  return fixture;
}

async function sha256(file) {
  return createHash("sha256").update(await readFile(file)).digest("hex");
}

test.before(async () => {
  base = await temporaryOutput("fixture-029-suite-base-");
  await executeFixture029Suite({ profile: "smoke", output: base.output });
});

test.after(async () => {
  for (const fixture of [...fixtures].reverse()) {
    assert.ok(fixture.parent.startsWith(temporaryRoot));
    await rm(fixture.parent, { recursive: true, force: true });
  }
});

test("suite configurations have one and only one *_per_seed field", async () => {
  for (const profile of ["smoke", "development"]) {
    const config = JSON.parse(await readFile(
      new URL(`./configs/suite-${profile}.json`, import.meta.url),
      "utf8",
    ));
    assert.equal(assertFixture029SuiteConfig(config, profile), config);
    assert.deepEqual(
      Object.keys(config).filter((key) => key.endsWith("_per_seed")),
      ["worlds_per_seed"],
    );
  }
  const schema = JSON.parse(await readFile(
    new URL("./suite-output.schema.json", import.meta.url),
    "utf8",
  ));
  assert.equal(schema.additionalProperties, false);
  assert.equal(schema["x-runtime-validator"].export, "assertFixture029SuiteAnalysis");
  assert.deepEqual(Object.keys(schema.properties).sort(), [...schema.required].sort());
  const receiptSchema = JSON.parse(await readFile(
    new URL("./suite-receipt.schema.json", import.meta.url),
    "utf8",
  ));
  assert.equal(receiptSchema.additionalProperties, false);
  assert.equal(receiptSchema["x-runtime-validator"].export, "assertFixture029SuiteReceipt");
  assert.equal(receiptSchema["x-runtime-validator"].contract_version,
    "fixture-029.cmb-x01-x04-suite-receipt.v2");
});

test("suite profiles freeze the shared uint32 value domain, seed pack, and track configurations", async () => {
  for (const profile of ["smoke", "development"]) {
    const configPath = new URL(`./configs/suite-${profile}.json`, import.meta.url);
    const config = JSON.parse(await readFile(configPath, "utf8"));
    assert.equal(config.seed_value_domain, "unsigned-uint32");
    const seedPath = new URL(`./${config.shared_seed_pack}`, import.meta.url);
    assert.equal(await sha256(seedPath), config.shared_seed_pack_sha256);
    const seedDocument = JSON.parse(await readFile(seedPath, "utf8"));
    assert.ok(seedDocument.seeds.every((seed) => Number.isSafeInteger(seed)
      && seed >= 0 && seed <= 0xffff_ffff));
    for (const track of config.tracks) {
      assert.equal(
        await sha256(new URL(`./${track.configuration}`, import.meta.url)),
        track.configuration_sha256,
      );
    }
  }
});

test("prepare closes the mixed suite to C-1574 and C-1580 without result authority", async () => {
  assert.deepEqual(await prepareFixture029Suite("smoke"), {
    valid: true,
    artifact: "fixture-029",
    suite: "CMB-X01+CMB-X04",
    execution_claims: ["C-1574", "C-1580"],
    profile: "smoke",
    partition: "public-development-only",
    seeds: 2,
    worlds_per_seed: 8,
    tracks: 2,
    work_units: 240,
    receipt_work_units: 2,
    result_label: "NO_RESULT",
    no_result: true,
    measured_energy_required: false,
    energy_conclusion_allowed: false,
    comparison_inference_permitted: false,
    ranking_permitted: false,
    claim_eligible: false,
  });
});

test("run, analyze, and validate bind both diagnostic subruns without comparing them", async () => {
  const analysis = await analyzeFixture029Suite(base.output);
  assert.equal(analysis.decision, "diagnostic-pass");
  assert.deepEqual(analysis.execution_claims, ["C-1574", "C-1580"]);
  assert.deepEqual(
    analysis.track_diagnostics.map((entry) => entry.track),
    ["CMB-X01", "CMB-X04"],
  );
  assert.deepEqual(
    analysis.track_diagnostics.map((entry) => entry.records),
    [112, 128],
  );
  assert.ok(Object.values(analysis.checks).every(Boolean));
  assert.equal(analysis.checks.no_cross_track_comparison_or_ranking, true);
  assert.equal(analysis.comparison_inference_permitted, false);
  assert.equal(analysis.ranking_permitted, false);
  assert.equal(assertFixture029SuiteAnalysis(analysis), analysis);
  assert.deepEqual(await validateFixture029SuiteOutput(base.output), {
    valid: true,
    suite_run_id: analysis.suite_run_id,
    execution_claims: ["C-1574", "C-1580"],
    decision: "diagnostic-pass",
    result_label: "NO_RESULT",
    no_result: true,
    comparison_inference_permitted: false,
    ranking_permitted: false,
  });
});

test("resume completes a missing receipt and an already-partial subtrack deterministically", async () => {
  const resumed = await temporaryOutput("fixture-029-suite-resume-");
  const partialSuite = await executeFixture029Suite({
    profile: "smoke",
    output: resumed.output,
    maxTracks: 1,
  });
  assert.equal(partialSuite.complete, false);
  assert.equal(partialSuite.ledger.completed_work_units, 1);
  await assert.rejects(
    () => readFile(path.join(resumed.output, "cmb-x04", "run.json"), "utf8"),
    /ENOENT/u,
  );

  const partialTrack = await executeFixture029({
    profile: "smoke",
    output: path.join(resumed.output, "cmb-x04"),
    maxWorkUnits: 7,
  });
  assert.equal(partialTrack.complete, false);
  const complete = await executeFixture029Suite({
    profile: "smoke",
    output: resumed.output,
    resume: true,
  });
  assert.equal(complete.complete, true);
  assert.equal(
    await readFile(path.join(resumed.output, "suite-receipts.jsonl"), "utf8"),
    await readFile(path.join(base.output, "suite-receipts.jsonl"), "utf8"),
  );
  for (const track of ["cmb-x01", "cmb-x04"]) {
    assert.equal(
      await readFile(path.join(resumed.output, track, "raw-events.jsonl"), "utf8"),
      await readFile(path.join(base.output, track, "raw-events.jsonl"), "utf8"),
    );
  }
});

test("suite validation rejects subrun tamper even when the receipt ledger is untouched", async () => {
  const fixture = await clonedBase("fixture-029-suite-subrun-tamper-");
  const rawPath = path.join(fixture.output, "cmb-x04", "raw-events.jsonl");
  const rows = (await readFile(rawPath, "utf8")).trimEnd().split("\n");
  const record = JSON.parse(rows[0]);
  record.resources.logical_operations += 1;
  rows[0] = JSON.stringify(record);
  await writeFile(rawPath, `${rows.join("\n")}\n`);
  await assert.rejects(
    () => computeFixture029SuiteAnalysis(fixture.output),
    /runtime contract|hash-chain|no longer binds/iu,
  );
});

test("suite receipt ledger rejects tamper and reordering", async () => {
  const tampered = await clonedBase("fixture-029-suite-receipt-tamper-");
  const rankingText = await clonedBase("fixture-029-suite-receipt-ranking-");
  const reordered = await clonedBase("fixture-029-suite-receipt-reorder-");

  const tamperPath = path.join(tampered.output, "suite-receipts.jsonl");
  const tamperRows = (await readFile(tamperPath, "utf8")).trimEnd().split("\n");
  const hostile = JSON.parse(tamperRows[0]);
  hostile.subrun_summary.ledger_records -= 1;
  tamperRows[0] = JSON.stringify(hostile);
  await writeFile(tamperPath, `${tamperRows.join("\n")}\n`);
  await assert.rejects(
    () => computeFixture029SuiteAnalysis(tampered.output),
    /closed runtime contract|hash-chain/iu,
  );

  const rankingPath = path.join(rankingText.output, "suite-receipts.jsonl");
  const rankingRows = (await readFile(rankingPath, "utf8")).trimEnd().split("\n");
  const rankingHostile = JSON.parse(rankingRows[1]);
  rankingHostile.interpretation = "NO_RESULT: CMB-X04 ranks ahead of CMB-X01.";
  rankingRows[1] = JSON.stringify(rankingHostile);
  await writeFile(rankingPath, `${rankingRows.join("\n")}\n`);
  await assert.rejects(
    () => computeFixture029SuiteAnalysis(rankingText.output),
    /closed runtime contract|hash-chain/iu,
  );

  const reorderPath = path.join(reordered.output, "suite-receipts.jsonl");
  const reorderRows = (await readFile(reorderPath, "utf8")).trimEnd().split("\n");
  [reorderRows[0], reorderRows[1]] = [reorderRows[1], reorderRows[0]];
  await writeFile(reorderPath, `${reorderRows.join("\n")}\n`);
  await assert.rejects(
    () => computeFixture029SuiteAnalysis(reordered.output),
    /closed runtime contract|hash-chain/iu,
  );
});

test("runtime schema rejects result, comparison, ranking, and expanded claim authority", async () => {
  const analysis = structuredClone(await computeFixture029SuiteAnalysis(base.output));
  for (const mutate of [
    (value) => { value.result_label = "RESULT"; },
    (value) => { value.comparison_inference_permitted = true; },
    (value) => { value.ranking_permitted = true; },
    (value) => { value.execution_claims.push("C-9999"); },
  ]) {
    const hostile = structuredClone(analysis);
    mutate(hostile);
    assert.throws(
      () => assertFixture029SuiteAnalysis(hostile),
      /closed runtime schema/iu,
    );
  }
});

test("persisted suite run rejects authority, ranking text, and subrun metadata tampering", async () => {
  const hostiles = [
    ["authority", (run) => { run.claim_eligible = true; }],
    ["ranking-text", (run) => {
      run.interpretation = "NO_RESULT: CMB-X01 ranks ahead of CMB-X04.";
    }],
    ["subrun-id", (run) => { run.subrun_ids["CMB-X01"] = "f".repeat(64); }],
    ["subrun-summary", (run) => {
      run.subrun_summaries["CMB-X04"].ledger_records -= 1;
    }],
    ["expanded", (run) => { run.unregistered_authority = "none"; }],
  ];
  for (const [label, mutate] of hostiles) {
    const fixture = await clonedBase(`fixture-029-suite-run-${label}-`);
    const runPath = path.join(fixture.output, "suite-run.json");
    const run = JSON.parse(await readFile(runPath, "utf8"));
    mutate(run);
    await writeFile(runPath, `${JSON.stringify(run, null, 2)}\n`);
    await assert.rejects(
      () => computeFixture029SuiteAnalysis(fixture.output),
      /closed persisted contract|no longer binds/iu,
      label,
    );
  }
});

test("runner refuses overwrite, missing resume, and cross-profile resume", async () => {
  const missing = await temporaryOutput("fixture-029-suite-missing-");
  await assert.rejects(
    () => executeFixture029Suite({ profile: "smoke", output: base.output }),
    /already exists/iu,
  );
  await assert.rejects(
    () => executeFixture029Suite({ profile: "smoke", output: missing.output, resume: true }),
    /cannot resume a missing/iu,
  );
  await assert.rejects(
    () => executeFixture029Suite({ profile: "development", output: base.output, resume: true }),
    /identity|contract|profile/iu,
  );
});

test("configuration validator rejects reordered tracks and a second *_per_seed field", async () => {
  const config = JSON.parse(await readFile(
    new URL("./configs/suite-smoke.json", import.meta.url),
    "utf8",
  ));
  const reordered = structuredClone(config);
  reordered.tracks.reverse();
  assert.throws(() => assertFixture029SuiteConfig(reordered), /closed runtime schema/iu);

  const expanded = structuredClone(config);
  expanded.artifacts_per_seed = 24;
  assert.throws(() => assertFixture029SuiteConfig(expanded), /closed runtime schema/iu);
});
