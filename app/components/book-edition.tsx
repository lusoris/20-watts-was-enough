"use client";

import { useCallback, useMemo } from "react";
import type { ResearchDocument } from "../content";
import { MarkdownDocument } from "./markdown-document";
import { ReadinessOverview } from "./readiness-overview";

const appendixPaths = ["research/field-coverage.md"];
const canonicalSite = "https://twenty-watts-was-enough.lusoris.chatgpt.site";

function bookId(path: string) {
  return `book-${path.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
}

function documentNumber(
  path: string,
  index: number,
  appendixDocuments: ResearchDocument[],
) {
  const appendixIndex = appendixDocuments.findIndex((document) => document.path === path);
  return appendixIndex >= 0
    ? `A${appendixIndex + 1}`
    : String(index + 1).padStart(2, "0");
}

export function BookEdition({ documents }: { documents: ResearchDocument[] }) {
  const conceptDocuments = useMemo(
    () =>
      documents.filter(
        (document) =>
          document.kind === "markdown" &&
          (document.path === "README.md" ||
            (document.path.startsWith("concept/") &&
              document.path !== "concept/README.md")),
      ),
    [documents],
  );
  const appendixDocuments = useMemo(
    () =>
      appendixPaths
        .map((path) => documents.find((document) => document.path === path))
        .filter((document): document is ResearchDocument => document !== undefined),
    [documents],
  );
  const bookDocuments = useMemo(
    () => [...conceptDocuments, ...appendixDocuments],
    [appendixDocuments, conceptDocuments],
  );
  const bookDocumentPaths = useMemo(
    () => new Set(bookDocuments.map((document) => document.path)),
    [bookDocuments],
  );
  const totalWords = bookDocuments.reduce(
    (sum, document) => sum + document.words,
    0,
  );
  const navigate = useCallback((path: string, hash = "") => {
    const url = new URL("/", window.location.origin);
    url.searchParams.set("doc", path);
    url.hash = hash;
    window.location.assign(url);
  }, []);
  const bookHref = useCallback((path: string, hash: string) => {
    if (bookDocumentPaths.has(path)) {
      return path === "README.md" && hash ? `#${hash}` : `#${bookId(path)}`;
    }
    const url = new URL("/", canonicalSite);
    url.searchParams.set("doc", path);
    url.hash = hash;
    return url.toString();
  }, [bookDocumentPaths]);

  return (
    <main className="book-shell">
      <nav className="book-actions" aria-label="Book actions">
        {/* The plain anchor keeps the standalone print route independent of
            the app router during deterministic headless rendering. */}
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        <a href="/">← Private research site</a>
        <a
          className="book-download-primary"
          href="/downloads/20-watts-was-enough-full-concept-book.pdf"
          download
        >
          Download PDF
        </a>
        <button type="button" onClick={() => window.print()}>
          Print this edition
        </button>
      </nav>

      <header className="book-cover">
        <span className="book-kicker">Durable research concept</span>
        <h1>20 Watts Was Enough</h1>
        <p className="book-subtitle">
          A biologically inspired R&amp;D blueprint for sparse, grounded,
          continual, energy-efficient AI.
        </p>
        <div className="book-cover-rule" />
        <dl>
          <div>
            <dt>Edition</dt>
            <dd>Full concept book</dd>
          </div>
          <div>
            <dt>Contents</dt>
            <dd>
              {conceptDocuments.length} canonical documents + {appendixDocuments.length} generated appendix
            </dd>
          </div>
          <div>
            <dt>Length</dt>
            <dd>{totalWords.toLocaleString("en-US")} words</dd>
          </div>
          <div>
            <dt>Source</dt>
            <dd>Generated from the private Git repository</dd>
          </div>
        </dl>
      </header>

      <section className="book-toc" aria-labelledby="book-toc-heading">
        <span className="book-kicker">Navigation</span>
        <h2 id="book-toc-heading">Contents</h2>
        <ol>
          <li>
            <a href="#book-research-readiness">
              <span>00</span>
              <strong>Research readiness</strong>
              <code>generated front matter</code>
            </a>
          </li>
          {bookDocuments.map((document, index) => (
            <li key={document.path}>
              <a href={`#${bookId(document.path)}`}>
                <span>{documentNumber(document.path, index, appendixDocuments)}</span>
                <strong>{document.title}</strong>
                <code>{document.path}</code>
              </a>
            </li>
          ))}
        </ol>
      </section>

      <section
        className="book-document book-readiness-frontmatter"
        id="book-research-readiness"
      >
        <div className="book-document-meta">
          <span>Generated front matter</span>
          <code>experiments/test-readiness-summary.json</code>
          <span>Current Git edition</span>
        </div>
        <ReadinessOverview mode="book" />
      </section>

      {bookDocuments.map((document, index) => (
        <section
          className="book-document"
          id={bookId(document.path)}
          key={document.path}
        >
          <div className="book-document-meta">
            <span>
              {appendixPaths.includes(document.path) ? "Appendix" : "Chapter"}{" "}
              {documentNumber(document.path, index, appendixDocuments)}
            </span>
            <code>{document.path}</code>
            <span>{document.words.toLocaleString("en-US")} words</span>
          </div>
          <article className="prose book-prose">
            <MarkdownDocument
              body={document.body}
              currentPath={document.path}
              onNavigate={navigate}
              internalHref={bookHref}
              imageLoading="eager"
            />
          </article>
        </section>
      ))}
    </main>
  );
}
