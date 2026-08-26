import {
  canonicalize,
  sha256Hex,
} from "../lib/checkpoint-ledger.mjs";
import {
  FIXTURE_026_RSD_T02_ACTIONABLE_ARM_IDS,
  FIXTURE_026_RSD_T02_EVALUATOR_ONLY_ARM_ID,
  FIXTURE_026_RSD_T02_MODEL_CONSTANTS,
  FIXTURE_026_RSD_T02_PAIR_CERTIFICATES,
  FIXTURE_026_RSD_T02_PROPERTY_KEYS,
  FIXTURE_026_RSD_T02_RECIPES,
  FIXTURE_026_RSD_T02_THRESHOLDS,
  classifyFixture026RsdT02Pair,
} from "./rsd-t02-contract.mjs";
import {
  assertFixture026RsdT02Transcript,
} from "./rsd-t02-generator.mjs";
import {
  fixture026RsdT02CanonicalStep,
  simulateFixture026RsdT02CertificateEpisode,
} from "./rsd-t02-models.mjs";

export const FIXTURE_026_RSD_T02_EVALUATOR_VERSION = "fixture-026.rsd-t02-evaluator.v1";

const EVALUATION_KEYS = Object.freeze([
  "schema", "contract_version", "artifact", "track", "evaluator_id", "evaluator_role",
  "transcript_sha256", "response_commitment_sha256", "evaluator_opened_after_response",
  "recipe_id", "equation_id", "property_vector", "full_panel_equivalence_class",
  "sample_count", "schedule_semantics_valid", "maximum_input_schedule_residual_u",
  "initialization_residual", "canonical_step_residual", "reported_output_min", "reported_output_max",
  "support_membership", "authority", "result_label", "no_result",
]);
const SUPPORT_KEYS = Object.freeze([
  "input_domain", "transformation", "instrument", "initialization",
  "causal_observation", "evaluation_window",
]);

function exactKeys(value, keys) {
  return value
    && typeof value === "object"
    && !Array.isArray(value)
    && Object.keys(value).length === keys.length
    && keys.every((key) => Object.hasOwn(value, key));
}

function independentPropertyVector(equationId) {
  switch (equationId) {
    case "t02-iffl-affine-reference":
    case "t02-static-affine-highpass":
      return {
        drive_transform: "affine-fold",
        reported_output_feedback_edge: false,
        channel_local_state: false,
        causal_memory: true,
      };
    case "t02-nonlinear-output-feedback":
      return {
        drive_transform: "affine-fold",
        reported_output_feedback_edge: true,
        channel_local_state: false,
        causal_memory: true,
      };
    case "t02-channel-local-reference":
      return {
        drive_transform: "affine-fold",
        reported_output_feedback_edge: false,
        channel_local_state: true,
        causal_memory: true,
      };
    case "t02-log-difference-highpass":
      return {
        drive_transform: "log-fold",
        reported_output_feedback_edge: false,
        channel_local_state: false,
        causal_memory: true,
      };
    default: throw new RangeError(`Unknown Fixture 026 RSD-T02 evaluator equation: ${equationId}`);
  }
}

function independentEquationId(recipeId) {
  switch (recipeId) {
    case "M-I1-FFL": return "t02-iffl-affine-reference";
    case "M-NONLINEAR-FEEDBACK": return "t02-nonlinear-output-feedback";
    case "M-RECEPTOR-MEMORY": return "t02-channel-local-reference";
    case "M-STATIC-HIGHPASS": return "t02-static-affine-highpass";
    case "M-LOG-HIGHPASS": return "t02-log-difference-highpass";
    default: return null;
  }
}

function independentEquivalenceClass(equationId) {
  switch (equationId) {
    case "t02-iffl-affine-reference":
    case "t02-static-affine-highpass": return "E-AFFINE-INPUT-MEMORY";
    case "t02-nonlinear-output-feedback": return "E-OUTPUT-FEEDBACK";
    case "t02-channel-local-reference": return "E-CHANNEL-LOCAL-MEMORY";
    case "t02-log-difference-highpass": return "E-LOG-INPUT-MEMORY";
    default: throw new RangeError(`Unknown Fixture 026 RSD-T02 evaluator equation: ${equationId}`);
  }
}

function expectedInputAndMask(transcript, timeS) {
  const schedule = transcript.schedule;
  let normalized = { A: 1, B: 1 };
  let activeChannel = "A";
  let clamped = false;
  let reset = false;
  let frozen = false;
  if (schedule.kind === "step") normalized = { A: schedule.to_fold, B: schedule.to_fold };
  else if (schedule.kind === "periodic-square-pulse") {
    const inside = timeS >= schedule.start_time_s && timeS < schedule.stop_time_s;
    const phase = inside ? (timeS - schedule.start_time_s) % schedule.period_s : 0;
    const fold = inside && phase < schedule.pulse_width_s ? schedule.high_fold : schedule.low_fold;
    normalized = { A: fold, B: fold };
  } else if (schedule.kind === "ramp-then-hold") {
    const phase = Math.max(0, Math.min(1, (timeS - schedule.start_time_s) / schedule.duration_s));
    const fold = schedule.interpolation === "linear-in-fold"
      ? schedule.from_fold + phase * (schedule.to_fold - schedule.from_fold)
      : Math.exp(
        Math.log(schedule.from_fold)
        + phase * (Math.log(schedule.to_fold) - Math.log(schedule.from_fold)),
      );
    normalized = { A: fold, B: fold };
  } else if (schedule.kind.startsWith("step-with-")) {
    normalized = { A: schedule.to_fold, B: schedule.to_fold };
    reset = schedule.kind === "step-with-state-reset" && timeS === schedule.intervention_time_s;
    frozen = schedule.kind === "step-with-state-freeze"
      && timeS >= schedule.intervention_start_s && timeS < schedule.intervention_end_s;
    clamped = schedule.kind === "step-with-output-clamp"
      && timeS >= schedule.intervention_start_s && timeS < schedule.intervention_end_s;
  } else if (schedule.kind === "paused-linear-ramp") {
    const beforeHoldS = schedule.hold_after_active_ramp_s;
    const afterHoldStartS = beforeHoldS + schedule.hold_duration_s;
    const elapsed = timeS <= beforeHoldS
      ? timeS
      : timeS < afterHoldStartS ? beforeHoldS : timeS - schedule.hold_duration_s;
    const phase = Math.max(0, Math.min(1, elapsed / schedule.active_ramp_duration_s));
    const fold = schedule.from_fold + phase * (schedule.to_fold - schedule.from_fold);
    normalized = { A: fold, B: fold };
  } else if (schedule.kind === "two-pulse-channel-restimulation") {
    normalized = { A: schedule.low_fold, B: schedule.low_fold };
    if (timeS >= schedule.first_pulse_start_s && timeS < schedule.first_pulse_end_s) {
      normalized[schedule.first_channel] = schedule.high_fold;
    }
    if (timeS >= schedule.second_pulse_start_s && timeS < schedule.second_pulse_end_s) {
      normalized[schedule.second_channel] = schedule.high_fold;
    }
    activeChannel = timeS < schedule.second_pulse_start_s
      ? schedule.first_channel
      : schedule.second_channel;
  } else throw new RangeError(`Unsupported evaluator schedule: ${schedule.kind}`);
  return {
    input_a_u: transcript.background_u * normalized.A,
    input_b_u: transcript.background_u * normalized.B,
    active_channel: activeChannel,
    output_clamped: clamped,
    state_reset_applied: reset,
    state_freeze_active: frozen,
  };
}

export function evaluateFixture026RsdT02Transcript(transcript, responseCommitment) {
  assertFixture026RsdT02Transcript(transcript);
  if (
    !responseCommitment
    || typeof responseCommitment !== "object"
    || Array.isArray(responseCommitment)
    || !exactKeys(responseCommitment, ["response", "response_sha256"])
    || !/^[0-9a-f]{64}$/u.test(responseCommitment.response_sha256)
    || responseCommitment.response_sha256 !== sha256Hex(canonicalize(responseCommitment.response))
    || !exactKeys(responseCommitment.response, [
      "schema", "artifact", "track", "execution_id", "actionable_arm_responses",
      "evaluator_oracle_access", "response_role", "result_label", "no_result",
    ])
    || responseCommitment.response.schema !== 1
    || responseCommitment.response.artifact !== "fixture-026"
    || responseCommitment.response.track !== "RSD-T02"
    || responseCommitment.response.execution_id !== transcript.execution_id
    || !Array.isArray(responseCommitment.response.actionable_arm_responses)
    || responseCommitment.response.actionable_arm_responses.length
      !== FIXTURE_026_RSD_T02_ACTIONABLE_ARM_IDS.length
    || responseCommitment.response.actionable_arm_responses.some((arm, index) => (
      !exactKeys(arm, ["arm_id", "projection_sha256", "action", "reason"])
      || arm.arm_id !== FIXTURE_026_RSD_T02_ACTIONABLE_ARM_IDS[index]
      || arm.projection_sha256 !== transcript.projection_sha256
      || arm.action !== "abstain"
      || arm.reason !== "actionable-arm-not-implemented-or-eligible"
    ))
    || responseCommitment.response.evaluator_oracle_access !== false
    || responseCommitment.response.response_role !== "system-abstention-before-evaluator-open"
    || responseCommitment.response.result_label !== "NO_RESULT"
    || responseCommitment.response.no_result !== true
  ) throw new Error("Fixture 026 RSD-T02 evaluator requires a frozen response commitment.");
  let maximumInputResidual = 0;
  let scheduleSemanticsValid = true;
  for (const sample of transcript.samples) {
    const expected = expectedInputAndMask(transcript, sample.time_s);
    maximumInputResidual = Math.max(
      maximumInputResidual,
      Math.abs(sample.input_a_u - expected.input_a_u),
      Math.abs(sample.input_b_u - expected.input_b_u),
    );
    if (
      sample.active_channel !== expected.active_channel
      || sample.output_clamped !== expected.output_clamped
      || sample.state_reset_applied !== expected.state_reset_applied
      || sample.state_freeze_active !== expected.state_freeze_active
    ) scheduleSemanticsValid = false;
  }
  scheduleSemanticsValid = scheduleSemanticsValid && maximumInputResidual <= 1e-14;
  const outputs = transcript.samples.map(({ reported_output: output }) => output);
  const canonicalStepResidual = transcript.intervention_family === "canonical-step"
    ? Math.max(...transcript.samples.map((sample) => Math.abs(
      sample.reported_output
      - fixture026RsdT02CanonicalStep(sample.time_s, transcript.time_constant_s),
    )))
    : null;
  const propertyVector = independentPropertyVector(transcript.equation_id);
  const firstSample = transcript.samples[0];
  const firstActiveInputU = firstSample.active_channel === "A"
    ? firstSample.input_a_u
    : firstSample.input_b_u;
  const initialFold = firstActiveInputU / transcript.background_u;
  const initializationResidual = Math.abs(firstSample.internal_output - (initialFold - 1));
  const transcriptSha256 = sha256Hex(canonicalize(transcript));
  return Object.freeze({
    schema: 1,
    contract_version: FIXTURE_026_RSD_T02_EVALUATOR_VERSION,
    artifact: "fixture-026",
    track: "RSD-T02",
    evaluator_id: FIXTURE_026_RSD_T02_EVALUATOR_ONLY_ARM_ID,
    evaluator_role: "evaluator-only",
    transcript_sha256: transcriptSha256,
    response_commitment_sha256: responseCommitment.response_sha256,
    evaluator_opened_after_response: true,
    recipe_id: transcript.recipe_id,
    equation_id: transcript.equation_id,
    property_vector: Object.freeze(propertyVector),
    full_panel_equivalence_class: independentEquivalenceClass(transcript.equation_id),
    sample_count: transcript.samples.length,
    schedule_semantics_valid: scheduleSemanticsValid,
    maximum_input_schedule_residual_u: maximumInputResidual,
    initialization_residual: initializationResidual,
    canonical_step_residual: canonicalStepResidual,
    reported_output_min: Math.min(...outputs),
    reported_output_max: Math.max(...outputs),
    support_membership: Object.freeze(Object.fromEntries(SUPPORT_KEYS.map((key) => [key, "inside"]))),
    authority: "construction-validation-only",
    result_label: "NO_RESULT",
    no_result: true,
  });
}

export function assertFixture026RsdT02Evaluation(evaluation) {
  const expectedEquationId = independentEquationId(evaluation?.recipe_id);
  const expectedPropertyVector = expectedEquationId === null
    ? null
    : independentPropertyVector(expectedEquationId);
  const expectedEquivalenceClass = expectedEquationId === null
    ? null
    : independentEquivalenceClass(expectedEquationId);
  if (
    !exactKeys(evaluation, EVALUATION_KEYS)
    || evaluation.schema !== 1
    || evaluation.contract_version !== FIXTURE_026_RSD_T02_EVALUATOR_VERSION
    || evaluation.artifact !== "fixture-026"
    || evaluation.track !== "RSD-T02"
    || evaluation.evaluator_id !== FIXTURE_026_RSD_T02_EVALUATOR_ONLY_ARM_ID
    || evaluation.evaluator_role !== "evaluator-only"
    || !/^[0-9a-f]{64}$/u.test(evaluation.transcript_sha256)
    || !/^[0-9a-f]{64}$/u.test(evaluation.response_commitment_sha256)
    || evaluation.evaluator_opened_after_response !== true
    || expectedEquationId === null
    || evaluation.equation_id !== expectedEquationId
    || !exactKeys(evaluation.property_vector, FIXTURE_026_RSD_T02_PROPERTY_KEYS)
    || FIXTURE_026_RSD_T02_PROPERTY_KEYS.some(
      (key) => evaluation.property_vector[key] !== expectedPropertyVector[key],
    )
    || evaluation.full_panel_equivalence_class !== expectedEquivalenceClass
    || evaluation.sample_count !== FIXTURE_026_RSD_T02_MODEL_CONSTANTS.samples_per_episode
    || evaluation.schedule_semantics_valid !== true
    || !Number.isFinite(evaluation.maximum_input_schedule_residual_u)
    || evaluation.maximum_input_schedule_residual_u < 0
    || evaluation.maximum_input_schedule_residual_u > 1e-14
    || !Number.isFinite(evaluation.initialization_residual)
    || evaluation.initialization_residual < 0
    || evaluation.initialization_residual
      > FIXTURE_026_RSD_T02_THRESHOLDS.initialization_residual_ceiling
    || (evaluation.canonical_step_residual !== null && (
      !Number.isFinite(evaluation.canonical_step_residual)
      || evaluation.canonical_step_residual < 0
      || evaluation.canonical_step_residual
        > FIXTURE_026_RSD_T02_THRESHOLDS.matched_step_supremum_ceiling
    ))
    || !Number.isFinite(evaluation.reported_output_min)
    || !Number.isFinite(evaluation.reported_output_max)
    || evaluation.reported_output_min > evaluation.reported_output_max
    || !exactKeys(evaluation.support_membership, SUPPORT_KEYS)
    || Object.values(evaluation.support_membership).some((value) => value !== "inside")
    || evaluation.authority !== "construction-validation-only"
    || evaluation.result_label !== "NO_RESULT"
    || evaluation.no_result !== true
  ) throw new Error("Fixture 026 RSD-T02 evaluation violates its closed contract.");
  return evaluation;
}

export function evaluateFixture026RsdT02Pair(leftTranscript, rightTranscript) {
  assertFixture026RsdT02Transcript(leftTranscript);
  assertFixture026RsdT02Transcript(rightTranscript);
  if (
    leftTranscript.execution_id !== rightTranscript.execution_id
    || leftTranscript.seed !== rightTranscript.seed
    || leftTranscript.initialization_id !== rightTranscript.initialization_id
    || leftTranscript.samples.length !== rightTranscript.samples.length
  ) throw new Error("Fixture 026 RSD-T02 pair evaluator received unmatched transcripts.");
  const pairIds = new Set([leftTranscript.recipe_id, rightTranscript.recipe_id]);
  if (pairIds.size !== 2) throw new Error("Fixture 026 RSD-T02 pair evaluator requires two distinct recipes.");
  const certificate = FIXTURE_026_RSD_T02_PAIR_CERTIFICATES.find((row) => (
    pairIds.has(row.left_recipe_id) && pairIds.has(row.right_recipe_id)
  ));
  if (!certificate) throw new Error("Fixture 026 RSD-T02 pair evaluator found no registered certificate.");
  const analyticEquivalence = certificate.full_panel_status === "equivalent";
  if (!analyticEquivalence && (
    leftTranscript.episode_id !== certificate.separating_episode_id
    || leftTranscript.execution_id !== `O1-${certificate.separating_episode_id}`
    || leftTranscript.background_u !== 2
    || leftTranscript.time_constant_s !== 1
  )) throw new Error("Fixture 026 RSD-T02 numerical pair evaluator requires its frozen separator and scope.");
  const distanceInfinity = Math.max(...leftTranscript.samples.map((sample, index) => {
    const rival = rightTranscript.samples[index];
    if (sample.time_s !== rival.time_s) throw new Error("Fixture 026 RSD-T02 pair grids differ.");
    return Math.abs(sample.reported_output - rival.reported_output);
  }));
  let refinementError = 0;
  if (!analyticEquivalence) {
    const refinedLeft = simulateFixture026RsdT02CertificateEpisode({
      recipe_id: leftTranscript.recipe_id,
      episode_id: leftTranscript.episode_id,
      internal_step_s: 1 / 2048,
    });
    const refinedRight = simulateFixture026RsdT02CertificateEpisode({
      recipe_id: rightTranscript.recipe_id,
      episode_id: rightTranscript.episode_id,
      internal_step_s: 1 / 2048,
    });
    const refinedDistance = Math.max(...refinedLeft.samples.map((sample, index) => (
      Math.abs(sample.output - refinedRight.samples[index].output)
    )));
    refinementError = Math.abs(refinedDistance - distanceInfinity);
  }
  const status = classifyFixture026RsdT02Pair({
    distance_infinity: distanceInfinity,
    numerical_refinement_error: refinementError,
    analytic_equivalence: analyticEquivalence,
  });
  if (
    status !== certificate.full_panel_status
    || (!analyticEquivalence && (
      distanceInfinity - refinementError < certificate.construction_distance_lower_bound
      || refinementError > certificate.construction_refinement_error_ceiling
    ))
  ) throw new Error("Fixture 026 RSD-T02 pair evidence fails its certificate-specific bound.");
  return Object.freeze({
    pair_id: certificate.pair_id,
    certificate_status: certificate.certificate_status,
    episode_id: leftTranscript.episode_id,
    distance_infinity: distanceInfinity,
    numerical_refinement_error: refinementError,
    certified_lower_bound: analyticEquivalence
      ? 0
      : Math.max(0, distanceInfinity - refinementError),
    status,
    unit: "1",
  });
}

export function evaluateFixture026RsdT02MatchedStepPair(leftTranscript, rightTranscript) {
  assertFixture026RsdT02Transcript(leftTranscript);
  assertFixture026RsdT02Transcript(rightTranscript);
  if (
    leftTranscript.recipe_id === rightTranscript.recipe_id
    || leftTranscript.execution_id !== rightTranscript.execution_id
    || leftTranscript.seed !== rightTranscript.seed
    || leftTranscript.initialization_id !== rightTranscript.initialization_id
    || leftTranscript.intervention_family !== "canonical-step"
    || rightTranscript.intervention_family !== "canonical-step"
    || leftTranscript.regime_membership.length !== 1
    || leftTranscript.regime_membership[0] !== "O0-MATCHED-STEP"
    || rightTranscript.regime_membership.length !== 1
    || rightTranscript.regime_membership[0] !== "O0-MATCHED-STEP"
  ) throw new Error("Fixture 026 RSD-T02 matched-step evaluator requires one conditioned O0 pair.");
  const distanceInfinity = Math.max(...leftTranscript.samples.map((sample, index) => {
    const rival = rightTranscript.samples[index];
    if (sample.time_s !== rival.time_s) throw new Error("Fixture 026 RSD-T02 matched-step grids differ.");
    return Math.abs(sample.reported_output - rival.reported_output);
  }));
  if (distanceInfinity > FIXTURE_026_RSD_T02_THRESHOLDS.matched_step_supremum_ceiling) {
    throw new Error("Fixture 026 RSD-T02 matched-step pair exceeds its equivalence ceiling.");
  }
  return Object.freeze({
    left_recipe_id: leftTranscript.recipe_id,
    right_recipe_id: rightTranscript.recipe_id,
    execution_id: leftTranscript.execution_id,
    distance_infinity: distanceInfinity,
    matched_step_status: "equivalent",
    unit: "1",
  });
}

export function aggregateFixture026RsdT02System({
  expected_cells: expectedCells,
  records,
  observation_regime_id: observationRegimeId,
  true_recipe_id: trueRecipeId,
}) {
  if (!Array.isArray(expectedCells) || !Array.isArray(records) || expectedCells.length < 1) {
    throw new TypeError("Fixture 026 RSD-T02 aggregation requires expected cells and records.");
  }
  const trueRecipe = FIXTURE_026_RSD_T02_RECIPES.find(({ recipe_id: id }) => id === trueRecipeId);
  if (!trueRecipe || !new Set(["O0-MATCHED-STEP", "O1-FULL-PANEL"]).has(observationRegimeId)) {
    throw new Error("Fixture 026 RSD-T02 aggregation regime or evaluator truth is invalid.");
  }
  const reasons = new Set();
  const expectedKeys = expectedCells.map(({ work_key: workKey }) => workKey);
  if (new Set(expectedKeys).size !== expectedKeys.length) {
    throw new Error("Fixture 026 RSD-T02 expected cells contain a duplicate key.");
  }
  for (const expected of expectedCells) {
    if (!exactKeys(expected, ["work_key", "initialization_id"])) {
      throw new Error("Fixture 026 RSD-T02 expected cell is not closed.");
    }
    const matches = records.filter(({ work_key: workKey }) => workKey === expected.work_key);
    if (matches.length === 0) reasons.add("missing-cell");
    if (matches.length > 1) reasons.add("duplicate-cell");
    if (matches.some(({ gate_decision: gate }) => gate !== "accepted")) reasons.add("rejected-cell");
    if (matches.some(({ initialization_id: id }) => id !== expected.initialization_id)) {
      reasons.add("mixed-initialization");
    }
  }
  if (records.some(({ work_key: workKey }) => !expectedCells.some((cell) => cell.work_key === workKey))) {
    reasons.add("unexpected-cell");
  }
  const reasonCodes = [...reasons].sort();
  const candidateRecipes = observationRegimeId === "O0-MATCHED-STEP"
    ? FIXTURE_026_RSD_T02_RECIPES
    : FIXTURE_026_RSD_T02_RECIPES.filter((recipe) => (
      recipe.full_panel_equivalence_class === trueRecipe.full_panel_equivalence_class
    ));
  const compatiblePropertyValues = Object.fromEntries(FIXTURE_026_RSD_T02_PROPERTY_KEYS.map(
    (property) => [property, [...new Set(candidateRecipes.map(
      ({ property_vector: propertyVector }) => propertyVector[property],
    ))].sort((left, right) => String(left).localeCompare(String(right)))],
  ));
  const identifiable = Object.fromEntries(FIXTURE_026_RSD_T02_PROPERTY_KEYS.map(
    (property) => [property, reasonCodes.length === 0 && compatiblePropertyValues[property].length === 1],
  ));
  return Object.freeze({
    decision: reasonCodes.length === 0 ? "construction-complete" : "abstain",
    reason_codes: Object.freeze(reasonCodes),
    expected_cells: expectedCells.length,
    observed_records: records.length,
    observation_regime_id: observationRegimeId,
    compatible_recipe_ids: Object.freeze(candidateRecipes.map(({ recipe_id: id }) => id)),
    compatible_property_values: Object.freeze(compatiblePropertyValues),
    identifiable: Object.freeze(identifiable),
    result_label: "NO_RESULT",
    no_result: true,
  });
}

export function fixture026RsdT02CanonicalStepPass(evaluation) {
  assertFixture026RsdT02Evaluation(evaluation);
  return evaluation.canonical_step_residual !== null
    && evaluation.canonical_step_residual <= FIXTURE_026_RSD_T02_THRESHOLDS.matched_step_supremum_ceiling;
}
