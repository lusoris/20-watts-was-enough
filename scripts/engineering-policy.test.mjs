import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";

import { parse } from "yaml";

import {
  formatFindings,
  validateCiExperimentImageWorkflowObject,
  validateExperimentReportIdentity,
  validateFundingConfig,
  validateGoCodeQlWorkflowObject,
  validateGoRuntimeWorkflowObject,
  validateIssueConfig,
  validateIssueForm,
  validateJavaScriptRuntimeWorkflowObject,
  validateLabelSyncWorkflowObject,
  validateReleaseExperimentImageWorkflowObject,
  validateReleaseWorkflowObject,
  validateRetiredHostingPaths,
  validateRepositoryPolicy,
  validateScientificRuntimeLock,
  validateScientificRuntimeWorkflowObject,
  validateWorkflowObject,
} from "./validate-engineering-policy.mjs";

const workflow = (name) => parse(readFileSync(new URL(`../.github/workflows/${name}.yml`, import.meta.url), "utf8"));

function ciImageStep(subject, name) {
  return subject.jobs["experiment-image"].steps.find((step) => step.name === name);
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

test("the repository satisfies its engineering policy", () => {
  assert.deepEqual(validateRepositoryPolicy(), []);
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
    { run: "npm install --global npm@12.0.2" },
    { run: "npm ci" },
  ];
  assert.deepEqual(validateJavaScriptRuntimeWorkflowObject(
    { jobs: { quality: { steps: validSteps } } },
    "quality",
  ), []);

  const tampered = structuredClone(validSteps);
  tampered[0].with["node-version"] = "26.8.0";
  tampered[1].run = "npm install --global npm@latest";
  assert.deepEqual(validateJavaScriptRuntimeWorkflowObject(
    { jobs: { quality: { steps: tampered } } },
    "quality",
  ), [
    "workflow.yml: job quality must use Node 26.8.1 with the npm cache",
    "workflow.yml: job quality must install npm 12.0.2 after Node setup",
    "workflow.yml: job quality must run npm ci after installing the locked npm version",
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

test("label synchronization is manifest-triggered and least-privileged", () => {
  const valid = workflow("sync-labels");
  assert.deepEqual(validateLabelSyncWorkflowObject(valid), []);

  const tampered = structuredClone(valid);
  tampered.jobs.sync.permissions.contents = "write";
  assert.ok(validateLabelSyncWorkflowObject(tampered).includes(
    ".github/workflows/sync-labels.yml: label synchronization needs only contents:read and issues:write",
  ));

  const untrustedCheckout = structuredClone(valid);
  const checkout = untrustedCheckout.jobs.sync.steps.find(
    (step) => step.uses?.startsWith("actions/checkout@"),
  );
  checkout.with.ref = "refs/heads/feature";
  assert.ok(validateLabelSyncWorkflowObject(untrustedCheckout).includes(
    ".github/workflows/sync-labels.yml: manual label repair must still check out canonical main",
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
});

test("CI and release image policy preserve separate tooling and experiment identities", () => {
  const ciWorkflow = workflow("ci");
  const releaseWorkflow = workflow("release");
  assert.deepEqual(validateCiExperimentImageWorkflowObject(ciWorkflow), []);
  assert.deepEqual(validateReleaseExperimentImageWorkflowObject(releaseWorkflow), []);

  const sharedCiImage = structuredClone(ciWorkflow);
  const ciBuild = sharedCiImage.jobs["experiment-image"].steps.find((step) => (
    step.with?.tags === "20w-fixture-019:test"
  ));
  ciBuild.with.file = "experiments/workstation/Dockerfile";
  assert.ok(validateCiExperimentImageWorkflowObject(sharedCiImage).includes(
    ".github/workflows/ci.yml: experiment-image must build only the scoped Fixture 019 test image",
  ));

  const unnamedCiImage = structuredClone(ciWorkflow);
  const unnamedCiBuild = unnamedCiImage.jobs["experiment-image"].steps.find((step) => (
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
    ".github/workflows/ci.yml: experiment-image must build only the scoped Fixture 019 test image",
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

test("release tags remain absent until exact-digest admission and attestations can be repaired", () => {
  const buildFinding = ".github/workflows/release.yml: static 20w tooling image must use a separate untagged, admitted digest";
  const inspectionFinding = ".github/workflows/release.yml: exact candidate digests must pass authenticated platform and label inspection before admission";
  const repairFinding = ".github/workflows/release.yml: admitted digests must detect and repair missing source-bound attestations";
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
      expected: repairFinding,
      mutate: (subject) => {
        releaseImageStep(subject, "attestation-status").run = "echo tooling_repair=false >> $GITHUB_OUTPUT";
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
        const statusIndex = steps.findIndex((step) => step.id === "attestation-status");
        steps.splice(statusIndex + 1, 0, provenance);
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
  const buildFinding = ".github/workflows/ci.yml: experiment-image must build only the scoped Fixture 007 test image from its closed context";
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
  const attestationFinding = ".github/workflows/release.yml: Fixture 007 attestation repair must bind its admitted registry digest";
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
