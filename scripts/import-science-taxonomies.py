#!/usr/bin/env python3
"""Derive exact DFG, ANZSRC, and EuroSciVoc hierarchies from official sources.

The importer uses only Python's standard library. It does not assign research
coverage: inventory membership and evidence review are deliberately separate.
"""

from __future__ import annotations

import argparse
import csv
import hashlib
import json
import re
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
SOURCE_DIR = ROOT / "sources" / "taxonomies" / "2026-08-25"
DEFAULT_OUTPUT = ROOT / "research" / "taxonomies" / "fine-grained-fields.json"

EUROSCIVOC_PREFIX = "http://data.europa.eu/8mn/euroscivoc/"


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def normalize(value: str) -> str:
    return re.sub(r"\s+", " ", value).strip()


def parse_dfg(path: Path) -> tuple[list[dict[str, str]], list[dict[str, str]]]:
    boards: dict[str, str] = {}
    subjects: dict[str, str] = {}
    with path.open("r", encoding="utf-8-sig", newline="") as handle:
        reader = csv.DictReader(handle)
        expected_columns = {"kind", "code", "name", "reviewBoard"}
        if set(reader.fieldnames or []) != expected_columns:
            raise ValueError(
                f"DFG extract columns differ from {sorted(expected_columns)}"
            )
        for row in reader:
            kind = normalize(row["kind"])
            code = normalize(row["code"])
            name = normalize(row["name"])
            review_board = normalize(row["reviewBoard"])
            if kind == "review-board" and re.fullmatch(r"\d\.\d{2}", code):
                if review_board:
                    raise ValueError(f"DFG review board unexpectedly has a parent: {code}")
                boards.setdefault(code, name)
            elif kind == "subject" and re.fullmatch(r"\d\.\d{2}-\d{2}", code):
                if review_board != code[:4]:
                    raise ValueError(f"DFG subject has inconsistent review board: {code}")
                subjects.setdefault(code, name)
            else:
                raise ValueError(f"DFG extract contains an invalid row: {row}")

    if len(boards) != 49 or len(subjects) != 214:
        raise ValueError(
            f"DFG extraction expected 49 boards/214 subjects, got "
            f"{len(boards)}/{len(subjects)}"
        )

    board_rows = [
        {"code": code, "name": name}
        for code, name in sorted(boards.items())
    ]
    subject_rows = [
        {"code": code, "name": name, "reviewBoard": code[:4]}
        for code, name in sorted(subjects.items())
    ]
    return board_rows, subject_rows


def parse_anzsrc(
    path: Path,
) -> tuple[list[dict[str, str]], list[dict[str, str]], list[dict[str, str]]]:
    divisions: dict[str, str] = {}
    groups: dict[str, str] = {}
    fields: dict[str, str] = {}
    with path.open("r", encoding="utf-8-sig", newline="") as handle:
        reader = csv.DictReader(handle)
        expected_columns = {"kind", "code", "name", "parent"}
        if set(reader.fieldnames or []) != expected_columns:
            raise ValueError(
                f"ANZSRC extract columns differ from {sorted(expected_columns)}"
            )
        for row in reader:
            kind = normalize(row["kind"])
            code = normalize(row["code"])
            name = normalize(row["name"])
            parent = normalize(row["parent"])
            if kind == "division" and re.fullmatch(r"\d{2}", code):
                if parent:
                    raise ValueError(f"ANZSRC division unexpectedly has a parent: {code}")
                divisions[code] = name
            elif kind == "group" and re.fullmatch(r"\d{4}", code):
                if parent != code[:2]:
                    raise ValueError(f"ANZSRC group has inconsistent division: {code}")
                groups[code] = name
            elif kind == "field" and re.fullmatch(r"\d{6}", code):
                if parent != code[:4]:
                    raise ValueError(f"ANZSRC field has inconsistent group: {code}")
                fields[code] = name
            else:
                raise ValueError(f"ANZSRC extract contains an invalid row: {row}")

    if (len(divisions), len(groups), len(fields)) != (23, 213, 1967):
        raise ValueError(
            "ANZSRC extraction expected 23 divisions/213 groups/1967 fields, "
            f"got {len(divisions)}/{len(groups)}/{len(fields)}"
        )

    division_rows = [
        {"code": code, "name": name}
        for code, name in sorted(divisions.items())
    ]
    group_rows = [
        {"code": code, "name": name, "division": code[:2]}
        for code, name in sorted(groups.items())
    ]
    field_rows = [
        {"code": code, "name": name, "group": code[:4]}
        for code, name in sorted(fields.items())
    ]
    return division_rows, group_rows, field_rows


def parse_euroscivoc(path: Path) -> list[dict[str, str | int | None]]:
    """Parse the deterministic Publications Office SPARQL CSV export."""

    concepts: dict[str, dict[str, str | int | None]] = {}
    with path.open("r", encoding="utf-8-sig", newline="") as handle:
        reader = csv.DictReader(handle)
        expected_columns = {"concept", "broader", "enLabel", "deLabel"}
        if set(reader.fieldnames or []) != expected_columns:
            raise ValueError(
                f"EuroSciVoc export columns differ from {sorted(expected_columns)}"
            )
        for row in reader:
            uri = normalize(row["concept"])
            broader_uri = normalize(row["broader"])
            name = normalize(row["enLabel"])
            name_de = normalize(row["deLabel"])
            if not uri.startswith(EUROSCIVOC_PREFIX):
                raise ValueError(f"EuroSciVoc concept has unexpected URI: {uri}")
            concept_id = uri.removeprefix(EUROSCIVOC_PREFIX)
            if concept_id in concepts:
                raise ValueError(f"EuroSciVoc concept is duplicated: {concept_id}")
            if not name or not name_de:
                raise ValueError(f"EuroSciVoc concept lacks an English/German label: {uri}")
            broader = None
            if broader_uri:
                if not broader_uri.startswith(EUROSCIVOC_PREFIX):
                    raise ValueError(
                        f"EuroSciVoc parent has unexpected URI: {broader_uri}"
                    )
                broader = broader_uri.removeprefix(EUROSCIVOC_PREFIX)
            concepts[concept_id] = {
                "id": concept_id,
                "uri": uri,
                "name": name,
                "nameDe": name_de,
                "broader": broader,
                "depth": -1,
            }

    if len(concepts) != 1064:
        raise ValueError(
            f"EuroSciVoc extraction expected 1064 concepts, got {len(concepts)}"
        )

    visiting: set[str] = set()

    def assign_depth(concept_id: str) -> int:
        concept = concepts[concept_id]
        current = int(concept["depth"])
        if current >= 0:
            return current
        if concept_id in visiting:
            raise ValueError(f"EuroSciVoc cycle reaches {concept_id}")
        visiting.add(concept_id)
        broader = concept["broader"]
        if broader is None:
            depth = 0
        else:
            parent_id = str(broader)
            if parent_id not in concepts:
                raise ValueError(
                    f"EuroSciVoc concept {concept_id} has missing parent {parent_id}"
                )
            depth = assign_depth(parent_id) + 1
        visiting.remove(concept_id)
        concept["depth"] = depth
        return depth

    for concept_id in concepts:
        assign_depth(concept_id)

    top_count = sum(concept["depth"] == 0 for concept in concepts.values())
    if top_count != 6:
        raise ValueError(f"EuroSciVoc expected 6 top concepts, got {top_count}")
    return [concepts[key] for key in sorted(concepts)]


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--output", type=Path, default=DEFAULT_OUTPUT)
    parser.add_argument(
        "--check",
        action="store_true",
        help="fail if the derived JSON differs from the preserved source files",
    )
    args = parser.parse_args()

    dfg_extract = SOURCE_DIR / "dfg-fachsystematik-2024-2028.csv"
    anzsrc_extract = SOURCE_DIR / "anzsrc2020_for.csv"
    euroscivoc_rdf = SOURCE_DIR / "euroscivoc-v1.6.rdf"
    euroscivoc_csv = SOURCE_DIR / "euroscivoc-v1.6-concepts.csv"
    euroscivoc_query = SOURCE_DIR / "euroscivoc-concepts.rq"
    dfg_boards, dfg_subjects = parse_dfg(dfg_extract)
    anzsrc_divisions, anzsrc_groups, anzsrc_fields = parse_anzsrc(anzsrc_extract)
    euroscivoc_concepts = parse_euroscivoc(euroscivoc_csv)

    payload = {
        "schemaVersion": 1,
        "asOf": "2026-08-25",
        "scope": (
            "Exact taxonomy inventory only. Fine-grained evidence coverage is "
            "not inherited from parent classifications and is assessed separately."
        ),
        "sources": {
            "dfgExtract": {
                "path": str(dfg_extract.relative_to(ROOT)).replace("\\", "/"),
                "sha256": sha256(dfg_extract),
            },
            "anzsrcExtract": {
                "path": str(anzsrc_extract.relative_to(ROOT)).replace("\\", "/"),
                "sha256": sha256(anzsrc_extract),
            },
            "euroscivocRdf": {
                "path": str(euroscivoc_rdf.relative_to(ROOT)).replace("\\", "/"),
                "sha256": sha256(euroscivoc_rdf),
            },
            "euroscivocConceptsCsv": {
                "path": str(euroscivoc_csv.relative_to(ROOT)).replace("\\", "/"),
                "sha256": sha256(euroscivoc_csv),
            },
            "euroscivocQuery": {
                "path": str(euroscivoc_query.relative_to(ROOT)).replace("\\", "/"),
                "sha256": sha256(euroscivoc_query),
            },
        },
        "dfg": {
            "edition": "2024-2028",
            "reviewBoards": dfg_boards,
            "subjects": dfg_subjects,
        },
        "anzsrc": {
            "edition": "2020, corrected 2025-10-24",
            "divisions": anzsrc_divisions,
            "groups": anzsrc_groups,
            "fields": anzsrc_fields,
        },
        "euroscivoc": {
            "edition": "1.6.0",
            "schemeUri": (
                "http://data.europa.eu/8mn/euroscivoc/"
                "40c0f173-baa3-48a3-9fe6-d6e8fb366a00"
            ),
            "concepts": euroscivoc_concepts,
        },
    }
    rendered = json.dumps(payload, ensure_ascii=False, indent=2) + "\n"
    summary = (
        f"{len(dfg_subjects)} DFG subjects, {len(anzsrc_groups)} ANZSRC groups, "
        f"{len(anzsrc_fields)} ANZSRC fields, "
        f"{len(euroscivoc_concepts)} EuroSciVoc concepts"
    )
    if args.check:
        if not args.output.exists() or args.output.read_text(encoding="utf-8") != rendered:
            raise SystemExit(
                f"{args.output} is stale; run scripts/import-science-taxonomies.py"
            )
        print(f"Fine-grained taxonomy JSON is current: {summary}.")
        return

    args.output.parent.mkdir(parents=True, exist_ok=True)
    # Keep generated Git artifacts byte-stable across Windows and Unix.
    with args.output.open("w", encoding="utf-8", newline="\n") as output:
        output.write(rendered)
    print(f"Wrote {args.output}: {summary}.")


if __name__ == "__main__":
    main()
