import assert from "node:assert/strict";
import test from "node:test";

import {
  FIXTURE_026_RSD_T02_PULSE_COST_KEYS,
  FIXTURE_026_RSD_T02_PULSE_PUBLIC_SEEDS,
  FIXTURE_026_RSD_T02_PULSE_REGISTRY,
  FIXTURE_026_RSD_T02_PULSE_SKIPPING_PERIODS_S,
  FIXTURE_026_RSD_T02_PULSE_WORLD_IDS,
  applyFixture026RsdT02PulseOuNoise,
  assertFixture026RsdT02PulseCostVector,
  assertFixture026RsdT02PulseRegistry,
  buildFixture026RsdT02PulseConstruction,
  buildFixture026RsdT02PulseSchedule,
  buildFixture026RsdT02RefractoryCoarsePeriods,
  buildFixture026RsdT02RefractoryRefinementPeriods,
  calibrateFixture026RsdT02IsolatedPulse,
  calibrateFixture026RsdT02PulseStep,
  constructFixture026RsdT02PeriodicPulseCell,
  constructFixture026RsdT02RefractoryDuration,
  constructFixture026RsdT02SkippingCell,
  evaluateFixture026RsdT02MixedWindows,
  evaluateFixture026RsdT02PeriodSkipping,
  evaluateFixture026RsdT02PulseEvents,
  evaluateFixture026RsdT02PulseFeedback,
  evaluateFixture026RsdT02PulseWorld,
  evaluateFixture026RsdT02RefractoryStabilization,
  fixture026RsdT02PulseStimulusAt,
  selectFixture026RsdT02RefractoryMaximizer,
} from "./rsd-t02-pulse.mjs";

const calibrationCache = new Map();

function calibrations(worldId) {
  if (!calibrationCache.has(worldId)) {
    const step = calibrateFixture026RsdT02PulseStep(worldId);
    const isolated = calibrateFixture026RsdT02IsolatedPulse(worldId, 0.20, {
      step_calibration: step,
    });
    calibrationCache.set(worldId, { step, isolated });
  }
  return calibrationCache.get(worldId);
}

test("the disjoint pulse registry freezes six worlds, source bounds, and NO_RESULT", () => {
  assert.equal(
    assertFixture026RsdT02PulseRegistry(FIXTURE_026_RSD_T02_PULSE_REGISTRY),
    FIXTURE_026_RSD_T02_PULSE_REGISTRY,
  );
  assert.deepEqual(
    FIXTURE_026_RSD_T02_PULSE_REGISTRY.worlds.map(({ world_id: id }) => id),
    FIXTURE_026_RSD_T02_PULSE_WORLD_IDS,
  );
  assert.equal(FIXTURE_026_RSD_T02_PULSE_REGISTRY.claim, "C-1561");
  assert.equal(FIXTURE_026_RSD_T02_PULSE_REGISTRY.result_label, "NO_RESULT");
  assert.equal(FIXTURE_026_RSD_T02_PULSE_REGISTRY.comparison_authority, false);
  assert.equal(
    FIXTURE_026_RSD_T02_PULSE_REGISTRY.numerics.cadence_role,
    "project-machine-convention-not-source-established",
  );
  assert.equal(
    FIXTURE_026_RSD_T02_PULSE_REGISTRY.mixed_window_contract,
    "unresolved-until-window-starts-or-widths-are-frozen",
  );

  const construction = buildFixture026RsdT02PulseConstruction(
    FIXTURE_026_RSD_T02_PULSE_PUBLIC_SEEDS[0],
  );
  assert.equal(construction.result_label, "NO_RESULT");
  assert.equal(construction.claim_eligible, false);
  assert.equal(construction.mixed_window_statistic_status, "unresolved-contract");
  assert.deepEqual(construction.world_ids, FIXTURE_026_RSD_T02_PULSE_WORLD_IDS);
  assert.throws(
    () => buildFixture026RsdT02PulseConstruction("01"),
    /frozen public uint64 seed/u,
  );
  assert.throws(
    () => buildFixture026RsdT02PulseConstruction("18446744073709551616"),
    /frozen public uint64 seed/u,
  );
});

test("NFL1 and IFFL1 share the response equation and differ only in inhibitor drive", () => {
  const state = [0.2, 0.1];
  const stimulusU = 0.7;
  const nfl = evaluateFixture026RsdT02PulseWorld("PS-NFL-H4", state, stimulusU);
  const iffl = evaluateFixture026RsdT02PulseWorld("PS-IFFL-H4", state, stimulusU);
  assert.equal(nfl.derivative_u_per_s[0], iffl.derivative_u_per_s[0]);
  assert.equal(nfl.derivative_u_per_s[1], 0.2 - 0.3 * 0.1);
  assert.equal(iffl.derivative_u_per_s[1], 0.7 - 0.3 * 0.1);
  assert.equal(nfl.response_u, state[0]);
  assert.equal(nfl.output_dimensionless, state[0] ** 3);

  const deadTime = evaluateFixture026RsdT02PulseWorld("PS-DEADTIME", state, stimulusU);
  assert.deepEqual(deadTime, iffl);
  const lti = evaluateFixture026RsdT02PulseWorld("PS-NFL-LTI", [0.2, 0.1], 0.7)
    .derivative_u_per_s;
  assert.ok(Math.abs(lti[0] - 0.4) < 1e-15);
  assert.equal(lti[1], 0.05);
  assert.deepEqual(
    evaluateFixture026RsdT02PulseWorld("PS-MIXED", [0.2, 1, 0.1], 0.7)
      .derivative_u_per_s,
    [0.14799999999999996, 0.695, 0.18],
  );
});

test("square-pulse schedules are half-open and stop exactly at every edge", () => {
  const schedule = buildFixture026RsdT02PulseSchedule({
    duration_s: 0.2,
    period_s: 5,
    pulse_count: 3,
    start_time_s: 1,
  });
  assert.equal(fixture026RsdT02PulseStimulusAt(schedule, 0.999), 0);
  assert.equal(fixture026RsdT02PulseStimulusAt(schedule, 1), 1);
  assert.equal(fixture026RsdT02PulseStimulusAt(schedule, 1.199999), 1);
  assert.equal(fixture026RsdT02PulseStimulusAt(schedule, 1.2), 0);
  assert.equal(fixture026RsdT02PulseStimulusAt(schedule, 6), 1);
  assert.equal(fixture026RsdT02PulseStimulusAt(schedule, 16), 0);
  assert.throws(
    () => buildFixture026RsdT02PulseSchedule({ duration_s: 5, period_s: 5, pulse_count: 1 }),
    /requires 0 < d < T/u,
  );
});

test("step and isolated-pulse construction enforce adaptation, duration, event, and recovery gates", () => {
  const nfl = calibrations("PS-NFL-H4");
  const iffl = calibrations("PS-IFFL-H4");
  assert.equal(nfl.step.status, "resolved");
  assert.equal(nfl.step.adaptation_gate, true);
  assert.ok(nfl.step.adaptation_time_s >= 0.19 && nfl.step.adaptation_time_s <= 0.20);
  assert.equal(iffl.step.adaptation_gate, true);
  assert.ok(iffl.step.adaptation_time_s < 0.04);
  for (const row of [nfl.isolated, iffl.isolated]) {
    assert.equal(row.status, "resolved");
    assert.equal(row.response_count, 1);
    assert.equal(row.missing_event, false);
    assert.ok(row.first_crossing_latency_s > 0);
    assert.equal(row.support.source_qualified, true);
    assert.equal(row.support.crossing_error_role, "diagnostic-bound-no-source-pass-threshold");
    assert.ok(row.recovery_scaled_residual <= 1e-8);
    assert.deepEqual(Object.keys(row.cost_vector), FIXTURE_026_RSD_T02_PULSE_COST_KEYS);
    assert.equal(assertFixture026RsdT02PulseCostVector(row.cost_vector), row.cost_vector);
    assert.equal(row.result_label, "NO_RESULT");
  }

  const shortNfl = calibrateFixture026RsdT02IsolatedPulse("PS-NFL-H4", 0.20, {
    step_calibration: nfl.step,
    require_refractory_duration: true,
  });
  assert.equal(shortNfl.support.refractory_duration_gate, false);
  assert.equal(shortNfl.support.source_qualified, false);
  const eligibleNfl = calibrateFixture026RsdT02IsolatedPulse("PS-NFL-H4", 0.30, {
    step_calibration: nfl.step,
    require_refractory_duration: true,
  });
  assert.equal(eligibleNfl.support.refractory_duration_gate, true);
});

test("the protected nonlinear NFL cell has q=2 skipping while its IFFL rival is q=1", () => {
  const nflCalibration = calibrations("PS-NFL-H4");
  for (const periodS of FIXTURE_026_RSD_T02_PULSE_SKIPPING_PERIODS_S) {
    const cell = constructFixture026RsdT02SkippingCell("PS-NFL-H4", periodS, {
      step_calibration: nflCalibration.step,
      isolated_calibration: nflCalibration.isolated,
    });
    assert.equal(cell.periodic_cell.status, "resolved");
    assert.equal(cell.periodic_cell.convergence.order_agreement, true);
    assert.equal(cell.skipping_signature.status, "supported");
    assert.equal(cell.skipping_signature.recurrence_order, 2);
    assert.deepEqual(cell.skipping_signature.event_word, [0, 1]);
    assert.equal(cell.skipping_signature.repeated_blocks, 4);
    assert.equal(cell.skipping_signature.missing_latency_encoding, "null-not-zero");
    assert.equal(cell.feedback_support.status, "unresolved");
    assert.equal(cell.feedback_support.reason, "rival-certificate-pending");
    assert.equal(cell.result_label, "NO_RESULT");
  }

  const ifflCalibration = calibrations("PS-IFFL-H4");
  const rival = constructFixture026RsdT02SkippingCell("PS-IFFL-H4", 5, {
    step_calibration: ifflCalibration.step,
    isolated_calibration: ifflCalibration.isolated,
  });
  assert.equal(rival.skipping_signature.status, "absent");
  assert.equal(rival.skipping_signature.recurrence_order, 1);
  assert.equal(rival.feedback_support.status, "unresolved");
  assert.equal(rival.feedback_support.reason, "absence-is-not-feed-forward-evidence");
});

test("signature-negative feedback, dead time, aliasing, and mixed windows fail closed", () => {
  const ltiCalibration = calibrations("PS-NFL-LTI");
  const lti = constructFixture026RsdT02SkippingCell("PS-NFL-LTI", 5, {
    step_calibration: ltiCalibration.step,
    isolated_calibration: ltiCalibration.isolated,
  });
  assert.equal(lti.skipping_signature.status, "absent");
  assert.equal(lti.feedback_support.status, "unresolved");
  assert.equal(lti.feedback_support.forced_feed_forward_attribution, false);

  const samples = [];
  for (let pulseIndex = 0; pulseIndex < 4; pulseIndex += 1) {
    samples.push({ time_s: pulseIndex * 5, response_u: 0 });
    samples.push({ time_s: pulseIndex * 5 + 0.1, response_u: 1 });
    samples.push({ time_s: (pulseIndex + 1) * 5, response_u: 0 });
  }
  const direct = evaluateFixture026RsdT02PulseEvents({
    samples,
    threshold_u: 0.5,
    period_s: 5,
    pulse_count: 4,
  });
  assert.deepEqual(direct.intervals.map((row) => row.upward_crossing_count), [1, 1, 1, 1]);
  const deadTime = evaluateFixture026RsdT02PulseEvents({
    samples,
    threshold_u: 0.5,
    period_s: 5,
    pulse_count: 4,
    observation_mode: "dead-time-1.5T",
  });
  assert.deepEqual(deadTime.intervals.map((row) => row.upward_crossing_count), [1, 0, 1, 0]);
  assert.equal(deadTime.observation_support, false);
  const alias = evaluateFixture026RsdT02PulseEvents({
    samples,
    threshold_u: 0.5,
    period_s: 5,
    pulse_count: 4,
    observation_mode: "one-sample-per-period-fixed-phase",
  });
  assert.equal(alias.recoverable, false);
  assert.equal(alias.response_count, null);
  assert.ok(alias.intervals.every((row) => row.first_crossing_latency_s === null));

  const mixed = evaluateFixture026RsdT02MixedWindows();
  assert.equal(mixed.status, "unresolved");
  assert.equal(mixed.topology_disposition, "mixed/window-qualified");
  assert.equal(mixed.exclusive_topology_allowed, false);
});

test("refractory maximizer intervals, refinement, and two-consecutive-slope gates are explicit", () => {
  const peaked = [
    { status: "resolved", period_s: 1, mean_output_dimensionless: 0, mean_output_error_bound: 0 },
    { status: "resolved", period_s: 2, mean_output_dimensionless: 1, mean_output_error_bound: 0.01 },
    { status: "resolved", period_s: 3, mean_output_dimensionless: 0, mean_output_error_bound: 0 },
  ];
  const maximum = selectFixture026RsdT02RefractoryMaximizer(peaked);
  assert.equal(maximum.status, "qualified");
  assert.deepEqual(maximum.interval_s, [2, 2]);
  const refinements = buildFixture026RsdT02RefractoryRefinementPeriods(peaked);
  assert.ok(refinements.includes(1.01));
  assert.ok(refinements.includes(2.99));
  assert.ok(!refinements.includes(2));

  const boundary = selectFixture026RsdT02RefractoryMaximizer([
    { status: "resolved", period_s: 1, mean_output_dimensionless: 1, mean_output_error_bound: 0 },
    { status: "resolved", period_s: 2, mean_output_dimensionless: 0, mean_output_error_bound: 0 },
    { status: "resolved", period_s: 3, mean_output_dimensionless: 0, mean_output_error_bound: 0 },
  ]);
  assert.equal(boundary.status, "unresolved");
  assert.equal(boundary.reason, "maximizer-touches-search-boundary");

  const support = { source_qualified: true };
  const stableRows = [0.3, 0.5, 1, 1.5].map((durationS) => ({
    duration_s: durationS,
    support,
    maximizer: { status: "qualified", interval_s: [5, 5.01] },
  }));
  const stable = evaluateFixture026RsdT02RefractoryStabilization(stableRows);
  assert.equal(stable.status, "supported");
  assert.ok(stable.longest_consecutive_passing_secants >= 2);

  const risingRows = [0.3, 0.5, 1, 1.5].map((durationS) => ({
    duration_s: durationS,
    support,
    maximizer: { status: "qualified", interval_s: [2 * durationS, 2 * durationS] },
  }));
  assert.equal(evaluateFixture026RsdT02RefractoryStabilization(risingRows).status, "absent");
  const ambiguousRows = [0.3, 0.5, 0.7, 0.9].map((durationS) => ({
    duration_s: durationS,
    support,
    maximizer: { status: "qualified", interval_s: [5, 5.2] },
  }));
  assert.equal(
    evaluateFixture026RsdT02RefractoryStabilization(ambiguousRows).status,
    "unresolved",
  );
  stableRows[1] = { ...stableRows[1], support: { source_qualified: false } };
  assert.equal(evaluateFixture026RsdT02RefractoryStabilization(stableRows).status, "unresolved");

  const coarse = buildFixture026RsdT02RefractoryCoarsePeriods(0.3);
  assert.equal(coarse[0], 0.5);
  assert.equal(coarse.at(-1), 39.9);
  assert.ok(coarse.every((periodS) => periodS > 0.3 && periodS <= 40));
});

test("one complete NFL refractory duration executes the frozen coarse-to-refined path", {
  timeout: 30_000,
}, async () => {
  const { step } = calibrations("PS-NFL-H4");
  const row = await constructFixture026RsdT02RefractoryDuration("PS-NFL-H4", 0.30, {
    step_calibration: step,
  });
  assert.equal(row.support.source_qualified, true);
  assert.equal(row.coarse_cell_count, 198);
  assert.equal(row.refinement_cell_count, 38);
  assert.equal(row.maximizer.status, "qualified");
  assert.deepEqual(row.maximizer.interval_s, [16.72, 16.72]);
  assert.equal(row.maximizer.descriptive_largest_period_s, 16.72);
  assert.ok(row.maximizer.interval_s[0] > 0.5 && row.maximizer.interval_s[1] < 39.9);
  assert.equal(row.result_label, "NO_RESULT");
  assert.equal(row.claim_eligible, false);
  assert.equal(row.shared_step_cost_included, false);
  assert.equal(Object.hasOwn(row, "refractory_signature"), false);
  assert.equal(row.cost_vector.pulse_cells, 474);
  assert.ok(row.cost_vector.solver_evaluations > 0);
  assert.ok(row.cost_vector.solver_evaluations < 100_000_000);
  assert.ok(row.cost_vector.simulated_seconds < 310_000);
  assert.ok(row.cost_vector.sample_rows < 5_000_000);
  assert.equal(row.cost_vector.tuning_trials, 0);
  assert.equal(row.cost_vector.wall_seconds, null);
  assert.equal(row.cost_vector.later_joules, null);
});

test("nonconvergence remains an explicit NO_RESULT instead of a deleted cell", () => {
  const periodic = constructFixture026RsdT02PeriodicPulseCell("PS-NFL-H4", {
    duration_s: 0.2,
    period_s: 20_001,
    reference_threshold_u: 0.01,
  });
  assert.equal(periodic.status, "unresolved");
  assert.match(periodic.reason, /nonconverged/u);
  assert.equal(periodic.result_label, "NO_RESULT");
  assert.equal(periodic.claim_eligible, false);
  assert.equal(evaluateFixture026RsdT02PeriodSkipping(periodic).status, "unresolved");
});

test("the public OU diagnostic is seed-repeatable and cannot promote authority", () => {
  const samples = Array.from({ length: 12 }, (_, index) => ({
    time_s: index * 0.01,
    response_u: index / 10,
  }));
  const options = {
    seed: FIXTURE_026_RSD_T02_PULSE_PUBLIC_SEEDS[7],
    isolated_amplitude_u: 0.2,
    sigma_ratio: 0.05,
  };
  const left = applyFixture026RsdT02PulseOuNoise(samples, options);
  const right = applyFixture026RsdT02PulseOuNoise(samples, options);
  assert.deepEqual(left, right);
  const different = applyFixture026RsdT02PulseOuNoise(samples, {
    ...options,
    seed: FIXTURE_026_RSD_T02_PULSE_PUBLIC_SEEDS[8],
  });
  assert.notDeepEqual(
    left.map(({ observation_noise_u: value }) => value),
    different.map(({ observation_noise_u: value }) => value),
  );
  assert.ok(left.every((row) => row.observation_role === "public-development-diagnostic-only"));
});

test("feedback support is one-sided and exposes false-attribution falsification", () => {
  const absent = evaluateFixture026RsdT02PulseFeedback({
    world_id: "PS-NFL-H4",
    refractory_signature: "absent",
    skipping_signature: "absent",
    rival_certified: true,
  });
  assert.equal(absent.status, "unresolved");
  assert.equal(absent.reason, "absence-is-not-feed-forward-evidence");

  const falseAttribution = evaluateFixture026RsdT02PulseFeedback({
    world_id: "PS-IFFL-H4",
    refractory_signature: "supported",
    skipping_signature: "absent",
    rival_certified: true,
  });
  assert.equal(falseAttribution.status, "supported");
  assert.equal(falseAttribution.false_feedback_attribution, true);
  assert.equal(falseAttribution.result_label, "NO_RESULT");

  const mixed = evaluateFixture026RsdT02PulseFeedback({
    world_id: "PS-MIXED",
    refractory_signature: "supported",
    skipping_signature: "supported",
    rival_certified: true,
  });
  assert.equal(mixed.status, "out_of_support");
  assert.equal(mixed.topology_disposition, "mixed/window-qualified");
});
