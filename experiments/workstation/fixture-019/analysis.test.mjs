import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdtemp, readFile, rm, stat } from "node:fs/promises";
import path from "node:path";
import test from "node:test";

import { workerRequest } from "./test-helpers.mjs";

const root = process.cwd();

test("exact sign and PCG64DXSM bootstrap diagnostics are deterministic and persist their arrays", async () => {
  const temporary = await mkdtemp(path.join(root, "tmp-f019-analysis-"));
  try {
    const request = {
      action: "analyze",
      contrasts: [0.1, 0.2, -0.05, 0.3, 0.15, 0.05, 0.4, -0.1],
      resamples: 1000,
      label: "hostile-test",
      persist_directory: temporary,
    };
    const first = workerRequest(request);
    const second = workerRequest(request);
    assert.deepEqual(first, second);
    assert.equal(first.sign_test_method, "exact-enumeration");
    assert.equal(first.sign_test_assignment_count, 256);
    assert.ok(first.sign_randomization_p > 0 && first.sign_randomization_p <= 1);
    assert.equal(first.plus_one_sign_p, null);
    assert.equal(first.confirmatory_exact_resample_count, false);
    assert.equal((await stat(path.join(temporary, "primary-sign-vectors.i8"))).size, 2048);
    assert.equal((await stat(path.join(temporary, "primary-bootstrap-indices.u32le"))).size, 32000);
    assert.notEqual(
      (await readFile(path.join(temporary, "primary-sign-vectors.i8"))).length,
      0,
    );
  } finally {
    await rm(temporary, { recursive: true, force: true });
  }
});

test("small-cluster sign test enumerates every assignment in canonical order", async () => {
  const temporary = await mkdtemp(path.join(root, "tmp-f019-exact-sign-"));
  try {
    const result = workerRequest({
      action: "analyze",
      contrasts: [1, 2, 3, 4, 5, 6, 7, 8],
      resamples: 100,
      label: "exact-reference",
      persist_directory: temporary,
    });
    const expected = Buffer.alloc(256 * 8);
    for (let assignment = 0; assignment < 256; assignment += 1) {
      for (let contrast = 0; contrast < 8; contrast += 1) {
        expected.writeInt8((assignment & (1 << contrast)) === 0 ? -1 : 1, assignment * 8 + contrast);
      }
    }
    assert.equal(result.sign_test_method, "exact-enumeration");
    assert.equal(result.sign_test_assignment_count, 256);
    assert.equal(result.sign_randomization_p, 1 / 256);
    assert.equal(result.plus_one_sign_p, null);
    assert.equal(result.sign_vectors_sha256, createHash("sha256").update(expected).digest("hex"));
    assert.deepEqual(await readFile(path.join(temporary, "primary-sign-vectors.i8")), expected);
  } finally {
    await rm(temporary, { recursive: true, force: true });
  }
});

test("exact enumeration stops above the frozen n=20 boundary", () => {
  const exact = workerRequest({
    action: "analyze",
    contrasts: Array(20).fill(0.25),
    resamples: 100,
    label: "exact-boundary",
    persist_directory: null,
  });
  const monteCarlo = workerRequest({
    action: "analyze",
    contrasts: Array(21).fill(0.25),
    resamples: 100,
    label: "monte-carlo-boundary",
    persist_directory: null,
  });
  assert.equal(exact.sign_test_method, "exact-enumeration");
  assert.equal(exact.sign_test_assignment_count, 2 ** 20);
  assert.equal(exact.plus_one_sign_p, null);
  assert.equal(monteCarlo.sign_test_method, "monte-carlo-pcg64dxsm");
  assert.equal(monteCarlo.sign_test_assignment_count, 100);
  assert.ok(monteCarlo.plus_one_sign_p > 0 && monteCarlo.plus_one_sign_p <= 1);
});

test("zero-variance diagnostic produces a point interval without division by zero", () => {
  const result = workerRequest({
    action: "analyze",
    contrasts: [0.25, 0.25, 0.25, 0.25],
    resamples: 100,
    label: "zero-variance-test",
    persist_directory: null,
  });
  assert.deepEqual(result.percentile_t_interval_99, [0.25, 0.25]);
  assert.equal(result.standard_error, 0);
});
