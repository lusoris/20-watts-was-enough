import assert from "node:assert/strict";
import { access, mkdtemp, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import {
  RunLockContentionError,
  acquireRunLock,
  runLockPath,
} from "./run-lock.mjs";

async function absent(file) {
  try {
    await access(file);
    return false;
  } catch (error) {
    if (error.code === "ENOENT") return true;
    throw error;
  }
}

test("one atomic winner excludes concurrent writers until verified release", async () => {
  const temporary = await mkdtemp(path.join(os.tmpdir(), "20w-c010-run-lock-"));
  const outputDirectory = path.join(temporary, "factorial-output");
  try {
    const contenders = await Promise.allSettled(
      Array.from({ length: 12 }, (_, index) => acquireRunLock({
        outputDirectory,
        runnerId: `hostile-contender-${index}`,
      })),
    );
    const winners = contenders.filter((result) => result.status === "fulfilled");
    const losers = contenders.filter((result) => result.status === "rejected");
    assert.equal(winners.length, 1);
    assert.equal(losers.length, 11);
    assert.ok(losers.every((result) => (
      result.reason instanceof RunLockContentionError
      && result.reason.code === "CANDIDATE_010_RUN_LOCK_CONTENDED"
    )));
    assert.equal(await winners[0].value.release(), true);
    assert.equal(await winners[0].value.release(), false);
    assert.equal(await absent(runLockPath(outputDirectory)), true);
  } finally {
    await rm(temporary, { recursive: true, force: true });
  }
});

test("an old or foreign lock is never auto-broken", async () => {
  const temporary = await mkdtemp(path.join(os.tmpdir(), "20w-c010-stale-lock-"));
  const outputDirectory = path.join(temporary, "factorial-output");
  const lockPath = runLockPath(outputDirectory);
  try {
    await writeFile(lockPath, `${JSON.stringify({
      schema: 1,
      lock_id: "foreign-owner",
      acquired_at: "1970-01-01T00:00:00.000Z",
      auto_break: false,
    })}\n`, { flag: "wx" });
    await assert.rejects(
      acquireRunLock({ outputDirectory, runnerId: "new-writer" }),
      (error) => error instanceof RunLockContentionError,
    );
    assert.equal(await absent(lockPath), false);
  } finally {
    await rm(temporary, { recursive: true, force: true });
  }
});

test("a lease refuses to delete ownership material changed behind its back", async () => {
  const temporary = await mkdtemp(path.join(os.tmpdir(), "20w-c010-foreign-lock-"));
  const outputDirectory = path.join(temporary, "factorial-output");
  const lease = await acquireRunLock({ outputDirectory, runnerId: "original-writer" });
  try {
    await writeFile(lease.lockPath, `${JSON.stringify({ schema: 1, lock_id: "substituted" })}\n`);
    await assert.rejects(lease.release(), /refusing to remove a lock not owned/);
    assert.equal(await absent(lease.lockPath), false);
  } finally {
    await rm(temporary, { recursive: true, force: true });
  }
});
