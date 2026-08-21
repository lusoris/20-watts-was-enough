import { createHash } from "node:crypto";
import { access, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { performance } from "node:perf_hooks";
import {
  executeIndependentVerifier,
  validateIndependentVerifierLineage,
} from "./independent-verifier.mjs";
import {
  BACKEND_METADATA,
  backendForTaskFamily,
  executeBackendTrial,
} from "./backend-registry.mjs";
import {
  openCheckpointLedger,
  remainingWorkUnits,
} from "./checkpoint.mjs";
import {
  accountEqualBudget,
  TASK_FAMILIES,
  validateEqualBudgetAssignments,
} from "./factorial-design.mjs";
import { generateOpportunities } from "./generator.mjs";
import { decide, scoreDecision, shouldRevealTrace } from "./policies.mjs";
import {
  executeRetryRollbackComparatorTrial,
  validateRetryRollbackResult,
} from "./retry-rollback-comparator.mjs";
import { openFrozenSeedRelease } from "./release-contract.mjs";
import { acquireRunLock } from "./run-lock.mjs";
import { captureCandidate010SourceBundle } from "./source-bundle.mjs";

export const FACTORIAL_RUNNER_VERSION = "candidate-010-factorial-runner-v2";
const repositoryRoot = path.resolve(
  path.dirname(new URL(import.meta.url).pathname.replace(/^\/(.:)/, "$1")),
  "..",
  "..",
  "..",
);

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

const taskFamilyById = new Map(TASK_FAMILIES.map((family) => [family.id, family]));

function assertCanonicalScenarioBinding(scenario) {
  const family = taskFamilyById.get(scenario?.task_family);
  if (!family) throw new Error(`Unknown scenario task family: ${scenario?.task_family}`);
  const backend = backendForTaskFamily(family.id);
  if (
    scenario.split !== family.split
    || scenario.backend !== family.backend
    || scenario.backend_implemented !== true
    || scenario.required_adapter !== family.adapter
    || scenario.factors?.task_family !== family.id
    || scenario.execution_contract?.backend_implemented !== true
    || backend.backend_id !== family.backend
    || backend.adapter_filename !== family.adapter
  ) {
    throw new Error(`Scenario is not canonically bound to its task family: ${scenario?.id}`);
  }
  return backend;
}

function clusterIdFor(runId, taskFamily, seed) {
  return `c010-cluster-${sha256(canonical({
    schema: 1,
    run_id: runId,
    task_family: taskFamily,
    seed,
  }))}`;
}

export function deriveFactorialRecordIdentities(record) {
  const clusterId = clusterIdFor(record.run_id, record.task_family, record.seed);
  const pairBasis = {
    schema: 1,
    run_id: record.run_id,
    phase: record.phase,
    scenario_id: record.scenario_id,
    scenario_factors: record.scenario_factors,
    task_family: record.task_family,
    backend_id: record.backend_id,
    verifier_id: record.verifier_id,
    cluster_id: clusterId,
    opportunity_id: record.opportunity_id,
    seed: record.seed,
    arm_order_schedule_id: record.arm_order_schedule_id,
  };
  const pairId = `c010-pair-${sha256(canonical(pairBasis))}`;
  const pairedInputSha256 = sha256(canonical({
    ...pairBasis,
    truth_unsafe: record.truth_unsafe,
    evidence: record.evidence,
  }));
  const workUnitId = `c010-work-${sha256(canonical({
    schema: 1,
    pair_id: pairId,
    arm: record.arm,
    arm_order_index: record.arm_order_index,
  }))}`;
  return {
    cluster_id: clusterId,
    pair_id: pairId,
    work_unit_id: workUnitId,
    paired_input_sha256: pairedInputSha256,
  };
}

function identityWorkKey(identities) {
  return [
    identities.cluster_id,
    identities.pair_id,
    identities.work_unit_id,
    identities.paired_input_sha256,
  ].join("\u0000");
}

function assertRecordIdentities(record) {
  const expected = deriveFactorialRecordIdentities(record);
  for (const field of ["cluster_id", "pair_id", "work_unit_id", "paired_input_sha256"]) {
    if (record[field] !== expected[field]) {
      throw new Error(`Factorial ${field} identity mismatch: ${record[field] ?? "missing"}`);
    }
  }
  return expected;
}

async function loadJson(file) {
  return JSON.parse(await readFile(file, "utf8"));
}

async function loadOptionalJson(file) {
  try {
    return await loadJson(file);
  } catch (error) {
    if (error.code === "ENOENT") return null;
    throw error;
  }
}

async function assertNewDirectory(directory) {
  try {
    await access(directory);
    throw new Error(`Output directory already exists; append-only runs cannot overwrite it: ${directory}`);
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
  await mkdir(directory, { recursive: true });
}

function mergeScenarioConfig(config, scenario) {
  return {
    ...config,
    ...scenario.config_overlay,
    modeled_energy_j: {
      ...config.modeled_energy_j,
      ...(scenario.config_overlay?.modeled_energy_j ?? {}),
    },
  };
}

function workKey(event) {
  return identityWorkKey(assertRecordIdentities(event));
}

export function factorialScientificPayload(event) {
  return {
    schema: event.schema,
    artifact: event.artifact,
    run_kind: event.run_kind,
    profile: event.profile,
    execution_mode: event.execution_mode,
    run_id: event.run_id,
    phase: event.phase,
    scenario_id: event.scenario_id,
    scenario_factors: event.scenario_factors,
    task_family: event.task_family,
    backend_id: event.backend_id,
    backend_implemented: event.backend_implemented,
    verifier_id: event.verifier_id,
    cluster_id: event.cluster_id,
    pair_id: event.pair_id,
    work_unit_id: event.work_unit_id,
    paired_input_sha256: event.paired_input_sha256,
    arm_order_schedule_id: event.arm_order_schedule_id,
    arm_order_index: event.arm_order_index,
    opportunity_id: event.opportunity_id,
    seed: event.seed,
    arm: event.arm,
    candidate_variant: event.candidate_variant,
    truth_unsafe: event.truth_unsafe,
    evidence: event.evidence,
    trace: event.trace,
    decision: event.decision,
    outcome: event.outcome,
    budget: event.budget,
    resources: event.resources,
    measurement_interval: event.measurement_interval,
    filesystem: event.filesystem,
    privileged_evidence: event.privileged_evidence,
    comparator_lineage: event.comparator_lineage,
  };
}

function counterbalancedArmOrder({ scenario, seed, opportunity }) {
  const arms = [...scenario.eligible_arms];
  const basis = sha256(canonical({
    schema: 1,
    scenario_id: scenario.id,
    task_family: scenario.task_family,
    seed,
  }));
  const baseRotation = Number.parseInt(basis.slice(0, 8), 16) % arms.length;
  const block = Math.floor(opportunity.index / arms.length);
  const reverse = (Number.parseInt(basis.slice(8, 10), 16) + block) % 2 === 1;
  const oriented = reverse ? [...arms].reverse() : arms;
  const rotation = (baseRotation + opportunity.index) % arms.length;
  const orderedArms = [...oriented.slice(rotation), ...oriented.slice(0, rotation)];
  const scheduleId = `c010-arm-order-${sha256(canonical({
    schema: 1,
    scenario_id: scenario.id,
    task_family: scenario.task_family,
    seed,
    opportunity_id: opportunity.id,
    ordered_arms: orderedArms,
  }))}`;
  return { orderedArms, scheduleId };
}

export function* factorialWorkUnits({ scenarios, seeds, config, runId }) {
  if (!/^c010-run-[0-9a-f]{64}$/.test(runId ?? "")) {
    throw new Error("Factorial work schedule requires a frozen run_id.");
  }
  const observed = new Set();
  for (const scenario of scenarios) {
    const scenarioConfig = mergeScenarioConfig(config, scenario);
    const backend = assertCanonicalScenarioBinding(scenario);
    for (const seed of seeds) {
      for (const opportunity of generateOpportunities(scenarioConfig, seed)) {
        const taskOpportunity = { ...opportunity, task_family: scenario.task_family };
        const verifierId = `candidate-010-${scenario.factors.verifier_informativeness}-v1`;
        const armOrder = counterbalancedArmOrder({ scenario, seed, opportunity });
        for (const [armOrderIndex, arm] of armOrder.orderedArms.entries()) {
          const identities = deriveFactorialRecordIdentities({
            run_id: runId,
            phase: scenario.split,
            scenario_id: scenario.id,
            scenario_factors: scenario.factors,
            task_family: scenario.task_family,
            backend_id: backend.backend_id,
            verifier_id: verifierId,
            opportunity_id: opportunity.id,
            seed,
            arm,
            truth_unsafe: opportunity.unsafe,
            evidence: opportunity.evidence,
            arm_order_schedule_id: armOrder.scheduleId,
            arm_order_index: armOrderIndex,
          });
          const key = identityWorkKey(identities);
          if (observed.has(key)) throw new Error(`Factorial schedule produced duplicate work unit: ${key}`);
          observed.add(key);
          yield {
            key,
            scenario,
            scenarioConfig,
            backend,
            seed,
            opportunity: taskOpportunity,
            arm,
            verifierId,
            identities,
            armOrderScheduleId: armOrder.scheduleId,
            armOrderIndex,
          };
        }
      }
    }
  }
}

function candidatePolicy(scenario) {
  const traceEnabled = scenario.execution_contract.reveal_trace_to_candidate === true;
  const verifierCoupled = scenario.execution_contract.verifier_coupled_to_finalization === true;
  if (traceEnabled && verifierCoupled) return "verifier-coupled-finalization-v1";
  if (traceEnabled) return "verifier-observed-finalization-decoupled-v1";
  if (verifierCoupled) return "verifier-withheld-coupling-unobservable-v1";
  return "verifier-withheld-finalization-decoupled-v1";
}

function decisionContract({ arm, scenario, policyOpportunity, scenarioConfig }) {
  if (arm === "independent-verifier") {
    const independent = executeIndependentVerifier({ opportunity: policyOpportunity, config: scenarioConfig });
    return {
      revealTrace: false,
      candidateVariant: null,
      comparatorLineage: independent.lineage,
      decideWithTrace: () => ({
        ...decide("independent-verifier", policyOpportunity, scenarioConfig, independent.value),
        verifier_implementation_id: independent.lineage.implementation_id,
      }),
    };
  }
  if (arm !== "reset-coupled") {
    const revealTrace = shouldRevealTrace(arm, policyOpportunity, scenarioConfig);
    return {
      revealTrace,
      candidateVariant: null,
      decideWithTrace: (revealedVerifier) => decide(arm, policyOpportunity, scenarioConfig, revealedVerifier),
    };
  }

  const candidateVariant = candidatePolicy(scenario);
  const traceEnabled = scenario.execution_contract.reveal_trace_to_candidate === true;
  const verifierCoupled = scenario.execution_contract.verifier_coupled_to_finalization === true;
  const revealTrace = traceEnabled && shouldRevealTrace("reset-coupled", policyOpportunity, scenarioConfig);
  const policyArm = traceEnabled && verifierCoupled ? "reset-coupled" : "reset-coupled-no-trace";
  return {
    revealTrace,
    candidateVariant,
    decideWithTrace: (revealedVerifier) => {
      const decision = decide(policyArm, policyOpportunity, scenarioConfig, revealedVerifier);
      const observedButDecoupled = revealTrace && !verifierCoupled;
      return {
        ...decision,
        arm: "reset-coupled",
        policy_variant: candidateVariant,
        verifier_calls: observedButDecoupled ? 1 : decision.verifier_calls,
        observations: observedButDecoupled ? Math.max(3, decision.observations) : decision.observations,
        verifier_observed_but_decoupled: observedButDecoupled,
      };
    },
  };
}

function expectedRecordCount({ scenarios, seeds, config }) {
  return scenarios.reduce(
    (sum, scenario) => sum + seeds.length * config.opportunities_per_seed * scenario.eligible_arms.length,
    0,
  );
}

function provenanceIdentity({
  config,
  seeds,
  scenarios,
  executionMode,
  sourceBundle,
  releaseAuthority = null,
}) {
  const frozen = {
    runner: FACTORIAL_RUNNER_VERSION,
    execution_mode: executionMode,
    config_sha256: sha256(canonical(config)),
    ordered_seed_pack_sha256: sha256(canonical(seeds)),
    design_sha256: sha256(canonical(scenarios)),
    backend_registry_sha256: sha256(canonical(BACKEND_METADATA)),
    source_bundle_sha256: sourceBundle.source_sha256,
    source_commit: sourceBundle.vcs.source_commit,
    frozen_release: releaseAuthority === null ? null : {
      release_sha256: releaseAuthority.release_sha256,
      seed_commitment: releaseAuthority.seed_pack.commitment,
      partition: releaseAuthority.partition,
      release_version: releaseAuthority.release_version,
    },
    schedule: "cluster-pair-work-unit-v2",
  };
  return {
    ...frozen,
    run_id: `c010-run-${sha256(canonical(frozen))}`,
  };
}

async function positiveUtcEnd(startedAtMilliseconds) {
  let endedAtMilliseconds = Date.now();
  while (endedAtMilliseconds <= startedAtMilliseconds) {
    await new Promise((resolve) => setImmediate(resolve));
    endedAtMilliseconds = Date.now();
  }
  return endedAtMilliseconds;
}

function measurementIntervalError(interval) {
  const pattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/;
  if (
    !interval
    || !pattern.test(interval.started_at ?? "")
    || !pattern.test(interval.ended_at ?? "")
    || interval.clock_id !== "node-system-wall-clock-utc-v1"
  ) return "measurement interval lacks explicit UTC instants or the registered clock identity";
  const started = Date.parse(interval.started_at);
  const ended = Date.parse(interval.ended_at);
  if (!Number.isFinite(started) || !Number.isFinite(ended) || ended <= started) {
    return "measurement interval is not strictly positive";
  }
  return null;
}

function isolatedUnitRoot(boundariesDirectory, workUnitKey) {
  const boundaryRoot = path.resolve(boundariesDirectory);
  const unitRoot = path.resolve(boundaryRoot, sha256(workUnitKey));
  const relative = path.relative(boundaryRoot, unitRoot);
  if (!relative || relative.startsWith("..") || path.isAbsolute(relative)) {
    throw new Error("Factorial unit boundary escaped its declared root.");
  }
  return unitRoot;
}

function assertExecutionMode(scenarios, executionMode) {
  const includesConfirmation = scenarios.some((scenario) => scenario.split === "confirmation");
  if (includesConfirmation && !new Set(["implementation-test", "confirmation"]).has(executionMode)) {
    throw new Error("Confirmation task families require a fresh frozen seed release; only implementation-test may exercise them before that release.");
  }
  if (!new Set(["development", "validation", "confirmation", "implementation-test"]).has(executionMode)) {
    throw new Error(`Unsupported factorial execution mode: ${executionMode}`);
  }
  if (
    executionMode !== "implementation-test"
    && scenarios.some((scenario) => scenario.split !== executionMode)
  ) {
    throw new Error(`Factorial execution mode ${executionMode} does not own every requested scenario split.`);
  }
}

function boundReleasePath(releaseRoot, relative) {
  const root = path.resolve(releaseRoot);
  const resolved = path.resolve(root, ...String(relative).replaceAll("\\", "/").split("/"));
  const relation = path.relative(root, resolved);
  if (!relation || relation === ".." || relation.startsWith(`..${path.sep}`) || path.isAbsolute(relation)) {
    throw new Error(`Frozen release binding escapes its root: ${relative}`);
  }
  return resolved;
}

async function openConfirmationAuthority({ release, config, scenarios, sourceBundle }) {
  if (!release || typeof release !== "object") {
    throw new Error("Confirmation execution requires a frozen release contract, not raw seeds.");
  }
  if (typeof release.releasePath !== "string" || release.releasePath.trim() === "") {
    throw new Error("Confirmation execution requires a frozen release path.");
  }
  const releaseRoot = path.resolve(release.root ?? repositoryRoot);
  const releasePath = path.resolve(release.releasePath ?? "");
  const opened = await openFrozenSeedRelease({
    root: releaseRoot,
    releasePath,
    expectedPartition: "confirmation",
    phase: "confirmation",
    disjointWith: release.disjointWith,
  });
  if (
    opened.source_identity.source_sha256 !== sourceBundle.source_sha256
    || opened.source_identity.source_commit !== sourceBundle.vcs.source_commit
  ) {
    throw new Error("Frozen release source authority does not match the executable runner source bundle.");
  }
  const releaseDocument = await loadJson(releasePath);
  const [boundConfig, boundDesign] = await Promise.all([
    loadJson(boundReleasePath(releaseRoot, releaseDocument.bindings.config.path)),
    loadJson(boundReleasePath(releaseRoot, releaseDocument.bindings.design.path)),
  ]);
  if (canonical(boundConfig) !== canonical(config)) {
    throw new Error("Frozen release config binding does not match the requested confirmation config.");
  }
  if (canonical(boundDesign) !== canonical({ scenarios })) {
    throw new Error("Frozen release design binding does not match the requested confirmation design.");
  }
  return opened;
}

export async function runFactorialExperiment({
  config,
  seeds = null,
  scenarios,
  outputDirectory,
  executionMode = "development",
  release = null,
  frozen_release: callerFrozenRelease,
  resume = false,
  stopAfterRecords = null,
}) {
  if (!Array.isArray(scenarios) || scenarios.length === 0) throw new Error("Factorial execution requires scenarios.");
  if (callerFrozenRelease !== undefined) {
    throw new Error("Caller frozen_release flags have no authority; supply a sealed release contract.");
  }
  if (stopAfterRecords !== null && (!Number.isInteger(stopAfterRecords) || stopAfterRecords < 1)) {
    throw new Error("stopAfterRecords must be a positive integer when supplied.");
  }
  for (const scenario of scenarios) assertCanonicalScenarioBinding(scenario);
  assertExecutionMode(scenarios, executionMode);
  const sourceBundle = await captureCandidate010SourceBundle(repositoryRoot);
  let releaseAuthority = null;
  let executionSeeds = seeds;
  if (executionMode === "confirmation") {
    if (seeds !== null && seeds !== undefined) {
      throw new Error("Confirmation execution refuses raw caller-provided seeds.");
    }
    releaseAuthority = await openConfirmationAuthority({ release, config, scenarios, sourceBundle });
    executionSeeds = releaseAuthority.seeds;
  } else {
    if (release !== null) throw new Error("Frozen release contracts are only accepted in confirmation execution mode.");
    if (!Array.isArray(executionSeeds) || executionSeeds.length === 0) {
      throw new Error("Factorial execution requires seeds.");
    }
  }
  const runLock = await acquireRunLock({
    outputDirectory,
    runnerId: `${FACTORIAL_RUNNER_VERSION}:execute`,
  });
  try {
    if (resume) await access(outputDirectory);
    else await assertNewDirectory(outputDirectory);

  const rawDirectory = path.join(outputDirectory, "raw");
  const provenanceDirectory = path.join(outputDirectory, "provenance");
  const boundariesDirectory = path.join(outputDirectory, "boundaries");
  await mkdir(rawDirectory, { recursive: true });
  await mkdir(provenanceDirectory, { recursive: true });
  await mkdir(boundariesDirectory, { recursive: true });
  const rawPath = path.join(rawDirectory, "events.ndjson");
  const checkpointPath = path.join(provenanceDirectory, "checkpoint.json");
  const runPath = path.join(provenanceDirectory, "run.json");
  const configPath = path.join(provenanceDirectory, "config.json");
  const seedsPath = path.join(provenanceDirectory, "seeds.json");
  const designPath = path.join(provenanceDirectory, "factorial-design.json");
  const environmentPath = path.join(provenanceDirectory, "environment.json");
  const sourceBundlePath = path.join(provenanceDirectory, "source-bundle.json");
  const identity = provenanceIdentity({
    config,
    seeds: executionSeeds,
    scenarios,
    executionMode,
    sourceBundle,
    releaseAuthority,
  });
  const seedProvenance = releaseAuthority === null
    ? { seeds: executionSeeds }
    : {
        partition: releaseAuthority.partition,
        release_version: releaseAuthority.release_version,
        release_sha256: releaseAuthority.release_sha256,
        seed_commitment: releaseAuthority.seed_pack.commitment,
        seeds: executionSeeds,
      };
  let environment;

  if (resume) {
    const [existingConfig, existingSeeds, existingDesign, existingSourceBundle] = await Promise.all([
      loadJson(configPath),
      loadJson(seedsPath),
      loadJson(designPath),
      loadJson(sourceBundlePath),
    ]);
    environment = await loadJson(environmentPath);
    if (canonical(existingConfig) !== canonical(config)) throw new Error("Resume config differs from the frozen factorial config.");
    if (canonical(existingSeeds) !== canonical(seedProvenance)) throw new Error("Resume seeds differ from frozen seed/release provenance.");
    if (canonical(existingDesign) !== canonical({ scenarios })) throw new Error("Resume design differs from the frozen factorial design.");
    if (canonical(existingSourceBundle) !== canonical(sourceBundle)) {
      throw new Error("Resume executable source bundle differs from the frozen factorial run.");
    }
  } else {
    environment = {
      node: process.version,
      versions: process.versions,
      platform: process.platform,
      arch: process.arch,
      os_release: os.release(),
      cpus: os.cpus().length,
      run_started_utc: new Date().toISOString(),
      physical_actuation: false,
      measured_energy: null,
      claim_eligible: false,
    };
    await Promise.all([
      writeFile(configPath, `${JSON.stringify(config, null, 2)}\n`, { flag: "wx" }),
      writeFile(seedsPath, `${JSON.stringify(seedProvenance, null, 2)}\n`, { flag: "wx" }),
      writeFile(designPath, `${JSON.stringify({ scenarios }, null, 2)}\n`, { flag: "wx" }),
      writeFile(environmentPath, `${JSON.stringify(environment, null, 2)}\n`, { flag: "wx" }),
      writeFile(sourceBundlePath, `${JSON.stringify(sourceBundle, null, 2)}\n`, { flag: "wx" }),
    ]);
  }

  const ledger = await openCheckpointLedger({
    rawPath,
    checkpointPath,
    scientificPayload: factorialScientificPayload,
    workKey,
    runIdentity: identity,
  });
  const completedRun = await loadOptionalJson(runPath);
  if (completedRun) {
    const state = ledger.summary();
    if (
      completedRun.records !== state.records
      || completedRun.scientific_payload_sha256 !== state.scientific_payload_sha256
      || completedRun.hash_chain_sha256 !== state.hash_chain_sha256
    ) throw new Error("Completed factorial provenance disagrees with the append-only ledger.");
    return { run: completedRun, rawPath, complete: true, resumed: true };
  }

  const schedule = factorialWorkUnits({
    scenarios,
    seeds: executionSeeds,
    config,
    runId: identity.run_id,
  });
  const remaining = remainingWorkUnits(schedule, ledger.completedWorkKeys());
  const checkpointInterval = config.checkpoint_interval_records ?? 32;
  let processedThisInvocation = 0;

  for (const unit of remaining) {
    const {
      key, scenario, scenarioConfig, backend, seed, opportunity, arm, verifierId, identities,
      armOrderScheduleId, armOrderIndex,
    } = unit;
    const unitRoot = isolatedUnitRoot(boundariesDirectory, key);
    // Every opportunity-arm has its own simulated effect boundary. If a process
    // died after local finalization but before ledger append, removing this
    // unledgered directory makes the retry exact and cannot affect prior units.
    await rm(unitRoot, { recursive: true, force: true });
    const intervalStartedAtMilliseconds = Date.now();
    const started = performance.now();
    const policyOpportunity = {
      id: opportunity.id,
      evidence: opportunity.evidence,
      trace_job: opportunity.trace_job,
    };
    const contract = decisionContract({ arm, scenario, policyOpportunity, scenarioConfig });
    const trial = arm === "retry-rollback"
      ? await executeRetryRollbackComparatorTrial({
          executeTrial: executeBackendTrial,
          task_family: scenario.task_family,
          backend_id: backend.backend_id,
          root: unitRoot,
          opportunity,
          config: scenarioConfig,
          decideRetry: () => contract.decideWithTrace(null),
        })
      : await executeBackendTrial({
          task_family: scenario.task_family,
          backend_id: backend.backend_id,
          root: unitRoot,
          opportunity,
          arm,
          config: scenarioConfig,
          revealTrace: contract.revealTrace,
          decideWithTrace: contract.decideWithTrace,
        });
    const { decision, filesystem, revealedVerifier } = trial;
    const policyEvaluations = trial.policy_evaluations ?? 1;
    const comparatorLineage = trial.comparator_lineage ?? contract.comparatorLineage ?? null;
    const intervalEndedAtMilliseconds = await positiveUtcEnd(intervalStartedAtMilliseconds);
    const scored = scoreDecision(opportunity, decision, scenarioConfig);
    const modeledEnergyJ = scored.modeledEnergy + (trial.additional_modeled_energy_j ?? 0);
    const stoppingTimeMs = performance.now() - started;
    const budget = accountEqualBudget({
      scenario,
      arm,
      usage: {
        observations: decision.observations,
        verifier_calls: decision.verifier_calls,
        policy_evaluations: policyEvaluations,
        staged_bytes: filesystem.staged_bytes_written,
        durable_bytes: filesystem.durable_bytes_written,
        wall_time_ms: stoppingTimeMs,
      },
    });
    const event = {
      schema: 1,
      artifact: "candidate-010",
      run_kind: "factorial-diagnostic-v1",
      profile: config.profile,
      execution_mode: executionMode,
      run_id: identity.run_id,
      phase: scenario.split,
      scenario_id: scenario.id,
      scenario_factors: scenario.factors,
      task_family: scenario.task_family,
      backend_id: backend.backend_id,
      backend_implemented: backend.implemented,
      verifier_id: verifierId,
      cluster_id: identities.cluster_id,
      pair_id: identities.pair_id,
      work_unit_id: identities.work_unit_id,
      paired_input_sha256: identities.paired_input_sha256,
      arm_order_schedule_id: armOrderScheduleId,
      arm_order_index: armOrderIndex,
      opportunity_id: opportunity.id,
      seed,
      arm,
      candidate_variant: contract.candidateVariant,
      truth_unsafe: opportunity.unsafe,
      evidence: opportunity.evidence,
      trace: {
        revealed: contract.revealTrace,
        verifier: revealedVerifier,
        output_sha256: filesystem.trace_output_sha256,
        constructed_for_all_arms: true,
      },
      decision,
      outcome: {
        false_commit: scored.falseCommit,
        false_reject: scored.falseReject,
        consequence_weighted_loss: scored.loss,
        rollback_violation: Boolean(decision.reset && filesystem.rollbackComplete !== true),
        irreversible_violation: filesystem.irreversible_violation === true,
      },
      budget,
      resources: {
        observations: decision.observations,
        verifier_calls: decision.verifier_calls,
        policy_evaluations: policyEvaluations,
        modeled_energy_j: modeledEnergyJ,
        external_energy: null,
        durable_bytes_written: filesystem.durable_bytes_written,
        staged_bytes_written: filesystem.staged_bytes_written,
        stopping_time_ms: stoppingTimeMs,
      },
      stopping_time_ms: stoppingTimeMs,
      measurement_interval: {
        started_at: new Date(intervalStartedAtMilliseconds).toISOString(),
        ended_at: new Date(intervalEndedAtMilliseconds).toISOString(),
        clock_id: "node-system-wall-clock-utc-v1",
      },
      filesystem,
      privileged_evidence: false,
      comparator_lineage: comparatorLineage,
    };
    await ledger.append(event);
    processedThisInvocation += 1;
    const state = ledger.summary();
    if (state.records % checkpointInterval === 0) {
      await ledger.saveCheckpoint({ last_completed_work_key: key, complete: false });
    }
    if (stopAfterRecords !== null && state.records >= stopAfterRecords) {
      await ledger.saveCheckpoint({ last_completed_work_key: key, complete: false });
      return {
        run: {
          schema: 1,
          artifact: "candidate-010",
          run_kind: "factorial-diagnostic-v1",
          status: "interrupted-at-declared-test-boundary",
          records: state.records,
          expected_records: expectedRecordCount({ scenarios, seeds: executionSeeds, config }),
          scientific_payload_sha256: state.scientific_payload_sha256,
          hash_chain_sha256: state.hash_chain_sha256,
        },
        rawPath,
        complete: false,
        resumed: resume,
        processed_this_invocation: processedThisInvocation,
      };
    }
  }

  const state = ledger.summary();
  const expectedRecords = expectedRecordCount({ scenarios, seeds: executionSeeds, config });
  if (state.records !== expectedRecords) {
    throw new Error(`Factorial schedule produced ${state.records} records; expected ${expectedRecords}.`);
  }
  await ledger.saveCheckpoint({ complete: true });
  const run = {
    schema: 1,
    artifact: "candidate-010",
    run_kind: "factorial-diagnostic-v1",
    readiness: "smoke-ready",
    execution_mode: executionMode,
    claim_eligible: false,
    interpretation: "Implementation/falsification diagnostic only; fresh frozen seeds, calibrated measurements, and confirmation evidence are absent.",
    profile: config.profile,
    started_utc: environment.run_started_utc,
    completed_utc: new Date().toISOString(),
    seed_count: executionSeeds.length,
    scenario_count: scenarios.length,
    task_families: [...new Set(scenarios.map((scenario) => scenario.task_family))].sort(),
    records: state.records,
    expected_records: expectedRecords,
    scientific_payload_sha256: state.scientific_payload_sha256,
    hash_chain_sha256: state.hash_chain_sha256,
    run_identity: identity,
    measured_energy_j: null,
    physical_actuation: false,
    resume_supported: true,
  };
  await writeFile(runPath, `${JSON.stringify(run, null, 2)}\n`, { flag: "wx" });
    return {
      run,
      rawPath,
      complete: true,
      resumed: resume,
      processed_this_invocation: processedThisInvocation,
    };
  } finally {
    await runLock.release();
  }
}

export async function readFactorialRecords(outputDirectory) {
  const raw = await readFile(path.join(outputDirectory, "raw", "events.ndjson"), "utf8");
  return raw.split(/\r?\n/).filter(Boolean).map((line) => JSON.parse(line));
}

export async function analyzeFactorialRun(outputDirectory) {
  const runLock = await acquireRunLock({
    outputDirectory,
    runnerId: `${FACTORIAL_RUNNER_VERSION}:analyze`,
  });
  try {
    const records = await readFactorialRecords(outputDirectory);
  const byFamilyArm = new Map();
  for (const record of records) {
    const key = `${record.task_family}\u0000${record.arm}`;
    const row = byFamilyArm.get(key) ?? {
      task_family: record.task_family,
      arm: record.arm,
      opportunities: 0,
      false_commits: 0,
      false_rejects: 0,
      irreversible_violations: 0,
      loss: 0,
      modeled_energy_j: 0,
    };
    row.opportunities += 1;
    row.false_commits += Number(record.outcome.false_commit);
    row.false_rejects += Number(record.outcome.false_reject);
    row.irreversible_violations += Number(record.outcome.irreversible_violation);
    row.loss += record.outcome.consequence_weighted_loss;
    row.modeled_energy_j += record.resources.modeled_energy_j;
    byFamilyArm.set(key, row);
  }
  const summary = {
    schema: 1,
    artifact: "candidate-010",
    run_kind: "factorial-diagnostic-v1",
    claim_eligible: false,
    interpretation: "Diagnostic implementation output only; modeled energy is not measured energy and no superiority test is opened.",
    records: records.length,
    task_families: [...new Set(records.map((record) => record.task_family))].sort(),
    rows: [...byFamilyArm.values()].map((row) => ({
      ...row,
      mean_loss: row.loss / row.opportunities,
      false_commit_rate: row.false_commits / row.opportunities,
      false_reject_rate: row.false_rejects / row.opportunities,
    })),
  };
  const analysisDirectory = path.join(outputDirectory, "analysis");
  await mkdir(analysisDirectory, { recursive: true });
  await writeFile(path.join(analysisDirectory, "factorial-summary.json"), `${JSON.stringify(summary, null, 2)}\n`);
    return summary;
  } finally {
    await runLock.release();
  }
}

export async function validateFactorialRun(outputDirectory) {
  const runLock = await acquireRunLock({
    outputDirectory,
    runnerId: `${FACTORIAL_RUNNER_VERSION}:validate`,
  });
  try {
    const provenanceDirectory = path.join(outputDirectory, "provenance");
  const [run, config, seedDocument, designDocument, frozenSourceBundle] = await Promise.all([
    loadJson(path.join(provenanceDirectory, "run.json")),
    loadJson(path.join(provenanceDirectory, "config.json")),
    loadJson(path.join(provenanceDirectory, "seeds.json")),
    loadJson(path.join(provenanceDirectory, "factorial-design.json")),
    loadJson(path.join(provenanceDirectory, "source-bundle.json")),
  ]);
  const currentSourceBundle = await captureCandidate010SourceBundle(repositoryRoot);
  if (canonical(frozenSourceBundle) !== canonical(currentSourceBundle)) {
    throw new Error("Current executable source bundle differs from frozen factorial provenance.");
  }
  const validationReleaseAuthority = run.execution_mode === "confirmation"
    ? {
        release_sha256: seedDocument.release_sha256,
        partition: seedDocument.partition,
        release_version: seedDocument.release_version,
        seed_pack: { commitment: seedDocument.seed_commitment },
      }
    : null;
  const identity = provenanceIdentity({
    config,
    seeds: seedDocument.seeds,
    scenarios: designDocument.scenarios,
    executionMode: run.execution_mode,
    sourceBundle: currentSourceBundle,
    releaseAuthority: validationReleaseAuthority,
  });
  const expectedSchedule = new Map();
  for (const unit of factorialWorkUnits({
    scenarios: designDocument.scenarios,
    seeds: seedDocument.seeds,
    config,
    runId: identity.run_id,
  })) {
    expectedSchedule.set(unit.key, unit);
  }
  const ledger = await openCheckpointLedger({
    rawPath: path.join(outputDirectory, "raw", "events.ndjson"),
    checkpointPath: path.join(provenanceDirectory, "checkpoint.json"),
    scientificPayload: factorialScientificPayload,
    workKey,
    runIdentity: identity,
  });
  const records = await readFactorialRecords(outputDirectory);
  const errors = [];
  const scenarioById = new Map(designDocument.scenarios.map((scenario) => [scenario.id, scenario]));
  const assignments = new Map();
  const assignmentScenarios = new Map();
  const traceHashes = new Map();
  const stagedByteCounts = new Map();
  const pairedInputHashes = new Map();
  const observedSchedule = new Set();
  for (const record of records) {
    const scenario = scenarioById.get(record.scenario_id);
    const assignmentKey = record.pair_id ?? "pair-missing";
    if (!scenario) {
      errors.push(`unknown scenario: ${record.scenario_id}`);
      continue;
    }
    let backend;
    try {
      backend = backendForTaskFamily(record.task_family);
    } catch (error) {
      errors.push(error.message);
      continue;
    }
    let derivedIdentities;
    try {
      derivedIdentities = assertRecordIdentities(record);
    } catch (error) {
      errors.push(error.message);
      continue;
    }
    const exactKey = identityWorkKey(derivedIdentities);
    const expectedUnit = expectedSchedule.get(exactKey);
    if (!expectedUnit) {
      errors.push(`record is not in the frozen factorial schedule: ${record.work_unit_id}`);
    } else {
      const expectedProjection = {
        run_id: identity.run_id,
        phase: expectedUnit.scenario.split,
        scenario_id: expectedUnit.scenario.id,
        scenario_factors: expectedUnit.scenario.factors,
        task_family: expectedUnit.scenario.task_family,
        backend_id: expectedUnit.backend.backend_id,
        verifier_id: expectedUnit.verifierId,
        cluster_id: expectedUnit.identities.cluster_id,
        pair_id: expectedUnit.identities.pair_id,
        work_unit_id: expectedUnit.identities.work_unit_id,
        paired_input_sha256: expectedUnit.identities.paired_input_sha256,
        arm_order_schedule_id: expectedUnit.armOrderScheduleId,
        arm_order_index: expectedUnit.armOrderIndex,
        opportunity_id: expectedUnit.opportunity.id,
        seed: expectedUnit.seed,
        arm: expectedUnit.arm,
        truth_unsafe: expectedUnit.opportunity.unsafe,
        evidence: expectedUnit.opportunity.evidence,
      };
      const observedProjection = Object.fromEntries(
        Object.keys(expectedProjection).map((field) => [field, record[field]]),
      );
      if (canonical(observedProjection) !== canonical(expectedProjection)) {
        errors.push(`record input differs from frozen factorial schedule: ${record.work_unit_id}`);
      }
      observedSchedule.add(exactKey);
    }
    if (record.backend_id !== backend.backend_id || record.filesystem?.backend_id !== backend.backend_id) {
      errors.push(`backend identity mismatch: ${assignmentKey}/${record.arm}`);
    }
    if (
      record.phase !== scenario.split
      || record.filesystem?.task_family !== record.task_family
      || record.backend_implemented !== true
    ) {
      errors.push(`task-family implementation mismatch: ${assignmentKey}/${record.arm}`);
    }
    if (record.filesystem?.physical_actuation !== false || record.outcome?.irreversible_violation !== false) {
      errors.push(`forbidden effect or irreversible violation: ${assignmentKey}/${record.arm}`);
    }
    if (record.decision?.stage !== true || record.decision?.commit === record.decision?.reset) {
      errors.push(`invalid stage/finalization decision: ${assignmentKey}/${record.arm}`);
    }
    if (record.decision?.commit && record.filesystem?.commitComplete !== true) {
      errors.push(`incomplete commit proof: ${assignmentKey}/${record.arm}`);
    }
    if (record.decision?.reset && record.filesystem?.rollbackComplete !== true) {
      errors.push(`incomplete rollback proof: ${assignmentKey}/${record.arm}`);
    }
    if (record.trace?.output_sha256 !== record.filesystem?.trace_output_sha256) {
      errors.push(`trace digest mismatch: ${assignmentKey}/${record.arm}`);
    }
    if (record.arm === "independent-verifier") {
      try {
        validateIndependentVerifierLineage(record.comparator_lineage);
        if (
          record.trace?.revealed !== false
          || record.trace?.verifier !== null
          || record.decision?.verifier_implementation_id !== record.comparator_lineage.implementation_id
        ) throw new Error("backend trace was reused or independent implementation identity is absent");
      } catch (error) {
        errors.push(`independent-verifier implementation invalid: ${assignmentKey}: ${error.message}`);
      }
    }
    if (record.arm === "retry-rollback") {
      try {
        validateRetryRollbackResult({
          decision: record.decision,
          filesystem: record.filesystem,
          policy_evaluations: record.resources?.policy_evaluations,
          comparator_lineage: record.comparator_lineage,
        }, {
          task_family: record.task_family,
          backend_id: record.backend_id,
          opportunity_id: record.opportunity_id,
        });
      } catch (error) {
        errors.push(`retry/rollback lifecycle invalid: ${assignmentKey}: ${error.message}`);
      }
    }
    const observedBudget = record.budget?.observed;
    if (
      observedBudget?.observations !== record.resources?.observations
      || observedBudget?.verifier_calls !== record.resources?.verifier_calls
      || observedBudget?.policy_evaluations !== record.resources?.policy_evaluations
      || observedBudget?.staged_bytes !== record.filesystem?.staged_bytes_written
      || observedBudget?.durable_bytes !== record.filesystem?.durable_bytes_written
      || observedBudget?.wall_time_ms !== record.resources?.stopping_time_ms
    ) {
      errors.push(`budget observation does not match raw resources: ${assignmentKey}/${record.arm}`);
    }
    const intervalError = measurementIntervalError(record.measurement_interval);
    if (intervalError) errors.push(`${intervalError}: ${record.work_unit_id}`);
    const assignment = assignments.get(assignmentKey) ?? [];
    assignment.push(record.budget);
    assignments.set(assignmentKey, assignment);
    assignmentScenarios.set(assignmentKey, scenario);
    const hashes = traceHashes.get(assignmentKey) ?? new Set();
    hashes.add(record.trace?.output_sha256);
    traceHashes.set(assignmentKey, hashes);
    const byteCounts = stagedByteCounts.get(assignmentKey) ?? new Set();
    const comparableStagedBytes = record.arm === "retry-rollback"
      ? record.comparator_lineage?.attempts?.[1]?.staged_bytes_written
      : record.filesystem?.staged_bytes_written;
    byteCounts.add(comparableStagedBytes);
    stagedByteCounts.set(assignmentKey, byteCounts);
    const inputs = pairedInputHashes.get(assignmentKey) ?? new Set();
    inputs.add(record.paired_input_sha256);
    pairedInputHashes.set(assignmentKey, inputs);
  }
  for (const [assignmentKey, budgets] of assignments) {
    const scenario = assignmentScenarios.get(assignmentKey);
    try {
      validateEqualBudgetAssignments(scenario, budgets);
    } catch (error) {
      errors.push(`${assignmentKey}: ${error.message}`);
    }
  }
  for (const [assignmentKey, hashes] of traceHashes) {
    if (hashes.size !== 1) errors.push(`temporary trace differs across paired arms: ${assignmentKey}`);
  }
  for (const [assignmentKey, byteCounts] of stagedByteCounts) {
    if (byteCounts.size !== 1) errors.push(`pre-reveal staged bytes differ across paired arms: ${assignmentKey}`);
  }
  for (const [assignmentKey, hashes] of pairedInputHashes) {
    if (hashes.size !== 1) errors.push(`paired input differs across arms: ${assignmentKey}`);
  }
  for (const key of expectedSchedule.keys()) {
    if (!observedSchedule.has(key)) errors.push(`missing frozen factorial work unit: ${key}`);
  }
  const state = ledger.summary();
  if (
    records.length !== run.records
    || records.length !== run.expected_records
    || records.length !== expectedSchedule.size
    || observedSchedule.size !== expectedSchedule.size
  ) {
    errors.push(`record count ${records.length} disagrees with run provenance`);
  }
  if (
    state.scientific_payload_sha256 !== run.scientific_payload_sha256
    || state.hash_chain_sha256 !== run.hash_chain_sha256
  ) errors.push("ledger digests disagree with run provenance");
  if (canonical(identity) !== canonical(run.run_identity)) errors.push("run identity is not reproducible from frozen provenance");

  const validation = {
    schema: 1,
    artifact: "candidate-010",
    run_kind: "factorial-diagnostic-v1",
    valid: errors.length === 0,
    claim_eligible: false,
    errors,
    records: records.length,
    assignments: assignments.size,
    task_families: [...new Set(records.map((record) => record.task_family))].sort(),
    scientific_payload_sha256: state.scientific_payload_sha256,
    hash_chain_sha256: state.hash_chain_sha256,
    physical_actuation: false,
  };
  const analysisDirectory = path.join(outputDirectory, "analysis");
  await mkdir(analysisDirectory, { recursive: true });
  await writeFile(path.join(analysisDirectory, "factorial-validation.json"), `${JSON.stringify(validation, null, 2)}\n`);
  if (errors.length) throw new Error(`Factorial validation failed:\n- ${errors.join("\n- ")}`);
    return validation;
  } finally {
    await runLock.release();
  }
}
