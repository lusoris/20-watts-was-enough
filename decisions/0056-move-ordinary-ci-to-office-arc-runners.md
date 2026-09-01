# Move ordinary CI to office ARC runners

## Context

The repository relied on GitHub-hosted `ubuntu-latest` runners for all Continuous Integration jobs, including scientific workflows, container builds, and standard linting. While convenient, this approach delegates execution to external compute for tasks that can be securely handled by the office network's self-hosted infrastructure. 

The `arc-cauda-lusoris-20-watts` scale-set label is supplied by the Kubernetes repository and is equipped to handle ordinary Linux CI tasks without weakening security boundaries.

## Decision

We will use the office ARC runner (`arc-cauda-lusoris-20-watts`) for every ordinary Linux CI job.
Genuinely special runners will be preserved only where proven necessary by the engineering policy (e.g., `pull_request_target` workflows like `labeler.yml` for isolation, and the `verify-public-transport` boundary check after deployment). 

## Consequences

- **Efficiency**: The repository reduces reliance on GitHub-hosted compute, running jobs internally where power and compute are already allocated.
- **Security**: The `pull_request_target` labeler workflow and Cloudflare network boundary checks explicitly remain on GitHub-hosted runners, preserving untrusted-fork isolation and public transport verification.
- **Determinism**: The `validate-engineering-policy.mjs` test enforces the ARC runner boundary. Any deviation from the `arc-cauda-lusoris-20-watts` label for ordinary jobs now fails the build.
