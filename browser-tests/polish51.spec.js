import {test,expect} from '@playwright/test';
async function fresh(page){await page.goto('/');await expect(page.locator('#boot-status')).toBeHidden();await page.locator('#hero-name').fill('Hải An');await page.locator('#btn-new-game').click();await page.evaluate(()=>window.__game.engine.stop());}
for(const width of [320,390,1280])test('camp is focused; relocated shop keeps one working purchase handler across tabs at '+width+'px',async({page},info)=>{
 await page.setViewportSize({width,height:900});const errors=[];page.on('pageerror',e=>errors.push(e.message));await fresh(page);
 await expect(page.locator('#view-camp .party-panel,#party-summary,#btn-camp-roster,#view-camp .training-card,#view-camp .shop-card')).toHaveCount(0);
 await page.locator('.main-nav [data-view="dungeons"]').click();await expect(page.locator('#view-dungeons .training-card')).toContainText('RÈN LUYỆN MỖI NGÀY');await expect(page.locator('#btn-practice')).toBeDisabled();
 await page.locator('.main-nav [data-view="tavern"]').click();await expect(page.locator('[data-shop-menu="gear"]')).toBeVisible();await page.locator('[data-shop-menu="store"]').click();await expect(page.locator('#roadside-shop')).toBeVisible();await expect(page.locator('#world-tabs').getByRole('button',{name:'Quán & Rèn',exact:true})).toHaveAttribute('aria-pressed','true');
 const inventory=()=>page.evaluate(()=>{const s=window.__game.model.session;return{silver:s.inventory.filter(i=>i.itemId==='silver').reduce((n,i)=>n+i.quantity,0),rope:s.inventory.filter(i=>i.itemId==='rope').reduce((n,i)=>n+i.quantity,0)};});
 const before=await inventory();await page.locator('#roadside-shop [data-buy="rope"]').click();expect(await inventory()).toEqual({silver:before.silver-5,rope:before.rope+1});
 for(let i=0;i<3;i++){await page.locator('#world-tabs').getByRole('button',{name:'Nhật ký',exact:true}).click();await expect(page.locator('#roadside-shop')).toHaveCount(0);await page.locator('#world-tabs').getByRole('button',{name:'Quán & Rèn',exact:true}).click();}
 await page.locator('#roadside-shop [data-buy="rope"]').click();expect(await inventory()).toEqual({silver:before.silver-10,rope:before.rope+2});await expect(page.locator('#shop-inventory')).toContainText(`Bạc ${before.silver-10}`);
 const icons=await page.locator('#roadside-shop img.game-icon').evaluateAll(els=>Promise.all(els.map(async e=>{await e.decode();return{loaded:e.naturalWidth>0,decorative:e.alt===''&&e.getAttribute('aria-hidden')==='true'};})));expect(icons.every(i=>i.loaded&&i.decorative)).toBe(true);expect(await page.locator('svg.game-icon').count()).toBe(0);expect(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1)).toBe(false);
 await page.screenshot({path:info.outputPath('shop-'+width+'.png'),fullPage:true,animations:'disabled'});expect(errors).toEqual([]);
});
test('all rendered icon assets have alpha and actual color, and ten portraits load their scenery revision everywhere',async({page},info)=>{
 await fresh(page);const report=await page.evaluate(async()=>{
  const{ICON_NAMES,icon,portrait}=await import('/src/ui/Visuals.js'),{COMPANIONS_BY_ID}=await import('/src/data/CompanionsData.js'),{portraitURL}=await import('/src/data/ArtURLs.js');const checks=[];
  for(const name of ICON_NAMES){const im=icon(name);await im.decode();const canvas=document.createElement('canvas');canvas.width=canvas.height=96;const c=canvas.getContext('2d');c.drawImage(im,0,0,96,96);const d=c.getImageData(0,0,96,96).data;let transparent=0,color=0;for(let i=0;i<d.length;i+=4){if(d[i+3]<10)transparent++;if(d[i+3]>100&&Math.max(d[i],d[i+1],d[i+2])-Math.min(d[i],d[i+1],d[i+2])>30)color++;}checks.push({name,width:im.naturalWidth,transparent,color});}
  const people=[];for(let n=51;n<=60;n++){const p=COMPANIONS_BY_ID['companion_'+n],im=new Image();im.src=portraitURL(p.portrait);await im.decode();const card=portrait(p);people.push({id:p.id,width:im.naturalWidth,revision:card.style.backgroundImage.includes('art=5.1')});}
  return{checks,people};
 });expect(report.checks).toHaveLength(40);for(const r of report.checks){expect(r.width,r.name).toBe(96);expect(r.transparent,r.name).toBeGreaterThan(50);expect(r.color,r.name).toBeGreaterThan(100);}expect(report.people).toHaveLength(10);expect(report.people.every(p=>p.width===480&&p.revision)).toBe(true);
});
