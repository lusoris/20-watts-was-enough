# Decision 0035: publish only reviewed, source-bound translations

**Status:** accepted
**Date:** 2026-08-29
**Supersedes:** [0031](0031-provide-eu-language-access-without-translation-copies.md)

## Context

The public reader previously handed any selected EU language to Google
Translate. German output was reported as materially poor. The handoff avoided a
second project document store, but it still exposed unreviewed wording beside a
research publication and could distort qualifications, domain terminology,
evidence status and negation.

Language metadata is also operationally important for accessibility, search,
font selection and text-to-speech. W3C guidance therefore supports explicit
language declarations rather than an opaque cross-site handoff. Continuous
localisation systems such as Weblate can later provide a translator interface
while retaining pull-request review and Git as the upstream authority; adopting
an external service is not required to establish that authority now.

## Decision

English Markdown in `concept/` and `math/` remains canonical. A public
translation must:

1. mirror the canonical path under `translations/<language>/`;
2. record the SHA-256 digest of the exact canonical file translated;
3. record the SHA-256 digest of the exact translated file the reviewer accepted;
4. name at least one human reviewer competent in the language and affected
   research domain;
5. disclose machine translation or language-model assistance; and
6. pass the translation manifest gate before Pages publication.

The language control lists the EU languages, opens only registered reviewed
translations, and otherwise opens a focused GitHub issue. It does not send
readers to automatic translation or present machine output as project text.

## Consequences

- No German translation is claimed until a reviewer accepts one against an
  exact source version.
- A canonical edit or translated-file edit invalidates its recorded digest and
  forces re-review.
- Translation work, review and corrections use the same issues, pull requests,
  licences and disclosure rules as the rest of the repository.
- An optional Weblate deployment may be added later only as a Git-integrated
  authoring interface; it may not become a parallel authority.

## References

- [W3C, *Authoring HTML: Language declarations*](https://www.w3.org/TR/i18n-html-tech-lang/)
- [Weblate, *Continuous localisation*](https://docs.weblate.org/en/latest/admin/continuous.html)
