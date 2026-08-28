/**
 * Remove HTML tag syntax without treating an unterminated tag as visible text.
 * Less-than signs used as ordinary text remain intact unless a tag opener follows.
 *
 * @param {string} value
 * @returns {string}
 */
export function stripHtmlTagSyntax(value) {
  let visible = "";
  let insideTag = false;

  for (let index = 0; index < value.length; index += 1) {
    const character = value[index];
    if (insideTag) {
      if (character === ">") {
        insideTag = false;
        visible += " ";
      }
      continue;
    }
    const next = value[index + 1] ?? "";
    if (character === "<" && /[A-Za-z/!?]/u.test(next)) {
      insideTag = true;
      continue;
    }
    visible += character;
  }

  return visible;
}

/**
 * Decode the basic named entities in one pass. An entity revealed by decoding
 * another entity is deliberately not decoded a second time.
 *
 * @param {string} value
 * @returns {string}
 */
export function decodeBasicHtmlEntitiesOnce(value) {
  return value.replace(/&(?:amp|lt|gt);/giu, (entity) => {
    switch (entity.toLowerCase()) {
      case "&amp;": return "&";
      case "&lt;": return "<";
      case "&gt;": return ">";
      default: return entity;
    }
  });
}
