import { createHash } from "node:crypto";
import { lstat, open, readFile, realpath } from "node:fs/promises";
import path from "node:path";
import {
  evaluateExternalEnergyReading,
  hashProvenanceReviewRecord,
} from "./energy-provider.mjs";

export const ENERGY_BLOCK_SCHEDULE_VERSION = "candidate-010.energy-block-schedule.v1";
export const ENERGY_BLOCK_ACQUISITION_VERSION = "candidate-010.energy-block-acquisition.v1";

export class EnergyAcquisitionError extends Error {
  constructor(code, message) {
    super(`${code}: ${message}`);
    this.name = "EnergyAcquisitionError";
    this.code = code;
  }
}

function fail(code, message) {
  throw new EnergyAcquisitionError(code, message);
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

function exactObject(value, keys, label) {
  if (!value || typeof value !== "object" || Array.isArray(value)) fail("INVALID_SHAPE", `${label} must be an object`);
  if (canonical(Object.keys(value).sort()) !== canonical([...keys].sort())) {
    fail("INVALID_SHAPE", `${label} has an inexact field set`);
  }
  return value;
}

function nonEmpty(value, label) {
  if (typeof value !== "string" || value.trim().length === 0) fail("MISSING_IDENTITY", `${label} must be non-empty`);
  return value;
}

function positiveInteger(value, label) {
  if (!Number.isSafeInteger(value) || value < 1) fail("INVALID_COUNT", `${label} must be a positive safe integer`);
  return value;
}

function finitePositive(value, label) {
  if (!Number.isFinite(value) || value <= 0) fail("INVALID_CAPABILITY", `${label} must be finite and greater than zero`);
  return value;
}

function digestBody(document, digestField) {
  const body = { ...document };
  delete body[digestField];
  return sha256(canonical(body));
}

function rotated(values, offset) {
  return [...values.slice(offset), ...values.slice(0, offset)];
}

function rotationFor(clusterId, repetition, armCount) {
  const digest = sha256(`${clusterId}\0${repetition}`);
  return Number.parseInt(digest.slice(0, 8), 16) % armCount;
}

function blockId(clusterId, phase, repetition, sequence, arm = "none") {
  return `energy-${sha256(`${clusterId}\0${phase}\0${repetition}\0${sequence}\0${arm}`).slice(0, 24)}`;
}

/**
 * Freeze an externally measurable schedule. It deliberately measures blocks,
 * not millisecond work-unit intervals. No result from this v1 schedule is
 * claim-eligible until a separate aggregate confirmatory estimand is frozen.
 */
export function buildCounterbalancedEnergyBlockSchedule({
  run_id,
  scenarios,
  seeds,
  arms,
  ordered_input_manifests,
  opportunities_per_block,
  opportunity_repetitions = 1,
  measurement_repetitions = 2,
  warmup_opportunities,
  meter_capability,
}) {
  nonEmpty(run_id, "run_id");
  if (!Array.isArray(scenarios) || scenarios.length === 0) fail("INVALID_SCHEDULE", "scenarios must be non-empty");
  if (!Array.isArray(seeds) || seeds.length === 0) fail("INVALID_SCHEDULE", "seeds must be non-empty");
  if (!Array.isArray(arms) || arms.length < 2) fail("INVALID_SCHEDULE", "at least two arms are required");
  const scenarioIds = new Set();
  for (const scenario of scenarios) {
    exactObject(scenario, ["scenario_id", "task_family", "backend_id"], "scenario");
    nonEmpty(scenario.scenario_id, "scenario.scenario_id");
    nonEmpty(scenario.task_family, "scenario.task_family");
    nonEmpty(scenario.backend_id, "scenario.backend_id");
    if (scenarioIds.has(scenario.scenario_id)) fail("DUPLICATE_IDENTITY", `duplicate scenario ${scenario.scenario_id}`);
    scenarioIds.add(scenario.scenario_id);
  }
  if (new Set(seeds.map(String)).size !== seeds.length) fail("DUPLICATE_IDENTITY", "seeds must be unique");
  for (const seed of seeds) {
    if (!Number.isSafeInteger(seed) || seed < 0) fail("INVALID_SCHEDULE", "seeds must be non-negative safe integers");
  }
  for (const arm of arms) nonEmpty(arm, "arm");
  if (new Set(arms).size !== arms.length) fail("DUPLICATE_IDENTITY", "arms must be unique");
  positiveInteger(opportunities_per_block, "opportunities_per_block");
  positiveInteger(opportunity_repetitions, "opportunity_repetitions");
  positiveInteger(measurement_repetitions, "measurement_repetitions");
  positiveInteger(warmup_opportunities, "warmup_opportunities");
  if (!Array.isArray(ordered_input_manifests)) {
    fail("INVALID_INPUT_MANIFEST", "ordered_input_manifests must be an array");
  }
  const inputManifests = new Map();
  for (const [index, manifest] of ordered_input_manifests.entries()) {
    exactObject(
      manifest,
      ["input_manifest_id", "scenario_id", "seed", "ordered_opportunity_ids"],
      `ordered_input_manifests[${index}]`,
    );
    nonEmpty(manifest.input_manifest_id, `ordered_input_manifests[${index}].input_manifest_id`);
    nonEmpty(manifest.scenario_id, `ordered_input_manifests[${index}].scenario_id`);
    if (!Number.isSafeInteger(manifest.seed) || manifest.seed < 0) {
      fail("INVALID_INPUT_MANIFEST", `ordered_input_manifests[${index}].seed is invalid`);
    }
    if (
      !Array.isArray(manifest.ordered_opportunity_ids)
      || manifest.ordered_opportunity_ids.length !== opportunities_per_block
    ) {
      fail("INPUT_COUNT_MISMATCH", `ordered_input_manifests[${index}] must contain exactly ${opportunities_per_block} opportunities`);
    }
    for (const opportunityId of manifest.ordered_opportunity_ids) {
      nonEmpty(opportunityId, `ordered_input_manifests[${index}].ordered_opportunity_ids`);
    }
    if (new Set(manifest.ordered_opportunity_ids).size !== manifest.ordered_opportunity_ids.length) {
      fail("DUPLICATE_INPUT", `ordered_input_manifests[${index}] contains duplicate opportunities`);
    }
    const key = `${manifest.scenario_id}\0${manifest.seed}`;
    if (inputManifests.has(key)) fail("DUPLICATE_INPUT_MANIFEST", `duplicate ordered input manifest ${key}`);
    const normalized = {
      input_manifest_id: manifest.input_manifest_id,
      scenario_id: manifest.scenario_id,
      seed: manifest.seed,
      ordered_opportunity_ids: [...manifest.ordered_opportunity_ids],
    };
    inputManifests.set(key, {
      ...normalized,
      input_manifest_sha256: sha256(canonical(normalized)),
    });
  }
  const requiredManifestKeys = scenarios.flatMap((scenario) => seeds.map((seed) => `${scenario.scenario_id}\0${seed}`));
  if (
    inputManifests.size !== requiredManifestKeys.length
    || requiredManifestKeys.some((key) => !inputManifests.has(key))
  ) {
    fail("INCOMPLETE_INPUT_MANIFEST", "every scenario-seed batch requires exactly one ordered input manifest and no extras");
  }
  exactObject(meter_capability, [
    "sample_interval_s",
    "energy_resolution_j",
    "minimum_block_duration_s",
    "minimum_energy_delta_j",
    "minimum_samples_per_block",
    "minimum_resolution_quanta",
    "maximum_clock_uncertainty_s",
    "minimum_signal_to_expanded_uncertainty",
  ], "meter_capability");
  const sampleInterval = finitePositive(meter_capability.sample_interval_s, "meter_capability.sample_interval_s");
  const energyResolution = finitePositive(meter_capability.energy_resolution_j, "meter_capability.energy_resolution_j");
  const minimumDuration = finitePositive(meter_capability.minimum_block_duration_s, "meter_capability.minimum_block_duration_s");
  const minimumDelta = finitePositive(meter_capability.minimum_energy_delta_j, "meter_capability.minimum_energy_delta_j");
  const minimumSamples = positiveInteger(meter_capability.minimum_samples_per_block, "meter_capability.minimum_samples_per_block");
  const minimumQuanta = finitePositive(meter_capability.minimum_resolution_quanta, "meter_capability.minimum_resolution_quanta");
  finitePositive(meter_capability.maximum_clock_uncertainty_s, "meter_capability.maximum_clock_uncertainty_s");
  finitePositive(
    meter_capability.minimum_signal_to_expanded_uncertainty,
    "meter_capability.minimum_signal_to_expanded_uncertainty",
  );
  if (Math.floor(minimumDuration / sampleInterval) + 1 < minimumSamples) {
    fail("UNRESOLVABLE_INTERVAL", "minimum block duration does not satisfy the frozen minimum sample count");
  }
  if (minimumDelta < energyResolution * minimumQuanta) {
    fail("UNRESOLVABLE_INTERVAL", "minimum energy delta does not satisfy the frozen resolution-quanta floor");
  }

  const blocks = [];
  let globalSequence = 0;
  for (const scenario of [...scenarios].sort((left, right) => left.scenario_id.localeCompare(right.scenario_id))) {
    for (const seed of [...seeds].sort((left, right) => left - right)) {
      const clusterId = `${scenario.scenario_id}:${seed}`;
      const inputManifest = inputManifests.get(`${scenario.scenario_id}\0${seed}`);
      for (const [index, arm] of arms.entries()) {
        blocks.push({
          block_id: blockId(clusterId, "warmup", 0, index, arm),
          sequence: globalSequence,
          phase: "warmup",
          observed: false,
          analysis_role: "excluded-warmup",
          cluster_id: clusterId,
          ...scenario,
          seed,
          arm,
          repetition: 0,
          opportunities: warmup_opportunities,
          opportunity_repetitions: 1,
        });
        globalSequence += 1;
      }
      for (let repetition = 0; repetition < measurement_repetitions; repetition += 1) {
        const rotatedOrder = rotated(arms, rotationFor(clusterId, repetition, arms.length));
        const order = repetition % 2 === 0 ? rotatedOrder : [...rotatedOrder].reverse();
        const pairedInputSha256 = sha256(canonical({
          input_manifest_sha256: inputManifest.input_manifest_sha256,
          ordered_opportunity_ids: inputManifest.ordered_opportunity_ids,
          opportunity_repetitions,
        }));
        const blockPairId = `energy-pair-${sha256(`${pairedInputSha256}\0${repetition}`).slice(0, 24)}`;
        for (const boundary of ["before", "after"]) {
          if (boundary === "after") {
            for (const [index, arm] of order.entries()) {
              blocks.push({
                block_id: blockId(clusterId, "measure", repetition, index, arm),
                sequence: globalSequence,
                phase: "measure",
                observed: true,
                analysis_role: "gross-arm-energy-no-idle-subtraction",
                block_pair_id: blockPairId,
                paired_input_sha256: pairedInputSha256,
                input_manifest_id: inputManifest.input_manifest_id,
                input_manifest_sha256: inputManifest.input_manifest_sha256,
                cluster_id: clusterId,
                ...scenario,
                seed,
                arm,
                repetition,
                opportunities: opportunities_per_block,
                opportunity_repetitions,
              });
              globalSequence += 1;
            }
          }
          blocks.push({
            block_id: blockId(clusterId, `idle-${boundary}`, repetition, globalSequence),
            sequence: globalSequence,
            phase: `idle-${boundary}`,
            observed: true,
            analysis_role: "background-observation-no-automatic-subtraction",
            block_pair_id: null,
            paired_input_sha256: null,
            input_manifest_id: null,
            input_manifest_sha256: null,
            cluster_id: clusterId,
            ...scenario,
            seed,
            arm: null,
            repetition,
            opportunities: 0,
            opportunity_repetitions: 0,
          });
          globalSequence += 1;
        }
      }
    }
  }
  const body = {
    schema: 1,
    contract_version: ENERGY_BLOCK_SCHEDULE_VERSION,
    run_id,
    purpose: "external-meter-block-acquisition",
    claim_eligibility: "ineligible-until-aggregate-confirmatory-contract",
    analysis_contract_status: "not-implemented",
    meter_capability: { ...meter_capability },
    fixed_work: {
      opportunities_per_block,
      opportunity_repetitions,
      measurement_repetitions,
      warmup_opportunities,
    },
    ordered_input_manifests: [...inputManifests.values()].sort((left, right) => (
      left.scenario_id.localeCompare(right.scenario_id) || left.seed - right.seed
    )),
    counterbalancing: "deterministic hash rotation with alternating reversal within scenario-seed cluster",
    idle_policy: "measure before/after background separately; never subtract automatically",
    stop_policy: "fixed opportunity count and repetitions; meter observations do not adapt stopping",
    aggregation_requirement: "compute gross joules per correct commit per arm block; aggregate blocks and scenarios within seed before confirmatory inference",
    blocks,
  };
  return Object.freeze({ ...body, schedule_sha256: digestBody(body, "schedule_sha256") });
}

export function hashEnergyAcquisitionObservation(observation) {
  return sha256(canonical(observation));
}

function validateReview(review, observation, recordKind) {
  exactObject(review, [
    "schema", "review_id", "reviewer_id", "reviewed_at", "decision", "observation_sha256", "notes", "review_sha256",
  ], "review");
  if (review.schema !== 1) fail("INVALID_REVIEW", "review.schema must be 1");
  nonEmpty(review.review_id, "review.review_id");
  nonEmpty(review.reviewer_id, "review.reviewer_id");
  nonEmpty(review.notes, "review.notes");
  const reviewedAt = Date.parse(review.reviewed_at);
  if (
    !Number.isFinite(reviewedAt)
    || !review.reviewed_at.endsWith("Z")
    || new Date(reviewedAt).toISOString() !== review.reviewed_at
  ) {
    fail("INVALID_REVIEW", "review.reviewed_at must be an exact UTC instant");
  }
  if (reviewedAt < Date.parse(observation.interval_ended_at)) {
    fail("INVALID_REVIEW", "review cannot predate the completed meter interval");
  }
  const requiredDecision = recordKind === "hardware-observation" ? "approved" : "rehearsal-only";
  if (review.decision !== requiredDecision) fail("INVALID_REVIEW", `review.decision must be ${requiredDecision}`);
  if (review.observation_sha256 !== hashEnergyAcquisitionObservation(observation)) {
    fail("INVALID_REVIEW", "review does not bind the normalized observation");
  }
  if (review.review_sha256 !== hashProvenanceReviewRecord(review)) {
    fail("INVALID_REVIEW", "review self-digest is invalid");
  }
  return review;
}

function assertSchedule(schedule) {
  if (
    schedule?.schema !== 1
    || schedule.contract_version !== ENERGY_BLOCK_SCHEDULE_VERSION
    || schedule.schedule_sha256 !== digestBody(schedule, "schedule_sha256")
    || schedule.analysis_contract_status !== "not-implemented"
    || !Array.isArray(schedule.blocks)
    || schedule.blocks.length === 0
  ) fail("INVALID_SCHEDULE", "energy block schedule digest or shape is invalid");
  if (!Array.isArray(schedule.ordered_input_manifests) || schedule.ordered_input_manifests.length === 0) {
    fail("INVALID_INPUT_MANIFEST", "schedule omits ordered input manifests");
  }
  const manifests = new Map();
  for (const manifest of schedule.ordered_input_manifests) {
    const unsigned = {
      input_manifest_id: manifest.input_manifest_id,
      scenario_id: manifest.scenario_id,
      seed: manifest.seed,
      ordered_opportunity_ids: manifest.ordered_opportunity_ids,
    };
    if (
      !Array.isArray(manifest.ordered_opportunity_ids)
      || manifest.ordered_opportunity_ids.length !== schedule.fixed_work?.opportunities_per_block
      || manifest.input_manifest_sha256 !== sha256(canonical(unsigned))
    ) fail("INVALID_INPUT_MANIFEST", "schedule ordered input manifest is invalid");
    const key = `${manifest.scenario_id}\0${manifest.seed}`;
    if (manifests.has(key)) fail("DUPLICATE_INPUT_MANIFEST", `duplicate schedule input manifest ${key}`);
    manifests.set(key, manifest);
  }
  for (const block of schedule.blocks.filter((row) => row.phase === "measure")) {
    const manifest = manifests.get(`${block.scenario_id}\0${block.seed}`);
    if (!manifest || block.input_manifest_id !== manifest.input_manifest_id) {
      fail("INPUT_OWNERSHIP_MISMATCH", `measurement block ${block.block_id} has no exact input-manifest ownership`);
    }
    const pairedInputSha256 = sha256(canonical({
      input_manifest_sha256: manifest.input_manifest_sha256,
      ordered_opportunity_ids: manifest.ordered_opportunity_ids,
      opportunity_repetitions: block.opportunity_repetitions,
    }));
    const expectedPairId = `energy-pair-${sha256(`${pairedInputSha256}\0${block.repetition}`).slice(0, 24)}`;
    if (
      block.input_manifest_sha256 !== manifest.input_manifest_sha256
      || block.paired_input_sha256 !== pairedInputSha256
      || block.block_pair_id !== expectedPairId
    ) fail("INPUT_OWNERSHIP_MISMATCH", `measurement block ${block.block_id} differs from its ordered input manifest`);
  }
  return schedule;
}

function assemble(schedule, rows) {
  assertSchedule(schedule);
  const required = schedule.blocks.filter((block) => block.observed);
  if (!Array.isArray(rows) || rows.length !== required.length) {
    fail("INCOMPLETE_IMPORT", `expected exactly ${required.length} observed block imports`);
  }
  const blocks = new Map(required.map((block) => [block.block_id, block]));
  const seenBlocks = new Set();
  const seenReadings = new Set();
  const seenReviews = new Set();
  const meterIntervals = new Map();
  const observations = [];
  for (const row of rows) {
    const block = blocks.get(row.block_id);
    if (!block || seenBlocks.has(row.block_id)) fail("DUPLICATE_OR_UNKNOWN_BLOCK", `invalid block import ${row.block_id}`);
    seenBlocks.add(row.block_id);
    const evaluated = evaluateExternalEnergyReading(row.raw_reading).measured;
    if (seenReadings.has(evaluated.reading_id)) fail("DUPLICATE_READING", `duplicate reading ${evaluated.reading_id}`);
    seenReadings.add(evaluated.reading_id);
    if (evaluated.duration_s < schedule.meter_capability.minimum_block_duration_s) {
      fail("UNRESOLVABLE_INTERVAL", `block ${block.block_id} is shorter than the frozen meter interval floor`);
    }
    if (evaluated.value_j < schedule.meter_capability.minimum_energy_delta_j) {
      fail("UNRESOLVABLE_INTERVAL", `block ${block.block_id} is below the frozen meter energy-resolution floor`);
    }
    const representedSamples = Math.floor(
      evaluated.duration_s / schedule.meter_capability.sample_interval_s,
    ) + 1;
    if (representedSamples < schedule.meter_capability.minimum_samples_per_block) {
      fail("UNRESOLVABLE_INTERVAL", `block ${block.block_id} has too few meter sample periods`);
    }
    if (
      evaluated.integration === "trapezoidal-power"
      && evaluated.sample_count < schedule.meter_capability.minimum_samples_per_block
    ) {
      fail("UNRESOLVABLE_INTERVAL", `block ${block.block_id} has too few recorded power samples`);
    }
    if (evaluated.clock_uncertainty_s > schedule.meter_capability.maximum_clock_uncertainty_s) {
      fail("UNRESOLVABLE_INTERVAL", `block ${block.block_id} exceeds the frozen clock-uncertainty ceiling`);
    }
    const signalToUncertainty = evaluated.calibration_expanded_uncertainty_j > 0
      ? evaluated.value_j / evaluated.calibration_expanded_uncertainty_j
      : Number.POSITIVE_INFINITY;
    if (signalToUncertainty < schedule.meter_capability.minimum_signal_to_expanded_uncertainty) {
      fail("UNRESOLVABLE_INTERVAL", `block ${block.block_id} is not separated from expanded calibration uncertainty`);
    }
    validateReview(row.review, evaluated, evaluated.record_kind);
    if (seenReviews.has(row.review.review_id)) fail("DUPLICATE_REVIEW", `duplicate review ${row.review.review_id}`);
    seenReviews.add(row.review.review_id);
    const meter = `${evaluated.provider_id}\0${evaluated.meter_id}`;
    const interval = {
      start: Date.parse(evaluated.interval_started_at),
      end: Date.parse(evaluated.interval_ended_at),
      block_id: block.block_id,
      sequence: block.sequence,
    };
    const intervals = meterIntervals.get(meter) ?? [];
    if (intervals.some((other) => interval.start < other.end && other.start < interval.end)) {
      fail("OVERLAPPING_READING", `meter interval overlaps another assigned block: ${block.block_id}`);
    }
    intervals.push(interval);
    meterIntervals.set(meter, intervals);
    observations.push({
      block,
      raw_source: row.raw_source,
      review_source: row.review_source,
      raw_reading: row.raw_reading,
      review: row.review,
      observation: {
        ...evaluated,
        allocation: "energy-measurement-block",
        block_ownership: {
          schedule_sha256: schedule.schedule_sha256,
          block_id: block.block_id,
          block_pair_id: block.block_pair_id,
          paired_input_sha256: block.paired_input_sha256,
          input_manifest_id: block.input_manifest_id,
          input_manifest_sha256: block.input_manifest_sha256,
          cluster_id: block.cluster_id,
          scenario_id: block.scenario_id,
          task_family: block.task_family,
          backend_id: block.backend_id,
          seed: block.seed,
          arm: block.arm,
          repetition: block.repetition,
          phase: block.phase,
        },
        claim_eligibility: evaluated.record_kind === "test-fixture"
          ? "fixture-rehearsal-ineligible"
          : "hardware-block-pending-aggregate-analysis-contract",
      },
    });
  }
  for (const intervals of meterIntervals.values()) {
    const bySequence = [...intervals].sort((left, right) => left.sequence - right.sequence);
    const byTime = [...intervals].sort((left, right) => left.start - right.start || left.end - right.end);
    if (canonical(bySequence.map((row) => row.block_id)) !== canonical(byTime.map((row) => row.block_id))) {
      fail("ORDER_MISMATCH", "meter intervals do not follow the frozen block order");
    }
  }
  observations.sort((left, right) => left.block.sequence - right.block.sequence);
  const body = {
    schema: 1,
    contract_version: ENERGY_BLOCK_ACQUISITION_VERSION,
    schedule_sha256: schedule.schedule_sha256,
    run_id: schedule.run_id,
    claim_eligible: false,
    claim_eligibility: "ineligible-until-aggregate-confirmatory-contract",
    analysis_contract_status: "not-implemented",
    observations,
  };
  return { ...body, acquisition_sha256: digestBody(body, "acquisition_sha256") };
}

function samePath(left, right) {
  const normalize = (value) => process.platform === "win32" ? path.resolve(value).toLowerCase() : path.resolve(value);
  return normalize(left) === normalize(right);
}

async function regularSource(file, label) {
  const absolute = path.resolve(file);
  const information = await lstat(absolute);
  if (!information.isFile() || information.isSymbolicLink()) fail("INVALID_SOURCE_FILE", `${label} must be a regular unlinked file`);
  const resolved = await realpath(absolute);
  if (!samePath(absolute, resolved)) fail("INVALID_SOURCE_FILE", `${label} traverses a link or reparse point`);
  const contents = await readFile(absolute);
  return { absolute, contents, bytes: contents.length, sha256: sha256(contents) };
}

async function strictOutput(file) {
  const absolute = path.resolve(file);
  const parent = path.dirname(absolute);
  const information = await lstat(parent);
  if (!information.isDirectory() || information.isSymbolicLink()) fail("INVALID_OUTPUT", "output parent must be a regular directory");
  const resolvedParent = await realpath(parent);
  if (!samePath(parent, resolvedParent) || path.dirname(absolute) !== parent) {
    fail("INVALID_OUTPUT", "output path traverses a link or is not a direct file in its parent");
  }
  return absolute;
}

async function persistExactDocument({ document, outputPath, mismatchCode, label }) {
  const output = await strictOutput(outputPath);
  const bytes = Buffer.from(`${JSON.stringify(document, null, 2)}\n`);
  try {
    const handle = await open(output, "wx", 0o600);
    try {
      await handle.writeFile(bytes);
      await handle.sync();
    } finally {
      await handle.close();
    }
    return Object.freeze({ output_path: output, resumed: false, bytes: bytes.length, sha256: sha256(bytes) });
  } catch (error) {
    if (error.code !== "EEXIST") throw error;
    const existing = await readFile(output);
    if (!existing.equals(bytes)) fail(mismatchCode, `existing ${label} differs from the exact recomputed document`);
    return Object.freeze({ output_path: output, resumed: true, bytes: bytes.length, sha256: sha256(bytes) });
  }
}

/** Freeze the schedule with create-only semantics; exact retries are resumable. */
export async function persistEnergyBlockSchedule({ schedule, outputPath }) {
  assertSchedule(schedule);
  const persisted = await persistExactDocument({
    document: schedule,
    outputPath,
    mismatchCode: "SCHEDULE_RESUME_MISMATCH",
    label: "energy block schedule",
  });
  return Object.freeze({ schedule, ...persisted });
}

/** Import untouched JSON records and atomically create one immutable bundle. */
export async function importEnergyBlockFiles({ schedule, imports, outputPath }) {
  assertSchedule(schedule);
  if (!Array.isArray(imports)) fail("INVALID_IMPORT", "imports must be an array");
  const seenRealPaths = new Set();
  const rows = [];
  for (const [index, entry] of imports.entries()) {
    exactObject(entry, ["block_id", "raw_reading_path", "provenance_review_path"], `imports[${index}]`);
    const raw = await regularSource(entry.raw_reading_path, `imports[${index}].raw_reading_path`);
    const review = await regularSource(entry.provenance_review_path, `imports[${index}].provenance_review_path`);
    for (const source of [raw, review]) {
      const realKey = process.platform === "win32" ? source.absolute.toLowerCase() : source.absolute;
      if (seenRealPaths.has(realKey)) fail("DUPLICATE_SOURCE_FILE", "one source file cannot satisfy multiple import roles");
      seenRealPaths.add(realKey);
    }
    let rawReading;
    let provenanceReview;
    try {
      rawReading = JSON.parse(raw.contents.toString("utf8"));
      provenanceReview = JSON.parse(review.contents.toString("utf8"));
    } catch (error) {
      fail("INVALID_JSON", `import ${index + 1} is not valid JSON: ${error.message}`);
    }
    rows.push({
      block_id: entry.block_id,
      raw_reading: rawReading,
      review: provenanceReview,
      raw_source: { file_name: path.basename(raw.absolute), bytes: raw.bytes, sha256: raw.sha256 },
      review_source: { file_name: path.basename(review.absolute), bytes: review.bytes, sha256: review.sha256 },
    });
  }
  const bundle = assemble(schedule, rows);
  const persisted = await persistExactDocument({
    document: bundle,
    outputPath,
    mismatchCode: "RESUME_MISMATCH",
    label: "energy block acquisition",
  });
  return Object.freeze({ bundle, ...persisted });
}
