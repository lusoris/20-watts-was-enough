import { createHash } from "node:crypto";
import { mkdir, readFile, rename, rm, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { performance } from "node:perf_hooks";

async function fileExists(file) {
  try {
    await stat(file);
    return true;
  } catch {
    return false;
  }
}

function sha256(value) {
  return createHash("sha256").update(value).digest("hex");
}

function normalFromNonce(nonce) {
  const digest = createHash("sha256").update(String(nonce)).digest();
  const u1 = Math.max(digest.readUInt32BE(0) / 0x1_0000_0000, Number.EPSILON);
  const u2 = digest.readUInt32BE(4) / 0x1_0000_0000;
  return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
}

function executeTraceJob(job, config) {
  const direction = job.trace_job.unsafe ? 1 : -1;
  const commonWeight = config.verifier_common_mode_weight;
  const residualWeight = Math.sqrt(1 - commonWeight ** 2);
  return (
    direction * config.verifier_signal
    + commonWeight * job.trace_job.cheap_common_mode
    + residualWeight * normalFromNonce(job.trace_job.nonce)
  );
}

function unitName(value) {
  return value.replace(/[^a-zA-Z0-9._-]/g, "_");
}

export async function executeFilesystemTrial({
  root,
  opportunity,
  arm,
  config,
  revealTrace,
  decideWithTrace,
}) {
  const boundaryStarted = performance.now();
  const stagingParent = path.join(root, "staging", unitName(arm));
  const durableParent = path.join(root, "durable", unitName(arm));
  const stagedUnit = path.join(stagingParent, unitName(opportunity.id));
  const durableUnit = path.join(durableParent, unitName(opportunity.id));
  const stageStarted = performance.now();
  await mkdir(stagingParent, { recursive: true });
  await mkdir(durableParent, { recursive: true });
  await mkdir(stagedUnit, { recursive: false });
  const job = {
    schema: 1,
    opportunity_id: opportunity.id,
    payload: opportunity.payload,
    trace_job: opportunity.trace_job,
  };
  const jobBody = `${JSON.stringify(job)}\n`;
  const jobPath = path.join(stagedUnit, "job.json");
  await writeFile(jobPath, jobBody, { encoding: "utf8", flag: "wx" });
  const stageElapsedMs = performance.now() - stageStarted;

  const executionStarted = performance.now();
  const stagedJob = JSON.parse(await readFile(jobPath, "utf8"));
  const verifier = executeTraceJob(stagedJob, config);
  const traceBody = `${JSON.stringify({ schema: 1, verifier })}\n`;
  const tracePath = path.join(stagedUnit, "trace.json");
  await writeFile(tracePath, traceBody, { encoding: "utf8", flag: "wx" });
  const temporaryExecutionElapsedMs = performance.now() - executionStarted;

  const revealedVerifier = revealTrace ? verifier : null;
  const decision = decideWithTrace(revealedVerifier);
  if (decision.stage !== true || decision.reset === decision.commit) {
    throw new Error("Every arm must stage and then choose exactly one of commit or reset.");
  }

  const finalizeStarted = performance.now();
  if (decision.commit) await rename(stagedUnit, durableUnit);
  else await rm(stagedUnit, { recursive: true, force: true });
  const finalizeElapsedMs = performance.now() - finalizeStarted;

  const stageExists = await fileExists(stagedUnit);
  const durableExists = await fileExists(durableUnit);
  const stagedBytesWritten = Buffer.byteLength(jobBody) + Buffer.byteLength(traceBody);
  const filesystem = {
    boundary: "filesystem-stage-execute-finalize-v1",
    trace_revealed: revealTrace,
    trace_output_sha256: sha256(traceBody),
    staged_bytes_written: stagedBytesWritten,
    durable_bytes_written: durableExists ? stagedBytesWritten : 0,
    stage_elapsed_ms: stageElapsedMs,
    temporary_execution_elapsed_ms: temporaryExecutionElapsedMs,
    finalize_elapsed_ms: finalizeElapsedMs,
    boundary_elapsed_ms: performance.now() - boundaryStarted,
    stageExists,
    durableExists,
    rollbackComplete: decision.reset && !stageExists && !durableExists,
    commitComplete: decision.commit && !stageExists && durableExists,
  };
  return { decision, filesystem, revealedVerifier };
}
