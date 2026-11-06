import {test,expect} from '@playwright/test';
import {writeFile} from 'node:fs/promises';
async function start(page) {await page.goto('/');await expect(page.locator('#boot-status')).toBeHidden();await page.locator('#hero-name').fill('Trần Phong');await page.locator('#btn-new-game').click();await page.evaluate(async()=>{
 const a=window.__game,{DAI_VIET_QUESTS}=await import('/src/data/DaiVietStoryData.js'),s=a.model.snapshot(),at=DAI_VIET_QUESTS.findIndex(q=>q.id==='D02H10'),done=DAI_VIET_QUESTS.slice(0,at);
 s.storyProgress.completedQuests=done.map(q=>q.id);s.storyProgress.decisions=Object.fromEntries(done.map(q=>[q.id,'continue']));Object.assign(s.storyProgress,{activeQuestId:'D02H10',currentChapter:2,currentEpisode:10,currentAct:1});a.model.load(s);a.model.joinSect('VoDang');a.engine.stop();a.setView('camp');
 });}
async function audit(page) {
 await expect.poll(()=>page.evaluate(()=>[...document.querySelectorAll('button,summary')].filter(b=>b.getClientRects().length&&!b.querySelector('img.game-icon')).map(b=>b.id||b.textContent.trim().slice(0,40)))).toEqual([]);
 const result=await page.evaluate(()=>{
  const visible=[...document.querySelectorAll('button,summary')].filter(b=>b.getClientRects().length&&getComputedStyle(b).visibility!=='hidden');
  return {overflow:document.documentElement.scrollWidth>innerWidth,small:visible.filter(b=>b.getBoundingClientRect().height<43.5).map(b=>({id:b.id,text:b.textContent.trim().slice(0,30),h:b.getBoundingClientRect().height})),duplicates:visible.filter(b=>b.querySelectorAll(':scope > img[data-action-symbol]').length>1).map(b=>b.id),
   unnamed:visible.filter(b=>!((b.getAttribute('aria-label')??b.textContent).trim())).map(b=>b.id)};
 });expect(result).toEqual({overflow:false,small:[],duplicates:[],unnamed:[]});
}
async function shot(page,info,name) {await page.evaluate(()=>{document.getElementById('app-message').dataset.visible='false';scrollTo({top:0,behavior:'instant'});});await page.screenshot({path:info.outputPath(name),animations:'disabled'});}
for(const width of [320,390,768,1280])test('all main screens and function icons remain operable at '+width+'px',async({page},info)=>{
 await page.setViewportSize({width,height:900});const errors=[];page.on('pageerror',e=>errors.push(e.message));await start(page);await audit(page);await shot(page,info,'camp-'+width+'.png');
 await page.locator('[data-view="roster"]').first().click();await expect(page.locator('#roster-pane-formation')).toBeVisible();await expect(page.locator('#companion-search')).toBeHidden();await audit(page);
 for(const id of ['companions','recruit','gacha','formation']){await page.locator('#roster-tab-'+id).click();await expect(page.locator('#roster-pane-'+id)).toBeVisible();await audit(page);}
 await page.locator('#roster-tab-companions').click();await expect(page.locator('#companion-search')).toBeVisible();await page.locator('#companion-search').fill('Lão Tam');await page.locator('#roster-tab-formation').click();await expect(page.locator('#companion-search')).toBeHidden();
 await shot(page,info,'formation-'+width+'.png');
 await page.locator('[data-view="profile"]').first().click();
 for(const id of ['skills','attributes','gear']){await page.locator('[data-profile-tab="'+id+'"]').click();await audit(page);}
 await page.locator('[data-view="tavern"]').first().click();
 for(const label of ['Hoạt động','Quán & Rèn','Đại hội','Bang hội','Truyện ký','Sổ đầu mối','Đồng hành','Người đã gặp','Nhật ký']){
  await page.locator('#world-tabs').getByRole('button',{name:label,exact:true}).click();await audit(page);
 }
 await shot(page,info,'world-'+width+'.png');
 for(const view of ['dungeons','codex','saves','settings']){await page.evaluate(view=>window.__game.setView(view),view);await audit(page);if(view==='saves')await shot(page,info,'saves-'+width+'.png');}
 await page.locator('#btn-more').click();await expect(page.locator('#menu-sheet')).toBeVisible();await audit(page);await page.locator('[data-close-sheet="menu-sheet"]').click();expect(errors).toEqual([]);
});
test('roster tabs support keyboard, retain saved formations and reveal recruitment without spending silver',async({page})=>{
 await start(page);await page.locator('.main-nav [data-view="roster"]').click();const before=await page.evaluate(()=>JSON.stringify(window.__game.model.session.inventory));
 await page.locator('#roster-tab-formation').focus();await page.keyboard.press('ArrowRight');await expect(page.locator('#roster-tab-companions')).toHaveAttribute('aria-selected','true');await expect(page.locator('#roster-pane-formation')).toBeHidden();
 await page.keyboard.press('ArrowRight');await expect(page.locator('#recruit-list')).toBeVisible();await page.keyboard.press('End');await expect(page.locator('#gacha-root')).toBeVisible();await page.keyboard.press('Home');
 await page.getByLabel('Tên đội 1').fill('Đội thuận tay');await page.locator('#journey-roster').getByRole('button',{name:'Lưu đội',exact:true}).first().click();
 await expect(page.getByLabel('Tên đội 1')).toHaveValue('Đội thuận tay');expect(await page.evaluate(()=>JSON.stringify(window.__game.model.session.inventory))).toBe(before);
 await audit(page);
});
test('profile tab, list scroll and casebook search survive normal navigation; icon decoration does not alter game state',async({page})=>{
 await page.setViewportSize({width:390,height:844});await start(page);await page.locator('[data-view="profile"]').first().click();await page.locator('[data-profile-tab="skills"]').click();await page.evaluate(()=>scrollTo(0,700));await expect.poll(()=>page.evaluate(()=>scrollY)).toBeGreaterThan(300);
 await page.evaluate(()=>window.__game.setView('camp'));await page.evaluate(()=>window.__game.setView('profile'));
 await expect(page.locator('[data-profile-tab="skills"]')).toHaveAttribute('aria-selected','true');await expect.poll(()=>page.evaluate(()=>scrollY)).toBeGreaterThan(300);
 await page.evaluate(()=>window.__game.setView('camp'));await page.locator('#btn-casebook').click();await page.getByLabel('Tìm trong sổ đầu mối').fill('bến Liễu');await page.evaluate(()=>window.__game.setView('camp'));await page.locator('#btn-casebook').click();await expect(page.getByLabel('Tìm trong sổ đầu mối')).toHaveValue('bến Liễu');
 const before=await page.evaluate(()=>JSON.stringify(window.__game.model.snapshot()));await page.evaluate(async()=>{
  const {decorateAction}=await import('/src/ui/ActionIcons.js');for(let i=0;i<20;i++)document.querySelectorAll('button,summary').forEach(decorateAction);
 });expect(await page.evaluate(()=>JSON.stringify(window.__game.model.snapshot()))).toBe(before);await audit(page);
});
test('manual ultimate is a one-tap queued order with the real energy gate, and battle shortcuts do not interrupt combat',async({page},info)=>{
 await start(page);await page.locator('.main-nav [data-view="dungeons"]').click();await page.locator('#btn-practice').click();await expect(page.locator('#view-battle')).toBeVisible();
 await page.locator('#btn-battle-mode').click();await page.evaluate(()=>window.__game.updateBattleStatus());
 const cast=page.locator('[data-manual-ultimate="hero"]');await expect(cast).toBeVisible();await expect(cast).toBeDisabled();
 await page.evaluate(()=>{const a=window.__game;a.model.battle.units.find(u=>u.id==='hero').stats.energy=100;a.updateBattleStatus();});await expect(cast).toBeEnabled();await cast.click();
 expect(await page.evaluate(()=>window.__game.model.battle.manualOrders.has('hero'))).toBe(true);
 const state=await page.evaluate(()=>({seed:window.__game.model.battle.seed,token:window.__game.model.battleToken}));
 await page.getByRole('button',{name:'Tướng & ý đồ',exact:true}).click();await page.getByRole('button',{name:'Bàn đấu',exact:true}).click();
 expect(await page.evaluate(()=>({seed:window.__game.model.battle.seed,token:window.__game.model.battleToken}))).toEqual(state);
 await page.evaluate(()=>{const a=window.__game;for(let i=0;i<300&&a.model.running;i++)a.model.update(1/60);a.updateBattleStatus();a.renderer.render(.1);});
 expect(await page.evaluate(()=>window.__game.model.battle.records.get('hero').ultimates)).toBeGreaterThanOrEqual(1);await audit(page);await shot(page,info,'manual-battle.png');
});
test('all new portraits and nine six-pose sheets load with clean transparency and match the motion identity list',async({page},info)=>{
 await start(page);const result=await page.evaluate(async()=>{
  const rows=await(await fetch('/assets/images/ui-polish-manifest.json')).json(),{FIGHTERS}=await import('/src/data/PresentationData.js');
  const gallery=document.createElement('section');gallery.id='new-art-gallery';gallery.style.cssText='background:#153738;color:#eee;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px;padding:20px';
  document.body.replaceChildren(gallery);const checks=[];
  for(const row of rows){const img=new Image();img.src='/'+row.file;await img.decode();const card=document.createElement('figure');card.style.margin='0';const canvas=document.createElement('canvas');canvas.width=img.width;canvas.height=img.height;canvas.style.cssText='width:100%;height:230px;object-fit:contain;background:#b2c8ba';const c=canvas.getContext('2d');c.drawImage(img,0,0);
   let clear=0,cells=0;if(row.kind==='sprite'){const a=c.getImageData(0,0,canvas.width,canvas.height).data;for(let i=3;i<a.length;i+=4)if(a[i]<10)clear++;for(let y=0;y<2;y++)for(let x=0;x<3;x++){const p=c.getImageData(x*512,y*512,512,512).data;if(p.some((v,i)=>i%4===3&&v>200))cells++;}}
   const label=document.createElement('figcaption');label.textContent=row.id;card.append(canvas,label);gallery.append(card);checks.push({id:row.id,kind:row.kind,clear,cells,motion:FIGHTERS.includes(row.id)});
  }return{checks,count:FIGHTERS.length};
 });expect(result.count).toBe(27);expect(result.checks).toHaveLength(21);
 for(const c of result.checks.filter(c=>c.kind==='sprite')){expect(c.clear).toBeGreaterThan(700000);expect(c.cells).toBe(6);expect(c.motion).toBe(true);}
 await page.setViewportSize({width:1280,height:1000});await page.screenshot({path:info.outputPath('new-character-art.png'),fullPage:true,animations:'disabled'});
});
