import { metadataFor } from "@/components/docs/docs-nav";

export const metadata = metadataFor("ci-setup");

import { H2, P, UL, LI, C, A, Strong } from "@/components/docs/Prose";
import { CodeBlock } from "@/components/docs/CodeBlock";
import { Callout } from "@/components/docs/Callout";
import { CI_YAML } from "@/components/docs/cli-examples";

export default function CiSetupPage() {
  return (
    <>
      <H2>Two-line adoption</H2>
      <P>
        layoutd ships a <Strong>GitHub Action</Strong> that wraps{" "}
        <A href="/docs/check">
          <C>layoutd check</C>
        </A>
        . Add it to a workflow, point it at your two IDL versions, and every pull
        request that touches an account layout is gated automatically.
      </P>

      <CodeBlock code={CI_YAML} lang="yaml" filename=".github/workflows/layoutd.yml" />

      <H2>Pin the version</H2>
      <P>
        Always pin an <Strong>exact</Strong> action version (<C>@v0.1.0</C>, not a
        floating tag). A verdict must never change silently between runs — pinning
        guarantees the classifier that passed your last PR is the same one gating
        the next.
      </P>

      <Callout type="warning" title="Version pinning is mandatory">
        An unpinned action could change its classification rules under you, turning
        a previously-safe upgrade into a silent failure — or worse, a silent pass.
        Pin it.
      </Callout>

      <H2>PR annotations</H2>
      <P>
        The Action consumes <C>check</C>’s <Strong>SARIF 2.1.0</Strong> output,
        and GitHub renders each finding as an inline annotation on the changed
        lines. Reviewers see the field, the verdict, and the reason directly in the
        pull request.
      </P>

      <H2>How acknowledgements flow</H2>
      <UL>
        <LI>
          A DANGER verdict fails the check and blocks the merge by default.
        </LI>
        <LI>
          To accept a deliberate danger, add it to the <C>ack</C> file named in the
          workflow (e.g. <C>.layoutd-ack.toml</C>).
        </LI>
        <LI>
          Only the named change passes; any other danger still fails. The
          acknowledgement is committed alongside the change, so it’s reviewable
          and permanent.
        </LI>
      </UL>

      <P>
        For the rules behind the verdicts, see{" "}
        <A href="/docs/risk-model">The Risk Model</A>.
      </P>
    </>
  );
}
