import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "katex/dist/katex.min.css";
import "../app/globals.css";
import { BookEdition } from "../app/components/book-edition";

const container = document.getElementById("root");

if (!container) {
  throw new Error("GitHub Pages book root is missing.");
}

createRoot(container).render(
  <StrictMode>
    <BookEdition
      surface="github-pages"
      assetBasePath={import.meta.env.BASE_URL}
    />
  </StrictMode>,
);
