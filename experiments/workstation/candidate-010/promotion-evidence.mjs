import { createHash } from "node:crypto";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { BACKEND_METADATA } from "./backend-registry.mjs";
import { CONFIRMATORY_PREREGISTRATION, analyzeConfirmatory } from "./confirmatory-analysis.mjs";
import {
  bindExternalEnergyObservation,
  evaluateExternalEnergyReading,
  validateBoundExternalEnergyObservation,
} from "./energy-provider.mjs";
import { readFactorialRecords, validateFactorialRun } from "./factorial-runner.mjs";
import { openFrozenSeedRelease } from "./release-contract.mjs";
import { captureCandidate010SourceBundle } from "./source-bundle.mjs";

export const PROMOTION_EVIDENCE_VERSION = "candidate-010.promotion-evidence.v1";

function canonical(value) {
  if (value === null || typeof value === "boolean" || typeof value === "string") return JSON.stringify(value);
  if (typeof value === "number") {
    if (!Number.isFinite(value)) throw new TypeError("Promotion evidence rejects non-finite numbers.");
    return JSON.stringify(value);
  }
  if (Array.isArray(value)) return `[${value.map(canonical).join(",")}]`;
  if (value && typeof value === "object") {
    return `{${Object.keys(value).sort().map((key) => {
      if (value[key] === undefined) throw new TypeError(`Promotion evidence rejects undefined at ${key}.`);
      return `${JSON.stringify(key)}:${canonical(value[key])}`;
    }).join(",")}}`;
  }
  throw new TypeError(`Promotion evidence rejects ${typeof value}.`);
}

function sha256(value) {
  return createHash("sha256").update(value).digest("hex");
}

async function json(file, label) {
  let body;
  try {
    body = await readFile(file);
  } catch (error) {
    throw new Error(`Cannot read ${label}: ${error.message}`);
  }
  try {
    return { body, value: JSON.parse(body) };
  } catch (error) {
    throw new Error(`${label} is not valid JSON: ${error.message}`);
  }
}

async function fileIdentity(file, scope, root) {
  const body = await readFile(file);
  const information = await stat(file);
  if (!information.isFile()) throw new Error(`Promotion input is not a file: ${file}`);
  const relative = path.relative(root, file).replaceAll("\\", "/");
  return {
    scope,
    path: relative.startsWith("../") || path.isAbsolute(relative) ? path.basename(file) : relative,
    bytes: body.length,
    sha256: sha256(body),
  };
}

function resolveInside(root, relative, label) {
  if (typeof relative !== "string" || relative.length === 0 || path.isAbsolute(relative)) {
    throw new Error(`Invalid ${label} path.`);
  }
  const resolvedRoot = path.resolve(root);
  const resolved = path.resolve(resolvedRoot, ...relative.replaceAll("\\", "/").split("/"));
  const relation = path.relative(resolvedRoot, resolved);
  if (!relation || relation === ".." || relation.startsWith(`..${path.sep}`) || path.isAbsolute(relation)) {
    throw new Error(`${label} path escapes its root.`);
  }
  return resolved;
}

function exactSet(values) {
  return [...new Set(values)].sort();
}

function expectedEnergyOwnership(record) {
  return {
    run_id: record.run_id,
    pair_id: record.pair_id,
    work_unit_id: record.work_unit_id,
    scenario_id: record.scenario_id,
    task_family: record.task_family,
    backend_id: record.backend_id,
    cluster_id: record.cluster_id,
    opportunity_id: record.opportunity_id,
    arm: record.arm,
    interval_started_at: record.measurement_interval?.started_at,
    interval_ended_at: record.measurement_interval?.ended_at,
  };
}

function backendRows(document) {
  const rows = Array.isArray(document) ? document : document?.backends;
  if (!Array.isArray(rows) || rows.length === 0) throw new Error("Bound backend registry must contain a non-empty backends array.");
  return rows;
}

function assertEligibleAnalysis(analysis) {
  if (
    analysis?.eligible_for_superiority_claim !== true
    || analysis.decision !== "eligible"
    || !Array.isArray(analysis.validation_errors)
    || analysis.validation_errors.length !== 0
    || analysis.gates?.safety_noninferiority !== "passed"
    || analysis.gates?.loss_superiority !== "passed"
    || analysis.gates?.resource_superiority !== "passed"
  ) throw new Error("Recomputed confirmatory analysis is not promotion-eligible.");
}

function assertFrozenPreregistration(preregistration) {
  const registered = CONFIRMATORY_PREREGISTRATION;
  if (
    preregistration?.schema !== registered.schema
    || typeof preregistration.id !== "string"
    || !preregistration.id.endsWith("-frozen")
    || preregistration.candidate_arm !== registered.candidate_arm
    || canonical(preregistration.comparators) !== canonical(registered.comparators)
    || canonical(preregistration.gatekeeping) !== canonical(registered.gatekeeping)
    || preregistration.alpha_familywise !== registered.alpha_familywise
    || preregistration.minimum_implemented_task_families !== registered.minimum_implemented_task_families
    || preregistration.minimum_independent_clusters_per_family !== registered.minimum_independent_clusters_per_family
    || preregistration.energy_observation_kind !== registered.energy_observation_kind
    || canonical(Object.keys(preregistration.endpoints ?? {}).sort()) !== canonical(Object.keys(registered.endpoints).sort())
  ) throw new Error("Release preregistration does not match the registered frozen confirmatory plan.");
  for (const endpoint of Object.keys(registered.endpoints)) {
    const expected = registered.endpoints[endpoint];
    const observed = preregistration.endpoints?.[endpoint];
    if (!observed || observed.role !== expected.role || observed.estimand !== expected.estimand) {
      throw new Error(`Release preregistration changed endpoint ${endpoint}.`);
    }
    if (["irreversible_violations", "false_commits"].includes(endpoint)) {
      if (!Number.isFinite(observed.margin) || observed.margin < 0) {
        throw new Error(`Release preregistration did not freeze safety margin ${endpoint}.`);
      }
    } else if (observed.margin !== expected.margin) {
      throw new Error(`Release preregistration changed margin ${endpoint}.`);
    }
  }
}

function evidenceDigest(document) {
  const { evidence_sha256: ignored, ...body } = document;
  void ignored;
  return sha256(canonical(body));
}

async function recompute({
  repositoryRoot,
  runDirectory,
  releaseRoot,
  releasePath,
  energyAssignmentsPath,
  disjointSeedPackPaths,
}) {
  if (!Array.isArray(disjointSeedPackPaths) || disjointSeedPackPaths.length === 0) {
    throw new Error("Promotion evidence requires explicit disjoint seed-pack artifact paths.");
  }
  const roots = {
    repository: path.resolve(repositoryRoot),
    run: path.resolve(runDirectory),
    release: path.resolve(releaseRoot),
  };
  const releaseDocument = (await json(releasePath, "frozen release")).value;
  const disjointDocuments = await Promise.all(disjointSeedPackPaths.map(async (file) => (
    (await json(file, "disjoint seed pack")).value
  )));
  const openedRelease = await openFrozenSeedRelease({
    root: roots.release,
    releasePath,
    expectedPartition: "confirmation",
    phase: "confirmation",
    disjointWith: disjointDocuments,
  });
  const currentSourceBundle = await captureCandidate010SourceBundle(roots.repository);
  if (
    openedRelease.source_identity.source_sha256 !== currentSourceBundle.source_sha256
    || openedRelease.source_identity.source_commit !== currentSourceBundle.vcs.source_commit
  ) throw new Error("Opened release does not bind the current executable source bundle.");

  const factorialValidation = await validateFactorialRun(roots.run);
  if (factorialValidation.valid !== true || factorialValidation.errors.length !== 0) {
    throw new Error("Factorial run did not pass exact ledger validation.");
  }
  const records = await readFactorialRecords(roots.run);
  if (records.some((record) => record.phase !== openedRelease.phase)) {
    throw new Error("Factorial ledger contains records outside the opened confirmation release phase.");
  }
  const provenanceRoot = path.join(roots.run, "provenance");
  const run = (await json(path.join(provenanceRoot, "run.json"), "run provenance")).value;
  const runConfig = (await json(path.join(provenanceRoot, "config.json"), "run config")).value;
  const runDesign = (await json(path.join(provenanceRoot, "factorial-design.json"), "run design")).value;
  const runSeeds = (await json(path.join(provenanceRoot, "seeds.json"), "run seeds")).value;
  const runSourceBundle = (await json(path.join(provenanceRoot, "source-bundle.json"), "run source bundle")).value;
  if (
    run.scientific_payload_sha256 !== factorialValidation.scientific_payload_sha256
    || run.hash_chain_sha256 !== factorialValidation.hash_chain_sha256
    || run.records !== records.length
  ) throw new Error("Run provenance does not exactly match the validated ledger digests.");
  if (canonical(runSeeds.seeds) !== canonical(openedRelease.seeds)) throw new Error("Factorial run seeds differ from the opened release.");
  if (canonical(runSourceBundle) !== canonical(currentSourceBundle)) throw new Error("Factorial run source bundle is not current.");

  const bindingFiles = Object.fromEntries(Object.entries(releaseDocument.bindings ?? {}).map(([name, binding]) => (
    [name, resolveInside(roots.release, binding.path, `release ${name}`)]
  )));
  const [releaseConfig, releaseDesign, releaseRegistry, preregistration] = await Promise.all([
    json(bindingFiles.config, "release config"),
    json(bindingFiles.design, "release design"),
    json(bindingFiles.backend_registry, "release backend registry"),
    json(bindingFiles.preregistration, "release preregistration"),
  ]).then((rows) => rows.map((row) => row.value));
  if (canonical(releaseConfig) !== canonical(runConfig)) throw new Error("Run config differs from the release-bound config.");
  if (canonical(releaseDesign) !== canonical(runDesign)) throw new Error("Run design differs from the release-bound design.");
  assertFrozenPreregistration(preregistration);

  const observedTaskBackends = exactSet(records.map((record) => `${record.task_family}\u0000${record.backend_id}`));
  if (observedTaskBackends.length < 2) throw new Error("Promotion evidence requires at least two implemented task-family/backend pairs.");
  const registry = backendRows(releaseRegistry);
  const authoritativeMetadata = new Map(BACKEND_METADATA.map((row) => [`${row.task_family}\u0000${row.backend_id}`, row]));
  const taskBackends = observedTaskBackends.map((key) => {
    const [taskFamily, backendId] = key.split("\u0000");
    const bound = registry.find((row) => row.task_family === taskFamily && row.backend_id === backendId);
    const current = authoritativeMetadata.get(key);
    if (
      !bound
      || !current
      || canonical(bound) !== canonical(current)
      || bound.implemented !== true
      || bound.physical_actuation !== false
    ) {
      throw new Error(`Release does not bind the current implemented backend: ${taskFamily}/${backendId}`);
    }
    return { task_family: taskFamily, backend_id: backendId };
  });

  const energyArtifact = (await json(energyAssignmentsPath, "bound energy assignments")).value;
  if (energyArtifact?.schema !== 1 || !Array.isArray(energyArtifact.assignments)) {
    throw new Error("Bound energy artifact must contain raw-backed assignments; summary booleans are not evidence.");
  }
  if (energyArtifact.assignments.length !== records.length) {
    throw new Error("Bound energy ownership is not one-to-one with raw factorial records.");
  }
  const energyByWorkUnit = new Map();
  const energyInputFiles = [];
  const usedRawPaths = new Set();
  const usedReviewPaths = new Set();
  const energyRoot = path.dirname(energyAssignmentsPath);
  for (const assignment of energyArtifact.assignments) {
    if (!assignment || typeof assignment !== "object" || !assignment.observation) {
      throw new Error("Energy assignment lacks a normalized observation.");
    }
    const rawPath = resolveInside(energyRoot, assignment.raw_reading_path, "raw energy reading");
    const reviewPath = resolveInside(energyRoot, assignment.provenance_review_path, "energy provenance review");
    if (usedRawPaths.has(rawPath) || usedReviewPaths.has(reviewPath)) {
      throw new Error("Energy assignments reuse a raw reading or provenance-review file.");
    }
    usedRawPaths.add(rawPath);
    usedReviewPaths.add(reviewPath);
    const [rawReading, review] = await Promise.all([
      json(rawPath, "raw energy reading"),
      json(reviewPath, "energy provenance review"),
    ]);
    const normalized = evaluateExternalEnergyReading(rawReading.value).measured;
    const ownership = assignment.observation.binding?.ownership;
    const reconstructed = bindExternalEnergyObservation(normalized, {
      ownership,
      provenanceReview: review.value,
    });
    if (canonical(reconstructed) !== canonical(assignment.observation)) {
      throw new Error("Bound energy observation does not exactly reconstruct from its raw reading and review.");
    }
    const observation = assignment.observation;
    const workUnitId = observation?.binding?.ownership?.work_unit_id;
    if (!workUnitId || energyByWorkUnit.has(workUnitId)) throw new Error("Bound energy contains missing or duplicate work-unit ownership.");
    energyByWorkUnit.set(workUnitId, observation);
    energyInputFiles.push(
      await fileIdentity(rawPath, "raw-energy-reading", energyRoot),
      await fileIdentity(reviewPath, "energy-provenance-review", energyRoot),
    );
  }
  const confirmatoryRecords = records.map((record) => {
    const observation = energyByWorkUnit.get(record.work_unit_id);
    if (!observation) throw new Error(`Missing bound external energy for work unit ${record.work_unit_id}.`);
    validateBoundExternalEnergyObservation(observation, expectedEnergyOwnership(record));
    const { modeled_energy_j: ignored, external_energy: ignoredExternal, ...resources } = record.resources;
    void ignored;
    void ignoredExternal;
    return {
      ...record,
      energy_interval: {
        started_at: record.measurement_interval.started_at,
        ended_at: record.measurement_interval.ended_at,
      },
      resources: { ...resources, external_energy: observation },
    };
  });
  if (energyByWorkUnit.size !== records.length) throw new Error("Energy artifact contains ownership outside the raw ledger.");

  const scenarioBudgets = runDesign.scenarios?.map((scenario) => scenario.budget);
  if (!Array.isArray(scenarioBudgets) || scenarioBudgets.length === 0) throw new Error("Release design has no authoritative budget contract.");
  const budgetCanonical = canonical(scenarioBudgets[0]);
  if (scenarioBudgets.some((budget) => canonical(budget) !== budgetCanonical)) {
    throw new Error("Release design contains unequal authoritative budget contracts.");
  }
  const taskFamilies = Object.fromEntries(taskBackends.map((row) => [row.task_family, {
    implemented: true,
    backend_ids: [row.backend_id],
  }]));
  const context = {
    schema: 1,
    phase: openedRelease.phase,
    frozen_release: openedRelease.frozen_release,
    preregistration_id: preregistration.id,
    task_families: taskFamilies,
    budget: {
      contract_id: `sha256:${sha256(budgetCanonical)}`,
      validated: true,
      within_budget: true,
    },
  };
  const analysis = analyzeConfirmatory({ records: confirmatoryRecords, context, preregistration });
  assertEligibleAnalysis(analysis);

  const runInputs = [
    "raw/events.ndjson",
    "provenance/checkpoint.json",
    "provenance/config.json",
    "provenance/factorial-design.json",
    "provenance/environment.json",
    "provenance/run.json",
    "provenance/seeds.json",
    "provenance/source-bundle.json",
  ];
  const inputFiles = [
    ...(await Promise.all(currentSourceBundle.files.map(async (entry) => ({
      scope: "repository-source",
      path: entry.path,
      bytes: entry.bytes,
      sha256: entry.sha256,
    })))),
    await fileIdentity(releasePath, "release", roots.release),
    ...(await Promise.all(Object.values(bindingFiles).map((file) => fileIdentity(file, "release-binding", roots.release)))),
    ...(await Promise.all(disjointSeedPackPaths.map((file) => fileIdentity(file, "disjoint-seed-pack", roots.release)))),
    ...(await Promise.all(runInputs.map((relative) => fileIdentity(path.join(roots.run, ...relative.split("/")), "factorial-run", roots.run)))),
    await fileIdentity(energyAssignmentsPath, "bound-energy", path.dirname(energyAssignmentsPath)),
    ...energyInputFiles,
    await fileIdentity(fileURLToPath(import.meta.url), "promotion-validator-source", roots.repository),
  ];
  inputFiles.sort((left, right) => left.scope.localeCompare(right.scope) || left.path.localeCompare(right.path));

  const body = {
    schema: 1,
    contract_version: PROMOTION_EVIDENCE_VERSION,
    source: {
      commit: currentSourceBundle.vcs.source_commit,
      bundle_sha256: currentSourceBundle.source_sha256,
    },
    release: {
      release_sha256: openedRelease.release_sha256,
      version: openedRelease.release_version,
      partition: openedRelease.partition,
      seed_commitment: openedRelease.seed_pack.commitment,
    },
    task_backends: taskBackends,
    ledger: {
      records: records.length,
      scientific_payload_sha256: factorialValidation.scientific_payload_sha256,
      hash_chain_sha256: factorialValidation.hash_chain_sha256,
      raw_events_sha256: inputFiles.find((row) => row.scope === "factorial-run" && row.path === "raw/events.ndjson").sha256,
    },
    energy: {
      observations: energyArtifact.assignments.length,
      raw_reading_sha256: exactSet(energyInputFiles
        .filter((row) => row.scope === "raw-energy-reading")
        .map((row) => row.sha256)),
      provenance_review_sha256: exactSet(energyInputFiles
        .filter((row) => row.scope === "energy-provenance-review")
        .map((row) => row.sha256)),
    },
    analysis,
    analysis_sha256: sha256(canonical(analysis)),
    input_files: inputFiles,
  };
  return { ...body, evidence_sha256: sha256(canonical(body)) };
}

export async function buildPromotionEvidence(paths) {
  return recompute(paths);
}

export async function validatePromotionEvidence(evidence, paths) {
  if (!evidence || typeof evidence !== "object" || Array.isArray(evidence)) {
    throw new Error("Promotion evidence must be a complete bundle, not a summary boolean.");
  }
  if (evidence.contract_version !== PROMOTION_EVIDENCE_VERSION || evidence.evidence_sha256 !== evidenceDigest(evidence)) {
    throw new Error("Promotion evidence canonical digest is invalid.");
  }
  const recomputed = await recompute(paths);
  if (canonical(evidence) !== canonical(recomputed)) throw new Error("Promotion evidence differs from recomputed repository artifacts.");
  assertEligibleAnalysis(recomputed.analysis);
  return { valid: true, evidence_sha256: recomputed.evidence_sha256 };
}
