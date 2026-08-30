# Agent-skill prior-art audit

Audited 2026-08-30. This note records design-skill mechanisms already examined.
It is not a licence to copy upstream wording or a substitute for current
accessibility standards.

## Sources inspected

- Anthropic's
  [`frontend-design` skill](https://github.com/anthropics/skills/blob/3b3fad96af16a10759d930941b4520ba0c40edae/skills/frontend-design/SKILL.md)
  at commit `3b3fad96af16a10759d930941b4520ba0c40edae`.
- OpenAI's product-design
  [`research`](https://github.com/openai/plugins/blob/1e285826e604f66f7208f7ac4dba0fe8341d1f57/plugins/product-design/skills/research/SKILL.md),
  [`audit`](https://github.com/openai/plugins/blob/1e285826e604f66f7208f7ac4dba0fe8341d1f57/plugins/product-design/skills/audit/SKILL.md), and
  [`design-qa`](https://github.com/openai/plugins/blob/1e285826e604f66f7208f7ac4dba0fe8341d1f57/plugins/product-design/skills/design-qa/SKILL.md)
  skills at commit `1e285826e604f66f7208f7ac4dba0fe8341d1f57`.
- OpenAI's
  [`accessibility-and-inclusive-visualization` skill](https://github.com/openai/plugins/blob/1e285826e604f66f7208f7ac4dba0fe8341d1f57/plugins/build-web-data-visualization/skills/accessibility-and-inclusive-visualization/SKILL.md)
  at the same commit.
- Vercel's
  [`web-design-guidelines` skill](https://github.com/vercel-labs/agent-skills/blob/063bee94c3f4df8453406c830b0a7df0f2860278/skills/web-design-guidelines/SKILL.md)
  at commit `063bee94c3f4df8453406c830b0a7df0f2860278`
  and its guideline source at commit
  [`e3d624b`](https://github.com/vercel-labs/web-interface-guidelines/tree/e3d624baaf29dc1fc645aff3e38f03e564d2d6b1).

## Patterns retained

| Pattern | Project adaptation |
| --- | --- |
| Ground visual direction in the real subject, audience, and page job | The skill starts with a named reader task and permits one characteristic device only when it encodes a real mechanism or evidence relation. |
| Structure must carry information | Numbering, cards, colour, and network imagery need a semantic role rather than serving as generic design decoration. |
| Rendered evidence precedes audit conclusions | Broad design review requires current captures, matched viewport/state/revision, and inspection of the saved images. |
| Research observed problems before prescribing a redesign | Issues, reader reports, and the live surface are evidence inputs; code inspection alone is insufficient. |
| Compare implementation and intent at the same state and density | The visual protocol records viewport, zoom, device scale, route, content revision, and UI state. |
| Preserve a non-visual path through important graphics | Diagrams and plots retain editable source, caption, data or construction path, and textual access to the conclusion and caveat. |
| Treat accessibility as several evidence lanes | Screenshots, semantics, keyboard use, automated checks, reduced motion, and assistive-technology behaviour are not collapsed into one score. |
| Keep skill context progressively disclosed | The entry skill contains routing and invariants; visual-review mechanics and this audit remain references loaded only when relevant. |

## Patterns adapted or rejected

- The project does not require image generation before interface work. Its
  canonical surfaces already exist in HTML, CSS, Markdown, Mermaid, and plots;
  code-native changes are cheaper to inspect and maintain.
- It does not chase uniqueness by changing fonts, palette, or layout on every
  request. A maintained research identity needs continuity as well as
  character.
- It does not use “agency sign-off”, taste scores, AI detectors, or claims of a
  perfect visual match as acceptance evidence.
- It does not fetch mutable design instructions from an upstream `main` branch
  at invocation time. External guidance is reviewed as evidence and pinned in
  this audit; current W3C documents are rechecked when a normative
  accessibility claim matters.
- It does not turn a large generic UI checklist into the design authority.
  Automated checks target known failure classes, while the human-facing design
  system states the project's actual reader and brand decisions.

## Remaining limits

The skill cannot replace observation by disabled readers, target-language
review, or a real contributor's attempt to navigate the project. A broad
redesign still needs current rendered evidence and should turn repeated user
failures into focused regression checks.
