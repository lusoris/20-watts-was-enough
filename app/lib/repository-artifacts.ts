const REPOSITORY_ARTIFACT_EXTENSIONS = new Set([
  ".csv",
  ".js",
  ".json",
  ".mjs",
  ".py",
  ".sh",
  ".toml",
  ".ts",
  ".tsx",
  ".tsv",
  ".yaml",
  ".yml",
]);

export function isRepositoryArtifact(path: string): boolean {
  const lower = path.toLowerCase();
  return [...REPOSITORY_ARTIFACT_EXTENSIONS].some((extension) =>
    lower.endsWith(extension),
  );
}

export function repositoryArtifactHref(path: string): string {
  const segments = path.replaceAll("\\", "/").split("/").filter(Boolean);
  if (segments.length === 0 || segments.some((segment) => segment === "." || segment === "..")) {
    throw new Error("Repository artifact path must stay within the repository.");
  }
  return `/repository-files/${segments.map(encodeURIComponent).join("/")}.txt`;
}
