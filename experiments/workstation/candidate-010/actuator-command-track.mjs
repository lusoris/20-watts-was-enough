import { createHash, randomUUID } from "node:crypto";
import { link, mkdir, readFile, readdir, rm, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { performance } from "node:perf_hooks";
import { traceBodyForJob } from "./trace-job.mjs";

const TASK_FAMILY = "actuator-command";
const BACKEND_ID = "isolated-actuator-command-v1";

function sha256(value) {
  return createHash("sha256").update(value).digest("hex");
}

function unitName(value) {
  return String(value).replace(/[^a-zA-Z0-9._-]/g, "_");
}

async function fileExists(file) {
  try {
    await stat(file);
    return true;
  } catch {
    return false;
  }
}

function generationName(version) {
  return `generation-${String(version).padStart(12, "0")}.json`;
}

function serialize(value) {
  return `${JSON.stringify(value)}\n`;
}

function validateBundle(bundle) {
  if (bundle?.schema !== 1 || bundle?.backend_id !== BACKEND_ID) {
    throw new Error("Invalid isolated-actuator state bundle.");
  }
  if (!Number.isSafeInteger(bundle.state?.version) || bundle.state.version < 0) {
    throw new Error("Invalid isolated-actuator state version.");
  }
  if (!Array.isArray(bundle.journal) || bundle.journal.length !== bundle.state.version) {
    throw new Error("Isolated-actuator journal and state version disagree.");
  }
  if (bundle.journal.some((entry, index) => entry.sequence !== index + 1)) {
    throw new Error("Isolated-actuator journal sequence is inconsistent.");
  }
}

async function initializeState(generations) {
  const initialPath = path.join(generations, generationName(0));
  if (await fileExists(initialPath)) return;
  const initial = serialize({
    schema: 1,
    backend_id: BACKEND_ID,
    state: { version: 0, value: null, last_command_sha256: null },
    journal: [],
  });
  const temporary = path.join(generations, `.initialize-${randomUUID()}.tmp`);
  await writeFile(temporary, initial, { encoding: "utf8", flag: "wx" });
  try {
    await link(temporary, initialPath);
  } catch (error) {
    if (error.code !== "EEXIST") throw error;
  } finally {
    await rm(temporary, { force: true });
  }
}

async function currentBundle(generations) {
  const names = (await readdir(generations))
    .filter((name) => /^generation-\d{12}\.json$/.test(name))
    .sort();
  if (names.length === 0) throw new Error("Isolated-actuator state has no generation.");
  const name = names.at(-1);
  const file = path.join(generations, name);
  const body = await readFile(file, "utf8");
  const bundle = JSON.parse(body);
  validateBundle(bundle);
  if (name !== generationName(bundle.state.version)) {
    throw new Error("Isolated-actuator generation filename and state version disagree.");
  }
  return { file, body, bundle };
}

function commandFor(opportunity, observedVersion) {
  const supplied = opportunity.actuator_command ?? {};
  const expectedVersion = supplied.expected_version ?? opportunity.expected_version ?? observedVersion;
  if (!Number.isSafeInteger(expectedVersion) || expectedVersion < 0) {
    throw new Error(`Invalid actuator expected version: ${expectedVersion}`);
  }
  return {
    schema: 1,
    opportunity_id: opportunity.id,
    expected_version: expectedVersion,
    operation: "set-isolated-simulated-state",
    value: supplied.value ?? opportunity.payload,
    safety_boundary: "local-state-simulation-only",
    physical_actuation: false,
  };
}

/**
 * Execute an actuator-shaped trial entirely inside a versioned local-state
 * simulator. It deliberately has no transport or device interface: "commit"
 * means publishing one immutable state/journal bundle, never moving hardware.
 */
export async function executeActuatorCommandTrial({
  root,
  opportunity,
  arm,
  config,
  revealTrace,
  decideWithTrace,
}) {
  const boundaryStarted = performance.now();
  const backendRoot = path.join(root, "isolated-actuator", unitName(arm));
  const generations = path.join(backendRoot, "generations");
  const stagingParent = path.join(backendRoot, "staging");
  const stagedUnit = path.join(stagingParent, unitName(opportunity.id));
  await mkdir(generations, { recursive: true });
  await mkdir(stagingParent, { recursive: true });
  await initializeState(generations);

  const pre = await currentBundle(generations);
  const command = commandFor(opportunity, pre.bundle.state.version);
  const commandBody = serialize(command);
  const commandHash = sha256(commandBody);

  const stageStarted = performance.now();
  await mkdir(stagedUnit, { recursive: false });
  const commandPath = path.join(stagedUnit, "command.json");
  await writeFile(commandPath, commandBody, { encoding: "utf8", flag: "wx" });
  const stageElapsedMs = performance.now() - stageStarted;

  const executionStarted = performance.now();
  const stagedCommand = JSON.parse(await readFile(commandPath, "utf8"));
  const traceJob = {
    schema: 1,
    opportunity_id: opportunity.id,
    payload: opportunity.payload,
    trace_job: opportunity.trace_job,
  };
  const { verifier, body: traceBody } = traceBodyForJob(traceJob, config);
  const safetyTraceBody = serialize({
    schema: 1,
    mode: "dry-run",
    command_sha256: sha256(serialize(stagedCommand)),
    expected_version: stagedCommand.expected_version,
    observed_version: pre.bundle.state.version,
    physical_actuation: false,
    verifier,
  });
  await writeFile(path.join(stagedUnit, "safety-trace.json"), safetyTraceBody, {
    encoding: "utf8",
    flag: "wx",
  });
  const temporaryExecutionElapsedMs = performance.now() - executionStarted;

  const revealedVerifier = revealTrace ? verifier : null;
  const decision = decideWithTrace(revealedVerifier);
  if (decision.stage !== true || decision.reset === decision.commit) {
    throw new Error("Every arm must stage and then choose exactly one of commit or reset.");
  }

  const finalizeStarted = performance.now();
  let committedPath = null;
  let committedBody = null;
  let staleVersionRefused = false;
  if (decision.commit) {
    const observed = await currentBundle(generations);
    staleVersionRefused = (
      command.expected_version !== observed.bundle.state.version
      || sha256(observed.body) !== sha256(pre.body)
    );
    if (!staleVersionRefused) {
      const nextVersion = observed.bundle.state.version + 1;
      const nextState = {
        version: nextVersion,
        value: command.value,
        last_command_sha256: commandHash,
      };
      const nextJournal = [
        ...observed.bundle.journal,
        {
          sequence: nextVersion,
          opportunity_id: opportunity.id,
          expected_version: command.expected_version,
          previous_bundle_sha256: sha256(observed.body),
          command_sha256: commandHash,
          resulting_state_sha256: sha256(serialize(nextState)),
        },
      ];
      committedBody = serialize({
        schema: 1,
        backend_id: BACKEND_ID,
        state: nextState,
        journal: nextJournal,
      });
      const preparedPath = path.join(stagedUnit, generationName(nextVersion));
      await writeFile(preparedPath, committedBody, { encoding: "utf8", flag: "wx" });
      committedPath = path.join(generations, generationName(nextVersion));
      try {
        // An exclusive hard-link publication is a single-filesystem atomic
        // commit. A racing generation wins; this trial then refuses stale state.
        await link(preparedPath, committedPath);
      } catch (error) {
        if (error.code !== "EEXIST") throw error;
        staleVersionRefused = true;
        committedPath = null;
        committedBody = null;
      }
    }
  }
  await rm(stagedUnit, { recursive: true, force: true });
  const finalizeElapsedMs = performance.now() - finalizeStarted;

  const post = await currentBundle(generations);
  const stageExists = await fileExists(stagedUnit);
  const committed = Boolean(committedPath) && await fileExists(committedPath);
  const stateUnchanged = pre.body === post.body;
  const stagedBytesWritten = Buffer.byteLength(commandBody) + Buffer.byteLength(safetyTraceBody);
  const boundary = {
    boundary: "isolated-actuator-stage-dry-run-finalize-v1",
    task_family: TASK_FAMILY,
    backend_id: BACKEND_ID,
    trace_revealed: revealTrace,
    trace_output_sha256: sha256(traceBody),
    safety_trace_sha256: sha256(safetyTraceBody),
    command_sha256: commandHash,
    pre_state_sha256: sha256(pre.body),
    post_state_sha256: sha256(post.body),
    journal_sha256: sha256(serialize(post.bundle.journal)),
    staged_bytes_written: stagedBytesWritten,
    durable_bytes_written: committedBody ? Buffer.byteLength(committedBody) : 0,
    pre_state_bytes: Buffer.byteLength(pre.body),
    post_state_bytes: Buffer.byteLength(post.body),
    stage_elapsed_ms: stageElapsedMs,
    temporary_execution_elapsed_ms: temporaryExecutionElapsedMs,
    finalize_elapsed_ms: finalizeElapsedMs,
    boundary_elapsed_ms: performance.now() - boundaryStarted,
    expected_version: command.expected_version,
    observed_pre_version: pre.bundle.state.version,
    observed_post_version: post.bundle.state.version,
    journal_entries: post.bundle.journal.length,
    stageExists,
    durableExists: committed,
    stale_version_refused: staleVersionRefused,
    rollbackComplete: !stageExists && stateUnchanged && (decision.reset || staleVersionRefused),
    commitComplete: decision.commit && !staleVersionRefused && !stageExists && committed
      && post.bundle.state.version === pre.bundle.state.version + 1,
    irreversible_violation: false,
    physical_actuation: false,
  };
  return { decision, filesystem: boundary, revealedVerifier };
}
