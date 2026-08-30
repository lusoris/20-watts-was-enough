import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";

import {
  assertFixture029SuiteAnalysis,
  assertFixture029SuiteConfig,
} from "./suite-contract.mjs";
import { executeFixture029 } from "./runner.mjs";
import {
  analyzeFixture029Suite,
  executeFixture029Suite,
  prepareFixture029Suite,
  validateFixture029SuiteOutput,
} from "./suite-runner.mjs";
import { createFixture029SuiteTestSupport } from "./suite-runner.test-support.mjs";

const support = createFixture029SuiteTestSupport();
let base;

test.before(async () => {
  base = await support.temporaryOutput("fixture-029-suite-base-");
  await executeFixture029Suite({ profile: "smoke", output: base.output });
});

test.after(async () => {
  await support.cleanup();
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
  assert.equal(
    receiptSchema["x-runtime-validator"].contract_version,
    "fixture-029.cmb-x01-x04-suite-receipt.v2",
  );
});

test("suite profiles freeze the shared uint32 value domain, seed pack, and track configurations", async () => {
  for (const profile of ["smoke", "development"]) {
    const configPath = new URL(`./configs/suite-${profile}.json`, import.meta.url);
    const config = JSON.parse(await readFile(configPath, "utf8"));
    assert.equal(config.seed_value_domain, "unsigned-uint32");
    const seedPath = new URL(`./${config.shared_seed_pack}`, import.meta.url);
    assert.equal(await support.sha256(seedPath), config.shared_seed_pack_sha256);
    const seedDocument = JSON.parse(await readFile(seedPath, "utf8"));
    assert.ok(seedDocument.seeds.every((seed) => Number.isSafeInteger(seed)
      && seed >= 0 && seed <= 0xffff_ffff));
    for (const track of config.tracks) {
      assert.equal(
        await support.sha256(new URL(`./${track.configuration}`, import.meta.url)),
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
  const resumed = await support.temporaryOutput("fixture-029-suite-resume-");
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

test("runner refuses overwrite, missing resume, and cross-profile resume", async () => {
  const missing = await support.temporaryOutput("fixture-029-suite-missing-");
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
