"use client";

import { Fragment } from "react";
import { bookDocuments as documents } from "../book-content";
import type { ResearchDocument } from "../content";
import { isRepositoryArtifact, repositoryArtifactHref } from "../lib/repository-artifacts";
import { MarkdownDocument } from "./markdown-document";
import { ReadinessOverview } from "./readiness-overview";

const appendixPaths = ["research/field-coverage.md"];
const canonicalSite = "https://twenty-watts-was-enough.lusoris.chatgpt.site";
const canonicalRepository = "https://github.com/lusoris/20-watts-was-enough";

type BookEditionProps = {
  surface?: "owner-only-site" | "github-pages";
  assetBasePath?: string;
};

function joinBasePath(basePath: string, path: string) {
  const base = basePath.endsWith("/") ? basePath : `${basePath}/`;
  return `${base}${path.replace(/^\/+/, "")}`;
}

function repositoryDocumentHref(path: string, hash = "") {
  const encodedPath = path
    .replaceAll("\\", "/")
    .split("/")
    .filter(Boolean)
    .map(encodeURIComponent)
    .join("/");
  return `${canonicalRepository}/blob/main/${encodedPath}${hash ? `#${encodeURIComponent(hash)}` : ""}`;
}

function bookId(path: string) {
  return `book-${path.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
}

function documentNumber(
  path: string,
  conceptDocuments: ResearchDocument[],
  mathDocuments: ResearchDocument[],
  appendixDocuments: ResearchDocument[],
) {
  const appendixIndex = appendixDocuments.findIndex((document) => document.path === path);
  if (appendixIndex >= 0) return `A${appendixIndex + 1}`;
  const mathIndex = mathDocuments.findIndex((document) => document.path === path);
  if (mathIndex >= 0) return `M${String(mathIndex + 1).padStart(2, "0")}`;
  const conceptIndex = conceptDocuments.findIndex((document) => document.path === path);
  return String(conceptIndex + 1).padStart(2, "0");
}

function documentLabel(path: string) {
  if (appendixPaths.includes(path)) return "Appendix";
  if (path.startsWith("math/")) return "Mathematical note";
  return "Chapter";
}

export function BookEdition({
  surface = "owner-only-site",
  assetBasePath = "/",
}: BookEditionProps = {}) {
  const isGitHubPages = surface === "github-pages";
  const conceptDocuments = documents.filter(
    (document) =>
      document.kind === "markdown" &&
      (document.path === "README.md" ||
        (document.path.startsWith("concept/") &&
          document.path !== "concept/README.md")),
  );
  const appendixDocuments = appendixPaths
    .map((path) => documents.find((document) => document.path === path))
    .filter((document): document is ResearchDocument => document !== undefined);
  const mathDocuments = documents.filter(
    (document) =>
      document.kind === "markdown" &&
      document.path.startsWith("math/") &&
      document.path !== "math/README.md",
  );
  const bookDocuments = [
    ...conceptDocuments,
    ...mathDocuments,
    ...appendixDocuments,
  ];
  const bookDocumentPaths = new Set(
    bookDocuments.map((document) => document.path),
  );
  const totalWords = bookDocuments.reduce(
    (sum, document) => sum + document.words,
    0,
  );
  const navigate = (path: string, hash = "") => {
    if (isGitHubPages) {
      window.location.assign(repositoryDocumentHref(path, hash));
      return;
    }
    const url = new URL("/", window.location.origin);
    url.searchParams.set("doc", path);
    url.hash = hash;
    window.location.assign(url);
  };
  const bookHref = (path: string, hash: string) => {
    if (bookDocumentPaths.has(path)) {
      return path === "README.md" && hash ? `#${hash}` : `#${bookId(path)}`;
    }
    if (isRepositoryArtifact(path)) {
      return joinBasePath(assetBasePath, repositoryArtifactHref(path));
    }
    if (isGitHubPages) return repositoryDocumentHref(path, hash);
    const url = new URL("/", canonicalSite);
    url.searchParams.set("doc", path);
    url.hash = hash;
    return url.toString();
  };

  return (
    <main className="book-shell">
      <nav className="book-actions" aria-label="Book actions">
        <a href={isGitHubPages ? canonicalRepository : "/"}>
          {isGitHubPages ? "View source on GitHub" : "← Owner-only research site"}
        </a>
        <a
          className="book-download-primary"
          href={joinBasePath(
            assetBasePath,
            "downloads/20-watts-was-enough-full-concept-book.pdf",
          )}
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
              {conceptDocuments.length} concept documents + {mathDocuments.length} mathematical notes + {appendixDocuments.length} generated appendix
            </dd>
          </div>
          <div>
            <dt>Length</dt>
            <dd>{totalWords.toLocaleString("en-US")} words</dd>
          </div>
          <div>
            <dt>Source</dt>
            <dd>Generated from the public Git repository</dd>
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
          {[
            ["Concept", conceptDocuments],
            ["Mathematical notes", mathDocuments],
            ["Appendix", appendixDocuments],
          ].map(([label, sectionDocuments]) => (
            <Fragment key={label as string}>
              <li className="book-toc-section">{label as string}</li>
              {(sectionDocuments as ResearchDocument[]).map((document) => (
                <li key={document.path}>
                  <a href={`#${bookId(document.path)}`}>
                    <span>
                      {documentNumber(
                        document.path,
                        conceptDocuments,
                        mathDocuments,
                        appendixDocuments,
                      )}
                    </span>
                    <strong>{document.title}</strong>
                    <code>{document.path}</code>
                  </a>
                </li>
              ))}
            </Fragment>
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
        <ReadinessOverview
          mode="book"
          documentHref={isGitHubPages ? repositoryDocumentHref : undefined}
        />
      </section>

      {bookDocuments.map((document) => (
        <section
          className="book-document"
          id={bookId(document.path)}
          key={document.path}
        >
          <div className="book-document-meta">
            <span>
              {documentLabel(document.path)}{" "}
              {documentNumber(
                document.path,
                conceptDocuments,
                mathDocuments,
                appendixDocuments,
              )}
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
              assetBasePath={assetBasePath}
            />
          </article>
        </section>
      ))}
      <footer className="book-legal" aria-label="Legal information">
        <strong>Licences and notices</strong>
        <span>Source: github.com/lusoris/20-watts-was-enough</span>
        {[
          ["EUPL 1.2", "LICENSE"],
          ["CC BY-SA 4.0", "LICENSES/CC-BY-SA-4.0.txt"],
          ["Licensing scope", "LICENSING.md"],
          ["Third-party notices", "THIRD_PARTY_NOTICES.txt"],
        ].map(([label, legalPath]) => (
          <a
            href={
              isGitHubPages
                ? joinBasePath(assetBasePath, legalPath)
                : `${canonicalRepository}/blob/main/${legalPath}`
            }
            key={legalPath}
          >
            {label}
          </a>
        ))}
      </footer>
    </main>
  );
}
