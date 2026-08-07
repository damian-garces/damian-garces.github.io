import { useState } from "react";
import type { HighlightedSnippet } from "../../lib/shiki";

interface CodeEditorProps {
  snippets: HighlightedSnippet[];
  idleConsoleText: string;
  ranConsoleText: string;
}

/**
 * Hero "code editor" island: tab switching between languages and a Run
 * button that updates the console line. Syntax colors come pre-rendered
 * from Shiki at build time (see lib/shiki.ts) — this component only
 * toggles which pre-highlighted snippet is visible, no client-side
 * highlighting.
 */
export default function CodeEditor({ snippets, idleConsoleText, ranConsoleText }: CodeEditorProps) {
  const [activeLang, setActiveLang] = useState(snippets[0]?.lang ?? "cs");
  const [ran, setRan] = useState(false);

  const active = snippets.find((s) => s.lang === activeLang) ?? snippets[0];
  if (!active) return null;

  return (
    <div
      style={{
        transform: "rotate(-1.1deg)",
        background: "var(--editor-bg)",
        border: "1px solid var(--editor-border)",
        borderRadius: 16,
        boxShadow: "0 40px 80px -30px rgba(0,0,0,.6), 0 0 0 1px rgba(255,255,255,0.02) inset",
        overflow: "hidden",
        backdropFilter: "blur(18px)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 10,
          padding: "12px 16px",
          borderBottom: "1px solid var(--editor-border)",
        }}
      >
        <div style={{ display: "flex", gap: 6 }}>
          <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#FF5F57" }} />
          <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#FEBC2E" }} />
          <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#28C840" }} />
        </div>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 11.5, color: "var(--editor-dim)" }}>{active.filename}</div>
        <div style={{ width: 42 }} />
      </div>

      <div style={{ display: "flex", gap: 6, padding: "10px 14px", borderBottom: "1px solid var(--editor-border)" }}>
        {snippets.map((snippet) => {
          const isActive = snippet.lang === activeLang;
          return (
            <button
              key={snippet.lang}
              type="button"
              onClick={() => setActiveLang(snippet.lang)}
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 11.5,
                padding: "6px 11px",
                borderRadius: 7,
                cursor: "pointer",
                border: `1px solid ${isActive ? "var(--accent)" : "var(--editor-border)"}`,
                background: isActive ? "color-mix(in oklab, var(--accent) 16%, transparent)" : "transparent",
                color: isActive ? "var(--accent-text)" : "var(--editor-dim)",
                transition: "all .2s ease",
              }}
            >
              {snippet.tabLabel}
            </button>
          );
        })}
      </div>

      <div
        className="dg-code-scroll"
        style={{ display: "flex", padding: "16px 0", fontFamily: "var(--font-mono)", fontSize: 12, lineHeight: 1.9, overflowX: "auto" }}
      >
        <div style={{ flex: "0 0 auto", padding: "0 12px 0 16px", textAlign: "right", userSelect: "none" }}>
          {active.lines.map((_, i) => (
            <div key={i} style={{ color: "var(--editor-linenum)" }}>
              {i + 1}
            </div>
          ))}
        </div>
        <div style={{ flex: "1 1 auto", paddingRight: 16, whiteSpace: "pre" }}>
          {active.lines.map((html, i) => (
            // eslint-disable-next-line react/no-danger -- build-time Shiki output, not user input
            <div key={i} dangerouslySetInnerHTML={{ __html: html }} />
          ))}
        </div>
      </div>

      <div
        style={{
          borderTop: "1px solid var(--editor-border)",
          padding: "12px 16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
        }}
      >
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 11.5,
            color: "var(--editor-console)",
            flex: 1,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {ran ? ranConsoleText : idleConsoleText}
        </div>
        <button
          type="button"
          onClick={() => setRan(true)}
          style={{
            flex: "0 0 auto",
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            background: "var(--accent)",
            color: "var(--accent-contrast)",
            border: "none",
            padding: "7px 13px",
            borderRadius: 7,
            fontFamily: "var(--font-mono)",
            fontSize: 11.5,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Run ▷
        </button>
      </div>
    </div>
  );
}
