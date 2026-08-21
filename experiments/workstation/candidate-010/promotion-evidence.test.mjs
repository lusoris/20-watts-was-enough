import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { createHash } from "node:crypto";
import {
  chmod,
  cp,
  mkdir,
  mkdtemp,
  readFile,
  readdir,
  rm,
  symlink,
  writeFile,
} from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { pathToFileURL } from "node:url";
import { promisify } from "node:util";
import { BACKEND_METADATA } from "./backend-registry.mjs";
import { launchVerifiedCapsuleAction } from "./capsule-bootstrap.mjs";
import { createConfirmatoryPreregistration } from "./confirmatory-analysis.mjs";
import {
  EXTERNAL_ENERGY_CONTRACT_VERSION,
  bindExternalEnergyObservation,
  evaluateExternalEnergyReading,
  hashNormalizedExternalEnergyObservation,
  hashProvenanceReviewRecord,
} from "./energy-provider.mjs";
import { buildFactorialDesign } from "./factorial-design.mjs";
import { generateOpportunities } from "./generator.mjs";
import {
  PROMOTION_EVIDENCE_VERSION,
  validateDurablePromotionEvidence,
  validatePromotionEvidence,
} from "./promotion-evidence.mjs";
import { buildExecutionCapsule, destroyExecutionCapsule } from "./execution-capsule.mjs";
import { captureRuntimeIdentity } from "./runtime-identity.mjs";
import { seedListCommitment } from "./seeds/seed-pack.mjs";
import {
  CANDIDATE_010_MANIFEST_FILE,
  captureCandidate010SourceBundle,
  discoverCandidate010SourceFiles,
} from "./source-bundle.mjs";

const executeFile = promisify(execFile);
const benchmarkRoot = path.dirname(new URL(import.meta.url).pathname.replace(/^\/(.:)/, "$1"));
const repositoryRoot = path.resolve(benchmarkRoot, "..", "..", "..");
const candidateRelative = "experiments/workstation/candidate-010";

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

async function createTestLink(target, link, type, context) {
  try {
    await symlink(target, link, type);
    return true;
  } catch (error) {
    if (["EPERM", "EACCES", "ENOTSUP", "UNKNOWN"].includes(error?.code)) {
      context.diagnostic(`link hostile unavailable on this host: ${error.code}`);
      return false;
    }
    throw error;
  }
}

async function git(cwd, ...args) {
  return executeFile("git", ["-c", "core.autocrlf=false", ...args], { cwd, windowsHide: true });
}

function confirmationSeeds(config) {
  const seeds = [];
  for (let seed = 1; seed < 10_000 && seeds.length < 2; seed += 1) {
    const opportunities = generateOpportunities(config, seed);
    if (
      opportunities.every((row) => !row.unsafe)
      && opportunities.filter((row) => (row.evidence[0] + row.evidence[1]) / 2 < config.threshold).length === 2
    ) seeds.push(seed);
  }
  if (seeds.length !== 2) throw new Error("Could not construct balanced test-only confirmation clusters.");
  return seeds;
}

async function makeFixture() {
  const container = await mkdtemp(path.join(os.tmpdir(), "20w-c010-promotion-v2-"));
  const fixtureRepository = path.join(container, "repository");
  const fixtureCandidateRoot = path.join(fixtureRepository, ...candidateRelative.split("/"));
  const executionParent = path.join(container, "execution-parent");
  const releaseBindingRoot = path.join(
    fixtureRepository,
    "experiments",
    "workstation",
    "releases",
    "candidate-010",
  );
  const runDirectory = path.join(
    fixtureRepository,
    "experiments",
    "workstation",
    "runs",
    "candidate-010-confirmation",
  );
  let executionCapsule;
  try {
    await mkdir(fixtureCandidateRoot, { recursive: true });
    await mkdir(executionParent);
    await mkdir(releaseBindingRoot, { recursive: true });
    const sourceFiles = (await discoverCandidate010SourceFiles({ root: repositoryRoot })).source_files;
    for (const relative of [
      ...sourceFiles,
      CANDIDATE_010_MANIFEST_FILE,
      "experiments/workstation/candidate-010/seeds/development.json",
    ]) {
      const destination = path.join(fixtureRepository, ...relative.split("/"));
      await mkdir(path.dirname(destination), { recursive: true });
      await cp(path.join(repositoryRoot, ...relative.split("/")), destination);
    }
    await mkdir(path.join(fixtureRepository, "node_modules"));
    await cp(
      path.join(repositoryRoot, "node_modules", "es-module-lexer"),
      path.join(fixtureRepository, "node_modules", "es-module-lexer"),
      { recursive: true },
    );
    await git(fixtureRepository, "init");
    await git(fixtureRepository, "config", "user.email", "promotion-fixture@example.invalid");
    await git(fixtureRepository, "config", "user.name", "Promotion Fixture");
    await git(fixtureRepository, "add", "--", ".");
    await git(fixtureRepository, "commit", "-m", "promotion capsule fixture");
    const expectedSourceBundle = await captureCandidate010SourceBundle(fixtureRepository);
    const runtimeIdentity = await captureRuntimeIdentity({
      repositoryRoot: fixtureRepository,
      candidateRoot: fixtureCandidateRoot,
    });
    executionCapsule = await buildExecutionCapsule({
      repositoryRoot: fixtureRepository,
      executionParent,
      runtimeIdentity,
      sourcePaths: sourceFiles,
      candidateDirectory: candidateRelative,
    });
    const capsuleCandidateRoot = path.join(executionCapsule.local.source_root, ...candidateRelative.split("/"));
    const modules = Object.fromEntries(await Promise.all([
      "capsule-execution-authority",
      "factorial-runner",
      "promotion-evidence",
      "release-contract",
    ].map(async (name) => [name, await import(pathToFileURL(path.join(capsuleCandidateRoot, `${name}.mjs`)).href)])));

    const config = {
      ...JSON.parse(await readFile(path.join(benchmarkRoot, "configs", "smoke.json"), "utf8")),
      opportunities_per_seed: 4,
      checkpoint_interval_records: 8,
      unsafe_base_rate: 0.000001,
      threshold: -0.8,
      abstention_band: 0,
      verifier_gate: -0.8,
      verifier_threshold: 10,
      reversible_trace_band: 100,
      sprt_log_odds_threshold: -15,
    };
    const fullDesign = buildFactorialDesign({ splits: ["confirmation"] });
    const scenarios = ["signed-publication", "actuator-command"].map((family) => fullDesign.find((row) => (
      row.task_family === family
      && row.factors.trace_revelation === "revealed"
      && row.factors.verifier_decision_coupling === "coupled"
      && row.factors.verifier_informativeness === "informative"
    )));
    const seeds = confirmationSeeds(config);
    const preregistration = createConfirmatoryPreregistration({
      irreversible_violation_margin: 0.01,
      false_commit_margin: 0.01,
    });
    const files = {
      sourceBundlePath: "source-bundle.json",
      executionDescriptorPath: "execution-descriptor.json",
      runtimeIdentityPath: "runtime-identity.json",
      configPath: "config.json",
      designPath: "design.json",
      backendRegistryPath: "backend-registry.json",
      preregistrationPath: "preregistration.json",
      commitmentPath: "confirmation.commit.json",
      revealPath: "confirmation.reveal.json",
    };
    await writeJson(path.join(releaseBindingRoot, files.sourceBundlePath), expectedSourceBundle);
    await writeJson(path.join(releaseBindingRoot, files.executionDescriptorPath), executionCapsule.descriptor);
    await writeJson(path.join(releaseBindingRoot, files.runtimeIdentityPath), executionCapsule.descriptor.runtime_identity);
    await writeJson(path.join(releaseBindingRoot, files.configPath), config);
    await writeJson(path.join(releaseBindingRoot, files.designPath), { scenarios });
    await writeJson(path.join(releaseBindingRoot, files.backendRegistryPath), { backends: BACKEND_METADATA });
    await writeJson(path.join(releaseBindingRoot, files.preregistrationPath), preregistration);
    const commitment = seedListCommitment(seeds);
    await writeJson(path.join(releaseBindingRoot, files.commitmentPath), {
      schema: 1, partition: "confirmation", state: "sealed", algorithm: "sha256-json-array-v1",
      seed_count: seeds.length, commitment,
    });
    await writeJson(path.join(releaseBindingRoot, files.revealPath), {
      schema: 1, partition: "confirmation", state: "frozen-reveal", algorithm: "sha256-json-array-v1",
      commitment, seeds,
    });
    const release = await modules["release-contract"].createFrozenSeedReleaseContract({
      bindingRoot: releaseBindingRoot,
      sourceRoot: executionCapsule.local.source_root,
      releaseVersion: 1,
      partition: "confirmation",
      phase: "confirmation",
      ...files,
    });
    const releasePath = path.join(releaseBindingRoot, "confirmation.release.json");
    await writeJson(releasePath, release);
    const disjointPath = path.join(releaseBindingRoot, "held-out.reveal.json");
    const disjointSeeds = [303, 404];
    const disjointCommitment = seedListCommitment(disjointSeeds);
    await writeJson(path.join(releaseBindingRoot, "held-out.commit.json"), {
      schema: 1,
      partition: "held-out",
      state: "sealed",
      algorithm: "sha256-json-array-v1",
      seed_count: disjointSeeds.length,
      commitment: disjointCommitment,
    });
    await writeJson(disjointPath, {
      schema: 1,
      partition: "held-out",
      state: "frozen-reveal",
      algorithm: "sha256-json-array-v1",
      commitment: disjointCommitment,
      seeds: disjointSeeds,
    });
    return {
      container,
      fixtureRepository,
      fixtureCandidateRoot,
      executionCapsule,
      expectedSourceBundle,
      modules,
      config,
      scenarios,
      seeds,
      releaseBindingRoot,
      releasePath,
      disjointPath,
      runDirectory,
      files,
    };
  } catch (error) {
    if (executionCapsule) await destroyExecutionCapsule(executionCapsule).catch(() => {});
    await rm(container, { recursive: true, force: true });
    throw error;
  }
}

async function runFixtureConfirmation(value) {
  const capsuleParent = path.join(value.container, "confirmation-capsules");
  await mkdir(capsuleParent);
  const runnerUrl = pathToFileURL(path.join(
    value.fixtureRepository,
    ...candidateRelative.split("/"),
    "runner.mjs",
  )).href;
  const options = {
    "release-root": value.releaseBindingRoot,
    release: path.basename(value.releasePath),
    "disjoint-with": "held-out.reveal.json",
    output: value.runDirectory,
    "capsule-parent": capsuleParent,
  };
  const script = [
    `const { runCapsuleConfirmationOperator } = await import(${JSON.stringify(runnerUrl)});`,
    "const result = await runCapsuleConfirmationOperator(JSON.parse(process.argv[1]));",
    "process.stdout.write(JSON.stringify(result));",
  ].join("\n");
  const { stdout, stderr } = await executeFile(
    process.execPath,
    ["--input-type=module", "--eval", script, JSON.stringify(options)],
    {
      cwd: value.fixtureRepository,
      windowsHide: true,
      timeout: 180_000,
      maxBuffer: 1024 * 1024,
    },
  );
  assert.equal(stderr, "");
  assert.deepEqual(await readdir(capsuleParent), []);
  return JSON.parse(stdout);
}

async function runFixturePromotionOperator(value, exportName, options, label) {
  const runnerUrl = pathToFileURL(path.join(value.fixtureCandidateRoot, "runner.mjs")).href;
  const requestPath = path.join(value.container, `${label}.request.json`);
  const resultPath = path.join(value.container, `${label}.result.json`);
  await writeJson(requestPath, options);
  const script = [
    'import { readFile, writeFile } from "node:fs/promises";',
    `const { ${exportName} } = await import(${JSON.stringify(runnerUrl)});`,
    "const request = JSON.parse(await readFile(process.argv[1], 'utf8'));",
    `const result = await ${exportName}(request);`,
    "await writeFile(process.argv[2], JSON.stringify(result));",
  ].join("\n");
  const { stderr } = await executeFile(
    process.execPath,
    ["--input-type=module", "--eval", script, requestPath, resultPath],
    {
      cwd: value.fixtureRepository,
      windowsHide: true,
      timeout: 180_000,
      maxBuffer: 1024 * 1024,
    },
  );
  assert.equal(stderr, "");
  return JSON.parse(await readFile(resultPath, "utf8"));
}

async function runFixtureManifestValidator(value, label) {
  const validatorUrl = pathToFileURL(path.join(
    value.fixtureRepository,
    "scripts",
    "lib",
    "workstation-manifests.mjs",
  )).href;
  const resultPath = path.join(value.container, `${label}.result.json`);
  const script = [
    `const { validateExecutionManifest } = await import(${JSON.stringify(validatorUrl)});`,
    "const { join } = await import('node:path');",
    "const root = process.cwd();",
    "const manifestPath = join(root, 'experiments', 'workstation', 'manifests', 'candidate-010.json');",
    "const result = await validateExecutionManifest(root, manifestPath, 'candidate-010');",
    "await import('node:fs/promises').then(({ writeFile }) => writeFile(process.argv[1], JSON.stringify(result)));",
  ].join("\n");
  const { stderr } = await executeFile(
    process.execPath,
    ["--input-type=module", "--eval", script, resultPath],
    {
      cwd: value.fixtureRepository,
      windowsHide: true,
      timeout: 180_000,
      maxBuffer: 1024 * 1024,
    },
  );
  assert.equal(stderr, "");
  return JSON.parse(await readFile(resultPath, "utf8"));
}

async function cleanupFixture(value) {
  await destroyExecutionCapsule(value.executionCapsule).catch(() => {});
  await rm(value.container, { recursive: true, force: true });
}

async function writeEnergyAssignments(value, energyRoot = value.releaseBindingRoot) {
  const records = await value.modules["factorial-runner"].readFactorialRecords(value.runDirectory);
  const assignments = [];
  for (const [index, record] of records.entries()) {
    const interval = record.measurement_interval;
    const reading = {
      contract_version: EXTERNAL_ENERGY_CONTRACT_VERSION,
      reading_id: `fixture-energy-${index}`,
      record_kind: "hardware-observation",
      provider: {
        type: "external-meter",
        medium: "wall",
        provider_id: "temporary-contract-test-provider",
        meter_id: `temporary-contract-test-meter-${index}`,
        boundary: "temporary schema/plumbing work unit only",
        hardware_configuration: "synthetic contract-valid fixture; not a workstation measurement",
        software_telemetry: false,
      },
      calibration: {
        calibration_id: "temporary-contract-test-calibration",
        calibrated_at: "2026-01-01T00:00:00.000Z",
        valid_until: "2027-01-01T00:00:00.000Z",
        relative_standard_uncertainty: 0.01,
        coverage_factor: 2,
        traceability_reference: "test-only contract fixture; no empirical claim",
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
        end: {
          value: record.arm === "reset-coupled" ? 1 : 10,
          unit: "J",
          observed_at: interval.ended_at,
        },
      },
    };
    const measured = evaluateExternalEnergyReading(reading).measured;
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
      observation_sha256: hashNormalizedExternalEnergyObservation(measured),
    };
    const review = { ...unsignedReview, review_sha256: hashProvenanceReviewRecord(unsignedReview) };
    const observation = bindExternalEnergyObservation(measured, { ownership, provenanceReview: review });
    const rawReadingPath = `energy/raw-${index}.json`;
    const reviewPath = `energy/review-${index}.json`;
    await writeJson(path.join(energyRoot, rawReadingPath), reading);
    await writeJson(path.join(energyRoot, reviewPath), review);
    assignments.push({
      work_unit_id: record.work_unit_id,
      raw_reading_path: rawReadingPath,
      provenance_review_path: reviewPath,
      observation,
    });
  }
  const energyAssignmentsPath = path.join(energyRoot, "energy-assignments.json");
  await writeJson(energyAssignmentsPath, { schema: 1, assignments });
  return energyAssignmentsPath;
}

function evidencePaths(value, executionAuthority, energyAssignmentsPath) {
  return {
    executionAuthority,
    executionCapsule: value.executionCapsule,
    expectedSourceBundle: value.expectedSourceBundle,
    runDirectory: value.runDirectory,
    releaseBindingRoot: value.releaseBindingRoot,
    releasePath: value.releasePath,
    energyAssignmentsPath,
    disjointSeedPackPaths: [value.disjointPath],
  };
}

test("summary booleans and hash-looking strings are never promotion evidence", async () => {
  await assert.rejects(validatePromotionEvidence(true, {}), /complete bundle, not a summary boolean/);
  const body = {
    schema: 1,
    contract_version: PROMOTION_EVIDENCE_VERSION,
    source: { commit: "a".repeat(40), bundle_sha256: "b".repeat(64) },
  };
  const fake = { ...body, evidence_sha256: sha256(canonical(body)) };
  await assert.rejects(validatePromotionEvidence(fake, {}), /not promotion-eligible/);
});

test("promotion evidence is created only inside a live matching capsule capability", async (context) => {
  const value = await makeFixture();
  const authority = value.modules["capsule-execution-authority"];
  const capsulePromotion = value.modules["promotion-evidence"];
  let revoked;
  let completedPaths;
  let completedEvidence;
  let energyAssignmentsPath;
  try {
    const confirmation = await runFixtureConfirmation(value);
    assert.equal(confirmation.status, "verified");
    assert.equal(confirmation.action, "candidate-010-confirmation");
    energyAssignmentsPath = await writeEnergyAssignments(value, value.runDirectory);
    await authority.withVerifiedCapsuleExecutionAuthority({
      executionCapsule: value.executionCapsule,
      expectedSourceBundle: value.expectedSourceBundle,
    }, async (executionAuthority) => {
      revoked = executionAuthority;
      await assert.rejects(capsulePromotion.buildPromotionEvidence({
        ...evidencePaths(value, null, "unused"),
      }), /forged, cloned, foreign, or revoked/);
      await assert.rejects(capsulePromotion.buildPromotionEvidence({
        ...evidencePaths(value, Object.freeze(function forged() {}), "unused"),
      }), /forged, cloned, foreign, or revoked/);
      await assert.rejects(capsulePromotion.buildPromotionEvidence({
        ...evidencePaths(value, executionAuthority, "unused"),
        repositoryRoot: value.fixtureRepository,
        releaseRoot: value.releaseBindingRoot,
      }), /legacy worktree roots are refused/);

      completedPaths = evidencePaths(value, executionAuthority, energyAssignmentsPath);
      const evidence = await capsulePromotion.buildPromotionEvidence(completedPaths);
      completedEvidence = evidence;
      assert.equal(evidence.analysis.eligible_for_superiority_claim, true);
      assert.equal(evidence.analysis.decision, "eligible");
      assert.equal(evidence.capsule.execution_descriptor_sha256, value.executionCapsule.descriptor.descriptor_sha256);
      assert.equal(evidence.capsule.runtime_identity_sha256, value.executionCapsule.descriptor.runtime_identity.identity_sha256);
      assert.equal(evidence.release.execution_descriptor_file_sha256.length, 64);
      assert.equal(evidence.release.runtime_identity_file_sha256.length, 64);
      assert.equal(JSON.stringify(evidence).includes(value.executionCapsule.local.outer_root), false);
      assert.equal(JSON.stringify(evidence).includes(value.executionCapsule.local.source_root), false);
      assert.equal(JSON.stringify(evidence).includes("ownership_token"), false);
      assert.equal((await capsulePromotion.validatePromotionEvidence(evidence, completedPaths)).valid, true);
      await assert.rejects(
        readFile(path.join(value.container, "promotion-evidence.json")),
        (error) => error?.code === "ENOENT",
      );

      const runAlias = path.join(value.container, "linked-run-root");
      if (await createTestLink(
        value.runDirectory,
        runAlias,
        process.platform === "win32" ? "junction" : "dir",
        context,
      )) {
        await assert.rejects(
          capsulePromotion.buildPromotionEvidence({ ...completedPaths, runDirectory: runAlias }),
          /symbolic link|reparse point|resolves through/i,
        );
        await rm(runAlias, { force: true });
      }

      const runConfigPath = path.join(value.runDirectory, "provenance", "config.json");
      const runConfigBody = await readFile(runConfigPath);
      const externalRunConfig = path.join(value.container, "outside-run-config.json");
      await writeFile(externalRunConfig, runConfigBody);
      await rm(runConfigPath);
      try {
        if (await createTestLink(externalRunConfig, runConfigPath, "file", context)) {
          await assert.rejects(
            capsulePromotion.buildPromotionEvidence(completedPaths),
            /symbolic link|reparse point/i,
          );
          await rm(runConfigPath, { force: true });
        }
      } finally {
        await writeFile(runConfigPath, runConfigBody, { flag: "wx" }).catch(async (error) => {
          if (error.code !== "EEXIST") throw error;
          await rm(runConfigPath, { force: true });
          await writeFile(runConfigPath, runConfigBody, { flag: "wx" });
        });
      }

      const assignmentAlias = path.join(value.releaseBindingRoot, "linked-energy-assignments.json");
      if (await createTestLink(energyAssignmentsPath, assignmentAlias, "file", context)) {
        await assert.rejects(
          capsulePromotion.buildPromotionEvidence({
            ...completedPaths,
            energyAssignmentsPath: assignmentAlias,
          }),
          /symbolic link|reparse point/i,
        );
        await rm(assignmentAlias, { force: true });
      }

      const disjointAlias = path.join(value.releaseBindingRoot, "linked-disjoint.json");
      if (await createTestLink(value.disjointPath, disjointAlias, "file", context)) {
        await assert.rejects(
          capsulePromotion.buildPromotionEvidence({
            ...completedPaths,
            disjointSeedPackPaths: [disjointAlias],
          }),
          /symbolic link|reparse point/i,
        );
        await rm(disjointAlias, { force: true });
      }
      await assert.rejects(
        capsulePromotion.buildPromotionEvidence({
          ...completedPaths,
          disjointSeedPackPaths: [path.join(value.container, "outside-disjoint.json")],
        }),
        /escapes its declared root/i,
      );

      const assignmentsBody = await readFile(energyAssignmentsPath);
      const assignments = JSON.parse(assignmentsBody);
      const firstRawRelative = assignments.assignments[0].raw_reading_path;
      const energyInputRoot = path.dirname(energyAssignmentsPath);
      const firstRaw = path.join(energyInputRoot, ...firstRawRelative.split("/"));
      const rawAliasRelative = "energy/raw-linked.json";
      const rawAlias = path.join(energyInputRoot, ...rawAliasRelative.split("/"));
      if (await createTestLink(firstRaw, rawAlias, "file", context)) {
        assignments.assignments[0].raw_reading_path = rawAliasRelative;
        await writeJson(energyAssignmentsPath, assignments);
        await assert.rejects(
          capsulePromotion.buildPromotionEvidence(completedPaths),
          /symbolic link|reparse point/i,
        );
        await writeFile(energyAssignmentsPath, assignmentsBody);
        await rm(rawAlias, { force: true });
      }
      const firstReviewRelative = JSON.parse(assignmentsBody).assignments[0].provenance_review_path;
      const firstReview = path.join(energyInputRoot, ...firstReviewRelative.split("/"));
      const reviewAliasRelative = "energy/review-linked.json";
      const reviewAlias = path.join(energyInputRoot, ...reviewAliasRelative.split("/"));
      if (await createTestLink(firstReview, reviewAlias, "file", context)) {
        const reviewLinkedAssignments = JSON.parse(assignmentsBody);
        reviewLinkedAssignments.assignments[0].provenance_review_path = reviewAliasRelative;
        await writeJson(energyAssignmentsPath, reviewLinkedAssignments);
        await assert.rejects(
          capsulePromotion.buildPromotionEvidence(completedPaths),
          /symbolic link|reparse point/i,
        );
        await writeFile(energyAssignmentsPath, assignmentsBody);
        await rm(reviewAlias, { force: true });
      }

      const externalEnergy = path.join(value.container, "external-energy");
      const energyJunction = path.join(energyInputRoot, "energy-junction");
      await mkdir(externalEnergy);
      await writeFile(path.join(externalEnergy, "raw.json"), await readFile(firstRaw));
      if (await createTestLink(
        externalEnergy,
        energyJunction,
        process.platform === "win32" ? "junction" : "dir",
        context,
      )) {
        const linkedAssignments = JSON.parse(assignmentsBody);
        linkedAssignments.assignments[0].raw_reading_path = "energy-junction/raw.json";
        await writeJson(energyAssignmentsPath, linkedAssignments);
        await assert.rejects(
          capsulePromotion.buildPromotionEvidence(completedPaths),
          /symbolic link|reparse point/i,
        );
        await writeFile(energyAssignmentsPath, assignmentsBody);
        await rm(energyJunction, { force: true });
      }

      const duplicatedAssignments = JSON.parse(assignmentsBody);
      duplicatedAssignments.assignments[1].raw_reading_path = firstRawRelative.replace(
        "energy/",
        "energy/../energy/",
      );
      await writeJson(energyAssignmentsPath, duplicatedAssignments);
      await assert.rejects(
        capsulePromotion.buildPromotionEvidence(completedPaths),
        /duplicates another promotion input real path/i,
      );
      await writeFile(energyAssignmentsPath, assignmentsBody);

      const releaseBody = await readFile(value.releasePath);
      const release = JSON.parse(releaseBody);
      const v2Body = { ...release, contract_version: "candidate-010.frozen-seed-release.v2" };
      delete v2Body.release_sha256;
      await writeJson(value.releasePath, { ...v2Body, release_sha256: sha256(canonical(v2Body)) });
      await assert.rejects(capsulePromotion.buildPromotionEvidence(completedPaths), /Invalid or corrupted frozen release contract/);
      await writeFile(value.releasePath, releaseBody);

      const descriptorPath = path.join(value.releaseBindingRoot, value.files.executionDescriptorPath);
      const descriptorBody = await readFile(descriptorPath);
      await writeFile(descriptorPath, Buffer.concat([descriptorBody, Buffer.from(" ")]));
      await assert.rejects(capsulePromotion.buildPromotionEvidence(completedPaths), /execution_descriptor file hash mismatch/);
      await writeFile(descriptorPath, descriptorBody);

      const runtimePath = path.join(value.releaseBindingRoot, value.files.runtimeIdentityPath);
      const runtimeBody = await readFile(runtimePath);
      await writeFile(runtimePath, Buffer.concat([runtimeBody, Buffer.from(" ")]));
      await assert.rejects(capsulePromotion.buildPromotionEvidence(completedPaths), /runtime_identity file hash mismatch/);
      await writeFile(runtimePath, runtimeBody);

      const provenancePath = path.join(value.runDirectory, "provenance", "capsule-execution-authority.json");
      const provenanceBody = await readFile(provenancePath);
      const provenance = JSON.parse(provenanceBody);
      provenance.runtime_identity_sha256 = "0".repeat(64);
      await writeJson(provenancePath, provenance);
      await assert.rejects(capsulePromotion.buildPromotionEvidence(completedPaths), /authority differs|validation/i);
      await writeFile(provenancePath, provenanceBody);
    });

    const persistedPaths = {
      runDirectory: value.runDirectory,
      releaseBindingRoot: value.releaseBindingRoot,
      releasePath: value.releasePath,
      energyAssignmentsPath,
      disjointSeedPackPaths: [value.disjointPath],
    };

    // This is a temp-only contract/plumbing proof. Commit B changes only mutable
    // registry state; the genuine operator must still rebuild commit A from the
    // release and must never persist evidence in the real repository.
    const registryPath = path.join(
      value.fixtureRepository,
      ...CANDIDATE_010_MANIFEST_FILE.split("/"),
    );
    const mutableRegistry = JSON.parse(await readFile(registryPath, "utf8"));
    mutableRegistry.readiness = "workstation-ready";
    mutableRegistry.seeds.confirmation = "experiments/workstation/releases/candidate-010/confirmation.reveal.json";
    mutableRegistry.seeds.held_out = "experiments/workstation/releases/candidate-010/held-out.reveal.json";
    mutableRegistry.promotion_evidence.status = "present";
    mutableRegistry.promotion_evidence.evidence_path = "experiments/workstation/promotion/candidate-010/evidence.json";
    mutableRegistry.promotion_evidence.promotion_validation_receipt_path = "experiments/workstation/promotion/candidate-010/promotion-validation.launch-receipt.json";
    await writeJson(registryPath, mutableRegistry);
    await git(value.fixtureRepository, "add", "--", CANDIDATE_010_MANIFEST_FILE);
    await git(value.fixtureRepository, "commit", "-m", "publish mutable readiness only");
    const commitB = (await git(value.fixtureRepository, "rev-parse", "HEAD")).stdout.trim();
    assert.notEqual(commitB, value.expectedSourceBundle.vcs.source_commit);

    const operatorCapsuleParent = path.join(value.container, "promotion-operator-capsules");
    await mkdir(operatorCapsuleParent);
    const promotionPair = path.join(
      value.fixtureRepository,
      "experiments",
      "workstation",
      "promotion",
      "candidate-010",
    );
    await mkdir(path.dirname(promotionPair), { recursive: true });
    const evidenceOutput = path.join(promotionPair, "evidence.json");
    const receiptOutput = path.join(promotionPair, "promotion-validation.launch-receipt.json");
    const built = await runFixturePromotionOperator(
      value,
      "runCapsulePromotionBuildOperator",
      {
        paths: persistedPaths,
        capsuleParent: operatorCapsuleParent,
        evidenceOutput,
        receiptOutput,
      },
      "promotion-build-at-commit-b",
    );
    assert.equal(built.capsule_destroyed, true);
    assert.deepEqual(await readdir(operatorCapsuleParent), []);
    const persistedEvidence = JSON.parse(await readFile(evidenceOutput, "utf8"));
    const persistedReceipt = JSON.parse(await readFile(receiptOutput, "utf8"));
    assert.equal(persistedEvidence.source.commit, value.expectedSourceBundle.vcs.source_commit);
    assert.deepEqual(persistedEvidence, built.action_result);
    assert.deepEqual(persistedReceipt, built.launch_receipt);
    const revalidated = await runFixturePromotionOperator(
      value,
      "runCapsulePromotionValidationOperator",
      {
        evidence: persistedEvidence,
        paths: persistedPaths,
        capsuleParent: operatorCapsuleParent,
      },
      "promotion-validate-at-commit-b",
    );
    assert.equal(revalidated.capsule_destroyed, true);
    assert.deepEqual(revalidated.action_result, persistedEvidence);
    assert.deepEqual(await readdir(operatorCapsuleParent), []);

    const readyManifest = await runFixtureManifestValidator(value, "manifest-nine-of-nine");
    const manifestDiagnostic = {
      readiness: readyManifest.readiness,
      errors: readyManifest.errors,
      failed_checks: readyManifest.promotionChecks.filter((check) => !check.passed),
    };
    assert.equal(readyManifest.ready, true, JSON.stringify(manifestDiagnostic));
    assert.equal(readyManifest.readiness, "workstation-ready");
    assert.deepEqual(readyManifest.errors, []);
    assert.equal(readyManifest.promotionChecks.length, 9);
    assert.ok(readyManifest.promotionChecks.every((check) => check.passed));

    const evidenceBytes = await readFile(evidenceOutput);
    await writeJson(evidenceOutput, {
      eligible_for_superiority_claim: true,
      decision: "eligible",
      all_gates_passed: true,
      evidence_sha256: "e".repeat(64),
    });
    const summaryManifest = await runFixtureManifestValidator(value, "manifest-summary-refusal");
    assert.equal(summaryManifest.ready, false);
    assert.ok(summaryManifest.promotionChecks.find((check) => check.id === "promotion-evidence")?.passed === false);
    await writeFile(evidenceOutput, evidenceBytes);

    const launched = await launchVerifiedCapsuleAction({
      executionCapsule: value.executionCapsule,
      action: "candidate-010-promotion-evidence",
      promotionRequest: {
        operation: "validate",
        paths: persistedPaths,
        evidence: completedEvidence,
      },
      expectedSourceBundle: value.expectedSourceBundle,
      requestParent: value.container,
      timeoutMs: 120_000,
      maxOutputBytes: 1024 * 1024,
    });
    assert.deepEqual(launched.action_result, completedEvidence);
    const durable = await validateDurablePromotionEvidence(
      completedEvidence,
      launched.launch_receipt,
      persistedPaths,
    );
    assert.equal(durable.valid, true);
    assert.equal(durable.evidence_sha256, completedEvidence.evidence_sha256);
    assert.equal(durable.launch_receipt_sha256, launched.launch_receipt.receipt_sha256);
    const forgedReceiptBody = {
      ...launched.launch_receipt,
      result_sha256: "0".repeat(64),
    };
    delete forgedReceiptBody.receipt_sha256;
    const rehashedForgedReceipt = {
      ...forgedReceiptBody,
      receipt_sha256: sha256(canonical(forgedReceiptBody)),
    };
    await assert.rejects(
      validateDurablePromotionEvidence(completedEvidence, rehashedForgedReceipt, persistedPaths),
      /does not bind the exact evidence result/i,
    );

    const energyRoot = path.dirname(energyAssignmentsPath);
    for (const scope of ["raw-energy-reading", "energy-provenance-review"]) {
      const row = completedEvidence.input_files.find((entry) => entry.scope === scope);
      const target = path.join(energyRoot, ...row.path.split("/"));
      const original = await readFile(target);
      await writeFile(target, Buffer.concat([original, Buffer.from(" ")]));
      await assert.rejects(
        validateDurablePromotionEvidence(completedEvidence, launched.launch_receipt, persistedPaths),
        /differs from evidence/i,
      );
      await writeFile(target, original);
    }

    await assert.rejects(
      capsulePromotion.buildPromotionEvidence({ ...completedPaths, executionAuthority: revoked }),
      /forged, cloned, foreign, or revoked/,
    );

    const substitutedRunnerPath = path.join(value.fixtureCandidateRoot, "runner.mjs");
    await writeFile(
      substitutedRunnerPath,
      `${await readFile(substitutedRunnerPath, "utf8")}\n// executable substitution at commit C\n`,
    );
    await git(value.fixtureRepository, "add", "--", `${candidateRelative}/runner.mjs`);
    await git(value.fixtureRepository, "commit", "-m", "substitute executable source");
    await assert.rejects(
      runFixturePromotionOperator(
        value,
        "runCapsulePromotionValidationOperator",
        {
          evidence: persistedEvidence,
          paths: persistedPaths,
          capsuleParent: operatorCapsuleParent,
        },
        "promotion-refuse-at-commit-c",
      ),
      /source, execution, and runtime bindings disagree/,
    );

    // A stored v1 receipt is integrity/diagnostic provenance, not an
    // authenticity token. Even a self-consistently rehashed substitution
    // cannot bypass the fresh live capsule recomputation required by Gate 9.
    const rehashedStoredReceiptBody = {
      ...persistedReceipt,
      elapsed_ms: persistedReceipt.elapsed_ms + 1,
    };
    delete rehashedStoredReceiptBody.receipt_sha256;
    await writeJson(receiptOutput, {
      ...rehashedStoredReceiptBody,
      receipt_sha256: sha256(canonical(rehashedStoredReceiptBody)),
    });
    const forgedReceiptAfterSourceChange = await runFixtureManifestValidator(
      value,
      "manifest-rehashed-receipt-cannot-bypass-fresh-source-check",
    );
    assert.equal(forgedReceiptAfterSourceChange.ready, false);
    const failedPromotion = forgedReceiptAfterSourceChange.promotionChecks.find(
      (check) => check.id === "promotion-evidence",
    );
    assert.equal(failedPromotion?.passed, false);
    assert.match(failedPromotion?.detail ?? "", /source, execution, and runtime bindings disagree/);
  } finally {
    await cleanupFixture(value);
  }
});

test("worktree promotion path cannot manufacture confirmation authority", async () => {
  await assert.rejects(
    import(`${pathToFileURL(path.join(benchmarkRoot, "capsule-execution-authority.mjs")).href}?promotion-worktree=1`),
    /worktree|non-generated source root/i,
  );
});

test("source-byte substitution invalidates the active capsule before recomputation", async () => {
  const value = await makeFixture();
  const authority = value.modules["capsule-execution-authority"];
  try {
    const target = path.join(value.executionCapsule.local.source_root, "package.json");
    await assert.rejects(authority.withVerifiedCapsuleExecutionAuthority({
      executionCapsule: value.executionCapsule,
      expectedSourceBundle: value.expectedSourceBundle,
    }, async () => {
      await chmod(target, 0o600);
      await writeFile(target, "{}\n", "utf8");
    }), /source|capsule|inventory|validation/i);
  } finally {
    await cleanupFixture(value);
  }
});
