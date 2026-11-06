import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Worker, isMainThread, parentPort, workerData } from 'node:worker_threads';
import { Companion } from '../src/entities/Companion.js';
import { Hero } from '../src/entities/Hero.js';
import { createHeroBuild, allocateSkill, allocateAttribute, equipItem } from '../src/entities/HeroBuild.js';
import { SKILL_TREES } from '../src/data/SkillTreeData.js';
import { COMPANIONS, COMPANIONS_BY_ID } from '../src/data/CompanionsData.js';
import { EQUIPMENT } from '../src/data/EquipmentData.js';
import { SECT_IDS } from '../src/data/SectsData.js';
import { GridSystem } from '../src/combat/GridSystem.js';
import { CombatEngine } from '../src/combat/CombatEngine.js';
import { seededRandom } from '../src/combat/CombatMath.js';
import { worldMethods } from '../src/core/WorldCampaign.js';

export const SCENARIOS = [
  { id: 'level1', level: 1 },
  { id: 'level8', level: 8 },
  { id: 'level20', level: 20 },
  { id: 'level8-equipped', level: 8, gear: true },
  { id: 'level20-prepared', level: 20, gear: true, prepared: true },
  ...[2, 4, 6].map(tier => ({ id: `level20-sect${tier}`, level: 20, gear: true, prepared: true, tier }))
];
const pick = (bag, random) => bag[Math.floor(random() * bag.length)];
function take(bag, count, random) {
  const pool = [...bag], out = [];
  while (out.length < count) {
    if (!pool.length) throw Error('Không đủ đồng hành cho kịch bản.');
    out.push(pool.splice(Math.floor(random() * pool.length), 1)[0]);
  }
  return out;
}
export function sampleSquad(scenario, random) {
  const sect = pick(SECT_IDS, random), build = pick(['attack', 'defense', 'mixed'], random);
  let companions;
  if (scenario.tier) {
    const own = COMPANIONS.filter(c => c.sect === sect), other = COMPANIONS.filter(c => c.sect !== sect);
    companions = [...take(own, scenario.tier - 1, random), ...take(other, 6 - scenario.tier, random)];
  } else companions = take(COMPANIONS, 5, random);
  return { sect, build, companions: companions.map(c => c.id), order: take([0, 1, 2, 3, 4, 5], 6, random) };
}
export function makeSquad(squad, scenario, side, grid) {
  const inventory = scenario.gear ? EQUIPMENT.filter(e => e.sect === squad.sect).map(e => ({ itemId: e.id, quantity: 1 })) : [];
  let profile = createHeroBuild({ sect: squad.sect, level: scenario.level });
  let point = 0;
  while (profile.freeAttributePoints) {
    const offense = ['VoDang', 'NgaMi', 'DuongMon'].includes(squad.sect) ? 'khiHai' : 'kinhLuc';
    const attr = squad.build === 'defense' ? 'canCot' : squad.build === 'mixed' && point++ % 2 === 0 ? 'canCot' : offense;
    profile = allocateAttribute(profile, attr, inventory);
  }
  for (const node of [...SKILL_TREES[squad.sect]].sort((a, b) => a.tier - b.tier)) {
    // Keep historical 'mixed' fixtures on their original two branches.
    if(squad.build==='mixed' && node.branch==='balanced')continue;
    if (squad.build !== 'mixed' && node.branch !== squad.build) continue;
    try { profile = allocateSkill(profile, node.id, inventory); } catch { /* Legal points/tier constraints. */ }
  }
  for (const item of inventory) profile = equipItem(profile, EQUIPMENT.find(e => e.id === item.itemId).slot, item.itemId, inventory);
  const units = [new Hero(squad.sect, { profile, inventory }), ...squad.companions.map(id => new Companion(id, { level: scenario.level }))];
  const tactics = { affiliations: {}, priorities: {}, qigong: scenario.prepared ? 'dragon' : 'balanced', food: scenario.prepared ? 'elixir' : null, autoUltimate: true };
  // Reuse the actual campaign preparation path on both sides before assigning teams/IDs.
  worldMethods.prepareUnits.call({}, units, { preparation: { tactics, training: scenario.prepared ? 10 : 0, forging: scenario.prepared ? 10 : 0 } });
  const cells = [{ x: 2, y: 0 }, { x: 2, y: 1 }, { x: 2, y: 2 }, { x: 1, y: 0 }, { x: 1, y: 1 }, { x: 1, y: 2 }];
  for (let i = 0; i < units.length; i++) {
    const unit = units[i], cell = cells[squad.order[i]];
    unit.team = side; unit.id = `${side}_${i}`;
    grid.place(unit, side === 'home' ? cell : { x: 5 - cell.x, y: cell.y });
  }
  return units;
}
export function simulatePair(a, b, scenario, seed, options = {}) {
  return [false, true].map(swapped => {
    const grid = new GridSystem();
    const home = makeSquad(swapped ? b : a, scenario, 'home', grid);
    const enemy = makeSquad(swapped ? a : b, scenario, 'enemy', grid);
    const battle = new CombatEngine({ units: [...home, ...enemy], grid, seed, ...options });
    battle.start();
    while (battle.state === 'running') battle.update(0.25);
    if (battle.units.some(u => !Number.isFinite(u.stats.hp))) throw Error('Chỉ số trận đấu không hữu hạn.');
    return { swapped, winner: battle.result.winner, reason: battle.result.reason, duration: battle.elapsed, statistics: battle.result.statistics };
  });
}
export function runBalance({ pairs = 150, seed = 20261105, scenarios = SCENARIOS, scenarioOffset = 0, progress = () => {} } = {}) {
  if (!Number.isSafeInteger(pairs) || pairs < 1 || pairs > 10000) throw Error('Số cặp phải từ 1 đến 10000.');
  const results = [];
  for (let index = 0; index < scenarios.length; index++) {
    const scenarioIndex = index + scenarioOffset, random = seededRandom((seed + scenarioIndex * 100000) >>> 0);
    const scenario = scenarios[index], durations = [], units = {}, records = [];
    let draws = 0, homeWins = 0;
    const add = (key, name, won, draw, stat) => {
      const s = units[key] ??= { name, appearances: 0, wins: 0, draws: 0, damage: 0, healing: 0 };
      s.appearances++; s.wins += Number(won); s.draws += Number(draw); s.damage += stat.damage; s.healing += stat.healing;
    };
    for (let pair = 0; pair < pairs; pair++) {
      const a = sampleSquad(scenario, random), b = sampleSquad(scenario, random), battleSeed = (seed + scenarioIndex * 100000 + pair) >>> 0;
      const games = simulatePair(a, b, scenario, battleSeed);
      records.push({ seed: battleSeed, a, b, games: games.map(({ statistics, ...summary }) => summary) });
      for (const game of games) {
        draws += Number(!game.winner); homeWins += Number(game.winner === 'home'); durations.push(game.duration);
        for (const side of ['home', 'enemy']) {
          const squad = (side === 'home') !== game.swapped ? a : b;
          const keys = [`${squad.sect}:${squad.build}`, ...squad.companions];
          keys.forEach((key, i) => add(key, COMPANIONS_BY_ID[key]?.name ?? key, game.winner === side, !game.winner, game.statistics.find(s => s.id === `${side}_${i}`)));
        }
      }
    }
    for (const s of Object.values(units)) {
      s.winRate = +(s.wins / s.appearances).toFixed(4);
      s.score = +((s.wins + s.draws / 2) / s.appearances).toFixed(4);
      s.averageDamage = Math.round(s.damage / s.appearances); s.averageHealing = Math.round(s.healing / s.appearances);
    }
    durations.sort((a, b) => a - b);
    const result = { ...scenario, pairs, matches: pairs * 2, draws, homeWins, meanDuration: +(durations.reduce((a, b) => a + b, 0) / durations.length).toFixed(2), p50: durations[Math.floor(durations.length * .5)], p90: durations[Math.floor(durations.length * .9)], units, records };
    results.push(result); progress(result);
  }
  return { seed, matches: pairs * 2 * scenarios.length, rules: { version: '3.1', yielding: true, overtime: { start: 90, end: 120, maxDamageMultiplier: 2.5, minHealingMultiplier: .4 } }, method: 'One hero + five distinct companions per team. Each pair plays both sides with the same seed and mirrored formations. Auto ultimates; nearest target. Attribute points allocated and legal skills learned. Gear is a three-piece sect set on the hero only. Prepared scenarios use campaign code for level-10 training/forging, elixir and dragon qigong on both teams.', caution: 'Descriptive team-presence rates; not causal tier rankings. Mirrored games and members of the same team are correlated. No independent-trial confidence interval is claimed. Random composition is not an optimized player strategy. Scenarios with 2/4/6 specify the hero sect count, not every sect present. No claim to cover all gear/qigong/priorities/manual choices or campaign pacing.', scenarios: results };
}
export async function runParallel({ pairs = 150, seed = 20261105, progress = () => {} } = {}) {
  if (!Number.isSafeInteger(pairs) || pairs < 1 || pairs > 10000) throw Error('Số cặp phải từ 1 đến 10000.');
  const scenarios = new Array(SCENARIOS.length), active = new Set();
  try {
    let next = 0;
    await Promise.all(Array.from({ length: 4 }, async () => {
      while (next < SCENARIOS.length) {
        const index = next++;
        const worker = new Worker(new URL(import.meta.url), { workerData: { index, pairs, seed } });
        active.add(worker);
        const result = await new Promise((resolve, reject) => {
          worker.once('message', resolve); worker.once('error', reject);
          worker.once('exit', code => { if (code !== 0) reject(Error(`Simulation worker exited: ${code}`)); });
        });
        active.delete(worker); scenarios[index] = result; progress(result);
      }
    }));
  } catch (error) { await Promise.all([...active].map(w => w.terminate())); throw error; }
  return { ...runBalance({ pairs, seed, scenarios: [] }), matches: pairs * 2 * scenarios.length, scenarios };
}
export function serializeReport(report) {
  let index = 0;
  // One replayable pair per line keeps the checked-in raw data reviewable.
  return JSON.stringify(report, (key, value) => key === 'records' ? [] : value, 2)
    .replace(/"records": \[\]/g, () => `"records": [\n${report.scenarios[index++].records.map(record => '        ' + JSON.stringify(record)).join(',\n')}\n      ]`) + '\n';
}
if (!isMainThread && workerData?.index !== undefined) {
  const { index, pairs, seed } = workerData;
  parentPort.postMessage(runBalance({ pairs, seed, scenarios: [SCENARIOS[index]], scenarioOffset: index }).scenarios[0]);
} else if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const pairs = Number(process.argv[2] ?? 150), output = process.argv[3] ?? 'reports/balance-6v6.json';
  const report = await runParallel({ pairs, progress: r => console.log(JSON.stringify({ scenario: r.id, matches: r.matches, draws: r.draws, homeWins: r.homeWins, mean: r.meanDuration })) });
  mkdirSync(dirname(output), { recursive: true });
  writeFileSync(output, serializeReport(report));
  console.log(`Saved ${report.matches} matches to ${output}`);
}
