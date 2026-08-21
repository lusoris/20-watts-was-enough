import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import {
  access, mkdir, mkdtemp, readFile, readdir, rm, writeFile,
} from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { BACKEND_METADATA } from "./backend-registry.mjs";
import { canonicalize, nextRecordHash } from "./checkpoint.mjs";
import { analyzeConfirmatory, CONFIRMATORY_PREREGISTRATION } from "./confirmatory-analysis.mjs";
import { buildFactorialDesign } from "./factorial-design.mjs";
import { createFrozenSeedReleaseContract } from "./release-contract.mjs";
import { RunLockContentionError, acquireRunLock } from "./run-lock.mjs";
import { seedListCommitment } from "./seeds/seed-pack.mjs";
import {
  CANDIDATE_010_SOURCE_FILES,
  captureCandidate010SourceBundle,
  computeSourceBundle,
} from "./source-bundle.mjs";
import {
  analyzeFactorialRun,
  deriveFactorialRecordIdentities,
  factorialScientificPayload,
  readFactorialRecords,
  runFactorialExperiment,
  validateFactorialRun,
} from "./factorial-runner.mjs";

test("factorial writers fail closed before output mutation when another lease owns the run", async () => {
  const temporary = await mkdtemp(path.join(os.tmpdir(), "20w-c010-factorial-lock-"));
  const outputDirectory = path.join(temporary, "contended-output");
  const lease = await acquireRunLock({ outputDirectory, runnerId: "hostile-existing-writer" });
  try {
    await assert.rejects(
      runFactorialExperiment({
        config: smokeConfig,
        seeds: [1101],
        scenarios: buildFactorialDesign({ splits: ["development"] }).slice(0, 1),
        outputDirectory,
      }),
      (error) => error instanceof RunLockContentionError,
    );
    await assert.rejects(
      analyzeFactorialRun(outputDirectory),
      (error) => error instanceof RunLockContentionError,
    );
    await assert.rejects(
      validateFactorialRun(outputDirectory),
      (error) => error instanceof RunLockContentionError,
    );
    await assert.rejects(access(outputDirectory), (error) => error.code === "ENOENT");
  } finally {
    await lease.release();
    await rm(temporary, { recursive: true, force: true });
  }
});

test("factorial execution releases its lease when a post-acquisition check fails", async () => {
  const temporary = await mkdtemp(path.join(os.tmpdir(), "20w-c010-factorial-unlock-"));
  const outputDirectory = path.join(temporary, "existing-output");
  try {
    await mkdir(outputDirectory);
    await assert.rejects(
      runFactorialExperiment({
        config: smokeConfig,
        seeds: [1101],
        scenarios: buildFactorialDesign({ splits: ["development"] }).slice(0, 1),
        outputDirectory,
      }),
      /already exists/,
    );
    const nextLease = await acquireRunLock({ outputDirectory, runnerId: "verified-next-writer" });
    assert.equal(await nextLease.release(), true);
  } finally {
    await rm(temporary, { recursive: true, force: true });
  }
});

const benchmarkRoot = path.dirname(new URL(import.meta.url).pathname.replace(/^\/(.:)/, "$1"));
const repositoryRoot = path.resolve(benchmarkRoot, "..", "..", "..");
const smokeConfig = JSON.parse(await readFile(path.join(benchmarkRoot, "configs", "smoke.json"), "utf8"));

function stableProjection(record) {
  return {
    run_id: record.run_id,
    scenario_id: record.scenario_id,
    task_family: record.task_family,
    backend_id: record.backend_id,
    cluster_id: record.cluster_id,
    pair_id: record.pair_id,
    work_unit_id: record.work_unit_id,
    paired_input_sha256: record.paired_input_sha256,
    arm_order_schedule_id: record.arm_order_schedule_id,
    arm_order_index: record.arm_order_index,
    opportunity_id: record.opportunity_id,
    seed: record.seed,
    arm: record.arm,
    candidate_variant: record.candidate_variant,
    truth_unsafe: record.truth_unsafe,
    evidence: record.evidence,
    trace: record.trace,
    decision: record.decision,
    outcome: record.outcome,
    budget: {
      arm: record.budget.arm,
      assigned_allowance: record.budget.assigned_allowance,
      observed: {
        ...record.budget.observed,
        wall_time_ms: 0,
      },
    },
    filesystem: {
      boundary: record.filesystem.boundary,
      task_family: record.filesystem.task_family,
      backend_id: record.filesystem.backend_id,
      trace_output_sha256: record.filesystem.trace_output_sha256,
      staged_bytes_written: record.filesystem.staged_bytes_written,
      durable_bytes_written: record.filesystem.durable_bytes_written,
      rollbackComplete: record.filesystem.rollbackComplete,
      commitComplete: record.filesystem.commitComplete,
      irreversible_violation: record.filesystem.irreversible_violation,
    },
  };
}

async function rewriteLedger(outputDirectory, mutate) {
  const rawPath = path.join(outputDirectory, "raw", "events.ndjson");
  const runPath = path.join(outputDirectory, "provenance", "run.json");
  const checkpointPath = path.join(outputDirectory, "provenance", "checkpoint.json");
  const records = (await readFile(rawPath, "utf8")).trim().split(/\r?\n/).map(JSON.parse);
  mutate(records);
  const digest = createHash("sha256");
  let previous = "0".repeat(64);
  for (const [sequence, record] of records.entries()) {
    delete record.integrity;
    const payload = canonicalize(factorialScientificPayload(record));
    const recordSha256 = nextRecordHash(previous, payload);
    record.integrity = {
      sequence,
      previous_sha256: previous,
      record_sha256: recordSha256,
    };
    digest.update(payload);
    previous = recordSha256;
  }
  await writeFile(rawPath, `${records.map(JSON.stringify).join("\n")}\n`, "utf8");
  const run = JSON.parse(await readFile(runPath, "utf8"));
  run.scientific_payload_sha256 = digest.digest("hex");
  run.hash_chain_sha256 = previous;
  await writeFile(runPath, `${JSON.stringify(run, null, 2)}\n`, "utf8");
  await rm(checkpointPath, { force: true });
}

async function writeJson(file, value) {
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

async function confirmationReleaseFixture({
  config,
  scenarios,
  partition = "confirmation",
  seeds = [4_040_401, 4_040_402],
  mutateSource = false,
}) {
  const root = await mkdtemp(path.join(os.tmpdir(), "20w-c010-run-release-"));
  const currentSource = await captureCandidate010SourceBundle(repositoryRoot);
  for (const relative of CANDIDATE_010_SOURCE_FILES) {
    const destination = path.join(root, ...relative.split("/"));
    await mkdir(path.dirname(destination), { recursive: true });
    await writeFile(destination, await readFile(path.join(repositoryRoot, ...relative.split("/"))));
  }
  if (mutateSource) {
    await writeFile(
      path.join(root, "experiments", "workstation", "candidate-010", "generator.mjs"),
      "export function generateOpportunities() { return []; }\n",
      "utf8",
    );
  }
  const sourceBundle = mutateSource
    ? await computeSourceBundle({
        root,
        sourceFiles: CANDIDATE_010_SOURCE_FILES,
        vcs: currentSource.vcs,
      })
    : currentSource;
  const files = {
    sourceBundlePath: "freeze/source-bundle.json",
    configPath: "freeze/config.json",
    designPath: "freeze/design.json",
    backendRegistryPath: "experiments/workstation/candidate-010/backend-registry.mjs",
    preregistrationPath: "freeze/preregistration.json",
    commitmentPath: "freeze/seeds.commit.json",
    revealPath: "freeze/seeds.reveal.json",
  };
  const commitment = seedListCommitment(seeds);
  await writeJson(path.join(root, files.sourceBundlePath), sourceBundle);
  await writeJson(path.join(root, files.configPath), config);
  await writeJson(path.join(root, files.designPath), { scenarios });
  await writeJson(path.join(root, files.preregistrationPath), { id: "fixture-preregistration" });
  await writeJson(path.join(root, files.commitmentPath), {
    schema: 1,
    partition,
    state: "sealed",
    algorithm: "sha256-json-array-v1",
    seed_count: seeds.length,
    commitment,
  });
  await writeJson(path.join(root, files.revealPath), {
    schema: 1,
    partition,
    state: "frozen-reveal",
    algorithm: "sha256-json-array-v1",
    commitment,
    seeds,
  });
  const contract = await createFrozenSeedReleaseContract({
    root,
    releaseVersion: 1,
    partition,
    phase: partition,
    ...files,
  });
  const releasePath = path.join(root, "freeze", "release.json");
  await writeJson(releasePath, contract);
  return {
    root,
    releasePath,
    contract,
    commitment,
    release: {
      root,
      releasePath,
      disjointWith: [
        { partition: "development", seeds: [1_010_101] },
        { partition: "held-out", seeds: [9_090_901] },
      ],
    },
  };
}

function confirmationContext(phase = "implementation-test") {
  return {
    schema: 1,
    phase,
    frozen_release: false,
    preregistration_id: CONFIRMATORY_PREREGISTRATION.id,
    task_families: Object.fromEntries(BACKEND_METADATA.map((backend) => [backend.task_family, {
      implemented: backend.implemented,
      backend_ids: [backend.backend_id],
    }])),
    budget: {
      contract_id: "candidate-010-equal-budget-v1",
      validated: true,
      within_budget: true,
    },
  };
}

test("the complete 48-scenario matrix executes through four real isolated backends", async () => {
  const temporary = await mkdtemp(path.join(os.tmpdir(), "20w-c010-factorial-all-"));
  const outputDirectory = path.join(temporary, "run");
  const config = { ...smokeConfig, profile: "implementation-test", opportunities_per_seed: 1 };
  const scenarios = buildFactorialDesign();
  try {
    const result = await runFactorialExperiment({
      config,
      seeds: [919_191],
      scenarios,
      outputDirectory,
      executionMode: "implementation-test",
    });
    assert.equal(result.complete, true);
    assert.equal(result.run.scenario_count, 48);
    assert.equal(result.run.records, 48 * 7);
    assert.deepEqual(result.run.task_families, [
      "actuator-command",
      "filesystem-publish",
      "signed-publication",
      "transactional-kv",
    ]);
    assert.equal(result.run.claim_eligible, false);
    assert.equal(result.run.physical_actuation, false);
    assert.match(result.run.run_identity.source_bundle_sha256, /^[0-9a-f]{64}$/);
    assert.match(result.run.run_identity.source_commit, /^[0-9a-f]{40}$/);
    const frozenSource = JSON.parse(await readFile(
      path.join(outputDirectory, "provenance", "source-bundle.json"),
      "utf8",
    ));
    assert.equal(frozenSource.source_sha256, result.run.run_identity.source_bundle_sha256);

    const validation = await validateFactorialRun(outputDirectory);
    assert.equal(validation.valid, true);
    assert.equal(validation.records, 336);
    assert.equal(validation.assignments, 48);
    assert.equal(validation.claim_eligible, false);

    const summary = await analyzeFactorialRun(outputDirectory);
    assert.equal(summary.claim_eligible, false);
    assert.equal(summary.rows.length, 4 * 7);
    assert.ok(summary.rows.every((row) => row.irreversible_violations === 0));

    const records = await readFactorialRecords(outputDirectory);
    assert.equal(new Set(records.map((record) => record.filesystem.backend_id)).size, 4);
    assert.ok(records.every((record) => record.filesystem.physical_actuation === false));
    assert.ok(records.every((record) => (
      record.cluster_id === deriveFactorialRecordIdentities(record).cluster_id
    )));
    assert.equal(new Set(records.map((record) => record.work_unit_id)).size, records.length);
    assert.equal(new Set(records.map((record) => record.pair_id)).size, records.length / 7);
    assert.equal(new Set(records.map((record) => record.cluster_id)).size, 4);
    assert.ok(records.every((record) => (
      Date.parse(record.measurement_interval.ended_at)
      > Date.parse(record.measurement_interval.started_at)
    )));
    assert.ok(records.every((record) => record.resources.external_energy === null));
    const retryRecords = records.filter((record) => record.arm === "retry-rollback");
    assert.ok(retryRecords.every((record) => (
      record.comparator_lineage?.implementation_id === "candidate-010-two-lifecycle-retry-rollback-v1"
      && record.comparator_lineage.first_rollback_validated === true
      && record.comparator_lineage.attempts.length === 2
      && record.resources.policy_evaluations === 2
      && record.filesystem.staged_bytes_written
        === record.comparator_lineage.attempts.reduce((sum, attempt) => sum + attempt.staged_bytes_written, 0)
    )));
    const independentRecords = records.filter((record) => record.arm === "independent-verifier");
    assert.ok(independentRecords.every((record) => (
      record.comparator_lineage?.implementation_id === "candidate-010-independent-sha512-verifier-v1"
      && record.comparator_lineage.shared_trace_implementation === false
      && record.trace.revealed === false
      && record.trace.verifier === null
    )));
    const boundaryNames = await readdir(path.join(outputDirectory, "boundaries"));
    assert.ok(boundaryNames.every((name) => /^[0-9a-f]{64}$/.test(name)));
    assert.deepEqual(
      new Set(records.filter((record) => record.arm === "reset-coupled").map((record) => record.candidate_variant)),
      new Set([
        "verifier-coupled-finalization-v1",
        "verifier-observed-finalization-decoupled-v1",
        "verifier-withheld-coupling-unobservable-v1",
        "verifier-withheld-finalization-decoupled-v1",
      ]),
    );

    const confirmatory = analyzeConfirmatory({
      records,
      context: confirmationContext(),
    });
    assert.equal(confirmatory.decision, "abstain");
    assert.equal(confirmatory.eligible_for_superiority_claim, false);
    assert.ok(confirmatory.abstain_reasons.includes("not a frozen held-out confirmation release"));
  } finally {
    assert.ok(temporary.startsWith(os.tmpdir()));
    await rm(temporary, { recursive: true, force: true });
  }
});

test("factorial resume refuses mutations and reproduces stable decisions across all backends", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "20w-c010-factorial-resume-"));
  const interruptedDirectory = path.join(root, "interrupted");
  const uninterruptedDirectory = path.join(root, "uninterrupted");
  const config = { ...smokeConfig, profile: "implementation-test", opportunities_per_seed: 1 };
  const completeDesign = buildFactorialDesign();
  const scenarios = [
    "filesystem-publish",
    "transactional-kv",
    "signed-publication",
    "actuator-command",
  ].map((family) => completeDesign.find((scenario) => (
    scenario.task_family === family
    && scenario.factors.trace_revelation === "revealed"
    && scenario.factors.verifier_decision_coupling === "coupled"
  )));
  try {
    const interrupted = await runFactorialExperiment({
      config,
      seeds: [717_171],
      scenarios,
      outputDirectory: interruptedDirectory,
      executionMode: "implementation-test",
      stopAfterRecords: 9,
    });
    assert.equal(interrupted.complete, false);
    assert.equal(interrupted.run.records, 9);

    await assert.rejects(
      runFactorialExperiment({
        config: { ...config, threshold: config.threshold + 0.1 },
        seeds: [717_171],
        scenarios,
        outputDirectory: interruptedDirectory,
        executionMode: "implementation-test",
        resume: true,
      }),
      /Resume config differs/,
    );
    await assert.rejects(
      runFactorialExperiment({
        config,
        seeds: [717_172],
        scenarios,
        outputDirectory: interruptedDirectory,
        executionMode: "implementation-test",
        resume: true,
      }),
      /Resume seeds differ/,
    );

    const resumed = await runFactorialExperiment({
      config,
      seeds: [717_171],
      scenarios,
      outputDirectory: interruptedDirectory,
      executionMode: "implementation-test",
      resume: true,
    });
    const uninterrupted = await runFactorialExperiment({
      config,
      seeds: [717_171],
      scenarios,
      outputDirectory: uninterruptedDirectory,
      executionMode: "implementation-test",
    });
    assert.equal(resumed.run.records, 28);
    assert.equal(uninterrupted.run.records, 28);
    assert.equal((await validateFactorialRun(interruptedDirectory)).valid, true);
    assert.deepEqual(
      (await readFactorialRecords(interruptedDirectory)).map(stableProjection),
      (await readFactorialRecords(uninterruptedDirectory)).map(stableProjection),
    );
  } finally {
    assert.ok(root.startsWith(os.tmpdir()));
    await rm(root, { recursive: true, force: true });
  }
});

test("confirmation task families cannot run as development evidence", async () => {
  const output = path.join(os.tmpdir(), `20w-c010-forbidden-confirmation-${process.pid}-${Date.now()}`);
  await assert.rejects(
    runFactorialExperiment({
      config: { ...smokeConfig, profile: "development", opportunities_per_seed: 1 },
      seeds: [123],
      scenarios: buildFactorialDesign({ splits: ["confirmation"] }),
      outputDirectory: output,
      executionMode: "development",
    }),
    /fresh frozen seed release/,
  );
});

test("canonical task-family binding rejects split relabeling before execution", async () => {
  const output = path.join(os.tmpdir(), `20w-c010-mutated-split-${process.pid}-${Date.now()}`);
  const signed = buildFactorialDesign({ splits: ["confirmation"] })[0];
  const relabeled = {
    ...signed,
    id: "../../adversarial-scenario-id",
    split: "validation",
  };
  await assert.rejects(
    runFactorialExperiment({
      config: { ...smokeConfig, profile: "implementation-test", opportunities_per_seed: 1 },
      seeds: [808_081],
      scenarios: [relabeled],
      outputDirectory: output,
      executionMode: "implementation-test",
    }),
    /canonically bound/,
  );
  await assert.rejects(readdir(output), (error) => error?.code === "ENOENT");
});

test("validation rejects arm-asymmetric paired input against the frozen schedule", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "20w-c010-pair-hostile-"));
  const output = path.join(root, "run");
  const scenario = buildFactorialDesign({ splits: ["development"] })[0];
  try {
    await runFactorialExperiment({
      config: { ...smokeConfig, profile: "identity-test", opportunities_per_seed: 1 },
      seeds: [606_061],
      scenarios: [scenario],
      outputDirectory: output,
      executionMode: "development",
    });
    await rewriteLedger(output, (records) => {
      records[0].evidence = [...records[0].evidence];
      records[0].evidence[0] += 1;
      records[0].paired_input_sha256 = deriveFactorialRecordIdentities(records[0]).paired_input_sha256;
    });
    await assert.rejects(
      validateFactorialRun(output),
      /record is not in the frozen factorial schedule|paired input differs across arms/,
    );
  } finally {
    assert.ok(root.startsWith(os.tmpdir()));
    await rm(root, { recursive: true, force: true });
  }
});

test("ledger reopening rejects tampered stable IDs after record rehashing", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "20w-c010-id-hostile-"));
  const output = path.join(root, "run");
  const scenario = buildFactorialDesign({ splits: ["development"] })[0];
  try {
    await runFactorialExperiment({
      config: { ...smokeConfig, profile: "identity-test", opportunities_per_seed: 1 },
      seeds: [707_071],
      scenarios: [scenario],
      outputDirectory: output,
      executionMode: "development",
    });
    await rewriteLedger(output, (records) => {
      records[0].pair_id = `c010-pair-${"0".repeat(64)}`;
    });
    await assert.rejects(validateFactorialRun(output), /pair_id identity mismatch/);
  } finally {
    assert.ok(root.startsWith(os.tmpdir()));
    await rm(root, { recursive: true, force: true });
  }
});

test("frozen arm ordering counterbalances every arm across opportunity positions", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "20w-c010-arm-order-"));
  const output = path.join(root, "run");
  const scenario = buildFactorialDesign({ splits: ["development"] })[0];
  try {
    await runFactorialExperiment({
      config: { ...smokeConfig, profile: "arm-order-test", opportunities_per_seed: 7 },
      seeds: [909_091],
      scenarios: [scenario],
      outputDirectory: output,
      executionMode: "development",
    });
    const records = await readFactorialRecords(output);
    for (const arm of scenario.eligible_arms) {
      assert.deepEqual(
        new Set(records.filter((record) => record.arm === arm).map((record) => record.arm_order_index)),
        new Set([0, 1, 2, 3, 4, 5, 6]),
      );
    }
    const byPair = new Map();
    for (const record of records) {
      const rows = byPair.get(record.pair_id) ?? [];
      rows.push(record);
      byPair.set(record.pair_id, rows);
    }
    assert.equal(byPair.size, 7);
    assert.ok([...byPair.values()].every((rows) => (
      new Set(rows.map((record) => record.arm_order_schedule_id)).size === 1
      && new Set(rows.map((record) => record.arm_order_index)).size === 7
    )));
  } finally {
    assert.ok(root.startsWith(os.tmpdir()));
    await rm(root, { recursive: true, force: true });
  }
});

test("validation rejects a nonpositive record-owned measurement interval", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "20w-c010-interval-hostile-"));
  const output = path.join(root, "run");
  const scenario = buildFactorialDesign({ splits: ["development"] })[0];
  try {
    await runFactorialExperiment({
      config: { ...smokeConfig, profile: "interval-test", opportunities_per_seed: 1 },
      seeds: [505_051],
      scenarios: [scenario],
      outputDirectory: output,
      executionMode: "development",
    });
    await rewriteLedger(output, (records) => {
      records[0].measurement_interval.ended_at = records[0].measurement_interval.started_at;
    });
    await assert.rejects(validateFactorialRun(output), /measurement interval is not strictly positive/);
  } finally {
    assert.ok(root.startsWith(os.tmpdir()));
    await rm(root, { recursive: true, force: true });
  }
});

test("confirmation seeds and authority come only from an opened frozen release", async () => {
  const config = { ...smokeConfig, profile: "confirmation-fixture", opportunities_per_seed: 1 };
  const scenarios = [buildFactorialDesign({ splits: ["confirmation"] })[0]];
  const fixture = await confirmationReleaseFixture({ config, scenarios });
  const output = path.join(fixture.root, "confirmation-run");
  try {
    const interrupted = await runFactorialExperiment({
      config,
      scenarios,
      outputDirectory: output,
      executionMode: "confirmation",
      release: fixture.release,
      stopAfterRecords: 5,
    });
    assert.equal(interrupted.complete, false);
    const resumed = await runFactorialExperiment({
      config,
      scenarios,
      outputDirectory: output,
      executionMode: "confirmation",
      release: fixture.release,
      resume: true,
    });
    assert.equal(resumed.complete, true);
    assert.equal(resumed.run.run_identity.frozen_release.release_sha256, fixture.contract.release_sha256);
    assert.equal(resumed.run.run_identity.frozen_release.seed_commitment, fixture.commitment);
    assert.equal(resumed.run.run_identity.frozen_release.partition, "confirmation");
    assert.match(resumed.run.run_identity.run_id, /^c010-run-[0-9a-f]{64}$/);
    assert.equal((await validateFactorialRun(output)).valid, true);
  } finally {
    assert.ok(fixture.root.startsWith(os.tmpdir()));
    await rm(fixture.root, { recursive: true, force: true });
  }
});

test("confirmation rejects raw seeds and caller-authored frozen flags", async () => {
  const config = { ...smokeConfig, profile: "confirmation-hostile", opportunities_per_seed: 1 };
  const scenarios = [buildFactorialDesign({ splits: ["confirmation"] })[0]];
  await assert.rejects(
    runFactorialExperiment({
      config,
      seeds: [123],
      scenarios,
      outputDirectory: path.join(os.tmpdir(), `20w-c010-raw-confirmation-${Date.now()}`),
      executionMode: "confirmation",
    }),
    /refuses raw caller-provided seeds/,
  );
  await assert.rejects(
    runFactorialExperiment({
      config,
      scenarios,
      outputDirectory: path.join(os.tmpdir(), `20w-c010-flag-confirmation-${Date.now()}`),
      executionMode: "confirmation",
      frozen_release: true,
    }),
    /flags have no authority/,
  );
});

test("confirmation rejects wrong partition and source authority", async () => {
  const config = { ...smokeConfig, profile: "confirmation-hostile", opportunities_per_seed: 1 };
  const scenarios = [buildFactorialDesign({ splits: ["confirmation"] })[0]];
  const wrongPartition = await confirmationReleaseFixture({
    config,
    scenarios,
    partition: "held-out",
  });
  const wrongSource = await confirmationReleaseFixture({ config, scenarios, mutateSource: true });
  try {
    await assert.rejects(
      runFactorialExperiment({
        config,
        scenarios,
        outputDirectory: path.join(wrongPartition.root, "run"),
        executionMode: "confirmation",
        release: wrongPartition.release,
      }),
      /exact partition and phase held-out/,
    );
    await assert.rejects(
      runFactorialExperiment({
        config,
        scenarios,
        outputDirectory: path.join(wrongSource.root, "run"),
        executionMode: "confirmation",
        release: wrongSource.release,
      }),
      /source authority does not match/,
    );
  } finally {
    await rm(wrongPartition.root, { recursive: true, force: true });
    await rm(wrongSource.root, { recursive: true, force: true });
  }
});

test("confirmation rejects config and design substitution after release opening", async () => {
  const config = { ...smokeConfig, profile: "confirmation-hostile", opportunities_per_seed: 1 };
  const scenarios = [buildFactorialDesign({ splits: ["confirmation"] })[0]];
  const fixture = await confirmationReleaseFixture({ config, scenarios });
  try {
    await assert.rejects(
      runFactorialExperiment({
        config: { ...config, threshold: config.threshold + 1 },
        scenarios,
        outputDirectory: path.join(fixture.root, "config-substitution"),
        executionMode: "confirmation",
        release: fixture.release,
      }),
      /config binding does not match/,
    );
    await assert.rejects(
      runFactorialExperiment({
        config,
        scenarios: [{ ...scenarios[0], id: `${scenarios[0].id}-substituted` }],
        outputDirectory: path.join(fixture.root, "design-substitution"),
        executionMode: "confirmation",
        release: fixture.release,
      }),
      /design binding does not match/,
    );
  } finally {
    await rm(fixture.root, { recursive: true, force: true });
  }
});
