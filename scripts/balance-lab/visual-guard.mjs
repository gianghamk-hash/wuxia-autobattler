import { execFileSync } from 'node:child_process';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * Balance 8.0 is intentionally data-only. Visual production assets and source
 * are immutable within its PRs. Fail closed for files outside this allowlist.
 */
const safeExact = new Set(['package.json']);
const safePrefixes = [
  'scripts/balance-lab/',
  'tests/balance-',
  'docs/BALANCE_8',
  'reports/balance-8/',
  '.github/workflows/balance-8-'
];
export const isBalanceAllowed = path => {
  const file = String(path).replace(/\\/g, '/');
  if (!file || file.startsWith('/') || file.includes('..') || file.includes('//')) return false;
  return safeExact.has(file) || safePrefixes.some(prefix => file.startsWith(prefix));
};
export function evaluateBalanceDiff(paths) {
  if (!Array.isArray(paths)) throw Error('Expected changed-file list');
  const blocked = [...new Set(paths.filter(path => !isBalanceAllowed(path)))].sort();
  return { allowed: blocked.length === 0, blocked };
}
export function readChangedFiles(base) {
  if (!/^([A-Za-z0-9_./-]+)$/.test(base) || base.includes('..')) throw Error('Invalid git base');
  const data = execFileSync('git', ['diff', '--name-only', '--diff-filter=ACDMRT', base + '...HEAD'],
    { encoding: 'utf8', maxBuffer: 1024 * 1024 });
  return data.split(/\r?\n/).filter(Boolean);
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const base = process.argv[2];
  if (!base) throw Error('Usage: node scripts/balance-lab/visual-guard.mjs origin/main');
  const names = readChangedFiles(base);
  const status = evaluateBalanceDiff(names);
  if (!status.allowed) {
    console.error('Balance 8.0 protected files changed:\n' + status.blocked.map(s => ' - ' + s).join('\n'));
    process.exitCode = 1;
  } else console.log('Balance 8.0 visual/source protection passed for ' + names.length + ' changed files.');
}
