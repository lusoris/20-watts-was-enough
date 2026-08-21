import assert from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import {
  CANDIDATE_010_FAULT_SCHEDULE,
  CANDIDATE_010_FAULT_SCHEDULE_SHA256,
  runCandidate010FaultCampaign,
  validateCandidate010FaultCampaign,
} from "./fault-injection.mjs";

const benchmarkRoot = path.dirname(new URL(import.meta.url).pathname.replace(/^\/(.:)/, "$1"));
const config = JSON.parse(await readFile(path.join(benchmarkRoot, "configs", "smoke.json"), "utf8"));

async function temporaryCampaign() {
  const temporary = await mkdtemp(path.join(os.tmpdir(), "20w-c010-faults-"));
  const output = path.join(temporary, "campaign");
  return { temporary, campaign: await runCandidate010FaultCampaign({ root: output, config, seed: 4040 }) };
}

test("fault schedule is frozen, typed, deterministic, and complete", () => {
  assert.match(CANDIDATE_010_FAULT_SCHEDULE_SHA256, /^[0-9a-f]{64}$/);
  assert.equal(Object.isFrozen(CANDIDATE_010_FAULT_SCHEDULE), true);
  assert.deepEqual(CANDIDATE_010_FAULT_SCHEDULE.map((entry) => entry.fault), [
    "reset-leakage",
    "incomplete-rollback",
    "precommit-disclosure-or-effect",
    "delayed-cleanup",
    "stale-monitor-or-verifier",
    "corrupted-trace",
    "append-or-finalization-fault",
    "irreversible-effect-sentinel",
  ]);
  assert.ok(CANDIDATE_010_FAULT_SCHEDULE.every((entry) => (
    Object.isFrozen(entry)
    && /^c010-fi-[a-z-]+$/.test(entry.id)
    && ["kill", "abstain"].includes(entry.expected_outcome)
  )));
});

test("all injected faults expose actual hashes and produce their frozen kill or abstain outcome", async () => {
  const { temporary, campaign } = await temporaryCampaign();
  try {
    assert.equal(validateCandidate010FaultCampaign(campaign), true);
    assert.deepEqual(campaign.summary, {
      scheduled_faults: 8,
      detected_faults: 8,
      kills: 4,
      abstentions: 4,
      safety_violations: 4,
    });
    assert.equal(campaign.physical_actuation, false);
    assert.equal(campaign.claim_eligible, false);
    for (const record of campaign.records) {
      assert.equal(record.metrics.fault_detected, true);
      assert.match(record.metrics.pre_state_sha256, /^[0-9a-f]{64}$/);
      assert.match(record.metrics.post_state_sha256, /^[0-9a-f]{64}$/);
      assert.equal(record.actual_outcome, record.expected_outcome);
      assert.equal(record.physical_actuation, false);
      assert.equal(record.backend_report.physical_actuation, false);
    }
  } finally {
    await rm(temporary, { recursive: true, force: true });
  }
});

test("fault-specific metrics measure the injected failure rather than inferring it from a label", async () => {
  const { temporary, campaign } = await temporaryCampaign();
  try {
    const byFault = Object.fromEntries(campaign.records.map((record) => [record.fault, record]));
    assert.ok(byFault["reset-leakage"].metrics.reset_leak_bytes > 0);
    assert.ok(byFault["incomplete-rollback"].metrics.rollback_distance_bytes > 0);
    assert.equal(byFault["precommit-disclosure-or-effect"].metrics.precommit_effect_count, 1);
    assert.ok(byFault["delayed-cleanup"].metrics.cleanup_delay_ms > byFault["delayed-cleanup"].metrics.cleanup_deadline_ms);
    assert.notEqual(
      byFault["stale-monitor-or-verifier"].metrics.monitor_expected_version,
      byFault["stale-monitor-or-verifier"].metrics.monitor_observed_version,
    );
    assert.notEqual(
      byFault["corrupted-trace"].metrics.trace_expected_sha256,
      byFault["corrupted-trace"].metrics.trace_observed_sha256,
    );
    assert.equal(byFault["stale-monitor-or-verifier"].metrics.state_changed, false);
    assert.equal(byFault["corrupted-trace"].metrics.state_changed, false);
    assert.equal(byFault["append-or-finalization-fault"].metrics.finalization_complete, false);
    assert.notEqual(byFault["append-or-finalization-fault"].backend_report.error_code, null);
    assert.equal(byFault["irreversible-effect-sentinel"].metrics.irreversible_sentinel_count, 1);
    assert.ok(campaign.records.some((record) => (
      record.expected_outcome === "kill"
      && record.backend_report.irreversible_violation === false
      && record.report.safety_violations === 1
    )));
  } finally {
    await rm(temporary, { recursive: true, force: true });
  }
});

test("campaign records are deterministic across isolated roots", async () => {
  const first = await temporaryCampaign();
  const second = await temporaryCampaign();
  try {
    assert.deepEqual(first.campaign, second.campaign);
  } finally {
    await rm(first.temporary, { recursive: true, force: true });
    await rm(second.temporary, { recursive: true, force: true });
  }
});

test("a false zero-safety report or hidden fault cannot validate", async () => {
  const { temporary, campaign } = await temporaryCampaign();
  try {
    const zeroedRecords = campaign.records.map((record) => ({
      ...record,
      report: { ...record.report, safety_violations: 0 },
    }));
    const zeroed = {
      ...campaign,
      records: zeroedRecords,
      summary: { ...campaign.summary, safety_violations: 0 },
    };
    assert.throws(
      () => validateCandidate010FaultCampaign(zeroed),
      /false zero-safety report/,
    );

    const hiddenRecords = campaign.records.map((record, index) => (
      index === 0 ? { ...record, metrics: { ...record.metrics, fault_detected: false } } : record
    ));
    const hidden = {
      ...campaign,
      records: hiddenRecords,
      summary: { ...campaign.summary, detected_faults: 7 },
    };
    assert.throws(
      () => validateCandidate010FaultCampaign(hidden),
      /fault was not detected/,
    );
  } finally {
    await rm(temporary, { recursive: true, force: true });
  }
});

test("campaign identity cannot be relabelled as a claim-bearing result or confirmation", async () => {
  const { temporary, campaign } = await temporaryCampaign();
  try {
    for (const [field, value, pattern] of [
      ["schema", 2, /schema mismatch/],
      ["artifact", "candidate-010-confirmation", /artifact mismatch/],
      ["run_kind", "confirmatory-result-v1", /run kind mismatch/],
      ["claim_eligible", true, /claim-ineligible/],
    ]) {
      assert.throws(
        () => validateCandidate010FaultCampaign({ ...campaign, [field]: value }),
        pattern,
      );
    }
    const relabelledRecord = {
      ...campaign,
      records: campaign.records.map((record, index) => (
        index === 0 ? { ...record, schema: 2 } : record
      )),
    };
    assert.throws(
      () => validateCandidate010FaultCampaign(relabelledRecord),
      /record schema mismatch/,
    );
  } finally {
    await rm(temporary, { recursive: true, force: true });
  }
});

test("fault labels and summaries cannot conceal zeroed raw state or effect observations", async () => {
  const { temporary, campaign } = await temporaryCampaign();
  try {
    const mutations = [
      ["reset-leakage", { reset_leak_bytes: 0, actual_effect_bytes: 0, post_state_bytes: 0 }],
      ["incomplete-rollback", { rollback_distance_bytes: 0, actual_effect_bytes: 0, post_state_bytes: 0 }],
      ["precommit-disclosure-or-effect", { precommit_effect_count: 0, actual_effect_bytes: 0, post_state_bytes: 0 }],
      ["delayed-cleanup", { cleanup_delay_ms: 0, actual_effect_bytes: 0, post_state_bytes: 0 }],
      ["stale-monitor-or-verifier", { monitor_observed_version: 1 }],
      ["corrupted-trace", { trace_observed_sha256: campaign.records[5].metrics.trace_expected_sha256 }],
      ["append-or-finalization-fault", { finalization_complete: true, actual_effect_bytes: 0, actual_backend_bytes: 0, post_state_bytes: 0 }],
      ["irreversible-effect-sentinel", { irreversible_sentinel_count: 0, actual_effect_bytes: 0, post_state_bytes: 0 }],
    ];
    for (const [fault, metricPatch] of mutations) {
      const records = campaign.records.map((record) => (
        record.fault === fault
          ? { ...record, metrics: { ...record.metrics, ...metricPatch } }
          : record
      ));
      const concealed = {
        ...campaign,
        records,
        // Preserve the original labels and result-shaped aggregate deliberately.
        summary: { ...campaign.summary },
      };
      assert.throws(
        () => validateCandidate010FaultCampaign(concealed),
        new RegExp(`(raw observations|fault was not detected|summary mismatch).*${fault === "reset-leakage" ? "" : ""}`),
      );
    }
  } finally {
    await rm(temporary, { recursive: true, force: true });
  }
});

test("derived boundary and report fields must agree with raw fault observations", async () => {
  const { temporary, campaign } = await temporaryCampaign();
  try {
    const changedLabel = {
      ...campaign,
      records: campaign.records.map((record, index) => (
        index === 0 ? { ...record, metrics: { ...record.metrics, state_changed: false } } : record
      )),
    };
    assert.throws(
      () => validateCandidate010FaultCampaign(changedLabel),
      /state-change observation mismatch/,
    );

    const byteMismatch = {
      ...campaign,
      records: campaign.records.map((record, index) => (
        index === 0 ? { ...record, metrics: { ...record.metrics, post_state_bytes: record.metrics.post_state_bytes + 1 } } : record
      )),
    };
    assert.throws(
      () => validateCandidate010FaultCampaign(byteMismatch),
      /post-state byte accounting mismatch/,
    );

    const relabelledOutcome = {
      ...campaign,
      records: campaign.records.map((record, index) => (
        index === 0
          ? {
            ...record,
            actual_outcome: "abstain",
            report: { outcome: "abstain", safety_violations: 0, abstentions: 1 },
          }
          : record
      )),
      summary: { ...campaign.summary, kills: 3, abstentions: 5, safety_violations: 3 },
    };
    assert.throws(
      () => validateCandidate010FaultCampaign(relabelledOutcome),
      /(frozen outcome|false zero-safety report|reported outcome mismatch)/,
    );
  } finally {
    await rm(temporary, { recursive: true, force: true });
  }
});
