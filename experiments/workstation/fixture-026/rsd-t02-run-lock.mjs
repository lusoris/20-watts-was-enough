import { createHash, randomBytes } from "node:crypto";
import {
  open,
  readFile,
  unlink,
} from "node:fs/promises";
import path from "node:path";

export const FIXTURE_026_RSD_T02_RUN_LOCK_VERSION = "fixture-026.rsd-t02-run-lock.v1";

function sha256(value) {
  return createHash("sha256").update(value).digest("hex");
}

function resolvedOutputDirectory(outputDirectory) {
  if (typeof outputDirectory !== "string" || outputDirectory.trim() === "") {
    throw new TypeError("Fixture 026 RSD-T02 run lease requires an output directory.");
  }
  return path.resolve(outputDirectory);
}

export function fixture026RsdT02RunLockPath(outputDirectory) {
  return `${resolvedOutputDirectory(outputDirectory)}.rsd-t02.run.lock`;
}

export class Fixture026RsdT02RunLockContentionError extends Error {
  constructor(lockPath) {
    super(`Fixture 026 RSD-T02 output has a live exclusive writer: ${lockPath}`);
    this.name = "Fixture026RsdT02RunLockContentionError";
    this.code = "FIXTURE_026_RSD_T02_RUN_LOCK_CONTENDED";
    this.lockPath = lockPath;
  }
}

function ownershipMatches(document, ownership, token) {
  return document?.schema === 1
    && document.contract_version === FIXTURE_026_RSD_T02_RUN_LOCK_VERSION
    && document.lock_id === ownership.lock_id
    && document.runner_id === ownership.runner_id
    && document.output_directory_sha256 === ownership.output_directory_sha256
    && document.ownership_token_sha256 === sha256(token)
    && document.auto_break === false;
}

export async function acquireFixture026RsdT02RunLock({ outputDirectory, runnerId }) {
  if (typeof runnerId !== "string" || runnerId.trim() === "") {
    throw new TypeError("Fixture 026 RSD-T02 run lease requires a runner ID.");
  }
  const resolvedOutput = resolvedOutputDirectory(outputDirectory);
  const lockPath = fixture026RsdT02RunLockPath(resolvedOutput);
  const token = randomBytes(32);
  const ownership = Object.freeze({
    schema: 1,
    contract_version: FIXTURE_026_RSD_T02_RUN_LOCK_VERSION,
    lock_id: randomBytes(16).toString("hex"),
    runner_id: runnerId,
    process_id: process.pid,
    acquired_at: new Date().toISOString(),
    output_directory_sha256: sha256(resolvedOutput),
    ownership_token_sha256: sha256(token),
    auto_break: false,
  });
  let handle;
  try {
    handle = await open(lockPath, "wx", 0o600);
  } catch (error) {
    if (error.code === "EEXIST") throw new Fixture026RsdT02RunLockContentionError(lockPath);
    throw error;
  }
  try {
    await handle.writeFile(`${JSON.stringify(ownership, null, 2)}\n`, "utf8");
    await handle.sync();
  } catch (error) {
    await handle.close().catch(() => {});
    await unlink(lockPath).catch(() => {});
    throw error;
  }
  let closed = false;
  return Object.freeze({
    lockPath,
    ownership,
    async release() {
      if (closed) return false;
      let document;
      try {
        document = JSON.parse(await readFile(lockPath, "utf8"));
      } catch (error) {
        await handle.close().catch(() => {});
        closed = true;
        throw new Error(`Fixture 026 RSD-T02 run lease disappeared or became unreadable: ${error.message}`);
      }
      if (!ownershipMatches(document, ownership, token)) {
        await handle.close().catch(() => {});
        closed = true;
        throw new Error("Fixture 026 RSD-T02 run lease ownership changed; refusing foreign-lock removal.");
      }
      await handle.close();
      closed = true;
      await unlink(lockPath);
      return true;
    },
  });
}
