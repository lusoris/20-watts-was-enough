"use client";

import {
  Children,
  isValidElement,
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

function DiagramAwarePre({ children, ...props }: ComponentPropsWithoutRef<"pre">) {
  const onlyChild = Children.count(children) === 1 ? Children.only(children) : null;
  if (isValidElement(onlyChild) && onlyChild.type === MermaidDiagram) {
    return onlyChild;
  }
  return <pre {...props}>{children}</pre>;
}

// The overflow region must receive keyboard focus so arrow-key users can scroll it.
/* eslint-disable jsx-a11y/no-noninteractive-tabindex */
function ResponsiveTable(props: ComponentPropsWithoutRef<"table">) {
  return (
    <div className="table-frame">
      <div className="table-scroll-cue" aria-hidden="true">
        <span>Wide table</span>
        <span>Scroll horizontally ↔</span>
      </div>
      <div
        className="table-region"
        role="region"
        aria-label="Scrollable data table"
        tabIndex={0}
      >
        <table {...props} />
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
    img({ src = "", alt = "", ...props }) {
      return (
        // Plot SVGs are already optimized deterministic assets and keep their
        // intrinsic viewBox when rendered directly.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={resolveImageSource(src, currentPath)}
          alt={alt}
          loading={imageLoading}
          {...props}
        />
      );
    },
    code({ className, children, ...props }) {
      const language = className?.replace("language-", "");
      if (language === "mermaid") {
        return <MermaidDiagram chart={String(children)} />;
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
