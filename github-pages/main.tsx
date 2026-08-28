import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "katex/dist/katex.min.css";
import "../app/globals.css";
import { PublicResearchPortal } from "../app/components/public-research-portal";
import {
  portalDocumentLocation,
  portalDocuments,
} from "../app/portal-content";

const container = document.getElementById("root");

if (!container) {
  throw new Error("GitHub Pages portal root is missing.");
}

const legacyBookHash = window.location.hash.startsWith("#book-")
  ? window.location.hash
  : "";

const legacyDocumentPath = new URLSearchParams(window.location.search).get("doc");
const legacyDocument = portalDocuments.find(
  (document) => document.path === legacyDocumentPath,
);

if (legacyBookHash) {
  window.location.replace(`${import.meta.env.BASE_URL}book/${legacyBookHash}`);
} else if (legacyDocument) {
  window.location.replace(portalDocumentLocation(
    legacyDocument.path,
    import.meta.env.BASE_URL,
    window.location.hash.slice(1),
  ));
} else {
  createRoot(container).render(
    <StrictMode>
      <PublicResearchPortal assetBasePath={import.meta.env.BASE_URL} />
    </StrictMode>,
  );
}
