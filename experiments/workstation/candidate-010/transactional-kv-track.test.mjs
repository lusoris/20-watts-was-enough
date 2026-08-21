import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import {
  mkdtemp,
  readFile,
  readdir,
  rm,
  writeFile,
} from "node:fs/promises";
import { readdirSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { generateOpportunities } from "./generator.mjs";
import { executeTransactionalKvTrial } from "./transactional-kv-track.mjs";

const benchmarkRoot = path.dirname(new URL(import.meta.url).pathname.replace(/^\/(.:)/, "$1"));
const config = JSON.parse(await readFile(path.join(benchmarkRoot, "configs", "smoke.json"), "utf8"));

async function withTemporaryRoot(run) {
  const temporary = await mkdtemp(path.join(os.tmpdir(), "20w-c010-kv-"));
  try {
    await run(temporary);
  } finally {
    assert.ok(temporary.startsWith(os.tmpdir()));
    await rm(temporary, { recursive: true, force: true });
  }
}

async function durableFiles(root) {
  const names = (await readdir(root, { recursive: true }))
    .filter((name) => name.endsWith("state.json") || name.endsWith("integrity.json"))
    .sort();
  return Promise.all(names.map(async (name) => [name, await readFile(path.join(root, name))]));
}

function findFile(root, name) {
  const wanted = name.split(path.sep).join("/");
  const relative = readdirSync(root, { recursive: true }).find((entry) => (
    entry.split(path.sep).join("/").endsWith(wanted)
  ));
  assert.ok(relative, `expected to find ${name}`);
  return path.join(root, relative);
}

function bodySha256(body) {
  return createHash("sha256").update(body).digest("hex");
}

test("transactional KV atomically commits a validated write-set to a new durable version", async () => {
  await withTemporaryRoot(async (root) => {
    const opportunity = generateOpportunities(config, 401)[0];
    const result = await executeTransactionalKvTrial({
      root,
      opportunity,
      arm: "commit-arm",
      config,
      revealTrace: true,
      decideWithTrace: (trace) => {
        assert.equal(Number.isFinite(trace), true);
        return { stage: true, commit: true, reset: false };
      },
    });

    assert.equal(result.filesystem.boundary, "local-transactional-kv-stage-validate-finalize-v1");
    assert.equal(result.filesystem.task_family, "transactional-kv");
    assert.equal(result.filesystem.backend_id, "local-versioned-transactional-kv-v1");
    assert.equal(result.filesystem.pre_version, 0);
    assert.equal(result.filesystem.post_version, 1);
    assert.equal(result.filesystem.commitComplete, true);
    assert.equal(result.filesystem.rollbackComplete, false);
    assert.equal(result.filesystem.irreversible_violation, false);
    assert.equal(result.filesystem.physical_actuation, false);
    assert.equal(result.filesystem.stageExists, false);
    assert.equal(result.filesystem.durableExists, true);
    assert.ok(result.filesystem.durable_bytes_written > 0);
    assert.notEqual(result.filesystem.pre_state_sha256, result.filesystem.post_state_sha256);

    const statePath = findFile(root, path.join("000000000001", "state.json"));
    const stateBody = await readFile(statePath, "utf8");
    const state = JSON.parse(stateBody);
    assert.equal(state.entries[opportunity.id].payload, opportunity.payload);
    assert.equal(bodySha256(stateBody), result.filesystem.post_state_sha256);
  });
});

test("reset restores byte-identical versioned pre-state", async () => {
  await withTemporaryRoot(async (root) => {
    const opportunities = generateOpportunities(config, 402);
    await executeTransactionalKvTrial({
      root,
      opportunity: opportunities[0],
      arm: "reset-proof-arm",
      config,
      revealTrace: false,
      decideWithTrace: () => ({ stage: true, commit: true, reset: false }),
    });
    const before = await durableFiles(root);

    const reset = await executeTransactionalKvTrial({
      root,
      opportunity: opportunities[1],
      arm: "reset-proof-arm",
      config,
      revealTrace: false,
      decideWithTrace: (trace) => {
        assert.equal(trace, null);
        return { stage: true, commit: false, reset: true };
      },
    });
    const after = await durableFiles(root);

    assert.deepEqual(after, before);
    assert.equal(reset.filesystem.pre_version, 1);
    assert.equal(reset.filesystem.post_version, 1);
    assert.equal(reset.filesystem.pre_state_sha256, reset.filesystem.post_state_sha256);
    assert.equal(
      reset.filesystem.durable_snapshot_pre_sha256,
      reset.filesystem.durable_snapshot_post_sha256,
    );
    assert.equal(reset.filesystem.durable_bytes_before, reset.filesystem.durable_bytes_after);
    assert.equal(reset.filesystem.rollbackComplete, true);
    assert.equal(reset.filesystem.commitComplete, false);
    assert.equal(reset.filesystem.irreversible_violation, false);
    assert.equal(reset.filesystem.physical_actuation, false);
    assert.equal(reset.filesystem.durable_bytes_written, 0);
  });
});

test("trace withholding changes disclosure but not staged or temporary work", async () => {
  await withTemporaryRoot(async (root) => {
    const opportunity = generateOpportunities(config, 403)[0];
    const revealed = await executeTransactionalKvTrial({
      root: path.join(root, "revealed"),
      opportunity,
      arm: "same-work-arm",
      config,
      revealTrace: true,
      decideWithTrace: (trace) => {
        assert.equal(Number.isFinite(trace), true);
        return { stage: true, commit: false, reset: true };
      },
    });
    const withheld = await executeTransactionalKvTrial({
      root: path.join(root, "withheld"),
      opportunity,
      arm: "same-work-arm",
      config,
      revealTrace: false,
      decideWithTrace: (trace) => {
        assert.equal(trace, null);
        return { stage: true, commit: false, reset: true };
      },
    });

    assert.notEqual(revealed.revealedVerifier, null);
    assert.equal(withheld.revealedVerifier, null);
    assert.equal(revealed.filesystem.trace_output_sha256, withheld.filesystem.trace_output_sha256);
    assert.equal(revealed.filesystem.write_set_sha256, withheld.filesystem.write_set_sha256);
    assert.equal(revealed.filesystem.staged_bytes_written, withheld.filesystem.staged_bytes_written);
    assert.equal(revealed.filesystem.rollbackComplete, true);
    assert.equal(withheld.filesystem.rollbackComplete, true);
  });
});

test("backend refuses staged or durable corruption without claiming completion", async () => {
  await withTemporaryRoot(async (root) => {
    const opportunities = generateOpportunities(config, 404);
    const stagedRoot = path.join(root, "staged-corruption");
    await assert.rejects(
      executeTransactionalKvTrial({
        root: stagedRoot,
        opportunity: opportunities[0],
        arm: "corruption-arm",
        config,
        revealTrace: true,
        decideWithTrace: () => {
          writeFileSync(findFile(stagedRoot, "write-set.json"), "corrupt\n", "utf8");
          return { stage: true, commit: true, reset: false };
        },
      }),
      /Refusing transactional KV trial: staged write-set changed/,
    );
    const stagedFiles = await durableFiles(stagedRoot);
    assert.equal(stagedFiles.filter(([name]) => name.includes("000000000001")).length, 0);

    const durableRoot = path.join(root, "durable-corruption");
    await executeTransactionalKvTrial({
      root: durableRoot,
      opportunity: opportunities[0],
      arm: "corruption-arm",
      config,
      revealTrace: false,
      decideWithTrace: () => ({ stage: true, commit: true, reset: false }),
    });
    const currentState = findFile(durableRoot, path.join("000000000001", "state.json"));
    await writeFile(currentState, "{}\n", "utf8");
    const beforeRefusal = await durableFiles(durableRoot);
    let decisionCalled = false;
    await assert.rejects(
      executeTransactionalKvTrial({
        root: durableRoot,
        opportunity: opportunities[1],
        arm: "corruption-arm",
        config,
        revealTrace: true,
        decideWithTrace: () => {
          decisionCalled = true;
          return { stage: true, commit: true, reset: false };
        },
      }),
      /Refusing transactional KV trial: version .* state hash or byte count/,
    );
    assert.equal(decisionCalled, false);
    assert.deepEqual(await durableFiles(durableRoot), beforeRefusal);
  });
});
