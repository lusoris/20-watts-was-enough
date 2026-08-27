import type { ResearchDocument } from "./content";

const rawBookModules = import.meta.glob(
  [
    "../README.md",
    "../concept/**/*.md",
    "!../concept/README.md",
    "../math/**/*.md",
    "!../math/README.md",
    "../research/field-coverage.md",
  ],
  {
    eager: true,
    import: "default",
    query: "?raw",
  },
) as Record<string, string>;

function titleFrom(path: string, body: string): string {
  const heading = body.match(/^#\s+(.+)$/m)?.[1]?.trim();
  if (heading) return heading;

  return path
    .split("/")
    .at(-1)!
    .replace(/\.md$/i, "")
    .replace(/^\d+-/, "")
    .replaceAll("-", " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function groupFrom(path: string): string {
  if (path.startsWith("concept/")) return "Concept";
  if (path.startsWith("math/")) return "Mathematics";
  if (path.startsWith("research/")) return "Research";
  return "Project";
}

function sectionRank(path: string): number {
  if (path === "README.md") return 0;
  if (path.startsWith("concept/")) return 1;
  if (path.startsWith("math/")) return 2;
  return 3;
}

export const bookDocuments: ResearchDocument[] = Object.entries(rawBookModules)
  .map(([modulePath, body]) => {
    const path = modulePath.replace(/^\.\.\//, "");
    return {
      path,
      title: titleFrom(path, body),
      group: groupFrom(path),
      body,
      kind: "markdown" as const,
      words: body.trim().split(/\s+/).filter(Boolean).length,
    };
  })
  .sort((left, right) => {
    const sectionDelta = sectionRank(left.path) - sectionRank(right.path);
    return sectionDelta || left.path.localeCompare(right.path, undefined, {
      numeric: true,
    });
  });
