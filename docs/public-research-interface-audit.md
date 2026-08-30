# Public research interface audit

**Snapshot:** 2026-08-29 working tree. This is an interface benchmark and a
maintainer decision queue, not a publication policy or an accessibility
conformance claim. The controlling source and feedback rules remain in the
[publication workflow](publication-workflow.md) and Decisions
[0035](../decisions/0035-publish-only-reviewed-source-bound-translations.md)
and
[0036](../decisions/0036-use-one-source-to-publication-and-feedback-graph.md).

## Finding

The Pages reader already has the structure needed for serious research work:
bounded prose, source-level navigation, visible authority, a full book, search,
and routes from a document to its source and issue form. Replacing it with a
stock research-site generator would not repair an identified authority or
reproducibility defect.

The weaker surface is the overview. Its display type is deliberately large,
while some explanations and metadata are much smaller than the research prose.
That contrast is useful for orientation. It also creates the untested risk that
readers perceive a dashboard first and a research programme second. The next
layout change should therefore be chosen by a reader task, not by an assumed
“scientific” visual style.

For this audit, *research-grade* means that a reader can:

1. find the maintained source and its evidence status;
2. read the argument without an unnecessarily wide or dense text block;
3. move between the overview, one document, the book and an experiment;
4. report a problem against the exact source or artifact; and
5. distinguish a generated reading surface from its canonical authority.

This definition is operational. It does not claim that one typeface, colour
scheme or site generator makes research credible.

## Method and limits

The observations below come from the active screen rules in
[`app/globals.css`](../app/globals.css), the current Pages components, the
translation manifest, and a read-only GitHub repository query on the snapshot
date. The comparison uses current official documentation from W3C, Quarto,
Jupyter Book, GitHub, The Turing Way, Zenodo, Weblate and Hypothesis. Community
settings were read with `gh api repos/lusoris/20-watts-was-enough`; the deployed
site may lag this working-tree snapshot.

This pass did not run a comprehension study, contrast audit, assistive
technology matrix or complete cross-browser visual test. A CSS `ch` unit
approximates the advance width of the font's `0` glyph; it does not prove an
exact character count in every font. The pixel values below are source
declarations after the screen-reading overrides, not measurements of every
rendered viewport.

## Observation: the current local interface

| Surface | Current source contract | What it means |
| --- | --- | --- |
| Focused research document | `16.5px` body above the `620px` breakpoint and `16px` at or below it, `1.72` line-height, `75ch` container and `72ch` prose blocks | The maintained argument uses the full reading tier and a bounded measure. |
| Web book | `16px` base body, `1.72` line-height, `75ch` book column and `72ch` prose blocks | The book and focused reader use the same reading model rather than separate prose layouts. |
| Overview thesis | `17–21px`, `1.52` line-height and `68ch` maximum measure | The initial thesis is readable and subordinate to a `40–64px` display heading across the screen cascade. |
| Overview explanation | Explicit status, funnel, catalogue and card paragraphs use `13–15px` with `1.45–1.55` line-height; nearby labels and metrics use `11–14px`, sometimes with `1.35` or inherited line-height | Some text that explains research state competes with labels and compact dashboard density. Essential meaning should not depend on the smallest tier. |
| Navigation and metadata | Generally `11–13px`; mobile menus and outline links use at least `44px` control height | The compact tier is suitable for provenance and navigation, but it needs zoom, contrast and low-vision testing before being treated as settled. |
| Wide document layout | Above `1180px`: `290px` library, flexible document and `230px` outline; the outline disappears at `1180px` and below, and the reader becomes one column at `880px` and below | Source discovery and section navigation remain available without forcing three columns onto narrow screens. |
| Document actions | Source, report, full-book and PDF links sit beside the document title; the body names its canonical Markdown path | Feedback can retain the affected source identity instead of becoming detached commentary. |
| Translation | `translations/manifest.json` currently contains no reviewed documents; unavailable languages open a translation issue rather than machine output | The unreviewed automatic-translation path is closed, but German and every other non-English route still need a human language-and-domain review. |
| Community channels | GitHub Issues is enabled and Discussions is disabled | Actionable reports have a route. Open-ended questions currently have no repository-native forum. |

The `72ch` limit is a sensible default, not a compliance certificate. W3C
Technique C20 describes relative widths that let lines average 80 characters
or fewer and explicitly says techniques are examples rather than mandatory
implementations. The current relative measure and line spacing support that
goal, but a browser test still has to check reflow, resizing and zoom
([W3C C20](https://www.w3.org/WAI/WCAG22/Techniques/css/C20),
[WCAG 2.2 visual presentation](https://www.w3.org/WAI/WCAG22/Understanding/visual-presentation.html)).

## Observation: comparable GitHub-native structures

These projects are implementation benchmarks, not evidence that copying their
themes would improve comprehension here.

| Benchmark | Structure worth retaining | Translation for this repository |
| --- | --- | --- |
| Quarto websites and manuscripts | Hybrid navigation, local search, a reader mode, and per-page source, edit and issue actions; manuscripts connect an article to notebooks and code ([website navigation](https://quarto.org/docs/websites/website-navigation), [manuscript components](https://quarto.org/docs/manuscripts/components.html)) | Keep the current custom reader, catalogue and per-document actions. Treat experiment images, receipts and code as attached research objects rather than folding their contents into the article. |
| Jupyter Book 2 | An explicit table of contents controls page order, nesting and sidebar navigation; the authoring model also supports citations, equations and cross-references ([table-of-contents guide](https://jupyterbook.org/stable/authoring/table-of-contents/), [authoring guide](https://jupyterbook.org/stable/authoring/)) | Generate the portal catalogue and book order from the canonical source registry. Do not maintain a second hand-written site hierarchy. |
| The Turing Way and GitHub | A contribution handbook routes questions and ideas to Discussions, concrete work to Issues, and small reviewed changes to pull requests; `good first issue` marks bounded entry work ([Turing Way contribution guide](https://book.the-turing-way.org/community-handbook/contributing/), [GitHub channel guidance](https://docs.github.com/en/get-started/using-github/communicating-on-github)) | Keep the new [help map](how-to-help.md), typed issue forms and difficulty/context boundaries. If Discussions is enabled, convert accepted work into a bounded issue instead of treating the conversation as authority. |

The common pattern is not “use GitHub Pages and a left sidebar”. It is one
versioned source, generated navigation, visible provenance, a focused reading
surface and a short path back to reviewable work.

## Engineering translation: safe defaults

These defaults fit the existing architecture and do not require a maintainer
choice:

- Keep argument text at the reader scale: `16–16.5px`, at least the current
  line spacing, and a relative measure no wider than the present `72ch` prose
  blocks. This is a project default, not a universal minimum-font rule.
- Reserve `11–13px` for short labels, counts and provenance. Research status,
  failure conditions and contribution instructions belong in the explanatory
  tier, even when that makes a card taller.
- Preserve one document action group containing the canonical source, a typed
  report route, the full book and the downloadable artifact. Add another copy
  only when a responsive layout makes the primary group unreachable.
- Keep tables, equations, diagrams and code in bounded overflow regions rather
  than widening the surrounding prose.
- Generate catalogues, reading order, translation availability and issue
  targets from their maintained registries. A manually repeated list needs a
  freshness check or removal.
- Test keyboard order, focus visibility, 200% zoom, a
  [320 CSS-pixel viewport](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html),
  actual line length after font fallback, and contrast before calling the
  reading pass complete. A source declaration alone is not rendered evidence.
- Keep a low-context contribution route for readers who can identify a broken
  explanation but cannot review its scientific meaning. Their report should
  name where the argument was lost; a domain reviewer decides whether wording
  can change safely.

## Hypotheses to test

The layout questions are empirical enough to test but are not scientific
results.

1. A compact hybrid landing page will let experienced readers reach a document
   faster than the expanded dashboard without reducing a new reader's ability
   to state the project status. Reject this if either reader group loses the
   correct status or source path more often.
2. Moving essential overview explanations out of the `12–13px` tier will make
   the evidence funnel and `NO_RESULT` boundary easier to paraphrase. Reject
   this if a task-based reader check finds no improvement or the larger layout
   obscures the sequence.
3. A dedicated open-ended discussion channel will produce useful questions
   that typed issue forms currently suppress. Reject this if moderation cost,
   duplicate threads or conversion to actionable work overwhelms the useful
   questions.

A small moderated reader check should include technically curious non-experts
and people who already work with research software. Ask whether each reader can
state the current result status, find the maintained source, choose the correct
feedback route and locate a runnable experiment. Do not optimise a cosmetic
metric in place of those tasks.

## Maintainer decision queue

### 1. Landing page

- **Expanded dashboard:** retain the current hierarchy and rich overview. It
  gives new readers context but makes experienced readers traverse more visual
  material.
- **Manuscript first:** open on the concept or book. It is direct for experts
  but hides programme state and contribution routes from newcomers.
- **Compact hybrid — recommended:** show the thesis, current result status and
  direct routes to documents, experiments and help above the fold; keep the
  full evidence funnel and catalogue below. Adopt only after the reader check
  above, not from visual preference alone.

### 2. GitHub Discussions

- **Issues only:** one moderation surface and strong task structure, but broad
  questions are forced into an issue form.
- **Enable Discussions — recommended after setup:** use `Q&A`, `Ideas` and
  `Announcements`; require a code of conduct, moderation owner and a rule that
  accepted work moves to an issue. GitHub itself distinguishes open-ended
  conversation from actionable Issues.
- **External chat/forum:** easier informal conversation for an existing
  community, but it fragments search, identity and preservation. Do not add one
  without a community that already needs it.

Discussions is currently disabled. Enabling it is a remote repository change
and should follow the maintainer's explicit decision.

### 3. Digital object identifier (DOI) and archival deposit

- **Git tag and release only:** lowest overhead, but no repository-issued
  persistent research identifier.
- **Zenodo GitHub integration — recommended before the first externally citable
  snapshot:** archive release objects and expose the DOI beside the exact tag.
  Zenodo documents repository enablement, `CITATION.cff` metadata and release
  archiving ([Zenodo GitHub guide](https://help.zenodo.org/docs/github/)).
- **Manual or institutional deposit:** useful when an institution must curate
  the record, but creates a second release procedure that needs an identity and
  freshness check.

The repository already has `CITATION.cff`; its people, version, licence and
artifact metadata still need release-time review before deposit. A deposited
tagged research snapshot also needs the output disclosure required by the
[research-integrity baseline](../research/research-integrity-baseline.md):
contributors and roles, accountable approval, material support, competing
interests, material tools and the scope of human verification.

### 4. Inline annotation

- **Source-bound issue links only — recommended now:** one public moderation
  and authority path, at the cost of losing sentence-level discussion in the
  reading surface.
- **Hypothesis group or embed:** readers can annotate passages and group owners
  can moderate, but Open, Restricted and Private groups have different access
  rules ([group model](https://web.hypothes.is/help/annotating-with-groups/)).
  The service processes account and usage data, including transfer to the
  United States. Enabling it therefore triggers the baseline's recorded
  pre-start screen for personal data and rights; that screen must also cover
  accessibility, moderation and source-version handling
  ([Hypothesis privacy policy](https://web.hypothes.is/privacy/)).
- **Project-hosted annotation:** maximum control, but it creates an account,
  moderation, retention, security and migration system unrelated to the core
  research. Do not build it without evidence that issue links fail.

### 5. Translation authoring interface

Decision 0035 already settles the authority: reviewed, source-digest-bound Git
files are the only publishable translations. The remaining decision is how
translators reach that Git workflow.

- **Pull requests and typed issues — recommended now:** no additional service
  or permissions; the Git interface remains a barrier for some language
  reviewers.
- **Hosted Weblate through its GitHub App:** a translator-focused interface
  that can create translation branches and pull requests while Git remains
  upstream. It adds an external account, repository permission, service
  availability and data-processing boundary
  ([Weblate version-control integration](https://docs.weblate.org/en/latest/vcs.html)).
- **Self-hosted Weblate:** retains more operational control but adds upgrades,
  backups, authentication, monitoring and incident response.

Revisit this choice when at least one competent reviewer is blocked by the Git
workflow or recurring translation updates make manual coordination the dominant
cost. No interface may publish machine output without the language-and-domain
review already required by Decision 0035.

## Recommended sequence

1. Keep the current reader architecture and safe defaults.
2. Run the bounded reader tasks before choosing the landing-page variant.
3. Decide whether to enable Discussions and name its moderator before inviting
   broad questions.
4. Connect Zenodo only when a specific release is ready to become the first
   externally citable snapshot.
5. Keep source-bound issue feedback and Git-native translations until observed
   participation justifies another service boundary.
