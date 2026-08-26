import { createHash } from "node:crypto";

import {
  FIXTURE_026_HISTORY_FAMILIES,
  FIXTURE_026_MALFORMED_SENTINELS,
  FIXTURE_026_VALID_FAMILIES,
  parseFixture026PublicSeed,
  publicSeedHex,
} from "./generator.mjs";

export const FIXTURE_026_SCIENTIFIC_GRID_VERSION = "fixture-026.rsd-t01-scientific-grid.v1";

export const FIXTURE_026_SCIENTIFIC_GRID_TOLERANCES = deepFreeze({
  exact_discrepancy_tolerance: 1e-12,
  approximate_discrepancy_ceiling: 0.06,
  discrepancy_unit: "1",
});

export const FIXTURE_026_SCALE_CELLS = deepFreeze([
  {
    scale_cell_id: "S-02X-DEV",
    scale_factor: 2,
    observation_role: "observed-development",
    partition: "public-development",
    information_cut_status: "not-applicable",
  },
  {
    scale_cell_id: "S-04X-DEV",
    scale_factor: 4,
    observation_role: "observed-development",
    partition: "public-development",
    information_cut_status: "not-applicable",
  },
  {
    scale_cell_id: "S-08X-PROSPECTIVE",
    scale_factor: 8,
    observation_role: "withheld-prospective",
    partition: "public-development",
    information_cut_status: "unregistered-candidate",
  },
]);

export const FIXTURE_026_SCIENTIFIC_HOSTILE_CASES = deepFreeze([
  {
    hostile_case_id: "additive-offset",
    case_class: "valid-scientific-hostile",
    input_domain_support: "inside",
    transformation_support: "outside",
    instrument_support: "inside",
    initialization_support: "inside",
    causal_observation_support: "inside",
    evaluation_window_support: "inside",
    leakage_expectation: "must-not-trigger",
  },
  {
    hostile_case_id: "near-zero",
    case_class: "valid-scientific-hostile",
    input_domain_support: "outside",
    transformation_support: "inside",
    instrument_support: "outside",
    initialization_support: "inside",
    causal_observation_support: "inside",
    evaluation_window_support: "inside",
    leakage_expectation: "must-not-trigger",
  },
  {
    hostile_case_id: "clipping",
    case_class: "valid-scientific-hostile",
    input_domain_support: "inside",
    transformation_support: "inside",
    instrument_support: "outside",
    initialization_support: "inside",
    causal_observation_support: "inside",
    evaluation_window_support: "inside",
    leakage_expectation: "must-not-trigger",
  },
  {
    hostile_case_id: "hidden-reset",
    case_class: "valid-scientific-hostile",
    input_domain_support: "inside",
    transformation_support: "inside",
    instrument_support: "inside",
    initialization_support: "outside",
    causal_observation_support: "outside",
    evaluation_window_support: "inside",
    leakage_expectation: "must-not-trigger",
  },
  {
    hostile_case_id: "slow-tail",
    case_class: "valid-scientific-hostile",
    input_domain_support: "inside",
    transformation_support: "inside",
    instrument_support: "inside",
    initialization_support: "inside",
    causal_observation_support: "inside",
    evaluation_window_support: "inside",
    leakage_expectation: "must-not-trigger",
  },
  {
    hostile_case_id: "future-normalization-leakage",
    case_class: "valid-scientific-hostile",
    input_domain_support: "inside",
    transformation_support: "inside",
    instrument_support: "inside",
    initialization_support: "inside",
    causal_observation_support: "outside",
    evaluation_window_support: "inside",
    leakage_expectation: "must-detect-and-reject",
  },
]);

export const FIXTURE_026_RSD_T01_ACTIONABLE_ARM_IDS = Object.freeze([
  "A-RAW",
  "B-STATIC-DIV",
  "B-STREAM",
  "B-LOG-RATIO",
  "B-DIFFERENCE",
  "B-STATE-SPACE",
  "B-RECURRENT",
  "C-DUAL",
]);

export const FIXTURE_026_RSD_T01_EVALUATOR_ONLY_ARM_ID = "O-STATISTIC";

export const FIXTURE_026_RSD_T01_ARM_REGISTRY = deepFreeze([
  ...FIXTURE_026_RSD_T01_ACTIONABLE_ARM_IDS.map((armId) => ({
    arm_id: armId,
    role: "actionable",
    current_parity_eligible: false,
    current_ranking_eligible: false,
    future_comparison_role: "participant-after-prerequisites",
    activation_requirement: "implemented-and-registered-information-cut",
  })),
  {
    arm_id: FIXTURE_026_RSD_T01_EVALUATOR_ONLY_ARM_ID,
    role: "evaluator-only",
    current_parity_eligible: false,
    current_ranking_eligible: false,
    future_comparison_role: "excluded",
    activation_requirement: "never-actionable",
  },
]);

export const FIXTURE_026_NOMINAL_GRID_CELL_COUNT = FIXTURE_026_VALID_FAMILIES.length
  * FIXTURE_026_HISTORY_FAMILIES.length
  * FIXTURE_026_SCALE_CELLS.length;

export const FIXTURE_026_SYSTEM_GRID_CELL_COUNT = FIXTURE_026_HISTORY_FAMILIES.length
  * FIXTURE_026_SCALE_CELLS.length;

export const FIXTURE_026_SCIENTIFIC_GRID_REGISTRY = deepFreeze({
  version: FIXTURE_026_SCIENTIFIC_GRID_VERSION,
  protocol: "RSD-T01",
  authority: "contract-foundation-only",
  partition: "public-development",
  information_cut_status: "unregistered",
  comparison_authority: false,
  result_authority: "NO_RESULT",
  generator_families: [...FIXTURE_026_VALID_FAMILIES],
  history_families: [...FIXTURE_026_HISTORY_FAMILIES],
  scale_cells: FIXTURE_026_SCALE_CELLS.map((cell) => ({ ...cell })),
  tolerances: { ...FIXTURE_026_SCIENTIFIC_GRID_TOLERANCES },
  hostile_cases: FIXTURE_026_SCIENTIFIC_HOSTILE_CASES.map((hostileCase) => ({ ...hostileCase })),
  malformed_sentinels: [...FIXTURE_026_MALFORMED_SENTINELS],
  arms: FIXTURE_026_RSD_T01_ARM_REGISTRY.map((arm) => ({ ...arm })),
});

function deepFreeze(value) {
  if (value && typeof value === "object" && !Object.isFrozen(value)) {
    Object.freeze(value);
    for (const nested of Object.values(value)) deepFreeze(nested);
  }
  return value;
}

function exactKeys(value, expectedKeys) {
  return value
    && typeof value === "object"
    && !Array.isArray(value)
    && Object.keys(value).length === expectedKeys.length
    && expectedKeys.every((key) => Object.hasOwn(value, key));
}

function sha256(preimage) {
  return createHash("sha256").update(preimage, "utf8").digest("hex");
}

function assertClosedRegistryRows(actual, expected, keys, label) {
  if (!Array.isArray(actual) || actual.length !== expected.length) {
    throw new Error(`Fixture 026 scientific-grid ${label} registry is not closed.`);
  }
  for (const [index, row] of actual.entries()) {
    if (!exactKeys(row, keys)) {
      throw new Error(`Fixture 026 scientific-grid ${label} row has unknown or missing fields.`);
    }
    for (const key of keys) {
      if (row[key] !== expected[index][key]) {
        throw new Error(`Fixture 026 scientific-grid ${label} registry differs from v1.`);
      }
    }
  }
}

export function assertFixture026ScientificGridRegistry(registry) {
  const topLevelKeys = [
    "version",
    "protocol",
    "authority",
    "partition",
    "information_cut_status",
    "comparison_authority",
    "result_authority",
    "generator_families",
    "history_families",
    "scale_cells",
    "tolerances",
    "hostile_cases",
    "malformed_sentinels",
    "arms",
  ];
  if (
    !exactKeys(registry, topLevelKeys)
    || registry.version !== FIXTURE_026_SCIENTIFIC_GRID_VERSION
    || registry.protocol !== "RSD-T01"
    || registry.authority !== "contract-foundation-only"
    || registry.partition !== "public-development"
    || registry.information_cut_status !== "unregistered"
    || registry.comparison_authority !== false
    || registry.result_authority !== "NO_RESULT"
  ) {
    throw new Error("Fixture 026 scientific-grid registry has unknown fields or the wrong version.");
  }
  if (
    !Array.isArray(registry.generator_families)
    || !Array.isArray(registry.history_families)
    || registry.generator_families.length !== FIXTURE_026_VALID_FAMILIES.length
    || registry.history_families.length !== FIXTURE_026_HISTORY_FAMILIES.length
    || registry.generator_families.some((family, index) => family !== FIXTURE_026_VALID_FAMILIES[index])
    || registry.history_families.some((family, index) => family !== FIXTURE_026_HISTORY_FAMILIES[index])
    || !Array.isArray(registry.malformed_sentinels)
    || registry.malformed_sentinels.length !== FIXTURE_026_MALFORMED_SENTINELS.length
    || registry.malformed_sentinels.some((sentinel, index) => (
      sentinel !== FIXTURE_026_MALFORMED_SENTINELS[index]
    ))
  ) throw new Error("Fixture 026 scientific-grid family or malformed-sentinel registry differs from v1.");
  assertClosedRegistryRows(
    registry.scale_cells,
    FIXTURE_026_SCALE_CELLS,
    [
      "scale_cell_id",
      "scale_factor",
      "observation_role",
      "partition",
      "information_cut_status",
    ],
    "scale-cell",
  );
  if (
    !exactKeys(registry.tolerances, [
      "exact_discrepancy_tolerance",
      "approximate_discrepancy_ceiling",
      "discrepancy_unit",
    ])
    || registry.tolerances.exact_discrepancy_tolerance
      !== FIXTURE_026_SCIENTIFIC_GRID_TOLERANCES.exact_discrepancy_tolerance
    || registry.tolerances.approximate_discrepancy_ceiling
      !== FIXTURE_026_SCIENTIFIC_GRID_TOLERANCES.approximate_discrepancy_ceiling
    || registry.tolerances.discrepancy_unit
      !== FIXTURE_026_SCIENTIFIC_GRID_TOLERANCES.discrepancy_unit
  ) throw new Error("Fixture 026 scientific-grid tolerance registry differs from v1.");
  assertClosedRegistryRows(
    registry.hostile_cases,
    FIXTURE_026_SCIENTIFIC_HOSTILE_CASES,
    [
      "hostile_case_id",
      "case_class",
      "input_domain_support",
      "transformation_support",
      "instrument_support",
      "initialization_support",
      "causal_observation_support",
      "evaluation_window_support",
      "leakage_expectation",
    ],
    "hostile-case",
  );
  assertClosedRegistryRows(
    registry.arms,
    FIXTURE_026_RSD_T01_ARM_REGISTRY,
    [
      "arm_id",
      "role",
      "current_parity_eligible",
      "current_ranking_eligible",
      "future_comparison_role",
      "activation_requirement",
    ],
    "arm",
  );
  return registry;
}

function assertSeedRequest(request) {
  if (!exactKeys(request, ["seed"])) {
    throw new Error("Fixture 026 scientific-grid request has unknown or missing fields.");
  }
  parseFixture026PublicSeed(request.seed);
  return request.seed;
}

export function buildFixture026ScientificGridDescriptors(request) {
  const seed = assertSeedRequest(request);
  const seedHex = publicSeedHex(seed);
  const descriptors = [];
  let ordinal = 0;
  for (const generatorFamily of FIXTURE_026_VALID_FAMILIES) {
    const initializationId = sha256(
      `${FIXTURE_026_SCIENTIFIC_GRID_VERSION}|${seedHex}|initialization|${generatorFamily}`,
    );
    for (const historyFamily of FIXTURE_026_HISTORY_FAMILIES) {
      for (const scaleCell of FIXTURE_026_SCALE_CELLS) {
        descriptors.push(deepFreeze({
          schema: 1,
          contract_version: FIXTURE_026_SCIENTIFIC_GRID_VERSION,
          ordinal,
          descriptor_id: sha256(
            `${FIXTURE_026_SCIENTIFIC_GRID_VERSION}|${seedHex}|nominal|${ordinal}`,
          ),
          initialization_id: initializationId,
          seed,
          generator_family: generatorFamily,
          history_family: historyFamily,
          scale_cell_id: scaleCell.scale_cell_id,
          scale_factor: scaleCell.scale_factor,
          observation_role: scaleCell.observation_role,
          partition: scaleCell.partition,
          information_cut_status: scaleCell.information_cut_status,
          scientific_case: "nominal",
          input_domain_support: "inside",
          transformation_support: "inside",
          instrument_support: "inside",
          initialization_support: "inside",
          causal_observation_support: "inside",
          evaluation_window_support: "inside",
          malformed_sentinel: false,
        }));
        ordinal += 1;
      }
    }
  }
  return Object.freeze(descriptors);
}

export function buildFixture026HostileCaseDescriptors(request) {
  const seed = assertSeedRequest(request);
  const seedHex = publicSeedHex(seed);
  return Object.freeze(FIXTURE_026_SCIENTIFIC_HOSTILE_CASES.map((hostileCase, ordinal) => (
    deepFreeze({
      schema: 1,
      contract_version: FIXTURE_026_SCIENTIFIC_GRID_VERSION,
      ordinal,
      descriptor_id: sha256(
        `${FIXTURE_026_SCIENTIFIC_GRID_VERSION}|${seedHex}|hostile|${ordinal}|${hostileCase.hostile_case_id}`,
      ),
      seed,
      hostile_case_id: hostileCase.hostile_case_id,
      case_class: hostileCase.case_class,
      input_domain_support: hostileCase.input_domain_support,
      transformation_support: hostileCase.transformation_support,
      instrument_support: hostileCase.instrument_support,
      initialization_support: hostileCase.initialization_support,
      causal_observation_support: hostileCase.causal_observation_support,
      evaluation_window_support: hostileCase.evaluation_window_support,
      leakage_expectation: hostileCase.leakage_expectation,
      malformed_sentinel: false,
    })
  )));
}

export function reduceFixture026BooleanMatrix(values) {
  if (!Array.isArray(values) || values.length === 0 || values.some((value) => typeof value !== "boolean")) {
    throw new Error("Fixture 026 Boolean matrix reducer requires a non-empty Boolean array.");
  }
  const matches = values.filter(Boolean).length;
  if (matches === values.length) return "all";
  if (matches === 0) return "none";
  return "partial";
}

function validateAggregateCell(cell, initializationId) {
  const keys = [
    "initialization_id",
    "history_family",
    "scale_cell_id",
    "gate_decision",
    "trajectory_discrepancy",
    "endpoint_match",
    "peak_match",
  ];
  if (!exactKeys(cell, keys)) {
    throw new Error("Fixture 026 scientific-grid aggregate cell has unknown or missing fields.");
  }
  if (
    !/^[0-9a-f]{64}$/u.test(cell.initialization_id)
    || cell.initialization_id !== initializationId
    || !FIXTURE_026_HISTORY_FAMILIES.includes(cell.history_family)
    || !FIXTURE_026_SCALE_CELLS.some(({ scale_cell_id: scaleCellId }) => (
      scaleCellId === cell.scale_cell_id
    ))
    || !new Set(["accepted", "rejected", "abstained"]).has(cell.gate_decision)
  ) throw new Error("Fixture 026 scientific-grid aggregate cell uses an unknown closed-registry value.");
  if (cell.gate_decision === "accepted") {
    if (
      !Number.isFinite(cell.trajectory_discrepancy)
      || cell.trajectory_discrepancy < 0
      || typeof cell.endpoint_match !== "boolean"
      || typeof cell.peak_match !== "boolean"
    ) throw new Error("Fixture 026 accepted aggregate cell is incomplete.");
  } else if (
    cell.trajectory_discrepancy !== null
    || cell.endpoint_match !== null
    || cell.peak_match !== null
  ) throw new Error("Fixture 026 rejected or abstained aggregate cell must not carry evaluated properties.");
  return cell;
}

function systemCellKey(historyFamily, scaleCellId) {
  return `${historyFamily}|${scaleCellId}`;
}

function buildMatchMatrix(cellBuckets, property) {
  return deepFreeze(FIXTURE_026_HISTORY_FAMILIES.map((historyFamily) => ({
    history_family: historyFamily,
    scale_cells: FIXTURE_026_SCALE_CELLS.map(({ scale_cell_id: scaleCellId }) => {
      const records = cellBuckets.get(systemCellKey(historyFamily, scaleCellId)) ?? [];
      if (records.length === 0) return { scale_cell_id: scaleCellId, status: "missing", match: null };
      if (records.length > 1) return { scale_cell_id: scaleCellId, status: "duplicate", match: null };
      const [cell] = records;
      if (cell.gate_decision !== "accepted") {
        return { scale_cell_id: scaleCellId, status: cell.gate_decision, match: null };
      }
      return { scale_cell_id: scaleCellId, status: "accepted", match: cell[property] };
    }),
  })));
}

function matrixMatches(matrix) {
  return matrix.flatMap((row) => row.scale_cells.map((cell) => cell.match));
}

export function aggregateFixture026System(request) {
  const keys = ["initialization_id", "cells"];
  if (
    !exactKeys(request, keys)
    || !/^[0-9a-f]{64}$/u.test(request.initialization_id)
    || !Array.isArray(request.cells)
  ) {
    throw new Error("Fixture 026 system aggregation request has unknown or missing fields.");
  }
  const exactTolerance = FIXTURE_026_SCIENTIFIC_GRID_TOLERANCES.exact_discrepancy_tolerance;
  const approximateCeiling = FIXTURE_026_SCIENTIFIC_GRID_TOLERANCES.approximate_discrepancy_ceiling;

  const cellBuckets = new Map();
  for (const candidate of request.cells) {
    const cell = validateAggregateCell(candidate, request.initialization_id);
    const key = systemCellKey(cell.history_family, cell.scale_cell_id);
    const records = cellBuckets.get(key) ?? [];
    records.push(cell);
    cellBuckets.set(key, records);
  }

  const endpointMatrix = buildMatchMatrix(cellBuckets, "endpoint_match");
  const peakMatrix = buildMatchMatrix(cellBuckets, "peak_match");
  const flattenedCells = FIXTURE_026_HISTORY_FAMILIES.flatMap((historyFamily) => (
    FIXTURE_026_SCALE_CELLS.map(({ scale_cell_id: scaleCellId }) => (
      cellBuckets.get(systemCellKey(historyFamily, scaleCellId)) ?? []
    ))
  ));
  const reasonCodes = [];
  if (flattenedCells.some((records) => records.length === 0)) reasonCodes.push("missing-cell");
  if (flattenedCells.some((records) => records.length > 1)) reasonCodes.push("duplicate-cell");
  if (flattenedCells.some((records) => records.length === 1 && records[0].gate_decision === "rejected")) {
    reasonCodes.push("rejected-cell");
  }
  if (flattenedCells.some((records) => records.length === 1 && records[0].gate_decision === "abstained")) {
    reasonCodes.push("abstained-cell");
  }
  const acceptedCellCount = flattenedCells.filter((records) => (
    records.length === 1 && records[0].gate_decision === "accepted"
  )).length;
  if (reasonCodes.length > 0) {
    return deepFreeze({
      status: "unavailable",
      decision: "abstain",
      initialization_id: request.initialization_id,
      reason_codes: reasonCodes,
      expected_cell_count: FIXTURE_026_SYSTEM_GRID_CELL_COUNT,
      accepted_cell_count: acceptedCellCount,
      exact_discrepancy_tolerance: exactTolerance,
      approximate_discrepancy_ceiling: approximateCeiling,
      discrepancy_unit: FIXTURE_026_SCIENTIFIC_GRID_TOLERANCES.discrepancy_unit,
      worst_trajectory_discrepancy: null,
      paired_trajectory_match: null,
      endpoint_matrix: endpointMatrix,
      endpoint_reducer: "unavailable",
      peak_matrix: peakMatrix,
      peak_reducer: "unavailable",
    });
  }

  const acceptedCells = flattenedCells.map(([cell]) => cell);
  const worstDiscrepancy = Math.max(...acceptedCells.map((cell) => cell.trajectory_discrepancy));
  const pairedTrajectoryMatch = worstDiscrepancy <= exactTolerance
    ? "exact"
    : worstDiscrepancy <= approximateCeiling
      ? "approximate"
      : "absent";
  return deepFreeze({
    status: "available",
    decision: "evaluate",
    initialization_id: request.initialization_id,
    reason_codes: [],
    expected_cell_count: FIXTURE_026_SYSTEM_GRID_CELL_COUNT,
    accepted_cell_count: acceptedCellCount,
    exact_discrepancy_tolerance: exactTolerance,
    approximate_discrepancy_ceiling: approximateCeiling,
    discrepancy_unit: FIXTURE_026_SCIENTIFIC_GRID_TOLERANCES.discrepancy_unit,
    worst_trajectory_discrepancy: worstDiscrepancy,
    paired_trajectory_match: pairedTrajectoryMatch,
    endpoint_matrix: endpointMatrix,
    endpoint_reducer: reduceFixture026BooleanMatrix(matrixMatches(endpointMatrix)),
    peak_matrix: peakMatrix,
    peak_reducer: reduceFixture026BooleanMatrix(matrixMatches(peakMatrix)),
  });
}
