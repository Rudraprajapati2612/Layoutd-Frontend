import { metadataFor } from "@/components/docs/docs-nav";

export const metadata = metadataFor("faq");

import { H3, P, C, A, Strong } from "@/components/docs/Prose";

export default function FaqPage() {
  return (
    <>
      <P>Short answers to the questions teams ask first.</P>

      <H3>Does layoutd touch the chain?</H3>
      <P>
        No. It is entirely <Strong>off-chain</Strong> — a code generator and a
        safety gate. There is no runtime, no network call, and no on-chain
        component. It reads files and writes output.
      </P>

      <H3>Does it loop over all my accounts?</H3>
      <P>
        No. Solana has no “update all rows” operation. Migration is{" "}
        <Strong>lazy and per-account</Strong>: each account migrates individually,
        on first access by the new program version, paid for by whoever signs that
        transaction. An account never touched again is never migrated, harmlessly.
        layoutd’s only job is producing the correct migration logic.
      </P>

      <H3>What if my real binary classifies a change differently?</H3>
      <P>
        Your installed binary is the ground truth. The output shown in these docs
        reproduces the on-screen example and follows the spec’s classifier
        rules, but you should re-run the CLI on your own account versions to confirm
        the exact verdicts. When in doubt, trust the binary over the docs.
      </P>

      <H3>Is zero-copy supported yet?</H3>
      <P>
        Borsh is the focus of v0.1. Zero-copy layout analysis — real offsets,
        alignment, and padding — is the harder engine and is marked as evolving.
        See <A href="/docs/borsh-vs-zero-copy">Borsh vs Zero-Copy</A>.
      </P>

      <H3>How do I ship a change that’s intentionally dangerous?</H3>
      <P>
        Acknowledge it. Name the exact change in the <C>--ack</C> file so{" "}
        <C>check</C> passes only that danger. The decision is recorded in your
        version history and visible to every reviewer. See{" "}
        <A href="/docs/risk-model">The Risk Model</A>.
      </P>

      <H3>What license is it under?</H3>
      <P>
        layoutd is dual-licensed <C>MIT OR Apache-2.0</C> and published to{" "}
        <A href="https://crates.io/crates/layoutd">crates.io</A>.
      </P>
    </>
  );
}
