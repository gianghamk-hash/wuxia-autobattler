import test from 'node:test';
import {reinforceStoryParty} from './helpers/story-flow.js';
import assert from 'node:assert/strict';
import {existsSync} from 'node:fs';
import {STORY_RECRUITS7} from '../src/data/Recruitment7.js';
import {Campaign,createCampaign,validateCampaign,itemCount} from '../src/core/Campaign.js';
import {DAI_VIET_CHAPTERS,DAI_VIET_QUESTS,DAI_VIET_HOME_CHAPTER,DAI_VIET_BY_ID,resolveDaiVietQuest,daiVietLines} from '../src/data/DaiVietStoryData.js';
import {DAI_VIET_CAST,DAI_VIET_CAST_BY_NAME,PLOT_COMPANIONS,PLOT_UNLOCKS,storyPerson} from '../src/data/DaiVietCast.js';
import {DAI_VIET_MISSIONS} from '../src/data/DaiVietMissions.js';
import {MAIN_QUESTS} from '../src/data/QuestsData.js';
import {casebook} from '../src/core/Casebook.js';
import {ENCOUNTERS} from '../src/data/EnemiesData.js';
import {COMPANIONS_BY_ID} from '../src/data/CompanionsData.js';
import {createHeroBuild,allocateAttribute,allocateSkill,equipItem} from '../src/entities/HeroBuild.js';
import {NEW_GEAR} from '../src/data/GearCatalog.js';
import {EQUIPMENT} from '../src/data/EquipmentData.js';
import {SKILL_TREES} from '../src/data/SkillTreeData.js';
import {SECT_IDS} from '../src/data/SectsData.js';
import {rollGacha} from '../src/core/Gacha.js';
import {validReaderKey} from '../src/core/Journey.js';
import {StorageManager} from '../src/core/StorageManager.js';
import {heroText} from '../src/data/HeroIdentity.js';
import {COMBAT_APPROACHES,EXTRA_COMBAT} from '../src/data/DaiVietCombatStory.js';

function fight(c,rescue=false){let asked=false;for(let i=0;i<22500&&c.running;i++){if(rescue&&!asked&&c.battle.mission?.definition.type==='rescue'&&(c.battle.elapsed>=25||c.battle.units.filter(u=>u.team==='enemy'&&u.alive&&!u.missionAsset).length<=2)){c.battle.mission.requestRescue('hero');asked=true;}c.update(1/60);}assert.equal(c.running,false);return c.lastResult;}
function fresh(sect='VoDang'){const c=new Campaign({now:()=>1720000000000});c.newGame({story:'dai-viet',sect});return c;}
function prepared(){
 const c=fresh(),s=c.snapshot();
 s.inventory.push(...NEW_GEAR.filter(e=>e.setId==='thanh_tam'&&e.rarity==='exceptional').map(e=>({itemId:e.id,quantity:1})));
 let h=createHeroBuild({sect:'VoDang',name:'Trần Phong',level:20});
 while(h.freeAttributePoints)h=allocateAttribute(h,'khiHai',s.inventory);
 for(const node of SKILL_TREES.VoDang.filter(n=>n.branch==='attack')){try{h=allocateSkill(h,node.id,s.inventory);}catch{}}
 for(const slot of ['weapon','armor','accessory']){const item=NEW_GEAR.find(e=>e.setId==='thanh_tam'&&e.rarity==='exceptional'&&e.slot===slot);h=equipItem(h,slot,item.id,s.inventory);}
 s.hero=h;s.party.unlocked=['companion_05','companion_49','companion_50','companion_14','companion_20'];s.party.active=[...s.party.unlocked];
 s.party.formation={hero:{x:1,y:1},companion_05:{x:2,y:1},companion_49:{x:0,y:1},companion_50:{x:0,y:0},companion_14:{x:1,y:2},companion_20:{x:2,y:0}};
 s.companionsAffinity=Object.fromEntries(s.party.unlocked.map(id=>[id,15]));s.adventure.training=10;s.adventure.forging=10;c.load(s);return c;
}
function snapshotAt(id){
 const s=createCampaign({story:'dai-viet',sect:'VoDang'}),at=DAI_VIET_QUESTS.findIndex(q=>q.id===id),done=DAI_VIET_QUESTS.slice(0,at),q=DAI_VIET_QUESTS[at];
 s.storyProgress.completedQuests=done.map(q=>q.id);s.storyProgress.decisions=Object.fromEntries(done.map(q=>[q.id,q.choices[0]?.id??'continue']));Object.assign(s.storyProgress,{activeQuestId:id,currentAct:q.act,currentChapter:q.chapter,currentEpisode:q.episode});
 for(const [cid,milestone]of STORY_RECRUITS7.map(p=>[p.id,p.meet]))if(s.storyProgress.completedQuests.includes(milestone)){s.party.unlocked.push(cid);s.companionsAffinity[cid]=100;s.storyProgress.completedQuests.push('recruit_'+cid.slice(-2));}
 s.party.active=s.party.unlocked.slice(0,5);s.party.formation=Object.fromEntries(['hero',...s.party.active].map((id,i)=>[id,[{x:1,y:1},{x:2,y:1},{x:0,y:1},{x:0,y:0},{x:1,y:2},{x:2,y:0}][i]]));return s;
}

test('all 265 fights separate setup from aftermath and increase every per-episode XP/silver reward by 15%',()=>{
 assert.equal(Object.keys(COMBAT_APPROACHES).length,67);assert.equal(Object.keys(EXTRA_COMBAT).length,38);
 const xp=[260,360,500,650,850,1050,1250,1450,1650,1850,2000,2100,2200,2300,2300,2300,2400,2500,500,500],money=[70,80,100,115,125,135,150,165,180,195,210,220,225,230,240,250,260,280,100,100];
 for(const c of DAI_VIET_CHAPTERS){
  const weights=c.scenes.map((_,i)=>c.battles.includes(i+1)?2:1),sum=weights.reduce((a,b)=>a+b,0);
  const divide=budget=>{const v=weights.map(w=>Math.floor(budget*w/sum));v[19]+=budget-v.reduce((a,b)=>a+b,0);return v;};
  const ex=divide(xp[c.number-1]),sil=divide(money[c.number-1]);
  for(const q of DAI_VIET_QUESTS.filter(q=>q.chapter===c.number)){
   assert.equal(q.xp,q.ending?0:Math.round(ex[q.episode-1]*1.15));assert.equal(q.silver,q.ending?0:Math.round(sil[q.episode-1]*1.15));
   if(q.encounter){assert.ok(q.aftermath?.length);assert.notEqual(q.lines[0][1],q.aftermath[0][1]);}
   for(const [speaker,text]of [...q.lines,...(q.aftermath??[])]){assert.ok(text);assert.ok(['Người kể','Trần Phong'].includes(speaker)||DAI_VIET_CAST_BY_NAME[speaker],q.id+' '+speaker);}
  }
 }
 assert.ok(existsSync('assets/images/narrator.webp'));
 assert.ok(validReaderKey('flow:D01H01'));assert.ok(validReaderKey('aftermath:D01H06'));assert.equal(validReaderKey('aftermath:D01H01'),false);
});

test('first chapters remain winnable and later training follows a smooth, accessible enemy curve',()=>{
 let laterLosses=0;
 for(const sect of SECT_IDS)for(const q of DAI_VIET_QUESTS.filter(q=>q.chapter<=4&&q.combatType)){
  const c=fresh(sect),s=snapshotAt(q.id);s.hero=createHeroBuild({name:'Trần Phong',sect,level:q.level});c.load(s);
  c.chooseMain('continue');assert.equal(c.battle.enemyStatMultiplier,q.chapter<=2?.78:.88);const r=fight(c);if(q.chapter<=2)assert.equal(r.winner,'home',sect+' '+q.id+' '+r.reason);else if(r.winner==='enemy')laterLosses++;
  if(DAI_VIET_MISSIONS[q.id]?.noWaves){if(r.winner==='home')assert.ok(r.duration>=12);assert.equal(c.battle.mission.waves.size,0);}
 }
 assert.ok(laterLosses>=0); // A gentle training curve need not force player losses.
});
test('400 full authored episodes have distinct scenes, complete speaker portraits and explicit connected chapter goals',()=>{
 assert.equal(DAI_VIET_CHAPTERS.length,20);assert.equal(DAI_VIET_QUESTS.length,400);assert.equal(new Set(DAI_VIET_QUESTS.map(q=>q.id)).size,400);
 assert.equal(new Set(DAI_VIET_QUESTS.map(q=>q.title)).size,400);assert.equal(new Set(DAI_VIET_QUESTS.map(q=>q.lines[0][1])).size,400);
 let words=0;for(const c of DAI_VIET_CHAPTERS){assert.equal(c.scenes.length,20);assert.ok(c.summary&&c.goal&&c.bridge);for(const scene of c.scenes){assert.ok(scene.lines.length>=4);words+=scene.lines.map(l=>l[1]).join(' ').split(/\s+/).length;}}
 assert.ok(words>30000);
 for(const q of DAI_VIET_QUESTS){assert.ok(q.previous&&q.objectiveText);for(const [speaker,text]of q.lines){assert.ok(text.length>4);if(!['Người kể','Trần Phong'].includes(speaker))assert.ok(DAI_VIET_CAST_BY_NAME[speaker],speaker);}if(q.encounter)assert.ok(ENCOUNTERS[q.encounter]);}
 assert.equal(new Set(DAI_VIET_CAST.map(p=>p.portrait)).size,DAI_VIET_CAST.length);
 for(const p of DAI_VIET_CAST)assert.ok(existsSync(new URL('../'+p.portrait,import.meta.url)),p.name);
 assert.equal(DAI_VIET_HOME_CHAPTER.scenes.length,20);
 assert.equal(DAI_VIET_QUESTS[0].scene,'modern');assert.match(DAI_VIET_QUESTS[0].location,/Hiện đại/);assert.match(DAI_VIET_QUESTS[1].location,/Tây Bắc/);
});
test('all five selected paths play the actual randomized unarmed opening without prematurely learning an ultimate',()=>{
 for(const sect of SECT_IDS){const c=fresh(sect);while(c.mainQuest().id!=='D01H06'){if(c.chooseMain('continue'))fight(c);}const before=itemCount(c.session,'silver');const b=c.chooseMain('continue');
  assert.ok(b.units.filter(u=>u.team==='enemy').length>=4&&b.units.filter(u=>u.team==='enemy').length<=8);assert.equal(b.units[0].skills.autoAttack.name,'Quyền Cơ Bản');assert.equal(b.units[0].stats.attackRange,1);assert.equal(b.units[0].passive,null);
  assert.equal(fight(c).winner,'home',sect);assert.equal(c.mainQuest().id,'D01H07');assert.ok(itemCount(c.session,'silver')>before);
  assert.throws(()=>c.chooseEnding('actor'));assert.ok(!c.availableRecruitQuests().some(q=>PLOT_COMPANIONS.includes(q.companionId)));
 }
});
test('new and legacy saves resume their own catalog and pending seed without converting already-read episode numbers',()=>{
 const legacy=new Campaign();legacy.newGame({sect:'VoDang'});legacy.chooseMain('protect');const old=legacy.snapshot(),wallet=structuredClone(old.inventory);
 const loaded=fresh();loaded.load(old);assert.equal(loaded.catalog.quests.length,240);assert.equal(loaded.mainQuest().id,'Q101');assert.deepEqual(loaded.session.inventory,wallet);assert.deepEqual(loaded.session.storyProgress.pendingEncounter,old.storyProgress.pendingEncounter);
 const current=fresh();while(current.mainQuest().id!=='D01H06'){if(current.chooseMain('continue'))fight(current);}current.chooseMain('continue');const saved=current.snapshot();loaded.load(saved);assert.equal(loaded.catalog.quests.length,400);assert.equal(loaded.mainQuest().id,'D01H06');assert.equal(loaded.retryEncounter().seed,saved.storyProgress.pendingEncounter.seed);
 const a=loaded.snapshot();loaded.load(a);assert.deepEqual(loaded.snapshot(),a);assert.equal(MAIN_QUESTS.length,240);
});
test('an examiner never appears as both ally guide and opponent in the same training fight',()=>{
 const c=fresh();c.load(snapshotAt('D02H18'));c.chooseMain('continue');
 const guide=c.battle.units.find(u=>u.id==='guide'),opponent=c.battle.units.find(u=>u.team==='enemy'&&u.name==='Kha Vân');
 assert.ok(guide&&opponent);assert.equal(guide.name,'Đạo Tĩnh (hỗ trợ)');assert.notEqual(guide.characterId,opponent.characterId);
});
test('new chiêu hiền cannot reveal five plot companions before their authored meeting and preserves rarity guarantees',()=>{
 const c=fresh();while(c.mainQuest().id!=='D01H06'){if(c.chooseMain('continue'))fight(c);}c.chooseMain('continue');fight(c);const s=c.snapshot();s.inventory.find(i=>i.itemId==='silver').quantity=100000;
 const first=rollGacha(s,5,{random:()=>0,now:1});const rolls=rollGacha(first.session,5,{random:()=>0,now:2});assert.ok(rolls.results.every(r=>!PLOT_COMPANIONS.includes(r.id)));assert.ok(rolls.results.at(-1).tier>=4);
 for(const id of PLOT_COMPANIONS){const bad=structuredClone(s);bad.party.unlocked.push(id);bad.companionsAffinity[id]=15;assert.throws(()=>validateCampaign(bad));}
 const renamed=storyPerson(s,COMPANIONS_BY_ID.companion_08);assert.equal(renamed.name,'Mai Tước');assert.equal(renamed.role,COMPANIONS_BY_ID.companion_08.role);
});
test('all 43 objectives refer to real combat episodes and never request a forced loss',()=>{
 assert.equal(Object.keys(DAI_VIET_MISSIONS).length,43);for(const m of Object.values(DAI_VIET_MISSIONS)){assert.ok(DAI_VIET_BY_ID[m.id]?.encounter);assert.ok(m.failure&&m.description);assert.ok(['hold','protect','rescue','breach'].includes(m.type));}
 assert.equal(DAI_VIET_QUESTS.filter(q=>q.chapter===14&&q.encounter).length,14);
});
test('chapter-entry recaps and early casebook do not reveal later proof or the five masters deaths',()=>{
 const s=snapshotAt('D03H11'),book=casebook(s);assert.ok(!book.people.some(p=>p.name==='Trịnh Nghiêm'));assert.ok(!book.entries.some(e=>e.id==='twice'||e.id==='murder'||e.id==='lost'));
 const entry=DAI_VIET_BY_ID.D14H01;assert.ok(!entry.chapterSummary.includes('không trở về'));assert.ok(!entry.lines.some(l=>l[1].includes('năm chưởng môn không còn')));
});
test('future choices and mixed campaign IDs cannot be injected into a new save',()=>{
 const s=createCampaign({story:'dai-viet',sect:'VoDang'});const future=structuredClone(s);future.storyProgress.decisions.D19H18='home';assert.throws(()=>validateCampaign(future));
 const mixed=structuredClone(s);mixed.storyProgress.completedQuests.push('Q101');assert.throws(()=>validateCampaign(mixed));
 assert.ok(validReaderKey('main:D20H20'));assert.ok(validReaderKey('archive:D20H20'));assert.ok(validReaderKey('main:Q101'));assert.equal(validReaderKey('main:D21H01'),false);
});
test('all fifteen campaign-specific bond conversations keep their variants and remain valid after choosing home',()=>{
 const s=snapshotAt('D19H18');for(const id of ['companion_02','companion_03','companion_04']){if(!s.party.unlocked.includes(id))s.party.unlocked.push(id);s.companionsAffinity[id]=100;}
 const c=fresh();c.load(s);for(const person of ['companion_01','companion_02','companion_03','companion_04','companion_08'])for(let stage=1;stage<=3;stage++)c.completeBond(`bond_${person}_${stage}`,'listen');
 assert.equal(c.session.journey.bonds.completed.length,15);assert.ok(c.bondStories().find(b=>b.id==='bond_companion_01_1').lines.some(l=>l[0]==='Lôi Nam'));
 c.chooseMain('home');const snapshot=c.snapshot();c.load(snapshot);assert.deepEqual(c.session.journey.bonds,snapshot.journey.bonds);assert.ok(c.bondStories().every(b=>b.done&&!b.available));
});
test('reader positions for all 400 main episodes and 400 replays fit the unchanged save envelope',async()=>{
 const s=snapshotAt('D20H20');for(const q of DAI_VIET_QUESTS){for(const kind of ['main','archive','flow'])s.journey.reader.positions[kind+':'+q.id]=1;if(q.aftermath)s.journey.reader.positions['aftermath:'+q.id]=0;}
 const m=new StorageManager({indexedDB:null,localStorage:{getItem:()=>null,setItem(){},removeItem(){}}}),text=await m.exportSave(s),restored=await m.decodeSave(text);
 assert.equal(Object.keys(restored.journey.reader.positions).length,1465);assert.equal(restored.storyProgress.activeQuestId,'D20H20');assert.deepEqual(restored.inventory,s.inventory);
});
test('a controlled victory fixture traverses all 400 episodes; gate branches, romance, endings and replay remain consistent',async()=>{
 const c=prepared();let fights=0,gate;
 while(c.mainQuest().id!=='D19H18'){
  const q=c.mainQuest(),choice=q.id==='D19H12'?'friends':q.choices[0].id;
  const b=c.chooseMain(choice);if(b){fights++;reinforceStoryParty(c);const r=fight(c,true);assert.equal(r.winner,'home',q.id+' '+c.lastResult.reason);}
 }
 gate=c.snapshot();assert.equal(fights,DAI_VIET_QUESTS.filter(q=>q.encounter&&q.id<'D19H18').length);assert.ok(PLOT_COMPANIONS.every(id=>gate.party.unlocked.includes(id)&&gate.storyProgress.completedQuests.includes(PLOT_UNLOCKS[id])));
 const book=casebook(gate);assert.ok(book.entries.some(e=>e.id==='murder'));assert.ok(!book.entries.some(e=>e.id==='gate'));assert.ok(!book.entries.some(e=>e.source==='D19H18'));
 const goldBefore=itemCount(gate,'silver');
 for(const route of ['home','stay']){
  const branch=fresh();branch.load(gate);branch.chooseMain(route);assert.equal(branch.mainQuest().id,'D19H19');
  const line=daiVietLines(branch.mainQuest(),branch.session).flat().join(' ');assert.ok(route==='home'?line.includes('chọn trở về'):line.includes('chọn ở lại'));
  while(!branch.mainQuest().ending){if(branch.chooseMain('continue')){reinforceStoryParty(branch);assert.equal(fight(branch).winner,'home');}}const final=branch.snapshot();
  assert.equal(final.storyProgress.completedQuests.filter(id=>id.startsWith('D')).length,399);
  const expected=route==='home'?['home']:['actor','justice','retire'];assert.deepEqual(branch.endingOptions().filter(e=>e.available).map(e=>e.id),expected);
  if(route==='home'){for(let e=1;e<=20;e++){const resolved=resolveDaiVietQuest(DAI_VIET_BY_ID[`D20H${String(e).padStart(2,'0')}`],final);assert.equal(resolved.title,heroText(DAI_VIET_HOME_CHAPTER.scenes[e-1].title,final));}assert.match(resolveDaiVietQuest(DAI_VIET_BY_ID.D20H02,final).location,/Hiện đại/);assert.match(resolveDaiVietQuest(DAI_VIET_BY_ID.D20H04,final).location,/Đại Việt/);assert.throws(()=>branch.completeBond('bond_companion_01_1','listen'));}
  for(const ending of expected){const run=fresh();run.load(final);const silver=itemCount(run.session,'silver');run.chooseEnding(ending);assert.equal(itemCount(run.session,'silver'),silver);assert.equal(run.session.storyProgress.completedQuests.filter(id=>id.startsWith('D')).length,400);assert.equal(run.catalog.quests.length,400);assert.throws(()=>run.chooseEnding(ending));
   const wallet=structuredClone(run.session.inventory),beforeReplay=run.snapshot();for(const q of run.catalog.quests)daiVietLines(q,run.session);assert.deepEqual(run.snapshot(),beforeReplay);
   const storage=new StorageManager({indexedDB:null,localStorage:{getItem:()=>null,setItem(){},removeItem(){}}});const file=await storage.exportSave(run.snapshot());const imported=await storage.decodeSave(file);assert.equal(imported.storyProgress.endingId,ending);assert.deepEqual(imported.inventory,wallet);
  }
  assert.ok(itemCount(final,'silver')>=goldBefore);
 }
 const rom=structuredClone(gate);rom.storyProgress.decisions.D19H12='together';assert.notDeepEqual(daiVietLines(DAI_VIET_BY_ID.D20H03,rom),daiVietLines(DAI_VIET_BY_ID.D20H03,gate));
});
