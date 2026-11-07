import {test,expect} from './fixtures.js';
import {developed} from '../scripts/balance-campaign7.mjs';
async function start(page){
 await page.goto('/');
 await expect(page.locator('#boot-status')).toBeHidden();
 await page.locator('#hero-name').fill('Nhân vật kiểm tra Quán');
 await page.locator('#btn-new-game').click();
 await page.evaluate(s=>{const app=window.__game;app.model.load(s);app.engine.stop();app.setView('tavern');},developed().snapshot());
 await page.locator('#world-tabs').getByRole('button',{name:'Quán & Rèn',exact:true}).click();
}
for(const width of [320,390,1280]){
 test('illustrated Quán cards, 80-gear image vault and preserved gacha at '+width+'px',async({page})=>{
  await page.setViewportSize({width,height:900});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await start(page);
  const nav=page.locator('.tavern-image-nav');
  await expect(nav.locator('.tavern-image-card')).toHaveCount(7);
  await expect(nav.locator('img.tavern-image-art')).toHaveCount(7);
  const columnCount=await nav.evaluate(el=>getComputedStyle(el).gridTemplateColumns.split(' ').length);
  expect(columnCount).toBe(width<700?2:4);
  await expect(page.locator('#equipment-panel .gacha-hero')).toBeVisible();
  await expect(page.locator('[data-equipment-draw="1"]')).toBeVisible();
  const oldHistory=await page.evaluate(()=>(window.__game.model.session.loot?.total??0));
  await page.locator('[data-equipment-draw="1"]').click();
  expect(await page.evaluate(()=>(window.__game.model.session.loot?.total??0))).toBe(oldHistory+1);
  await page.locator('[data-shop-menu="vault"]').click();
  const vault=page.locator('#equipment-vault');
  await expect(vault).toBeVisible();
  await expect(vault.locator('.vault-gear')).toHaveCount(80);
  await expect(vault.locator('.vault-gear img')).toHaveCount(80);
  const rarities=await vault.locator('.vault-gear').evaluateAll(nodes=>nodes.map(e=>e.dataset.gearRarity));
  const order={common:1,rare:2,excellent:3,exceptional:4};
  expect(rarities.every((r,i)=>i===0||order[rarities[i-1]]<=order[r])).toBe(true);
  await page.getByLabel('Lọc phẩm chất').selectOption('exceptional');
  await expect(vault.locator('.vault-gear')).toHaveCount(20);
  await page.getByLabel('Lọc loại trang bị').selectOption('helmet');
  await expect(vault.locator('.vault-gear')).toHaveCount(5);
  for(const img of await vault.locator('.vault-gear img').all()){
    await img.scrollIntoViewIfNeeded();
    await expect.poll(()=>img.evaluate(e=>e.complete&&e.naturalWidth>0)).toBe(true);
  }
  await page.locator('[data-shop-menu="train"]').click();
  await expect(page.locator('#tavern-active-panel')).toContainText('Tu luyện');
  await page.locator('[data-shop-menu="forge"]').click();
  await expect(page.locator('#tavern-active-panel')).toContainText('Rèn vũ khí');
  await page.locator('[data-shop-menu="alchemy"]').click();
  await expect(page.locator('#tavern-active-panel')).toContainText('Dưỡng Khí Đan');
  await page.locator('[data-shop-menu="news"]').click();
  await expect(page.locator('#tavern-active-panel')).toContainText('Tụ quán nghe tin');
  await page.locator('[data-shop-menu="store"]').click();
  await expect(page.locator('#roadside-shop [data-buy="rope"]')).toBeVisible();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
  expect(errors).toEqual([]);
 });
}
