import {
  canonicalize,
  sha256Hex,
} from "../lib/checkpoint-ledger.mjs";
import {
  FIXTURE_026_RSD_T02_EPISODES,
  FIXTURE_026_RSD_T02_MODEL_CONSTANTS,
  FIXTURE_026_RSD_T02_RECIPES,
} from "./rsd-t02-contract.mjs";
import {
  simulateFixture026RsdT02Episode,
} from "./rsd-t02-models.mjs";

export const FIXTURE_026_RSD_T02_GENERATOR_VERSION = "fixture-026.rsd-t02-generator.v1";
export const FIXTURE_026_RSD_T02_TRANSCRIPT_VERSION = "fixture-026.rsd-t02-transcript.v1";

const COMMAND_KEYS = Object.freeze([
  "schema", "contract_version", "artifact", "track", "partition", "profile", "seed",
  "execution_id", "command_id", "recipe_id", "equation_id", "initialization_id",
  "episode_id", "intervention_family", "regime_membership", "background_u",
  "time_constant_s", "horizon_s", "internal_step_s", "output_rate_hz", "schedule",
]);
const TRANSCRIPT_KEYS = Object.freeze([
  ...COMMAND_KEYS,
  "samples", "final_state", "projection_sha256", "projection_utf8_bytes",
  "reported_output_sha256", "internal_output_sha256", "authority", "result_label",
]);
const SAMPLE_KEYS = Object.freeze([
  "ordinal", "time_s", "input_a_u", "input_b_u", "active_channel",
  "reported_output", "internal_output", "output_clamped", "state_reset_applied",
  "state_freeze_active",
]);

function exactKeys(value, keys) {
  return value
    && typeof value === "object"
    && !Array.isArray(value)
    && Object.keys(value).length === keys.length
    && keys.every((key) => Object.hasOwn(value, key));
}

function finitePositive(value) {
  return Number.isFinite(value) && value > 0;
}

function canonicalSeed(value) {
  return typeof value === "string"
    && /^(0|[1-9][0-9]{0,19})$/u.test(value)
    && BigInt(value) <= 0xffff_ffff_ffff_ffffn;
}

function recipeFor(recipeId) {
  const recipe = FIXTURE_026_RSD_T02_RECIPES.find(({ recipe_id: id }) => id === recipeId);
  if (!recipe) throw new RangeError(`Unknown Fixture 026 RSD-T02 recipe: ${recipeId}`);
  return recipe;
}

function episodeFor(episodeId) {
  const episode = FIXTURE_026_RSD_T02_EPISODES.find(({ episode_id: id }) => id === episodeId);
  if (!episode) throw new RangeError(`Unknown Fixture 026 RSD-T02 episode: ${episodeId}`);
  return episode;
}

function scheduleHash(schedule) {
  return sha256Hex(canonicalize(schedule));
}

function publicSchedule(episode) {
  return episode.state_handle === null
    ? { ...episode.schedule }
    : { ...episode.schedule, opaque_state_handle: episode.state_handle };
}

export function fixture026RsdT02InitializationId(seed, backgroundU, timeConstantS) {
  if (
    !canonicalSeed(seed)
    || !FIXTURE_026_RSD_T02_MODEL_CONSTANTS.backgrounds_u.includes(backgroundU)
    || !FIXTURE_026_RSD_T02_MODEL_CONSTANTS.time_constants_s.includes(timeConstantS)
  ) throw new TypeError("Fixture 026 RSD-T02 initialization coordinates are invalid.");
  const coordinates = Buffer.alloc(24);
  coordinates.writeBigUInt64LE(BigInt(seed), 0);
  coordinates.writeDoubleLE(backgroundU, 8);
  coordinates.writeDoubleLE(timeConstantS, 16);
  return sha256Hex(Buffer.concat([
    Buffer.from("F026:RSD-T02:public-development:initialization:v1\0", "ascii"),
    coordinates,
  ]));
}

export function buildFixture026RsdT02ExecutionDescriptors() {
  const canonical = FIXTURE_026_RSD_T02_EPISODES.filter(
    ({ intervention_family: family }) => family === "canonical-step",
  );
  const conditionedSteps = FIXTURE_026_RSD_T02_MODEL_CONSTANTS.time_constants_s.flatMap(
    (timeConstantS) => canonical.map((episode) => Object.freeze({
      execution_id: `O0-${episode.episode_id}-TAU${String(timeConstantS).replace(".", "P")}`,
      episode_id: episode.episode_id,
      background_u: episode.background_u,
      time_constant_s: timeConstantS,
      regime_membership: Object.freeze(["O0-MATCHED-STEP"]),
    })),
  );
  const fixedPanel = FIXTURE_026_RSD_T02_EPISODES.map((episode) => Object.freeze({
    execution_id: `O1-${episode.episode_id}`,
    episode_id: episode.episode_id,
    background_u: episode.intervention_family === "canonical-step" ? episode.background_u : 2,
    time_constant_s: 1,
    regime_membership: Object.freeze(["O1-FULL-PANEL"]),
  }));
  return Object.freeze([...conditionedSteps, ...fixedPanel]);
}

export function buildFixture026RsdT02WorkUnits({ profile, seeds }) {
  if (!new Set(["smoke", "development"]).has(profile)) {
    throw new TypeError("Fixture 026 RSD-T02 profile is invalid.");
  }
  if (
    !Array.isArray(seeds)
    || seeds.length < 1
    || seeds.some((seed) => !canonicalSeed(seed))
    || new Set(seeds).size !== seeds.length
  ) {
    throw new TypeError("Fixture 026 RSD-T02 public seeds are invalid.");
  }
  const descriptors = buildFixture026RsdT02ExecutionDescriptors();
  return Object.freeze(seeds.flatMap((seed) => FIXTURE_026_RSD_T02_RECIPES.flatMap(
    ({ recipe_id: recipeId }) => descriptors.map((descriptor) => Object.freeze({
      profile,
      seed,
      recipe_id: recipeId,
      ...descriptor,
    })),
  )));
}

export function buildFixture026RsdT02EpisodeCommand(unit) {
  if (!unit || typeof unit !== "object" || Array.isArray(unit)) {
    throw new TypeError("Fixture 026 RSD-T02 work unit is invalid.");
  }
  const recipe = recipeFor(unit.recipe_id);
  const episode = episodeFor(unit.episode_id);
  const registered = buildFixture026RsdT02ExecutionDescriptors().find(
    ({ execution_id: id }) => id === unit.execution_id,
  );
  if (
    !registered
    || registered.episode_id !== unit.episode_id
    || registered.background_u !== unit.background_u
    || registered.time_constant_s !== unit.time_constant_s
    || canonicalize(registered.regime_membership) !== canonicalize(unit.regime_membership)
    || !new Set(["smoke", "development"]).has(unit.profile)
    || !canonicalSeed(unit.seed)
  ) throw new Error("Fixture 026 RSD-T02 work unit differs from the frozen execution grid.");
  const body = {
    schema: 1,
    contract_version: FIXTURE_026_RSD_T02_GENERATOR_VERSION,
    artifact: "fixture-026",
    track: "RSD-T02",
    partition: "public-development",
    profile: unit.profile,
    seed: unit.seed,
    execution_id: unit.execution_id,
    recipe_id: recipe.recipe_id,
    equation_id: recipe.equation_id,
    initialization_id: fixture026RsdT02InitializationId(
      unit.seed,
      unit.background_u,
      unit.time_constant_s,
    ),
    episode_id: episode.episode_id,
    intervention_family: episode.intervention_family,
    regime_membership: [...unit.regime_membership],
    background_u: unit.background_u,
    time_constant_s: unit.time_constant_s,
    horizon_s: FIXTURE_026_RSD_T02_MODEL_CONSTANTS.episode_horizon_s,
    internal_step_s: FIXTURE_026_RSD_T02_MODEL_CONSTANTS.internal_step_s,
    output_rate_hz: FIXTURE_026_RSD_T02_MODEL_CONSTANTS.output_rate_hz,
    schedule: publicSchedule(episode),
  };
  return Object.freeze({
    ...body,
    schedule: Object.freeze(body.schedule),
    regime_membership: Object.freeze(body.regime_membership),
    command_id: sha256Hex(canonicalize(body)),
  });
}

export function assertFixture026RsdT02EpisodeCommand(command) {
  if (!exactKeys(command, COMMAND_KEYS)) {
    throw new Error("Fixture 026 RSD-T02 command has missing or unknown fields.");
  }
  const recipe = recipeFor(command.recipe_id);
  const episode = episodeFor(command.episode_id);
  const descriptor = buildFixture026RsdT02ExecutionDescriptors().find(
    ({ execution_id: id }) => id === command.execution_id,
  );
  const { command_id: ignored, ...body } = command;
  void ignored;
  if (
    command.schema !== 1
    || command.contract_version !== FIXTURE_026_RSD_T02_GENERATOR_VERSION
    || command.artifact !== "fixture-026"
    || command.track !== "RSD-T02"
    || command.partition !== "public-development"
    || !new Set(["smoke", "development"]).has(command.profile)
    || !canonicalSeed(command.seed)
    || !descriptor
    || descriptor.episode_id !== command.episode_id
    || descriptor.background_u !== command.background_u
    || descriptor.time_constant_s !== command.time_constant_s
    || canonicalize(descriptor.regime_membership) !== canonicalize(command.regime_membership)
    || command.equation_id !== recipe.equation_id
    || command.intervention_family !== episode.intervention_family
    || !/^[0-9a-f]{64}$/u.test(command.initialization_id)
    || command.initialization_id !== fixture026RsdT02InitializationId(
      command.seed,
      command.background_u,
      command.time_constant_s,
    )
    || !Array.isArray(command.regime_membership)
    || command.regime_membership.length < 1
    || command.regime_membership.some((value) => !new Set(["O0-MATCHED-STEP", "O1-FULL-PANEL"]).has(value))
    || !finitePositive(command.background_u)
    || !finitePositive(command.time_constant_s)
    || command.horizon_s !== FIXTURE_026_RSD_T02_MODEL_CONSTANTS.episode_horizon_s
    || command.internal_step_s !== FIXTURE_026_RSD_T02_MODEL_CONSTANTS.internal_step_s
    || command.output_rate_hz !== FIXTURE_026_RSD_T02_MODEL_CONSTANTS.output_rate_hz
    || canonicalize(command.schedule) !== canonicalize(publicSchedule(episode))
    || command.command_id !== sha256Hex(canonicalize(body))
  ) throw new Error("Fixture 026 RSD-T02 command violates the frozen generator contract.");
  return command;
}

function rampValue(schedule, timeS) {
  const phase = Math.max(0, Math.min(1, (timeS - schedule.start_time_s) / schedule.duration_s));
  if (schedule.interpolation === "linear-in-fold") {
    return schedule.from_fold + phase * (schedule.to_fold - schedule.from_fold);
  }
  return Math.exp(
    Math.log(schedule.from_fold)
    + phase * (Math.log(schedule.to_fold) - Math.log(schedule.from_fold)),
  );
}

function pausedRampValue(schedule, timeS) {
  const beforeHoldS = schedule.hold_after_active_ramp_s;
  const afterHoldStartS = beforeHoldS + schedule.hold_duration_s;
  let activeElapsedS;
  if (timeS <= beforeHoldS) activeElapsedS = timeS;
  else if (timeS < afterHoldStartS) activeElapsedS = beforeHoldS;
  else activeElapsedS = timeS - schedule.hold_duration_s;
  const phase = Math.max(0, Math.min(1, activeElapsedS / schedule.active_ramp_duration_s));
  return schedule.from_fold + phase * (schedule.to_fold - schedule.from_fold);
}

function scheduleFunctions(command) {
  const schedule = command.schedule;
  let inputAt;
  let activeChannelAt = () => "A";
  let outputClampedAt = () => false;
  let stateReset = null;
  let stateFreeze = null;
  if (schedule.kind === "step") inputAt = () => schedule.to_fold;
  else if (schedule.kind === "periodic-square-pulse") {
    inputAt = (timeS) => {
      if (timeS < schedule.start_time_s || timeS >= schedule.stop_time_s) return schedule.low_fold;
      const phase = (timeS - schedule.start_time_s) % schedule.period_s;
      return phase < schedule.pulse_width_s ? schedule.high_fold : schedule.low_fold;
    };
  } else if (schedule.kind === "ramp-then-hold") inputAt = (timeS) => rampValue(schedule, timeS);
  else if (schedule.kind === "step-with-state-reset") {
    inputAt = () => schedule.to_fold;
    stateReset = { time_s: schedule.intervention_time_s, state_handle: schedule.opaque_state_handle };
  } else if (schedule.kind === "step-with-state-freeze") {
    inputAt = () => schedule.to_fold;
    stateFreeze = {
      start_time_s: schedule.intervention_start_s,
      end_time_s: schedule.intervention_end_s,
      state_handle: schedule.opaque_state_handle,
    };
  } else if (schedule.kind === "step-with-output-clamp") {
    inputAt = () => schedule.to_fold;
    outputClampedAt = (timeS) => timeS >= schedule.intervention_start_s && timeS < schedule.intervention_end_s;
  } else if (schedule.kind === "paused-linear-ramp") inputAt = (timeS) => pausedRampValue(schedule, timeS);
  else if (schedule.kind === "two-pulse-channel-restimulation") {
    inputAt = (timeS) => {
      const input = { A: schedule.low_fold, B: schedule.low_fold };
      if (timeS >= schedule.first_pulse_start_s && timeS < schedule.first_pulse_end_s) {
        input[schedule.first_channel] = schedule.high_fold;
      }
      if (timeS >= schedule.second_pulse_start_s && timeS < schedule.second_pulse_end_s) {
        input[schedule.second_channel] = schedule.high_fold;
      }
      return input;
    };
    activeChannelAt = (timeS) => timeS < schedule.second_pulse_start_s
      ? schedule.first_channel
      : schedule.second_channel;
  } else throw new RangeError(`Unsupported Fixture 026 RSD-T02 schedule kind: ${schedule.kind}`);
  return { inputAt, activeChannelAt, outputClampedAt, stateReset, stateFreeze };
}

export function fixture026RsdT02Projection(transcript) {
  const projection = {
    schema: 1,
    artifact: "fixture-026",
    track: "RSD-T02",
    partition: "public-development",
    units: { input: "U", output: "1", time: "s" },
    schedule: transcript.schedule,
    samples: transcript.samples.map((sample) => ({
      ordinal: sample.ordinal,
      time_s: sample.time_s,
      input_a_u: sample.input_a_u,
      input_b_u: sample.input_b_u,
      active_channel: sample.active_channel,
      reported_output: sample.reported_output,
      output_clamped: sample.output_clamped,
      state_reset_applied: sample.state_reset_applied,
      state_freeze_active: sample.state_freeze_active,
    })),
  };
  const forbidden = [
    "seed", "profile", "run_id", "recipe_id", "equation_id", "initialization_id",
    "regime_membership", "execution_id", "episode_id", "internal_output",
    "property_vector", "equivalence_class", "certificate",
  ];
  const serialized = canonicalize(projection);
  if (forbidden.some((field) => serialized.includes(`"${field}"`))) {
    throw new Error("Fixture 026 RSD-T02 projection leaks evaluator-only fields.");
  }
  return Object.freeze(projection);
}

export function generateFixture026RsdT02Transcript(command) {
  assertFixture026RsdT02EpisodeCommand(command);
  const functions = scheduleFunctions(command);
  const simulation = simulateFixture026RsdT02Episode({
    recipe_id: command.recipe_id,
    horizon_s: command.horizon_s,
    internal_step_s: command.internal_step_s,
    output_rate_hz: command.output_rate_hz,
    time_constant_s: command.time_constant_s,
    input_at: functions.inputAt,
    active_channel_at: functions.activeChannelAt,
    output_clamped_at: functions.outputClampedAt,
    initialization_id: command.initialization_id,
    state_reset: functions.stateReset,
    state_freeze: functions.stateFreeze,
  });
  const samples = simulation.samples.map((sample, ordinal) => {
    const normalized = functions.inputAt(sample.time_s);
    const byChannel = typeof normalized === "number" ? { A: normalized, B: normalized } : normalized;
    return Object.freeze({
      ordinal,
      time_s: sample.time_s,
      input_a_u: command.background_u * byChannel.A,
      input_b_u: command.background_u * byChannel.B,
      active_channel: functions.activeChannelAt(sample.time_s),
      reported_output: sample.output,
      internal_output: sample.internal_output,
      output_clamped: functions.outputClampedAt(sample.time_s),
      state_reset_applied: functions.stateReset !== null && sample.time_s === functions.stateReset.time_s,
      state_freeze_active: functions.stateFreeze !== null
        && sample.time_s >= functions.stateFreeze.start_time_s
        && sample.time_s < functions.stateFreeze.end_time_s,
    });
  });
  const partial = {
    ...command,
    contract_version: FIXTURE_026_RSD_T02_TRANSCRIPT_VERSION,
    schedule: command.schedule,
    samples,
    final_state: simulation.final_state,
  };
  const projection = fixture026RsdT02Projection(partial);
  const projectionBody = canonicalize(projection);
  const transcript = {
    ...partial,
    samples: Object.freeze(samples),
    final_state: Object.freeze([...simulation.final_state]),
    projection_sha256: sha256Hex(projectionBody),
    projection_utf8_bytes: Buffer.byteLength(projectionBody, "utf8"),
    reported_output_sha256: sha256Hex(canonicalize(samples.map(({ reported_output: value }) => value))),
    internal_output_sha256: sha256Hex(canonicalize(samples.map(({ internal_output: value }) => value))),
    authority: "construction-validation-only",
    result_label: "NO_RESULT",
  };
  return Object.freeze(transcript);
}

export function assertFixture026RsdT02Transcript(transcript) {
  if (!exactKeys(transcript, TRANSCRIPT_KEYS)) {
    throw new Error("Fixture 026 RSD-T02 transcript has missing or unknown fields.");
  }
  const command = Object.fromEntries(COMMAND_KEYS.map((key) => [
    key,
    key === "contract_version" ? FIXTURE_026_RSD_T02_GENERATOR_VERSION : transcript[key],
  ]));
  assertFixture026RsdT02EpisodeCommand(command);
  if (
    transcript.contract_version !== FIXTURE_026_RSD_T02_TRANSCRIPT_VERSION
    || !Array.isArray(transcript.samples)
    || transcript.samples.length !== FIXTURE_026_RSD_T02_MODEL_CONSTANTS.samples_per_episode
    || transcript.samples.some((sample, ordinal) => (
      !exactKeys(sample, SAMPLE_KEYS)
      || sample.ordinal !== ordinal
      || sample.time_s !== ordinal / transcript.output_rate_hz
      || !Number.isFinite(sample.input_a_u)
      || !Number.isFinite(sample.input_b_u)
      || sample.input_a_u < FIXTURE_026_RSD_T02_MODEL_CONSTANTS.input_floor_u
      || sample.input_b_u < FIXTURE_026_RSD_T02_MODEL_CONSTANTS.input_floor_u
      || !["A", "B"].includes(sample.active_channel)
      || !Number.isFinite(sample.reported_output)
      || !Number.isFinite(sample.internal_output)
      || typeof sample.output_clamped !== "boolean"
      || typeof sample.state_reset_applied !== "boolean"
      || typeof sample.state_freeze_active !== "boolean"
    ))
    || !Array.isArray(transcript.final_state)
    || transcript.final_state.length !== 2
    || transcript.final_state.some((value) => !Number.isFinite(value))
    || !/^[0-9a-f]{64}$/u.test(transcript.projection_sha256)
    || !Number.isSafeInteger(transcript.projection_utf8_bytes)
    || transcript.projection_utf8_bytes < 1
    || !/^[0-9a-f]{64}$/u.test(transcript.reported_output_sha256)
    || !/^[0-9a-f]{64}$/u.test(transcript.internal_output_sha256)
    || transcript.authority !== "construction-validation-only"
    || transcript.result_label !== "NO_RESULT"
  ) throw new Error("Fixture 026 RSD-T02 transcript violates its closed contract.");
  const projectionBody = canonicalize(fixture026RsdT02Projection(transcript));
  if (
    transcript.projection_sha256 !== sha256Hex(projectionBody)
    || transcript.projection_utf8_bytes !== Buffer.byteLength(projectionBody, "utf8")
    || transcript.reported_output_sha256 !== sha256Hex(canonicalize(
      transcript.samples.map(({ reported_output: value }) => value),
    ))
    || transcript.internal_output_sha256 !== sha256Hex(canonicalize(
      transcript.samples.map(({ internal_output: value }) => value),
    ))
  ) throw new Error("Fixture 026 RSD-T02 transcript hashes disagree with its content.");
  return transcript;
}

export function fixture026RsdT02InputCommandCount(command) {
  assertFixture026RsdT02EpisodeCommand(command);
  const schedule = command.schedule;
  if (schedule.kind === "periodic-square-pulse") return schedule.pulse_count * 2;
  if (schedule.kind === "two-pulse-channel-restimulation") return 4;
  return 1;
}

export function fixture026RsdT02ScheduleSha256(command) {
  assertFixture026RsdT02EpisodeCommand(command);
  return scheduleHash(command.schedule);
}
