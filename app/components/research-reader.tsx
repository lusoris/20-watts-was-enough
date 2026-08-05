"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  documentGroups,
  documents,
  documentsByPath,
  type ResearchDocument,
} from "../content";
import { MarkdownDocument } from "./markdown-document";

const DEFAULT_DOCUMENT = "README.md";

function initialDocumentPath(): string {
  if (typeof window === "undefined") return DEFAULT_DOCUMENT;
  const requested = new URLSearchParams(window.location.search).get("doc");
  return requested && documentsByPath.has(requested) ? requested : DEFAULT_DOCUMENT;
}

function outlineFrom(body: string) {
  return [...body.matchAll(/^(#{2,3})\s+(.+)$/gm)].map((match) => ({
    depth: match[1].length,
    title: match[2].replace(/\[(.+?)\]\(.+?\)/g, "$1").replace(/[*_`]/g, ""),
    id: match[2]
      .toLowerCase()
      .replace(/[^\p{L}\p{N}\s-]/gu, "")
      .trim()
      .replace(/\s+/g, "-"),
  }));
}

function sourceLabel(document: ResearchDocument): string {
  if (document.path.startsWith("sources/")) return "Historical source capture";
  if (document.path.startsWith("experiments/"))
    return "Pre-implementation experiment contract";
  if (document.kind === "mermaid") return "Editable diagram source";
  if (document.kind === "bibtex") return "Machine-readable bibliography";
  return "Canonical research text";
}

export function ResearchReader() {
  const [currentPath, setCurrentPath] = useState(initialDocumentPath);
  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  const currentDocument =
    documentsByPath.get(currentPath) ?? documentsByPath.get(DEFAULT_DOCUMENT)!;
  const outline = useMemo(
    () => outlineFrom(currentDocument.body),
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
    const onPopState = () => setCurrentPath(initialDocumentPath());
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
        <div className="privacy-status">
          <span />
          Owner-only
        </div>
      </header>

      <aside className={`sidebar ${menuOpen ? "sidebar-open" : ""}`}>
        <div className="sidebar-intro">
          <span>Research edition</span>
          <p>Every page below is rendered directly from the Git-tracked source.</p>
        </div>
        <nav aria-label="Research documents">
          {documentGroups.map(({ group, documents: groupDocuments }) => {
            const visibleDocuments = groupDocuments.filter((document) =>
              visiblePaths.has(document.path),
            );
            if (visibleDocuments.length === 0) return null;
            return (
              <section className="nav-group" key={group}>
                <h2>{group}</h2>
                {visibleDocuments.map((document) => (
                  <button
                    type="button"
                    key={document.path}
                    className={document.path === currentDocument.path ? "active" : ""}
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
            <span>{currentDocument.words.toLocaleString()} words</span>
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
        </div>
      </main>

      <aside className="outline" aria-label="On this page">
        <h2>On this page</h2>
        {outline.length ? (
          <nav>
            {outline.slice(0, 24).map((heading, index) => (
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
          Live reload active locally
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
