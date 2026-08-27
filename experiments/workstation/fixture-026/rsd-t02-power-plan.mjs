import { FIXTURE_026_RSD_T02_REGISTERED_HYPOTHESES } from "./rsd-t02-holm4.mjs";
import { FIXTURE_026_RSD_T02_POPULATION_DESIGN_SHA256 } from "./rsd-t02-population-contract.mjs";

export const FIXTURE_026_RSD_T02_POWER_PLAN_VERSION =
  "fixture-026.rsd-t02-prospective-power-plan.v1";

const SHA256_PATTERN = /^[0-9a-f]{64}$/u;
const IDENTIFIER_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._-]{2,127}$/u;
const REGISTERED_IDS = new Set(
  FIXTURE_026_RSD_T02_REGISTERED_HYPOTHESES.map((row) => row.hypothesis_id),
);

function refuse(message) {
  throw new Error(`Fixture 026 RSD-T02 power plan refused: ${message}`);
}

// Acklam's inverse-normal approximation. The method and all planning inputs are
// exposed in the result; it is not substituted for the final randomization test.
export function fixture026RsdT02InverseNormal(probability) {
  if (!(probability > 0 && probability < 1)) refuse("normal probability must lie strictly between zero and one");
  const a = [-39.69683028665376, 220.9460984245205, -275.9285104469687, 138.357751867269, -30.66479806614716, 2.506628277459239];
  const b = [-54.47609879822406, 161.5858368580409, -155.6989798598866, 66.80131188771972, -13.28068155288572];
  const c = [-0.007784894002430293, -0.3223964580411365, -2.400758277161838, -2.549732539343734, 4.374664141464968, 2.938163982698783];
  const d = [0.007784695709041462, 0.3224671290700398, 2.445134137142996, 3.754408661907416];
  const low = 0.02425;
  const high = 1 - low;
  if (probability < low) {
    const q = Math.sqrt(-2 * Math.log(probability));
    return (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5])
      / ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1);
  }
  if (probability > high) return -fixture026RsdT02InverseNormal(1 - probability);
  const q = probability - 0.5;
  const r = q * q;
  return (((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) * q
    / (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1);
}

function normalCdf(value) {
  const absolute = Math.abs(value);
  const t = 1 / (1 + 0.2316419 * absolute);
  const density = 0.3989422804014327 * Math.exp(-0.5 * absolute * absolute);
  const tail = density * t * (
    0.319381530 + t * (-0.356563782 + t * (1.781477937 + t * (-1.821255978 + t * 1.330274429)))
  );
  return value >= 0 ? 1 - tail : tail;
}

export function fixture026RsdT02BinomialLowerTail({ trials, success_probability: successProbability, minimum_successes: minimumSuccesses }) {
  if (
    !Number.isSafeInteger(trials)
    || trials < 0
    || !Number.isFinite(successProbability)
    || successProbability < 0
    || successProbability > 1
    || !Number.isSafeInteger(minimumSuccesses)
    || minimumSuccesses < 0
  ) refuse("binomial-tail inputs are invalid");
  if (minimumSuccesses <= 0) return 0;
  if (minimumSuccesses > trials) return 1;
  if (successProbability === 0) return 1;
  if (successProbability === 1) return 0;
  const failureProbability = 1 - successProbability;
  const logOdds = Math.log(successProbability / failureProbability);
  let logTerm = trials * Math.log(failureProbability);
  let maximumLogTerm = Number.NEGATIVE_INFINITY;
  const logs = [];
  for (let successes = 0; successes < minimumSuccesses; successes += 1) {
    logs.push(logTerm);
    maximumLogTerm = Math.max(maximumLogTerm, logTerm);
    logTerm += Math.log(trials - successes) - Math.log(successes + 1) + logOdds;
  }
  const scaled = logs.reduce(
    (sum, value) => sum + Math.exp(value - maximumLogTerm),
    0,
  );
  return Math.min(1, Math.exp(maximumLogTerm) * scaled);
}

export function fixture026RsdT02PlannedCountForRetention({
  effectiveCount,
  attritionRate,
  perFamilyFailureProbability,
}) {
  if (attritionRate === 0) return effectiveCount;
  const retentionProbability = 1 - attritionRate;
  const shortfall = (planned) => fixture026RsdT02BinomialLowerTail({
    trials: planned,
    success_probability: retentionProbability,
    minimum_successes: effectiveCount,
  });
  let low = effectiveCount;
  let high = Math.max(effectiveCount, Math.ceil(effectiveCount / retentionProbability));
  while (shortfall(high) > perFamilyFailureProbability) {
    high *= 2;
    if (!Number.isSafeInteger(high) || high > 10_000_000) {
      refuse("retention-assured planned count exceeds the computational planning limit");
    }
  }
  while (low < high) {
    const middle = Math.floor((low + high) / 2);
    if (shortfall(middle) <= perFamilyFailureProbability) high = middle;
    else low = middle + 1;
  }
  return low;
}

function assertInput(input) {
  if (!input || typeof input !== "object" || Array.isArray(input)) refuse("input must be an object");
  if (input.schema !== 1 || input.contract_version !== FIXTURE_026_RSD_T02_POWER_PLAN_VERSION) {
    refuse("schema or contract version differs from v1");
  }
  if (input.authority !== "prospective-development-evaluation-variance-input-only") {
    refuse("power inputs must come only from public development-evaluation variance");
  }
  if (input.pilot_input_role !== "development-evaluation-only") refuse("pilot input role is not independent development evaluation");
  if (input.private_response_power_recalculation_permitted !== false) refuse("private-response power recalculation must be forbidden");
  if (!SHA256_PATTERN.test(input.pilot_variance_artifact_sha256 ?? "")) refuse("pilot variance artifact hash is invalid");
  if (!SHA256_PATTERN.test(input.analysis_implementation_sha256 ?? "")) refuse("analysis implementation hash is invalid");
  if (input.population_design_sha256 !== FIXTURE_026_RSD_T02_POPULATION_DESIGN_SHA256) refuse("population design hash is not the frozen RSD-T02 design");
  if (input.independent_unit !== "system-instance") refuse("only system-instance counts are permitted");
  if (input.family_mode !== "fixed-family-stratified-equal-family-weight") refuse("family mode must match the fixed-panel estimand");
  if (input.multiplicity_rule !== "holm-worst-case-first-step-alpha-over-4") refuse("planning must use the conservative first Holm threshold");
  if (input.runtime_failure_disposition !== "in-denominator-registered-penalty") refuse("runtime failures cannot be dropped");
  if (input.familywise_alpha !== 0.05) refuse("familywise alpha must equal the frozen 0.05 design value");
  if (!Number.isFinite(input.target_power) || input.target_power <= 0.5 || input.target_power >= 1) refuse("target power must lie between 0.5 and one");
  if (!Number.isFinite(input.pre_response_attrition_rate) || input.pre_response_attrition_rate < 0 || input.pre_response_attrition_rate >= 0.5) refuse("pre-response attrition rate must lie from zero through less than 0.5");
  if (!Number.isFinite(input.support_coverage_floor) || input.support_coverage_floor <= 0 || input.support_coverage_floor > 1) refuse("support coverage floor is invalid");
  if (!Number.isFinite(input.retention_assurance) || input.retention_assurance <= 0.5 || input.retention_assurance >= 1) refuse("retention assurance must lie between 0.5 and one");
  if (!Number.isSafeInteger(input.bootstrap_resamples) || input.bootstrap_resamples < 1000 || input.bootstrap_resamples > 1_000_000) refuse("bootstrap resamples must lie from 1,000 through 1,000,000");
  if (!Number.isSafeInteger(input.max_planned_instances_per_family) || input.max_planned_instances_per_family < 2) refuse("maximum planned count per family is invalid");
  if (
    !Array.isArray(input.family_ids)
    || input.family_ids.length < 2
    || new Set(input.family_ids).size !== input.family_ids.length
    || input.family_ids.some((id) => !IDENTIFIER_PATTERN.test(id))
  ) refuse("at least two unique fixed family IDs are required");
  if (!Array.isArray(input.hypotheses) || input.hypotheses.length !== 4) refuse("exactly four power hypotheses are required");
  const seen = new Set();
  for (const [index, hypothesis] of input.hypotheses.entries()) {
    if (!hypothesis || typeof hypothesis !== "object" || !REGISTERED_IDS.has(hypothesis.hypothesis_id)) refuse(`hypothesis ${index} is unregistered`);
    if (seen.has(hypothesis.hypothesis_id)) refuse(`duplicate hypothesis ${hypothesis.hypothesis_id}`);
    seen.add(hypothesis.hypothesis_id);
    if (!Number.isFinite(hypothesis.minimum_relevant_improvement) || hypothesis.minimum_relevant_improvement <= 0) refuse(`hypothesis ${index} has no positive minimum relevant improvement`);
    if (typeof hypothesis.effect_unit !== "string" || hypothesis.effect_unit.length < 1) refuse(`hypothesis ${index} lacks an effect unit`);
    if (hypothesis.variance_unit !== `${hypothesis.effect_unit}^2`) refuse(`hypothesis ${index} variance unit is not the squared effect unit`);
    if (!hypothesis.variance_by_family || typeof hypothesis.variance_by_family !== "object" || Array.isArray(hypothesis.variance_by_family)) refuse(`hypothesis ${index} lacks family variances`);
    const varianceFamilies = Object.keys(hypothesis.variance_by_family);
    if (varianceFamilies.length !== input.family_ids.length || input.family_ids.some((id) => !Object.hasOwn(hypothesis.variance_by_family, id))) refuse(`hypothesis ${index} variance families differ from the frozen panel`);
    for (const familyId of input.family_ids) {
      const variance = hypothesis.variance_by_family[familyId];
      if (!Number.isFinite(variance) || variance <= 0) refuse(`hypothesis ${index} has invalid variance for ${familyId}`);
    }
  }
  if (seen.size !== REGISTERED_IDS.size) refuse("registered power family is incomplete");
}

export function deriveFixture026RsdT02ProspectivePowerPlan(input) {
  assertInput(input);
  const familyN = input.family_ids.length;
  const planningAlpha = input.familywise_alpha / 4;
  if (1 / (input.bootstrap_resamples + 1) > planningAlpha) {
    refuse("bootstrap p-value resolution cannot reach the first Holm threshold");
  }
  const zAlpha = fixture026RsdT02InverseNormal(1 - planningAlpha);
  const zPower = fixture026RsdT02InverseNormal(input.target_power);
  const perFamilyRetentionFailure = (1 - input.retention_assurance) / familyN;
  const rows = input.hypotheses.map((hypothesis) => {
    const varianceCoefficient = input.family_ids.reduce(
      (sum, familyId) => sum + hypothesis.variance_by_family[familyId],
      0,
    ) / (familyN ** 2);
    const rawEffective = varianceCoefficient
      * ((zAlpha + zPower) / hypothesis.minimum_relevant_improvement) ** 2;
    const effectiveInstancesPerFamily = Math.max(2, Math.ceil(rawEffective));
    const plannedInstancesPerFamily = fixture026RsdT02PlannedCountForRetention({
      effectiveCount: effectiveInstancesPerFamily,
      attritionRate: input.pre_response_attrition_rate,
      perFamilyFailureProbability: perFamilyRetentionFailure,
    });
    const shortfallProbability = fixture026RsdT02BinomialLowerTail({
      trials: plannedInstancesPerFamily,
      success_probability: 1 - input.pre_response_attrition_rate,
      minimum_successes: effectiveInstancesPerFamily,
    });
    const standardError = Math.sqrt(varianceCoefficient / effectiveInstancesPerFamily);
    const approximatePower = normalCdf(
      hypothesis.minimum_relevant_improvement / standardError - zAlpha,
    );
    return Object.freeze({
      hypothesis_id: hypothesis.hypothesis_id,
      effect_unit: hypothesis.effect_unit,
      minimum_relevant_improvement: hypothesis.minimum_relevant_improvement,
      variance_unit: hypothesis.variance_unit,
      equal_family_variance_coefficient: varianceCoefficient,
      effective_instances_per_family: effectiveInstancesPerFamily,
      planned_instances_per_family: plannedInstancesPerFamily,
      planned_total_instances: plannedInstancesPerFamily * familyN,
      normal_approximation_power_diagnostic: approximatePower,
      bootstrap_power_calibrated: false,
      per_family_retention_shortfall_probability: shortfallProbability,
      experiment_retention_shortfall_upper_bound: shortfallProbability * familyN,
      within_registered_maximum: plannedInstancesPerFamily <= input.max_planned_instances_per_family,
    });
  });
  const plannedInstancesPerFamily = Math.max(...rows.map((row) => row.planned_instances_per_family));
  const calculationBlockers = [];
  if (plannedInstancesPerFamily > input.max_planned_instances_per_family) {
    calculationBlockers.push("derived-count-exceeds-registered-maximum-per-family");
  }
  const authorityBlockers = Object.freeze([
    "pilot-variance-bytes-role-and-review-not-verified-by-hash-only",
    "analysis-source-hash-not-yet-bound-by-a-frozen-release-contract",
    "effect-margins-target-power-bootstrap-key-and-failure-penalties-not-yet-frozen-together",
    "variance-only-normal-approximation-not-calibrated-to-data-dependent-bootstrap-degeneracy",
  ]);
  return Object.freeze({
    schema: 1,
    contract_version: FIXTURE_026_RSD_T02_POWER_PLAN_VERSION,
    authority: "deterministic-prospective-normal-approximation-only",
    independent_unit: "system-instance",
    estimand: "equal-weighted-mean-arm-contrast-over-the-frozen-finite-family-panel",
    family_ids: Object.freeze([...input.family_ids]),
    familywise_alpha: input.familywise_alpha,
    planning_alpha_per_hypothesis: planningAlpha,
    planning_alpha_rationale: "alpha/4 protects the first and most conservative Holm step",
    target_power: input.target_power,
    bootstrap_resamples: input.bootstrap_resamples,
    monte_carlo_plus_one_resolution_floor: 1 / (input.bootstrap_resamples + 1),
    monte_carlo_resolution_note: "This is only the plus-one floor. The analyzer's attainable p-value is additionally bounded by its observed zero-standard-error resamples.",
    bootstrap_power_alignment_status: "not-assessed-from-variance-only-input-requires-pilot-transcript-simulation",
    normal_quantiles: Object.freeze({ z_one_minus_alpha_over_4: zAlpha, z_target_power: zPower }),
    formula: "n_eff_per_family=max{2,ceil[(sum_f variance_f/F^2)*((z_(1-alpha/4)+z_power)/delta)^2]}",
    retention_formula: "n_plan=min{m:Pr[Binomial(m,1-r)<n_eff]<=(1-retention_assurance)/F}",
    allocation: "equal-planned-instance-count-per-fixed-family",
    pre_response_attrition_rate: input.pre_response_attrition_rate,
    retention_assurance: input.retention_assurance,
    per_family_retention_failure_budget: perFamilyRetentionFailure,
    attrition_rule: "minimal planned count whose exact binomial lower tail meets a Bonferroni experiment-level retention assurance; runtime failures remain in denominator with registered penalty",
    support_coverage_floor: input.support_coverage_floor,
    coverage_role: "separate mandatory gate; not used as an unregistered sample-size multiplier",
    pilot_variance_artifact_sha256: input.pilot_variance_artifact_sha256,
    pilot_variance_binding_status: "hash-syntax-only-bytes-role-and-review-unverified",
    analysis_implementation_sha256: input.analysis_implementation_sha256,
    analysis_implementation_binding_status: "caller-supplied-hash-not-release-bound",
    population_design_sha256: input.population_design_sha256,
    family_heterogeneity_model: input.family_mode,
    missingness_and_runtime_failure_rule: "inflate only registered pre-response attrition; retain runtime failures at registered endpoint penalties",
    hypotheses: Object.freeze(rows),
    planned_instances_per_family: plannedInstancesPerFamily,
    planned_instance_counts_by_family: Object.freeze(Object.fromEntries(
      input.family_ids.map((familyId) => [familyId, plannedInstancesPerFamily]),
    )),
    planned_total_instances: plannedInstancesPerFamily * familyN,
    calculation_blockers: Object.freeze(calculationBlockers),
    authority_blockers: authorityBlockers,
    calculation_internal_checks_pass: calculationBlockers.length === 0,
    prospective_power_plan_passes: false,
    plan_freeze_permitted: false,
    design_gate_satisfied: false,
    private_response_power_recalculation_permitted: false,
    comparison_inference_permitted: false,
    claim_eligible: false,
    result_label: "NO_RESULT",
  });
}
