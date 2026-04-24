# layoutd — Solana Foundation India Grant Application

> Companion source-of-truth for the Superteam Earn India grant form.
> Form path: Basics → Details → Milestones.

---

## 1. Basics

| Field | Answer |
|---|---|
| **Project Title** | layoutd |
| **One-Liner Description** | A CLI that auto-generates safe account-layout migration code for Solana program upgrades — diff two Anchor IDLs, get a verified `.migrate()` body, catch zero-copy hazards before they hit mainnet. |
| **Grant Amount** | 5,000 USDG |
| **Telegram Username** | RudraOnSolana |
| **Solana Wallet Address** | r8V9yov1eJcX7EDFxkSzqtiUSvSSfESGnjaYaaYk7Qu |

---

## 2. Details

### Problem + Solution

**The problem.** Every serious Solana team eventually upgrades a deployed program. The moment you change an Account struct — adding a field, widening a number, renaming — the existing on-chain accounts are still laid out per the old struct. Reading them as the new struct is undefined behavior at best and a silent data-corruption incident at worst. Today, every team writes its own one-off `migrate_v1_to_v2` instruction by hand. Account-layout migrations are one of the most flagged classes of finding in Solana audits (Ottersec, Neodyme, Sec3 all publicly document this). It is repeat work, it is risky work, and it is exactly the work tooling should eliminate.

Anchor v1.0 (shipped January 2026, PR #4060) introduced `Migration<'info, From, To>` — a runtime container that auto-detects whether an account is in the old or new format and forces `.migrate()` to run before exit. This is a real step forward, but the **body** of `.migrate()` is still written by hand. The runtime gate exists; the codegen layer doesn't.

**layoutd is that codegen layer.** It is a small Rust CLI that takes two Anchor IDLs (or Rust source for zero-copy accounts where IDL is insufficient), computes a structured byte-level diff (added / removed / renamed / resized / reordered fields, byte offsets, alignment), and generates the `.migrate()` body for the safe transformation cases — append-at-end, widen, rename, reorder. It also emits a SARIF 2.1.0 safety report flagging zero-copy alignment hazards, data-loss risks, and CU-budget overruns, so layout-unsafe upgrades are caught in CI rather than in audit or in production.

**Three commands:**
- `layoutd diff old.json new.json` → structured diff (human + JSON).
- `layoutd gen old.json new.json --out migrate.rs` → ready-to-merge `.migrate()` body.
- `layoutd check old.json new.json --sarif out.sarif` → safety oracle for CI gating.

Plus a published GitHub Action (`layoutd/action-check`) so any Anchor repo can drop in layout-safety enforcement in two lines of YAML.

**Why this is the right fit for the India grant.** It is small in scope, sharply defined, ships in 6 weeks, has zero on-chain footprint, zero regulatory surface, and benefits every Indian (and global) team building production Anchor programs. The India ecosystem is heavy on protocol teams that are about to face their first migration — Superteam India builders are a direct first-user pool.

---

### Deadline (Asia/Calcutta)

**2026-06-15** — 6 weeks of build + 1 week buffer for release and case-study writeups.

---

### Proof of Work

**1. HydraMarket — Decentralized Prediction Market Protocol on Solana**
[github.com/Rudraprajapati2612/HydraMarket-Contract](https://github.com/Rudraprajapati2612/HydraMarket-Contract)

A fully on-chain prediction market protocol built with Anchor/Rust. Three cross-program Anchor programs: Market Registry (lifecycle management), Escrow Vault (YES/NO token minting, SPL settlement), and Resolution Adapter (Pyth oracle + bonded dispute mechanism). 60+ test cases covering PDA derivation, CPI authorization, oracle proposals, and payout claims. Deployed to Solana devnet. This project required deep understanding of Anchor account layout, CPI, and the exact class of struct-level bugs that layoutd targets.

**2. HydraMarket Frontend**
[github.com/Rudraprajapati2612/HydraMarket-Solana-Predection-Market-](https://github.com/Rudraprajapati2612/HydraMarket-Solana-Predection-Market-)

React frontend for HydraMarket — wallet integration, real-time market state, trade execution, and payout claim UI. Full-stack Solana dApp engineering.

**3. Ferrum — HTTP Framework built from scratch in Rust**
[github.com/Rudraprajapati2612/Ferrum](https://github.com/Rudraprajapati2612/Ferrum)

A zero-dependency HTTP/1.1 web framework written entirely in Rust — raw TCP handling, manual byte parser, radix trie router, middleware chain, async I/O via Tokio. Benchmarks at 257,000–294,000 RPS. Built phase-by-phase as a deep systems learning exercise. Demonstrates the same low-level Rust discipline that layoutd's IDL parser and byte-diff engine requires.

**4. Central Limit Order Book in Rust**
[github.com/Rudraprajapati2612/Central-limit-OrderBook-rust](https://github.com/Rudraprajapati2612/Central-limit-OrderBook-rust)

A CLOB implementation in Rust — price-time priority matching engine, order management, bid/ask book. Core DeFi infrastructure built natively in Rust.

**5. AMM on Solana**
[github.com/Rudraprajapati2612/amm-Solana](https://github.com/Rudraprajapati2612/amm-Solana)

Automated Market Maker implemented as an Anchor program on Solana — liquidity pool management, swap execution, LP token minting. Foundational DeFi primitive in the Solana ecosystem.

---

### Loom Video Pitch

[https://www.loom.com/share/c8ef0c3c2fcf4cad8feba1036f40c254](https://www.loom.com/share/c8ef0c3c2fcf4cad8feba1036f40c254)

---

### Personal X Profile

[x.com/0xRudraSol](https://x.com/0xRudraSol)

### Personal GitHub Profile

[github.com/Rudraprajapati2612](https://github.com/Rudraprajapati2612)

---

## 3. Milestones

### Breakdown of How Funds Will Be Used

| Category | Allocation | Notes |
|---|---|---|
| Core development (engineering time) | 4,200 USDG | ~6 weeks focused build — IDL parser, layout differ, codegen, SARIF emitter, GitHub Action, test fixtures |
| Documentation site + landing page | 400 USDG | layoutd.dev — install guide, quickstart, 3 case studies |
| Infrastructure | 200 USDG | Domain, GitHub Actions CI minutes, hosting |
| Launch + community | 200 USDG | Demo recording, X launch thread, Superteam India workshop slides |
| **Total** | **5,000 USDG** | |

---

### Milestones + Completion-Based Payment Schedule

Each milestone is paid on delivery of a public release (git tag + crates.io publish where applicable) plus a public completion checklist on GitHub.

| # | Milestone | Deliverable | Timing | Payment |
|---|---|---|---|---|
| **M1** | `layoutd` v0.1 — diff + IDL parser | Workspace scaffold (Apache-2.0); Anchor IDL → `AccountLayout` parser covering primitives, Option, Vec, nested structs; `layoutd diff` command emitting structured + JSON output; CI skeleton; first toy fixture (`{ a: u64 }` → `{ a: u64, b: u32 }`); README v0 with demo asciinema. Tagged `v0.1.0`. | Week 2 | 1,500 USDG |
| **M2** | `layoutd` v0.3 — migration codegen | `layoutd gen` command emitting the `.migrate()` body via `quote!` macros for three safe cases: append-at-end, widen-numeric, rename. End-to-end integration test under `solana-bankrun`: generated code compiles, runs, and correctly transforms account state. Tagged `v0.3.0`, published to crates.io. | Week 4 | 1,500 USDG |
| **M3** | `layoutd` v0.5 — SARIF safety + GitHub Action | `layoutd check` emitting SARIF 2.1.0 with three diagnostic classes: data-loss (field removed without backup), zero-copy alignment violations, CU-budget overrun estimates. Published GitHub Action `layoutd/action-check` with reusable workflow template. Property-test harness via `proptest`. Tagged `v0.5.0`. | Week 5 | 1,000 USDG |
| **M4** | Docs, case studies, launch | Static docs site (install / quickstart / API reference / SARIF schema); 3 reproducible case studies migrating accounts in 3 real open-source Anchor programs; X launch thread; Superteam India builders-channel post; 1 office-hours session for early users. Tagged `v0.5.1`. | Week 6 | 1,000 USDG |

**Total: 5,000 USDG across 4 milestones over 6 weeks.**

---

### Success KPIs (Measurable, Public)

- **Shipped artifacts:** all 4 milestones publicly tagged on GitHub by 2026-06-15.
- **Adoption — quantitative:** ≥50 GitHub stars within 30 days of `v0.5.0`; ≥200 crates.io downloads of `layoutd-cli`; ≥3 public repos referencing `layoutd/action-check` in their CI workflows within 60 days.
- **Adoption — qualitative:** ≥3 unsolicited issues or DMs from real Solana teams using layoutd on a production migration; ≥1 Anchor-team or Anza-team person publicly engaging with the launch.
- **Correctness:** zero correctness-class bugs reported against generated `.migrate()` bodies in the supported case-set during the first 30 days post-`v0.5.0`. Property-test harness must show ≥1,000 random layout mutations passing in CI on every release.
- **Ecosystem fit:** 3 case-study repos must be actual third-party Anchor programs (not toy fixtures), each including the V1→V2 IDL diff, the layoutd-generated `.migrate()` body, and a writeup of any safety findings.

---

### Risks and Mitigations

- **Time capacity.** Scope is deliberately small and milestone-gated. Mitigation: weekly public progress logs in the grant tracking thread; milestone payments only on public artifact delivery.
- **Anchor upstream risk.** Anchor team could ship competing codegen in `anchor-cli`. Mitigation: ship fast, engage L0STE (shipped the `Migration<From, To>` primitive) early, and proactively offer to upstream once the API stabilizes. layoutd becomes the reference implementation rather than a parallel tool.
- **Zero-copy correctness.** Hardest correctness surface. Mitigation: explicit "unsupported — manual review required" gates in SARIF output for cases the differ cannot prove safe. Property-test harness from M3 onwards.

---

## 4. Pre-Submit Checklist

- [ ] Open-source `layoutd` repo at `github.com/Rudraprajapati2612/layoutd`, Apache-2.0, with v0.1 scaffold and real README. Private repo at submit = auto-reject.
- [ ] Lock domain + deploy landing page at layoutd.dev.
- [ ] Loom video recorded and linked above ✅
- [ ] Telegram: RudraOnSolana ✅
- [ ] Wallet: r8V9yov1eJcX7EDFxkSzqtiUSvSSfESGnjaYaaYk7Qu ✅
- [ ] Pick 3 candidate open-source Anchor repos for M4 case studies — email maintainers heads-up before submit.
- [ ] Pre-submit DM to L0STE — share v0.1 link, ask for input.
- [ ] Light heads-up to Paaru Sethi (Superteam India lead).
- [ ] Double-check every form field against this doc before clicking submit.
- [ ] Submit.