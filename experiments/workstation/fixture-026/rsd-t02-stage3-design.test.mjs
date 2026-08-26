import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { sha256Hex } from "../lib/checkpoint-ledger.mjs";
import {
  assertFixture026RsdT02Stage3Action,
  assertFixture026RsdT02Stage3Design,
  buildFixture026RsdT02Stage3Assignment,
} from "./rsd-t02-stage3-design.mjs";

const fixtureRoot = path.dirname(fileURLToPath(import.meta.url));

async function loadFixture() {
  const [designBytes, seedBytes] = await Promise.all([
    readFile(path.join(fixtureRoot, "configs", "rsd-t02-stage3-design.json")),
    readFile(path.join(fixtureRoot, "seeds", "development.reveal.json")),
  ]);
  return {
    design: JSON.parse(designBytes.toString("utf8")),
    seedDocument: JSON.parse(seedBytes.toString("utf8")),
    sourceSeedSha256: sha256Hex(seedBytes),
  };
}

function clone(value) {
  return structuredClone(value);
}

test("Stage-3 design freezes a disjoint 32/16/16 procedural split", async () => {
  const fixture = await loadFixture();
  assert.equal(assertFixture026RsdT02Stage3Design(fixture.design), fixture.design);
  const assignment = buildFixture026RsdT02Stage3Assignment(fixture);
  assert.deepEqual(assignment.roles.map(({ role, seeds }) => [role, seeds.length]), [
    ["fit", 32], ["calibration", 16], ["evaluation", 16],
  ]);
  assert.equal(assignment.roles[0].seeds[0], "1540001");
  assert.equal(assignment.roles[0].seeds.at(-1), "1540032");
  assert.equal(assignment.roles[1].seeds[0], "1540033");
  assert.equal(assignment.roles[1].seeds.at(-1), "1540048");
  assert.equal(assignment.roles[2].seeds[0], "1540049");
  assert.equal(assignment.roles[2].seeds.at(-1), "1540064");
  assert.equal(
    assignment.assignment_sha256,
    "f7756f427c605f789c745ce74716fbef56b76ebef5d1c29ca9a81002a545e1f0",
  );
  assert.equal(assignment.comparison_inference_permitted, false);
  assert.equal(assignment.claim_eligible, false);
  assert.equal(assignment.result_label, "NO_RESULT");
});

test("Stage-3 design states that current seeds are not scientific replicates", async () => {
  const { design } = await loadFixture();
  assert.equal(design.replication_boundary.current_seeds_are_independent_scientific_units, false);
  assert.equal(design.replication_boundary.seed_level_inferential_replication_permitted, false);
  assert.equal(design.replication_boundary.outer_system_family_holdout_required, true);
  assert.equal(design.endpoint_contract.current_power_status, "not-powered-current-split");
});

test("Stage-3 role capabilities prevent calibration and evaluation leakage", async () => {
  const { design } = await loadFixture();
  assert.equal(assertFixture026RsdT02Stage3Action(design, "fit", "fit-parameters"), true);
  assert.equal(assertFixture026RsdT02Stage3Action(
    design, "calibration", "calibrate-probabilities",
  ), true);
  assert.equal(assertFixture026RsdT02Stage3Action(
    design, "evaluation", "frozen-inference",
  ), true);
  assert.throws(
    () => assertFixture026RsdT02Stage3Action(design, "calibration", "fit-model-parameters"),
    /forbids action/u,
  );
  assert.throws(
    () => assertFixture026RsdT02Stage3Action(design, "evaluation", "change-any-threshold"),
    /forbids action/u,
  );
  assert.throws(
    () => assertFixture026RsdT02Stage3Action(design, "evaluation", "claim-comparison"),
    /forbids action/u,
  );
});

test("Stage-3 assignment rejects source mutation, reordering, and overlap", async () => {
  const fixture = await loadFixture();
  assert.throws(
    () => buildFixture026RsdT02Stage3Assignment({
      ...fixture, sourceSeedSha256: "0".repeat(64),
    }),
    /source seed identity/u,
  );
  const reordered = clone(fixture.seedDocument);
  [reordered.seeds[0], reordered.seeds[1]] = [reordered.seeds[1], reordered.seeds[0]];
  assert.throws(
    () => buildFixture026RsdT02Stage3Assignment({ ...fixture, seedDocument: reordered }),
    /source seed identity/u,
  );
  const overlap = clone(fixture.design);
  overlap.information_cut.roles[1].offset = 31;
  assert.throws(
    () => buildFixture026RsdT02Stage3Assignment({ ...fixture, design: overlap }),
    /closed contract/u,
  );
});

test("Stage-3 closed design rejects authority or maturity inflation", async () => {
  const { design } = await loadFixture();
  for (const mutate of [
    (value) => { value.claim_eligible = true; },
    (value) => { value.comparison_inference_permitted = true; },
    (value) => { value.reference_arms[0].construction_status = "implemented"; },
    (value) => { value.replication_boundary.current_seeds_are_independent_scientific_units = true; },
    (value) => { value.endpoint_contract.current_power_status = "powered"; },
  ]) {
    const hostile = clone(design);
    mutate(hostile);
    assert.throws(
      () => assertFixture026RsdT02Stage3Design(hostile),
      /closed contract/u,
    );
  }
});
