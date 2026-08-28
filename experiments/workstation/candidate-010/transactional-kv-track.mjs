import { createHash } from "node:crypto";
import {
  lstat,
  mkdir,
  readFile,
  readdir,
  rename,
  rm,
  stat,
  writeFile,
} from "node:fs/promises";
import path from "node:path";
import { performance } from "node:perf_hooks";
import { readStableOpenedFile } from "./opened-file.mjs";
import { traceBodyForJob } from "./trace-job.mjs";

const BACKEND_ID = "local-versioned-transactional-kv-v1";
const BOUNDARY_ID = "local-transactional-kv-stage-validate-finalize-v1";
const TASK_FAMILY = "transactional-kv";
const VERSION_WIDTH = 12;

function sha256(value) {
  return createHash("sha256").update(value).digest("hex");
}

function safeUnit(value) {
  const readable = String(value).replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 80) || "unit";
  return `${readable}-${sha256(String(value)).slice(0, 12)}`;
}

function versionName(version) {
  return String(version).padStart(VERSION_WIDTH, "0");
}

function jsonBody(value) {
  return `${JSON.stringify(value)}\n`;
}

async function exists(target) {
  try {
    await stat(target);
    return true;
  } catch (error) {
    if (error?.code === "ENOENT") return false;
    throw error;
  }
}

function refuse(reason) {
  throw new Error(`Refusing transactional KV trial: ${reason}`);
}

async function durableSnapshot(versionsDirectory) {
  const digest = createHash("sha256");
  let bytes = 0;
  const names = (await readdir(versionsDirectory, { recursive: true })).sort();
  for (const name of names) {
    const absolute = path.join(versionsDirectory, name);
    const information = await lstat(absolute);
    if (information.isSymbolicLink()) refuse(`durable snapshot refuses linked entry ${name}`);
    if (!information.isFile()) continue;
    const body = await readStableOpenedFile(absolute, {
      label: `transactional KV durable snapshot file ${name}`,
      containedBy: versionsDirectory,
    });
    const relative = name.split(path.sep).join("/");
    digest.update(`${Buffer.byteLength(relative)}:${relative}:${body.length}:`);
    digest.update(body);
    bytes += body.length;
  }
  return { sha256: digest.digest("hex"), bytes, files: names.length };
}

async function writeVersion(directory, stateBody) {
  const integrityBody = jsonBody({
    schema: 1,
    state_sha256: sha256(stateBody),
    state_bytes: Buffer.byteLength(stateBody),
  });
  await mkdir(directory, { recursive: false });
  await writeFile(path.join(directory, "state.json"), stateBody, { encoding: "utf8", flag: "wx" });
  await writeFile(path.join(directory, "integrity.json"), integrityBody, {
    encoding: "utf8",
    flag: "wx",
  });
  return {
    state_sha256: sha256(stateBody),
    bytes: Buffer.byteLength(stateBody) + Buffer.byteLength(integrityBody),
  };
}

async function readVersionChain(versionsDirectory) {
  const entries = await readdir(versionsDirectory, { withFileTypes: true });
  const unexpected = entries.filter(
    (entry) => !entry.isDirectory() || !/^\d{12}$/.test(entry.name),
  );
  if (unexpected.length > 0) refuse(`unexpected durable version entry ${unexpected[0].name}`);

  const names = entries.map((entry) => entry.name).sort();
  if (names.length === 0) refuse("durable version chain is empty");

  let parentStateSha256 = null;
  let current;
  for (let index = 0; index < names.length; index += 1) {
    const expectedName = versionName(index);
    if (names[index] !== expectedName) {
      refuse(`version sequence is not contiguous at ${expectedName}`);
    }
    const directory = path.join(versionsDirectory, names[index]);
    let stateBody;
    let integrityBody;
    try {
      [stateBody, integrityBody] = await Promise.all([
        readFile(path.join(directory, "state.json"), "utf8"),
        readFile(path.join(directory, "integrity.json"), "utf8"),
      ]);
    } catch (error) {
      refuse(`version ${names[index]} is unreadable (${error?.code ?? "read error"})`);
    }

    let state;
    let integrity;
    try {
      state = JSON.parse(stateBody);
      integrity = JSON.parse(integrityBody);
    } catch {
      refuse(`version ${names[index]} contains invalid JSON`);
    }
    const stateSha256 = sha256(stateBody);
    if (
      integrity?.schema !== 1
      || integrity.state_sha256 !== stateSha256
      || integrity.state_bytes !== Buffer.byteLength(stateBody)
    ) {
      refuse(`version ${names[index]} state hash or byte count does not match its integrity record`);
    }
    if (
      state?.schema !== 1
      || state.backend_id !== BACKEND_ID
      || state.version !== index
      || state.parent_state_sha256 !== parentStateSha256
      || !state.entries
      || typeof state.entries !== "object"
      || Array.isArray(state.entries)
    ) {
      refuse(`version ${names[index]} violates the local KV state schema or hash chain`);
    }
    parentStateSha256 = stateSha256;
    current = { state, stateBody, stateSha256, directory };
  }
  return { current, versions: names.length };
}

async function ensureGenesis(versionsDirectory, transactionsDirectory) {
  const entries = await readdir(versionsDirectory);
  if (entries.length > 0) return 0;

  const bootstrapDirectory = path.join(transactionsDirectory, "bootstrap");
  const stateBody = jsonBody({
    schema: 1,
    backend_id: BACKEND_ID,
    version: 0,
    parent_state_sha256: null,
    entries: {},
  });
  const written = await writeVersion(bootstrapDirectory, stateBody);
  await rename(bootstrapDirectory, path.join(versionsDirectory, versionName(0)));
  return written.bytes;
}

function validateDecision(decision) {
  if (
    !decision
    || decision.stage !== true
    || typeof decision.commit !== "boolean"
    || typeof decision.reset !== "boolean"
    || decision.commit === decision.reset
  ) {
    refuse("every arm must stage and then choose exactly one of commit or reset");
  }
}

function validateStagedWriteSet(body, expectedSha256, opportunityId) {
  if (sha256(body) !== expectedSha256) refuse("staged write-set changed after validation trace");
  let writeSet;
  try {
    writeSet = JSON.parse(body);
  } catch {
    refuse("staged write-set is not valid JSON");
  }
  if (
    writeSet?.schema !== 1
    || writeSet.operations?.length !== 1
    || writeSet.operations[0]?.type !== "put"
    || writeSet.operations[0]?.key !== opportunityId
    || writeSet.operations[0]?.value?.opportunity_id !== opportunityId
  ) {
    refuse("staged write-set does not match the transaction contract");
  }
  return writeSet;
}

export async function executeTransactionalKvTrial({
  root,
  opportunity,
  arm,
  config,
  revealTrace,
  decideWithTrace,
}) {
  const boundaryStarted = performance.now();
  if (!root || !opportunity?.id || !arm || typeof decideWithTrace !== "function") {
    refuse("root, opportunity, arm, and decideWithTrace are required");
  }

  const backendDirectory = path.join(root, "transactional-kv", safeUnit(arm));
  const versionsDirectory = path.join(backendDirectory, "versions");
  const transactionsDirectory = path.join(backendDirectory, "transactions");
  const lockDirectory = path.join(backendDirectory, "exclusive-transaction.lock");
  await mkdir(versionsDirectory, { recursive: true });
  await mkdir(transactionsDirectory, { recursive: true });

  try {
    await mkdir(lockDirectory, { recursive: false });
  } catch (error) {
    if (error?.code === "EEXIST") refuse("the isolated backend already has an active transaction");
    throw error;
  }

  let stagedUnit;
  try {
    const bootstrapBytesWritten = await ensureGenesis(versionsDirectory, transactionsDirectory);
    const preChain = await readVersionChain(versionsDirectory);
    const preSnapshot = await durableSnapshot(versionsDirectory);
    const expectedVersion = opportunity.transactional_kv?.expected_version
      ?? opportunity.expected_version
      ?? preChain.current.state.version;
    if (!Number.isSafeInteger(expectedVersion) || expectedVersion < 0) {
      refuse(`invalid expected version ${expectedVersion}`);
    }
    const transactionId = sha256(`${arm}\u0000${opportunity.id}`).slice(0, 24);
    stagedUnit = path.join(transactionsDirectory, transactionId);
    if (await exists(stagedUnit)) refuse(`staging transaction ${transactionId} already exists`);
    if (Object.hasOwn(preChain.current.state.entries, opportunity.id)) {
      refuse(`key ${opportunity.id} already exists in this isolated backend`);
    }

    const job = {
      schema: 1,
      opportunity_id: opportunity.id,
      payload: opportunity.payload,
      trace_job: opportunity.trace_job,
    };
    const writeSetBody = jsonBody({
      schema: 1,
      operations: [{ type: "put", key: opportunity.id, value: job }],
    });
    const writeSetSha256 = sha256(writeSetBody);

    const stageStarted = performance.now();
    await mkdir(stagedUnit, { recursive: false });
    const writeSetPath = path.join(stagedUnit, "write-set.json");
    await writeFile(writeSetPath, writeSetBody, { encoding: "utf8", flag: "wx" });
    const stageElapsedMs = performance.now() - stageStarted;

    const executionStarted = performance.now();
    const stagedBody = await readFile(writeSetPath, "utf8");
    const stagedWriteSet = validateStagedWriteSet(
      stagedBody,
      writeSetSha256,
      opportunity.id,
    );
    const stagedJob = stagedWriteSet.operations[0].value;
    const { verifier, body: traceBody } = traceBodyForJob(stagedJob, config);
    const tracePath = path.join(stagedUnit, "temporary-validation-trace.json");
    await writeFile(tracePath, traceBody, { encoding: "utf8", flag: "wx" });
    const temporaryExecutionElapsedMs = performance.now() - executionStarted;

    const revealedVerifier = revealTrace ? verifier : null;
    const decision = decideWithTrace(revealedVerifier);
    validateDecision(decision);

    const finalizeStarted = performance.now();
    const finalWriteSetBody = await readFile(writeSetPath, "utf8");
    const finalWriteSet = validateStagedWriteSet(
      finalWriteSetBody,
      writeSetSha256,
      opportunity.id,
    );
    let durableBytesWritten = 0;
    let expectedCommittedStateSha256 = null;
    const staleVersionRefused = decision.commit
      && expectedVersion !== preChain.current.state.version;
    if (decision.commit && !staleVersionRefused) {
      const nextVersion = preChain.current.state.version + 1;
      const nextStateBody = jsonBody({
        schema: 1,
        backend_id: BACKEND_ID,
        version: nextVersion,
        parent_state_sha256: preChain.current.stateSha256,
        entries: {
          ...preChain.current.state.entries,
          [opportunity.id]: finalWriteSet.operations[0].value,
        },
      });
      const commitCandidate = path.join(stagedUnit, "commit-candidate");
      const written = await writeVersion(commitCandidate, nextStateBody);
      durableBytesWritten = written.bytes;
      expectedCommittedStateSha256 = written.state_sha256;
      await rename(
        commitCandidate,
        path.join(versionsDirectory, versionName(nextVersion)),
      );
    }
    await rm(stagedUnit, { recursive: true, force: false });
    const finalizeElapsedMs = performance.now() - finalizeStarted;

    const postChain = await readVersionChain(versionsDirectory);
    const postSnapshot = await durableSnapshot(versionsDirectory);
    const stageExists = await exists(stagedUnit);
    const durableExists = Object.hasOwn(postChain.current.state.entries, opportunity.id);
    const committedValueMatches = durableExists
      && sha256(jsonBody(postChain.current.state.entries[opportunity.id]))
        === sha256(jsonBody(job));
    const rollbackComplete = Boolean(
      (decision.reset || staleVersionRefused)
      && !stageExists
      && !durableExists
      && postChain.current.state.version === preChain.current.state.version
      && postChain.current.stateSha256 === preChain.current.stateSha256
      && postSnapshot.sha256 === preSnapshot.sha256
      && postSnapshot.bytes === preSnapshot.bytes,
    );
    const commitComplete = Boolean(
      decision.commit
      && !stageExists
      && durableExists
      && committedValueMatches
      && postChain.current.state.version === preChain.current.state.version + 1
      && postChain.current.state.parent_state_sha256 === preChain.current.stateSha256
      && postChain.current.stateSha256 === expectedCommittedStateSha256,
    );
    const proofComplete = rollbackComplete || commitComplete;
    const stagedBytesWritten = Buffer.byteLength(writeSetBody) + Buffer.byteLength(traceBody);
    const filesystem = {
      boundary: BOUNDARY_ID,
      task_family: TASK_FAMILY,
      backend_id: BACKEND_ID,
      backend_scope: "local-per-arm-isolated-state",
      transaction_id: transactionId,
      trace_revealed: Boolean(revealTrace),
      trace_output_sha256: sha256(traceBody),
      write_set_sha256: writeSetSha256,
      pre_state_sha256: preChain.current.stateSha256,
      post_state_sha256: postChain.current.stateSha256,
      durable_snapshot_pre_sha256: preSnapshot.sha256,
      durable_snapshot_post_sha256: postSnapshot.sha256,
      staged_bytes_written: stagedBytesWritten,
      durable_bytes_written: durableBytesWritten,
      bootstrap_bytes_written: bootstrapBytesWritten,
      durable_bytes_before: preSnapshot.bytes,
      durable_bytes_after: postSnapshot.bytes,
      stage_elapsed_ms: stageElapsedMs,
      temporary_execution_elapsed_ms: temporaryExecutionElapsedMs,
      finalize_elapsed_ms: finalizeElapsedMs,
      boundary_elapsed_ms: performance.now() - boundaryStarted,
      expected_version: expectedVersion,
      pre_version: preChain.current.state.version,
      post_version: postChain.current.state.version,
      stale_version_refused: staleVersionRefused,
      stageExists,
      durableExists,
      rollbackComplete,
      commitComplete,
      proofComplete,
      irreversible_violation: !proofComplete,
      physical_actuation: false,
    };
    return { decision, filesystem, revealedVerifier };
  } finally {
    if (stagedUnit) await rm(stagedUnit, { recursive: true, force: true });
    await rm(lockDirectory, { recursive: true, force: true });
  }
}
