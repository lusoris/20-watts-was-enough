import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import test from "node:test";

import Ajv from "ajv";

import { analyzeFixture026RsdT02PairedPanel } from "./rsd-t02-holm4.mjs";
import {
  assertFixture026RsdT02PilotTranscriptCalibrationConfiguration,
  buildFixture026RsdT02SyntheticPilotTranscript,
  calibrateFixture026RsdT02PilotTranscripts,
  FIXTURE_026_RSD_T02_PILOT_TRANSCRIPT_CALIBRATION_VERSION,
  summarizeFixture026RsdT02PlusOneMonteCarlo,
} from "./rsd-t02-pilot-transcript-calibration.mjs";

const HYPOTHESES = [
  "H-LOGLOSS-C-vs-STATE-SPACE",
  "H-LOGLOSS-C-vs-RECURRENT",
  "H-DECISION-C-vs-STATE-SPACE",
  "H-DECISION-C-vs-RECURRENT",
];
const ZERO_COVARIANCE = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];
const DIAGONAL_COVARIANCE = [
  [0.01, 0, 0, 0],
  [0, 0.01, 0, 0],
  [0, 0, 0.0025, 0],
  [0, 0, 0, 0.0025],
];
const PENALTIES = Object.freeze({
  mean_property_log_loss_nats: 4,
  mean_decision_loss_dimensionless: 2,
});

function family(familyId, overrides = {}) {
  return {
    family_id: familyId,
    planned_instances: 6,
    pre_response_attrition_probability: 0,
    contrast_mean: [-1, -0.8, -0.5, -0.4],
    contrast_covariance: DIAGONAL_COVARIANCE.map((row) => [...row]),
    ...overrides,
  };
}

function scenario(overrides = {}) {
  return {
    scenario_id: "strong-public-synthetic-alternative",
    role: "synthetic-alternative-rejection-method-check",
    candidate_baselines: {
      mean_property_log_loss_nats: 2,
      mean_decision_loss_dimensionless: 1,
    },
    runtime_failure_probability_by_arm: {
      "C-MECHANISM-BANK": 0,
      "B-STATE-SPACE": 0,
      "B-RECURRENT": 0,
    },
    families: [family("family-alpha"), family("family-beta")],
    ...overrides,
  };
}

function nullScenario(overrides = {}) {
  return scenario({
    scenario_id: "public-synthetic-null",
    role: "synthetic-null-familywise-error-method-check",
    runtime_failure_probability_by_arm: {
      "C-MECHANISM-BANK": 0.05,
      "B-STATE-SPACE": 0.05,
      "B-RECURRENT": 0.05,
    },
    families: [
      family("family-alpha", { contrast_mean: [0, 0, 0, 0] }),
      family("family-beta", { contrast_mean: [0, 0, 0, 0] }),
    ],
    ...overrides,
  });
}

function degenerateScenario(overrides = {}) {
  return scenario({
    scenario_id: "hostile-two-instance-degenerate",
    role: "hostile-bootstrap-degeneracy-method-check",
    families: [
      family("family-alpha", {
        planned_instances: 2,
        contrast_covariance: ZERO_COVARIANCE.map((row) => [...row]),
      }),
      family("family-beta", {
        planned_instances: 2,
        contrast_covariance: ZERO_COVARIANCE.map((row) => [...row]),
      }),
    ],
    ...overrides,
  });
}

function configuration(overrides = {}) {
  return {
    schema: 1,
    contract_version: FIXTURE_026_RSD_T02_PILOT_TRANSCRIPT_CALIBRATION_VERSION,
    artifact: "fixture-026",
    track: "RSD-T02",
    authority: "public-synthetic-pilot-transcript-method-calibration-only",
    pilot_input_role: "development-evaluation-synthetic-method-check-only",
    private_response_adaptation_permitted: false,
    analysis_contract_version: "fixture-026.rsd-t02-holm4.v1",
    independent_unit: "system-instance",
    family_mode: "fixed-family-stratified-equal-family-weight",
    multiplicity_rule: "one-four-hypothesis-holm-family",
    runtime_failure_disposition: "in-denominator-registered-penalty",
    familywise_alpha: 0.05,
    bootstrap_resamples: 1000,
    simulation_replicates: 2,
    monte_carlo_confidence_level: 0.95,
    simulation_key: "fixture-026-public-pilot-test-key-v1",
    contrast_order: [...HYPOTHESES],
    registered_family_ids: ["family-alpha", "family-beta"],
    runtime_failure_penalties: { ...PENALTIES },
    scenarios: [scenario()],
    comparison_inference_permitted: false,
    claim_eligible: false,
    result_label: "NO_RESULT",
    ...overrides,
  };
}

function canonicalJson(value) {
  if (Array.isArray(value)) return `[${value.map(canonicalJson).join(",")}]`;
  if (value && typeof value === "object") {
    return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${canonicalJson(value[key])}`).join(",")}}`;
  }
  return JSON.stringify(value);
}

test("synthetic transcript is deterministic, paired by identity and directly analyzer-compatible", () => {
  const input = configuration();
  const first = buildFixture026RsdT02SyntheticPilotTranscript(input, {
    scenario_id: input.scenarios[0].scenario_id,
    replicate_index: 0,
  });
  const second = buildFixture026RsdT02SyntheticPilotTranscript(input, {
    scenario_id: input.scenarios[0].scenario_id,
    replicate_index: 0,
  });
  assert.deepEqual(first, second);
  assert.equal(first.record_count, 36);
  assert.match(first.transcript_sha256, /^[0-9a-f]{64}$/u);
  assert.deepEqual(first.retained_instance_counts_by_family, {
    "family-alpha": 6,
    "family-beta": 6,
  });
  const byIdentity = Map.groupBy(first.records, (row) => row.scientific_identity_sha256);
  assert.equal(byIdentity.size, 12);
  assert.ok([...byIdentity.values()].every((rows) => rows.length === 3));
  const analysis = analyzeFixture026RsdT02PairedPanel({
    records: first.records,
    registered_family_ids: input.registered_family_ids,
    familywise_alpha: input.familywise_alpha,
    bootstrap_resamples: input.bootstrap_resamples,
    resampling_key: "direct-executable-analyzer-test-key-v1",
    runtime_failure_penalties: input.runtime_failure_penalties,
  });
  assert.deepEqual(analysis.validation_errors, []);
  assert.equal(analysis.effective_system_instance_n, 12);
  assert.ok(analysis.effects.every((row) => row.family_summaries.length === 2));
  assert.equal(analysis.result_label, "NO_RESULT");
});

test("DGP content binds scientific identities while full configuration remains at the audit root", () => {
  const baseline = configuration();
  const first = buildFixture026RsdT02SyntheticPilotTranscript(baseline, {
    scenario_id: baseline.scenarios[0].scenario_id,
    replicate_index: 0,
  });
  assert.match(first.configuration_sha256, /^[0-9a-f]{64}$/u);
  assert.match(first.scenario_definition_sha256, /^[0-9a-f]{64}$/u);

  const configurationChanged = configuration({ monte_carlo_confidence_level: 0.9 });
  const second = buildFixture026RsdT02SyntheticPilotTranscript(configurationChanged, {
    scenario_id: configurationChanged.scenarios[0].scenario_id,
    replicate_index: 0,
  });
  assert.notEqual(first.configuration_sha256, second.configuration_sha256);
  assert.equal(first.scenario_definition_sha256, second.scenario_definition_sha256);
  assert.equal(first.dgp_fingerprint_sha256, second.dgp_fingerprint_sha256);
  assert.deepEqual(first.records, second.records);
  assert.equal(first.records[0].scientific_identity_sha256, second.records[0].scientific_identity_sha256);
  assert.equal(first.records[0].system_instance_id, second.records[0].system_instance_id);
  assert.notEqual(first.transcript_sha256, second.transcript_sha256);

  const analysisControlsChanged = configuration({
    bootstrap_resamples: 2000,
    runtime_failure_penalties: {
      mean_property_log_loss_nats: 5,
      mean_decision_loss_dimensionless: 3,
    },
  });
  const controlsOnly = buildFixture026RsdT02SyntheticPilotTranscript(
    analysisControlsChanged,
    {
      scenario_id: analysisControlsChanged.scenarios[0].scenario_id,
      replicate_index: 0,
    },
  );
  assert.equal(first.dgp_fingerprint_sha256, controlsOnly.dgp_fingerprint_sha256);
  assert.deepEqual(first.records, controlsOnly.records);
  assert.notEqual(first.configuration_sha256, controlsOnly.configuration_sha256);
  assert.notEqual(first.transcript_sha256, controlsOnly.transcript_sha256);

  const changedScenario = scenario({
    candidate_baselines: {
      mean_property_log_loss_nats: 2.1,
      mean_decision_loss_dimensionless: 1.1,
    },
  });
  const scenarioChanged = configuration({ scenarios: [changedScenario] });
  const third = buildFixture026RsdT02SyntheticPilotTranscript(scenarioChanged, {
    scenario_id: changedScenario.scenario_id,
    replicate_index: 0,
  });
  assert.notEqual(first.scenario_definition_sha256, third.scenario_definition_sha256);
  assert.notEqual(first.dgp_fingerprint_sha256, third.dgp_fingerprint_sha256);
  assert.notEqual(first.records[0].scientific_identity_sha256, third.records[0].scientific_identity_sha256);
  assert.notEqual(first.records[0].system_instance_id, third.records[0].system_instance_id);
  assert.notEqual(first.transcript_sha256, third.transcript_sha256);

  const covarianceChangedScenario = scenario();
  covarianceChangedScenario.families[0].contrast_covariance[0][0] = 0.012;
  const meanChangedScenario = scenario();
  meanChangedScenario.families[0].contrast_mean[0] = -1.1;
  const failureChangedScenario = scenario({
    runtime_failure_probability_by_arm: {
      "C-MECHANISM-BANK": 0.1,
      "B-STATE-SPACE": 0.1,
      "B-RECURRENT": 0.1,
    },
  });
  for (const dgpChangedScenario of [
    covarianceChangedScenario,
    meanChangedScenario,
    failureChangedScenario,
  ]) {
    const changedInput = configuration({ scenarios: [dgpChangedScenario] });
    const changed = buildFixture026RsdT02SyntheticPilotTranscript(changedInput, {
      scenario_id: dgpChangedScenario.scenario_id,
      replicate_index: 0,
    });
    assert.notEqual(first.dgp_fingerprint_sha256, changed.dgp_fingerprint_sha256);
    assert.notEqual(
      first.records[0].scientific_identity_sha256,
      changed.records[0].scientific_identity_sha256,
    );
    assert.notEqual(first.records[0].system_instance_id, changed.records[0].system_instance_id);
  }
});

test("report-only confidence and replicate ceilings preserve every common-prefix transcript and analyzer decision", () => {
  const twenty = configuration({
    monte_carlo_confidence_level: 0.9,
    simulation_replicates: 20,
  });
  const twentyOne = configuration({
    monte_carlo_confidence_level: 0.95,
    simulation_replicates: 21,
  });
  assert.notEqual(canonicalJson(twenty), canonicalJson(twentyOne));
  for (let replicateIndex = 0; replicateIndex < 20; replicateIndex += 1) {
    const left = buildFixture026RsdT02SyntheticPilotTranscript(twenty, {
      scenario_id: twenty.scenarios[0].scenario_id,
      replicate_index: replicateIndex,
    });
    const right = buildFixture026RsdT02SyntheticPilotTranscript(twentyOne, {
      scenario_id: twentyOne.scenarios[0].scenario_id,
      replicate_index: replicateIndex,
    });
    assert.equal(left.dgp_fingerprint_sha256, right.dgp_fingerprint_sha256);
    assert.deepEqual(left.records, right.records);
    assert.notEqual(left.configuration_sha256, right.configuration_sha256);
    assert.notEqual(left.transcript_sha256, right.transcript_sha256);
  }

  const twentyReport = calibrateFixture026RsdT02PilotTranscripts(twenty);
  const twentyOneReport = calibrateFixture026RsdT02PilotTranscripts(twentyOne);
  const commonTwentyOneAudit = twentyOneReport.scenario_reports[0].replicate_audit.slice(0, 20);
  assert.deepEqual(
    twentyReport.scenario_reports[0].replicate_audit.map(
      (row) => row.analyzer_point_report_sha256,
    ),
    commonTwentyOneAudit.map((row) => row.analyzer_point_report_sha256),
  );
  assert.deepEqual(
    twentyReport.scenario_reports[0].replicate_audit.map(
      (row) => row.rejected_hypothesis_ids,
    ),
    commonTwentyOneAudit.map((row) => row.rejected_hypothesis_ids),
  );
});

test("unequal family sizes still use equal-family weighting rather than pooled rows", () => {
  const imbalanced = scenario({
    scenario_id: "imbalanced-equal-weight-audit",
    families: [
      family("family-alpha", {
        planned_instances: 2,
        contrast_mean: [-0.2, -0.2, -0.1, -0.1],
        contrast_covariance: ZERO_COVARIANCE.map((row) => [...row]),
      }),
      family("family-beta", {
        planned_instances: 10,
        contrast_mean: [-1, -1, -0.5, -0.5],
        contrast_covariance: ZERO_COVARIANCE.map((row) => [...row]),
      }),
    ],
  });
  const input = configuration({ scenarios: [imbalanced] });
  const transcript = buildFixture026RsdT02SyntheticPilotTranscript(input, {
    scenario_id: imbalanced.scenario_id,
    replicate_index: 0,
  });
  const analysis = analyzeFixture026RsdT02PairedPanel({
    records: transcript.records,
    registered_family_ids: input.registered_family_ids,
    bootstrap_resamples: 1000,
    runtime_failure_penalties: PENALTIES,
  });
  assert.deepEqual(analysis.validation_errors, []);
  assert.ok(Math.abs(analysis.effects[0].candidate_minus_comparator - (-0.6)) < 1e-12);
  assert.notEqual(analysis.effects[0].candidate_minus_comparator, (-0.2 * 2 - 1 * 10) / 12);
  assert.equal(analysis.effects[0].inference_method, "degenerate-zero-standard-error-no-rejection");
});

test("forced runtime failures remain paired and use exactly the registered penalties", () => {
  const forced = scenario({
    scenario_id: "forced-runtime-failure-audit",
    runtime_failure_probability_by_arm: {
      "C-MECHANISM-BANK": 0,
      "B-STATE-SPACE": 1,
      "B-RECURRENT": 1,
    },
  });
  const input = configuration({ scenarios: [forced] });
  const transcript = buildFixture026RsdT02SyntheticPilotTranscript(input, {
    scenario_id: forced.scenario_id,
    replicate_index: 1,
  });
  const failed = transcript.records.filter((row) => row.runtime_failure);
  assert.equal(failed.length, 24);
  assert.ok(failed.every((row) => row.arm_id !== "C-MECHANISM-BANK"));
  assert.ok(failed.every((row) => row.mean_property_log_loss_nats === PENALTIES.mean_property_log_loss_nats));
  assert.ok(failed.every((row) => row.mean_decision_loss_dimensionless === PENALTIES.mean_decision_loss_dimensionless));
  const analysis = analyzeFixture026RsdT02PairedPanel({
    records: transcript.records,
    registered_family_ids: input.registered_family_ids,
    bootstrap_resamples: 1000,
    runtime_failure_penalties: PENALTIES,
  });
  assert.deepEqual(analysis.validation_errors, []);
});

test("plus-one summaries expose finite resolution and Monte Carlo-only intervals", () => {
  const none = summarizeFixture026RsdT02PlusOneMonteCarlo({
    event_count: 0,
    replicate_count: 9,
    confidence_level: 0.95,
  });
  assert.equal(none.observed_event_frequency, 0);
  assert.equal(none.plus_one_event_probability, 0.1);
  assert.equal(none.plus_one_resolution, 0.1);
  assert.equal(none.monte_carlo_wilson_interval[0], 0);
  assert.ok(none.monte_carlo_wilson_interval[1] > none.observed_event_frequency);
  assert.equal(none.interval_is_monte_carlo_uncertainty_only, true);
  assert.equal(none.scientific_effect_uncertainty_interval, false);
  const summaries = Array.from({ length: 10 }, (_, eventCount) => (
    summarizeFixture026RsdT02PlusOneMonteCarlo({
      event_count: eventCount,
      replicate_count: 9,
      confidence_level: 0.95,
    })
  ));
  for (const summary of summaries) {
    assert.ok(summary.monte_carlo_wilson_interval[0] <= summary.observed_event_frequency);
    assert.ok(summary.monte_carlo_wilson_interval[1] >= summary.observed_event_frequency);
    assert.equal(summary.interval_method, "wilson-score-on-observed-event-count/replicate-count");
  }
  const all = summaries[9];
  assert.equal(all.observed_event_frequency, 1);
  assert.equal(all.plus_one_event_probability, 1);
  assert.equal(all.monte_carlo_wilson_interval[1], 1);
});

test("calibration counts strong rejection, zero-SE degeneracy and analyzer refusal in one denominator", () => {
  const smallN = scenario({
    scenario_id: "hostile-small-n-bootstrap-zero-se-resamples",
    role: "hostile-bootstrap-degeneracy-method-check",
    families: [
      family("family-alpha", { planned_instances: 2 }),
      family("family-beta", { planned_instances: 2 }),
    ],
  });
  const degenerate = degenerateScenario();
  const attrited = scenario({
    scenario_id: "hostile-total-pre-response-attrition",
    role: "hostile-retention-refusal-method-check",
    families: [
      family("family-alpha", { planned_instances: 2, pre_response_attrition_probability: 1 }),
      family("family-beta", { planned_instances: 2, pre_response_attrition_probability: 1 }),
    ],
  });
  const input = configuration({
    scenarios: [nullScenario(), scenario(), smallN, degenerate, attrited],
  });
  const first = calibrateFixture026RsdT02PilotTranscripts(input);
  const second = calibrateFixture026RsdT02PilotTranscripts(input);
  assert.deepEqual(first, second);
  assert.equal(first.scenario_reports.length, 5);

  const strong = first.scenario_reports[1];
  assert.equal(strong.analyzer_refusal_replicate_count, 0);
  assert.equal(strong.family_wise_any_rejection_probability.event_count, 2);
  assert.equal(strong.family_wise_all_four_rejection_probability.event_count, 2);

  const smallSample = first.scenario_reports[2];
  assert.equal(smallSample.bootstrap_resolution_failure_replicate_count, 2);
  assert.equal(smallSample.zero_standard_error_or_invalid_bootstrap_replicate_count, 2);
  assert.ok(Object.values(smallSample.mean_invalid_bootstrap_resample_fraction_by_hypothesis).every((value) => value > 0.2));
  assert.ok(Object.values(smallSample.maximum_data_dependent_bootstrap_p_floor_by_hypothesis).every((value) => value > 0.2));

  const hostile = first.scenario_reports[3];
  assert.equal(hostile.bootstrap_resolution_failure_replicate_count, 2);
  assert.equal(hostile.zero_standard_error_or_invalid_bootstrap_replicate_count, 2);
  assert.equal(hostile.family_wise_any_rejection_probability.event_count, 0);
  assert.equal(hostile.family_wise_any_rejection_probability.plus_one_event_probability, 1 / 3);

  const refused = first.scenario_reports[4];
  assert.equal(refused.analyzer_accepted_replicate_count, 0);
  assert.equal(refused.analyzer_refusal_replicate_count, 2);
  assert.equal(refused.family_wise_any_rejection_probability.event_count, 0);
  assert.ok(refused.replicate_audit.every((row) => row.analyzer_refused));
  assert.ok(Object.values(refused.maximum_data_dependent_bootstrap_p_floor_by_hypothesis).every((value) => value === null));
  assert.equal(first.scientific_power_calibrated, false);
  assert.equal(first.method_calibration_completed, true);
  assert.equal(first.canonical_role_coverage.complete, true);
  assert.equal(first.plan_freeze_permitted, false);
  assert.equal(first.design_gate_satisfied, false);
  assert.equal(first.result_label, "NO_RESULT");
});

test("blocker assessment closes only the executable synthetic calibration path", () => {
  const report = calibrateFixture026RsdT02PilotTranscripts(configuration({
    scenarios: [nullScenario(), scenario(), degenerateScenario()],
  }));
  assert.equal(report.method_calibration_completed, true);
  assert.deepEqual(report.method_calibration_incomplete_reasons, []);
  assert.deepEqual(report.power_plan_blocker_assessment.closed_for_public_method_calibration, [
    "variance-only-normal-approximation-not-calibrated-to-data-dependent-bootstrap-degeneracy",
  ]);
  assert.deepEqual(report.power_plan_blocker_assessment.still_open_for_plan_freeze.slice(0, 3), [
    "pilot-variance-bytes-role-and-review-not-verified-by-hash-only",
    "analysis-source-hash-not-yet-bound-by-a-frozen-release-contract",
    "effect-margins-target-power-bootstrap-key-and-failure-penalties-not-yet-frozen-together",
  ]);
  assert.match(report.power_plan_blocker_assessment.closure_scope, /does not establish scientific power/u);
  assert.equal(report.scenario_reports[0].scientific_power_estimate_permitted, false);
  assert.equal(report.comparison_inference_permitted, false);
  assert.equal(report.claim_eligible, false);
});

test("missing roles and all-refused required roles cannot close the calibration blocker", () => {
  const missing = calibrateFixture026RsdT02PilotTranscripts(configuration());
  assert.equal(missing.method_calibration_completed, false);
  assert.deepEqual(missing.power_plan_blocker_assessment.closed_for_public_method_calibration, []);
  assert.ok(missing.canonical_role_coverage.missing_roles.includes(
    "synthetic-null-familywise-error-method-check",
  ));
  assert.equal(
    missing.power_plan_blocker_assessment.still_open_for_plan_freeze[0],
    "variance-only-normal-approximation-not-calibrated-to-data-dependent-bootstrap-degeneracy",
  );

  const refusedNull = nullScenario({
    scenario_id: "all-refused-required-null",
    families: [
      family("family-alpha", {
        pre_response_attrition_probability: 1,
        contrast_mean: [0, 0, 0, 0],
      }),
      family("family-beta", {
        pre_response_attrition_probability: 1,
        contrast_mean: [0, 0, 0, 0],
      }),
    ],
  });
  const allRolesButRefused = calibrateFixture026RsdT02PilotTranscripts(configuration({
    scenarios: [refusedNull, scenario(), degenerateScenario()],
  }));
  assert.equal(allRolesButRefused.canonical_role_coverage.missing_roles.length, 0);
  assert.deepEqual(allRolesButRefused.canonical_role_coverage.roles_without_analyzer_acceptance, [
    "synthetic-null-familywise-error-method-check",
  ]);
  assert.deepEqual(
    allRolesButRefused.canonical_role_coverage.required_scenarios_without_analyzer_acceptance,
    ["all-refused-required-null"],
  );
  assert.equal(allRolesButRefused.method_calibration_completed, false);
  assert.deepEqual(
    allRolesButRefused.power_plan_blocker_assessment.closed_for_public_method_calibration,
    [],
  );
  assert.ok(allRolesButRefused.method_calibration_incomplete_reasons.some(
    (reason) => reason.includes("no-analyzer-accepted-replicate-for-required-scenario"),
  ));
  assert.equal(allRolesButRefused.scientific_power_calibrated, false);
  assert.equal(allRolesButRefused.result_label, "NO_RESULT");
});

test("configuration validation fails closed on covariance, outcome support, panel drift and authority", () => {
  assert.equal(assertFixture026RsdT02PilotTranscriptCalibrationConfiguration(configuration()), true);

  const indefinite = configuration();
  indefinite.scenarios[0].families[0].contrast_covariance[0][1] = 2;
  indefinite.scenarios[0].families[0].contrast_covariance[1][0] = 2;
  assert.throws(
    () => assertFixture026RsdT02PilotTranscriptCalibrationConfiguration(indefinite),
    /positive semidefinite/u,
  );

  const unsupported = configuration();
  unsupported.scenarios[0].candidate_baselines.mean_property_log_loss_nats = 0;
  unsupported.scenarios[0].families[0].contrast_mean[0] = 10;
  assert.throws(
    () => assertFixture026RsdT02PilotTranscriptCalibrationConfiguration(unsupported),
    /can generate a negative/u,
  );

  const drift = configuration();
  drift.scenarios[0].families[1].family_id = "unregistered-family";
  assert.throws(
    () => assertFixture026RsdT02PilotTranscriptCalibrationConfiguration(drift),
    /unregistered/u,
  );

  assert.throws(
    () => assertFixture026RsdT02PilotTranscriptCalibrationConfiguration(configuration({ authority: "scientific-power" })),
    /authority/u,
  );
});

test("scenario roles impose exact null, alternative and hostile DGP semantics", () => {
  const expectScenarioRefusal = (candidate, pattern) => assert.throws(
    () => assertFixture026RsdT02PilotTranscriptCalibrationConfiguration(
      configuration({ scenarios: [candidate] }),
    ),
    pattern,
  );

  const nonzeroNull = nullScenario();
  nonzeroNull.families[0].contrast_mean[0] = -0.01;
  expectScenarioRefusal(nonzeroNull, /null role requires every registered contrast mean to equal zero/u);

  const unequalFailureNull = nullScenario({
    runtime_failure_probability_by_arm: {
      "C-MECHANISM-BANK": 0.01,
      "B-STATE-SPACE": 0.02,
      "B-RECURRENT": 0.01,
    },
  });
  expectScenarioRefusal(unequalFailureNull, /null role requires equal arm runtime-failure probabilities/u);

  const positiveAlternative = scenario();
  positiveAlternative.families[0].contrast_mean[0] = 0.01;
  expectScenarioRefusal(positiveAlternative, /alternative role forbids a positive/u);

  const zeroAlternative = scenario({
    families: [
      family("family-alpha", { contrast_mean: [0, 0, 0, 0] }),
      family("family-beta", { contrast_mean: [0, 0, 0, 0] }),
    ],
  });
  expectScenarioRefusal(zeroAlternative, /alternative role requires at least one negative/u);

  const failureReversedAlternative = scenario({
    runtime_failure_probability_by_arm: {
      "C-MECHANISM-BANK": 1,
      "B-STATE-SPACE": 0,
      "B-RECURRENT": 0,
    },
  });
  expectScenarioRefusal(
    failureReversedAlternative,
    /positive runtime-failure-adjusted candidate-minus-comparator expectation/u,
  );

  const wrongCountHostile = degenerateScenario();
  wrongCountHostile.families[0].planned_instances = 3;
  expectScenarioRefusal(wrongCountHostile, /requires exactly two retained instances/u);

  const attritedHostile = degenerateScenario();
  attritedHostile.families[0].pre_response_attrition_probability = 0.1;
  expectScenarioRefusal(attritedHostile, /requires exactly two retained instances/u);

  const failedHostile = degenerateScenario({
    runtime_failure_probability_by_arm: {
      "C-MECHANISM-BANK": 0,
      "B-STATE-SPACE": 0.01,
      "B-RECURRENT": 0,
    },
  });
  expectScenarioRefusal(failedHostile, /zero runtime-failure probability/u);

  const relabeledHostile = degenerateScenario();
  relabeledHostile.families[0].contrast_covariance[0][0] = 0.01;
  expectScenarioRefusal(relabeledHostile, /all-zero covariance or positive variance/u);

  const retentionWithoutRefusal = scenario({
    scenario_id: "relabeled-retention-hostile",
    role: "hostile-retention-refusal-method-check",
  });
  expectScenarioRefusal(retentionWithoutRefusal, /requires total pre-response attrition/u);
});

test("runtime exact-key rejection matches JSON Schema at every object level", async () => {
  const directory = new URL("./", import.meta.url);
  const inputSchema = JSON.parse(await readFile(
    new URL("rsd-t02-pilot-transcript-calibration.schema.json", directory),
    "utf8",
  ));
  const ajv = new Ajv({ allErrors: true, schemaId: "auto" });
  const validateInput = ajv.compile(inputSchema);
  const cases = [];

  cases.push(configuration({ unexpected_top_level: true }));

  const scenarioExtra = configuration();
  scenarioExtra.scenarios[0].unexpected_scenario_field = true;
  cases.push(scenarioExtra);

  const familyExtra = configuration();
  familyExtra.scenarios[0].families[0].unexpected_family_field = true;
  cases.push(familyExtra);

  const baselineExtra = configuration();
  baselineExtra.scenarios[0].candidate_baselines.unregistered_endpoint = 1;
  cases.push(baselineExtra);

  const armExtra = configuration();
  armExtra.scenarios[0].runtime_failure_probability_by_arm["UNREGISTERED-ARM"] = 0;
  cases.push(armExtra);

  const penaltyExtra = configuration();
  penaltyExtra.runtime_failure_penalties.unregistered_endpoint = 1;
  cases.push(penaltyExtra);

  const topMissing = configuration();
  delete topMissing.track;
  cases.push(topMissing);

  const scenarioMissing = configuration();
  delete scenarioMissing.scenarios[0].role;
  cases.push(scenarioMissing);

  const familyMissing = configuration();
  delete familyMissing.scenarios[0].families[0].planned_instances;
  cases.push(familyMissing);

  const baselineMissing = configuration();
  delete baselineMissing.scenarios[0].candidate_baselines.mean_decision_loss_dimensionless;
  cases.push(baselineMissing);

  const armMissing = configuration();
  delete armMissing.scenarios[0].runtime_failure_probability_by_arm["B-RECURRENT"];
  cases.push(armMissing);

  const penaltyMissing = configuration();
  delete penaltyMissing.runtime_failure_penalties.mean_property_log_loss_nats;
  cases.push(penaltyMissing);

  for (const hostile of cases) {
    assert.equal(validateInput(hostile), false, "JSON Schema unexpectedly accepted an exact-key violation");
    assert.throws(
      () => assertFixture026RsdT02PilotTranscriptCalibrationConfiguration(hostile),
      /keys differ from the registered contract/u,
    );
  }
});

test("canonical configuration and generated output validate against their JSON schemas", async () => {
  const directory = new URL("./", import.meta.url);
  const canonical = JSON.parse(await readFile(new URL("configs/rsd-t02-pilot-transcript-calibration.json", directory), "utf8"));
  const inputSchema = JSON.parse(await readFile(new URL("rsd-t02-pilot-transcript-calibration.schema.json", directory), "utf8"));
  const outputSchema = JSON.parse(await readFile(new URL("rsd-t02-pilot-transcript-calibration-output.schema.json", directory), "utf8"));
  const ajv = new Ajv({ allErrors: true, schemaId: "auto" });
  const validateInput = ajv.compile(inputSchema);
  assert.equal(validateInput(canonical), true, JSON.stringify(validateInput.errors));
  assert.equal(assertFixture026RsdT02PilotTranscriptCalibrationConfiguration(canonical), true);
  const configurationSha = createHash("sha256").update(canonicalJson(canonical)).digest("hex");
  assert.equal(configurationSha, inputSchema["x-runtime-validator"].canonical_configuration_sha256);

  const lightweight = configuration();
  const report = calibrateFixture026RsdT02PilotTranscripts(lightweight);
  const validateOutput = ajv.compile(outputSchema);
  assert.equal(validateOutput(report), true, JSON.stringify(validateOutput.errors));

  const completeReport = calibrateFixture026RsdT02PilotTranscripts(configuration({
    scenarios: [nullScenario(), scenario(), degenerateScenario()],
  }));
  assert.equal(completeReport.method_calibration_completed, true);
  assert.equal(
    validateOutput(completeReport),
    true,
    JSON.stringify(validateOutput.errors),
  );
});
