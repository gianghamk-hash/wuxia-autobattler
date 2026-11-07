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
