# Go tooling rules

These instructions extend the repository-wide [`AGENTS.md`](../AGENTS.md) and
[`docs/principles.md`](../docs/principles.md).

## Scope and structure

- Go is the default language for portable repository tooling. Keep the
  user-facing command in `cmd/20w`; put validation, catalogue, generation, and
  release logic in narrowly named `internal/` packages.
- Prefer one coherent command with stable subcommands over a collection of
  one-file executables. A package owns one contract and exposes the smallest
  API needed by the command or another package.
- Start with the standard library. Add a dependency only when it removes more
  parser, protocol, or security risk than it adds to the module graph. Verify
  its current upstream documentation, licence, maintenance state, and exact
  version before adoption.
- Translate useful rules from another repository to the failure they prevent
  here. Do not import the Golusoris service framework or copy its Fx modules,
  service-specific exceptions, or complete lint configuration into this
  command.

## Deterministic and bounded behaviour

- Accept the repository root explicitly. Resolve it once, keep subsequent
  paths beneath it, and treat manifests, Markdown, JSON, generated metadata,
  and filesystem entries as untrusted input.
- Put finite limits on file count, file size, decoded records, traversal depth,
  concurrency, subprocess duration, captured output, and retries wherever the
  boundary exists. Reject an exceeded limit; do not truncate an authority
  input and continue.
- Sort filesystem-derived collections before validation or output. Fixed input
  and build identity must produce byte-stable machine output where the format
  permits it.
- Reject symlinks, trailing data, duplicate identities, unknown authority
  fields, and paths outside the declared root at the boundary that consumes
  them. Do not rely on a later package to repair ambiguous input.
- Repository validators do not use the network by default. A command that
  needs remote state must have an explicit timeout, cancellation path, and
  output contract, and must keep remote observations separate from Git
  authority.
- Avoid shell and PowerShell orchestration in portable tooling. If a subprocess
  is unavoidable, invoke it directly with `exec.CommandContext`, a bounded
  environment and output buffer, and a checked exit status.

## Command contract

- Use exit code `0` for a completed successful command, `1` for a validation or
  operational failure, and `2` for invalid command-line use.
- Human output goes to standard output on success and standard error for
  warnings or failures. Machine output uses an explicit flag and a documented,
  versionable schema; never mix progress prose into JSON.
- Build identity includes the release version, source revision, Go version,
  target operating system, and target architecture. It identifies software;
  it does not confer experiment or scientific authority.
- Errors name the operation and affected path or artifact without exposing
  secrets. Preserve wrapped causes for programmatic checks.

## Tests and release evidence

- Tests use isolated temporary roots and cover success, malformed input,
  boundary exhaustion, path escape, symlink, duplicate, trailing-data, and
  deterministic-order cases where applicable.
- Run the focused package tests during development, then `go test -race ./...`
  from `tooling/`. Formatting and static analysis must be clean without blanket
  suppressions.
- Keep `CGO_ENABLED=0` for release binaries unless a reviewed capability proves
  that native linkage is required. Publish only operating-system and
  architecture combinations exercised by the release gate.
- Native `20w` archives are optional parallel tooling; they do not replace the
  per-experiment OCI artifact required for a released experiment. A Go-native
  experiment runner uses a static binary in a minimal `scratch` or equivalent
  runtime image unless its declared boundary requires more.
- A released `20w` binary may validate, generate, catalogue, or launch bounded
  development paths. It must not relabel a smoke, construction, or development
  run as a scientific result.
