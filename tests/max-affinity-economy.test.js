import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {MAX_AFFINITY7} from '../src/data/MaxAffinity7.js';
import {Companion} from '../src/entities/Companion.js';
import {Hero} from '../src/entities/Hero.js';
import {GridSystem} from '../src/combat/GridSystem.js';
import {CombatEngine} from '../src/combat/CombatEngine.js';
import {NEW_GEAR} from '../src/data/GearCatalog.js';
import {drawEquipment,validateLoot,spareEquipment,gearSalePrice} from '../src/core/Loot.js';
import {give,validateTeam,teamSnapshot} from '../src/core/WorldProgress.js';
import {Campaign,itemCount,validateCampaign} from '../src/core/Campaign.js';
import {equipItem} from '../src/entities/HeroBuild.js';
import {developed} from '../scripts/balance-campaign7.mjs';
import {fighterURL,fighterUsesPortrait,FIGHTERS} from '../src/data/PresentationData.js';

function fixture(id,unlocked=true){const u=new Companion(id,{level:5}),hero=new Hero('DuongMon',{id:'hero'}),enemy=new Companion('companion_05',{id:'enemy',team:'enemy',level:5}),rear=new Companion('companion_04',{id:'rear',team:'enemy',level:5}),grid=new GridSystem();u.maxAffinity=unlocked;for(const[v,p]of [[u,{x:2,y:1}],[hero,{x:1,y:1}],[enemy,{x:3,y:1}],[rear,{x:5,y:1}]]){grid.place(v,p, { formation: false });v.stats.hp*=.5;}const c=new CombatEngine({units:[u,hero,enemy,rear],grid});c.start();return{u,hero,enemy,rear,c};}

test('sixty max-affinity passives have distinct names AND distinct trigger/action mechanics; every action executes against real combat units',()=>{
 const perks=Object.values(MAX_AFFINITY7);assert.equal(perks.length,60);assert.equal(new Set(perks.map(p=>p.name)).size,60);assert.equal(new Set(perks.map(p=>JSON.stringify([p.trigger,p.actions.map(a=>[a.type,a.target])]))).size,60);
 for(const p of perks){assert.ok(!/undefined|NaN/.test(p.description),p.id);const{u,hero,enemy,c}=fixture(p.id),r=c.maxAffinity.entries[0];r.ready=0;r.used=0;const e={actorId:p.trigger==='enemy_ultimate'?enemy.id:hero.id,targetId:['heal','receive_heal'].includes(p.trigger)?hero.id:enemy.id};assert.equal(c.maxAffinity.fire(r,e),true,p.id);assert.equal(r.used,1);assert.ok(c.events.some(e=>e.type==='affinity:proc'&&e.perkId===p.id),p.id);for(const v of c.units){for(const n of Object.values(v.stats))assert.ok(Number.isFinite(n),p.id);assert.ok(v.stats.hp<=v.stats.maxHp);assert.ok(v.stats.energy<=v.stats.maxEnergy);}}
});

test('actual third basic cast activates Loi Nam once; perk visual casts cannot recursively count as basic attacks',()=>{
 const{u,enemy,c}=fixture('companion_01');enemy.stats.hp=enemy.stats.maxHp=1e6;for(let i=0;i<3;i++)c.resolveSkill(u,enemy,u.skills.autoAttack,false);assert.equal(c.maxAffinity.entries[0].seen,3);assert.equal(c.maxAffinity.entries[0].used,1);assert.ok(u.shield>0);assert.equal(c.events.filter(e=>e.type==='affinity:proc').length,1);
 const locked=fixture('companion_01',false);for(let i=0;i<3;i++)locked.c.resolveSkill(locked.u,locked.enemy,locked.u.skills.autoAttack,false);assert.equal(locked.c.maxAffinity.entries.length,0);
});

test('actual healing transfers energy to the healed ally; low-health rescue has a strict once-per-battle cap',()=>{
 const{u,hero,c}=fixture('companion_03');assert.equal(hero.stats.energy,0);c.heal(u,hero,100);assert.equal(hero.stats.energy,12*hero.energyGainMultiplier);c.heal(u,hero,100);assert.equal(hero.stats.energy,12*hero.energyGainMultiplier);
 const x=fixture('companion_29');x.u.stats.hp=x.u.stats.maxHp*.3;x.c.statuses.apply(x.u,{type:'root',duration:3});x.c.maxAffinity.tick();const shield=x.u.shield;assert.ok(shield>0);assert.ok(!x.u.statusEffects.some(e=>e.type==='root'));x.c.elapsed=100;x.c.maxAffinity.tick();assert.equal(x.u.shield,shield);assert.equal(x.c.maxAffinity.entries[0].used,1);
});

test('unique max affinity unlocks only at 100; 75 echo respects pending retries and snapshots',()=>{
 for(const affinity of[99,100]){const c=developed(),s=c.snapshot(),id=s.party.active[0];s.companionsAffinity[id]=affinity;for(const k of s.party.active.slice(1))s.companionsAffinity[k]=15;c.load(s);c.startArena('npc_0');assert.equal(c.battle.maxAffinity.entries.length,1);assert.equal(c.battle.maxAffinity.entries[0].perk.id,affinity===100?id:id+'_75');const pending=c.snapshot(),copy=new Campaign();copy.load(pending);copy.retryEncounter();assert.equal(copy.battle.maxAffinity.entries.length,1);assert.equal(copy.battle.maxAffinity.entries[0].perk.id,affinity===100?id:id+'_75');}
 const pendingTest=developed(),old=pendingTest.snapshot();for(const id of old.party.active)old.companionsAffinity[id]=99;pendingTest.load(old);pendingTest.startArena('npc_0');const checkpoint=pendingTest.snapshot();for(const id of checkpoint.party.active)checkpoint.companionsAffinity[id]=100;const locked=new Campaign();locked.load(checkpoint);locked.retryEncounter();assert.equal(locked.battle.maxAffinity.entries.length,1);assert.equal(locked.battle.maxAffinity.entries[0].perk.id,id+'_75');const invalid=structuredClone(checkpoint);invalid.storyProgress.pendingEncounter.preparation.maxAffinity=['not_a_character'];assert.throws(()=>validateCampaign(invalid));
 const c=developed();const team=teamSnapshot(c.session);assert.equal(team.maxAffinity.length,5);validateTeam(team);const bad=structuredClone(team);bad.maxAffinity=['companion_01'];assert.throws(()=>validateTeam(bad));delete bad.maxAffinity;validateTeam(bad);
 c.enterDungeon('phong_nha');const s=c.snapshot();for(const id of s.party.active)s.companionsAffinity[id]=15;c.load(s);c.chooseRoom(0);assert.equal(c.battle.maxAffinity.entries.length,5);
});

test('single duplicates refund 72; five duplicates refund exactly 320 and are retained; same-bundle repeats count as duplicates',()=>{
 const s=developed().snapshot(),item='gear_phong_hanh_common_weapon',before=structuredClone(s);
 const first=drawEquipment(s,5,{random:()=>0,now:1});assert.deepEqual(s,before);assert.equal(first.refund,256);assert.equal(first.results.filter(r=>r.duplicate).length,4);assert.equal(itemCount(first.session,item),5);assert.equal(itemCount(first.session,'silver'),itemCount(s,'silver')-400+256);
 const single=drawEquipment(first.session,1,{random:()=>0,now:2});assert.equal(single.refund,72);assert.equal(single.results[0].refund,72);
 const owned=structuredClone(s);for(const gear of NEW_GEAR)give(owned,gear.id,1);const all=drawEquipment(owned,5,{random:()=>0,now:3});assert.equal(all.refund,320);assert.equal(all.results.reduce((n,r)=>n+r.refund,0),320);assert.equal(itemCount(all.session,item),6);validateCampaign(all.session);
 const legacy=structuredClone(all.session);for(const r of legacy.loot.history){delete r.duplicate;delete r.refund;}validateLoot(legacy.loot);
 const corrupt=structuredClone(all.session.loot);corrupt.history[0].duplicate=false;corrupt.history[0].refund=64;assert.throws(()=>validateLoot(corrupt));
 let i=0;assert.throws(()=>drawEquipment(first.session,5,{random:()=>++i===5?NaN:0}));assert.equal(itemCount(first.session,item),5);
});

test('selling spare equipment pays once, preserves the equipped copy, rejects stale/invalid sales and survives save reload',()=>{
 const c=developed(),s=c.snapshot(),id='gear_phong_hanh_common_weapon';give(s,id,3);s.hero=equipItem(s.hero,'weapon',id,s.inventory);c.load(s);const before=itemCount(c.session,'silver');assert.equal(spareEquipment(c.session,id),2);const result=c.sellEquipment(id,2);assert.equal(result.silver,24);assert.equal(itemCount(c.session,'silver'),before+24);assert.equal(itemCount(c.session,id),1);assert.equal(c.session.hero.equippedGear.weapon,id);const saved=c.snapshot();for(const[id,n]of[['silver',1],['unknown',1],['gear_phong_hanh_common_weapon',1],['gear_phong_hanh_common_weapon',0],['gear_phong_hanh_common_weapon',NaN]])assert.throws(()=>c.sellEquipment(id,n));assert.deepEqual(c.snapshot(),saved);const copy=new Campaign();copy.load(saved);assert.deepEqual(copy.snapshot(),saved);assert.equal(gearSalePrice({rarity:'exceptional'}),120);
 copy.startArena('npc_0');assert.throws(()=>copy.sellEquipment(id));
});

test('the last missing civilian atlas is linked, has immutable provenance, and no registered character falls back to a portrait',()=>{
 const m=JSON.parse(readFileSync('assets/images/paper-artisan-manifest.json','utf8'));assert.equal(createHash('sha256').update(readFileSync(m.file)).digest('hex'),m.sha256);assert.equal(m.width,1536);assert.equal(m.height,1024);assert.equal(m.poses.length,6);assert.ok(m.transparentRatio>.5);assert.match(fighterURL('tho_giay'),/npc_tho_giay.webp/);assert.deepEqual(FIGHTERS.filter(fighterUsesPortrait),[]);
});
