import test from 'node:test';
import assert from 'node:assert/strict';
import {COMPANION_MEMORIES} from '../src/data/CompanionMemories.js';
import {freshCompanionJourneys,validateCompanionJourneys,recordCompanionQuestBattle} from '../src/core/CompanionJourneys.js';
import {Campaign,validateCampaign} from '../src/core/Campaign.js';
import {developed} from '../scripts/balance-campaign7.mjs';

test('all sixty authored companion quests, branching decisions and cutscenes have independent identities',()=>{
 assert.equal(COMPANION_MEMORIES.length,60);
 const a=new Set(),b=new Set(),c=new Set();
 for(const memory of COMPANION_MEMORIES){
  const q=memory.chapters[1].quest,branch=memory.chapters[2],scene=memory.chapters[3].cutscene;
  assert.equal(q.requiresCompanion,memory.id);
  assert.equal(branch.choices.length,2);
  assert.ok(!a.has(q.id));a.add(q.id);
  assert.ok(!b.has(branch.choices[0].id));b.add(branch.choices[0].id);
  assert.ok(!c.has(scene.id));c.add(scene.id);
  assert.equal(scene.replayable,true);
  assert.equal(scene.reducedMotion,true);
 }
});

test('personal quest counts at most one qualifying win per encounter and persists through save/load',()=>{
 const base=developed(),s=base.snapshot(),id=s.party.active[0],other=s.party.active[1];
 s.companionsAffinity[id]=100;
 s.companionsAffinity[other]=49;
 s.journey.companionJourneys=freshCompanionJourneys();
 recordCompanionQuestBattle(s,[id,id,other,'unknown']);
 assert.equal(s.journey.companionJourneys.battleWins[id],1);
 assert.equal(s.journey.companionJourneys.battleWins[other],undefined);
 recordCompanionQuestBattle(s,[id]);recordCompanionQuestBattle(s,[id]);
 assert.equal(s.journey.companionJourneys.battleWins[id],2);
 validateCampaign(s);
 const c=new Campaign();c.load(s);
 c.completeCompanionQuest(id);
 assert.deepEqual(c.snapshot().journey.companionJourneys.questDone,[id]);
 const choice=COMPANION_MEMORIES.find(m=>m.id===id).chapters[2].choices[0].id;
 c.chooseCompanionCrossroad(id,choice);
 c.watchCompanionCutscene(id);
 c.watchCompanionCutscene(id);
 assert.equal(c.snapshot().journey.companionJourneys.crossroads[id],choice);
 assert.deepEqual(c.snapshot().journey.companionJourneys.watched,[id]);
 const reload=new Campaign();reload.load(c.snapshot());
 assert.equal(reload.snapshot().journey.companionJourneys.crossroads[id],choice);
 assert.throws(()=>reload.completeCompanionQuest(id));
 assert.throws(()=>reload.chooseCompanionCrossroad(id,choice));
});

test('old journey saves without the new optional state and malformed memory progress are safe',()=>{
 const s=developed().snapshot();
 delete s.journey.companionJourneys;
 validateCampaign(s);
 const state=freshCompanionJourneys();
 for(const invalid of [
  {...state,battleWins:{companion_01:3}},
  {...state,battleWins:{companion_01:-1}},
  {...state,questDone:['companion_01','companion_01']},
  {...state,questDone:['not_a_companion']},
  {...state,crossroads:{companion_01:'invalid_choice'}},
  {...state,watched:['companion_01','companion_01']}
 ])assert.throws(()=>validateCompanionJourneys(invalid));
 const old=new Campaign();old.load(s);
 assert.equal(old.snapshot().journey.companionJourneys,undefined);
});
