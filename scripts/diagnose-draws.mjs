import { readFileSync, writeFileSync } from 'node:fs';
import {
  Worker,
  isMainThread,
  parentPort,
  workerData
} from 'node:worker_threads';
import { makeSquad } from './balance-6v6.mjs';
import { CombatEngine } from '../src/combat/CombatEngine.js';
import { GridSystem } from '../src/combat/GridSystem.js';
if (!isMainThread) {
  const { scenario } = workerData,
    rows = [];
  for (const pair of scenario.records)
    for (const game of pair.games.filter((g) => g.reason === 'timeout')) {
      const grid = new GridSystem(),
        units = [
          ...makeSquad(game.swapped ? pair.b : pair.a, scenario, 'home', grid),
          ...makeSquad(game.swapped ? pair.a : pair.b, scenario, 'enemy', grid)
        ];
      const late = { damage: 0, healing: 0, absorbed: 0, misses: 0 };
      const b = new CombatEngine({
        units,
        grid,
        seed: pair.seed,
        overtime: false,
        yielding: false,
        onEvent: (e) => {
          if (e.time >= 90) {
            if (e.type === 'damage') {
              late.damage += e.amount;
              late.absorbed += e.absorbed;
            }
            if (e.type === 'heal') late.healing += e.amount;
            if (e.type === 'miss') late.misses++;
          }
        }
      });
      b.start();
      while (b.state === 'running') b.update(0.25);
      rows.push({
        seed: pair.seed,
        swapped: game.swapped,
        result: b.result.reason,
        late,
        units: b.result.statistics
      });
    }
  parentPort.postMessage({ id: scenario.id, rows });
} else {
  const baseline = JSON.parse(readFileSync('reports/balance-6v6.json', 'utf8')),
    results = new Array(baseline.scenarios.length);
  let next = 0;
  await Promise.all(
    Array.from({ length: 4 }, async () => {
      while (next < baseline.scenarios.length) {
        const i = next++;
        results[i] = await new Promise((resolve, reject) => {
          const w = new Worker(new URL(import.meta.url), {
            workerData: { scenario: baseline.scenarios[i] }
          });
          w.once('message', resolve);
          w.once('error', reject);
          w.once('exit', (code) => {
            if (code) reject(Error('worker ' + code));
          });
        });
        console.log(results[i].id, results[i].rows.length);
      }
    })
  );
  const rows = results.flatMap((s) => s.rows),
    survivors = rows.flatMap((r) => r.units.filter((u) => u.alive));
  const sum = (list, key) => list.reduce((a, r) => a + (r[key] ?? 0), 0);
  const summary = {
    draws: rows.length,
    reproduced: rows.filter((r) => r.result === 'timeout').length,
    healingDominatedLate: rows.filter(
      (r) => r.late.healing > r.late.damage * 0.5
    ).length,
    survivorsWithBlockedOver10s: survivors.filter((u) => u.blockedTime > 10)
      .length,
    survivors: survivors.length,
    late: Object.fromEntries(
      ['damage', 'healing', 'absorbed', 'misses'].map((k) => [
        k,
        sum(
          rows.map((r) => r.late),
          k
        )
      ])
    ),
    averageSurvivorHpRatio:
      survivors.reduce((a, u) => a + u.finalHp / u.maxHp, 0) / survivors.length
  };
  writeFileSync(
    'reports/draw-diagnosis.json',
    JSON.stringify({ summary, scenarios: results }, null, 2) + '\n'
  );
  console.log(summary);
}
