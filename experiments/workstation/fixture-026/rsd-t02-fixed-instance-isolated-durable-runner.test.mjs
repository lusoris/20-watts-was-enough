import assert from "node:assert/strict";
import { appendFile, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { before, test } from "node:test";
import { fileURLToPath } from "node:url";

import { createAjv } from "../lib/ajv.mjs";

import { canonicalize, sha256Hex } from "../lib/checkpoint-ledger.mjs";
import {
  buildFixture026RsdT02FixedInstancePolicy,
  readFixture026RsdT02FixedInstancePolicyIdentity,
} from "./build-rsd-t02-fixed-instance-conformance-policy.mjs";
import {
  FIXTURE_026_RSD_T02_FIXED_INSTANCE_ISOLATED_DURABLE_CONFIG_SHA256,
  assertFixture026RsdT02FixedInstanceIsolatedDurableConfig,
  openFixture026RsdT02FixedInstanceIsolatedDurableRun,
} from "./rsd-t02-fixed-instance-isolated-durable-runner.mjs";
import { Fixture026RsdT02RunLockContentionError } from "./rsd-t02-run-lock.mjs";
import { generateFixture026RsdT02DevelopmentInstance } from "./rsd-t02-system-family-generator.mjs";

const fixtureRoot = path.dirname(fileURLToPath(import.meta.url));
const OWNER = "fixture-026-hostile-restart-owner-v1";
const FOREIGN_OWNER = "fixture-026-foreign-writer-owner-v1";

let config;
let runnerConfig;
let registry;
let instance;
let validateSchema;

before(async () => {
  const [configText, runnerConfigText, registryText, schemaText] = await Promise.all([
    readFile(path.join(
      fixtureRoot,
      "configs",
      "rsd-t02-fixed-instance-isolated-durable.json",
    ), "utf8"),
    readFile(path.join(fixtureRoot, "configs", "rsd-t02-fixed-instance-runner.json"), "utf8"),
    readFile(path.join(fixtureRoot, "configs", "rsd-t02-system-family-registry.json"), "utf8"),
    readFile(path.join(
      fixtureRoot,
      "rsd-t02-fixed-instance-isolated-durable-runner.schema.json",
    ), "utf8"),
  ]);
  config = JSON.parse(configText);
  runnerConfig = JSON.parse(runnerConfigText);
  registry = JSON.parse(registryText);
  instance = generateFixture026RsdT02DevelopmentInstance({
    registry,
    family_id: "F-DEV-IFFL-AFFINE",
    draw_index: 0,
  });
  validateSchema = createAjv({ allErrors: true }).compile(
    JSON.parse(schemaText),
  );
});

function openRun(outputDirectory, ownerId = OWNER) {
  return openFixture026RsdT02FixedInstanceIsolatedDurableRun({
    config,
    runner_config: runnerConfig,
    registry,
    instance,
    output_directory: outputDirectory,
    owner_id: ownerId,
  });
}

test("closed overlay and content-addressed artifact are exact NO_RESULT inputs", async () => {
  assert.equal(assertFixture026RsdT02FixedInstanceIsolatedDurableConfig(config), config);
  assert.equal(validateSchema(config), true, JSON.stringify(validateSchema.errors));
  assert.equal(
    sha256Hex(canonicalize(config)),
    FIXTURE_026_RSD_T02_FIXED_INSTANCE_ISOLATED_DURABLE_CONFIG_SHA256,
  );
  const identity = await readFixture026RsdT02FixedInstancePolicyIdentity();
  assert.equal(identity.source_sha256, config.policy_bundle.sha256);
  assert.equal(identity.source_utf8_bytes, config.policy_bundle.utf8_bytes);
  assert.equal(identity.artifact_filename, path.basename(config.policy_bundle.relative_path));
  const checked = await buildFixture026RsdT02FixedInstancePolicy({ mode: "check" });
  assert.equal(checked.status, "verified");
  assert.equal(checked.result_label, "NO_RESULT");
  assert.equal(checked.claim_eligible, false);

  const temporary = await mkdtemp(path.join(os.tmpdir(), "20w-f026-fixed-bundle-"));
  try {
    const written = await buildFixture026RsdT02FixedInstancePolicy({
      mode: "write",
      outputDirectory: temporary,
    });
    assert.equal(written.status, "written");
    await rm(written.artifact_path);
    await writeFile(written.artifact_path, "hostile replacement\n", "utf8");
    await assert.rejects(
      buildFixture026RsdT02FixedInstancePolicy({ mode: "check", outputDirectory: temporary }),
      /differs from its content address/u,
    );
  } finally {
    await rm(temporary, { recursive: true, force: true });
  }
});

test("fresh restricted child replay matches uninterrupted and hostile restart disk bytes", {
  timeout: 180_000,
}, async () => {
  const temporary = await mkdtemp(path.join(os.tmpdir(), "20w-f026-fixed-resume-"));
  const uninterruptedDirectory = path.join(temporary, "uninterrupted");
  const restartedDirectory = path.join(temporary, "restarted");
  try {
    const uninterrupted = await openRun(uninterruptedDirectory);
    const initial = uninterrupted.summary();
    assert.equal(initial.records, 0);
    assert.equal(initial.checkpoint_status, "missing");
    assert.equal(initial.result_label, "NO_RESULT");
    assert.equal(validateSchema(initial), true, JSON.stringify(validateSchema.errors));
    assert.equal(uninterrupted.isolated_execution_receipt.fresh_process, true);
    assert.equal(
      uninterrupted.isolated_execution_receipt.execution_mode,
      "fresh-node-child-hardened-vm-per-fixed-packet",
    );
    assert.equal(
      uninterrupted.isolated_execution_receipt.filesystem_read_exposed_to_policy,
      false,
    );
    assert.equal(uninterrupted.isolated_execution_receipt.network_exposed_to_policy, false);
    const uninterruptedFinal = await uninterrupted.appendRemaining();
    assert.equal(uninterruptedFinal.status, "complete");
    assert.equal(uninterruptedFinal.records, 9);
    assert.equal(uninterruptedFinal.checkpoint_status, "current");
    assert.equal(validateSchema(uninterruptedFinal), true, JSON.stringify(validateSchema.errors));
    await uninterrupted.close();

    const firstProcess = await openRun(restartedDirectory);
    await firstProcess.appendNext();
    await firstProcess.appendNext();
    await firstProcess.appendNext();
    await firstProcess.saveCheckpoint();
    const appendedAfterCheckpoint = await firstProcess.appendNext();
    assert.equal(appendedAfterCheckpoint.records, 4);
    assert.equal(appendedAfterCheckpoint.checkpoint_status, "stale");
    await firstProcess.close();

    const restarted = await openRun(restartedDirectory);
    assert.equal(restarted.summary().records, 4);
    assert.equal(restarted.summary().checkpoint_status, "stale");
    const restartedFinal = await restarted.appendRemaining();
    assert.equal(restartedFinal.status, "complete");
    assert.equal(restartedFinal.checkpoint_status, "current");
    await restarted.close();

    assert.equal(
      await readFile(path.join(restartedDirectory, config.durability.raw_path), "utf8"),
      await readFile(path.join(uninterruptedDirectory, config.durability.raw_path), "utf8"),
    );
    assert.equal(
      restartedFinal.scientific_payload_sha256,
      uninterruptedFinal.scientific_payload_sha256,
    );
    assert.equal(restartedFinal.hash_chain_sha256, uninterruptedFinal.hash_chain_sha256);
    const records = (await readFile(
      path.join(restartedDirectory, config.durability.raw_path),
      "utf8",
    )).trimEnd().split("\n").map((line) => JSON.parse(line));
    assert.equal(records.length, 9);
    assert.equal(records.every((record) => (
      record.result_label === "NO_RESULT"
      && record.no_result === true
      && record.claim_eligible === false
      && record.fixed_runner_record.result_label === "NO_RESULT"
    )), true);
    assert.deepEqual(records.map((record) => record.integrity.sequence), [0, 1, 2, 3, 4, 5, 6, 7, 8]);
  } finally {
    await rm(temporary, { recursive: true, force: true });
  }
});

test("session queue serializes concurrent appends/checkpoint and close waits before release", {
  timeout: 180_000,
}, async () => {
  const temporary = await mkdtemp(path.join(os.tmpdir(), "20w-f026-fixed-concurrent-"));
  const outputDirectory = path.join(temporary, "run");
  try {
    const session = await openRun(outputDirectory);
    const queued = Array.from({ length: 12 }, () => session.appendNext());
    queued.push(session.saveCheckpoint());
    const closing = session.close();
    assert.equal(session.close(), closing);
    assert.throws(() => session.appendNext(), /session is closing/u);
    assert.throws(() => session.saveCheckpoint(), /session is closing/u);
    await Promise.all(queued);
    const closed = await closing;
    assert.equal(closed.status, "complete");
    assert.equal(closed.records, 9);
    assert.equal(closed.checkpoint_status, "current");
    const rawBefore = await readFile(
      path.join(outputDirectory, config.durability.raw_path),
      "utf8",
    );
    assert.throws(() => session.appendRemaining(), /session is closed/u);
    assert.equal(
      await readFile(path.join(outputDirectory, config.durability.raw_path), "utf8"),
      rawBefore,
    );
    const records = rawBefore.trimEnd().split("\n").map((line) => JSON.parse(line));
    assert.deepEqual(records.map(({ arm_index: armIndex }) => armIndex), [0, 1, 2, 3, 4, 5, 6, 7, 8]);
    assert.equal(new Set(records.map(({ arm_id: armId }) => armId)).size, 9);
  } finally {
    await rm(temporary, { recursive: true, force: true });
  }
});

test("inputs are snapshotted before await and every public result is a deep-frozen copy", {
  timeout: 180_000,
}, async () => {
  const temporary = await mkdtemp(path.join(os.tmpdir(), "20w-f026-fixed-mutation-"));
  const mutableConfig = structuredClone(config);
  const mutableRunnerConfig = structuredClone(runnerConfig);
  const mutableRegistry = structuredClone(registry);
  const mutableInstance = structuredClone(instance);
  try {
    const opening = openFixture026RsdT02FixedInstanceIsolatedDurableRun({
      config: mutableConfig,
      runner_config: mutableRunnerConfig,
      registry: mutableRegistry,
      instance: mutableInstance,
      output_directory: path.join(temporary, "run"),
      owner_id: OWNER,
    });
    mutableConfig.result_label = "MUTATED_AFTER_CALL";
    mutableConfig.policy_bundle.sha256 = "0".repeat(64);
    mutableRunnerConfig.result_label = "MUTATED_AFTER_CALL";
    mutableRegistry.families[0].family_id = "MUTATED-AFTER-CALL";
    mutableInstance.family_id = "MUTATED-AFTER-CALL";
    const session = await opening;
    const first = session.summary();
    const second = session.summary();
    assert.notEqual(first, second);
    assert.equal(first.result_label, "NO_RESULT");
    assert.equal(
      first.isolated_durable_config_sha256,
      FIXTURE_026_RSD_T02_FIXED_INSTANCE_ISOLATED_DURABLE_CONFIG_SHA256,
    );
    assert.equal(Object.isFrozen(first), true);
    assert.equal(Object.isFrozen(first.foundation_gates), true);
    assert.equal(Object.isFrozen(session.isolated_execution_receipt), true);
    assert.equal(Object.isFrozen(session.isolated_execution_receipt.runtime), true);
    assert.throws(() => { first.status = "mutated"; }, TypeError);
    assert.throws(() => {
      session.isolated_execution_receipt.runtime.node_version = "mutated";
    }, TypeError);
    const appended = await session.appendNext();
    assert.equal(Object.isFrozen(appended), true);
    assert.equal(Object.isFrozen(appended.foundation_gates), true);
    const closed = await session.close();
    assert.equal(Object.isFrozen(closed), true);
    assert.equal(closed.records, 1);
  } finally {
    await rm(temporary, { recursive: true, force: true });
  }
});

test("exclusive writer and owner-bound resume reject live and foreign writers", {
  timeout: 180_000,
}, async () => {
  const temporary = await mkdtemp(path.join(os.tmpdir(), "20w-f026-fixed-owner-"));
  const outputDirectory = path.join(temporary, "run");
  try {
    const owner = await openRun(outputDirectory);
    await assert.rejects(
      openRun(outputDirectory, FOREIGN_OWNER),
      (error) => error instanceof Fixture026RsdT02RunLockContentionError,
    );
    await owner.appendNext();
    await owner.saveCheckpoint();
    await owner.close();

    await assert.rejects(
      openRun(outputDirectory, FOREIGN_OWNER),
      /Checkpoint identity mismatch|owner|disk ledger record/u,
    );
    const resumedOwner = await openRun(outputDirectory);
    assert.equal(resumedOwner.summary().records, 1);
    assert.equal(resumedOwner.summary().result_label, "NO_RESULT");
    await resumedOwner.close();
  } finally {
    await rm(temporary, { recursive: true, force: true });
  }
});

test("torn and altered append-only records refuse restart without repair", {
  timeout: 180_000,
}, async () => {
  const temporary = await mkdtemp(path.join(os.tmpdir(), "20w-f026-fixed-hostile-"));
  const tornDirectory = path.join(temporary, "torn");
  const alteredDirectory = path.join(temporary, "altered");
  try {
    const torn = await openRun(tornDirectory);
    await torn.appendNext();
    await torn.close();
    await appendFile(
      path.join(tornDirectory, config.durability.raw_path),
      "{\"hostile_partial\":",
      "utf8",
    );
    await assert.rejects(openRun(tornDirectory), /torn trailing record/u);

    const altered = await openRun(alteredDirectory);
    await altered.appendNext();
    await altered.close();
    const rawPath = path.join(alteredDirectory, config.durability.raw_path);
    const original = await readFile(rawPath, "utf8");
    await writeFile(
      rawPath,
      original.replace('"arm_id":"A-RAW"', '"arm_id":"C-DUAL"'),
      "utf8",
    );
    await assert.rejects(
      openRun(alteredDirectory),
      /disk ledger record 0|Hash-chain mismatch/u,
    );
  } finally {
    await rm(temporary, { recursive: true, force: true });
  }
});

test("gate claims stop at isolated abstention conformance and durable replay", () => {
  assert.deepEqual(config.foundation_gates, {
    content_addressed_26_projection_policy_bundle: true,
    fresh_restricted_child_per_fixed_packet: true,
    deterministic_full_view_semantic_replay_equivalence: true,
    ownership_safe_append_only_disk_resume: true,
    comparison_policy_execution: false,
    claim_eligible_execution: false,
  });
  assert.equal(config.comparison_inference_permitted, false);
  assert.equal(config.claim_eligible, false);
  assert.equal(config.result_label, "NO_RESULT");
});
