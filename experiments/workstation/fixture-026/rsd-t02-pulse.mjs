const UINT64_MAX = 0xffff_ffff_ffff_ffffn;
const MASK_64 = UINT64_MAX;

export const FIXTURE_026_RSD_T02_PULSE_VERSION = "fixture-026.rsd-t02-pulse.v1";
export const FIXTURE_026_RSD_T02_PULSE_INTERPRETATION = "NO_RESULT: deterministic public-development construction of source-bounded repeated-stimulus signatures only; no actionable estimator, comparison, confirmation result, performance result, or energy result.";

export const FIXTURE_026_RSD_T02_PULSE_WORLD_IDS = Object.freeze([
  "PS-NFL-H4",
  "PS-IFFL-H4",
  "PS-NFL-LTI",
  "PS-MIXED",
  "PS-DEADTIME",
  "PS-ALIAS",
]);

export const FIXTURE_026_RSD_T02_PULSE_REFRACTORY_DURATIONS_S = Object.freeze([
  0.30, 0.50, 1.00, 1.50, 2.00, 3.00,
]);

export const FIXTURE_026_RSD_T02_PULSE_SKIPPING_PERIODS_S = Object.freeze([
  5.00, 5.20, 5.40,
]);

export const FIXTURE_026_RSD_T02_PULSE_PUBLIC_SEEDS = Object.freeze(
  Array.from({ length: 64 }, (_, index) => String(1_561_000 + index)),
);

export const FIXTURE_026_RSD_T02_PULSE_COST_KEYS = Object.freeze([
  "pulse_cells",
  "stimulus_count",
  "response_count",
  "simulated_seconds",
  "sample_rows",
  "serialized_bytes",
  "solver_evaluations",
  "scalar_operations",
  "retained_state_bytes",
  "parameter_bytes",
  "tuning_trials",
  "wall_seconds",
  "later_joules",
  "evaluator_state_comparisons",
]);

const WORLD_ROWS = [
  {
    world_id: "PS-NFL-H4",
    plant_id: "PS-NFL-H4",
    equation_family: "Rahi-NFL-1-Hill",
    source_role: "source-shaped protected plant",
    response_drives_inhibitor: "present",
    observation_mode: "direct",
    concentration_qualified: true,
    state_dimension: 2,
    parameter_bytes: 40,
  },
  {
    world_id: "PS-IFFL-H4",
    plant_id: "PS-IFFL-H4",
    equation_family: "Rahi-IFFL-1-Hill",
    source_role: "source-shaped pure feed-forward rival",
    response_drives_inhibitor: "absent",
    observation_mode: "direct",
    concentration_qualified: true,
    state_dimension: 2,
    parameter_bytes: 40,
  },
  {
    world_id: "PS-NFL-LTI",
    plant_id: "PS-NFL-LTI",
    equation_family: "linear-integral-feedback-control",
    source_role: "signature-negative project control",
    response_drives_inhibitor: "present",
    observation_mode: "direct",
    concentration_qualified: false,
    state_dimension: 2,
    parameter_bytes: 16,
  },
  {
    world_id: "PS-MIXED",
    plant_id: "PS-MIXED",
    equation_family: "Rahi-parallel-slow-IFFL-fast-NFL",
    source_role: "source mixed-path counterworld",
    response_drives_inhibitor: "mixed",
    observation_mode: "direct",
    concentration_qualified: true,
    state_dimension: 3,
    parameter_bytes: 48,
  },
  {
    world_id: "PS-DEADTIME",
    plant_id: "PS-IFFL-H4",
    equation_family: "Rahi-IFFL-1-Hill",
    source_role: "project observation-recovery hostile",
    response_drives_inhibitor: "absent",
    observation_mode: "dead-time-1.5T",
    concentration_qualified: true,
    state_dimension: 2,
    parameter_bytes: 40,
  },
  {
    world_id: "PS-ALIAS",
    plant_id: "PS-IFFL-H4",
    equation_family: "Rahi-IFFL-1-Hill",
    source_role: "project temporal-alias hostile",
    response_drives_inhibitor: "absent",
    observation_mode: "one-sample-per-period-fixed-phase",
    concentration_qualified: true,
    state_dimension: 2,
    parameter_bytes: 40,
  },
];

function deepFreeze(value) {
  if (value && typeof value === "object" && !Object.isFrozen(value)) {
    Object.freeze(value);
    for (const nested of Object.values(value)) deepFreeze(nested);
  }
  return value;
}

export const FIXTURE_026_RSD_T02_PULSE_REGISTRY = deepFreeze({
  version: FIXTURE_026_RSD_T02_PULSE_VERSION,
  artifact: "fixture-026",
  track: "RSD-T02-PULSE",
  claim: "C-1561",
  partition: "public-development",
  authority: "construction-only",
  comparison_authority: false,
  result_label: "NO_RESULT",
  worlds: WORLD_ROWS,
  protected_parameters: {
    tau_r_s: 1,
    hill_n: 4,
    inhibitor_scale_u: 0.01,
    inhibitor_decay_per_tau_r: 0.3,
    output_power: 3,
  },
  refractory: {
    durations_s: FIXTURE_026_RSD_T02_PULSE_REFRACTORY_DURATIONS_S,
    coarse_period_increment_s: 0.20,
    upper_period_s: 40.00,
    refinement_increment_s: 0.01,
    averaging_cycles: 20,
    stabilization_slope_upper_bound: 0.5,
    consecutive_passing_secants: 2,
  },
  skipping: {
    duration_s: 0.20,
    periods_s: FIXTURE_026_RSD_T02_PULSE_SKIPPING_PERIODS_S,
    recurrence_orders: [1, 2, 3, 4, 5],
    recurrence_upper_bound: 1e-10,
    period_one_lower_bound: 1e-8,
    repeated_blocks: 4,
  },
  support: {
    step_horizon_s: 200,
    step_adaptation_strict_lower_bound: 0.80,
    refractory_duration_to_peak_factor: 1.5,
    isolated_washout_s: 100,
    off_state_scaled_upper_bound: 1e-8,
    event_threshold_fraction: 0.25,
    sensitivity_threshold_fractions: [0.15, 0.35],
    amplitude_to_error_factor: 5,
  },
  numerics: {
    representation: "IEEE-754 binary64 via Node/V8 Number",
    solver: "Dormand-Prince-5(4)",
    reference_absolute_tolerance_u: 1e-12,
    reference_relative_tolerance: 1e-10,
    refinement_factor: 0.5,
    exact_pulse_edge_stops: true,
    time_cap_s_per_cell: 20_000,
    waveform_samples_per_period: 512,
    step_peak_dense_cadence_s: 0.001,
    isolated_dense_cadence_s: 0.002,
    maximum_adaptive_step_s: 0.25,
    cadence_role: "project-machine-convention-not-source-established",
    negative_concentration_policy: "fail-on-any-negative-accepted-endpoint",
  },
  robustness: {
    ou_correlation_time_s: 0.05,
    stationary_sigma_over_isolated_amplitude: [0.01, 0.05, 0.10],
    seeds: FIXTURE_026_RSD_T02_PULSE_PUBLIC_SEEDS,
    rng: "SplitMix64-plus-Box-Muller-project-machine-convention",
    role: "development-diagnostic-only",
  },
  mixed_window_ends_s: [50, 150, 250, 350],
  mixed_window_contract: "unresolved-until-window-starts-or-widths-are-frozen",
  cost_vector_keys: FIXTURE_026_RSD_T02_PULSE_COST_KEYS,
  interpretation: FIXTURE_026_RSD_T02_PULSE_INTERPRETATION,
});

const WORLD_BY_ID = new Map(WORLD_ROWS.map((row) => [row.world_id, row]));

function exactKeys(value, keys) {
  return value
    && typeof value === "object"
    && !Array.isArray(value)
    && Object.keys(value).length === keys.length
    && keys.every((key) => Object.hasOwn(value, key));
}

function worldFor(worldId) {
  const world = WORLD_BY_ID.get(worldId);
  if (!world) throw new RangeError(`Unknown Fixture 026 RSD-T02-PULSE world: ${worldId}`);
  return world;
}

function canonicalUint64Seed(seed) {
  return typeof seed === "string"
    && /^(0|[1-9][0-9]{0,19})$/u.test(seed)
    && BigInt(seed) <= UINT64_MAX;
}

function finitePositive(value, label) {
  if (!Number.isFinite(value) || value <= 0) throw new TypeError(`${label} must be positive.`);
}

function finiteNonnegative(value, label) {
  if (!Number.isFinite(value) || value < 0) throw new TypeError(`${label} must be nonnegative.`);
}

function noResultFields(authority = "construction-only") {
  return {
    partition: "public-development",
    authority,
    comparison_inference_permitted: false,
    claim_eligible: false,
    result_label: "NO_RESULT",
    no_result: true,
    interpretation: FIXTURE_026_RSD_T02_PULSE_INTERPRETATION,
  };
}

function costVector({
  pulseCells = 0,
  stimulusCount = 0,
  responseCount = 0,
  simulatedSeconds = 0,
  sampleRows = 0,
  solverEvaluations = 0,
  retainedStateBytes = 0,
  parameterBytes = 0,
  evaluatorStateComparisons = 0,
} = {}) {
  return {
    pulse_cells: pulseCells,
    stimulus_count: stimulusCount,
    response_count: responseCount,
    simulated_seconds: simulatedSeconds,
    sample_rows: sampleRows,
    serialized_bytes: null,
    solver_evaluations: solverEvaluations,
    scalar_operations: null,
    retained_state_bytes: retainedStateBytes,
    parameter_bytes: parameterBytes,
    tuning_trials: 0,
    wall_seconds: null,
    later_joules: null,
    evaluator_state_comparisons: evaluatorStateComparisons,
  };
}

function addCosts(...costs) {
  const present = costs.filter(Boolean);
  return costVector({
    pulseCells: present.reduce((sum, row) => sum + row.pulse_cells, 0),
    stimulusCount: present.reduce((sum, row) => sum + row.stimulus_count, 0),
    responseCount: present.reduce((sum, row) => sum + row.response_count, 0),
    simulatedSeconds: present.reduce((sum, row) => sum + row.simulated_seconds, 0),
    sampleRows: present.reduce((sum, row) => sum + row.sample_rows, 0),
    solverEvaluations: present.reduce((sum, row) => sum + row.solver_evaluations, 0),
    retainedStateBytes: Math.max(0, ...present.map((row) => row.retained_state_bytes)),
    parameterBytes: Math.max(0, ...present.map((row) => row.parameter_bytes)),
    evaluatorStateComparisons: present.reduce(
      (sum, row) => sum + row.evaluator_state_comparisons,
      0,
    ),
  });
}

export function assertFixture026RsdT02PulseCostVector(cost) {
  if (!exactKeys(cost, FIXTURE_026_RSD_T02_PULSE_COST_KEYS)) {
    throw new Error("Fixture 026 RSD-T02-PULSE cost vector has missing or unknown fields.");
  }
  const integerKeys = [
    "pulse_cells", "stimulus_count", "response_count", "sample_rows",
    "solver_evaluations", "retained_state_bytes", "parameter_bytes",
    "tuning_trials", "evaluator_state_comparisons",
  ];
  if (
    integerKeys.some((key) => !Number.isSafeInteger(cost[key]) || cost[key] < 0)
    || !Number.isFinite(cost.simulated_seconds)
    || cost.simulated_seconds < 0
    || cost.serialized_bytes !== null
    || cost.scalar_operations !== null
    || cost.tuning_trials !== 0
    || cost.wall_seconds !== null
    || cost.later_joules !== null
  ) throw new Error("Fixture 026 RSD-T02-PULSE cost vector violates its typed boundary.");
  return cost;
}

export function assertFixture026RsdT02PulseRegistry(registry) {
  if (
    registry !== FIXTURE_026_RSD_T02_PULSE_REGISTRY
    || registry.worlds.length !== 6
    || registry.worlds.some((world, index) => world.world_id !== FIXTURE_026_RSD_T02_PULSE_WORLD_IDS[index])
    || registry.result_label !== "NO_RESULT"
    || registry.comparison_authority !== false
    || registry.mixed_window_contract !== "unresolved-until-window-starts-or-widths-are-frozen"
  ) throw new Error("Fixture 026 RSD-T02-PULSE registry differs from its closed v1 object.");
  return registry;
}

export function buildFixture026RsdT02PulseConstruction(seed = FIXTURE_026_RSD_T02_PULSE_PUBLIC_SEEDS[0]) {
  if (!canonicalUint64Seed(seed) || !FIXTURE_026_RSD_T02_PULSE_PUBLIC_SEEDS.includes(seed)) {
    throw new TypeError("Fixture 026 RSD-T02-PULSE construction seed must be a frozen public uint64 seed.");
  }
  return deepFreeze({
    schema: 1,
    contract_version: FIXTURE_026_RSD_T02_PULSE_VERSION,
    artifact: "fixture-026",
    track: "RSD-T02-PULSE",
    claim: "C-1561",
    seed,
    world_ids: [...FIXTURE_026_RSD_T02_PULSE_WORLD_IDS],
    refractory_duration_s: [...FIXTURE_026_RSD_T02_PULSE_REFRACTORY_DURATIONS_S],
    skipping_cells: FIXTURE_026_RSD_T02_PULSE_SKIPPING_PERIODS_S.map((periodS) => ({
      duration_s: 0.20,
      period_s: periodS,
    })),
    mixed_window_ends_s: [...FIXTURE_026_RSD_T02_PULSE_REGISTRY.mixed_window_ends_s],
    mixed_window_statistic_status: "unresolved-contract",
    ...noResultFields(),
  });
}

export function buildFixture026RsdT02PulseSchedule({
  duration_s: durationS,
  period_s: periodS,
  pulse_count: pulseCount,
  start_time_s: startTimeS = 0,
}) {
  finitePositive(durationS, "Fixture 026 RSD-T02-PULSE duration");
  finitePositive(periodS, "Fixture 026 RSD-T02-PULSE period");
  finiteNonnegative(startTimeS, "Fixture 026 RSD-T02-PULSE start time");
  if (durationS >= periodS) throw new RangeError("Fixture 026 RSD-T02-PULSE requires 0 < d < T.");
  if (!Number.isSafeInteger(pulseCount) || pulseCount < 1) {
    throw new TypeError("Fixture 026 RSD-T02-PULSE pulse count must be a positive integer.");
  }
  return Object.freeze({
    kind: "half-open-periodic-square-pulse",
    low_u: 0,
    high_u: 1,
    duration_s: durationS,
    period_s: periodS,
    pulse_count: pulseCount,
    start_time_s: startTimeS,
    stop_time_s: startTimeS + pulseCount * periodS,
    units: { stimulus: "U", time: "s" },
  });
}

export function fixture026RsdT02PulseStimulusAt(schedule, timeS) {
  if (!Number.isFinite(timeS)) throw new TypeError("Fixture 026 RSD-T02-PULSE time must be finite.");
  if (timeS < schedule.start_time_s || timeS >= schedule.stop_time_s) return schedule.low_u;
  const pulseIndex = Math.floor((timeS - schedule.start_time_s) / schedule.period_s);
  const pulseEndS = schedule.start_time_s
    + pulseIndex * schedule.period_s
    + schedule.duration_s;
  return timeS < pulseEndS ? schedule.high_u : schedule.low_u;
}

export function evaluateFixture026RsdT02PulseWorld(worldId, state, stimulusU) {
  const world = worldFor(worldId);
  const plant = worldFor(world.plant_id);
  if (
    !Array.isArray(state)
    || state.length !== plant.state_dimension
    || state.some((value) => !Number.isFinite(value))
  ) throw new TypeError("Fixture 026 RSD-T02-PULSE state is invalid for its plant.");
  if (!Number.isFinite(stimulusU) || stimulusU < 0) {
    throw new TypeError("Fixture 026 RSD-T02-PULSE stimulus must be finite and nonnegative.");
  }
  if (plant.plant_id === "PS-NFL-H4" || plant.plant_id === "PS-IFFL-H4") {
    const [responseU, inhibitorU] = state;
    const { hill_n: hillN, inhibitor_scale_u: inhibitorScaleU } =
      FIXTURE_026_RSD_T02_PULSE_REGISTRY.protected_parameters;
    const drive = stimulusU / (1 + (inhibitorU / inhibitorScaleU) ** hillN);
    return {
      derivative_u_per_s: [
        drive - responseU,
        (plant.plant_id === "PS-NFL-H4" ? responseU : stimulusU)
          - 0.3 * inhibitorU,
      ],
      response_u: responseU,
      output_dimensionless: responseU ** 3,
    };
  }
  if (plant.plant_id === "PS-NFL-LTI") {
    const [responseU, inhibitorU] = state;
    return {
      derivative_u_per_s: [stimulusU - responseU - inhibitorU, responseU / 4],
      response_u: responseU,
      output_dimensionless: responseU,
    };
  }
  if (plant.plant_id === "PS-MIXED") {
    const [responseU, slowInputInhibitor, fastResponseInhibitor] = state;
    return {
      derivative_u_per_s: [
        stimulusU / (1 + fastResponseInhibitor / 0.1)
          - (1 + 0.01 * slowInputInhibitor) * responseU,
        stimulusU - slowInputInhibitor / 200,
        responseU - 0.2 * fastResponseInhibitor,
      ],
      response_u: responseU,
      output_dimensionless: responseU ** 3,
    };
  }
  throw new Error("Fixture 026 RSD-T02-PULSE world registry is incomplete.");
}

function initialState(worldId) {
  return Array(worldFor(worldFor(worldId).plant_id).state_dimension).fill(0);
}

function stateDistance(left, right) {
  let distance = 0;
  for (let index = 0; index < left.length; index += 1) {
    const scale = Math.max(1, Math.abs(left[index]), Math.abs(right[index]));
    distance = Math.max(distance, Math.abs(left[index] - right[index]) / scale);
  }
  return distance;
}

function addCombination(state, stepS, terms) {
  return state.map((value, index) => value + stepS * terms.reduce(
    (sum, [coefficient, derivative]) => sum + coefficient * derivative[index],
    0,
  ));
}

const DOPRI_B5 = [35 / 384, 0, 500 / 1113, 125 / 192, -2187 / 6784, 11 / 84, 0];
const DOPRI_B4 = [
  5179 / 57600, 0, 7571 / 16695, 393 / 640,
  -92097 / 339200, 187 / 2100, 1 / 40,
];

function dopriAttempt(worldId, state, stepS, stimulusU) {
  const observations = [];
  const evaluate = (candidate) => {
    const observation = evaluateFixture026RsdT02PulseWorld(worldId, candidate, stimulusU);
    observations.push(observation);
    return observation.derivative_u_per_s;
  };
  const k1 = evaluate(state);
  const k2 = evaluate(addCombination(state, stepS, [[1 / 5, k1]]));
  const k3 = evaluate(addCombination(state, stepS, [[3 / 40, k1], [9 / 40, k2]]));
  const k4 = evaluate(addCombination(state, stepS, [
    [44 / 45, k1], [-56 / 15, k2], [32 / 9, k3],
  ]));
  const k5 = evaluate(addCombination(state, stepS, [
    [19372 / 6561, k1], [-25360 / 2187, k2], [64448 / 6561, k3], [-212 / 729, k4],
  ]));
  const k6 = evaluate(addCombination(state, stepS, [
    [9017 / 3168, k1], [-355 / 33, k2], [46732 / 5247, k3],
    [49 / 176, k4], [-5103 / 18656, k5],
  ]));
  const k7State = addCombination(state, stepS, [
    [35 / 384, k1], [500 / 1113, k3], [125 / 192, k4],
    [-2187 / 6784, k5], [11 / 84, k6],
  ]);
  const k7 = evaluate(k7State);
  const derivatives = [k1, k2, k3, k4, k5, k6, k7];
  const fifth = addCombination(
    state,
    stepS,
    DOPRI_B5.map((coefficient, index) => [coefficient, derivatives[index]]),
  );
  const fourth = addCombination(
    state,
    stepS,
    DOPRI_B4.map((coefficient, index) => [coefficient, derivatives[index]]),
  );
  const integral = stepS * DOPRI_B5.reduce(
    (sum, coefficient, index) => sum + coefficient * observations[index].output_dimensionless,
    0,
  );
  return { fifth, fourth, integral, evaluations: 7 };
}

function integrateConstant(worldId, state, spanS, stimulusU, solver) {
  if (spanS === 0) {
    return { status: "converged", state: [...state], integral: 0, evaluations: 0, accepted: 0 };
  }
  finitePositive(spanS, "Fixture 026 RSD-T02-PULSE integration span");
  const world = worldFor(worldId);
  const plant = worldFor(world.plant_id);
  let elapsedS = 0;
  let current = [...state];
  let stepS = Math.min(0.01, solver.max_step_s, spanS);
  let integral = 0;
  let evaluations = 0;
  let accepted = 0;
  let attempts = 0;
  while (elapsedS < spanS) {
    attempts += 1;
    if (attempts > 1_000_000) {
      return { status: "solver_failure", state: current, integral, evaluations, accepted };
    }
    stepS = Math.min(stepS, spanS - elapsedS);
    const attempt = dopriAttempt(plant.plant_id, current, stepS, stimulusU);
    evaluations += attempt.evaluations;
    if (
      attempt.fifth.some((value) => !Number.isFinite(value))
      || !Number.isFinite(attempt.integral)
    ) return { status: "malformed", state: attempt.fifth, integral, evaluations, accepted };
    let errorNorm = 0;
    for (let index = 0; index < current.length; index += 1) {
      const scale = solver.absolute_tolerance_u
        + solver.relative_tolerance * Math.max(Math.abs(current[index]), Math.abs(attempt.fifth[index]));
      errorNorm = Math.max(errorNorm, Math.abs(attempt.fifth[index] - attempt.fourth[index]) / scale);
    }
    const acceptedStep = errorNorm <= 1;
    const factor = errorNorm === 0
      ? 5
      : Math.max(0.2, Math.min(5, 0.9 * errorNorm ** -0.2));
    if (acceptedStep) {
      current = attempt.fifth;
      elapsedS += stepS;
      integral += attempt.integral;
      accepted += 1;
      if (plant.concentration_qualified && current.some((value) => value < 0)) {
        return { status: "malformed-negative-concentration", state: current, integral, evaluations, accepted };
      }
    }
    stepS *= factor;
    if (stepS < 32 * Number.EPSILON * Math.max(1, spanS)) {
      return { status: "solver_failure", state: current, integral, evaluations, accepted };
    }
  }
  return { status: "converged", state: current, integral, evaluations, accepted };
}

function referenceSolver(refined = false) {
  const factor = refined ? 0.5 : 1;
  return {
    absolute_tolerance_u: 1e-12 * factor,
    relative_tolerance: 1e-10 * factor,
    max_step_s: FIXTURE_026_RSD_T02_PULSE_REGISTRY.numerics.maximum_adaptive_step_s,
  };
}

function uniqueSortedTimes(times) {
  const sorted = [...new Set(times.map((value) => Number(value.toPrecision(15))))]
    .sort((left, right) => left - right);
  if (sorted[0] !== 0) sorted.unshift(0);
  return sorted;
}

function simulateAtTimes(worldId, times, inputAt, discontinuities, solver) {
  const requested = uniqueSortedTimes(times);
  const stops = uniqueSortedTimes([...requested, ...discontinuities]);
  const requestedKeys = new Set(requested.map((value) => value.toPrecision(15)));
  let state = initialState(worldId);
  let currentTimeS = 0;
  let evaluations = 0;
  let integral = 0;
  const samples = [];
  const append = (timeS) => {
    const observation = evaluateFixture026RsdT02PulseWorld(worldId, state, inputAt(timeS));
    samples.push({
      time_s: timeS,
      state: [...state],
      response_u: observation.response_u,
      output_dimensionless: observation.output_dimensionless,
    });
  };
  append(0);
  for (const stopS of stops.slice(1)) {
    const midpointS = currentTimeS + (stopS - currentTimeS) / 2;
    const integrated = integrateConstant(
      worldId,
      state,
      stopS - currentTimeS,
      inputAt(midpointS),
      solver,
    );
    evaluations += integrated.evaluations;
    integral += integrated.integral;
    state = integrated.state;
    currentTimeS = stopS;
    if (integrated.status !== "converged") {
      return { status: integrated.status, samples, state, evaluations, integral };
    }
    if (requestedKeys.has(stopS.toPrecision(15))) append(stopS);
  }
  return { status: "converged", samples, state, evaluations, integral };
}

function peakSummary(samples) {
  let peakIndex = 0;
  for (let index = 1; index < samples.length; index += 1) {
    if (samples[index].output_dimensionless > samples[peakIndex].output_dimensionless) peakIndex = index;
  }
  const peak = samples[peakIndex];
  const neighbors = [samples[peakIndex - 1], samples[peakIndex + 1]].filter(Boolean);
  return {
    peak_output: peak.output_dimensionless,
    peak_time_s: peak.time_s,
    cadence_output_bound: Math.max(
      0,
      ...neighbors.map((sample) => Math.abs(peak.output_dimensionless - sample.output_dimensionless)),
    ),
    cadence_time_bound_s: Math.max(
      0,
      ...neighbors.map((sample) => Math.abs(peak.time_s - sample.time_s) / 2),
    ),
  };
}

export function calibrateFixture026RsdT02PulseStep(worldId) {
  worldFor(worldId);
  const denseCadenceS = FIXTURE_026_RSD_T02_PULSE_REGISTRY.numerics.step_peak_dense_cadence_s;
  const times = [];
  for (let index = 0; index <= 5 / denseCadenceS; index += 1) times.push(index * denseCadenceS);
  for (let index = 1; index <= (200 - 5) / 0.05; index += 1) times.push(5 + index * 0.05);
  const inputAt = () => 1;
  const reference = simulateAtTimes(worldId, times, inputAt, [], referenceSolver(false));
  const refinement = simulateAtTimes(worldId, times, inputAt, [], referenceSolver(true));
  const world = worldFor(worldId);
  if (reference.status !== "converged" || refinement.status !== "converged") {
    return deepFreeze({
      world_id: worldId,
      status: "unresolved",
      reason: `step-${reference.status}-${refinement.status}`,
      adaptation_gate: false,
      cost_vector: assertFixture026RsdT02PulseCostVector(costVector({
        stimulusCount: 2,
        simulatedSeconds: 400,
        sampleRows: reference.samples.length + refinement.samples.length,
        solverEvaluations: reference.evaluations + refinement.evaluations,
        retainedStateBytes: world.state_dimension * 8,
        parameterBytes: world.parameter_bytes,
      })),
      ...noResultFields(),
    });
  }
  const left = peakSummary(reference.samples);
  const right = peakSummary(refinement.samples);
  const peakOutputError = Math.max(
    Math.abs(left.peak_output - right.peak_output),
    left.cadence_output_bound,
    right.cadence_output_bound,
  );
  const peakTimeErrorS = Math.abs(left.peak_time_s - right.peak_time_s)
    + Math.max(left.cadence_time_bound_s, right.cadence_time_bound_s);
  const steadyLeft = reference.samples.at(-1).output_dimensionless;
  const steadyRight = refinement.samples.at(-1).output_dimensionless;
  const steadyError = Math.abs(steadyLeft - steadyRight);
  const peakLower = Math.max(0, Math.min(left.peak_output, right.peak_output) - peakOutputError);
  const steadyUpper = Math.max(steadyLeft, steadyRight) + steadyError;
  const adaptationLower = peakLower > 0 ? 1 - steadyUpper / peakLower : Number.NEGATIVE_INFINITY;
  const cost = costVector({
    stimulusCount: 2,
    simulatedSeconds: 400,
    sampleRows: reference.samples.length + refinement.samples.length,
    solverEvaluations: reference.evaluations + refinement.evaluations,
    retainedStateBytes: world.state_dimension * 8,
    parameterBytes: world.parameter_bytes,
  });
  return deepFreeze({
    world_id: worldId,
    status: "resolved",
    step_horizon_s: 200,
    peak_output_dimensionless: right.peak_output,
    peak_output_error_bound: peakOutputError,
    adaptation_time_s: right.peak_time_s,
    adaptation_time_error_bound_s: peakTimeErrorS,
    late_output_dimensionless: steadyRight,
    late_output_error_bound: steadyError,
    adaptation_fraction_lower_bound: adaptationLower,
    adaptation_gate: adaptationLower > 0.80,
    peak_cadence_s: denseCadenceS,
    peak_cadence_role: "project-machine-convention-not-source-established",
    cost_vector: assertFixture026RsdT02PulseCostVector(cost),
    ...noResultFields(),
  });
}

function isolatedTimes(durationS) {
  const horizonS = durationS + 100;
  const cadenceS = FIXTURE_026_RSD_T02_PULSE_REGISTRY.numerics.isolated_dense_cadence_s;
  const denseEndS = Math.min(horizonS, Math.max(10, durationS + 5));
  const times = [];
  for (let index = 0; index <= Math.ceil(denseEndS / cadenceS); index += 1) {
    times.push(Math.min(denseEndS, index * cadenceS));
  }
  for (let timeS = denseEndS + 0.05; timeS < horizonS; timeS += 0.05) times.push(timeS);
  times.push(durationS, horizonS);
  return uniqueSortedTimes(times);
}

function responsePeakSummary(samples) {
  let peakIndex = 0;
  for (let index = 1; index < samples.length; index += 1) {
    if (samples[index].response_u > samples[peakIndex].response_u) peakIndex = index;
  }
  const peak = samples[peakIndex];
  const neighbors = [samples[peakIndex - 1], samples[peakIndex + 1]].filter(Boolean);
  return {
    amplitude_u: peak.response_u,
    sampling_bound_u: Math.max(0, ...neighbors.map(
      (sample) => Math.abs(peak.response_u - sample.response_u),
    )),
  };
}

function directCrossings(samples, thresholdU, startS = 0, endS = Number.POSITIVE_INFINITY) {
  const crossings = [];
  for (let index = 1; index < samples.length; index += 1) {
    const left = samples[index - 1];
    const right = samples[index];
    if (right.time_s <= startS || right.time_s > endS) continue;
    if (left.response_u < thresholdU && right.response_u >= thresholdU) {
      const fraction = (thresholdU - left.response_u) / (right.response_u - left.response_u);
      crossings.push({
        time_s: left.time_s + fraction * (right.time_s - left.time_s),
        bracket_width_s: right.time_s - left.time_s,
      });
    }
  }
  return crossings;
}

export function calibrateFixture026RsdT02IsolatedPulse(worldId, durationS, {
  step_calibration: stepCalibration = null,
  require_refractory_duration: requireRefractoryDuration = false,
} = {}) {
  finitePositive(durationS, "Fixture 026 RSD-T02-PULSE isolated duration");
  const world = worldFor(worldId);
  const step = stepCalibration ?? calibrateFixture026RsdT02PulseStep(worldId);
  const times = isolatedTimes(durationS);
  const inputAt = (timeS) => timeS < durationS ? 1 : 0;
  const reference = simulateAtTimes(worldId, times, inputAt, [durationS], referenceSolver(false));
  const refinement = simulateAtTimes(worldId, times, inputAt, [durationS], referenceSolver(true));
  const baseCost = costVector({
    pulseCells: 2,
    stimulusCount: 2,
    simulatedSeconds: 2 * (durationS + 100),
    sampleRows: reference.samples.length + refinement.samples.length,
    solverEvaluations: reference.evaluations + refinement.evaluations,
    retainedStateBytes: world.state_dimension * 8,
    parameterBytes: world.parameter_bytes,
  });
  if (reference.status !== "converged" || refinement.status !== "converged") {
    return deepFreeze({
      world_id: worldId,
      duration_s: durationS,
      status: "unresolved",
      reason: `isolated-${reference.status}-${refinement.status}`,
      support: { source_qualified: false, numerical_gate: false },
      cost_vector: assertFixture026RsdT02PulseCostVector(baseCost),
      ...noResultFields(),
    });
  }
  const leftPeak = responsePeakSummary(reference.samples);
  const rightPeak = responsePeakSummary(refinement.samples);
  const amplitudeErrorU = Math.max(
    Math.abs(leftPeak.amplitude_u - rightPeak.amplitude_u),
    leftPeak.sampling_bound_u,
    rightPeak.sampling_bound_u,
  );
  const leftThresholdU = 0.25 * leftPeak.amplitude_u;
  const rightThresholdU = 0.25 * rightPeak.amplitude_u;
  const leftCrossings = directCrossings(reference.samples, leftThresholdU, 0, durationS + 100);
  const rightCrossings = directCrossings(refinement.samples, rightThresholdU, 0, durationS + 100);
  const countAgreement = leftCrossings.length === rightCrossings.length;
  const latencyDisagreementS = countAgreement
    ? Math.max(0, ...leftCrossings.map((crossing, index) => (
      Math.abs(crossing.time_s - rightCrossings[index].time_s)
    )))
    : Number.POSITIVE_INFINITY;
  const latencyErrorBoundS = countAgreement
    ? latencyDisagreementS + Math.max(
      0,
      ...leftCrossings.map((crossing) => crossing.bracket_width_s),
      ...rightCrossings.map((crossing) => crossing.bracket_width_s),
    )
    : null;
  const recovered = [reference, refinement].every((run) => (
    Math.max(...run.state.map(Math.abs)) <= 1e-8
  ));
  const durationGate = !requireRefractoryDuration || (
    step.status === "resolved"
    && durationS >= 1.5 * (step.adaptation_time_s + step.adaptation_time_error_bound_s)
  );
  const amplitudeGate = Math.min(leftPeak.amplitude_u, rightPeak.amplitude_u)
    - amplitudeErrorU > 5 * amplitudeErrorU;
  const singleResponseGate = countAgreement && rightCrossings.length === 1;
  const observationGate = world.observation_mode === "direct";
  const numericalGate = Number.isFinite(latencyDisagreementS) && recovered;
  const sourceQualified = step.adaptation_gate === true
    && durationGate
    && amplitudeGate
    && singleResponseGate
    && observationGate
    && numericalGate;
  const costs = {
    ...baseCost,
    response_count: leftCrossings.length + rightCrossings.length,
  };
  return deepFreeze({
    world_id: worldId,
    duration_s: durationS,
    status: "resolved",
    isolated_amplitude_u: rightPeak.amplitude_u,
    isolated_amplitude_error_bound_u: amplitudeErrorU,
    threshold_u: rightThresholdU,
    sensitivity_thresholds_u: [0.15, 0.35].map((fraction) => fraction * rightPeak.amplitude_u),
    response_count: rightCrossings.length,
    first_crossing_latency_s: rightCrossings[0]?.time_s ?? null,
    missing_event: rightCrossings.length === 0,
    latency_error_bound_s: latencyErrorBoundS,
    recovery_scaled_residual: Math.max(...refinement.state.map(Math.abs)),
    support: {
      adaptation_gate: step.adaptation_gate === true,
      refractory_duration_gate: durationGate,
      amplitude_gate: amplitudeGate,
      single_response_gate: singleResponseGate,
      count_agreement_gate: countAgreement,
      off_state_recovery_gate: recovered,
      exact_edge_stop_gate: true,
      observation_gate: observationGate,
      numerical_gate: numericalGate,
      crossing_error_role: "diagnostic-bound-no-source-pass-threshold",
      source_qualified: sourceQualified,
    },
    cost_vector: assertFixture026RsdT02PulseCostVector(costs),
    ...noResultFields(),
  });
}

function integratePulseCycle(worldId, state, durationS, periodS, solver, phases = null) {
  const phaseStops = phases === null
    ? [0, durationS, periodS]
    : uniqueSortedTimes([...phases, durationS, periodS]);
  let current = [...state];
  let currentPhaseS = 0;
  let integral = 0;
  let evaluations = 0;
  const samples = [];
  const append = (phaseS) => {
    const observation = evaluateFixture026RsdT02PulseWorld(
      worldId,
      current,
      phaseS < durationS ? 1 : 0,
    );
    samples.push({
      phase_s: phaseS,
      state: [...current],
      response_u: observation.response_u,
      output_dimensionless: observation.output_dimensionless,
    });
  };
  if (phases !== null) append(0);
  for (const stopS of phaseStops.slice(1)) {
    const midpointS = currentPhaseS + (stopS - currentPhaseS) / 2;
    const integrated = integrateConstant(
      worldId,
      current,
      stopS - currentPhaseS,
      midpointS < durationS ? 1 : 0,
      solver,
    );
    evaluations += integrated.evaluations;
    integral += integrated.integral;
    current = integrated.state;
    currentPhaseS = stopS;
    if (integrated.status !== "converged") {
      return { status: integrated.status, state: current, integral, evaluations, samples };
    }
    if (phases !== null) append(stopS);
  }
  return { status: "converged", state: current, integral, evaluations, samples };
}

function persistentRecurrence(boundaries, order, tolerance) {
  const requiredComparisons = 4 * order;
  const last = boundaries.length - 1;
  if (last < 5 * order) return { passes: false, residual: Number.POSITIVE_INFINITY, comparisons: 0 };
  let residual = 0;
  for (let offset = 0; offset < requiredComparisons; offset += 1) {
    residual = Math.max(
      residual,
      stateDistance(boundaries[last - offset], boundaries[last - offset - order]),
    );
  }
  return { passes: residual <= tolerance, residual, comparisons: requiredComparisons };
}

function waveformPhases(periodS, durationS) {
  const count = FIXTURE_026_RSD_T02_PULSE_REGISTRY.numerics.waveform_samples_per_period;
  return uniqueSortedTimes([
    ...Array.from({ length: count + 1 }, (_, index) => periodS * index / count),
    durationS,
  ]);
}

function simulatePeriodicOnce(worldId, durationS, periodS, solver) {
  const world = worldFor(worldId);
  const stateBytes = world.state_dimension * 8;
  const capS = FIXTURE_026_RSD_T02_PULSE_REGISTRY.numerics.time_cap_s_per_cell;
  const boundaries = [initialState(worldId)];
  let state = [...boundaries[0]];
  let evaluations = 0;
  let convergenceOrder = null;
  let convergenceResidual = null;
  let recurrenceComparisons = 0;
  let convergenceCycles = 0;
  while ((convergenceCycles + 1) * periodS <= capS) {
    const cycle = integratePulseCycle(worldId, state, durationS, periodS, solver);
    evaluations += cycle.evaluations;
    convergenceCycles += 1;
    state = cycle.state;
    if (cycle.status !== "converged") {
      return {
        status: cycle.status,
        convergence_cycles: convergenceCycles,
        evaluations,
        boundaries,
        cost_vector: costVector({
          pulseCells: 1,
          stimulusCount: convergenceCycles,
          simulatedSeconds: convergenceCycles * periodS,
          sampleRows: boundaries.length,
          solverEvaluations: evaluations,
          retainedStateBytes: stateBytes,
          parameterBytes: world.parameter_bytes,
          evaluatorStateComparisons: recurrenceComparisons,
        }),
      };
    }
    boundaries.push([...state]);
    for (let order = 1; order <= 5; order += 1) {
      const recurrence = persistentRecurrence(boundaries, order, 1e-10);
      recurrenceComparisons += recurrence.comparisons;
      if (recurrence.passes) {
        convergenceOrder = order;
        convergenceResidual = recurrence.residual;
        break;
      }
    }
    if (convergenceOrder !== null) break;
  }
  if (convergenceOrder === null) {
    return {
      status: "nonconverged",
      convergence_cycles: convergenceCycles,
      evaluations,
      boundaries,
      cost_vector: costVector({
        pulseCells: 1,
        stimulusCount: convergenceCycles,
        simulatedSeconds: convergenceCycles * periodS,
        sampleRows: boundaries.length,
        solverEvaluations: evaluations,
        retainedStateBytes: stateBytes,
        parameterBytes: world.parameter_bytes,
        evaluatorStateComparisons: recurrenceComparisons,
      }),
    };
  }
  const phases = waveformPhases(periodS, durationS);
  const waveforms = [];
  let analysisIntegral = 0;
  for (let cycleIndex = 0; cycleIndex < 20; cycleIndex += 1) {
    const cycle = integratePulseCycle(worldId, state, durationS, periodS, solver, phases);
    evaluations += cycle.evaluations;
    if (cycle.status !== "converged") {
      return {
        status: cycle.status,
        convergence_cycles: convergenceCycles,
        evaluations,
        boundaries,
        waveforms,
        cost_vector: costVector({
          pulseCells: 1,
          stimulusCount: convergenceCycles + cycleIndex + 1,
          simulatedSeconds: (convergenceCycles + cycleIndex + 1) * periodS,
          sampleRows: boundaries.length + waveforms.reduce((sum, row) => sum + row.length, 0),
          solverEvaluations: evaluations,
          retainedStateBytes: stateBytes,
          parameterBytes: world.parameter_bytes,
          evaluatorStateComparisons: recurrenceComparisons,
        }),
      };
    }
    waveforms.push(cycle.samples);
    analysisIntegral += cycle.integral;
    state = cycle.state;
  }
  const sampleRows = boundaries.length + waveforms.reduce((sum, row) => sum + row.length, 0);
  return {
    status: "converged",
    convergence_order: convergenceOrder,
    convergence_residual: convergenceResidual,
    convergence_cycles: convergenceCycles,
    t_b_s: convergenceCycles * periodS,
    mean_output_dimensionless: analysisIntegral / (20 * periodS),
    waveforms,
    evaluations,
    cost_vector: costVector({
      pulseCells: 1,
      stimulusCount: convergenceCycles + 20,
      simulatedSeconds: (convergenceCycles + 20) * periodS,
      sampleRows,
      solverEvaluations: evaluations,
      retainedStateBytes: stateBytes,
      parameterBytes: world.parameter_bytes,
      evaluatorStateComparisons: recurrenceComparisons,
    }),
  };
}

function flattenWaveforms(waveforms, periodS) {
  const flattened = [];
  for (let cycleIndex = 0; cycleIndex < waveforms.length; cycleIndex += 1) {
    for (const sample of waveforms[cycleIndex]) {
      if (cycleIndex > 0 && sample.phase_s === 0) continue;
      flattened.push({
        ...sample,
        time_s: cycleIndex * periodS + sample.phase_s,
        cycle_index: cycleIndex,
      });
    }
  }
  return flattened;
}

function intervalEventRows(samples, thresholdU, periodS, pulseCount) {
  const rows = [];
  for (let pulseIndex = 0; pulseIndex < pulseCount; pulseIndex += 1) {
    const startS = pulseIndex * periodS;
    const endS = (pulseIndex + 1) * periodS;
    const relevant = samples.filter((sample) => sample.time_s >= startS && sample.time_s <= endS);
    const crossings = directCrossings(relevant, thresholdU, startS, endS);
    rows.push({
      pulse_index: pulseIndex,
      upward_crossing_count: crossings.length,
      response: crossings.length >= 1,
      first_crossing_latency_s: crossings.length >= 1 ? crossings[0].time_s - startS : null,
      missing_event: crossings.length === 0,
      response_amplitude_u: Math.max(0, ...relevant.map((sample) => sample.response_u)),
      crossing_bracket_width_s: crossings.length >= 1
        ? Math.max(...crossings.map((crossing) => crossing.bracket_width_s))
        : null,
      crossing_times_s: crossings.map((crossing) => crossing.time_s),
    });
  }
  return rows;
}

export function evaluateFixture026RsdT02PulseEvents({
  samples,
  threshold_u: thresholdU,
  period_s: periodS,
  pulse_count: pulseCount,
  observation_mode: observationMode = "direct",
}) {
  finitePositive(thresholdU, "Fixture 026 RSD-T02-PULSE event threshold");
  finitePositive(periodS, "Fixture 026 RSD-T02-PULSE event period");
  if (!Number.isSafeInteger(pulseCount) || pulseCount < 1) {
    throw new TypeError("Fixture 026 RSD-T02-PULSE event pulse count is invalid.");
  }
  if (observationMode === "one-sample-per-period-fixed-phase") {
    return deepFreeze({
      observation_mode: observationMode,
      observation_support: false,
      recoverable: false,
      stimulus_count: pulseCount,
      response_count: null,
      missing_event_count: null,
      intervals: Array.from({ length: pulseCount }, (_, pulseIndex) => ({
        pulse_index: pulseIndex,
        upward_crossing_count: null,
        response: null,
        first_crossing_latency_s: null,
        missing_event: null,
        response_amplitude_u: null,
      })),
    });
  }
  const directRows = intervalEventRows(samples, thresholdU, periodS, pulseCount);
  let rows = directRows;
  if (observationMode === "dead-time-1.5T") {
    let lastAcceptedS = Number.NEGATIVE_INFINITY;
    rows = directRows.map((row) => {
      const accepted = row.crossing_times_s.filter((timeS) => {
        if (timeS - lastAcceptedS < 1.5 * periodS) return false;
        lastAcceptedS = timeS;
        return true;
      });
      return {
        ...row,
        upward_crossing_count: accepted.length,
        response: accepted.length >= 1,
        first_crossing_latency_s: accepted.length >= 1
          ? accepted[0] - row.pulse_index * periodS
          : null,
        missing_event: accepted.length === 0,
        crossing_times_s: accepted,
      };
    });
  } else if (observationMode !== "direct") {
    throw new RangeError(`Unknown Fixture 026 RSD-T02-PULSE observation mode: ${observationMode}`);
  }
  return deepFreeze({
    observation_mode: observationMode,
    observation_support: observationMode === "direct",
    recoverable: true,
    stimulus_count: pulseCount,
    response_count: rows.reduce((sum, row) => sum + (row.response ? 1 : 0), 0),
    missing_event_count: rows.reduce((sum, row) => sum + (row.missing_event ? 1 : 0), 0),
    intervals: rows.map(({ crossing_times_s: ignored, ...row }) => {
      void ignored;
      return row;
    }),
  });
}

function waveformDelta(run, order) {
  const waveforms = run.waveforms;
  const comparisons = Math.min(4 * order, waveforms.length - order);
  let delta = 0;
  let scalarComparisons = 0;
  for (let offset = 0; offset < comparisons; offset += 1) {
    const right = waveforms.length - 1 - offset;
    const left = right - order;
    for (let sampleIndex = 0; sampleIndex < waveforms[right].length; sampleIndex += 1) {
      const current = waveforms[right][sampleIndex];
      const prior = waveforms[left][sampleIndex];
      delta = Math.max(delta, stateDistance(current.state, prior.state));
      delta = Math.max(
        delta,
        Math.abs(current.output_dimensionless - prior.output_dimensionless),
      );
      scalarComparisons += current.state.length + 1;
    }
  }
  return { delta, scalarComparisons };
}

function eventAgreement(left, right) {
  if (!left.recoverable || !right.recoverable) return false;
  return left.intervals.length === right.intervals.length
    && left.intervals.every((row, index) => (
      row.upward_crossing_count === right.intervals[index].upward_crossing_count
    ));
}

export function constructFixture026RsdT02PeriodicPulseCell(worldId, {
  duration_s: durationS,
  period_s: periodS,
  reference_threshold_u: referenceThresholdU,
  refinement_threshold_u: refinementThresholdU = referenceThresholdU,
} = {}) {
  finitePositive(durationS, "Fixture 026 RSD-T02-PULSE periodic duration");
  finitePositive(periodS, "Fixture 026 RSD-T02-PULSE periodic period");
  if (durationS >= periodS) throw new RangeError("Fixture 026 RSD-T02-PULSE periodic cell requires d < T.");
  finitePositive(referenceThresholdU, "Fixture 026 RSD-T02-PULSE reference threshold");
  finitePositive(refinementThresholdU, "Fixture 026 RSD-T02-PULSE refinement threshold");
  const world = worldFor(worldId);
  const reference = simulatePeriodicOnce(worldId, durationS, periodS, referenceSolver(false));
  const refinement = simulatePeriodicOnce(worldId, durationS, periodS, referenceSolver(true));
  const costs = addCosts(reference.cost_vector, refinement.cost_vector);
  if (reference.status !== "converged" || refinement.status !== "converged") {
    return deepFreeze({
      world_id: worldId,
      duration_s: durationS,
      period_s: periodS,
      status: "unresolved",
      reason: `periodic-${reference.status}-${refinement.status}`,
      recurrence: null,
      events: null,
      cost_vector: assertFixture026RsdT02PulseCostVector(costs),
      ...noResultFields(),
    });
  }
  const referenceTrace = flattenWaveforms(reference.waveforms, periodS);
  const refinementTrace = flattenWaveforms(refinement.waveforms, periodS);
  const referenceEvents = evaluateFixture026RsdT02PulseEvents({
    samples: referenceTrace,
    threshold_u: referenceThresholdU,
    period_s: periodS,
    pulse_count: 20,
    observation_mode: world.observation_mode,
  });
  const refinementEvents = evaluateFixture026RsdT02PulseEvents({
    samples: refinementTrace,
    threshold_u: refinementThresholdU,
    period_s: periodS,
    pulse_count: 20,
    observation_mode: world.observation_mode,
  });
  const recurrence = {};
  let recurrenceComparisons = 0;
  for (let order = 1; order <= 5; order += 1) {
    const left = waveformDelta(reference, order);
    const right = waveformDelta(refinement, order);
    recurrenceComparisons += left.scalarComparisons + right.scalarComparisons;
    const disagreement = Math.abs(left.delta - right.delta);
    recurrence[order] = {
      reference_delta: left.delta,
      refinement_delta: right.delta,
      eta: disagreement,
      lower_bound: Math.max(0, Math.min(left.delta, right.delta) - disagreement),
      upper_bound: Math.max(left.delta, right.delta) + disagreement,
    };
  }
  const latencyErrorBoundS = eventAgreement(referenceEvents, refinementEvents)
    ? Math.max(0, ...referenceEvents.intervals.map((row, index) => {
      const other = refinementEvents.intervals[index];
      if (row.first_crossing_latency_s === null || other.first_crossing_latency_s === null) return 0;
      return Math.abs(row.first_crossing_latency_s - other.first_crossing_latency_s)
        + Math.max(row.crossing_bracket_width_s ?? 0, other.crossing_bracket_width_s ?? 0);
    }))
    : null;
  costs.response_count = (referenceEvents.response_count ?? 0) + (refinementEvents.response_count ?? 0);
  costs.evaluator_state_comparisons += recurrenceComparisons;
  return deepFreeze({
    world_id: worldId,
    plant_id: world.plant_id,
    duration_s: durationS,
    period_s: periodS,
    status: "resolved",
    convergence: {
      reference_order: reference.convergence_order,
      refinement_order: refinement.convergence_order,
      reference_residual: reference.convergence_residual,
      refinement_residual: refinement.convergence_residual,
      reference_t_b_s: reference.t_b_s,
      refinement_t_b_s: refinement.t_b_s,
      order_agreement: reference.convergence_order === refinement.convergence_order,
    },
    mean_output_dimensionless: refinement.mean_output_dimensionless,
    mean_output_error_bound: Math.abs(
      reference.mean_output_dimensionless - refinement.mean_output_dimensionless
    ),
    recurrence,
    events: {
      reference: referenceEvents,
      refinement: refinementEvents,
      count_agreement: eventAgreement(referenceEvents, refinementEvents),
      latency_error_bound_s: latencyErrorBoundS,
      latency_error_role: "diagnostic-bound-no-source-pass-threshold",
    },
    numerical_gate: reference.convergence_order === refinement.convergence_order
      && eventAgreement(referenceEvents, refinementEvents),
    cost_vector: assertFixture026RsdT02PulseCostVector(costs),
    ...noResultFields(),
  });
}

function repeatedBlocks(word, order, blocks) {
  if (word.length < order * blocks) return false;
  const suffix = word.slice(-order * blocks);
  const reference = suffix.slice(0, order).join("");
  for (let block = 1; block < blocks; block += 1) {
    if (suffix.slice(block * order, (block + 1) * order).join("") !== reference) return false;
  }
  return true;
}

function largestZeroRun(word) {
  let largest = 0;
  let current = 0;
  for (const value of word) {
    current = value === 0 ? current + 1 : 0;
    largest = Math.max(largest, current);
  }
  return largest;
}

export function evaluateFixture026RsdT02PeriodSkipping(periodicCell) {
  if (periodicCell.status !== "resolved" || periodicCell.recurrence === null) {
    return deepFreeze({ status: "unresolved", reason: periodicCell.reason ?? "nonconverged" });
  }
  const events = periodicCell.events;
  if (!events.reference.observation_support || !events.refinement.observation_support) {
    return deepFreeze({ status: "out_of_support", reason: "observation-layer-cannot-identify-plant-events" });
  }
  if (!periodicCell.numerical_gate || !events.count_agreement) {
    return deepFreeze({ status: "unresolved", reason: "two-resolution-event-or-order-disagreement" });
  }
  let order = null;
  for (let candidate = 1; candidate <= 5; candidate += 1) {
    if (periodicCell.recurrence[candidate].upper_bound <= 1e-10) {
      order = candidate;
      break;
    }
  }
  if (order === null) return deepFreeze({ status: "unresolved", reason: "no-certified-order-through-five" });
  if (order === 1) {
    return deepFreeze({
      status: "absent",
      recurrence_order: 1,
      recurrence_residual_upper_bound: periodicCell.recurrence[1].upper_bound,
      largest_consecutive_zero_run: null,
    });
  }
  if (periodicCell.recurrence[1].lower_bound <= 1e-8) {
    return deepFreeze({ status: "unresolved", reason: "period-one-separation-not-certified", recurrence_order: order });
  }
  const referenceCounts = events.reference.intervals.map((row) => row.upward_crossing_count);
  const refinementCounts = events.refinement.intervals.map((row) => row.upward_crossing_count);
  if (
    referenceCounts.some((count) => count > 1)
    || refinementCounts.some((count) => count > 1)
  ) return deepFreeze({ status: "out_of_support", reason: "multiple-responses-in-pulse-interval" });
  const referenceWord = referenceCounts.map((count) => count >= 1 ? 1 : 0);
  const refinementWord = refinementCounts.map((count) => count >= 1 ? 1 : 0);
  const suffixLength = 4 * order;
  const referenceSuffix = referenceWord.slice(-suffixLength);
  const refinementSuffix = refinementWord.slice(-suffixLength);
  if (referenceSuffix.join("") !== refinementSuffix.join("")) {
    return deepFreeze({ status: "unresolved", reason: "two-resolution-event-word-disagreement" });
  }
  const baseWord = refinementSuffix.slice(0, order);
  if (
    !repeatedBlocks(refinementWord, order, 4)
    || !baseWord.includes(0)
    || !baseWord.includes(1)
  ) {
    return deepFreeze({
      status: "absent",
      reason: "subharmonic-state-without-repeated-response-and-skip-word",
      recurrence_order: order,
    });
  }
  const observedLatencies = events.refinement.intervals
    .map((row) => row.first_crossing_latency_s)
    .filter((value) => value !== null);
  return deepFreeze({
    status: "supported",
    recurrence_order: order,
    recurrence_residual_upper_bound: periodicCell.recurrence[order].upper_bound,
    period_one_residual_lower_bound: periodicCell.recurrence[1].lower_bound,
    event_word: baseWord,
    repeated_blocks: 4,
    response_count: events.refinement.response_count,
    stimulus_count: events.refinement.stimulus_count,
    response_fraction: events.refinement.response_count / events.refinement.stimulus_count,
    missing_event_count: events.refinement.missing_event_count,
    latencies_s: observedLatencies,
    missing_latency_encoding: "null-not-zero",
    largest_consecutive_zero_run: largestZeroRun(refinementSuffix),
  });
}

export function constructFixture026RsdT02SkippingCell(worldId, periodS, {
  step_calibration: stepCalibration = null,
  isolated_calibration: isolatedCalibration = null,
} = {}) {
  if (!FIXTURE_026_RSD_T02_PULSE_SKIPPING_PERIODS_S.includes(periodS)) {
    throw new RangeError("Fixture 026 RSD-T02-PULSE skipping period is outside the protected panel.");
  }
  const ownsStepCalibration = stepCalibration === null;
  const ownsIsolatedCalibration = isolatedCalibration === null;
  const step = stepCalibration ?? calibrateFixture026RsdT02PulseStep(worldId);
  const isolated = isolatedCalibration ?? calibrateFixture026RsdT02IsolatedPulse(worldId, 0.20, {
    step_calibration: step,
    require_refractory_duration: false,
  });
  if (isolated.status !== "resolved") {
    return deepFreeze({
      world_id: worldId,
      duration_s: 0.20,
      period_s: periodS,
      skipping_signature: { status: "unresolved", reason: "isolated-pulse-gate-unresolved" },
      feedback_support: { status: "unresolved", reason: "signature-not-constructed" },
      cost_scope: "invocation-only",
      shared_calibration_costs_included: {
        step: ownsStepCalibration,
        isolated: ownsIsolatedCalibration,
      },
      cost_vector: assertFixture026RsdT02PulseCostVector(addCosts(
        ownsStepCalibration ? step.cost_vector : null,
        ownsIsolatedCalibration ? isolated.cost_vector : null,
      )),
      ...noResultFields(),
    });
  }
  const amplitudeErrorU = isolated.isolated_amplitude_error_bound_u;
  const referenceThresholdU = 0.25 * Math.max(
    Number.MIN_VALUE,
    isolated.isolated_amplitude_u + amplitudeErrorU,
  );
  const periodic = constructFixture026RsdT02PeriodicPulseCell(worldId, {
    duration_s: 0.20,
    period_s: periodS,
    reference_threshold_u: referenceThresholdU,
    refinement_threshold_u: isolated.threshold_u,
  });
  let skipping = evaluateFixture026RsdT02PeriodSkipping(periodic);
  if (!isolated.support.source_qualified) {
    skipping = deepFreeze({
      status: isolated.support.observation_gate ? "unresolved" : "out_of_support",
      reason: "isolated-pulse-support-gate-failed",
      machine_signature_before_support_gate: skipping.status,
    });
  }
  const feedback = evaluateFixture026RsdT02PulseFeedback({
    world_id: worldId,
    refractory_signature: "absent",
    skipping_signature: skipping.status,
    rival_certified: false,
  });
  return deepFreeze({
    world_id: worldId,
    duration_s: 0.20,
    period_s: periodS,
    step_calibration: step,
    isolated_calibration: isolated,
    periodic_cell: periodic,
    skipping_signature: skipping,
    feedback_support: feedback,
    cost_scope: "invocation-only",
    shared_calibration_costs_included: {
      step: ownsStepCalibration,
      isolated: ownsIsolatedCalibration,
    },
    cost_vector: assertFixture026RsdT02PulseCostVector(addCosts(
      ownsStepCalibration ? step.cost_vector : null,
      ownsIsolatedCalibration ? isolated.cost_vector : null,
      periodic.cost_vector,
    )),
    ...noResultFields(),
  });
}

export function buildFixture026RsdT02RefractoryCoarsePeriods(durationS) {
  finitePositive(durationS, "Fixture 026 RSD-T02-PULSE refractory duration");
  const periods = [];
  for (let index = 1; ; index += 1) {
    const periodS = Number((durationS + 0.20 * index).toFixed(2));
    if (periodS > 40 + 1e-12) break;
    periods.push(periodS);
  }
  return Object.freeze(periods);
}

export function selectFixture026RsdT02RefractoryMaximizer(periodCells) {
  if (!Array.isArray(periodCells) || periodCells.length < 3) {
    throw new TypeError("Fixture 026 RSD-T02-PULSE maximizer requires at least three period cells.");
  }
  const sorted = [...periodCells].sort((left, right) => left.period_s - right.period_s);
  if (sorted.some((cell) => (
    cell.status !== "resolved"
    || !Number.isFinite(cell.mean_output_dimensionless)
    || !Number.isFinite(cell.mean_output_error_bound)
    || cell.mean_output_error_bound < 0
  ))) return deepFreeze({ status: "unresolved", reason: "nonconverged-or-invalid-period-cell" });
  const intervals = sorted.map((cell) => ({
    period_s: cell.period_s,
    lower: cell.mean_output_dimensionless - cell.mean_output_error_bound,
    upper: cell.mean_output_dimensionless + cell.mean_output_error_bound,
  }));
  const maximumLower = Math.max(...intervals.map((row) => row.lower));
  const tied = intervals.filter((row) => row.upper >= maximumLower);
  const lowerPeriodS = Math.min(...tied.map((row) => row.period_s));
  const upperPeriodS = Math.max(...tied.map((row) => row.period_s));
  const boundary = lowerPeriodS === sorted[0].period_s || upperPeriodS === sorted.at(-1).period_s;
  return deepFreeze({
    status: boundary ? "unresolved" : "qualified",
    reason: boundary ? "maximizer-touches-search-boundary" : null,
    maximizer_periods_s: tied.map((row) => row.period_s),
    interval_s: [lowerPeriodS, upperPeriodS],
    descriptive_largest_period_s: upperPeriodS,
    maximum_output_lower_bound: maximumLower,
    boundary,
  });
}

export function buildFixture026RsdT02RefractoryRefinementPeriods(coarseCells) {
  const maximizer = selectFixture026RsdT02RefractoryMaximizer(coarseCells);
  const periods = [...coarseCells].sort((left, right) => left.period_s - right.period_s)
    .map((cell) => cell.period_s);
  const refinement = new Set();
  for (const tiedPeriodS of maximizer.maximizer_periods_s ?? []) {
    const index = periods.indexOf(tiedPeriodS);
    const lower = periods[Math.max(0, index - 1)];
    const upper = periods[Math.min(periods.length - 1, index + 1)];
    for (let tick = Math.ceil(lower * 100); tick <= Math.floor(upper * 100); tick += 1) {
      const candidate = tick / 100;
      if (!periods.includes(candidate)) refinement.add(candidate);
    }
  }
  return Object.freeze([...refinement].sort((left, right) => left - right));
}

export function evaluateFixture026RsdT02RefractoryStabilization(durationRows) {
  if (!Array.isArray(durationRows) || durationRows.length < 3) {
    throw new TypeError("Fixture 026 RSD-T02-PULSE stabilization requires at least three duration rows.");
  }
  const rows = [...durationRows].sort((left, right) => left.duration_s - right.duration_s);
  if (rows.some((row) => (
    row.support?.source_qualified !== true
    || row.maximizer?.status !== "qualified"
    || !Array.isArray(row.maximizer.interval_s)
  ))) return deepFreeze({ status: "unresolved", reason: "support-or-maximizer-gate-failed", secants: [] });
  const secants = [];
  for (let index = 0; index < rows.length - 1; index += 1) {
    const left = rows[index];
    const right = rows[index + 1];
    const deltaD = right.duration_s - left.duration_s;
    const [leftLower, leftUpper] = left.maximizer.interval_s;
    const [rightLower, rightUpper] = right.maximizer.interval_s;
    secants.push({
      left_duration_s: left.duration_s,
      right_duration_s: right.duration_s,
      lower: (rightLower - leftUpper) / deltaD,
      upper: (rightUpper - leftLower) / deltaD,
    });
  }
  let run = 0;
  let possibleRun = 0;
  let longestRun = 0;
  let longestPossibleRun = 0;
  for (const secant of secants) {
    run = secant.upper < 0.5 ? run + 1 : 0;
    possibleRun = secant.lower < 0.5 ? possibleRun + 1 : 0;
    longestRun = Math.max(longestRun, run);
    longestPossibleRun = Math.max(longestPossibleRun, possibleRun);
  }
  const status = longestRun >= 2
    ? "supported"
    : longestPossibleRun < 2
      ? "absent"
      : "unresolved";
  return deepFreeze({
    status,
    reason: status === "unresolved" ? "secant-intervals-straddle-stabilization-threshold" : null,
    secants,
    longest_consecutive_passing_secants: longestRun,
    longest_consecutive_possibly_passing_secants: longestPossibleRun,
    strict_slope_upper_bound: 0.5,
  });
}

export async function constructFixture026RsdT02RefractoryDuration(worldId, durationS, {
  step_calibration: stepCalibration = null,
  on_progress: onProgress = null,
} = {}) {
  if (!FIXTURE_026_RSD_T02_PULSE_REFRACTORY_DURATIONS_S.includes(durationS)) {
    throw new RangeError("Fixture 026 RSD-T02-PULSE duration is outside the refractory panel.");
  }
  if (onProgress !== null && typeof onProgress !== "function") {
    throw new TypeError("Fixture 026 RSD-T02-PULSE progress callback must be a function.");
  }
  const ownsStepCalibration = stepCalibration === null;
  const step = stepCalibration ?? calibrateFixture026RsdT02PulseStep(worldId);
  const isolated = calibrateFixture026RsdT02IsolatedPulse(worldId, durationS, {
    step_calibration: step,
    require_refractory_duration: true,
  });
  if (!isolated.support?.source_qualified) {
    return deepFreeze({
      world_id: worldId,
      duration_s: durationS,
      support: isolated.support ?? { source_qualified: false },
      maximizer: { status: "unresolved", reason: "isolated-support-gate-failed" },
      period_cells: [],
      cost_scope: "invocation-only",
      shared_step_cost_included: ownsStepCalibration,
      cost_vector: assertFixture026RsdT02PulseCostVector(addCosts(
        ownsStepCalibration ? step.cost_vector : null,
        isolated.cost_vector,
      )),
      ...noResultFields(),
    });
  }
  const cells = [];
  for (const periodS of buildFixture026RsdT02RefractoryCoarsePeriods(durationS)) {
    const cell = constructFixture026RsdT02PeriodicPulseCell(worldId, {
      duration_s: durationS,
      period_s: periodS,
      reference_threshold_u: isolated.threshold_u,
    });
    cells.push(cell);
    if (onProgress) await onProgress({ stage: "coarse", duration_s: durationS, period_s: periodS });
  }
  const refinementPeriods = buildFixture026RsdT02RefractoryRefinementPeriods(cells);
  for (const periodS of refinementPeriods) {
    const cell = constructFixture026RsdT02PeriodicPulseCell(worldId, {
      duration_s: durationS,
      period_s: periodS,
      reference_threshold_u: isolated.threshold_u,
    });
    cells.push(cell);
    if (onProgress) await onProgress({ stage: "refinement", duration_s: durationS, period_s: periodS });
  }
  const maximizer = selectFixture026RsdT02RefractoryMaximizer(cells);
  return deepFreeze({
    world_id: worldId,
    duration_s: durationS,
    support: isolated.support,
    step_calibration: step,
    isolated_calibration: isolated,
    coarse_cell_count: cells.length - refinementPeriods.length,
    refinement_cell_count: refinementPeriods.length,
    period_cells: cells,
    maximizer,
    cost_scope: "invocation-only",
    shared_step_cost_included: ownsStepCalibration,
    cost_vector: assertFixture026RsdT02PulseCostVector(addCosts(
      ownsStepCalibration ? step.cost_vector : null,
      isolated.cost_vector,
      ...cells.map((cell) => cell.cost_vector),
    )),
    ...noResultFields(),
  });
}

export async function constructFixture026RsdT02RefractoryPanel(worldId, options = {}) {
  const step = calibrateFixture026RsdT02PulseStep(worldId);
  const rows = [];
  for (const durationS of FIXTURE_026_RSD_T02_PULSE_REFRACTORY_DURATIONS_S) {
    rows.push(await constructFixture026RsdT02RefractoryDuration(worldId, durationS, {
      ...options,
      step_calibration: step,
    }));
  }
  return deepFreeze({
    world_id: worldId,
    durations: rows,
    refractory_signature: evaluateFixture026RsdT02RefractoryStabilization(rows),
    cost_vector: assertFixture026RsdT02PulseCostVector(addCosts(
      step.cost_vector,
      ...rows.map((row) => row.cost_vector),
    )),
    ...noResultFields(),
  });
}

export function evaluateFixture026RsdT02PulseFeedback({
  world_id: worldId,
  refractory_signature: refractorySignature,
  skipping_signature: skippingSignature,
  rival_certified: rivalCertified,
}) {
  const world = worldFor(worldId);
  const validSignatures = new Set(["supported", "absent", "unresolved", "out_of_support"]);
  if (
    !validSignatures.has(refractorySignature)
    || !validSignatures.has(skippingSignature)
    || typeof rivalCertified !== "boolean"
  ) throw new TypeError("Fixture 026 RSD-T02-PULSE feedback endpoint input is invalid.");
  let status;
  let reason;
  let topologyDisposition = "unresolved";
  if (world.response_drives_inhibitor === "mixed") {
    status = "out_of_support";
    reason = "mixed-path-world-retains-window-qualification";
    topologyDisposition = "mixed/window-qualified";
  } else if (world.observation_mode !== "direct") {
    status = "out_of_support";
    reason = "observation-layer-does-not-identify-plant-topology";
  } else if ([refractorySignature, skippingSignature].includes("supported")) {
    status = rivalCertified ? "supported" : "unresolved";
    reason = rivalCertified ? "positive-signature-with-certified-rival" : "rival-certificate-pending";
    topologyDisposition = rivalCertified ? "response-dependent-inhibition-supported" : "unresolved";
  } else {
    status = "unresolved";
    reason = refractorySignature === "absent" && skippingSignature === "absent"
      ? "absence-is-not-feed-forward-evidence"
      : "signature-or-support-unresolved";
  }
  return deepFreeze({
    status,
    reason,
    topology_disposition: topologyDisposition,
    evaluator_truth: world.response_drives_inhibitor,
    false_feedback_attribution: status === "supported"
      && world.response_drives_inhibitor === "absent",
    forced_feed_forward_attribution: false,
    ...noResultFields("evaluator-construction-only"),
  });
}

export function evaluateFixture026RsdT02MixedWindows(windowRows = []) {
  const expectedEnds = FIXTURE_026_RSD_T02_PULSE_REGISTRY.mixed_window_ends_s;
  const complete = Array.isArray(windowRows)
    && windowRows.length === expectedEnds.length
    && windowRows.every((row, index) => (
      Number.isFinite(row.start_s)
      && Number.isFinite(row.end_s)
      && row.start_s >= 0
      && row.end_s > row.start_s
      && row.end_s === expectedEnds[index]
      && new Set(["supported", "absent", "unresolved"]).has(row.signature)
    ));
  if (!complete) {
    return deepFreeze({
      status: "unresolved",
      reason: "mixed-window-starts-or-widths-not-frozen",
      topology_disposition: "mixed/window-qualified",
      exclusive_topology_allowed: false,
      expected_window_ends_s: [...expectedEnds],
      ...noResultFields("evaluator-construction-only"),
    });
  }
  return deepFreeze({
    status: new Set(windowRows.map((row) => row.signature)).size > 1 ? "qualified" : "unresolved",
    reason: new Set(windowRows.map((row) => row.signature)).size > 1
      ? "window-dependent-signature-retained"
      : "window-dependence-not-demonstrated",
    topology_disposition: "mixed/window-qualified",
    exclusive_topology_allowed: false,
    window_rows: windowRows.map((row) => ({ ...row })),
    ...noResultFields("evaluator-construction-only"),
  });
}

function splitMix64(seed) {
  let state = BigInt(seed) & MASK_64;
  return () => {
    state = (state + 0x9e37_79b9_7f4a_7c15n) & MASK_64;
    let value = state;
    value = ((value ^ (value >> 30n)) * 0xbf58_476d_1ce4_e5b9n) & MASK_64;
    value = ((value ^ (value >> 27n)) * 0x94d0_49bb_1331_11ebn) & MASK_64;
    value ^= value >> 31n;
    return value & MASK_64;
  };
}

function normalGenerator(seed) {
  const nextUint64 = splitMix64(seed);
  let spare = null;
  const uniform = () => Number(nextUint64() >> 11n) / 2 ** 53;
  return () => {
    if (spare !== null) {
      const value = spare;
      spare = null;
      return value;
    }
    const radius = Math.sqrt(-2 * Math.log(Math.max(Number.MIN_VALUE, uniform())));
    const angle = 2 * Math.PI * uniform();
    spare = radius * Math.sin(angle);
    return radius * Math.cos(angle);
  };
}

export function applyFixture026RsdT02PulseOuNoise(samples, {
  seed,
  isolated_amplitude_u: isolatedAmplitudeU,
  sigma_ratio: sigmaRatio,
  correlation_time_s: correlationTimeS = 0.05,
}) {
  if (!canonicalUint64Seed(seed)) {
    throw new TypeError("Fixture 026 RSD-T02-PULSE OU seed must be canonical uint64 decimal.");
  }
  finitePositive(isolatedAmplitudeU, "Fixture 026 RSD-T02-PULSE isolated amplitude");
  finitePositive(correlationTimeS, "Fixture 026 RSD-T02-PULSE OU correlation time");
  if (![0.01, 0.05, 0.10].includes(sigmaRatio)) {
    throw new RangeError("Fixture 026 RSD-T02-PULSE OU sigma ratio is outside the frozen panel.");
  }
  if (
    !Array.isArray(samples)
    || samples.length < 2
    || samples.some((sample, index) => (
      !Number.isFinite(sample.time_s)
      || !Number.isFinite(sample.response_u)
      || (index > 0 && sample.time_s <= samples[index - 1].time_s)
    ))
  ) throw new TypeError("Fixture 026 RSD-T02-PULSE OU samples must be finite and strictly timed.");
  const normal = normalGenerator(seed);
  const sigmaU = sigmaRatio * isolatedAmplitudeU;
  let noiseU = sigmaU * normal();
  return deepFreeze(samples.map((sample, index) => {
    if (index > 0) {
      const deltaS = sample.time_s - samples[index - 1].time_s;
      const rho = Math.exp(-deltaS / correlationTimeS);
      noiseU = rho * noiseU + sigmaU * Math.sqrt(1 - rho ** 2) * normal();
    }
    return {
      ...sample,
      observed_response_u: sample.response_u + noiseU,
      observation_noise_u: noiseU,
      observation_seed: seed,
      observation_role: "public-development-diagnostic-only",
    };
  }));
}
