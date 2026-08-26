import assert from "node:assert/strict";
import {
  mkdir,
  mkdtemp,
  readFile,
  rm,
  writeFile,
} from "node:fs/promises";
import path from "node:path";
import test from "node:test";

import {
  assertFixture026Record,
  canonical,
  sha256,
} from "./contract.mjs";
import {
  buildPolicyView,
  generateFixture026World,
} from "./generator.mjs";

import {
  analyzeFixture026,
  assertFixture026EventReplay,
  assertFixture026OrderedWorkKeys,
  executeFixture026,
  main,
  materializeFixture026DevelopmentRecords,
  prepareFixture026,
  FIXTURE_026_RUNTIME_FINGERPRINT,
  validateFixture026Output,
} from "./runner.mjs";

const root = process.cwd();
const temporaryRoot = path.join(root, "tmp");

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

function assertNoResult(value) {
  assert.equal(value.result_label, "NO_RESULT");
  assert.equal(value.no_result, true);
}

function executionRuntimeDigest() {
  return sha256(canonical(FIXTURE_026_RUNTIME_FINGERPRINT));
}

test("smoke preparation exposes bounded deterministic CPU-only public work", async () => {
  assert.deepEqual(await prepareFixture026("smoke"), {
    valid: true,
    artifact: "fixture-026",
    track: "RSD-T01",
    claim_scope: ["C-1540"],
    profile: "smoke",
    partition: "public-development-only",
    execution_mode: "deterministic-cpu-only",
    gpu_permitted: false,
    runtime_fingerprint: FIXTURE_026_RUNTIME_FINGERPRINT,
    runtime_fingerprint_sha256: executionRuntimeDigest(),
    seeds: 2,
    worlds_per_seed: 6,
    valid_classes_per_balance_block: 5,
    invalid_gate_sentinels_per_balance_block: 1,
    work_units: 24,
    implemented_tracks: 1,
    registered_tracks: 10,
    confirmation_seeds_created: false,
    transfer_seeds_created: false,
    measured_energy_required: false,
    energy_conclusion_allowed: false,
    claim_eligible: false,
    comparison_inference_permitted: false,
    scientific_result: false,
    performance_result: false,
    result_label: "NO_RESULT",
    no_result: true,
  });
});

test("smoke run exercises full-trajectory scoring and lookalikes without result authority", async () => {
  const fixture = await temporaryOutput("fixture-026-smoke-");
  try {
    const execution = await executeFixture026({ profile: "smoke", output: fixture.output, resume: false });
    assert.equal(execution.complete, true);
    assert.equal(execution.run.expected_work_units, 24);
    assertNoResult(execution);
    assertNoResult(execution.run);
    assert.deepEqual(execution.run.runtime_fingerprint, FIXTURE_026_RUNTIME_FINGERPRINT);
    assert.equal(execution.run.runtime_fingerprint_sha256, executionRuntimeDigest());
    assert.equal(execution.run.input_sha256.runtime, executionRuntimeDigest());
    const summary = await analyzeFixture026(fixture.output);
    const validation = await validateFixture026Output(fixture.output);
    assert.equal(summary.decision, "diagnostic-pass");
    assert.ok(Object.values(summary.checks).every(Boolean));
    assert.equal(summary.metrics["full-trajectory-diagnostic"].class_balanced_accuracy, 1);
    assert.ok(summary.metrics["peak-endpoint-lookalike"].class_balanced_accuracy < 1);
    assert.equal(summary.metrics["full-trajectory-diagnostic"].mean_trajectory_discrepancy_estimation_error, 0);
    assert.ok(summary.metrics["peak-endpoint-lookalike"].mean_trajectory_discrepancy_estimation_error > 0);
    for (const metrics of Object.values(summary.metrics)) {
      assert.equal(metrics.valid_five_class_records + metrics.invalid_gate_records, metrics.records);
      assert.ok(metrics.valid_five_class_records > 0);
      assert.ok(metrics.invalid_gate_records > 0);
    }
    assert.equal(summary.accuracy_denominator, "five valid synthetic property classes only; invalid-record sentinels excluded");
    assert.deepEqual(summary.trajectory_score, {
      name: "D",
      scale_y: 1,
      quadrature: "trapezoid",
      time_step_s: 0.02,
      horizon_s: 4,
      unit: "dimensionless",
    });
    assert.deepEqual(summary.runtime_fingerprint, FIXTURE_026_RUNTIME_FINGERPRINT);
    assert.equal(summary.runtime_fingerprint_sha256, executionRuntimeDigest());
    assert.equal(summary.comparison_inference_permitted, false);
    assert.equal(summary.claim_eligible, false);
    assert.equal(summary.measured_energy_present, false);
    assert.equal(summary.energy_conclusion_allowed, false);
    assertNoResult(summary);
    assert.deepEqual(validation, {
      valid: true,
      run_id: summary.run_id,
      decision: "diagnostic-pass",
      result_label: "NO_RESULT",
      no_result: true,
    });
  } finally {
    await cleanup(fixture);
  }
});

test("same public inputs produce byte-identical raw ledgers", async () => {
  const left = await temporaryOutput("fixture-026-left-");
  const right = await temporaryOutput("fixture-026-right-");
  try {
    await executeFixture026({ profile: "smoke", output: left.output });
    await executeFixture026({ profile: "smoke", output: right.output });
    assert.equal(
      await readFile(path.join(left.output, "raw-events.jsonl"), "utf8"),
      await readFile(path.join(right.output, "raw-events.jsonl"), "utf8"),
    );
  } finally {
    await cleanup(left, right);
  }
});

test("checkpoint resume reproduces uninterrupted output exactly", async () => {
  const resumed = await temporaryOutput("fixture-026-resume-");
  const complete = await temporaryOutput("fixture-026-complete-");
  try {
    const partial = await executeFixture026({ profile: "smoke", output: resumed.output, maxWorkUnits: 7 });
    assert.equal(partial.complete, false);
    assertNoResult(partial);
    const finished = await executeFixture026({ profile: "smoke", output: resumed.output, resume: true });
    assert.equal(finished.complete, true);
    assertNoResult(finished);
    await executeFixture026({ profile: "smoke", output: complete.output });
    assert.equal(
      await readFile(path.join(resumed.output, "raw-events.jsonl"), "utf8"),
      await readFile(path.join(complete.output, "raw-events.jsonl"), "utf8"),
    );
    assert.equal(
      await readFile(path.join(resumed.output, "checkpoint.json"), "utf8"),
      await readFile(path.join(complete.output, "checkpoint.json"), "utf8"),
    );
  } finally {
    await cleanup(resumed, complete);
  }
});

test("resume rejects a different profile even without a checkpoint", async () => {
  const fixture = await temporaryOutput("fixture-026-cross-profile-");
  try {
    const partial = await executeFixture026({ profile: "development", output: fixture.output, maxWorkUnits: 1 });
    assert.equal(partial.complete, false);
    await rm(path.join(fixture.output, "checkpoint.json"));
    await assert.rejects(
      () => executeFixture026({ profile: "smoke", output: fixture.output, resume: true }),
      /runtime contract|run identity|profile/i,
    );
  } finally {
    await cleanup(fixture);
  }
});

test("each event byte charge equals its persisted UTF-8 JSONL line", async () => {
  const fixture = await temporaryOutput("fixture-026-byte-charge-");
  try {
    await executeFixture026({ profile: "smoke", output: fixture.output });
    const lines = (await readFile(path.join(fixture.output, "raw-events.jsonl"), "utf8"))
      .split("\n")
      .filter(Boolean);
    const config = JSON.parse(await readFile(
      "experiments/workstation/fixture-026/configs/smoke.json",
      "utf8",
    ));
    for (const line of lines) {
      const record = JSON.parse(line);
      assert.equal(
        record.serialized_event_bytes_written,
        Buffer.byteLength(`${line}\n`, "utf8"),
      );
      const world = generateFixture026World({
        seed: record.seed,
        config,
        worldIndex: record.world_index,
      });
      const view = buildPolicyView(world, record.arm);
      assert.equal(
        record.serialized_policy_view_utf8_bytes,
        record.trace_valid ? Buffer.byteLength(JSON.stringify(view), "utf8") : 0,
      );
    }
  } finally {
    await cleanup(fixture);
  }
});

test("analysis rejects a hash-chain mutation", async () => {
  const fixture = await temporaryOutput("fixture-026-corrupt-");
  try {
    await executeFixture026({ profile: "smoke", output: fixture.output });
    const rawPath = path.join(fixture.output, "raw-events.jsonl");
    const rows = (await readFile(rawPath, "utf8")).trimEnd().split("\n");
    const first = JSON.parse(rows[0]);
    first.tail_discrepancy += 0.1;
    rows[0] = JSON.stringify(first);
    await writeFile(rawPath, `${rows.join("\n")}\n`);
    await assert.rejects(() => analyzeFixture026(fixture.output), /runtime contract|hash/i);
  } finally {
    await cleanup(fixture);
  }
});

test("semantic replay rejects a validly rehashed but generator-impossible event", async () => {
  const fixture = await temporaryOutput("fixture-026-semantic-replay-");
  try {
    await executeFixture026({ profile: "smoke", output: fixture.output });
    const rawPath = path.join(fixture.output, "raw-events.jsonl");
    const first = JSON.parse((await readFile(rawPath, "utf8")).split("\n")[0]);
    first.history_family = first.history_family === "step" ? "ramp" : "step";
    const payload = { ...first };
    delete payload.integrity;
    const { canonical, sha256 } = await import("./contract.mjs");
    first.integrity.record_sha256 = sha256(`${first.integrity.previous_sha256}\n${canonical(payload)}`);
    await assert.rejects(() => assertFixture026EventReplay(first), /semantic replay mismatch/);
  } finally {
    await cleanup(fixture);
  }
});

test("runtime fingerprint is event-bound and reanalysis rejects a changed runtime identity", async () => {
  const fixture = await temporaryOutput("fixture-026-runtime-fingerprint-");
  try {
    await executeFixture026({ profile: "smoke", output: fixture.output });
    const rawPath = path.join(fixture.output, "raw-events.jsonl");
    const first = JSON.parse((await readFile(rawPath, "utf8")).split("\n")[0]);
    first.input_sha256.runtime = first.input_sha256.runtime === "f".repeat(64)
      ? "e".repeat(64)
      : "f".repeat(64);
    const payload = { ...first };
    delete payload.integrity;
    first.integrity.record_sha256 = sha256(`${first.integrity.previous_sha256}\n${canonical(payload)}`);
    assert.equal(assertFixture026Record(first), first);
    await assert.rejects(
      () => assertFixture026EventReplay(first),
      /runtime contract/,
    );

    const runPath = path.join(fixture.output, "run.json");
    const run = JSON.parse(await readFile(runPath, "utf8"));
    run.runtime_fingerprint = {
      ...run.runtime_fingerprint,
      node_version: `${run.runtime_fingerprint.node_version}-mutated`,
    };
    await writeFile(runPath, `${JSON.stringify(run, null, 2)}\n`);
    await assert.rejects(
      () => analyzeFixture026(fixture.output),
      /runtime fingerprint/,
    );
  } finally {
    await cleanup(fixture);
  }
});

test("ordered work-key gate rejects a valid replacement that omits one registered unit", async () => {
  const fixture = await temporaryOutput("fixture-026-work-substitution-");
  try {
    await executeFixture026({ profile: "smoke", output: fixture.output });
    const records = (await readFile(path.join(fixture.output, "raw-events.jsonl"), "utf8"))
      .trimEnd().split("\n").map(JSON.parse);
    assert.equal((await assertFixture026OrderedWorkKeys(records, "smoke")).length, records.length);
    const units = records.map((record) => ({
      seed: record.seed,
      world_index: record.world_index,
      arm: record.arm,
    }));
    units[0] = { ...units[0], seed: 1540999 };
    const regenerated = await materializeFixture026DevelopmentRecords("smoke", units);
    assert.equal(regenerated.length, records.length);
    assert.equal(regenerated[0].seed, 1540999);
    await assert.rejects(
      () => assertFixture026OrderedWorkKeys(regenerated, "smoke"),
      /ordered work-key sequence differs/,
    );
  } finally {
    await cleanup(fixture);
  }
});

test("ordered work-key gate rejects a validly regenerated reordered chain", async () => {
  const fixture = await temporaryOutput("fixture-026-work-reorder-");
  try {
    await executeFixture026({ profile: "smoke", output: fixture.output });
    const records = (await readFile(path.join(fixture.output, "raw-events.jsonl"), "utf8"))
      .trimEnd().split("\n").map(JSON.parse);
    const units = records.map((record) => ({
      seed: record.seed,
      world_index: record.world_index,
      arm: record.arm,
    }));
    [units[0], units[1]] = [units[1], units[0]];
    const regenerated = await materializeFixture026DevelopmentRecords("smoke", units);
    assert.equal(regenerated[0].integrity.sequence, 0);
    assert.equal(regenerated[1].integrity.previous_sha256, regenerated[0].integrity.record_sha256);
    await assert.rejects(
      () => assertFixture026OrderedWorkKeys(regenerated, "smoke"),
      /ordered work-key sequence differs/,
    );
  } finally {
    await cleanup(fixture);
  }
});

test("analysis and resume reject a torn raw-ledger tail", async () => {
  const fixture = await temporaryOutput("fixture-026-torn-");
  try {
    const partial = await executeFixture026({ profile: "smoke", output: fixture.output, maxWorkUnits: 3 });
    assert.equal(partial.complete, false);
    const rawPath = path.join(fixture.output, "raw-events.jsonl");
    const raw = await readFile(rawPath, "utf8");
    await writeFile(rawPath, raw.slice(0, -1));
    await assert.rejects(
      () => executeFixture026({ profile: "smoke", output: fixture.output, resume: true }),
      /torn|newline|JSON|raw/i,
    );
  } finally {
    await cleanup(fixture);
  }
});

test("CLI rejects private partitions, meters, GPUs, and implicit output", async () => {
  await assert.rejects(
    () => main(["node", "runner.mjs", "confirmation", "--profile", "development"]),
    /private partitions are not executable/,
  );
  await assert.rejects(
    () => main(["node", "runner.mjs", "smoke", "--profile", "smoke"]),
    /requires --output/,
  );
  await assert.rejects(
    () => main(["node", "runner.mjs", "prepare", "--profile", "smoke", "--meter", "device.json"]),
    /Unknown or duplicate/,
  );
  await assert.rejects(
    () => main(["node", "runner.mjs", "prepare", "--profile", "smoke", "--gpu", "true"]),
    /Unknown or duplicate/,
  );
});
