import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";

import { canonicalize, sha256Hex } from "../lib/checkpoint-ledger.mjs";
import {
  FIXTURE_026_RSD_T02_ACTIVE_ARM_IDS,
  buildFixture026RsdT02SystemPacket,
  evaluateFixture026RsdT02ArmBase,
  runFixture026RsdT02Arm,
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
  FIXTURE_026_RSD_T02_ISOLATED_RESPONSE_VERSION,
  classifyFixture026RsdT02PolicyChildResult,
  loadFixture026RsdT02PolicyBundleInventory,
  runFixture026RsdT02IsolatedPolicyPacket,
} from "./rsd-t02-isolated-policy.mjs";

const SEED = "1561001";
const FIXTURE_ROOT = "experiments/workstation/fixture-026";
const CONFIG_PATH = path.join(FIXTURE_ROOT, "configs", "rsd-t02-arm-bank.json");
const units = buildFixture026RsdT02WorkUnits({ profile: "smoke", seeds: [SEED] });
const packets = new Map();
let childProcessAvailable;

function sha256(bytes) {
  return createHash("sha256").update(bytes).digest("hex");
}

async function canCreateChildProcess() {
  if (childProcessAvailable !== undefined) return childProcessAvailable;
  childProcessAvailable = await new Promise((resolve) => {
    let child;
    try {
      child = spawn(process.execPath, [
        "--permission", "--input-type=module", "--eval",
        "process.stdout.write('fixture-026-child-probe')",
      ], {
        env: {}, shell: false, windowsHide: true, stdio: ["ignore", "pipe", "pipe"],
      });
    } catch {
      resolve(false);
      return;
    }
    child.once("error", () => resolve(false));
    const stdout = [];
    child.stdout.on("data", (chunk) => stdout.push(chunk));
    child.once("close", (code) => resolve(
      code === 0 && Buffer.concat(stdout).toString("utf8") === "fixture-026-child-probe",
    ));
  });
  return childProcessAvailable;
}

async function policyInputs() {
  const policyConfigUtf8 = await readFile(CONFIG_PATH, "utf8");
  return {
    policyConfigUtf8,
    config: validateFixture026RsdT02ArmBankConfig(JSON.parse(policyConfigUtf8)),
    inventory: await loadFixture026RsdT02PolicyBundleInventory(),
  };
}

function packetFor(recipeId) {
  if (!packets.has(recipeId)) {
    const projections = units.filter((unit) => unit.recipe_id === recipeId).map((unit) => (
      fixture026RsdT02Projection(
        generateFixture026RsdT02Transcript(buildFixture026RsdT02EpisodeCommand(unit)),
      )
    ));
    packets.set(recipeId, buildFixture026RsdT02SystemPacket(projections).packet);
  }
  return packets.get(recipeId);
}

function successfulChildResponse(baseResults, overrides = {}) {
  return {
    schema: 1,
    contract_version: FIXTURE_026_RSD_T02_ISOLATED_RESPONSE_VERSION,
    status: "completed",
    arm_outcomes: FIXTURE_026_RSD_T02_ACTIVE_ARM_IDS.map((armId, index) => ({
      arm_id: armId,
      status: "completed",
      arm_result: baseResults[index],
      reason_codes: [],
    })),
    reason_codes: [],
    active_arm_ids: FIXTURE_026_RSD_T02_ACTIVE_ARM_IDS,
    request_sha256: "1".repeat(64),
    request_bytes: 1,
    packet_sha256: "2".repeat(64),
    packet_utf8_bytes: 1,
    config_sha256: "3".repeat(64),
    config_utf8_bytes: 1,
    bundle_sha256: "4".repeat(64),
    runtime: {
      node_version: process.versions.node,
      v8_version: process.versions.v8,
      platform: process.platform,
      architecture: process.arch,
      numeric_model: "IEEE-754-binary64",
    },
    authority: "public-development-policy-base-v2-only",
    comparison_inference_permitted: false,
    claim_eligible: false,
    result_label: "NO_RESULT",
    no_result: true,
    ...overrides,
  };
}

function childResult(response = null, overrides = {}) {
  return {
    exitCode: 0,
    signal: null,
    timedOut: false,
    stdoutExceeded: false,
    stderrExceeded: false,
    spawnError: false,
    stdout: Buffer.from(response === null ? "" : `${canonicalize(response)}\n`, "utf8"),
    stderr: Buffer.alloc(0),
    ...overrides,
  };
}

test("the checked-in policy bundle and source inventory are closed and content addressed", async () => {
  const inventory = await loadFixture026RsdT02PolicyBundleInventory();
  assert.equal(path.basename(inventory.bundle_path), `${inventory.bundle_sha256}.js`);
  assert.equal(sha256(await readFile(inventory.bundle_path)), inventory.bundle_sha256);
  assert.equal(
    sha256Hex(canonicalize(inventory.document.sources)),
    inventory.source_inventory_sha256,
  );
  const inventoryBytes = await readFile(inventory.inventory_path);
  assert.equal(inventoryBytes[0] === 0xef && inventoryBytes[1] === 0xbb, false);
  assert.equal(inventoryBytes.includes(0x0d), false);
  assert.equal(inventoryBytes.at(-1), 0x0a);
  const bundleText = await readFile(inventory.bundle_path, "utf8");
  assert.doesNotMatch(bundleText, /\bimport\s|\brequire\s*\(|node:/u);
});

test("all five packets preserve nine-arm base-v2 results across the fresh isolated child", {
  timeout: 120_000,
}, async (context) => {
  if (!(await canCreateChildProcess())) {
    context.skip("host sandbox denies child-process creation; run outside that sandbox");
    return;
  }
  const { config, policyConfigUtf8, inventory } = await policyInputs();
  for (const recipe of FIXTURE_026_RSD_T02_RECIPES) {
    const packet = packetFor(recipe.recipe_id);
    const isolated = await runFixture026RsdT02IsolatedPolicyPacket({
      packet,
      config,
      policyConfigUtf8,
    });
    assert.equal(isolated.status, "completed");
    assert.deepEqual(isolated.active_arm_outcomes, []);
    assert.equal(isolated.receipt.execution_mode, "fresh-node-child-hardened-vm");
    assert.equal(isolated.receipt.bundle_sha256, inventory.bundle_sha256);
    assert.equal(isolated.receipt.hash_attachment, "parent-after-validated-child-return");
    for (const field of [
      "filesystem_exposed_to_policy", "network_exposed_to_policy",
      "environment_exposed_to_policy", "clock_exposed_to_policy",
      "random_exposed_to_policy", "evaluator_exposed_to_policy",
      "dynamic_code_generation_exposed_to_policy",
    ]) assert.equal(isolated.receipt[field], false, field);
    const expected = FIXTURE_026_RSD_T02_ACTIVE_ARM_IDS.map((armId) => runFixture026RsdT02Arm({
      armId,
      packet,
      config,
      policyArtifactSha256: inventory.bundle_sha256,
      policyArtifactBytes: inventory.bundle_bytes,
      policyConfigSha256: sha256(Buffer.from(policyConfigUtf8, "utf8")),
      policyConfigBytes: Buffer.byteLength(policyConfigUtf8, "utf8"),
    }));
    assert.deepEqual(isolated.responses, expected);
    for (const response of isolated.responses) {
      assert.equal(response.policy_artifact_sha256, inventory.bundle_sha256);
      assert.equal(response.policy_config_sha256, sha256(Buffer.from(policyConfigUtf8, "utf8")));
      assert.equal(response.system_packet_sha256, sha256(Buffer.from(canonicalize(packet), "utf8")));
    }
  }
});

test("base-v2 policy output contains no hashes for the parent to trust prematurely", async () => {
  const { config } = await policyInputs();
  const base = evaluateFixture026RsdT02ArmBase({
    armId: "B-STATE-SPACE",
    packet: packetFor("M-I1-FFL"),
    config,
  });
  assert.deepEqual(Object.keys(base), [
    "schema", "contract_version", "arm_id", "properties", "counter",
    "retained_scalars", "parameter_scalars",
  ]);
  assert.equal(canonicalize(base).includes("sha256"), false);
});

test("timeout becomes an ordered visible bank abstention with no fallback", {
  timeout: 30_000,
}, async (context) => {
  if (!(await canCreateChildProcess())) {
    context.skip("host sandbox denies child-process creation; run outside that sandbox");
    return;
  }
  const { config, policyConfigUtf8 } = await policyInputs();
  const outcome = await runFixture026RsdT02IsolatedPolicyPacket({
    packet: packetFor("M-I1-FFL"),
    config,
    policyConfigUtf8,
    timeoutMs: 1,
  });
  assert.equal(outcome.status, "abstained");
  assert.equal(outcome.responses, null);
  assert.deepEqual(
    outcome.active_arm_outcomes.map((row) => row.arm_id),
    FIXTURE_026_RSD_T02_ACTIVE_ARM_IDS,
  );
  for (const row of outcome.active_arm_outcomes) {
    assert.deepEqual(row.reason_codes, ["isolated-policy-timeout"]);
    assert.equal(row.action, "abstain");
    assert.equal(row.retry_invocations, 0);
    assert.equal(row.fallback_invocations, 0);
    assert.equal(row.result_label, "NO_RESULT");
  }
});

test("crash, malformed, output overflow, replay, and work overflow classify fail closed", async () => {
  const { config, inventory } = await policyInputs();
  const packet = packetFor("M-I1-FFL");
  const bases = FIXTURE_026_RSD_T02_ACTIVE_ARM_IDS.map((armId) => (
    evaluateFixture026RsdT02ArmBase({ armId, packet, config })
  ));
  assert.equal(classifyFixture026RsdT02PolicyChildResult(childResult(null, {
    timedOut: true,
  })).reason, "isolated-policy-timeout");
  assert.equal(classifyFixture026RsdT02PolicyChildResult(childResult(null, {
    exitCode: 9,
  })).reason, "isolated-policy-child-crash");
  assert.equal(classifyFixture026RsdT02PolicyChildResult(childResult(null, {
    stdoutExceeded: true,
  })).reason, "isolated-policy-protocol-over-budget");
  assert.equal(classifyFixture026RsdT02PolicyChildResult(childResult(null, {
    stdout: Buffer.from("{}\n{}\n", "utf8"),
  })).reason, "isolated-policy-malformed-response");

  const overBudgetBases = structuredClone(bases);
  overBudgetBases[0].counter.scalar_operations += 1;
  assert.equal(classifyFixture026RsdT02PolicyChildResult(childResult(
    successfulChildResponse(overBudgetBases),
  )).reason, "isolated-policy-work-over-budget");

  const requestBytes = Buffer.from("request", "utf8");
  const packetBytes = Buffer.from("packet", "utf8");
  const configBytes = Buffer.from("config", "utf8");
  const binding = {
    request_sha256: sha256(requestBytes),
    request_bytes: requestBytes.length,
    packet_sha256: sha256(packetBytes),
    packet_utf8_bytes: packetBytes.length,
    config_sha256: sha256(configBytes),
    config_utf8_bytes: configBytes.length,
    bundle_sha256: inventory.bundle_sha256,
  };
  const valid = successfulChildResponse(bases, binding);
  assert.equal(classifyFixture026RsdT02PolicyChildResult(childResult(valid), {
    requestBytes, packetBytes, configBytes, inventory,
  }).reason, undefined);
  const replayed = structuredClone(valid);
  replayed.packet_sha256 = "f".repeat(64);
  assert.equal(classifyFixture026RsdT02PolicyChildResult(childResult(replayed), {
    requestBytes, packetBytes, configBytes, inventory,
  }).reason, "isolated-policy-malformed-response");
});
