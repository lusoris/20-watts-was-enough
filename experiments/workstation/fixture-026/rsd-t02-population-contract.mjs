import { canonicalize, sha256Hex } from "../lib/checkpoint-ledger.mjs";

export const FIXTURE_026_RSD_T02_POPULATION_DESIGN_VERSION =
  "fixture-026.rsd-t02-population-design.v1";
export const FIXTURE_026_RSD_T02_FIXED_PACKET_VERSION =
  "fixture-026.rsd-t02-fixed-instance-packet.v1";
export const FIXTURE_026_RSD_T02_SYSTEM_INSTANCE_ID_VERSION =
  "fixture-026.rsd-t02-system-instance-identity.v1";
export const FIXTURE_026_RSD_T02_POPULATION_DESIGN_SHA256 =
  "28530f3c35e5e12dfa0601ffe2ca674a54ff5d448d966764a1c7103a0204e7ee";

const FAMILY_PARTITIONS = Object.freeze([
  "development", "outer-confirmation", "outer-transfer",
]);
const PAYLOAD_STATE_BY_PARTITION = Object.freeze({
  development: "public-development",
  "outer-confirmation": "sealed-evaluator-custody",
  "outer-transfer": "sealed-evaluator-custody",
});
const FAMILY_ASSIGNMENT_KEYS = Object.freeze([
  "family_id", "family_version", "structural_lineage_id",
  "full_panel_equivalence_group", "partition", "payload_state",
  "current_public_recipe",
]);
const INSTANCE_MANIFEST_KEYS = Object.freeze([
  "schema", "contract_version", "partition", "family_id", "family_version",
  "structural_lineage_id", "instance_id", "instance_identity_basis",
  "parameter_vector_sha256", "fixed_time_constant_s", "nuisance_vector_sha256",
  "property_certificate_set_sha256", "pre_response_valid", "independent_system_unit",
  "procedural_seed", "procedural_seed_role", "procedural_seed_in_identity",
  "comparison_inference_permitted", "claim_eligible", "result_label",
]);
const SYSTEM_INSTANCE_IDENTITY_KEYS = Object.freeze([
  "family_id", "family_version", "structural_lineage_id",
  "parameter_vector_sha256", "fixed_time_constant_s", "nuisance_vector_sha256",
  "property_certificate_set_sha256",
]);
const PACKET_KEYS = Object.freeze([
  "schema", "contract_version", "packet_version", "instance_id", "packet_id",
  "parameter_vector_sha256", "episodes", "comparison_inference_permitted",
  "claim_eligible", "result_label",
]);
const PACKET_EPISODE_KEYS = Object.freeze([
  "episode_id", "parameter_vector_sha256", "time_constant_s", "realization_ids",
]);
const EFFECTIVE_UNIT_RECORD_KEYS = Object.freeze([
  "partition", "structural_lineage_id", "family_id", "instance_id", "packet_id",
  "episode_id", "realization_id", "procedural_seed", "row_count",
]);

function exactKeys(value, keys) {
  return value
    && typeof value === "object"
    && !Array.isArray(value)
    && Object.keys(value).length === keys.length
    && keys.every((key) => Object.hasOwn(value, key));
}

function canonicalIdentifier(value) {
  return typeof value === "string"
    && /^[A-Za-z0-9][A-Za-z0-9._-]{2,127}$/u.test(value);
}

function sha256(value) {
  return typeof value === "string" && /^[0-9a-f]{64}$/u.test(value);
}

function canonicalSeedOrNull(value) {
  return value === null || (
    typeof value === "string"
    && /^(0|[1-9][0-9]{0,19})$/u.test(value)
    && BigInt(value) <= 0xffff_ffff_ffff_ffffn
  );
}

function finitePositive(value) {
  return Number.isFinite(value) && value > 0;
}

function refuse(message) {
  throw new Error(`Fixture 026 RSD-T02 population contract refused: ${message}`);
}

export function fixture026RsdT02PopulationSystemInstanceId(identity) {
  if (
    !exactKeys(identity, SYSTEM_INSTANCE_IDENTITY_KEYS)
    || !canonicalIdentifier(identity.family_id)
    || !Number.isSafeInteger(identity.family_version)
    || identity.family_version < 1
    || !canonicalIdentifier(identity.structural_lineage_id)
    || !sha256(identity.parameter_vector_sha256)
    || !finitePositive(identity.fixed_time_constant_s)
    || !sha256(identity.nuisance_vector_sha256)
    || !sha256(identity.property_certificate_set_sha256)
  ) refuse("system-instance identity inputs are invalid");
  return sha256Hex(canonicalize({
    schema: 1,
    contract_version: FIXTURE_026_RSD_T02_SYSTEM_INSTANCE_ID_VERSION,
    artifact: "fixture-026",
    track: "RSD-T02",
    ...identity,
  }));
}

export function assertFixture026RsdT02PopulationDesign(design) {
  if (!design || typeof design !== "object" || Array.isArray(design)) {
    refuse("design must be an object");
  }
  let digest;
  try {
    digest = sha256Hex(canonicalize(design));
  } catch {
    refuse("design is not canonically serializable");
  }
  if (
    digest !== FIXTURE_026_RSD_T02_POPULATION_DESIGN_SHA256
    || design.contract_version !== FIXTURE_026_RSD_T02_POPULATION_DESIGN_VERSION
    || design.authority !== "prospective-fixed-finite-family-panel-design-only"
    || design.population_scope?.mode !== "fixed-finite-family-panel"
    || design.population_scope?.out_of_panel_family_generalization_permitted !== false
    || design.experimental_unit_contract?.primary_independent_unit !== "system-instance"
    || design.parent_stage3?.procedural_seeds_are_independent_systems !== false
    || design.parent_stage3?.procedural_seed_inference_permitted !== false
    || design.packet_contract?.time_constant_changes_within_packet_permitted !== false
    || design.property_contract?.invariant_primary_exclusions?.length !== 1
    || design.property_contract.invariant_primary_exclusions[0] !== "causal_memory"
    || design.property_contract.primary_scored_property_keys.includes("causal_memory")
    || design.endpoint_contract?.multiplicity_family_size !== 4
    || design.endpoint_contract?.multiplicity_rule
      !== "holm-over-all-four-fixed-primary-hypotheses"
    || design.power_contract?.promotion_blocked !== true
    || design.custody_contract?.release_or_confirmation_authority_exists !== false
    || design.comparison_inference_permitted !== false
    || design.claim_eligible !== false
    || design.result_label !== "NO_RESULT"
  ) refuse("design differs from the closed prospective NO_RESULT contract");
  return design;
}

export function assertFixture026RsdT02PopulationParentStage3({ design, stage3Bytes }) {
  assertFixture026RsdT02PopulationDesign(design);
  if (!(stage3Bytes instanceof Uint8Array)) refuse("Stage-3 source must be exact bytes");
  if (sha256Hex(stage3Bytes) !== design.parent_stage3.sha256) {
    refuse("Stage-3 parent bytes differ from the frozen parent hash");
  }
  let stage3;
  try {
    stage3 = JSON.parse(Buffer.from(stage3Bytes).toString("utf8"));
  } catch {
    refuse("Stage-3 parent is not valid JSON");
  }
  if (
    stage3.contract_version !== design.parent_stage3.contract_version
    || stage3.replication_boundary?.current_seeds_are_independent_scientific_units !== false
    || stage3.replication_boundary?.seed_level_inferential_replication_permitted !== false
    || stage3.replication_boundary?.future_unit_of_analysis
      !== "independently-generated-held-out-system-instance"
    || stage3.information_cut?.roles?.length !== 3
    || stage3.information_cut.roles[0]?.role !== "fit"
    || stage3.information_cut.roles[0]?.count !== 32
    || stage3.information_cut.roles[1]?.role !== "calibration"
    || stage3.information_cut.roles[1]?.count !== 16
    || stage3.information_cut.roles[2]?.role !== "evaluation"
    || stage3.information_cut.roles[2]?.count !== 16
    || stage3.comparison_inference_permitted !== false
    || stage3.claim_eligible !== false
    || stage3.result_label !== "NO_RESULT"
  ) refuse("Stage-3 parent semantics differ from the population-design premise");
  return true;
}

export function assertFixture026RsdT02PopulationFamilyAssignments(design, assignments) {
  assertFixture026RsdT02PopulationDesign(design);
  if (!Array.isArray(assignments) || assignments.length < FAMILY_PARTITIONS.length) {
    refuse("family assignments must contain every required partition");
  }
  const familyIds = new Set();
  const presentPartitions = new Set();
  const lineagePartitions = new Map();
  const equivalencePartitions = new Map();
  for (const [index, assignment] of assignments.entries()) {
    if (
      !exactKeys(assignment, FAMILY_ASSIGNMENT_KEYS)
      || !canonicalIdentifier(assignment.family_id)
      || !Number.isSafeInteger(assignment.family_version)
      || assignment.family_version < 1
      || !canonicalIdentifier(assignment.structural_lineage_id)
      || !canonicalIdentifier(assignment.full_panel_equivalence_group)
      || !FAMILY_PARTITIONS.includes(assignment.partition)
      || assignment.payload_state !== PAYLOAD_STATE_BY_PARTITION[assignment.partition]
      || typeof assignment.current_public_recipe !== "boolean"
    ) refuse(`invalid family assignment at index ${index}`);
    if (familyIds.has(assignment.family_id)) refuse(`duplicate family ID ${assignment.family_id}`);
    familyIds.add(assignment.family_id);
    presentPartitions.add(assignment.partition);
    if (assignment.partition !== "development" && assignment.current_public_recipe) {
      refuse("a current public recipe cannot serve as an outer holdout family");
    }
    for (const [map, key, label] of [
      [lineagePartitions, assignment.structural_lineage_id, "structural lineage"],
      [equivalencePartitions, assignment.full_panel_equivalence_group, "full-panel equivalence group"],
    ]) {
      const previous = map.get(key);
      if (previous !== undefined && previous !== assignment.partition) {
        refuse(`${label} ${key} leaks across family partitions`);
      }
      map.set(key, assignment.partition);
    }
  }
  if (!FAMILY_PARTITIONS.every((partition) => presentPartitions.has(partition))) {
    refuse("family assignments leave a required partition empty");
  }
  return assignments;
}

export function assertFixture026RsdT02PopulationInstanceManifest({
  design,
  familyAssignments,
  manifest,
}) {
  const assignments = assertFixture026RsdT02PopulationFamilyAssignments(
    design, familyAssignments,
  );
  if (
    !exactKeys(manifest, INSTANCE_MANIFEST_KEYS)
    || manifest.schema !== 1
    || manifest.contract_version !== FIXTURE_026_RSD_T02_POPULATION_DESIGN_VERSION
    || !FAMILY_PARTITIONS.includes(manifest.partition)
    || !canonicalIdentifier(manifest.family_id)
    || !Number.isSafeInteger(manifest.family_version)
    || manifest.family_version < 1
    || !canonicalIdentifier(manifest.structural_lineage_id)
    || !sha256(manifest.instance_id)
    || manifest.instance_identity_basis
      !== "sha256-canonical-system-instance-identity-v1"
    || !sha256(manifest.parameter_vector_sha256)
    || !finitePositive(manifest.fixed_time_constant_s)
    || !sha256(manifest.nuisance_vector_sha256)
    || !sha256(manifest.property_certificate_set_sha256)
    || manifest.pre_response_valid !== true
    || manifest.independent_system_unit !== true
    || !canonicalSeedOrNull(manifest.procedural_seed)
    || manifest.procedural_seed_role !== "software-and-algorithmic-replay-key-only"
    || manifest.procedural_seed_in_identity !== false
    || manifest.comparison_inference_permitted !== false
    || manifest.claim_eligible !== false
    || manifest.result_label !== "NO_RESULT"
  ) refuse("invalid system-instance manifest");
  const family = assignments.find((assignment) => assignment.family_id === manifest.family_id);
  if (
    !family
    || family.family_version !== manifest.family_version
    || family.partition !== manifest.partition
    || family.structural_lineage_id !== manifest.structural_lineage_id
  ) refuse("instance manifest does not bind exactly one assigned family");
  const expectedInstanceId = fixture026RsdT02PopulationSystemInstanceId(
    Object.fromEntries(SYSTEM_INSTANCE_IDENTITY_KEYS.map((key) => [key, manifest[key]])),
  );
  if (manifest.instance_id !== expectedInstanceId) {
    refuse("instance ID does not match its canonical scientific identity");
  }
  return manifest;
}

export function assertFixture026RsdT02PopulationInstancePacket({
  design,
  familyAssignments,
  manifest,
  packet,
}) {
  assertFixture026RsdT02PopulationInstanceManifest({
    design, familyAssignments, manifest,
  });
  if (
    !exactKeys(packet, PACKET_KEYS)
    || packet.schema !== 1
    || packet.contract_version !== FIXTURE_026_RSD_T02_POPULATION_DESIGN_VERSION
    || packet.packet_version !== FIXTURE_026_RSD_T02_FIXED_PACKET_VERSION
    || packet.instance_id !== manifest.instance_id
    || !sha256(packet.packet_id)
    || packet.parameter_vector_sha256 !== manifest.parameter_vector_sha256
    || !Array.isArray(packet.episodes)
    || packet.episodes.length < 1
    || packet.comparison_inference_permitted !== false
    || packet.claim_eligible !== false
    || packet.result_label !== "NO_RESULT"
  ) refuse("invalid fixed-parameter instance packet");
  const episodeIds = new Set();
  for (const [index, episode] of packet.episodes.entries()) {
    if (
      !exactKeys(episode, PACKET_EPISODE_KEYS)
      || !canonicalIdentifier(episode.episode_id)
      || episode.parameter_vector_sha256 !== manifest.parameter_vector_sha256
      || episode.time_constant_s !== manifest.fixed_time_constant_s
      || !Array.isArray(episode.realization_ids)
      || episode.realization_ids.length < 1
      || episode.realization_ids.some((id) => !canonicalIdentifier(id))
      || new Set(episode.realization_ids).size !== episode.realization_ids.length
    ) refuse(`episode ${index} changes the system instance or is malformed`);
    if (episodeIds.has(episode.episode_id)) refuse(`duplicate episode ${episode.episode_id}`);
    episodeIds.add(episode.episode_id);
  }
  return packet;
}

export function summarizeFixture026RsdT02PopulationEffectiveUnits({
  design,
  familyAssignments,
  instanceManifests,
  records,
}) {
  const assignments = assertFixture026RsdT02PopulationFamilyAssignments(
    design, familyAssignments,
  );
  if (!Array.isArray(instanceManifests) || instanceManifests.length < 1) {
    refuse("validated instance manifests are required for effective-unit accounting");
  }
  const manifestByInstanceId = new Map();
  for (const manifest of instanceManifests) {
    assertFixture026RsdT02PopulationInstanceManifest({
      design,
      familyAssignments: assignments,
      manifest,
    });
    if (manifestByInstanceId.has(manifest.instance_id)) {
      refuse(`duplicate system-instance manifest ${manifest.instance_id}`);
    }
    manifestByInstanceId.set(manifest.instance_id, manifest);
  }
  if (!Array.isArray(records) || records.length < 1) refuse("effective-unit records are required");
  const lineageIds = new Set();
  const familyIds = new Set();
  const instanceIds = new Set();
  const packetIds = new Set();
  const episodeIds = new Set();
  const realizationIds = new Set();
  const proceduralSeeds = new Set();
  const recordIds = new Set();
  const familyBindings = new Map();
  const instanceBindings = new Map();
  const packetBindings = new Map();
  let rows = 0;
  for (const [index, record] of records.entries()) {
    if (
      !exactKeys(record, EFFECTIVE_UNIT_RECORD_KEYS)
      || !FAMILY_PARTITIONS.includes(record.partition)
      || !canonicalIdentifier(record.structural_lineage_id)
      || !canonicalIdentifier(record.family_id)
      || !sha256(record.instance_id)
      || !sha256(record.packet_id)
      || !canonicalIdentifier(record.episode_id)
      || !canonicalIdentifier(record.realization_id)
      || !canonicalSeedOrNull(record.procedural_seed)
      || !Number.isSafeInteger(record.row_count)
      || record.row_count < 1
    ) refuse(`invalid effective-unit record at index ${index}`);
    const manifest = manifestByInstanceId.get(record.instance_id);
    if (
      !manifest
      || record.partition !== manifest.partition
      || record.structural_lineage_id !== manifest.structural_lineage_id
      || record.family_id !== manifest.family_id
    ) refuse(`effective-unit record ${index} differs from its validated instance manifest`);
    const familyBinding = `${record.partition}:${record.structural_lineage_id}`;
    const instanceBinding = `${record.partition}:${record.structural_lineage_id}:${record.family_id}`;
    const previousFamily = familyBindings.get(record.family_id);
    const previousInstance = instanceBindings.get(record.instance_id);
    const previousPacket = packetBindings.get(record.packet_id);
    if (previousFamily !== undefined && previousFamily !== familyBinding) {
      refuse(`family ${record.family_id} changes lineage or partition`);
    }
    if (previousInstance !== undefined && previousInstance !== instanceBinding) {
      refuse(`instance ${record.instance_id} changes family, lineage, or partition`);
    }
    if (previousPacket !== undefined && previousPacket !== record.instance_id) {
      refuse(`packet ${record.packet_id} changes system instance`);
    }
    familyBindings.set(record.family_id, familyBinding);
    instanceBindings.set(record.instance_id, instanceBinding);
    packetBindings.set(record.packet_id, record.instance_id);
    const episodeKey = `${record.instance_id}:${record.episode_id}`;
    const realizationKey = `${episodeKey}:${record.realization_id}`;
    const recordKey = `${realizationKey}:${record.packet_id}`;
    if (recordIds.has(recordKey)) refuse(`duplicate effective-unit record ${recordKey}`);
    recordIds.add(recordKey);
    lineageIds.add(record.structural_lineage_id);
    familyIds.add(record.family_id);
    instanceIds.add(record.instance_id);
    packetIds.add(record.packet_id);
    episodeIds.add(episodeKey);
    realizationIds.add(realizationKey);
    if (record.procedural_seed !== null) proceduralSeeds.add(record.procedural_seed);
    rows += record.row_count;
    if (!Number.isSafeInteger(rows)) refuse("row count exceeds safe integer range");
  }
  return Object.freeze({
    inferential_unit: "system-instance",
    structural_lineage_n: lineageIds.size,
    family_n: familyIds.size,
    effective_system_instance_n: instanceIds.size,
    packet_n: packetIds.size,
    episode_n: episodeIds.size,
    realization_n: realizationIds.size,
    procedural_seed_n: proceduralSeeds.size,
    row_n: rows,
    family_superpopulation_inference_permitted: false,
    comparison_inference_permitted: false,
    claim_eligible: false,
    result_label: "NO_RESULT",
  });
}

export function assertFixture026RsdT02PopulationComparisonAuthority(design) {
  assertFixture026RsdT02PopulationDesign(design);
  refuse(
    "prospective design has no comparison authority; power, custody, mature nulls and private confirmation remain blocked",
  );
}
