"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { hrefFor, lookupByPath } from "./docs-nav";

/* Prev / Next footer following the sidebar reading order. */
export function PrevNext() {
  const pathname = usePathname();
  const entry = lookupByPath(pathname);
  if (!entry) return null;
  const { prev, next } = entry;

  return (
    <nav
      aria-label="Pagination"
      className="mt-16 grid grid-cols-1 gap-3 border-t border-[var(--color-border)] pt-8 sm:grid-cols-2"
    >
      {prev ? (
        <Link
          href={hrefFor(prev.item.slug)}
          className="group flex flex-col gap-1 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 transition-colors hover:border-[var(--color-ink-muted)]"
        >
          <span className="flex items-center gap-1.5 text-[12px] text-[var(--color-ink-muted)]">
            <ArrowLeft size={13} aria-hidden="true" /> Previous
          </span>
          <span className="text-[14px] font-medium text-[var(--color-ink)] group-hover:text-[var(--color-accent)]">
            {prev.item.title}
          </span>
        </Link>
      ) : (
        <span />
      )}
      {next ? (
        <Link
          href={hrefFor(next.item.slug)}
          className="group flex flex-col items-end gap-1 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-right transition-colors hover:border-[var(--color-ink-muted)] sm:col-start-2"
        >
          <span className="flex items-center gap-1.5 text-[12px] text-[var(--color-ink-muted)]">
            Next <ArrowRight size={13} aria-hidden="true" />
          </span>
          <span className="text-[14px] font-medium text-[var(--color-ink)] group-hover:text-[var(--color-accent)]">
            {next.item.title}
          </span>
        </Link>
      ) : (
        <span />
      )}
    </nav>
  );
}
