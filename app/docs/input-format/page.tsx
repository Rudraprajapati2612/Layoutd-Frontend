import { H2, P, UL, LI, C, A, Strong } from "@/components/docs/Prose";
import { CodeBlock } from "@/components/docs/CodeBlock";
import { Callout } from "@/components/docs/Callout";
import { V1_JSON, V2_JSON } from "@/components/docs/cli-examples";

export default function InputFormatPage() {
  return (
    <>
      <H2>What layoutd reads</H2>
      <P>
        layoutd&apos;s primary input is the <Strong>Anchor IDL JSON</Strong> — the
        same IDL your program already emits. You provide two versions of it and
        select which account to compare with <C>--account &lt;Name&gt;</C>. For
        zero-copy structs where the IDL is insufficient, the Rust source can be
        used as a fallback.
      </P>
      <UL>
        <LI>
          <Strong>Primary:</Strong> Anchor IDL JSON (the common path).
        </LI>
        <LI>
          <Strong>Fallback:</Strong> the account&apos;s Rust source, for zero-copy
          layouts.
        </LI>
        <LI>
          <Strong>Optional:</Strong> a hint file for facts the tool can&apos;t
          infer, such as confirmed renames.
        </LI>
      </UL>

      <H2>Producing the two version files</H2>
      <P>
        Export the IDL at the <Strong>old</Strong> commit and the <Strong>new</Strong>{" "}
        commit, then point layoutd at both. The account-type entry layoutd reads
        for <C>UserState</C> looks like this:
      </P>

      <CodeBlock code={V1_JSON} lang="json" filename="v1.json" />
      <CodeBlock code={V2_JSON} lang="json" filename="v2.json" />

      <P>
        The only difference above is the inserted <C>is_active</C> field in{" "}
        <C>v2.json</C> — which is exactly the change layoutd flags as DANGER,
        because it shifts the offsets of <C>balance</C> and <C>bump</C>.
      </P>

      <H2>Selecting the account</H2>
      <P>
        An IDL can contain many accounts. Use <C>--account</C> to pick the one you
        want to diff:
      </P>
      <CodeBlock
        code={`layoutd diff v1.json v2.json --account UserState`}
        lang="bash"
        filename="terminal"
      />

      <Callout type="warning" title="Verify against your binary">
        The JSON above is a minimal slice for illustration. Your real IDL has more
        structure; confirm the exact field types layoutd reads by running it on
        your actual files.
      </Callout>

      <P>
        Ready to wire this into CI? See <A href="/docs/ci-setup">CI Setup</A>.
      </P>
    </>
  );
}
