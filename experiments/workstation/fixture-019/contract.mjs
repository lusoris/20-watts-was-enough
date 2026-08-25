import { canonicalize, sha256Hex } from "../lib/checkpoint-ledger.mjs";

export const FIXTURE_019_CONTRACT_VERSION = "fixture-019.fm-t02-work-unit.v2";

const cells = new Set(["base", "eta-zero", "overlap-high", "funding-on"]);
const armNames = Object.freeze([
  "zero-impact",
  "one-pass",
  "full-fixed-point",
  "full-fixed-point-with-funding",
  "staged-liquidation-fallback",
]);

function exactKeys(value, keys) {
  return value
    && typeof value === "object"
    && !Array.isArray(value)
    && canonicalize(Object.keys(value).sort()) === canonicalize([...keys].sort());
}

function finite(value) {
  return typeof value === "number" && Number.isFinite(value);
}

function nonnegative(value) {
  return finite(value) && value >= 0;
}

function assertUint64String(value) {
  if (typeof value !== "string" || !/^(?:0|[1-9][0-9]{0,19})$/.test(value)) {
    throw new Error("Fixture 019 seed is not a canonical uint64 decimal string.");
  }
  if (BigInt(value) > 0xffff_ffff_ffff_ffffn) throw new Error("Fixture 019 seed exceeds uint64.");
}

function assertTerminal(value, kind) {
  const versionKey = kind === "truth" ? "evaluator_version" : "simulator_version";
  const common = [
    versionKey,
    "terminal_status",
    "delta_equity",
    "terminal_equity",
    "defaults",
    "creditor_shortfall",
    "price_drawdown_percentage_points",
    "sale_quantity_asset_units",
    "rounds",
    "converged",
    "funding_triggered",
    "funding_call_executed",
    "funding_call_count",
    "price_floor_hit",
    "max_price_change",
    "max_required_sale_fraction",
    "max_sale_identity_residual_currency",
    "max_balance_identity_residual_currency",
    "terminal_prices",
    "terminal_liabilities",
    "terminal_holdings_sha256",
  ];
  const keys = kind === "truth"
    ? common
    : [
      ...common,
      "max_negative_quantity",
      "raw_forecast_loss",
      "forecast_loss",
      "absolute_default_count_error",
      "nonconvergence",
      "abstained",
      "abstention_charge",
      "score_assignment",
    ];
  if (!exactKeys(value, keys)) throw new Error(`Fixture 019 ${kind} has missing or unknown fields.`);
  if (
    typeof value[versionKey] !== "string"
    || !new Set(["ok", "hard_gate_failed"]).has(value.terminal_status)
    || !finite(value.delta_equity)
    || !finite(value.terminal_equity)
    || !Number.isInteger(value.defaults)
    || value.defaults < 0
    || value.defaults > 24
    || !nonnegative(value.creditor_shortfall)
    || !nonnegative(value.price_drawdown_percentage_points)
    || !nonnegative(value.sale_quantity_asset_units)
    || !Number.isInteger(value.rounds)
    || value.rounds < 1
    || value.rounds > 1000
    || typeof value.converged !== "boolean"
    || typeof value.funding_triggered !== "boolean"
    || typeof value.funding_call_executed !== "boolean"
    || !Number.isInteger(value.funding_call_count)
    || value.funding_call_count < 0
    || value.funding_call_count > 1
    || typeof value.price_floor_hit !== "boolean"
    || !nonnegative(value.max_price_change)
    || !nonnegative(value.max_required_sale_fraction)
    || !nonnegative(value.max_sale_identity_residual_currency)
    || !nonnegative(value.max_balance_identity_residual_currency)
    || !Array.isArray(value.terminal_prices)
    || value.terminal_prices.length !== 12
    || value.terminal_prices.some((entry) => !finite(entry) || entry < 0.25)
    || !Array.isArray(value.terminal_liabilities)
    || value.terminal_liabilities.length !== 24
    || value.terminal_liabilities.some((entry) => !nonnegative(entry))
    || !/^[0-9a-f]{64}$/.test(value.terminal_holdings_sha256)
  ) throw new Error(`Fixture 019 ${kind} violates its numeric contract.`);
  if (kind !== "truth" && (
    !nonnegative(value.max_negative_quantity)
    || !finite(value.raw_forecast_loss)
    || value.raw_forecast_loss < 0
    || value.raw_forecast_loss > 1
    || !finite(value.forecast_loss)
    || value.forecast_loss < 0
    || value.forecast_loss > 1
    || !Number.isInteger(value.absolute_default_count_error)
    || value.absolute_default_count_error < 0
    || typeof value.nonconvergence !== "boolean"
    || typeof value.abstained !== "boolean"
    || !new Set([0, 0.01]).has(value.abstention_charge)
    || !new Set([
      "ordinary",
      "staged-fallback-plus-charge",
      "lmax-evaluator-failure",
      "lmax-hard-gate",
      "lmax-fallback-failure",
      "lmax-nonconvergence",
    ]).has(value.score_assignment)
    || (value.abstained !== (value.score_assignment === "staged-fallback-plus-charge"))
    || (value.abstained !== (value.abstention_charge === 0.01))
    || (value.score_assignment.startsWith("lmax-") && value.forecast_loss !== 1)
  )) throw new Error("Fixture 019 arm violates its forecast contract.");
}

export function fixture019ScientificPayload(record) {
  const payload = { ...record };
  delete payload.integrity;
  return payload;
}

export function fixture019WorkKey(record) {
  return `${record.split}|${record.cell}|${record.replicate}|${record.seed_uint64}`;
}

export function assertFixture019Record(record, { sequence = null, previousHash = null } = {}) {
  const rootKeys = [
    "schema", "contract_version", "artifact", "protocol", "claim_id", "split", "cell",
    "replicate", "seed_uint64", "world_sha256", "generated_arrays_sha256", "numpy_version",
    "bit_generator", "parameters", "truth", "arms", "checks", "terminal_status", "resources",
    "units", "claim_eligible", "scientific_result", "measured_energy_present", "integrity",
  ];
  if (!exactKeys(record, rootKeys)) throw new Error("Fixture 019 record has missing or unknown fields.");
  assertUint64String(record.seed_uint64);
  if (
    record.schema !== 1
    || record.contract_version !== FIXTURE_019_CONTRACT_VERSION
    || record.artifact !== "fixture-019"
    || record.protocol !== "FM-T02-forecast"
    || record.claim_id !== "C-1481"
    || record.split !== "development"
    || !cells.has(record.cell)
    || !Number.isInteger(record.replicate)
    || record.replicate < 0
    || !/^[0-9a-f]{64}$/.test(record.world_sha256)
    || !/^[0-9a-f]{64}$/.test(record.generated_arrays_sha256)
    || typeof record.numpy_version !== "string"
    || record.bit_generator !== "PCG64DXSM"
    || !exactKeys(record.parameters, ["common_share", "eta", "funding_enabled"])
    || !new Set([0.35, 0.85]).has(record.parameters.common_share)
    || !new Set([0, 0.1, 0.2]).has(record.parameters.eta)
    || typeof record.parameters.funding_enabled !== "boolean"
  ) throw new Error("Fixture 019 record identity or parameters are invalid.");
  assertTerminal(record.truth, "truth");
  if (!exactKeys(record.arms, armNames)) throw new Error("Fixture 019 arm registry is incomplete.");
  for (const arm of armNames) assertTerminal(record.arms[arm], "arm");
  if (
    !exactKeys(record.checks, [
      "independent_evaluator_agreement",
      "independent_max_price_difference",
      "independent_max_liability_difference",
      "balance_and_sale_identities",
      "eta_zero_boundary",
      "funding_call_exactly_once",
    ])
    || typeof record.checks.independent_evaluator_agreement !== "boolean"
    || !nonnegative(record.checks.independent_max_price_difference)
    || !nonnegative(record.checks.independent_max_liability_difference)
    || typeof record.checks.balance_and_sale_identities !== "boolean"
    || typeof record.checks.eta_zero_boundary !== "boolean"
    || typeof record.checks.funding_call_exactly_once !== "boolean"
    || !new Set(["ok", "hard_gate_failed"]).has(record.terminal_status)
  ) throw new Error("Fixture 019 checks are invalid.");
  if (
    !exactKeys(record.resources, [
      "worker_cpu_ns", "worker_wall_ns", "worker_peak_rss_bytes", "modeled_energy_j", "measured_energy_j",
    ])
    || !nonnegative(record.resources.worker_cpu_ns)
    || !nonnegative(record.resources.worker_wall_ns)
    || !(record.resources.worker_peak_rss_bytes === null || nonnegative(record.resources.worker_peak_rss_bytes))
    || record.resources.modeled_energy_j !== null
    || record.resources.measured_energy_j !== null
    || record.claim_eligible !== false
    || record.scientific_result !== false
    || record.measured_energy_present !== false
  ) throw new Error("Fixture 019 resource or authority boundary is invalid.");
  if (!exactKeys(record.units, ["equity_loss", "forecast_loss", "price_drawdown", "sale_quantity", "rounds", "cpu", "wall", "memory"])) {
    throw new Error("Fixture 019 unit registry is incomplete.");
  }
  if (!exactKeys(record.integrity, ["sequence", "previous_sha256", "record_sha256"])) {
    throw new Error("Fixture 019 integrity envelope is invalid.");
  }
  if (
    !Number.isInteger(record.integrity.sequence)
    || record.integrity.sequence < 0
    || !/^[0-9a-f]{64}$/.test(record.integrity.previous_sha256)
    || !/^[0-9a-f]{64}$/.test(record.integrity.record_sha256)
  ) throw new Error("Fixture 019 integrity values are invalid.");
  if (sequence !== null && record.integrity.sequence !== sequence) throw new Error("Fixture 019 sequence is not contiguous.");
  if (previousHash !== null && record.integrity.previous_sha256 !== previousHash) {
    throw new Error("Fixture 019 previous hash is incorrect.");
  }
  const expected = sha256Hex(`${record.integrity.previous_sha256}\n${canonicalize(fixture019ScientificPayload(record))}`);
  if (record.integrity.record_sha256 !== expected) throw new Error("Fixture 019 record hash is invalid.");
  return record;
}
