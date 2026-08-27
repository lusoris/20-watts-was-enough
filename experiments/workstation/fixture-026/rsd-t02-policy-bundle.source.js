"use strict";

(() => {
  const BASE_VERSION = "fixture-026.rsd-t02-policy-base.v2";
  const CALL_VERSION = "fixture-026.rsd-t02-policy-call.v2";
  const RESPONSE_VERSION = "fixture-026.rsd-t02-isolated-response.v2";
  const ACTIVE_ARM_IDS = Object.freeze([
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
  const PROPERTY_KEYS = Object.freeze([
    "drive_transform",
    "reported_output_feedback_edge",
    "channel_local_state",
    "causal_memory",
  ]);
  const CLOSED_VALUES = Object.freeze({
    drive_transform: Object.freeze(["affine-fold", "log-fold"]),
    reported_output_feedback_edge: Object.freeze([false, true]),
    channel_local_state: Object.freeze([false, true]),
    causal_memory: Object.freeze([false, true]),
  });
  const PROJECTION_INDEX = Object.freeze({
    "RAMP-LIN-UP-0P5": 18,
    "RESET-H0": 26,
    "RESET-H1": 27,
    "FREEZE-H0": 28,
    "FREEZE-H1": 29,
    "CLAMP-OUTPUT-01": 30,
    "RESTIM-CROSS-01": 34,
  });
  const POLICY_CONFIG_KEYS = Object.freeze({
    "A-RAW": Object.freeze([
      "policy_id", "role", "threshold_provenance", "threshold_rationale",
      "feedback_true_floor", "feedback_false_ceiling",
      "channel_local_true_floor", "channel_local_false_ceiling",
      "memory_true_floor", "memory_false_ceiling",
    ]),
    "B-STATIC-DIV": Object.freeze([
      "policy_id", "role", "threshold_provenance", "threshold_rationale",
      "drive_log_floor", "drive_affine_ceiling",
    ]),
    "B-STREAM": Object.freeze([
      "policy_id", "role", "threshold_provenance", "threshold_rationale",
      "state_decay_time_s", "innovation_scale_floor",
      "feedback_true_floor", "feedback_false_ceiling",
      "channel_local_true_floor", "channel_local_false_ceiling",
    ]),
    "B-LOG-RATIO": Object.freeze([
      "policy_id", "role", "threshold_provenance", "threshold_rationale",
      "drive_log_floor", "drive_affine_ceiling",
    ]),
    "B-DIFFERENCE": Object.freeze([
      "policy_id", "role", "threshold_provenance", "threshold_rationale",
      "derivative_window_samples", "drive_affine_floor", "drive_log_ceiling",
    ]),
    "B-STATE-SPACE": Object.freeze([
      "policy_id", "role", "threshold_provenance", "threshold_rationale",
      "drive_mse_margin", "memory_true_floor", "memory_false_ceiling",
    ]),
    "B-RECURRENT": Object.freeze([
      "policy_id", "role", "threshold_provenance", "threshold_rationale",
      "state_decay_time_s", "feedback_true_floor", "feedback_false_ceiling",
      "channel_local_true_floor", "channel_local_false_ceiling",
    ]),
    "C-MECHANISM-BANK": Object.freeze([
      "policy_id", "role", "threshold_provenance", "threshold_rationale",
      "drive_log_floor", "drive_affine_ceiling",
      "feedback_true_floor", "feedback_false_ceiling",
      "channel_local_true_floor", "channel_local_false_ceiling",
      "memory_true_floor", "memory_false_ceiling",
    ]),
    "C-DUAL": Object.freeze([
      "policy_id", "role", "threshold_provenance", "threshold_rationale",
      "static_drive_log_floor", "static_drive_affine_ceiling",
      "log_drive_log_floor", "log_drive_affine_ceiling",
      "difference_window_samples", "difference_drive_affine_floor",
      "difference_drive_log_ceiling", "required_drive_votes",
      "feedback_true_floor", "feedback_false_ceiling",
      "channel_local_true_floor", "channel_local_false_ceiling",
      "memory_true_floor", "memory_false_ceiling",
    ]),
  });
  const EXPECTED_COMMON_CAPS = Object.freeze({
    scalar_operations: 1000000,
    transcendental_evaluations: 2000,
    retained_state_bytes: 128,
    influential_parameter_bytes: 4096,
    scratch_peak_bytes: 16777216,
    policy_artifact_bytes: 262144,
    fallback_invocations: 0,
  });
  const OUTPUT_RATE_HZ = 64;
  const SAMPLES_PER_EPISODE = 1537;
  const LOG_TWO = Math.log(2);

  function exactKeys(value, keys) {
    return value !== null
      && typeof value === "object"
      && !Array.isArray(value)
      && Object.keys(value).length === keys.length
      && keys.every((key) => Object.prototype.hasOwnProperty.call(value, key));
  }

  function canonical(value) {
    if (value === null || typeof value === "boolean" || typeof value === "string") {
      return JSON.stringify(value);
    }
    if (typeof value === "number" && Number.isFinite(value)) return JSON.stringify(value);
    if (Array.isArray(value)) return `[${value.map(canonical).join(",")}]`;
    if (value && typeof value === "object") {
      return `{${Object.keys(value).sort().map((key) => (
        `${JSON.stringify(key)}:${canonical(value[key])}`
      )).join(",")}}`;
    }
    throw new TypeError("RSD-T02 policy response contains a non-canonical value.");
  }

  function assertIsolation() {
    const forbidden = [
      typeof process,
      typeof require,
      typeof module,
      typeof fetch,
      typeof XMLHttpRequest,
      typeof WebSocket,
      typeof EventSource,
      typeof Date,
      typeof performance,
      typeof setTimeout,
      typeof setInterval,
      typeof setImmediate,
      typeof queueMicrotask,
      typeof crypto,
      typeof Deno,
      typeof Bun,
      typeof eval,
      typeof Function,
      typeof Promise,
      typeof WebAssembly,
      typeof SharedArrayBuffer,
      typeof Atomics,
      typeof console,
      typeof __fixture026_evaluator__,
    ];
    if (forbidden.some((kind) => kind !== "undefined") || typeof Math.random !== "undefined") {
      throw new Error("RSD-T02 policy isolation capability surface is open.");
    }
  }

  function assertPacket(packet) {
    const packetKeys = [
      "schema", "contract_version", "artifact", "track", "partition", "units",
      "order", "projections",
    ];
    const projectionKeys = [
      "schema", "artifact", "track", "partition", "units", "schedule", "samples",
    ];
    const sampleKeys = [
      "ordinal", "time_s", "input_a_u", "input_b_u", "active_channel",
      "reported_output", "output_clamped", "state_reset_applied", "state_freeze_active",
    ];
    if (
      !exactKeys(packet, packetKeys)
      || packet.schema !== 1
      || packet.contract_version !== "fixture-026.rsd-t02-arm-bank.v2"
      || packet.artifact !== "fixture-026"
      || packet.track !== "RSD-T02"
      || packet.partition !== "public-development"
      || canonical(packet.units) !== canonical({ input: "U", output: "1", time: "s" })
      || packet.order !== "frozen-execution-descriptor-order-v1"
      || !Array.isArray(packet.projections)
      || packet.projections.length !== 35
      || packet.projections.some((projection) => (
        !exactKeys(projection, projectionKeys)
        || projection.schema !== 1
        || projection.artifact !== "fixture-026"
        || projection.track !== "RSD-T02"
        || projection.partition !== "public-development"
        || canonical(projection.units) !== canonical({ input: "U", output: "1", time: "s" })
        || projection.schedule === null
        || typeof projection.schedule !== "object"
        || Array.isArray(projection.schedule)
        || !Array.isArray(projection.samples)
        || projection.samples.length !== SAMPLES_PER_EPISODE
        || projection.samples.some((sample, ordinal) => (
          !exactKeys(sample, sampleKeys)
          || sample.ordinal !== ordinal
          || sample.time_s !== ordinal / OUTPUT_RATE_HZ
          || !Number.isFinite(sample.input_a_u)
          || !Number.isFinite(sample.input_b_u)
          || sample.input_a_u < 0.05
          || sample.input_b_u < 0.05
          || !["A", "B"].includes(sample.active_channel)
          || !Number.isFinite(sample.reported_output)
          || typeof sample.output_clamped !== "boolean"
          || typeof sample.state_reset_applied !== "boolean"
          || typeof sample.state_freeze_active !== "boolean"
        ))
      ))
    ) throw new Error("RSD-T02 isolated policy packet is invalid.");
  }

  function assertConfig(config) {
    const rootKeys = [
      "schema", "contract_version", "artifact", "track", "authority",
      "active_arm_ids", "inactive_arm_ids", "packet", "information", "common_caps",
      "policies", "comparison_inference_permitted", "claim_eligible", "result_label",
    ];
    const packetKeys = [
      "observation_regimes", "episodes", "o0_episodes", "o1_episodes", "rows_per_episode",
      "sample_rows", "input_commands", "internal_resets", "internal_freezes",
      "output_clamps", "channel_switches", "state_writes", "order",
    ];
    const informationKeys = [
      "training_labels", "tuning_trials", "future_samples_outside_packet", "evaluator_fields",
      "numeric_model", "thread_cap",
    ];
    const capKeys = [
      "scalar_operations", "transcendental_evaluations", "retained_state_bytes",
      "influential_parameter_bytes", "scratch_peak_bytes", "policy_artifact_bytes",
      "fallback_invocations",
    ];
    if (
      !exactKeys(config, rootKeys)
      || !exactKeys(config.packet, packetKeys)
      || !exactKeys(config.information, informationKeys)
      || !exactKeys(config.common_caps, capKeys)
      || !exactKeys(config.policies, ACTIVE_ARM_IDS)
      || config.schema !== 1
      || config.contract_version !== "fixture-026.rsd-t02-arm-bank.v2"
      || config.artifact !== "fixture-026"
      || config.track !== "RSD-T02"
      || config.authority !== "bounded-public-development-policy-conformance-only"
      || canonical(config.active_arm_ids) !== canonical(ACTIVE_ARM_IDS)
      || canonical(config.inactive_arm_ids) !== "[]"
      || canonical(config.packet.observation_regimes)
        !== canonical(["O0-MATCHED-STEP", "O1-FULL-PANEL"])
      || config.packet.episodes !== 35
      || config.packet.o0_episodes !== 9
      || config.packet.o1_episodes !== 26
      || config.packet.rows_per_episode !== 1537
      || config.packet.sample_rows !== 53795
      || config.packet.input_commands !== 197
      || config.packet.internal_resets !== 2
      || config.packet.internal_freezes !== 2
      || config.packet.output_clamps !== 1
      || config.packet.channel_switches !== 1
      || config.packet.state_writes !== 2
      || config.packet.order !== "frozen-execution-descriptor-order-v1"
      || config.information.training_labels !== 0
      || config.information.tuning_trials !== 0
      || config.information.future_samples_outside_packet !== false
      || config.information.evaluator_fields !== false
      || config.information.numeric_model !== "IEEE-754-binary64"
      || config.information.thread_cap !== 1
      || canonical(config.common_caps) !== canonical(EXPECTED_COMMON_CAPS)
      || config.comparison_inference_permitted !== false
      || config.claim_eligible !== false
      || config.result_label !== "NO_RESULT"
    ) throw new Error("RSD-T02 isolated policy configuration is invalid.");
    for (const armId of ACTIVE_ARM_IDS) {
      const policy = config.policies[armId];
      if (
        !exactKeys(policy, POLICY_CONFIG_KEYS[armId])
        || typeof policy.policy_id !== "string"
        || typeof policy.role !== "string"
        || policy.threshold_provenance
          !== "construction-tuned-on-five-enumerated-public-worlds-2026-08-27"
        || typeof policy.threshold_rationale !== "string"
        || policy.threshold_rationale.length < 40
        || Object.keys(policy).some((key) => (
          !["policy_id", "role", "threshold_provenance", "threshold_rationale"].includes(key)
          && (!Number.isFinite(policy[key]) || policy[key] < 0)
        ))
      ) throw new Error(`RSD-T02 isolated ${armId} policy configuration is invalid.`);
    }
  }

  function projectionAt(packet, episodeId) {
    const projection = packet.projections[PROJECTION_INDEX[episodeId]];
    if (!projection) throw new Error("RSD-T02 isolated policy projection is absent.");
    return projection;
  }

  function sampleAt(projection, timeS) {
    return projection.samples[Math.round(timeS * OUTPUT_RATE_HZ)];
  }

  function propertyResult(key, decision, evidence, reason) {
    return {
      closed_values: CLOSED_VALUES[key],
      action: decision === null ? "abstain" : "decide",
      decision,
      evidence,
      reason_codes: [reason],
    };
  }

  function blankProperties() {
    return Object.fromEntries(PROPERTY_KEYS.map((key) => [
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
    return { properties, counter, retainedScalars: 4, parameterScalars: 6 };
  }

  function staticDivPolicy(packet, policy) {
    const counter = emptyCounter();
    const ramp = projectionAt(packet, "RAMP-LIN-UP-0P5");
    const sample = sampleAt(ramp, 0.25);
    const background = ramp.samples[0].input_a_u;
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
    return { properties, counter, retainedScalars: 1, parameterScalars: 2 };
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
      projectionAt(packet, "CLAMP-OUTPUT-01"), 1, alpha, policy.innovation_scale_floor, counter,
    );
    const channelEvidence = streamingInnovation(
      projectionAt(packet, "RESTIM-CROSS-01"), 2, alpha, policy.innovation_scale_floor, counter,
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
      feedbackDecision === null
        ? "streaming-clamp-band-indeterminate"
        : "streaming-clamp-innovation",
    );
    properties.channel_local_state = propertyResult(
      "channel_local_state", channelDecision, channelEvidence,
      channelDecision === null
        ? "streaming-channel-band-indeterminate"
        : "streaming-channel-innovation",
    );
    return { properties, counter, retainedScalars: 6, parameterScalars: 6 };
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
    return { properties, counter, retainedScalars: 1, parameterScalars: 2 };
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
      decision === null
        ? "difference-derivative-band-indeterminate"
        : "difference-derivative-ramp-evidence",
    );
    return { properties, counter, retainedScalars: 4, parameterScalars: 3 };
  }

  function stateSpacePolicy(packet, policy) {
    const counter = emptyCounter();
    const ramp = projectionAt(packet, "RAMP-LIN-UP-0P5");
    const background = ramp.samples[0].input_a_u;
    const deltaT = 1 / OUTPUT_RATE_HZ;
    let affineState = 0;
    let logState = 0;
    let affineSquaredError = 0;
    let logSquaredError = 0;
    for (const sample of ramp.samples) {
      const activeInput = sample.active_channel === "A" ? sample.input_a_u : sample.input_b_u;
      const fold = activeInput / background;
      const affineDrive = fold - 1;
      const logDrive = Math.log(fold) / LOG_TWO;
      const affineResidual = sample.reported_output - (affineDrive - affineState);
      const logResidual = sample.reported_output - (logDrive - logState);
      affineSquaredError += affineResidual ** 2;
      logSquaredError += logResidual ** 2;
      affineState += deltaT * (affineDrive - affineState);
      logState += deltaT * (logDrive - logState);
      counter.scalar_operations += 22;
      counter.transcendental_evaluations += 1;
      counter.policy_sample_rows_read += 1;
    }
    const driveMargin = (logSquaredError - affineSquaredError) / ramp.samples.length;
    let driveDecision = null;
    if (driveMargin >= policy.drive_mse_margin) driveDecision = "affine-fold";
    else if (driveMargin <= -policy.drive_mse_margin) driveDecision = "log-fold";

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
    let memoryDecision = null;
    if (memoryEvidence >= policy.memory_true_floor) memoryDecision = true;
    else if (memoryEvidence <= policy.memory_false_ceiling) memoryDecision = false;
    const properties = blankProperties();
    properties.drive_transform = propertyResult(
      "drive_transform", driveDecision, driveMargin,
      driveDecision === null ? "state-space-margin-insufficient" : "state-space-model-margin",
    );
    properties.causal_memory = propertyResult(
      "causal_memory", memoryDecision, memoryEvidence,
      memoryDecision === null ? "opaque-state-margin-insufficient" : "opaque-state-response-margin",
    );
    return { properties, counter, retainedScalars: 6, parameterScalars: 5 };
  }

  function recurrentPolicy(packet, policy) {
    const counter = {
      scalar_operations: 0,
      transcendental_evaluations: 1,
      policy_sample_rows_read: 0,
    };
    const alpha = Math.exp(-1 / OUTPUT_RATE_HZ / policy.state_decay_time_s);
    const clamp = projectionAt(packet, "CLAMP-OUTPUT-01");
    let sharedState = 0;
    let feedbackEvidence = null;
    for (const sample of clamp.samples) {
      if (sample.time_s === 1) feedbackEvidence = Math.abs(sample.reported_output - sharedState);
      sharedState = alpha * sharedState + (1 - alpha) * sample.reported_output;
      counter.scalar_operations += 7;
      counter.policy_sample_rows_read += 1;
    }
    const restimulation = projectionAt(packet, "RESTIM-CROSS-01");
    const channelState = { A: 0, B: 0 };
    let channelEvidence = null;
    for (const sample of restimulation.samples) {
      const channel = sample.active_channel;
      if (sample.time_s === 2) {
        channelEvidence = Math.abs(sample.reported_output - channelState[channel]);
      }
      channelState[channel] = alpha * channelState[channel]
        + (1 - alpha) * sample.reported_output;
      counter.scalar_operations += 7;
      counter.policy_sample_rows_read += 1;
    }
    let feedbackDecision = null;
    if (feedbackEvidence >= policy.feedback_true_floor) feedbackDecision = true;
    else if (feedbackEvidence <= policy.feedback_false_ceiling) feedbackDecision = false;
    let channelDecision = null;
    if (channelEvidence >= policy.channel_local_true_floor) channelDecision = true;
    else if (channelEvidence <= policy.channel_local_false_ceiling) channelDecision = false;
    const properties = blankProperties();
    properties.reported_output_feedback_edge = propertyResult(
      "reported_output_feedback_edge", feedbackDecision, feedbackEvidence,
      feedbackDecision === null
        ? "recurrent-clamp-margin-insufficient"
        : "recurrent-clamp-innovation",
    );
    properties.channel_local_state = propertyResult(
      "channel_local_state", channelDecision, channelEvidence,
      channelDecision === null
        ? "recurrent-channel-margin-insufficient"
        : "recurrent-channel-innovation",
    );
    return { properties, counter, retainedScalars: 4, parameterScalars: 6 };
  }

  function mechanismPolicy(packet, policy) {
    const counter = emptyCounter();
    const ramp = projectionAt(packet, "RAMP-LIN-UP-0P5");
    const driveEvidence = sampleAt(ramp, 0.25).reported_output;
    counter.scalar_operations += 1;
    counter.policy_sample_rows_read += 1;
    let driveDecision = null;
    if (driveEvidence >= policy.drive_log_floor) driveDecision = "log-fold";
    else if (driveEvidence <= policy.drive_affine_ceiling) driveDecision = "affine-fold";

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
    let memoryDecision = null;
    if (memoryEvidence >= policy.memory_true_floor) memoryDecision = true;
    else if (memoryEvidence <= policy.memory_false_ceiling) memoryDecision = false;
    const properties = {
      drive_transform: propertyResult(
        "drive_transform", driveDecision, driveEvidence,
        driveDecision === null
          ? "mechanism-drive-band-indeterminate"
          : "mechanism-ramp-signature",
      ),
      reported_output_feedback_edge: propertyResult(
        "reported_output_feedback_edge", feedbackDecision, feedbackEvidence,
        feedbackDecision === null
          ? "mechanism-feedback-band-indeterminate"
          : "mechanism-clamp-signature",
      ),
      channel_local_state: propertyResult(
        "channel_local_state", channelDecision, channelEvidence,
        channelDecision === null
          ? "mechanism-channel-band-indeterminate"
          : "mechanism-restimulation-signature",
      ),
      causal_memory: propertyResult(
        "causal_memory", memoryDecision, memoryEvidence,
        memoryDecision === null
          ? "mechanism-memory-band-indeterminate"
          : "mechanism-opaque-state-signature",
      ),
    };
    return { properties, counter, retainedScalars: 4, parameterScalars: 10 };
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
        driveDecision === null
          ? "dual-drive-branches-disagree"
          : "dual-drive-unanimous-consensus",
      ),
      reported_output_feedback_edge: rawResult.properties.reported_output_feedback_edge,
      channel_local_state: rawResult.properties.channel_local_state,
      causal_memory: rawResult.properties.causal_memory,
    };
    return { properties, counter, retainedScalars: 12, parameterScalars: 14 };
  }

  function runArm(armId, packet, config) {
    let evaluated;
    if (armId === "A-RAW") evaluated = rawPolicy(packet, config.policies[armId]);
    else if (armId === "B-STATIC-DIV") {
      evaluated = staticDivPolicy(packet, config.policies[armId]);
    } else if (armId === "B-STREAM") evaluated = streamPolicy(packet, config.policies[armId]);
    else if (armId === "B-LOG-RATIO") {
      evaluated = logRatioPolicy(packet, config.policies[armId]);
    } else if (armId === "B-DIFFERENCE") {
      evaluated = differencePolicy(packet, config.policies[armId]);
    } else if (armId === "B-STATE-SPACE") {
      evaluated = stateSpacePolicy(packet, config.policies[armId]);
    } else if (armId === "B-RECURRENT") {
      evaluated = recurrentPolicy(packet, config.policies[armId]);
    } else if (armId === "C-MECHANISM-BANK") {
      evaluated = mechanismPolicy(packet, config.policies[armId]);
    } else if (armId === "C-DUAL") evaluated = dualPolicy(packet, config.policies[armId]);
    else throw new Error("RSD-T02 isolated policy arm is inactive.");
    return {
      schema: 1,
      contract_version: BASE_VERSION,
      arm_id: armId,
      properties: evaluated.properties,
      counter: evaluated.counter,
      retained_scalars: evaluated.retainedScalars,
      parameter_scalars: evaluated.parameterScalars,
    };
  }

  function execute(requestJson) {
    assertIsolation();
    const request = JSON.parse(requestJson);
    if (
      !exactKeys(request, [
        "schema", "contract_version", "active_arm_ids", "packet_json", "config_json",
      ])
      || request.schema !== 1
      || request.contract_version !== CALL_VERSION
      || canonical(request.active_arm_ids) !== canonical(ACTIVE_ARM_IDS)
      || typeof request.packet_json !== "string"
      || typeof request.config_json !== "string"
    ) throw new Error("RSD-T02 isolated policy call is invalid.");
    const packet = JSON.parse(request.packet_json);
    const config = JSON.parse(request.config_json);
    assertPacket(packet);
    assertConfig(config);
    return canonical({
      schema: 1,
      contract_version: RESPONSE_VERSION,
      status: "completed",
      arm_results: ACTIVE_ARM_IDS.map((armId) => runArm(armId, packet, config)),
      reason_codes: [],
      authority: "public-development-policy-base-v2-only",
      comparison_inference_permitted: false,
      claim_eligible: false,
      result_label: "NO_RESULT",
      no_result: true,
    });
  }

  Object.defineProperty(globalThis, "__fixture026_rsd_t02_policy_execute__", {
    value: execute,
    configurable: false,
    enumerable: false,
    writable: false,
  });
})();
