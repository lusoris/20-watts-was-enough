import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "katex/dist/katex.min.css";
import "../app/globals.css";
import { BookEdition } from "../app/components/book-edition";
import { projectVersion } from "../app/project-metadata";

const container = document.getElementById("root");

if (!container) {
  throw new Error("GitHub Pages book root is missing.");
}

const parameters = new URLSearchParams(window.location.search);
const surface = parameters.get("pdf") === "1" ? "public-pdf" : "github-pages";
const sourceRef = surface === "public-pdf" ? parameters.get("ref") ?? "main" : "main";

createRoot(container).render(
  <StrictMode>
    <BookEdition
      surface={surface}
      assetBasePath={import.meta.env.BASE_URL}
      editionVersion={projectVersion}
      sourceRef={sourceRef}
    />
  </StrictMode>,
);
