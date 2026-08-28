import assert from "node:assert/strict";
import test from "node:test";

import {
  formatFindings,
  validateIssueForm,
  validateReleaseWorkflowObject,
  validateRepositoryPolicy,
  validateWorkflowObject,
} from "./validate-engineering-policy.mjs";

test("the repository satisfies its engineering policy", () => {
  assert.deepEqual(validateRepositoryPolicy(), []);
});

test("workflow validation rejects mutable actions and unbounded jobs", () => {
  const findings = validateWorkflowObject({
    permissions: { contents: "read" },
    jobs: {
      unsafe: {
        "runs-on": "ubuntu-latest",
        steps: [{ uses: "actions/checkout@v6" }],
      },
    },
  });

  assert.equal(findings.length, 2);
  assert.match(findings[0], /timeout-minutes/u);
  assert.match(findings[1], /full commit SHA/u);
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
