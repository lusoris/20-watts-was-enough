import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "katex/dist/katex.min.css";
import "../app/globals.css";
import { PublicResearchPortal } from "../app/components/public-research-portal";

const container = document.getElementById("root");

if (!container) {
  throw new Error("GitHub Pages portal root is missing.");
}

const legacyBookHash = window.location.hash.startsWith("#book-")
  ? window.location.hash
  : "";

if (legacyBookHash) {
  window.location.replace(`${import.meta.env.BASE_URL}book/${legacyBookHash}`);
} else {
  createRoot(container).render(
    <StrictMode>
      <PublicResearchPortal assetBasePath={import.meta.env.BASE_URL} />
    </StrictMode>,
  );
}
