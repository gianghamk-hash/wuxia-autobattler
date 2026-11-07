import test from 'node:test';
import assert from 'node:assert/strict';
import {campaignEnemyMultiplier,scaleEnemyStats} from '../src/combat/EnemyDifficulty.js';
import {CombatEngine} from '../src/combat/CombatEngine.js';
import {GridSystem} from '../src/combat/GridSystem.js';
import {Companion} from '../src/entities/Companion.js';
import {Hero} from '../src/entities/Hero.js';
import {bossSequence,ENEMY_CELLS} from '../src/combat/BattleRules6.js';
import {applyStoryIdentity,NPCS_BY_ID} from '../src/data/NPCData.js';
import {Campaign,createCampaign} from '../src/core/Campaign.js';
import {DAI_VIET_QUESTS} from '../src/data/DaiVietStoryData.js';
import {createHeroBuild} from '../src/entities/HeroBuild.js';
import {developed} from '../scripts/balance-campaign6.mjs';

function fixture(multiplier,{waves=false,boss=false,mission=false}={}){
 const hero=new Hero('VoDang'),grid=new GridSystem();hero.stats.maxHp=hero.stats.hp=100000;grid.place(hero,{x:2,y:1}, { formation: false });
 const enemies=Array.from({length:waves?4:1},(_,i)=>new Companion('companion_05',{id:'enemy_'+i,team:'enemy',level:5}));
 if(boss)applyStoryIdentity(enemies[0],NPCS_BY_ID.doi_truong);
 for(const[u,i]of enemies.map((u,i)=>[u,i]))grid.place(u,ENEMY_CELLS[i], { formation: false });
 const nextBossWave=waves?bossSequence(enemies,12):null;
 const c=new CombatEngine({units:[hero,...enemies],grid,enemyLimit:8,enemyStatMultiplier:multiplier,nextBossWave,missionId:mission?'C01H09':null});c.start();return c;
}
function twice(actual,base){for(const[key,value]of Object.entries(base.stats))assert.equal(actual.stats[key],value*2,key);}

test('all numeric enemy stats double once; allies, objectives and the opening chapters retain baseline values',()=>{
 assert.deepEqual([1,2,3,20].map(campaignEnemyMultiplier),[1,1,2,2]);
 const a=fixture(1),b=fixture(2);twice(b.units[1],a.units[1]);assert.deepEqual(b.units[0].stats,a.units[0].stats);
 const before=structuredClone(b.units[1].stats);b.scaleEnemy(b.units[1]);assert.deepEqual(b.units[1].stats,before);
 const objective={team:'enemy',missionAsset:true,stats:{hp:300,maxHp:300}};scaleEnemyStats(objective,2);assert.equal(objective.stats.hp,300);
});

test('three real boss phases each receive exactly x2 after their authored phase modifiers',()=>{
 const a=fixture(1,{waves:true}),b=fixture(2,{waves:true});
 for(let phase=1;phase<=3;phase++){
  const x=a.units.filter(u=>u.team==='enemy'&&u.alive),y=b.units.filter(u=>u.team==='enemy'&&u.alive);assert.equal(x.length,y.length);for(let i=0;i<x.length;i++)twice(y[i],x[i]);
  if(phase<3)for(const c of[a,b]){for(const u of c.units.filter(u=>u.team==='enemy'))u.stats.hp=0;c.grid.removeDead();c.checkResult();assert.equal(c.bossPhase,phase+1);}
 }
});

test('boss guards and seals inherit scaled HP/attacks while their other stats also double without stacking',()=>{
 for(const seal of[false,true]){const a=fixture(1,{boss:true}),b=fixture(2,{boss:true});if(seal)for(const c of[a,b])c.units[1].stats.maxHp=50*c.enemyStatMultiplier;
  const u=a.director.summon(a.director.bosses[0],seal),v=b.director.summon(b.director.bosses[0],seal);assert.ok(u&&v);twice(v,u);const once=structuredClone(v.stats);b.scaleEnemy(v);assert.deepEqual(v.stats,once);
 }
});

test('mission reinforcements have x2 inherited HP and attacks and x2 base defenses/speeds',()=>{
 const a=fixture(1,{mission:true}),b=fixture(2,{mission:true});for(const c of[a,b]){c.elapsed=10;c.mission.update();}
 const x=a.units.filter(u=>u.id.startsWith('mission_wave_')),y=b.units.filter(u=>u.id.startsWith('mission_wave_'));assert.equal(x.length,2);assert.equal(y.length,2);for(let i=0;i<2;i++)twice(y[i],x[i]);
});

function campaignAt(q){const s=createCampaign({story:'dai-viet',sect:'VoDang'}),done=DAI_VIET_QUESTS.filter(v=>v.id<q.id);s.hero=createHeroBuild({sect:'VoDang',name:'Thử độ khó',level:20});s.storyProgress.completedQuests=done.map(v=>v.id);s.storyProgress.decisions=Object.fromEntries(done.map(v=>[v.id,v.id==='D19H18'?'stay':v.choices[0]?.id??'continue']));Object.assign(s.storyProgress,{activeQuestId:q.id,currentChapter:q.chapter,currentEpisode:q.episode,currentAct:q.act});const c=new Campaign();c.load(s);return c;}

test('real campaign scouting matches actual battle stats in chapters 2, 3 and 20; retrying a save never compounds difficulty',()=>{
 for(const chapter of[2,3,20]){const q=DAI_VIET_QUESTS.filter(q=>q.chapter===chapter&&q.boss).at(-1),c=campaignAt(q),scout=c.scoutMain();c.chooseMain(q.choices[0]?.id??'continue');assert.equal(c.battle.enemyStatMultiplier,chapter>=3?2:1);
  const foes=c.battle.units.filter(u=>u.team==='enemy'&&!u.missionAsset);for(let i=0;i<foes.length;i++)assert.deepEqual(foes[i].stats,scout.enemies[i].stats);
  const saved=c.snapshot(),before=foes.map(u=>structuredClone(u.stats)),copy=new Campaign();copy.load(saved);copy.retryEncounter();assert.deepEqual(copy.battle.units.filter(u=>u.team==='enemy'&&!u.missionAsset).map(u=>u.stats),before);assert.equal(copy.battle.seed,c.battle.seed);
 }
});

test('side battles use story progress rather than tower floor; replayed chapter bosses use their own chapter',()=>{
 for(const chapter of[2,3,20])for(const mode of['practice','arena','escort','dungeon']){
  const q=DAI_VIET_QUESTS.filter(q=>q.chapter===chapter).at(-1),c=campaignAt(q);
  c.session.inventory.find(i=>i.itemId==='silver').quantity=1000;
  if(mode==='practice')c.practice();else if(mode==='arena')c.startArena('npc_0');else if(mode==='escort')c.startEscort('safe');else {c.enterDungeon('phong_nha');const s=c.snapshot();s.adventure.dungeon.floor=99;c.load(s);c.chooseRoom(0);}
  assert.equal(c.battle.enemyStatMultiplier,mode==='practice'?1:chapter>=3?2:1,`${mode} chapter ${chapter}`);
 }
 for(const chapter of[1,2,3,19]){const c=developed();c.startChapterBoss(chapter);assert.equal(c.battle.enemyStatMultiplier,chapter>=3?2:1,`replay ${chapter}`);}
});
