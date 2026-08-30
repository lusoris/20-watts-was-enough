import { lstatSync, realpathSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

function invariant(condition, message) {
  if (!condition) throw new Error(message);
}

/**
 * @param {{
 *   override?: string,
 *   repositoryRoot?: string,
 *   systemTemporaryDirectory?: string,
 * }} [options]
 */
export function resolveViteCacheDirectory({
  override,
  repositoryRoot,
  systemTemporaryDirectory = tmpdir(),
} = {}) {
  invariant(path.isAbsolute(repositoryRoot ?? ""), "Vite repository root must be absolute.");
  if (typeof override !== "string" || override.trim() === "") {
    return path.join(repositoryRoot, "node_modules", ".vite");
  }
  invariant(override === override.trim() && path.isAbsolute(override), "VITE_CACHE_DIR must be one absolute path.");
  const temporaryRoot = path.resolve(systemTemporaryDirectory);
  const temporaryInformation = lstatSync(temporaryRoot);
  invariant(
    temporaryInformation.isDirectory() && !temporaryInformation.isSymbolicLink(),
    "The operating-system temporary root must be a non-symlink directory.",
  );
  invariant(realpathSync(temporaryRoot) === temporaryRoot, "The operating-system temporary root must be canonical.");
  const expected = path.join(temporaryRoot, "vite-cache");
  invariant(path.resolve(override) === expected, `VITE_CACHE_DIR must be exactly ${expected}.`);
  try {
    const information = lstatSync(expected);
    invariant(
      information.isDirectory() && !information.isSymbolicLink(),
      "VITE_CACHE_DIR must be a non-symlink directory when it already exists.",
    );
    invariant(realpathSync(expected) === expected, "VITE_CACHE_DIR must remain under the canonical temporary root.");
  } catch (error) {
    if (error?.code !== "ENOENT") throw error;
  }
  return expected;
}
