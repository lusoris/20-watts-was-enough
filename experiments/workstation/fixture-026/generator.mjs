import { createHash } from "node:crypto";

export const FIXTURE_026_GENERATOR_VERSION = "fixture-026.rsd-t01-generator.v1";
export const FIXTURE_026_RNG_CONTRACT = Object.freeze({
  family: "PCG-CM-DXSM 128/64",
  state_bits: 128,
  output_bits: 64,
  transition_multiplier_hex: "0xda942042e4dd58b5",
  output_permutation: "DXSM applied to the pre-transition 128-bit state",
  seeding: "custom SHA-256-derived 128-bit state and odd 128-bit increment",
  numpy_seedsequence_compatible: false,
});
export const FIXTURE_026_VALID_CLASSES = Object.freeze([
  "exact-scale-symmetry",
  "approximate-scale-symmetry",
  "exact-adaptation-only",
  "equal-peak-different-shape",
  "static-ratio",
]);
export const FIXTURE_026_CLASSES = Object.freeze([
  ...FIXTURE_026_VALID_CLASSES,
  "invalid-record",
]);
export const FIXTURE_026_HISTORY_FAMILIES = Object.freeze([
  "step",
  "pulse",
  "ramp",
  "band-limited-multisine",
]);

const MASK_64 = (1n << 64n) - 1n;
const MASK_128 = (1n << 128n) - 1n;
const PCG_CM_DXSM_MULTIPLIER = 0xda942042e4dd58b5n;
const TWO_POW_53 = 9007199254740992;

function littleEndianBigInt(bytes) {
  let value = 0n;
  for (let index = bytes.length - 1; index >= 0; index -= 1) value = (value << 8n) | BigInt(bytes[index]);
  return value;
}

export class PcgCmDxsm12864 {
  constructor(literalSeed) {
    const digest = createHash("sha256").update(String(literalSeed), "utf8").digest();
    const initialState = littleEndianBigInt(digest.subarray(0, 16));
    const selector = littleEndianBigInt(digest.subarray(16, 32));
    this.increment = ((selector << 1n) | 1n) & MASK_128;
    this.state = 0n;
    this.advance();
    this.state = (this.state + initialState) & MASK_128;
    this.advance();
  }

  advance() {
    this.state = (this.state * PCG_CM_DXSM_MULTIPLIER + this.increment) & MASK_128;
  }

  nextUint64() {
    const old = this.state;
    this.advance();
    let high = (old >> 64n) & MASK_64;
    const low = (old & MASK_64) | 1n;
    high ^= high >> 32n;
    high = (high * PCG_CM_DXSM_MULTIPLIER) & MASK_64;
    high ^= high >> 48n;
    return (high * low) & MASK_64;
  }

  uniform() {
    return Number(this.nextUint64() >> 11n) / TWO_POW_53;
  }

  range(minimum, maximum) {
    return minimum + (maximum - minimum) * this.uniform();
  }
}

export function publicSeedBytes(seed) {
  if (!Number.isSafeInteger(seed) || seed < 0 || seed > 0xffff_ffff) {
    throw new Error("Fixture 026 public seed must be an unsigned integer.");
  }
  const bytes = Buffer.alloc(8);
  bytes.writeBigUInt64LE(BigInt(seed));
  return bytes;
}

export function publicSeedHex(seed) {
  return publicSeedBytes(seed).toString("hex").toUpperCase();
}

export function fixture026StreamPreimage({ phase, protocol, seed, scope, canonicalId }) {
  if (!new Set(["development", "confirmation", "transfer", "ablation"]).has(phase)) {
    throw new Error("Fixture 026 stream phase is invalid.");
  }
  if (protocol !== "RSD-T01") throw new Error("Fixture 026 stream protocol is invalid.");
  if (!new Set(["dgp", "observation", "policy", "evaluation", "analysis"]).has(scope)) {
    throw new Error("Fixture 026 stream scope is invalid.");
  }
  if (!/^(0|[1-9][0-9]*)$/.test(String(canonicalId))) {
    throw new Error("Fixture 026 stream canonical ID must be unpadded ASCII decimal.");
  }
  return `F026-v1|${phase}|${protocol}|${publicSeedHex(seed)}|${scope}|${canonicalId}`;
}

function exactKeys(value, keys) {
  return value
    && typeof value === "object"
    && !Array.isArray(value)
    && JSON.stringify(Object.keys(value).sort()) === JSON.stringify([...keys].sort());
}

export function validateFixture026Config(config) {
  const keys = [
    "schema", "artifact", "profile", "worlds_per_seed", "time_step_s", "horizon_s",
    "trajectory_quadrature", "exact_discrepancy_tolerance", "approximate_discrepancy_floor",
    "approximate_discrepancy_ceiling", "endpoint_tolerance", "peak_tolerance",
    "tail_window_s", "input_floor_u", "output_scale_y", "max_loss",
  ];
  if (
    !exactKeys(config, keys)
    || config.schema !== 1
    || config.artifact !== "fixture-026"
    || !new Set(["smoke", "development"]).has(config.profile)
    || !Number.isSafeInteger(config.worlds_per_seed)
    || config.worlds_per_seed < FIXTURE_026_CLASSES.length
    || config.worlds_per_seed > 120
    || config.worlds_per_seed % FIXTURE_026_CLASSES.length !== 0
    || config.time_step_s !== 0.02
    || config.horizon_s !== 4
    || config.trajectory_quadrature !== "trapezoid"
    || config.exact_discrepancy_tolerance !== 1e-12
    || config.approximate_discrepancy_floor !== 0.01
    || config.approximate_discrepancy_ceiling !== 0.06
    || config.endpoint_tolerance !== 1e-12
    || config.peak_tolerance !== 1e-12
    || config.tail_window_s !== 0.5
    || config.input_floor_u !== 0.05
    || config.output_scale_y !== 1
    || config.max_loss !== 100
  ) throw new Error("Fixture 026 configuration is invalid.");
  return config;
}

function historyRatio(family, timeS, horizonS) {
  if (family === "step") return timeS < 0.5 ? 1 : 2;
  if (family === "pulse") return timeS >= 0.5 && timeS < 2.4 ? 2 : 1;
  if (family === "ramp") {
    if (timeS < 0.5) return 1;
    if (timeS < 2.5) return 1 + (timeS - 0.5) / 2;
    return 2;
  }
  const envelope = Math.sin(Math.PI * timeS / horizonS) ** 2;
  return 1 + envelope * (
    0.34 * Math.sin(2 * Math.PI * timeS / horizonS)
    + 0.18 * Math.sin(6 * Math.PI * timeS / horizonS + 0.35)
    + 0.42
  );
}

function normalizedDynamicTrace(ratios, dt, tauS) {
  let reference = 1;
  return ratios.map((ratio, index) => {
    if (index > 0) reference += dt * (ratios[index - 1] - reference) / tauS;
    return Math.log(ratio / reference);
  });
}

function normalizePeak(shape) {
  const peak = Math.max(...shape);
  return shape.map((value) => value / peak);
}

function equalPeakShapes(times, horizonS, amplitude) {
  const left = normalizePeak(times.map((timeS) => {
    const x = timeS / horizonS;
    return x <= 0 || x >= 1 ? 0 : x ** 2 * (1 - x) ** 5;
  }));
  const right = normalizePeak(times.map((timeS) => {
    const x = timeS / horizonS;
    return x <= 0 || x >= 1 ? 0 : x ** 5 * (1 - x) ** 2;
  }));
  return {
    base: left.map((value) => amplitude * value),
    scaled: right.map((value) => amplitude * value),
  };
}

function rmse(left, right, scale = 1) {
  let squared = 0;
  for (let index = 0; index < left.length; index += 1) {
    const error = (left[index] - right[index]) / scale;
    squared += error * error;
  }
  return Math.sqrt(squared / left.length);
}

function trapezoidRmse(left, right, scale, dt) {
  let integral = 0;
  for (let index = 0; index < left.length; index += 1) {
    const error = (left[index] - right[index]) / scale;
    const weight = index === 0 || index === left.length - 1 ? 0.5 : 1;
    integral += weight * error * error * dt;
  }
  const duration = (left.length - 1) * dt;
  return Math.sqrt(integral / duration);
}

function maximumWithIndex(values) {
  let value = -Infinity;
  let index = -1;
  for (const [candidateIndex, candidate] of values.entries()) {
    if (candidate > value) {
      value = candidate;
      index = candidateIndex;
    }
  }
  return { value, index };
}

export function computeTrajectoryDiagnostics(trace, config) {
  if (!Array.isArray(trace) || trace.length < 2) throw new Error("Fixture 026 trajectory is missing.");
  const base = trace.map((sample) => sample.output_base_y);
  const scaled = trace.map((sample) => sample.output_scaled_y);
  const staticBase = trace.map((sample) => Math.log(
    Object.hasOwn(sample, "input_ratio")
      ? sample.input_ratio
      : sample.input_base_u / sample.background_base_u
  ));
  const staticScaled = trace.map((sample) => Math.log(
    Object.hasOwn(sample, "input_ratio")
      ? sample.input_ratio
      : sample.input_scaled_u / sample.background_scaled_u
  ));
  const basePeak = maximumWithIndex(base);
  const scaledPeak = maximumWithIndex(scaled);
  const tailCount = Math.round(config.tail_window_s / config.time_step_s) + 1;
  const baseTail = base.slice(-tailCount);
  const scaledTail = scaled.slice(-tailCount);
  return Object.freeze({
    trajectory_discrepancy: trapezoidRmse(base, scaled, config.output_scale_y, config.time_step_s),
    peak_discrepancy: Math.abs(basePeak.value - scaledPeak.value),
    endpoint_discrepancy: Math.abs(base.at(-1) - scaled.at(-1)),
    tail_discrepancy: rmse(baseTail, scaledTail, config.output_scale_y),
    latency_discrepancy_s: Math.abs(basePeak.index - scaledPeak.index) * config.time_step_s,
    static_fit_rmse: 0.5 * (
      trapezoidRmse(base, staticBase, config.output_scale_y, config.time_step_s)
      + trapezoidRmse(scaled, staticScaled, config.output_scale_y, config.time_step_s)
    ),
  });
}

function samplePayload(sample) {
  return JSON.stringify({
    ordinal: sample.ordinal,
    time_s: sample.time_s,
    input_base_u: sample.input_base_u,
    input_scaled_u: sample.input_scaled_u,
    background_base_u: sample.background_base_u,
    background_scaled_u: sample.background_scaled_u,
    output_base_y: sample.output_base_y,
    output_scaled_y: sample.output_scaled_y,
    input_unit_token: sample.input_unit_token,
    output_unit_token: sample.output_unit_token,
    interface_version: sample.interface_version,
    reference_origin: sample.reference_origin,
  });
}

export function observationChecksum(sample) {
  return createHash("sha256").update(samplePayload(sample)).digest("hex");
}

function validTrace({ config, background, scaleFactor, tauS, worldClass, amplitude, historyFamily }) {
  const count = Math.round(config.horizon_s / config.time_step_s);
  const times = Array.from({ length: count + 1 }, (_, ordinal) => ordinal * config.time_step_s);
  const ratios = times.map((timeS) => historyRatio(historyFamily, timeS, config.horizon_s));
  const dynamic = normalizedDynamicTrace(ratios, config.time_step_s, tauS);
  let base = dynamic;
  let scaled = dynamic;
  if (worldClass === "static-ratio") {
    base = ratios.map((ratio) => Math.log(ratio));
    scaled = [...base];
  } else if (worldClass === "approximate-scale-symmetry") {
    scaled = dynamic.map((value, index) => (
      value + amplitude * Math.sin(Math.PI * times[index] / config.horizon_s) ** 2
    ));
  } else if (worldClass === "exact-adaptation-only") {
    scaled = dynamic.map((value, index) => (
      value + amplitude * Math.sin(Math.PI * times[index] / config.horizon_s) ** 2
    ));
  } else if (worldClass === "equal-peak-different-shape") {
    const shapes = equalPeakShapes(times, config.horizon_s, amplitude);
    base = shapes.base;
    scaled = shapes.scaled;
  }
  return times.map((timeS, ordinal) => {
    const ratio = ratios[ordinal];
    const sample = {
      ordinal,
      time_s: timeS,
      input_base_u: background * ratio,
      input_scaled_u: background * scaleFactor * ratio,
      background_base_u: background,
      background_scaled_u: background * scaleFactor,
      output_base_y: base[ordinal],
      output_scaled_y: scaled[ordinal],
      input_unit_token: "U",
      output_unit_token: "1",
      interface_version: "rsd-interface-v1",
      reference_origin: worldClass === "static-ratio"
        ? "frozen-initial-background"
        : "initialized-causal",
    };
    return { ...sample, checksum: observationChecksum(sample) };
  });
}

function corruptTrace(trace, variant) {
  const mutable = trace.map((sample) => ({ ...sample }));
  const index = Math.floor(mutable.length / 2);
  if (variant === "time-order") {
    [mutable[index].time_s, mutable[index + 1].time_s] = [mutable[index + 1].time_s, mutable[index].time_s];
    mutable[index].checksum = observationChecksum(mutable[index]);
    mutable[index + 1].checksum = observationChecksum(mutable[index + 1]);
  } else if (variant === "checksum") {
    mutable[index].checksum = "f".repeat(64);
  } else if (variant === "unit-token") {
    mutable[index].input_unit_token = "mU";
  } else {
    mutable[index].reference_origin = "full-trajectory-mean";
    mutable[index].checksum = observationChecksum(mutable[index]);
  }
  return Object.freeze(mutable.map((sample) => Object.freeze(sample)));
}

export function validateObservationTrace(trace, config) {
  const expected = Math.round(config.horizon_s / config.time_step_s) + 1;
  const keys = [
    "ordinal", "time_s", "input_base_u", "input_scaled_u", "background_base_u",
    "background_scaled_u", "output_base_y", "output_scaled_y", "input_unit_token",
    "output_unit_token", "interface_version", "reference_origin", "checksum",
  ];
  const shapeValid = Array.isArray(trace) && trace.length === expected && trace.every((sample) => (
    exactKeys(sample, keys)
    && [sample.time_s, sample.input_base_u, sample.input_scaled_u, sample.background_base_u,
      sample.background_scaled_u, sample.output_base_y, sample.output_scaled_y]
      .every((value) => Number.isFinite(value))
    && sample.input_base_u >= config.input_floor_u
    && sample.input_scaled_u >= config.input_floor_u
    && sample.background_base_u >= config.input_floor_u
    && sample.background_scaled_u >= config.input_floor_u
    && typeof sample.input_unit_token === "string"
    && typeof sample.output_unit_token === "string"
    && typeof sample.interface_version === "string"
    && typeof sample.reference_origin === "string"
    && /^[0-9a-f]{64}$/.test(sample.checksum)
  ));
  const orderingValid = shapeValid && trace.every((sample, index) => (
    Number.isSafeInteger(sample.ordinal)
    && sample.ordinal === index
    && sample.time_s === index * config.time_step_s
    && (index === 0 || sample.time_s > trace[index - 1].time_s)
  ));
  const checksumValid = shapeValid && trace.every((sample) => sample.checksum === observationChecksum(sample));
  const unitValid = shapeValid && trace.every((sample) => (
    sample.input_unit_token === "U" && sample.output_unit_token === "1"
  ));
  const interfaceValid = shapeValid && trace.every((sample) => sample.interface_version === "rsd-interface-v1");
  const referenceOrigins = shapeValid ? new Set(trace.map((sample) => sample.reference_origin)) : new Set();
  const causalReferenceValid = shapeValid
    && referenceOrigins.size === 1
    && [...referenceOrigins].every((origin) => (
      origin === "initialized-causal" || origin === "frozen-initial-background"
    ));
  return Object.freeze({
    trace_valid: orderingValid && checksumValid && unitValid && interfaceValid && causalReferenceValid,
    ordering_valid: orderingValid,
    checksum_valid: checksumValid,
    unit_valid: unitValid,
    interface_valid: interfaceValid,
    causal_reference_valid: causalReferenceValid,
  });
}

function classFor(seed, worldIndex) {
  const offset = seed % FIXTURE_026_CLASSES.length;
  return FIXTURE_026_CLASSES[(worldIndex + offset) % FIXTURE_026_CLASSES.length];
}

export function generateFixture026World({ seed, config, worldIndex }) {
  validateFixture026Config(config);
  if (!Number.isSafeInteger(seed) || seed < 0 || seed > 0xffff_ffff) {
    throw new Error("Fixture 026 seed must be an unsigned 32-bit integer.");
  }
  if (!Number.isSafeInteger(worldIndex) || worldIndex < 0 || worldIndex >= config.worlds_per_seed) {
    throw new Error("Fixture 026 world index is outside the configured grid.");
  }
  const worldClass = classFor(seed, worldIndex);
  const random = new PcgCmDxsm12864(fixture026StreamPreimage({
    phase: "development",
    protocol: "RSD-T01",
    seed,
    scope: "dgp",
    canonicalId: worldIndex,
  }));
  const background = random.range(0.8, 3.2);
  const scaleFactor = random.range(2.2, 5.8);
  const tauS = random.range(0.45, 1.05);
  const historyFamily = FIXTURE_026_HISTORY_FAMILIES[(seed + worldIndex) % FIXTURE_026_HISTORY_FAMILIES.length];
  const amplitude = worldClass === "approximate-scale-symmetry"
    ? random.range(0.035, 0.055)
    : worldClass === "exact-adaptation-only"
      ? random.range(0.32, 0.52)
      : random.range(0.7, 1.1);
  const traceClass = worldClass === "invalid-record" ? "exact-scale-symmetry" : worldClass;
  let trace = validTrace({
    config,
    background,
    scaleFactor,
    tauS,
    worldClass: traceClass,
    amplitude,
    historyFamily,
  });
  let corruption = "none";
  if (worldClass === "invalid-record") {
    const variants = ["time-order", "checksum", "unit-token", "future-normalization"];
    corruption = variants[Number(random.nextUint64() % BigInt(variants.length))];
    trace = corruptTrace(trace, corruption);
  } else {
    trace = Object.freeze(trace.map((sample) => Object.freeze(sample)));
  }
  const validation = validateObservationTrace(trace, config);
  const worldId = createHash("sha256")
    .update(`F026-world-v1|${publicSeedHex(seed)}|${worldIndex}`)
    .digest("hex");
  const initializationId = createHash("sha256")
    .update(`F026-init-v1|${publicSeedHex(seed)}|${worldIndex}`)
    .digest("hex");
  return Object.freeze({
    seed,
    world_index: worldIndex,
    world_id: worldId,
    initialization_id: initializationId,
    scale_group: `positive-multiplicative:${scaleFactor}`,
    interface: "paired-normalized-output",
    oracle_class: worldClass,
    history_family: historyFamily,
    corruption,
    parameters: Object.freeze({
      background_base_u: background,
      scale_factor: scaleFactor,
      reference_time_constant_s: tauS,
      perturbation_amplitude_y: amplitude,
      input_floor_u: config.input_floor_u,
    }),
    trace,
    validation,
  });
}

export function generateFixture026Worlds({ seed, config }) {
  return Object.freeze(Array.from({ length: config.worlds_per_seed }, (_, worldIndex) => (
    generateFixture026World({ seed, config, worldIndex })
  )));
}

export function buildPolicyView(world, arm) {
  if (!new Set(["full-trajectory-diagnostic", "peak-endpoint-lookalike"]).has(arm)) {
    throw new Error("Fixture 026 policy arm is invalid.");
  }
  const common = { trace_valid: world.validation.trace_valid };
  if (!world.validation.trace_valid) return Object.freeze({ ...common, observation: null });
  if (arm === "full-trajectory-diagnostic") {
    const observation = world.trace.map((sample) => Object.freeze({
      ordinal: sample.ordinal,
      time_s: sample.time_s,
      input_ratio: sample.input_base_u / sample.background_base_u,
      output_base_y: sample.output_base_y,
      output_scaled_y: sample.output_scaled_y,
    }));
    return Object.freeze({ ...common, observation: Object.freeze(observation) });
  }
  const base = world.trace.map((sample) => sample.output_base_y);
  const scaled = world.trace.map((sample) => sample.output_scaled_y);
  return Object.freeze({
    ...common,
    observation: Object.freeze({
      peak_discrepancy: Math.abs(Math.max(...base) - Math.max(...scaled)),
      endpoint_discrepancy: Math.abs(base.at(-1) - scaled.at(-1)),
    }),
  });
}

export function assertPolicyViewFirewall(view) {
  const forbidden = new Set([
    "oracle_class", "history_family", "corruption", "parameters", "trajectory_discrepancy",
    "static_fit_rmse", "expected_label", "evaluator",
    "reference_origin", "checksum", "world_id", "initialization_id", "scale_group",
    "seed", "world_index", "canonical_id", "background_base_u", "background_scaled_u",
    "input_base_u", "input_scaled_u",
    "validation", "ordering_valid", "checksum_valid", "unit_valid", "interface_valid",
    "causal_reference_valid", "interface_version", "input_unit_token", "output_unit_token",
    "input_ratio_unit_token",
  ]);
  const visit = (value) => {
    if (!value || typeof value !== "object") return;
    for (const [key, nested] of Object.entries(value)) {
      if (forbidden.has(key)) throw new Error(`Fixture 026 policy view leaked evaluator field ${key}.`);
      visit(nested);
    }
  };
  visit(view);
  return view;
}
