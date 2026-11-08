import test from 'node:test';
import assert from 'node:assert/strict';
import {
  GEAR_FAMILIES7, NEW_GEAR, NEW_GEAR_SETS, GEAR_DRAW,
  LEGACY_FULL_SETS7, SET_BONUS_MULTIPLIERS, boostedSetStats
} from '../src/data/GearCatalog.js';
import { EQUIPMENT_SETS, EQUIPMENT_BY_ID } from '../src/data/EquipmentData.js';
import { Hero } from '../src/entities/Hero.js';
import { createHeroBuild } from '../src/entities/HeroBuild.js';
import { heroStatBreakdown } from '../src/ui/HeroReadout.js';

const SLOTS=['weapon','armor','accessory','helmet'];
const approx=(actual,want,msg='')=>assert.ok(Math.abs(actual-want)<1e-9,`${msg}: ${actual} != ${want}`);
const sum=(values,key)=>values.reduce((n,value)=>n+(value.stats[key]??0),0);

test('all 15 modern set milestones receive +50 / +75 / +100 percent without changing set IDs',()=>{
 assert.deepEqual(SET_BONUS_MULTIPLIERS,{2:1.5,3:1.75,4:2});
 assert.equal(GEAR_FAMILIES7.length,5);
 assert.equal(NEW_GEAR_SETS.length,15);
 for(const family of GEAR_FAMILIES7){
  const milestones=NEW_GEAR_SETS.filter(set=>set.setId===family.id);
  assert.deepEqual(milestones.map(set=>set.id),
   [2,3,4].map(pieces=>family.id+'_'+pieces));
  for(const milestone of milestones){
   const original=family[{2:'two',3:'three',4:'four'}[milestone.requiredPieces]];
   assert.deepEqual(milestone.stats,boostedSetStats(original,milestone.requiredPieces),milestone.id);
   for(const [key,value] of Object.entries(original))
    assert.ok(milestone.stats[key]>value,`${milestone.id} ${key} should be buffed`);
  }
 }
 // All 80 individual item stats and acquisition odds remain unchanged.
 assert.equal(NEW_GEAR.length,80);
 assert.deepEqual(EQUIPMENT_BY_ID.gear_thiet_ve_common_helmet.stats,{maxHp:100,magicalDef:6});
 assert.deepEqual(GEAR_DRAW,{singleCost:90,tenCost:400,excellentPity:10,exceptionalPity:50});
});

test('all five sect sets receive stronger three- and four-piece milestones',()=>{
 const initial={
  thieulam_set:{maxHp:200},vodang_set:{magicalAtk:20},
  caibang_set:{physicalAtk:20},ngami_set:{magicalAtk:20},
  duongmon_set:{attackSpeed:.1}
 };
 assert.equal(EQUIPMENT_SETS.length,25);
 assert.equal(LEGACY_FULL_SETS7.length,5);
 for(const [setId,oldStats] of Object.entries(initial)){
  const milestones=EQUIPMENT_SETS.filter(set=>(set.setId??set.id)===setId);
  assert.deepEqual([...milestones.map(set=>set.requiredPieces)].sort((a,b)=>a-b),[3,4],setId);
  const three=milestones.find(set=>set.requiredPieces===3);
  const four=milestones.find(set=>set.requiredPieces===4);
  assert.deepEqual(three.stats,boostedSetStats(oldStats,3),setId);
  assert.deepEqual(four.stats,{maxHp:360,physicalAtk:24,magicalAtk:24},setId);
 }
});

test('one to four pieces stack only unlocked milestones and profile readout equals real Hero stats',()=>{
 const itemIds=SLOTS.map(slot=>'gear_tam_anh_rare_'+slot);
 const inventory=itemIds.map(itemId=>({itemId,quantity:1}));
 for(let pieces=1;pieces<=4;pieces++){
  const build=createHeroBuild({name:'Kiểm tra bộ Tầm Ảnh',sect:'DuongMon',level:1});
  for(let i=0;i<pieces;i++)build.equippedGear[SLOTS[i]]=itemIds[i];
  const hero=new Hero('DuongMon',{profile:build,inventory});
  const equipped=itemIds.slice(0,pieces).map(id=>EQUIPMENT_BY_ID[id]);
  const unlocked=EQUIPMENT_SETS.filter(set=>set.setId==='tam_anh'&&pieces>=set.requiredPieces);
  assert.equal(unlocked.length,Math.max(0,pieces-1));
  assert.deepEqual(hero.activeEquipmentSets,unlocked.map(set=>set.id));
  const rows=heroStatBreakdown(hero,build);
  for(const key of ['maxHp','physicalAtk','attackSpeed','dodgeRate','critRate']){
   const row=rows.find(r=>r.key===key);
   approx(row.gear,sum(equipped,key),'item '+key+' at '+pieces);
   approx(row.set,sum(unlocked,key),'set '+key+' at '+pieces);
   approx(row.total,row.base+row.gear+row.set,'combat '+key+' at '+pieces);
  }
 }
});

test('a four-piece original sect set stacks the boosted 3- and 4-piece bonuses',()=>{
 const ids=SLOTS.map(slot=>'thieulam_'+slot);
 const inventory=ids.map(itemId=>({itemId,quantity:1}));
 const build=createHeroBuild({name:'Kiểm tra bộ Thiếu Lâm',sect:'ThieuLam',level:1});
 for(let i=0;i<4;i++)build.equippedGear[SLOTS[i]]=ids[i];
 const hero=new Hero('ThieuLam',{profile:build,inventory});
 const rows=heroStatBreakdown(hero,build);
 assert.deepEqual(hero.activeEquipmentSets,['thieulam_set_4','thieulam_set']);
 assert.equal(rows.find(row=>row.key==='maxHp').set,710); // 350 from 3 pieces + 360 from 4 pieces
 assert.equal(rows.find(row=>row.key==='physicalAtk').set,24);
 assert.equal(rows.find(row=>row.key==='magicalAtk').set,24);
});
