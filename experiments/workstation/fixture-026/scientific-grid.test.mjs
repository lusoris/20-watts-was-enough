import assert from "node:assert/strict";
import test from "node:test";

import {
  FIXTURE_026_NOMINAL_GRID_CELL_COUNT,
  FIXTURE_026_RSD_T01_ACTIONABLE_ARM_IDS,
  FIXTURE_026_RSD_T01_ARM_REGISTRY,
  FIXTURE_026_RSD_T01_EVALUATOR_ONLY_ARM_ID,
  FIXTURE_026_SCALE_CELLS,
  FIXTURE_026_SCIENTIFIC_GRID_REGISTRY,
  FIXTURE_026_SCIENTIFIC_GRID_TOLERANCES,
  FIXTURE_026_SCIENTIFIC_GRID_VERSION,
  FIXTURE_026_SCIENTIFIC_HOSTILE_CASES,
  FIXTURE_026_SYSTEM_GRID_CELL_COUNT,
  aggregateFixture026System,
  assertFixture026ScientificGridRegistry,
  buildFixture026HostileCaseDescriptors,
  buildFixture026ScientificGridDescriptors,
  reduceFixture026BooleanMatrix,
} from "./scientific-grid.mjs";
import {
  FIXTURE_026_HISTORY_FAMILIES,
  FIXTURE_026_MALFORMED_SENTINELS,
  FIXTURE_026_VALID_FAMILIES,
} from "./generator.mjs";

const INITIALIZATION_ID = "a".repeat(64);

function acceptedSystemCells(overrides = new Map(), initializationId = INITIALIZATION_ID) {
  return FIXTURE_026_HISTORY_FAMILIES.flatMap((historyFamily) => (
    FIXTURE_026_SCALE_CELLS.map(({ scale_cell_id: scaleCellId }) => {
      const key = `${historyFamily}|${scaleCellId}`;
      return {
        initialization_id: initializationId,
        history_family: historyFamily,
        scale_cell_id: scaleCellId,
        gate_decision: "accepted",
        trajectory_discrepancy: 0,
        endpoint_match: true,
        peak_match: true,
        ...(overrides.get(key) ?? {}),
      };
    })
  ));
}

function aggregate(cells) {
  return aggregateFixture026System({
    initialization_id: INITIALIZATION_ID,
    cells,
  });
}

test("scientific-grid v1 registry is closed and freezes eight actionable arms plus one oracle", () => {
  assert.equal(
    assertFixture026ScientificGridRegistry(FIXTURE_026_SCIENTIFIC_GRID_REGISTRY),
    FIXTURE_026_SCIENTIFIC_GRID_REGISTRY,
  );
  assert.equal(FIXTURE_026_SCIENTIFIC_GRID_REGISTRY.version, FIXTURE_026_SCIENTIFIC_GRID_VERSION);
  assert.equal(FIXTURE_026_SCIENTIFIC_GRID_REGISTRY.protocol, "RSD-T01");
  assert.equal(FIXTURE_026_SCIENTIFIC_GRID_REGISTRY.partition, "public-development");
  assert.equal(FIXTURE_026_SCIENTIFIC_GRID_REGISTRY.information_cut_status, "unregistered");
  assert.equal(FIXTURE_026_SCIENTIFIC_GRID_REGISTRY.comparison_authority, false);
  assert.equal(FIXTURE_026_SCIENTIFIC_GRID_REGISTRY.result_authority, "NO_RESULT");
  assert.deepEqual(FIXTURE_026_RSD_T01_ACTIONABLE_ARM_IDS, [
    "A-RAW",
    "B-STATIC-DIV",
    "B-STREAM",
    "B-LOG-RATIO",
    "B-DIFFERENCE",
    "B-STATE-SPACE",
    "B-RECURRENT",
    "C-DUAL",
  ]);
  assert.equal(FIXTURE_026_RSD_T01_EVALUATOR_ONLY_ARM_ID, "O-STATISTIC");
  assert.deepEqual(
    FIXTURE_026_SCIENTIFIC_GRID_REGISTRY.malformed_sentinels,
    FIXTURE_026_MALFORMED_SENTINELS,
  );
  assert.deepEqual(
    FIXTURE_026_RSD_T01_ARM_REGISTRY.filter((arm) => arm.role === "actionable")
      .map((arm) => arm.arm_id),
    FIXTURE_026_RSD_T01_ACTIONABLE_ARM_IDS,
  );
  assert.ok(FIXTURE_026_RSD_T01_ARM_REGISTRY
    .filter((arm) => arm.role === "actionable")
    .every((arm) => (
      arm.current_parity_eligible === false
      && arm.current_ranking_eligible === false
      && arm.activation_requirement === "implemented-and-registered-information-cut"
    )));
  const oracle = FIXTURE_026_RSD_T01_ARM_REGISTRY.find(({ arm_id: armId }) => (
    armId === FIXTURE_026_RSD_T01_EVALUATOR_ONLY_ARM_ID
  ));
  assert.deepEqual(oracle, {
    arm_id: "O-STATISTIC",
    role: "evaluator-only",
    current_parity_eligible: false,
    current_ranking_eligible: false,
    future_comparison_role: "excluded",
    activation_requirement: "never-actionable",
  });
  assert.deepEqual(FIXTURE_026_SCIENTIFIC_GRID_REGISTRY.tolerances, {
    exact_discrepancy_tolerance: 1e-12,
    approximate_discrepancy_ceiling: 0.06,
    discrepancy_unit: "1",
  });
  assert.equal(
    FIXTURE_026_SCIENTIFIC_GRID_REGISTRY.tolerances.exact_discrepancy_tolerance,
    FIXTURE_026_SCIENTIFIC_GRID_TOLERANCES.exact_discrepancy_tolerance,
  );
  assert.throws(() => assertFixture026ScientificGridRegistry({
    ...FIXTURE_026_SCIENTIFIC_GRID_REGISTRY,
    future_field: true,
  }), /unknown fields/u);
  assert.throws(() => assertFixture026ScientificGridRegistry({
    ...FIXTURE_026_SCIENTIFIC_GRID_REGISTRY,
    tolerances: {
      ...FIXTURE_026_SCIENTIFIC_GRID_REGISTRY.tolerances,
      approximate_discrepancy_ceiling: 0.6,
    },
  }), /tolerance registry differs/u);
});

test("nominal descriptors have exact family-history-scale cartesian order and shared initializations", () => {
  const descriptors = buildFixture026ScientificGridDescriptors({ seed: "1540001" });
  assert.equal(descriptors.length, FIXTURE_026_NOMINAL_GRID_CELL_COUNT);
  assert.equal(descriptors.length, 5 * 4 * 3);
  const expectedOrder = FIXTURE_026_VALID_FAMILIES.flatMap((generatorFamily) => (
    FIXTURE_026_HISTORY_FAMILIES.flatMap((historyFamily) => (
      FIXTURE_026_SCALE_CELLS.map((scaleCell) => [
        generatorFamily,
        historyFamily,
        scaleCell.scale_cell_id,
      ])
    ))
  ));
  assert.deepEqual(descriptors.map((descriptor) => [
    descriptor.generator_family,
    descriptor.history_family,
    descriptor.scale_cell_id,
  ]), expectedOrder);
  assert.deepEqual(descriptors.map(({ ordinal }) => ordinal), [
    ...Array(FIXTURE_026_NOMINAL_GRID_CELL_COUNT).keys(),
  ]);
  assert.equal(new Set(descriptors.map(({ descriptor_id: descriptorId }) => descriptorId)).size, 60);

  for (const generatorFamily of FIXTURE_026_VALID_FAMILIES) {
    const familyCells = descriptors.filter((cell) => cell.generator_family === generatorFamily);
    assert.equal(new Set(familyCells.map(({ initialization_id: id }) => id)).size, 1);
    for (const historyFamily of FIXTURE_026_HISTORY_FAMILIES) {
      const scaleCells = familyCells.filter((cell) => cell.history_family === historyFamily);
      assert.equal(scaleCells.length, 3);
      assert.equal(new Set(scaleCells.map(({ initialization_id: id }) => id)).size, 1);
    }
  }
});

test("scale roles freeze two observed development cells and one prospective holdout", () => {
  assert.deepEqual(FIXTURE_026_SCALE_CELLS.map((cell) => [
    cell.scale_factor,
    cell.observation_role,
    cell.partition,
    cell.information_cut_status,
  ]), [
    [2, "observed-development", "public-development", "not-applicable"],
    [4, "observed-development", "public-development", "not-applicable"],
    [8, "withheld-prospective", "public-development", "unregistered-candidate"],
  ]);
  const prospective = buildFixture026ScientificGridDescriptors({ seed: "0" })
    .filter(({ observation_role: role }) => role === "withheld-prospective");
  assert.equal(prospective.length, FIXTURE_026_VALID_FAMILIES.length * FIXTURE_026_HISTORY_FAMILIES.length);
  assert.ok(prospective.every(({ scale_factor: scaleFactor }) => scaleFactor === 8));
  assert.ok(prospective.every((descriptor) => (
    descriptor.partition === "public-development"
    && descriptor.information_cut_status === "unregistered-candidate"
  )));
});

test("scientific hostiles are valid cases distinct from malformed sentinels with frozen support and leakage", () => {
  assert.deepEqual(FIXTURE_026_SCIENTIFIC_HOSTILE_CASES.map((entry) => entry.hostile_case_id), [
    "additive-offset",
    "near-zero",
    "clipping",
    "hidden-reset",
    "slow-tail",
    "future-normalization-leakage",
  ]);
  const descriptors = buildFixture026HostileCaseDescriptors({ seed: "1540001" });
  assert.equal(descriptors.length, 6);
  assert.ok(descriptors.every((entry) => (
    entry.case_class === "valid-scientific-hostile" && entry.malformed_sentinel === false
  )));
  assert.ok(descriptors.every(({ hostile_case_id: id }) => !FIXTURE_026_MALFORMED_SENTINELS.includes(id)));
  const supportFields = [
    "input_domain_support",
    "transformation_support",
    "instrument_support",
    "initialization_support",
    "causal_observation_support",
    "evaluation_window_support",
  ];
  assert.ok(descriptors.every((entry) => (
    supportFields.every((field) => new Set(["inside", "outside"]).has(entry[field]))
  )));
  const additiveOffset = descriptors.find((entry) => entry.hostile_case_id === "additive-offset");
  assert.equal(additiveOffset.input_domain_support, "inside");
  assert.equal(additiveOffset.transformation_support, "outside");
  assert.equal(additiveOffset.instrument_support, "inside");
  const slowTail = descriptors.find((entry) => entry.hostile_case_id === "slow-tail");
  assert.ok(supportFields.every((field) => slowTail[field] === "inside"));
  const futureLeakage = descriptors.find((entry) => (
    entry.hostile_case_id === "future-normalization-leakage"
  ));
  assert.equal(futureLeakage.input_domain_support, "inside");
  assert.equal(futureLeakage.causal_observation_support, "outside");
  assert.equal(futureLeakage.leakage_expectation, "must-detect-and-reject");
});

test("descriptor IDs are deterministic, seed-sensitive, ordered, and use canonical uint64 seeds", () => {
  const first = buildFixture026ScientificGridDescriptors({ seed: "1540001" });
  const replay = buildFixture026ScientificGridDescriptors({ seed: "1540001" });
  const other = buildFixture026ScientificGridDescriptors({ seed: "1540002" });
  assert.deepEqual(first, replay);
  assert.notEqual(first[0].descriptor_id, other[0].descriptor_id);
  assert.notEqual(first[0].initialization_id, other[0].initialization_id);
  assert.deepEqual(
    buildFixture026HostileCaseDescriptors({ seed: "1540001" }),
    buildFixture026HostileCaseDescriptors({ seed: "1540001" }),
  );
  for (const invalidSeed of [1540001, "01", "+1", "18446744073709551616", "1.0", " 1"] ) {
    assert.throws(() => buildFixture026ScientificGridDescriptors({ seed: invalidSeed }), /uint64/u);
  }
  assert.throws(
    () => buildFixture026ScientificGridDescriptors({ seed: "1", unknown: true }),
    /unknown or missing fields/u,
  );
  assert.throws(
    () => buildFixture026HostileCaseDescriptors({ seed: "1", unknown: true }),
    /unknown or missing fields/u,
  );
});

test("system aggregation is label-independent and classifies by the worst complete grid cell", () => {
  const overrides = new Map([
    ["step|S-04X-DEV", { trajectory_discrepancy: 0.03 }],
    ["ramp|S-08X-PROSPECTIVE", { trajectory_discrepancy: 0.055, endpoint_match: false }],
    ["pulse|S-02X-DEV", { peak_match: false }],
  ]);
  const result = aggregate(acceptedSystemCells(overrides));
  assert.equal(result.status, "available");
  assert.equal(result.decision, "evaluate");
  assert.equal(result.initialization_id, INITIALIZATION_ID);
  assert.equal(result.accepted_cell_count, FIXTURE_026_SYSTEM_GRID_CELL_COUNT);
  assert.equal(result.exact_discrepancy_tolerance, 1e-12);
  assert.equal(result.approximate_discrepancy_ceiling, 0.06);
  assert.equal(result.discrepancy_unit, "1");
  assert.equal(result.worst_trajectory_discrepancy, 0.055);
  assert.equal(result.paired_trajectory_match, "approximate");
  assert.equal(result.endpoint_reducer, "partial");
  assert.equal(result.peak_reducer, "partial");
  assert.equal(result.endpoint_matrix.length, FIXTURE_026_HISTORY_FAMILIES.length);
  assert.ok(result.endpoint_matrix.every((row) => row.scale_cells.length === 3));
  assert.ok(!Object.hasOwn(result, "generator_family"));
  assert.throws(() => aggregate([
    { ...acceptedSystemCells()[0], generator_family: "exact-scale-symmetry" },
    ...acceptedSystemCells().slice(1),
  ]), /unknown or missing fields/u);

  const absent = aggregate(acceptedSystemCells(new Map([
    ["step|S-02X-DEV", { trajectory_discrepancy: 0.0600001 }],
  ])));
  assert.equal(absent.paired_trajectory_match, "absent");
  const exactBoundary = aggregate(acceptedSystemCells(new Map([
    ["step|S-02X-DEV", { trajectory_discrepancy: 1e-12 }],
  ])));
  assert.equal(exactBoundary.paired_trajectory_match, "exact");
  const approximateBoundary = aggregate(acceptedSystemCells(new Map([
    ["step|S-02X-DEV", { trajectory_discrepancy: 0.06 }],
  ])));
  assert.equal(approximateBoundary.paired_trajectory_match, "approximate");
});

test("missing, rejected, and abstained system cells force abstention and remain represented", () => {
  const complete = acceptedSystemCells();
  const missing = aggregate(complete.slice(1));
  assert.equal(missing.status, "unavailable");
  assert.equal(missing.decision, "abstain");
  assert.deepEqual(missing.reason_codes, ["missing-cell"]);
  assert.equal(missing.worst_trajectory_discrepancy, null);
  assert.equal(missing.paired_trajectory_match, null);
  assert.equal(missing.endpoint_reducer, "unavailable");
  assert.equal(missing.endpoint_matrix[0].scale_cells[0].status, "missing");

  const rejectedCells = acceptedSystemCells();
  rejectedCells[5] = {
    ...rejectedCells[5],
    gate_decision: "rejected",
    trajectory_discrepancy: null,
    endpoint_match: null,
    peak_match: null,
  };
  const rejected = aggregate(rejectedCells);
  assert.equal(rejected.status, "unavailable");
  assert.equal(rejected.decision, "abstain");
  assert.deepEqual(rejected.reason_codes, ["rejected-cell"]);
  assert.equal(rejected.accepted_cell_count, FIXTURE_026_SYSTEM_GRID_CELL_COUNT - 1);
  assert.equal(rejected.endpoint_matrix[1].scale_cells[2].status, "rejected");

  const abstainedCells = acceptedSystemCells();
  abstainedCells[7] = {
    ...abstainedCells[7],
    gate_decision: "abstained",
    trajectory_discrepancy: null,
    endpoint_match: null,
    peak_match: null,
  };
  const abstained = aggregate(abstainedCells);
  assert.equal(abstained.status, "unavailable");
  assert.equal(abstained.decision, "abstain");
  assert.deepEqual(abstained.reason_codes, ["abstained-cell"]);
  assert.equal(abstained.accepted_cell_count, FIXTURE_026_SYSTEM_GRID_CELL_COUNT - 1);
  assert.equal(abstained.endpoint_matrix[2].scale_cells[1].status, "abstained");

  const duplicate = aggregate([...complete, complete[0]]);
  assert.deepEqual(duplicate.reason_codes, ["duplicate-cell"]);
  assert.equal(duplicate.endpoint_matrix[0].scale_cells[0].status, "duplicate");
});

test("system aggregation rejects mixed or malformed initialization identities", () => {
  const mixed = acceptedSystemCells();
  mixed[3] = { ...mixed[3], initialization_id: "b".repeat(64) };
  assert.throws(() => aggregate(mixed), /unknown closed-registry value/u);
  assert.throws(() => aggregateFixture026System({
    initialization_id: "not-a-sha256-id",
    cells: acceptedSystemCells(),
  }), /unknown or missing fields/u);
});

test("Boolean property reducers return all, partial, or none and reject incomplete domains", () => {
  assert.equal(reduceFixture026BooleanMatrix([true, true]), "all");
  assert.equal(reduceFixture026BooleanMatrix([true, false]), "partial");
  assert.equal(reduceFixture026BooleanMatrix([false, false]), "none");
  assert.throws(() => reduceFixture026BooleanMatrix([]), /non-empty Boolean/u);
  assert.throws(() => reduceFixture026BooleanMatrix([true, null]), /non-empty Boolean/u);

  const none = aggregate(acceptedSystemCells(new Map(FIXTURE_026_HISTORY_FAMILIES.flatMap((history) => (
    FIXTURE_026_SCALE_CELLS.map(({ scale_cell_id: scale }) => [
      `${history}|${scale}`,
      { endpoint_match: false, peak_match: false },
    ])
  )))));
  assert.equal(none.endpoint_reducer, "none");
  assert.equal(none.peak_reducer, "none");
});

test("aggregation rejects unknown fields, unknown closed-registry values, and invalid accepted cells", () => {
  const cells = acceptedSystemCells();
  assert.throws(() => aggregateFixture026System({
    initialization_id: INITIALIZATION_ID,
    cells,
    unknown: true,
  }), /unknown or missing fields/u);
  assert.throws(() => aggregate([
    { ...cells[0], scale_cell_id: "S-16X" },
    ...cells.slice(1),
  ]), /unknown closed-registry value/u);
  assert.throws(() => aggregate([
    { ...cells[0], trajectory_discrepancy: Number.NaN },
    ...cells.slice(1),
  ]), /accepted aggregate cell is incomplete/u);
  assert.throws(() => aggregateFixture026System({
    initialization_id: INITIALIZATION_ID,
    cells,
    exact_discrepancy_tolerance: 0.1,
  }), /unknown or missing fields/u);
});
