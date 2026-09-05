"use client";

import {
  lazy,
  Suspense,
  useDeferredValue,
  useEffect,
  useMemo,
  useRef,
  useState,
  type MouseEvent,
} from "react";
import type { ResearchDocument } from "../research-document";
import type { ResearchObjectEvidenceRecord } from "../research-object";
import { outlineFromMarkdown } from "../lib/heading-outline";
import { synchronizePortalSeo } from "../lib/portal-seo";
import { readinessSummary } from "../lib/readiness";
import { publication } from "../lib/publication.mjs";
import { projectVersion } from "../project-metadata";
import { LanguageAccess } from "./language-access";
import { PortalFooter } from "./portal-footer";
import { ResearchObjectHeader } from "./research-object-header";
import {
  decodePortalFragment,
  loadPortalDocument,
  loadPortalEvidenceRecords,
  portalDocumentLocation,
  portalDocumentPathFromLocation,
  portalDocuments,
  portalMetrics,
  type PortalDocumentMetadata,
} from "../portal-content";

const MarkdownDocument = lazy(() => import("./markdown-document").then(
  (module) => ({ default: module.MarkdownDocument }),
));

const repositoryUrl = publication.repository;
const defaultDocumentPath = "concept/00-thesis-and-principles.md";
const libraryGroups = ["All", "Concept", "Mathematics"] as const;
const catalogPageSize = 8;
const documentGroups = ["Concept", "Mathematics"] as const;
const portalDestinationFrameLimit = 180;

type LibraryGroup = (typeof libraryGroups)[number];
type PortalNavigationRequest = {
  focusDestination: boolean;
  fragment: string;
};
type ElementRef<T extends HTMLElement> = { current: T | null };

type PortalDocumentState = {
  path: string;
  document?: ResearchDocument;
  evidenceRecords?: ResearchObjectEvidenceRecord[];
  error?: string;
};

function cachedOrLoad<T>(cache: Map<string, T>, path: string, load: () => Promise<T>) {
  const cached = cache.get(path);
  return cached ? Promise.resolve(cached) : load();
}

function evidenceForSelection(state: PortalDocumentState | null, selectedPath: string | null) {
  if (!selectedPath || state?.path !== selectedPath) return [];
  return state.evidenceRecords ?? [];
}

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

function overviewLocation(basePath: string, hash = "") {
  return `${withBase(basePath)}${hash ? `#${hash}` : ""}`;
}

function initialDocumentPath(basePath: string): string | null {
  if (typeof window === "undefined") return null;
  return portalDocumentPathFromLocation(window.location, basePath);
}

function initialPortalFragment(): string {
  if (typeof window === "undefined") return "";
  return window.location.hash.slice(1);
}

function shouldHandleClientNavigation(event: MouseEvent<HTMLAnchorElement>) {
  return event.button === 0
    && !event.altKey
    && !event.ctrlKey
    && !event.metaKey
    && !event.shiftKey
    && event.currentTarget.target !== "_blank";
}

function handleClientNavigation(
  event: MouseEvent<HTMLAnchorElement>,
  navigate: () => void,
) {
  if (!shouldHandleClientNavigation(event)) return;
  event.preventDefault();
  navigate();
}

function makeProgrammaticallyFocusable(target: HTMLElement) {
  if (!target.matches("a[href], button, input, select, textarea, summary, [tabindex]")) {
    target.tabIndex = -1;
  }
}

function usePortalDestination({
  navigationRequest,
  overviewRef,
  readerPageRef,
  readerTitleRef,
  renderedDocumentPath,
  selectedPath,
}: {
  navigationRequest: PortalNavigationRequest;
  overviewRef: ElementRef<HTMLElement>;
  readerPageRef: ElementRef<HTMLElement>;
  readerTitleRef: ElementRef<HTMLHeadingElement>;
  renderedDocumentPath: string | null | undefined;
  selectedPath: string | null;
}) {
  useEffect(() => {
    if (!navigationRequest.focusDestination && !navigationRequest.fragment) return;

    let cancelled = false;
    let frame = 0;
    let attempts = 0;
    const reachDestination = () => {
      if (cancelled) return;
      const fragmentReady = !selectedPath || renderedDocumentPath === selectedPath;
      let target: HTMLElement | null = null;
      if (navigationRequest.fragment && fragmentReady) {
        target = document.getElementById(
          decodePortalFragment(navigationRequest.fragment),
        );
      } else if (!navigationRequest.fragment) {
        target = selectedPath ? readerTitleRef.current : overviewRef.current;
      }
      if (!target && attempts < portalDestinationFrameLimit) {
        attempts += 1;
        frame = window.requestAnimationFrame(reachDestination);
        return;
      }

      const resolvedTarget = target
        ?? (selectedPath ? readerTitleRef.current : overviewRef.current);
      if (!resolvedTarget) return;
      if (selectedPath && !navigationRequest.fragment) {
        readerPageRef.current?.scrollIntoView({ block: "start" });
      } else {
        resolvedTarget.scrollIntoView({ block: "start" });
      }
      if (navigationRequest.focusDestination) {
        makeProgrammaticallyFocusable(resolvedTarget);
        resolvedTarget.focus({ preventScroll: true });
      }
    };
    frame = window.requestAnimationFrame(reachDestination);
    return () => {
      cancelled = true;
      window.cancelAnimationFrame(frame);
    };
  }, [
    navigationRequest,
    overviewRef,
    readerPageRef,
    readerTitleRef,
    renderedDocumentPath,
    selectedPath,
  ]);
}

function initialDocumentFragment(): string {
  if (typeof window === "undefined") return "";
  return decodePortalFragment(window.location.hash.slice(1));
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

function revealFocusedElement(
  scroller: HTMLElement | null,
  target: HTMLElement,
) {
  if (!scroller || !target.isConnected) return;
  const style = window.getComputedStyle(target);
  const outlineWidth = Number.parseFloat(style.outlineWidth) || 0;
  const outlineOffset = Math.max(Number.parseFloat(style.outlineOffset) || 0, 0);
  const clearance = outlineWidth + outlineOffset + 1;
  const scrollerRect = scroller.getBoundingClientRect();
  const targetRect = target.getBoundingClientRect();
  const topDelta = targetRect.top - clearance - scrollerRect.top;
  if (topDelta < 0) {
    scroller.scrollTop += topDelta;
    return;
  }
  const bottomDelta = targetRect.bottom + clearance - scrollerRect.bottom;
  if (bottomDelta > 0) scroller.scrollTop += bottomDelta;
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

type CorpusDrawerProps = {
  assetBasePath: string;
  documents: PortalDocumentMetadata[];
  group: LibraryGroup;
  normalizedQuery: string;
  onGroupChange: (group: LibraryGroup) => void;
  onNavigate: (path: string) => void;
  onQueryChange: (query: string) => void;
  query: string;
  selectedDocument: PortalDocumentMetadata;
};

function CorpusLibrary({
  assetBasePath,
  documents,
  group,
  libraryRef,
  normalizedQuery,
  onGroupChange,
  onNavigate,
  onQueryChange,
  query,
  searchRef,
  selectedDocument,
}: Omit<CorpusDrawerProps, "onNavigate"> & {
  libraryRef: ElementRef<HTMLElement>;
  onNavigate: (event: MouseEvent<HTMLAnchorElement>, path: string) => void;
  searchRef: ElementRef<HTMLInputElement>;
}) {
  return (
    <section
      aria-label="Document library"
      className="portal-library"
      ref={libraryRef}
    >
      <label htmlFor="portal-library-search">Find another document</label>
      <div className="portal-search-control">
        <span aria-hidden="true">⌕</span>
        <input
          aria-controls="portal-corpus-results"
          id="portal-library-search"
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="routing, memory, energy…"
          ref={searchRef}
          type="search"
          value={query}
        />
      </div>
      <div className="portal-filter-tabs" role="group" aria-label="Document group">
        {libraryGroups.map((candidate) => (
          <button
            type="button"
            key={candidate}
            aria-pressed={group === candidate}
            onClick={() => onGroupChange(candidate)}
          >{candidate}</button>
        ))}
      </div>
      <p className="portal-result-count" aria-live="polite">
        {documents.length} matching document{documents.length === 1 ? "" : "s"}
        {!documents.some((document) => document.path === selectedDocument.path) ? (
          <span className="portal-filter-context">
            Current document is outside this filter.
          </span>
        ) : null}
      </p>
      <nav
        className="portal-document-list"
        id="portal-corpus-results"
        aria-label="Research documents"
      >
        {documents.map((document) => (
          <a
            href={portalDocumentLocation(document.path, assetBasePath)}
            key={document.path}
            aria-current={document.path === selectedDocument.path ? "page" : undefined}
            onClick={(event) => onNavigate(event, document.path)}
            onFocus={(event) => {
              const target = event.currentTarget;
              window.requestAnimationFrame(() => {
                revealFocusedElement(libraryRef.current, target);
              });
            }}
          >
            <span>{document.title}</span>
            <small>
              {documentSequence(document.path, document.group)} · {formatNumber(document.words)} words
              {isSectionHeadingMatch(document, normalizedQuery)
                ? " · section heading match"
                : ""}
            </small>
          </a>
        ))}
        {documents.length === 0 ? (
          <p className="portal-empty-state">
            No matching title, file path or section heading.
          </p>
        ) : null}
      </nav>
    </section>
  );
}

function CorpusDrawer({
  assetBasePath,
  documents,
  group,
  normalizedQuery,
  onGroupChange,
  onNavigate,
  onQueryChange,
  query,
  selectedDocument,
}: CorpusDrawerProps) {
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const invokerRef = useRef<HTMLButtonElement>(null);
  const libraryRef = useRef<HTMLElement>(null);
  const restoreInvokerFocus = useRef(true);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!open || !dialog || dialog.open) return;
    dialog.showModal();
    const frame = window.requestAnimationFrame(() => searchRef.current?.focus());
    return () => window.cancelAnimationFrame(frame);
  }, [open]);

  const closeDrawer = (restoreFocus = true) => {
    restoreInvokerFocus.current = restoreFocus;
    const dialog = dialogRef.current;
    if (dialog?.open) dialog.close();
    else setOpen(false);
  };

  const navigateToDocument = (
    event: MouseEvent<HTMLAnchorElement>,
    path: string,
  ) => {
    if (!shouldHandleClientNavigation(event)) return;
    event.preventDefault();
    closeDrawer(false);
    onNavigate(path);
  };

  return (
    <>
      <button
        aria-controls="portal-corpus-drawer"
        aria-expanded={open}
        aria-haspopup="dialog"
        className="portal-reader-browse"
        id="portal-corpus-trigger"
        onClick={() => {
          restoreInvokerFocus.current = true;
          setOpen(true);
        }}
        ref={invokerRef}
        type="button"
      >Browse documents</button>
      <dialog
        aria-labelledby="portal-corpus-title"
        className="portal-corpus-drawer"
        id="portal-corpus-drawer"
        onCancel={() => { restoreInvokerFocus.current = true; }}
        onClose={() => {
          setOpen(false);
          if (!restoreInvokerFocus.current) {
            restoreInvokerFocus.current = true;
            return;
          }
          window.requestAnimationFrame(() => invokerRef.current?.focus());
        }}
        onKeyDown={(event) => {
          const search = searchRef.current;
          if (
            event.key !== "Escape"
            || event.target !== search
            || !search.value
          ) return;
          event.preventDefault();
          closeDrawer();
        }}
        ref={dialogRef}
      >
        <header className="portal-corpus-header">
          <div>
            <p>Research library</p>
            <h2 id="portal-corpus-title">Browse documents</h2>
          </div>
          <button type="button" onClick={() => closeDrawer()}>Close</button>
        </header>
        <p className="portal-corpus-current">
          <span>Currently reading</span>
          <strong>{selectedDocument.title}</strong>
          <code>{selectedDocument.path}</code>
        </p>
        <CorpusLibrary
          assetBasePath={assetBasePath}
          documents={documents}
          group={group}
          libraryRef={libraryRef}
          normalizedQuery={normalizedQuery}
          onGroupChange={onGroupChange}
          onNavigate={navigateToDocument}
          onQueryChange={onQueryChange}
          query={query}
          searchRef={searchRef}
          selectedDocument={selectedDocument}
        />
      </dialog>
    </>
  );
}

export function PublicResearchPortal({
  assetBasePath,
}: {
  assetBasePath: string;
}) {
  const [selectedPath, setSelectedPath] = useState<string | null>(() => initialDocumentPath(assetBasePath));
  const [navigationRequest, setNavigationRequest] = useState(() => ({
    focusDestination: false,
    fragment: initialPortalFragment(),
  }));
  const [documentState, setDocumentState] = useState<PortalDocumentState | null>(null);
  const [query, setQuery] = useState("");
  const [group, setGroup] = useState<LibraryGroup>("All");
  const [catalogLimit, setCatalogLimit] = useState(catalogPageSize);
  const [selectedFragment, setSelectedFragment] = useState(initialDocumentFragment);
  const deferredQuery = useDeferredValue(query.trim().toLowerCase());
  const overviewRef = useRef<HTMLElement>(null);
  const readerTitleRef = useRef<HTMLHeadingElement>(null);
  const readerPageRef = useRef<HTMLElement>(null);
  const mobileMenuRef = useRef<HTMLDetailsElement>(null);
  const mobileOutlineRef = useRef<HTMLDetailsElement>(null);
  const documentCache = useRef(new Map<string, ResearchDocument>());
  const evidenceCache = useRef(new Map<string, ResearchObjectEvidenceRecord[]>());

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
  const selectedEvidenceRecords = evidenceForSelection(documentState, selectedPath);
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
    const requestController = new AbortController();
    const pendingDocument = cachedOrLoad(
      documentCache.current,
      selectedPath,
      () => loadPortalDocument(
        selectedPath,
        assetBasePath,
        __PUBLICATION_SOURCE_REVISION__,
        requestController.signal,
      ),
    );
    const pendingEvidence = cachedOrLoad(
      evidenceCache.current,
      selectedPath,
      () => loadPortalEvidenceRecords(
        selectedPath,
        assetBasePath,
        __PUBLICATION_SOURCE_REVISION__,
        requestController.signal,
      ),
    );
    Promise.all([pendingDocument, pendingEvidence]).then(([document, evidenceRecords]) => {
      if (cancelled) return;
      documentCache.current.set(selectedPath, document);
      evidenceCache.current.set(selectedPath, evidenceRecords);
      setDocumentState({ path: selectedPath, document, evidenceRecords });
    }).catch((error: unknown) => {
      if (cancelled) return;
      const failure = error instanceof Error ? error : new Error("Document loading failed.");
      requestController.abort(failure);
      setDocumentState({
        path: selectedPath,
        error: failure.message,
      });
    });
    return () => {
      cancelled = true;
      requestController.abort(new Error(`Document selection changed: ${selectedPath}`));
    };
  }, [assetBasePath, selectedPath]);

  useEffect(() => {
    const handleHistory = () => {
      setSelectedPath(portalDocumentPathFromLocation(window.location, assetBasePath));
      setNavigationRequest({
        focusDestination: true,
        fragment: window.location.hash.slice(1),
      });
      setSelectedFragment(decodePortalFragment(window.location.hash.slice(1)));
    };
    window.addEventListener("popstate", handleHistory);
    window.addEventListener("hashchange", handleHistory);
    return () => {
      window.removeEventListener("popstate", handleHistory);
      window.removeEventListener("hashchange", handleHistory);
    };
  }, [assetBasePath]);

  usePortalDestination({
    navigationRequest,
    overviewRef,
    readerPageRef,
    readerTitleRef,
    renderedDocumentPath: selectedDocument?.path,
    selectedPath,
  });

  const selectDocument = (path: string, hash = "") => {
    if (!documentsByPath.has(path)) {
      window.open(
        repositoryDocumentHref(path, hash),
        "_blank",
        "noopener,noreferrer",
      );
      return;
    }
    setSelectedPath(path);
    setSelectedFragment(hash);
    window.history.pushState(
      { document: path },
      "",
      portalDocumentLocation(path, assetBasePath, hash),
    );
    setNavigationRequest({
      focusDestination: true,
      fragment: hash,
    });
  };

  const selectGroup = (candidate: LibraryGroup) => {
    setGroup(candidate);
    setCatalogLimit(catalogPageSize);
  };

  const showOverview = (hash = "") => {
    mobileMenuRef.current?.removeAttribute("open");
    setSelectedPath(null);
    setSelectedFragment("");
    window.history.pushState(
      { document: null },
      "",
      overviewLocation(assetBasePath, hash),
    );
    setNavigationRequest({
      focusDestination: true,
      fragment: hash,
    });
  };

  const selectHeading = (headingId: string) => {
    mobileOutlineRef.current?.removeAttribute("open");
    setSelectedFragment(headingId);
    const targetUrl = new URL(window.location.href);
    targetUrl.hash = headingId;
    window.history.pushState(
      { document: selectedPath, heading: headingId },
      "",
      `${targetUrl.pathname}${targetUrl.search}${targetUrl.hash}`,
    );
    setNavigationRequest({
      focusDestination: true,
      fragment: headingId,
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
          handleClientNavigation(event, () => showOverview());
        }}
      >
        <span aria-hidden="true">20W</span>
        <strong>20 Watts Was Enough</strong>
      </a>
      <nav aria-label="Primary navigation">
        <a
          href={portalDocumentLocation(defaultDocumentPath, assetBasePath)}
          onClick={(event) => {
            handleClientNavigation(
              event,
              () => selectDocument(defaultDocumentPath),
            );
          }}
        >Read</a>
        <a
          href={overviewLocation(assetBasePath, "research-system")}
          onClick={(event) => {
            handleClientNavigation(
              event,
              () => showOverview("research-system"),
            );
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
      <LanguageAccess basePath={assetBasePath} />
      <details className="portal-mobile-menu" ref={mobileMenuRef}>
        <summary>Menu</summary>
        <nav aria-label="Mobile navigation">
          <a
            href={portalDocumentLocation(defaultDocumentPath, assetBasePath)}
            onClick={(event) => {
              handleClientNavigation(
                event,
                () => selectDocument(defaultDocumentPath),
              );
            }}
          >Read the thesis</a>
          <a
            href={overviewLocation(assetBasePath, "research-system")}
            onClick={(event) => {
              handleClientNavigation(
                event,
                () => showOverview("research-system"),
              );
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
        href={selectedPath ? "#portal-reader-title" : "#portal-overview"}
        onClick={() => {
          const targetId = selectedPath ? "portal-reader-title" : "portal-overview";
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
            <div className="portal-reader-context">
              <a
                className="portal-reader-back"
                href={overviewLocation(assetBasePath, "library")}
                onClick={(event) => {
                  handleClientNavigation(event, () => showOverview("library"));
                }}
              >
                <span aria-hidden="true">←</span> Research overview
              </a>
              <CorpusDrawer
                assetBasePath={assetBasePath}
                documents={libraryDocuments}
                group={group}
                normalizedQuery={deferredQuery}
                onGroupChange={selectGroup}
                onNavigate={selectDocument}
                onQueryChange={(value) => {
                  setQuery(value);
                  setCatalogLimit(catalogPageSize);
                }}
                query={query}
                selectedDocument={selectedMetadata}
              />
            </div>
            <div className="portal-reader-toolbar-copy">
              <p>{selectedMetadata.group} · {formatNumber(selectedMetadata.words)} words</p>
              <h1 id="portal-reader-title" ref={readerTitleRef} tabIndex={-1}>
                {selectedMetadata.title}
              </h1>
            </div>
            <nav className="portal-reader-sequence" aria-label="Document sequence">
              {previousDocument ? (
                <a
                  href={portalDocumentLocation(previousDocument.path, assetBasePath)}
                  onClick={(event) => {
                    handleClientNavigation(
                      event,
                      () => selectDocument(previousDocument.path),
                    );
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
                    handleClientNavigation(
                      event,
                      () => selectDocument(nextDocument.path),
                    );
                  }}
                  rel="next"
                >Next →</a>
              ) : (
                <span aria-disabled="true">Next →</span>
              )}
            </nav>
            <nav aria-label="Document actions">
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
                        handleClientNavigation(event, () => selectHeading(heading.id));
                      }}
                    >{heading.title}</a>
                  ))}
                </nav>
              </details>
            ) : null}
            <div className="portal-reader-grid">
              <article
                className="portal-reader"
                id="portal-reader"
                aria-labelledby="portal-reader-title"
              >
                <ResearchObjectHeader
                  title={selectedMetadata.title}
                  path={selectedMetadata.path}
                  route={selectedMetadata.route}
                  group={selectedMetadata.group}
                  editionVersion={projectVersion}
                  sourceRevision={__PUBLICATION_SOURCE_REVISION__}
                  evidenceRecords={selectedEvidenceRecords}
                  assetBasePath={assetBasePath}
                  fragment={selectedFragment}
                  headingId="portal-reader-title"
                  words={selectedMetadata.words}
                />
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
                        onClick={(event) => {
                          handleClientNavigation(event, () => selectHeading(heading.id));
                        }}
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
                    handleClientNavigation(
                      event,
                      () => selectDocument(defaultDocumentPath),
                    );
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
                    handleClientNavigation(
                      event,
                      () => selectDocument(entry.document.path),
                    );
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
                              handleClientNavigation(
                                event,
                                () => selectDocument(document.path),
                              );
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
