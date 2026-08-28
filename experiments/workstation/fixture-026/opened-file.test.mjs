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

test("Fixture 026 stable reads bind bytes to one contained regular-file identity", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "20w-f026-opened-file-"));
  const target = path.join(root, "payload.txt");
  try {
    await writeFile(target, "bound bytes\n");
    const bytes = await readStableOpenedFile(target, {
      label: "test payload",
      containedBy: root,
    });
    assert.equal(bytes.toString("utf8"), "bound bytes\n");
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("Fixture 026 stable reads refuse a symbolic-link pathname", async (context) => {
  const root = await mkdtemp(path.join(os.tmpdir(), "20w-f026-opened-link-"));
  const target = path.join(root, "target.txt");
  const linked = path.join(root, "linked.txt");
  try {
    await writeFile(target, "linked bytes\n");
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
      /path is linked or not a regular file/u,
    );
  } finally {
    await unlink(linked).catch((error) => {
      if (error.code !== "ENOENT") throw error;
    });
    await rm(root, { recursive: true, force: true });
  }
});

test("Fixture 026 stable reads detect pathname replacement during consumption", async (context) => {
  const root = await mkdtemp(path.join(os.tmpdir(), "20w-f026-opened-swap-"));
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
        /opened file changed while it was consumed|path identity changed after it was opened/u,
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
