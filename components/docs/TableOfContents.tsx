"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

interface Heading {
  id: string;
  text: string;
  level: 2 | 3;
}

/* "On this page" — auto-generated from the current article's h2/h3 ids, with an
 * IntersectionObserver scroll-spy that highlights the section in view. */
export function TableOfContents() {
  const pathname = usePathname();
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string>("");
  const activeRef = useRef("");

  // Re-scan headings whenever the route changes.
  useEffect(() => {
    const article = document.querySelector("article");
    if (!article) return;
    const nodes = Array.from(
      article.querySelectorAll<HTMLElement>("h2[id], h3[id]"),
    );
    const hs: Heading[] = nodes.map((n) => ({
      id: n.id,
      text: n.textContent?.replace(/#$/, "").trim() ?? "",
      level: n.tagName === "H2" ? 2 : 3,
    }));
    setHeadings(hs);
    setActiveId(hs[0]?.id ?? "");
  }, [pathname]);

  // Scroll-spy.
  useEffect(() => {
    if (headings.length === 0) return;
    const els = headings
      .map((h) => document.getElementById(h.id))
      .filter((el): el is HTMLElement => !!el);

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) {
          activeRef.current = visible[0].target.id;
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: "-80px 0px -70% 0px", threshold: [0, 1] },
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <nav aria-label="On this page" className="text-[13px]">
      <p
        className="mb-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--color-ink-muted)]"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        On this page
      </p>
      <ul className="space-y-1 border-l border-[var(--color-border)]">
        {headings.map((h) => {
          const active = h.id === activeId;
          return (
            <li key={h.id}>
              <a
                href={`#${h.id}`}
                className={[
                  "-ml-px block border-l-2 py-1 transition-colors duration-150",
                  h.level === 3 ? "pl-6" : "pl-4",
                  active
                    ? "border-[var(--color-accent)] font-medium text-[var(--color-accent)]"
                    : "border-transparent text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]",
                ].join(" ")}
              >
                {h.text}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
