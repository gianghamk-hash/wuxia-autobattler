import test from 'node:test';
import assert from 'node:assert/strict';
import { COMPANION_MEMORIES_BY_ID } from '../src/data/CompanionMemories.js';
import { COMPANION_SCENES_CHAPTER_ONE } from '../src/data/CompanionScenesChapterOne.js';
test('ten authored arcs have four structured scenes and distinct moral decisions',()=>{
 assert.equal(COMPANION_SCENES_CHAPTER_ONE.length,10);
 for(const arc of COMPANION_SCENES_CHAPTER_ONE){
  assert.deepEqual(arc.scenes.map(s=>s.at),[25,50,75,100]);
  assert.equal(arc.scenes[2].choices.length,2);
  assert.notEqual(arc.scenes[2].choices[0].id,arc.scenes[2].choices[1].id);
  assert.ok(arc.scenes.every(s=>s.shots.length>0&&s.shots.every(shot=>shot.dialogue.length)));
  const memory=COMPANION_MEMORIES_BY_ID[arc.id];
  assert.equal(memory.cinematic.place,arc.place);
  assert.equal(memory.chapters[1].quest.objective,arc.scenes[1].objective);
  assert.equal(memory.chapters[3].storyboard.length,2);
  assert.equal(memory.chapters[3].cutscene.portrait,memory.portrait);
 }
});
