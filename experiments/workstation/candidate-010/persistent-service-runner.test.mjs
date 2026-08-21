import assert from "node:assert/strict";
import { mkdtemp, readFile, readdir, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { canonicalize, sha256Hex } from "./checkpoint.mjs";
import {
  createPersistentServicePlan,
  derivePersistentServiceRunIdentity,
  persistentServiceScientificPayload,
  runPersistentServiceExperiment,
} from "./persistent-service-runner.mjs";
import { RunLockContentionError, acquireRunLock, runLockPath } from "./run-lock.mjs";
import { captureCandidate010SourceBundle } from "./source-bundle.mjs";

const benchmarkRoot = path.dirname(new URL(import.meta.url).pathname.replace(/^\/(.:)/, "$1"));
const config = JSON.parse(await readFile(path.join(benchmarkRoot, "configs", "smoke.json"), "utf8"));
const sourceBundle = await captureCandidate010SourceBundle();

async function withTemporaryRoot(run) {
  const temporary = await mkdtemp(path.join(os.tmpdir(), "20w-c010-persistent-"));
  try {
    await run(temporary);
  } finally {
    assert.ok(temporary.startsWith(os.tmpdir()));
    await rm(temporary, { recursive: true, force: true });
  }
}

async function events(outputDirectory) {
  const raw = await readFile(
    path.join(outputDirectory, "raw", "persistent-service-events.ndjson"),
    "utf8",
  );
  return raw.trim().split(/\r?\n/).filter(Boolean).map((line) => JSON.parse(line));
}

function equivalencePayload(event) {
  const payload = persistentServiceScientificPayload(event);
  return {
    ...payload,
    boundary: Object.fromEntries(Object.entries(payload.boundary).filter(
      ([key]) => !key.endsWith("_elapsed_ms"),
    )),
  };
}

async function findRecursive(root, predicate) {
  const names = await readdir(root, { recursive: true });
  const relative = names.find((name) => predicate(name.split(path.sep).join("/")));
  assert.ok(relative, `expected a matching durable file below ${root}`);
  return path.join(root, relative);
}

test("persistent plan binds stable run, instance, operation, and expected-version identities", () => {
  const plan = createPersistentServicePlan({ config, seed: 710 });
  const first = derivePersistentServiceRunIdentity({ config, plan, sourceBundle });
  const second = derivePersistentServiceRunIdentity({ config, plan, sourceBundle });

  assert.equal(plan.length, 8);
  assert.deepEqual(first, second);
  assert.match(first.run_id, /^c010-persistent-run-[0-9a-f]{64}$/);
  assert.equal(new Set(first.operations.map((entry) => entry.operation_id)).size, 8);
  assert.equal(new Set(first.operations.map((entry) => entry.instance_id)).size, 2);
  assert.deepEqual(
    first.operations.filter((entry) => entry.task_family === "transactional-kv")
      .map((entry) => [entry.requested_action, entry.expected_version]),
    [["commit", 0], ["reset", 1], ["commit", 1], ["commit-stale", 0]],
  );
  assert.ok(first.operations.every((entry) => entry.physical_actuation === false));
});

test("same service instances preserve commits, byte-identical resets, and stale-version refusal", async () => {
  await withTemporaryRoot(async (root) => {
    const outputDirectory = path.join(root, "complete");
    const result = await runPersistentServiceExperiment({
      config,
      seed: 711,
      outputDirectory,
    });
    const records = await events(outputDirectory);

    assert.equal(result.status, "complete");
    assert.equal(result.ledger.records, 8);
    assert.equal(result.instances.length, 2);
    assert.ok(result.instances.every((instance) => instance.version === 2));
    assert.ok(result.instances.every((instance) => instance.physical_actuation === false));

    for (const taskFamily of ["transactional-kv", "actuator-command"]) {
      const family = records.filter((record) => record.task_family === taskFamily);
      assert.deepEqual(family.map((record) => [record.pre_version, record.post_version]), [
        [0, 1], [1, 1], [1, 2], [2, 2],
      ]);
      assert.equal(new Set(family.map((record) => record.instance_id)).size, 1);
      assert.equal(family[1].boundary.pre_state_sha256, family[0].boundary.post_state_sha256);
      assert.equal(family[1].boundary.rollbackComplete, true);
      assert.equal(family[1].boundary.pre_state_sha256, family[1].boundary.post_state_sha256);
      assert.equal(family[2].boundary.pre_state_sha256, family[1].boundary.post_state_sha256);
      assert.equal(family[3].boundary.stale_version_refused, true);
      assert.equal(family[3].boundary.rollbackComplete, true);
      assert.equal(family[3].boundary.pre_state_sha256, family[3].boundary.post_state_sha256);
      assert.ok(family.every((record) => record.physical_actuation === false));
      assert.ok(family.every((record) => /^c010-version-transition-[0-9a-f]{64}$/.test(
        record.version_transition_id,
      )));
    }
  });
});

test("declared interruption after backend finalization resumes without re-execution", async () => {
  await withTemporaryRoot(async (root) => {
    const plan = createPersistentServicePlan({ config, seed: 712 });
    const identity = derivePersistentServiceRunIdentity({ config, plan, sourceBundle });
    const baselineDirectory = path.join(root, "baseline");

    const baseline = await runPersistentServiceExperiment({
      config,
      seed: 712,
      plan,
      outputDirectory: baselineDirectory,
    });
    for (const taskFamily of ["transactional-kv", "actuator-command"]) {
      const interruptionOperation = identity.operations.find((operation) => (
        operation.task_family === taskFamily
      ));
      const resumedDirectory = path.join(root, `resumed-${taskFamily}`);
      const interrupted = await runPersistentServiceExperiment({
        config,
        seed: 712,
        plan,
        outputDirectory: resumedDirectory,
        interruptAfterBackendFinalizeOperationId: interruptionOperation.operation_id,
      });
      assert.equal(interrupted.status, "interrupted");
      assert.equal(interrupted.ledger.records, interruptionOperation.sequence);
      assert.equal(interrupted.interruption.operation_id, interruptionOperation.operation_id);
      const pendingReceipt = JSON.parse(await readFile(path.join(
        resumedDirectory,
        "pending",
        `${interruptionOperation.operation_id}.json`,
      ), "utf8"));

      const resumed = await runPersistentServiceExperiment({
        config,
        seed: 712,
        plan,
        outputDirectory: resumedDirectory,
        resume: true,
      });
      assert.equal(resumed.status, "complete");
      assert.equal(resumed.run_id, baseline.run_id);
      assert.deepEqual(resumed.reconciled_operation_ids, [interruptionOperation.operation_id]);
      const resumedEvents = await events(resumedDirectory);
      const reconciledEvent = resumedEvents.find((event) => (
        event.operation_id === interruptionOperation.operation_id
      ));
      const { integrity, ...recordedEvent } = reconciledEvent;
      assert.ok(integrity.record_sha256);
      assert.deepEqual(recordedEvent, pendingReceipt.event);
      assert.deepEqual(
        resumedEvents.map((event) => canonicalize(
          equivalencePayload(event),
        )),
        (await events(baselineDirectory)).map((event) => canonicalize(
          equivalencePayload(event),
        )),
      );
      assert.ok(resumed.instances.every((instance) => instance.version === 2));
      assert.deepEqual(await readdir(path.join(resumedDirectory, "pending")), []);
      assert.deepEqual(
        await runPersistentServiceExperiment({
          config,
          seed: 712,
          plan,
          outputDirectory: resumedDirectory,
          resume: true,
        }),
        resumed,
      );
    }
  });
});

test("resume refuses a corrupted pending receipt instead of replaying a committed operation", async () => {
  await withTemporaryRoot(async (root) => {
    const plan = createPersistentServicePlan({ config, seed: 713 });
    const identity = derivePersistentServiceRunIdentity({ config, plan, sourceBundle });
    const target = identity.operations[0];
    const outputDirectory = path.join(root, "corrupt-receipt");
    await runPersistentServiceExperiment({
      config,
      seed: 713,
      plan,
      outputDirectory,
      interruptAfterBackendFinalizeOperationId: target.operation_id,
    });
    const receiptPath = path.join(outputDirectory, "pending", `${target.operation_id}.json`);
    const receipt = JSON.parse(await readFile(receiptPath, "utf8"));
    receipt.event.post_version += 1;
    await writeFile(receiptPath, `${JSON.stringify(receipt, null, 2)}\n`, "utf8");

    await assert.rejects(
      runPersistentServiceExperiment({
        config,
        seed: 713,
        plan,
        outputDirectory,
        resume: true,
      }),
      /invalid pending receipt/,
    );
  });
});

test("source bundle bytes and VCS commit are bound into identity and reverified on resume", async () => {
  const plan = createPersistentServicePlan({ config, seed: 714 });
  const current = derivePersistentServiceRunIdentity({ config, plan, sourceBundle });
  const changedBundle = structuredClone(sourceBundle);
  changedBundle.source_sha256 = "f".repeat(64);
  const changed = derivePersistentServiceRunIdentity({
    config,
    plan,
    sourceBundle: changedBundle,
  });
  assert.notEqual(current.run_id, changed.run_id);

  await withTemporaryRoot(async (root) => {
    const outputDirectory = path.join(root, "source-bound");
    await runPersistentServiceExperiment({ config, seed: 714, plan, outputDirectory });
    const identityPath = path.join(outputDirectory, "run-identity.json");
    const stored = JSON.parse(await readFile(identityPath, "utf8"));
    stored.identity.source_sha256 = "e".repeat(64);
    stored.identity.source_bundle.source_sha256 = "e".repeat(64);
    stored.identity_sha256 = sha256Hex(canonicalize(stored.identity));
    await writeFile(identityPath, `${JSON.stringify(stored, null, 2)}\n`, "utf8");

    await assert.rejects(
      runPersistentServiceExperiment({
        config,
        seed: 714,
        plan,
        outputDirectory,
        resume: true,
      }),
      /stored run identity does not match/,
    );
  });
});

test("resume rejects corruption in an old actuator generation", async () => {
  await withTemporaryRoot(async (root) => {
    const outputDirectory = path.join(root, "old-generation-corruption");
    const result = await runPersistentServiceExperiment({
      config,
      seed: 715,
      outputDirectory,
    });
    const actuator = result.instances.find((instance) => (
      instance.task_family === "actuator-command"
    ));
    const instanceRoot = path.join(outputDirectory, "instances", actuator.instance_id);
    const oldGeneration = await findRecursive(instanceRoot, (name) => (
      name.endsWith("/generations/generation-000000000001.json")
    ));
    await writeFile(oldGeneration, "{}\n", "utf8");

    await assert.rejects(
      runPersistentServiceExperiment({
        config,
        seed: 715,
        outputDirectory,
        resume: true,
      }),
      /actuator durable history schema is invalid at generation 1/,
    );
  });
});

test("resume rejects a missing latest KV version instead of reporting a stale instance complete", async () => {
  await withTemporaryRoot(async (root) => {
    const outputDirectory = path.join(root, "missing-kv-tip");
    const result = await runPersistentServiceExperiment({
      config,
      seed: 716,
      outputDirectory,
    });
    const transactionalKv = result.instances.find((instance) => (
      instance.task_family === "transactional-kv"
    ));
    const instanceRoot = path.join(outputDirectory, "instances", transactionalKv.instance_id);
    const latestState = await findRecursive(instanceRoot, (name) => (
      name.endsWith("/versions/000000000002/state.json")
    ));
    await rm(path.dirname(latestState), { recursive: true, force: false });

    await assert.rejects(
      runPersistentServiceExperiment({
        config,
        seed: 716,
        outputDirectory,
        resume: true,
      }),
      /durable instance tip disagrees with completed ledger operation/,
    );
  });
});

test("persistent execution holds the shared exclusive output lock for every writer action", async () => {
  await withTemporaryRoot(async (root) => {
    const outputDirectory = path.join(root, "exclusive-output");
    const lease = await acquireRunLock({ outputDirectory, runnerId: "hostile-existing-writer" });
    try {
      await assert.rejects(
        runPersistentServiceExperiment({ config, seed: 717, outputDirectory }),
        (error) => (
          error instanceof RunLockContentionError
          && error.code === "CANDIDATE_010_RUN_LOCK_CONTENDED"
        ),
      );
    } finally {
      await lease.release();
    }

    const plan = createPersistentServicePlan({ config, seed: 717 });
    const identity = derivePersistentServiceRunIdentity({ config, plan, sourceBundle });
    const interrupted = await runPersistentServiceExperiment({
      config,
      seed: 717,
      plan,
      outputDirectory,
      interruptAfterBackendFinalizeOperationId: identity.operations[0].operation_id,
    });
    assert.equal(interrupted.status, "interrupted");
    assert.equal((await readdir(root)).includes(path.basename(runLockPath(outputDirectory))), false);
  });
});
