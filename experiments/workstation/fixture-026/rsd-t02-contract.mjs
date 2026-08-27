import { isDeepStrictEqual } from "node:util";

export const FIXTURE_026_RSD_T02_CONTRACT_VERSION = "fixture-026.rsd-t02-contract.v1";

export const FIXTURE_026_RSD_T02_PROPERTY_KEYS = Object.freeze([
  "drive_transform",
  "reported_output_feedback_edge",
  "channel_local_state",
  "causal_memory",
]);

export const FIXTURE_026_RSD_T02_EQUATION_TEMPLATE_VERSION =
  "fixture-026.rsd-t02-equation-template.v1";

export const FIXTURE_026_RSD_T02_EQUATION_TEMPLATES = deepFreeze([
  equationTemplate("t02-iffl-affine-reference", {
    initial_state_rule: "H0=1,H1=0-at-registered-steady-background",
    active_input_rule: "v=v_by_channel[active_channel]",
    internal_output_expression: "(v-H0)/(canonical_fold-1)",
    derivative_expression: "dH0=(v-H0)/time_constant_s;dH1=0",
    parameter_keys: ["canonical_fold", "time_constant_s"],
  }),
  equationTemplate("t02-nonlinear-output-feedback", {
    initial_state_rule: "H0=1,H1=0-at-registered-steady-background",
    active_input_rule: "v=v_by_channel[active_channel]",
    internal_output_expression: "(v-H0)/(canonical_fold-1)",
    derivative_expression: "reported=clamped?0:internal;dH0=((canonical_fold-1)*reported+feedback_nonlinearity*(v-1)*(v-canonical_fold)*reported^2)/time_constant_s;dH1=0",
    parameter_keys: ["canonical_fold", "feedback_nonlinearity", "time_constant_s"],
  }),
  equationTemplate("t02-channel-local-reference", {
    initial_state_rule: "H0=1,H1=1-at-registered-steady-background",
    active_input_rule: "v=v_by_channel[active_channel];reference=active_channel=A?H0:H1",
    internal_output_expression: "(v-reference)/(canonical_fold-1)",
    derivative_expression: "dH_active=(v-reference)/time_constant_s;dH_inactive=0",
    parameter_keys: ["canonical_fold", "time_constant_s"],
  }),
  equationTemplate("t02-static-affine-highpass", {
    initial_state_rule: "H0=0,H1=0-at-registered-steady-background",
    active_input_rule: "v=v_by_channel[active_channel];transformed=(v-1)/(canonical_fold-1)",
    internal_output_expression: "transformed-H0",
    derivative_expression: "dH0=(transformed-H0)/time_constant_s;dH1=0",
    parameter_keys: ["canonical_fold", "time_constant_s"],
  }),
  equationTemplate("t02-log-difference-highpass", {
    initial_state_rule: "H0=0,H1=0-at-registered-steady-background",
    active_input_rule: "v=v_by_channel[active_channel];transformed=ln(v)/ln(canonical_fold)",
    internal_output_expression: "transformed-H0",
    derivative_expression: "dH0=(transformed-H0)/time_constant_s;dH1=0",
    parameter_keys: ["canonical_fold", "time_constant_s"],
  }),
]);

function equationTemplate(equationId, equation) {
  return {
    contract_version: FIXTURE_026_RSD_T02_EQUATION_TEMPLATE_VERSION,
    equation_id: equationId,
    state_dimension: 2,
    opaque_state_coordinates: ["H0", "H1"],
    ...equation,
    reported_output_rule: "reported_output=clamped?0:internal_output",
    reset_semantics: "selected-opaque-coordinate-restored-to-registered-initial-value-at-declared-time",
    freeze_semantics: "selected-opaque-coordinate-derivative-zero-on-half-open-declared-interval",
  };
}

export const FIXTURE_026_RSD_T02_EQUATION_CERTIFICATES = deepFreeze([
  equationCertificate("t02-iffl-affine-reference", {
    drive_transform: "affine-fold",
    reported_output_feedback_edge: false,
    channel_local_state: false,
    causal_memory: true,
  }),
  equationCertificate("t02-nonlinear-output-feedback", {
    drive_transform: "affine-fold",
    reported_output_feedback_edge: true,
    channel_local_state: false,
    causal_memory: true,
  }),
  equationCertificate("t02-channel-local-reference", {
    drive_transform: "affine-fold",
    reported_output_feedback_edge: false,
    channel_local_state: true,
    causal_memory: true,
  }),
  equationCertificate("t02-static-affine-highpass", {
    drive_transform: "affine-fold",
    reported_output_feedback_edge: false,
    channel_local_state: false,
    causal_memory: true,
  }),
  equationCertificate("t02-log-difference-highpass", {
    drive_transform: "log-fold",
    reported_output_feedback_edge: false,
    channel_local_state: false,
    causal_memory: true,
  }),
]);

function equationCertificate(equationId, propertyVector) {
  return {
    equation_id: equationId,
    certificate_id: `CERT-${equationId}`,
    certificate_basis: "declared-equation-dependency-contract",
    property_vector: propertyVector,
  };
}

function certifiedPropertyVector(equationId) {
  const certificate = FIXTURE_026_RSD_T02_EQUATION_CERTIFICATES.find(
    ({ equation_id: registeredId }) => registeredId === equationId,
  );
  if (!certificate) throw new Error(`Missing RSD-T02 equation certificate: ${equationId}`);
  return { ...certificate.property_vector };
}

export const FIXTURE_026_RSD_T02_SUPPORT_AXES = Object.freeze([
  "input_domain",
  "transformation",
  "instrument",
  "initialization",
  "causal_observation",
  "evaluation_window",
]);

export const FIXTURE_026_RSD_T02_THRESHOLDS = deepFreeze({
  initialization_residual_ceiling: 1e-12,
  matched_step_supremum_ceiling: 1e-10,
  intervention_separation_floor: 1e-3,
  numerical_refinement_error_ceiling: 1e-8,
  probability_clip: 1e-12,
  identifiable_abstention_loss: 0.25,
  wrong_or_unjustified_decision_loss: 1,
  discrepancy_unit: "1",
  decision_loss_unit: "1",
  calibration_loss_unit: "nat",
});

export const FIXTURE_026_RSD_T02_MODEL_CONSTANTS = deepFreeze({
  canonical_fold: 2,
  backgrounds_u: [0.5, 2, 8],
  time_constants_s: [0.5, 1, 2],
  feedback_nonlinearity: 0.25,
  internal_step_s: 1 / 1024,
  output_rate_hz: 64,
  episode_horizon_s: 24,
  samples_per_episode: 1537,
  input_floor_u: 0.05,
  input_ceiling_u: 64,
});

export const FIXTURE_026_RSD_T02_RECIPES = deepFreeze([
  {
    recipe_id: "M-I1-FFL",
    equation_id: "t02-iffl-affine-reference",
    provenance_role: "evaluator-only",
    property_vector: certifiedPropertyVector("t02-iffl-affine-reference"),
    matched_step_equivalence_class: "E-STEP-ALL",
    full_panel_equivalence_class: "E-AFFINE-INPUT-MEMORY",
  },
  {
    recipe_id: "M-NONLINEAR-FEEDBACK",
    equation_id: "t02-nonlinear-output-feedback",
    provenance_role: "evaluator-only",
    property_vector: certifiedPropertyVector("t02-nonlinear-output-feedback"),
    matched_step_equivalence_class: "E-STEP-ALL",
    full_panel_equivalence_class: "E-OUTPUT-FEEDBACK",
  },
  {
    recipe_id: "M-RECEPTOR-MEMORY",
    equation_id: "t02-channel-local-reference",
    provenance_role: "evaluator-only",
    property_vector: certifiedPropertyVector("t02-channel-local-reference"),
    matched_step_equivalence_class: "E-STEP-ALL",
    full_panel_equivalence_class: "E-CHANNEL-LOCAL-MEMORY",
  },
  {
    recipe_id: "M-STATIC-HIGHPASS",
    equation_id: "t02-static-affine-highpass",
    provenance_role: "evaluator-only",
    property_vector: certifiedPropertyVector("t02-static-affine-highpass"),
    matched_step_equivalence_class: "E-STEP-ALL",
    full_panel_equivalence_class: "E-AFFINE-INPUT-MEMORY",
  },
  {
    recipe_id: "M-LOG-HIGHPASS",
    equation_id: "t02-log-difference-highpass",
    provenance_role: "evaluator-only",
    property_vector: certifiedPropertyVector("t02-log-difference-highpass"),
    matched_step_equivalence_class: "E-STEP-ALL",
    full_panel_equivalence_class: "E-LOG-INPUT-MEMORY",
  },
]);

export const FIXTURE_026_RSD_T02_ACTIONABLE_ARM_IDS = Object.freeze([
  "A-RAW",
  "B-STATIC-DIV",
  "B-STREAM",
  "B-LOG-RATIO",
  "B-DIFFERENCE",
  "B-STATE-SPACE",
  "B-RECURRENT",
  "C-MECHANISM-BANK",
  "C-DUAL",
]);

export const FIXTURE_026_RSD_T02_EVALUATOR_ONLY_ARM_ID = "O-GRAPH";

export const FIXTURE_026_RSD_T02_ARMS = deepFreeze([
  ...FIXTURE_026_RSD_T02_ACTIONABLE_ARM_IDS.map((armId) => ({
    arm_id: armId,
    role: "actionable",
    current_parity_eligible: false,
    current_ranking_eligible: false,
    activation_requirement: "implemented-projection-parity-and-confirmation-custody",
  })),
  {
    arm_id: FIXTURE_026_RSD_T02_EVALUATOR_ONLY_ARM_ID,
    role: "evaluator-only",
    current_parity_eligible: false,
    current_ranking_eligible: false,
    activation_requirement: "never-actionable",
  },
]);

function episode({
  episodeId,
  family,
  backgroundU = 2,
  pulseWidthS = null,
  periodS = null,
  rampShape = null,
  direction = null,
  durationS = null,
  channelMode = null,
  stateHandle = null,
  privileged = false,
  schedule,
}) {
  return {
    episode_id: episodeId,
    intervention_family: family,
    background_u: backgroundU,
    pulse_width_s: pulseWidthS,
    period_s: periodS,
    ramp_shape: rampShape,
    direction,
    duration_s: durationS,
    channel_mode: channelMode,
    state_handle: stateHandle,
    privileged_internal_access: privileged,
    schedule,
  };
}

const canonicalSteps = FIXTURE_026_RSD_T02_MODEL_CONSTANTS.backgrounds_u.map((background) => episode({
  episodeId: `STEP-B${String(background).replace(".", "P")}`,
  family: "canonical-step",
  backgroundU: background,
  schedule: {
    kind: "step",
    change_time_s: 0,
    from_fold: 1,
    to_fold: 2,
  },
}));

const repeatedPulses = [1 / 8, 1 / 2, 2].flatMap((width) => (
  [1 / 2, 2, 8]
    .filter((period) => width < period)
    .map((period) => episode({
      episodeId: `PULSE-W${String(width).replace(".", "P")}-P${String(period).replace(".", "P")}`,
      family: "repeated-pulse",
      pulseWidthS: width,
      periodS: period,
      schedule: {
        kind: "periodic-square-pulse",
        start_time_s: 0,
        stop_time_s: 24,
        low_fold: 1,
        high_fold: 2,
        pulse_width_s: width,
        period_s: period,
        pulse_count: Math.floor((24 - width) / period) + 1,
      },
    }))
));

const ramps = ["linear", "exponential"].flatMap((shape) => (
  ["up", "down"].flatMap((direction) => (
    [0.5, 4].map((duration) => episode({
      episodeId: `RAMP-${shape === "linear" ? "LIN" : "EXP"}-${direction.toUpperCase()}-${String(duration).replace(".", "P")}`,
      family: "ramp",
      rampShape: shape,
      direction,
      durationS: duration,
      schedule: {
        kind: "ramp-then-hold",
        start_time_s: 0,
        duration_s: duration,
        interpolation: shape === "linear" ? "linear-in-fold" : "linear-in-log-fold",
        from_fold: 1,
        to_fold: direction === "up" ? 2 : 0.5,
        terminal_hold_until_s: 24,
      },
    }))
  ))
));

export const FIXTURE_026_RSD_T02_EPISODES = deepFreeze([
  ...canonicalSteps,
  ...repeatedPulses,
  ...ramps,
  episode({
    episodeId: "RESET-H0",
    family: "opaque-state-reset",
    stateHandle: "H0",
    privileged: true,
    schedule: {
      kind: "step-with-state-reset",
      change_time_s: 0,
      from_fold: 1,
      to_fold: 2,
      intervention_time_s: 0.75,
      write_value_role: "episode-initial-steady-value",
    },
  }),
  episode({
    episodeId: "RESET-H1",
    family: "opaque-state-reset",
    stateHandle: "H1",
    privileged: true,
    schedule: {
      kind: "step-with-state-reset",
      change_time_s: 0,
      from_fold: 1,
      to_fold: 2,
      intervention_time_s: 0.75,
      write_value_role: "episode-initial-steady-value",
    },
  }),
  episode({
    episodeId: "FREEZE-H0",
    family: "opaque-state-freeze",
    stateHandle: "H0",
    privileged: true,
    schedule: {
      kind: "step-with-state-freeze",
      change_time_s: 0,
      from_fold: 1,
      to_fold: 2,
      intervention_start_s: 0.5,
      intervention_end_s: 1,
    },
  }),
  episode({
    episodeId: "FREEZE-H1",
    family: "opaque-state-freeze",
    stateHandle: "H1",
    privileged: true,
    schedule: {
      kind: "step-with-state-freeze",
      change_time_s: 0,
      from_fold: 1,
      to_fold: 2,
      intervention_start_s: 0.5,
      intervention_end_s: 1,
    },
  }),
  episode({
    episodeId: "CLAMP-OUTPUT-01",
    family: "reported-output-clamp",
    privileged: true,
    schedule: {
      kind: "step-with-output-clamp",
      change_time_s: 0,
      from_fold: 1,
      to_fold: 2,
      intervention_start_s: 0.5,
      intervention_end_s: 1,
      forced_reported_output: 0,
    },
  }),
  episode({
    episodeId: "HOLD-0P5",
    family: "interrupted-ramp-hold",
    durationS: 0.5,
    schedule: {
      kind: "paused-linear-ramp",
      start_time_s: 0,
      active_ramp_duration_s: 4,
      from_fold: 1,
      to_fold: 2,
      hold_after_active_ramp_s: 1,
      hold_duration_s: 0.5,
      terminal_hold_until_s: 24,
    },
  }),
  episode({
    episodeId: "HOLD-4",
    family: "interrupted-ramp-hold",
    durationS: 4,
    schedule: {
      kind: "paused-linear-ramp",
      start_time_s: 0,
      active_ramp_duration_s: 4,
      from_fold: 1,
      to_fold: 2,
      hold_after_active_ramp_s: 1,
      hold_duration_s: 4,
      terminal_hold_until_s: 24,
    },
  }),
  episode({
    episodeId: "RESTIM-SAME-01",
    family: "restimulation",
    channelMode: "same-channel",
    schedule: {
      kind: "two-pulse-channel-restimulation",
      low_fold: 1,
      high_fold: 2,
      first_channel: "A",
      second_channel: "A",
      first_pulse_start_s: 0,
      first_pulse_end_s: 1,
      second_pulse_start_s: 2,
      second_pulse_end_s: 3,
      terminal_hold_until_s: 24,
    },
  }),
  episode({
    episodeId: "RESTIM-CROSS-01",
    family: "restimulation",
    channelMode: "cross-channel",
    schedule: {
      kind: "two-pulse-channel-restimulation",
      low_fold: 1,
      high_fold: 2,
      first_channel: "A",
      second_channel: "B",
      first_pulse_start_s: 0,
      first_pulse_end_s: 1,
      second_pulse_start_s: 2,
      second_pulse_end_s: 3,
      terminal_hold_until_s: 24,
    },
  }),
]);

export const FIXTURE_026_RSD_T02_EPISODE_PROTOCOL_VERSION =
  "fixture-026.rsd-t02-fixed-instance-episode-protocol.v1";

export const FIXTURE_026_RSD_T02_EPISODE_PROTOCOL = deepFreeze({
  contract_version: FIXTURE_026_RSD_T02_EPISODE_PROTOCOL_VERSION,
  schedule_interpreter_semantics_version:
    "fixture-026.rsd-t02-certificate-schedule-interpreter.v1",
  episode_horizon_s: FIXTURE_026_RSD_T02_MODEL_CONSTANTS.episode_horizon_s,
  internal_step_s: FIXTURE_026_RSD_T02_MODEL_CONSTANTS.internal_step_s,
  output_rate_hz: FIXTURE_026_RSD_T02_MODEL_CONSTANTS.output_rate_hz,
  input_floor_u: FIXTURE_026_RSD_T02_MODEL_CONSTANTS.input_floor_u,
  input_ceiling_u: FIXTURE_026_RSD_T02_MODEL_CONSTANTS.input_ceiling_u,
  units: {
    time: "s",
    input: "1",
    output: "1",
    rate: "Hz",
  },
  episodes: FIXTURE_026_RSD_T02_EPISODES.map((row) => ({
    ...row,
    schedule: { ...row.schedule },
  })),
});

export const FIXTURE_026_RSD_T02_OBSERVATION_REGIMES = deepFreeze([
  {
    observation_regime_id: "O0-MATCHED-STEP",
    episode_count: 3,
    sample_rows_ceiling: 4611,
    episode_count_semantics: "per-time-constant-conditioned-model-instance",
    runtime_time_constants_s: [0.5, 1, 2],
    runtime_executions_per_recipe: 9,
    runtime_sample_rows_per_recipe: 13833,
    maximum_additional_queries: 0,
    maximum_internal_queries: 0,
    role: "mandatory-abstention-baseline",
  },
  {
    observation_regime_id: "O1-FULL-PANEL",
    episode_count: 26,
    sample_rows_ceiling: 39962,
    episode_count_semantics: "single-tau1-model-instance",
    runtime_time_constants_s: [1],
    runtime_executions_per_recipe: 26,
    runtime_sample_rows_per_recipe: 39962,
    maximum_additional_queries: 23,
    maximum_internal_queries: 5,
    role: "primary-fixed-panel",
  },
  {
    observation_regime_id: "O2-SELECT6",
    episode_count: 9,
    sample_rows_ceiling: 13833,
    episode_count_semantics: "non-executable-selection-ceiling",
    runtime_time_constants_s: null,
    runtime_executions_per_recipe: null,
    runtime_sample_rows_per_recipe: null,
    maximum_additional_queries: 6,
    maximum_internal_queries: 2,
    role: "secondary-active-design",
  },
]);

export const FIXTURE_026_RSD_T02_COST_VECTOR_KEYS = Object.freeze([
  "episodes",
  "sample_rows",
  "serialized_observation_bytes",
  "input_commands",
  "internal_resets",
  "internal_freezes",
  "output_clamps",
  "channel_switches",
  "state_writes",
  "scalar_operations",
  "transcendental_evaluations",
  "retained_state_bytes",
  "parameter_bytes",
  "tuning_trials",
  "wall_seconds",
  "later_joules",
]);

export const FIXTURE_026_RSD_T02_PAIR_CERTIFICATES = deepFreeze([
  pair("M-I1-FFL", "M-NONLINEAR-FEEDBACK", "separated", "CLAMP-OUTPUT-01", "reported-output-feedback"),
  pair("M-I1-FFL", "M-RECEPTOR-MEMORY", "separated", "RESTIM-CROSS-01", "channel-local-state"),
  pair("M-I1-FFL", "M-STATIC-HIGHPASS", "equivalent", null, "shared-operational-property-vector"),
  pair("M-I1-FFL", "M-LOG-HIGHPASS", "separated", "RAMP-LIN-UP-0P5", "drive-transform"),
  pair("M-NONLINEAR-FEEDBACK", "M-RECEPTOR-MEMORY", "separated", "CLAMP-OUTPUT-01", "reported-output-feedback"),
  pair("M-NONLINEAR-FEEDBACK", "M-STATIC-HIGHPASS", "separated", "CLAMP-OUTPUT-01", "reported-output-feedback"),
  pair("M-NONLINEAR-FEEDBACK", "M-LOG-HIGHPASS", "separated", "CLAMP-OUTPUT-01", "reported-output-feedback"),
  pair("M-RECEPTOR-MEMORY", "M-STATIC-HIGHPASS", "separated", "RESTIM-CROSS-01", "channel-local-state"),
  pair("M-RECEPTOR-MEMORY", "M-LOG-HIGHPASS", "separated", "RESTIM-CROSS-01", "channel-local-state"),
  pair("M-STATIC-HIGHPASS", "M-LOG-HIGHPASS", "separated", "RAMP-LIN-UP-0P5", "drive-transform"),
]);

function pair(leftRecipeId, rightRecipeId, fullPanelStatus, separatingEpisodeId, propertyScope) {
  const constructionDistanceLowerBound = separatingEpisodeId?.startsWith("RAMP-")
    ? 0.07
    : separatingEpisodeId === "RESTIM-CROSS-01"
      ? 0.23
      : separatingEpisodeId === "CLAMP-OUTPUT-01"
        ? 0.23
        : null;
  return {
    pair_id: `${leftRecipeId}__${rightRecipeId}`,
    left_recipe_id: leftRecipeId,
    right_recipe_id: rightRecipeId,
    matched_step_status: "equivalent",
    full_panel_status: fullPanelStatus,
    separating_episode_id: separatingEpisodeId,
    property_scope: propertyScope,
    certificate_status: fullPanelStatus === "equivalent"
      ? "analytic-input-output-isomorphism"
      : "numerical-public-development-construction",
    certificate_scope: fullPanelStatus === "equivalent"
      ? "all-positive-input-histories-under-registered-affine-interface"
      : "b2U-tau1s-horizon24s-output64Hz-binary64-rk4-dt1over1024-vs-dt1over2048-left-limit-events",
    construction_distance_lower_bound: constructionDistanceLowerBound,
    construction_distance_upper_bound: fullPanelStatus === "equivalent" ? 0 : null,
    construction_refinement_error_ceiling: fullPanelStatus === "equivalent" ? 0 : 1e-12,
  };
}

export const FIXTURE_026_RSD_T02_FLOOR_REGISTRY = deepFreeze({
  stratum_id: "T02-FLOOR",
  models: [
    {
      model_id: "source-shaped-singular",
      equation_id: "t02-floor-singular-input-degradation",
      asymptotic_floor_truth: "positive",
    },
    {
      model_id: "exact-equivariance-control",
      equation_id: "t02-floor-exact-equivariance-algebraic-output",
      asymptotic_floor_truth: "zero-exact",
    },
    {
      model_id: "regular-perturbation-control",
      equation_id: "t02-floor-regular-output-perturbation",
      asymptotic_floor_truth: "zero-limit",
    },
  ],
  epsilon_values: [1e-1, 1e-2, 1e-3, 1e-4, 1e-5, 1e-6, 1e-7],
  scale_factors: [0.5, 2, 4, 8, 20],
  primary_endpoint: "maximum-instantaneous-discrepancy",
  primary_norm: "supremum",
  rms_role: "diagnostic-only",
  slow_time_constant_s: 1,
  horizon_s: 8,
  fast_grid_points: 1025,
  slow_grid_points: 513,
  paired_rows_per_cell_ceiling: 1537,
  nominal_cell_count: 105,
  nominal_paired_rows_ceiling: 161385,
  asymptotic_claim_authority: false,
});

export const FIXTURE_026_RSD_T02_REGISTRY = deepFreeze({
  version: FIXTURE_026_RSD_T02_CONTRACT_VERSION,
  fixture: "F-026",
  protocol: "RSD-T02",
  authority: "contract-foundation-only",
  partition: "public-development",
  information_cut_status: "registered-projection-no-secret-custody",
  comparison_authority: false,
  result_authority: "NO_RESULT",
  strata: ["T02-MECH", "T02-FLOOR"],
  properties: [...FIXTURE_026_RSD_T02_PROPERTY_KEYS],
  support_axes: [...FIXTURE_026_RSD_T02_SUPPORT_AXES],
  thresholds: { ...FIXTURE_026_RSD_T02_THRESHOLDS },
  model_constants: {
    ...FIXTURE_026_RSD_T02_MODEL_CONSTANTS,
    backgrounds_u: [...FIXTURE_026_RSD_T02_MODEL_CONSTANTS.backgrounds_u],
    time_constants_s: [...FIXTURE_026_RSD_T02_MODEL_CONSTANTS.time_constants_s],
  },
  equation_certificates: FIXTURE_026_RSD_T02_EQUATION_CERTIFICATES.map((certificate) => ({
    ...certificate,
    property_vector: { ...certificate.property_vector },
  })),
  recipes: FIXTURE_026_RSD_T02_RECIPES.map((recipe) => ({
    ...recipe,
    property_vector: { ...recipe.property_vector },
  })),
  arms: FIXTURE_026_RSD_T02_ARMS.map((arm) => ({ ...arm })),
  episodes: FIXTURE_026_RSD_T02_EPISODES.map((row) => ({
    ...row,
    schedule: { ...row.schedule },
  })),
  observation_regimes: FIXTURE_026_RSD_T02_OBSERVATION_REGIMES.map((row) => ({ ...row })),
  cost_vector_keys: [...FIXTURE_026_RSD_T02_COST_VECTOR_KEYS],
  pair_certificates: FIXTURE_026_RSD_T02_PAIR_CERTIFICATES.map((row) => ({ ...row })),
  floor: {
    ...FIXTURE_026_RSD_T02_FLOOR_REGISTRY,
    models: FIXTURE_026_RSD_T02_FLOOR_REGISTRY.models.map((model) => ({ ...model })),
    epsilon_values: [...FIXTURE_026_RSD_T02_FLOOR_REGISTRY.epsilon_values],
    scale_factors: [...FIXTURE_026_RSD_T02_FLOOR_REGISTRY.scale_factors],
  },
});

function deepFreeze(value) {
  if (value && typeof value === "object" && !Object.isFrozen(value)) {
    Object.freeze(value);
    for (const nested of Object.values(value)) deepFreeze(nested);
  }
  return value;
}

function exactKeys(value, expectedKeys) {
  return value
    && typeof value === "object"
    && !Array.isArray(value)
    && Object.keys(value).length === expectedKeys.length
    && expectedKeys.every((key) => Object.hasOwn(value, key));
}

export function assertFixture026RsdT02Registry(registry) {
  const topLevelKeys = [
    "version",
    "fixture",
    "protocol",
    "authority",
    "partition",
    "information_cut_status",
    "comparison_authority",
    "result_authority",
    "strata",
    "properties",
    "support_axes",
    "thresholds",
    "model_constants",
    "equation_certificates",
    "recipes",
    "arms",
    "episodes",
    "observation_regimes",
    "cost_vector_keys",
    "pair_certificates",
    "floor",
  ];
  if (
    !exactKeys(registry, topLevelKeys)
    || registry.version !== FIXTURE_026_RSD_T02_CONTRACT_VERSION
    || registry.fixture !== "F-026"
    || registry.protocol !== "RSD-T02"
    || registry.authority !== "contract-foundation-only"
    || registry.partition !== "public-development"
    || registry.information_cut_status !== "registered-projection-no-secret-custody"
    || registry.comparison_authority !== false
    || registry.result_authority !== "NO_RESULT"
    || !isDeepStrictEqual(registry, FIXTURE_026_RSD_T02_REGISTRY)
  ) throw new Error("Fixture 026 RSD-T02 registry has unknown fields, values, or authority.");
  if (
    registry.equation_certificates.length !== 5
    || registry.recipes.length !== 5
    || registry.arms.length !== 10
    || registry.episodes.length !== 26
    || registry.observation_regimes.length !== 3
    || registry.pair_certificates.length !== 10
    || registry.floor.nominal_cell_count !== 105
  ) throw new Error("Fixture 026 RSD-T02 registry cardinality differs from v1.");
  if (
    JSON.stringify(registry.properties) !== JSON.stringify(FIXTURE_026_RSD_T02_PROPERTY_KEYS)
    || JSON.stringify(registry.support_axes) !== JSON.stringify(FIXTURE_026_RSD_T02_SUPPORT_AXES)
    || JSON.stringify(registry.cost_vector_keys) !== JSON.stringify(FIXTURE_026_RSD_T02_COST_VECTOR_KEYS)
  ) throw new Error("Fixture 026 RSD-T02 property, support, or cost registry differs from v1.");
  const episodeIds = new Set(registry.episodes.map(({ episode_id: episodeId }) => episodeId));
  if (episodeIds.size !== 26) throw new Error("Fixture 026 RSD-T02 episode IDs are not unique.");
  const recipeIds = new Set(registry.recipes.map(({ recipe_id: recipeId }) => recipeId));
  const pairIds = new Set();
  for (const certificate of registry.pair_certificates) {
    const unorderedPairId = [certificate.left_recipe_id, certificate.right_recipe_id]
      .sort()
      .join("__");
    if (
      !recipeIds.has(certificate.left_recipe_id)
      || !recipeIds.has(certificate.right_recipe_id)
      || certificate.left_recipe_id === certificate.right_recipe_id
      || pairIds.has(unorderedPairId)
    ) throw new Error("Fixture 026 RSD-T02 pair coverage is incomplete or duplicated.");
    pairIds.add(unorderedPairId);
    if (
      certificate.full_panel_status === "separated"
      && !episodeIds.has(certificate.separating_episode_id)
    ) throw new Error("Fixture 026 RSD-T02 pair certificate names an unknown episode.");
    if (
      certificate.full_panel_status === "equivalent"
      && certificate.separating_episode_id !== null
    ) throw new Error("Fixture 026 RSD-T02 equivalent pair has a separating episode.");
  }
  if (pairIds.size !== recipeIds.size * (recipeIds.size - 1) / 2) {
    throw new Error("Fixture 026 RSD-T02 pair coverage is incomplete or duplicated.");
  }
  if (!registry.arms.every((arm) => (
    arm.current_parity_eligible === false
    && arm.current_ranking_eligible === false
  ))) throw new Error("Fixture 026 RSD-T02 arms became eligible before implementation.");
  return registry;
}

export function classifyFixture026RsdT02Pair({
  distance_infinity: distanceInfinity,
  numerical_refinement_error: numericalRefinementError,
  analytic_equivalence: analyticEquivalence = false,
}) {
  if (
    !Number.isFinite(distanceInfinity)
    || distanceInfinity < 0
    || !Number.isFinite(numericalRefinementError)
    || numericalRefinementError < 0
    || typeof analyticEquivalence !== "boolean"
  ) throw new TypeError("Fixture 026 RSD-T02 pair evidence is invalid.");
  if (analyticEquivalence) {
    if (
      numericalRefinementError
        > FIXTURE_026_RSD_T02_THRESHOLDS.numerical_refinement_error_ceiling
      || distanceInfinity + numericalRefinementError
        > FIXTURE_026_RSD_T02_THRESHOLDS.matched_step_supremum_ceiling
    ) throw new Error("Fixture 026 RSD-T02 analytic equivalence conflicts with its numerical bound.");
    return "equivalent";
  }
  if (
    distanceInfinity - numericalRefinementError
      >= FIXTURE_026_RSD_T02_THRESHOLDS.intervention_separation_floor
    && numericalRefinementError <= FIXTURE_026_RSD_T02_THRESHOLDS.numerical_refinement_error_ceiling
  ) return "separated";
  return "unresolved";
}

function clippedProbability(value) {
  if (!Number.isFinite(value) || value < 0 || value > 1) {
    throw new TypeError("Fixture 026 RSD-T02 probability must be in [0,1].");
  }
  const clip = FIXTURE_026_RSD_T02_THRESHOLDS.probability_clip;
  return Math.min(1 - clip, Math.max(clip, value));
}

export function scoreFixture026RsdT02Decision({
  identifiable,
  identifiability_probability: identifiabilityProbability,
  true_value: trueValue,
  posterior_probability_true_value: posteriorProbabilityTrueValue,
  action,
  predicted_value: predictedValue = null,
}) {
  if (typeof identifiable !== "boolean" || !["decide", "abstain"].includes(action)) {
    throw new TypeError("Fixture 026 RSD-T02 decision record is invalid.");
  }
  const pIdentifiable = clippedProbability(identifiabilityProbability);
  let calibrationLoss = identifiable ? -Math.log(pIdentifiable) : -Math.log(1 - pIdentifiable);
  if (identifiable) calibrationLoss -= Math.log(clippedProbability(posteriorProbabilityTrueValue));
  let decisionLoss;
  if (!identifiable) {
    decisionLoss = action === "abstain"
      ? 0
      : FIXTURE_026_RSD_T02_THRESHOLDS.wrong_or_unjustified_decision_loss;
  }
  else if (action === "abstain") {
    decisionLoss = FIXTURE_026_RSD_T02_THRESHOLDS.identifiable_abstention_loss;
  } else {
    decisionLoss = Object.is(predictedValue, trueValue)
      ? 0
      : FIXTURE_026_RSD_T02_THRESHOLDS.wrong_or_unjustified_decision_loss;
  }
  return Object.freeze({
    calibration_loss_nats: calibrationLoss,
    decision_loss: decisionLoss,
    correct_abstention: !identifiable && action === "abstain",
  });
}
