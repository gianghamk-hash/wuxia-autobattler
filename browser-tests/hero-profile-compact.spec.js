import {test,expect} from './fixtures.js';
import {developed} from '../scripts/balance-campaign7.mjs';

async function openProfile(page){
 await page.goto('/');
 await expect(page.locator('#boot-status')).toBeHidden();
 await page.locator('#hero-name').fill('Hiệp khách thử nghiệm');
 await page.locator('#btn-new-game').click();
 await page.evaluate(s=>{
  const app=window.__game;
  app.engine.stop();
  app.model.load(s);
  app.hasLoaded=true;
  app.setView('profile');
 },developed({sect:'DuongMon'}).snapshot());
 await expect(page.locator('#view-profile')).toBeVisible();
}
for(const width of [390,1280]){
 test('full combat values are in the hero header, not buried below gear at '+width+'px',async({page})=>{
  await page.setViewportSize({width,height:900});
  await openProfile(page);
  const stats=page.locator('#profile-hero #hero-top-stats');
  await expect(stats).toBeVisible();
  await expect(stats.locator('.hero-top-stat')).toHaveCount(13);
  await expect(page.locator('#hero-all-stats')).toHaveCount(0);
  await expect(stats.locator('[data-stat-key="physicalAtk"]')).toContainText('Ngoại công');
  await stats.locator('[data-stat-key="physicalAtk"] > summary').click();
  await expect(stats.locator('[data-stat-key="physicalAtk"] .hero-top-stat-sources')).toContainText('Trang bị');
  const order=await page.evaluate(()=>{
   const banner=document.getElementById('hero-top-stats');
   const tabs=document.querySelector('.profile-tabs');
   return !!(banner.compareDocumentPosition(tabs)&Node.DOCUMENT_POSITION_FOLLOWING);
  });
  expect(order).toBe(true);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 });
}
test('mobile skill gallery uses true skill art, compact collapsed lists and correct learned counts',async({page})=>{
 await page.setViewportSize({width:390,height:850});await openProfile(page);
 await page.locator('#tab-skills').click();
 const panel=page.locator('#hero-skill-details');
 const attack=panel.locator('[data-skill-id="autoAttack"]');
 const ultimate=panel.locator('[data-skill-id="ultimate"]');
 await expect(attack.locator('img.hero-skill-icon')).toHaveAttribute('src',/hero_DuongMon_basic\.webp$/);
 await expect(ultimate.locator('img.hero-skill-icon')).toHaveAttribute('src',/skills7\/hero_DuongMon_(ult|t4_(attack|guard|balanced))\.webp$/);
 expect(await attack.locator('img').evaluate(async img=>{await img.decode();return img.naturalWidth>0;})).toBe(true);
 expect(await ultimate.locator('img').evaluate(async img=>{await img.decode();return img.naturalWidth>0;})).toBe(true);
 const learned=panel.locator('.hero-learned-drawer');
 await expect(learned).not.toHaveAttribute('open','');
 await expect(page.locator('.hero-tree-drawer')).not.toHaveAttribute('open','');
 await learned.locator('summary').first().click();
 const count=await page.evaluate(()=>window.__game.model.session.hero.allocatedSkills.length);
 await expect(learned.locator('.hero-skill-tile')).toHaveCount(count);
 const imgs=learned.locator('.hero-skill-icon');
 expect(await imgs.count()).toBe(count);
 const previews=await imgs.evaluateAll(async images=>Promise.all(images.map(async img=>{await img.decode();return img.naturalWidth>0;})));
 expect(previews.every(Boolean)).toBe(true);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});
