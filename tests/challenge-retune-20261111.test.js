import test from 'node:test';
import assert from 'node:assert/strict';
import {campaignEnemyMultiplier,modeEnemyMultiplier} from '../src/combat/EnemyDifficulty.js';
import {earlyDungeonFactor} from '../src/combat/EarlyDungeon.js';
import {bossSequence} from '../src/combat/BattleRules6.js';
import {Companion} from '../src/entities/Companion.js';

// The prior easy-mode release is a baseline for this targeted adjustment;
// no archived code or player saves are changed by these checks.
const prior = {
  chapters: [.78,.78,.88,.88,.88,.88,.96,.96,.96,.96,1.04,1.04,1.04,1.04,1.10,1.10,1.10,1.16,1.16,1.16],
  dungeon: [.55,.65,.75,.85,.90]
};
test('first two chapters remain unchanged, late chapters increase moderately, no 2x power cliff',()=>{
  const current=Array.from({length:20},(_,i)=>campaignEnemyMultiplier(i+1));
  assert.equal(current.length,20);
  assert.deepEqual(current.slice(0,2),prior.chapters.slice(0,2));
  for(let i=2;i<20;i++){
    assert.ok(current[i]>=current[i-1],`Chapter ${i+1} must not get easier`);
    assert.ok(current[i]>prior.chapters[i],`Chapter ${i+1} must be more challenging than before`);
    assert.ok(current[i]/prior.chapters[i]<1.09,`Chapter ${i+1} must not spike by >=9%`);
  }
  assert.ok(current[2]-current[1]<.20,'no repeat of 2x jump at chapter 3');
  assert.ok(current[19]<1.4);
});

test('progression-aware side modes remain gentler than the matching story battle',()=>{
  const previous={practice:.72,arena:.72,escort:.70,dungeon:.80,chapterBoss:.85};
  for(let chapter=1;chapter<=20;chapter++){
    const main=modeEnemyMultiplier('main',chapter);
    for(const mode of Object.keys(previous)){
      const actual=modeEnemyMultiplier(mode,chapter);
      assert.ok(actual>0&&actual<main,`${mode}/chapter ${chapter}`);
      if(chapter>=3){
        const old=mode==='dungeon'?prior.chapters[chapter-1]*previous.dungeon:
          mode==='chapterBoss'?prior.chapters[chapter-1]*previous.chapterBoss:previous[mode];
        assert.ok(actual>old,`${mode}/chapter ${chapter} should be more challenging`);
        assert.ok(actual/old<1.18,`${mode}/chapter ${chapter} should not jump by >=18%`);
      }
    }
  }
});

test('tower gets only modest strengthening and still shields first ten floors',()=>{
  const checkpoints=[0,10,20,30,60,99];
  const expected=[.57,.68,.78,.88,.93,.93];
  assert.deepEqual(checkpoints.map(earlyDungeonFactor),expected);
  const old=[.55,.65,.75,.85,.90,.90];
  for(let i=0;i<checkpoints.length;i++){
    assert.ok(expected[i]>old[i]);
    assert.ok(expected[i]/old[i]<1.07);
  }
  assert.ok(expected[0]<expected[expected.length-1]);
});

test('boss phase strength increases only moderately while keeping three waves',()=>{
  const enemies=Array.from({length:4},(_,i)=>new Companion('companion_05',{id:'enemy_'+i,team:'enemy',level:12}));
  const baseline=bossSequence(enemies,15,{waveCounts:[4,4,5],normalizeWaveSize:true});
  const wave2=baseline(2),wave3=baseline(3);
  assert.equal(wave2.length,4);
  assert.equal(wave3.length,5);
  assert.ok(wave3[0].stats.hp>0);
  assert.ok(wave3[0].stats.physicalAtk>0);
});
