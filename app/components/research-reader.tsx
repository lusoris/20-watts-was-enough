"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  documentGroups,
  documents,
  documentsByPath,
  type ResearchDocument,
} from "../content";
import { outlineFromMarkdown } from "../lib/heading-outline";
import { MarkdownDocument } from "./markdown-document";

const DEFAULT_DOCUMENT = "README.md";

function requestedDocumentPath(): string {
  if (typeof window === "undefined") return DEFAULT_DOCUMENT;
  const requested = new URLSearchParams(window.location.search).get("doc");
  return requested && documentsByPath.has(requested) ? requested : DEFAULT_DOCUMENT;
}

function navigationSubgroup(document: ResearchDocument): string {
  if (document.group === "Research") {
    if (document.path === "research/audits/README.md") return "Audit index";
    const auditDate = document.path.match(/^research\/audits\/(\d{4}-\d{2}-\d{2})-/)?.[1];
    if (auditDate) return `Audits · ${auditDate}`;
    if (document.kind === "bibtex") return "Bibliography";
    return "Ledgers, maps & methods";
  }
  if (document.group === "Experiments") {
    if (document.path.startsWith("experiments/workstation/")) return "Workstation";
    if (document.path.startsWith("experiments/candidates/")) return "Candidates";
    if (document.path.startsWith("experiments/fixtures/")) return "Fixtures";
    return "Programme & readiness";
  }
  if (document.group === "Graphics") {
    if (document.path.startsWith("assets/diagrams/")) return "Diagrams";
    if (document.path.startsWith("assets/plots/")) return "Plots";
    return "Graphics index";
  }
  return "Documents";
}

function subgroupKey(group: string, subgroup: string): string {
  return `${group}::${subgroup}`;
}

function navigationSubgroups(groupDocuments: ResearchDocument[]) {
  const subgroups = new Map<string, ResearchDocument[]>();
  for (const document of groupDocuments) {
    const subgroup = navigationSubgroup(document);
    const entries = subgroups.get(subgroup) ?? [];
    entries.push(document);
    subgroups.set(subgroup, entries);
  }
  return [...subgroups].map(([subgroup, subgroupDocuments]) => ({
    subgroup,
    documents: subgroupDocuments,
  }));
}

function initialCollapsedGroups(activeDocument: ResearchDocument): Set<string> {
  return new Set(
    documentGroups
      .map(({ group }) => group)
      .filter((group) => group !== activeDocument.group),
  );
}

function initialCollapsedSubgroups(activeDocument: ResearchDocument): Set<string> {
  const activeKey = subgroupKey(
    activeDocument.group,
    navigationSubgroup(activeDocument),
  );
  return new Set(
    documentGroups.flatMap(({ group, documents: groupDocuments }) =>
      navigationSubgroups(groupDocuments)
        .filter(
          ({ subgroup, documents: subgroupDocuments }) =>
            subgroupDocuments.length >= 12 || subgroup.startsWith("Audits ·"),
        )
        .map(({ subgroup }) => subgroupKey(group, subgroup))
        .filter((key) => key !== activeKey),
    ),
  );
}

function sourceLabel(document: ResearchDocument): string {
  if (document.path.startsWith("sources/")) return "Historical source capture";
  if (document.path === "experiments/test-coverage.md") return "Generated readiness report";
  if (document.path.startsWith("experiments/workstation/")) return "Executable harness documentation";
  if (
    document.path.startsWith("experiments/candidates/") ||
    document.path.startsWith("experiments/fixtures/")
  )
    return "Pre-implementation experiment contract";
  if (document.path.startsWith("experiments/") && document.kind === "json")
    return "Machine-readable experiment data";
  if (document.path.startsWith("experiments/")) return "Experiment programme documentation";
  if (document.kind === "mermaid") return "Editable diagram source";
  if (document.kind === "bibtex") return "Machine-readable bibliography";
  return "Canonical research text";
}

export function ResearchReader({ initialPath = DEFAULT_DOCUMENT }: { initialPath?: string }) {
  const resolvedInitialPath = documentsByPath.has(initialPath)
    ? initialPath
    : DEFAULT_DOCUMENT;
  const initialDocument = documentsByPath.get(resolvedInitialPath)!;
  const [currentPath, setCurrentPath] = useState(resolvedInitialPath);
  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(
    () => initialCollapsedGroups(initialDocument),
  );
  const [collapsedSubgroups, setCollapsedSubgroups] = useState<Set<string>>(
    () => initialCollapsedSubgroups(initialDocument),
  );
  const searchRef = useRef<HTMLInputElement>(null);

  const currentDocument =
    documentsByPath.get(currentPath) ?? documentsByPath.get(DEFAULT_DOCUMENT)!;
  const currentIndex = documents.findIndex(
    (document) => document.path === currentDocument.path,
  );
  const previousDocument = currentIndex > 0 ? documents[currentIndex - 1] : null;
  const nextDocument =
    currentIndex >= 0 && currentIndex < documents.length - 1
      ? documents[currentIndex + 1]
      : null;
  const outline = useMemo(
    () => outlineFromMarkdown(currentDocument.body),
    [currentDocument.body],
  );

  const visiblePaths = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase();
    if (!needle) return new Set(documents.map((document) => document.path));
    return new Set(
      documents
        .filter((document) =>
          `${document.title}\n${document.path}\n${document.body}`
            .toLocaleLowerCase()
            .includes(needle),
        )
        .map((document) => document.path),
    );
  }, [query]);

  const navigate = useCallback((path: string, hash = "") => {
    const nextDocument = documentsByPath.get(path);
    if (!nextDocument) return;

    setCurrentPath(path);
    setMenuOpen(false);
    setCollapsedGroups((groups) => {
      if (!groups.has(nextDocument.group)) return groups;
      const nextGroups = new Set(groups);
      nextGroups.delete(nextDocument.group);
      return nextGroups;
    });
    setCollapsedSubgroups((subgroups) => {
      const key = subgroupKey(nextDocument.group, navigationSubgroup(nextDocument));
      if (!subgroups.has(key)) return subgroups;
      const nextSubgroups = new Set(subgroups);
      nextSubgroups.delete(key);
      return nextSubgroups;
    });
    const url = new URL(window.location.href);
    url.searchParams.set("doc", path);
    url.hash = hash;
    window.history.pushState({ path }, "", url);

    window.requestAnimationFrame(() => {
      if (hash) document.getElementById(hash)?.scrollIntoView();
      else document.querySelector(".reader-main")?.scrollTo({ top: 0 });
    });
  }, []);

  useEffect(() => {
    const onPopState = () => {
      const path = requestedDocumentPath();
      const requestedDocument = documentsByPath.get(path)!;
      setCurrentPath(path);
      setCollapsedGroups((groups) => {
        const nextGroups = new Set(groups);
        nextGroups.delete(requestedDocument.group);
        return nextGroups;
      });
      setCollapsedSubgroups((subgroups) => {
        const nextSubgroups = new Set(subgroups);
        nextSubgroups.delete(
          subgroupKey(requestedDocument.group, navigationSubgroup(requestedDocument)),
        );
        return nextSubgroups;
      });
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "/" && document.activeElement?.tagName !== "INPUT") {
        event.preventDefault();
        searchRef.current?.focus();
      }
      if (event.key === "Escape") {
        setQuery("");
        searchRef.current?.blur();
      }
    };
    window.addEventListener("popstate", onPopState);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("popstate", onPopState);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  return (
    <div className="research-shell">
      <header className="topbar">
        <button
          type="button"
          className="menu-button"
          aria-label="Toggle document navigation"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span />
          <span />
        </button>
        <button className="brand" type="button" onClick={() => navigate(DEFAULT_DOCUMENT)}>
          <span className="brand-mark">20W</span>
          <span>
            <strong>20 Watts Was Enough</strong>
            <small>Durable research concept</small>
          </span>
        </button>
        <label className="search">
          <span aria-hidden="true">⌕</span>
          <input
            ref={searchRef}
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search claims, mechanisms, equations…"
            aria-label="Search all research documents"
          />
          <kbd>/</kbd>
        </label>
        <div className="topbar-actions">
          <a className="readiness-link" href="/readiness">
            Readiness
          </a>
          <a
            className="book-download"
            href="/downloads/20-watts-was-enough-full-concept-book.pdf"
            download
          >
            PDF book
          </a>
          <div className="privacy-status">
            <span />
            Owner-only
          </div>
        </div>
      </header>

      <aside className={`sidebar ${menuOpen ? "sidebar-open" : ""}`}>
        <div className="sidebar-intro">
          <span>Canonical library</span>
          <p>{documents.length} versioned documents rendered from the private Git source.</p>
          <div className="library-actions" aria-label="Document-section display">
            <button
              type="button"
              onClick={() => {
                setCollapsedGroups(new Set());
                setCollapsedSubgroups(new Set());
              }}
            >
              Show all
            </button>
            <button
              type="button"
              onClick={() => {
                setCollapsedGroups(
                  new Set(
                    documentGroups
                      .map(({ group }) => group)
                      .filter((group) => group !== currentDocument.group),
                  ),
                );
                const activeKey = subgroupKey(
                  currentDocument.group,
                  navigationSubgroup(currentDocument),
                );
                setCollapsedSubgroups(
                  new Set(
                    documentGroups.flatMap(({ group, documents: groupDocuments }) =>
                      navigationSubgroups(groupDocuments)
                        .map(({ subgroup }) => subgroupKey(group, subgroup))
                        .filter((key) => key !== activeKey),
                    ),
                  ),
                );
              }}
            >
              Current section
            </button>
          </div>
        </div>
        <nav aria-label="Research documents">
          {documentGroups.map(({ group, documents: groupDocuments }) => {
            const visibleDocuments = groupDocuments.filter((document) =>
              visiblePaths.has(document.path),
            );
            if (visibleDocuments.length === 0) return null;
            const subgroups = navigationSubgroups(visibleDocuments);
            const groupOpen =
              Boolean(query.trim()) ||
              !collapsedGroups.has(group);
            return (
              <section className={`nav-group ${groupOpen ? "" : "collapsed"}`} key={group}>
                <button
                  type="button"
                  className="nav-group-toggle"
                  aria-expanded={groupOpen}
                  onClick={() =>
                    setCollapsedGroups((groups) => {
                      const nextGroups = new Set(groups);
                      if (groupOpen) nextGroups.add(group);
                      else nextGroups.delete(group);
                      return nextGroups;
                    })
                  }
                >
                  <span>{group}</span>
                  <small>{visibleDocuments.length}</small>
                  <i aria-hidden="true">⌄</i>
                </button>
                {groupOpen ? (
                  <div className="nav-group-items">
                    {subgroups.map(({ subgroup, documents: subgroupDocuments }) => {
                      const key = subgroupKey(group, subgroup);
                      const showSubgroup = subgroups.length > 1;
                      const subgroupOpen =
                        Boolean(query.trim()) || !collapsedSubgroups.has(key);
                      return (
                        <section
                          className={`nav-subgroup ${subgroupOpen ? "" : "collapsed"}`}
                          key={key}
                        >
                          {showSubgroup ? (
                            <button
                              type="button"
                              className="nav-subgroup-toggle"
                              aria-expanded={subgroupOpen}
                              onClick={() =>
                                setCollapsedSubgroups((current) => {
                                  const next = new Set(current);
                                  if (subgroupOpen) next.add(key);
                                  else next.delete(key);
                                  return next;
                                })
                              }
                            >
                              <span>{subgroup}</span>
                              <small>{subgroupDocuments.length}</small>
                              <i aria-hidden="true">⌄</i>
                            </button>
                          ) : null}
                          {subgroupOpen ? (
                            <div className="nav-subgroup-items">
                              {subgroupDocuments.map((document) => (
                                <button
                                  type="button"
                                  key={document.path}
                                  className={`nav-item ${document.path === currentDocument.path ? "active" : ""}`}
                                  onClick={() => navigate(document.path)}
                                  title={document.path}
                                >
                                  <span>{document.title}</span>
                                  {document.path.startsWith("concept/") &&
                                  /^concept\/\d+/.test(document.path) ? (
                                    <small>{document.path.match(/^concept\/(\d+)/)?.[1]}</small>
                                  ) : null}
                                </button>
                              ))}
                            </div>
                          ) : null}
                        </section>
                      );
                    })}
                  </div>
                ) : null}
              </section>
            );
          })}
          {visiblePaths.size === 0 ? (
            <p className="no-results">No document contains “{query}”.</p>
          ) : null}
        </nav>
      </aside>

      <main className="reader-main">
        <div className="document-wrap">
          <div className="document-meta">
            <span>{sourceLabel(currentDocument)}</span>
            <span>{currentDocument.words.toLocaleString("en-US")} words</span>
            <code>{currentDocument.path}</code>
          </div>
          {currentDocument.path.startsWith("sources/") &&
          currentDocument.path !== "sources/README.md" ? (
            <aside className="source-warning">
              <strong>Source material, not evidence.</strong>
              <span>
                This dated import is preserved verbatim for provenance. Validated claims live
                in the evidence ledger.
              </span>
            </aside>
          ) : null}
          <article className="prose">
            <MarkdownDocument
              body={currentDocument.body}
              currentPath={currentDocument.path}
              onNavigate={navigate}
            />
          </article>
          <nav className="document-pager" aria-label="Adjacent documents">
            {previousDocument ? (
              <button type="button" onClick={() => navigate(previousDocument.path)}>
                <small>Previous</small>
                <span>← {previousDocument.title}</span>
              </button>
            ) : (
              <span />
            )}
            {nextDocument ? (
              <button type="button" onClick={() => navigate(nextDocument.path)}>
                <small>Next</small>
                <span>{nextDocument.title} →</span>
              </button>
            ) : null}
          </nav>
        </div>
      </main>

      <aside className="outline" aria-label="On this page">
        <h2>On this page</h2>
        {outline.length ? (
          <nav>
            {outline.map((heading, index) => (
              <a
                key={`${heading.id}-${index}`}
                className={heading.depth === 3 ? "outline-child" : ""}
                href={`#${heading.id}`}
              >
                {heading.title}
              </a>
            ))}
          </nav>
        ) : (
          <p>No subsections.</p>
        )}
        <footer>
          <span className="live-dot" />
          Generated from canonical Git source
        </footer>
      </aside>

      {menuOpen ? (
        <button
          className="sidebar-scrim"
          aria-label="Close document navigation"
          onClick={() => setMenuOpen(false)}
        />
      ) : null}
    </div>
  );
}
