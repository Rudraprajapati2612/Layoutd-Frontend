"use client";

import { useEffect, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { SidebarNav } from "./Sidebar";
import { TableOfContents } from "./TableOfContents";
import { PrevNext } from "./PrevNext";
import { lookupByPath } from "./docs-nav";

export function DocsShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const entry = lookupByPath(pathname);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const reduce = useReducedMotion();

  // Close drawer on route change and on desktop resize.
  useEffect(() => setDrawerOpen(false), [pathname]);
  useEffect(() => {
    const handler = () => {
      if (window.innerWidth >= 1024) setDrawerOpen(false);
    };
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  // Lock body scroll while the drawer is open.
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  return (
    <div className="pt-[56px]">
      {/* Mobile sub-bar with the drawer trigger + current page label */}
      <div className="sticky top-[56px] z-30 flex items-center gap-3 border-b border-[var(--color-border)] bg-[rgba(245,242,236,0.92)] px-4 py-2.5 backdrop-blur-[12px] lg:hidden">
        <button
          type="button"
          onClick={() => setDrawerOpen(true)}
          aria-label="Open docs navigation"
          aria-expanded={drawerOpen}
          className="flex items-center gap-2 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-2.5 py-1.5 text-[12px] font-medium text-[var(--color-ink-secondary)] transition-colors hover:text-[var(--color-ink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
        >
          <Menu size={15} aria-hidden="true" />
          Menu
        </button>
        {entry && (
          <span className="truncate text-[12px] text-[var(--color-ink-muted)]">
            <span className="text-[var(--color-ink-muted)]">{entry.group}</span>
            <span className="mx-1.5 text-[var(--color-border)]">/</span>
            <span className="text-[var(--color-ink-secondary)]">{entry.item.title}</span>
          </span>
        )}
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div
              key="scrim"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              onClick={() => setDrawerOpen(false)}
              className="fixed inset-0 z-40 bg-[rgba(30,27,46,0.32)] lg:hidden"
              aria-hidden="true"
            />
            <motion.aside
              key="drawer"
              initial={{ x: reduce ? 0 : "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: reduce ? 0 : "-100%" }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="fixed inset-y-0 left-0 z-50 w-[280px] max-w-[82vw] overflow-y-auto border-r border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-5 lg:hidden"
              aria-label="Docs navigation drawer"
            >
              <div className="mb-5 flex items-center justify-between">
                <span
                  className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[var(--color-ink-muted)]"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  Documentation
                </span>
                <button
                  type="button"
                  onClick={() => setDrawerOpen(false)}
                  aria-label="Close docs navigation"
                  className="flex h-8 w-8 items-center justify-center rounded-md text-[var(--color-ink-secondary)] hover:bg-[var(--color-surface)] hover:text-[var(--color-ink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
                >
                  <X size={17} aria-hidden="true" />
                </button>
              </div>
              <SidebarNav onNavigate={() => setDrawerOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Three-column shell */}
      <div className="mx-auto w-full max-w-[1400px] px-5 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10 xl:grid-cols-[240px_minmax(0,1fr)_200px]">
          {/* Left sidebar (desktop) */}
          <aside className="hidden lg:block">
            <div className="sticky top-[72px] max-h-[calc(100vh-88px)] overflow-y-auto py-10 pr-2">
              <SidebarNav />
            </div>
          </aside>

          {/* Center content */}
          <main className="min-w-0 py-10 lg:py-12">
            <motion.article
              key={pathname}
              initial={reduce ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="mx-auto max-w-[720px]"
            >
              {entry && (
                <header className="mb-8 border-b border-[var(--color-border)] pb-7">
                  <p
                    className="mb-3 text-[12px] font-medium uppercase tracking-[0.16em] text-[var(--color-accent)]"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    {entry.group}
                  </p>
                  <h1
                    className="text-[34px] font-semibold leading-[1.1] text-[var(--color-ink)] sm:text-[40px]"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {entry.item.title}
                  </h1>
                  <p className="mt-3 text-[17px] leading-relaxed text-[var(--color-ink-muted)]">
                    {entry.item.summary}
                  </p>
                </header>
              )}

              {children}
            </motion.article>

            <div className="mx-auto max-w-[720px]">
              <PrevNext />
            </div>
          </main>

          {/* Right TOC (xl only) */}
          <aside className="hidden xl:block">
            <div className="sticky top-[72px] max-h-[calc(100vh-88px)] overflow-y-auto py-12 pl-2">
              <TableOfContents />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
