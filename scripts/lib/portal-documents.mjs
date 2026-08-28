import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";

function markdownFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) return markdownFiles(entryPath);
    return entry.isFile() && entry.name.endsWith(".md") ? [entryPath] : [];
  });
}

function visibleMarkdown(value) {
  return value
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/<[^>]+>/g, " ")
    .replace(/[`*_~]/g, "")
    .replace(/^>\s?/gm, "")
    .replace(/\s+/g, " ")
    .trim();
}

function titleFromMarkdown(body, fallback) {
  const heading = body.match(/^#\s+(.+?)\s*#*\s*$/m)?.[1];
  return visibleMarkdown(heading ?? fallback);
}

function truncateDescription(value, maximum = 220) {
  if (value.length <= maximum) return value;
  const candidate = value.slice(0, maximum + 1);
  const boundary = candidate.lastIndexOf(" ");
  return `${candidate.slice(0, boundary > 120 ? boundary : maximum).trimEnd()}…`;
}

function descriptionFromMarkdown(body, title, group) {
  const withoutFences = body.replace(/^(?:```|~~~)[\s\S]*?^(?:```|~~~)\s*$/gm, "");
  const paragraphs = withoutFences.split(/\r?\n\s*\r?\n/);
  for (const paragraph of paragraphs) {
    const trimmed = paragraph.trim();
    if (
      !trimmed
      || /^#{1,6}\s/u.test(trimmed)
      || /^(?:[-*+]\s|\d+\.\s|\|)/u.test(trimmed)
      || /^\$\$/u.test(trimmed)
    ) continue;
    const visible = visibleMarkdown(trimmed);
    if (visible.length >= 45) return truncateDescription(visible);
  }
  return `${title} — a maintained ${group.toLowerCase()} note in the 20 Watts Was Enough research programme.`;
}

function routeFromPath(relativePath) {
  return `${relativePath.replace(/\.md$/u, "")}/`;
}

export function portalSourceDocuments(repositoryRoot) {
  const inputs = ["concept", "math"].flatMap((directory) => (
    markdownFiles(path.join(repositoryRoot, directory))
      .filter((file) => path.basename(file).toLowerCase() !== "readme.md")
  ));
  return inputs.map((file) => {
    const body = readFileSync(file, "utf8");
    const relativePath = path.relative(repositoryRoot, file).replaceAll("\\", "/");
    const fallbackTitle = path.basename(file, ".md")
      .replace(/^\d+-/u, "")
      .replaceAll("-", " ")
      .replace(/\b\w/g, (character) => character.toUpperCase());
    const title = titleFromMarkdown(body, fallbackTitle);
    const headings = [...body.matchAll(/^#{1,6}\s+(.+?)\s*#*\s*$/gm)]
      .map((match) => visibleMarkdown(match[1]))
      .filter(Boolean);
    const group = relativePath.startsWith("concept/") ? "Concept" : "Mathematics";
    return {
      path: relativePath,
      route: routeFromPath(relativePath),
      title,
      description: descriptionFromMarkdown(body, title, group),
      group,
      kind: "markdown",
      words: body.trim().split(/\s+/).filter(Boolean).length,
      searchText: [relativePath, title, ...headings].join("\n").toLowerCase(),
      body,
    };
  }).sort((left, right) => {
    const groupDelta = (left.group === "Concept" ? 0 : 1)
      - (right.group === "Concept" ? 0 : 1);
    return groupDelta || left.path.localeCompare(right.path, undefined, { numeric: true });
  });
}
