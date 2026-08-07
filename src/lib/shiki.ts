import { createHighlighter, type ThemedToken } from "shiki";
import { codeSnippets, type CodeSnippet } from "./codeSnippets";

/**
 * Custom Shiki theme matching the hero code editor's palette from the
 * Claude Design source (fixed dark IDE look, independent of site theme).
 * Highlighting runs once at build time — the client ships plain HTML/CSS,
 * no syntax-highlighting JS.
 */
const editorTheme = {
  name: "dg-editor",
  type: "dark" as const,
  colors: {
    "editor.background": "#00000000",
    "editor.foreground": "#EDEFF2",
  },
  settings: [
    { scope: ["comment"], settings: { foreground: "#7C93A0", fontStyle: "italic" } },
    { scope: ["keyword", "storage.type", "storage.modifier", "keyword.control"], settings: { foreground: "#3DDCE6" } },
    {
      scope: ["entity.name.type", "support.type", "entity.name.class", "support.class"],
      settings: { foreground: "#8BB4FF" },
    },
    { scope: ["string", "string.quoted"], settings: { foreground: "#E8B768" } },
    { scope: ["constant.numeric"], settings: { foreground: "#BFEFF3" } },
    { scope: ["entity.name.function", "support.function", "meta.function-call"], settings: { foreground: "#DCE6F0" } },
    { scope: ["variable", "variable.other", "punctuation", "source"], settings: { foreground: "#EDEFF2" } },
  ],
};

export interface HighlightedSnippet {
  lang: CodeSnippet["lang"];
  tabLabel: string;
  filename: string;
  /** Pre-rendered per-line HTML (syntax-colored spans), ready to drop into the DOM. */
  lines: string[];
}

let cached: HighlightedSnippet[] | undefined;

/**
 * Highlights every hero code snippet at build time and returns per-line
 * HTML fragments, so the client island only toggles visibility/tabs.
 */
export async function getHighlightedSnippets(): Promise<HighlightedSnippet[]> {
  if (cached) return cached;

  const highlighter = await createHighlighter({
    themes: [editorTheme],
    langs: ["csharp", "typescript", "python"],
  });

  cached = codeSnippets.map((snippet) => {
    const tokenLines: ThemedToken[][] = highlighter.codeToTokensBase(snippet.code, {
      lang: snippet.shikiLang,
      theme: editorTheme,
    });

    const lines = tokenLines.map((line) => {
      if (line.length === 0) return "&nbsp;";
      return line
        .map((token) => `<span style="color:${token.color ?? "#EDEFF2"}">${escapeHtml(token.content)}</span>`)
        .join("");
    });

    return { lang: snippet.lang, tabLabel: snippet.tabLabel, filename: snippet.filename, lines };
  });

  return cached;
}

function escapeHtml(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
