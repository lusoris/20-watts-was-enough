import assert from "node:assert/strict";
import {
  cp,
  mkdtemp,
  mkdir,
  readFile,
  rename,
  rm,
  symlink,
  unlink,
  writeFile,
} from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { readStableOpenedFile, withStableOpenedFile } from "./lib/opened-file.mjs";
import { validateSourceBoundary } from "./lib/source-boundary.mjs";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

async function withSourceSnapshot(callback) {
  const root = await mkdtemp(path.join(os.tmpdir(), "source-boundary-"));
  try {
    await cp(path.join(projectRoot, "sources"), path.join(root, "sources"), { recursive: true });
    await callback(root);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
}

test("current repository source tree matches the closed publication manifest", async () => {
  const result = await validateSourceBoundary({ repositoryRoot: projectRoot });
  assert.equal(result.records.length, 10);
  assert.equal(result.taxonomyFiles.length, 6);
  assert.equal(result.pinnedFiles, 17);
});

test("an unreviewed file fails the exact source-path allowlist", async () => {
  await withSourceSnapshot(async (root) => {
    await writeFile(path.join(root, "sources", "raw-paper.pdf"), "%PDF-1.7\n");
    await assert.rejects(
      validateSourceBoundary({ repositoryRoot: root }),
      /Source publication allowlist mismatch.*raw-paper\.pdf/u,
    );
  });
});

test("a body appended to a pinned Google record fails closed", async () => {
  await withSourceSnapshot(async (root) => {
    const recordPath = path.join(root, "sources", "2026-08-05-google-doc.md");
    const record = await readFile(recordPath, "utf8");
    await writeFile(recordPath, `${record}\n## Appended body\nUnreviewed document text.\n`);
    await assert.rejects(
      validateSourceBoundary({ repositoryRoot: root }),
      /2026-08-05-google-doc\.md integrity mismatch/u,
    );
  });
});

test("tampering with sources/README.md fails its size and digest pin", async () => {
  await withSourceSnapshot(async (root) => {
    const indexPath = path.join(root, "sources", "README.md");
    const index = await readFile(indexPath, "utf8");
    await writeFile(indexPath, `${index}\nUnreviewed publication rule.\n`);
    await assert.rejects(
      validateSourceBoundary({ repositoryRoot: root }),
      /README\.md integrity mismatch/u,
    );
  });
});

test("same-size taxonomy replacement fails its SHA-256 pin", async () => {
  await withSourceSnapshot(async (root) => {
    const taxonomyPath = path.join(
      root,
      "sources",
      "taxonomies",
      "2026-08-25",
      "euroscivoc-concepts.rq",
    );
    const replacement = await readFile(taxonomyPath);
    replacement[0] ^= 1;
    await writeFile(taxonomyPath, replacement);
    await assert.rejects(
      validateSourceBoundary({ repositoryRoot: root }),
      /euroscivoc-concepts\.rq integrity mismatch: expected SHA-256/u,
    );
  });
});

test("a missing pinned taxonomy file fails the exact source-path allowlist", async () => {
  await withSourceSnapshot(async (root) => {
    const taxonomyPath = path.join(
      root,
      "sources",
      "taxonomies",
      "2026-08-25",
      "euroscivoc-v1.6.rdf",
    );
    await rm(taxonomyPath);
    await assert.rejects(
      validateSourceBoundary({ repositoryRoot: root }),
      /Source publication allowlist mismatch.*euroscivoc-v1\.6\.rdf/u,
    );
  });
});

test("a nested unreviewed record cannot bypass the closed allowlist", async () => {
  await withSourceSnapshot(async (root) => {
    const nested = path.join(root, "sources", "2026-08-27");
    await mkdir(nested, { recursive: true });
    await writeFile(
      path.join(nested, "record.md"),
      "# Link-only source record: surprise\n\n- **Authority:** not scientific evidence.\n",
    );
    await assert.rejects(
      validateSourceBoundary({ repositoryRoot: root }),
      /Source publication allowlist mismatch.*2026-08-27\/record\.md/u,
    );
  });
});

test("stable source reads refuse a symbolic-link pathname", async (context) => {
  const root = await mkdtemp(path.join(os.tmpdir(), "source-boundary-link-"));
  const target = path.join(root, "target.md");
  const linked = path.join(root, "linked.md");
  try {
    await writeFile(target, "# trusted target\n");
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
      readStableOpenedFile(linked, {
        label: "linked source record",
        containedBy: root,
        maximumBytes: 1024,
      }),
      /named path is linked|path resolves through a link/,
    );
  } finally {
    await unlink(linked).catch((error) => {
      if (error.code !== "ENOENT") throw error;
    });
    await rm(root, { recursive: true, force: true });
  }
});

test("stable source reads detect named-path replacement after opening", async (context) => {
  const root = await mkdtemp(path.join(os.tmpdir(), "source-boundary-swap-"));
  const target = path.join(root, "record.md");
  const original = path.join(root, "opened-original.md");
  let openedBytes = null;
  try {
    await writeFile(target, "opened source identity\n");
    try {
      await assert.rejects(
        withStableOpenedFile(
          target,
          { label: "swapped source record", containedBy: root, maximumBytes: 1024 },
          async (handle) => {
            await rename(target, original);
            await writeFile(target, "replacement identity!\n");
            openedBytes = await handle.readFile();
          },
        ),
        /opened file changed while it was read|named path is linked, invalid, or no longer identifies the opened file/,
      );
    } catch (error) {
      if (["EPERM", "EACCES", "EBUSY"].includes(error.code)) {
        context.skip(`open-file replacement is unavailable: ${error.code}`);
        return;
      }
      throw error;
    }
    assert.equal(openedBytes.toString("utf8"), "opened source identity\n");
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
