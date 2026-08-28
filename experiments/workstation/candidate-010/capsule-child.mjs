import { createHash } from "node:crypto";
import { createReadStream } from "node:fs";
import { lstat, readdir, realpath } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { pathToFileURL } from "node:url";
import { readStableOpenedFile } from "./opened-file.mjs";

const PROTOCOL = "candidate-010-capsule-bootstrap-v2";
const AUTHORITY = "experiments/workstation/candidate-010/capsule-execution-authority.mjs";
const ENTRY = "experiments/workstation/candidate-010/capsule-confirmation-entry.mjs";
const PROMOTION_ENTRY = "experiments/workstation/candidate-010/promotion-evidence.mjs";
const ALLOWED_ENVIRONMENT = new Set([
  "SYSTEMROOT", "WINDIR", "TEMP", "TMP", "TMPDIR", "HOMEDRIVE", "HOMEPATH",
  "LOGONSERVER", "PATH", "SYSTEMDRIVE", "USERDOMAIN", "USERNAME", "USERPROFILE",
]);
const REQUEST_FIELDS = Object.freeze([
  "schema",
  "protocol",
  "action",
  "child_relative_path",
  "confirmation_entry_relative_path",
  "promotion_entry_relative_path",
  "action_entry_relative_path",
  "request_nonce_sha256",
  "sanitized_environment_sha256",
  "exec_argv_sha256",
  "parent_pre_verification_sha256",
  "execution_descriptor_sha256",
  "runtime_identity_sha256",
  "action_request_sha256",
  "request_id",
  "launch_request_sha256",
  "execution_capsule",
  "expected_source_bundle",
  "confirmation_request",
  "promotion_request",
  "request_nonce",
  "sanitized_environment",
  "expected_exec_argv",
]);

function refuse(reason) {
  throw new Error(`Capsule child refused: ${reason}`);
}

function canonical(value) {
  if (value === null || typeof value === "boolean" || typeof value === "string") {
    return JSON.stringify(value);
  }
  if (typeof value === "number" && Number.isFinite(value))
    return JSON.stringify(value);
  if (Array.isArray(value))
    return `[${value.map(canonical).join(",")}]`;
  if (value && typeof value === "object") {
    return `{${Object.keys(value).sort().map((key) => (`${JSON.stringify(key)}:${canonical(value[key])}`)).join(",")}}`;
  }
  return refuse(`non-canonical value ${typeof value}`);
}
const digest = (value) => createHash("sha256").update(canonical(value)).digest("hex");

function stableActionRequest(action, confirmationRequest, promotionRequest) {
  if (action !== "candidate-010-confirmation" || !confirmationRequest) {
    return action === "candidate-010-promotion-evidence" ? promotionRequest : null;
  }
  const stable = { ...confirmationRequest };
  delete stable.resume;
  delete stable.stopAfterRecords;
  return stable;
}
function inside(root, target) {
  const relative = path.relative(root, target);
  return relative === "" || (!relative.startsWith("..") && !path.isAbsolute(relative));
}
async function hashFile(file) {
  const hash = createHash("sha256");
  let bytes = 0;
  for await (const chunk of createReadStream(file)) {
    hash.update(chunk);
    bytes += chunk.length;
  }
  return { bytes, sha256: hash.digest("hex") };
}
async function realUnlinkedDirectory(value, label) {
  const absolute = path.resolve(value);
  const information = await lstat(absolute);
  if (information.isSymbolicLink() || !information.isDirectory()) {
    refuse(`${label} is linked or invalid`);
  }
  return realpath(absolute);
}
async function containedFile(rootValue, targetValue, label) {
  const root = path.resolve(rootValue);
  const target = path.resolve(targetValue);
  if (!inside(root, target))
    refuse(`${label} escapes root`);
  let cursor = root;
  for (const part of path.relative(root, target).split(path.sep).filter(Boolean)) {
    cursor = path.join(cursor, part);
    if ((await lstat(cursor)).isSymbolicLink())
      refuse(`${label} traverses link`);
  }
  const [rootReal, targetReal, information] = await Promise.all([
    realpath(root), realpath(target), lstat(target),
  ]);
  if (!information.isFile() || !inside(rootReal, targetReal)) {
    refuse(`${label} is not contained regular file`);
  }
  return targetReal;
}
async function inventory(rootValue, prefix = "") {
  const root = await realUnlinkedDirectory(rootValue, "inventory root");
  const rows = [];
  async function visit(directory, relative = "") {
    const entries = await readdir(directory, { withFileTypes: true });
    entries.sort((left, right) => left.name.localeCompare(right.name));
    for (const entry of entries) {
      const entryRelative = relative ? `${relative}/${entry.name}` : entry.name;
      const absolute = path.join(directory, entry.name);
      if (entry.isSymbolicLink())
        refuse(`linked inventory entry ${entryRelative}`);
      if (entry.isDirectory()) {
        const resolved = await realpath(absolute);
        if (!inside(root, resolved))
          refuse(`inventory directory escapes ${entryRelative}`);
        await visit(absolute, entryRelative);
      }
      else if (entry.isFile()) {
        await containedFile(root, absolute, `inventory file ${entryRelative}`);
        rows.push({
          path: prefix ? `${prefix}/${entryRelative}` : entryRelative,
          ...await hashFile(absolute),
        });
      }
      else {
        refuse(`unsupported inventory entry ${entryRelative}`);
      }
    }
  }
  await visit(root);
  return rows.sort((left, right) => left.path.localeCompare(right.path));
}
function descriptorBody(descriptor) {
  const body = { ...descriptor };
  delete body.descriptor_sha256;
  return body;
}

function assertProcessBoundary() {
  if (process.execArgv.length !== 0) {
    refuse("unexpected Node execArgv, loader, preload, or inspector arguments");
  }
  for (const key of Object.keys(process.env)) {
    const upper = key.toUpperCase();
    if (!ALLOWED_ENVIRONMENT.has(upper)
      || upper.startsWith("NODE_")
      || /IMPORT|PRELOAD|INSPECT|LOADER/.test(upper)) {
      refuse(`unexpected child environment variable ${key}`);
    }
  }
}
function requestShape(request) {
  const { envelope_sha256: envelopeSha256, ...body } = request ?? {};
  const descriptor = body.execution_capsule?.descriptor;
  if (Object.keys(body).sort().join("\0") !== [...REQUEST_FIELDS].sort().join("\0")
    || envelopeSha256 !== digest(body)
    || body.schema !== 1
    || body.protocol !== PROTOCOL
    || ![
      "verified-handshake",
      "candidate-010-confirmation",
      "candidate-010-promotion-evidence",
    ].includes(body.action)
    || descriptor?.descriptor_sha256 !== body.execution_descriptor_sha256
    || descriptor.descriptor_sha256 !== digest(descriptorBody(descriptor))
    || descriptor.layout?.shared_node_modules !== false
    || descriptor.limits?.shared_node_modules_allowed !== false
    || descriptor.limits?.execution_authority !== "none") {
    refuse("request envelope or execution descriptor is invalid");
  }
  const binding = {
    schema: 1,
    protocol: PROTOCOL,
    action: body.action,
    child_relative_path: body.child_relative_path,
    confirmation_entry_relative_path: body.confirmation_entry_relative_path,
    promotion_entry_relative_path: body.promotion_entry_relative_path,
    action_entry_relative_path: body.action_entry_relative_path,
    request_nonce_sha256: body.request_nonce_sha256,
    sanitized_environment_sha256: body.sanitized_environment_sha256,
    exec_argv_sha256: body.exec_argv_sha256,
    parent_pre_verification_sha256: body.parent_pre_verification_sha256,
    execution_descriptor_sha256: body.execution_descriptor_sha256,
    runtime_identity_sha256: body.runtime_identity_sha256,
    action_request_sha256: digest(stableActionRequest(
      body.action,
      body.confirmation_request,
      body.promotion_request,
    )),
  };
  const launchSha256 = digest(binding);
  const expectedActionEntry = body.action === "candidate-010-confirmation"
    ? ENTRY
    : body.action === "candidate-010-promotion-evidence"
      ? PROMOTION_ENTRY
      : body.child_relative_path;
  if (body.launch_request_sha256 !== launchSha256
    || body.request_id !== `c010-capsule-request-${launchSha256}`
    || body.confirmation_entry_relative_path !== ENTRY
    || body.promotion_entry_relative_path !== PROMOTION_ENTRY
    || !/^[0-9a-f]{64}$/.test(body.request_nonce ?? "")
    || body.action_entry_relative_path !== expectedActionEntry
    || body.request_nonce_sha256 !== digest(body.request_nonce)
    || body.sanitized_environment_sha256 !== digest(body.sanitized_environment)
    || body.exec_argv_sha256 !== digest(body.expected_exec_argv)
    || canonical(body.expected_exec_argv) !== canonical([])
    || canonical(body.sanitized_environment) !== canonical(Object.fromEntries(
      Object.entries(process.env).sort(([left], [right]) => left.localeCompare(right)),
    )))
    refuse("launch binding is invalid");
  return body;
}
async function validateRuntime(body) {
  const expected = body.execution_capsule.descriptor.runtime_identity;
  const executable = path.resolve(process.execPath);
  const resolved = await realpath(executable);
  const identity = await hashFile(resolved);
  if (expected.identity_sha256 !== body.runtime_identity_sha256
    || expected.runtime.version !== process.version
    || expected.runtime.platform !== process.platform
    || expected.runtime.arch !== process.arch
    || path.resolve(expected.runtime.exec_path) !== executable
    || path.resolve(expected.runtime.exec_path_realpath) !== resolved
    || expected.runtime.executable_sha256 !== identity.sha256
    || expected.runtime.executable_bytes !== identity.bytes)
    refuse("runtime identity differs");
  return identity;
}
async function verifyBuiltIns(body) {
  const { descriptor, local } = body.execution_capsule;
  const outer = await realUnlinkedDirectory(local.outer_root, "outer root");
  const source = await realUnlinkedDirectory(local.source_root, "source root");
  const dependencies = await realUnlinkedDirectory(local.dependency_root, "dependency root");
  if (!inside(outer, source)
    || !inside(outer, dependencies)
    || path.resolve(dependencies) !== path.resolve(outer, "node_modules"))
    refuse("capsule layout or dependency root is invalid");
  const sourceRows = await inventory(source);
  const dependencyRows = await inventory(dependencies, "node_modules");
  if (canonical(sourceRows) !== canonical(descriptor.source.inventory.files)
    || canonical(dependencyRows) !== canonical(descriptor.dependencies.inventory.files))
    refuse("source or dependency inventory differs");
  const child = await containedFile(source, path.join(source, ...body.child_relative_path.split("/")), "fixed child");
  if (path.resolve(process.argv[1]) !== child
    || !descriptor.source.source_paths.includes(body.child_relative_path))
    refuse("running entrypoint is not fixed/bound child");
  const executableIdentity = await validateRuntime(body);
  return digest({
    descriptor_sha256: descriptor.descriptor_sha256,
    source_inventory_sha256: descriptor.source.inventory_sha256,
    dependency_inventory_sha256: descriptor.dependencies.inventory.inventory_sha256,
    runtime_identity_sha256: body.runtime_identity_sha256,
    child_relative_path: body.child_relative_path,
    action_entry_relative_path: body.action_entry_relative_path,
    request_nonce_sha256: body.request_nonce_sha256,
    sanitized_environment_sha256: body.sanitized_environment_sha256,
    exec_argv_sha256: body.exec_argv_sha256,
    parent_pre_verification_sha256: body.parent_pre_verification_sha256,
    runtime_executable_sha256: executableIdentity.sha256,
  });
}
async function execute(body) {
  if (body.action === "verified-handshake") {
    return {
      result: { handshake: "verified" },
      validation: { valid: true, action: body.action },
    };
  }
  if (!body.expected_source_bundle) {
    refuse("capsule execution authorities are missing");
  }
  const source = body.execution_capsule.local.source_root;
  await containedFile(source, path.join(source, ...AUTHORITY.split("/")), "fixed authority");
  await containedFile(source, path.join(source, ...body.action_entry_relative_path.split("/")), "fixed action entry");
  const authority = await import("./capsule-execution-authority.mjs");
  if (typeof authority.withVerifiedCapsuleExecutionAuthority !== "function") {
    refuse("fixed authority export is missing");
  }
  return authority.withVerifiedCapsuleExecutionAuthority({
    executionCapsule: body.execution_capsule,
    expectedSourceBundle: body.expected_source_bundle,
  }, async (capability) => {
    if (body.action === "candidate-010-promotion-evidence") {
      if (!body.promotion_request || typeof body.promotion_request !== "object") {
        refuse("promotion request is missing");
      }
      const keys = Object.keys(body.promotion_request).sort();
      const expectedKeys = body.promotion_request.operation === "validate"
        ? ["evidence", "operation", "paths"]
        : ["operation", "paths"];
      if (canonical(keys) !== canonical(expectedKeys)
        || !["build", "validate"].includes(body.promotion_request.operation)) {
        refuse("promotion request shape or operation is invalid");
      }
      const promotion = await import("./promotion-evidence.mjs");
      if (typeof promotion.buildPromotionEvidence !== "function"
        || typeof promotion.validatePromotionEvidence !== "function") {
        refuse("fixed promotion evidence API is missing");
      }
      const paths = {
        ...body.promotion_request.paths,
        executionAuthority: capability,
        executionCapsule: body.execution_capsule,
        expectedSourceBundle: body.expected_source_bundle,
      };
      const evidence = body.promotion_request.operation === "build"
        ? await promotion.buildPromotionEvidence(paths)
        : body.promotion_request.evidence;
      const validation = await promotion.validatePromotionEvidence(evidence, paths);
      if (validation?.valid !== true) refuse("promotion evidence validation failed");
      return { result: evidence, validation };
    }
    if (!body.confirmation_request) refuse("confirmation request is missing");
    const entry = await import("./capsule-confirmation-entry.mjs");
    if (typeof entry.executeCandidate010Confirmation !== "function") {
      refuse("fixed confirmation entry export is missing");
    }
    const boundRequest = {
      schema: 1,
      contract_version: "candidate-010.capsule-confirmation-entry.v1",
      action: body.action,
      launch_request_sha256: body.launch_request_sha256,
      request_nonce_sha256: body.request_nonce_sha256,
      sanitized_environment_sha256: body.sanitized_environment_sha256,
      exec_argv_sha256: body.exec_argv_sha256,
      parent_pre_verification_sha256: body.parent_pre_verification_sha256,
      execution_descriptor_sha256: body.execution_descriptor_sha256,
      runtime_identity_sha256: body.runtime_identity_sha256,
      confirmation_request_sha256: digest(body.confirmation_request),
      confirmation_request: body.confirmation_request,
    };
    const output = await entry.executeCandidate010Confirmation({
      request: boundRequest,
      capability,
      executionCapsule: body.execution_capsule,
      expectedSourceBundle: body.expected_source_bundle,
    });
    if (output?.complete !== true || output.validation?.valid !== true) {
      refuse("confirmation entry did not return complete valid output");
    }
    return { result: output.result, validation: output.validation };
  });
}
export async function runCapsuleChild(requestPath) {
  assertProcessBoundary();
  if (typeof requestPath !== "string" || !requestPath)
    refuse("one request path is required");
  const requestFile = path.resolve(requestPath);
  const requestBytes = await readStableOpenedFile(requestFile, { label: "capsule request" });
  const body = requestShape(JSON.parse(requestBytes.toString("utf8")));
  const childPreVerificationStarted = performance.now();
  const pre = await verifyBuiltIns(body);
  const childPreVerificationMs = performance.now() - childPreVerificationStarted;
  const actionStarted = performance.now();
  const output = await execute(body);
  const actionElapsedMs = performance.now() - actionStarted;
  const childPostVerificationStarted = performance.now();
  const post = await verifyBuiltIns(body);
  const childPostVerificationMs = performance.now() - childPostVerificationStarted;
  if (pre !== post)
    refuse("child pre/post verification differs");
  const receiptBody = {
    schema: 1,
    protocol: PROTOCOL,
    status: "verified",
    action: body.action,
    request_id: body.request_id,
    launch_request_sha256: body.launch_request_sha256,
    request_nonce_sha256: body.request_nonce_sha256,
    sanitized_environment_sha256: body.sanitized_environment_sha256,
    exec_argv_sha256: body.exec_argv_sha256,
    parent_pre_verification_sha256: body.parent_pre_verification_sha256,
    execution_descriptor_sha256: body.execution_descriptor_sha256,
    source_inventory_sha256: body.execution_capsule.descriptor.source.inventory_sha256,
    dependency_inventory_sha256: body.execution_capsule.descriptor.dependencies.inventory.inventory_sha256,
    runtime_identity_sha256: body.runtime_identity_sha256,
    runtime_executable_sha256: body.execution_capsule.descriptor.runtime_identity.runtime.executable_sha256,
    child_relative_path: body.child_relative_path,
    action_entry_relative_path: body.action_entry_relative_path,
    child_pre_verification_sha256: pre,
    child_post_verification_sha256: post,
    result_sha256: digest(output.result),
    validation_sha256: digest(output.validation),
    request_bytes: requestBytes.length,
    child_pre_verification_ms: childPreVerificationMs,
    action_elapsed_ms: actionElapsedMs,
    child_post_verification_ms: childPostVerificationMs,
    action_result: output.result,
    action_validation: output.validation,
  };
  return { ...receiptBody, receipt_sha256: digest(receiptBody) };
}
async function main() {
  if (process.argv.length !== 3)
    refuse("exactly one request argument is required");
  process.stdout.write(`${canonical(await runCapsuleChild(process.argv[2]))}\n`);
}
if (process.argv[1] && pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url) {
  main().catch((error) => {
    process.stderr.write(`${error.message}\n`);
    process.exitCode = 1;
  });
}
