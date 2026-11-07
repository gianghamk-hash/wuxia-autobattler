import {test,expect} from '@playwright/test';
import {developed} from '../scripts/balance-campaign7.mjs';

async function open(page){
  await page.goto('/');
  await expect(page.locator('#boot-status')).toBeHidden();
  await page.locator('#hero-name').fill('Người thử Bí cảnh');
  await page.locator('#btn-new-game').click();
  await page.evaluate(s=>{const app=window.__game;app.model.load(s);app.engine.stop();app.setView('dungeons');},developed().snapshot());
}
for(const width of [320,390,1280]){
  test('illustrated dungeon cards and variable Bau Cua wagers at '+width+'px',async({page})=>{
    await page.setViewportSize({width,height:900});await open(page);
    const cards=page.locator('.dungeon-tile');
    await expect(cards).toHaveCount(5);
    await expect(page.locator('.dungeon-tile-image')).toHaveCount(5);
    for(const image of await cards.locator('img').all()){
      await image.scrollIntoViewIfNeeded();
      await expect.poll(()=>image.evaluate(im=>im.complete&&im.naturalWidth>0)).toBe(true);
    }
    const cols=await page.locator('.dungeon-card-grid').evaluate(e=>getComputedStyle(e).gridTemplateColumns.split(' ').length);
    expect(cols).toBe(width<700?2:3);
    await page.locator('[data-bau-quick="50"]').click();
    await expect(page.locator('#bau-stake')).toHaveValue('50');
    await page.locator('[data-bau-face="cua"]').click();
    await expect(page.locator('[data-bau-face="cua"]')).toHaveAttribute('aria-pressed','true');
    const balance=await page.evaluate(()=>window.__game.model.session.inventory.find(x=>x.itemId==='silver').quantity);
    await page.locator('[data-bau-play]').click();
    await expect(page.locator('.bau-die')).toHaveCount(3);
    await expect(page.locator('.bau-outcome')).toContainText('Cược: 50 bạc');
    await expect(page.locator('.bau-outcome')).toContainText('Trả thưởng:');
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
    const now=await page.evaluate(()=>window.__game.model.session.inventory.find(x=>x.itemId==='silver').quantity);
    const winning=await page.locator('.bau-die[data-winning="true"]').count();
    expect(now-balance).toBe(winning*100-50);
  });
}
