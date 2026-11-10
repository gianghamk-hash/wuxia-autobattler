import test from 'node:test';
import assert from 'node:assert/strict';
import {campaignEnemyMultiplier,modeEnemyMultiplier,scaleEnemyStats} from '../src/combat/EnemyDifficulty.js';
import {earlyDungeonFactor} from '../src/combat/EarlyDungeon.js';
import {DIFFICULTY,bossSequence} from '../src/combat/BattleRules6.js';
import {Companion} from '../src/entities/Companion.js';

test('new story curve is continuous at chapter 3, bounded and progressively harder without old x2 cliff',()=>{
 const values=Array.from({length:20},(_,i)=>campaignEnemyMultiplier(i+1));
 for(let i=1;i<values.length;i++)assert.ok(values[i]>=values[i-1],`chapter ${i+1}`);
 assert.ok(values[2]-values[1]<.15);
 assert.equal(values[0],.78);
 assert.equal(values[19],1.25);
 assert.ok(values.every(x=>x<=1.25));
});

test('all six campaign modes are easier and preserve relative story progression',()=>{
 for(const chapter of [1,2,3,5,10,15,20]){
  const main=modeEnemyMultiplier('main',chapter);
  assert.equal(main,campaignEnemyMultiplier(chapter));
  for(const mode of ['practice','arena','escort','dungeon','chapterBoss']){
   const target=modeEnemyMultiplier(mode,chapter);
   assert.ok(target>0&&target<main,`${mode} chapter ${chapter}`);
  }
 }
 assert.equal(modeEnemyMultiplier('practice',20),.79);
 assert.equal(modeEnemyMultiplier('arena',20),.80);
 assert.equal(modeEnemyMultiplier('escort',20),.78);
 assert.equal(modeEnemyMultiplier('dungeon',20),1.0625);
 assert.equal(modeEnemyMultiplier('chapterBoss',20),1.1125);
});

test('enemy reductions never scale maxEnergy, action speed, crit or skill geometry',()=>{
 const enemy=new Companion('companion_05',{team:'enemy',level:10});
 const before=structuredClone(enemy.stats);
 const skills=structuredClone(enemy.skills);
 scaleEnemyStats(enemy,.78);
 for(const key of ['maxHp','hp','physicalAtk','magicalAtk','physicalDef','magicalDef'])
  assert.ok(Math.abs(enemy.stats[key]-before[key]*.78)<1e-8,key);
 for(const key of Object.keys(before).filter(k=>!['maxHp','hp','physicalAtk','magicalAtk','physicalDef','magicalDef'].includes(k)))
  assert.equal(enemy.stats[key],before[key],key);
 assert.deepEqual(enemy.skills,skills);
 const once=structuredClone(enemy.stats);
 scaleEnemyStats(enemy,.78);assert.deepEqual(enemy.stats,once);
 scaleEnemyStats(enemy,1);
 for(const key of Object.keys(before))assert.ok(Math.abs(enemy.stats[key]-before[key])<1e-8,key);
 for(const bad of [0,-1,NaN,Infinity])assert.throws(()=>scaleEnemyStats(enemy,bad));
});

test('enemy authored HP and attack budget is lower while all tower floors get a relief factor',()=>{
 assert.deepEqual([DIFFICULTY.hp,DIFFICULTY.attack],[1.25,1.1]);
 assert.ok(DIFFICULTY.hp*campaignEnemyMultiplier(20)<1.6);
 assert.ok(DIFFICULTY.attack*campaignEnemyMultiplier(20)<1.5);
 const floors=[0,9,10,19,20,29,30,59,60,99];
 const expected=[.57,.57,.68,.68,.78,.78,.88,.88,.93,.93];
 assert.deepEqual(floors.map(earlyDungeonFactor),expected);
});

test('boss waves remain deterministic, still have three phases and capped late-wave strength',()=>{
 const enemies=Array.from({length:4},(_,i)=>new Companion('companion_05',{id:'enemy_'+i,team:'enemy',level:8}));
 const waves=bossSequence(enemies,15,{waveCounts:[4,4,8],normalizeWaveSize:true});
 const second=waves(2),third=waves(3);
 assert.equal(second.length,4);
 assert.equal(third.length,8);
 assert.ok(third[0].stats.hp>0&&third.every(u=>u.stats.maxHp>0));
 assert.ok(third[1].stats.maxHp < second[1].stats.maxHp);
});
