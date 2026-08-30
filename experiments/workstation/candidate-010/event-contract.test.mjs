import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { createAjv } from "../lib/ajv.mjs";
import {
  CANDIDATE_010_EVENT_CONTRACT_VERSION,
  Candidate010EventContractError,
  assertCandidate010RawEvent,
} from "./event-contract.mjs";

const hash = "a".repeat(64);
const outputSchema = JSON.parse(await readFile(
  new URL("./output.schema.json", import.meta.url),
  "utf8",
));

test("the manifest output schema names the executable runtime contract", async () => {
  const schema = outputSchema;
  assert.equal(schema.additionalProperties, false);
  assert.deepEqual(schema["x-runtime-validator"], {
    module: "event-contract.mjs",
    export: "assertCandidate010RawEvent",
    contract_version: CANDIDATE_010_EVENT_CONTRACT_VERSION,
    version_export: "CANDIDATE_010_EVENT_CONTRACT_VERSION",
    test: "event-contract.test.mjs",
  });
  for (const field of ["evidence", "integrity", "filesystem", "resources"]) {
    assert.ok(schema.required.includes(field));
  }
  const factorial = schema.allOf.find((entry) => entry.if?.required?.includes("run_kind"));
  for (const field of ["candidate_variant", "stopping_time_ms", "comparator_lineage"]) {
    assert.ok(factorial.then.required.includes(field));
  }
});

function smokeEvent() {
  return {
    schema: 1,
    artifact: "candidate-010",
    profile: "smoke",
    opportunity_id: "opportunity-1",
    seed: 1,
    arm: "threshold",
    truth_unsafe: false,
    evidence: [-0.2, -0.1],
    trace: { revealed: false, verifier: null, output_sha256: hash },
    decision: {
      commit: true,
      abstain: false,
      stage: true,
      reset: false,
      reason: "mean-threshold",
      score: -0.15,
    },
    outcome: {
      false_commit: false,
      false_reject: false,
      consequence_weighted_loss: 0,
      rollback_violation: false,
    },
    resources: {
      observations: 2,
      verifier_calls: 0,
      modeled_energy_j: 0.01,
      measured_energy_j: null,
      cpu_elapsed_ms: 1,
      durable_bytes_written: 12,
      staged_bytes_written: 24,
      filesystem_stage_ms: 0.1,
      temporary_execution_ms: 0.2,
      filesystem_finalize_ms: 0.3,
      filesystem_boundary_ms: 0.6,
    },
    filesystem: {
      boundary: "filesystem-stage-execute-finalize-v1",
      task_family: "filesystem-publish",
      backend_id: "filesystem-stage-execute-finalize-v1",
      backend_implemented: true,
      trace_revealed: false,
      trace_output_sha256: hash,
      staged_bytes_written: 24,
      durable_bytes_written: 12,
      stage_elapsed_ms: 0.1,
      temporary_execution_elapsed_ms: 0.2,
      finalize_elapsed_ms: 0.3,
      boundary_elapsed_ms: 0.6,
      rollbackComplete: false,
      commitComplete: true,
      stageExists: false,
      durableExists: true,
      irreversible_violation: false,
      physical_actuation: false,
    },
    integrity: { sequence: 0, previous_sha256: "0".repeat(64), record_sha256: hash },
  };
}

function factorialEvent() {
  const event = smokeEvent();
  delete event.resources.measured_energy_j;
  for (const field of [
    "cpu_elapsed_ms", "filesystem_stage_ms", "temporary_execution_ms",
    "filesystem_finalize_ms", "filesystem_boundary_ms",
  ]) delete event.resources[field];
  Object.assign(event, {
    profile: "development",
    run_kind: "factorial-diagnostic-v1",
    execution_mode: "implementation-test",
    run_id: `c010-run-${hash}`,
    phase: "development",
    scenario_id: "scenario-1",
    scenario_factors: { task_family: "filesystem-publish" },
    task_family: "filesystem-publish",
    backend_id: "filesystem-stage-execute-finalize-v1",
    backend_implemented: true,
    verifier_id: "trace-job-v1",
    cluster_id: `c010-cluster-${hash}`,
    pair_id: `c010-pair-${hash}`,
    work_unit_id: `c010-work-${hash}`,
    paired_input_sha256: hash,
    arm_order_schedule_id: `c010-arm-order-${hash}`,
    arm_order_index: 0,
    candidate_variant: null,
    budget: {
      scenario_id: "scenario-1",
      arm: "threshold",
      assigned_allowance: {
        observations: 4,
        verifier_calls: 2,
        policy_evaluations: 2,
        staged_bytes: 100,
        durable_bytes: 100,
        wall_time_ms: 10,
      },
      within_budget: true,
      unused_is_not_credit: true,
      observed: {
        observations: 2,
        verifier_calls: 0,
        policy_evaluations: 1,
        staged_bytes: 24,
        durable_bytes: 12,
        wall_time_ms: 1,
      },
    },
    stopping_time_ms: 1,
    measurement_interval: {
      started_at: "2026-08-21T12:00:00.000Z",
      ended_at: "2026-08-21T12:00:00.001Z",
      clock_id: "node-system-wall-clock-utc-v1",
    },
    privileged_evidence: false,
    comparator_lineage: null,
  });
  Object.assign(event.trace, { constructed_for_all_arms: true });
  Object.assign(event.decision, { arm: "threshold", observations: 2, verifier_calls: 0 });
  Object.assign(event.outcome, { irreversible_violation: false });
  Object.assign(event.resources, {
    policy_evaluations: 1,
    external_energy: null,
    stopping_time_ms: 1,
  });
  Object.assign(event.filesystem, {
    task_family: "filesystem-publish",
    backend_id: "filesystem-stage-execute-finalize-v1",
    irreversible_violation: false,
  });
  return event;
}

test("smoke and factorial records pass the same versioned raw-event contract", () => {
  assert.equal(assertCandidate010RawEvent(smokeEvent(), { expectedKind: "smoke" }), true);
  assert.equal(assertCandidate010RawEvent(factorialEvent(), { expectedKind: "factorial" }), true);
  const core = factorialEvent();
  delete core.integrity;
  assert.equal(assertCandidate010RawEvent(core, {
    expectedKind: "factorial",
    requireIntegrity: false,
  }), true);
});

test("unknown fields, relabelled run kinds, and malformed integrity fail closed", () => {
  const unknown = smokeEvent();
  unknown.claim_eligible = true;
  assert.throws(() => assertCandidate010RawEvent(unknown), Candidate010EventContractError);

  const relabelled = smokeEvent();
  relabelled.run_kind = "confirmation-result";
  assert.throws(() => assertCandidate010RawEvent(relabelled), /unsupported run_kind/);

  const integrity = smokeEvent();
  integrity.integrity.record_sha256 = "looks-hashed";
  assert.throws(() => assertCandidate010RawEvent(integrity), /record_sha256 must be SHA-256/);
});

test("cross-field accounting and observed boundary facts are recomputed", () => {
  const trace = factorialEvent();
  trace.filesystem.trace_output_sha256 = "b".repeat(64);
  assert.throws(() => assertCandidate010RawEvent(trace), /trace digest must match/);

  const bytes = factorialEvent();
  bytes.resources.staged_bytes_written += 1;
  assert.throws(() => assertCandidate010RawEvent(bytes), /staged-byte accounting must match/);

  const finalization = factorialEvent();
  finalization.filesystem.commitComplete = false;
  assert.throws(() => assertCandidate010RawEvent(finalization), /commitComplete must exactly match/);

  const energy = factorialEvent();
  energy.resources.external_energy = { value_j: 1 };
  assert.throws(() => assertCandidate010RawEvent(energy), /external_energy must remain null/);
});

test("nested objects are exact and contradictory scientific states fail closed", () => {
  const unknownDecision = factorialEvent();
  unknownDecision.decision.claim_eligible = true;
  assert.throws(() => assertCandidate010RawEvent(unknownDecision), /decision fields are not exact/);

  const unknownBoundary = factorialEvent();
  unknownBoundary.filesystem.unregistered_effect = true;
  assert.throws(() => assertCandidate010RawEvent(unknownBoundary), /filesystem fields are not exact/);

  const contradictoryAbstention = factorialEvent();
  contradictoryAbstention.decision.abstain = true;
  assert.throws(() => assertCandidate010RawEvent(contradictoryAbstention), /abstention must be a selective-abstention reset/);

  const bothFinalizations = factorialEvent();
  bothFinalizations.filesystem.rollbackComplete = true;
  assert.throws(() => assertCandidate010RawEvent(bothFinalizations), /rollbackComplete must exactly match/);

  const falsifiedOutcome = factorialEvent();
  falsifiedOutcome.truth_unsafe = true;
  assert.throws(() => assertCandidate010RawEvent(falsifiedOutcome), /false_commit must be derived/);

  const zeroEnergy = factorialEvent();
  zeroEnergy.resources.modeled_energy_j = 0;
  assert.throws(() => assertCandidate010RawEvent(zeroEnergy), /modeled_energy_j must be positive/);
});

test("factorial identities, interval ownership, and privilege boundaries are exact", () => {
  const identity = factorialEvent();
  identity.work_unit_id = "work-1";
  assert.throws(() => assertCandidate010RawEvent(identity), /work_unit_id has an invalid identity/);

  const interval = factorialEvent();
  interval.measurement_interval.ended_at = interval.measurement_interval.started_at;
  assert.throws(() => assertCandidate010RawEvent(interval), /positive ordered UTC instants/);

  const privileged = factorialEvent();
  privileged.privileged_evidence = true;
  assert.throws(() => assertCandidate010RawEvent(privileged), /privileged_evidence must be false/);

  const physical = factorialEvent();
  physical.filesystem.physical_actuation = "unknown";
  assert.throws(() => assertCandidate010RawEvent(physical), /physical_actuation must be exactly false/);
});

test("draft-07 schema is structurally compatible while runtime remains semantic authority", () => {
  const ajv = createAjv({ allErrors: true });
  const validateSchema = ajv.compile(outputSchema);
  const runtimeAccepts = (event, kind) => {
    try {
      assertCandidate010RawEvent(event, { expectedKind: kind });
      return true;
    } catch {
      return false;
    }
  };
  for (const [kind, event] of [["smoke", smokeEvent()], ["factorial", factorialEvent()]]) {
    assert.equal(validateSchema(event), true, JSON.stringify(validateSchema.errors));
    assert.equal(runtimeAccepts(event, kind), true);
  }

  const independent = factorialEvent();
  independent.arm = "independent-verifier";
  independent.decision.arm = independent.arm;
  independent.decision.verifier_implementation_id = "candidate-010-independent-verifier-v1";
  independent.budget.arm = independent.arm;
  const retry = factorialEvent();
  retry.arm = "retry-rollback";
  retry.decision.arm = retry.arm;
  retry.decision.first_action_rolled_back = true;
  retry.decision.retry_lifecycle_count = 2;
  retry.budget.arm = retry.arm;
  retry.filesystem.boundary = "retry-rollback-two-lifecycle-v1";
  retry.filesystem.retry_rollback_lifecycle = {};
  const resetCoupled = factorialEvent();
  resetCoupled.arm = "reset-coupled";
  resetCoupled.candidate_variant = "verifier-coupled-finalization-v1";
  resetCoupled.decision.arm = resetCoupled.arm;
  resetCoupled.decision.policy_variant = resetCoupled.candidate_variant;
  resetCoupled.decision.verifier_observed_but_decoupled = false;
  resetCoupled.budget.arm = resetCoupled.arm;
  for (const event of [independent, retry, resetCoupled]) {
    assert.equal(validateSchema(event), true, JSON.stringify(validateSchema.errors));
    assert.equal(runtimeAccepts(event, "factorial"), true);
  }

  const hostile = [];
  const unknownDecision = factorialEvent();
  unknownDecision.decision.claim_eligible = true;
  hostile.push(unknownDecision);
  const unknownBoundary = factorialEvent();
  unknownBoundary.filesystem.unregistered_effect = true;
  hostile.push(unknownBoundary);
  const contradictoryAbstention = factorialEvent();
  contradictoryAbstention.decision.abstain = true;
  hostile.push(contradictoryAbstention);
  const zeroEnergy = factorialEvent();
  zeroEnergy.resources.modeled_energy_j = 0;
  hostile.push(zeroEnergy);
  const missingBoundaryFact = factorialEvent();
  delete missingBoundaryFact.filesystem.boundary_elapsed_ms;
  hostile.push(missingBoundaryFact);
  const missingExecutionMode = factorialEvent();
  delete missingExecutionMode.execution_mode;
  hostile.push(missingExecutionMode);
  const smokeFactorialLeak = smokeEvent();
  smokeFactorialLeak.execution_mode = "implementation-test";
  hostile.push(smokeFactorialLeak);
  const wrongArmDecisionField = factorialEvent();
  wrongArmDecisionField.decision.verifier_implementation_id = "wrong-arm-field";
  hostile.push(wrongArmDecisionField);
  const crossBackendField = factorialEvent();
  crossBackendField.filesystem.backend_scope = "local-per-arm-isolated-state";
  hostile.push(crossBackendField);
  const missingBackendSpecificField = factorialEvent();
  delete missingBackendSpecificField.filesystem.backend_implemented;
  hostile.push(missingBackendSpecificField);
  const wrongArmVariant = factorialEvent();
  wrongArmVariant.candidate_variant = "wrong-arm-variant";
  hostile.push(wrongArmVariant);
  const relabelledTaskFamily = factorialEvent();
  relabelledTaskFamily.task_family = "transactional-kv";
  hostile.push(relabelledTaskFamily);

  for (const event of hostile) {
    assert.equal(validateSchema(event), false, `schema accepted hostile event: ${JSON.stringify(event)}`);
    assert.equal(runtimeAccepts(event, event.run_kind ? "factorial" : "smoke"), false);
  }

  // Portable draft-07 cannot express equality between values in separate
  // nested objects. The executable runtime contract is authoritative for
  // scientific relations after structural schema validation.
  const numericEqualityMismatch = factorialEvent();
  numericEqualityMismatch.decision.observations += 1;
  assert.equal(validateSchema(numericEqualityMismatch), true);
  assert.equal(runtimeAccepts(numericEqualityMismatch, "factorial"), false);
});
