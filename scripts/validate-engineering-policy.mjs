import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

import { parseDocument } from "yaml";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const defaultRoot = path.resolve(scriptDirectory, "..");

const requiredFiles = [
  ".editorconfig",
  ".gitleaks.toml",
  ".github/AGENTS.md",
  ".github/CODEOWNERS",
  ".github/PULL_REQUEST_TEMPLATE.md",
  ".github/ISSUE_TEMPLATE/config.yml",
  ".github/ISSUE_TEMPLATE/evidence-correction.yml",
  ".github/ISSUE_TEMPLATE/experiment-protocol-problem.yml",
  ".github/ISSUE_TEMPLATE/mechanism-principle-proposal.yml",
  ".github/ISSUE_TEMPLATE/site-documentation-problem.yml",
  ".github/labeler.yml",
  ".github/labels.yml",
  ".github/workflows/ci.yml",
  ".github/workflows/codeql.yml",
  ".github/workflows/github-pages.yml",
  ".github/workflows/labeler.yml",
  ".github/workflows/release.yml",
  ".github/workflows/scorecard.yml",
  "AGENTS.md",
  "CITATION.cff",
  "CLAUDE.md",
  "CODE_OF_CONDUCT.md",
  "CONTRIBUTING.md",
  "GOVERNANCE.md",
  "MAINTAINERS.md",
  "SECURITY.md",
  "SUPPORT.md",
  "app/AGENTS.md",
  "docs/principles.md",
  "experiments/AGENTS.md",
  "experiments/workstation/AGENTS.md",
  "research/AGENTS.md",
  "renovate.json",
  "scripts/AGENTS.md",
  "scripts/audit-code-shape.mjs",
  "scripts/audit-code-shape.test.mjs",
  "scripts/code-shape-baseline.json",
];

const workflowFiles = [
  ".github/workflows/ci.yml",
  ".github/workflows/codeql.yml",
  ".github/workflows/github-pages.yml",
  ".github/workflows/labeler.yml",
  ".github/workflows/release.yml",
  ".github/workflows/scorecard.yml",
];

const issueFormFiles = [
  ".github/ISSUE_TEMPLATE/evidence-correction.yml",
  ".github/ISSUE_TEMPLATE/experiment-protocol-problem.yml",
  ".github/ISSUE_TEMPLATE/mechanism-principle-proposal.yml",
  ".github/ISSUE_TEMPLATE/site-documentation-problem.yml",
];

const actionDigestPattern = /^[^\s@]+@[0-9a-f]{40}$/u;

function readText(root, relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

function parseYaml(root, relativePath, findings) {
  const source = readText(root, relativePath);
  const document = parseDocument(source, {
    prettyErrors: true,
    strict: true,
    uniqueKeys: true,
  });

  for (const error of document.errors) {
    findings.push(`${relativePath}: invalid YAML: ${error.message}`);
  }

  return document.errors.length === 0 ? document.toJS() : null;
}

function collectUses(value, location = "root", output = []) {
  if (Array.isArray(value)) {
    value.forEach((entry, index) => collectUses(entry, `${location}[${index}]`, output));
    return output;
  }

  if (!value || typeof value !== "object") {
    return output;
  }

  for (const [key, entry] of Object.entries(value)) {
    const nextLocation = `${location}.${key}`;
    if (key === "uses" && typeof entry === "string") {
      output.push({ location: nextLocation, value: entry });
    }
    collectUses(entry, nextLocation, output);
  }

  return output;
}

export function validateWorkflowObject(workflow, relativePath = "workflow.yml") {
  const findings = [];

  if (!workflow || typeof workflow !== "object") {
    return [`${relativePath}: workflow root must be a mapping`];
  }

  if (!workflow.permissions || typeof workflow.permissions !== "object") {
    findings.push(`${relativePath}: declare explicit top-level permissions`);
  }

  const jobs = workflow.jobs;
  if (!jobs || typeof jobs !== "object" || Array.isArray(jobs)) {
    findings.push(`${relativePath}: jobs must be a non-empty mapping`);
  } else {
    for (const [jobName, job] of Object.entries(jobs)) {
      if (!job || typeof job !== "object" || Array.isArray(job)) {
        findings.push(`${relativePath}: job ${jobName} must be a mapping`);
        continue;
      }
      if (!Number.isFinite(job["timeout-minutes"]) || job["timeout-minutes"] <= 0) {
        findings.push(`${relativePath}: job ${jobName} needs a positive timeout-minutes`);
      }
    }
  }

  for (const action of collectUses(workflow)) {
    if (action.value.startsWith("./")) {
      continue;
    }
    if (!actionDigestPattern.test(action.value)) {
      findings.push(
        `${relativePath}: ${action.location} must pin an external action to a full commit SHA; got ${action.value}`,
      );
    }
  }

  return findings;
}

export function validateReleaseWorkflowObject(
  workflow,
  relativePath = ".github/workflows/release.yml",
) {
  const findings = [];
  const releaseRefStep = workflow?.jobs?.verify?.steps?.find(
    (step) => step?.id === "release-ref",
  );
  const source = releaseRefStep?.run;
  if (typeof source !== "string") {
    return [`${relativePath}: verify job needs the release-ref ancestry step`];
  }
  if (!source.includes("git show-ref --verify --quiet refs/remotes/origin/main")) {
    findings.push(`${relativePath}: release-ref must fail closed when origin/main is unavailable`);
  }
  if (!source.includes('git merge-base --is-ancestor "$release_commit" refs/remotes/origin/main')) {
    findings.push(`${relativePath}: tagged release commits must be contained in origin/main`);
  }
  if (!source.includes('git rev-parse "${EVENT_SHA}^{commit}"')) {
    findings.push(`${relativePath}: tag-push releases must bind the triggering event SHA`);
  }
  const steps = workflow?.jobs?.verify?.steps ?? [];
  const renderIndex = steps.findIndex((step) => (
    typeof step?.run === "string"
    && step.run.includes('npm run generate:book-pdf -- --ref "$RELEASE_TAG"')
  ));
  const prepareIndex = steps.findIndex((step) => (
    typeof step?.run === "string"
    && step.run.includes('npm run prepare:release -- --tag "$RELEASE_TAG"')
  ));
  if (renderIndex < 0) {
    findings.push(`${relativePath}: release assets require a tag-bound PDF render`);
  }
  if (prepareIndex < 0 || prepareIndex <= renderIndex) {
    findings.push(`${relativePath}: release preparation must follow the tag-bound PDF render`);
  }
  return findings;
}

export function validateIssueForm(form, relativePath = "issue-form.yml") {
  const findings = [];
  const requiredStrings = ["name", "description", "title"];

  if (!form || typeof form !== "object") {
    return [`${relativePath}: issue form root must be a mapping`];
  }

  for (const key of requiredStrings) {
    if (typeof form[key] !== "string" || form[key].trim().length === 0) {
      findings.push(`${relativePath}: ${key} must be a non-empty string`);
    }
  }

  if (!Array.isArray(form.body) || form.body.length === 0) {
    findings.push(`${relativePath}: body must be a non-empty sequence`);
    return findings;
  }

  const ids = new Set();
  for (const [index, item] of form.body.entries()) {
    if (!item || typeof item !== "object") {
      findings.push(`${relativePath}: body[${index}] must be a mapping`);
      continue;
    }
    if (item.id === undefined) {
      continue;
    }
    if (typeof item.id !== "string" || !/^[a-z][a-z0-9_-]*$/u.test(item.id)) {
      findings.push(`${relativePath}: body[${index}].id is invalid`);
      continue;
    }
    if (ids.has(item.id)) {
      findings.push(`${relativePath}: duplicate field id ${item.id}`);
    }
    ids.add(item.id);
  }

  return findings;
}

function validatePackage(root, findings) {
  const relativePath = "package.json";
  let manifest;
  try {
    manifest = JSON.parse(readText(root, relativePath));
  } catch (error) {
    findings.push(`${relativePath}: invalid JSON: ${error.message}`);
    return;
  }

  const scripts = manifest.scripts ?? {};
  for (const script of [
    "check",
    "check:code-shape",
    "test:code-shape",
    "test:release",
    "typecheck",
    "validate:policy",
    "test:policy",
  ]) {
    if (typeof scripts[script] !== "string" || scripts[script].trim().length === 0) {
      findings.push(`${relativePath}: missing required script ${script}`);
    }
  }

  for (const [name, command] of Object.entries(scripts)) {
    if (typeof command === "string" && command.includes("--test-isolation=")) {
      findings.push(
        `${relativePath}: script ${name} uses --test-isolation, which is unavailable on the declared Node 22 baseline; use --experimental-test-isolation`,
      );
    }
  }

  const exactVersion = /^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/u;
  for (const section of ["dependencies", "devDependencies"]) {
    for (const [name, version] of Object.entries(manifest[section] ?? {})) {
      if (typeof version !== "string" || !exactVersion.test(version)) {
        findings.push(`${relativePath}: ${section}.${name} must use an exact version; got ${JSON.stringify(version)}`);
      }
    }
  }

  if (manifest.private !== true) {
    findings.push(`${relativePath}: private must remain true to prevent accidental npm publication`);
  }
  if (manifest.license !== "SEE LICENSE IN LICENSING.md") {
    findings.push(`${relativePath}: split licensing must point to LICENSING.md`);
  }
}

function validatePrinciples(root, findings) {
  const relativePath = "docs/principles.md";
  const source = readText(root, relativePath);
  for (let rule = 1; rule <= 10; rule += 1) {
    if (!source.includes(`**P10-${rule}**`)) {
      findings.push(`${relativePath}: missing adapted rule P10-${rule}`);
    }
  }

  for (const heading of [
    "Scientific integrity contract",
    "Experiment and reproducibility contract",
    "Software and supply-chain contract",
    "Repository and release contract",
    "Licensing contract",
  ]) {
    if (!source.includes(heading)) {
      findings.push(`${relativePath}: missing section ${heading}`);
    }
  }
}

function validateRenovate(root, findings) {
  const relativePath = "renovate.json";
  let config;
  try {
    config = JSON.parse(readText(root, relativePath));
  } catch (error) {
    findings.push(`${relativePath}: invalid JSON: ${error.message}`);
    return;
  }

  const rules = Array.isArray(config.packageRules) ? config.packageRules : [];
  if (rules.some((rule) => rule?.automerge === true)) {
    findings.push(`${relativePath}: automerge stays disabled until required CI and repository rules are verified`);
  }
  if (!config.timezone || config.timezone !== "Europe/Berlin") {
    findings.push(`${relativePath}: timezone must be Europe/Berlin`);
  }
}

function validateLabels(root, findings, issueForms) {
  const manifestPath = ".github/labels.yml";
  const manifest = parseYaml(root, manifestPath, findings);
  if (!Array.isArray(manifest) || manifest.length === 0) {
    findings.push(`${manifestPath}: label manifest must be a non-empty sequence`);
    return;
  }

  const labels = new Set();
  for (const [index, label] of manifest.entries()) {
    if (!label || typeof label !== "object" || typeof label.name !== "string") {
      findings.push(`${manifestPath}: entry ${index} needs a string name`);
      continue;
    }
    if (labels.has(label.name)) {
      findings.push(`${manifestPath}: duplicate label ${label.name}`);
    }
    labels.add(label.name);
    if (typeof label.color !== "string" || !/^[0-9a-f]{6}$/iu.test(label.color)) {
      findings.push(`${manifestPath}: label ${label.name} needs a six-digit color`);
    }
  }

  const labelerPath = ".github/labeler.yml";
  const labeler = parseYaml(root, labelerPath, findings);
  if (!labeler || typeof labeler !== "object" || Array.isArray(labeler)) {
    findings.push(`${labelerPath}: path labeler must be a mapping`);
  } else {
    for (const label of Object.keys(labeler)) {
      if (!labels.has(label)) {
        findings.push(`${labelerPath}: path rule references undefined label ${label}`);
      }
    }
  }

  for (const [relativePath, form] of issueForms) {
    const formLabels = Array.isArray(form?.labels) ? form.labels : [];
    for (const label of formLabels) {
      if (!labels.has(label)) {
        findings.push(`${relativePath}: issue form references undefined label ${label}`);
      }
    }
  }
}

export function validateRepositoryPolicy(root = defaultRoot) {
  const findings = [];

  for (const relativePath of requiredFiles) {
    if (!fs.existsSync(path.join(root, relativePath))) {
      findings.push(`${relativePath}: required policy surface is missing`);
    }
  }

  if (findings.some((finding) => finding.includes("required policy surface is missing"))) {
    return findings;
  }

  validatePackage(root, findings);
  validatePrinciples(root, findings);
  validateRenovate(root, findings);

  for (const relativePath of workflowFiles) {
    const workflow = parseYaml(root, relativePath, findings);
    if (workflow) {
      findings.push(...validateWorkflowObject(workflow, relativePath));
      if (relativePath === ".github/workflows/release.yml") {
        findings.push(...validateReleaseWorkflowObject(workflow, relativePath));
      }
    }
  }

  const issueForms = [];
  for (const relativePath of issueFormFiles) {
    const form = parseYaml(root, relativePath, findings);
    if (form) {
      issueForms.push([relativePath, form]);
      findings.push(...validateIssueForm(form, relativePath));
    }
  }

  validateLabels(root, findings, issueForms);

  const issueConfig = parseYaml(root, ".github/ISSUE_TEMPLATE/config.yml", findings);
  if (issueConfig?.blank_issues_enabled !== false) {
    findings.push(".github/ISSUE_TEMPLATE/config.yml: blank issues must remain disabled");
  }

  const citation = parseYaml(root, "CITATION.cff", findings);
  if (citation?.["cff-version"] !== "1.2.0") {
    findings.push("CITATION.cff: cff-version must be 1.2.0");
  }
  if (citation?.["repository-code"] !== "https://github.com/lusoris/20-watts-was-enough") {
    findings.push("CITATION.cff: repository-code must name the canonical repository");
  }

  const codeowners = readText(root, ".github/CODEOWNERS");
  if (!codeowners.includes("@lusoris")) {
    findings.push(".github/CODEOWNERS: @lusoris must own the repository policy surface");
  }

  const gitleaks = readText(root, ".gitleaks.toml");
  if (!/^\s*useDefault\s*=\s*true\s*$/mu.test(gitleaks)) {
    findings.push(".gitleaks.toml: extend the default gitleaks ruleset");
  }

  return findings;
}

export function formatFindings(findings) {
  if (findings.length === 0) {
    return "Engineering policy validation passed.";
  }
  return [
    `Engineering policy validation failed with ${findings.length} finding(s):`,
    ...findings.map((finding) => `- ${finding}`),
  ].join("\n");
}

function main() {
  const findings = validateRepositoryPolicy(defaultRoot);
  console.log(formatFindings(findings));
  if (findings.length > 0) {
    process.exitCode = 1;
  }
}

const invokedPath = process.argv[1] ? pathToFileURL(path.resolve(process.argv[1])).href : "";
if (invokedPath === import.meta.url) {
  main();
}
