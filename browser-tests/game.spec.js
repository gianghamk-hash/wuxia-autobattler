import { test, expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';

async function ready(page) {
  await page.goto('/');
  await expect(page.locator('#boot-status')).toBeHidden();
}
async function start(page, name = 'Tiểu Hiệp') {
  await ready(page);
  await page.locator('#hero-name').fill(name);
  await page.locator('[data-sect-pick="VoDang"]').click();
  await page.locator('#btn-new-game').click();
  await expect(page.locator('#view-camp')).toBeVisible();
  await expect.poll(() => savedName(page)).toBe(name);
}
async function saves(page) {
  await page.locator('#btn-more').click();
  await page.locator('[data-view="saves"]').click();
  await expect(page.locator('#view-saves')).toBeVisible();
}
async function savedName(page) {
  return page.evaluate(async () => {
    const { StorageManager } = await import('/src/core/StorageManager.js');
    const storage = new StorageManager();
    try { return (await storage.load(0))?.data.hero.name; }
    finally { storage.db?.close(); }
  });
}
async function rename(page, name) {
  await page.locator('#save-name').fill(name);
  await page.locator('#save-name').press('Tab');
}
for (const width of [320, 390, 1280]) {
  test(`opening webtoon reads at ${width}px, switches to text without changing progress and enters battle`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height: 844 });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await start(page);
    await page.locator('#btn-main-quest').click();
    await expect(page.locator('.webtoon-panel')).toHaveCount(3);
    await expect.poll(() => page.locator('.webtoon-art img').evaluateAll(images => images.every(i => i.complete && i.naturalWidth > 0))).toBe(true);
    const before = await page.evaluate(() => JSON.stringify(window.__game.model.session.storyProgress));
    await page.getByRole('button', { name: 'Đọc dạng chữ', exact: true }).click();
    await expect(page.locator('.webtoon-panel')).toHaveCount(0);
    await expect(page.locator('.dialogue-line')).not.toHaveCount(0);
    await page.getByRole('button', { name: 'Xem truyện tranh', exact: true }).click();
    expect(await page.evaluate(() => JSON.stringify(window.__game.model.session.storyProgress))).toBe(before);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    await page.locator('.webtoon-panel-2').scrollIntoViewIfNeeded();
    await expect(page.locator('.webtoon-bubble')).toContainText('Quán chủ');
    await page.locator('#dialogue-root').screenshot({ path: testInfo.outputPath(`webtoon-${width}.png`), animations: 'disabled', style: '.app-header, .main-nav, #app-message { visibility: hidden !important; }' });
    await page.locator('[data-choice]').first().click();
    await expect(page.locator('#view-battle')).toBeVisible();
    expect(errors).toEqual([]);
  });
}
for (const backend of ['indexedDB', 'localStorage']) {
  test(`${backend}: two real tabs protect newer saves, export the unsaved branch and recover`, async ({ context, page }) => {
    if (backend === 'localStorage') await context.addInitScript(() => Object.defineProperty(window, 'indexedDB', { value: undefined }));
    await start(page, 'Ban đầu');
    await saves(page);
    const other = await context.newPage();
    await ready(other);
    await other.locator('#btn-title-saves').click();
    // A stops running while B is visible; no timer can hide the intentional conflict.
    await page.evaluate(() => window.__game.engine.stop());
    await rename(page, 'Bản mới từ A');
    await expect.poll(() => savedName(page)).toBe('Bản mới từ A');
    await rename(other, 'Bản riêng từ B');
    await expect(other.locator('#save-notice')).toBeVisible();
    await expect(other.locator('#save-notice-text')).toContainText('tab khác');
    await expect(other.locator('#btn-retry-save')).toBeDisabled();
    const downloaded = other.waitForEvent('download');
    await other.locator('#btn-rescue-export').click();
    const file = await downloaded;
    const encoded = await readFile(await file.path(), 'utf8');
    const exportedName = await other.evaluate(async text => {
      const { StorageManager } = await import('/src/core/StorageManager.js');
      return (await new StorageManager().decodeSave(text)).hero.name;
    }, encoded);
    expect(exportedName).toBe('Bản riêng từ B');
    expect(await savedName(other)).toBe('Bản mới từ A');
    other.once('dialog', d => d.accept());
    await other.locator('#btn-latest-save').click();
    await expect(other.locator('#save-notice')).toBeHidden();
    await other.locator('#btn-more').click();
    await other.locator('[data-view="saves"]').click();
    await rename(other, 'Tiếp tục ở B');
    await expect.poll(() => savedName(other)).toBe('Tiếp tục ở B');
  });
}
test('quota failure stays visible, preserves old save, permits export and retries successfully', async ({ context, page }) => {
  await context.addInitScript(() => {
    Object.defineProperty(window, 'indexedDB', { value: undefined });
    const original = Storage.prototype.setItem;
    Storage.prototype.setItem = function(key, value) {
      if (window.__failWrites && key === 'wuxia:save:v1:0') throw new DOMException('Kho lưu đầy', 'QuotaExceededError');
      return original.call(this, key, value);
    };
  });
  await start(page, 'Bản đã lưu');
  await saves(page);
  await page.evaluate(() => { window.__failWrites = true; });
  await rename(page, 'Bản chưa ghi được');
  await expect(page.locator('#save-notice')).toBeVisible();
  expect(await savedName(page)).toBe('Bản đã lưu');
  await expect(page.locator('#btn-retry-save')).toBeEnabled();
  const download = page.waitForEvent('download');
  await page.locator('#btn-rescue-export').click();
  await download;
  await expect(page.locator('#save-notice')).toBeVisible();
  await page.evaluate(() => { window.__failWrites = false; });
  await page.locator('#btn-retry-save').click();
  await expect.poll(() => savedName(page)).toBe('Bản chưa ghi được');
  await expect(page.locator('#save-notice')).toBeHidden();
});
test('real opening battle checkpoint resumes after reload; archive reading awards nothing', async ({ page }) => {
  await start(page);
  await page.locator('#btn-main-quest').click();
  await page.locator('[data-choice]').first().click();
  await expect(page.locator('#view-battle')).toBeVisible();
  const seed = await page.evaluate(() => window.__game.model.session.storyProgress.pendingEncounter.seed);
  await expect.poll(() => page.evaluate(async () => {
    const { StorageManager } = await import('/src/core/StorageManager.js');
    const storage = new StorageManager();
    const data = (await storage.load(0))?.data;
    storage.db?.close();
    return data?.storyProgress.pendingEncounter?.seed;
  })).toBe(seed);
  await page.reload();
  await expect(page.locator('#boot-status')).toBeHidden();
  await page.locator('#btn-continue').click();
  await page.locator('#btn-resume-battle').click();
  expect(await page.evaluate(() => window.__game.model.session.storyProgress.pendingEncounter.seed)).toBe(seed);
  await page.keyboard.press('3');
  await expect(page.locator('#battle-result-panel')).toBeVisible({ timeout: 40000 });
  await expect(page.locator('#battle-result')).toContainText('Chiến thắng');
  await page.locator('#btn-battle-camp').click();
  await page.locator('[data-view="tavern"]').first().click();
  await page.getByRole('button', { name: 'Truyện ký', exact: true }).click();
  const before = await page.evaluate(() => JSON.stringify({ inventory: window.__game.model.session.inventory, story: window.__game.model.session.storyProgress }));
  await page.locator('[data-episode="Q101"]').click();
  await expect(page.locator('.webtoon-panel')).toHaveCount(3);
  await expect(page.locator('[data-choice]')).toHaveCount(0);
  expect(await page.evaluate(() => JSON.stringify({ inventory: window.__game.model.session.inventory, story: window.__game.model.session.storyProgress }))).toBe(before);
});
