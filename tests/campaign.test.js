import test from 'node:test';
import assert from 'node:assert/strict';
import {
  Campaign,
  createCampaign,
  validateCampaign,
  itemCount
} from '../src/core/Campaign.js';
import {
  MAIN_QUESTS,
  RECRUIT_QUESTS,
  ENDINGS
} from '../src/data/QuestsData.js';
import {
  allocateSkill,
  allocateAttribute,
  equipItem
} from '../src/entities/HeroBuild.js';
import { SKILL_TREES } from '../src/data/SkillTreeData.js';
import { EQUIPMENT } from '../src/data/EquipmentData.js';
import { StorageManager } from '../src/core/StorageManager.js';
import { moveFormation } from '../src/ui/FormationUI.js';
function fight(c) {
  for (let i = 0; i < 22500 && c.running; i++) c.update(1 / 60);
  assert.equal(c.running, false);
  return c.lastResult;
}
function improve(c) {
  let hero = c.session.hero;
  while (hero.freeAttributePoints)
    hero = allocateAttribute(hero, 'canCot', c.session.inventory);
  for (const node of SKILL_TREES[hero.sect].filter(
    (n) => n.branch === 'attack'
  )) {
    try {
      hero = allocateSkill(hero, node.id, c.session.inventory);
    } catch {
      /* level/points not unlocked yet */
    }
  }
  for (const slot of ['weapon', 'armor', 'accessory']) {
    const rare = EQUIPMENT.find(
      (item) =>
        item.sect === hero.sect &&
        item.slot === slot &&
        itemCount(c.session, item.id)
    );
    if (rare) hero = equipItem(hero, slot, rare.id, c.session.inventory);
  }
  c.updateProfile(hero, c.session.inventory);
}
function win(c, action) {
  for (let retry = 0; retry < 12; retry++) {
    improve(c);
    const battle = action();
    if (!c.running) return null;
    const result = fight(c);
    if (result.winner === 'home') return result;
    for (let practice = 0; practice < 3; practice++) {
      c.practice();
      const training = fight(c);
      assert.equal(training.winner, 'home');
    }
  }
  assert.fail(
    `Cannot complete ${c.mainQuest()?.id} at level ${c.session.hero.level}; last ${c.lastResult?.reason}; team ${c.session.party.active.join(',')}`
  );
}
function recruit(c, quest) {
  if (quest.puzzle) {
    if (
      quest.cost &&
      itemCount(c.session, quest.cost.itemId) < quest.cost.quantity
    )
      c.buy(quest.cost.itemId);
    c.solveRecruit(quest.id, quest.puzzle.correct);
  } else win(c, () => c.challengeRecruit(quest.id));
  while (itemCount(c.session, 'silver') < c.recruitFee(quest)) {
    c.practice();
    assert.equal(fight(c).winner, 'home');
  }
  c.recruit(quest.id);
}
function memory() {
  const map = new Map();
  return {
    getItem: (k) => map.get(k) ?? null,
    setItem: (k, v) => map.set(k, v),
    removeItem: (k) => map.delete(k)
  };
}

test('new campaign is valid, starts in act one and gates quests/recruitment/endings', () => {
  const c = new Campaign();
  assert.doesNotThrow(() => validateCampaign(c.snapshot()));
  assert.throws(() => c.chooseMain('protect'));
  assert.throws(() => c.chooseEnding('actor'));
  c.newGame({ sect: 'VoDang', name: 'Giang' });
  assert.equal(c.mainQuest().id, 'Q101');
  assert.throws(() => c.challengeRecruit('recruit_01'));
  assert.equal(c.session.hero.equippedGear.weapon, 'starter_weapon');
});
test('all five sects can finish the tutorial and recruit the first two companions through real conditions', () => {
  for (const sect of ['ThieuLam', 'VoDang', 'CaiBang', 'NgaMi', 'DuongMon']) {
    const c = new Campaign();
    c.newGame({ sect });
    c.chooseMain('protect');
    assert.equal(fight(c).winner, 'home');
    assert.throws(() => c.chooseMain('together'));
    recruit(c, RECRUIT_QUESTS[0]);
    recruit(c, RECRUIT_QUESTS[2]);
    assert.equal(c.mainQuest().id, 'C01H02');
    assert.deepEqual(c.session.party.active, ['companion_01', 'companion_03']);
    assert.equal(itemCount(c.session, 'quest_roast_chicken_leg'), 0);
    assert.equal(itemCount(c.session, 'rope'), 0);
  }
});
test('pending encounters survive export/reload; rewards and moral decisions cannot be claimed twice', async () => {
  const c = new Campaign();
  c.newGame({ sect: 'VoDang' });
  c.chooseMain('protect');
  const pending = c.snapshot(),
    karma = pending.storyProgress.karmaScore;
  const storage = new StorageManager({
    indexedDB: null,
    localStorage: memory()
  });
  const file = await storage.exportSave(pending);
  const loaded = await storage.decodeSave(file);
  const resumed = new Campaign();
  resumed.load(loaded);
  assert.equal(resumed.running, false);
  resumed.retryEncounter();
  assert.equal(fight(resumed).winner, 'home');
  const won = resumed.snapshot();
  assert.throws(() => resumed.settleBattle());
  assert.deepEqual(resumed.snapshot(), won);
  assert.equal(won.storyProgress.karmaScore, karma);
  assert.throws(() => resumed.chooseMain('protect'));
  assert.equal(won.hero.level, 2);
  assert.equal(itemCount(won, 'silver'), 30 + MAIN_QUESTS[0].silver);
});
test('retreat clears the encounter without rewards; retries do not farm karma', () => {
  const c = new Campaign();
  c.newGame({ sect: 'VoDang' });
  c.chooseMain('protect');
  assert.throws(() => c.buy('rope'));
  const silver = itemCount(c.session, 'silver');
  c.retreat();
  assert.equal(c.session.storyProgress.pendingEncounter, null);
  assert.equal(itemCount(c.session, 'silver'), silver);
  assert.equal(c.mainQuest().id, 'Q101');
  assert.equal(c.session.hero.level, 1);
  c.chooseMain('protect');
  assert.equal(c.session.storyProgress.karmaScore, 1);
  c.retreat();
  assert.throws(() => c.chooseMain('escape'));
});
test('party formation swaps atomically, rejects locked units/out-of-bounds and persists on reload', () => {
  const c = new Campaign();
  c.newGame({ sect: 'VoDang' });
  c.chooseMain('protect');
  fight(c);
  recruit(c, RECRUIT_QUESTS[0]);
  recruit(c, RECRUIT_QUESTS[2]);
  const initial = c.snapshot();
  assert.throws(() => c.setParty(['companion_20']));
  assert.deepEqual(c.snapshot(), initial);
  const target = c.session.party.formation.companion_01;
  const swapped = moveFormation(c.session.party.formation, 'hero', target);
  c.setFormation(swapped);
  assert.deepEqual(c.session.party.formation.hero, target);
  assert.throws(() => c.setFormation({ hero: { x: 5, y: 0 } }));
  const resumed = new Campaign();
  resumed.load(c.snapshot());
  assert.deepEqual(resumed.session.party.formation, swapped);
});
test('wrong puzzle answers and insufficient items do not consume resources or unlock companions', () => {
  const c = new Campaign();
  c.newGame({ sect: 'VoDang' });
  c.chooseMain('protect');
  fight(c);
  const before = c.snapshot();
  assert.throws(() => c.solveRecruit('recruit_03', 2));
  assert.deepEqual(c.snapshot(), before);
  assert.throws(() => c.recruit('recruit_03'));
  assert.throws(() => c.solveRecruit('recruit_09', 1));
  c.solveRecruit('recruit_03', 0);
  c.recruit('recruit_03');
  const after = c.snapshot();
  assert.throws(() => c.recruit('recruit_03'));
  assert.deepEqual(c.snapshot(), after);
  assert.throws(() => c.buy('toString'));
  assert.throws(() => c.gift('companion_20'));
});
test('legacy profile migration retains hero, inventory and flags, starts the real story and does not grant repeated kits', () => {
  const old = createCampaign({ sect: 'CaiBang' });
  delete old.storyProgress.campaignVersion;
  old.storyProgress.currentAct = 2;
  old.storyProgress.questFlags = { OLD_FLAG: true };
  old.inventory = [{ itemId: 'tea', quantity: 2 }];
  old.hero.equippedGear = {};
  const c = new Campaign();
  c.load(old);
  assert.equal(c.mainQuest().id, 'Q101');
  assert.equal(c.session.legacyProgress.currentAct, 2);
  assert.equal(c.session.storyProgress.questFlags.OLD_FLAG, true);
  assert.equal(itemCount(c.session, 'tea'), 2);
  const once = c.snapshot();
  c.load(once);
  assert.deepEqual(c.snapshot(), once);
});
test('full campaign crosses 240 episodes, recruits all sixty, and supports each gated ending with valid saves', async () => {
  const c = new Campaign();
  c.newGame({ sect: 'VoDang', name: 'Giang' });
  for (const quest of MAIN_QUESTS.filter((q) => !q.ending)) {
    if (quest.id !== 'Q101')
      for (const q of c
        .availableRecruitQuests()
        .filter((q) => Number(q.companionId.slice(-2)) <= 20)
        .slice(0, 6))
        if (!c.session.party.unlocked.includes(q.companionId)) recruit(c, q);
    win(c, () => c.chooseMain(quest.choices[0].id));
    assert.doesNotThrow(() => validateCampaign(c.snapshot()));
  }
  assert.equal(c.mainQuest().id, 'Q304');
  assert.equal(c.session.storyProgress.questFlags.DISCOVERED_DEBT_BOOK, true);
  assert.equal(c.session.storyProgress.questFlags.DISCOVERED_FAKE_LEADER, true);
  // Fund optional endgame collection; main story above uses earned rewards.
  c.session.inventory.find((i) => i.itemId === 'silver').quantity += 5000;
  for (const quest of RECRUIT_QUESTS)
    if (!c.session.party.unlocked.includes(quest.companionId))
      recruit(c, quest);
  assert.equal(c.session.party.unlocked.length, 60);
  assert.equal(
    c.endingOptions().find((e) => e.id === 'wealth').available,
    false
  );
  assert.equal(
    c.endingOptions().find((e) => e.id === 'retire').available,
    true
  );
  const before = c.snapshot(),
    storage = new StorageManager({ indexedDB: null, localStorage: memory() });
  for (const ending of ENDINGS) {
    const branch = new Campaign();
    branch.load(before);
    if (ending.id === 'wealth') branch.session.storyProgress.karmaScore = -3;
    if (ending.id === 'actor' && itemCount(branch.session, 'silver') < 500)
      branch.session.inventory.find((i) => i.itemId === 'silver').quantity =
        500;
    branch.chooseEnding(ending.id);
    assert.equal(branch.session.storyProgress.endingId, ending.id);
    assert.equal(branch.mainQuest(), null);
    assert.throws(() => branch.chooseEnding('actor'));
    const text = await storage.exportSave(branch.snapshot());
    const restored = new Campaign();
    restored.load(await storage.decodeSave(text));
    assert.equal(restored.session.storyProgress.endingId, ending.id);
    assert.equal(restored.session.party.unlocked.length, 60);
  }
});
test('campaign schema rejects future quest skips, invented companions, forged ending and mismatched pending fights', () => {
  const base = createCampaign({ sect: 'VoDang' });
  for (const edit of [
    (s) => s.storyProgress.completedQuests.push('Q303'),
    (s) => (s.storyProgress.endingId = 'justice'),
    (s) => s.party.unlocked.push('companion_99'),
    (s) =>
      (s.storyProgress.pendingEncounter = {
        token: 1,
        kind: 'main',
        questId: 'Q303',
        seed: 0
      }),
    (s) => s.inventory.push({ itemId: 'silver', quantity: -1 })
  ]) {
    const bad = structuredClone(base);
    edit(bad);
    assert.throws(() => validateCampaign(bad));
  }
});
