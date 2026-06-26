"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Check, Copy, ArrowRight } from "lucide-react";

const INSTALL_CMD = "cargo install layoutd";

function fadeUp(delay: number) {
  return {
    initial: { opacity: 0, y: 22 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.55, ease: "easeOut" as const, delay },
  };
}

export function Hero() {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(INSTALL_CMD);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch { /* ignore */ }
  }, []);

  return (
    <section
      aria-labelledby="hero-heading"
      className="relative pt-24 pb-14 sm:pt-32 sm:pb-18 lg:pt-40 lg:pb-20 overflow-hidden"
    >
      {/* Warm radial light source */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute left-1/2 top-0 -translate-x-1/2 h-[480px] w-[800px] opacity-30"
          style={{
            background:
              "radial-gradient(ellipse 60% 55% at 50% 0%, rgba(194,86,46,0.18) 0%, transparent 100%)",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Label pill */}
        <motion.div {...fadeUp(0)} className="mb-7 flex items-center gap-3">
          <span
            className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1 text-[11px] font-medium text-[var(--color-ink-muted)]"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            <span
              className="h-1.5 w-1.5 rounded-full bg-[var(--color-safe)]"
              aria-hidden="true"
            />
            Solana · Anchor · Rust · CI-native
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          id="hero-heading"
          {...fadeUp(0.07)}
          className="mb-7 max-w-3xl text-4xl sm:text-5xl lg:text-[66px] font-semibold leading-[1.07] tracking-tight text-[var(--color-ink)]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Change an account.{" "}
          <span className="text-[var(--color-accent)]">
            Don&apos;t corrupt
          </span>{" "}
          the chain.
        </motion.h1>

        {/* Subheading */}
        <motion.p
          {...fadeUp(0.14)}
          className="mb-10 max-w-xl text-[17px] sm:text-lg leading-[1.7] text-[var(--color-ink-secondary)]"
        >
          layoutd diffs two versions of your on-chain account layout, generates
          provably-safe migration code, and blocks the unsafe upgrade in CI —
          without ever touching the blockchain.
        </motion.p>

        {/* CTAs */}
        <motion.div
          {...fadeUp(0.21)}
          className="flex flex-col sm:flex-row items-start sm:items-center gap-3"
        >
          {/* Primary — install pill */}
          <button
            type="button"
            onClick={handleCopy}
            aria-label={copied ? "Copied" : `Copy install command: ${INSTALL_CMD}`}
            className={[
              "group relative flex items-center gap-3 rounded-[var(--radius-lg)] border px-5 py-[13px]",
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
                "text-[var(--color-ink-muted)] transition-colors duration-100",
                copied ? "" : "group-hover:text-[var(--color-accent)]",
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

          {/* Secondary — docs */}
          <a
            href="/docs"
            className="group flex items-center gap-1.5 rounded-[var(--radius-md)] px-4 py-[13px] text-[14px] font-medium text-[var(--color-link)] hover:text-[var(--color-link-hover)] transition-colors duration-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2"
          >
            Read the docs
            <ArrowRight
              size={14}
              aria-hidden="true"
              className="transition-transform duration-100 group-hover:translate-x-0.5"
            />
          </a>
        </motion.div>

        {/* Trust guarantees */}
        <motion.div
          {...fadeUp(0.28)}
          className="mt-10 flex flex-wrap items-center gap-x-5 gap-y-2"
        >
          {[
            "Never emits an unprovable migration",
            "Zero false-safe verdicts",
            "Deterministic + version-pinned",
          ].map((item) => (
            <span
              key={item}
              className="flex items-center gap-1.5 text-[11.5px] text-[var(--color-ink-muted)]"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              <span
                className="h-1 w-1 rounded-full bg-[var(--color-safe)] flex-shrink-0"
                aria-hidden="true"
              />
              {item}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
