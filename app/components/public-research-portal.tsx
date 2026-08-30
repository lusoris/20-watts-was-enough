"use client";

import {
  lazy,
  Suspense,
  useDeferredValue,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { ResearchDocument } from "../research-document";
import { outlineFromMarkdown } from "../lib/heading-outline";
import { synchronizePortalSeo } from "../lib/portal-seo";
import { readinessSummary } from "../lib/readiness";
import { publication, repositoryIssueUrl } from "../lib/publication.mjs";
import { LanguageAccess } from "./language-access";
import { PortalFooter } from "./portal-footer";
import {
  decodePortalFragment,
  loadPortalDocument,
  portalDocumentLocation,
  portalDocumentPathFromLocation,
  portalDocuments,
  portalMetrics,
} from "../portal-content";

const MarkdownDocument = lazy(() => import("./markdown-document").then(
  (module) => ({ default: module.MarkdownDocument }),
));

const repositoryUrl = publication.repository;
const defaultDocumentPath = "concept/00-thesis-and-principles.md";
const libraryGroups = ["All", "Concept", "Mathematics"] as const;
const catalogPageSize = 8;
const documentGroups = ["Concept", "Mathematics"] as const;

type LibraryGroup = (typeof libraryGroups)[number];

function withBase(basePath: string, path = "") {
  const base = basePath.endsWith("/") ? basePath : `${basePath}/`;
  return `${base}${path.replace(/^\/+/, "")}`;
}

function repositoryPath(path: string, kind: "blob" | "tree" = "blob") {
  return `${repositoryUrl}/${kind}/main/${path}`;
}

function repositoryDocumentHref(path: string, hash = "") {
  return `${repositoryPath(path)}${hash ? `#${encodeURIComponent(hash)}` : ""}`;
}

function documentIssueHref(path: string) {
  return repositoryIssueUrl(
    "site-documentation-problem.yml",
    `[Site/Docs] ${path}`,
  );
}

function overviewLocation(basePath: string, hash = "") {
  return `${withBase(basePath)}${hash ? `#${hash}` : ""}`;
}

function initialDocumentPath(basePath: string): string | null {
  if (typeof window === "undefined") return null;
  return portalDocumentPathFromLocation(window.location, basePath);
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-GB").format(value);
}

function documentSequence(path: string, group: string) {
  const fileName = path.split("/").at(-1) ?? path;
  const sequence = fileName.match(/^(\d+)-/)?.[1];
  if (sequence) return `${group} ${sequence}`;
  return group === "Mathematics" ? "Math note" : "Concept note";
}

function isSectionHeadingMatch(
  document: { path: string; title: string },
  normalizedQuery: string,
) {
  if (!normalizedQuery) return false;
  return !`${document.title} ${document.path}`
    .toLowerCase()
    .includes(normalizedQuery);
}

function usePortalSeo(metadata: Parameters<typeof synchronizePortalSeo>[0]) {
  useEffect(() => synchronizePortalSeo(metadata), [metadata]);
}

function ResearchCycleFigure() {
  const nodes = [
    { x: 225, y: 20, label: "Observation" },
    { x: 435, y: 103, label: "Principle" },
    { x: 435, y: 290, label: "Claim" },
    { x: 225, y: 394, label: "Protocol" },
    { x: 15, y: 290, label: "Bounded run" },
    { x: 15, y: 103, label: "Evidence" },
  ];
  return (
    <figure className="portal-system-figure" aria-labelledby="portal-system-figure-title">
      <header>
        <p>Research cycle</p>
        <h2 id="portal-system-figure-title">Claims must survive a return path</h2>
      </header>
      <svg
        className="portal-cycle-diagram"
        viewBox="0 0 600 450"
        role="img"
        aria-labelledby="portal-cycle-title portal-cycle-description"
      >
        <title id="portal-cycle-title">The repository research cycle</title>
        <desc id="portal-cycle-description">
          Observation leads to a deduplicated principle, a scoped claim,
          a protocol, a bounded run and eligible evidence. Evidence then
          changes or rejects the earlier statement.
        </desc>
        <defs>
          <marker
            id="portal-cycle-arrow"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="7"
            markerHeight="7"
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" />
          </marker>
        </defs>
        <path className="portal-cycle-path" d="M 375 56 L 440 112" />
        <path className="portal-cycle-path" d="M 510 158 L 510 290" />
        <path className="portal-cycle-path" d="M 440 337 L 375 394" />
        <path className="portal-cycle-path" d="M 225 394 L 160 337" />
        <path className="portal-cycle-path" d="M 90 290 L 90 158" />
        <path className="portal-cycle-path" d="M 160 112 L 225 56" />
        {nodes.map((node, index) => (
          <g className="portal-cycle-node" key={node.label}>
            <rect x={node.x} y={node.y} width="150" height="55" rx="27.5" />
            <text x={node.x + 75} y={node.y + 34}>{node.label}</text>
            <text className="portal-cycle-number" x={node.x + 17} y={node.y + 34}>
              {index + 1}
            </text>
          </g>
        ))}
        <circle className="portal-cycle-centre" cx="300" cy="225" r="92" />
        <text className="portal-cycle-centre-title" x="300" y="211">Falsify · revise</text>
        <text className="portal-cycle-centre-title" x="300" y="237">· rerun</text>
        <text className="portal-cycle-centre-note" x="300" y="267">under explicit cost</text>
      </svg>
      <figcaption>
        <span>Figure 1.</span> Repository logic, not an experimental result.
        Every arrow must preserve source identity and uncertainty.
      </figcaption>
    </figure>
  );
}

function ResearchStatus({
  assetBasePath,
  conceptCount,
  mathematicsCount,
  totalLibraryWords,
}: {
  assetBasePath: string;
  conceptCount: number;
  mathematicsCount: number;
  totalLibraryWords: number;
}) {
  return (
    <aside className="portal-overview-status" aria-label="Current research status">
      <div className="portal-status-copy">
        <p className="portal-status-label">Current repository state</p>
        <h2>Framework and development harnesses</h2>
        <p className="portal-status-summary">
          The knowledge structure and protocol layer are extensive; the
          workstation execution layer is not yet ready.
        </p>
      </div>
      <div className="portal-status-outcome" role="status">
        <strong>NO_RESULT</strong>
        <span>{readinessSummary.artifacts.workstationReady} workstation-ready artifacts</span>
      </div>
      <dl className="portal-overview-metrics">
        <div><dt>Reader</dt><dd>{portalDocuments.length} documents</dd></div>
        <div><dt>Concept</dt><dd>{conceptCount} chapters</dd></div>
        <div><dt>Mathematics</dt><dd>{mathematicsCount} notes</dd></div>
        <div><dt>Corpus</dt><dd>{formatNumber(totalLibraryWords)} words</dd></div>
      </dl>
      <nav className="portal-status-links" aria-label="Publication formats">
        <a href={withBase(assetBasePath, "book/")}>Read the full book</a>
        <a href={withBase(
          assetBasePath,
          "downloads/20-watts-was-enough-full-concept-book.pdf",
        )}>Download PDF</a>
        <a href={repositoryUrl} target="_blank" rel="noreferrer">
          Inspect GitHub <span aria-hidden="true">↗</span>
        </a>
        <a href={withBase(assetBasePath, "help/")}>How to help</a>
      </nav>
    </aside>
  );
}

export function PublicResearchPortal({
  assetBasePath,
}: {
  assetBasePath: string;
}) {
  const [selectedPath, setSelectedPath] = useState<string | null>(() => initialDocumentPath(assetBasePath));
  const [documentState, setDocumentState] = useState<{
    path: string;
    document?: ResearchDocument;
    error?: string;
  } | null>(null);
  const [query, setQuery] = useState("");
  const [group, setGroup] = useState<LibraryGroup>("All");
  const [catalogLimit, setCatalogLimit] = useState(catalogPageSize);
  const deferredQuery = useDeferredValue(query.trim().toLowerCase());
  const overviewRef = useRef<HTMLElement>(null);
  const readerRef = useRef<HTMLElement>(null);
  const readerPageRef = useRef<HTMLElement>(null);
  const readerLibraryRef = useRef<HTMLElement>(null);
  const mobileMenuRef = useRef<HTMLDetailsElement>(null);
  const mobileOutlineRef = useRef<HTMLDetailsElement>(null);
  const documentCache = useRef(new Map<string, ResearchDocument>());

  const documentsByPath = useMemo(
    () => new Map(portalDocuments.map((document) => [document.path, document])),
    [],
  );
  const selectedMetadata = selectedPath
    ? documentsByPath.get(selectedPath) ?? null
    : null;
  const selectedDocument = selectedPath && documentState?.path === selectedPath
    ? documentState.document ?? null
    : null;
  const documentError = selectedPath && documentState?.path === selectedPath
    ? documentState.error ?? ""
    : "";
  usePortalSeo(selectedMetadata);
  const outline = useMemo(
    () => selectedDocument ? outlineFromMarkdown(selectedDocument.body) : [],
    [selectedDocument],
  );

  const libraryDocuments = useMemo(() => {
    return portalDocuments.filter((document) => {
      if (group !== "All" && document.group !== group) return false;
      if (!deferredQuery) return true;
      return document.searchText.includes(deferredQuery);
    });
  }, [deferredQuery, group]);

  const visibleCatalogDocuments = useMemo(
    () => libraryDocuments.slice(0, catalogLimit),
    [catalogLimit, libraryDocuments],
  );
  const groupedLibraryDocuments = useMemo(
    () => documentGroups.map((documentGroup) => ({
      group: documentGroup,
      documents: visibleCatalogDocuments.filter(
        (document) => document.group === documentGroup,
      ),
    })).filter((entry) => entry.documents.length > 0),
    [visibleCatalogDocuments],
  );

  const selectedDocumentIndex = selectedPath
    ? portalDocuments.findIndex((document) => document.path === selectedPath)
    : -1;
  const previousDocument = selectedDocumentIndex > 0
    ? portalDocuments[selectedDocumentIndex - 1]
    : null;
  const nextDocument = selectedDocumentIndex >= 0
    && selectedDocumentIndex < portalDocuments.length - 1
    ? portalDocuments[selectedDocumentIndex + 1]
    : null;
  const readerLibraryDocuments = useMemo(() => {
    if (libraryDocuments.length <= 15) return libraryDocuments;
    const activeIndex = selectedPath
      ? libraryDocuments.findIndex((document) => document.path === selectedPath)
      : 0;
    const start = Math.max(0, Math.min(
      activeIndex < 0 ? 0 : activeIndex - 7,
      libraryDocuments.length - 15,
    ));
    return libraryDocuments.slice(start, start + 15);
  }, [libraryDocuments, selectedPath]);

  const conceptCount = portalDocuments.filter(
    (document) => document.group === "Concept",
  ).length;
  const mathematicsCount = portalDocuments.filter(
    (document) => document.group === "Mathematics",
  ).length;
  const totalLibraryWords = portalDocuments
    .reduce((total, document) => total + document.words, 0);

  const thesisMetadata = documentsByPath.get(defaultDocumentPath)!;
  const architectureMetadata = documentsByPath.get(
    "concept/01-working-architecture.md",
  )!;
  const convergenceMetadata = documentsByPath.get(
    "concept/07-cross-domain-convergence.md",
  )!;

  useEffect(() => {
    if (!selectedPath) return;

    let cancelled = false;
    const cached = documentCache.current.get(selectedPath);
    const pendingDocument = cached
      ? Promise.resolve(cached)
      : loadPortalDocument(selectedPath, assetBasePath);
    pendingDocument.then((document) => {
      if (cancelled) return;
      documentCache.current.set(selectedPath, document);
      setDocumentState({ path: selectedPath, document });
    }).catch((error: unknown) => {
      if (cancelled) return;
      setDocumentState({
        path: selectedPath,
        error: error instanceof Error ? error.message : "Document loading failed.",
      });
    });
    return () => { cancelled = true; };
  }, [assetBasePath, selectedPath]);

  useEffect(() => {
    const handleHistory = () => {
      setSelectedPath(portalDocumentPathFromLocation(window.location, assetBasePath));
    };
    window.addEventListener("popstate", handleHistory);
    return () => window.removeEventListener("popstate", handleHistory);
  }, [assetBasePath]);

  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (!hash) return;
    const frame = window.requestAnimationFrame(() => {
      document.getElementById(decodePortalFragment(hash))?.scrollIntoView();
    });
    return () => window.cancelAnimationFrame(frame);
  }, [selectedDocument, selectedPath]);

  useEffect(() => {
    if (!selectedPath) return;
    const frame = window.requestAnimationFrame(() => {
      const list = readerLibraryRef.current;
      const active = list?.querySelector<HTMLElement>('[aria-current="page"]');
      if (!list || !active) return;
      const listRect = list.getBoundingClientRect();
      const activeRect = active.getBoundingClientRect();
      if (activeRect.top >= listRect.top && activeRect.bottom <= listRect.bottom) return;
      list.scrollTop += activeRect.top
        - listRect.top
        - ((listRect.height - activeRect.height) / 2);
    });
    return () => window.cancelAnimationFrame(frame);
  }, [readerLibraryDocuments, selectedPath]);

  const selectDocument = (path: string, hash = "", focusReader = true) => {
    if (!documentsByPath.has(path)) {
      window.open(
        repositoryDocumentHref(path, hash),
        "_blank",
        "noopener,noreferrer",
      );
      return;
    }
    setSelectedPath(path);
    window.history.pushState(
      { document: path },
      "",
      portalDocumentLocation(path, assetBasePath, hash),
    );
    window.requestAnimationFrame(() => {
      if (!hash) readerPageRef.current?.scrollIntoView({ block: "start" });
      if (focusReader) readerRef.current?.focus({ preventScroll: true });
    });
  };

  const selectGroup = (candidate: LibraryGroup) => {
    setGroup(candidate);
    setCatalogLimit(catalogPageSize);
    if (
      selectedPath
      && candidate !== "All"
      && selectedMetadata?.group !== candidate
    ) {
      const firstDocument = portalDocuments.find(
        (document) => document.group === candidate,
      );
      if (firstDocument) selectDocument(firstDocument.path);
    }
  };

  const showOverview = (hash = "") => {
    mobileMenuRef.current?.removeAttribute("open");
    setSelectedPath(null);
    window.history.pushState(
      { document: null },
      "",
      overviewLocation(assetBasePath, hash),
    );
    window.requestAnimationFrame(() => {
      const target = hash ? document.getElementById(hash) : overviewRef.current;
      target?.scrollIntoView({ block: "start" });
      target?.focus({ preventScroll: true });
    });
  };

  const selectHeading = (headingId: string) => {
    mobileOutlineRef.current?.removeAttribute("open");
    const targetUrl = new URL(window.location.href);
    targetUrl.hash = headingId;
    window.history.pushState(
      { document: selectedPath, heading: headingId },
      "",
      `${targetUrl.pathname}${targetUrl.search}${targetUrl.hash}`,
    );
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        document.getElementById(headingId)?.scrollIntoView({ block: "start" });
      });
    });
  };

  const funnelSteps = [
    {
      label: "Thesis + observations",
      metric: `1 thesis · ${portalMetrics.provenanceFiles} provenance files`,
      description: "The thesis states the target; dated inputs retain origin while audited literature supports claims.",
      href: repositoryPath(defaultDocumentPath),
      tone: "source",
    },
    {
      label: "Deduplicated principles",
      metric: `${portalMetrics.principles} P-series bundles`,
      description: "Recurring causal patterns are merged without erasing their domain-specific evidence.",
      href: repositoryPath("research/principle-registry.md"),
      tone: "principle",
    },
    {
      label: "Scoped claims",
      metric: `${formatNumber(readinessSummary.claims.total)} stable IDs`,
      description: "Each claim carries evidence status, rationale, open questions and affected chapters.",
      href: repositoryPath("research/claims.md"),
      tone: "claim",
    },
    {
      label: "Protocols",
      metric: `${formatNumber(readinessSummary.claims.protocolCovered)} claims covered`,
      description: `${readinessSummary.artifacts.protocolComplete} complete protocol artifacts define tests and failure conditions.`,
      href: repositoryPath("experiments/fixtures", "tree"),
      tone: "protocol",
    },
    {
      label: "Runnable harnesses",
      metric: `${readinessSummary.artifacts.smokeReady} development smoke harnesses`,
      description: "Development runs check contracts, telemetry and reproducibility machinery.",
      href: repositoryPath("experiments/workstation", "tree"),
      tone: "smoke",
    },
    {
      label: "Eligible results",
      metric: `NO_RESULT · ${readinessSummary.artifacts.workstationReady} workstation-ready`,
      description: "Only preregistered, valid workstation runs can move beyond development diagnostics.",
      href: repositoryPath("experiments/README.md"),
      tone: "result",
    },
  ] as const;

  const header = (
    <header className="portal-header">
      <a
        className="portal-wordmark"
        href={overviewLocation(assetBasePath)}
        onClick={(event) => {
          event.preventDefault();
          showOverview();
        }}
      >
        <span aria-hidden="true">20W</span>
        <strong>20 Watts Was Enough</strong>
      </a>
      <nav aria-label="Primary navigation">
        <a
          href={portalDocumentLocation(defaultDocumentPath, assetBasePath)}
          onClick={(event) => {
            event.preventDefault();
            selectDocument(defaultDocumentPath);
          }}
        >Read</a>
        <a
          href={overviewLocation(assetBasePath, "research-system")}
          onClick={(event) => {
            event.preventDefault();
            showOverview("research-system");
          }}
        >Evidence</a>
        <a
          href={repositoryPath("experiments/README.md")}
          target="_blank"
          rel="noreferrer"
        >Experiments <span aria-hidden="true">↗</span></a>
        <a href={withBase(assetBasePath, "help/")}>Contribute</a>
      </nav>
      <a className="portal-source-link" href={repositoryUrl} target="_blank" rel="noreferrer">
        Source <span aria-hidden="true">↗</span>
      </a>
      <LanguageAccess />
      <details className="portal-mobile-menu" ref={mobileMenuRef}>
        <summary>Menu</summary>
        <nav aria-label="Mobile navigation">
          <a
            href={portalDocumentLocation(defaultDocumentPath, assetBasePath)}
            onClick={(event) => {
              event.preventDefault();
              selectDocument(defaultDocumentPath);
            }}
          >Read the thesis</a>
          <a
            href={overviewLocation(assetBasePath, "research-system")}
            onClick={(event) => {
              event.preventDefault();
              showOverview("research-system");
            }}
          >Evidence path</a>
          <a
            href={repositoryPath("experiments/README.md")}
            target="_blank"
            rel="noreferrer"
          >Experiments ↗</a>
          <a href={withBase(assetBasePath, "book/")}>Full book</a>
          <a href={withBase(assetBasePath, "help/")}>Contribute</a>
          <a href={repositoryUrl} target="_blank" rel="noreferrer">
            Source on GitHub ↗
          </a>
        </nav>
      </details>
    </header>
  );

  return (
    <div className="portal-shell">
      <a
        className="portal-skip-link"
        href={selectedPath ? "#portal-reader" : "#portal-overview"}
        onClick={() => {
          const targetId = selectedPath ? "portal-reader" : "portal-overview";
          window.requestAnimationFrame(() => document.getElementById(targetId)?.focus());
        }}
      >
        {selectedPath ? "Skip to document" : "Skip to research overview"}
      </a>

      {header}

      {selectedPath && selectedMetadata ? (
        <main id="portal-main" className="portal-reader-page" ref={readerPageRef}>
          <section
            className="portal-reader-toolbar"
            aria-labelledby="portal-reader-title"
          >
            <a
              className="portal-reader-back"
              href={overviewLocation(assetBasePath, "library")}
              onClick={(event) => {
                event.preventDefault();
                showOverview("library");
              }}
            >
              <span aria-hidden="true">←</span> Research overview
            </a>
            <div className="portal-reader-toolbar-copy">
              <p>{selectedMetadata.group} · {formatNumber(selectedMetadata.words)} words</p>
              <h1 id="portal-reader-title">{selectedMetadata.title}</h1>
            </div>
            <nav className="portal-reader-sequence" aria-label="Document sequence">
              {previousDocument ? (
                <a
                  href={portalDocumentLocation(previousDocument.path, assetBasePath)}
                  onClick={(event) => {
                    event.preventDefault();
                    selectDocument(previousDocument.path);
                  }}
                  rel="prev"
                >← Previous</a>
              ) : (
                <span aria-disabled="true">← Previous</span>
              )}
              <b>{selectedDocumentIndex + 1} / {portalDocuments.length}</b>
              {nextDocument ? (
                <a
                  href={portalDocumentLocation(nextDocument.path, assetBasePath)}
                  onClick={(event) => {
                    event.preventDefault();
                    selectDocument(nextDocument.path);
                  }}
                  rel="next"
                >Next →</a>
              ) : (
                <span aria-disabled="true">Next →</span>
              )}
            </nav>
            <nav aria-label="Document actions">
              <a
                href={repositoryPath(selectedMetadata.path)}
                target="_blank"
                rel="noreferrer"
              >Source <span aria-hidden="true">↗</span></a>
              <a
                href={documentIssueHref(selectedMetadata.path)}
                target="_blank"
                rel="noreferrer"
              >Report issue <span aria-hidden="true">↗</span></a>
              <a href={withBase(assetBasePath, "book/")}>Full book</a>
              <a
                href={withBase(
                  assetBasePath,
                  "downloads/20-watts-was-enough-full-concept-book.pdf",
                )}
              >PDF</a>
            </nav>
          </section>

          <section className="portal-reader-workspace" aria-label="Research document workspace">
            {outline.length ? (
              <details className="portal-mobile-outline" ref={mobileOutlineRef}>
                <summary>
                  <span>Contents</span>
                  <b>{outline.length} sections</b>
                </summary>
                <nav aria-label="Document sections">
                  {outline.map((heading) => (
                    <a
                      className={heading.depth === 3 ? "portal-outline-child" : ""}
                      href={`#${heading.id}`}
                      key={heading.id}
                      onClick={(event) => {
                        event.preventDefault();
                        selectHeading(heading.id);
                      }}
                    >{heading.title}</a>
                  ))}
                </nav>
              </details>
            ) : null}
            <div className="portal-reader-grid">
              <aside className="portal-library" aria-label="Document library">
                <label htmlFor="portal-library-search">Find another document</label>
                <div className="portal-search-control">
                  <span aria-hidden="true">⌕</span>
                  <input
                    id="portal-library-search"
                    type="search"
                    value={query}
                    onChange={(event) => {
                      setQuery(event.target.value);
                      setCatalogLimit(catalogPageSize);
                    }}
                    placeholder="routing, memory, energy…"
                  />
                </div>
                <div className="portal-filter-tabs" role="group" aria-label="Document group">
                  {libraryGroups.map((candidate) => (
                    <button
                      type="button"
                      key={candidate}
                      aria-pressed={group === candidate}
                      onClick={() => selectGroup(candidate)}
                    >{candidate}</button>
                  ))}
                </div>
                <p className="portal-result-count" aria-live="polite">
                  Showing {readerLibraryDocuments.length} of {libraryDocuments.length} matching documents
                  {!libraryDocuments.some(
                    (document) => document.path === selectedMetadata.path,
                  ) ? (
                    <span className="portal-filter-context">
                      Current document is outside this filter.
                    </span>
                  ) : null}
                </p>
                <nav
                  className="portal-document-list"
                  ref={readerLibraryRef}
                  aria-label="Research documents"
                >
                  {readerLibraryDocuments.map((document) => (
                    <button
                      type="button"
                      key={document.path}
                      className={document.path === selectedMetadata.path ? "active" : ""}
                      aria-current={document.path === selectedMetadata.path ? "page" : undefined}
                      onClick={() => selectDocument(document.path)}
                    >
                      <span>{document.title}</span>
                      <small>
                        {documentSequence(document.path, document.group)} · {formatNumber(document.words)} words
                        {isSectionHeadingMatch(document, deferredQuery)
                          ? " · section heading match"
                          : ""}
                      </small>
                    </button>
                  ))}
                  {libraryDocuments.length === 0 ? (
                    <p className="portal-empty-state">
                      No matching title, file path or section heading.
                    </p>
                  ) : null}
                </nav>
              </aside>

              <article
                className="portal-reader"
                id="portal-reader"
                ref={readerRef}
                tabIndex={-1}
                aria-labelledby="portal-reader-title"
              >
                <header className="portal-reader-header">
                  <div>
                    <p>Canonical Markdown</p>
                    <code>{selectedMetadata.path}</code>
                  </div>
                  <a
                    href={repositoryPath(selectedMetadata.path)}
                    target="_blank"
                    rel="noreferrer"
                  >View source <span aria-hidden="true">↗</span></a>
                </header>
                <div className="portal-reader-meta">
                  <span>{formatNumber(selectedMetadata.words)} words</span>
                  <span>{outline.length} section{outline.length === 1 ? "" : "s"}</span>
                </div>
                <div className="prose portal-prose">
                  {selectedDocument ? (
                    <Suspense
                      fallback={(
                        <div className="portal-document-state" role="status">
                          Preparing mathematics and diagrams…
                        </div>
                      )}
                    >
                      <MarkdownDocument
                        body={selectedDocument.body}
                        currentPath={selectedDocument.path}
                        headingOffset={1}
                        onNavigate={selectDocument}
                        internalHref={(path, hash) => portalDocumentLocation(path, assetBasePath, hash)}
                        isNavigablePath={(path) => documentsByPath.has(path)}
                        nonNavigableHref={repositoryDocumentHref}
                        assetBasePath={assetBasePath}
                      />
                    </Suspense>
                  ) : documentError ? (
                    <div className="portal-document-state" role="alert">
                      <strong>Document unavailable</strong>
                      <p>{documentError}</p>
                      <a href={repositoryPath(selectedMetadata.path)}>Read it on GitHub</a>
                    </div>
                  ) : (
                    <div className="portal-document-state" role="status">
                      Loading document…
                    </div>
                  )}
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
                      >{heading.title}</a>
                    ))}
                  </nav>
                ) : (
                  <span>Sections appear after the document loads.</span>
                )}
              </aside>
            </div>
          </section>
        </main>
      ) : (
        <main id="portal-main" className="portal-overview-page">
          <section
            className="portal-dashboard"
            id="portal-overview"
            ref={overviewRef}
            tabIndex={-1}
            aria-labelledby="portal-title"
          >
            <div className="portal-dashboard-intro">
              <p className="portal-eyebrow">Open research programme · living source</p>
              <h1 id="portal-title">20 Watts Was Enough</h1>
              <p className="portal-dashboard-thesis">
                Can an artificial system learn and adapt while activating less
                computation and moving less data? This programme turns
                mechanisms from living and engineered systems into scoped
                claims, explicit principles and equal-budget tests.
              </p>
              <dl className="portal-hero-meta" aria-label="Publication identity">
                <div><dt>Authority</dt><dd>Git <code>main</code></dd></div>
                <div><dt>Stage</dt><dd>Framework and harnesses</dd></div>
                <div><dt>Evidence</dt><dd>No eligible result yet</dd></div>
              </dl>
              <div className="portal-dashboard-actions">
                <a
                  className="portal-action portal-action-primary"
                  href={portalDocumentLocation(defaultDocumentPath, assetBasePath)}
                  onClick={(event) => {
                    event.preventDefault();
                    selectDocument(defaultDocumentPath);
                  }}
                >Read the thesis</a>
                <a className="portal-action portal-action-secondary" href={withBase(assetBasePath, "book/")}>
                  Read the book
                </a>
                <a
                  className="portal-action portal-action-tertiary"
                  href={repositoryPath("experiments/README.md")}
                  target="_blank"
                  rel="noreferrer"
                >Inspect experiments <span aria-hidden="true">↗</span></a>
              </div>
            </div>

            <ResearchCycleFigure />

            <ResearchStatus
              assetBasePath={assetBasePath}
              conceptCount={conceptCount}
              mathematicsCount={mathematicsCount}
              totalLibraryWords={totalLibraryWords}
            />

            <div
              className="portal-dashboard-funnel"
              id="research-system"
              tabIndex={-1}
              aria-labelledby="research-system-title"
            >
              <header className="portal-funnel-heading">
                <div>
                  <p>Evidence path</p>
                  <h2 id="research-system-title">How a statement earns weight</h2>
                </div>
                <span>
                  Each stage opens the maintained artifact. Construction and
                  smoke checks stop short of a scientific result.
                </span>
              </header>
              <ol className="portal-funnel portal-funnel-compact">
              {funnelSteps.map((step, index) => (
                <li
                  className={`portal-funnel-step portal-funnel-step-${step.tone}`}
                  key={step.label}
                >
                  <span className="portal-funnel-index">{String(index + 1).padStart(2, "0")}</span>
                  <div>
                    <h3>{step.label}</h3>
                    <strong>{step.metric}</strong>
                    <p>{step.description}</p>
                  </div>
                  <a href={step.href} target="_blank" rel="noreferrer">
                    Open {step.label} <span aria-hidden="true">↗</span>
                  </a>
                </li>
              ))}
              </ol>
            </div>
          </section>

          <section
            className="portal-section portal-start-section"
            aria-labelledby="portal-start-title"
          >
            <div className="portal-section-heading portal-start-heading">
              <p>Start by question</p>
              <h2 id="portal-start-title">Choose the shortest useful path</h2>
              <span>
                Use the focused reader for one document, or the book for the
                maintained linear sequence.
              </span>
            </div>
            <div className="portal-start-grid">
              {[
                {
                  label: "What is the central hypothesis?",
                  title: thesisMetadata.title,
                  document: thesisMetadata,
                  tone: "green",
                },
                {
                  label: "How could the system fit together?",
                  title: architectureMetadata.title,
                  document: architectureMetadata,
                  tone: "blue",
                },
                {
                  label: "How are ideas deduplicated across fields?",
                  title: convergenceMetadata.title,
                  document: convergenceMetadata,
                  tone: "violet",
                },
              ].map((entry) => (
                <a
                  className={`portal-start-card portal-start-card-${entry.tone}`}
                  href={portalDocumentLocation(entry.document.path, assetBasePath)}
                  key={entry.document.path}
                  onClick={(event) => {
                    event.preventDefault();
                    selectDocument(entry.document.path);
                  }}
                >
                  <span>{entry.label}</span>
                  <h3>{entry.title}</h3>
                  <small>{formatNumber(entry.document.words)} words</small>
                  <strong aria-hidden="true">→</strong>
                </a>
              ))}
              <a
                className="portal-start-card portal-start-card-amber"
                href={withBase(assetBasePath, "book/")}
              >
                <span>How do I read everything in order?</span>
                <h3>Complete book edition</h3>
                <small>Equations, diagrams and sources</small>
                <strong aria-hidden="true">→</strong>
              </a>
            </div>
          </section>

          <section
            className="portal-section portal-catalog-section"
            id="library"
            tabIndex={-1}
            aria-labelledby="library-title"
          >
            <div className="portal-section-heading portal-catalog-heading">
              <p>Research library</p>
              <h2 id="library-title">Find one maintained document</h2>
              <span>
                Search checks titles, canonical file paths and section headings.
                Opening a result switches to the focused reader.
              </span>
            </div>

            <div className="portal-catalog-panel">
              <div className="portal-catalog-tools">
                <label htmlFor="portal-catalog-search">Search the library</label>
                <div className="portal-search-control">
                  <span aria-hidden="true">⌕</span>
                  <input
                    id="portal-catalog-search"
                    type="search"
                    value={query}
                    onChange={(event) => {
                      setQuery(event.target.value);
                      setCatalogLimit(catalogPageSize);
                    }}
                    placeholder="Try routing, memory, energy or measurement"
                  />
                </div>
                <div className="portal-filter-tabs" role="group" aria-label="Document group">
                  {libraryGroups.map((candidate) => (
                    <button
                      type="button"
                      key={candidate}
                      aria-pressed={group === candidate}
                      onClick={() => selectGroup(candidate)}
                    >{candidate}</button>
                  ))}
                </div>
                <p className="portal-result-count" aria-live="polite">
                  {libraryDocuments.length} matches · showing {visibleCatalogDocuments.length}
                </p>
              </div>

              <div className="portal-catalog-results">
                {groupedLibraryDocuments.map((entry) => (
                  <section className="portal-catalog-group" key={entry.group}>
                    <header>
                      <div>
                        <h3>{entry.group}</h3>
                        <p>
                          {entry.group === "Concept"
                            ? "Observations, AI translations, mechanisms, failure modes and predictions."
                            : "Notation, derivations, units and falsifiable efficiency models."}
                        </p>
                      </div>
                      <span>{entry.documents.length} shown</span>
                    </header>
                    <ol className="portal-catalog-list">
                      {entry.documents.map((document) => (
                        <li key={document.path}>
                          <a
                            href={portalDocumentLocation(document.path, assetBasePath)}
                            onClick={(event) => {
                              event.preventDefault();
                              selectDocument(document.path);
                            }}
                          >
                            <span>{documentSequence(document.path, document.group)}</span>
                            <strong>{document.title}</strong>
                            <small>
                              {document.path} · {formatNumber(document.words)} words
                              {isSectionHeadingMatch(document, deferredQuery)
                                ? " · section heading match"
                                : ""}
                            </small>
                            <b aria-hidden="true">→</b>
                          </a>
                        </li>
                      ))}
                    </ol>
                  </section>
                ))}
                {visibleCatalogDocuments.length < libraryDocuments.length ? (
                  <button
                    className="portal-catalog-more"
                    type="button"
                    onClick={() => setCatalogLimit((current) => current + catalogPageSize)}
                  >
                    Show {catalogPageSize} more
                    <span>
                      {libraryDocuments.length - visibleCatalogDocuments.length} remaining
                    </span>
                  </button>
                ) : null}
                {libraryDocuments.length === 0 ? (
                  <div className="portal-empty-state" role="status">
                    No matching title, file path or section heading. Try a
                    mechanism, discipline or chapter number.
                  </div>
                ) : null}
              </div>
            </div>
          </section>
        </main>
      )}

      <PortalFooter assetBasePath={assetBasePath} />
    </div>
  );
}
