import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { COMPANIONS, COMPANIONS_BY_ID } from '../../src/data/CompanionsData.js';
import { ROLE_GROUPS } from '../../src/data/RoleTags.js';
import { seededRandom } from '../../src/combat/CombatMath.js';
import { SCENARIOS, sampleSquad, simulatePair } from '../balance-6v6.mjs';

const eligibleScenarios = SCENARIOS.filter(s => !s.tier);
const idNumber = id => Number(id.replace('companion_', '')) || 0;
const pick = (array, rng) => array[Math.floor(rng() * array.length)];

export function chooseControl(candidate, roster = COMPANIONS) {
  if (!candidate) throw Error('Unknown companion.');
  const group = ROLE_GROUPS[candidate.role];
  if (!group) throw Error('Unsupported role: ' + candidate.role);
  const sameRole = roster.filter(c => c.id !== candidate.id && ROLE_GROUPS[c.role] === group);
  if (!sameRole.length) throw Error('No role-matched control for ' + candidate.id);
  return [...sameRole].sort((a, b) =>
    Number(a.tier !== candidate.tier) - Number(b.tier !== candidate.tier) ||
    Number(a.sect !== candidate.sect) - Number(b.sect !== candidate.sect) ||
    Math.abs(idNumber(a.id) - idNumber(candidate.id)) - Math.abs(idNumber(b.id) - idNumber(candidate.id)) ||
    a.id.localeCompare(b.id))[0];
}

/** Score a squad across mirrored home/enemy games; draws count half. */
export function pairedScore(games) {
  if (!Array.isArray(games) || games.length !== 2 ||
      !games.some(g => !g.swapped) || !games.some(g => g.swapped))
    throw Error('Expected both mirrored sides.');
  return games.reduce((sum, game) => {
    if (game.winner !== null && game.winner !== undefined &&
        game.winner !== 'home' && game.winner !== 'enemy') throw Error('Invalid winner.');
    const ownSide = game.swapped ? 'enemy' : 'home';
    return sum + (game.winner ? Number(game.winner === ownSide) : .5);
  }, 0) / 2;
}

/** Paired bootstrap: resample fixtures, NEVER individual mirrored games. */
export function pairedSummary(differences, seed = 20261107, replicates = 800) {
  if (!differences.length || differences.some(x => !Number.isFinite(x) || Math.abs(x) > 1))
    throw Error('Expected finite fixture deltas within [-1,1].');
  const avg = xs => xs.reduce((a, b) => a + b, 0) / xs.length;
  const random = seededRandom(seed >>> 0);
  const bootstrap = [];
  for (let r = 0; r < replicates; r++) {
    let sum = 0;
    for (let j = 0; j < differences.length; j++) sum += differences[Math.floor(random() * differences.length)];
    bootstrap.push(sum / differences.length);
  }
  bootstrap.sort((a, b) => a - b);
  return {
    fixtureCount: differences.length,
    averageScoreDelta: +avg(differences).toFixed(4),
    ci95: [bootstrap[Math.floor(.025 * replicates)], bootstrap[Math.floor(.975 * replicates)]].map(x => +x.toFixed(4)),
    method: 'Paired, two-sided fixture bootstrap; score 1 win / 0.5 draw / 0 loss. No causal claims outside matched fixture distribution.'
  };
}

export function runMatchedMatchups({ candidateId, controlId, pairs = 20, seed = 20261107, scenarioId = 'level8' }) {
  if (!Number.isInteger(pairs) || pairs < 1 || pairs > 1000) throw Error('pairs must be 1..1000');
  if (!Number.isSafeInteger(seed) || seed < 0) throw Error('Invalid seed');
  const candidate = COMPANIONS_BY_ID[candidateId];
  if (!candidate) throw Error('Unknown candidate: ' + candidateId);
  const control = controlId ? COMPANIONS_BY_ID[controlId] : chooseControl(candidate);
  if (!control || candidate.id === control.id) throw Error('Invalid control');
  if (ROLE_GROUPS[candidate.role] !== ROLE_GROUPS[control.role])
    throw Error('Control must belong to the same broad combat role');
  const scenario = eligibleScenarios.find(s => s.id === scenarioId);
  if (!scenario) throw Error('Unsupported scenario: ' + scenarioId);
  const random = seededRandom((seed + idNumber(candidateId) * 7919) >>> 0);
  const pool = COMPANIONS.filter(c => c.id !== candidate.id && c.id !== control.id);
  const fixtureDeltas = [], fixtures = [];
  for (let i = 0; i < pairs; i++) {
    const roster = [...pool], others = [];
    while (others.length < 4) others.push(...roster.splice(Math.floor(random() * roster.length), 1));
    const base = sampleSquad(scenario, random);
    // Same exact teammates, ordering, build and opponent for both alternatives.
    const own = { ...base, companions: [candidate.id, ...others.map(c => c.id)] };
    const compared = { ...base, companions: [control.id, ...others.map(c => c.id)] };
    const opponent = sampleSquad(scenario, random);
    const battleSeed = (seed + idNumber(candidate.id) * 100000 + i) >>> 0;
    const candidateGames = simulatePair(own, opponent, scenario, battleSeed);
    const controlGames = simulatePair(compared, opponent, scenario, battleSeed);
    const candidateScore = pairedScore(candidateGames), controlScore = pairedScore(controlGames);
    const delta = candidateScore - controlScore;
    fixtureDeltas.push(delta);
    fixtures.push({
      seed: battleSeed, sect: own.sect, build: own.build,
      teammates: others.map(c => c.id), opponent, order: own.order,
      candidateScore, controlScore, delta,
      candidateDurations: candidateGames.map(g => +g.duration.toFixed(2)),
      controlDurations: controlGames.map(g => +g.duration.toFixed(2))
    });
  }
  const stats = pairedSummary(fixtureDeltas, seed + 31);
  return {
    version: 1, seed, scenario: scenarioId, candidate: { id: candidate.id, name: candidate.name, role: candidate.role, tier: candidate.tier },
    control: { id: control.id, name: control.name, role: control.role, tier: control.tier },
    roleGroup: ROLE_GROUPS[candidate.role],
    warning: candidate.tier !== control.tier ? 'Rarity tiers differ; do not interpret as same-tier balance.' : null,
    ...stats, fixtures
  };
}

export function renderMatchedMarkdown(reports) {
  const rows = reports.map(r => '| ' + r.candidate.name + ' | ' + r.control.name + ' | ' +
    r.roleGroup + ' | ' + r.fixtureCount + ' | ' +
    (100 * r.averageScoreDelta).toFixed(1) + ' pp | [' +
    r.ci95.map(x => (100 * x).toFixed(1)).join(', ') + '] pp |');
  return [
    '# Balance 8.0 — paired replacement matchups', '',
    'Same teammates, opposition, hero build, position and battle seed. Each alternative plays both sides.',
    'Confidence intervals bootstrap entire four-game fixtures, not independent wins.',
    'Comparisons estimate replacement effects for this sampling regime; this is NOT an absolute tier list.',
    '',
    '| Candidate | Control | Role | Fixtures | Score difference | Paired CI 95% |',
    '| --- | --- | --- | ---: | ---: | --- |',
    ...rows, '',
    'Tier differences and matchup dependence must be reviewed before stat tuning.', ''
  ].join('\n');
}
function parseArgs(args) {
  const options = { pairs: 20, seed: 20261107, scenarioId: 'level8' };
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--all') options.all = true;
    else if (arg === '--candidate') options.candidateId = args[++i];
    else if (arg === '--control') options.controlId = args[++i];
    else if (arg === '--pairs') options.pairs = Number(args[++i]);
    else if (arg === '--seed') options.seed = Number(args[++i]);
    else if (arg === '--scenario') options.scenarioId = args[++i];
    else if (arg === '--output') options.output = args[++i];
    else throw Error('Unknown argument: ' + arg);
  }
  if (!options.all && !options.candidateId) throw Error('Pass --candidate companion_XX or --all.');
  if (options.all && options.controlId) throw Error('--control is only valid for one candidate.');
  return options;
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const o = parseArgs(process.argv.slice(2));
  const targets = o.all ? COMPANIONS : [COMPANIONS_BY_ID[o.candidateId]];
  const reports = targets.map(candidate => {
    if (!candidate) throw Error('Unknown candidate: ' + o.candidateId);
    const report = runMatchedMatchups({ ...o, candidateId: candidate.id });
    console.log(candidate.id + ': ' + report.averageScoreDelta + ' [' + report.ci95.join(', ') + ']');
    return report;
  });
  const output = o.output ?? 'reports/balance-8/matched.json';
  mkdirSync(dirname(output), { recursive: true });
  writeFileSync(output, JSON.stringify({ version: 1, reports }, null, 2) + '\n');
  writeFileSync(output.replace(/\.json$/i, '.md'), renderMatchedMarkdown(reports));
  console.log('Saved ' + reports.length + ' comparison(s): ' + output);
}
