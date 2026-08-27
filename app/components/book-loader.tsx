"use client";

import {
  Component,
  lazy,
  Suspense,
  useSyncExternalStore,
  type ReactNode,
} from "react";

const BookEdition = lazy(() =>
  import("./book-edition").then((module) => ({ default: module.BookEdition })),
);

const subscribeToBrowser = () => () => undefined;

function BookLoading({ failed = false }: { failed?: boolean }) {
  return (
    <main className="book-shell" aria-busy="true" aria-live="polite">
      <nav className="book-actions" aria-label="Book actions">
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        <a href="/">← Owner-only research site</a>
        <a
          className="book-download-primary"
          href="/downloads/20-watts-was-enough-full-concept-book.pdf"
          download
        >
          Download PDF
        </a>
      </nav>

      <header className="book-cover">
        <span className="book-kicker">Durable research concept</span>
        <h1>20 Watts Was Enough</h1>
        <p className="book-subtitle">
          {failed
            ? "The browser edition could not be loaded. The full PDF remains available above."
            : "Preparing the complete browser edition. The full PDF is already available above."}
        </p>
        <div className="book-cover-rule" />
        {failed ? (
          <button type="button" onClick={() => window.location.reload()}>
            Retry browser edition
          </button>
        ) : null}
      </header>
    </main>
  );
}

class BookLoadBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    if (this.state.failed) return <BookLoading failed />;
    return this.props.children;
  }
}

export function BookLoader() {
  const browserReady = useSyncExternalStore(
    subscribeToBrowser,
    () => true,
    () => false,
  );

  if (!browserReady) return <BookLoading />;
  const surface = new URLSearchParams(window.location.search).get("pdf") === "1"
    ? "public-pdf"
    : "owner-only-site";

  return (
    <BookLoadBoundary>
      <Suspense fallback={<BookLoading />}>
        <BookEdition surface={surface} />
      </Suspense>
    </BookLoadBoundary>
  );
}
