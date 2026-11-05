import test from 'node:test';
import assert from 'node:assert/strict';
import {
  Campaign,
  createCampaign,
  migrateCampaign,
  validateCampaign,
  itemCount
} from '../src/core/Campaign.js';
import {
  BOND_STORIES,
  BOND_VARIANTS,
  applyBondVariant
} from '../src/data/BondsData.js';
import { freshJourney } from '../src/core/Journey.js';
import { MAIN_QUESTS } from '../src/data/QuestsData.js';
import { Companion } from '../src/entities/Companion.js';
import { StorageManager } from '../src/core/StorageManager.js';
import {
  teamSnapshot,
  encodeTeam,
  decodeTeam
} from '../src/core/WorldProgress.js';
import { getSkillVisual } from '../src/data/SkillVisualsData.js';
import { GridSystem } from '../src/combat/GridSystem.js';
import { CombatEngine } from '../src/combat/CombatEngine.js';
function campaign() {
  const c = new Campaign();
  c.newGame({ sect: 'VoDang' });
  c.session.party.unlocked = Object.keys(BOND_VARIANTS);
  c.session.companionsAffinity = Object.fromEntries(
    c.session.party.unlocked.map((id) => [id, 100])
  );
  c.setParty(c.session.party.unlocked);
  return c;
}
function chapter12(c) {
  const q = MAIN_QUESTS.find((q) => q.chapter === 12);
  Object.assign(c.session.storyProgress, {
    completedQuests: MAIN_QUESTS.filter((q) => q.chapter < 12).map((q) => q.id),
    currentChapter: 12,
    currentEpisode: q.episode,
    currentAct: q.act,
    activeQuestId: q.id
  });
}
test('legacy saves gain an empty journey without currency or story changes; malformed new data is rejected', () => {
  const old = createCampaign({ sect: 'VoDang' });
  delete old.journey;
  const next = migrateCampaign(old);
  assert.deepEqual(next.journey, freshJourney());
  assert.deepEqual(next.inventory, old.inventory);
  assert.deepEqual(next.storyProgress, old.storyProgress);
  assert.deepEqual(migrateCampaign(next), next);
  const c = campaign(),
    before = c.snapshot(),
    bad = c.snapshot();
  bad.journey.reader.fontSize = 99;
  assert.throws(() => c.load(bad));
  assert.deepEqual(c.snapshot(), before);
});
test('reading bookmarks, capped history and font survive export without advancing quests or awarding items', async () => {
  const c = campaign(),
    story = structuredClone(c.session.storyProgress),
    inventory = structuredClone(c.session.inventory),
    key = 'main:' + MAIN_QUESTS[0].id;
  for (let i = 0; i < 70; i++) c.rememberDialogue(key, i, 'Bé Na', 'Dòng ' + i);
  c.setReaderFont(22);
  const manager = new StorageManager({ indexedDB: null, localStorage: null });
  const restored = new Campaign();
  restored.load(
    await manager.decodeSave(await manager.exportSave(c.snapshot()))
  );
  assert.equal(restored.session.journey.reader.positions[key], 69);
  assert.equal(restored.session.journey.reader.history.length, 60);
  assert.equal(restored.session.journey.reader.fontSize, 22);
  assert.deepEqual(restored.session.storyProgress, story);
  assert.deepEqual(restored.session.inventory, inventory);
  const before = c.snapshot();
  assert.throws(() => c.rememberDialogue('main:__proto__', 0, 'x', 'x'));
  assert.deepEqual(c.snapshot(), before);
});
test('three formations restore only owned members, positions and selected tactics, never resources or paid affiliations', () => {
  const c = campaign();
  c.saveLoadout(0, 'Bảo vệ');
  const saved = c.snapshot().journey.loadouts[0];
  c.setParty(['companion_01']);
  c.setTactics({ autoUltimate: false });
  const inventory = structuredClone(c.session.inventory);
  c.applyLoadout(0);
  assert.deepEqual(c.session.party.active, saved.active);
  assert.deepEqual(c.session.party.formation, saved.formation);
  assert.equal(c.session.adventure.tactics.autoUltimate, true);
  assert.deepEqual(c.session.inventory, inventory);
  c.saveLoadout(1, 'Tấn công');
  c.saveLoadout(2, 'Đi bí cảnh');
  assert.throws(() => c.saveLoadout(3, 'Thứ tư'));
  const bad = c.snapshot();
  bad.journey.loadouts[0].formation.hero.x = 9;
  assert.throws(() => c.load(bad));
  const badMember = c.snapshot();
  badMember.party.unlocked = badMember.party.unlocked.slice(1);
  assert.throws(() => c.load(badMember));
});
test('all fifteen bond episodes require ownership, affinity, chapter and earlier stages; completion cannot be farmed', () => {
  const c = campaign(),
    id = 'companion_01';
  assert.throws(() => c.completeBond('bond_' + id + '_1', 'listen'));
  chapter12(c);
  // Test eligibility independently while retaining the real campaign checkpoint.
  const checkpoint = c.session.storyProgress.currentChapter;
  for (const story of BOND_STORIES) {
    if (
      story.stage > 1 &&
      !c.session.journey.bonds.completed.includes(
        'bond_' + story.companionId + '_' + (story.stage - 1)
      )
    )
      assert.fail('stage order');
    assert.equal(
      c.bondStories().find((b) => b.id === story.id).available,
      true
    );
    c.completeBond(story.id, 'listen');
    const after = c.snapshot();
    assert.throws(() => c.completeBond(story.id, 'stand'));
    assert.deepEqual(c.snapshot(), after);
  }
  assert.equal(c.session.journey.bonds.completed.length, 15);
  assert.equal(checkpoint, 12);
  assert.equal(itemCount(c.session, 'silver'), 30);
  for (const id of Object.keys(BOND_VARIANTS))
    assert.equal(c.session.journey.bonds.modes[id], 'variant');
  const bad = c.snapshot();
  bad.companionsAffinity[id] = 0;
  assert.throws(() => validateCampaign(bad));
});
test('five unlocked variants replace one ultimate, retain visual profiles, and survive team sharing without granting ownership', () => {
  const c = campaign();
  chapter12(c);
  for (const b of BOND_STORIES) c.completeBond(b.id, 'stand');
  const decoded = decodeTeam(encodeTeam(teamSnapshot(c.session)));
  assert.deepEqual(decoded.variants, c.session.journey.bonds.modes);
  for (const [id, skill] of Object.entries(BOND_VARIANTS)) {
    const unit = new Companion(id);
    applyBondVariant(unit, 'variant');
    assert.deepEqual(unit.skills.ultimate, skill);
    assert.ok(getSkillVisual({ ownerId: id, skillId: skill.id }));
    c.setBondMode(id, 'base');
    const base = new Companion(id);
    applyBondVariant(base, 'base');
    assert.notEqual(base.skills.ultimate.name, skill.name);
  }
  const locked = new Campaign();
  locked.newGame({ sect: 'CaiBang' });
  assert.throws(() => locked.setBondMode('companion_01', 'variant'));
});
test('pending encounters forbid formation/bond changes while reading remains available', () => {
  const c = campaign();
  c.saveLoadout(0, 'Một');
  c.chooseMain('protect');
  assert.throws(() => c.applyLoadout(0));
  assert.throws(() => c.saveLoadout(1, 'Hai'));
  assert.throws(() => c.setBondMode('companion_01', 'base'));
  const pending = structuredClone(c.session.storyProgress.pendingEncounter);
  c.rememberDialogue('main:Q101', 1, 'Bạn', 'Đang đọc');
  assert.deepEqual(c.session.storyProgress.pendingEncounter, pending);
});
test('all five bond techniques apply their actual single-slot combat tradeoffs', () => {
  for (const id of Object.keys(BOND_VARIANTS)) {
    const actor = new Companion(id),
      ally = new Companion('companion_03', { id: 'ally' }),
      enemy = new Companion('companion_05', { id: 'enemy', team: 'enemy' }),
      grid = new GridSystem();
    applyBondVariant(actor, 'variant');
    enemy.stats.dodgeRate = 0;
    actor.stats.critRate = 0;
    grid.place(actor, { x: 1, y: 1 });
    grid.place(ally, { x: 2, y: 1 });
    grid.place(enemy, { x: 3, y: 1 });
    const battle = new CombatEngine({ units: [actor, ally, enemy], grid });
    battle.start();
    ally.stats.hp *= 0.5;
    const before = ally.stats.hp,
      enemyHp = enemy.stats.hp,
      skill = actor.skills.ultimate,
      anchor = battle.chooseTarget(actor, skill);
    battle.resolveSkill(actor, anchor, skill, true);
    if (id === 'companion_01') {
      assert.ok(ally.shield > 0);
      assert.equal(enemy.stats.hp, enemyHp);
      assert.equal(enemy.stunned, false);
    }
    if (id === 'companion_03') {
      assert.ok(ally.stats.hp > before);
      assert.equal(
        ally.statusEffects.some((e) => e.type === 'regen'),
        false
      );
    }
    if (id === 'companion_02') {
      assert.ok(ally.shield > 0);
      assert.equal(actor.shield, 0);
    }
    if (id === 'companion_04') {
      assert.ok(enemy.stats.hp < enemyHp);
      assert.ok(enemy.statusEffects.some((e) => e.type === 'internal_injury'));
    }
    if (id === 'companion_08') {
      assert.ok(enemy.stats.hp < enemyHp);
      assert.equal(enemy.gridPosition.x, 5);
      assert.deepEqual(actor.gridPosition, { x: 1, y: 1 });
    }
  }
});
