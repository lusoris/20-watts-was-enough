import { createHash } from "node:crypto";
import { execFile } from "node:child_process";
import {
  chmod,
  lstat,
  mkdir,
  mkdtemp,
  readdir,
  realpath,
  rm,
  writeFile,
} from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { promisify } from "node:util";
import { readStableOpenedFile } from "./opened-file.mjs";
import { discoverCandidate010SourceFiles } from "./source-bundle.mjs";

const executeFile = promisify(execFile);
const INVENTORY_READ_CONCURRENCY = 8;
const CAPSULE_PREFIX = "candidate-010-capsule-";

export const IMMUTABLE_CAPSULE_VERSION = "candidate-010-immutable-capsule-v1";
export const IMMUTABLE_CAPSULE_LIMITS = Object.freeze({
  execution_authority: "none",
  dependencies_included: false,
  malicious_host_immutability: false,
  source_execution_toctou_closed: false,
  statement: "This capsule freezes committed repository bytes only; it does not execute Candidate code or establish a malicious-host boundary.",
});

function refuse(reason) {
  throw new Error(`Refusing immutable capsule: ${reason}`);
}

function sha256(body) {
  return createHash("sha256").update(body).digest("hex");
}

function canonical(value) {
  if (value === null || typeof value === "boolean" || typeof value === "string") {
    return JSON.stringify(value);
  }
  if (typeof value === "number" && Number.isFinite(value)) return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(canonical).join(",")}]`;
  if (value && typeof value === "object") {
    return `{${Object.keys(value).sort().map((key) => (
      `${JSON.stringify(key)}:${canonical(value[key])}`
    )).join(",")}}`;
  }
  refuse(`inventory contains a non-canonical ${typeof value} value`);
}

function structurallyEqual(left, right) {
  return canonical(left) === canonical(right);
}

function isInside(root, target) {
  const relative = path.relative(root, target);
  return relative === "" || (!relative.startsWith("..") && !path.isAbsolute(relative));
}

function normalizedRelativePath(value) {
  if (
    typeof value !== "string"
    || value.length === 0
    || value.includes("\0")
    || value.includes(":")
    || path.isAbsolute(value)
  ) {
    refuse(`invalid repository-relative source path ${String(value)}`);
  }
  const normalized = value.replaceAll("\\", "/");
  if (
    normalized.startsWith("/")
    || normalized.startsWith("../")
    || normalized.includes("/../")
    || normalized === "."
    || normalized.endsWith("/")
  ) {
    refuse(`source path escapes or does not name a file: ${value}`);
  }
  return normalized;
}

function normalizedSourcePaths(values) {
  if (!Array.isArray(values) || values.length === 0) refuse("a non-empty source path list is required");
  const normalized = values.map(normalizedRelativePath).sort();
  if (new Set(normalized).size !== normalized.length) refuse("source paths must be unique");
  return normalized;
}

async function git(repositoryRoot, args, { buffer = false } = {}) {
  try {
    const { stdout } = await executeFile("git", ["-C", repositoryRoot, ...args], {
      encoding: buffer ? "buffer" : "utf8",
      maxBuffer: 256 * 1024 * 1024,
      windowsHide: true,
    });
    return stdout;
  } catch (error) {
    refuse(`git ${args[0]} failed: ${error.stderr?.toString().trim() || error.message}`);
  }
}

async function regularContainedDirectory(value, label) {
  const absolute = path.resolve(value);
  const information = await lstat(absolute).catch((error) => refuse(`${label} is unavailable: ${error.message}`));
  if (information.isSymbolicLink() || !information.isDirectory()) {
    refuse(`${label} must be a real directory, not a symbolic link or reparse point`);
  }
  return realpath(absolute);
}

async function assertRegularWorktreeSource(repositoryRoot, relative) {
  const absolute = path.resolve(repositoryRoot, ...relative.split("/"));
  if (!isInside(repositoryRoot, absolute)) refuse(`source path escapes repository: ${relative}`);
  let current = repositoryRoot;
  for (const component of path.relative(repositoryRoot, absolute).split(path.sep).filter(Boolean)) {
    current = path.join(current, component);
    const information = await lstat(current).catch((error) => (
      refuse(`source path is unavailable ${relative}: ${error.message}`)
    ));
    if (information.isSymbolicLink()) refuse(`source path traverses a symbolic link or reparse point: ${relative}`);
  }
  const [information, resolved] = await Promise.all([lstat(absolute), realpath(absolute)]);
  if (!information.isFile()) refuse(`source path is not a regular file: ${relative}`);
  if (!isInside(repositoryRoot, resolved)) refuse(`source path resolves outside repository: ${relative}`);
}

async function exactHead(repositoryRoot) {
  const head = (await git(repositoryRoot, ["rev-parse", "--verify", "HEAD^{commit}"])).trim();
  if (!/^[0-9a-f]{40,64}$/.test(head)) refuse("HEAD is not an exact commit object ID");
  return head;
}

async function exactSourceCommit(repositoryRoot, sourceCommit) {
  if (sourceCommit === null || sourceCommit === undefined) return exactHead(repositoryRoot);
  if (typeof sourceCommit !== "string" || !/^(?:[0-9a-f]{40}|[0-9a-f]{64})$/.test(sourceCommit)) {
    refuse("sourceCommit must be a full exact Git commit object ID");
  }
  const resolved = (await git(repositoryRoot, [
    "rev-parse", "--verify", `${sourceCommit}^{commit}`,
  ])).trim();
  if (resolved !== sourceCommit) refuse("sourceCommit does not resolve to its exact commit object");
  const type = (await git(repositoryRoot, ["cat-file", "-t", sourceCommit])).trim();
  if (type !== "commit") refuse("sourceCommit is not a commit object");
  return sourceCommit;
}

async function assertCleanSourceScope(repositoryRoot, sourcePaths, candidateDirectory) {
  const status = await git(repositoryRoot, [
    "status",
    "--porcelain=v1",
    "-z",
    "--untracked-files=all",
    "--",
    ...sourcePaths,
  ], { buffer: true });
  if (status.length > 0) refuse("Candidate/control source has tracked, staged, or untracked changes");

  const untracked = await git(repositoryRoot, [
    "ls-files",
    "--others",
    "-z",
    "--",
    candidateDirectory,
  ], { buffer: true });
  const untrackedProduction = untracked.toString("utf8").split("\0").filter(Boolean)
    .filter((file) => file.endsWith(".mjs") || file.endsWith(".test.mjs"));
  if (untrackedProduction.length > 0) {
    refuse(`untracked Candidate production/test files exist: ${untrackedProduction.sort().join(",")}`);
  }
}

async function committedBlob(repositoryRoot, headCommit, relative) {
  const treeLine = await git(repositoryRoot, ["ls-tree", "-z", headCommit, "--", relative], { buffer: true });
  const entries = treeLine.toString("utf8").split("\0").filter(Boolean);
  if (entries.length !== 1) refuse(`source path is not exactly one committed HEAD entry: ${relative}`);
  const match = /^(\d{6}) (\w+) ([0-9a-f]{40,64})\t([\s\S]+)$/.exec(entries[0]);
  if (!match || match[2] !== "blob" || !new Set(["100644", "100755"]).has(match[1]) || match[4] !== relative) {
    refuse(`HEAD source is not a regular committed blob: ${relative}`);
  }
  const body = await git(repositoryRoot, ["cat-file", "blob", `${headCommit}:${relative}`], { buffer: true });
  return { body, git_object_id: match[3], git_mode: match[1] };
}

async function mapBounded(values, limit, callback) {
  const results = new Array(values.length);
  let next = 0;
  const worker = async () => {
    while (next < values.length) {
      const index = next;
      next += 1;
      results[index] = await callback(values[index]);
    }
  };
  await Promise.all(Array.from(
    { length: Math.min(limit, values.length) },
    () => worker(),
  ));
  return results;
}

async function inventory(capsuleRoot) {
  const rootReal = await realpath(capsuleRoot);
  const files = [];
  async function visit(directory, prefix = "") {
    const entries = await readdir(directory, { withFileTypes: true });
    entries.sort((left, right) => left.name.localeCompare(right.name));
    for (const entry of entries) {
      const relative = prefix ? `${prefix}/${entry.name}` : entry.name;
      const absolute = path.join(directory, entry.name);
      if (entry.isSymbolicLink()) refuse(`capsule contains a symbolic link or reparse point: ${relative}`);
      if (entry.isDirectory()) {
        const resolved = await realpath(absolute);
        if (!isInside(rootReal, resolved)) refuse(`capsule directory resolves outside root: ${relative}`);
        await visit(absolute, relative);
      } else if (entry.isFile()) {
        files.push(Object.freeze({ absolute, relative }));
      } else {
        refuse(`capsule contains an unsupported filesystem entry: ${relative}`);
      }
    }
  }
  await visit(rootReal);
  files.sort((left, right) => left.relative.localeCompare(right.relative));
  const rows = await mapBounded(files, INVENTORY_READ_CONCURRENCY, async ({ absolute, relative }) => {
    const body = await readStableOpenedFile(absolute, {
      label: `immutable capsule file ${relative}`,
      containedBy: rootReal,
    });
    return Object.freeze({ path: relative, bytes: body.length, sha256: sha256(body) });
  });
  const aggregate = createHash("sha256");
  for (const row of rows) {
    aggregate.update(`${Buffer.byteLength(row.path)}:${row.path}:${row.bytes}:${row.sha256}\n`);
  }
  return Object.freeze({
    files: Object.freeze(rows),
    file_count: rows.length,
    total_bytes: rows.reduce((sum, row) => sum + row.bytes, 0),
    inventory_sha256: aggregate.digest("hex"),
  });
}

async function makeReadOnly(capsuleRoot) {
  const failures = [];
  const directories = [];
  async function visit(directory) {
    directories.push(directory);
    const entries = await readdir(directory, { withFileTypes: true });
    for (const entry of entries) {
      const absolute = path.join(directory, entry.name);
      if (entry.isSymbolicLink()) refuse("cannot seal a capsule containing symbolic links or reparse points");
      if (entry.isDirectory()) await visit(absolute);
      else if (entry.isFile()) {
        await chmod(absolute, 0o444).catch((error) => failures.push(`${absolute}:${error.code ?? error.message}`));
      } else refuse("cannot seal a capsule containing unsupported filesystem entries");
    }
  }
  await visit(capsuleRoot);
  directories.sort((left, right) => right.length - left.length);
  for (const directory of directories) {
    await chmod(directory, 0o555).catch((error) => failures.push(`${directory}:${error.code ?? error.message}`));
  }
  return Object.freeze({
    requested: true,
    practical_only: true,
    all_requests_succeeded: failures.length === 0,
    failures: Object.freeze(failures),
  });
}

async function makeWritableForRemoval(capsuleRoot) {
  const directories = [];
  async function visit(directory) {
    directories.push(directory);
    const entries = await readdir(directory, { withFileTypes: true });
    for (const entry of entries) {
      const absolute = path.join(directory, entry.name);
      if (entry.isSymbolicLink()) refuse("destroy refuses a capsule containing symbolic links or reparse points");
      if (entry.isDirectory()) await visit(absolute);
      else if (entry.isFile()) await chmod(absolute, 0o600);
      else refuse("destroy refuses unsupported capsule entries");
    }
  }
  await chmod(capsuleRoot, 0o700);
  await visit(capsuleRoot);
  for (const directory of directories) await chmod(directory, 0o700);
}

function validateDescriptor(descriptor) {
  if (
    descriptor?.schema !== 1
    || descriptor.capsule_version !== IMMUTABLE_CAPSULE_VERSION
    || typeof descriptor.capsule_root !== "string"
    || typeof descriptor.capsule_parent !== "string"
    || !Array.isArray(descriptor.source_paths)
    || descriptor.limits?.execution_authority !== "none"
  ) refuse("invalid capsule descriptor");
}

export async function buildImmutableExecutionCapsule({
  repositoryRoot = process.cwd(),
  capsuleParent = os.tmpdir(),
  sourcePaths = null,
  sourceCommit = null,
  candidateDirectory = "experiments/workstation/candidate-010",
} = {}) {
  const repository = await regularContainedDirectory(repositoryRoot, "repositoryRoot");
  const parent = await regularContainedDirectory(capsuleParent, "capsuleParent");
  if (isInside(repository, parent)) {
    refuse("capsuleParent must be isolated from the repository tree");
  }
  const normalizedCandidateDirectory = normalizedRelativePath(candidateDirectory).replace(/\/$/, "");
  const selected = sourcePaths === null
    ? (await discoverCandidate010SourceFiles({ root: repository })).source_files
    : sourcePaths;
  const normalized = normalizedSourcePaths([...selected]);
  for (const relative of normalized) await assertRegularWorktreeSource(repository, relative);
  const headCommit = await exactSourceCommit(repository, sourceCommit);
  await assertCleanSourceScope(repository, normalized, normalizedCandidateDirectory);

  const capsuleRoot = await mkdtemp(path.join(parent, CAPSULE_PREFIX));
  const capsuleReal = await realpath(capsuleRoot);
  if (
    !isInside(parent, capsuleReal)
    || path.dirname(capsuleReal) !== parent
    || isInside(repository, capsuleReal)
  ) {
    refuse("new capsule escaped its isolated parent");
  }
  const gitObjects = [];
  try {
    for (const relative of normalized) {
      const committed = await committedBlob(repository, headCommit, relative);
      const destination = path.resolve(capsuleReal, ...relative.split("/"));
      if (!isInside(capsuleReal, destination)) refuse(`capsule destination escapes root: ${relative}`);
      await mkdir(path.dirname(destination), { recursive: true });
      await writeFile(destination, committed.body, { flag: "wx", mode: 0o600 });
      gitObjects.push(Object.freeze({
        path: relative,
        git_mode: committed.git_mode,
        git_object_id: committed.git_object_id,
      }));
    }
    const preSeal = await inventory(capsuleReal);
    if (!structurallyEqual(preSeal.files.map((row) => row.path), normalized)) {
      refuse("materialized capsule inventory differs from selected source paths");
    }
    const readOnly = await makeReadOnly(capsuleReal);
    const postSeal = await inventory(capsuleReal);
    if (preSeal.inventory_sha256 !== postSeal.inventory_sha256) {
      refuse("capsule bytes changed while applying the practical read-only seal");
    }
    return Object.freeze({
      schema: 1,
      capsule_version: IMMUTABLE_CAPSULE_VERSION,
      head_commit: headCommit,
      repository_root: repository,
      capsule_parent: parent,
      capsule_root: capsuleReal,
      source_paths: Object.freeze(normalized),
      git_objects: Object.freeze(gitObjects),
      pre_seal_inventory: preSeal,
      post_seal_inventory: postSeal,
      inventory_sha256: postSeal.inventory_sha256,
      read_only: readOnly,
      limits: IMMUTABLE_CAPSULE_LIMITS,
    });
  } catch (error) {
    await makeWritableForRemoval(capsuleReal).catch(() => {});
    await rm(capsuleReal, { recursive: true, force: true }).catch(() => {});
    throw error;
  }
}

export async function verifyImmutableExecutionCapsule(descriptor) {
  validateDescriptor(descriptor);
  const parent = await regularContainedDirectory(descriptor.capsule_parent, "capsule_parent");
  const capsuleRoot = path.resolve(descriptor.capsule_root);
  if (
    path.dirname(capsuleRoot) !== parent
    || !path.basename(capsuleRoot).startsWith(CAPSULE_PREFIX)
    || !isInside(parent, capsuleRoot)
  ) refuse("capsule root is not a contained generated capsule");
  const information = await lstat(capsuleRoot).catch((error) => refuse(`capsule is unavailable: ${error.message}`));
  if (information.isSymbolicLink() || !information.isDirectory()) {
    refuse("capsule root is a symbolic link, reparse point, or non-directory");
  }
  const current = await inventory(capsuleRoot);
  if (
    current.inventory_sha256 !== descriptor.inventory_sha256
    || !structurallyEqual(current, descriptor.post_seal_inventory)
    || !structurallyEqual(current.files.map((row) => row.path), descriptor.source_paths)
  ) refuse("capsule inventory or bytes differ from the frozen descriptor");
  return current;
}

export async function destroyImmutableExecutionCapsule(descriptor) {
  validateDescriptor(descriptor);
  const parent = await regularContainedDirectory(descriptor.capsule_parent, "capsule_parent");
  const capsuleRoot = path.resolve(descriptor.capsule_root);
  if (
    path.dirname(capsuleRoot) !== parent
    || !path.basename(capsuleRoot).startsWith(CAPSULE_PREFIX)
    || !isInside(parent, capsuleRoot)
  ) refuse("destroy target is not a contained generated capsule");
  let information;
  try {
    information = await lstat(capsuleRoot);
  } catch (error) {
    if (error.code === "ENOENT") return false;
    throw error;
  }
  if (information.isSymbolicLink() || !information.isDirectory()) {
    refuse("destroy target is a symbolic link, reparse point, or non-directory");
  }
  await makeWritableForRemoval(capsuleRoot);
  await rm(capsuleRoot, { recursive: true, force: false });
  return true;
}
