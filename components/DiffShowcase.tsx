"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

/* ── Tiny syntax-highlight helpers ───────────────────────── */
const K = (t: string) => (
  <span className="font-semibold text-[var(--color-ink)]">{t}</span>
);
const T = (t: string) => (
  <span className="text-[var(--color-link)]">{t}</span>
);
const F = (t: string) => (
  <span className="text-[#3D3A50]">{t}</span>
);
const A = (t: string) => (
  <span className="text-[var(--color-review)]">{t}</span>
);
const C = (t: string) => (
  <span className="text-[var(--color-ink-muted)] italic">{t}</span>
);
const P = (t: string) => (
  <span className="text-[var(--color-ink-muted)]">{t}</span>
);

/* ── Code line wrapper ────────────────────────────────────── */
function CodeLine({
  children,
  indent = 0,
  className = "",
}: {
  children: React.ReactNode;
  indent?: number;
  className?: string;
}) {
  return (
    <div
      className={`flex text-[10.5px] sm:text-[12.5px] leading-[1.7] ${className}`}
      style={{ fontFamily: "var(--font-mono)", paddingLeft: indent * 14 + "px" }}
    >
      {children}
    </div>
  );
}

export function DiffShowcase() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.35 });

  return (
    <section
      ref={ref}
      aria-label="Diff showcase: V1 vs V2 UserState struct"
      className="relative py-16 sm:py-24"
    >
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: "easeOut" }}
          /* macOS window card */
          className="overflow-hidden rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)]"
          style={{ boxShadow: "var(--shadow-showcase)" }}
        >
          {/* ── Titlebar ────────────────────────────────── */}
          <div className="flex items-center gap-3 border-b border-[var(--color-border)] bg-[var(--color-surface-2)] px-4 py-3">
            {/* Traffic-light dots */}
            <div className="flex items-center gap-1.5" aria-hidden="true">
              <div className="h-3 w-3 rounded-full bg-[#FF5F57]" />
              <div className="h-3 w-3 rounded-full bg-[#FFBD2E]" />
              <div className="h-3 w-3 rounded-full bg-[#28C840]" />
            </div>
            <span
              className="ml-2 text-[11px] font-medium tracking-widest text-[var(--color-ink-muted)] uppercase"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              STATE CHANGE DETECTED
            </span>
          </div>

          {/* ── Body: V1 | V2 ────────────────────────── */}
          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[var(--color-border)]">
            {/* V1 ── */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.4, delay: 0.15 }}
              className="p-5"
            >
              <p
                className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-[var(--color-ink-muted)]"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                <span className="mr-2 rounded bg-[var(--color-surface-2)] border border-[var(--color-border)] px-1.5 py-0.5">
                  V1
                </span>
                UserState
              </p>

              <div className="select-all">
                <CodeLine>{A("#[account]")}</CodeLine>
                <CodeLine>
                  {K("pub")}&nbsp;{K("struct")}&nbsp;{T("UserState")}&nbsp;{P("{")}
                </CodeLine>
                <CodeLine indent={1}>
                  {K("pub")}&nbsp;{F("authority")}{P(":")} {T("Pubkey")}{P(",")}{"  "}{C("// +32  offset: 0")}
                </CodeLine>
                <CodeLine indent={1}>
                  {K("pub")}&nbsp;{F("balance")}{P(":   ")}{T("u64")}{P(",")}{"   "}{C("// +8   offset: 32")}
                </CodeLine>
                <CodeLine indent={1}>
                  {K("pub")}&nbsp;{F("bump")}{P(":      ")}{T("u8")}{P(",")}{"    "}{C("// +1   offset: 40")}
                </CodeLine>
                <CodeLine>{P("}")}</CodeLine>
              </div>
            </motion.div>

            {/* V2 ── */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="p-5"
            >
              <p
                className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-[var(--color-ink-muted)]"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                <span className="mr-2 rounded bg-[var(--color-review-bg)] border border-[var(--color-review)] px-1.5 py-0.5 text-[var(--color-review)]">
                  V2
                </span>
                UserState
              </p>

              <div>
                <CodeLine>{A("#[account]")}</CodeLine>
                <CodeLine>
                  {K("pub")}&nbsp;{K("struct")}&nbsp;{T("UserState")}&nbsp;{P("{")}
                </CodeLine>
                <CodeLine indent={1}>
                  {K("pub")}&nbsp;{F("authority")}{P(":")} {T("Pubkey")}{P(",")}{"  "}{C("// +32  offset: 0")}
                </CodeLine>

                {/* ── INSERTED LINE — animated ───────────────── */}
                <motion.div
                  initial={{ opacity: 0, clipPath: "inset(0 100% 0 0)" }}
                  animate={
                    isInView
                      ? { opacity: 1, clipPath: "inset(0 0% 0 0)" }
                      : {}
                  }
                  transition={{ duration: 0.75, ease: "linear", delay: 0.85 }}
                  className="relative rounded-sm overflow-hidden"
                  style={{ backgroundColor: "rgba(184,115,10,0.09)" }}
                >
                  <CodeLine indent={1} className="py-[2px]">
                    {K("pub")}&nbsp;
                    <span className="text-[var(--color-review)] font-medium">
                      {F("is_active")}
                    </span>
                    {P(":")} {T("bool")}{P(",")}{" "}{C("// +1   offset: 32")}
                  </CodeLine>

                  {/* LAYOUT SHIFT badge — hidden on mobile to avoid overlap */}
                  <motion.span
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 0.25, ease: "easeOut", delay: 1.55 }}
                    aria-label="Layout shift warning"
                    className="badge-pulse hidden sm:inline-flex absolute right-2 top-1/2 -translate-y-1/2 rounded px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-widest text-[var(--color-review)] border border-[var(--color-review)] bg-[var(--color-review-bg)]"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    LAYOUT SHIFT
                  </motion.span>
                </motion.div>

                {/* balance — offset shifted */}
                <motion.div
                  initial={{ y: 0 }}
                  animate={isInView ? { y: 3 } : {}}
                  transition={{ duration: 0.3, ease: "easeInOut", delay: 1.6 }}
                >
                  <CodeLine indent={1} className="relative group">
                    {K("pub")}&nbsp;{F("balance")}{P(":   ")}{T("u64")}{P(",")}{"   "}
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={isInView ? { opacity: 1 } : {}}
                      transition={{ delay: 1.75, duration: 0.3 }}
                    >
                      {C("// +8   offset: ")}
                      <span className="text-[var(--color-danger)] font-medium not-italic">
                        33
                      </span>
                      <span className="ml-1 text-[10px] text-[var(--color-danger)] not-italic">
                        ▲ was 32
                      </span>
                    </motion.span>
                  </CodeLine>
                </motion.div>

                <motion.div
                  initial={{ y: 0 }}
                  animate={isInView ? { y: 3 } : {}}
                  transition={{ duration: 0.3, ease: "easeInOut", delay: 1.6 }}
                >
                  <CodeLine indent={1}>
                    {K("pub")}&nbsp;{F("bump")}{P(":      ")}{T("u8")}{P(",")}{"    "}{C("// +1   offset: 41")}
                  </CodeLine>
                </motion.div>
                <CodeLine>{P("}")}</CodeLine>
              </div>
            </motion.div>
          </div>

          {/* ── Footer annotation ──────────────────────── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 1.9, duration: 0.4 }}
            className="border-t border-[var(--color-border)] bg-[var(--color-surface-2)] px-5 py-3 flex flex-wrap items-center gap-x-6 gap-y-2"
          >
            <span
              className="inline-flex items-center gap-1.5 text-[11px] text-[var(--color-ink-muted)]"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              <span className="h-2 w-2 rounded-sm bg-[rgba(184,115,10,0.25)] border border-[var(--color-review)]" aria-hidden="true" />
              1 field inserted — 2 fields shifted
            </span>
            <span
              className="inline-flex items-center gap-1.5 text-[11px] text-[var(--color-danger)]"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              <span aria-hidden="true">⊘</span>
              Old account bytes will misread{" "}
              <code className="text-[var(--color-danger)]">balance</code> without migration
            </span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
