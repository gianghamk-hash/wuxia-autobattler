import test from 'node:test';
import {reinforceStoryParty} from './helpers/story-flow.js';
import assert from 'node:assert/strict';
import {storyRecruit7} from '../src/data/Recruitment7.js';
import {developed} from '../scripts/balance-campaign7.mjs';
import {Campaign,createCampaign,validateCampaign,itemCount} from '../src/core/Campaign.js';
import {DAI_VIET_QUESTS,DAI_VIET_BY_ID} from '../src/data/DaiVietStoryData.js';
import {EXPANSION_CAST,expansionAvailable} from '../src/data/ExpansionCast.js';
import {EXPANSION_SCENES} from '../src/data/ExpansionStory.js';
import {PLOT_UNLOCKS,storyPoolAllows} from '../src/data/DaiVietCast.js';
import {COMPANIONS_BY_ID} from '../src/data/CompanionsData.js';
import {rollGacha} from '../src/core/Gacha.js';
import {drawEquipment,validateLoot,chapterBossAvailable,bossLoot,chapterBossRewards} from '../src/core/Loot.js';
import {NEW_GEAR,GEAR_RARITIES} from '../src/data/GearCatalog.js';
import {Hero} from '../src/entities/Hero.js';
import {createHeroBuild,equipItem,allocateAttribute,allocateSkill} from '../src/entities/HeroBuild.js';
import {SKILL_TREES} from '../src/data/SkillTreeData.js';
import {StorageManager} from '../src/core/StorageManager.js';
const fresh=()=>{const c=new Campaign({now:()=>1720000000000});c.newGame({story:'dai-viet',sect:'VoDang',name:'Minh An'});return c;};
function at(id='D19H18'){
 const s=createCampaign({story:'dai-viet',sect:'VoDang',name:'Minh An'}),i=DAI_VIET_QUESTS.findIndex(q=>q.id===id),q=DAI_VIET_QUESTS[i],done=DAI_VIET_QUESTS.slice(0,i);
 s.hero=createHeroBuild({name:'Minh An',sect:'VoDang',level:20});s.storyProgress.completedQuests=done.map(q=>q.id);s.storyProgress.decisions=Object.fromEntries(done.map(q=>[q.id,q.id==='D19H12'?'friends':q.choices[0]?.id??'continue']));Object.assign(s.storyProgress,{activeQuestId:id,currentChapter:q.chapter,currentEpisode:q.episode,currentAct:q.act});
 s.inventory.find(i=>i.itemId==='silver').quantity=100000;
 s.party.unlocked=['companion_05','companion_03','companion_04','companion_06','companion_12'];s.party.active=[...s.party.unlocked];
 for(const[cid,m]of Object.entries(PLOT_UNLOCKS))if(s.storyProgress.completedQuests.includes(m)){s.party.unlocked.push(cid);s.storyProgress.completedQuests.push('recruit_'+cid.slice(-2));}
 s.companionsAffinity=Object.fromEntries(s.party.unlocked.map(id=>[id,15]));s.party.formation=Object.fromEntries(['hero',...s.party.active].map((id,i)=>[id,[{x:1,y:1},{x:2,y:1},{x:0,y:1},{x:0,y:0},{x:1,y:2},{x:2,y:0}][i]]));
 return s;
}
function fight(c){reinforceStoryParty(c);for(let i=0;i<22500&&c.running;i++)c.update(1/60);assert.equal(c.running,false);return c.lastResult;}
test('ten new companions have two per rarity and recurring concrete main-story scenes; unlocking waits for the first encounter',()=>{
 assert.equal(EXPANSION_CAST.length,10);for(let tier=1;tier<=5;tier++)assert.equal(EXPANSION_CAST.filter(p=>p.tier===tier).length,2);
 for(const p of EXPANSION_CAST){assert.ok(COMPANIONS_BY_ID[p.id]);const appearances=Object.entries(EXPANSION_SCENES).filter(([,lines])=>lines.some(l=>l[0]===p.name));assert.ok(appearances.length>=3,p.name);assert.equal(appearances[0][0],p.meet,p.name);assert.ok(Object.entries(EXPANSION_SCENES).some(([id,lines])=>Number(id.slice(1,3))>=17&&lines.some(l=>l[0]===p.name||l[1].includes(p.name))),p.name);
  const c=fresh(),met=at(p.meet);for(const n of SKILL_TREES.VoDang.filter(n=>n.branch==='attack')){try{met.hero=allocateSkill(met.hero,n.id,met.inventory);}catch{}}while(met.hero.freeAttributePoints)met.hero=allocateAttribute(met.hero,'khiHai',met.inventory);met.adventure.training=10;met.adventure.forging=10;c.load(met);assert.equal(expansionAvailable(c.session,p.id),false);assert.equal(storyPoolAllows(c.session,p.id),false);assert.ok(!c.availableRecruitQuests().some(q=>q.companionId===p.id));
  const bad=c.snapshot();bad.party.unlocked.push(p.id);bad.companionsAffinity[p.id]=15;assert.throws(()=>validateCampaign(bad));if(c.chooseMain('continue'))assert.equal(fight(c).winner,'home');assert.equal(expansionAvailable(c.session,p.id),true);assert.equal(c.availableRecruitQuests().length,0);assert.equal(c.session.party.unlocked.includes(p.id),Boolean(storyRecruit7(p.id)));if(storyRecruit7(p.id))continue;
  const pool=Object.values(COMPANIONS_BY_ID).filter(u=>u.tier===p.tier&&storyPoolAllows(c.session,u.id)),values=[[0,.25,.64,.85,.96,.995][p.tier],(pool.findIndex(u=>u.id===p.id)+.1)/pool.length];const drawn=rollGacha(c.snapshot(),1,{random:()=>values.shift(),now:1});assert.equal(drawn.results[0].id,p.id);assert.equal(drawn.results[0].tier,p.tier);
 }
});
test('canonical side recruitment cannot bypass the story/gacha ownership rules',()=>{
 const c=fresh();c.load(at('D04H01'));const before=c.snapshot();assert.equal(c.availableRecruitQuests().length,0);assert.throws(()=>c.challengeRecruit('recruit_51'));assert.throws(()=>c.recruit('recruit_60'));assert.deepEqual(c.snapshot(),before);
});

test('equipment draws spend atomically, retain independent pity, and meet both real guarantees',()=>{
 const s=at(),before=structuredClone(s);assert.equal(GEAR_RARITIES.reduce((sum,r)=>sum+r.rate,0),100);assert.equal(NEW_GEAR.length,80);
 const ten=drawEquipment(s,5,{random:()=>0,now:1});assert.equal(itemCount(ten.session,'silver'),itemCount(s,'silver')-400+ten.refund);assert.equal(ten.refund,256);assert.equal(ten.results.length,5);assert.equal(NEW_GEAR.find(e=>e.id===ten.results.at(-1).id).rarity,'common');assert.deepEqual(ten.session.gacha,s.gacha);assert.deepEqual(ten.session.hero,s.hero);assert.deepEqual(s,before);
 let next=s;for(let i=0;i<50;i++)next=drawEquipment(next,1,{random:()=>0,now:i}).session;assert.equal(NEW_GEAR.find(e=>e.id===next.loot.history.at(-1).id).rarity,'exceptional');validateLoot(next.loot);
 assert.throws(()=>drawEquipment(s,5,{random:()=>NaN}));assert.deepEqual(s,before);const poor=structuredClone(s);poor.inventory.find(i=>i.itemId==='silver').quantity=89;const balance=structuredClone(poor);assert.throws(()=>drawEquipment(poor,1));assert.deepEqual(poor,balance);
 const bad=structuredClone(next);bad.loot.sinceExceptional=50;assert.throws(()=>validateCampaign(bad));
});
test('sets activate actual two/three-slot bonuses across rarities without counting spare copies or leaking stats after removal',()=>{
 const s=at(),family='thiet_ve',items=NEW_GEAR.filter(e=>e.setId===family),find=(slot,rarity)=>items.find(e=>e.slot===slot&&e.rarity===rarity);for(const item of items)s.inventory.push({itemId:item.id,quantity:3});
 const weapon=find('weapon','common'),armor=find('armor','rare'),accessory=find('accessory','excellent');let h=equipItem(s.hero,'weapon',weapon.id,s.inventory);let one=new Hero(h.sect,{profile:h,inventory:s.inventory});assert.equal(one.activeEquipmentSets.length,0);
 h=equipItem(h,'armor',armor.id,s.inventory);const two=new Hero(h.sect,{profile:h,inventory:s.inventory});assert.deepEqual(two.activeEquipmentSets,['thiet_ve_2']);assert.equal(two.stats.maxHp,one.stats.maxHp+(armor.stats.maxHp+150)*1.15);
 h=equipItem(h,'accessory',accessory.id,s.inventory);const three=new Hero(h.sect,{profile:h,inventory:s.inventory});assert.deepEqual(three.activeEquipmentSets,['thiet_ve_2','thiet_ve_3']);assert.ok(three.stats.blockRate>two.stats.blockRate);
 h=equipItem(h,'accessory',null,s.inventory);assert.deepEqual(new Hero(h.sect,{profile:h,inventory:s.inventory}).stats,two.stats);assert.throws(()=>equipItem(h,'weapon',armor.id,s.inventory));
});
test('story equipment arrives once and completed old saves are not retroactively rewarded',()=>{
 const c=fresh();c.load(at('D03H10'));const id='gear_thiet_ve_common_armor';assert.equal(itemCount(c.session,id),0);if(c.chooseMain('continue'))assert.equal(fight(c).winner,'home');assert.equal(itemCount(c.session,id),1);const paid=c.snapshot();c.load(paid);assert.equal(itemCount(c.session,id),1);if(c.chooseMain('continue'))assert.equal(fight(c).winner,'home');assert.equal(itemCount(c.session,id),1);
 const old=at('D05H01');delete old.loot;c.load(old);assert.equal(itemCount(c.session,'gear_phong_hanh_rare_weapon'),0);
});
test('boss checkpoint reloads with the same seed and gear; a result settles only once, loss awards nothing',async()=>{
 const c=fresh();c.load(at('D05H01'));assert.equal(chapterBossAvailable(c.session,4),true);assert.equal(chapterBossAvailable(c.session,5),false);assert.throws(()=>c.startChapterBoss(5));const active=c.mainQuest().id;c.startChapterBoss(4);const seed=c.battle.seed;
 const storage=new StorageManager({indexedDB:null,localStorage:{getItem:()=>null,setItem(){},removeItem(){}}}),saved=await storage.decodeSave(await storage.exportSave(c.snapshot())),copy=fresh();copy.load(saved);copy.retryEncounter();assert.equal(copy.battle.seed,seed);
 const before=itemCount(c.session,'silver'),expected=chapterBossRewards(c.session,4),r=fight(c),r2=fight(copy);assert.equal(r.winner,'home');assert.deepEqual(r.rewards,r2.rewards);assert.equal(r.rewards.gear.length,1);assert.equal(itemCount(c.session,'silver'),before+expected.silver);assert.ok(expected.silver<24);assert.equal(c.mainQuest().id,active);const paid=c.snapshot();assert.throws(()=>c.settleBattle());assert.deepEqual(c.snapshot(),paid);
 c.startChapterBoss(4);const wallet=itemCount(c.session,'silver');for(const u of c.battle.units.filter(u=>u.team==='home'))u.stats.hp=0;const loss=fight(c);assert.equal(loss.winner,'enemy');assert.equal(itemCount(c.session,'silver'),wallet);assert.equal(c.session.loot.bossWins[4],1);
});
test('the ten archived recruitment missions remain data-compatible but cannot grant canonical gacha exclusives',()=>{
 const c=fresh();c.load(at());for(const p of EXPANSION_CAST){const before=c.snapshot();assert.throws(()=>c.challengeRecruit('recruit_'+p.id.slice(-2)));assert.deepEqual(c.snapshot(),before);}
});

test('all twenty chapter bosses preserve post-ending entry and first-clear rewards with a controlled victory fixture',()=>{
 const c=fresh(),s=at('D20H20'),max=developed().snapshot();s.party=max.party;s.companionsAffinity=max.companionsAffinity;
 for(const item of NEW_GEAR.filter(e=>e.setId==='phong_hanh'&&e.rarity==='exceptional'))s.inventory.push({itemId:item.id,quantity:1});
 let h=s.hero;while(h.freeAttributePoints)h=allocateAttribute(h,'khiHai',s.inventory);for(const node of SKILL_TREES.VoDang.filter(n=>n.branch==='attack')){try{h=allocateSkill(h,node.id,s.inventory);}catch{}}
 for(const item of NEW_GEAR.filter(e=>e.setId==='phong_hanh'&&e.rarity==='exceptional'))h=equipItem(h,item.slot,item.id,s.inventory);s.hero=h;s.adventure.training=10;s.adventure.forging=10;c.load(s);c.chooseEnding('home');
 for(let chapter=1;chapter<=20;chapter++){c.startChapterBoss(chapter);const r=fight(c);assert.equal(r.winner,'home','boss '+chapter);assert.equal(r.rewards.gear.length,1);if(chapter>=19)assert.equal(NEW_GEAR.find(e=>e.id===r.rewards.gear[0]).rarity,'exceptional');assert.equal(c.session.storyProgress.endingId,'home');assert.equal(c.mainQuest(),null);}
 assert.equal(Object.keys(c.session.loot.bossWins).length,20);validateCampaign(c.snapshot());
});
