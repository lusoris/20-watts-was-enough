"use client";

import { type CSSProperties, useEffect, useId, useState } from "react";

type RenderedDiagram = {
  svg: string;
  shape: "wide" | "standard" | "tall";
  width?: number;
};

function classifyDiagram(renderedSvg: string): Omit<RenderedDiagram, "svg"> {
  const viewBox = renderedSvg.match(
    /viewBox=["']\s*[-\d.]+\s+[-\d.]+\s+([\d.]+)\s+([\d.]+)\s*["']/i,
  );

  if (!viewBox) return { shape: "standard" };

  const intrinsicWidth = Number(viewBox[1]);
  const intrinsicHeight = Number(viewBox[2]);
  const aspectRatio = intrinsicWidth / intrinsicHeight;

  if (aspectRatio > 1.8) {
    return {
      shape: "wide",
      width: Math.round(
        Math.min(1800, Math.max(1120, intrinsicWidth * 0.75)),
      ),
    };
  }

  if (aspectRatio < 0.7) return { shape: "tall" };
  return { shape: "standard" };
}

export function MermaidDiagram({ chart }: { chart: string }) {
  const reactId = useId();
  const [rendered, setRendered] = useState<RenderedDiagram | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    const diagramId = `diagram-${reactId.replace(/[^a-zA-Z0-9_-]/g, "")}`;

    import("mermaid")
      .then(({ default: mermaid }) => {
        mermaid.initialize({
          startOnLoad: false,
          securityLevel: "strict",
          theme: "dark",
          themeVariables: {
            background: "#111611",
            primaryColor: "#1f382a",
            primaryTextColor: "#f3f0e8",
            primaryBorderColor: "#78c091",
            lineColor: "#97a39a",
            secondaryColor: "#253d4b",
            tertiaryColor: "#3b3022",
            clusterBkg: "#18231b",
            clusterBorder: "#3f5d49",
            edgeLabelBackground: "#111611",
            fontFamily: "var(--font-sans)",
          },
        });
        return mermaid.render(diagramId, chart.trim());
      })
      .then(({ svg: renderedSvg }) => {
        if (!active) return;
        setRendered({ svg: renderedSvg, ...classifyDiagram(renderedSvg) });
        setError("");
      })
      .catch((renderError: unknown) => {
        if (!active) return;
        setRendered(null);
        setError(
          renderError instanceof Error
            ? renderError.message
            : "The Mermaid source could not be rendered.",
        );
      });

    return () => {
      active = false;
    };
  }, [chart, reactId]);

  if (error) {
    return (
      <figure className="diagram diagram-error">
        <figcaption>Diagram render error</figcaption>
        <pre>{chart}</pre>
        <p>{error}</p>
      </figure>
    );
  }

  if (!rendered) {
    return <div className="diagram diagram-loading">Rendering diagram…</div>;
  }

  const canvasStyle = rendered.width
    ? ({ "--diagram-width": `${rendered.width}px` } as CSSProperties)
    : undefined;

  return (
    <figure
      className={`diagram diagram-${rendered.shape}`}
      aria-label="Rendered Mermaid diagram"
    >
      {rendered.shape === "wide" ? (
        <figcaption className="diagram-caption">
          Wide diagram · scroll horizontally
        </figcaption>
      ) : null}
      <div
        className="diagram-canvas"
        style={canvasStyle}
        dangerouslySetInnerHTML={{ __html: rendered.svg }}
      />
    </figure>
  );
}
