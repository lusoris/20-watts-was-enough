import { createHash } from "node:crypto";

export const CAPSULE_CONFIRMATION_ENTRY_VERSION = "candidate-010.capsule-confirmation-entry.v1";

export class CapsuleConfirmationEntryError extends Error {
  constructor(code, message) {
    super(message);
    this.name = "CapsuleConfirmationEntryError";
    this.code = `CANDIDATE_010_CAPSULE_CONFIRMATION_${code}`;
  }
}

function refuse(code, message) {
  throw new CapsuleConfirmationEntryError(code, message);
}

function canonical(value) {
  if (value === null || typeof value === "boolean" || typeof value === "string") {
    return JSON.stringify(value);
  }
  if (typeof value === "number" && Number.isFinite(value)) return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(canonical).join(",")}]`;
  if (value && typeof value === "object") {
    return `{${Object.keys(value).sort().map((key) => (
      `${JSON.stringify(key)}:${canonical(value[key])}`
    )).join(",")}}`;
  }
  return refuse("NON_JSON", `Confirmation output contains ${typeof value}.`);
}

function digest(value) {
  return createHash("sha256").update(canonical(value)).digest("hex");
}

function exactObject(value, required, optional, label) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    refuse("REQUEST", `${label} must be an object.`);
  }
  const allowed = new Set([...required, ...optional]);
  const keys = Object.keys(value);
  if (required.some((key) => !keys.includes(key)) || keys.some((key) => !allowed.has(key))) {
    refuse("REQUEST", `${label} has missing or unknown fields.`);
  }
}

function parseConfirmationRequest(envelope) {
  exactObject(
    envelope,
    [
      "schema",
      "contract_version",
      "action",
      "launch_request_sha256",
      "request_nonce_sha256",
      "sanitized_environment_sha256",
      "exec_argv_sha256",
      "parent_pre_verification_sha256",
      "execution_descriptor_sha256",
      "runtime_identity_sha256",
      "confirmation_request_sha256",
      "confirmation_request",
    ],
    [],
    "bound request",
  );
  if (
    envelope.schema !== 1
    || envelope.contract_version !== CAPSULE_CONFIRMATION_ENTRY_VERSION
    || envelope.action !== "candidate-010-confirmation"
    || !/^[0-9a-f]{64}$/.test(envelope.confirmation_request_sha256)
    || envelope.confirmation_request_sha256 !== digest(envelope.confirmation_request)
  ) refuse("REQUEST", "Bound request identity is invalid.");

  const request = envelope.confirmation_request;
  exactObject(
    request,
    ["config", "scenarios", "outputDirectory", "release"],
    ["resume", "stopAfterRecords"],
    "confirmation request",
  );
  if (typeof request.outputDirectory !== "string" || request.outputDirectory.length === 0) {
    refuse("REQUEST", "outputDirectory must be a non-empty string.");
  }
  if (!Array.isArray(request.scenarios) || request.scenarios.length === 0) {
    refuse("REQUEST", "scenarios must be a non-empty array.");
  }
  if (!request.config || typeof request.config !== "object" || Array.isArray(request.config)) {
    refuse("REQUEST", "config must be an object.");
  }
  exactObject(
    request.release,
    ["bindingRoot", "releasePath", "disjointWith"],
    [],
    "release",
  );
  if (request.resume !== undefined && typeof request.resume !== "boolean") {
    refuse("REQUEST", "resume must be boolean when supplied.");
  }
  if (
    request.stopAfterRecords !== undefined
    && (!Number.isSafeInteger(request.stopAfterRecords) || request.stopAfterRecords < 1)
  ) refuse("REQUEST", "stopAfterRecords must be a positive integer when supplied.");
  if (Object.hasOwn(request, "seeds") || Object.hasOwn(request.config, "seeds")) {
    refuse("RAW_SEEDS", "Raw confirmation seeds are forbidden.");
  }
  return request;
}

function assertJsonSafe(value, label) {
  try {
    canonical(value);
  } catch (error) {
    refuse("NON_JSON", `${label} is not canonical JSON: ${error.message}`);
  }
  return value;
}

export async function executeCandidate010Confirmation({
  request: envelope,
  capability,
  executionCapsule,
  expectedSourceBundle,
} = {}) {
  if (!capability || !executionCapsule || !expectedSourceBundle) {
    refuse("AUTHORITY", "Capability, execution capsule, and source bundle are required.");
  }
  const request = parseConfirmationRequest(envelope);
  const launchProvenance = Object.freeze({
    launch_request_sha256: envelope.launch_request_sha256,
    request_nonce_sha256: envelope.request_nonce_sha256,
    sanitized_environment_sha256: envelope.sanitized_environment_sha256,
    exec_argv_sha256: envelope.exec_argv_sha256,
    parent_pre_verification_sha256: envelope.parent_pre_verification_sha256,
  });
  if (!Object.values(launchProvenance).every((value) => /^[0-9a-f]{64}$/.test(value))) {
    refuse("REQUEST", "Launch provenance hashes are invalid.");
  }

  // This literal capsule-relative import occurs only after the child has
  // verified the complete source/dependency/runtime descriptor and acquired
  // callback-scoped execution authority.
  const {
    analyzeFactorialRun,
    runFactorialExperiment,
    validateFactorialRun,
  } = await import("./factorial-runner.mjs");
  if (
    typeof runFactorialExperiment !== "function"
    || typeof validateFactorialRun !== "function"
    || typeof analyzeFactorialRun !== "function"
  ) refuse("RUNNER_API", "The fixed factorial runner API is incomplete.");

  const authorityOptions = {
    executionAuthority: capability,
    executionCapsule,
    expectedSourceBundle,
    launchProvenance,
  };
  const runResult = await runFactorialExperiment({
    config: request.config,
    scenarios: request.scenarios,
    outputDirectory: request.outputDirectory,
    executionMode: "confirmation",
    release: request.release,
    ...authorityOptions,
    resume: request.resume ?? false,
    stopAfterRecords: request.stopAfterRecords ?? null,
  });
  if (runResult?.complete !== true) {
    refuse("INCOMPLETE", "Confirmation run did not complete; validation and analysis were not accepted.");
  }

  const validationDocument = assertJsonSafe(
    await validateFactorialRun(request.outputDirectory, authorityOptions),
    "validation document",
  );
  if (validationDocument?.valid !== true) {
    refuse("VALIDATION", "Completed confirmation output failed validation.");
  }
  const summary = assertJsonSafe(
    await analyzeFactorialRun(request.outputDirectory, authorityOptions),
    "analysis summary",
  );
  const validationSha256 = digest(validationDocument);
  const analysisSha256 = digest(summary);

  return {
    complete: true,
    validation: {
      valid: true,
      document: validationDocument,
      document_sha256: validationSha256,
    },
    result: {
      run_sha256: digest(assertJsonSafe(runResult.run, "run metadata")),
      validation_sha256: validationSha256,
      analysis_sha256: analysisSha256,
      summary,
    },
  };
}
