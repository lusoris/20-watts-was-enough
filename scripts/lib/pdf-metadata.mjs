const chromiumTimestampPattern = /\/(CreationDate|ModDate) \(D:\d{14}\+00'00'\)/gu;
const chromiumStructureIdPattern = /\(node\d{8}\)/gu;
const pdfWhitespacePattern = String.raw`[\x00\x09\x0a\x0c\x0d\x20]`;
const pdfNameBoundary = String.raw`(?=[\x00\x09\x0a\x0c\x0d\x20/<>{}\[\]()%])`;
const roleMapEntry = "/RoleMap <</Strong /Span /Em /Span>>";
const maximumPdfBytes = 256 * 1024 * 1024;
const maximumXrefEntries = 100_000;
const maximumXrefRevisions = 8;

function invariant(condition, message) {
  if (!condition) throw new Error(message);
}

function pdfByteLimit(options) {
  if (options === undefined) return maximumPdfBytes;
  invariant(
    options !== null && typeof options === "object" && !Array.isArray(options),
    "PDF normalization options must be an object.",
  );
  const keys = Object.keys(options);
  invariant(
    keys.length <= 1 && keys.every((key) => key === "maximumBytes"),
    "PDF normalization options contain an unsupported field.",
  );
  const maximumBytes = options.maximumBytes ?? maximumPdfBytes;
  invariant(
    Number.isSafeInteger(maximumBytes)
      && maximumBytes > 0
      && maximumBytes <= maximumPdfBytes,
    `PDF maximumBytes must be an integer between 1 and ${maximumPdfBytes}.`,
  );
  return maximumBytes;
}

function pdfTimestamp(releaseDate) {
  invariant(
    typeof releaseDate === "string" && /^\d{4}-\d{2}-\d{2}$/u.test(releaseDate),
    "PDF release date must use YYYY-MM-DD.",
  );
  const parsed = new Date(`${releaseDate}T00:00:00Z`);
  invariant(
    !Number.isNaN(parsed.valueOf()) && parsed.toISOString().slice(0, 10) === releaseDate,
    "PDF release date must be a real calendar date.",
  );
  return `D:${releaseDate.replaceAll("-", "")}000000+00'00'`;
}

function isPdfWhitespace(character) {
  return character !== undefined && "\0\t\n\f\r ".includes(character);
}

function skipPdfWhitespaceOnly(source, initialCursor) {
  let cursor = initialCursor;
  while (cursor < source.length && isPdfWhitespace(source[cursor])) cursor += 1;
  return cursor;
}

function skipPdfWhitespace(source, initialCursor) {
  let cursor = initialCursor;
  while (cursor < source.length) {
    if (isPdfWhitespace(source[cursor])) {
      cursor += 1;
      continue;
    }
    if (source[cursor] !== "%") break;
    while (cursor < source.length && source[cursor] !== "\n" && source[cursor] !== "\r") {
      cursor += 1;
    }
  }
  return cursor;
}

function readPdfLine(source, initialCursor) {
  let cursor = initialCursor;
  while (cursor < source.length && source[cursor] !== "\n" && source[cursor] !== "\r") {
    cursor += 1;
  }
  const line = source.slice(initialCursor, cursor);
  if (source[cursor] === "\r") cursor += 1;
  if (source[cursor] === "\n") cursor += 1;
  return { cursor, line };
}

function skipPdfLiteralString(source, initialCursor) {
  let cursor = initialCursor + 1;
  let depth = 1;
  while (cursor < source.length && depth > 0) {
    if (source[cursor] === "\\") {
      cursor += 2;
      continue;
    }
    if (source[cursor] === "(") depth += 1;
    if (source[cursor] === ")") depth -= 1;
    cursor += 1;
  }
  invariant(depth === 0, "PDF dictionary contains an unterminated literal string.");
  return cursor;
}

function readPdfDictionary(source, initialCursor) {
  invariant(source.startsWith("<<", initialCursor), "Expected a direct PDF dictionary.");
  let cursor = initialCursor;
  let depth = 0;
  while (cursor < source.length) {
    if (source[cursor] === "%") {
      cursor = skipPdfWhitespace(source, cursor);
      continue;
    }
    if (source[cursor] === "(") {
      cursor = skipPdfLiteralString(source, cursor);
      continue;
    }
    if (source.startsWith("<<", cursor)) {
      depth += 1;
      cursor += 2;
      continue;
    }
    if (source.startsWith(">>", cursor)) {
      depth -= 1;
      cursor += 2;
      invariant(depth >= 0, "PDF dictionary nesting became negative.");
      if (depth === 0) {
        return { end: cursor, text: source.slice(initialCursor, cursor) };
      }
      continue;
    }
    if (source[cursor] === "<") {
      const end = source.indexOf(">", cursor + 1);
      invariant(end >= 0, "PDF dictionary contains an unterminated hexadecimal string.");
      cursor = end + 1;
      continue;
    }
    cursor += 1;
  }
  throw new Error("PDF dictionary is unterminated.");
}

function skipPdfArray(source, initialCursor) {
  let cursor = initialCursor + 1;
  let depth = 1;
  while (cursor < source.length && depth > 0) {
    if (source[cursor] === "%") {
      cursor = skipPdfWhitespace(source, cursor);
      continue;
    }
    if (source[cursor] === "(") {
      cursor = skipPdfLiteralString(source, cursor);
      continue;
    }
    if (source.startsWith("<<", cursor)) {
      cursor = readPdfDictionary(source, cursor).end;
      continue;
    }
    if (source[cursor] === "<") {
      const end = source.indexOf(">", cursor + 1);
      invariant(end >= 0, "PDF array contains an unterminated hexadecimal string.");
      cursor = end + 1;
      continue;
    }
    if (source[cursor] === "[") depth += 1;
    if (source[cursor] === "]") depth -= 1;
    cursor += 1;
  }
  invariant(depth === 0, "PDF dictionary contains an unterminated array.");
  return cursor;
}

function decodePdfName(token, label) {
  let decoded = "";
  for (let index = 0; index < token.length;) {
    if (token[index] !== "#") {
      decoded += token[index];
      index += 1;
      continue;
    }
    const hexadecimal = token.slice(index + 1, index + 3);
    invariant(/^[0-9a-f]{2}$/iu.test(hexadecimal),
      `PDF ${label} contains a malformed name escape.`);
    decoded += String.fromCharCode(Number.parseInt(hexadecimal, 16));
    index += 3;
  }
  return decoded;
}

function isPdfDelimiter(character) {
  return character === undefined
    || isPdfWhitespace(character)
    || "()<>[]{}/%".includes(character);
}

function trimPdfWhitespace(source) {
  let start = 0;
  let end = source.length;
  while (start < end && isPdfWhitespace(source[start])) start += 1;
  while (end > start && isPdfWhitespace(source[end - 1])) end -= 1;
  return source.slice(start, end);
}

function readPdfName(source, initialCursor, label) {
  invariant(source[initialCursor] === "/", `PDF ${label} must use a name key.`);
  let cursor = initialCursor + 1;
  while (!isPdfDelimiter(source[cursor])) cursor += 1;
  invariant(cursor > initialCursor + 1, `PDF ${label} contains an empty name.`);
  const raw = source.slice(initialCursor + 1, cursor);
  const value = decodePdfName(raw, label);
  invariant(raw === value, `PDF ${label} must use canonical unescaped names.`);
  return { cursor, value };
}

function skipPdfHexadecimalString(source, initialCursor, label) {
  const end = source.indexOf(">", initialCursor + 1);
  invariant(end >= 0, `PDF ${label} contains an unterminated hexadecimal string.`);
  return end + 1;
}

function readPdfToken(source, initialCursor, label) {
  let cursor = initialCursor;
  while (!isPdfDelimiter(source[cursor])) cursor += 1;
  invariant(cursor > initialCursor, `PDF ${label} contains an empty token.`);
  return { cursor, value: source.slice(initialCursor, cursor) };
}

function readPdfValue(source, initialCursor, label) {
  const cursor = skipPdfWhitespace(source, initialCursor);
  invariant(cursor < source.length, `PDF ${label} value is missing.`);
  if (source[cursor] === "/") {
    const name = readPdfName(source, cursor, label);
    return { cursor: name.cursor, kind: "name", value: name.value };
  }
  if (source.startsWith("<<", cursor)) {
    const dictionary = readPdfDictionary(source, cursor);
    return { cursor: dictionary.end, kind: "dictionary", value: dictionary.text };
  }
  if (source[cursor] === "[") {
    return { cursor: skipPdfArray(source, cursor), kind: "array" };
  }
  if (source[cursor] === "(") {
    return { cursor: skipPdfLiteralString(source, cursor), kind: "string" };
  }
  if (source[cursor] === "<") {
    return { cursor: skipPdfHexadecimalString(source, cursor, label), kind: "hexadecimal" };
  }
  const reference = new RegExp(
    `^(\\d+)${pdfWhitespacePattern}+(\\d+)${pdfWhitespacePattern}+R${pdfNameBoundary}`,
    "u",
  )
    .exec(source.slice(cursor));
  if (reference !== null) {
    return {
      cursor: cursor + reference[0].length,
      generation: Number(reference[2]),
      kind: "reference",
      number: Number(reference[1]),
    };
  }
  const token = readPdfToken(source, cursor, label);
  return { cursor: token.cursor, kind: "token", value: token.value };
}

function parsePdfDictionaryEntries(dictionary, label) {
  const entries = [];
  let cursor = 2;
  while (cursor < dictionary.length - 2) {
    cursor = skipPdfWhitespace(dictionary, cursor);
    if (cursor >= dictionary.length - 2) break;
    const key = readPdfName(dictionary, cursor, label);
    const value = readPdfValue(dictionary, key.cursor, `${label} ${key.value}`);
    entries.push({ key: key.value, value });
    cursor = value.cursor;
  }
  return entries;
}

function dictionaryEntry(entries, key, label, required = true) {
  const matches = entries.filter((entry) => entry.key === key);
  invariant(matches.length <= 1, `PDF ${label} ${key} entry must be unique.`);
  invariant(!required || matches.length === 1, `PDF ${label} ${key} entry is missing.`);
  return matches[0]?.value ?? null;
}

function decimalValue(value, label) {
  invariant(value?.kind === "token" && /^\d+$/u.test(value.value),
    `PDF ${label} must be a non-negative decimal integer.`);
  return Number(value.value);
}

function referenceValue(value, label) {
  invariant(value?.kind === "reference", `PDF ${label} must be an indirect reference.`);
  return { generation: value.generation, number: value.number };
}

function parseTrailer(dictionary) {
  const entries = parsePdfDictionaryEntries(dictionary, "trailer");
  invariant(dictionaryEntry(entries, "Encrypt", "trailer", false) === null,
    "Encrypted PDFs are not supported by the PDF structure finaliser.");
  invariant(dictionaryEntry(entries, "XRefStm", "trailer", false) === null,
    "XRef streams are not supported by the PDF structure finaliser.");
  const previous = dictionaryEntry(entries, "Prev", "trailer", false);
  return {
    previous: previous === null ? null : decimalValue(previous, "trailer Prev"),
    root: referenceValue(dictionaryEntry(entries, "Root", "trailer"), "trailer Root"),
    size: decimalValue(dictionaryEntry(entries, "Size", "trailer"), "trailer Size"),
  };
}

function readXrefTerminator(source, dictionaryEnd, offset) {
  let cursor = skipPdfWhitespaceOnly(source, dictionaryEnd);
  invariant(source.startsWith("startxref", cursor)
    && isPdfWhitespace(source[cursor + "startxref".length]),
  "PDF xref trailer has no separated startxref marker.");
  cursor += "startxref".length;
  const offsetStart = skipPdfWhitespaceOnly(source, cursor);
  invariant(offsetStart > cursor, "PDF startxref value is not separated from its marker.");
  const recordedOffset = readPdfToken(source, offsetStart, "startxref");
  invariant(/^\d+$/u.test(recordedOffset.value)
    && Number(recordedOffset.value) === offset,
  "PDF xref trailer does not point back to its own table.");
  const eofStart = skipPdfWhitespaceOnly(source, recordedOffset.cursor);
  invariant(eofStart > recordedOffset.cursor && source.startsWith("%%EOF", eofStart),
    "PDF xref trailer has no separated %%EOF marker.");
  const afterEof = eofStart + "%%EOF".length;
  invariant(isPdfDelimiter(source[afterEof]), "PDF %%EOF marker is not delimited.");
  return skipPdfWhitespaceOnly(source, afterEof);
}

function parseXrefRevision(source, offset) {
  invariant(Number.isSafeInteger(offset) && offset >= 0 && offset < source.length,
    "PDF startxref offset is outside the artifact.");
  invariant(source.startsWith("xref", offset),
    "PDF structure finalisation supports bounded classic xref tables only.");
  let cursor = skipPdfWhitespace(source, offset + 4);
  const entries = new Map();
  const seenObjects = new Set();
  let entryCount = 0;
  while (!source.startsWith("trailer", cursor)) {
    const subsection = readPdfLine(source, cursor);
    cursor = skipPdfWhitespace(source, subsection.cursor);
    const header = new RegExp(
      `^(\\d+)${pdfWhitespacePattern}+(\\d+)$`,
      "u",
    ).exec(trimPdfWhitespace(subsection.line));
    invariant(header !== null, "PDF xref subsection header is malformed.");
    const firstObject = Number(header[1]);
    const count = Number(header[2]);
    invariant(Number.isSafeInteger(firstObject) && Number.isSafeInteger(count) && count > 0,
      "PDF xref subsection bounds are invalid.");
    entryCount += count;
    invariant(entryCount <= maximumXrefEntries, "PDF xref entry bound was exceeded.");
    invariant(firstObject + count <= maximumXrefEntries,
      "PDF xref object-number bound was exceeded.");
    for (let index = 0; index < count; index += 1) {
      const entryLine = readPdfLine(source, cursor);
      cursor = entryLine.cursor;
      const entry = new RegExp(
        `^(\\d{10})${pdfWhitespacePattern}(\\d{5})${pdfWhitespacePattern}`
          + `([fn])${pdfWhitespacePattern}?$`,
        "u",
      ).exec(entryLine.line);
      invariant(entry !== null, "PDF xref entry is malformed.");
      const objectNumber = firstObject + index;
      const generation = Number(entry[2]);
      const objectOffset = Number(entry[1]);
      invariant(!seenObjects.has(objectNumber), "PDF xref subsections overlap.");
      seenObjects.add(objectNumber);
      if (entry[3] === "n") {
        invariant(objectOffset < offset, "PDF xref object offset is outside its revision.");
        entries.set(`${objectNumber}:${generation}`, {
          generation,
          number: objectNumber,
          offset: objectOffset,
        });
      }
    }
    cursor = skipPdfWhitespace(source, cursor);
  }
  cursor = skipPdfWhitespace(source, cursor + "trailer".length);
  const dictionary = readPdfDictionary(source, cursor);
  const trailer = parseTrailer(dictionary.text);
  invariant(trailer.previous === null || trailer.previous < offset,
    "PDF trailer Prev must address an earlier xref revision.");
  invariant(trailer.root.number < trailer.size,
    "PDF trailer Root object is outside the declared Size.");
  const end = readXrefTerminator(source, dictionary.end, offset);
  return { dictionary: dictionary.text, end, entries, entryCount, offset, trailer };
}

function finalStartXref(source) {
  const match = new RegExp(
    `startxref${pdfWhitespacePattern}+(\\d+)${pdfWhitespacePattern}+`
      + `%%EOF${pdfWhitespacePattern}*$`,
    "u",
  ).exec(source);
  invariant(match !== null, "PDF must end with one readable startxref and %%EOF marker.");
  return Number(match[1]);
}

function buildXrefIndex(source) {
  const entries = new Map();
  const offsets = new Set();
  const revisions = [];
  let offset = finalStartXref(source);
  while (offset !== null) {
    invariant(revisions.length < maximumXrefRevisions, "PDF xref revision bound was exceeded.");
    invariant(!offsets.has(offset), "PDF xref revision chain contains a cycle.");
    offsets.add(offset);
    const revision = parseXrefRevision(source, offset);
    revisions.push(revision);
    for (const [key, value] of revision.entries) {
      if (!entries.has(key)) entries.set(key, value);
    }
    offset = revision.trailer.previous;
  }
  const latest = revisions[0];
  invariant(latest.trailer.size > 0 && latest.trailer.size <= maximumXrefEntries,
    "PDF trailer Size is outside the supported bound.");
  invariant(latest.end === source.length,
    "PDF contains unparsed bytes after the final xref revision.");
  return { entries, latest, revisions };
}

function readXrefObjectDictionary(source, entry, label) {
  const header = new RegExp(
    `^${entry.number}${pdfWhitespacePattern}+${entry.generation}`
      + `${pdfWhitespacePattern}+obj${pdfNameBoundary}`,
    "u",
  ).exec(source.slice(entry.offset));
  invariant(header !== null, `PDF ${label} xref entry does not address its declared object.`);
  const dictionaryStart = skipPdfWhitespace(source, entry.offset + header[0].length);
  if (!source.startsWith("<<", dictionaryStart)) return null;
  return readPdfDictionary(source, dictionaryStart);
}

function readIndirectDictionary(source, reference, entries, label) {
  const entry = entries.get(`${reference.number}:${reference.generation}`);
  invariant(entry !== undefined, `PDF ${label} reference is absent from the xref chain.`);
  const dictionary = readXrefObjectDictionary(source, entry, label);
  invariant(dictionary !== null, `PDF ${label} must begin with a direct dictionary.`);
  const endObject = skipPdfWhitespace(source, dictionary.end);
  invariant(source.startsWith("endobj", endObject)
    && isPdfDelimiter(source[endObject + "endobj".length]),
  `PDF ${label} must be a direct dictionary object.`);
  return { dictionary: dictionary.text, entry, reference };
}

function validateStructureTypes(source, entries) {
  let compatibleTypes = 0;
  for (const entry of entries.values()) {
    const dictionary = readXrefObjectDictionary(source, entry, `object ${entry.number}`);
    if (dictionary === null) continue;
    const objectEntries = parsePdfDictionaryEntries(dictionary.text, `object ${entry.number}`);
    const type = dictionaryEntry(objectEntries, "Type", `object ${entry.number}`, false);
    if (type?.kind !== "name" || type.value !== "StructElem") continue;
    const structureTypeValue = dictionaryEntry(
      objectEntries,
      "S",
      `StructElem ${entry.number}`,
    );
    invariant(structureTypeValue.kind === "name",
      `PDF StructElem ${entry.number} S entry must be a name.`);
    const structureType = structureTypeValue.value;
    invariant(structureType !== "Aside",
      "Chromium emitted unsupported Aside structure semantics; review them separately.");
    if (structureType === "Strong" || structureType === "Em") compatibleTypes += 1;
  }
  return compatibleTypes;
}

function sameReference(left, right) {
  return left.number === right.number && left.generation === right.generation;
}

function readStructureRoot(source, xref) {
  const catalog = readIndirectDictionary(
    source,
    xref.latest.trailer.root,
    xref.entries,
    "catalog",
  );
  const catalogEntries = parsePdfDictionaryEntries(catalog.dictionary, "catalog");
  const catalogType = dictionaryEntry(catalogEntries, "Type", "catalog");
  invariant(catalogType.kind === "name" && catalogType.value === "Catalog",
    "PDF trailer Root does not identify a Catalog dictionary.");
  invariant(dictionaryEntry(catalogEntries, "Version", "catalog", false) === null,
    "PDF catalog Version overrides are unsupported by the pinned PDF 1.4 finaliser.");
  const rootReference = referenceValue(
    dictionaryEntry(catalogEntries, "StructTreeRoot", "catalog"),
    "catalog StructTreeRoot",
  );
  invariant(rootReference.number < xref.latest.trailer.size,
    "PDF StructTreeRoot object is outside the declared Size.");
  const root = readIndirectDictionary(source, rootReference, xref.entries, "structure root");
  const rootEntries = parsePdfDictionaryEntries(root.dictionary, "StructTreeRoot");
  const rootType = dictionaryEntry(rootEntries, "Type", "StructTreeRoot");
  invariant(rootType.kind === "name" && rootType.value === "StructTreeRoot",
    "PDF catalog StructTreeRoot does not identify a StructTreeRoot dictionary.");
  return { root, rootEntries };
}

function inspectStructureRoot(source) {
  const xref = buildXrefIndex(source);
  const compatibleTypes = validateStructureTypes(source, xref.entries);
  const { root, rootEntries } = readStructureRoot(source, xref);
  return { compatibleTypes, root, rootEntries, xref };
}

function hasExactRoleMap(entries) {
  const roleMap = dictionaryEntry(entries, "RoleMap", "StructTreeRoot", false);
  if (roleMap === null) return false;
  invariant(roleMap.kind === "dictionary" && roleMap.value === "<</Strong /Span /Em /Span>>",
    "PDF StructTreeRoot contains a competing or non-canonical RoleMap.");
  return true;
}

function serializeRoleMapRevision({
  baseTrailer,
  objectOffset,
  previousXrefOffset,
  rootDictionary,
  rootReference,
}) {
  const objectRecord = `${rootReference.number} ${rootReference.generation} obj\n`
    + `${rootDictionary}\nendobj\n`;
  const xrefOffset = objectOffset + Buffer.byteLength(objectRecord, "latin1");
  invariant(objectOffset <= 9_999_999_999 && xrefOffset <= 9_999_999_999,
    "PDF incremental xref offset exceeds the classic-table width.");
  invariant(rootReference.generation <= 99_999,
    "PDF structure-root generation exceeds the classic-table width.");
  const trailer = `${baseTrailer.slice(0, -2)}\n/Prev ${previousXrefOffset}>>`;
  const xrefRecord = "xref\n"
    + `${rootReference.number} 1\n`
    + `${String(objectOffset).padStart(10, "0")} `
    + `${String(rootReference.generation).padStart(5, "0")} n \n`
    + `trailer\n${trailer}\nstartxref\n${xrefOffset}\n%%EOF\n`;
  return { bytes: objectRecord + xrefRecord, trailer, xrefOffset };
}

function validateFinalizedRoleMapRevision(source, inspected) {
  invariant(inspected.xref.revisions.length === 2,
    "A canonical RoleMap must have exactly one finaliser-owned incremental revision.");
  const [latest, original] = inspected.xref.revisions;
  invariant(original.trailer.previous === null,
    "The RoleMap base revision must not be incremental.");
  invariant(latest.entryCount === 1,
    "The RoleMap revision must redefine exactly one xref entry.");
  invariant(latest.trailer.size === original.trailer.size
    && sameReference(latest.trailer.root, original.trailer.root),
    "The RoleMap revision changed the trailer authority.");
  const rootKey = `${inspected.root.reference.number}:${inspected.root.reference.generation}`;
  const latestRootEntry = latest.entries.get(rootKey);
  invariant(latestRootEntry?.offset === inspected.root.entry.offset,
    "The RoleMap revision did not exclusively redefine StructTreeRoot.");
  invariant(original.end === inspected.root.entry.offset,
    "The RoleMap revision contains bytes outside the finaliser-owned object.");

  const originalXref = { entries: original.entries, latest: original };
  const originalStructure = readStructureRoot(source, originalXref);
  invariant(sameReference(originalStructure.root.reference, inspected.root.reference),
    "The RoleMap revision changed the StructTreeRoot reference.");
  invariant(dictionaryEntry(
    originalStructure.rootEntries,
    "RoleMap",
    "base StructTreeRoot",
    false,
  ) === null, "The RoleMap existed before the finaliser-owned revision.");
  const expectedRoot = `${originalStructure.root.dictionary.slice(0, -2)}\n${roleMapEntry}>>`;
  invariant(inspected.root.dictionary === expectedRoot,
    "The RoleMap revision changed more than the canonical compatibility mapping.");
  const expectedRevision = serializeRoleMapRevision({
    baseTrailer: original.dictionary,
    objectOffset: original.end,
    previousXrefOffset: original.offset,
    rootDictionary: expectedRoot,
    rootReference: inspected.root.reference,
  });
  invariant(latest.dictionary === expectedRevision.trailer,
    "The RoleMap revision changed more than the canonical trailer link.");
  invariant(
    latest.offset === expectedRevision.xrefOffset
      && source.slice(original.end) === expectedRevision.bytes,
    "The RoleMap revision is not the exact finaliser-owned serialization.",
  );
}

function appendRoleMapRevision(input, maximumBytes) {
  invariant(input.length > 0 && input.length <= maximumBytes,
    "PDF byte length is outside the structure-finalisation bound.");
  const source = input.toString("latin1");
  invariant(/^%PDF-1\.4(?:\r\n|\r|\n)/u.test(source),
    "The Strong and Em compatibility mapping is limited to the pinned PDF 1.4 artifact.");
  const inspected = inspectStructureRoot(source);
  if (hasExactRoleMap(inspected.rootEntries)) {
    validateFinalizedRoleMapRevision(source, inspected);
    return input;
  }
  invariant(inspected.xref.revisions.length === 1,
    "A pre-existing incremental PDF without the canonical RoleMap is unsupported.");
  invariant(inspected.compatibleTypes > 0,
    "Chromium PDF does not contain a Strong or Em structure type to map.");

  const rootDictionary = `${inspected.root.dictionary.slice(0, -2)}\n${roleMapEntry}>>`;
  const separator = source.endsWith("\n") || source.endsWith("\r") ? "" : "\n";
  const objectOffset = input.length + Buffer.byteLength(separator, "latin1");
  const revision = serializeRoleMapRevision({
    baseTrailer: inspected.xref.latest.dictionary,
    objectOffset,
    previousXrefOffset: inspected.xref.latest.offset,
    rootDictionary,
    rootReference: inspected.root.reference,
  });
  const suffix = Buffer.from(separator + revision.bytes, "latin1");
  invariant(input.length + suffix.length <= maximumBytes,
    "Finalized PDF byte length exceeds the structure-finalisation bound.");
  const output = Buffer.concat([
    input,
    suffix,
  ]);
  const verified = inspectStructureRoot(output.toString("latin1"));
  invariant(verified.xref.revisions.length === 2,
    "PDF RoleMap finalisation did not create exactly one incremental revision.");
  invariant(hasExactRoleMap(verified.rootEntries),
    "PDF RoleMap finalisation did not resolve the canonical compatibility mapping.");
  invariant(
    verified.root.entry.offset === objectOffset
      && verified.xref.latest.offset === revision.xrefOffset,
    "PDF RoleMap finalisation produced inconsistent xref offsets.");
  return output;
}

export function normalizeChromiumPdfMetadata(bytes, releaseDate, options) {
  const maximumBytes = pdfByteLimit(options);
  invariant(Buffer.isBuffer(bytes), "Chromium PDF input must be a Buffer.");
  invariant(bytes.length > 0 && bytes.length <= maximumBytes,
    "PDF byte length is outside the structure-finalisation bound.");
  const input = Buffer.from(bytes);
  const timestamp = pdfTimestamp(releaseDate);
  const names = [];
  const source = input.toString("latin1");
  const normalized = source.replace(
    chromiumTimestampPattern,
    (entry, name) => {
      names.push(name);
      const replacement = `/${name} (${timestamp})`;
      invariant(
        Buffer.byteLength(replacement, "latin1") === Buffer.byteLength(entry, "latin1"),
        `Normalized PDF ${name} metadata changed byte length.`,
      );
      return replacement;
    },
  );
  invariant(
    names.length === 2 && names.includes("CreationDate") && names.includes("ModDate"),
    "Chromium PDF must contain exactly one CreationDate and one ModDate UTC metadata field.",
  );
  const structureIds = new Map();
  const canonical = normalized.replace(chromiumStructureIdPattern, (identifier) => {
    if (!structureIds.has(identifier)) {
      structureIds.set(
        identifier,
        `(node${String(structureIds.size).padStart(8, "0")})`,
      );
    }
    return structureIds.get(identifier);
  });
  const metadataNormalized = Buffer.from(canonical, "latin1");
  invariant(metadataNormalized.length === input.length, "Normalized PDF metadata byte length changed.");
  return appendRoleMapRevision(metadataNormalized, maximumBytes);
}
