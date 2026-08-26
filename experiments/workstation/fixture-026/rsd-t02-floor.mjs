import {
  FIXTURE_026_RSD_T02_FLOOR_REGISTRY,
} from "./rsd-t02-contract.mjs";

function assertPositive(value, label) {
  if (!Number.isFinite(value) || value <= 0) throw new TypeError(`${label} must be positive.`);
}

export function fixture026RsdT02FloorMagnitude(scaleFactor) {
  assertPositive(scaleFactor, "Fixture 026 RSD-T02 scale factor");
  if (scaleFactor === 1) return 0;
  const inputRatio = 1 / 2;
  return Math.abs(1 - inputRatio)
    * Math.abs(scaleFactor - 1)
    * scaleFactor ** (scaleFactor / (1 - scaleFactor));
}

export function fixture026RsdT02CriticalTimeS({ epsilon, scale_factor: scaleFactor }) {
  assertPositive(epsilon, "Fixture 026 RSD-T02 epsilon");
  assertPositive(scaleFactor, "Fixture 026 RSD-T02 scale factor");
  if (scaleFactor === 1) return 0;
  const slowTimeConstantS = FIXTURE_026_RSD_T02_FLOOR_REGISTRY.slow_time_constant_s;
  const postStepInput = 2;
  return epsilon
    * slowTimeConstantS
    * Math.log(scaleFactor)
    / ((scaleFactor - 1) * postStepInput);
}

export function buildFixture026RsdT02CompositeSampleTimes(epsilon) {
  assertPositive(epsilon, "Fixture 026 RSD-T02 epsilon");
  const tauS = FIXTURE_026_RSD_T02_FLOOR_REGISTRY.slow_time_constant_s;
  const times = new Map();
  for (let index = 0; index <= 1024; index += 1) {
    const timeS = epsilon * tauS * index / 128;
    times.set(timeS.toPrecision(17), timeS);
  }
  for (let index = 0; index <= 512; index += 1) {
    const timeS = tauS * index / 64;
    times.set(timeS.toPrecision(17), timeS);
  }
  return Object.freeze([...times.values()].sort((left, right) => left - right));
}

export function buildFixture026RsdT02FloorDescriptors() {
  let ordinal = 0;
  return Object.freeze(FIXTURE_026_RSD_T02_FLOOR_REGISTRY.models.flatMap((model) => (
    FIXTURE_026_RSD_T02_FLOOR_REGISTRY.epsilon_values.flatMap((epsilon) => (
      FIXTURE_026_RSD_T02_FLOOR_REGISTRY.scale_factors.map((scaleFactor) => {
        const descriptor = Object.freeze({
          descriptor_id: `T02-FLOOR-${String(ordinal).padStart(3, "0")}`,
          ordinal,
          model_id: model.model_id,
          equation_id: model.equation_id,
          asymptotic_floor_truth: model.asymptotic_floor_truth,
          epsilon,
          scale_factor: scaleFactor,
          partition: "public-development",
          primary_endpoint: "maximum-instantaneous-discrepancy",
          primary_norm: "supremum",
          rms_role: "diagnostic-only",
          result: "NO_RESULT",
        });
        ordinal += 1;
        return descriptor;
      })
    ))
  )));
}

export function fixture026RsdT02BoundaryLayerNorms({
  epsilon,
  horizon_s: horizonS = 1,
  slow_time_constant_s: slowTimeConstantS = 1,
}) {
  assertPositive(epsilon, "Fixture 026 RSD-T02 boundary-layer epsilon");
  assertPositive(horizonS, "Fixture 026 RSD-T02 boundary-layer horizon");
  assertPositive(slowTimeConstantS, "Fixture 026 RSD-T02 boundary-layer time constant");
  const fastTimeConstantS = epsilon * slowTimeConstantS;
  return Object.freeze({
    supremum: 1,
    rms: Math.sqrt(
      fastTimeConstantS
      * (1 - Math.exp(-2 * horizonS / fastTimeConstantS))
      / (2 * horizonS),
    ),
    unit: "1",
  });
}

export function fixture026RsdT02ControlDiscrepancy({
  model_id: modelId,
  epsilon,
  scale_factor: scaleFactor,
  normalized_input: normalizedInput = 2,
}) {
  assertPositive(epsilon, "Fixture 026 RSD-T02 control epsilon");
  assertPositive(scaleFactor, "Fixture 026 RSD-T02 control scale factor");
  assertPositive(normalizedInput, "Fixture 026 RSD-T02 normalized input");
  if (modelId === "exact-equivariance-control") return 0;
  if (modelId === "regular-perturbation-control") {
    return epsilon * Math.abs(scaleFactor - 1) * Math.abs(normalizedInput - 1);
  }
  throw new RangeError(`Unknown fixture 026 RSD-T02 control model: ${modelId}`);
}

export function fixture026RsdT02FiniteFloorLowerBound({
  epsilon,
  scale_factor: scaleFactor,
  derivative_bound: derivativeBound,
}) {
  assertPositive(epsilon, "Fixture 026 RSD-T02 epsilon");
  assertPositive(scaleFactor, "Fixture 026 RSD-T02 scale factor");
  if (!Number.isFinite(derivativeBound) || derivativeBound < 0) {
    throw new TypeError("Fixture 026 RSD-T02 derivative bound must be nonnegative.");
  }
  return Math.max(
    0,
    fixture026RsdT02FloorMagnitude(scaleFactor) - epsilon * derivativeBound,
  );
}
