/* ──────────────────────────────────────────────────────────────────────────
 * Docs navigation — single source of truth for the sidebar, prev/next, and
 * each page's header (eyebrow group + title + lede). Order here defines the
 * reading order used by the Prev/Next footer.
 * ────────────────────────────────────────────────────────────────────────── */

export interface DocItem {
  title: string;
  /** route under /docs ("" = the /docs index page) */
  slug: string;
  /** one-line lede shown under the H1 */
  summary: string;
}

export interface DocGroup {
  label: string;
  items: DocItem[];
}

export const DOCS_NAV: DocGroup[] = [
  {
    label: "Getting Started",
    items: [
      {
        title: "Introduction",
        slug: "",
        summary:
          "A security oracle for Solana account migrations that happens to generate code.",
      },
      {
        title: "Installation",
        slug: "installation",
        summary: "Install the CLI from crates.io and verify it runs.",
      },
      {
        title: "Quickstart",
        slug: "quickstart",
        summary:
          "Point layoutd at two versions of an account, run diff, read the verdict.",
      },
    ],
  },
  {
    label: "Commands",
    items: [
      {
        title: "layoutd diff",
        slug: "diff",
        summary: "See what changed and what's risky — every field, classified.",
      },
      {
        title: "layoutd check",
        slug: "check",
        summary: "The CI gate. Exit 0 when safe, exit 1 on unacknowledged danger.",
      },
      {
        title: "layoutd gen",
        slug: "gen",
        summary: "Generate the Migration<Old, New> scaffold with DANGER lines annotated.",
      },
    ],
  },
  {
    label: "Concepts",
    items: [
      {
        title: "The Risk Model",
        slug: "risk-model",
        summary: "SAFE, REVIEW, DANGER — and why there's no grey area.",
      },
      {
        title: "The Five Change Cases",
        slug: "change-cases",
        summary: "Add, rename, retype, remove, reorder — each with its Borsh reasoning.",
      },
      {
        title: "Borsh vs Zero-Copy",
        slug: "borsh-vs-zero-copy",
        summary: "Two account models, two layout engines. Why they differ.",
      },
    ],
  },
  {
    label: "Input & Integration",
    items: [
      {
        title: "IDL / JSON Input",
        slug: "input-format",
        summary: "What layoutd reads, and how to produce the two version files.",
      },
      {
        title: "CI Setup",
        slug: "ci-setup",
        summary: "The GitHub Action, version pinning, and how acknowledgements flow.",
      },
    ],
  },
  {
    label: "Reference",
    items: [
      {
        title: "FAQ",
        slug: "faq",
        summary: "Short answers to the questions teams ask first.",
      },
      {
        title: "Changelog",
        slug: "changelog",
        summary: "Release notes and where to follow development.",
      },
    ],
  },
];

/** Flattened reading order, used for Prev/Next. */
export const DOC_ORDER: { group: string; item: DocItem }[] = DOCS_NAV.flatMap(
  (g) => g.items.map((item) => ({ group: g.label, item })),
);

export function hrefFor(slug: string): string {
  return slug ? `/docs/${slug}` : "/docs";
}

/** Look up an entry by its full pathname (e.g. "/docs/diff"). */
export function lookupByPath(pathname: string) {
  const idx = DOC_ORDER.findIndex(({ item }) => hrefFor(item.slug) === pathname);
  if (idx === -1) return null;
  return {
    idx,
    ...DOC_ORDER[idx],
    prev: idx > 0 ? DOC_ORDER[idx - 1] : null,
    next: idx < DOC_ORDER.length - 1 ? DOC_ORDER[idx + 1] : null,
  };
}

/** Per-page <title>/<meta description>, generated from the nav data. */
export function metadataFor(slug: string): {
  title: string;
  description: string;
} | null {
  const entry = DOC_ORDER.find(({ item }) => item.slug === slug);
  if (!entry) return null;
  return {
    title: `${entry.item.title} — layoutd`,
    description: entry.item.summary,
  };
}
