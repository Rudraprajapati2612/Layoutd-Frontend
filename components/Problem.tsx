"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { RotateCcw } from "lucide-react";

/* ── Field definitions ────────────────────────────────────── */
type FieldTheme = "auth" | "neutral" | "new" | "shifted";

interface Field {
  key: string;
  label: string;
  type: string;
  range: string;
  units: number;
  theme: FieldTheme;
}

const TOTAL = 42;

const V1: Field[] = [
  { key: "auth",    label: "authority", type: "Pubkey", range: "0–31",  units: 32, theme: "auth" },
  { key: "balance", label: "balance",   type: "u64",    range: "32–39", units: 8,  theme: "neutral" },
  { key: "bump",    label: "b",         type: "u8",     range: "40",    units: 1,  theme: "neutral" },
];

const V2: Field[] = [
  { key: "auth",      label: "authority",  type: "Pubkey", range: "0–31",  units: 32, theme: "auth" },
  { key: "is_active", label: "is_active",  type: "bool",   range: "32",    units: 1,  theme: "new" },
  { key: "balance",   label: "balance",    type: "u64",    range: "33–40", units: 8,  theme: "shifted" },
  { key: "bump",      label: "b",          type: "u8",     range: "41",    units: 1,  theme: "shifted" },
];

const THEME: Record<FieldTheme, { bg: string; text: string; sub: string }> = {
  auth:    { bg: "#E9F2F4",                    text: "var(--color-link)",          sub: "var(--color-link)" },
  neutral: { bg: "var(--color-surface-2)",     text: "var(--color-ink-secondary)", sub: "var(--color-ink-muted)" },
  new:     { bg: "var(--color-review-bg)",     text: "var(--color-review)",        sub: "var(--color-review)" },
  shifted: { bg: "var(--color-danger-bg)",     text: "var(--color-danger)",        sub: "var(--color-danger)" },
};

/* cursor needle position: offset 33 / 42 total */
const CURSOR_PCT = (33 / TOTAL) * 100;

/* ── Slot row ─────────────────────────────────────────────── */
function SlotRow({
  fields,
  height = 56,
  animate: doAnimate = false,
}: {
  fields: Field[];
  height?: number;
  animate?: boolean;
}) {
  return (
    <div
      className="rounded-[var(--radius-md)] overflow-hidden border border-[var(--color-border)] flex"
      style={{ height, boxShadow: "var(--shadow-card)" }}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        {fields.map((f) => {
          const t = THEME[f.theme];
          const isNarrow = f.units < 3;
          const isWide = f.units >= 12;
          return (
            <motion.div
              key={f.key}
              layout={doAnimate}
              initial={doAnimate ? { opacity: 0 } : false}
              animate={{ opacity: 1 }}
              exit={doAnimate ? { opacity: 0 } : undefined}
              transition={
                doAnimate
                  ? {
                      opacity: { duration: 0.25 },
                      layout: { duration: 0.6, ease: [0.4, 0, 0.2, 1] },
                    }
                  : undefined
              }
              className="flex flex-col items-center justify-center overflow-hidden border-r border-[var(--color-border)] last:border-r-0 shrink-0"
              style={{ flex: `${f.units} 0 0`, background: t.bg }}
            >
              <span
                className="font-semibold leading-none select-none"
                style={{
                  color: t.text,
                  fontFamily: "var(--font-mono)",
                  fontSize: isNarrow ? "7px" : isWide ? "11px" : "9px",
                }}
              >
                {f.label}
              </span>
              {!isNarrow && (
                <span
                  className="mt-1 leading-none"
                  style={{
                    color: t.sub,
                    fontFamily: "var(--font-mono)",
                    fontSize: isWide ? "8.5px" : "7.5px",
                    opacity: 0.8,
                  }}
                >
                  {f.range}
                </span>
              )}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

/* ── Read-head row ─────────────────────────────────────────── */
function ReadHead({
  variant,
  fields,
  delay,
  reducedMotion,
}: {
  variant: "ok" | "bad";
  fields: Field[];
  delay: number;
  reducedMotion: boolean;
}) {
  const isOk = variant === "ok";
  return (
    <motion.div
      initial={reducedMotion ? false : { opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut", delay: reducedMotion ? 0 : delay }}
    >
      {/* Label row */}
      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
        <span
          className="text-[9px] font-bold uppercase tracking-[0.15em]"
          style={{
            fontFamily: "var(--font-mono)",
            color: isOk ? "var(--color-safe)" : "var(--color-danger)",
          }}
        >
          {isOk ? "EXPECTED" : "ACTUAL"}
        </span>
        <span
          className="text-[9px] text-[var(--color-ink-muted)]"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          {isOk
            ? "— what V2 code reads at offset 33"
            : "— what old account still has at offset 33"}
        </span>
      </div>

      {/* Slot row + cursor needle */}
      <div className="relative">
        <SlotRow fields={fields} height={40} />

        {/* Cursor needle */}
        <div
          className="absolute inset-y-0 w-[2px] pointer-events-none"
          style={{
            left: `${CURSOR_PCT}%`,
            transform: "translateX(-50%)",
            background: isOk ? "var(--color-safe)" : "var(--color-danger)",
            opacity: 0.85,
          }}
        />

        {/* Red flash overlay for ACTUAL */}
        {!isOk && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={
              reducedMotion
                ? { opacity: 0.18 }
                : { opacity: [0, 0.3, 0.08, 0.28, 0.06, 0.22, 0.1] }
            }
            transition={
              reducedMotion
                ? { duration: 0 }
                : {
                    duration: 2.4,
                    delay: delay + 0.4,
                    times: [0, 0.1, 0.25, 0.4, 0.6, 0.75, 1],
                  }
            }
            className="absolute inset-y-0 right-0 pointer-events-none rounded-r-[var(--radius-md)]"
            style={{
              left: `${CURSOR_PCT}%`,
              background: "var(--color-danger)",
            }}
          />
        )}
      </div>

      {/* Annotation below cursor */}
      <div className="mt-1.5">
        <span
          className="text-[9.5px] font-medium"
          style={{
            fontFamily: "var(--font-mono)",
            color: isOk ? "var(--color-safe)" : "var(--color-danger)",
          }}
        >
          {isOk
            ? "reads balance starting at byte 33 → correct ✓"
            : "reads byte 33 = 2nd byte of old balance → wrong bytes ✗"}
        </span>
      </div>
    </motion.div>
  );
}

/* ── Offset tick row ──────────────────────────────────────── */
function OffsetTicks({ showV2 }: { showV2: boolean }) {
  const ticks = showV2
    ? [
        { label: "0", offset: 0, color: "var(--color-ink-muted)" },
        { label: "32", offset: 32, color: "var(--color-review)" },
        { label: "33", offset: 33, color: "var(--color-danger)" },
        { label: "41", offset: 41, color: "var(--color-danger)" },
      ]
    : [
        { label: "0", offset: 0, color: "var(--color-ink-muted)" },
        { label: "32", offset: 32, color: "var(--color-ink-muted)" },
        { label: "40", offset: 40, color: "var(--color-ink-muted)" },
      ];

  return (
    <div className="relative h-6">
      {ticks.map(({ label, offset, color }) => (
        <div
          key={label + offset}
          className="absolute top-0 flex flex-col items-center"
          style={{ left: `${(offset / TOTAL) * 100}%`, transform: "translateX(-50%)" }}
        >
          <div className="w-px h-2 bg-[var(--color-border)]" />
          <span
            className="text-[9px] mt-0.5"
            style={{ color, fontFamily: "var(--font-mono)" }}
          >
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}

/* ── Main component ───────────────────────────────────────── */
type Phase = "idle" | "inserting" | "reading";

export function Problem() {
  const reducedMotion = !!useReducedMotion();

  const [phase, setPhase] = useState<Phase>("idle");
  // After hydration, jump to final state for users who prefer reduced motion
  useEffect(() => {
    if (reducedMotion) setPhase("reading");
  }, [reducedMotion]);

  const insert = useCallback(() => {
    if (phase !== "idle") return;
    setPhase("inserting");
    const t = setTimeout(() => setPhase("reading"), reducedMotion ? 0 : 650);
    return () => clearTimeout(t);
  }, [phase, reducedMotion]);

  const replay = useCallback(() => {
    setPhase(reducedMotion ? "reading" : "idle");
  }, [reducedMotion]);

  const showV2 = phase !== "idle";
  const showReadHeads = phase === "reading";
  const activeFields = showV2 ? V2 : V1;

  const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 16 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.3 },
    transition: { duration: 0.45, ease: "easeOut" as const, delay },
  });

  return (
    <section
      aria-labelledby="problem-heading"
      className="py-24 md:py-32 border-t border-[var(--color-border)]"
    >
      <div className="mx-auto max-w-[1120px] px-6">
        <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-14 lg:gap-16 items-start">

          {/* ── Left: copy ── */}
          <div className="flex flex-col gap-6">
            <div>
              <motion.p
                {...fadeUp(0)}
                className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-[var(--color-ink-muted)]"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                The problem
              </motion.p>
              <motion.h2
                id="problem-heading"
                {...fadeUp(0.07)}
                className="text-4xl md:text-5xl font-semibold leading-[1.08] tracking-tight text-[var(--color-ink)]"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Silent corruption is the default.
              </motion.h2>
            </div>

            <motion.p {...fadeUp(0.12)} className="text-[15px] leading-[1.75] text-[var(--color-ink-secondary)]">
              When your program upgrades, old accounts keep their original byte layout.
              The chain has no schema registry — no runtime awareness that your struct changed shape.
            </motion.p>

            <motion.p {...fadeUp(0.16)} className="text-[15px] leading-[1.75] text-[var(--color-ink-secondary)]">
              Your new code reads those old accounts through a modified struct. The
              deserializer silently interprets the wrong bytes.
            </motion.p>
          </div>

          {/* ── Right: interactive demo ── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
            className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 md:p-8"
            style={{ boxShadow: "var(--shadow-showcase)" }}
          >
            {/* Row label */}
            <p
              className="mb-2.5 text-[9.5px] font-semibold uppercase tracking-[0.15em] text-[var(--color-ink-muted)]"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              {showV2 ? "V2 account layout (is_active inserted)" : "V1 account layout (live on chain)"}
            </p>

            {/* Main byte-slot row with Framer layout animation */}
            <SlotRow fields={activeFields} height={56} animate />

            {/* Offset ticks */}
            <OffsetTicks showV2={showV2} />

            {/* Phase-gated content */}
            <div className="mt-2">
              <AnimatePresence mode="wait">
                {phase === "idle" && (
                  <motion.div
                    key="chip"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.25 }}
                    className="pt-3 flex flex-col gap-3"
                  >
                    <p
                      className="text-[11px] text-[var(--color-ink-muted)]"
                      style={{ fontFamily: "var(--font-mono)" }}
                    >
                      Insert a field →
                    </p>
                    <button
                      type="button"
                      onClick={insert}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          insert();
                        }
                      }}
                      className="inline-flex items-center gap-2.5 rounded-[var(--radius-md)] border border-[var(--color-review)] bg-[var(--color-review-bg)] px-3.5 py-2.5 text-[12px] font-medium text-[var(--color-review)] hover:bg-[var(--color-review)] hover:text-white transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 w-fit min-h-[44px]"
                      style={{ fontFamily: "var(--font-mono)" }}
                      aria-label="Insert is_active: bool field after authority to see layout shift"
                    >
                      <span
                        className="h-2 w-2 rounded-full bg-[var(--color-review)]"
                        aria-hidden="true"
                      />
                      is_active: bool
                      <span className="opacity-50 text-[10px] ml-1">+ insert</span>
                    </button>
                    <p className="text-[11.5px] leading-snug text-[var(--color-ink-muted)]">
                      One new field shifts every field after it to the wrong byte offset.
                    </p>
                  </motion.div>
                )}

                {phase === "inserting" && (
                  <motion.div
                    key="inserting"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="pt-3 flex items-center gap-2.5 py-2"
                  >
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}
                      className="inline-block h-3.5 w-3.5 rounded-full border-2 border-[var(--color-review)] border-t-transparent"
                    />
                    <span
                      className="text-[11px] text-[var(--color-ink-muted)]"
                      style={{ fontFamily: "var(--font-mono)" }}
                    >
                      sliding layout…
                    </span>
                  </motion.div>
                )}

                {phase === "reading" && (
                  <motion.div
                    key="reading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                    className="pt-4 flex flex-col gap-5"
                  >
                    <ReadHead variant="ok"  fields={V2} delay={0.05} reducedMotion={reducedMotion} />
                    <ReadHead variant="bad" fields={V1} delay={0.3}  reducedMotion={reducedMotion} />

                    {/* End caption */}
                    <motion.p
                      initial={reducedMotion ? false : { opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: reducedMotion ? 0 : 0.8 }}
                      className="text-[12.5px] font-semibold text-[var(--color-ink)] border-l-2 border-[var(--color-danger)] pl-3 leading-snug"
                    >
                      No panic. No error. Funds move on corrupted state.
                    </motion.p>

                    {/* Replay */}
                    <motion.button
                      initial={reducedMotion ? false : { opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: reducedMotion ? 0 : 1.0 }}
                      type="button"
                      onClick={replay}
                      className="inline-flex items-center gap-1.5 rounded-[var(--radius-sm)] px-3 py-2 min-h-[40px] text-[11px] font-medium text-[var(--color-ink-muted)] border border-[var(--color-border)] hover:text-[var(--color-ink)] hover:border-[var(--color-ink-muted)] transition-colors duration-100 w-fit focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
                      style={{ fontFamily: "var(--font-mono)" }}
                      aria-label="Replay the interactive demo"
                    >
                      <RotateCcw size={11} aria-hidden="true" />
                      Replay
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>

        {/* ── Anchor Migration footnote card ── */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.4, ease: "easeOut", delay: 0.15 }}
          className="mt-12 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-5 flex flex-col sm:flex-row gap-4 items-start"
          style={{ boxShadow: "var(--shadow-card)" }}
        >
          <span
            className="flex-shrink-0 text-[var(--color-ink-muted)] font-medium text-sm mt-0.5"
            style={{ fontFamily: "var(--font-mono)" }}
            aria-hidden="true"
          >
            ⊘
          </span>
          <p className="text-[13px] leading-[1.7] text-[var(--color-ink-secondary)]">
            Anchor v1.0 introduced a{" "}
            <code
              className="text-[11.5px] bg-[rgba(0,0,0,0.04)] border border-[var(--color-border-subtle)] px-1.5 py-0.5 rounded"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              Migration&lt;From,&nbsp;To&gt;
            </code>{" "}
            runtime gate. The gate exists. The layer that writes the migration and
            proves it safe did not.{" "}
            <strong className="font-semibold text-[var(--color-ink)]">
              layoutd is that layer.
            </strong>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
