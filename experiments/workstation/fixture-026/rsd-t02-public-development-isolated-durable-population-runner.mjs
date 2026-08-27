import { createHash } from "node:crypto";
import { readdir } from "node:fs/promises";
import path from "node:path";

import { canonicalize, sha256Hex } from "../lib/checkpoint-ledger.mjs";
import {
  assertFixture026RsdT02SafeOutputDirectoryIdentity,
  openFixture026RsdT02BoundedCheckpointLedger,
  prepareFixture026RsdT02SafeOutputDirectory,
} from "./rsd-t02-fixed-instance-durable-store.mjs";
import {
  FIXTURE_026_RSD_T02_FIXED_INSTANCE_DURABLE_SUMMARY_VERSION,
  FIXTURE_026_RSD_T02_FIXED_INSTANCE_ISOLATED_DURABLE_CONFIG_SHA256,
  FIXTURE_026_RSD_T02_FIXED_INSTANCE_ISOLATED_DURABLE_CONFIG_VERSION,
  assertFixture026RsdT02FixedInstanceIsolatedDurableConfig,
  openFixture026RsdT02FixedInstanceIsolatedDurableRun,
} from "./rsd-t02-fixed-instance-isolated-durable-runner.mjs";
import {
  FIXTURE_026_RSD_T02_FIXED_INSTANCE_RUNNER_CONFIG_SHA256,
  assertFixture026RsdT02FixedInstanceRunnerConfig,
} from "./rsd-t02-fixed-instance-runner.mjs";
import {
  FIXTURE_026_RSD_T02_POPULATION_DESIGN_SHA256,
  assertFixture026RsdT02PopulationDesign,
} from "./rsd-t02-population-contract.mjs";
import {
  FIXTURE_026_RSD_T02_PUBLIC_DEVELOPMENT_POPULATION_RECORD_VERSION,
  FIXTURE_026_RSD_T02_PUBLIC_DEVELOPMENT_POPULATION_RUNNER_CONFIG_SHA256,
  FIXTURE_026_RSD_T02_PUBLIC_DEVELOPMENT_POPULATION_RUNNER_VERSION,
  assertFixture026RsdT02PublicDevelopmentPopulationRunnerConfig,
  runFixture026RsdT02PublicDevelopmentPopulation,
} from "./rsd-t02-public-development-population-runner.mjs";
import { acquireFixture026RsdT02RunLock } from "./rsd-t02-run-lock.mjs";
import {
  FIXTURE_026_RSD_T02_DEVELOPMENT_PLAN_SHA256,
  FIXTURE_026_RSD_T02_FAMILY_REGISTRY_SHA256,
  assertFixture026RsdT02DevelopmentInstancePlan,
  assertFixture026RsdT02DevelopmentPanel,
  assertFixture026RsdT02SystemFamilyRegistry,
  generateFixture026RsdT02DevelopmentPanel,
} from "./rsd-t02-system-family-generator.mjs";

export const FIXTURE_026_RSD_T02_PUBLIC_DEVELOPMENT_ISOLATED_DURABLE_POPULATION_CONFIG_VERSION =
  "fixture-026.rsd-t02-public-development-isolated-durable-population-config.v1";
export const FIXTURE_026_RSD_T02_PUBLIC_DEVELOPMENT_ISOLATED_DURABLE_POPULATION_CONFIG_SHA256 =
  "d123f5fea68b2a38839b0eca9b1aa8ea82a6abeab568f1aa6354240f57341f66";
export const FIXTURE_026_RSD_T02_PUBLIC_DEVELOPMENT_ISOLATED_DURABLE_POPULATION_LEDGER_VERSION =
  "fixture-026.rsd-t02-public-development-isolated-durable-population-ledger.v1";
export const FIXTURE_026_RSD_T02_PUBLIC_DEVELOPMENT_ISOLATED_DURABLE_POPULATION_SUMMARY_VERSION =
  "fixture-026.rsd-t02-public-development-isolated-durable-population-summary.v1";

const HASH_PATTERN = /^[0-9a-f]{64}$/u;
const MAX_OWNER_ID_BYTES = 1024;
const REQUEST_KEYS = Object.freeze([
  "config", "population_config", "population_design", "registry", "plan",
  "fixed_instance_runner_config", "fixed_instance_isolated_durable_config",
  "output_directory", "owner_id",
]);
const CONFIG_KEYS = Object.freeze([
  "schema", "contract_version", "artifact", "track", "partition", "authority",
  "population_runner_binding", "fixed_instance_isolated_durable_binding",
  "population_contract", "durability", "execution", "comparison_inference_permitted",
  "claim_eligible", "result_label",
]);
const COMPACT_RECEIPT_KEYS = Object.freeze([
  "contract_version", "population_run_id", "sequence", "source_population_record_sha256",
  "family_id", "instance_id", "parameter_vector_sha256", "fixed_time_constant",
  "fixed_packet_id", "transcript_set_sha256", "causal_policy_view_sha256",
  "causal_policy_view_utf8_bytes", "fixed_instance_run_id", "fixed_instance_run_sha256",
  "workload_sha256", "result_label",
]);
const DURABLE_SUMMARY_KEYS = Object.freeze([
  "schema", "contract_version", "status", "run_id", "owner_identity_sha256",
  "fixed_instance_runner_config_sha256", "isolated_durable_config_sha256",
  "policy_bundle_sha256", "worker_sha256", "policy_view_sha256",
  "isolated_execution_receipt_sha256", "records", "registered_arms", "next_arm_index",
  "scientific_payload_sha256", "hash_chain_sha256", "checkpoint_status",
  "foundation_gates", "authority", "comparison_inference_permitted", "claim_eligible",
  "result_label", "no_result",
]);
const OUTER_RECORD_KEYS = Object.freeze([
  "schema", "contract_version", "population_run_id", "owner_identity_sha256",
  "sequence", "instance_directory", "instance_id", "compact_population_receipt",
  "isolated_durable_summary", "isolated_durable_summary_sha256",
  "full_causal_payload_retained", "endpoint_aggregation_executed",
  "model_comparison_executed", "authority", "comparison_inference_permitted",
  "claim_eligible", "result_label", "no_result", "integrity",
]);
const SUMMARY_KEYS = Object.freeze([
  "schema", "contract_version", "status", "population_run_id", "owner_identity_sha256",
  "output_root_identity_sha256", "integrated_config_sha256",
  "population_runner_config_sha256", "fixed_instance_isolated_durable_config_sha256",
  "population_artifact_sha256", "records", "registered_instances", "next_instance_index",
  "scientific_payload_sha256", "hash_chain_sha256", "checkpoint_status",
  "full_causal_payload_retained_in_outer_ledger", "endpoint_aggregation_executed",
  "model_comparison_executed", "authority", "comparison_inference_permitted",
  "claim_eligible", "result_label", "no_result",
]);
const populationArtifactCache = new Map();

function exactKeys(value, keys) {
  return value !== null
    && typeof value === "object"
    && !Array.isArray(value)
    && Object.keys(value).length === keys.length
    && keys.every((key) => Object.hasOwn(value, key));
}

function refuse(message) {
  throw new Error(`Fixture 026 RSD-T02 isolated durable population runner refused: ${message}`);
}

function digest(value) {
  try {
    return sha256Hex(canonicalize(value));
  } catch {
    refuse("input or output is not canonically serializable");
  }
}

function sha256(value) {
  return createHash("sha256").update(value).digest("hex");
}

function deepFreeze(value) {
  if (value && typeof value === "object" && !Object.isFrozen(value)) {
    Object.freeze(value);
    for (const child of Object.values(value)) deepFreeze(child);
  }
  return value;
}

function immutableCopy(value, label = "value") {
  try {
    return deepFreeze(JSON.parse(canonicalize(value)));
  } catch {
    refuse(`${label} is not closed canonical JSON`);
  }
}

function assertNoResult(value, authority) {
  if (
    value.authority !== authority
    || value.comparison_inference_permitted !== false
    || value.claim_eligible !== false
    || value.result_label !== "NO_RESULT"
  ) refuse("value exceeds NO_RESULT public-development authority");
}

function ownerIdentity(ownerId) {
  if (typeof ownerId !== "string") refuse("owner ID must be a string");
  const bytes = Buffer.from(ownerId, "utf8");
  if (bytes.length < 16 || bytes.length > MAX_OWNER_ID_BYTES || ownerId.trim() !== ownerId) {
    refuse("owner ID must be trimmed UTF-8 between 16 and 1024 bytes");
  }
  return sha256(bytes);
}

export function assertFixture026RsdT02PublicDevelopmentIsolatedDurablePopulationConfig(config) {
  if (
    !exactKeys(config, CONFIG_KEYS)
    || digest(config)
      !== FIXTURE_026_RSD_T02_PUBLIC_DEVELOPMENT_ISOLATED_DURABLE_POPULATION_CONFIG_SHA256
    || config.schema !== 1
    || config.contract_version
      !== FIXTURE_026_RSD_T02_PUBLIC_DEVELOPMENT_ISOLATED_DURABLE_POPULATION_CONFIG_VERSION
    || config.artifact !== "fixture-026"
    || config.track !== "RSD-T02"
    || config.partition !== "development"
    || config.population_runner_binding?.contract_version
      !== FIXTURE_026_RSD_T02_PUBLIC_DEVELOPMENT_POPULATION_RUNNER_VERSION
    || config.population_runner_binding?.config_sha256
      !== FIXTURE_026_RSD_T02_PUBLIC_DEVELOPMENT_POPULATION_RUNNER_CONFIG_SHA256
    || config.fixed_instance_isolated_durable_binding?.contract_version
      !== FIXTURE_026_RSD_T02_FIXED_INSTANCE_ISOLATED_DURABLE_CONFIG_VERSION
    || config.fixed_instance_isolated_durable_binding?.config_sha256
      !== FIXTURE_026_RSD_T02_FIXED_INSTANCE_ISOLATED_DURABLE_CONFIG_SHA256
    || config.population_contract?.canonical_instance_count !== 20
    || config.population_contract?.registered_arms_per_instance !== 9
    || config.population_contract?.processing_order
      !== "conformance-draw-index-major-then-registry-family-order"
    || config.population_contract?.instance_directory_format
      !== "sequence-three-decimal-digits--canonical-instance-id"
    || config.population_contract?.fixed_instance_output_leaf !== "durable"
    || config.population_contract?.outer_append_requires_instance_summary
      !== "complete-current-nine-of-nine"
    || config.population_contract?.full_causal_payload_retained_in_outer_ledger !== false
    || config.population_contract?.endpoint_aggregation_executed !== false
    || config.population_contract?.model_comparison_executed !== false
    || config.durability?.ledger_format
      !== FIXTURE_026_RSD_T02_PUBLIC_DEVELOPMENT_ISOLATED_DURABLE_POPULATION_LEDGER_VERSION
    || config.durability?.raw_path !== "population-run.jsonl"
    || config.durability?.checkpoint_path !== "population-checkpoint.json"
    || config.durability?.instances_directory !== "instances"
    || config.durability?.writer_lock_anchor !== "population-writer"
    || config.durability?.exclusive_population_writer_lock !== true
    || config.durability?.owner_identity_bound_to_records !== true
    || config.durability?.foreign_lock_auto_break !== false
    || config.durability?.owner_authentication
      !== "not-provided-caller-custodies-owner-id"
    || config.durability?.abandoned_lock_recovery !== "manual-only-no-auto-break"
    || config.durability?.lock_retirement
      !== "retain-randomized-retired-lock-artifact-manual-cleanup-only"
    || config.durability?.raw_ledger_is_resume_authority !== true
    || config.durability?.append_sync
      !== "complete-lf-json-record-then-filehandle-sync"
    || config.durability?.checkpoint_sync
      !== "temporary-sync-rename-destination-sync"
    || config.durability?.power_loss_guarantee
      !== "not-claimed-beyond-requested-file-sync"
    || config.durability?.torn_tail_policy !== "refuse-without-repair"
    || config.durability?.integrity_scope
      !== "bounded-raw-and-checkpoint-consistency-no-external-rollback-head"
    || config.durability?.max_records !== 20
    || config.durability?.max_raw_bytes !== 1024 * 1024
    || config.durability?.max_checkpoint_bytes !== 64 * 1024
    || config.durability?.max_instance_directories !== 20
    || config.execution?.maximum_new_instances_per_invocation !== 20
    || config.execution?.checkpoint_each_instance_default !== true
    || config.execution?.crash_after_instance_before_outer_append_is_resumable !== true
    || config.execution?.duplicate_instance_outer_append_permitted !== false
  ) refuse("config differs from the closed integrated population durability contract");
  assertNoResult(config, "public-development-isolated-durable-population-conformance-only");
  return config;
}

function assertRequest(request) {
  if (!exactKeys(request, REQUEST_KEYS)) refuse("request fields are not closed");
  assertFixture026RsdT02PublicDevelopmentIsolatedDurablePopulationConfig(request.config);
  assertFixture026RsdT02PublicDevelopmentPopulationRunnerConfig(request.population_config);
  assertFixture026RsdT02PopulationDesign(request.population_design);
  assertFixture026RsdT02SystemFamilyRegistry(request.registry);
  assertFixture026RsdT02DevelopmentInstancePlan({
    registry: request.registry,
    plan: request.plan,
  });
  assertFixture026RsdT02FixedInstanceRunnerConfig(request.fixed_instance_runner_config);
  assertFixture026RsdT02FixedInstanceIsolatedDurableConfig(
    request.fixed_instance_isolated_durable_config,
  );
  if (
    request.registry.partition !== "development"
    || request.plan.partition !== "development"
    || request.fixed_instance_runner_config.partition !== "development"
    || request.fixed_instance_isolated_durable_config.partition !== "development"
  ) refuse("only the public-development partition is permitted");
  if (typeof request.output_directory !== "string" || request.output_directory.trim() === "") {
    refuse("output directory is required");
  }
  ownerIdentity(request.owner_id);
  return request;
}

function orderedInstances(registry, plan) {
  const panel = generateFixture026RsdT02DevelopmentPanel({ registry, plan });
  assertFixture026RsdT02DevelopmentPanel({ registry, plan, panel });
  const draws = new Map(plan.conformance_draw_indices.map((draw, index) => [draw, index]));
  const families = new Map(registry.families.map((family, index) => [family.family_id, index]));
  const instances = [...panel.instances].sort((left, right) => (
    draws.get(left.draw_receipt.draw_index) - draws.get(right.draw_receipt.draw_index)
      || families.get(left.family_id) - families.get(right.family_id)
  ));
  if (
    instances.length !== 20
    || new Set(instances.map((instance) => instance.manifest.instance_id)).size !== 20
  ) refuse("canonical public-development panel is not twenty unique instances");
  return Object.freeze(instances);
}

function completePopulationArtifact(request) {
  const key = digest({
    population_runner_config_sha256:
      FIXTURE_026_RSD_T02_PUBLIC_DEVELOPMENT_POPULATION_RUNNER_CONFIG_SHA256,
    population_design_sha256: FIXTURE_026_RSD_T02_POPULATION_DESIGN_SHA256,
    family_registry_sha256: FIXTURE_026_RSD_T02_FAMILY_REGISTRY_SHA256,
    family_registry_identity_sha256: request.registry.family_registry_identity_sha256,
    development_plan_sha256: FIXTURE_026_RSD_T02_DEVELOPMENT_PLAN_SHA256,
    fixed_instance_runner_config_sha256:
      FIXTURE_026_RSD_T02_FIXED_INSTANCE_RUNNER_CONFIG_SHA256,
  });
  let artifact = populationArtifactCache.get(key);
  if (artifact === undefined) {
    artifact = runFixture026RsdT02PublicDevelopmentPopulation({
      config: request.population_config,
      population_design: request.population_design,
      registry: request.registry,
      plan: request.plan,
      fixed_instance_runner_config: request.fixed_instance_runner_config,
    });
    if (
      artifact.status !== "complete"
      || artifact.records.length !== 20
      || artifact.next_instance_index !== 20
      || artifact.result_label !== "NO_RESULT"
    ) refuse("hardened population runner did not produce its complete NO_RESULT panel");
    populationArtifactCache.clear();
    populationArtifactCache.set(key, artifact);
  }
  return artifact;
}

function instanceDirectoryName(sequence, instanceId) {
  if (!Number.isSafeInteger(sequence) || sequence < 0 || sequence > 19) {
    refuse("instance directory sequence is outside the canonical panel");
  }
  if (!HASH_PATTERN.test(instanceId)) refuse("instance directory identity is malformed");
  return `${String(sequence).padStart(3, "0")}--${instanceId}`;
}

function compactPopulationReceipt(record) {
  const receipt = {
    contract_version: FIXTURE_026_RSD_T02_PUBLIC_DEVELOPMENT_POPULATION_RECORD_VERSION,
    population_run_id: record.population_run_id,
    sequence: record.sequence,
    source_population_record_sha256: record.record_sha256,
    family_id: record.family_id,
    instance_id: record.instance_id,
    parameter_vector_sha256: record.parameter_vector_sha256,
    fixed_time_constant: record.fixed_time_constant,
    fixed_packet_id: record.fixed_packet_id,
    transcript_set_sha256: record.transcript_set_sha256,
    causal_policy_view_sha256: record.causal_policy_view_sha256,
    causal_policy_view_utf8_bytes: record.causal_policy_view_utf8_bytes,
    fixed_instance_run_id: record.fixed_instance_run_id,
    fixed_instance_run_sha256: record.fixed_instance_run_sha256,
    workload_sha256: digest(record.workload),
    result_label: "NO_RESULT",
  };
  return immutableCopy(receipt, "compact population receipt");
}

function assertDurableSummary({
  summary,
  populationRecord,
  ownerIdentitySha256,
  fixedDurableConfig,
  requireCompleteCurrent,
}) {
  if (
    !exactKeys(summary, DURABLE_SUMMARY_KEYS)
    || summary.schema !== 1
    || summary.contract_version !== FIXTURE_026_RSD_T02_FIXED_INSTANCE_DURABLE_SUMMARY_VERSION
    || !["partial", "complete"].includes(summary.status)
    || summary.run_id !== populationRecord.fixed_instance_run_id
    || summary.owner_identity_sha256 !== ownerIdentitySha256
    || summary.fixed_instance_runner_config_sha256
      !== FIXTURE_026_RSD_T02_FIXED_INSTANCE_RUNNER_CONFIG_SHA256
    || summary.isolated_durable_config_sha256
      !== FIXTURE_026_RSD_T02_FIXED_INSTANCE_ISOLATED_DURABLE_CONFIG_SHA256
    || summary.policy_bundle_sha256 !== fixedDurableConfig.policy_bundle.sha256
    || summary.worker_sha256 !== fixedDurableConfig.worker.sha256
    || summary.policy_view_sha256 !== populationRecord.causal_policy_view_sha256
    || !HASH_PATTERN.test(summary.isolated_execution_receipt_sha256)
    || !Number.isSafeInteger(summary.records)
    || summary.records < 0
    || summary.records > 9
    || summary.registered_arms !== 9
    || summary.next_arm_index !== summary.records
    || !HASH_PATTERN.test(summary.scientific_payload_sha256)
    || !HASH_PATTERN.test(summary.hash_chain_sha256)
    || !["missing", "stale", "current"].includes(summary.checkpoint_status)
    || canonicalize(summary.foundation_gates) !== canonicalize(fixedDurableConfig.foundation_gates)
    || summary.no_result !== true
  ) refuse(`isolated durable summary for population record ${populationRecord.sequence} is invalid`);
  assertNoResult(summary, "public-development-fixed-instance-isolated-durable-conformance-only");
  if (requireCompleteCurrent && (
    summary.status !== "complete"
    || summary.records !== 9
    || summary.next_arm_index !== 9
    || summary.checkpoint_status !== "current"
  )) refuse(`isolated durable summary for population record ${populationRecord.sequence} is not complete/current`);
  return summary;
}

function outerRecord({
  populationArtifact,
  populationRecord,
  ownerIdentitySha256,
  directoryName,
  durableSummary,
}) {
  const record = {
    schema: 1,
    contract_version:
      FIXTURE_026_RSD_T02_PUBLIC_DEVELOPMENT_ISOLATED_DURABLE_POPULATION_LEDGER_VERSION,
    population_run_id: populationArtifact.population_run_id,
    owner_identity_sha256: ownerIdentitySha256,
    sequence: populationRecord.sequence,
    instance_directory: directoryName,
    instance_id: populationRecord.instance_id,
    compact_population_receipt: compactPopulationReceipt(populationRecord),
    isolated_durable_summary: durableSummary,
    isolated_durable_summary_sha256: digest(durableSummary),
    full_causal_payload_retained: false,
    endpoint_aggregation_executed: false,
    model_comparison_executed: false,
    authority: "public-development-isolated-durable-population-receipt-only",
    comparison_inference_permitted: false,
    claim_eligible: false,
    result_label: "NO_RESULT",
    no_result: true,
  };
  return immutableCopy(record, "outer population ledger record");
}

function assertOuterRecord({
  record,
  sequence,
  populationArtifact,
  ownerIdentitySha256,
  fixedDurableConfig,
}) {
  const populationRecord = populationArtifact.records[sequence];
  const directoryName = instanceDirectoryName(sequence, populationRecord?.instance_id);
  if (
    !exactKeys(record, OUTER_RECORD_KEYS)
    || record.schema !== 1
    || record.contract_version
      !== FIXTURE_026_RSD_T02_PUBLIC_DEVELOPMENT_ISOLATED_DURABLE_POPULATION_LEDGER_VERSION
    || record.population_run_id !== populationArtifact.population_run_id
    || record.owner_identity_sha256 !== ownerIdentitySha256
    || record.sequence !== sequence
    || record.instance_directory !== directoryName
    || record.instance_id !== populationRecord?.instance_id
    || !exactKeys(record.compact_population_receipt, COMPACT_RECEIPT_KEYS)
    || canonicalize(record.compact_population_receipt)
      !== canonicalize(compactPopulationReceipt(populationRecord))
    || record.isolated_durable_summary_sha256 !== digest(record.isolated_durable_summary)
    || record.full_causal_payload_retained !== false
    || record.endpoint_aggregation_executed !== false
    || record.model_comparison_executed !== false
    || record.no_result !== true
  ) refuse(`outer population record ${sequence} differs from deterministic identities`);
  assertNoResult(record, "public-development-isolated-durable-population-receipt-only");
  assertDurableSummary({
    summary: record.isolated_durable_summary,
    populationRecord,
    ownerIdentitySha256,
    fixedDurableConfig,
    requireCompleteCurrent: true,
  });
  return record;
}

function scientificPayload(record) {
  const payload = { ...record };
  delete payload.integrity;
  return payload;
}

function runIdentity({
  populationArtifact,
  registry,
  ownerIdentitySha256,
  outputRootIdentitySha256,
}) {
  return immutableCopy({
    contract_version:
      FIXTURE_026_RSD_T02_PUBLIC_DEVELOPMENT_ISOLATED_DURABLE_POPULATION_LEDGER_VERSION,
    integrated_config_sha256:
      FIXTURE_026_RSD_T02_PUBLIC_DEVELOPMENT_ISOLATED_DURABLE_POPULATION_CONFIG_SHA256,
    population_runner_config_sha256:
      FIXTURE_026_RSD_T02_PUBLIC_DEVELOPMENT_POPULATION_RUNNER_CONFIG_SHA256,
    fixed_instance_isolated_durable_config_sha256:
      FIXTURE_026_RSD_T02_FIXED_INSTANCE_ISOLATED_DURABLE_CONFIG_SHA256,
    population_run_id: populationArtifact.population_run_id,
    population_artifact_sha256: populationArtifact.artifact_sha256,
    family_registry_identity_sha256: registry.family_registry_identity_sha256,
    owner_identity_sha256: ownerIdentitySha256,
    output_root_identity_sha256: outputRootIdentitySha256,
    result_label: "NO_RESULT",
  }, "integrated durable population run identity");
}

function publicSummary({
  populationArtifact,
  ownerIdentitySha256,
  outputRootIdentitySha256,
  ledger,
}) {
  const state = ledger.summary();
  const summary = {
    schema: 1,
    contract_version:
      FIXTURE_026_RSD_T02_PUBLIC_DEVELOPMENT_ISOLATED_DURABLE_POPULATION_SUMMARY_VERSION,
    status: state.records === 20 ? "complete" : "partial",
    population_run_id: populationArtifact.population_run_id,
    owner_identity_sha256: ownerIdentitySha256,
    output_root_identity_sha256: outputRootIdentitySha256,
    integrated_config_sha256:
      FIXTURE_026_RSD_T02_PUBLIC_DEVELOPMENT_ISOLATED_DURABLE_POPULATION_CONFIG_SHA256,
    population_runner_config_sha256:
      FIXTURE_026_RSD_T02_PUBLIC_DEVELOPMENT_POPULATION_RUNNER_CONFIG_SHA256,
    fixed_instance_isolated_durable_config_sha256:
      FIXTURE_026_RSD_T02_FIXED_INSTANCE_ISOLATED_DURABLE_CONFIG_SHA256,
    population_artifact_sha256: populationArtifact.artifact_sha256,
    records: state.records,
    registered_instances: 20,
    next_instance_index: state.records,
    scientific_payload_sha256: state.scientific_payload_sha256,
    hash_chain_sha256: state.hash_chain_sha256,
    checkpoint_status: state.checkpoint_status,
    full_causal_payload_retained_in_outer_ledger: false,
    endpoint_aggregation_executed: false,
    model_comparison_executed: false,
    authority: "public-development-isolated-durable-population-conformance-only",
    comparison_inference_permitted: false,
    claim_eligible: false,
    result_label: "NO_RESULT",
    no_result: true,
  };
  if (!exactKeys(summary, SUMMARY_KEYS)) refuse("public population summary shape drifted");
  return immutableCopy(summary, "integrated durable population summary");
}

async function scanInstanceDirectories({ instancesIdentity, instances, completedRecords }) {
  const entries = await readdir(instancesIdentity.realpath, { withFileTypes: true });
  if (entries.length > 20) refuse("instances directory exceeds its frozen entry bound");
  const expected = new Map(instances.map((instance, sequence) => [
    instanceDirectoryName(sequence, instance.manifest.instance_id), sequence,
  ]));
  const present = new Map();
  for (const entry of entries) {
    const sequence = expected.get(entry.name);
    if (sequence === undefined || !entry.isDirectory() || entry.isSymbolicLink()) {
      refuse(`instances directory contains an unexpected or redirected entry: ${entry.name}`);
    }
    if (sequence > completedRecords) {
      refuse(`instance directory ${entry.name} is beyond the resumable next prefix`);
    }
    if (present.has(sequence)) refuse(`duplicate instance directory sequence ${sequence}`);
    const identity = await prepareFixture026RsdT02SafeOutputDirectory(
      path.join(instancesIdentity.realpath, entry.name),
    );
    present.set(sequence, identity.realpath);
  }
  for (let sequence = 0; sequence < completedRecords; sequence += 1) {
    if (!present.has(sequence)) refuse(`completed outer prefix is missing instance directory ${sequence}`);
  }
  return present;
}

async function openFixedInstanceSession({
  request,
  instancesIdentity,
  instances,
  sequence,
}) {
  const instance = instances[sequence];
  return openFixture026RsdT02FixedInstanceIsolatedDurableRun({
    config: request.fixed_instance_isolated_durable_config,
    runner_config: request.fixed_instance_runner_config,
    registry: request.registry,
    instance,
    output_directory: path.join(
      instancesIdentity.realpath,
      instanceDirectoryName(sequence, instance.manifest.instance_id),
      request.config.population_contract.fixed_instance_output_leaf,
    ),
    owner_id: request.owner_id,
  });
}

async function revalidateExistingInstanceDirectories({
  request,
  instancesIdentity,
  instances,
  populationArtifact,
  recoveredRecords,
  present,
  ownerIdentitySha256,
}) {
  for (const [sequence] of [...present.entries()].sort((left, right) => left[0] - right[0])) {
    const session = await openFixedInstanceSession({
      request, instancesIdentity, instances, sequence,
    });
    try {
      const summary = session.summary();
      assertDurableSummary({
        summary,
        populationRecord: populationArtifact.records[sequence],
        ownerIdentitySha256,
        fixedDurableConfig: request.fixed_instance_isolated_durable_config,
        requireCompleteCurrent: sequence < recoveredRecords.length,
      });
      if (
        sequence < recoveredRecords.length
        && canonicalize(summary)
          !== canonicalize(recoveredRecords[sequence].isolated_durable_summary)
      ) refuse(`completed instance directory ${sequence} differs from its outer receipt`);
    } finally {
      await session.close();
    }
  }
}

export async function openFixture026RsdT02PublicDevelopmentIsolatedDurablePopulationRun(
  input,
) {
  if (!exactKeys(input, REQUEST_KEYS)) refuse("request fields are not closed");
  const request = immutableCopy(input, "integrated durable population request");
  assertRequest(request);
  const ownerIdentitySha256 = ownerIdentity(request.owner_id);
  const outputIdentity = await prepareFixture026RsdT02SafeOutputDirectory(
    path.resolve(request.output_directory),
  );
  const outputRootIdentitySha256 = digest({
    realpath: outputIdentity.realpath,
    device: outputIdentity.dev,
    inode: outputIdentity.ino,
  });
  const lease = await acquireFixture026RsdT02RunLock({
    outputDirectory: path.join(
      outputIdentity.realpath,
      request.config.durability.writer_lock_anchor,
    ),
    runnerId: `${FIXTURE_026_RSD_T02_PUBLIC_DEVELOPMENT_ISOLATED_DURABLE_POPULATION_LEDGER_VERSION}:${ownerIdentitySha256}`,
  });
  let ledgerForCleanup = null;
  try {
    const instancesIdentity = await prepareFixture026RsdT02SafeOutputDirectory(
      path.join(outputIdentity.realpath, request.config.durability.instances_directory),
    );
    const populationArtifact = completePopulationArtifact(request);
    const instances = orderedInstances(request.registry, request.plan);
    if (instances.some((instance, sequence) => (
      instance.manifest.instance_id !== populationArtifact.records[sequence].instance_id
    ))) refuse("generated instance order differs from the hardened population artifact");
    const identity = runIdentity({
      populationArtifact,
      registry: request.registry,
      ownerIdentitySha256,
      outputRootIdentitySha256,
    });
    const recoveredRecords = [];
    let recovering = true;
    const ledger = await openFixture026RsdT02BoundedCheckpointLedger({
      artifact: "fixture-026",
      ledgerFormat:
        FIXTURE_026_RSD_T02_PUBLIC_DEVELOPMENT_ISOLATED_DURABLE_POPULATION_LEDGER_VERSION,
      outputIdentity,
      rawFilename: request.config.durability.raw_path,
      checkpointFilename: request.config.durability.checkpoint_path,
      maximumRecords: request.config.durability.max_records,
      maximumRawBytes: request.config.durability.max_raw_bytes,
      maximumCheckpointBytes: request.config.durability.max_checkpoint_bytes,
      runIdentity: identity,
      scientificPayload,
      workKey: (record) => record.instance_id,
      assertRecord: (record, { sequence }) => {
        assertOuterRecord({
          record,
          sequence,
          populationArtifact,
          ownerIdentitySha256,
          fixedDurableConfig: request.fixed_instance_isolated_durable_config,
        });
        if (recovering) recoveredRecords.push(immutableCopy(record, "recovered outer record"));
      },
    });
    ledgerForCleanup = ledger;
    recovering = false;
    if (recoveredRecords.length !== ledger.summary().records) {
      refuse("recovered outer record count differs from the raw resume authority");
    }
    const present = await scanInstanceDirectories({
      instancesIdentity,
      instances,
      completedRecords: recoveredRecords.length,
    });
    await revalidateExistingInstanceDirectories({
      request,
      instancesIdentity,
      instances,
      populationArtifact,
      recoveredRecords,
      present,
      ownerIdentitySha256,
    });

    let sessionState = "open";
    let poisoned = false;
    let operationTail = Promise.resolve();
    let closePromise = null;
    const assertOpen = () => {
      if (sessionState !== "open") refuse(`session is ${sessionState}`);
    };
    const assertOperational = () => {
      assertOpen();
      if (poisoned) refuse("session is poisoned after an instances-directory identity failure");
    };
    const assertInstancesDirectoryIdentity = async (boundary) => {
      try {
        await assertFixture026RsdT02SafeOutputDirectoryIdentity(instancesIdentity);
      } catch (error) {
        poisoned = true;
        refuse(`instances-directory identity changed ${boundary}: ${error.message}`);
      }
    };
    const summary = () => publicSummary({
      populationArtifact,
      ownerIdentitySha256,
      outputRootIdentitySha256,
      ledger,
    });
    const queueOperation = (operation) => {
      assertOperational();
      const scheduled = operationTail.then(operation);
      operationTail = scheduled.then(() => undefined, () => undefined);
      return scheduled;
    };
    const appendNextInternal = async () => {
      const sequence = ledger.summary().records;
      if (sequence >= 20) return summary();
      const populationRecord = populationArtifact.records[sequence];
      const directoryName = instanceDirectoryName(sequence, populationRecord.instance_id);
      await assertInstancesDirectoryIdentity(`before fixed-instance work ${sequence}`);
      let fixedSession;
      let durableSummary;
      let workError;
      let closeError;
      try {
        fixedSession = await openFixedInstanceSession({
          request, instancesIdentity, instances, sequence,
        });
        durableSummary = await fixedSession.appendRemaining({ checkpoint_each: true });
        if (durableSummary.checkpoint_status !== "current") {
          durableSummary = await fixedSession.saveCheckpoint();
        }
        assertDurableSummary({
          summary: durableSummary,
          populationRecord,
          ownerIdentitySha256,
          fixedDurableConfig: request.fixed_instance_isolated_durable_config,
          requireCompleteCurrent: true,
        });
      } catch (error) {
        workError = error;
      } finally {
        if (fixedSession !== undefined) {
          try {
            const closedSummary = await fixedSession.close();
            if (
              durableSummary !== undefined
              && canonicalize(closedSummary) !== canonicalize(durableSummary)
            ) refuse(`fixed instance ${sequence} changed while closing`);
          } catch (error) {
            closeError = error;
          }
        }
      }
      await assertInstancesDirectoryIdentity(`after fixed-instance work ${sequence}`);
      if (workError !== undefined) throw workError;
      if (closeError !== undefined) throw closeError;
      const record = outerRecord({
        populationArtifact,
        populationRecord,
        ownerIdentitySha256,
        directoryName,
        durableSummary,
      });
      await assertInstancesDirectoryIdentity(`before outer append ${sequence}`);
      await ledger.append(record);
      return summary();
    };
    const saveCheckpointInternal = async () => {
      await ledger.saveCheckpoint();
      return summary();
    };
    return Object.freeze({
      paths: immutableCopy({
        root: outputIdentity.realpath,
        raw_path: ledger.paths.rawPath,
        checkpoint_path: ledger.paths.checkpointPath,
        instances_root: instancesIdentity.realpath,
      }, "integrated durable population paths"),
      summary() {
        assertOpen();
        return summary();
      },
      appendNextInstance() {
        return queueOperation(appendNextInternal);
      },
      appendRemaining({
        max_new_instances: maxNewInstances = null,
        checkpoint_each: checkpointEach = request.config.execution
          .checkpoint_each_instance_default,
      } = {}) {
        if (typeof checkpointEach !== "boolean") refuse("checkpoint_each must be boolean");
        return queueOperation(async () => {
          const remaining = 20 - ledger.summary().records;
          if (remaining === 0) return summary();
          const appendCount = maxNewInstances === null ? remaining : maxNewInstances;
          if (
            !Number.isSafeInteger(appendCount)
            || appendCount < 1
            || appendCount > remaining
            || appendCount > request.config.execution.maximum_new_instances_per_invocation
          ) refuse("requested instance append count is outside the remaining bounded panel");
          for (let offset = 0; offset < appendCount; offset += 1) {
            await appendNextInternal();
            if (checkpointEach) await saveCheckpointInternal();
          }
          return summary();
        });
      },
      saveCheckpoint() {
        return queueOperation(saveCheckpointInternal);
      },
      close() {
        if (closePromise !== null) return closePromise;
        assertOpen();
        sessionState = "closing";
        closePromise = (async () => {
          await operationTail;
          const finalSummary = summary();
          try {
            await ledger.close();
          } finally {
            try {
              await lease.release();
            } finally {
              sessionState = "closed";
            }
          }
          return finalSummary;
        })();
        return closePromise;
      },
    });
  } catch (error) {
    if (ledgerForCleanup !== null) await ledgerForCleanup.close().catch(() => {});
    await lease.release().catch(() => {});
    throw error;
  }
}
