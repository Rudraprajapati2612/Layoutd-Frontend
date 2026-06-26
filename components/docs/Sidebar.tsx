"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { DOCS_NAV, hrefFor } from "./docs-nav";

/* Sidebar navigation list — shared by the desktop rail and the mobile drawer.
 * Active link gets a terracotta left-accent. */
export function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav aria-label="Docs navigation" className="space-y-7">
      {DOCS_NAV.map((group) => (
        <div key={group.label}>
          <p
            className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--color-ink-muted)]"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            {group.label}
          </p>
          <ul className="space-y-0.5">
            {group.items.map((item) => {
              const href = hrefFor(item.slug);
              const active = pathname === href;
              return (
                <li key={href}>
                  <Link
                    href={href}
                    onClick={onNavigate}
                    aria-current={active ? "page" : undefined}
                    className={[
                      "block border-l-2 py-1.5 pl-3 pr-2 text-[13.5px] transition-colors duration-100",
                      active
                        ? "border-[var(--color-accent)] bg-[var(--color-accent-light)] font-medium text-[var(--color-accent)]"
                        : "border-transparent text-[var(--color-ink-secondary)] hover:border-[var(--color-border)] hover:text-[var(--color-ink)]",
                    ].join(" ")}
                  >
                    {item.title}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}
