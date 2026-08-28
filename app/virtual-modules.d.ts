declare module "virtual:portal-document-index" {
  const index: Array<{
    path: string;
    title: string;
    group: "Concept" | "Mathematics";
    kind: "markdown";
    words: number;
    searchText: string;
  }>;
  export default index;
}
