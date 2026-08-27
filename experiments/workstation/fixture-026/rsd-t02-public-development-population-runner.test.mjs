import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { after, before, test } from "node:test";
import { fileURLToPath } from "node:url";

import Ajv from "ajv";

import { canonicalize, sha256Hex } from "../lib/checkpoint-ledger.mjs";
import {
  FIXTURE_026_RSD_T02_PUBLIC_DEVELOPMENT_POPULATION_RUNNER_CONFIG_SHA256,
  FIXTURE_026_RSD_T02_PUBLIC_DEVELOPMENT_POPULATION_RUNNER_CONFIG_VERSION,
  FIXTURE_026_RSD_T02_PUBLIC_DEVELOPMENT_POPULATION_RUNNER_VERSION,
  assertFixture026RsdT02PublicDevelopmentPopulationRunArtifact,
  assertFixture026RsdT02PublicDevelopmentPopulationRunnerConfig,
  runFixture026RsdT02PublicDevelopmentPopulation,
} from "./rsd-t02-public-development-population-runner.mjs";

const fixtureRoot = path.dirname(fileURLToPath(import.meta.url));
const ZERO_HASH = "0".repeat(64);
const WORKLOAD_COUNTERS = Object.freeze([
  "system_instance_count", "episode_count", "realization_count",
  "transcript_sample_row_count", "input_command_count",
  "simulation_internal_step_count", "rk4_derivative_evaluation_count",
  "arm_invocation_count", "arm_sample_row_read_count",
  "arm_scalar_operation_count", "causal_policy_view_utf8_byte_count",
]);

let config;
let populationDesign;
let registry;
let plan;
let fixedRunnerConfig;
let schema;
let validateSchema;
let partialTwo;
let resumedFive;
let fullTwenty;
let completedResume;
let executionMilliseconds;
let completedResumeMilliseconds;

function digest(value) {
  return sha256Hex(canonicalize(value));
}

function request(overrides = {}) {
  return {
    config,
    population_design: populationDesign,
    registry,
    plan,
    fixed_instance_runner_config: fixedRunnerConfig,
    ...overrides,
  };
}

function artifactValidationInput(artifact) {
  return {
    config,
    population_design: populationDesign,
    registry,
    plan,
    fixed_instance_runner_config: fixedRunnerConfig,
    artifact,
  };
}

function rehashArtifact(artifact) {
  const body = { ...artifact };
  delete body.artifact_sha256;
  artifact.artifact_sha256 = digest(body);
  return artifact;
}

function rechainRecords(artifact) {
  let previous = ZERO_HASH;
  for (const [sequence, record] of artifact.records.entries()) {
    record.sequence = sequence;
    record.previous_record_sha256 = previous;
    const body = { ...record };
    delete body.record_sha256;
    record.record_sha256 = digest(body);
    previous = record.record_sha256;
  }
  return artifact;
}

function sumRecordWorkloads(records) {
  const total = Object.fromEntries(WORKLOAD_COUNTERS.map((key) => [key, 0]));
  for (const record of records) {
    for (const key of WORKLOAD_COUNTERS) total[key] += record.workload[key];
  }
  return { ...total, wall_seconds: null, later_joules: null };
}

function rollbackToPrefix(artifact, length) {
  const rolledBack = structuredClone(artifact);
  rolledBack.records = rolledBack.records.slice(0, length);
  rolledBack.status = "partial";
  rolledBack.next_instance_index = length;
  rolledBack.workload = sumRecordWorkloads(rolledBack.records);
  return rehashArtifact(rolledBack);
}

function runtimeAcceptsConfig(candidate) {
  try {
    assertFixture026RsdT02PublicDevelopmentPopulationRunnerConfig(candidate);
    return true;
  } catch {
    return false;
  }
}

function runtimeAcceptsArtifact(candidate) {
  try {
    assertFixture026RsdT02PublicDevelopmentPopulationRunArtifact(
      artifactValidationInput(candidate),
    );
    return true;
  } catch {
    return false;
  }
}

before(async () => {
  const texts = await Promise.all([
    "configs/rsd-t02-public-development-population-runner.json",
    "configs/rsd-t02-population-design.json",
    "configs/rsd-t02-system-family-registry.json",
    "configs/rsd-t02-development-instance-plan.json",
    "configs/rsd-t02-fixed-instance-runner.json",
    "rsd-t02-public-development-population-runner.schema.json",
  ].map((relativePath) => readFile(path.join(fixtureRoot, relativePath), "utf8")));
  [config, populationDesign, registry, plan, fixedRunnerConfig, schema] = texts.map(JSON.parse);
  validateSchema = new Ajv({ allErrors: true, jsonPointers: true }).compile(schema);

  const started = performance.now();
  partialTwo = runFixture026RsdT02PublicDevelopmentPopulation(request({
    max_new_instance_records: 2,
  }));
  resumedFive = runFixture026RsdT02PublicDevelopmentPopulation(request({
    prior_artifact: partialTwo,
    max_new_instance_records: 3,
  }));
  fullTwenty = runFixture026RsdT02PublicDevelopmentPopulation(request());
  executionMilliseconds = performance.now() - started;

  const completedResumeStarted = performance.now();
  completedResume = runFixture026RsdT02PublicDevelopmentPopulation(request({
    prior_artifact: fullTwenty,
  }));
  completedResumeMilliseconds = performance.now() - completedResumeStarted;
}, { timeout: 600_000 });

after(() => {
  config = null;
  populationDesign = null;
  registry = null;
  plan = null;
  fixedRunnerConfig = null;
  schema = null;
  validateSchema = null;
  partialTwo = null;
  resumedFive = null;
  fullTwenty = null;
  completedResume = null;
});

test("config has runtime/schema parity for its frozen development-only contract", () => {
  assert.equal(validateSchema(config), true, JSON.stringify(validateSchema.errors));
  assert.equal(runtimeAcceptsConfig(config), true);
  assert.equal(
    config.contract_version,
    FIXTURE_026_RSD_T02_PUBLIC_DEVELOPMENT_POPULATION_RUNNER_CONFIG_VERSION,
  );
  assert.equal(digest(config), FIXTURE_026_RSD_T02_PUBLIC_DEVELOPMENT_POPULATION_RUNNER_CONFIG_SHA256);
  assert.equal(
    schema["x-runtime-validator"].canonical_config_sha256,
    FIXTURE_026_RSD_T02_PUBLIC_DEVELOPMENT_POPULATION_RUNNER_CONFIG_SHA256,
  );

  for (const hostile of [
    (() => {
      const value = structuredClone(config);
      value.population_design_binding.canonical_sha256 = ZERO_HASH;
      return value;
    })(),
    (() => {
      const value = structuredClone(config);
      value.resume_contract.record_chain = "append-only-chain-claim";
      return value;
    })(),
  ]) {
    assert.equal(validateSchema(hostile), false);
    assert.equal(runtimeAcceptsConfig(hostile), false);
  }
});

test("full 20-instance artifact is complete and accepted by runtime and schema", () => {
  assert.equal(fullTwenty.contract_version,
    FIXTURE_026_RSD_T02_PUBLIC_DEVELOPMENT_POPULATION_RUNNER_VERSION);
  assert.equal(fullTwenty.status, "complete");
  assert.equal(fullTwenty.records.length, 20);
  assert.equal(fullTwenty.next_instance_index, 20);
  assert.equal(validateSchema(fullTwenty), true, JSON.stringify(validateSchema.errors));
  assert.equal(completedResume, fullTwenty);
  assert.equal(Number.isFinite(executionMilliseconds), true);
  assert.equal(Number.isFinite(completedResumeMilliseconds), true);
  assert.equal(completedResumeMilliseconds > 0, true);
});

test("every receipt has canonical family/parameter/tau and cross-consistent workload counters", () => {
  assert.deepEqual(
    fullTwenty.records.slice(0, 5).map((record) => record.family_id),
    registry.families.map((family) => family.family_id),
  );
  for (const [sequence, record] of fullTwenty.records.entries()) {
    assert.equal(record.conformance_draw_index, Math.floor(sequence / registry.families.length));
    assert.equal(record.one_family_parameter_vector_and_time_constant_across_packet_verified, true);
    assert.equal(record.fixed_time_constant_s,
      record.fixed_time_constant.numerator / record.fixed_time_constant.denominator);
    assert.equal(record.episode_count, 26);
    assert.equal(record.arm_count, 9);
    assert.equal(record.workload.system_instance_count, 1);
    assert.equal(record.workload.episode_count, record.episode_count);
    assert.equal(record.workload.realization_count, 26);
    assert.equal(record.workload.arm_invocation_count, record.arm_count);
    assert.equal(record.workload.causal_policy_view_utf8_byte_count,
      record.causal_policy_view_utf8_bytes);
    assert.equal(record.workload.arm_sample_row_read_count,
      record.workload.transcript_sample_row_count * record.arm_count);
  }
});

test("complete deterministic workload is exact and contains no invented runtime or energy", () => {
  assert.deepEqual(fullTwenty.workload, {
    system_instance_count: 20,
    episode_count: 520,
    realization_count: 520,
    transcript_sample_row_count: 799240,
    input_command_count: 3760,
    simulation_internal_step_count: 12779520,
    rk4_derivative_evaluation_count: 51118080,
    arm_invocation_count: 180,
    arm_sample_row_read_count: 7193160,
    arm_scalar_operation_count: 21579480,
    causal_policy_view_utf8_byte_count: 161978382,
    wall_seconds: null,
    later_joules: null,
  });
});

test("equal-family weights remain design metadata and no outcome aggregation executes", () => {
  const metadata = fullTwenty.aggregation_metadata;
  assert.equal(metadata.family_weights.length, 5);
  assert.equal(metadata.complete_panel_family_balance, true);
  assert.equal(metadata.complete_panel_instances_per_family, 4);
  assert.equal(metadata.weights_are_design_metadata_only, true);
  assert.equal(metadata.outcome_aggregation_executed, false);
  for (const weight of metadata.family_weights) {
    assert.equal(weight.planned_unique_instance_count, 4);
    assert.equal(weight.family_weight_numerator, 1);
    assert.equal(weight.family_weight_denominator, 5);
    assert.equal(weight.within_family_instance_weight_numerator, 1);
    assert.equal(weight.within_family_instance_weight_denominator, 4);
  }
});

test("partial resume preserves deterministic receipts and complete resume handles remaining zero", () => {
  assert.equal(partialTwo.records.length, 2);
  assert.equal(resumedFive.records.length, 5);
  assert.equal(canonicalize(resumedFive.records.slice(0, 2)), canonicalize(partialTwo.records));
  assert.equal(canonicalize(resumedFive.records), canonicalize(fullTwenty.records.slice(0, 5)));
  assert.equal(completedResume.status, "complete");
  assert.equal(completedResume.next_instance_index, 20);
  assert.equal(completedResume.artifact_sha256, fullTwenty.artifact_sha256);
});

test("rehashed receipt drift is rejected by deterministic fixed-instance replay", () => {
  const hostile = structuredClone(resumedFive);
  hostile.records[0].transcript_set_sha256 = ZERO_HASH;
  rechainRecords(hostile);
  rehashArtifact(hostile);
  assert.throws(
    () => assertFixture026RsdT02PublicDevelopmentPopulationRunArtifact(
      artifactValidationInput(hostile),
    ),
    /not the exact deterministic replay receipt/u,
  );
});

test("workload contradictions are rejected and declarative constraints have schema parity", () => {
  const systemCount = structuredClone(resumedFive);
  systemCount.records[0].workload.system_instance_count = 2;
  rechainRecords(systemCount);
  systemCount.workload = sumRecordWorkloads(systemCount.records);
  rehashArtifact(systemCount);
  assert.equal(validateSchema(systemCount), false);
  assert.equal(runtimeAcceptsArtifact(systemCount), false);

  const viewBytes = structuredClone(resumedFive);
  viewBytes.records[0].workload.causal_policy_view_utf8_byte_count += 1;
  rechainRecords(viewBytes);
  viewBytes.workload = sumRecordWorkloads(viewBytes.records);
  rehashArtifact(viewBytes);
  assert.throws(
    () => assertFixture026RsdT02PublicDevelopmentPopulationRunArtifact(
      artifactValidationInput(viewBytes),
    ),
    /contradictory workload counters/u,
  );

  const aggregate = structuredClone(resumedFive);
  aggregate.workload.episode_count += 1;
  rehashArtifact(aggregate);
  assert.throws(
    () => assertFixture026RsdT02PublicDevelopmentPopulationRunArtifact(
      artifactValidationInput(aggregate),
    ),
    /not the exact sum/u,
  );
});

test("a rewritten chain fails semantic replay while rollback remains unprovable without a head", () => {
  const rewritten = structuredClone(resumedFive);
  for (const record of rewritten.records) record.fixed_instance_run_sha256 = ZERO_HASH;
  rechainRecords(rewritten);
  rehashArtifact(rewritten);
  assert.throws(
    () => assertFixture026RsdT02PublicDevelopmentPopulationRunArtifact(
      artifactValidationInput(rewritten),
    ),
    /not the exact deterministic replay receipt/u,
  );

  const rolledBack = rollbackToPrefix(resumedFive, 2);
  assert.equal(validateSchema(rolledBack), true, JSON.stringify(validateSchema.errors));
  assert.equal(runtimeAcceptsArtifact(rolledBack), true);
  assert.equal(rolledBack.status, "partial");
  assert.equal(config.resume_contract.external_or_durable_head_bound, false);
  assert.equal(config.resume_contract.rollback_detection_without_external_head, false);
  assert.match(config.resume_contract.integrity_scope, /no-append-only-or-rollback-proof/u);
});

test("outer/private requests and custom generation coordinates remain outside the runner", () => {
  const outerRegistry = structuredClone(registry);
  outerRegistry.partition = "outer-confirmation";
  outerRegistry.payload_state = "sealed-evaluator-custody";
  assert.throws(
    () => runFixture026RsdT02PublicDevelopmentPopulation(request({
      registry: outerRegistry,
      max_new_instance_records: 1,
    })),
    /family generator refused/u,
  );
  assert.throws(
    () => runFixture026RsdT02PublicDevelopmentPopulation({
      ...request(),
      family_id: registry.families[0].family_id,
    }),
    /request fields are not closed/u,
  );
});

test("receipt replay improves verifiability without opening experimental authority", () => {
  assert.equal(fullTwenty.evidence_retention.mode,
    "deterministically-replayed-content-addressed-receipts");
  assert.equal(fullTwenty.evidence_retention.standalone_fixed_run_revalidation_possible, true);
  assert.equal(fullTwenty.evidence_retention.causal_view_payloads_retained, false);
  assert.equal(fullTwenty.evidence_retention.full_fixed_instance_runs_retained, false);
  assert.equal(fullTwenty.evidence_retention.external_or_durable_chain_head_bound, false);
  assert.equal(fullTwenty.evidence_retention.rollback_detection_without_external_head, false);
  assert.equal(fullTwenty.promotion_gates.closed.length, 6);
  assert.equal(fullTwenty.promotion_gates.open.length, 8);
  assert.equal(fullTwenty.outer_family_generation_performed, false);
  assert.equal(fullTwenty.outer_instance_generation_performed, false);
  assert.equal(fullTwenty.private_or_sealed_payload_accessed, false);
  assert.equal(fullTwenty.comparison_inference_permitted, false);
  assert.equal(fullTwenty.claim_eligible, false);
  assert.equal(fullTwenty.result_label, "NO_RESULT");
});
