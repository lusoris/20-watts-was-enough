# Public research interface implementation audit

**Snapshot:** deployed site and working tree on 2026-08-30. This is an
implementation and rendered-regression audit. It is not external research, an
accessibility-conformance claim, a reader-comprehension result or evidence for
the project's scientific hypotheses.

The external evidence and comparison authority is the
[Git-centred open research publication infrastructure
audit](../research/audits/2026-08-30-git-centred-open-research-publication-infrastructure.md).
This document records only what the prior and replacement Pages interfaces did
with that evidence.

The controlling source and feedback rules remain in the
[publication workflow](publication-workflow.md) and Decisions
[0035](../decisions/0035-publish-only-reviewed-source-bound-translations.md)
and
[0036](../decisions/0036-use-one-source-to-publication-and-feedback-graph.md).

## Finding

The deployed landing page looks like an operations dashboard wrapped around a
research library. Its large dark first screen, seven accent colours, boxed
metrics, dense six-column funnel and red `NO_RESULT` panel make repository state
more visually important than the argument. The focused reader has a sound text
measure, but heavy navigation rails cage the article.

The external audit does not support that hierarchy. Its repository, paper,
specification and rendered-publication evidence instead puts the research
object, publication identity, argument, provenance and correction route first.

The adopted direction is therefore a compact research-first surface:

1. thesis and plain-language scope first;
2. one explanatory system figure;
3. a neutral statement of evidence status;
4. publication formats and source identity;
5. the detailed evidence path and library below; and
6. a quieter reader whose article is the dominant object.

This is an engineering translation from observed patterns, not proof that the
new design improves comprehension. The task tests below retain that empirical
boundary.

## Method and limits

The implementation audit combined:

- browser inspection of the deployed site at `1440 × 1000` and `390 × 844` CSS
  pixels;
- source inspection of the portal component and active screen CSS;
- rendered inspection of the replacement at `1440 × 1000`, `390 × 844` and
  `320 × 844`; and
- focused source tests for hierarchy, mobile identity and route entry.

The visual observations were agent-assisted. No independent designer,
accessibility specialist or representative reader panel reviewed this pass.
The work did not test assistive-technology combinations, font fallback on all
platforms or comprehension. Those limits prohibit a claim that the result is
optimal, conformant or easier to understand.

## Observation: the deployed interface before this pass

| Surface | Rendered observation | Consequence to test |
| --- | --- | --- |
| Desktop landing page | At `1440 × 1000`, the dashboard occupied about `953px` vertically and exposed 19 links in the first viewport. | Readers had to distinguish a pitch, two action buttons, a status panel, four metrics, publication links and six process stages before reaching the library. |
| Evidence funnel | The funnel was about `1310px` wide, divided into six columns, with most explanatory text at `12–13px`. | The sequence was visible, but its narrow cells forced the explanation into a metadata-sized tier. |
| Evidence status | `NO_RESULT` appeared in a red bordered panel. | A truthful eligibility boundary looked like a system failure. Red should remain available for invalidated, retracted or failed research objects. |
| Visual language | Thick borders, monospace labels, metrics and green, blue, cyan, coral, violet and amber accents appeared together. | The combined signal resembled monitoring software more than a maintained manuscript. |
| Mobile landing page | At `390 × 844`, the page was about `6573px` long. The first screen held the title, pitch and two large actions; research state began below it. | The interface was neither compact for returning readers nor sufficiently explanatory for a new reader above the fold. |
| Mobile header | The project name disappeared while Language and Menu remained. | The two utilities displaced the identity of the work they controlled. |
| Focused reader | At desktop width, a dark `290px` library and `230px` outline surrounded the article inside a heavy frame. The body itself was about `688px` wide at `16.5px` with roughly `28.4px` line height. | The prose measure was reasonable; surrounding chrome, borders and type contrast were the larger defect. |
| Mobile document entry | Selecting a document scrolled the article element into view after the route changed. The static document-title toolbar remained above that target. | A mobile reader could arrive at Contents or the body without seeing the title and source context. |

These measurements describe the inspected render only. They are not stable
product metrics and should not be copied into publication claims.

## Engineering translation adopted for Pages

These rules apply the externally supported boundaries recorded in the
[research audit](../research/audits/2026-08-30-git-centred-open-research-publication-infrastructure.md).
They are project choices, not conclusions copied from any one publication.

### Landing page

- Limit the primary composition to about `1260px` and use a warm paper field,
  dark ink, muted ink, hairline borders and one project green. Amber and red are
  semantic colours, not section decoration.
- Put the thesis, current authority and evidence stage beside a numbered system
  figure. The figure must describe the repository's actual observation →
  principle → claim → protocol → run → evidence return path and state that it
  is not an experimental result.
- Keep the status immediately visible but neutral: “Framework and development
  harnesses” and `NO_RESULT` describe eligibility. They do not signal an
  application error.
- Move the six detailed stages below the first composition and render them as
  one ordered evidence trail rather than six narrow cards.
- Use four primary navigation concepts: Read, Evidence, Experiments and
  Contribute. Keep source and language as utilities. Preserve the project name
  on mobile.
- Present question-based entry points as quiet editorial links. Do not assign a
  different decorative colour to every question.

### Focused reader

- Use about `18px` type with `1.66` line height and a `68ch` maximum for argument
  text on wide screens. Use about `17px`, `1.68` and `20px` gutters on small
  screens. These are project defaults, not universal accessibility minima.
- Retain one quiet library rail at wide desktop sizes and one optional outline
  rail only while there is space. Remove the heavy shared frame and dark rail.
- Let figures, display mathematics, code and tables use the article width while
  ordinary paragraphs remain bounded.
- Scroll a newly selected route to the document page, not past its title. On
  mobile, title, sequence and source actions precede the collapsible Contents
  block and body.
- Keep wide tables and diagrams in local keyboard-accessible overflow regions.
  Never widen the entire page to accommodate one object.

### Research objects and contribution

- Keep source, issue, book and PDF actions adjacent to a document's identity.
- Add an experiment-record surface only when it can derive source, release
  artifact, immutable image digest, execution receipt, review route and
  eligibility state from maintained registries. Do not hand-copy those fields.
- End-state contribution routes should distinguish clarity reports, evidence
  corrections, reproductions and reviewed translations. A future document-end
  callout must generate its target from the same source identity already used
  by the toolbar.

## Rendered verification of the working-tree implementation

The implementation was rebuilt in the local Pages development surface and
inspected in Chrome after the source tests passed.

| View | Observed result |
| --- | --- |
| `1440 × 1000` landing page | The first viewport contained 13 links rather than the deployed 19. The thesis and research-cycle figure ended at about `746px`; the neutral status strip began at about `832px`. The detailed evidence trail began below the first viewport at about `1143px`. No horizontal overflow occurred. |
| `1440 × 1000` evidence trail | Six stages rendered as one ordered list. Rows were about `111–133px` high, and explanatory text rendered at `14px` rather than the previous `12–13px` narrow-cell tier. |
| `1440 × 1000` focused reader | The grid rendered as a `235px` library, `900px` article and `195px` outline with quiet gaps and no shared frame. Argument text rendered at `18px` with about `29.9px` line height and a `68ch` bound; research media retained more width than ordinary paragraphs. |
| `390 × 844` landing page | The project name remained visible, the research figure entered at the bottom of the first screen, eight initial catalogue results kept the full page to about `6375px`, and no horizontal overflow occurred. |
| `375 × 844` open language control | A headless-browser regression opened the control and kept both the panel and selector inside the document's client width without introducing horizontal overflow. The panel uses a viewport-bound width and a finite vertical scroll region. |
| `390 × 844` document entry | After selecting the thesis, the sticky site header ended at `62px` and the document title began at about `109px`. The title, sequence, source actions and Contents block all preceded the article body. |
| `390 × 844` contribution page | The local Pages server rendered the canonical contribution map rather than an empty template. The short failed-run route appeared twice in context; wide tables and the receipt example scrolled inside their own regions while document width remained `375px`. |

These values are rendered regression evidence for one browser and snapshot,
not universal layout guarantees. The focused source tests also protect the
title-preserving scroll target, figure authority caption, reduced catalogue
page size, dominant article measure and mobile project identity.

## Quantitative reading boundary

The [external research audit](../research/audits/2026-08-30-git-centred-open-research-publication-infrastructure.md#research-publication-layout-boundary)
records the W3C sources for bounded lines, reflow and user text spacing. The
project's `68ch` argument measure is a starting constraint, not a certificate
that every font fallback produces the same number of characters.

Rendered tests still need to cover text zoom, reflow at
[320 CSS pixels](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html),
keyboard order, focus visibility, contrast, figure captions and fallback fonts.

## Falsifiable interface hypotheses

These hypotheses evaluate the publication interface, not the scientific
concept.

1. **Research-first landing:** technically curious non-experts and research-
   software contributors will identify the thesis, evidence status and first
   reading route more accurately with the compact composition than with the
   deployed dashboard. Reject this if either group loses any of those three
   facts more often.
2. **Neutral status:** readers will paraphrase `NO_RESULT` as “no eligible
   scientific result yet”, not “the project failed”. Reject this if moderated
   task responses retain the failure interpretation.
3. **Quiet reader rails:** the lighter reader will reduce time to begin the
   argument without increasing time to find another document or its source.
   Reject this if source discovery or document switching becomes materially
   worse.
4. **Title-preserving mobile entry:** a selected document's title and source
   context will remain visible before its body at `320–430px`. Reject this on
   any supported route or browser where navigation still lands below the
   title.

A bounded moderated check should include technically curious non-experts and
people who maintain research software. Ask each reader to state the hypothesis,
current result status, canonical source, correct feedback route and location of
a runnable experiment. Record viewport, browser, task order and failures. Do
not optimise click count or aesthetic preference in place of those tasks.

## Remaining decisions outside the visual pass

The external audit surfaced useful research-publication extensions, but the
layout does not authorise them:

- GitHub Discussions still requires a moderation owner and channel rules;
- a Zenodo deposit requires a specific approved release and identity check;
- inline annotation creates privacy, moderation, accessibility and source-
  version boundaries; and
- a translator interface must preserve Decision 0035's reviewed, source-bound
  Git authority.

Those are governance and service decisions, not missing decoration. Their
evidence and decision boundaries remain in the
[external audit](../research/audits/2026-08-30-git-centred-open-research-publication-infrastructure.md#decisions-and-tests).
