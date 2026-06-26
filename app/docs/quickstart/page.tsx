import { H2, P, UL, LI, C, A, Strong } from "@/components/docs/Prose";
import { CodeBlock } from "@/components/docs/CodeBlock";
import { Callout } from "@/components/docs/Callout";
import { LiveTerminal } from "@/components/LiveTerminal";
import { DIFF_CMD } from "@/components/docs/cli-examples";

export default function QuickstartPage() {
  return (
    <>
      <H2>The 60-second path</H2>
      <P>
        layoutd compares two versions of a single account. You give it the{" "}
        <Strong>old</Strong> and <Strong>new</Strong> account definitions (Anchor
        IDL JSON), name the account, and read the verdict.
      </P>
      <UL>
        <LI>
          <Strong>Step 1.</Strong> Export the account&apos;s IDL for each version
          to <C>v1.json</C> and <C>v2.json</C> (see{" "}
          <A href="/docs/input-format">IDL / JSON Input</A>).
        </LI>
        <LI>
          <Strong>Step 2.</Strong> Run <C>diff</C> against both files, selecting
          the account by name.
        </LI>
        <LI>
          <Strong>Step 3.</Strong> Read the per-field verdict and the summary
          line.
        </LI>
      </UL>

      <CodeBlock code={DIFF_CMD} lang="bash" filename="terminal" />

      <H2>See it live</H2>
      <P>
        The interactive terminal below runs the real <C>UserState</C> example —
        a <C>bool</C> field inserted in the middle of the struct. Switch between
        the <C>diff</C>, <C>check</C>, and <C>gen</C> tabs to see each command&apos;s
        output for the same change.
      </P>

      <Callout type="note" title="This is the on-screen example">
        V1 is{" "}
        <C>{`{ authority, balance, bump }`}</C>; V2 inserts <C>is_active</C> at
        index 1. Because the insert shifts every following offset, layoutd
        classifies it as DANGER — old accounts would be misread without a
        migration.
      </Callout>

      {/* The one interactive demo in the docs — the shared landing component. */}
      <div className="not-prose -mx-1">
        <LiveTerminal />
      </div>

      <H2>What the verdict means</H2>
      <P>
        Each field is labelled <Strong>SAFE</Strong>, <Strong>REVIEW</Strong>, or{" "}
        <Strong>DANGER</Strong>. To turn this into a CI gate, run{" "}
        <A href="/docs/check">
          <C>layoutd check</C>
        </A>{" "}
        — it exits non-zero on unacknowledged danger. To generate the migration
        scaffold, run{" "}
        <A href="/docs/gen">
          <C>layoutd gen</C>
        </A>
        .
      </P>
    </>
  );
}
