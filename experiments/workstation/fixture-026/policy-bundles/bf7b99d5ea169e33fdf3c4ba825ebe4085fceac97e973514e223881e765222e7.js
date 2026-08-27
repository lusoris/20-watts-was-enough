"use strict";

(() => {
  const CALL_VERSION = "fixture-026.rsd-t02-fixed-instance-policy-call.v1";
  const BUNDLE_RESPONSE_VERSION =
    "fixture-026.rsd-t02-fixed-instance-policy-bundle-response.v1";
  const POLICY_VIEW_VERSION = "fixture-026.rsd-t02-fixed-instance-policy-view.v1";
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
  const ROOT_KEYS = Object.freeze([
    "schema", "contract_version", "units", "order", "projections",
  ]);
  const PROJECTION_KEYS = Object.freeze(["ordinal", "schedule", "samples"]);
  const SAMPLE_KEYS = Object.freeze([
    "ordinal", "time_s", "input_a_u", "input_b_u", "active_channel",
    "reported_output", "output_clamped", "state_reset_applied", "state_freeze_active",
  ]);
  const SAMPLES_PER_PROJECTION = 1537;
  const PROJECTION_COUNT = 26;
  const OUTPUT_RATE_HZ = 64;

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
    throw new TypeError("Fixed-instance policy produced a non-canonical value.");
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
      throw new Error("Fixed-instance policy isolation capability surface is open.");
    }
  }

  function assertPolicyView(view) {
    if (
      !exactKeys(view, ROOT_KEYS)
      || view.schema !== 1
      || view.contract_version !== POLICY_VIEW_VERSION
      || canonical(view.units) !== canonical({ input: "U", output: "1", time: "s" })
      || view.order !== "fixed-instance-packet-order-v1"
      || !Array.isArray(view.projections)
      || view.projections.length !== PROJECTION_COUNT
    ) throw new Error("Fixed-instance policy view root is invalid.");
    for (const [projectionOrdinal, projection] of view.projections.entries()) {
      if (
        !exactKeys(projection, PROJECTION_KEYS)
        || projection.ordinal !== projectionOrdinal
        || projection.schedule === null
        || typeof projection.schedule !== "object"
        || Array.isArray(projection.schedule)
        || !Array.isArray(projection.samples)
        || projection.samples.length !== SAMPLES_PER_PROJECTION
      ) throw new Error("Fixed-instance policy projection is invalid.");
      for (const [sampleOrdinal, sample] of projection.samples.entries()) {
        if (
          !exactKeys(sample, SAMPLE_KEYS)
          || sample.ordinal !== sampleOrdinal
          || sample.time_s !== sampleOrdinal / OUTPUT_RATE_HZ
          || !Number.isFinite(sample.input_a_u)
          || !Number.isFinite(sample.input_b_u)
          || !["A", "B"].includes(sample.active_channel)
          || !Number.isFinite(sample.reported_output)
          || typeof sample.output_clamped !== "boolean"
          || typeof sample.state_reset_applied !== "boolean"
          || typeof sample.state_freeze_active !== "boolean"
        ) throw new Error("Fixed-instance policy sample is invalid.");
      }
    }
  }

  function execute(requestJson) {
    assertIsolation();
    const request = JSON.parse(requestJson);
    if (
      !exactKeys(request, [
        "schema", "contract_version", "active_arm_ids", "policy_view_json",
      ])
      || request.schema !== 1
      || request.contract_version !== CALL_VERSION
      || canonical(request.active_arm_ids) !== canonical(ACTIVE_ARM_IDS)
      || typeof request.policy_view_json !== "string"
    ) throw new Error("Fixed-instance isolated policy call is invalid.");
    const policyView = JSON.parse(request.policy_view_json);
    if (canonical(policyView) !== request.policy_view_json) {
      throw new Error("Fixed-instance policy view bytes are not canonical JSON.");
    }
    assertPolicyView(policyView);

    let signedSum = 0;
    let absoluteSum = 0;
    let lastOutput = 0;
    let rows = 0;
    for (const projection of policyView.projections) {
      for (const sample of projection.samples) {
        signedSum += sample.reported_output;
        absoluteSum += Math.abs(sample.reported_output);
        lastOutput = sample.reported_output;
        rows += 1;
      }
    }
    if (rows !== PROJECTION_COUNT * SAMPLES_PER_PROJECTION) {
      throw new Error("Fixed-instance policy row count is false.");
    }
    const work = {
      sample_rows_read: rows,
      scalar_operations: rows * 3,
      retained_state_bytes: 32,
    };
    return canonical({
      schema: 1,
      contract_version: BUNDLE_RESPONSE_VERSION,
      status: "completed",
      response_inputs: ACTIVE_ARM_IDS.map((armId) => ({
        arm_id: armId,
        signed_sum: signedSum,
        absolute_sum: absoluteSum,
        last_output: lastOutput,
        work,
      })),
      reason_codes: [],
      authority: "public-development-fixed-instance-view-digest-conformance-only",
      comparison_inference_permitted: false,
      claim_eligible: false,
      result_label: "NO_RESULT",
      no_result: true,
    });
  }

  Object.defineProperty(globalThis, "__fixture026_rsd_t02_fixed_policy_execute__", {
    value: execute,
    configurable: false,
    enumerable: false,
    writable: false,
  });
})();
