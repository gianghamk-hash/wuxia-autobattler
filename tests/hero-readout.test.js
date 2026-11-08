import test from 'node:test';
import assert from 'node:assert/strict';
import { Hero } from '../src/entities/Hero.js';
import { createHeroBuild } from '../src/entities/HeroBuild.js';
import { equipmentSetProgress, heroStatBreakdown, formatHeroStat } from '../src/ui/HeroReadout.js';

const ids=['gear_tam_anh_rare_weapon','gear_tam_anh_common_armor','gear_tam_anh_excellent_accessory','gear_tam_anh_exceptional_helmet'];
const inventory=ids.map(itemId=>({itemId,quantity:1}));
const build=()=>createHeroBuild({name:'Kiểm thử hồ sơ',sect:'DuongMon',level:8});
test('set progress reports active 2/3/4 milestones from mixed rarity pieces',()=>{
 const b=build();b.equippedGear={weapon:ids[0],armor:ids[1],accessory:null,helmet:null};
 let group=equipmentSetProgress(b)[0];
 assert.equal(group.pieces,2);assert.deepEqual(group.milestones.map(x=>x.active),[true,false,false]);
 b.equippedGear.accessory=ids[2];b.equippedGear.helmet=ids[3];
 group=equipmentSetProgress(b)[0];assert.deepEqual(group.milestones.map(x=>x.active),[true,true,true]);
});
test('hero readout exactly equals combat-derived totals and shows distinct bonus sources',()=>{
 const b=build();b.equippedGear={weapon:ids[0],armor:ids[1],accessory:ids[2],helmet:ids[3]};
 const hero=new Hero(b.sect,{profile:b,inventory});const rows=heroStatBreakdown(hero,b);
 for(const row of rows)assert.ok(Math.abs(row.base+row.attributes+row.skills+row.gear+row.set+row.passive-row.total)<1e-7,row.key);
 assert.ok(rows.find(x=>x.key==='physicalAtk').set>0);
 assert.ok(rows.find(x=>x.key==='maxHp').gear>0);
 assert.equal(rows.length,Object.keys(hero.stats).filter(k=>!['hp','energy'].includes(k)).length);
});
test('readout handles no sets and still reports full combat stats',()=>{
 const b=build();const hero=new Hero(b.sect,{profile:b,inventory:[]});
 assert.deepEqual(equipmentSetProgress(b),[]);
 assert.ok(heroStatBreakdown(hero,b).find(x=>x.key==='maxEnergy'));
});
test('formatting hides floating point artifacts and keeps units',()=>{
 assert.equal(formatHeroStat('physicalAtk',457.03999999999996),'457,04');
 assert.equal(formatHeroStat('critRate',0.245),'24,5%');
 assert.match(formatHeroStat('attackSpeed',1.25),/đòn\/giây/);
});
