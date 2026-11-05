import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { NPCS, findNPC, storyEnemy, applyStoryIdentity } from '../src/data/NPCData.js';
import { STORY_REWRITES } from '../src/data/StoryRewriteData.js';
import { CHAPTERS } from '../src/data/StoryChaptersData.js';
import { MAIN_QUESTS } from '../src/data/QuestsData.js';
import { COMPANIONS } from '../src/data/CompanionsData.js';
import { Companion } from '../src/entities/Companion.js';
import { SKILL_VISUALS, getSkillVisual } from '../src/data/SkillVisualsData.js';
import { CombatEngine } from '../src/combat/CombatEngine.js';
import { GridSystem } from '../src/combat/GridSystem.js';
import { STORY_ENDINGS } from '../src/data/StoryEndings.js';

test('all 240 episodes use the rewrite, clear goals and concrete previous events; every speaking NPC has a portrait identity', () => {
  assert.equal(Object.keys(STORY_REWRITES).length, 12);
  for (const c of CHAPTERS) {
    assert.equal(c.scenes.length, 20);
    assert.ok(c.scenes.every(s => s.length === 4 && s.every(part => part.trim())));
    assert.equal(c.summary, STORY_REWRITES[c.number].summary);
  }
  for (const q of MAIN_QUESTS) {
    assert.ok(q.chapterGoal && q.chapterSummary && q.previous);
    for (const [speaker, text] of q.lines) {
      assert.ok(!/\sBạn:\s/.test(text), q.id);
      assert.ok(['Bạn', 'Người kể'].includes(speaker) || findNPC(speaker) || COMPANIONS.some(c => c.name === speaker || c.name.startsWith(speaker + ' ')), `${q.id}: ${speaker}`);
    }
    if (q.episode > 1) assert.equal(q.previous, CHAPTERS[q.chapter - 1].scenes[q.episode - 2][1]);
  }
});
test('21 NPC images match their manifest, have distinct content, and retain known aliases', async () => {
  const manifest = JSON.parse(await readFile(new URL('../assets/images/npcs/manifest.json', import.meta.url), 'utf8'));
  assert.equal(NPCS.length, 21); assert.equal(manifest.length, 21);
  const hashes = [];
  for (const npc of NPCS) {
    const bytes = await readFile(new URL('../' + npc.portrait, import.meta.url));
    const hash = createHash('sha256').update(bytes).digest('hex');
    assert.equal(manifest.find(m => m.id === npc.id).sha256, hash);
    assert.equal(bytes.subarray(8, 12).toString(), 'WEBP'); hashes.push(hash);
  }
  assert.equal(new Set(hashes).size, 21);
  assert.equal(findNPC('Trấn thủ').id, 'doc_le');
  assert.equal(findNPC('Cô gái').id, 'co_gai');
});
test('all four endings use separate readable speaker turns with known character identities', () => {
  assert.deepEqual(Object.keys(STORY_ENDINGS).sort(), ['actor', 'justice', 'retire', 'wealth']);
  for (const lines of Object.values(STORY_ENDINGS)) {
    assert.ok(lines.length >= 8);
    for (const [speaker, text] of lines) {
      assert.ok(!/\sBạn:\s/.test(text));
      assert.ok(['Bạn', 'Người kể'].includes(speaker) || findNPC(speaker) || COMPANIONS.some(c => c.name === speaker || c.name.startsWith(speaker + ' ')), speaker);
    }
  }
});
test('story bosses use their own names and portraits without changing statistics or underlying effects', () => {
  for (const [chapter, id] of [[1, 'doi_truong'], [4, 'doc_le'], [5, 'kha_van'], [8, 'do_mau'], [11, 'trinh_nghiem']]) {
    const q = MAIN_QUESTS.find(q => q.chapter === chapter && q.boss);
    assert.ok(q);
    const npc = storyEnemy(q, 2, 3), unit = new Companion('companion_01');
    const stats = structuredClone(unit.stats), effects = structuredClone(unit.skills.ultimate.effects);
    applyStoryIdentity(unit, npc);
    assert.equal(unit.characterId, id); assert.equal(unit.portrait, npc.portrait);
    assert.deepEqual(unit.stats, stats); assert.deepEqual(unit.skills.ultimate.effects, effects);
    assert.ok(getSkillVisual({ ownerId: id, skillId: unit.skills.ultimate.id }));
  }
});
test('all companion attacks and ultimates have authored profiles; advanced and NPC motifs are covered', () => {
  for (const companion of COMPANIONS) for (const skill of Object.values(companion.skills)) {
    assert.ok(getSkillVisual({ ownerId: companion.id, skillId: skill.id }), companion.id);
  }
  assert.equal(new Set(SKILL_VISUALS.map(v => v.id)).size, SKILL_VISUALS.length);
  assert.ok(new Set(SKILL_VISUALS.filter(v => v.ultimate).map(v => v.motif)).size >= 67);
  assert.ok(SKILL_VISUALS.every(v => v.duration > 0 && v.primary && v.secondary && v.path));
});
test('real skill cast events carry immutable origin and actual target positions, including multi-target attacks', () => {
  const grid = new GridSystem();
  const caster = new Companion('companion_04', { id: 'caster' });
  const enemies = [0, 1, 2].map(i => new Companion('companion_05', { id: `enemy${i}`, team: 'enemy' }));
  grid.place(caster, { x: 2, y: 1 }); enemies.forEach((u, i) => grid.place(u, { x: 3, y: i }));
  const battle = new CombatEngine({ units: [caster, ...enemies], grid });
  battle.start(); battle.resolveSkill(caster, enemies[1], caster.skills.ultimate, true);
  const cast = battle.events.find(e => e.type === 'skill:cast');
  assert.equal(cast.skillId, 'companion_04_ult'); assert.equal(cast.targets.length, 3);
  assert.deepEqual(cast.origin, { x: 2, y: 1 });
  caster.gridPosition.x = 0;
  assert.equal(cast.origin.x, 2);
  assert.ok(getSkillVisual(cast));
});
