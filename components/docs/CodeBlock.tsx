"use client";

import { useCallback, useState, type ReactNode } from "react";
import { Check, Copy } from "lucide-react";

type Lang = "bash" | "rust" | "json" | "yaml" | "output" | "text";

const safe = "var(--color-safe)";
const review = "var(--color-review)";
const danger = "var(--color-danger)";
const muted = "var(--color-ink-muted)";
const sec = "var(--color-ink-secondary)";
const link = "var(--color-link)";
const violet = "var(--color-violet)";

/* Restrained, on-token highlighter. No rainbow themes — comments muted,
 * verdict tokens in the verdict palette, strings/keywords in subtle accents. */
function highlightLine(line: string, lang: Lang): ReactNode {
  // Whole-line comment
  const isComment =
    (lang === "rust" && line.trimStart().startsWith("//")) ||
    (lang === "bash" && line.trimStart().startsWith("#")) ||
    (lang === "yaml" && line.trimStart().startsWith("#"));
  if (isComment) {
    // keep inline DANGER/WARNING emphasis even inside a comment
    return colorTokens(line, muted);
  }

  if (lang === "output") return colorTokens(line, sec);
  if (lang === "json") return highlightJsonOrYaml(line, "json");
  if (lang === "yaml") return highlightJsonOrYaml(line, "yaml");
  if (lang === "rust") return highlightRust(line);
  if (lang === "bash") return highlightBash(line);
  return <span style={{ color: sec }}>{line || " "}</span>;
}

const VERDICT_RE =
  /(DANGER|REVIEW|SAFE|FAIL|PASS|WARNING|\b\d+ danger\b|\b\d+ review\b|\b\d+ safe\b)/g;
/* Global regexes keep lastIndex between .test() calls, which silently skips
 * matches — always test split parts with a fresh anchored, non-global regex. */
const VERDICT_TEST =
  /^(DANGER|REVIEW|SAFE|FAIL|PASS|WARNING|\d+ danger|\d+ review|\d+ safe)$/;

function verdictColor(tok: string): string {
  if (/danger/i.test(tok)) return danger;
  if (/review/i.test(tok)) return review;
  if (/safe/i.test(tok)) return safe;
  if (/^FAIL$/.test(tok) || /WARNING/.test(tok)) return danger;
  if (/^PASS$/.test(tok)) return safe;
  return sec;
}

/* Split a line on verdict tokens and color those tokens, base color the rest. */
function colorTokens(line: string, base: string): ReactNode {
  if (!line) return " ";
  const parts = line.split(VERDICT_RE);
  return parts.map((p, i) =>
    VERDICT_TEST.test(p) ? (
      <span key={i} style={{ color: verdictColor(p), fontWeight: 600 }}>
        {p}
      </span>
    ) : (
      <span key={i} style={{ color: base }}>
        {p}
      </span>
    ),
  );
}

function highlightBash(line: string): ReactNode {
  // command name (first word) in ink, flags in violet, rest secondary
  const flagRe = /(--?[A-Za-z][\w-]*)/g;
  const flagTest = /^--?[A-Za-z][\w-]*$/;
  const parts = line.split(flagRe);
  return parts.map((p, i) =>
    flagTest.test(p) ? (
      <span key={i} style={{ color: violet }}>
        {p}
      </span>
    ) : (
      <span key={i} style={{ color: sec }}>
        {p}
      </span>
    ),
  );
}

function highlightRust(line: string): ReactNode {
  const kwRe =
    /(\bpub\b|\bfn\b|\bimpl\b|\bstruct\b|\blet\b|\bmatch\b|\bself\b|\btodo!\b|->)/g;
  const kwTest = /^(pub|fn|impl|struct|let|match|self|todo!|->)$/;
  const parts = line.split(kwRe);
  return parts.map((p, i) =>
    kwTest.test(p) ? (
      <span key={i} style={{ color: review }}>
        {p}
      </span>
    ) : (
      <span key={i} style={{ color: sec }}>
        {p}
      </span>
    ),
  );
}

function highlightJsonOrYaml(line: string, kind: "json" | "yaml"): ReactNode {
  // keys → link color, strings → secondary, punctuation muted
  const keyRe =
    kind === "json"
      ? /("[\w.-]+")(\s*:)/
      : /^(\s*)([\w.-]+)(:)/;
  const m = line.match(keyRe);
  if (m) {
    const before = line.slice(0, (m.index ?? 0) + m[1].length);
    const rest = line.slice((m.index ?? 0) + m[0].length);
    if (kind === "json") {
      return (
        <>
          <span style={{ color: link }}>{m[1]}</span>
          <span style={{ color: muted }}>{m[2]}</span>
          <span style={{ color: sec }}>{rest}</span>
        </>
      );
    }
    return (
      <>
        <span>{m[1]}</span>
        <span style={{ color: link }}>{m[2]}</span>
        <span style={{ color: muted }}>{m[3]}</span>
        <span style={{ color: sec }}>{rest}</span>
      </>
    );
  }
  return <span style={{ color: sec }}>{line || " "}</span>;
}

interface CodeBlockProps {
  code: string;
  lang?: Lang;
  /** optional filename / label chip shown in the header */
  filename?: string;
  /** hide the copy button (e.g. for pure output blocks you don't paste) */
  copyable?: boolean;
}

export function CodeBlock({
  code,
  lang = "text",
  filename,
  copyable = true,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard blocked */
    }
  }, [code]);

  const lines = code.replace(/\n$/, "").split("\n");

  return (
    <div
      className="not-prose my-6 overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface-2)]"
      style={{ boxShadow: "var(--shadow-card)" }}
    >
      {/* Header: filename chip + lang + copy */}
      <div className="flex items-center justify-between gap-3 border-b border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2">
        <span
          className="truncate text-[11px] font-medium text-[var(--color-ink-muted)]"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          {filename ?? lang}
        </span>
        {copyable && (
          <button
            type="button"
            onClick={handleCopy}
            aria-label={copied ? "Copied to clipboard" : "Copy code"}
            className="flex flex-shrink-0 items-center gap-1.5 rounded-md border border-[var(--color-border)] px-2 py-1 text-[11px] font-medium text-[var(--color-ink-muted)] transition-colors duration-100 hover:border-[var(--color-ink-muted)] hover:text-[var(--color-ink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            {copied ? (
              <Check size={12} aria-hidden="true" style={{ color: "var(--color-safe)" }} />
            ) : (
              <Copy size={12} aria-hidden="true" />
            )}
            {copied ? "Copied" : "Copy"}
          </button>
        )}
      </div>

      {/* Body — scrolls horizontally inside the block only */}
      <div className="overflow-x-auto overscroll-x-contain" style={{ WebkitOverflowScrolling: "touch" }}>
        <pre className="w-max min-w-full px-4 py-3.5">
          <code
            className="block text-[12px] leading-[1.7] sm:text-[12.5px]"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            {lines.map((line, i) => (
              <span key={i} className="block whitespace-pre">
                {highlightLine(line, lang)}
              </span>
            ))}
          </code>
        </pre>
      </div>
    </div>
  );
}
