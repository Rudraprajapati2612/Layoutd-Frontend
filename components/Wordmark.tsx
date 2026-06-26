"use client";

interface WordmarkProps {
  /** "inherit" uses parent font-size; sm/md/lg set explicit sizes */
  size?: "sm" | "md" | "lg" | "inherit";
  className?: string;
}

const sizes: Record<string, string> = {
  sm:      "text-[13px]",
  md:      "text-[15px]",
  lg:      "text-[18px]",
  inherit: "",          // no size class — inherits parent
};

export function Wordmark({ size = "md", className = "" }: WordmarkProps) {
  const sizeClass = sizes[size] ?? "";
  return (
    <span
      className={["inline-flex items-baseline gap-0", className].join(" ")}
      style={{ fontFamily: "var(--font-mono)" }}
    >
      <span
        className={[
          sizeClass,
          "font-medium text-[var(--color-ink)] tracking-tight select-none",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        layoutd
      </span>
      <span
        aria-hidden="true"
        className={[sizeClass, "font-medium text-[var(--color-accent)] select-none"]
          .filter(Boolean)
          .join(" ")}
        style={{ animation: "blink 1.1s step-end infinite" }}
      >
        _
      </span>
    </span>
  );
}
