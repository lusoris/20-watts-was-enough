export function createRng(seed) {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function normal(rng) {
  const u1 = Math.max(rng(), Number.EPSILON);
  const u2 = rng();
  return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
}

export function generateOpportunities(config, seed) {
  const rng = createRng(seed);
  const opportunities = [];
  const rho = config.cheap_evidence_correlation;
  const commonWeight = Math.sqrt(rho);
  const residualWeight = Math.sqrt(1 - rho);

  for (let index = 0; index < config.opportunities_per_seed; index += 1) {
    const unsafe = rng() < config.unsafe_base_rate;
    const direction = unsafe ? 1 : -1;
    const common = normal(rng);
    const evidence1 =
      direction * config.cheap_signal + commonWeight * common + residualWeight * normal(rng);
    const evidence2 =
      direction * config.cheap_signal + commonWeight * common + residualWeight * normal(rng);
    const consequence =
      config.false_commit_cost * (0.75 + 0.5 * rng());
    const traceNonce = Math.floor(rng() * 0x1_0000_0000);

    opportunities.push({
      id: `${seed}-${String(index).padStart(6, "0")}`,
      seed,
      index,
      unsafe,
      evidence: [evidence1, evidence2],
      trace_job: {
        unsafe,
        cheap_common_mode: common,
        nonce: traceNonce,
      },
      consequence,
      payload: `candidate-010:${seed}:${index}`,
    });
  }
  return opportunities;
}
