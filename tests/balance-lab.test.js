import test from 'node:test';
import assert from 'node:assert/strict';
import { auditBalance, renderMarkdown } from '../scripts/balance-lab/audit.mjs';

const sample = {
  seed: 42, scenarios: [{ id: 'level8', matches: 100, draws: 9,
    units: {
      companion_01: { name: 'Lão Tam Ăn Mày', appearances: 40, score: .65 },
      companion_02: { name: 'Huyền Đạo Trưởng', appearances: 10, score: .2 },
      'VoDang:attack': { appearances: 40, score: .5 }
    }
  }]
};
test('audit validates catalog sizes and reports high-confidence screening flags', () => {
  const result = auditBalance(sample);
  assert.equal(result.rosterSize, 60);
  assert.equal(result.sectCount, 5);
  assert.equal(result.gearCount, 80);
  assert.equal(result.scenarios[0].drawRate, .09);
  assert.equal(result.flags.filter(f => f.kind === 'presence-outlier').length, 1);
  assert.ok(result.flags.some(f => f.kind === 'draw-rate'));
  assert.ok(result.scenarios[0].presence.find(x => x.id === 'companion_02').insufficientSample);
  assert.match(renderMarkdown(result), /NOT independent/);
});
test('audit rejects corrupt scenarios instead of emitting misleading results', () => {
  assert.throws(() => auditBalance({ scenarios: [{ matches: 0, draws: 1, units: {} }] }));
  assert.throws(() => auditBalance({ scenarios: [{id:'x', matches: 5, draws: 7, units: {}}] }), /Invalid/);
});
