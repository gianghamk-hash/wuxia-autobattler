import { test, expect } from '@playwright/test';
async function start(page) {
  await page.goto('/');
  await expect(page.locator('#boot-status')).toBeHidden();
  await page.locator('[data-sect-pick="VoDang"]').click();
  await page.locator('#btn-new-game').click();
}
async function checkpoint(page, id) {
  await page.evaluate(async (id) => {
    const app = window.__game,
      { createCampaign } = await import('/src/core/Campaign.js'),
      { createHeroBuild } = await import('/src/entities/HeroBuild.js'),
      { MAIN_QUESTS } = await import('/src/data/QuestsData.js');
    const s = createCampaign({ sect: 'VoDang' }),
      q = MAIN_QUESTS.find((q) => q.id === id),
      at = MAIN_QUESTS.indexOf(q);
    s.hero = createHeroBuild({ sect: 'VoDang', level: 16 });
    s.hero.equippedGear = {
      weapon: 'starter_weapon',
      armor: 'starter_armor',
      accessory: 'starter_accessory'
    };
    s.party.unlocked = [
      'companion_01',
      'companion_02',
      'companion_03',
      'companion_04',
      'companion_05'
    ];
    s.companionsAffinity = Object.fromEntries(
      s.party.unlocked.map((id) => [id, 60])
    );
    Object.assign(s.storyProgress, {
      completedQuests: MAIN_QUESTS.slice(0, at).map((q) => q.id),
      activeQuestId: q.id,
      currentAct: q.act,
      currentChapter: q.chapter,
      currentEpisode: q.episode
    });
    app.model.load(s);
    app.model.setParty(s.party.unlocked);
    app.setView('camp');
    app.engine.stop();
  }, id);
}
async function fight(page) {
  await page.locator('#btn-main-quest').click();
  for (
    let i = 0;
    i < 100 && (await page.locator('#dialogue-next').isEnabled());
    i++
  )
    await page.locator('#dialogue-next').click();
  await page.locator('[data-choice]').first().click();
  await expect(page.locator('#view-battle')).toBeVisible();
}
async function advance(page, seconds) {
  await page.evaluate((seconds) => {
    const app = window.__game;
    for (let t = 0; t < seconds; t += 0.1) app.model.update(0.1);
    app.updateBattleStatus();
    app.renderer.render(0.1);
  }, seconds);
}
async function painting(page) {
  await page.evaluate(async () => {
    const r = window.__game.renderer;
    r.render(0);
    await Promise.all(
      [
        ...r.fighters.values(),
        ...r.companionImages.values(),
        r.environment,
        r.atlas
      ].map((i) => i.decode())
    );
    const draw = () => {
      r.render(1 / 60);
      requestAnimationFrame(draw);
    };
    requestAnimationFrame(draw);
    document.getElementById('app-message').dataset.visible = 'false';
  });
}
async function screenshot(page, path) {
  await page.evaluate(() => {
    document.getElementById('app-message').dataset.visible = 'false';
    window.scrollTo({ top: 0, behavior: 'instant' });
  });
  await page.screenshot({ path, fullPage: true, animations: 'disabled' });
}
test('casebook hides future evidence, supports accent-free search and opens read-only sources on mobile', async ({
  page
}, info) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await start(page);
  await page.locator('#btn-casebook').click();
  await expect(page.locator('[data-clue]')).toHaveCount(0);
  await expect(page.locator('#world-root')).not.toContainText('Trịnh Nghiêm');
  await checkpoint(page, 'C01H04');
  await page.locator('#btn-casebook').click();
  await expect(page.locator('[data-clue]')).toHaveCount(2);
  await page.getByLabel('Tìm trong sổ đầu mối').fill('ba tu');
  await expect(page.locator('[data-clue]')).toHaveCount(1);
  const before = await page.evaluate(() =>
    JSON.stringify({
      story: window.__game.model.session.storyProgress,
      items: window.__game.model.session.inventory
    })
  );
  await page
    .locator('.case-entry')
    .getByRole('button', { name: /Xem lại nguồn/ })
    .click();
  await expect(page.locator('[data-choice]')).toHaveCount(0);
  expect(
    await page.evaluate(() =>
      JSON.stringify({
        story: window.__game.model.session.storyProgress,
        items: window.__game.model.session.inventory
      })
    )
  ).toBe(before);
  await page
    .getByRole('button', { name: 'Về doanh trại', exact: true })
    .click();
  await page.getByRole('button', { name: 'Nhân vật', exact: true }).click();
  await expect(page.locator('[data-case-person="ba_tu"]')).toHaveCount(1);
  await expect(page.locator('[data-case-person="vu_binh"]')).toHaveCount(0);
  await page
    .locator('[data-case-person="ba_tu"]')
    .getByRole('button', { name: 'Bà Tư', exact: true })
    .click();
  await expect(page.locator('.case-person-modal')).toBeVisible();
  await expect(page.locator('.case-person-modal')).toContainText('biên nhận');
  await page.getByRole('button', { name: 'Đóng hồ sơ', exact: true }).click();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth
    )
  ).toBe(true);
  await screenshot(page, info.outputPath('casebook-mobile.png'));
});
test('casebook relationships and open questions use only completed sources, including archived answer links', async ({
  page
}, info) => {
  await start(page);
  await checkpoint(page, 'C09H01');
  await page.locator('#btn-casebook').click();
  await page.getByRole('button', { name: 'Quan hệ', exact: true }).click();
  await expect(page.locator('.case-relation')).toContainText([
    'Con gái',
    'Người bị lấy ruộng',
    'Con gái',
    'Người từng dẫn lính',
    'Vũ khí',
    'Cha'
  ]);
  await expect(page.locator('#world-root')).not.toContainText(
    'Người vận hành sân khấu'
  );
  await page.getByRole('button', { name: 'Cần xác minh', exact: true }).click();
  await expect(page.locator('#world-root')).toContainText('Chưa đủ bằng chứng');
  await screenshot(page, info.outputPath('casebook-questions.png'));
});
test('scouting is a read-only view of real enemies and explicit win/loss conditions at 320px', async ({
  page
}, info) => {
  await page.setViewportSize({ width: 320, height: 844 });
  await start(page);
  await checkpoint(page, 'C06H12');
  const before = await page.evaluate(() =>
    JSON.stringify(window.__game.model.snapshot())
  );
  await page.locator('#btn-main-quest').click();
  await expect(page.locator('.mission-brief-goal')).toContainText(
    'Mở ba chốt kho'
  );
  await page.locator('.battle-brief > summary').click();
  await expect(page.locator('.battle-brief')).toContainText('Thất bại:');
  const count = await page.evaluate(
    () => window.__game.model.scoutMain().enemies.length
  );
  await expect(page.locator('[data-scout]')).toHaveCount(count);
  // Showing the first dialogue page may update only reading history.
  const after = await page.evaluate(() => {
    const s = window.__game.model.snapshot();
    delete s.journey.reader;
    return s;
  });
  const expected = JSON.parse(before);
  delete expected.journey.reader;
  expect(after).toEqual(expected);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth
    )
  ).toBe(true);
  await screenshot(page, info.outputPath('scouting-mobile.png'));
});
test('rescue mission control, live intent, escort and rewards work together through the campaign', async ({
  page
}, info) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await start(page);
  await checkpoint(page, 'C04H02');
  await fight(page);
  await expect(page.locator('#mission-status')).toContainText(
    'Đưa người phu khỏi trại'
  );
  await page.locator('#btn-rescue-mission').click();
  await page.getByRole('button', { name: 'Xem mục tiêu', exact: true }).click();
  await expect(page.locator('#unit-sheet-content')).toContainText(
    'không dùng tuyệt kỹ'
  );
  await page.locator('[data-close-sheet="unit-sheet"]').click();
  expect(
    await page.evaluate(() => window.__game.model.battle.mission.helperId)
  ).toBe('hero');
  await advance(page, 0.5);
  await expect(page.locator('[data-intent="hero"]')).toContainText(
    /tiếp cận|giải cứu/
  );
  await painting(page);
  await screenshot(page, info.outputPath('rescue-mobile.png'));
  await advance(page, 110);
  await expect(page.locator('#battle-result')).toContainText('Chiến thắng');
  await expect(page.locator('.mission-result')).toContainText('Đã hoàn thành');
  expect(await page.evaluate(() => window.__game.model.lastResult.reason)).toBe(
    'objective_complete'
  );
});
test('three real lock targets support focus, an early objective victory and no duplicate settlement', async ({
  page
}, info) => {
  await start(page);
  await checkpoint(page, 'C06H12');
  await fight(page);
  await expect(page.locator('[data-focus^="mission_asset_"]')).toHaveCount(3);
  await page.locator('[data-focus="mission_asset_0"]').click();
  expect(await page.evaluate(() => window.__game.model.battle.focusId)).toBe(
    'mission_asset_0'
  );
  await painting(page);
  await screenshot(page, info.outputPath('breach-desktop.png'));
  const result = await page.evaluate(() => {
    const app = window.__game,
      b = app.model.battle;
    for (const asset of b.mission.assets)
      b.dealDamage(null, asset, 1e9, { damageType: 'true' });
    app.model.update(0.1);
    const before = JSON.stringify(app.model.snapshot());
    let refused = false;
    try {
      app.model.settleBattle();
    } catch {
      refused = true;
    }
    return {
      refused,
      stable: before === JSON.stringify(app.model.snapshot()),
      enemyAlive: b.units.some(
        (u) => u.team === 'enemy' && !u.missionAsset && u.alive
      )
    };
  });
  expect(result).toEqual({ refused: true, stable: true, enemyAlive: true });
  await expect(page.locator('.mission-result')).toContainText('3/3');
});
test('mission checkpoint resumes with its seed; losing the cart preserves the current quest and gives no rewards', async ({
  page
}) => {
  await start(page);
  await checkpoint(page, 'C01H14');
  await fight(page);
  const pending = await page.evaluate(
    () => window.__game.model.session.storyProgress.pendingEncounter
  );
  await expect
    .poll(() =>
      page.evaluate(async () => {
        const { StorageManager } = await import('/src/core/StorageManager.js');
        const s = new StorageManager();
        try {
          return (await s.load(0))?.data.storyProgress.pendingEncounter
            ?.missionId;
        } finally {
          s.db?.close();
        }
      })
    )
    .toBe('C01H14');
  await page.reload();
  await expect(page.locator('#boot-status')).toBeHidden();
  await page.locator('#btn-continue').click();
  await page.evaluate(() => window.__game.engine.stop());
  await page.locator('#btn-resume-battle').click();
  expect(await page.evaluate(() => window.__game.model.battle.seed)).toBe(
    pending.seed
  );
  await page.evaluate(() => {
    const app = window.__game;
    app.model.battle.mission.assets[0].stats.hp = 0;
    app.model.update(0.1);
  });
  await expect(page.locator('.mission-result')).toContainText(
    'Mục tiêu chưa hoàn thành'
  );
  expect(
    await page.evaluate(() => ({
      quest: window.__game.model.session.storyProgress.activeQuestId,
      rewards: window.__game.model.lastResult.rewards
    }))
  ).toEqual({ quest: 'C01H14', rewards: { xp: 0, silver: 0 } });
});
