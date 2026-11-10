import test from 'node:test';
import assert from 'node:assert/strict';
import {COMPANION_JOURNEY_DESIGNS,branchTradeoffText,companionQuestQualifies} from '../src/data/CompanionJourneyDesigns.js';
import {COMPANION_MEMORIES} from '../src/data/CompanionMemories.js';
import {COMPANIONS} from '../src/data/CompanionsData.js';
import {MAX_AFFINITY7} from '../src/data/MaxAffinity7.js';
import {applyAffinityMilestones} from '../src/data/AffinityMilestones.js';
import {Companion} from '../src/entities/Companion.js';
import {applyCompanionCrossroad} from '../src/combat/CompanionBattleBranches.js';
import {recordCompanionQuestBattle,validateCompanionJourneys,freshCompanionJourneys} from '../src/core/CompanionJourneys.js';
import {Campaign,validateCampaign} from '../src/core/Campaign.js';
import {developed} from '../scripts/balance-campaign7.mjs';

const validRecord=id=>({id,team:'home',alive:true,maxHp:1000,finalHp:700,damage:200,healing:60,absorbed:40,damageTaken:110,kills:1,ultimates:2});
const goodResult=id=>({winner:'home',duration:25,statistics:[validRecord(id),{id:'hero',team:'home',alive:true},{id:'ally_b',team:'home',alive:true}]});
const keys=new Set(['maxHp','physicalAtk','magicalAtk','physicalDef','magicalDef','preparedEnergy','preparedDamage','critRate','dodgeRate']);

test('exactly 60 named personal quests, 120 branching choices and 60 individually scripted six-beat cinematics',()=>{
 assert.equal(COMPANIONS.length,60);
 assert.equal(COMPANION_MEMORIES.length,60);
 assert.equal(Object.keys(COMPANION_JOURNEY_DESIGNS).length,60);
 const titles=new Set(),frames=new Set(),confessions=new Set(),climaxes=new Set(),choiceIds=new Set(),sceneIds=new Set();
 for(const companion of COMPANIONS){
  const d=COMPANION_JOURNEY_DESIGNS[companion.id];
  const m=COMPANION_MEMORIES.find(c=>c.id===companion.id);
  assert.ok(d&&m);
  assert.equal(d.quest.required,1);
  assert.equal(m.chapters[1].quest.id,d.quest.id);
  assert.equal(m.chapters[1].quest.metric,d.quest.metric);
  assert.ok(d.quest.objective.includes(d.quest.context));
  assert.ok(!titles.has(d.quest.title),d.quest.title);titles.add(d.quest.title);
  assert.ok(!frames.has(d.scene.frame));frames.add(d.scene.frame);
  assert.ok(!confessions.has(d.scene.confession));confessions.add(d.scene.confession);
  assert.ok(!climaxes.has(d.scene.climax));climaxes.add(d.scene.climax);
  assert.ok(!sceneIds.has(m.chapters[3].cutscene.id));sceneIds.add(m.chapters[3].cutscene.id);
  assert.ok(m.chapters[3].cutscene.background.includes('chapter'));
  assert.equal(m.chapters[3].cutscene.beats.length,6);
  assert.equal(m.chapters[3].cutscene.skippable,true);
  assert.equal(m.chapters[3].cutscene.reducedMotion,true);
  assert.deepEqual(m.chapters[2].choices.map(c=>c.id),d.branch.choices.map(c=>c.id));
  for(const choice of d.branch.choices){
    assert.ok(!choiceIds.has(choice.id));choiceIds.add(choice.id);
    const vals=Object.values(choice.statChanges);
    assert.ok(vals.some(x=>x>0)&&vals.some(x=>x<0),choice.id);
    assert.ok(Object.keys(choice.statChanges).every(k=>keys.has(k)));
    assert.ok(branchTradeoffText(choice.statChanges).includes('%'));
  }
  assert.equal(MAX_AFFINITY7[companion.id].ownerId,undefined); // existing passives stay in their original table
 }
 assert.equal(choiceIds.size,120);assert.equal(sceneIds.size,60);
});

test('all 60 personal objectives validate distinct battle evidence, never count a loss',()=>{
 for(const d of Object.values(COMPANION_JOURNEY_DESIGNS)){
  const result=goodResult(d.id);
  assert.ok(companionQuestQualifies(d.quest,validRecord(d.id),result),d.id+' '+d.quest.metric);
  assert.equal(companionQuestQualifies(d.quest,validRecord(d.id),{...result,winner:'enemy'}),false);
  assert.equal(companionQuestQualifies(d.quest,null,result),false);
 }
});

test('qualifying win unlocks a personal quest, irrelevant wins do not; saved evidence is optional and validated',()=>{
 const s=developed().snapshot(),id=s.party.active[0];
 s.companionsAffinity[id]=80;
 s.journey.companionJourneys=freshCompanionJourneys();
 const invalid=validRecord(id);
 Object.assign(invalid,{alive:false,finalHp:0,damage:0,healing:0,absorbed:0,damageTaken:0,kills:0,ultimates:0});
 const wrong={winner:'home',duration:0,statistics:[invalid]};
 recordCompanionQuestBattle(s,[{id,templateId:id,team:'home'}],wrong);
 assert.equal(s.journey.companionJourneys.battleWins[id],1);
 assert.equal(s.journey.companionJourneys.questEvidence[id],undefined);
 let c=new Campaign();c.load(s);
 assert.throws(()=>c.completeCompanionQuest(id),/Chưa hoàn thành/);
 recordCompanionQuestBattle(s,[{id,templateId:id,team:'home'}],goodResult(id));
 assert.equal(s.journey.companionJourneys.questEvidence[id],1);
 validateCampaign(s);
 c=new Campaign();c.load(s);c.completeCompanionQuest(id);
 assert.ok(c.snapshot().journey.companionJourneys.questDone.includes(id));
 assert.throws(()=>c.completeCompanionQuest(id));
 for(const invalidState of [{questEvidence:{companion_01:-1}},{questEvidence:{rogue:1}},{questEvidence:{companion_01:3}},{questEvidence:[]}])
  assert.throws(()=>validateCompanionJourneys({...freshCompanionJourneys(),...invalidState}));
});

test('existing saves with two prior victories can claim the previous quest without replay, preserving all data',()=>{
 const s=developed().snapshot(),id=s.party.active[0];
 s.companionsAffinity[id]=100;
 s.journey.companionJourneys=freshCompanionJourneys();
 s.journey.companionJourneys.battleWins[id]=2;
 const c=new Campaign();c.load(s);c.completeCompanionQuest(id);
 assert.equal(c.snapshot().journey.companionJourneys.questEvidence,undefined);
 assert.ok(c.snapshot().journey.companionJourneys.questDone.includes(id));
 const choice=COMPANION_JOURNEY_DESIGNS[id].branch.choices[0].id;
 c.chooseCompanionCrossroad(id,choice);
 c.watchCompanionCutscene(id);
 const reload=new Campaign();reload.load(c.snapshot());
 assert.equal(reload.snapshot().journey.companionJourneys.crossroads[id],choice);
 assert.ok(reload.snapshot().journey.companionJourneys.watched.includes(id));
});

test('all 120 tradeoff paths are battle-local, nonstacking and preserve original 100 unique passives',()=>{
 const canonical=JSON.stringify(MAX_AFFINITY7);
 for(const d of Object.values(COMPANION_JOURNEY_DESIGNS)){
  for(const choice of d.branch.choices){
   const u=applyAffinityMilestones(new Companion(d.id,{level:8}),75);
   const initial=structuredClone(u.stats);
   applyCompanionCrossroad(u,choice.id);
   assert.equal(u.crossroadPath,choice.id);
   assert.ok(u.crossroadApplied);
   for(const [key,delta] of Object.entries(choice.statChanges)){
    if(['critRate','dodgeRate'].includes(key))
     assert.ok(Math.abs(u.stats[key]-Math.max(0,Math.min(key==='critRate'?.6:.4,initial[key]+delta)))<1e-8,d.id+' '+key);
    else if(key==='preparedEnergy')assert.ok(Math.abs(u.preparedEnergy-delta)<1e-8);
    else if(key==='preparedDamage')assert.ok(Math.abs(u.preparedDamage-(1+delta))<1e-8);
    else assert.ok(Math.abs(u.stats[key]-initial[key]*(1+delta))<1e-8,d.id+' '+key);
   }
   const after=structuredClone(u.stats);
   applyCompanionCrossroad(u,choice.id);assert.deepEqual(u.stats,after);
   const frozen=applyAffinityMilestones(new Companion(d.id,{level:8}),74);
   const before=structuredClone(frozen.stats);
   applyCompanionCrossroad(frozen,choice.id);
   assert.deepEqual(frozen.stats,before);
   assert.equal(frozen.crossroadApplied,undefined);
   const enemy=applyAffinityMilestones(new Companion(d.id,{team:'enemy',level:8}),100);
   const enemyBefore=structuredClone(enemy.stats);
   applyCompanionCrossroad(enemy,choice.id);
   assert.deepEqual(enemy.stats,enemyBefore);
  }
 }
 assert.equal(JSON.stringify(MAX_AFFINITY7),canonical);
});
