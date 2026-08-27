import { createHash } from "node:crypto";

export const FIXTURE_026_RSD_T02_HOLM4_VERSION =
  "fixture-026.rsd-t02-holm4.v1";

export const FIXTURE_026_RSD_T02_REGISTERED_HYPOTHESES = Object.freeze([
  Object.freeze({
    hypothesis_id: "H-LOGLOSS-C-vs-STATE-SPACE",
    endpoint: "mean_property_log_loss_nats",
    candidate_arm_id: "C-MECHANISM-BANK",
    comparator_arm_id: "B-STATE-SPACE",
  }),
  Object.freeze({
    hypothesis_id: "H-LOGLOSS-C-vs-RECURRENT",
    endpoint: "mean_property_log_loss_nats",
    candidate_arm_id: "C-MECHANISM-BANK",
    comparator_arm_id: "B-RECURRENT",
  }),
  Object.freeze({
    hypothesis_id: "H-DECISION-C-vs-STATE-SPACE",
    endpoint: "mean_decision_loss_dimensionless",
    candidate_arm_id: "C-MECHANISM-BANK",
    comparator_arm_id: "B-STATE-SPACE",
  }),
  Object.freeze({
    hypothesis_id: "H-DECISION-C-vs-RECURRENT",
    endpoint: "mean_decision_loss_dimensionless",
    candidate_arm_id: "C-MECHANISM-BANK",
    comparator_arm_id: "B-RECURRENT",
  }),
]);

const HYPOTHESIS_BY_ID = new Map(
  FIXTURE_026_RSD_T02_REGISTERED_HYPOTHESES.map((row) => [row.hypothesis_id, row]),
);
const REGISTERED_ARM_IDS = Object.freeze([
  "C-MECHANISM-BANK",
  "B-STATE-SPACE",
  "B-RECURRENT",
]);
const ENDPOINTS = Object.freeze([
  "mean_property_log_loss_nats",
  "mean_decision_loss_dimensionless",
]);
const SHA256_PATTERN = /^[0-9a-f]{64}$/u;
const IDENTIFIER_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._-]{2,127}$/u;

function refuse(message) {
  throw new Error(`Fixture 026 RSD-T02 Holm-4 refused: ${message}`);
}

function finiteProbability(value) {
  return Number.isFinite(value) && value >= 0 && value <= 1;
}

export function applyFixture026RsdT02Holm4(rows, alpha = 0.05) {
  if (!Number.isFinite(alpha) || alpha <= 0 || alpha >= 1) {
    refuse("familywise alpha must lie strictly between zero and one");
  }
  if (!Array.isArray(rows) || rows.length !== 4) {
    refuse("exactly four registered hypotheses are required");
  }
  const seen = new Set();
  const validated = rows.map((row, index) => {
    if (
      !row
      || typeof row !== "object"
      || !HYPOTHESIS_BY_ID.has(row.hypothesis_id)
      || !finiteProbability(row.raw_p)
    ) refuse(`invalid hypothesis row at index ${index}`);
    if (seen.has(row.hypothesis_id)) refuse(`duplicate hypothesis ${row.hypothesis_id}`);
    seen.add(row.hypothesis_id);
    return { hypothesis_id: row.hypothesis_id, raw_p: row.raw_p };
  });
  if (seen.size !== HYPOTHESIS_BY_ID.size) refuse("the registered Holm family is incomplete");

  const sorted = [...validated].sort(
    (left, right) => left.raw_p - right.raw_p
      || left.hypothesis_id.localeCompare(right.hypothesis_id),
  );
  let runningAdjusted = 0;
  let rejectionPathOpen = true;
  const byId = new Map();
  for (const [index, row] of sorted.entries()) {
    const rank = index + 1;
    const remaining = sorted.length - index;
    const threshold = alpha / remaining;
    const adjustedP = Math.min(1, Math.max(runningAdjusted, row.raw_p * remaining));
    runningAdjusted = adjustedP;
    const rejected = rejectionPathOpen && row.raw_p <= threshold;
    if (!rejected) rejectionPathOpen = false;
    byId.set(row.hypothesis_id, Object.freeze({
      ...HYPOTHESIS_BY_ID.get(row.hypothesis_id),
      rank,
      raw_p: row.raw_p,
      holm_threshold: threshold,
      adjusted_p: adjustedP,
      rejected,
    }));
  }
  return Object.freeze({
    schema: 1,
    contract_version: FIXTURE_026_RSD_T02_HOLM4_VERSION,
    familywise_alpha: alpha,
    multiplicity_family_size: 4,
    ordering_rule: "ascending-raw-p-then-hypothesis-id",
    rejection_rule: "sequentially-rejective-holm-step-down",
    hypotheses: Object.freeze(
      FIXTURE_026_RSD_T02_REGISTERED_HYPOTHESES.map((row) => byId.get(row.hypothesis_id)),
    ),
    mathematical_rejection_count: [...byId.values()].filter((row) => row.rejected).length,
    comparison_inference_permitted: false,
    claim_eligible: false,
    result_label: "NO_RESULT",
  });
}

function validateAnalysisRecord(record, index) {
  if (!record || typeof record !== "object" || Array.isArray(record)) {
    refuse(`record ${index} is not an object`);
  }
  if (!SHA256_PATTERN.test(record.system_instance_id ?? "")) {
    refuse(`record ${index} has an invalid system-instance ID`);
  }
  if (!SHA256_PATTERN.test(record.scientific_identity_sha256 ?? "")) {
    refuse(`record ${index} has an invalid scientific-identity hash`);
  }
  if (!IDENTIFIER_PATTERN.test(record.family_id ?? "")) {
    refuse(`record ${index} has an invalid family ID`);
  }
  if (!REGISTERED_ARM_IDS.includes(record.arm_id)) {
    refuse(`record ${index} has an unregistered arm`);
  }
  if (record.pre_response_valid !== true) {
    refuse(`record ${index} is not pre-response valid`);
  }
  if (typeof record.runtime_failure !== "boolean") {
    refuse(`record ${index} lacks a typed runtime-failure disposition`);
  }
  for (const endpoint of ENDPOINTS) {
    if (!Number.isFinite(record[endpoint]) || record[endpoint] < 0) {
      refuse(`record ${index} has invalid ${endpoint}`);
    }
  }
}

function canonicalRecordValue(record) {
  return JSON.stringify({
    family_id: record.family_id,
    arm_id: record.arm_id,
    runtime_failure: record.runtime_failure,
    mean_property_log_loss_nats: record.mean_property_log_loss_nats,
    mean_decision_loss_dimensionless: record.mean_decision_loss_dimensionless,
  });
}

function equalFamilyStatistic(differences) {
  const families = new Map();
  for (const row of differences) {
    const values = families.get(row.family_id) ?? [];
    values.push(row.value);
    families.set(row.family_id, values);
  }
  const familyMeans = [...families.entries()]
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([familyId, values]) => {
      const mean = values.reduce((sum, value) => sum + value, 0) / values.length;
      const sampleVariance = values.length > 1
        ? values.reduce((sum, value) => sum + (value - mean) ** 2, 0) / (values.length - 1)
        : Number.NaN;
      return {
        family_id: familyId,
        effective_system_instance_n: values.length,
        mean_difference: mean,
        sample_variance: sampleVariance,
      };
    });
  const familyCount = familyMeans.length;
  const variance = familyMeans.reduce(
    (sum, row) => sum + row.sample_variance / row.effective_system_instance_n,
    0,
  ) / (familyCount ** 2);
  return {
    effect: familyMeans.reduce((sum, row) => sum + row.mean_difference, 0) / familyMeans.length,
    standardError: Math.sqrt(variance),
    familyMeans,
  };
}

function deterministicIndex(key, drawIndex, familyId, position, count) {
  const range = 0x1_0000_0000;
  const limit = Math.floor(range / count) * count;
  for (let attempt = 0; attempt < 1024; attempt += 1) {
    const word = createHash("sha256")
      .update(`${FIXTURE_026_RSD_T02_HOLM4_VERSION}\u0000${key}\u0000${drawIndex}\u0000${familyId}\u0000${position}\u0000${attempt}`)
      .digest()
      .readUInt32BE(0);
    if (word < limit) return word % count;
  }
  refuse("deterministic bootstrap index rejection limit was exceeded");
}

function stratifiedBootstrapTP({
  differences,
  observed,
  resamples,
  resamplingKey,
  firstHolmThreshold,
}) {
  if (!Number.isSafeInteger(resamples) || resamples < 1000 || resamples > 1_000_000) {
    refuse("bootstrap resamples must be an integer from 1,000 through 1,000,000");
  }
  if (typeof resamplingKey !== "string" || resamplingKey.length < 16) {
    refuse("a frozen resampling key of at least 16 characters is required");
  }
  if (!Number.isFinite(observed.standardError) || observed.standardError <= 0) {
    return {
      raw_p: 1,
      method: "degenerate-zero-standard-error-no-rejection",
      resample_count: 0,
      invalid_resample_count: 0,
      invalid_resample_fraction: 1,
      data_dependent_p_floor: 1,
      first_holm_threshold_attainable: false,
      plus_one_correction: false,
    };
  }
  const observedT = observed.effect / observed.standardError;
  const centeredByFamily = new Map();
  for (const row of differences) {
    const values = centeredByFamily.get(row.family_id) ?? [];
    values.push(row.value - observed.effect);
    centeredByFamily.set(row.family_id, values);
  }
  let extreme = 0;
  let invalid = 0;
  for (let draw = 0; draw < resamples; draw += 1) {
    const sampled = [];
    for (const [familyId, values] of [...centeredByFamily.entries()].sort(([a], [b]) => a.localeCompare(b))) {
      for (let position = 0; position < values.length; position += 1) {
        sampled.push({
          family_id: familyId,
          value: values[deterministicIndex(
            resamplingKey, draw, familyId, position, values.length,
          )],
        });
      }
    }
    const statistic = equalFamilyStatistic(sampled);
    if (!Number.isFinite(statistic.standardError) || statistic.standardError <= 0) {
      invalid += 1;
      extreme += 1;
    } else if (statistic.effect / statistic.standardError <= observedT) {
      extreme += 1;
    }
  }
  const dataDependentPFloor = (invalid + 1) / (resamples + 1);
  return {
    raw_p: (extreme + 1) / (resamples + 1),
    method: "deterministic-sha256-centered-stratified-bootstrap-t",
    resample_count: resamples,
    invalid_resample_count: invalid,
    invalid_resample_fraction: invalid / resamples,
    data_dependent_p_floor: dataDependentPFloor,
    first_holm_threshold_attainable: dataDependentPFloor <= firstHolmThreshold,
    plus_one_correction: true,
  };
}

export function analyzeFixture026RsdT02PairedPanel({
  records,
  registered_family_ids: registeredFamilyIds,
  familywise_alpha: familywiseAlpha = 0.05,
  bootstrap_resamples: resamples = 10000,
  resampling_key: resamplingKey = "fixture-026-rsd-t02-holm4-v1",
  runtime_failure_penalties: runtimeFailurePenalties,
}) {
  try {
    if (!Array.isArray(records) || records.length < 1) refuse("records are required");
    if (
      !Array.isArray(registeredFamilyIds)
      || registeredFamilyIds.length < 2
      || new Set(registeredFamilyIds).size !== registeredFamilyIds.length
      || registeredFamilyIds.some((id) => !IDENTIFIER_PATTERN.test(id))
    ) refuse("at least two unique registered family IDs are required");
    if (!runtimeFailurePenalties || typeof runtimeFailurePenalties !== "object") {
      refuse("registered runtime-failure penalties are required");
    }
    for (const endpoint of ENDPOINTS) {
      if (!Number.isFinite(runtimeFailurePenalties[endpoint]) || runtimeFailurePenalties[endpoint] < 0) {
        refuse(`runtime-failure penalty is invalid for ${endpoint}`);
      }
    }
    const registeredFamilySet = new Set(registeredFamilyIds);
    const identityArmRows = new Map();
    const systemIdsByScientificIdentity = new Map();
    const instanceToIdentity = new Map();
    for (const [index, record] of records.entries()) {
      validateAnalysisRecord(record, index);
      if (
        record.runtime_failure
        && ENDPOINTS.some((endpoint) => record[endpoint] !== runtimeFailurePenalties[endpoint])
      ) refuse(`record ${index} does not use the registered runtime-failure penalties`);
      if (!registeredFamilySet.has(record.family_id)) {
        refuse(`record ${index} belongs to an unregistered family`);
      }
      const previousIdentity = instanceToIdentity.get(record.system_instance_id);
      if (previousIdentity && previousIdentity !== record.scientific_identity_sha256) {
        refuse(`system-instance ID ${record.system_instance_id} changes scientific identity`);
      }
      instanceToIdentity.set(record.system_instance_id, record.scientific_identity_sha256);
      const systemIds = systemIdsByScientificIdentity.get(record.scientific_identity_sha256)
        ?? new Set();
      systemIds.add(record.system_instance_id);
      systemIdsByScientificIdentity.set(record.scientific_identity_sha256, systemIds);
      const key = `${record.scientific_identity_sha256}\u0000${record.arm_id}`;
      const previous = identityArmRows.get(key);
      if (previous && canonicalRecordValue(previous) !== canonicalRecordValue(record)) {
        refuse(`hash-identical system has conflicting arm outcome: ${key}`);
      }
      identityArmRows.set(key, record);
    }

    const byIdentity = new Map();
    for (const record of identityArmRows.values()) {
      const group = byIdentity.get(record.scientific_identity_sha256) ?? new Map();
      group.set(record.arm_id, record);
      byIdentity.set(record.scientific_identity_sha256, group);
    }
    const collapsed = [];
    for (const [identity, arms] of [...byIdentity.entries()].sort(([a], [b]) => a.localeCompare(b))) {
      if (arms.size !== REGISTERED_ARM_IDS.length || REGISTERED_ARM_IDS.some((arm) => !arms.has(arm))) {
        refuse(`scientific identity ${identity} lacks a registered paired arm`);
      }
      const familyIds = new Set([...arms.values()].map((row) => row.family_id));
      if (familyIds.size !== 1) refuse(`scientific identity ${identity} changes family across arms`);
      collapsed.push({ identity, family_id: [...familyIds][0], arms });
    }
    const observedFamilies = new Set(collapsed.map((row) => row.family_id));
    if (
      observedFamilies.size !== registeredFamilySet.size
      || registeredFamilyIds.some((familyId) => !observedFamilies.has(familyId))
    ) refuse("the paired panel does not contain every registered family");
    for (const familyId of registeredFamilyIds) {
      if (collapsed.filter((row) => row.family_id === familyId).length < 2) {
        refuse(`family ${familyId} has fewer than two effective system instances`);
      }
    }

    const hypothesisRows = [];
    const effects = [];
    for (const hypothesis of FIXTURE_026_RSD_T02_REGISTERED_HYPOTHESES) {
      const differences = collapsed.map((row) => ({
        family_id: row.family_id,
        value: row.arms.get(hypothesis.candidate_arm_id)[hypothesis.endpoint]
          - row.arms.get(hypothesis.comparator_arm_id)[hypothesis.endpoint],
      }));
      const summary = equalFamilyStatistic(differences);
      const bootstrap = stratifiedBootstrapTP({
        differences,
        observed: summary,
        resamples,
        resamplingKey: `${resamplingKey}\u0000${hypothesis.hypothesis_id}`,
        firstHolmThreshold: familywiseAlpha / FIXTURE_026_RSD_T02_REGISTERED_HYPOTHESES.length,
      });
      hypothesisRows.push({ hypothesis_id: hypothesis.hypothesis_id, raw_p: bootstrap.raw_p });
      effects.push(Object.freeze({
        ...hypothesis,
        candidate_minus_comparator: summary.effect,
        standard_error: summary.standardError,
        lower_is_better: true,
        family_summaries: Object.freeze(summary.familyMeans.map(Object.freeze)),
        effective_system_instance_n: differences.length,
        raw_p: bootstrap.raw_p,
        inference_method: bootstrap.method,
        bootstrap_resample_count: bootstrap.resample_count,
        invalid_bootstrap_resample_count: bootstrap.invalid_resample_count,
        invalid_bootstrap_resample_fraction: bootstrap.invalid_resample_fraction,
        data_dependent_bootstrap_p_floor: bootstrap.data_dependent_p_floor,
        first_holm_threshold_attainable: bootstrap.first_holm_threshold_attainable,
        plus_one_correction: bootstrap.plus_one_correction,
        assumption: "independent paired system instances within fixed families; centered stratified bootstrap-t is an asymptotic test of the equal-family mean contrast",
        family_superpopulation_inference_permitted: false,
      }));
    }
    const holm = applyFixture026RsdT02Holm4(hypothesisRows, familywiseAlpha);
    const holmById = new Map(holm.hypotheses.map((row) => [row.hypothesis_id, row]));
    return Object.freeze({
      schema: 1,
      contract_version: FIXTURE_026_RSD_T02_HOLM4_VERSION,
      validation_errors: Object.freeze([]),
      independent_unit: "system-instance",
      family_estimand: "equal-weighted-mean-over-registered-fixed-families",
      effective_system_instance_n: collapsed.length,
      registered_family_n: registeredFamilyIds.length,
      duplicate_arm_rows_collapsed: records.length - identityArmRows.size,
      duplicated_scientific_identity_n: [...systemIdsByScientificIdentity.values()]
        .filter((systemIds) => systemIds.size > 1).length,
      analysis_contract_binding_status: "unregistered-public-method-check-inputs",
      familywise_alpha_source: "caller-supplied-method-check-only",
      runtime_failure_penalty_source: "caller-supplied-method-check-only",
      resampling_key_sha256: createHash("sha256").update(resamplingKey).digest("hex"),
      bootstrap_resolution_gate_satisfied: effects.every(
        (row) => row.first_holm_threshold_attainable,
      ),
      bootstrap_resolution_gate_rule: "for-every-hypothesis-(invalid-resamples+1)/(B+1)-must-not-exceed-alpha/4",
      effects: Object.freeze(effects.map((row) => Object.freeze({
        ...row,
        holm_rank: holmById.get(row.hypothesis_id).rank,
        holm_threshold: holmById.get(row.hypothesis_id).holm_threshold,
        holm_adjusted_p: holmById.get(row.hypothesis_id).adjusted_p,
        mathematical_rejection: holmById.get(row.hypothesis_id).rejected,
      }))),
      holm,
      comparison_inference_permitted: false,
      design_gate_satisfied: false,
      claim_eligible: false,
      result_label: "NO_RESULT",
      interpretation: "Synthetic analyzer execution only; mature models, frozen power, custody and one-pass confirmation remain required.",
    });
  } catch (error) {
    return Object.freeze({
      schema: 1,
      contract_version: FIXTURE_026_RSD_T02_HOLM4_VERSION,
      validation_errors: Object.freeze([error.message]),
      independent_unit: "system-instance",
      effects: Object.freeze([]),
      holm: null,
      bootstrap_resolution_gate_satisfied: false,
      comparison_inference_permitted: false,
      claim_eligible: false,
      result_label: "NO_RESULT",
      interpretation: "Analysis refused before any comparison calculation.",
    });
  }
}
