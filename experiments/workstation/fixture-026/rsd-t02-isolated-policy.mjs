import { spawn } from "node:child_process";
import { createHash } from "node:crypto";
import { lstat, readFile, realpath } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { canonicalize, sha256Hex } from "../lib/checkpoint-ledger.mjs";
import {
  FIXTURE_026_RSD_T02_ACTIVE_ARM_IDS,
  assertFixture026RsdT02PolicyBaseResult,
  attachFixture026RsdT02ArmResponse,
  buildFixture026RsdT02ArmCommitmentFromResponses,
  buildFixture026RsdT02SystemPacket,
  validateFixture026RsdT02ArmBankConfig,
} from "./rsd-t02-arm-bank.mjs";

export const FIXTURE_026_RSD_T02_ISOLATED_POLICY_VERSION =
  "fixture-026.rsd-t02-isolated-policy.v1";
export const FIXTURE_026_RSD_T02_ISOLATED_REQUEST_VERSION =
  "fixture-026.rsd-t02-isolated-request.v1";
export const FIXTURE_026_RSD_T02_ISOLATED_RESPONSE_VERSION =
  "fixture-026.rsd-t02-isolated-response.v1";
export const FIXTURE_026_RSD_T02_POLICY_INVENTORY_VERSION =
  "fixture-026.rsd-t02-policy-bundle-inventory.v1";

const fixtureRoot = path.dirname(fileURLToPath(import.meta.url));
const INVENTORY_PATH = path.join(fixtureRoot, "rsd-t02-policy-bundle.inventory.json");
const WORKER_PATH = path.join(fixtureRoot, "rsd-t02-policy-worker.mjs");
const DEFAULT_TIMEOUT_MS = 15_000;
const MAX_STDOUT_BYTES = 256 * 1024;
const MAX_STDERR_BYTES = 64 * 1024;
const MAX_REQUEST_BYTES = 24 * 1024 * 1024;
const HASH_PATTERN = /^[0-9a-f]{64}$/u;
const INVENTORY_KEYS = Object.freeze([
  "schema", "contract_version", "bundle", "sources", "source_inventory_sha256",
  "authority", "inventory_sha256",
]);
const BUNDLE_KEYS = Object.freeze([
  "content_address", "relative_path", "sha256", "bytes",
]);
const SOURCE_KEYS = Object.freeze(["relative_path", "sha256", "bytes"]);
const EXPECTED_SOURCE_PATHS = Object.freeze([
  "configs/rsd-t02-arm-bank.json",
  "rsd-t02-arm-bank.mjs",
  "rsd-t02-contract.mjs",
  "rsd-t02-isolated-policy.mjs",
  "rsd-t02-policy-worker.mjs",
]);
const CHILD_RESPONSE_KEYS = Object.freeze([
  "schema", "contract_version", "status", "arm_outcomes", "reason_codes",
  "active_arm_ids", "request_sha256", "request_bytes", "packet_sha256",
  "packet_utf8_bytes", "config_sha256", "config_utf8_bytes", "bundle_sha256",
  "runtime",
  "authority", "comparison_inference_permitted", "claim_eligible", "result_label",
  "no_result",
]);
const CHILD_ARM_OUTCOME_KEYS = Object.freeze([
  "arm_id", "status", "arm_result", "reason_codes",
]);
const CHILD_RUNTIME_KEYS = Object.freeze([
  "node_version", "v8_version", "platform", "architecture", "numeric_model",
]);
const CHILD_ABSTENTION_REASONS = Object.freeze(new Set([
  "isolated-worker-request-rejected",
  "isolated-worker-bundle-rejected",
  "isolated-worker-bootstrap-rejected",
  "isolated-policy-runtime-rejected",
]));

function exactKeys(value, keys) {
  return value !== null
    && typeof value === "object"
    && !Array.isArray(value)
    && Object.keys(value).length === keys.length
    && keys.every((key) => Object.hasOwn(value, key));
}

function sha256(bytes) {
  return createHash("sha256").update(bytes).digest("hex");
}

function isInside(root, target) {
  const relative = path.relative(root, target);
  return relative === "" || (!relative.startsWith("..") && !path.isAbsolute(relative));
}

async function checkedInFile(relativePath, expectedSha256, expectedBytes, label) {
  if (
    typeof relativePath !== "string"
    || relativePath.length < 1
    || relativePath.includes("\\")
    || path.posix.isAbsolute(relativePath)
    || relativePath.split("/").some((part) => part === "" || part === "." || part === "..")
    || !HASH_PATTERN.test(expectedSha256)
    || !Number.isSafeInteger(expectedBytes)
    || expectedBytes < 1
  ) throw new Error(`Fixture 026 RSD-T02 ${label} inventory entry is invalid.`);
  const absolute = path.resolve(fixtureRoot, ...relativePath.split("/"));
  if (!isInside(fixtureRoot, absolute)) {
    throw new Error(`Fixture 026 RSD-T02 ${label} escapes the fixture root.`);
  }
  let current = fixtureRoot;
  for (const component of relativePath.split("/")) {
    current = path.join(current, component);
    const componentInformation = await lstat(current);
    if (componentInformation.isSymbolicLink()) {
      throw new Error(`Fixture 026 RSD-T02 ${label} traverses a symbolic link or junction.`);
    }
  }
  const information = await lstat(absolute);
  if (!information.isFile() || information.isSymbolicLink()) {
    throw new Error(`Fixture 026 RSD-T02 ${label} must be a real regular file.`);
  }
  const [rootReal, fileReal] = await Promise.all([realpath(fixtureRoot), realpath(absolute)]);
  if (!isInside(rootReal, fileReal)) {
    throw new Error(`Fixture 026 RSD-T02 ${label} resolves outside the fixture root.`);
  }
  const bytes = await readFile(fileReal);
  if (bytes.length !== expectedBytes || sha256(bytes) !== expectedSha256) {
    throw new Error(`Fixture 026 RSD-T02 ${label} content identity mismatch.`);
  }
  return Object.freeze({ absolute: fileReal, bytes });
}

export async function loadFixture026RsdT02PolicyBundleInventory() {
  const inventoryBytes = await readFile(INVENTORY_PATH);
  const inventoryText = new TextDecoder("utf-8", { fatal: true }).decode(inventoryBytes);
  if (inventoryText.includes("\r") || !inventoryText.endsWith("\n")) {
    throw new Error("Fixture 026 RSD-T02 policy inventory must be BOM-free LF JSON.");
  }
  const inventory = JSON.parse(inventoryText);
  if (
    !exactKeys(inventory, INVENTORY_KEYS)
    || inventory.schema !== 1
    || inventory.contract_version !== FIXTURE_026_RSD_T02_POLICY_INVENTORY_VERSION
    || !exactKeys(inventory.bundle, BUNDLE_KEYS)
    || inventory.bundle.content_address !== `sha256:${inventory.bundle.sha256}`
    || path.posix.basename(inventory.bundle.relative_path)
      !== `${inventory.bundle.sha256}.js`
    || !Array.isArray(inventory.sources)
    || canonicalize(inventory.sources.map((source) => source.relative_path))
      !== canonicalize(EXPECTED_SOURCE_PATHS)
    || inventory.sources.some((source) => !exactKeys(source, SOURCE_KEYS))
    || new Set(inventory.sources.map((source) => source.relative_path.toLowerCase())).size
      !== inventory.sources.length
    || inventory.source_inventory_sha256 !== sha256Hex(canonicalize(inventory.sources))
    || inventory.authority
      !== "checked-in-public-development-conformance-policy-base-v1"
    || !HASH_PATTERN.test(inventory.inventory_sha256)
  ) throw new Error("Fixture 026 RSD-T02 policy bundle inventory is invalid.");
  const body = { ...inventory };
  delete body.inventory_sha256;
  if (inventory.inventory_sha256 !== sha256Hex(canonicalize(body))) {
    throw new Error("Fixture 026 RSD-T02 policy bundle inventory hash is false.");
  }
  const bundle = await checkedInFile(
    inventory.bundle.relative_path,
    inventory.bundle.sha256,
    inventory.bundle.bytes,
    "policy bundle",
  );
  const sources = Object.freeze(await Promise.all(inventory.sources.map(async (source) => {
    const opened = await checkedInFile(
      source.relative_path,
      source.sha256,
      source.bytes,
      `policy source ${source.relative_path}`,
    );
    return Object.freeze({ ...source, absolute: opened.absolute, bytes_buffer: opened.bytes });
  })));
  const worker = sources.find((source) => source.relative_path === "rsd-t02-policy-worker.mjs");
  if (!worker || path.resolve(worker.absolute) !== path.resolve(await realpath(WORKER_PATH))) {
    throw new Error("Fixture 026 RSD-T02 policy worker is absent from its source inventory.");
  }
  return Object.freeze({
    document: Object.freeze(inventory),
    inventory_path: INVENTORY_PATH,
    inventory_file_sha256: sha256(inventoryBytes),
    bundle_path: bundle.absolute,
    bundle_bytes: bundle.bytes.length,
    bundle_sha256: inventory.bundle.sha256,
    source_inventory_sha256: inventory.source_inventory_sha256,
    inventory_sha256: inventory.inventory_sha256,
    worker_path: worker.absolute,
    worker_sha256: worker.sha256,
    worker_source: new TextDecoder("utf-8", { fatal: true }).decode(worker.bytes_buffer),
    sources,
  });
}

function sanitizedChildEnvironment() {
  if (process.platform !== "win32") return Object.freeze({});
  return Object.freeze(Object.fromEntries([
    "SYSTEMROOT", "WINDIR", "SYSTEMDRIVE", "COMSPEC",
  ].filter((key) => typeof process.env[key] === "string").map(
    (key) => [key, process.env[key]],
  )));
}

function launchChild({ workerSource, bundlePath, bundleSha256, requestBytes, timeoutMs }) {
  return new Promise((resolve) => {
    const stdout = [];
    const stderr = [];
    let stdoutBytes = 0;
    let stderrBytes = 0;
    let timedOut = false;
    let stdoutExceeded = false;
    let stderrExceeded = false;
    let spawnError = false;
    let settled = false;
    const child = spawn(process.execPath, [
      "--permission",
      `--allow-fs-read=${bundlePath}`,
      "--disable-proto=throw",
      "--no-addons",
      "--max-old-space-size=256",
      "--input-type=module",
      "--eval",
      workerSource,
      "--",
      bundlePath,
      bundleSha256,
    ], {
      cwd: fixtureRoot,
      env: sanitizedChildEnvironment(),
      shell: false,
      windowsHide: true,
      stdio: ["pipe", "pipe", "pipe"],
    });
    const terminate = () => {
      if (child.exitCode === null && child.signalCode === null) child.kill("SIGKILL");
    };
    const timer = setTimeout(() => {
      timedOut = true;
      terminate();
    }, timeoutMs);
    timer.unref();
    child.stdout.on("data", (chunk) => {
      stdoutBytes += chunk.length;
      if (stdoutBytes > MAX_STDOUT_BYTES) {
        stdoutExceeded = true;
        terminate();
      } else stdout.push(chunk);
    });
    child.stderr.on("data", (chunk) => {
      stderrBytes += chunk.length;
      if (stderrBytes > MAX_STDERR_BYTES) {
        stderrExceeded = true;
        terminate();
      } else stderr.push(chunk);
    });
    child.once("error", () => {
      spawnError = true;
    });
    child.stdin.once("error", (error) => {
      if (error.code !== "EPIPE") spawnError = true;
    });
    child.once("close", (exitCode, signal) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      resolve(Object.freeze({
        exitCode,
        signal,
        timedOut,
        stdoutExceeded,
        stderrExceeded,
        spawnError,
        stdout: Buffer.concat(stdout),
        stderr: Buffer.concat(stderr),
      }));
    });
    child.stdin.end(requestBytes);
  });
}

function parseChildResponse(childResult, expected = null) {
  if (childResult.timedOut) return { reason: "isolated-policy-timeout" };
  if (childResult.stdoutExceeded || childResult.stderrExceeded) {
    return { reason: "isolated-policy-protocol-over-budget" };
  }
  if (
    childResult.spawnError
    || childResult.exitCode !== 0
    || childResult.signal !== null
    || childResult.stderr.length !== 0
  ) return { reason: "isolated-policy-child-crash" };
  let text;
  let response;
  try {
    text = new TextDecoder("utf-8", { fatal: true }).decode(childResult.stdout);
    if (!text.endsWith("\n") || text.slice(0, -1).includes("\n") || text.includes("\r")) {
      return { reason: "isolated-policy-malformed-response" };
    }
    response = JSON.parse(text.slice(0, -1));
    if (`${canonicalize(response)}\n` !== text) {
      return { reason: "isolated-policy-malformed-response" };
    }
  } catch {
    return { reason: "isolated-policy-malformed-response" };
  }
  if (
    !exactKeys(response, CHILD_RESPONSE_KEYS)
    || response.schema !== 1
    || response.contract_version !== FIXTURE_026_RSD_T02_ISOLATED_RESPONSE_VERSION
    || !["completed", "abstained"].includes(response.status)
    || !Array.isArray(response.reason_codes)
    || !Array.isArray(response.active_arm_ids)
    || canonicalize(response.active_arm_ids)
      !== canonicalize(FIXTURE_026_RSD_T02_ACTIVE_ARM_IDS)
    || !exactKeys(response.runtime, CHILD_RUNTIME_KEYS)
    || response.runtime.node_version !== process.versions.node
    || response.runtime.v8_version !== process.versions.v8
    || response.runtime.platform !== process.platform
    || response.runtime.architecture !== process.arch
    || response.runtime.numeric_model !== "IEEE-754-binary64"
    || response.authority !== "public-development-policy-base-v1-only"
    || response.comparison_inference_permitted !== false
    || response.claim_eligible !== false
    || response.result_label !== "NO_RESULT"
    || response.no_result !== true
  ) return { reason: "isolated-policy-malformed-response" };
  const fullBindingMatches = expected === null || (
    response.request_sha256 === sha256(expected.requestBytes)
    && response.request_bytes === expected.requestBytes.length
    && response.packet_sha256 === sha256(expected.packetBytes)
    && response.packet_utf8_bytes === expected.packetBytes.length
    && response.config_sha256 === sha256(expected.configBytes)
    && response.config_utf8_bytes === expected.configBytes.length
    && response.bundle_sha256 === expected.inventory.bundle_sha256
  );
  if (
    !Array.isArray(response.arm_outcomes)
    || response.arm_outcomes.length !== FIXTURE_026_RSD_T02_ACTIVE_ARM_IDS.length
    || response.arm_outcomes.some((outcome, index) => (
      !exactKeys(outcome, CHILD_ARM_OUTCOME_KEYS)
      || outcome.arm_id !== FIXTURE_026_RSD_T02_ACTIVE_ARM_IDS[index]
      || !["completed", "abstained"].includes(outcome.status)
      || !Array.isArray(outcome.reason_codes)
    ))
  ) return { reason: "isolated-policy-malformed-response" };
  if (response.status === "abstained") {
    if (response.reason_codes.length !== 1) {
      return { reason: "isolated-policy-malformed-response" };
    }
    const bootstrapReason = response.reason_codes[0];
    const bootstrapFailure = CHILD_ABSTENTION_REASONS.has(bootstrapReason)
      && response.arm_outcomes.every((outcome) => (
        outcome.status === "abstained"
        && outcome.arm_result === null
        && canonicalize(outcome.reason_codes) === canonicalize([bootstrapReason])
      ));
    const bankFailure = bootstrapReason === "isolated-policy-bank-incomplete"
      && response.arm_outcomes.some((outcome) => outcome.status === "abstained")
      && response.arm_outcomes.every((outcome) => (
        outcome.status === "completed"
          ? outcome.reason_codes.length === 0
          : outcome.arm_result === null
            && canonicalize(outcome.reason_codes)
              === canonicalize(["isolated-policy-runtime-rejected"])
      ));
    if (!bootstrapFailure && !bankFailure) {
      return { reason: "isolated-policy-malformed-response" };
    }
    const availableBindingMatches = expected === null || (
      (response.request_sha256 === null
        || response.request_sha256 === sha256(expected.requestBytes))
      && (response.request_bytes === null
        || response.request_bytes === expected.requestBytes.length)
      && (response.packet_sha256 === null
        || response.packet_sha256 === sha256(expected.packetBytes))
      && (response.packet_utf8_bytes === null
        || response.packet_utf8_bytes === expected.packetBytes.length)
      && (response.config_sha256 === null
        || response.config_sha256 === sha256(expected.configBytes))
      && (response.config_utf8_bytes === null
        || response.config_utf8_bytes === expected.configBytes.length)
      && (response.bundle_sha256 === null
        || response.bundle_sha256 === expected.inventory.bundle_sha256)
    );
    if (!availableBindingMatches || (bankFailure && !fullBindingMatches)) {
      return { reason: "isolated-policy-malformed-response" };
    }
    return {
      reason: bootstrapReason,
      response,
      text,
      arm_outcomes: response.arm_outcomes,
    };
  }
  if (
    response.reason_codes.length !== 0
    || !fullBindingMatches
    || response.arm_outcomes.some((outcome) => (
      outcome.status !== "completed" || outcome.reason_codes.length !== 0
    ))
  ) {
    return { reason: "isolated-policy-malformed-response" };
  }
  for (const [index, outcome] of response.arm_outcomes.entries()) {
    const result = outcome.arm_result;
    try {
      assertFixture026RsdT02PolicyBaseResult(result);
    } catch (error) {
      return {
        reason: /work envelope/u.test(error.message)
          ? "isolated-policy-work-over-budget"
          : "isolated-policy-malformed-response",
      };
    }
    if (result.arm_id !== FIXTURE_026_RSD_T02_ACTIVE_ARM_IDS[index]) {
      return { reason: "isolated-policy-malformed-response" };
    }
  }
  return { response, text };
}

function abstention(armId, reasonCode) {
  return Object.freeze({
    arm_id: armId,
    action: "abstain",
    reason_codes: Object.freeze([reasonCode]),
    retry_invocations: 0,
    fallback_invocations: 0,
    authority: "public-development-policy-conformance-only",
    comparison_inference_permitted: false,
    claim_eligible: false,
    result_label: "NO_RESULT",
    no_result: true,
  });
}

function receipt({ inventory, requestBytes, responseBytes = null }) {
  return Object.freeze({
    boundary_version: FIXTURE_026_RSD_T02_ISOLATED_POLICY_VERSION,
    execution_mode: "fresh-node-child-hardened-vm",
    fresh_process: true,
    filesystem_exposed_to_policy: false,
    network_exposed_to_policy: false,
    environment_exposed_to_policy: false,
    clock_exposed_to_policy: false,
    random_exposed_to_policy: false,
    evaluator_exposed_to_policy: false,
    dynamic_code_generation_exposed_to_policy: false,
    worker_sha256: inventory.worker_sha256,
    bundle_sha256: inventory.bundle_sha256,
    bundle_inventory_sha256: inventory.inventory_sha256,
    source_inventory_sha256: inventory.source_inventory_sha256,
    canonical_request_sha256: sha256(requestBytes),
    canonical_request_bytes: requestBytes.length,
    canonical_response_sha256: responseBytes === null ? null : sha256(responseBytes),
    canonical_response_bytes: responseBytes === null ? null : responseBytes.length,
    hash_attachment: "parent-after-validated-child-return",
  });
}

export function classifyFixture026RsdT02PolicyChildResult(childResult, expected = null) {
  return parseChildResponse(childResult, expected);
}

async function runIsolatedPolicyPacketWithInventory({
  packet,
  config,
  policyConfigUtf8,
  inventory,
  timeoutMs = DEFAULT_TIMEOUT_MS,
}) {
  const built = buildFixture026RsdT02SystemPacket(packet.projections);
  validateFixture026RsdT02ArmBankConfig(config);
  if (
    typeof policyConfigUtf8 !== "string"
    || !Number.isSafeInteger(timeoutMs)
    || timeoutMs < 1
  ) throw new Error("Fixture 026 RSD-T02 isolated policy inputs are invalid.");
  let parsedConfig;
  try {
    parsedConfig = JSON.parse(policyConfigUtf8);
  } catch {
    throw new Error("Fixture 026 RSD-T02 exact policy config bytes are invalid JSON.");
  }
  if (canonicalize(parsedConfig) !== canonicalize(config)) {
    throw new Error("Fixture 026 RSD-T02 exact policy config bytes differ from the validated config.");
  }
  const packetBytes = Buffer.from(canonicalize(built.packet), "utf8");
  const configBytes = Buffer.from(policyConfigUtf8, "utf8");
  const configSource = inventory.sources.find(
    (source) => source.relative_path === "configs/rsd-t02-arm-bank.json",
  );
  if (
    !configSource
    || configBytes.length !== configSource.bytes
    || sha256(configBytes) !== configSource.sha256
  ) throw new Error("Fixture 026 RSD-T02 policy config is not the exact inventory-bound byte source.");
  const request = {
    schema: 1,
    contract_version: FIXTURE_026_RSD_T02_ISOLATED_REQUEST_VERSION,
    active_arm_ids: FIXTURE_026_RSD_T02_ACTIVE_ARM_IDS,
    packet_encoding: "canonical-json-utf8-base64",
    packet_utf8_bytes: packetBytes.length,
    packet_base64: packetBytes.toString("base64"),
    config_encoding: "exact-checked-in-json-utf8-base64",
    config_utf8_bytes: configBytes.length,
    config_base64: configBytes.toString("base64"),
  };
  const requestBytes = Buffer.from(`${canonicalize(request)}\n`, "utf8");
  if (requestBytes.length > MAX_REQUEST_BYTES) {
    const reason = "isolated-policy-request-over-budget";
    return Object.freeze({
      status: "abstained",
      responses: null,
      active_arm_outcomes: bankFailureOutcomes(null, reason),
      system_packet_sha256: built.system_packet_sha256,
      system_packet_utf8_bytes: built.system_packet_utf8_bytes,
      receipt: receipt({ inventory, requestBytes }),
      result_label: "NO_RESULT",
      no_result: true,
    });
  }
  let childResult;
  try {
    childResult = await launchChild({
      workerSource: inventory.worker_source,
      bundlePath: inventory.bundle_path,
      bundleSha256: inventory.bundle_sha256,
      requestBytes,
      timeoutMs,
    });
  } catch {
    childResult = Object.freeze({
      exitCode: null,
      signal: null,
      timedOut: false,
      stdoutExceeded: false,
      stderrExceeded: false,
      spawnError: true,
      stdout: Buffer.alloc(0),
      stderr: Buffer.alloc(0),
    });
  }
  const parsed = parseChildResponse(childResult, {
    requestBytes,
    packetBytes,
    configBytes,
    inventory,
  });
  if (parsed.reason) {
    return Object.freeze({
      status: "abstained",
      responses: null,
      active_arm_outcomes: childFailureOutcomes(parsed),
      system_packet_sha256: built.system_packet_sha256,
      system_packet_utf8_bytes: built.system_packet_utf8_bytes,
      receipt: receipt({
        inventory,
        requestBytes,
        responseBytes: parsed.text === undefined ? null : Buffer.from(parsed.text, "utf8"),
      }),
      result_label: "NO_RESULT",
      no_result: true,
    });
  }
  const policyConfigSha256 = sha256(configBytes);
  const responses = Object.freeze(parsed.response.arm_outcomes.map(({ arm_result: baseResult }, index) => (
    attachFixture026RsdT02ArmResponse({
      armId: FIXTURE_026_RSD_T02_ACTIVE_ARM_IDS[index],
      packet: built.packet,
      config,
      policyArtifactSha256: inventory.bundle_sha256,
      policyArtifactBytes: inventory.bundle_bytes,
      policyConfigSha256,
      policyConfigBytes: configBytes.length,
      baseResult,
    })
  )));
  return Object.freeze({
    status: "completed",
    responses,
    active_arm_outcomes: Object.freeze([]),
    system_packet_sha256: built.system_packet_sha256,
    system_packet_utf8_bytes: built.system_packet_utf8_bytes,
    receipt: receipt({
      inventory,
      requestBytes,
      responseBytes: Buffer.from(parsed.text, "utf8"),
    }),
    result_label: "NO_RESULT",
    no_result: true,
  });
}

export async function runFixture026RsdT02IsolatedPolicyPacket(options) {
  const inventory = await loadFixture026RsdT02PolicyBundleInventory();
  return runIsolatedPolicyPacketWithInventory({ ...options, inventory });
}

function bankFailureOutcomes(failedArmId, reasonCode) {
  return Object.freeze(FIXTURE_026_RSD_T02_ACTIVE_ARM_IDS.map((armId) => (
    abstention(
      armId,
      failedArmId === null || armId === failedArmId
        ? reasonCode
        : "isolated-policy-bank-incomplete",
    )
  )));
}

function childFailureOutcomes(parsed) {
  if (!Array.isArray(parsed.arm_outcomes)) {
    return bankFailureOutcomes(null, parsed.reason);
  }
  return Object.freeze(parsed.arm_outcomes.map((outcome) => abstention(
    outcome.arm_id,
    outcome.status === "abstained"
      ? outcome.reason_codes[0]
      : "isolated-policy-bank-incomplete",
  )));
}

export async function buildFixture026RsdT02IsolatedArmCommitment({
  profile,
  packetInputs,
  config,
  policyConfigUtf8,
  timeoutMs = DEFAULT_TIMEOUT_MS,
}) {
  validateFixture026RsdT02ArmBankConfig(config);
  if (!Array.isArray(packetInputs) || !["smoke", "development"].includes(profile)) {
    throw new Error("Fixture 026 RSD-T02 isolated arm commitment inputs are invalid.");
  }
  const inventory = await loadFixture026RsdT02PolicyBundleInventory();
  const configBytes = Buffer.from(policyConfigUtf8, "utf8");
  const activeResponsesByPacket = [];
  const receipts = [];
  for (const [packetOrdinal, input] of packetInputs.entries()) {
    const outcome = await runIsolatedPolicyPacketWithInventory({
      packet: input.packet,
      config,
      policyConfigUtf8,
      inventory,
      timeoutMs,
    });
    receipts.push(outcome.receipt);
    if (outcome.status !== "completed") {
      const directFailures = outcome.active_arm_outcomes.filter(
        (armOutcome) => armOutcome.reason_codes[0] !== "isolated-policy-bank-incomplete",
      );
      return Object.freeze({
        status: "abstained",
        commitment: null,
        packet_ordinal: packetOrdinal,
        failed_arm_id: directFailures.length === 1 ? directFailures[0].arm_id : null,
        seed: input.seed,
        system_slot: input.system_slot,
        system_packet_sha256: outcome.system_packet_sha256,
        system_packet_utf8_bytes: outcome.system_packet_utf8_bytes,
        active_arm_outcomes: outcome.active_arm_outcomes,
        receipts: Object.freeze(receipts),
        receipts_sha256: sha256Hex(canonicalize(receipts)),
        receipt_sha256: sha256Hex(canonicalize(outcome.receipt)),
        policy_bundle_sha256: inventory.bundle_sha256,
        policy_bundle_inventory_sha256: inventory.inventory_sha256,
        policy_source_inventory_sha256: inventory.source_inventory_sha256,
        result_label: "NO_RESULT",
        no_result: true,
      });
    }
    activeResponsesByPacket.push(outcome.responses);
  }
  const commitment = buildFixture026RsdT02ArmCommitmentFromResponses({
    profile,
    packetInputs,
    config,
    policyArtifactSha256: inventory.bundle_sha256,
    policyArtifactBytes: inventory.bundle_bytes,
    policyConfigSha256: sha256(configBytes),
    policyConfigBytes: configBytes.length,
    activeResponsesByPacket,
  });
  return Object.freeze({
    status: "completed",
    commitment,
    packet_ordinal: null,
    failed_arm_id: null,
    seed: null,
    system_slot: null,
    system_packet_sha256: null,
    system_packet_utf8_bytes: null,
    active_arm_outcomes: Object.freeze([]),
    receipts: Object.freeze(receipts),
    receipts_sha256: sha256Hex(canonicalize(receipts)),
    receipt_sha256: null,
    policy_bundle_sha256: inventory.bundle_sha256,
    policy_bundle_inventory_sha256: inventory.inventory_sha256,
    policy_source_inventory_sha256: inventory.source_inventory_sha256,
    result_label: "NO_RESULT",
    no_result: true,
  });
}
