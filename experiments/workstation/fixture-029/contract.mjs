import { createHash } from "node:crypto";

import { FIXTURE_029_ARMS, FIXTURE_029_FAMILIES } from "./generator.mjs";

export const FIXTURE_029_EVENT_CONTRACT_VERSION = "fixture-029.cmb-x04-event.v3";
export const FIXTURE_029_INTERPRETATION = "NO_RESULT: deterministic public-development CMB-X04 phase-preservation/release smoke diagnostic and integrity plumbing only.";

const INPUT_HASH_KEYS = [
  "audit", "fixture", "contract", "generator", "runner", "schema", "configuration", "seed_pack",
];
const PUBLIC_KEYS = [
  "artifact_type", "artifact_version", "artifact_bytes", "transit_stages", "deadline_steps",
  "maximum_simultaneous_copies", "maximum_lifetime_copies", "maximum_retries",
  "checksum_supported", "source_reload_available", "approved_source_available",
  "wrapper_registry_match", "wrapper_state_bytes", "release_cue_type",
];
const PARAMETER_KEYS = [
  "artifact_bytes", "wrapper_state_bytes", "transit_stages", "transit_hazard_per_stage",
  "latent_compatible", "association_strength", "stabilization_fraction", "release_probability",
  "release_cue_valid", "useful_lifetime_steps", "deadline_steps",
];
const OUTCOME_KEYS = [
  "artifacts_attempted", "artifacts_active", "artifacts_bound", "artifacts_lost",
  "artifacts_invalid", "copies_created", "copies_transported", "copies_intact",
  "copies_lost", "copies_active", "copies_bound", "copies_invalid", "copies_destroyed",
  "retried", "replicated", "reloaded", "rebuilt", "integrity_failures", "false_releases",
  "missed_release_deadlines", "bound_active_impossible", "accepted_service_nsu",
  "active_artifact_steps", "activation_latency_p95_steps",
];
const RESOURCE_KEYS = [
  "logical_operations", "transported_bytes", "wrapper_state_bytes_created", "wrapper_byte_steps",
  "validation_operations", "retry_operations", "replication_operations", "reload_operations",
  "rebuild_operations", "wrapper_construction_operations", "compatibility_check_operations",
  "release_operations", "cleanup_operations", "bytes_read", "transport_bytes_written",
  "reconstruction_bytes_written", "bytes_written",
  "retained_state_byte_steps",
];
const GATE_KEYS = [
  "information_parity", "action_authority_parity", "task_gate_pass", "protected_gate_pass",
  "copy_conservation_pass", "artifact_conservation_pass", "resource_ledger_complete",
  "resource_gate_pass",
];

export function canonical(value) {
  if (value === null || typeof value === "boolean" || typeof value === "string") return JSON.stringify(value);
  if (typeof value === "number" && Number.isFinite(value)) return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(canonical).join(",")}]`;
  if (value && typeof value === "object") {
    return `{${Object.keys(value).sort().map((key) => {
      if (value[key] === undefined) throw new TypeError(`Undefined canonical field ${key}.`);
      return `${JSON.stringify(key)}:${canonical(value[key])}`;
    }).join(",")}}`;
  }
  throw new TypeError(`Unsupported canonical value ${typeof value}.`);
}

export function sha256(value) {
  return createHash("sha256").update(value).digest("hex");
}

function exactKeys(value, keys) {
  return value && typeof value === "object" && !Array.isArray(value)
    && canonical(Object.keys(value).sort()) === canonical([...keys].sort());
}

function count(value) {
  return Number.isSafeInteger(value) && value >= 0;
}

function probability(value) {
  return typeof value === "number" && Number.isFinite(value) && value >= 0 && value <= 1;
}

export function fixture029ScientificPayload(record) {
  const payload = { ...record };
  delete payload.integrity;
  return payload;
}

export function fixture029WorkKey(record) {
  return `${record.seed}:${record.world_index}:${record.arm}`;
}

export function assertFixture029Record(record, {
  sequence = null, previousHash = null, runId = null, profile = null, inputSha256 = null,
} = {}) {
  const fields = [
    "schema", "contract_version", "artifact", "track", "claim_scope", "run_id", "profile",
    "pack", "seed", "world_index", "world_id", "arm", "attempt", "units", "input_sha256",
    "generator_family", "public_contract", "policy_input_sha256", "policy_action_sha256",
    "policy_oracle_access", "evaluator_opened_after_action", "action_authority",
    "evaluator_parameters", "counterfactual_draw_domain", "mechanism", "outcomes", "resources", "gates",
    "process_metadata", "maximum_simultaneous_copies_observed",
    "maximum_lifetime_copies_observed", "status", "result_label", "no_result",
    "measured_energy_present", "energy_conclusion_allowed", "claim_eligible",
    "comparison_inference_permitted", "scientific_result", "performance_result",
    "interpretation", "integrity",
  ];
  const expectedSequence = sequence ?? record?.integrity?.sequence;
  const expectedPrevious = previousHash ?? record?.integrity?.previous_sha256;
  const expectedHash = sha256(`${expectedPrevious}\n${canonical(fixture029ScientificPayload(record))}`);
  const o = record?.outcomes ?? {};
  const r = record?.resources ?? {};
  const g = record?.gates ?? {};
  const p = record?.evaluator_parameters ?? {};
  const publicContract = record?.public_contract ?? {};
  const copyConservation = o.copies_created === o.copies_lost + o.copies_active
    + o.copies_bound + o.copies_invalid + o.copies_destroyed;
  const artifactConservation = o.artifacts_attempted === o.artifacts_active
    + o.artifacts_bound + o.artifacts_lost + o.artifacts_invalid;
  const transportedPayloadBytes = o.copies_transported * publicContract.artifact_bytes;
  const transportedWrapperBytes = r.wrapper_state_bytes_created;
  const reconstructedArtifactBytes = o.rebuilt * publicContract.artifact_bytes;
  const wrapperCopiesCreated = transportedWrapperBytes / publicContract.wrapper_state_bytes;
  const resourcesComplete = RESOURCE_KEYS.every((key) => count(r[key]))
    && Number.isSafeInteger(transportedPayloadBytes)
    && Number.isSafeInteger(reconstructedArtifactBytes)
    && Number.isSafeInteger(wrapperCopiesCreated)
    && wrapperCopiesCreated <= o.copies_transported
    && r.retry_operations === o.retried
    && r.replication_operations === o.replicated
    && r.reload_operations === o.reloaded
    && r.rebuild_operations === o.rebuilt
    && r.wrapper_construction_operations === wrapperCopiesCreated
    && r.compatibility_check_operations === wrapperCopiesCreated
    && r.transported_bytes === transportedPayloadBytes + transportedWrapperBytes
    && r.transport_bytes_written === r.transported_bytes
    && r.reconstruction_bytes_written === reconstructedArtifactBytes
    && r.bytes_written === r.transport_bytes_written + r.reconstruction_bytes_written
    && r.bytes_read >= transportedPayloadBytes
    && r.wrapper_byte_steps >= transportedWrapperBytes * publicContract.transit_stages;
  const authorityParity = record?.maximum_simultaneous_copies_observed <= publicContract.maximum_simultaneous_copies
    && record?.maximum_lifetime_copies_observed <= publicContract.maximum_lifetime_copies;
  const taskGate = o.artifacts_attempted > 0 && p.useful_lifetime_steps > 0
    && o.accepted_service_nsu / (o.artifacts_attempted * p.useful_lifetime_steps) >= 0.25;
  const protectedGate = o.integrity_failures === 0 && o.false_releases === 0
    && (o.activation_latency_p95_steps === null || o.activation_latency_p95_steps <= 9);
  if (
    !exactKeys(record, fields)
    || !exactKeys(record.units, ["artifact", "service", "time", "bytes", "energy"])
    || !exactKeys(record.input_sha256, INPUT_HASH_KEYS)
    || !exactKeys(record.public_contract, PUBLIC_KEYS)
    || !exactKeys(record.evaluator_parameters, PARAMETER_KEYS)
    || !exactKeys(record.mechanism, [
      "transit_hazard_present", "release_enabled", "wrapper_compatible",
      "release_cue_valid", "short_lifetime",
    ])
    || !exactKeys(record.outcomes, OUTCOME_KEYS)
    || !exactKeys(record.resources, RESOURCE_KEYS)
    || !exactKeys(record.gates, GATE_KEYS)
    || !exactKeys(record.process_metadata, [
      "execution_model", "maximum_concurrency", "per_arm_cpu_time_measured",
      "per_arm_wall_time_measured", "per_arm_peak_memory_measured", "measurement_boundary",
    ])
    || !exactKeys(record.integrity, ["sequence", "previous_sha256", "record_sha256"])
    || record.schema !== 1 || record.contract_version !== FIXTURE_029_EVENT_CONTRACT_VERSION
    || record.artifact !== "fixture-029" || record.track !== "CMB-X04"
    || canonical(record.claim_scope) !== canonical(["C-1580"])
    || !/^[0-9a-f]{64}$/u.test(record.run_id) || (runId !== null && record.run_id !== runId)
    || !new Set(["smoke", "development"]).has(record.profile)
    || (profile !== null && record.profile !== profile) || record.pack !== "public-development"
    || !count(record.seed) || record.seed > 0xffff_ffff || !count(record.world_index)
    || !/^[0-9a-f]{64}$/u.test(record.world_id) || !FIXTURE_029_ARMS.includes(record.arm)
    || record.attempt !== 0
    || canonical(record.units) !== canonical({ artifact: "artifact", service: "NSU", time: "step", bytes: "B", energy: "not-measured" })
    || Object.values(record.input_sha256).some((value) => !/^[0-9a-f]{64}$/u.test(value))
    || (inputSha256 !== null && canonical(record.input_sha256) !== canonical(inputSha256))
    || !FIXTURE_029_FAMILIES.includes(record.generator_family)
    || publicContract.artifact_type !== "typed-compiled-module" || publicContract.artifact_version !== 1
    || !count(publicContract.artifact_bytes) || publicContract.artifact_bytes === 0
    || !count(publicContract.wrapper_state_bytes) || publicContract.wrapper_state_bytes === 0
    || !count(publicContract.transit_stages) || publicContract.transit_stages === 0
    || !count(publicContract.deadline_steps) || publicContract.maximum_simultaneous_copies !== 2
    || publicContract.maximum_lifetime_copies !== 3 || publicContract.maximum_retries !== 2
    || publicContract.checksum_supported !== true || publicContract.source_reload_available !== true
    || publicContract.approved_source_available !== true || publicContract.wrapper_registry_match !== true
    || publicContract.release_cue_type !== "destination-load-complete-v1"
    || !/^[0-9a-f]{64}$/u.test(record.policy_input_sha256)
    || !/^[0-9a-f]{64}$/u.test(record.policy_action_sha256)
    || record.policy_oracle_access !== (record.arm === "X04-ORACLE")
    || record.evaluator_opened_after_action !== true
    || record.action_authority !== "validate-retry-replicate-reload-rebuild-wrap-release-with-declared-limits"
    || record.counterfactual_draw_domain !== "F029/seed/world/artifact/stream/attempt; arm-excluded"
    || p.artifact_bytes !== publicContract.artifact_bytes || p.wrapper_state_bytes !== publicContract.wrapper_state_bytes
    || p.transit_stages !== publicContract.transit_stages || p.deadline_steps !== publicContract.deadline_steps
    || !probability(p.transit_hazard_per_stage) || typeof p.latent_compatible !== "boolean"
    || !probability(p.association_strength) || !probability(p.stabilization_fraction)
    || !probability(p.release_probability) || typeof p.release_cue_valid !== "boolean"
    || !count(p.useful_lifetime_steps) || Object.values(record.mechanism).some((value) => typeof value !== "boolean")
    || OUTCOME_KEYS.filter((key) => key !== "activation_latency_p95_steps").some((key) => !count(o[key]))
    || (o.activation_latency_p95_steps !== null && !count(o.activation_latency_p95_steps))
    || o.accepted_service_nsu !== o.active_artifact_steps || o.bound_active_impossible !== 0
    || o.copies_transported !== o.copies_created || o.copies_intact + o.copies_lost !== o.copies_created
    || o.artifacts_active > o.artifacts_attempted || o.artifacts_invalid > o.artifacts_attempted
    || !resourcesComplete
    || Object.values(g).some((value) => typeof value !== "boolean")
    || g.information_parity !== (record.arm !== "X04-ORACLE")
    || g.action_authority_parity !== authorityParity || g.task_gate_pass !== taskGate
    || g.protected_gate_pass !== protectedGate || g.copy_conservation_pass !== copyConservation
    || g.artifact_conservation_pass !== artifactConservation || g.resource_ledger_complete !== resourcesComplete
    || g.resource_gate_pass !== (resourcesComplete && copyConservation && artifactConservation && authorityParity)
    || record.process_metadata.execution_model !== "single-process-deterministic-event-simulation"
    || record.process_metadata.maximum_concurrency !== 1
    || record.process_metadata.per_arm_cpu_time_measured !== false
    || record.process_metadata.per_arm_wall_time_measured !== false
    || record.process_metadata.per_arm_peak_memory_measured !== false
    || record.process_metadata.measurement_boundary !== "process timing and peak memory are outside comparative smoke endpoints"
    || !count(record.maximum_simultaneous_copies_observed) || !count(record.maximum_lifetime_copies_observed)
    || record.status !== "development-smoke-only" || record.result_label !== "NO_RESULT"
    || record.no_result !== true || record.measured_energy_present !== false
    || record.energy_conclusion_allowed !== false || record.claim_eligible !== false
    || record.comparison_inference_permitted !== false || record.scientific_result !== false
    || record.performance_result !== false || record.interpretation !== FIXTURE_029_INTERPRETATION
    || !count(record.integrity.sequence) || record.integrity.sequence !== expectedSequence
    || !/^[0-9a-f]{64}$/u.test(record.integrity.previous_sha256)
    || record.integrity.previous_sha256 !== expectedPrevious
    || !/^[0-9a-f]{64}$/u.test(record.integrity.record_sha256)
    || record.integrity.record_sha256 !== expectedHash
    || (record.arm === "X04-PERSIST" && (o.artifacts_active !== 0 || r.release_operations !== 0))
    || (new Set(["X04-NONE", "X04-RETRY", "X04-REPLICA", "X04-RELOAD", "X04-REBUILD"]).has(record.arm)
      && (r.wrapper_state_bytes_created !== 0 || r.wrapper_byte_steps !== 0 || r.release_operations !== 0))
    || (record.arm === "X04-REPLICA" && (record.maximum_simultaneous_copies_observed !== 2 || o.replicated === 0))
    || (record.arm !== "X04-REPLICA" && record.maximum_simultaneous_copies_observed !== 1)
  ) throw new Error("Fixture 029 event violates the frozen runtime contract.");
  return record;
}
