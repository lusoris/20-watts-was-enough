import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";

import {
  validateFixture019PromotionEvidence,
  validateFixture019SeedEscrowState,
} from "./promotion-validator.mjs";
import { canonicalize } from "../lib/checkpoint-ledger.mjs";

function sha256(value) {
  return createHash("sha256").update(value).digest("hex");
}

test("favorable booleans cannot fabricate Fixture 019 promotion evidence", async () => {
  const result = await validateFixture019PromotionEvidence({
    repositoryRoot: process.cwd(),
    manifest: { artifact: "fixture-019" },
    evidence: {
      schema: 1,
      artifact: "fixture-019",
      confirmation_executed: true,
      transfer_a_executed: true,
      transfer_b_executed: true,
      valid: true,
    },
    launchReceipt: { valid: true },
    paths: {},
  });
  assert.equal(result.valid, false);
  assert.equal(result.fresh_recomputation, true);
  assert.equal(result.eligibility_binding.status, "structurally-blocked");
  assert.match(result.blockers.join(" "), /seed-invariant/);
});

test("wrong artifact identity fails before reading any alleged evidence paths", async () => {
  const result = await validateFixture019PromotionEvidence({
    repositoryRoot: process.cwd(),
    manifest: { artifact: "fixture-007" },
    evidence: {},
    launchReceipt: {},
    paths: {},
  });
  assert.equal(result.valid, false);
  assert.equal(result.fresh_recomputation, true);
});

test("public FM-v1 label derivations cannot substitute for private seed escrow", async () => {
  const repositoryRoot = process.cwd();
  const temporary = await mkdtemp(path.join(repositoryRoot, "tmp-f019-public-seeds-"));
  const relative = path.relative(repositoryRoot, temporary).replaceAll("\\", "/");
  const derive = (split, regime, count) => Array.from({ length: count }, (_, replicate) => {
    const digest = createHash("sha256")
      .update(`FM-v1|FM-T02|${split}|${regime}|${replicate}`)
      .digest();
    return digest.readBigUInt64BE(digest.length - 8).toString();
  });
  const publicPacks = {
    confirmation: derive("confirmation", "base", 256),
    "held-out": [
      ...derive("transfer-a", "overlap-impact", 128),
      ...derive("transfer-b", "funding", 128),
    ],
  };
  try {
    for (const [partition, seeds] of Object.entries(publicPacks)) {
      await writeFile(path.join(temporary, `${partition}.commit.json`), JSON.stringify({
        schema: 1,
        state: "sealed",
        partition,
        algorithm: "sha256-json-array-v1",
        seed_count: seeds.length,
        derivation: "public FM-v1 labels",
        commitment: createHash("sha256").update(JSON.stringify(seeds)).digest("hex"),
      }));
    }
    const result = await validateFixture019SeedEscrowState({
      repositoryRoot,
      manifest: {
        artifact: "fixture-019",
        seeds: {
          confirmation: `${relative}/confirmation.commit.json`,
          held_out: `${relative}/held-out.commit.json`,
        },
      },
    });
    assert.equal(result.valid, false);
    assert.match(result.reason, /rejects every confirmation or held-out seed claim/);
  } finally {
    await rm(temporary, { recursive: true, force: true });
  }
});

test("self-consistent empty artifacts and forged hashes cannot promote FM-v1/FM-T02", async () => {
  const repositoryRoot = await mkdtemp(path.join(process.cwd(), "tmp-f019-forged-promotion-"));
  const runDirectory = path.join(repositoryRoot, "run");
  const analysisDirectory = path.join(runDirectory, "analysis");
  const rawPath = path.join(runDirectory, "raw-events.jsonl");
  const analysisPath = path.join(analysisDirectory, "summary.json");
  const releasePath = path.join(repositoryRoot, "release.json");
  const energyPath = path.join(repositoryRoot, "non-energy-boundary.json");
  const heldOutPath = path.join(repositoryRoot, "held-out.reveal.json");
  try {
    await mkdir(analysisDirectory, { recursive: true });
    await Promise.all([
      writeFile(rawPath, "{}\n"),
      writeFile(analysisPath, "{}\n"),
      writeFile(releasePath, "{}\n"),
      writeFile(energyPath, "{}\n"),
      writeFile(heldOutPath, "{}\n"),
    ]);
    const evidence = {
      schema: 1,
      contract_version: "fixture-019.fm-t02-promotion-evidence.v1",
      artifact: "fixture-019",
      protocol: "FM-T02-forecast",
      claim_scope: ["C-1481"],
      status: "confirmation-and-two-transfers-complete",
      confirmation_executed: true,
      transfer_a_executed: true,
      transfer_b_executed: true,
      energy_boundary: "not-measured-non-energy-claim",
      energy_conclusion_allowed: false,
      source_commit_sha: "a".repeat(40),
      raw_events_sha256: sha256("{}\n"),
      analysis_sha256: sha256("{}\n"),
      release_sha256: sha256("{}\n"),
      energy_boundary_sha256: sha256("{}\n"),
      disjoint_seed_pack_sha256: [sha256("{}\n")],
      repository_root_binding: sha256(path.resolve(repositoryRoot)),
    };
    evidence.evidence_sha256 = sha256(canonicalize(evidence));
    const result = await validateFixture019PromotionEvidence({
      repositoryRoot,
      manifest: { artifact: "fixture-019" },
      evidence,
      launchReceipt: {
        schema: 1,
        artifact: "fixture-019",
        evidence_sha256: evidence.evidence_sha256,
        validator_version: "fixture-019.fm-t02-promotion-validator.v1",
      },
      paths: {
        runDirectory,
        releasePath,
        energyAssignmentsPath: energyPath,
        disjointSeedPackPaths: [heldOutPath],
      },
    });
    assert.equal(result.valid, false);
    assert.equal(result.eligibility_binding.status, "structurally-blocked");
    assert.match(result.blockers.join(" "), /no reviewed successor protocol|seed-invariant/);
  } finally {
    await rm(repositoryRoot, { recursive: true, force: true });
  }
});
