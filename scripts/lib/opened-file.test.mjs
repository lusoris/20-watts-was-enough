import assert from "node:assert/strict";
import {
  renameSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import {
  mkdtemp,
  rename,
  rm,
  symlink,
  writeFile,
} from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import {
  readStableOpenedFile,
  readStableOpenedFileSync,
  withStableOpenedFile,
  withStableOpenedFileSync,
} from "./opened-file.mjs";

async function temporaryRoot(t, prefix) {
  const root = await mkdtemp(path.join(os.tmpdir(), prefix));
  t.after(() => rm(root, { recursive: true, force: true }));
  return root;
}

test("stable script reads bind bytes to one contained regular file", async (t) => {
  const root = await temporaryRoot(t, "20w-script-opened-file-");
  const target = path.join(root, "payload.txt");
  await writeFile(target, "bound bytes\n");
  const options = { containedBy: root, maximumBytes: 64 };
  assert.equal((await readStableOpenedFile(target, options)).toString("utf8"), "bound bytes\n");
  assert.equal(readStableOpenedFileSync(target, options).toString("utf8"), "bound bytes\n");
  await assert.rejects(readStableOpenedFile(target, { ...options, maximumBytes: 4 }), /exceeds the 4-byte limit/u);
  await assert.rejects(readStableOpenedFile(target, { ...options, maximumBytes: -1 }), /non-negative safe integer/u);
  assert.throws(() => readStableOpenedFileSync(target, { ...options, maximumBytes: 1.5 }), /non-negative safe integer/u);
});

test("stable synchronous script reads reject links and pathname replacement", async (t) => {
  const root = await temporaryRoot(t, "20w-script-opened-sync-");
  const target = path.join(root, "target.txt");
  const linked = path.join(root, "linked.txt");
  const original = path.join(root, "opened-original.txt");
  writeFileSync(target, "target\n");
  try {
    symlinkSync(target, linked, "file");
    assert.throws(
      () => readStableOpenedFileSync(linked, { containedBy: root }),
      /named path is linked, invalid, or no longer identifies the opened file/u,
    );
  } catch (error) {
    if (!["EPERM", "EACCES", "ENOTSUP"].includes(error.code)) throw error;
  }
  try {
    assert.throws(
      () => withStableOpenedFileSync(target, { containedBy: root }, (descriptor) => {
        renameSync(target, original);
        writeFileSync(target, "replacement\n");
        return descriptor;
      }),
      /opened file changed while it was read|no longer identifies the opened file/u,
    );
  } catch (error) {
    if (!["EPERM", "EACCES", "EBUSY"].includes(error.code)) throw error;
    t.diagnostic(`synchronous open-file replacement is unavailable: ${error.code}`);
  }
});

test("stable script reads reject a symbolic-link pathname", async (t) => {
  const root = await temporaryRoot(t, "20w-script-opened-link-");
  const target = path.join(root, "target.txt");
  const linked = path.join(root, "linked.txt");
  await writeFile(target, "target\n");
  try {
    await symlink(target, linked, "file");
  } catch (error) {
    if (["EPERM", "EACCES", "ENOTSUP"].includes(error.code)) {
      t.skip(`symbolic-link creation is unavailable: ${error.code}`);
      return;
    }
    throw error;
  }
  await assert.rejects(
    readStableOpenedFile(linked, { containedBy: root }),
    /named path is linked, invalid, or no longer identifies the opened file/u,
  );
});

test("stable script reads detect pathname replacement after opening", async (t) => {
  const root = await temporaryRoot(t, "20w-script-opened-swap-");
  const target = path.join(root, "payload.txt");
  const original = path.join(root, "opened-original.txt");
  await writeFile(target, "opened identity\n");
  try {
    await assert.rejects(
      withStableOpenedFile(target, { containedBy: root }, async (handle) => {
        await rename(target, original);
        await writeFile(target, "replacement identity\n");
        return handle.readFile();
      }),
      /opened file changed while it was read|no longer identifies the opened file/u,
    );
  } catch (error) {
    if (["EPERM", "EACCES", "EBUSY"].includes(error.code)) {
      t.skip(`open-file replacement is unavailable: ${error.code}`);
      return;
    }
    throw error;
  }
});
