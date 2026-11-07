import test from 'node:test';
import assert from 'node:assert/strict';
import { awardCampaignAffinity, validateAffinityLedgers } from '../src/core/CampaignAffinity.js';
const t=Date.parse('2026-11-07T10:00:00Z');
function session(points=15) { return {party:{unlocked:['companion_01']},companionsAffinity:{companion_01:points}}; }
test('legacy saves retain existing affinity and initialize ledger only after first award',()=>{
 const s=session(90);assert.equal(s.affinityLedgers,undefined);
 assert.equal(awardCampaignAffinity(s,'companion_01','battle','battle:1',t),25);
 assert.equal(s.companionsAffinity.companion_01,90.25);validateAffinityLedgers(s);
});
test('repeated battle token never grants twice',()=>{
 const s=session();awardCampaignAffinity(s,'companion_01','battle','battle:1',t);
 assert.equal(awardCampaignAffinity(s,'companion_01','battle','battle:1',t),0);
 assert.equal(s.companionsAffinity.companion_01,16);
});
test('gift daily cap is respected and existing 100 remains untouched',()=>{
 const s=session(99);assert.equal(awardCampaignAffinity(s,'companion_01','gift','gift:1',t),25);
 assert.equal(awardCampaignAffinity(s,'companion_01','gift','gift:2',t),25);
 assert.equal(awardCampaignAffinity(s,'companion_01','gift','gift:3',t),0);
 const max=session(100);assert.equal(awardCampaignAffinity(max,'companion_01','battle','battle:2',t),0);
});
test('legacy story increases are reconciled without rollback',()=>{
 const s=session(20);awardCampaignAffinity(s,'companion_01','gift','gift:1',t);
 s.companionsAffinity.companion_01+=1;
 validateAffinityLedgers(s);
 awardCampaignAffinity(s,'companion_01','battle','battle:2',t);
 assert.equal(s.companionsAffinity.companion_01,23);
});
