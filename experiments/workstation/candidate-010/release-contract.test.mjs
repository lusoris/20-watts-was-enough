import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import {
  mkdir, mkdtemp, readFile, rm, symlink, writeFile,
} from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import {
  RELEASE_CONTRACT_VERSION,
  createFrozenSeedReleaseContract,
  openFrozenSeedRelease,
} from "./release-contract.mjs";
import { seedListCommitment } from "./seeds/seed-pack.mjs";
import { computeSourceBundle } from "./source-bundle.mjs";

function sha256(value) {
  return createHash("sha256").update(value).digest("hex");
}

function canonical(value) {
  if (value === null || typeof value === "boolean" || typeof value === "string") return JSON.stringify(value);
  if (typeof value === "number") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(canonical).join(",")}]`;
  return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${canonical(value[key])}`).join(",")}}`;
}

function sourceInventoryDigest(files) {
  const digest = createHash("sha256");
  for (const row of files) {
    digest.update(`${Buffer.byteLength(row.path)}:${row.path}:${row.bytes}:${row.sha256}\n`);
  }
  return digest.digest("hex");
}

function rehashRuntime(document) {
  const clone = structuredClone(document);
  delete clone.identity_sha256;
  return { ...clone, identity_sha256: sha256(canonical(clone)) };
}

function rehashDescriptor(document) {
  const clone = structuredClone(document);
  delete clone.descriptor_sha256;
  return { ...clone, descriptor_sha256: sha256(canonical(clone)) };
}

function makeRuntimeIdentity(tag) {
  const body = {
    schema: 1,
    artifact: "candidate-010",
    contract_version: "candidate-010.runtime-identity.v1",
    confirmation_claim_eligible: false,
    limits: { confirmation_claim_eligible: false, toctou_guarantee: false },
    runtime: {
      version: `v-test-${tag}`,
      versions: { node: `test-${tag}` },
      platform: "test",
      arch: "x64",
      exec_path: `C:/fixture/${tag}/node.exe`,
      exec_path_realpath: `C:/fixture/${tag}/node.exe`,
      executable_sha256: sha256(`executable-${tag}`),
      executable_bytes: 1024,
    },
    package_lock: {
      path: "package-lock.json",
      lockfile_version: 3,
      sha256: sha256(`lock-${tag}`),
      bytes: 128,
    },
    external_production_dependencies: [],
    external_production_dependency_names: [],
  };
  return { ...body, identity_sha256: sha256(canonical(body)) };
}

function makeExecutionDescriptor(sourceBundle, runtimeIdentity) {
  const sourceFiles = sourceBundle.files.map((row) => ({ ...row }));
  const sourceInventory = {
    files: sourceFiles,
    file_count: sourceFiles.length,
    total_bytes: sourceFiles.reduce((sum, row) => sum + row.bytes, 0),
    inventory_sha256: sourceInventoryDigest(sourceFiles),
  };
  const dependencies = {
    names: [],
    inventory: {
      files: [],
      files_count: 0,
      bytes: 0,
      inventory_sha256: sha256(canonical([])),
    },
  };
  const body = {
    schema: 1,
    artifact: "candidate-010",
    contract_version: "candidate-010.execution-capsule.v1",
    confirmation_claim_eligible: false,
    layout: {
      immutable_source_role: "source/generated-immutable-capsule",
      dependency_root: "node_modules",
      shared_node_modules: false,
    },
    source: {
      contract_version: "candidate-010-immutable-capsule-v1",
      head_commit: sourceBundle.vcs.source_commit,
      source_paths: sourceFiles.map((row) => row.path),
      git_objects: sourceFiles.map((row) => ({
        path: row.path,
        git_mode: "100644",
        git_object_id: sha256(`git:${row.path}`).slice(0, 40),
      })),
      inventory: sourceInventory,
      inventory_sha256: sourceInventory.inventory_sha256,
    },
    runtime_identity: runtimeIdentity,
    dependencies,
    limits: {
      confirmation_claim_eligible: false,
      execution_authority: "none",
      shared_node_modules_allowed: false,
      malicious_host_toctou_closed: false,
    },
  };
  return { ...body, descriptor_sha256: sha256(canonical(body)) };
}

async function writeJson(file, value) {
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

async function fixture({
  partition = "confirmation",
  seeds = [11, 22],
  sourceTag = "source-a",
  runtimeTag = "runtime-a",
} = {}) {
  const container = await mkdtemp(path.join(os.tmpdir(), "20w-c010-release-v3-"));
  const bindingRoot = path.join(container, "bindings");
  const sourceRoot = path.join(container, "capsule-source");
  await mkdir(bindingRoot);
  await mkdir(sourceRoot);
  const files = {
    sourceBundlePath: "freeze/source-bundle.json",
    executionDescriptorPath: "freeze/execution-descriptor.json",
    runtimeIdentityPath: "freeze/runtime-identity.json",
    configPath: "freeze/config.json",
    designPath: "freeze/design.json",
    backendRegistryPath: "freeze/backend-registry.mjs",
    preregistrationPath: "freeze/preregistration.json",
    commitmentPath: "freeze/seeds.commit.json",
    revealPath: "freeze/seeds.reveal.json",
  };
  const sourceBodies = {
    "source-a.mjs": `export const value = ${JSON.stringify(sourceTag)};\n`,
    "source-b.json": `${JSON.stringify({ schema: 1, sourceTag })}\n`,
  };
  for (const [relative, body] of Object.entries(sourceBodies)) {
    await writeFile(path.join(sourceRoot, relative), body, "utf8");
  }
  const sourceBundle = await computeSourceBundle({
    root: sourceRoot,
    sourceFiles: Object.keys(sourceBodies).sort(),
    vcs: {
      source_commit: sha256(`commit-${sourceTag}`).slice(0, 40),
      worktree_state: "frozen-fixture",
    },
  });
  const runtimeIdentity = makeRuntimeIdentity(runtimeTag);
  const executionDescriptor = makeExecutionDescriptor(sourceBundle, runtimeIdentity);
  await writeJson(path.join(bindingRoot, files.sourceBundlePath), sourceBundle);
  await writeJson(path.join(bindingRoot, files.executionDescriptorPath), executionDescriptor);
  await writeJson(path.join(bindingRoot, files.runtimeIdentityPath), runtimeIdentity);
  await writeJson(path.join(bindingRoot, files.configPath), { profile: "test" });
  await writeJson(path.join(bindingRoot, files.designPath), { scenarios: ["test"] });
  await writeFile(path.join(bindingRoot, files.backendRegistryPath), "export const registry = 'test';\n", "utf8");
  await writeJson(path.join(bindingRoot, files.preregistrationPath), { id: "test-preregistration" });
  const commitment = seedListCommitment(seeds);
  await writeJson(path.join(bindingRoot, files.commitmentPath), {
    schema: 1,
    partition,
    state: "sealed",
    algorithm: "sha256-json-array-v1",
    seed_count: seeds.length,
    commitment,
  });
  await writeJson(path.join(bindingRoot, files.revealPath), {
    schema: 1,
    partition,
    state: "frozen-reveal",
    algorithm: "sha256-json-array-v1",
    commitment,
    seeds,
  });
  const createArguments = {
    bindingRoot,
    sourceRoot,
    releaseVersion: 1,
    partition,
    phase: partition,
    ...files,
  };
  const release = await createFrozenSeedReleaseContract(createArguments);
  const releasePath = path.join(bindingRoot, "freeze", "release.json");
  await writeJson(releasePath, release);
  return {
    container,
    bindingRoot,
    sourceRoot,
    files,
    release,
    releasePath,
    seeds,
    sourceBundle,
    runtimeIdentity,
    executionDescriptor,
    createArguments,
  };
}

async function usingFixture(run, options = {}) {
  const value = await fixture(options);
  try {
    await run(value);
  } finally {
    assert.ok(value.container.startsWith(os.tmpdir()));
    await rm(value.container, { recursive: true, force: true });
  }
}

function openArguments(value, overrides = {}) {
  return {
    bindingRoot: value.bindingRoot,
    sourceRoot: value.sourceRoot,
    releasePath: value.releasePath,
    expectedPartition: value.release.partition,
    phase: value.release.phase,
    disjointWith: [{
      partition: value.release.partition === "confirmation" ? "held-out" : "confirmation",
      seeds: [33, 44],
    }],
    executionDescriptor: value.executionDescriptor,
    runtimeIdentity: value.runtimeIdentity,
    ...overrides,
  };
}

test("v3 confirmation open binds actual source, execution descriptor, and runtime identities", async () => {
  await usingFixture(async (value) => {
    const opened = await openFrozenSeedRelease(openArguments(value));
    assert.equal(value.release.contract_version, RELEASE_CONTRACT_VERSION);
    assert.equal(opened.frozen_release, true);
    assert.equal(opened.source_root_mode, "separate-exact-capsule-root-v1");
    assert.deepEqual(opened.seeds, value.seeds);
    assert.deepEqual(opened.execution_binding, {
      descriptor_sha256: value.executionDescriptor.descriptor_sha256,
      source_inventory_sha256: value.executionDescriptor.source.inventory_sha256,
      dependency_inventory_sha256: value.executionDescriptor.dependencies.inventory.inventory_sha256,
    });
    assert.deepEqual(opened.runtime_binding, {
      identity_sha256: value.runtimeIdentity.identity_sha256,
      executable_sha256: value.runtimeIdentity.runtime.executable_sha256,
      package_lock_sha256: value.runtimeIdentity.package_lock.sha256,
    });
  });
});
test("confirmation refuses legacy single-root development mode", async () => {
  await usingFixture(async (value) => {
    await assert.rejects(createFrozenSeedReleaseContract({
      ...value.createArguments,
      bindingRoot: undefined,
      sourceRoot: undefined,
      root: value.bindingRoot,
    }), /Legacy single-root development mode cannot create a confirmation/);
    await assert.rejects(openFrozenSeedRelease({
      ...openArguments(value),
      bindingRoot: undefined,
      sourceRoot: undefined,
      root: value.bindingRoot,
    }), /Legacy single-root development mode cannot open a confirmation/);
  });
});

test("bound descriptor and runtime bytes are independently substitution-sensitive", async () => {
  await usingFixture(async (value) => {
    await writeFile(
      path.join(value.bindingRoot, value.files.executionDescriptorPath),
      `${JSON.stringify(value.executionDescriptor)} `,
      "utf8",
    );
    await assert.rejects(openFrozenSeedRelease(openArguments(value)), /Bound execution_descriptor file hash mismatch/);
  });
  await usingFixture(async (value) => {
    const file = path.join(value.bindingRoot, value.files.runtimeIdentityPath);
    const body = await readFile(file);
    body[body.length - 2] ^= 1;
    await writeFile(file, body);
    await assert.rejects(openFrozenSeedRelease(openArguments(value)), /Bound runtime_identity file hash mismatch/);
  });
});

test("validly rehashed descriptor cannot disagree with bound source bundle", async () => {
  await usingFixture(async (value) => {
    const changed = structuredClone(value.executionDescriptor);
    changed.source.head_commit = "f".repeat(40);
    await writeJson(path.join(value.bindingRoot, value.files.executionDescriptorPath), rehashDescriptor(changed));
    await assert.rejects(
      createFrozenSeedReleaseContract(value.createArguments),
      /do not describe one release identity/,
    );
  });
});

test("validly rehashed runtime cannot be mixed with descriptor runtime binding", async () => {
  await usingFixture(async (value) => {
    const changed = structuredClone(value.runtimeIdentity);
    changed.package_lock.sha256 = sha256("different-lock");
    await writeJson(path.join(value.bindingRoot, value.files.runtimeIdentityPath), rehashRuntime(changed));
    await assert.rejects(
      createFrozenSeedReleaseContract(value.createArguments),
      /do not describe one release identity/,
    );
  });
});

test("current descriptor and runtime objects must exactly match bound artifacts", async () => {
  await usingFixture(async (value) => {
    const changedDescriptor = structuredClone(value.executionDescriptor);
    changedDescriptor.layout.dependency_root = "alternate-node_modules";
    await assert.rejects(openFrozenSeedRelease(openArguments(value, {
      executionDescriptor: rehashDescriptor(changedDescriptor),
    })), /Current verified execution descriptor or runtime identity differs/);

    const changedRuntime = structuredClone(value.runtimeIdentity);
    changedRuntime.runtime.executable_sha256 = sha256("alternate-executable");
    await assert.rejects(openFrozenSeedRelease(openArguments(value, {
      runtimeIdentity: rehashRuntime(changedRuntime),
    })), /Current verified execution descriptor or runtime identity differs/);
  });
});

test("cross-release execution/runtime identity mix is refused", async () => {
  const first = await fixture({ sourceTag: "same-source", runtimeTag: "runtime-one" });
  const second = await fixture({ sourceTag: "same-source", runtimeTag: "runtime-two" });
  try {
    await assert.rejects(openFrozenSeedRelease(openArguments(first, {
      executionDescriptor: second.executionDescriptor,
      runtimeIdentity: second.runtimeIdentity,
    })), /Current verified execution descriptor or runtime identity differs/);
  } finally {
    await rm(first.container, { recursive: true, force: true });
    await rm(second.container, { recursive: true, force: true });
  }
});

test("source bytes, ordinary bindings, and seed disjointness remain fail-closed", async () => {
  await usingFixture(async (value) => {
    await writeFile(path.join(value.sourceRoot, "source-a.mjs"), "export const substituted = true;\n", "utf8");
    await assert.rejects(openFrozenSeedRelease(openArguments(value)), /bytes or hashes/);
  });
  await usingFixture(async (value) => {
    await writeJson(path.join(value.bindingRoot, value.files.configPath), { profile: "tampered" });
    await assert.rejects(openFrozenSeedRelease(openArguments(value)), /Bound config file hash mismatch/);
  });
  await usingFixture(async (value) => {
    await assert.rejects(openFrozenSeedRelease(openArguments(value, {
      disjointWith: [{ partition: "held-out", seeds: [22, 99] }],
    })), /Seed 22 occurs in both confirmation and held-out/);
  });
});

test("linked artifact paths and source inventory additions are refused", async (context) => {
  await usingFixture(async (value) => {
    await writeFile(path.join(value.sourceRoot, "unbound.mjs"), "export {};\n", "utf8");
    await assert.rejects(openFrozenSeedRelease(openArguments(value)), /inventory does not exactly match/);
  });
  await usingFixture(async (value) => {
    const target = path.join(value.container, "external-runtime.json");
    const bound = path.join(value.bindingRoot, value.files.runtimeIdentityPath);
    await writeFile(target, await readFile(bound));
    await rm(bound);
    try {
      await symlink(target, bound, "file");
    } catch (error) {
      if (["EPERM", "EACCES", "ENOSYS", "UNKNOWN"].includes(error?.code)) {
        context.skip(`symlink creation unavailable: ${error.code}`);
        return;
      }
      throw error;
    }
    await assert.rejects(openFrozenSeedRelease(openArguments(value)), /symbolic-link|reparse-point/);
  });
});

test("missing actual objects and a correctly rehashed v2 release cannot open v3 confirmation", async () => {
  await usingFixture(async (value) => {
    await assert.rejects(openFrozenSeedRelease(openArguments(value, {
      executionDescriptor: undefined,
    })), /invalid exact shape|self-digest/);
    await assert.rejects(openFrozenSeedRelease(openArguments(value, {
      runtimeIdentity: undefined,
    })), /invalid exact shape|self-digest/);

    const oldBody = structuredClone(value.release);
    delete oldBody.release_sha256;
    oldBody.contract_version = "candidate-010.frozen-seed-release.v2";
    const oldRelease = { ...oldBody, release_sha256: sha256(canonical(oldBody)) };
    await writeJson(value.releasePath, oldRelease);
    await assert.rejects(
      openFrozenSeedRelease(openArguments(value)),
      /Invalid or corrupted frozen release contract/,
    );
  });
});
