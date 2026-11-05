import test from 'node:test';
import assert from 'node:assert/strict';
import {
  Campaign,
  createCampaign,
  validateCampaign
} from '../src/core/Campaign.js';
import { createHeroBuild } from '../src/entities/HeroBuild.js';
import { casebook } from '../src/core/Casebook.js';
import {
  CASE_ENTRIES,
  CASE_QUESTIONS,
  CASE_RELATIONS
} from '../src/data/CasebookData.js';
import { MAIN_QUESTS } from '../src/data/QuestsData.js';
import { MISSIONS } from '../src/data/MissionsData.js';
import { Hero } from '../src/entities/Hero.js';
import { Companion } from '../src/entities/Companion.js';
import { GridSystem } from '../src/combat/GridSystem.js';
import { CombatEngine } from '../src/combat/CombatEngine.js';
import { battleIntent } from '../src/combat/BattleIntent.js';
import { applyStoryIdentity, NPCS_BY_ID } from '../src/data/NPCData.js';
import { StorageManager } from '../src/core/StorageManager.js';
import { simulatePair } from '../scripts/balance-6v6.mjs';
import { readFileSync } from 'node:fs';
function campaignAt(id) {
  const c = new Campaign(),
    s = createCampaign({ sect: 'VoDang' }),
    q = MAIN_QUESTS.find((q) => q.id === id),
    at = MAIN_QUESTS.indexOf(q);
  s.hero = createHeroBuild({ sect: 'VoDang', level: 12 });
  s.hero.equippedGear = {
    weapon: 'starter_weapon',
    armor: 'starter_armor',
    accessory: 'starter_accessory'
  };
  s.party.unlocked = ['companion_01', 'companion_03'];
  s.companionsAffinity = { companion_01: 30, companion_03: 30 };
  Object.assign(s.storyProgress, {
    completedQuests: MAIN_QUESTS.slice(0, at).map((q) => q.id),
    activeQuestId: q.id,
    currentAct: q.act,
    currentChapter: q.chapter,
    currentEpisode: q.episode
  });
  c.load(s);
  c.setParty(s.party.unlocked);
  return c;
}
function fixture(id, offset = 0) {
  const hero = new Hero('CaiBang'),
    enemy = new Companion('companion_01', { id: 'enemy', team: 'enemy' }),
    grid = new GridSystem(),
    events = [];
  for (const u of [hero, enemy]) {
    u.stats.physicalAtk = 0;
    u.stats.magicalAtk = 0;
    u.stats.maxHp = 10000;
    u.stats.hp = 10000;
  }
  grid.place(hero, { x: 2, y: 1 });
  grid.place(enemy, { x: 5, y: 2 });
  const battle = new CombatEngine({
    units: [hero, enemy],
    grid,
    missionId: id,
    seed: 42 + offset,
    onEvent: (e) => events.push(e)
  });
  battle.start();
  return { battle, hero, enemy, grid, events };
}
const finish = (b, step = 0.25) => {
  for (let i = 0; i < 10000 && b.state === 'running'; i++) b.update(step);
  return b.result;
};
test('casebook sources are real episodes; no future evidence, people, answers or relations leak at any checkpoint', () => {
  for (const e of [...CASE_ENTRIES, ...CASE_RELATIONS])
    assert.ok(MAIN_QUESTS.some((q) => q.id === e.source));
  for (const q of CASE_QUESTIONS) {
    assert.ok(MAIN_QUESTS.some((e) => e.id === q.from));
    assert.ok(MAIN_QUESTS.some((e) => e.id === q.answered));
  }
  const s = createCampaign({ sect: 'VoDang' });
  for (const q of MAIN_QUESTS) {
    const before = structuredClone(s),
      book = casebook(s),
      done = new Set(s.storyProgress.completedQuests);
    assert.ok(book.entries.every((e) => done.has(e.source)));
    assert.ok(book.relations.every((e) => done.has(e.source)));
    assert.ok(book.questions.every((q) => q.answered || q.answer === null));
    const known = new Set(book.entries.flatMap((e) => e.people));
    assert.ok(book.people.every((p) => known.has(p.id)));
    assert.deepEqual(s, before);
    s.storyProgress.completedQuests.push(q.id);
  }
  const early = casebook(createCampaign({ sect: 'VoDang' }));
  assert.equal(early.entries.length, 0);
  assert.equal(early.people.length, 0);
  const c = campaignAt('C01H04'),
    b = casebook(c.session);
  assert.equal(
    b.people.some((p) => p.id === 'trinh_nghiem'),
    false
  );
  assert.equal(
    b.people.some((p) => p.id === 'vu_binh'),
    false
  );
});
test('casebook persists by deriving from completed quests, distinguishes suspicions, and reads do not award or advance', async () => {
  const c = campaignAt('C07H01'),
    before = c.snapshot(),
    b = casebook(before);
  const seal = b.entries.find((e) => e.id === 'seal');
  assert.match(seal.text, /Chưa đủ kết luận/);
  assert.equal(b.questions.find((q) => q.id === 'stamp').answer, null);
  assert.deepEqual(c.snapshot(), before);
  const storage = new StorageManager({ indexedDB: null, localStorage: null }),
    loaded = new Campaign();
  loaded.load(await storage.decodeSave(await storage.exportSave(before)));
  assert.deepEqual(casebook(loaded.session), b);
});
test('scouting reuses actual enemy generation without spending food, changing seeds, or progressing the campaign', () => {
  for (const id of ['Q101', 'C01H14', 'C06H12', 'Q104', 'Q204', 'Q303']) {
    const c = campaignAt(id),
      before = c.snapshot(),
      scout = c.scoutMain();
    assert.deepEqual(c.snapshot(), before);
    c.chooseMain(c.mainQuest().choices[0].id);
    const actual = c.battle.units.filter(
      (u) => u.team === 'enemy' && !u.missionAsset
    );
    assert.deepEqual(
      actual.map((u) => ({
        id: u.id,
        name: u.name,
        hp: u.stats.maxHp,
        skills: u.skills
      })),
      scout.enemies.map((u) => ({
        id: u.id,
        name: u.name,
        hp: u.stats.maxHp,
        skills: u.skills
      }))
    );
    assert.equal(
      c.battle.mission?.definition.id ?? null,
      scout.objective?.id ?? null
    );
  }
});
test('new pending mission checkpoints replay with the same seed and assets; legacy pending fights retain elimination rules', async () => {
  const c = campaignAt('C01H14');
  c.chooseMain('continue');
  const save = c.snapshot(),
    resumed = new Campaign();
  resumed.load(save);
  resumed.retryEncounter();
  assert.equal(resumed.battle.seed, c.battle.seed);
  assert.deepEqual(
    resumed.battle.mission.summary(),
    c.battle.mission.summary()
  );
  const legacy = structuredClone(save);
  delete legacy.storyProgress.pendingEncounter.missionId;
  const old = new Campaign();
  old.load(legacy);
  old.retryEncounter();
  assert.equal(old.battle.mission, null);
  assert.equal(old.scoutMain().objective, null);
  const bad = structuredClone(save);
  bad.storyProgress.pendingEncounter.missionId = 'C04H02';
  assert.throws(() => resumed.load(bad));
  assert.doesNotThrow(() => validateCampaign(save));
});
test('protect can fail while fighters live, or win after defeating attackers; objectives grant no separate repeatable rewards', () => {
  const a = fixture('C01H14'),
    asset = a.battle.mission.assets[0];
  asset.stats.hp = 0;
  a.battle.update(0.1);
  assert.equal(a.battle.result.winner, 'enemy');
  assert.equal(a.hero.alive, true);
  assert.equal(a.battle.result.reason, 'objective_failed');
  const b = fixture('C07H13');
  b.enemy.stats.hp = 0;
  b.battle.update(0.1);
  assert.equal(b.battle.result.winner, 'home');
  const c = campaignAt('C01H14');
  c.chooseMain('continue');
  for (const u of c.battle.units.filter((u) => u.team === 'enemy'))
    u.stats.hp = 0;
  c.update(0.1);
  assert.equal(c.lastResult.winner, 'home');
  const saved = c.snapshot();
  assert.throws(() => c.settleBattle());
  assert.deepEqual(c.snapshot(), saved);
});
test('breach wins by breaking three real targetable locks even with enemy fighters alive', () => {
  const { battle, hero, enemy, grid } = fixture('C06H12');
  const assets = battle.mission.assets;
  assert.equal(assets.length, 3);
  assert.equal(
    new Set(battle.units.map((u) => JSON.stringify(u.gridPosition))).size,
    battle.units.length
  );
  assert.ok(assets.every((u) => grid.units.get(u.id) === u));
  for (let i = 0; i < 3; i++) {
    assert.equal(battle.orderFocus(assets[i].id), true);
    battle.dealDamage(hero, assets[i], 1e9, { damageType: 'true' });
    battle.grid.removeDead();
    battle.checkResult();
    if (i < 2) assert.equal(battle.state, 'running');
  }
  assert.equal(enemy.alive, true);
  assert.equal(battle.result.winner, 'home');
  assert.equal(battle.result.objective.value, 3);
});
test('rescue has approach, interruptible channel and real escort movement; a released captive can be lost', () => {
  const a = fixture('C04H02'),
    npc = a.battle.mission.assets[0];
  assert.equal(a.battle.opponents(a.enemy).includes(npc), false);
  assert.equal(a.battle.mission.requestRescue('hero'), true);
  a.battle.update(1);
  a.battle.statuses.apply(a.hero, { type: 'stun', duration: 1 });
  a.battle.update(0.1);
  assert.equal(a.battle.mission.progress, 0);
  assert.equal(finish(a.battle).winner, 'home');
  assert.equal(npc.rescued, true);
  assert.equal(npc.gridPosition.x, 0);
  const b = fixture('C04H10'),
    victim = b.battle.mission.assets[0];
  victim.rescued = true;
  victim.targetable = true;
  victim.stats.hp = 0;
  b.battle.update(0.1);
  assert.equal(b.battle.result.reason, 'objective_failed');
  assert.equal(b.hero.alive, true);
});
test('hold objectives last thirty simulation seconds, spawn capped waves and replay identically at all speeds', () => {
  const a = fixture('C01H09'),
    b = fixture('C01H09');
  const paused = a.battle.elapsed;
  a.battle.update(0);
  assert.equal(a.battle.elapsed, paused);
  finish(a.battle, 1 / 60);
  finish(b.battle, 0.25);
  assert.equal(a.battle.result.duration, 30);
  assert.deepEqual(a.battle.result, b.battle.result);
  assert.deepEqual(a.events, b.events);
  assert.equal(a.events.filter((e) => e.type === 'mission:wave').length, 2);
  assert.ok(
    a.battle.units.filter((u) => u.team === 'enemy' && u.alive).length <= 6
  );
});
test('all nine authored missions match actual story battles and keep success/failure state explicit', () => {
  assert.equal(Object.keys(MISSIONS).length, 9);
  for (const mission of Object.values(MISSIONS)) {
    assert.ok(MAIN_QUESTS.find((q) => q.id === mission.id)?.encounter);
    assert.ok(mission.failure);
    assert.ok(mission.description);
  }
  assert.throws(() => fixture('invented'));
});
test('an unfinished mission at the deadline is a loss rather than an ordinary combat draw',()=>{
  const {battle,hero}=fixture('C04H02');finish(battle);
  assert.equal(hero.alive,true);assert.equal(battle.result.reason,'objective_timeout');assert.equal(battle.result.winner,'enemy');
});
test('intent shows actual healer, control and boss decisions without consuming simulation state', () => {
  const { battle, hero, enemy } = fixture('C01H14');
  const skill = {
      name: 'Thuốc',
      effects: [{ type: 'heal' }],
      targetType: 'lowest_hp_ally'
    },
    brain = battle.brains.get(enemy.id);
  brain.action = { skill, target: enemy, ultimate: true, remaining: 0.2 };
  assert.match(battleIntent(battle, enemy).text, /hồi máu cho/);
  const before = {
    units: JSON.stringify(battle.units),
    action: JSON.stringify(brain.action),
    time: battle.elapsed
  };
  for (let i = 0; i < 100; i++) battleIntent(battle, enemy);
  assert.deepEqual(
    {
      units: JSON.stringify(battle.units),
      action: JSON.stringify(brain.action),
      time: battle.elapsed
    },
    before
  );
  battle.statuses.apply(enemy, { type: 'root', duration: 2 });
  brain.action = null;
  assert.equal(battleIntent(battle, enemy).short, 'Giữ chân');
  battle.statuses.apply(enemy, { type: 'stun', duration: 2 });
  assert.equal(battleIntent(battle, enemy).short, 'Choáng');
  assert.equal(hero.alive, true);
});
test('ordinary 6v6 outcomes remain identical to representative stored 3.1 replay pairs', () => {
  const report = JSON.parse(
    readFileSync(
      new URL('../reports/balance-polish-final.json', import.meta.url),
      'utf8'
    )
  );
  for (const scenario of report.scenarios) {
    const pair = scenario.records[0],
      games = simulatePair(pair.a, pair.b, scenario, pair.seed);
    assert.deepEqual(
      games.map(({ statistics, ...g }) => g),
      pair.games
    );
  }
});
test('a rescued captive can leave a dense six-fighter formation after an early manual rescue', () => {
  const c = campaignAt('C04H02');
  c.session.hero = createHeroBuild({ sect: 'VoDang', level: 16 });
  c.session.hero.equippedGear = {
    weapon: 'starter_weapon',
    armor: 'starter_armor',
    accessory: 'starter_accessory'
  };
  c.session.party.unlocked = [
    'companion_01',
    'companion_02',
    'companion_03',
    'companion_04',
    'companion_05'
  ];
  for (const id of c.session.party.unlocked)
    c.session.companionsAffinity[id] = 60;
  c.setParty(c.session.party.unlocked);
  c.chooseMain('continue');
  c.battle.mission.requestRescue('hero');
  for (let i = 0; i < 6600 && c.running; i++) c.update(1 / 60);
  assert.equal(c.lastResult?.winner, 'home');
});
