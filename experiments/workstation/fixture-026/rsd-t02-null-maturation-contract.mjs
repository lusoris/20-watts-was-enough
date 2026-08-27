import { canonicalize, sha256Hex } from "../lib/checkpoint-ledger.mjs";

export const FIXTURE_026_RSD_T02_NULL_MATURATION_DESIGN_VERSION =
  "fixture-026.rsd-t02-null-maturation-design.v1";
export const FIXTURE_026_RSD_T02_NULL_MATURATION_DESIGN_SHA256 =
  "b052d9ea6b6321b3dd7a9a1a3cc2bac91b0cae9585bdd767d778cb38a8d8ab5c";

const REQUIRED_NULLS = Object.freeze(["B-STATE-SPACE", "B-RECURRENT"]);
const REQUIRED_PRIMARY_PROPERTIES = Object.freeze([
  "drive_transform",
  "reported_output_feedback_edge",
  "channel_local_state",
]);

function digest(value) {
  try {
    return sha256Hex(canonicalize(value));
  } catch {
    throw new Error("Fixture 026 RSD-T02 null maturation refused: noncanonical input");
  }
}

function refuse(message) {
  throw new Error(`Fixture 026 RSD-T02 null maturation refused: ${message}`);
}

function exactKeys(value, keys) {
  return value
    && typeof value === "object"
    && !Array.isArray(value)
    && Object.keys(value).length === keys.length
    && keys.every((key) => Object.hasOwn(value, key));
}

export function deriveFixture026RsdT02NullAuthority({
  promotion_gates: promotionGates,
  active_fitting_blockers: activeFittingBlockers,
  measured_energy_claim: measuredEnergyClaim,
}) {
  const scopes = ["null_maturity", "comparison_release", "energy_comparison_conditional"];
  if (
    !exactKeys(promotionGates, scopes)
    || typeof measuredEnergyClaim !== "boolean"
    || !Array.isArray(activeFittingBlockers)
    || activeFittingBlockers.some((blocker) => typeof blocker !== "string" || blocker.length < 3)
    || new Set(activeFittingBlockers).size !== activeFittingBlockers.length
  ) refuse("gate derivation needs closed scopes, unique blockers, and an explicit energy-claim boolean");

  const gateIds = new Set();
  for (const scope of scopes) {
    const gates = promotionGates[scope];
    if (
      !Array.isArray(gates)
      || gates.length < 1
      || gates.some((gate) => (
        !exactKeys(gate, ["gate", "satisfied"])
        || typeof gate.gate !== "string"
        || gate.gate.length < 3
        || typeof gate.satisfied !== "boolean"
      ))
    ) refuse(`invalid ${scope} gate array`);
    for (const { gate } of gates) {
      if (gateIds.has(gate)) refuse(`duplicate gate ${gate}`);
      gateIds.add(gate);
    }
  }

  const affectedFittingPermitted = activeFittingBlockers.length === 0;
  const intrinsicNullGatesSatisfied = promotionGates.null_maturity
    .every(({ satisfied }) => satisfied);
  const matureNullGateSatisfied = affectedFittingPermitted && intrinsicNullGatesSatisfied;
  const comparisonReleaseGateSatisfied = matureNullGateSatisfied
    && promotionGates.comparison_release.every(({ satisfied }) => satisfied);
  const energyGatesSatisfied = promotionGates.energy_comparison_conditional
    .every(({ satisfied }) => satisfied);
  const applicableScopes = measuredEnergyClaim
    ? scopes
    : ["null_maturity", "comparison_release"];
  const applicableGates = applicableScopes.flatMap((scope) => (
    promotionGates[scope].map((gate) => ({ scope, ...gate }))
  ));
  const satisfiedGates = applicableGates
    .filter(({ satisfied }) => satisfied)
    .map(({ scope, gate }) => `${scope}:${gate}`);
  const unsatisfiedGates = applicableGates
    .filter(({ satisfied }) => !satisfied)
    .map(({ scope, gate }) => `${scope}:${gate}`);

  return Object.freeze({
    affected_fitting_permitted: affectedFittingPermitted,
    active_fitting_blocker_count: activeFittingBlockers.length,
    intrinsic_null_gates_satisfied: intrinsicNullGatesSatisfied,
    mature_null_gate_satisfied: matureNullGateSatisfied,
    comparison_release_gate_satisfied: comparisonReleaseGateSatisfied,
    energy_comparison_gate_applicable: measuredEnergyClaim,
    energy_comparison_gate_satisfied: measuredEnergyClaim ? energyGatesSatisfied : null,
    claim_release_gate_satisfied: comparisonReleaseGateSatisfied
      && (!measuredEnergyClaim || energyGatesSatisfied),
    registered_gate_count: scopes.reduce(
      (count, scope) => count + promotionGates[scope].length,
      0,
    ),
    applicable_gate_count: applicableGates.length,
    satisfied_gate_count: satisfiedGates.length,
    unsatisfied_gate_count: unsatisfiedGates.length,
    satisfied_gates: Object.freeze(satisfiedGates),
    unsatisfied_gates: Object.freeze(unsatisfiedGates),
  });
}

export function assertFixture026RsdT02NullMaturationDesign(design) {
  const ladderStatuses = design?.maturity_ladder?.map(({ status }) => status);
  const currentArms = design?.current_implementations?.map(({ arm_id: armId }) => armId);
  const targetArms = design?.target_null_contract?.required_arm_ids;
  const currentAuthority = deriveFixture026RsdT02NullAuthority({
    promotion_gates: design?.promotion_gates,
    active_fitting_blockers: design?.fit_contract?.affected_fitting_blockers,
    measured_energy_claim: false,
  });
  if (
    digest(design) !== FIXTURE_026_RSD_T02_NULL_MATURATION_DESIGN_SHA256
    || design?.schema !== 1
    || design.contract_version !== FIXTURE_026_RSD_T02_NULL_MATURATION_DESIGN_VERSION
    || design.artifact !== "fixture-026"
    || design.track !== "RSD-T02"
    || design.authority !== "prospective-null-maturation-design-only"
    || !Array.isArray(design.parent_artifacts)
    || design.parent_artifacts.length !== 10
    || new Set(design.parent_artifacts.map(({ path }) => path)).size !== 10
    || !Array.isArray(ladderStatuses)
    || ladderStatuses.join("|") !== [
      "fixed-conformance-reference",
      "trainable-public-prototype",
      "fit-frozen-development-estimator",
      "calibrated-development-comparator",
      "confirmation-frozen-mature-null",
      "confirmation-evaluated",
    ].join("|")
    || currentArms?.join("|") !== REQUIRED_NULLS.join("|")
    || targetArms?.join("|") !== REQUIRED_NULLS.join("|")
    || design.current_implementations.some((arm) => (
      arm.current_level !== 1
      || arm.current_status !== "fixed-conformance-reference"
      || arm.calibrated_probability_output_exists !== false
      || arm.satisfies_mature_null_gate !== false
    ))
    || design.target_null_contract.primary_property_keys.join("|")
      !== REQUIRED_PRIMARY_PROPERTIES.join("|")
    || design.target_null_contract.same_fixed_parameter_packet_schema !== true
    || design.target_null_contract.same_allowlisted_causal_fields !== true
    || design.target_null_contract.joint_property_vector_domain_before_causal_memory_activation
      .join("|") !== REQUIRED_PRIMARY_PROPERTIES.join("|")
    || design.target_null_contract.joint_property_vector_domain_after_causal_memory_activation
      .join("|") !== [...REQUIRED_PRIMARY_PROPERTIES, "causal_memory"].join("|")
    || design.development_role_contract.assignment_unit !== "canonical-system-instance-id"
    || design.development_role_contract.current_public_plan_role_assignment_state
      !== "not-created"
    || design.fit_contract.affected_fitting_permitted_now !== false
    || design.fit_contract.training_objective_weight_symbol !== "a_q"
    || design.fit_contract.training_objective_weight_constraints
      !== "nonnegative-and-sum-over-active-properties-equals-one"
    || design.fit_contract.endpoint_aggregation_weight_symbol !== "w_q"
    || design.fit_contract.endpoint_aggregation_weight_constraints
      !== "nonnegative-and-sum-over-active-properties-equals-one"
    || design.fit_contract.endpoint_aggregation_weights_used_for_training !== false
    || design.fit_contract.objective_coefficient_domains?.lambda_E?.lower_bound !== 0
    || design.fit_contract.objective_coefficient_domains.lambda_E.lower_bound_inclusive !== false
    || design.fit_contract.objective_coefficient_domains.lambda_E.unit !== "1"
    || design.fit_contract.objective_coefficient_domains.lambda_E.selection_role !== "fit-only"
    || ["lambda_P", "lambda_R"].some((coefficient) => (
      design.fit_contract.objective_coefficient_domains?.[coefficient]?.lower_bound !== 0
      || design.fit_contract.objective_coefficient_domains[coefficient].lower_bound_inclusive
        !== true
      || design.fit_contract.objective_coefficient_domains[coefficient].unit !== "1"
      || design.fit_contract.objective_coefficient_domains[coefficient].selection_role
        !== "fit-only"
    ))
    || ![
      "equivalence-mass-coefficient-lambda_E",
      "predictive-loss-coefficient-lambda_P",
      "regularizer-coefficient-lambda_R",
    ].every((coefficient) => (
      design.fit_contract.hyperparameters_selected_inside_fit_only.includes(coefficient)
    ))
    || design.fit_contract.deterministic_tie_break_frozen_before_trial_outcomes !== true
    || design.fit_contract.affected_fitting_blockers?.length !== 4
    || design.calibration_and_abstention_contract.calibration_may_change_model_weights
      !== false
    || design.calibration_and_abstention_contract.final_numeric_common_resource_caps_frozen_before_calibration
      !== true
    || design.calibration_and_abstention_contract.support_threshold_tie_rule
      !== "equal-to-threshold-abstains"
    || design.calibration_and_abstention_contract.non_abstention_action_tie_rule
      !== "equal-minimum-expected-loss-across-actions-abstains"
    || design.resource_contract.provisional_pilot_envelope.active_cap !== false
    || design.resource_contract.measured_joules_required_for_energy_comparison !== true
    || design.freeze_order.length !== 14
    || design.freeze_order[7]
      !== "precalibration-support-coverage-floor-frozen-from-fit-only-data"
    || design.freeze_order[8] !== "calibrator-support-and-abstention"
    || design.freeze_order[9] !== "one-pass-development-evaluation-and-pilot-variance"
    || design.freeze_order[10]
      !== "null-work-ledger-and-resource-accounting-audited"
    || design.promotion_gates?.null_maturity?.length !== 10
    || design.promotion_gates?.comparison_release?.length !== 10
    || design.promotion_gates?.energy_comparison_conditional?.length !== 1
    || Object.values(design.promotion_gates).flat()
      .filter(({ satisfied }) => satisfied).length !== 2
    || design.promotion_gates.null_maturity.some(({ satisfied }) => satisfied)
    || design.promotion_gates.energy_comparison_conditional.some(({ satisfied }) => satisfied)
    || design.promotion_gates.comparison_release.some(({ gate, satisfied }) => (
      satisfied && ![
        "versioned-public-family-registry",
        "validated-fixed-parameter-instance-generator",
      ].includes(gate)
    ))
    || !design.promotion_gates.null_maturity.some(({ gate }) => (
      gate === "null-work-ledger-and-resource-accounting-audited"
    ))
    || !design.promotion_gates.comparison_release.some(({ gate }) => (
      gate === "experiment-wide-paired-resource-accounting-audited"
    ))
    || design.promotion_gates.energy_comparison_conditional[0].gate
      !== "measured-energy-meter-protocol-frozen"
    || currentAuthority.active_fitting_blocker_count !== 4
    || currentAuthority.applicable_gate_count !== 20
    || currentAuthority.registered_gate_count !== 21
    || design.mature_null_gate_satisfied !== currentAuthority.mature_null_gate_satisfied
    || design.affected_fitting_permitted !== currentAuthority.affected_fitting_permitted
    || design.comparison_inference_permitted !== false
    || design.claim_eligible !== false
    || design.result_label !== "NO_RESULT"
  ) refuse("design differs from the closed prospective NO_RESULT contract");
  return design;
}

export function assertFixture026RsdT02NullMaturationParents({ design, sourceBytesByPath }) {
  assertFixture026RsdT02NullMaturationDesign(design);
  if (!(sourceBytesByPath instanceof Map)) refuse("parent sources must be a path-to-bytes Map");
  for (const parent of design.parent_artifacts) {
    const bytes = sourceBytesByPath.get(parent.path);
    if (!(bytes instanceof Uint8Array)) refuse(`missing exact parent bytes for ${parent.path}`);
    if (sha256Hex(bytes) !== parent.sha256_exact_bytes) {
      refuse(`parent bytes drifted for ${parent.path}`);
    }
  }
  if (sourceBytesByPath.size !== design.parent_artifacts.length) {
    refuse("parent source map contains unregistered files");
  }
  return true;
}

export function summarizeFixture026RsdT02NullMaturity(
  design,
  { measured_energy_claim: measuredEnergyClaim = false } = {},
) {
  assertFixture026RsdT02NullMaturationDesign(design);
  const authority = deriveFixture026RsdT02NullAuthority({
    promotion_gates: design.promotion_gates,
    active_fitting_blockers: design.fit_contract.affected_fitting_blockers,
    measured_energy_claim: measuredEnergyClaim,
  });
  const unsatisfiedNullMaturityGates = design.promotion_gates.null_maturity
    .filter(({ satisfied }) => !satisfied)
    .map(({ gate }) => gate);
  return Object.freeze({
    arms: Object.freeze(design.current_implementations.map((arm) => Object.freeze({
      arm_id: arm.arm_id,
      current_level: arm.current_level,
      current_status: arm.current_status,
      current_property_coverage: Object.freeze([...arm.current_property_coverage]),
      calibrated_probability_output_exists: arm.calibrated_probability_output_exists,
      satisfies_mature_null_gate: arm.satisfies_mature_null_gate,
    }))),
    highest_common_level: 1,
    highest_common_status: "fixed-conformance-reference",
    registered_gate_count: authority.registered_gate_count,
    total_gate_count: authority.applicable_gate_count,
    satisfied_gate_count: authority.satisfied_gate_count,
    unsatisfied_gate_count: authority.unsatisfied_gate_count,
    satisfied_gates: authority.satisfied_gates,
    unsatisfied_gates: authority.unsatisfied_gates,
    null_maturity_gate_count: design.promotion_gates.null_maturity.length,
    unsatisfied_null_maturity_gate_count: unsatisfiedNullMaturityGates.length,
    unsatisfied_null_maturity_gates: Object.freeze(unsatisfiedNullMaturityGates),
    active_fitting_blocker_count: authority.active_fitting_blocker_count,
    affected_fitting_permitted: authority.affected_fitting_permitted,
    mature_null_gate_satisfied: authority.mature_null_gate_satisfied,
    comparison_inference_permitted: authority.comparison_release_gate_satisfied,
    energy_comparison_gate_applicable: authority.energy_comparison_gate_applicable,
    energy_comparison_gate_satisfied: authority.energy_comparison_gate_satisfied,
    claim_eligible: authority.claim_release_gate_satisfied,
    result_label: "NO_RESULT",
  });
}

export function assertFixture026RsdT02MatureNullAuthority(design) {
  const summary = summarizeFixture026RsdT02NullMaturity(design);
  if (summary.mature_null_gate_satisfied) return true;
  refuse(
    `mature-null authority is absent; ${summary.unsatisfied_null_maturity_gate_count} null-maturity gates and ${summary.active_fitting_blocker_count} fitting blockers remain`,
  );
}
