import { metadataFor } from "@/components/docs/docs-nav";

export const metadata = metadataFor("installation");

import { H2, P, UL, LI, C, A, Strong } from "@/components/docs/Prose";
import { CodeBlock } from "@/components/docs/CodeBlock";
import { Callout } from "@/components/docs/Callout";

export default function InstallationPage() {
  return (
    <>
      <H2>Requirements</H2>
      <UL>
        <LI>
          A <Strong>Rust toolchain</Strong> (stable). Install via{" "}
          <A href="https://rustup.rs">rustup</A> if you don’t have it.
        </LI>
        <LI>
          That’s it — layoutd is a single static binary with no runtime, no
          network calls, and no on-chain dependency.
        </LI>
      </UL>

      <H2>Install from crates.io</H2>
      <P>
        layoutd is published to crates.io and dual-licensed{" "}
        <C>MIT OR Apache-2.0</C>. Install it with Cargo:
      </P>
      <CodeBlock code="cargo install layoutd" lang="bash" filename="terminal" />

      <H2>Verify the install</H2>
      <P>Confirm the binary is on your path and prints its version:</P>
      <CodeBlock
        code={`layoutd --version
# layoutd 0.1.0`}
        lang="bash"
        filename="terminal"
      />

      <Callout type="warning" title="Pin the version in CI">
        For continuous integration, always pin an exact version so a verdict can
        never change silently between runs. See{" "}
        <A href="/docs/ci-setup">CI Setup</A> for the GitHub Action and pinning
        details.
      </Callout>

      <H2>Next</H2>
      <P>
        With the binary installed, head to the{" "}
        <A href="/docs/quickstart">Quickstart</A> to run your first diff.
      </P>
    </>
  );
}
