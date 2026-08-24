# Cross-candidate benchmark fixtures

Fixtures are hostile, reusable evaluation environments. They do not introduce
architecture candidates. Each fixture combines mechanisms owned elsewhere and
tests whether their composition survives strong ordinary baselines, equal
budgets, withheld regimes, perturbations, and explicit rejection rules.

The executable fixture slices are the
[F-007 null-space-honesty smoke harness](../workstation/fixture-007/README.md)
and the [F-012 layout-randomized performance-inference
harness](../workstation/fixture-012/README.md).
Execution readiness is tracked separately from the completeness of each full
fixture contract.

| ID | Fixture | Candidate owners |
| --- | --- | --- |
| F-001 | [Shared-clock-free predictive co-adaptation](001-shared-clock-free-coadaptation.md) | 002, 015, 019, plus the held entrainable local phase state |
| F-002 | [Versioned reconstructive design](002-versioned-reconstructive-design.md) | 004, 019; constrained by 014 and 017 |
| F-003 | [Opportunity- and history-qualified adaptive action](003-opportunity-history-qualified-action.md) | 004, 006, 007, 014, 018, 019 |
| F-004 | [Versioned proof discovery and verification](004-versioned-proof-discovery.md) | 004, 009, 010, 011, 014, 017, 019 |
| F-005 | [Regime-qualified flow inference and control](005-regime-qualified-flow-inference-control.md) | 002, 003, 006, 007, 012, 014 |
| F-006 | [Representative adaptive performance](006-representative-adaptive-performance.md) | 002, 004, 006, 007, 009, 012, 014, 019 |
| F-007 | [Operator-qualified optical inference](007-operator-qualified-optical-inference.md) | 001, 006, 007, 010, 014, 017, 018 |
| F-008 | [Mission-profile-qualified device reliability](008-mission-profile-qualified-device-reliability.md) | 001, 005, 006, 009, 010, 012, 014, 017, 018 |
| F-009 | [Operator-qualified active acoustic inference](009-operator-qualified-active-acoustic-inference.md) | 002, 006, 007, 009, 012, 014 |
| F-010 | [Boundary-qualified physical computation](010-boundary-qualified-physical-computation.md) | 001, 005, 006, 009, 010, 012, 014, 017, 018 |
| F-011 | [Operator-qualified active chemical sensing](011-operator-qualified-active-chemical-sensing.md) | 002, 006, 007, 009, 010, 012, 014, 017, 018 |
| F-012 | [Layout-randomized performance inference](012-layout-randomized-performance-inference.md) | 009 and 014; cross-cutting measurement null for compiled candidates |
| F-013 | [Immune-state lifecycle evidence and systems frontier](013-immune-state-lifecycle-evaluation.md) | source-domain reproductions plus 005, 009, 011, 012, 014, and 018 for the AI frontier |
| F-014 | [Continual-memory lifecycle under interference](014-continual-memory-lifecycle.md) | fast/slow memory and selective replay; cross-cutting continual-learning test for C-008 and C-010 |
| F-015 | [Sensorimotor grounding and hidden transfer](015-sensorimotor-grounding-transfer.md) | aligned perception--action--outcome learning; cross-cutting hidden-transfer test for C-007 |
| F-016 | [Versioned evidence retrieval and feedback](016-versioned-evidence-retrieval-feedback.md) | retrieval and reversible feedback lifecycle; cross-cutting test for C-797 and C-798 |
| F-017 | [Low-bit model and native-hardware crossover](017-low-bit-model-hardware-crossover.md) | ternary training, native execution, and lifecycle accounting; cross-cutting test for C-013 |
| F-018 | [Environmental process, state, and infrastructure control](018-environmental-process-state-control.md) | mature RTD, biological-retention, integrated-control, anomaly-isolation, fouling, adsorption, anaerobic-state, transformation/effect-closure, lifecycle, and infrastructure-topology nulls; cross-cutting tests for C-1470--C-1476, C-1478--C-1479, and the C-1285 extension |
| F-019 | [Finance-risk, attention, and governance controls](019-finance-risk-attention-governance.md) | mature risk, fixed-point, portfolio, attention, option, control, resilience, queue, accounting, and incentive nulls; cross-cutting tests for C-1480--C-1487 and maturation tracks for C-659--C-661, C-139, C-1433, and C-144 |
