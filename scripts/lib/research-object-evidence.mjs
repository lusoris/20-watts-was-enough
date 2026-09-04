import path from "node:path";

import GithubSlugger from "github-slugger";
import remarkParse from "remark-parse";
import { unified } from "unified";
import {
  readStableOpenedFileSync,
  withStableOpenedFileSync,
} from "./opened-file.mjs";

const markdownParser = unified().use(remarkParse);
const maximumRecordsPerDocument = 512;
const maximumAuthorityBytes = 16 * 1024 * 1024;
const maximumMarkdownAstDepth = 128;
const maximumMarkdownAstNodes = 131_072;
const kindOrder = Object.freeze({ claim: 0, principle: 1, audit: 2, experiment: 3 });

function walk(root, sourcePath, visitor) {
  const pending = [{ depth: 0, node: root }];
  const visited = new WeakSet();
  let scheduledNodes = 1;
  while (pending.length > 0) {
    const { depth, node } = pending.pop();
    if (!node || typeof node !== "object" || Array.isArray(node)) {
      throw new Error(`Research-object Markdown AST for ${sourcePath} has an invalid node`);
    }
    if (visited.has(node)) {
      throw new Error(
        `Research-object Markdown AST for ${sourcePath} has a repeated or cyclic node`,
      );
    }
    visited.add(node);
    visitor(node);
    if (!Array.isArray(node.children) || node.children.length === 0) continue;
    if (depth >= maximumMarkdownAstDepth) {
      throw new Error(
        `Research-object Markdown AST for ${sourcePath} exceeds the maximum depth of ${maximumMarkdownAstDepth}`,
      );
    }
    if (node.children.length > maximumMarkdownAstNodes - scheduledNodes) {
      throw new Error(
        `Research-object Markdown AST for ${sourcePath} exceeds the maximum of ${maximumMarkdownAstNodes} nodes`,
      );
    }
    scheduledNodes += node.children.length;
    for (let index = node.children.length - 1; index >= 0; index -= 1) {
      pending.push({ depth: depth + 1, node: node.children[index] });
    }
  }
}

function nodeText(node, sourcePath) {
  const values = [];
  walk(node, sourcePath, (descendant) => {
    if (typeof descendant.value === "string") values.push(descendant.value);
  });
  return values.join("");
}

function linksFromTree(tree, sourcePath, inheritedDefinitions = new Map()) {
  const definitions = new Map(inheritedDefinitions);
  walk(tree, sourcePath, (node) => {
    if (node?.type === "definition" && typeof node.identifier === "string") {
      definitions.set(node.identifier.toLowerCase(), node.url);
    }
  });
  const links = [];
  walk(tree, sourcePath, (node) => {
    let url;
    if (node?.type === "link") url = node.url;
    if (node?.type === "linkReference" && typeof node.identifier === "string") {
      url = definitions.get(node.identifier.toLowerCase());
    }
    if (typeof url === "string") links.push({ label: nodeText(node, sourcePath).trim(), url });
  });
  return links;
}

function decoded(value) {
  try {
    return decodeURIComponent(value);
  } catch {
    return null;
  }
}

function resolveMarkdownLink(currentPath, url) {
  if (
    typeof url !== "string"
    || url === ""
    || url.startsWith("#")
    || url.includes("?")
    || /^(?:[a-z][a-z+.-]*:|\/|\\)/iu.test(url)
  ) return null;
  const hashIndex = url.indexOf("#");
  const rawPath = hashIndex === -1 ? url : url.slice(0, hashIndex);
  const rawFragment = hashIndex === -1 ? "" : url.slice(hashIndex + 1);
  const decodedPath = decoded(rawPath);
  const fragment = decoded(rawFragment);
  if (!decodedPath || fragment === null || decodedPath.includes("\\")) return null;
  const sourcePath = path.posix.normalize(
    path.posix.join(path.posix.dirname(currentPath), decodedPath),
  );
  if (sourcePath === ".." || sourcePath.startsWith("../")) return null;
  return { sourcePath, fragment };
}

function assertRegularAuthorityFile(repositoryRoot, sourcePath) {
  const root = path.resolve(repositoryRoot);
  const absolute = path.resolve(root, ...sourcePath.split("/"));
  const relative = path.relative(root, absolute);
  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    throw new Error(`Research-object evidence route escapes the repository: ${sourcePath}`);
  }
  withStableOpenedFileSync(absolute, {
    containedBy: root,
    label: `research-object evidence target ${sourcePath}`,
    maximumBytes: maximumAuthorityBytes,
  }, () => undefined);
}

function authorityHeadingAnchors(repositoryRoot, sourcePath, cache) {
  if (cache.has(sourcePath)) return cache.get(sourcePath);
  const bytes = readStableOpenedFileSync(
    path.join(repositoryRoot, ...sourcePath.split("/")),
    {
      containedBy: repositoryRoot,
      label: `research-object evidence target ${sourcePath}`,
      maximumBytes: maximumAuthorityBytes,
    },
  );
  const tree = markdownParser.parse(bytes.toString("utf8"));
  const slugger = new GithubSlugger();
  const anchors = new Set();
  walk(tree, sourcePath, (node) => {
    if (node?.type === "heading") anchors.add(slugger.slug(nodeText(node, sourcePath)));
  });
  cache.set(sourcePath, anchors);
  return anchors;
}

function assertExistingEvidenceTarget(repositoryRoot, record, anchorCache) {
  if (!record.fragment) {
    assertRegularAuthorityFile(repositoryRoot, record.sourcePath);
    return;
  }
  const anchors = authorityHeadingAnchors(
    repositoryRoot,
    record.sourcePath,
    anchorCache,
  );
  if (!anchors.has(record.fragment)) {
    throw new Error(
      `Research-object evidence route has no exact target: ${record.sourcePath}#${record.fragment}`,
    );
  }
}

function compactRouteLabel(kind, sourcePath, fragment) {
  if (kind === "claim") return fragment.match(/^c-\d+/u)?.[0].toUpperCase() ?? fragment;
  if (kind === "principle") return fragment.match(/^p-\d+/u)?.[0].toUpperCase() ?? fragment;
  const basename = path.posix.basename(sourcePath, ".md");
  if (kind === "audit") return `Audit · ${basename}`;
  const sequence = basename.match(/^(\d+)-/u)?.[1];
  const family = sourcePath.startsWith("experiments/candidates/") ? "Candidate" : "Fixture";
  return sequence ? `${family} ${family === "Fixture" ? "F-" : ""}${sequence}` : `${family} · ${basename}`;
}

function evidenceRecord(repositoryRoot, currentPath, link) {
  const target = resolveMarkdownLink(currentPath, link.url);
  if (!target) return null;
  let kind;
  if (target.sourcePath === "research/claims.md" && /^c-\d+$/u.test(target.fragment)) {
    kind = "claim";
  } else if (
    target.sourcePath === "research/principle-registry.md"
    && /^p-\d+(?:--[a-z0-9-]+)?$/u.test(target.fragment)
  ) {
    kind = "principle";
  } else if (/^research\/audits\/[a-z0-9]+(?:-[a-z0-9]+)*\.md$/u.test(target.sourcePath)) {
    kind = "audit";
  } else if (
    /^experiments\/(?:candidates|fixtures)\/[a-z0-9]+(?:-[a-z0-9]+)*\.md$/u.test(target.sourcePath)
  ) {
    kind = "experiment";
  } else {
    return null;
  }
  return Object.freeze({
    kind,
    label: compactRouteLabel(kind, target.sourcePath, target.fragment),
    sourcePath: target.sourcePath,
    fragment: target.fragment,
  });
}

function directEvidenceRecords(repositoryRoot, document) {
  const tree = markdownParser.parse(document.body);
  return linksFromTree(tree, document.path).flatMap((link) => {
    const record = evidenceRecord(repositoryRoot, document.path, link);
    return record ? [record] : [];
  });
}

function claimBacklinks(repositoryRoot, documentPaths) {
  const claimsPath = "research/claims.md";
  const claims = readStableOpenedFileSync(path.join(repositoryRoot, claimsPath), {
    containedBy: repositoryRoot,
    label: "research-object claim ledger",
    maximumBytes: maximumAuthorityBytes,
  });
  const tree = markdownParser.parse(claims.toString("utf8"));
  const records = new Map([...documentPaths].map((documentPath) => [documentPath, []]));
  const definitions = new Map();
  walk(tree, claimsPath, (node) => {
    if (node?.type === "definition" && typeof node.identifier === "string") {
      definitions.set(node.identifier.toLowerCase(), node.url);
    }
  });
  let claimId = "";
  for (const node of tree.children) {
    if (node.type === "heading") {
      claimId = node.depth === 3 && /^C-\d+$/u.test(nodeText(node, claimsPath).trim())
        ? nodeText(node, claimsPath).trim()
        : "";
      continue;
    }
    if (!claimId || node.type !== "list") continue;
    for (const item of node.children ?? []) {
      if (!nodeText(item, claimsPath).trimStart().startsWith("Used by:")) continue;
      for (const link of linksFromTree(item, claimsPath, definitions)) {
        const target = resolveMarkdownLink(claimsPath, link.url);
        if (!target || !records.has(target.sourcePath)) continue;
        records.get(target.sourcePath).push(Object.freeze({
          kind: "claim",
          label: claimId,
          sourcePath: claimsPath,
          fragment: claimId.toLowerCase(),
        }));
      }
    }
  }
  return records;
}

function compareRecords(left, right) {
  const kindDelta = kindOrder[left.kind] - kindOrder[right.kind];
  if (kindDelta !== 0) return kindDelta;
  const leftIdentifier = left.label.match(/^(?:C-|P-|Candidate |Fixture F-)(\d+)$/u);
  const rightIdentifier = right.label.match(/^(?:C-|P-|Candidate |Fixture F-)(\d+)$/u);
  if (leftIdentifier && rightIdentifier) {
    const identifierDelta = Number(leftIdentifier[1]) - Number(rightIdentifier[1]);
    if (identifierDelta !== 0) return identifierDelta;
  }
  const leftKey = `${left.sourcePath}#${left.fragment}`;
  const rightKey = `${right.sourcePath}#${right.fragment}`;
  return leftKey < rightKey ? -1 : leftKey > rightKey ? 1 : 0;
}

/**
 * Project exact direct repository links into per-document evidence records.
 * No label, keyword, or status inference creates a relationship.
 */
export function researchObjectEvidenceByDocument(repositoryRoot, documents) {
  const documentPaths = new Set(documents.map((document) => document.path));
  const backlinks = claimBacklinks(repositoryRoot, documentPaths);
  const anchorCache = new Map();
  const result = new Map();
  for (const document of documents) {
    const unique = new Map();
    for (const record of [
      ...directEvidenceRecords(repositoryRoot, document),
      ...(backlinks.get(document.path) ?? []),
    ]) {
      assertExistingEvidenceTarget(repositoryRoot, record, anchorCache);
      unique.set(`${record.kind}\0${record.sourcePath}\0${record.fragment}`, record);
    }
    if (unique.size > maximumRecordsPerDocument) {
      throw new Error(
        `${document.path} has ${unique.size} exact evidence routes; maximum is ${maximumRecordsPerDocument}`,
      );
    }
    result.set(document.path, Object.freeze([...unique.values()].sort(compareRecords)));
  }
  return result;
}

export function attachResearchObjectEvidence(repositoryRoot, documents) {
  const evidenceByDocument = researchObjectEvidenceByDocument(repositoryRoot, documents);
  return documents.map((document) => ({
    ...document,
    evidenceRecords: evidenceByDocument.get(document.path) ?? Object.freeze([]),
  }));
}
