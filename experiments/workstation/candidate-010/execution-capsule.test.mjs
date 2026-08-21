import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import {
  access,
  chmod,
  mkdir,
  mkdtemp,
  readFile,
  readdir,
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
  EXECUTION_CAPSULE_LIMITS,
  ExecutionCapsuleError,
  buildExecutionCapsule,
  destroyExecutionCapsule,
  verifyExecutionCapsule,
} from "./execution-capsule.mjs";
import { captureRuntimeIdentity } from "./runtime-identity.mjs";

const executeFile = promisify(execFile);
const sourcePaths = Object.freeze([
  "candidate/production.mjs",
  "candidate/production.test.mjs",
  "package-lock.json",
  "package.json",
]);

async function git(repositoryRoot, ...args) {
  return executeFile("git", ["-C", repositoryRoot, ...args], {
    encoding: "utf8",
    windowsHide: true,
  });
}

async function writeJson(file, value) {
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

async function fixture() {
  const testRoot = await mkdtemp(path.join(os.tmpdir(), "20w execution capsule fixture ü-"));
  const repositoryRoot = path.join(testRoot, "repository with spaces Ω");
  const firstParent = path.join(testRoot, "outer parent one ü");
  const secondParent = path.join(testRoot, "outer parent two 漢字");
  const candidateRoot = path.join(repositoryRoot, "candidate");
  const packageRoot = path.join(repositoryRoot, "node_modules", "es-module-lexer");
  await mkdir(candidateRoot, { recursive: true });
  await mkdir(packageRoot, { recursive: true });
  await mkdir(firstParent);
  await mkdir(secondParent);
  await writeFile(
    path.join(candidateRoot, "production.mjs"),
    "import { parse } from \"es-module-lexer\";\nexport const parseModule = parse;\n",
    "utf8",
  );
  await writeFile(
    path.join(candidateRoot, "production.test.mjs"),
    "import './production.mjs';\n",
    "utf8",
  );
  await writeJson(path.join(repositoryRoot, "package.json"), {
    name: "execution-capsule-fixture",
    private: true,
    dependencies: { "es-module-lexer": "2.1.0" },
  });
  await writeJson(path.join(repositoryRoot, "package-lock.json"), {
    name: "execution-capsule-fixture",
    lockfileVersion: 3,
    packages: {
      "": { dependencies: { "es-module-lexer": "2.1.0" } },
      "node_modules/es-module-lexer": { version: "2.1.0" },
    },
  });
  await writeJson(path.join(packageRoot, "package.json"), {
    name: "es-module-lexer",
    version: "2.1.0",
    type: "module",
  });
  await writeFile(path.join(packageRoot, "index.js"), "export const fixture = 'exact bytes';\n", "utf8");
  await mkdir(path.join(packageRoot, "nested"));
  await writeFile(path.join(packageRoot, "nested", "unicode-ü.txt"), "dependency payload\n", "utf8");
  await git(repositoryRoot, "init", "--quiet");
  await git(repositoryRoot, "config", "user.name", "Execution Capsule Test");
  await git(repositoryRoot, "config", "user.email", "execution-capsule@example.invalid");
  await git(repositoryRoot, "config", "commit.gpgsign", "false");
  await git(repositoryRoot, "config", "core.autocrlf", "false");
  await git(repositoryRoot, "add", "--", ...sourcePaths);
  await git(repositoryRoot, "commit", "--quiet", "-m", "fixture");
  const runtimeIdentity = await captureRuntimeIdentity({ repositoryRoot, candidateRoot });
  return {
    testRoot,
    repositoryRoot,
    candidateRoot,
    packageRoot,
    firstParent,
    secondParent,
    runtimeIdentity,
  };
}

async function cleanupFixture(value, capsules = []) {
  for (const capsule of capsules) {
    if (!capsule) continue;
    await destroyExecutionCapsule(capsule).catch(() => {});
  }
  assert.ok(value.testRoot.startsWith(os.tmpdir()));
  await rm(value.testRoot, { recursive: true, force: true });
}

async function build(value, executionParent = value.firstParent, sourceCommit = null) {
  return buildExecutionCapsule({
    repositoryRoot: value.repositoryRoot,
    executionParent,
    runtimeIdentity: value.runtimeIdentity,
    sourcePaths,
    sourceCommit,
    candidateDirectory: "candidate",
  });
}

async function makeTreeWritable(root) {
  async function visit(directory) {
    await chmod(directory, 0o700);
    const entries = await readdir(directory, { withFileTypes: true });
    for (const entry of entries) {
      const absolute = path.join(directory, entry.name);
      if (entry.isDirectory()) await visit(absolute);
      else await chmod(absolute, 0o600);
    }
  }
  await visit(root);
}

async function createLinkOrSkip(context, target, link, type = "junction") {
  try {
    await symlink(target, link, type);
    return true;
  } catch (error) {
    if (["EPERM", "EACCES", "ENOSYS", "UNKNOWN"].includes(error?.code)) {
      context.skip(`symlink/reparse creation is unavailable: ${error.code}`);
      return false;
    }
    throw error;
  }
}

test("execution capsule materializes only bound dependency bytes and verifies stable pre/post inventories", async () => {
  const value = await fixture();
  let capsule;
  try {
    capsule = await build(value);
    const verification = await verifyExecutionCapsule(capsule);
    assert.equal(verification.valid, true);
    assert.equal(verification.execution_authority, "none");
    assert.equal(verification.confirmation_claim_eligible, false);
    assert.equal(capsule.descriptor.limits, EXECUTION_CAPSULE_LIMITS);
    assert.equal(capsule.descriptor.layout.shared_node_modules, false);
    assert.deepEqual(
      capsule.descriptor.dependencies.inventory.files,
      value.runtimeIdentity.external_production_dependencies.flatMap((dependency) => (
        dependency.files.map((row) => ({
          path: `${dependency.package_root}/${row.path}`,
          bytes: row.bytes,
          sha256: row.sha256,
        }))
      )).sort((left, right) => left.path.localeCompare(right.path)),
    );
    const stableJson = JSON.stringify(capsule.descriptor);
    assert.equal(stableJson.includes(capsule.local.outer_root), false);
    assert.equal(stableJson.includes(capsule.local.outer_parent), false);
    assert.equal(stableJson.includes(value.repositoryRoot), false);
    assert.deepEqual(await verifyExecutionCapsule(capsule), verification);
  } finally {
    await cleanupFixture(value, [capsule]);
  }
});

test("execution capsule propagates an explicit historical source commit", async () => {
  const value = await fixture();
  let capsule;
  try {
    const commitA = (await git(value.repositoryRoot, "rev-parse", "HEAD")).stdout.trim();
    await writeFile(path.join(value.repositoryRoot, "README.md"), "later metadata\n");
    await git(value.repositoryRoot, "add", "README.md");
    await git(value.repositoryRoot, "commit", "--quiet", "-m", "metadata B");
    capsule = await build(value, value.firstParent, commitA);
    assert.equal(capsule.descriptor.source.head_commit, commitA);
    assert.equal(capsule.local.source_capsule.head_commit, commitA);
    assert.equal((await verifyExecutionCapsule(capsule)).valid, true);
  } finally {
    await cleanupFixture(value, [capsule]);
  }
});

test("stable descriptor is identical across outer roots containing spaces and Unicode", async () => {
  const value = await fixture();
  let first;
  let second;
  try {
    first = await build(value, value.firstParent);
    second = await build(value, value.secondParent);
    assert.notEqual(first.local.outer_root, second.local.outer_root);
    assert.deepEqual(first.descriptor, second.descriptor);
    assert.equal(first.descriptor.descriptor_sha256, second.descriptor.descriptor_sha256);
  } finally {
    await cleanupFixture(value, [first, second]);
  }
});

test("one-byte capsule-local dependency mutation is detected while repository dependency stays unchanged", async () => {
  const value = await fixture();
  let capsule;
  try {
    capsule = await build(value);
    const target = path.join(capsule.local.dependency_root, "es-module-lexer", "index.js");
    const repositoryBefore = await readFile(path.join(value.packageRoot, "index.js"));
    await chmod(target, 0o600);
    const body = await readFile(target);
    body[0] ^= 1;
    await writeFile(target, body);
    await assert.rejects(
      verifyExecutionCapsule(capsule),
      (error) => (
        error instanceof ExecutionCapsuleError
        && error.code === "CANDIDATE_010_EXECUTION_CAPSULE_DEPENDENCY_MUTATION"
      ),
    );
    assert.deepEqual(await readFile(path.join(value.packageRoot, "index.js")), repositoryBefore);
  } finally {
    await cleanupFixture(value, [capsule]);
  }
});

test("verification rejects a shared node_modules junction and cleanup refuses linked material", async (context) => {
  const value = await fixture();
  let capsule;
  let linked = false;
  try {
    capsule = await build(value);
    await makeTreeWritable(capsule.local.dependency_root);
    await rm(capsule.local.dependency_root, { recursive: true });
    linked = await createLinkOrSkip(
      context,
      path.join(value.repositoryRoot, "node_modules"),
      capsule.local.dependency_root,
    );
    if (!linked) return;
    await assert.rejects(verifyExecutionCapsule(capsule), /symlink|reparse/i);
    await assert.rejects(destroyExecutionCapsule(capsule), /Cleanup refuses.*symlink|reparse/i);
    await unlink(capsule.local.dependency_root);
    linked = false;
    assert.equal(await destroyExecutionCapsule(capsule), true);
    await assert.rejects(access(capsule.local.outer_root), (error) => error.code === "ENOENT");
    capsule = null;
  } finally {
    if (linked) await unlink(capsule.local.dependency_root).catch(() => {});
    await cleanupFixture(value, [capsule]);
  }
});

test("path escape, stable descriptor tamper, and false ownership handle are refused", async () => {
  const value = await fixture();
  let capsule;
  try {
    capsule = await build(value);
    const escaped = {
      descriptor: capsule.descriptor,
      local: { ...capsule.local, dependency_root: value.packageRoot },
    };
    await assert.rejects(verifyExecutionCapsule(escaped), /layout handle|declared root|owned outer/i);

    const tampered = {
      descriptor: {
        ...capsule.descriptor,
        layout: { ...capsule.descriptor.layout, shared_node_modules: true },
      },
      local: capsule.local,
    };
    await assert.rejects(verifyExecutionCapsule(tampered), /stable descriptor|digest/i);

    const falseOwner = {
      descriptor: capsule.descriptor,
      local: { ...capsule.local, ownership_token: "0".repeat(64) },
    };
    await assert.rejects(destroyExecutionCapsule(falseOwner), /Ownership marker/i);

    const outsideCleanup = {
      descriptor: capsule.descriptor,
      local: {
        ...capsule.local,
        source_root: value.repositoryRoot,
        source_capsule: {
          ...capsule.local.source_capsule,
          capsule_parent: value.firstParent,
          capsule_root: value.repositoryRoot,
        },
      },
    };
    await assert.rejects(destroyExecutionCapsule(outsideCleanup), /layout handle|declared root|owned outer/i);
    await access(value.repositoryRoot);
    assert.equal((await verifyExecutionCapsule(capsule)).valid, true);
  } finally {
    await cleanupFixture(value, [capsule]);
  }
});

test("repository dependency mutation after construction invalidates pre/post runtime binding", async () => {
  const value = await fixture();
  let capsule;
  try {
    capsule = await build(value);
    await writeFile(path.join(value.packageRoot, "index.js"), "export const fixture = 'changed after build';\n");
    await assert.rejects(verifyExecutionCapsule(capsule), /Runtime identity differs/);
  } finally {
    await cleanupFixture(value, [capsule]);
  }
});
