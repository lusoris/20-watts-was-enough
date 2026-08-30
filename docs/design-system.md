# Research design system

The visual system has one job: help a reader move from the project's question
to its evidence, uncertainty, experiments, and contribution routes without
losing the thread. It should look deliberate and recognisable, but never use
style to imply that a hypothesis is established or that a smoke run is a
scientific result.

## Who the design serves

The first audience is a technically curious reader who does not yet know the
repository's vocabulary. Specialists must still be able to inspect stable
claim IDs, sources, equations, protocols, and generated artifacts without a
simplified parallel edition. Contributors need a visible next action and an
exact authority boundary.

Those needs produce three presentation modes from the same canonical content:

| Mode | Reader task | Visual priority |
| --- | --- | --- |
| overview | decide what the project is and where to begin | short hierarchy, honest status, few competing actions |
| research reading | follow an argument and inspect its support | bounded prose measure, strong headings, local evidence links |
| execution and review | reproduce, falsify, or contribute | exact identities, explicit states, copyable commands, visible failure paths |

The modes may use different density. They do not create different scientific
meanings.

## Brand character

The project joins living systems with disciplined engineering. Its visual
language should therefore feel:

- **calm:** warm reading surfaces, enough empty space, and restrained motion;
- **exact:** visible provenance, stable identifiers, crisp controls, and clear
  state boundaries;
- **connected:** relationships and flows are shown when they explain a
  mechanism, not added as decorative network imagery;
- **material:** energy, hardware, organisms, and experiments remain physical
  rather than dissolving into generic cloud or AI symbolism; and
- **open to correction:** evidence status, issue routes, negative results, and
  unresolved decisions are part of the interface.

This rules out neon cyberpunk, anthropomorphic robot imagery, fake journal
chrome, decorative brain circuits, and dashboard density without a reader
task. It also rules out sterile minimalism when removal would hide provenance
or the next useful action.

## Working principles

### Information before ornament

Visual hierarchy starts with the reader's next question. Size, spacing,
position, labels, and grouping should reveal the project question, current
status, evidence route, and contribution route before adding illustration.
Decoration earns its place by reinforcing that hierarchy or the brand
character.

### One owner for each decision

Reusable colours, spacing, type roles, radii, borders, shadows, and motion live
as semantic tokens in the owning stylesheet. Components consume those roles.
A route must not restate the palette or copy a component merely to obtain a
slightly different appearance.

The current token values in [`app/globals.css`](../app/globals.css) are the
implementation authority. This document defines their roles, not duplicate
hex values. New work should converge primitive tokens and portal aliases into
a smaller semantic set as components are touched; a redesign does not justify
an unrelated whole-file rewrite.

### Typography carries structure

The serif role gives major research titles and editorial moments a distinct
voice. The sans-serif role carries long reading and interface text. The
monospace role is reserved for code, hashes, machine states, commands, and
other identities whose exact form matters.

Long-form prose targets roughly 68–76 characters per line and at least 1.5
line spacing. Headings may use a shorter measure. Text must resize to 200%
without loss of content or functionality, and ordinary reading must reflow
without page-level horizontal scrolling at 320 CSS pixels. Tables, mathematics,
diagrams, and code may scroll inside a labelled local region when their
two-dimensional structure carries meaning. These bounds follow
[WCAG 2.2 visual presentation](https://www.w3.org/WAI/WCAG22/Understanding/visual-presentation.html)
and [reflow guidance](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html).

### Colour supports meaning; it does not own it

Deep forest and warm paper establish the main reading environment. Brighter
green, blue, cyan, amber, coral, and violet accents distinguish recurring
roles such as links, stages, warnings, or mechanism families. Every semantic
use needs a text, icon, pattern, position, or shape cue as well. Text and
required graphical objects meet the applicable WCAG contrast requirement;
focus is visible against both the component and its surroundings.

### Density follows the task

The portal can summarise and route. A document page should recede around the
argument. Execution surfaces may be denser because exact identifiers and
failure states are part of the task. Mixing all three densities on one screen
creates a catalogue rather than a reading path.

### Motion must carry information

Animation may explain transition, confirm an action, or preserve orientation.
Ambient motion, parallax, and continuous decorative effects are excluded: they
consume attention and energy without improving the research interface.
Reduced-motion preferences remain effective.

### Research graphics remain inspectable

Charts and diagrams keep an editable source, a caption, their data or
construction path, and a textual route to the same conclusion. Colour is not
the only series identifier. Illustrative values are labelled as such and never
styled as measured results.

## Components and ownership

The current characteristic device is the research-cycle return path on the
portal overview. It shows that evidence, synthesis, testing, rejection and
revision form a loop; it is not a result graphic. Preserve it until rendered
reader evidence or a superseding decision shows that another device carries
that relationship better.

Semantic ownership is grouped by role, even while legacy aliases are
consolidated:

| Role | Owner | Required behaviour |
| --- | --- | --- |
| page surface | global surface tokens | separates navigation and application context from reading material |
| paper surface | publication and document tokens | supports sustained reading without implying a different source authority |
| primary and muted text | global text-role tokens | preserves hierarchy and contrast across both surfaces |
| borders and separators | global boundary tokens | groups content without becoming the dominant texture |
| actions and links | shared action and link roles | remain recognisable without colour alone and expose visible focus |
| focus | global focus role | remains visible against the control and its surroundings |
| evidence states | status roles plus explicit text | distinguish concept, protocol, smoke and result authority without colour alone |

Before changing a selector, search every definition under the same media or
container condition. Move the touched rule to its owner instead of adding a
later override. Existing cascade debt is not permission to increase it.

The design system prefers a few components with named jobs:

- **entry cards** answer “where should I start?” and contain one primary route;
- **status summaries** distinguish concept, protocol, smoke, and result
  authority in words;
- **document navigation** preserves the declared source hierarchy and keeps
  the article dominant;
- **evidence links** expose claim, source, decision, and test identities without
  turning every paragraph into a control panel;
- **local overflow regions** contain wide tables, code, equations, and diagrams
  without making the page itself scroll sideways; and
- **contribution routes** state the task, context, finish condition, and issue
  destination before asking a reader to act.

Add a component only when its semantic job repeats. A visual variant that does
not change the job should remain a token or state of the existing owner.

## Change and review contract

Every visual change starts with a short brief: intended reader, task, observed
failure, owning token or component, and rejecting observation. Implement the
smallest coherent owner change, then run the focused site tests and the visual
review protocol in the project-local
[`research-design` skill](../.agents/skills/research-design/SKILL.md).

Broad publication changes cover the portal, one dense document, the book, and
the help route at narrow, medium, and wide widths plus 200% browser zoom.
Keyboard order, visible focus, reflow, long identities, diagrams, tables, and
intentional before/after differences are recorded. Automated checks can reject
known failures; they do not decide whether the hierarchy communicates the
right thing.

Comparable sites and design systems are research inputs, not templates. For
example, [Real World Data Science](https://realworlddatascience.net/) usefully
connects articles, code, contributor guidance, and issue routes. The project
adopts a pattern only after naming the reader problem it solves here.
