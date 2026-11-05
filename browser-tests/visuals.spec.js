import { test, expect } from '@playwright/test';
import { writeFile } from 'node:fs/promises';

async function ready(page) {
  await page.goto('/?story=legacy');
  await expect(page.locator('#boot-status')).toBeHidden();
  await page.evaluate(() => window.__game.engine.stop());
}
test('all 21 NPC portraits load in a review gallery', async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 1280, height: 1000 });
  await ready(page);
  await page.evaluate(async () => {
    const { NPCS } = await import('/src/data/NPCData.js');
    document.body.style.cssText = 'padding:24px;margin:0;background:#0b2026;color:#efe5cf';
    document.body.replaceChildren();
    const heading = document.createElement('h1'); heading.textContent = 'Người trong câu chuyện';
    heading.style.cssText = 'font:26px Georgia;margin:0 0 24px'; document.body.append(heading);
    const grid = document.createElement('div'); grid.id = 'npc-gallery'; grid.style.cssText = 'display:grid;grid-template-columns:repeat(7,1fr);gap:14px';
    for (const npc of NPCS) {
      const card = document.createElement('article'); card.style.cssText = 'min-width:0;border:1px solid #587771;background:#122e32;border-radius:8px;overflow:hidden';
      const img = document.createElement('img'); img.src = '/' + npc.portrait; img.alt = npc.name; img.style.cssText = 'width:100%;height:210px;object-fit:cover;object-position:center 18%;display:block';
      const name = document.createElement('strong'); name.textContent = npc.name; name.style.cssText = 'display:block;padding:10px 9px 4px;font-size:14px;color:#ebd29b';
      const role = document.createElement('p'); role.textContent = npc.role; role.style.cssText = 'margin:0;padding:0 9px 10px;line-height:1.5;font-size:11px;color:#b4c9ba';
      card.append(img, name, role); grid.append(card);
    }
    document.body.append(grid);
  });
  await expect.poll(() => page.locator('#npc-gallery img').evaluateAll(images => images.length === 21 && images.every(i => i.complete && i.naturalWidth >= 400))).toBe(true);
  await page.screenshot({ path: testInfo.outputPath('npc-gallery.png'), fullPage: true });
});
test('all 139 skill profiles paint with real canvas, preserve transforms and have distinct ultimate silhouettes', async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 1200, height: 900 });
  await ready(page);
  const stats = await page.evaluate(async () => {
    const { SKILL_VISUALS } = await import('/src/data/SkillVisualsData.js');
    const { drawSkillMotif, paintSkillEffect } = await import('/src/ui/SkillEffects.js');
    const hashes = new Set(); let painted = 0;
    for (const profile of SKILL_VISUALS) {
      const canvas = document.createElement('canvas'); canvas.width = 240; canvas.height = 160;
      const ctx = canvas.getContext('2d');
      drawSkillMotif(ctx, profile.motif, 120, 80, 45, .5, profile.primary, profile.secondary);
      if (profile.ultimate) hashes.add(canvas.toDataURL());
      if (ctx.getImageData(0, 0, 240, 160).data.some((n, i) => i % 4 === 3 && n > 0)) painted++;
      for (const t of [.05, .4, .8]) paintSkillEffect(ctx, { profile, origin: { x: 0, y: 1 }, targets: [{ position: { x: 3, y: 1 } }] }, t, p => ({ x: 30 + p.x * 50, y: 30 + p.y * 45 }));
      const matrix = ctx.getTransform();
      if (!matrix.isIdentity) throw Error(`Canvas transform leaked: ${profile.id}`);
    }
    document.body.replaceChildren(); document.body.style.cssText = 'padding:24px;margin:0;background:#0a2026;color:#e5d9bc';
    const title = document.createElement('h1'); title.textContent = 'Dấu ấn riêng của tuyệt kỹ'; title.style.cssText = 'font:26px Georgia;margin:0 0 20px'; document.body.append(title);
    const grid = document.createElement('div'); grid.id = 'effects-gallery'; grid.style.cssText = 'display:grid;grid-template-columns:repeat(4,1fr);gap:12px';
    const owners = ['companion_01', 'companion_02', 'companion_03', 'companion_04', 'companion_14', 'companion_16', 'companion_20', 'companion_43', 'companion_48', 'companion_49', 'companion_50', 'trinh_nghiem'];
    for (const owner of owners) {
      const profile = SKILL_VISUALS.find(v => v.ownerId === owner && v.ultimate);
      const card = document.createElement('article'); card.style.cssText = 'border:1px solid #4b6e67;border-radius:8px;background:#102d32;padding:10px';
      const canvas = document.createElement('canvas'); canvas.width = 250; canvas.height = 140; canvas.style.cssText = 'width:100%;display:block';
      canvas.dataset.owner = owner;
      const ctx = canvas.getContext('2d');
      drawSkillMotif(ctx, profile.motif, 125, 70, 46, .5, profile.primary, profile.secondary);
      const name = document.createElement('p'); name.textContent = profile.name; name.style.cssText = 'margin:0;font-size:13px;text-align:center;line-height:1.7';
      card.append(canvas, name); grid.append(card);
    }
    document.body.append(grid);
    return { count: SKILL_VISUALS.length, painted, silhouettes: hashes.size };
  });
  expect(stats.count).toBe(139); expect(stats.painted).toBe(139); expect(stats.silhouettes).toBeGreaterThanOrEqual(72);
  await page.screenshot({ path: testInfo.outputPath('skill-gallery.png'), fullPage: true });
  const video = await page.evaluate(async () => {
    const { SKILL_VISUALS } = await import('/src/data/SkillVisualsData.js');
    const { paintSkillEffect } = await import('/src/ui/SkillEffects.js');
    const tiles = [...document.querySelectorAll('#effects-gallery canvas')].map(canvas => ({ canvas, profile: SKILL_VISUALS.find(p => p.ownerId === canvas.dataset.owner && p.ultimate) }));
    const output = document.createElement('canvas'); output.width = 1000; output.height = 660;
    const ctx = output.getContext('2d'), stream = output.captureStream(30), chunks = [];
    const recorder = new MediaRecorder(stream, { mimeType: 'video/webm', videoBitsPerSecond: 2000000 });
    recorder.ondataavailable = event => chunks.push(event.data);
    const done = new Promise(resolve => { recorder.onstop = resolve; });
    const start = performance.now(); let raf;
    const draw = now => {
      ctx.fillStyle = '#0a2026'; ctx.fillRect(0, 0, 1000, 660);
      tiles.forEach(({ canvas, profile }, i) => {
        const c = canvas.getContext('2d'), elapsed = (now - start) / 1000;
        c.clearRect(0, 0, 250, 140); c.fillStyle = '#123137'; c.fillRect(0, 0, 250, 140);
        c.fillStyle = '#78bfa5'; c.beginPath(); c.arc(35, 80, 9, 0, Math.PI * 2); c.fill();
        c.fillStyle = '#be8e83'; c.beginPath(); c.arc(185, 80, 9, 0, Math.PI * 2); c.fill();
        const t = (elapsed % (profile.duration + .4)) / profile.duration;
        if (t <= 1) paintSkillEffect(c, { profile, origin: { x: 0, y: 1 }, targets: [{ position: { x: 3, y: 1 } }] }, t, p => ({ x: 35 + p.x * 50, y: 50 + p.y * 30 }));
        const x = (i % 4) * 250, y = Math.floor(i / 4) * 220;
        ctx.drawImage(canvas, x, y + 10); ctx.fillStyle = '#e4dbbd'; ctx.font = '14px system-ui'; ctx.textAlign = 'center';
        ctx.fillText(profile.name, x + 125, y + 177, 235);
      });
      raf = requestAnimationFrame(draw);
    };
    recorder.start(); draw(start);
    await new Promise(resolve => setTimeout(resolve, 4500));
    cancelAnimationFrame(raf); recorder.stop(); await done; stream.getTracks().forEach(track => track.stop());
    return [...new Uint8Array(await new Blob(chunks, { type: 'video/webm' }).arrayBuffer())];
  });
  await writeFile(testInfo.outputPath('skills-motion.webm'), Buffer.from(video));
});
test('real battle effects use NPC identity and actual targets; off/reduced settings remain safe', async ({ page }) => {
  await ready(page);
  const result = await page.evaluate(async () => {
    const { Companion } = await import('/src/entities/Companion.js');
    const { GridSystem } = await import('/src/combat/GridSystem.js');
    const { CombatEngine } = await import('/src/combat/CombatEngine.js');
    const { BattleRenderer } = await import('/src/ui/BattleRenderer.js');
    const { applyStoryIdentity, NPCS_BY_ID } = await import('/src/data/NPCData.js');
    const { paintSkillEffect } = await import('/src/ui/SkillEffects.js');
    const canvas = document.createElement('canvas'); canvas.width = 960; canvas.height = 540;
    const renderer = new BattleRenderer(canvas), grid = new GridSystem();
    const actor = new Companion('companion_12', { id: 'boss', team: 'enemy' });
    applyStoryIdentity(actor, NPCS_BY_ID.trinh_nghiem);
    const target = new Companion('companion_05', { id: 'home' });
    grid.place(actor, { x: 3, y: 1 }); grid.place(target, { x: 2, y: 1 });
    const battle = new CombatEngine({ units: [actor, target], grid, onEvent: e => renderer.event(e) });
    renderer.setBattle(battle); battle.start(); battle.resolveSkill(actor, target, actor.skills.ultimate, true);
    const effect = renderer.skillEffects.find(e => e.profile.ultimate);
    if (effect.profile.motif !== 'blackFan' || effect.targets[0].id !== 'home') throw Error('Wrong visual/target');
    const paintReduced = t => {
      const c = document.createElement('canvas'); c.width = 400; c.height = 240;
      paintSkillEffect(c.getContext('2d'), effect, t, p => ({ x: p.x * 60, y: 120 }), true);
      return c.toDataURL();
    };
    const stable = paintReduced(.2) === paintReduced(.6);
    renderer.render(.1);
    document.body.dataset.cardEffects = 'false'; renderer.render(0);
    battle.resolveSkill(actor, target, actor.skills.ultimate, true);
    return { stable, remaining: renderer.skillEffects.length, targetHp: target.stats.hp, portrait: actor.portrait };
  });
  expect(result.stable).toBe(true); expect(result.remaining).toBe(0);
  expect(result.targetHp).toBeLessThan(1300); expect(result.portrait).toContain('trinh_nghiem.webp');
});
test('four ending screens render individual speakers with portraits and the fifty-companion summary', async ({ page }) => {
  await ready(page);
  const result = await page.evaluate(() => {
    const app = window.__game, old = app.model.session.storyProgress.endingId, results = [];
    for (const id of ['justice', 'wealth', 'retire', 'actor']) {
      app.model.session.storyProgress.endingId = id; app.renderEnding();
      const root = document.getElementById('ending-story');
      results.push({ id, portraits: root.querySelectorAll('.classic-portrait').length, summary: document.getElementById('ending-summary').textContent });
    }
    app.model.session.storyProgress.endingId = old;
    return results;
  });
  expect(result).toHaveLength(4);
  expect(result.every(r => r.portraits >= 3 && r.summary.includes('/50'))).toBe(true);
});
