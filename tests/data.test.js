import test from 'node:test';
import assert from 'node:assert/strict';
import { SECTS, SECT_IDS } from '../src/data/SectsData.js';
import {
  COMPANIONS,
  COMPANIONS_BY_ID,
  ROLE_LABELS
} from '../src/data/CompanionsData.js';
import { SYNERGIES, getActiveSynergies } from '../src/data/SynergiesData.js';
import {
  EQUIPMENT,
  EQUIPMENT_BY_ID,
  EQUIPMENT_SETS
} from '../src/data/EquipmentData.js';
import { validateSnapshot } from '../src/core/StorageManager.js';

const statKeys = [
  'maxHp',
  'hp',
  'maxEnergy',
  'energy',
  'physicalAtk',
  'magicalAtk',
  'physicalDef',
  'magicalDef',
  'attackSpeed',
  'critRate',
  'critDmg',
  'dodgeRate',
  'blockRate',
  'moveSpeed',
  'attackRange'
];
function checkStats(stats) {
  for (const key of statKeys)
    assert.ok(Number.isFinite(stats[key]) && stats[key] >= 0, key);
  assert.equal(stats.hp, stats.maxHp);
  assert.ok(stats.hp > 0);
  assert.equal(stats.energy, 0);
  assert.equal(stats.maxEnergy, 100);
  assert.ok(stats.attackSpeed > 0);
  assert.ok(stats.moveSpeed > 0);
  assert.ok(stats.attackRange >= 1 && stats.attackRange <= 4);
  for (const key of ['critRate', 'dodgeRate', 'blockRate'])
    assert.ok(stats[key] <= 1);
}

test('five sects have full stats, growth and GDD passive mechanics', () => {
  assert.equal(SECT_IDS.length, 5);
  assert.equal(SECTS.TuDo, undefined);
  for (const id of SECT_IDS) {
    const sect = SECTS[id];
    assert.equal(sect.id, id);
    checkStats(sect.baseStats);
    assert.ok(
      sect.name &&
        sect.role &&
        sect.preferredAttributes &&
        sect.passive.description
    );
    assert.ok(
      Object.values(sect.growthPerLevel).every(
        (value) => Number.isFinite(value) && value > 0
      )
    );
  }
  assert.equal(SECTS.ThieuLam.passive.hpThreshold, 0.3);
  assert.equal(SECTS.ThieuLam.passive.shieldMaxHpRatio, 0.5);
  assert.equal(SECTS.ThieuLam.passive.meleeReflectRatio, 0.25);
  assert.equal(SECTS.VoDang.passive.damageRedirectRatio, 0.4);
  assert.equal(SECTS.CaiBang.passive.everyAttacks, 4);
  assert.equal(SECTS.NgaMi.passive.ultimateCleanse, 'all_control');
  assert.equal(SECTS.DuongMon.passive.detonateAtStacks, 5);
});
test('60 stable companion IDs have stats, skills, structured recruitment and valid references', () => {
  assert.equal(COMPANIONS.length, 60);
  const ids = new Set(),
    names = new Set(),
    skills = new Set(),
    quests = new Set();
  for (const [i, unit] of COMPANIONS.entries()) {
    assert.equal(unit.id, `companion_${String(i + 1).padStart(2, '0')}`);
    assert.equal(COMPANIONS_BY_ID[unit.id], unit);
    assert.ok(!ids.has(unit.id));
    ids.add(unit.id);
    assert.ok(!names.has(unit.name));
    names.add(unit.name);
    assert.ok(SECTS[unit.sect] || unit.sect === 'TuDo');
    assert.ok(ROLE_LABELS[unit.role]);
    checkStats(unit.baseStats);
    assert.equal(unit.gridPosition, null);
    assert.deepEqual(unit.statusEffects, []);
    assert.ok(unit.recruitment.description);
    assert.ok(unit.recruitment.conditions.length > 0);
    assert.ok(!quests.has(unit.recruitment.questId));
    quests.add(unit.recruitment.questId);
    for (const condition of unit.recruitment.conditions) {
      assert.ok(
        [
          'collect',
          'win_minigame',
          'rescue',
          'resolve_event',
          'recover_item',
          'defeat',
          'deliver'
        ].includes(condition.type)
      );
      if (condition.type === 'collect' || condition.type === 'deliver')
        assert.ok(condition.itemId && condition.quantity > 0);
    }
    for (const skill of Object.values(unit.skills)) {
      assert.ok(!skills.has(skill.id));
      skills.add(skill.id);
      assert.ok(skill.name && skill.targetType);
      assert.ok(['physical', 'magical'].includes(skill.type));
      assert.ok(
        Number.isFinite(skill.dmgMultiplier) && skill.dmgMultiplier >= 0
      );
      assert.ok(Array.isArray(skill.effects));
    }
    assert.ok(unit.skills.ultimate.energyCost>=85&&unit.skills.ultimate.energyCost<=100);
    assert.equal(unit.skills.autoAttack.energyGain, 15);
  }
});
test('authored signatures retain distinct targets, shapes and secondary effects at each rarity',()=>{
 const kits=COMPANIONS.map(p=>p.skills.ultimate);assert.equal(new Set(kits.map(s=>s.name)).size,60);assert.equal(new Set(kits.map(s=>JSON.stringify([s.type,s.targetType,s.dmgMultiplier,s.effects]))).size,60);
 assert.ok(kits.some(s=>s.effects.some(e=>e.type==='physical_defense_down')));assert.ok(kits.some(s=>s.effects.some(e=>e.type==='cleanse')));assert.ok(kits.some(s=>s.targetType==='farthest_enemy'));assert.equal(COMPANIONS_BY_ID.companion_04.skills.ultimate.effects[0].count,3);
});

test('synergies require distinct sects, enforce six members, and support overlapping bonuses', () => {
  assert.equal(SYNERGIES.length, 4);
  assert.equal(getActiveSynergies([]).length, 0);
  assert.equal(getActiveSynergies(['VoDang', 'VoDang', 'TuDo']).length, 0);
  assert.deepEqual(
    getActiveSynergies(['ThieuLam', 'VoDang', 'NgaMi']).map((x) => x.id),
    ['thai_son_bac_dau', 'am_duong_giao_hoa']
  );
  assert.deepEqual(
    getActiveSynergies(['DuongMon', 'NgaMi', 'CaiBang']).map((x) => x.id),
    ['hiep_nghia_giang_ho', 'doc_ba_vo_lam']
  );
  assert.equal(
    getActiveSynergies(['CaiBang', 'DuongMon', 'DuongMon']).length,
    1
  );
  assert.throws(() =>
    getActiveSynergies([
      'ThieuLam',
      'VoDang',
      'NgaMi',
      'CaiBang',
      'NgaMi',
      'CaiBang',
      'ThieuLam'
    ])
  );
  assert.throws(() => getActiveSynergies(['unknown']));
  assert.throws(() => getActiveSynergies(['toString']));
  assert.equal(SYNERGIES[0].effects[0].maxHpRatio, 0.15);
  assert.equal(SYNERGIES[1].effects[0].chance, 0.2);
  assert.equal(SYNERGIES[1].effects[0].ratio, 0.3);
  assert.equal(SYNERGIES[2].effects[0].ratio, 0.25);
  assert.equal(SYNERGIES[3].effects[0].ratio, 0.2);
});
test('104 equipment records have unique IDs and complete four-piece sets', () => {
  assert.equal(EQUIPMENT.length, 104);
  assert.equal(EQUIPMENT_SETS.length, 25);
  assert.equal(new Set(EQUIPMENT.map((x) => x.id)).size, EQUIPMENT.length);
  for (const item of EQUIPMENT) {
    assert.equal(EQUIPMENT_BY_ID[item.id], item);
    assert.ok(['weapon', 'armor', 'accessory','helmet'].includes(item.slot));
    assert.ok(
      Object.values(item.stats).every((n) => Number.isFinite(n) && n > 0)
    );
    assert.ok(item.sect === null || SECTS[item.sect]);
    assert.ok(
      item.setId === null || EQUIPMENT_SETS.some((s) => (s.setId??s.id) === item.setId)
    );
  }
  for (const set of EQUIPMENT_SETS) {
    assert.ok([2,3,4].includes(set.requiredPieces));
    assert.deepEqual(
      [...new Set(EQUIPMENT.filter((x) => x.setId === (set.setId??set.id)).map((x) => x.slot))].sort(),
      ['accessory', 'armor','helmet', 'weapon']
    );
  }
});
test('data definitions cannot leak mutable battle state between characters', () => {
  assert.throws(() => {
    COMPANIONS[0].baseStats.hp = 1;
  }, TypeError);
  assert.throws(() => {
    SECTS.CaiBang.passive.everyAttacks = 1;
  }, TypeError);
  assert.throws(() => {
    COMPANIONS[0].skills.ultimate.effects.push({});
  }, TypeError);
  const copy = structuredClone(COMPANIONS[0]);
  copy.baseStats.hp = 1;
  assert.notEqual(COMPANIONS[0].baseStats.hp, 1);
});
test('stable companion, sect and equipment IDs fit the existing save contract', () => {
  const data = {
    schemaVersion: 1,
    version: '0.2.0',
    playtimeSeconds: 10,
    hero: {
      name: 'Giang',
      sect: 'VoDang',
      level: 1,
      exp: 0,
      attributes: {},
      allocatedSkills: [],
      equippedGear: { weapon: EQUIPMENT[0].id }
    },
    party: {
      active: ['companion_01', 'companion_03'],
      unlocked: COMPANIONS.map((x) => x.id),
      formation: {
        hero: { x: 1, y: 1 },
        companion_01: { x: 2, y: 1 },
        companion_03: { x: 0, y: 1 }
      }
    },
    inventory: [{ itemId: EQUIPMENT[0].id, quantity: 1 }],
    companionsAffinity: { companion_01: 0 },
    storyProgress: {
      currentAct: 1,
      questFlags: {},
      activeQuestId: 'recruit_01',
      karmaScore: 0
    }
  };
  assert.deepEqual(validateSnapshot(data), data);
});
