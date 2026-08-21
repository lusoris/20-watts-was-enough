import { executeActuatorCommandTrial } from "./actuator-command-track.mjs";
import { executeFilesystemTrial } from "./filesystem-track.mjs";
import { executeSignedPublicationTrial } from "./signed-publication-track.mjs";
import { executeTransactionalKvTrial } from "./transactional-kv-track.mjs";

function definition(taskFamily, backendId, adapterFilename, adapter) {
  return Object.freeze({
    task_family: taskFamily,
    backend_id: backendId,
    adapter_filename: adapterFilename,
    implemented: true,
    physical_actuation: false,
    adapter,
  });
}

export const BACKEND_REGISTRY = Object.freeze({
  "filesystem-publish": definition(
    "filesystem-publish",
    "filesystem-stage-execute-finalize-v1",
    "filesystem-track.mjs",
    executeFilesystemTrial,
  ),
  "transactional-kv": definition(
    "transactional-kv",
    "local-versioned-transactional-kv-v1",
    "transactional-kv-track.mjs",
    executeTransactionalKvTrial,
  ),
  "signed-publication": definition(
    "signed-publication",
    "synthetic-signed-publication-v1",
    "signed-publication-track.mjs",
    executeSignedPublicationTrial,
  ),
  "actuator-command": definition(
    "actuator-command",
    "isolated-actuator-command-v1",
    "actuator-command-track.mjs",
    executeActuatorCommandTrial,
  ),
});

export const BACKEND_METADATA = Object.freeze(Object.values(BACKEND_REGISTRY).map((entry) => (
  Object.freeze({
    task_family: entry.task_family,
    backend_id: entry.backend_id,
    adapter_filename: entry.adapter_filename,
    implemented: entry.implemented,
    physical_actuation: entry.physical_actuation,
  })
)));

export function backendForTaskFamily(taskFamily) {
  const entry = BACKEND_REGISTRY[taskFamily];
  if (!entry) throw new Error(`Unknown Candidate 010 task family: ${taskFamily}`);
  if (entry.task_family !== taskFamily) {
    throw new Error(`Candidate 010 backend registry mismatch for task family: ${taskFamily}`);
  }
  return entry;
}

export function validateBackendResult(taskFamily, result) {
  const entry = backendForTaskFamily(taskFamily);
  if (
    result?.filesystem?.task_family !== entry.task_family
    || result.filesystem.backend_id !== entry.backend_id
  ) {
    throw new Error(`Candidate 010 adapter contract mismatch for task family: ${taskFamily}`);
  }
  if (entry.physical_actuation === false && result.filesystem.physical_actuation !== false) {
    throw new Error(
      `Candidate 010 adapter must explicitly declare physical_actuation false: ${taskFamily}`,
    );
  }
  return result;
}

export async function executeBackendTrial({
  task_family: taskFamily,
  backend_id: requestedBackendId,
  root,
  opportunity,
  arm,
  config,
  revealTrace,
  decideWithTrace,
}) {
  const entry = backendForTaskFamily(taskFamily);
  if (opportunity?.task_family && opportunity.task_family !== taskFamily) {
    throw new Error(
      `Candidate 010 task-family mismatch: requested ${taskFamily}, opportunity declares ${opportunity.task_family}`,
    );
  }
  if (requestedBackendId && requestedBackendId !== entry.backend_id) {
    throw new Error(
      `Candidate 010 backend mismatch for ${taskFamily}: expected ${entry.backend_id}, received ${requestedBackendId}`,
    );
  }

  const result = await entry.adapter({
    root,
    opportunity,
    arm,
    config,
    revealTrace,
    decideWithTrace,
  });
  return validateBackendResult(taskFamily, result);
}
