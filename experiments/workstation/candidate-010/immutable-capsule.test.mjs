import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import {
  access,
  chmod,
  mkdir,
  mkdtemp,
  readFile,
  rm,
  symlink,
  unlink,
  writeFile,
} from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { promisify } from "node:util";
import {
  IMMUTABLE_CAPSULE_LIMITS,
  buildImmutableExecutionCapsule,
  destroyImmutableExecutionCapsule,
  verifyImmutableExecutionCapsule,
} from "./immutable-capsule.mjs";

const executeFile = promisify(execFile);
const sourcePaths = Object.freeze([
  "candidate/entry.mjs",
  "candidate/entry.test.mjs",
  "scripts/control.mjs",
]);

async function git(repositoryRoot, ...args) {
  return executeFile("git", ["-C", repositoryRoot, ...args], {
    encoding: "utf8",
    windowsHide: true,
  });
}

async function gitBuffer(repositoryRoot, ...args) {
  return executeFile("git", ["-C", repositoryRoot, ...args], {
    encoding: "buffer",
    windowsHide: true,
  });
}

async function fixture() {
  const repositoryRoot = await mkdtemp(path.join(os.tmpdir(), "20w-capsule-repository-"));
  const capsuleParent = await mkdtemp(path.join(os.tmpdir(), "20w-capsule-parent-"));
  await mkdir(path.join(repositoryRoot, "candidate"));
  await mkdir(path.join(repositoryRoot, "scripts"));
  await writeFile(
    path.join(repositoryRoot, "candidate", "entry.mjs"),
    "export const committedValue = 'exact-head';\n",
  );
  await writeFile(
    path.join(repositoryRoot, "candidate", "entry.test.mjs"),
    "import './entry.mjs';\n",
  );
  await writeFile(
    path.join(repositoryRoot, "scripts", "control.mjs"),
    "export const controlVersion = 1;\n",
  );
  await git(repositoryRoot, "init", "--quiet");
  await git(repositoryRoot, "config", "user.name", "Capsule Test");
  await git(repositoryRoot, "config", "user.email", "capsule@example.invalid");
  await git(repositoryRoot, "config", "commit.gpgsign", "false");
  await git(repositoryRoot, "config", "core.autocrlf", "false");
  await git(repositoryRoot, "add", "--", ...sourcePaths);
  await git(repositoryRoot, "commit", "--quiet", "-m", "fixture");
  return { repositoryRoot, capsuleParent };
}

async function cleanupFixture(value) {
  await rm(value.repositoryRoot, { recursive: true, force: true });
  await rm(value.capsuleParent, { recursive: true, force: true });
}

function keySortedRoundTrip(value) {
  if (Array.isArray(value)) return value.map(keySortedRoundTrip);
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.keys(value).sort().map((key) => (
      [key, keySortedRoundTrip(value[key])]
    )));
  }
  return value;
}

test("capsule materializes exact clean HEAD blobs and verifies a deterministic sealed inventory", async () => {
  const value = await fixture();
  let descriptor;
  try {
    descriptor = await buildImmutableExecutionCapsule({
      ...value,
      sourcePaths,
      candidateDirectory: "candidate",
    });
    assert.match(descriptor.head_commit, /^[0-9a-f]{40,64}$/);
    assert.equal(descriptor.inventory_sha256, descriptor.pre_seal_inventory.inventory_sha256);
    assert.equal(descriptor.inventory_sha256, descriptor.post_seal_inventory.inventory_sha256);
    assert.deepEqual(descriptor.source_paths, [...sourcePaths].sort());
    assert.equal(descriptor.limits.execution_authority, "none");
    assert.equal(descriptor.limits.dependencies_included, false);
    assert.equal(descriptor.limits.malicious_host_immutability, false);
    assert.deepEqual(descriptor.limits, IMMUTABLE_CAPSULE_LIMITS);

    for (const relative of sourcePaths) {
      const { stdout: committed } = await gitBuffer(
        value.repositoryRoot,
        "show",
        `${descriptor.head_commit}:${relative}`,
      );
      assert.deepEqual(
        await readFile(path.join(descriptor.capsule_root, ...relative.split("/"))),
        committed,
      );
    }
    const verified = await verifyImmutableExecutionCapsule(descriptor);
    assert.equal(verified.inventory_sha256, descriptor.inventory_sha256);
  } finally {
    if (descriptor) await destroyImmutableExecutionCapsule(descriptor);
    await cleanupFixture(value);
  }
});

test("verification accepts canonical JSON key sorting but preserves exact inventory structure and order", async () => {
  const value = await fixture();
  let descriptor;
  try {
    descriptor = await buildImmutableExecutionCapsule({
      ...value,
      sourcePaths,
      candidateDirectory: "candidate",
    });
    const sortedDescriptor = JSON.parse(JSON.stringify(keySortedRoundTrip(descriptor)));
    const verified = await verifyImmutableExecutionCapsule(sortedDescriptor);
    assert.equal(verified.inventory_sha256, descriptor.inventory_sha256);

    const reorderedFiles = structuredClone(sortedDescriptor);
    reorderedFiles.post_seal_inventory.files.reverse();
    await assert.rejects(
      verifyImmutableExecutionCapsule(reorderedFiles),
      /inventory or bytes differ/,
    );

    const unknownInventoryField = structuredClone(sortedDescriptor);
    unknownInventoryField.post_seal_inventory.unbound = true;
    await assert.rejects(
      verifyImmutableExecutionCapsule(unknownInventoryField),
      /inventory or bytes differ/,
    );

    const missingCount = structuredClone(sortedDescriptor);
    delete missingCount.post_seal_inventory.file_count;
    await assert.rejects(
      verifyImmutableExecutionCapsule(missingCount),
      /inventory or bytes differ/,
    );

    const mutatedHash = structuredClone(sortedDescriptor);
    mutatedHash.post_seal_inventory.files[0].sha256 = "0".repeat(64);
    await assert.rejects(
      verifyImmutableExecutionCapsule(mutatedHash),
      /inventory or bytes differ/,
    );
  } finally {
    if (descriptor) await destroyImmutableExecutionCapsule(descriptor);
    await cleanupFixture(value);
  }
});

test("explicit full source commit materializes that commit after HEAD advances", async () => {
  const value = await fixture();
  const descriptors = [];
  try {
    const commitA = (await git(value.repositoryRoot, "rev-parse", "HEAD")).stdout.trim();
    const committedA = await readFile(
      path.join(value.repositoryRoot, "candidate", "entry.mjs"),
      "utf8",
    );
    await writeFile(path.join(value.repositoryRoot, "README.md"), "metadata only\n");
    await git(value.repositoryRoot, "add", "README.md");
    await git(value.repositoryRoot, "commit", "--quiet", "-m", "metadata B");

    const afterMetadata = await buildImmutableExecutionCapsule({
      ...value,
      sourcePaths,
      sourceCommit: commitA,
      candidateDirectory: "candidate",
    });
    descriptors.push(afterMetadata);
    assert.equal(afterMetadata.head_commit, commitA);
    assert.equal(
      await readFile(path.join(afterMetadata.capsule_root, "candidate", "entry.mjs"), "utf8"),
      committedA,
    );

    await writeFile(
      path.join(value.repositoryRoot, "candidate", "entry.mjs"),
      "export const committedValue = 'changed-at-B';\n",
    );
    await git(value.repositoryRoot, "add", "candidate/entry.mjs");
    await git(value.repositoryRoot, "commit", "--quiet", "-m", "selected source B");
    const afterCodeChange = await buildImmutableExecutionCapsule({
      ...value,
      sourcePaths,
      sourceCommit: commitA,
      candidateDirectory: "candidate",
    });
    descriptors.push(afterCodeChange);
    assert.equal(afterCodeChange.head_commit, commitA);
    assert.equal(
      await readFile(path.join(afterCodeChange.capsule_root, "candidate", "entry.mjs"), "utf8"),
      committedA,
      "later selected code must not silently substitute for the requested commit",
    );

    await assert.rejects(
      buildImmutableExecutionCapsule({
        ...value,
        sourcePaths,
        sourceCommit: commitA.slice(0, 12),
        candidateDirectory: "candidate",
      }),
      /full exact Git commit object ID/,
    );
    await assert.rejects(
      buildImmutableExecutionCapsule({
        ...value,
        sourcePaths,
        sourceCommit: "f".repeat(40),
        candidateDirectory: "candidate",
      }),
      /git rev-parse failed/,
    );
    const blob = (await git(
      value.repositoryRoot,
      "rev-parse",
      "HEAD:candidate/entry.mjs",
    )).stdout.trim();
    await assert.rejects(
      buildImmutableExecutionCapsule({
        ...value,
        sourcePaths,
        sourceCommit: blob,
        candidateDirectory: "candidate",
      }),
      /git rev-parse failed|not a commit object/,
    );

    await writeFile(
      path.join(value.repositoryRoot, "candidate", "entry.mjs"),
      "export const committedValue = 'dirty';\n",
    );
    await assert.rejects(
      buildImmutableExecutionCapsule({
        ...value,
        sourcePaths,
        sourceCommit: commitA,
        candidateDirectory: "candidate",
      }),
      /tracked, staged, or untracked changes/,
    );
  } finally {
    for (const descriptor of descriptors) await destroyImmutableExecutionCapsule(descriptor);
    await cleanupFixture(value);
  }
});

test("dirty tracked, staged, and untracked Candidate source all refuse capsule construction", async () => {
  const value = await fixture();
  const entry = path.join(value.repositoryRoot, "candidate", "entry.mjs");
  const control = path.join(value.repositoryRoot, "scripts", "control.mjs");
  const entryBody = await readFile(entry, "utf8");
  const controlBody = await readFile(control, "utf8");
  const build = () => buildImmutableExecutionCapsule({
    ...value,
    sourcePaths,
    candidateDirectory: "candidate",
  });
  try {
    await writeFile(entry, `${entryBody}// dirty\n`);
    await assert.rejects(build(), /tracked, staged, or untracked changes/);
    await writeFile(entry, entryBody);

    await writeFile(control, `${controlBody}// staged\n`);
    await git(value.repositoryRoot, "add", "--", "scripts/control.mjs");
    await assert.rejects(build(), /tracked, staged, or untracked changes/);
    await writeFile(control, controlBody);
    await git(value.repositoryRoot, "add", "--", "scripts/control.mjs");

    const untracked = path.join(value.repositoryRoot, "candidate", "untracked.mjs");
    await writeFile(untracked, "export const bypass = true;\n");
    await assert.rejects(build(), /untracked Candidate production\/test files/);
    await rm(untracked);
  } finally {
    await cleanupFixture(value);
  }
});

test("capsule verification refuses byte mutation and destroy remains contained and idempotent", async () => {
  const value = await fixture();
  let descriptor;
  try {
    descriptor = await buildImmutableExecutionCapsule({
      ...value,
      sourcePaths,
      candidateDirectory: "candidate",
    });
    const target = path.join(descriptor.capsule_root, "candidate", "entry.mjs");
    await chmod(target, 0o600);
    await writeFile(target, "export const committedValue = 'mutated';\n");
    await assert.rejects(
      verifyImmutableExecutionCapsule(descriptor),
      /inventory or bytes differ/,
    );

    await assert.rejects(
      destroyImmutableExecutionCapsule({
        ...descriptor,
        capsule_root: path.join(descriptor.capsule_parent, "not-a-generated-capsule"),
      }),
      /not a contained generated capsule/,
    );
    assert.equal(await destroyImmutableExecutionCapsule(descriptor), true);
    assert.equal(await destroyImmutableExecutionCapsule(descriptor), false);
    await assert.rejects(access(descriptor.capsule_root), (error) => error.code === "ENOENT");
    descriptor = null;
  } finally {
    if (descriptor) await destroyImmutableExecutionCapsule(descriptor);
    await cleanupFixture(value);
  }
});

test("source escapes, in-repository parents, and reparse-point parents refuse before materialization", async () => {
  const value = await fixture();
  const realParent = await mkdtemp(path.join(os.tmpdir(), "20w-capsule-real-parent-"));
  const linkedParent = `${realParent}-junction`;
  try {
    await assert.rejects(
      buildImmutableExecutionCapsule({
        ...value,
        sourcePaths: ["../outside.mjs"],
        candidateDirectory: "candidate",
      }),
      /escapes|invalid repository-relative/,
    );
    await assert.rejects(
      buildImmutableExecutionCapsule({
        repositoryRoot: value.repositoryRoot,
        capsuleParent: path.join(value.repositoryRoot, "candidate"),
        sourcePaths,
        candidateDirectory: "candidate",
      }),
      /isolated from the repository tree/,
    );
    await symlink(realParent, linkedParent, "junction");
    await assert.rejects(
      buildImmutableExecutionCapsule({
        repositoryRoot: value.repositoryRoot,
        capsuleParent: linkedParent,
        sourcePaths,
        candidateDirectory: "candidate",
      }),
      /symbolic link or reparse point/,
    );
  } finally {
    await unlink(linkedParent).catch((error) => {
      if (error.code !== "ENOENT") throw error;
    });
    await rm(realParent, { recursive: true, force: true });
    await cleanupFixture(value);
  }
});
