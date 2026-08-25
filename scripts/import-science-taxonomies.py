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
import zipfile
from html.parser import HTMLParser
from pathlib import Path
from xml.etree import ElementTree as ET


ROOT = Path(__file__).resolve().parents[1]
SOURCE_DIR = ROOT / "sources" / "taxonomies" / "2026-08-25"
DEFAULT_OUTPUT = ROOT / "research" / "taxonomies" / "fine-grained-fields.json"

MAIN_NS = "http://schemas.openxmlformats.org/spreadsheetml/2006/main"
DOC_REL_NS = "http://schemas.openxmlformats.org/officeDocument/2006/relationships"
PKG_REL_NS = "http://schemas.openxmlformats.org/package/2006/relationships"
EUROSCIVOC_PREFIX = "http://data.europa.eu/8mn/euroscivoc/"


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def normalize(value: str) -> str:
    return re.sub(r"\s+", " ", value).strip()


class DfgTableParser(HTMLParser):
    """Collect exact code/name cells from the official DFG hierarchy table."""

    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.rows: list[list[str]] = []
        self.row: list[str] | None = None
        self.cell: list[str] | None = None
        self.skip_depth = 0

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        attributes = dict(attrs)
        if tag == "tr":
            self.row = []
        elif tag in {"td", "th"} and self.row is not None:
            self.cell = []
        elif tag == "span" and "sr-only" in (attributes.get("class") or "").split():
            self.skip_depth += 1

    def handle_endtag(self, tag: str) -> None:
        if tag == "span" and self.skip_depth:
            self.skip_depth -= 1
        elif tag in {"td", "th"} and self.row is not None and self.cell is not None:
            self.row.append(normalize("".join(self.cell)))
            self.cell = None
        elif tag == "tr" and self.row is not None:
            if self.row:
                self.rows.append(self.row)
            self.row = None
            self.cell = None

    def handle_data(self, data: str) -> None:
        if self.cell is not None and self.skip_depth == 0:
            self.cell.append(data)


def parse_dfg(path: Path) -> tuple[list[dict[str, str]], list[dict[str, str]]]:
    parser = DfgTableParser()
    parser.feed(path.read_text(encoding="utf-8"))

    boards: dict[str, str] = {}
    subjects: dict[str, str] = {}
    for cells in parser.rows:
        if len(cells) >= 2 and re.fullmatch(r"\d\.\d{2}", cells[0]):
            boards.setdefault(cells[0], cells[1])
        if len(cells) >= 2 and re.fullmatch(r"\d\.\d{2}-\d{2}", cells[0]):
            subjects.setdefault(cells[0], cells[1])

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


def shared_strings(archive: zipfile.ZipFile) -> list[str]:
    try:
        root = ET.fromstring(archive.read("xl/sharedStrings.xml"))
    except KeyError:
        return []
    return [
        "".join(node.text or "" for node in item.iter(f"{{{MAIN_NS}}}t"))
        for item in root.findall(f"{{{MAIN_NS}}}si")
    ]


def sheet_paths(archive: zipfile.ZipFile) -> dict[str, str]:
    workbook = ET.fromstring(archive.read("xl/workbook.xml"))
    relations = ET.fromstring(archive.read("xl/_rels/workbook.xml.rels"))
    targets = {
        relation.attrib["Id"]: relation.attrib["Target"]
        for relation in relations.findall(f"{{{PKG_REL_NS}}}Relationship")
    }
    result: dict[str, str] = {}
    for sheet in workbook.findall(f".//{{{MAIN_NS}}}sheet"):
        relation_id = sheet.attrib[f"{{{DOC_REL_NS}}}id"]
        target = targets[relation_id].replace("\\", "/")
        if target.startswith("/"):
            target = target.lstrip("/")
        elif not target.startswith("xl/"):
            target = f"xl/{target}"
        result[sheet.attrib["name"]] = target
    return result


def sheet_rows(
    archive: zipfile.ZipFile,
    path: str,
    strings: list[str],
) -> list[dict[str, str]]:
    root = ET.fromstring(archive.read(path))
    rows: list[dict[str, str]] = []
    for row in root.findall(f".//{{{MAIN_NS}}}row"):
        values: dict[str, str] = {}
        for cell in row.findall(f"{{{MAIN_NS}}}c"):
            reference = cell.attrib.get("r", "")
            match = re.match(r"([A-Z]+)", reference)
            if not match:
                continue
            column = match.group(1)
            cell_type = cell.attrib.get("t")
            value_node = cell.find(f"{{{MAIN_NS}}}v")
            if cell_type == "inlineStr":
                value = "".join(
                    node.text or ""
                    for node in cell.iter(f"{{{MAIN_NS}}}t")
                )
            elif value_node is None:
                value = ""
            elif cell_type == "s":
                value = strings[int(value_node.text or "0")]
            else:
                value = value_node.text or ""
            values[column] = normalize(value)
        if values:
            rows.append(values)
    return rows


def parse_anzsrc(
    path: Path,
) -> tuple[list[dict[str, str]], list[dict[str, str]], list[dict[str, str]]]:
    with zipfile.ZipFile(path) as archive:
        strings = shared_strings(archive)
        paths = sheet_paths(archive)
        hierarchy = sheet_rows(archive, paths["Table 2"], strings)
        fields_table = sheet_rows(archive, paths["Table 3"], strings)

    divisions: dict[str, str] = {}
    groups: dict[str, str] = {}
    fields: dict[str, str] = {}
    for row in hierarchy:
        if re.fullmatch(r"\d{2}", row.get("A", "")) and row.get("B"):
            divisions[row["A"]] = row["B"]
        if re.fullmatch(r"\d{4}", row.get("B", "")) and row.get("C"):
            groups[row["B"]] = row["C"]
    for row in fields_table:
        if re.fullmatch(r"\d{6}", row.get("C", "")) and row.get("D"):
            fields[row["C"]] = row["D"]

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

    dfg_html = SOURCE_DIR / "dfg-fachsystematik-web.html"
    dfg_pdf = SOURCE_DIR / "dfg-fachsystematik-2024-2028-de.pdf"
    anzsrc_workbook = SOURCE_DIR / "anzsrc2020_for.xlsx"
    euroscivoc_rdf = SOURCE_DIR / "euroscivoc-v1.6.rdf"
    euroscivoc_csv = SOURCE_DIR / "euroscivoc-v1.6-concepts.csv"
    euroscivoc_query = SOURCE_DIR / "euroscivoc-concepts.rq"
    dfg_boards, dfg_subjects = parse_dfg(dfg_html)
    anzsrc_divisions, anzsrc_groups, anzsrc_fields = parse_anzsrc(anzsrc_workbook)
    euroscivoc_concepts = parse_euroscivoc(euroscivoc_csv)

    payload = {
        "schemaVersion": 1,
        "asOf": "2026-08-25",
        "scope": (
            "Exact taxonomy inventory only. Fine-grained evidence coverage is "
            "not inherited from parent classifications and is assessed separately."
        ),
        "sources": {
            "dfgPdf": {
                "path": str(dfg_pdf.relative_to(ROOT)).replace("\\", "/"),
                "sha256": sha256(dfg_pdf),
            },
            "dfgHtml": {
                "path": str(dfg_html.relative_to(ROOT)).replace("\\", "/"),
                "sha256": sha256(dfg_html),
            },
            "anzsrcWorkbook": {
                "path": str(anzsrc_workbook.relative_to(ROOT)).replace("\\", "/"),
                "sha256": sha256(anzsrc_workbook),
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
