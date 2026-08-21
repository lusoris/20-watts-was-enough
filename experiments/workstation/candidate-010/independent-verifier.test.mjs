import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import {
  INDEPENDENT_VERIFIER_IMPLEMENTATION_ID,
  executeIndependentVerifier,
  validateIndependentVerifierLineage,
} from "./independent-verifier.mjs";

const modulePath = path.join(path.dirname(new URL(import.meta.url).pathname.replace(/^\/(.:)/, "$1")), "independent-verifier.mjs");

const opportunity = {
  id: "independent-fixture",
  trace_job: { unsafe: false, nonce: "nonce-001", cheap_common_mode: 0.25 },
};
const config = { verifier_signal: 1.25 };

test("independent verifier is deterministic and records a separate implementation lineage", () => {
  const first = executeIndependentVerifier({ opportunity, config });
  const second = executeIndependentVerifier({ opportunity, config });
  assert.deepEqual(first, second);
  assert.equal(first.lineage.implementation_id, INDEPENDENT_VERIFIER_IMPLEMENTATION_ID);
  assert.equal(first.lineage.shared_trace_implementation, false);
  assert.deepEqual(validateIndependentVerifierLineage(first.lineage, { opportunity, config }), first);
});

test("independent verifier source does not import or invoke the candidate trace helper", async () => {
  const source = await readFile(modulePath, "utf8");
  assert.doesNotMatch(source, /from\s+["'].+trace-job\.mjs["']/);
  assert.doesNotMatch(source, /traceBodyForJob|executeTraceJob/);
});

test("shared or relabeled implementations are rejected", () => {
  const valid = executeIndependentVerifier({ opportunity, config }).lineage;
  assert.throws(
    () => validateIndependentVerifierLineage(
      { ...valid, shared_trace_implementation: true },
      { opportunity, config },
    ),
    /shares the candidate trace implementation/,
  );
  assert.throws(
    () => validateIndependentVerifierLineage(
      { ...valid, implementation_id: "candidate-trace-job-v1" },
      { opportunity, config },
    ),
    /shares the candidate trace implementation/,
  );
});

test("hash-shaped substitutions cannot replace recomputation from the frozen input", () => {
  const valid = executeIndependentVerifier({ opportunity, config }).lineage;
  assert.throws(
    () => validateIndependentVerifierLineage(
      { ...valid, input_sha256: "f".repeat(64) },
      { opportunity, config },
    ),
    /do not match the frozen input/,
  );
  assert.throws(
    () => validateIndependentVerifierLineage(
      { ...valid, output_sha256: "e".repeat(64) },
      { opportunity, config },
    ),
    /do not match the frozen input/,
  );
  assert.throws(
    () => validateIndependentVerifierLineage(valid, {
      opportunity: { ...opportunity, trace_job: { ...opportunity.trace_job, nonce: "substituted" } },
      config,
    }),
    /do not match the frozen input/,
  );
});
