import { researchObjectIdentity } from "../lib/research-object.mjs";
import type { ResearchObjectEvidenceKind, ResearchObjectEvidenceRecord } from "../research-object";

const evidenceGroups: Array<{ kind: ResearchObjectEvidenceKind; label: string }> = [
  { kind: "claim", label: "Claims" },
  { kind: "principle", label: "Principles" },
  { kind: "audit", label: "Audits" },
  { kind: "experiment", label: "Experiments" },
];

type ResearchObjectHeaderProps = {
  title: string;
  path: string;
  route: string;
  group: "Concept" | "Mathematics";
  editionVersion: string;
  sourceRevision: string | null;
  evidenceRecords: ResearchObjectEvidenceRecord[];
  assetBasePath: string;
  fragment?: string;
  headingId: string;
  words: number;
};

export function ResearchObjectHeader({
  title,
  path,
  route,
  group,
  editionVersion,
  sourceRevision,
  evidenceRecords,
  assetBasePath,
  fragment = "",
  headingId,
  words,
}: ResearchObjectHeaderProps) {
  const identity = researchObjectIdentity({
    title,
    path,
    route,
    group,
    editionVersion,
    sourceRevision,
    evidenceRecords,
    basePath: assetBasePath,
    fragment,
  });

  return (
    <header
      className="research-object-header"
      data-research-object="focused-document"
      aria-labelledby={headingId}
    >
      <p className="research-object-kicker">{identity.type}</p>
      <p className="research-object-path"><code>{identity.sourcePath}</code></p>
      <dl aria-label="Research object identity">
        <div>
          <dt>Edition</dt>
          <dd>{identity.edition}</dd>
        </div>
        {identity.sourceRevision ? (
          <div>
            <dt>Source revision</dt>
            <dd><code>{identity.sourceRevision}</code></dd>
          </div>
        ) : null}
        <div>
          <dt>Extent</dt>
          <dd>{words.toLocaleString("en-GB")} words</dd>
        </div>
        <div>
          <dt>Public route</dt>
          <dd><a href={identity.publicUrl}>{identity.publicUrl}</a></dd>
        </div>
      </dl>
      {identity.evidenceRoutes.length ? (
        <details className="research-object-evidence">
          <summary>
            <span>Mapped records</span>
            <b>{identity.evidenceSummary}</b>
          </summary>
          <p>{identity.evidenceCaveat}</p>
          <div>
            {evidenceGroups.map((group) => {
              const routes = identity.evidenceRoutes.filter((route) => route.kind === group.kind);
              return routes.length ? (
                <nav key={group.kind} aria-label={`Mapped ${group.label.toLowerCase()}`}>
                  <strong>{group.label}</strong>
                  <span>
                    {routes.map((route) => (
                      <a
                        key={`${route.sourcePath}#${route.fragment}`}
                        href={route.href}
                        aria-label={`Mapped ${route.kind}: ${route.sourcePath}${route.fragment ? `#${route.fragment}` : ""}`}
                        title={`${route.sourcePath}${route.fragment ? `#${route.fragment}` : ""}`}
                      >{route.label}</a>
                    ))}
                  </span>
                </nav>
              ) : null;
            })}
          </div>
        </details>
      ) : null}
      <div className="research-object-routes">
        <nav aria-label="Research object records">
          <a href={identity.sourceHref}>Source</a>
          <a href={identity.historyHref}>History</a>
          <a href={identity.bookHref}>Book</a>
          <a href={identity.pdfHref}>PDF</a>
          <a href={identity.citationHref}>Cite</a>
          <a href={identity.licenceHref}>Licence</a>
          {identity.disclosureHref ? <a href={identity.disclosureHref}>Disclosure</a> : null}
        </nav>
        <nav aria-label="Research object feedback">
          <a href={identity.clarityReportHref}>Report clarity</a>
          <a href={identity.evidenceCorrectionHref}>Correct evidence</a>
        </nav>
      </div>
    </header>
  );
}
