import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import {
  mkdtemp,
  readFile,
  readdir,
  rm,
  symlink,
  writeFile,
} from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { buildCounterbalancedEnergyBlockSchedule } from "./energy-acquisition.mjs";
import {
  EnergyBlockRunnerError,
  runEnergyBlockFixture,
  validateEnergyBlockExecutionBundle,
  validateEnergyBlockRunnerSchedule,
} from "./energy-block-runner.mjs";

const roots = [];

test.afterEach(async () => {
  await Promise.all(roots.splice(0).map((root) => rm(root, { recursive: true, force: true })));
});

function canonical(value) {
  if (Array.isArray(value)) return `[${value.map(canonical).join(",")}]`;
  if (value && typeof value === "object") {
    return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${canonical(value[key])}`).join(",")}}`;
  }
  return JSON.stringify(value);
}

function sha256(value) {
  return createHash("sha256").update(value).digest("hex");
}

function redigest(document, field) {
  const body = { ...document };
  delete body[field];
  return sha256(canonical(body));
}

function scheduleFixture() {
  return buildCounterbalancedEnergyBlockSchedule({
    run_id: "c010-energy-fixture-run",
    scenarios: [{
      scenario_id: "scenario-a",
      task_family: "transactional-kv",
      backend_id: "fixture-kv-v1",
    }],
    seeds: [17],
    arms: ["baseline", "candidate"],
    ordered_input_manifests: [{
      input_manifest_id: "manifest-scenario-a-17",
      scenario_id: "scenario-a",
      seed: 17,
      ordered_opportunity_ids: ["opportunity-a", "opportunity-b"],
    }],
    opportunities_per_block: 2,
    opportunity_repetitions: 1,
    measurement_repetitions: 1,
    warmup_opportunities: 1,
    meter_capability: {
      sample_interval_s: 1,
      energy_resolution_j: 0.1,
      minimum_block_duration_s: 2,
      minimum_energy_delta_j: 1,
      minimum_samples_per_block: 3,
      minimum_resolution_quanta: 10,
      maximum_clock_uncertainty_s: 0.1,
      minimum_signal_to_expanded_uncertainty: 3,
    },
  });
}

async function fixturePaths() {
  const root = await mkdtemp(path.join(os.tmpdir(), "candidate-010-energy-block-runner-"));
  roots.push(root);
  const schedulePath = path.join(root, "schedule.json");
  const schedule = scheduleFixture();
  const scheduleBytes = `${JSON.stringify(schedule, null, 2)}\n`;
  await writeFile(schedulePath, scheduleBytes, { flag: "wx" });
  return {
    root,
    schedule,
    schedulePath,
    scheduleBytes,
    outputDirectory: path.join(root, "execution"),
  };
}

function deterministicClock() {
  let utcStep = 0;
  let monotonic = 0n;
  return {
    now_utc() {
      const value = new Date(Date.UTC(2026, 7, 24, 10, 0, 0, utcStep)).toISOString();
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

function resourceUsage(operationCount = 1) {
  return {
    cpu_user_us: 10,
    cpu_system_us: 2,
    max_rss_bytes: 4096,
    read_bytes: 12,
    written_bytes: 8,
    operation_count: operationCount,
  };
}

function adapterFixture({ onWork = null, onIdle = null, calls = [] } = {}) {
  return {
    adapter_id: "candidate-010-deterministic-fixture",
    adapter_version: "1.0.0",
    fixture_only: true,
    implementation_sha256: sha256("candidate-010 deterministic fixture adapter v1"),
    async execute_work_unit(input) {
      calls.push({ kind: "work", input });
      await onWork?.(input, calls);
      return {
        schema: 1,
        status: input.opportunity_id.endsWith("a") ? "correct-commit" : "no-commit",
        result_sha256: sha256(canonical({ kind: "work", input })),
        resources: resourceUsage(),
      };
    },
    async execute_idle_block(input) {
      calls.push({ kind: "idle", input });
      await onIdle?.(input, calls);
      return {
        schema: 1,
        status: "idle-complete",
        result_sha256: sha256(canonical({ kind: "idle", input })),
        resources: resourceUsage(0),
      };
    },
  };
}

function errorCode(code) {
  return (error) => error instanceof EnergyBlockRunnerError && error.code === code;
}

test("executes exact block order, emits joinable claim-ineligible records, and exact-resumes", async () => {
  const fixture = await fixturePaths();
  const calls = [];
  const result = await runEnergyBlockFixture({
    schedulePath: fixture.schedulePath,
    outputDirectory: fixture.outputDirectory,
    adapter: adapterFixture({ calls }),
    clock: deterministicClock(),
  });

  assert.equal(result.status, "complete");
  assert.equal(result.completed, true);
  assert.equal(result.resumed, false);
  assert.equal(result.completed_blocks, fixture.schedule.blocks.length);
  assert.equal(result.bundle.claim_eligible, false);
  assert.equal(result.bundle.external_meter_status, "not-collected-by-this-runner");
  assert.deepEqual(result.bundle.external_meter_observations, []);
  assert.equal(result.bundle.schedule_sha256, fixture.schedule.schedule_sha256);
  assert.equal(result.bundle.blocks.length, 6);
  assert.equal(calls.filter((call) => call.kind === "work").length, 6);
  assert.equal(calls.filter((call) => call.kind === "idle").length, 2);

  for (const [index, record] of result.bundle.blocks.entries()) {
    const scheduled = fixture.schedule.blocks[index];
    assert.equal(record.block.block_id, scheduled.block_id);
    assert.equal(record.block.block_pair_id ?? null, scheduled.block_pair_id ?? null);
    assert.equal(record.block.scenario_id, scheduled.scenario_id);
    assert.equal(record.block.seed, scheduled.seed);
    assert.equal(record.block.arm, scheduled.arm);
    assert.equal(record.block.repetition, scheduled.repetition);
    assert.equal(record.external_meter_observation, null);
  }
  const measuredRecords = result.bundle.blocks.filter((record) => record.block.phase === "measure");
  assert.deepEqual(
    measuredRecords.map((record) => record.outcomes.map((outcome) => outcome.opportunity_id)),
    [["opportunity-a", "opportunity-b"], ["opportunity-a", "opportunity-b"]],
  );
  assert.equal(measuredRecords[0].summary.correct_commits, 1);
  assert.equal(measuredRecords[0].summary.no_commits, 1);
  assert.equal(result.bundle.totals.correct_commits, 4);
  assert.equal(result.bundle.totals.no_commits, 2);
  assert.strictEqual(
    validateEnergyBlockExecutionBundle({ schedule: fixture.schedule, bundle: result.bundle }),
    result.bundle,
  );

  const noReplayCalls = [];
  const resumed = await runEnergyBlockFixture({
    schedulePath: fixture.schedulePath,
    outputDirectory: fixture.outputDirectory,
    adapter: adapterFixture({
      calls: noReplayCalls,
      onWork: () => { throw new Error("completed blocks must not replay"); },
      onIdle: () => { throw new Error("completed blocks must not replay"); },
    }),
    clock: deterministicClock(),
  });
  assert.equal(resumed.status, "complete");
  assert.equal(resumed.resumed, true);
  assert.deepEqual(noReplayCalls, []);
  assert.equal(resumed.bundle.bundle_sha256, result.bundle.bundle_sha256);
});

test("honors abort only at a completed block boundary and resumes without replay", async () => {
  const fixture = await fixturePaths();
  const controller = new AbortController();
  const clock = deterministicClock();
  const firstCalls = [];
  const partial = await runEnergyBlockFixture({
    schedulePath: fixture.schedulePath,
    outputDirectory: fixture.outputDirectory,
    adapter: adapterFixture({
      calls: firstCalls,
      onWork() {
        controller.abort();
      },
    }),
    signal: controller.signal,
    clock,
  });

  assert.equal(partial.status, "aborted-at-block-boundary");
  assert.equal(partial.completed, false);
  assert.equal(partial.completed_blocks, 1);
  assert.equal(partial.bundle, null);
  assert.equal(firstCalls.length, 1);
  assert.deepEqual((await readdir(path.join(fixture.outputDirectory, "blocks"))).length, 1);

  const resumedCalls = [];
  const resumed = await runEnergyBlockFixture({
    schedulePath: fixture.schedulePath,
    outputDirectory: fixture.outputDirectory,
    adapter: adapterFixture({ calls: resumedCalls }),
    clock,
  });
  assert.equal(resumed.status, "complete");
  assert.equal(resumed.resumed, true);
  assert.equal(resumed.completed_blocks, fixture.schedule.blocks.length);
  assert.equal(resumedCalls.length, 7);
  assert.equal(
    resumedCalls.some((call) => (
      call.input.block_id === fixture.schedule.blocks[0].block_id
    )),
    false,
  );
});

test("refuses non-fixture adapters and closed-schema adapter output violations", async () => {
  const fixture = await fixturePaths();
  const nonFixture = adapterFixture();
  nonFixture.fixture_only = false;
  await assert.rejects(
    runEnergyBlockFixture({
      schedulePath: fixture.schedulePath,
      outputDirectory: fixture.outputDirectory,
      adapter: nonFixture,
    }),
    errorCode("NON_FIXTURE_ADAPTER_REFUSED"),
  );

  const second = await fixturePaths();
  const extraOutput = adapterFixture();
  extraOutput.execute_work_unit = async (input) => ({
    schema: 1,
    status: "correct-commit",
    result_sha256: sha256(canonical(input)),
    resources: resourceUsage(),
    measured_energy_j: 12,
  });
  await assert.rejects(
    runEnergyBlockFixture({
      schedulePath: second.schedulePath,
      outputDirectory: second.outputDirectory,
      adapter: extraOutput,
      clock: deterministicClock(),
    }),
    errorCode("INVALID_ADAPTER_OUTPUT"),
  );
  assert.deepEqual(await readdir(path.join(second.outputDirectory, "blocks")), []);
});

test("detects persisted schedule byte drift before committing a block", async () => {
  const fixture = await fixturePaths();
  let changed = false;
  await assert.rejects(
    runEnergyBlockFixture({
      schedulePath: fixture.schedulePath,
      outputDirectory: fixture.outputDirectory,
      adapter: adapterFixture({
        async onWork() {
          if (changed) return;
          changed = true;
          await writeFile(fixture.schedulePath, `${fixture.scheduleBytes}\n`);
        },
      }),
      clock: deterministicClock(),
    }),
    errorCode("SCHEDULE_SOURCE_DRIFT"),
  );
  assert.deepEqual(await readdir(path.join(fixture.outputDirectory, "blocks")), []);

  await writeFile(fixture.schedulePath, fixture.scheduleBytes);
  const resumed = await runEnergyBlockFixture({
    schedulePath: fixture.schedulePath,
    outputDirectory: fixture.outputDirectory,
    adapter: adapterFixture(),
    clock: deterministicClock(),
  });
  assert.equal(resumed.status, "complete");
  assert.equal(resumed.resumed, true);
});

test("refuses a linked schedule source before creating execution state", async (context) => {
  const fixture = await fixturePaths();
  const linkedSchedule = path.join(fixture.root, "linked-schedule.json");
  try {
    await symlink(fixture.schedulePath, linkedSchedule, "file");
  } catch (error) {
    if (["EPERM", "EACCES", "ENOTSUP", "UNKNOWN"].includes(error?.code)) {
      context.skip(`symlink hostile unavailable on this host: ${error.code}`);
      return;
    }
    throw error;
  }
  await assert.rejects(
    runEnergyBlockFixture({
      schedulePath: linkedSchedule,
      outputDirectory: fixture.outputDirectory,
      adapter: adapterFixture(),
      clock: deterministicClock(),
    }),
    errorCode("INVALID_SOURCE_FILE"),
  );
  await assert.rejects(readdir(fixture.outputDirectory), { code: "ENOENT" });
});

test("refuses input substitution even when the outer schedule digest is recomputed", () => {
  const schedule = structuredClone(scheduleFixture());
  schedule.ordered_input_manifests[0].ordered_opportunity_ids[0] = "substituted-opportunity";
  const unsignedManifest = { ...schedule.ordered_input_manifests[0] };
  delete unsignedManifest.input_manifest_sha256;
  schedule.ordered_input_manifests[0].input_manifest_sha256 = sha256(canonical(unsignedManifest));
  schedule.schedule_sha256 = redigest(schedule, "schedule_sha256");
  assert.throws(
    () => validateEnergyBlockRunnerSchedule(schedule),
    errorCode("INPUT_OWNERSHIP_MISMATCH"),
  );
});

test("refuses a substituted ordered outcome in persisted resume state", async () => {
  const fixture = await fixturePaths();
  const complete = await runEnergyBlockFixture({
    schedulePath: fixture.schedulePath,
    outputDirectory: fixture.outputDirectory,
    adapter: adapterFixture(),
    clock: deterministicClock(),
  });
  assert.equal(complete.status, "complete");
  const firstActiveIndex = fixture.schedule.blocks.findIndex((block) => block.opportunities > 0);
  const firstActiveBlock = fixture.schedule.blocks[firstActiveIndex];
  const recordPath = path.join(
    fixture.outputDirectory,
    "blocks",
    `${String(firstActiveIndex).padStart(6, "0")}-${firstActiveBlock.block_id}.json`,
  );
  const record = JSON.parse(await readFile(recordPath, "utf8"));
  record.outcomes[0].opportunity_id = "substituted-opportunity";
  record.outcomes[0].outcome_sha256 = redigest(record.outcomes[0], "outcome_sha256");
  record.record_sha256 = redigest(record, "record_sha256");
  await writeFile(recordPath, `${JSON.stringify(record, null, 2)}\n`);

  await assert.rejects(
    runEnergyBlockFixture({
      schedulePath: fixture.schedulePath,
      outputDirectory: fixture.outputDirectory,
      adapter: adapterFixture(),
      clock: deterministicClock(),
    }),
    errorCode("OUTCOME_ORDER_MISMATCH"),
  );
});

test("adapter failure leaves no partial block and exact retry can continue", async () => {
  const fixture = await fixturePaths();
  let failed = false;
  await assert.rejects(
    runEnergyBlockFixture({
      schedulePath: fixture.schedulePath,
      outputDirectory: fixture.outputDirectory,
      adapter: adapterFixture({
        onWork() {
          if (!failed) {
            failed = true;
            throw new Error("fixture fault");
          }
        },
      }),
      clock: deterministicClock(),
    }),
    errorCode("ADAPTER_FAILURE"),
  );
  assert.deepEqual(await readdir(path.join(fixture.outputDirectory, "blocks")), []);

  const retried = await runEnergyBlockFixture({
    schedulePath: fixture.schedulePath,
    outputDirectory: fixture.outputDirectory,
    adapter: adapterFixture(),
    clock: deterministicClock(),
  });
  assert.equal(retried.status, "complete");
  assert.equal(retried.resumed, true);
});
