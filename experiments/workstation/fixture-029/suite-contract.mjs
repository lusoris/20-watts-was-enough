import { canonicalize, sha256Hex } from "../lib/checkpoint-ledger.mjs";

export const FIXTURE_029_SUITE_RECEIPT_CONTRACT_VERSION =
  "fixture-029.cmb-x01-x04-suite-receipt.v2";
export const FIXTURE_029_SUITE_ANALYSIS_CONTRACT_VERSION =
  "fixture-029.cmb-x01-x04-suite-analysis.v2";
export const FIXTURE_029_SUITE_RUN_CONTRACT_VERSION =
  "fixture-029.cmb-x01-x04-suite-run.v2";
export const FIXTURE_029_SUITE_TRACKS = Object.freeze(["CMB-X01", "CMB-X04"]);
export const FIXTURE_029_SUITE_CLAIMS = Object.freeze(["C-1574", "C-1580"]);
export const FIXTURE_029_SUITE_AUTHORITY_REASON =
  "Public-development aggregate-construction orchestration only; no comparison, ranking, confirmation, statistical, performance, claim, or energy authority.";
export const FIXTURE_029_SUITE_RUN_INTERPRETATION =
  "NO_RESULT: CMB-X01 and CMB-X04 public-development subruns are independently validated and co-receipted only.";
export const FIXTURE_029_SUITE_ANALYSIS_INTERPRETATION =
  "NO_RESULT: independent CMB-X01 and CMB-X04 diagnostics are co-receipted; no cross-track comparison or ranking is permitted.";

const HASH = /^[0-9a-f]{64}$/u;
const CONFIG_KEYS = Object.freeze([
  "schema", "artifact", "suite", "profile", "partition", "worlds_per_seed",
  "shared_seed_pack", "shared_seed_pack_sha256", "seed_value_domain", "tracks",
]);
const CONFIG_TRACK_KEYS = Object.freeze([
  "track", "claims", "configuration", "configuration_sha256", "output_directory",
]);
const RECEIPT_KEYS = Object.freeze([
  "schema", "contract_version", "artifact", "suite", "record_kind", "status",
  "profile", "partition", "execution_claims", "suite_run_id", "track",
  "receipt_index", "subrun_directory", "subrun_id", "subrun_summary",
  "result_label", "no_result", "measured_energy_present", "energy_conclusion_allowed",
  "comparison_inference_permitted", "ranking_permitted", "claim_eligible",
  "scientific_result", "performance_result", "authority_reason", "interpretation", "integrity",
]);
const SUBRUN_SUMMARY_KEYS = Object.freeze([
  "run_payload_sha256", "raw_events_file_sha256", "checkpoint_file_sha256",
  "analysis_payload_sha256", "expected_work_units", "ledger_records",
  "scientific_payload_sha256", "hash_chain_sha256", "decision",
]);
const ANALYSIS_KEYS = Object.freeze([
  "schema", "contract_version", "artifact", "suite", "profile", "partition",
  "execution_claims", "suite_run_id", "receipts", "track_diagnostics", "checks",
  "decision", "result_label", "no_result", "measured_energy_present",
  "energy_conclusion_allowed", "comparison_inference_permitted", "ranking_permitted",
  "claim_eligible", "scientific_result", "performance_result", "authority_reason", "interpretation",
]);
const RUN_IDENTITY_KEYS = Object.freeze([
  "schema", "artifact", "suite", "execution_claims", "runner_version",
  "run_contract_version", "receipt_contract_version", "analysis_contract_version",
  "ledger_format", "profile", "partition", "suite_configuration",
  "suite_configuration_sha256", "shared_seeds", "shared_seed_document_sha256",
  "track_configurations", "source_hashes", "track_order", "result_authority",
  "suite_run_id",
]);
const RUN_KEYS = Object.freeze([
  ...RUN_IDENTITY_KEYS, "expected_receipts", "receipt_ledger", "subrun_ids",
  "subrun_summaries", "result_label", "no_result", "measured_energy_present",
  "energy_conclusion_allowed", "comparison_inference_permitted", "ranking_permitted",
  "claim_eligible", "scientific_result", "performance_result", "authority_reason",
  "interpretation",
]);
const DIAGNOSTIC_KEYS = Object.freeze([
  "track", "execution_claims", "subrun_id", "records", "decision", "receipt_sha256",
  "result_label", "no_result", "comparison_inference_permitted", "ranking_permitted",
]);
const CHECK_KEYS = Object.freeze([
  "exact_claim_scope", "fixed_track_order", "receipt_ledger_complete",
  "receipts_bind_subruns", "subtrack_analyses_diagnostic_pass",
  "subtrack_validators_pass", "strict_no_result_boundary",
  "no_cross_track_comparison_or_ranking",
]);

function exactKeys(value, keys) {
  return value && typeof value === "object" && !Array.isArray(value)
    && canonicalize(Object.keys(value).sort()) === canonicalize([...keys].sort());
}

function exactArray(value, expected) {
  return Array.isArray(value) && canonicalize(value) === canonicalize(expected);
}

function nonnegativeInteger(value) {
  return Number.isSafeInteger(value) && value >= 0;
}

function validSubrunSummary(summary) {
  return exactKeys(summary, SUBRUN_SUMMARY_KEYS)
    && HASH.test(summary.run_payload_sha256 ?? "")
    && HASH.test(summary.raw_events_file_sha256 ?? "")
    && HASH.test(summary.checkpoint_file_sha256 ?? "")
    && HASH.test(summary.analysis_payload_sha256 ?? "")
    && nonnegativeInteger(summary.expected_work_units)
    && summary.expected_work_units >= 1
    && summary.ledger_records === summary.expected_work_units
    && HASH.test(summary.scientific_payload_sha256 ?? "")
    && HASH.test(summary.hash_chain_sha256 ?? "")
    && summary.decision === "diagnostic-pass";
}

function trackClaims(track) {
  return track === "CMB-X01" ? ["C-1574"] : ["C-1580"];
}

export function assertFixture029SuiteConfig(config, profile = config?.profile) {
  const expectedWorlds = profile === "smoke" ? 8 : 16;
  const expectedConfigurations = profile === "smoke"
    ? ["configs/cmb-x01-smoke.json", "configs/smoke.json"]
    : ["configs/cmb-x01-development.json", "configs/development.json"];
  const perSeedKeys = Object.keys(config ?? {}).filter((key) => key.endsWith("_per_seed"));
  if (
    !exactKeys(config, CONFIG_KEYS)
    || config.schema !== 1
    || config.artifact !== "fixture-029"
    || config.suite !== "CMB-X01+CMB-X04"
    || !new Set(["smoke", "development"]).has(config.profile)
    || profile !== config.profile
    || config.partition !== "public-development-only"
    || config.worlds_per_seed !== expectedWorlds
    || !exactArray(perSeedKeys, ["worlds_per_seed"])
    || config.shared_seed_pack !== "seeds/development.reveal.json"
    || !HASH.test(config.shared_seed_pack_sha256 ?? "")
    || config.seed_value_domain !== "unsigned-uint32"
    || !Array.isArray(config.tracks)
    || config.tracks.length !== FIXTURE_029_SUITE_TRACKS.length
    || config.tracks.some((entry, index) => (
      !exactKeys(entry, CONFIG_TRACK_KEYS)
      || entry.track !== FIXTURE_029_SUITE_TRACKS[index]
      || !exactArray(entry.claims, trackClaims(entry.track))
      || entry.configuration !== expectedConfigurations[index]
      || !HASH.test(entry.configuration_sha256 ?? "")
      || entry.output_directory !== entry.track.toLowerCase()
    ))
  ) throw new Error("Fixture 029 suite configuration violates its closed runtime schema.");
  return config;
}

export function fixture029SuiteReceiptPayload(record) {
  const payload = { ...record };
  delete payload.integrity;
  return payload;
}

export function fixture029SuiteReceiptWorkKey(record) {
  return `${record.receipt_index}:${record.track}`;
}

export function assertFixture029SuiteReceipt(record, {
  sequence = null,
  previousHash = null,
  runId = null,
  profile = null,
} = {}) {
  const expectedSequence = sequence ?? record?.integrity?.sequence;
  const expectedPrevious = previousHash ?? record?.integrity?.previous_sha256;
  const expectedTrack = FIXTURE_029_SUITE_TRACKS[expectedSequence];
  const expectedClaims = trackClaims(expectedTrack);
  const expectedHash = sha256Hex(
    `${expectedPrevious}\n${canonicalize(fixture029SuiteReceiptPayload(record))}`,
  );
  if (
    !exactKeys(record, RECEIPT_KEYS)
    || !validSubrunSummary(record.subrun_summary)
    || !exactKeys(record.integrity, ["sequence", "previous_sha256", "record_sha256"])
    || record.schema !== 1
    || record.contract_version !== FIXTURE_029_SUITE_RECEIPT_CONTRACT_VERSION
    || record.artifact !== "fixture-029"
    || record.suite !== "CMB-X01+CMB-X04"
    || record.record_kind !== "validated-subrun-receipt"
    || record.status !== "public-development-diagnostic-only"
    || !new Set(["smoke", "development"]).has(record.profile)
    || (profile !== null && record.profile !== profile)
    || record.partition !== "public-development-only"
    || !exactArray(record.execution_claims, FIXTURE_029_SUITE_CLAIMS)
    || !HASH.test(record.suite_run_id ?? "")
    || (runId !== null && record.suite_run_id !== runId)
    || record.track !== expectedTrack
    || !exactArray(trackClaims(record.track), expectedClaims)
    || record.receipt_index !== expectedSequence
    || record.subrun_directory !== record.track.toLowerCase()
    || !HASH.test(record.subrun_id ?? "")
    || record.result_label !== "NO_RESULT"
    || record.no_result !== true
    || record.measured_energy_present !== false
    || record.energy_conclusion_allowed !== false
    || record.comparison_inference_permitted !== false
    || record.ranking_permitted !== false
    || record.claim_eligible !== false
    || record.scientific_result !== false
    || record.performance_result !== false
    || record.authority_reason !== FIXTURE_029_SUITE_AUTHORITY_REASON
    || record.interpretation !== `NO_RESULT: validated ${record.track} public-development subrun receipt only.`
    || record.integrity.sequence !== expectedSequence
    || record.integrity.previous_sha256 !== expectedPrevious
    || record.integrity.record_sha256 !== expectedHash
  ) throw new Error("Fixture 029 suite receipt violates its closed runtime contract.");
  return record;
}

export function assertFixture029SuiteRun(run, {
  identity,
  receipts,
  ledgerSummary,
} = {}) {
  const identityProjection = identity && Object.fromEntries(
    RUN_IDENTITY_KEYS.map((key) => [key, run?.[key]]),
  );
  if (
    !exactKeys(run, RUN_KEYS)
    || !identity
    || canonicalize(identityProjection) !== canonicalize(identity)
    || run.expected_receipts !== FIXTURE_029_SUITE_TRACKS.length
    || !exactKeys(run.subrun_ids, FIXTURE_029_SUITE_TRACKS)
    || !exactKeys(run.subrun_summaries, FIXTURE_029_SUITE_TRACKS)
    || FIXTURE_029_SUITE_TRACKS.some((track) => !HASH.test(run.subrun_ids[track] ?? ""))
    || FIXTURE_029_SUITE_TRACKS.some((track) => !validSubrunSummary(run.subrun_summaries[track]))
    || run.result_label !== "NO_RESULT"
    || run.no_result !== true
    || run.measured_energy_present !== false
    || run.energy_conclusion_allowed !== false
    || run.comparison_inference_permitted !== false
    || run.ranking_permitted !== false
    || run.claim_eligible !== false
    || run.scientific_result !== false
    || run.performance_result !== false
    || run.authority_reason !== FIXTURE_029_SUITE_AUTHORITY_REASON
    || run.interpretation !== FIXTURE_029_SUITE_RUN_INTERPRETATION
  ) throw new Error("Fixture 029 suite run violates its closed persisted contract.");
  if (receipts === undefined && ledgerSummary === undefined) return run;
  const expectedIds = Object.fromEntries((receipts ?? []).map((receipt) => [
    receipt.track, receipt.subrun_id,
  ]));
  const expectedSummaries = Object.fromEntries((receipts ?? []).map((receipt) => [
    receipt.track, receipt.subrun_summary,
  ]));
  if (
    !Array.isArray(receipts)
    || receipts.length !== FIXTURE_029_SUITE_TRACKS.length
    || !ledgerSummary
    || canonicalize(run.receipt_ledger) !== canonicalize(ledgerSummary)
    || canonicalize(run.subrun_ids) !== canonicalize(expectedIds)
    || canonicalize(run.subrun_summaries) !== canonicalize(expectedSummaries)
  ) throw new Error("Fixture 029 suite run no longer binds its receipt ledger and recomputed subruns.");
  return run;
}

export function assertFixture029SuiteAnalysis(analysis, { runId = null } = {}) {
  if (
    !exactKeys(analysis, ANALYSIS_KEYS)
    || analysis.schema !== 1
    || analysis.contract_version !== FIXTURE_029_SUITE_ANALYSIS_CONTRACT_VERSION
    || analysis.artifact !== "fixture-029"
    || analysis.suite !== "CMB-X01+CMB-X04"
    || !new Set(["smoke", "development"]).has(analysis.profile)
    || analysis.partition !== "public-development-only"
    || !exactArray(analysis.execution_claims, FIXTURE_029_SUITE_CLAIMS)
    || !HASH.test(analysis.suite_run_id ?? "")
    || (runId !== null && analysis.suite_run_id !== runId)
    || analysis.receipts !== FIXTURE_029_SUITE_TRACKS.length
    || !Array.isArray(analysis.track_diagnostics)
    || analysis.track_diagnostics.length !== FIXTURE_029_SUITE_TRACKS.length
    || analysis.track_diagnostics.some((entry, index) => (
      !exactKeys(entry, DIAGNOSTIC_KEYS)
      || entry.track !== FIXTURE_029_SUITE_TRACKS[index]
      || !exactArray(entry.execution_claims, trackClaims(entry.track))
      || !HASH.test(entry.subrun_id ?? "")
      || !nonnegativeInteger(entry.records)
      || entry.records < 1
      || entry.decision !== "diagnostic-pass"
      || !HASH.test(entry.receipt_sha256 ?? "")
      || entry.result_label !== "NO_RESULT"
      || entry.no_result !== true
      || entry.comparison_inference_permitted !== false
      || entry.ranking_permitted !== false
    ))
    || !exactKeys(analysis.checks, CHECK_KEYS)
    || Object.values(analysis.checks).some((value) => value !== true)
    || analysis.decision !== "diagnostic-pass"
    || analysis.result_label !== "NO_RESULT"
    || analysis.no_result !== true
    || analysis.measured_energy_present !== false
    || analysis.energy_conclusion_allowed !== false
    || analysis.comparison_inference_permitted !== false
    || analysis.ranking_permitted !== false
    || analysis.claim_eligible !== false
    || analysis.scientific_result !== false
    || analysis.performance_result !== false
    || analysis.authority_reason !== FIXTURE_029_SUITE_AUTHORITY_REASON
    || analysis.interpretation !== FIXTURE_029_SUITE_ANALYSIS_INTERPRETATION
  ) throw new Error("Fixture 029 suite output violates its closed runtime schema.");
  return analysis;
}

export const validateFixture029SuiteOutputSchema = assertFixture029SuiteAnalysis;
export const validateFixture029SuiteReceiptSchema = assertFixture029SuiteReceipt;
