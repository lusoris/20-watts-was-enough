"use client";

import {
  useDeferredValue,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { bookDocuments } from "../book-content";
import { outlineFromMarkdown } from "../lib/heading-outline";
import { readinessSummary } from "../lib/readiness";
import { MarkdownDocument } from "./markdown-document";

const repositoryUrl = "https://github.com/lusoris/20-watts-was-enough";
const defaultDocumentPath = "concept/00-thesis-and-principles.md";
const libraryGroups = ["All", "Concept", "Mathematics"] as const;

type LibraryGroup = (typeof libraryGroups)[number];

function withBase(basePath: string, path = "") {
  const base = basePath.endsWith("/") ? basePath : `${basePath}/`;
  return `${base}${path.replace(/^\/+/, "")}`;
}

function repositoryPath(path: string, kind: "blob" | "tree" = "blob") {
  return `${repositoryUrl}/${kind}/main/${path}`;
}

function documentLocation(basePath: string, path: string, hash = "") {
  const target = new URL(withBase(basePath), window.location.origin);
  target.searchParams.set("doc", path);
  target.hash = hash ? `#${hash}` : "";
  return `${target.pathname}${target.search}${target.hash}`;
}

function initialDocumentPath() {
  if (typeof window === "undefined") return defaultDocumentPath;
  const requested = new URLSearchParams(window.location.search).get("doc");
  return bookDocuments.some((document) => document.path === requested)
    ? requested!
    : defaultDocumentPath;
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-GB").format(value);
}

export function PublicResearchPortal({
  assetBasePath,
}: {
  assetBasePath: string;
}) {
  const [selectedPath, setSelectedPath] = useState(initialDocumentPath);
  const [query, setQuery] = useState("");
  const [group, setGroup] = useState<LibraryGroup>("All");
  const deferredQuery = useDeferredValue(query.trim().toLocaleLowerCase());
  const readerRef = useRef<HTMLElement>(null);

  const documentsByPath = useMemo(
    () => new Map(bookDocuments.map((document) => [document.path, document])),
    [],
  );
  const selectedDocument =
    documentsByPath.get(selectedPath) ?? documentsByPath.get(defaultDocumentPath)!;
  const outline = useMemo(
    () => outlineFromMarkdown(selectedDocument.body),
    [selectedDocument],
  );

  const libraryDocuments = useMemo(() => {
    return bookDocuments.filter((document) => {
      if (document.group !== "Concept" && document.group !== "Mathematics") {
        return false;
      }
      if (group !== "All" && document.group !== group) return false;
      if (!deferredQuery) return true;
      const searchable = `${document.title}\n${document.path}\n${document.body}`
        .toLocaleLowerCase();
      return searchable.includes(deferredQuery);
    });
  }, [deferredQuery, group]);

  const conceptCount = bookDocuments.filter(
    (document) => document.group === "Concept",
  ).length;
  const mathematicsCount = bookDocuments.filter(
    (document) => document.group === "Mathematics",
  ).length;
  const totalLibraryWords = bookDocuments
    .filter(
      (document) =>
        document.group === "Concept" || document.group === "Mathematics",
    )
    .reduce((total, document) => total + document.words, 0);

  useEffect(() => {
    const handleHistory = () => {
      const requested = new URLSearchParams(window.location.search).get("doc");
      if (requested && documentsByPath.has(requested)) setSelectedPath(requested);
    };
    window.addEventListener("popstate", handleHistory);
    return () => window.removeEventListener("popstate", handleHistory);
  }, [documentsByPath]);

  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (!hash) return;
    const frame = window.requestAnimationFrame(() => {
      document.getElementById(decodeURIComponent(hash))?.scrollIntoView();
    });
    return () => window.cancelAnimationFrame(frame);
  }, [selectedPath]);

  const selectDocument = (path: string, hash = "", focusReader = true) => {
    if (!documentsByPath.has(path)) {
      window.open(
        `${repositoryPath(path)}${hash ? `#${encodeURIComponent(hash)}` : ""}`,
        "_blank",
        "noopener,noreferrer",
      );
      return;
    }
    setSelectedPath(path);
    window.history.pushState(
      { document: path },
      "",
      documentLocation(assetBasePath, path, hash),
    );
    window.requestAnimationFrame(() => {
      if (hash) document.getElementById(hash)?.scrollIntoView();
      else readerRef.current?.scrollIntoView({ block: "start" });
      if (focusReader) readerRef.current?.focus({ preventScroll: true });
    });
  };

  const navigationCards = [
    {
      label: "Concept",
      metric: `${conceptCount} chapters`,
      description:
        "Architecture, biological translations, measurable predictions and failure modes.",
      href: "#library",
      tone: "green",
    },
    {
      label: "Evidence",
      metric: `${formatNumber(readinessSummary.claims.total)} claims`,
      description:
        "Stable claim IDs, evidence status, sources, rationale and open questions.",
      href: repositoryPath("research/claims.md"),
      tone: "blue",
      external: true,
    },
    {
      label: "Experiments",
      metric: `${readinessSummary.artifacts.protocolComplete} protocols`,
      description:
        "Contracts, fixtures and smoke harnesses kept distinct from scientific results.",
      href: repositoryPath("experiments", "tree"),
      tone: "coral",
      external: true,
    },
    {
      label: "Mathematics",
      metric: `${mathematicsCount} notes`,
      description:
        "Notation, derivations, dimensional analysis and falsifiable efficiency models.",
      href: "#library",
      tone: "violet",
    },
    {
      label: "Book",
      metric: "Linear edition",
      description:
        "The complete long-form reading sequence, with equations, diagrams and sources.",
      href: withBase(assetBasePath, "book/"),
      tone: "amber",
    },
    {
      label: "PDF",
      metric: "Download / print",
      description:
        "The generated A4 edition for offline reading, review, email or print.",
      href: withBase(
        assetBasePath,
        "downloads/20-watts-was-enough-full-concept-book.pdf",
      ),
      tone: "cyan",
    },
  ] as const;

  return (
    <div className="portal-shell">
      <a className="portal-skip-link" href="#portal-main">
        Skip to research overview
      </a>

      <header className="portal-header">
        <a className="portal-wordmark" href={withBase(assetBasePath)}>
          <span aria-hidden="true">20W</span>
          <strong>20 Watts Was Enough</strong>
        </a>
        <nav aria-label="Primary navigation">
          <a href="#research-map">Research map</a>
          <a href="#library">Read</a>
          <a href={withBase(assetBasePath, "book/")}>Book</a>
          <a href={repositoryUrl} target="_blank" rel="noreferrer">
            GitHub <span aria-hidden="true">↗</span>
          </a>
        </nav>
      </header>

      <main id="portal-main">
        <section className="portal-hero" aria-labelledby="portal-title">
          <div className="portal-hero-copy">
            <p className="portal-eyebrow">Open research programme · public working source</p>
            <h1 id="portal-title">
              Useful intelligence should pay for what it activates.
            </h1>
            <p className="portal-thesis">
              A cross-disciplinary R&amp;D blueprint for sparse, grounded,
              continual and energy-accountable AI—built from testable principles,
              not a single biological metaphor.
            </p>
            <div className="portal-hero-actions">
              <a className="portal-action portal-action-primary" href="#library">
                Enter the research library
              </a>
              <a
                className="portal-action portal-action-secondary"
                href={repositoryUrl}
                target="_blank"
                rel="noreferrer"
              >
                Inspect the canonical source
              </a>
            </div>
          </div>

          <aside className="portal-status-panel" aria-label="Current research status">
            <p>Current state</p>
            <strong>Framework + development harnesses</strong>
            <dl>
              <div>
                <dt>Claims in ledger</dt>
                <dd>{formatNumber(readinessSummary.claims.total)}</dd>
              </div>
              <div>
                <dt>Protocol-covered</dt>
                <dd>{formatNumber(readinessSummary.claims.protocolCovered)}</dd>
              </div>
              <div>
                <dt>Smoke-ready artifacts</dt>
                <dd>{readinessSummary.artifacts.smokeReady}</dd>
              </div>
              <div>
                <dt>Workstation-ready</dt>
                <dd>{readinessSummary.artifacts.workstationReady}</dd>
              </div>
            </dl>
            <small>
              Readiness is generated from the repository. Smoke diagnostics are
              not scientific or performance results.
            </small>
          </aside>
        </section>

        <section className="portal-principles" aria-label="Programme principles">
          <p>
            <span>01</span>
            Capacity and active computation are separate quantities.
          </p>
          <p>
            <span>02</span>
            Data movement, memory and uncertainty belong in the cost model.
          </p>
          <p>
            <span>03</span>
            Every borrowed mechanism must end in a measurable prediction.
          </p>
        </section>

        <section
          className="portal-section portal-map-section"
          id="research-map"
          aria-labelledby="research-map-title"
        >
          <div className="portal-section-heading">
            <p>Research map</p>
            <h2 id="research-map-title">One repository, six ways into the work</h2>
            <span>
              Browse the living research by purpose. The book and PDF are outputs;
              the ledgers and Markdown files remain canonical.
            </span>
          </div>
          <div className="portal-map-grid">
            {navigationCards.map((card, index) => (
              <a
                className={`portal-map-card portal-map-card-${card.tone}`}
                href={card.href}
                key={card.label}
                target={"external" in card && card.external ? "_blank" : undefined}
                rel={"external" in card && card.external ? "noreferrer" : undefined}
                onClick={
                  card.label === "Concept" || card.label === "Mathematics"
                    ? () => setGroup(card.label as LibraryGroup)
                    : undefined
                }
              >
                <span className="portal-map-index">0{index + 1}</span>
                <div>
                  <h3>{card.label}</h3>
                  <strong>{card.metric}</strong>
                  <p>{card.description}</p>
                </div>
                <span className="portal-map-arrow" aria-hidden="true">→</span>
              </a>
            ))}
          </div>
        </section>

        <section
          className="portal-section portal-library-section"
          id="library"
          aria-labelledby="library-title"
        >
          <div className="portal-section-heading portal-library-heading">
            <div>
              <p>Web reader</p>
              <h2 id="library-title">Concept + mathematics library</h2>
            </div>
            <span>
              {conceptCount + mathematicsCount} maintained documents · approximately{" "}
              {formatNumber(totalLibraryWords)} words
            </span>
          </div>

          <div className="portal-reader-grid">
            <aside className="portal-library" aria-label="Document library">
              <label htmlFor="portal-library-search">Search titles and text</label>
              <div className="portal-search-control">
                <span aria-hidden="true">⌕</span>
                <input
                  id="portal-library-search"
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="routing, memory, energy…"
                />
              </div>
              <div className="portal-filter-tabs" role="group" aria-label="Document group">
                {libraryGroups.map((candidate) => (
                  <button
                    type="button"
                    key={candidate}
                    aria-pressed={group === candidate}
                    onClick={() => setGroup(candidate)}
                  >
                    {candidate}
                  </button>
                ))}
              </div>
              <p className="portal-result-count" aria-live="polite">
                {libraryDocuments.length} document{libraryDocuments.length === 1 ? "" : "s"}
              </p>
              <nav className="portal-document-list" aria-label="Research documents">
                {libraryDocuments.map((document) => (
                  <button
                    type="button"
                    key={document.path}
                    className={document.path === selectedDocument.path ? "active" : ""}
                    aria-current={document.path === selectedDocument.path ? "page" : undefined}
                    onClick={() => selectDocument(document.path)}
                  >
                    <span>{document.title}</span>
                    <small>
                      {document.group} · {formatNumber(document.words)} words
                    </small>
                  </button>
                ))}
                {libraryDocuments.length === 0 ? (
                  <p className="portal-empty-state">
                    No document matches this search. Try a mechanism, field or
                    chapter title.
                  </p>
                ) : null}
              </nav>
            </aside>

            <article
              className="portal-reader"
              ref={readerRef}
              tabIndex={-1}
              aria-labelledby="portal-reader-document-title"
            >
              <header className="portal-reader-header">
                <div>
                  <p>{selectedDocument.group} document</p>
                  <h2 id="portal-reader-document-title">{selectedDocument.title}</h2>
                </div>
                <a
                  href={repositoryPath(selectedDocument.path)}
                  target="_blank"
                  rel="noreferrer"
                >
                  View source <span aria-hidden="true">↗</span>
                </a>
              </header>
              <div className="portal-reader-meta">
                <code>{selectedDocument.path}</code>
                <span>{formatNumber(selectedDocument.words)} words</span>
              </div>
              <div className="prose portal-prose">
                <MarkdownDocument
                  body={selectedDocument.body}
                  currentPath={selectedDocument.path}
                  onNavigate={selectDocument}
                  isNavigablePath={(path) => documentsByPath.has(path)}
                  assetBasePath={assetBasePath}
                />
              </div>
            </article>

            <aside className="portal-outline" aria-label="Document sections">
              <p>On this page</p>
              {outline.length ? (
                <nav>
                  {outline.map((heading) => (
                    <a
                      className={heading.depth === 3 ? "portal-outline-child" : ""}
                      href={`#${heading.id}`}
                      key={heading.id}
                    >
                      {heading.title}
                    </a>
                  ))}
                </nav>
              ) : (
                <span>No subsections in this document.</span>
              )}
            </aside>
          </div>
        </section>
      </main>

      <footer className="portal-footer">
        <div>
          <strong>20 Watts Was Enough</strong>
          <p>
            Canonical public research source. European Union and German normative
            context by default.
          </p>
        </div>
        <nav aria-label="Project links">
          <a href={repositoryUrl} target="_blank" rel="noreferrer">Repository</a>
          <a href={repositoryPath("research/references.bib")} target="_blank" rel="noreferrer">
            Bibliography
          </a>
          <a href={withBase(assetBasePath, "LICENSING.md")}>Licensing</a>
          <a href={withBase(assetBasePath, "book/")}>Full book</a>
        </nav>
      </footer>
    </div>
  );
}
