import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';
import { simulatePair } from './balance-6v6.mjs';
const report = JSON.parse(readFileSync(process.argv[2] ?? 'reports/balance-6v6.json', 'utf8'));
assert.equal(report.matches, report.scenarios.reduce((n, s) => n + s.matches, 0));
for (const scenario of report.scenarios) {
  assert.equal(scenario.records.length, scenario.pairs);
  assert.equal(scenario.matches, scenario.pairs * 2);
  assert.equal(Object.values(scenario.units).reduce((n, u) => n + u.appearances, 0), scenario.matches * 12);
  assert.equal(scenario.draws, scenario.records.flatMap(r => r.games).filter(g => !g.winner).length);
  const first = scenario.records[0];
  const replay = simulatePair(first.a, first.b, scenario, first.seed).map(({ statistics, ...summary }) => summary);
  assert.deepEqual(replay, first.games);
  console.log(`Verified totals and replay: ${scenario.id}`);
}
