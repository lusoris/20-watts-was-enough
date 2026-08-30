import assert from "node:assert/strict";
import { readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";

import {
  analyzeFixture026RsdT02,
  executeFixture026RsdT02,
} from "./rsd-t02-runner.mjs";
import {
  ARM_COMMITMENT_FILE,
  CHECKPOINT_FILE,
  RAW_FILE,
  RUN_FILE,
  SUMMARY_FILE,
  cleanup,
  temporaryOutput,
} from "./rsd-t02-runner.test-support.mjs";

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

    for (const name of [RAW_FILE, CHECKPOINT_FILE, ARM_COMMITMENT_FILE]) {
      assert.equal(
        await readFile(path.join(resumed.output, name), "utf8"),
        await readFile(path.join(uninterrupted.output, name), "utf8"),
      );
    }
    assert.deepEqual(
      await analyzeFixture026RsdT02(resumed.output),
      await analyzeFixture026RsdT02(uninterrupted.output),
    );

    const before = await Promise.all([RAW_FILE, CHECKPOINT_FILE, RUN_FILE, ARM_COMMITMENT_FILE, SUMMARY_FILE].map(
      (name) => readFile(path.join(resumed.output, name), "utf8"),
    ));
    const again = await executeFixture026RsdT02({
      profile: "smoke",
      output: resumed.output,
      resume: true,
    });
    assert.equal(again.complete, true);
    const after = await Promise.all([RAW_FILE, CHECKPOINT_FILE, RUN_FILE, ARM_COMMITMENT_FILE, SUMMARY_FILE].map(
      (name) => readFile(path.join(resumed.output, name), "utf8"),
    ));
    assert.deepEqual(after, before);
  } finally {
    await cleanup(resumed, uninterrupted);
  }
});
