# Formation roles and campaign tuning

All sixty companions and all five sect heroes show a shared broad role on owned/recruitment cards, formation selectors, occupied formation cells, the character dossier, and gacha results. Text labels accompany color; no color recognition is required.

| Tag | Main combat roles |
| --- | --- |
| Tiền tuyến | Tank, SubTank, Bruiser, ReflectTank |
| Hỗ trợ | Healer, Support, Buffer, Debuffer, Battery, CrowdControl, Disruptor |
| Sát thương | RangedDPS, BurstMage, Mage, Assassin, DualDPS, Poisoner, EvasionDPS, Finisher, Wildcard |

These are placement hints, not restrictions: existing formation editing, character kits and ownership remain unchanged.

Canonical dungeon enemies receive 15% less HP/physical attack/magical attack on floors 1–10, 10% less on 11–20, and the existing budget from floor 21 onward. Authored boss multipliers and the additional chapter-3 ×2 multiplier still compose with these factors. Enemy defenses and other stats are untouched by this dungeon adjustment.

Every canonical story battle now rolls 4–8 enemy troops from the quest ID, encounter seed and phase number. Each of the three story-boss phases independently rolls 4–8; separate replay bosses and dungeon waves retain their authored headcounts. Scouting predicts the next pending seed, actual battles use that same seed, and reloading a pending encounter reproduces its count and stats. New attempts can draw a different count. Mission objects are separate from troops; breach locks may occupy remaining board cells when eight troops fill most of the enemy side. Eight enemies, six allies and three locks fit without overlapping.

Chapters 1–2 retain a four-troop total HP/attack budget as their randomized headcount rises, so an untrained hero can still reach enrollment with earned story XP and the authored guides. Early boss waves preserve this budget between wave sizes. From chapter 3, troop stats retain the requested extra ×2 and random larger squads intentionally increase the challenge.

Every canonical story episode awards `round(original XP × 1.15)` and `round(original silver × 1.15)`. Zero rewards, including the ending, stay zero. The same catalog values feed previews and settlement, so the bonus is not added twice and previously completed episodes do not receive retroactive payments.

Regression coverage checks all 265 encounter count ranges, every available count per encounter, boss waves, objective layout, sixty companion/five sect tags, dungeon floor boundaries, catalog reward amounts, deterministic scout/checkpoint retry, and real untrained progression through enrollment. Mobile/desktop browser coverage checks visible tags, overflow, roster/dossier consistency and unchanged randomized counts after IndexedDB reload. Tests concerned with acquisition/reward bookkeeping use a controlled victory fixture independently of combat difficulty.
