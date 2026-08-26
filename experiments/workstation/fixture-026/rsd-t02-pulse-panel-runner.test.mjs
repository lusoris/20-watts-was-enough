import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import {
  FIXTURE_026_RSD_T02_PULSE_PUBLIC_SEEDS,
  FIXTURE_026_RSD_T02_PULSE_REFRACTORY_DURATIONS_S,
  FIXTURE_026_RSD_T02_PULSE_SKIPPING_PERIODS_S,
} from "./rsd-t02-pulse.mjs";
import {
  buildFixture026RsdT02PulsePanelWorkUnits,
  loadFixture026RsdT02PulsePanelConfig,
  runFixture026RsdT02PulsePanel,
} from "./rsd-t02-pulse-panel-runner.mjs";

async function temporaryDirectory(t) {
  const directory = await mkdtemp(path.join(os.tmpdir(), "fixture-026-pulse-panel-"));
  t.after(() => rm(directory, { recursive: true, force: true }));
  return directory;
}

function rawPath(output) {
  return path.join(output, "rsd-t02-pulse-panel-events.jsonl");
}

async function records(output) {
  const body = await readFile(rawPath(output), "utf8");
  return body.trimEnd().split("\n").map((line) => JSON.parse(line));
}

test("the closed schedule covers the protected panel without claiming execution", async () => {
  const loaded = await loadFixture026RsdT02PulsePanelConfig();
  const { config } = loaded;
  const units = buildFixture026RsdT02PulsePanelWorkUnits(config);
  assert.equal(units.length, 229);
  assert.equal(new Set(units.map((unit) => unit.work_key)).size, 229);
  assert.deepEqual(
    units.filter((unit) => unit.kind === "mixed-window-output").map((unit) => unit.window_end_s),
    [50, 150, 250, 350],
  );
  const refractory = units.filter((unit) => unit.kind === "refractory-duration");
  assert.equal(refractory.length, 18);
  for (const worldId of ["PS-NFL-H4", "PS-IFFL-H4", "PS-NFL-LTI"]) {
    assert.deepEqual(
      refractory.filter((unit) => unit.world_id === worldId).map((unit) => unit.duration_s),
      FIXTURE_026_RSD_T02_PULSE_REFRACTORY_DURATIONS_S,
    );
  }
  const skipping = units.filter((unit) => unit.kind === "skipping-cell");
  assert.equal(skipping.length, 15);
  for (const worldId of [
    "PS-NFL-H4", "PS-IFFL-H4", "PS-NFL-LTI", "PS-DEADTIME", "PS-ALIAS",
  ]) {
    assert.deepEqual(
      skipping.filter((unit) => unit.world_id === worldId).map((unit) => unit.period_s),
      FIXTURE_026_RSD_T02_PULSE_SKIPPING_PERIODS_S,
    );
  }
  const noise = units.filter((unit) => unit.kind === "ou-noise-grid");
  assert.equal(noise.length, 192);
  assert.deepEqual([...new Set(noise.map((unit) => unit.seed))], FIXTURE_026_RSD_T02_PULSE_PUBLIC_SEEDS);
  assert.deepEqual([...new Set(noise.map((unit) => unit.sigma_ratio))], [0.01, 0.05, 0.10]);
  assert.equal(config.full_panel_executed, false);
  assert.equal(config.result_label, "NO_RESULT");
  for (const fingerprint of Object.values(loaded.source_hashes)) {
    assert.match(fingerprint.sha256, /^[0-9a-f]{64}$/u);
    assert.ok(fingerprint.bytes > 0);
  }
});

test("zero budget prepares a resumable identity and reports explicit incompleteness", async (t) => {
  const parent = await temporaryDirectory(t);
  const output = path.join(parent, "run");
  const prepared = await runFixture026RsdT02PulsePanel({ output, maxWorkUnits: 0 });
  assert.equal(prepared.status.complete, false);
  assert.equal(prepared.status.incomplete_reason, "zero-work-budget");
  assert.equal(prepared.status.completed_work_units, 0);
  assert.equal(prepared.status.remaining_work_units, 229);
  assert.equal(prepared.status.budgets.consumed_work_units_this_invocation, 0);
  assert.equal(prepared.status.result_label, "NO_RESULT");
  assert.equal(prepared.status.scientific_result, false);
  const checkpoint = JSON.parse(await readFile(
    path.join(output, "rsd-t02-pulse-panel-checkpoint.json"),
    "utf8",
  ));
  assert.equal(checkpoint.records, 0);
  assert.equal(checkpoint.run_identity.run_id, prepared.identity.run_id);
  assert.match(prepared.identity.runtime_fingerprint_sha256, /^[0-9a-f]{64}$/u);
  assert.equal(prepared.identity.runtime_fingerprint.node_version, process.versions.node);
  assert.equal(prepared.identity.runtime_fingerprint.v8_version, process.versions.v8);
  assert.equal(prepared.identity.runtime_fingerprint.uv_version, process.versions.uv);
  assert.equal(prepared.identity.runtime_fingerprint.platform, process.platform);
  assert.equal(prepared.identity.runtime_fingerprint.architecture, process.arch);
});

test("mixed-window contract outputs append deterministically across resume", async (t) => {
  const parent = await temporaryDirectory(t);
  const output = path.join(parent, "run");
  const first = await runFixture026RsdT02PulsePanel({ output, maxWorkUnits: 2 });
  assert.equal(first.status.completed_work_units, 2);
  assert.equal(first.status.incomplete_reason, "invocation-work-budget-exhausted");
  const second = await runFixture026RsdT02PulsePanel({ output, resume: true, maxWorkUnits: 2 });
  assert.equal(second.identity.run_id, first.identity.run_id);
  assert.equal(second.status.completed_work_units, 4);
  assert.equal(second.status.complete, false);
  const rows = await records(output);
  assert.deepEqual(rows.map((row) => row.integrity.sequence), [0, 1, 2, 3]);
  assert.equal(rows[0].integrity.previous_sha256, "0".repeat(64));
  for (let index = 1; index < rows.length; index += 1) {
    assert.equal(rows[index].integrity.previous_sha256, rows[index - 1].integrity.record_sha256);
  }
  assert.deepEqual(rows.map((row) => row.unit.window_end_s), [50, 150, 250, 350]);
  assert.ok(rows.every((row) => row.output.state === "unresolved"));
  assert.ok(rows.every((row) => row.output.summary.window_start_s === null));
  assert.ok(rows.every((row) => row.output.summary.window_width_s === null));
  assert.ok(rows.every((row) => row.output.summary.exclusive_topology_allowed === false));
  assert.ok(rows.every((row) => row.result_label === "NO_RESULT"));
  const guarded = await runFixture026RsdT02PulsePanel({
    output,
    resume: true,
    maxWorkUnits: 1,
  });
  assert.equal(guarded.status.completed_work_units, 4);
  assert.equal(guarded.status.budgets.consumed_work_units_this_invocation, 0);
  assert.equal(guarded.status.incomplete_reason, "explicit-scientific-executor-required");
});

test("resume fails closed when a valid config has a different identity", async (t) => {
  const parent = await temporaryDirectory(t);
  const output = path.join(parent, "run");
  await runFixture026RsdT02PulsePanel({ output, maxWorkUnits: 1 });
  const loaded = await loadFixture026RsdT02PulsePanelConfig();
  const changed = JSON.parse(JSON.stringify(loaded.config));
  changed.budgets.maximum_serialized_result_bytes_per_unit -= 1;
  const changedPath = path.join(parent, "changed-config.json");
  await writeFile(changedPath, `${JSON.stringify(changed, null, 2)}\n`, "utf8");
  await assert.rejects(
    runFixture026RsdT02PulsePanel({
      output,
      resume: true,
      maxWorkUnits: 0,
      configPath: changedPath,
    }),
    /identity or authority mismatch|Checkpoint identity mismatch/u,
  );
});

test("source and runtime fingerprint drift fail closed at resume", async (t) => {
  const parent = await temporaryDirectory(t);
  for (const drift of ["source", "runtime"]) {
    const output = path.join(parent, drift);
    await runFixture026RsdT02PulsePanel({ output, maxWorkUnits: 0 });
    const checkpointPath = path.join(output, "rsd-t02-pulse-panel-checkpoint.json");
    const checkpoint = JSON.parse(await readFile(checkpointPath, "utf8"));
    if (drift === "source") {
      checkpoint.run_identity.source_hashes.runner.sha256 = "f".repeat(64);
    } else {
      checkpoint.run_identity.runtime_fingerprint.node_version = "runtime-drift";
    }
    await writeFile(checkpointPath, `${JSON.stringify(checkpoint, null, 2)}\n`, "utf8");
    await assert.rejects(
      runFixture026RsdT02PulsePanel({ output, resume: true, maxWorkUnits: 0 }),
      /Checkpoint identity mismatch/u,
    );
  }
});

test("tampered authority is rejected from the append-only ledger", async (t) => {
  const parent = await temporaryDirectory(t);
  const output = path.join(parent, "run");
  await runFixture026RsdT02PulsePanel({ output, maxWorkUnits: 1 });
  const rows = await records(output);
  rows[0].result_label = "RESULT";
  await writeFile(rawPath(output), `${JSON.stringify(rows[0])}\n`, "utf8");
  await assert.rejects(
    runFixture026RsdT02PulsePanel({ output, resume: true, maxWorkUnits: 0 }),
    /event identity or authority mismatch/u,
  );
});

test("work and result byte budgets fail before additional ledger append", async (t) => {
  const parent = await temporaryDirectory(t);
  const output = path.join(parent, "run");
  await assert.rejects(
    runFixture026RsdT02PulsePanel({ output, maxWorkUnits: 9 }),
    /exceeds the configured cap of 8/u,
  );
  await runFixture026RsdT02PulsePanel({ output, maxWorkUnits: 4 });
  await assert.rejects(
    runFixture026RsdT02PulsePanel({
      output,
      resume: true,
      maxWorkUnits: 1,
      executor: async () => ({
        state: "resolved",
        summary: { claim_eligible: true },
        cost_vector: {},
      }),
    }),
    /attempts authority promotion/u,
  );
  assert.equal((await records(output)).length, 4);
});

test("the whole-run byte cap includes validated records restored on resume", async (t) => {
  const parent = await temporaryDirectory(t);
  const probeOutput = path.join(parent, "probe");
  const probe = await runFixture026RsdT02PulsePanel({ output: probeOutput, maxWorkUnits: 1 });
  const oneResultBytes = probe.status.budgets.consumed_serialized_result_bytes;
  assert.ok(oneResultBytes > 0);

  const loaded = await loadFixture026RsdT02PulsePanelConfig();
  const capped = JSON.parse(JSON.stringify(loaded.config));
  capped.budgets.maximum_total_serialized_result_bytes = 2 * oneResultBytes - 1;
  const cappedPath = path.join(parent, "capped-config.json");
  await writeFile(cappedPath, `${JSON.stringify(capped, null, 2)}\n`, "utf8");
  const output = path.join(parent, "capped-run");
  const first = await runFixture026RsdT02PulsePanel({
    output,
    maxWorkUnits: 1,
    configPath: cappedPath,
  });
  assert.equal(first.status.budgets.consumed_serialized_result_bytes, oneResultBytes);
  await assert.rejects(
    runFixture026RsdT02PulsePanel({
      output,
      resume: true,
      maxWorkUnits: 1,
      configPath: cappedPath,
    }),
    /cumulative serialized results exceed the whole-run byte budget/u,
  );
  assert.equal((await records(output)).length, 1);
});

test("the event schema points to the executable runtime validator", async () => {
  const schema = JSON.parse(await readFile(
    path.join(path.dirname(fileURLToPath(import.meta.url)), "rsd-t02-pulse-panel-output.schema.json"),
    "utf8",
  ));
  assert.equal(schema.additionalProperties, false);
  assert.equal(schema["x-runtime-validator"].export, "assertFixture026RsdT02PulsePanelEvent");
  assert.equal(
    schema["x-runtime-validator"].contract_version,
    "fixture-026.rsd-t02-pulse-panel-event.v1",
  );
});
