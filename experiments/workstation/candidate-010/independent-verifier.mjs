import { createHash } from "node:crypto";

export const INDEPENDENT_VERIFIER_IMPLEMENTATION_ID = "candidate-010-independent-sha512-verifier-v1";

function canonical(value) {
  if (Array.isArray(value)) return `[${value.map(canonical).join(",")}]`;
  if (value && typeof value === "object") {
    return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${canonical(value[key])}`).join(",")}}`;
  }
  return JSON.stringify(value);
}

function sha256(value) {
  return createHash("sha256").update(value).digest("hex");
}

function independentNormal(nonce) {
  const digest = createHash("sha512")
    .update("candidate-010-independent-verifier-domain-v1\0")
    .update(String(nonce))
    .digest();
  const u1 = Math.max(digest.readUInt32LE(0) / 0x1_0000_0000, Number.EPSILON);
  const u2 = digest.readUInt32LE(8) / 0x1_0000_0000;
  return Math.sqrt(-2 * Math.log(u1)) * Math.sin(2 * Math.PI * u2);
}

function computeIndependentVerifier({ opportunity, config }) {
  const job = opportunity?.trace_job;
  if (!job || typeof job.unsafe !== "boolean" || job.nonce === undefined) {
    throw new Error("Independent verifier requires an explicitly typed verifier job.");
  }
  if (!Number.isFinite(config?.verifier_signal)) {
    throw new Error("Independent verifier requires a finite verifier signal.");
  }
  const input = {
    schema: 1,
    opportunity_id: opportunity.id,
    unsafe: job.unsafe,
    nonce: job.nonce,
    signal: config.verifier_signal,
  };
  const direction = job.unsafe ? 1 : -1;
  const value = direction * config.verifier_signal + independentNormal(job.nonce);
  if (!Number.isFinite(value)) throw new Error("Independent verifier produced a non-finite result.");
  return Object.freeze({
    value,
    lineage: Object.freeze({
    schema: 1,
    comparator: "independent-verifier",
    implementation_id: INDEPENDENT_VERIFIER_IMPLEMENTATION_ID,
    source_module: "independent-verifier.mjs",
    implementation_independent: true,
    shared_trace_implementation: false,
    input_sha256: sha256(canonical(input)),
    output_sha256: sha256(canonical({ schema: 1, value })),
    }),
  });
}

export function executeIndependentVerifier(input) {
  return computeIndependentVerifier(input);
}

export function validateIndependentVerifierLineage(lineage, input) {
  if (
    lineage?.schema !== 1
    || lineage.comparator !== "independent-verifier"
    || lineage.implementation_id !== INDEPENDENT_VERIFIER_IMPLEMENTATION_ID
    || lineage.source_module !== "independent-verifier.mjs"
    || lineage.implementation_independent !== true
    || lineage.shared_trace_implementation !== false
  ) throw new Error("Independent-verifier lineage is missing or shares the candidate trace implementation.");
  const recomputed = computeIndependentVerifier(input);
  if (canonical(lineage) !== canonical(recomputed.lineage)) {
    throw new Error("Independent-verifier lineage hashes do not match the frozen input and recomputed output.");
  }
  return recomputed;
}
