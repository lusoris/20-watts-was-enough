import { canonicalize, sha256Hex } from "../lib/checkpoint-ledger.mjs";
import {
  FIXTURE_026_RSD_T02_FIXED_INSTANCE_RUNNER_CONFIG_SHA256,
  FIXTURE_026_RSD_T02_FIXED_INSTANCE_RUNNER_CONFIG_VERSION,
  FIXTURE_026_RSD_T02_FIXED_INSTANCE_RUNNER_VERSION,
  assertFixture026RsdT02FixedInstanceRunnerConfig,
  runFixture026RsdT02FixedInstance,
} from "./rsd-t02-fixed-instance-runner.mjs";
import {
  FIXTURE_026_RSD_T02_POPULATION_DESIGN_SHA256,
  FIXTURE_026_RSD_T02_POPULATION_DESIGN_VERSION,
  assertFixture026RsdT02PopulationDesign,
} from "./rsd-t02-population-contract.mjs";
import {
  FIXTURE_026_RSD_T02_DEVELOPMENT_PLAN_SHA256,
  FIXTURE_026_RSD_T02_DEVELOPMENT_PLAN_VERSION,
  FIXTURE_026_RSD_T02_FAMILY_REGISTRY_SHA256,
  FIXTURE_026_RSD_T02_FAMILY_REGISTRY_VERSION,
  assertFixture026RsdT02DevelopmentInstance,
  assertFixture026RsdT02DevelopmentInstancePlan,
  assertFixture026RsdT02DevelopmentPanel,
  assertFixture026RsdT02SystemFamilyRegistry,
  generateFixture026RsdT02DevelopmentPanel,
} from "./rsd-t02-system-family-generator.mjs";

export const FIXTURE_026_RSD_T02_PUBLIC_DEVELOPMENT_POPULATION_RUNNER_CONFIG_VERSION =
  "fixture-026.rsd-t02-public-development-population-runner-config.v1";
export const FIXTURE_026_RSD_T02_PUBLIC_DEVELOPMENT_POPULATION_RUNNER_VERSION =
  "fixture-026.rsd-t02-public-development-population-runner.v1";
export const FIXTURE_026_RSD_T02_PUBLIC_DEVELOPMENT_POPULATION_RECORD_VERSION =
  "fixture-026.rsd-t02-public-development-population-record.v1";
export const FIXTURE_026_RSD_T02_PUBLIC_DEVELOPMENT_POPULATION_RUNNER_CONFIG_SHA256 =
  "7c9948cbabb58f2da76712e6c3040b81e1efa02b83a271742efbeeb2ea7d8419";

const ZERO_HASH = "0".repeat(64);
const HASH_PATTERN = /^[0-9a-f]{64}$/u;
const REQUEST_REQUIRED_KEYS = Object.freeze([
  "config", "population_design", "registry", "plan", "fixed_instance_runner_config",
]);
const REQUEST_OPTIONAL_KEYS = Object.freeze(["prior_artifact", "max_new_instance_records"]);
const CONFIG_KEYS = Object.freeze([
  "schema", "contract_version", "artifact", "track", "authority", "partition",
  "population_design_binding", "family_registry_binding", "development_plan_binding",
  "fixed_instance_runner_binding", "execution_contract", "aggregation_contract",
  "resume_contract", "outer_partition_contract", "runtime_measurement_status",
  "comparison_inference_permitted", "claim_eligible", "result_label",
]);
const ARTIFACT_KEYS = Object.freeze([
  "schema", "contract_version", "status", "population_run_id", "config_sha256",
  "population_design_sha256", "family_registry_sha256",
  "family_registry_identity_sha256", "development_plan_sha256",
  "fixed_instance_runner_config_sha256", "partition", "panel",
  "aggregation_metadata", "records", "next_instance_index", "workload",
  "evidence_retention", "promotion_gates", "outer_family_generation_performed",
  "outer_instance_generation_performed", "private_or_sealed_payload_accessed",
  "authority", "comparison_inference_permitted", "claim_eligible", "result_label",
  "no_result", "artifact_sha256",
]);
const PANEL_KEYS = Object.freeze([
  "constructed_artifact_count", "unique_canonical_instance_count",
  "duplicate_canonical_instance_count", "family_count", "episode_count_per_instance",
  "arm_count_per_instance", "processing_order", "ordered_instance_ids_sha256",
]);
const AGGREGATION_KEYS = Object.freeze([
  "scope", "estimand", "family_weighting", "within_family_weighting",
  "family_weights", "complete_panel_family_balance",
  "complete_panel_instances_per_family", "weights_are_design_metadata_only",
  "outcome_aggregation_executed", "family_superpopulation_inference_permitted",
]);
const FAMILY_WEIGHT_KEYS = Object.freeze([
  "family_id", "planned_unique_instance_count", "family_weight_numerator",
  "family_weight_denominator", "within_family_instance_weight_numerator",
  "within_family_instance_weight_denominator",
]);
const RECORD_KEYS = Object.freeze([
  "schema", "contract_version", "sequence", "previous_record_sha256",
  "population_run_id", "family_id", "family_version", "structural_lineage_id",
  "conformance_draw_index", "instance_id", "parameter_vector_sha256",
  "fixed_time_constant", "fixed_time_constant_s", "fixed_packet_id",
  "one_family_parameter_vector_and_time_constant_across_packet_verified",
  "episode_count", "transcript_set_sha256", "causal_policy_view_sha256",
  "causal_policy_view_utf8_bytes", "causal_policy_view_allowlist_verified",
  "arm_count", "fixed_instance_run_id", "fixed_instance_run_sha256",
  "fixed_instance_ledger_head_sha256", "fixed_instance_status", "workload",
  "causal_view_payload_retained", "fixed_instance_run_payload_retained",
  "authority", "comparison_inference_permitted", "claim_eligible", "result_label",
  "no_result", "record_sha256",
]);
const WORKLOAD_KEYS = Object.freeze([
  "system_instance_count", "episode_count", "realization_count",
  "transcript_sample_row_count", "input_command_count",
  "simulation_internal_step_count", "rk4_derivative_evaluation_count",
  "arm_invocation_count", "arm_sample_row_read_count",
  "arm_scalar_operation_count", "causal_policy_view_utf8_byte_count",
  "wall_seconds", "later_joules",
]);
const EVIDENCE_KEYS = Object.freeze([
  "mode", "receipt_revalidation", "content_addressed_receipts",
  "causal_view_payloads_retained", "full_fixed_instance_runs_retained",
  "standalone_fixed_run_revalidation_possible", "external_or_durable_chain_head_bound",
  "rollback_detection_without_external_head",
]);
const GATE_KEYS = Object.freeze(["closed", "open"]);

const CLOSED_GATES = Object.freeze([
  "public-development-design-registry-plan-and-runner-bound",
  "deterministic-fixed-parameter-development-panel-generated",
  "instance-family-parameter-vector-and-time-constant-packet-binding-verified",
  "deterministic-26-episode-causal-view-generation-receipted",
  "deterministic-population-resume-with-replayed-prefix-integrity-chain",
  "equal-family-public-development-weighting-metadata-frozen",
]);
const OPEN_GATES = Object.freeze([
  "content-addressed-policy-bundle-and-fresh-isolated-child-execution",
  "durable-full-fixed-run-and-causal-view-payload-retention",
  "generic-null-executor-integration-and-mature-frozen-fits",
  "calibrated-threshold-and-resource-artifacts",
  "prospective-bootstrap-aligned-power-plan",
  "private-outer-family-and-instance-custody",
  "measured-joule-accounting",
  "comparison-or-claim-authority",
]);

function exactKeys(value, keys) {
  return value
    && typeof value === "object"
    && !Array.isArray(value)
    && Object.keys(value).length === keys.length
    && keys.every((key) => Object.hasOwn(value, key));
}

function deepFreeze(value) {
  if (value && typeof value === "object" && !Object.isFrozen(value)) {
    Object.freeze(value);
    for (const child of Object.values(value)) deepFreeze(child);
  }
  return value;
}

function refuse(message) {
  throw new Error(`Fixture 026 RSD-T02 public-development population runner refused: ${message}`);
}

function digest(value) {
  try {
    return sha256Hex(canonicalize(value));
  } catch {
    refuse("input or artifact is not canonically serializable");
  }
}

function positiveSafeInteger(value) {
  return Number.isSafeInteger(value) && value > 0;
}

function assertNoResultRoot(value, authority) {
  if (
    value.authority !== authority
    || value.comparison_inference_permitted !== false
    || value.claim_eligible !== false
    || value.result_label !== "NO_RESULT"
  ) refuse("artifact exceeds public-development NO_RESULT authority");
}

export function assertFixture026RsdT02PublicDevelopmentPopulationRunnerConfig(config) {
  if (
    !exactKeys(config, CONFIG_KEYS)
    || digest(config)
      !== FIXTURE_026_RSD_T02_PUBLIC_DEVELOPMENT_POPULATION_RUNNER_CONFIG_SHA256
    || config.schema !== 1
    || config.contract_version
      !== FIXTURE_026_RSD_T02_PUBLIC_DEVELOPMENT_POPULATION_RUNNER_CONFIG_VERSION
    || config.artifact !== "fixture-026"
    || config.track !== "RSD-T02"
    || config.partition !== "development"
    || config.population_design_binding?.contract_version
      !== FIXTURE_026_RSD_T02_POPULATION_DESIGN_VERSION
    || config.population_design_binding?.canonical_sha256
      !== FIXTURE_026_RSD_T02_POPULATION_DESIGN_SHA256
    || config.family_registry_binding?.contract_version
      !== FIXTURE_026_RSD_T02_FAMILY_REGISTRY_VERSION
    || config.family_registry_binding?.canonical_sha256
      !== FIXTURE_026_RSD_T02_FAMILY_REGISTRY_SHA256
    || config.development_plan_binding?.contract_version
      !== FIXTURE_026_RSD_T02_DEVELOPMENT_PLAN_VERSION
    || config.development_plan_binding?.canonical_sha256
      !== FIXTURE_026_RSD_T02_DEVELOPMENT_PLAN_SHA256
    || config.fixed_instance_runner_binding?.config_contract_version
      !== FIXTURE_026_RSD_T02_FIXED_INSTANCE_RUNNER_CONFIG_VERSION
    || config.fixed_instance_runner_binding?.runner_contract_version
      !== FIXTURE_026_RSD_T02_FIXED_INSTANCE_RUNNER_VERSION
    || config.fixed_instance_runner_binding?.canonical_config_sha256
      !== FIXTURE_026_RSD_T02_FIXED_INSTANCE_RUNNER_CONFIG_SHA256
    || config.execution_contract?.panel_selection
      !== "all-unique-canonical-public-development-instances"
    || config.execution_contract?.processing_order
      !== "conformance-draw-index-major-then-registry-family-order"
    || config.execution_contract?.one_family_parameter_vector_and_time_constant_per_packet
      !== true
    || config.execution_contract?.causal_view_retention
      !== "sha256-and-utf8-byte-count-receipt-only"
    || config.execution_contract?.full_fixed_instance_run_retained_in_population_artifact
      !== false
    || !positiveSafeInteger(
      config.execution_contract?.maximum_new_instance_records_per_invocation,
    )
    || config.aggregation_contract?.family_weighting !== "equal-family-weight"
    || config.aggregation_contract?.within_family_weighting
      !== "equal-unique-instance-weight"
    || config.aggregation_contract?.weights_are_design_metadata_only !== true
    || config.aggregation_contract?.outcome_aggregation_executed !== false
    || config.aggregation_contract?.family_superpopulation_inference_permitted !== false
    || config.resume_contract?.record_chain
      !== "sha256-canonical-json-previous-record-integrity-v1"
    || config.resume_contract?.integrity_scope
      !== "internal-order-and-content-integrity-only-no-append-only-or-rollback-proof"
    || config.resume_contract?.prior_receipts_revalidated_from_immutable_inputs !== true
    || config.resume_contract?.external_or_durable_head_bound !== false
    || config.resume_contract?.rollback_detection_without_external_head !== false
    || config.outer_partition_contract?.outer_family_generation_permitted !== false
    || config.outer_partition_contract?.outer_instance_generation_permitted !== false
    || config.outer_partition_contract?.private_or_sealed_payload_access_permitted !== false
    || config.runtime_measurement_status !== "not-captured-in-deterministic-artifact"
  ) refuse("config differs from the closed public-development execution contract");
  assertNoResultRoot(config, "public-development-population-execution-foundation-only");
  return config;
}

function assertRequest(request) {
  if (!request || typeof request !== "object" || Array.isArray(request)) {
    refuse("request must be an object");
  }
  const keys = Object.keys(request);
  if (
    !REQUEST_REQUIRED_KEYS.every((key) => Object.hasOwn(request, key))
    || keys.some((key) => ![...REQUEST_REQUIRED_KEYS, ...REQUEST_OPTIONAL_KEYS].includes(key))
  ) refuse("request fields are not closed");
  assertFixture026RsdT02PublicDevelopmentPopulationRunnerConfig(request.config);
  assertFixture026RsdT02PopulationDesign(request.population_design);
  assertFixture026RsdT02SystemFamilyRegistry(request.registry);
  assertFixture026RsdT02DevelopmentInstancePlan({
    registry: request.registry,
    plan: request.plan,
  });
  assertFixture026RsdT02FixedInstanceRunnerConfig(request.fixed_instance_runner_config);
  if (
    request.registry.partition !== "development"
    || request.registry.payload_state !== "public-development"
    || request.plan.partition !== "development"
    || request.fixed_instance_runner_config.partition !== "development"
    || request.population_design.custody_contract.release_or_confirmation_authority_exists
      !== false
  ) refuse("only the public-development partition can execute");
  if (Object.hasOwn(request, "max_new_instance_records") && (
    !positiveSafeInteger(request.max_new_instance_records)
    || request.max_new_instance_records
      > request.config.execution_contract.maximum_new_instance_records_per_invocation
  )) refuse("requested append count is outside the configured public-development bound");
  if (Object.hasOwn(request, "prior_artifact") && request.prior_artifact === null) {
    refuse("an explicit prior artifact cannot be null");
  }
  return request;
}

function orderedUniqueInstances(registry, plan, panel) {
  assertFixture026RsdT02DevelopmentPanel({ registry, plan, panel });
  const drawOrder = new Map(plan.conformance_draw_indices.map((draw, index) => [draw, index]));
  const familyOrder = new Map(registry.families.map((family, index) => [family.family_id, index]));
  const ordered = [...panel.instances].sort((left, right) => (
    drawOrder.get(left.draw_receipt.draw_index) - drawOrder.get(right.draw_receipt.draw_index)
      || familyOrder.get(left.family_id) - familyOrder.get(right.family_id)
  ));
  if (
    ordered.length !== panel.unique_canonical_instance_count
    || new Set(ordered.map((instance) => instance.manifest.instance_id)).size !== ordered.length
  ) refuse("public-development processing order is not a unique canonical panel");
  ordered.forEach((artifact) => assertFixture026RsdT02DevelopmentInstance({ registry, artifact }));
  return ordered;
}

function contextFor(request) {
  assertRequest(request);
  const panel = generateFixture026RsdT02DevelopmentPanel({
    registry: request.registry,
    plan: request.plan,
  });
  const instances = orderedUniqueInstances(request.registry, request.plan, panel);
  const populationRunId = digest({
    domain: FIXTURE_026_RSD_T02_PUBLIC_DEVELOPMENT_POPULATION_RUNNER_VERSION,
    config_sha256: FIXTURE_026_RSD_T02_PUBLIC_DEVELOPMENT_POPULATION_RUNNER_CONFIG_SHA256,
    population_design_sha256: FIXTURE_026_RSD_T02_POPULATION_DESIGN_SHA256,
    family_registry_sha256: FIXTURE_026_RSD_T02_FAMILY_REGISTRY_SHA256,
    family_registry_identity_sha256: request.registry.family_registry_identity_sha256,
    development_plan_sha256: FIXTURE_026_RSD_T02_DEVELOPMENT_PLAN_SHA256,
    fixed_instance_runner_config_sha256:
      FIXTURE_026_RSD_T02_FIXED_INSTANCE_RUNNER_CONFIG_SHA256,
    ordered_instance_ids: instances.map((instance) => instance.manifest.instance_id),
  });
  return { panel, instances, populationRunId };
}

function panelMetadata(config, registry, fixedRunnerConfig, panel, instances) {
  return deepFreeze({
    constructed_artifact_count: panel.constructed_artifact_count,
    unique_canonical_instance_count: instances.length,
    duplicate_canonical_instance_count: panel.duplicate_canonical_instance_count,
    family_count: registry.families.length,
    episode_count_per_instance: fixedRunnerConfig.transcript_contract.episode_count,
    arm_count_per_instance: fixedRunnerConfig.arm_ids.length,
    processing_order: config.execution_contract.processing_order,
    ordered_instance_ids_sha256: digest(
      instances.map((instance) => instance.manifest.instance_id),
    ),
  });
}

function aggregationMetadata(config, registry, instances) {
  const familyCounts = new Map(registry.families.map((family) => [family.family_id, 0]));
  for (const instance of instances) {
    familyCounts.set(instance.family_id, (familyCounts.get(instance.family_id) ?? 0) + 1);
  }
  if ([...familyCounts.values()].some((count) => count < 1)) {
    refuse("an equal-weight public-development family has no unique instance");
  }
  const counts = [...familyCounts.values()];
  const balanced = new Set(counts).size === 1;
  const familyWeights = registry.families.map((family) => deepFreeze({
    family_id: family.family_id,
    planned_unique_instance_count: familyCounts.get(family.family_id),
    family_weight_numerator: 1,
    family_weight_denominator: registry.families.length,
    within_family_instance_weight_numerator: 1,
    within_family_instance_weight_denominator: familyCounts.get(family.family_id),
  }));
  return deepFreeze({
    scope: config.aggregation_contract.scope,
    estimand: "equal-weighted-mean-arm-contrast-over-the-frozen-finite-development-family-panel",
    family_weighting: config.aggregation_contract.family_weighting,
    within_family_weighting: config.aggregation_contract.within_family_weighting,
    family_weights: familyWeights,
    complete_panel_family_balance: balanced,
    complete_panel_instances_per_family: balanced ? counts[0] : null,
    weights_are_design_metadata_only: true,
    outcome_aggregation_executed: false,
    family_superpopulation_inference_permitted: false,
  });
}

function emptyWorkload() {
  return {
    system_instance_count: 0,
    episode_count: 0,
    realization_count: 0,
    transcript_sample_row_count: 0,
    input_command_count: 0,
    simulation_internal_step_count: 0,
    rk4_derivative_evaluation_count: 0,
    arm_invocation_count: 0,
    arm_sample_row_read_count: 0,
    arm_scalar_operation_count: 0,
    causal_policy_view_utf8_byte_count: 0,
    wall_seconds: null,
    later_joules: null,
  };
}

function addWorkloads(records) {
  const total = emptyWorkload();
  for (const { workload } of records) {
    for (const key of WORKLOAD_KEYS) {
      if (!["wall_seconds", "later_joules"].includes(key)) total[key] += workload[key];
    }
  }
  if (Object.values(total).some((value) => value !== null && !Number.isSafeInteger(value))) {
    refuse("population workload exceeds safe integer accounting");
  }
  return deepFreeze(total);
}

function perInstanceWorkload(run) {
  const workload = {
    system_instance_count: 1,
    episode_count: run.acquisition_resource.episode_count,
    realization_count: run.transcript_receipts.length,
    transcript_sample_row_count: run.acquisition_resource.sample_rows,
    input_command_count: run.acquisition_resource.input_commands,
    simulation_internal_step_count: run.acquisition_resource.simulation_internal_steps,
    rk4_derivative_evaluation_count: run.acquisition_resource.rk4_derivative_evaluations,
    arm_invocation_count: run.ledger.length,
    arm_sample_row_read_count: run.ledger.reduce(
      (sum, record) => sum + record.resource_ledger.actual.sample_rows_read, 0,
    ),
    arm_scalar_operation_count: run.ledger.reduce(
      (sum, record) => sum + record.resource_ledger.actual.scalar_operations, 0,
    ),
    causal_policy_view_utf8_byte_count: run.policy_view_utf8_bytes,
    wall_seconds: null,
    later_joules: null,
  };
  if (
    !exactKeys(workload, WORKLOAD_KEYS)
    || Object.entries(workload).some(([key, value]) => (
      !["wall_seconds", "later_joules"].includes(key) && !positiveSafeInteger(value)
    ))
  ) refuse("fixed-instance workload cannot be accounted exactly");
  return deepFreeze(workload);
}

function verifyPacketBinding(instance, run) {
  const { manifest, packet, parameter_vector: parameterVector } = instance;
  const timeConstant = parameterVector.values.time_constant;
  if (
    packet.instance_id !== manifest.instance_id
    || packet.parameter_vector_sha256 !== manifest.parameter_vector_sha256
    || manifest.fixed_time_constant_s !== timeConstant.numerator / timeConstant.denominator
    || packet.episodes.length !== run.transcript_receipts.length
    || packet.episodes.some((episode) => (
      episode.parameter_vector_sha256 !== manifest.parameter_vector_sha256
      || episode.time_constant_s !== manifest.fixed_time_constant_s
    ))
    || run.transcript_receipts.some((receipt) => (
      receipt.parameter_vector_sha256 !== manifest.parameter_vector_sha256
      || receipt.time_constant.numerator !== timeConstant.numerator
      || receipt.time_constant.denominator !== timeConstant.denominator
      || receipt.time_constant.unit !== timeConstant.unit
    ))
  ) refuse("instance changes family, parameter vector, or time constant across its packet");
  return timeConstant;
}

function appendRecord({ populationRunId, sequence, previous, instance, run }) {
  const timeConstant = verifyPacketBinding(instance, run);
  const body = {
    schema: 1,
    contract_version: FIXTURE_026_RSD_T02_PUBLIC_DEVELOPMENT_POPULATION_RECORD_VERSION,
    sequence,
    previous_record_sha256: previous,
    population_run_id: populationRunId,
    family_id: instance.manifest.family_id,
    family_version: instance.manifest.family_version,
    structural_lineage_id: instance.manifest.structural_lineage_id,
    conformance_draw_index: instance.draw_receipt.draw_index,
    instance_id: instance.manifest.instance_id,
    parameter_vector_sha256: instance.manifest.parameter_vector_sha256,
    fixed_time_constant: {
      numerator: timeConstant.numerator,
      denominator: timeConstant.denominator,
      unit: timeConstant.unit,
    },
    fixed_time_constant_s: instance.manifest.fixed_time_constant_s,
    fixed_packet_id: instance.packet.packet_id,
    one_family_parameter_vector_and_time_constant_across_packet_verified: true,
    episode_count: run.transcript_receipts.length,
    transcript_set_sha256: run.transcript_set_sha256,
    causal_policy_view_sha256: run.policy_view_sha256,
    causal_policy_view_utf8_bytes: run.policy_view_utf8_bytes,
    causal_policy_view_allowlist_verified: true,
    arm_count: run.ledger.length,
    fixed_instance_run_id: run.run_id,
    fixed_instance_run_sha256: digest(run),
    fixed_instance_ledger_head_sha256: run.ledger.at(-1).record_sha256,
    fixed_instance_status: run.status,
    workload: perInstanceWorkload(run),
    causal_view_payload_retained: false,
    fixed_instance_run_payload_retained: false,
    authority: "public-development-population-execution-receipt-only",
    comparison_inference_permitted: false,
    claim_eligible: false,
    result_label: "NO_RESULT",
    no_result: true,
  };
  return deepFreeze({ ...body, record_sha256: digest(body) });
}

function evidenceRetention() {
  return deepFreeze({
    mode: "deterministically-replayed-content-addressed-receipts",
    receipt_revalidation: "full-fixed-instance-replay-from-root-hash-bound-immutable-inputs",
    content_addressed_receipts: true,
    causal_view_payloads_retained: false,
    full_fixed_instance_runs_retained: false,
    standalone_fixed_run_revalidation_possible: true,
    external_or_durable_chain_head_bound: false,
    rollback_detection_without_external_head: false,
  });
}

function promotionGates() {
  return deepFreeze({ closed: [...CLOSED_GATES], open: [...OPEN_GATES] });
}

function artifactFrom({ request, context, records }) {
  const body = {
    schema: 1,
    contract_version: FIXTURE_026_RSD_T02_PUBLIC_DEVELOPMENT_POPULATION_RUNNER_VERSION,
    status: records.length === context.instances.length ? "complete" : "partial",
    population_run_id: context.populationRunId,
    config_sha256: FIXTURE_026_RSD_T02_PUBLIC_DEVELOPMENT_POPULATION_RUNNER_CONFIG_SHA256,
    population_design_sha256: FIXTURE_026_RSD_T02_POPULATION_DESIGN_SHA256,
    family_registry_sha256: FIXTURE_026_RSD_T02_FAMILY_REGISTRY_SHA256,
    family_registry_identity_sha256: request.registry.family_registry_identity_sha256,
    development_plan_sha256: FIXTURE_026_RSD_T02_DEVELOPMENT_PLAN_SHA256,
    fixed_instance_runner_config_sha256:
      FIXTURE_026_RSD_T02_FIXED_INSTANCE_RUNNER_CONFIG_SHA256,
    partition: "development",
    panel: panelMetadata(
      request.config,
      request.registry,
      request.fixed_instance_runner_config,
      context.panel,
      context.instances,
    ),
    aggregation_metadata: aggregationMetadata(
      request.config,
      request.registry,
      context.instances,
    ),
    records,
    next_instance_index: records.length,
    workload: addWorkloads(records),
    evidence_retention: evidenceRetention(),
    promotion_gates: promotionGates(),
    outer_family_generation_performed: false,
    outer_instance_generation_performed: false,
    private_or_sealed_payload_accessed: false,
    authority: "public-development-population-execution-foundation-only",
    comparison_inference_permitted: false,
    claim_eligible: false,
    result_label: "NO_RESULT",
    no_result: true,
  };
  return deepFreeze({ ...body, artifact_sha256: digest(body) });
}

function assertWorkload(workload, allowZero = false) {
  if (
    !exactKeys(workload, WORKLOAD_KEYS)
    || workload.wall_seconds !== null
    || workload.later_joules !== null
    || Object.entries(workload).some(([key, value]) => (
      !["wall_seconds", "later_joules"].includes(key)
      && (!Number.isSafeInteger(value) || value < (allowZero ? 0 : 1))
    ))
  ) refuse("workload ledger is malformed");
}

function deterministicFixedInstanceReplay({
  fixedInstanceRunnerConfig,
  registry,
  instance,
  verifiedRuns,
}) {
  const instanceId = instance.manifest.instance_id;
  let run = verifiedRuns.get(instanceId);
  if (run === undefined) {
    run = runFixture026RsdT02FixedInstance({
      config: fixedInstanceRunnerConfig,
      registry,
      instance,
    });
    if (run.status !== "complete") refuse(`fixed-instance replay ${instanceId} did not complete`);
    verifiedRuns.set(instanceId, run);
  }
  return run;
}

function assertRecord({
  record,
  sequence,
  previous,
  populationRunId,
  instance,
  fixedInstanceRunnerConfig,
  registry,
  verifiedRuns,
}) {
  const timeConstant = instance.parameter_vector.values.time_constant;
  const packetRealizationCount = instance.packet.episodes.reduce(
    (sum, episode) => sum + episode.realization_ids.length, 0,
  );
  if (
    !exactKeys(record, RECORD_KEYS)
    || record.schema !== 1
    || record.contract_version
      !== FIXTURE_026_RSD_T02_PUBLIC_DEVELOPMENT_POPULATION_RECORD_VERSION
    || record.sequence !== sequence
    || record.previous_record_sha256 !== previous
    || record.population_run_id !== populationRunId
    || record.family_id !== instance.manifest.family_id
    || record.family_version !== instance.manifest.family_version
    || record.structural_lineage_id !== instance.manifest.structural_lineage_id
    || record.conformance_draw_index !== instance.draw_receipt.draw_index
    || record.instance_id !== instance.manifest.instance_id
    || record.parameter_vector_sha256 !== instance.manifest.parameter_vector_sha256
    || canonicalize(record.fixed_time_constant) !== canonicalize({
      numerator: timeConstant.numerator,
      denominator: timeConstant.denominator,
      unit: timeConstant.unit,
    })
    || record.fixed_time_constant_s !== instance.manifest.fixed_time_constant_s
    || record.fixed_packet_id !== instance.packet.packet_id
    || record.one_family_parameter_vector_and_time_constant_across_packet_verified !== true
    || record.episode_count !== instance.packet.episodes.length
    || !HASH_PATTERN.test(record.transcript_set_sha256)
    || !HASH_PATTERN.test(record.causal_policy_view_sha256)
    || !positiveSafeInteger(record.causal_policy_view_utf8_bytes)
    || record.causal_policy_view_allowlist_verified !== true
    || record.arm_count !== fixedInstanceRunnerConfig.arm_ids.length
    || record.arm_count !== 9
    || !HASH_PATTERN.test(record.fixed_instance_run_id)
    || !HASH_PATTERN.test(record.fixed_instance_run_sha256)
    || !HASH_PATTERN.test(record.fixed_instance_ledger_head_sha256)
    || record.fixed_instance_status !== "complete"
    || record.causal_view_payload_retained !== false
    || record.fixed_instance_run_payload_retained !== false
    || record.no_result !== true
  ) refuse(`population record ${sequence} changes identity, packet, view, or authority`);
  assertNoResultRoot(record, "public-development-population-execution-receipt-only");
  assertWorkload(record.workload);
  if (
    record.workload.system_instance_count !== 1
    || record.workload.episode_count !== record.episode_count
    || record.workload.episode_count !== instance.packet.episodes.length
    || record.workload.realization_count !== packetRealizationCount
    || record.workload.transcript_sample_row_count
      !== fixedInstanceRunnerConfig.transcript_contract.sample_rows_per_packet
    || record.workload.arm_invocation_count !== record.arm_count
    || record.workload.arm_sample_row_read_count
      !== record.workload.transcript_sample_row_count * record.arm_count
    || record.workload.causal_policy_view_utf8_byte_count
      !== record.causal_policy_view_utf8_bytes
  ) refuse(`population record ${sequence} has contradictory workload counters`);
  const replay = deterministicFixedInstanceReplay({
    fixedInstanceRunnerConfig,
    registry,
    instance,
    verifiedRuns,
  });
  const expected = appendRecord({
    populationRunId,
    sequence,
    previous,
    instance,
    run: replay,
  });
  if (canonicalize(record) !== canonicalize(expected)) {
    refuse(`population record ${sequence} is not the exact deterministic replay receipt`);
  }
  return record;
}

function validatePopulationArtifact({ request, context, artifact, verifiedRuns }) {
  const {
    config,
    registry,
    fixed_instance_runner_config: fixedInstanceRunnerConfig,
  } = request;
  if (
    !exactKeys(artifact, ARTIFACT_KEYS)
    || artifact.schema !== 1
    || artifact.contract_version
      !== FIXTURE_026_RSD_T02_PUBLIC_DEVELOPMENT_POPULATION_RUNNER_VERSION
    || !["partial", "complete"].includes(artifact.status)
    || artifact.population_run_id !== context.populationRunId
    || artifact.config_sha256
      !== FIXTURE_026_RSD_T02_PUBLIC_DEVELOPMENT_POPULATION_RUNNER_CONFIG_SHA256
    || artifact.population_design_sha256 !== FIXTURE_026_RSD_T02_POPULATION_DESIGN_SHA256
    || artifact.family_registry_sha256 !== FIXTURE_026_RSD_T02_FAMILY_REGISTRY_SHA256
    || artifact.family_registry_identity_sha256 !== registry.family_registry_identity_sha256
    || artifact.development_plan_sha256 !== FIXTURE_026_RSD_T02_DEVELOPMENT_PLAN_SHA256
    || artifact.fixed_instance_runner_config_sha256
      !== FIXTURE_026_RSD_T02_FIXED_INSTANCE_RUNNER_CONFIG_SHA256
    || artifact.partition !== "development"
    || !Array.isArray(artifact.records)
    || artifact.records.length < 1
    || artifact.records.length > context.instances.length
    || artifact.next_instance_index !== artifact.records.length
    || artifact.status !== (
      artifact.records.length === context.instances.length ? "complete" : "partial"
    )
    || artifact.outer_family_generation_performed !== false
    || artifact.outer_instance_generation_performed !== false
    || artifact.private_or_sealed_payload_accessed !== false
    || artifact.no_result !== true
  ) refuse("population artifact violates its closed public-development root contract");
  assertNoResultRoot(artifact, "public-development-population-execution-foundation-only");
  if (
    !exactKeys(artifact.panel, PANEL_KEYS)
    || canonicalize(artifact.panel) !== canonicalize(panelMetadata(
      config, registry, fixedInstanceRunnerConfig, context.panel, context.instances,
    ))
    || !exactKeys(artifact.aggregation_metadata, AGGREGATION_KEYS)
    || artifact.aggregation_metadata.family_weights.some(
      (weight) => !exactKeys(weight, FAMILY_WEIGHT_KEYS),
    )
    || canonicalize(artifact.aggregation_metadata)
      !== canonicalize(aggregationMetadata(config, registry, context.instances))
    || !exactKeys(artifact.evidence_retention, EVIDENCE_KEYS)
    || canonicalize(artifact.evidence_retention) !== canonicalize(evidenceRetention())
    || !exactKeys(artifact.promotion_gates, GATE_KEYS)
    || canonicalize(artifact.promotion_gates) !== canonicalize(promotionGates())
  ) refuse("population metadata changes the frozen panel, weights, evidence, or gates");
  assertWorkload(artifact.workload);
  if (canonicalize(artifact.workload) !== canonicalize(addWorkloads(artifact.records))) {
    refuse("population workload is not the exact sum of its instance receipts");
  }
  let previous = ZERO_HASH;
  for (const [sequence, record] of artifact.records.entries()) {
    assertRecord({
      record,
      sequence,
      previous,
      populationRunId: context.populationRunId,
      instance: context.instances[sequence],
      fixedInstanceRunnerConfig,
      registry,
      verifiedRuns,
    });
    previous = record.record_sha256;
  }
  const body = { ...artifact };
  delete body.artifact_sha256;
  if (artifact.artifact_sha256 !== digest(body)) refuse("population artifact hash is false");
  return artifact;
}

export function assertFixture026RsdT02PublicDevelopmentPopulationRunArtifact({
  config,
  population_design: populationDesign,
  registry,
  plan,
  fixed_instance_runner_config: fixedInstanceRunnerConfig,
  artifact,
}) {
  const request = {
    config,
    population_design: populationDesign,
    registry,
    plan,
    fixed_instance_runner_config: fixedInstanceRunnerConfig,
  };
  const context = contextFor(request);
  return validatePopulationArtifact({
    request,
    context,
    artifact,
    verifiedRuns: new Map(),
  });
}

export function runFixture026RsdT02PublicDevelopmentPopulation(request) {
  const context = contextFor(request);
  const verifiedRuns = new Map();
  let records = [];
  if (Object.hasOwn(request, "prior_artifact")) {
    validatePopulationArtifact({
      request,
      context,
      artifact: request.prior_artifact,
      verifiedRuns,
    });
    records = [...request.prior_artifact.records];
  }
  const remaining = context.instances.length - records.length;
  if (remaining === 0) return request.prior_artifact;
  const requested = Object.hasOwn(request, "max_new_instance_records")
    ? request.max_new_instance_records
    : Math.min(
      remaining,
      request.config.execution_contract.maximum_new_instance_records_per_invocation,
    );
  if (!positiveSafeInteger(requested) || requested > remaining) {
    refuse("append count exceeds the remaining public-development instances");
  }
  for (let offset = 0; offset < requested; offset += 1) {
    const sequence = records.length;
    const instance = context.instances[sequence];
    const run = runFixture026RsdT02FixedInstance({
      config: request.fixed_instance_runner_config,
      registry: request.registry,
      instance,
    });
    if (run.status !== "complete") refuse(`fixed-instance run ${sequence} did not complete`);
    verifiedRuns.set(instance.manifest.instance_id, run);
    records.push(appendRecord({
      populationRunId: context.populationRunId,
      sequence,
      previous: records.at(-1)?.record_sha256 ?? ZERO_HASH,
      instance,
      run,
    }));
  }
  const artifact = artifactFrom({ request, context, records: deepFreeze(records) });
  return validatePopulationArtifact({
    request,
    context,
    artifact,
    verifiedRuns,
  });
}
