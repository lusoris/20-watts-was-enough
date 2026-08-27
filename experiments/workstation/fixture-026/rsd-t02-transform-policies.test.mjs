import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import Ajv from "ajv";

import { sha256Hex } from "../lib/checkpoint-ledger.mjs";
import {
  FIXTURE_026_RSD_T02_ACTIVE_ARM_IDS,
  FIXTURE_026_RSD_T02_INACTIVE_ARM_IDS,
  buildFixture026RsdT02ArmCommitment,
  buildFixture026RsdT02SystemPacket,
  evaluateFixture026RsdT02ArmBase,
  validateFixture026RsdT02ArmBankConfig,
} from "./rsd-t02-arm-bank.mjs";
import {
  FIXTURE_026_RSD_T02_PROPERTY_KEYS,
  FIXTURE_026_RSD_T02_RECIPES,
} from "./rsd-t02-contract.mjs";
import {
  buildFixture026RsdT02EpisodeCommand,
  buildFixture026RsdT02ExecutionDescriptors,
  buildFixture026RsdT02WorkUnits,
  fixture026RsdT02Projection,
  generateFixture026RsdT02Transcript,
} from "./rsd-t02-generator.mjs";
import {
  FIXTURE_026_RSD_T02_TRANSFORM_ARM_IDS,
  evaluateFixture026RsdT02TransformPolicy,
} from "./rsd-t02-transform-policies.mjs";

const SEED = "1561001";
const CONFIG_PATH = "experiments/workstation/fixture-026/configs/rsd-t02-arm-bank.json";
const POLICY_PATH = "experiments/workstation/fixture-026/rsd-t02-arm-bank.mjs";
const SCHEMA_PATH = "experiments/workstation/fixture-026/rsd-t02-arm-bank.schema.json";
const TRANSFORM_ARM_IDS = Object.freeze([
  "A-RAW",
  "B-STATIC-DIV",
  "B-STREAM",
  "B-LOG-RATIO",
  "B-DIFFERENCE",
  "C-DUAL",
]);
const EXPECTED_ACTIVE_ARM_IDS = Object.freeze([
  "A-RAW",
  "B-STATIC-DIV",
  "B-STREAM",
  "B-LOG-RATIO",
  "B-DIFFERENCE",
  "B-STATE-SPACE",
  "B-RECURRENT",
  "C-MECHANISM-BANK",
  "C-DUAL",
]);
const EXPECTED_COUNTERS = Object.freeze({
  "A-RAW": Object.freeze({
    scalar_operations: 9420,
    transcendental_evaluations: 0,
    policy_sample_rows_read: 6214,
  }),
  "B-STATIC-DIV": Object.freeze({
    scalar_operations: 4,
    transcendental_evaluations: 0,
    policy_sample_rows_read: 2,
  }),
  "B-STREAM": Object.freeze({
    scalar_operations: 24600,
    transcendental_evaluations: 3,
    policy_sample_rows_read: 3074,
  }),
  "B-LOG-RATIO": Object.freeze({
    scalar_operations: 4,
    transcendental_evaluations: 1,
    policy_sample_rows_read: 2,
  }),
  "B-DIFFERENCE": Object.freeze({
    scalar_operations: 577,
    transcendental_evaluations: 0,
    policy_sample_rows_read: 128,
  }),
  "C-DUAL": Object.freeze({
    scalar_operations: 10010,
    transcendental_evaluations: 1,
    policy_sample_rows_read: 6346,
  }),
});
const DECIDED_KEYS = Object.freeze({
  "A-RAW": Object.freeze([
    "reported_output_feedback_edge",
    "channel_local_state",
    "causal_memory",
  ]),
  "B-STATIC-DIV": Object.freeze(["drive_transform"]),
  "B-STREAM": Object.freeze([
    "reported_output_feedback_edge",
    "channel_local_state",
  ]),
  "B-LOG-RATIO": Object.freeze(["drive_transform"]),
  "B-DIFFERENCE": Object.freeze(["drive_transform"]),
  "C-DUAL": FIXTURE_026_RSD_T02_PROPERTY_KEYS,
});

const units = buildFixture026RsdT02WorkUnits({ profile: "smoke", seeds: [SEED] });
const descriptors = buildFixture026RsdT02ExecutionDescriptors();
const packets = new Map();

async function inputs() {
  const [configText, policyBytes] = await Promise.all([
    readFile(CONFIG_PATH, "utf8"),
    readFile(POLICY_PATH),
  ]);
  return {
    config: validateFixture026RsdT02ArmBankConfig(JSON.parse(configText)),
    policyArtifactSha256: sha256Hex(policyBytes),
    policyArtifactBytes: policyBytes.byteLength,
    policyConfigSha256: sha256Hex(configText),
    policyConfigBytes: Buffer.byteLength(configText, "utf8"),
  };
}

function packetFor(recipeId) {
  if (!packets.has(recipeId)) {
    const projections = units
      .filter(({ recipe_id: registeredId }) => registeredId === recipeId)
      .map((unit) => fixture026RsdT02Projection(
        generateFixture026RsdT02Transcript(buildFixture026RsdT02EpisodeCommand(unit)),
      ));
    packets.set(recipeId, buildFixture026RsdT02SystemPacket(projections));
  }
  return packets.get(recipeId);
}

function fullPanelProjectionIndex(episodeId) {
  const index = descriptors.findIndex((descriptor) => (
    descriptor.regime_membership[0] === "O1-FULL-PANEL"
    && descriptor.episode_id === episodeId
  ));
  assert.notEqual(index, -1, `missing public descriptor ${episodeId}`);
  return index;
}

function assertClosedScope(properties, truth, decidedKeys) {
  for (const key of FIXTURE_026_RSD_T02_PROPERTY_KEYS) {
    const result = properties[key];
    if (decidedKeys.includes(key)) {
      assert.equal(result.action, "decide", key);
      assert.equal(result.decision, truth[key], key);
      assert.equal(Number.isFinite(result.evidence), true, key);
      assert.notEqual(result.reason_codes[0], "outside-bounded-policy-scope", key);
    } else {
      assert.equal(result.action, "abstain", key);
      assert.equal(result.decision, null, key);
      assert.equal(result.evidence, null, key);
      assert.deepEqual(result.reason_codes, ["outside-bounded-policy-scope"], key);
    }
  }
}

test("all six transform policies execute their frozen scopes on all five public worlds", async () => {
  const { config } = await inputs();
  assert.deepEqual(FIXTURE_026_RSD_T02_TRANSFORM_ARM_IDS, TRANSFORM_ARM_IDS);
  for (const recipe of FIXTURE_026_RSD_T02_RECIPES) {
    const { packet } = packetFor(recipe.recipe_id);
    for (const armId of TRANSFORM_ARM_IDS) {
      const result = evaluateFixture026RsdT02ArmBase({ armId, packet, config });
      assert.equal(result.arm_id, armId);
      assert.deepEqual(result.counter, EXPECTED_COUNTERS[armId], armId);
      assertClosedScope(result.properties, recipe.property_vector, DECIDED_KEYS[armId]);
    }
  }
});

test("the streaming policy is prefix-causal at its registered decision instants", async () => {
  const { config } = await inputs();
  const { packet } = packetFor("M-NONLINEAR-FEEDBACK");
  const baseline = evaluateFixture026RsdT02TransformPolicy({
    armId: "B-STREAM",
    packet,
    policy: config.policies["B-STREAM"],
  });
  const altered = structuredClone(packet);
  const clamp = altered.projections[fullPanelProjectionIndex("CLAMP-OUTPUT-01")];
  const restimulation = altered.projections[fullPanelProjectionIndex("RESTIM-CROSS-01")];
  for (const sample of clamp.samples) {
    if (sample.time_s > 1) sample.reported_output += 1000;
  }
  for (const sample of restimulation.samples) {
    if (sample.time_s > 2) sample.reported_output -= 1000;
  }
  const afterFutureMutation = evaluateFixture026RsdT02TransformPolicy({
    armId: "B-STREAM",
    packet: altered,
    policy: config.policies["B-STREAM"],
  });
  assert.deepEqual(
    afterFutureMutation.properties.reported_output_feedback_edge,
    baseline.properties.reported_output_feedback_edge,
  );
  assert.deepEqual(
    afterFutureMutation.properties.channel_local_state,
    baseline.properties.channel_local_state,
  );
  assert.deepEqual(afterFutureMutation.counter, baseline.counter);
});

test("the log-ratio policy abstains explicitly outside its positive drive support", async () => {
  const { config } = await inputs();
  const altered = structuredClone(packetFor("M-I1-FFL").packet);
  const ramp = altered.projections[fullPanelProjectionIndex("RAMP-LIN-UP-0P5")];
  ramp.samples[0].input_a_u = 0;
  const result = evaluateFixture026RsdT02TransformPolicy({
    armId: "B-LOG-RATIO",
    packet: altered,
    policy: config.policies["B-LOG-RATIO"],
  });
  assert.deepEqual(result.properties.drive_transform, {
    closed_values: ["affine-fold", "log-fold"],
    action: "abstain",
    decision: null,
    evidence: null,
    reason_codes: ["log-ratio-domain-unsupported"],
  });
  assert.deepEqual(result.counter, {
    scalar_operations: 0,
    transcendental_evaluations: 0,
    policy_sample_rows_read: 2,
  });
});

test("C-DUAL requires unanimous drive votes and never invokes a fallback", async () => {
  const provenance = await inputs();
  const { packet } = packetFor("M-I1-FFL");
  const dissentingPolicy = {
    ...provenance.config.policies["C-DUAL"],
    static_drive_log_floor: 10,
    static_drive_affine_ceiling: 10,
    log_drive_log_floor: 0,
    log_drive_affine_ceiling: -1,
    difference_drive_affine_floor: 0,
    difference_drive_log_ceiling: -1,
  };
  const dissent = evaluateFixture026RsdT02TransformPolicy({
    armId: "C-DUAL",
    packet,
    policy: dissentingPolicy,
  });
  assert.equal(dissent.properties.drive_transform.action, "abstain");
  assert.equal(dissent.properties.drive_transform.decision, null);
  assert.equal(dissent.properties.drive_transform.evidence, 1);
  assert.deepEqual(
    dissent.properties.drive_transform.reason_codes,
    ["dual-drive-branches-disagree"],
  );

  const commitment = buildFixture026RsdT02ArmCommitment({
    profile: "smoke",
    packetInputs: FIXTURE_026_RSD_T02_RECIPES.map((recipe, systemSlot) => ({
      seed: SEED,
      system_slot: systemSlot,
      packet: packetFor(recipe.recipe_id).packet,
    })),
    ...provenance,
  });
  assert.deepEqual(commitment.active_arm_ids, EXPECTED_ACTIVE_ARM_IDS);
  assert.deepEqual(commitment.inactive_arm_ids, []);
  for (const [index, record] of commitment.packet_records.entries()) {
    const response = record.active_arm_responses.at(-1);
    const truth = FIXTURE_026_RSD_T02_RECIPES[index].property_vector.drive_transform;
    assert.equal(response.arm_id, "C-DUAL");
    assert.deepEqual(response.support, { status: "inside", reason_codes: [] });
    assert.equal(response.properties.drive_transform.decision, truth);
    assert.equal(
      response.properties.drive_transform.evidence,
      truth === "affine-fold" ? 3 : -3,
    );
    assert.deepEqual(
      response.properties.drive_transform.reason_codes,
      ["dual-drive-unanimous-consensus"],
    );
    assert.equal(response.resource_ledger.inference.actual.fallback_invocations, 0);
  }

  const schema = JSON.parse(await readFile(SCHEMA_PATH, "utf8"));
  const validate = new Ajv({ allErrors: true, jsonPointers: true }).compile(schema);
  assert.equal(validate(commitment), true, JSON.stringify(validate.errors));
  assert.deepEqual(FIXTURE_026_RSD_T02_ACTIVE_ARM_IDS, EXPECTED_ACTIVE_ARM_IDS);
  assert.deepEqual(FIXTURE_026_RSD_T02_INACTIVE_ARM_IDS, []);

  const reordered = structuredClone(commitment);
  [
    reordered.packet_records[0].active_arm_responses[0],
    reordered.packet_records[0].active_arm_responses[1],
  ] = [
    reordered.packet_records[0].active_arm_responses[1],
    reordered.packet_records[0].active_arm_responses[0],
  ];
  assert.equal(validate(reordered), false);
});
