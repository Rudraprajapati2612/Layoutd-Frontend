"use client";

import { motion } from "framer-motion";
import { Wordmark } from "./Wordmark";

const VERDICTS = [
  {
    key: "safe" as const,
    label: "SAFE",
    color: "var(--color-safe)",
    bg: "var(--color-safe-bg)",
    border: "var(--color-safe)",
    headline: "Proven. Auto-generated.",
    description:
      "A provably-correct transformation exists. layoutd emits complete migration logic — no human input required, no offset math to verify.",
    examples: [
      "Field appended at struct end",
      "Field renamed — same type and position",
      "Zero byte shift on existing fields",
    ],
  },
  {
    key: "review" as const,
    label: "REVIEW",
    color: "var(--color-review)",
    bg: "var(--color-review-bg)",
    border: "var(--color-review)",
    headline: "Probably safe. Human eyes needed.",
    description:
      "Migration code is generated with a warning. Correctness depends on context the tool cannot see — CI policy decides whether to auto-pass or require approval.",
    examples: [
      "Type widened — u8 → u16, same signedness",
      "Mid-struct insert — Borsh, matched by name",
      "Field reordered — Borsh only",
    ],
  },
  {
    key: "danger" as const,
    label: "DANGER",
    color: "var(--color-danger)",
    bg: "var(--color-danger-bg)",
    border: "var(--color-danger)",
    headline: "No provable path. Fails CI.",
    description:
      "No automatically-correct transformation exists. CI fails by default. Shipping requires an explicit, recorded acknowledgement naming the exact field and change.",
    examples: [
      "Field removed — data lost, offsets shift",
      "Mid-struct insert — zero-copy alignment required",
      "Type reinterpreted — bytes change meaning",
    ],
  },
] as const;

export function RiskModel() {
  return (
    <section
      aria-labelledby="risk-heading"
      className="py-24 md:py-32 bg-[var(--color-surface)] border-t border-b border-[var(--color-border)]"
    >
      <div className="mx-auto max-w-[1120px] px-6">
        {/* Header */}
        <div className="mb-14">
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-[var(--color-ink-muted)]"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            The risk model
          </motion.p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-end">
            <motion.h2
              id="risk-heading"
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.4, ease: "easeOut", delay: 0.06 }}
              className="text-4xl md:text-5xl font-semibold text-[var(--color-ink)] leading-[1.08]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Three tiers. No grey area.
            </motion.h2>

            {/* Pull-quote with Wordmark */}
            <motion.blockquote
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.4, ease: "easeOut", delay: 0.1 }}
              className="border-l-[3px] border-[var(--color-accent)] pl-5"
            >
              <p
                className="text-[17px] leading-snug font-medium text-[var(--color-ink)]"
                style={{ fontFamily: "var(--font-display)" }}
              >
                <Wordmark size="inherit" /> never refuses to help —
                <br />
                <em className="not-italic text-[var(--color-accent)]">
                  it refuses to let danger be silent.
                </em>
              </p>
            </motion.blockquote>
          </div>
        </div>

        {/* Verdict cards — equal height via items-stretch */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 items-stretch">
          {VERDICTS.map((v, i) => (
            <motion.div
              key={v.key}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.4, ease: "easeOut", delay: i * 0.09 }}
              className="rounded-[var(--radius-xl)] border p-6 flex flex-col gap-4"
              style={{ borderColor: v.border, backgroundColor: v.bg, boxShadow: "var(--shadow-card)" }}
            >
              {/* Verdict badge */}
              <div>
                <span
                  className="inline-flex items-center rounded-full border px-2.5 py-[3px] text-[10px] font-bold tracking-widest"
                  style={{
                    fontFamily: "var(--font-mono)",
                    color: v.color,
                    borderColor: v.border,
                    background: "rgba(255,255,255,0.75)",
                  }}
                >
                  {v.label}
                </span>
              </div>

              {/* Headline + description */}
              <div>
                <p className="mb-1.5 text-[13.5px] font-semibold text-[var(--color-ink)]">
                  {v.headline}
                </p>
                <p className="text-[12.5px] leading-relaxed text-[var(--color-ink-secondary)]">
                  {v.description}
                </p>
              </div>

              {/* Examples — pushed to bottom */}
              <ul className="space-y-1.5 mt-auto">
                {v.examples.map((ex, j) => (
                  <li
                    key={j}
                    className="flex items-start gap-2 text-[11.5px] text-[var(--color-ink-secondary)]"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    <span
                      className="mt-[5px] h-1.5 w-1.5 flex-shrink-0 rounded-full"
                      style={{ backgroundColor: v.color }}
                      aria-hidden="true"
                    />
                    {ex}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Acknowledgement strip — always fully visible inside section */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.4, ease: "easeOut", delay: 0.28 }}
          className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-5 flex flex-col sm:flex-row gap-4 sm:gap-6 items-start"
          style={{ boxShadow: "var(--shadow-card)" }}
        >
          <span
            className="flex-shrink-0 text-[var(--color-danger)] font-medium text-sm"
            style={{ fontFamily: "var(--font-mono)" }}
            aria-hidden="true"
          >
            ⊕ ACK
          </span>
          <div>
            <p className="text-[13.5px] font-semibold text-[var(--color-ink)] mb-1">
              Shipping danger requires acknowledgement
            </p>
            <p className="text-[13px] leading-relaxed text-[var(--color-ink-secondary)]">
              A DANGER verdict fails CI by default. To override, the CI config must
              explicitly name the exact field and change being acknowledged. The
              danger cannot be silent — it becomes a permanent, audited decision in
              your version history.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
