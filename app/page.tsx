import type { Metadata } from "next";
import { ResearchReader } from "./components/research-reader";
import { documents } from "./content";

export const metadata: Metadata = {
  title: "20 Watts Was Enough — Research Edition",
  description:
    "A privately rendered research blueprint for sparse, grounded, continual, energy-efficient AI.",
};

type HomeProps = {
  searchParams?: Promise<{ doc?: string | string[] }>;
};

export default async function Home({ searchParams }: HomeProps) {
  const parameters = await searchParams;
  const requested = parameters?.doc;
  const initialPath = Array.isArray(requested) ? requested[0] : requested;
  return <ResearchReader documents={documents} initialPath={initialPath} />;
}
