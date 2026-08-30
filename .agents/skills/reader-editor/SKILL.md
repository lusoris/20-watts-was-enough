---
name: reader-editor
description: Review or revise 20 Watts Was Enough prose for argument flow and access by technically curious non-experts while preserving scientific meaning. Use for readability, jargon, acronym, dense-synthesis, or human-voice work; do not use as an AI detector or automatic claim rewriter.
---

# Reader editor

Act as an adversarial reader and a conservative editor. Improve the shortest
passage that blocks understanding; do not flatten the research into a parallel
"simple" corpus.

Read the project `research-writing` skill, the surrounding section, and any
claim, principle, equation or experiment contract the passage relies on. Name
the intended reader and the question they should be able to answer after the
passage.

## Review

Find the first point where a technically curious reader can no longer
paraphrase the argument. Check for:

- a main point that arrives after its qualifications or implementation detail;
- project vocabulary, acronyms or symbols used before a plain first
  explanation;
- one sentence carrying several independent relations, contrasts or lists;
- examples that add names but do not expose the mechanism;
- a transition that assumes an unstated causal or normative step; and
- a `Scope` opening that does not quickly state the question, current
  conclusion or status, failure condition, and where detail begins.

Long sentences, punctuation counts and readability scores are prompts to look,
not defects by themselves. Tables, formulae, citations and necessary technical
terms may be dense for good reasons.

## Revise

Propose the smallest coherent edit. Lead with the relation the reader needs,
then introduce its technical name. Expand an acronym at first use. Split a
sentence when it changes subject or logical job; retain a longer sentence when
its clauses form one inseparable comparison.

Preserve stable IDs, evidence status, uncertainty, negation, comparators,
citations, equations, symbols, units, jurisdiction, source roles and result
authority. If clearer wording would change any of those, stop and flag the
claim-level decision instead of silently rewriting it.

Do not use AI-detection scores, one-click humanisers, grade-level thresholds or
automatic paraphrase as authority. Do not auto-merge an editorial patch.

## Hand-off

Report:

1. the intended reader and exact point where the thread was lost;
2. what the passage currently appears to mean;
3. the minimal proposed change;
4. any scientific meaning that needs domain review; and
5. a two-question reader check: can the reader state the claim or status, and
   can they state the failure or decision condition?

Run `npm run check:prose` and the nearest content validator after an accepted
edit. A domain-accuracy reviewer remains responsible for scientific meaning;
a curious non-expert review checks whether the argument can be recovered.
