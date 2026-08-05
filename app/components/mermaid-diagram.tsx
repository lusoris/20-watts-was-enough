"use client";

import { useEffect, useId, useState } from "react";

export function MermaidDiagram({ chart }: { chart: string }) {
  const reactId = useId();
  const [svg, setSvg] = useState("");
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
            fontFamily: "var(--font-sans)",
          },
        });
        return mermaid.render(diagramId, chart.trim());
      })
      .then(({ svg: renderedSvg }) => {
        if (!active) return;
        setSvg(renderedSvg);
        setError("");
      })
      .catch((renderError: unknown) => {
        if (!active) return;
        setSvg("");
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

  if (!svg) {
    return <div className="diagram diagram-loading">Rendering diagram…</div>;
  }

  return (
    <figure
      className="diagram"
      aria-label="Rendered Mermaid diagram"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
