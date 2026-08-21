import { createHash } from "node:crypto";
import { mkdir, readFile, rename, rm, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { performance } from "node:perf_hooks";
import { traceBodyForJob } from "./trace-job.mjs";

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
  const { verifier, body: traceBody } = traceBodyForJob(stagedJob, config);
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
    task_family: "filesystem-publish",
    backend_id: "filesystem-stage-execute-finalize-v1",
    backend_implemented: true,
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
    irreversible_violation: false,
    physical_actuation: false,
  };
  return { decision, filesystem, revealedVerifier };
}
