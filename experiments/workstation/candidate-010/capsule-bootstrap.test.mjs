import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { promisify } from "node:util";
import {
  CAPSULE_CHILD_RELATIVE_PATH,
  CAPSULE_CONFIRMATION_ENTRY_RELATIVE_PATH,
  CAPSULE_PROMOTION_ENTRY_RELATIVE_PATH,
  launchVerifiedCapsuleAction,
  launchVerifiedCapsuleDryRun,
  sanitizeCapsuleEnvironment,
  validateCapsuleLaunchPrecommit,
  validateCapsuleLaunchReceipt,
} from "./capsule-bootstrap.mjs";
import { buildExecutionCapsule, destroyExecutionCapsule } from "./execution-capsule.mjs";
import { captureRuntimeIdentity } from "./runtime-identity.mjs";
const execFileAsync = promisify(execFile);
const candidate = "experiments/workstation/candidate-010";
const authorityPath = `${candidate}/capsule-execution-authority.mjs`;
const sharedChild = path.resolve(candidate, "capsule-child.mjs");
const sharedEntry = path.resolve(candidate, "capsule-confirmation-entry.mjs");
async function git(root, ...args) {
  return execFileAsync("git", ["-C", root, ...args], { windowsHide: true });
}

async function put(root, relative, body) {
  const target = path.join(root, ...relative.split("/"));
  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, body);
}
async function fixture({ successfulConfirmation = false } = {}) {
    const base = await mkdtemp(path.join(os.tmpdir(), "20w execution ü "));
    const repositoryRoot = path.join(base, "repo space ü");
    const executionParent = path.join(base, "capsules space ü");
    const requestParent = path.join(base, "requests space ü");
    await mkdir(repositoryRoot);
    await mkdir(executionParent);
    await mkdir(requestParent);
    await put(repositoryRoot, CAPSULE_CHILD_RELATIVE_PATH, await readFile(sharedChild));
    const confirmationEntry = successfulConfirmation
      ? `import { assertCapsuleExecutionAuthority } from "./capsule-execution-authority.mjs";
export async function executeCandidate010Confirmation(input) {
  await assertCapsuleExecutionAuthority(input.capability);
  if (
    input.request.confirmation_request.value === "interrupt-resume"
    && input.request.confirmation_request.resume !== true
  ) throw new Error("declared interruption fixture");
  return {
    complete: true,
    validation: { valid: true, request_sha256: input.request.confirmation_request_sha256 },
    result: { accepted: input.request.confirmation_request.value },
  };
}\n`
      : await readFile(sharedEntry);
    await put(repositoryRoot, CAPSULE_CONFIRMATION_ENTRY_RELATIVE_PATH, confirmationEntry);
    await put(repositoryRoot, CAPSULE_PROMOTION_ENTRY_RELATIVE_PATH, `
export async function buildPromotionEvidence(paths) {
  return { schema: 1, built: true, run_directory: paths.runDirectory };
}
export async function validatePromotionEvidence(evidence) {
  return { valid: evidence?.built === true, evidence_sha256: "e".repeat(64) };
}\n`);
    await put(repositoryRoot, authorityPath, `const active = new WeakSet();
export async function withVerifiedCapsuleExecutionAuthority(input, callback) {
  if (!input.executionCapsule || !input.expectedSourceBundle) throw new Error("missing authority input");
  const capability = Object.freeze(() => {});
  active.add(capability);
  try { return await callback(capability); } finally { active.delete(capability); }
}
export async function assertCapsuleExecutionAuthority(capability) {
  if (!active.has(capability)) throw new Error("revoked capability");
  return { valid: true };
}\n`);
    await put(repositoryRoot, "package.json", JSON.stringify({ name: "capsule-fixture", version: "1.0.0", type: "module" }));
    await put(repositoryRoot, "package-lock.json", JSON.stringify({ name: "capsule-fixture", version: "1.0.0", lockfileVersion: 3, requires: true, packages: { "": { name: "capsule-fixture", version: "1.0.0" } } }));
    const sourcePaths = [
      CAPSULE_CHILD_RELATIVE_PATH,
      CAPSULE_CONFIRMATION_ENTRY_RELATIVE_PATH,
      CAPSULE_PROMOTION_ENTRY_RELATIVE_PATH,
      authorityPath,
      "package.json",
      "package-lock.json",
    ];
    await git(repositoryRoot, "init", "--quiet");
    await git(repositoryRoot, "config", "user.name", "Capsule Test");
    await git(repositoryRoot, "config", "user.email", "capsule@example.invalid");
    await git(repositoryRoot, "config", "commit.gpgsign", "false");
    await git(repositoryRoot, "config", "core.autocrlf", "false");
    await git(repositoryRoot, "add", "--", ...sourcePaths);
    await git(repositoryRoot, "commit", "--quiet", "-m", "fixture");
    const runtimeIdentity = await captureRuntimeIdentity({
      repositoryRoot,
      candidateRoot: path.join(repositoryRoot, ...candidate.split("/")),
    });
    const executionCapsule = await buildExecutionCapsule({
      repositoryRoot,
      executionParent,
      runtimeIdentity,
      sourcePaths,
      candidateDirectory: candidate,
    });
    return { base, requestParent, executionCapsule };
}
async function cleanup(value) {
  if (value.executionCapsule) {
    await destroyExecutionCapsule(value.executionCapsule).catch(() => false);
  }
  await rm(value.base, { recursive: true, force: true });
}
test("full execution-capsule handshake binds source, dependencies, runtime, and canonical receipt", async () => {
  const value = await fixture();
  try {
    const result = await launchVerifiedCapsuleDryRun({
      executionCapsule: value.executionCapsule,
      requestParent: value.requestParent,
    });
    assert.equal(result.status, "verified");
    assert.equal(result.action, "verified-handshake");
    assert.equal(result.parent_pre_verification_sha256, result.parent_post_verification_sha256);
    assert.equal(result.receipt.child_pre_verification_sha256, result.receipt.child_post_verification_sha256);
    assert.equal(result.launch_receipt.parent_pre_verification_sha256, result.launch_receipt.parent_post_verification_sha256);
    assert.equal(result.launch_receipt.child_pre_verification_sha256, result.launch_receipt.child_post_verification_sha256);
    assert.equal(validateCapsuleLaunchReceipt(result.launch_receipt, {
      action: "verified-handshake",
      executionDescriptorSha256: value.executionCapsule.descriptor.descriptor_sha256,
      sourceInventorySha256: value.executionCapsule.descriptor.source.inventory_sha256,
      dependencyInventorySha256: value.executionCapsule.descriptor.dependencies.inventory.inventory_sha256,
      runtimeIdentitySha256: value.executionCapsule.descriptor.runtime_identity.identity_sha256,
    }).valid, true);
    assert.ok(result.launch_receipt.request_bytes > 0);
    assert.ok(result.launch_receipt.stdout_bytes > 0);
    assert.ok(result.launch_receipt.elapsed_ms >= 0);
    assert.equal(
      result.launch_receipt.elapsed_semantics,
      "inclusive-parent-envelope; child phases are nested and non-additive",
    );
    assert.ok(result.launch_receipt.parent_request_setup_ms < result.launch_receipt.elapsed_ms);
    assert.ok(result.launch_receipt.child_action_elapsed_ms >= 0);
    assert.notEqual(
      result.launch_receipt.parent_request_setup_ms,
      result.launch_receipt.elapsed_ms,
      "inclusive action time must never be labeled as setup overhead",
    );
    assert.equal(validateCapsuleLaunchPrecommit(result.launch_precommit, {
      action: "verified-handshake",
      sanitizedEnvironmentSha256: result.launch_receipt.sanitized_environment_sha256,
      execArgvSha256: result.launch_receipt.exec_argv_sha256,
      parentPreVerificationSha256: result.launch_receipt.parent_pre_verification_sha256,
    }).valid, true);
    assert.ok(!JSON.stringify(result.receipt).includes(value.base));
    const forgedTiming = { ...result.launch_receipt, elapsed_ms: -1 };
    await assert.rejects(
      async () => validateCapsuleLaunchReceipt(forgedTiming),
      /canonical digest|timing evidence/,
    );
  } finally {
    await cleanup(value);
  }
});

test("fresh-child resume reuses an exact precommit while operational resume stays envelope-bound", async () => {
  const value = await fixture({ successfulConfirmation: true });
  try {
    const common = {
      executionCapsule: value.executionCapsule,
      action: "candidate-010-confirmation",
      expectedSourceBundle: { source_sha256: "a".repeat(64) },
      requestParent: value.requestParent,
    };
    const first = await launchVerifiedCapsuleAction({
      ...common,
      confirmationRequest: { value: "resume-fixture", resume: false },
    });
    const resumed = await launchVerifiedCapsuleAction({
      ...common,
      confirmationRequest: { value: "resume-fixture", resume: true },
      launchPrecommit: first.launch_precommit,
    });
    assert.equal(
      resumed.launch_receipt.launch_request_sha256,
      first.launch_receipt.launch_request_sha256,
    );
    assert.equal(
      resumed.launch_receipt.request_nonce_sha256,
      first.launch_receipt.request_nonce_sha256,
    );
    assert.deepEqual(resumed.launch_precommit, first.launch_precommit);

    await assert.rejects(
      launchVerifiedCapsuleAction({
        ...common,
        confirmationRequest: { value: "changed-science", resume: true },
        launchPrecommit: first.launch_precommit,
      }),
      /stable action request/,
    );
    const tampered = {
      ...first.launch_precommit,
      request_nonce: "0".repeat(64),
    };
    await assert.rejects(
      launchVerifiedCapsuleAction({
        ...common,
        confirmationRequest: { value: "resume-fixture", resume: true },
        launchPrecommit: tampered,
      }),
      /precommit shape or canonical identity/,
    );
  } finally {
    await cleanup(value);
  }
});

test("pre-spawn callback exposes the validated precommit for interrupted child resume", async () => {
  const value = await fixture({ successfulConfirmation: true });
  let persistedPrecommit;
  try {
    const common = {
      executionCapsule: value.executionCapsule,
      action: "candidate-010-confirmation",
      expectedSourceBundle: { source_sha256: "a".repeat(64) },
      requestParent: value.requestParent,
    };
    await assert.rejects(
      launchVerifiedCapsuleAction({
        ...common,
        confirmationRequest: { value: "interrupt-resume", resume: false },
        onLaunchPrecommit: async (token) => { persistedPrecommit = token; },
      }),
      /declared interruption fixture/,
    );
    assert.equal(validateCapsuleLaunchPrecommit(persistedPrecommit, {
      action: "candidate-010-confirmation",
    }).valid, true);
    const resumed = await launchVerifiedCapsuleAction({
      ...common,
      confirmationRequest: { value: "interrupt-resume", resume: true },
      launchPrecommit: persistedPrecommit,
    });
    assert.equal(
      resumed.launch_precommit.launch_request_sha256,
      persistedPrecommit.launch_request_sha256,
    );
  } finally {
    await cleanup(value);
  }
});

test("fixed promotion action builds and validates evidence inside fresh capsule authority", async () => {
  const value = await fixture();
  try {
    const result = await launchVerifiedCapsuleAction({
      executionCapsule: value.executionCapsule,
      action: "candidate-010-promotion-evidence",
      promotionRequest: {
        operation: "build",
        paths: { runDirectory: "fixture-run" },
      },
      expectedSourceBundle: { source_sha256: "a".repeat(64) },
      requestParent: value.requestParent,
    });
    assert.deepEqual(result.action_result, {
      schema: 1,
      built: true,
      run_directory: "fixture-run",
    });
    assert.equal(result.receipt.action_validation.valid, true);
    assert.equal(result.launch_receipt.action_entry_relative_path, CAPSULE_PROMOTION_ENTRY_RELATIVE_PATH);
    assert.equal(validateCapsuleLaunchReceipt(result.launch_receipt, {
      action: "candidate-010-promotion-evidence",
    }).valid, true);
  } finally {
    await cleanup(value);
  }
});

test("child refuses execArgv and loader or preload environment injection before reading a request", async () => {
  await assert.rejects(
    execFileAsync(process.execPath, ["--no-warnings", sharedChild, "missing-request.json"], {
      env: sanitizeCapsuleEnvironment(),
      windowsHide: true,
    }),
    (error) => /unexpected Node execArgv/.test(error.stderr),
  );
  await assert.rejects(
    execFileAsync(process.execPath, [sharedChild, "missing-request.json"], {
      env: { ...sanitizeCapsuleEnvironment(), IMPORT_HOOK: "hostile.mjs" },
      windowsHide: true,
    }),
    (error) => /unexpected child environment variable IMPORT_HOOK/.test(error.stderr),
  );
});

test("child refuses an allowlisted actual environment key absent from the bound sanitized identity", async () => {
  const value = await fixture();
  try {
    await assert.rejects(
      launchVerifiedCapsuleDryRun({
        executionCapsule: value.executionCapsule,
        requestParent: value.requestParent,
        environmentInherited: {
          SYSTEMROOT: process.env.SYSTEMROOT,
          WINDIR: process.env.WINDIR,
          TEMP: process.env.TEMP,
        },
      }),
      /launch binding is invalid/,
    );
  } finally {
    await cleanup(value);
  }
});

test("confirmation dynamically uses fixed authority and entry and binds result/validation hashes", async () => {
  const value = await fixture({ successfulConfirmation: true });
  try {
    const result = await launchVerifiedCapsuleAction({
      executionCapsule: value.executionCapsule,
      action: "candidate-010-confirmation",
      confirmationRequest: { value: "ok" },
      expectedSourceBundle: { source_sha256: "a".repeat(64) },
      requestParent: value.requestParent,
    });
    assert.equal(result.receipt.action, "candidate-010-confirmation");
    assert.match(result.receipt.result_sha256, /^[0-9a-f]{64}$/);
    assert.match(result.receipt.validation_sha256, /^[0-9a-f]{64}$/);
  } finally {
    await cleanup(value);
  }
});

test("production confirmation entry rejects raw confirmation seeds before runner import", async () => {
  const value = await fixture();
  try {
    await assert.rejects(() => launchVerifiedCapsuleAction({
      executionCapsule: value.executionCapsule,
      action: "candidate-010-confirmation",
      confirmationRequest: {
        config: { seeds: [1] },
        scenarios: [{ id: "fixture" }],
        outputDirectory: "unused",
        release: {
          bindingRoot: "unused",
          releasePath: "unused",
          disjointWith: "unused",
        },
      },
      expectedSourceBundle: { source_sha256: "a".repeat(64) },
      requestParent: value.requestParent,
    }), /Raw confirmation seeds are forbidden/);
  } finally {
    await cleanup(value);
  }
});

test("sanitized environment rejects Node, path, preload and inspector injection", () => {
  assert.deepEqual(sanitizeCapsuleEnvironment({
    inherited: {
      SystemRoot: "C:\\Windows",
      TEMP: "C:\\Temp",
      PATH: "bad",
      NODE_OPTIONS: "--import=x",
    },
  }), { PATH: "bad", SYSTEMROOT: "C:\\Windows", TEMP: "C:\\Temp" });
  for (const key of ["NODE_OPTIONS", "NODE_PATH", "PATH", "IMPORT_HOOK", "INSPECT_BRK"]) {
    assert.throws(
      () => sanitizeCapsuleEnvironment({ overrides: { [key]: "bad" } }),
      /not allowlisted/,
    );
  }
});
