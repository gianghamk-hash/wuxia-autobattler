import test from 'node:test';
import assert from 'node:assert/strict';
import { Hero } from '../src/entities/Hero.js';
import { Companion } from '../src/entities/Companion.js';
import { GridSystem } from '../src/combat/GridSystem.js';
import { TargetSelector } from '../src/combat/TargetSelector.js';
import { StatusEngine } from '../src/combat/StatusEngine.js';
import { SECTS } from '../src/data/SectsData.js';
import { COMPANIONS_BY_ID } from '../src/data/CompanionsData.js';

function enemy(id, x, y, grid) {
  const unit = new Companion('companion_05', { id, team: 'enemy' });
  grid.place(unit, { x, y }, { formation: false }); return unit;
}
function setup(sect = 'ThieuLam') {
  const grid = new GridSystem(), hero = new Hero(sect); grid.place(hero, { x: 1, y: 1 });
  const near = enemy('near', 3, 1, grid), weak = enemy('weak', 4, 2, grid), back = enemy('back', 5, 0, grid);
  near.stats.hp *= .8; weak.stats.hp *= .2;
  return { grid, hero, near, weak, back, units: [hero, near, weak, back] };
}
test('each hero sect and companion creates independent mutable stats at the requested level', () => {
  for (const sect of Object.keys(SECTS)) {
    const hero = new Hero(sect, { level: 3 });
    assert.equal(hero.stats.maxHp, SECTS[sect].baseStats.maxHp + 2 * SECTS[sect].growthPerLevel.maxHp);
    assert.equal(hero.stats.hp, hero.stats.maxHp); assert.equal(hero.stats.energy, 0);
  }
  const first = new Companion('companion_01'), second = new Companion('companion_01', { id: 'other' });
  first.takeDamage(100); first.skills.ultimate.effects[0].duration = 99;
  assert.equal(second.stats.hp, COMPANIONS_BY_ID.companion_01.baseStats.maxHp);
  assert.notEqual(second.skills.ultimate.effects[0].duration, 99);
  assert.throws(() => new Hero('TuDo')); assert.throws(() => new Hero('toString'));
  assert.throws(() => new Companion('unknown')); assert.throws(() => new Companion('companion_01', { level: 0 }));
});
test('damage consumes shields first, clamps health/energy and never heals a dead unit', () => {
  const hero = new Hero('ThieuLam'), status = new StatusEngine(), hp = hero.stats.hp;
  status.apply(hero, { type: 'shield', duration: 5, amount: 80 });
  status.apply(hero, { type: 'shield', duration: 5, amount: 20 });
  assert.deepEqual(hero.takeDamage(120), { hpDamage: 20, absorbed: 100, killed: false });
  assert.equal(hero.stats.hp, hp - 20); assert.equal(hero.shield, 0);
  hero.heal(9999); assert.equal(hero.stats.hp, hp);
  hero.gainEnergy(9999); assert.equal(hero.stats.energy, 100);
  hero.takeDamage(99999); assert.equal(hero.state, 'DEAD'); assert.equal(hero.stats.hp, 0);
  assert.equal(hero.heal(500), 0); assert.equal(hero.gainEnergy(100), 0);
  assert.throws(() => hero.takeDamage(-1)); assert.throws(() => hero.heal(NaN));
});
test('grid validates bounds, formation sides, collisions and duplicate IDs atomically', () => {
  const grid = new GridSystem(), hero = new Hero('VoDang');
  grid.place(hero, { x: 0, y: 1 }); assert.equal(grid.distance(hero.gridPosition, { x: 3, y: 1 }), 3);
  assert.equal(grid.distance({ x: 0, y: 0 }, { x: 1, y: 1 }), 1);
  const old = { ...hero.gridPosition };
  assert.throws(() => grid.place(hero, { x: 4, y: 1 }));
  assert.throws(() => grid.place(hero, { x: -1, y: 1 }));
  assert.throws(() => grid.place(hero, { x: .5, y: 1 }));
  assert.throws(() => grid.place(new Hero('CaiBang'), { x: 1, y: 1 }));
  assert.throws(() => grid.place(new Companion('companion_01'), old));
  assert.deepEqual(hero.gridPosition, old); assert.equal(grid.units.size, 1);
});
test('BFS avoids occupied cells and cannot cut blocked corners', () => {
  const grid = new GridSystem(), hero = new Hero('CaiBang'), block = new Companion('companion_01');
  grid.place(hero, { x: 1, y: 1 }); grid.place(block, { x: 2, y: 1 });
  assert.equal(grid.move(hero, { x: 2, y: 0 }), false);
  const path = grid.findPath(hero, { x: 4, y: 1 }); assert.ok(path.length > 0);
  assert.ok(path.every(p => !(p.x === 2 && p.y === 1)));
  for (const next of path) assert.equal(grid.move(hero, next), true);
  assert.deepEqual(hero.gridPosition, { x: 4, y: 1 }); // movement can cross halves
  assert.deepEqual(grid.findPath(hero, hero.gridPosition), []);
  assert.equal(grid.findPath(hero, block.gridPosition), null);
});
test('a blocked route terminates; clearing dead blockers releases occupancy', () => {
  const grid = new GridSystem(), hero = new Hero('CaiBang'); grid.place(hero, { x: 1, y: 1 });
  const wall = [0, 1, 2, 3].map(y => { const u = new Companion('companion_01', { id: `wall${y}` }); grid.place(u, { x: 2, y }); return u; });
  assert.equal(grid.findPath(hero, { x: 5, y: 1 }), null);
  wall[1].takeDamage(99999); grid.removeDead();
  assert.equal(wall[1].gridPosition, null); assert.equal(grid.units.has(wall[1].id), false);
  assert.ok(grid.findPath(hero, { x: 5, y: 1 }).length > 0);
});
test('range paths stop on an empty tile in range, never on the target tile', () => {
  const { grid, hero, near } = setup('CaiBang');
  const path = grid.pathToRange(hero, near, 1); assert.ok(path.length > 0);
  for (const next of path) assert.equal(grid.move(hero, next), true);
  assert.equal(grid.distance(hero.gridPosition, near.gridPosition), 1);
  assert.notDeepEqual(hero.gridPosition, near.gridPosition);
  assert.deepEqual(grid.pathToRange(hero, near, 1), []);
  near.takeDamage(99999); assert.equal(grid.pathToRange(hero, near), null);
});
test('target strategies select nearest, lowest percentage HP and the correct mirrored backline', () => {
  const { grid, hero, near, weak, back, units } = setup();
  assert.equal(TargetSelector.select(hero, units, grid), near);
  assert.equal(TargetSelector.select(hero, units, grid, 'lowest_hp'), weak);
  assert.equal(TargetSelector.select(hero, units, grid, 'backline'), back);
  const ranged = new Companion('companion_04'); grid.place(ranged, { x: 0, y: 0 }); units.push(ranged);
  assert.equal(TargetSelector.select(ranged, units, grid), back);
  assert.equal(TargetSelector.select(back, units, grid, 'backline'), ranged);
  const assassin = new Companion('companion_08'); grid.place(assassin, { x: 0, y: 2 }); units.push(assassin);
  assert.equal(TargetSelector.select(assassin, units, grid), weak);
  assert.throws(() => TargetSelector.select(hero, units, grid, 'invalid'));
});
test('healers choose wounded allies by percentage including self, never enemy HP', () => {
  const { grid, hero, near, units } = setup('NgaMi'); near.stats.hp = 1;
  assert.equal(TargetSelector.select(hero, units, grid), null);
  const ally = new Companion('companion_01'); grid.place(ally, { x: 0, y: 0 }); units.push(ally);
  ally.stats.hp *= .5; hero.stats.hp *= .8;
  assert.equal(TargetSelector.select(hero, units, grid), ally);
  hero.stats.hp *= .1; assert.equal(TargetSelector.select(hero, units, grid), hero);
});
test('taunt overrides role, expires and cannot lock onto a dead source', () => {
  const { grid, hero, near, weak, back, units } = setup(), status = new StatusEngine();
  status.apply(hero, { type: 'taunt', duration: 1, sourceId: back.id });
  assert.equal(TargetSelector.select(hero, units, grid), back);
  status.update(hero, 1); assert.equal(TargetSelector.select(hero, units, grid), near);
  status.apply(hero, { type: 'taunt', duration: 3, sourceId: back.id }); back.takeDamage(99999);
  assert.equal(TargetSelector.select(hero, units, grid), near);
  near.takeDamage(99999); assert.equal(TargetSelector.select(hero, units, grid), weak);
  weak.takeDamage(99999); assert.equal(TargetSelector.select(hero, units, grid), null);
});
test('poison caps at five stacks, ticks each second and applies no tick after expiry', () => {
  const hero = new Hero('ThieuLam'), status = new StatusEngine(), hp = hero.stats.hp;
  for (let i = 0; i < 7; i++) status.apply(hero, { type: 'poison', duration: 2.5, damagePerStack: 10 });
  assert.equal(hero.statusEffects.length, 1); assert.equal(hero.statusEffects[0].stacks, 5);
  status.update(hero, .5); assert.equal(hero.stats.hp, hp);
  status.update(hero, 10); assert.equal(hero.stats.hp, hp - 100); assert.equal(hero.statusEffects.length, 0);
});
test('stun blocks movement and energy; shield expires and cleanse leaves beneficial shields', () => {
  const { grid, hero } = setup(), status = new StatusEngine();
  status.apply(hero, { type: 'stun', duration: 2 });
  assert.equal(grid.move(hero, { x: 1, y: 0 }), false); assert.equal(hero.gainEnergy(20), 0);
  hero.takeDamage(100); assert.equal(hero.stats.energy, 0);
  status.apply(hero, { type: 'shield', duration: 3, amount: 200 });
  status.cleanse(hero); assert.equal(hero.stunned, false); assert.equal(hero.shield, 200);
  assert.equal(grid.move(hero, { x: 1, y: 0 }), true);
  status.update(hero, 3); assert.equal(hero.shield, 0); assert.equal(hero.state, 'IDLE');
});
test('periodic damage and stun use the same timeline regardless of frame size or insertion order', () => {
  const run = (reverse, dt) => {
    const hero = new Hero('ThieuLam'), status = new StatusEngine();
    const definitions = [{ type: 'stun', duration: 1.5 }, { type: 'poison', duration: 3, damagePerStack: 10 }, { type: 'shield', duration: .5, amount: 200 }];
    (reverse ? definitions.reverse() : definitions).forEach(d => status.apply(hero, d));
    for (let time = 0; time < 3 - 1e-9; time += dt) status.update(hero, dt);
    return { hp: hero.stats.hp, energy: hero.stats.energy, state: hero.state, effects: hero.statusEffects.length };
  };
  const expected = run(false, 3);
  assert.deepEqual(run(true, 3), expected); assert.deepEqual(run(false, .1), expected);
  assert.equal(expected.hp, 1570); assert.equal(expected.energy, .5); assert.equal(expected.effects, 0);
});
test('a periodic kill cleans up statuses and never revives; invalid effects do not mutate', () => {
  const hero = new Hero('CaiBang'), status = new StatusEngine(); hero.stats.hp = 10;
  status.apply(hero, { type: 'bleed', duration: 4, damagePerStack: 15 }); status.update(hero, 5);
  assert.equal(hero.alive, false); assert.deepEqual(hero.statusEffects, []);
  assert.equal(status.apply(hero, { type: 'shield', duration: 3, amount: 200 }), null);
  const alive = new Hero('NgaMi');
  assert.throws(() => status.apply(alive, { type: 'poison', duration: 3, damagePerStack: -10 }));
  assert.throws(() => status.apply(alive, { type: 'stun', duration: 0 }));
  assert.throws(() => status.update(alive, -1)); assert.deepEqual(alive.statusEffects, []);
});
