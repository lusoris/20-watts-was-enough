import { createHash } from "node:crypto";

import {
  ENERGY_BLOCK_ACQUISITION_VERSION,
  ENERGY_BLOCK_SCHEDULE_VERSION,
  hashEnergyAcquisitionObservation,
} from "./energy-acquisition.mjs";
import {
  evaluateExternalEnergyReading,
  hashProvenanceReviewRecord,
} from "./energy-provider.mjs";
import { validateEnergyBlockExecutionBundle } from "./energy-block-runner.mjs";

export const ENERGY_BLOCK_ANALYSIS_PLAN_VERSION = "candidate-010.energy-block-analysis-plan.v1";
export const ENERGY_BLOCK_OUTCOME_SUMMARY_VERSION = "candidate-010.energy-block-outcome-summary.v1";
export const ENERGY_BLOCK_ANALYSIS_VERSION = "candidate-010.energy-block-analysis.v1";

const INTERVAL_METHOD = "paired-seed-student-t";
const AGGREGATION_METHOD = "ratio-of-sums-within-seed";
const IDLE_POLICY = "report-only-no-subtraction";
const UNCERTAINTY_POLICY = "sum-expanded-calibration-plus-half-resolution";

export class EnergyBlockAnalysisError extends Error {
  constructor(code, message, cause = undefined) {
    super(`${code}: ${message}`, cause === undefined ? undefined : { cause });
    this.name = "EnergyBlockAnalysisError";
    this.code = code;
  }
}

function refuse(code, message, cause = undefined) {
  throw new EnergyBlockAnalysisError(code, message, cause);
}

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

function digestBody(document, digestField) {
  const body = { ...document };
  delete body[digestField];
  return sha256(canonical(body));
}

function exactObject(value, fields, label, code = "INVALID_SHAPE") {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    refuse(code, `${label} must be an object`);
  }
  const actual = Object.keys(value).sort();
  const expected = [...fields].sort();
  if (canonical(actual) !== canonical(expected)) {
    refuse(code, `${label} must contain exactly: ${expected.join(", ")}`);
  }
  return value;
}

function nonEmpty(value, label, code = "INVALID_IDENTITY") {
  if (typeof value !== "string" || value.trim() !== value || value.length === 0) {
    refuse(code, `${label} must be a non-empty trimmed string`);
  }
  return value;
}

function finite(value, label, { minimum = Number.NEGATIVE_INFINITY, exclusive = false } = {}) {
  const meetsMinimum = exclusive ? value > minimum : value >= minimum;
  if (!Number.isFinite(value) || !meetsMinimum) refuse("INVALID_NUMBER", `${label} is outside its finite range`);
  return value;
}

function integer(value, label, { minimum = 0 } = {}) {
  if (!Number.isSafeInteger(value) || value < minimum) {
    refuse("INVALID_COUNT", `${label} must be a safe integer >= ${minimum}`);
  }
  return value;
}

function deepFreeze(value) {
  if (!value || typeof value !== "object" || Object.isFrozen(value)) return value;
  for (const child of Object.values(value)) deepFreeze(child);
  return Object.freeze(value);
}

function mean(values) {
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function sampleStandardDeviation(values) {
  const center = mean(values);
  return Math.sqrt(values.reduce((sum, value) => sum + (value - center) ** 2, 0) / (values.length - 1));
}

// Lanczos log-gamma and a continued fraction for the regularized incomplete
// beta give a deterministic Student-t quantile without a statistics runtime.
function logGamma(value) {
  const coefficients = [
    0.9999999999998099,
    676.5203681218851,
    -1259.1392167224028,
    771.3234287776531,
    -176.6150291621406,
    12.5073432786869,
    -0.13857109526572,
    9.984369578019572e-6,
    1.5056327351493116e-7,
  ];
  if (value < 0.5) return Math.log(Math.PI) - Math.log(Math.sin(Math.PI * value)) - logGamma(1 - value);
  const shifted = value - 1;
  let series = coefficients[0];
  for (let index = 1; index < coefficients.length; index += 1) series += coefficients[index] / (shifted + index);
  const t = shifted + 7.5;
  return 0.5 * Math.log(2 * Math.PI) + (shifted + 0.5) * Math.log(t) - t + Math.log(series);
}

function betaContinuedFraction(a, b, x) {
  const maxIterations = 200;
  const epsilon = 3e-14;
  const tiny = 1e-300;
  const qab = a + b;
  const qap = a + 1;
  const qam = a - 1;
  let c = 1;
  let d = 1 - (qab * x) / qap;
  if (Math.abs(d) < tiny) d = tiny;
  d = 1 / d;
  let result = d;
  for (let iteration = 1; iteration <= maxIterations; iteration += 1) {
    const doubled = 2 * iteration;
    let coefficient = (iteration * (b - iteration) * x) / ((qam + doubled) * (a + doubled));
    d = 1 + coefficient * d;
    if (Math.abs(d) < tiny) d = tiny;
    c = 1 + coefficient / c;
    if (Math.abs(c) < tiny) c = tiny;
    d = 1 / d;
    result *= d * c;
    coefficient = -((a + iteration) * (qab + iteration) * x) / ((a + doubled) * (qap + doubled));
    d = 1 + coefficient * d;
    if (Math.abs(d) < tiny) d = tiny;
    c = 1 + coefficient / c;
    if (Math.abs(c) < tiny) c = tiny;
    d = 1 / d;
    const delta = d * c;
    result *= delta;
    if (Math.abs(delta - 1) < epsilon) return result;
  }
  refuse("NUMERICAL_FAILURE", "incomplete-beta continued fraction did not converge");
}

function regularizedIncompleteBeta(x, a, b) {
  if (x === 0) return 0;
  if (x === 1) return 1;
  const front = Math.exp(
    logGamma(a + b) - logGamma(a) - logGamma(b) + a * Math.log(x) + b * Math.log1p(-x),
  );
  if (x < (a + 1) / (a + b + 2)) return (front * betaContinuedFraction(a, b, x)) / a;
  return 1 - (front * betaContinuedFraction(b, a, 1 - x)) / b;
}

function studentTCdf(value, degreesOfFreedom) {
  if (value === 0) return 0.5;
  const beta = regularizedIncompleteBeta(
    degreesOfFreedom / (degreesOfFreedom + value * value),
    degreesOfFreedom / 2,
    0.5,
  );
  return value > 0 ? 1 - beta / 2 : beta / 2;
}

function studentTQuantile(probability, degreesOfFreedom) {
  if (!(probability > 0.5 && probability < 1) || !Number.isSafeInteger(degreesOfFreedom) || degreesOfFreedom < 1) {
    refuse("NUMERICAL_FAILURE", "invalid Student-t quantile request");
  }
  let lower = 0;
  let upper = 1;
  while (studentTCdf(upper, degreesOfFreedom) < probability && upper < 1e8) upper *= 2;
  if (upper >= 1e8) refuse("NUMERICAL_FAILURE", "Student-t quantile is not finite");
  for (let iteration = 0; iteration < 100; iteration += 1) {
    const midpoint = (lower + upper) / 2;
    if (studentTCdf(midpoint, degreesOfFreedom) < probability) lower = midpoint;
    else upper = midpoint;
  }
  return (lower + upper) / 2;
}

export function createEnergyBlockAnalysisPlan({
  plan_id,
  candidate_arm,
  baseline_arm,
  minimum_independent_seeds,
  confidence_level = 0.95,
}) {
  nonEmpty(plan_id, "plan_id");
  nonEmpty(candidate_arm, "candidate_arm");
  nonEmpty(baseline_arm, "baseline_arm");
  if (candidate_arm === baseline_arm) refuse("INVALID_PLAN", "candidate and baseline arms must differ");
  integer(minimum_independent_seeds, "minimum_independent_seeds", { minimum: 3 });
  finite(confidence_level, "confidence_level", { minimum: 0.8, exclusive: true });
  if (confidence_level >= 1) refuse("INVALID_PLAN", "confidence_level must be below 1");
  const body = {
    schema: 1,
    contract_version: ENERGY_BLOCK_ANALYSIS_PLAN_VERSION,
    plan_id,
    candidate_arm,
    baseline_arm,
    minimum_independent_seeds,
    confidence_level,
    interval_method: INTERVAL_METHOD,
    independent_unit: "seed",
    aggregation_method: AGGREGATION_METHOD,
    idle_energy_policy: IDLE_POLICY,
    uncertainty_policy: UNCERTAINTY_POLICY,
    correct_commit_definition: "decision.commit=true and truth_unsafe=false",
    zero_correct_commit_policy: "refuse-seed-arm-denominator",
  };
  return deepFreeze({ ...body, plan_sha256: digestBody(body, "plan_sha256") });
}

function validatePlan(plan) {
  exactObject(plan, [
    "schema", "contract_version", "plan_id", "candidate_arm", "baseline_arm",
    "minimum_independent_seeds", "confidence_level", "interval_method", "independent_unit",
    "aggregation_method", "idle_energy_policy", "uncertainty_policy", "correct_commit_definition",
    "zero_correct_commit_policy", "plan_sha256",
  ], "analysis plan", "INVALID_PLAN");
  if (plan.schema !== 1 || plan.contract_version !== ENERGY_BLOCK_ANALYSIS_PLAN_VERSION) {
    refuse("INVALID_PLAN", "analysis plan version is invalid");
  }
  const rebuilt = createEnergyBlockAnalysisPlan(plan);
  if (canonical(rebuilt) !== canonical(plan)) refuse("INVALID_PLAN", "analysis plan fields or digest differ from the frozen contract");
  return plan;
}

export function createEnergyBlockOutcomeSummary({ schedule, block_id, correct_commits }) {
  validateSchedule(schedule);
  const block = schedule.blocks.find((row) => row.block_id === block_id);
  if (!block || block.phase !== "measure" || block.observed !== true) {
    refuse("INCONSISTENT_BLOCK", `outcome summary names a non-measurement block: ${block_id}`);
  }
  const assigned = block.opportunities * block.opportunity_repetitions;
  integer(assigned, "assigned_opportunities", { minimum: 1 });
  integer(correct_commits, "correct_commits");
  if (correct_commits > assigned) refuse("INVALID_COUNT", "correct_commits exceeds assigned opportunities");
  const body = {
    schema: 1,
    contract_version: ENERGY_BLOCK_OUTCOME_SUMMARY_VERSION,
    schedule_sha256: schedule.schedule_sha256,
    block_id: block.block_id,
    block_pair_id: block.block_pair_id,
    paired_input_sha256: block.paired_input_sha256,
    input_manifest_sha256: block.input_manifest_sha256,
    cluster_id: block.cluster_id,
    scenario_id: block.scenario_id,
    task_family: block.task_family,
    backend_id: block.backend_id,
    seed: block.seed,
    arm: block.arm,
    repetition: block.repetition,
    assigned_opportunities: assigned,
    correct_commits,
  };
  return deepFreeze({ ...body, summary_sha256: digestBody(body, "summary_sha256") });
}

function validateSchedule(schedule) {
  if (!schedule || typeof schedule !== "object" || Array.isArray(schedule)) {
    refuse("INVALID_SCHEDULE", "schedule must be an object");
  }
  if (
    schedule.schema !== 1
    || schedule.contract_version !== ENERGY_BLOCK_SCHEDULE_VERSION
    || !Array.isArray(schedule.blocks)
    || schedule.blocks.length === 0
    || schedule.schedule_sha256 !== digestBody(schedule, "schedule_sha256")
  ) refuse("INVALID_SCHEDULE", "schedule version, shape, or digest is invalid");
  if (!schedule.meter_capability || !Number.isFinite(schedule.meter_capability.energy_resolution_j)) {
    refuse("INVALID_SCHEDULE", "schedule has no meter capability contract");
  }
  const ids = new Set();
  for (const block of schedule.blocks) {
    if (!block?.block_id || ids.has(block.block_id)) refuse("INVALID_SCHEDULE", "schedule block identities are missing or duplicated");
    ids.add(block.block_id);
  }
  return schedule;
}

function mapProviderFailure(error, blockId) {
  if (String(error?.code).includes("CALIBRATION")) {
    refuse("INVALID_CALIBRATION_ELIGIBILITY", `block ${blockId} has invalid or expired calibration`, error);
  }
  if (String(error?.code).includes("CLOCK")) {
    refuse("INVALID_CLOCK_ELIGIBILITY", `block ${blockId} has invalid clock evidence`, error);
  }
  refuse("INVALID_METER_ELIGIBILITY", `block ${blockId} does not reproduce as valid meter evidence`, error);
}

function validateAcquisitionObservation(row, block, schedule, seen) {
  exactObject(
    row,
    ["block", "raw_source", "review_source", "raw_reading", "review", "observation"],
    `acquisition row ${block.block_id}`,
    "INCONSISTENT_BLOCK",
  );
  if (canonical(row.block) !== canonical(block)) {
    refuse("INCONSISTENT_BLOCK", `acquisition block differs from schedule: ${block.block_id}`);
  }
  let measured;
  try {
    measured = evaluateExternalEnergyReading(row.raw_reading).measured;
  } catch (error) {
    mapProviderFailure(error, block.block_id);
  }
  if (measured.record_kind !== "hardware-observation" || measured.status !== "measured-external") {
    refuse("INVALID_METER_ELIGIBILITY", `block ${block.block_id} is fixture, modeled, or non-hardware evidence`);
  }
  const ownership = {
    schedule_sha256: schedule.schedule_sha256,
    block_id: block.block_id,
    block_pair_id: block.block_pair_id,
    paired_input_sha256: block.paired_input_sha256,
    input_manifest_id: block.input_manifest_id,
    input_manifest_sha256: block.input_manifest_sha256,
    cluster_id: block.cluster_id,
    scenario_id: block.scenario_id,
    task_family: block.task_family,
    backend_id: block.backend_id,
    seed: block.seed,
    arm: block.arm,
    repetition: block.repetition,
    phase: block.phase,
  };
  const expectedObservation = {
    ...measured,
    allocation: "energy-measurement-block",
    block_ownership: ownership,
    claim_eligibility: "hardware-block-pending-aggregate-analysis-contract",
  };
  if (canonical(row.observation) !== canonical(expectedObservation)) {
    refuse("INCONSISTENT_BLOCK", `normalized meter observation does not reproduce from raw evidence: ${block.block_id}`);
  }
  const review = row.review;
  exactObject(
    review,
    ["schema", "review_id", "reviewer_id", "reviewed_at", "decision", "observation_sha256", "notes", "review_sha256"],
    `review ${block.block_id}`,
    "INVALID_REVIEW_ELIGIBILITY",
  );
  if (
    review.schema !== 1
    || typeof review.review_id !== "string"
    || review.review_id.length === 0
    || typeof review.reviewer_id !== "string"
    || review.reviewer_id.length === 0
    || typeof review.notes !== "string"
    || review.notes.length === 0
    || review.decision !== "approved"
    || review.observation_sha256 !== hashEnergyAcquisitionObservation(measured)
  ) {
    refuse("INVALID_REVIEW_ELIGIBILITY", `block ${block.block_id} lacks an approving review bound to its observation`);
  }
  if (review.review_sha256 !== hashProvenanceReviewRecord(review)) {
    refuse("INVALID_REVIEW_ELIGIBILITY", `block ${block.block_id} review digest is invalid`);
  }
  const reviewedAt = Date.parse(review.reviewed_at);
  if (!Number.isFinite(reviewedAt) || reviewedAt < Date.parse(measured.interval_ended_at)) {
    refuse("INVALID_REVIEW_ELIGIBILITY", `block ${block.block_id} review predates or cannot date its observation`);
  }
  if (seen.readings.has(measured.reading_id) || seen.reviews.has(review.review_id)) {
    refuse("INVALID_REVIEW_ELIGIBILITY", `block ${block.block_id} reuses a reading or review identity`);
  }
  seen.readings.add(measured.reading_id);
  seen.reviews.add(review.review_id);
  if (measured.clock_uncertainty_s > schedule.meter_capability.maximum_clock_uncertainty_s) {
    refuse("INVALID_CLOCK_ELIGIBILITY", `block ${block.block_id} exceeds the frozen clock-uncertainty ceiling`);
  }
  const start = Date.parse(measured.interval_started_at);
  const end = Date.parse(measured.interval_ended_at);
  const calibrated = Date.parse(measured.calibrated_at);
  const validUntil = Date.parse(measured.calibration_valid_until);
  if (![start, end, calibrated, validUntil].every(Number.isFinite) || calibrated > start || validUntil < end) {
    refuse("INVALID_CALIBRATION_ELIGIBILITY", `block ${block.block_id} calibration does not cover its interval`);
  }
  const meterKey = `${measured.provider_id}\0${measured.meter_id}`;
  const meterIntervals = seen.intervals.get(meterKey) ?? [];
  if (meterIntervals.some((interval) => start < interval.end && interval.start < end)) {
    refuse("INVALID_CLOCK_ELIGIBILITY", `block ${block.block_id} overlaps another interval assigned to its meter`);
  }
  meterIntervals.push({ block_id: block.block_id, sequence: block.sequence, start, end });
  seen.intervals.set(meterKey, meterIntervals);
  finite(measured.value_j, `block ${block.block_id} energy`, { minimum: 0 });
  finite(measured.calibration_expanded_uncertainty_j, `block ${block.block_id} expanded uncertainty`, { minimum: 0 });
  return expectedObservation;
}

function validateAcquisition(acquisition, schedule) {
  exactObject(acquisition, [
    "schema", "contract_version", "schedule_sha256", "run_id", "claim_eligible",
    "claim_eligibility", "analysis_contract_status", "observations", "acquisition_sha256",
  ], "acquisition", "INVALID_ACQUISITION");
  if (
    acquisition.schema !== 1
    || acquisition.contract_version !== ENERGY_BLOCK_ACQUISITION_VERSION
    || acquisition.schedule_sha256 !== schedule.schedule_sha256
    || acquisition.run_id !== schedule.run_id
    || acquisition.claim_eligible !== false
    || !Array.isArray(acquisition.observations)
    || acquisition.acquisition_sha256 !== digestBody(acquisition, "acquisition_sha256")
  ) refuse("INVALID_ACQUISITION", "acquisition version, ownership, eligibility, shape, or digest is invalid");
  const expected = schedule.blocks.filter((block) => block.observed === true);
  if (acquisition.observations.length !== expected.length) {
    refuse("INCOMPLETE_BLOCKS", `acquisition has ${acquisition.observations.length} of ${expected.length} required observed blocks`);
  }
  const byBlock = new Map();
  for (const row of acquisition.observations) {
    const id = row?.block?.block_id;
    if (!id || byBlock.has(id)) refuse("INCONSISTENT_BLOCK", `duplicate or unidentified acquisition block: ${id ?? "missing"}`);
    byBlock.set(id, row);
  }
  const seen = { readings: new Set(), reviews: new Set(), intervals: new Map() };
  const normalized = new Map();
  for (const block of expected) {
    const row = byBlock.get(block.block_id);
    if (!row) refuse("INCOMPLETE_BLOCKS", `missing acquired block ${block.block_id}`);
    normalized.set(block.block_id, validateAcquisitionObservation(row, block, schedule, seen));
  }
  if ([...byBlock.keys()].some((id) => !expected.some((block) => block.block_id === id))) {
    refuse("INCONSISTENT_BLOCK", "acquisition contains a block outside the frozen schedule");
  }
  for (const intervals of seen.intervals.values()) {
    const bySequence = [...intervals].sort((left, right) => left.sequence - right.sequence);
    const byTime = [...intervals].sort((left, right) => left.start - right.start || left.end - right.end);
    if (canonical(bySequence.map((row) => row.block_id)) !== canonical(byTime.map((row) => row.block_id))) {
      refuse("INVALID_CLOCK_ELIGIBILITY", "meter intervals do not follow the frozen block sequence");
    }
  }
  return normalized;
}

function validateOutcomeSummary(summary, block, schedule) {
  exactObject(summary, [
    "schema", "contract_version", "schedule_sha256", "block_id", "block_pair_id",
    "paired_input_sha256", "input_manifest_sha256", "cluster_id", "scenario_id", "task_family",
    "backend_id", "seed", "arm", "repetition", "assigned_opportunities", "correct_commits",
    "summary_sha256",
  ], `outcome summary ${block.block_id}`, "INCONSISTENT_BLOCK");
  if (
    summary.schema !== 1
    || summary.contract_version !== ENERGY_BLOCK_OUTCOME_SUMMARY_VERSION
    || summary.summary_sha256 !== digestBody(summary, "summary_sha256")
  ) refuse("INCONSISTENT_BLOCK", `outcome summary version or digest is invalid: ${block.block_id}`);
  const expected = createEnergyBlockOutcomeSummary({
    schedule,
    block_id: block.block_id,
    correct_commits: summary.correct_commits,
  });
  if (canonical(summary) !== canonical(expected)) {
    refuse("INCONSISTENT_BLOCK", `outcome summary differs from its scheduled block: ${block.block_id}`);
  }
  return summary;
}

export function createEnergyBlockOutcomeSummariesFromExecutionBundle({ schedule, execution_bundle }) {
  validateSchedule(schedule);
  try {
    validateEnergyBlockExecutionBundle({ schedule, bundle: execution_bundle });
  } catch (error) {
    refuse("INVALID_EXECUTION_BUNDLE", "energy-block execution bundle failed its native validator", error);
  }
  return deepFreeze(execution_bundle.blocks
    .filter((record) => record.block.phase === "measure")
    .map((record) => createEnergyBlockOutcomeSummary({
      schedule,
      block_id: record.block.block_id,
      correct_commits: record.summary.correct_commits,
    })));
}

function aggregateSeedArm({ blocks, normalized, outcomes, energyResolution }) {
  const energy = blocks.reduce((sum, block) => sum + normalized.get(block.block_id).value_j, 0);
  const expandedCalibrationUncertainty = blocks.reduce(
    (sum, block) => sum + normalized.get(block.block_id).calibration_expanded_uncertainty_j,
    0,
  );
  const resolutionAllowance = blocks.length * energyResolution / 2;
  const correctCommits = blocks.reduce((sum, block) => sum + outcomes.get(block.block_id).correct_commits, 0);
  if (correctCommits === 0) {
    refuse("ZERO_CORRECT_COMMITS", `seed ${blocks[0].seed}, arm ${blocks[0].arm} has zero correct commits after within-seed aggregation`);
  }
  const uncertainty = expandedCalibrationUncertainty + resolutionAllowance;
  return {
    arm: blocks[0].arm,
    gross_energy_j: energy,
    correct_commits: correctCommits,
    joules_per_correct_commit: energy / correctCommits,
    expanded_uncertainty_j_per_correct_commit: uncertainty / correctCommits,
    expanded_calibration_uncertainty_j: expandedCalibrationUncertainty,
    meter_resolution_allowance_j: resolutionAllowance,
    measurement_block_count: blocks.length,
    scenario_count: new Set(blocks.map((block) => block.scenario_id)).size,
  };
}

export function analyzeEnergyBlocks({
  schedule,
  acquisition,
  block_outcomes = null,
  execution_bundle = null,
  analysis_plan,
}) {
  validatePlan(analysis_plan);
  validateSchedule(schedule);
  const arms = new Set(schedule.blocks.filter((block) => block.phase === "measure").map((block) => block.arm));
  if (!arms.has(analysis_plan.candidate_arm) || !arms.has(analysis_plan.baseline_arm)) {
    refuse("INVALID_PLAN", "candidate or baseline arm is absent from the schedule");
  }
  const normalized = validateAcquisition(acquisition, schedule);
  if ((block_outcomes === null) === (execution_bundle === null)) {
    refuse("INVALID_OUTCOME_SOURCE", "supply exactly one of block_outcomes or execution_bundle");
  }
  const resolvedOutcomes = execution_bundle === null
    ? block_outcomes
    : createEnergyBlockOutcomeSummariesFromExecutionBundle({ schedule, execution_bundle });
  if (!Array.isArray(resolvedOutcomes)) refuse("INCOMPLETE_BLOCKS", "block_outcomes must be an array");
  const relevantBlocks = schedule.blocks.filter((block) => (
    block.phase === "measure"
    && [analysis_plan.candidate_arm, analysis_plan.baseline_arm].includes(block.arm)
  ));
  if (resolvedOutcomes.length !== relevantBlocks.length) {
    refuse("INCOMPLETE_BLOCKS", `received ${resolvedOutcomes.length} of ${relevantBlocks.length} required arm outcome summaries`);
  }
  const outcomes = new Map();
  for (const summary of resolvedOutcomes) {
    if (!summary?.block_id || outcomes.has(summary.block_id)) {
      refuse("INCONSISTENT_BLOCK", `duplicate or unidentified outcome block: ${summary?.block_id ?? "missing"}`);
    }
    outcomes.set(summary.block_id, summary);
  }
  for (const block of relevantBlocks) {
    const summary = outcomes.get(block.block_id);
    if (!summary) refuse("INCOMPLETE_BLOCKS", `missing outcome summary for ${block.block_id}`);
    validateOutcomeSummary(summary, block, schedule);
  }
  if ([...outcomes.keys()].some((id) => !relevantBlocks.some((block) => block.block_id === id))) {
    refuse("INCONSISTENT_BLOCK", "outcomes contain a block outside the candidate/baseline comparison");
  }
  const seeds = [...new Set(relevantBlocks.map((block) => block.seed))].sort((left, right) => left - right);
  if (seeds.length < analysis_plan.minimum_independent_seeds) {
    refuse(
      "INSUFFICIENT_INDEPENDENT_SEEDS",
      `${seeds.length} independent seeds cannot satisfy the frozen minimum ${analysis_plan.minimum_independent_seeds}`,
    );
  }
  const seedEstimates = seeds.map((seed) => {
    const byArm = Object.fromEntries([analysis_plan.candidate_arm, analysis_plan.baseline_arm].map((arm) => {
      const blocks = relevantBlocks.filter((block) => block.seed === seed && block.arm === arm);
      if (blocks.length === 0) refuse("INCOMPLETE_BLOCKS", `seed ${seed} has no ${arm} blocks`);
      return [arm, aggregateSeedArm({
        blocks,
        normalized,
        outcomes,
        energyResolution: schedule.meter_capability.energy_resolution_j,
      })];
    }));
    const candidate = byArm[analysis_plan.candidate_arm];
    const baseline = byArm[analysis_plan.baseline_arm];
    return {
      seed,
      candidate,
      baseline,
      paired_difference_j_per_correct_commit:
        candidate.joules_per_correct_commit - baseline.joules_per_correct_commit,
      paired_ratio: candidate.joules_per_correct_commit / baseline.joules_per_correct_commit,
      measurement_uncertainty_margin_j_per_correct_commit:
        candidate.expanded_uncertainty_j_per_correct_commit
        + baseline.expanded_uncertainty_j_per_correct_commit,
    };
  });
  const differences = seedEstimates.map((row) => row.paired_difference_j_per_correct_commit);
  const ratios = seedEstimates.map((row) => row.paired_ratio);
  const n = seeds.length;
  const degreesOfFreedom = n - 1;
  const critical = studentTQuantile((1 + analysis_plan.confidence_level) / 2, degreesOfFreedom);
  const differenceMean = mean(differences);
  const differenceSd = sampleStandardDeviation(differences);
  const differenceSe = differenceSd / Math.sqrt(n);
  const statisticalHalfWidth = critical * differenceSe;
  const measurementMargin = mean(seedEstimates.map((row) => row.measurement_uncertainty_margin_j_per_correct_commit));
  const ratioMean = mean(ratios);
  const ratioSd = sampleStandardDeviation(ratios);
  const ratioHalfWidth = critical * ratioSd / Math.sqrt(n);
  const body = {
    schema: 1,
    contract_version: ENERGY_BLOCK_ANALYSIS_VERSION,
    plan_sha256: analysis_plan.plan_sha256,
    schedule_sha256: schedule.schedule_sha256,
    acquisition_sha256: acquisition.acquisition_sha256,
    endpoint: "gross_joules_per_correct_commit",
    inferential_unit: "seed",
    descriptive_units: {
      independent_seed_count: n,
      scenario_count: new Set(relevantBlocks.map((block) => block.scenario_id)).size,
      measurement_block_count: relevantBlocks.length,
      block_pair_count: new Set(relevantBlocks.map((block) => block.block_pair_id)).size,
      block_and_scenario_units_counted_as_independent_n: 0,
    },
    comparison: {
      candidate_arm: analysis_plan.candidate_arm,
      baseline_arm: analysis_plan.baseline_arm,
      direction: "candidate-minus-baseline; lower is better",
    },
    seed_estimates: seedEstimates,
    aggregate: {
      paired_mean_difference_j_per_correct_commit: differenceMean,
      paired_seed_standard_deviation_j_per_correct_commit: differenceSd,
      paired_seed_standard_error_j_per_correct_commit: differenceSe,
      degrees_of_freedom: degreesOfFreedom,
      confidence_level: analysis_plan.confidence_level,
      student_t_critical: critical,
      statistical_confidence_interval_j_per_correct_commit: {
        lower: differenceMean - statisticalHalfWidth,
        upper: differenceMean + statisticalHalfWidth,
      },
      mean_measurement_uncertainty_margin_j_per_correct_commit: measurementMargin,
      conservative_interval_j_per_correct_commit: {
        lower: differenceMean - statisticalHalfWidth - measurementMargin,
        upper: differenceMean + statisticalHalfWidth + measurementMargin,
      },
      mean_paired_ratio: ratioMean,
      paired_ratio_confidence_interval: {
        lower: ratioMean - ratioHalfWidth,
        upper: ratioMean + ratioHalfWidth,
      },
    },
    uncertainty: {
      statistical: "two-sided Student-t interval over paired seed-level estimands",
      measurement: UNCERTAINTY_POLICY,
      calibration_correlation_assumption: "expanded calibration uncertainty is summed within seed-arm (worst-case positive correlation)",
      clock_treatment: "clock uncertainty is an eligibility ceiling; it is not converted to joules without a frozen boundary-power model",
      idle_treatment: IDLE_POLICY,
    },
    assumptions: [
      "Seed packs are independently randomized; this contract cannot prove physical independence.",
      "All repeated blocks and all scenarios are aggregated inside each seed before inference.",
      "Gross meter-boundary energy is used; idle observations are descriptive and are never subtracted automatically.",
      "Correct-commit summaries must ultimately be emitted by the frozen block executor and bound by release authority.",
      "The Student-t interval treats paired seed estimands as independent and approximately exchangeable.",
    ],
    outcome_source: execution_bundle === null
      ? "block-outcome-summary-contract"
      : "validated-fixture-energy-block-execution-bundle",
    claim_eligible: false,
    claim_eligibility: "structural-analysis-only; requires existing release authority, gatekeeping, and promotion evidence",
  };
  return deepFreeze({ ...body, analysis_sha256: digestBody(body, "analysis_sha256") });
}
