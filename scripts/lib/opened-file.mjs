import {
  closeSync,
  fstatSync,
  lstatSync,
  openSync,
  readFileSync,
  realpathSync,
} from "node:fs";
import { lstat, open, realpath } from "node:fs/promises";
import path from "node:path";

function refuse(label, reason) {
  throw new Error(`Refusing ${label}: ${reason}`);
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

function canonicalPath(value) {
  const normalized = path.normalize(path.resolve(value));
  return process.platform === "win32" ? normalized.toLowerCase() : normalized;
}

function normalizedMaximumBytes(value, label) {
  if (value === null) return null;
  if (!Number.isSafeInteger(value) || value < 0) {
    refuse(label, "maximumBytes must be a non-negative safe integer or null");
  }
  return BigInt(value);
}

function assertSize(information, maximumBytes, label) {
  if (maximumBytes !== null && information.size > maximumBytes) {
    refuse(label, `file exceeds the ${maximumBytes}-byte limit`);
  }
}

function assertRootIdentitySync(root, label) {
  if (root === null) return;
  const named = lstatSync(root.path, { bigint: true });
  const resolved = realpathSync(root.path);
  if (
    named.isSymbolicLink()
    || !named.isDirectory()
    || !sameFile(root.information, named)
    || canonicalPath(resolved) !== canonicalPath(root.path)
  ) {
    refuse(label, "containment root changed identity or resolves through a link");
  }
}

async function assertRootIdentity(root, label) {
  if (root === null) return;
  const named = await lstat(root.path, { bigint: true });
  const resolved = await realpath(root.path);
  if (
    named.isSymbolicLink()
    || !named.isDirectory()
    || !sameFile(root.information, named)
    || canonicalPath(resolved) !== canonicalPath(root.path)
  ) {
    refuse(label, "containment root changed identity or resolves through a link");
  }
}

function resolvedRootSync(value, label) {
  if (value === null) return null;
  const absolute = path.resolve(value);
  const information = lstatSync(absolute, { bigint: true });
  if (information.isSymbolicLink() || !information.isDirectory()) {
    refuse(label, "containment root is linked or not a directory");
  }
  const resolved = realpathSync(absolute);
  const finalInformation = lstatSync(absolute, { bigint: true });
  if (
    canonicalPath(resolved) !== canonicalPath(absolute)
    || !sameFile(information, finalInformation)
  ) {
    refuse(label, "containment root resolves through a link or changed identity");
  }
  return { path: resolved, information: finalInformation };
}

async function resolvedRoot(value, label) {
  if (value === null) return null;
  const absolute = path.resolve(value);
  const information = await lstat(absolute, { bigint: true });
  if (information.isSymbolicLink() || !information.isDirectory()) {
    refuse(label, "containment root is linked or not a directory");
  }
  const resolved = await realpath(absolute);
  const finalInformation = await lstat(absolute, { bigint: true });
  if (
    canonicalPath(resolved) !== canonicalPath(absolute)
    || !sameFile(information, finalInformation)
  ) {
    refuse(label, "containment root resolves through a link or changed identity");
  }
  return { path: resolved, information: finalInformation };
}

function assertNamedIdentitySync(absolute, opened, root, label) {
  const named = lstatSync(absolute, { bigint: true });
  if (named.isSymbolicLink() || !named.isFile() || !sameFile(opened, named)) {
    refuse(label, "named path is linked, invalid, or no longer identifies the opened file");
  }
  const resolved = realpathSync(absolute);
  if (root !== null && !isInside(root.path, resolved)) refuse(label, "path resolves outside its containment root");
}

async function assertNamedIdentity(absolute, opened, root, label) {
  const named = await lstat(absolute, { bigint: true });
  if (named.isSymbolicLink() || !named.isFile() || !sameFile(opened, named)) {
    refuse(label, "named path is linked, invalid, or no longer identifies the opened file");
  }
  const resolved = await realpath(absolute);
  if (root !== null && !isInside(root.path, resolved)) refuse(label, "path resolves outside its containment root");
}

export async function withStableOpenedFile(
  file,
  { label = "regular file", containedBy = null, maximumBytes = null } = {},
  consume,
) {
  if (typeof file !== "string" || file.length === 0 || typeof consume !== "function") {
    refuse(label, "a file path and consumer are required");
  }
  const absolute = path.resolve(file);
  const root = await resolvedRoot(containedBy, label);
  const maximum = normalizedMaximumBytes(maximumBytes, label);
  if (root !== null && !isInside(root.path, absolute)) refuse(label, "path escapes its containment root");
  const handle = await open(absolute, "r");
  try {
    await assertRootIdentity(root, label);
    const before = await handle.stat({ bigint: true });
    if (!before.isFile()) refuse(label, "opened object is not a regular file");
    assertSize(before, maximum, label);
    await assertNamedIdentity(absolute, before, root, label);
    const result = await consume(handle);
    const after = await handle.stat({ bigint: true });
    if (!sameStableState(before, after)) refuse(label, "opened file changed while it was read");
    await assertNamedIdentity(absolute, after, root, label);
    await assertRootIdentity(root, label);
    return result;
  } finally {
    await handle.close();
  }
}

export function readStableOpenedFile(file, options = {}) {
  return withStableOpenedFile(file, options, (handle) => handle.readFile());
}

export function withStableOpenedFileSync(
  file,
  { label = "regular file", containedBy = null, maximumBytes = null } = {},
  consume,
) {
  if (typeof file !== "string" || file.length === 0 || typeof consume !== "function") {
    refuse(label, "a file path and consumer are required");
  }
  const absolute = path.resolve(file);
  const root = resolvedRootSync(containedBy, label);
  const maximum = normalizedMaximumBytes(maximumBytes, label);
  if (root !== null && !isInside(root.path, absolute)) refuse(label, "path escapes its containment root");
  const descriptor = openSync(absolute, "r");
  try {
    assertRootIdentitySync(root, label);
    const before = fstatSync(descriptor, { bigint: true });
    if (!before.isFile()) refuse(label, "opened object is not a regular file");
    assertSize(before, maximum, label);
    assertNamedIdentitySync(absolute, before, root, label);
    const result = consume(descriptor);
    const after = fstatSync(descriptor, { bigint: true });
    if (!sameStableState(before, after)) refuse(label, "opened file changed while it was read");
    assertNamedIdentitySync(absolute, after, root, label);
    assertRootIdentitySync(root, label);
    return result;
  } finally {
    closeSync(descriptor);
  }
}

export function readStableOpenedFileSync(file, options = {}) {
  return withStableOpenedFileSync(file, options, (descriptor) => readFileSync(descriptor));
}
