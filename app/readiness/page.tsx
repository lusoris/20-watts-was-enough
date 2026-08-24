/* eslint-disable @next/next/no-html-link-for-pages -- Vinext's next/link
 * client runtime fails during RSC prefetch; plain anchors preserve navigation. */
import type { Metadata } from "next";
import { ReadinessOverview } from "../components/readiness-overview";

export const metadata: Metadata = {
  title: "Research Readiness — 20 Watts Was Enough",
  description:
    "Generated claim, protocol, smoke-harness, and workstation-execution status for the research programme.",
};

export default function ReadinessPage() {
  return (
    <main className="readiness-page">
      <nav className="readiness-page-nav" aria-label="Research readiness navigation">
        <a href="/">← Research library</a>
        <a href="/?doc=experiments%2Ftest-coverage.md">Full coverage report</a>
        <a href="/book">Printable book</a>
      </nav>
      <ReadinessOverview />
    </main>
  );
}
