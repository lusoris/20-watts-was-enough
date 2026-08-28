import { lstat, open, realpath } from "node:fs/promises";
import path from "node:path";

function refuse(label, reason) {
  throw new Error(`Fixture 026 refused ${label}: ${reason}`);
}

function isInside(root, target) {
  const relative = path.relative(root, target);
  return relative === "" || (!relative.startsWith("..") && !path.isAbsolute(relative));
}

function sameFile(left, right) {
  return left.dev === right.dev && left.ino === right.ino;
}

function sameStableState(left, right) {
  return sameFile(left, right)
    && left.size === right.size
    && left.mtimeNs === right.mtimeNs
    && left.ctimeNs === right.ctimeNs;
}

async function containedRoot(value, label) {
  if (value === null) return null;
  const absolute = path.resolve(value);
  const information = await lstat(absolute, { bigint: true });
  if (information.isSymbolicLink() || !information.isDirectory()) {
    refuse(label, "containment root is linked or not a directory");
  }
  const resolved = await realpath(absolute);
  if (path.resolve(resolved) !== absolute) {
    refuse(label, "containment root resolves through a link or reparse point");
  }
  return resolved;
}

async function assertNamedIdentity(absolute, opened, root, label) {
  const named = await lstat(absolute, { bigint: true });
  if (named.isSymbolicLink() || !named.isFile()) {
    refuse(label, "path is linked or not a regular file");
  }
  if (!sameFile(opened, named)) {
    refuse(label, "path identity changed after it was opened");
  }
  const resolved = await realpath(absolute);
  if (root !== null && !isInside(root, resolved)) {
    refuse(label, "path resolves outside its containment root");
  }
}

export async function withStableOpenedFile(
  file,
  { label = "regular file", containedBy = null } = {},
  consume,
) {
  if (typeof file !== "string" || file.length === 0 || typeof consume !== "function") {
    refuse(label, "a file path and consumer are required");
  }
  const absolute = path.resolve(file);
  const root = await containedRoot(containedBy, label);
  if (root !== null && !isInside(root, absolute)) {
    refuse(label, "path escapes its containment root");
  }
  const handle = await open(absolute, "r");
  try {
    const openedBefore = await handle.stat({ bigint: true });
    if (!openedBefore.isFile()) refuse(label, "opened object is not a regular file");
    await assertNamedIdentity(absolute, openedBefore, root, label);
    const result = await consume(handle);
    const openedAfter = await handle.stat({ bigint: true });
    if (!sameStableState(openedBefore, openedAfter)) {
      refuse(label, "opened file changed while it was consumed");
    }
    await assertNamedIdentity(absolute, openedAfter, root, label);
    return result;
  } finally {
    await handle.close();
  }
}

export function readStableOpenedFile(file, options = {}) {
  return withStableOpenedFile(file, options, (handle) => handle.readFile());
}
