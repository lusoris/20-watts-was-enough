import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdtemp, mkdir, readFile, rename, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { BACKEND_METADATA } from "./backend-registry.mjs";
import { openCheckpointLedger } from "./checkpoint.mjs";
import { createConfirmatoryPreregistration } from "./confirmatory-analysis.mjs";
import {
  EXTERNAL_ENERGY_CONTRACT_VERSION,
  bindExternalEnergyObservation,
  evaluateExternalEnergyReading,
  hashNormalizedExternalEnergyObservation,
  hashProvenanceReviewRecord,
} from "./energy-provider.mjs";
import { buildFactorialDesign } from "./factorial-design.mjs";
import {
  factorialScientificPayload,
  readFactorialRecords,
  runFactorialExperiment,
} from "./factorial-runner.mjs";
import { generateOpportunities } from "./generator.mjs";
import {
  PROMOTION_EVIDENCE_VERSION,
  buildPromotionEvidence,
  validatePromotionEvidence,
} from "./promotion-evidence.mjs";
import { createFrozenSeedReleaseContract } from "./release-contract.mjs";
import { seedListCommitment } from "./seeds/seed-pack.mjs";
import { captureCandidate010SourceBundle } from "./source-bundle.mjs";

const benchmarkRoot = path.dirname(new URL(import.meta.url).pathname.replace(/^\/(.:)/, "$1"));
const repositoryRoot = path.resolve(benchmarkRoot, "..", "..", "..");

function canonical(value) {
  if (value === null || typeof value === "boolean" || typeof value === "string" || typeof value === "number") {
    return JSON.stringify(value);
  }
  if (Array.isArray(value)) return `[${value.map(canonical).join(",")}]`;
  return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${canonical(value[key])}`).join(",")}}`;
}

function sha256(value) {
  return createHash("sha256").update(value).digest("hex");
}

async function writeJson(file, value) {
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function confirmationSeeds(config) {
  const seeds = [];
  for (let seed = 1; seed < 10_000 && seeds.length < 2; seed += 1) {
    const opportunities = generateOpportunities(config, seed);
    if (opportunities.filter((row) => !row.unsafe).length >= 2) seeds.push(seed);
  }
  if (seeds.length !== 2) throw new Error("Could not construct two test-only safe-opportunity clusters.");
  return seeds;
}

function factorialWorkKey(record) {
  return [record.cluster_id, record.pair_id, record.work_unit_id, record.paired_input_sha256].join("\u0000");
}

async function rewriteAsEligiblePlumbingFixture(runDirectory) {
  const records = await readFactorialRecords(runDirectory);
  const firstSafePairByCluster = new Map();
  for (const record of records) {
    if (!record.truth_unsafe && !firstSafePairByCluster.has(record.cluster_id)) {
      firstSafePairByCluster.set(record.cluster_id, record.pair_id);
    }
  }
  const rewritten = records.map((record) => {
    const candidate = record.arm === "reset-coupled";
    const commit = !record.truth_unsafe && (candidate || firstSafePairByCluster.get(record.cluster_id) === record.pair_id);
    const falseReject = !record.truth_unsafe && !commit;
    const { integrity: ignored, ...body } = record;
    void ignored;
    return {
      ...body,
      decision: {
        ...record.decision,
        stage: true,
        commit,
        reset: !commit,
        abstain: false,
      },
      outcome: {
        false_commit: false,
        false_reject: falseReject,
        consequence_weighted_loss: Number(falseReject),
        rollback_violation: false,
        irreversible_violation: false,
      },
      resources: {
        ...record.resources,
        stopping_time_ms: candidate ? 1 : 10,
      },
      budget: {
        ...record.budget,
        observed: {
          ...record.budget.observed,
          wall_time_ms: candidate ? 1 : 10,
        },
      },
      stopping_time_ms: candidate ? 1 : 10,
      filesystem: {
        ...record.filesystem,
        stageExists: false,
        durableExists: commit,
        rollbackComplete: !commit,
        commitComplete: commit,
        irreversible_violation: false,
      },
    };
  });
  const provenance = path.join(runDirectory, "provenance");
  const rawPath = path.join(runDirectory, "raw", "events.ndjson");
  const checkpointPath = path.join(provenance, "checkpoint.json");
  const runPath = path.join(provenance, "run.json");
  const run = JSON.parse(await readFile(runPath, "utf8"));
  await rm(rawPath, { force: true });
  await rm(checkpointPath, { force: true });
  const ledger = await openCheckpointLedger({
    rawPath,
    checkpointPath,
    scientificPayload: factorialScientificPayload,
    workKey: factorialWorkKey,
    runIdentity: run.run_identity,
  });
  for (const record of rewritten) await ledger.append(record);
  await ledger.saveCheckpoint({ complete: true, fixture_scope: "schema-and-plumbing-only" });
  const summary = ledger.summary();
  await writeJson(runPath, {
    ...run,
    scientific_payload_sha256: summary.scientific_payload_sha256,
    hash_chain_sha256: summary.hash_chain_sha256,
  });
}

async function fixture({ claimEligible = false } = {}) {
  const root = await mkdtemp(path.join(repositoryRoot, "tmp-c010-promotion-"));
  const runDirectory = path.join(root, "run");
  const freeze = path.join(root, "freeze");
  await mkdir(freeze, { recursive: true });
  const config = {
    ...JSON.parse(await readFile(path.join(benchmarkRoot, "configs", "smoke.json"), "utf8")),
    opportunities_per_seed: claimEligible ? 4 : 1,
    checkpoint_interval_records: 8,
  };
  const fullDesign = buildFactorialDesign({ splits: ["confirmation"] });
  const scenarios = [
    fullDesign.find((row) => row.task_family === "signed-publication"),
    fullDesign.find((row) => row.task_family === "actuator-command"),
  ];
  const seeds = claimEligible ? confirmationSeeds(config) : [101, 202];
  await runFactorialExperiment({
    config,
    seeds,
    scenarios,
    outputDirectory: runDirectory,
    executionMode: "implementation-test",
  });
  if (claimEligible) await rewriteAsEligiblePlumbingFixture(runDirectory);

  const sourceBundle = await captureCandidate010SourceBundle(repositoryRoot);
  const preregistration = createConfirmatoryPreregistration({
    irreversible_violation_margin: 0.01,
    false_commit_margin: 0.01,
  });
  const relativeRoot = path.relative(repositoryRoot, root).replaceAll("\\", "/");
  const files = {
    sourceBundlePath: `${relativeRoot}/freeze/source-bundle.json`,
    configPath: `${relativeRoot}/freeze/config.json`,
    designPath: `${relativeRoot}/freeze/design.json`,
    backendRegistryPath: `${relativeRoot}/freeze/backend-registry.json`,
    preregistrationPath: `${relativeRoot}/freeze/preregistration.json`,
    commitmentPath: `${relativeRoot}/freeze/confirmation.commit.json`,
    revealPath: `${relativeRoot}/freeze/confirmation.reveal.json`,
  };
  await writeJson(path.join(freeze, "source-bundle.json"), sourceBundle);
  await writeJson(path.join(freeze, "config.json"), config);
  await writeJson(path.join(freeze, "design.json"), { scenarios });
  await writeJson(path.join(freeze, "backend-registry.json"), { backends: BACKEND_METADATA });
  await writeJson(path.join(freeze, "preregistration.json"), preregistration);
  const commitment = seedListCommitment(seeds);
  await writeJson(path.join(freeze, "confirmation.commit.json"), {
    schema: 1,
    partition: "confirmation",
    state: "sealed",
    algorithm: "sha256-json-array-v1",
    seed_count: seeds.length,
    commitment,
  });
  await writeJson(path.join(freeze, "confirmation.reveal.json"), {
    schema: 1,
    partition: "confirmation",
    state: "frozen-reveal",
    algorithm: "sha256-json-array-v1",
    commitment,
    seeds,
  });
  const release = await createFrozenSeedReleaseContract({
    root: repositoryRoot,
    releaseVersion: 1,
    partition: "confirmation",
    phase: "confirmation",
    ...files,
  });
  const releasePath = path.join(freeze, "release.json");
  await writeJson(releasePath, release);
  const disjointPath = path.join(freeze, "held-out.reveal.json");
  await writeJson(disjointPath, { partition: "held-out", seeds: [303, 404] });

  const records = await readFactorialRecords(runDirectory);
  const assignments = [];
  for (const [index, record] of records.entries()) {
    const interval = record.measurement_interval;
    const fixtureReading = {
      contract_version: EXTERNAL_ENERGY_CONTRACT_VERSION,
      reading_id: `fixture-energy-${index}`,
      record_kind: claimEligible ? "hardware-observation" : "test-fixture",
      provider: {
        type: "external-meter",
        medium: "wall",
        provider_id: "temporary-contract-test-provider",
        meter_id: `temporary-contract-test-meter-${index}`,
        boundary: "temporary schema/plumbing test work unit only",
        hardware_configuration: "synthetic contract-valid test artifact; not a real workstation measurement",
        software_telemetry: false,
      },
      calibration: {
        calibration_id: "temporary-contract-test-calibration",
        calibrated_at: "2026-01-01T00:00:00.000Z",
        valid_until: "2027-01-01T00:00:00.000Z",
        relative_standard_uncertainty: 0.01,
        coverage_factor: 2,
        traceability_reference: "test-only contract fixture; no empirical measurement claim",
      },
      interval: {
        started_at: interval.started_at,
        ended_at: interval.ended_at,
        clock_id: "fixture-clock",
        clock_uncertainty_s: 0.001,
        clock_discontinuity_observed: false,
      },
      integrity: { meter_reset_observed: false, negative_reading_observed: false },
      measurement: {
        method: "counter-delta",
        start: { value: 0, unit: "J", observed_at: interval.started_at },
        end: { value: record.arm === "reset-coupled" ? 1 : 10, unit: "J", observed_at: interval.ended_at },
      },
    };
    const measured = evaluateExternalEnergyReading(fixtureReading).measured;
    const ownership = {
      run_id: record.run_id,
      pair_id: record.pair_id,
      work_unit_id: record.work_unit_id,
      scenario_id: record.scenario_id,
      task_family: record.task_family,
      backend_id: record.backend_id,
      cluster_id: record.cluster_id,
      opportunity_id: record.opportunity_id,
      arm: record.arm,
      interval_started_at: interval.started_at,
      interval_ended_at: interval.ended_at,
    };
    const unsignedReview = {
      schema: 1,
      review_id: `fixture-review-${index}`,
      reviewer_id: "temporary-contract-test-reviewer",
      reviewed_at: "2026-08-22T00:00:00.000Z",
      decision: "approved",
      observation_sha256: claimEligible
        ? hashNormalizedExternalEnergyObservation(measured)
        : "a".repeat(64),
    };
    const review = {
      ...unsignedReview,
      review_sha256: claimEligible ? hashProvenanceReviewRecord(unsignedReview) : "b".repeat(64),
    };
    const fakeObservation = {
      ...measured,
      allocation: "paired-work-unit",
      claim_eligibility: "claim-eligible-per-work-unit",
      binding: {
        schema: 1,
        allocation: "paired-work-unit",
        ownership,
        source_observation_sha256: review.observation_sha256,
        provenance_review: review,
      },
    };
    const observation = claimEligible
      ? bindExternalEnergyObservation(measured, { ownership, provenanceReview: review })
      : fakeObservation;
    const rawReadingPath = `energy/raw-${index}.json`;
    const reviewPath = `energy/review-${index}.json`;
    await writeJson(path.join(root, rawReadingPath), fixtureReading);
    await writeJson(path.join(root, reviewPath), review);
    assignments.push({
      work_unit_id: record.work_unit_id,
      raw_reading_path: rawReadingPath,
      provenance_review_path: reviewPath,
      observation,
    });
  }
  const energyAssignmentsPath = path.join(root, "energy-assignments.json");
  await writeJson(energyAssignmentsPath, { schema: 1, assignments });
  return {
    root,
    repositoryRoot,
    runDirectory,
    releaseRoot: repositoryRoot,
    releasePath,
    energyAssignmentsPath,
    disjointSeedPackPaths: [disjointPath],
  };
}

test("summary booleans and hash-looking strings are never accepted as promotion evidence", async () => {
  await assert.rejects(validatePromotionEvidence(true, {}), /complete bundle, not a summary boolean/);
  const body = {
    schema: 1,
    contract_version: PROMOTION_EVIDENCE_VERSION,
    source: { commit: "a".repeat(40), bundle_sha256: "b".repeat(64) },
    ledger: { scientific_payload_sha256: "c".repeat(64), hash_chain_sha256: "d".repeat(64) },
    analysis: { eligible_for_superiority_claim: true, decision: "eligible", validation_errors: [] },
  };
  const fake = { ...body, evidence_sha256: sha256(canonical(body)) };
  await assert.rejects(validatePromotionEvidence(fake, {}), /explicit disjoint seed-pack artifact paths/);
  const tampered = { ...fake, ledger: { ...fake.ledger, records: 1 } };
  await assert.rejects(validatePromotionEvidence(tampered, {}), /canonical digest is invalid/);
});

test("fixture energy and missing release artifacts fail during full recomputation", async () => {
  const paths = await fixture();
  try {
    await assert.rejects(buildPromotionEvidence(paths), /only validated non-fixture external-meter observations|claim-eligible bound provider output/);
    await assert.rejects(buildPromotionEvidence({ ...paths, releasePath: path.join(paths.root, "missing-release.json") }), /Cannot read frozen release/);
  } finally {
    await rm(paths.root, { recursive: true, force: true });
  }
});

test("ledger tampering cannot remove task family, pair, or cluster identity", async () => {
  const paths = await fixture();
  const rawPath = path.join(paths.runDirectory, "raw", "events.ndjson");
  const original = await readFile(rawPath, "utf8");
  try {
    for (const field of ["task_family", "pair_id", "cluster_id"]) {
      const records = original.trim().split(/\r?\n/).map(JSON.parse);
      delete records[0][field];
      await writeFile(rawPath, `${records.map(JSON.stringify).join("\n")}\n`, "utf8");
      await assert.rejects(buildPromotionEvidence(paths), /Factorial|ledger|backend|identity|record/i);
      await writeFile(rawPath, original, "utf8");
    }
  } finally {
    await writeFile(rawPath, original, "utf8");
    await rm(paths.root, { recursive: true, force: true });
  }
});

test("bound release tampering is detected before any promotion analysis", async () => {
  const paths = await fixture();
  const release = JSON.parse(await readFile(paths.releasePath, "utf8"));
  const configPath = path.resolve(paths.releaseRoot, release.bindings.config.path);
  const backupPath = `${configPath}.backup`;
  try {
    await rename(configPath, backupPath);
    await writeJson(configPath, { summary_valid: true, digest: "f".repeat(64) });
    await assert.rejects(buildPromotionEvidence(paths), /Bound config file hash mismatch/);
  } finally {
    await rm(configPath, { force: true });
    await rename(backupPath, configPath);
    await rm(paths.root, { recursive: true, force: true });
  }
});

test("temporary contract-valid hardware fixtures validate schema and plumbing only", async () => {
  const paths = await fixture({ claimEligible: true });
  const persistedEvidencePath = path.join(paths.root, "promotion-evidence.json");
  try {
    const evidence = await buildPromotionEvidence(paths);
    assert.equal(evidence.analysis.eligible_for_superiority_claim, true);
    assert.equal(evidence.analysis.decision, "eligible");
    assert.deepEqual(evidence.analysis.validation_errors, []);
    assert.deepEqual(evidence.analysis.gates, {
      safety_noninferiority: "passed",
      loss_superiority: "passed",
      resource_superiority: "passed",
    });
    assert.equal((await validatePromotionEvidence(evidence, paths)).valid, true);
    await assert.rejects(readFile(persistedEvidencePath), (error) => error?.code === "ENOENT");

    const energyManifest = JSON.parse(await readFile(paths.energyAssignmentsPath, "utf8"));
    const first = energyManifest.assignments[0];
    const rawPath = path.join(paths.root, first.raw_reading_path);
    const reviewPath = path.join(paths.root, first.provenance_review_path);
    const rawBody = await readFile(rawPath);
    const reviewBody = await readFile(reviewPath);

    await writeFile(rawPath, Buffer.concat([rawBody, Buffer.from(" ")]));
    await assert.rejects(validatePromotionEvidence(evidence, paths), /differs from recomputed repository artifacts/);
    await writeFile(rawPath, rawBody);

    await writeFile(reviewPath, Buffer.concat([reviewBody, Buffer.from(" ")]));
    await assert.rejects(validatePromotionEvidence(evidence, paths), /differs from recomputed repository artifacts/);
    await writeFile(reviewPath, reviewBody);
  } finally {
    await rm(paths.root, { recursive: true, force: true });
  }
});
