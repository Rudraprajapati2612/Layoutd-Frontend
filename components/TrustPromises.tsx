"use client";

import { motion } from "framer-motion";
import {
  Cpu,
  ShieldCheck,
  Lock,
  GitPullRequest,
  Target,
  AlertTriangle,
  LucideIcon,
} from "lucide-react";

interface Promise {
  Icon: LucideIcon;
  title: string;
  body: string;
  accent: boolean;
}

const PROMISES: Promise[] = [
  {
    Icon: Cpu,
    title: "Models bytes, not intent",
    body: "Computes exact byte offsets and alignment padding for every field. Not a guess from names — a proof from layout.",
    accent: false,
  },
  {
    Icon: ShieldCheck,
    title: "Zero false-safe verdicts",
    body: "If layoutd cannot prove a migration is safe, it classifies DANGER. Silence is never safe. There are no optimistic assumptions.",
    accent: false,
  },
  {
    Icon: Lock,
    title: "Deterministic + version-pinned",
    body: "The same two structs always produce the same verdict on the same version. Verdicts never change silently across releases.",
    accent: false,
  },
  {
    Icon: GitPullRequest,
    title: "SARIF 2.1.0 + GitHub Action",
    body: "Outputs SARIF consumed by GitHub's code scanning pipeline. The official Action wraps check for two-line CI adoption — no YAML plumbing required.",
    accent: false,
  },
  {
    Icon: Target,
    title: "Narrow on purpose",
    body: "Does one thing: prove whether an account layout migration is safe. Never touches the blockchain. Never holds keys. Never emits transactions.",
    accent: false,
  },
  {
    Icon: AlertTriangle,
    title: "Danger requires acknowledgement",
    body: "Shipping a known DANGER requires naming that exact change in CI config. The danger can never be silent again — it becomes an explicit, audited decision.",
    accent: true,
  },
];

export function TrustPromises() {
  return (
    <section
      aria-labelledby="trust-heading"
      className="py-24 md:py-32 border-t border-[var(--color-border)]"
    >
      <div className="mx-auto max-w-[1120px] px-6">
        {/* Header */}
        <div className="mb-14 grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-10 lg:gap-20 items-start">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-[var(--color-ink-muted)]"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              Why it’s trustworthy
            </motion.p>
            <motion.h2
              id="trust-heading"
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.4, ease: "easeOut", delay: 0.06 }}
              className="text-4xl md:text-5xl font-semibold leading-[1.08] text-[var(--color-ink)]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Six promises.
              <br />
              All of them structural.
            </motion.h2>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.4, ease: "easeOut", delay: 0.1 }}
            className="self-end text-base leading-relaxed text-[var(--color-ink-secondary)]"
          >
            Trust in a security tool isn’t built from copy — it’s built from constraints.
            layoutd earns trust by refusing to operate outside provable bounds, not by
            asserting that it’s trustworthy.
          </motion.p>
        </div>

        {/* Grid — equal heights via items-stretch */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-stretch">
          {PROMISES.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.4, ease: "easeOut", delay: i * 0.06 }}
              className={[
                "group relative rounded-[var(--radius-xl)] border p-6 flex flex-col transition-all duration-200",
                "hover:-translate-y-0.5 hover:shadow-[var(--shadow-hover)]",
                p.accent
                  ? "border-[var(--color-accent)] bg-[var(--color-accent-light)]"
                  : "border-[var(--color-border)] bg-[var(--color-surface)]",
              ].join(" ")}
              style={{ boxShadow: "var(--shadow-card)" }}
            >
              {/* Lucide icon — thin line, 1.5px stroke */}
              <p.Icon
                size={20}
                strokeWidth={1.5}
                aria-hidden="true"
                className={[
                  "mb-4 flex-shrink-0",
                  p.accent ? "text-[var(--color-accent)]" : "text-[var(--color-ink-muted)]",
                ].join(" ")}
              />

              <h3
                className={[
                  "mb-2 text-[14px] font-semibold",
                  p.accent ? "text-[var(--color-accent)]" : "text-[var(--color-ink)]",
                ].join(" ")}
              >
                {p.title}
              </h3>
              <p className="text-[13px] leading-relaxed text-[var(--color-ink-secondary)] flex-1">
                {p.body}
              </p>

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
