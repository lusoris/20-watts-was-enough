import assert from "node:assert/strict";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { validateExecutionManifest } from "../../scripts/lib/workstation-manifests.mjs";

const root = process.cwd();
const realManifest = path.join(root, "experiments", "workstation", "manifests", "candidate-010.json");

test("smoke readiness cannot promote an artifact to workstation-ready", async () => {
  const result = await validateExecutionManifest(root, realManifest, "candidate-010");
  assert.equal(result.readiness, "smoke-ready");
  assert.equal(result.ready, false);
  assert.deepEqual(result.errors, []);
  assert.deepEqual(
    result.promotionChecks.filter((check) => check.passed).map((check) => check.id),
    [
      "execution-claim-scope",
      "full-profile",
      "full-tests",
      "hash-chain",
      "resume",
      "energy-provider",
    ],
  );
  assert.deepEqual(
    result.promotionChecks.filter((check) => !check.passed).map((check) => check.id),
    ["confirmation-seeds", "held_out-seeds", "promotion-evidence"],
  );
});

test("six truthy placeholder fields cannot pass the execution gate", async () => {
  const temporary = await mkdtemp(path.join(os.tmpdir(), "20w-manifest-"));
  const manifestPath = path.join(temporary, "candidate-010.json");
  try {
    await writeFile(
      manifestPath,
      JSON.stringify({
        schema: 1,
        artifact: "candidate-010",
        readiness: "workstation-ready",
        command: "yes",
        environment: "yes",
        hardware: "yes",
        seeds: "yes",
        data: "yes",
        outputs: "yes",
      }),
    );
    const result = await validateExecutionManifest(root, manifestPath, "candidate-010");
    assert.equal(result.ready, false);
    assert.ok(result.errors.length >= 10);
  } finally {
    assert.ok(temporary.startsWith(os.tmpdir()));
    await rm(temporary, { recursive: true, force: true });
  }
});

test("changing only the readiness label still fails the full gate", async () => {
  const source = JSON.parse(await readFile(realManifest, "utf8"));
  source.readiness = "workstation-ready";
  const temporary = await mkdtemp(path.join(os.tmpdir(), "20w-manifest-full-"));
  const manifestPath = path.join(temporary, "candidate-010.json");
  try {
    await writeFile(manifestPath, JSON.stringify(source));
    const result = await validateExecutionManifest(root, manifestPath, "candidate-010");
    assert.equal(result.ready, false);
    assert.ok(result.errors.some((error) => error.includes("confirmation")));
    assert.ok(result.errors.some((error) => error.includes("held_out")));
    assert.equal(result.promotionChecks.find((check) => check.id === "promotion-evidence").passed, false);
    assert.equal(result.promotionChecks.find((check) => check.id === "full-tests").passed, true);
  } finally {
    assert.ok(temporary.startsWith(os.tmpdir()));
    await rm(temporary, { recursive: true, force: true });
  }
});

test("fake manifest hashes and a favorable summary JSON cannot replace strict evidence", async () => {
  const source = JSON.parse(await readFile(realManifest, "utf8"));
  source.readiness = "workstation-ready";
  const temporary = await mkdtemp(path.join(root, "tmp-c010-manifest-evidence-"));
  const relative = path.relative(root, temporary).replaceAll("\\", "/");
  const evidencePath = path.join(temporary, "evidence.json");
  const releasePath = path.join(temporary, "release.json");
  const energyPath = path.join(temporary, "energy.json");
  const disjointPath = path.join(temporary, "held-out.json");
  const runDirectory = path.join(temporary, "run");
  const manifestPath = path.join(temporary, "candidate-010.json");
  try {
    await mkdir(runDirectory, { recursive: true });
    await writeFile(evidencePath, JSON.stringify({
      schema: 1,
      artifact: "candidate-010",
      status: "validated-hardware-confirmation",
      source_commit_sha: "a".repeat(40),
      implemented_task_families: ["signed-publication", "actuator-command"],
      ledger: {
        valid: true,
        scientific_payload_sha256: "b".repeat(64),
        hash_chain_sha256: "c".repeat(64),
      },
      external_energy: {
        record_kind: "hardware-observation",
        provenance_reviewed: true,
        raw_reading_sha256: "d".repeat(64),
      },
      confirmatory_analysis: {
        decision: "eligible",
        frozen_release: true,
        validation_errors: 0,
      },
    }));
    await writeFile(releasePath, "{}\n");
    await writeFile(energyPath, JSON.stringify({ schema: 1, valid: true }));
    await writeFile(disjointPath, JSON.stringify({ partition: "held-out", seeds: [999] }));
    source.promotion_evidence = {
      status: "present",
      evidence_path: `${relative}/evidence.json`,
      run_directory: `${relative}/run`,
      release_root: relative,
      release_path: `${relative}/release.json`,
      energy_assignments_path: `${relative}/energy.json`,
      disjoint_seed_pack_paths: [`${relative}/held-out.json`],
      sha256: "e".repeat(64),
    };
    await writeFile(manifestPath, JSON.stringify(source));
    const result = await validateExecutionManifest(root, manifestPath, "candidate-010");
    const promotion = result.promotionChecks.find((check) => check.id === "promotion-evidence");
    assert.equal(result.ready, false);
    assert.equal(promotion.passed, false);
    assert.match(promotion.detail, /canonical digest|strict promotion evidence validation failed/);
  } finally {
    assert.ok(temporary.startsWith(root));
    await rm(temporary, { recursive: true, force: true });
  }
});
