"use client";

import {
  Children,
  cloneElement,
  createElement,
  isValidElement,
  type ComponentPropsWithoutRef,
  type MouseEvent,
} from "react";
import type { Element, Root, RootContent } from "hast";
import ReactMarkdown, { type Components } from "react-markdown";
import rehypeKatex from "rehype-katex";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import {
  isPublicRepositoryArtifact,
  isRepositoryArtifact,
  repositoryArtifactHref,
} from "../lib/repository-artifacts";
import { MermaidDiagram } from "./mermaid-diagram";
import {
  OverflowRegionCue,
  useHorizontalOverflowRegion,
} from "./overflow-region";

type MarkdownDocumentProps = {
  body: string;
  currentPath: string;
  onNavigate: (path: string, hash?: string) => void;
  internalHref?: (path: string, hash: string) => string;
  isNavigablePath?: (path: string) => boolean;
  nonNavigableHref?: (path: string, hash: string) => string;
  imageLoading?: "eager" | "lazy";
  renderExternalImages?: boolean;
  assetBasePath?: string;
  headingOffset?: number;
};

type MarkdownHeadingProps = ComponentPropsWithoutRef<"h1"> & {
  node?: unknown;
};

function shiftedHeading(level: number, offset: number) {
  const shiftedLevel = Math.min(6, Math.max(1, level + offset));
  const tag = `h${shiftedLevel}` as "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  return function ShiftedMarkdownHeading({ node, ...props }: MarkdownHeadingProps) {
    void node;
    return createElement(tag, props);
  };
}

function normalizePath(path: string): string {
  const parts: string[] = [];
  for (const part of path.replaceAll("\\", "/").split("/")) {
    if (!part || part === ".") continue;
    if (part === "..") parts.pop();
    else parts.push(part);
  }
  return parts.join("/");
}

function resolveInternalLink(href: string, currentPath: string) {
  if (/^(https?:|mailto:)/i.test(href)) return null;
  if (href.startsWith("#")) {
    return { path: currentPath, hash: href.slice(1) };
  }

  const [relativePath, hash = ""] = href.split("#", 2);
  const base = currentPath.includes("/")
    ? currentPath.slice(0, currentPath.lastIndexOf("/") + 1)
    : "";
  return { path: normalizePath(`${base}${relativePath}`), hash };
}

function navigateInternalLink(
  event: MouseEvent<HTMLAnchorElement>,
  internal: { path: string; hash: string },
  onNavigate: (path: string, hash?: string) => void,
) {
  if (
    event.button !== 0
    || event.altKey
    || event.ctrlKey
    || event.metaKey
    || event.shiftKey
  ) return;
  event.preventDefault();
  onNavigate(internal.path, internal.hash);
}

function joinAssetBase(assetBasePath: string, src: string): string {
  const base = assetBasePath.endsWith("/") ? assetBasePath : `${assetBasePath}/`;
  return `${base}${src.replace(/^\/+/, "")}`;
}

function resolveImageSource(
  src: string,
  currentPath: string,
  assetBasePath: string,
): string {
  if (/^(https?:|data:)/i.test(src)) return src;
  if (src.startsWith("/")) return joinAssetBase(assetBasePath, src);
  const base = currentPath.includes("/")
    ? currentPath.slice(0, currentPath.lastIndexOf("/") + 1)
    : "";
  const resolved = normalizePath(`${base}${src}`);
  return resolved.startsWith("public/")
    ? joinAssetBase(assetBasePath, resolved.slice("public/".length))
    : src;
}

function isExternalImageSource(src: string): boolean {
  return /^https?:\/\//i.test(src);
}

type MarkdownImageOptions = {
  assetBasePath: string;
  currentPath: string;
  imageLoading: "eager" | "lazy";
  renderExternalImages: boolean;
};

function markdownImageComponents({
  assetBasePath,
  currentPath,
  imageLoading,
  renderExternalImages,
}: MarkdownImageOptions) {
  const ImageComponent = ({
    src = "",
    alt = "",
    ...props
  }: ComponentPropsWithoutRef<"img">) => {
    const source = typeof src === "string" ? src : "";
    if (!renderExternalImages && isExternalImageSource(source)) {
      return (
        <span className="external-image-reference">
          {alt.trim() || "External image omitted from the offline edition"}
        </span>
      );
    }
    return (
      // Plot SVGs are deterministic assets and retain their intrinsic viewBox.
      <img
        src={resolveImageSource(source, currentPath, assetBasePath)}
        alt={alt}
        loading={imageLoading}
        {...props}
      />
    );
  };

  const ParagraphComponent = ({ children }: ComponentPropsWithoutRef<"p">) => {
    const visibleChildren = Children.toArray(children).filter(
      (child) => typeof child !== "string" || child.trim().length > 0,
    );
    const onlyChild = visibleChildren.length === 1 ? visibleChildren[0] : null;
    if (
      isValidElement<ComponentPropsWithoutRef<"img">>(onlyChild) &&
      onlyChild.type === ImageComponent
    ) {
      const source = typeof onlyChild.props.src === "string" ? onlyChild.props.src : "";
      if (!renderExternalImages && isExternalImageSource(source)) {
        return <p className="external-image-paragraph">{onlyChild}</p>;
      }
      const caption = onlyChild.props.alt?.trim() ||
        "Generated figure from the canonical editable source.";
      return (
        <figure className="semantic-figure plot-figure">
          {cloneElement(onlyChild, { alt: "", "aria-hidden": true })}
          <figcaption>{caption}</figcaption>
        </figure>
      );
    }
    return <p>{children}</p>;
  };

  return { ImageComponent, ParagraphComponent };
}

function cleanMarkdownHeading(value: string): string | undefined {
  const heading = value
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/<[^>]+>/g, " ")
    .replace(/[*_`~]/g, "")
    .replace(/\s+/g, " ")
    .trim();
  return heading || undefined;
}

function headingBeforeLine(body: string, line?: number): string | undefined {
  if (!line || line < 1) return undefined;
  const lines = body.split(/\r?\n/);
  for (let index = Math.min(line - 2, lines.length - 1); index >= 0; index -= 1) {
    const match = lines[index].match(/^#{1,6}\s+(.+?)\s*#*\s*$/);
    if (match) return cleanMarkdownHeading(match[1]);
  }
  return undefined;
}

function markdownDocumentLabel(body: string, currentPath: string): string {
  const heading = body.match(/^#{1,6}\s+(.+?)\s*#*\s*$/m)?.[1];
  const label = heading ? cleanMarkdownHeading(heading) : undefined;
  if (!label) return currentPath;
  return label.length <= 64 ? label : `${label.slice(0, 61).trimEnd()}...`;
}

function hastClassNames(element: Element): string[] {
  const value: unknown = element.properties.className;
  if (typeof value === "string") return value.split(/\s+/);
  if (!Array.isArray(value)) return [];
  return value.filter((entry): entry is string => typeof entry === "string");
}

function hastOverflowLabel(element?: Element): string | undefined {
  const value = element?.properties.dataOverflowLabel;
  return typeof value === "string" ? value : undefined;
}

function codeLanguage(element: Element): string | undefined {
  const value = hastClassNames(element)
    .find((className) => className.startsWith("language-"))
    ?.slice("language-".length);
  if (!value || value === "text") return undefined;
  return value === "json" ? "JSON" : value;
}

function rehypeOverflowLabels({ documentLabel }: { documentLabel: string }) {
  return (tree: Root) => {
    let codeIndex = 0;
    let diagramIndex = 0;
    let equationIndex = 0;
    let tableIndex = 0;
    const pending: Array<Root | RootContent> = [tree];
    while (pending.length > 0) {
      const node = pending.pop();
      if (!node) continue;
      if (node.type === "element" && node.tagName === "span"
          && hastClassNames(node).includes("katex-display")) {
        equationIndex += 1;
        node.properties.dataOverflowLabel =
          `Scrollable equation ${equationIndex} in ${documentLabel}`;
      }
      if (node.type === "element" && node.tagName === "pre") {
        const code = node.children.find(
          (child): child is Element => child.type === "element" && child.tagName === "code",
        );
        if (code && hastClassNames(code).includes("language-mermaid")) {
          diagramIndex += 1;
          code.properties.dataOverflowLabel =
            `Scrollable diagram ${diagramIndex} in ${documentLabel}`;
        } else if (code) {
          codeIndex += 1;
          const language = codeLanguage(code);
          node.properties.dataOverflowLabel =
            `Scrollable ${language ? `${language} ` : ""}code ${codeIndex} in ${documentLabel}`;
        }
      }
      if (node.type === "element" && node.tagName === "table") {
        tableIndex += 1;
        node.properties.dataOverflowLabel =
          `Scrollable table ${tableIndex} in ${documentLabel}`;
      }
      if ("children" in node) {
        for (let index = node.children.length - 1; index >= 0; index -= 1) {
          pending.push(node.children[index]);
        }
      }
    }
  };
}

type OverflowLabelProps = {
  "data-overflow-label"?: string;
  node?: unknown;
};

function ResponsiveCodeBlock({
  children,
  label,
  ...props
}: ComponentPropsWithoutRef<"pre"> & { label: string }) {
  const { overflows, regionProps, regionRef } =
    useHorizontalOverflowRegion<HTMLPreElement>(label);
  return (
    <div className="overflow-region-frame code-overflow-frame">
      {overflows ? <OverflowRegionCue subject="code" /> : null}
      <pre {...props} {...regionProps} data-overflow-kind="code" ref={regionRef}>
        {children}
      </pre>
    </div>
  );
}

function DiagramAwarePre({
  children,
  node,
  "data-overflow-label": overflowLabel,
  ...props
}: ComponentPropsWithoutRef<"pre"> & OverflowLabelProps) {
  void node;
  const onlyChild = Children.count(children) === 1 ? Children.only(children) : null;
  if (
    isValidElement<{ className?: string }>(onlyChild) &&
    (onlyChild.type === MermaidDiagram ||
      onlyChild.props.className?.split(/\s+/).includes("language-mermaid"))
  ) {
    return onlyChild;
  }
  return (
    <ResponsiveCodeBlock label={overflowLabel ?? "Scrollable code"} {...props}>
      {children}
    </ResponsiveCodeBlock>
  );
}

// Only an actual overflow region receives keyboard focus so arrow-key users can scroll it.
function ResponsiveTable({
  node,
  "data-overflow-label": overflowLabel,
  ...props
}: ComponentPropsWithoutRef<"table"> & OverflowLabelProps) {
  void node;
  const { overflows, regionProps, regionRef } =
    useHorizontalOverflowRegion<HTMLDivElement>(
      overflowLabel ?? "Scrollable table",
      { role: "region" },
    );

  return (
    <div className="table-frame">
      {overflows ? <OverflowRegionCue subject="table" /> : null}
      <div
        className="table-region"
        {...regionProps}
        data-overflow-kind="table"
        ref={regionRef}
      >
        <table {...props} />
      </div>
    </div>
  );
}

function ResponsiveMathDisplay({
  children,
  label,
  ...props
}: ComponentPropsWithoutRef<"span"> & { label: string }) {
  const { overflows, regionProps, regionRef } =
    useHorizontalOverflowRegion<HTMLSpanElement>(label);
  return (
    <span className="overflow-region-frame equation-overflow-frame">
      {overflows ? <OverflowRegionCue subject="equation" /> : null}
      <span {...props} {...regionProps} data-overflow-kind="equation" ref={regionRef}>
        {children}
      </span>
    </span>
  );
}

function MarkdownSpan({
  children,
  className,
  node,
  "data-overflow-label": overflowLabel,
  ...props
}: ComponentPropsWithoutRef<"span"> & OverflowLabelProps) {
  void node;
  if (className?.split(/\s+/).includes("katex-display")) {
    return (
      <ResponsiveMathDisplay
        className={className}
        label={overflowLabel ?? "Scrollable equation"}
        {...props}
      >
        {children}
      </ResponsiveMathDisplay>
    );
  }
  return <span className={className} {...props}>{children}</span>;
}

export function MarkdownDocument({
  body,
  currentPath,
  onNavigate,
  internalHref,
  isNavigablePath,
  nonNavigableHref,
  imageLoading = "lazy",
  renderExternalImages = true,
  assetBasePath = "/",
  headingOffset = 0,
}: MarkdownDocumentProps) {
  const { ImageComponent, ParagraphComponent } = markdownImageComponents({
    assetBasePath,
    currentPath,
    imageLoading,
    renderExternalImages,
  });

  const headingComponents: Components = headingOffset === 0
    ? {}
    : {
        h1: shiftedHeading(1, headingOffset),
        h2: shiftedHeading(2, headingOffset),
        h3: shiftedHeading(3, headingOffset),
        h4: shiftedHeading(4, headingOffset),
        h5: shiftedHeading(5, headingOffset),
        h6: shiftedHeading(6, headingOffset),
      };

  const components: Components = {
    ...headingComponents,
    a({ href = "", children, ...props }) {
      const internal = resolveInternalLink(href, currentPath);
      if (!internal) {
        return (
          <a href={href} target="_blank" rel="noreferrer" {...props}>
            {children}
          </a>
        );
      }

      const isNavigable = isNavigablePath?.(internal.path) ?? true;
      if (!isNavigable
          && isRepositoryArtifact(internal.path)
          && isPublicRepositoryArtifact(internal.path)) {
        return (
          <a
            href={joinAssetBase(assetBasePath, repositoryArtifactHref(internal.path))}
            target="_blank"
            rel="noreferrer"
            data-repository-artifact={internal.path}
            {...props}
          >
            {children}
          </a>
        );
      }

      if (!isNavigable && nonNavigableHref) {
        return (
          <a
            href={nonNavigableHref(internal.path, internal.hash)}
            target="_blank"
            rel="noreferrer"
            {...props}
          >
            {children}
          </a>
        );
      }

      const resolvedHref = internalHref && isNavigable
        ? internalHref(internal.path, internal.hash)
        : `?doc=${encodeURIComponent(internal.path)}`;

      return (
        <a
          href={resolvedHref}
          onClick={(event) => navigateInternalLink(event, internal, onNavigate)}
          {...props}
        >
          {children}
        </a>
      );
    },
    p: ParagraphComponent,
    img: ImageComponent,
    code({ className, children, node, ...props }) {
      const language = className?.replace("language-", "");
      if (language === "mermaid") {
        return (
          <MermaidDiagram
            chart={String(children)}
            contextHeading={headingBeforeLine(body, node?.position?.start.line)}
            overflowLabel={hastOverflowLabel(node)}
          />
        );
      }
      return (
        <code className={className} {...props}>
          {children}
        </code>
      );
    },
    pre: DiagramAwarePre,
    span: MarkdownSpan,
    table: ResponsiveTable,
  };

  const documentLabel = markdownDocumentLabel(body, currentPath);

  return (
    <ReactMarkdown
      skipHtml
      remarkPlugins={[remarkGfm, remarkMath]}
      rehypePlugins={[
        rehypeSlug,
        rehypeKatex,
        [rehypeOverflowLabels, { documentLabel }],
      ]}
      components={components}
    >
      {body}
    </ReactMarkdown>
  );
}
