import test from 'node:test';
import assert from 'node:assert/strict';
import {Campaign,createCampaign,itemCount} from '../src/core/Campaign.js';
import {give} from '../src/core/WorldProgress.js';

function setup(){
  const c=new Campaign({now:()=>Date.UTC(2026,10,7,6)});
  const s=createCampaign({sect:'VoDang'});
  give(s,'silver',5000);
  c.load(s);
  return c;
}
test('daily check-in triples both silver and herb; only one grant per day',()=>{
  const c=setup(),silver=itemCount(c.session,'silver'),herbs=itemCount(c.session,'herb');
  c.action('checkin');
  assert.equal(itemCount(c.session,'silver')-silver,21);
  assert.equal(itemCount(c.session,'herb')-herbs,3);
  const after=c.snapshot();
  assert.throws(()=>c.action('checkin'));
  assert.deepEqual(c.snapshot(),after);
});
test('daily and weekly task silver payouts are exactly tripled with claim idempotence',()=>{
  const c=setup();
  c.action('checkin'); // initialize Vietnam day/week before modifying task counters
  c.session.adventure.daily.wins=3;
  const silver=itemCount(c.session,'silver');
  c.action('claim','daily_battle');
  assert.equal(itemCount(c.session,'silver')-silver,36);
  assert.throws(()=>c.action('claim','daily_battle'));
  c.session.adventure.weekly.wins=15;
  const next=itemCount(c.session,'silver');
  c.action('claim','weekly_battle');
  assert.equal(itemCount(c.session,'silver')-next,210);
});
test('variable Bau Cua stake pays 2x for each matching die, and never allows overspending',()=>{
  const c=setup(),before=itemCount(c.session,'silver'),stake=37;
  const text=c.action('bau_cua',{face:'cua',stake});
  const m=text.match(/trúng ([0-9]+); thưởng ([0-9]+); lãi (-?[0-9]+)/);
  assert.ok(m,text);
  const hits=Number(m[1]),payout=Number(m[2]),net=Number(m[3]);
  assert.ok(hits>=0&&hits<=3);assert.equal(payout,stake*hits*2);assert.equal(net,payout-stake);
  assert.equal(itemCount(c.session,'silver'),before+net);
  for(const invalid of [{face:'cua',stake:0},{face:'cua',stake:1.2},{face:'nope',stake:10},{face:'cua',stake:9999999}]){
    const snapshot=c.snapshot();assert.throws(()=>c.action('bau_cua',invalid));assert.deepEqual(c.snapshot(),snapshot);
  }
  c.action('bau_cua',{face:'bau',stake:50});c.action('bau_cua',{face:'nai',stake:100});
  const saved=c.snapshot();assert.throws(()=>c.action('bau_cua',{face:'tom',stake:1}));assert.deepEqual(c.snapshot(),saved);
  const next=setup();next.load(saved);assert.equal(next.session.adventure.daily.bauCua,3);
});
test('legacy Bau Cua string action still uses five silver for backward compatibility',()=>{
  const c=setup(),start=itemCount(c.session,'silver');
  const message=c.action('bau_cua','ga');
  assert.match(message,/cược 5;/);
  assert.ok(itemCount(c.session,'silver')>=start-5);
});
