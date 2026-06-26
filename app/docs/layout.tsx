import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { DocsShell } from "@/components/docs/DocsShell";

export const metadata: Metadata = {
  title: "Docs — layoutd",
  description:
    "Documentation for layoutd: install, run the diff/check/gen commands, understand the risk model, and wire the CI gate.",
};

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a
        href="#docs-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:rounded-lg focus:bg-[var(--color-surface)] focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:shadow-lg focus:text-[var(--color-ink)] focus:border focus:border-[var(--color-border)]"
      >
        Skip to docs content
      </a>
      <Nav />
      <div id="docs-content">
        <DocsShell>{children}</DocsShell>
      </div>
    </>
  );
}
