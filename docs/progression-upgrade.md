# Progression, rewards and divine companions

This release implements all 16 requested gameplay/presentation changes.

| Area | Result |
| --- | --- |
| Attributes | Each point: Căn Cốt +100 HP/+2 physical defense; Khí Hải +12 magic attack/+4 magic defense; Kình Lực +12 physical attack/+1.2% crit damage; Ngộ Tính +1.2% crit/+3 magic attack; Thân Pháp +3% attack tempo/+0.6% dodge; Cơ Duyên +0.8% crit/+20 HP. Existing combat caps remain. |
| Skill branches | Each branch requires only its own preceding node and level/point budget. Multiple tier-four ultimates can be learned; the last learned is active. |
| Fishing | Always one fish, plus a visible weighted reward: 30% two extra fish, 25% 30 silver, 20% 100 XP opened immediately, 15% three ore and three herbs, 8% rare gear, 2% excellent gear. Result persists in the journal and is shown on return. |
| Bầu Cua | No daily round cap; virtual silver, affordability, secure dice and atomic transactions remain. |
| Readiness | Every encounter opens a paused scouting screen showing actual enemies, elements, counters, allied elemental relationships and activated synergies. Positions can be swapped before starting; positions save and also update boss-wave starting cells. |
| Draws | Companions 35/150 silver for 1/5 results; tier rates 46/28/16/8/2%. Equipment 45/200 silver; rates 55/29/13/3%. Existing pity counters are preserved. |
| Five towers | Each resumes at the next unbeaten floor from its own towerBest. Existing in-progress runs retain exact floor/seed/squad/HP. A completed tower can replay floor 100. |
| Boss loot | Repeat gear chance 35% → 45%; guaranteed initial/story drops remain. |
| School passives | Two distinct stat passives per school unlock automatically at levels 5/10 and appear in the skill screen. |
| Main-story victories | Battle XP ×1.6 and silver ×1.75, rounded once; noncombat episode rewards unchanged. Result UI and actual grant match; no retroactive rewards. |
| Rare presentation | Tiers 4/5 receive stronger frames and foot auras; tier 6 has a separate radiant frame, particles and aura. |
| Level milestones | Levels 5/10/15/20/25/30 have separate aura colors/strength in formation and battle. Hero cap raised to 30, with existing point/XP formulas extended. |
| Mission objects | Existing authored cart/lock SVG assets draw at full size rather than cropped character-portrait fallback. |
| Escorts | Safe/fast enemies reduced to 25%/40% base strength and 3/2 levels below the hero; victory silver 75/150, XP 90+10×level, ore 3/5 plus herb. Deposits and two daily journeys retained. |
| Duplicates | Each duplicate raises the owned companion one rank, capped at 6; +22% base combat stats and +10% skill strength per rank, including bond variants. Existing duplicate refunds retained. |
| Divine rank | Rank 6 adds ×1.4 stats and ×1.3 skill strength on top of rank advancement, plus larger skill artwork and distinct golden/rainbow presentation. |

## Save compatibility

- Save envelope/schema remains v1; party.ranks is optional, strictly validated and included in shared squads/tower snapshots.
- Old saves without ranks retain their original base tiers. Old history is preserved and is not replayed to grant ranks or currency.
- Historical equipment refunds up to the old 720-silver bundle remain valid even though the current bundle costs 200.
- Existing level-20 builds, points, skills, gear, dungeon snapshots and pity counters remain valid. No save reset or retroactive reward is performed.
- Stronger hero/skill effects exposed an existing reflected-damage boss death during resolve; the telegraph is captured before resolution so cancellation cannot dereference null.

## Verification

Node regression coverage includes independent full branches, the level-6 attribute example, passive unlocks, duplicate promotion/stat/skill damage, save export/import, legacy refunds, five independent tower resumes, 50,000 seeded fishing samples, unlimited virtual wagers, boss loot distribution and escort settlement idempotence.

Dedicated Playwright coverage at 320/390/1280 px checks the attribute/skill UI, rank-six cards, level-30 formation aura, paused scouting, rearrangement/persistence, fishing outcomes and unlimited wagers. Mission-object tests verify decoded assets are actually passed to Canvas drawImage. Existing browser combat scenarios explicitly accept the new ready screen through a shared fixture; the dedicated scenarios inspect it without that helper.

Original 7.0 replay data is retained. reports/replays-progression.json records deterministic first-pair fixtures under the new balance.
