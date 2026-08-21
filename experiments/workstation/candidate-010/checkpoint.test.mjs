import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import {
  deterministicWorkUnits,
  openCheckpointLedger,
  remainingWorkUnits,
} from "./checkpoint.mjs";
import { generateOpportunities } from "./generator.mjs";
import {
  assertDisjointSeedPacks,
  inspectSeedCommitment,
  revealSeedPack,
  seedListCommitment,
} from "./seeds/seed-pack.mjs";

const benchmarkRoot = path.dirname(new URL(import.meta.url).pathname.replace(/^\/(.:)/, "$1"));
const config = JSON.parse(await readFile(path.join(benchmarkRoot, "configs", "smoke.json"), "utf8"));
const arms = ["a", "b"];

function payload(event) {
  return { opportunity_id: event.opportunity_id, seed: event.seed, arm: event.arm, value: event.value };
}

function workKey(event) {
  return `${event.opportunity_id}\u0000${event.arm}`;
}

function eventFor(unit) {
  return {
    opportunity_id: unit.opportunity.id,
    seed: unit.seed,
    arm: unit.arm,
    value: unit.opportunity.evidence[0],
    telemetry_ms: 123.456,
  };
}

async function appendSchedule(ledger, schedule) {
  for (const unit of schedule) await ledger.append(eventFor(unit));
}

test("resume reproduces the uninterrupted scientific payload and hash chain", async () => {
  const temporary = await mkdtemp(path.join(os.tmpdir(), "20w-c010-resume-"));
  const smallConfig = { ...config, opportunities_per_seed: 3 };
  const makeSchedule = () => deterministicWorkUnits({ seeds: [101, 202], config: smallConfig, arms, generateOpportunities });
  try {
    const uninterrupted = await openCheckpointLedger({
      rawPath: path.join(temporary, "full", "events.ndjson"),
      checkpointPath: path.join(temporary, "full", "checkpoint.json"),
      scientificPayload: payload,
      workKey,
    });
    await appendSchedule(uninterrupted, makeSchedule());
    await uninterrupted.saveCheckpoint({ config_sha256: "a".repeat(64) });

    const rawPath = path.join(temporary, "resumed", "events.ndjson");
    const checkpointPath = path.join(temporary, "resumed", "checkpoint.json");
    const interrupted = await openCheckpointLedger({ rawPath, checkpointPath, scientificPayload: payload, workKey });
    const firstFive = [...makeSchedule()].slice(0, 5);
    await appendSchedule(interrupted, firstFive);
    await interrupted.saveCheckpoint({ config_sha256: "a".repeat(64) });
    // Simulate a crash after the sixth durable append but before checkpoint replacement.
    await interrupted.append(eventFor([...makeSchedule()][5]));

    await assert.rejects(
      openCheckpointLedger({
        rawPath,
        checkpointPath,
        scientificPayload: payload,
        workKey,
        runIdentity: { config_sha256: "different" },
      }),
      /run identity/,
    );

    const resumed = await openCheckpointLedger({ rawPath, checkpointPath, scientificPayload: payload, workKey });
    assert.equal(resumed.summary().checkpoint_status, "stale");
    await appendSchedule(resumed, remainingWorkUnits(makeSchedule(), resumed.completedWorkKeys()));
    await resumed.saveCheckpoint({ config_sha256: "a".repeat(64) });

    assert.deepEqual(resumed.summary(), uninterrupted.summary());
    assert.equal(
      await readFile(rawPath, "utf8"),
      await readFile(path.join(temporary, "full", "events.ndjson"), "utf8"),
    );
  } finally {
    assert.ok(temporary.startsWith(os.tmpdir()));
    await rm(temporary, { recursive: true, force: true });
  }
});

test("resume refuses corruption and incomplete trailing records", async () => {
  const temporary = await mkdtemp(path.join(os.tmpdir(), "20w-c010-resume-corrupt-"));
  const rawPath = path.join(temporary, "events.ndjson");
  const checkpointPath = path.join(temporary, "checkpoint.json");
  try {
    const ledger = await openCheckpointLedger({ rawPath, checkpointPath, scientificPayload: payload, workKey });
    await ledger.append(eventFor([...deterministicWorkUnits({ seeds: [101], config: { ...config, opportunities_per_seed: 1 }, arms, generateOpportunities })][0]));
    await writeFile(rawPath, `${await readFile(rawPath, "utf8")}{`, "utf8");
    await assert.rejects(
      openCheckpointLedger({ rawPath, checkpointPath, scientificPayload: payload, workKey }),
      /incomplete trailing record/,
    );
  } finally {
    assert.ok(temporary.startsWith(os.tmpdir()));
    await rm(temporary, { recursive: true, force: true });
  }
});

test("sealed confirmation and held-out commitments require explicit, disjoint reveals", async () => {
  const temporary = await mkdtemp(path.join(os.tmpdir(), "20w-c010-seed-fixture-"));
  const makePack = async (partition, seeds) => {
    const commitment = seedListCommitment(seeds);
    const commitmentPath = path.join(temporary, `${partition}.commit.json`);
    const revealPath = path.join(temporary, `${partition}.reveal.json`);
    await writeFile(commitmentPath, JSON.stringify({
      schema: 1,
      partition,
      state: "sealed",
      algorithm: "sha256-json-array-v1",
      seed_count: seeds.length,
      commitment,
    }));
    await writeFile(revealPath, JSON.stringify({
      schema: 1,
      partition,
      state: "frozen-reveal",
      algorithm: "sha256-json-array-v1",
      commitment,
      seeds,
    }));
    return { commitmentPath, revealPath };
  };
  try {
    const confirmationFiles = await makePack("confirmation", [101, 202, 303]);
    const heldOutFiles = await makePack("held-out", [404, 505, 606]);
    const confirmationCommitment = await inspectSeedCommitment(confirmationFiles.commitmentPath);
    const heldOutCommitment = await inspectSeedCommitment(heldOutFiles.commitmentPath);
    assert.equal("seeds" in confirmationCommitment, false);
    assert.equal("seeds" in heldOutCommitment, false);
    await assert.rejects(
      revealSeedPack({ ...confirmationFiles, phase: "development" }),
      /confirmation execution phase/,
    );
    const confirmation = await revealSeedPack({ ...confirmationFiles, phase: "confirmation" });
    const heldOut = await revealSeedPack({ ...heldOutFiles, phase: "held-out" });
    assert.equal(assertDisjointSeedPacks([
      { partition: "development", seeds: [707, 808] },
      confirmation,
      heldOut,
    ]), true);
  } finally {
    assert.ok(temporary.startsWith(os.tmpdir()));
    await rm(temporary, { recursive: true, force: true });
  }
});
