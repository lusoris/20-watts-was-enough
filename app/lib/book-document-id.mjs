export function bookDocumentId(documentPath) {
  const slug = String(documentPath).toLowerCase().replace(/[^a-z0-9]+/g, "-");
  if (!slug || slug === "-") {
    throw new Error("Book document path cannot produce an empty fragment identifier.");
  }
  return `book-${slug}`;
}

export function bookDocumentHeadingId(documentPath, headingId) {
  return `${bookDocumentId(documentPath)}--${headingId}`;
}
