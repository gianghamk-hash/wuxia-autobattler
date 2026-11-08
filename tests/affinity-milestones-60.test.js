import test from 'node:test';
import assert from 'node:assert/strict';
import {COMPANIONS} from '../src/data/CompanionsData.js';
import {MAX_AFFINITY7} from '../src/data/MaxAffinity7.js';
import {AFFINITY_MILESTONES,AFFINITY_SPECIALTIES,MID_AFFINITY75,applyAffinityMilestones,affinityMilestoneDetails,affinityMilestoneStage} from '../src/data/AffinityMilestones.js';
import {COMPANION_MEMORIES} from '../src/data/CompanionMemories.js';
import {Companion} from '../src/entities/Companion.js';
import {Hero} from '../src/entities/Hero.js';
import {GridSystem} from '../src/combat/GridSystem.js';
import {CombatEngine} from '../src/combat/CombatEngine.js';

function unit(id,affinity) {
  const u=new Companion(id,{level:5});
  return applyAffinityMilestones(u,affinity);
}
function fixture(id,affinity) {
  const u=unit(id,affinity),hero=new Hero('DuongMon',{id:'hero'}),enemy=new Companion('companion_05',{id:'enemy',team:'enemy',level:5});
  const grid=new GridSystem();
  for(const [v,p] of [[u,{x:2,y:1}],[hero,{x:1,y:1}],[enemy,{x:3,y:1}]])grid.place(v,p,{formation:false});
  const c=new CombatEngine({units:[u,hero,enemy],grid});
  c.start();
  return {c,u,hero,enemy};
}

test('60 characters have all four milestone records and a distinct canonical 100 passive',()=>{
  assert.deepEqual(AFFINITY_MILESTONES,[25,50,75,100]);
  assert.equal(COMPANIONS.length,60);
  assert.equal(Object.keys(AFFINITY_SPECIALTIES).length,60);
  assert.equal(Object.keys(MID_AFFINITY75).length,60);
  assert.equal(Object.keys(MAX_AFFINITY7).length,60);
  assert.equal(new Set(Object.values(MAX_AFFINITY7).map(p=>p.name)).size,60);
  assert.equal(new Set(Object.values(MID_AFFINITY75).map(p=>p.name)).size,60);
  for(const c of COMPANIONS) {
    const milestones=affinityMilestoneDetails(c.id);
    assert.deepEqual(milestones.map(x=>x.at),[25,50,75,100]);
    assert.ok(milestones.every(x=>x.description.length>15),c.id);
    const memory=COMPANION_MEMORIES.find(m=>m.id===c.id);
    assert.deepEqual(memory.chapters.map(x=>x.reward.at),[25,50,75,100]);
    assert.equal(memory.chapters[1].quest.requiresCompanion,c.id);
    assert.equal(memory.chapters[3].cutscene.replayable,true);
    assert.match(milestones[3].description,new RegExp(MAX_AFFINITY7[c.id].name));
    assert.equal(MID_AFFINITY75[c.id].limit,2);
    assert.ok(MID_AFFINITY75[c.id].cd>=12);
    assert.ok(MID_AFFINITY75[c.id].actions.length===1);
  }
});

test('the four rewards unlock on precise thresholds, never earlier, without multi-stat buffs',()=>{
  for(const id of COMPANIONS.map(c=>c.id)) {
    const info=AFFINITY_SPECIALTIES[id],baseline=unit(id,0);
    for(const [value,stage] of [[24.99,0],[25,25],[49.99,25],[50,50],[74.99,50],[75,75],[99.99,75],[100,100]]) {
      const u=unit(id,value);
      assert.equal(u.affinityStage,stage,id);
      assert.equal(u.midAffinity,stage===75,id);
      assert.equal(u.maxAffinity,stage===100,id);
      assert.equal(u.affinityProfession,stage>=50?info.profession:null,id);
      for(const stat of ['maxHp','physicalAtk','magicalAtk']) {
        const expected=baseline.stats[stat]*(stage>=25&&stat===info.mainStat?1.05:1);
        assert.ok(Math.abs(u.stats[stat]-expected)<1e-6,id+' '+stat);
      }
      assert.equal(u.stats.hp,u.stats.maxHp,id);
    }
  }
  for(const n of [-1,100.001,NaN,Infinity])assert.throws(()=>affinityMilestoneStage(n));
});

test('75 intermediate is capped and cooldown-gated, while 100 preserves existing distinct perk',()=>{
  for(const id of COMPANIONS.map(c=>c.id)){
    const a=fixture(id,75),b=fixture(id,100),locked=fixture(id,74);
    assert.equal(a.c.maxAffinity.entries.length,1,id);
    assert.equal(a.c.maxAffinity.entries[0].perk.id,id+'_75');
    assert.equal(b.c.maxAffinity.entries.length,1,id);
    assert.strictEqual(b.c.maxAffinity.entries[0].perk,MAX_AFFINITY7[id]);
    assert.equal(locked.c.maxAffinity.entries.length,0,id);
    const row=a.c.maxAffinity.entries[0],e={actorId:a.u.id,targetId:a.enemy.id};
    // Some start-trigger perks automatically fire on start; their cap still applies.
    a.c.elapsed=30;
    row.ready=0;
    const first=row.used;
    assert.ok(a.c.maxAffinity.fire(row,e),id);
    assert.equal(row.used,first+1,id);
    assert.equal(a.c.maxAffinity.fire(row,e),false,id);
    a.c.elapsed+=row.perk.cd;
    if(row.used<2)assert.equal(a.c.maxAffinity.fire(row,e),true,id);
    a.c.elapsed+=100;
    assert.equal(a.c.maxAffinity.fire(row,e),false,id);
  }
});

test('50 professional bonus affects only a single combat dimension',()=>{
  const chosen={};
  for(const c of COMPANIONS){const kind=AFFINITY_SPECIALTIES[c.id].profession;chosen[kind]??=c.id;}
  for(const [kind,id] of Object.entries(chosen)){
    const a=fixture(id,49),b=fixture(id,50);
    if(kind==='damage')assert.ok(Math.abs(b.u.damageMultiplier/a.u.damageMultiplier-1.10)<1e-6);
    if(kind==='healing')assert.ok(Math.abs((b.u.healMultiplier??1)/(a.u.healMultiplier??1)-1.10)<1e-6);
    if(kind==='shield'||kind==='energy')assert.equal(b.u.damageMultiplier,a.u.damageMultiplier);
    assert.equal(b.u.stats.maxHp,a.u.stats.maxHp);
    assert.equal(b.u.stats.physicalAtk,a.u.stats.physicalAtk);
    assert.equal(b.u.stats.magicalAtk,a.u.stats.magicalAtk);
  }
});
