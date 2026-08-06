"use client";

import { useCallback } from "react";
import { documents } from "../content";
import { MarkdownDocument } from "./markdown-document";

const bookDocuments = documents.filter(
  (document) =>
    document.kind === "markdown" &&
    (document.path === "README.md" ||
      (document.path.startsWith("concept/") &&
        document.path !== "concept/README.md")),
);

const bookDocumentPaths = new Set(bookDocuments.map((document) => document.path));
const canonicalSite = "https://twenty-watts-was-enough.lusoris.chatgpt.site";

function bookId(path: string) {
  return `book-${path.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
}

export function BookEdition() {
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
  }, []);

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
            <dd>{bookDocuments.length} canonical documents</dd>
          </div>
          <div>
            <dt>Length</dt>
            <dd>{totalWords.toLocaleString()} words</dd>
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
          {bookDocuments.map((document, index) => (
            <li key={document.path}>
              <a href={`#${bookId(document.path)}`}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{document.title}</strong>
                <code>{document.path}</code>
              </a>
            </li>
          ))}
        </ol>
      </section>

      {bookDocuments.map((document, index) => (
        <section
          className="book-document"
          id={bookId(document.path)}
          key={document.path}
        >
          <div className="book-document-meta">
            <span>Chapter {String(index + 1).padStart(2, "0")}</span>
            <code>{document.path}</code>
            <span>{document.words.toLocaleString()} words</span>
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
