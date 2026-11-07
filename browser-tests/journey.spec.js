import { test, expect } from './fixtures.js';
import { writeFile } from 'node:fs/promises';
async function start(page) {
  await page.goto('/?story=legacy');
  await expect(page.locator('#boot-status')).toBeHidden();
  await page.locator('#hero-name').fill('Trần Phong');
  await page.locator('[data-sect-pick="VoDang"]').click();
  await page.locator('#btn-new-game').click();
}
async function last(page) {
  for (
    let i = 0;
    i < 100 && (await page.locator('#dialogue-next').isEnabled());
    i++
  )
    await page.locator('#dialogue-next').click();
}
async function chapter(page, number = 12) {
  await page.evaluate(async (number) => {
    const app = window.__game,
      { MAIN_QUESTS } = await import('/src/data/QuestsData.js'),
      { BOND_VARIANTS } = await import('/src/data/BondsData.js');
    const s = app.model.snapshot(),
      q = MAIN_QUESTS.find((q) => q.chapter === number);
    Object.assign(s.storyProgress, {
      currentAct: q.act,
      currentChapter: q.chapter,
      currentEpisode: q.episode,
      activeQuestId: q.id,
      completedQuests: MAIN_QUESTS.filter((q) => q.chapter < number).map(
        (q) => q.id
      )
    });
    s.party.unlocked = Object.keys(BOND_VARIANTS);
    s.companionsAffinity = Object.fromEntries(
      s.party.unlocked.map((id) => [id, 100])
    );
    s.party.active = [];
    s.party.formation = { hero: { x: 1, y: 1 } };
    app.model.load(s);
    app.model.setParty(s.party.unlocked);
  }, number);
}
test('reader remembers its page after autosave/reload, preserves old font settings and exposes no font-size selector', async ({
  page
}, testInfo) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await start(page);
  await page.locator('#btn-main-quest').click();
  await page.locator('#dialogue-next').click();
  await page.locator('#dialogue-next').click();
  const line = await page.locator('#dialogue-text').textContent(),
    story = await page.evaluate(() =>
      JSON.stringify(window.__game.model.session.storyProgress)
    );
  await expect(page.getByLabel('Cỡ chữ lời thoại')).toHaveCount(0);
  await page.getByText('Lịch sử lời thoại', { exact: true }).click();
  await expect(page.locator('.reader-history li')).toHaveCount(3);
  await expect
    .poll(() =>
      page.evaluate(async () => {
        const { StorageManager } = await import('/src/core/StorageManager.js');
        const sm = new StorageManager();
        try {
          return (await sm.load(0))?.data.journey?.reader.fontSize;
        } finally {
          sm.db?.close();
        }
      })
    )
    .toBe(18);
  await page.reload();
  await expect(page.locator('#boot-status')).toBeHidden();
  await page.locator('#btn-continue').click();
  await page.locator('#btn-main-quest').click();
  await expect(page.locator('#dialogue-text')).toHaveText(line);
  await expect(page.getByLabel('Cỡ chữ lời thoại')).toHaveCount(0);
  expect(
    await page.evaluate(() =>
      JSON.stringify(window.__game.model.session.storyProgress)
    )
  ).toBe(story);
  await page.screenshot({
    path: testInfo.outputPath('reader-mobile.png'),
    fullPage: true
  });
});
test('three formation slots and all five bond arcs are usable through real controls, rewards replay read-only', async ({
  page
}, testInfo) => {
  await start(page);
  await chapter(page);
  await page.locator('[data-view="roster"]').first().click();
  await expect(page.locator('#journey-roster .loadout-row')).toHaveCount(3);
  await page.getByLabel('Tên đội 1').fill('Giữ quán');
  await page
    .locator('#journey-roster')
    .getByRole('button', { name: 'Lưu đội', exact: true })
    .first()
    .click();
  await page.evaluate(() => window.__game.model.setParty(['companion_01']));
  await page
    .locator('#journey-roster')
    .getByRole('button', { name: 'Dùng đội', exact: true })
    .first()
    .click();
  expect(
    await page.evaluate(() => window.__game.model.session.party.active.length)
  ).toBe(5);
  await page.locator('[data-view="tavern"]').first().click();
  await page.getByRole('button', { name: 'Đồng hành', exact: true }).click();
  await expect(page.locator('.bond-card')).toHaveCount(5);
  const inventory = await page.evaluate(() =>
    JSON.stringify(window.__game.model.session.inventory)
  );
  // First companion: play all three, then switch and replay without a second award.
  for (let stage = 0; stage < 3; stage++) {
    await page
      .locator('.bond-card')
      .first()
      .getByRole('button', { name: /^Trò chuyện/ })
      .first()
      .click();
    await last(page);
    await page.locator('[data-choice="listen"]').click();
    await last(page);
    await page
      .getByRole('button', { name: 'Về doanh trại', exact: true })
      .click();
  }
  const card = page.locator('.bond-card').first();
  await expect(card).toContainText('Người giữ đường về');
  await card.getByRole('button', { name: 'Chiêu gốc', exact: true }).click();
  expect(
    await page.evaluate(
      () => window.__game.model.session.journey.bonds.modes.companion_01
    )
  ).toBe('base');
  await card
    .getByRole('button', { name: 'Xem lại', exact: false })
    .first()
    .click();
  await last(page);
  await expect(page.locator('[data-choice]')).toHaveCount(0);
  expect(
    await page.evaluate(() =>
      JSON.stringify(window.__game.model.session.inventory)
    )
  ).toBe(inventory);
  await page
    .getByRole('button', { name: 'Về doanh trại', exact: true })
    .click();
  await page.screenshot({
    path: testInfo.outputPath('bonds-desktop.png'),
    fullPage: true
  });
});
test('eight locations, twelve expressions and eight transparent six-pose fighters load and render without missing assets', async ({
  page
}, testInfo) => {
  await start(page);
  await page.evaluate(() => window.__game.engine.stop());
  const result = await page.evaluate(async () => {
    const manifest = await (
      await fetch('/assets/images/polish-manifest.json')
    ).json();
    const gallery = document.createElement('section');
    gallery.id = 'polish-gallery';
    gallery.style.cssText =
      'position:relative;z-index:50;background:#183a39;color:#eee;display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px;padding:16px';
    document.body.replaceChildren(gallery);
    const rows = [];
    for (const row of manifest) {
      const im = new Image();
      im.src = '/' + row.file;
      await im.decode();
      const figure = document.createElement('figure');
      figure.style.cssText = 'margin:0;min-width:0';
      const c = document.createElement('canvas');
      c.width = row.kind === 'sprite' ? 512 : 300;
      c.height = row.kind === 'sprite' ? 512 : 210;
      c.style.cssText =
        'width:100%;height:210px;object-fit:contain;background:#b3c9b9';
      const ctx = c.getContext('2d');
      let transparent = 0,
        cells = 0;
      if (row.kind === 'sprite') {
        c.width = im.width;
        c.height = im.height;
        ctx.drawImage(im, 0, 0);
        const data = ctx.getImageData(0, 0, c.width, c.height).data;
        for (let i = 3; i < data.length; i += 4)
          if (data[i] < 10) transparent++;
        for (let y = 0; y < 2; y++)
          for (let x = 0; x < 3; x++) {
            const pixels = ctx.getImageData(
              (x * im.width) / 3,
              (y * im.height) / 2,
              im.width / 3,
              im.height / 2
            ).data;
            if (pixels.some((v, i) => i % 4 === 3 && v > 200)) cells++;
          }
      } else ctx.drawImage(im, 0, 0, c.width, c.height);
      const label = document.createElement('figcaption');
      label.textContent = row.id;
      figure.append(c, label);
      gallery.append(figure);
      rows.push({
        id: row.id,
        kind: row.kind,
        width: im.width,
        height: im.height,
        transparent,
        cells
      });
    }
    return rows;
  });
  expect(result).toHaveLength(27);
  for (const row of result.filter((r) => r.kind === 'sprite')) {
    expect(row.cells).toBe(6);
    expect(row.transparent).toBeGreaterThan(100000);
    expect(row.width / 3).toBe(row.height / 2);
  }
  await page.setViewportSize({ width: 1280, height: 1100 });
  await page.screenshot({
    path: testInfo.outputPath('polish-assets.png'),
    fullPage: true
  });
});
test('boss warnings, focus controls, falling frames and reduced-motion battle are visible on mobile', async ({
  page
}, testInfo) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await start(page);
  await chapter(page, 8);
  const result = await page.evaluate(async () => {
    const app = window.__game;
    app.engine.stop();
    const { Companion } = await import('/src/entities/Companion.js'),
      { Hero } = await import('/src/entities/Hero.js'),
      { CombatEngine } = await import('/src/combat/CombatEngine.js'),
      { GridSystem } = await import('/src/combat/GridSystem.js'),
      { applyStoryIdentity, NPCS_BY_ID } = await import('/src/data/NPCData.js');
    const grid = new GridSystem(),
      home = new Hero('VoDang'),
      boss = new Companion('companion_01', { id: 'boss', team: 'enemy' });
    applyStoryIdentity(boss, NPCS_BY_ID.do_mau);
    for (const u of [home, boss]) {
      u.stats.maxHp = 100000;
      u.stats.hp = 100000;
      u.stats.physicalAtk = 0;
      u.stats.magicalAtk = 0;
    }
    grid.place(home, { x: 2, y: 1 });
    grid.place(boss, { x: 3, y: 1 });
    const battle = new CombatEngine({
      units: [home, boss],
      grid,
      onEvent: (e) => app.battleEvent(e)
    });
    app.model.battle = battle;
    battle.encounterName = 'Hoa Lư · thử cơ chế Ấn';
    battle.start();
    app.enterBattle();document.querySelector('#prebattle-dialog [data-start-battle]')?.click();
    app.renderer.environment.src = new URL(
      '/assets/images/scenes/hoa_lu.webp',
      location.href
    ).href;
    boss.stats.hp = 60000;
    battle.update(0.1);
    app.updateBattleStatus();
    app.renderer.resize();
    app.renderer.render(0.016);
    return { boss: boss.id };
  });
  await expect(page.locator('#battle-warnings')).toContainText('Ấn thu tô');
  await page.evaluate(async () => {
    await new Promise((resolve) =>
      requestAnimationFrame(() => requestAnimationFrame(resolve))
    );
    const r = window.__game.renderer;
    r.render(0);
    await Promise.all(
      [
        ...r.fighters.values(),
        ...r.companionImages.values(),
        r.environment,
        r.atlas
      ].map((im) => im.decode())
    );
    r.render(0);
    document.getElementById('app-message').dataset.visible = 'false';
    // Keep visual redraws running while the combat fixture is paused, including screenshot resize.
    const paint = () => {
      r.render(1 / 60);
      requestAnimationFrame(paint);
    };
    requestAnimationFrame(paint);
  });
  expect(
    await page.locator('#game-canvas').evaluate((c) =>
      c
        .getContext('2d')
        .getImageData(0, 0, c.width, c.height)
        .data.some((v, i) => i % 4 === 3 && v > 0)
    )
  ).toBe(true);
  await page.screenshot({
    path: testInfo.outputPath('boss-warning-mobile.png'),
    fullPage: true,
    animations: 'disabled'
  });
  await page.evaluate(() => {
    const app = window.__game;
    app.model.battle.update(3.2);
    app.updateBattleStatus();
    app.renderer.render(0.2);
  });
  await expect(page.locator('[data-focus^="boss_add_"]')).toHaveCount(1);
  await page.locator('[data-focus^="boss_add_"]').click();
  await expect(page.locator('[data-focus^="boss_add_"]')).toHaveAttribute(
    'aria-pressed',
    'true'
  );
  const poses = await page.evaluate(() => {
    const app = window.__game,
      r = app.renderer,
      b = app.model.battle,
      u = b.units[0];
    r.render(0.1);
    r.event({ type: 'cast', actorId: u.id, ultimate: true });
    const cast = r.poses.get(u.id).frame;
    r.event({
      type: 'damage',
      targetId: u.id,
      crit: true,
      position: u.gridPosition,
      amount: 1
    });
    const hit = r.poses.get(u.id).frame;
    r.event({ type: 'death', targetId: u.id });
    return { cast, hit, fallen: r.fallen.length, hp: u.stats.hp };
  });
  expect(poses.cast).toBe(3);
  expect(poses.hit).toBe(4);
  expect(poses.fallen).toBe(1);
  expect(poses.hp).toBe(100000);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const stable = await page.evaluate(() => {
    const r = window.__game.renderer;
    document.body.dataset.cardEffects = 'false';
    r.floating = [];
    r.render(0.01);
    const a = r.canvas.toDataURL();
    r.render(0.6);
    return a === r.canvas.toDataURL();
  });
  expect(stable).toBe(true);
  expect(result.boss).toBe('boss');
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth
    )
  ).toBe(true);
});
test('real six versus six battle produces a motion review clip with independent visual timing', async ({
  page
}, testInfo) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await start(page);
  await chapter(page, 11);
  await page.evaluate(async () => {
    const app = window.__game;
    app.engine.stop();
    const { Companion } = await import('/src/entities/Companion.js'),
      { Hero } = await import('/src/entities/Hero.js'),
      { CombatEngine } = await import('/src/combat/CombatEngine.js'),
      { GridSystem } = await import('/src/combat/GridSystem.js'),
      { applyStoryIdentity, NPCS_BY_ID } = await import('/src/data/NPCData.js');
    const grid = new GridSystem(),
      units = [];
    for (const side of ['home', 'enemy']) {
      const team = [
        new Hero(side === 'home' ? 'VoDang' : 'ThieuLam', {
          id: side === 'home' ? 'hero' : 'enemy_hero',
          team: side,
          level: 8
        }),
        ...[
          'companion_01',
          'companion_03',
          'companion_04',
          'companion_08',
          'companion_02'
        ].map(
          (id) =>
            new Companion(id, { id: side + '_' + id, team: side, level: 8 })
        )
      ];
      if (side === 'enemy')
        applyStoryIdentity(team[5], NPCS_BY_ID.trinh_nghiem);
      team.forEach((u, i) => {
        const p = { x: i < 3 ? 2 : 1, y: i % 3 };
        grid.place(u, side === 'home' ? p : { x: 5 - p.x, y: p.y });
        units.push(u);
      });
    }
    const battle = new CombatEngine({
      units,
      grid,
      seed: 20261105,
      onEvent: (e) => app.battleEvent(e)
    });
    app.model.battle = battle;
    battle.encounterName = 'Yên Tử · giao chiến 6 đấu 6';
    battle.start();
    app.enterBattle();document.querySelector('#prebattle-dialog [data-start-battle]')?.click();
    const { sceneFor } = await import('/src/data/PresentationData.js');
    app.renderer.environment.src = sceneFor({ chapter: 11 });
    app.renderer.resize();
    app.renderer.render(0);
    await Promise.all(
      [...app.renderer.fighters.values(), app.renderer.environment].map((im) =>
        im.decode()
      )
    );
    app.renderer.render(0);
    window.__clip = { battle, renderer: app.renderer };
  });
  await page
    .locator('#battle-arena')
    .screenshot({ path: testInfo.outputPath('battle-six-versus-six.png') });
  const clip = await page.evaluate(async () => {
    const { battle, renderer } = window.__clip,
      stream = renderer.canvas.captureStream(24),
      chunks = [];
    const recorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
    recorder.ondataavailable = (e) => chunks.push(e.data);
    const stopped = new Promise((resolve) => (recorder.onstop = resolve));
    recorder.start();
    const began = performance.now();
    await new Promise((resolve) => {
      const frame = () => {
        // 2x simulated time, fixed-step combat; animation advances by display seconds.
        battle.update(1 / 12);
        renderer.render(1 / 24);
        if (performance.now() - began < 7000) setTimeout(frame, 1000 / 24);
        else resolve();
      };
      frame();
    });
    recorder.stop();
    await stopped;
    stream.getTracks().forEach((t) => t.stop());
    return Array.from(
      new Uint8Array(
        await new Blob(chunks, { type: 'video/webm' }).arrayBuffer()
      )
    );
  });
  expect(clip.length).toBeGreaterThan(10000);
  await writeFile(
    testInfo.outputPath('fighters-motion.webm'),
    Buffer.from(clip)
  );
});
