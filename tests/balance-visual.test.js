import test from 'node:test';
import assert from 'node:assert/strict';
import { evaluateBalanceDiff, isBalanceAllowed } from '../scripts/balance-lab/visual-guard.mjs';

test('balance-only changes are permitted', () => {
  for (const file of [
    'scripts/balance-lab/matched.mjs',
    'tests/balance-visual.test.js',
    'docs/BALANCE_8_PLAN.md',
    'reports/balance-8/audit.md',
    '.github/workflows/balance-8-guard.yml',
    'package.json'
  ]) assert.equal(isBalanceAllowed(file), true, file);
});
test('visual and unreviewed game source modifications are blocked', () => {
  const blocked = [
    'assets/images/companions/companion_59.webp',
    'assets/models/character.glb',
    'src/ui/CharacterAvatar.js',
    'src/combat/SkillEffectRenderer.js',
    'src/data/CharacterKits7.js',
    'src/data/ProgressionBalance.js',
    'src/render/animation.js',
    'public/character.mp4',
    'index.html',
    'src/core/StorageManager.js'
  ];
  const result = evaluateBalanceDiff(blocked);
  assert.equal(result.allowed, false);
  assert.deepEqual(result.blocked, [...blocked].sort());
});
test('guard rejects traversal and irrelevant files', () => {
  for (const p of ['../assets/fx.png', 'scripts/balance-lab/../../assets/fx.png', '/root/a.js'])
    assert.equal(isBalanceAllowed(p), false);
});
