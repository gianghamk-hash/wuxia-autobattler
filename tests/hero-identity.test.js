import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {Campaign,validateCampaign,itemCount} from '../src/core/Campaign.js';
import {createHeroBuild,allocateSkill} from '../src/entities/HeroBuild.js';
import {SECT_IDS} from '../src/data/SectsData.js';
import {DAI_VIET_QUESTS,DAI_VIET_BY_ID,DAI_VIET_ENDINGS,resolveDaiVietQuest,daiVietLines} from '../src/data/DaiVietStoryData.js';
import {ENROLLMENT_QUEST,heroText,heroLines,heroAppearance,hasEnrollment,storyHeroBuild} from '../src/data/HeroIdentity.js';
import {bondCatalog} from '../src/data/DaiVietBonds.js';
import {StorageManager} from '../src/core/StorageManager.js';
const fresh=(name='Minh An')=>{const c=new Campaign();c.newGame({story:'dai-viet',name});return c;};
function fight(c){for(let i=0;i<7500&&c.running;i++)c.update(1/60);assert.equal(c.running,false);assert.equal(c.lastResult.winner,'home');}
function gate(){
 const c=fresh();
 while(c.mainQuest().id!==ENROLLMENT_QUEST){const b=c.chooseMain('continue');if(b)fight(c);}
 return c;
}
test('a named newcomer reaches enrollment through the actual opening with no sect, passive or ultimate',async()=>{
 const c=fresh(),before=c.snapshot();assert.equal(c.session.hero.sect,null);assert.throws(()=>c.joinSect('VoDang'));assert.deepEqual(c.snapshot(),before);
 for(let i=0;i<6;i++)c.chooseMain('continue');
 const u=c.battle.units[0];assert.equal(u.sect,null);assert.equal(u.name,'Minh An');assert.equal(u.passive,null);assert.equal(u.skills.ultimate.energyCost,10000);assert.ok(u.portrait.endsWith('/traveler.webp'));assert.deepEqual(c.battle.teamSynergies.home,[]);
 const m=new StorageManager({indexedDB:null,localStorage:{getItem:()=>null,setItem(){},removeItem(){}}}),restored=await m.decodeSave(await m.exportSave(c.snapshot())),copy=fresh();copy.load(restored);copy.retryEncounter();assert.equal(copy.battle.seed,c.battle.seed);fight(copy);assert.equal(copy.session.hero.sect,null);
});
test('five enrollment choices commit once at chapter 2 episode 10 and unlock their own real build',()=>{
 const c=gate(),saved=c.snapshot(),silver=itemCount(saved,'silver');assert.equal(saved.hero.sect,null);assert.throws(()=>c.chooseMain('continue'));assert.deepEqual(c.snapshot(),saved);
 for(const sect of SECT_IDS){const branch=fresh();branch.load(saved);branch.joinSect(sect);assert.equal(branch.session.hero.sect,sect);assert.ok(hasEnrollment(branch.session));assert.equal(branch.mainQuest().id,'D02H11');assert.equal(branch.session.storyProgress.decisions.D02H10,'continue');assert.equal(itemCount(branch.session,'silver'),silver+DAI_VIET_BY_ID.D02H10.silver);const paid=branch.snapshot();assert.throws(()=>branch.joinSect(sect));assert.deepEqual(branch.snapshot(),paid);branch.chooseMain('continue');assert.equal(branch.battle.units[0].sect,sect);assert.ok(branch.battle.units[0].portrait.endsWith('/'+sect+'.webp'));assert.notEqual(branch.battle.units[0].skills.ultimate.energyCost,10000);}
});
test('custom names replace both forms throughout both routes, bonds and endings without corrupting locations or repeating a name',()=>{
 for(const name of ['Minh An','Phong An','Mai Tước','A[B]$1','Người kể','Trần','Trần Phong Đại Hiệp','Phong']){
  const s=fresh(name).snapshot();assert.equal(heroText('Trần Phong gặp Phong ở Phong Nha.',s),`${name} gặp ${name} ở Phong Nha.`);assert.equal(heroText(heroText('Trần Phong và Phong.',s),s),`${name} và ${name}.`);
  for(const route of ['stay','home']){s.storyProgress.decisions.D19H18=route;for(const q of DAI_VIET_QUESTS){const lines=daiVietLines(q,s);for(const line of lines.filter(l=>l[2]==='hero'))assert.equal(line[0],name);if(!name.includes('Trần Phong'))assert.ok(!JSON.stringify(lines).includes('Trần Phong'));}}
  for(const e of DAI_VIET_ENDINGS)assert.ok(heroLines(e.lines,s).some(l=>l[0]===name&&l[2]==='hero'));
  if(!name.includes('Trần Phong'))assert.ok(!JSON.stringify(bondCatalog(s)).includes('Trần Phong'));
 }
 assert.equal(DAI_VIET_BY_ID.D01H01.lines[1][0],'Trần Phong');
});
test('portraits follow story milestones and the return route, with ten existing distinct decoded asset sources',()=>{
 const s=fresh().snapshot();s.hero.sect='NgaMi';
 for(const [id,stage]of [['D01H01','modern'],['D01H02','traveler'],['D02H10','traveler'],['D02H11','NgaMi'],['D13H20','NgaMi'],['D14H01','grief'],['D15H19','grief'],['D15H20','commander'],['D18H19','commander'],['D19H01','peace'],['D20H20','peace']])assert.equal(heroAppearance(s,DAI_VIET_BY_ID[id]).storyStage,stage,id);
 s.storyProgress.decisions.D19H18='home';assert.equal(heroAppearance(s,DAI_VIET_BY_ID.D20H01).storyStage,'modern');
 const rows=JSON.parse(readFileSync('assets/images/hero/manifest.json','utf8'));assert.equal(rows.length,10);assert.equal(new Set(rows.map(r=>r.sha256)).size,10);for(const row of rows){assert.ok(existsSync(row.asset));assert.equal(createHash('sha256').update(readFileSync(row.asset)).digest('hex'),row.sha256);}
});
test('earlier chosen builds stay intact in old saves while the opening appearance and combat remain untrained',()=>{
 const c=fresh(),s=c.snapshot();s.hero=createHeroBuild({name:'Tên bản cũ',sect:'VoDang',level:3});const old=structuredClone(s);c.load(s);assert.deepEqual(c.snapshot().hero,old.hero);assert.equal(storyHeroBuild(c.session).sect,null);assert.equal(heroAppearance(c.session).storyStage,'modern');validateCampaign(c.snapshot());
 const enrolled=gate();enrolled.joinSect('VoDang');const bad=enrolled.snapshot();bad.hero.sect=null;assert.throws(()=>validateCampaign(bad));const changed=enrolled.snapshot();changed.hero.sect='CaiBang';assert.throws(()=>enrolled.updateProfile(changed.hero,changed.inventory));
});
