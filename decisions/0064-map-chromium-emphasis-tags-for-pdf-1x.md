# 0064 — Map Chromium emphasis tags for PDF 1.x

- **Status:** accepted
- **Date:** 2026-09-04
- **Related:** [0050](0050-review-the-book-and-pdf-as-one-publication.md),
  [issue #17](https://github.com/lusoris/20-watts-was-enough/issues/17)

## Context

The pinned Chromium renderer preserves HTML `strong` and `em` elements as the
structure types `Strong` and `Em`. Those names are defined for PDF 2.0, but the
renderer writes a PDF 1.4 header and does not provide the PDF 1.x role mapping
that a consumer needs to interpret them. Poppler 26.08.0 therefore reports one
diagnostic for each of the 613 `Strong` and 14 `Em` elements in the current
book. Changing the header alone would misrepresent the rest of the renderer's
output, while replacing the source elements with neutral spans would discard
useful HTML semantics.

The structure-tree producer and consumer behaviour is traceable in
[Chromium's PDF tag mapping](https://chromium.googlesource.com/chromium/src/+/38c5d51380748a950c6001776b5c787255fd865d),
[Skia's structure-tree writer](https://skia.googlesource.com/skia/+/124b17e6bb649e7583b0076834125425fd6a2bc1/src/pdf/SkPDFTag.cpp#656)
and
[Poppler's structure-type parser](https://gitlab.freedesktop.org/poppler/poppler/-/blob/e8631df8847c3d3c9f959be3d449b75c5afd2b7e/poppler/StructElement.cc#L918-939).
These implementation sources define the compatibility problem; they do not
establish accessibility conformance.

## Decision

1. Keep the project-authored `strong` and `em` elements in the canonical HTML.
   For the pinned PDF 1.x output only, add the compatibility mappings
   `Strong` to `Span` and `Em` to `Span` in the document's `RoleMap`. The
   mappings make the custom structure names consumable in PDF 1.x; they do not
   assert that emphasis is semantically equivalent to an unqualified span.
2. Apply the mapping after the existing deterministic Chromium metadata
   normalisation. Redefine the existing `StructTreeRoot` in one incremental,
   classic-xref revision rather than rewriting content streams or unrelated
   objects.
3. Parse and check the final `startxref`, xref subsections, trailer, catalogue
   and structure-root references before writing. Require the pinned PDF 1.4
   header without a catalogue version override, and reproduce the complete
   finaliser-owned suffix byte for byte when validating it. Bound input and
   output size, object count and revision depth. Reject encryption, xref
   streams, malformed or competing role maps, pre-existing unrecognised
   incremental updates and the unsupported `Aside` structure type.
4. Require repeated finalisation to return identical bytes. The two-build PDF
   gate must still agree byte for byte, and the Poppler sentinel must preserve
   page count, PDF version, tagged state, extracted text and its five existing
   nonlinear reading-order defects while recording no structure diagnostics.
5. Keep those five defects as `known-debt`. This compatibility repair is not a
   PDF/UA, WCAG, assistive-technology or general reading-order conformance
   claim.

## Consequences

- Poppler no longer treats the current emphasis elements as unknown PDF 1.x
  structure types, without changing page content or the canonical HTML.
- The retained PDF contains one deterministic incremental revision. A future
  renderer that emits PDF 2.0, xref streams, `Aside` or its own role map must be
  reviewed instead of being silently rewritten.
- Issue #17 remains open for the five content-order sentinels and for broader
  assistive-technology review.

## Supersession

Supersede this record if the pinned renderer emits a consumer-compatible
structure tree without post-processing, the publication moves to a verified
PDF 2.0 pipeline, or evidence shows that these compatibility mappings obscure
meaning for supported readers.
