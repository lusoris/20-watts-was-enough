import publicArtifacts from "../../github-pages/public-artifacts.json" with { type: "json" };

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

if (publicArtifacts.schema !== 1
    || !Array.isArray(publicArtifacts.artifacts)
    || publicArtifacts.artifacts.some((artifact) => typeof artifact !== "string")) {
  throw new Error("Public repository-artifact manifest has an unsupported shape.");
}

const PUBLIC_REPOSITORY_ARTIFACTS = new Set<string>(publicArtifacts.artifacts);

function canonicalRepositoryArtifactPath(path: string): string {
  const segments = path.replaceAll("\\", "/").split("/").filter(Boolean);
  if (segments.length === 0 || segments.some((segment) => segment === "." || segment === "..")) {
    throw new Error("Repository artifact path must stay within the repository.");
  }
  return segments.join("/");
}

export function isRepositoryArtifact(path: string): boolean {
  const lower = path.toLowerCase();
  return [...REPOSITORY_ARTIFACT_EXTENSIONS].some((extension) =>
    lower.endsWith(extension),
  );
}

export function isPublicRepositoryArtifact(path: string): boolean {
  return PUBLIC_REPOSITORY_ARTIFACTS.has(canonicalRepositoryArtifactPath(path));
}

export function repositoryArtifactHref(path: string): string {
  const segments = canonicalRepositoryArtifactPath(path).split("/");
  return `/repository-files/${segments.map(encodeURIComponent).join("/")}.txt`;
}
