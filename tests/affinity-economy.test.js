import test from 'node:test';
import assert from 'node:assert/strict';
import {
  vietnamDay, affinityRate, newAffinityLedger, grantAffinity
} from '../src/core/AffinityEconomy.js';
const at = (s) => Date.parse(s);
const t = at('2026-11-07T10:00:00Z');
function award(ledger, source, id, timestamp = t) {
  return grantAffinity(ledger, { source, eventId: id, timestamp });
}
test('Vietnam calendar boundary, not UTC midnight', () => {
  assert.equal(vietnamDay(at('2026-11-07T16:59:59Z')), '2026-11-07');
  assert.equal(vietnamDay(at('2026-11-07T17:00:00Z')), '2026-11-08');
});
test('rate decreases at exact 25/50/75 thresholds', () => {
  assert.deepEqual([0, 2499, 2500, 5000, 7500, 10000].map(affinityRate), [100,100,75,50,25,25]);
});
test('battle cap and duplicate event protection', () => {
  let s = newAffinityLedger(15);
  for (let i=0;i<10;i++) s=award(s,'battle','fight-'+i).ledger;
  assert.equal(s.points100,1800);
  assert.equal(s.daily.battle,300);
  const old=s;
  const duplicate=award(s,'battle','fight-1');
  assert.equal(duplicate.duplicate,true);
  assert.equal(duplicate.ledger,old);
});
test('gift cap is independent and resets at Vietnam midnight', () => {
  let s=newAffinityLedger(15);
  s=award(s,'favoriteGift','gift1').ledger;
  s=award(s,'favoriteGift','gift2').ledger;
  assert.equal(s.points100,1700);
  assert.equal(s.daily.gift,200);
  s=award(s,'gift','gift3',at('2026-11-07T17:00:00Z')).ledger;
  assert.equal(s.points100,1800);
  assert.equal(s.daily.gift,100);
});
test('higher tiers grant less, but quest reward is not diminished', () => {
  const high=award(newAffinityLedger(75),'battle','battle').ledger;
  assert.equal(high.points100,7525);
  const quest=award(high,'quest','quest1').ledger;
  assert.equal(quest.points100,7925);
});
test('never exceed maximum and never mutate input', () => {
  const original=newAffinityLedger(99.9);
  const result=award(original,'quest','end');
  assert.equal(result.ledger.points100,10000);
  assert.equal(original.points100,9990);
});
test('invalid sources and IDs cannot grant affinity', () => {
  assert.throws(()=>grantAffinity(newAffinityLedger(),{source:'unknown',eventId:'x',timestamp:t}));
  assert.throws(()=>grantAffinity(newAffinityLedger(),{source:'battle',timestamp:t}));
});
