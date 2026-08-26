import {
  FIXTURE_026_RSD_T02_EPISODES,
  FIXTURE_026_RSD_T02_EQUATION_CERTIFICATES,
  FIXTURE_026_RSD_T02_MODEL_CONSTANTS,
  FIXTURE_026_RSD_T02_PROPERTY_KEYS,
  FIXTURE_026_RSD_T02_RECIPES,
} from "./rsd-t02-contract.mjs";

const RECIPE_BY_ID = new Map(FIXTURE_026_RSD_T02_RECIPES.map((recipe) => [
  recipe.recipe_id,
  recipe,
]));

function recipeFor(recipeId) {
  const recipe = RECIPE_BY_ID.get(recipeId);
  if (!recipe) throw new RangeError(`Unknown fixture 026 RSD-T02 recipe: ${recipeId}`);
  return recipe;
}

function assertFinitePositive(value, label) {
  if (!Number.isFinite(value) || value <= 0) throw new TypeError(`${label} must be positive.`);
}

export function initialFixture026RsdT02State(recipeId) {
  switch (recipeFor(recipeId).equation_id) {
    case "t02-iffl-affine-reference": return Object.freeze([1, 0]);
    case "t02-nonlinear-output-feedback": return Object.freeze([1, 0]);
    case "t02-channel-local-reference": return Object.freeze([1, 1]);
    case "t02-static-affine-highpass": return Object.freeze([0, 0]);
    case "t02-log-difference-highpass": return Object.freeze([0, 0]);
    default: throw new Error("Fixture 026 RSD-T02 equation registry is incomplete.");
  }
}

export function deriveFixture026RsdT02PropertiesFromEquation(equationId) {
  const certificate = FIXTURE_026_RSD_T02_EQUATION_CERTIFICATES.find(
    (row) => row.equation_id === equationId,
  );
  if (!certificate) throw new RangeError(`Unknown fixture 026 RSD-T02 equation: ${equationId}`);
  const properties = {};
  for (const key of FIXTURE_026_RSD_T02_PROPERTY_KEYS) {
    properties[key] = certificate.property_vector[key];
  }
  return Object.freeze(properties);
}

function evaluate(recipeId, state, {
  v_by_channel: vByChannel,
  active_channel: activeChannel,
  time_constant_s: timeConstantS,
  reported_output_clamped: reportedOutputClamped,
}) {
  if (!Array.isArray(state) || state.length !== 2 || !state.every(Number.isFinite)) {
    throw new TypeError("Fixture 026 RSD-T02 state must contain two finite scalars.");
  }
  if (
    !vByChannel
    || !["A", "B"].includes(activeChannel)
    || !Number.isFinite(vByChannel.A)
    || !Number.isFinite(vByChannel.B)
    || vByChannel.A <= 0
    || vByChannel.B <= 0
  ) throw new TypeError("Fixture 026 RSD-T02 channel input is invalid.");
  assertFinitePositive(timeConstantS, "Fixture 026 RSD-T02 time constant");
  if (typeof reportedOutputClamped !== "boolean") {
    throw new TypeError("Fixture 026 RSD-T02 clamp state must be boolean.");
  }
  const fold = FIXTURE_026_RSD_T02_MODEL_CONSTANTS.canonical_fold;
  const denominator = fold - 1;
  const v = vByChannel[activeChannel];
  const equationId = recipeFor(recipeId).equation_id;
  let internalOutput;
  let derivative;

  switch (equationId) {
    case "t02-iffl-affine-reference": {
      const [reference] = state;
      internalOutput = (v - reference) / denominator;
      derivative = [(v - reference) / timeConstantS, 0];
      break;
    }
    case "t02-nonlinear-output-feedback": {
      const [adaptation] = state;
      internalOutput = (v - adaptation) / denominator;
      const reportedOutput = reportedOutputClamped ? 0 : internalOutput;
      const nonlinear = FIXTURE_026_RSD_T02_MODEL_CONSTANTS.feedback_nonlinearity
        * (v - 1)
        * (v - fold)
        * reportedOutput ** 2;
      derivative = [
        (denominator * reportedOutput + nonlinear) / timeConstantS,
        0,
      ];
      break;
    }
    case "t02-channel-local-reference": {
      const channelIndex = activeChannel === "A" ? 0 : 1;
      const reference = state[channelIndex];
      internalOutput = (v - reference) / denominator;
      derivative = [0, 0];
      derivative[channelIndex] = (v - reference) / timeConstantS;
      break;
    }
    case "t02-static-affine-highpass": {
      const [filterState] = state;
      const transformed = (v - 1) / denominator;
      internalOutput = transformed - filterState;
      derivative = [(transformed - filterState) / timeConstantS, 0];
      break;
    }
    case "t02-log-difference-highpass": {
      const [filterState] = state;
      const transformed = Math.log(v) / Math.log(fold);
      internalOutput = transformed - filterState;
      derivative = [(transformed - filterState) / timeConstantS, 0];
      break;
    }
    default: throw new Error("Fixture 026 RSD-T02 equation registry is incomplete.");
  }
  return {
    derivative,
    internal_output: internalOutput,
    reported_output: reportedOutputClamped ? 0 : internalOutput,
  };
}

function addScaled(state, derivative, scale) {
  return state.map((value, index) => value + derivative[index] * scale);
}

function rk4Step(recipeId, state, timeS, stepS, contextAt) {
  const c1 = contextAt(timeS);
  const k1 = evaluate(recipeId, state, c1).derivative;
  const c2 = contextAt(timeS + stepS / 2);
  const k2 = evaluate(recipeId, addScaled(state, k1, stepS / 2), c2).derivative;
  const k3 = evaluate(recipeId, addScaled(state, k2, stepS / 2), c2).derivative;
  const endTimeS = timeS + stepS;
  const leftLimitEndTimeS = endTimeS
    - 4 * Number.EPSILON * Math.max(1, Math.abs(endTimeS));
  const c4 = contextAt(leftLimitEndTimeS);
  const k4 = evaluate(recipeId, addScaled(state, k3, stepS), c4).derivative;
  return state.map((value, index) => value + (stepS / 6) * (
    k1[index] + 2 * k2[index] + 2 * k3[index] + k4[index]
  ));
}

export function simulateFixture026RsdT02Episode({
  recipe_id: recipeId,
  horizon_s: horizonS = 4,
  internal_step_s: internalStepS = FIXTURE_026_RSD_T02_MODEL_CONSTANTS.internal_step_s,
  output_rate_hz: outputRateHz = FIXTURE_026_RSD_T02_MODEL_CONSTANTS.output_rate_hz,
  time_constant_s: timeConstantS = 1,
  input_at: inputAt,
  active_channel_at: activeChannelAt = () => "A",
  output_clamped_at: outputClampedAt = () => false,
}) {
  recipeFor(recipeId);
  assertFinitePositive(horizonS, "Fixture 026 RSD-T02 horizon");
  assertFinitePositive(internalStepS, "Fixture 026 RSD-T02 internal step");
  assertFinitePositive(outputRateHz, "Fixture 026 RSD-T02 output rate");
  assertFinitePositive(timeConstantS, "Fixture 026 RSD-T02 time constant");
  if (
    typeof inputAt !== "function"
    || typeof activeChannelAt !== "function"
    || typeof outputClampedAt !== "function"
  ) throw new TypeError("Fixture 026 RSD-T02 episode functions are required.");
  const internalSteps = horizonS / internalStepS;
  const internalStepsPerSample = 1 / (internalStepS * outputRateHz);
  if (
    !Number.isInteger(internalSteps)
    || !Number.isInteger(internalStepsPerSample)
    || internalStepsPerSample < 1
  ) throw new RangeError("Fixture 026 RSD-T02 horizon and rates must align exactly.");

  const contextAt = (timeS) => {
    const input = inputAt(timeS);
    const vByChannel = typeof input === "number" ? { A: input, B: input } : input;
    return {
      v_by_channel: vByChannel,
      active_channel: activeChannelAt(timeS),
      time_constant_s: timeConstantS,
      reported_output_clamped: outputClampedAt(timeS),
    };
  };
  let state = [...initialFixture026RsdT02State(recipeId)];
  const samples = [];
  for (let internalIndex = 0; internalIndex <= internalSteps; internalIndex += 1) {
    const timeS = internalIndex * internalStepS;
    if (internalIndex % internalStepsPerSample === 0) {
      const observation = evaluate(recipeId, state, contextAt(timeS));
      samples.push(Object.freeze({
        time_s: timeS,
        output: observation.reported_output,
        internal_output: observation.internal_output,
      }));
    }
    if (internalIndex < internalSteps) {
      state = rk4Step(recipeId, state, timeS, internalStepS, contextAt);
    }
  }
  return Object.freeze({
    recipe_id: recipeId,
    samples: Object.freeze(samples),
    final_state: Object.freeze(state),
    authority: "construction-only",
    result: "NO_RESULT",
  });
}

export function simulateFixture026RsdT02CertificateEpisode({
  recipe_id: recipeId,
  episode_id: episodeId,
  internal_step_s: internalStepS = FIXTURE_026_RSD_T02_MODEL_CONSTANTS.internal_step_s,
}) {
  const episode = FIXTURE_026_RSD_T02_EPISODES.find(
    ({ episode_id: registeredId }) => registeredId === episodeId,
  );
  if (!episode) throw new RangeError(`Unknown fixture 026 RSD-T02 episode: ${episodeId}`);
  const { schedule } = episode;
  let inputAt;
  let activeChannelAt = () => "A";
  let outputClampedAt = () => false;

  if (schedule.kind === "ramp-then-hold") {
    inputAt = (timeS) => {
      const phase = Math.max(0, Math.min(1, (
        timeS - schedule.start_time_s
      ) / schedule.duration_s));
      if (schedule.interpolation === "linear-in-fold") {
        return schedule.from_fold + phase * (schedule.to_fold - schedule.from_fold);
      }
      return Math.exp(
        Math.log(schedule.from_fold)
        + phase * (Math.log(schedule.to_fold) - Math.log(schedule.from_fold)),
      );
    };
  } else if (schedule.kind === "step-with-output-clamp") {
    inputAt = () => schedule.to_fold;
    outputClampedAt = (timeS) => (
      timeS >= schedule.intervention_start_s
      && timeS < schedule.intervention_end_s
    );
  } else if (schedule.kind === "two-pulse-channel-restimulation") {
    inputAt = (timeS) => {
      const input = { A: schedule.low_fold, B: schedule.low_fold };
      if (
        timeS >= schedule.first_pulse_start_s
        && timeS < schedule.first_pulse_end_s
      ) input[schedule.first_channel] = schedule.high_fold;
      if (
        timeS >= schedule.second_pulse_start_s
        && timeS < schedule.second_pulse_end_s
      ) input[schedule.second_channel] = schedule.high_fold;
      return input;
    };
    activeChannelAt = (timeS) => (
      timeS < schedule.second_pulse_start_s
        ? schedule.first_channel
        : schedule.second_channel
    );
  } else {
    throw new RangeError(
      `Fixture 026 RSD-T02 episode ${episodeId} is not a registered pair-certificate episode.`,
    );
  }

  return simulateFixture026RsdT02Episode({
    recipe_id: recipeId,
    horizon_s: FIXTURE_026_RSD_T02_MODEL_CONSTANTS.episode_horizon_s,
    internal_step_s: internalStepS,
    time_constant_s: 1,
    input_at: inputAt,
    active_channel_at: activeChannelAt,
    output_clamped_at: outputClampedAt,
  });
}

export function fixture026RsdT02CanonicalStep(timeS, timeConstantS) {
  if (!Number.isFinite(timeS) || timeS < 0) throw new TypeError("Canonical-step time is invalid.");
  assertFinitePositive(timeConstantS, "Canonical-step time constant");
  return Math.exp(-timeS / timeConstantS);
}

export function fixture026RsdT02OpaqueStatePermutation(initializationId) {
  if (typeof initializationId !== "string" || !/^[0-9a-f]{64}$/u.test(initializationId)) {
    throw new TypeError("Fixture 026 RSD-T02 initialization ID must be lowercase SHA-256 hex.");
  }
  return Object.freeze(parseInt(initializationId.slice(-2), 16) % 2 === 0 ? [0, 1] : [1, 0]);
}
