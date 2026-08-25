import type { Metadata } from "next";
import { ResearchReader } from "./components/research-reader";
import {
  documentPartsByPath,
  documentSummaries,
  documentsByPath,
} from "./content";

export const metadata: Metadata = {
  title: "20 Watts Was Enough — Research Edition",
  description:
    "A privately rendered research blueprint for sparse, grounded, continual, energy-efficient AI.",
};

type HomeProps = {
  searchParams?: Promise<{
    doc?: string | string[];
    part?: string | string[];
  }>;
};

function requestedPart(value: string | string[] | undefined, total: number): number {
  const literal = Array.isArray(value) ? value[0] : value;
  if (!literal || !/^\d+$/.test(literal)) return 0;
  const index = Number(literal) - 1;
  return Number.isSafeInteger(index) && index >= 0 && index < total ? index : 0;
}

export default async function Home({ searchParams }: HomeProps) {
  const parameters = await searchParams;
  const requested = parameters?.doc;
  const requestedPath = Array.isArray(requested) ? requested[0] : requested;
  const currentDocument =
    (requestedPath ? documentsByPath.get(requestedPath) : undefined)
    ?? documentsByPath.get("README.md")!;
  const parts = documentPartsByPath.get(currentDocument.path)!;
  const partIndex = requestedPart(parameters?.part, parts.length);
  const selectedPart = parts[partIndex];
  return (
    <ResearchReader
      documents={documentSummaries}
      currentDocument={{
        ...currentDocument,
        body: selectedPart.body,
        words: selectedPart.words,
      }}
      currentPart={{ index: partIndex, total: parts.length }}
    />
  );
}
