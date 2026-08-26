import { headingIdsFromMarkdown } from "./lib/heading-outline";

export type ResearchDocument = {
  path: string;
  title: string;
  group: string;
  body: string;
  kind: "markdown" | "mermaid" | "bibtex" | "json";
  words: number;
};

export type ResearchDocumentSummary = Omit<ResearchDocument, "body"> & {
  partCount: number;
  anchorParts: Record<string, number>;
};

export type ResearchDocumentPart = {
  body: string;
  words: number;
};

const rawModules = import.meta.glob(
  [
    "/README.md",
    "/CHANGELOG.md",
    "/CONTRIBUTING.md",
    "/concept/**/*.md",
    "/research/**/*.md",
    "/research/**/*.bib",
    "/experiments/**/*.md",
    "/experiments/**/*.json",
    "!/experiments/test-coverage.json",
    "!/experiments/test-readiness-summary.json",
    "/math/**/*.md",
    "/decisions/**/*.md",
    "/sources/**/*.md",
    "/assets/**/*.md",
    "/assets/diagrams/**/*.mmd",
    "/assets/plots/**/*.json",
  ],
  {
    eager: true,
    import: "default",
    query: "?raw",
  },
) as Record<string, string>;

const GROUP_ORDER = [
  "Project",
  "Concept",
  "Research",
  "Experiments",
  "Mathematics",
  "Decisions",
  "Graphics",
  "Source archive",
];

const PATH_PRIORITY: Record<string, number> = {
  "README.md": 0,
  "concept/README.md": 0,
  "research/claims.md": 0,
  "research/principle-registry.md": 1,
  "research/adoption-matrix.md": 2,
  "research/neuroscience-opportunity-map.md": 3,
  "research/comparative-biology.md": 4,
  "research/domain-inventory.md": 5,
  "research/source-crosswalk.md": 6,
  "research/open-questions.md": 7,
  "research/references.bib": 8,
  "experiments/README.md": 0,
  "experiments/test-coverage.md": 1,
  "experiments/workstation/README.md": 2,
  "experiments/candidates/README.md": 3,
  "experiments/fixtures/README.md": 4,
  "math/README.md": 0,
  "decisions/README.md": 0,
  "assets/README.md": 0,
  "sources/README.md": 0,
};

function titleFrom(path: string, body: string): string {
  const heading = body.match(/^#\s+(.+)$/m)?.[1]?.trim();
  if (heading) return heading;

  return path
    .split("/")
    .at(-1)!
    .replace(/\.(mmd|bib|md|json)$/i, "")
    .replace(/^\d+-/, "")
    .replaceAll("-", " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function groupFrom(path: string): string {
  if (path.startsWith("concept/")) return "Concept";
  if (path.startsWith("research/")) return "Research";
  if (path.startsWith("experiments/")) return "Experiments";
  if (path.startsWith("math/")) return "Mathematics";
  if (path.startsWith("decisions/")) return "Decisions";
  if (path.startsWith("assets/")) return "Graphics";
  if (path.startsWith("sources/")) return "Source archive";
  return "Project";
}

function kindFrom(path: string): ResearchDocument["kind"] {
  if (path.endsWith(".mmd")) return "mermaid";
  if (path.endsWith(".bib")) return "bibtex";
  if (path.endsWith(".json")) return "json";
  return "markdown";
}

function renderableBody(
  path: string,
  title: string,
  body: string,
  kind: ResearchDocument["kind"],
): string {
  if (kind === "mermaid") {
    return `# ${title}\n\n\`\`\`mermaid\n${body.trim()}\n\`\`\``;
  }
  if (kind === "bibtex") {
    return `# Bibliography\n\nThis is the canonical machine-readable reference ledger.\n\n\`\`\`bibtex\n${body.trim()}\n\`\`\``;
  }
  if (kind === "json") {
    const description = path.startsWith("assets/plots/")
      ? "This is the editable machine-readable source for generated graphics."
      : path.endsWith(".schema.json")
        ? "This is a checked-in machine-readable JSON Schema."
        : path.startsWith("experiments/")
          ? "This is a checked-in machine-readable experiment contract or artifact."
          : "This is a checked-in machine-readable research artifact.";
    return `# ${title}\n\n${description}\n\n\`\`\`json\n${body.trim()}\n\`\`\``;
  }
  return body;
}

const MAX_READER_PART_CHARACTERS = 85_000;

function wordCount(body: string): number {
  return body.trim().split(/\s+/).filter(Boolean).length;
}

function markdownSections(body: string): string[] {
  const boundaries = [0];
  let offset = 0;
  let fence: "```" | "~~~" | null = null;
  for (const line of body.match(/[^\n]*(?:\n|$)/g) ?? []) {
    const fenceMatch = line.match(/^\s*(```|~~~)/);
    if (fenceMatch) {
      const marker = fenceMatch[1] as "```" | "~~~";
      if (fence === marker) fence = null;
      else if (fence === null) fence = marker;
    } else if (fence === null && /^(?:##|###)\s+/.test(line) && offset > 0) {
      boundaries.push(offset);
    }
    offset += line.length;
  }
  boundaries.push(body.length);
  return boundaries
    .slice(0, -1)
    .map((start, index) => body.slice(start, boundaries[index + 1]))
    .filter(Boolean);
}

function packSections(sections: string[]): string[] {
  const parts: string[] = [];
  let current = "";
  for (const section of sections) {
    if (
      current.length > 0
      && current.length + section.length > MAX_READER_PART_CHARACTERS
    ) {
      parts.push(current);
      current = section;
    } else {
      current += section;
    }
  }
  if (current) parts.push(current);
  return parts;
}

function markdownParts(document: ResearchDocument): string[] {
  const packed = packSections(markdownSections(document.body));
  if (packed.length <= 1) return packed;
  return packed.map((part, index) => (
    index === 0
      ? part
      : `# ${document.title} — Part ${index + 1} of ${packed.length}\n\n`
        + `> Continued from the canonical \`${document.path}\` document.\n\n`
        + part.trimStart()
  ));
}

function bibtexParts(document: ResearchDocument): string[] {
  const opening = "```bibtex\n";
  const codeStart = document.body.indexOf(opening);
  const codeEnd = document.body.lastIndexOf("\n```");
  if (codeStart < 0 || codeEnd <= codeStart) return [document.body];
  const source = document.body.slice(codeStart + opening.length, codeEnd);
  const entries = source.split(/(?=^@)/m).filter((entry) => entry.trim());
  const packed = packSections(entries);
  if (packed.length <= 1) return [document.body];
  return packed.map((part, index) => (
    `# Bibliography — Part ${index + 1} of ${packed.length}\n\n`
    + "This is the canonical machine-readable reference ledger.\n\n"
    + `\`\`\`bibtex\n${part.trim()}\n\`\`\``
  ));
}

function paginateDocument(document: ResearchDocument): ResearchDocumentPart[] {
  if (document.body.length <= MAX_READER_PART_CHARACTERS) {
    return [{ body: document.body, words: document.words }];
  }
  const bodies = document.kind === "bibtex"
    ? bibtexParts(document)
    : document.kind === "markdown"
      ? markdownParts(document)
      : [document.body];
  return bodies.map((body) => ({ body, words: wordCount(body) }));
}

export const documents: ResearchDocument[] = Object.entries(rawModules)
  .map(([modulePath, rawBody]) => {
    const path = modulePath.replace(/^\//, "");
    const kind = kindFrom(path);
    const title = titleFrom(path, rawBody);
    const body = renderableBody(path, title, rawBody, kind);
    return {
      path,
      title,
      group: groupFrom(path),
      body,
      kind,
      words: rawBody.trim().split(/\s+/).filter(Boolean).length,
    };
  })
  .sort((left, right) => {
    const groupDelta =
      GROUP_ORDER.indexOf(left.group) - GROUP_ORDER.indexOf(right.group);
    if (groupDelta !== 0) return groupDelta;

    const leftPriority = PATH_PRIORITY[left.path] ?? 100;
    const rightPriority = PATH_PRIORITY[right.path] ?? 100;
    if (leftPriority !== rightPriority) return leftPriority - rightPriority;
    return left.path.localeCompare(right.path, undefined, { numeric: true });
  });

export const documentsByPath = new Map(
  documents.map((document) => [document.path, document]),
);

export const documentPartsByPath = new Map(
  documents.map((document) => [document.path, paginateDocument(document)]),
);

export const documentSummaries: ResearchDocumentSummary[] = documents.map(
  ({ path, title, group, kind, words }) => {
    const parts = documentPartsByPath.get(path)!;
    const anchorParts: Record<string, number> = {};
    if (parts.length > 1) {
      for (const [partIndex, part] of parts.entries()) {
        for (const anchor of headingIdsFromMarkdown(part.body)) {
          if (!Object.hasOwn(anchorParts, anchor)) anchorParts[anchor] = partIndex;
        }
      }
    }
    return { path, title, group, kind, words, partCount: parts.length, anchorParts };
  },
);

export const documentGroups = GROUP_ORDER.map((group) => ({
  group,
  documents: documents.filter((document) => document.group === group),
})).filter(({ documents: groupDocuments }) => groupDocuments.length > 0);
