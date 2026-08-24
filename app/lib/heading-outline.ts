import GithubSlugger from "github-slugger";

export type DocumentHeading = {
  depth: 2 | 3;
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
export function outlineFromMarkdown(body: string): DocumentHeading[] {
  const slugger = new GithubSlugger();
  const headings: DocumentHeading[] = [];
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
    if (depth === 2 || depth === 3) {
      headings.push({ depth, title, id });
    }
  }

  return headings;
}
