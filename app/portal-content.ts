import type { ResearchDocument } from "./content";
import documentIndex from "virtual:portal-document-index";

export type PortalDocumentMetadata = Omit<ResearchDocument, "body"> & {
  searchText: string;
};

export const portalDocuments = documentIndex as PortalDocumentMetadata[];

function withBase(basePath: string, path: string) {
  const base = basePath.endsWith("/") ? basePath : `${basePath}/`;
  return `${base}${path.replace(/^\/+/, "")}`;
}

export async function loadPortalDocument(
  path: string,
  assetBasePath: string,
): Promise<ResearchDocument> {
  const metadata = portalDocuments.find((document) => document.path === path);
  if (!metadata) throw new Error(`Unknown portal document: ${path}`);
  const response = await fetch(withBase(assetBasePath, `documents/${path}`));
  if (!response.ok) {
    throw new Error(`Document request failed (${response.status}): ${path}`);
  }
  return {
    path: metadata.path,
    title: metadata.title,
    group: metadata.group,
    kind: metadata.kind,
    words: metadata.words,
    body: await response.text(),
  };
}
