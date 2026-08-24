import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";

import { validateExecutionManifest } from "../../../scripts/lib/workstation-manifests.mjs";

const root = process.cwd();
const manifestPath = path.join(
  root,
  "experiments",
  "workstation",
  "manifests",
  "fixture-012.json",
);

test("the canonical manifest resolves C-1407 and its frozen full development path", async () => {
  const result = await validateExecutionManifest(root, manifestPath, "fixture-012");
  assert.equal(result.readiness, "smoke-ready");
  assert.equal(result.ready, false);
  assert.deepEqual(result.errors, []);
  assert.deepEqual(result.executionClaims, ["C-1407"]);
  for (const id of ["execution-claim-scope", "full-profile", "full-tests"]) {
    assert.equal(result.promotionChecks.find((check) => check.id === id).passed, true, id);
  }
  for (const id of ["confirmation-seeds", "held_out-seeds", "promotion-evidence"]) {
    assert.equal(result.promotionChecks.find((check) => check.id === id).passed, false, id);
  }
});

test("manifest claim scope fails closed when the ledger lacks the exact fixture link", async () => {
  const temporary = await mkdtemp(path.join(root, "tmp-fixture-012-manifest-"));
  const alteredPath = path.join(temporary, "fixture-012.json");
  try {
    const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
    manifest.implementation.execution_claims = ["C-1406"];
    await writeFile(alteredPath, `${JSON.stringify(manifest, null, 2)}\n`);
    const result = await validateExecutionManifest(root, alteredPath, "fixture-012");
    assert.equal(
      result.promotionChecks.find((check) => check.id === "execution-claim-scope").passed,
      false,
    );
  } finally {
    assert.ok(temporary.startsWith(root));
    await rm(temporary, { recursive: true, force: true });
  }
});
