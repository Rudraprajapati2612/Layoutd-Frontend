import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { Problem } from "@/components/Problem";
import { LiveTerminal } from "@/components/LiveTerminal";
import { ThreeCommands } from "@/components/ThreeCommands";
import { RiskModel } from "@/components/RiskModel";
import { HowItWorks } from "@/components/HowItWorks";
import { TrustPromises } from "@/components/TrustPromises";
import { CTAFooter } from "@/components/CTAFooter";

export default function Home() {
  return (
    <>
      {/* Skip-to-content link for keyboard / screen-reader users */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:rounded-lg focus:bg-[var(--color-surface)] focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:shadow-lg focus:text-[var(--color-ink)] focus:border focus:border-[var(--color-border)]"
      >
        Skip to main content
      </a>

      <Nav />

      <main id="main-content">
        {/* 1 — Hero */}
        <Hero />

        {/* 2 — The Problem */}
        <Problem />

        {/* 3 — Live Terminal (3-tab: diff / gen / check) */}
        <LiveTerminal />

        {/* 4 — Three Commands */}
        <ThreeCommands />

        {/* 5 — The Risk Model */}
        <RiskModel />

        {/* 6 — How it works */}
        <HowItWorks />

        {/* 7 — Why it's trustworthy */}
        <TrustPromises />
      </main>

      {/* 8 — CTA Footer */}
      <CTAFooter />
    </>
  );
}
