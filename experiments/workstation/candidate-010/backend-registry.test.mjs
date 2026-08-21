import assert from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import {
  BACKEND_METADATA,
  BACKEND_REGISTRY,
  backendForTaskFamily,
  executeBackendTrial,
  validateBackendResult,
} from "./backend-registry.mjs";
import { generateOpportunities } from "./generator.mjs";

const benchmarkRoot = path.dirname(new URL(import.meta.url).pathname.replace(/^\/(.:)/, "$1"));
const config = JSON.parse(await readFile(path.join(benchmarkRoot, "configs", "smoke.json"), "utf8"));
const expected = Object.freeze({
  "filesystem-publish": Object.freeze({
    backend_id: "filesystem-stage-execute-finalize-v1",
    adapter_filename: "filesystem-track.mjs",
  }),
  "transactional-kv": Object.freeze({
    backend_id: "local-versioned-transactional-kv-v1",
    adapter_filename: "transactional-kv-track.mjs",
  }),
  "signed-publication": Object.freeze({
    backend_id: "synthetic-signed-publication-v1",
    adapter_filename: "signed-publication-track.mjs",
  }),
  "actuator-command": Object.freeze({
    backend_id: "isolated-actuator-command-v1",
    adapter_filename: "actuator-command-track.mjs",
  }),
});

function decision(commit) {
  return { stage: true, commit, reset: !commit };
}

test("registry exposes exactly four implemented non-physical backend adapters", () => {
  assert.deepEqual(Object.keys(BACKEND_REGISTRY).sort(), Object.keys(expected).sort());
  assert.equal(BACKEND_METADATA.length, 4);
  for (const [taskFamily, metadata] of Object.entries(expected)) {
    const entry = backendForTaskFamily(taskFamily);
    assert.equal(entry.task_family, taskFamily);
    assert.equal(entry.backend_id, metadata.backend_id);
    assert.equal(entry.adapter_filename, metadata.adapter_filename);
    assert.equal(entry.implemented, true);
    assert.equal(entry.physical_actuation, false);
    assert.equal(typeof entry.adapter, "function");
  }
});

test("registry rejects unknown and mismatched task-family dispatch before execution", async () => {
  assert.throws(() => backendForTaskFamily("not-a-family"), /Unknown Candidate 010 task family/);
  const opportunity = {
    ...generateOpportunities(config, 501)[0],
    task_family: "transactional-kv",
  };
  await assert.rejects(
    executeBackendTrial({
      task_family: "filesystem-publish",
      root: "unused",
      opportunity,
      arm: "candidate",
      config,
      revealTrace: false,
      decideWithTrace: () => decision(false),
    }),
    /task-family mismatch/,
  );
  await assert.rejects(
    executeBackendTrial({
      task_family: "transactional-kv",
      backend_id: "wrong-backend",
      root: "unused",
      opportunity,
      arm: "candidate",
      config,
      revealTrace: false,
      decideWithTrace: () => decision(false),
    }),
    /backend mismatch/,
  );
});

test("registry rejects missing, true, or unknown physical-boundary declarations", () => {
  const base = {
    task_family: "filesystem-publish",
    backend_id: "filesystem-stage-execute-finalize-v1",
  };
  for (const physicalActuation of [undefined, true, null, "unknown"]) {
    const filesystem = { ...base };
    if (physicalActuation !== undefined) filesystem.physical_actuation = physicalActuation;
    assert.throws(
      () => validateBackendResult("filesystem-publish", { filesystem }),
      /must explicitly declare physical_actuation false/,
    );
  }
  assert.equal(validateBackendResult("filesystem-publish", {
    filesystem: { ...base, physical_actuation: false },
  }).filesystem.physical_actuation, false);
});

test("every registered backend commits and resets through the common trial contract", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "20w-c010-registry-"));
  const opportunities = generateOpportunities(config, 502);
  try {
    for (const [index, [taskFamily, metadata]] of Object.entries(expected).entries()) {
      const familyRoot = path.join(root, taskFamily);
      const committed = await executeBackendTrial({
        task_family: taskFamily,
        backend_id: metadata.backend_id,
        root: familyRoot,
        opportunity: opportunities[index * 2],
        arm: "candidate",
        config,
        revealTrace: true,
        decideWithTrace: (trace) => {
          assert.equal(Number.isFinite(trace), true);
          return decision(true);
        },
      });
      const reset = await executeBackendTrial({
        task_family: taskFamily,
        backend_id: metadata.backend_id,
        root: familyRoot,
        opportunity: opportunities[index * 2 + 1],
        arm: "candidate",
        config,
        revealTrace: false,
        decideWithTrace: (trace) => {
          assert.equal(trace, null);
          return decision(false);
        },
      });

      assert.equal(committed.filesystem.task_family, taskFamily);
      assert.equal(committed.filesystem.backend_id, metadata.backend_id);
      assert.equal(committed.filesystem.commitComplete, true);
      assert.equal(committed.filesystem.rollbackComplete, false);
      assert.equal(committed.filesystem.irreversible_violation, false);
      assert.equal(reset.filesystem.task_family, taskFamily);
      assert.equal(reset.filesystem.backend_id, metadata.backend_id);
      assert.equal(reset.filesystem.rollbackComplete, true);
      assert.equal(reset.filesystem.commitComplete, false);
      assert.equal(reset.filesystem.irreversible_violation, false);
      assert.equal(committed.filesystem.physical_actuation, false);
      assert.equal(reset.filesystem.physical_actuation, false);
    }
  } finally {
    assert.ok(root.startsWith(os.tmpdir()));
    await rm(root, { recursive: true, force: true });
  }
});
