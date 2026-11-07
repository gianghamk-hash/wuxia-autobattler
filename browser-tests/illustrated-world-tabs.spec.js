import {test,expect} from '@playwright/test';
async function ready(page){
 await page.goto('/');
 await expect(page.locator('#boot-status')).toBeHidden();
 await page.locator('#hero-name').fill('Kiểm tra thẻ ảnh');
 await page.locator('#btn-new-game').click();
 await page.evaluate(()=>{const a=window.__game;a.engine.stop();a.setView('tavern');});
}
for(const width of [320,390,768,1280]){
 test('all 12 main tabs have illustrated navigation at '+width+'px',async({page})=>{
  await page.setViewportSize({width,height:900});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await ready(page);
  const cards=page.locator('#world-tabs .world-image-card');
  await expect(cards).toHaveCount(12);
  await expect(cards.locator('img.world-image-art')).toHaveCount(12);
  const cols=await page.locator('#world-tabs').evaluate(e=>getComputedStyle(e).gridTemplateColumns.split(' ').length);
  expect(cols).toBe(width<700?2:width<900?3:width<1100?4:5);
  for(const card of await cards.all()){
   await card.scrollIntoViewIfNeeded();
   const pic=card.locator('.world-image-art');
   await expect.poll(()=>pic.evaluate(img=>img.complete&&img.naturalWidth>0)).toBe(true);
   expect(await card.getAttribute('aria-label')).toBeTruthy();
   expect(await card.locator('.world-image-caption strong').innerText()).toBeTruthy();
   expect(await card.locator('.world-image-caption small').innerText()).toBeTruthy();
  }
  for(const name of ['Boss chương','Điểm danh & Nhiệm vụ','Câu cá','Vận tiêu','Quán & Rèn','Đại hội','Võ Đạo Các','Truyện ký','Sổ đầu mối','Đồng hành','Người đã gặp','Nhật ký']){
   const b=page.locator('#world-tabs').getByRole('button',{name,exact:true});
   await b.click();
   await expect(b).toHaveAttribute('aria-pressed','true');
  }
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
  expect(errors).toEqual([]);
 });
}
