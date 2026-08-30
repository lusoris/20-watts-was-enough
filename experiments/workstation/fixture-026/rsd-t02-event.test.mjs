import assert from "node:assert/strict";
import { mkdir, mkdtemp, readFile, rm } from "node:fs/promises";
import path from "node:path";
import test from "node:test";

import { createAjv } from "../lib/ajv.mjs";

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

async function oneEvent(t) {
  await mkdir(temporaryRoot, { recursive: true });
  const parent = await mkdtemp(path.join(temporaryRoot, "fixture-026-rsd-t02-event-"));
  t.after(async () => {
    assert.ok(fixtureParentIsContained(parent));
    await rm(parent, { recursive: true, force: true });
  });
  const output = path.join(parent, "run");
  const execution = await executeFixture026RsdT02({
    profile: "smoke",
    output,
    maxWorkUnits: 1,
  });
  if (execution.boundary_status === "abstained") {
    const diagnostic = {
      boundary_status: execution.boundary_status,
      packet_ordinal: execution.packet_ordinal,
      boundary_invocations: execution.boundary_invocations,
      failed_arm_id: execution.failed_arm_id,
      active_arm_outcomes: execution.active_arm_outcomes,
    };
    throw new Error(
      `Fixture 026 RSD-T02 event setup abstained before materializing a raw ledger: ${JSON.stringify(diagnostic)}`,
    );
  }
  const raw = await readFile(path.join(output, "rsd-t02-raw-events.jsonl"), "utf8");
  return JSON.parse(raw.trimEnd());
}

function fixtureParentIsContained(parent) {
  const relative = path.relative(temporaryRoot, parent);
  return relative !== "" && !relative.startsWith("..") && !path.isAbsolute(relative);
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

test("the JSON schema and runtime validator close one materialized event", async (t) => {
  const sourceRecord = await oneEvent(t);
  const schema = JSON.parse(await readFile(
    "experiments/workstation/fixture-026/rsd-t02-output.schema.json",
    "utf8",
  ));
  const validate = createAjv({ allErrors: true }).compile(schema);
  assert.equal(validate(sourceRecord), true, JSON.stringify(validate.errors));
  assert.equal(assertFixture026RsdT02Event(sourceRecord), sourceRecord);
  assert.deepEqual(
    Object.keys(sourceRecord.projection_hashes_by_actionable_arm),
    FIXTURE_026_RSD_T02_ACTIONABLE_ARM_IDS,
  );
  assert.equal(
    new Set(Object.values(sourceRecord.projection_hashes_by_actionable_arm)).size,
    1,
  );
  assert.deepEqual(Object.keys(sourceRecord.cost_vector), FIXTURE_026_RSD_T02_COST_VECTOR_KEYS);
  assert.equal(sourceRecord.response.evaluator_oracle_access, false);
  assert.equal(sourceRecord.evaluator.evaluator_id, "O-GRAPH");
  assert.equal(sourceRecord.result_label, "NO_RESULT");
  assert.deepEqual(sourceRecord.execution_claims, []);
  assert.deepEqual(sourceRecord.excluded_claims, ["C-1561", "C-1564"]);

  const unknown = structuredClone(sourceRecord);
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
    const mutant = structuredClone(sourceRecord);
    mutate(mutant);
    assert.equal(validate(mutant), false, JSON.stringify(validate.errors));
  }
});

test("cross-field mutations cannot retain event authority", async (t) => {
  const sourceRecord = await oneEvent(t);
  for (const mutate of [
    (record) => { record.response.actionable_arm_responses[0].projection_sha256 = "f".repeat(64); },
    (record) => { record.projection_hashes_by_actionable_arm["A-RAW"] = "f".repeat(64); },
    (record) => { record.evaluator.response_commitment_sha256 = "f".repeat(64); },
    (record) => { record.cost_vector.scalar_operations = 1; },
    (record) => { record.excluded_claims = ["C-1561"]; },
    (record) => { record.claim_eligible = true; },
  ]) {
    const mutant = structuredClone(sourceRecord);
    mutate(mutant);
    assert.throws(
      () => assertFixture026RsdT02Event(mutant),
      /closed abstention|closed contract|cost vector|cross-field or authority/u,
    );
  }
});

test("validly rehashed impossible sequence, seed, and schedule evidence are rejected", async (t) => {
  const sourceRecord = await oneEvent(t);
  for (const mutate of [
    (record) => { record.integrity.sequence = -1; },
    (record) => {
      record.seed = "18446744073709551616";
      record.work_key = `${record.run_id}:${record.profile}:${record.seed}:${record.recipe_id}:${record.execution_id}`;
    },
    (record) => { record.evaluator.maximum_input_schedule_residual_u = 100; },
  ]) {
    const mutant = structuredClone(sourceRecord);
    mutate(mutant);
    rechargeEvent(mutant);
    assert.throws(
      () => assertFixture026RsdT02Event(mutant),
      /frozen execution grid|closed contract|cross-field or authority/u,
    );
  }
});

test("JSON Schema and runtime agree on the canonical uint64 seed boundary", async (t) => {
  const sourceRecord = await oneEvent(t);
  const schema = JSON.parse(await readFile(
    "experiments/workstation/fixture-026/rsd-t02-output.schema.json",
    "utf8",
  ));
  const validate = createAjv({ allErrors: true }).compile(schema);
  for (const [seed, accepted] of [
    ["0", true],
    ["18446744073709551615", true],
    ["18446744073709551616", false],
    ["01", false],
  ]) {
    const record = structuredClone(sourceRecord);
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
});

test("self-consistent hashes cannot authorize impossible descriptor, truth, or cost relabels", async (t) => {
  const sourceRecord = await oneEvent(t);
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
    const mutant = structuredClone(sourceRecord);
    mutate(mutant);
    rechargeEvent(mutant);
    assert.throws(
      () => assertFixture026RsdT02Event(mutant),
      /frozen execution grid|closed contract|cross-field or authority/u,
    );
  }
});
