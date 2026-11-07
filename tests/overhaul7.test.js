import {reinforceStoryParty} from './helpers/story-flow.js';
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {Campaign,validateCampaign,itemCount} from '../src/core/Campaign.js';
import {COMPANIONS,COMPANIONS_BY_ID} from '../src/data/CompanionsData.js';
import {STORY_RECRUITS7,storyRecruit7} from '../src/data/Recruitment7.js';
import {DAI_VIET_QUESTS} from '../src/data/DaiVietStoryData.js';
import {storyPoolAllows} from '../src/data/DaiVietCast.js';
import {SKILL_TREES} from '../src/data/SkillTreeData.js';
import {EQUIPMENT,EQUIPMENT_SETS} from '../src/data/EquipmentData.js';
import {NEW_GEAR} from '../src/data/GearCatalog.js';
import {Hero} from '../src/entities/Hero.js';
import {Companion} from '../src/entities/Companion.js';
import {createHeroBuild,equipItem,normalizeHeroBuild} from '../src/entities/HeroBuild.js';
import {CombatEngine} from '../src/combat/CombatEngine.js';
import {GridSystem} from '../src/combat/GridSystem.js';
import {ELEMENTS,elementMultiplier} from '../src/data/StrategyData.js';
import {rollGacha} from '../src/core/Gacha.js';
import {developed,fight} from '../scripts/balance-campaign7.mjs';
import {fighterKey,fighterURL,sceneFor} from '../src/data/PresentationData.js';
import {SKILL_VISUALS} from '../src/data/SkillVisualsData.js';
import {give,worldAction} from '../src/core/WorldProgress.js';
import {heroText} from '../src/data/HeroIdentity.js';
import {bossSequence} from '../src/combat/BattleRules6.js';
import {applyStoryIdentity,NPCS_BY_ID} from '../src/data/NPCData.js';

test('exactly 15 main-story companions include exactly one highest-rarity hero; all others are gacha-only',()=>{
 assert.equal(STORY_RECRUITS7.length,15);assert.equal(new Set(STORY_RECRUITS7.map(p=>p.id)).size,15);
 const grants=DAI_VIET_QUESTS.filter(q=>q.recruitCompanion);assert.equal(grants.length,15);
 assert.deepEqual(grants.map(q=>q.recruitCompanion).sort(),STORY_RECRUITS7.map(p=>p.id).sort());
 assert.equal(STORY_RECRUITS7.filter(p=>COMPANIONS_BY_ID[p.id].tier===5).length,1);
 const c=developed(),s=c.snapshot();assert.equal(c.availableRecruitQuests().length,0);
 assert.equal(COMPANIONS.filter(p=>storyPoolAllows(s,p.id)).length,45);
 for(const p of COMPANIONS)assert.equal(storyPoolAllows(s,p.id),!storyRecruit7(p.id));
});

test('each of the 15 actual story encounters grants its companion once, with no duplicate currency or copies on reload',()=>{
 for(const person of STORY_RECRUITS7){const c=developed(),s=c.snapshot(),at=DAI_VIET_QUESTS.findIndex(q=>q.id===person.meet),q=DAI_VIET_QUESTS[at],done=DAI_VIET_QUESTS.slice(0,at);
  Object.assign(s.storyProgress,{completedQuests:done.map(q=>q.id),decisions:Object.fromEntries(done.map(q=>[q.id,q.choices[0]?.id??'continue'])),activeQuestId:q.id,currentChapter:q.chapter,currentEpisode:q.episode,currentAct:q.act,endingId:null});
  for(const p of STORY_RECRUITS7.filter(p=>done.some(q=>q.id===p.meet))){if(!s.party.unlocked.includes(p.id))s.party.unlocked.push(p.id);s.companionsAffinity[p.id]=15;s.storyProgress.completedQuests.push('recruit_'+p.id.slice(-2));}
  s.party.unlocked=s.party.unlocked.filter(id=>id!==person.id&&(s.party.active.includes(id)||STORY_RECRUITS7.some(p=>p.id===id&&done.some(q=>q.id===p.meet))));s.companionsAffinity=Object.fromEntries(s.party.unlocked.map(id=>[id,15]));c.load(s);assert.ok(!c.session.party.unlocked.includes(person.id));
  if(c.chooseMain(q.choices[0].id)){reinforceStoryParty(c);assert.equal(fight(c).winner,'home',q.id);}
  assert.equal(c.session.party.unlocked.filter(id=>id===person.id).length,1,q.id);const paid=c.snapshot();c.load(paid);assert.deepEqual(c.snapshot(),paid);validateCampaign(c.snapshot());
 }
});

test('all 45 exclusive companions can actually be rolled, including pity interruptions, and none of the 15 enter the canonical pool',()=>{
 let s=developed().snapshot();s.inventory.find(i=>i.itemId==='silver').quantity=100000;
 for(const target of COMPANIONS.filter(p=>!storyRecruit7(p.id))){let found=false;for(let attempt=0;attempt<3&&!found;attempt++){const pool=COMPANIONS.filter(p=>p.tier===target.tier&&storyPoolAllows(s,p.id));const values=[[0,.25,.64,.85,.96,.995][target.tier],(pool.findIndex(p=>p.id===target.id)+.1)/pool.length];const draw=rollGacha(s,1,{random:()=>values.shift(),now:1});s=draw.session;assert.ok(!storyRecruit7(draw.results[0].id));found=draw.results[0].id===target.id;}assert.ok(found,target.id);}
 const c=new Campaign();c.load(s);validateCampaign(c.snapshot());
});

test('an older save retains all owned gacha-exclusive heroes and its equipment when the new acquisition rules load',()=>{
 const c=developed(),s=c.snapshot();s.party.unlocked=COMPANIONS.map(p=>p.id);s.companionsAffinity=Object.fromEntries(s.party.unlocked.map(id=>[id,15]));const wallet=structuredClone(s.inventory);c.load(s);assert.equal(c.session.party.unlocked.length,60);assert.deepEqual(c.session.inventory,wallet);const once=c.snapshot();c.load(once);assert.deepEqual(c.snapshot(),once);
});

test('60 independently authored kits resolve without invalid stats and expose descriptions, biographies and unique skill mechanics',()=>{
 const signatures=new Set();for(const p of COMPANIONS){assert.ok(p.biography.length>80);for(const skill of Object.values(p.skills)){assert.ok(skill.name&&skill.description.length>30);assert.ok(existsSync(skill.icon));}
  const u=p.skills.ultimate;signatures.add(JSON.stringify([u.type,u.targetType,u.dmgMultiplier,u.effects]));assert.ok(u.energyCost>=85&&u.energyCost<=100);
  const caster=new Companion(p.id,{level:8}),hero=new Hero('VoDang',{level:8}),enemies=[0,1,2].map(i=>new Companion('companion_05',{id:'target_'+i,team:'enemy',level:8})),grid=new GridSystem();[caster,hero,...enemies].forEach((unit,i)=>grid.place(unit,[{x:2,y:1},{x:1,y:1},{x:3,y:1},{x:4,y:1},{x:5,y:1}][i]));for(const e of enemies){e.stats.maxHp=e.stats.hp=50000;e.stats.dodgeRate=e.stats.blockRate=0;}hero.stats.hp*=.5;caster.stats.energy=100;
  const battle=new CombatEngine({units:[caster,hero,...enemies],grid,seed:28});battle.start();const target=battle.chooseTarget(caster,caster.skills.ultimate,false);assert.ok(target,p.id);battle.resolveSkill(caster,target,caster.skills.ultimate,true);for(const unit of battle.units)assert.ok(Object.values(unit.stats).every(Number.isFinite),p.id);
 }assert.equal(signatures.size,60);
});

test('four equipment slots migrate without changing old bonuses; full new and sect sets stack at the stated milestones with finite stats',()=>{
 const old=createHeroBuild({sect:'VoDang',level:20});delete old.equippedGear.helmet;const migrated=normalizeHeroBuild(old,[]);assert.equal(migrated.equippedGear.helmet,null);assert.deepEqual(migrated.attributes,old.attributes);
 for(const family of new Set(NEW_GEAR.map(e=>e.setId))){const items=NEW_GEAR.filter(e=>e.setId===family&&e.rarity==='exceptional'),inventory=items.map(e=>({itemId:e.id,quantity:1}));let h=createHeroBuild({sect:'VoDang',level:20});for(const item of items)h=equipItem(h,item.slot,item.id,inventory);const hero=new Hero('VoDang',{profile:h,inventory});assert.deepEqual(hero.activeEquipmentSets,[family+'_2',family+'_3',family+'_4']);assert.ok(Object.values(hero.stats).every(Number.isFinite));const full=hero.stats.maxHp;h=equipItem(h,'helmet',null,inventory);const three=new Hero('VoDang',{profile:h,inventory});assert.ok(three.stats.maxHp<full);assert.equal(three.activeEquipmentSets.length,2);}
 assert.equal(EQUIPMENT.length,104);assert.equal(EQUIPMENT_SETS.length,25);
});

test('all 60 portraits have their own six-pose battle model; boss minions never borrow the final villain identity',()=>{
 for(const p of COMPANIONS){const u=new Companion(p.id);assert.equal(u.portrait,p.portrait);assert.equal(fighterKey(u),p.id);assert.ok(existsSync(new URL(fighterURL(p.id))));}
 assert.equal(fighterKey({canon:'dai-viet',storyActorId:'cao_le',characterId:'boss_captain'}),'boss_captain');assert.equal(fighterKey({canon:'dai-viet',storyActorId:'cao_le',characterId:'doc_le'}),'cao_le');
});

test('all rendered art manifests have current hashes, alpha-safe models and no local machine paths',()=>{
 const files=['characters7-manifest.json','art7-manifest.json'];const seen=new Set();for(const file of files){const records=JSON.parse(readFileSync('assets/images/'+file,'utf8'));assert.ok(records.length>=54);for(const r of records){assert.ok(r.prompt.length>100);if(r.reference){assert.ok(!r.reference.includes('C:'));assert.ok(existsSync(r.reference));}for(const asset of r.assets){assert.ok(!seen.has(asset.file),asset.file);seen.add(asset.file);assert.equal(createHash('sha256').update(readFileSync(asset.file)).digest('hex'),asset.sha256,asset.file);}}}
 const qa=JSON.parse(readFileSync('assets/images/art7-qa.json','utf8'));assert.equal(qa.length,80);assert.ok(qa.every(r=>r.alphaMin===0&&r.clearRatio>.1));
 for(const profile of SKILL_VISUALS){assert.ok(profile.image,profile.id);assert.ok(existsSync(profile.image),profile.id);}for(const node of Object.values(SKILL_TREES).flat())assert.ok(existsSync(node.icon),node.id);
});

test('each chapter uses its new distinct backdrop and the modern prologue/homecoming use separate scenes',()=>{
 const urls=new Set();for(let chapter=1;chapter<=20;chapter++){const q=DAI_VIET_QUESTS.find(q=>q.chapter===chapter&&q.episode===2),url=sceneFor(q);assert.match(url,/chapters7\/chapter\d{2}\.webp$/);assert.ok(existsSync(new URL(url)));urls.add(url);}assert.equal(urls.size,20);assert.match(sceneFor(DAI_VIET_QUESTS[0]),/modern_set/);assert.match(sceneFor({canon:'dai-viet',chapter:20,scene:'modern'}),/modern_home/);
});

test('rope surveys consume the displayed item, respect the daily limit, reset in Vietnam time and do not farm XP',()=>{
 const c=developed(),s=c.snapshot(),now=Date.UTC(2026,10,6,5);give(s,'rope',3);const before={rope:itemCount(s,'rope'),ore:itemCount(s,'ore'),herb:itemCount(s,'herb'),hero:structuredClone(s.hero)};worldAction(s,'salvage',undefined,now);worldAction(s,'salvage',undefined,now);assert.equal(itemCount(s,'rope'),before.rope-2);assert.equal(itemCount(s,'ore'),before.ore+2);assert.equal(itemCount(s,'herb'),before.herb+2);assert.deepEqual(s.hero,before.hero);const paid=structuredClone(s);assert.throws(()=>worldAction(s,'salvage',undefined,now));assert.deepEqual(s,paid);worldAction(s,'salvage',undefined,now+86400000);assert.equal(s.adventure.daily.salvage,1);
});

test('strong elemental counterplay remains directional and neutral damage is unchanged',()=>{
 for(const [element,data]of Object.entries(ELEMENTS)){assert.equal(elementMultiplier({element},{element:data.beats}),1.75);assert.equal(elementMultiplier({element:data.beats},{element}),.6);assert.equal(elementMultiplier({element},{element}),1);}assert.equal(elementMultiplier({element:null},{element:'Kim'}),1);
});

test('renaming the hero preserves Truy Phong, Phong Trần Lãng Khách and Phong Nha as separate proper names',()=>{
 const s=developed().snapshot();s.hero.name='Lan An';assert.equal(heroText('Truy Phong và Phong Trần Lãng Khách dẫn Phong qua Phong Nha.',s),'Truy Phong và Phong Trần Lãng Khách dẫn Lan An qua Phong Nha.');
});

test('the final Cao Lệ model uses his own fire general signature only in the final boss phase',()=>{
 const enemies=[0,1,2,3].map(i=>new Companion('companion_05',{id:'enemy_'+i,team:'enemy'}));for(const unit of enemies)applyStoryIdentity(unit,NPCS_BY_ID.tay_sai);applyStoryIdentity(enemies[3],NPCS_BY_ID.doc_le);const next=bossSequence(enemies,18);assert.ok(enemies.every(unit=>unit.skills.ultimate.id!=='npc_doc_le_ult'));const final=next(3);assert.equal(final[0].skills.ultimate.id,'npc_doc_le_ult');assert.equal(final[0].element,'Hoa');assert.equal(fighterKey(final[0]),'cao_le');assert.ok(final.slice(1).every(unit=>unit.skills.ultimate.id!=='npc_doc_le_ult'));
});


test('balanced tier-4 descriptions describe their actual area strike and self shield instead of an inherited base ultimate',()=>{for(const nodes of Object.values(SKILL_TREES)){const n=nodes.find(n=>n.tier===4&&n.branch==='balanced');assert.match(n.ultimate.description,/160%/);assert.match(n.ultimate.description,/20%/);assert.match(n.ultimate.description,/đánh vùng/);assert.ok(!n.ultimate.description.includes('hồi máu'));}});

test('an older saved recruitment battle can resume and settle without granting a now-exclusive gacha character or trapping progress',()=>{
 const original=developed(),saved=original.snapshot();original._pending(saved,'recruit','recruit_60');const c=new Campaign({now:()=>1720000000000});c.load(saved);c.retryEncounter();assert.equal(c.battle.seed,saved.storyProgress.pendingEncounter.seed);assert.equal(fight(c).winner,'home');assert.equal(c.session.storyProgress.pendingEncounter,null);assert.ok(!c.session.party.unlocked.includes('companion_60'));assert.throws(()=>c.recruit('recruit_60'));c.chooseEnding('justice');validateCampaign(c.snapshot());
});

test('a genuinely new untrained hero can reach enrollment using earned story levels and the authored guides; opening punches have their own image',()=>{
 const c=new Campaign({now:()=>1720000000000});c.newGame({story:'dai-viet',name:'Lan An'});let fights=0;
 for(let guard=0;guard<40&&c.mainQuest().id!=='D02H10';guard++){const q=c.mainQuest();if(c.chooseMain(q.choices[0].id)){const hero=c.battle.units.find(u=>u.id==='hero');if(q.chapter===1){assert.equal(hero.skills.autoAttack.id,'untrained_attack');assert.ok(hero.skills.autoAttack.icon);assert.ok(SKILL_VISUALS.some(p=>p.skillId===hero.skills.autoAttack.id));}assert.equal(fight(c).winner,'home',q.id);fights++;}}
 assert.equal(c.mainQuest().id,'D02H10');assert.equal(c.session.hero.sect,null);assert.ok(fights>=10);
});

test('old saves receive already-earned story-only companions once, without currency, XP, equipment or active-formation changes',()=>{
 const source=developed().snapshot();const keep=[...source.party.active];source.party.unlocked=[...keep];source.companionsAffinity=Object.fromEntries(keep.map(id=>[id,77]));source.storyProgress.completedQuests=source.storyProgress.completedQuests.filter(id=>!id.startsWith('recruit_'));const inventory=structuredClone(source.inventory),hero=structuredClone(source.hero),active=structuredClone(source.party.active),formation=structuredClone(source.party.formation);const c=new Campaign();c.load(source);
 for(const p of STORY_RECRUITS7)assert.ok(c.session.party.unlocked.includes(p.id));assert.equal(c.session.party.unlocked.length,20);assert.deepEqual(c.session.inventory,inventory);assert.deepEqual(c.session.hero,hero);assert.deepEqual(c.session.party.active,active);assert.deepEqual(c.session.party.formation,formation);for(const id of keep)assert.equal(c.session.companionsAffinity[id],77);const once=c.snapshot();c.load(once);assert.deepEqual(c.snapshot(),once);
});
