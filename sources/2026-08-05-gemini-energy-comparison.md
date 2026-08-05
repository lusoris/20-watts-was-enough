# Source capture: Gemini energy-comparison discussion

## Provenance

- **Captured:** 2026-08-05
- **Conversation title:** *Brain vs. AI Energy Consumption*
- **Original URL:** <https://gemini.google.com/app/d1191af76eb24637?hl=de>
- **Method:** Transcribed from the visible linked Gemini conversation.
- **Authority:** Historical input only. The numerical comparison is explicitly
  unaudited and must not be cited as a project result.

## Transcript

### User

Asked how much energy a human brain would require if it operated as
inefficiently as current hyperscaler AI.

### Gemini: first answer

Gemini instead estimated the electrical power of a GPU cluster intended to
match an assumed brain-level operation rate. It used an assumed range of one to
6.24 exa-operations per second, approximately 78,000 H100 GPUs at 700 watts
each, and a facility PUE of 1.2 to claim roughly 65.5 megawatts. This did not
answer the question and mixed incomparable definitions of operations.

### User

Rejected the answer and clarified that the desired counterfactual was the
biological brain scaled by the operational inefficiency of contemporary AI.

### Gemini: revised answer

Gemini assumed:

- a brain power baseline of 20 watts;
- a brain throughput of one exa-operation per second;
- therefore 50,000,000 giga-operations per joule;
- H100 efficiencies of 2,800 giga-operations per joule for FP16 and 85 for
  FP64; and
- a facility PUE of 1.2.

It divided the assumed brain efficiency by the assumed accelerator efficiency
and multiplied the 20-watt baseline by that ratio and the PUE. The result was a
range of approximately 427 kilowatts to 14.1 megawatts.

### User

Asked to preserve the calculation so it could be developed rather than
recreated and allowed to drift.

### Gemini

Presented the 427-kilowatt to 14.1-megawatt range as locked-in constants.

## Audit warning

The calculation is not a valid project result yet. Its numerator and
denominator use operations that are not known to be semantically equivalent;
precision modes, sparsity, utilization, memory traffic, training versus
inference, and facility boundaries are mixed. The canonical energy model starts
from a measurement contract and uncertainty ranges rather than accepting this
ratio.

