import { publication } from "../lib/publication.mjs";

function withBase(basePath: string, path = "") {
  const base = basePath.endsWith("/") ? basePath : `${basePath}/`;
  return `${base}${path.replace(/^\/+/, "")}`;
}

function repositoryPath(path: string) {
  return `${publication.repository}/blob/main/${path}`;
}

export function PortalFooter({ assetBasePath }: { assetBasePath: string }) {
  return (
    <footer className="portal-footer">
      <div>
        <strong>20 Watts Was Enough</strong>
        <p>
          Canonical public research source. European Union and German normative
          context by default.
        </p>
      </div>
      <nav aria-label="Project links">
        <a href={publication.repository} target="_blank" rel="noreferrer">Repository</a>
        <a href={repositoryPath("research/references.bib")} target="_blank" rel="noreferrer">
          Bibliography
        </a>
        <a href={withBase(assetBasePath, "LICENSING.md")}>Licensing</a>
        <a href={withBase(assetBasePath, "book/")}>Full book</a>
        <a href={withBase(assetBasePath, "help/")}>How to help</a>
        <a href={`${publication.repository}/issues/new/choose`} target="_blank" rel="noreferrer">
          Report or propose
        </a>
      </nav>
    </footer>
  );
}
