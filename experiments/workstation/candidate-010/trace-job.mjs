import { createHash } from "node:crypto";

function normalFromNonce(nonce) {
  const digest = createHash("sha256").update(String(nonce)).digest();
  const u1 = Math.max(digest.readUInt32BE(0) / 0x1_0000_0000, Number.EPSILON);
  const u2 = digest.readUInt32BE(4) / 0x1_0000_0000;
  return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
}

export function executeTraceJob(job, config) {
  const direction = job.trace_job.unsafe ? 1 : -1;
  const commonWeight = config.verifier_common_mode_weight;
  const residualWeight = Math.sqrt(1 - commonWeight ** 2);
  return (
    direction * config.verifier_signal
    + commonWeight * job.trace_job.cheap_common_mode
    + residualWeight * normalFromNonce(job.trace_job.nonce)
  );
}

export function traceBodyForJob(job, config) {
  const verifier = executeTraceJob(job, config);
  return {
    verifier,
    body: `${JSON.stringify({ schema: 1, verifier })}\n`,
  };
}
