import type { Metadata } from "next";
import Link from "next/link";
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
        <Link href="/">← Research library</Link>
        <Link href="/?doc=experiments%2Ftest-coverage.md">Full coverage report</Link>
        <Link href="/book">Printable book</Link>
      </nav>
      <ReadinessOverview />
    </main>
  );
}
