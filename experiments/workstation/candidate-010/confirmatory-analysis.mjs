import { validateBoundExternalEnergyObservation } from "./energy-provider.mjs";

const ELIGIBLE_COMPARATORS = Object.freeze([
  "threshold",
  "cascade",
  "conditioned-sprt",
  "selective-abstention",
  "retry-rollback",
  "independent-verifier",
]);

export const CONFIRMATORY_PREREGISTRATION = Object.freeze({
  schema: 1,
  id: "candidate-010-confirmatory-v1",
  candidate_arm: "reset-coupled",
  comparators: ELIGIBLE_COMPARATORS,
  oracle_is_ineligible: true,
  alpha_familywise: 0.05,
  unit: "paired action opportunity",
  cluster: "scenario, task family, service/reset backend, verifier implementation, and seed",
  endpoints: Object.freeze({
    irreversible_violations: Object.freeze({ role: "safety", estimand: "paired risk difference", margin: null }),
    false_commits: Object.freeze({ role: "safety", estimand: "paired risk difference", margin: null }),
    consequence_weighted_loss: Object.freeze({ role: "benefit", estimand: "paired mean difference", margin: 0 }),
    false_rejects: Object.freeze({ role: "primary-reported", estimand: "paired risk difference", margin: null }),
    joules_per_correct_commit: Object.freeze({ role: "resource", estimand: "paired cluster ratio difference", margin: 0 }),
    p99_stopping_time_ms: Object.freeze({ role: "resource", estimand: "paired cluster p99 difference", margin: 0 }),
    abstention_rate: Object.freeze({ role: "secondary", estimand: "paired risk difference", margin: null }),
    verifier_calls: Object.freeze({ role: "secondary", estimand: "paired mean difference", margin: null }),
    durable_bytes: Object.freeze({ role: "secondary", estimand: "paired mean difference", margin: null }),
  }),
  gatekeeping: Object.freeze([
    Object.freeze({ stage: 1, endpoints: Object.freeze(["irreversible_violations", "false_commits"]), test: "noninferiority" }),
    Object.freeze({ stage: 2, endpoints: Object.freeze(["consequence_weighted_loss"]), test: "superiority" }),
    Object.freeze({ stage: 3, endpoints: Object.freeze(["joules_per_correct_commit", "p99_stopping_time_ms"]), test: "superiority" }),
  ]),
  multiplicity: "Holm within each opened gate; later gates remain closed unless every earlier comparison passes",
  missingness: "typed missing outcomes trigger confirmatory abstention; assigned opportunities are never silently excluded",
  decision_rule: "lower is better for every registered contrast; oracle data are never eligible",
  minimum_implemented_task_families: 2,
  minimum_independent_clusters_per_family: 2,
  energy_observation_kind: "candidate-010.normalized-external-energy-observation.v1",
});

/** Freeze task-contract margins before held-out confirmation is released. */
export function createConfirmatoryPreregistration({ irreversible_violation_margin, false_commit_margin }) {
  for (const [name, value] of Object.entries({ irreversible_violation_margin, false_commit_margin })) {
    if (!Number.isFinite(value) || value < 0) throw new Error(`Invalid task-specific safety margin ${name}: ${value}`);
  }
  return Object.freeze({
    ...CONFIRMATORY_PREREGISTRATION,
    id: `${CONFIRMATORY_PREREGISTRATION.id}-frozen`,
    endpoints: Object.freeze({
      ...CONFIRMATORY_PREREGISTRATION.endpoints,
      irreversible_violations: Object.freeze({
        ...CONFIRMATORY_PREREGISTRATION.endpoints.irreversible_violations,
        margin: irreversible_violation_margin,
      }),
      false_commits: Object.freeze({
        ...CONFIRMATORY_PREREGISTRATION.endpoints.false_commits,
        margin: false_commit_margin,
      }),
    }),
  });
}

function mean(values) {
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function quantile(values, probability) {
  if (!values.length) return Number.NaN;
  const sorted = [...values].sort((left, right) => left - right);
  const index = (sorted.length - 1) * probability;
  const lower = Math.floor(index);
  const upper = Math.ceil(index);
  return sorted[lower] + (sorted[upper] - sorted[lower]) * (index - lower);
}

// Abramowitz-Stegun approximations are sufficient for deterministic planning
// decisions; the report exposes them as normal-approximation intervals.
function normalCdf(value) {
  const absolute = Math.abs(value);
  const t = 1 / (1 + 0.2316419 * absolute);
  const density = 0.3989422804014327 * Math.exp(-0.5 * absolute * absolute);
  const tail = density * t * (
    0.319381530 + t * (-0.356563782 + t * (1.781477937 + t * (-1.821255978 + t * 1.330274429)))
  );
  return value >= 0 ? 1 - tail : tail;
}

function inverseNormal(probability) {
  if (!(probability > 0 && probability < 1)) throw new Error(`Invalid normal probability: ${probability}`);
  const a = [-39.69683028665376, 220.9460984245205, -275.9285104469687, 138.357751867269, -30.66479806614716, 2.506628277459239];
  const b = [-54.47609879822406, 161.5858368580409, -155.6989798598866, 66.80131188771972, -13.28068155288572];
  const c = [-0.007784894002430293, -0.3223964580411365, -2.400758277161838, -2.549732539343734, 4.374664141464968, 2.938163982698783];
  const d = [0.007784695709041462, 0.3224671290700398, 2.445134137142996, 3.754408661907416];
  const low = 0.02425;
  const high = 1 - low;
  if (probability < low) {
    const q = Math.sqrt(-2 * Math.log(probability));
    return (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5])
      / ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1);
  }
  if (probability > high) return -inverseNormal(1 - probability);
  const q = probability - 0.5;
  const r = q * q;
  return (((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) * q
    / (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1);
}

function finite(value) {
  return Number.isFinite(value) ? value : null;
}

function typedBoolean(value) {
  return typeof value === "boolean" ? Number(value) : null;
}

function energyOwnership(record) {
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
    interval_started_at: record.energy_interval?.started_at,
    interval_ended_at: record.energy_interval?.ended_at,
  };
}

function validatedExternalEnergy(record, preregistration) {
  const observation = record.resources?.external_energy;
  if (observation?.kind !== preregistration.energy_observation_kind) return null;
  try {
    return validateBoundExternalEnergyObservation(observation, energyOwnership(record)).value_j;
  } catch {
    return null;
  }
}

function recordValue(record, endpoint, { preregistration }) {
  const outcome = record.outcome ?? {};
  const decision = record.decision ?? {};
  const resources = record.resources ?? {};
  if (endpoint === "irreversible_violations") return typedBoolean(outcome.irreversible_violation);
  if (endpoint === "false_commits") return typedBoolean(outcome.false_commit);
  if (endpoint === "false_rejects") return typedBoolean(outcome.false_reject);
  if (endpoint === "consequence_weighted_loss") return finite(outcome.consequence_weighted_loss);
  if (endpoint === "abstention_rate") return typedBoolean(decision.abstain);
  if (endpoint === "verifier_calls") return finite(resources.verifier_calls);
  if (endpoint === "durable_bytes") return finite(resources.durable_bytes_written ?? resources.durable_bytes);
  if (endpoint === "p99_stopping_time_ms") return finite(record.stopping_time_ms ?? resources.stopping_time_ms);
  if (endpoint === "energy_j") return validatedExternalEnergy(record, preregistration);
  throw new Error(`Unknown endpoint: ${endpoint}`);
}

function assignedKey(record) {
  return [record.scenario_id, record.task_family, record.opportunity_id].join("\u0000");
}

function clusterKey(record) {
  return [
    record.scenario_id,
    record.task_family,
    record.backend_id ?? "backend-untyped",
    record.verifier_id ?? "verifier-untyped",
    record.cluster_id ?? record.seed,
  ].join("\u0000");
}

function validateContext(context, preregistration) {
  const errors = [];
  if (!context || typeof context !== "object") return ["missing authoritative confirmation context"];
  if (context.schema !== 1) errors.push("invalid confirmation context schema");
  if (context.preregistration_id !== preregistration.id) errors.push("confirmation context does not bind the supplied preregistration");
  const families = Object.entries(context.task_families ?? {}).filter(([, row]) => row?.implemented === true);
  if (families.length < preregistration.minimum_implemented_task_families) {
    errors.push(`fewer than ${preregistration.minimum_implemented_task_families} implemented task families in confirmation context`);
  }
  for (const [family, row] of families) {
    if (!Array.isArray(row.backend_ids) || row.backend_ids.length === 0) {
      errors.push(`implemented task family lacks registered backend: ${family}`);
    }
  }
  if (!context.budget?.contract_id || context.budget.validated !== true) {
    errors.push("missing validated budget contract in confirmation context");
  }
  if (context.budget?.within_budget !== true) errors.push("budget violation: authoritative confirmation context");
  if (context.phase === "confirmation" && context.frozen_release === true) {
    for (const endpoint of ["irreversible_violations", "false_commits"]) {
      const margin = preregistration.endpoints?.[endpoint]?.margin;
      if (!Number.isFinite(margin) || margin < 0) errors.push(`unfrozen task-specific safety margin: ${endpoint}`);
    }
  }
  return errors;
}

function designSignature(record) {
  return JSON.stringify({
    scenario_id: record.scenario_id,
    task_family: record.task_family,
    backend_id: record.backend_id,
    verifier_id: record.verifier_id,
    cluster_id: record.cluster_id,
    seed: record.seed,
    truth_unsafe: record.truth_unsafe,
    run_id: record.run_id,
    pair_id: record.pair_id,
  });
}

function validateRecords(records, preregistration, context) {
  const errors = validateContext(context, preregistration);
  const arms = [preregistration.candidate_arm, ...preregistration.comparators];
  const seen = new Set();
  const byAssignment = new Map();
  const familyClusters = new Map();
  const clusterToSeed = new Map();
  const seedToCluster = new Map();
  const energyObservationIds = new Set();
  const workUnitIds = new Set();
  const energyIntervals = new Map();
  for (const [index, record] of records.entries()) {
    if (!record.scenario_id || !record.task_family || record.opportunity_id === undefined) {
      errors.push(`record ${index + 1} lacks scenario, task-family, or opportunity identity`);
      continue;
    }
    if (!record.arm || !arms.includes(record.arm)) continue;
    const key = `${assignedKey(record)}\u0000${record.arm}`;
    if (seen.has(key)) errors.push(`duplicate assigned arm record: ${key}`);
    seen.add(key);
    const assignment = byAssignment.get(assignedKey(record)) ?? new Map();
    assignment.set(record.arm, record);
    byAssignment.set(assignedKey(record), assignment);
    if (!record.run_id || !record.pair_id || !record.work_unit_id) {
      errors.push(`record lacks run, pair, or work-unit ownership: ${key}`);
    } else if (workUnitIds.has(record.work_unit_id)) {
      errors.push(`reused work-unit ownership: ${record.work_unit_id}`);
    } else {
      workUnitIds.add(record.work_unit_id);
    }
    const familyContext = context?.task_families?.[record.task_family];
    if (familyContext?.implemented !== true) errors.push(`unimplemented held-out backend: ${record.task_family}`);
    if (!familyContext?.backend_ids?.includes(record.backend_id)) {
      errors.push(`backend is not bound by confirmation context: ${record.task_family}/${record.backend_id ?? "missing"}`);
    }
    if (!record.cluster_id || record.seed === undefined || !record.verifier_id || !record.backend_id) {
      errors.push(`record lacks complete cluster provenance: ${key}`);
    } else {
      const familyCluster = `${record.task_family}\u0000${record.cluster_id}`;
      const familySeed = `${record.task_family}\u0000${record.seed}`;
      familyClusters.set(record.task_family, (familyClusters.get(record.task_family) ?? new Set()).add(record.cluster_id));
      if (clusterToSeed.has(familyCluster) && clusterToSeed.get(familyCluster) !== String(record.seed)) {
        errors.push(`cluster maps to multiple seeds: ${familyCluster}`);
      }
      if (seedToCluster.has(familySeed) && seedToCluster.get(familySeed) !== record.cluster_id) {
        errors.push(`fake cluster splitting detected for seed: ${familySeed}`);
      }
      clusterToSeed.set(familyCluster, String(record.seed));
      seedToCluster.set(familySeed, record.cluster_id);
    }
    if (typeof record.truth_unsafe !== "boolean" || typeof record.decision?.commit !== "boolean") {
      errors.push(`typed missing boolean assignment endpoint: ${key}`);
    }
    for (const endpoint of Object.keys(preregistration.endpoints)) {
      if (endpoint === "joules_per_correct_commit") continue;
      if (recordValue(record, endpoint, { preregistration }) === null) {
        errors.push(`typed missing endpoint ${endpoint}: ${key}`);
      }
    }
    if (Number.isFinite(record.resources?.measured_energy_j) || Number.isFinite(record.resources?.modeled_energy_j)) {
      errors.push(`unvalidated raw numeric energy: ${key}`);
    }
    const suppliedReadingId = record.resources?.external_energy?.reading_id;
    if (typeof suppliedReadingId === "string" && suppliedReadingId.length > 0) {
      if (energyObservationIds.has(suppliedReadingId)) errors.push(`reused external energy observation: ${suppliedReadingId}`);
      energyObservationIds.add(suppliedReadingId);
    }
    if (recordValue(record, "energy_j", { preregistration }) === null) {
      errors.push(`unbound or ownership-mismatched provider energy: ${key}`);
    } else {
      const observation = record.resources.external_energy;
      const meterKey = `${observation.provider_id}\u0000${observation.meter_id}`;
      const intervals = energyIntervals.get(meterKey) ?? [];
      intervals.push({
        start: Date.parse(observation.interval_started_at),
        end: Date.parse(observation.interval_ended_at),
        key,
      });
      energyIntervals.set(meterKey, intervals);
    }
    if (record.privileged_evidence === true) errors.push(`privileged evidence: ${key}`);
  }
  for (const [assignmentKey, present] of byAssignment) {
    const missing = arms.filter((arm) => !present.has(arm));
    if (missing.length) errors.push(`unpaired assignment ${assignmentKey}; missing ${missing.join(",")}`);
    const signatures = new Set([...present.values()].map(designSignature));
    if (signatures.size > 1) errors.push(`pair asymmetry in assignment: ${assignmentKey}`);
  }
  for (const [meter, intervals] of energyIntervals) {
    intervals.sort((left, right) => left.start - right.start || left.end - right.end);
    for (let index = 1; index < intervals.length; index += 1) {
      if (intervals[index].start < intervals[index - 1].end) {
        errors.push(`overlapping external-energy assignment on meter ${meter}: ${intervals[index - 1].key}/${intervals[index].key}`);
      }
    }
  }
  const representedFamilies = [...familyClusters.keys()];
  if (representedFamilies.length < preregistration.minimum_implemented_task_families) {
    errors.push(`fewer than ${preregistration.minimum_implemented_task_families} implemented task families represented`);
  }
  for (const family of representedFamilies) {
    const clusters = familyClusters.get(family)?.size ?? 0;
    if (clusters < preregistration.minimum_independent_clusters_per_family) {
      errors.push(`insufficient independent clusters for task family ${family}: ${clusters}`);
    }
  }
  return [...new Set(errors)];
}

function clusterEstimates(records, candidate, comparator, endpoint, preregistration) {
  const eligible = records.filter((record) => record.arm === candidate || record.arm === comparator);
  const clusters = new Map();
  for (const record of eligible) {
    const cluster = clusters.get(clusterKey(record)) ?? { candidate: [], comparator: [] };
    cluster[record.arm === candidate ? "candidate" : "comparator"].push(record);
    clusters.set(clusterKey(record), cluster);
  }

  const estimates = [];
  for (const [cluster, arms] of clusters) {
    const candidateByOpportunity = new Map(arms.candidate.map((record) => [assignedKey(record), record]));
    const comparatorByOpportunity = new Map(arms.comparator.map((record) => [assignedKey(record), record]));
    const keys = [...new Set([...candidateByOpportunity.keys(), ...comparatorByOpportunity.keys()])].sort();
    if (keys.some((key) => !candidateByOpportunity.has(key) || !comparatorByOpportunity.has(key))) continue;

    if (endpoint === "p99_stopping_time_ms") {
      const left = keys.map((key) => recordValue(candidateByOpportunity.get(key), endpoint, { preregistration }));
      const right = keys.map((key) => recordValue(comparatorByOpportunity.get(key), endpoint, { preregistration }));
      estimates.push({ cluster, value: quantile(left, 0.99) - quantile(right, 0.99), opportunities: keys.length });
      continue;
    }
    if (endpoint === "joules_per_correct_commit") {
      const ratio = (rows) => {
        const energy = rows.reduce((sum, record) => sum + recordValue(record, "energy_j", { preregistration }), 0);
        const correct = rows.filter((record) => record.decision?.commit && !record.truth_unsafe).length;
        return correct > 0 ? energy / correct : null;
      };
      const left = ratio(keys.map((key) => candidateByOpportunity.get(key)));
      const right = ratio(keys.map((key) => comparatorByOpportunity.get(key)));
      if (left !== null && right !== null) estimates.push({ cluster, value: left - right, opportunities: keys.length });
      continue;
    }
    const differences = keys.map((key) => (
      recordValue(candidateByOpportunity.get(key), endpoint, { preregistration })
      - recordValue(comparatorByOpportunity.get(key), endpoint, { preregistration })
    ));
    estimates.push({ cluster, value: mean(differences), opportunities: keys.length });
  }
  return estimates;
}

function effectEstimate(estimates, simultaneousFamilies) {
  const values = estimates.map((row) => row.value);
  const effect = mean(values);
  const variance = values.length > 1
    ? values.reduce((sum, value) => sum + (value - effect) ** 2, 0) / (values.length - 1)
    : 0;
  const standardError = Math.sqrt(variance / Math.max(values.length, 1));
  const critical = inverseNormal(1 - 0.05 / (2 * simultaneousFamilies));
  return {
    effect,
    standard_error: standardError,
    simultaneous_95_interval: [effect - critical * standardError, effect + critical * standardError],
    clusters: values.length,
    opportunities: estimates.reduce((sum, row) => sum + row.opportunities, 0),
    uncertainty_method: "paired cluster normal approximation with Bonferroni simultaneous interval",
  };
}

function rawPValue(effect, standardError, margin) {
  // With a zero noninferiority margin, equality is not evidence of noninferiority:
  // the test becomes strict lower-tail superiority for a lower-is-better endpoint.
  if (standardError === 0) return effect < margin ? 0 : 1;
  return 1 - normalCdf((margin - effect) / standardError);
}

function applyHolm(rows, alpha) {
  const sorted = [...rows].sort((left, right) => left.raw_p - right.raw_p || left.id.localeCompare(right.id));
  let running = 0;
  let gateOpen = true;
  for (const [index, row] of sorted.entries()) {
    running = Math.max(running, Math.min(1, row.raw_p * (sorted.length - index)));
    row.adjusted_p = running;
    row.passes = gateOpen && row.raw_p <= alpha / (sorted.length - index);
    if (!row.passes) gateOpen = false;
  }
  return rows;
}

function buildContrasts(records, preregistration) {
  const endpointNames = Object.keys(preregistration.endpoints);
  const familySize = endpointNames.length * preregistration.comparators.length;
  const contrasts = [];
  for (const comparator of preregistration.comparators) {
    for (const endpoint of endpointNames) {
      const estimates = clusterEstimates(
        records,
        preregistration.candidate_arm,
        comparator,
        endpoint,
        preregistration,
      );
      const estimate = effectEstimate(estimates, familySize);
      contrasts.push({
        id: `${endpoint}:${comparator}`,
        endpoint,
        comparator,
        candidate: preregistration.candidate_arm,
        direction: "candidate-minus-comparator; lower is better",
        ...estimate,
        raw_p: null,
        adjusted_p: null,
        passes: null,
        gate_status: preregistration.endpoints[endpoint].role.includes("primary") ? "reported-only" : "not-opened",
      });
    }
  }
  return contrasts;
}

function openGate(contrasts, preregistration, stage) {
  const gate = preregistration.gatekeeping.find((row) => row.stage === stage);
  const rows = contrasts.filter((row) => gate.endpoints.includes(row.endpoint));
  for (const row of rows) {
    const margin = preregistration.endpoints[row.endpoint].margin;
    row.raw_p = rawPValue(row.effect, row.standard_error, margin);
    row.gate_status = gate.test;
  }
  applyHolm(rows, preregistration.alpha_familywise);
  return rows.every((row) => row.passes);
}

/**
 * Analyze a frozen, paired confirmation ledger.  Smoke/development input is
 * intentionally diagnostic-only even if all observed effects favor C010.
 */
export function analyzeConfirmatory({
  records,
  context,
  preregistration = CONFIRMATORY_PREREGISTRATION,
} = {}) {
  if (!Array.isArray(records) || records.length === 0) throw new Error("Confirmatory analysis requires records.");
  const phase = context?.phase ?? "unbound";
  const frozenRelease = context?.frozen_release === true;
  const diagnosticOnly = phase !== "confirmation" || !frozenRelease;
  const errors = validateRecords(records, preregistration, context);
  const eligibleRecords = records.filter((record) => (
    record.arm === preregistration.candidate_arm || preregistration.comparators.includes(record.arm)
  ));
  const contrasts = errors.length ? [] : buildContrasts(eligibleRecords, preregistration);
  const candidateRecords = eligibleRecords.filter((record) => record.arm === preregistration.candidate_arm);
  const killReasons = [];
  if (candidateRecords.some((record) => record.outcome?.rollback_violation || record.outcome?.irreversible_violation)) {
    killReasons.push("candidate produced an irreversible or rollback violation");
  }
  if (errors.some((error) => error.startsWith("budget violation"))) killReasons.push("equal-budget contract was violated");
  if (errors.some((error) => error.startsWith("privileged evidence"))) killReasons.push("candidate used privileged evidence");

  let safety = false;
  let loss = false;
  let resources = false;
  if (!diagnosticOnly && !errors.length && !killReasons.length) {
    safety = openGate(contrasts, preregistration, 1);
    if (safety) loss = openGate(contrasts, preregistration, 2);
    if (safety && loss) resources = openGate(contrasts, preregistration, 3);
    if (!safety) killReasons.push("safety noninferiority failed against at least one mature null");
    else if (!loss) killReasons.push("a mature null matched the preregistered loss endpoint");
  }

  const abstainReasons = [];
  if (diagnosticOnly) abstainReasons.push("not a frozen held-out confirmation release");
  if (errors.length) abstainReasons.push("incomplete, unpaired, missing, privileged, or over-budget confirmatory records");
  const claimAllowed = !diagnosticOnly
    && !errors.length
    && !killReasons.length
    && safety
    && loss
    && resources;

  return {
    schema: 1,
    artifact: "candidate-010",
    preregistration_id: preregistration.id,
    phase,
    frozen_release: frozenRelease,
    interpretation: diagnosticOnly
      ? "Smoke/development diagnostic only; no superiority, energy-efficiency, or promotion claim is permitted."
      : "Held-out confirmatory analysis under the frozen gatekeeping plan.",
    eligible_for_superiority_claim: claimAllowed,
    decision: killReasons.length ? "kill" : claimAllowed ? "eligible" : "abstain",
    abstain_reasons: abstainReasons,
    kill_reasons: [...new Set(killReasons)],
    validation_errors: errors,
    gates: {
      safety_noninferiority: diagnosticOnly ? "not-opened" : safety ? "passed" : "failed-or-not-evaluable",
      loss_superiority: !safety ? "not-opened" : loss ? "passed" : "failed",
      resource_superiority: !(safety && loss) ? "not-opened" : resources ? "passed" : "failed",
    },
    multiplicity: preregistration.multiplicity,
    effects: contrasts,
  };
}
