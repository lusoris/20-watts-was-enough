import assert from "node:assert/strict";
import { mkdir, mkdtemp, readFile, rm, symlink, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { validateExecutionManifest } from "../../scripts/lib/workstation-manifests.mjs";

const root = process.cwd();
const realManifest = path.join(root, "experiments", "workstation", "manifests", "candidate-010.json");
const fixture007Manifest = path.join(
  root,
  "experiments",
  "workstation",
  "manifests",
  "fixture-007.json",
);

async function runtimeBindingFixture({
  runtime = {},
  moduleBody = [
    'export const TEST_CONTRACT_VERSION = "test-runtime-contract-v1";',
    "export function assertTestRuntimeRecord() { return true; }",
    "",
  ].join("\n"),
  registerTest = true,
  includeRuntime = true,
  schemaViaJunction = false,
} = {}) {
  const temporary = await mkdtemp(path.join(root, "tmp-runtime-binding-"));
  const storageDirectory = schemaViaJunction ? path.join(temporary, "actual") : temporary;
  const junction = schemaViaJunction ? path.join(temporary, "linked") : null;
  if (schemaViaJunction) {
    await mkdir(storageDirectory);
    await symlink(storageDirectory, junction, "junction");
  }
  const exposedDirectory = junction ?? storageDirectory;
  const relativeDirectory = path.relative(root, exposedDirectory).replaceAll("\\", "/");
  const modulePath = path.join(storageDirectory, "runtime-contract.mjs");
  const testPath = path.join(storageDirectory, "runtime-contract.test.mjs");
  const schemaPath = path.join(storageDirectory, "output.schema.json");
  const manifestPath = path.join(temporary, "manifest.json");
  const manifest = JSON.parse(await readFile(realManifest, "utf8"));
  const metadata = {
    module: "runtime-contract.mjs",
    export: "assertTestRuntimeRecord",
    version_export: "TEST_CONTRACT_VERSION",
    contract_version: "test-runtime-contract-v1",
    test: "runtime-contract.test.mjs",
    ...runtime,
  };
  const schema = {
    $schema: "https://json-schema.org/draft/2020-12/schema",
    type: "object",
    ...(includeRuntime ? { "x-runtime-validator": metadata } : {}),
  };
  manifest.outputs.schema = `${relativeDirectory}/output.schema.json`;
  if (registerTest) {
    manifest.implementation.tests = [
      ...manifest.implementation.tests,
      `${relativeDirectory}/runtime-contract.test.mjs`,
    ];
  }
  await writeFile(modulePath, moduleBody);
  await writeFile(testPath, "// registered hostile-test fixture\n");
  await writeFile(schemaPath, JSON.stringify(schema));
  await writeFile(manifestPath, JSON.stringify(manifest));
  return {
    temporary,
    junction,
    result: await validateExecutionManifest(root, manifestPath, "candidate-010"),
  };
}

async function removeRuntimeBindingFixture(fixture) {
  if (fixture.junction) await unlink(fixture.junction);
  await rm(fixture.temporary, { recursive: true, force: true });
}

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

test("fixture execution scope resolves the canonical F-prefixed ledger label", async () => {
  const result = await validateExecutionManifest(root, fixture007Manifest, "fixture-007");
  assert.equal(result.readiness, "smoke-ready");
  assert.equal(result.ready, false);
  assert.deepEqual(result.errors, []);
  assert.deepEqual(result.executionClaims, ["C-970", "C-972"]);
  assert.equal(
    result.promotionChecks.find((check) => check.id === "execution-claim-scope").passed,
    true,
  );
});

test("six truthy placeholder fields cannot pass the execution gate", async () => {
  const temporary = await mkdtemp(path.join(root, "tmp-20w-manifest-"));
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
    assert.ok(temporary.startsWith(root));
    await rm(temporary, { recursive: true, force: true });
  }
});

test("changing only the readiness label still fails the full gate", async () => {
  const source = JSON.parse(await readFile(realManifest, "utf8"));
  source.readiness = "workstation-ready";
  const temporary = await mkdtemp(path.join(root, "tmp-20w-manifest-full-"));
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
    assert.ok(temporary.startsWith(root));
    await rm(temporary, { recursive: true, force: true });
  }
});

test("the canonical Candidate 010 registry must exactly match its committed execution projection", async () => {
  const temporary = await mkdtemp(path.join(root, "tmp-c010-execution-projection-"));
  const manifestPath = path.join(
    temporary,
    "experiments",
    "workstation",
    "manifests",
    "candidate-010.json",
  );
  const projectionPath = path.join(
    temporary,
    "experiments",
    "workstation",
    "candidate-010",
    "execution-manifest.json",
  );
  try {
    await mkdir(path.dirname(manifestPath), { recursive: true });
    await mkdir(path.dirname(projectionPath), { recursive: true });
    await mkdir(path.join(temporary, "research"), { recursive: true });
    await writeFile(path.join(temporary, "research", "claims.md"), "### C-170\n[Candidate 010]\n");
    await writeFile(manifestPath, await readFile(realManifest));
    const projection = JSON.parse(await readFile(
      path.join(root, "experiments", "workstation", "candidate-010", "execution-manifest.json"),
      "utf8",
    ));
    projection.execution_contract.command.run = "node substituted-runner.mjs";
    await writeFile(projectionPath, JSON.stringify(projection));
    const result = await validateExecutionManifest(temporary, manifestPath, "candidate-010");
    assert.ok(result.errors.some((error) => /does not exactly match the immutable projection/.test(error)));
  } finally {
    await rm(temporary, { recursive: true, force: true });
  }
});

test("fake manifest hashes and a favorable summary JSON cannot replace strict evidence", async () => {
  const source = JSON.parse(await readFile(realManifest, "utf8"));
  source.readiness = "workstation-ready";
  const temporary = await mkdtemp(path.join(root, "tmp-c010-manifest-evidence-"));
  const relative = path.relative(root, temporary).replaceAll("\\", "/");
    const evidencePath = path.join(temporary, "evidence.json");
    const receiptPath = path.join(temporary, "promotion-validation-receipt.json");
    const releaseRoot = path.join(temporary, "release");
    const releasePath = path.join(releaseRoot, "release.json");
    const runDirectory = path.join(temporary, "run");
    const energyPath = path.join(runDirectory, "energy.json");
    const disjointPath = path.join(releaseRoot, "held-out.json");
  const manifestPath = path.join(temporary, "candidate-010.json");
  try {
    await mkdir(runDirectory, { recursive: true });
    await mkdir(releaseRoot, { recursive: true });
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
    await writeFile(receiptPath, JSON.stringify({
      contract_version: "candidate-010.capsule-launch-receipt.v1",
      status: "verified",
      receipt_sha256: "f".repeat(64),
    }));
    await writeFile(releasePath, "{}\n");
    await writeFile(energyPath, JSON.stringify({ schema: 1, valid: true }));
    await writeFile(disjointPath, JSON.stringify({ partition: "held-out", seeds: [999] }));
    source.promotion_evidence = {
      status: "present",
      evidence_path: `${relative}/evidence.json`,
      promotion_validation_receipt_path: `${relative}/promotion-validation-receipt.json`,
      run_directory: `${relative}/run`,
      release_root: `${relative}/release`,
      release_path: `${relative}/release/release.json`,
      energy_assignments_path: `${relative}/run/energy.json`,
      disjoint_seed_pack_paths: [`${relative}/release/held-out.json`],
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

test("output schema is bound to an importable versioned runtime validator and registered test", async () => {
  const fixture = await runtimeBindingFixture();
  try {
    assert.equal(fixture.result.readiness, "smoke-ready");
    assert.deepEqual(fixture.result.errors, []);
  } finally {
    await removeRuntimeBindingFixture(fixture);
  }
});

test("manifest and runtime-schema paths refuse symbolic-link or reparse-point traversal", async () => {
  const fixture = await runtimeBindingFixture({ schemaViaJunction: true });
  try {
    assert.equal(fixture.result.ready, false);
    assert.ok(fixture.result.errors.some((error) => /symbolic-link|reparse-point/.test(error)));
  } finally {
    await removeRuntimeBindingFixture(fixture);
  }
});

test("runtime binding rejects declarative placeholders, wrong exports, versions, tests, and paths", async () => {
  const cases = [
    {
      options: { includeRuntime: false },
      pattern: /must declare an x-runtime-validator object/,
    },
    {
      options: { runtime: { export: "missingValidator" } },
      pattern: /export missingValidator is not a function/,
    },
    {
      options: {
        runtime: { export: "declarativePlaceholder" },
        moduleBody: [
          'export const TEST_CONTRACT_VERSION = "test-runtime-contract-v1";',
          "export const declarativePlaceholder = true;",
          "",
        ].join("\n"),
      },
      pattern: /export declarativePlaceholder is not a function/,
    },
    {
      options: { runtime: { version_export: "MISSING_CONTRACT_VERSION" } },
      pattern: /version export MISSING_CONTRACT_VERSION is not a string/,
    },
    {
      options: { runtime: { contract_version: "test-runtime-contract-v2" } },
      pattern: /version does not match contract_version/,
    },
    {
      options: { runtime: { contract_version: "TODO-placeholder" } },
      pattern: /must be a concrete version identifier/,
    },
    {
      options: { registerTest: false },
      pattern: /test must be registered in implementation.tests/,
    },
    {
      options: { runtime: { module: "../../../../outside-runtime.mjs" } },
      pattern: /module escapes the repository/,
    },
    {
      options: { runtime: { test: "../../../../outside-runtime.test.mjs" } },
      pattern: /test escapes the repository/,
    },
    {
      options: { runtime: { module: "output.schema.json" } },
      pattern: /module must be a schema-relative \.mjs repository path/,
    },
  ];
  for (const { options, pattern } of cases) {
    const fixture = await runtimeBindingFixture(options);
    try {
      assert.equal(fixture.result.ready, false);
      assert.ok(
        fixture.result.errors.some((error) => pattern.test(error)),
        `${pattern} not found in ${JSON.stringify(fixture.result.errors)}`,
      );
    } finally {
      await removeRuntimeBindingFixture(fixture);
    }
  }
});
