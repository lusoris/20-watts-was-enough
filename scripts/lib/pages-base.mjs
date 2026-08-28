const pagesBaseEnvironmentName = "PAGES_BASE_PATH";

function invalidPagesBase(reason) {
  throw new Error(`Invalid ${pagesBaseEnvironmentName}: ${reason}`);
}

export function resolvePagesBase(rawValue) {
  if (rawValue === undefined || rawValue === "") return "/";
  if (typeof rawValue !== "string") invalidPagesBase("the value must be a string");
  if (rawValue.trim() !== rawValue) invalidPagesBase("surrounding whitespace is not allowed");
  if (rawValue === "/") return "/";
  if (rawValue.includes("\\")) invalidPagesBase("backslashes are not allowed");
  if (/[?#]/u.test(rawValue)) invalidPagesBase("query strings and fragments are not allowed");
  if (rawValue.startsWith("//") || /^[A-Za-z][A-Za-z\d+.-]*:/u.test(rawValue)) {
    invalidPagesBase("the value must be a root-relative path, not a URL");
  }

  const withoutOuterSlashes = rawValue.replace(/^\//u, "").replace(/\/$/u, "");
  const segments = withoutOuterSlashes.split("/");
  if (
    segments.length === 0
    || segments.some((segment) => (
      segment === ""
      || segment === "."
      || segment === ".."
      || !/^[A-Za-z0-9._~-]+$/u.test(segment)
    ))
  ) {
    invalidPagesBase("use URL-safe path segments without empty, '.' or '..' segments");
  }
  return `/${segments.join("/")}/`;
}
