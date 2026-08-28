---
name: research-writing
description: Edit project-authored research, concept, mathematics, experiment, governance, or public-site prose for 20 Watts Was Enough. Use when drafting or revising explanatory text; do not apply to imported sources, verbatim quotations, or code-only changes.
---

# Research writing

Write like a technically literate person making an argument, not like a system
filling a document template. Preserve the project's direct, curious, sometimes
blunt voice while keeping evidence boundaries exact.

## Before writing

Read the surrounding passage, its nearest `AGENTS.md`, and any applicable
linked claim, principle, equation, or experiment contract. Identify the one
thing the new text must make clearer. Do not restate background already
established nearby.

For claims, methods, evidence, results, contributor credit, tool disclosure,
or research governance, also read
[`research/research-integrity-baseline.md`](../../../research/research-integrity-baseline.md).
Skip that extra read for presentation-only or interface copy.

Use British English in canonical prose. Preserve source terminology, stable
identifiers, equations, citations, and quotations exactly unless the task is to
correct them.

## Draft the argument

- Lead with the finding, mechanism, disagreement, or decision. Give context
  only when the reader needs it to understand that point.
- Prefer concrete nouns and active verbs. State what changes, under which
  condition, through which mechanism, and what would be observed if it fails.
- Let paragraphs have different shapes. A short consequence can follow a
  longer derivation; do not force every paragraph into claim-explanation-
  summary form.
- Use a list for a real set, sequence, or comparison. Use prose when the ideas
  depend on one another. Do not hide an argument inside a wall of bullets.
- Put uncertainty where it belongs: next to the affected claim, parameter, or
  inference. One precise qualification is stronger than repeated generic
  caution.
- Separate observation, proposed translation, and speculation without
  repeatedly announcing that separation after it is already clear.
- Use examples that expose a mechanism or failure mode. Do not invent an
  analogy merely to make the prose sound approachable.
- Keep the required chapter headings, but do not repeat stock opening and
  closing sentences under each heading.

## Remove machine-shaped prose

Delete text that performs tone instead of carrying information, including:

- ceremonial openings and summaries;
- claims that something is important without saying why;
- marketing verbs such as *unlock*, *revolutionise*, or *pave the way*;
- vague intensifiers such as *remarkable*, *profound*, or *crucial* when no
  comparison supports them;
- canned contrasts of the form “not merely X, but Y” unless an actual mistaken
  X is being corrected;
- strings of equally sized sentences or paragraphs with the same opener;
- fake quotations, unsourced consensus, and anonymous “researchers believe”;
- defensive disclaimers against positions the project and user never took;
  in particular, do not introduce claims about whether the project aims to
  recreate an organ unless that distinction is necessary to the argument; and
- repeated reminders of settled repository boundaries. Link the controlling
  statement instead.

Never weaken a scientific qualification merely to sound confident. Never add a
qualification merely to sound responsible.

## Revision pass

1. Check that every paragraph contributes a new fact, relation, consequence,
   limitation, or decision.
2. Replace abstract summary words with the concrete mechanism they stand for.
3. Remove repetition and throat-clearing before shortening substantive detail.
4. Read the passage aloud mentally. Split accidental run-ons and combine
   staccato fragments; sentence-length variation should follow the thought.
5. Verify claim status, citations, symbols, units, cross-links, and the boundary
   between measured results and hypotheses.
6. Run `npm run check:prose` and the closest content validator.

`check:prose` is a narrow tripwire for a small set of high-confidence phrases
in canonical project Markdown. It does not judge argument quality or replace
review. Public-site prose embedded in code follows this skill through review,
not through brittle JSX or HTML extraction.

The tripwire ignores Markdown code and blockquotes. When a flagged phrase is
necessary in ordinary prose, add a concrete, reviewable reason on that same
line using `<!-- prose-audit: ignore-line: reason -->`. Do not use the marker
to exempt a passage or file.

Machine-translated reading views are access aids, not canonical prose. Do not
silently write generated translations back into the English source or present
them as reviewed translations.
