import test from 'node:test';
import assert from 'node:assert/strict';
import { Companion } from '../src/entities/Companion.js';
import { Hero } from '../src/entities/Hero.js';
import { CombatEngine } from '../src/combat/CombatEngine.js';
import { GridSystem } from '../src/combat/GridSystem.js';
import { applyStoryIdentity, NPCS_BY_ID } from '../src/data/NPCData.js';
import { battleAdvice, formationAdvice } from '../src/combat/TeamAdvisor.js';
function fixture(id = 'doi_truong') {
  const boss = new Companion('companion_01', { id: 'boss', team: 'enemy' }),
    hero = new Hero('CaiBang'),
    grid = new GridSystem(),
    events = [];
  applyStoryIdentity(boss, NPCS_BY_ID[id]);
  for (const u of [boss, hero]) {
    u.stats.physicalAtk = 0;
    u.stats.magicalAtk = 0;
    u.stats.dodgeRate = 0;
    u.stats.maxHp = 100000;
    u.stats.hp = 100000;
  }
  grid.place(hero, { x: 2, y: 1 }, { formation: false });
  grid.place(boss, { x: 3, y: 1 }, { formation: false });
  const battle = new CombatEngine({
    units: [hero, boss],
    grid,
    onEvent: (e) => events.push(e)
  });
  battle.start();
  boss.stats.hp = 60000;
  return { battle, boss, hero, events, grid };
}
test('captain telegraphs for three seconds, can be interrupted and later summons at most two real guards', () => {
  const { battle, boss, events } = fixture();
  battle.update(0.1);
  assert.ok(battle.director.bosses[0].tell);
  assert.equal(battle.units.length, 2);
  battle.statuses.apply(boss, { type: 'stun', duration: 1 });
  battle.update(0.1);
  assert.ok(events.some((e) => e.type === 'boss:interrupt'));
  assert.equal(battle.units.length, 2);
  // Captain uses his command once even if interrupted: stun has a meaningful reward.
  const other = fixture();
  other.battle.update(3.2);
  assert.equal(other.battle.units.length, 4);
  assert.equal(other.events.filter((e) => e.type === 'boss:summon').length, 2);
  assert.ok(
    other.battle.units.every(
      (u) => other.battle.records.has(u.id) && other.battle.brains.has(u.id)
    )
  );
});
test('Doc Le roots allow attacks and energy, prohibit movement, then expire or cleanse', () => {
  const { battle, hero, grid } = fixture('doc_le');
  battle.update(3.2);
  assert.ok(hero.statusEffects.some((e) => e.type === 'root'));
  assert.equal(hero.stunned, false);
  const pos = { ...hero.gridPosition };
  assert.equal(grid.move(hero, { x: 1, y: 1 }), false);
  assert.deepEqual(hero.gridPosition, pos);
  assert.ok(hero.gainEnergy(10) > 0);
  battle.statuses.cleanse(hero);
  assert.ok(!hero.statusEffects.some((e) => e.type === 'root'));
});
test('Do Mau seal reduces damage until focused and destroyed, respects taunt, and disappears when its owner dies', () => {
  const { battle, boss, hero } = fixture('do_mau');
  battle.update(3.2);
  const seal = battle.units.find((u) => u.isObject);
  assert.ok(seal);
  assert.equal(battle.director.protection(boss), 0.35);
  assert.equal(battle.orderFocus(seal.id), true);
  assert.equal(battle.chooseTarget(hero, hero.skills.autoAttack, true), seal);
  battle.statuses.apply(hero, {
    type: 'taunt',
    duration: 2,
    sourceId: boss.id
  });
  assert.equal(battle.chooseTarget(hero, hero.skills.autoAttack, true), boss);
  battle.dealDamage(null, seal, seal.stats.hp, { damageType: 'true' });
  assert.equal(battle.director.protection(boss), 1);
  const other = fixture('do_mau');
  other.battle.update(3.2);
  other.battle.dealDamage(null, other.boss, 1e9, {
    damageType: 'true',
    ignoreShield: true
  });
  assert.equal(other.battle.units.find((u) => u.isObject).alive, false);
});
test('Trinh Nghiem has a marked thread phase and a second fan phase with cancellable warnings', () => {
  const { battle, boss, hero, events } = fixture('trinh_nghiem');
  battle.update(0.1);
  assert.deepEqual(battle.director.bosses[0].tell.targets, [hero.id]);
  battle.update(3.1);
  assert.ok(hero.statusEffects.some((e) => e.type === 'internal_injury'));
  boss.stats.hp = 30000;
  battle.update(18.2);
  assert.equal(battle.director.bosses[0].phase, 2);
  assert.ok(battle.director.bosses[0].tell);
  battle.dealDamage(null, boss, 1e9, {
    damageType: 'true',
    ignoreShield: true
  });
  assert.equal(battle.director.bosses[0].tell, null);
  assert.ok(events.some((e) => e.type === 'boss:cancel'));
});
test('boss adds never exceed six living enemies and fixed-step scripts replay identically across speed changes', () => {
  const a = fixture('doi_truong'),
    b = fixture('doi_truong');
  for (let i = 0; i < 360; i++) a.battle.update(1 / 60);
  for (let i = 0; i < 24; i++) b.battle.update(0.25);
  assert.deepEqual(a.events, b.events);
  assert.deepEqual(a.battle.result, b.battle.result);
  for (let i = 0; i < 10; i++)
    a.battle.director.summon(a.battle.director.bosses[0]);
  assert.ok(
    a.battle.units.filter((u) => u.alive && u.team === 'enemy').length <= 6
  );
});
test('endgame pressure is symmetric, gradual and optional; damage, healing and death metrics record actual HP changes', () => {
  const { battle, hero, boss } = fixture('doc_le');
  battle.elapsed = 89;
  assert.deepEqual(battle.pressure(), { damage: 1, healing: 1 });
  battle.elapsed = 120;
  assert.equal(battle.pressure().damage, 2.5);
  assert.equal(battle.pressure().healing, 0.4);
  battle.overtime = false;
  assert.deepEqual(battle.pressure(), { damage: 1, healing: 1 });
  boss.statusEffects = [];
  hero.sect = 'TuDo';
  hero.damageMultiplier = 1;
  boss.sect = 'TuDo';
  battle.dealDamage(hero, boss, 100, { damageType: 'true' });
  assert.equal(battle.records.get(hero.id).damage, 100);
  assert.equal(battle.records.get(boss.id).damageTaken, 100);
  battle.heal(hero, boss, 100);
  assert.equal(battle.records.get(hero.id).healing, 100);
});
test('blocked teammates can yield one legal cell without crossing enemies, overlap, root or windup', () => {
  const grid = new GridSystem(),
    hero = new Hero('CaiBang'),
    friends = [0, 1, 2, 3].map(
      (i) => new Companion('companion_01', { id: 'friend' + i })
    ),
    enemy = new Companion('companion_01', { id: 'enemy', team: 'enemy' });
  grid.place(hero, { x: 0, y: 1 }, { formation: false });
  friends.forEach((u, i) => grid.place(u, { x: 1, y: i }, { formation: false }));
  grid.place(enemy, { x: 3, y: 1 }, { formation: false });
  const b = new CombatEngine({ units: [hero, ...friends, enemy], grid });
  b.start();
  assert.equal(grid.pathToRange(hero, enemy, 1), null);
  const positions = friends.map((u) => ({ ...u.gridPosition }));
  assert.equal(b.yieldPath(hero, hero.skills.autoAttack), true);
  const moved = friends.filter(
    (u, i) => JSON.stringify(u.gridPosition) !== JSON.stringify(positions[i])
  );
  assert.equal(moved.length, 1);
  assert.ok(grid.findPath(hero, positions[friends.indexOf(moved[0])]));
  assert.equal(
    new Set(b.units.map((u) => JSON.stringify(u.gridPosition))).size,
    b.units.length
  );
  assert.equal(b.yieldPath(hero, hero.skills.autoAttack), false);
});
test('coach uses recorded facts and does not assign unsupported causes to defeat', () => {
  const notes = battleAdvice({
    reason: 'timeout',
    statistics: [
      {
        id: 'hero',
        name: 'Bạn',
        team: 'home',
        damage: 100,
        damageTaken: 800,
        healing: 0,
        blockedTime: 5,
        deathAt: 10,
        attempts: 10,
        misses: 5
      }
    ]
  });
  assert.ok(notes.some((n) => n.includes('10.0')));
  assert.ok(notes.some((n) => n.includes('5.0')));
  assert.ok(notes.some((n) => n.includes('5/10')));
  assert.ok(
    formationAdvice([
      { role: 'Healer', name: 'Y', position: { x: 3, y: 1 } }
    ]).some((n) => n.includes('tuyến trước'))
  );
});
