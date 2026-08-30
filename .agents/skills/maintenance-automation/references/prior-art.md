# Maintenance-skill prior-art audit

Audited 2026-08-30. This record pins the external skill sources considered for
the project-local maintenance contract. It records patterns, not imported text.

## Sources inspected

- OpenAI's curated
  [`gh-fix-ci`](https://github.com/openai/skills/blob/49f948faa9258a0c61caceaf225e179651397431/skills/.curated/gh-fix-ci/SKILL.md)
  and
  [`define-goal`](https://github.com/openai/skills/blob/49f948faa9258a0c61caceaf225e179651397431/skills/.curated/define-goal/SKILL.md)
  skills at commit `49f948faa9258a0c61caceaf225e179651397431`,
  under their recorded Apache-2.0 licence.
- Jesse Vincent's
  [`obra/superpowers`](https://github.com/obra/superpowers/tree/b36e0829c6d0140e93cfef2ca599b1b07d4a7797)
  at commit `b36e0829c6d0140e93cfef2ca599b1b07d4a7797`, distributed under MIT.
  Relevant skills cover verification before completion, plan execution,
  systematic debugging, review handling, and forward-testing skills with fresh
  agents.
- K-Dense AI's
  [`scientific-agent-skills`](https://github.com/K-Dense-AI/scientific-agent-skills/tree/f6fcafeb1cc8c82eca0160a18bc41c38427b8e0f)
  at commit `f6fcafeb1cc8c82eca0160a18bc41c38427b8e0f`, distributed under MIT.
  Relevant material covers experimental design, critical review, skill
  validation, changed-skill checks, isolated task environments, and tests for
  scripts shipped with a skill.
- Renovate's official documentation for the
  [Dependency Dashboard](https://docs.renovatebot.com/key-concepts/dashboard/),
  [scheduling](https://docs.renovatebot.com/key-concepts/scheduling/),
  [minimum release age](https://docs.renovatebot.com/key-concepts/minimum-release-age/),
  [configuration validation](https://docs.renovatebot.com/config-validation/),
  and [automerge](https://docs.renovatebot.com/key-concepts/automerge/), checked
  alongside source commit `d6ded0701846bee41197632bd4ba7e9f9051261e`.
- GitHub's official documentation for
  [workflow permissions](https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax#permissions),
  [concurrency](https://docs.github.com/en/actions/how-tos/write-workflows/choose-when-workflows-run/control-workflow-concurrency),
  [REST API practice](https://docs.github.com/en/rest/using-the-rest-api/best-practices-for-using-the-rest-api),
  and [issue forms](https://docs.github.com/en/communities/using-templates-to-encourage-useful-issues-and-pull-requests/syntax-for-issue-forms),
  checked alongside `github/docs` commit
  `5e0cd6082684634c7cb7852b99db179eb34313c3`.

## Patterns retained

| Pattern | Project adaptation |
| --- | --- |
| Completion claims require fresh evidence | A maintenance hand-off names the exercised check, repair, idempotence, and failure lanes. |
| Skills should compose around a concrete trigger | This skill routes work to existing Go, manifest, Renovate, validator, or workflow owners instead of replacing them with a general methodology. |
| Mechanical constraints belong in code | Stable schema, bounds, permissions, pins, and freshness checks remain executable repository policy. |
| Test a skill on realistic pressure cases | A forward review must detect over-automation, duplicate owners, unsafe remote mutation, and unnecessary full-gate repetition. |
| Research tasks need an explicit design and hand-off | Scientific maintenance preserves units, controls, evidence status, and the boundary between operational completion and research results. |
| Isolate dependency-heavy task environments | Experiment images own their runtime; ordinary repository maintenance does not install every scientific package into one CI environment. |
| Validate only the changed heavy task in ordinary CI | The impact planner selects affected experiment lanes while the full integration gate remains available at its named boundary. |
| Separate inspection, plan, approval, mutation, and recheck | Remote maintenance gets an immediate preflight, explicit authority, least-privilege write, read-back, and a stop condition. |
| Reuse before proposing a new skill or service | Existing Go commands, manifests, Renovate and workflows remain the first routing targets. |

## Patterns adapted or rejected

- The project does not adopt a global development doctrine, mandatory wording,
  or a skill for every ordinary command. Its local contracts and scientific
  authorities remain primary.
- It does not copy upstream scripts, Screenpipe-based workflow observation,
  plugin installers, or host-specific shell and Windows machinery. Maintenance
  admission uses repository evidence and issues, not passive screen capture.
- It does not fetch skill text from an upstream branch at invocation time.
  Revisions are pinned here and re-audited deliberately.
- It does not accept mutable GitHub Action tags used by some upstream
  workflows. This repository requires full commit SHAs.
- It does not run every dependency-heavy scientific skill environment for an
  unrelated maintenance change. Focused lanes precede one aggregate integration
  gate.
- It does not treat an automated critique, readability score, security scanner,
  or skill validator as authority to change a scientific claim or suppress a
  finding.

## Remaining limits

A skill can make repeated upkeep cheaper, but cannot decide which research
question matters, whether evidence supports a claim, whether a translation is
correct, or whether a consequential remote mutation is acceptable. Those
decisions remain with the repository authority and named reviewer.
