"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Check, Copy, ExternalLink } from "lucide-react";
import { Wordmark } from "./Wordmark";

const INSTALL_CMD = "cargo install layoutd";
const GITHUB_URL = "https://github.com/Rudraprajapati2612/layoutd-cli";
const CRATES_URL = "https://crates.io/crates/layoutd";

export function CTAFooter() {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(INSTALL_CMD);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch { /* ignore */ }
  }, []);

  return (
    <footer>
      {/* ── CTA section ── */}
      <section
        aria-labelledby="footer-cta-heading"
        className="py-24 sm:py-32 border-t border-[var(--color-border)] bg-[var(--color-surface)]"
      >
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-[var(--color-ink-muted)]"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            Open source · MIT OR Apache-2.0
          </motion.p>

          <motion.h2
            id="footer-cta-heading"
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.4, ease: "easeOut", delay: 0.07 }}
            className="mb-5 text-4xl md:text-5xl font-semibold leading-[1.1] tracking-tight text-[var(--color-ink)]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Ship migrations you can{" "}
            <span className="text-[var(--color-accent)]">prove safe.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.4, ease: "easeOut", delay: 0.12 }}
            className="mb-10 text-[16px] text-[var(--color-ink-secondary)] max-w-md mx-auto leading-relaxed"
          >
            One command. Byte-level proof. CI-native. Built for the Solana / Anchor
            ecosystem.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.4, ease: "easeOut", delay: 0.17 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3"
          >
            {/* Install pill */}
            <button
              type="button"
              onClick={handleCopy}
              aria-label={copied ? "Copied" : `Copy install command: ${INSTALL_CMD}`}
              className={[
                "group flex items-center gap-3 rounded-[var(--radius-lg)] border px-5 py-[13px]",
                "text-[13.5px] font-medium transition-all duration-150",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2",
                "active:scale-[0.98]",
                copied
                  ? "bg-[var(--color-safe-bg)] border-[var(--color-safe)] text-[var(--color-safe)]"
                  : "bg-[var(--color-surface)] border-[var(--color-border)] text-[var(--color-ink)] hover:border-[var(--color-accent)] hover:shadow-[var(--shadow-hover)]",
              ].join(" ")}
              style={{ fontFamily: "var(--font-mono)" }}
            >
              <span
                className={[
                  "transition-colors duration-100",
                  copied ? "" : "text-[var(--color-ink-muted)] group-hover:text-[var(--color-accent)]",
                ].join(" ")}
              >
                $
              </span>
              <span>{INSTALL_CMD}</span>
              <span
                className={[
                  "ml-1 transition-colors duration-100",
                  copied
                    ? "text-[var(--color-safe)]"
                    : "text-[var(--color-ink-muted)] group-hover:text-[var(--color-accent)]",
                ].join(" ")}
              >
                {copied ? (
                  <Check size={14} aria-hidden="true" />
                ) : (
                  <Copy size={14} aria-hidden="true" />
                )}
              </span>
            </button>

            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-[var(--radius-md)] px-5 py-[13px] text-sm font-medium text-[var(--color-link)] hover:text-[var(--color-link-hover)] transition-colors duration-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2"
            >
              View on GitHub
              <ExternalLink size={13} aria-hidden="true" />
            </a>
          </motion.div>
        </div>
      </section>

      {/* ── Footer bar ── */}
      <div className="border-t border-[var(--color-border)] bg-[var(--color-surface-2)]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Wordmark */}
            <a
              href="/"
              aria-label="layoutd home"
              className="rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-1"
            >
              <Wordmark size="sm" />
            </a>

            {/* Links */}
            <nav aria-label="Footer navigation" className="flex items-center gap-1 flex-wrap justify-center">
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
                  className="flex items-center gap-1 rounded-md px-2.5 py-1 text-[12px] text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] transition-colors duration-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
                >
                  {link.label}
                  {link.external && (
                    <ExternalLink size={10} aria-hidden="true" className="opacity-40" />
                  )}
                </a>
              ))}
            </nav>

            {/* License */}
            <p
              className="text-[11px] text-[var(--color-ink-muted)]"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              MIT OR Apache-2.0
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
