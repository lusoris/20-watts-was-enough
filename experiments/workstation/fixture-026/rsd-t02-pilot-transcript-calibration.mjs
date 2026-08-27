import { createHash } from "node:crypto";
import { pathToFileURL } from "node:url";
import { readFile } from "node:fs/promises";

import {
  analyzeFixture026RsdT02PairedPanel,
  FIXTURE_026_RSD_T02_HOLM4_VERSION,
  FIXTURE_026_RSD_T02_REGISTERED_HYPOTHESES,
} from "./rsd-t02-holm4.mjs";
import { fixture026RsdT02InverseNormal } from "./rsd-t02-power-plan.mjs";

export const FIXTURE_026_RSD_T02_PILOT_TRANSCRIPT_CALIBRATION_VERSION =
  "fixture-026.rsd-t02-pilot-transcript-calibration.v1";
export const FIXTURE_026_RSD_T02_SYNTHETIC_TRANSCRIPT_GENERATOR_VERSION =
  "fixture-026.rsd-t02-synthetic-pilot-transcript-generator.v1";

const REGISTERED_ARM_IDS = Object.freeze([
  "C-MECHANISM-BANK",
  "B-STATE-SPACE",
  "B-RECURRENT",
]);
const REGISTERED_HYPOTHESIS_IDS = Object.freeze(
  FIXTURE_026_RSD_T02_REGISTERED_HYPOTHESES.map((row) => row.hypothesis_id),
);
const ENDPOINT_BY_HYPOTHESIS = Object.freeze([
  "mean_property_log_loss_nats",
  "mean_property_log_loss_nats",
  "mean_decision_loss_dimensionless",
  "mean_decision_loss_dimensionless",
]);
const COMPARATOR_BY_HYPOTHESIS = Object.freeze([
  "B-STATE-SPACE",
  "B-RECURRENT",
  "B-STATE-SPACE",
  "B-RECURRENT",
]);
const SCENARIO_ROLES = new Set([
  "synthetic-null-familywise-error-method-check",
  "synthetic-alternative-rejection-method-check",
  "hostile-bootstrap-degeneracy-method-check",
  "hostile-retention-refusal-method-check",
]);
const REQUIRED_CALIBRATION_ROLES = Object.freeze([
  "synthetic-null-familywise-error-method-check",
  "synthetic-alternative-rejection-method-check",
  "hostile-bootstrap-degeneracy-method-check",
]);
const CONFIGURATION_KEYS = Object.freeze([
  "schema",
  "contract_version",
  "artifact",
  "track",
  "authority",
  "pilot_input_role",
  "private_response_adaptation_permitted",
  "analysis_contract_version",
  "independent_unit",
  "family_mode",
  "multiplicity_rule",
  "runtime_failure_disposition",
  "familywise_alpha",
  "bootstrap_resamples",
  "simulation_replicates",
  "monte_carlo_confidence_level",
  "simulation_key",
  "contrast_order",
  "registered_family_ids",
  "runtime_failure_penalties",
  "scenarios",
  "comparison_inference_permitted",
  "claim_eligible",
  "result_label",
]);
const SCENARIO_KEYS = Object.freeze([
  "scenario_id",
  "role",
  "candidate_baselines",
  "runtime_failure_probability_by_arm",
  "families",
]);
const FAMILY_KEYS = Object.freeze([
  "family_id",
  "planned_instances",
  "pre_response_attrition_probability",
  "contrast_mean",
  "contrast_covariance",
]);
const IDENTIFIER_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._-]{2,127}$/u;
const SQRT_THREE = Math.sqrt(3);

function refuse(message) {
  throw new Error(`Fixture 026 RSD-T02 pilot-transcript calibration refused: ${message}`);
}

function stableJson(value) {
  if (Array.isArray(value)) return `[${value.map(stableJson).join(",")}]`;
  if (value && typeof value === "object") {
    return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${stableJson(value[key])}`).join(",")}}`;
  }
  return JSON.stringify(value);
}

function sha256(value) {
  return createHash("sha256").update(value).digest("hex");
}

function scenarioDgpProjection(configuration, scenario) {
  const familyById = new Map(scenario.families.map((family) => [family.family_id, family]));
  return {
    candidate_baselines: scenario.candidate_baselines,
    runtime_failure_probability_by_arm: scenario.runtime_failure_probability_by_arm,
    families_in_registered_order: configuration.registered_family_ids.map(
      (familyId) => familyById.get(familyId),
    ),
  };
}

function dgpFingerprint(configuration, scenario) {
  return sha256(stableJson({
    calibration_contract_version:
      FIXTURE_026_RSD_T02_PILOT_TRANSCRIPT_CALIBRATION_VERSION,
    synthetic_transcript_generator_version:
      FIXTURE_026_RSD_T02_SYNTHETIC_TRANSCRIPT_GENERATOR_VERSION,
    simulation_key: configuration.simulation_key,
    registered_family_ids_in_scientific_order: configuration.registered_family_ids,
    scenario_dgp: scenarioDgpProjection(configuration, scenario),
  }));
}

function deterministicUniform(key, ...coordinates) {
  const word = createHash("sha256")
    .update(`${FIXTURE_026_RSD_T02_SYNTHETIC_TRANSCRIPT_GENERATOR_VERSION}\u0000${key}\u0000${coordinates.join("\u0000")}`)
    .digest()
    .readBigUInt64BE(0) >> 11n;
  return Number(word) / 0x20_0000_0000_0000;
}

function choleskyPsd(matrix, context) {
  const size = REGISTERED_HYPOTHESIS_IDS.length;
  if (!Array.isArray(matrix) || matrix.length !== size) {
    refuse(`${context} covariance must be a ${size}-by-${size} matrix`);
  }
  for (const [rowIndex, row] of matrix.entries()) {
    if (!Array.isArray(row) || row.length !== size) {
      refuse(`${context} covariance row ${rowIndex} has the wrong length`);
    }
    for (const [columnIndex, value] of row.entries()) {
      if (!Number.isFinite(value)) refuse(`${context} covariance[${rowIndex}][${columnIndex}] is not finite`);
      if (Math.abs(value - matrix[columnIndex]?.[rowIndex]) > 1e-12) {
        refuse(`${context} covariance is not symmetric`);
      }
    }
  }
  const lower = Array.from({ length: size }, () => Array(size).fill(0));
  for (let row = 0; row < size; row += 1) {
    for (let column = 0; column <= row; column += 1) {
      let residual = matrix[row][column];
      for (let k = 0; k < column; k += 1) residual -= lower[row][k] * lower[column][k];
      if (row === column) {
        if (residual < -1e-12) refuse(`${context} covariance is not positive semidefinite`);
        lower[row][column] = Math.sqrt(Math.max(0, residual));
      } else if (lower[column][column] > 1e-15) {
        lower[row][column] = residual / lower[column][column];
      } else if (Math.abs(residual) > 1e-12) {
        refuse(`${context} covariance is not positive semidefinite`);
      }
    }
  }
  return lower;
}

function assertExactKeys(object, expectedKeys, context) {
  if (!object || typeof object !== "object" || Array.isArray(object)) {
    refuse(`${context} must be an object`);
  }
  const actual = Object.keys(object).sort();
  const expected = [...expectedKeys].sort();
  if (actual.length !== expected.length || actual.some((key, index) => key !== expected[index])) {
    refuse(`${context} keys differ from the registered contract`);
  }
}

function assertConfiguration(input) {
  if (!input || typeof input !== "object" || Array.isArray(input)) refuse("configuration must be an object");
  assertExactKeys(input, CONFIGURATION_KEYS, "configuration");
  if (
    input.schema !== 1
    || input.contract_version !== FIXTURE_026_RSD_T02_PILOT_TRANSCRIPT_CALIBRATION_VERSION
  ) refuse("schema or contract version differs from v1");
  if (input.artifact !== "fixture-026" || input.track !== "RSD-T02") refuse("artifact or track is invalid");
  if (input.authority !== "public-synthetic-pilot-transcript-method-calibration-only") refuse("authority is not public synthetic method calibration");
  if (input.pilot_input_role !== "development-evaluation-synthetic-method-check-only") refuse("pilot input role is invalid");
  if (input.private_response_adaptation_permitted !== false) refuse("private-response adaptation must be forbidden");
  if (input.analysis_contract_version !== FIXTURE_026_RSD_T02_HOLM4_VERSION) refuse("analysis contract version differs from the executable analyzer");
  if (input.independent_unit !== "system-instance") refuse("only system-instance transcripts are permitted");
  if (input.family_mode !== "fixed-family-stratified-equal-family-weight") refuse("family mode differs from the analyzer estimand");
  if (input.multiplicity_rule !== "one-four-hypothesis-holm-family") refuse("multiplicity rule differs from Holm-4");
  if (input.runtime_failure_disposition !== "in-denominator-registered-penalty") refuse("runtime failures cannot be dropped");
  if (input.familywise_alpha !== 0.05) refuse("familywise alpha must equal 0.05");
  if (!Number.isSafeInteger(input.bootstrap_resamples) || input.bootstrap_resamples < 1000 || input.bootstrap_resamples > 1_000_000) refuse("bootstrap resamples must lie from 1,000 through 1,000,000");
  if (!Number.isSafeInteger(input.simulation_replicates) || input.simulation_replicates < 2 || input.simulation_replicates > 100_000) refuse("simulation replicates must lie from 2 through 100,000");
  if (!Number.isFinite(input.monte_carlo_confidence_level) || input.monte_carlo_confidence_level < 0.8 || input.monte_carlo_confidence_level > 0.999) refuse("Monte Carlo confidence level must lie from 0.8 through 0.999");
  if (typeof input.simulation_key !== "string" || input.simulation_key.length < 16) refuse("public simulation key must contain at least 16 characters");
  if (
    !Array.isArray(input.contrast_order)
    || input.contrast_order.length !== REGISTERED_HYPOTHESIS_IDS.length
    || input.contrast_order.some((id, index) => id !== REGISTERED_HYPOTHESIS_IDS[index])
  ) refuse("contrast order differs from the registered Holm family");
  if (
    !Array.isArray(input.registered_family_ids)
    || input.registered_family_ids.length < 2
    || new Set(input.registered_family_ids).size !== input.registered_family_ids.length
    || input.registered_family_ids.some((id) => !IDENTIFIER_PATTERN.test(id))
  ) refuse("at least two unique registered family IDs are required");
  assertExactKeys(input.runtime_failure_penalties, [
    "mean_property_log_loss_nats",
    "mean_decision_loss_dimensionless",
  ], "runtime-failure penalties");
  for (const [endpoint, penalty] of Object.entries(input.runtime_failure_penalties)) {
    if (!Number.isFinite(penalty) || penalty < 0) refuse(`runtime-failure penalty for ${endpoint} is invalid`);
  }
  if (!Array.isArray(input.scenarios) || input.scenarios.length < 1) refuse("at least one scenario is required");
  const scenarioIds = new Set();
  for (const [scenarioIndex, scenario] of input.scenarios.entries()) {
    const context = `scenario ${scenarioIndex}`;
    if (!scenario || typeof scenario !== "object" || Array.isArray(scenario)) refuse(`${context} is invalid`);
    assertExactKeys(scenario, SCENARIO_KEYS, context);
    if (!IDENTIFIER_PATTERN.test(scenario.scenario_id ?? "")) refuse(`${context} has an invalid ID`);
    if (scenarioIds.has(scenario.scenario_id)) refuse(`duplicate scenario ${scenario.scenario_id}`);
    scenarioIds.add(scenario.scenario_id);
    if (!SCENARIO_ROLES.has(scenario.role)) refuse(`${context} has an unregistered role`);
    assertExactKeys(scenario.candidate_baselines, [
      "mean_property_log_loss_nats",
      "mean_decision_loss_dimensionless",
    ], `${context} candidate baselines`);
    for (const [endpoint, baseline] of Object.entries(scenario.candidate_baselines)) {
      if (!Number.isFinite(baseline) || baseline < 0) refuse(`${context} baseline for ${endpoint} is invalid`);
    }
    assertExactKeys(scenario.runtime_failure_probability_by_arm, REGISTERED_ARM_IDS, `${context} runtime-failure probabilities`);
    for (const [armId, probability] of Object.entries(scenario.runtime_failure_probability_by_arm)) {
      if (!Number.isFinite(probability) || probability < 0 || probability > 1) refuse(`${context} runtime-failure probability for ${armId} is invalid`);
    }
    if (!Array.isArray(scenario.families) || scenario.families.length !== input.registered_family_ids.length) refuse(`${context} family panel is incomplete`);
    const scenarioFamilyIds = new Set();
    for (const [familyIndex, family] of scenario.families.entries()) {
      const familyContext = `${context} family ${familyIndex}`;
      if (!family || typeof family !== "object" || Array.isArray(family)) refuse(`${familyContext} is invalid`);
      assertExactKeys(family, FAMILY_KEYS, familyContext);
      if (!input.registered_family_ids.includes(family.family_id)) refuse(`${familyContext} is unregistered`);
      if (scenarioFamilyIds.has(family.family_id)) refuse(`${context} duplicates family ${family.family_id}`);
      scenarioFamilyIds.add(family.family_id);
      if (!Number.isSafeInteger(family.planned_instances) || family.planned_instances < 2 || family.planned_instances > 100_000) refuse(`${familyContext} planned count is invalid`);
      if (!Number.isFinite(family.pre_response_attrition_probability) || family.pre_response_attrition_probability < 0 || family.pre_response_attrition_probability > 1) refuse(`${familyContext} attrition probability is invalid`);
      if (!Array.isArray(family.contrast_mean) || family.contrast_mean.length !== REGISTERED_HYPOTHESIS_IDS.length || family.contrast_mean.some((value) => !Number.isFinite(value))) refuse(`${familyContext} contrast mean is invalid`);
      const lower = choleskyPsd(family.contrast_covariance, familyContext);
      for (const [hypothesisIndex, endpoint] of ENDPOINT_BY_HYPOTHESIS.entries()) {
        const maximumContrast = family.contrast_mean[hypothesisIndex]
          + SQRT_THREE * lower[hypothesisIndex].reduce((sum, value) => sum + Math.abs(value), 0);
        if (scenario.candidate_baselines[endpoint] + 1e-12 < maximumContrast) {
          refuse(`${familyContext} can generate a negative ${COMPARATOR_BY_HYPOTHESIS[hypothesisIndex]} ${endpoint}`);
        }
      }
    }
    if (scenarioFamilyIds.size !== input.registered_family_ids.length || input.registered_family_ids.some((id) => !scenarioFamilyIds.has(id))) refuse(`${context} family IDs differ from the registered panel`);
    const contrastMeans = scenario.families.flatMap((family) => family.contrast_mean);
    const failureProbabilities = REGISTERED_ARM_IDS.map(
      (armId) => scenario.runtime_failure_probability_by_arm[armId],
    );
    if (scenario.role === "synthetic-null-familywise-error-method-check") {
      if (contrastMeans.some((value) => value !== 0)) {
        refuse(`${context} null role requires every registered contrast mean to equal zero`);
      }
      if (failureProbabilities.some((value) => value !== failureProbabilities[0])) {
        refuse(`${context} null role requires equal arm runtime-failure probabilities`);
      }
    } else if (scenario.role === "synthetic-alternative-rejection-method-check") {
      if (contrastMeans.some((value) => value > 0)) {
        refuse(`${context} alternative role forbids a positive candidate-minus-comparator contrast`);
      }
      if (!contrastMeans.some((value) => value < 0)) {
        refuse(`${context} alternative role requires at least one negative registered contrast`);
      }
      const failureAdjustedMeans = scenario.families.flatMap((family) => (
        family.contrast_mean.map((mean, hypothesisIndex) => {
          const endpoint = ENDPOINT_BY_HYPOTHESIS[hypothesisIndex];
          const comparatorArm = COMPARATOR_BY_HYPOTHESIS[hypothesisIndex];
          const candidateBaseline = scenario.candidate_baselines[endpoint];
          const penalty = input.runtime_failure_penalties[endpoint];
          const candidateFailureProbability =
            scenario.runtime_failure_probability_by_arm["C-MECHANISM-BANK"];
          const comparatorFailureProbability =
            scenario.runtime_failure_probability_by_arm[comparatorArm];
          const expectedCandidate = (1 - candidateFailureProbability) * candidateBaseline
            + candidateFailureProbability * penalty;
          const expectedComparator = (1 - comparatorFailureProbability)
              * (candidateBaseline - mean)
            + comparatorFailureProbability * penalty;
          return expectedCandidate - expectedComparator;
        })
      ));
      if (failureAdjustedMeans.some((value) => value > 0)) {
        refuse(`${context} alternative role forbids a positive runtime-failure-adjusted candidate-minus-comparator expectation`);
      }
      if (!failureAdjustedMeans.some((value) => value < 0)) {
        refuse(`${context} alternative role requires at least one negative runtime-failure-adjusted contrast`);
      }
    } else if (scenario.role === "hostile-bootstrap-degeneracy-method-check") {
      const exactSmallPanel = scenario.families.every((family) => (
        family.planned_instances === 2
        && family.pre_response_attrition_probability === 0
      ));
      const noRuntimeFailures = failureProbabilities.every((value) => value === 0);
      const observedZeroSeConstruction = scenario.families.every((family) => (
        family.contrast_covariance.every((row) => row.every((value) => value === 0))
      ));
      const bootstrapZeroSeConstruction = scenario.families.every((family) => (
        family.contrast_covariance.every((row, index) => row[index] > 0)
      ));
      if (!exactSmallPanel || !noRuntimeFailures) {
        refuse(`${context} bootstrap-degeneracy role requires exactly two retained instances per family and zero runtime-failure probability`);
      }
      if (!observedZeroSeConstruction && !bootstrapZeroSeConstruction) {
        refuse(`${context} bootstrap-degeneracy role requires either all-zero covariance or positive variance for every registered contrast`);
      }
    } else if (scenario.role === "hostile-retention-refusal-method-check") {
      if (!scenario.families.every((family) => family.pre_response_attrition_probability === 1)) {
        refuse(`${context} retention-refusal role requires total pre-response attrition in every family`);
      }
    }
  }
  if (input.comparison_inference_permitted !== false || input.claim_eligible !== false || input.result_label !== "NO_RESULT") refuse("calibration authority flags must remain closed");
}

export function assertFixture026RsdT02PilotTranscriptCalibrationConfiguration(input) {
  assertConfiguration(input);
  return true;
}

function preparedScenario(configuration, scenarioId) {
  assertConfiguration(configuration);
  const scenario = configuration.scenarios.find((row) => row.scenario_id === scenarioId);
  if (!scenario) refuse(`unknown scenario ${scenarioId}`);
  return {
    scenario,
    configurationSha256: sha256(stableJson(configuration)),
    scenarioSha256: sha256(stableJson(scenario)),
    dgpFingerprintSha256: dgpFingerprint(configuration, scenario),
    lowerByFamily: new Map(scenario.families.map((family) => [
      family.family_id,
      choleskyPsd(family.contrast_covariance, `scenario ${scenarioId} family ${family.family_id}`),
    ])),
  };
}

function transcriptHash({
  configurationSha256,
  scenarioSha256,
  dgpFingerprintSha256,
  scenarioId,
  replicateIndex,
  records,
}) {
  return sha256(stableJson({
    configuration_sha256: configurationSha256,
    scenario_definition_sha256: scenarioSha256,
    dgp_fingerprint_sha256: dgpFingerprintSha256,
    scenario_id: scenarioId,
    replicate_index: replicateIndex,
    records,
  }));
}

export function buildFixture026RsdT02SyntheticPilotTranscript(configuration, {
  scenario_id: scenarioId,
  replicate_index: replicateIndex,
}) {
  const {
    scenario,
    configurationSha256,
    scenarioSha256,
    dgpFingerprintSha256,
    lowerByFamily,
  } = preparedScenario(configuration, scenarioId);
  if (!Number.isSafeInteger(replicateIndex) || replicateIndex < 0 || replicateIndex >= configuration.simulation_replicates) refuse("replicate index is outside the configured simulation range");
  const records = [];
  const retainedCounts = Object.fromEntries(configuration.registered_family_ids.map((id) => [id, 0]));
  const runtimeFailureCounts = Object.fromEntries(REGISTERED_ARM_IDS.map((id) => [id, 0]));
  for (const family of scenario.families) {
    const lower = lowerByFamily.get(family.family_id);
    for (let instanceIndex = 0; instanceIndex < family.planned_instances; instanceIndex += 1) {
      const coordinatePrefix = [replicateIndex, family.family_id, instanceIndex];
      if (deterministicUniform(dgpFingerprintSha256, ...coordinatePrefix, "attrition") < family.pre_response_attrition_probability) continue;
      retainedCounts[family.family_id] += 1;
      const standardized = REGISTERED_HYPOTHESIS_IDS.map((_, dimension) => (
        SQRT_THREE * (2 * deterministicUniform(dgpFingerprintSha256, ...coordinatePrefix, "contrast", dimension) - 1)
      ));
      const contrasts = family.contrast_mean.map((mean, row) => mean + lower[row].reduce(
        (sum, coefficient, column) => sum + coefficient * standardized[column],
        0,
      ));
      const identity = sha256(`${FIXTURE_026_RSD_T02_SYNTHETIC_TRANSCRIPT_GENERATOR_VERSION}\u0000${dgpFingerprintSha256}\u0000${replicateIndex}\u0000${family.family_id}\u0000${instanceIndex}\u0000scientific-identity`);
      const systemId = sha256(`${FIXTURE_026_RSD_T02_SYNTHETIC_TRANSCRIPT_GENERATOR_VERSION}\u0000${dgpFingerprintSha256}\u0000${identity}\u0000system-instance`);
      const outcomes = {
        "C-MECHANISM-BANK": {
          mean_property_log_loss_nats: scenario.candidate_baselines.mean_property_log_loss_nats,
          mean_decision_loss_dimensionless: scenario.candidate_baselines.mean_decision_loss_dimensionless,
        },
        "B-STATE-SPACE": {
          mean_property_log_loss_nats: scenario.candidate_baselines.mean_property_log_loss_nats - contrasts[0],
          mean_decision_loss_dimensionless: scenario.candidate_baselines.mean_decision_loss_dimensionless - contrasts[2],
        },
        "B-RECURRENT": {
          mean_property_log_loss_nats: scenario.candidate_baselines.mean_property_log_loss_nats - contrasts[1],
          mean_decision_loss_dimensionless: scenario.candidate_baselines.mean_decision_loss_dimensionless - contrasts[3],
        },
      };
      for (const armId of REGISTERED_ARM_IDS) {
        const runtimeFailure = deterministicUniform(dgpFingerprintSha256, ...coordinatePrefix, "runtime-failure", armId)
          < scenario.runtime_failure_probability_by_arm[armId];
        if (runtimeFailure) runtimeFailureCounts[armId] += 1;
        const endpointValues = runtimeFailure ? configuration.runtime_failure_penalties : outcomes[armId];
        records.push(Object.freeze({
          system_instance_id: systemId,
          scientific_identity_sha256: identity,
          family_id: family.family_id,
          arm_id: armId,
          pre_response_valid: true,
          runtime_failure: runtimeFailure,
          mean_property_log_loss_nats: Math.max(0, endpointValues.mean_property_log_loss_nats),
          mean_decision_loss_dimensionless: Math.max(0, endpointValues.mean_decision_loss_dimensionless),
        }));
      }
    }
  }
  return Object.freeze({
    schema: 1,
    contract_version: FIXTURE_026_RSD_T02_PILOT_TRANSCRIPT_CALIBRATION_VERSION,
    scenario_id: scenarioId,
    replicate_index: replicateIndex,
    configuration_sha256: configurationSha256,
    scenario_definition_sha256: scenarioSha256,
    dgp_fingerprint_sha256: dgpFingerprintSha256,
    synthetic_transcript_generator_version:
      FIXTURE_026_RSD_T02_SYNTHETIC_TRANSCRIPT_GENERATOR_VERSION,
    independent_unit: "system-instance",
    contrast_order: Object.freeze([...REGISTERED_HYPOTHESIS_IDS]),
    retained_instance_counts_by_family: Object.freeze(retainedCounts),
    runtime_failure_counts_by_arm: Object.freeze(runtimeFailureCounts),
    record_count: records.length,
    records: Object.freeze(records),
    transcript_sha256: transcriptHash({
      configurationSha256,
      scenarioSha256,
      dgpFingerprintSha256,
      scenarioId,
      replicateIndex,
      records,
    }),
    authority: "exact-public-synthetic-paired-endpoint-transcript-only",
    scientific_observation: false,
    result_label: "NO_RESULT",
  });
}

export function summarizeFixture026RsdT02PlusOneMonteCarlo({
  event_count: eventCount,
  replicate_count: replicateCount,
  confidence_level: confidenceLevel,
}) {
  if (!Number.isSafeInteger(replicateCount) || replicateCount < 1) refuse("Monte Carlo replicate count is invalid");
  if (!Number.isSafeInteger(eventCount) || eventCount < 0 || eventCount > replicateCount) refuse("Monte Carlo event count is invalid");
  if (!Number.isFinite(confidenceLevel) || confidenceLevel < 0.8 || confidenceLevel > 0.999) refuse("Monte Carlo confidence level is invalid");
  const adjustedSuccesses = eventCount + 1;
  const adjustedTrials = replicateCount + 1;
  const observedFrequency = eventCount / replicateCount;
  const plusOneEstimate = adjustedSuccesses / adjustedTrials;
  const z = fixture026RsdT02InverseNormal(0.5 + confidenceLevel / 2);
  const zSquared = z ** 2;
  const denominator = 1 + zSquared / replicateCount;
  const center = (observedFrequency + zSquared / (2 * replicateCount)) / denominator;
  const halfWidth = z * Math.sqrt(
    observedFrequency * (1 - observedFrequency) / replicateCount
      + zSquared / (4 * replicateCount ** 2),
  ) / denominator;
  return Object.freeze({
    event_count: eventCount,
    monte_carlo_replicate_count: replicateCount,
    observed_event_frequency: observedFrequency,
    plus_one_event_probability: plusOneEstimate,
    plus_one_resolution: 1 / (replicateCount + 1),
    confidence_level: confidenceLevel,
    interval_method: "wilson-score-on-observed-event-count/replicate-count",
    monte_carlo_wilson_interval: Object.freeze([
      Math.min(observedFrequency, Math.max(0, center - halfWidth)),
      Math.max(observedFrequency, Math.min(1, center + halfWidth)),
    ]),
    interval_is_monte_carlo_uncertainty_only: true,
    scientific_effect_uncertainty_interval: false,
  });
}

function calibrationLabel(role) {
  if (role === "synthetic-null-familywise-error-method-check") return "synthetic-null-family-wise-any-rejection-frequency";
  if (role === "synthetic-alternative-rejection-method-check") return "synthetic-alternative-family-wise-any-rejection-frequency";
  if (role === "hostile-bootstrap-degeneracy-method-check") return "hostile-degeneracy-family-wise-any-rejection-frequency";
  return "hostile-retention-refusal-family-wise-any-rejection-frequency";
}

export function calibrateFixture026RsdT02PilotTranscripts(configuration) {
  assertConfiguration(configuration);
  const confidenceLevel = configuration.monte_carlo_confidence_level;
  const scenarioReports = configuration.scenarios.map((scenario) => {
    const hypothesisRejections = Object.fromEntries(REGISTERED_HYPOTHESIS_IDS.map((id) => [id, 0]));
    const invalidBootstrapTotals = Object.fromEntries(REGISTERED_HYPOTHESIS_IDS.map((id) => [id, 0]));
    const maximumPFloors = Object.fromEntries(REGISTERED_HYPOTHESIS_IDS.map((id) => [id, 0]));
    let anyRejectionCount = 0;
    let allRejectionCount = 0;
    let analyzerRefusalCount = 0;
    let bootstrapResolutionFailureCount = 0;
    let zeroSeOrInvalidBootstrapReplicateCount = 0;
    const replicateAudit = [];
    for (let replicateIndex = 0; replicateIndex < configuration.simulation_replicates; replicateIndex += 1) {
      const transcript = buildFixture026RsdT02SyntheticPilotTranscript(configuration, {
        scenario_id: scenario.scenario_id,
        replicate_index: replicateIndex,
      });
      const analysis = analyzeFixture026RsdT02PairedPanel({
        records: transcript.records,
        registered_family_ids: configuration.registered_family_ids,
        familywise_alpha: configuration.familywise_alpha,
        bootstrap_resamples: configuration.bootstrap_resamples,
        resampling_key: `${FIXTURE_026_RSD_T02_SYNTHETIC_TRANSCRIPT_GENERATOR_VERSION}\u0000${transcript.dgp_fingerprint_sha256}\u0000${replicateIndex}`,
        runtime_failure_penalties: configuration.runtime_failure_penalties,
      });
      const refused = analysis.validation_errors.length > 0;
      if (refused) analyzerRefusalCount += 1;
      const rejectedIds = refused ? [] : analysis.effects
        .filter((row) => row.mathematical_rejection)
        .map((row) => row.hypothesis_id);
      if (rejectedIds.length > 0) anyRejectionCount += 1;
      if (rejectedIds.length === REGISTERED_HYPOTHESIS_IDS.length) allRejectionCount += 1;
      for (const id of rejectedIds) hypothesisRejections[id] += 1;
      if (!refused && !analysis.bootstrap_resolution_gate_satisfied) bootstrapResolutionFailureCount += 1;
      const zeroSeOrInvalid = !refused && analysis.effects.some((row) => (
        row.inference_method === "degenerate-zero-standard-error-no-rejection"
        || row.invalid_bootstrap_resample_count > 0
      ));
      if (zeroSeOrInvalid) zeroSeOrInvalidBootstrapReplicateCount += 1;
      if (!refused) {
        for (const effect of analysis.effects) {
          invalidBootstrapTotals[effect.hypothesis_id] += effect.invalid_bootstrap_resample_fraction;
          maximumPFloors[effect.hypothesis_id] = Math.max(
            maximumPFloors[effect.hypothesis_id],
            effect.data_dependent_bootstrap_p_floor,
          );
        }
      }
      replicateAudit.push(Object.freeze({
        replicate_index: replicateIndex,
        transcript_sha256: transcript.transcript_sha256,
        record_count: transcript.record_count,
        retained_instance_counts_by_family: transcript.retained_instance_counts_by_family,
        runtime_failure_counts_by_arm: transcript.runtime_failure_counts_by_arm,
        analyzer_point_report_sha256: sha256(stableJson(analysis)),
        analyzer_refused: refused,
        analyzer_validation_errors: analysis.validation_errors,
        bootstrap_resolution_gate_satisfied: analysis.bootstrap_resolution_gate_satisfied,
        any_registered_hypothesis_rejected: rejectedIds.length > 0,
        rejected_hypothesis_ids: Object.freeze(rejectedIds),
        result_label: "NO_RESULT",
      }));
    }
    const acceptedReplicates = configuration.simulation_replicates - analyzerRefusalCount;
    return Object.freeze({
      scenario_id: scenario.scenario_id,
      scenario_definition_sha256: sha256(stableJson(scenario)),
      dgp_fingerprint_sha256: dgpFingerprint(configuration, scenario),
      role: scenario.role,
      method_quantity_label: calibrationLabel(scenario.role),
      family_wise_any_rejection_probability: summarizeFixture026RsdT02PlusOneMonteCarlo({
        event_count: anyRejectionCount,
        replicate_count: configuration.simulation_replicates,
        confidence_level: confidenceLevel,
      }),
      family_wise_all_four_rejection_probability: summarizeFixture026RsdT02PlusOneMonteCarlo({
        event_count: allRejectionCount,
        replicate_count: configuration.simulation_replicates,
        confidence_level: confidenceLevel,
      }),
      hypothesis_rejection_probabilities: Object.freeze(REGISTERED_HYPOTHESIS_IDS.map((hypothesisId) => Object.freeze({
        hypothesis_id: hypothesisId,
        ...summarizeFixture026RsdT02PlusOneMonteCarlo({
          event_count: hypothesisRejections[hypothesisId],
          replicate_count: configuration.simulation_replicates,
          confidence_level: confidenceLevel,
        }),
      }))),
      analyzer_accepted_replicate_count: acceptedReplicates,
      analyzer_refusal_replicate_count: analyzerRefusalCount,
      analyzer_refusals_count_as_nonrejections: true,
      bootstrap_resolution_failure_replicate_count: bootstrapResolutionFailureCount,
      zero_standard_error_or_invalid_bootstrap_replicate_count: zeroSeOrInvalidBootstrapReplicateCount,
      mean_invalid_bootstrap_resample_fraction_by_hypothesis: Object.freeze(Object.fromEntries(
        REGISTERED_HYPOTHESIS_IDS.map((id) => [
          id,
          acceptedReplicates > 0 ? invalidBootstrapTotals[id] / acceptedReplicates : null,
        ]),
      )),
      maximum_data_dependent_bootstrap_p_floor_by_hypothesis: Object.freeze(Object.fromEntries(
        REGISTERED_HYPOTHESIS_IDS.map((id) => [
          id,
          acceptedReplicates > 0 ? maximumPFloors[id] : null,
        ]),
      )),
      replicate_audit: Object.freeze(replicateAudit),
      synthetic_method_calibration_executed: true,
      analyzer_accepted_for_method_calibration: acceptedReplicates > 0,
      scientific_power_estimate_permitted: false,
      comparison_inference_permitted: false,
      claim_eligible: false,
      result_label: "NO_RESULT",
    });
  });
  const observedRoles = new Set(scenarioReports.map((row) => row.role));
  const missingRoles = REQUIRED_CALIBRATION_ROLES.filter((role) => !observedRoles.has(role));
  const acceptedByRequiredRole = Object.freeze(Object.fromEntries(
    REQUIRED_CALIBRATION_ROLES.map((role) => [
      role,
      scenarioReports
        .filter((row) => row.role === role)
        .reduce((sum, row) => sum + row.analyzer_accepted_replicate_count, 0),
    ]),
  ));
  const rolesWithoutAnalyzerAcceptance = REQUIRED_CALIBRATION_ROLES.filter(
    (role) => observedRoles.has(role) && acceptedByRequiredRole[role] < 1,
  );
  const requiredScenariosWithoutAnalyzerAcceptance = scenarioReports
    .filter((row) => (
      REQUIRED_CALIBRATION_ROLES.includes(row.role)
      && row.analyzer_accepted_replicate_count < 1
    ))
    .map((row) => row.scenario_id);
  const incompleteReasons = Object.freeze([
    ...missingRoles.map((role) => `missing-required-calibration-role:${role}`),
    ...requiredScenariosWithoutAnalyzerAcceptance.map(
      (scenarioId) => `no-analyzer-accepted-replicate-for-required-scenario:${scenarioId}`,
    ),
  ]);
  const methodCalibrationCompleted = incompleteReasons.length === 0;
  const bootstrapAlignmentBlocker =
    "variance-only-normal-approximation-not-calibrated-to-data-dependent-bootstrap-degeneracy";
  const otherOpenBlockers = [
    "pilot-variance-bytes-role-and-review-not-verified-by-hash-only",
    "analysis-source-hash-not-yet-bound-by-a-frozen-release-contract",
    "effect-margins-target-power-bootstrap-key-and-failure-penalties-not-yet-frozen-together",
    "real-public-pilot-joint-transcript-distribution-not-reviewed-and-frozen",
    "planned-count-calibration-not-accepted-against-reviewed-pilot-transcript-model",
  ];
  return Object.freeze({
    schema: 1,
    contract_version: FIXTURE_026_RSD_T02_PILOT_TRANSCRIPT_CALIBRATION_VERSION,
    artifact: "fixture-026",
    track: "RSD-T02",
    authority: "deterministic-public-synthetic-method-calibration-only",
    configuration_sha256: sha256(stableJson(configuration)),
    synthetic_transcript_generator_version:
      FIXTURE_026_RSD_T02_SYNTHETIC_TRANSCRIPT_GENERATOR_VERSION,
    analyzer_contract_version: FIXTURE_026_RSD_T02_HOLM4_VERSION,
    analyzer_invocation: "exact-imported-analyzeFixture026RsdT02PairedPanel-per-synthetic-transcript",
    estimand_preservation: Object.freeze({
      independent_unit: "system-instance",
      fixed_family_panel: Object.freeze([...configuration.registered_family_ids]),
      primary_family_weighting: "equal-family-weight-via-executable-analyzer",
      multiplicity: "one-four-hypothesis-Holm-family-via-executable-analyzer",
      runtime_failure_disposition: "in-denominator-at-registered-endpoint-penalties",
      bootstrap_zero_standard_error_handling: "inherited-from-executable-analyzer-and-counted-in-calibration-denominator",
    }),
    simulation_replicates_per_scenario: configuration.simulation_replicates,
    bootstrap_resamples_per_hypothesis_per_replicate: configuration.bootstrap_resamples,
    monte_carlo_confidence_level: confidenceLevel,
    scenario_reports: Object.freeze(scenarioReports),
    canonical_role_coverage: Object.freeze({
      required_roles: Object.freeze([...REQUIRED_CALIBRATION_ROLES]),
      observed_roles: Object.freeze([...observedRoles].sort()),
      missing_roles: Object.freeze(missingRoles),
      analyzer_accepted_replicate_count_by_required_role: acceptedByRequiredRole,
      roles_without_analyzer_acceptance: Object.freeze(rolesWithoutAnalyzerAcceptance),
      required_scenarios_without_analyzer_acceptance: Object.freeze(
        requiredScenariosWithoutAnalyzerAcceptance,
      ),
      complete: methodCalibrationCompleted,
    }),
    method_calibration_incomplete_reasons: incompleteReasons,
    power_plan_blocker_assessment: Object.freeze({
      closed_for_public_method_calibration: Object.freeze(
        methodCalibrationCompleted ? [bootstrapAlignmentBlocker] : [],
      ),
      closure_scope: methodCalibrationCompleted
        ? "The executable pilot-transcript simulation path completed every required public synthetic role with analyzer acceptance; this does not establish scientific power."
        : "No bootstrap-alignment blocker is closed because required role coverage or analyzer acceptance is incomplete.",
      still_open_for_plan_freeze: Object.freeze([
        ...(methodCalibrationCompleted ? [] : [bootstrapAlignmentBlocker]),
        ...otherOpenBlockers,
      ]),
    }),
    method_calibration_completed: methodCalibrationCompleted,
    scientific_power_calibrated: false,
    plan_freeze_permitted: false,
    design_gate_satisfied: false,
    comparison_inference_permitted: false,
    claim_eligible: false,
    result_label: "NO_RESULT",
  });
}

async function main() {
  const configPath = process.argv[2];
  if (!configPath) refuse("CLI requires a calibration configuration path");
  const configuration = JSON.parse(await readFile(configPath, "utf8"));
  process.stdout.write(`${JSON.stringify(calibrateFixture026RsdT02PilotTranscripts(configuration), null, 2)}\n`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await main();
}
