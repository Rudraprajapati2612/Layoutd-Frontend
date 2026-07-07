import { metadataFor } from "@/components/docs/docs-nav";

export const metadata = metadataFor("risk-model");

import { H2, P, C, A, Strong } from "@/components/docs/Prose";
import { Callout } from "@/components/docs/Callout";

const CARDS = [
  {
    label: "SAFE",
    color: "var(--color-safe)",
    bg: "var(--color-safe-bg)",
    headline: "Proven. Auto-generated.",
    body: "A provably-correct transformation exists. layoutd emits complete migration logic — no human input, no offset math to verify.",
  },
  {
    label: "REVIEW",
    color: "var(--color-review)",
    bg: "var(--color-review-bg)",
    headline: "Probably safe. Human eyes needed.",
    body: "Code is generated with a warning. Correctness depends on context the tool can't see — CI policy decides auto-pass vs. required approval.",
  },
  {
    label: "DANGER",
    color: "var(--color-danger)",
    bg: "var(--color-danger-bg)",
    headline: "No provable path. Fails CI.",
    body: "No automatically-correct transformation exists. CI fails by default; shipping requires an explicit, recorded acknowledgement.",
  },
];

export default function RiskModelPage() {
  return (
    <>
      <H2>Three tiers, no grey area</H2>
      <P>
        Every field change lands in exactly one of three tiers. The boundaries are
        conservative by design — when layoutd can’t prove a change is safe, it
        says so rather than guessing.
      </P>

      <div className="not-prose my-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {CARDS.map((c) => (
          <div
            key={c.label}
            className="flex flex-col gap-2 rounded-[var(--radius-lg)] border p-4"
            style={{ borderColor: c.color, backgroundColor: c.bg, boxShadow: "var(--shadow-card)" }}
          >
            <span
              className="inline-flex w-fit items-center rounded-full border px-2.5 py-[3px] text-[10px] font-bold tracking-widest"
              style={{
                fontFamily: "var(--font-mono)",
                color: c.color,
                borderColor: c.color,
                background: "rgba(255,255,255,0.7)",
              }}
            >
              {c.label}
            </span>
            <p className="text-[13.5px] font-semibold text-[var(--color-ink)]">{c.headline}</p>
            <p className="text-[12.5px] leading-relaxed text-[var(--color-ink-secondary)]">{c.body}</p>
          </div>
        ))}
      </div>

      <H2>Zero false-safe verdicts</H2>
      <P>
        The north star is a single guarantee: <Strong>layoutd never calls
        something safe that isn’t.</Strong> It may flag a change for review as
        often as needed — conservative refusal is always acceptable — but optimistic
        generation never is. A migration the tool can’t prove correct is one
        the tool will not silently emit.
      </P>

      <H2>The acknowledgement mechanism</H2>
      <P>
        Failing CI on DANGER forces an <Strong>explicit, recorded</Strong> decision
        instead of a silent one. To ship a known danger, you name that specific
        change in the CI config (the <C>--ack</C> file). Only the named danger
        passes — any other danger still fails the build.
      </P>
      <P>
        This is strictly better than hand-writing the migration, where the
        dangerous change is invisible in a normal-looking diff. The danger
        doesn’t disappear; it becomes a permanent, audited line in your version
        history.
      </P>

      <Callout type="danger" title="Acknowledgement is a record, not a bypass">
        Naming a change in the <C>--ack</C> file doesn’t make it safe — it
        makes the decision <Strong>visible and attributable</Strong>. Reviewers and
        auditors see exactly which danger was accepted, by whom, and when.
      </Callout>

      <P>
        Next, see how each kind of change maps to these tiers in{" "}
        <A href="/docs/change-cases">The Five Change Cases</A>.
      </P>
    </>
  );
}
