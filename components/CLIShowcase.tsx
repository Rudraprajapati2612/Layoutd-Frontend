"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

const COMMAND = "layoutd diff --v1 state_v1.rs --v2 state_v2.rs";
const PROMPT_PATH = "~/solana-project";
const CHAR_DELAY = 23; // ms per character
const CMD_PAUSE_MS = 580; // pause after command finishes

/* ── Sub-components ─────────────────────────────────────── */

function ParseLine({
  v,
  fields,
  bytes,
}: {
  v: "v1" | "v2";
  fields: number;
  bytes: number;
}) {
  return (
    <div className="flex items-baseline whitespace-nowrap">
      <span className="text-[var(--color-ink-muted)]">»&nbsp;parsing&nbsp;</span>
      <span
        className="font-semibold text-[var(--color-link)]"
        style={{ minWidth: "2.5rem" }}
      >
        {v}
      </span>
      <span
        className="text-[var(--color-ink-secondary)]"
        style={{ minWidth: "6.5rem" }}
      >
        UserState
      </span>
      <span className="text-[var(--color-ink-muted)]">
        {fields}&nbsp;fields&nbsp;·&nbsp;
      </span>
      <span className="text-[var(--color-ink-secondary)]">{bytes}&nbsp;bytes</span>
      <span className="text-[var(--color-ink-muted)]">&nbsp;&nbsp;(borsh)</span>
    </div>
  );
}

function FieldLine({
  verdict,
  name,
  type_,
  desc,
}: {
  verdict: "SAFE" | "REVIEW" | "DANGER";
  name: string;
  type_: string;
  desc: string;
}) {
  const colorMap: Record<string, string> = {
    SAFE: "var(--color-safe)",
    REVIEW: "var(--color-review)",
    DANGER: "var(--color-danger)",
  };
  const color = colorMap[verdict];
  return (
    <div className="flex items-baseline whitespace-nowrap">
      <span
        className="font-bold"
        style={{ color, minWidth: "6rem" }}
      >
        [{verdict}]
      </span>
      <span
        className="font-medium text-[var(--color-ink)]"
        style={{ minWidth: "5.5rem" }}
      >
        {name}
      </span>
      <span
        className="text-[var(--color-link)]"
        style={{ minWidth: "4rem" }}
      >
        {type_}
      </span>
      <span className="text-[var(--color-ink-secondary)]">{desc}</span>
    </div>
  );
}

function SummaryLine() {
  return (
    <div className="flex items-baseline whitespace-nowrap">
      <span className="font-semibold text-[var(--color-violet)]">⟹&nbsp;&nbsp;</span>
      <span className="font-bold text-[var(--color-danger)]">2 DANGER</span>
      <span className="text-[var(--color-ink-muted)]">&nbsp;·&nbsp;</span>
      <span className="text-[var(--color-ink-secondary)]">0 REVIEW</span>
      <span className="text-[var(--color-ink-muted)]">&nbsp;·&nbsp;</span>
      <span className="text-[var(--color-ink-secondary)]">2 SAFE</span>
      <span className="text-[var(--color-ink-muted)]">&nbsp;&nbsp;&nbsp;exit 1</span>
    </div>
  );
}

/* ── Output lines (each line + reveal delay in ms after cmd finishes) ─ */
const OUTPUT_LINES = [
  { el: <ParseLine v="v1" fields={3} bytes={41} />, delay: 0 },
  { el: <ParseLine v="v2" fields={4} bytes={42} />, delay: 160 },
  { el: <div className="h-[0.55em]" aria-hidden="true" />, delay: 300 },
  {
    el: (
      <FieldLine
        verdict="SAFE"
        name="authority"
        type_="Pubkey"
        desc="no change             offset: 0"
      />
    ),
    delay: 430,
  },
  {
    el: (
      <FieldLine
        verdict="DANGER"
        name="is_active"
        type_="bool"
        desc="inserted at offset 32"
      />
    ),
    delay: 600,
  },
  {
    el: (
      <FieldLine
        verdict="DANGER"
        name="balance"
        type_="u64"
        desc="offset shifted   32 → 33"
      />
    ),
    delay: 760,
  },
  {
    el: (
      <FieldLine
        verdict="SAFE"
        name="bump"
        type_="u8"
        desc="offset shifted   40 → 41"
      />
    ),
    delay: 920,
  },
  { el: <div className="h-[0.55em]" aria-hidden="true" />, delay: 1070 },
  { el: <SummaryLine />, delay: 1200 },
];

/* ── Main component ──────────────────────────────────────── */
export function CLIShowcase() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 });
  const shouldReduceMotion = useReducedMotion();
  const immediate = !!shouldReduceMotion;

  const [cmdCount, setCmdCount] = useState(immediate ? COMMAND.length : 0);
  const [revealedCount, setRevealedCount] = useState(
    immediate ? OUTPUT_LINES.length : 0
  );

  useEffect(() => {
    if (!isInView) return;
    if (immediate) {
      setCmdCount(COMMAND.length);
      setRevealedCount(OUTPUT_LINES.length);
      return;
    }

    const timers: ReturnType<typeof setTimeout>[] = [];

    // Schedule each character of the command (starts at 400ms offset)
    let t = 400;
    for (let i = 1; i <= COMMAND.length; i++) {
      const count = i;
      timers.push(setTimeout(() => setCmdCount(count), t));
      t += CHAR_DELAY;
    }

    // After command + pause, reveal output lines progressively
    t += CMD_PAUSE_MS;
    OUTPUT_LINES.forEach((line, idx) => {
      timers.push(
        setTimeout(() => setRevealedCount(idx + 1), t + line.delay)
      );
    });

    return () => timers.forEach((id) => clearTimeout(id));
  }, [isInView, immediate]);

  const cmdTyped = COMMAND.slice(0, cmdCount);
  const cmdFinished = cmdCount >= COMMAND.length;
  const allDone = revealedCount >= OUTPUT_LINES.length;

  return (
    <section
      ref={sectionRef}
      aria-label="CLI demo — layoutd diff command output"
      className="py-16 sm:py-24"
    >
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Section label */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="mb-8 text-center"
        >
          <p
            className="inline-block text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--color-ink-muted)]"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            Live output
          </p>
        </motion.div>

        {/* Terminal window */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, ease: "easeOut", delay: 0.08 }}
          className="overflow-hidden rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)]"
          style={{ boxShadow: "var(--shadow-showcase)" }}
          role="region"
          aria-label="Terminal output"
        >
          {/* Chrome / titlebar */}
          <div className="flex items-center gap-3 border-b border-[var(--color-border)] bg-[var(--color-surface-2)] px-4 py-3">
            <div className="flex items-center gap-1.5" aria-hidden="true">
              <div className="h-3 w-3 rounded-full bg-[#FF5F57]" />
              <div className="h-3 w-3 rounded-full bg-[#FFBD2E]" />
              <div className="h-3 w-3 rounded-full bg-[#28C840]" />
            </div>
            <div className="flex-1 flex items-center justify-center">
              <span
                className="text-[11px] font-medium tracking-widest text-[var(--color-ink-muted)] uppercase"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                TERMINAL — layoutd diff
              </span>
            </div>
            <div className="w-[60px]" aria-hidden="true" />
          </div>

          {/* Terminal body — overflow-x: auto so it scrolls on narrow screens */}
          <div
            className="overflow-x-auto"
            aria-live="polite"
            aria-label="Command output"
          >
            <div
              className="min-w-max px-5 sm:px-7 py-5 sm:py-7 space-y-[4px] text-[11px] sm:text-[12.5px] leading-[1.8]"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              {/* Command line */}
              <div className="flex items-baseline whitespace-nowrap">
                <span className="text-[var(--color-link)]">{PROMPT_PATH}</span>
                <span className="text-[var(--color-ink-muted)]">&nbsp;$&nbsp;</span>
                <span className="font-medium text-[var(--color-ink)]">
                  {cmdTyped}
                </span>
                {!cmdFinished && (
                  <span
                    className="cursor-blink inline-block"
                    aria-hidden="true"
                    style={{
                      width: "2px",
                      height: "1em",
                      background: "var(--color-ink)",
                      verticalAlign: "text-bottom",
                    }}
                  />
                )}
              </div>

              {/* Output lines — revealed progressively via opacity */}
              {OUTPUT_LINES.map((line, idx) => (
                <div
                  key={idx}
                  className="transition-opacity duration-200"
                  style={{ opacity: idx < revealedCount ? 1 : 0 }}
                >
                  {line.el}
                </div>
              ))}

              {/* Final blinking cursor after all output shown */}
              {allDone && (
                <div className="flex items-baseline whitespace-nowrap">
                  <span className="text-[var(--color-link)]">{PROMPT_PATH}</span>
                  <span className="text-[var(--color-ink-muted)]">&nbsp;$&nbsp;</span>
                  <span
                    className="cursor-blink inline-block"
                    aria-hidden="true"
                    style={{
                      width: "2px",
                      height: "1em",
                      background: "var(--color-ink)",
                      verticalAlign: "text-bottom",
                    }}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Status bar */}
          <div
            className="flex flex-wrap items-center justify-between gap-2 border-t border-[var(--color-border)] bg-[var(--color-surface-2)] px-4 sm:px-5 py-2.5 text-[10.5px] sm:text-[11px]"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            <span className="text-[var(--color-ink-muted)]">exit 1</span>
            <div className="flex items-center gap-3 sm:gap-4 flex-wrap justify-end">
              <span className="text-[var(--color-ink-secondary)]">2 SAFE</span>
              <span className="text-[var(--color-ink-secondary)]">0 REVIEW</span>
              <span className="flex items-center gap-1.5 font-medium text-[var(--color-danger)]">
                <span
                  className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--color-danger)]"
                  aria-hidden="true"
                />
                2 DANGER — migration required
              </span>
            </div>
          </div>
        </motion.div>

        {/* Caption */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.4, delay: 0.6 }}
          className="mt-5 text-center text-[12px] text-[var(--color-ink-muted)]"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          Run{" "}
          <code className="rounded bg-[var(--color-surface-2)] border border-[var(--color-border)] px-1.5 py-0.5 text-[var(--color-ink)]">
            layoutd diff --v1 state_v1.rs --v2 state_v2.rs
          </code>{" "}
          to get a structured risk report in seconds.
        </motion.p>
      </div>
    </section>
  );
}
