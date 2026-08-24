import { lstat, mkdir, realpath } from "node:fs/promises";
import path from "node:path";

function samePath(left, right) {
  const normalize = (value) => process.platform === "win32"
    ? path.resolve(value).toLowerCase()
    : path.resolve(value);
  return normalize(left) === normalize(right);
}

export function isPathInside(root, target) {
  const relative = path.relative(path.resolve(root), path.resolve(target));
  return relative === "" || (!relative.startsWith("..") && !path.isAbsolute(relative));
}

async function informationOrNull(target) {
  try {
    return await lstat(target);
  } catch (error) {
    if (error.code === "ENOENT") return null;
    throw error;
  }
}

/**
 * Rejects symbolic links, Windows junctions/reparse-point traversal, and
 * lexical or resolved escapes. Missing suffixes are permitted only when the
 * caller explicitly intends to create them below the last verified ancestor.
 */
export async function assertSafePathBelow({
  root,
  target,
  label,
  allowMissing = false,
  finalType = null,
}) {
  const rootAbsolute = path.resolve(root);
  const targetAbsolute = path.resolve(target);
  if (!isPathInside(rootAbsolute, targetAbsolute)) {
    throw new Error(`${label} escapes its declared root.`);
  }
  const rootInfo = await informationOrNull(rootAbsolute);
  if (!rootInfo) throw new Error(`${label} root does not exist.`);
  if (!rootInfo.isDirectory() || rootInfo.isSymbolicLink()) {
    throw new Error(`${label} root must be a real directory.`);
  }
  const rootReal = await realpath(rootAbsolute);
  let current = rootAbsolute;
  const components = path.relative(rootAbsolute, targetAbsolute).split(path.sep).filter(Boolean);
  let missing = false;
  for (const component of components) {
    current = path.join(current, component);
    const information = await informationOrNull(current);
    if (!information) {
      missing = true;
      if (!allowMissing) throw new Error(`${label} does not exist.`);
      continue;
    }
    if (missing) throw new Error(`${label} has an existing descendant below a missing ancestor.`);
    if (information.isSymbolicLink()) {
      throw new Error(`${label} traverses a symbolic link or junction.`);
    }
    const resolved = await realpath(current);
    if (!isPathInside(rootReal, resolved)) {
      throw new Error(`${label} resolves outside its declared root.`);
    }
    // A reparse point that Node does not classify as a symlink still changes
    // the canonical pathname. Refuse it even if it points back inside root.
    const expected = path.join(rootReal, path.relative(rootAbsolute, current));
    if (!samePath(expected, resolved)) {
      throw new Error(`${label} traverses a reparse point or redirected ancestor.`);
    }
  }
  const finalInfo = await informationOrNull(targetAbsolute);
  if (finalInfo && finalType === "file" && !finalInfo.isFile()) {
    throw new Error(`${label} must be a regular file.`);
  }
  if (finalInfo && finalType === "directory" && !finalInfo.isDirectory()) {
    throw new Error(`${label} must be a directory.`);
  }
  return targetAbsolute;
}

export async function ensureSafeDirectory({ root, target, label }) {
  const absolute = await assertSafePathBelow({ root, target, label, allowMissing: true });
  await mkdir(absolute, { recursive: true });
  return assertSafePathBelow({ root, target: absolute, label, finalType: "directory" });
}

export async function assertAbsoluteRegularFile(file, label) {
  if (typeof file !== "string" || !path.isAbsolute(file) || file.includes("\0")) {
    throw new Error(`${label} must be an absolute regular-file path.`);
  }
  const volumeRoot = path.parse(path.resolve(file)).root;
  return assertSafePathBelow({
    root: volumeRoot,
    target: file,
    label,
    finalType: "file",
  });
}
