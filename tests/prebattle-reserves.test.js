import test from 'node:test';
import assert from 'node:assert/strict';
import { Campaign } from '../src/core/Campaign.js';
import { developed } from '../scripts/balance-campaign7.mjs';

test('ready roster swap keeps encounter, entry cost and on-board cell', () => {
  const c = new Campaign();
  c.load(developed().snapshot());
  c.practice();
  const pending = structuredClone(c.session.storyProgress.pendingEncounter);
  const out = c.session.party.active[0];
  const incoming = c.session.party.unlocked.find(id => !c.session.party.active.includes(id));
  assert.ok(incoming);
  const oldCell = { ...c.session.party.formation[out] };
  const inventory = structuredClone(c.session.inventory);
  const enemyIds = c.battle.units.filter(u => u.team === 'enemy').map(u => u.templateId);
  const originalSeed = c.battle.seed;
  c.replaceReadyCompanion(out, incoming);
  assert.ok(c.running);
  assert.equal(c.battle.elapsed, 0);
  assert.equal(c.session.storyProgress.pendingEncounter.token, pending.token);
  assert.equal(c.session.storyProgress.pendingEncounter.seed, pending.seed);
  assert.equal(c.session.storyProgress.pendingEncounter.kind, pending.kind);
  assert.deepEqual(c.session.storyProgress.pendingEncounter.preparation.tactics, pending.preparation.tactics);
  assert.deepEqual(c.session.storyProgress.pendingEncounter.preparation.maxAffinity,
    c.session.party.active.filter(id => (c.session.companionsAffinity[id] ?? 0) >= 100));
  assert.deepEqual(c.session.inventory, inventory);
  assert.deepEqual(c.session.party.formation[incoming], oldCell);
  assert.ok(!c.session.party.active.includes(out));
  assert.ok(c.session.party.active.includes(incoming));
  assert.equal(c.battle.seed, originalSeed);
  assert.deepEqual(c.battle.units.filter(u => u.team === 'enemy').map(u => u.templateId), enemyIds);
  assert.ok(c.battle.units.some(u => u.id === incoming && u.team === 'home'));
  assert.equal(c.battle.units.filter(u => u.team === 'home' && !u.isObject).length, 6);
});

test('exit ready screen does not surrender or consume entry again', () => {
  const c = new Campaign();
  c.load(developed().snapshot());
  c.practice();
  const pending = structuredClone(c.session.storyProgress.pendingEncounter);
  const inventory = structuredClone(c.session.inventory);
  assert.equal(c.leaveReadyBattle(), 'practice');
  assert.equal(c.battle, null);
  assert.equal(c.running, false);
  assert.deepEqual(c.session.storyProgress.pendingEncounter, pending);
  assert.deepEqual(c.session.inventory, inventory);
  c.retryEncounter();
  assert.ok(c.running);
  assert.equal(c.battle.seed, pending.seed);
});

test('ready swaps reject unowned, duplicate, hero and locked elapsed fights', () => {
  const c = new Campaign();
  c.load(developed().snapshot());
  c.practice();
  const out=c.session.party.active[0], existing=c.session.party.active[1];
  assert.throws(() => c.replaceReadyCompanion(out, existing), /dự bị không hợp lệ/);
  assert.throws(() => c.replaceReadyCompanion('hero', existing), /dự bị không hợp lệ/);
  assert.throws(() => c.replaceReadyCompanion(out, 'companion_missing'), /dự bị không hợp lệ/);
  c.battle.elapsed=.1;
  assert.throws(() => c.leaveReadyBattle(), /trước khi trận/);
  assert.throws(() => c.replaceReadyCompanion(out,'companion_22'), /trước khi giao chiến/);
});
