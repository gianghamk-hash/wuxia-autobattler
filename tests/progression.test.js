import test from 'node:test';
import assert from 'node:assert/strict';
import { createHeroBuild, normalizeHeroBuild, allocateSkill, allocateAttribute, equipItem, changeSect, resetSkills, resetAttributes, gainExperience, trialEquipment } from '../src/entities/HeroBuild.js';
import { Hero } from '../src/entities/Hero.js';
import { Companion } from '../src/entities/Companion.js';
import { GridSystem } from '../src/combat/GridSystem.js';
import { CombatEngine } from '../src/combat/CombatEngine.js';
import { SKILL_TREES } from '../src/data/SkillTreeData.js';
import { SECTS } from '../src/data/SectsData.js';
import { StorageManager } from '../src/core/StorageManager.js';
const starter = ['starter_weapon', 'starter_armor', 'starter_accessory'].map(itemId => ({ itemId, quantity: 1 }));
function build(sect = 'VoDang', level = 8, branch = 'attack') {
  let hero = createHeroBuild({ sect, level });
  for (let tier = 1; tier <= 4; tier++) hero = allocateSkill(hero, `${sect}_t${tier}_${branch}`, starter);
  return hero;
}
function local() { const data = new Map(); return { getItem: k => data.get(k) ?? null, setItem: (k, v) => data.set(k, v), removeItem: k => data.delete(k) }; }
function snapshot(hero, inventory) { return { schemaVersion: 1, version: '0.6.0', hero, inventory, playtimeSeconds: 1,
  party: { active: [], unlocked: [], formation: {} }, companionsAffinity: {}, storyProgress: { currentAct: 1, activeQuestId: null, questFlags: {}, karmaScore: 0 } }; }

test('five trees contain eight tiers with three branches and valid acyclic same-sect prerequisites', () => {
  assert.equal(Object.values(SKILL_TREES).flat().length, 120);
  for (const [sect, nodes] of Object.entries(SKILL_TREES)) {
    assert.equal(nodes.length, 24);
    for (const node of nodes) {
      assert.equal(node.sect, sect); assert.ok(node.cost > 0);
      for (const id of node.prerequisites) assert.ok(nodes.some(p => p.id === id && p.tier < node.tier));
      assert.equal(Boolean(node.ultimate), node.tier === 4);
    }
  }
});
test('skill allocation rejects missing prerequisites, wrong sect, repeated nodes and early tier four', () => {
  const hero = createHeroBuild({ sect: 'VoDang', level: 8 });
  const before = structuredClone(hero);
  assert.throws(() => allocateSkill(hero, 'VoDang_t2_attack', starter));
  assert.throws(() => allocateSkill(hero, 'CaiBang_t1_attack', starter));
  assert.throws(() => allocateSkill(hero, 'unknown', starter));
  const learned = allocateSkill(hero, 'VoDang_t1_attack', starter);
  assert.throws(() => allocateSkill(learned, 'VoDang_t1_attack', starter));
  assert.deepEqual(hero, before);
  let low = createHeroBuild({ sect: 'VoDang', level: 7 });
  for (let i = 1; i < 4; i++) low = allocateSkill(low, `VoDang_t${i}_attack`, starter);
  assert.throws(() => allocateSkill(low, 'VoDang_t4_attack', starter));
});
test('point budgets cannot be overspent or forged and tier-four choices are exclusive', () => {
  const hero = allocateSkill(createHeroBuild({ sect: 'CaiBang' }), 'CaiBang_t1_attack', starter);
  assert.equal(hero.freeSkillPoints, 0); assert.throws(() => allocateSkill(hero, 'CaiBang_t1_guard', starter));
  assert.throws(() => normalizeHeroBuild({ ...hero, freeSkillPoints: 99 }, starter));
  let high = createHeroBuild({ sect: 'VoDang', level: 20 });
  for (const branch of ['attack', 'guard']) for (let tier = 1; tier <= 3; tier++) high = allocateSkill(high, `VoDang_t${tier}_${branch}`, starter);
  high = allocateSkill(high, 'VoDang_t4_attack', starter);
  assert.throws(() => allocateSkill(high, 'VoDang_t4_guard', starter));
});
test('XP grants exact point budgets, honors the curve, and caps at level 20', () => {
  let hero = gainExperience(createHeroBuild({ sect: 'NgaMi' }), 100, starter);
  assert.equal(hero.level, 2); assert.equal(hero.exp, 0); assert.equal(hero.freeAttributePoints, 2); assert.equal(hero.freeSkillPoints, 2);
  hero = gainExperience(hero, 199, starter); assert.equal(hero.level, 2); assert.equal(hero.exp, 199);
  hero = gainExperience(hero, 1, starter); assert.equal(hero.level, 3); assert.equal(hero.freeAttributePoints, 4);
  hero = gainExperience(hero, 1000000, starter); assert.equal(hero.level, 20); assert.equal(hero.exp, 0); assert.equal(hero.freeAttributePoints, 38);
  assert.deepEqual(gainExperience(hero, 10, starter), hero);
  assert.throws(() => gainExperience(hero, -1, starter));
});
test('attributes consume available points, affect stats and refund without duplicating points', () => {
  let profile = createHeroBuild({ sect: 'ThieuLam', level: 2 });
  profile = allocateAttribute(profile, 'canCot', starter); profile = allocateAttribute(profile, 'khiHai', starter);
  assert.equal(profile.freeAttributePoints, 0); assert.throws(() => allocateAttribute(profile, 'canCot', starter));
  const unit = new Hero('ThieuLam', { profile, inventory: starter });
  assert.equal(unit.stats.maxHp, SECTS.ThieuLam.baseStats.maxHp + SECTS.ThieuLam.growthPerLevel.maxHp + 25);
  assert.equal(unit.stats.magicalAtk, SECTS.ThieuLam.baseStats.magicalAtk + SECTS.ThieuLam.growthPerLevel.magicalAtk + 4);
  const reset = resetAttributes(profile, starter); assert.equal(reset.freeAttributePoints, 2);
  assert.deepEqual(resetAttributes(reset, starter), reset);
});
test('ownership, slot and sect restrictions reject invalid equipment without mutating profiles', () => {
  const hero = createHeroBuild({ sect: 'VoDang' });
  assert.throws(() => equipItem(hero, 'weapon', 'vodang_weapon', starter));
  assert.throws(() => equipItem(hero, 'weapon', 'starter_armor', starter));
  assert.throws(() => equipItem(hero, 'hat', 'starter_weapon', starter));
  const inventory = [...starter, { itemId: 'caibang_weapon', quantity: 1 }];
  assert.throws(() => equipItem(hero, 'weapon', 'caibang_weapon', inventory));
  assert.equal(hero.equippedGear.weapon, null);
});
test('equipping and unequipping repeatedly recomputes stats; three pieces apply a set exactly once', () => {
  let profile = createHeroBuild({ sect: 'VoDang' });
  const inventory = trialEquipment(profile, starter); assert.deepEqual(trialEquipment(profile, inventory), inventory);
  for (const slot of ['weapon', 'armor', 'accessory']) profile = equipItem(profile, slot, `vodang_${slot}`, inventory);
  const unit = new Hero('VoDang', { profile, inventory });
  assert.equal(unit.stats.magicalAtk, SECTS.VoDang.baseStats.magicalAtk + 25 + 20);
  assert.equal(unit.stats.maxHp, SECTS.VoDang.baseStats.maxHp + 200);
  assert.deepEqual(unit.activeEquipmentSets, ['vodang_set']);
  for (let i = 0; i < 30; i++) { unit.equip('weapon', null); unit.equip('weapon', 'vodang_weapon'); }
  assert.equal(unit.stats.magicalAtk, SECTS.VoDang.baseStats.magicalAtk + 45);
  unit.equip('accessory', null); assert.deepEqual(unit.activeEquipmentSets, []);
  assert.equal(unit.stats.magicalAtk, SECTS.VoDang.baseStats.magicalAtk + 25);
});
test('respec and sect changes refund skill points, preserve items and remove incompatible gear', () => {
  const hero = build(); const inventory = trialEquipment(hero, starter);
  const geared = equipItem(hero, 'weapon', 'vodang_weapon', inventory);
  const changed = changeSect(geared, 'CaiBang', inventory);
  assert.equal(changed.freeSkillPoints, 8); assert.deepEqual(changed.allocatedSkills, []); assert.equal(changed.equippedGear.weapon, null);
  assert.ok(inventory.some(x => x.itemId === 'vodang_weapon'));
  assert.equal(resetSkills(geared, inventory).freeSkillPoints, 8);
  assert.deepEqual(resetSkills(resetSkills(geared, inventory), inventory), resetSkills(geared, inventory));
});
test('all ten tier-four variants execute in the combat engine with observable damage/healing/shield effects', () => {
  for (const sect of Object.keys(SECTS)) for (const branch of ['attack', 'guard']) {
    const profile = build(sect, 8, branch), hero = new Hero(sect, { profile, inventory: starter });
    assert.equal(hero.skills.ultimate.id, `hero_${sect}_t4_${branch}`);
    const enemy = new Companion('companion_01', { id: 'enemy', team: 'enemy' }), grid = new GridSystem();
    grid.place(hero, { x: 2, y: 1 }); grid.place(enemy, { x: 3, y: 1 });
    const combat = new CombatEngine({ units: [hero, enemy], grid }); combat.start(); hero.stats.hp *= .5;
    const target = combat.chooseTarget(hero, hero.skills.ultimate);
    combat.resolveSkill(hero, target, hero.skills.ultimate, true);
    assert.equal(combat.records.get(hero.id).ultimates, 1);
    assert.ok(combat.records.get(hero.id).damage + combat.records.get(hero.id).healing + hero.shield > 0, `${sect}/${branch}`);
    assert.throws(() => hero.equip('weapon', 'starter_weapon'));
    combat.abort(); assert.doesNotThrow(() => hero.equip('weapon', 'starter_weapon'));
  }
});
test('level-one legacy saves normalize without losing story or inventory; versioned builds round-trip and reject forged imports', async () => {
  const old = snapshot({ name: 'Giang', sect: null, level: 1, exp: 0, freeAttributePoints: 0, attributes: {}, allocatedSkills: [], equippedGear: {} }, []);
  const migrated = normalizeHeroBuild(old.hero, old.inventory); assert.equal(migrated.freeSkillPoints, 1); assert.equal(migrated.buildVersion, 1);
  let hero = build(); const inventory = trialEquipment(hero, starter); hero = equipItem(hero, 'weapon', 'vodang_weapon', inventory);
  const data = snapshot(hero, inventory), storage = new StorageManager({ indexedDB: null, localStorage: local() });
  const exported = await storage.exportSave(data); await storage.importSave(exported, 1);
  assert.deepEqual((await storage.load(1)).data, data);
  const bad = structuredClone(data); bad.hero.freeSkillPoints = 999;
  assert.throws(() => storage.save(1, bad));
  assert.deepEqual((await storage.load(1)).data, data);
  assert.throws(() => normalizeHeroBuild({ ...hero, buildVersion: 2 }, inventory));
});
