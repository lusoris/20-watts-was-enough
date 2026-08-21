import { createHash } from "node:crypto";

export const EXTERNAL_ENERGY_CONTRACT_VERSION = "candidate-010.external-energy-reading.v1";
export const MODELED_ENERGY_CONTRACT_VERSION = "candidate-010.modeled-energy.v1";
export const NORMALIZED_EXTERNAL_ENERGY_OBSERVATION = "candidate-010.normalized-external-energy-observation.v1";

const ENERGY_TO_JOULES = Object.freeze({ J: 1, mJ: 1e-3, Wh: 3600, kWh: 3.6e6 });
const POWER_TO_WATTS = Object.freeze({ W: 1, mW: 1e-3, kW: 1e3 });

export class EnergyContractError extends Error {
  constructor(code, message) {
    super(`${code}: ${message}`);
    this.name = "EnergyContractError";
    this.code = code;
  }
}

function fail(code, message) {
  throw new EnergyContractError(code, message);
}

function record(value, field) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    fail("INVALID_OBJECT", `${field} must be an object`);
  }
  return value;
}

function nonEmpty(value, field) {
  if (typeof value !== "string" || value.trim() === "") {
    fail("MISSING_IDENTITY", `${field} must be a non-empty string`);
  }
  return value;
}

function finite(value, field, { minimum = -Infinity, exclusiveMinimum = false } = {}) {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    fail("INVALID_NUMBER", `${field} must be a finite number`);
  }
  if (exclusiveMinimum ? value <= minimum : value < minimum) {
    fail("OUT_OF_RANGE", `${field} must be ${exclusiveMinimum ? "greater than" : "at least"} ${minimum}`);
  }
  return value;
}

function exactBoolean(value, field, expected) {
  if (value !== expected) fail("INTEGRITY_FLAG", `${field} must be ${expected}`);
}

function canonical(value) {
  if (Array.isArray(value)) return `[${value.map(canonical).join(",")}]`;
  if (value && typeof value === "object") {
    return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${canonical(value[key])}`).join(",")}}`;
  }
  return JSON.stringify(value);
}

function sha256(value) {
  return createHash("sha256").update(value).digest("hex");
}

function exactUtcInstant(value, field) {
  const milliseconds = instant(value, field);
  if (!value.endsWith("Z") || new Date(milliseconds).toISOString() !== value) {
    fail("INEXACT_UTC_INTERVAL", `${field} must be an exact canonical UTC instant`);
  }
  return milliseconds;
}

function instant(value, field) {
  nonEmpty(value, field);
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/.test(value)) {
    fail("INVALID_CLOCK", `${field} must include time and an explicit UTC offset`);
  }
  const milliseconds = Date.parse(value);
  if (!Number.isFinite(milliseconds)) fail("INVALID_CLOCK", `${field} must be an ISO-8601 instant`);
  return milliseconds;
}

function convert(value, unit, units, field) {
  finite(value, `${field}.value`, { minimum: 0 });
  if (!Object.hasOwn(units, unit)) {
    fail("INVALID_UNIT", `${field}.unit must be one of ${Object.keys(units).join(", ")}`);
  }
  return value * units[unit];
}

function validateCommon(input) {
  const contract = record(input, "reading");
  if (contract.contract_version !== EXTERNAL_ENERGY_CONTRACT_VERSION) {
    fail("UNSUPPORTED_VERSION", `contract_version must be ${EXTERNAL_ENERGY_CONTRACT_VERSION}`);
  }
  nonEmpty(contract.reading_id, "reading_id");
  if (!["hardware-observation", "test-fixture"].includes(contract.record_kind)) {
    fail("INVALID_RECORD_KIND", "record_kind must be hardware-observation or test-fixture");
  }

  const provider = record(contract.provider, "provider");
  if (provider.type !== "external-meter") {
    fail("NON_EXTERNAL_PROVIDER", "provider.type must be external-meter; software telemetry is not a meter");
  }
  if (!new Set(["wall", "rail"]).has(provider.medium)) {
    fail("INVALID_BOUNDARY", "provider.medium must be wall or rail");
  }
  nonEmpty(provider.provider_id, "provider.provider_id");
  nonEmpty(provider.meter_id, "provider.meter_id");
  nonEmpty(provider.boundary, "provider.boundary");
  nonEmpty(provider.hardware_configuration, "provider.hardware_configuration");
  exactBoolean(provider.software_telemetry, "provider.software_telemetry", false);

  const calibration = record(contract.calibration, "calibration");
  nonEmpty(calibration.calibration_id, "calibration.calibration_id");
  nonEmpty(calibration.traceability_reference, "calibration.traceability_reference");
  const calibratedAt = instant(calibration.calibrated_at, "calibration.calibrated_at");
  const validUntil = instant(calibration.valid_until, "calibration.valid_until");
  if (validUntil <= calibratedAt) fail("INVALID_CALIBRATION", "calibration validity must end after calibration");
  const relativeUncertainty = finite(
    calibration.relative_standard_uncertainty,
    "calibration.relative_standard_uncertainty",
    { minimum: 0, exclusiveMinimum: true },
  );
  if (relativeUncertainty >= 1) fail("INVALID_CALIBRATION", "relative calibration uncertainty must be less than 1");
  const coverageFactor = finite(calibration.coverage_factor, "calibration.coverage_factor", { minimum: 1 });

  const interval = record(contract.interval, "interval");
  const startedAt = instant(interval.started_at, "interval.started_at");
  const endedAt = instant(interval.ended_at, "interval.ended_at");
  if (endedAt <= startedAt) fail("INVALID_CLOCK", "measurement end must be after start");
  nonEmpty(interval.clock_id, "interval.clock_id");
  const clockUncertaintySeconds = finite(interval.clock_uncertainty_s, "interval.clock_uncertainty_s", { minimum: 0 });
  exactBoolean(interval.clock_discontinuity_observed, "interval.clock_discontinuity_observed", false);
  if (calibratedAt > startedAt) fail("INVALID_CALIBRATION", "calibration occurs after measurement start");
  if (validUntil < endedAt) fail("EXPIRED_CALIBRATION", "calibration expires before measurement end");

  const integrity = record(contract.integrity, "integrity");
  exactBoolean(integrity.meter_reset_observed, "integrity.meter_reset_observed", false);
  exactBoolean(integrity.negative_reading_observed, "integrity.negative_reading_observed", false);

  return {
    contract,
    provider,
    calibration,
    interval,
    startedAt,
    endedAt,
    durationSeconds: (endedAt - startedAt) / 1000,
    relativeUncertainty,
    coverageFactor,
    clockUncertaintySeconds,
  };
}

function counterDelta(common, measurement) {
  const start = record(measurement.start, "measurement.start");
  const end = record(measurement.end, "measurement.end");
  const startAt = instant(start.observed_at, "measurement.start.observed_at");
  const endAt = instant(end.observed_at, "measurement.end.observed_at");
  if (startAt !== common.startedAt || endAt !== common.endedAt) {
    fail("BOUNDARY_CLOCK_MISMATCH", "counter timestamps must equal the declared interval boundaries");
  }
  const startJoules = convert(start.value, start.unit, ENERGY_TO_JOULES, "measurement.start");
  const endJoules = convert(end.value, end.unit, ENERGY_TO_JOULES, "measurement.end");
  if (endJoules < startJoules) {
    fail("COUNTER_RESET_OR_ROLLOVER", "end reading is lower than start; reset and rollover inference is forbidden");
  }
  return { valueJoules: endJoules - startJoules, samples: 2, integration: "counter-delta" };
}

function sampledPower(common, measurement) {
  if (measurement.integration !== "trapezoidal") {
    fail("INVALID_INTEGRATION", "sampled power requires explicit trapezoidal integration");
  }
  if (!Array.isArray(measurement.samples) || measurement.samples.length < 2) {
    fail("INSUFFICIENT_SAMPLES", "sampled power requires at least two samples");
  }
  const samples = measurement.samples.map((sample, index) => {
    record(sample, `measurement.samples[${index}]`);
    return {
      milliseconds: instant(sample.observed_at, `measurement.samples[${index}].observed_at`),
      watts: convert(sample.value, sample.unit, POWER_TO_WATTS, `measurement.samples[${index}]`),
    };
  });
  if (samples[0].milliseconds !== common.startedAt || samples.at(-1).milliseconds !== common.endedAt) {
    fail("BOUNDARY_CLOCK_MISMATCH", "power samples must include the exact declared interval boundaries");
  }
  let valueJoules = 0;
  for (let index = 1; index < samples.length; index += 1) {
    const elapsedSeconds = (samples[index].milliseconds - samples[index - 1].milliseconds) / 1000;
    if (elapsedSeconds <= 0) fail("NON_MONOTONIC_CLOCK", "power sample timestamps must increase strictly");
    valueJoules += elapsedSeconds * (samples[index - 1].watts + samples[index].watts) / 2;
  }
  return { valueJoules, samples: samples.length, integration: "trapezoidal-power" };
}

export function validateExternalEnergyReading(input) {
  const common = validateCommon(input);
  const measurement = record(common.contract.measurement, "measurement");
  let result;
  if (measurement.method === "counter-delta") result = counterDelta(common, measurement);
  else if (measurement.method === "sampled-power") result = sampledPower(common, measurement);
  else fail("INVALID_METHOD", "measurement.method must be counter-delta or sampled-power");

  return {
    ...common,
    ...result,
  };
}

export function normalizeModeledEnergy(input) {
  if (input === null || input === undefined) return null;
  const modeled = record(input, "modeledEnergy");
  if (modeled.contract_version !== MODELED_ENERGY_CONTRACT_VERSION) {
    fail("UNSUPPORTED_MODELED_VERSION", `modeled contract_version must be ${MODELED_ENERGY_CONTRACT_VERSION}`);
  }
  nonEmpty(modeled.model_id, "modeledEnergy.model_id");
  nonEmpty(modeled.basis, "modeledEnergy.basis");
  exactBoolean(modeled.calibrated, "modeledEnergy.calibrated", false);
  const valueJoules = finite(modeled.value_j, "modeledEnergy.value_j", { minimum: 0 });
  return Object.freeze({
    status: "modeled-only",
    value_j: valueJoules,
    model_id: modeled.model_id,
    basis: modeled.basis,
    calibrated: false,
    claim_eligible_as_measured_energy: false,
  });
}

export function evaluateExternalEnergyReading(input, { modeledEnergy = null } = {}) {
  const validated = validateExternalEnergyReading(input);
  const fixtureOnly = validated.contract.record_kind === "test-fixture";
  const standardUncertaintyJoules = validated.valueJoules * validated.relativeUncertainty;
  return Object.freeze({
    contract_version: EXTERNAL_ENERGY_CONTRACT_VERSION,
    reading_id: validated.contract.reading_id,
    measured: Object.freeze({
      schema: 1,
      kind: NORMALIZED_EXTERNAL_ENERGY_OBSERVATION,
      source: "external-meter",
      validated: true,
      reading_id: validated.contract.reading_id,
      record_kind: validated.contract.record_kind,
      status: fixtureOnly ? "fixture-only" : "measured-external",
      value_j: validated.valueJoules,
      duration_s: validated.durationSeconds,
      integration: validated.integration,
      sample_count: validated.samples,
      unit: "J",
      interval_started_at: validated.interval.started_at,
      interval_ended_at: validated.interval.ended_at,
      boundary: validated.provider.boundary,
      medium: validated.provider.medium,
      provider_id: validated.provider.provider_id,
      meter_id: validated.provider.meter_id,
      hardware_configuration: validated.provider.hardware_configuration,
      calibration_id: validated.calibration.calibration_id,
      calibrated_at: validated.calibration.calibrated_at,
      calibration_valid_until: validated.calibration.valid_until,
      calibration_traceability_reference: validated.calibration.traceability_reference,
      calibration_relative_standard_uncertainty: validated.relativeUncertainty,
      calibration_standard_uncertainty_j: standardUncertaintyJoules,
      calibration_expanded_uncertainty_j: standardUncertaintyJoules * validated.coverageFactor,
      coverage_factor: validated.coverageFactor,
      clock_uncertainty_s: validated.clockUncertaintySeconds,
      raw_reading_sha256: sha256(canonical(input)),
      allocation: "unbound",
      binding: null,
      claim_eligibility: fixtureOnly ? "fixture-ineligible" : "requires-provenance-review",
    }),
    modeled: normalizeModeledEnergy(modeledEnergy),
  });
}

const OWNERSHIP_FIELDS = Object.freeze([
  "run_id",
  "pair_id",
  "work_unit_id",
  "scenario_id",
  "task_family",
  "backend_id",
  "cluster_id",
  "opportunity_id",
  "arm",
  "interval_started_at",
  "interval_ended_at",
]);

export function hashProvenanceReviewRecord(review) {
  const value = record(review, "provenanceReview");
  const unsigned = { ...value };
  delete unsigned.review_sha256;
  return sha256(canonical(unsigned));
}

export function hashNormalizedExternalEnergyObservation(observation) {
  validateCanonicalObservation(observation);
  return sha256(canonical(observation));
}

function validateOwnership(ownership, observation) {
  const value = record(ownership, "ownership");
  for (const field of OWNERSHIP_FIELDS) nonEmpty(value[field], `ownership.${field}`);
  const startedAt = exactUtcInstant(value.interval_started_at, "ownership.interval_started_at");
  const endedAt = exactUtcInstant(value.interval_ended_at, "ownership.interval_ended_at");
  if (endedAt <= startedAt) fail("INVALID_CLOCK", "ownership interval end must be after start");
  if (
    value.interval_started_at !== observation.interval_started_at
    || value.interval_ended_at !== observation.interval_ended_at
  ) fail("OWNERSHIP_INTERVAL_MISMATCH", "ownership interval must exactly equal the meter observation interval");
  return Object.fromEntries(OWNERSHIP_FIELDS.map((field) => [field, value[field]]));
}

function validateReview(review, observationSha256) {
  const value = record(review, "provenanceReview");
  if (value.schema !== 1) fail("INVALID_REVIEW", "provenanceReview.schema must be 1");
  nonEmpty(value.review_id, "provenanceReview.review_id");
  nonEmpty(value.reviewer_id, "provenanceReview.reviewer_id");
  exactUtcInstant(value.reviewed_at, "provenanceReview.reviewed_at");
  if (value.decision !== "approved") fail("INVALID_REVIEW", "provenanceReview.decision must be approved");
  if (value.observation_sha256 !== observationSha256) {
    fail("REVIEW_OBSERVATION_MISMATCH", "provenance review does not name this normalized observation");
  }
  if (!/^[a-f0-9]{64}$/.test(value.review_sha256 ?? "")) {
    fail("INVALID_REVIEW_HASH", "provenanceReview.review_sha256 must be a SHA-256 digest");
  }
  if (hashProvenanceReviewRecord(value) !== value.review_sha256) {
    fail("INVALID_REVIEW_HASH", "provenance review hash does not match its canonical content");
  }
  return { ...value };
}

function validateCanonicalObservation(observation) {
  const value = record(observation, "observation");
  if (value.schema !== 1 || value.kind !== NORMALIZED_EXTERNAL_ENERGY_OBSERVATION) {
    fail("INVALID_NORMALIZED_OBSERVATION", "observation is not canonical provider output");
  }
  if (value.source !== "external-meter" || value.validated !== true || value.status !== "measured-external") {
    fail("INELIGIBLE_ENERGY_SOURCE", "only validated non-fixture external-meter observations can be bound");
  }
  if (value.record_kind !== "hardware-observation" || value.claim_eligibility !== "requires-provenance-review") {
    fail("INELIGIBLE_ENERGY_SOURCE", "fixture, modeled, already allocated, and non-measured data cannot be bound");
  }
  if (value.allocation !== "unbound" || value.binding !== null) {
    fail("ALREADY_BOUND", "energy observation is already allocated or bound");
  }
  finite(value.value_j, "observation.value_j", { minimum: 0 });
  if (value.unit !== "J") fail("INVALID_UNIT", "observation.unit must be J");
  nonEmpty(value.reading_id, "observation.reading_id");
  nonEmpty(value.provider_id, "observation.provider_id");
  nonEmpty(value.meter_id, "observation.meter_id");
  if (!/^[a-f0-9]{64}$/.test(value.raw_reading_sha256 ?? "")) {
    fail("INVALID_READING_HASH", "observation.raw_reading_sha256 must be a SHA-256 digest");
  }
  return value;
}

export function bindExternalEnergyObservation(observation, { ownership, provenanceReview } = {}) {
  const canonicalObservation = validateCanonicalObservation(observation);
  const observationSha256 = sha256(canonical(canonicalObservation));
  const normalizedOwnership = validateOwnership(ownership, canonicalObservation);
  const normalizedReview = validateReview(provenanceReview, observationSha256);
  const binding = Object.freeze({
    schema: 1,
    allocation: "paired-work-unit",
    ownership: Object.freeze(normalizedOwnership),
    provenance_review: Object.freeze(normalizedReview),
    source_observation_sha256: observationSha256,
  });
  return Object.freeze({
    ...canonicalObservation,
    allocation: "paired-work-unit",
    binding,
    claim_eligibility: "claim-eligible-per-work-unit",
  });
}

export function validateBoundExternalEnergyObservation(observation, expectedOwnership) {
  const value = record(observation, "observation");
  if (
    value.schema !== 1
    || value.kind !== NORMALIZED_EXTERNAL_ENERGY_OBSERVATION
    || value.source !== "external-meter"
    || value.validated !== true
    || value.status !== "measured-external"
    || value.record_kind !== "hardware-observation"
    || value.unit !== "J"
    || value.allocation !== "paired-work-unit"
    || value.claim_eligibility !== "claim-eligible-per-work-unit"
  ) fail("UNBOUND_ENERGY_OBSERVATION", "observation is not claim-eligible bound provider output");
  finite(value.value_j, "observation.value_j", { minimum: 0 });
  const binding = record(value.binding, "observation.binding");
  if (binding.schema !== 1 || binding.allocation !== "paired-work-unit") {
    fail("UNBOUND_ENERGY_OBSERVATION", "observation binding is incomplete");
  }
  const ownership = validateOwnership(binding.ownership, value);
  const expected = validateOwnership(expectedOwnership, value);
  if (canonical(ownership) !== canonical(expected)) {
    fail("OWNERSHIP_MISMATCH", "bound observation ownership does not match the analyzed record");
  }
  const source = { ...value, allocation: "unbound", binding: null, claim_eligibility: "requires-provenance-review" };
  const sourceHash = sha256(canonical(source));
  if (binding.source_observation_sha256 !== sourceHash) {
    fail("BOUND_OBSERVATION_TAMPER", "bound observation no longer matches its source observation hash");
  }
  validateReview(binding.provenance_review, sourceHash);
  return value;
}
