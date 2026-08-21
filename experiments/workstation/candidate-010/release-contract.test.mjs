import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import {
  createFrozenSeedReleaseContract,
  openFrozenSeedRelease,
} from "./release-contract.mjs";
import { seedListCommitment } from "./seeds/seed-pack.mjs";
import { computeSourceBundle } from "./source-bundle.mjs";

const SOURCE_COMMIT = "a".repeat(40);

function sha256(value) {
  return createHash("sha256").update(value).digest("hex");
}

async function writeJson(file, value) {
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

async function fixture(partition = "confirmation", seeds = [11, 22]) {
  const root = await mkdtemp(path.join(os.tmpdir(), "20w-c010-release-"));
  const files = {
    sourceBundlePath: "freeze/source-bundle.json",
    configPath: "freeze/config.json",
    designPath: "freeze/design.json",
    backendRegistryPath: "freeze/backend-registry.mjs",
    preregistrationPath: "freeze/preregistration.json",
    commitmentPath: "freeze/seeds.commit.json",
    revealPath: "freeze/seeds.reveal.json",
  };
  await writeFile(path.join(root, "source-a.mjs"), "export const value = 1;\n", "utf8");
  await writeFile(path.join(root, "source-b.json"), "{\"schema\":1}\n", "utf8");
  const sourceBundle = await computeSourceBundle({
    root,
    sourceFiles: ["source-a.mjs", "source-b.json"],
    vcs: { source_commit: SOURCE_COMMIT, worktree_state: "test-fixture" },
  });
  await writeJson(path.join(root, files.sourceBundlePath), sourceBundle);
  await writeJson(path.join(root, files.configPath), { profile: "test" });
  await writeJson(path.join(root, files.designPath), { scenarios: ["test"] });
  await writeFile(path.join(root, files.backendRegistryPath), "export const registry = 'test';\n", "utf8");
  await writeJson(path.join(root, files.preregistrationPath), { id: "test-preregistration" });
  const commitment = seedListCommitment(seeds);
  await writeJson(path.join(root, files.commitmentPath), {
    schema: 1,
    partition,
    state: "sealed",
    algorithm: "sha256-json-array-v1",
    seed_count: seeds.length,
    commitment,
  });
  await writeJson(path.join(root, files.revealPath), {
    schema: 1,
    partition,
    state: "frozen-reveal",
    algorithm: "sha256-json-array-v1",
    commitment,
    seeds,
  });
  const release = await createFrozenSeedReleaseContract({
    root,
    releaseVersion: 1,
    partition,
    phase: partition,
    ...files,
  });
  const releasePath = path.join(root, "freeze", "release.json");
  await writeJson(releasePath, release);
  return { root, files, release, releasePath, seeds };
}

async function usingFixture(run, ...args) {
  const value = await fixture(...args);
  try {
    await run(value);
  } finally {
    assert.ok(value.root.startsWith(os.tmpdir()));
    await rm(value.root, { recursive: true, force: true });
  }
}

test("opening a fully bound release is the only operation that derives frozen_release", async () => {
  await usingFixture(async ({ root, release, releasePath, seeds }) => {
    assert.equal("frozen_release" in release, false);
    const opened = await openFrozenSeedRelease({
      root,
      releasePath,
      expectedPartition: "confirmation",
      phase: "confirmation",
      disjointWith: [{ partition: "held-out", seeds: [33, 44] }],
    });
    assert.equal(opened.frozen_release, true);
    assert.equal(opened.partition, "confirmation");
    assert.equal(opened.phase, "confirmation");
    assert.equal(opened.release_version, 1);
    assert.equal(opened.source_identity.source_commit, SOURCE_COMMIT);
    assert.equal(opened.seed_pack.seed_count, seeds.length);
    assert.deepEqual(opened.seeds, seeds);
  });
});

test("partition and phase must match the release and seed commitment exactly", async () => {
  await usingFixture(async ({ root, releasePath }) => {
    await assert.rejects(openFrozenSeedRelease({
      root,
      releasePath,
      expectedPartition: "held-out",
      phase: "held-out",
      disjointWith: [],
    }), /exact partition and phase confirmation/);
    await assert.rejects(openFrozenSeedRelease({
      root,
      releasePath,
      expectedPartition: "confirmation",
      phase: "held-out",
      disjointWith: [],
    }), /exact partition and phase confirmation/);
  });
});

test("every bound file hash is verified before release opens", async () => {
  await usingFixture(async ({ root, files, releasePath }) => {
    await writeFile(path.join(root, files.configPath), "{\"profile\":\"tampered\"}\n", "utf8");
    await assert.rejects(openFrozenSeedRelease({
      root,
      releasePath,
      expectedPartition: "confirmation",
      phase: "confirmation",
      disjointWith: [],
    }), /Bound config file hash mismatch/);
  });
});

test("the full executable source bundle is recomputed, not merely trusted as a manifest", async () => {
  await usingFixture(async ({ root, releasePath }) => {
    await writeFile(path.join(root, "source-a.mjs"), "export const value = 2;\n", "utf8");
    await assert.rejects(openFrozenSeedRelease({
      root,
      releasePath,
      expectedPartition: "confirmation",
      phase: "confirmation",
      disjointWith: [],
    }), /Full source bundle does not match/);
  });
});

test("seed overlap is rejected through the shared disjoint-pack validator", async () => {
  await usingFixture(async ({ root, releasePath }) => {
    await assert.rejects(openFrozenSeedRelease({
      root,
      releasePath,
      expectedPartition: "confirmation",
      phase: "confirmation",
      disjointWith: [{ partition: "held-out", seeds: [22, 99] }],
    }), /Seed 22 occurs in both confirmation and held-out/);
    await assert.rejects(openFrozenSeedRelease({
      root,
      releasePath,
      expectedPartition: "confirmation",
      phase: "confirmation",
    }), /explicit disjointWith/);
  });
});

test("reveal validation and both seed-file hashes fail closed", async () => {
  await usingFixture(async ({ root, files, releasePath }) => {
    const commitmentFile = path.join(root, files.commitmentPath);
    const commitment = JSON.parse(await readFile(commitmentFile, "utf8"));
    commitment.note = "post-freeze mutation";
    await writeJson(commitmentFile, commitment);
    await assert.rejects(openFrozenSeedRelease({
      root,
      releasePath,
      expectedPartition: "confirmation",
      phase: "confirmation",
      disjointWith: [],
    }), /Bound commitment file hash mismatch/);
  });
  await usingFixture(async ({ root, files, releasePath }) => {
    const revealFile = path.join(root, files.revealPath);
    const reveal = JSON.parse(await readFile(revealFile, "utf8"));
    reveal.seeds = [11, 23];
    await writeJson(revealFile, reveal);
    await assert.rejects(openFrozenSeedRelease({
      root,
      releasePath,
      expectedPartition: "confirmation",
      phase: "confirmation",
      disjointWith: [],
    }), /Bound reveal file hash mismatch/);
  });
  const root = await mkdtemp(path.join(os.tmpdir(), "20w-c010-release-invalid-"));
  try {
    await writeFile(path.join(root, "source.mjs"), "export {};\n", "utf8");
    const bundle = await computeSourceBundle({
      root,
      sourceFiles: ["source.mjs"],
      vcs: { source_commit: SOURCE_COMMIT },
    });
    for (const [file, value] of [
      ["source.json", bundle],
      ["config.json", {}],
      ["design.json", {}],
      ["prereg.json", {}],
    ]) await writeJson(path.join(root, file), value);
    await writeFile(path.join(root, "registry.mjs"), "export {};\n", "utf8");
    const commitment = seedListCommitment([7]);
    await writeJson(path.join(root, "commit.json"), {
      schema: 1, partition: "confirmation", state: "sealed", algorithm: "sha256-json-array-v1",
      seed_count: 1, commitment,
    });
    await writeJson(path.join(root, "reveal.json"), {
      schema: 1, partition: "confirmation", state: "frozen-reveal", algorithm: "sha256-json-array-v1",
      commitment, seeds: [8],
    });
    await assert.rejects(createFrozenSeedReleaseContract({
      root,
      releaseVersion: 1,
      partition: "confirmation",
      phase: "confirmation",
      sourceBundlePath: "source.json",
      configPath: "config.json",
      designPath: "design.json",
      backendRegistryPath: "registry.mjs",
      preregistrationPath: "prereg.json",
      commitmentPath: "commit.json",
      revealPath: "reveal.json",
    }), /does not satisfy its sealed commitment/);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("release version and self-digest are enforced", async () => {
  await usingFixture(async ({ root, release, releasePath }) => {
    const changed = { ...release, release_version: 2 };
    await writeJson(releasePath, changed);
    assert.notEqual(changed.release_sha256, sha256(JSON.stringify(changed)));
    await assert.rejects(openFrozenSeedRelease({
      root,
      releasePath,
      expectedPartition: "confirmation",
      phase: "confirmation",
      disjointWith: [],
    }), /Invalid or corrupted frozen release contract/);
  });
});
