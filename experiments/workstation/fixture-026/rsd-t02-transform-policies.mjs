import {
  FIXTURE_026_RSD_T02_MODEL_CONSTANTS,
  FIXTURE_026_RSD_T02_PROPERTY_KEYS,
} from "./rsd-t02-contract.mjs";
import { buildFixture026RsdT02ExecutionDescriptors } from "./rsd-t02-generator.mjs";

export const FIXTURE_026_RSD_T02_TRANSFORM_POLICY_VERSION =
  "fixture-026.rsd-t02-transform-policies.v1";

export const FIXTURE_026_RSD_T02_TRANSFORM_ARM_IDS = Object.freeze([
  "A-RAW",
  "B-STATIC-DIV",
  "B-STREAM",
  "B-LOG-RATIO",
  "B-DIFFERENCE",
  "C-DUAL",
]);

const CLOSED_VALUES = Object.freeze({
  drive_transform: Object.freeze(["affine-fold", "log-fold"]),
  reported_output_feedback_edge: Object.freeze([false, true]),
  channel_local_state: Object.freeze([false, true]),
  causal_memory: Object.freeze([false, true]),
});
const DESCRIPTORS = Object.freeze(buildFixture026RsdT02ExecutionDescriptors());
const OUTPUT_RATE_HZ = FIXTURE_026_RSD_T02_MODEL_CONSTANTS.output_rate_hz;
const LOG_TWO = Math.log(2);

export const FIXTURE_026_RSD_T02_TRANSFORM_POLICY_SPECS = Object.freeze({
  "A-RAW": Object.freeze({
    policy_id: "bounded-raw-trajectory-reference-v1",
    role: "conformance-reference-not-mature-null",
    retained_scalars: 4,
    parameter_scalars: 6,
    config_keys: Object.freeze([
      "feedback_true_floor", "feedback_false_ceiling",
      "channel_local_true_floor", "channel_local_false_ceiling",
      "memory_true_floor", "memory_false_ceiling",
    ]),
  }),
  "B-STATIC-DIV": Object.freeze({
    policy_id: "bounded-static-divisive-reference-v1",
    role: "conformance-reference-not-mature-null",
    retained_scalars: 1,
    parameter_scalars: 2,
    config_keys: Object.freeze(["drive_log_floor", "drive_affine_ceiling"]),
  }),
  "B-STREAM": Object.freeze({
    policy_id: "bounded-causal-streaming-reference-v1",
    role: "conformance-reference-not-mature-null",
    retained_scalars: 6,
    parameter_scalars: 6,
    config_keys: Object.freeze([
      "state_decay_time_s", "innovation_scale_floor",
      "feedback_true_floor", "feedback_false_ceiling",
      "channel_local_true_floor", "channel_local_false_ceiling",
    ]),
  }),
  "B-LOG-RATIO": Object.freeze({
    policy_id: "bounded-log-ratio-reference-v1",
    role: "conformance-reference-not-mature-null",
    retained_scalars: 1,
    parameter_scalars: 2,
    config_keys: Object.freeze(["drive_log_floor", "drive_affine_ceiling"]),
  }),
  "B-DIFFERENCE": Object.freeze({
    policy_id: "bounded-difference-reference-v1",
    role: "conformance-reference-not-mature-null",
    retained_scalars: 4,
    parameter_scalars: 3,
    config_keys: Object.freeze([
      "derivative_window_samples", "drive_affine_floor", "drive_log_ceiling",
    ]),
  }),
  "C-DUAL": Object.freeze({
    policy_id: "bounded-dual-feature-consensus-v1",
    role: "candidate-conformance-reference",
    retained_scalars: 12,
    parameter_scalars: 14,
    config_keys: Object.freeze([
      "static_drive_log_floor", "static_drive_affine_ceiling",
      "log_drive_log_floor", "log_drive_affine_ceiling",
      "difference_window_samples", "difference_drive_affine_floor",
      "difference_drive_log_ceiling", "required_drive_votes",
      "feedback_true_floor", "feedback_false_ceiling",
      "channel_local_true_floor", "channel_local_false_ceiling",
      "memory_true_floor", "memory_false_ceiling",
    ]),
  }),
});

function projectionAt(packet, episodeId) {
  const index = DESCRIPTORS.findIndex((descriptor) => (
    descriptor.regime_membership[0] === "O1-FULL-PANEL"
    && descriptor.episode_id === episodeId
  ));
  if (index < 0 || !packet?.projections?.[index]) {
    throw new Error(`Missing RSD-T02 transform-policy episode: ${episodeId}`);
  }
  return packet.projections[index];
}

function sampleAt(projection, timeS) {
  return projection.samples[Math.round(timeS * OUTPUT_RATE_HZ)];
}

function propertyResult(key, decision, evidence, reason) {
  return Object.freeze({
    closed_values: CLOSED_VALUES[key],
    action: decision === null ? "abstain" : "decide",
    decision,
    evidence,
    reason_codes: Object.freeze([reason]),
  });
}

function blankProperties() {
  return Object.fromEntries(FIXTURE_026_RSD_T02_PROPERTY_KEYS.map((key) => [
    key,
    propertyResult(key, null, null, "outside-bounded-policy-scope"),
  ]));
}

function emptyCounter() {
  return {
    scalar_operations: 0,
    transcendental_evaluations: 0,
    policy_sample_rows_read: 0,
  };
}

function addCounter(target, source) {
  target.scalar_operations += source.scalar_operations;
  target.transcendental_evaluations += source.transcendental_evaluations;
  target.policy_sample_rows_read += source.policy_sample_rows_read;
}

function supDistance(left, right, counter) {
  let maximum = 0;
  for (let index = 0; index < left.samples.length; index += 1) {
    maximum = Math.max(maximum, Math.abs(
      left.samples[index].reported_output - right.samples[index].reported_output,
    ));
    counter.scalar_operations += 3;
    counter.policy_sample_rows_read += 2;
  }
  return maximum;
}

function rawPolicy(packet, policy) {
  const counter = emptyCounter();
  const clamp = projectionAt(packet, "CLAMP-OUTPUT-01");
  const feedbackEvidence = Math.abs(sampleAt(clamp, 1).reported_output);
  counter.scalar_operations += 2;
  counter.policy_sample_rows_read += 1;
  let feedbackDecision = null;
  if (feedbackEvidence >= policy.feedback_true_floor) feedbackDecision = true;
  else if (feedbackEvidence <= policy.feedback_false_ceiling) feedbackDecision = false;

  const restimulation = projectionAt(packet, "RESTIM-CROSS-01");
  let channelEvidence = 0;
  for (const sample of restimulation.samples) {
    if (sample.time_s >= 2 && sample.time_s <= 3) {
      channelEvidence = Math.max(channelEvidence, Math.abs(sample.reported_output));
      counter.scalar_operations += 3;
      counter.policy_sample_rows_read += 1;
    }
  }
  let channelDecision = null;
  if (channelEvidence >= policy.channel_local_true_floor) channelDecision = true;
  else if (channelEvidence <= policy.channel_local_false_ceiling) channelDecision = false;

  const resetDistance = supDistance(
    projectionAt(packet, "RESET-H0"),
    projectionAt(packet, "RESET-H1"),
    counter,
  );
  const freezeDistance = supDistance(
    projectionAt(packet, "FREEZE-H0"),
    projectionAt(packet, "FREEZE-H1"),
    counter,
  );
  const memoryEvidence = Math.max(resetDistance, freezeDistance);
  counter.scalar_operations += 1;
  let memoryDecision = null;
  if (memoryEvidence >= policy.memory_true_floor) memoryDecision = true;
  else if (memoryEvidence <= policy.memory_false_ceiling) memoryDecision = false;

  const properties = blankProperties();
  properties.reported_output_feedback_edge = propertyResult(
    "reported_output_feedback_edge", feedbackDecision, feedbackEvidence,
    feedbackDecision === null ? "raw-clamp-band-indeterminate" : "raw-clamp-release-evidence",
  );
  properties.channel_local_state = propertyResult(
    "channel_local_state", channelDecision, channelEvidence,
    channelDecision === null ? "raw-channel-band-indeterminate" : "raw-restimulation-evidence",
  );
  properties.causal_memory = propertyResult(
    "causal_memory", memoryDecision, memoryEvidence,
    memoryDecision === null ? "raw-memory-band-indeterminate" : "raw-opaque-state-evidence",
  );
  return { properties, counter };
}

function staticDivPolicy(packet, policy) {
  const counter = emptyCounter();
  const sample = sampleAt(projectionAt(packet, "RAMP-LIN-UP-0P5"), 0.25);
  const background = projectionAt(packet, "RAMP-LIN-UP-0P5").samples[0].input_a_u;
  const activeInput = sample.active_channel === "A" ? sample.input_a_u : sample.input_b_u;
  const fold = activeInput / background;
  const evidence = sample.reported_output / (fold - 1);
  counter.scalar_operations += 4;
  counter.policy_sample_rows_read += 2;
  let decision = null;
  if (evidence >= policy.drive_log_floor) decision = "log-fold";
  else if (evidence <= policy.drive_affine_ceiling) decision = "affine-fold";
  const properties = blankProperties();
  properties.drive_transform = propertyResult(
    "drive_transform", decision, evidence,
    decision === null ? "static-divisive-band-indeterminate" : "static-divisive-ramp-ratio",
  );
  return { properties, counter };
}

function streamingInnovation(projection, targetTimeS, alpha, scaleFloor, counter) {
  const beta = 1 - alpha;
  let mean = 0;
  let variance = 0;
  let evidence = null;
  counter.scalar_operations += 1;
  for (const sample of projection.samples) {
    const delta = sample.reported_output - mean;
    mean = alpha * mean + beta * sample.reported_output;
    variance = alpha * variance + beta * delta * delta;
    counter.scalar_operations += 8;
    counter.policy_sample_rows_read += 1;
    if (sample.time_s === targetTimeS) {
      evidence = Math.abs(delta) / (Math.sqrt(variance) + scaleFloor);
      counter.scalar_operations += 3;
      counter.transcendental_evaluations += 1;
    }
  }
  return evidence;
}

function streamPolicy(packet, policy) {
  const counter = emptyCounter();
  const alpha = Math.exp(-1 / OUTPUT_RATE_HZ / policy.state_decay_time_s);
  counter.transcendental_evaluations += 1;
  const feedbackEvidence = streamingInnovation(
    projectionAt(packet, "CLAMP-OUTPUT-01"),
    1,
    alpha,
    policy.innovation_scale_floor,
    counter,
  );
  const channelEvidence = streamingInnovation(
    projectionAt(packet, "RESTIM-CROSS-01"),
    2,
    alpha,
    policy.innovation_scale_floor,
    counter,
  );
  let feedbackDecision = null;
  if (feedbackEvidence >= policy.feedback_true_floor) feedbackDecision = true;
  else if (feedbackEvidence <= policy.feedback_false_ceiling) feedbackDecision = false;
  let channelDecision = null;
  if (channelEvidence >= policy.channel_local_true_floor) channelDecision = true;
  else if (channelEvidence <= policy.channel_local_false_ceiling) channelDecision = false;
  const properties = blankProperties();
  properties.reported_output_feedback_edge = propertyResult(
    "reported_output_feedback_edge", feedbackDecision, feedbackEvidence,
    feedbackDecision === null ? "streaming-clamp-band-indeterminate" : "streaming-clamp-innovation",
  );
  properties.channel_local_state = propertyResult(
    "channel_local_state", channelDecision, channelEvidence,
    channelDecision === null ? "streaming-channel-band-indeterminate" : "streaming-channel-innovation",
  );
  return { properties, counter };
}

function logRatioPolicy(packet, policy) {
  const counter = emptyCounter();
  const ramp = projectionAt(packet, "RAMP-LIN-UP-0P5");
  const sample = sampleAt(ramp, 0.25);
  const background = ramp.samples[0].input_a_u;
  const activeInput = sample.active_channel === "A" ? sample.input_a_u : sample.input_b_u;
  let evidence = null;
  let decision = null;
  if (activeInput > 0 && background > 0) {
    const logFold = Math.log(activeInput / background) / LOG_TWO;
    evidence = sample.reported_output / logFold;
    counter.scalar_operations += 4;
    counter.transcendental_evaluations += 1;
    if (evidence >= policy.drive_log_floor) decision = "log-fold";
    else if (evidence <= policy.drive_affine_ceiling) decision = "affine-fold";
  }
  counter.policy_sample_rows_read += 2;
  const properties = blankProperties();
  properties.drive_transform = propertyResult(
    "drive_transform", decision, evidence,
    evidence === null
      ? "log-ratio-domain-unsupported"
      : decision === null ? "log-ratio-band-indeterminate" : "log-ratio-ramp-evidence",
  );
  return { properties, counter };
}

function differencePolicy(packet, policy) {
  const counter = emptyCounter();
  const ramp = projectionAt(packet, "RAMP-LIN-UP-0P5");
  const window = policy.derivative_window_samples;
  let cross = 0;
  let inputEnergy = 0;
  for (let index = 1; index <= window; index += 1) {
    const current = ramp.samples[index];
    const previous = ramp.samples[index - 1];
    const currentInput = current.active_channel === "A" ? current.input_a_u : current.input_b_u;
    const previousInput = previous.active_channel === "A"
      ? previous.input_a_u
      : previous.input_b_u;
    const background = ramp.samples[0].input_a_u;
    const outputRate = (current.reported_output - previous.reported_output) * OUTPUT_RATE_HZ;
    const inputRate = ((currentInput - previousInput) / background) * OUTPUT_RATE_HZ;
    cross += outputRate * inputRate;
    inputEnergy += inputRate * inputRate;
    counter.scalar_operations += 9;
    counter.policy_sample_rows_read += 2;
  }
  const evidence = cross / inputEnergy;
  counter.scalar_operations += 1;
  let decision = null;
  if (evidence >= policy.drive_affine_floor) decision = "affine-fold";
  else if (evidence <= policy.drive_log_ceiling) decision = "log-fold";
  const properties = blankProperties();
  properties.drive_transform = propertyResult(
    "drive_transform", decision, evidence,
    decision === null ? "difference-derivative-band-indeterminate" : "difference-derivative-ramp-evidence",
  );
  return { properties, counter };
}

function dualPolicy(packet, policy) {
  const staticResult = staticDivPolicy(packet, {
    drive_log_floor: policy.static_drive_log_floor,
    drive_affine_ceiling: policy.static_drive_affine_ceiling,
  });
  const logResult = logRatioPolicy(packet, {
    drive_log_floor: policy.log_drive_log_floor,
    drive_affine_ceiling: policy.log_drive_affine_ceiling,
  });
  const differenceResult = differencePolicy(packet, {
    derivative_window_samples: policy.difference_window_samples,
    drive_affine_floor: policy.difference_drive_affine_floor,
    drive_log_ceiling: policy.difference_drive_log_ceiling,
  });
  const rawResult = rawPolicy(packet, policy);
  const counter = emptyCounter();
  for (const result of [staticResult, logResult, differenceResult, rawResult]) {
    addCounter(counter, result.counter);
  }
  const votes = [staticResult, logResult, differenceResult]
    .map(({ properties }) => properties.drive_transform.decision)
    .filter((decision) => decision !== null);
  const unanimous = votes.length >= policy.required_drive_votes
    && new Set(votes).size === 1;
  const driveDecision = unanimous ? votes[0] : null;
  const voteEvidence = votes.reduce(
    (sum, decision) => sum + (decision === "affine-fold" ? 1 : -1),
    0,
  );
  counter.scalar_operations += votes.length + 2;
  const properties = {
    drive_transform: propertyResult(
      "drive_transform", driveDecision, voteEvidence,
      driveDecision === null ? "dual-drive-branches-disagree" : "dual-drive-unanimous-consensus",
    ),
    reported_output_feedback_edge: rawResult.properties.reported_output_feedback_edge,
    channel_local_state: rawResult.properties.channel_local_state,
    causal_memory: rawResult.properties.causal_memory,
  };
  return { properties, counter };
}

export function evaluateFixture026RsdT02TransformPolicy({ armId, packet, policy }) {
  const spec = FIXTURE_026_RSD_T02_TRANSFORM_POLICY_SPECS[armId];
  if (!spec) throw new RangeError(`Unknown Fixture 026 RSD-T02 transform arm: ${armId}`);
  let evaluated;
  if (armId === "A-RAW") evaluated = rawPolicy(packet, policy);
  else if (armId === "B-STATIC-DIV") evaluated = staticDivPolicy(packet, policy);
  else if (armId === "B-STREAM") evaluated = streamPolicy(packet, policy);
  else if (armId === "B-LOG-RATIO") evaluated = logRatioPolicy(packet, policy);
  else if (armId === "B-DIFFERENCE") evaluated = differencePolicy(packet, policy);
  else evaluated = dualPolicy(packet, policy);
  return Object.freeze({
    properties: Object.freeze(evaluated.properties),
    counter: Object.freeze(evaluated.counter),
    retainedScalars: spec.retained_scalars,
    parameterScalars: spec.parameter_scalars,
  });
}
