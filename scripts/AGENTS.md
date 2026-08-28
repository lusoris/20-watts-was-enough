# Validator and generator rules

These instructions extend the root [`AGENTS.md`](../AGENTS.md).

- Validators fail closed with a non-zero exit code and actionable file-level
  diagnostics. Missing or malformed authority data is never silently skipped.
- Generation is deterministic for fixed inputs and has a non-mutating `--check`
  or equivalent freshness mode.
- Parse structured data with a real parser or schema validator; do not validate
  JSON, YAML, BibTeX, Markdown structure, or manifests with an ambiguous regex
  when a repository dependency already provides the grammar.
- Bound traversal, concurrency, retries, browser work, subprocesses, output,
  and temporary artifacts. Check every subprocess exit state.
- Use atomic replacement for authoritative generated files and preserve the
  previous artifact when generation fails.
- Never weaken a source-publication, licence, claim-authority, or receipt check
  merely to make an existing artifact pass. Repair the artifact or record a
  narrow reviewed exception.
- The P10-4 code-shape baseline is a debt ceiling, not an allowlist. Update it
  only after the measured findings decrease; never use `--write` to absorb a
  new or worse finding.
- Tests include at least one valid case and the important tamper, omission, and
  stale-output cases for each authority boundary.
