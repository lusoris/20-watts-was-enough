import assert from "node:assert/strict";
import test from "node:test";

import {
  formatFindings,
  validateFundingConfig,
  validateIssueConfig,
  validateIssueForm,
  validateReleaseWorkflowObject,
  validateRepositoryPolicy,
  validateScientificRuntimeWorkflowObject,
  validateWorkflowObject,
} from "./validate-engineering-policy.mjs";

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
          uses: "actions/checkout@d23441a48e516b6c34aea4fa41551a30e30af803",
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

test("scientific workflows must provision the fixture-locked Python and NumPy runtime", () => {
  const lock = { python_version: "3.13.13", packages: { numpy: "2.4.6" } };
  const validSteps = [
    { uses: "actions/setup-python@ece7cb06caefa5fff74198d8649806c4678c61a1", with: { "python-version": "3.13.13" } },
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
    "workflow.yml: job quality must use locked Python 3.13.13",
    "workflow.yml: job quality must install hash-locked NumPy 2.4.6 without dependencies",
  ]);
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

  assert.equal(findings.length, 5);
  assert.match(findings[0], /origin\/main is unavailable/u);
  assert.match(findings[1], /contained in origin\/main/u);
  assert.match(findings[2], /triggering event SHA/u);
  assert.match(findings[3], /tag-bound PDF render/u);
  assert.match(findings[4], /must follow the tag-bound PDF render/u);
});

test("policy diagnostics are actionable", () => {
  const output = formatFindings(["file: reason"]);
  assert.match(output, /1 finding/u);
  assert.match(output, /- file: reason/u);
});
