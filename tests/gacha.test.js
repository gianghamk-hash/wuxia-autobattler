import test from 'node:test';
import assert from 'node:assert/strict';
import {
  Campaign,
  createCampaign,
  validateCampaign,
  itemCount
} from '../src/core/Campaign.js';
import { freshGacha, rollGacha, validateGacha } from '../src/core/Gacha.js';
import { COMPANIONS } from '../src/data/CompanionsData.js';
import { RECRUIT_QUESTS, MAIN_QUESTS } from '../src/data/QuestsData.js';
import { seededRandom } from '../src/combat/CombatMath.js';
import { StorageManager } from '../src/core/StorageManager.js';
import { Companion } from '../src/entities/Companion.js';
import {Hero} from '../src/entities/Hero.js';
import { GridSystem } from '../src/combat/GridSystem.js';
import { CombatEngine } from '../src/combat/CombatEngine.js';
function fixture() {
  const c = new Campaign();
  c.newGame({ sect: 'VoDang' });
  c.chooseMain('protect');
  for (let i = 0; i < 8000 && c.running; i++) c.update(1 / 60);
  assert.equal(c.lastResult.winner, 'home');
  c.session.inventory.find((i) => i.itemId === 'silver').quantity = 100000;
  return c;
}
test('60 unique companions, all five tiers, valid quest chapters and signature identities', () => {
  assert.equal(COMPANIONS.length, 60);
  assert.equal(new Set(COMPANIONS.map((c) => c.portrait)).size, 60);
  assert.equal(new Set(COMPANIONS.map((c) => c.skills.ultimate.name)).size, 60);
  for (let tier = 1; tier <= 5; tier++)
    assert.ok(COMPANIONS.some((c) => c.tier === tier));
  for (const c of COMPANIONS.slice(20)) {
    assert.ok(c.biography.length > 45);
    assert.ok(c.weakness);
    const q = RECRUIT_QUESTS.find((q) => q.companionId === c.id);
    assert.equal(q.chapter, c.chapter);
    assert.equal(q.act, Math.ceil(c.chapter / 4));
  }
});
test('single and ten draws spend atomically, own first copy, refund duplicates, and leave formation/XP/quests intact', () => {
  const c = fixture(),
    before = c.snapshot(),
    one = rollGacha(before, 1, { random: () => 0, now: 10 });
  assert.equal(
    itemCount(one.session, 'silver'),
    itemCount(before, 'silver') - 60
  );
  assert.equal(one.results[0].tier, 1);
  assert.equal(one.results[0].duplicate, false);
  assert.equal(one.session.party.unlocked.length, 1);
  assert.deepEqual(one.session.party.active, before.party.active);
  assert.deepEqual(one.session.hero, before.hero);
  assert.deepEqual(one.session.storyProgress, before.storyProgress);
  const repeated = rollGacha(one.session, 1, { random: () => 0, now: 11 });
  assert.equal(repeated.results[0].duplicate, true);
  assert.equal(repeated.results[0].refund, 12);
  assert.equal(
    itemCount(repeated.session, 'silver'),
    itemCount(one.session, 'silver') - 48
  );
  const ten = rollGacha(before, 10, { random: () => 0, now: 12 });
  assert.equal(ten.price, 540);
  assert.equal(ten.results.at(-1).tier, 4);
  assert.equal(ten.session.gacha.sinceEpic, 0);
  assert.equal(ten.session.gacha.total, 10);
  assert.deepEqual(before, c.snapshot());
  validateCampaign(ten.session);
});
test('pity carries over calls, natural legendary resets both, and legendary takes priority over epic', () => {
  let s = fixture().snapshot();
  for (let i = 0; i < 79; i++)
    s = rollGacha(s, 1, { random: () => 0, now: i }).session;
  assert.equal(s.gacha.sinceLegendary, 79);
  assert.equal(s.gacha.sinceEpic, 9);
  const r = rollGacha(s, 1, { random: () => 0, now: 80 });
  assert.equal(r.results[0].tier, 5);
  assert.equal(r.results[0].guarantee, 'legendary');
  assert.equal(r.session.gacha.sinceEpic, 0);
  assert.equal(r.session.gacha.sinceLegendary, 0);
  const natural = rollGacha(s, 1, { random: () => 0.999, now: 81 });
  assert.equal(natural.results[0].tier, 5);
  assert.equal(natural.session.gacha.sinceEpic, 0);
});
test('insufficient funds, invalid count/RNG, pending encounters and pre-tutorial draws change nothing', () => {
  const s = fixture().snapshot();
  s.inventory.find((i) => i.itemId === 'silver').quantity = 539;
  const original = structuredClone(s);
  assert.throws(() => rollGacha(s, 10));
  for (const count of [0, 2, -1, 1.5, '1'])
    assert.throws(() => rollGacha(s, count));
  for (const value of [-1, 1, NaN, Infinity])
    assert.throws(() => rollGacha(s, 1, { random: () => value }));
  assert.deepEqual(s, original);
  assert.throws(() => rollGacha(createCampaign({ sect: 'VoDang' }), 1));
  const c = fixture();
  c.practice();
  const pending = c.snapshot();
  assert.throws(() => c.drawCompanions(1));
  assert.deepEqual(c.snapshot(), pending);
  c.retreat();
});
test('all 50 owned characters and pity/history survive export/import; corrupted counters are rejected', async () => {
  const c = fixture();
  let s = rollGacha(c.snapshot(), 10, { random: () => 0 }).session;
  s.party.unlocked = COMPANIONS.map((c) => c.id);
  s.companionsAffinity = Object.fromEntries(
    s.party.unlocked.map((id) => [id, 15])
  );
  c.load(s);
  const store = {
    getItem: () => null,
    setItem: () => {},
    removeItem: () => {}
  };
  const storage = new StorageManager({ indexedDB: null, localStorage: store }),
    saved = await storage.exportSave(c.snapshot());
  const restored = new Campaign();
  restored.load(await storage.decodeSave(saved));
  assert.equal(restored.session.party.unlocked.length, 60);
  assert.deepEqual(restored.session.gacha, c.session.gacha);
  for (const edit of [
    (g) => (g.sinceEpic = 10),
    (g) => (g.sinceLegendary = 80),
    (g) => (g.history[0].id = 'companion_99'),
    (g) => (g.history[0].refund = 999),
    (g) => (g.total = -1)
  ]) {
    const g = structuredClone(s.gacha);
    edit(g);
    assert.throws(() => validateGacha(g));
  }
  const old = c.snapshot();
  delete old.gacha;
  restored.load(old);
  assert.deepEqual(restored.session.gacha, freshGacha());
});
test('each newly authored ultimate resolves through the actual combat engine', () => {
  for (const c of COMPANIONS.slice(20)) {
    const grid = new GridSystem(),
      hero = new Companion(c.id, { id: 'caster', level: 8 }),
      friend = c.skills.ultimate.targetType==='hero_ally'?new Hero('ThieuLam',{id:'hero',level:8}):new Companion('companion_01', { id: 'friend', level: 8 }),
      enemy = new Companion('companion_05', {
        id: 'enemy',
        team: 'enemy',
        level: 8
      });
    grid.place(hero, { x: 2, y: 1 });
    grid.place(friend, { x: 1, y: 1 });
    grid.place(enemy, { x: 3, y: 1 });
    friend.stats.hp *= 0.4;
    hero.stats.energy = 100;
    const battle = new CombatEngine({
      units: [hero, friend, enemy],
      grid,
      random: () => 0.8
    });
    battle.start();
    for (let i = 0; i < 1200 && battle.state === 'running'; i++)
      battle.update(1 / 60);
    assert.ok(
      battle.events.some(
        (e) => e.type === 'ultimate' && e.actorId === 'caster'
      ),
      c.name
    );
    assert.ok(battle.units.every((u) => Number.isFinite(u.stats.hp)));
  }
});
test('1000 seeded pulls keep every rarity attainable and cannot exceed advertised pity gaps', () => {
  const random = seededRandom(42);
  let s = fixture().snapshot(),
    last5 = 0,
    last4 = 0;
  const counts = [0, 0, 0, 0, 0, 0];
  for (let i = 1; i <= 1000; i++) {
    const r = rollGacha(s, 1, { random, now: i });
    s = r.session;
    const tier = r.results[0].tier;
    counts[tier]++;
    if (tier >= 4) {
      assert.ok(i - last4 <= 10);
      last4 = i;
    }
    if (tier === 5) {
      assert.ok(i - last5 <= 80);
      last5 = i;
    }
    assert.ok(s.gacha.history.length <= 50);
  }
  assert.ok(counts.slice(1).every((n) => n > 0));
  assert.ok(counts[1] > counts[2] && counts[2] > counts[3]);
});

test('all portrait assets exist and are independently generated, with distinct content hashes', async () => {
  const { readFile, stat } = await import('node:fs/promises');
  const { createHash } = await import('node:crypto');
  const hashes = [];
  for (const c of COMPANIONS) {
    const url = new URL('../' + c.portrait, import.meta.url),
      data = await readFile(url);
    assert.ok((await stat(url)).size > 1000);
    assert.equal(data.subarray(8, 12).toString(), 'WEBP');
    hashes.push(createHash('sha256').update(data).digest('hex'));
  }
  assert.equal(new Set(hashes).size, 60);
});
