# 0024 — Publish through split-licensed Git and two reading surfaces

- **Status:** accepted
- **Date:** 2026-08-27

## Context

Git was already the canonical source, while the interactive research reader
was intentionally owner-only. The project now needs an openly inspectable
source history and a public reading edition that can be shared without granting
access to the primary hosted application. The repository also contains several
different copyright classes: executable infrastructure, original research and
graphics, and preserved third-party source material.

Repository visibility, npm publication, hosted-reader access, and copyright
permission are separate controls. Making GitHub public does not license the
work; setting `package.json` to `private` prevents accidental npm publication
but does not make GitHub private; publishing a static book does not require the
interactive reader to become public.

## Decision

1. Keep the public GitHub `main` branch as the canonical source and history.
2. Keep the interactive research reader owner-only. It can expose the complete
   searchable research and execution corpus to the owner without becoming the
   public sharing boundary.
3. Publish a second, static full-book edition through GitHub Pages. Build it
   from the same committed source with a project-relative base path; include
   the downloadable PDF, plots and inert linked repository artifacts; and do
   not depend on a server, Worker, or copied prose store.
4. License project-authored technical material under `EUPL-1.2`, with the
   Article 5 later-version option stated in prose, and original project prose,
   mathematics, diagrams, plots and presentation under `CC-BY-SA-4.0`.
5. Exclude `sources/`, official taxonomy snapshots and all other third-party
   material from that grant unless an explicit file-level notice says
   otherwise. Citation, linking, bibliography inclusion and lawful quotation
   do not relicense an underlying work.
6. Deploy both reading surfaces only from a tested commit already pushed to
   canonical `main`. Do not synchronize prose through Google Docs.

## Consequences

- Readers can inspect and fork the source or share the public book without
  access to the owner-only application.
- Commercial use remains permitted under the applicable open licence, while
  reciprocal or ShareAlike duties apply to covered modifications.
- The Pages workflow must validate its subpath-prefixed assets, PDF, plots,
  inert repository downloads and absence of server-only output.
- The root licence cannot grant rights in imported papers, captures, official
  data or other material the contributors do not own.
- `package.json` remains `private: true` as a publication safety control even
  though the GitHub repository is public.

## Supersession

Supersede this record if the canonical source moves, the public edition gains a
server-side trust boundary, the primary reader changes access class, or the
licensing allocation changes. Ordinary host, styling or workflow-version
updates do not require a new decision.
