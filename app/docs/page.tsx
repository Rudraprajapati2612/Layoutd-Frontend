import { H2, P, UL, LI, C, A, Strong } from "@/components/docs/Prose";
import { Callout } from "@/components/docs/Callout";

export default function IntroductionPage() {
  return (
    <>
      <P>
        <Strong>layoutd</Strong> is a small, off-chain Rust command-line tool for
        the Solana/Anchor ecosystem. It reads two versions of an on-chain account
        struct, computes a byte-level diff, classifies each field change as{" "}
        <Strong>SAFE</Strong>, <Strong>REVIEW</Strong>, or <Strong>DANGER</Strong>{" "}
        by Borsh byte-safety, generates the migration code it can prove correct,
        and blocks unsafe upgrades in CI. It never touches the chain — it is a
        code generator and a safety gate.
      </P>

      <H2>The problem it solves</H2>
      <P>
        On Solana, a program upgrade replaces the executable in place, but the{" "}
        <Strong>account data</Strong> already stored on-chain keeps its old byte
        layout. The new code expects the new layout, so reading old bytes through
        the new struct silently corrupts data — shifted offsets, misread fields,
        and in the worst case lost funds. The dangerous part is never your intent;
        it&apos;s the byte-level consequence of a change that humans routinely get
        wrong, which is exactly what an audit catches and CI does not.
      </P>

      <H2>What makes it different</H2>
      <P>
        Most tools either generate migrations optimistically or do nothing.{" "}
        <Strong>layoutd</Strong> takes a third path: it automates the provably-safe
        part, scaffolds the dangerous part behind a recorded acknowledgement, and
        refuses to let danger be silent.
      </P>
      <UL>
        <LI>
          <Strong>Zero false-safe verdicts.</Strong> The tool may say &ldquo;I
          can&apos;t prove this, review it&rdquo; as often as needed, but never
          calls something safe that isn&apos;t.
        </LI>
        <LI>
          <Strong>Deterministic.</Strong> The same two inputs always produce
          identical output — essential for a CI gate you can trust.
        </LI>
        <LI>
          <Strong>Narrow on purpose.</Strong> It models bytes and proves
          migrations; it does not attempt business logic it cannot see.
        </LI>
      </UL>

      <Callout type="note" title="The principle">
        layoutd never refuses to help — it refuses to let danger be silent. A
        DANGER verdict doesn&apos;t disappear; it becomes a permanent, audited
        decision in your version history.
      </Callout>

      <H2>Where to go next</H2>
      <P>
        New here? Start with <A href="/docs/installation">Installation</A>, then
        run the <A href="/docs/quickstart">Quickstart</A> to see a real diff in
        under a minute. Want the conceptual model first? Read{" "}
        <A href="/docs/risk-model">The Risk Model</A>. You can also return to the{" "}
        <A href="/">landing page</A> for the high-level overview.
      </P>
    </>
  );
}
