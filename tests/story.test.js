import test from 'node:test';
import assert from 'node:assert/strict';
import {
  CHAPTERS,
  CHAPTER_XP,
  CHAPTER_SILVER,
  storyLines
} from '../src/data/StoryChaptersData.js';
import { MAIN_QUESTS, LEGACY_MAIN_QUESTS } from '../src/data/QuestsData.js';
import { COMPANIONS_BY_ID } from '../src/data/CompanionsData.js';
import { ENCOUNTERS } from '../src/data/EnemiesData.js';
import {
  Campaign,
  createCampaign,
  validateCampaign
} from '../src/core/Campaign.js';
import { expandStoryProgress } from '../src/core/StoryProgress.js';
function oldSave(n) {
  const s = createCampaign({ sect: 'VoDang' });
  const q = LEGACY_MAIN_QUESTS[n];
  s.storyProgress.completedQuests = LEGACY_MAIN_QUESTS.slice(0, n).map(
    (q) => q.id
  );
  s.storyProgress.activeQuestId = q?.id ?? null;
  s.storyProgress.currentAct = q?.act ?? 3;
  delete s.storyProgress.storyRevision;
  delete s.storyProgress.currentChapter;
  delete s.storyProgress.currentEpisode;
  return s;
}
test('twelve authored chapters have twenty distinct episodes each and fixed chapter budgets', () => {
  assert.equal(CHAPTERS.length, 12);
  assert.equal(MAIN_QUESTS.length, 240);
  assert.equal(new Set(MAIN_QUESTS.map((q) => q.id)).size, 240);
  for (const c of CHAPTERS) {
    const qs = MAIN_QUESTS.filter((q) => q.chapter === c.number);
    assert.equal(qs.length, 20);
    assert.equal(new Set(qs.map((q) => q.title)).size, 20);
    assert.equal(
      qs.reduce((sum, q) => sum + q.xp, 0),
      CHAPTER_XP[c.number - 1]
    );
    assert.equal(
      qs.reduce((sum, q) => sum + q.silver, 0),
      CHAPTER_SILVER[c.number - 1]
    );
    for (const q of qs) {
      assert.ok(q.previous);
      assert.ok(q.objectiveText);
      assert.ok(q.lines.length >= 3);
      if (q.encounter) assert.ok(ENCOUNTERS[q.encounter]);
    }
  }
  assert.equal(MAIN_QUESTS.filter((q) => q.encounter).length, 68);
  assert.equal(MAIN_QUESTS.at(-1).id, 'Q304');
});
test('historical choices alter later dialogue and owned companions add their own voice without mutation', () => {
  const q = MAIN_QUESTS.find((q) => q.chapter === 8 && q.episode === 11),
    s = createCampaign({ sect: 'VoDang' });
  s.storyProgress.decisions.Q103 = 'witness';
  const before = structuredClone(s);
  const yes = storyLines(q, s, MAIN_QUESTS, COMPANIONS_BY_ID);
  assert.deepEqual(s, before);
  s.storyProgress.decisions.Q103 = 'bluff';
  assert.notDeepEqual(storyLines(q, s, MAIN_QUESTS, COMPANIONS_BY_ID), yes);
  const spot = MAIN_QUESTS.find((q) => q.spotlights.length),
    without = storyLines(spot, s, MAIN_QUESTS, COMPANIONS_BY_ID);
  s.party.unlocked.push(spot.spotlights[0].id);
  assert.equal(
    storyLines(spot, s, MAIN_QUESTS, COMPANIONS_BY_ID).length,
    without.length + 1
  );
});
test('old completed chapters expand without money/XP and remain stable across repeated loads', () => {
  for (const n of [0, 1, 4, 8, 11]) {
    const s = oldSave(n),
      hero = structuredClone(s.hero),
      inventory = structuredClone(s.inventory);
    assert.doesNotThrow(() => validateCampaign(s));
    const c = new Campaign();
    c.load(s);
    assert.equal(c.session.storyProgress.completedQuests.length, n * 20);
    assert.equal(c.session.storyProgress.currentChapter, n + 1);
    assert.deepEqual(c.session.hero, {...hero,equippedGear:{...hero.equippedGear,helmet:null}});
    assert.deepEqual(c.session.inventory, inventory);
    const once = c.snapshot();
    c.load(once);
    assert.deepEqual(c.snapshot(), once);
  }
});
test('pending legacy encounter keeps original anchor and seed; corrupt old skips are rejected', () => {
  const s = oldSave(2);
  s.storyProgress.attemptCounter = 1;
  s.storyProgress.pendingEncounter = {
    token: 1,
    kind: 'main',
    questId: 'Q103',
    seed: 123
  };
  s.storyProgress.decisions.Q103 = 'witness';
  const r = expandStoryProgress(s.storyProgress);
  assert.equal(r.activeQuestId, 'Q103');
  assert.equal(r.currentChapter, 3);
  assert.equal(r.currentEpisode, 20);
  assert.equal(r.pendingEncounter.seed, 123);
  assert.equal(r.completedQuests.length, 59);
  const broken = oldSave(2);
  broken.storyProgress.completedQuests = ['Q101', 'Q103'];
  assert.throws(() => expandStoryProgress(broken.storyProgress));
});
