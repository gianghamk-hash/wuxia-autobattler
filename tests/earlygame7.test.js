import test from 'node:test';
import assert from 'node:assert/strict';
import {Campaign,createCampaign,itemCount} from '../src/core/Campaign.js';
import {give} from '../src/core/WorldProgress.js';
import {earlyDungeonFactor} from '../src/combat/EarlyDungeon.js';
import {bossLoot} from '../src/core/Loot.js';
import {EQUIPMENT_BY_ID} from '../src/data/EquipmentData.js';

function fixture() {
  const campaign=new Campaign({now:()=>Date.UTC(2026,10,7,6)});
  const session=createCampaign({sect:'VoDang'});
  give(session,'silver',10000);
  give(session,'ore',100);
  campaign.load(session);
  return campaign;
}
test('Early dungeon training applies tiered reductions and does not affect late floors',()=>{
  assert.equal(earlyDungeonFactor(0),.65);
  assert.equal(earlyDungeonFactor(9),.65);
  assert.equal(earlyDungeonFactor(10),.75);
  assert.equal(earlyDungeonFactor(20),.9);
  assert.equal(earlyDungeonFactor(30),1);
});
test('Võ Đạo Các costs resources and persists across a save reload',()=>{
  const c=fixture(),before=itemCount(c.session,'silver');
  c.action('martial_train');
  assert.equal(c.session.adventure.guild.contributions,1);
  assert.equal(itemCount(c.session,'silver'),before-40);
  const saved=c.snapshot(),reloaded=fixture();
  reloaded.load(saved);
  assert.equal(reloaded.session.adventure.guild.contributions,1);
});
test('Võ Đạo upgrade cannot charge money during a pending encounter',()=>{
  const c=fixture();
  c.practice();
  const before=c.snapshot();
  assert.throws(()=>c.action('martial_train'));
  assert.deepEqual(c.snapshot(),before);
});
test('Bầu Cua is virtual-currency-only and limited to 3 daily rounds',()=>{
  const c=fixture();
  for(let i=0;i<3;i++)c.action('bau_cua','cua');
  assert.equal(c.session.adventure.daily.bauCua,3);
  const save=c.snapshot();
  assert.throws(()=>c.action('bau_cua','cua'));
  assert.deepEqual(c.snapshot(),save);
  const reloaded=fixture();reloaded.load(save);
  assert.equal(reloaded.session.adventure.daily.bauCua,3);
});
test('Chapter boss rewards include helmets among generated gear',()=>{
  let helmets=0;
  for(let seed=1;seed<=240;seed++){
    const c=fixture(),ids=bossLoot(c.session,15,seed);
    if(ids.some(id=>EQUIPMENT_BY_ID[id].slot==='helmet'))helmets++;
  }
  assert.ok(helmets>35);
});
