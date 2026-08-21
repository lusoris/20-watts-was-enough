import { createHash } from "node:crypto";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";

export const CANDIDATE_010_SOURCE_FILES = Object.freeze([
  "package-lock.json",
  "package.json",
  "experiments/workstation/candidate-010/actuator-command-track.mjs",
  "experiments/workstation/candidate-010/backend-registry.mjs",
  "experiments/workstation/candidate-010/checkpoint.mjs",
  "experiments/workstation/candidate-010/configs/development.json",
  "experiments/workstation/candidate-010/configs/smoke.json",
  "experiments/workstation/candidate-010/confirmatory-analysis.mjs",
  "experiments/workstation/candidate-010/energy-provider.config.json",
  "experiments/workstation/candidate-010/energy-provider.mjs",
  "experiments/workstation/candidate-010/factorial-design.mjs",
  "experiments/workstation/candidate-010/factorial-runner.mjs",
  "experiments/workstation/candidate-010/filesystem-track.mjs",
  "experiments/workstation/candidate-010/generator.mjs",
  "experiments/workstation/candidate-010/output.schema.json",
  "experiments/workstation/candidate-010/policies.mjs",
  "experiments/workstation/candidate-010/promotion-evidence.mjs",
  "experiments/workstation/candidate-010/release-contract.mjs",
  "experiments/workstation/candidate-010/runner.mjs",
  "experiments/workstation/candidate-010/seeds/seed-pack.mjs",
  "experiments/workstation/candidate-010/signed-publication-track.mjs",
  "experiments/workstation/candidate-010/source-bundle.mjs",
  "experiments/workstation/candidate-010/trace-job.mjs",
  "experiments/workstation/candidate-010/transactional-kv-track.mjs",
]);

function sha256(value) {
  return createHash("sha256").update(value).digest("hex");
}

function normalizedRelativePath(value) {
  const normalized = value.replaceAll("\\", "/");
  if (path.isAbsolute(value) || normalized.startsWith("../") || normalized.includes("/../")) {
    throw new Error(`Source-bundle path must stay relative to the repository: ${value}`);
  }
  return normalized;
}

export async function computeSourceBundle({ root, sourceFiles, vcs = null }) {
  if (!root || !Array.isArray(sourceFiles) || sourceFiles.length === 0) {
    throw new Error("Source-bundle root and a non-empty source-file list are required.");
  }
  const normalized = [...new Set(sourceFiles.map(normalizedRelativePath))].sort();
  if (normalized.length !== sourceFiles.length) throw new Error("Source-bundle paths must be unique.");
  const aggregate = createHash("sha256");
  const files = [];
  for (const relative of normalized) {
    const body = await readFile(path.join(root, ...relative.split("/")));
    const fileSha256 = sha256(body);
    files.push({ path: relative, bytes: body.length, sha256: fileSha256 });
    aggregate.update(`${Buffer.byteLength(relative)}:${relative}:${body.length}:`);
    aggregate.update(body);
  }
  return Object.freeze({
    schema: 1,
    bundle_id: "candidate-010-executable-source-v1",
    source_sha256: aggregate.digest("hex"),
    files: Object.freeze(files.map(Object.freeze)),
    vcs: vcs === null ? null : Object.freeze({ ...vcs }),
  });
}

async function readOptional(file) {
  try {
    return await readFile(file, "utf8");
  } catch (error) {
    if (error.code === "ENOENT") return null;
    throw error;
  }
}

async function resolveGitDirectory(root) {
  const dotGit = path.join(root, ".git");
  const information = await stat(dotGit);
  if (information.isDirectory()) return dotGit;
  const pointer = (await readFile(dotGit, "utf8")).trim();
  const match = /^gitdir:\s*(.+)$/i.exec(pointer);
  if (!match) throw new Error("Cannot resolve the repository Git directory.");
  return path.resolve(root, match[1]);
}

async function readSourceCommit(root) {
  const gitDirectory = await resolveGitDirectory(root);
  const head = (await readFile(path.join(gitDirectory, "HEAD"), "utf8")).trim();
  if (/^[0-9a-f]{40}$/.test(head)) return head;
  const match = /^ref:\s*(.+)$/.exec(head);
  if (!match) throw new Error("Repository HEAD is neither a commit nor a symbolic reference.");
  const ref = match[1];
  const loose = await readOptional(path.join(gitDirectory, ...ref.split("/")));
  if (loose && /^[0-9a-f]{40}$/.test(loose.trim())) return loose.trim();
  const packed = await readOptional(path.join(gitDirectory, "packed-refs"));
  const packedMatch = packed?.split(/\r?\n/).find((line) => line.endsWith(` ${ref}`));
  const commit = packedMatch?.split(" ")[0];
  if (!/^[0-9a-f]{40}$/.test(commit ?? "")) throw new Error(`Cannot resolve Git reference ${ref}.`);
  return commit;
}

export async function captureCandidate010SourceBundle(root = process.cwd()) {
  const sourceCommit = await readSourceCommit(root);
  if (!/^[0-9a-f]{40}$/.test(sourceCommit)) throw new Error("Candidate 010 source commit is not a full Git SHA-1.");
  const vcs = {
    source_commit: sourceCommit,
    worktree_state: "source-files-hashed-directly; Git index cleanliness not inferred",
  };
  return computeSourceBundle({ root, sourceFiles: CANDIDATE_010_SOURCE_FILES, vcs });
}
