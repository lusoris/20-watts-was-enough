import rawSummary from "../../experiments/test-readiness-summary.json";

export const coverageTiers = [
  "ledger-only",
  "linked-description",
  "protocol-complete",
  "workstation-executable",
] as const;

export const evidenceStatuses = [
  "established",
  "plausible",
  "speculative",
  "disputed",
  "unknown",
] as const;

export type CoverageTier = (typeof coverageTiers)[number];
export type EvidenceStatus = (typeof evidenceStatuses)[number];

export type PromotionCheck = {
  id: string;
  label: string;
  passed: boolean;
  detail: string;
};

export type ReadinessArtifact = {
  id: string;
  path: string;
  title: string;
  linkedClaims: number;
  protocolComplete: boolean;
  missingFacets: string[];
  executionReadiness: "absent" | "scaffold" | "smoke-ready" | "workstation-ready" | "invalid";
  executionReady: boolean;
  executionManifest: string | null;
  promotionChecks: PromotionCheck[];
};

export type ReadinessSummary = {
  schema: 1;
  generatedFrom: string;
  claims: {
    total: number;
    testRouted: number;
    protocolCovered: number;
    executionReady: number;
    tierCounts: Record<CoverageTier, number>;
    tierStatusCounts: Record<CoverageTier, Record<EvidenceStatus, number>>;
  };
  ledgerOnly: {
    total: number;
    dispositionCounts: {
      "evidence-input": number;
      "source-reproduction": number;
      "existing-artifact-gap": number;
      "new-artifact-needed": number;
    };
    proposedArtifactFamilies: number;
  };
  artifacts: {
    total: number;
    protocolComplete: number;
    smokeReady: number;
    workstationReady: number;
    items: ReadinessArtifact[];
  };
};

function invariant(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(`Invalid readiness summary: ${message}`);
}

function sum(values: number[]) {
  return values.reduce((total, value) => total + value, 0);
}

function validateSummary(value: unknown): ReadinessSummary {
  invariant(typeof value === "object" && value !== null, "root must be an object");
  const summary = value as ReadinessSummary;
  invariant(summary.schema === 1, "unsupported schema");
  invariant(summary.generatedFrom === "experiments/test-coverage.json", "unexpected source report");
  invariant(Number.isInteger(summary.claims?.total) && summary.claims.total >= 0, "invalid claim total");
  invariant(Array.isArray(summary.artifacts?.items), "artifacts.items must be an array");

  const tierTotal = sum(coverageTiers.map((tier) => summary.claims.tierCounts[tier]));
  invariant(tierTotal === summary.claims.total, "claim tiers do not sum to the claim total");

  for (const tier of coverageTiers) {
    const evidenceTotal = sum(
      evidenceStatuses.map((status) => summary.claims.tierStatusCounts[tier][status]),
    );
    invariant(evidenceTotal === summary.claims.tierCounts[tier], `${tier} evidence counts do not reconcile`);
  }

  invariant(summary.ledgerOnly.total === summary.claims.tierCounts["ledger-only"], "ledger-only totals disagree");
  invariant(summary.artifacts.items.length === summary.artifacts.total, "artifact total disagrees with item count");
  invariant(
    new Set(summary.artifacts.items.map((artifact) => artifact.id)).size === summary.artifacts.total,
    "artifact IDs are not unique",
  );
  invariant(
    summary.artifacts.items.filter((artifact) => artifact.protocolComplete).length
      === summary.artifacts.protocolComplete,
    "protocol-complete artifact count disagrees with items",
  );
  invariant(
    summary.artifacts.items.filter((artifact) => artifact.executionReadiness === "smoke-ready").length
      === summary.artifacts.smokeReady,
    "smoke-ready artifact count disagrees with items",
  );
  invariant(
    summary.artifacts.items.filter((artifact) => artifact.executionReady).length
      === summary.artifacts.workstationReady,
    "workstation-ready artifact count disagrees with items",
  );
  invariant(
    summary.claims.executionReady === summary.claims.tierCounts["workstation-executable"],
    "executable claim totals disagree",
  );
  return summary;
}

export const readinessSummary = validateSummary(rawSummary);

export function percentage(value: number, total: number) {
  return total === 0 ? 0 : (value / total) * 100;
}

export function researchDocumentHref(path: string) {
  return `/?doc=${encodeURIComponent(path)}`;
}
