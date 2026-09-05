import type { ResearchDocument } from "./research-document";
import type { ResearchObjectEvidenceRecord } from "./research-object";
import {
  readBoundedResponseText,
  withResponseDeadline,
} from "./lib/bounded-response-text";
import { encodePortalFragment } from "./lib/portal-fragment.mjs";
import { publicationSourceRevisionQuery } from "./lib/publication-revision.mjs";
import { normalizeResearchObjectEvidenceRecords } from "./lib/research-object.mjs";
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
const maximumPortalDocumentBytes = 16 * 1024 * 1024;
const maximumPortalEvidenceBytes = 512 * 1024;
const maximumPortalResponseChunks = 16_384;
const maximumPortalResponseMilliseconds = 30_000;

type PortalTextAssetOptions = Readonly<{
  maximumBytes: number;
  path: string;
  requestLabel: "Document" | "Research-object record";
  signal?: AbortSignal;
}>;

function normalizedBasePath(basePath: string) {
  const candidate = basePath.startsWith("/") ? basePath : `/${basePath}`;
  const parsed = new URL(candidate, relativeBaseOrigin);
  if (parsed.origin !== relativeBaseOrigin || parsed.search || parsed.hash) {
    throw new Error(`Invalid portal base path: ${basePath}`);
  }
  return parsed.pathname.endsWith("/") ? parsed.pathname : `${parsed.pathname}/`;
}

function portalDocumentAssetLocation(
  path: string,
  assetBasePath: string,
  sourceRevision: string | null,
) {
  if (!portalDocumentPathPattern.test(path)) {
    throw new Error(`Invalid portal document path: ${path}`);
  }
  const encodedPath = path.split("/").map((segment) => encodeURIComponent(segment)).join("/");
  return `${normalizedBasePath(assetBasePath)}documents/${encodedPath}${publicationSourceRevisionQuery(sourceRevision)}`;
}

function portalEvidenceAssetLocation(
  path: string,
  assetBasePath: string,
  sourceRevision: string | null,
) {
  if (!portalDocumentPathPattern.test(path)) {
    throw new Error(`Invalid portal document path: ${path}`);
  }
  const encodedPath = path.split("/").map((segment) => encodeURIComponent(segment)).join("/");
  return `${normalizedBasePath(assetBasePath)}research-object-records/${encodedPath}.json${publicationSourceRevisionQuery(sourceRevision)}`;
}

async function loadPortalTextAsset(
  location: string,
  { maximumBytes, path, requestLabel, signal }: PortalTextAssetOptions,
) {
  return withResponseDeadline({
    label: `${requestLabel} request for ${path}`,
    maximumMilliseconds: maximumPortalResponseMilliseconds,
    signal,
  }, async (signal) => {
    const response = await fetch(location, { signal });
    if (!response.ok) {
      throw new Error(`${requestLabel} request failed (${response.status}): ${path}`);
    }
    const body = await readBoundedResponseText(response, {
      label: `${requestLabel} response for ${path}`,
      maximumBytes,
      maximumChunks: maximumPortalResponseChunks,
      signal,
    });
    return { body, response };
  });
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
  sourceRevision: string | null = null,
  signal?: AbortSignal,
): Promise<ResearchDocument> {
  const metadata = portalDocuments.find((document) => document.path === path);
  if (!metadata) throw new Error(`Unknown portal document: ${path}`);
  const { body, response } = await loadPortalTextAsset(portalDocumentAssetLocation(
    metadata.path,
    assetBasePath,
    sourceRevision,
  ), {
    maximumBytes: maximumPortalDocumentBytes,
    path,
    requestLabel: "Document",
    signal,
  });
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

export async function loadPortalEvidenceRecords(
  path: string,
  assetBasePath: string,
  sourceRevision: string | null = null,
  signal?: AbortSignal,
): Promise<ResearchObjectEvidenceRecord[]> {
  const metadata = portalDocuments.find((document) => document.path === path);
  if (!metadata) throw new Error(`Unknown portal document: ${path}`);
  const { body } = await loadPortalTextAsset(portalEvidenceAssetLocation(
    metadata.path,
    assetBasePath,
    sourceRevision,
  ), {
    maximumBytes: maximumPortalEvidenceBytes,
    path,
    requestLabel: "Research-object record",
    signal,
  });
  if (/^\s*(?:<!doctype\s+html|<html\b)/iu.test(body)) {
    throw new Error(`Research-object record request returned invalid content: ${path}`);
  }
  let records;
  try {
    records = JSON.parse(body);
  } catch {
    throw new Error(`Research-object record request returned invalid JSON: ${path}`);
  }
  try {
    return normalizeResearchObjectEvidenceRecords(records) as ResearchObjectEvidenceRecord[];
  } catch {
    throw new Error(`Research-object record request returned an invalid record shape: ${path}`);
  }
}
