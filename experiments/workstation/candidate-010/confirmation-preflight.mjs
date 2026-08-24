import { createHash } from "node:crypto";

export const CONFIRMATION_PREFLIGHT_VERSION = "candidate-010.confirmation-preflight.v1";

const SHA256_PATTERN = /^[0-9a-f]{64}$/u;
const IDENTITY_NAMES = Object.freeze([
  "hardware",
  "meter",
  "calibration",
  "clock",
  "thermal_protocol",
  "power_plan",
]);

export class ConfirmationPreflightError extends Error {
  constructor(code, message) {
    super(message);
    this.name = "ConfirmationPreflightError";
    this.code = code;
  }
}

function refuse(code, message) {
  throw new ConfirmationPreflightError(code, message);
}

function requireExactKeys(value, expected, label) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    refuse("INVALID_SHAPE", `${label} must be an object`);
  }
  const actual = Object.keys(value).sort();
  const wanted = [...expected].sort();
  if (actual.length !== wanted.length || actual.some((key, index) => key !== wanted[index])) {
    refuse("INVALID_SHAPE", `${label} must contain exactly: ${wanted.join(", ")}`);
  }
}

function requireFinite(value, label, { minimum = 0, exclusiveMinimum = false } = {}) {
  const validMinimum = exclusiveMinimum ? value > minimum : value >= minimum;
  if (!Number.isFinite(value) || !validMinimum) {
    refuse("INVALID_NUMBER", `${label} must be finite and ${exclusiveMinimum ? ">" : ">="} ${minimum}`);
  }
  return value;
}

function requireSafeInteger(value, label, { minimum = 0 } = {}) {
  if (!Number.isSafeInteger(value) || value < minimum) {
    refuse("INVALID_INTEGER", `${label} must be a safe integer >= ${minimum}`);
  }
  return value;
}

function requireSha256(value, label) {
  if (typeof value !== "string" || !SHA256_PATTERN.test(value)) {
    refuse("INVALID_HASH", `${label} must be a lowercase SHA-256 digest`);
  }
  return value;
}

function requireNonemptyString(value, label) {
  if (typeof value !== "string" || value.trim() !== value || value.length === 0) {
    refuse("INVALID_IDENTITY", `${label} must be a non-empty, trimmed string`);
  }
  return value;
}

function safeProduct(values, label) {
  let result = 1;
  for (const value of values) {
    result *= value;
    if (!Number.isSafeInteger(result)) {
      refuse("PROJECTION_OVERFLOW", `${label} exceeds safe integer precision`);
    }
  }
  return result;
}

function safeSum(values, label) {
  const result = values.reduce((sum, value) => sum + value, 0);
  if (!Number.isSafeInteger(result)) {
    refuse("PROJECTION_OVERFLOW", `${label} exceeds safe integer precision`);
  }
  return result;
}

function inverseNormal(probability) {
  if (!(probability > 0 && probability < 1)) {
    refuse("INVALID_PROBABILITY", `Normal probability must be in (0, 1): ${probability}`);
  }
  const a = [-39.69683028665376, 220.9460984245205, -275.9285104469687,
    138.357751867269, -30.66479806614716, 2.506628277459239];
  const b = [-54.47609879822406, 161.5858368580409, -155.6989798598866,
    66.80131188771972, -13.28068155288572];
  const c = [-0.007784894002430293, -0.3223964580411365, -2.400758277161838,
    -2.549732539343734, 4.374664141464968, 2.938163982698783];
  const d = [0.007784695709041462, 0.3224671290700398,
    2.445134137142996, 3.754408661907416];
  const low = 0.02425;
  const high = 1 - low;
  if (probability < low) {
    const q = Math.sqrt(-2 * Math.log(probability));
    return (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5])
      / ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1);
  }
  if (probability > high) return -inverseNormal(1 - probability);
  const q = probability - 0.5;
  const r = q * q;
  return (((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) * q
    / (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1);
}

function canonicalize(value) {
  if (Array.isArray(value)) return value.map(canonicalize);
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.keys(value).sort().map((key) => [key, canonicalize(value[key])]));
  }
  return value;
}

function canonicalSha256(value) {
  return createHash("sha256").update(JSON.stringify(canonicalize(value))).digest("hex");
}

function deepFreeze(value) {
  if (!value || typeof value !== "object" || Object.isFrozen(value)) return value;
  for (const child of Object.values(value)) deepFreeze(child);
  return Object.freeze(value);
}

function validateIdentitySet(identities) {
  requireExactKeys(identities, IDENTITY_NAMES, "identities");
  return Object.fromEntries(IDENTITY_NAMES.map((name) => {
    const identity = identities[name];
    requireExactKeys(identity, ["id", "identity_sha256"], `identities.${name}`);
    return [name, {
      id: requireNonemptyString(identity.id, `identities.${name}.id`),
      identity_sha256: requireSha256(identity.identity_sha256, `identities.${name}.identity_sha256`),
    }];
  }));
}

function validateMeterBlock(meterBlock) {
  requireExactKeys(meterBlock, [
    "measurement_semantics",
    "minimum_actual_samples",
    "maximum_clock_uncertainty_ms",
    "minimum_block_duration_ms",
    "minimum_duration_to_clock_uncertainty_ratio",
    "meter_resolution_j",
    "expanded_measurement_uncertainty_j",
    "minimum_expected_block_energy_j",
    "minimum_energy_to_resolution_uncertainty_ratio",
  ], "meter_block");
  if (meterBlock.measurement_semantics !== "block") {
    refuse("PER_EVENT_ENERGY_REFUSED", "External energy must use meter-block semantics, not per-event measurement");
  }
  const result = {
    measurement_semantics: "block",
    minimum_actual_samples: requireSafeInteger(
      meterBlock.minimum_actual_samples,
      "meter_block.minimum_actual_samples",
      { minimum: 1 },
    ),
    maximum_clock_uncertainty_ms: requireFinite(
      meterBlock.maximum_clock_uncertainty_ms,
      "meter_block.maximum_clock_uncertainty_ms",
      { exclusiveMinimum: true },
    ),
    minimum_block_duration_ms: requireFinite(
      meterBlock.minimum_block_duration_ms,
      "meter_block.minimum_block_duration_ms",
      { exclusiveMinimum: true },
    ),
    minimum_duration_to_clock_uncertainty_ratio: requireFinite(
      meterBlock.minimum_duration_to_clock_uncertainty_ratio,
      "meter_block.minimum_duration_to_clock_uncertainty_ratio",
      { exclusiveMinimum: true },
    ),
    meter_resolution_j: requireFinite(
      meterBlock.meter_resolution_j,
      "meter_block.meter_resolution_j",
      { exclusiveMinimum: true },
    ),
    expanded_measurement_uncertainty_j: requireFinite(
      meterBlock.expanded_measurement_uncertainty_j,
      "meter_block.expanded_measurement_uncertainty_j",
      { exclusiveMinimum: true },
    ),
    minimum_expected_block_energy_j: requireFinite(
      meterBlock.minimum_expected_block_energy_j,
      "meter_block.minimum_expected_block_energy_j",
      { exclusiveMinimum: true },
    ),
    minimum_energy_to_resolution_uncertainty_ratio: requireFinite(
      meterBlock.minimum_energy_to_resolution_uncertainty_ratio,
      "meter_block.minimum_energy_to_resolution_uncertainty_ratio",
      { exclusiveMinimum: true },
    ),
  };
  const durationFloor = result.maximum_clock_uncertainty_ms
    * result.minimum_duration_to_clock_uncertainty_ratio;
  if (result.minimum_block_duration_ms < durationFloor) {
    refuse("METER_DURATION_TOO_SHORT", "Minimum block duration does not satisfy the configured clock-uncertainty ratio");
  }
  const resolutionFloor = Math.max(
    result.meter_resolution_j,
    result.expanded_measurement_uncertainty_j,
  ) * result.minimum_energy_to_resolution_uncertainty_ratio;
  if (result.minimum_expected_block_energy_j < resolutionFloor) {
    refuse("METER_ENERGY_TOO_SMALL", "Minimum expected block energy does not satisfy the configured resolution/uncertainty ratio");
  }
  return result;
}

function validateStatisticalPlan(plan) {
  requireExactKeys(plan, [
    "independent_unit",
    "alpha_familywise",
    "power_target",
    "multiplicity_family_size",
    "planned_seed_count",
    "endpoints",
  ], "statistical_plan");
  if (plan.independent_unit !== "seed") {
    refuse("INDEPENDENT_UNIT_REFUSED", "The independent inferential unit must be seed");
  }
  const alpha = requireFinite(plan.alpha_familywise, "statistical_plan.alpha_familywise", {
    exclusiveMinimum: true,
  });
  if (alpha >= 0.5) refuse("INVALID_PROBABILITY", "alpha_familywise must be below 0.5");
  const power = requireFinite(plan.power_target, "statistical_plan.power_target", {
    minimum: 0.5,
    exclusiveMinimum: true,
  });
  if (power >= 1) refuse("INVALID_PROBABILITY", "power_target must be below 1");
  const familySize = requireSafeInteger(
    plan.multiplicity_family_size,
    "statistical_plan.multiplicity_family_size",
    { minimum: 1 },
  );
  if (!Array.isArray(plan.endpoints) || plan.endpoints.length === 0) {
    refuse("MISSING_POWER_CALCULATION", "At least one powered endpoint is required");
  }
  if (familySize < plan.endpoints.length) {
    refuse(
      "MULTIPLICITY_UNDERCOUNT",
      "multiplicity_family_size cannot be smaller than the number of powered endpoints",
    );
  }
  const alphaStar = alpha / familySize;
  const zPower = inverseNormal(power);
  const seen = new Set();
  const endpointCalculations = plan.endpoints.map((endpoint, index) => {
    requireExactKeys(endpoint, [
      "id",
      "test",
      "pilot_variance",
      "pilot_input_sha256",
      "variance_unit",
      "minimum_relevant_effect",
      "noninferiority_margin",
    ], `statistical_plan.endpoints[${index}]`);
    const id = requireNonemptyString(endpoint.id, `statistical_plan.endpoints[${index}].id`);
    if (seen.has(id)) refuse("DUPLICATE_ENDPOINT", `Duplicate powered endpoint: ${id}`);
    seen.add(id);
    const variance = requireFinite(
      endpoint.pilot_variance,
      `statistical_plan.endpoints[${index}].pilot_variance`,
      { exclusiveMinimum: true },
    );
    if (endpoint.variance_unit !== "paired-seed-contrast") {
      refuse("INVALID_VARIANCE_UNIT", `${id} pilot variance must describe paired seed contrasts`);
    }
    requireSha256(endpoint.pilot_input_sha256, `statistical_plan.endpoints[${index}].pilot_input_sha256`);
    let effect;
    let zAlpha;
    if (endpoint.test === "superiority") {
      if (endpoint.noninferiority_margin !== null) {
        refuse("AMBIGUOUS_EFFECT", `${id} superiority must set noninferiority_margin to null`);
      }
      effect = requireFinite(endpoint.minimum_relevant_effect, `${id}.minimum_relevant_effect`, {
        exclusiveMinimum: true,
      });
      zAlpha = inverseNormal(1 - alphaStar / 2);
    } else if (endpoint.test === "noninferiority") {
      if (endpoint.minimum_relevant_effect !== null) {
        refuse("AMBIGUOUS_EFFECT", `${id} noninferiority must set minimum_relevant_effect to null`);
      }
      effect = requireFinite(endpoint.noninferiority_margin, `${id}.noninferiority_margin`, {
        exclusiveMinimum: true,
      });
      zAlpha = inverseNormal(1 - alphaStar);
    } else {
      refuse("INVALID_TEST", `${id}.test must be superiority or noninferiority`);
    }
    const rawRequired = ((zAlpha + zPower) * Math.sqrt(variance) / effect) ** 2;
    if (!Number.isFinite(rawRequired) || rawRequired > Number.MAX_SAFE_INTEGER) {
      refuse("POWER_CALCULATION_OVERFLOW", `${id} power calculation is not representable`);
    }
    return {
      id,
      test: endpoint.test,
      pilot_variance: variance,
      pilot_input_sha256: endpoint.pilot_input_sha256,
      variance_unit: "paired-seed-contrast",
      minimum_relevant_effect: endpoint.minimum_relevant_effect,
      noninferiority_margin: endpoint.noninferiority_margin,
      alpha_star: alphaStar,
      required_seed_count: Math.max(3, Math.ceil(rawRequired)),
    };
  });
  const derivedSeedCount = Math.max(...endpointCalculations.map((endpoint) => endpoint.required_seed_count));
  const plannedSeedCount = requireSafeInteger(
    plan.planned_seed_count,
    "statistical_plan.planned_seed_count",
    { minimum: 1 },
  );
  if (plannedSeedCount <= 2) {
    refuse("GENERIC_TWO_SEEDS_REFUSED", "Two seeds are not an acceptable generic confirmatory default");
  }
  if (plannedSeedCount < derivedSeedCount) {
    refuse("UNDERPOWERED_PLAN", `planned_seed_count ${plannedSeedCount} is below derived requirement ${derivedSeedCount}`);
  }
  return {
    independent_unit: "seed",
    alpha_familywise: alpha,
    power_target: power,
    multiplicity_family_size: familySize,
    alpha_star: alphaStar,
    planned_seed_count: plannedSeedCount,
    derived_minimum_seed_count: derivedSeedCount,
    endpoints: endpointCalculations,
  };
}

function validateDesign(design) {
  requireExactKeys(design, [
    "scenario_count",
    "arm_count",
    "opportunities_per_seed_scenario",
    "blocks_per_seed_scenario",
  ], "design");
  return Object.fromEntries(Object.entries(design).map(([key, value]) => [
    key,
    requireSafeInteger(value, `design.${key}`, { minimum: 1 }),
  ]));
}

function validatePilotProjection(pilot) {
  requireExactKeys(pilot, [
    "projection_basis_sha256",
    "p99_work_unit_time_ms",
    "p99_work_unit_bytes",
    "p99_meter_boundary_time_ms",
    "p99_block_index_bytes",
    "measurement_session_count",
    "p99_files_per_measurement_session",
    "fixed_artifact_files",
    "fixed_artifact_bytes",
    "meter_sample_rate_hz",
    "meter_bytes_per_sample",
    "setup_time_ms",
  ], "pilot_projection");
  return {
    projection_basis_sha256: requireSha256(
      pilot.projection_basis_sha256,
      "pilot_projection.projection_basis_sha256",
    ),
    p99_work_unit_time_ms: requireFinite(
      pilot.p99_work_unit_time_ms,
      "pilot_projection.p99_work_unit_time_ms",
      { exclusiveMinimum: true },
    ),
    p99_work_unit_bytes: requireSafeInteger(
      pilot.p99_work_unit_bytes,
      "pilot_projection.p99_work_unit_bytes",
      { minimum: 1 },
    ),
    p99_meter_boundary_time_ms: requireFinite(
      pilot.p99_meter_boundary_time_ms,
      "pilot_projection.p99_meter_boundary_time_ms",
      { exclusiveMinimum: true },
    ),
    p99_block_index_bytes: requireSafeInteger(
      pilot.p99_block_index_bytes,
      "pilot_projection.p99_block_index_bytes",
      { minimum: 1 },
    ),
    measurement_session_count: requireSafeInteger(
      pilot.measurement_session_count,
      "pilot_projection.measurement_session_count",
      { minimum: 1 },
    ),
    p99_files_per_measurement_session: requireSafeInteger(
      pilot.p99_files_per_measurement_session,
      "pilot_projection.p99_files_per_measurement_session",
      { minimum: 1 },
    ),
    fixed_artifact_files: requireSafeInteger(pilot.fixed_artifact_files, "pilot_projection.fixed_artifact_files"),
    fixed_artifact_bytes: requireSafeInteger(pilot.fixed_artifact_bytes, "pilot_projection.fixed_artifact_bytes"),
    meter_sample_rate_hz: requireFinite(
      pilot.meter_sample_rate_hz,
      "pilot_projection.meter_sample_rate_hz",
      { exclusiveMinimum: true },
    ),
    meter_bytes_per_sample: requireSafeInteger(
      pilot.meter_bytes_per_sample,
      "pilot_projection.meter_bytes_per_sample",
      { minimum: 1 },
    ),
    setup_time_ms: requireFinite(pilot.setup_time_ms, "pilot_projection.setup_time_ms"),
  };
}

function validateResourceCaps(resources) {
  requireExactKeys(resources, [
    "max_records",
    "max_measurement_blocks",
    "max_raw_bytes",
    "max_meter_log_bytes",
    "max_files",
    "max_wall_time_s",
    "minimum_free_disk_reserve_bytes",
    "available_free_disk_bytes",
  ], "resource_caps");
  const integerKeys = [
    "max_records",
    "max_measurement_blocks",
    "max_raw_bytes",
    "max_meter_log_bytes",
    "max_files",
    "minimum_free_disk_reserve_bytes",
    "available_free_disk_bytes",
  ];
  const result = Object.fromEntries(integerKeys.map((key) => [
    key,
    requireSafeInteger(resources[key], `resource_caps.${key}`, { minimum: key.startsWith("max_") ? 1 : 0 }),
  ]));
  result.max_wall_time_s = requireFinite(resources.max_wall_time_s, "resource_caps.max_wall_time_s", {
    exclusiveMinimum: true,
  });
  return result;
}

function enforceResourceCaps(projected, caps) {
  const comparisons = [
    ["records", projected.records, caps.max_records],
    ["measurement_blocks", projected.measurement_blocks, caps.max_measurement_blocks],
    ["raw_bytes", projected.raw_bytes, caps.max_raw_bytes],
    ["meter_log_bytes", projected.meter_log_bytes, caps.max_meter_log_bytes],
    ["files", projected.files, caps.max_files],
    ["wall_time_s", projected.wall_time_s, caps.max_wall_time_s],
  ];
  for (const [name, actual, maximum] of comparisons) {
    if (actual > maximum) {
      refuse("RESOURCE_CAP_EXCEEDED", `Projected ${name} ${actual} exceeds configured cap ${maximum}`);
    }
  }
  const requiredFreeDisk = safeSum([
    safeProduct([2, projected.total_bytes], "double projected bytes"),
    caps.minimum_free_disk_reserve_bytes,
  ], "required free disk");
  if (caps.available_free_disk_bytes < requiredFreeDisk) {
    refuse(
      "INSUFFICIENT_FREE_DISK",
      `Available free disk ${caps.available_free_disk_bytes} is below required ${requiredFreeDisk}`,
    );
  }
  return requiredFreeDisk;
}

/**
 * Validate a claim-ineligible confirmation plan without generating, accepting,
 * or revealing any seed material. The returned document is deterministic.
 */
export function evaluateConfirmationPreflight(input) {
  requireExactKeys(input, [
    "statistical_plan",
    "design",
    "pilot_projection",
    "resource_caps",
    "meter_block",
    "identities",
  ], "confirmation preflight input");
  const statisticalPlan = validateStatisticalPlan(input.statistical_plan);
  const design = validateDesign(input.design);
  const pilot = validatePilotProjection(input.pilot_projection);
  const caps = validateResourceCaps(input.resource_caps);
  const meterBlock = validateMeterBlock(input.meter_block);
  const identities = validateIdentitySet(input.identities);
  const samplesPossibleAtMinimumDuration = meterBlock.minimum_block_duration_ms
    * pilot.meter_sample_rate_hz / 1_000;
  if (samplesPossibleAtMinimumDuration < meterBlock.minimum_actual_samples) {
    refuse(
      "METER_SAMPLE_COUNT_UNREACHABLE",
      "Minimum block duration and meter sample rate cannot provide the required actual sample count",
    );
  }

  const records = safeProduct([
    design.scenario_count,
    design.arm_count,
    statisticalPlan.planned_seed_count,
    design.opportunities_per_seed_scenario,
  ], "projected records");
  const measurementBlocks = safeProduct([
    design.scenario_count,
    design.arm_count,
    statisticalPlan.planned_seed_count,
    design.blocks_per_seed_scenario,
  ], "projected measurement blocks");
  const rawBytes = safeSum([
    safeProduct([records, pilot.p99_work_unit_bytes], "projected work-unit bytes"),
    safeProduct([measurementBlocks, pilot.p99_block_index_bytes], "projected block-index bytes"),
    pilot.fixed_artifact_bytes,
  ], "projected raw bytes");
  const wallTimeMs = records * pilot.p99_work_unit_time_ms
    + measurementBlocks * pilot.p99_meter_boundary_time_ms
    + pilot.setup_time_ms;
  if (!Number.isFinite(wallTimeMs)) refuse("PROJECTION_OVERFLOW", "Projected wall time is not representable");
  const wallTimeSeconds = wallTimeMs / 1_000;
  const meterLogBytes = Math.ceil(
    pilot.meter_sample_rate_hz * wallTimeSeconds * pilot.meter_bytes_per_sample,
  );
  if (!Number.isSafeInteger(meterLogBytes)) {
    refuse("PROJECTION_OVERFLOW", "Projected meter log bytes exceed safe integer precision");
  }
  const files = safeSum([
    pilot.fixed_artifact_files,
    safeProduct([
      pilot.measurement_session_count,
      pilot.p99_files_per_measurement_session,
    ], "projected measurement-session files"),
  ], "projected files");
  const totalBytes = safeSum([rawBytes, meterLogBytes], "projected total bytes");
  const projected = {
    records,
    measurement_blocks: measurementBlocks,
    raw_bytes: rawBytes,
    meter_log_bytes: meterLogBytes,
    total_bytes: totalBytes,
    files,
    wall_time_s: wallTimeSeconds,
  };
  const requiredFreeDisk = enforceResourceCaps(projected, caps);

  const body = {
    kind: CONFIRMATION_PREFLIGHT_VERSION,
    status: "passed",
    claim_eligible: false,
    authority: "planning-and-resource-refusal-only",
    seeds_generated: false,
    seeds_revealed: false,
    statistical_plan: statisticalPlan,
    design,
    pilot_projection: pilot,
    resource_caps: caps,
    meter_block: meterBlock,
    identities,
    projected_resources: {
      ...projected,
      required_free_disk_bytes: requiredFreeDisk,
    },
  };
  return deepFreeze({
    ...body,
    preflight_sha256: canonicalSha256(body),
  });
}
