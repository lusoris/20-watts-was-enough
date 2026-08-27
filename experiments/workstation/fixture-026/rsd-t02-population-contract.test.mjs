import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { canonicalize, sha256Hex } from "../lib/checkpoint-ledger.mjs";
import {
  FIXTURE_026_RSD_T02_FIXED_PACKET_VERSION,
  FIXTURE_026_RSD_T02_POPULATION_DESIGN_SHA256,
  FIXTURE_026_RSD_T02_POPULATION_DESIGN_VERSION,
  FIXTURE_026_RSD_T02_SYSTEM_INSTANCE_ID_VERSION,
  assertFixture026RsdT02PopulationComparisonAuthority,
  assertFixture026RsdT02PopulationDesign,
  assertFixture026RsdT02PopulationFamilyAssignments,
  assertFixture026RsdT02PopulationInstanceManifest,
  assertFixture026RsdT02PopulationInstancePacket,
  assertFixture026RsdT02PopulationParentStage3,
  fixture026RsdT02PopulationSystemInstanceId,
  summarizeFixture026RsdT02PopulationEffectiveUnits,
} from "./rsd-t02-population-contract.mjs";

const fixtureRoot = path.dirname(fileURLToPath(import.meta.url));
const H_A = "a".repeat(64);
const H_B = "b".repeat(64);
const H_C = "c".repeat(64);
const H_D = "d".repeat(64);
const H_E = "e".repeat(64);

async function loadFixture() {
  const [designBytes, stage3Bytes, schemaBytes] = await Promise.all([
    readFile(path.join(fixtureRoot, "configs", "rsd-t02-population-design.json")),
    readFile(path.join(fixtureRoot, "configs", "rsd-t02-stage3-design.json")),
    readFile(path.join(fixtureRoot, "rsd-t02-population-design.schema.json")),
  ]);
  return {
    design: JSON.parse(designBytes.toString("utf8")),
    stage3Bytes,
    schema: JSON.parse(schemaBytes.toString("utf8")),
  };
}

function validAssignments() {
  return [
    {
      family_id: "F-DEV-1",
      family_version: 1,
      structural_lineage_id: "L-DEV-1",
      full_panel_equivalence_group: "E-DEV-1",
      partition: "development",
      payload_state: "public-development",
      current_public_recipe: true,
    },
    {
      family_id: "F-CONF-1",
      family_version: 1,
      structural_lineage_id: "L-CONF-1",
      full_panel_equivalence_group: "E-CONF-1",
      partition: "outer-confirmation",
      payload_state: "sealed-evaluator-custody",
      current_public_recipe: false,
    },
    {
      family_id: "F-TRANSFER-1",
      family_version: 1,
      structural_lineage_id: "L-TRANSFER-1",
      full_panel_equivalence_group: "E-TRANSFER-1",
      partition: "outer-transfer",
      payload_state: "sealed-evaluator-custody",
      current_public_recipe: false,
    },
  ];
}

function instanceIdentity(manifest) {
  return {
    family_id: manifest.family_id,
    family_version: manifest.family_version,
    structural_lineage_id: manifest.structural_lineage_id,
    parameter_vector_sha256: manifest.parameter_vector_sha256,
    fixed_time_constant_s: manifest.fixed_time_constant_s,
    nuisance_vector_sha256: manifest.nuisance_vector_sha256,
    property_certificate_set_sha256: manifest.property_certificate_set_sha256,
  };
}

function validManifest(overrides = {}) {
  const { instance_id: suppliedInstanceId, ...manifest } = {
    schema: 1,
    contract_version: FIXTURE_026_RSD_T02_POPULATION_DESIGN_VERSION,
    partition: "development",
    family_id: "F-DEV-1",
    family_version: 1,
    structural_lineage_id: "L-DEV-1",
    instance_identity_basis: "sha256-canonical-system-instance-identity-v1",
    parameter_vector_sha256: H_B,
    fixed_time_constant_s: 1,
    nuisance_vector_sha256: H_C,
    property_certificate_set_sha256: H_D,
    pre_response_valid: true,
    independent_system_unit: true,
    procedural_seed: "1540001",
    procedural_seed_role: "software-and-algorithmic-replay-key-only",
    procedural_seed_in_identity: false,
    comparison_inference_permitted: false,
    claim_eligible: false,
    result_label: "NO_RESULT",
    ...overrides,
  };
  return {
    ...manifest,
    instance_id: suppliedInstanceId
      ?? fixture026RsdT02PopulationSystemInstanceId(instanceIdentity(manifest)),
  };
}

function validPacket(manifest = validManifest()) {
  return {
    schema: 1,
    contract_version: FIXTURE_026_RSD_T02_POPULATION_DESIGN_VERSION,
    packet_version: FIXTURE_026_RSD_T02_FIXED_PACKET_VERSION,
    instance_id: manifest.instance_id,
    packet_id: H_E,
    parameter_vector_sha256: manifest.parameter_vector_sha256,
    episodes: [
      {
        episode_id: "STEP-01",
        parameter_vector_sha256: manifest.parameter_vector_sha256,
        time_constant_s: manifest.fixed_time_constant_s,
        realization_ids: ["R-STEP-1"],
      },
      {
        episode_id: "PULSE-01",
        parameter_vector_sha256: manifest.parameter_vector_sha256,
        time_constant_s: manifest.fixed_time_constant_s,
        realization_ids: ["R-PULSE-1", "R-PULSE-2"],
      },
    ],
    comparison_inference_permitted: false,
    claim_eligible: false,
    result_label: "NO_RESULT",
  };
}

test("population design binds the exact Stage-3 bytes and stays prospective NO_RESULT", async () => {
  const { design, stage3Bytes, schema } = await loadFixture();
  assert.equal(assertFixture026RsdT02PopulationDesign(design), design);
  assert.equal(assertFixture026RsdT02PopulationParentStage3({ design, stage3Bytes }), true);
  assert.equal(
    sha256Hex(canonicalize(design)),
    FIXTURE_026_RSD_T02_POPULATION_DESIGN_SHA256,
  );
  assert.equal(schema["x-runtime-validator"].canonical_design_sha256, sha256Hex(canonicalize(design)));
  assert.equal(schema.additionalProperties, false);
  assert.equal(design.comparison_inference_permitted, false);
  assert.equal(design.claim_eligible, false);
  assert.equal(design.result_label, "NO_RESULT");
});

test("procedural seeds cannot be promoted to systems or effective sample size", async () => {
  const { design } = await loadFixture();
  assert.equal(design.parent_stage3.procedural_seeds_are_independent_systems, false);
  assert.equal(design.parent_stage3.procedural_seed_inference_permitted, false);
  assert.equal(design.experimental_unit_contract.primary_independent_unit, "system-instance");
  assert.ok(design.power_contract.forbidden_sample_size_units.includes("procedural-seed"));

  const hostile = structuredClone(design);
  hostile.experimental_unit_contract.primary_independent_unit = "procedural-seed";
  assert.throws(
    () => assertFixture026RsdT02PopulationDesign(hostile),
    /closed prospective NO_RESULT contract/u,
  );
});

test("closed design rejects mixed-system packets, invariant-memory inflation, weak multiplicity, and authority inflation", async () => {
  const { design } = await loadFixture();
  for (const mutate of [
    (value) => { value.packet_contract.time_constant_changes_within_packet_permitted = true; },
    (value) => { value.packet_contract.current_35_projection_packet_eligible = true; },
    (value) => { value.property_contract.primary_scored_property_keys.push("causal_memory"); },
    (value) => { value.property_contract.invariant_primary_exclusions = []; },
    (value) => { value.endpoint_contract.multiplicity_family_size = 2; },
    (value) => { value.endpoint_contract.multiplicity_rule = "holm-within-endpoint-only"; },
    (value) => { value.power_contract.promotion_blocked = false; },
    (value) => { value.custody_contract.release_or_confirmation_authority_exists = true; },
    (value) => { value.comparison_inference_permitted = true; },
    (value) => { value.claim_eligible = true; },
  ]) {
    const hostile = structuredClone(design);
    mutate(hostile);
    assert.throws(
      () => assertFixture026RsdT02PopulationDesign(hostile),
      /closed prospective NO_RESULT contract/u,
    );
  }
});

test("family assignment is lineage- and full-panel-equivalence-group disjoint", async () => {
  const { design } = await loadFixture();
  const assignments = validAssignments();
  assert.equal(
    assertFixture026RsdT02PopulationFamilyAssignments(design, assignments),
    assignments,
  );

  const lineageLeak = structuredClone(assignments);
  lineageLeak[1].structural_lineage_id = lineageLeak[0].structural_lineage_id;
  assert.throws(
    () => assertFixture026RsdT02PopulationFamilyAssignments(design, lineageLeak),
    /structural lineage .* leaks/u,
  );

  const equivalenceLeak = structuredClone(assignments);
  equivalenceLeak[2].full_panel_equivalence_group = equivalenceLeak[0].full_panel_equivalence_group;
  assert.throws(
    () => assertFixture026RsdT02PopulationFamilyAssignments(design, equivalenceLeak),
    /full-panel equivalence group .* leaks/u,
  );
});

test("outer families must be sealed, non-public, and every partition remains nonempty", async () => {
  const { design } = await loadFixture();
  const publicOuter = validAssignments();
  publicOuter[1].current_public_recipe = true;
  assert.throws(
    () => assertFixture026RsdT02PopulationFamilyAssignments(design, publicOuter),
    /public recipe cannot serve/u,
  );

  const unsealedOuter = validAssignments();
  unsealedOuter[1].payload_state = "public-development";
  assert.throws(
    () => assertFixture026RsdT02PopulationFamilyAssignments(design, unsealedOuter),
    /invalid family assignment/u,
  );

  assert.throws(
    () => assertFixture026RsdT02PopulationFamilyAssignments(
      design, validAssignments().slice(0, 2),
    ),
    /every required partition/u,
  );
});

test("instance identity binds a parameterized family and excludes the procedural seed", async () => {
  const { design } = await loadFixture();
  const familyAssignments = validAssignments();
  const manifest = validManifest();
  assert.equal(
    FIXTURE_026_RSD_T02_SYSTEM_INSTANCE_ID_VERSION,
    "fixture-026.rsd-t02-system-instance-identity.v1",
  );
  assert.equal(assertFixture026RsdT02PopulationInstanceManifest({
    design, familyAssignments, manifest,
  }), manifest);
  assert.equal(
    manifest.instance_id,
    fixture026RsdT02PopulationSystemInstanceId(instanceIdentity(manifest)),
  );
  assert.equal(
    validManifest({ procedural_seed: "1540063" }).instance_id,
    manifest.instance_id,
  );
  assert.equal(new Set([
    validManifest({ family_version: 2 }).instance_id,
    validManifest({ structural_lineage_id: "L-DEV-2" }).instance_id,
    validManifest({ parameter_vector_sha256: H_A }).instance_id,
    validManifest({ fixed_time_constant_s: 2 }).instance_id,
    validManifest({ nuisance_vector_sha256: H_B }).instance_id,
    validManifest({ property_certificate_set_sha256: H_C }).instance_id,
  ]).size, 6);
  assert.ok(![
    validManifest({ family_version: 2 }).instance_id,
    validManifest({ structural_lineage_id: "L-DEV-2" }).instance_id,
    validManifest({ parameter_vector_sha256: H_A }).instance_id,
    validManifest({ fixed_time_constant_s: 2 }).instance_id,
    validManifest({ nuisance_vector_sha256: H_B }).instance_id,
    validManifest({ property_certificate_set_sha256: H_C }).instance_id,
  ].includes(manifest.instance_id));

  for (const mutate of [
    (value) => { value.instance_id = value.procedural_seed; },
    (value) => { value.procedural_seed_in_identity = true; },
    (value) => { value.independent_system_unit = false; },
    (value) => { value.seed = value.procedural_seed; },
  ]) {
    const hostile = structuredClone(manifest);
    mutate(hostile);
    assert.throws(
      () => assertFixture026RsdT02PopulationInstanceManifest({
        design, familyAssignments, manifest: hostile,
      }),
      /invalid system-instance manifest/u,
    );
  }

  const alias = validManifest({ instance_id: H_A });
  assert.throws(
    () => assertFixture026RsdT02PopulationInstanceManifest({
      design, familyAssignments, manifest: alias,
    }),
    /instance ID does not match its canonical scientific identity/u,
  );
});

test("one fixed parameter vector and time constant are required across an instance packet", async () => {
  const { design } = await loadFixture();
  const familyAssignments = validAssignments();
  const manifest = validManifest();
  const packet = validPacket(manifest);
  assert.equal(assertFixture026RsdT02PopulationInstancePacket({
    design, familyAssignments, manifest, packet,
  }), packet);

  const changedTau = structuredClone(packet);
  changedTau.episodes[1].time_constant_s = 2;
  assert.throws(
    () => assertFixture026RsdT02PopulationInstancePacket({
      design, familyAssignments, manifest, packet: changedTau,
    }),
    /changes the system instance/u,
  );

  const changedParameters = structuredClone(packet);
  changedParameters.episodes[1].parameter_vector_sha256 = H_C;
  assert.throws(
    () => assertFixture026RsdT02PopulationInstancePacket({
      design, familyAssignments, manifest, packet: changedParameters,
    }),
    /changes the system instance/u,
  );
});

test("a 35-projection-shaped mixed-tau packet is refused rather than relabelled as one system", async () => {
  const { design } = await loadFixture();
  const familyAssignments = validAssignments();
  const manifest = validManifest();
  const packet = validPacket(manifest);
  packet.episodes = Array.from({ length: 35 }, (_, index) => ({
    episode_id: `EPISODE-${String(index + 1).padStart(2, "0")}`,
    parameter_vector_sha256: H_B,
    time_constant_s: index < 9 ? [0.5, 1, 2][index % 3] : 1,
    realization_ids: [`R-${String(index + 1).padStart(2, "0")}`],
  }));
  assert.throws(
    () => assertFixture026RsdT02PopulationInstancePacket({
      design, familyAssignments, manifest, packet,
    }),
    /changes the system instance/u,
  );
});

test("episodes, realizations, rows, and procedural seeds do not inflate effective system n", async () => {
  const { design } = await loadFixture();
  const familyAssignments = validAssignments();
  const manifest = validManifest();
  const records = [
    ["STEP-01", "R-STEP-1", "1540001", 100],
    ["STEP-01", "R-STEP-2", "1540002", 100],
    ["PULSE-01", "R-PULSE-1", "1540003", 200],
    ["PULSE-01", "R-PULSE-2", "1540004", 200],
  ].map(([episodeId, realizationId, proceduralSeed, rowCount]) => ({
    partition: "development",
    structural_lineage_id: "L-DEV-1",
    family_id: "F-DEV-1",
    instance_id: manifest.instance_id,
    packet_id: H_E,
    episode_id: episodeId,
    realization_id: realizationId,
    procedural_seed: proceduralSeed,
    row_count: rowCount,
  }));
  const summary = summarizeFixture026RsdT02PopulationEffectiveUnits({
    design,
    familyAssignments,
    instanceManifests: [manifest],
    records,
  });
  assert.deepEqual(summary, {
    inferential_unit: "system-instance",
    structural_lineage_n: 1,
    family_n: 1,
    effective_system_instance_n: 1,
    packet_n: 1,
    episode_n: 2,
    realization_n: 4,
    procedural_seed_n: 4,
    row_n: 600,
    family_superpopulation_inference_permitted: false,
    comparison_inference_permitted: false,
    claim_eligible: false,
    result_label: "NO_RESULT",
  });
});

test("effective-unit aggregation refuses relabelled instances and the design grants no authority", async () => {
  const { design } = await loadFixture();
  const familyAssignments = validAssignments();
  const manifest = validManifest();
  const records = [
    {
      partition: "development",
      structural_lineage_id: "L-DEV-1",
      family_id: "F-DEV-1",
      instance_id: manifest.instance_id,
      packet_id: H_E,
      episode_id: "STEP-01",
      realization_id: "R-STEP-1",
      procedural_seed: "1540001",
      row_count: 100,
    },
    {
      partition: "outer-confirmation",
      structural_lineage_id: "L-CONF-1",
      family_id: "F-CONF-1",
      instance_id: manifest.instance_id,
      packet_id: H_B,
      episode_id: "STEP-01",
      realization_id: "R-STEP-1",
      procedural_seed: "1540049",
      row_count: 100,
    },
  ];
  assert.throws(
    () => summarizeFixture026RsdT02PopulationEffectiveUnits({
      design,
      familyAssignments,
      instanceManifests: [manifest],
      records,
    }),
    /differs from its validated instance manifest/u,
  );
  assert.throws(
    () => assertFixture026RsdT02PopulationComparisonAuthority(design),
    /has no comparison authority/u,
  );
});

test("same canonical system cannot inflate effective n through alternate instance IDs", async () => {
  const { design } = await loadFixture();
  const familyAssignments = validAssignments();
  const first = validManifest();
  const alias = validManifest({ instance_id: H_A, procedural_seed: "1540002" });
  assert.throws(
    () => summarizeFixture026RsdT02PopulationEffectiveUnits({
      design,
      familyAssignments,
      instanceManifests: [first, alias],
      records: [],
    }),
    /instance ID does not match its canonical scientific identity/u,
  );

  const second = validManifest({ parameter_vector_sha256: H_A });
  const records = [
    { manifest: first, packetId: H_E, seed: "1540001" },
    { manifest: second, packetId: H_B, seed: "1540002" },
  ].map(({ manifest, packetId, seed }) => ({
    partition: manifest.partition,
    structural_lineage_id: manifest.structural_lineage_id,
    family_id: manifest.family_id,
    instance_id: manifest.instance_id,
    packet_id: packetId,
    episode_id: "STEP-01",
    realization_id: "R-STEP-1",
    procedural_seed: seed,
    row_count: 100,
  }));
  const summary = summarizeFixture026RsdT02PopulationEffectiveUnits({
    design,
    familyAssignments,
    instanceManifests: [first, second],
    records,
  });
  assert.equal(summary.effective_system_instance_n, 2);

  const unknown = structuredClone(records);
  unknown[1].instance_id = H_A;
  assert.throws(
    () => summarizeFixture026RsdT02PopulationEffectiveUnits({
      design,
      familyAssignments,
      instanceManifests: [first, second],
      records: unknown,
    }),
    /differs from its validated instance manifest/u,
  );
});
