import {test,expect} from './fixtures.js';
import {developed} from '../scripts/balance-campaign7.mjs';
for(const width of[320,390,1280])test('formation role tags stay readable and agree with roster and dossier at '+width+'px',async({page},info)=>{
 await page.setViewportSize({width,height:900});await page.goto('/');await expect(page.locator('#boot-status')).toBeHidden();await page.locator('#hero-name').fill('Đội thử vai trò');await page.locator('#btn-new-game').click();
 await page.evaluate(s=>{const a=window.__game;a.engine.stop();a.model.load(s);a.hasLoaded=true;a.setView('roster');},developed().snapshot());
 const buttons=page.locator('.formation-units button');await expect(buttons).toHaveCount(6);
 await expect(page.locator('.formation-cell[data-occupied="true"] .unit-role-tag')).toHaveCount(6);
 const labels=await buttons.locator('.unit-role-tag').allTextContents();expect(labels).toContain('Tiền tuyến');expect(labels).toContain('Hỗ trợ');expect(labels).toContain('Sát thương');
 for(const tag of await buttons.locator('.unit-role-tag').all()){await expect(tag).toBeVisible();expect(await tag.evaluate(e=>e.scrollWidth<=e.clientWidth+1)).toBe(true);}
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await page.screenshot({path:info.outputPath('formation-roles-'+width+'.png'),fullPage:true,animations:'disabled'});
 await page.locator('#roster-tab-companions').click();const card=page.locator('#roster-list .roster-card').first();const role=await card.locator('.unit-role-tag').textContent();await expect(card.locator('.unit-role-tag')).toBeVisible();await card.getByRole('button',{name:'Xem tướng',exact:true}).click();await expect(page.locator('#unit-sheet-content > .unit-role-tag')).toHaveText(role);
});
