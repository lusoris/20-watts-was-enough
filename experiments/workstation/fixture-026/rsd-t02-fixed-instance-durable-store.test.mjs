import assert from "node:assert/strict";
import {
  link,
  mkdir,
  mkdtemp,
  readFile,
  rename,
  rm,
  symlink,
  writeFile,
} from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import {
  openFixture026RsdT02BoundedCheckpointLedger,
  prepareFixture026RsdT02SafeOutputDirectory,
} from "./rsd-t02-fixed-instance-durable-store.mjs";

const LINK_UNSUPPORTED = new Set(["EPERM", "EACCES", "ENOTSUP", "EXDEV", "EINVAL"]);

function ledgerOptions(outputIdentity, overrides = {}) {
  return {
    artifact: "fixture-026",
    ledgerFormat: "fixture-026.rsd-t02-durable-store-test.v1",
    outputIdentity,
    rawFilename: "raw.jsonl",
    checkpointFilename: "checkpoint.json",
    maximumRecords: 2,
    maximumRawBytes: 4096,
    maximumCheckpointBytes: 4096,
    runIdentity: { owner: "durable-store-test", result_label: "NO_RESULT" },
    scientificPayload: (record) => ({ id: record.id, value: record.value }),
    workKey: (record) => record.id,
    assertRecord: (record, { sequence }) => {
      assert.equal(record.schema, 1);
      assert.equal(record.sequence, sequence);
      assert.equal(record.result_label, "NO_RESULT");
    },
    ...overrides,
  };
}

function event(id, value, sequence) {
  return { schema: 1, sequence, id, value, result_label: "NO_RESULT", no_result: true };
}

test("canonical output identity rejects directory redirection and replacement", async (t) => {
  const temporary = await mkdtemp(path.join(os.tmpdir(), "20w-f026-safe-output-"));
  const target = path.join(temporary, "target");
  const redirected = path.join(temporary, "redirected");
  const stable = path.join(temporary, "stable");
  const moved = path.join(temporary, "moved");
  try {
    await mkdir(target);
    try {
      await symlink(target, redirected, process.platform === "win32" ? "junction" : "dir");
      await assert.rejects(
        prepareFixture026RsdT02SafeOutputDirectory(path.join(redirected, "nested")),
        /real directory|redirected|reparse/u,
      );
    } catch (error) {
      if (LINK_UNSUPPORTED.has(error?.code)) {
        t.diagnostic(`directory link unsupported on this filesystem: ${error.code}`);
      } else throw error;
    }

    const identity = await prepareFixture026RsdT02SafeOutputDirectory(stable);
    await rename(stable, moved);
    await mkdir(stable);
    await assert.rejects(
      openFixture026RsdT02BoundedCheckpointLedger(ledgerOptions(identity)),
      /identity changed/u,
    );
  } finally {
    await rm(temporary, { recursive: true, force: true });
  }
});

test("redirected and hard-linked raw/checkpoint leaves fail closed", async (t) => {
  const temporary = await mkdtemp(path.join(os.tmpdir(), "20w-f026-safe-leaves-"));
  try {
    const hardRawDirectory = path.join(temporary, "hard-raw");
    const hardRawIdentity = await prepareFixture026RsdT02SafeOutputDirectory(hardRawDirectory);
    const hardRawTarget = path.join(temporary, "hard-raw-target");
    await writeFile(hardRawTarget, "", "utf8");
    try {
      await link(hardRawTarget, path.join(hardRawDirectory, "raw.jsonl"));
      await assert.rejects(
        openFixture026RsdT02BoundedCheckpointLedger(ledgerOptions(hardRawIdentity)),
        /hard-linked/u,
      );
    } catch (error) {
      if (LINK_UNSUPPORTED.has(error?.code)) {
        t.diagnostic(`raw hard link unsupported on this filesystem: ${error.code}`);
      } else throw error;
    }

    const hardCheckpointDirectory = path.join(temporary, "hard-checkpoint");
    const hardCheckpointIdentity = await prepareFixture026RsdT02SafeOutputDirectory(
      hardCheckpointDirectory,
    );
    const hardCheckpointTarget = path.join(temporary, "hard-checkpoint-target");
    await writeFile(hardCheckpointTarget, "{}\n", "utf8");
    try {
      await link(
        hardCheckpointTarget,
        path.join(hardCheckpointDirectory, "checkpoint.json"),
      );
      await assert.rejects(
        openFixture026RsdT02BoundedCheckpointLedger(ledgerOptions(hardCheckpointIdentity)),
        /hard-linked/u,
      );
    } catch (error) {
      if (LINK_UNSUPPORTED.has(error?.code)) {
        t.diagnostic(`checkpoint hard link unsupported on this filesystem: ${error.code}`);
      } else throw error;
    }

    const symlinkDirectory = path.join(temporary, "symlink-raw");
    const symlinkIdentity = await prepareFixture026RsdT02SafeOutputDirectory(symlinkDirectory);
    const symlinkTarget = path.join(temporary, "symlink-target");
    await writeFile(symlinkTarget, "", "utf8");
    try {
      await symlink(symlinkTarget, path.join(symlinkDirectory, "raw.jsonl"), "file");
      await assert.rejects(
        openFixture026RsdT02BoundedCheckpointLedger(ledgerOptions(symlinkIdentity)),
        /redirected|reparse/u,
      );
    } catch (error) {
      if (LINK_UNSUPPORTED.has(error?.code)) {
        t.diagnostic(`file symlink unsupported on this filesystem: ${error.code}`);
      } else throw error;
    }

    const symlinkCheckpointDirectory = path.join(temporary, "symlink-checkpoint");
    const symlinkCheckpointIdentity = await prepareFixture026RsdT02SafeOutputDirectory(
      symlinkCheckpointDirectory,
    );
    const symlinkCheckpointTarget = path.join(temporary, "symlink-checkpoint-target");
    await writeFile(symlinkCheckpointTarget, "{}\n", "utf8");
    try {
      await symlink(
        symlinkCheckpointTarget,
        path.join(symlinkCheckpointDirectory, "checkpoint.json"),
        "file",
      );
      await assert.rejects(
        openFixture026RsdT02BoundedCheckpointLedger(
          ledgerOptions(symlinkCheckpointIdentity),
        ),
        /redirected|reparse/u,
      );
    } catch (error) {
      if (LINK_UNSUPPORTED.has(error?.code)) {
        t.diagnostic(`checkpoint symlink unsupported on this filesystem: ${error.code}`);
      } else throw error;
    }
  } finally {
    await rm(temporary, { recursive: true, force: true });
  }
});

test("raw and checkpoint recovery reads enforce frozen byte and record bounds", async () => {
  const temporary = await mkdtemp(path.join(os.tmpdir(), "20w-f026-bounded-read-"));
  try {
    const rawDirectory = path.join(temporary, "raw-bytes");
    const rawIdentity = await prepareFixture026RsdT02SafeOutputDirectory(rawDirectory);
    await writeFile(path.join(rawDirectory, "raw.jsonl"), Buffer.alloc(65, 0x20));
    await assert.rejects(
      openFixture026RsdT02BoundedCheckpointLedger(ledgerOptions(rawIdentity, {
        maximumRawBytes: 64,
      })),
      /Raw disk ledger exceeds its frozen byte bound/u,
    );

    const checkpointDirectory = path.join(temporary, "checkpoint-bytes");
    const checkpointIdentity = await prepareFixture026RsdT02SafeOutputDirectory(
      checkpointDirectory,
    );
    await writeFile(path.join(checkpointDirectory, "checkpoint.json"), Buffer.alloc(65, 0x20));
    await assert.rejects(
      openFixture026RsdT02BoundedCheckpointLedger(ledgerOptions(checkpointIdentity, {
        maximumCheckpointBytes: 64,
      })),
      /Checkpoint exceeds its frozen byte bound/u,
    );

    const recordDirectory = path.join(temporary, "record-count");
    const recordIdentity = await prepareFixture026RsdT02SafeOutputDirectory(recordDirectory);
    await writeFile(path.join(recordDirectory, "raw.jsonl"), "{}\n{}\n{}\n", "utf8");
    await assert.rejects(
      openFixture026RsdT02BoundedCheckpointLedger(ledgerOptions(recordIdentity)),
      /exceeds its record bound/u,
    );
  } finally {
    await rm(temporary, { recursive: true, force: true });
  }
});

test("a hardlink introduced after open blocks the next append", async (t) => {
  const temporary = await mkdtemp(path.join(os.tmpdir(), "20w-f026-late-hardlink-"));
  const outputDirectory = path.join(temporary, "run");
  let ledger;
  try {
    const identity = await prepareFixture026RsdT02SafeOutputDirectory(outputDirectory);
    ledger = await openFixture026RsdT02BoundedCheckpointLedger(ledgerOptions(identity));
    await ledger.append(event("a", 1, 0));
    const alias = path.join(temporary, "raw-alias");
    try {
      await link(ledger.paths.rawPath, alias);
    } catch (error) {
      if (LINK_UNSUPPORTED.has(error?.code)) {
        t.skip(`filesystem cannot create the hostile hard link: ${error.code}`);
        return;
      }
      throw error;
    }
    await assert.rejects(
      ledger.append(event("b", 2, 1)),
      /hard-linked|private regular file/u,
    );
    await assert.rejects(ledger.saveCheckpoint(), /session is poisoned/u);
    assert.equal(ledger.summary().records, 1);
  } finally {
    await ledger?.close();
    await rm(temporary, { recursive: true, force: true });
  }
});

test("rename-and-empty-leaf replacement cannot split two certified appends", async () => {
  const temporary = await mkdtemp(path.join(os.tmpdir(), "20w-f026-raw-replace-"));
  const outputDirectory = path.join(temporary, "run");
  let ledger;
  try {
    const identity = await prepareFixture026RsdT02SafeOutputDirectory(outputDirectory);
    ledger = await openFixture026RsdT02BoundedCheckpointLedger(ledgerOptions(identity));
    await ledger.append(event("a", 1, 0));
    const displaced = path.join(outputDirectory, "displaced-raw.jsonl");
    await rename(ledger.paths.rawPath, displaced);
    await writeFile(ledger.paths.rawPath, "", { encoding: "utf8", flag: "wx" });
    await assert.rejects(
      ledger.append(event("b", 2, 1)),
      /pathname no longer names|pathname, identity, or byte length changed/u,
    );
    await assert.rejects(ledger.saveCheckpoint(), /session is poisoned/u);
    assert.equal(ledger.summary().records, 1);
    assert.equal((await readFile(displaced, "utf8")).trimEnd().split("\n").length, 1);
    assert.equal(await readFile(ledger.paths.rawPath, "utf8"), "");
    assert.equal(await ledger.close(), true);
    assert.equal(await ledger.close(), false);
    await assert.rejects(ledger.append(event("b", 2, 1)), /session is closed/u);
  } finally {
    await ledger?.close();
    await rm(temporary, { recursive: true, force: true });
  }
});
