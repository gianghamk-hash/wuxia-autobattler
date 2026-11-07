import {test,expect} from './fixtures.js';

for(const width of [320,390])test('story extras follow dialogue, controls and choices at '+width+'px',async({page},info)=>{
 await page.setViewportSize({width,height:900});await page.goto('/');await expect(page.locator('#boot-status')).toBeHidden();await page.locator('#hero-name').fill('Giang Doan');await page.locator('#btn-new-game').click();await page.locator('#btn-main-quest').click();
 const root=page.locator('.classic-dialogue');await expect(root.locator('.classic-extras details')).toHaveCount(3);
 const order=await root.evaluate(e=>{const extra=e.querySelector('.classic-extras');return{last:e.lastElementChild===extra,afterText:Boolean(e.querySelector('#dialogue-advance').compareDocumentPosition(extra)&Node.DOCUMENT_POSITION_FOLLOWING),afterChoices:Boolean(e.querySelector('.dialogue-choices').compareDocumentPosition(extra)&Node.DOCUMENT_POSITION_FOLLOWING)};});expect(order).toEqual({last:true,afterText:true,afterChoices:true});
 await expect(page.locator('#dialogue-text')).toContainText('sét đánh cạnh giàn máy');await expect(page.locator('#dialogue-text')).toContainText('Giang Doan');
 const full=root.locator('.classic-extras details').filter({hasText:'Bản thoại đầy đủ · tùy chọn'});await full.locator('summary').click();await expect(full).toContainText('Tin nhắn của mẹ vẫn chưa trả lời.');await full.locator('summary').click();
 const first=await page.locator('#dialogue-text').textContent();await page.locator('#dialogue-next').click();await expect(root.locator('.dialogue-choices')).toBeVisible();await page.locator('#dialogue-previous').click();await expect(page.locator('#dialogue-text')).toHaveText(first);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1)).toBe(false);await page.screenshot({path:info.outputPath('dialogue-footer-'+width+'.png'),fullPage:true,animations:'disabled'});
});
