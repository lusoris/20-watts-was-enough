import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const summary = JSON.parse(await readFile("experiments/test-readiness-summary.json", "utf8"));
const report = JSON.parse(await readFile("experiments/test-coverage.json", "utf8"));

const tiers = [
  "ledger-only",
  "linked-description",
  "protocol-complete",
  "workstation-executable",
];
const evidenceStatuses = ["established", "plausible", "speculative", "disputed", "unknown"];

test("compact readiness summary reconciles with the complete report", () => {
  assert.equal(summary.schema, 1);
  assert.equal(summary.generatedFrom, "experiments/test-coverage.json");
  assert.equal(summary.claims.total, report.counts.claims);
  assert.equal(summary.claims.protocolCovered, report.counts.protocolCovered);
  assert.equal(summary.claims.executionReady, report.counts.executionReady);
  assert.deepEqual(summary.claims.tierCounts, report.counts.tierCounts);
  assert.deepEqual(summary.claims.tierStatusCounts, report.counts.tierStatusCounts);
  assert.equal(summary.artifacts.total, report.counts.artifacts);
  assert.equal(summary.artifacts.protocolComplete, report.counts.protocolCompleteArtifacts);
  assert.equal(summary.artifacts.smokeReady, report.counts.smokeReadyArtifacts);
  assert.equal(summary.artifacts.workstationReady, report.counts.executionReadyArtifacts);
});

test("claim tiers and evidence cells have exact denominators", () => {
  assert.equal(
    tiers.reduce((total, tier) => total + summary.claims.tierCounts[tier], 0),
    summary.claims.total,
  );
  for (const tier of tiers) {
    assert.equal(
      evidenceStatuses.reduce(
        (total, status) => total + summary.claims.tierStatusCounts[tier][status],
        0,
      ),
      summary.claims.tierCounts[tier],
    );
  }
});

test("artifact stages remain separate from claim tiers", () => {
  assert.equal(summary.artifacts.items.length, summary.artifacts.total);
  assert.equal(
    summary.artifacts.items.filter((artifact) => artifact.protocolComplete).length,
    summary.artifacts.protocolComplete,
  );
  assert.equal(
    summary.artifacts.items.filter((artifact) => artifact.executionReadiness === "smoke-ready").length,
    summary.artifacts.smokeReady,
  );
  assert.equal(
    summary.artifacts.items.filter((artifact) => artifact.executionReady).length,
    summary.artifacts.workstationReady,
  );
  assert.ok(
    summary.artifacts.items
      .filter((artifact) => artifact.executionReadiness === "smoke-ready")
      .every((artifact) => artifact.executionReady === false),
    "smoke readiness must never imply workstation execution readiness",
  );
});

test("every manifest-backed artifact exposes unique machine-checkable promotion gates", () => {
  const manifestBacked = summary.artifacts.items.filter((artifact) => artifact.executionManifest);
  assert.ok(manifestBacked.length > 0);
  for (const artifact of manifestBacked) {
    assert.ok(artifact.promotionChecks.length > 0, `${artifact.id} has no promotion checks`);
    assert.equal(
      new Set(artifact.promotionChecks.map((check) => check.id)).size,
      artifact.promotionChecks.length,
      `${artifact.id} has duplicate promotion gate IDs`,
    );
    assert.ok(
      artifact.promotionChecks.every(
        (check) => typeof check.passed === "boolean" && check.label && check.detail,
      ),
      `${artifact.id} has an incomplete promotion gate`,
    );
  }
});

test("execution readiness is limited to each manifest's explicit claim scope", () => {
  const candidate = summary.artifacts.items.find((artifact) => artifact.id === "candidate-010");
  assert.ok(candidate, "candidate-010 is missing from readiness summary");
  assert.deepEqual(candidate.executionClaims, ["C-170"]);
  assert.ok(candidate.linkedClaims > candidate.executionClaims.length);

  const scopeByArtifact = new Map(
    summary.artifacts.items.map((artifact) => [artifact.id, new Set(artifact.executionClaims ?? [])]),
  );
  for (const claim of report.claims.filter((record) => record.executionReady)) {
    assert.ok(
      claim.artifacts.some((artifact) => scopeByArtifact.get(artifact)?.has(claim.id)),
      `${claim.id} inherited execution readiness outside an explicit manifest scope`,
    );
  }
});
