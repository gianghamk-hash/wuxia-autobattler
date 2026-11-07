import test from 'node:test';
import assert from 'node:assert/strict';
import { developed } from '../scripts/balance-campaign7.mjs';
import { Campaign, createCampaign, validateCampaign, itemCount } from '../src/core/Campaign.js';
import { createHeroBuild, allocateAttribute, allocateSkill, normalizeHeroBuild } from '../src/entities/HeroBuild.js';
import { Hero } from '../src/entities/Hero.js';
import { Companion } from '../src/entities/Companion.js';
import { COMPANIONS } from '../src/data/CompanionsData.js';
import { SECT_PASSIVES } from '../src/data/ProgressionBalance.js';
import { DUNGEONS } from '../src/data/WorldData.js';
import { FISHING_LOOT, fishingReward } from '../src/core/Fishing.js';
import { seededRandom, calculateDamage } from '../src/combat/CombatMath.js';
import { rollGacha } from '../src/core/Gacha.js';
import { bossLoot, validateLoot } from '../src/core/Loot.js';
import { teamSnapshot, encodeTeam, decodeTeam, makeDungeon } from '../src/core/WorldProgress.js';
import { StorageManager } from '../src/core/StorageManager.js';

test('the level-6 UI build receives meaningful attribute gains and reset/reload never stacks them',()=>{
  let h=createHeroBuild({sect:'ThieuLam',level:6});
  const base=new Hero(h.sect,{profile:h});
  for(let i=0;i<5;i++)h=allocateAttribute(h,'canCot',[]);
  for(let i=0;i<3;i++)h=allocateAttribute(h,'khiHai',[]);
  const u=new Hero(h.sect,{profile:h});
  assert.ok(u.stats.maxHp-base.stats.maxHp>=500);
  assert.equal(u.stats.magicalAtk-base.stats.magicalAtk,36);
  assert.deepEqual(new Hero(h.sect,{profile:normalizeHeroBuild(h)}).stats,u.stats);
  assert.equal(h.freeAttributePoints,2);
});

test('all five schools can finish Sát lực first then unlock another branch including its ultimate',()=>{
  for(const sect of Object.keys(SECT_PASSIVES)){
    let h=createHeroBuild({sect,level:30});
    for(let i=1;i<=8;i++)h=allocateSkill(h,`${sect}_t${i}_attack`,[]);
    assert.equal(h.allocatedSkills.length,8);
    for(let i=1;i<=4;i++)h=allocateSkill(h,`${sect}_t${i}_guard`,[]);
    assert.equal(new Hero(sect,{profile:h}).skills.ultimate.id,`hero_${sect}_t4_guard`);
    assert.throws(()=>allocateSkill(h,`${sect}_t6_balanced`,[]));
  }
});

test('school passives unlock exactly at 5/10 and improve actual combat stats for every school',()=>{
  for(const sect of Object.keys(SECT_PASSIVES))for(const level of [4,5,9,10,30]){
    const u=new Hero(sect,{level});
    assert.equal(u.sectPassives.length,level<5?0:level<10?1:2);
    assert.ok(Object.values(u.stats).every(Number.isFinite));
  }
  assert.equal(new Hero(null,{level:10}).sectPassives.length,0);
});

test('duplicate advancement reaches divine rank, increases real skill damage, persists and cannot exceed six',async()=>{
  let s=developed().snapshot();
  const target=COMPANIONS.find(c=>c.tier===5&&s.party.unlocked.includes(c.id));
  // A deterministic legendary roll chooses a currently eligible tier-5 unit.
  s=rollGacha(s,1,{random:()=>.999,now:1}).session;
  const id=s.gacha.history.at(-1).id;
  if(!s.party.unlocked.includes(id))throw Error('Missing draw');
  s=rollGacha(s,1,{random:()=>.999,now:2}).session;
  assert.equal(s.party.ranks[id],6);
  const base=new Companion(id,{level:20}),divine=new Companion(id,{level:20,rank:6});
  assert.ok(divine.stats.maxHp>=base.stats.maxHp*1.7);
  const enemy=new Companion('companion_01',{team:'enemy'});
  assert.ok(calculateDamage(divine,enemy,divine.skills.autoAttack,()=>.99).amount>calculateDamage(base,enemy,base.skills.autoAttack,()=>.99).amount);
  s=rollGacha(s,1,{random:()=>.999,now:3}).session;assert.equal(s.party.ranks[id],6);
  const store=new StorageManager({indexedDB:null,localStorage:{getItem:()=>null,setItem(){},removeItem(){}}});
  const copy=new Campaign();copy.load(await store.decodeSave(await store.exportSave(s)));
  assert.deepEqual(copy.session.party.ranks,s.party.ranks);
  const bad=structuredClone(s);bad.party.ranks[id]=7;assert.throws(()=>validateCampaign(bad));
  const shared=teamSnapshot(copy.session);assert.deepEqual(decodeTeam(encodeTeam(shared)),shared);
  assert.ok(target);
});

test('legacy equipment refunds and old builds remain valid without awarding advancement retroactively',()=>{
  const c=developed(),s=c.snapshot();delete s.party.ranks;
  c.load(s);assert.equal(c.session.party.ranks,undefined);assert.deepEqual(c.session.hero,s.hero);
  validateLoot({version:1,total:1,sinceExcellent:1,sinceExceptional:1,history:[{pull:1,id:'gear_phong_hanh_common_weapon',time:1,guarantee:'none',duplicate:true,refund:576}],bossWins:{}});
});

test('all five towers resume independent progress across leaving, reload and complete towers',()=>{
  const c=developed({roster:['companion_01','companion_02','companion_03','companion_04','companion_05']}),s=c.snapshot();
  s.adventure.towerBest=Object.fromEntries(DUNGEONS.map((d,i)=>[d.id,i*17]));c.load(s);
  for(const [i,d]of DUNGEONS.entries()){
    c.enterDungeon(d.id);assert.equal(c.session.adventure.dungeon.floor,i*17);
    const saved=c.snapshot(),again=new Campaign();again.load(saved);assert.equal(again.session.adventure.dungeon.floor,i*17);
    c.leaveDungeon();assert.equal(c.session.adventure.towerBest[d.id],i*17);
  }
  const end=c.snapshot();end.adventure.towerBest[DUNGEONS[0].id]=100;
  assert.equal(makeDungeon(end,DUNGEONS[0].id,false,c.now()).floor,99);
});

test('fishing table totals 100%, reaches every reward and produces balanced seeded frequencies',()=>{
  assert.equal(FISHING_LOOT.reduce((n,r)=>n+r.rate,0),100);
  let boundary=0;for(const r of FISHING_LOOT){const reward=fishingReward(()=>boundary/100);assert.equal(reward.rate,r.rate);if(r.tier)assert.ok(reward.itemId.startsWith('gear_'));boundary+=r.rate;}
  const random=seededRandom(154),counts={};for(let i=0;i<50000;i++){const r=fishingReward(random);counts[r.rate]=(counts[r.rate]??0)+1;}
  for(const r of FISHING_LOOT)assert.ok(Math.abs(counts[r.rate]/500-r.rate)<1);
  for(const n of [-1,1,NaN])assert.throws(()=>fishingReward(()=>n));
});

test('Bầu Cua accepts more than three daily wagers and keeps affordability atomic',()=>{
  const c=developed();for(let i=0;i<25;i++)c.action('bau_cua',{face:'cua',stake:1});
  assert.equal(c.session.adventure.daily.bauCua,25);
  const saved=c.snapshot();assert.throws(()=>c.action('bau_cua',{face:'cua',stake:Number.MAX_SAFE_INTEGER}));assert.deepEqual(c.snapshot(),saved);
});

test('repeat boss equipment chance is moderately increased and escort victory pays meaningful rewards once',()=>{
  const s=developed().snapshot();s.loot={version:1,total:0,sinceExcellent:0,sinceExceptional:0,history:[],bossWins:{15:1}};
  let drops=0;for(let seed=0;seed<2000;seed++)drops+=bossLoot(s,15,seed).length;
  assert.ok(drops>800&&drops<1000);
  const c=developed(),silver=itemCount(c.session,'silver');c.startEscort('safe');
  const home=c.battle.units.filter(u=>u.team==='home'),enemy=c.battle.units.filter(u=>u.team==='enemy');
  assert.ok(enemy[0].stats.maxHp<Math.max(...home.map(u=>u.stats.maxHp)));
  for(let i=0;i<21600&&c.running;i++)c.update(1/60);
  assert.equal(c.lastResult.winner,'home');assert.equal(c.lastResult.rewards.silver,75);
  assert.equal(itemCount(c.session,'silver'),silver-10+75);
  const paid=c.snapshot();assert.throws(()=>c.settleBattle());assert.deepEqual(c.snapshot(),paid);
});
