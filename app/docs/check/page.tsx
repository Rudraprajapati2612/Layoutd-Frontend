import { metadataFor } from "@/components/docs/docs-nav";

export const metadata = metadataFor("check");

import { H2, P, UL, LI, C, A, Strong } from "@/components/docs/Prose";
import { CodeBlock } from "@/components/docs/CodeBlock";
import { Callout } from "@/components/docs/Callout";
import { CHECK_CMD, CHECK_OUTPUT } from "@/components/docs/cli-examples";

export default function CheckPage() {
  return (
    <>
      <H2>Purpose</H2>
      <P>
        <C>layoutd check</C> is the <Strong>CI gate</Strong>. It runs the same
        analysis as <C>diff</C> but turns the result into a pass/fail with an exit
        code, so an unsafe upgrade fails the pull request before it reaches
        production.
      </P>

      <H2>Invocation</H2>
      <CodeBlock code={CHECK_CMD} lang="bash" filename="terminal" />

      <H2>Exit codes</H2>
      <UL>
        <LI>
          <C>0</C> — <Strong>safe.</Strong> No dangerous changes, or every danger
          is acknowledged.
        </LI>
        <LI>
          <C>1</C> — <Strong>unacknowledged danger.</Strong> At least one DANGER
          verdict has not been explicitly acknowledged. The build fails.
        </LI>
      </UL>

      <H2>FAIL output</H2>
      <P>
        On failure, <C>check</C> names every unacknowledged danger and points you
        at the next step:
      </P>
      <CodeBlock code={CHECK_OUTPUT} lang="output" filename="layoutd check · UserState" copyable={false} />

      <H2>Acknowledging deliberate danger</H2>
      <P>
        Sometimes a dangerous change is intentional. The <C>{"--ack <file>"}</C>{" "}
        flag points at an acknowledgement file that names the exact change being
        accepted. Only the named danger passes — any other danger still fails the
        build.
      </P>
      <CodeBlock
        code={`layoutd check v1.json v2.json --account UserState --ack .layoutd-ack.toml`}
        lang="bash"
        filename="terminal"
      />
      <P>
        This makes a deliberate danger a <Strong>recorded, audited decision</Strong>{" "}
        in your version history rather than a silent one. See{" "}
        <A href="/docs/risk-model">The Risk Model</A> for how acknowledgement
        works.
      </P>

      <H2>SARIF & PR annotations</H2>
      <P>
        <C>check</C> emits a <Strong>SARIF 2.1.0</Strong> report. When run through
        the <A href="/docs/ci-setup">GitHub Action</A>, GitHub renders each
        finding as an inline annotation on the pull request, so reviewers see the
        exact field and reason without leaving the PR.
      </P>

      <Callout type="danger" title="Danger is never silent">
        A DANGER verdict fails CI by default. The only way past it is an explicit
        acknowledgement naming the change — which is permanently visible in your
        diff and history.
      </Callout>
    </>
  );
}
