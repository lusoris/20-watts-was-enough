"use strict";

(() => {
  const BASE_VERSION = "fixture-026.rsd-t02-policy-base.v1";
  const RESPONSE_VERSION = "fixture-026.rsd-t02-isolated-response.v1";
  const ACTIVE_ARM_IDS = Object.freeze([
    "B-STATE-SPACE",
    "B-RECURRENT",
    "C-MECHANISM-BANK",
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
      typeof crypto,
      typeof Deno,
      typeof Bun,
      typeof eval,
      typeof Function,
      typeof Promise,
      typeof WebAssembly,
      typeof SharedArrayBuffer,
      typeof Atomics,
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
    if (
      !exactKeys(packet, packetKeys)
      || packet.schema !== 1
      || packet.contract_version !== "fixture-026.rsd-t02-arm-bank.v1"
      || packet.artifact !== "fixture-026"
      || packet.track !== "RSD-T02"
      || packet.partition !== "public-development"
      || packet.order !== "frozen-execution-descriptor-order-v1"
      || !Array.isArray(packet.projections)
      || packet.projections.length !== 35
      || packet.projections.some((projection) => (
        !Array.isArray(projection?.samples)
        || projection.samples.length !== SAMPLES_PER_EPISODE
      ))
    ) throw new Error("RSD-T02 isolated policy packet is invalid.");
  }

  function assertConfig(config) {
    if (
      config?.schema !== 1
      || config.artifact !== "fixture-026"
      || config.track !== "RSD-T02"
      || config.authority !== "bounded-public-development-policy-conformance-only"
      || !Array.isArray(config.active_arm_ids)
      || canonical(config.active_arm_ids) !== canonical(ACTIVE_ARM_IDS)
      || config.information?.training_labels !== 0
      || config.information?.tuning_trials !== 0
      || config.information?.future_samples_outside_packet !== false
      || config.information?.evaluator_fields !== false
      || config.information?.thread_cap !== 1
      || config.comparison_inference_permitted !== false
      || config.claim_eligible !== false
      || config.result_label !== "NO_RESULT"
    ) throw new Error("RSD-T02 isolated policy configuration is invalid.");
  }

  function projectionAt(packet, episodeId) {
    const projection = packet.projections[PROJECTION_INDEX[episodeId]];
    if (!projection) throw new Error("RSD-T02 isolated policy projection is absent.");
    return projection;
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

  function stateSpacePolicy(packet, policy) {
    const counter = {
      scalar_operations: 0,
      transcendental_evaluations: 0,
      policy_sample_rows_read: 0,
    };
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
      "drive_transform",
      driveDecision,
      driveMargin,
      driveDecision === null ? "state-space-margin-insufficient" : "state-space-model-margin",
    );
    properties.causal_memory = propertyResult(
      "causal_memory",
      memoryDecision,
      memoryEvidence,
      memoryDecision === null ? "opaque-state-margin-insufficient" : "opaque-state-response-margin",
    );
    return { properties, counter, retained_scalars: 6, parameter_scalars: 5 };
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
      "reported_output_feedback_edge",
      feedbackDecision,
      feedbackEvidence,
      feedbackDecision === null ? "recurrent-clamp-margin-insufficient" : "recurrent-clamp-innovation",
    );
    properties.channel_local_state = propertyResult(
      "channel_local_state",
      channelDecision,
      channelEvidence,
      channelDecision === null ? "recurrent-channel-margin-insufficient" : "recurrent-channel-innovation",
    );
    return { properties, counter, retained_scalars: 4, parameter_scalars: 6 };
  }

  function sampleAt(projection, timeS) {
    return projection.samples[Math.round(timeS * OUTPUT_RATE_HZ)];
  }

  function mechanismPolicy(packet, policy) {
    const counter = {
      scalar_operations: 0,
      transcendental_evaluations: 0,
      policy_sample_rows_read: 0,
    };
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
    return {
      properties: {
        drive_transform: propertyResult(
          "drive_transform", driveDecision, driveEvidence,
          driveDecision === null ? "mechanism-drive-band-indeterminate" : "mechanism-ramp-signature",
        ),
        reported_output_feedback_edge: propertyResult(
          "reported_output_feedback_edge", feedbackDecision, feedbackEvidence,
          feedbackDecision === null ? "mechanism-feedback-band-indeterminate" : "mechanism-clamp-signature",
        ),
        channel_local_state: propertyResult(
          "channel_local_state", channelDecision, channelEvidence,
          channelDecision === null ? "mechanism-channel-band-indeterminate" : "mechanism-restimulation-signature",
        ),
        causal_memory: propertyResult(
          "causal_memory", memoryDecision, memoryEvidence,
          memoryDecision === null ? "mechanism-memory-band-indeterminate" : "mechanism-opaque-state-signature",
        ),
      },
      counter,
      retained_scalars: 4,
      parameter_scalars: 10,
    };
  }

  function runArm(armId, packet, config) {
    let evaluated;
    if (armId === "B-STATE-SPACE") {
      evaluated = stateSpacePolicy(packet, config.policies[armId]);
    } else if (armId === "B-RECURRENT") {
      evaluated = recurrentPolicy(packet, config.policies[armId]);
    } else if (armId === "C-MECHANISM-BANK") {
      evaluated = mechanismPolicy(packet, config.policies[armId]);
    } else {
      throw new Error("RSD-T02 isolated policy arm is inactive.");
    }
    return {
      schema: 1,
      contract_version: BASE_VERSION,
      arm_id: armId,
      properties: evaluated.properties,
      counter: evaluated.counter,
      retained_scalars: evaluated.retained_scalars,
      parameter_scalars: evaluated.parameter_scalars,
    };
  }

  function execute(requestJson) {
    assertIsolation();
    const request = JSON.parse(requestJson);
    if (
      !exactKeys(request, ["schema", "contract_version", "active_arm_ids", "packet_json", "config_json"])
      || request.schema !== 1
      || request.contract_version !== "fixture-026.rsd-t02-policy-call.v1"
      || canonical(request.active_arm_ids) !== canonical(ACTIVE_ARM_IDS)
      || typeof request.packet_json !== "string"
      || typeof request.config_json !== "string"
    ) throw new Error("RSD-T02 isolated policy call is invalid.");
    const packet = JSON.parse(request.packet_json);
    const config = JSON.parse(request.config_json);
    assertPacket(packet);
    assertConfig(config);
    const body = {
      schema: 1,
      contract_version: RESPONSE_VERSION,
      status: "completed",
      arm_results: ACTIVE_ARM_IDS.map((armId) => runArm(armId, packet, config)),
      reason_codes: [],
      authority: "public-development-policy-base-v1-only",
      comparison_inference_permitted: false,
      claim_eligible: false,
      result_label: "NO_RESULT",
      no_result: true,
    };
    return canonical(body);
  }

  Object.defineProperty(globalThis, "__fixture026_rsd_t02_policy_execute__", {
    value: execute,
    configurable: false,
    enumerable: false,
    writable: false,
  });
})();
