# Reviewed translations

English Markdown in `concept/` and `math/` remains the canonical research
source. A public translation is a reviewed derivative, not an independent
authority and not a machine-generated substitute for that source.

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
