declare module "virtual:portal-document-index" {
  export const portalMetrics: {
    schema: 1;
    principles: number;
    provenanceFiles: number;
  };
  const index: Array<{
    path: string;
    route: string;
    title: string;
    description: string;
    group: "Concept" | "Mathematics";
    kind: "markdown";
    words: number;
    searchText: string;
  }>;
  export default index;
}
