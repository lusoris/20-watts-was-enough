import { createHmac } from "node:crypto";

import { canonicalize, sha256Hex } from "../lib/checkpoint-ledger.mjs";
import {
  FIXTURE_026_RSD_T02_CONTRACT_VERSION,
  FIXTURE_026_RSD_T02_EPISODES,
  FIXTURE_026_RSD_T02_EPISODE_PROTOCOL,
  FIXTURE_026_RSD_T02_EPISODE_PROTOCOL_VERSION,
  FIXTURE_026_RSD_T02_EQUATION_CERTIFICATES,
  FIXTURE_026_RSD_T02_EQUATION_TEMPLATES,
  FIXTURE_026_RSD_T02_EQUATION_TEMPLATE_VERSION,
  FIXTURE_026_RSD_T02_RECIPES,
} from "./rsd-t02-contract.mjs";
import {
  FIXTURE_026_RSD_T02_FIXED_PACKET_VERSION,
  FIXTURE_026_RSD_T02_POPULATION_DESIGN_VERSION,
  fixture026RsdT02PopulationSystemInstanceId,
} from "./rsd-t02-population-contract.mjs";

export const FIXTURE_026_RSD_T02_FAMILY_REGISTRY_VERSION =
  "fixture-026.rsd-t02-system-family-registry.v1";
export const FIXTURE_026_RSD_T02_DEVELOPMENT_PLAN_VERSION =
  "fixture-026.rsd-t02-development-instance-plan.v1";
export const FIXTURE_026_RSD_T02_FAMILY_GENERATOR_VERSION =
  "fixture-026.rsd-t02-system-family-generator.v1";
export const FIXTURE_026_RSD_T02_FAMILY_REGISTRY_SHA256 =
  "a6b573bc5a27943b77c4969b823b4ad852b9ee6a3ec5a314862419d6219c04c0";
export const FIXTURE_026_RSD_T02_DEVELOPMENT_PLAN_SHA256 =
  "ab4a85f382940f268bc7fc6f19c2bddbda151a67051c44e9e9e93c0e2e70c6c8";
export const FIXTURE_026_RSD_T02_EPISODE_PROTOCOL_SHA256 =
  "25ce50ae6a6890e7591a499e46731e318fd0e7cb9bc591096c8fc7cdfff813d3";

const FAMILY_KEYS = Object.freeze([
  "family_id", "family_version", "recipe_id", "equation_id",
  "equation_template_version", "equation_template_sha256",
  "structural_lineage_id", "full_panel_equivalence_group",
  "property_certificate", "fixed_parameters", "parameter_distribution",
  "validity_gates",
]);
const PROPERTY_CERTIFICATE_KEYS = Object.freeze([
  "equation_id", "certificate_id", "certificate_basis", "property_vector",
]);
const TIME_CONSTANT_DISTRIBUTION_KEYS = Object.freeze([
  "distribution", "minimum", "maximum", "unit",
]);
const PLAN_KEYS = Object.freeze([
  "schema", "contract_version", "registry_contract_version", "partition",
  "family_registry_identity_sha256",
  "panel_mode", "conformance_draw_indices", "conformance_draws_per_family",
  "family_count", "constructed_artifact_count",
  "conformance_draw_indices_are_independent_systems",
  "duplicate_canonical_instance_ids_count_once", "execute_model_trajectories",
  "comparison_inference_permitted", "claim_eligible", "result_label",
]);

function exactKeys(value, keys) {
  return value
    && typeof value === "object"
    && !Array.isArray(value)
    && Object.keys(value).length === keys.length
    && keys.every((key) => Object.hasOwn(value, key));
}

function refuse(message) {
  throw new Error(`Fixture 026 RSD-T02 family generator refused: ${message}`);
}

function digest(value) {
  try {
    return sha256Hex(canonicalize(value));
  } catch {
    refuse("input is not canonically serializable");
  }
}

function familyById(registry, familyId) {
  const family = registry.families.find(({ family_id: registeredId }) => (
    registeredId === familyId
  ));
  if (!family) refuse(`unknown development family ${familyId}`);
  return family;
}

function expectedFixedParameters(equationId) {
  const base = {
    canonical_fold: { numerator: 2, denominator: 1, unit: "1" },
  };
  if (equationId === "t02-nonlinear-output-feedback") {
    base.feedback_nonlinearity = { numerator: 1, denominator: 4, unit: "1" };
  }
  return base;
}

function scientificFamilyDefinition(family) {
  return {
    family_id: family.family_id,
    family_version: family.family_version,
    structural_lineage_id: family.structural_lineage_id,
    full_panel_equivalence_group: family.full_panel_equivalence_group,
    equation_id: family.equation_id,
    equation_template_version: family.equation_template_version,
    equation_template_sha256: family.equation_template_sha256,
    property_certificate: family.property_certificate,
    fixed_parameters: family.fixed_parameters,
    parameter_distribution: family.parameter_distribution,
    validity_gates: family.validity_gates,
  };
}

export function fixture026RsdT02FamilyRegistryIdentitySha256(registry) {
  if (!Array.isArray(registry?.families)) refuse("family registry identity needs families");
  return digest({
    contract_version: registry.contract_version,
    registry_id: registry.registry_id,
    families: registry.families.map(scientificFamilyDefinition),
  });
}

export function assertFixture026RsdT02SystemFamilyRegistry(registry) {
  if (
    digest(registry) !== FIXTURE_026_RSD_T02_FAMILY_REGISTRY_SHA256
    || registry?.schema !== 1
    || registry.contract_version !== FIXTURE_026_RSD_T02_FAMILY_REGISTRY_VERSION
    || registry.artifact !== "fixture-026"
    || registry.track !== "RSD-T02"
    || registry.authority !== "public-development-fixed-parameter-generation-only"
    || registry.partition !== "development"
    || registry.payload_state !== "public-development"
    || registry.population_design_binding?.contract_version
      !== FIXTURE_026_RSD_T02_POPULATION_DESIGN_VERSION
    || registry.population_design_binding?.canonical_sha256
      !== "28530f3c35e5e12dfa0601ffe2ca674a54ff5d448d966764a1c7103a0204e7ee"
    || registry.population_design_binding?.exact_bytes_sha256
      !== "1e65c501eb9efe2cd6cef6b79f250378b05b845efc6d519b3451d454e7f80fc9"
    || registry.implementation_provenance?.equation_template_contract_version
      !== FIXTURE_026_RSD_T02_EQUATION_TEMPLATE_VERSION
    || registry.implementation_provenance?.model_source_path !== "rsd-t02-models.mjs"
    || registry.implementation_provenance?.model_source_sha256_exact_bytes
      !== "011adacd5f53628d14d35549b57c67eb219184c82f93e8c81410cb0b9ffdd4c2"
    || registry.implementation_provenance?.model_source_role
      !== "provenance-only-no-trajectory-execution"
    || registry.family_registry_identity_sha256
      !== fixture026RsdT02FamilyRegistryIdentitySha256(registry)
    || registry.family_superpopulation_inference_permitted !== false
    || registry.generator_contract?.domain !== FIXTURE_026_RSD_T02_FAMILY_GENERATOR_VERSION
    || registry.generator_contract?.algorithm
      !== "domain-separated-HMAC-SHA256-discrete-uniform-v1"
    || registry.generator_contract?.draw_index_encoding
      !== "canonical-json-unsigned-32-bit-integer-in-preimage"
    || !/^[0-9a-f]{64}$/u.test(registry.generator_contract?.public_root_key_hex ?? "")
    || registry.generator_contract?.draw_index_is_scientific_unit !== false
    || registry.generator_contract?.maximum_draws_per_requested_instance !== 16
    || registry.packet_contract?.packet_version !== FIXTURE_026_RSD_T02_FIXED_PACKET_VERSION
    || registry.packet_contract?.episode_protocol_version
      !== FIXTURE_026_RSD_T02_EPISODE_PROTOCOL_VERSION
    || registry.packet_contract?.episode_protocol_sha256
      !== FIXTURE_026_RSD_T02_EPISODE_PROTOCOL_SHA256
    || digest(FIXTURE_026_RSD_T02_EPISODE_PROTOCOL)
      !== FIXTURE_026_RSD_T02_EPISODE_PROTOCOL_SHA256
    || registry.packet_contract?.episode_count !== FIXTURE_026_RSD_T02_EPISODES.length
    || registry.packet_contract?.one_parameter_vector_per_packet !== true
    || registry.packet_contract?.one_time_constant_per_packet !== true
    || registry.packet_contract?.trajectories_generated_by_this_stage !== false
    || !Array.isArray(registry.families)
    || registry.families.length !== FIXTURE_026_RSD_T02_RECIPES.length
    || registry.outer_partitions?.outer_confirmation !== "not-created"
    || registry.outer_partitions?.outer_transfer !== "not-created"
    || registry.comparison_inference_permitted !== false
    || registry.claim_eligible !== false
    || registry.result_label !== "NO_RESULT"
  ) refuse("registry differs from the closed public-development contract");

  const familyIds = new Set();
  const recipeIds = new Set();
  for (const family of registry.families) {
    const recipe = FIXTURE_026_RSD_T02_RECIPES.find(({ recipe_id: recipeId }) => (
      recipeId === family.recipe_id
    ));
    const equationCertificate = FIXTURE_026_RSD_T02_EQUATION_CERTIFICATES.find(
      ({ equation_id: equationId }) => equationId === family.equation_id,
    );
    const equationTemplate = FIXTURE_026_RSD_T02_EQUATION_TEMPLATES.find(
      ({ equation_id: equationId }) => equationId === family.equation_id,
    );
    const distribution = family.parameter_distribution?.time_constant_us;
    if (
      !exactKeys(family, FAMILY_KEYS)
      || typeof family.family_id !== "string"
      || familyIds.has(family.family_id)
      || !Number.isSafeInteger(family.family_version)
      || family.family_version < 1
      || !recipe
      || recipeIds.has(family.recipe_id)
      || recipe.equation_id !== family.equation_id
      || recipe.full_panel_equivalence_class !== family.full_panel_equivalence_group
      || !equationCertificate
      || !equationTemplate
      || family.equation_template_version !== FIXTURE_026_RSD_T02_EQUATION_TEMPLATE_VERSION
      || family.equation_template_sha256 !== digest(equationTemplate)
      || !exactKeys(family.property_certificate, PROPERTY_CERTIFICATE_KEYS)
      || digest(family.property_certificate) !== digest(equationCertificate)
      || digest(family.fixed_parameters) !== digest(expectedFixedParameters(family.equation_id))
      || !exactKeys(distribution, TIME_CONSTANT_DISTRIBUTION_KEYS)
      || distribution.distribution !== "discrete-uniform-integer-closed"
      || distribution.minimum !== 500000
      || distribution.maximum !== 2000000
      || distribution.unit !== "us"
      || !Array.isArray(family.validity_gates)
      || family.validity_gates.length !== 3
      || new Set(family.validity_gates).size !== family.validity_gates.length
    ) refuse(`invalid or drifting family ${family.family_id ?? "<missing>"}`);
    familyIds.add(family.family_id);
    recipeIds.add(family.recipe_id);
  }
  if (familyIds.size !== registry.families.length || recipeIds.size !== registry.families.length) {
    refuse("family and recipe mappings must be one-to-one");
  }
  return registry;
}

export function assertFixture026RsdT02DevelopmentInstancePlan({ registry, plan }) {
  assertFixture026RsdT02SystemFamilyRegistry(registry);
  if (
    !exactKeys(plan, PLAN_KEYS)
    || digest(plan) !== FIXTURE_026_RSD_T02_DEVELOPMENT_PLAN_SHA256
    || plan.schema !== 1
    || plan.contract_version !== FIXTURE_026_RSD_T02_DEVELOPMENT_PLAN_VERSION
    || plan.registry_contract_version !== registry.contract_version
    || plan.family_registry_identity_sha256 !== registry.family_registry_identity_sha256
    || plan.partition !== "development"
    || plan.panel_mode
      !== "cross-every-conformance-draw-index-with-every-registered-development-family"
    || !Array.isArray(plan.conformance_draw_indices)
    || plan.conformance_draw_indices.length < 1
    || plan.conformance_draw_indices.some((value) => (
      !Number.isSafeInteger(value) || value < 0 || value > 0xffff_ffff
    ))
    || new Set(plan.conformance_draw_indices).size !== plan.conformance_draw_indices.length
    || plan.conformance_draws_per_family !== plan.conformance_draw_indices.length
    || plan.family_count !== registry.families.length
    || plan.constructed_artifact_count
      !== plan.conformance_draw_indices.length * registry.families.length
    || plan.conformance_draw_indices_are_independent_systems !== false
    || plan.duplicate_canonical_instance_ids_count_once !== true
    || plan.execute_model_trajectories !== false
    || plan.comparison_inference_permitted !== false
    || plan.claim_eligible !== false
    || plan.result_label !== "NO_RESULT"
  ) refuse("development instance plan differs from the closed NO_RESULT plan");
  return plan;
}

export function summarizeFixture026RsdT02FamilyCoverage(registry) {
  assertFixture026RsdT02SystemFamilyRegistry(registry);
  const minimum = registry.coverage_contract.minimum_distinct_structural_lineages_per_value;
  const primaryKeys = new Set(registry.coverage_contract.primary_scored_property_keys);
  const properties = registry.coverage_contract.property_keys.map((propertyKey) => {
    const byValue = new Map();
    for (const family of registry.families) {
      const rawValue = family.property_certificate.property_vector[propertyKey];
      const value = String(rawValue);
      const entry = byValue.get(value) ?? { lineages: new Set(), families: new Set() };
      entry.lineages.add(family.structural_lineage_id);
      entry.families.add(family.family_id);
      byValue.set(value, entry);
    }
    const values = [...byValue.entries()]
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([value, entry]) => Object.freeze({
        value,
        distinct_structural_lineage_count: entry.lineages.size,
        family_count: entry.families.size,
        structural_lineage_ids: Object.freeze([...entry.lineages].sort()),
        meets_minimum: entry.lineages.size >= minimum,
      }));
    const requiredValues = propertyKey === "drive_transform"
      ? ["affine-fold", "log-fold"]
      : ["false", "true"];
    const present = new Map(values.map((row) => [row.value, row]));
    const missingOrThinValues = requiredValues.filter((value) => (
      !present.has(value) || !present.get(value).meets_minimum
    ));
    return Object.freeze({
      property_key: propertyKey,
      primary_scored: primaryKeys.has(propertyKey),
      required_values: Object.freeze(requiredValues),
      values: Object.freeze(values),
      missing_or_thin_values: Object.freeze(missingOrThinValues),
      coverage_complete: missingOrThinValues.length === 0,
    });
  });
  const gaps = properties.flatMap((property) => property.missing_or_thin_values.map((value) => (
    `${property.property_key}=${value}`
  )));
  return Object.freeze({
    registry_sha256: FIXTURE_026_RSD_T02_FAMILY_REGISTRY_SHA256,
    minimum_distinct_structural_lineages_per_value: minimum,
    properties: Object.freeze(properties),
    primary_coverage_complete: properties
      .filter(({ primary_scored: primaryScored }) => primaryScored)
      .every(({ coverage_complete: coverageComplete }) => coverageComplete),
    gaps: Object.freeze(gaps),
    coverage_is_power: false,
    comparison_inference_permitted: false,
    claim_eligible: false,
    result_label: "NO_RESULT",
  });
}

export function fixture026RsdT02UnbiasedDiscreteUniformInteger({
  minimum,
  maximum,
  maximum_attempts: maximumAttempts,
  word_at_attempt: wordAtAttempt,
}) {
  if (
    !Number.isSafeInteger(minimum)
    || !Number.isSafeInteger(maximum)
    || maximum < minimum
    || !Number.isSafeInteger(maximumAttempts)
    || maximumAttempts < 1
    || typeof wordAtAttempt !== "function"
  ) refuse("invalid discrete-uniform sampler contract");
  const span = BigInt(maximum - minimum + 1);
  const wordSpace = 1n << 64n;
  const acceptanceLimit = wordSpace - (wordSpace % span);
  const attempts = [];
  for (let attempt = 0; attempt < maximumAttempts; attempt += 1) {
    const word = wordAtAttempt(attempt);
    if (typeof word !== "bigint" || word < 0n || word >= wordSpace) {
      refuse("word source must return an unsigned 64-bit integer");
    }
    const accepted = word < acceptanceLimit;
    attempts.push(Object.freeze({
      attempt,
      word_hex: word.toString(16).padStart(16, "0"),
      accepted,
      charged_to_generation: true,
    }));
    if (accepted) {
      return Object.freeze({
        value: minimum + Number(word % span),
        accepted_attempt: attempt,
        attempts: Object.freeze(attempts),
      });
    }
  }
  refuse("unbiased integer draw cap exhausted");
}

function sampleTimeConstant(registry, family, drawIndex) {
  if (!Number.isSafeInteger(drawIndex) || drawIndex < 0 || drawIndex > 0xffff_ffff) {
    refuse("draw index must be an unsigned 32-bit integer");
  }
  const distribution = family.parameter_distribution.time_constant_us;
  const familyDefinitionSha256 = digest(scientificFamilyDefinition(family));
  const familyRegistryIdentitySha256 = registry.family_registry_identity_sha256;
  const sampled = fixture026RsdT02UnbiasedDiscreteUniformInteger({
    minimum: distribution.minimum,
    maximum: distribution.maximum,
    maximum_attempts: registry.generator_contract.maximum_draws_per_requested_instance,
    word_at_attempt: (attempt) => {
    const preimage = canonicalize({
      domain: FIXTURE_026_RSD_T02_FAMILY_GENERATOR_VERSION,
      family_registry_identity_sha256: familyRegistryIdentitySha256,
      family_definition_sha256: familyDefinitionSha256,
      family_id: family.family_id,
      family_version: family.family_version,
      draw_index: drawIndex,
      parameter_key: "time_constant_us",
      attempt,
    });
      const bytes = createHmac(
      "sha256",
      Buffer.from(registry.generator_contract.public_root_key_hex, "hex"),
    ).update(preimage, "utf8").digest();
      return bytes.readBigUInt64BE(0);
    },
  });
  return Object.freeze({
    time_constant_us: sampled.value,
    family_definition_sha256: familyDefinitionSha256,
    draw_receipt: Object.freeze({
      draw_index: drawIndex,
      draw_index_role: "public-generator-conformance-coordinate-only",
      parameter_key: "time_constant_us",
      accepted_attempt: sampled.accepted_attempt,
      attempts: sampled.attempts,
      draw_index_in_scientific_identity: false,
    }),
  });
}

export function fixture026RsdT02FixedPacketId(packetWithoutId, {
  episode_protocol_version: episodeProtocolVersion,
  episode_protocol_sha256: episodeProtocolSha256,
} = {}) {
  if (
    packetWithoutId?.episode_protocol_version !== undefined
    || packetWithoutId?.episode_protocol_sha256 !== undefined
    || typeof episodeProtocolVersion !== "string"
    || episodeProtocolVersion.length < 3
    || !/^[0-9a-f]{64}$/u.test(episodeProtocolSha256 ?? "")
  ) refuse("packet ID needs a separate valid episode-protocol binding");
  return digest({
    domain: "fixture-026.rsd-t02-fixed-instance-packet-id.v1",
    packet: {
      ...packetWithoutId,
      episode_protocol_version: episodeProtocolVersion,
      episode_protocol_sha256: episodeProtocolSha256,
    },
  });
}

function instanceArtifact({ registry, family, drawIndex }) {
  const sample = sampleTimeConstant(registry, family, drawIndex);
  const timeConstantS = sample.time_constant_us / 1_000_000;
  const parameterVector = Object.freeze({
    schema: 1,
    contract_version: "fixture-026.rsd-t02-parameter-vector.v1",
    family_registry_identity_sha256: registry.family_registry_identity_sha256,
    family_definition_sha256: sample.family_definition_sha256,
    family_id: family.family_id,
    family_version: family.family_version,
    values: Object.freeze({
      canonical_fold: family.fixed_parameters.canonical_fold,
      feedback_nonlinearity: family.fixed_parameters.feedback_nonlinearity ?? null,
      time_constant: Object.freeze({
        numerator: sample.time_constant_us,
        denominator: 1_000_000,
        unit: "s",
      }),
    }),
  });
  const nuisanceVector = Object.freeze({
    schema: 1,
    contract_version: "fixture-026.rsd-t02-nuisance-vector.v1",
    initialization_rule: "registered-equation-steady-background-state",
    input_sensor_gain: Object.freeze({ numerator: 1, denominator: 1, unit: "1" }),
    output_sensor_gain: Object.freeze({ numerator: 1, denominator: 1, unit: "1" }),
    output_offset: Object.freeze({ numerator: 0, denominator: 1, unit: "1" }),
    input_delay: Object.freeze({ numerator: 0, denominator: 1, unit: "s" }),
    reported_output_rule: "registered-internal-output-except-declared-clamp",
    channel_interface_rule: "two-positive-input-channels-one-active-channel",
  });
  const propertyCertificateSet = Object.freeze({
    schema: 1,
    contract_version: "fixture-026.rsd-t02-property-certificate-set.v1",
    equation_contract_version: FIXTURE_026_RSD_T02_CONTRACT_VERSION,
    equation_template_version: family.equation_template_version,
    equation_template_sha256: family.equation_template_sha256,
    equation_certificate: family.property_certificate,
  });
  const parameterVectorSha256 = digest(parameterVector);
  const nuisanceVectorSha256 = digest(nuisanceVector);
  const propertyCertificateSetSha256 = digest(propertyCertificateSet);
  const identity = {
    family_id: family.family_id,
    family_version: family.family_version,
    structural_lineage_id: family.structural_lineage_id,
    parameter_vector_sha256: parameterVectorSha256,
    fixed_time_constant_s: timeConstantS,
    nuisance_vector_sha256: nuisanceVectorSha256,
    property_certificate_set_sha256: propertyCertificateSetSha256,
  };
  const instanceId = fixture026RsdT02PopulationSystemInstanceId(identity);
  const manifest = Object.freeze({
    schema: 1,
    contract_version: FIXTURE_026_RSD_T02_POPULATION_DESIGN_VERSION,
    partition: "development",
    ...identity,
    instance_id: instanceId,
    instance_identity_basis: "sha256-canonical-system-instance-identity-v1",
    pre_response_valid: true,
    independent_system_unit: true,
    procedural_seed: null,
    procedural_seed_role: "software-and-algorithmic-replay-key-only",
    procedural_seed_in_identity: false,
    comparison_inference_permitted: false,
    claim_eligible: false,
    result_label: "NO_RESULT",
  });
  const episodes = Object.freeze(FIXTURE_026_RSD_T02_EPISODES.map(({ episode_id: episodeId }) => (
    Object.freeze({
      episode_id: episodeId,
      parameter_vector_sha256: parameterVectorSha256,
      time_constant_s: timeConstantS,
      realization_ids: Object.freeze([`R-${sha256Hex(`${instanceId}|${episodeId}|0`)}`]),
    })
  )));
  const packetWithoutId = Object.freeze({
    schema: 1,
    contract_version: FIXTURE_026_RSD_T02_POPULATION_DESIGN_VERSION,
    packet_version: FIXTURE_026_RSD_T02_FIXED_PACKET_VERSION,
    instance_id: instanceId,
    parameter_vector_sha256: parameterVectorSha256,
    episodes,
    comparison_inference_permitted: false,
    claim_eligible: false,
    result_label: "NO_RESULT",
  });
  const packet = Object.freeze({
    ...packetWithoutId,
    packet_id: fixture026RsdT02FixedPacketId(packetWithoutId, {
      episode_protocol_version: registry.packet_contract.episode_protocol_version,
      episode_protocol_sha256: registry.packet_contract.episode_protocol_sha256,
    }),
  });
  return Object.freeze({
    family_id: family.family_id,
    recipe_id: family.recipe_id,
    equation_id: family.equation_id,
    provenance: Object.freeze({
      registry_sha256: FIXTURE_026_RSD_T02_FAMILY_REGISTRY_SHA256,
      family_registry_identity_sha256: registry.family_registry_identity_sha256,
      population_design_binding: registry.population_design_binding,
      implementation_provenance: registry.implementation_provenance,
      episode_protocol_version: registry.packet_contract.episode_protocol_version,
      episode_protocol_sha256: registry.packet_contract.episode_protocol_sha256,
    }),
    draw_receipt: sample.draw_receipt,
    parameter_vector: parameterVector,
    nuisance_vector: nuisanceVector,
    property_certificate_set: propertyCertificateSet,
    manifest,
    packet,
  });
}

export function generateFixture026RsdT02DevelopmentInstance({
  registry,
  family_id: familyId,
  draw_index: drawIndex,
}) {
  assertFixture026RsdT02SystemFamilyRegistry(registry);
  const family = familyById(registry, familyId);
  return instanceArtifact({ registry, family, drawIndex });
}

export function assertFixture026RsdT02DevelopmentInstance({ registry, artifact }) {
  assertFixture026RsdT02SystemFamilyRegistry(registry);
  const family = familyById(registry, artifact?.family_id);
  const regenerated = generateFixture026RsdT02DevelopmentInstance({
    registry,
    family_id: family.family_id,
    draw_index: artifact?.draw_receipt?.draw_index,
  });
  const { packet_id: packetId, ...packetWithoutId } = artifact?.packet ?? {};
  const expectedPacketId = fixture026RsdT02FixedPacketId(packetWithoutId, {
    episode_protocol_version: artifact?.provenance?.episode_protocol_version,
    episode_protocol_sha256: artifact?.provenance?.episode_protocol_sha256,
  });
  if (digest(regenerated) !== digest(artifact)) refuse("instance artifact is not an exact replay");
  if (
    artifact.manifest.family_id !== family.family_id
    || artifact.manifest.family_version !== family.family_version
    || artifact.manifest.structural_lineage_id !== family.structural_lineage_id
    || artifact.manifest.parameter_vector_sha256 !== digest(artifact.parameter_vector)
    || artifact.manifest.fixed_time_constant_s
      !== artifact.parameter_vector.values.time_constant.numerator
        / artifact.parameter_vector.values.time_constant.denominator
    || artifact.manifest.nuisance_vector_sha256 !== digest(artifact.nuisance_vector)
    || artifact.manifest.property_certificate_set_sha256
      !== digest(artifact.property_certificate_set)
    || artifact.parameter_vector.family_registry_identity_sha256
      !== registry.family_registry_identity_sha256
    || artifact.property_certificate_set.equation_template_sha256
      !== family.equation_template_sha256
    || artifact.provenance.population_design_binding.canonical_sha256
      !== registry.population_design_binding.canonical_sha256
    || artifact.packet.instance_id !== artifact.manifest.instance_id
    || artifact.packet.parameter_vector_sha256 !== artifact.manifest.parameter_vector_sha256
    || artifact.provenance.episode_protocol_sha256
      !== registry.packet_contract.episode_protocol_sha256
    || artifact.provenance.episode_protocol_version
      !== registry.packet_contract.episode_protocol_version
    || packetId !== expectedPacketId
    || artifact.packet.episodes.length !== FIXTURE_026_RSD_T02_EPISODES.length
    || artifact.packet.episodes.some((episode) => (
      episode.parameter_vector_sha256 !== artifact.manifest.parameter_vector_sha256
      || episode.time_constant_s !== artifact.manifest.fixed_time_constant_s
    ))
    || artifact.manifest.comparison_inference_permitted !== false
    || artifact.manifest.claim_eligible !== false
    || artifact.manifest.result_label !== "NO_RESULT"
  ) refuse("instance artifact changes its family, parameters, packet, or authority");
  return artifact;
}

export function deduplicateFixture026RsdT02DevelopmentInstances(entries) {
  if (!Array.isArray(entries)) refuse("deduplication entries must be an array");
  const instances = [];
  const duplicates = [];
  const instanceIds = new Set();
  for (const entry of entries) {
    const instanceId = entry?.artifact?.manifest?.instance_id;
    if (
      typeof instanceId !== "string"
      || !/^[0-9a-f]{64}$/u.test(instanceId)
      || entry.artifact.family_id !== entry.family_id
      || entry.artifact.draw_receipt.draw_index !== entry.draw_index
    ) refuse("deduplication entry is malformed");
    if (instanceIds.has(instanceId)) {
      duplicates.push(Object.freeze({
        family_id: entry.family_id,
        conformance_draw_index: entry.draw_index,
        instance_id: instanceId,
        effective_instance_increment: 0,
      }));
    } else {
      instanceIds.add(instanceId);
      instances.push(entry.artifact);
    }
  }
  return Object.freeze({
    instances: Object.freeze(instances),
    duplicates: Object.freeze(duplicates),
  });
}

export function generateFixture026RsdT02DevelopmentPanel({ registry, plan }) {
  assertFixture026RsdT02DevelopmentInstancePlan({ registry, plan });
  const entries = [];
  for (const family of registry.families) {
    for (const drawIndex of plan.conformance_draw_indices) {
      const artifact = generateFixture026RsdT02DevelopmentInstance({
        registry,
        family_id: family.family_id,
        draw_index: drawIndex,
      });
      entries.push(Object.freeze({
        family_id: family.family_id,
        draw_index: drawIndex,
        artifact,
      }));
    }
  }
  const { instances, duplicates } = deduplicateFixture026RsdT02DevelopmentInstances(entries);
  return Object.freeze({
    schema: 1,
    contract_version: FIXTURE_026_RSD_T02_FAMILY_GENERATOR_VERSION,
    registry_sha256: FIXTURE_026_RSD_T02_FAMILY_REGISTRY_SHA256,
    family_registry_identity_sha256: registry.family_registry_identity_sha256,
    plan_sha256: FIXTURE_026_RSD_T02_DEVELOPMENT_PLAN_SHA256,
    population_design_binding: registry.population_design_binding,
    episode_protocol_version: registry.packet_contract.episode_protocol_version,
    episode_protocol_sha256: registry.packet_contract.episode_protocol_sha256,
    constructed_artifact_count: plan.constructed_artifact_count,
    unique_canonical_instance_count: instances.length,
    duplicate_canonical_instance_count: duplicates.length,
    instances: Object.freeze(instances),
    duplicates: Object.freeze(duplicates),
    coverage: summarizeFixture026RsdT02FamilyCoverage(registry),
    comparison_inference_permitted: false,
    claim_eligible: false,
    result_label: "NO_RESULT",
  });
}

export function assertFixture026RsdT02DevelopmentPanel({ registry, plan, panel }) {
  const regenerated = generateFixture026RsdT02DevelopmentPanel({ registry, plan });
  if (digest(regenerated) !== digest(panel)) refuse("development panel is not an exact replay");
  for (const artifact of panel.instances) {
    assertFixture026RsdT02DevelopmentInstance({ registry, artifact });
  }
  if (
    panel.constructed_artifact_count
      !== panel.unique_canonical_instance_count + panel.duplicate_canonical_instance_count
    || panel.family_registry_identity_sha256 !== registry.family_registry_identity_sha256
    || panel.population_design_binding.canonical_sha256
      !== registry.population_design_binding.canonical_sha256
    || panel.episode_protocol_sha256 !== registry.packet_contract.episode_protocol_sha256
    || panel.comparison_inference_permitted !== false
    || panel.claim_eligible !== false
    || panel.result_label !== "NO_RESULT"
  ) refuse("development panel changes its units, provenance, or authority");
  return panel;
}
