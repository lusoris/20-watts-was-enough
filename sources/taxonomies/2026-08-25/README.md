# Official fine-grained research taxonomies

**Imported:** 2026-08-25
**Role:** immutable source material for the repository's fine-grained field
inventory. These classifications route searches; they do not establish
scientific evidence, completeness, quality, or priority.

## Files

### DFG PDF

- **File:** `dfg-fachsystematik-2024-2028-de.pdf`
- **Origin:** [Deutsche Forschungsgemeinschaft](https://www.dfg.de/resource/blob/331944/fachsystematik-2024-2028-de.pdf)
- **Release represented:** DFG subject classification for 2024--2028, dated
  2024-04-23.
- **SHA-256:**
  `848d239a9d9670f562437a51a8c5cbd594ea2c042be41b798b87e2161e4d28fa`

### DFG web table

- **File:** `dfg-fachsystematik-web.html`
- **Origin:** [DFG subject table](https://www.dfg.de/de/ueber-uns/gremien/fachkollegien/fachsystematik)
- **Release represented:** official web rendering of the same 2024--2028
  classification, retrieved 2026-08-25.
- **SHA-256:**
  `b152c7eef223230eb121f85a16000bbe84b539f7de7a62286ece6d5472d7c317`

### ANZSRC data cube

- **File:** `anzsrc2020_for.xlsx`
- **Origin:** [Australian Bureau of Statistics](https://www.abs.gov.au/statistics/classifications/australian-and-new-zealand-standard-research-classification-anzsrc/2020/anzsrc2020_for.xlsx)
- **Release represented:** ANZSRC 2020 Fields of Research data cube, corrected
  release dated 2025-10-24.
- **SHA-256:**
  `92b94664eb1e43db1cbcaeb54e60575e3f8573cd10e5e4bb3a9c806cbe462e35`

### EuroSciVoc scheme snapshot

- **File:** `euroscivoc-v1.6.rdf`
- **Origin:** [EuroSciVoc persistent scheme URI](https://data.europa.eu/8mn/euroscivoc/40c0f173-baa3-48a3-9fe6-d6e8fb366a00),
  retrieved with RDF/XML content negotiation on 2026-08-25.
- **Release represented:** EuroSciVoc 1.6.0, issued 2025-09-24 by the
  Publications Office of the European Union.
- **Role:** authoritative scheme metadata, membership, and top concepts.
- **SHA-256:**
  `3cec494b498dc75969bbfeebb089e1b1fd94a9409172f8b70c214ddc29d772cd`

### EuroSciVoc concept hierarchy export

- **File:** `euroscivoc-v1.6-concepts.csv`
- **Origin:** [Publications Office CELLAR SPARQL endpoint](https://publications.europa.eu/webapi/rdf/sparql),
  queried on 2026-08-25 with `euroscivoc-concepts.rq`.
- **Release represented:** 1,064 concepts in EuroSciVoc 1.6.0, with their
  broader relation and English/German preferred labels.
- **SHA-256:**
  `726511759843412444377f962099cd310adb7d6ae4dd71285189e6cdc6de7414`

### EuroSciVoc extraction query

- **File:** `euroscivoc-concepts.rq`
- **Role:** versioned, reviewable SPARQL query that reproduces the preserved CSV.
- **SHA-256:**
  `8c921d5663f6dbe3faaaea23a6f98096c9ecf77cce7f3db5b007ac5cdc8ce2cf`

## Preservation contract

- The five imported snapshots remain byte-for-byte untouched. The SPARQL query
  is versioned beside them so the official export is reproducible.
- Derived machine-readable data live under `research/taxonomies/`.
- Source hashes, hierarchy, code uniqueness, and declared counts are validated
  before derived data can pass repository checks.
- EuroSciVoc is the EU-level vocabulary; DFG adds German review granularity.
  ANZSRC is an independent disagreement detector, not a normative source for
  this project.
