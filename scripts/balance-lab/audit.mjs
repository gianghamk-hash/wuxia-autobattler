import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { COMPANIONS } from '../../src/data/CompanionsData.js';
import { SECT_IDS } from '../../src/data/SectsData.js';
import { NEW_GEAR } from '../../src/data/GearCatalog.js';

/**
 * Static audit of existing, reproducible simulation reports.
 * Presence score is diagnostic, NOT a causal character win rate.
 * No tuning or game save files are modified.
 */
export const THRESHOLDS = Object.freeze({
  minAppearances: 30,
  lowPresenceScore: 0.42,
  highPresenceScore: 0.58,
  drawRateWatch: 0.08,
  drawRateTarget: 0.05
});

export function auditBalance(report, { thresholds = THRESHOLDS } = {}) {
  if (!report || !Array.isArray(report.scenarios)) throw Error('Invalid 6v6 balance report.');
  const roster = new Map(COMPANIONS.map(c => [c.id, c]));
  const scenarios = [];
  const flags = [];
  for (const scenario of report.scenarios) {
    if (!scenario || !Number.isInteger(scenario.matches) || scenario.matches < 1 ||
        !Number.isInteger(scenario.draws) || scenario.draws < 0 || scenario.draws > scenario.matches ||
        !scenario.units || typeof scenario.units !== 'object') throw Error('Invalid balance scenario.');
    const drawRate = scenario.draws / scenario.matches;
    const presence = [];
    for (const [id, stat] of Object.entries(scenario.units)) {
      if (!roster.has(id) && !/^(ThieuLam|VoDang|CaiBang|NgaMi|DuongMon):/.test(id)) continue;
      if (!Number.isInteger(stat.appearances) || stat.appearances < 1 ||
          !Number.isFinite(stat.score) || stat.score < 0 || stat.score > 1) throw Error('Invalid unit stats: ' + id);
      const entry = {
        id, name: roster.get(id)?.name ?? id,
        role: roster.get(id)?.role ?? 'hero-build',
        appearances: stat.appearances,
        presenceScore: stat.score,
        averageDamage: stat.averageDamage ?? null,
        averageHealing: stat.averageHealing ?? null,
        insufficientSample: stat.appearances < thresholds.minAppearances
      };
      if (!entry.insufficientSample &&
          (entry.presenceScore < thresholds.lowPresenceScore || entry.presenceScore > thresholds.highPresenceScore)) {
        flags.push({ scenario: scenario.id, id, name: entry.name, kind: 'presence-outlier',
          value: entry.presenceScore, appearances: entry.appearances,
          note: 'Screening signal only: paired team composition may confound this score.' });
      }
      presence.push(entry);
    }
    if (drawRate > thresholds.drawRateWatch) flags.push({
      scenario: scenario.id, kind: 'draw-rate', value: drawRate,
      note: 'Investigate timeout, pathfinding, shielding and effective healing before changing stats.'
    });
    scenarios.push({
      id: scenario.id, matches: scenario.matches, draws: scenario.draws, drawRate,
      meanDuration: scenario.meanDuration, p50: scenario.p50, p90: scenario.p90,
      rosterCoverage: presence.filter(p => roster.has(p.id)).length,
      presence: presence.sort((a, b) => a.presenceScore - b.presenceScore)
    });
  }
  return {
    reportVersion: 1,
    baselineSeed: report.seed,
    sourceRules: report.rules ?? null,
    rosterSize: roster.size,
    sectCount: SECT_IDS.length,
    gearCount: NEW_GEAR.length,
    targets: thresholds,
    scenarios, flags,
    interpretation: 'Team-presence screening only. Flags require paired counterfactual and role-matched verification. Do not auto-nerf or auto-buff from these scores.'
  };
}
export function renderMarkdown(audit) {
  const pct = x => (100 * x).toFixed(1) + '%';
  const lines = [
    '# Balance 8.0 — baseline screening',
    '',
    'Seed: ' + audit.baselineSeed + '. Roster: ' + audit.rosterSize + ', sects: ' + audit.sectCount + ', gacha gear: ' + audit.gearCount + '.',
    '',
    '> Presence rates are NOT independent character win rates. This document is an automated diagnostic, not a patch approval.',
    '',
    '| Scenario | Matches | Draw rate | Presence outliers |',
    '| --- | ---: | ---: | ---: |'
  ];
  for (const s of audit.scenarios) lines.push(
    '| ' + s.id + ' | ' + s.matches + ' | ' + pct(s.drawRate) + ' | ' +
    audit.flags.filter(f => f.scenario === s.id && f.kind === 'presence-outlier').length + ' |');
  lines.push('', '## Review flags', '');
  for (const flag of audit.flags) lines.push('- **' + flag.scenario + '** · ' +
    (flag.name ?? flag.kind) + ': ' + pct(flag.value) +
    (flag.appearances ? ' (n=' + flag.appearances + ')' : '') +
    ' — ' + flag.note);
  if (!audit.flags.length) lines.push('No screening flags at the selected thresholds.');
  lines.push('', '## Next validation', '',
    '1. Re-run 6v6 on the latest engine and expanded 8×4 positions.',
    '2. Hold team, gear, level, rank, affinity, seed and spawn constant; swap one unit or one build.',
    '3. Pair both sides and inspect timeout, damage, effective healing, shield and crowd-control events.',
    '4. Add level 30, ranks 1–6, max affinity and mixed four-piece sets before tuning.',
    '5. Do not merge gameplay changes until save/load, combat and Playwright regressions pass.', '');
  return lines.join('\n');
}
function main() {
  const input = process.argv[2] ?? 'reports/balance-7.json';
  const output = process.argv[3] ?? 'reports/balance-8/audit.json';
  const audit = auditBalance(JSON.parse(readFileSync(input, 'utf8')));
  mkdirSync(dirname(output), { recursive: true });
  writeFileSync(output, JSON.stringify(audit, null, 2) + '\n');
  const md = output.replace(/\.json$/i, '.md');
  writeFileSync(md, renderMarkdown(audit));
  process.stdout.write('Balance audit saved: ' + output + ' and ' + md + '\n');
}
if (process.argv[1] && import.meta.url === new URL('file://' + process.argv[1]).href) main();
