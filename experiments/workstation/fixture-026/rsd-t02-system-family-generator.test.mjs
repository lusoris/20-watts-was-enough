import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { createAjv } from "../lib/ajv.mjs";

import { canonicalize, sha256Hex } from "../lib/checkpoint-ledger.mjs";
import {
  assertFixture026RsdT02PopulationInstanceManifest,
  assertFixture026RsdT02PopulationInstancePacket,
} from "./rsd-t02-population-contract.mjs";
import {
  FIXTURE_026_RSD_T02_DEVELOPMENT_PLAN_SHA256,
  FIXTURE_026_RSD_T02_FAMILY_REGISTRY_SHA256,
  assertFixture026RsdT02DevelopmentInstance,
  assertFixture026RsdT02DevelopmentInstancePlan,
  assertFixture026RsdT02DevelopmentPanel,
  assertFixture026RsdT02SystemFamilyRegistry,
  deduplicateFixture026RsdT02DevelopmentInstances,
  fixture026RsdT02FamilyRegistryIdentitySha256,
  fixture026RsdT02FixedPacketId,
  fixture026RsdT02UnbiasedDiscreteUniformInteger,
  generateFixture026RsdT02DevelopmentInstance,
  generateFixture026RsdT02DevelopmentPanel,
  summarizeFixture026RsdT02FamilyCoverage,
} from "./rsd-t02-system-family-generator.mjs";

const fixtureRoot = path.dirname(fileURLToPath(import.meta.url));

async function loadContracts() {
  const [
    registryBytes,
    planBytes,
    registrySchemaBytes,
    planSchemaBytes,
    generatedArtifactSchemaBytes,
    populationDesignBytes,
  ] = await Promise.all([
    readFile(path.join(fixtureRoot, "configs", "rsd-t02-system-family-registry.json")),
    readFile(path.join(fixtureRoot, "configs", "rsd-t02-development-instance-plan.json")),
    readFile(path.join(fixtureRoot, "rsd-t02-system-family-registry.schema.json")),
    readFile(path.join(fixtureRoot, "rsd-t02-development-instance-plan.schema.json")),
    readFile(path.join(fixtureRoot, "rsd-t02-generated-artifacts.schema.json")),
    readFile(path.join(fixtureRoot, "configs", "rsd-t02-population-design.json")),
  ]);
  return {
    registry: JSON.parse(registryBytes.toString("utf8")),
    plan: JSON.parse(planBytes.toString("utf8")),
    registrySchema: JSON.parse(registrySchemaBytes.toString("utf8")),
    planSchema: JSON.parse(planSchemaBytes.toString("utf8")),
    generatedArtifactSchema: JSON.parse(generatedArtifactSchemaBytes.toString("utf8")),
    populationDesign: JSON.parse(populationDesignBytes.toString("utf8")),
  };
}

function populationAssignmentsForRegistry(registry) {
  return [
    ...registry.families.map((family) => ({
      family_id: family.family_id,
      family_version: family.family_version,
      structural_lineage_id: family.structural_lineage_id,
      full_panel_equivalence_group: family.full_panel_equivalence_group,
      partition: "development",
      payload_state: "public-development",
      current_public_recipe: true,
    })),
    {
      family_id: "F-INTEGRATION-SEALED-CONFIRMATION",
      family_version: 1,
      structural_lineage_id: "L-INTEGRATION-SEALED-CONFIRMATION",
      full_panel_equivalence_group: "E-INTEGRATION-SEALED-CONFIRMATION",
      partition: "outer-confirmation",
      payload_state: "sealed-evaluator-custody",
      current_public_recipe: false,
    },
    {
      family_id: "F-INTEGRATION-SEALED-TRANSFER",
      family_version: 1,
      structural_lineage_id: "L-INTEGRATION-SEALED-TRANSFER",
      full_panel_equivalence_group: "E-INTEGRATION-SEALED-TRANSFER",
      partition: "outer-transfer",
      payload_state: "sealed-evaluator-custody",
      current_public_recipe: false,
    },
  ];
}

test("family registry binds all five public equations without granting population authority", async () => {
  const { registry, registrySchema } = await loadContracts();
  const validate = createAjv({ allErrors: true }).compile(registrySchema);
  assert.equal(validate(registry), true, JSON.stringify(validate.errors));
  assert.equal(assertFixture026RsdT02SystemFamilyRegistry(registry), registry);
  assert.equal(sha256Hex(canonicalize(registry)), FIXTURE_026_RSD_T02_FAMILY_REGISTRY_SHA256);
  assert.equal(
    registrySchema["x-runtime-validator"].canonical_registry_sha256,
    FIXTURE_026_RSD_T02_FAMILY_REGISTRY_SHA256,
  );
  assert.equal(registry.families.length, 5);
  assert.equal(
    registry.generator_contract.draw_index_encoding,
    "canonical-json-unsigned-32-bit-integer-in-preimage",
  );
  assert.equal(new Set(registry.families.map(({ recipe_id: id }) => id)).size, 5);
  assert.equal(new Set(registry.families.map(({ equation_id: id }) => id)).size, 5);
  assert.equal(registry.family_superpopulation_inference_permitted, false);
  assert.equal(registry.outer_partitions.outer_confirmation, "not-created");
  assert.equal(registry.outer_partitions.outer_transfer, "not-created");
  assert.equal(registry.result_label, "NO_RESULT");
});

test("coverage audit counts equivalent siblings once and names every thin or absent value", async () => {
  const { registry } = await loadContracts();
  const coverage = summarizeFixture026RsdT02FamilyCoverage(registry);
  assert.equal(coverage.primary_coverage_complete, false);
  assert.deepEqual(coverage.gaps, [
    "drive_transform=log-fold",
    "reported_output_feedback_edge=true",
    "channel_local_state=true",
    "causal_memory=false",
  ]);
  const drive = coverage.properties.find(({ property_key: key }) => key === "drive_transform");
  assert.deepEqual(drive.values, [
    {
      value: "affine-fold",
      distinct_structural_lineage_count: 3,
      family_count: 4,
      structural_lineage_ids: [
        "L-AFFINE-INPUT-MEMORY",
        "L-CHANNEL-LOCAL-MEMORY",
        "L-OUTPUT-FEEDBACK",
      ],
      meets_minimum: true,
    },
    {
      value: "log-fold",
      distinct_structural_lineage_count: 1,
      family_count: 1,
      structural_lineage_ids: ["L-LOG-INPUT-MEMORY"],
      meets_minimum: false,
    },
  ]);
  assert.equal(coverage.coverage_is_power, false);
  assert.equal(coverage.claim_eligible, false);
});

test("one exact integer draw creates one canonical population-contract packet", async () => {
  const { registry, populationDesign } = await loadContracts();
  const request = {
    registry,
    family_id: "F-DEV-OUTPUT-FEEDBACK",
    draw_index: 0,
  };
  const first = generateFixture026RsdT02DevelopmentInstance(request);
  const replay = generateFixture026RsdT02DevelopmentInstance(request);
  assert.deepEqual(first, replay);
  assert.equal(assertFixture026RsdT02DevelopmentInstance({ registry, artifact: first }), first);
  const familyAssignments = populationAssignmentsForRegistry(registry);
  assert.equal(assertFixture026RsdT02PopulationInstanceManifest({
    design: populationDesign,
    familyAssignments,
    manifest: first.manifest,
  }), first.manifest);
  assert.equal(assertFixture026RsdT02PopulationInstancePacket({
    design: populationDesign,
    familyAssignments,
    manifest: first.manifest,
    packet: first.packet,
  }), first.packet);
  assert.equal(first.packet.episodes.length, 26);
  assert.equal(first.draw_receipt.attempts.length, 1);
  assert.equal(first.draw_receipt.attempts[0].accepted, true);
  assert.deepEqual(first.parameter_vector.values.canonical_fold, {
    numerator: 2, denominator: 1, unit: "1",
  });
  assert.deepEqual(first.parameter_vector.values.feedback_nonlinearity, {
    numerator: 1, denominator: 4, unit: "1",
  });
  assert.ok(first.parameter_vector.values.time_constant.numerator >= 500000);
  assert.ok(first.parameter_vector.values.time_constant.numerator <= 2000000);
  assert.equal(new Set(first.packet.episodes.map(({ time_constant_s: tau }) => tau)).size, 1);
  assert.equal(
    new Set(first.packet.episodes.map(({ parameter_vector_sha256: hash }) => hash)).size,
    1,
  );
  assert.equal(first.manifest.procedural_seed, null);
  assert.equal(first.draw_receipt.draw_index_in_scientific_identity, false);
  assert.equal(first.manifest.comparison_inference_permitted, false);
  assert.equal(first.manifest.result_label, "NO_RESULT");
});

test("the fixed public plan produces twenty canonical instances and no trajectories", async () => {
  const { registry, plan, planSchema, generatedArtifactSchema } = await loadContracts();
  const validate = createAjv({ allErrors: true }).compile(planSchema);
  assert.equal(validate(plan), true, JSON.stringify(validate.errors));
  assert.equal(assertFixture026RsdT02DevelopmentInstancePlan({ registry, plan }), plan);
  assert.equal(sha256Hex(canonicalize(plan)), FIXTURE_026_RSD_T02_DEVELOPMENT_PLAN_SHA256);
  assert.equal(
    planSchema["x-runtime-validator"].canonical_plan_sha256,
    FIXTURE_026_RSD_T02_DEVELOPMENT_PLAN_SHA256,
  );
  const panel = generateFixture026RsdT02DevelopmentPanel({ registry, plan });
  const validateGeneratedArtifact = createAjv({ allErrors: true })
    .compile(generatedArtifactSchema);
  assert.equal(validateGeneratedArtifact(panel), true, JSON.stringify(validateGeneratedArtifact.errors));
  assert.equal(panel.instances.every((artifact) => validateGeneratedArtifact(artifact)), true);
  assert.equal(assertFixture026RsdT02DevelopmentPanel({ registry, plan, panel }), panel);
  assert.equal(panel.constructed_artifact_count, 20);
  assert.equal(panel.unique_canonical_instance_count, 20);
  assert.equal(panel.duplicate_canonical_instance_count, 0);
  assert.equal(new Set(panel.instances.map(({ manifest }) => manifest.instance_id)).size, 20);
  assert.equal(panel.instances.every(({ packet }) => packet.episodes.length === 26), true);
  assert.equal(panel.instances.every((artifact) => !Object.hasOwn(artifact, "trajectories")), true);
  assert.equal(panel.coverage.primary_coverage_complete, false);
  assert.equal(panel.comparison_inference_permitted, false);
  assert.equal(panel.result_label, "NO_RESULT");
  const hostilePanel = structuredClone(panel);
  hostilePanel.unregistered = true;
  assert.equal(validateGeneratedArtifact(hostilePanel), false);
});

test("domain separation changes integer parameter draws across families and draw indices", async () => {
  const { registry } = await loadContracts();
  const requests = [
    ["F-DEV-IFFL-AFFINE", 0],
    ["F-DEV-IFFL-AFFINE", 1],
    ["F-DEV-LOG-HIGHPASS", 0],
  ];
  const artifacts = requests.map(([familyId, drawIndex]) => (
    generateFixture026RsdT02DevelopmentInstance({
      registry,
      family_id: familyId,
      draw_index: drawIndex,
    })
  ));
  assert.equal(new Set(artifacts.map(({ parameter_vector: vector }) => (
    vector.values.time_constant.numerator
  ))).size, 3);
  assert.equal(new Set(artifacts.map(({ manifest }) => manifest.instance_id)).size, 3);
});

test("first and last conformance draws have frozen exact integer and identity goldens", async () => {
  const { registry } = await loadContracts();
  const cases = [
    {
      family_id: "F-DEV-IFFL-AFFINE",
      draw_index: 0,
      time_constant_us: 959000,
      word_hex: "ef837e34ab9f010b",
      instance_id: "e0675abee1d93d073cd0ca754194d2e323809659bc3ec819cf6e9b7731e745ed",
      packet_id: "eea7db8cc0cb807f58dc1555eaffe718fce6b70ad7d20fa4c4d8d5f994954c9b",
    },
    {
      family_id: "F-DEV-LOG-HIGHPASS",
      draw_index: 3,
      time_constant_us: 1011879,
      word_hex: "cf03aae51f453507",
      instance_id: "3221d2a715c0514ff275132c2e77401b31e17ec653ff433ae44df2c7b9af3363",
      packet_id: "14915f56cf96d02e78bc99a487c3aa2f121b708d4fa920337157da0ebeaeacdb",
    },
  ];
  for (const expected of cases) {
    const artifact = generateFixture026RsdT02DevelopmentInstance({
      registry,
      family_id: expected.family_id,
      draw_index: expected.draw_index,
    });
    assert.equal(
      artifact.parameter_vector.values.time_constant.numerator,
      expected.time_constant_us,
    );
    assert.equal(artifact.draw_receipt.attempts[0].word_hex, expected.word_hex);
    assert.equal(artifact.manifest.instance_id, expected.instance_id);
    assert.equal(artifact.packet.packet_id, expected.packet_id);
  }
});

test("scientific registry identity binds equation templates but excludes custody metadata", async () => {
  const { registry } = await loadContracts();
  const baseline = fixture026RsdT02FamilyRegistryIdentitySha256(registry);
  assert.equal(baseline, registry.family_registry_identity_sha256);

  const nonScientific = structuredClone(registry);
  nonScientific.coverage_contract.minimum_distinct_structural_lineages_per_value = 99;
  nonScientific.outer_partitions.outer_confirmation = "sealed-elsewhere";
  nonScientific.authority = "changed-provenance-only";
  assert.equal(fixture026RsdT02FamilyRegistryIdentitySha256(nonScientific), baseline);

  for (const mutate of [
    (value) => { value.families[0].equation_template_sha256 = "0".repeat(64); },
    (value) => { value.families[0].fixed_parameters.canonical_fold.numerator = 3; },
    (value) => { value.families.reverse(); },
  ]) {
    const scientific = structuredClone(registry);
    mutate(scientific);
    assert.notEqual(fixture026RsdT02FamilyRegistryIdentitySha256(scientific), baseline);
  }
});

test("complete episode protocol changes packet identity without changing system identity", async () => {
  const { registry } = await loadContracts();
  const artifact = generateFixture026RsdT02DevelopmentInstance({
    registry,
    family_id: "F-DEV-IFFL-AFFINE",
    draw_index: 0,
  });
  const { packet_id: packetId, ...packetWithoutId } = artifact.packet;
  const protocolBinding = {
    episode_protocol_version: artifact.provenance.episode_protocol_version,
    episode_protocol_sha256: artifact.provenance.episode_protocol_sha256,
  };
  assert.equal(fixture026RsdT02FixedPacketId(packetWithoutId, protocolBinding), packetId);
  const changedProtocol = {
    ...protocolBinding,
    episode_protocol_sha256: "0".repeat(64),
  };
  assert.notEqual(fixture026RsdT02FixedPacketId(packetWithoutId, changedProtocol), packetId);
  assert.equal(artifact.packet.instance_id, artifact.manifest.instance_id);
});

test("population design and model implementation provenance are exact-byte bound", async () => {
  const { registry } = await loadContracts();
  const [populationBytes, modelBytes] = await Promise.all([
    readFile(path.join(fixtureRoot, "configs", "rsd-t02-population-design.json")),
    readFile(path.join(fixtureRoot, "rsd-t02-models.mjs")),
  ]);
  assert.equal(
    sha256Hex(populationBytes),
    registry.population_design_binding.exact_bytes_sha256,
  );
  assert.equal(
    sha256Hex(canonicalize(JSON.parse(populationBytes.toString("utf8")))),
    registry.population_design_binding.canonical_sha256,
  );
  assert.equal(
    sha256Hex(modelBytes),
    registry.implementation_provenance.model_source_sha256_exact_bytes,
  );
  assert.notEqual(
    sha256Hex(Buffer.concat([populationBytes, Buffer.from("\n")])),
    registry.population_design_binding.exact_bytes_sha256,
  );
});

test("unbiased sampler exposes rejection accounting and bounded exhaustion", () => {
  const words = [(1n << 64n) - 1n, 7n];
  const sampled = fixture026RsdT02UnbiasedDiscreteUniformInteger({
    minimum: 0,
    maximum: 5,
    maximum_attempts: 2,
    word_at_attempt: (attempt) => words[attempt],
  });
  assert.equal(sampled.value, 1);
  assert.equal(sampled.accepted_attempt, 1);
  assert.deepEqual(sampled.attempts.map(({ accepted }) => accepted), [false, true]);
  assert.throws(
    () => fixture026RsdT02UnbiasedDiscreteUniformInteger({
      minimum: 0,
      maximum: 5,
      maximum_attempts: 1,
      word_at_attempt: () => (1n << 64n) - 1n,
    }),
    /draw cap exhausted/u,
  );
});

test("canonical-instance deduplication retains one unit and records the collision", async () => {
  const { registry } = await loadContracts();
  const artifact = generateFixture026RsdT02DevelopmentInstance({
    registry,
    family_id: "F-DEV-IFFL-AFFINE",
    draw_index: 0,
  });
  const entry = {
    family_id: artifact.family_id,
    draw_index: artifact.draw_receipt.draw_index,
    artifact,
  };
  const deduplicated = deduplicateFixture026RsdT02DevelopmentInstances([entry, entry]);
  assert.equal(deduplicated.instances.length, 1);
  assert.equal(deduplicated.duplicates.length, 1);
  assert.equal(deduplicated.duplicates[0].effective_instance_increment, 0);
});

test("registry, plan, parameter and packet drift fail closed", async () => {
  const { registry, plan } = await loadContracts();
  const hostileRegistry = structuredClone(registry);
  hostileRegistry.families[0].parameter_distribution.time_constant_us.maximum = 4000000;
  assert.throws(
    () => assertFixture026RsdT02SystemFamilyRegistry(hostileRegistry),
    /closed public-development contract/u,
  );

  const hostilePlan = structuredClone(plan);
  hostilePlan.conformance_draw_indices[0] = -1;
  assert.throws(
    () => assertFixture026RsdT02DevelopmentInstancePlan({ registry, plan: hostilePlan }),
    /closed NO_RESULT plan/u,
  );

  const artifact = generateFixture026RsdT02DevelopmentInstance({
    registry,
    family_id: "F-DEV-IFFL-AFFINE",
    draw_index: 0,
  });
  const changedParameter = structuredClone(artifact);
  changedParameter.parameter_vector.values.time_constant.numerator += 1;
  assert.throws(
    () => assertFixture026RsdT02DevelopmentInstance({ registry, artifact: changedParameter }),
    /not an exact replay/u,
  );
  const changedEpisode = structuredClone(artifact);
  changedEpisode.packet.episodes[1].time_constant_s *= 2;
  assert.throws(
    () => assertFixture026RsdT02DevelopmentInstance({ registry, artifact: changedEpisode }),
    /not an exact replay/u,
  );
});
