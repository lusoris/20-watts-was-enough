import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";

import { parse } from "yaml";

import {
  validateOperationalFilePaths,
  validatePortableWorkflowObject,
} from "./lib/portable-operations.mjs";

import {
  formatFindings,
  validateCiExperimentImageWorkflowObject,
  validateCiFuzzingWorkflowObject,
  validateCiImpactWorkflowObject,
  validateCurrentResearchDisclosure,
  validateExperimentReportIdentity,
  validateExperimentRunFailureForm,
  validateFundingConfig,
  validateGoCodeQlWorkflowObject,
  validateGoRuntimeWorkflowObject,
  validateIssueConfig,
  validateIssueForm,
  validateJavaScriptRuntimeWorkflowObject,
  validateRepositoryMetadataSyncWorkflowObject,
  validateNpmRuntimeLock,
  validateReleaseExperimentImageWorkflowObject,
  validateReleaseWorkflowObject,
  validateRetiredHostingPaths,
  validateRepositoryPolicy,
  validateScientificRuntimeLock,
  validateScientificRuntimeWorkflowObject,
  validateToolingValidationScript,
  validateWorkstationShardScriptsObject,
  validateWorkflowObject,
} from "./validate-engineering-policy.mjs";

const workflow = (name) => parse(readFileSync(new URL(`../.github/workflows/${name}.yml`, import.meta.url), "utf8"));

function policyDisclosure(version) {
  return [
    `# Research-output disclosure — v${version}`,
    "",
    `- **Output:** repository snapshot \`v${version}\``,
    "- **Record date:** 2026-08-05",
    "- **Authority:** policy-test release boundary",
    "",
    "## Contributors and responsibility",
    "",
    "The maintainer is accountable.",
    "",
    "## Funding and material support",
    "",
    "No funding is declared.",
    "",
    "## Competing interests",
    "",
    "No separate declaration is supplied.",
    "",
    "## Material AI, automation and external services",
    "",
    "The policy validator is the material automated tool.",
    "",
    "## Pre-release evidence and publication conditions",
    "",
    "The policy checks must pass before publication.",
    "",
  ].join("\n");
}

function ciImageStep(subject, name) {
  return subject.jobs["container-smoke"].steps.find((step) => step.name === name);
}

function releaseImageStep(subject, id) {
  return subject.jobs.release.steps.find((step) => step.id === id);
}

function releaseImageStepByName(subject, name) {
  return subject.jobs.release.steps.find((step) => step.name === name);
}

function assertWorkflowTamper(name, validator, mutate, expected) {
  const subject = structuredClone(workflow(name));
  mutate(subject);
  const findings = validator(subject);
  assert.ok(
    findings.includes(expected),
    `expected ${JSON.stringify(expected)} in ${JSON.stringify(findings)}`,
  );
}

function disableExitAfterDiagnostic(step, diagnostic) {
  const lines = step.run.split("\n");
  const diagnosticIndex = lines.findIndex((line) => line.includes(diagnostic));
  assert.notEqual(diagnosticIndex, -1, `missing diagnostic ${diagnostic}`);
  const exitIndex = lines.findIndex((line, index) => (
    index > diagnosticIndex && line.trim() !== ""
  ));
  assert.equal(lines[exitIndex]?.trim(), "exit 1", `diagnostic ${diagnostic} is not followed by exit 1`);
  lines[exitIndex] = lines[exitIndex].replace("exit 1", ":");
  step.run = lines.join("\n");
}

function runCiSuccessGate(source, overrides = {}) {
  const environment = {
    EVENT_NAME: "push",
    MODE: "full",
    SELECT_CONTAINER: "false",
    SELECT_GO: "false",
    SELECT_RELEASE: "false",
    SELECT_RESEARCH: "false",
    SELECT_SITE: "false",
    SELECT_WORKSTATION: "true",
    RESULT_PLAN: "success",
    RESULT_PR_TITLE: "skipped",
    RESULT_QUALITY_FULL: "success",
    RESULT_IMPACT_COMMON: "skipped",
    RESULT_GO: "skipped",
    RESULT_RELEASE: "skipped",
    RESULT_RESEARCH: "skipped",
    RESULT_SITE: "skipped",
    RESULT_WORKSTATION_CORE: "success",
    RESULT_WORKSTATION_ARTIFACTS: "success",
    RESULT_CONTAINER: "success",
    RESULT_DEPENDENCY_REVIEW: "skipped",
    ...overrides,
  };
  return spawnSync("/bin/bash", ["-c", source], { encoding: "utf8", env: environment });
}

test("the repository satisfies its engineering policy", () => {
  assert.deepEqual(validateRepositoryPolicy(), []);
});

test("tooling validation runs all three offline authorities in order", () => {
  const experiment = "go -C tooling run ./cmd/20w experiment validate --root ..";
  const metadata = "go -C tooling run ./cmd/20w github sync-metadata --root .. --check";
  const publication = "go -C tooling run ./cmd/20w publication render-pdf --root .. --check";
  const expectedFinding = "package.json: validate:tooling must validate experiment, GitHub metadata, and publication-render authority offline in that order";
  assert.deepEqual(validateToolingValidationScript(`${experiment} && ${metadata} && ${publication}`), []);
  for (const command of [
    `${metadata} && ${experiment} && ${publication}`,
    `${experiment} && ${metadata}`,
    `${experiment} && ${metadata} && curl https://example.test && ${publication}`,
  ]) {
    assert.deepEqual(validateToolingValidationScript(command), [expectedFinding]);
  }
});

test("workstation shard scripts retain their exact disjoint inventories", () => {
  const manifest = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8"));
  const workstationManifests = Object.fromEntries(["026", "029"].map((fixture) => [
    fixture,
    JSON.parse(readFileSync(
      new URL(`../experiments/workstation/manifests/fixture-${fixture}.json`, import.meta.url),
      "utf8",
    )),
  ]));
  const validate = (subject, inventories = workstationManifests) => (
    validateWorkstationShardScriptsObject(subject, inventories)
  );
  assert.deepEqual(validate(manifest), []);

  const missingHeavyTest = structuredClone(manifest);
  missingHeavyTest.scripts["test:workstation:fixture-026:shard-1"] =
    "node --test experiments/workstation/fixture-026/rsd-t02-runner.test.mjs";
  assert.ok(validate(missingHeavyTest).includes(
    "package.json: test:workstation:fixture-026:shard-1 must retain its exact bounded test inventory",
  ));

  const extraShard = structuredClone(manifest);
  extraShard.scripts["test:workstation:fixture-029:shard-3"] =
    extraShard.scripts["test:workstation:fixture-029:shard-2"];
  assert.ok(validate(extraShard).includes(
    "package.json: workstation shard script identities must be exactly the eight allowlisted names",
  ));

  const serialFullGate = structuredClone(manifest);
  serialFullGate.scripts["check:full-without-workstation"] += " && npm run test:workstation";
  assert.ok(validate(serialFullGate).includes(
    "package.json: check:full-without-workstation must retain the complete non-workstation aggregate gate",
  ));

  const weakenedLocalGate = structuredClone(manifest);
  weakenedLocalGate.scripts.test = weakenedLocalGate.scripts.test.replace(
    "npm run validate:workstation && npm run test:workstation",
    "echo 'npm run validate:workstation && npm run test:workstation'",
  );
  assert.ok(validate(weakenedLocalGate).includes(
    "package.json: the local aggregate gate must retain the complete workstation suite",
  ));

  const unshardedRegisteredTest = structuredClone(workstationManifests);
  const unshardedPath = "experiments/workstation/fixture-026/future-contract.test.mjs";
  unshardedRegisteredTest["026"].implementation.tests.push(unshardedPath);
  unshardedRegisteredTest["026"].implementation.full_tests.push(unshardedPath);
  assert.ok(validate(manifest, unshardedRegisteredTest).includes(
    "package.json: Fixture 026 tests and full_tests must match and every registered test must appear in exactly one shard",
  ));
});

test("the current package version requires a matching, structured research disclosure", (t) => {
  const root = mkdtempSync(path.join(tmpdir(), "current-disclosure-policy-"));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const version = "0.1.0";
  const relativePath = `research/disclosures/v${version}.md`;
  const disclosurePath = path.join(root, relativePath);
  writeFileSync(path.join(root, "package.json"), `${JSON.stringify({ version })}\n`);

  assert.deepEqual(validateCurrentResearchDisclosure(root), [
    `${relativePath}: current-version research disclosure is missing`,
  ]);

  mkdirSync(path.dirname(disclosurePath), { recursive: true });
  writeFileSync(disclosurePath, policyDisclosure(version));
  assert.deepEqual(validateCurrentResearchDisclosure(root), []);

  writeFileSync(disclosurePath, policyDisclosure("0.1.1"));
  assert.deepEqual(validateCurrentResearchDisclosure(root), [
    `${relativePath} must begin with # Research-output disclosure — v${version}`,
  ]);

  writeFileSync(
    disclosurePath,
    policyDisclosure(version).replace("## Funding and material support\n\nNo funding is declared.\n\n", ""),
  );
  assert.deepEqual(validateCurrentResearchDisclosure(root), [
    `${relativePath} must contain exactly one ## Funding and material support`,
  ]);
});

test("workflow validation rejects mutable actions and unbounded jobs", () => {
  const findings = validateWorkflowObject({
    permissions: { contents: "read" },
    concurrency: { group: "test", "cancel-in-progress": true },
    jobs: {
      unsafe: {
        "runs-on": "ubuntu-latest",
        steps: [{ uses: "actions/checkout@v6", with: { "persist-credentials": false } }],
      },
    },
  });

  assert.equal(findings.length, 2);
  assert.match(findings[0], /timeout-minutes/u);
  assert.match(findings[1], /full commit SHA/u);
});

test("workflow validation rejects ambient writes, unbounded concurrency, and credential persistence", () => {
  const findings = validateWorkflowObject({
    permissions: { contents: "write" },
    jobs: {
      unsafe: {
        "runs-on": "ubuntu-latest",
        "timeout-minutes": 5,
        steps: [{
          uses: "actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1",
        }],
      },
    },
  });
  assert.deepEqual(findings, [
    "workflow.yml: top-level permissions must not grant write access",
    "workflow.yml: concurrency must define a group and explicit cancel-in-progress boolean",
    "workflow.yml: job unsafe step 0 must set checkout persist-credentials to false",
  ]);
});

test("portable operations reject host-specific scripts without rejecting Go portability", () => {
  assert.deepEqual(validateOperationalFilePaths([
    "tooling/cmd/20w/main.go",
    "tooling/internal/runner/runner_windows.go",
    "release/20w-windows-amd64.exe",
    "docs/windows-platform-notes.md",
  ]), []);
  assert.deepEqual(validateOperationalFilePaths([
    "scripts/check.ps1",
    ".github/helpers/release.cmd",
    "experiments/workstation/fixture-012/workstation-acquisition.mjs",
    "tooling/cmd/20w/main.go",
  ]), [
    ".github/helpers/release.cmd: host-specific operational artifact is forbidden; use the portable Go command or a scoped container",
    "experiments/workstation/fixture-012/workstation-acquisition.mjs: host-specific operational artifact is forbidden; use the portable Go command or a scoped container",
    "scripts/check.ps1: host-specific operational artifact is forbidden; use the portable Go command or a scoped container",
  ]);
});

test("portable workflows reject Windows runners and PowerShell entry points", () => {
  const findings = validatePortableWorkflowObject({
    jobs: {
      matrix: {
        "runs-on": "${{ matrix.os }}",
        strategy: { matrix: { os: ["ubuntu-24.04", "windows-2025"] } },
        steps: [{ run: "go test ./..." }],
      },
      shell: {
        "runs-on": "ubuntu-24.04",
        steps: [
          { shell: "pwsh", run: "Write-Output test" },
          { run: "powershell.exe -File scripts/check.ps1" },
        ],
      },
    },
  });
  assert.deepEqual(findings, [
    "workflow.yml: job matrix must not add a Windows runner lane",
    "workflow.yml: job shell step 0 must not use pwsh",
    "workflow.yml: job shell step 1 must not invoke PowerShell",
  ]);
});

test("workflow validation accepts only the reviewed action digests", () => {
  const valid = {
    permissions: { contents: "read" },
    concurrency: { group: "test", "cancel-in-progress": true },
    jobs: {
      check: {
        "timeout-minutes": 5,
        steps: [{
          uses: "actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1",
          with: { "persist-credentials": false },
        }],
      },
    },
  };
  assert.deepEqual(validateWorkflowObject(valid), []);

  const stale = structuredClone(valid);
  stale.jobs.check.steps[0].uses = "actions/checkout@d23441a48e516b6c34aea4fa41551a30e30af803";
  assert.deepEqual(validateWorkflowObject(stale), [
    "workflow.yml: root.jobs.check.steps[0].uses must use the approved actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1 pin; got actions/checkout@d23441a48e516b6c34aea4fa41551a30e30af803",
  ]);
});

test("scientific workflows must provision the fixture-locked Python and NumPy runtime", () => {
  const lock = { python_version: "3.14.7", packages: { numpy: "2.5.2" } };
  const validSteps = [
    { uses: "actions/setup-python@5fda3b95a4ea91299a34e894583c3862153e4b97", with: { "python-version": "3.14.7" } },
    { run: "python -m pip install --disable-pip-version-check --no-deps --require-hashes -r requirements-ci.txt" },
  ];
  assert.deepEqual(validateScientificRuntimeWorkflowObject(
    { jobs: { quality: { steps: validSteps } } },
    lock,
    "quality",
  ), []);
  assert.deepEqual(validateScientificRuntimeWorkflowObject(
    { jobs: { quality: { steps: [{ ...validSteps[0], with: { "python-version": "3.14" } }] } } },
    lock,
    "quality",
  ), [
    "workflow.yml: job quality must use locked Python 3.14.7",
    "workflow.yml: job quality must install hash-locked NumPy 2.5.2 without dependencies",
  ]);
});

test("the scientific runtime lock is the exact reviewed CPython and NumPy artifact", () => {
  const valid = {
    schema: 1,
    artifact: "fixture-019",
    python_implementation: "CPython",
    python_version: "3.14.7",
    packages: { numpy: "2.5.2" },
    package_artifacts: {
      numpy: {
        filename: "numpy-2.5.2-cp314-cp314-manylinux_2_27_x86_64.manylinux_2_28_x86_64.whl",
        sha256: "318b9a4c845dbea06708a29c84ee429cc3065048db34cdb799047643492050ee",
      },
    },
    bit_generator: "PCG64DXSM",
    network_install_during_run: false,
  };
  assert.deepEqual(validateScientificRuntimeLock(valid), []);

  const tampered = structuredClone(valid);
  tampered.python_version = "3.14.8";
  tampered.packages.numpy = "2.5.3";
  tampered.package_artifacts.numpy.sha256 = "0".repeat(64);
  tampered.unreviewed_package_source = "https://example.invalid";
  assert.deepEqual(validateScientificRuntimeLock(tampered), [
    "experiments/workstation/fixture-019/python-environment.lock.json: python_version must be \"3.14.7\"",
    "experiments/workstation/fixture-019/python-environment.lock.json: scientific runtime lock contains an unknown or missing field",
    "experiments/workstation/fixture-019/python-environment.lock.json: packages must contain only NumPy 2.5.2",
    "experiments/workstation/fixture-019/python-environment.lock.json: NumPy 2.5.2 must use the approved CPython 3.14 Linux x86_64 wheel and SHA-256 digest",
  ]);
});

test("JavaScript workflows use the exact Node and npm toolchain in order", () => {
  const validSteps = [
    {
      uses: "actions/setup-node@820762786026740c76f36085b0efc47a31fe5020",
      with: { "node-version": "26.8.1", cache: "npm" },
    },
    { run: "node scripts/install-locked-npm.mjs" },
    { run: "test \"$(npm --version)\" = \"12.0.2\"" },
    { run: "npm ci" },
  ];
  assert.deepEqual(validateJavaScriptRuntimeWorkflowObject(
    { jobs: { quality: { steps: validSteps } } },
    "quality",
  ), []);

  const tampered = structuredClone(validSteps);
  tampered[0].with["node-version"] = "26.8.0";
  tampered[1].run = "npm install --global npm@latest";
  tampered[2].run = "test \"$(npm --version)\" = \"12.0.1\"";
  assert.deepEqual(validateJavaScriptRuntimeWorkflowObject(
    { jobs: { quality: { steps: tampered } } },
    "quality",
  ), [
    "workflow.yml: job quality must use Node 26.8.1 with the npm cache",
    "workflow.yml: job quality must install hash-locked npm 12.0.2 after Node setup",
    "workflow.yml: job quality must verify locked npm 12.0.2 after installation",
    "workflow.yml: job quality must run npm ci after verifying the locked npm version",
  ]);
});

test("the npm runtime lock binds the exact reviewed registry archive", () => {
  const valid = {
    schema: 1,
    version: "12.0.2",
    url: "https://registry.npmjs.org/npm/-/npm-12.0.2.tgz",
    size: 3_045_132,
    sha256: "5dbb86c71d07a1957f2e90734092dd6a58bdcd9ebc2d8d41ca1c6e6a21d364e1",
  };
  assert.deepEqual(validateNpmRuntimeLock(valid), []);

  const tampered = { ...valid, url: "https://registry.npmjs.org/npm/-/npm-12.0.3.tgz" };
  delete tampered.size;
  tampered.extra = true;
  assert.deepEqual(validateNpmRuntimeLock(tampered), [
    "scripts/npm-runtime-lock.json: npm runtime lock contains an unknown or missing field",
    "scripts/npm-runtime-lock.json: url must be \"https://registry.npmjs.org/npm/-/npm-12.0.2.tgz\"",
    "scripts/npm-runtime-lock.json: size must be 3045132",
  ]);
});

test("Go workflows use tooling/go.mod and the Go CodeQL lane", () => {
  const valid = {
    jobs: {
      "analyze-go": {
        steps: [
          {
            uses: "actions/setup-go@b7ad1dad31e06c5925ef5d2fc7ad053ef454303e",
            with: {
              "go-version-file": "tooling/go.mod",
              "cache-dependency-path": "tooling/go.sum",
            },
          },
          {
            uses: "github/codeql-action/init@cdf488f595d80d6e07e03d4674febd5ab45fa938",
            with: { languages: "go", "build-mode": "autobuild" },
          },
          {
            uses: "github/codeql-action/analyze@cdf488f595d80d6e07e03d4674febd5ab45fa938",
            with: { category: "/language:go" },
          },
        ],
      },
    },
  };
  assert.deepEqual(validateGoRuntimeWorkflowObject(valid, "analyze-go"), []);
  assert.deepEqual(validateGoCodeQlWorkflowObject(valid), []);

  const tampered = structuredClone(valid);
  delete tampered.jobs["analyze-go"].steps[0].with["cache-dependency-path"];
  tampered.jobs["analyze-go"].steps[1].with.languages = "javascript-typescript";
  assert.deepEqual(validateGoCodeQlWorkflowObject(tampered), [
    ".github/workflows/codeql.yml: job analyze-go must use Go 1.27.0 from tooling/go.mod with tooling/go.sum caching",
    ".github/workflows/codeql.yml: analyze-go must initialize CodeQL autobuild for Go",
  ]);
});

test("CI runs the strict-JSON fuzzer with explicit time and process bounds", () => {
  const valid = workflow("ci");
  assert.deepEqual(validateCiFuzzingWorkflowObject(valid), []);

  const unboundedMinimisation = structuredClone(valid);
  const fuzz = unboundedMinimisation.jobs["quality-full"].steps.find((step) => (
    step.name === "Fuzz the untrusted JSON boundary"
  ));
  fuzz.run = fuzz.run.replace(" -fuzzminimizetime=5s", "");
  assert.deepEqual(validateCiFuzzingWorkflowObject(unboundedMinimisation), [
    ".github/workflows/ci.yml: quality-full must run the exact bounded strict-JSON fuzz target after the full non-workstation check",
  ]);

  const allowedFailure = structuredClone(valid);
  allowedFailure.jobs["quality-full"].steps.find((step) => (
    step.name === "Fuzz the untrusted JSON boundary"
  ))["continue-on-error"] = true;
  assert.deepEqual(validateCiFuzzingWorkflowObject(allowedFailure), [
    ".github/workflows/ci.yml: quality-full must run the exact bounded strict-JSON fuzz target after the full non-workstation check",
  ]);

  const allowedRepositoryCheckFailure = structuredClone(valid);
  allowedRepositoryCheckFailure.jobs["quality-full"].steps.find((step) => (
    step.run === "npm run check:full-without-workstation"
  ))["continue-on-error"] = true;
  assert.deepEqual(validateCiFuzzingWorkflowObject(allowedRepositoryCheckFailure), [
    ".github/workflows/ci.yml: quality-full must run the exact bounded strict-JSON fuzz target after the full non-workstation check",
  ]);

  const skippedRepositoryCheck = structuredClone(valid);
  skippedRepositoryCheck.jobs["quality-full"].steps.find((step) => (
    step.run === "npm run check:full-without-workstation"
  )).if = "false";
  assert.deepEqual(validateCiFuzzingWorkflowObject(skippedRepositoryCheck), [
    ".github/workflows/ci.yml: quality-full must run the exact bounded strict-JSON fuzz target after the full non-workstation check",
  ]);

  const detachedGate = structuredClone(valid);
  detachedGate.jobs["ci-success"].needs = detachedGate.jobs["ci-success"].needs.filter(
    (job) => job !== "quality-full",
  );
  assert.deepEqual(validateCiFuzzingWorkflowObject(detachedGate), [
    ".github/workflows/ci.yml: ci-success must require the fuzzing quality-full gate",
  ]);
});

test("CI impact selection is projected once and every job state fails closed", () => {
  const valid = workflow("ci");
  assert.deepEqual(validateCiImpactWorkflowObject(valid), []);

  const draftOnly = structuredClone(valid);
  const plan = draftOnly.jobs["impact-plan"].steps.find((step) => step.id === "plan");
  plan.run = plan.run.replace(
    'if [[ "$EVENT_NAME" == "pull_request" ]]',
    'if [[ "$EVENT_NAME" == "pull_request" && "$PR_DRAFT" == "true" ]]',
  );
  assert.ok(validateCiImpactWorkflowObject(draftOnly).includes(
    ".github/workflows/ci.yml: every pull_request must project its exact base/head diff and only non-PR events may force full",
  ));

  const openEmptyMatrix = structuredClone(valid);
  openEmptyMatrix.jobs["workstation-artifacts"].if = "needs.impact-plan.outputs.mode == 'impact'";
  assert.ok(validateCiImpactWorkflowObject(openEmptyMatrix).includes(
    ".github/workflows/ci.yml: an empty workstation matrix must skip both workstation jobs and selected tests must use the bounded eight-way matrix",
  ));

  for (const job of ["workstation-core", "workstation-artifacts"]) {
    const allowedJobFailure = structuredClone(valid);
    allowedJobFailure.jobs[job]["continue-on-error"] = true;
    assert.ok(validateCiImpactWorkflowObject(allowedJobFailure).includes(
      ".github/workflows/ci.yml: workstation core, setup, and shard execution must fail closed",
    ));
  }

  const skippedSelectedLane = structuredClone(valid);
  const success = skippedSelectedLane.jobs["ci-success"].steps.find((step) => (
    step.name === "Require every expected gate state"
  ));
  success.run = success.run.replace(
    'require_selection lane-go "$RESULT_GO" "$SELECT_GO"',
    'require_state lane-go "$RESULT_GO" skipped',
  );
  assert.ok(validateCiImpactWorkflowObject(skippedSelectedLane).includes(
    ".github/workflows/ci.yml: ci-success must reject unexpected states and any skipped selected lane",
  ));

  const dynamicCommand = structuredClone(valid);
  const artifactStep = dynamicCommand.jobs["workstation-artifacts"].steps.find((step) => (
    step.name === "Run the allowlisted artifact test script"
  ));
  artifactStep.run = 'eval "$PLAN_COMMAND"';
  assert.ok(validateCiImpactWorkflowObject(dynamicCommand).includes(
    ".github/workflows/ci.yml: workstation matrix execution must dispatch only the seventeen static test scripts",
  ));

  const extraDispatch = structuredClone(valid);
  const extraArtifactStep = extraDispatch.jobs["workstation-artifacts"].steps.find((step) => (
    step.name === "Run the allowlisted artifact test script"
  ));
  extraArtifactStep.run = extraArtifactStep.run.replace(
    "  fixture-026-shard-1) npm run test:workstation:fixture-026:shard-1 ;;",
    "  fixture-026-shard-1) true ;;\n  fixture-026-shard-1) npm run test:workstation:fixture-026:shard-1 ;;",
  );
  assert.ok(validateCiImpactWorkflowObject(extraDispatch).includes(
    ".github/workflows/ci.yml: workstation matrix execution must dispatch only the seventeen static test scripts",
  ));

  const ignoredShardFailure = structuredClone(valid);
  ignoredShardFailure.jobs["workstation-artifacts"].steps.find((step) => (
    step.name === "Run the allowlisted artifact test script"
  ))["continue-on-error"] = "${{ true }}";
  assert.ok(validateCiImpactWorkflowObject(ignoredShardFailure).includes(
    ".github/workflows/ci.yml: workstation core, setup, and shard execution must fail closed",
  ));

  const constantArtifact = structuredClone(valid);
  constantArtifact.jobs["workstation-artifacts"].steps.find((step) => (
    step.name === "Run the allowlisted artifact test script"
  )).env.ARTIFACT = "fixture-026-shard-1";
  assert.ok(validateCiImpactWorkflowObject(constantArtifact).includes(
    ".github/workflows/ci.yml: workstation matrix execution must dispatch only the seventeen static test scripts",
  ));
});

test("CI workstation and success authority cannot be conditionally skipped", () => {
  const valid = workflow("ci");
  const matrixFinding = ".github/workflows/ci.yml: an empty workstation matrix must skip both workstation jobs and selected tests must use the bounded eight-way matrix";
  const coreFinding = ".github/workflows/ci.yml: workstation core must run its complete authority step unconditionally";
  const dispatchFinding = ".github/workflows/ci.yml: workstation matrix execution must dispatch only the seventeen static test scripts";
  const successFinding = ".github/workflows/ci.yml: ci-success must unconditionally inspect the exact fail-closed state vector";

  const excludedShard = structuredClone(valid);
  excludedShard.jobs["workstation-artifacts"].strategy.matrix.exclude = [
    { artifact: "fixture-026-shard-1" },
  ];
  assert.ok(validateCiImpactWorkflowObject(excludedShard).includes(matrixFinding));

  const skippedCore = structuredClone(valid);
  skippedCore.jobs["workstation-core"].steps.find((step) => (
    step.name === "Validate the workstation inventory and core"
  )).if = "false";
  assert.ok(validateCiImpactWorkflowObject(skippedCore).includes(coreFinding));

  const skippedShard = structuredClone(valid);
  skippedShard.jobs["workstation-artifacts"].steps.find((step) => (
    step.name === "Run the allowlisted artifact test script"
  )).if = "matrix.artifact != 'fixture-026-shard-1'";
  assert.ok(validateCiImpactWorkflowObject(skippedShard).includes(dispatchFinding));

  const skippedSuccess = structuredClone(valid);
  delete skippedSuccess.jobs["ci-success"].if;
  assert.ok(validateCiImpactWorkflowObject(skippedSuccess).includes(successFinding));

  const forgedSuccess = structuredClone(valid);
  forgedSuccess.jobs["ci-success"].steps.find((step) => (
    step.name === "Require every expected gate state"
  )).env.RESULT_WORKSTATION_ARTIFACTS = "success";
  assert.ok(validateCiImpactWorkflowObject(forgedSuccess).includes(successFinding));
});

test("CI success accepts only the exact full or selected impact state vector", () => {
  const subject = workflow("ci");
  const source = subject.jobs["ci-success"].steps.find((step) => (
    step.name === "Require every expected gate state"
  )).run;
  assert.equal(runCiSuccessGate(source).status, 0);

  const impact = {
    EVENT_NAME: "pull_request",
    MODE: "impact",
    SELECT_SITE: "true",
    SELECT_WORKSTATION: "true",
    RESULT_PR_TITLE: "success",
    RESULT_QUALITY_FULL: "skipped",
    RESULT_IMPACT_COMMON: "success",
    RESULT_SITE: "success",
    RESULT_WORKSTATION_CORE: "success",
    RESULT_WORKSTATION_ARTIFACTS: "success",
    RESULT_CONTAINER: "skipped",
    RESULT_DEPENDENCY_REVIEW: "success",
  };
  assert.equal(runCiSuccessGate(source, impact).status, 0);
  assert.notEqual(runCiSuccessGate(source, {
    ...impact,
    RESULT_WORKSTATION_ARTIFACTS: "skipped",
  }).status, 0, "a selected matrix may not skip");
  assert.notEqual(runCiSuccessGate(source, {
    ...impact,
    RESULT_GO: "success",
  }).status, 0, "an unselected lane may not succeed unexpectedly");
  assert.notEqual(runCiSuccessGate(source, {
    ...impact,
    RESULT_SITE: "cancelled",
  }).status, 0, "a selected lane may not be cancelled");
  assert.notEqual(runCiSuccessGate(source, {
    SELECT_GO: "true",
  }).status, 0, "full mode must expose false semantic selectors");
  assert.notEqual(runCiSuccessGate(source, {
    SELECT_WORKSTATION: "false",
  }).status, 0, "full mode must expose its closed workstation matrix");
  assert.notEqual(runCiSuccessGate(source, {
    RESULT_WORKSTATION_ARTIFACTS: "skipped",
  }).status, 0, "the full workstation matrix may not skip");
});

test("repository metadata synchronization is manifest-triggered and least-privileged", () => {
  const valid = workflow("sync-repository-metadata");
  assert.deepEqual(validateRepositoryMetadataSyncWorkflowObject(valid), []);

  const tampered = structuredClone(valid);
  tampered.jobs.sync.permissions.contents = "write";
  assert.ok(validateRepositoryMetadataSyncWorkflowObject(tampered).includes(
    ".github/workflows/sync-repository-metadata.yml: repository metadata synchronization needs only contents:read and issues:write",
  ));

  const untrustedCheckout = structuredClone(valid);
  const checkout = untrustedCheckout.jobs.sync.steps.find(
    (step) => step.uses?.startsWith("actions/checkout@"),
  );
  checkout.with.ref = "refs/heads/feature";
  assert.ok(validateRepositoryMetadataSyncWorkflowObject(untrustedCheckout).includes(
    ".github/workflows/sync-repository-metadata.yml: manual metadata repair must still check out canonical main",
  ));

  const incompleteTrigger = structuredClone(valid);
  incompleteTrigger.on.push.paths = incompleteTrigger.on.push.paths.filter(
    (entry) => entry !== ".github/milestones.json",
  );
  assert.ok(validateRepositoryMetadataSyncWorkflowObject(incompleteTrigger).includes(
    ".github/workflows/sync-repository-metadata.yml: repository metadata synchronization must run for both canonical manifests on main and allow manual repair",
  ));
});

test("retired ChatGPT Site paths remain forbidden", (t) => {
  const root = mkdtempSync(path.join(tmpdir(), "20w-retired-hosting-"));
  t.after(() => rmSync(root, { force: true, recursive: true }));
  mkdirSync(path.join(root, ".openai"), { recursive: true });
  writeFileSync(path.join(root, ".openai", "hosting.json"), "{}\n");
  assert.deepEqual(validateRetiredHostingPaths(root), [
    ".openai/hosting.json: retired ChatGPT Site path must remain absent",
  ]);
});

test("experiment reports separate immutable digests from discovery tags", () => {
  const relativePath = ".github/ISSUE_TEMPLATE/experiment-protocol-problem.yml";
  const form = parse(readFileSync(new URL(`../${relativePath}`, import.meta.url), "utf8"));
  assert.deepEqual(validateExperimentReportIdentity(form), []);

  const tampered = structuredClone(form);
  tampered.body.find((item) => item.id === "released_image_digest").attributes.description = "Tag or digest";
  assert.ok(validateExperimentReportIdentity(tampered).includes(
    `${relativePath}: experiment reports must request an exact released image@sha256 identity`,
  ));
});

test("failed experiment runs use a short, redaction-aware intake", () => {
  const relativePath = ".github/ISSUE_TEMPLATE/experiment-run-failure.yml";
  const form = parse(readFileSync(new URL(`../${relativePath}`, import.meta.url), "utf8"));
  assert.deepEqual(validateExperimentRunFailureForm(form), []);

  const tampered = structuredClone(form);
  tampered.body.find((item) => item.id === "platform").validations.required = false;
  delete tampered.body.find((item) => item.id === "command").attributes.render;
  tampered.body.find((item) => item.id === "confirmation").attributes.options.pop();
  tampered.body.push({ type: "input", id: "unbounded_extra" });
  const findings = validateExperimentRunFailureForm(tampered);
  assert.ok(findings.includes(`${relativePath}: failed-run intake must remain a short form with at most seven body items`));
  assert.ok(findings.includes(`${relativePath}: platform must be a required input field`));
  assert.ok(findings.includes(`${relativePath}: command must be rendered as shell input`));
  assert.ok(findings.includes(`${relativePath}: submission checks must require redaction and public-report consent`));
});

test("issue-form validation rejects duplicate authority field IDs", () => {
  const findings = validateIssueForm({
    name: "Evidence correction",
    description: "Correct an evidence record.",
    title: "[Evidence]: ",
    body: [
      { type: "input", id: "claim_id" },
      { type: "textarea", id: "claim_id" },
    ],
  });

  assert.deepEqual(findings, ["issue-form.yml: duplicate field id claim_id"]);
});

test("funding validation accepts only the verified maintainer identities", () => {
  assert.deepEqual(validateFundingConfig({ github: ["lusoris"], ko_fi: "lusoris" }), []);
  assert.deepEqual(
    validateFundingConfig({ github: ["someone-else"], ko_fi: "lusoris", custom: "https://example.com" }),
    [
      ".github/FUNDING.yml: unverified funding platform custom",
      ".github/FUNDING.yml: github must contain only the verified lusoris sponsor identity",
    ],
  );
});

test("issue configuration requires private-security and support routes", () => {
  const validLink = (name, url) => ({ name, url, about: "Use this route." });
  assert.deepEqual(validateIssueConfig({
    blank_issues_enabled: false,
    contact_links: [
      validLink("Security", "https://github.com/lusoris/20-watts-was-enough/security/advisories/new"),
      validLink("Support", "https://github.com/lusoris/20-watts-was-enough/blob/main/SUPPORT.md"),
    ],
  }), []);
  assert.deepEqual(
    validateIssueConfig({ blank_issues_enabled: true, contact_links: [] }),
    [
      ".github/ISSUE_TEMPLATE/config.yml: blank issues must remain disabled",
      ".github/ISSUE_TEMPLATE/config.yml: missing required contact link https://github.com/lusoris/20-watts-was-enough/security/advisories/new",
      ".github/ISSUE_TEMPLATE/config.yml: missing required contact link https://github.com/lusoris/20-watts-was-enough/blob/main/SUPPORT.md",
    ],
  );
});

test("release policy rejects a tag that is not bound to origin/main", () => {
  const findings = validateReleaseWorkflowObject({
    jobs: {
      verify: {
        steps: [{ id: "release-ref", run: "git rev-parse HEAD" }],
      },
    },
  });

  const diagnostic = findings.join("\n");
  assert.match(diagnostic, /origin\/main is unavailable/u);
  assert.match(diagnostic, /contained in origin\/main/u);
  assert.match(diagnostic, /triggering event SHA/u);
  assert.match(diagnostic, /exact tag ref and commit/u);
  assert.match(diagnostic, /tag-bound PDF render/u);
  assert.match(diagnostic, /native 20w binaries/u);
  assert.match(diagnostic, /must follow the native binary build/u);
});

test("release policy binds native binaries and ingests them after the PDF render", () => {
  const valid = workflow("release");
  assert.deepEqual(validateReleaseWorkflowObject(valid), []);

  const tampered = structuredClone(valid);
  const preparation = tampered.jobs.verify.steps.find((step) => (
    typeof step.run === "string" && step.run.includes("npm run prepare:release")
  ));
  preparation.run = preparation.run.replace(" --additional-assets-root build/release-inputs", "");
  assert.ok(validateReleaseWorkflowObject(tampered).includes(
    ".github/workflows/release.yml: release preparation must ingest the native binaries as additional assets",
  ));

  const escapedReleasePlan = structuredClone(valid);
  const execution = escapedReleasePlan.jobs.verify.steps.find((step) => (
    typeof step.run === "string" && step.run.includes("experiment release-plan")
  ));
  execution.run = execution.run.replace(
    "> build/release-inputs/experiment-release-plan.json",
    "> ../build/release-inputs/experiment-release-plan.json",
  );
  assert.ok(validateReleaseWorkflowObject(escapedReleasePlan).includes(
    ".github/workflows/release.yml: the release plan redirect must stay inside the repository release-input directory",
  ));

  const ambientPDFBuilder = structuredClone(valid);
  ambientPDFBuilder.jobs.verify.steps.find(
    (step) => step.name === "Set up the locked PDF Docker Buildx client",
  ).with.version = "latest";
  assert.ok(validateReleaseWorkflowObject(ambientPDFBuilder).includes(
    ".github/workflows/release.yml: tag-bound PDF rendering must provision the locked Buildx client and BuildKit image after the source gate",
  ));

  const latePDFBuilder = structuredClone(valid);
  const verifySteps = latePDFBuilder.jobs.verify.steps;
  const builderIndex = verifySteps.findIndex(
    (step) => step.name === "Set up the locked PDF Docker Buildx client",
  );
  const [builder] = verifySteps.splice(builderIndex, 1);
  const renderIndex = verifySteps.findIndex((step) => step.name === "Render the immutable tag-bound book");
  verifySteps.splice(renderIndex + 1, 0, builder);
  assert.ok(validateReleaseWorkflowObject(latePDFBuilder).includes(
    ".github/workflows/release.yml: tag-bound PDF rendering must provision the locked Buildx client and BuildKit image after the source gate",
  ));

  const incompleteAttestation = structuredClone(valid);
  const attestation = releaseImageStepByName(incompleteAttestation, "Attest the complete release asset inventory");
  attestation.with["subject-path"] = "build/release/assets/SHA256SUMS";
  assert.ok(validateReleaseWorkflowObject(incompleteAttestation).includes(
    ".github/workflows/release.yml: checksums and provenance must cover the exact generated release asset directory",
  ));

  const publishedMutation = structuredClone(valid);
  delete releaseImageStepByName(
    publishedMutation,
    "Attest the complete release asset inventory",
  ).if;
  assert.ok(validateReleaseWorkflowObject(publishedMutation).includes(
    ".github/workflows/release.yml: checksums and provenance must cover the exact generated release asset directory",
  ));
});

test("release publication preserves generated notes before appending image identities", () => {
  assertWorkflowTamper(
    "release",
    validateReleaseExperimentImageWorkflowObject,
    (subject) => {
      const notes = releaseImageStepByName(subject, "Add immutable container identities to the release notes");
      notes.run = notes.run.replace('cp build/release/release-notes.md "$notes"', ': > "$notes"');
    },
    ".github/workflows/release.yml: published release notes must preserve the generated changelog and disclosure link",
  );
});

test("release publication requires anonymous pulls of all final image digests", () => {
  const anonymousFinding = ".github/workflows/release.yml: final release image digests must pass anonymous pulls with an empty Docker configuration";
  for (const mutate of [
    (subject) => {
      const pull = releaseImageStepByName(subject, "Prove final image digests are anonymously pullable");
      pull.run = pull.run.replace('DOCKER_CONFIG="$anonymous_config" docker pull "$image"', 'docker pull "$image"');
    },
    (subject) => {
      const pull = releaseImageStepByName(subject, "Prove final image digests are anonymously pullable");
      pull.run = pull.run.replace('printf \'%s\\n\' \'{"auths":{}}\' > "$anonymous_config/config.json"', "docker login ghcr.io");
    },
    (subject) => {
      const pull = releaseImageStepByName(subject, "Prove final image digests are anonymously pullable");
      pull.run = pull.run.replace('ghcr.io/${GITHUB_REPOSITORY}-fixture-019@${FIXTURE_019_DIGEST}', "fixture-019:latest");
    },
  ]) {
    assertWorkflowTamper("release", validateReleaseExperimentImageWorkflowObject, mutate, anonymousFinding);
  }

  assertWorkflowTamper(
    "release",
    validateReleaseExperimentImageWorkflowObject,
    (subject) => {
      const steps = subject.jobs.release.steps;
      const pullIndex = steps.findIndex((step) => step.name === "Prove final image digests are anonymously pullable");
      const [pull] = steps.splice(pullIndex, 1);
      const publicationIndex = steps.findIndex((step) => step.name === "Publish or validate the immutable GitHub release");
      steps.splice(publicationIndex + 1, 0, pull);
    },
    ".github/workflows/release.yml: anonymous digest pulls must follow final binding and precede GitHub Release publication",
  );
});

test("release derives one safe sorted asset inventory from SHA256SUMS", () => {
  const finding = ".github/workflows/release.yml: release asset inventory must derive safe sorted unique basenames from validated SHA256SUMS before remote access";
  const cases = [
    (subject) => {
      const publication = releaseImageStepByName(subject, "Publish or validate the immutable GitHub release");
      publication.run = publication.run.replace(
        '"$tool" release asset-inventory',
        '"$tool" release list-unchecked-assets',
      );
    },
    (subject) => {
      const publication = releaseImageStepByName(subject, "Publish or validate the immutable GitHub release");
      publication.run = publication.run.replace(
        "--assets build/release/assets",
        "--assets build/release",
      );
    },
    (subject) => {
      const publication = releaseImageStepByName(subject, "Publish or validate the immutable GitHub release");
      publication.run = publication.run.replace("--phase publication", "--phase source");
    },
    (subject) => {
      const publication = releaseImageStepByName(subject, "Publish or validate the immutable GitHub release");
      publication.run = publication.run.replace(
        'local inventory="$comparison_root/local-revalidated.txt"',
        'local inventory="$comparison_root/untrusted.txt"',
      );
    },
    (subject) => {
      const publication = releaseImageStepByName(subject, "Publish or validate the immutable GitHub release");
      publication.run = publication.run.replace(
        'mapfile -t expected_assets < "$expected_inventory"',
        'expected_assets=("LICENSE")',
      );
    },
    (subject) => {
      const publication = releaseImageStepByName(subject, "Publish or validate the immutable GitHub release");
      publication.run = publication.run.replace(
        "tool=build/release-tools/20w",
        'gh api --paginate "repos/${GITHUB_REPOSITORY}/releases?per_page=100"\ntool=build/release-tools/20w',
      );
    },
  ];
  for (const mutate of cases) {
    assertWorkflowTamper("release", validateReleaseWorkflowObject, mutate, finding);
  }
});

test("same-tag releases compare assets and upload only missing allowed files", () => {
  const finding = ".github/workflows/release.yml: same-tag release assets must use the closed inventory, compare existing bytes, upload only missing files, and never replace or delete";
  const cases = [
    (subject) => {
      const publication = releaseImageStepByName(subject, "Publish or validate the immutable GitHub release");
      publication.run = publication.run.replace("release fetch-assets", "release fetch-unchecked-assets");
    },
    (subject) => {
      const publication = releaseImageStepByName(subject, "Publish or validate the immutable GitHub release");
      publication.run = publication.run.replace(
        "--expected-assets build/release/assets",
        "--expected-assets build/release",
      );
    },
    (subject) => {
      const publication = releaseImageStepByName(subject, "Publish or validate the immutable GitHub release");
      publication.run = publication.run.replace('--release-id "$release_id"', "--release-id 1");
    },
    (subject) => {
      const publication = releaseImageStepByName(subject, "Publish or validate the immutable GitHub release");
      publication.run += '\ngh api --paginate "repos/${GITHUB_REPOSITORY}/releases/${release_id}/assets"';
    },
    (subject) => {
      const publication = releaseImageStepByName(subject, "Publish or validate the immutable GitHub release");
      publication.run = publication.run.replace('cmp --silent -- "$expected" "$downloaded"', "true");
    },
    (subject) => {
      const publication = releaseImageStepByName(subject, "Publish or validate the immutable GitHub release");
      publication.run = publication.run.replace('gh release upload "$RELEASE_TAG" "${missing_assets[@]}"', 'gh release upload "$RELEASE_TAG" "${assets[@]}"');
    },
    (subject) => {
      const publication = releaseImageStepByName(subject, "Publish or validate the immutable GitHub release");
      publication.run = publication.run.replace('gh release upload "$RELEASE_TAG" "${missing_assets[@]}"', 'gh release upload "$RELEASE_TAG" "${missing_assets[@]}" --clobber');
    },
    (subject) => {
      const publication = releaseImageStepByName(subject, "Publish or validate the immutable GitHub release");
      publication.run = publication.run.replace('compare_asset "$name" "$download_root/$name"', ":");
    },
    (subject) => {
      const publication = releaseImageStepByName(subject, "Publish or validate the immutable GitHub release");
      const lines = publication.run.split("\n");
      const publishedIndex = lines.findIndex((line) => line.trim() === "published)");
      const exitIndex = lines.findIndex((line, index) => index > publishedIndex && line.trim() === "exit 0");
      lines.splice(exitIndex, 0, '      gh api --method PATCH "repos/${GITHUB_REPOSITORY}/releases/${release_id}"');
      publication.run = lines.join("\n");
    },
  ];
  for (const mutate of cases) {
    assertWorkflowTamper("release", validateReleaseWorkflowObject, mutate, finding);
  }
});

test("release preflight completes before publication mutation", () => {
  const finding = ".github/workflows/release.yml: existing releases must pass the read-only asset and peeled-tag preflight before publication mutations";
  assertWorkflowTamper(
    "release",
    validateReleaseWorkflowObject,
    (subject) => {
      const steps = subject.jobs.release.steps;
      const preflightIndex = steps.findIndex((step) => step.id === "release-preflight");
      const [preflight] = steps.splice(preflightIndex, 1);
      const buildxIndex = steps.findIndex((step) => step.name === "Set up Docker Buildx");
      steps.splice(buildxIndex + 1, 0, preflight);
    },
    finding,
  );
  assertWorkflowTamper(
    "release",
    validateReleaseWorkflowObject,
    (subject) => {
      releaseImageStep(subject, "release-preflight").run += '\ngh api --method PATCH "repos/${GITHUB_REPOSITORY}/releases/1"';
    },
    finding,
  );
  for (const [before, after] of [
    ["release state", "release state-unchecked"],
    ["release fetch-assets", "release fetch-unchecked-assets"],
    ["--expected-assets ../build/release/assets", "--expected-assets ../build/release"],
    ['--release-id "$release_id"', "--release-id 1"],
    ['--output "$existing_root"', "--output build/release/assets"],
  ]) {
    assertWorkflowTamper(
      "release",
      validateReleaseWorkflowObject,
      (subject) => {
        const preflight = releaseImageStep(subject, "release-preflight");
        preflight.run = preflight.run.replace(before, after);
      },
      finding,
    );
  }
  assertWorkflowTamper(
    "release",
    validateReleaseWorkflowObject,
    (subject) => {
      releaseImageStep(subject, "release-preflight").run += '\ngh api --paginate "repos/${GITHUB_REPOSITORY}/releases/1/assets"';
    },
    finding,
  );
});

test("release refusal branches cannot be neutralized", () => {
  const preflightFinding = ".github/workflows/release.yml: existing releases must pass the read-only asset and peeled-tag preflight before publication mutations";
  for (const diagnostic of [
    "existing release asset differs from the local asset",
    "published immutable release assets are incomplete",
  ]) {
    assertWorkflowTamper(
      "release",
      validateReleaseWorkflowObject,
      (subject) => disableExitAfterDiagnostic(releaseImageStep(subject, "release-preflight"), diagnostic),
      preflightFinding,
    );
  }

  const finalFinding = ".github/workflows/release.yml: same-tag release assets must use the closed inventory, compare existing bytes, upload only missing files, and never replace or delete";
  for (const diagnostic of [
    "remote release asset differs from the local asset",
    "remote release assets do not match the checksum-derived inventory",
    "local release asset authority changed before publication mutation",
    "remote release checksum authority changed during verification",
    "published release did not become immutable after five checks",
  ]) {
    assertWorkflowTamper(
      "release",
      validateReleaseWorkflowObject,
      (subject) => disableExitAfterDiagnostic(
        releaseImageStepByName(subject, "Publish or validate the immutable GitHub release"),
        diagnostic,
      ),
      finalFinding,
    );
  }

  assertWorkflowTamper(
    "release",
    validateReleaseExperimentImageWorkflowObject,
    (subject) => disableExitAfterDiagnostic(
      releaseImageStepByName(subject, "Prove final image digests are anonymously pullable"),
      "is not anonymously pullable.",
    ),
    ".github/workflows/release.yml: final release image digests must pass anonymous pulls with an empty Docker configuration",
  );
});

test("oci-images.json is the immutable release-image authority", () => {
  const authorityFinding = ".github/workflows/release.yml: oci-images.json must become the checksum-bound authority only after final anonymous digest admission";
  for (const mutate of [
    (subject) => {
      const materialize = releaseImageStepByName(subject, "Materialize the immutable OCI image authority");
      materialize.run = materialize.run.replace("release write-oci-images", "printf");
    },
    (subject) => {
      const resolve = releaseImageStep(subject, "release-images");
      resolve.if = "steps.release-preflight.outputs.release_state != 'published'";
    },
    (subject) => {
      const steps = subject.jobs.release.steps;
      const materializeIndex = steps.findIndex((step) => step.name === "Materialize the immutable OCI image authority");
      const [materialize] = steps.splice(materializeIndex, 1);
      const bindingIndex = steps.findIndex((step) => step.name === "Bind final release tags to the admitted digests");
      steps.splice(bindingIndex + 1, 0, materialize);
    },
  ]) {
    assertWorkflowTamper("release", validateReleaseWorkflowObject, mutate, authorityFinding);
  }

  const rerunFinding = ".github/workflows/release.yml: immutable published reruns must revalidate persisted assets, images, provenance, and anonymous pulls without mutation";
  for (const stepName of [
    "Validate persisted release image identities and tag bindings",
    "Verify persisted image provenance against the tag source",
    "Revalidate persisted image digests anonymously",
    "Verify the complete release-asset attestations against the tag source",
  ]) {
    assertWorkflowTamper(
      "release",
      validateReleaseWorkflowObject,
      (subject) => {
        releaseImageStepByName(subject, stepName).if = "steps.release-preflight.outputs.release_state != 'published'";
      },
      rerunFinding,
    );
  }
  for (const mutate of [
    (subject) => {
      releaseImageStepByName(
        subject,
        "Revalidate persisted image digests anonymously",
      ).env.GHCR_TOKEN = "${{ github.token }}";
    },
    (subject) => {
      releaseImageStepByName(
        subject,
        "Revalidate persisted image digests anonymously",
      ).run += "\ndocker login ghcr.io";
    },
  ]) {
    assertWorkflowTamper("release", validateReleaseWorkflowObject, mutate, rerunFinding);
  }
});

test("CI and release image policy preserve separate tooling and experiment identities", () => {
  const ciWorkflow = workflow("ci");
  const releaseWorkflow = workflow("release");
  assert.deepEqual(validateCiExperimentImageWorkflowObject(ciWorkflow), []);
  assert.deepEqual(validateReleaseExperimentImageWorkflowObject(releaseWorkflow), []);

  const sharedCiImage = structuredClone(ciWorkflow);
  const ciBuild = sharedCiImage.jobs["container-smoke"].steps.find((step) => (
    step.with?.tags === "20w-fixture-019:test"
  ));
  ciBuild.with.file = "experiments/workstation/Dockerfile";
  assert.ok(validateCiExperimentImageWorkflowObject(sharedCiImage).includes(
    ".github/workflows/ci.yml: container-smoke must build only the scoped Fixture 019 test image",
  ));

  const unnamedCiImage = structuredClone(ciWorkflow);
  const unnamedCiBuild = unnamedCiImage.jobs["container-smoke"].steps.find((step) => (
    step.with?.tags === "20w-fixture-019:test"
  ));
  unnamedCiBuild.with["build-args"] = unnamedCiBuild.with["build-args"].replace(
    "IMAGE_NAME=ghcr.io/${{ github.repository }}-fixture-019\n",
    "",
  );
  assert.ok(validateCiExperimentImageWorkflowObject(unnamedCiImage).includes(
    ".github/workflows/ci.yml: Fixture 019 test image must bind its image name, development version, and source revision",
  ));

  const sharedReleaseImage = structuredClone(releaseWorkflow);
  const releaseBuild = sharedReleaseImage.jobs.release.steps.find((step) => (
    step.id === "build-fixture-019-image"
  ));
  releaseBuild.with.file = "experiments/workstation/Dockerfile";
  assert.ok(validateReleaseExperimentImageWorkflowObject(sharedReleaseImage).includes(
    ".github/workflows/release.yml: release must build the untagged linux/amd64 Fixture 019 candidate",
  ));

  const unnamedReleaseImage = structuredClone(releaseWorkflow);
  const unnamedReleaseBuild = unnamedReleaseImage.jobs.release.steps.find((step) => (
    step.id === "build-fixture-019-image"
  ));
  unnamedReleaseBuild.with["build-args"] = unnamedReleaseBuild.with["build-args"].replace(
    "IMAGE_NAME=ghcr.io/${{ github.repository }}-fixture-019\n",
    "",
  );
  assert.ok(validateReleaseExperimentImageWorkflowObject(unnamedReleaseImage).includes(
    ".github/workflows/release.yml: release must build the untagged linux/amd64 Fixture 019 candidate",
  ));

  const mergedToolingImage = structuredClone(releaseWorkflow);
  const toolingBuild = mergedToolingImage.jobs.release.steps.find((step) => (
    step.id === "build-tooling-image"
  ));
  toolingBuild.with.file = "experiments/workstation/fixture-019/Dockerfile";
  assert.ok(validateReleaseExperimentImageWorkflowObject(mergedToolingImage).includes(
    ".github/workflows/release.yml: static 20w tooling image must use a separate untagged, admitted digest",
  ));
});

test("Fixture 019 uses the closed Go-packaged context in CI and release", () => {
  const ciContextFinding = ".github/workflows/ci.yml: Fixture 019 test image must use its exact closed Go-packaged runtime context";
  assertWorkflowTamper(
    "ci",
    validateCiExperimentImageWorkflowObject,
    (subject) => {
      ciImageStep(subject, "Package the closed Fixture 019 runtime context").run += " --artifact fixture-007";
    },
    ciContextFinding,
  );
  assertWorkflowTamper(
    "ci",
    validateCiExperimentImageWorkflowObject,
    (subject) => {
      ciImageStep(subject, "Build the Fixture 019 image").with.context = ".";
    },
    ".github/workflows/ci.yml: container-smoke must build only the scoped Fixture 019 test image",
  );
  assertWorkflowTamper(
    "release",
    validateReleaseExperimentImageWorkflowObject,
    (subject) => {
      releaseImageStepByName(subject, "Package the closed Fixture 019 runtime context").if = "success()";
    },
    ".github/workflows/release.yml: Fixture 019 release must package its exact closed runtime context after the existing-tag check",
  );
  assertWorkflowTamper(
    "release",
    validateReleaseExperimentImageWorkflowObject,
    (subject) => {
      releaseImageStep(subject, "build-fixture-019-image").with.context = ".";
    },
    ".github/workflows/release.yml: release must build the untagged linux/amd64 Fixture 019 candidate",
  );
  assertWorkflowTamper(
    "release",
    validateReleaseExperimentImageWorkflowObject,
    (subject) => {
      const attestation = subject.jobs.release.steps.find(
        (step) => step.with?.["subject-name"]?.includes("fixture-019"),
      );
      attestation.with["subject-digest"] = "${{ steps.admission-images.outputs.fixture019_digest }}";
    },
    ".github/workflows/release.yml: Fixture 019 provenance must attest only its current-run build output",
  );
});

test("container policy withholds arm64 and enforces exact-digest runtime identity", () => {
  const toolingFinding = ".github/workflows/release.yml: static 20w tooling image must use a separate untagged, admitted digest";
  assertWorkflowTamper(
    "release",
    validateReleaseExperimentImageWorkflowObject,
    (subject) => {
      releaseImageStep(subject, "build-tooling-image").with.platforms = "linux/amd64,linux/arm64";
    },
    toolingFinding,
  );
  assertWorkflowTamper(
    "release",
    validateReleaseExperimentImageWorkflowObject,
    (subject) => {
      const attestation = subject.jobs.release.steps.find(
        (step) => step.with?.["subject-name"] === "ghcr.io/${{ github.repository }}-20w",
      );
      attestation.with["subject-digest"] = "${{ steps.admission-images.outputs.tooling_digest }}";
    },
    toolingFinding,
  );

  const executionFinding = ".github/workflows/release.yml: candidate images must run tooling plus smoke, analyze, and validate by digest before tagging";
  for (const [from, to] of [
    ['if [[ "$tooling_identity" != "$expected_tooling_identity" ]]; then', "if false; then"],
    ['"go_version":"go1.27.0"', '"go_version":"go1.28.0"'],
    ['if [[ "$fixture_007_node" != "v26.8.1" ]]; then', "if false; then"],
    ['"Python 3.14.7"', '"Python 3.14.8"'],
    ['numpy.__version__ == \\"2.5.2\\"', 'numpy.__version__ == \\"2.5.3\\"'],
  ]) {
    assertWorkflowTamper(
      "release",
      validateReleaseExperimentImageWorkflowObject,
      (subject) => {
        const step = releaseImageStepByName(subject, "Run the admitted candidates by immutable digest");
        step.run = step.run.replace(from, to);
      },
      executionFinding,
    );
  }
});

test("release tags remain absent until exact-digest admission and provenance verifies", () => {
  const buildFinding = ".github/workflows/release.yml: static 20w tooling image must use a separate untagged, admitted digest";
  const inspectionFinding = ".github/workflows/release.yml: exact candidate digests must pass authenticated platform and label inspection before admission";
  const provenanceFinding = ".github/workflows/release.yml: existing image digests must fail closed unless source-bound provenance already verifies";
  const publicationFinding = ".github/workflows/release.yml: release tags must use the single absence-checked publication path after admission";
  const orderingFinding = ".github/workflows/release.yml: release image tagging must follow digest inspection, execution, attestation, and provenance verification";
  const cases = [
    {
      expected: buildFinding,
      mutate: (subject) => {
        releaseImageStep(subject, "build-tooling-image").with.tags = "${{ needs.verify.outputs.release-tag }}";
      },
    },
    {
      expected: buildFinding,
      mutate: (subject) => {
        releaseImageStep(subject, "build-tooling-image").with.push = true;
      },
    },
    {
      expected: inspectionFinding,
      mutate: (subject) => {
        const inspection = releaseImageStepByName(subject, "Validate the exact image digests before admission");
        inspection.run = inspection.run.replace('--digest "$TOOLING_DIGEST"', '--tag "$RELEASE_TAG"');
      },
    },
    {
      expected: provenanceFinding,
      mutate: (subject) => {
        releaseImageStepByName(
          subject,
          "Verify admitted image provenance against the tag source",
        ).if = "steps.image-status.outputs.tooling_publish == 'true'";
      },
    },
    {
      expected: publicationFinding,
      mutate: (subject) => {
        const publication = releaseImageStepByName(subject, "Attach missing release tags to admitted digests");
        publication.run = publication.run.replace("candidate_status=absent", "candidate_status=existing");
      },
    },
    {
      expected: orderingFinding,
      mutate: (subject) => {
        const steps = subject.jobs.release.steps;
        const publicationIndex = steps.findIndex((step) => step.name === "Attach missing release tags to admitted digests");
        const [publication] = steps.splice(publicationIndex, 1);
        const executionIndex = steps.findIndex((step) => step.name === "Run the admitted candidates by immutable digest");
        steps.splice(executionIndex, 0, publication);
      },
    },
    {
      expected: orderingFinding,
      mutate: (subject) => {
        const steps = subject.jobs.release.steps;
        const provenanceIndex = steps.findIndex((step) => step.name === "Verify admitted image provenance against the tag source");
        const [provenance] = steps.splice(provenanceIndex, 1);
        const executionIndex = steps.findIndex((step) => step.name === "Run the admitted candidates by immutable digest");
        steps.splice(executionIndex + 1, 0, provenance);
      },
    },
    {
      expected: orderingFinding,
      mutate: (subject) => {
        const steps = subject.jobs.release.steps;
        const bindingIndex = steps.findIndex((step) => step.name === "Bind final release tags to the admitted digests");
        const [binding] = steps.splice(bindingIndex, 1);
        const publicationIndex = steps.findIndex((step) => step.name === "Attach missing release tags to admitted digests");
        steps.splice(publicationIndex, 0, binding);
      },
    },
  ];
  for (const entry of cases) {
    assertWorkflowTamper("release", validateReleaseExperimentImageWorkflowObject, entry.mutate, entry.expected);
  }
});

test("CI enforces the exact Fixture 007 Node runtime", () => {
  assertWorkflowTamper(
    "ci",
    validateCiExperimentImageWorkflowObject,
    (subject) => {
      const step = ciImageStep(subject, "Execute the bounded Fixture 007 smoke path");
      step.run = step.run.replaceAll("v26.8.1", "v26.8.2");
    },
    ".github/workflows/ci.yml: Fixture 007 must run smoke, analyze, and validate against one persistent result volume",
  );
});

test("CI locks Fixture 007 packaging, scoped build inputs, and offline smoke", () => {
  const buildName = "Build the Fixture 007 image";
  const buildFinding = ".github/workflows/ci.yml: container-smoke must build only the scoped Fixture 007 test image from its closed context";
  const cases = [
    {
      expected: ".github/workflows/ci.yml: Fixture 007 test image must use its exact closed Go-packaged runtime context",
      mutate: (subject) => {
        ciImageStep(subject, "Package the closed Fixture 007 runtime context").run += " --artifact fixture-019";
      },
    },
    {
      expected: buildFinding,
      mutate: (subject) => {
        ciImageStep(subject, buildName).with.context = ".";
      },
    },
    {
      expected: buildFinding,
      mutate: (subject) => {
        ciImageStep(subject, buildName).with.file = "experiments/workstation/fixture-019/Dockerfile";
      },
    },
    {
      expected: buildFinding,
      mutate: (subject) => {
        ciImageStep(subject, buildName).with.tags = "20w-experiments:test";
      },
    },
    {
      expected: ".github/workflows/ci.yml: Fixture 007 test image must keep its exact artifact, registry, version, and revision arguments",
      mutate: (subject) => {
        ciImageStep(subject, buildName).with["build-args"] += "UNREVIEWED=true\n";
      },
    },
    {
      expected: ".github/workflows/ci.yml: Fixture 007 test image must use its per-artifact cache scope",
      mutate: (subject) => {
        ciImageStep(subject, buildName).with["cache-from"] = "type=gha,scope=experiments";
      },
    },
    {
      expected: ".github/workflows/ci.yml: Fixture 007 must run smoke, analyze, and validate against one persistent result volume",
      mutate: (subject) => {
        ciImageStep(subject, "Execute the bounded Fixture 007 smoke path").run = "docker run 20w-fixture-007:test smoke";
      },
    },
  ];
  for (const entry of cases) {
    assertWorkflowTamper("ci", validateCiExperimentImageWorkflowObject, entry.mutate, entry.expected);
  }
});

test("release locks Fixture 007 existing-tag, packaging, and metadata boundaries", () => {
  const statusFinding = ".github/workflows/release.yml: Fixture 007 release tags must be checked and preserved before publication";
  const contextFinding = ".github/workflows/release.yml: Fixture 007 release must package its exact closed runtime context after the existing-tag check";
  const metadataFinding = ".github/workflows/release.yml: Fixture 007 metadata must use its per-artifact image identity and verified tag";
  const cases = [
    {
      expected: statusFinding,
      mutate: (subject) => {
        releaseImageStep(subject, "image-status").env.GHCR_TOKEN = "";
      },
    },
    {
      expected: statusFinding,
      mutate: (subject) => {
        releaseImageStep(subject, "image-status").run = "echo publish=true >> $GITHUB_OUTPUT";
      },
    },
    {
      expected: contextFinding,
      mutate: (subject) => {
        releaseImageStepByName(subject, "Package the closed Fixture 007 runtime context").run += " --artifact fixture-019";
      },
    },
    {
      expected: contextFinding,
      mutate: (subject) => {
        const packaging = releaseImageStepByName(subject, "Package the closed Fixture 007 runtime context");
        packaging.if = "success()";
      },
    },
    {
      expected: metadataFinding,
      mutate: (subject) => {
        releaseImageStep(subject, "fixture-007-image-metadata").with.images = "ghcr.io/example/shared";
      },
    },
    {
      expected: metadataFinding,
      mutate: (subject) => {
        releaseImageStep(subject, "fixture-007-image-metadata").with.tags += "type=raw,value=edge\n";
      },
    },
  ];
  for (const entry of cases) {
    assertWorkflowTamper("release", validateReleaseExperimentImageWorkflowObject, entry.mutate, entry.expected);
  }
});

test("release locks the Fixture 007 linux image build and attestation", () => {
  const buildFinding = ".github/workflows/release.yml: release must build the untagged linux/amd64 Fixture 007 candidate from its closed context";
  const attestationFinding = ".github/workflows/release.yml: Fixture 007 provenance must attest only its current-run build output";
  const cases = [
    {
      expected: buildFinding,
      mutate: (subject) => {
        releaseImageStep(subject, "build-fixture-007-image").with.context = ".";
      },
    },
    {
      expected: buildFinding,
      mutate: (subject) => {
        releaseImageStep(subject, "build-fixture-007-image").with.file = "tooling/Dockerfile";
      },
    },
    {
      expected: buildFinding,
      mutate: (subject) => {
        releaseImageStep(subject, "build-fixture-007-image").with.platforms = "linux/amd64,linux/arm64";
      },
    },
    {
      expected: buildFinding,
      mutate: (subject) => {
        releaseImageStep(subject, "build-fixture-007-image").with.tags = "latest";
      },
    },
    {
      expected: ".github/workflows/release.yml: Fixture 007 release image must keep its exact artifact, registry, tag, and revision arguments",
      mutate: (subject) => {
        releaseImageStep(subject, "build-fixture-007-image").with["build-args"] += "UNREVIEWED=true\n";
      },
    },
    {
      expected: ".github/workflows/release.yml: Fixture 007 release image must use its per-artifact cache scope",
      mutate: (subject) => {
        releaseImageStep(subject, "build-fixture-007-image").with["cache-to"] = "type=gha,mode=max,scope=experiments";
      },
    },
    {
      expected: attestationFinding,
      mutate: (subject) => {
        const attestation = subject.jobs.release.steps.find((step) => step.with?.["subject-name"]?.includes("fixture-007"));
        attestation.with["subject-name"] = "ghcr.io/example/shared";
      },
    },
    {
      expected: attestationFinding,
      mutate: (subject) => {
        const attestation = subject.jobs.release.steps.find((step) => step.with?.["subject-name"]?.includes("fixture-007"));
        attestation.with["subject-digest"] = "sha256:unbound";
      },
    },
    {
      expected: attestationFinding,
      mutate: (subject) => {
        const attestation = subject.jobs.release.steps.find((step) => step.with?.["subject-name"]?.includes("fixture-007"));
        attestation.if = "steps.release-preflight.outputs.release_state != 'published'";
      },
    },
  ];
  for (const entry of cases) {
    assertWorkflowTamper("release", validateReleaseExperimentImageWorkflowObject, entry.mutate, entry.expected);
  }
});

test("release pins the SBOM generator for every published container", () => {
  const cases = [
    {
      expected: ".github/workflows/release.yml: static 20w tooling image must use a separate untagged, admitted digest",
      id: "build-tooling-image",
    },
    {
      expected: ".github/workflows/release.yml: release must build the untagged linux/amd64 Fixture 007 candidate from its closed context",
      id: "build-fixture-007-image",
    },
    {
      expected: ".github/workflows/release.yml: release must build the untagged linux/amd64 Fixture 019 candidate",
      id: "build-fixture-019-image",
    },
  ];
  for (const entry of cases) {
    assertWorkflowTamper(
      "release",
      validateReleaseExperimentImageWorkflowObject,
      (subject) => {
        releaseImageStep(subject, entry.id).with.sbom = true;
      },
      entry.expected,
    );
  }
});

test("policy diagnostics are actionable", () => {
  const output = formatFindings(["file: reason"]);
  assert.match(output, /1 finding/u);
  assert.match(output, /- file: reason/u);
});
