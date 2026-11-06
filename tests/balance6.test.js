import test from 'node:test';
import assert from 'node:assert/strict';
import { sampleSquad, makeSquad, runBalance, SCENARIOS } from '../scripts/balance-6v6.mjs';
import { GridSystem } from '../src/combat/GridSystem.js';
import { seededRandom } from '../src/combat/CombatMath.js';
import { COMPANIONS_BY_ID } from '../src/data/CompanionsData.js';

test('6v6 samples use one legal hero and five distinct companions, with exact requested sect counts', () => {
  const random = seededRandom(7);
  for (const scenario of SCENARIOS) {
    for (let i = 0; i < 5; i++) {
      const squad = sampleSquad(scenario, random);
      assert.equal(new Set(squad.companions).size, 5);
      if (scenario.tier) assert.equal(1 + squad.companions.filter(id => COMPANIONS_BY_ID[id].sect === squad.sect).length, scenario.tier);
      const grid = new GridSystem(), units = makeSquad(squad, scenario, 'home', grid);
      assert.equal(units.length, 6);
      assert.equal(grid.units.size, 6);
      assert.equal(units[0].profile.freeAttributePoints, 0);
      if (scenario.gear) assert.equal(units[0].activeEquipmentSets.length, 2);
      const expectedStat = ['VoDang', 'NgaMi'].includes(squad.sect) ? 'khiHai' : 'kinhLuc';
      if (scenario.level > 1 && squad.build === 'attack') assert.ok(units[0].attributes[expectedStat] > 0);
      if (scenario.prepared) assert.ok(units.every(u => u.rowUltimate));
      assert.ok(units.every(u => Number.isFinite(u.stats.hp) && u.stats.hp === u.stats.maxHp));
    }
  }
});
test('6v6 mirrored report is reproducible and records every match and all twelve participants', () => {
  const options = { pairs: 1, seed: 8, scenarios: [SCENARIOS[0]] };
  const first = runBalance(options);
  assert.deepEqual(runBalance(options), first);
  assert.equal(first.matches, 2);
  const s = first.scenarios[0];
  assert.equal(s.records[0].games.length, 2);
  assert.equal(s.records[0].games[0].swapped, false);
  assert.equal(s.records[0].games[1].swapped, true);
  assert.equal(Object.values(s.units).reduce((n, u) => n + u.appearances, 0), 24);
});
