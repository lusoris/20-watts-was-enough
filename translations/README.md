# Reviewed translations

English Markdown in `concept/` and `math/` remains the canonical research
source. A public translation is a reviewed derivative, not an independent
authority and not a machine-generated substitute for that source.

The language registry follows the European Union's official
[24-language list](https://european-union.europa.eu/principles-countries-history/languages_en),
checked on 2026-08-30. English remains the canonical source language.

Translated files mirror the canonical path under a language directory, for
example `translations/de/concept/00-thesis-and-principles.md`. An entry in
`manifest.json` must name:

- one of the official EU language codes exposed by the reader;
- the canonical and translated repository paths;
- the canonical public route and translated public route;
- the SHA-256 digest of the exact canonical file translated;
- the SHA-256 digest of the exact translated file the reviewer accepted; and
- at least one human reviewer who is competent in the target language and the
  affected research domain.

`npm run validate:translations` uses bounded, stable regular-file reads and
rejects ambiguous or open-ended manifest JSON, links, stale source or reviewed
target digests, path aliases and escapes, duplicate routes, missing reviewers
and missing files. A translation is not published merely because a machine
produced a draft.
Drafting tools must be disclosed in the pull request, and a reviewer remains
accountable for meaning, terminology, equations, qualifications and links.

Use the translation issue form before starting a large translation. It records
the target path and source version so concurrent work does not create a second
untracked document store.

## Candidate exchange

The Go command provides a provider-neutral hand-off before a translation enters
the reviewed tree. Export one exact English source into an ignored working
directory:

```bash
go -C tooling run ./cmd/20w translation export-candidate \
  --root .. \
  --source concept/00-thesis-and-principles.md \
  --language de \
  --output ../.workingdir2/cache/translation-candidates/de-thesis.json
```

The target code must come from the same shared
[`eu-languages.json`](eu-languages.json) registry used by the reader. The JSON
bundle contains the source path, bytes and SHA-256 digest; an empty target;
glossary entries; drafting-tool disclosure; and language/domain review
metadata. It has no provider field and makes no network request. A translator
or local tool may fill the target while preserving the closed schema. Set
`drafting.mode` to `human-only` or `machine-assisted`; the latter must identify
each material tool, version or dated service identity, and purpose. Glossary
entries are either `unresolved` with an empty target or `preferred` with the
wording a reviewer should check.

Import the returned bundle into a new candidate directory:

```bash
go -C tooling run ./cmd/20w translation import-candidate \
  --root .. \
  --input ../.workingdir2/cache/translation-candidates/de-thesis.json \
  --source concept/00-thesis-and-principles.md \
  --language de \
  --output ../.workingdir2/cache/translation-candidates/de-thesis-import
```

Import rejects ambiguous JSON, unknown fields, a changed source path or target
language, stale or altered English source, missing drafting disclosure,
malformed reviewer/glossary metadata, symlinks, oversized files and an existing
output. Repository-local output is allowed only under
`.workingdir2/cache/translation-candidates/`. The result is named
`candidate-not-for-publication.md` and its receipt says
`candidate-only-not-publication-authority`; neither command writes beneath the
public `translations/` tree or changes `manifest.json`.

The candidate boundary deliberately uses canonical path, embedded bytes and
SHA-256 rather than requiring a `.git` directory. This permits work from a
tagged source archive or release checkout. Import also requires the operator to
repeat the expected source path and language, then compares the bundle with the
current local source. The later pull request and reviewed manifest supply the
Git revision and publication authority; the digest alone does not claim that a
candidate came from `main`.

After a competent human has checked meaning, terminology, negation,
qualifications, equations, units, links and evidence status, copy the accepted
Markdown to its mirrored `translations/<language>/` path and add the separate
reviewed-manifest entry. That deliberate pull-request step remains the only
route from a candidate to publication.
