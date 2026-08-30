import { randomUUID } from "node:crypto";
import { constants } from "node:fs";
import { copyFile, lstat, open, rename, rm } from "node:fs/promises";
import path from "node:path";

async function regularFileExists(file, operations) {
  try {
    const information = await operations.lstat(file);
    if (!information.isFile() || information.isSymbolicLink()) {
      throw new Error(`Generated publication path must be a regular non-symlink file: ${file}`);
    }
    return true;
  } catch (error) {
    if (error?.code === "ENOENT") return false;
    throw error;
  }
}

async function restore(destination, backup, hadPrevious, operations) {
  await operations.rm(destination, { force: true });
  if (hadPrevious) await operations.rename(backup, destination);
}

export async function replaceFilePair(
  pairInput,
  operationOverrides = {},
) {
  if (!Array.isArray(pairInput) || pairInput.length !== 2) {
    throw new Error("Generated publication replacement requires exactly two files.");
  }
  const operations = { copyFile, lstat, rename, rm, ...operationOverrides };
  const [first, second] = pairInput;
  const identities = [first, second].flatMap((pair) => [pair?.staged, pair?.destination]);
  if (
    identities.some((file) => typeof file !== "string" || !path.isAbsolute(file))
    || new Set(identities).size !== identities.length
    || [first, second].some((pair) => path.dirname(pair.staged) !== path.dirname(pair.destination))
  ) {
    throw new Error("Generated publication paths must be distinct absolute files staged beside their destinations.");
  }
  const backupIdentity = randomUUID();
  const pairs = [first, second].map((pair, index) => ({
    ...pair,
    backup: `${pair.destination}.backup-${backupIdentity}-${index}`,
  }));
  await Promise.all(pairs.map(({ staged }) => regularFileExists(staged, operations).then((exists) => {
    if (!exists) throw new Error(`Generated publication stage is missing: ${staged}`);
  })));
  const previous = await Promise.all(pairs.map(({ destination }) => (
    regularFileExists(destination, operations)
  )));
  let publicationStarted = false;
  let preserveBackups = false;

  try {
    for (const [index, pair] of pairs.entries()) {
      if (previous[index]) {
        await operations.copyFile(pair.destination, pair.backup, constants.COPYFILE_EXCL);
      }
    }
    publicationStarted = true;
    await operations.rename(pairs[0].staged, pairs[0].destination);
    await operations.rename(pairs[1].staged, pairs[1].destination);
  } catch (error) {
    if (!publicationStarted) throw error;
    const rollback = await Promise.allSettled(pairs.map((pair, index) => (
      restore(pair.destination, pair.backup, previous[index], operations)
    )));
    const rollbackFailures = rollback.filter((result) => result.status === "rejected");
    if (rollbackFailures.length > 0) {
      preserveBackups = true;
      throw new AggregateError(
        [error, ...rollbackFailures.map((result) => result.reason)],
        `Generated artifact replacement and rollback both failed; recovery backups remain at ${pairs.map(({ backup }) => backup).join(", ")}.`,
      );
    }
    throw error;
  } finally {
    if (!preserveBackups) {
      await Promise.allSettled(pairs.map(({ backup }) => operations.rm(backup, { force: true })));
    }
  }
}

export async function acquireExclusiveFileLock(file, label = "generated publication") {
  let handle;
  try {
    handle = await open(file, "wx", 0o600);
  } catch (error) {
    if (error?.code === "EEXIST") {
      throw new Error(`${label} is already locked: ${file}`, { cause: error });
    }
    throw error;
  }
  try {
    await handle.writeFile(`${process.pid} ${randomUUID()}\n`, "utf8");
    const identity = await handle.stat();
    let released = false;
    return Object.freeze({
      async release() {
        if (released) throw new Error(`${label} lock was already released.`);
        const current = await lstat(file);
        if (!current.isFile() || current.isSymbolicLink()
            || current.dev !== identity.dev || current.ino !== identity.ino) {
          throw new Error(`${label} lock changed while held: ${file}`);
        }
        await handle.close();
        handle = undefined;
        await rm(file);
        released = true;
      },
    });
  } catch (error) {
    await handle?.close().catch(() => undefined);
    await rm(file, { force: true }).catch(() => undefined);
    throw error;
  }
}
