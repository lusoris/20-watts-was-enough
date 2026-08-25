"use client";

import {
  Children,
  cloneElement,
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
import { MermaidDiagram } from "./mermaid-diagram";

type MarkdownDocumentProps = {
  body: string;
  currentPath: string;
  onNavigate: (path: string, hash?: string) => void;
  internalHref?: (path: string, hash: string) => string;
  imageLoading?: "eager" | "lazy";
};

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

function resolveImageSource(src: string, currentPath: string): string {
  if (/^(https?:|data:|\/)/i.test(src)) return src;
  const base = currentPath.includes("/")
    ? currentPath.slice(0, currentPath.lastIndexOf("/") + 1)
    : "";
  const resolved = normalizePath(`${base}${src}`);
  return resolved.startsWith("public/")
    ? `/${resolved.slice("public/".length)}`
    : src;
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

// The overflow region must receive keyboard focus so arrow-key users can scroll it.
/* eslint-disable jsx-a11y/no-noninteractive-tabindex */
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
        role="region"
        aria-label="Scrollable data table"
        tabIndex={0}
        ref={regionRef}
      >
        <table ref={tableRef} {...props} />
      </div>
    </div>
  );
}
/* eslint-enable jsx-a11y/no-noninteractive-tabindex */

export function MarkdownDocument({
  body,
  currentPath,
  onNavigate,
  internalHref,
  imageLoading = "lazy",
}: MarkdownDocumentProps) {
  const ImageComponent = ({
    src = "",
    alt = "",
    ...props
  }: ComponentPropsWithoutRef<"img">) => (
    // Plot SVGs are deterministic assets and retain their intrinsic viewBox.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={resolveImageSource(typeof src === "string" ? src : "", currentPath)}
      alt={alt}
      loading={imageLoading}
      {...props}
    />
  );

  const components: Components = {
    a({ href = "", children, ...props }) {
      const internal = resolveInternalLink(href, currentPath);
      if (!internal) {
        return (
          <a href={href} target="_blank" rel="noreferrer" {...props}>
            {children}
          </a>
        );
      }

      if (internalHref) {
        return (
          <a href={internalHref(internal.path, internal.hash)} {...props}>
            {children}
          </a>
        );
      }

      const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
        event.preventDefault();
        onNavigate(internal.path, internal.hash);
      };

      return (
        <a href={`?doc=${encodeURIComponent(internal.path)}`} onClick={handleClick} {...props}>
          {children}
        </a>
      );
    },
    p({ children }) {
      const visibleChildren = Children.toArray(children).filter(
        (child) => typeof child !== "string" || child.trim().length > 0,
      );
      const onlyChild = visibleChildren.length === 1 ? visibleChildren[0] : null;
      if (
        isValidElement<ComponentPropsWithoutRef<"img">>(onlyChild) &&
        onlyChild.type === ImageComponent
      ) {
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
    },
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
