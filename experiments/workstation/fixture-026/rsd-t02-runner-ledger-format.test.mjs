import assert from "node:assert/strict";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";

import {
  executeFixture026RsdT02,
  prepareFixture026RsdT02,
  validateFixture026RsdT02BoundedConformanceConfig,
  validateFixture026RsdT02SeedDocument,
  validateFixture026RsdT02Unavailable,
} from "./rsd-t02-runner.mjs";
import {
  ACTIVE_ARM_IDS,
  cleanup,
  corruptPartial,
} from "./rsd-t02-runner.test-support.mjs";

test("preparation freezes the bounded 175-record public-development grid", async () => {
  const prepared = await prepareFixture026RsdT02("smoke");
  assert.equal(prepared.work_units, 175);
  assert.equal(prepared.seed_scope, "bounded-ordered-prefix-construction-conformance");
  assert.equal(prepared.source_seed_count, 64);
  assert.equal(prepared.construction_seed_count, 1);
  assert.equal(prepared.configured_work_units, 175);
  assert.equal(prepared.full_public_development_pack_executed, false);
  assert.equal(prepared.executions_per_recipe_per_seed, 35);
  assert.equal(prepared.recipes, 5);
  assert.equal(prepared.o0_records_per_seed, 45);
  assert.equal(prepared.o1_records_per_seed, 130);
  assert.equal(prepared.o2_executed, false);
  assert.equal(prepared.floor_executed, false);
  assert.equal(prepared.arm_packet_records, 5);
  assert.equal(prepared.arm_responses, 45);
  assert.equal(
    prepared.arm_policy_execution_boundary,
    "fixture-026.rsd-t02-isolated-policy.v2",
  );
  assert.equal(prepared.isolated_policy_children, 5);
  assert.match(prepared.policy_bundle_sha256, /^[0-9a-f]{64}$/u);
  assert.match(prepared.policy_bundle_inventory_sha256, /^[0-9a-f]{64}$/u);
  assert.deepEqual(prepared.actionable_arms_implemented, ACTIVE_ARM_IDS);
  assert.deepEqual(prepared.actionable_arms_not_implemented, []);
  assert.equal(prepared.result_label, "NO_RESULT");
  assert.equal(prepared.claim_eligible, false);
  const development = await prepareFixture026RsdT02("development");
  assert.equal(development.work_units, 350);
  assert.equal(development.source_seed_count, 64);
  assert.equal(development.construction_seed_count, 2);
  assert.equal(development.configured_work_units, 350);
  assert.equal(development.full_public_development_pack_executed, false);
  assert.equal(development.arm_packet_records, 10);
  assert.equal(development.arm_responses, 90);
  assert.equal(development.isolated_policy_children, 10);
});

test("all source seeds, bounded counts, and absence records are closed inputs", async () => {
  const readJson = async (relative) => JSON.parse(await readFile(
    path.join("experiments/workstation/fixture-026", relative),
    "utf8",
  ));
  const seeds = await readJson("seeds/development.reveal.json");
  assert.equal(validateFixture026RsdT02SeedDocument(seeds), seeds);
  for (const mutate of [
    (document) => { document.algorithm = "implicit-rng"; },
    (document) => { document.encoding = "decimal-text"; },
    (document) => { document.seeds = document.seeds.slice(0, 2); },
    (document) => { document.seeds[63] = "18446744073709551616"; },
    (document) => { document.seeds[63] = "01"; },
  ]) {
    const mutant = structuredClone(seeds);
    mutate(mutant);
    assert.throws(() => validateFixture026RsdT02SeedDocument(mutant), /seed document/u);
  }
  const config = await readJson("configs/rsd-t02-bounded-conformance.json");
  assert.equal(validateFixture026RsdT02BoundedConformanceConfig(config), config);
  const falseCount = structuredClone(config);
  falseCount.profiles.development.work_units = 349;
  assert.throws(
    () => validateFixture026RsdT02BoundedConformanceConfig(falseCount),
    /bounded conformance configuration/u,
  );
  const falseSourceCount = structuredClone(config);
  falseSourceCount.source_seed_count = 2;
  assert.throws(
    () => validateFixture026RsdT02BoundedConformanceConfig(falseSourceCount),
    /bounded conformance configuration/u,
  );
  for (const [file, partition] of [
    ["seeds/confirmation.unavailable.json", "confirmation"],
    ["seeds/transfer.unavailable.json", "held-out"],
  ]) {
    const unavailable = await readJson(file);
    assert.equal(validateFixture026RsdT02Unavailable(unavailable, partition), unavailable);
    const mutant = structuredClone(unavailable);
    mutant.contains_seeds = true;
    assert.throws(
      () => validateFixture026RsdT02Unavailable(mutant, partition),
      /absence record/u,
    );
  }
});

test("resume rejects CRLF, torn, blank, and mixed-identity ledgers", async () => {
  const mutations = [
    {
      apply: async ({ rawPath, raw }) => writeFile(rawPath, raw.replaceAll("\n", "\r\n")),
      expected: /CRLF/u,
      profile: "smoke",
    },
    {
      apply: async ({ rawPath, raw }) => writeFile(rawPath, raw.slice(0, -1)),
      expected: /torn/u,
      profile: "smoke",
    },
    {
      apply: async ({ rawPath, raw }) => writeFile(rawPath, `${raw}\n`),
      expected: /blank/u,
      profile: "smoke",
    },
    {
      apply: async () => {},
      expected: /stored arm commitment|identity mismatch|run_id|profile|authority contract/i,
      profile: "development",
    },
  ];
  for (const mutation of mutations) {
    const fixture = await corruptPartial(mutation.apply);
    try {
      await assert.rejects(
        () => executeFixture026RsdT02({
          profile: mutation.profile,
          output: fixture.output,
          resume: true,
        }),
        mutation.expected,
      );
    } finally {
      await cleanup(fixture);
    }
  }
});
