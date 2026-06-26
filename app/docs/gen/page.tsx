import { H2, P, UL, LI, C, A, Strong } from "@/components/docs/Prose";
import { CodeBlock } from "@/components/docs/CodeBlock";
import { Callout } from "@/components/docs/Callout";
import { GEN_CMD, GEN_OUTPUT } from "@/components/docs/cli-examples";

export default function GenPage() {
  return (
    <>
      <H2>Purpose</H2>
      <P>
        <C>layoutd gen</C> writes the migration. It produces a{" "}
        <C>Migration&lt;Old, New&gt;</C> implementation that carries every safe
        field across unchanged and annotates every dangerous decision so you
        can&apos;t ship one by accident.
      </P>

      <H2>Invocation</H2>
      <CodeBlock code={GEN_CMD} lang="bash" filename="terminal" />

      <H2>The scaffold</H2>
      <P>
        For the <C>UserState</C> example, the inserted <C>is_active</C> field is a
        DANGER, so <C>gen</C> emits a complete scaffold with that one decision
        left for you — every other field is wired up automatically.
      </P>
      <CodeBlock code={GEN_OUTPUT} lang="rust" filename="migration.rs" />

      <H2>How DANGER lines are annotated</H2>
      <UL>
        <LI>
          Each dangerous field becomes a commented{" "}
          <C>{`// DANGER: …`}</C> line explaining the consequence, paired with a{" "}
          <C>todo!(&quot;supply value&quot;)</C> placeholder.
        </LI>
        <LI>
          The scaffold does not compile until you resolve every <C>todo!()</C> —
          so a dangerous migration can never silently slip through.
        </LI>
        <LI>
          Safe fields (<C>authority</C>, <C>balance</C>, <C>bump</C>) are mapped
          directly from the old account, with shifted offsets computed for you.
        </LI>
      </UL>

      <H2>Proof-hash pinning & realloc</H2>
      <P>
        <C>gen</C> pins a <Strong>proof hash</Strong> of the exact layouts it
        analysed, so a later <C>check</C> can confirm the migration still matches
        the inputs it was generated from. For variable-size accounts, the scaffold
        includes the <Strong>realloc</Strong> and rent-adjustment steps needed when
        the new layout changes the account&apos;s size.
      </P>

      <Callout type="warning" title="Verify against your binary">
        The scaffold above reproduces the on-screen example. Re-run <C>gen</C> on
        your real account versions and confirm the output before committing — your
        installed binary is the source of truth.
      </Callout>

      <P>
        Once you&apos;ve resolved the <C>todo!()</C> lines, acknowledge the
        deliberate danger and let{" "}
        <A href="/docs/check">
          <C>layoutd check</C>
        </A>{" "}
        confirm the upgrade is safe to ship.
      </P>
    </>
  );
}
