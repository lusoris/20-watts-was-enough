import { canonicalize, sha256Hex } from "../lib/checkpoint-ledger.mjs";

export const FIXTURE_026_RSD_T02_STAGE3_DESIGN_VERSION =
  "fixture-026.rsd-t02-stage3-design.v1";

const DESIGN_KEYS = Object.freeze([
  "schema", "contract_version", "artifact", "track", "authority",
  "information_cut", "replication_boundary", "reference_arms",
  "endpoint_contract", "resource_contract", "promotion_gates",
  "comparison_inference_permitted", "claim_eligible", "result_label",
]);
const CUT_KEYS = Object.freeze([
  "source_seed_path", "source_seed_sha256", "source_seed_count",
  "assignment_algorithm", "expected_assignment_sha256", "roles",
]);
const ROLE_KEYS = Object.freeze([
  "role", "offset", "count", "permitted_actions", "forbidden_actions",
]);
const REPLICATION_KEYS = Object.freeze([
  "current_seed_effect", "current_seeds_are_independent_scientific_units",
  "seed_level_inferential_replication_permitted", "current_split_use",
  "future_unit_of_analysis", "outer_system_family_holdout_required",
]);
const ARM_KEYS = Object.freeze([
  "arm_id", "target_role", "construction_status", "model_family",
  "information_access", "direct-plant-state-access", "recipe-or-equation-access",
]);
const ENDPOINT_KEYS = Object.freeze([
  "primary_endpoints", "required_companion_reports", "primary_contrasts",
  "familywise_alpha", "multiplicity_rule", "current_power_status",
  "power-analysis_timing",
]);
const RESOURCE_KEYS = Object.freeze([
  "same-observation-packet", "same-intervention-budget",
  "training-and-selection-costs-charged", "calibration-costs-charged",
  "failed-trials-charged", "fallbacks-charged",
  "measured-joules-required-for-energy-comparison", "numeric-training-caps",
  "evaluation-cap-change-permitted",
]);

const EXPECTED_ROLES = Object.freeze([
  Object.freeze({
    role: "fit", offset: 0, count: 32,
    permitted_actions: Object.freeze([
      "fit-parameters", "fit-only-model-selection", "fit-only-cross-validation",
      "write-frozen-model-artifact",
    ]),
    forbidden_actions: Object.freeze([
      "read-calibration-responses", "read-evaluation-responses",
      "set-final-decision-thresholds", "claim-comparison",
    ]),
  }),
  Object.freeze({
    role: "calibration", offset: 32, count: 16,
    permitted_actions: Object.freeze([
      "calibrate-probabilities", "set-frozen-abstention-thresholds",
      "set-frozen-support-thresholds", "write-frozen-calibration-artifact",
    ]),
    forbidden_actions: Object.freeze([
      "fit-model-parameters", "change-model-family", "read-evaluation-responses",
      "claim-comparison",
    ]),
  }),
  Object.freeze({
    role: "evaluation", offset: 48, count: 16,
    permitted_actions: Object.freeze([
      "frozen-inference", "frozen-scoring",
      "write-append-only-evaluation-artifact",
    ]),
    forbidden_actions: Object.freeze([
      "fit-model-parameters", "change-model-family", "change-any-threshold",
      "drop-supported-unit-after-scoring", "claim-comparison",
    ]),
  }),
]);

const EXPECTED_ARMS = Object.freeze([
  Object.freeze({
    arm_id: "B-STATE-SPACE",
    target_role: "mature-generic-null",
    construction_status: "not-implemented",
    model_family: "causal-nonlinear-state-space-property-estimator",
    information_access: "same-35-projection-causal-packet",
    "direct-plant-state-access": false,
    "recipe-or-equation-access": false,
  }),
  Object.freeze({
    arm_id: "B-RECURRENT",
    target_role: "mature-generic-null",
    construction_status: "not-implemented",
    model_family: "causal-compact-recurrent-property-estimator",
    information_access: "same-35-projection-causal-packet",
    "direct-plant-state-access": false,
    "recipe-or-equation-access": false,
  }),
  Object.freeze({
    arm_id: "C-MECHANISM-BANK",
    target_role: "source-shaped-candidate",
    construction_status: "fixed-conformance-reference-only",
    model_family: "registered-mechanism-signature-bank",
    information_access: "same-35-projection-causal-packet",
    "direct-plant-state-access": false,
    "recipe-or-equation-access": false,
  }),
]);

const EXPECTED_PROMOTION_GATES = Object.freeze([
  "independent-system-instances-exist",
  "outer-system-family-holdout-frozen",
  "two-generic-null-implementations-frozen",
  "fit-artifacts-frozen-before-calibration",
  "calibration-artifacts-frozen-before-evaluation",
  "resource-caps-frozen-before-evaluation",
  "private-confirmation-power-and-custody-frozen",
  "all-primary-contrasts-and-loss-directions-preregistered",
]);
const EXPECTED_SOURCE_SEEDS = Object.freeze(Array.from(
  { length: 64 },
  (_, index) => String(1540001 + index),
));

function exactKeys(value, keys) {
  return value
    && typeof value === "object"
    && !Array.isArray(value)
    && Object.keys(value).length === keys.length
    && keys.every((key) => Object.hasOwn(value, key));
}

function exactJson(value, expected) {
  return canonicalize(value) === canonicalize(expected);
}

function canonicalSeed(seed) {
  return typeof seed === "string"
    && /^(0|[1-9][0-9]{0,19})$/u.test(seed)
    && BigInt(seed) <= 0xffff_ffff_ffff_ffffn;
}

export function assertFixture026RsdT02Stage3Design(design) {
  if (
    !exactKeys(design, DESIGN_KEYS)
    || design.schema !== 1
    || design.contract_version !== FIXTURE_026_RSD_T02_STAGE3_DESIGN_VERSION
    || design.artifact !== "fixture-026"
    || design.track !== "RSD-T02"
    || design.authority !== "prospective-public-development-design-only"
    || !exactKeys(design.information_cut, CUT_KEYS)
    || design.information_cut.source_seed_path !== "seeds/development.reveal.json"
    || !/^[0-9a-f]{64}$/u.test(design.information_cut.source_seed_sha256)
    || design.information_cut.source_seed_count !== 64
    || design.information_cut.assignment_algorithm !== "contiguous-ordered-public-seeds-v1"
    || design.information_cut.expected_assignment_sha256
      !== "f7756f427c605f789c745ce74716fbef56b76ebef5d1c29ca9a81002a545e1f0"
    || !Array.isArray(design.information_cut.roles)
    || design.information_cut.roles.length !== 3
    || design.information_cut.roles.some((role) => !exactKeys(role, ROLE_KEYS))
    || !exactJson(design.information_cut.roles, EXPECTED_ROLES)
    || !exactKeys(design.replication_boundary, REPLICATION_KEYS)
    || !exactJson(design.replication_boundary, {
      current_seed_effect: "opaque-state-handle-permutation-only",
      current_seeds_are_independent_scientific_units: false,
      seed_level_inferential_replication_permitted: false,
      current_split_use: "software-and-procedural-development-only",
      future_unit_of_analysis: "independently-generated-held-out-system-instance",
      outer_system_family_holdout_required: true,
    })
    || !Array.isArray(design.reference_arms)
    || design.reference_arms.length !== 3
    || design.reference_arms.some((arm) => !exactKeys(arm, ARM_KEYS))
    || !exactJson(design.reference_arms, EXPECTED_ARMS)
    || !exactKeys(design.endpoint_contract, ENDPOINT_KEYS)
    || !exactJson(design.endpoint_contract, {
      primary_endpoints: [
        "mean-property-log-loss-nats", "mean-decision-loss-dimensionless",
      ],
      required_companion_reports: [
        "coverage", "selective-risk", "reliability-by-property",
        "joint-compatible-vector-coverage", "resource-vector",
      ],
      primary_contrasts: [
        "C-MECHANISM-BANK-minus-B-STATE-SPACE",
        "C-MECHANISM-BANK-minus-B-RECURRENT",
      ],
      familywise_alpha: 0.05,
      multiplicity_rule: "holm-over-fixed-primary-contrast-by-endpoint-family",
      current_power_status: "not-powered-current-split",
      "power-analysis_timing": "before-private-confirmation-seed-creation",
    })
    || !exactKeys(design.resource_contract, RESOURCE_KEYS)
    || !exactJson(design.resource_contract, {
      "same-observation-packet": true,
      "same-intervention-budget": true,
      "training-and-selection-costs-charged": true,
      "calibration-costs-charged": true,
      "failed-trials-charged": true,
      "fallbacks-charged": true,
      "measured-joules-required-for-energy-comparison": true,
      "numeric-training-caps": "must-be-frozen-after-fit-only-pilot-before-calibration",
      "evaluation-cap-change-permitted": false,
    })
    || !Array.isArray(design.promotion_gates)
    || !exactJson(design.promotion_gates, EXPECTED_PROMOTION_GATES)
    || design.comparison_inference_permitted !== false
    || design.claim_eligible !== false
    || design.result_label !== "NO_RESULT"
  ) throw new Error("Fixture 026 RSD-T02 Stage-3 design violates its closed contract.");
  return design;
}

export function buildFixture026RsdT02Stage3Assignment({
  design,
  seedDocument,
  sourceSeedSha256,
}) {
  assertFixture026RsdT02Stage3Design(design);
  if (
    !exactKeys(seedDocument, [
      "schema", "artifact", "partition", "state", "algorithm", "encoding", "seeds",
    ])
    || seedDocument.schema !== 2
    || seedDocument.artifact !== "fixture-026"
    || seedDocument.partition !== "development"
    || seedDocument.state !== "public-development"
    || seedDocument.algorithm !== "literal-public-seed-list-v2"
    || seedDocument.encoding !== "unsigned-little-endian-uint64"
    || !Array.isArray(seedDocument.seeds)
    || seedDocument.seeds.length !== design.information_cut.source_seed_count
    || seedDocument.seeds.some((seed) => !canonicalSeed(seed))
    || new Set(seedDocument.seeds).size !== seedDocument.seeds.length
    || !exactJson(seedDocument.seeds, EXPECTED_SOURCE_SEEDS)
    || sourceSeedSha256 !== design.information_cut.source_seed_sha256
  ) throw new Error("Fixture 026 RSD-T02 Stage-3 source seed identity is invalid.");

  const roles = design.information_cut.roles.map(({ role, offset, count }) => Object.freeze({
    role,
    seeds: Object.freeze(seedDocument.seeds.slice(offset, offset + count)),
  }));
  const assigned = roles.flatMap(({ seeds }) => seeds);
  if (
    assigned.length !== 64
    || new Set(assigned).size !== 64
    || !assigned.every((seed, index) => seed === seedDocument.seeds[index])
  ) throw new Error("Fixture 026 RSD-T02 Stage-3 roles do not partition the seed pack exactly.");

  const assignmentBody = {
    schema: 1,
    contract_version: FIXTURE_026_RSD_T02_STAGE3_DESIGN_VERSION,
    artifact: "fixture-026",
    track: "RSD-T02",
    source_seed_sha256: sourceSeedSha256,
    roles,
    replication_authority: "procedural-partitions-not-independent-scientific-replicates",
    comparison_inference_permitted: false,
    claim_eligible: false,
    result_label: "NO_RESULT",
  };
  const assignment = {
    ...assignmentBody,
    roles: Object.freeze(roles),
    assignment_sha256: sha256Hex(canonicalize(assignmentBody)),
  };
  if (assignment.assignment_sha256 !== design.information_cut.expected_assignment_sha256) {
    throw new Error("Fixture 026 RSD-T02 Stage-3 assignment identity drifted.");
  }
  return Object.freeze(assignment);
}

export function assertFixture026RsdT02Stage3Action(design, roleName, action) {
  assertFixture026RsdT02Stage3Design(design);
  const role = design.information_cut.roles.find(({ role: name }) => name === roleName);
  if (!role) throw new RangeError(`Unknown RSD-T02 Stage-3 role: ${roleName}`);
  if (role.forbidden_actions.includes(action) || !role.permitted_actions.includes(action)) {
    throw new Error(`RSD-T02 Stage-3 ${roleName} role forbids action: ${action}`);
  }
  return true;
}
