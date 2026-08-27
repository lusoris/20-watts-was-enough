import { canonicalize, sha256Hex } from "../lib/checkpoint-ledger.mjs";
import {
  assertFixture026RsdT02FixedInstanceRunArtifact,
} from "./rsd-t02-fixed-instance-runner.mjs";
import {
  FIXTURE_026_RSD_T02_CAUSAL_TRANSCRIPT_VERSION,
  FIXTURE_026_RSD_T02_NULL_PROTOTYPE_VERSION,
  assertFixture026RsdT02CausalTranscript,
  assertFixture026RsdT02NullPrototypeModel,
  runFixture026RsdT02NullPrototype,
} from "./rsd-t02-null-prototypes.mjs";

export const FIXTURE_026_RSD_T02_NULL_PROTOTYPE_ADAPTER_VERSION =
  "fixture-026.rsd-t02-null-prototype-adapter.v1";
export const FIXTURE_026_RSD_T02_NULL_PROTOTYPE_ADAPTER_LIMITATION =
  "source-runner-is-built-in-digest-abstention-conformance-only;prototype-runs-post-validation-not-inside-runner-executor";

const RUN_REQUEST_KEYS = Object.freeze([
  "config", "registry", "instance", "run_artifact", "model",
]);
const CONVERT_REQUEST_KEYS = Object.freeze([
  "config", "registry", "instance", "run_artifact",
]);
const TRANSCRIPT_ROOT_KEYS = Object.freeze([
  "schema", "contract_version", "artifact", "track", "partition", "units", "episodes",
]);
const EPISODE_KEYS = Object.freeze(["episode_ordinal", "samples"]);
const SAMPLE_KEYS = Object.freeze([
  "ordinal", "time_s", "input_a_u", "input_b_u", "active_channel",
  "reported_output", "output_clamped", "state_reset_applied", "state_freeze_active",
]);

function exactKeys(value, keys) {
  return value
    && typeof value === "object"
    && !Array.isArray(value)
    && Object.keys(value).length === keys.length
    && keys.every((key) => Object.hasOwn(value, key));
}

function refuse(message) {
  throw new Error(`Fixture 026 RSD-T02 null-prototype adapter refused: ${message}`);
}

function digest(value) {
  try {
    return sha256Hex(canonicalize(value));
  } catch {
    refuse("source or output is not canonically serializable");
  }
}

function deepFreeze(value) {
  if (value && typeof value === "object" && !Object.isFrozen(value)) {
    Object.freeze(value);
    for (const child of Object.values(value)) deepFreeze(child);
  }
  return value;
}

function recursiveKeys(value, target = []) {
  if (Array.isArray(value)) {
    for (const child of value) recursiveKeys(child, target);
  } else if (value && typeof value === "object") {
    for (const [key, child] of Object.entries(value)) {
      target.push(key);
      recursiveKeys(child, target);
    }
  }
  return target;
}

function validateSource({ config, registry, instance, run_artifact: runArtifact }) {
  assertFixture026RsdT02FixedInstanceRunArtifact({
    config,
    registry,
    instance,
    artifact: runArtifact,
  });
  if (
    !["partial", "complete"].includes(runArtifact.status)
    || runArtifact.policy_view === null
    || runArtifact.policy_view_sha256 === null
    || config.policy_mode !== "deterministic-causal-view-digest-abstention-conformance-v1"
  ) refuse("source run has no validated causal policy view or exceeds digest-abstention scope");
  if (digest(runArtifact.policy_view) !== runArtifact.policy_view_sha256) {
    refuse("source policy-view hash is false");
  }
  return runArtifact;
}

function convertValidatedPolicyView(config, runArtifact) {
  const transcript = {
    schema: 1,
    contract_version: FIXTURE_026_RSD_T02_CAUSAL_TRANSCRIPT_VERSION,
    artifact: "fixture-026",
    track: "RSD-T02",
    partition: "public-development",
    units: { ...runArtifact.policy_view.units },
    episodes: runArtifact.policy_view.projections.map((projection) => ({
      episode_ordinal: projection.ordinal,
      samples: projection.samples.map((sample) => ({ ...sample })),
    })),
  };
  if (
    !exactKeys(transcript, TRANSCRIPT_ROOT_KEYS)
    || transcript.episodes.some((episode) => (
      !exactKeys(episode, EPISODE_KEYS)
      || episode.samples.some((sample) => !exactKeys(sample, SAMPLE_KEYS))
    ))
  ) refuse("converted transcript is not an exact causal-field projection");
  const forbidden = new Set([
    "schedule",
    ...config.policy_view_contract.forbidden_recursive_fields,
  ]);
  if (recursiveKeys(transcript).some((key) => forbidden.has(key))) {
    refuse("converted transcript retains schedule, identity, truth, or provenance fields");
  }
  const serialized = canonicalize(transcript);
  for (const sourceIdentity of [
    runArtifact.run_id,
    runArtifact.instance_id,
    runArtifact.fixed_packet_id,
    runArtifact.input_artifact_sha256,
    runArtifact.transcript_set_sha256,
    runArtifact.policy_view_sha256,
  ]) {
    if (
      typeof sourceIdentity === "string"
      && serialized.includes(JSON.stringify(sourceIdentity))
    ) refuse("converted transcript retains a source identity value");
  }
  assertFixture026RsdT02CausalTranscript(transcript);
  return deepFreeze(transcript);
}

export function buildFixture026RsdT02NullPrototypeTranscript(request) {
  if (!exactKeys(request, CONVERT_REQUEST_KEYS)) refuse("conversion request is not closed");
  const source = validateSource(request);
  return convertValidatedPolicyView(request.config, source);
}

export function runFixture026RsdT02NullPrototypeAdapter(request) {
  if (!exactKeys(request, RUN_REQUEST_KEYS)) refuse("adapter request is not closed");
  const source = validateSource(request);
  const model = assertFixture026RsdT02NullPrototypeModel(request.model);
  const transcript = convertValidatedPolicyView(request.config, source);
  const prototypeResponse = runFixture026RsdT02NullPrototype({ model, transcript });
  if (
    prototypeResponse.maturity_level !== 2
    || prototypeResponse.calibration_status !== "uncalibrated"
    || prototypeResponse.result_label !== "NO_RESULT"
    || prototypeResponse.no_result !== true
  ) refuse("prototype response exceeds level-two NO_RESULT authority");
  const sourceBindings = {
    fixed_instance_run_sha256: digest(source),
    policy_view_sha256: source.policy_view_sha256,
    policy_view_utf8_bytes: source.policy_view_utf8_bytes,
    null_prototype_model_sha256: model.model_sha256,
    converted_transcript_sha256: digest(transcript),
  };
  const body = {
    schema: 1,
    contract_version: FIXTURE_026_RSD_T02_NULL_PROTOTYPE_ADAPTER_VERSION,
    artifact: "fixture-026",
    track: "RSD-T02",
    adapter_status: "completed-post-validation",
    source_runner_policy_mode: request.config.policy_mode,
    source_runner_capability: "built-in-causal-view-digest-abstention-conformance-only",
    executor_integration_status: "not-integrated-post-validation-adapter-only",
    limitation: FIXTURE_026_RSD_T02_NULL_PROTOTYPE_ADAPTER_LIMITATION,
    null_prototype_contract_version: FIXTURE_026_RSD_T02_NULL_PROTOTYPE_VERSION,
    arm_id: model.arm_id,
    maturity_level: 2,
    maturity_status: "trainable-public-prototype",
    mature_null_gate_satisfied: false,
    source_bindings: sourceBindings,
    converted_transcript: transcript,
    prototype_response: prototypeResponse,
    authority: "public-development-post-run-adapter-conformance-only",
    comparison_inference_permitted: false,
    claim_eligible: false,
    result_label: "NO_RESULT",
    no_result: true,
  };
  return deepFreeze({ ...body, adapter_sha256: digest(body) });
}
