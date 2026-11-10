import test from 'node:test';
import assert from 'node:assert/strict';
import {COMPANIONS} from '../src/data/CompanionsData.js';
import {formationRole,ROLE_TAGS,HERO_ROLES} from '../src/data/RoleTags.js';
import {DAI_VIET_QUESTS} from '../src/data/DaiVietStoryData.js';
import {ENCOUNTERS} from '../src/data/EnemiesData.js';
import {MISSIONS} from '../src/data/MissionsData.js';
import {storyEnemyCount,storyWaveCounts,encounterSeed,enemyLineup} from '../src/core/EncounterFactory.js';
import {bossSequence,DIFFICULTY} from '../src/combat/BattleRules6.js';
import {modeEnemyMultiplier} from '../src/combat/EnemyDifficulty.js';
import {CombatEngine} from '../src/combat/CombatEngine.js';
import {GridSystem} from '../src/combat/GridSystem.js';
import {Hero} from '../src/entities/Hero.js';
import {Companion} from '../src/entities/Companion.js';
import {earlyDungeonFactor} from '../src/combat/EarlyDungeon.js';
import {developed} from '../scripts/balance-campaign7.mjs';

test('all sixty companions and all five hero sects have a readable formation role; mission objects have none',()=>{
 assert.equal(COMPANIONS.length,60);
 const groups=new Set();for(const u of COMPANIONS){const group=formationRole(u);assert.ok(ROLE_TAGS[group],u.id);groups.add(group);}
 assert.deepEqual([...groups].sort(),['damage','frontline','support']);
 for(const sect of Object.keys(HERO_ROLES))assert.ok(ROLE_TAGS[formationRole({id:'hero',sect})]);
 assert.equal(formationRole({missionAsset:true,role:'Tank'}),null);
 assert.equal(formationRole({role:'Healer'}),'support');assert.equal(formationRole({role:'Tank'}),'frontline');assert.equal(formationRole({role:'Assassin'}),'damage');
});

test('all 265 story encounters can roll every count 4–8 and boss waves vary deterministically without using Math.random',()=>{
 for(const q of DAI_VIET_QUESTS.filter(q=>q.encounter)){
  const counts=new Set();for(let attempt=1;attempt<=60;attempt++){
   const seed=encounterSeed(attempt),count=storyEnemyCount(q,seed);counts.add(count);assert.ok(count>=4&&count<=8);
   assert.equal(storyEnemyCount(q,seed),count);
   if(q.boss)for(const n of storyWaveCounts(q,seed))assert.ok(n>=4&&n<=8);
  }
  assert.equal(counts.size,5,q.id);
 }
});

test('full six-person parties fit eight enemy troops plus all three breach objectives without overlapping cells',()=>{
 for(const q of DAI_VIET_QUESTS.filter(q=>MISSIONS[q.id]?.type==='breach')){
  const grid=new GridSystem(),units=[new Hero('VoDang'),...Array.from({length:5},(_,i)=>new Companion('companion_05',{id:'home_'+i}))];
  units.forEach((u,i)=>grid.place(u,{x:i%3,y:Math.floor(i/3)}, { formation: false }));
  const foes=enemyLineup({quest:q,encounter:ENCOUNTERS[q.encounter],count:8,grid,main:true,rules:6});
  const b=new CombatEngine({units:[...units,...foes],grid,missionId:q.id,enemyLimit:8});b.start();
  assert.equal(foes.length,8);assert.equal(b.mission.assets.length,3);assert.equal(new Set(b.units.map(u=>JSON.stringify(u.gridPosition))).size,17,q.id);
 }
});

test('randomized main boss phases honor their three seeded counts, retaining the existing three-phase rules',()=>{
 const q=DAI_VIET_QUESTS.find(q=>q.boss&&q.chapter===18),counts=storyWaveCounts(q,encounterSeed(3));
 const enemies=enemyLineup({quest:q,encounter:ENCOUNTERS[q.encounter],count:counts[0],main:true,rules:6});
 const next=bossSequence(enemies,q.chapter,{waveCounts:counts});assert.equal(enemies.length,counts[0]);assert.equal(next(2).length,counts[1]);assert.equal(next(3).length,counts[2]);
});

test('all tower floors retain reproducible HP/attack budgets under the gentler mode curve',()=>{
 assert.deepEqual([0,9,10,19,20,99].map(earlyDungeonFactor),[.57,.57,.68,.68,.78,.93]);
 for(const floor of[0,9,10,19,20,59,99]){
  const c=developed();c.enterDungeon('phong_nha');const s=c.snapshot();s.adventure.dungeon.floor=floor;c.load(s);c.chooseRoom(0);
  const u=c.battle.units.find(u=>u.team==='enemy'),level=Math.min(20,2+Math.floor(floor/7)),base=new Companion('companion_05',{team:'enemy',level}),boss=(floor+1)%10===0;
  const scale=(.48+floor*.0045)*(boss?.8:1)*earlyDungeonFactor(floor);
  const modeMultiplier=modeEnemyMultiplier('dungeon',c.session.storyProgress.currentChapter);
  let hp=Math.round(Math.round(base.stats.maxHp*scale)*DIFFICULTY.hp);if(boss)hp=Math.round(hp*1.10);
  assert.ok(Math.abs(u.stats.maxHp-hp*modeMultiplier)<1e-8,`floor ${floor+1}`);
  const atk=base.stats.physicalAtk*scale*DIFFICULTY.attack*(boss?1.03:1)*modeMultiplier;
  assert.ok(Math.abs(u.stats.physicalAtk-atk)<1e-8,`floor ${floor+1} attack`);
  assert.equal(c.battle.enemyStatMultiplier,modeMultiplier);
 }
});
