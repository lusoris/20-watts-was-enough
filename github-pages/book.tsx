import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "katex/dist/katex.min.css";
import "../app/globals.css";
import { BookEdition } from "../app/components/book-edition";
import { bookSurfaceFromLocation } from "../app/lib/book-release-identity.mjs";
import { normalizePublicationSourceRevision } from "../app/lib/publication-revision.mjs";
import { projectVersion } from "../app/project-metadata";

const container = document.getElementById("root");

if (!container) {
  throw new Error("GitHub Pages book root is missing.");
}

const parameters = new URLSearchParams(window.location.search);
const surface = bookSurfaceFromLocation(window.location);
const sourceRef = surface === "public-pdf" ? parameters.get("ref") ?? "main" : "main";
const sourceRevision = surface === "public-pdf"
  ? normalizePublicationSourceRevision(parameters.get("revision"))
  : __PUBLICATION_SOURCE_REVISION__;

createRoot(container).render(
  <StrictMode>
    <BookEdition
      surface={surface}
      assetBasePath={import.meta.env.BASE_URL}
      editionVersion={projectVersion}
      sourceRef={sourceRef}
      sourceRevision={sourceRevision}
    />
  </StrictMode>,
);
