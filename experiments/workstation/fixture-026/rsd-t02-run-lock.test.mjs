import assert from "node:assert/strict";
import { link, mkdtemp, readdir, readFile, rename, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import {
  Fixture026RsdT02RunLockContentionError,
  FIXTURE_026_RSD_T02_RETIRED_LOCK_POLICY,
  acquireFixture026RsdT02RunLock,
  acquireFixture026RsdT02RunLockForReleaseRaceTest,
  fixture026RsdT02RunLockPath,
} from "./rsd-t02-run-lock.mjs";

test("one atomic lock winner releases through an identity-bound quarantine", async () => {
  const temporary = await mkdtemp(path.join(os.tmpdir(), "20w-f026-lock-winner-"));
  const outputDirectory = path.join(temporary, "run");
  try {
    const contenders = await Promise.allSettled(Array.from({ length: 8 }, (_, index) => (
      acquireFixture026RsdT02RunLock({
        outputDirectory,
        runnerId: `fixture-026-contender-${index}`,
      })
    )));
    const winners = contenders.filter(({ status }) => status === "fulfilled");
    const losers = contenders.filter(({ status }) => status === "rejected");
    assert.equal(winners.length, 1);
    assert.equal(losers.length, 7);
    assert.equal(losers.every(({ reason }) => (
      reason instanceof Fixture026RsdT02RunLockContentionError
    )), true);
    assert.equal(await winners[0].value.release(), true);
    assert.equal(await winners[0].value.release(), false);
    await assert.rejects(readFile(fixture026RsdT02RunLockPath(outputDirectory)), /ENOENT/u);
    let retired = (await readdir(temporary)).filter((name) => name.includes(".release-"));
    assert.equal(retired.length, 1);
    assert.match(await readFile(path.join(temporary, retired[0]), "utf8"), /fixture-026-contender/u);
    const successor = await acquireFixture026RsdT02RunLock({
      outputDirectory,
      runnerId: "fixture-026-successor",
    });
    assert.equal(await successor.release(), true);
    retired = (await readdir(temporary)).filter((name) => name.includes(".release-"));
    assert.equal(retired.length, 2);
    assert.equal(FIXTURE_026_RSD_T02_RETIRED_LOCK_POLICY.retired_path_unlink_permitted, false);
    assert.equal(FIXTURE_026_RSD_T02_RETIRED_LOCK_POLICY.result_label, "NO_RESULT");
  } finally {
    await rm(temporary, { recursive: true, force: true });
  }
});

test("replacement after verification is restored and never unlinked", async (t) => {
  const temporary = await mkdtemp(path.join(os.tmpdir(), "20w-f026-lock-race-"));
  const outputDirectory = path.join(temporary, "run");
  let reachedHook;
  let continueRelease;
  const hookReached = new Promise((resolve) => { reachedHook = resolve; });
  const releaseMayContinue = new Promise((resolve) => { continueRelease = resolve; });
  const lease = await acquireFixture026RsdT02RunLockForReleaseRaceTest({
    outputDirectory,
    runnerId: "fixture-026-release-race-owner",
  }, {
    after_identity_verified: async () => {
      reachedHook();
      await releaseMayContinue;
    },
  });
  const displaced = path.join(temporary, "verified-original.lock");
  const replacement = `${JSON.stringify({
    schema: 1,
    contract_version: "foreign-replacement-v1",
    lock_id: "must-survive",
  })}\n`;
  try {
    const releasing = lease.release();
    await hookReached;
    try {
      await rename(lease.lockPath, displaced);
    } catch (error) {
      continueRelease();
      await releasing;
      if (["EPERM", "EACCES", "ENOTSUP"].includes(error?.code)) {
        t.skip(`platform cannot rename an open lock handle: ${error.code}`);
        return;
      }
      throw error;
    }
    await writeFile(lease.lockPath, replacement, { encoding: "utf8", flag: "wx" });
    continueRelease();
    await assert.rejects(releasing, /refusing foreign-lock removal/u);
    assert.equal(await readFile(lease.lockPath, "utf8"), replacement);
    assert.match(await readFile(displaced, "utf8"), /fixture-026-release-race-owner/u);
  } finally {
    continueRelease?.();
    await rm(temporary, { recursive: true, force: true });
  }
});

test("hard-linked lock aliases fail closed where the filesystem supports them", async (t) => {
  const temporary = await mkdtemp(path.join(os.tmpdir(), "20w-f026-lock-hardlink-"));
  const outputDirectory = path.join(temporary, "run");
  const alias = path.join(temporary, "lock-alias");
  const lease = await acquireFixture026RsdT02RunLock({
    outputDirectory,
    runnerId: "fixture-026-hardlink-owner",
  });
  try {
    try {
      await link(lease.lockPath, alias);
    } catch (error) {
      if (["EPERM", "EACCES", "ENOTSUP", "EXDEV"].includes(error?.code)) {
        await lease.release();
        t.skip(`filesystem cannot create the hostile hard link: ${error.code}`);
        return;
      }
      throw error;
    }
    await assert.rejects(lease.release(), /hard-linked|private regular file/u);
    assert.match(await readFile(lease.lockPath, "utf8"), /fixture-026-hardlink-owner/u);
    assert.match(await readFile(alias, "utf8"), /fixture-026-hardlink-owner/u);
  } finally {
    await rm(temporary, { recursive: true, force: true });
  }
});

test("a watcher replacement at the retired path is retained and never deleted", async (t) => {
  const temporary = await mkdtemp(path.join(os.tmpdir(), "20w-f026-lock-retired-race-"));
  const outputDirectory = path.join(temporary, "run");
  const displaced = path.join(temporary, "retired-original.lock");
  const foreign = `${JSON.stringify({
    schema: 1,
    contract_version: "foreign-retired-replacement-v1",
    lock_id: "must-never-be-deleted",
  })}\n`;
  let retiredPath;
  let unsupportedReplacement = null;
  const lease = await acquireFixture026RsdT02RunLockForReleaseRaceTest({
    outputDirectory,
    runnerId: "fixture-026-retired-watcher-owner",
  }, {
    after_identity_verified: async () => {},
    after_quarantine_verified: async ({ quarantinePath }) => {
      retiredPath = quarantinePath;
      try {
        await rename(quarantinePath, displaced);
      } catch (error) {
        if (["EPERM", "EACCES", "ENOTSUP"].includes(error?.code)) {
          unsupportedReplacement = error;
          return;
        }
        throw error;
      }
      await writeFile(quarantinePath, foreign, { encoding: "utf8", flag: "wx" });
    },
  });
  try {
    const released = await Promise.allSettled([lease.release()]);
    if (unsupportedReplacement !== null) {
      assert.equal(released[0].status, "fulfilled");
      t.skip(`platform cannot replace an open retired lock: ${unsupportedReplacement.code}`);
      return;
    }
    assert.equal(released[0].status, "rejected");
    assert.match(released[0].reason.message, /refusing foreign-lock removal/u);
    assert.equal(await readFile(retiredPath, "utf8"), foreign);
    assert.equal(await readFile(lease.lockPath, "utf8"), foreign);
    assert.match(await readFile(displaced, "utf8"), /fixture-026-retired-watcher-owner/u);
  } finally {
    await rm(temporary, { recursive: true, force: true });
  }
});

test("acquisition validation failure retains both displaced and replacement locks", async (t) => {
  const temporary = await mkdtemp(path.join(os.tmpdir(), "20w-f026-lock-acquire-race-"));
  const outputDirectory = path.join(temporary, "run");
  const displaced = path.join(temporary, "acquired-original.lock");
  const foreign = `${JSON.stringify({
    schema: 1,
    contract_version: "foreign-acquisition-replacement-v1",
    lock_id: "must-never-be-deleted",
  })}\n`;
  let canonicalPath;
  let unsupportedReplacement = null;
  try {
    const acquired = await Promise.allSettled([
      acquireFixture026RsdT02RunLockForReleaseRaceTest({
        outputDirectory,
        runnerId: "fixture-026-acquisition-race-owner",
      }, {
        after_identity_verified: async () => {},
        after_acquired_identity: async ({ lockPath }) => {
          canonicalPath = lockPath;
          try {
            await rename(lockPath, displaced);
          } catch (error) {
            if (["EPERM", "EACCES", "ENOTSUP"].includes(error?.code)) {
              unsupportedReplacement = error;
              return;
            }
            throw error;
          }
          await writeFile(lockPath, foreign, { encoding: "utf8", flag: "wx" });
        },
      }),
    ]);
    if (unsupportedReplacement !== null) {
      assert.equal(acquired[0].status, "fulfilled");
      await acquired[0].value.release();
      t.skip(`platform cannot replace an open acquiring lock: ${unsupportedReplacement.code}`);
      return;
    }
    assert.equal(acquired[0].status, "rejected");
    assert.match(acquired[0].reason.message, /pathname no longer names the acquired handle/u);
    assert.equal(await readFile(canonicalPath, "utf8"), foreign);
    assert.match(await readFile(displaced, "utf8"), /fixture-026-acquisition-race-owner/u);
    await assert.rejects(
      acquireFixture026RsdT02RunLock({
        outputDirectory,
        runnerId: "fixture-026-acquisition-race-successor",
      }),
      Fixture026RsdT02RunLockContentionError,
    );
  } finally {
    await rm(temporary, { recursive: true, force: true });
  }
});
