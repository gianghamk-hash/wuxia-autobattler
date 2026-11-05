import { writeFileSync, mkdirSync } from 'node:fs';
import { Companion } from '../src/entities/Companion.js';
import { Hero } from '../src/entities/Hero.js';
import { createHeroBuild, allocateSkill } from '../src/entities/HeroBuild.js';
import { SKILL_TREES } from '../src/data/SkillTreeData.js';
import { COMPANIONS } from '../src/data/CompanionsData.js';
import { SECT_IDS } from '../src/data/SectsData.js';
import { GridSystem } from '../src/combat/GridSystem.js';
import { CombatEngine } from '../src/combat/CombatEngine.js';
import { seededRandom } from '../src/combat/CombatMath.js';
const roster = [
  ...COMPANIONS.map((c) => ({ id: c.id, name: c.name })),
  ...SECT_IDS.flatMap((sect) =>
    ['attack', 'defense', 'mixed'].map((build) => ({
      id: `${sect}:${build}`,
      name: `${sect} / ${build}`,
      sect,
      build
    }))
  )
];
const stats = Object.fromEntries(
  roster.map((c) => [
    c.id,
    { name: c.name, games: 0, wins: 0, draws: 0, damage: 0, healing: 0 }
  ])
);
const random = seededRandom(20261105),
  durations = [];
let draws = 0,
  homeWins = 0;
function instance(entry, id, team) {
  if (!entry.sect) return new Companion(entry.id, { id, team, level: 8 });
  let profile = createHeroBuild({ sect: entry.sect, level: 8 });
  for (const node of [...SKILL_TREES[entry.sect]].sort(
    (a, b) => a.tier - b.tier
  )) {
    if (
      entry.build !== 'mixed' &&
      node.branch !== (entry.build === 'attack' ? 'attack' : 'defense')
    )
      continue;
    try {
      profile = allocateSkill(profile, node.id, []);
    } catch {}
  }
  return new Hero(entry.sect, { profile, id, team });
}
const matches = 1000;
for (let match = 0; match < matches; match++) {
  const grid = new GridSystem(),
    chosen = [],
    units = [];
  for (const team of ['home', 'enemy']) {
    const bag = [...roster];
    for (let i = 0; i < 3; i++) {
      const entry = bag.splice(Math.floor(random() * bag.length), 1)[0],
        id = `${team}_${i}`,
        unit = instance(entry, id, team);
      const x = team === 'home' ? [2, 1, 0][i] : [3, 4, 5][i];
      grid.place(unit, { x, y: i });
      units.push(unit);
      chosen.push({ entry, id, team });
    }
  }
  const battle = new CombatEngine({ units, grid, seed: match + 77123 });
  battle.start();
  while (battle.state === 'running') battle.update(0.25);
  if (!battle.result.winner) draws++;
  if (battle.result.winner === 'home') homeWins++;
  durations.push(battle.elapsed);
  for (const c of chosen) {
    const s = stats[c.entry.id],
      r = battle.result.statistics.find((r) => r.id === c.id);
    s.games++;
    s.wins += Number(battle.result.winner === c.team);
    s.draws += Number(!battle.result.winner);
    s.damage += r.damage;
    s.healing += r.healing;
  }
}
for (const s of Object.values(stats)) {
  s.winRate = +(s.wins / s.games).toFixed(4);
  s.drawRate = +(s.draws / s.games).toFixed(4);
  s.averageDamage = Math.round(s.damage / s.games);
  s.averageHealing = Math.round(s.healing / s.games);
  const p = s.winRate,
    n = s.games,
    z = 1.96,
    d = 1 + (z * z) / n,
    center = (p + (z * z) / (2 * n)) / d,
    half = (z * Math.sqrt((p * (1 - p)) / n + (z * z) / (4 * n * n))) / d;
  s.confidence95 = [+(center - half).toFixed(3), +(center + half).toFixed(3)];
}
durations.sort((a, b) => a - b);
const report = {
  matches,
  seed: 20261105,
  format:
    '3v3, level 8, no equipment/consumables, 20 companions + 5 sects × 3 preset builds',
  caution:
    'Team-presence win rates are descriptive, not isolated causal strength. Confidence intervals quantify sampling only. Builds are three legal presets, not all possible builds.',
  draws,
  homeWins,
  meanDuration: +(durations.reduce((a, b) => a + b, 0) / matches).toFixed(2),
  p50: durations[500],
  p90: durations[900],
  units: stats
};
mkdirSync('reports', { recursive: true });
const output = process.argv[2] ?? 'reports/balance-current.json';
writeFileSync(output, JSON.stringify(report, null, 2) + '\n');
console.log(
  JSON.stringify({
    output,
    matches,
    draws,
    homeWins,
    mean: report.meanDuration,
    bottom: Object.entries(stats)
      .sort((a, b) => a[1].winRate - b[1].winRate)
      .slice(0, 4)
      .map(([id, s]) => [id, s.winRate]),
    top: Object.entries(stats)
      .sort((a, b) => b[1].winRate - a[1].winRate)
      .slice(0, 4)
      .map(([id, s]) => [id, s.winRate])
  })
);
