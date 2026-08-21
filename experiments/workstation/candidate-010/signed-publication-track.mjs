import {
  createHash,
  createPrivateKey,
  createPublicKey,
  sign,
  verify,
} from "node:crypto";
import { mkdir, readFile, rm, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { performance } from "node:perf_hooks";
import { traceBodyForJob } from "./trace-job.mjs";

const BACKEND_ID = "synthetic-signed-publication-v1";
const TASK_FAMILY = "signed-publication";
const ED25519_PKCS8_SEED_PREFIX = Buffer.from("302e020100300506032b657004220420", "hex");

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
  return String(value).replace(/[^a-zA-Z0-9._-]/g, "_");
}

function privateKeyForPayload(payloadBody) {
  const seed = createHash("sha256")
    .update("20w-candidate-010-synthetic-publication-key-v1\0")
    .update(payloadBody)
    .digest();
  return createPrivateKey({
    key: Buffer.concat([ED25519_PKCS8_SEED_PREFIX, seed]),
    format: "der",
    type: "pkcs8",
  });
}

function signedEnvelope(payloadBody) {
  const privateKey = privateKeyForPayload(payloadBody);
  const publicKey = createPublicKey(privateKey);
  const signature = sign(null, Buffer.from(payloadBody), privateKey);
  const envelope = {
    schema: 1,
    algorithm: "Ed25519",
    payload_sha256: sha256(payloadBody),
    public_key_spki_der_base64: publicKey.export({ format: "der", type: "spki" }).toString("base64"),
    signature_base64: signature.toString("base64"),
  };
  return { envelope, body: `${JSON.stringify(envelope)}\n` };
}

function verifyEnvelope(payloadBody, envelope) {
  if (envelope.algorithm !== "Ed25519" || envelope.payload_sha256 !== sha256(payloadBody)) return false;
  try {
    const publicKey = createPublicKey({
      key: Buffer.from(envelope.public_key_spki_der_base64, "base64"),
      format: "der",
      type: "spki",
    });
    return verify(
      null,
      Buffer.from(payloadBody),
      publicKey,
      Buffer.from(envelope.signature_base64, "base64"),
    );
  } catch {
    return false;
  }
}

async function exclusiveWriteRefusesExisting(file, body) {
  try {
    await writeFile(file, body, { encoding: "utf8", flag: "wx" });
    return false;
  } catch (error) {
    if (error?.code === "EEXIST") return true;
    throw error;
  }
}

export async function executeSignedPublicationTrial({
  root,
  opportunity,
  arm,
  config,
  revealTrace,
  decideWithTrace,
}) {
  const boundaryStarted = performance.now();
  const safeArm = unitName(arm);
  const safeOpportunity = unitName(opportunity.id);
  const stagingParent = path.join(root, "staging", safeArm);
  const stagedUnit = path.join(stagingParent, safeOpportunity);
  const publicationParent = path.join(root, "publication-log", safeArm);
  const publicationPath = path.join(publicationParent, `${safeOpportunity}.json`);

  const stageStarted = performance.now();
  await mkdir(stagingParent, { recursive: true });
  await mkdir(publicationParent, { recursive: true });
  await mkdir(stagedUnit, { recursive: false });

  const payload = {
    schema: 1,
    opportunity_id: opportunity.id,
    payload: opportunity.payload,
    trace_job: opportunity.trace_job,
  };
  const payloadBody = `${JSON.stringify(payload)}\n`;
  const { envelope, body: envelopeBody } = signedEnvelope(payloadBody);
  const payloadPath = path.join(stagedUnit, "payload.json");
  const envelopePath = path.join(stagedUnit, "envelope.json");
  await writeFile(payloadPath, payloadBody, { encoding: "utf8", flag: "wx" });
  await writeFile(envelopePath, envelopeBody, { encoding: "utf8", flag: "wx" });
  const stageElapsedMs = performance.now() - stageStarted;

  const executionStarted = performance.now();
  const stagedPayloadBody = await readFile(payloadPath, "utf8");
  const stagedPayload = JSON.parse(stagedPayloadBody);
  const stagedEnvelope = JSON.parse(await readFile(envelopePath, "utf8"));
  const envelopeValid = verifyEnvelope(stagedPayloadBody, stagedEnvelope);
  if (!envelopeValid) throw new Error("Staged publication envelope failed signature verification.");
  const { verifier, body: traceBody } = traceBodyForJob(stagedPayload, config);
  const tracePath = path.join(stagedUnit, "trace.json");
  await writeFile(tracePath, traceBody, { encoding: "utf8", flag: "wx" });
  const stagedTrace = JSON.parse(await readFile(tracePath, "utf8"));
  if (stagedTrace.verifier !== verifier) throw new Error("Staged publication trace failed verification.");
  const temporaryExecutionElapsedMs = performance.now() - executionStarted;

  const revealedVerifier = revealTrace ? verifier : null;
  const decision = decideWithTrace(revealedVerifier);
  if (decision.stage !== true || decision.reset === decision.commit) {
    throw new Error("Every arm must stage and then choose exactly one of commit or reset.");
  }

  const publication = {
    schema: 1,
    backend_id: BACKEND_ID,
    task_family: TASK_FAMILY,
    payload,
    envelope,
    trace: JSON.parse(traceBody),
  };
  const publicationBody = `${JSON.stringify(publication)}\n`;
  const stagedBytesWritten = Buffer.byteLength(payloadBody)
    + Buffer.byteLength(envelopeBody)
    + Buffer.byteLength(traceBody);

  const finalizeStarted = performance.now();
  let appendOnlyRefusalVerified = false;
  if (decision.commit) {
    await writeFile(publicationPath, publicationBody, { encoding: "utf8", flag: "wx" });
    appendOnlyRefusalVerified = await exclusiveWriteRefusesExisting(publicationPath, publicationBody);
  }
  await rm(stagedUnit, { recursive: true, force: true });
  const finalizeElapsedMs = performance.now() - finalizeStarted;

  const stageExists = await fileExists(stagedUnit);
  const durableExists = await fileExists(publicationPath);
  const durableBody = durableExists ? await readFile(publicationPath, "utf8") : null;
  const durableIntegrityValid = durableBody === null
    ? false
    : verifyEnvelope(
      `${JSON.stringify(JSON.parse(durableBody).payload)}\n`,
      JSON.parse(durableBody).envelope,
    );
  const rollbackComplete = decision.reset && !stageExists && !durableExists;
  const commitComplete = decision.commit
    && !stageExists
    && durableExists
    && durableBody === publicationBody
    && durableIntegrityValid
    && appendOnlyRefusalVerified;
  const irreversibleViolation = decision.reset
    ? !rollbackComplete
    : !commitComplete;

  const filesystem = {
    boundary: "signed-publication-stage-execute-finalize-v1",
    task_family: TASK_FAMILY,
    backend_id: BACKEND_ID,
    trace_revealed: revealTrace,
    payload_sha256: sha256(payloadBody),
    envelope_sha256: sha256(envelopeBody),
    trace_output_sha256: sha256(traceBody),
    publication_sha256: durableBody === null ? null : sha256(durableBody),
    staged_bytes_written: stagedBytesWritten,
    durable_bytes_written: durableBody === null ? 0 : Buffer.byteLength(durableBody),
    stage_elapsed_ms: stageElapsedMs,
    temporary_execution_elapsed_ms: temporaryExecutionElapsedMs,
    finalize_elapsed_ms: finalizeElapsedMs,
    boundary_elapsed_ms: performance.now() - boundaryStarted,
    stageExists,
    durableExists,
    envelopeValid,
    durableIntegrityValid,
    appendOnlyRefusalVerified,
    rollbackComplete,
    commitComplete,
    irreversible_violation: irreversibleViolation,
    physical_actuation: false,
  };
  return {
    decision,
    filesystem,
    revealedVerifier,
    task_family: TASK_FAMILY,
    backend_id: BACKEND_ID,
  };
}
