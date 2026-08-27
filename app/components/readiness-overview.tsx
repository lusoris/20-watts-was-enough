import {
  coverageTiers,
  evidenceStatuses,
  percentage,
  readinessSummary,
  researchDocumentHref,
  type ReadinessArtifact,
} from "../lib/readiness";

type ReadinessOverviewProps = {
  mode?: "page" | "book";
  documentHref?: (path: string) => string;
  publicSurface?: boolean;
};

const canonicalSite = "https://twenty-watts-was-enough.lusoris.chatgpt.site";

function readinessDocumentHref(
  path: string,
  mode: "page" | "book",
  documentHref?: (path: string) => string,
) {
  if (documentHref) return documentHref(path);
  const href = researchDocumentHref(path);
  return mode === "book" ? new URL(href, canonicalSite).toString() : href;
}

const tierLabels = {
  "ledger-only": "Ledger only",
  "linked-description": "Linked description",
  "protocol-complete": "Protocol complete",
  "workstation-executable": "Workstation executable",
} as const;

const evidenceLabels = {
  established: "Established",
  plausible: "Plausible",
  speculative: "Speculative",
  disputed: "Disputed",
  unknown: "Unknown",
} as const;

function formatNumber(value: number) {
  return value.toLocaleString("en-US");
}

function statusLabel(artifact: ReadinessArtifact) {
  if (artifact.executionReady) return "Workstation ready";
  if (artifact.executionReadiness === "smoke-ready") return "Smoke ready";
  if (artifact.executionReadiness === "scaffold") return "Scaffold only";
  if (artifact.executionReadiness === "invalid") return "Invalid manifest";
  return "No harness";
}

function coverageBar({
  value,
  total,
  tone,
}: {
  value: number;
  total: number;
  tone: "protocol" | "ready";
}) {
  const width = percentage(value, total);
  return (
    <div
      className={`readiness-bar readiness-bar-${tone}`}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={total}
      aria-valuenow={value}
      aria-label={`${formatNumber(value)} of ${formatNumber(total)}`}
    >
      <span style={{ width: `${width}%` }} />
    </div>
  );
}

// Overflow regions need keyboard focus so arrow-key users can inspect wide tables.
/* eslint-disable jsx-a11y/no-noninteractive-tabindex */
export function ReadinessOverview({
  mode = "page",
  documentHref,
  publicSurface = false,
}: ReadinessOverviewProps) {
  const { claims, artifacts, ledgerOnly } = readinessSummary;
  const smokeArtifact = artifacts.items.find(
    (artifact) => artifact.executionReadiness === "smoke-ready",
  );
  const passedPromotionGates = smokeArtifact?.promotionChecks.filter((check) => check.passed).length ?? 0;
  const sortedArtifacts = [...artifacts.items].sort((left, right) => {
    const rank = { "workstation-ready": 0, "smoke-ready": 1, scaffold: 2, invalid: 3, absent: 4 };
    const readinessDelta = rank[left.executionReadiness] - rank[right.executionReadiness];
    return readinessDelta || right.linkedClaims - left.linkedClaims || left.id.localeCompare(right.id);
  });

  return (
    <div className={`readiness-overview readiness-overview-${mode}`}>
      <header className="readiness-intro">
        <span className="readiness-kicker">Generated research status</span>
        <h1>Scientific claims are not runnable tests</h1>
        <p>
          Evidence status describes support for a source-domain claim. Test readiness describes
          whether this project can execute a frozen experiment. The two axes are deliberately
          reported separately.
        </p>
      </header>

      <section className="readiness-balance" aria-labelledby={`readiness-balance-${mode}`}>
        <div className="readiness-section-heading">
          <span>Claim denominator: {formatNumber(claims.total)}</span>
          <h2 id={`readiness-balance-${mode}`}>Written protocols versus executable evidence</h2>
        </div>
        <div className="readiness-claim-grid">
          <article className="readiness-claim-card readiness-claim-protocol">
            <div className="readiness-number-line">
              <strong>{formatNumber(claims.protocolCovered)}</strong>
              <span>of {formatNumber(claims.total)}</span>
            </div>
            <h3>Protocol-covered claims</h3>
            {coverageBar({ value: claims.protocolCovered, total: claims.total, tone: "protocol" })}
            <p>
              At least one linked candidate or fixture contains all eight required written
              protocol facets. This is design coverage, not an experimental result.
            </p>
          </article>
          <article className="readiness-claim-card readiness-claim-ready">
            <div className="readiness-number-line">
              <strong>{formatNumber(claims.executionReady)}</strong>
              <span>of {formatNumber(claims.total)}</span>
            </div>
            <h3>Workstation-executable claims</h3>
            {coverageBar({ value: claims.executionReady, total: claims.total, tone: "ready" })}
            <p>
              A linked artifact must have a checked workstation-ready manifest and a runnable
              scientific harness. Smoke plumbing cannot promote a claim.
            </p>
          </article>
        </div>
      </section>

      <section className="readiness-artifact-lane" aria-labelledby={`artifact-lane-${mode}`}>
        <div className="readiness-section-heading">
          <span>Artifact denominator: {artifacts.total}</span>
          <h2 id={`artifact-lane-${mode}`}>Experiment implementation lane</h2>
        </div>
        <ol className="readiness-stage-list">
          <li className="readiness-stage readiness-stage-protocol">
            <strong>{artifacts.protocolComplete}</strong>
            <span>complete written protocols</span>
          </li>
          <li className="readiness-stage readiness-stage-smoke">
            <strong>{artifacts.smokeReady}</strong>
            <span>validated smoke harness</span>
          </li>
          <li className="readiness-stage readiness-stage-ready">
            <strong>{artifacts.workstationReady}</strong>
            <span>workstation-ready experiments</span>
          </li>
        </ol>
      </section>

      <section className="readiness-matrix-section" aria-labelledby={`evidence-matrix-${mode}`}>
        <div className="readiness-section-heading">
          <span>Independent axes</span>
          <h2 id={`evidence-matrix-${mode}`}>Evidence status by highest test tier</h2>
        </div>
        <div className="readiness-table-wrap" role="region" aria-label="Evidence status by test readiness" tabIndex={0}>
          <table className="readiness-matrix">
            <thead>
              <tr>
                <th scope="col">Highest test tier</th>
                {evidenceStatuses.map((status) => (
                  <th scope="col" key={status}>{evidenceLabels[status]}</th>
                ))}
                <th scope="col">Total</th>
              </tr>
            </thead>
            <tbody>
              {coverageTiers.map((tier) => (
                <tr key={tier}>
                  <th scope="row">{tierLabels[tier]}</th>
                  {evidenceStatuses.map((status) => (
                    <td key={status}>{formatNumber(claims.tierStatusCounts[tier][status])}</td>
                  ))}
                  <td>{formatNumber(claims.tierCounts[tier])}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="readiness-matrix-note">
          “Established” means the cited observation is established within its stated scope. It
          does not mean the proposed AI translation has passed this project&apos;s experiment.
        </p>
      </section>

      <div className="readiness-detail-grid">
        <section className="readiness-ledger-card" aria-labelledby={`ledger-only-${mode}`}>
          <span className="readiness-card-kicker">Not missing at random</span>
          <h2 id={`ledger-only-${mode}`}>{ledgerOnly.total} ledger-only claims</h2>
          <dl>
            <div>
              <dt>Evidence inputs</dt>
              <dd>{ledgerOnly.dispositionCounts["evidence-input"]}</dd>
            </div>
            <div>
              <dt>Source reproductions</dt>
              <dd>{ledgerOnly.dispositionCounts["source-reproduction"]}</dd>
            </div>
            <div>
              <dt>New experiment needed</dt>
              <dd>{ledgerOnly.dispositionCounts["new-artifact-needed"]}</dd>
            </div>
          </dl>
          {ledgerOnly.proposedArtifactFamilies === 0 ? (
            <>
              <p>
                No ledger-only record currently requires a new experiment family. The remaining
                records are evidence inputs or source-domain reproductions and are not falsely
                counted as project tests.
              </p>
              <a href={readinessDocumentHref("experiments/proposed/README.md", mode, documentHref)}>Inspect the disposition record</a>
            </>
          ) : (
            <>
              <p>
                The engineering gaps collapse into {ledgerOnly.proposedArtifactFamilies} proposed
                experiment families. Evidence inputs and source reproductions are not falsely
                counted as project tests.
              </p>
              <a href={readinessDocumentHref("experiments/proposed/README.md", mode, documentHref)}>Open the proposed backlog</a>
            </>
          )}
        </section>

        {smokeArtifact ? (
          <section className="readiness-smoke-card" aria-labelledby={`smoke-target-${mode}`}>
            <span className="readiness-card-kicker">Nearest executable target</span>
            <h2 id={`smoke-target-${mode}`}>{smokeArtifact.id}: smoke-ready</h2>
            <p>{smokeArtifact.title}</p>
            <div className="readiness-gate-score">
              <strong>{passedPromotionGates}/{smokeArtifact.promotionChecks.length}</strong>
              <span>machine-checkable structural promotion gates currently pass</span>
            </div>
            <ul className="readiness-gates">
              {smokeArtifact.promotionChecks.map((check) => (
                <li className={check.passed ? "gate-pass" : "gate-open"} key={check.id}>
                  <span aria-hidden="true">{check.passed ? "✓" : "○"}</span>
                  <span>
                    <strong>{check.label}</strong>
                    <small>{check.detail}</small>
                  </span>
                </li>
              ))}
            </ul>
            <div className="readiness-card-links">
              <a href={readinessDocumentHref(smokeArtifact.path, mode, documentHref)}>Open the experiment contract</a>
              <a href={readinessDocumentHref("experiments/workstation/candidate-010/README.md", mode, documentHref)}>Open the harness notes</a>
            </div>
          </section>
        ) : null}
      </div>

      {mode === "page" ? (
        <section className="readiness-artifact-section" aria-labelledby="artifact-table-heading">
          <div className="readiness-section-heading">
            <span>Traceable inventory</span>
            <h2 id="artifact-table-heading">All experiment artifacts</h2>
          </div>
          <div className="readiness-table-wrap" role="region" aria-label="All experiment artifacts" tabIndex={0}>
            <table className="readiness-artifact-table">
              <thead>
                <tr>
                  <th scope="col">Artifact</th>
                  <th scope="col">Related claims</th>
                  <th scope="col">Protocol</th>
                  <th scope="col">Execution</th>
                </tr>
              </thead>
              <tbody>
                {sortedArtifacts.map((artifact) => (
                  <tr key={artifact.id}>
                    <th scope="row">
                      <a href={researchDocumentHref(artifact.path)}>{artifact.id}</a>
                      <small>{artifact.title}</small>
                    </th>
                    <td>{formatNumber(artifact.linkedClaims)}</td>
                    <td>
                      <span className={artifact.protocolComplete ? "status-complete" : "status-incomplete"}>
                        {artifact.protocolComplete ? "Complete" : "Incomplete"}
                      </span>
                    </td>
                    <td>
                      <span className={`execution-${artifact.executionReadiness}`}>
                        {statusLabel(artifact)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="readiness-source-line">
            Generated from <a href={researchDocumentHref("experiments/test-coverage.md")}>the complete coverage report</a>.
          </p>
        </section>
      ) : (
        <p className="readiness-book-link">
          {publicSurface
            ? "The public Git repository contains the complete artifact table and generated coverage report."
            : "The owner-only research site contains the complete artifact table and live generated coverage report."}
        </p>
      )}
    </div>
  );
}
/* eslint-enable jsx-a11y/no-noninteractive-tabindex */
