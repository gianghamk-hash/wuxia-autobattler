# Enemy stats from chapter 3

The current Đại Việt campaign applies an **additional ×2 to every finite numeric enemy stat from chapter 3 through chapter 20**, relative to the existing encounter, level, equipment, and boss-phase scaling. Chapters 1–2 retain their existing stats.

The 15 current fields are hp, maxHp, energy, maxEnergy, physicalAtk, magicalAtk, physicalDef, magicalDef, attackSpeed, moveSpeed, attackRange, critRate, critDmg, dodgeRate, and blockRate. The scaler covers actual fields dynamically; see baseStats in SectsData for the authoritative schema.

Main-story battles and scouting use the encounter's chapter. Practice, arena, escort, and dungeon battles use actual story progress, rather than a dungeon floor's synthetic chapter. Chapter-boss replays use the replayed chapter: early bosses retain their original difficulty even when replayed later. The independent tactics sandbox and legacy campaign retain their original rules.

The combat engine scales enemies before passives and director initialization and also scales newly added units. Boss phases retain unscaled construction seeds; guards, seals and mission reinforcements combine scaled inherited values with scaled base stats exactly once. Allies and mission objectives are excluded. The transient multiplier marker is not saved into the hero, inventory or encounter checkpoint, and rebuilding/retrying a saved battle cannot compound it.

Existing combat limits on effective critical chance, critical damage and dodge still apply. Doubling all raw stats is substantially stronger than doubling HP alone and does not imply precisely twice the overall combat power. Previously successful sample squads can now lose; this change does not certify every late-game encounter as beatable with the old sample builds.

## Verification

`tests/enemy-difficulty.test.js` compares exact per-stat values against the original multiplier, checks all three boss phases, guard/seal summons, reinforcement inheritance, chapter 2/3/20 scouting, deterministic checkpoint retry, and side-content/replay boundaries. Existing progression/reward tests use an explicitly named controlled victory fixture where they need a guaranteed winner. The tower simulation retains actual winners and losses and verifies deterministic settlement for both. Browser coverage checks unchanged enemy stats after IndexedDB checkpoint reload and isolates the reward UI with the same controlled fixture.
