import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {Campaign,createCampaign,validateCampaign,itemCount} from '../src/core/Campaign.js';
import {DAI_VIET_QUESTS} from '../src/data/DaiVietStoryData.js';
import {PLOT_UNLOCKS} from '../src/data/DaiVietCast.js';
import {createHeroBuild,allocateSkill,expToNextLevel,gainExperience} from '../src/entities/HeroBuild.js';
import {remainingEntries,validateEntries} from '../src/core/DungeonEntries.js';
import {Hero} from '../src/entities/Hero.js';
import {Companion} from '../src/entities/Companion.js';
import {CombatEngine} from '../src/combat/CombatEngine.js';
import {GridSystem} from '../src/combat/GridSystem.js';
import {EQUIPMENT} from '../src/data/EquipmentData.js';
import {gearArtPath,equipmentAura} from '../src/ui/GearArt.js';
import {continuityFor} from '../src/data/StoryContinuity.js';
import {SCENE_HANDOFFS} from '../src/data/SceneConsequences.js';
function late(){
 const s=createCampaign({story:'dai-viet',sect:'VoDang'}),i=DAI_VIET_QUESTS.findIndex(q=>q.id==='D19H18'),q=DAI_VIET_QUESTS[i],done=DAI_VIET_QUESTS.slice(0,i);
 s.hero=createHeroBuild({sect:'VoDang',level:20});s.storyProgress.completedQuests=done.map(q=>q.id);s.storyProgress.decisions=Object.fromEntries(done.map(q=>[q.id,q.id==='D19H12'?'friends':q.choices[0]?.id??'continue']));Object.assign(s.storyProgress,{activeQuestId:q.id,currentChapter:q.chapter,currentEpisode:q.episode,currentAct:q.act});
 s.inventory.find(i=>i.itemId==='silver').quantity=10000;
 for(const[id,m]of Object.entries(PLOT_UNLOCKS))if(s.storyProgress.completedQuests.includes(m)){s.party.unlocked.push(id);s.storyProgress.completedQuests.push('recruit_'+id.slice(-2));s.companionsAffinity[id]=15;}
 return s;
}
test('each dungeon shares two daily entries across regular/weekly, permits one paid extra, and rolls over in Vietnam without altering a resumed run',()=>{
 let now=Date.UTC(2026,10,6,16,59);const c=new Campaign({now:()=>now});c.load(late());
 c.enterDungeon('phong_nha');c.leaveDungeon();c.enterDungeon('phong_nha');c.leaveDungeon();assert.equal(remainingEntries(c.session,'phong_nha'),0);
 const before=c.snapshot();assert.throws(()=>c.enterDungeon('phong_nha'),/hết lượt/);assert.deepEqual(c.snapshot(),before);
 const silver=itemCount(c.session,'silver');c.buyDungeonEntry('phong_nha');assert.equal(itemCount(c.session,'silver'),silver-60);assert.equal(remainingEntries(c.session,'phong_nha'),1);assert.throws(()=>c.buyDungeonEntry('phong_nha'),/chỉ được mua/);
 c.enterDungeon('phong_nha');const saved=c.snapshot();c.load(saved);assert.equal(remainingEntries(c.session,'phong_nha'),0);assert.ok(c.session.adventure.dungeon);c.leaveDungeon();assert.throws(()=>c.enterDungeon('phong_nha'));
 now+=120000;c.enterDungeon('phong_nha');assert.equal(remainingEntries(c.session,'phong_nha'),1);assert.equal(c.session.adventure.daily.entryPurchases.phong_nha,undefined);assert.equal(remainingEntries(c.session,'hoa_lu'),2);
 const corrupt=c.snapshot();corrupt.adventure.daily.entries.phong_nha=3;assert.throws(()=>validateCampaign(corrupt));assert.throws(()=>validateEntries({entries:{boss_21:1}}));
});
test('chapter bosses consume one entry on start; retries/loading do not consume again and rejected entries never charge',()=>{
 const c=new Campaign({now:()=>1720000000000});c.load(late());
 for(let n=0;n<2;n++){c.startChapterBoss(1);const seed=c.battle.seed;const saved=c.snapshot();c.load(saved);c.retryEncounter();assert.equal(c.battle.seed,seed);assert.equal(remainingEntries(c.session,'boss_1'),1-n);c.retreat();}
 const before=c.snapshot();assert.throws(()=>c.startChapterBoss(1),/hết lượt/);assert.deepEqual(c.snapshot(),before);c.buyDungeonEntry('boss_1');c.startChapterBoss(1);c.retreat();assert.equal(remainingEntries(c.session,'boss_1'),0);assert.equal(remainingEntries(c.session,'boss_2'),2);
});
test('balanced ultimate shields its caster exactly once, never the enemy; all five builds remain legal',()=>{
 for(const sect of ['ThieuLam','VoDang','CaiBang','NgaMi','DuongMon']){
  let profile=createHeroBuild({sect,level:20});for(let tier=1;tier<=4;tier++)profile=allocateSkill(profile,`${sect}_t${tier}_balanced`,[]);
  assert.throws(()=>allocateSkill(profile,`${sect}_t4_attack`,[]));
  const hero=new Hero(sect,{profile}),enemy=new Companion('companion_06',{id:'enemy',team:'enemy',level:20}),grid=new GridSystem();grid.place(hero,{x:2,y:1});grid.place(enemy,{x:3,y:1});const battle=new CombatEngine({units:[hero,enemy],grid,seed:12});
  hero.stats.energy=100;const before=hero.shield;battle.resolveSkill(hero,enemy,hero.skills.ultimate,true);assert.ok(hero.shield>=before+hero.stats.maxHp*.2-1);assert.equal(enemy.shield,0);
 }
});
test('XP curve is unchanged before level eight, stretches late progression and preserves all old levels/points',()=>{
 assert.equal(expToNextLevel(7),700);assert.equal(expToNextLevel(8),864);assert.equal(expToNextLevel(19),3724);
 const old=createHeroBuild({sect:'VoDang',level:15});old.exp=1499;const after=gainExperience(old,1,[]);assert.equal(after.level,15);assert.equal(after.exp,1500);assert.equal(after.freeAttributePoints,28);
 const leveled=gainExperience(createHeroBuild({sect:'VoDang',level:8}),864,[]);assert.equal(leveled.level,9);assert.equal(leveled.freeAttributePoints,16);assert.equal(leveled.freeSkillPoints,9);
});
test('ten hero atlases and all fifty-four gear mappings point to repository assets with provenance',()=>{
 const manifests=['fighters/hero-manifest.json','gear/manifest.json'].map(p=>JSON.parse(readFileSync(new URL('../assets/images/'+p,import.meta.url))));assert.deepEqual(manifests.map(m=>m.length),[10,36]);
 for(const row of manifests.flat()){const file=new URL('../'+row.asset,import.meta.url);assert.ok(existsSync(file));assert.equal(createHash('sha256').update(readFileSync(file)).digest('hex'),row.sha256);assert.ok(row.prompt.length>100);}
 for(const item of EQUIPMENT)assert.ok(existsSync(new URL('../'+gearArtPath(item),import.meta.url)),item.id);
 assert.equal(equipmentAura({weapon:'gear_phong_hanh_exceptional_weapon'}).rank,4);
});
test('all four hundred main episodes have ordered causal milestones and time/place context; return scenes never inherit ancient commander timelines',()=>{
 assert.equal(SCENE_HANDOFFS.length,20);assert.ok(SCENE_HANDOFFS.every(lines=>lines.length===20));
 for(const q of DAI_VIET_QUESTS){const c=continuityFor(q);assert.ok(c.time&&c.place&&c.thread,q.id);assert.equal(c.stages.length,10);const reveal=c.stages.map(v=>v.at);assert.ok(reveal.every((v,i)=>v>=1&&v<=20&&(!i||v>=reveal[i-1])));assert.ok(c.stages.every(v=>v.text.length>30));}
 for(const q of DAI_VIET_QUESTS){assert.ok(q.handoff?.length>40,q.id);assert.ok((q.fullAftermath??q.fullLines).some(l=>l[1]===q.handoff),q.id);if(q.aftermath)assert.ok(!q.lines.some(l=>l[1]===q.handoff),q.id);}
 assert.equal(continuityFor(DAI_VIET_QUESTS.at(-1),{returning:true}),null);
});
