import assert from "node:assert/strict";
import {
  mkdir,
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
import { executeFixture026RsdT02 } from "./rsd-t02-runner.mjs";
import {
  ACTIVE_ARM_IDS,
  ARM_ABSTENTION_FILE,
  ARM_ABSTENTION_PENDING_FILE,
  ARM_COMMITMENT_FILE,
  CHECKPOINT_FILE,
  RAW_FILE,
  RUN_FILE,
  SUMMARY_FILE,
  cleanup,
  rehashArmCommitment,
  temporaryOutput,
} from "./rsd-t02-runner.test-support.mjs";

function assertBoundaryAbstention(failed) {
  assert.equal(failed.complete, false);
  assert.equal(failed.boundary_status, "abstained");
  assert.equal(failed.replayed_boundary_abstention, false);
  assert.equal(failed.packet_ordinal, 0);
  assert.equal(failed.system_slot, 0);
  assert.match(failed.seed, /^(0|[1-9][0-9]{0,19})$/u);
  assert.match(failed.system_packet_sha256, /^[0-9a-f]{64}$/u);
  assert.ok(failed.system_packet_utf8_bytes > 0);
  assert.match(failed.boundary_receipt_sha256, /^[0-9a-f]{64}$/u);
  assert.match(failed.boundary_receipts_sha256, /^[0-9a-f]{64}$/u);
  assert.equal(failed.boundary_invocations, 1);
  assert.equal(failed.evaluator_ledger_opened, false);
  assert.equal(failed.raw_ledger_opened, false);
  assert.equal(failed.claim_eligible, false);
  assert.equal(failed.comparison_inference_permitted, false);
  assert.equal(failed.result_label, "NO_RESULT");
  assert.equal(failed.no_result, true);
  assert.deepEqual(
    failed.active_arm_outcomes.map((outcome) => outcome.arm_id),
    ACTIVE_ARM_IDS,
  );
  assert.ok(failed.active_arm_outcomes.every((outcome) => (
    outcome.action === "abstain"
    && outcome.reason_codes.length === 1
    && outcome.retry_invocations === 0
    && outcome.fallback_invocations === 0
    && outcome.claim_eligible === false
    && outcome.comparison_inference_permitted === false
    && outcome.result_label === "NO_RESULT"
    && outcome.no_result === true
  )));
}

function assertStoredAbstention(original, artifact, failed) {
  assert.equal(original, `${canonicalize(artifact)}\n`);
  const hashBody = { ...artifact };
  delete hashBody.abstention_sha256;
  assert.equal(artifact.abstention_sha256, sha256Hex(canonicalize(hashBody)));
  assert.equal(artifact.abstention_sha256, failed.boundary_abstention_sha256);
  assert.equal(sha256Hex(original), failed.boundary_abstention_file_sha256);
  assert.equal(artifact.boundary_receipt_sha256, failed.boundary_receipt_sha256);
  assert.equal(artifact.boundary_receipts_sha256, failed.boundary_receipts_sha256);
}

test("policy-boundary failure is durably abstained before evaluator open and replayed without retry", async () => {
  const fixture = await temporaryOutput("fixture-026-rsd-t02-boundary-abstention-");
  const abstentionPath = path.join(fixture.output, ARM_ABSTENTION_FILE);
  const pendingPath = path.join(fixture.output, ARM_ABSTENTION_PENDING_FILE);
  const evaluatorArtifacts = [RAW_FILE, CHECKPOINT_FILE, RUN_FILE, ARM_COMMITMENT_FILE, SUMMARY_FILE];
  const assertEvaluatorStateAbsent = async () => {
    for (const name of evaluatorArtifacts) {
      await assert.rejects(
        () => readFile(path.join(fixture.output, name)),
        (error) => error.code === "ENOENT",
      );
    }
  };
  try {
    const failed = await executeFixture026RsdT02({
      profile: "smoke",
      output: fixture.output,
      policyTimeoutMs: 1,
    });
    assertBoundaryAbstention(failed);
    const original = await readFile(abstentionPath, "utf8");
    const artifact = JSON.parse(original);
    assertStoredAbstention(original, artifact, failed);
    await assertEvaluatorStateAbsent();
    await assert.rejects(
      () => readFile(pendingPath),
      (error) => error.code === "ENOENT",
    );

    const replayed = await executeFixture026RsdT02({
      profile: "smoke",
      output: fixture.output,
      resume: true,
      policyTimeoutMs: 15_000,
    });
    assert.equal(replayed.boundary_status, "abstained");
    assert.equal(replayed.replayed_boundary_abstention, true);
    assert.equal(replayed.boundary_abstention_sha256, failed.boundary_abstention_sha256);
    assert.equal(await readFile(abstentionPath, "utf8"), original);
    await assertEvaluatorStateAbsent();

    const extraKey = { ...artifact, unexpected: true };
    const extraKeyBody = { ...extraKey };
    delete extraKeyBody.abstention_sha256;
    extraKey.abstention_sha256 = sha256Hex(canonicalize(extraKeyBody));
    await writeFile(abstentionPath, `${canonicalize(extraKey)}\n`, "utf8");
    await assert.rejects(
      () => executeFixture026RsdT02({
        profile: "smoke",
        output: fixture.output,
        resume: true,
      }),
      /boundary abstention violates its closed contract/u,
    );
    await writeFile(abstentionPath, original, "utf8");

    await writeFile(path.join(fixture.output, RAW_FILE), "", "utf8");
    await assert.rejects(
      () => executeFixture026RsdT02({
        profile: "smoke",
        output: fixture.output,
        resume: true,
      }),
      /cannot coexist with evaluator, raw-ledger, or arm-commitment state/u,
    );
    await rm(path.join(fixture.output, RAW_FILE));

    await writeFile(pendingPath, original, "utf8");
    await rm(abstentionPath);
    const recovered = await executeFixture026RsdT02({
      profile: "smoke",
      output: fixture.output,
      resume: true,
    });
    assert.equal(recovered.boundary_status, "abstained");
    assert.equal(recovered.replayed_boundary_abstention, true);
    assert.equal(await readFile(abstentionPath, "utf8"), original);
    await assert.rejects(
      () => readFile(pendingPath),
      (error) => error.code === "ENOENT",
    );
    await assertEvaluatorStateAbsent();
  } finally {
    await cleanup(fixture);
  }
});

test("whole-system arm responses are committed before any evaluator-bearing raw record", async () => {
  const fixture = await temporaryOutput("fixture-026-rsd-t02-arm-precommit-");
  try {
    const partial = await executeFixture026RsdT02({
      profile: "smoke",
      output: fixture.output,
      maxWorkUnits: 1,
    });
    assert.equal(partial.complete, false);
    const armPath = path.join(fixture.output, ARM_COMMITMENT_FILE);
    const armText = await readFile(armPath, "utf8");
    const commitment = JSON.parse(armText);
    assert.equal(commitment.packet_records.length, 5);
    assert.ok(commitment.packet_records.every((record) => (
      record.active_arm_responses.length === 9
      && record.inactive_arm_responses.length === 0
    )));
    assert.equal(
      commitment.packet_records.reduce(
        (total, record) => total + record.active_arm_responses.length,
        0,
      ),
      45,
    );
    assert.equal((await readFile(path.join(fixture.output, RAW_FILE), "utf8")).trimEnd().split("\n").length, 1);

    await rm(armPath);
    await assert.rejects(
      () => executeFixture026RsdT02({
        profile: "smoke", output: fixture.output, resume: true, maxWorkUnits: 1,
      }),
      /refuses to create an arm commitment after evaluator-bearing run state exists/u,
    );
    await writeFile(armPath, armText);

    const forged = structuredClone(commitment);
    const forgedConfigSha = "f".repeat(64);
    forged.policy_config_sha256 = forgedConfigSha;
    for (const record of forged.packet_records) {
      for (const response of record.active_arm_responses) {
        response.policy_config_sha256 = forgedConfigSha;
        response.resource_ledger.policy_construction.policy_config_sha256 = forgedConfigSha;
      }
    }
    rehashArmCommitment(forged);
    await writeFile(armPath, `${JSON.stringify(forged, null, 2)}\n`);
    await assert.rejects(
      () => executeFixture026RsdT02({
        profile: "smoke", output: fixture.output, resume: true, maxWorkUnits: 1,
      }),
      /stored arm commitment differs from the frozen policies and packet grid/u,
    );
  } finally {
    await cleanup(fixture);
  }
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
