import GithubSlugger from "github-slugger";

export type DocumentHeading = {
  depth: 2 | 3;
  title: string;
  id: string;
};

type ParsedHeading = {
  depth: number;
  title: string;
  id: string;
};

function visibleHeadingText(source: string): string {
  return source
    .replace(/\s+#+\s*$/, "")
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/<[^>]+>/g, "")
    .replace(/[*_~`]/g, "")
    .trim();
}

// rehype-slug uses github-slugger as well. Processing every ATX heading keeps
// duplicate suffixes aligned even though the outline displays only h2/h3.
function parseMarkdownHeadings(body: string): ParsedHeading[] {
  const slugger = new GithubSlugger();
  const headings: ParsedHeading[] = [];
  let fence: "```" | "~~~" | null = null;

  for (const line of body.split(/\r?\n/)) {
    const fenceMatch = line.match(/^\s*(```|~~~)/);
    if (fenceMatch) {
      const marker = fenceMatch[1] as "```" | "~~~";
      if (fence === marker) fence = null;
      else if (fence === null) fence = marker;
      continue;
    }
    if (fence) continue;

    const match = line.match(/^(#{1,6})\s+(.+)$/);
    if (!match) continue;
    const depth = match[1].length;
    const title = visibleHeadingText(match[2]);
    const id = slugger.slug(title);
    headings.push({ depth, title, id });
  }

  return headings;
}

export function outlineFromMarkdown(body: string): DocumentHeading[] {
  return parseMarkdownHeadings(body)
    .filter((heading) => heading.depth === 2 || heading.depth === 3)
    .map(({ depth, title, id }) => ({
      depth: depth as 2 | 3,
      title,
      id,
    }));
}

export function headingIdsFromMarkdown(body: string): string[] {
  return parseMarkdownHeadings(body).map(({ id }) => id);
}
