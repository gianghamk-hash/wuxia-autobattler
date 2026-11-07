# Balance 8.0 — implementation plan

This branch is isolated from `main`. Stage 1 is read-only baseline screening: no combat constants, saves, quests, rarity or rewards are changed.

## Run

```sh
npm test
npm run balance:6v6 -- 150 reports/balance-8/fresh-6v6.json
node scripts/balance-lab/audit.mjs reports/balance-8/fresh-6v6.json reports/balance-8/audit.json
```

The audit may also read the historical `reports/balance-7.json`, but those outputs must not be presented as evidence for a new patch.

## Restrictions

- Presence score is confounded by team composition, role, enemy and gear; outlier flags are candidates for matched comparison only.
- Use both-side pairs with the same seeded battle and change only one factor at a time.
- Verify 60 unique companion IDs, 5 sects, 80 gacha gear items; migration and save version unchanged.
- Include levels 1, 8, 20, 30; six companion ranks; 0 and 5 max-affinity passives; five elemental matchups; gear 0/2/3/4 piece sets.
- Check pathfinding on the 8×4 board, campaign chapters 2/3 boundary, timers, energy loops, duplicate refunds and no negative currency.
- Prefer role contribution and causal replacement effect to raw damage or unadjusted presence win-rate.

## Release gates

No unreviewed bulk buffs/nerfs. Before merge: Node + Playwright checks green; controlled scenario differences documented; legacy saves and gacha pity preserved; no hidden changes to live `main`.

## Stage 2: matched replacement evaluation

```sh
# One role-matched comparison: same teammates, opponent, formation and mirrored seed
npm run balance:matched -- --candidate companion_03 --pairs 100 --scenario level8

# All 60 characters, each against a role-matched comparator
npm run balance:matched -- --all --pairs 20 --scenario level8 --output reports/balance-8/matched.json
```

The simulation runs the real 6v6 combat engine. Every fixture replays candidate and control
against the same opposing six-person squad, with home/enemy reversal in both cases
(four battles per fixture). Fixture-level deltas are bootstrapped for a paired confidence
interval. Opponents and four fixed teammates are sampled using seeded PRNG.

**Interpretation boundaries:** role-group comparisons can still span rarity tiers (the
generated report warns when they differ); seed reuse does not eliminate all RNG divergence.
The script measures replacement-effect difference, not independent win-rate or intrinsic
unit strength. A 20-fixture screening run does not justify production nerfs.
Review at levels 1/8/20, with and without equipment/preparation, and validate 200+
fixtures for finalists. Before changing a character, inspect ability effects and
counter-matchups, confirm the same rarity, then create a separate measured balance patch.

The `--all` run performs 60 independent character-vs-control evaluations, each
with four battles per fixture; it does not attempt the full 60×59 matchup matrix.
