import assert from "node:assert/strict";
import {
  mkdir,
  mkdtemp,
  readFile,
  rm,
  symlink,
  writeFile,
} from "node:fs/promises";
import path from "node:path";
import test from "node:test";

import { canonicalize, sha256Hex } from "../lib/checkpoint-ledger.mjs";
import {
  Fixture026RsdT02RunLockContentionError,
  acquireFixture026RsdT02RunLock,
} from "./rsd-t02-run-lock.mjs";
import {
  analyzeFixture026RsdT02,
  executeFixture026RsdT02,
  prepareFixture026RsdT02,
  validateFixture026RsdT02BoundedConformanceConfig,
  validateFixture026RsdT02Output,
  validateFixture026RsdT02SeedDocument,
  validateFixture026RsdT02Unavailable,
} from "./rsd-t02-runner.mjs";

const temporaryRoot = path.join(process.cwd(), "tmp");
const RAW_FILE = "rsd-t02-raw-events.jsonl";
const CHECKPOINT_FILE = "rsd-t02-checkpoint.json";
const RUN_FILE = "rsd-t02-run.json";
const SUMMARY_FILE = path.join("analysis", "rsd-t02-summary.json");

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

test("preparation freezes the bounded 175-record public-development grid", async () => {
  const prepared = await prepareFixture026RsdT02("smoke");
  assert.equal(prepared.work_units, 175);
  assert.equal(prepared.seed_scope, "bounded-ordered-prefix-construction-conformance");
  assert.equal(prepared.source_seed_count, 64);
  assert.equal(prepared.construction_seed_count, 1);
  assert.equal(prepared.configured_work_units, 175);
  assert.equal(prepared.full_public_development_pack_executed, false);
  assert.equal(prepared.executions_per_recipe_per_seed, 35);
  assert.equal(prepared.recipes, 5);
  assert.equal(prepared.o0_records_per_seed, 45);
  assert.equal(prepared.o1_records_per_seed, 130);
  assert.equal(prepared.o2_executed, false);
  assert.equal(prepared.floor_executed, false);
  assert.equal(prepared.result_label, "NO_RESULT");
  assert.equal(prepared.claim_eligible, false);
  const development = await prepareFixture026RsdT02("development");
  assert.equal(development.work_units, 350);
  assert.equal(development.source_seed_count, 64);
  assert.equal(development.construction_seed_count, 2);
  assert.equal(development.configured_work_units, 350);
  assert.equal(development.full_public_development_pack_executed, false);
});

test("output containment refuses symbolic-link and junction ancestors", async (context) => {
  const fixture = await temporaryOutput("fixture-026-rsd-t02-linked-output-");
  const target = path.join(fixture.parent, "real-output-parent");
  const alias = path.join(fixture.parent, "linked-output-parent");
  try {
    await mkdir(target);
    try {
      await symlink(target, alias, process.platform === "win32" ? "junction" : "dir");
    } catch (error) {
      if (new Set(["EPERM", "EACCES", "ENOSYS", "UNKNOWN"]).has(error.code)) {
        context.skip(`link creation unavailable: ${error.code}`);
        return;
      }
      throw error;
    }
    await assert.rejects(
      () => executeFixture026RsdT02({
        profile: "smoke",
        output: path.join(alias, "run"),
      }),
      /symbolic link|junction|reparse point|redirected ancestor/iu,
    );
  } finally {
    await cleanup(fixture);
  }
});

test("a live exclusive writer rejects a concurrent resume before ledger mutation", async () => {
  const fixture = await temporaryOutput("fixture-026-rsd-t02-live-writer-");
  try {
    await executeFixture026RsdT02({
      profile: "smoke",
      output: fixture.output,
      maxWorkUnits: 1,
    });
    const rawPath = path.join(fixture.output, RAW_FILE);
    const before = await readFile(rawPath, "utf8");
    const lease = await acquireFixture026RsdT02RunLock({
      outputDirectory: fixture.output,
      runnerId: "rsd-t02-test-live-writer",
    });
    try {
      await assert.rejects(
        () => executeFixture026RsdT02({
          profile: "smoke",
          output: fixture.output,
          resume: true,
          maxWorkUnits: 1,
        }),
        (error) => error instanceof Fixture026RsdT02RunLockContentionError
          && error.code === "FIXTURE_026_RSD_T02_RUN_LOCK_CONTENDED",
      );
      assert.equal(await readFile(rawPath, "utf8"), before);
    } finally {
      assert.equal(await lease.release(), true);
    }
    const resumed = await executeFixture026RsdT02({
      profile: "smoke",
      output: fixture.output,
      resume: true,
      maxWorkUnits: 1,
    });
    assert.equal(resumed.complete, false);
    assert.equal(resumed.ledger.records, 2);
  } finally {
    await cleanup(fixture);
  }
});

test("lease release refuses to remove a lock whose ownership changed", async () => {
  const fixture = await temporaryOutput("fixture-026-rsd-t02-foreign-lock-");
  try {
    const lease = await acquireFixture026RsdT02RunLock({
      outputDirectory: fixture.output,
      runnerId: "rsd-t02-test-original-owner",
    });
    const foreignOwnership = {
      ...lease.ownership,
      lock_id: "0".repeat(32),
      runner_id: "rsd-t02-test-foreign-owner",
    };
    await writeFile(lease.lockPath, `${JSON.stringify(foreignOwnership, null, 2)}\n`, "utf8");
    await assert.rejects(
      () => lease.release(),
      /ownership changed; refusing foreign-lock removal/iu,
    );
    assert.deepEqual(JSON.parse(await readFile(lease.lockPath, "utf8")), foreignOwnership);
    assert.equal(await lease.release(), false);
  } finally {
    await cleanup(fixture);
  }
});

test("all source seeds, bounded counts, and absence records are closed inputs", async () => {
  const readJson = async (relative) => JSON.parse(await readFile(
    path.join("experiments/workstation/fixture-026", relative),
    "utf8",
  ));
  const seeds = await readJson("seeds/development.reveal.json");
  assert.equal(validateFixture026RsdT02SeedDocument(seeds), seeds);
  for (const mutate of [
    (document) => { document.algorithm = "implicit-rng"; },
    (document) => { document.encoding = "decimal-text"; },
    (document) => { document.seeds = document.seeds.slice(0, 2); },
    (document) => { document.seeds[63] = "18446744073709551616"; },
    (document) => { document.seeds[63] = "01"; },
  ]) {
    const mutant = structuredClone(seeds);
    mutate(mutant);
    assert.throws(() => validateFixture026RsdT02SeedDocument(mutant), /seed document/u);
  }
  const config = await readJson("configs/rsd-t02-bounded-conformance.json");
  assert.equal(validateFixture026RsdT02BoundedConformanceConfig(config), config);
  const falseCount = structuredClone(config);
  falseCount.profiles.development.work_units = 349;
  assert.throws(
    () => validateFixture026RsdT02BoundedConformanceConfig(falseCount),
    /bounded conformance configuration/u,
  );
  const falseSourceCount = structuredClone(config);
  falseSourceCount.source_seed_count = 2;
  assert.throws(
    () => validateFixture026RsdT02BoundedConformanceConfig(falseSourceCount),
    /bounded conformance configuration/u,
  );
  for (const [file, partition] of [
    ["seeds/confirmation.unavailable.json", "confirmation"],
    ["seeds/transfer.unavailable.json", "held-out"],
  ]) {
    const unavailable = await readJson(file);
    assert.equal(validateFixture026RsdT02Unavailable(unavailable, partition), unavailable);
    const mutant = structuredClone(unavailable);
    mutant.contains_seeds = true;
    assert.throws(
      () => validateFixture026RsdT02Unavailable(mutant, partition),
      /absence record/u,
    );
  }
});

test("a complete smoke ledger, pair matrices, and analysis remain NO_RESULT", async () => {
  const fixture = await temporaryOutput("fixture-026-rsd-t02-full-");
  try {
    const execution = await executeFixture026RsdT02({
      profile: "smoke",
      output: fixture.output,
    });
    assert.equal(execution.complete, true);
    assert.equal(execution.run.expected_work_units, 175);
    assert.equal(execution.run.ledger.records, 175);
    assert.deepEqual(execution.run.execution_claims, []);
    assert.deepEqual(execution.run.excluded_claims, ["C-1561", "C-1564"]);
    assert.equal(execution.run.floor_runtime_state, "foundation-only-not-executed");

    const summary = await analyzeFixture026RsdT02(fixture.output);
    assert.equal(summary.observed_records, 175);
    assert.equal(summary.o0_records_per_seed, 45);
    assert.equal(summary.o1_records_per_seed, 130);
    assert.equal(summary.system_aggregation.length, 10);
    assert.equal(summary.matched_step_pair_matrix.length, 90);
    assert.equal(summary.pair_matrix.length, 10);
    assert.ok(Object.values(summary.checks).every(Boolean));
    assert.equal(summary.decision, "contract-validation-pass");
    assert.equal(summary.result_label, "NO_RESULT");
    assert.equal(summary.claim_eligible, false);
    assert.deepEqual(await validateFixture026RsdT02Output(fixture.output), {
      valid: true,
      run_id: summary.run_id,
      decision: "contract-validation-pass",
      result_label: "NO_RESULT",
      no_result: true,
    });

    const runPath = path.join(fixture.output, RUN_FILE);
    const checkpointPath = path.join(fixture.output, CHECKPOINT_FILE);
    const originalRunText = await readFile(runPath, "utf8");
    const originalRun = JSON.parse(originalRunText);
    for (const mutate of [
      (run) => { run.ledger.scientific_payload_sha256 = "f".repeat(64); },
      (run) => { run.ledger.hash_chain_sha256 = "e".repeat(64); },
      (run) => { run.ledger.records -= 1; },
      (run) => { run.ledger.completed_work_units -= 1; },
    ]) {
      const mutant = structuredClone(originalRun);
      mutate(mutant);
      await writeFile(runPath, `${JSON.stringify(mutant, null, 2)}\n`);
      await assert.rejects(
        () => analyzeFixture026RsdT02(fixture.output),
        /identity, counts|exactly bound|closed contract/u,
      );
    }
    await writeFile(runPath, originalRunText);

    const originalCheckpoint = await readFile(checkpointPath, "utf8");
    await rm(checkpointPath);
    await assert.rejects(
      () => analyzeFixture026RsdT02(fixture.output),
      /exactly bound|does not exist/u,
    );
    await writeFile(checkpointPath, "{\n");
    await assert.rejects(
      () => analyzeFixture026RsdT02(fixture.output),
      /JSON|position|property name|end of JSON input/i,
    );
    await writeFile(checkpointPath, originalCheckpoint);
  } finally {
    await cleanup(fixture);
  }
});

test("partial resume equals uninterrupted bytes and complete resume is byte-idempotent", async () => {
  const resumed = await temporaryOutput("fixture-026-rsd-t02-resumed-");
  const uninterrupted = await temporaryOutput("fixture-026-rsd-t02-uninterrupted-");
  try {
    const partial = await executeFixture026RsdT02({
      profile: "smoke",
      output: resumed.output,
      maxWorkUnits: 3,
    });
    assert.equal(partial.complete, false);
    const staleCheckpoint = await readFile(path.join(resumed.output, CHECKPOINT_FILE), "utf8");
    await rm(path.join(resumed.output, CHECKPOINT_FILE));
    const missingCheckpointAdvance = await executeFixture026RsdT02({
      profile: "smoke",
      output: resumed.output,
      resume: true,
      maxWorkUnits: 2,
    });
    assert.equal(missingCheckpointAdvance.complete, false);
    assert.equal(missingCheckpointAdvance.ledger.records, 5);
    await writeFile(path.join(resumed.output, CHECKPOINT_FILE), staleCheckpoint);
    const finished = await executeFixture026RsdT02({
      profile: "smoke",
      output: resumed.output,
      resume: true,
    });
    assert.equal(finished.complete, true);
    await executeFixture026RsdT02({ profile: "smoke", output: uninterrupted.output });

    for (const name of [RAW_FILE, CHECKPOINT_FILE]) {
      assert.equal(
        await readFile(path.join(resumed.output, name), "utf8"),
        await readFile(path.join(uninterrupted.output, name), "utf8"),
      );
    }
    assert.deepEqual(
      await analyzeFixture026RsdT02(resumed.output),
      await analyzeFixture026RsdT02(uninterrupted.output),
    );

    const before = await Promise.all([RAW_FILE, CHECKPOINT_FILE, RUN_FILE, SUMMARY_FILE].map(
      (name) => readFile(path.join(resumed.output, name), "utf8"),
    ));
    const again = await executeFixture026RsdT02({
      profile: "smoke",
      output: resumed.output,
      resume: true,
    });
    assert.equal(again.complete, true);
    const after = await Promise.all([RAW_FILE, CHECKPOINT_FILE, RUN_FILE, SUMMARY_FILE].map(
      (name) => readFile(path.join(resumed.output, name), "utf8"),
    ));
    assert.deepEqual(after, before);
  } finally {
    await cleanup(resumed, uninterrupted);
  }
});

function rechain(records) {
  let previousHash = "0".repeat(64);
  for (const [sequence, record] of records.entries()) {
    let bytes = record.serialized_event_bytes_written;
    for (let iteration = 0; iteration < 8; iteration += 1) {
      record.serialized_event_bytes_written = bytes;
      const payload = { ...record };
      delete payload.integrity;
      record.integrity = {
        sequence,
        previous_sha256: previousHash,
        record_sha256: sha256Hex(`${previousHash}\n${canonicalize(payload)}`),
      };
      const observed = Buffer.byteLength(`${JSON.stringify(record)}\n`, "utf8");
      if (observed === bytes) break;
      bytes = observed;
      if (iteration === 7) throw new Error("test ledger byte charge did not converge");
    }
    previousHash = record.integrity.record_sha256;
  }
  return `${records.map((record) => JSON.stringify(record)).join("\n")}\n`;
}

test("resume rejects self-consistently reordered and duplicate work records", async () => {
  for (const duplicate of [false, true]) {
    const fixture = await temporaryOutput("fixture-026-rsd-t02-prefix-hostile-");
    try {
      await executeFixture026RsdT02({
        profile: "smoke",
        output: fixture.output,
        maxWorkUnits: 2,
      });
      const rawPath = path.join(fixture.output, RAW_FILE);
      const records = (await readFile(rawPath, "utf8")).trimEnd().split("\n").map(
        (line) => JSON.parse(line),
      );
      const hostile = duplicate
        ? [structuredClone(records[0]), structuredClone(records[0])]
        : [records[1], records[0]];
      await writeFile(rawPath, rechain(hostile));
      await rm(path.join(fixture.output, CHECKPOINT_FILE));
      await assert.rejects(
        () => executeFixture026RsdT02({
          profile: "smoke",
          output: fixture.output,
          resume: true,
        }),
        duplicate ? /duplicate completed work unit/iu : /ordered work-grid prefix/u,
      );
    } finally {
      await cleanup(fixture);
    }
  }
});

test("resume rejects a validly rehashed checkpoint ahead of raw authority", async () => {
  const fixture = await temporaryOutput("fixture-026-rsd-t02-ahead-checkpoint-");
  try {
    await executeFixture026RsdT02({
      profile: "smoke",
      output: fixture.output,
      maxWorkUnits: 1,
    });
    const checkpointPath = path.join(fixture.output, CHECKPOINT_FILE);
    const checkpoint = JSON.parse(await readFile(checkpointPath, "utf8"));
    checkpoint.records += 1;
    const body = { ...checkpoint };
    delete body.checkpoint_sha256;
    checkpoint.checkpoint_sha256 = sha256Hex(canonicalize(body));
    await writeFile(checkpointPath, `${JSON.stringify(checkpoint, null, 2)}\n`);
    await assert.rejects(
      () => executeFixture026RsdT02({
        profile: "smoke",
        output: fixture.output,
        resume: true,
      }),
      /checkpoint is ahead of raw ledger/iu,
    );
  } finally {
    await cleanup(fixture);
  }
});

async function corruptPartial(mutate) {
  const fixture = await temporaryOutput("fixture-026-rsd-t02-corrupt-");
  await executeFixture026RsdT02({
    profile: "smoke",
    output: fixture.output,
    maxWorkUnits: 1,
  });
  const rawPath = path.join(fixture.output, RAW_FILE);
  await mutate({ fixture, rawPath, raw: await readFile(rawPath, "utf8") });
  return fixture;
}

test("resume rejects validly rehashed impossible scientific records", async () => {
  const fixture = await corruptPartial(async ({ fixture: current, rawPath, raw }) => {
    const record = JSON.parse(raw.trimEnd());
    assert.equal(record.evaluator.reported_output_max, 1);
    record.evaluator.reported_output_max = 2;
    const payload = { ...record };
    delete payload.integrity;
    record.integrity.record_sha256 = sha256Hex(
      `${record.integrity.previous_sha256}\n${canonicalize(payload)}`,
    );
    const mutated = `${JSON.stringify(record)}\n`;
    assert.equal(Buffer.byteLength(mutated), Buffer.byteLength(raw));
    await writeFile(rawPath, mutated);
    await rm(path.join(current.output, CHECKPOINT_FILE));
  });
  try {
    await assert.rejects(
      () => executeFixture026RsdT02({ profile: "smoke", output: fixture.output, resume: true }),
      /semantic replay mismatch|closed cross-field or authority contract/iu,
    );
  } finally {
    await cleanup(fixture);
  }
});

test("resume rejects CRLF, torn, blank, and mixed-identity ledgers", async () => {
  const mutations = [
    {
      apply: async ({ rawPath, raw }) => writeFile(rawPath, raw.replaceAll("\n", "\r\n")),
      expected: /CRLF/u,
      profile: "smoke",
    },
    {
      apply: async ({ rawPath, raw }) => writeFile(rawPath, raw.slice(0, -1)),
      expected: /torn/u,
      profile: "smoke",
    },
    {
      apply: async ({ rawPath, raw }) => writeFile(rawPath, `${raw}\n`),
      expected: /blank/u,
      profile: "smoke",
    },
    {
      apply: async () => {},
      expected: /identity mismatch|run_id|profile|authority contract/i,
      profile: "development",
    },
  ];
  for (const mutation of mutations) {
    const fixture = await corruptPartial(mutation.apply);
    try {
      await assert.rejects(
        () => executeFixture026RsdT02({
          profile: mutation.profile,
          output: fixture.output,
          resume: true,
        }),
        mutation.expected,
      );
    } finally {
      await cleanup(fixture);
    }
  }
});
