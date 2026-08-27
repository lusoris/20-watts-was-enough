import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import test from "node:test";

import {
  analyzeFixture026RsdT02PairedPanel,
  applyFixture026RsdT02Holm4,
  FIXTURE_026_RSD_T02_REGISTERED_HYPOTHESES,
} from "./rsd-t02-holm4.mjs";

const PENALTIES = Object.freeze({
  mean_property_log_loss_nats: 4,
  mean_decision_loss_dimensionless: 2,
});

function sha(value) {
  return createHash("sha256").update(value).digest("hex");
}

function panel({ families = ["family-a", "family-b"], instancesPerFamily = 4 } = {}) {
  const records = [];
  for (const familyId of families) {
    for (let index = 0; index < instancesPerFamily; index += 1) {
      const identity = sha(`${familyId}:identity:${index}`);
      const systemId = sha(`${familyId}:system:${index}`);
      for (const [armId, shift] of [
        ["C-MECHANISM-BANK", 0],
        ["B-STATE-SPACE", 0.4],
        ["B-RECURRENT", 0.25],
      ]) {
        const failed = index === 0 && armId === "B-RECURRENT";
        const armSlope = armId === "C-MECHANISM-BANK"
          ? 0.01
          : armId === "B-STATE-SPACE" ? 0.018 : 0.015;
        records.push({
          system_instance_id: systemId,
          scientific_identity_sha256: identity,
          family_id: familyId,
          arm_id: armId,
          pre_response_valid: true,
          runtime_failure: failed,
          mean_property_log_loss_nats: failed ? PENALTIES.mean_property_log_loss_nats : 0.2 + shift + index * armSlope,
          mean_decision_loss_dimensionless: failed ? PENALTIES.mean_decision_loss_dimensionless : 0.1 + shift / 2 + index * armSlope / 2,
        });
      }
    }
  }
  return records;
}

test("Holm applies one experiment-wide four-hypothesis step-down family", () => {
  const p = new Map([
    ["H-LOGLOSS-C-vs-STATE-SPACE", 0.001],
    ["H-LOGLOSS-C-vs-RECURRENT", 0.01],
    ["H-DECISION-C-vs-STATE-SPACE", 0.03],
    ["H-DECISION-C-vs-RECURRENT", 0.04],
  ]);
  const report = applyFixture026RsdT02Holm4(
    FIXTURE_026_RSD_T02_REGISTERED_HYPOTHESES.map((row) => ({
      hypothesis_id: row.hypothesis_id,
      raw_p: p.get(row.hypothesis_id),
    })),
  );
  assert.equal(report.multiplicity_family_size, 4);
  assert.equal(report.mathematical_rejection_count, 2);
  assert.deepEqual(report.hypotheses.map((row) => row.rejected), [true, true, false, false]);
  assert.deepEqual(report.hypotheses.map((row) => row.adjusted_p), [0.004, 0.03, 0.06, 0.06]);
  assert.equal(report.claim_eligible, false);
  assert.equal(report.result_label, "NO_RESULT");
});

test("Holm ties use hypothesis ID and never restart after the first failure", () => {
  const report = applyFixture026RsdT02Holm4(
    FIXTURE_026_RSD_T02_REGISTERED_HYPOTHESES.map((row) => ({
      hypothesis_id: row.hypothesis_id,
      raw_p: 0.02,
    })),
  );
  assert.equal(report.hypotheses.find((row) => row.rank === 1).hypothesis_id, "H-DECISION-C-vs-RECURRENT");
  assert.ok(report.hypotheses.every((row) => row.rejected === false));
  assert.ok(report.hypotheses.every((row) => row.adjusted_p === 0.08));
});

test("Holm refuses missing, duplicate, nonfinite and out-of-range p-values", () => {
  const valid = FIXTURE_026_RSD_T02_REGISTERED_HYPOTHESES.map((row) => ({
    hypothesis_id: row.hypothesis_id,
    raw_p: 0.5,
  }));
  assert.throws(() => applyFixture026RsdT02Holm4(valid.slice(0, 3)), /exactly four/);
  assert.throws(() => applyFixture026RsdT02Holm4([valid[0], valid[0], valid[2], valid[3]]), /duplicate/);
  assert.throws(() => applyFixture026RsdT02Holm4(valid.map((row, i) => ({ ...row, raw_p: i ? 0.5 : Number.NaN }))), /invalid/);
  assert.throws(() => applyFixture026RsdT02Holm4(valid.map((row, i) => ({ ...row, raw_p: i ? 0.5 : 1.1 }))), /invalid/);
});

test("paired analyzer uses system instances, equal family weights and stratified bootstrap-t", () => {
  const report = analyzeFixture026RsdT02PairedPanel({
    records: panel(),
    registered_family_ids: ["family-a", "family-b"],
    runtime_failure_penalties: PENALTIES,
    bootstrap_resamples: 1000,
  });
  assert.deepEqual(report.validation_errors, []);
  assert.equal(report.effective_system_instance_n, 8);
  assert.equal(report.registered_family_n, 2);
  assert.equal(report.effects.length, 4);
  assert.ok(report.effects.every((row) => row.inference_method.includes("bootstrap-t")));
  assert.ok(report.effects.every((row) => row.bootstrap_resample_count === 1000));
  assert.ok(report.effects.every((row) => row.first_holm_threshold_attainable));
  assert.equal(report.bootstrap_resolution_gate_satisfied, true);
  assert.ok(report.effects.every((row) => row.standard_error > 0));
  assert.ok(report.effects.every((row) => row.candidate_minus_comparator < 0));
  assert.ok(report.effects.every((row) => row.mathematical_rejection));
  assert.equal(report.claim_eligible, false);
  assert.equal(report.design_gate_satisfied, false);
  assert.equal(report.result_label, "NO_RESULT");
});

test("bootstrap resolution gate exposes small-sample zero-SE power failure", () => {
  const records = [];
  for (const familyId of ["family-a", "family-b"]) {
    for (let index = 0; index < 2; index += 1) {
      const identity = sha(`${familyId}:small:${index}`);
      const systemId = sha(`${familyId}:small-system:${index}`);
      for (const armId of ["C-MECHANISM-BANK", "B-STATE-SPACE", "B-RECURRENT"]) {
        const comparatorLoss = armId === "C-MECHANISM-BANK" ? 0 : index + 1;
        records.push({
          system_instance_id: systemId,
          scientific_identity_sha256: identity,
          family_id: familyId,
          arm_id: armId,
          pre_response_valid: true,
          runtime_failure: false,
          mean_property_log_loss_nats: comparatorLoss,
          mean_decision_loss_dimensionless: comparatorLoss,
        });
      }
    }
  }
  const report = analyzeFixture026RsdT02PairedPanel({
    records,
    registered_family_ids: ["family-a", "family-b"],
    runtime_failure_penalties: PENALTIES,
    bootstrap_resamples: 4000,
    resampling_key: "small-sample-degeneracy-audit-v1",
  });
  assert.deepEqual(report.validation_errors, []);
  assert.equal(report.bootstrap_resolution_gate_satisfied, false);
  assert.ok(report.effects.every((row) => row.invalid_bootstrap_resample_fraction > 0.2));
  assert.ok(report.effects.every((row) => row.data_dependent_bootstrap_p_floor > 0.2));
  assert.ok(report.effects.every((row) => row.first_holm_threshold_attainable === false));
  assert.ok(report.effects.every((row) => row.mathematical_rejection === false));
  assert.equal(report.result_label, "NO_RESULT");
});

test("hash-identical replays count once and conflicting duplicates fail closed", () => {
  const records = panel();
  const duplicate = records.slice(0, 3).map((row) => ({
    ...row,
    system_instance_id: sha(`replay:${row.arm_id}`),
  }));
  const collapsed = analyzeFixture026RsdT02PairedPanel({
    records: [...records, ...duplicate],
    registered_family_ids: ["family-a", "family-b"],
    runtime_failure_penalties: PENALTIES,
    bootstrap_resamples: 1000,
  });
  assert.deepEqual(collapsed.validation_errors, []);
  assert.equal(collapsed.effective_system_instance_n, 8);
  assert.equal(collapsed.duplicate_arm_rows_collapsed, 3);
  assert.equal(collapsed.duplicated_scientific_identity_n, 1);

  duplicate[0].mean_property_log_loss_nats += 1;
  const refused = analyzeFixture026RsdT02PairedPanel({
    records: [...records, ...duplicate],
    registered_family_ids: ["family-a", "family-b"],
    runtime_failure_penalties: PENALTIES,
  });
  assert.equal(refused.effects.length, 0);
  assert.match(refused.validation_errors[0], /conflicting arm outcome/);
});

test("missing arms, nonfinite outcomes, family drift and invalid units cannot reach Holm", () => {
  const missing = panel();
  missing.pop();
  assert.match(analyzeFixture026RsdT02PairedPanel({
    records: missing,
    registered_family_ids: ["family-a", "family-b"],
    runtime_failure_penalties: PENALTIES,
  }).validation_errors[0], /lacks a registered paired arm/);

  const nonfinite = panel();
  nonfinite[0].mean_decision_loss_dimensionless = Number.POSITIVE_INFINITY;
  assert.match(analyzeFixture026RsdT02PairedPanel({
    records: nonfinite,
    registered_family_ids: ["family-a", "family-b"],
    runtime_failure_penalties: PENALTIES,
  }).validation_errors[0], /invalid mean_decision/);

  const drift = panel();
  drift[1].family_id = "family-b";
  assert.match(analyzeFixture026RsdT02PairedPanel({
    records: drift,
    registered_family_ids: ["family-a", "family-b"],
    runtime_failure_penalties: PENALTIES,
  }).validation_errors[0], /changes family/);
});

test("stratified bootstrap-t is deterministic and records its public key hash", () => {
  const args = {
    records: panel({ instancesPerFamily: 11 }),
    registered_family_ids: ["family-a", "family-b"],
    bootstrap_resamples: 1000,
    resampling_key: "frozen-public-development-key-v1",
    runtime_failure_penalties: PENALTIES,
  };
  const first = analyzeFixture026RsdT02PairedPanel(args);
  const second = analyzeFixture026RsdT02PairedPanel(args);
  assert.deepEqual(first, second);
  assert.ok(first.effects.every((row) => row.inference_method.includes("sha256")));
  assert.ok(first.effects.every((row) => row.plus_one_correction));
  assert.ok(first.effects.every((row) => row.bootstrap_resample_count === 1000));
  assert.match(first.resampling_key_sha256, /^[0-9a-f]{64}$/u);
});

test("runtime failures remain in-denominator at exactly the registered penalties", () => {
  const hostile = panel();
  const failed = hostile.find((row) => row.runtime_failure);
  failed.mean_property_log_loss_nats = 0;
  const refused = analyzeFixture026RsdT02PairedPanel({
    records: hostile,
    registered_family_ids: ["family-a", "family-b"],
    runtime_failure_penalties: PENALTIES,
  });
  assert.match(refused.validation_errors[0], /registered runtime-failure penalties/);

  const absent = analyzeFixture026RsdT02PairedPanel({
    records: panel(),
    registered_family_ids: ["family-a", "family-b"],
  });
  assert.match(absent.validation_errors[0], /penalties are required/);
});
