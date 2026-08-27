<!-- SPDX-License-Identifier: CC-BY-SA-4.0 -->

# Official fine-grained research taxonomies

**Imported:** 2026-08-25
**Role:** immutable source material for the repository's fine-grained field
inventory. These classifications route searches; they do not establish
scientific evidence, completeness, quality, or priority.

This provenance index is project-authored and licensed under CC BY-SA 4.0.
The taxonomy files retain the rights and conditions recorded below.

## Files

### DFG source publication

- **Origin:** [Deutsche Forschungsgemeinschaft, Fachsystematik
  2024--2028](https://www.dfg.de/resource/blob/331944/fachsystematik-2024-2028-de.pdf)
- **Release represented:** DFG subject classification for 2024--2028, dated
  2024-04-23.
- **Local treatment:** link-only. The branded PDF and the original web-page
  capture are not redistributed in the current tree; only the minimal
  classification extract below is retained.
- **Use basis for the extract:** the [DFG copyright
  notice](https://www.dfg.de/de/service/kontakt/impressum) permits
  redistribution for scientific purposes with source attribution, while
  commercial use and logos remain restricted. This is not an open licence.

### DFG classification-only extract

- **File:** `dfg-fachsystematik-2024-2028.csv`
- **Origin:** extracted from the official DFG web table and checked against the
  official DFG PDF linked above.
- **Release represented:** the 49 review boards and 214 subjects needed by the
  project, without the unrelated member directory or site chrome present in
  the original page capture.
- **SHA-256:**
  `8fb17138df31c8032433ffe4530c92b4bfaafa64fb9e3b9fe0f64b3aa6951c6b`
- **Use basis:** same DFG scientific-redistribution and attribution terms as
  recorded above; not covered by the project licences and not granted for
  commercial reuse.

### ANZSRC source publication

- **Origin:** [Australian Bureau of Statistics, ANZSRC latest
  release](https://www.abs.gov.au/statistics/classifications/australian-and-new-zealand-standard-research-classification-anzsrc/latest-release)
  and its official corrected Fields of Research workbook.
- **Release represented:** ANZSRC 2020 Fields of Research data cube, corrected
  release dated 2025-10-24.
- **Local treatment:** link-only. The original workbook is not redistributed in
  the current tree because it includes branding and other presentation material
  outside the classification data needed by the project. Only the minimal
  classification extract below is retained.
- **Reuse basis:** ANZSRC classification data are attributed to the Australian
  Bureau of Statistics and Stats NZ and reused under CC BY 4.0, subject to the
  [ABS copyright terms](https://www.abs.gov.au/website-privacy-copyright-and-disclaimer)
  and [Stats NZ copyright terms](https://www.stats.govt.nz/about-us/copyright/).
  Logos, emblems, and other excluded third-party material are not reproduced or
  relicensed.

### ANZSRC classification-only extract

- **File:** `anzsrc2020_for.csv`
- **Origin:** extracted from the official corrected ANZSRC 2020 Fields of
  Research workbook described above.
- **Release represented:** all 23 divisions, 213 groups, and 1,967 fields,
  retaining only each record's level, code, name, and immediate parent.
- **SHA-256:**
  `fdd2e5fe4249dfce9de9c451febbdd55a6d2641ea9aae7994f0517e361465af0`
- **Licence and attribution:** CC BY 4.0. Source: Australian Bureau of
  Statistics and Stats NZ, *Australian and New Zealand Standard Research
  Classification (ANZSRC), 2020*. The extract is not covered by the project's
  EUPL or CC BY-SA grants.

### EuroSciVoc scheme snapshot

- **File:** `euroscivoc-v1.6.rdf`
- **Origin:** [EuroSciVoc persistent scheme URI](https://data.europa.eu/8mn/euroscivoc/40c0f173-baa3-48a3-9fe6-d6e8fb366a00),
  retrieved with RDF/XML content negotiation on 2026-08-25.
- **Release represented:** EuroSciVoc 1.6.0, issued 2025-09-24 by the
  Publications Office of the European Union.
- **Role:** authoritative scheme metadata, membership, and top concepts.
- **SHA-256:**
  `3cec494b498dc75969bbfeebb089e1b1fd94a9409172f8b70c214ddc29d772cd`
- **Licence:** CC BY 4.0 under the Publications Office/data.europa.eu
  EuroSciVoc reuse statement. Source: European Union, EuroSciVoc 1.6.0.

### EuroSciVoc concept hierarchy export

- **File:** `euroscivoc-v1.6-concepts.csv`
- **Origin:** [Publications Office CELLAR SPARQL endpoint](https://publications.europa.eu/webapi/rdf/sparql),
  queried on 2026-08-25 with `euroscivoc-concepts.rq`.
- **Release represented:** 1,064 concepts in EuroSciVoc 1.6.0, with their
  broader relation and English/German preferred labels.
- **SHA-256:**
  `726511759843412444377f962099cd310adb7d6ae4dd71285189e6cdc6de7414`
- **Licence:** CC BY 4.0 as a project extraction of EuroSciVoc. Source:
  European Union, EuroSciVoc 1.6.0; generated with the query below.

### EuroSciVoc extraction query

- **File:** `euroscivoc-concepts.rq`
- **Role:** versioned, reviewable SPARQL query that reproduces the preserved CSV.
- **SHA-256:**
  `3a65ac19720c48e1b95b4310ead15caf078b33bb746a025041de12d6def09fc3`
- **Licence:** project-authored query under EUPL-1.2; its output remains subject
  to the upstream EuroSciVoc CC BY 4.0 terms.

## Preservation contract

- The DFG and ANZSRC originals are retained as official links, not repository
  copies. Their classification-only CSV extracts are immutable inputs with
  recorded hashes. The EuroSciVoc RDF/CSV snapshots remain byte-for-byte
  preserved, and the SPARQL query is versioned beside the EuroSciVoc CSV so that
  export remains reproducible.
- Derived machine-readable data live under `research/taxonomies/`.
- Source hashes, hierarchy, code uniqueness, and declared counts are validated
  before derived data can pass repository checks.
- EuroSciVoc is the EU-level vocabulary; DFG adds German review granularity.
  ANZSRC is an independent disagreement detector, not a normative source for
  this project.
