import test from 'node:test';
import assert from 'node:assert/strict';
import { COMPANIONS } from '../src/data/CompanionsData.js';
import { COMPANION_MEMORIES, COMPANION_MEMORIES_BY_ID } from '../src/data/CompanionMemories.js';
test('all 60 canonical companions have a unique story and image',()=>{
 assert.equal(COMPANIONS.length,60);
 assert.equal(COMPANION_MEMORIES.length,60);
 assert.equal(new Set(COMPANION_MEMORIES.map(m=>m.id)).size,60);
 assert.equal(new Set(COMPANION_MEMORIES.map(m=>m.title)).size,60);
 assert.equal(new Set(COMPANION_MEMORIES.map(m=>m.turn)).size,60);
 assert.deepEqual(new Set(COMPANION_MEMORIES.map(m=>m.id)),new Set(COMPANIONS.map(c=>c.id)));
 for(const m of COMPANION_MEMORIES) {
  assert.ok(m.portrait.includes(m.id));
  assert.equal(m.chapters.length,4);
  assert.deepEqual(m.chapters.map(c=>c.at),[25,50,75,100]);
  assert.equal(m.chapters[1].quest.requiresCompanion,m.id);
  assert.equal(m.chapters[2].choices.length,2);
  assert.equal(m.chapters[3].cutscene.skippable,true);
  assert.equal(m.chapters[3].cutscene.replayable,true);
  assert.equal(m.chapters[3].cutscene.reducedMotion,true);
  assert.equal(COMPANION_MEMORIES_BY_ID[m.id],m);
 }
});
test('cutscenes and quests have distinct identifiers',()=>{
 const quests=COMPANION_MEMORIES.map(m=>m.chapters[1].quest.id);
 const scenes=COMPANION_MEMORIES.map(m=>m.chapters[3].cutscene.id);
 assert.equal(new Set(quests).size,60);
 assert.equal(new Set(scenes).size,60);
});
