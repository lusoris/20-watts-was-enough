"use client";

import {
  Children,
  cloneElement,
  createElement,
  isValidElement,
  useEffect,
  useRef,
  useState,
  type ComponentPropsWithoutRef,
  type MouseEvent,
} from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import rehypeKatex from "rehype-katex";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import { isRepositoryArtifact, repositoryArtifactHref } from "../lib/repository-artifacts";
import { MermaidDiagram } from "./mermaid-diagram";

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

function headingBeforeLine(body: string, line?: number): string | undefined {
  if (!line || line < 1) return undefined;
  const lines = body.split(/\r?\n/);
  for (let index = Math.min(line - 2, lines.length - 1); index >= 0; index -= 1) {
    const match = lines[index].match(/^#{1,6}\s+(.+?)\s*#*\s*$/);
    if (!match) continue;
    const heading = match[1]
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
      .replace(/<[^>]+>/g, " ")
      .replace(/[*_`~]/g, "")
      .replace(/\s+/g, " ")
      .trim();
    return heading || undefined;
  }
  return undefined;
}

function DiagramAwarePre({ children, ...props }: ComponentPropsWithoutRef<"pre">) {
  const onlyChild = Children.count(children) === 1 ? Children.only(children) : null;
  if (
    isValidElement<{ className?: string }>(onlyChild) &&
    (onlyChild.type === MermaidDiagram ||
      onlyChild.props.className?.split(/\s+/).includes("language-mermaid"))
  ) {
    return onlyChild;
  }
  return <pre {...props}>{children}</pre>;
}

// Only an actual overflow region receives keyboard focus so arrow-key users can scroll it.
function ResponsiveTable(props: ComponentPropsWithoutRef<"table">) {
  const regionRef = useRef<HTMLDivElement>(null);
  const tableRef = useRef<HTMLTableElement>(null);
  const [overflows, setOverflows] = useState(false);

  useEffect(() => {
    const region = regionRef.current;
    const table = tableRef.current;
    if (!region || !table) return;

    const measure = () => {
      setOverflows(table.scrollWidth > region.clientWidth + 1);
    };
    measure();
    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", measure);
      return () => window.removeEventListener("resize", measure);
    }
    const observer = new ResizeObserver(measure);
    observer.observe(region);
    observer.observe(table);
    return () => observer.disconnect();
  }, []);

  return (
    <div className={`table-frame ${overflows ? "table-overflowing" : ""}`}>
      <div className="table-scroll-cue" aria-hidden="true">
        <span>Wide table</span>
        <span>Scroll horizontally ↔</span>
      </div>
      <div
        className="table-region"
        role={overflows ? "region" : undefined}
        aria-label={overflows ? "Scrollable data table" : undefined}
        tabIndex={overflows ? 0 : undefined}
        ref={regionRef}
      >
        <table ref={tableRef} {...props} />
      </div>
    </div>
  );
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
      if (!isNavigable && isRepositoryArtifact(internal.path)) {
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
    table: ResponsiveTable,
  };

  return (
    <ReactMarkdown
      skipHtml
      remarkPlugins={[remarkGfm, remarkMath]}
      rehypePlugins={[rehypeSlug, rehypeKatex]}
      components={components}
    >
      {body}
    </ReactMarkdown>
  );
}
