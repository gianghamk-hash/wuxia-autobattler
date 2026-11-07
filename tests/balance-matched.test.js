import test from 'node:test';
import assert from 'node:assert/strict';
import { chooseControl, pairedScore, pairedSummary, runMatchedMatchups, renderMatchedMarkdown } from '../scripts/balance-lab/matched.mjs';
import { COMPANIONS_BY_ID } from '../src/data/CompanionsData.js';
import { ROLE_GROUPS } from '../src/data/RoleTags.js';

test('the 60-character roster has a broad-role control for every character', () => {
  for (let id = 1; id <= 60; id++) {
    const candidate = COMPANIONS_BY_ID['companion_' + String(id).padStart(2, '0')];
    assert.ok(candidate, 'missing companion ' + id);
    const control = chooseControl(candidate);
    assert.notEqual(control.id, candidate.id);
    assert.equal(ROLE_GROUPS[control.role], ROLE_GROUPS[candidate.role]);
  }
});

test('mirrored scores use the candidate side, not home side', () => {
  assert.equal(pairedScore([{swapped:false,winner:'home'},{swapped:true,winner:'enemy'}]), 1);
  assert.equal(pairedScore([{swapped:false,winner:'enemy'},{swapped:true,winner:'home'}]), 0);
  assert.equal(pairedScore([{swapped:false,winner:null},{swapped:true,winner:'enemy'}]), .75);
  assert.throws(() => pairedScore([{swapped:false,winner:'home'}]), /mirrored/);
});

test('paired bootstrap is deterministic and preserves fixture count', () => {
  const a = pairedSummary([.5, -.5, 0, .5], 17, 120);
  assert.deepEqual(a, pairedSummary([.5, -.5, 0, .5], 17, 120));
  assert.equal(a.fixtureCount, 4);
  assert.equal(a.averageScoreDelta, .125);
  assert.ok(a.ci95[0] <= a.averageScoreDelta && a.ci95[1] >= a.averageScoreDelta);
});

test('combat integration: replacement comparison executes identical paired fixtures', () => {
  const r = runMatchedMatchups({candidateId:'companion_03',controlId:'companion_11',pairs:1,seed:20261107});
  assert.equal(r.fixtureCount, 1);
  assert.equal(r.fixtures.length, 1);
  assert.equal(r.fixtures[0].teammates.length, 4);
  assert.ok(r.averageScoreDelta >= -1 && r.averageScoreDelta <= 1);
  assert.match(renderMatchedMarkdown([r]), /paired replacement/);
});
