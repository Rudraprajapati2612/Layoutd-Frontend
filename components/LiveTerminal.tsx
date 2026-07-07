"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence, useInView, useReducedMotion } from "framer-motion";
import { Pause, Play } from "lucide-react";

type Seg = { t: string; c: string };
type OutputLine = Seg[] | null;

const ink    = "var(--color-ink)";
const muted  = "var(--color-ink-muted)";
const sec    = "var(--color-ink-secondary)";
const safe   = "var(--color-safe)";   // sage  #4F7A52
const review = "var(--color-review)"; // amber #B8730A
const danger = "var(--color-danger)"; // clay-red #B23A2E
const link   = "var(--color-link)";
const violet = "var(--color-violet)";

function seg(t: string, c: string): Seg { return { t, c }; }

/* ──────────────────────────────────────────────────────────────────────────
 * CLI output verified against layoutd-cli v0.1.0 — edit here if binary output
 * changes. All three tabs are driven by the structured data below for the
 * on-screen example:
 *   V1 UserState { authority:Pubkey(0), balance:u64(32), bump:u8(40) }
 *   V2 UserState { authority:Pubkey(0), is_active:bool(32)*inserted,
 *                  balance:u64(33), bump:u8(41) }
 * The renderer aligns columns and colors the SAFETY token — do not hardcode
 * spacing/color spans by hand; change the data and the table re-aligns.
 * ────────────────────────────────────────────────────────────────────────── */

type Safety = "SAFE" | "REVIEW" | "DANGER";
const SAFETY_COLOR: Record<Safety, string> = {
  SAFE: safe,
  REVIEW: review,
  DANGER: danger,
};

interface DiffRow {
  field: string;
  change: string;
  safety: Safety;
  reason: string;
}

const DIFF = {
  cmd: "layoutd diff v1.json v2.json --account UserState",
  header: "layoutd diff  —  account: UserState  [borsh]",
  rows: [
    {
      field: "authority",
      change: "unchanged",
      safety: "SAFE",
      reason: "field unchanged",
    },
    {
      field: "is_active",
      change: "added at index 1",
      safety: "DANGER",
      reason:
        "field inserted before existing fields — shifts all following offsets, old accounts misread",
    },
    {
      field: "balance",
      change: "offset 32 → 33",
      safety: "DANGER",
      reason:
        "offset shifted by preceding insert — existing accounts require migration before use",
    },
    {
      field: "bump",
      change: "offset 40 → 41",
      safety: "SAFE",
      reason:
        "offset shifted but trails the insert — re-serialized correctly under borsh by name",
    },
  ] as DiffRow[],
  summary: { safe: 2, review: 0, danger: 2 },
};

const CHECK = {
  cmd: "layoutd check v1.json v2.json --account UserState",
  lines: [
    [
      seg("layoutd check: ", ink),
      seg("FAIL", danger),
      seg(" — 2 unacknowledged dangerous change(s) in UserState [borsh]", ink),
    ],
    null,
    [
      seg("  DANGER  ", danger),
      seg("is_active", sec),
      seg(
        "  —  field inserted before existing fields — shifts all following offsets, old accounts misread",
        sec,
      ),
    ],
    [
      seg("  DANGER  ", danger),
      seg("balance  ", sec),
      seg(
        "  —  offset shifted by preceding insert — existing accounts require migration before use",
        sec,
      ),
    ],
    null,
    [seg("Run ", muted), seg("`layoutd gen`", link), seg(" to see a scaffold with every DANGER annotated.", muted)],
    [seg("Use ", muted), seg("--ack <file>", violet), seg(" to acknowledge deliberate dangerous changes.", muted)],
  ] as OutputLine[],
};

const GEN = {
  cmd: "layoutd gen v1.json v2.json --account UserState",
  lines: [
    [seg("// layoutd gen  —  account: UserState  [borsh]", muted)],
    [seg("// WARNING: dangerous changes present — resolve every DANGER line before shipping", danger)],
    [seg("impl ", review), seg("Migration", link), seg("<OldUserState, UserState> {", ink)],
    [seg("    pub fn ", review), seg("migrate", link), seg("(old: OldUserState) -> UserState {", ink)],
    [seg("        UserState {", ink)],
    [seg("            authority: old.authority,", sec)],
    [seg("            // DANGER: is_active inserted at index 1 — shifts following offsets; supply value", danger)],
    [seg('            // is_active: todo!("supply value"),', muted)],
    [seg("            balance: old.balance,", sec)],
    [seg("            bump: old.bump,", sec)],
    [seg("        }", ink)],
    [seg("    }", ink)],
    [seg("}", ink)],
  ] as OutputLine[],
};

/* Build the aligned diff table as renderable lines from structured rows. */
function buildDiffLines(d: typeof DIFF): OutputLine[] {
  const fieldW  = Math.max("FIELD".length,  ...d.rows.map((r) => r.field.length));
  const changeW = Math.max("CHANGE".length, ...d.rows.map((r) => r.change.length));
  const safetyW = Math.max("SAFETY".length, ...d.rows.map((r) => r.safety.length));
  const pad = (s: string, w: number) => s + " ".repeat(Math.max(0, w - s.length));
  const GAP = "   ";
  const rule = "─".repeat(62);

  const lines: OutputLine[] = [];
  lines.push([seg(d.header, ink)]);
  lines.push([seg(rule, muted)]);
  lines.push([
    seg(pad("FIELD", fieldW) + GAP + pad("CHANGE", changeW) + GAP + pad("SAFETY", safetyW) + GAP + "REASON", muted),
  ]);
  lines.push([seg(rule, muted)]);
  for (const r of d.rows) {
    lines.push([
      seg(pad(r.field, fieldW) + GAP, sec),
      seg(pad(r.change, changeW) + GAP, sec),
      seg(pad(r.safety, safetyW), SAFETY_COLOR[r.safety]),
      seg(GAP + r.reason, sec),
    ]);
  }
  lines.push([seg(rule, muted)]);
  lines.push([
    seg("  ", muted),
    seg(`${d.summary.safe} safe`, safe),
    seg("   ", muted),
    seg(`${d.summary.review} review`, review),
    seg("   ", muted),
    seg(`${d.summary.danger} danger`, danger),
  ]);
  return lines;
}

interface TabDef {
  id: string;
  label: string;
  cmd: string;
  lines: OutputLine[];
  statusText: string;
  statusColor: string;
}

const TABS: TabDef[] = [
  {
    id: "diff",
    label: "diff",
    cmd: DIFF.cmd,
    lines: buildDiffLines(DIFF),
    statusText: "2 safe · 0 review · 2 danger — migration required",
    statusColor: danger,
  },
  {
    id: "check",
    label: "check",
    cmd: CHECK.cmd,
    lines: CHECK.lines,
    statusText: "FAIL · 2 unacknowledged danger · exit 1",
    statusColor: danger,
  },
  {
    id: "gen",
    label: "gen",
    cmd: GEN.cmd,
    lines: GEN.lines,
    statusText: "scaffold written · 1 DANGER to resolve",
    statusColor: review,
  },
];

const SRC_V1 = [
  { t: "#[account]",                         c: review },
  { t: "pub struct UserState {",             c: ink },
  { t: "    pub authority: Pubkey,  // 0",   c: sec },
  { t: "    pub balance:   u64,     // 32",  c: sec },
  { t: "    pub bump:      u8,      // 40",  c: sec },
  { t: "}",                                  c: ink },
];
const SRC_V2 = [
  { t: "#[account]",                         c: review },
  { t: "pub struct UserState {",             c: ink },
  { t: "    pub authority:  Pubkey,  // 0",  c: sec },
  { t: "+   pub is_active:  bool,    // 32", c: review },
  { t: "    pub balance:    u64,     // 33", c: danger },
  { t: "    pub bump:       u8,      // 41", c: danger },
  { t: "}",                                  c: ink },
];

function OutputLineRow({ line }: { line: OutputLine }) {
  if (!line) return <div className="h-3" aria-hidden="true" />;
  return (
    <div
      className="leading-[1.65] text-[10.5px] sm:text-[11px] whitespace-pre"
      style={{ fontFamily: "var(--font-mono)" }}
    >
      {line.map((s, i) => (
        <span key={i} style={{ color: s.c }}>{s.t}</span>
      ))}
    </div>
  );
}

function SourceStrip() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
      {[
        { label: "V1", lines: SRC_V1, labelColor: sec },
        { label: "V2", lines: SRC_V2, labelColor: review },
      ].map(({ label, lines, labelColor }) => (
        <div
          key={label}
          className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface-2)] p-4 overflow-x-auto"
          style={{ boxShadow: "var(--shadow-card)" }}
        >
          <p
            className="text-[9.5px] font-semibold uppercase tracking-[0.12em] mb-2.5"
            style={{ fontFamily: "var(--font-mono)", color: labelColor }}
          >
            {label} · UserState
          </p>
          <div className="space-y-0.5 min-w-[200px]">
            {lines.map((l, i) => (
              <div
                key={i}
                className="text-[10px] sm:text-[10.5px] leading-[1.65] whitespace-pre"
                style={{ fontFamily: "var(--font-mono)", color: l.c }}
              >
                {l.t}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export function LiveTerminal() {
  const ref      = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const shouldReduceMotion = useReducedMotion();

  const [activeTab,     setActiveTab]     = useState(0);
  const [cmdChars,      setCmdChars]      = useState(0);
  const [revealedLines, setRevealedLines] = useState(0);
  const [autoplay,      setAutoplay]      = useState(true);
  const [started,       setStarted]       = useState(false);

  const autoplayRef = useRef(autoplay);
  autoplayRef.current = autoplay;

  const tab        = TABS[activeTab];
  const totalLines = tab.lines.length;

  const startTab = useCallback((idx: number) => {
    setActiveTab(idx);
    setCmdChars(0);
    setRevealedLines(0);
  }, []);

  useEffect(() => {
    if (!started) return;
    const t = TABS[activeTab];

    // Respect reduced-motion on every tab switch, not just the first reveal:
    // show the full command + output instantly and don't auto-advance.
    if (shouldReduceMotion) {
      setCmdChars(t.cmd.length);
      setRevealedLines(t.lines.length);
      return;
    }

    const timers: ReturnType<typeof setTimeout>[] = [];
    const CMD_DELAY   = 26;
    const LINE_DELAY  = 120;
    const PAUSE_AFTER = 2600;

    for (let i = 0; i <= t.cmd.length; i++) {
      timers.push(setTimeout(() => setCmdChars(i), i * CMD_DELAY));
    }

    const cmdDone = t.cmd.length * CMD_DELAY + 180;
    t.lines.forEach((_, li) => {
      timers.push(setTimeout(() => setRevealedLines(li + 1), cmdDone + (li + 1) * LINE_DELAY));
    });

    const allDone = cmdDone + totalLines * LINE_DELAY + PAUSE_AFTER;
    timers.push(
      setTimeout(() => {
        if (!autoplayRef.current) return;
        startTab((activeTab + 1) % TABS.length);
      }, allDone),
    );

    return () => timers.forEach(clearTimeout);
  }, [activeTab, started, startTab, totalLines, shouldReduceMotion]);

  useEffect(() => {
    if (isInView && !started) {
      if (shouldReduceMotion) {
        setStarted(true);
        setCmdChars(TABS[0].cmd.length);
        setRevealedLines(TABS[0].lines.length);
      } else {
        setStarted(true);
      }
    }
  }, [isInView, started, shouldReduceMotion]);

  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  function handleTabClick(idx: number) {
    setAutoplay(false);
    startTab(idx);
    setStarted(true);
  }

  function handleTabKeyDown(e: React.KeyboardEvent, idx: number) {
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    e.preventDefault();
    const next =
      e.key === "ArrowRight"
        ? (idx + 1) % TABS.length
        : (idx - 1 + TABS.length) % TABS.length;
    handleTabClick(next);
    tabRefs.current[next]?.focus();
  }

  function togglePlay() {
    const next = !autoplay;
    setAutoplay(next);
    if (next) startTab(activeTab);
  }

  const cmdVisible = tab.cmd.slice(0, cmdChars);
  const showCursor = cmdChars < tab.cmd.length || revealedLines < totalLines;

  return (
    <section
      ref={ref}
      aria-label="Live terminal showcase"
      className="py-24 md:py-32 border-t border-[var(--color-border)]"
    >
      <div className="mx-auto max-w-[1120px] px-6">
        {/* Section header */}
        <div className="mb-10">
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-[var(--color-ink-muted)]"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            Live output
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.4, ease: "easeOut", delay: 0.06 }}
            className="text-4xl md:text-5xl font-semibold text-[var(--color-ink)]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            See every finding, live.
          </motion.h2>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
        >
          <SourceStrip />

          {/* macOS terminal window */}
          <div
            className="overflow-hidden rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)]"
            style={{ boxShadow: "var(--shadow-showcase)" }}
          >
            {/* Window chrome */}
            <div className="flex items-stretch border-b border-[var(--color-border)] bg-[var(--color-surface-2)]">
              <div className="flex items-center gap-1.5 px-4 flex-shrink-0" aria-hidden="true">
                <div className="h-3 w-3 rounded-full bg-[#FF5F57]" />
                <div className="h-3 w-3 rounded-full bg-[#FFBD2E]" />
                <div className="h-3 w-3 rounded-full bg-[#28C840]" />
              </div>

              {/* Tabs — min 44px touch target height */}
              <div
                role="tablist"
                aria-label="layoutd commands"
                className="flex items-end gap-1 flex-1 px-2 pt-1.5 min-w-0 overflow-x-auto"
              >
                {TABS.map((t, i) => (
                  <button
                    key={t.id}
                    ref={(el) => {
                      tabRefs.current[i] = el;
                    }}
                    onClick={() => handleTabClick(i)}
                    onKeyDown={(e) => handleTabKeyDown(e, i)}
                    tabIndex={activeTab === i ? 0 : -1}
                    className={[
                      "px-3 min-w-[44px] min-h-[44px] flex items-center justify-center text-[11px] font-medium rounded-t-md transition-colors duration-100 border border-b-0 border-transparent flex-shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]",
                      activeTab === i
                        ? "bg-[var(--color-bg)] border-[var(--color-border)] text-[var(--color-ink)] -mb-px"
                        : "text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] hover:bg-[var(--color-bg)]/50",
                    ].join(" ")}
                    style={{ fontFamily: "var(--font-mono)" }}
                    aria-selected={activeTab === i}
                    role="tab"
                    aria-label={`${t.label} command tab`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {/* Play / pause — kept clearly separated from the tab row */}
              <div className="flex items-center pl-2 pr-3 flex-shrink-0 border-l border-[var(--color-border)]">
                <button
                  onClick={togglePlay}
                  className="flex items-center gap-1.5 rounded-md px-2.5 min-h-[36px] text-[10.5px] font-medium border border-[var(--color-border)] text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] hover:border-[var(--color-ink-muted)] transition-colors duration-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
                  style={{ fontFamily: "var(--font-mono)" }}
                  aria-label={autoplay ? "Pause autoplay" : "Resume autoplay"}
                >
                  {autoplay ? (
                    <Pause size={11} aria-hidden="true" />
                  ) : (
                    <Play size={11} aria-hidden="true" />
                  )}
                  <span className="hidden sm:inline">{autoplay ? "pause" : "play"}</span>
                </button>
              </div>
            </div>

            {/* Terminal body — only the code body scrolls horizontally; the page never does */}
            <div className="relative">
              <div
                className="overflow-x-auto overscroll-x-contain"
                style={{ WebkitOverflowScrolling: "touch" }}
              >
                <div className="w-max min-w-full px-4 py-4">
                  {/* Prompt + typed command */}
                  <div
                    className="mb-3 text-[10.5px] sm:text-[11px] leading-snug whitespace-pre"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    <span style={{ color: safe }}>❯ </span>
                    <span style={{ color: ink }}>{cmdVisible}</span>
                    {showCursor && (
                      <span
                        style={{ color: "var(--color-accent)", animation: "blink 1.1s step-end infinite" }}
                        aria-hidden="true"
                      >
                        ▌
                      </span>
                    )}
                  </div>

                  {/* Output lines */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={tab.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.16 }}
                    >
                      {tab.lines.slice(0, revealedLines).map((line, i) => (
                        <OutputLineRow key={i} line={line} />
                      ))}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>

              {/* Right-edge scroll-hint fade — pinned to the terminal's visible edge */}
              <div
                aria-hidden="true"
                className="absolute top-0 bottom-0 right-0 w-10 pointer-events-none"
                style={{
                  background: "linear-gradient(to right, transparent, var(--color-surface))",
                }}
              />
            </div>

            {/* Status bar */}
            <div className="border-t border-[var(--color-border)] bg-[var(--color-surface-2)] px-5 py-2 flex items-center justify-between flex-wrap gap-x-4 gap-y-1">
              <span
                className="text-[10px] font-medium min-w-0 truncate"
                style={{ fontFamily: "var(--font-mono)", color: tab.statusColor }}
              >
                {revealedLines >= totalLines ? tab.statusText : "running…"}
              </span>
              <span
                className="text-[10px] text-[var(--color-ink-muted)] flex-shrink-0"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                layoutd v0.1 · borsh · deterministic
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
