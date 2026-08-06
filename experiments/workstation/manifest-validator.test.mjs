import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { validateExecutionManifest } from "../../scripts/lib/workstation-manifests.mjs";

const root = process.cwd();
const realManifest = path.join(root, "experiments", "workstation", "manifests", "candidate-010.json");

test("smoke readiness cannot promote an artifact to workstation-ready", async () => {
  const result = await validateExecutionManifest(root, realManifest, "candidate-010");
  assert.equal(result.readiness, "smoke-ready");
  assert.equal(result.ready, false);
  assert.deepEqual(result.errors, []);
});

test("six truthy placeholder fields cannot pass the execution gate", async () => {
  const temporary = await mkdtemp(path.join(os.tmpdir(), "20w-manifest-"));
  const manifestPath = path.join(temporary, "candidate-010.json");
  try {
    await writeFile(
      manifestPath,
      JSON.stringify({
        schema: 1,
        artifact: "candidate-010",
        readiness: "workstation-ready",
        command: "yes",
        environment: "yes",
        hardware: "yes",
        seeds: "yes",
        data: "yes",
        outputs: "yes",
      }),
    );
    const result = await validateExecutionManifest(root, manifestPath, "candidate-010");
    assert.equal(result.ready, false);
    assert.ok(result.errors.length >= 10);
  } finally {
    assert.ok(temporary.startsWith(os.tmpdir()));
    await rm(temporary, { recursive: true, force: true });
  }
});

test("changing only the readiness label still fails the full gate", async () => {
  const source = JSON.parse(await readFile(realManifest, "utf8"));
  source.readiness = "workstation-ready";
  const temporary = await mkdtemp(path.join(os.tmpdir(), "20w-manifest-full-"));
  const manifestPath = path.join(temporary, "candidate-010.json");
  try {
    await writeFile(manifestPath, JSON.stringify(source));
    const result = await validateExecutionManifest(root, manifestPath, "candidate-010");
    assert.equal(result.ready, false);
    assert.ok(result.errors.some((error) => error.includes("hash_chain")));
    assert.ok(result.errors.some((error) => error.includes("confirmation")));
    assert.ok(result.errors.some((error) => error.includes("energy.required")));
  } finally {
    assert.ok(temporary.startsWith(os.tmpdir()));
    await rm(temporary, { recursive: true, force: true });
  }
});
