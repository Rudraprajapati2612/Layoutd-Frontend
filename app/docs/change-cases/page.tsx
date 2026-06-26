import { H2, P, C, A, Strong } from "@/components/docs/Prose";
import { Verdict } from "@/components/docs/Verdict";
import { Callout } from "@/components/docs/Callout";
import type { ReactNode } from "react";

type Kind = "safe" | "review" | "danger";

interface Case {
  id: string;
  title: string;
  verdicts: Kind[];
  body: ReactNode;
}

const CASES: Case[] = [
  {
    id: "add-a-field",
    title: "Add a field",
    verdicts: ["safe", "danger"],
    body: (
      <>
        Appending a field at the <Strong>end</Strong> of the struct is{" "}
        <Verdict kind="safe" /> — nothing before it moves, so existing accounts
        still deserialize correctly. Inserting a field in the{" "}
        <Strong>middle</Strong> shifts every following offset, so under Borsh-by-
        position it is <Verdict kind="danger" />: old accounts are misread until
        migrated. (This is the <C>is_active</C> example used throughout the docs.)
      </>
    ),
  },
  {
    id: "rename-a-field",
    title: "Rename a field",
    verdicts: ["safe", "danger"],
    body: (
      <>
        A rename is <Verdict kind="safe" /> only when a field disappears and a new
        one appears at the <Strong>same position with the same type and size</Strong>
        . If the type or size differs, the tool can&apos;t distinguish a rename from
        a remove-plus-add, so it treats it as <Verdict kind="danger" /> rather than
        guess. Confirm true renames in the optional hint file.
      </>
    ),
  },
  {
    id: "change-a-field-type",
    title: "Change a field's type",
    verdicts: ["review", "danger"],
    body: (
      <>
        Widening within the same meaning — say <C>u8 → u16</C>, same signedness —
        is <Verdict kind="review" />: the value fits and the tool generates a safe
        conversion, but you should confirm intent. Reinterpreting the bytes —{" "}
        <C>u64 → u128</C> changes the byte width and shifts everything after it,
        <C>int → Pubkey</C>, or a signedness flip — is <Verdict kind="danger" />,
        because the same bytes now mean something different.
      </>
    ),
  },
  {
    id: "remove-a-field",
    title: "Remove a field",
    verdicts: ["danger"],
    body: (
      <>
        Removing a field is <Verdict kind="danger" />. It has two failure modes:
        the field&apos;s value is lost permanently, and every field after it shifts
        offset. <C>check</C> fails by default; with an explicit acknowledgement,
        <C>gen</C> still scaffolds the mechanical work and marks the human decision.
        The safe escape hatch is to keep the field and mark it deprecated.
      </>
    ),
  },
  {
    id: "reorder-or-shift-fields",
    title: "Reorder / shift fields",
    verdicts: ["safe", "review"],
    body: (
      <>
        Reordering the same fields is <Verdict kind="safe" /> under Borsh, because
        fields are matched by <Strong>name</Strong> on re-serialization — order
        doesn&apos;t change the bytes. In zero-copy it&apos;s <Verdict kind="review" />{" "}
        (and escalates to <Verdict kind="danger" /> if alignment breaks), because
        order controls real offsets, padding, and total size.
      </>
    ),
  },
];

export default function ChangeCasesPage() {
  return (
    <>
      <P>
        Every diff reduces to a combination of five basic change cases. Each is
        classified independently against the same rules — so a single edit that
        widens one field while reordering two others is analysed as three separate
        changes.
      </P>

      {CASES.map((c) => (
        <div key={c.id} className="not-prose mt-8 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5" style={{ boxShadow: "var(--shadow-card)" }}>
          <div className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-2">
            <h2
              id={c.id}
              className="scroll-mt-24 text-[18px] font-semibold text-[var(--color-ink)]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {c.title}
            </h2>
            <span className="flex flex-wrap gap-1.5">
              {c.verdicts.map((v) => (
                <Verdict key={v} kind={v} />
              ))}
            </span>
          </div>
          <p className="text-[14.5px] leading-[1.7] text-[var(--color-ink-secondary)]">
            {c.body}
          </p>
        </div>
      ))}

      <div className="mt-12" />
      <H2>Why this matters</H2>
      <P>
        Knowing your intent isn&apos;t the same as knowing the byte-level
        consequences. layoutd turns a private &ldquo;I widened this&rdquo; into a
        checked, recorded artifact — and catches the change you didn&apos;t realise
        you made.
      </P>

      <Callout type="warning" title="Borsh vs zero-copy changes the answer">
        Several of these verdicts depend on the account model. A mid-struct insert
        or reorder behaves very differently under zero-copy, where real offsets and
        alignment apply. See{" "}
        <A href="/docs/borsh-vs-zero-copy">Borsh vs Zero-Copy</A>.
      </Callout>
    </>
  );
}
