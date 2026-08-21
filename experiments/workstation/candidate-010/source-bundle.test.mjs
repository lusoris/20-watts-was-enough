import assert from "node:assert/strict";
import {
  mkdir,
  mkdtemp,
  readFile,
  rename,
  rm,
  symlink,
  unlink,
  writeFile,
} from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import {
  CANDIDATE_010_SOURCE_FILES,
  CANDIDATE_010_TEST_SUPPORT_FILES,
  captureCandidate010SourceBundle,
  computeSourceBundle,
  discoverCandidate010SourceFiles,
} from "./source-bundle.mjs";

async function unlinkIfPresent(file) {
  try {
    await unlink(file);
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
}

test("Candidate 010 source identity covers every executable layer and is deterministic", async () => {
  const coverage = await discoverCandidate010SourceFiles();
  const first = await captureCandidate010SourceBundle();
  const second = await captureCandidate010SourceBundle();
  assert.deepEqual(first, second);
  assert.match(first.source_sha256, /^[0-9a-f]{64}$/);
  assert.match(first.vcs.source_commit, /^[0-9a-f]{40}$/);
  assert.deepEqual(
    first.files.map((entry) => entry.path),
    coverage.source_files,
  );
  assert.ok(CANDIDATE_010_SOURCE_FILES.every((file) => coverage.source_files.includes(file)));
  assert.ok(coverage.production_modules.every((file) => coverage.source_files.includes(file)));
  assert.ok(coverage.registered_tests.every((file) => coverage.source_files.includes(file)));
  assert.ok(CANDIDATE_010_TEST_SUPPORT_FILES.every((file) => coverage.source_files.includes(file)));
  for (const policyInput of [
    "package.json",
    "package-lock.json",
    "research/claims.md",
    "scripts/lib/workstation-manifests.mjs",
    "scripts/validate-workstation.mjs",
    "experiments/workstation/manifest.schema.json",
  ]) {
    assert.ok(coverage.source_files.includes(policyInput), `${policyInput} is absent from source identity`);
  }
  assert.equal(coverage.manifest_file, "experiments/workstation/manifests/candidate-010.json");
  assert.ok(coverage.source_files.includes(coverage.manifest_file));
  assert.ok(coverage.import_closure.length > 0);
  assert.ok(coverage.import_closure.every((edge) => (
    (coverage.production_modules.includes(edge.importer) || coverage.registered_tests.includes(edge.importer))
    && coverage.source_files.includes(edge.imported)
  )));
  assert.ok(coverage.import_closure.some((edge) => (
    edge.importer === "scripts/validate-workstation.mjs"
    && edge.imported === "scripts/lib/workstation-manifests.mjs"
  )));
  assert.ok(coverage.import_closure.some((edge) => (
    edge.importer === "scripts/lib/workstation-manifests.mjs"
    && edge.imported === "experiments/workstation/candidate-010/promotion-evidence.mjs"
  )));
  assert.ok(coverage.exclusions.every((entry) => entry.path && entry.reason));

  const manifest = JSON.parse(await readFile("experiments/workstation/manifests/candidate-010.json", "utf8"));
  assert.deepEqual(coverage.registered_tests, [...manifest.implementation.tests].sort());
});

test("one source byte changes the bundle and escaping or duplicate paths are refused", async () => {
  const temporary = await mkdtemp(path.join(os.tmpdir(), "20w-c010-source-bundle-"));
  try {
    await writeFile(path.join(temporary, "a.mjs"), "export const value = 1;\n");
    await writeFile(path.join(temporary, "b.mjs"), "export const value = 2;\n");
    const first = await computeSourceBundle({ root: temporary, sourceFiles: ["a.mjs", "b.mjs"] });
    await writeFile(path.join(temporary, "b.mjs"), "export const value = 3;\n");
    const second = await computeSourceBundle({ root: temporary, sourceFiles: ["a.mjs", "b.mjs"] });
    assert.notEqual(first.source_sha256, second.source_sha256);
    await assert.rejects(
      computeSourceBundle({ root: temporary, sourceFiles: ["../outside.mjs"] }),
      /stay relative/,
    );
    await assert.rejects(
      computeSourceBundle({ root: temporary, sourceFiles: ["a.mjs", "a.mjs"] }),
      /unique/,
    );
  } finally {
    assert.ok(temporary.startsWith(os.tmpdir()));
    await rm(temporary, { recursive: true, force: true });
  }
});

async function temporaryCoverageFixture() {
  const temporary = await mkdtemp(path.join(os.tmpdir(), "20w-c010-discovery-"));
  const candidateDirectory = "experiments/workstation/candidate-010";
  const candidateRoot = path.join(temporary, ...candidateDirectory.split("/"));
  const manifestFile = "experiments/workstation/manifests/candidate-010.json";
  const manifestPath = path.join(temporary, ...manifestFile.split("/"));
  await mkdir(candidateRoot, { recursive: true });
  await mkdir(path.dirname(manifestPath), { recursive: true });
  const entry = `${candidateDirectory}/entry.mjs`;
  const helper = `${candidateDirectory}/helper.mjs`;
  const testFile = `${candidateDirectory}/helper.test.mjs`;
  await writeFile(path.join(candidateRoot, "entry.mjs"), 'import { helper } from "./helper.mjs";\nexport const value = helper;\n');
  await writeFile(path.join(candidateRoot, "helper.mjs"), "export const helper = 1;\n");
  await writeFile(path.join(candidateRoot, "helper.test.mjs"), 'import "./helper.mjs";\n');
  await writeFile(path.join(candidateRoot, "README.md"), "fixture documentation\n");
  await writeFile(manifestPath, `${JSON.stringify({ implementation: { tests: [testFile] } }, null, 2)}\n`);
  return {
    temporary,
    candidateRoot,
    manifestPath,
    options: {
      root: temporary,
      candidateDirectory,
      manifestFile,
      productionFiles: [entry, helper],
      testSupportFiles: [],
      exclusions: [{ path: "README.md", reason: "fixture documentation" }],
    },
  };
}

test("discovery rejects an unlisted production module and an unregistered test", async () => {
  const fixture = await temporaryCoverageFixture();
  try {
    const initial = await discoverCandidate010SourceFiles(fixture.options);
    assert.equal(initial.production_modules.length, 2);
    assert.equal(initial.registered_tests.length, 1);

    const unlistedProduction = path.join(fixture.candidateRoot, "unlisted.mjs");
    await writeFile(unlistedProduction, "export const unlisted = true;\n");
    await assert.rejects(
      discoverCandidate010SourceFiles(fixture.options),
      /production module coverage mismatch.*unlisted\.mjs/,
    );
    await rm(unlistedProduction);

    const unregisteredTest = path.join(fixture.candidateRoot, "unregistered.test.mjs");
    await writeFile(unregisteredTest, 'import "./helper.mjs";\n');
    await assert.rejects(
      discoverCandidate010SourceFiles(fixture.options),
      /test coverage mismatch.*unregistered\.test\.mjs/,
    );
  } finally {
    await rm(fixture.temporary, { recursive: true, force: true });
  }
});

test("discovery enforces production and registered-test import closure and classifies every candidate file", async () => {
  const fixture = await temporaryCoverageFixture();
  try {
    const outside = path.join(fixture.temporary, "experiments", "workstation", "outside.mjs");
    await writeFile(outside, "export const outside = true;\n");
    await writeFile(
      path.join(fixture.candidateRoot, "entry.mjs"),
      'import "./helper.mjs";\nimport "../outside.mjs";\n',
    );
    await assert.rejects(
      discoverCandidate010SourceFiles(fixture.options),
      /outside the frozen source closure.*outside\.mjs/,
    );

    await writeFile(path.join(fixture.candidateRoot, "entry.mjs"), 'import "./helper.mjs";\n');
    await writeFile(
      path.join(fixture.candidateRoot, "helper.test.mjs"),
      'import "../../../outside-test-helper.mjs";\n',
    );
    await writeFile(path.join(fixture.temporary, "outside-test-helper.mjs"), "export const outside = true;\n");
    await assert.rejects(
      discoverCandidate010SourceFiles(fixture.options),
      /outside the frozen source closure.*outside-test-helper\.mjs/,
    );

    await writeFile(path.join(fixture.candidateRoot, "helper.test.mjs"), 'import "./helper.mjs";\n');
    await writeFile(path.join(fixture.candidateRoot, "unclassified.json"), "{}\n");
    await assert.rejects(
      discoverCandidate010SourceFiles(fixture.options),
      /unclassified files.*unclassified\.json/,
    );
  } finally {
    await rm(fixture.temporary, { recursive: true, force: true });
  }
});

test("registered test and execution-manifest bytes participate in the complete source hash", async () => {
  const fixture = await temporaryCoverageFixture();
  try {
    const coverage = await discoverCandidate010SourceFiles(fixture.options);
    const first = await computeSourceBundle({ root: fixture.temporary, sourceFiles: coverage.source_files });
    await writeFile(path.join(fixture.candidateRoot, "helper.test.mjs"), 'import "./helper.mjs";\n// changed\n');
    const secondCoverage = await discoverCandidate010SourceFiles(fixture.options);
    const second = await computeSourceBundle({ root: fixture.temporary, sourceFiles: secondCoverage.source_files });
    assert.notEqual(first.source_sha256, second.source_sha256);

    await writeFile(
      fixture.manifestPath,
      `${JSON.stringify({ implementation: { tests: [`${fixture.options.candidateDirectory}/helper.test.mjs`] }, note: "changed" }, null, 2)}\n`,
    );
    const thirdCoverage = await discoverCandidate010SourceFiles(fixture.options);
    const third = await computeSourceBundle({ root: fixture.temporary, sourceFiles: thirdCoverage.source_files });
    assert.notEqual(second.source_sha256, third.source_sha256);
  } finally {
    await rm(fixture.temporary, { recursive: true, force: true });
  }
});

test("dirty workstation-policy bytes change the frozen source identity", async () => {
  const temporary = await mkdtemp(path.join(os.tmpdir(), "20w-c010-policy-source-"));
  const relative = "scripts/lib/workstation-manifests.mjs";
  const policyPath = path.join(temporary, ...relative.split("/"));
  try {
    await mkdir(path.dirname(policyPath), { recursive: true });
    const original = await readFile(relative, "utf8");
    await writeFile(policyPath, original);
    const first = await computeSourceBundle({ root: temporary, sourceFiles: [relative] });
    await writeFile(policyPath, `${original}\n// dirty policy byte\n`);
    const second = await computeSourceBundle({ root: temporary, sourceFiles: [relative] });
    assert.notEqual(first.source_sha256, second.source_sha256);
    assert.notEqual(first.files[0].sha256, second.files[0].sha256);
  } finally {
    await rm(temporary, { recursive: true, force: true });
  }
});

test("source discovery and hashing refuse junction or symbolic-link traversal", async () => {
  const fixture = await temporaryCoverageFixture();
  const actualCandidateRoot = `${fixture.candidateRoot}-actual`;
  const linkedDirectory = path.join(fixture.temporary, "linked-policy");
  try {
    await rename(fixture.candidateRoot, actualCandidateRoot);
    await symlink(actualCandidateRoot, fixture.candidateRoot, "junction");
    await assert.rejects(
      discoverCandidate010SourceFiles(fixture.options),
      /symbolic-link|reparse-point/,
    );
    await unlink(fixture.candidateRoot);

    const actualDirectory = path.join(fixture.temporary, "actual-policy");
    await mkdir(actualDirectory);
    await writeFile(path.join(actualDirectory, "policy.mjs"), "export const policy = true;\n");
    await symlink(actualDirectory, linkedDirectory, "junction");
    await assert.rejects(
      computeSourceBundle({
        root: fixture.temporary,
        sourceFiles: ["linked-policy/policy.mjs"],
      }),
      /symbolic-link|reparse-point/,
    );
    await unlink(linkedDirectory);
  } finally {
    await unlinkIfPresent(fixture.candidateRoot);
    await unlinkIfPresent(linkedDirectory);
    await rm(fixture.temporary, { recursive: true, force: true });
  }
});
