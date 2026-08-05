# Burden-qualified contestable decisions

## Scope

This note formalizes the narrow systems residue from the
[legal evidence/procedure audit](../research/audits/2026-08-05-legal-evidence-procedure.md):
evidence state, authority, burden, procedure, decision, review, remedy, and
finality remain distinct. The legal rules are jurisdiction- and date-bound;
the transfer is an experiment contract, not a claim that adjudication is an
optimizer or a truth oracle.
Its evidence boundaries are [C-679](../research/claims.md#c-679)–[C-704](../research/claims.md#c-704).

## Decision record

For decision version $v$, retain

$$
\mathcal D_v=(J,A,P,H,B,S,R,O,Q,D,G,V,F),
$$

where $J$ is jurisdiction/rule authority, $A$ authorized decision-maker, $P$
parties or affected interests, $H$ claim and requested action, $B$ burden
bearer, $S$ governing standard/decision rule, $R$ admitted record, $O$
objections and preserved issues, $Q$ disclosure/access/response state, $D$
disposition, $G$ stated grounds and reasons, $V$ review/remedy state, and $F$
finality/reopening conditions. These are typed fields, not commensurable scores.

For evidence item $i$,

$$
e_i=(a_i,p_i,u_i,c_i,\alpha_i,\delta_i,w_i,h_i,o_i),
$$

where $a_i$ is artifact identity, $p_i$ proponent, $u_i$ permitted purpose,
$c_i$ custody/provenance, $\alpha_i$ authentication ruling, $\delta_i$
admissibility ruling, $w_i$ weight or likelihood contribution, $h_i$ supported
claim/scope, and $o_i$ objections/contrary evidence. Authentication does not
imply content truth; admissibility does not imply weight; weight does not imply
sufficiency; sufficiency does not grant authority.

## Statistical and authority boundaries

For formal hypotheses $H_1,H_0$, the likelihood ratio

$$
\Lambda(e)=\frac{p(e\mid H_1)}{p(e\mid H_0)}
$$

is dimensionless and depends on the evidence model. It is neither
$p(H_1\mid e)$ nor a universal translation of a verbal proof standard. A
decision threshold follows only after hypotheses, priors/evidence
distributions, consequence vector, protected constraints, authority, and the
decision rule are declared.

Keep the outcome vector visible:

$$
\mathbf L=(N_{10},N_{01},T_{\mathrm{wrong}},N_{\mathrm{process}},
N_{\mathrm{protected}},C,T_H,T_D,E),
$$

where false positive/negative counts $N_{10},N_{01}$ are decisions,
$T_{\mathrm{wrong}}$ is time under an incorrect or unauthorized effect in
person-seconds or effect-seconds, $N_{\mathrm{process}}$ and
$N_{\mathrm{protected}}$ are violation counts, $C$ is currency at a stated
price year, $T_H$ human effort in person-seconds, $T_D$ elapsed delay in
seconds, and $E$ lifecycle energy in joules. Protected procedure cannot be
silently traded for mean accuracy through an unstated scalarization.

## Review is selected and scoped

For $N_0$ first decisions, $N_A$ reviewed, and $N_R$ reversed/remanded,

$$
r_A=\frac{N_A}{N_0},
\qquad
r_R=\frac{N_R}{N_A}.
$$

Both are dimensionless. $r_R$ is not the first-stage error rate because issue
preservation, selection into review, review standard, harmless/prejudice rule,
remedy, settlement, and reviewer error intervene. A review record therefore
binds the issue, record version, standard, permitted scope, identified error,
prejudice rule, disposition, remedy, successor version, and later validity.

## Falsification boundary

The held composition loses if typed workflow plus provenance, access control,
calibrated selective prediction, rule/citation graphs, independent review,
red-team challenge, conflict-of-interest controls, and full recomputation match
its protected outcome–cost frontier. Reason text is not credited as faithful
causal introspection; finality is not truth; reopening is not free rollback;
and similarity to a prior decision does not establish applicable authority.
