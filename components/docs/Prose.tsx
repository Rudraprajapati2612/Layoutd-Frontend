import type { ReactNode } from "react";
import { Children, isValidElement } from "react";

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[`'".]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/** Extract plain text from React children for id generation. */
function textOf(children: ReactNode): string {
  let out = "";
  Children.forEach(children, (c) => {
    if (typeof c === "string" || typeof c === "number") out += c;
    else if (isValidElement(c))
      out += textOf((c.props as { children?: ReactNode }).children);
  });
  return out;
}

/* Section heading — gets an id (for TOC + scroll-spy) and a hover anchor link.
 * scroll-mt accounts for the 56px fixed nav so anchor jumps aren't hidden. */
export function H2({ children }: { children: ReactNode }) {
  const id = slugify(textOf(children));
  return (
    <h2
      id={id}
      className="group scroll-mt-24 mt-14 mb-4 text-[26px] font-semibold leading-tight text-[var(--color-ink)] first:mt-0"
      style={{ fontFamily: "var(--font-display)" }}
    >
      <a href={`#${id}`} className="relative no-underline">
        {children}
        <span
          aria-hidden="true"
          className="ml-2 select-none text-[var(--color-ink-muted)] opacity-0 transition-opacity group-hover:opacity-60"
        >
          #
        </span>
      </a>
    </h2>
  );
}

export function H3({ children }: { children: ReactNode }) {
  const id = slugify(textOf(children));
  return (
    <h3
      id={id}
      className="group scroll-mt-24 mt-10 mb-3 text-[18px] font-semibold leading-snug text-[var(--color-ink)]"
      style={{ fontFamily: "var(--font-display)" }}
    >
      <a href={`#${id}`} className="relative no-underline">
        {children}
        <span
          aria-hidden="true"
          className="ml-2 select-none text-[var(--color-ink-muted)] opacity-0 transition-opacity group-hover:opacity-60"
        >
          #
        </span>
      </a>
    </h3>
  );
}

export function P({ children }: { children: ReactNode }) {
  return (
    <p className="my-4 text-[15.5px] leading-[1.75] text-[var(--color-ink-secondary)]">
      {children}
    </p>
  );
}

export function UL({ children }: { children: ReactNode }) {
  return <ul className="my-4 space-y-2 pl-1">{children}</ul>;
}

export function LI({ children }: { children: ReactNode }) {
  return (
    <li className="flex gap-3 text-[15px] leading-[1.7] text-[var(--color-ink-secondary)]">
      <span
        aria-hidden="true"
        className="mt-[10px] h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[var(--color-accent)]"
      />
      <span className="min-w-0">{children}</span>
    </li>
  );
}

/** Inline code. */
export function C({ children }: { children: ReactNode }) {
  return (
    <code
      className="rounded-[5px] border border-[var(--color-border-subtle)] bg-[var(--color-surface-2)] px-1.5 py-0.5 text-[13px] text-[var(--color-accent)]"
      style={{ fontFamily: "var(--font-mono)" }}
    >
      {children}
    </code>
  );
}

/** Inline link. */
export function A({ href, children }: { href: string; children: ReactNode }) {
  const external = href.startsWith("http");
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className="font-medium text-[var(--color-link)] underline decoration-[var(--color-border)] underline-offset-2 transition-colors hover:text-[var(--color-link-hover)] hover:decoration-[var(--color-link)]"
    >
      {children}
    </a>
  );
}

export function Strong({ children }: { children: ReactNode }) {
  return <strong className="font-semibold text-[var(--color-ink)]">{children}</strong>;
}
