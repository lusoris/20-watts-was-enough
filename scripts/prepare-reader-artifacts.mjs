import { copyFile, lstat, mkdir, readFile, readdir, realpath, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptPath = fileURLToPath(import.meta.url);
const defaultRepositoryRoot = path.resolve(path.dirname(scriptPath), "..");
const SOURCE_EXTENSIONS = new Set([
  ".csv", ".js", ".json", ".mjs", ".ps1", ".py", ".sh", ".toml",
  ".ts", ".tsx", ".tsv", ".yaml", ".yml",
]);
const EXCLUDED_DIRECTORIES = new Set([
  ".git", ".next", ".vinext", ".vite", ".wrangler", "dist", "node_modules", "tmp",
]);
const LINK_PATTERN = /(?<!!)\[[^\]]+\]\((?<target>[^)]+)\)/gu;

function isInside(root, candidate) {
  const relative = path.relative(root, candidate);
  return relative === "" || (!relative.startsWith("..") && !path.isAbsolute(relative));
}

function sourceExtension(file) {
  const lower = file.toLowerCase();
  return [...SOURCE_EXTENSIONS].find((extension) => lower.endsWith(extension)) ?? null;
}

async function markdownFiles(directory, repositoryRoot) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (entry.isDirectory() && EXCLUDED_DIRECTORIES.has(entry.name)) continue;
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      if (path.resolve(absolute) === path.resolve(repositoryRoot, "public", "repository-files")) {
        continue;
      }
      files.push(...await markdownFiles(absolute, repositoryRoot));
    } else if (entry.isFile() && entry.name.endsWith(".md")) {
      files.push(absolute);
    }
  }
  return files;
}

function linkPath(target) {
  const trimmed = target.trim();
  if (/^(?:https?:|mailto:|#)/iu.test(trimmed)) return null;
  const withoutTitle = trimmed.startsWith("<")
    ? trimmed.match(/^<([^>]+)>/u)?.[1]
    : trimmed.split(/\s+"/u, 1)[0];
  if (!withoutTitle) return null;
  const rawPath = withoutTitle.split("#", 1)[0];
  if (!rawPath) return null;
  try {
    return decodeURIComponent(rawPath);
  } catch {
    return null;
  }
}

export async function prepareReaderArtifacts({
  repositoryRoot = defaultRepositoryRoot,
  outputRoot = path.join(repositoryRoot, "public", "repository-files"),
} = {}) {
  const root = await realpath(repositoryRoot);
  const resolvedOutput = path.resolve(outputRoot);
  const expectedDefault = path.resolve(root, "public", "repository-files");
  if (!isInside(root, resolvedOutput) || resolvedOutput === root) {
    throw new Error("Reader-artifact output must be a bounded repository subdirectory.");
  }
  if (path.resolve(outputRoot) === path.resolve(defaultRepositoryRoot, "public", "repository-files")
      && resolvedOutput !== expectedDefault) {
    throw new Error("Reader-artifact default output does not match the resolved repository root.");
  }

  const targets = new Set();
  for (const markdown of await markdownFiles(root, root)) {
    const body = await readFile(markdown, "utf8");
    for (const match of body.matchAll(LINK_PATTERN)) {
      const linked = linkPath(match.groups?.target ?? "");
      if (!linked || !sourceExtension(linked)) continue;
      const candidate = path.resolve(
        linked.startsWith("/") ? root : path.dirname(markdown),
        linked.replace(/^[/\\]+/u, ""),
      );
      if (!isInside(root, candidate)) {
        throw new Error(`Reader artifact escapes the repository: ${linked}`);
      }
      const information = await lstat(candidate);
      if (!information.isFile() || information.isSymbolicLink()) {
        throw new Error(`Reader artifact is not a regular file: ${linked}`);
      }
      const realCandidate = await realpath(candidate);
      if (!isInside(root, realCandidate)) {
        throw new Error(`Reader artifact resolves outside the repository: ${linked}`);
      }
      targets.add(path.relative(root, realCandidate).replaceAll("\\", "/"));
    }
  }

  await rm(resolvedOutput, { recursive: true, force: true });
  await mkdir(resolvedOutput, { recursive: true });
  const artifacts = [...targets].sort();
  for (const relative of artifacts) {
    const destination = path.join(resolvedOutput, ...relative.split("/")) + ".txt";
    await mkdir(path.dirname(destination), { recursive: true });
    await copyFile(path.join(root, ...relative.split("/")), destination);
  }
  await writeFile(
    path.join(resolvedOutput, "manifest.json"),
    `${JSON.stringify({ schema: 1, artifacts }, null, 2)}\n`,
    "utf8",
  );
  return Object.freeze({ outputRoot: resolvedOutput, artifacts: Object.freeze(artifacts) });
}

if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(scriptPath)) {
  const prepared = await prepareReaderArtifacts();
  process.stdout.write(`Prepared ${prepared.artifacts.length} linked repository artifacts.\n`);
}
