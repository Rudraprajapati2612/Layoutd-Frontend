import { H2, P, UL, LI, C, A, Strong } from "@/components/docs/Prose";
import { CodeBlock } from "@/components/docs/CodeBlock";
import { Verdict } from "@/components/docs/Verdict";
import { Callout } from "@/components/docs/Callout";
import { DIFF_CMD, DIFF_OUTPUT } from "@/components/docs/cli-examples";

export default function DiffPage() {
  return (
    <>
      <H2>Purpose</H2>
      <P>
        <C>layoutd diff</C> answers one question:{" "}
        <Strong>what changed, and what&apos;s risky?</Strong> It matches fields
        between the two account versions, classifies each change, and prints a
        table you can read at a glance. It does not modify files or fail your
        build — for the CI gate, use{" "}
        <A href="/docs/check">
          <C>layoutd check</C>
        </A>
        .
      </P>

      <H2>Invocation</H2>
      <CodeBlock code={DIFF_CMD} lang="bash" filename="terminal" />

      <H2>Output</H2>
      <P>
        The output is a bordered table with four columns —{" "}
        <Strong>FIELD</Strong>, <Strong>CHANGE</Strong>, <Strong>SAFETY</Strong>,
        and <Strong>REASON</Strong> — followed by a summary line.
      </P>
      <CodeBlock code={DIFF_OUTPUT} lang="output" filename="layoutd diff · UserState" copyable={false} />

      <H2>Reading the SAFETY column</H2>
      <UL>
        <LI>
          <Verdict kind="safe" /> — a provably-correct transformation exists; no
          action needed.
        </LI>
        <LI>
          <Verdict kind="review" /> — probably safe, but correctness depends on
          context the tool can&apos;t see.
        </LI>
        <LI>
          <Verdict kind="danger" /> — no provable path; existing accounts would be
          misread without a migration.
        </LI>
      </UL>
      <P>
        The summary line — <C>2 safe 0 review 2 danger</C> — counts each verdict.
        Any non-zero danger count means the upgrade needs a migration before it is
        safe to ship.
      </P>

      <Callout type="warning" title="Verify against your binary">
        The output above reproduces the on-screen example and follows the spec&apos;s
        classifier rules. Your installed binary is the ground truth — re-run it on
        your own account versions to confirm the exact verdicts.
      </Callout>
    </>
  );
}
