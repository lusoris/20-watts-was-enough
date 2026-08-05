import type { Metadata } from "next";
import { ResearchReader } from "./components/research-reader";

export const metadata: Metadata = {
  title: "20 Watts Was Enough — Research Edition",
  description:
    "A privately rendered research blueprint for sparse, grounded, continual, energy-efficient AI.",
};

export default function Home() {
  return <ResearchReader />;
}
