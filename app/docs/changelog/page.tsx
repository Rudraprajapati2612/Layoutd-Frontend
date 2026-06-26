import { H2, P, UL, LI, C, A, Strong } from "@/components/docs/Prose";
import { Callout } from "@/components/docs/Callout";

export default function ChangelogPage() {
  return (
    <>
      <H2>v0.1 — initial release</H2>
      <P>
        The first public release focuses on the Borsh account model and the core
        diff → classify → emit pipeline.
      </P>
      <UL>
        <LI>
          <Strong>Commands:</Strong> <C>diff</C>, <C>check</C> (with exit codes and
          SARIF), and <C>gen</C> (migration scaffolds).
        </LI>
        <LI>
          <Strong>Risk model:</Strong> SAFE / REVIEW / DANGER classification with
          the zero-false-safe guarantee.
        </LI>
        <LI>
          <Strong>Acknowledgements:</Strong> <C>--ack</C> to record deliberate
          dangerous changes.
        </LI>
        <LI>
          <Strong>Integration:</Strong> a GitHub Action wrapping <C>check</C>, with
          pinned versions and PR annotations.
        </LI>
        <LI>
          <Strong>Distribution:</Strong> published to crates.io, dual-licensed{" "}
          <C>MIT OR Apache-2.0</C>.
        </LI>
      </UL>

      <Callout type="note" title="On the roadmap">
        Deeper zero-copy layout analysis, broader IDL coverage, and additional
        emitters. Zero-copy verdicts in v0.1 are marked as evolving.
      </Callout>

      <H2>Follow development</H2>
      <P>
        Source, issues, and releases live on{" "}
        <A href="https://github.com/Rudraprajapati2612">GitHub</A>. The published
        crate is on <A href="https://crates.io/crates/layoutd">crates.io</A>.
      </P>
    </>
  );
}
