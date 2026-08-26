import type { Metadata } from "next";
import { BookLoader } from "../components/book-loader";

export const metadata: Metadata = {
  title: "20 Watts Was Enough - Full Concept Book",
  description:
    "The complete concept chapters, mathematical notes, and field-coverage appendix as a print-ready book generated from canonical Git source.",
};

export default function BookPage() {
  return <BookLoader />;
}
