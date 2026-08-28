import assert from "node:assert/strict";
import {
  mkdtemp,
  rename,
  rm,
  symlink,
  unlink,
  writeFile,
} from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { readStableOpenedFile, withStableOpenedFile } from "./opened-file.mjs";

async function temporaryRoot(prefix) {
  return mkdtemp(path.join(os.tmpdir(), prefix));
}

test("stable opened-file reads bind bytes to the named regular file", async () => {
  const root = await temporaryRoot("20w-opened-file-");
  const target = path.join(root, "payload.txt");
  try {
    await writeFile(target, "bound bytes\n");
    assert.equal(
      (await readStableOpenedFile(target, { label: "test payload", containedBy: root })).toString("utf8"),
      "bound bytes\n",
    );
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("stable opened-file refuses a symbolic-link pathname", async (context) => {
  const root = await temporaryRoot("20w-opened-file-link-");
  const target = path.join(root, "target.txt");
  const linked = path.join(root, "linked.txt");
  try {
    await writeFile(target, "outside binding\n");
    try {
      await symlink(target, linked, "file");
    } catch (error) {
      if (["EPERM", "EACCES", "ENOTSUP"].includes(error.code)) {
        context.skip(`symbolic-link creation is unavailable: ${error.code}`);
        return;
      }
      throw error;
    }
    await assert.rejects(
      readStableOpenedFile(linked, { label: "linked payload", containedBy: root }),
      /path is linked or not a regular file/,
    );
  } finally {
    await unlink(linked).catch((error) => {
      if (error.code !== "ENOENT") throw error;
    });
    await rm(root, { recursive: true, force: true });
  }
});

test("stable opened-file detects pathname replacement after opening", async (context) => {
  const root = await temporaryRoot("20w-opened-file-swap-");
  const target = path.join(root, "payload.txt");
  const original = path.join(root, "opened-original.txt");
  let openedBytes = null;
  try {
    await writeFile(target, "opened identity\n");
    try {
      await assert.rejects(
        withStableOpenedFile(
          target,
          { label: "swapped payload", containedBy: root },
          async (handle) => {
            await rename(target, original);
            await writeFile(target, "replacement identity\n");
            openedBytes = await handle.readFile();
          },
        ),
        /opened file changed while it was consumed|path identity changed after it was opened/,
      );
    } catch (error) {
      if (["EPERM", "EACCES", "EBUSY"].includes(error.code)) {
        context.skip(`open-file replacement is unavailable: ${error.code}`);
        return;
      }
      throw error;
    }
    assert.equal(openedBytes.toString("utf8"), "opened identity\n");
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
