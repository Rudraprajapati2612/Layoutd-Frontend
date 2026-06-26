/* ──────────────────────────────────────────────────────────────────────────
 * CLI EXAMPLE STRINGS — single source of truth for the docs code blocks.
 *
 * ⚠️  VERIFY AGAINST THE REAL BINARY (layoutd-cli v0.1.0).
 * These reproduce the on-screen `is_active` example used by <LiveTerminal/> on
 * the landing page. They follow the spec's classifier rules, but only your
 * binary is ground truth — re-run it and paste corrections HERE so the docs and
 * the landing terminal never drift. The terminal renders the same example from
 * structured segments in components/LiveTerminal.tsx; keep the two in sync.
 *
 *   V1 UserState { authority:Pubkey(0), balance:u64(32), bump:u8(40) }
 *   V2 UserState { authority:Pubkey(0), is_active:bool(32)*inserted,
 *                  balance:u64(33), bump:u8(41) }
 * ────────────────────────────────────────────────────────────────────────── */

export const DIFF_OUTPUT = `layoutd diff  —  account: UserState  [borsh]
──────────────────────────────────────────────────────────────
FIELD        CHANGE              SAFETY   REASON
──────────────────────────────────────────────────────────────
authority    unchanged           SAFE     field unchanged
is_active    added at index 1    DANGER   field inserted before existing fields — shifts all following offsets, old accounts misread
balance      offset 32 → 33      DANGER   offset shifted by preceding insert — existing accounts require migration before use
bump         offset 40 → 41      SAFE     offset shifted but trails the insert — re-serialized correctly under borsh by name
──────────────────────────────────────────────────────────────
  2 safe   0 review   2 danger`;

export const CHECK_OUTPUT = `layoutd check: FAIL — 2 unacknowledged dangerous change(s) in UserState [borsh]
  DANGER  is_active  —  field inserted before existing fields — shifts all following offsets, old accounts misread
  DANGER  balance    —  offset shifted by preceding insert — existing accounts require migration before use
Run \`layoutd gen\` to see a scaffold with every DANGER annotated.
Use --ack <file> to acknowledge deliberate dangerous changes.`;

export const GEN_OUTPUT = `// layoutd gen  —  account: UserState  [borsh]
// WARNING: dangerous changes present — resolve every DANGER line before shipping
impl Migration<OldUserState, UserState> {
    pub fn migrate(old: OldUserState) -> UserState {
        UserState {
            authority: old.authority,
            // DANGER: is_active inserted at index 1 — shifts following offsets; supply value
            // is_active: todo!("supply value"),
            balance: old.balance,
            bump: old.bump,
        }
    }
}`;

export const INSTALL_CMD = "cargo install layoutd";

export const DIFF_CMD = "layoutd diff v1.json v2.json --account UserState";
export const CHECK_CMD = "layoutd check v1.json v2.json --account UserState";
export const GEN_CMD = "layoutd gen v1.json v2.json --account UserState";

/* Minimal Anchor IDL slices for the UserState example. The real IDL has more
 * fields; these are the account type entries layoutd reads with --account. */
export const V1_JSON = `{
  "name": "UserState",
  "type": {
    "kind": "struct",
    "fields": [
      { "name": "authority", "type": "publicKey" },
      { "name": "balance",   "type": "u64" },
      { "name": "bump",      "type": "u8" }
    ]
  }
}`;

export const V2_JSON = `{
  "name": "UserState",
  "type": {
    "kind": "struct",
    "fields": [
      { "name": "authority", "type": "publicKey" },
      { "name": "is_active", "type": "bool" },
      { "name": "balance",   "type": "u64" },
      { "name": "bump",      "type": "u8" }
    ]
  }
}`;

export const CI_YAML = `name: layoutd
on: [pull_request]

jobs:
  layout-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: layoutd/check-action@v0.1.0   # pin the version
        with:
          v1: idl/userstate.v1.json
          v2: idl/userstate.v2.json
          account: UserState
          ack: .layoutd-ack.toml             # optional acknowledgements`;
