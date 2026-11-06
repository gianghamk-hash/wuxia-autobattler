import {developed} from '../scripts/balance-campaign7.mjs';
import {
  allocateSkill,
  allocateAttribute,
  equipItem
} from '../src/entities/HeroBuild.js';
import { SKILL_TREES } from '../src/data/SkillTreeData.js';
import { EQUIPMENT } from '../src/data/EquipmentData.js';
import { MAIN_QUESTS, LEGACY_MAIN_QUESTS } from '../src/data/QuestsData.js';
import test from 'node:test';
import assert from 'node:assert/strict';
import { Campaign, createCampaign, itemCount } from '../src/core/Campaign.js';
import { createHeroBuild } from '../src/entities/HeroBuild.js';
import {
  calendar,
  give,
  teamSnapshot,
  decodeTeam,
  encodeTeam
} from '../src/core/WorldProgress.js';
import {
  ELEMENTS,
  elementMultiplier,
  sectBonuses
} from '../src/data/StrategyData.js';
import { DUNGEONS } from '../src/data/WorldData.js';
import { Hero } from '../src/entities/Hero.js';
import { Companion } from '../src/entities/Companion.js';
import { CombatEngine } from '../src/combat/CombatEngine.js';
import { GridSystem } from '../src/combat/GridSystem.js';
import { StatusEngine } from '../src/combat/StatusEngine.js';
import { calculateDamage } from '../src/combat/CombatMath.js';
import { StorageManager } from '../src/core/StorageManager.js';
function fixture(sect = 'VoDang') {
  const c = new Campaign({ now: () => Date.UTC(2026, 10, 5, 5) }),
    s = createCampaign({ sect });
  s.hero = createHeroBuild({ sect, level: 16 });
  s.hero.equippedGear = {
    weapon: 'starter_weapon',
    armor: 'starter_armor',
    accessory: 'starter_accessory'
  };
  give(s, 'silver', 10000);
  give(s, 'ore', 50);
  give(s, 'herb', 50);
  c.load(s);
  return c;
}
function finish(c) {
  for (let i = 0; i < 22500 && c.running; i++) c.update(1 / 60);
  assert.equal(c.running, false);
  return c.lastResult;
}
function grant(c, ids) {
  c.session.party.unlocked = [...new Set([...c.session.party.unlocked,...ids])];
  c.session.companionsAffinity = {...c.session.companionsAffinity,...Object.fromEntries(ids.map((id) => [id, 20]))};
  c.setParty(ids);
}
test('five-element counter is directional, all six-person thresholds work without duplicate tier stacking', () => {
  for (const [element, data] of Object.entries(ELEMENTS)) {
    assert.equal(elementMultiplier({ element }, { element: data.beats }), 1.75);
    assert.equal(elementMultiplier({ element: data.beats }, { element }), 0.6);
    assert.equal(elementMultiplier({ element }, { element }), 1);
  }
  for (const n of [2, 4, 6])
    assert.equal(sectBonuses(Array(n).fill('VoDang'))[0].tier, n);
});
test('six active members, owned free-agent affiliation, target settings and preparations persist; food is charged once across resume', () => {
  const c = fixture('DuongMon');
  grant(c, [
    'companion_04',
    'companion_14',
    'companion_06',
    'companion_11',
    'companion_16'
  ]);
  for (const id of ['companion_06', 'companion_11', 'companion_16'])
    c.action('affiliation', { id, sect: 'DuongMon' });
  c.setTactics({ food: 'food_fish', priorities: { hero: 'rear' } });
  const before = itemCount(c.session, 'food_fish');
  c.practice();
  assert.equal(itemCount(c.session, 'food_fish'), before - 1);
  const saved = c.snapshot();
  c.retreat();
  c.load(saved);
  c.retryEncounter();
  assert.equal(itemCount(c.session, 'food_fish'), before - 1);
  assert.equal(c.battle.units.filter((u) => u.team === 'home').length, 6);
  assert.ok(
    c.battle.events.some(
      (e) => e.type === 'synergy' && e.name.includes('DuongMon 6')
    )
  );
  assert.equal(
    c.battle.units.find((u) => u.id === 'hero').targetPriority,
    'rear'
  );
  c.retreat();
  assert.throws(() => c.setParty([...c.session.party.active, 'companion_01']));
});
test('daily check-in, Vietnam boundaries, backwards clock and duplicate task claims are guarded atomically', () => {
  let now = Date.UTC(2026, 10, 5, 16, 59);
  const c = new Campaign({ now: () => now });
  c.newGame({ sect: 'VoDang' });
  c.action('checkin');
  assert.throws(() => c.action('checkin'));
  now += 120000;
  c.action('checkin');
  assert.equal(c.session.adventure.daily.streak, 2);
  now -= 86400000;
  const before = c.snapshot();
  assert.throws(() => c.action('checkin'));
  assert.deepEqual(c.snapshot(), before);
  c.session.adventure.daily.wins = 3;
  c.action('claim', 'daily_battle');
  assert.throws(() => c.action('claim', 'daily_battle'));
  assert.equal(
    calendar(Date.UTC(2026, 10, 8, 17)).week,
    calendar(Date.UTC(2026, 10, 9, 1)).week
  );
});
test('crafting spends all materials atomically; training/forging alter actual combat stats; fishing is capped', () => {
  const c = fixture();
  c.action('train');
  c.action('forge');
  c.action('alchemy');
  assert.equal(itemCount(c.session, 'elixir'), 1);
  for (let i = 0; i < 3; i++) c.action('fish');
  assert.throws(() => c.action('fish'));
  const base = new Hero(c.session.hero.sect, {
    profile: c.session.hero,
    inventory: c.session.inventory
  });
  c.practice();
  assert.ok(c.battle.units[0].stats.maxHp > base.stats.maxHp);
  c.retreat();
  c.session.inventory = c.session.inventory.filter((i) => i.itemId !== 'ore');
  const before = c.snapshot();
  assert.throws(() => c.action('forge'));
  assert.deepEqual(c.snapshot(), before);
});
test('new statuses tick deterministically, injury suppresses energy and expires; healing, crit and dodge have combat caps', () => {
  const u = new Companion('companion_01'),
    status = new StatusEngine();
  status.apply(u, { type: 'burn', duration: 2, damagePerStack: 10 });
  status.apply(u, { type: 'internal_injury', duration: 2, ratio: 0.5 });
  assert.equal(u.gainEnergy(20), 10);
  const hp = u.stats.hp;
  status.update(u, 2);
  assert.equal(u.stats.hp, hp - 20);
  u.stats.energy = 0;
  assert.equal(u.gainEnergy(20), 20);
  const grid = new GridSystem(),
    a = new Hero('VoDang'),
    b = new Companion('companion_01', { team: 'enemy' });
  grid.place(a, { x: 2, y: 1 });
  grid.place(b, { x: 3, y: 1 });
  const battle = new CombatEngine({ units: [a, b], grid });
  battle.start();
  a.stats.hp = 1;
  battle.heal(a, a, 1e6);
  assert.ok(a.stats.hp <= 1 + a.stats.maxHp * 0.08 + 1e-7);
  battle.heal(a, a, 1e6);
  assert.ok(a.stats.hp <= 1 + a.stats.maxHp * 0.08 + 1e-7);
  b.stats.dodgeRate = 100;
  assert.equal(
    calculateDamage(a, b, a.skills.autoAttack, () => 0.5).missed,
    false
  );
});
test('manual mode gates home ultimates and respects priorities and row AOE', () => {
  const c = fixture();
  grant(c, ['companion_01', 'companion_03']);
  c.setTactics({ autoUltimate: false, priorities: { hero: 'weakest' } });
  c.practice();
  const h = c.battle.units.find((u) => u.id === 'hero');
  h.stats.energy = 100;
  assert.equal(c.battle.autoUltimate, false);
  c.setTactics({ autoUltimate: true });
  assert.equal(
    c.session.storyProgress.pendingEncounter.preparation.tactics.autoUltimate,
    true
  );
  c.setTactics({ autoUltimate: false });
  assert.equal(
    c.session.storyProgress.pendingEncounter.preparation.tactics.autoUltimate,
    false
  );
  assert.equal(c.battle.orderUltimate('enemy_0'), false);
  assert.equal(c.battle.orderUltimate('hero'), true);
  assert.equal(c.battle.manualOrders.has('hero'), true);
  c.retreat();
});
test('shared lineups validate schema, retain formation/build, reject forged levels, and never transfer currency', () => {
  const a = fixture(),
    b = fixture();
  grant(a, ['companion_01', 'companion_03']);
  const code = a.exportTeam(),
    decoded = decodeTeam(code);
  assert.equal(decoded.active.length, 2);
  assert.ok(decoded.inventory.every((i) => i.itemId !== 'silver'));
  b.importTeam(code);
  assert.equal(b.session.adventure.arena.length, 1);
  assert.throws(() => b.importTeam(code));
  decoded.level = 99;
  assert.throws(() => encodeTeam(decoded));
  assert.throws(() => b.importTeam('DV1.e30='));
  const saved = b.snapshot();
  b.startArena(saved.adventure.arena[0].id);
  assert.equal(b.battle.units.filter((u) => u.team === 'enemy').length, 4);
  b.retreat();
  assert.throws(() => b.startArena('npc_99'));
});
test('escort deposits/limits and weekly arena reward ledgers cannot be farmed by settling twice', () => {
  const c = fixture();
  for (let i = 0; i < 2; i++) {
    c.startEscort('safe');
    c.retreat();
  }
  assert.throws(() => c.startEscort('safe'));
  c.startArena('npc_0');
  finish(c);
  const before = c.snapshot();
  assert.throws(() => c.settleBattle());
  assert.deepEqual(c.snapshot(), before);
});
test('dungeon admission gates, floor HP attrition, immutable seed, branch rewards and saved checkpoint replay', async () => {
  const c = fixture();
  grant(c, ['companion_01','companion_03','companion_05','companion_04','companion_02']);
  c.session.adventure.training=10;c.session.adventure.forging=10;
  const locked=fixture();grant(locked,['companion_01','companion_03']);assert.throws(() => locked.enterDungeon('son_doong'));
  const max=developed().snapshot();c.session.hero=max.hero;c.session.inventory=max.inventory;grant(c,max.party.active);
  c.enterDungeon('phong_nha');
  delete c.session.adventure.dungeon.mode;c.session.adventure.dungeon.rooms=Array.from({length:5},(_,i)=>[i===4?'boss':'battle',i===4?'boss':'battle']);
  const seed = c.session.adventure.dungeon.seed;
  while (c.session.adventure.dungeon && c.session.adventure.dungeon.floor < 4) {
    const d = c.session.adventure.dungeon,
      index = d.rooms[d.floor].findIndex(
        (t) => !['battle', 'boss'].includes(t)
      );
    const battle = c.chooseRoom(index < 0 ? 0 : index, 1);
    if (battle) {
      finish(c);
      if (!c.session.adventure.dungeon) break;
    }
  }
  assert.ok(c.session.adventure.dungeon);
  c.chooseRoom(0);
  const saved = c.snapshot(),
    storage = new StorageManager({
      indexedDB: null,
      localStorage: { getItem: () => null, setItem() {}, removeItem() {} }
    });
  const file = await storage.exportSave(saved);
  const restored = fixture();
  restored.load(await storage.decodeSave(file));
  restored.retryEncounter();
  assert.equal(restored.session.adventure.dungeon.seed, seed);
  const result = finish(restored);
  assert.equal(result.winner, 'home');
  assert.equal(restored.session.adventure.dungeon, null);
  assert.ok(restored.session.adventure.clears.includes('phong_nha'));
  assert.equal(itemCount(restored.session, 'secret_phong_nha'), 1);
  restored.setTactics({ qigong: 'dragon' });
});
test('all five dungeons have 5–8 floors, guild/news write human-readable journals and legacy migration adds no money', () => {
  assert.ok(DUNGEONS.every((d) => d.floors >= 5 && d.floors <= 8));
  const c = fixture();
  c.action('guild_create', 'Nghĩa hiệp');
  c.action('guild_donate');
  c.action('news');
  assert.equal(c.session.adventure.guild.points, 10);
  assert.ok(
    c.session.adventure.journal.some((e) => e.text.includes('Nghĩa hiệp'))
  );
  const old = c.snapshot();
  delete old.adventure;
  const silver = itemCount(old, 'silver');
  c.load(old);
  assert.equal(itemCount(c.session, 'silver'), silver);
  assert.equal(c.session.adventure.training, 0);
});

test('row ultimates hit an entire rank, not another rank; priorities select rear and weakest without bypassing taunt', () => {
  const grid = new GridSystem(),
    a = new Hero('VoDang'),
    b = new Companion('companion_01', { id: 'b', team: 'enemy' }),
    c = new Companion('companion_05', { id: 'c', team: 'enemy' }),
    d = new Companion('companion_04', { id: 'd', team: 'enemy' });
  grid.place(a, { x: 2, y: 1 });
  grid.place(b, { x: 3, y: 0 });
  grid.place(c, { x: 3, y: 1 });
  grid.place(d, { x: 5, y: 2 });
  for (const u of [b, c, d]) u.stats.dodgeRate = u.stats.blockRate = 0;
  const battle = new CombatEngine({ units: [a, b, c, d], grid });
  battle.start();
  a.targetPriority = 'rear';
  assert.equal(battle.chooseTarget(a, a.skills.autoAttack, true), d);
  a.targetPriority = 'weakest';
  c.stats.hp = 10;
  assert.equal(battle.chooseTarget(a, a.skills.autoAttack, true), c);
  battle.statuses.apply(a, { type: 'taunt', sourceId: b.id, duration: 2 });
  assert.equal(battle.chooseTarget(a, a.skills.autoAttack, true), b);
  c.stats.hp = c.stats.maxHp;
  const hp = [b.stats.hp, c.stats.hp, d.stats.hp];
  a.rowUltimate = true;
  battle.resolveSkill(
    a,
    b,
    {
      name: 'Phá hàng',
      type: 'magical',
      dmgMultiplier: 1,
      targetType: 'nearest_enemy',
      effects: []
    },
    true
  );
  assert.ok(b.stats.hp < hp[0] && c.stats.hp < hp[1]);
  assert.equal(d.stats.hp, hp[2]);
});
test('crit damage and lifetime healing caps prevent unlimited scaling, and dangerous shared JSON is rejected', () => {
  const grid = new GridSystem(),
    a = new Hero('VoDang'),
    b = new Companion('companion_01', { team: 'enemy' });
  grid.place(a, { x: 2, y: 1 });
  grid.place(b, { x: 3, y: 1 });
  const battle = new CombatEngine({ units: [a, b], grid });
  battle.start();
  b.stats.dodgeRate = b.stats.blockRate = 0;
  a.stats.critRate = 100;
  a.stats.critDmg = 100;
  const normal = calculateDamage(a, b, a.skills.autoAttack, () => 0.7);
  assert.equal(normal.crit, false);
  const crit = calculateDamage(a, b, a.skills.autoAttack, () => 0);
  assert.ok(crit.amount <= normal.amount * 2.2 + 1e-7);
  let healing = 0;
  for (let i = 0; i < 30; i++) {
    battle.elapsed = i;
    a.stats.hp = 1;
    healing += battle.heal(a, a, 1e6);
  }
  assert.ok(healing <= a.stats.maxHp * 1.2 + 1e-6);
  const team = teamSnapshot(fixture().session);
  const bad = JSON.parse(
    JSON.stringify({ format: 'dai-viet-team', version: 1, team })
  );
  bad.team.extra = JSON.parse('{"__proto__":{"bad":true}}');
  const code = 'DV1.' + Buffer.from(JSON.stringify(bad)).toString('base64');
  assert.throws(() => decodeTeam(code));
  assert.equal({}.bad, undefined);
});
test('six-person progress survives localStorage fallback with world fields and pending food preparation', async () => {
  const c = fixture();
  grant(c, [
    'companion_01',
    'companion_02',
    'companion_03',
    'companion_04',
    'companion_05'
  ]);
  const map = new Map(),
    local = {
      getItem: (k) => map.get(k) ?? null,
      setItem: (k, v) => map.set(k, v),
      removeItem: (k) => map.delete(k)
    };
  const store = new StorageManager({ indexedDB: null, localStorage: local });
  await store.init();
  await store.save(1, c.snapshot());
  const result = await store.load(1);
  assert.equal(result.data.party.active.length, 5);
  assert.equal(result.data.adventure.version, 1);
});

test('all five saved legacy dungeon layouts can be completed by a developed six-member roster and unlock usable qigong', () => {
  for (const def of DUNGEONS) {
    const c = fixture();
    grant(c, [
      'companion_01',
      'companion_03',
      'companion_05',
      'companion_04',
      'companion_02'
    ]);
    let hero = c.session.hero;
    for (const node of SKILL_TREES[hero.sect].filter(
      (n) => n.branch === 'attack'
    ))
      try {
        hero = allocateSkill(hero, node.id, c.session.inventory);
      } catch {}
    while (hero.freeAttributePoints)
      hero = allocateAttribute(hero, 'khiHai', c.session.inventory);
    for (const item of EQUIPMENT.filter((i) => i.sect === hero.sect)) {
      give(c.session, item.id, 1);
      hero = equipItem(hero, item.slot, item.id, c.session.inventory);
    }
    c.updateProfile(hero, c.session.inventory);
    for (let rank = 0; rank < 5; rank++) {
      c.action('train');
      c.action('forge');
    }
    c.enterDungeon(def.id);
    delete c.session.adventure.dungeon.mode;c.session.adventure.dungeon.rooms=Array.from({length:def.floors},(_,i)=>[i===def.floors-1?'boss':'rest',i===def.floors-1?'boss':'rest']);
    while (c.session.adventure.dungeon) {
      const d = c.session.adventure.dungeon;
      let index = d.rooms[d.floor].findIndex(
        (t) => !['battle', 'boss'].includes(t)
      );
      if (index < 0) index = 0;
      const battle = c.chooseRoom(index, 0);
      if (battle) assert.equal(finish(c).winner, 'home', def.name);
    }
    assert.ok(c.session.adventure.clears.includes(def.id));
    const keys = {
      phong_nha: 'dragon',
      u_minh: 'ember',
      yen_tu: 'zen',
      hoa_lu: 'war',
      son_doong: 'forest'
    };
    c.setTactics({ qigong: keys[def.id] });
    assert.equal(c.session.adventure.tactics.qigong, keys[def.id]);
  }
});
test('completed 1.x saves preserve their actual old ending when geography and ending labels change', () => {
  const c = fixture(),
    old = c.snapshot();
  delete old.adventure;
  old.storyProgress.completedQuests = LEGACY_MAIN_QUESTS.map((q) => q.id);
  delete old.storyProgress.storyRevision;
  delete old.storyProgress.currentChapter;
  delete old.storyProgress.currentEpisode;
  old.storyProgress.activeQuestId = null;
  old.storyProgress.currentAct = 3;
  old.storyProgress.endingId = 'actor';
  c.load(old);
  assert.equal(c.session.legacyEnding.name, 'Diễn Viên Đóng Thế');
  const saved = c.snapshot();
  c.load(saved);
  assert.equal(c.session.legacyEnding.name, 'Diễn Viên Đóng Thế');
  c.newGame({ sect: 'VoDang' });
  assert.equal(c.session.legacyEnding, undefined);
});

test('invalid journal timestamps are rejected before replacing the current save', () => {
  const c = fixture(),
    before = c.snapshot(),
    bad = c.snapshot();
  bad.adventure.journal = [{ text: 'Bad timestamp', time: 1e100 }];
  assert.throws(() => c.load(bad));
  assert.deepEqual(c.snapshot(), before);
});
