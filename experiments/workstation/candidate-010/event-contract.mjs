import { armNames } from "./policies.mjs";

export const CANDIDATE_010_EVENT_CONTRACT_VERSION = "candidate-010-raw-event-v1";

const HASH = /^[0-9a-f]{64}$/;
const FACTORIAL_ID = Object.freeze({
  run_id: /^c010-run-[0-9a-f]{64}$/,
  cluster_id: /^c010-cluster-[0-9a-f]{64}$/,
  pair_id: /^c010-pair-[0-9a-f]{64}$/,
  work_unit_id: /^c010-work-[0-9a-f]{64}$/,
  arm_order_schedule_id: /^c010-arm-order-[0-9a-f]{64}$/,
});

const SMOKE_FIELDS = new Set([
  "schema", "artifact", "profile", "opportunity_id", "seed", "arm",
  "truth_unsafe", "evidence", "trace", "decision", "outcome", "resources",
  "filesystem", "integrity",
]);

const FACTORIAL_FIELDS = new Set([
  "schema", "artifact", "run_kind", "profile", "execution_mode", "run_id",
  "phase", "scenario_id", "scenario_factors", "task_family", "backend_id",
  "backend_implemented", "verifier_id", "cluster_id", "pair_id",
  "work_unit_id", "paired_input_sha256", "arm_order_schedule_id",
  "arm_order_index", "opportunity_id", "seed", "arm", "candidate_variant",
  "truth_unsafe", "evidence", "trace", "decision", "outcome", "budget",
  "resources", "stopping_time_ms", "measurement_interval", "filesystem",
  "privileged_evidence", "comparator_lineage", "integrity",
]);

const SMOKE_DECISION_FIELDS = new Set([
  "abstain", "commit", "reason", "reset", "score", "stage",
]);
const FACTORIAL_DECISION_FIELDS = new Set([
  "abstain", "arm", "commit", "observations", "reason", "reset", "score", "stage", "verifier_calls",
]);
const DECISION_EXTENSION_FIELDS = Object.freeze({
  "independent-verifier": Object.freeze(["verifier_implementation_id"]),
  "retry-rollback": Object.freeze(["first_action_rolled_back", "retry_lifecycle_count"]),
  "reset-coupled": Object.freeze(["policy_variant", "verifier_observed_but_decoupled"]),
});
const SMOKE_OUTCOME_FIELDS = new Set([
  "consequence_weighted_loss", "false_commit", "false_reject", "rollback_violation",
]);
const FACTORIAL_OUTCOME_FIELDS = new Set([...SMOKE_OUTCOME_FIELDS, "irreversible_violation"]);
const SMOKE_RESOURCE_FIELDS = new Set([
  "cpu_elapsed_ms", "durable_bytes_written", "filesystem_boundary_ms", "filesystem_finalize_ms",
  "filesystem_stage_ms", "measured_energy_j", "modeled_energy_j", "observations", "staged_bytes_written",
  "temporary_execution_ms", "verifier_calls",
]);
const FACTORIAL_RESOURCE_FIELDS = new Set([
  "durable_bytes_written", "external_energy", "modeled_energy_j", "observations", "policy_evaluations",
  "staged_bytes_written", "stopping_time_ms", "verifier_calls",
]);
const BUDGET_FIELDS = new Set([
  "arm", "assigned_allowance", "observed", "scenario_id", "unused_is_not_credit", "within_budget",
]);
const BUDGET_MEASURE_FIELDS = new Set([
  "durable_bytes", "observations", "policy_evaluations", "staged_bytes", "verifier_calls", "wall_time_ms",
]);
const FILESYSTEM_FIELDS = Object.freeze({
  "filesystem-publish": Object.freeze([
    "backend_id", "backend_implemented", "boundary", "boundary_elapsed_ms", "commitComplete", "durableExists",
    "durable_bytes_written", "finalize_elapsed_ms", "irreversible_violation", "physical_actuation",
    "rollbackComplete", "stageExists", "stage_elapsed_ms", "staged_bytes_written", "task_family",
    "temporary_execution_elapsed_ms", "trace_output_sha256", "trace_revealed",
  ]),
  "transactional-kv": Object.freeze([
    "backend_id", "backend_scope", "bootstrap_bytes_written", "boundary", "boundary_elapsed_ms", "commitComplete",
    "durableExists", "durable_bytes_after", "durable_bytes_before", "durable_bytes_written",
    "durable_snapshot_post_sha256", "durable_snapshot_pre_sha256", "expected_version", "finalize_elapsed_ms",
    "irreversible_violation", "physical_actuation", "post_state_sha256", "post_version", "pre_state_sha256",
    "pre_version", "proofComplete", "rollbackComplete", "stageExists", "stage_elapsed_ms", "staged_bytes_written",
    "stale_version_refused", "task_family", "temporary_execution_elapsed_ms", "trace_output_sha256",
    "trace_revealed", "transaction_id", "write_set_sha256",
  ]),
  "signed-publication": Object.freeze([
    "appendOnlyRefusalVerified", "backend_id", "boundary", "boundary_elapsed_ms", "commitComplete", "durableExists",
    "durableIntegrityValid", "durable_bytes_written", "envelopeValid", "envelope_sha256", "finalize_elapsed_ms",
    "irreversible_violation", "payload_sha256", "physical_actuation", "publication_sha256", "rollbackComplete",
    "stageExists", "stage_elapsed_ms", "staged_bytes_written", "task_family", "temporary_execution_elapsed_ms",
    "trace_output_sha256", "trace_revealed",
  ]),
  "actuator-command": Object.freeze([
    "backend_id", "boundary", "boundary_elapsed_ms", "command_sha256", "commitComplete", "durableExists",
    "durable_bytes_written", "expected_version", "finalize_elapsed_ms", "irreversible_violation", "journal_entries",
    "journal_sha256", "observed_post_version", "observed_pre_version", "physical_actuation", "post_state_bytes",
    "post_state_sha256", "pre_state_bytes", "pre_state_sha256", "rollbackComplete", "safety_trace_sha256",
    "stageExists", "stage_elapsed_ms", "staged_bytes_written", "stale_version_refused", "task_family",
    "temporary_execution_elapsed_ms", "trace_output_sha256", "trace_revealed",
  ]),
});
const BACKEND_IDS = Object.freeze({
  "filesystem-publish": "filesystem-stage-execute-finalize-v1",
  "transactional-kv": "local-versioned-transactional-kv-v1",
  "signed-publication": "synthetic-signed-publication-v1",
  "actuator-command": "isolated-actuator-command-v1",
});
const BOUNDARY_IDS = Object.freeze({
  "filesystem-publish": "filesystem-stage-execute-finalize-v1",
  "transactional-kv": "local-transactional-kv-stage-validate-finalize-v1",
  "signed-publication": "signed-publication-stage-execute-finalize-v1",
  "actuator-command": "isolated-actuator-stage-dry-run-finalize-v1",
});

function plain(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function nonnegativeFinite(value) {
  return Number.isFinite(value) && value >= 0;
}

function positiveFinite(value) {
  return Number.isFinite(value) && value > 0;
}

function nonnegativeInteger(value) {
  return Number.isSafeInteger(value) && value >= 0;
}

function add(errors, condition, message) {
  if (!condition) errors.push(message);
}

function exactFields(value, expected, label, errors) {
  if (!plain(value)) return;
  const actual = Object.keys(value).sort();
  const wanted = [...expected].sort();
  if (JSON.stringify(actual) !== JSON.stringify(wanted)) {
    const allowed = new Set(wanted);
    const present = new Set(actual);
    const missing = wanted.filter((field) => !present.has(field));
    const unexpected = actual.filter((field) => !allowed.has(field));
    errors.push(`${label} fields are not exact; missing=[${missing.join(",")}], unexpected=[${unexpected.join(",")}]`);
  }
}

function exactTopLevelFields(event, allowed, requireIntegrity, errors) {
  const actual = Object.keys(event).sort();
  const permitted = [...allowed].filter((field) => field !== "integrity" || requireIntegrity).sort();
  const missing = permitted.filter((field) => !(field in event));
  const unexpected = actual.filter((field) => !allowed.has(field) || (!requireIntegrity && field === "integrity"));
  if (missing.length) errors.push(`missing top-level fields: ${missing.join(", ")}`);
  if (unexpected.length) errors.push(`unexpected top-level fields: ${unexpected.join(", ")}`);
}

function validateIntegrity(integrity, errors) {
  add(errors, plain(integrity), "integrity must be an object");
  if (!plain(integrity)) return;
  const keys = Object.keys(integrity).sort();
  add(errors, JSON.stringify(keys) === JSON.stringify(["previous_sha256", "record_sha256", "sequence"]),
    "integrity must contain exactly sequence, previous_sha256, and record_sha256");
  add(errors, nonnegativeInteger(integrity.sequence), "integrity.sequence must be a nonnegative safe integer");
  add(errors, HASH.test(integrity.previous_sha256 ?? ""), "integrity.previous_sha256 must be SHA-256");
  add(errors, HASH.test(integrity.record_sha256 ?? ""), "integrity.record_sha256 must be SHA-256");
}

function validateTrace(event, factorial, errors) {
  const trace = event.trace;
  add(errors, plain(trace), "trace must be an object");
  if (!plain(trace)) return;
  exactFields(trace, new Set(factorial
    ? ["constructed_for_all_arms", "output_sha256", "revealed", "verifier"]
    : ["output_sha256", "revealed", "verifier"]), "trace", errors);
  add(errors, typeof trace.revealed === "boolean", "trace.revealed must be boolean");
  add(errors, HASH.test(trace.output_sha256 ?? ""), "trace.output_sha256 must be SHA-256");
  add(errors, trace.revealed ? Number.isFinite(trace.verifier) : trace.verifier === null,
    "trace.verifier must be finite only when trace.revealed is true");
  if (factorial) add(errors, trace.constructed_for_all_arms === true,
    "factorial trace must declare constructed_for_all_arms=true");
}

function validateDecision(event, factorial, errors) {
  const decision = event.decision;
  add(errors, plain(decision), "decision must be an object");
  if (!plain(decision)) return;
  const expected = factorial
    ? new Set([...FACTORIAL_DECISION_FIELDS, ...(DECISION_EXTENSION_FIELDS[event.arm] ?? [])])
    : SMOKE_DECISION_FIELDS;
  exactFields(decision, expected, "decision", errors);
  for (const field of ["stage", "commit", "reset", "abstain"]) {
    add(errors, typeof decision[field] === "boolean", `decision.${field} must be boolean`);
  }
  add(errors, decision.stage === true, "decision.stage must be true");
  add(errors, decision.commit !== decision.reset, "decision must choose exactly one of commit or reset");
  add(errors, typeof decision.reason === "string" && decision.reason.length > 0,
    "decision.reason must be non-empty");
  add(errors, Number.isFinite(decision.score), "decision.score must be finite");
  if (factorial) {
    add(errors, decision.arm === event.arm, "decision.arm must match event.arm");
    add(errors, nonnegativeInteger(decision.observations), "decision.observations must be nonnegative");
    add(errors, nonnegativeInteger(decision.verifier_calls), "decision.verifier_calls must be nonnegative");
    add(errors, decision.observations === event.resources?.observations,
      "decision.observations must match resources.observations");
    add(errors, decision.verifier_calls === event.resources?.verifier_calls,
      "decision.verifier_calls must match resources.verifier_calls");
  }
  add(errors, !decision.abstain || (event.arm === "selective-abstention" && decision.reset && !decision.commit),
    "abstention must be a selective-abstention reset, never a commit");
  if (factorial && event.arm !== "selective-abstention") {
    add(errors, decision.abstain === false, "only selective-abstention may abstain");
  }
  if (factorial && event.arm === "independent-verifier") {
    add(errors, typeof decision.verifier_implementation_id === "string" && decision.verifier_implementation_id.length > 0,
      "independent-verifier decision must bind its implementation");
  }
  if (factorial && event.arm === "retry-rollback") {
    add(errors, decision.retry_lifecycle_count === 2 && decision.first_action_rolled_back === true,
      "retry-rollback decision must report both lifecycles and the first rollback");
  }
  if (factorial && event.arm === "reset-coupled") {
    add(errors, typeof decision.policy_variant === "string" && decision.policy_variant === event.candidate_variant,
      "reset-coupled policy_variant must match candidate_variant");
    add(errors, typeof decision.verifier_observed_but_decoupled === "boolean",
      "reset-coupled verifier decoupling must be boolean");
  }
}

function validateOutcome(event, factorial, errors) {
  const outcome = event.outcome;
  add(errors, plain(outcome), "outcome must be an object");
  if (!plain(outcome)) return;
  exactFields(outcome, factorial ? FACTORIAL_OUTCOME_FIELDS : SMOKE_OUTCOME_FIELDS, "outcome", errors);
  for (const field of ["false_commit", "false_reject", "rollback_violation"]) {
    add(errors, typeof outcome[field] === "boolean", `outcome.${field} must be boolean`);
  }
  add(errors, nonnegativeFinite(outcome.consequence_weighted_loss),
    "outcome.consequence_weighted_loss must be nonnegative and finite");
  const expectedFalseCommit = Boolean(event.decision?.commit && event.truth_unsafe);
  const expectedFalseReject = Boolean(!event.decision?.commit && !event.truth_unsafe);
  add(errors, outcome.false_commit === expectedFalseCommit,
    "outcome.false_commit must be derived from truth and commit");
  add(errors, outcome.false_reject === expectedFalseReject,
    "outcome.false_reject must be derived from truth and commit");
  const anyError = expectedFalseCommit || expectedFalseReject;
  add(errors, anyError ? outcome.consequence_weighted_loss > 0 : outcome.consequence_weighted_loss === 0,
    "consequence_weighted_loss must agree with the derived error indicators");
  if (factorial) add(errors, outcome.irreversible_violation === false,
    "factorial outcome.irreversible_violation must be exactly false");
}

function validateResources(event, factorial, errors) {
  const resources = event.resources;
  add(errors, plain(resources), "resources must be an object");
  if (!plain(resources)) return;
  exactFields(resources, factorial ? FACTORIAL_RESOURCE_FIELDS : SMOKE_RESOURCE_FIELDS, "resources", errors);
  for (const field of ["observations", "verifier_calls", "durable_bytes_written", "staged_bytes_written"]) {
    add(errors, nonnegativeInteger(resources[field]), `resources.${field} must be a nonnegative safe integer`);
  }
  add(errors, positiveFinite(resources.modeled_energy_j), "resources.modeled_energy_j must be positive and finite");
  if (factorial) {
    add(errors, nonnegativeInteger(resources.policy_evaluations),
      "resources.policy_evaluations must be a nonnegative safe integer");
    add(errors, nonnegativeFinite(resources.stopping_time_ms),
      "resources.stopping_time_ms must be nonnegative and finite");
    add(errors, resources.external_energy === null,
      "factorial resources.external_energy must remain null before interval binding");
  } else {
    for (const field of [
      "cpu_elapsed_ms", "filesystem_stage_ms", "temporary_execution_ms",
      "filesystem_finalize_ms", "filesystem_boundary_ms",
    ]) add(errors, nonnegativeFinite(resources[field]), `resources.${field} must be nonnegative and finite`);
    add(errors, resources.measured_energy_j === null,
      "smoke resources.measured_energy_j must remain null");
  }
}

function validateBudget(event, errors) {
  const budget = event.budget;
  add(errors, plain(budget), "factorial budget must be an object");
  if (!plain(budget)) return;
  exactFields(budget, BUDGET_FIELDS, "budget", errors);
  add(errors, budget.scenario_id === event.scenario_id, "budget.scenario_id must match the event");
  add(errors, budget.arm === event.arm, "budget.arm must match the event");
  add(errors, budget.unused_is_not_credit === true, "budget.unused_is_not_credit must be true");
  add(errors, budget.within_budget === true, "budget.within_budget must be true");
  for (const field of ["assigned_allowance", "observed"]) {
    add(errors, plain(budget[field]), `budget.${field} must be an object`);
    if (!plain(budget[field])) continue;
    exactFields(budget[field], BUDGET_MEASURE_FIELDS, `budget.${field}`, errors);
    for (const name of BUDGET_MEASURE_FIELDS) {
      add(errors, nonnegativeFinite(budget[field][name]), `budget.${field}.${name} must be nonnegative and finite`);
    }
  }
  const observed = budget.observed;
  if (!plain(observed)) return;
  const relations = {
    observations: event.resources?.observations,
    verifier_calls: event.resources?.verifier_calls,
    policy_evaluations: event.resources?.policy_evaluations,
    staged_bytes: event.resources?.staged_bytes_written,
    durable_bytes: event.resources?.durable_bytes_written,
    wall_time_ms: event.resources?.stopping_time_ms,
  };
  for (const [name, resource] of Object.entries(relations)) {
    add(errors, observed[name] === resource, `budget.observed.${name} must match resources`);
    add(errors, !plain(budget.assigned_allowance) || observed[name] <= budget.assigned_allowance[name],
      `budget.observed.${name} must not exceed its allowance`);
  }
}

function validateFilesystemRelations(event, factorial, errors) {
  const filesystem = event.filesystem;
  add(errors, plain(filesystem), "filesystem must be an object");
  if (!plain(filesystem)) return;
  const taskFamily = factorial ? event.task_family : "filesystem-publish";
  const expectedFields = FILESYSTEM_FIELDS[taskFamily];
  add(errors, Array.isArray(expectedFields), `unknown filesystem task family: ${taskFamily}`);
  if (Array.isArray(expectedFields)) {
    exactFields(filesystem, new Set([
      ...expectedFields,
      ...(factorial && event.arm === "retry-rollback" ? ["retry_rollback_lifecycle"] : []),
    ]), "filesystem", errors);
  }
  add(errors, filesystem.physical_actuation === false,
    "filesystem.physical_actuation must be exactly false");
  add(errors, filesystem.irreversible_violation === false,
    "filesystem.irreversible_violation must be exactly false");
  add(errors, HASH.test(filesystem.trace_output_sha256 ?? ""),
    "filesystem.trace_output_sha256 must be SHA-256");
  add(errors, event.trace?.output_sha256 === filesystem.trace_output_sha256,
    "trace digest must match the filesystem trace digest");
  add(errors, event.trace?.revealed === filesystem.trace_revealed,
    "trace revelation must match the filesystem boundary");
  add(errors, event.resources?.staged_bytes_written === filesystem.staged_bytes_written,
    "staged-byte accounting must match the filesystem boundary");
  add(errors, event.resources?.durable_bytes_written === filesystem.durable_bytes_written,
    "durable-byte accounting must match the filesystem boundary");
  add(errors, typeof filesystem.rollbackComplete === "boolean",
    "filesystem.rollbackComplete must be boolean");
  add(errors, typeof filesystem.commitComplete === "boolean",
    "filesystem.commitComplete must be boolean");
  add(errors, filesystem.rollbackComplete === event.decision?.reset,
    "filesystem.rollbackComplete must exactly match the reset decision");
  add(errors, filesystem.commitComplete === event.decision?.commit,
    "filesystem.commitComplete must exactly match the commit decision");
  add(errors, filesystem.stageExists === false, "filesystem.stageExists must be false after finalization");
  add(errors, filesystem.task_family === taskFamily, "filesystem.task_family must match the registered task family");
  add(errors, filesystem.backend_id === BACKEND_IDS[taskFamily], "filesystem.backend_id must match the registered backend");
  const expectedBoundary = factorial && event.arm === "retry-rollback"
    ? "retry-rollback-two-lifecycle-v1"
    : BOUNDARY_IDS[taskFamily];
  add(errors, filesystem.boundary === expectedBoundary, "filesystem.boundary must match the registered lifecycle");
  for (const field of ["boundary_elapsed_ms", "finalize_elapsed_ms", "stage_elapsed_ms", "temporary_execution_elapsed_ms"]) {
    add(errors, nonnegativeFinite(filesystem[field]), `filesystem.${field} must be nonnegative and finite`);
  }
  for (const field of Object.keys(filesystem).filter((name) => name.endsWith("_sha256"))) {
    if (field === "publication_sha256" && filesystem[field] === null) continue;
    add(errors, HASH.test(filesystem[field] ?? ""), `filesystem.${field} must be SHA-256`);
  }
  add(errors, event.outcome?.rollback_violation === Boolean(event.decision?.reset && filesystem.rollbackComplete !== true),
    "rollback_violation must be derived from the observed reset boundary");
  if (factorial) {
    add(errors, filesystem.task_family === event.task_family,
      "filesystem task_family must match the event");
    add(errors, filesystem.backend_id === event.backend_id,
      "filesystem backend_id must match the event");
    add(errors, event.outcome?.irreversible_violation === false,
      "irreversible_violation must remain false at both event and boundary");
  } else {
    add(errors, filesystem.boundary === "filesystem-stage-execute-finalize-v1",
      "smoke event must cross the registered filesystem boundary");
  }
}

function validateFactorial(event, errors) {
  add(errors, event.run_kind === "factorial-diagnostic-v1", "factorial run_kind is invalid");
  add(errors, ["implementation-test", "development", "confirmation"].includes(event.execution_mode),
    "factorial execution_mode is invalid");
  for (const [field, pattern] of Object.entries(FACTORIAL_ID)) {
    add(errors, pattern.test(event[field] ?? ""), `${field} has an invalid identity`);
  }
  add(errors, HASH.test(event.paired_input_sha256 ?? ""), "paired_input_sha256 must be SHA-256");
  add(errors, typeof event.scenario_id === "string" && event.scenario_id.length > 0,
    "scenario_id must be non-empty");
  add(errors, plain(event.scenario_factors), "scenario_factors must be an object");
  for (const field of ["phase", "task_family", "backend_id", "verifier_id"]) {
    add(errors, typeof event[field] === "string" && event[field].length > 0, `${field} must be non-empty`);
  }
  add(errors, event.backend_implemented === true, "backend_implemented must be true");
  add(errors, event.privileged_evidence === false, "privileged_evidence must be false");
  add(errors, nonnegativeInteger(event.arm_order_index), "arm_order_index must be nonnegative");
  add(errors, event.arm === "reset-coupled"
    ? (typeof event.candidate_variant === "string" && event.candidate_variant.length > 0)
    : event.candidate_variant === null,
  "candidate_variant must exist only for reset-coupled records");
  add(errors, event.comparator_lineage === null || plain(event.comparator_lineage),
    "comparator_lineage must be null or an object");
  add(errors, nonnegativeFinite(event.stopping_time_ms), "stopping_time_ms must be nonnegative and finite");
  add(errors, event.resources?.stopping_time_ms === event.stopping_time_ms,
    "stopping_time_ms must match resource accounting");
  validateBudget(event, errors);
  const interval = event.measurement_interval;
  const started = Date.parse(interval?.started_at);
  const ended = Date.parse(interval?.ended_at);
  add(errors, plain(interval) && interval.clock_id === "node-system-wall-clock-utc-v1",
    "measurement_interval must use the registered UTC clock");
  if (plain(interval)) exactFields(interval, new Set(["clock_id", "ended_at", "started_at"]), "measurement_interval", errors);
  add(errors, Number.isFinite(started) && Number.isFinite(ended) && ended > started,
    "measurement_interval must have positive ordered UTC instants");
}

export class Candidate010EventContractError extends Error {
  constructor(errors) {
    super(`Candidate 010 raw event contract failed:\n- ${errors.join("\n- ")}`);
    this.name = "Candidate010EventContractError";
    this.code = "CANDIDATE_010_EVENT_CONTRACT_INVALID";
    this.errors = Object.freeze([...errors]);
  }
}

export function assertCandidate010RawEvent(event, {
  requireIntegrity = true,
  expectedKind = null,
} = {}) {
  const errors = [];
  add(errors, plain(event), "event must be an object");
  if (!plain(event)) throw new Candidate010EventContractError(errors);
  const factorial = event.run_kind === "factorial-diagnostic-v1";
  const kind = factorial ? "factorial" : "smoke";
  if (event.run_kind !== undefined && !factorial) errors.push(`unsupported run_kind: ${event.run_kind}`);
  if (expectedKind !== null && expectedKind !== kind) errors.push(`expected ${expectedKind} event; received ${kind}`);
  exactTopLevelFields(event, factorial ? FACTORIAL_FIELDS : SMOKE_FIELDS, requireIntegrity, errors);
  add(errors, event.schema === 1, "schema must equal 1");
  add(errors, event.artifact === "candidate-010", "artifact must equal candidate-010");
  add(errors, typeof event.profile === "string" && event.profile.length > 0, "profile must be non-empty");
  add(errors, typeof event.opportunity_id === "string" && event.opportunity_id.length > 0,
    "opportunity_id must be non-empty");
  add(errors, nonnegativeInteger(event.seed), "seed must be a nonnegative safe integer");
  add(errors, armNames.includes(event.arm), `unknown Candidate 010 arm: ${event.arm}`);
  add(errors, typeof event.truth_unsafe === "boolean", "truth_unsafe must be boolean");
  add(errors, Array.isArray(event.evidence) && event.evidence.length >= 2
    && event.evidence.every(Number.isFinite), "evidence must contain at least two finite numbers");
  validateTrace(event, factorial, errors);
  validateDecision(event, factorial, errors);
  validateOutcome(event, factorial, errors);
  validateResources(event, factorial, errors);
  validateFilesystemRelations(event, factorial, errors);
  if (factorial) validateFactorial(event, errors);
  if (requireIntegrity) validateIntegrity(event.integrity, errors);
  if (errors.length) throw new Candidate010EventContractError(errors);
  return true;
}
