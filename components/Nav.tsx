"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Copy, ExternalLink, Menu, X } from "lucide-react";
import { Wordmark } from "./Wordmark";

const INSTALL_CMD = "cargo install layoutd";
const GITHUB_URL = "https://github.com/Rudraprajapati2612/layoutd-cli";
const CRATES_URL = "https://crates.io/crates/layoutd";

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [copied, setCopied] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 32);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  /* Close mobile menu on resize */
  useEffect(() => {
    const handler = () => {
      if (window.innerWidth >= 768) setMenuOpen(false);
    };
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  /* Escape closes the mobile menu and returns focus to the hamburger */
  const hamburgerRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        hamburgerRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(INSTALL_CMD);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard blocked */
    }
  }, []);

  return (
    <>
      <header
        role="banner"
        className={[
          "fixed inset-x-0 top-0 z-50 transition-all duration-200",
          scrolled
            ? "backdrop-blur-[12px] bg-[rgba(245,242,236,0.90)] shadow-[var(--shadow-nav)]"
            : "bg-transparent",
        ].join(" ")}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <nav
            aria-label="Primary navigation"
            className="flex h-[56px] items-center justify-between gap-4"
          >
            {/* ── Wordmark ── */}
            <a
              href="/"
              aria-label="layoutd — home"
              className="flex-shrink-0 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2"
            >
              <Wordmark size="md" />
            </a>

            {/* ── Desktop nav links ── */}
            <div className="hidden md:flex items-center gap-1">
              {[
                { label: "Docs", href: "/docs", external: false },
                { label: "GitHub", href: GITHUB_URL, external: true },
                { label: "crates.io", href: CRATES_URL, external: true },
              ].map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  {...(link.external
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                  className="flex items-center gap-1 rounded-md px-3 py-1.5 text-[13px] font-medium text-[var(--color-ink-secondary)] hover:text-[var(--color-ink)] hover:bg-[var(--color-surface)] transition-all duration-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
                >
                  {link.label}
                  {link.external && (
                    <ExternalLink size={11} aria-hidden="true" className="opacity-50" />
                  )}
                </a>
              ))}
            </div>

            {/* ── Right: pill + CTA ── */}
            <div className="flex items-center gap-2 flex-shrink-0">
              {/* Version pill */}
              <span
                className="hidden sm:inline-flex items-center rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-2.5 py-[3px] text-[11px] font-medium text-[var(--color-ink-muted)] select-none"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                v0.1
              </span>

              {/* CTA — copy button */}
              <button
                type="button"
                onClick={handleCopy}
                aria-label={copied ? "Copied to clipboard" : `Copy: ${INSTALL_CMD}`}
                className={[
                  "hidden sm:flex items-center gap-2 rounded-[var(--radius-md)] px-3.5 py-[7px]",
                  "text-[12px] font-medium border transition-all duration-150",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2",
                  "active:scale-[0.97]",
                  copied
                    ? "bg-[var(--color-safe-bg)] border-[var(--color-safe)] text-[var(--color-safe)]"
                    : "bg-[var(--color-accent)] border-[var(--color-accent)] text-white hover:bg-[var(--color-accent-hover)] hover:border-[var(--color-accent-hover)]",
                ].join(" ")}
                style={{ fontFamily: "var(--font-mono)" }}
              >
                {copied ? (
                  <Check size={11} aria-hidden="true" />
                ) : (
                  <Copy size={11} aria-hidden="true" />
                )}
                {copied ? "Copied!" : "cargo install layoutd"}
              </button>

              {/* Mobile hamburger */}
              <button
                ref={hamburgerRef}
                type="button"
                aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
                aria-expanded={menuOpen}
                aria-controls="mobile-menu"
                onClick={() => setMenuOpen((o) => !o)}
                className="flex md:hidden items-center justify-center w-9 h-9 rounded-md text-[var(--color-ink-secondary)] hover:text-[var(--color-ink)] hover:bg-[var(--color-surface)] transition-colors duration-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
              >
                {menuOpen ? <X size={18} aria-hidden="true" /> : <Menu size={18} aria-hidden="true" />}
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* ── Mobile menu overlay ── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-menu"
            role="navigation"
            aria-label="Mobile navigation"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.16, ease: "easeOut" }}
            className="fixed inset-x-0 top-[56px] z-40 md:hidden border-b border-[var(--color-border)] bg-[rgba(245,242,236,0.98)] backdrop-blur-[12px] px-4 pt-4 pb-5 space-y-1"
          >
            {[
              { label: "Docs", href: "/docs", external: false },
              { label: "GitHub", href: GITHUB_URL, external: true },
              { label: "crates.io", href: CRATES_URL, external: true },
            ].map((link) => (
              <a
                key={link.label}
                href={link.href}
                {...(link.external
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-1.5 rounded-lg px-3 py-2.5 text-sm font-medium text-[var(--color-ink-secondary)] hover:text-[var(--color-ink)] hover:bg-[var(--color-surface)] transition-colors duration-100"
              >
                {link.label}
                {link.external && (
                  <ExternalLink size={12} aria-hidden="true" className="opacity-40" />
                )}
              </a>
            ))}

            <div className="mt-3 pt-3 border-t border-[var(--color-border)]">
              <button
                type="button"
                onClick={() => { handleCopy(); setMenuOpen(false); }}
                className="flex w-full items-center gap-2.5 rounded-lg bg-[var(--color-accent)] px-4 py-3 text-[13px] font-medium text-white"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                {copied ? <Check size={13} aria-hidden="true" /> : <Copy size={13} aria-hidden="true" />}
                {copied ? "Copied!" : INSTALL_CMD}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
