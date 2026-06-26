import type { ReactNode } from "react";
import { Info, AlertTriangle, ShieldAlert } from "lucide-react";

type Type = "note" | "warning" | "danger";

const MAP: Record<
  Type,
  { color: string; bg: string; label: string; Icon: typeof Info }
> = {
  note: {
    color: "var(--color-link)",
    bg: "var(--color-surface-2)",
    label: "Note",
    Icon: Info,
  },
  warning: {
    color: "var(--color-review)",
    bg: "var(--color-review-bg)",
    label: "Warning",
    Icon: AlertTriangle,
  },
  danger: {
    color: "var(--color-danger)",
    bg: "var(--color-danger-bg)",
    label: "Danger",
    Icon: ShieldAlert,
  },
};

export function Callout({
  type = "note",
  title,
  children,
}: {
  type?: Type;
  title?: string;
  children: ReactNode;
}) {
  const c = MAP[type];
  const Icon = c.Icon;
  return (
    <div
      className="not-prose my-6 flex gap-3 rounded-[var(--radius-md)] border border-[var(--color-border)] px-4 py-3.5"
      style={{ backgroundColor: c.bg, borderLeft: `3px solid ${c.color}` }}
    >
      <Icon
        size={17}
        aria-hidden="true"
        className="mt-0.5 flex-shrink-0"
        style={{ color: c.color }}
      />
      <div className="min-w-0">
        <p
          className="mb-1 text-[12px] font-semibold uppercase tracking-wider"
          style={{ color: c.color, fontFamily: "var(--font-mono)" }}
        >
          {title ?? c.label}
        </p>
        <div className="text-[14px] leading-relaxed text-[var(--color-ink-secondary)] [&_a]:text-[var(--color-link)] [&_a]:underline [&_code]:font-[var(--font-mono)] [&_code]:text-[13px] [&_code]:text-[var(--color-ink)]">
          {children}
        </div>
      </div>
    </div>
  );
}
