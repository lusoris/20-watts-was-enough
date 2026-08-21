import assert from "node:assert/strict";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import {
  CANDIDATE_010_SOURCE_FILES,
  captureCandidate010SourceBundle,
  computeSourceBundle,
} from "./source-bundle.mjs";

const REQUIRED_EXECUTABLE_SOURCES = Object.freeze([
  "package-lock.json",
  "package.json",
  "experiments/workstation/candidate-010/actuator-command-track.mjs",
  "experiments/workstation/candidate-010/backend-registry.mjs",
  "experiments/workstation/candidate-010/checkpoint.mjs",
  "experiments/workstation/candidate-010/configs/development.json",
  "experiments/workstation/candidate-010/configs/smoke.json",
  "experiments/workstation/candidate-010/confirmatory-analysis.mjs",
  "experiments/workstation/candidate-010/energy-provider.config.json",
  "experiments/workstation/candidate-010/energy-provider.mjs",
  "experiments/workstation/candidate-010/factorial-design.mjs",
  "experiments/workstation/candidate-010/factorial-runner.mjs",
  "experiments/workstation/candidate-010/filesystem-track.mjs",
  "experiments/workstation/candidate-010/generator.mjs",
  "experiments/workstation/candidate-010/output.schema.json",
  "experiments/workstation/candidate-010/policies.mjs",
  "experiments/workstation/candidate-010/promotion-evidence.mjs",
  "experiments/workstation/candidate-010/release-contract.mjs",
  "experiments/workstation/candidate-010/runner.mjs",
  "experiments/workstation/candidate-010/seeds/seed-pack.mjs",
  "experiments/workstation/candidate-010/signed-publication-track.mjs",
  "experiments/workstation/candidate-010/source-bundle.mjs",
  "experiments/workstation/candidate-010/trace-job.mjs",
  "experiments/workstation/candidate-010/transactional-kv-track.mjs",
]);

test("Candidate 010 source identity covers every executable layer and is deterministic", async () => {
  const first = await captureCandidate010SourceBundle();
  const second = await captureCandidate010SourceBundle();
  assert.deepEqual(first, second);
  assert.equal(first.files.length, CANDIDATE_010_SOURCE_FILES.length);
  assert.match(first.source_sha256, /^[0-9a-f]{64}$/);
  assert.match(first.vcs.source_commit, /^[0-9a-f]{40}$/);
  assert.deepEqual(CANDIDATE_010_SOURCE_FILES, REQUIRED_EXECUTABLE_SOURCES);
  assert.deepEqual(
    first.files.map((entry) => entry.path),
    [...REQUIRED_EXECUTABLE_SOURCES].sort(),
  );
});

test("one source byte changes the bundle and escaping or duplicate paths are refused", async () => {
  const temporary = await mkdtemp(path.join(os.tmpdir(), "20w-c010-source-bundle-"));
  try {
    await writeFile(path.join(temporary, "a.mjs"), "export const value = 1;\n");
    await writeFile(path.join(temporary, "b.mjs"), "export const value = 2;\n");
    const first = await computeSourceBundle({ root: temporary, sourceFiles: ["a.mjs", "b.mjs"] });
    await writeFile(path.join(temporary, "b.mjs"), "export const value = 3;\n");
    const second = await computeSourceBundle({ root: temporary, sourceFiles: ["a.mjs", "b.mjs"] });
    assert.notEqual(first.source_sha256, second.source_sha256);
    await assert.rejects(
      computeSourceBundle({ root: temporary, sourceFiles: ["../outside.mjs"] }),
      /stay relative/,
    );
    await assert.rejects(
      computeSourceBundle({ root: temporary, sourceFiles: ["a.mjs", "a.mjs"] }),
      /unique/,
    );
  } finally {
    assert.ok(temporary.startsWith(os.tmpdir()));
    await rm(temporary, { recursive: true, force: true });
  }
});
