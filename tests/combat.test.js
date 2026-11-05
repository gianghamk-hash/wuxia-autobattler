import test from 'node:test';
import assert from 'node:assert/strict';
import { Hero } from '../src/entities/Hero.js';
import { Companion } from '../src/entities/Companion.js';
import { GridSystem } from '../src/combat/GridSystem.js';
import { CombatEngine } from '../src/combat/CombatEngine.js';
import { calculateDamage, attackInterval, seededRandom } from '../src/combat/CombatMath.js';
import { COMPANIONS } from '../src/data/CompanionsData.js';
import { GameEngine } from '../src/core/GameEngine.js';
import { EventBus } from '../src/core/EventBus.js';
function battle(seed = 12345) {
  const grid = new GridSystem();
  const units = [new Hero('VoDang'), new Companion('companion_01'), new Companion('companion_03'),
    new Companion('companion_05', { id: 'enemy_01', team: 'enemy' }),
    new Companion('companion_04', { id: 'enemy_02', team: 'enemy' }),
    new Companion('companion_08', { id: 'enemy_03', team: 'enemy' })];
  const cells = [{ x: 1, y: 1 }, { x: 2, y: 0 }, { x: 0, y: 2 }, { x: 3, y: 1 }, { x: 5, y: 0 }, { x: 4, y: 2 }];
  units.forEach((u, i) => grid.place(u, cells[i]));
  const events = []; const combat = new CombatEngine({ units, grid, seed, onEvent: e => events.push(e) });
  return { combat, units, grid, events };
}
function finish(combat) { for (let i = 0; i < 8000 && combat.state === 'running'; i++) combat.update(1 / 60); }
function duel() {
  const grid = new GridSystem(), a = new Hero('CaiBang'), b = new Companion('companion_01', { id: 'enemy', team: 'enemy' });
  grid.place(a, { x: 2, y: 1 }); grid.place(b, { x: 3, y: 1 });
  a.stats.dodgeRate = b.stats.dodgeRate = 0; a.stats.blockRate = b.stats.blockRate = 0; a.stats.critRate = b.stats.critRate = 0;
  return { a, b, grid, combat: new CombatEngine({ units: [a, b], grid }) };
}
test('combat math follows armor, attack interval and bounded crit/block/dodge rolls', () => {
  const { a, b } = duel();
  const skill = { type: 'physical', dmgMultiplier: 2 };
  const hit = calculateDamage(a, b, skill, () => .99);
  assert.equal(hit.amount, a.stats.physicalAtk * 2 * 1000 / (1000 + b.stats.physicalDef * 3.5));
  b.stats.dodgeRate = .5; assert.equal(calculateDamage(a, b, skill, () => 0).missed, true);
  a.attributes = { thanPhap: 20, ngoTinh: 1000, kinhLuc: 10 };
  assert.equal(attackInterval(a), 2 / 1.3 / a.stats.attackSpeed);
  const one = seededRandom(0), two = seededRandom(0);
  assert.deepEqual(Array.from({ length: 20 }, one), Array.from({ length: 20 }, two));
});
test('default battle terminates with one result, damage, healing and ultimates', () => {
  const { combat, events, units } = battle(); combat.start(); finish(combat);
  assert.equal(combat.state, 'finished'); assert.equal(combat.result.reason, 'elimination');
  assert.ok(combat.result.duration >= 20 && combat.result.duration <= 45);
  assert.equal(events.filter(e => e.type === 'result').length, 1);
  assert.ok(events.some(e => e.type === 'ultimate')); assert.ok(events.some(e => e.type === 'heal'));
  const hp = units.map(u => u.stats.hp); combat.update(100); assert.deepEqual(units.map(u => u.stats.hp), hp);
  assert.equal(combat.start(), false); assert.ok(combat.events.length <= 200);
});
test('same seeded battle produces identical outcomes and events at x1/x2/x3 including pause', () => {
  globalThis.document = { hidden: false, addEventListener() {}, removeEventListener() {} };
  globalThis.requestAnimationFrame = () => 1; globalThis.cancelAnimationFrame = () => {};
  const outputs = [];
  for (const scale of [1, 2, 3]) {
    const { combat, events } = battle(42); combat.start();
    const engine = new GameEngine({ eventBus: new EventBus() });
    engine.addUpdater(dt => combat.update(dt)); engine.setTimeScale(scale); engine.start(); engine._loop(0);
    engine.pause(); engine._loop(100); assert.equal(combat.ticks, 0); engine.resume();
    for (let frame = 1; frame <= 8000 && combat.state === 'running'; frame++) engine._loop(100 + frame * 1000 / 60);
    outputs.push({ result: combat.result, events }); engine.stop();
  }
  assert.deepEqual(outputs[0], outputs[1]); assert.deepEqual(outputs[1], outputs[2]);
});
test('rage is spent on ultimate impact, normal hits charge rage and a dead target cancels windup', () => {
  const { a, b, combat, grid } = duel();
  combat.start(); a.stats.energy = 100; combat.update(1 / 60);
  assert.equal(a.state, 'ULTIMATE'); assert.equal(a.stats.energy, 100);
  combat.update(.4); assert.ok(a.stats.energy < 100); assert.equal(combat.records.get(a.id).ultimates, 1);
  const second = duel(); second.combat.start(); second.combat.update(.3);
  assert.ok(second.a.stats.energy >= 15);
  const c = new Companion('companion_01', { id: 'enemy2', team: 'enemy' }); grid.place(c, { x: 4, y: 0 });
  combat.units.push(c); // For cancellation assertion only; no extra simulation of unregistered brains.
  const brain = combat.brains.get(a.id); brain.cooldown = 0; a.stats.energy = 100;
  brain.update(1 / 60, combat); assert.ok(brain.action);
  b.takeDamage(99999); grid.removeDead(); brain.update(1 / 60, combat);
  assert.equal(brain.action, null); assert.equal(a.stats.energy, 100);
  brain.update(1 / 60, combat); assert.equal(brain.targetId, c.id);
});
test('stun cancels the windup without spending rage; cooldowns and movement resume after recovery', () => {
  const { a, combat } = duel(); combat.start(); a.stats.energy = 100; combat.update(1 / 60);
  combat.statuses.apply(a, { type: 'stun', duration: .5 }); combat.update(.2);
  assert.equal(a.state, 'STUNNED'); assert.equal(a.stats.energy, 100); assert.equal(combat.brains.get(a.id).action, null);
  combat.update(.8); assert.ok(combat.records.get(a.id).ultimates > 0);
});
test('a screened backline target falls back to a reachable enemy instead of standing idle', () => {
  const { combat, units } = battle(); combat.start();
  const ranged = units[4];
  for (let i = 0; i < 300; i++) combat.update(1 / 60);
  assert.ok(combat.records.get(ranged.id).damage > 0);
});
test('all 20 companion ultimate definitions resolve their effects without unsupported branches', () => {
  for (const definition of COMPANIONS) {
    const grid = new GridSystem(), caster = new Companion(definition.id), hero = new Hero('ThieuLam'), ally = new Companion('companion_02', { id: 'ally' });
    const foes = [0, 1, 2].map(i => new Companion('companion_01', { id: `enemy${i}`, team: 'enemy' }));
    const units = [caster, hero, ally, ...foes];
    [{ x: 2, y: 1 }, { x: 0, y: 0 }, { x: 1, y: 2 }, { x: 3, y: 1 }, { x: 4, y: 1 }, { x: 5, y: 2 }].forEach((p, i) => grid.place(units[i], p));
    const combat = new CombatEngine({ units, grid }); combat.start();
    hero.stats.hp *= .5; combat.statuses.apply(hero, { type: 'stun', duration: 3 });
    const target = combat.chooseTarget(caster, caster.skills.ultimate); assert.ok(target, definition.name);
    assert.doesNotThrow(() => combat.resolveSkill(caster, target, caster.skills.ultimate, true), definition.name);
    assert.equal(combat.records.get(caster.id).ultimates, 1);
    assert.ok(units.every(u => Number.isFinite(u.stats.hp) && u.stats.hp >= 0 && u.stats.energy <= 100));
  }
});
test('support basics, hero healing, energy transfer and regeneration work', () => {
  const { combat, units, grid } = battle();
  const tea = new Companion('companion_11'); grid.remove(units[1]); grid.place(tea, { x: 2, y: 0 });
  const roster = [units[0], tea, ...units.slice(2)]; const c = new CombatEngine({ units: roster, grid }); c.start();
  assert.ok(c.chooseTarget(tea, tea.skills.autoAttack, true)?.team === 'enemy');
  const healer = units[2], hero = units[0]; hero.stats.hp -= 300;
  const before = hero.stats.hp; c.resolveSkill(healer, hero, healer.skills.autoAttack, false);
  assert.ok(hero.stats.hp > before); assert.ok(healer.stats.energy >= 15);
  c.effect(healer, hero, { type: 'energy_restore', amount: 40 }); assert.equal(hero.stats.energy, 50);
  const hp = hero.stats.hp; c.effect(healer, hero, { type: 'heal_over_time', duration: 2, multiplier: .6, scalingStat: 'magicalAtk' });
  c.statuses.update(hero, 1); assert.ok(hero.stats.hp > hp);
});
test('charm makes hostile attacks target former allies, expires, and never heals opponents', () => {
  const { combat, units } = battle(); combat.start(); const actor = units[3];
  combat.statuses.apply(actor, { type: 'charm', duration: 2, sourceId: units[0].id });
  const target = combat.chooseTarget(actor, actor.skills.autoAttack, true);
  assert.equal(target.team, actor.team); assert.notEqual(target.id, actor.id);
  combat.statuses.update(actor, 2); assert.notEqual(combat.chooseTarget(actor, actor.skills.autoAttack, true).team, actor.team);
});
test('synergies grant the GDD shield/energy/damage modifiers and poison detonates at five stacks', () => {
  const { grid, units } = battle();
  const healer = new Hero('NgaMi'), poison = new Companion('companion_04'), beggar = new Companion('companion_01');
  [0, 1, 2].forEach(i => grid.remove(units[i])); [healer, poison, beggar].forEach((u, i) => grid.place(u, { x: i, y: 0 }));
  const c = new CombatEngine({ grid, units: [healer, poison, beggar, ...units.slice(3)] }); c.start();
  assert.ok(Math.abs(poison.damageMultiplier - 1.02) < 1e-9); assert.ok(c.teamSynergies.home.includes('doc_ba_vo_lam'));
  const target = units[3]; target.stats.dodgeRate = target.stats.blockRate = 0; poison.stats.critRate = 0;
  target.stats.maxHp = target.stats.hp = 100000;
  for (let i = 0; i < 5; i++) c.resolveSkill(poison, target, poison.skills.autoAttack, false);
  assert.equal(target.statusEffects.filter(e => e.type === 'poison').length, 0);
  assert.ok(c.records.get(poison.id).damage > 5 * 30);
  const standard = battle(); standard.combat.start(); assert.equal(standard.units[0].energyGainMultiplier, 1.33);
});
test('terminal timeout, defeat, victory, abort and mutual elimination emit exactly once', () => {
  const { a, b, combat } = duel(); combat.maxDuration = .1; combat.start(); combat.update(1);
  assert.equal(combat.result.reason, 'timeout'); assert.equal(combat.result.winner, null);
  const win = duel(); win.b.takeDamage(99999); win.grid.removeDead(); win.combat.start(); assert.equal(win.combat.result.winner, 'home');
  const loss = duel(); loss.a.takeDamage(99999); loss.grid.removeDead(); loss.combat.start(); assert.equal(loss.combat.result.winner, 'enemy');
  const draw = duel(); draw.a.takeDamage(99999); draw.b.takeDamage(99999); draw.combat.start(); assert.equal(draw.combat.result.winner, null);
  const abort = battle(); abort.combat.start(); abort.combat.abort(); abort.combat.abort();
  assert.equal(abort.combat.result.reason, 'aborted'); assert.equal(abort.events.filter(e => e.type === 'result').length, 1);
});

test('all companion roles participate in a full automatic battle without throwing', () => {
  for (const definition of COMPANIONS) {
    const setup = battle(77), index = definition.id === 'companion_01' ? 1 : 2;
    setup.grid.remove(setup.units[index]);
    const member = new Companion(definition.id);
    setup.units[index] = member; setup.grid.place(member, index === 1 ? { x: 2, y: 0 } : { x: 0, y: 2 });
    const c = new CombatEngine({ units: setup.units, grid: setup.grid, seed: 77 }); c.start();
    assert.doesNotThrow(() => finish(c), definition.name);
    assert.equal(c.state, 'finished', definition.name);
    const record = c.records.get(member.id);
    assert.ok(record.damage + record.healing > 0, definition.name);
  }
});
test('sect passives trigger a single low-HP shield and bounded internal-force counters', () => {
  const { combat, units } = battle(); combat.start();
  const hero = units[0], tank = units[3], originalHp = hero.stats.hp;
  combat.dealDamage(tank, hero, 100);
  assert.equal(hero.stats.hp, originalHp - 60);
  assert.equal(combat.passives.get(hero.id).internalForce, hero.stats.magicalAtk * 3 - 40);
  combat.dealDamage(hero, tank, 1200);
  assert.equal(combat.passives.get(tank.id).shieldUsed, true); assert.equal(tank.shield, tank.stats.maxHp * .5);
  const hp = tank.stats.hp; combat.dealDamage(hero, tank, 10); assert.equal(tank.stats.hp, hp);
  assert.equal(tank.shield, tank.stats.maxHp * .5 - 10);
});
