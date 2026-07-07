"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useSpring,
} from "framer-motion";

const STEPS = [
  {
    id: "parse",
    num: "01",
    label: "Parse",
    detail: "Read IDL or raw Rust source for V1 and V2. No network, no RPC, no runtime.",
  },
  {
    id: "layout",
    num: "02",
    label: "Layout",
    detail: "Compute byte offsets, sizes, and alignment padding for every field in both versions.",
  },
  {
    id: "diff",
    num: "03",
    label: "Diff",
    detail: "Produce a structured field-level diff with full offset provenance.",
  },
  {
    id: "classify",
    num: "04",
    label: "Classify",
    detail: "Assign each change Safe, Review, or Danger using the deterministic risk model.",
  },
  {
    id: "emit",
    num: "05",
    label: "Emit",
    detail: "Output a human report, SARIF 2.1.0 file, and migration code.",
  },
] as const;

/* ── Mobile pipeline — scroll-driven vertical timeline ─────────────────────
 * A terracotta fill tracks scroll progress along the rail, the step nearest
 * the viewport centre activates (dot + number + card border), and each card
 * reveals independently as it crosses into view. */
function MobilePipeline() {
  const railRef = useRef<HTMLOListElement>(null);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);
  const [activeIdx, setActiveIdx] = useState(0);
  const reduce = useReducedMotion();

  // Post-mount flag so reduced-motion users get a static, fully-filled rail
  // without branching the server-rendered markup (avoids hydration mismatch).
  const [staticFill, setStaticFill] = useState(false);
  useEffect(() => {
    if (reduce) setStaticFill(true);
  }, [reduce]);

  // Rail fill tracks how far the list has scrolled through the mid-viewport.
  const { scrollYProgress } = useScroll({
    target: railRef,
    offset: ["start 0.7", "end 0.45"],
  });
  const fill = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 26,
    mass: 0.4,
  });

  // The step crossing the middle band of the viewport becomes active.
  useEffect(() => {
    if (reduce) return;
    const els = itemRefs.current.filter((el): el is HTMLLIElement => !!el);
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setActiveIdx(Number((e.target as HTMLElement).dataset.step));
          }
        }
      },
      { rootMargin: "-40% 0px -45% 0px", threshold: 0 },
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [reduce]);

  return (
    <div className="relative md:hidden">
      {/* Rail + progress fill — transform-only animation */}
      <div
        aria-hidden="true"
        className="absolute left-[7px] top-3 bottom-3 w-[2px] rounded-full bg-[var(--color-border)]"
      />
      <motion.div
        aria-hidden="true"
        className="absolute left-[7px] top-3 bottom-3 w-[2px] origin-top rounded-full bg-[var(--color-accent)]"
        style={{ scaleY: staticFill ? 1 : fill }}
      />

      <ol ref={railRef} className="space-y-5">
        {STEPS.map((step, i) => {
          const active = i === activeIdx;
          const reached = i <= activeIdx;
          return (
            <motion.li
              key={step.id}
              ref={(el) => {
                itemRefs.current[i] = el;
              }}
              data-step={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.55, ease: "easeOut" }}
              className="relative grid grid-cols-[16px_1fr] gap-x-4"
            >
              {/* Timeline dot */}
              <div
                aria-hidden="true"
                className={[
                  "relative z-10 mt-4 h-4 w-4 rounded-full border-2 transition-colors duration-300",
                  reached || staticFill
                    ? "border-[var(--color-accent)] bg-[var(--color-accent-light)]"
                    : "border-[var(--color-border)] bg-[var(--color-bg)]",
                ].join(" ")}
              />

              {/* Card */}
              <div
                className={[
                  "rounded-[var(--radius-lg)] border bg-[var(--color-surface)] p-4 transition-colors duration-300",
                  active
                    ? "border-[var(--color-accent)] shadow-[var(--shadow-card)]"
                    : "border-[var(--color-border)]",
                ].join(" ")}
              >
                <motion.p
                  animate={active ? { scale: [1, 1.08, 1] } : { scale: 1 }}
                  transition={{ duration: 0.45, ease: "easeOut" }}
                  className={[
                    "mb-1 w-fit origin-left text-[10px] font-semibold tracking-widest transition-colors duration-300",
                    active
                      ? "text-[var(--color-accent)]"
                      : "text-[var(--color-ink-muted)]",
                  ].join(" ")}
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  {step.num}
                </motion.p>
                <p
                  className={[
                    "mb-2 text-[15px] font-semibold transition-colors duration-300",
                    active ? "text-[var(--color-accent)]" : "text-[var(--color-ink)]",
                  ].join(" ")}
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  {step.label}
                </p>
                <p className="text-[12px] leading-relaxed text-[var(--color-ink-secondary)]">
                  {step.detail}
                </p>
              </div>
            </motion.li>
          );
        })}
      </ol>
    </div>
  );
}

export function HowItWorks() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView   = useInView(sectionRef, { once: true, amount: 0.25 });

  return (
    <section
      ref={sectionRef}
      aria-labelledby="how-heading"
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
            How it works
          </motion.p>
          <motion.h2
            id="how-heading"
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.4, ease: "easeOut", delay: 0.06 }}
            className="text-4xl md:text-5xl font-semibold text-[var(--color-ink)]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Five deterministic steps. Zero RPC calls.
          </motion.h2>
        </div>

        {/* Mobile pipeline (<768px) */}
        <MobilePipeline />

        {/* Desktop pipeline */}
        <div className="relative hidden md:block">
          {/* Connecting line */}
          <motion.div
            aria-hidden="true"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: isInView ? 1 : 0 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
            className="absolute top-8 left-[calc(10%-8px)] right-[calc(10%-8px)] h-[1.5px] bg-[var(--color-border)] origin-left"
          />

          <div className="grid grid-cols-5 gap-2">
            {STEPS.map((step, i) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 18 }}
                transition={{ duration: 0.4, ease: "easeOut", delay: 0.15 + i * 0.1 }}
                className="group relative"
              >
                {/* Node dot — terracotta ring on stagger */}
                <div aria-hidden="true" className="flex justify-center mb-4">
                  <motion.div
                    initial={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-bg)" }}
                    animate={
                      isInView
                        ? {
                            borderColor: "var(--color-accent)",
                            backgroundColor: "var(--color-accent-light)",
                          }
                        : {}
                    }
                    transition={{ duration: 0.35, delay: 0.3 + i * 0.12 }}
                    className="relative z-10 h-4 w-4 rounded-full border-2"
                  />
                </div>

                {/* Card */}
                <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4 transition-all duration-200 hover:border-[var(--color-accent)] hover:shadow-[var(--shadow-card)] hover:-translate-y-0.5 cursor-default">
                  <p
                    className="mb-1 text-[10px] font-semibold tracking-widest text-[var(--color-ink-muted)]"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    {step.num}
                  </p>
                  <p
                    className="mb-2 text-[15px] font-semibold text-[var(--color-ink)] group-hover:text-[var(--color-accent)] transition-colors duration-150"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    {step.label}
                  </p>
                  <p className="text-[12px] leading-relaxed text-[var(--color-ink-secondary)]">
                    {step.detail}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Footer note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mt-8 text-center text-[12px] text-[var(--color-ink-muted)]"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          All steps are pure functions of the two input structs. Fully reproducible
          offline. No secrets, no network access, no side-effects.
        </motion.p>
      </div>
    </section>
  );
}
