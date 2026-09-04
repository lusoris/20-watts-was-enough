import { researchObjectIdentity } from "../lib/research-object.mjs";

type ResearchObjectHeaderProps = {
  title: string;
  path: string;
  route: string;
  group: "Concept" | "Mathematics";
  editionVersion: string;
  sourceRevision: string | null;
  fragment?: string;
  headingId: string;
  words: number;
  sections: number;
};

export function ResearchObjectHeader({
  title,
  path,
  route,
  group,
  editionVersion,
  sourceRevision,
  fragment = "",
  headingId,
  words,
  sections,
}: ResearchObjectHeaderProps) {
  const identity = researchObjectIdentity({
    title,
    path,
    route,
    group,
    editionVersion,
    sourceRevision,
    fragment,
  });

  return (
    <header className="research-object-header" data-research-object="focused-document">
      <p className="research-object-kicker">{identity.type}</p>
      <h1 id={headingId}>{identity.title}</h1>
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
          <dd>{words.toLocaleString("en-GB")} words · {sections} section{sections === 1 ? "" : "s"}</dd>
        </div>
        <div>
          <dt>Public route</dt>
          <dd><a href={identity.publicUrl}>{identity.publicUrl}</a></dd>
        </div>
      </dl>
      <div className="research-object-routes">
        <nav aria-label="Research object records">
          <a href={identity.sourceHref}>Source</a>
          <a href={identity.historyHref}>History</a>
          <a href={identity.citationHref}>Cite</a>
          <a href={identity.disclosureHref}>Disclosure</a>
          <a href={identity.licenceHref}>Licence</a>
        </nav>
        <nav aria-label="Research object feedback">
          <a href={identity.clarityReportHref}>Report clarity</a>
          <a href={identity.evidenceCorrectionHref}>Correct evidence</a>
        </nav>
      </div>
    </header>
  );
}
