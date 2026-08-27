import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";
import vm from "node:vm";

const REQUEST_VERSION = "fixture-026.rsd-t02-fixed-instance-isolated-request.v1";
const CALL_VERSION = "fixture-026.rsd-t02-fixed-instance-policy-call.v1";
const BUNDLE_RESPONSE_VERSION =
  "fixture-026.rsd-t02-fixed-instance-policy-bundle-response.v1";
const RESPONSE_VERSION = "fixture-026.rsd-t02-fixed-instance-isolated-response.v1";
const POLICY_RESPONSE_VERSION = "fixture-026.rsd-t02-fixed-instance-policy-response.v1";
const MAX_STDIN_BYTES = 24 * 1024 * 1024;
const MAX_BUNDLE_BYTES = 262144;
const MAX_BUNDLE_RESPONSE_BYTES = 256 * 1024;
const VM_TIMEOUT_MS = 5_000;
const ACTIVE_ARM_IDS = Object.freeze([
  "A-RAW",
  "B-STATIC-DIV",
  "B-STREAM",
  "B-LOG-RATIO",
  "B-DIFFERENCE",
  "B-STATE-SPACE",
  "B-RECURRENT",
  "C-MECHANISM-BANK",
  "C-DUAL",
]);
const REQUEST_KEYS = Object.freeze([
  "schema", "contract_version", "active_arm_ids", "policy_view_encoding",
  "policy_view_utf8_bytes", "policy_view_sha256", "policy_view_base64",
]);
const INPUT_KEYS = Object.freeze([
  "arm_id", "signed_sum", "absolute_sum", "last_output", "work",
]);
const WORK_KEYS = Object.freeze([
  "sample_rows_read", "scalar_operations", "retained_state_bytes",
]);

function exactKeys(value, keys) {
  return value !== null
    && typeof value === "object"
    && !Array.isArray(value)
    && Object.keys(value).length === keys.length
    && keys.every((key) => Object.hasOwn(value, key));
}

function canonical(value) {
  if (value === null || typeof value === "boolean" || typeof value === "string") {
    return JSON.stringify(value);
  }
  if (typeof value === "number" && Number.isFinite(value)) return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(canonical).join(",")}]`;
  if (value && typeof value === "object") {
    return `{${Object.keys(value).sort().map((key) => (
      `${JSON.stringify(key)}:${canonical(value[key])}`
    )).join(",")}}`;
  }
  throw new TypeError(`Non-canonical ${typeof value} value.`);
}

function sha256(value) {
  return createHash("sha256").update(value).digest("hex");
}

async function readBoundedStdin() {
  const chunks = [];
  let bytes = 0;
  for await (const chunk of process.stdin) {
    bytes += chunk.length;
    if (bytes > MAX_STDIN_BYTES) throw new RangeError("stdin exceeds protocol bound");
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
}

function decodeUtf8(bytes) {
  return new TextDecoder("utf-8", { fatal: true }).decode(bytes);
}

function validateRequest(raw) {
  const text = decodeUtf8(raw);
  if (text.includes("\r") || !text.endsWith("\n") || text.slice(0, -1).includes("\n")) {
    throw new Error("request is not one canonical LF-terminated record");
  }
  const request = JSON.parse(text.slice(0, -1));
  if (
    `${canonical(request)}\n` !== text
    || !exactKeys(request, REQUEST_KEYS)
    || request.schema !== 1
    || request.contract_version !== REQUEST_VERSION
    || canonical(request.active_arm_ids) !== canonical(ACTIVE_ARM_IDS)
    || request.policy_view_encoding !== "canonical-json-utf8-base64"
    || !Number.isSafeInteger(request.policy_view_utf8_bytes)
    || request.policy_view_utf8_bytes < 1
    || !/^[0-9a-f]{64}$/u.test(request.policy_view_sha256)
    || typeof request.policy_view_base64 !== "string"
  ) throw new Error("request shape is invalid");
  const policyViewBytes = Buffer.from(request.policy_view_base64, "base64");
  if (
    policyViewBytes.length !== request.policy_view_utf8_bytes
    || policyViewBytes.toString("base64") !== request.policy_view_base64
    || sha256(policyViewBytes) !== request.policy_view_sha256
  ) throw new Error("policy view byte binding is invalid");
  const policyViewJson = decodeUtf8(policyViewBytes);
  const policyView = JSON.parse(policyViewJson);
  if (canonical(policyView) !== policyViewJson) throw new Error("policy view is not canonical JSON");
  return { request, policyViewBytes, policyViewJson };
}

const LOCKDOWN_SOURCE = `"use strict";
for (const name of [
  "process", "require", "module", "fetch", "XMLHttpRequest", "WebSocket",
  "EventSource", "Date", "performance", "setTimeout", "setInterval",
  "setImmediate", "queueMicrotask", "crypto", "Deno", "Bun", "eval",
  "Function", "Promise", "WebAssembly", "SharedArrayBuffer", "Atomics", "console",
  "__fixture026_evaluator__"
]) {
  Object.defineProperty(globalThis, name, {
    value: undefined, configurable: false, enumerable: false, writable: false
  });
}
Object.defineProperty(Math, "random", {
  value: undefined, configurable: false, enumerable: false, writable: false
});
Object.freeze(Math);
Object.freeze(JSON);
`;

function executeBundle(bundleText, bundleSha256, policyViewJson) {
  const context = vm.createContext(Object.create(null), {
    name: "fixture-026-rsd-t02-fixed-instance-policy",
    codeGeneration: { strings: false, wasm: false },
    microtaskMode: "afterEvaluate",
  });
  new vm.Script(LOCKDOWN_SOURCE, {
    filename: "fixture-026-rsd-t02-fixed-instance-lockdown.js",
  }).runInContext(context, { timeout: VM_TIMEOUT_MS });
  new vm.Script(bundleText, {
    filename: `sha256-${bundleSha256}.js`,
  }).runInContext(context, { timeout: VM_TIMEOUT_MS });
  const policyCall = canonical({
    schema: 1,
    contract_version: CALL_VERSION,
    active_arm_ids: ACTIVE_ARM_IDS,
    policy_view_json: policyViewJson,
  });
  Object.defineProperty(context, "__fixture026_fixed_policy_call_json__", {
    value: policyCall,
    configurable: true,
    enumerable: false,
    writable: false,
  });
  const responseText = new vm.Script(
    "__fixture026_rsd_t02_fixed_policy_execute__(__fixture026_fixed_policy_call_json__)",
    { filename: "fixture-026-rsd-t02-fixed-instance-invoke.js" },
  ).runInContext(context, { timeout: VM_TIMEOUT_MS });
  delete context.__fixture026_fixed_policy_call_json__;
  if (
    typeof responseText !== "string"
    || Buffer.byteLength(responseText, "utf8") > MAX_BUNDLE_RESPONSE_BYTES
  ) throw new Error("policy response is absent or exceeds its bound");
  const response = JSON.parse(responseText);
  if (
    canonical(response) !== responseText
    || response.schema !== 1
    || response.contract_version !== BUNDLE_RESPONSE_VERSION
    || response.status !== "completed"
    || !Array.isArray(response.response_inputs)
    || response.response_inputs.length !== ACTIVE_ARM_IDS.length
    || !Array.isArray(response.reason_codes)
    || response.reason_codes.length !== 0
    || response.authority
      !== "public-development-fixed-instance-view-digest-conformance-only"
    || response.comparison_inference_permitted !== false
    || response.claim_eligible !== false
    || response.result_label !== "NO_RESULT"
    || response.no_result !== true
  ) throw new Error("bundle response root is invalid");
  for (const [index, input] of response.response_inputs.entries()) {
    if (
      !exactKeys(input, INPUT_KEYS)
      || input.arm_id !== ACTIVE_ARM_IDS[index]
      || !Number.isFinite(input.signed_sum)
      || !Number.isFinite(input.absolute_sum)
      || !Number.isFinite(input.last_output)
      || !exactKeys(input.work, WORK_KEYS)
      || input.work.sample_rows_read !== 39962
      || input.work.scalar_operations !== 119886
      || input.work.retained_state_bytes !== 32
    ) throw new Error("bundle response input is invalid");
  }
  return response;
}

function runtimeBinding() {
  return {
    node_version: process.versions.node,
    v8_version: process.versions.v8,
    platform: process.platform,
    architecture: process.arch,
    numeric_model: "IEEE-754-binary64",
  };
}

function abstention(reasonCode, binding = {}) {
  return {
    schema: 1,
    contract_version: RESPONSE_VERSION,
    status: "abstained",
    responses: [],
    reason_codes: [reasonCode],
    request_sha256: binding.request_sha256 ?? null,
    request_bytes: binding.request_bytes ?? null,
    policy_view_sha256: binding.policy_view_sha256 ?? null,
    policy_view_utf8_bytes: binding.policy_view_utf8_bytes ?? null,
    bundle_sha256: binding.bundle_sha256 ?? null,
    runtime: runtimeBinding(),
    authority: "public-development-fixed-instance-isolated-conformance-only",
    comparison_inference_permitted: false,
    claim_eligible: false,
    result_label: "NO_RESULT",
    no_result: true,
  };
}

async function main() {
  let raw = null;
  let opened = null;
  let expectedBundleSha256 = null;
  try {
    if (![3, 4].includes(process.argv.length)) throw new Error("worker arguments are invalid");
    const bundlePath = path.resolve(process.argv.at(-2));
    expectedBundleSha256 = process.argv.at(-1);
    if (
      !/^[0-9a-f]{64}$/u.test(expectedBundleSha256)
      || path.basename(bundlePath) !== `${expectedBundleSha256}.js`
    ) throw new Error("bundle is not content addressed");
    raw = await readBoundedStdin();
    opened = validateRequest(raw);
    const bundleBytes = await readFile(bundlePath);
    if (
      bundleBytes.length < 1
      || bundleBytes.length > MAX_BUNDLE_BYTES
      || sha256(bundleBytes) !== expectedBundleSha256
    ) throw new Error("bundle content identity is false");
    const bundleText = decodeUtf8(bundleBytes);
    const base = executeBundle(bundleText, expectedBundleSha256, opened.policyViewJson);
    const responses = base.response_inputs.map((input) => {
      const work = input.work;
      return {
        schema: 1,
        contract_version: POLICY_RESPONSE_VERSION,
        arm_id: input.arm_id,
        action: "abstain",
        decision: null,
        reason_codes: ["view-digest-conformance-only-no-policy-or-comparison-authority"],
        work_digest_sha256: sha256(canonical({
          arm_id: input.arm_id,
          signedSum: input.signed_sum,
          absoluteSum: input.absolute_sum,
          lastOutput: input.last_output,
          work,
        })),
        work,
        authority: "public-development-view-digest-conformance-only",
        comparison_inference_permitted: false,
        claim_eligible: false,
        result_label: "NO_RESULT",
        no_result: true,
      };
    });
    return {
      schema: 1,
      contract_version: RESPONSE_VERSION,
      status: "completed",
      responses,
      reason_codes: [],
      request_sha256: sha256(raw),
      request_bytes: raw.length,
      policy_view_sha256: opened.request.policy_view_sha256,
      policy_view_utf8_bytes: opened.policyViewBytes.length,
      bundle_sha256: expectedBundleSha256,
      runtime: runtimeBinding(),
      authority: "public-development-fixed-instance-isolated-conformance-only",
      comparison_inference_permitted: false,
      claim_eligible: false,
      result_label: "NO_RESULT",
      no_result: true,
    };
  } catch {
    return abstention("fixed-instance-isolated-worker-rejected", {
      request_sha256: raw === null ? null : sha256(raw),
      request_bytes: raw?.length ?? null,
      policy_view_sha256: opened?.request.policy_view_sha256 ?? null,
      policy_view_utf8_bytes: opened?.policyViewBytes.length ?? null,
      bundle_sha256: expectedBundleSha256,
    });
  }
}

const response = await main();
process.stdout.write(`${canonical(response)}\n`);
