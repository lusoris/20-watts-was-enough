export const armNames = [
  "threshold",
  "cascade",
  "conditioned-sprt",
  "selective-abstention",
  "retry-rollback",
  "independent-verifier",
  "reset-coupled",
  "oracle-ceiling",
];

function cheapScore(opportunity) {
  return (opportunity.evidence[0] + opportunity.evidence[1]) / 2;
}

function conditionedLogLikelihood(opportunity, config) {
  const [first, second] = opportunity.evidence;
  const prior = Math.log(config.unsafe_base_rate / (1 - config.unsafe_base_rate));
  const firstLogLikelihood = 2 * config.cheap_signal * first;
  const conditionalLogLikelihood =
    (2 * config.cheap_signal * (second - config.cheap_evidence_correlation * first)) /
    (1 + config.cheap_evidence_correlation);
  return { prior, firstLogLikelihood, conditionalLogLikelihood };
}

export function decide(arm, opportunity, config) {
  const score = cheapScore(opportunity);
  const base = {
    arm,
    commit: false,
    abstain: false,
    stage: false,
    reset: false,
    verifier_calls: 0,
    observations: 1,
    score,
    reason: "",
  };

  if (arm === "threshold") {
    return { ...base, commit: score < config.threshold, observations: 2, reason: "mean-threshold" };
  }
  if (arm === "cascade") {
    const firstPass = opportunity.evidence[0] < config.threshold;
    return {
      ...base,
      commit: firstPass && opportunity.evidence[1] < config.threshold,
      observations: firstPass ? 2 : 1,
      reason: firstPass ? "second-stage" : "early-reject",
    };
  }
  if (arm === "conditioned-sprt") {
    const llr = conditionedLogLikelihood(opportunity, config);
    const firstPosteriorLogOdds = llr.prior + llr.firstLogLikelihood;
    const stopEarly = Math.abs(firstPosteriorLogOdds) >= config.sprt_stop_boundary;
    const posteriorLogOdds = stopEarly
      ? firstPosteriorLogOdds
      : firstPosteriorLogOdds + llr.conditionalLogLikelihood;
    return {
      ...base,
      commit: posteriorLogOdds < config.sprt_log_odds_threshold,
      observations: stopEarly ? 1 : 2,
      score: posteriorLogOdds,
      reason: stopEarly ? "conditioned-sprt-early-stop" : "conditioned-sprt-second-observation",
    };
  }
  if (arm === "selective-abstention") {
    const abstain = Math.abs(score) <= config.abstention_band;
    return {
      ...base,
      commit: !abstain && score < config.threshold,
      abstain,
      observations: 2,
      reason: abstain ? "uncertainty-band" : "outside-band",
    };
  }
  if (arm === "retry-rollback") {
    const stage = opportunity.evidence[0] < config.threshold;
    const commit = stage && opportunity.evidence[1] < config.threshold;
    return {
      ...base,
      commit,
      stage,
      reset: stage && !commit,
      observations: stage ? 2 : 1,
      reason: stage ? (commit ? "retry-pass" : "retry-reset") : "first-reject",
    };
  }
  if (arm === "independent-verifier") {
    const eligible = score < config.verifier_gate;
    return {
      ...base,
      commit: eligible && opportunity.verifier < config.verifier_threshold,
      verifier_calls: eligible ? 1 : 0,
      observations: 2 + (eligible ? 1 : 0),
      reason: eligible ? "independent-verifier" : "cheap-reject",
    };
  }
  if (arm === "reset-coupled") {
    if (score < -config.reversible_trace_band) {
      return { ...base, commit: true, observations: 2, reason: "low-risk-direct-commit" };
    }
    const commit = opportunity.verifier < config.verifier_threshold;
    return {
      ...base,
      commit,
      stage: true,
      reset: !commit,
      verifier_calls: 1,
      observations: 3,
      reason: commit ? "verified-commit" : "verified-reset",
    };
  }
  if (arm === "oracle-ceiling") {
    return { ...base, commit: !opportunity.unsafe, reason: "oracle-truth" };
  }
  throw new Error(`Unknown arm: ${arm}`);
}

export function scoreDecision(opportunity, decision, config) {
  const falseCommit = decision.commit && opportunity.unsafe;
  const falseReject = !decision.commit && !opportunity.unsafe;
  const loss =
    (falseCommit ? opportunity.consequence : 0) +
    (falseReject ? config.false_reject_cost : 0);
  const modeledEnergy =
    decision.observations * config.modeled_energy_j.observation +
    decision.verifier_calls * config.modeled_energy_j.verifier +
    (decision.stage ? config.modeled_energy_j.stage : 0) +
    (decision.reset ? config.modeled_energy_j.reset : 0) +
    (decision.commit ? config.modeled_energy_j.commit : 0);
  return { falseCommit, falseReject, loss, modeledEnergy };
}
