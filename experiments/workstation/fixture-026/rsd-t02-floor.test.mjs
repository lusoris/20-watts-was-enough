import assert from "node:assert/strict";
import test from "node:test";

import {
  FIXTURE_026_RSD_T02_FLOOR_REGISTRY,
} from "./rsd-t02-contract.mjs";
import {
  buildFixture026RsdT02CompositeSampleTimes,
  buildFixture026RsdT02FloorDescriptors,
  fixture026RsdT02BoundaryLayerNorms,
  fixture026RsdT02ControlDiscrepancy,
  fixture026RsdT02CriticalTimeS,
  fixture026RsdT02FiniteFloorLowerBound,
  fixture026RsdT02FloorMagnitude,
} from "./rsd-t02-floor.mjs";

test("floor stratum is 3 models by 7 epsilon values by 5 scale factors", () => {
  const descriptors = buildFixture026RsdT02FloorDescriptors();
  assert.equal(descriptors.length, 105);
  assert.equal(descriptors.length, FIXTURE_026_RSD_T02_FLOOR_REGISTRY.nominal_cell_count);
  assert.deepEqual(descriptors.map(({ ordinal }) => ordinal), [...Array(105).keys()]);
  assert.equal(new Set(descriptors.map(({ descriptor_id: id }) => id)).size, 105);
  assert.ok(descriptors.every((descriptor) => (
    typeof descriptor.model_id === "string"
    && typeof descriptor.equation_id === "string"
    && ["positive", "zero-exact", "zero-limit"].includes(descriptor.asymptotic_floor_truth)
    && descriptor.partition === "public-development"
    && descriptor.primary_norm === "supremum"
    && descriptor.rms_role === "diagnostic-only"
    && descriptor.result === "NO_RESULT"
  )));
});

test("both control equations have their declared zero-floor behavior", () => {
  assert.equal(fixture026RsdT02ControlDiscrepancy({
    model_id: "exact-equivariance-control",
    epsilon: 0.1,
    scale_factor: 20,
  }), 0);
  const coarse = fixture026RsdT02ControlDiscrepancy({
    model_id: "regular-perturbation-control",
    epsilon: 0.1,
    scale_factor: 4,
  });
  const fine = fixture026RsdT02ControlDiscrepancy({
    model_id: "regular-perturbation-control",
    epsilon: 1e-7,
    scale_factor: 4,
  });
  assert.ok(fine < coarse / 1e5);
  assert.throws(() => fixture026RsdT02ControlDiscrepancy({
    model_id: "source-shaped-singular",
    epsilon: 0.1,
    scale_factor: 2,
  }), /Unknown/u);
});

test("source-shaped analytic floor is positive away from p=1", () => {
  assert.equal(fixture026RsdT02FloorMagnitude(1), 0);
  for (const scaleFactor of [0.5, 2, 4, 8, 20]) {
    assert.ok(fixture026RsdT02FloorMagnitude(scaleFactor) > 0);
  }
  assert.ok(Math.abs(
    fixture026RsdT02FloorMagnitude(0.5) - fixture026RsdT02FloorMagnitude(2),
  ) < 1e-15);
});

test("composite grid retains both fast and slow windows without exceeding its ceiling", () => {
  for (const epsilon of FIXTURE_026_RSD_T02_FLOOR_REGISTRY.epsilon_values) {
    const times = buildFixture026RsdT02CompositeSampleTimes(epsilon);
    assert.equal(times[0], 0);
    assert.equal(times.at(-1), 8);
    assert.ok(times.length <= FIXTURE_026_RSD_T02_FLOOR_REGISTRY.paired_rows_per_cell_ceiling);
    assert.ok(times.every((time, index) => index === 0 || time > times[index - 1]));
    const critical = fixture026RsdT02CriticalTimeS({ epsilon, scale_factor: 2 });
    const nearest = Math.min(...times.map((time) => Math.abs(time - critical)));
    assert.ok(nearest <= epsilon / 256);
  }
});

test("RMS can vanish while the supremum norm remains one", () => {
  const coarse = fixture026RsdT02BoundaryLayerNorms({ epsilon: 0.5 });
  const fine = fixture026RsdT02BoundaryLayerNorms({ epsilon: 1e-7 });
  assert.equal(coarse.supremum, 1);
  assert.equal(fine.supremum, 1);
  assert.ok(fine.rms < coarse.rms / 100);
  assert.ok(fine.rms < 0.001);
  assert.equal(
    fixture026RsdT02BoundaryLayerNorms({
      epsilon: 0.5,
      horizon_s: 2,
      slow_time_constant_s: 2,
    }).rms,
    coarse.rms,
  );
});

test("finite lower bound retains the theorem-shaped epsilon correction", () => {
  const magnitude = fixture026RsdT02FloorMagnitude(2);
  assert.equal(fixture026RsdT02FiniteFloorLowerBound({
    epsilon: 0.01,
    scale_factor: 2,
    derivative_bound: 1,
  }), magnitude - 0.01);
  assert.equal(fixture026RsdT02FiniteFloorLowerBound({
    epsilon: 1,
    scale_factor: 2,
    derivative_bound: 10,
  }), 0);
  assert.throws(() => fixture026RsdT02FiniteFloorLowerBound({
    epsilon: 0.1,
    scale_factor: 2,
    derivative_bound: -1,
  }), /nonnegative/u);
});
