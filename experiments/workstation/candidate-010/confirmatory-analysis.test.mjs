import assert from "node:assert/strict";
import test from "node:test";
import {
  CONFIRMATORY_PREREGISTRATION,
  analyzeConfirmatory,
  createConfirmatoryPreregistration,
} from "./confirmatory-analysis.mjs";
import {
  EXTERNAL_ENERGY_CONTRACT_VERSION,
  bindExternalEnergyObservation,
  evaluateExternalEnergyReading,
  hashNormalizedExternalEnergyObservation,
  hashProvenanceReviewRecord,
} from "./energy-provider.mjs";

const FROZEN_PLAN = createConfirmatoryPreregistration({
  irreversible_violation_margin: 0.001,
  false_commit_margin: 0.005,
});

function confirmationContext({ phase = "confirmation", frozen = true, withinBudget = true } = {}) {
  return {
    schema: 1,
    phase,
    frozen_release: frozen,
    preregistration_id: FROZEN_PLAN.id,
    task_families: {
      "signed-publication": {
        implemented: true,
        backend_ids: ["signed-publication-backend-0", "signed-publication-backend-1", "signed-publication-backend-2"],
      },
      "actuator-command": {
        implemented: true,
        backend_ids: ["actuator-command-backend-0", "actuator-command-backend-1", "actuator-command-backend-2"],
      },
    },
    budget: { contract_id: "equal-budget-v1", validated: true, within_budget: withinBudget },
  };
}

function boundEnergy({ ownership, value, serial, readingId = `hardware-energy-${serial}` }) {
  const startedAt = new Date(Date.UTC(2026, 7, 21, 10, 0, 0) + serial * 2_000).toISOString();
  const endedAt = new Date(Date.parse(startedAt) + 1_000).toISOString();
  const raw = {
    contract_version: EXTERNAL_ENERGY_CONTRACT_VERSION,
    reading_id: readingId,
    record_kind: "hardware-observation",
    provider: {
      type: "external-meter",
      medium: "wall",
      provider_id: "confirmation-provider",
      meter_id: "confirmation-meter",
      boundary: "isolated work-unit AC inlet",
      hardware_configuration: "frozen confirmation workstation",
      software_telemetry: false,
    },
    calibration: {
      calibration_id: "confirmation-calibration",
      calibrated_at: "2026-01-01T00:00:00.000Z",
      valid_until: "2027-01-01T00:00:00.000Z",
      relative_standard_uncertainty: 0.01,
      coverage_factor: 2,
      traceability_reference: "confirmation test certificate fixture",
    },
    interval: {
      started_at: startedAt,
      ended_at: endedAt,
      clock_id: "confirmation-clock",
      clock_uncertainty_s: 0.001,
      clock_discontinuity_observed: false,
    },
    integrity: { meter_reset_observed: false, negative_reading_observed: false },
    measurement: {
      method: "counter-delta",
      start: { value: 0, unit: "J", observed_at: startedAt },
      end: { value, unit: "J", observed_at: endedAt },
    },
  };
  const observation = evaluateExternalEnergyReading(raw).measured;
  const review = {
    schema: 1,
    review_id: `review-${readingId}`,
    reviewer_id: "confirmation-metrology-reviewer",
    reviewed_at: "2026-08-22T10:00:00.000Z",
    decision: "approved",
    observation_sha256: hashNormalizedExternalEnergyObservation(observation),
  };
  const completeOwnership = {
    ...ownership,
    interval_started_at: startedAt,
    interval_ended_at: endedAt,
  };
  return {
    observation: bindExternalEnergyObservation(observation, {
      ownership: completeOwnership,
      provenanceReview: { ...review, review_sha256: hashProvenanceReviewRecord(review) },
    }),
    interval: { started_at: startedAt, ended_at: endedAt },
  };
}

function records({ violation = false, rawEnergy = false } = {}) {
  const rows = [];
  let serial = 0;
  const arms = [CONFIRMATORY_PREREGISTRATION.candidate_arm, ...CONFIRMATORY_PREREGISTRATION.comparators];
  for (const taskFamily of ["signed-publication", "actuator-command"]) {
    for (let cluster = 0; cluster < 4; cluster += 1) {
      for (let opportunity = 0; opportunity < 20; opportunity += 1) {
        const truthUnsafe = opportunity % 5 === 0;
        for (const arm of arms) {
          const candidate = arm === "reset-coupled";
          const falseCommit = !candidate && truthUnsafe && opportunity % 10 === 0;
          const falseReject = !truthUnsafe && (!candidate ? opportunity % 7 === 0 : opportunity % 19 === 0);
          const commit = !truthUnsafe && !falseReject;
          const identity = {
            run_id: "confirmation-run-001",
            pair_id: `${taskFamily}-${cluster}-${opportunity}`,
            work_unit_id: `${taskFamily}-${cluster}-${opportunity}-${arm}`,
            scenario_id: `${taskFamily}-scenario`,
            task_family: taskFamily,
            backend_id: `${taskFamily}-backend-${cluster % 3}`,
            cluster_id: `${taskFamily}-${cluster}`,
            opportunity_id: `${taskFamily}-${cluster}-${opportunity}`,
            arm,
          };
          const energy = boundEnergy({
            ownership: identity,
            value: candidate ? 0.001 : 0.004,
            serial,
          });
          serial += 1;
          rows.push({
            ...identity,
            backend_implemented: true,
            verifier_id: `verifier-${cluster % 2}`,
            seed: `${taskFamily}-seed-${cluster}`,
            energy_interval: energy.interval,
            truth_unsafe: truthUnsafe,
            decision: { commit, abstain: false },
            outcome: {
              false_commit: falseCommit,
              false_reject: falseReject,
              consequence_weighted_loss: candidate ? Number(falseReject) * 0.2 : Number(falseCommit) * 20 + Number(falseReject),
              irreversible_violation: candidate && violation && cluster === 0 && opportunity === 0,
              rollback_violation: candidate && violation && cluster === 0 && opportunity === 0,
            },
            resources: {
              verifier_calls: candidate ? 0.2 : 0.8,
              durable_bytes_written: candidate ? 16 : 32,
              stopping_time_ms: candidate ? 3 : 9,
              external_energy: energy.observation,
              ...(rawEnergy ? { measured_energy_j: candidate ? 0.001 : 0.004 } : {}),
            },
          });
        }
      }
    }
  }
  return rows;
}

test("preregistration freezes registered comparators, endpoints, gate order, and multiplicity", () => {
  assert.equal(CONFIRMATORY_PREREGISTRATION.comparators.length, 6);
  assert.equal(CONFIRMATORY_PREREGISTRATION.oracle_is_ineligible, true);
  assert.deepEqual(
    CONFIRMATORY_PREREGISTRATION.gatekeeping.map((gate) => gate.stage),
    [1, 2, 3],
  );
  assert.match(CONFIRMATORY_PREREGISTRATION.multiplicity, /Holm/);
  assert.ok(CONFIRMATORY_PREREGISTRATION.endpoints.irreversible_violations);
  assert.ok(CONFIRMATORY_PREREGISTRATION.endpoints.false_commits);
  assert.ok(CONFIRMATORY_PREREGISTRATION.endpoints.consequence_weighted_loss);
  assert.ok(CONFIRMATORY_PREREGISTRATION.endpoints.joules_per_correct_commit);
  assert.ok(CONFIRMATORY_PREREGISTRATION.endpoints.p99_stopping_time_ms);
  assert.equal(CONFIRMATORY_PREREGISTRATION.endpoints.false_commits.margin, null);
  assert.equal(FROZEN_PLAN.endpoints.false_commits.margin, 0.005);
});

test("smoke or unfrozen data can never produce a superiority claim", () => {
  const report = analyzeConfirmatory({
    records: records(),
    context: confirmationContext({ phase: "smoke", frozen: false }),
    preregistration: FROZEN_PLAN,
  });
  assert.equal(report.decision, "abstain");
  assert.equal(report.eligible_for_superiority_claim, false);
  assert.match(report.interpretation, /no superiority/);
  assert.deepEqual(report.gates, {
    safety_noninferiority: "not-opened",
    loss_superiority: "not-opened",
    resource_superiority: "not-opened",
  });
  assert.ok(report.effects.every((effect) => effect.raw_p === null));
});

test("frozen confirmation reports paired effects, uncertainty, and Holm decisions", () => {
  const report = analyzeConfirmatory({
    records: records(),
    context: confirmationContext(),
    preregistration: FROZEN_PLAN,
  });
  assert.equal(report.validation_errors.length, 0);
  assert.equal(report.eligible_for_superiority_claim, true);
  assert.equal(report.decision, "eligible");
  assert.deepEqual(report.gates, {
    safety_noninferiority: "passed",
    loss_superiority: "passed",
    resource_superiority: "passed",
  });
  assert.equal(report.effects.length, CONFIRMATORY_PREREGISTRATION.comparators.length * Object.keys(CONFIRMATORY_PREREGISTRATION.endpoints).length);
  for (const effect of report.effects) {
    assert.equal(effect.simultaneous_95_interval.length, 2);
    assert.ok(effect.clusters > 1);
    assert.match(effect.uncertainty_method, /paired cluster/);
  }
  const tested = report.effects.filter((effect) => effect.raw_p !== null);
  assert.ok(tested.length > 0);
  assert.ok(tested.every((effect) => effect.adjusted_p !== null));
});

test("rollback violation activates a kill rule before benefit testing", () => {
  const report = analyzeConfirmatory({
    records: records({ violation: true }),
    context: confirmationContext(),
    preregistration: FROZEN_PLAN,
  });
  assert.equal(report.decision, "kill");
  assert.equal(report.eligible_for_superiority_claim, false);
  assert.ok(report.kill_reasons.some((reason) => reason.includes("rollback violation")));
  assert.equal(report.gates.loss_superiority, "not-opened");
});

test("raw energy, missing pair, and authoritative budget breach force abstention or kill", () => {
  const missingEnergy = analyzeConfirmatory({
    records: records({ rawEnergy: true }),
    context: confirmationContext(),
    preregistration: FROZEN_PLAN,
  });
  assert.equal(missingEnergy.decision, "abstain");
  assert.ok(missingEnergy.validation_errors.some((error) => error.includes("unvalidated raw numeric energy")));

  const incomplete = records();
  incomplete.pop();
  const missingPair = analyzeConfirmatory({ records: incomplete, context: confirmationContext(), preregistration: FROZEN_PLAN });
  assert.equal(missingPair.decision, "abstain");
  assert.ok(missingPair.validation_errors.some((error) => error.includes("unpaired assignment")));

  const killed = analyzeConfirmatory({
    records: records(),
    context: confirmationContext({ withinBudget: false }),
    preregistration: FROZEN_PLAN,
  });
  assert.equal(killed.decision, "kill");
  assert.ok(killed.kill_reasons.some((reason) => reason.includes("equal-budget")));

  const absentBackend = confirmationContext();
  absentBackend.task_families["signed-publication"].implemented = false;
  const blocked = analyzeConfirmatory({ records: records(), context: absentBackend, preregistration: FROZEN_PLAN });
  assert.equal(blocked.decision, "abstain");
  assert.ok(blocked.validation_errors.some((error) => error.includes("unimplemented held-out backend")));
});

test("loose caller flags cannot impersonate a frozen confirmation context", () => {
  const report = analyzeConfirmatory({
    records: records(),
    phase: "confirmation",
    frozen_release: true,
    preregistration: FROZEN_PLAN,
  });
  assert.equal(report.decision, "abstain");
  assert.equal(report.phase, "unbound");
  assert.ok(report.validation_errors.includes("missing authoritative confirmation context"));
});

test("missing booleans and asymmetric pair metadata are rejected", () => {
  const hostile = records();
  delete hostile[0].outcome.false_commit;
  hostile[1].cluster_id = "attacker-split-cluster";
  const report = analyzeConfirmatory({ records: hostile, context: confirmationContext(), preregistration: FROZEN_PLAN });
  assert.equal(report.decision, "abstain");
  assert.ok(report.validation_errors.some((error) => error.includes("typed missing endpoint false_commits")));
  assert.ok(report.validation_errors.some((error) => error.includes("pair asymmetry")));
});

test("one family, one cluster, and fake cluster splitting cannot satisfy replication", () => {
  const oneFamily = records().filter((record) => record.task_family === "signed-publication");
  const familyReport = analyzeConfirmatory({ records: oneFamily, context: confirmationContext(), preregistration: FROZEN_PLAN });
  assert.equal(familyReport.decision, "abstain");
  assert.ok(familyReport.validation_errors.some((error) => error.includes("implemented task families represented")));

  const oneCluster = records().filter((record) => record.cluster_id.endsWith("-0"));
  const clusterReport = analyzeConfirmatory({ records: oneCluster, context: confirmationContext(), preregistration: FROZEN_PLAN });
  assert.equal(clusterReport.decision, "abstain");
  assert.ok(clusterReport.validation_errors.some((error) => error.includes("insufficient independent clusters")));

  const fakeSplit = records();
  for (const record of fakeSplit) {
    if (record.cluster_id.endsWith("-1")) record.seed = record.seed.replace(/-1$/, "-0");
  }
  const splitReport = analyzeConfirmatory({ records: fakeSplit, context: confirmationContext(), preregistration: FROZEN_PLAN });
  assert.equal(splitReport.decision, "abstain");
  assert.ok(splitReport.validation_errors.some((error) => error.includes("fake cluster splitting")));
});

test("zero-margin noninferiority does not treat exact equality as a pass", () => {
  const zeroPlan = createConfirmatoryPreregistration({
    irreversible_violation_margin: 0,
    false_commit_margin: 0,
  });
  const equal = records();
  for (const record of equal) {
    record.outcome.false_commit = false;
    record.outcome.irreversible_violation = false;
  }
  const context = { ...confirmationContext(), preregistration_id: zeroPlan.id };
  const report = analyzeConfirmatory({ records: equal, context, preregistration: zeroPlan });
  assert.equal(report.eligible_for_superiority_claim, false);
  assert.equal(report.gates.safety_noninferiority, "failed-or-not-evaluable");
});

test("unbound provider output and ownership substitution force abstention", () => {
  const unbound = records();
  const bound = unbound[0].resources.external_energy;
  unbound[0].resources.external_energy = {
    ...bound,
    allocation: "unbound",
    binding: null,
    claim_eligibility: "requires-provenance-review",
  };
  const unboundReport = analyzeConfirmatory({ records: unbound, context: confirmationContext(), preregistration: FROZEN_PLAN });
  assert.equal(unboundReport.decision, "abstain");
  assert.ok(unboundReport.validation_errors.some((error) => error.includes("unbound or ownership-mismatched")));

  const substituted = records();
  substituted[1].resources.external_energy = substituted[0].resources.external_energy;
  const substitutionReport = analyzeConfirmatory({ records: substituted, context: confirmationContext(), preregistration: FROZEN_PLAN });
  assert.equal(substitutionReport.decision, "abstain");
  assert.ok(substitutionReport.validation_errors.some((error) => error.includes("reused external energy observation")));
  assert.ok(substitutionReport.validation_errors.some((error) => error.includes("ownership-mismatched")));
});

test("overlapping claim-eligible meter intervals are rejected", () => {
  const hostile = records();
  const target = hostile[1];
  const replacement = boundEnergy({
    ownership: {
      run_id: target.run_id,
      pair_id: target.pair_id,
      work_unit_id: target.work_unit_id,
      scenario_id: target.scenario_id,
      task_family: target.task_family,
      backend_id: target.backend_id,
      cluster_id: target.cluster_id,
      opportunity_id: target.opportunity_id,
      arm: target.arm,
    },
    value: 0.004,
    serial: 0,
    readingId: "hardware-energy-overlap-unique",
  });
  target.resources.external_energy = replacement.observation;
  target.energy_interval = replacement.interval;
  const report = analyzeConfirmatory({ records: hostile, context: confirmationContext(), preregistration: FROZEN_PLAN });
  assert.equal(report.decision, "abstain");
  assert.ok(report.validation_errors.some((error) => error.includes("overlapping external-energy assignment")));
});
