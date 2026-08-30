import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

import { parseDocument } from "yaml";

import { REQUIRED_NODE_VERSION } from "../experiments/workstation/lib/node-runtime-policy.mjs";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const defaultRoot = path.resolve(scriptDirectory, "..");

const runtimePolicy = Object.freeze({
  goVersion: "1.27.0",
  nodeVersion: REQUIRED_NODE_VERSION,
  npmVersion: "12.0.2",
  numpyDigest: "318b9a4c845dbea06708a29c84ee429cc3065048db34cdb799047643492050ee",
  numpyFilename: "numpy-2.5.2-cp314-cp314-manylinux_2_27_x86_64.manylinux_2_28_x86_64.whl",
  numpyVersion: "2.5.2",
  pythonImplementation: "CPython",
  pythonVersion: "3.14.7",
});

const sbomGenerator = "generator=docker.io/docker/buildkit-syft-scanner@sha256:ae4f3b554449e7e25548e7d8ccc029d17357348e30c6e3df01b92bc93654d6a9";

const buildxPolicy = Object.freeze({
  buildkit: "image=moby/buildkit:v0.32.2@sha256:28a898719c18a33f4e8000685287fa36fd0dd9560c6440227d3a732d79bb41d8",
  version: "v0.36.1",
});

const fixture007ImagePolicy = Object.freeze({
  cacheFrom: "type=gha,scope=fixture-007-image",
  cacheTo: "type=gha,mode=max,scope=fixture-007-image",
  ciBuildArgs: [
    "EXPERIMENT_ARTIFACT=fixture-007",
    "IMAGE_NAME=ghcr.io/${{ github.repository }}-fixture-007",
    "IMAGE_VERSION=development",
    "SOURCE_REVISION=${{ github.sha }}",
  ].join("\n") + "\n",
  ciTag: "20w-fixture-007:test",
  condition: "steps.image-status.outputs.fixture007_publish == 'true'",
  context: "build/container-contexts/fixture-007",
  dockerfile: "experiments/workstation/Dockerfile.node-artifact",
  imageName: "ghcr.io/${{ github.repository }}-fixture-007",
  packageCommand: "go -C tooling run ./cmd/20w experiment package-node-image --root .. --artifact fixture-007 --output ../build/container-contexts/fixture-007",
  releaseBuildArgs: [
    "EXPERIMENT_ARTIFACT=fixture-007",
    "IMAGE_NAME=ghcr.io/${{ github.repository }}-fixture-007",
    "IMAGE_VERSION=${{ needs.verify.outputs.release-tag }}",
    "SOURCE_REVISION=${{ needs.verify.outputs.release-commit }}",
  ].join("\n") + "\n",
  releaseTag: "type=raw,value=${{ needs.verify.outputs.release-tag }}",
});

const fixture019ImagePolicy = Object.freeze({
  condition: "steps.image-status.outputs.fixture019_publish == 'true'",
  context: "build/container-contexts/fixture-019",
  dockerfile: "experiments/workstation/fixture-019/Dockerfile",
  packageCommand: "go -C tooling run ./cmd/20w experiment package-node-image --root .. --artifact fixture-019 --output ../build/container-contexts/fixture-019",
});

const approvedActionPins = new Map([
  ["actions/attest-build-provenance", "4d101475d8b20a2381f78447822ac1eab6504dd8"],
  ["actions/checkout", "3d3c42e5aac5ba805825da76410c181273ba90b1"],
  ["actions/configure-pages", "45bfe0192ca1faeb007ade9deae92b16b8254a0d"],
  ["actions/dependency-review-action", "a1d282b36b6f3519aa1f3fc636f609c47dddb294"],
  ["actions/deploy-pages", "cd2ce8fcbc39b97be8ca5fce6e763baed58fa128"],
  ["actions/download-artifact", "3e5f45b2cfb9172054b4087a40e8e0b5a5461e7c"],
  ["actions/labeler", "bf12e9b00b37c5c0ca2b87b79b2daf7891dbda13"],
  ["actions/setup-go", "b7ad1dad31e06c5925ef5d2fc7ad053ef454303e"],
  ["actions/setup-node", "820762786026740c76f36085b0efc47a31fe5020"],
  ["actions/setup-python", "5fda3b95a4ea91299a34e894583c3862153e4b97"],
  ["actions/upload-artifact", "043fb46d1a93c77aae656e7c1c64a875d1fc6a0a"],
  ["actions/upload-pages-artifact", "fc324d3547104276b827a68afc52ff2a11cc49c9"],
  ["docker/build-push-action", "53b7df96c91f9c12dcc8a07bcb9ccacbed38856a"],
  ["docker/login-action", "dbcb813823bdd20940b903addbd779551569679f"],
  ["docker/metadata-action", "dc802804100637a589fabce1cb79ff13a1411302"],
  ["docker/setup-buildx-action", "37fe631027851001ddb9b187196cc803df7f5f0e"],
  ["github/codeql-action/analyze", "cdf488f595d80d6e07e03d4674febd5ab45fa938"],
  ["github/codeql-action/init", "cdf488f595d80d6e07e03d4674febd5ab45fa938"],
  ["github/codeql-action/upload-sarif", "cdf488f595d80d6e07e03d4674febd5ab45fa938"],
  ["ossf/scorecard-action", "2d1146689b8cda280b9bc96326124645441f03bc"],
]);

const requiredFiles = [
  ".agents/skills/research-writing/SKILL.md",
  ".dockerignore",
  ".editorconfig",
  ".gitleaks.toml",
  ".github/AGENTS.md",
  ".github/CODEOWNERS",
  ".github/FUNDING.yml",
  ".github/PULL_REQUEST_TEMPLATE.md",
  ".github/ISSUE_TEMPLATE/config.yml",
  ".github/ISSUE_TEMPLATE/evidence-correction.yml",
  ".github/ISSUE_TEMPLATE/experiment-protocol-problem.yml",
  ".github/ISSUE_TEMPLATE/mechanism-principle-proposal.yml",
  ".github/ISSUE_TEMPLATE/repository-tooling-problem.yml",
  ".github/ISSUE_TEMPLATE/site-documentation-problem.yml",
  ".github/ISSUE_TEMPLATE/translation-problem.yml",
  ".github/labeler.yml",
  ".github/labels.json",
  ".github/workflows/ci.yml",
  ".github/workflows/codeql.yml",
  ".github/workflows/github-pages.yml",
  ".github/workflows/labeler.yml",
  ".github/workflows/release.yml",
  ".github/workflows/scorecard.yml",
  ".github/workflows/sync-labels.yml",
  "AGENTS.md",
  "CITATION.cff",
  "CLAUDE.md",
  "CODE_OF_CONDUCT.md",
  "CONTRIBUTING.md",
  "docs/repository-map.md",
  "GOVERNANCE.md",
  "MAINTAINERS.md",
  "SECURITY.md",
  "SUPPORT.md",
  "app/AGENTS.md",
  "docs/principles.md",
  "experiments/AGENTS.md",
  "experiments/workstation/AGENTS.md",
  "experiments/workstation/Dockerfile.node-artifact",
  "experiments/workstation/fixture-019/Dockerfile",
  "experiments/workstation/fixture-019/python-environment.lock.json",
  "experiments/workstation/lib/execution-receipt.mjs",
  "experiments/workstation/lib/node-runtime-policy.mjs",
  "research/AGENTS.md",
  "research/disclosures/README.md",
  "research/disclosures/v0.2.0.md",
  "research/research-integrity-baseline.md",
  "renovate.json",
  "requirements-ci.txt",
  "scripts/AGENTS.md",
  "scripts/audit-code-shape.mjs",
  "scripts/audit-code-shape.test.mjs",
  "scripts/audit-prose-style.mjs",
  "scripts/audit-prose-style.test.mjs",
  "scripts/code-shape-baseline.json",
  "scripts/validate-node-runtime.mjs",
  "tooling/AGENTS.md",
  "tooling/Dockerfile",
  "tooling/cmd/20w/main.go",
  "tooling/cmd/build-release/main.go",
  "tooling/go.mod",
  "tooling/go.sum",
  "tooling/internal/githublabels/labels.go",
];

const forbiddenLegacyHostingPaths = [
  ".openai/hosting.json",
  "app/content.ts",
  "app/layout.tsx",
  "app/lib/machine-translation.mjs",
  "app/page.tsx",
  "app/readiness/page.tsx",
  "build/sites-vite-plugin.ts",
  "next-env.d.ts",
  "next.config.ts",
  "scripts/validate-book-route-build.mjs",
  "vite.config.ts",
  "worker/index.ts",
];

const workflowFiles = [
  ".github/workflows/ci.yml",
  ".github/workflows/codeql.yml",
  ".github/workflows/github-pages.yml",
  ".github/workflows/labeler.yml",
  ".github/workflows/release.yml",
  ".github/workflows/scorecard.yml",
  ".github/workflows/sync-labels.yml",
];

const issueFormFiles = [
  ".github/ISSUE_TEMPLATE/evidence-correction.yml",
  ".github/ISSUE_TEMPLATE/experiment-protocol-problem.yml",
  ".github/ISSUE_TEMPLATE/mechanism-principle-proposal.yml",
  ".github/ISSUE_TEMPLATE/repository-tooling-problem.yml",
  ".github/ISSUE_TEMPLATE/site-documentation-problem.yml",
  ".github/ISSUE_TEMPLATE/translation-problem.yml",
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

function validateWorkflowJob(job, jobName, relativePath) {
  const findings = [];
  if (!job || typeof job !== "object" || Array.isArray(job)) {
    return [`${relativePath}: job ${jobName} must be a mapping`];
  }
  if (!Number.isFinite(job["timeout-minutes"]) || job["timeout-minutes"] <= 0) {
    findings.push(`${relativePath}: job ${jobName} needs a positive timeout-minutes`);
  }
  for (const [stepIndex, step] of (job.steps ?? []).entries()) {
    if (
      typeof step?.uses === "string"
      && step.uses.startsWith("actions/checkout@")
      && step.with?.["persist-credentials"] !== false
    ) {
      findings.push(`${relativePath}: job ${jobName} step ${stepIndex} must set checkout persist-credentials to false`);
    }
  }
  return findings;
}

export function validateWorkflowObject(workflow, relativePath = "workflow.yml") {
  const findings = [];

  if (!workflow || typeof workflow !== "object") {
    return [`${relativePath}: workflow root must be a mapping`];
  }

  if (!workflow.permissions || typeof workflow.permissions !== "object") {
    findings.push(`${relativePath}: declare explicit top-level permissions`);
  } else if (Object.values(workflow.permissions).includes("write")) {
    findings.push(`${relativePath}: top-level permissions must not grant write access`);
  }

  if (
    !workflow.concurrency
    || typeof workflow.concurrency !== "object"
    || typeof workflow.concurrency.group !== "string"
    || workflow.concurrency.group.trim().length === 0
    || typeof workflow.concurrency["cancel-in-progress"] !== "boolean"
  ) {
    findings.push(`${relativePath}: concurrency must define a group and explicit cancel-in-progress boolean`);
  }

  const jobs = workflow.jobs;
  if (!jobs || typeof jobs !== "object" || Array.isArray(jobs)) {
    findings.push(`${relativePath}: jobs must be a non-empty mapping`);
  } else {
    for (const [jobName, job] of Object.entries(jobs)) {
      findings.push(...validateWorkflowJob(job, jobName, relativePath));
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
      continue;
    }
    const separator = action.value.lastIndexOf("@");
    const identity = action.value.slice(0, separator);
    const digest = action.value.slice(separator + 1);
    const approvedDigest = approvedActionPins.get(identity);
    if (approvedDigest === undefined) {
      findings.push(`${relativePath}: ${action.location} uses unapproved external action ${identity}`);
    } else if (digest !== approvedDigest) {
      findings.push(
        `${relativePath}: ${action.location} must use the approved ${identity}@${approvedDigest} pin; got ${action.value}`,
      );
    }
  }

  return findings;
}

export function validateScientificRuntimeWorkflowObject(
  workflow,
  lock,
  jobName,
  relativePath = "workflow.yml",
) {
  const findings = [];
  const steps = workflow?.jobs?.[jobName]?.steps;
  if (!Array.isArray(steps)) {
    return [`${relativePath}: job ${jobName} must provision the locked scientific runtime`];
  }
  const pythonVersion = lock?.python_version;
  const numpyVersion = lock?.packages?.numpy;
  const setup = steps.find((step) => step?.uses?.startsWith("actions/setup-python@"));
  if (setup?.with?.["python-version"] !== pythonVersion) {
    findings.push(`${relativePath}: job ${jobName} must use locked Python ${pythonVersion}`);
  }
  const install = steps.find((step) => (
    typeof step?.run === "string" && step.run.includes("python -m pip install")
  ));
  const expectedInstall = "python -m pip install --disable-pip-version-check --no-deps --require-hashes -r requirements-ci.txt";
  if (install?.run?.trim() !== expectedInstall) {
    findings.push(`${relativePath}: job ${jobName} must install hash-locked NumPy ${numpyVersion} without dependencies`);
  }
  return findings;
}

export function validateScientificRuntimeLock(
  lock,
  relativePath = "experiments/workstation/fixture-019/python-environment.lock.json",
) {
  const findings = [];
  if (!lock || typeof lock !== "object" || Array.isArray(lock)) {
    return [`${relativePath}: scientific runtime lock must be a mapping`];
  }
  const expectedFields = [
    ["schema", 1],
    ["artifact", "fixture-019"],
    ["python_implementation", runtimePolicy.pythonImplementation],
    ["python_version", runtimePolicy.pythonVersion],
    ["bit_generator", "PCG64DXSM"],
    ["network_install_during_run", false],
  ];
  for (const [field, expected] of expectedFields) {
    if (lock[field] !== expected) {
      findings.push(`${relativePath}: ${field} must be ${JSON.stringify(expected)}`);
    }
  }
  const expectedKeys = new Set([
    "artifact",
    "bit_generator",
    "network_install_during_run",
    "package_artifacts",
    "packages",
    "python_implementation",
    "python_version",
    "schema",
  ]);
  if (
    Object.keys(lock).length !== expectedKeys.size
    || Object.keys(lock).some((key) => !expectedKeys.has(key))
  ) {
    findings.push(`${relativePath}: scientific runtime lock contains an unknown or missing field`);
  }
  if (
    !lock.packages
    || typeof lock.packages !== "object"
    || Array.isArray(lock.packages)
    || Object.keys(lock.packages).length !== 1
    || lock.packages.numpy !== runtimePolicy.numpyVersion
  ) {
    findings.push(`${relativePath}: packages must contain only NumPy ${runtimePolicy.numpyVersion}`);
  }
  const numpyArtifact = lock.package_artifacts?.numpy;
  if (
    !lock.package_artifacts
    || typeof lock.package_artifacts !== "object"
    || Array.isArray(lock.package_artifacts)
    || Object.keys(lock.package_artifacts).length !== 1
    || numpyArtifact?.filename !== runtimePolicy.numpyFilename
    || numpyArtifact?.sha256 !== runtimePolicy.numpyDigest
  ) {
    findings.push(
      `${relativePath}: NumPy ${runtimePolicy.numpyVersion} must use the approved CPython 3.14 Linux x86_64 wheel and SHA-256 digest`,
    );
  }
  return findings;
}

function validateScientificRequirements(root, findings) {
  const relativePath = "requirements-ci.txt";
  const numpyVersion = runtimePolicy.numpyVersion;
  const numpyDigest = runtimePolicy.numpyDigest;
  const [pythonMajor, pythonMinor] = runtimePolicy.pythonVersion.split(".");
  const expected = [
    `# CPython ${pythonMajor}.${pythonMinor} / Linux x86_64 scientific runtime used by GitHub-hosted jobs.`,
    `# The artifact digest is published by PyPI for NumPy ${numpyVersion}.`,
    `numpy==${numpyVersion} \\`,
    `    --hash=sha256:${numpyDigest}`,
    "",
  ].join("\n");
  if (readText(root, relativePath).replaceAll("\r\n", "\n") !== expected) {
    findings.push(`${relativePath}: must bind locked NumPy ${numpyVersion} to its approved PyPI artifact digest`);
  }
}

export function validateJavaScriptRuntimeWorkflowObject(
  workflow,
  jobName,
  relativePath = "workflow.yml",
) {
  const findings = [];
  const steps = workflow?.jobs?.[jobName]?.steps;
  if (!Array.isArray(steps)) {
    return [`${relativePath}: job ${jobName} must provision the locked Node and npm runtime`];
  }
  const setupIndex = steps.findIndex((step) => step?.uses?.startsWith("actions/setup-node@"));
  const npmIndex = steps.findIndex((step) => step?.run?.trim() === (
    `npm install --global npm@${runtimePolicy.npmVersion}`
  ));
  const installIndex = steps.findIndex((step) => step?.run?.trim() === "npm ci");
  const setup = setupIndex >= 0 ? steps[setupIndex] : undefined;
  if (
    setup?.with?.["node-version"] !== runtimePolicy.nodeVersion
    || setup?.with?.cache !== "npm"
  ) {
    findings.push(
      `${relativePath}: job ${jobName} must use Node ${runtimePolicy.nodeVersion} with the npm cache`,
    );
  }
  if (npmIndex < 0 || npmIndex <= setupIndex) {
    findings.push(
      `${relativePath}: job ${jobName} must install npm ${runtimePolicy.npmVersion} after Node setup`,
    );
  }
  if (installIndex < 0 || npmIndex < 0 || installIndex <= npmIndex) {
    findings.push(`${relativePath}: job ${jobName} must run npm ci after installing the locked npm version`);
  }
  return findings;
}

export function validateGoRuntimeWorkflowObject(
  workflow,
  jobName,
  relativePath = "workflow.yml",
) {
  const findings = [];
  const steps = workflow?.jobs?.[jobName]?.steps;
  if (!Array.isArray(steps)) {
    return [`${relativePath}: job ${jobName} must provision the locked Go runtime`];
  }
  const setup = steps.find((step) => step?.uses?.startsWith("actions/setup-go@"));
  if (
    setup?.with?.["go-version-file"] !== "tooling/go.mod"
    || setup?.with?.["cache-dependency-path"] !== "tooling/go.sum"
  ) {
    findings.push(
      `${relativePath}: job ${jobName} must use Go ${runtimePolicy.goVersion} from tooling/go.mod with tooling/go.sum caching`,
    );
  }
  return findings;
}

export function validateGoCodeQlWorkflowObject(
  workflow,
  relativePath = ".github/workflows/codeql.yml",
) {
  const findings = validateGoRuntimeWorkflowObject(workflow, "analyze-go", relativePath);
  const steps = workflow?.jobs?.["analyze-go"]?.steps ?? [];
  const initialize = steps.find((step) => step?.uses?.startsWith("github/codeql-action/init@"));
  const analyze = steps.find((step) => step?.uses?.startsWith("github/codeql-action/analyze@"));
  if (initialize?.with?.languages !== "go" || initialize?.with?.["build-mode"] !== "autobuild") {
    findings.push(`${relativePath}: analyze-go must initialize CodeQL autobuild for Go`);
  }
  if (analyze?.with?.category !== "/language:go") {
    findings.push(`${relativePath}: analyze-go must publish the /language:go category`);
  }
  return findings;
}

export function validateLabelSyncWorkflowObject(
  workflow,
  relativePath = ".github/workflows/sync-labels.yml",
) {
  const findings = validateGoRuntimeWorkflowObject(workflow, "sync", relativePath);
  const trigger = workflow?.on;
  const push = trigger?.push;
  if (
    !arrayIncludes(push?.branches, "main")
    || !arrayIncludes(push?.paths, ".github/labels.json")
    || !Object.prototype.hasOwnProperty.call(trigger ?? {}, "workflow_dispatch")
  ) {
    findings.push(`${relativePath}: label synchronization must run for the canonical manifest on main and allow manual repair`);
  }
  const job = workflow?.jobs?.sync;
  if (
    !propertiesMatch(job?.permissions, { contents: "read", issues: "write" })
    || Object.keys(job?.permissions ?? {}).length !== 2
  ) {
    findings.push(`${relativePath}: label synchronization needs only contents:read and issues:write`);
  }
  const checkout = (job?.steps ?? []).find((step) => actionUses(step, "actions/checkout"));
  if (checkout?.with?.ref !== "refs/heads/main") {
    findings.push(`${relativePath}: manual label repair must still check out canonical main`);
  }
  const synchronization = findStepByRunFragment(
    job?.steps ?? [],
    "github sync-labels --root .. --repository",
  );
  if (
    synchronization?.run !== 'go -C tooling run ./cmd/20w github sync-labels --root .. --repository "$GITHUB_REPOSITORY"'
    || synchronization?.env?.GH_TOKEN !== "${{ github.token }}"
  ) {
    findings.push(`${relativePath}: the trusted Go command must apply the canonical labels with the job token`);
  }
  return findings;
}

function validateReleaseRefSource(source, relativePath) {
  const findings = [];
  const expectations = [
    [
      source.includes("git show-ref --verify --quiet refs/remotes/origin/main"),
      `${relativePath}: release-ref must fail closed when origin/main is unavailable`,
    ],
    [
      source.includes('git merge-base --is-ancestor "$release_commit" refs/remotes/origin/main'),
      `${relativePath}: tagged release commits must be contained in origin/main`,
    ],
    [
      source.includes('git rev-parse "${EVENT_SHA}^{commit}"'),
      `${relativePath}: tag-push releases must bind the triggering event SHA`,
    ],
    [
      source.includes('"$EVENT_REF" != "refs/tags/${RELEASE_TAG}"')
        && source.includes('"$event_commit" != "$release_commit"'),
      `${relativePath}: release runs must bind the exact tag ref and commit`,
    ],
  ];
  for (const [accepted, message] of expectations) {
    if (!accepted) findings.push(message);
  }
  return findings;
}

function findRunStepIndex(steps, fragments) {
  return steps.findIndex((step) => (
    typeof step?.run === "string"
    && fragments.every((fragment) => step.run.includes(fragment))
  ));
}

function releaseVerificationStepIndices(steps) {
  return {
    binary: findRunStepIndex(steps, ["go -C tooling run ./cmd/build-release"]),
    execute: findRunStepIndex(steps, [
      "./build/release-inputs/20w-linux-amd64 version --json",
      "experiment release-plan --root .. --json",
    ]),
    prepare: findRunStepIndex(steps, ['npm run prepare:release -- --tag "$RELEASE_TAG"']),
    render: findRunStepIndex(steps, ['npm run generate:book-pdf -- --ref "$RELEASE_TAG"']),
  };
}

function validateNativeReleaseBuild(steps, indices, relativePath) {
  const findings = [];
  if (indices.render < 0) {
    findings.push(`${relativePath}: release assets require a tag-bound PDF render`);
  }
  const binaryStep = indices.binary >= 0 ? steps[indices.binary] : undefined;
  if (indices.binary < 0 || indices.binary <= indices.render) {
    findings.push(`${relativePath}: native 20w binaries must be built after the tag-bound PDF render`);
    return findings;
  }
  for (const fragment of [
    'source_timestamp="$(git show -s --format=%cI "$RELEASE_COMMIT")"',
    '--version "$RELEASE_TAG"',
    '--revision "$RELEASE_COMMIT"',
    '--built-at "$source_timestamp"',
    "--output-root ../build/release-inputs",
  ]) {
    if (!binaryStep.run.includes(fragment)) {
      findings.push(`${relativePath}: native binary build must include ${fragment}`);
    }
  }
  if (
    binaryStep.env?.RELEASE_COMMIT !== "${{ steps.release-ref.outputs.commit }}"
    || binaryStep.env?.RELEASE_TAG !== "${{ steps.release-ref.outputs.tag }}"
  ) {
    findings.push(`${relativePath}: native binary build must bind the verified release tag and commit`);
  }
  return findings;
}

function validateReleasePreparation(steps, indices, relativePath) {
  const findings = [];
  const preparationFollowsBinary = indices.prepare >= 0
    && indices.binary >= 0
    && indices.prepare > indices.binary;
  if (!preparationFollowsBinary) {
    findings.push(`${relativePath}: release preparation must follow the native binary build`);
  } else if (!steps[indices.prepare].run.includes("--additional-assets-root build/release-inputs")) {
    findings.push(`${relativePath}: release preparation must ingest the native binaries as additional assets`);
  }
  const executionFollowsBinary = indices.execute >= 0
    && indices.binary >= 0
    && indices.execute > indices.binary;
  const executionPrecedesPreparation = indices.prepare < 0 || indices.execute < indices.prepare;
  if (!executionFollowsBinary || !executionPrecedesPreparation) {
    findings.push(`${relativePath}: the exercised Linux amd64 binary must validate source and materialize the manifest release plan before asset preparation`);
  }
  return findings;
}

function validateReleaseAssetProvenance(workflow, relativePath) {
  const releaseSteps = workflow?.jobs?.release?.steps ?? [];
  const assetVerification = findStepByName(
    releaseSteps,
    "Verify the release-asset attestations against the tag source",
  )?.run;
  if (stringIncludesAll(assetVerification, [
    "gh attestation verify",
    '--source-digest "$RELEASE_COMMIT"',
    '--source-ref "refs/tags/$RELEASE_TAG"',
  ])) {
    return [];
  }
  return [
    `${relativePath}: attached release assets must verify against the exact tag source before publication`,
  ];
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
  findings.push(...validateReleaseRefSource(source, relativePath));
  const steps = workflow?.jobs?.verify?.steps ?? [];
  const indices = releaseVerificationStepIndices(steps);
  findings.push(...validateNativeReleaseBuild(steps, indices, relativePath));
  findings.push(...validateReleasePreparation(steps, indices, relativePath));
  findings.push(...validateReleaseAssetProvenance(workflow, relativePath));
  return findings;
}

function recordExpectation(findings, accepted, message) {
  if (!accepted) findings.push(message);
}

function arrayIncludes(values, expected) {
  if (!Array.isArray(values)) return false;
  return values.includes(expected);
}

function propertiesMatch(value, expected) {
  if (!value || typeof value !== "object") return false;
  return Object.entries(expected).every(([key, expectedValue]) => (
    value[key] === expectedValue
  ));
}

function actionUses(step, actionName) {
  if (typeof step?.uses !== "string") return false;
  return step.uses.startsWith(`${actionName}@`);
}

function stringIncludesAll(value, fragments) {
  if (typeof value !== "string") return false;
  return fragments.every((fragment) => value.includes(fragment));
}

function findStepById(steps, id) {
  return steps.find((step) => step?.id === id);
}

function findStepByName(steps, name) {
  return steps.find((step) => step?.name === name);
}

function findStepByInput(steps, key, value) {
  return steps.find((step) => step?.with?.[key] === value);
}

function findStepByRunFragment(steps, fragment) {
  return steps.find((step) => (
    typeof step?.run === "string" && step.run.includes(fragment)
  ));
}

function findRegistryAttestation(steps, imageName) {
  return steps.find((step) => propertiesMatch(step?.with, {
    "push-to-registry": true,
    "subject-name": imageName,
  }));
}

function countOccurrences(value, fragment) {
  return typeof value === "string" ? value.split(fragment).length - 1 : 0;
}

function validateBuildxSetup(steps, relativePath, findings) {
  const setup = steps.find((step) => actionUses(step, "docker/setup-buildx-action"));
  recordExpectation(
    findings,
    propertiesMatch(setup?.with, {
      version: buildxPolicy.version,
      "driver-opts": buildxPolicy.buildkit,
    }),
    `${relativePath}: Docker Buildx and BuildKit must use the reviewed version and image digest`,
  );
}

function validateHardenedDockerRuns(source, minimumRuns, relativePath, subject, findings) {
  recordExpectation(
    findings,
    [
      countOccurrences(source, "docker run") >= minimumRuns,
      countOccurrences(source, "--pull never") >= minimumRuns,
      countOccurrences(source, "--network none") >= minimumRuns,
      countOccurrences(source, "--read-only") >= minimumRuns,
      countOccurrences(source, "--cap-drop ALL") >= minimumRuns,
      countOccurrences(source, "--security-opt no-new-privileges") >= minimumRuns,
    ].every(Boolean),
    `${relativePath}: ${subject} must use the bounded offline read-only container profile`,
  );
}

function loadReleaseImageDeclarations(root, findings) {
  const manifestRoot = path.join(root, "experiments", "workstation", "manifests");
  let names;
  try {
    names = fs.readdirSync(manifestRoot).filter((name) => name.endsWith(".json")).sort();
  } catch (error) {
    findings.push(`experiments/workstation/manifests: cannot read release declarations: ${error.message}`);
    return [];
  }
  const declarations = [];
  for (const name of names) {
    try {
      const manifest = JSON.parse(readText(root, `experiments/workstation/manifests/${name}`));
      if (manifest.distribution?.state === "release-image") {
        declarations.push({ artifact: manifest.artifact, ...manifest.distribution });
      }
    } catch (error) {
      findings.push(`experiments/workstation/manifests/${name}: invalid release declaration: ${error.message}`);
    }
  }
  return declarations;
}

function workflowImageName(artifact) {
  return `ghcr.io/\${{ github.repository }}-${artifact}`;
}

function untaggedRegistryOutput(imageName) {
  return `type=registry,name=${imageName},push-by-digest=true,name-canonical=true`;
}

function stepPosition(steps, name) {
  return steps.findIndex((step) => step?.name === name);
}

function validateManifestReleaseImageParity(root, workflow, relativePath, findings) {
  const declarations = loadReleaseImageDeclarations(root, findings);
  const releaseSteps = workflow?.jobs?.release?.steps ?? [];
  const declared = new Set(declarations.map(({ artifact }) => artifact));
  const workflowArtifacts = new Set(
    releaseSteps
      .map((step) => /^build-((?:candidate|fixture)-[0-9]{3})-image$/u.exec(step?.id)?.[1])
      .filter(Boolean),
  );
  recordExpectation(
    findings,
    declared.size > 0
      && declared.size === workflowArtifacts.size
      && [...declared].every((artifact) => workflowArtifacts.has(artifact)),
    `${relativePath}: experiment image build set must exactly match manifest release-image declarations`,
  );
  for (const declaration of declarations) {
    const build = findStepById(releaseSteps, `build-${declaration.artifact}-image`);
    const metadata = findStepById(releaseSteps, `${declaration.artifact}-image-metadata`);
    const expectedContext = declaration.build_context === "closed-go-package"
      ? `build/container-contexts/${declaration.artifact}`
      : ".";
    recordExpectation(
      findings,
      propertiesMatch(build?.with, {
        context: expectedContext,
        file: declaration.dockerfile,
        platforms: declaration.platforms.join(","),
      }) && metadata?.with?.images === workflowImageName(declaration.artifact),
      `${relativePath}: ${declaration.artifact} workflow build must match its manifest distribution boundary`,
    );
  }
  return declarations;
}

function validateCiManifestReleaseImageParity(root, workflow, relativePath, findings) {
  const declarations = loadReleaseImageDeclarations(root, findings);
  const steps = workflow?.jobs?.["experiment-image"]?.steps ?? [];
  for (const declaration of declarations) {
    const build = findStepByInput(steps, "tags", `20w-${declaration.artifact}:test`);
    const expectedContext = declaration.build_context === "closed-go-package"
      ? `build/container-contexts/${declaration.artifact}`
      : ".";
    recordExpectation(
      findings,
      propertiesMatch(build?.with, {
        context: expectedContext,
        file: declaration.dockerfile,
      }) && stringIncludesAll(build?.with?.["build-args"], [
        `IMAGE_NAME=${workflowImageName(declaration.artifact)}`,
        "IMAGE_VERSION=development",
        "SOURCE_REVISION=${{ github.sha }}",
      ]),
      `${relativePath}: ${declaration.artifact} CI build must match its manifest distribution boundary`,
    );
  }
}

function validateCiFixtureImageSteps(steps, relativePath, findings) {
  const build = findStepByInput(steps, "tags", "20w-fixture-019:test");
  const inputs = build?.with;
  recordExpectation(
    findings,
    [
      actionUses(build, "docker/build-push-action"),
      propertiesMatch(inputs, {
        context: fixture019ImagePolicy.context,
        file: fixture019ImagePolicy.dockerfile,
        load: true,
        push: false,
        tags: "20w-fixture-019:test",
      }),
    ].every(Boolean),
    `${relativePath}: experiment-image must build only the scoped Fixture 019 test image`,
  );
  recordExpectation(
    findings,
    stringIncludesAll(inputs?.["build-args"], [
      "IMAGE_NAME=ghcr.io/${{ github.repository }}-fixture-019",
      "IMAGE_VERSION=development",
      "SOURCE_REVISION=${{ github.sha }}",
    ]),
    `${relativePath}: Fixture 019 test image must bind its image name, development version, and source revision`,
  );
  recordExpectation(
    findings,
    propertiesMatch(inputs, {
      "cache-from": "type=gha,scope=fixture-019-image",
      "cache-to": "type=gha,mode=max,scope=fixture-019-image",
    }),
    `${relativePath}: Fixture 019 test image must use a per-artifact cache scope`,
  );
}

function validateCiFixture019Context(steps, relativePath, findings) {
  const packaging = findStepByName(steps, "Package the closed Fixture 019 runtime context");
  recordExpectation(
    findings,
    packaging?.run === fixture019ImagePolicy.packageCommand,
    `${relativePath}: Fixture 019 test image must use its exact closed Go-packaged runtime context`,
  );
}

function validateCiFixture007Context(steps, relativePath, findings) {
  const packaging = findStepByName(steps, "Package the closed Fixture 007 runtime context");
  recordExpectation(
    findings,
    packaging?.run === fixture007ImagePolicy.packageCommand,
    `${relativePath}: Fixture 007 test image must use its exact closed Go-packaged runtime context`,
  );
}

function validateCiFixture007Build(steps, relativePath, findings) {
  const build = findStepByName(steps, "Build the Fixture 007 image");
  const inputs = build?.with;
  recordExpectation(
    findings,
    actionUses(build, "docker/build-push-action") && propertiesMatch(inputs, {
      context: fixture007ImagePolicy.context,
      file: fixture007ImagePolicy.dockerfile,
      load: true,
      push: false,
      tags: fixture007ImagePolicy.ciTag,
    }),
    `${relativePath}: experiment-image must build only the scoped Fixture 007 test image from its closed context`,
  );
  recordExpectation(
    findings,
    inputs?.["build-args"] === fixture007ImagePolicy.ciBuildArgs,
    `${relativePath}: Fixture 007 test image must keep its exact artifact, registry, version, and revision arguments`,
  );
  recordExpectation(
    findings,
    propertiesMatch(inputs, {
      "cache-from": fixture007ImagePolicy.cacheFrom,
      "cache-to": fixture007ImagePolicy.cacheTo,
    }),
    `${relativePath}: Fixture 007 test image must use its per-artifact cache scope`,
  );
}

function validateCiFixture007Smoke(steps, relativePath, findings) {
  const smoke = findStepByName(steps, "Execute the bounded Fixture 007 smoke path");
  const source = smoke?.run;
  recordExpectation(
    findings,
    stringIncludesAll(source, [
      "20w-fixture-007:test smoke --profile smoke --output /workspace/results/ci-fixture-007",
      "20w-fixture-007:test analyze --output /workspace/results/ci-fixture-007",
      "20w-fixture-007:test validate --output /workspace/results/ci-fixture-007",
      "--entrypoint node 20w-fixture-007:test --version",
      `"v${runtimePolicy.nodeVersion}"`,
      "type=volume",
    ]),
    `${relativePath}: Fixture 007 must run smoke, analyze, and validate against one persistent result volume`,
  );
  validateHardenedDockerRuns(source, 4, relativePath, "Fixture 007", findings);
}

function validateCiFixture007Image(steps, relativePath, findings) {
  validateCiFixture007Context(steps, relativePath, findings);
  validateCiFixture007Build(steps, relativePath, findings);
  validateCiFixture007Smoke(steps, relativePath, findings);
}

function validateCiToolingImageSteps(steps, relativePath, findings) {
  const build = findStepByInput(steps, "tags", "20w-tooling:test");
  const inputs = build?.with;
  const accepted = [
    actionUses(build, "docker/build-push-action"),
    propertiesMatch(inputs, {
      "cache-from": "type=gha,scope=20w-tooling-image",
      "cache-to": "type=gha,mode=max,scope=20w-tooling-image",
      context: ".",
      file: "tooling/Dockerfile",
      load: true,
      push: false,
    }),
    stringIncludesAll(inputs?.["build-args"], [
      "IMAGE_VERSION=development",
      "SOURCE_REVISION=${{ github.sha }}",
      "SOURCE_TIMESTAMP=unknown",
    ]),
  ].every(Boolean);
  recordExpectation(
    findings,
    accepted,
    `${relativePath}: experiment-image must build the separate static 20w tooling image`,
  );

  const source = findStepByRunFragment(steps, "20w-tooling:test version --json")?.run;
  recordExpectation(
    findings,
    stringIncludesAll(source, [
      "20w-tooling:test version --json",
      "20w-tooling:test validate docs --root /repo",
      "20w-tooling:test experiment list --root /repo --json",
      "src=$GITHUB_WORKSPACE,dst=/repo,readonly",
    ]),
    `${relativePath}: static 20w image must be tested offline against a read-only repository mount`,
  );
  validateHardenedDockerRuns(source, 3, relativePath, "static 20w image", findings);
}

function validateCiImageRuntimeSteps(steps, relativePath, findings) {
  const runtimeSource = findStepByRunFragment(steps, "node --version")?.run;
  recordExpectation(
    findings,
    stringIncludesAll(runtimeSource, [
      "--entrypoint sh 20w-fixture-019:test",
      `= "v${runtimePolicy.nodeVersion}"`,
      `= "Python ${runtimePolicy.pythonVersion}"`,
      `numpy.__version__ == \\"${runtimePolicy.numpyVersion}\\"`,
      "20w-fixture-019:test prepare --profile smoke",
    ]),
    `${relativePath}: Fixture 019 image runtime and smoke preparation must be checked offline`,
  );
  validateHardenedDockerRuns(runtimeSource, 2, relativePath, "Fixture 019 runtime checks", findings);
  const smokeSource = findStepByName(steps, "Execute the bounded Fixture 019 smoke path")?.run;
  recordExpectation(
    findings,
    stringIncludesAll(smokeSource, [
      "20w-fixture-019:test smoke --profile smoke --output /workspace/results/ci-fixture-019 --resume false",
      "20w-fixture-019:test analyze --output /workspace/results/ci-fixture-019",
      "20w-fixture-019:test validate --output /workspace/results/ci-fixture-019",
      "type=volume",
    ]),
    `${relativePath}: Fixture 019 must run smoke, analyze, and validate against one persistent result volume`,
  );
  validateHardenedDockerRuns(smokeSource, 3, relativePath, "Fixture 019", findings);
}

export function validateCiExperimentImageWorkflowObject(
  workflow,
  relativePath = ".github/workflows/ci.yml",
  root = defaultRoot,
) {
  const findings = [];
  const steps = workflow?.jobs?.["experiment-image"]?.steps;
  if (!Array.isArray(steps)) {
    return [`${relativePath}: experiment-image job must validate the scoped Fixture 007 and Fixture 019 images`];
  }
  validateBuildxSetup(steps, relativePath, findings);
  validateCiManifestReleaseImageParity(root, workflow, relativePath, findings);
  validateCiFixture007Image(steps, relativePath, findings);
  validateCiFixture019Context(steps, relativePath, findings);
  validateCiFixtureImageSteps(steps, relativePath, findings);
  validateCiToolingImageSteps(steps, relativePath, findings);
  validateCiImageRuntimeSteps(steps, relativePath, findings);
  recordExpectation(
    findings,
    arrayIncludes(workflow?.jobs?.["ci-success"]?.needs, "experiment-image"),
    `${relativePath}: ci-success must require the scoped experiment-image gate`,
  );
  return findings;
}

function validateReleaseTimestamp(verifyJob, relativePath, findings) {
  const releaseRefSource = findStepById(verifyJob?.steps ?? [], "release-ref")?.run;
  const accepted = [
    propertiesMatch(verifyJob?.outputs, {
      "release-timestamp": "${{ steps.release-ref.outputs.timestamp }}",
      "release-epoch": "${{ steps.release-ref.outputs.epoch }}",
    }),
    stringIncludesAll(releaseRefSource, [
      "--format=%cI",
      "--format=%ct",
      "release_commit",
      '>> "$GITHUB_OUTPUT"',
    ]),
  ].every(Boolean);
  recordExpectation(
    findings,
    accepted,
    `${relativePath}: release must derive timestamp and SOURCE_DATE_EPOCH from the tagged commit`,
  );
}

function validateReleaseToolingImage(steps, relativePath, findings) {
  const condition = "steps.image-status.outputs.tooling_publish == 'true'";
  const imageName = "ghcr.io/${{ github.repository }}-20w";
  const metadata = findStepById(steps, "tooling-image-metadata");
  const build = findStepById(steps, "build-tooling-image");
  const attestation = findRegistryAttestation(steps, imageName);
  const accepted = [
    propertiesMatch(metadata, { if: condition }),
    actionUses(metadata, "docker/metadata-action"),
    propertiesMatch(metadata?.with, {
      images: imageName,
      flavor: "latest=false",
      tags: fixture007ImagePolicy.releaseTag,
    }),
    stringIncludesAll(metadata?.with?.labels, [
      "org.opencontainers.image.created=${{ needs.verify.outputs.release-timestamp }}",
      "org.opencontainers.image.revision=${{ needs.verify.outputs.release-commit }}",
      `io.github.lusoris.20-watts-was-enough.image-name=${imageName}`,
    ]),
    propertiesMatch(build, { if: condition }),
    actionUses(build, "docker/build-push-action"),
    propertiesMatch(build?.with, {
      "cache-from": "type=gha,scope=20w-tooling-image",
      "cache-to": "type=gha,mode=max,scope=20w-tooling-image",
      context: ".",
      file: "tooling/Dockerfile",
      labels: "${{ steps.tooling-image-metadata.outputs.labels }}",
      outputs: untaggedRegistryOutput(imageName),
      platforms: "linux/amd64",
      provenance: "mode=max",
      sbom: sbomGenerator,
    }),
    !Object.hasOwn(build?.with ?? {}, "push"),
    !Object.hasOwn(build?.with ?? {}, "tags"),
    stringIncludesAll(build?.with?.["build-args"], [
      "IMAGE_NAME=ghcr.io/${{ github.repository }}-20w",
      "IMAGE_VERSION=${{ needs.verify.outputs.release-tag }}",
      "SOURCE_REVISION=${{ needs.verify.outputs.release-commit }}",
      "SOURCE_TIMESTAMP=${{ needs.verify.outputs.release-timestamp }}",
    ]),
    build?.env?.SOURCE_DATE_EPOCH === "${{ needs.verify.outputs.release-epoch }}",
    propertiesMatch(attestation, { if: "steps.attestation-status.outputs.tooling_repair == 'true'" }),
    actionUses(attestation, "actions/attest-build-provenance"),
    propertiesMatch(attestation?.with, {
      "subject-digest": "${{ steps.admission-images.outputs.tooling_digest }}",
    }),
  ].every(Boolean);
  recordExpectation(
    findings,
    accepted,
    `${relativePath}: static 20w tooling image must use a separate untagged, admitted digest`,
  );
}

function validateReleaseFixtureStatus(steps, relativePath, findings) {
  const status = findStepById(steps, "image-status");
  const accepted = [
    propertiesMatch(status?.env, {
      GHCR_TOKEN: "${{ github.token }}",
      GHCR_USERNAME: "${{ github.actor }}",
      RELEASE_COMMIT: "${{ needs.verify.outputs.release-commit }}",
      RELEASE_TAG: "${{ needs.verify.outputs.release-tag }}",
      RELEASE_TIMESTAMP: "${{ needs.verify.outputs.release-timestamp }}",
    }),
    stringIncludesAll(status?.run, [
      "go -C tooling build -trimpath -buildvcs=false",
      "release inspect-image",
      "for fixture in fixture-007 fixture-019",
      'ghcr.io/${GITHUB_REPOSITORY}-${fixture}',
      '--revision "$RELEASE_COMMIT"',
      '--expected-label "io.github.lusoris.20-watts-was-enough.result-authority=NO_RESULT"',
      '--github-output-prefix "$prefix"',
    ]),
    countOccurrences(status?.run, "--platform linux/amd64") >= 2,
    !status?.run?.includes("linux/arm64"),
    !status?.run?.includes("imagetools inspect"),
  ].every(Boolean);
  recordExpectation(
    findings,
    accepted,
    `${relativePath}: Fixture 019 release tags must be checked and preserved before publication`,
  );
}

function validateReleaseFixtureMetadata(steps, relativePath, findings, condition, imageName) {
  const metadata = findStepById(steps, "fixture-019-image-metadata");
  const accepted = [
    propertiesMatch(metadata, { if: condition }),
    actionUses(metadata, "docker/metadata-action"),
    propertiesMatch(metadata?.with, {
      images: imageName,
      flavor: "latest=false",
      tags: fixture007ImagePolicy.releaseTag,
    }),
    stringIncludesAll(metadata?.with?.labels, [
      "org.opencontainers.image.created=${{ needs.verify.outputs.release-timestamp }}",
      "org.opencontainers.image.revision=${{ needs.verify.outputs.release-commit }}",
      "io.github.lusoris.20-watts-was-enough.result-authority=NO_RESULT",
    ]),
  ].every(Boolean);
  recordExpectation(
    findings,
    accepted,
    `${relativePath}: Fixture 019 metadata must use its per-artifact image identity and verified tag`,
  );
}

function validateReleaseFixtureBuild(steps, relativePath, findings, condition) {
  const build = findStepById(steps, "build-fixture-019-image");
  const imageName = "ghcr.io/${{ github.repository }}-fixture-019";
  const accepted = [
    propertiesMatch(build, { if: condition }),
    actionUses(build, "docker/build-push-action"),
    propertiesMatch(build?.with, {
      "cache-from": "type=gha,scope=fixture-019-image",
      "cache-to": "type=gha,mode=max,scope=fixture-019-image",
      context: fixture019ImagePolicy.context,
      file: fixture019ImagePolicy.dockerfile,
      labels: "${{ steps.fixture-019-image-metadata.outputs.labels }}",
      outputs: untaggedRegistryOutput(imageName),
      platforms: "linux/amd64",
      provenance: "mode=max",
      sbom: sbomGenerator,
    }),
    !Object.hasOwn(build?.with ?? {}, "push"),
    !Object.hasOwn(build?.with ?? {}, "tags"),
    stringIncludesAll(build?.with?.["build-args"], [
      "IMAGE_NAME=ghcr.io/${{ github.repository }}-fixture-019",
      "IMAGE_VERSION=${{ needs.verify.outputs.release-tag }}",
      "SOURCE_REVISION=${{ needs.verify.outputs.release-commit }}",
    ]),
    build?.env?.SOURCE_DATE_EPOCH === "${{ needs.verify.outputs.release-epoch }}",
  ].every(Boolean);
  recordExpectation(
    findings,
    accepted,
    `${relativePath}: release must build the untagged linux/amd64 Fixture 019 candidate`,
  );
}

function validateReleaseFixture019Context(steps, relativePath, findings) {
  const packaging = findStepByName(steps, "Package the closed Fixture 019 runtime context");
  recordExpectation(
    findings,
    propertiesMatch(packaging, { if: fixture019ImagePolicy.condition })
      && packaging?.run === fixture019ImagePolicy.packageCommand,
    `${relativePath}: Fixture 019 release must package its exact closed runtime context after the existing-tag check`,
  );
}

function validateReleaseFixtureAttestation(steps, relativePath, findings, imageName) {
  const attestation = findRegistryAttestation(steps, imageName);
  const accepted = [
    propertiesMatch(attestation, { if: "steps.attestation-status.outputs.fixture019_repair == 'true'" }),
    actionUses(attestation, "actions/attest-build-provenance"),
    propertiesMatch(attestation?.with, {
      "subject-digest": "${{ steps.admission-images.outputs.fixture019_digest }}",
      "subject-name": imageName,
    }),
  ].every(Boolean);
  recordExpectation(
    findings,
    accepted,
    `${relativePath}: Fixture 019 attestation repair must bind its admitted registry digest`,
  );
}

function validateReleaseFixtureImage(steps, relativePath, findings) {
  const condition = fixture019ImagePolicy.condition;
  const imageName = "ghcr.io/${{ github.repository }}-fixture-019";
  validateReleaseFixtureStatus(steps, relativePath, findings);
  validateReleaseFixture019Context(steps, relativePath, findings);
  validateReleaseFixtureMetadata(steps, relativePath, findings, condition, imageName);
  validateReleaseFixtureBuild(steps, relativePath, findings, condition);
  validateReleaseFixtureAttestation(steps, relativePath, findings, imageName);
}

function validateReleaseFixture007Status(steps, relativePath, findings) {
  const status = findStepById(steps, "image-status");
  const accepted = [
    propertiesMatch(status?.env, {
      GHCR_TOKEN: "${{ github.token }}",
      GHCR_USERNAME: "${{ github.actor }}",
      RELEASE_COMMIT: "${{ needs.verify.outputs.release-commit }}",
      RELEASE_TAG: "${{ needs.verify.outputs.release-tag }}",
      RELEASE_TIMESTAMP: "${{ needs.verify.outputs.release-timestamp }}",
    }),
    stringIncludesAll(status?.run, [
      "release inspect-image",
      "for fixture in fixture-007 fixture-019",
      'ghcr.io/${GITHUB_REPOSITORY}-${fixture}',
      '--expected-label "io.github.lusoris.20-watts-was-enough.result-authority=NO_RESULT"',
      '--github-output-prefix "$prefix"',
    ]),
    !status?.run?.includes("imagetools inspect"),
  ].every(Boolean);
  recordExpectation(
    findings,
    accepted,
    `${relativePath}: Fixture 007 release tags must be checked and preserved before publication`,
  );
}

function validateReleaseFixture007Context(steps, relativePath, findings) {
  const packaging = findStepByName(steps, "Package the closed Fixture 007 runtime context");
  recordExpectation(
    findings,
    propertiesMatch(packaging, { if: fixture007ImagePolicy.condition })
      && packaging?.run === fixture007ImagePolicy.packageCommand,
    `${relativePath}: Fixture 007 release must package its exact closed runtime context after the existing-tag check`,
  );
}

function validateReleaseFixture007Metadata(steps, relativePath, findings) {
  const metadata = findStepById(steps, "fixture-007-image-metadata");
  const accepted = [
    propertiesMatch(metadata, { if: fixture007ImagePolicy.condition }),
    actionUses(metadata, "docker/metadata-action"),
    propertiesMatch(metadata?.with, {
      images: fixture007ImagePolicy.imageName,
      flavor: "latest=false",
      tags: fixture007ImagePolicy.releaseTag,
    }),
    stringIncludesAll(metadata?.with?.labels, [
      "org.opencontainers.image.created=${{ needs.verify.outputs.release-timestamp }}",
      "org.opencontainers.image.revision=${{ needs.verify.outputs.release-commit }}",
      "io.github.lusoris.20-watts-was-enough.result-authority=NO_RESULT",
    ]),
  ].every(Boolean);
  recordExpectation(
    findings,
    accepted,
    `${relativePath}: Fixture 007 metadata must use its per-artifact image identity and verified tag`,
  );
}

function validateReleaseFixture007Build(steps, relativePath, findings) {
  const build = findStepById(steps, "build-fixture-007-image");
  const inputs = build?.with;
  const accepted = [
    propertiesMatch(build, { if: fixture007ImagePolicy.condition }),
    actionUses(build, "docker/build-push-action"),
    propertiesMatch(inputs, {
      context: fixture007ImagePolicy.context,
      file: fixture007ImagePolicy.dockerfile,
      labels: "${{ steps.fixture-007-image-metadata.outputs.labels }}",
      outputs: untaggedRegistryOutput(fixture007ImagePolicy.imageName),
      platforms: "linux/amd64",
      provenance: "mode=max",
      sbom: sbomGenerator,
    }),
    !Object.hasOwn(inputs ?? {}, "push"),
    !Object.hasOwn(inputs ?? {}, "tags"),
    build?.env?.SOURCE_DATE_EPOCH === "${{ needs.verify.outputs.release-epoch }}",
  ].every(Boolean);
  recordExpectation(
    findings,
    accepted,
    `${relativePath}: release must build the untagged linux/amd64 Fixture 007 candidate from its closed context`,
  );
  recordExpectation(
    findings,
    inputs?.["build-args"] === fixture007ImagePolicy.releaseBuildArgs,
    `${relativePath}: Fixture 007 release image must keep its exact artifact, registry, tag, and revision arguments`,
  );
  recordExpectation(
    findings,
    propertiesMatch(inputs, {
      "cache-from": fixture007ImagePolicy.cacheFrom,
      "cache-to": fixture007ImagePolicy.cacheTo,
    }),
    `${relativePath}: Fixture 007 release image must use its per-artifact cache scope`,
  );
}

function validateReleaseFixture007Attestation(steps, relativePath, findings) {
  const attestation = findRegistryAttestation(steps, fixture007ImagePolicy.imageName);
  const accepted = [
    propertiesMatch(attestation, { if: "steps.attestation-status.outputs.fixture007_repair == 'true'" }),
    actionUses(attestation, "actions/attest-build-provenance"),
    propertiesMatch(attestation?.with, {
      "subject-digest": "${{ steps.admission-images.outputs.fixture007_digest }}",
      "subject-name": fixture007ImagePolicy.imageName,
    }),
  ].every(Boolean);
  recordExpectation(
    findings,
    accepted,
    `${relativePath}: Fixture 007 attestation repair must bind its admitted registry digest`,
  );
}

function validateReleaseFixture007Image(steps, relativePath, findings) {
  validateReleaseFixture007Status(steps, relativePath, findings);
  validateReleaseFixture007Context(steps, relativePath, findings);
  validateReleaseFixture007Metadata(steps, relativePath, findings);
  validateReleaseFixture007Build(steps, relativePath, findings);
  validateReleaseFixture007Attestation(steps, relativePath, findings);
}

function validateReleaseDigestAdmission(steps, relativePath, findings) {
  const selection = findStepById(steps, "admission-images");
  recordExpectation(
    findings,
    stringIncludesAll(selection?.run, [
      "select_digest",
      'case "$publish" in',
      'true) selected="$built"',
      'false) selected="$existing"',
      "^sha256:[0-9a-f]{64}$",
      "$TOOLING_PUBLISH",
      "$FIXTURE_007_PUBLISH",
      "$FIXTURE_019_PUBLISH",
    ]),
    `${relativePath}: release admission must select one exact existing or newly built digest per image`,
  );

  const digestInspection = findStepByName(steps, "Validate the exact image digests before admission")?.run;
  recordExpectation(
    findings,
    stringIncludesAll(digestInspection, [
      "release inspect-image",
      '--digest "$TOOLING_DIGEST"',
      '--digest "$digest"',
      "--require-existing",
      'ghcr.io/${GITHUB_REPOSITORY}-20w',
      'ghcr.io/${GITHUB_REPOSITORY}-${fixture}',
      '--revision "$RELEASE_COMMIT"',
      '--expected-label "io.github.lusoris.20-watts-was-enough.result-authority=NO_RESULT"',
    ])
      && countOccurrences(digestInspection, "--platform linux/amd64") >= 2
      && !digestInspection?.includes("linux/arm64"),
    `${relativePath}: exact candidate digests must pass authenticated platform and label inspection before admission`,
  );

  const execution = findStepByName(steps, "Run the admitted candidates by immutable digest")?.run;
  recordExpectation(
    findings,
    stringIncludesAll(execution, [
      'ghcr.io/${GITHUB_REPOSITORY}-20w@${TOOLING_DIGEST}',
      'ghcr.io/${GITHUB_REPOSITORY}-fixture-007@${FIXTURE_007_DIGEST}',
      'ghcr.io/${GITHUB_REPOSITORY}-fixture-019@${FIXTURE_019_DIGEST}',
      '"$tooling" version --json',
      '"go_version":"go1.27.0"',
      '"os":"linux"',
      '"architecture":"amd64"',
      '"$RELEASE_TAG" "$RELEASE_COMMIT" "$RELEASE_TIMESTAMP"',
      'if [[ "$tooling_identity" != "$expected_tooling_identity" ]]; then',
      "admitted 20w binary identity does not match the tag, commit, timestamp, Go version, OS, and architecture",
      '--entrypoint node "$fixture_007" --version',
      `"v${runtimePolicy.nodeVersion}"`,
      `if [[ "$fixture_007_node" != "v${runtimePolicy.nodeVersion}" ]]; then`,
      '--entrypoint sh "$fixture_019" -c',
      `"Python ${runtimePolicy.pythonVersion}"`,
      `numpy.__version__ == \\"${runtimePolicy.numpyVersion}\\"`,
      " smoke --profile smoke ",
      '"$action" --output',
      "type=volume",
    ]),
    `${relativePath}: candidate images must run tooling plus smoke, analyze, and validate by digest before tagging`,
  );
  validateHardenedDockerRuns(execution, 7, relativePath, "admitted candidate images", findings);
}

function validateReleaseAttestationAndTagging(steps, relativePath, findings) {
  const attestationStatus = findStepById(steps, "attestation-status")?.run;
  recordExpectation(
    findings,
    stringIncludesAll(attestationStatus, [
      "check_attestation",
      "gh attestation verify",
      '--source-digest "$RELEASE_COMMIT"',
      '--source-ref "refs/tags/$RELEASE_TAG"',
      'printf \'%s_repair=%s\\n\'',
      'ghcr.io/${GITHUB_REPOSITORY}-20w',
      'ghcr.io/${GITHUB_REPOSITORY}-fixture-007',
      'ghcr.io/${GITHUB_REPOSITORY}-fixture-019',
    ]),
    `${relativePath}: admitted digests must detect and repair missing source-bound attestations`,
  );

  const provenance = findStepByName(steps, "Verify admitted image provenance against the tag source")?.run;
  recordExpectation(
    findings,
    stringIncludesAll(provenance, [
      "gh attestation verify",
      '--source-digest "$RELEASE_COMMIT"',
      '--source-ref "refs/tags/$RELEASE_TAG"',
      'ghcr.io/${GITHUB_REPOSITORY}-fixture-007',
      'ghcr.io/${GITHUB_REPOSITORY}-fixture-019',
    ]),
    `${relativePath}: admitted image provenance must bind the verified tag and commit`,
  );

  const publication = findStepByName(steps, "Attach missing release tags to admitted digests")?.run;
  recordExpectation(
    findings,
    stringIncludesAll(publication, [
      "publish_tag",
      'if [[ "$publish" == "false" ]]',
      "release inspect-image",
      "candidate_status=absent",
      "refusing to overwrite an image tag that became present during admission",
      "docker buildx imagetools create",
      '--tag "${image_name}:${RELEASE_TAG}"',
      '"${image_name}@${digest}"',
    ]) && steps.filter((step) => step?.run?.includes("docker buildx imagetools create")).length === 1,
    `${relativePath}: release tags must use the single absence-checked publication path after admission`,
  );
}

function validateReleaseFinalBindingAndNotes(steps, relativePath, findings) {
  const final = findStepById(steps, "final-images")?.run;
  recordExpectation(
    findings,
    stringIncludesAll(final, [
      "inspect_final_image",
      "--require-existing",
      "inspect_final_image finaltooling",
      '--github-output-prefix "$prefix"',
      "for fixture in fixture-007 fixture-019",
      'ghcr.io/${GITHUB_REPOSITORY}-${fixture}',
    ])
      && countOccurrences(final, "--platform linux/amd64") >= 2
      && !final?.includes("linux/arm64"),
    `${relativePath}: final image tags must converge through bounded authenticated inspection`,
  );

  const binding = findStepByName(steps, "Bind final release tags to the admitted digests");
  recordExpectation(
    findings,
    stringIncludesAll(binding?.run, [
      "require_digest_match",
      'if [[ "$admitted" != "$resolved" ]]',
      "$TOOLING_ADMITTED",
      "$FIXTURE_007_ADMITTED",
      "$FIXTURE_019_ADMITTED",
    ]),
    `${relativePath}: final image tags must resolve to the exact admitted digests`,
  );

  const orderedNames = [
    "Select exact image digests for admission",
    "Validate the exact image digests before admission",
    "Run the admitted candidates by immutable digest",
    "Determine whether admitted digests need attestations",
    "Verify admitted image provenance against the tag source",
    "Attach missing release tags to admitted digests",
    "Resolve and validate the final release image tags",
    "Bind final release tags to the admitted digests",
    "Add immutable container identities to the release notes",
  ];
  const positions = orderedNames.map((name) => stepPosition(steps, name));
  const attestationPositions = [
    "ghcr.io/${{ github.repository }}-20w",
    "ghcr.io/${{ github.repository }}-fixture-007",
    "ghcr.io/${{ github.repository }}-fixture-019",
  ].map((imageName) => steps.indexOf(findRegistryAttestation(steps, imageName)));
  recordExpectation(
    findings,
    positions.every((position) => position >= 0)
      && positions.every((position, index) => index === 0 || positions[index - 1] < position)
      && attestationPositions.every((position) => position > positions[3] && position < positions[4]),
    `${relativePath}: release image tagging must follow digest inspection, execution, attestation, and provenance verification`,
  );

  const notes = findStepByName(steps, "Add immutable container identities to the release notes")?.run;
  recordExpectation(
    findings,
    stringIncludesAll(notes, [
      "Immutable container images",
      'ghcr.io/${GITHUB_REPOSITORY}-20w@${TOOLING_DIGEST}',
      'ghcr.io/${GITHUB_REPOSITORY}-fixture-007@${FIXTURE_007_DIGEST}',
      'ghcr.io/${GITHUB_REPOSITORY}-fixture-019@${FIXTURE_019_DIGEST}',
      "TOOLING_DIGEST",
      "FIXTURE_007_DIGEST",
      "FIXTURE_019_DIGEST",
      "linux/amd64",
      "NO_RESULT",
    ]) && !notes?.includes("linux/arm64"),
    `${relativePath}: release notes must carry exact image digests, platforms, revision, and NO_RESULT authority`,
  );
}

function validateReleaseImageProvenanceAndExecution(steps, relativePath, findings) {
  validateReleaseDigestAdmission(steps, relativePath, findings);
  validateReleaseAttestationAndTagging(steps, relativePath, findings);
  validateReleaseFinalBindingAndNotes(steps, relativePath, findings);
}

export function validateReleaseExperimentImageWorkflowObject(
  workflow,
  relativePath = ".github/workflows/release.yml",
  root = defaultRoot,
) {
  const findings = [];
  const releaseJob = workflow?.jobs?.release;
  const steps = releaseJob?.steps;
  if (!Array.isArray(steps)) {
    return [`${relativePath}: release job must publish the scoped Fixture 007 and Fixture 019 images`];
  }
  recordExpectation(
    findings,
    releaseJob.permissions?.packages === "write",
    `${relativePath}: release job needs packages write permission for per-artifact images`,
  );
  validateBuildxSetup(steps, relativePath, findings);
  validateManifestReleaseImageParity(root, workflow, relativePath, findings);
  validateReleaseTimestamp(workflow?.jobs?.verify, relativePath, findings);
  validateReleaseToolingImage(steps, relativePath, findings);
  validateReleaseFixture007Image(steps, relativePath, findings);
  validateReleaseFixtureImage(steps, relativePath, findings);
  validateReleaseImageProvenanceAndExecution(steps, relativePath, findings);
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

export function validateFundingConfig(config, relativePath = ".github/FUNDING.yml") {
  const findings = [];
  if (!config || typeof config !== "object" || Array.isArray(config)) {
    return [`${relativePath}: funding configuration must be a mapping`];
  }

  const expectedKeys = new Set(["github", "ko_fi"]);
  for (const key of Object.keys(config)) {
    if (!expectedKeys.has(key)) {
      findings.push(`${relativePath}: unverified funding platform ${key}`);
    }
  }

  if (
    !Array.isArray(config.github)
    || config.github.length !== 1
    || config.github[0] !== "lusoris"
  ) {
    findings.push(`${relativePath}: github must contain only the verified lusoris sponsor identity`);
  }
  if (config.ko_fi !== "lusoris") {
    findings.push(`${relativePath}: ko_fi must use the verified lusoris identity`);
  }
  return findings;
}

export function validateIssueConfig(config, relativePath = ".github/ISSUE_TEMPLATE/config.yml") {
  const findings = [];
  if (!config || typeof config !== "object" || Array.isArray(config)) {
    return [`${relativePath}: issue configuration must be a mapping`];
  }
  if (config.blank_issues_enabled !== false) {
    findings.push(`${relativePath}: blank issues must remain disabled`);
  }

  const links = config.contact_links;
  if (!Array.isArray(links)) {
    findings.push(`${relativePath}: contact_links must be a sequence`);
    return findings;
  }

  const requiredUrls = new Set([
    "https://github.com/lusoris/20-watts-was-enough/security/advisories/new",
    "https://github.com/lusoris/20-watts-was-enough/blob/main/SUPPORT.md",
  ]);
  const seenUrls = new Set();
  for (const [index, link] of links.entries()) {
    if (
      !link
      || typeof link !== "object"
      || typeof link.name !== "string"
      || link.name.trim().length === 0
      || typeof link.about !== "string"
      || link.about.trim().length === 0
      || typeof link.url !== "string"
    ) {
      findings.push(`${relativePath}: contact_links[${index}] must define non-empty name, url, and about strings`);
      continue;
    }
    if (seenUrls.has(link.url)) {
      findings.push(`${relativePath}: duplicate contact link ${link.url}`);
    }
    seenUrls.add(link.url);
  }
  for (const url of requiredUrls) {
    if (!seenUrls.has(url)) {
      findings.push(`${relativePath}: missing required contact link ${url}`);
    }
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
    "check:prose",
    "test:code-shape",
    "test:go",
    "test:runtime",
    "test:prose",
    "test:release",
    "typecheck",
    "validate:policy",
    "validate:runtime",
    "validate:tooling",
    "test:policy",
  ]) {
    if (typeof scripts[script] !== "string" || scripts[script].trim().length === 0) {
      findings.push(`${relativePath}: missing required script ${script}`);
    }
  }

  for (const [name, command] of Object.entries(scripts)) {
    if (typeof command === "string" && command.includes("--test-isolation=")) {
      findings.push(
        `${relativePath}: script ${name} uses the unsupported --test-isolation spelling; use --experimental-test-isolation`,
      );
    }
  }

  if (manifest.engines?.node !== runtimePolicy.nodeVersion) {
    findings.push(`${relativePath}: engines.node must be exactly ${runtimePolicy.nodeVersion}`);
  }
  if (manifest.packageManager !== `npm@${runtimePolicy.npmVersion}`) {
    findings.push(`${relativePath}: packageManager must be npm@${runtimePolicy.npmVersion}`);
  }
  const expectedGoTest = "go -C tooling test ./... && go -C tooling vet ./...";
  if (scripts["test:go"] !== expectedGoTest) {
    findings.push(`${relativePath}: test:go must run the complete tooling test and vet gates`);
  }
  const expectedToolingValidation = "go -C tooling run ./cmd/20w experiment validate --root .. && go -C tooling run ./cmd/20w github sync-labels --root .. --check";
  if (scripts["validate:tooling"] !== expectedToolingValidation) {
    findings.push(`${relativePath}: validate:tooling must validate experiment and GitHub label authority without network access`);
  }
  if (
    typeof scripts.test !== "string"
    || !scripts.test.startsWith("npm run test:go && npm run validate:tooling && ")
  ) {
    findings.push(`${relativePath}: the aggregate test gate must begin with Go tests and real catalogue validation`);
  }
  if (scripts.pretest !== "npm run validate:runtime") {
    findings.push(`${relativePath}: pretest must fail fast on the exact Node runtime policy`);
  }
  if (!scripts.test.includes("npm run test:runtime")) {
    findings.push(`${relativePath}: the aggregate test gate must exercise the Node runtime policy tests`);
  }

  const exactVersion = /^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/u;
  const retiredHostingDependencies = new Set([
    "@cloudflare/vite-plugin",
    "@next/eslint-plugin-next",
    "next",
    "vinext",
    "wrangler",
  ]);
  for (const section of ["dependencies", "devDependencies"]) {
    for (const [name, version] of Object.entries(manifest[section] ?? {})) {
      if (typeof version !== "string" || !exactVersion.test(version)) {
        findings.push(`${relativePath}: ${section}.${name} must use an exact version; got ${JSON.stringify(version)}`);
      }
      if (retiredHostingDependencies.has(name)) {
        findings.push(`${relativePath}: ${section}.${name} belongs to the retired ChatGPT Site runtime`);
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

export function validateRetiredHostingPaths(root = defaultRoot) {
  return forbiddenLegacyHostingPaths
    .filter((relativePath) => fs.existsSync(path.join(root, relativePath)))
    .map((relativePath) => `${relativePath}: retired ChatGPT Site path must remain absent`);
}

function validateGoModule(root, findings) {
  const relativePath = "tooling/go.mod";
  const expected = [
    "module github.com/lusoris/20-watts-was-enough/tooling",
    "",
    `go ${runtimePolicy.goVersion}`,
    "",
    "require github.com/yuin/goldmark/v2 v2.0.0",
    "",
  ].join("\n");
  if (readText(root, relativePath).replaceAll("\r\n", "\n") !== expected) {
    findings.push(
      `${relativePath}: must declare the canonical module, Go ${runtimePolicy.goVersion}, and the reviewed Goldmark v2 dependency`,
    );
  }
  const expectedSums = [
    "github.com/yuin/goldmark/v2 v2.0.0 h1:P6JP1Px30eqo339He8dDFE8D0BSM21eQcbozLWH+E6g=",
    "github.com/yuin/goldmark/v2 v2.0.0/go.mod h1:G6M4/qOFtfn01/o14BU1UR2Lo5N3S9Qo7xCuz/sHjGQ=",
    "",
  ].join("\n");
  if (readText(root, "tooling/go.sum").replaceAll("\r\n", "\n") !== expectedSums) {
    findings.push("tooling/go.sum: must contain only the reviewed Goldmark v2 checksums");
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
    "Research conduct and disclosure",
    "Ethics, correction, and review",
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
  const manifestPath = ".github/labels.json";
  const manifest = parseYaml(root, manifestPath, findings);
  if (
    !manifest
    || typeof manifest !== "object"
    || Array.isArray(manifest)
    || manifest.schema !== 1
    || Object.keys(manifest).some((key) => !["schema", "labels"].includes(key))
    || !Array.isArray(manifest.labels)
    || manifest.labels.length === 0
  ) {
    findings.push(`${manifestPath}: label manifest must be a closed schema-1 object with a non-empty labels sequence`);
    return;
  }

  const labels = new Set();
  for (const [index, label] of manifest.labels.entries()) {
    if (!label || typeof label !== "object" || typeof label.name !== "string") {
      findings.push(`${manifestPath}: entry ${index} needs a string name`);
      continue;
    }
    if (Object.keys(label).some((key) => !["color", "description", "name"].includes(key))) {
      findings.push(`${manifestPath}: label ${label.name} contains an unknown field`);
    }
    if (labels.has(label.name)) {
      findings.push(`${manifestPath}: duplicate label ${label.name}`);
    }
    labels.add(label.name);
    if (typeof label.color !== "string" || !/^[0-9a-f]{6}$/iu.test(label.color)) {
      findings.push(`${manifestPath}: label ${label.name} needs a six-digit color`);
    }
    if (
      typeof label.description !== "string"
      || label.description.length === 0
      || label.description.length > 100
    ) {
      findings.push(`${manifestPath}: label ${label.name} needs a 1-100 character description`);
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

function loadScientificRuntimeLock(root, findings) {
  const relativePath = "experiments/workstation/fixture-019/python-environment.lock.json";
  try {
    return JSON.parse(readText(root, relativePath));
  } catch (error) {
    findings.push(`${relativePath}: invalid JSON: ${error.message}`);
    return undefined;
  }
}

function validateReleaseWorkflowPolicy(workflow, relativePath, lock, findings) {
  findings.push(...validateReleaseWorkflowObject(workflow, relativePath));
  findings.push(...validateReleaseExperimentImageWorkflowObject(workflow, relativePath));
  findings.push(...validateScientificRuntimeWorkflowObject(
    workflow,
    lock,
    "verify",
    relativePath,
  ));
  findings.push(...validateJavaScriptRuntimeWorkflowObject(workflow, "verify", relativePath));
  findings.push(...validateGoRuntimeWorkflowObject(workflow, "verify", relativePath));
}

function validateCiWorkflowPolicy(workflow, relativePath, lock, findings) {
  findings.push(...validateCiExperimentImageWorkflowObject(workflow, relativePath));
  findings.push(...validateScientificRuntimeWorkflowObject(
    workflow,
    lock,
    "quality",
    relativePath,
  ));
  findings.push(...validateJavaScriptRuntimeWorkflowObject(workflow, "quality", relativePath));
  findings.push(...validateGoRuntimeWorkflowObject(workflow, "quality", relativePath));
}

function validateWorkflowPolicy(workflow, relativePath, lock, findings) {
  findings.push(...validateWorkflowObject(workflow, relativePath));
  if (relativePath === ".github/workflows/release.yml") {
    validateReleaseWorkflowPolicy(workflow, relativePath, lock, findings);
  }
  if (relativePath === ".github/workflows/ci.yml") {
    validateCiWorkflowPolicy(workflow, relativePath, lock, findings);
  }
  if (relativePath === ".github/workflows/github-pages.yml") {
    findings.push(...validateJavaScriptRuntimeWorkflowObject(workflow, "build", relativePath));
  }
  if (relativePath === ".github/workflows/codeql.yml") {
    findings.push(...validateGoCodeQlWorkflowObject(workflow, relativePath));
  }
  if (relativePath === ".github/workflows/sync-labels.yml") {
    findings.push(...validateLabelSyncWorkflowObject(workflow, relativePath));
  }
}

function validateWorkflowFiles(root, findings, scientificRuntimeLock) {
  for (const relativePath of workflowFiles) {
    const workflow = parseYaml(root, relativePath, findings);
    if (workflow) {
      validateWorkflowPolicy(workflow, relativePath, scientificRuntimeLock, findings);
    }
  }
}

function validateIssuePolicy(root, findings) {
  const issueForms = [];
  for (const relativePath of issueFormFiles) {
    const form = parseYaml(root, relativePath, findings);
    if (form) {
      issueForms.push([relativePath, form]);
      findings.push(...validateIssueForm(form, relativePath));
      if (relativePath === ".github/ISSUE_TEMPLATE/experiment-protocol-problem.yml") {
        findings.push(...validateExperimentReportIdentity(form, relativePath));
      }
    }
  }
  validateLabels(root, findings, issueForms);

  const issueConfigPath = ".github/ISSUE_TEMPLATE/config.yml";
  const issueConfig = parseYaml(root, issueConfigPath, findings);
  if (issueConfig) findings.push(...validateIssueConfig(issueConfig, issueConfigPath));

  const fundingPath = ".github/FUNDING.yml";
  const funding = parseYaml(root, fundingPath, findings);
  if (funding) findings.push(...validateFundingConfig(funding, fundingPath));
}

export function validateExperimentReportIdentity(
  form,
  relativePath = ".github/ISSUE_TEMPLATE/experiment-protocol-problem.yml",
) {
  const findings = [];
  const items = Array.isArray(form?.body) ? form.body : [];
  const digest = items.find((item) => item?.id === "released_image_digest");
  const releaseTag = items.find((item) => item?.id === "release_tag");
  const execution = items.find((item) => item?.id === "container_execution");
  if (
    digest?.type !== "input"
    || !digest.attributes?.description?.includes("image@sha256")
    || !digest.attributes?.description?.includes("tag alone is not sufficient")
  ) {
    findings.push(`${relativePath}: experiment reports must request an exact released image@sha256 identity`);
  }
  if (
    releaseTag?.type !== "input"
    || !releaseTag.attributes?.description?.includes("separately from the immutable digest")
  ) {
    findings.push(`${relativePath}: experiment reports must keep the release tag separate from the image digest`);
  }
  if (
    execution?.type !== "textarea"
    || !execution.attributes?.description?.includes("architecture")
    || !execution.attributes?.description?.includes("NO_RESULT receipt")
  ) {
    findings.push(`${relativePath}: experiment reports must capture the bounded container execution identity`);
  }
  return findings;
}

function validateCitationAndOwnership(root, findings) {
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
}

export function validateRepositoryPolicy(root = defaultRoot) {
  const findings = [];

  for (const relativePath of requiredFiles) {
    if (!fs.existsSync(path.join(root, relativePath))) {
      findings.push(`${relativePath}: required policy surface is missing`);
    }
  }
  findings.push(...validateRetiredHostingPaths(root));

  if (findings.some((finding) => finding.includes("required policy surface is missing"))) {
    return findings;
  }

  validatePackage(root, findings);
  validateGoModule(root, findings);
  validatePrinciples(root, findings);
  validateRenovate(root, findings);

  const scientificRuntimeLock = loadScientificRuntimeLock(root, findings);

  if (scientificRuntimeLock) {
    findings.push(...validateScientificRuntimeLock(scientificRuntimeLock));
  }
  validateScientificRequirements(root, findings);
  validateWorkflowFiles(root, findings, scientificRuntimeLock);
  validateIssuePolicy(root, findings);
  validateCitationAndOwnership(root, findings);

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
