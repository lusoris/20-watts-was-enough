import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test, { after } from "node:test";
import { factorialScientificPayload } from "./factorial-runner.mjs";
import {
  executeRetryRollbackComparatorTrial,
  observeFilesystemSnapshot,
  validateRetryRollbackResult,
} from "./retry-rollback-comparator.mjs";

const fixtureRoot = await mkdtemp(path.join(os.tmpdir(), "20w-c010-retry-comparator-"));
after(async () => rm(fixtureRoot, { recursive: true, force: true }));

function fakeExecutor({ skipFirst = false, leak = false } = {}) {
  let calls = 0;
  return async ({ root, decideWithTrace }) => {
    calls += 1;
    const decision = decideWithTrace(null);
    const first = calls === 1;
    await mkdir(root, { recursive: true });
    await writeFile(path.join(root, "backend-metadata.json"), "deterministic snapshot fixture\n");
    return {
      decision: skipFirst && first ? { ...decision, commit: true, reset: false } : decision,
      revealedVerifier: null,
      filesystem: {
        task_family: "signed-publication",
        backend_id: "synthetic-signed-publication-v1",
        trace_output_sha256: "a".repeat(64),
        staged_bytes_written: first ? 11 : 13,
        durable_bytes_written: decision.commit ? 7 : 0,
        boundary_elapsed_ms: first ? 2 : 3,
        stageExists: false,
        durableExists: leak && first ? true : decision.commit,
        rollbackComplete: decision.reset,
        commitComplete: decision.commit,
        irreversible_violation: false,
      },
    };
  };
}

const input = {
  root: path.join(fixtureRoot, "retry-fixture"),
  task_family: "signed-publication",
  backend_id: "synthetic-signed-publication-v1",
  opportunity: { id: "retry-fixture" },
  config: { modeled_energy_j: { temporary_execution: 1, stage: 2, reset: 3 } },
  decideRetry: () => ({
    arm: "retry-rollback",
    stage: true,
    commit: true,
    reset: false,
    abstain: false,
    observations: 2,
    verifier_calls: 0,
    reason: "fixture-retry",
  }),
};

test("retry/rollback executes, rolls back, retries, and pays both lifecycle costs", async () => {
  const result = await executeRetryRollbackComparatorTrial({ ...input, executeTrial: fakeExecutor() });
  assert.equal(validateRetryRollbackResult(result), true);
  assert.equal(result.filesystem.staged_bytes_written, 24);
  assert.equal(result.filesystem.boundary_elapsed_ms, 5);
  assert.equal(result.policy_evaluations, 2);
  assert.equal(result.decision.observations, 3);
  assert.equal(result.additional_modeled_energy_j, 6);
  assert.equal(result.comparator_lineage.attempts.length, 2);
  assert.ok(result.comparator_lineage.attempts.every((attempt) => (
    /^[0-9a-f]{64}$/.test(attempt.filesystem_snapshot.snapshot_sha256)
  )));
});

test("skipped first action and state leakage fail closed", async () => {
  await assert.rejects(
    executeRetryRollbackComparatorTrial({ ...input, executeTrial: fakeExecutor({ skipFirst: true }) }),
    /first staged action did not roll back cleanly/,
  );
  await assert.rejects(
    executeRetryRollbackComparatorTrial({ ...input, executeTrial: fakeExecutor({ leak: true }) }),
    /first staged action did not roll back cleanly/,
  );
});

test("unpaid work and forged shared state are rejected after execution", async () => {
  const result = await executeRetryRollbackComparatorTrial({ ...input, executeTrial: fakeExecutor() });
  assert.throws(
    () => validateRetryRollbackResult({
      ...result,
      filesystem: { ...result.filesystem, staged_bytes_written: result.filesystem.staged_bytes_written - 1 },
    }),
    /did not pay or report all lifecycle work/,
  );
  const [first, second] = result.comparator_lineage.attempts;
  assert.throws(
    () => validateRetryRollbackResult({
      ...result,
      comparator_lineage: {
        ...result.comparator_lineage,
        attempts: [first, { ...second, boundary_id: first.boundary_id }],
      },
    }),
    /leaked state/,
  );
  assert.throws(
    () => validateRetryRollbackResult(result, {
      task_family: input.task_family,
      backend_id: input.backend_id,
      opportunity_id: "substituted-opportunity",
    }),
    /ownership is absent or mismatched/,
  );
  assert.throws(
    () => validateRetryRollbackResult({
      ...result,
      comparator_lineage: {
        ...result.comparator_lineage,
        attempts: [first, {
          ...second,
          commit: false,
          reset: true,
          state_evidence_sha256: second.state_evidence_sha256,
        }],
      },
    }),
    /leaked state|retry action lifecycle evidence is inconsistent/,
  );
});

test("independently observed snapshots reject backend state added after evidence capture", async () => {
  const result = await executeRetryRollbackComparatorTrial({ ...input, executeTrial: fakeExecutor() });
  const retryRoot = path.join(input.root, "retry-action");
  await writeFile(path.join(retryRoot, "unreported-state.bin"), "state leak");
  const observedRetry = await observeFilesystemSnapshot(retryRoot);
  assert.throws(
    () => validateRetryRollbackResult(result, null, [
      result.comparator_lineage.attempts[0].filesystem_snapshot,
      observedRetry,
    ]),
    /first action leaked state/,
  );
});

test("host sandbox paths cannot change scientific payload or digest", async () => {
  const first = await executeRetryRollbackComparatorTrial({
    ...input,
    root: path.join(fixtureRoot, "host-a", "retry-fixture"),
    executeTrial: fakeExecutor(),
  });
  const second = await executeRetryRollbackComparatorTrial({
    ...input,
    root: path.join(fixtureRoot, "host-b", "retry-fixture"),
    executeTrial: fakeExecutor(),
  });
  const event = (result) => ({
    scenario_id: "retry-root-invariance",
    task_family: input.task_family,
    backend_id: input.backend_id,
    cluster_id: "fixture-cluster",
    pair_id: "fixture-pair",
    opportunity_id: input.opportunity.id,
    arm: "retry-rollback",
    paired_input_sha256: "b".repeat(64),
    decision: result.decision,
    trace: { revealed: false, verifier: null, output_sha256: "a".repeat(64) },
    outcome: { false_commit: false, false_reject: false, loss: 0 },
    resources: { policy_evaluations: result.policy_evaluations },
    budget: {},
    measurement_interval: {},
    filesystem: result.filesystem,
    privileged_evidence: false,
    comparator_lineage: result.comparator_lineage,
  });
  const firstPayload = factorialScientificPayload(event(first));
  const secondPayload = factorialScientificPayload(event(second));
  assert.deepEqual(firstPayload, secondPayload);
  assert.equal(
    createHash("sha256").update(JSON.stringify(firstPayload)).digest("hex"),
    createHash("sha256").update(JSON.stringify(secondPayload)).digest("hex"),
  );
  assert.doesNotMatch(JSON.stringify(firstPayload), /host-a|host-b|temporary|unrelated/i);
});
