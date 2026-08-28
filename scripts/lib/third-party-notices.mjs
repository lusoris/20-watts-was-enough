import { createHash } from "node:crypto";
import {
  lstatSync,
  readFileSync,
  readdirSync,
  realpathSync,
} from "node:fs";
import path from "node:path";

const LICENSE_FILE = /^(?:licen[cs]e|copying|notice)(?:[._-].*)?$/iu;
const LICENSE_OVERRIDES = Object.freeze({
  "rehype-katex@7.0.1": {
    path: "LICENSES/remark-math-MIT.txt",
    source: "remarkjs/remark-math tag rehype-katex@7.0.1, root license",
  },
  "remark-math@6.0.0": {
    path: "LICENSES/remark-math-MIT.txt",
    source: "remarkjs/remark-math upstream root license shared by the package",
  },
});

const VIRTUAL_MODULE_PACKAGES = Object.freeze({
  "\0rolldown/runtime.js": {
    expectedIdentity: "rolldown@1.0.3",
    packagePath: "node_modules/rolldown",
  },
  "\0vite/modulepreload-polyfill.js": {
    expectedIdentity: "vite@8.0.16",
    packagePath: "node_modules/vite",
  },
  "\0vite/preload-helper.js": {
    expectedIdentity: "vite@8.0.16",
    packagePath: "node_modules/vite",
  },
});
const PROJECT_VIRTUAL_MODULES = new Set([
  "\0virtual:portal-document-index",
]);

function normalizedVirtualModuleId(moduleId) {
  const normalized = moduleId.split("?", 1)[0].replaceAll("\\", "/");
  return normalized.charCodeAt(0) === 0 ? normalized : null;
}

function normalizedModuleId(moduleId) {
  return moduleId.replace(/^\0/u, "").split("?", 1)[0].replaceAll("\\", "/");
}

function packageRoot(moduleId) {
  const normalized = normalizedModuleId(moduleId);
  const marker = "/node_modules/";
  const markerIndex = normalized.lastIndexOf(marker);
  if (markerIndex < 0) return null;
  const prefix = normalized.slice(0, markerIndex + marker.length);
  const remainder = normalized.slice(markerIndex + marker.length);
  const segments = remainder.split("/");
  const packageSegments = segments[0]?.startsWith("@")
    ? segments.slice(0, 2)
    : segments.slice(0, 1);
  if (packageSegments.length === 0 || packageSegments.some((segment) => !segment)) {
    return null;
  }
  return realpathSync(path.normalize(`${prefix}${packageSegments.join("/")}`));
}

function textFile(pathname) {
  const information = lstatSync(pathname);
  if (!information.isFile() || information.isSymbolicLink() || information.size > 1_000_000) {
    throw new Error(`Unsafe third-party notice file: ${pathname}`);
  }
  const normalized = readFileSync(pathname, "utf8")
    .replaceAll("\r\n", "\n")
    .split("\n")
    .map((line) => line.replace(/[\t ]+$/u, ""))
    .join("\n")
    .trimEnd();
  return `${normalized}\n`;
}

export function renderThirdPartyNotices({ moduleIds, repositoryRoot }) {
  const roots = new Set(
    [...moduleIds].map(packageRoot).filter((value) => value !== null),
  );
  for (const moduleId of moduleIds) {
    const virtualModuleId = normalizedVirtualModuleId(moduleId);
    if (virtualModuleId === null) continue;
    if (PROJECT_VIRTUAL_MODULES.has(virtualModuleId)) continue;
    const mapping = VIRTUAL_MODULE_PACKAGES[virtualModuleId];
    if (!mapping) {
      throw new Error(`Unmapped virtual bundle module: ${JSON.stringify(virtualModuleId)}`);
    }
    const root = realpathSync(
      path.join(repositoryRoot, ...mapping.packagePath.split("/")),
    );
    const metadata = JSON.parse(readFileSync(path.join(root, "package.json"), "utf8"));
    const packageIdentity = `${metadata.name}@${metadata.version}`;
    if (packageIdentity !== mapping.expectedIdentity) {
      throw new Error(
        `Virtual bundle module ${JSON.stringify(virtualModuleId)} expected `
          + `${mapping.expectedIdentity}, found ${packageIdentity}`,
      );
    }
    roots.add(root);
  }
  const packages = [];
  const texts = new Map();

  for (const root of roots) {
    const metadata = JSON.parse(readFileSync(path.join(root, "package.json"), "utf8"));
    const candidates = readdirSync(root)
      .filter((name) => LICENSE_FILE.test(name))
      .sort((left, right) => left.localeCompare(right, "en"));
    const packageIdentity = `${metadata.name}@${metadata.version}`;
    const noticeDigests = [];
    const notices = candidates.map((candidate) => ({
      filename: candidate,
      source: textFile(path.join(root, candidate)),
    }));
    const override = LICENSE_OVERRIDES[packageIdentity];
    if (notices.length === 0 && override) {
      notices.push({
        filename: `${override.path} (${override.source})`,
        source: textFile(path.join(repositoryRoot, ...override.path.split("/"))),
      });
    }
    if (notices.length === 0) {
      throw new Error(`Bundled package lacks a redistributable notice file: ${packageIdentity}`);
    }
    for (const { filename, source } of notices) {
      const digest = createHash("sha256").update(source).digest("hex");
      noticeDigests.push(digest);
      const record = texts.get(digest) ?? { source, packages: new Set(), filenames: new Set() };
      record.packages.add(packageIdentity);
      record.filenames.add(filename);
      texts.set(digest, record);
    }
    packages.push({
      identity: packageIdentity,
      license: typeof metadata.license === "string" ? metadata.license : "see included notice",
      noticeDigests,
    });
  }

  packages.sort((left, right) => left.identity.localeCompare(right.identity, "en"));
  const blocks = [...texts.entries()].sort(([left], [right]) => left.localeCompare(right, "en"));
  const ofl = textFile(path.join(repositoryRoot, "LICENSES", "OFL-1.1.txt"));
  const inventory = packages
    .map(({ identity, license }) => `- ${identity} — ${license}`)
    .join("\n");
  const licenseBlocks = blocks.map(([digest, record]) => [
    "================================================================================",
    `Packages: ${[...record.packages].sort().join(", ")}`,
    `Upstream notice file(s): ${[...record.filenames].sort().join(", ")}`,
    `SHA-256: ${digest}`,
    "--------------------------------------------------------------------------------",
    record.source.trimEnd(),
  ].join("\n")).join("\n\n");

  return [
    "THIRD-PARTY NOTICES — 20 Watts Was Enough static web edition",
    "",
    "Generated from the exact packages bundled by Vite. These components retain",
    "their own licences; inclusion here does not place them under the project's",
    "EUPL or CC BY-SA grants.",
    "",
    "Bundled package inventory",
    "-------------------------",
    inventory,
    "",
    "Upstream licence and notice texts",
    "----------------------------------",
    licenseBlocks,
    "",
    "================================================================================",
    "KaTeX font software notice",
    "--------------------------------------------------------------------------------",
    "Copyright (c) 2009-2010, Design Science, Inc. (www.mathjax.org)",
    "Copyright (c) 2014-2018 Khan Academy (www.khanacademy.org)",
    "Copyright 1995, 2009 American Mathematical Society.",
    "The distributed binaries carry their substituted family and reserved-name data",
    "in embedded font metadata. The families distributed here are KaTeX_AMS,",
    "KaTeX_Caligraphic, KaTeX_Fraktur, KaTeX_Main, KaTeX_Math, KaTeX_SansSerif,",
    "KaTeX_Script, KaTeX_Size1, KaTeX_Size2, KaTeX_Size3, KaTeX_Size4, and",
    "KaTeX_Typewriter. Those embedded records control for each binary.",
    "The complete, unmodified official OFL follows. Its opening <dates>, holder,",
    "and reserved-name lines are the licence's template example, not missing project",
    "attribution; the actual font notices are stated above and embedded in the files.",
    "",
    ofl.trimEnd(),
    "",
  ].join("\n");
}
