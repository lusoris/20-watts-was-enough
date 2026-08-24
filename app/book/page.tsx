import type { Metadata } from "next";
import { BookEdition } from "../components/book-edition";
import { documents } from "../content";

export const metadata: Metadata = {
  title: "20 Watts Was Enough - Full Concept Book",
  description:
    "The complete concept chapters as a print-ready book generated from canonical Git source.",
};

export default function BookPage() {
  return <BookEdition documents={documents} />;
}
