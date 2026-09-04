import type { ResearchDocument } from "./research-document";
import { encodePortalFragment } from "./lib/portal-fragment.mjs";
import documentIndex, { portalMetrics } from "virtual:portal-document-index";

export { decodePortalFragment } from "./lib/portal-fragment.mjs";

export type PortalDocumentMetadata = Omit<ResearchDocument, "body" | "group"> & {
  group: "Concept" | "Mathematics";
  route: string;
  description: string;
  searchText: string;
};

export const portalDocuments = documentIndex as PortalDocumentMetadata[];
export { portalMetrics };

const portalDocumentPathPattern = /^(?:concept|math)\/[a-z0-9]+(?:-[a-z0-9]+)*\.md$/u;
const relativeBaseOrigin = "https://portal.invalid";

function normalizedBasePath(basePath: string) {
  const candidate = basePath.startsWith("/") ? basePath : `/${basePath}`;
  const parsed = new URL(candidate, relativeBaseOrigin);
  if (parsed.origin !== relativeBaseOrigin || parsed.search || parsed.hash) {
    throw new Error(`Invalid portal base path: ${basePath}`);
  }
  return parsed.pathname.endsWith("/") ? parsed.pathname : `${parsed.pathname}/`;
}

function portalDocumentAssetLocation(path: string, assetBasePath: string) {
  if (!portalDocumentPathPattern.test(path)) {
    throw new Error(`Invalid portal document path: ${path}`);
  }
  const encodedPath = path.split("/").map((segment) => encodeURIComponent(segment)).join("/");
  return `${normalizedBasePath(assetBasePath)}documents/${encodedPath}`;
}

export function portalDocumentLocation(
  path: string,
  assetBasePath: string,
  hash = "",
) {
  const document = portalDocuments.find((candidate) => candidate.path === path);
  if (!document) throw new Error(`Unknown portal document: ${path}`);
  return `${normalizedBasePath(assetBasePath)}${document.route}${encodePortalFragment(hash)}`;
}

export function portalDocumentPathFromLocation(
  location: Pick<Location, "pathname" | "search">,
  assetBasePath: string,
) {
  const requested = new URLSearchParams(location.search).get("doc");
  if (requested && portalDocuments.some((document) => document.path === requested)) {
    return requested;
  }
  const base = normalizedBasePath(assetBasePath);
  if (!location.pathname.startsWith(base)) return null;
  const route = location.pathname.slice(base.length).replace(/^\/+/, "");
  return portalDocuments.find((document) => document.route === route)?.path ?? null;
}

export async function loadPortalDocument(
  path: string,
  assetBasePath: string,
): Promise<ResearchDocument> {
  const metadata = portalDocuments.find((document) => document.path === path);
  if (!metadata) throw new Error(`Unknown portal document: ${path}`);
  const response = await fetch(portalDocumentAssetLocation(metadata.path, assetBasePath));
  if (!response.ok) {
    throw new Error(`Document request failed (${response.status}): ${path}`);
  }
  const body = await response.text();
  const contentType = response.headers.get("content-type")?.toLowerCase() ?? "";
  if (
    contentType.includes("text/html")
    || /^\s*(?:<!doctype\s+html|<html\b)/i.test(body)
  ) {
    throw new Error(`Document request returned HTML instead of Markdown: ${path}`);
  }
  return {
    path: metadata.path,
    title: metadata.title,
    group: metadata.group,
    kind: metadata.kind,
    words: metadata.words,
    body,
  };
}
