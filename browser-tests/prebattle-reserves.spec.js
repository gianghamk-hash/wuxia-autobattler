import { test, expect } from '@playwright/test';
import { developed } from '../scripts/balance-campaign7.mjs';

async function enterReady(page, width=390) {
  await page.setViewportSize({ width, height: 844 });
  await page.goto('/');
  await expect(page.locator('#boot-status')).toBeHidden();
  await page.locator('#hero-name').fill('Đội khảo trận');
  await page.locator('#btn-new-game').click();
  await page.evaluate(s => {
    const app=window.__game;
    app.engine.stop();
    app.model.load(s);
    app.hasLoaded=true;
    app.model.practice();
    app.enterBattle();
  }, developed().snapshot());
  await expect(page.locator('#prebattle-dialog')).toBeVisible();
}
test('bench swaps a recruited reserve before battle without touching artwork', async ({page}) => {
  await enterReady(page);
  const ready=page.locator('#prebattle-dialog');
  await expect(ready.locator('[data-exit-ready]')).toBeVisible();
  const reserveId=await page.evaluate(()=>{
    const s=window.__game.model.session;
    return s.party.unlocked.find(id=>!s.party.active.includes(id));
  });
  const oldId='companion_05';
  await ready.locator('[data-ready-unit="'+oldId+'"]').click();
  await ready.locator('[data-reserve-id="'+reserveId+'"]').click();
  await expect(page.locator('#prebattle-dialog')).toBeVisible();
  expect(await page.evaluate(()=>window.__game.model.session.party.active.includes('companion_05'))).toBe(false);
  expect(await page.evaluate(id=>window.__game.model.session.party.active.includes(id),reserveId)).toBe(true);
  await expect(page.locator('#prebattle-dialog [data-ready-unit="'+reserveId+'"]')).toHaveCount(1);
  await page.locator('#prebattle-dialog [data-start-battle]').click();
  await expect(page.locator('#prebattle-dialog')).toHaveCount(0);
});
test('exit preserves pending encounter and resume reopens 8x4 board', async ({page}) => {
  await enterReady(page,320);
  const before=await page.evaluate(()=>window.__game.model.session.storyProgress.pendingEncounter.seed);
  await page.locator('[data-exit-ready]').click();
  await expect(page.locator('#prebattle-dialog')).toHaveCount(0);
  await expect(page.locator('#view-camp')).toBeVisible();
  await expect(page.locator('#btn-resume-battle')).toBeVisible();
  expect(await page.evaluate(()=>window.__game.model.session.storyProgress.pendingEncounter.seed)).toBe(before);
  await page.locator('#btn-resume-battle').click();
  await expect(page.locator('#prebattle-dialog')).toBeVisible();
});
