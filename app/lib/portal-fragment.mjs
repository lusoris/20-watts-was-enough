/** @param {string} value */
export function decodePortalFragment(value) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

/** @param {string} value */
export function encodePortalFragment(value) {
  const fragment = value.startsWith("#") ? value.slice(1) : value;
  return fragment ? `#${encodeURIComponent(decodePortalFragment(fragment))}` : "";
}
