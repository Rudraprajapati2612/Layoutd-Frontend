import type { ReactNode } from "react";

type Kind = "safe" | "review" | "danger";

const MAP: Record<Kind, { label: string; color: string; bg: string }> = {
  safe: { label: "SAFE", color: "var(--color-safe)", bg: "var(--color-safe-bg)" },
  review: { label: "REVIEW", color: "var(--color-review)", bg: "var(--color-review-bg)" },
  danger: { label: "DANGER", color: "var(--color-danger)", bg: "var(--color-danger-bg)" },
};

/** Small verdict pill used inline in change-cases and the risk model. */
export function Verdict({ kind, children }: { kind: Kind; children?: ReactNode }) {
  const v = MAP[kind];
  return (
    <span
      className="not-prose inline-flex items-center gap-1.5 rounded-full border px-2.5 py-[3px] text-[10px] font-bold tracking-widest align-middle"
      style={{
        fontFamily: "var(--font-mono)",
        color: v.color,
        borderColor: v.color,
        backgroundColor: v.bg,
      }}
    >
      {children ?? v.label}
    </span>
  );
}
