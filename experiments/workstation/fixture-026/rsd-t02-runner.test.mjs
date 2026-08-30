import assert from "node:assert/strict";
import { readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";

import {
  analyzeFixture026RsdT02,
  executeFixture026RsdT02,
  validateFixture026RsdT02Output,
} from "./rsd-t02-runner.mjs";
import {
  ACTIVE_ARM_IDS,
  CHECKPOINT_FILE,
  RUN_FILE,
  cleanup,
  temporaryOutput,
} from "./rsd-t02-runner.test-support.mjs";

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
    assert.equal(execution.run.arm_packet_records, 5);
    assert.equal(
      execution.run.arm_policy_execution_boundary,
      "fixture-026.rsd-t02-isolated-policy.v2",
    );
    assert.equal(execution.run.isolated_policy_children, 5);
    assert.equal(execution.run.arm_boundary_invocations, 5);
    assert.equal(execution.run.arm_boundary_receipts_sha256.length, 64);
    assert.equal(execution.run.arm_commitment_sha256.length, 64);
    assert.equal(execution.run.arm_commitment_file_sha256.length, 64);

    const summary = await analyzeFixture026RsdT02(fixture.output);
    assert.equal(summary.observed_records, 175);
    assert.equal(summary.o0_records_per_seed, 45);
    assert.equal(summary.o1_records_per_seed, 130);
    assert.equal(summary.system_aggregation.length, 10);
    assert.equal(summary.matched_step_pair_matrix.length, 90);
    assert.equal(summary.pair_matrix.length, 10);
    assert.equal(summary.arm_bank.packet_records, 5);
    assert.deepEqual(summary.arm_bank.active_arm_ids, ACTIVE_ARM_IDS);
    assert.deepEqual(summary.arm_bank.inactive_arm_ids, []);
    assert.equal(summary.arm_bank.exact_information_parity, true);
    assert.equal(summary.arm_bank.identical_common_caps_without_padding, true);
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
