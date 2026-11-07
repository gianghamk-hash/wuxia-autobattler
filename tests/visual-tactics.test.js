import test from 'node:test';
import assert from 'node:assert/strict';
import { GridSystem } from '../src/combat/GridSystem.js';
import { BOARD_COLS, BOARD_ROWS, mirrorPosition, ENEMY_SPAWN_CELLS } from '../src/combat/BoardGeometry.js';
import { damageIndicator } from '../src/combat/DamageIndicator.js';
import { calculateDamage } from '../src/combat/CombatMath.js';
import { Hero } from '../src/entities/Hero.js';
import { Companion } from '../src/entities/Companion.js';
import { CombatEngine } from '../src/combat/CombatEngine.js';
import { developed } from '../scripts/balance-campaign7.mjs';
import { Campaign } from '../src/core/Campaign.js';
import { StorageManager } from '../src/core/StorageManager.js';
import { teamSnapshot, encodeTeam, decodeTeam } from '../src/core/WorldProgress.js';
import { GACHA } from '../src/data/GachaData.js';
import { GEAR_DRAW } from '../src/data/GearCatalog.js';

function duel(){
 const grid=new GridSystem(),a=new Hero('ThieuLam'),b=new Companion('companion_04',{id:'foe',team:'enemy'});
 grid.place(a,{x:3,y:3});grid.place(b,{x:4,y:3});a.element='Kim';b.element='Moc';a.passive=null;b.passive=null;
 const battle=new CombatEngine({units:[a,b],grid});battle.start();return {a,b,grid,battle};
}
test('the 8×4 board exposes 16 deployment cells per side and paths reach every new edge',()=>{
 const {a,b,grid}=duel();assert.equal(BOARD_COLS,8);assert.equal(BOARD_ROWS,4);
 assert.ok(grid.isHomeSide('home',{x:3,y:3}));assert.ok(grid.isHomeSide('enemy',{x:4,y:3}));
 assert.ok(!grid.isHomeSide('home',{x:4,y:3}));assert.ok(!grid.isInside({x:8,y:3}));assert.ok(!grid.isInside({x:7,y:4}));
 assert.throws(()=>grid.place(a,{x:4,y:0}));assert.throws(()=>grid.place(b,{x:3,y:0}));
 assert.ok(grid.findPath(a,{x:7,y:0}).length);assert.deepEqual(mirrorPosition({x:0,y:3}),{x:7,y:3});
 assert.ok(ENEMY_SPAWN_CELLS.every(p=>grid.isHomeSide('enemy',p)));assert.ok(ENEMY_SPAWN_CELLS.some(p=>p.y===3));
});
test('new corner formations survive save and shared-team round trips while legacy coordinates remain unchanged',async()=>{
 const c=developed(),old=c.snapshot();const restored=new Campaign();restored.load(old);assert.deepEqual(restored.session.party.formation,old.party.formation);
 const formation=structuredClone(c.session.party.formation);formation.hero={x:3,y:3};c.setFormation(formation);
 const store=new StorageManager({indexedDB:null,localStorage:{getItem:()=>null,setItem(){},removeItem(){}}});
 const copy=new Campaign();copy.load(await store.decodeSave(await store.exportSave(c.snapshot())));assert.deepEqual(copy.session.party.formation.hero,{x:3,y:3});
 const shared=teamSnapshot(copy.session);assert.deepEqual(decodeTeam(encodeTeam(shared)).formation.hero,{x:3,y:3});
});
test('green/red head indicators match directional damage multipliers including active buffs and expiry',()=>{
 const {a,b,battle}=duel();assert.equal(damageIndicator(battle,a,b.id).percent,75);assert.equal(damageIndicator(battle,b,a.id).percent,-40);
 for(const u of [a,b]){u.stats.critRate=0;u.stats.dodgeRate=0;u.stats.blockRate=0;}
 a.damageMultiplier=a.intrinsicDamageMultiplier*1.2;battle.statuses.apply(a,{type:'attack_up',ratio:.1,duration:1,sourceId:a.id});
 const indicator=damageIndicator(battle,a,b.id);assert.equal(indicator.percent,131);
 const enhanced=calculateDamage(a,b,a.skills.autoAttack,()=>.99).amount;
 a.damageMultiplier=a.intrinsicDamageMultiplier;a.statusEffects=[];b.element='Kim';const normal=calculateDamage(a,b,a.skills.autoAttack,()=>.99).amount;
 assert.ok(Math.abs(enhanced/normal-indicator.multiplier)<1e-9);
 b.element='Moc';assert.equal(damageIndicator(battle,a,b.id).percent,75);
 b.element='Hoa';assert.equal(damageIndicator(battle,a,b.id).percent,-40);
});
test('damage indicators follow actual attack targets and omit healing, objectives and dead units',()=>{
 const {a,b,battle}=duel();const brain=battle.brains.get(a.id);brain.action={target:a};assert.equal(damageIndicator(battle,a),null);
 brain.action={target:b};assert.equal(damageIndicator(battle,a).targetId,b.id);
 b.isObject=true;assert.equal(damageIndicator(battle,a).targetId,b.id); // Breach targets still use their actual modifiers.
 b.isObject=false;b.team='home';brain.action={target:b,skill:{dmgMultiplier:1}};assert.equal(damageIndicator(battle,a).targetId,b.id); // Charm can make an ally the real attack target.
 brain.action={target:b,skill:{dmgMultiplier:0,targetType:'lowest_hp_ally'}};assert.equal(damageIndicator(battle,a),null);
 a.stats.hp=0;assert.equal(damageIndicator(battle,a),null);a.stats.hp=1;a.isObject=true;assert.equal(damageIndicator(battle,a),null);
});
test('both single and five-result draw prices are exactly doubled',()=>{
 assert.deepEqual([GACHA.singleCost,GACHA.tenCost],[70,300]);assert.deepEqual([GEAR_DRAW.singleCost,GEAR_DRAW.tenCost],[90,400]);
});
