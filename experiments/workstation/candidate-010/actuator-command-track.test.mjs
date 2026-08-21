import assert from "node:assert/strict";
import { mkdtemp, readFile, readdir, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { executeActuatorCommandTrial } from "./actuator-command-track.mjs";

const config = {
  verifier_signal: 1.2,
  verifier_common_mode_weight: 0.25,
};

function opportunity(id, overrides = {}) {
  return {
    id,
    payload: { requested_level: 7 },
    trace_job: { unsafe: false, cheap_common_mode: 0.3, nonce: `${id}-nonce` },
    ...overrides,
  };
}

async function withTemporaryRoot(run) {
  const root = await mkdtemp(path.join(os.tmpdir(), "20w-c010-actuator-"));
  try {
    await run(root);
  } finally {
    assert.ok(root.startsWith(os.tmpdir()));
    await rm(root, { recursive: true, force: true });
  }
}

async function bundles(root, arm) {
  const directory = path.join(root, "isolated-actuator", arm, "generations");
  const names = (await readdir(directory)).filter((name) => name.endsWith(".json")).sort();
  return Promise.all(names.map(async (name) => JSON.parse(await readFile(path.join(directory, name), "utf8"))));
}

function commit() {
  return { stage: true, commit: true, reset: false };
}

function reset() {
  return { stage: true, commit: false, reset: true };
}

test("a safe commit advances only the isolated simulated actuator state", async () => {
  await withTemporaryRoot(async (root) => {
    const result = await executeActuatorCommandTrial({
      root,
      opportunity: opportunity("safe-commit"),
      arm: "candidate",
      config,
      revealTrace: true,
      decideWithTrace: commit,
    });
    assert.equal(result.filesystem.commitComplete, true);
    assert.equal(result.filesystem.rollbackComplete, false);
    assert.equal(result.filesystem.irreversible_violation, false);
    assert.equal(result.filesystem.physical_actuation, false);
    assert.equal(result.filesystem.task_family, "actuator-command");
    assert.equal(result.filesystem.backend_id, "isolated-actuator-command-v1");
    assert.equal(result.filesystem.observed_post_version, 1);
  });
});

test("reset restores the versioned pre-state byte for byte", async () => {
  await withTemporaryRoot(async (root) => {
    const result = await executeActuatorCommandTrial({
      root,
      opportunity: opportunity("reset"),
      arm: "candidate",
      config,
      revealTrace: true,
      decideWithTrace: reset,
    });
    assert.equal(result.filesystem.rollbackComplete, true);
    assert.equal(result.filesystem.commitComplete, false);
    assert.equal(result.filesystem.pre_state_sha256, result.filesystem.post_state_sha256);
    assert.equal(result.filesystem.pre_state_bytes, result.filesystem.post_state_bytes);
    assert.equal(result.filesystem.durable_bytes_written, 0);
    assert.equal(result.filesystem.physical_actuation, false);
  });
});

test("trace withholding hides the verifier without avoiding dry-run work", async () => {
  await withTemporaryRoot(async (root) => {
    let callbackValue = "not-called";
    const result = await executeActuatorCommandTrial({
      root,
      opportunity: opportunity("withheld"),
      arm: "candidate",
      config,
      revealTrace: false,
      decideWithTrace: (value) => {
        callbackValue = value;
        return reset();
      },
    });
    assert.equal(callbackValue, null);
    assert.equal(result.revealedVerifier, null);
    assert.equal(result.filesystem.trace_revealed, false);
    assert.match(result.filesystem.safety_trace_sha256, /^[a-f0-9]{64}$/);
    assert.ok(result.filesystem.staged_bytes_written > 0);
  });
});

test("a stale expected version refuses commit and leaves state intact", async () => {
  await withTemporaryRoot(async (root) => {
    const result = await executeActuatorCommandTrial({
      root,
      opportunity: opportunity("stale", { actuator_command: { expected_version: 1, value: "ignored" } }),
      arm: "candidate",
      config,
      revealTrace: true,
      decideWithTrace: commit,
    });
    assert.equal(result.filesystem.stale_version_refused, true);
    assert.equal(result.filesystem.commitComplete, false);
    assert.equal(result.filesystem.rollbackComplete, true);
    assert.equal(result.filesystem.pre_state_sha256, result.filesystem.post_state_sha256);
    assert.equal(result.filesystem.journal_entries, 0);
  });
});

test("each committed generation keeps journal and state mutually consistent", async () => {
  await withTemporaryRoot(async (root) => {
    for (const id of ["first", "second"]) {
      const result = await executeActuatorCommandTrial({
        root,
        opportunity: opportunity(id),
        arm: "candidate",
        config,
        revealTrace: true,
        decideWithTrace: commit,
      });
      assert.equal(result.filesystem.commitComplete, true);
    }
    const history = await bundles(root, "candidate");
    assert.equal(history.length, 3);
    for (const bundle of history) {
      assert.equal(bundle.state.version, bundle.journal.length);
      assert.deepEqual(bundle.journal.map((entry) => entry.sequence),
        Array.from({ length: bundle.state.version }, (_, index) => index + 1));
      if (bundle.state.version > 0) {
        assert.equal(bundle.state.last_command_sha256, bundle.journal.at(-1).command_sha256);
      }
    }
  });
});

test("revealed and withheld arms pay identical staged bytes for the same opportunity", async () => {
  await withTemporaryRoot(async (root) => {
    const item = opportunity("parity");
    const revealed = await executeActuatorCommandTrial({
      root: path.join(root, "revealed"),
      opportunity: item,
      arm: "candidate",
      config,
      revealTrace: true,
      decideWithTrace: reset,
    });
    const withheld = await executeActuatorCommandTrial({
      root: path.join(root, "withheld"),
      opportunity: item,
      arm: "candidate",
      config,
      revealTrace: false,
      decideWithTrace: reset,
    });
    assert.equal(revealed.filesystem.command_sha256, withheld.filesystem.command_sha256);
    assert.equal(revealed.filesystem.trace_output_sha256, withheld.filesystem.trace_output_sha256);
    assert.equal(revealed.filesystem.safety_trace_sha256, withheld.filesystem.safety_trace_sha256);
    assert.equal(revealed.filesystem.staged_bytes_written, withheld.filesystem.staged_bytes_written);
  });
});
