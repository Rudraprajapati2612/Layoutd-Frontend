"use client";

import { motion } from "framer-motion";

type Verdict = "safe" | "review" | "danger";

const verdictColor: Record<Verdict, string> = {
  safe:   "var(--color-safe)",
  review: "var(--color-review)",
  danger: "var(--color-danger)",
};

const COMMANDS = [
  {
    cmd:     "diff",
    flag:    "--v1 state_v1.rs --v2 state_v2.rs",
    tagline: "What changed, and what's risky.",
    detail:
      "Parses two Anchor account structs, computes byte-level offsets, and classifies every field change as Safe · Review · Danger. Outputs a human-readable report and machine-readable SARIF.",
    output: [
      { v: "safe"   as Verdict, text: "authority  — no change" },
      { v: "danger" as Verdict, text: "is_active  — inserted at offset 32" },
      { v: "danger" as Verdict, text: "balance    — offset shifted 32 → 33" },
    ],
  },
  {
    cmd:     "gen",
    flag:    "--v1 state_v1.rs --v2 state_v2.rs --out migration.rs",
    tagline: "Write the safe migration for me.",
    detail:
      "Emits a complete, compilable Anchor migration instruction for provably-safe cases. Scaffolds dangerous ones behind an explicit acknowledgement. Each output carries a proof annotation.",
    output: [
      { v: "safe" as Verdict, text: "migrate_user_state.rs  — 47 lines" },
      { v: "safe" as Verdict, text: "proof: sha256:3a7f…    — v0.1 pinned" },
    ],
  },
  {
    cmd:     "check",
    flag:    "--v1 state_v1.rs --v2 state_v2.rs",
    tagline: "CI gate. Exit code. No drama.",
    detail:
      "Produces a SARIF 2.1.0 report and exits non-zero on any Danger verdict. Renders inline as GitHub PR annotations. The official GitHub Action wraps this for two-line CI adoption.",
    output: [
      { v: "danger" as Verdict, text: "exit 1  — 2 DANGER detected" },
      { v: "safe"   as Verdict, text: "exit 0  — all changes proven safe" },
    ],
  },
] as const;

export function ThreeCommands() {
  return (
    <section
      aria-labelledby="commands-heading"
      className="py-24 md:py-32 border-t border-[var(--color-border)]"
    >
      <div className="mx-auto max-w-[1120px] px-6">
        {/* Header */}
        <div className="mb-12">
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-[var(--color-ink-muted)]"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            Three commands
          </motion.p>
          <motion.h2
            id="commands-heading"
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.4, ease: "easeOut", delay: 0.06 }}
            className="text-4xl md:text-5xl font-semibold text-[var(--color-ink)]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            The entire surface area of layoutd.
          </motion.h2>
        </div>

        {/* Command cards — grid, all equal height via grid rows */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch">
          {COMMANDS.map((c, i) => (
            <motion.div
              key={c.cmd}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.45, ease: "easeOut", delay: i * 0.08 }}
              className="group relative flex flex-col rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 transition-all duration-200 hover:border-[var(--color-accent)] hover:shadow-[var(--shadow-hover)] hover:-translate-y-0.5"
              style={{ boxShadow: "var(--shadow-card)" }}
            >
              {/* Command header */}
              <div className="mb-4">
                <p
                  className="text-[16px] sm:text-[18px] font-semibold text-[var(--color-ink)] group-hover:text-[var(--color-accent)] transition-colors duration-150 leading-none mb-1.5"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  layoutd {c.cmd}
                </p>
                <p
                  className="text-[10px] text-[var(--color-ink-muted)] truncate"
                  style={{ fontFamily: "var(--font-mono)" }}
                  title={c.flag}
                >
                  {c.flag}
                </p>
              </div>

              {/* Tagline */}
              <p className="mb-2 text-[13px] font-semibold text-[var(--color-ink)]">
                {c.tagline}
              </p>

              {/* Detail — flex-1 to push output chip to bottom */}
              <p className="mb-6 text-[12.5px] leading-relaxed text-[var(--color-ink-secondary)] flex-1">
                {c.detail}
              </p>

              {/* Sample output — all chips same min-height, bottom-aligned */}
              <div
                className="rounded-[var(--radius-md)] border border-[var(--color-border-subtle)] bg-[var(--color-surface-2)] px-3.5 py-3 space-y-2 min-h-[72px] flex flex-col justify-center"
              >
                {c.output.map((line, j) => (
                  <div
                    key={j}
                    className="flex items-start gap-2 text-[11px] leading-snug"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    <span
                      className="mt-[3.5px] h-1.5 w-1.5 flex-shrink-0 rounded-full"
                      style={{ backgroundColor: verdictColor[line.v] }}
                      aria-label={line.v}
                    />
                    <span style={{ color: verdictColor[line.v] }}>{line.text}</span>
                  </div>
                ))}
              </div>

              {/* Hover accent line */}
              <div
                aria-hidden="true"
                className="absolute inset-x-0 bottom-0 h-[2px] rounded-b-[var(--radius-xl)] bg-[var(--color-accent)] scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
