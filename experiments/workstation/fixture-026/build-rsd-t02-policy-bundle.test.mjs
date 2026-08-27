import assert from "node:assert/strict";
import { chmod, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import vm from "node:vm";

import { canonicalize, sha256Hex } from "../lib/checkpoint-ledger.mjs";
import {
  FIXTURE_026_RSD_T02_ACTIVE_ARM_IDS,
  buildFixture026RsdT02SystemPacket,
  evaluateFixture026RsdT02ArmBase,
  validateFixture026RsdT02ArmBankConfig,
} from "./rsd-t02-arm-bank.mjs";
import { FIXTURE_026_RSD_T02_RECIPES } from "./rsd-t02-contract.mjs";
import {
  buildFixture026RsdT02EpisodeCommand,
  buildFixture026RsdT02WorkUnits,
  fixture026RsdT02Projection,
  generateFixture026RsdT02Transcript,
} from "./rsd-t02-generator.mjs";
import {
  buildFixture026RsdT02PolicyBundle,
  readFixture026RsdT02PolicyBundleIdentity,
} from "./build-rsd-t02-policy-bundle.mjs";

const FIXTURE_DIRECTORY = path.dirname(fileURLToPath(import.meta.url));
const SOURCE_PATH = path.join(FIXTURE_DIRECTORY, "rsd-t02-policy-bundle.source.js");
const CONFIG_PATH = path.join(FIXTURE_DIRECTORY, "configs", "rsd-t02-arm-bank.json");
const EXPECTED_SOURCE_SHA256 = "ee05826b7e83c08c9c8e08209b8895e3f1c6d7fd6a3229548944a95f08bada21";
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

const units = buildFixture026RsdT02WorkUnits({ profile: "smoke", seeds: ["1561001"] });
const packetCache = new Map();

function packetFor(recipeId) {
  if (!packetCache.has(recipeId)) {
    const projections = units
      .filter(({ recipe_id: registeredId }) => registeredId === recipeId)
      .map((unit) => fixture026RsdT02Projection(
        generateFixture026RsdT02Transcript(buildFixture026RsdT02EpisodeCommand(unit)),
      ));
    packetCache.set(recipeId, buildFixture026RsdT02SystemPacket(projections).packet);
  }
  return packetCache.get(recipeId);
}

function loadBundle(source) {
  const context = vm.createContext(Object.create(null), {
    codeGeneration: { strings: false, wasm: false },
    microtaskMode: "afterEvaluate",
  });
  new vm.Script(LOCKDOWN_SOURCE).runInContext(context, { timeout: 5000 });
  new vm.Script(source, { filename: `sha256-${EXPECTED_SOURCE_SHA256}.js` })
    .runInContext(context, { timeout: 5000 });
  return context;
}

function invokeBundle(context, packet, configJson) {
  const requestJson = canonicalize({
    schema: 1,
    contract_version: "fixture-026.rsd-t02-policy-call.v2",
    active_arm_ids: ACTIVE_ARM_IDS,
    packet_json: canonicalize(packet),
    config_json: configJson,
  });
  Object.defineProperty(context, "__fixture026_test_call__", {
    value: requestJson,
    configurable: true,
    enumerable: false,
    writable: false,
  });
  try {
    const responseJson = new vm.Script(
      "__fixture026_rsd_t02_policy_execute__(__fixture026_test_call__)",
    ).runInContext(context, { timeout: 10000 });
    assert.equal(canonicalize(JSON.parse(responseJson)), responseJson);
    return JSON.parse(responseJson);
  } finally {
    delete context.__fixture026_test_call__;
  }
}

test("bundle source is pinned, canonical, self-contained, and import-free", async () => {
  const bytes = await readFile(SOURCE_PATH);
  const source = bytes.toString("utf8");
  const identity = await readFixture026RsdT02PolicyBundleIdentity();
  assert.equal(bytes[0] === 0xef && bytes[1] === 0xbb && bytes[2] === 0xbf, false);
  assert.equal(source.includes("\r"), false);
  assert.equal(source.endsWith("\n"), true);
  assert.equal(/^\s*(?:import|export)(?:\s|\{)/mu.test(source), false);
  assert.equal(/\bimport\s*\(/u.test(source), false);
  assert.equal(sha256Hex(bytes), EXPECTED_SOURCE_SHA256);
  assert.deepEqual(identity, {
    source_path: SOURCE_PATH,
    source_sha256: EXPECTED_SOURCE_SHA256,
    source_utf8_bytes: bytes.length,
    artifact_filename: `${EXPECTED_SOURCE_SHA256}.js`,
  });
  assert.deepEqual(FIXTURE_026_RSD_T02_ACTIVE_ARM_IDS, ACTIVE_ARM_IDS);
});

test("builder requires an explicit mode and check never constructs an artifact", async () => {
  const temporaryRoot = await import("node:fs/promises").then(({ mkdtemp }) => (
    mkdtemp(path.join(os.tmpdir(), "fixture-026-rsd-t02-bundle-check-"))
  ));
  try {
    await assert.rejects(
      buildFixture026RsdT02PolicyBundle(),
      /requires explicit check or write mode/u,
    );
    await assert.rejects(
      buildFixture026RsdT02PolicyBundle({ mode: "check", outputDirectory: temporaryRoot }),
      { code: "ENOENT" },
    );
    await assert.rejects(readFile(path.join(temporaryRoot, `${EXPECTED_SOURCE_SHA256}.js`)), {
      code: "ENOENT",
    });
  } finally {
    await rm(temporaryRoot, { recursive: true, force: true });
  }
});

test("write and check modes reproduce one exact SHA-named artifact", async () => {
  const { mkdtemp } = await import("node:fs/promises");
  const firstDirectory = await mkdtemp(path.join(os.tmpdir(), "fixture-026-rsd-t02-bundle-a-"));
  const secondDirectory = await mkdtemp(path.join(os.tmpdir(), "fixture-026-rsd-t02-bundle-b-"));
  try {
    const first = await buildFixture026RsdT02PolicyBundle({
      mode: "write",
      outputDirectory: firstDirectory,
    });
    const repeated = await buildFixture026RsdT02PolicyBundle({
      mode: "write",
      outputDirectory: firstDirectory,
    });
    const second = await buildFixture026RsdT02PolicyBundle({
      mode: "write",
      outputDirectory: secondDirectory,
    });
    const checked = await buildFixture026RsdT02PolicyBundle({
      mode: "check",
      outputDirectory: firstDirectory,
    });
    assert.equal(first.status, "written");
    assert.equal(repeated.status, "present");
    assert.equal(second.status, "written");
    assert.equal(checked.status, "verified");
    assert.equal(first.artifact_filename, `${EXPECTED_SOURCE_SHA256}.js`);
    assert.equal(first.source_sha256, EXPECTED_SOURCE_SHA256);
    const source = await readFile(SOURCE_PATH);
    const firstBytes = await readFile(first.artifact_path);
    const secondBytes = await readFile(second.artifact_path);
    assert.deepEqual(firstBytes, source);
    assert.deepEqual(secondBytes, source);
    await chmod(first.artifact_path, 0o644);
    await writeFile(first.artifact_path, Buffer.concat([source, Buffer.from(" ")]));
    await assert.rejects(
      buildFixture026RsdT02PolicyBundle({ mode: "check", outputDirectory: firstDirectory }),
      /does not exactly match its source hash/u,
    );
  } finally {
    await rm(firstDirectory, { recursive: true, force: true });
    await rm(secondDirectory, { recursive: true, force: true });
  }
});

test("isolated bundle duplicates all nine v2 policy results in frozen order", async () => {
  const [source, configJson] = await Promise.all([
    readFile(SOURCE_PATH, "utf8"),
    readFile(CONFIG_PATH, "utf8"),
  ]);
  const config = validateFixture026RsdT02ArmBankConfig(JSON.parse(configJson));
  for (const recipe of FIXTURE_026_RSD_T02_RECIPES) {
    const packet = packetFor(recipe.recipe_id);
    const response = invokeBundle(loadBundle(source), packet, configJson);
    assert.deepEqual(response, {
      schema: 1,
      contract_version: "fixture-026.rsd-t02-isolated-response.v2",
      status: "completed",
      arm_results: ACTIVE_ARM_IDS.map((armId) => evaluateFixture026RsdT02ArmBase({
        armId,
        packet,
        config,
      })),
      reason_codes: [],
      authority: "public-development-policy-base-v2-only",
      comparison_inference_permitted: false,
      claim_eligible: false,
      result_label: "NO_RESULT",
      no_result: true,
    }, recipe.recipe_id);
  }
});

test("bundle rejects an open capability surface and non-closed policy config", async () => {
  const [source, configJson] = await Promise.all([
    readFile(SOURCE_PATH, "utf8"),
    readFile(CONFIG_PATH, "utf8"),
  ]);
  const packet = packetFor(FIXTURE_026_RSD_T02_RECIPES[0].recipe_id);
  const openContext = vm.createContext(Object.create(null), {
    codeGeneration: { strings: false, wasm: false },
  });
  new vm.Script(source).runInContext(openContext, { timeout: 5000 });
  const requestJson = canonicalize({
    schema: 1,
    contract_version: "fixture-026.rsd-t02-policy-call.v2",
    active_arm_ids: ACTIVE_ARM_IDS,
    packet_json: canonicalize(packet),
    config_json: configJson,
  });
  openContext.__fixture026_test_call__ = requestJson;
  assert.throws(
    () => new vm.Script(
      "__fixture026_rsd_t02_policy_execute__(__fixture026_test_call__)",
    ).runInContext(openContext, { timeout: 5000 }),
    /isolation capability surface is open/u,
  );

  const invalidConfig = JSON.parse(configJson);
  invalidConfig.policies["C-DUAL"].undeclared_threshold = 1;
  const closedContext = loadBundle(source);
  assert.throws(
    () => invokeBundle(closedContext, packet, canonicalize(invalidConfig)),
    /C-DUAL policy configuration is invalid/u,
  );
});
