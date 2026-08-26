import assert from "node:assert/strict";
import { mkdir, mkdtemp, readFile, rm } from "node:fs/promises";
import path from "node:path";
import test from "node:test";

import Ajv from "ajv";

import { canonicalize, sha256Hex } from "../lib/checkpoint-ledger.mjs";
import {
  FIXTURE_026_RSD_T02_ACTIONABLE_ARM_IDS,
  FIXTURE_026_RSD_T02_COST_VECTOR_KEYS,
} from "./rsd-t02-contract.mjs";
import { evaluateFixture026RsdT02Transcript } from "./rsd-t02-evaluator.mjs";
import {
  assertFixture026RsdT02Event,
  buildFixture026RsdT02FrozenResponse,
} from "./rsd-t02-event.mjs";
import {
  buildFixture026RsdT02EpisodeCommand,
  fixture026RsdT02ScheduleSha256,
  generateFixture026RsdT02Transcript,
} from "./rsd-t02-generator.mjs";
import { executeFixture026RsdT02 } from "./rsd-t02-runner.mjs";

const temporaryRoot = path.join(process.cwd(), "tmp");

async function oneEvent() {
  await mkdir(temporaryRoot, { recursive: true });
  const parent = await mkdtemp(path.join(temporaryRoot, "fixture-026-rsd-t02-event-"));
  const output = path.join(parent, "run");
  await executeFixture026RsdT02({ profile: "smoke", output, maxWorkUnits: 1 });
  const raw = await readFile(path.join(output, "rsd-t02-raw-events.jsonl"), "utf8");
  return { parent, output, record: JSON.parse(raw.trimEnd()) };
}

function rehashEvent(record) {
  const payload = { ...record };
  delete payload.integrity;
  record.integrity.record_sha256 = sha256Hex(
    `${record.integrity.previous_sha256}\n${canonicalize(payload)}`,
  );
  return record;
}

function rechargeEvent(record) {
  let bytes = record.serialized_event_bytes_written;
  for (let iteration = 0; iteration < 8; iteration += 1) {
    record.serialized_event_bytes_written = bytes;
    rehashEvent(record);
    const observed = Buffer.byteLength(`${JSON.stringify(record)}\n`, "utf8");
    if (observed === bytes) return record;
    bytes = observed;
  }
  throw new Error("test event byte charge did not converge");
}

function reseedEvent(record, seed) {
  record.seed = seed;
  record.work_key = `${record.run_id}:${record.profile}:${record.seed}:${record.recipe_id}:${record.execution_id}`;
  const command = buildFixture026RsdT02EpisodeCommand({
    profile: record.profile,
    seed,
    recipe_id: record.recipe_id,
    execution_id: record.execution_id,
    episode_id: record.episode_id,
    background_u: record.background_u,
    time_constant_s: record.time_constant_s,
    regime_membership: record.regime_membership,
  });
  const transcript = generateFixture026RsdT02Transcript(command);
  const commitment = buildFixture026RsdT02FrozenResponse({
    executionId: command.execution_id,
    projectionSha256: transcript.projection_sha256,
  });
  record.command_id = command.command_id;
  record.initialization_id = command.initialization_id;
  record.schedule_sha256 = fixture026RsdT02ScheduleSha256(command);
  record.transcript_sha256 = sha256Hex(canonicalize(transcript));
  record.reported_output_sha256 = transcript.reported_output_sha256;
  record.internal_output_sha256 = transcript.internal_output_sha256;
  record.projection_sha256 = transcript.projection_sha256;
  record.projection_utf8_bytes = transcript.projection_utf8_bytes;
  record.projection_hashes_by_actionable_arm = Object.fromEntries(
    FIXTURE_026_RSD_T02_ACTIONABLE_ARM_IDS.map((armId) => [armId, transcript.projection_sha256]),
  );
  record.response = commitment.response;
  record.response_sha256 = commitment.response_sha256;
  record.evaluator = evaluateFixture026RsdT02Transcript(transcript, commitment);
  record.cost_vector.serialized_observation_bytes = transcript.projection_utf8_bytes;
  return rechargeEvent(record);
}

test("the JSON schema and runtime validator close one materialized event", async () => {
  const fixture = await oneEvent();
  try {
    const schema = JSON.parse(await readFile(
      "experiments/workstation/fixture-026/rsd-t02-output.schema.json",
      "utf8",
    ));
    const validate = new Ajv({ allErrors: true, jsonPointers: true }).compile(schema);
    assert.equal(validate(fixture.record), true, JSON.stringify(validate.errors));
    assert.equal(assertFixture026RsdT02Event(fixture.record), fixture.record);
    assert.deepEqual(
      Object.keys(fixture.record.projection_hashes_by_actionable_arm),
      FIXTURE_026_RSD_T02_ACTIONABLE_ARM_IDS,
    );
    assert.equal(
      new Set(Object.values(fixture.record.projection_hashes_by_actionable_arm)).size,
      1,
    );
    assert.deepEqual(Object.keys(fixture.record.cost_vector), FIXTURE_026_RSD_T02_COST_VECTOR_KEYS);
    assert.equal(fixture.record.response.evaluator_oracle_access, false);
    assert.equal(fixture.record.evaluator.evaluator_id, "O-GRAPH");
    assert.equal(fixture.record.result_label, "NO_RESULT");
    assert.deepEqual(fixture.record.execution_claims, []);
    assert.deepEqual(fixture.record.excluded_claims, ["C-1561", "C-1564"]);

    const unknown = structuredClone(fixture.record);
    unknown.future_authority = true;
    assert.equal(validate(unknown), false);
    assert.throws(() => assertFixture026RsdT02Event(unknown), /missing or unknown fields/u);

    for (const mutate of [
      (record) => { record.evaluator.recipe_id = "FORGED"; },
      (record) => { record.evaluator.equation_id = "FORGED"; },
      (record) => { record.evaluator.property_vector.drive_transform = "FORGED"; },
      (record) => { record.evaluator.full_panel_equivalence_class = "FORGED"; },
      (record) => {
        record.evaluator.equation_id = "t02-log-difference-highpass";
        record.evaluator.property_vector.drive_transform = "log-fold";
        record.evaluator.full_panel_equivalence_class = "E-LOG-INPUT-MEMORY";
      },
    ]) {
      const mutant = structuredClone(fixture.record);
      mutate(mutant);
      assert.equal(validate(mutant), false, JSON.stringify(validate.errors));
    }
  } finally {
    assert.ok(fixture.parent.startsWith(temporaryRoot));
    await rm(fixture.parent, { recursive: true, force: true });
  }
});

test("cross-field mutations cannot retain event authority", async () => {
  const fixture = await oneEvent();
  try {
    for (const mutate of [
      (record) => { record.response.actionable_arm_responses[0].projection_sha256 = "f".repeat(64); },
      (record) => { record.projection_hashes_by_actionable_arm["A-RAW"] = "f".repeat(64); },
      (record) => { record.evaluator.response_commitment_sha256 = "f".repeat(64); },
      (record) => { record.cost_vector.scalar_operations = 1; },
      (record) => { record.excluded_claims = ["C-1561"]; },
      (record) => { record.claim_eligible = true; },
    ]) {
      const mutant = structuredClone(fixture.record);
      mutate(mutant);
      assert.throws(
        () => assertFixture026RsdT02Event(mutant),
        /closed abstention|closed contract|cost vector|cross-field or authority/u,
      );
    }
  } finally {
    await rm(fixture.parent, { recursive: true, force: true });
  }
});

test("validly rehashed impossible sequence, seed, and schedule evidence are rejected", async () => {
  const fixture = await oneEvent();
  try {
    for (const mutate of [
      (record) => { record.integrity.sequence = -1; },
      (record) => {
        record.seed = "18446744073709551616";
        record.work_key = `${record.run_id}:${record.profile}:${record.seed}:${record.recipe_id}:${record.execution_id}`;
      },
      (record) => { record.evaluator.maximum_input_schedule_residual_u = 100; },
    ]) {
      const mutant = structuredClone(fixture.record);
      mutate(mutant);
      rechargeEvent(mutant);
      assert.throws(
        () => assertFixture026RsdT02Event(mutant),
        /frozen execution grid|closed contract|cross-field or authority/u,
      );
    }
  } finally {
    await rm(fixture.parent, { recursive: true, force: true });
  }
});

test("JSON Schema and runtime agree on the canonical uint64 seed boundary", async () => {
  const fixture = await oneEvent();
  try {
    const schema = JSON.parse(await readFile(
      "experiments/workstation/fixture-026/rsd-t02-output.schema.json",
      "utf8",
    ));
    const validate = new Ajv({ allErrors: true, jsonPointers: true }).compile(schema);
    for (const [seed, accepted] of [
      ["0", true],
      ["18446744073709551615", true],
      ["18446744073709551616", false],
      ["01", false],
    ]) {
      const record = structuredClone(fixture.record);
      if (accepted) reseedEvent(record, seed);
      else {
        record.seed = seed;
        record.work_key = `${record.run_id}:${record.profile}:${record.seed}:${record.recipe_id}:${record.execution_id}`;
        rechargeEvent(record);
      }
      assert.equal(validate(record), accepted, `${seed}: ${JSON.stringify(validate.errors)}`);
      if (accepted) assert.equal(assertFixture026RsdT02Event(record), record);
      else assert.throws(
        () => assertFixture026RsdT02Event(record),
        /frozen execution grid|cross-field or authority/u,
      );
    }
  } finally {
    await rm(fixture.parent, { recursive: true, force: true });
  }
});

test("self-consistent hashes cannot authorize impossible descriptor, truth, or cost relabels", async () => {
  const fixture = await oneEvent();
  try {
    for (const mutate of [
      (record) => { record.background_u = 3; },
      (record) => { record.equation_id = "t02-log-difference-highpass"; },
      (record) => { record.evaluator.property_vector.drive_transform = "log-fold"; },
      (record) => { record.evaluator.full_panel_equivalence_class = "E-LOG-INPUT-MEMORY"; },
      (record) => { record.cost_vector.input_commands = 999; },
      (record) => {
        record.transcript_sha256 = "f".repeat(64);
        record.evaluator.transcript_sha256 = record.transcript_sha256;
      },
    ]) {
      const mutant = structuredClone(fixture.record);
      mutate(mutant);
      rechargeEvent(mutant);
      assert.throws(
        () => assertFixture026RsdT02Event(mutant),
        /frozen execution grid|closed contract|cross-field or authority/u,
      );
    }
  } finally {
    await rm(fixture.parent, { recursive: true, force: true });
  }
});
