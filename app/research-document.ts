export type ResearchDocument = {
  path: string;
  title: string;
  group: string;
  body: string;
  kind: "markdown" | "mermaid" | "bibtex" | "json";
  words: number;
};
