export type ResearchObjectEvidenceKind = "claim" | "principle" | "audit" | "experiment";

export type ResearchObjectEvidenceRecord = {
  kind: ResearchObjectEvidenceKind;
  label: string;
  sourcePath: string;
  fragment: string;
};

export type ResearchObjectEvidenceRoute = ResearchObjectEvidenceRecord & {
  href: string;
};
