export type ResearchDocument = {
  path: string;
  title: string;
  group: string;
  body: string;
  kind: "markdown" | "mermaid" | "bibtex";
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
    "/math/**/*.md",
    "/decisions/**/*.md",
    "/sources/**/*.md",
    "/assets/**/*.md",
    "/assets/diagrams/**/*.mmd",
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
    .replace(/\.(mmd|bib|md)$/i, "")
    .replace(/^\d+-/, "")
    .replaceAll("-", " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function groupFrom(path: string): string {
  if (path.startsWith("concept/")) return "Concept";
  if (path.startsWith("research/")) return "Research";
  if (path.startsWith("math/")) return "Mathematics";
  if (path.startsWith("decisions/")) return "Decisions";
  if (path.startsWith("assets/")) return "Graphics";
  if (path.startsWith("sources/")) return "Source archive";
  return "Project";
}

function kindFrom(path: string): ResearchDocument["kind"] {
  if (path.endsWith(".mmd")) return "mermaid";
  if (path.endsWith(".bib")) return "bibtex";
  return "markdown";
}

function renderableBody(
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
  return body;
}

export const documents: ResearchDocument[] = Object.entries(rawModules)
  .map(([modulePath, rawBody]) => {
    const path = modulePath.replace(/^\//, "");
    const kind = kindFrom(path);
    const title = titleFrom(path, rawBody);
    const body = renderableBody(title, rawBody, kind);
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

export const documentGroups = GROUP_ORDER.map((group) => ({
  group,
  documents: documents.filter((document) => document.group === group),
})).filter(({ documents: groupDocuments }) => groupDocuments.length > 0);
