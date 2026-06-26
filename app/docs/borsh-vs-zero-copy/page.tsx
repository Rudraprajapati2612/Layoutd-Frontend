import { H2, P, UL, LI, C, A, Strong } from "@/components/docs/Prose";
import { Callout } from "@/components/docs/Callout";

export default function BorshVsZeroCopyPage() {
  return (
    <>
      <P>
        Solana account data comes in two fundamentally different models, and
        treating them the same is the biggest possible mistake. layoutd runs a
        different layout engine for each.
      </P>

      <H2>Borsh — the common case</H2>
      <P>
        Standard <C>#[account]</C> types serialize their fields sequentially,
        length-prefixing variable types like <C>Vec</C> and <C>String</C>. There
        are <Strong>no rigid byte offsets</Strong>: a variable field in the middle
        moves everything after it, and migration is a deserialize-old then
        re-serialize-new matched by <Strong>name</Strong>.
      </P>
      <UL>
        <LI>Field reorder is safe — matching is by name, not position.</LI>
        <LI>Appends are safe; mid-struct inserts shift following offsets.</LI>
        <LI>This is the simpler model and the focus of v0.1.</LI>
      </UL>

      <H2>Zero-copy — the hard case</H2>
      <P>
        <C>#[account(zero_copy)]</C> types use <C>repr(C)</C> with a{" "}
        <Strong>fixed layout</Strong>: real offsets, alignment requirements, and
        padding bytes. This is where offset math and alignment hazards live, and
        where audit findings concentrate. layoutd&apos;s zero-copy engine replicates
        the compiler&apos;s layout rules exactly to compute correct offsets.
      </P>
      <UL>
        <LI>Order controls offsets, padding, and total size.</LI>
        <LI>A reorder can change size or break alignment — review or danger.</LI>
        <LI>The hardest, most defensible part of the tool.</LI>
      </UL>

      <Callout type="note" title="Zero-copy support is evolving">
        v0.1 focuses on the Borsh model for breadth. Zero-copy layout analysis is
        the deeper, harder engine and is marked as evolving — verify any zero-copy
        verdict against your binary and your compiled offsets.
      </Callout>

      <P>
        For how each change case differs between the two models, see{" "}
        <A href="/docs/change-cases">The Five Change Cases</A>.
      </P>
    </>
  );
}
